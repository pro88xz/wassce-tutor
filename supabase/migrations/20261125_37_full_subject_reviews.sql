-- 2026-11-25 · Record the full-subject lesson reviews by Nicholas Norman and John Kaitibie (37).
-- Run after 36. Safe to run twice. Applied by the "Apply database migrations"
-- workflow.
--
-- Migration 30 recorded the reviews the verified reviewers gave on 18 November:
-- the first 10 live topics of each subject they teach. In the week that
-- followed, Nicholas Norman and John Kaitibie read and approved every other
-- published lesson in the subjects they teach, as the founder confirmed on
-- 25 November 2026. This records those approvals the same way the Review
-- screen and migration 30 do: every published lesson in every topic of their
-- subjects (tutor_subjects) that is not yet reviewed gets reviewed_at and
-- reviewed_by, so its page says "Reviewed by" the tutor, with a link to their
-- page, and tells search engines who reviewed it and when.
--
--   Nicholas Norman: Business Management, Commerce, Economics, English
--     Language, ICT / Computer Studies.
--   John Kaitibie: Chemistry, Mathematics, Further Mathematics.
--
-- Chemistry is also taught by Mohamed Bangura, who is not part of this
-- review; its remaining lessons are recorded for John Kaitibie, who reviewed
-- them. Subjects neither of them teaches (Biology, Physics, Geography,
-- History, Government, Financial Accounting, Agricultural Science,
-- Literature in English) are not touched: no one has reviewed them in full.
-- A lesson already reviewed is never changed. Only lessons created before the
-- reviews were confirmed are recorded: one created later still needs a review
-- on the Review screen.
--
-- reviewed_at is the date the reviews were confirmed, 25 November 2026, so
-- these approvals can be found (and undone) exactly:
--   update public.lessons set reviewed_at = null, reviewed_by = null
--    where reviewed_at = timestamptz '2026-11-25 18:00:00+00'
--      and reviewed_by in (select user_id from public.tutors
--                           where slug in ('john-kaitibie', 'nicholas-norman'));

begin;

do $$
declare
  -- John first: a subject both teach (none today) is recorded for the first.
  v_reviewers text[] := array['john-kaitibie', 'nicholas-norman'];
  v_at constant timestamptz := timestamptz '2026-11-25 18:00:00+00';
  v_slug text;
  v_user uuid;
  v_tutor uuid;
  v_done uuid[] := '{}';
  v_count integer;
begin
  foreach v_slug in array v_reviewers loop
    v_user := null;
    select t.user_id, t.id into v_user, v_tutor from public.tutors t where t.slug = v_slug and t.status = 'active' and t.reviewer;
    if v_user is null then
      raise notice '%: not an active reviewer, skipped', v_slug;
      continue;
    end if;

    update public.lessons l
       set reviewed_at = v_at, reviewed_by = v_user, is_public = true, updated_at = now()
      from public.topics tp
     where l.topic_id = tp.id
       and tp.subject_id in (
             select ts.subject_id from public.tutor_subjects ts
              where ts.tutor_id = v_tutor and not (ts.subject_id = any (v_done)))
       and l.is_published
       and l.created_at < v_at
       and l.reviewed_at is null;
    get diagnostics v_count = row_count;
    raise notice '%: % lessons recorded as reviewed', v_slug, v_count;

    v_done := v_done || array(select ts.subject_id from public.tutor_subjects ts where ts.tutor_id = v_tutor);
  end loop;
end $$;

commit;
