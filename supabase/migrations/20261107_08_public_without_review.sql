-- 20261107_08_public_without_review.sql
--
-- Review is no longer a gate for content going live.
--
-- Before: a lesson or question appeared on the public website (signed-out
-- visitors, Google) only after an admin reviewed it, and the database refused
-- is_public without reviewed_at. Nothing had been reviewed, so the public site
-- showed no lessons at all, even though students in the app could read them.
--
-- After:
--   * The free lesson of every topic (its first published lesson, the same
--     rule as is_free_lesson()) is public automatically, reviewed or not.
--     Signed-out visitors could already read it through the lessons policy;
--     now it also gets its public page. Paid lessons stay locked.
--   * An admin can still make any other lesson public; review is optional.
--   * Review stays as a quality mark: it adds the reviewer's byline.
--   * Questions in free starter sets are public the same way.
--
-- Safe to run more than once.

begin;

-- 1 · is_public no longer requires a review ─────────────────────────────────
alter table public.lessons drop constraint if exists lessons_public_requires_review;
alter table public.questions drop constraint if exists questions_public_requires_review;

-- 2 · Lesson index: a lesson is public if marked so or if it is the free one ─
-- (same columns, same order as migration 07; only is_public's rule changes)
create or replace view public.wassce_lesson_index with (security_invoker = false) as
  select x.id, x.topic_id, x.slug, x.title, x.est_minutes, x.sort_order,
         (x.is_public or x.is_free) as is_public, x.updated_at, x.is_free
  from (
    select l.id, l.topic_id, l.slug, l.title, l.est_minutes, l.sort_order, l.is_public, l.updated_at,
           row_number() over (partition by l.topic_id order by l.sort_order, l.id) = 1 as is_free
    from public.lessons l
    where l.is_published
  ) x;
revoke all on public.wassce_lesson_index from public, anon, authenticated;
grant select on public.wassce_lesson_index to anon, authenticated;

-- 3 · Public lessons: free lessons and lessons marked public, reviewed or not.
-- (same columns as migration 04; reviewed_at and the reviewer are null for
-- unreviewed lessons)
create or replace view public.wassce_public_lessons with (security_invoker = false) as
  select l.id, l.topic_id, l.slug, l.title, l.content, l.est_minutes, l.sort_order,
         l.reviewed_at, l.updated_at, r.full_name as reviewer_name, r.public_bio as reviewer_bio
  from (
    select l.*, row_number() over (partition by l.topic_id order by l.sort_order, l.id) = 1 as is_free
    from public.lessons l
    where l.is_published
  ) l
  left join public.profiles r on r.id = l.reviewed_by and l.reviewed_at is not null
  where l.is_public or l.is_free;
comment on view public.wassce_public_lessons is
  'Public: full content of each topic''s free lesson and of lessons marked is_public. Review is optional; when present it gives the byline.';
revoke all on public.wassce_public_lessons from public, anon, authenticated;
grant select on public.wassce_public_lessons to anon, authenticated;

-- 4 · Public questions: free starter sets and questions marked public ───────
create or replace view public.wassce_public_questions with (security_invoker = false) as
  select q.id, q.paper_id, q.topic_id, q.stem, q.image_url, q.explanation, q.position,
         q.reviewed_at, q.updated_at,
         coalesce((
           select jsonb_agg(jsonb_build_object('label', o.label, 'content', o.content, 'is_correct', o.is_correct)
                            order by o.position)
           from public.options o
           where o.question_id = q.id
         ), '[]'::jsonb) as options
  from public.questions q
  where q.is_public
     or exists (select 1 from public.papers p where p.id = q.paper_id and p.is_published and p.is_free);
comment on view public.wassce_public_questions is
  'Public: questions in free starter sets and questions marked is_public, with their options and answers. Review is optional.';
revoke all on public.wassce_public_questions from public, anon, authenticated;
grant select on public.wassce_public_questions to anon, authenticated;

commit;
