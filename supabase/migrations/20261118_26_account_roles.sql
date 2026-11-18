-- 2026-11-18 · Every account knows what it is: student, tutor or affiliate (26).
-- Run after 25. Safe to run twice. Applied by the "Apply database migrations"
-- workflow.
--
-- profiles.account_role decides where someone lands after signing in, from
-- any page or sign-in method, and which screens and navigation they get.
-- Tutors and affiliates never land in the student app. People cannot change
-- it themselves (no update grant); the database sets it:
-- 1. On sign-up, from the account type chosen there (the tutor or affiliate
--    page), including Google sign-ups, which add the type just after the
--    account is created.
-- 2. When someone applies to teach or gets a tutor card: tutor.
-- 3. When someone opens an affiliate account and has never studied a lesson:
--    affiliate. A student who studies and also refers friends stays a student.
-- 4. Existing accounts get theirs now, by the same rules.
-- Admins keep is_admin as before; account_role is separate.
--
-- To undo: drop the triggers and functions below, re-run handle_new_user from
-- 13, and alter table public.profiles drop column account_role.

begin;

alter table public.profiles add column if not exists account_role text not null default 'student';
alter table public.profiles drop constraint if exists profiles_account_role_valid;
alter table public.profiles add constraint profiles_account_role_valid check (account_role in ('student', 'tutor', 'affiliate'));
-- Readable with the rest of one's own profile; never updatable by the account (migration 13 grants only some columns).

-- 1 · Sign-up ────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path to 'public' as $function$
begin
  insert into public.profiles (id, full_name, account_role)
  values (
    new.id,
    left(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), 120),
    case new.raw_user_meta_data->>'account_intent' when 'tutor' then 'tutor' when 'affiliate' then 'affiliate' else 'student' end
  );
  return new;
end;
$function$;

-- Google sign-ups get their account type a moment after the account exists.
-- Only a new account that has not set up as a student changes; nothing ever
-- turns back into a student account here.
create or replace function public.account_role_from_signup()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_intent text := new.raw_user_meta_data->>'account_intent';
begin
  if v_intent in ('tutor', 'affiliate') and v_intent is distinct from old.raw_user_meta_data->>'account_intent' then
    update public.profiles set account_role = v_intent
     where id = new.id and account_role = 'student' and not coalesce(onboarded, false);
  end if;
  return new;
end $$;
drop trigger if exists account_role_from_signup on auth.users;
create trigger account_role_from_signup after update of raw_user_meta_data on auth.users
  for each row execute function public.account_role_from_signup();

-- 2 · Tutors ─────────────────────────────────────────────────────────────────
create or replace function public.mark_tutor_account()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles set account_role = 'tutor' where id = new.user_id and account_role <> 'tutor';
  return new;
end $$;
drop trigger if exists tutor_application_marks_account on public.tutor_applications;
create trigger tutor_application_marks_account after insert on public.tutor_applications
  for each row execute function public.mark_tutor_account();
drop trigger if exists tutor_marks_account on public.tutors;
create trigger tutor_marks_account after insert on public.tutors
  for each row execute function public.mark_tutor_account();

-- 3 · Affiliates ─────────────────────────────────────────────────────────────
create or replace function public.mark_affiliate_account()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles p set account_role = 'affiliate'
   where p.id = new.user_id and p.account_role = 'student'
     and not exists (select 1 from public.lesson_progress lp where lp.profile_id = p.id);
  return new;
end $$;
drop trigger if exists affiliate_marks_account on public.affiliates;
create trigger affiliate_marks_account after insert on public.affiliates
  for each row execute function public.mark_affiliate_account();

revoke all on function public.account_role_from_signup() from public, anon, authenticated;
revoke all on function public.mark_tutor_account() from public, anon, authenticated;
revoke all on function public.mark_affiliate_account() from public, anon, authenticated;

-- 4 · Existing accounts ──────────────────────────────────────────────────────
update public.profiles p set account_role = 'tutor'
 where p.account_role <> 'tutor'
   and (exists (select 1 from public.tutors t where t.user_id = p.id)
        or exists (select 1 from public.tutor_applications a where a.user_id = p.id)
        or exists (select 1 from auth.users u where u.id = p.id and u.raw_user_meta_data->>'account_intent' = 'tutor'));

update public.profiles p set account_role = 'affiliate'
 where p.account_role = 'student'
   and (exists (select 1 from auth.users u where u.id = p.id and u.raw_user_meta_data->>'account_intent' = 'affiliate')
        or (exists (select 1 from public.affiliates a where a.user_id = p.id)
            and not exists (select 1 from public.lesson_progress lp where lp.profile_id = p.id)));

commit;
