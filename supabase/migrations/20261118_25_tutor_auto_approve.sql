-- 2026-11-18 · New tutors go live the moment they apply (25).
-- Run after 24. Safe to run twice. Applied by the "Apply database migrations"
-- workflow.
--
-- 1. tutor_settings: one row. auto_approve (on): an application is approved
--    as soon as it is submitted, so the tutor's card is in the marketplace at
--    once. An admin can turn it off in Admin, Tutors; applications then wait
--    for review again, as before. Anyone may read it (the application page
--    says which applies); only admins change it, with set_tutor_auto_approve().
-- 2. approve_tutor_application(): the approval itself (the tutor's card, their
--    subjects and fees, a note to the tutor), shared by the admin's review and
--    by automatic approval. Internal: no one calls it directly.
-- 3. review_tutor_application(): as in 19, using (2).
-- 4. submit_tutor_application(): as in 19, with the same checks on every field
--    as the card editor (migration 20), since no one reads it first. Approved
--    at once while auto_approve is on, and admins are told a tutor joined. A
--    tutor whose card an admin removed is not put back by applying again.
-- 5. Applications already waiting are approved now.
--
-- To undo: turn automatic approval off in Admin, Tutors (or
-- update public.tutor_settings set auto_approve = false), then re-run
-- review_tutor_application and submit_tutor_application from 19, and
-- drop function public.approve_tutor_application(uuid, uuid, text),
-- drop function public.set_tutor_auto_approve(boolean), drop table public.tutor_settings.

begin;

-- 1 · The setting ───────────────────────────────────────────────────────────
create table if not exists public.tutor_settings (
  id boolean primary key default true check (id),
  auto_approve boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
insert into public.tutor_settings (id) values (true) on conflict (id) do nothing;

alter table public.tutor_settings enable row level security;
drop policy if exists "Anyone reads tutor settings" on public.tutor_settings;
create policy "Anyone reads tutor settings" on public.tutor_settings for select to anon, authenticated using (true);
revoke all on public.tutor_settings from public, anon, authenticated;
grant select (auto_approve) on public.tutor_settings to anon, authenticated;

create or replace function public.set_tutor_auto_approve(p_on boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Not authorised'; end if;
  if p_on is null then raise exception 'Choose on or off'; end if;
  update public.tutor_settings set auto_approve = p_on, updated_at = now(), updated_by = auth.uid() where id;
end $$;

-- 2 · Approving an application ──────────────────────────────────────────────
create or replace function public.approve_tutor_application(p_application_id uuid, p_actor uuid, p_note text default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_app public.tutor_applications%rowtype; v_tutor uuid;
begin
  update public.tutor_applications
     set status = 'approved', reviewer_id = p_actor, review_note = left(p_note, 1000), reviewed_at = now(), updated_at = now()
   where id = p_application_id
  returning * into v_app;
  if not found then raise exception 'Application not found'; end if;

  insert into public.tutors (user_id, full_name, phone, bio, qualifications, experience_years, location, teaching_mode, avatar_path)
  values (v_app.user_id, v_app.full_name, v_app.phone, v_app.bio, v_app.qualifications, v_app.experience_years, v_app.location, 'in_person', v_app.avatar_path)
  on conflict (user_id) do update
     set full_name = excluded.full_name, phone = excluded.phone, bio = excluded.bio, qualifications = excluded.qualifications,
         experience_years = excluded.experience_years, location = excluded.location, teaching_mode = 'in_person',
         avatar_path = excluded.avatar_path, status = 'active', updated_at = now()
  returning id into v_tutor;

  insert into public.tutor_subjects as ts (tutor_id, subject_id, price_nle, lessons_per_week)
  select v_tutor, s.subject_id, s.price_nle, s.lessons_per_week
    from public.tutor_application_subjects s where s.application_id = p_application_id
  on conflict (tutor_id, subject_id) do update
     set price_nle = excluded.price_nle, lessons_per_week = coalesce(excluded.lessons_per_week, ts.lessons_per_week);

  insert into public.user_notifications (recipient_id, actor_id, event_type, title, body, entity_type, entity_id)
  values (v_app.user_id, p_actor, 'tutor_approved', 'Your tutor card is live',
          'Your tutor card is now in the marketplace, so students can find you and message you on WhatsApp. On your tutor dashboard you can edit your card, add a discount for several subjects, take small groups, and show how students can pay you.',
          'tutor_application', p_application_id);
  return v_tutor;
end $$;

-- 3 · An admin's review ─────────────────────────────────────────────────────
create or replace function public.review_tutor_application(p_application_id uuid, p_decision text, p_note text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare v_app public.tutor_applications%rowtype;
begin
  if not public.is_admin() then raise exception 'Not authorised'; end if;
  if p_decision not in ('approved', 'rejected', 'under_review') then raise exception 'Invalid decision'; end if;
  select * into v_app from public.tutor_applications where id = p_application_id for update;
  if not found then raise exception 'Application not found'; end if;
  if v_app.status not in ('submitted', 'under_review') then raise exception 'Application has already been reviewed'; end if;
  if p_decision = 'approved' then
    perform public.approve_tutor_application(p_application_id, auth.uid(), p_note);
    return;
  end if;
  update public.tutor_applications
     set status = p_decision, reviewer_id = auth.uid(), review_note = left(p_note, 1000), reviewed_at = now(), updated_at = now()
   where id = p_application_id;
  if p_decision = 'rejected' then
    insert into public.user_notifications (recipient_id, actor_id, event_type, title, body, entity_type, entity_id)
    values (v_app.user_id, auth.uid(), 'tutor_rejected', 'Tutor application update',
            coalesce(nullif(btrim(p_note), ''), 'Your tutor application was not approved. You may contact support.'),
            'tutor_application', p_application_id);
  end if;
end $$;

-- 4 · Applying ──────────────────────────────────────────────────────────────
create or replace function public.submit_tutor_application(
  p_full_name text, p_phone text, p_bio text, p_qualifications text,
  p_experience_years integer, p_location text, p_teaching_mode text,
  p_document_path text, p_avatar_path text, p_subjects jsonb
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_id uuid; v_item jsonb; v_subject uuid; v_price numeric; v_lessons integer;
  v_auto boolean; v_name text := btrim(coalesce(p_full_name, ''));
  v_digits text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
begin
  if v_uid is null then raise exception 'Sign in required'; end if;
  if exists (select 1 from public.tutors t where t.user_id = v_uid and t.status = 'suspended') then
    raise exception 'WASSCE Tutor removed your tutor card from the marketplace. Contact support to restore it.';
  end if;
  if exists (select 1 from public.tutor_applications a where a.user_id = v_uid and a.status in ('submitted', 'under_review', 'approved')) then
    raise exception 'An application is already active for this account';
  end if;

  -- The same limits as the tutor's card editor (migration 20).
  if length(v_name) not between 2 and 120 then raise exception 'Enter your full name'; end if;
  if length(v_digits) not between 8 and 15 then raise exception 'Enter your WhatsApp number, for example 077 123 456'; end if;
  if length(btrim(coalesce(p_location, ''))) not between 2 and 120 then raise exception 'Enter the town or area where you teach'; end if;
  if p_experience_years is null or p_experience_years not between 0 and 60 then raise exception 'Years of experience must be between 0 and 60'; end if;
  if length(btrim(coalesce(p_qualifications, ''))) not between 10 and 2000 then raise exception 'Enter your qualifications (at least 10 characters)'; end if;
  if length(btrim(coalesce(p_bio, ''))) not between 80 and 2000 then raise exception 'Write 80 to 2,000 characters about how you teach'; end if;

  if jsonb_typeof(p_subjects) is distinct from 'array' or jsonb_array_length(p_subjects) < 1 or jsonb_array_length(p_subjects) > 12 then
    raise exception 'Select between 1 and 12 subjects';
  end if;
  if p_document_path is not null and (
    split_part(p_document_path, '/', 1) <> v_uid::text
    or not exists (select 1 from storage.objects o where o.bucket_id = 'tutor-verification-docs' and o.name = p_document_path)
  ) then raise exception 'Invalid qualification document'; end if;
  if p_avatar_path is null then raise exception 'Add a profile photo: students see it on your tutor card'; end if;
  if split_part(p_avatar_path, '/', 1) <> v_uid::text
     or not exists (select 1 from storage.objects o where o.bucket_id = 'tutor-profile-images' and o.name = p_avatar_path)
  then raise exception 'Invalid profile photograph'; end if;

  insert into public.tutor_applications (user_id, full_name, phone, bio, qualifications, experience_years, location, teaching_mode, document_path, avatar_path)
  values (v_uid, v_name, btrim(p_phone), btrim(p_bio), btrim(p_qualifications), p_experience_years, btrim(p_location), 'in_person', p_document_path, p_avatar_path)
  returning id into v_id;

  for v_item in select value from jsonb_array_elements(p_subjects) loop
    v_subject := (v_item->>'subject_id')::uuid;
    v_price := (v_item->>'price_nle')::numeric;
    v_lessons := (v_item->>'lessons_per_week')::integer;
    if v_price is null or v_price <= 0 or v_price > 999999 or not exists (select 1 from public.subjects s where s.id = v_subject) then
      raise exception 'Each subject needs a monthly fee above NLe 0';
    end if;
    if v_lessons is null or v_lessons not between 1 and 7 then
      raise exception 'Choose how many lessons a week for each subject (1 to 7)';
    end if;
    insert into public.tutor_application_subjects (application_id, subject_id, price_nle, lessons_per_week)
    values (v_id, v_subject, round(v_price, 2), v_lessons)
    on conflict do nothing;
  end loop;

  select s.auto_approve into v_auto from public.tutor_settings s where s.id;
  if coalesce(v_auto, false) then
    perform public.approve_tutor_application(v_id, v_uid, 'Approved automatically');
    insert into public.user_notifications (recipient_id, actor_id, event_type, title, body, entity_type, entity_id)
    select p.id, v_uid, 'tutor_joined', 'New tutor in the marketplace',
           v_name || ' joined as a tutor and is now in the marketplace (approved automatically). Check their card in Admin, Tutors, and remove it if anything is wrong.',
           'tutor_application', v_id
      from public.profiles p where p.is_admin;
  else
    insert into public.user_notifications (recipient_id, actor_id, event_type, title, body, entity_type, entity_id)
    select p.id, v_uid, 'tutor_application_submitted', 'New tutor application',
           'New tutor application from ' || v_name || '. Review it in Admin, Tutors.', 'tutor_application', v_id
      from public.profiles p where p.is_admin;
  end if;
  return v_id;
end $$;

-- Who may call what ─────────────────────────────────────────────────────────
revoke all on function public.approve_tutor_application(uuid, uuid, text) from public, anon, authenticated;
revoke all on function public.set_tutor_auto_approve(boolean) from public, anon;
grant execute on function public.set_tutor_auto_approve(boolean) to authenticated;
revoke all on function public.review_tutor_application(uuid, text, text) from public, anon;
grant execute on function public.review_tutor_application(uuid, text, text) to authenticated;
revoke all on function public.submit_tutor_application(text, text, text, text, integer, text, text, text, text, jsonb) from public, anon;
grant execute on function public.submit_tutor_application(text, text, text, text, integer, text, text, text, text, jsonb) to authenticated;

-- 5 · Applications already waiting go live now ──────────────────────────────
-- Not for anyone whose card an admin removed.
do $$
declare r record;
begin
  for r in
    select a.id from public.tutor_applications a
     where a.status in ('submitted', 'under_review')
       and not exists (select 1 from public.tutors t where t.user_id = a.user_id and t.status = 'suspended')
     order by a.created_at
  loop
    perform public.approve_tutor_application(r.id, null, 'Approved automatically');
  end loop;
end $$;

commit;
