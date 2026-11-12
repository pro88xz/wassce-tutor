-- 2026-11-12 · Tutor marketplace: monthly pricing, admin alerts and fixes.
-- Run after 13 in the Supabase SQL editor. Safe to run twice. Does not change
-- how Monime payments are made, verified or granted (see 6: it only makes sure
-- the affiliate trigger on payments can never block one).
--
-- 1. Tutor prices are a monthly fee that each tutor sets freely. The old
--    "NLe 100 per session" ceiling is removed from the three price columns and
--    from the two functions that check prices. A price must still be above 0.
-- 2. A new tutor application notifies every admin (inbox row, which the
--    applicant's browser then emails through send-notification-email).
-- 3. A new affiliate application notifies every admin the same way.
-- 4. apply_as_affiliate() called gen_random_bytes(), which lives in the
--    extensions schema on Supabase and is not on the function's search path,
--    so every affiliate application failed. Codes now come from
--    gen_random_uuid(), which is built into Postgres.
-- 5. Admins can pause (suspend) and restore an approved tutor.
-- 6. The affiliate commission trigger (migration 11) runs inside the same
--    transaction that completes a Monime payment. It is correct, but if it ever
--    failed, the payment would roll back with it. It now catches its own errors
--    and logs a warning, so a commission problem can never block a payment.

begin;

-- 1 ─────────────────────────────────────────────────────────────────────────
-- Drop whatever check constraints mention price_nle (their generated names
-- may differ), then add a single "above zero" check under a known name.
do $$
declare
  r record;
begin
  for r in
    select c.conrelid::regclass as tbl, c.conname
    from pg_constraint c
    where c.contype = 'c'
      and c.conrelid in ('public.tutor_application_subjects'::regclass,
                         'public.tutor_subjects'::regclass,
                         'public.tutor_bookings'::regclass)
      and pg_get_constraintdef(c.oid) ilike '%price_nle%'
  loop
    execute format('alter table %s drop constraint %I', r.tbl, r.conname);
  end loop;
end $$;

alter table public.tutor_application_subjects add constraint tutor_application_subjects_price_positive check (price_nle > 0);
alter table public.tutor_subjects add constraint tutor_subjects_price_positive check (price_nle > 0);
alter table public.tutor_bookings add constraint tutor_bookings_price_positive check (price_nle > 0);

comment on column public.tutor_application_subjects.price_nle is 'Monthly fee in NLe set by the tutor';
comment on column public.tutor_subjects.price_nle is 'Monthly fee in NLe set by the tutor';
comment on column public.tutor_bookings.price_nle is 'Monthly fee in NLe at the time of the request';

-- 1 + 2 ─────────────────────────────────────────────────────────────────────
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
  if p_avatar_path is not null and (
    split_part(p_avatar_path,'/',1) <> auth.uid()::text
    or not exists(select 1 from storage.objects where bucket_id='tutor-profile-images' and name=p_avatar_path)
  ) then raise exception 'Invalid profile photograph'; end if;
  insert into tutor_applications(user_id,full_name,phone,bio,qualifications,experience_years,location,teaching_mode,document_path,avatar_path)
  values(auth.uid(),trim(p_full_name),trim(p_phone),trim(p_bio),trim(p_qualifications),p_experience_years,trim(p_location),p_teaching_mode,p_document_path,p_avatar_path)
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

create or replace function public.update_tutor_subject_prices(p_subjects jsonb)
returns void language plpgsql security definer set search_path=public,auth as $$
declare v_tutor uuid; v_item jsonb; v_subject uuid; v_price numeric;
begin
 select id into v_tutor from tutors where user_id=auth.uid() and status='active';
 if v_tutor is null then raise exception 'Approved tutor account required'; end if;
 if jsonb_typeof(p_subjects)<>'array' or jsonb_array_length(p_subjects)<1 or jsonb_array_length(p_subjects)>12 then raise exception 'Select between 1 and 12 subjects'; end if;
 delete from tutor_subjects where tutor_id=v_tutor;
 for v_item in select value from jsonb_array_elements(p_subjects) loop
  v_subject := (v_item->>'subject_id')::uuid; v_price := (v_item->>'price_nle')::numeric;
  if v_price is null or v_price<=0 or not exists(select 1 from subjects where id=v_subject) then raise exception 'Each subject needs a monthly fee above NLe 0'; end if;
  insert into tutor_subjects(tutor_id,subject_id,price_nle) values(v_tutor,v_subject,round(v_price,2));
 end loop;
end $$;

-- 3 + 4 ─────────────────────────────────────────────────────────────────────
create or replace function public.apply_as_affiliate()
returns text language plpgsql security definer set search_path=public,auth as $$
declare v_code text; v_user uuid:=auth.uid(); v_id uuid; v_name text;
begin
 if v_user is null then raise exception 'Sign in required'; end if;
 select code into v_code from affiliates where user_id=v_user;
 if v_code is not null then return v_code; end if;
 loop
   v_code := upper(substr(replace(gen_random_uuid()::text,'-',''),1,10));
   exit when not exists(select 1 from affiliates where code=v_code);
 end loop;
 insert into affiliates(user_id,code) values(v_user,v_code) returning id into v_id;
 select coalesce(nullif(trim(full_name),''),'A student') into v_name from profiles where id=v_user;
 insert into user_notifications(recipient_id,actor_id,event_type,title,body,entity_type,entity_id)
 select p.id, v_user, 'affiliate_application_submitted', 'New affiliate application',
        coalesce(v_name,'A user')||' applied to the affiliate programme. Review it in Admin, Affiliates.', 'affiliate', v_id
 from profiles p where p.is_admin;
 return v_code;
end $$;

-- 5 ─────────────────────────────────────────────────────────────────────────
create or replace function public.set_tutor_status(p_tutor_id uuid, p_status text)
returns void language plpgsql security definer set search_path=public,auth as $$
declare v_user uuid;
begin
 if not exists(select 1 from profiles where id=auth.uid() and is_admin=true) then raise exception 'Not authorised'; end if;
 if p_status not in ('active','suspended') then raise exception 'Invalid status'; end if;
 update tutors set status=p_status, updated_at=now() where id=p_tutor_id returning user_id into v_user;
 if v_user is null then raise exception 'Tutor not found'; end if;
 insert into user_notifications(recipient_id,actor_id,event_type,title,body,entity_type,entity_id)
 values(v_user, auth.uid(),
        case when p_status='active' then 'tutor_reactivated' else 'tutor_suspended' end,
        case when p_status='active' then 'Tutor profile restored' else 'Tutor profile paused' end,
        case when p_status='active' then 'Your tutor profile is visible in the marketplace again.'
             else 'Your tutor profile has been paused and is hidden from the marketplace. Contact support for details.' end,
        'tutor', p_tutor_id);
end $$;

-- 6 ─────────────────────────────────────────────────────────────────────────
-- Same logic as migration 11, wrapped so that it can only ever add a
-- commission, never stop the payment update that fired it.
create or replace function public.record_first_payment_affiliate_commission()
returns trigger language plpgsql security definer set search_path=public as $$
declare v_affiliate uuid;
begin
 if new.status='completed' and (tg_op='INSERT' or old.status is distinct from 'completed') then
   begin
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
   exception when others then
     raise warning 'affiliate commission skipped for payment %: %', new.id, sqlerrm;
   end;
 end if;
 return new;
end $$;

revoke all on function public.submit_tutor_application(text,text,text,text,integer,text,text,text,text,jsonb) from public,anon;
revoke all on function public.update_tutor_subject_prices(jsonb) from public,anon;
revoke all on function public.apply_as_affiliate() from public,anon;
revoke all on function public.set_tutor_status(uuid,text) from public,anon;
grant execute on function public.submit_tutor_application(text,text,text,text,integer,text,text,text,text,jsonb) to authenticated;
grant execute on function public.update_tutor_subject_prices(jsonb) to authenticated;
grant execute on function public.apply_as_affiliate() to authenticated;
grant execute on function public.set_tutor_status(uuid,text) to authenticated;

commit;

-- Checks (each should return what the comment says):
--   select count(*) from pg_constraint where conname like '%price_positive';          -- 3
--   select pg_get_functiondef('public.apply_as_affiliate()'::regprocedure) ilike '%gen_random_bytes%';  -- f
--   select has_function_privilege('authenticated','public.set_tutor_status(uuid,text)','execute');      -- t
