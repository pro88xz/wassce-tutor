-- 2026-11-16 · Tutor prices that fit Sierra Leone (19). Run after 18.
-- Safe to run twice. Applied by the "Apply database migrations" workflow.
--
-- Students rarely want one subject, and families stretch every Leone, so a
-- request to a tutor can now carry:
-- 1. Several subjects. The fees add up, and the tutor can give a discount for
--    two or more subjects (tutors.multi_subject_discount_pct, 0-25%).
-- 2. A small group. Friends, classmates or siblings learn together and each
--    pays less (tutors.group_max: 2-6 students, null = one student at a time;
--    tutors.group_discount_pct: 0-50% off each student's fee).
-- 3. Lessons a week for each subject, so a monthly fee shows what it buys.
-- 4. How the tutor is paid: Orange Money, Afrimoney, cash or bank.
--
-- The price is always worked out here, never taken from the browser:
--   per student = round(sum of the fees x (1 - subject discount) x (1 - group discount))
--   total       = per student x students
-- src/lib/tutor-pricing.ts does the same sum to show it before the student agrees.
--
-- request_tutor() replaces contact_tutor() (which stays, as a one-subject
-- wrapper); update_tutor_offer() is how tutors set all of the above.

begin;

-- 1 · Columns ───────────────────────────────────────────────────────────────
alter table public.tutors
  add column if not exists multi_subject_discount_pct smallint not null default 0,
  add column if not exists group_max smallint,
  add column if not exists group_discount_pct smallint not null default 0,
  add column if not exists payment_methods text[] not null default '{}';
alter table public.tutors drop constraint if exists tutors_offer_valid;
alter table public.tutors add constraint tutors_offer_valid check (
  multi_subject_discount_pct between 0 and 25
  and (group_max is null or group_max between 2 and 6)
  and group_discount_pct between 0 and 50
  and (group_max is not null or group_discount_pct = 0)
  and payment_methods <@ array['orange_money', 'afrimoney', 'cash', 'bank']::text[]
);
-- tutors is readable column by column (migration 13: never the phone).
grant select (multi_subject_discount_pct, group_max, group_discount_pct, payment_methods) on public.tutors to anon, authenticated;

alter table public.tutor_subjects add column if not exists lessons_per_week smallint;
alter table public.tutor_subjects drop constraint if exists tutor_subjects_lessons_valid;
alter table public.tutor_subjects add constraint tutor_subjects_lessons_valid check (lessons_per_week between 1 and 7);
alter table public.tutor_application_subjects add column if not exists lessons_per_week smallint;
alter table public.tutor_application_subjects drop constraint if exists tutor_application_subjects_lessons_valid;
alter table public.tutor_application_subjects add constraint tutor_application_subjects_lessons_valid check (lessons_per_week between 1 and 7);

-- A contact is now one request: its subjects (as they were priced), the
-- number of students, and price_nle = the monthly fee for each student.
alter table public.tutor_contacts
  add column if not exists subjects jsonb,
  add column if not exists students smallint not null default 1,
  add column if not exists total_nle numeric(10,2);
comment on column public.tutor_contacts.price_nle is 'Monthly fee for each student, after discounts';
comment on column public.tutor_contacts.subjects is 'The subjects asked for: [{id, name, price_nle, lessons_per_week}]';

-- 2 · Wording helpers ─────────────────────────────────────────────────────────
create or replace function public.nle_text(p numeric)
returns text language sql immutable set search_path = '' as $$
  select 'NLe ' || case when p = trunc(p) then to_char(p, 'FM999,999,990') else to_char(p, 'FM999,999,990.00') end
$$;

-- 'Biology', 'Biology and Chemistry', 'Biology, Chemistry and Physics'; null when empty.
create or replace function public.list_text(p text[])
returns text language sql immutable set search_path = '' as $$
  select case coalesce(array_length(p, 1), 0)
    when 0 then null
    when 1 then p[1]
    else array_to_string(p[1:array_length(p, 1) - 1], ', ') || ' and ' || p[array_length(p, 1)]
  end
$$;

-- 3 · A student's request ─────────────────────────────────────────────────────
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

-- The one-subject version from migration 18, kept for pages already open.
create or replace function public.contact_tutor(p_tutor uuid, p_subject uuid)
returns table (whatsapp text, tutor_name text, subject_name text, price_nle numeric, location text)
language sql security definer set search_path = '' as $$
  select r.whatsapp, r.tutor_name, r.subjects->0->>'name', r.per_student, r.location
    from public.request_tutor(p_tutor, array[p_subject], 1) r
$$;

-- 4 · The tutor's view of who contacted them ────────────────────────────────
drop function if exists public.my_tutor_contacts();
create function public.my_tutor_contacts()
returns table (contacted_at timestamptz, student_first_name text, subjects text, students integer, per_student_nle numeric, total_nle numeric)
language sql stable security definer set search_path = '' as $$
  select c.created_at,
         nullif(split_part(btrim(coalesce(p.full_name, '')), ' ', 1), ''),
         coalesce((select public.list_text(array_agg(e->>'name' order by e->>'name')) from jsonb_array_elements(c.subjects) e), s.name),
         c.students::integer,
         c.price_nle,
         coalesce(c.total_nle, c.price_nle * c.students)
    from public.tutor_contacts c
    join public.tutors t on t.id = c.tutor_id and t.user_id = auth.uid()
    left join public.profiles p on p.id = c.student_id
    left join public.subjects s on s.id = c.subject_id
   order by c.created_at desc
   limit 50
$$;

-- 5 · Tutors set their fees, lessons a week, discounts and payment ─────────
create or replace function public.update_tutor_offer(
  p_subjects jsonb, p_multi_subject_discount_pct integer, p_group_max integer,
  p_group_discount_pct integer, p_payment_methods text[]
) returns void language plpgsql security definer set search_path = '' as $$
declare v_tutor uuid; v_item jsonb; v_subject uuid; v_price numeric; v_lessons integer; v_ids uuid[] := '{}';
begin
  select t.id into v_tutor from public.tutors t where t.user_id = auth.uid() and t.status = 'active';
  if v_tutor is null then raise exception 'Approved tutor account required'; end if;
  if jsonb_typeof(p_subjects) is distinct from 'array' or jsonb_array_length(p_subjects) not between 1 and 12 then
    raise exception 'Select between 1 and 12 subjects';
  end if;
  if p_multi_subject_discount_pct is null or p_multi_subject_discount_pct not between 0 and 25 then
    raise exception 'The discount for several subjects must be between 0%% and 25%%';
  end if;
  if p_group_max is not null and p_group_max not between 2 and 6 then raise exception 'A group can have 2 to 6 students'; end if;
  if p_group_discount_pct is null or p_group_discount_pct not between 0 and 50 then
    raise exception 'The group discount must be between 0%% and 50%%';
  end if;
  if p_payment_methods is null or array_position(p_payment_methods, null) is not null
     or not (p_payment_methods <@ array['orange_money', 'afrimoney', 'cash', 'bank']::text[]) then
    raise exception 'Unknown payment method';
  end if;

  for v_item in select value from jsonb_array_elements(p_subjects) loop
    v_subject := (v_item->>'subject_id')::uuid;
    v_price := (v_item->>'price_nle')::numeric;
    v_lessons := (v_item->>'lessons_per_week')::integer;
    if v_subject is null or not exists (select 1 from public.subjects s where s.id = v_subject) then raise exception 'Unknown subject'; end if;
    if v_price is null or v_price <= 0 or v_price > 999999 then raise exception 'Each subject needs a monthly fee above NLe 0'; end if;
    if v_lessons is null or v_lessons not between 1 and 7 then raise exception 'Choose how many lessons a week for each subject (1 to 7)'; end if;
    insert into public.tutor_subjects (tutor_id, subject_id, price_nle, lessons_per_week)
    values (v_tutor, v_subject, round(v_price, 2), v_lessons)
    on conflict (tutor_id, subject_id) do update set price_nle = excluded.price_nle, lessons_per_week = excluded.lessons_per_week;
    v_ids := v_ids || v_subject;
  end loop;
  delete from public.tutor_subjects ts where ts.tutor_id = v_tutor and not (ts.subject_id = any (v_ids));

  update public.tutors
     set multi_subject_discount_pct = p_multi_subject_discount_pct,
         group_max = p_group_max,
         group_discount_pct = case when p_group_max is null then 0 else p_group_discount_pct end,
         payment_methods = (select coalesce(array_agg(distinct m order by m), '{}') from unnest(p_payment_methods) m),
         updated_at = now()
   where id = v_tutor;
end $$;

-- The fees-only version (migration 14), kept for pages already open; it no
-- longer wipes the lessons a week.
create or replace function public.update_tutor_subject_prices(p_subjects jsonb)
returns void language plpgsql security definer set search_path = public, auth as $$
declare v_tutor uuid; v_item jsonb; v_subject uuid; v_price numeric; v_ids uuid[] := '{}';
begin
  select id into v_tutor from tutors where user_id = auth.uid() and status = 'active';
  if v_tutor is null then raise exception 'Approved tutor account required'; end if;
  if jsonb_typeof(p_subjects) <> 'array' or jsonb_array_length(p_subjects) < 1 or jsonb_array_length(p_subjects) > 12 then
    raise exception 'Select between 1 and 12 subjects';
  end if;
  for v_item in select value from jsonb_array_elements(p_subjects) loop
    v_subject := (v_item->>'subject_id')::uuid; v_price := (v_item->>'price_nle')::numeric;
    if v_price is null or v_price <= 0 or not exists (select 1 from subjects where id = v_subject) then
      raise exception 'Each subject needs a monthly fee above NLe 0';
    end if;
    insert into tutor_subjects (tutor_id, subject_id, price_nle) values (v_tutor, v_subject, round(v_price, 2))
    on conflict (tutor_id, subject_id) do update set price_nle = excluded.price_nle;
    v_ids := v_ids || v_subject;
  end loop;
  delete from tutor_subjects where tutor_id = v_tutor and not (subject_id = any (v_ids));
end $$;

-- 6 · Applications: lessons a week for each subject ─────────────────────────
create or replace function public.submit_tutor_application(
  p_full_name text, p_phone text, p_bio text, p_qualifications text,
  p_experience_years integer, p_location text, p_teaching_mode text,
  p_document_path text, p_avatar_path text, p_subjects jsonb
) returns uuid language plpgsql security definer set search_path=public,auth as $$
declare v_id uuid; v_item jsonb; v_subject uuid; v_price numeric; v_lessons integer;
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
    v_lessons := (v_item->>'lessons_per_week')::integer;
    if v_price is null or v_price <= 0 or not exists(select 1 from subjects where id=v_subject) then
      raise exception 'Each subject needs a monthly fee above NLe 0';
    end if;
    if v_lessons is null or v_lessons not between 1 and 7 then
      raise exception 'Choose how many lessons a week for each subject (1 to 7)';
    end if;
    insert into tutor_application_subjects(application_id,subject_id,price_nle,lessons_per_week) values(v_id,v_subject,round(v_price,2),v_lessons);
  end loop;
  insert into user_notifications(recipient_id,actor_id,event_type,title,body,entity_type,entity_id)
  select p.id, auth.uid(), 'tutor_application_submitted', 'New tutor application',
         'New tutor application from '||trim(p_full_name)||'. Review it in Admin, Tutors.', 'tutor_application', v_id
  from profiles p where p.is_admin;
  return v_id;
end $$;

-- Approval copies the lessons a week too, and is always in person.
create or replace function public.review_tutor_application(p_application_id uuid,p_decision text,p_note text default null)
returns void language plpgsql security definer set search_path=public,auth as $$
declare v_app tutor_applications%rowtype; v_tutor uuid;
begin
  if not exists(select 1 from profiles where id=auth.uid() and is_admin=true) then raise exception 'Not authorised'; end if;
  if p_decision not in ('approved','rejected','under_review') then raise exception 'Invalid decision'; end if;
  select * into v_app from tutor_applications where id=p_application_id for update;
  if not found then raise exception 'Application not found'; end if;
  if v_app.status not in ('submitted','under_review') then raise exception 'Application has already been reviewed'; end if;
  update tutor_applications set status=p_decision,reviewer_id=auth.uid(),review_note=left(p_note,1000),reviewed_at=now(),updated_at=now() where id=p_application_id;
  if p_decision='approved' then
    insert into tutors(user_id,full_name,phone,bio,qualifications,experience_years,location,teaching_mode,avatar_path)
    values(v_app.user_id,v_app.full_name,v_app.phone,v_app.bio,v_app.qualifications,v_app.experience_years,v_app.location,'in_person',v_app.avatar_path)
    on conflict(user_id) do update set full_name=excluded.full_name,phone=excluded.phone,bio=excluded.bio,qualifications=excluded.qualifications,experience_years=excluded.experience_years,location=excluded.location,teaching_mode='in_person',avatar_path=excluded.avatar_path,status='active',updated_at=now()
    returning id into v_tutor;
    insert into tutor_subjects(tutor_id,subject_id,price_nle,lessons_per_week)
    select v_tutor,subject_id,price_nle,lessons_per_week from tutor_application_subjects where application_id=p_application_id
    on conflict(tutor_id,subject_id) do update set price_nle=excluded.price_nle,lessons_per_week=coalesce(excluded.lessons_per_week,tutor_subjects.lessons_per_week);
    insert into user_notifications(recipient_id,actor_id,event_type,title,body,entity_type,entity_id)
    values(v_app.user_id,auth.uid(),'tutor_approved','Tutor application approved',
           'Your tutor card is now in the marketplace. On your tutor dashboard you can add a discount for several subjects, take small groups, and show how students can pay you.',
           'tutor_application',p_application_id);
  elsif p_decision='rejected' then
    insert into user_notifications(recipient_id,actor_id,event_type,title,body,entity_type,entity_id)
    values(v_app.user_id,auth.uid(),'tutor_rejected','Tutor application update',coalesce(nullif(trim(p_note),''),'Your tutor application was not approved. You may contact support.'),'tutor_application',p_application_id);
  end if;
end $$;

-- 7 · Who may call what ─────────────────────────────────────────────────────
revoke all on function public.nle_text(numeric) from public, anon, authenticated;
revoke all on function public.list_text(text[]) from public, anon, authenticated;
revoke all on function public.request_tutor(uuid, uuid[], integer) from public, anon;
revoke all on function public.my_tutor_contacts() from public, anon;
revoke all on function public.update_tutor_offer(jsonb, integer, integer, integer, text[]) from public, anon;
grant execute on function public.request_tutor(uuid, uuid[], integer) to authenticated;
grant execute on function public.my_tutor_contacts() to authenticated;
grant execute on function public.update_tutor_offer(jsonb, integer, integer, integer, text[]) to authenticated;

commit;

-- Rollback: drop function if exists public.request_tutor(uuid, uuid[], integer),
--   public.update_tutor_offer(jsonb, integer, integer, integer, text[]), public.nle_text(numeric), public.list_text(text[]);
-- re-run contact_tutor and my_tutor_contacts from migration 18, submit_tutor_application from 18,
-- review_tutor_application from 11 and update_tutor_subject_prices from 14; then
-- alter table public.tutors drop constraint tutors_offer_valid, drop column multi_subject_discount_pct,
--   drop column group_max, drop column group_discount_pct, drop column payment_methods;
-- alter table public.tutor_subjects drop column lessons_per_week;
-- alter table public.tutor_application_subjects drop column lessons_per_week;
-- alter table public.tutor_contacts drop column subjects, drop column students, drop column total_nle.
