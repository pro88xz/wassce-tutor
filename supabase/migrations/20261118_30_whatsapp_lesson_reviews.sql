-- 2026-11-18 · Record the lesson reviews the tutors gave on WhatsApp (30).
-- Run after 29. Safe to run twice. Applied by the "Apply database migrations"
-- workflow.
--
-- On 18 November 2026 the founder sent each verified reviewer the live topics
-- of the subjects they teach on WhatsApp, and each reviewer read and approved
-- the first 10 live topics of every one of their subjects (about three hours).
-- This records those approvals the same way the Review screen does: every
-- published lesson in those topics gets reviewed_at and reviewed_by, so it
-- says "Reviewed by" the tutor with a link to their page.
--
-- "First 10 live topics": topics with at least one published lesson, in the
-- order the subject page lists them (by syllabus section, then order).
-- Chemistry is taught by two reviewers and a lesson carries one name: it is
-- recorded for John Kaitibie (BSc Chemistry), the first in the list below.
-- A lesson already reviewed is never changed.
--
-- To undo for one tutor: update public.lessons set reviewed_at = null,
-- reviewed_by = null where reviewed_by = (select user_id from public.tutors
-- where slug = '<slug>');

begin;

do $$
declare
  v_reviewers text[] := array['john-kaitibie', 'mohamed-bangura', 'nicholas-norman'];
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

    with live as (
      select tp.id,
             row_number() over (
               partition by tp.subject_id
               order by coalesce(tp.group_order, 999), tp.group_name, tp.sort_order, tp.id
             ) as position
        from public.topics tp
       where tp.subject_id in (
               select ts.subject_id from public.tutor_subjects ts
                where ts.tutor_id = v_tutor and not (ts.subject_id = any (v_done)))
         and exists (select 1 from public.lessons l where l.topic_id = tp.id and l.is_published)
    )
    update public.lessons l
       set reviewed_at = now(), reviewed_by = v_user, is_public = true, updated_at = now()
      from live
     where l.topic_id = live.id and live.position <= 10 and l.is_published and l.reviewed_at is null;
    get diagnostics v_count = row_count;
    raise notice '%: % lessons recorded as reviewed', v_slug, v_count;

    v_done := v_done || array(select ts.subject_id from public.tutor_subjects ts where ts.tutor_id = v_tutor);
  end loop;
end $$;

commit;
