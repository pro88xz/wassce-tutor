-- 2026-11-16 · Tutors edit and publish their card; admins remove tutors (20).
-- Run after 19. Safe to run twice. Applied by the "Apply database migrations"
-- workflow.
--
-- 1. tutors.listed: the tutor's own switch. A tutor who is full (or away)
--    hides their card, and shows it again when they can take students. An
--    admin's removal (status 'suspended') is separate and wins over it.
--    Visitors see a tutor only when it is active and listed.
-- 2. update_tutor_card(): the tutor edits their card (about, area,
--    qualifications, years of experience) and publishes it at once. The name
--    stays as verified. If the qualifications change, admins are told, since
--    they were part of the review.
-- 3. set_tutor_status(): an admin removes a tutor from the marketplace, or
--    puts them back, with a reason the tutor is told.
-- 4. request_tutor(): a hidden tutor cannot be contacted.

begin;

-- 1 · The tutor's own switch ─────────────────────────────────────────────────
alter table public.tutors add column if not exists listed boolean not null default true;
grant select (listed) on public.tutors to anon, authenticated;

drop policy if exists "Public read active tutors" on public.tutors;
create policy "Public read active tutors" on public.tutors for select to anon, authenticated using (
  (status = 'active' and listed) or user_id = auth.uid() or public.is_admin()
);
drop policy if exists "Public read active tutor subjects" on public.tutor_subjects;
create policy "Public read active tutor subjects" on public.tutor_subjects for select to anon, authenticated using (
  exists (select 1 from public.tutors t where t.id = tutor_id and ((t.status = 'active' and t.listed) or t.user_id = auth.uid() or public.is_admin()))
);

create or replace function public.set_tutor_listed(p_listed boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare v_status text;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if p_listed is null then raise exception 'Choose to show or hide your card'; end if;
  select t.status into v_status from public.tutors t where t.user_id = auth.uid();
  if v_status is null then raise exception 'Approved tutor account required'; end if;
  if v_status <> 'active' then raise exception 'WASSCE Tutor removed your card from the marketplace. Contact support to restore it.'; end if;
  update public.tutors set listed = p_listed, updated_at = now() where user_id = auth.uid();
end $$;

-- 2 · Editing the card ───────────────────────────────────────────────────────
create or replace function public.update_tutor_card(
  p_bio text, p_location text, p_qualifications text, p_experience_years integer
) returns void language plpgsql security definer set search_path = '' as $$
declare v_tutor public.tutors%rowtype;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  select * into v_tutor from public.tutors t where t.user_id = auth.uid();
  if not found then raise exception 'Approved tutor account required'; end if;
  if length(btrim(coalesce(p_bio, ''))) not between 80 and 2000 then raise exception 'Write 80 to 2,000 characters about how you teach'; end if;
  if length(btrim(coalesce(p_location, ''))) not between 2 and 120 then raise exception 'Enter the town or area where you teach'; end if;
  if length(btrim(coalesce(p_qualifications, ''))) not between 10 and 2000 then raise exception 'Enter your qualifications (at least 10 characters)'; end if;
  if p_experience_years is null or p_experience_years not between 0 and 60 then raise exception 'Years of experience must be between 0 and 60'; end if;
  update public.tutors
     set bio = btrim(p_bio), location = btrim(p_location), qualifications = btrim(p_qualifications),
         experience_years = p_experience_years, teaching_mode = 'in_person', updated_at = now()
   where id = v_tutor.id;
  -- Qualifications were part of the review: tell the admins when they change.
  if btrim(p_qualifications) is distinct from v_tutor.qualifications then
    insert into public.user_notifications (recipient_id, actor_id, event_type, title, body, entity_type, entity_id)
    select p.id, auth.uid(), 'tutor_profile_changed', 'Tutor changed their qualifications',
           v_tutor.full_name || ' changed their qualifications from "' || left(v_tutor.qualifications, 300) || '" to "'
             || left(btrim(p_qualifications), 300) || '". Check them in Admin, Tutors.',
           'tutor', v_tutor.id
      from public.profiles p where p.is_admin;
  end if;
end $$;

-- 3 · Admins remove a tutor, or put them back ───────────────────────────────
drop function if exists public.set_tutor_status(uuid, text);
create or replace function public.set_tutor_status(p_tutor_id uuid, p_status text, p_reason text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare v_user uuid; v_reason text := nullif(btrim(coalesce(p_reason, '')), '');
begin
  if not public.is_admin() then raise exception 'Not authorised'; end if;
  if p_status not in ('active', 'suspended') then raise exception 'Invalid status'; end if;
  update public.tutors set status = p_status, updated_at = now() where id = p_tutor_id returning user_id into v_user;
  if v_user is null then raise exception 'Tutor not found'; end if;
  insert into public.user_notifications (recipient_id, actor_id, event_type, title, body, entity_type, entity_id)
  values (
    v_user, auth.uid(),
    case when p_status = 'active' then 'tutor_reactivated' else 'tutor_suspended' end,
    case when p_status = 'active' then 'Your tutor card is back' else 'Your tutor card was removed' end,
    case when p_status = 'active' then 'WASSCE Tutor put your tutor card back in the marketplace. Students can contact you again.'
         else 'WASSCE Tutor removed your tutor card from the marketplace, so students cannot contact you.'
              || coalesce(' Reason: ' || left(v_reason, 500) || '.', '') || ' Contact support if you have questions.' end,
    'tutor', p_tutor_id
  );
end $$;

-- 4 · A hidden tutor cannot be contacted ────────────────────────────────────
create or replace function public.request_tutor(p_tutor uuid, p_subjects uuid[], p_students integer default 1)
returns table (
  whatsapp text, tutor_name text, location text, subjects jsonb, students integer,
  subtotal numeric, subject_discount_pct integer, group_discount_pct integer,
  per_student numeric, total numeric
)
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_t public.tutors%rowtype;
  v_wanted uuid[];
  v_subjects jsonb; v_names text[]; v_count integer; v_subtotal numeric;
  v_sd integer; v_gd integer; v_per numeric; v_total numeric;
begin
  if v_uid is null then raise exception 'Sign in to contact a tutor'; end if;
  select * into v_t from public.tutors t where t.id = p_tutor and t.status = 'active';
  if not found then raise exception 'This tutor is not available at the moment'; end if;
  if not v_t.listed then raise exception 'This tutor is not taking new students at the moment'; end if;

  select array_agg(distinct x order by x) into v_wanted from unnest(p_subjects) x where x is not null;
  if v_wanted is null or cardinality(v_wanted) > 12 then raise exception 'Choose between 1 and 12 subjects'; end if;
  select jsonb_agg(jsonb_build_object('id', s.id, 'name', s.name, 'price_nle', ts.price_nle, 'lessons_per_week', ts.lessons_per_week) order by s.name),
         array_agg(s.name order by s.name), count(*), sum(ts.price_nle)
    into v_subjects, v_names, v_count, v_subtotal
    from public.tutor_subjects ts join public.subjects s on s.id = ts.subject_id
   where ts.tutor_id = p_tutor and ts.subject_id = any (v_wanted);
  if v_count is distinct from cardinality(v_wanted) then raise exception 'This tutor does not teach every subject you chose'; end if;

  if p_students is null or p_students < 1 or p_students > coalesce(v_t.group_max, 1) then
    raise exception '%', case when v_t.group_max is null then 'This tutor teaches one student at a time'
                              else 'This tutor teaches groups of up to ' || v_t.group_max || ' students' end;
  end if;

  -- Ten different tutors a day at most, so the numbers cannot be collected.
  if (select count(distinct c.tutor_id) from public.tutor_contacts c
       where c.student_id = v_uid and c.tutor_id <> p_tutor and c.created_at > now() - interval '1 day') >= 10 then
    raise exception 'You have contacted 10 tutors today. Please try again tomorrow.';
  end if;

  v_sd := case when v_count >= 2 then v_t.multi_subject_discount_pct else 0 end;
  v_gd := case when p_students >= 2 then v_t.group_discount_pct else 0 end;
  v_per := round(v_subtotal * (100 - v_sd) * (100 - v_gd) / 10000);
  v_total := v_per * p_students;

  -- Record it and tell the tutor once per identical request a day, and at
  -- most five requests a day from one student to one tutor.
  if not exists (
       select 1 from public.tutor_contacts c
        where c.student_id = v_uid and c.tutor_id = p_tutor and c.created_at > now() - interval '1 day'
          and c.students = p_students and c.subjects is not null
          and (select array_agg((e->>'id')::uuid order by (e->>'id')::uuid) from jsonb_array_elements(c.subjects) e) = v_wanted)
     and (select count(*) from public.tutor_contacts c
           where c.student_id = v_uid and c.tutor_id = p_tutor and c.created_at > now() - interval '1 day') < 5
  then
    insert into public.tutor_contacts (tutor_id, student_id, subject_id, price_nle, subjects, students, total_nle)
    values (p_tutor, v_uid, (v_subjects->0->>'id')::uuid, v_per, v_subjects, p_students, v_total);
    insert into public.user_notifications (recipient_id, actor_id, event_type, title, body, entity_type, entity_id)
    values (
      v_t.user_id, v_uid, 'tutor_contacted',
      case when p_students = 1 then 'A student wants lessons' else 'A group of ' || p_students || ' students wants lessons' end,
      case when p_students = 1 then 'A student' else 'A group of ' || p_students || ' students' end
        || ' agreed to your fee for ' || public.list_text(v_names) || ': ' || public.nle_text(v_per) || ' a month'
        || case when p_students > 1 then ' each (' || public.nle_text(v_total) || ' in total)' else '' end
        || case when v_sd > 0 and v_gd > 0 then ', with your ' || v_sd || '% subject and ' || v_gd || '% group discounts'
                when v_sd > 0 then ', with your ' || v_sd || '% discount for ' || v_count || ' subjects'
                when v_gd > 0 then ', with your ' || v_gd || '% group discount'
                else '' end
        || '. They are opening WhatsApp to message you.',
      'tutor', p_tutor
    );
  end if;

  return query select public.whatsapp_digits(v_t.phone), v_t.full_name, v_t.location, v_subjects, p_students,
                      v_subtotal, v_sd, v_gd, v_per, v_total;
end $$;

revoke all on function public.set_tutor_listed(boolean) from public, anon;
revoke all on function public.update_tutor_card(text, text, text, integer) from public, anon;
revoke all on function public.set_tutor_status(uuid, text, text) from public, anon;
revoke all on function public.request_tutor(uuid, uuid[], integer) from public, anon;
grant execute on function public.set_tutor_listed(boolean) to authenticated;
grant execute on function public.update_tutor_card(text, text, text, integer) to authenticated;
grant execute on function public.set_tutor_status(uuid, text, text) to authenticated;
grant execute on function public.request_tutor(uuid, uuid[], integer) to authenticated;

commit;

-- Rollback: drop function if exists public.set_tutor_listed(boolean), public.update_tutor_card(text, text, text, integer);
-- re-run request_tutor from 19, set_tutor_status from 14 (after dropping the 3-argument one) and the two
-- "Public read active ..." policies from 11; then alter table public.tutors drop column listed.
