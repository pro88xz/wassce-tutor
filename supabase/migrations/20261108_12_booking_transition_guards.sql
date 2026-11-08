begin;

-- Harden booking lifecycle transitions. Unsupported reschedule states previously
-- had no corresponding UI transition and could strand a booking indefinitely.
create or replace function public.update_tutor_booking(p_booking_id uuid,p_status text,p_reason text default null)
returns void language plpgsql security definer set search_path=public,auth as $$
declare
 v_booking tutor_bookings%rowtype;
 v_tutor_user uuid;
 v_recipient uuid;
 v_is_admin boolean;
begin
 if auth.uid() is null then raise exception 'Sign in required'; end if;

 select * into v_booking
 from tutor_bookings
 where id=p_booking_id
 for update;
 if not found then raise exception 'Booking not found'; end if;

 select user_id into v_tutor_user from tutors where id=v_booking.tutor_id;
 select exists(select 1 from profiles where id=auth.uid() and is_admin=true) into v_is_admin;

 if auth.uid()<>v_booking.student_id and auth.uid()<>v_tutor_user and not v_is_admin then
   raise exception 'Not authorised';
 end if;

 if p_status not in ('accepted','confirmed','completed','declined','cancelled','no_show') then
   raise exception 'Invalid booking transition';
 end if;

 if p_status in ('accepted','declined') and auth.uid()<>v_tutor_user then
   raise exception 'Only the tutor can respond';
 end if;
 if p_status='accepted' and v_booking.status<>'requested' then
   raise exception 'Booking is not awaiting a response';
 end if;
 if p_status='declined' and v_booking.status<>'requested' then
   raise exception 'Only a pending request can be declined';
 end if;
 if p_status='confirmed' and (v_booking.status<>'accepted' or auth.uid()<>v_booking.student_id) then
   raise exception 'Student confirmation is required after tutor acceptance';
 end if;
 if p_status='completed' and auth.uid()<>v_tutor_user and not v_is_admin then
   raise exception 'Only tutor or admin can complete';
 end if;
 if p_status='completed' and v_booking.status not in ('confirmed','accepted') then
   raise exception 'Only confirmed sessions can be completed';
 end if;
 if p_status='cancelled' and v_booking.status not in ('requested','accepted','confirmed') then
   raise exception 'Booking cannot be cancelled';
 end if;
 if p_status='no_show' and not v_is_admin then
   raise exception 'Only admin can mark no-show';
 end if;
 if p_status='no_show' and v_booking.status not in ('accepted','confirmed') then
   raise exception 'Only an accepted session can be marked no-show';
 end if;
 if p_status='no_show' and now() < v_booking.starts_at + make_interval(mins=>v_booking.duration_minutes) then
   raise exception 'A session cannot be marked no-show before its scheduled end';
 end if;

 update tutor_bookings
 set status=p_status,cancellation_reason=left(p_reason,500),updated_at=now()
 where id=p_booking_id;

 v_recipient := case when auth.uid()=v_booking.student_id then v_tutor_user else v_booking.student_id end;
 insert into user_notifications(recipient_id,actor_id,event_type,title,body,entity_type,entity_id)
 values(v_recipient,auth.uid(),'booking_'||p_status,'Booking '||replace(p_status,'_',' '),'Your tutoring booking status changed to '||replace(p_status,'_',' ')||'.','booking',p_booking_id);
end $$;

commit;
