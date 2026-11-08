-- Tutor marketplace, affiliate attribution, commissions and notifications.
-- This migration is additive: it does not alter checkout creation, Monime callbacks,
-- subscription access or existing payment rows.

begin;

create extension if not exists btree_gist;

create table if not exists public.tutor_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null check (length(trim(full_name)) between 2 and 120),
  phone text not null check (length(trim(phone)) between 7 and 30),
  bio text not null check (length(trim(bio)) between 80 and 2000),
  qualifications text not null check (length(trim(qualifications)) between 10 and 2000),
  experience_years integer not null check (experience_years between 0 and 60),
  location text not null check (length(trim(location)) between 2 and 120),
  teaching_mode text not null check (teaching_mode in ('online','in_person','both')),
  document_path text,
  status text not null default 'submitted' check (status in ('submitted','under_review','approved','rejected')),
  reviewer_id uuid references auth.users(id),
  review_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.tutor_applications drop constraint if exists tutor_applications_user_id_key;

create table if not exists public.tutor_application_subjects (
  application_id uuid not null references public.tutor_applications(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete restrict,
  price_nle numeric(8,2) not null check (price_nle > 0 and price_nle <= 100),
  primary key(application_id, subject_id)
);

create table if not exists public.tutors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  bio text not null,
  qualifications text not null,
  experience_years integer not null,
  location text not null,
  teaching_mode text not null check (teaching_mode in ('online','in_person','both')),
  status text not null default 'active' check (status in ('active','suspended')),
  verified_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tutor_subjects (
  tutor_id uuid not null references public.tutors(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete restrict,
  price_nle numeric(8,2) not null check (price_nle > 0 and price_nle <= 100),
  primary key(tutor_id, subject_id)
);

create table if not exists public.tutor_availability (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.tutors(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  starts_at time not null,
  ends_at time not null,
  active boolean not null default true,
  check (ends_at > starts_at),
  unique(tutor_id, weekday, starts_at, ends_at)
);

create table if not exists public.tutor_bookings (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.tutors(id) on delete restrict,
  student_id uuid not null references auth.users(id) on delete restrict,
  subject_id uuid not null references public.subjects(id) on delete restrict,
  starts_at timestamptz not null,
  duration_minutes smallint not null default 60 check (duration_minutes in (30,45,60,90,120)),
  ends_at timestamptz generated always as (starts_at + make_interval(mins => duration_minutes)) stored,
  booking_slot tstzrange generated always as (tstzrange(starts_at, starts_at + make_interval(mins => duration_minutes), '[)')) stored,
  price_nle numeric(8,2) not null check (price_nle > 0 and price_nle <= 100),
  student_message text check (student_message is null or length(student_message) <= 1000),
  status text not null default 'requested' check (status in ('requested','accepted','confirmed','completed','declined','cancelled','reschedule_requested','no_show')),
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  exclude using gist (tutor_id with =, booking_slot with &&)
    where (status in ('requested','accepted','confirmed'))
);

create index if not exists tutor_bookings_student_idx on public.tutor_bookings(student_id, starts_at desc);
create index if not exists tutor_bookings_tutor_idx on public.tutor_bookings(tutor_id, starts_at desc);
create index if not exists tutor_availability_lookup_idx on public.tutor_availability(tutor_id, weekday) where active;

create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  code text not null unique check (code ~ '^[A-Z0-9]{6,16}$'),
  status text not null default 'pending' check (status in ('pending','approved','suspended')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references auth.users(id)
);

create table if not exists public.affiliate_attributions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete restrict,
  referred_user_id uuid not null unique references auth.users(id) on delete cascade,
  attributed_at timestamptz not null default now(),
  converted_at timestamptz
);

create table if not exists public.affiliate_commissions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete restrict,
  referred_user_id uuid not null references auth.users(id) on delete restrict,
  payment_id uuid not null unique references public.payments(id) on delete restrict,
  gross_amount_nle numeric(10,2) not null check (gross_amount_nle > 0),
  commission_rate numeric(5,4) not null default 0.5 check (commission_rate = 0.5),
  commission_amount_nle numeric(10,2) not null check (commission_amount_nle > 0),
  status text not null default 'pending' check (status in ('pending','approved','reserved','paid','reversed')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  paid_at timestamptz
);

create index if not exists affiliate_commissions_owner_idx on public.affiliate_commissions(affiliate_id, created_at desc);

create table if not exists public.affiliate_payout_requests (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete restrict,
  amount_nle numeric(10,2) not null check (amount_nle >= 50),
  payout_method text not null check (payout_method in ('orange_money','afrimoney','bank')),
  payout_account_name text not null check (length(trim(payout_account_name)) between 2 and 120),
  payout_account_number text not null check (length(trim(payout_account_number)) between 5 and 40),
  status text not null default 'requested' check (status in ('requested','processing','paid','rejected')),
  admin_note text,
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

create table if not exists public.affiliate_payout_commission_items (
  payout_id uuid not null references public.affiliate_payout_requests(id) on delete cascade,
  commission_id uuid not null unique references public.affiliate_commissions(id) on delete restrict,
  primary key(payout_id,commission_id)
);
alter table public.affiliate_payout_commission_items enable row level security;
create policy "Affiliate owners and admins read payout commission items" on public.affiliate_payout_commission_items
 for select to authenticated using (
  exists(select 1 from public.affiliate_payout_requests p join public.affiliates a on a.id=p.affiliate_id where p.id=payout_id and a.user_id=auth.uid())
  or exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin)
);

create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  title text not null,
  body text not null,
  entity_type text,
  entity_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists user_notifications_inbox_idx on public.user_notifications(recipient_id, created_at desc);

-- Private evidence bucket; users can only access their own application folder.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('tutor-verification-docs','tutor-verification-docs',false,10485760,
  array['application/pdf','image/jpeg','image/png'])
on conflict (id) do update set public = false, file_size_limit = 10485760,
  allowed_mime_types = array['application/pdf','image/jpeg','image/png'];

alter table public.tutor_applications enable row level security;
alter table public.tutor_application_subjects enable row level security;
alter table public.tutors enable row level security;
alter table public.tutor_subjects enable row level security;
alter table public.tutor_availability enable row level security;
alter table public.tutor_bookings enable row level security;
alter table public.affiliates enable row level security;
alter table public.affiliate_attributions enable row level security;
alter table public.affiliate_commissions enable row level security;
alter table public.affiliate_payout_requests enable row level security;
alter table public.user_notifications enable row level security;

create policy "Applicants read own applications" on public.tutor_applications for select to authenticated using (user_id = auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin));
create policy "Applicants read own application subjects" on public.tutor_application_subjects for select to authenticated using (exists(select 1 from public.tutor_applications a where a.id=application_id and (a.user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin))));
create policy "Public read active tutors" on public.tutors for select to anon, authenticated using (status='active' or user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin));
create policy "Public read active tutor subjects" on public.tutor_subjects for select to anon, authenticated using (exists(select 1 from public.tutors t where t.id=tutor_id and (t.status='active' or t.user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin))));
create policy "Public read active tutor availability" on public.tutor_availability for select to anon, authenticated using (exists(select 1 from public.tutors t where t.id=tutor_id and (t.status='active' or t.user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin))));
create policy "Booking parties and admins read bookings" on public.tutor_bookings for select to authenticated using (student_id=auth.uid() or exists(select 1 from public.tutors t where t.id=tutor_id and t.user_id=auth.uid()) or exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin));
create policy "Affiliate owner and admins read affiliate" on public.affiliates for select to authenticated using (user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin));
create policy "Affiliate owner and admins read attributions" on public.affiliate_attributions for select to authenticated using (referred_user_id=auth.uid() or exists(select 1 from public.affiliates a where a.id=affiliate_id and a.user_id=auth.uid()) or exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin));
create policy "Affiliate owner and admins read commissions" on public.affiliate_commissions for select to authenticated using (exists(select 1 from public.affiliates a where a.id=affiliate_id and a.user_id=auth.uid()) or exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin));
create policy "Affiliate owner and admins read payouts" on public.affiliate_payout_requests for select to authenticated using (exists(select 1 from public.affiliates a where a.id=affiliate_id and a.user_id=auth.uid()) or exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin));
create policy "Users read own notifications" on public.user_notifications for select to authenticated using (recipient_id=auth.uid());
create policy "Users update own notification read state" on public.user_notifications for update to authenticated using (recipient_id=auth.uid()) with check (recipient_id=auth.uid());

create policy "Users upload own tutor evidence" on storage.objects for insert to authenticated with check (bucket_id='tutor-verification-docs' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "Users read own tutor evidence" on storage.objects for select to authenticated using (bucket_id='tutor-verification-docs' and ((storage.foldername(name))[1]=auth.uid()::text or exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_admin)));

-- All state transitions and monetary writes are server-side security-definer RPCs.
create or replace function public.submit_tutor_application(
  p_full_name text, p_phone text, p_bio text, p_qualifications text,
  p_experience_years integer, p_location text, p_teaching_mode text,
  p_document_path text, p_subjects jsonb
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
  insert into tutor_applications(user_id,full_name,phone,bio,qualifications,experience_years,location,teaching_mode,document_path)
  values(auth.uid(),trim(p_full_name),trim(p_phone),trim(p_bio),trim(p_qualifications),p_experience_years,trim(p_location),p_teaching_mode,p_document_path)
  returning id into v_id;
  for v_item in select value from jsonb_array_elements(p_subjects) loop
    v_subject := (v_item->>'subject_id')::uuid;
    v_price := (v_item->>'price_nle')::numeric;
    if v_price <= 0 or v_price > 100 or not exists(select 1 from subjects where id=v_subject) then
      raise exception 'Invalid subject or price';
    end if;
    insert into tutor_application_subjects(application_id,subject_id,price_nle) values(v_id,v_subject,v_price);
  end loop;
  return v_id;
end $$;

create or replace function public.review_tutor_application(p_application_id uuid,p_decision text,p_note text default null)
returns void language plpgsql security definer set search_path=public,auth as $$
declare v_app tutor_applications%rowtype; v_tutor uuid;
begin
  if not exists(select 1 from profiles where id=auth.uid() and is_admin=true) then raise exception 'Not authorised'; end if;
  if p_decision not in ('approved','rejected','under_review') then raise exception 'Invalid decision'; end if;
  select * into v_app from tutor_applications where id=p_application_id for update;
  if not found then raise exception 'Application not found'; end if;
  update tutor_applications set status=p_decision,reviewer_id=auth.uid(),review_note=left(p_note,1000),reviewed_at=now(),updated_at=now() where id=p_application_id;
  if p_decision='approved' then
    insert into tutors(user_id,full_name,phone,bio,qualifications,experience_years,location,teaching_mode)
    values(v_app.user_id,v_app.full_name,v_app.phone,v_app.bio,v_app.qualifications,v_app.experience_years,v_app.location,v_app.teaching_mode)
    on conflict(user_id) do update set full_name=excluded.full_name,phone=excluded.phone,bio=excluded.bio,qualifications=excluded.qualifications,experience_years=excluded.experience_years,location=excluded.location,teaching_mode=excluded.teaching_mode,status='active',updated_at=now()
    returning id into v_tutor;
    insert into tutor_subjects(tutor_id,subject_id,price_nle)
    select v_tutor,subject_id,price_nle from tutor_application_subjects where application_id=p_application_id
    on conflict(tutor_id,subject_id) do update set price_nle=excluded.price_nle;
    insert into user_notifications(recipient_id,actor_id,event_type,title,body,entity_type,entity_id)
    values(v_app.user_id,auth.uid(),'tutor_approved','Tutor application approved','Your tutor profile is now visible in the tutor marketplace.','tutor_application',p_application_id);
  elsif p_decision='rejected' then
    insert into user_notifications(recipient_id,actor_id,event_type,title,body,entity_type,entity_id)
    values(v_app.user_id,auth.uid(),'tutor_rejected','Tutor application update',coalesce(nullif(trim(p_note),''),'Your tutor application was not approved. You may contact support.'),'tutor_application',p_application_id);
  end if;
end $$;

create or replace function public.update_tutor_profile(p_bio text,p_location text,p_teaching_mode text)
returns void language plpgsql security definer set search_path=public,auth as $
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 if length(trim(p_bio)) not between 80 and 2000 or length(trim(p_location)) not between 2 and 120 or p_teaching_mode not in ('online','in_person','both') then raise exception 'Invalid tutor profile details'; end if;
 update tutors set bio=trim(p_bio),location=trim(p_location),teaching_mode=p_teaching_mode,updated_at=now()
 where user_id=auth.uid() and status='active';
 if not found then raise exception 'Approved tutor account required'; end if;
end $;

create or replace function public.update_tutor_subject_prices(p_subjects jsonb)
returns void language plpgsql security definer set search_path=public,auth as $
declare v_tutor uuid; v_item jsonb; v_subject uuid; v_price numeric;
begin
 select id into v_tutor from tutors where user_id=auth.uid() and status='active';
 if v_tutor is null then raise exception 'Approved tutor account required'; end if;
 if jsonb_typeof(p_subjects)<>'array' or jsonb_array_length(p_subjects)<1 or jsonb_array_length(p_subjects)>12 then raise exception 'Select between 1 and 12 subjects'; end if;
 delete from tutor_subjects where tutor_id=v_tutor;
 for v_item in select value from jsonb_array_elements(p_subjects) loop
  v_subject := (v_item->>'subject_id')::uuid; v_price := (v_item->>'price_nle')::numeric;
  if v_price<=0 or v_price>100 or not exists(select 1 from subjects where id=v_subject) then raise exception 'Invalid subject or rate'; end if;
  insert into tutor_subjects(tutor_id,subject_id,price_nle) values(v_tutor,v_subject,v_price);
 end loop;
end $;

create or replace function public.set_tutor_availability(p_slots jsonb)
returns void language plpgsql security definer set search_path=public,auth as $$
declare v_tutor uuid; v_slot jsonb; v_day integer; v_start time; v_end time;
begin
  select id into v_tutor from tutors where user_id=auth.uid() and status='active';
  if v_tutor is null then raise exception 'Approved tutor account required'; end if;
  if jsonb_typeof(p_slots)<>'array' or jsonb_array_length(p_slots)>42 then raise exception 'Invalid availability'; end if;
  delete from tutor_availability where tutor_id=v_tutor;
  for v_slot in select value from jsonb_array_elements(p_slots) loop
    v_day := (v_slot->>'weekday')::integer; v_start := (v_slot->>'starts_at')::time; v_end := (v_slot->>'ends_at')::time;
    if v_day not between 0 and 6 or v_end<=v_start then raise exception 'Invalid availability slot'; end if;
    insert into tutor_availability(tutor_id,weekday,starts_at,ends_at) values(v_tutor,v_day,v_start,v_end);
  end loop;
end $$;

create or replace function public.create_tutor_booking(
 p_tutor_id uuid,p_subject_id uuid,p_starts_at timestamptz,p_duration_minutes integer,p_message text default null
) returns uuid language plpgsql security definer set search_path=public,auth as $$
declare v_booking uuid; v_price numeric; v_owner uuid; v_tutor_name text; v_subject_name text;
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 if p_starts_at <= now() or p_duration_minutes not in (30,45,60,90,120) then raise exception 'Invalid booking time or duration'; end if;
 select ts.price_nle,t.user_id,t.full_name into v_price,v_owner,v_tutor_name
 from tutor_subjects ts join tutors t on t.id=ts.tutor_id
 where ts.tutor_id=p_tutor_id and ts.subject_id=p_subject_id and t.status='active';
 if v_price is null then raise exception 'Tutor is not available for this subject'; end if;
 if v_owner=auth.uid() then raise exception 'You cannot book yourself'; end if;
 if not exists(select 1 from tutor_availability av where av.tutor_id=p_tutor_id and av.active and av.weekday=extract(dow from p_starts_at)::integer and p_starts_at::time >= av.starts_at and (p_starts_at + make_interval(mins=>p_duration_minutes))::time <= av.ends_at) then raise exception 'Requested time is outside published tutor availability'; end if;
 insert into tutor_bookings(tutor_id,student_id,subject_id,starts_at,duration_minutes,price_nle,student_message)
 values(p_tutor_id,auth.uid(),p_subject_id,p_starts_at,p_duration_minutes,v_price,left(p_message,1000))
 returning id into v_booking;
 insert into user_notifications(recipient_id,actor_id,event_type,title,body,entity_type,entity_id)
 values(v_owner,auth.uid(),'booking_requested','New tutoring request','A student requested a tutoring session.','booking',v_booking);
 return v_booking;
exception when exclusion_violation then
 raise exception 'That tutor already has a booking during this time. Choose another slot.';
end $$;

create or replace function public.update_tutor_booking(p_booking_id uuid,p_status text,p_reason text default null)
returns void language plpgsql security definer set search_path=public,auth as $$
declare v_booking tutor_bookings%rowtype; v_tutor_user uuid; v_recipient uuid;
begin
 select b,t.user_id into v_booking,v_tutor_user from tutor_bookings b join tutors t on t.id=b.tutor_id where b.id=p_booking_id for update of b;
 if not found then raise exception 'Booking not found'; end if;
 if auth.uid()<>v_booking.student_id and auth.uid()<>v_tutor_user and not exists(select 1 from profiles where id=auth.uid() and is_admin=true) then raise exception 'Not authorised'; end if;
 if p_status not in ('accepted','confirmed','completed','declined','cancelled','reschedule_requested','no_show') then raise exception 'Invalid booking transition'; end if;
 if p_status in ('accepted','declined') and auth.uid()<>v_tutor_user then raise exception 'Only the tutor can respond'; end if;
 if p_status='completed' and auth.uid()<>v_tutor_user and not exists(select 1 from profiles where id=auth.uid() and is_admin=true) then raise exception 'Only tutor or admin can complete'; end if;
 if p_status='no_show' and not exists(select 1 from profiles where id=auth.uid() and is_admin=true) then raise exception 'Only admin can mark no-show'; end if;
 if p_status='confirmed' and (v_booking.status<>'accepted' or auth.uid()<>v_booking.student_id) then raise exception 'Student confirmation is required after tutor acceptance'; end if;
 if p_status='accepted' and v_booking.status<>'requested' then raise exception 'Booking is not awaiting a response'; end if;
 if p_status='completed' and v_booking.status not in ('confirmed','accepted') then raise exception 'Only confirmed sessions can be completed'; end if;
 if p_status='cancelled' and v_booking.status not in ('requested','accepted','confirmed') then raise exception 'Booking cannot be cancelled'; end if;
 if p_status='reschedule_requested' and v_booking.status not in ('requested','accepted','confirmed') then raise exception 'Booking cannot be rescheduled'; end if;
 update tutor_bookings set status=p_status,cancellation_reason=left(p_reason,500),updated_at=now() where id=p_booking_id;
 v_recipient := case when auth.uid()=v_booking.student_id then v_tutor_user else v_booking.student_id end;
 insert into user_notifications(recipient_id,actor_id,event_type,title,body,entity_type,entity_id)
 values(v_recipient,auth.uid(),'booking_'||p_status,'Booking '||replace(p_status,'_',' '),'Your tutoring booking status changed to '||replace(p_status,'_',' ')||'.','booking',p_booking_id);
end $$;

create or replace function public.apply_as_affiliate()
returns text language plpgsql security definer set search_path=public,auth as $$
declare v_code text; v_user uuid:=auth.uid();
begin
 if v_user is null then raise exception 'Sign in required'; end if;
 if exists(select 1 from affiliates where user_id=v_user) then select code into v_code from affiliates where user_id=v_user; return v_code; end if;
 v_code := upper(substr(encode(gen_random_bytes(10),'hex'),1,10));
 insert into affiliates(user_id,code) values(v_user,v_code);
 return v_code;
end $$;

create or replace function public.claim_affiliate_referral(p_code text)
returns void language plpgsql security definer set search_path=public,auth as $$
declare v_affiliate uuid;
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;
 if exists(select 1 from payments where user_id=auth.uid() and status='completed') then raise exception 'Referral must be claimed before first payment'; end if;
 select id into v_affiliate from affiliates where code=upper(trim(p_code)) and status='approved';
 if v_affiliate is null then raise exception 'Referral code is invalid or inactive'; end if;
 if exists(select 1 from affiliates where id=v_affiliate and user_id=auth.uid()) then raise exception 'Self-referrals are not allowed'; end if;
 insert into affiliate_attributions(affiliate_id,referred_user_id) values(v_affiliate,auth.uid()) on conflict(referred_user_id) do nothing;
end $$;

create or replace function public.review_affiliate(p_affiliate_id uuid,p_decision text)
returns void language plpgsql security definer set search_path=public,auth as $$
begin
 if not exists(select 1 from profiles where id=auth.uid() and is_admin=true) then raise exception 'Not authorised'; end if;
 if p_decision not in ('approved','suspended') then raise exception 'Invalid decision'; end if;
 update affiliates set status=p_decision,approved_at=case when p_decision='approved' then now() else approved_at end,approved_by=auth.uid() where id=p_affiliate_id;
 if not found then raise exception 'Affiliate not found'; end if;
end $$;

create or replace function public.request_affiliate_payout(p_amount numeric,p_method text,p_name text,p_number text)
returns uuid language plpgsql security definer set search_path=public,auth as $$
declare v_affiliate uuid; v_available numeric; v_id uuid;
begin
 select id into v_affiliate from affiliates where user_id=auth.uid() and status='approved';
 if v_affiliate is null then raise exception 'Approved affiliate account required'; end if;
 perform 1 from affiliate_commissions where affiliate_id=v_affiliate and status='approved' for update;
 select coalesce(sum(commission_amount_nle),0) into v_available
 from affiliate_commissions where affiliate_id=v_affiliate and status='approved';
 if p_amount<50 or p_amount<>v_available then raise exception 'Payout must equal the full approved balance'; end if;
 insert into affiliate_payout_requests(affiliate_id,amount_nle,payout_method,payout_account_name,payout_account_number)
 values(v_affiliate,p_amount,p_method,trim(p_name),trim(p_number)) returning id into v_id;
 insert into affiliate_payout_commission_items(payout_id,commission_id)
 select v_id,id from affiliate_commissions where affiliate_id=v_affiliate and status='approved';
 update affiliate_commissions set status='reserved' where id in (select commission_id from affiliate_payout_commission_items where payout_id=v_id);
 return v_id;
end $$;

create or replace function public.review_affiliate_commission(p_commission_id uuid,p_decision text)
returns void language plpgsql security definer set search_path=public,auth as $
begin
 if not exists(select 1 from profiles where id=auth.uid() and is_admin=true) then raise exception 'Not authorised'; end if;
 if p_decision not in ('approved','reversed') then raise exception 'Invalid decision'; end if;
 update affiliate_commissions set status=p_decision,approved_at=case when p_decision='approved' then now() else approved_at end
 where id=p_commission_id and status='pending';
 if not found then raise exception 'Commission not found or already reviewed'; end if;
end $;

create or replace function public.review_affiliate_payout(p_payout_id uuid,p_decision text,p_note text default null)
returns void language plpgsql security definer set search_path=public,auth as $$
declare v_payout affiliate_payout_requests%rowtype; v_affiliate uuid;
begin
 if not exists(select 1 from profiles where id=auth.uid() and is_admin=true) then raise exception 'Not authorised'; end if;
 if p_decision not in ('processing','paid','rejected') then raise exception 'Invalid decision'; end if;
 select * into v_payout from affiliate_payout_requests where id=p_payout_id for update;
 if not found then raise exception 'Payout not found'; end if;
 update affiliate_payout_requests set status=p_decision,admin_note=left(p_note,500),reviewed_at=now(),reviewed_by=auth.uid() where id=p_payout_id;
 if p_decision='paid' then
   update affiliate_commissions set status='paid',paid_at=now()
   where id in (select commission_id from affiliate_payout_commission_items where payout_id=p_payout_id) and status='reserved';
 elsif p_decision='rejected' then
   update affiliate_commissions set status='approved'
   where id in (select commission_id from affiliate_payout_commission_items where payout_id=p_payout_id) and status='reserved';
 end if;
end $$;

-- A commission is earned only on the referred user's first verified payment.
create or replace function public.capture_signup_affiliate_referral()
returns trigger language plpgsql security definer set search_path=public as $
declare v_affiliate uuid; v_code text;
begin
 v_code := upper(trim(coalesce(new.raw_user_meta_data->>'affiliate_code','')));
 if v_code <> '' then
   select id into v_affiliate from affiliates where code=v_code and status='approved';
   if v_affiliate is not null then
     insert into affiliate_attributions(affiliate_id,referred_user_id) values(v_affiliate,new.id) on conflict(referred_user_id) do nothing;
   end if;
 end if;
 return new;
end $;
drop trigger if exists auth_user_affiliate_attribution on auth.users;
create trigger auth_user_affiliate_attribution after insert on auth.users
for each row execute function public.capture_signup_affiliate_referral();

create or replace function public.record_first_payment_affiliate_commission()
returns trigger language plpgsql security definer set search_path=public as $$
declare v_affiliate uuid;
begin
 if new.status='completed' and (tg_op='INSERT' or old.status is distinct from 'completed') then
   select a.affiliate_id into v_affiliate
   from affiliate_attributions a join affiliates f on f.id=a.affiliate_id
   where a.referred_user_id=new.user_id and f.status='approved'
     and not exists(select 1 from affiliate_commissions c where c.referred_user_id=new.user_id);
   if v_affiliate is not null then
     insert into affiliate_commissions(affiliate_id,referred_user_id,payment_id,gross_amount_nle,commission_amount_nle)
     values(v_affiliate,new.user_id,new.id,new.amount_nle,round(new.amount_nle*0.5,2))
     on conflict(payment_id) do nothing;
     update affiliate_attributions set converted_at=coalesce(converted_at,now()) where referred_user_id=new.user_id;
   end if;
 end if;
 return new;
end $$;
drop trigger if exists affiliate_first_payment_commission on public.payments;
create trigger affiliate_first_payment_commission
after insert or update of status on public.payments
for each row execute function public.record_first_payment_affiliate_commission();

-- Every event is persisted for realtime delivery; email is sent by the
-- send-notification-email Edge Function using a verified notification ID.
do $$
begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') then
   begin alter publication supabase_realtime add table public.user_notifications;
   exception when duplicate_object then null; end;
 end if;
end $$;

revoke all on function public.submit_tutor_application(text,text,text,text,integer,text,text,text,jsonb) from public,anon;
revoke all on function public.review_tutor_application(uuid,text,text) from public,anon;
revoke all on function public.set_tutor_availability(jsonb) from public,anon;
revoke all on function public.update_tutor_profile(text,text,text) from public,anon;
revoke all on function public.update_tutor_subject_prices(jsonb) from public,anon;
revoke all on function public.create_tutor_booking(uuid,uuid,timestamptz,integer,text) from public,anon;
revoke all on function public.update_tutor_booking(uuid,text,text) from public,anon;
revoke all on function public.apply_as_affiliate() from public,anon;
revoke all on function public.claim_affiliate_referral(text) from public,anon;
revoke all on function public.review_affiliate(uuid,text) from public,anon;
revoke all on function public.review_affiliate_commission(uuid,text) from public,anon;
revoke all on function public.request_affiliate_payout(numeric,text,text,text) from public,anon;
revoke all on function public.review_affiliate_payout(uuid,text,text) from public,anon;
grant execute on function public.submit_tutor_application(text,text,text,text,integer,text,text,text,jsonb) to authenticated;
grant execute on function public.review_tutor_application(uuid,text,text) to authenticated;
grant execute on function public.set_tutor_availability(jsonb) to authenticated;
grant execute on function public.update_tutor_profile(text,text,text) to authenticated;
grant execute on function public.update_tutor_subject_prices(jsonb) to authenticated;
grant execute on function public.create_tutor_booking(uuid,uuid,timestamptz,integer,text) to authenticated;
grant execute on function public.update_tutor_booking(uuid,text,text) to authenticated;
grant execute on function public.apply_as_affiliate() to authenticated;
grant execute on function public.claim_affiliate_referral(text) to authenticated;
grant execute on function public.review_affiliate(uuid,text) to authenticated;
grant execute on function public.review_affiliate_commission(uuid,text) to authenticated;
grant execute on function public.request_affiliate_payout(numeric,text,text,text) to authenticated;
grant execute on function public.review_affiliate_payout(uuid,text,text) to authenticated;

grant select on public.tutor_applications,public.tutor_application_subjects,public.tutors,public.tutor_subjects,public.tutor_availability,public.tutor_bookings,public.affiliates,public.affiliate_attributions,public.affiliate_commissions,public.affiliate_payout_requests,public.affiliate_payout_commission_items,public.user_notifications to authenticated;
grant select on public.tutors,public.tutor_subjects,public.tutor_availability to anon;
grant update(read_at) on public.user_notifications to authenticated;

commit;
