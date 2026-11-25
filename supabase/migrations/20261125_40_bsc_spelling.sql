-- 2026-11-25 · John Kaitibie's qualification reads "BSc", not "Bsc" (40).
-- Run after 39. Safe to run twice. Applied by the "Apply database migrations"
-- workflow.
--
-- His tutor card says "Bsc Chemistry, Fourah Bay College". Since migration 39
-- that line is on every lesson he reviewed and on /how-we-check-lessons, so
-- the founder asked for the usual spelling of the degree. Only this value is
-- changed, and only while it is still spelled this way, so an edit he makes
-- on his card later is never overwritten.

begin;

update public.tutors
   set qualifications = 'BSc Chemistry, Fourah Bay College', updated_at = now()
 where slug = 'john-kaitibie'
   and qualifications = 'Bsc Chemistry, Fourah Bay College';

commit;
