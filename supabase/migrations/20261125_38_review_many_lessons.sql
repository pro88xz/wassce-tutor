-- 2026-11-25 · Reviewers approve a whole topic or subject at once (38).
-- Run after 37. Safe to run twice. Applied by the "Apply database migrations"
-- workflow.
--
-- The reviewers found approving lesson by lesson (Tutor workspace, Review
-- lessons) slow once they had read a whole topic or subject. This adds
-- tutor_review_lessons(lesson ids): the same approval as
-- tutor_review_lesson(id, 'approved') for many lessons in one call, with the
-- same rules. The caller must be an active, verified reviewer; only published
-- lessons in the subjects they teach are approved; a lesson someone has
-- already approved is left as it is (never taken over). Returns how many were
-- approved. The screen asks the reviewer to confirm they have read them.
--
-- To undo: drop function public.tutor_review_lessons(uuid[]);

begin;

create or replace function public.tutor_review_lessons(p_lessons uuid[])
returns integer language plpgsql security definer set search_path = '' as $$
declare v_t public.tutors%rowtype; v_count integer;
begin
  select * into v_t from public.tutors t where t.user_id = auth.uid() and t.status = 'active' and t.reviewer;
  if not found then raise exception 'Lesson reviewers only'; end if;
  if p_lessons is null or cardinality(p_lessons) = 0 then return 0; end if;
  if cardinality(p_lessons) > 500 then raise exception 'Approve at most 500 lessons at a time'; end if;

  update public.lessons l
     set reviewed_at = now(), reviewed_by = auth.uid(), is_public = true, updated_at = now()
    from public.topics tp
   where l.id = any (p_lessons)
     and tp.id = l.topic_id
     and l.is_published
     and l.reviewed_at is null
     and exists (select 1 from public.tutor_subjects ts where ts.tutor_id = v_t.id and ts.subject_id = tp.subject_id);
  get diagnostics v_count = row_count;
  return v_count;
end $$;

revoke all on function public.tutor_review_lessons(uuid[]) from public, anon;
grant execute on function public.tutor_review_lessons(uuid[]) to authenticated;

commit;
