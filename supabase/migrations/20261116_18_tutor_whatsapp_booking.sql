-- 2026-11-16 · Book a tutor on WhatsApp, in person only (18). Run after 17.
-- Safe to run twice. Applied by the "Apply database migrations" workflow.
--
-- Book a tutor becomes one simple flow: a student picks a verified tutor on
-- /tutors, sees the tutor's monthly fee for the subject, agrees, and WhatsApp
-- opens with a message to the tutor. Lessons are in person only: there is no
-- online lesson service, so nothing may suggest one.
--
-- 1. Every tutor and open application is set to in person.
-- 2. submit_tutor_application(): a profile photo is required; lessons are in person.
-- 3. update_tutor_profile(): in person; update_tutor_avatar(): tutors change their photo.
-- 4. contact_tutor(): for a signed-in student, checks the tutor and subject,
--    records the contact (tutor_contacts), tells the tutor, and returns the
--    tutor's WhatsApp number. Tutors' phone numbers stay unreadable through the
--    API (migration 13); this is the only way to one, one tutor at a time,
--    with a daily limit against scraping.
-- 5. my_tutor_contacts(): a tutor's recent contacts, for the tutor dashboard.
--
-- The old date-and-time booking requests (create_tutor_booking) are left in
-- place for any request already made, but the site no longer offers them.

begin;

-- 1 · In person only ─────────────────────────────────────────────────────────
update public.tutors set teaching_mode = 'in_person', updated_at = now() where teaching_mode <> 'in_person';
update public.tutor_applications set teaching_mode = 'in_person', updated_at = now()
 where teaching_mode <> 'in_person' and status in ('submitted', 'under_review');

-- 2 · Applications: photo required, in person ───────────────────────────────
create or replace function public.submit_tutor_application(
  p_full_name text, p_phone text, p_bio text, p_qualifications text,
  p_experience_years integer, p_location text, p_teaching_mode text,
  p_document_path text, p_avatar_path text, p_subjects jsonb
) returns uuid language plpgsql security definer set search_path=public,auth as $$
declare v_id uuid; v_item jsonb; v_subject uuid; v_price numeric;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if exists(select 1 from tutor_applications where user_id=auth.uid() and status in ('submitted','under_review','approved')) then
    raise exception 'An application is already active for this account';
  end if;
  if jsonb_typeof(p_subjects) <> 'array' or jsonb_array_length(p_subjects) < 1 or jsonb_array_length(p_subjects) > 12 then
    raise exception 'Select between 1 and 12 subjects';
  end if;
  if p_document_path is not null and (
    split_part(p_document_path,'/',1) <> auth.uid()::text
    or not exists(select 1 from storage.objects where bucket_id='tutor-verification-docs' and name=p_document_path)
  ) then raise exception 'Invalid qualification document'; end if;
  -- Students choose tutors by their photo: it is required.
  if p_avatar_path is null then raise exception 'Add a profile photo: students see it on your tutor card'; end if;
  if split_part(p_avatar_path,'/',1) <> auth.uid()::text
     or not exists(select 1 from storage.objects where bucket_id='tutor-profile-images' and name=p_avatar_path)
  then raise exception 'Invalid profile photograph'; end if;
  insert into tutor_applications(user_id,full_name,phone,bio,qualifications,experience_years,location,teaching_mode,document_path,avatar_path)
  values(auth.uid(),trim(p_full_name),trim(p_phone),trim(p_bio),trim(p_qualifications),p_experience_years,trim(p_location),'in_person',p_document_path,p_avatar_path)
  returning id into v_id;
  for v_item in select value from jsonb_array_elements(p_subjects) loop
    v_subject := (v_item->>'subject_id')::uuid;
    v_price := (v_item->>'price_nle')::numeric;
    if v_price is null or v_price <= 0 or not exists(select 1 from subjects where id=v_subject) then
      raise exception 'Each subject needs a monthly fee above NLe 0';
    end if;
    insert into tutor_application_subjects(application_id,subject_id,price_nle) values(v_id,v_subject,round(v_price,2));
  end loop;
  insert into user_notifications(recipient_id,actor_id,event_type,title,body,entity_type,entity_id)
  select p.id, auth.uid(), 'tutor_application_submitted', 'New tutor application',
         'New tutor application from '||trim(p_full_name)||'. Review it in Admin, Tutors.', 'tutor_application', v_id
  from profiles p where p.is_admin;
  return v_id;
end $$;

-- 3 · Profile: in person; photo ──────────────────────────────────────────────
create or replace function public.update_tutor_profile(p_bio text, p_location text, p_teaching_mode text)
returns void language plpgsql security definer set search_path=public,auth as $$
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if length(trim(p_bio)) not between 80 and 2000 or length(trim(p_location)) not between 2 and 120 then
    raise exception 'Invalid tutor profile details';
  end if;
  update tutors set bio=trim(p_bio), location=trim(p_location), teaching_mode='in_person', updated_at=now()
   where user_id=auth.uid() and status='active';
  if not found then raise exception 'Approved tutor account required'; end if;
end $$;

create or replace function public.update_tutor_avatar(p_avatar_path text)
returns void language plpgsql security definer set search_path=public,auth as $$
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if p_avatar_path is null
     or split_part(p_avatar_path,'/',1) <> auth.uid()::text
     or not exists(select 1 from storage.objects where bucket_id='tutor-profile-images' and name=p_avatar_path)
  then raise exception 'Invalid profile photograph'; end if;
  update tutors set avatar_path=p_avatar_path, updated_at=now() where user_id=auth.uid();
  if not found then raise exception 'Approved tutor account required'; end if;
end $$;

-- 4 · Contacting a tutor on WhatsApp ────────────────────────────────────────
create table if not exists public.tutor_contacts (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.tutors(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  price_nle numeric(10,2) not null,
  created_at timestamptz not null default now()
);
create index if not exists tutor_contacts_tutor_idx on public.tutor_contacts (tutor_id, created_at desc);
create index if not exists tutor_contacts_student_idx on public.tutor_contacts (student_id, created_at desc);
alter table public.tutor_contacts enable row level security;
revoke all on public.tutor_contacts from public, anon, authenticated;
grant select on public.tutor_contacts to authenticated;
drop policy if exists "contact parties and admins read contacts" on public.tutor_contacts;
create policy "contact parties and admins read contacts" on public.tutor_contacts
  for select to authenticated using (
    student_id = auth.uid()
    or exists (select 1 from public.tutors t where t.id = tutor_id and t.user_id = auth.uid())
    or public.is_admin()
  );

-- A Sierra Leone number in the form wa.me needs: 232 and the 8-digit number.
create or replace function public.whatsapp_digits(p_phone text)
returns text language sql immutable set search_path = '' as $$
  select case
    when d like '00%' then substr(d, 3)
    when d like '232%' then d
    when d like '0%' and length(d) = 9 then '232' || substr(d, 2)
    when length(d) = 8 then '232' || d
    else d
  end
  from (select regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g') as d) x
$$;

create or replace function public.contact_tutor(p_tutor uuid, p_subject uuid)
returns table (whatsapp text, tutor_name text, subject_name text, price_nle numeric, location text)
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_phone text; v_name text; v_location text; v_tutor_user uuid;
  v_price numeric; v_subject text;
begin
  if v_uid is null then raise exception 'Sign in to contact a tutor'; end if;
  select t.phone, t.full_name, t.location, t.user_id into v_phone, v_name, v_location, v_tutor_user
    from public.tutors t where t.id = p_tutor and t.status = 'active';
  if not found then raise exception 'This tutor is not available at the moment'; end if;
  select ts.price_nle, s.name into v_price, v_subject
    from public.tutor_subjects ts join public.subjects s on s.id = ts.subject_id
   where ts.tutor_id = p_tutor and ts.subject_id = p_subject;
  if not found then raise exception 'This tutor does not teach that subject'; end if;
  if (select count(distinct c.tutor_id) from public.tutor_contacts c
       where c.student_id = v_uid and c.tutor_id <> p_tutor and c.created_at > now() - interval '1 day') >= 10 then
    raise exception 'You have contacted 10 tutors today. Please try again tomorrow.';
  end if;
  -- One record (and one notification to the tutor) per student, tutor and subject per day.
  if not exists (select 1 from public.tutor_contacts c
                  where c.student_id = v_uid and c.tutor_id = p_tutor and c.subject_id = p_subject
                    and c.created_at > now() - interval '1 day') then
    insert into public.tutor_contacts (tutor_id, student_id, subject_id, price_nle) values (p_tutor, v_uid, p_subject, v_price);
    insert into public.user_notifications (recipient_id, actor_id, event_type, title, body, entity_type, entity_id)
    values (v_tutor_user, v_uid, 'tutor_contacted', 'A student wants lessons',
            'A student agreed to your fee for ' || v_subject || ' (NLe '
              || case when v_price = trunc(v_price) then to_char(v_price, 'FM999,999,990') else to_char(v_price, 'FM999,999,990.00') end
              || ' a month) and is opening WhatsApp to message you.',
            'tutor', p_tutor);
  end if;
  return query select public.whatsapp_digits(v_phone), v_name, v_subject, v_price, v_location;
end $$;

-- 5 · The tutor's view of who contacted them ────────────────────────────────
create or replace function public.my_tutor_contacts()
returns table (contacted_at timestamptz, student_first_name text, subject_name text, price_nle numeric)
language sql stable security definer set search_path = '' as $$
  select c.created_at,
         nullif(split_part(btrim(coalesce(p.full_name, '')), ' ', 1), ''),
         s.name,
         c.price_nle
    from public.tutor_contacts c
    join public.tutors t on t.id = c.tutor_id and t.user_id = auth.uid()
    left join public.profiles p on p.id = c.student_id
    left join public.subjects s on s.id = c.subject_id
   order by c.created_at desc
   limit 50
$$;

revoke all on function public.whatsapp_digits(text) from public, anon, authenticated;
revoke all on function public.contact_tutor(uuid, uuid) from public, anon;
revoke all on function public.my_tutor_contacts() from public, anon;
revoke all on function public.update_tutor_avatar(text) from public, anon;
grant execute on function public.contact_tutor(uuid, uuid) to authenticated;
grant execute on function public.my_tutor_contacts() to authenticated;
grant execute on function public.update_tutor_avatar(text) to authenticated;

commit;

-- Rollback: drop function if exists public.contact_tutor(uuid, uuid), public.my_tutor_contacts(),
--   public.update_tutor_avatar(text), public.whatsapp_digits(text); drop table if exists public.tutor_contacts;
-- (submit_tutor_application and update_tutor_profile: re-run their definitions from migrations 14 and 11.)
