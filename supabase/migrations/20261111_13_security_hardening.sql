-- 2026-11-11 · Security hardening, from a full audit of the live platform.
-- Run after 12. Safe to run twice. Nothing here changes what a student,
-- tutor or admin can legitimately do.
--
-- 1. tutors.phone was readable by anyone, logged out included: the public
--    "active tutors" policy returns whole rows. The site never shows it (the
--    marketplace reads named columns), so a script could have collected every
--    tutor's number. Now the phone column is not selectable through the API;
--    admins read it on the application, and the database functions that copy
--    it (review_tutor_application) are unaffected.
--    NOTE: "select *" on tutors through the API stops working; the app selects
--    named columns from this release on.
-- 2. profiles: students could write to any column the update policy did not
--    name (subscription_plan, and anything added later). Updates through the
--    API are now limited to the five columns the app edits. The existing
--    policy stays as a second lock. Names are capped at 120 characters.
-- 3. payment_requests accepted the retired prices, so a request for the yearly
--    plan at 25 NLe could be filed straight through the API and, if approved
--    by mistake, grant twelve months. New requests must be at today's price.
-- 4. tutor_messages: students could insert rows for themselves with any role,
--    including "system", which the AI tutor then read as instructions, and of
--    any length. The tutor function writes the history itself, so students no
--    longer insert at all; roles and length are checked.
-- 5. The AI tutor's daily limit was read, then written after the answer: many
--    requests sent at once all passed the check. consume_tutor_question()
--    takes a place in one statement, so the limit holds.
-- 6. Paying students could read lessons that are not published (drafts).
-- 7. Least privilege for logged-out visitors: no write privileges on any
--    table except the two they use (download counter, tutor request form),
--    so a future policy mistake cannot be exploited without signing in.
-- 8. Text sizes bounded on the one table logged-out visitors write freely.

begin;

-- 1 ─────────────────────────────────────────────────────────────────────────
revoke select on public.tutors from anon, authenticated;
grant select (id, user_id, full_name, bio, qualifications, experience_years, location,
              teaching_mode, avatar_path, status, verified_at, created_at, updated_at)
  on public.tutors to anon, authenticated;

-- 2 ─────────────────────────────────────────────────────────────────────────
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name, faculty_id, onboarded, public_bio, updated_at) on public.profiles to authenticated;

alter table public.profiles drop constraint if exists profiles_full_name_length;
alter table public.profiles add constraint profiles_full_name_length
  check (full_name is null or char_length(full_name) <= 120) not valid;

-- Sign-up copies the name from the form: trim and cap it so a long name can
-- never fail the insert (and with it the sign-up).
create or replace function public.handle_new_user()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  insert into public.profiles (id, full_name)
  values (new.id, left(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), 120));
  return new;
end;
$function$;

-- 3 ─────────────────────────────────────────────────────────────────────────
drop policy if exists "users insert own payment requests" on public.payment_requests;
create policy "users insert own payment requests" on public.payment_requests
  for insert to public
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and activated_at is null
    and activated_by is null
    and amount_nle = public.plan_price_nle(plan)   -- today's price (migration 09); null for unknown plans
  );

-- 4 ─────────────────────────────────────────────────────────────────────────
drop policy if exists "own messages insert" on public.tutor_messages;

alter table public.tutor_messages drop constraint if exists tutor_messages_role_allowed;
alter table public.tutor_messages add constraint tutor_messages_role_allowed
  check (role in ('user', 'assistant')) not valid;
alter table public.tutor_messages drop constraint if exists tutor_messages_content_length;
alter table public.tutor_messages add constraint tutor_messages_content_length
  check (char_length(content) <= 20000) not valid;

-- 5 ─────────────────────────────────────────────────────────────────────────
-- Takes one of today's tutor questions for p_user. Returns the new count, or
-- null when the limit is already reached. One statement, so two requests at
-- the same moment cannot both take the last place.
create or replace function public.consume_tutor_question(p_user uuid, p_limit integer)
 returns integer
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  v_count integer;
begin
  update public.profiles
     set tutor_questions_today = case
           when tutor_questions_date is distinct from current_date then 1
           else coalesce(tutor_questions_today, 0) + 1
         end,
         tutor_questions_date = current_date
   where id = p_user
     and (tutor_questions_date is distinct from current_date or coalesce(tutor_questions_today, 0) < p_limit)
  returning tutor_questions_today into v_count;
  return v_count;
end;
$function$;

-- Gives the place back when the answer could not be produced.
create or replace function public.refund_tutor_question(p_user uuid)
 returns void
 language sql
 security definer
 set search_path to ''
as $function$
  update public.profiles
     set tutor_questions_today = greatest(coalesce(tutor_questions_today, 0) - 1, 0)
   where id = p_user and tutor_questions_date = current_date;
$function$;

revoke all on function public.consume_tutor_question(uuid, integer) from public, anon, authenticated;
revoke all on function public.refund_tutor_question(uuid) from public, anon, authenticated;
grant execute on function public.consume_tutor_question(uuid, integer) to service_role;
grant execute on function public.refund_tutor_question(uuid) to service_role;

-- 6 ─────────────────────────────────────────────────────────────────────────
drop policy if exists "lessons readable by access holders" on public.lessons;
create policy "lessons readable by access holders" on public.lessons
  for select to public
  using (
    public.is_admin()
    or (is_published and (public.user_has_access() or public.is_free_lesson(id)))
  );

-- 7 ─────────────────────────────────────────────────────────────────────────
do $$
declare
  t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('revoke insert, update, delete, truncate, references, trigger on public.%I from anon', t.tablename);
    execute format('revoke truncate, references, trigger on public.%I from authenticated', t.tablename);
  end loop;
end $$;
-- The two things a logged-out visitor may write (their policies are unchanged).
grant insert on public.downloads, public.tutor_requests to anon;

-- 8 ─────────────────────────────────────────────────────────────────────────
alter table public.downloads drop constraint if exists downloads_user_agent_length;
alter table public.downloads add constraint downloads_user_agent_length
  check (user_agent is null or char_length(user_agent) <= 1024) not valid;
alter table public.downloads drop constraint if exists downloads_client_id_length;
alter table public.downloads add constraint downloads_client_id_length
  check (client_id is null or char_length(client_id) <= 128) not valid;

commit;

-- Checks (run after the migration; each should return what the comment says):
--   select has_column_privilege('anon', 'public.tutors', 'phone', 'select');            -- f
--   select has_column_privilege('authenticated', 'public.profiles', 'is_admin', 'update'); -- f
--   select has_table_privilege('anon', 'public.lessons', 'insert');                     -- f
--   select has_function_privilege('authenticated', 'public.consume_tutor_question(uuid, integer)', 'execute'); -- f
