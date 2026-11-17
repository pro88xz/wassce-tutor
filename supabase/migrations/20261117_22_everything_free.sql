-- 20261117_22_everything_free.sql
--
-- Every lesson and every practice set is free, for everyone, signed in or not.
--
-- Before (migrations 07, 08, 13): a free account opened the first lesson of
-- each topic and one starter practice set per subject; a plan opened the rest.
-- Only the free lesson of each topic had a public page, so Google could read
-- about 350 of the lessons and none of the other practice questions.
--
-- After:
--   * Every published lesson is readable by everyone (signed-out visitors
--     too) and has a public page at /wassce/{subject}/{topic}/{lesson}.
--   * Every published practice set is open, with its answers and working,
--     and its questions are public (wassce_public_questions).
--   * Plans (paid through Monime) are unchanged and still give the AI study
--     tutor (user_has_access(), checked by the chat-tutor function) and the
--     timed mock exams (papers.paper_type = 'Mock'). A mock exam's questions
--     are copies of practice questions, so no question is behind the plan.
--   * Nothing about payments, profiles or the AI tutor's daily limit changes.
--
-- Safe to run more than once. To put a mock exam on the free account too:
--   update public.papers set is_free = true where id = '<paper id>';

begin;

-- 1 · Lessons: every published lesson is free ───────────────────────────────
-- is_free_lesson() is kept (the email digest, migration 17, calls it) and
-- now means "published".
create or replace function public.is_free_lesson(p_lesson uuid)
 returns boolean
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select exists (select 1 from lessons l where l.id = p_lesson and l.is_published);
$function$;
revoke execute on function public.is_free_lesson(uuid) from public;
grant execute on function public.is_free_lesson(uuid) to anon, authenticated;

-- Same rule as migration 13 with the free-lesson test folded in: published
-- lessons for everyone, unpublished ones for admins only.
drop policy if exists "lessons readable by access holders" on public.lessons;
drop policy if exists "lessons readable by everyone when published" on public.lessons;
create policy "lessons readable by everyone when published" on public.lessons
  for select to public
  using (public.is_admin() or is_published);

-- Lesson index: same columns and order as migration 08; every lesson is
-- public and free.
create or replace view public.wassce_lesson_index with (security_invoker = false) as
  select l.id, l.topic_id, l.slug, l.title, l.est_minutes, l.sort_order,
         true as is_public, l.updated_at, true as is_free
  from public.lessons l
  where l.is_published;
revoke all on public.wassce_lesson_index from public, anon, authenticated;
grant select on public.wassce_lesson_index to anon, authenticated;

-- Public lessons: every published lesson (same columns as migration 08).
create or replace view public.wassce_public_lessons with (security_invoker = false) as
  select l.id, l.topic_id, l.slug, l.title, l.content, l.est_minutes, l.sort_order,
         l.reviewed_at, l.updated_at, r.full_name as reviewer_name, r.public_bio as reviewer_bio
  from public.lessons l
  left join public.profiles r on r.id = l.reviewed_by and l.reviewed_at is not null
  where l.is_published;
comment on view public.wassce_public_lessons is
  'Public: full content of every published lesson. Review is optional; when present it gives the byline.';
revoke all on public.wassce_public_lessons from public, anon, authenticated;
grant select on public.wassce_public_lessons to anon, authenticated;

-- 2 · Practice: every set is free; timed mock exams stay with a plan ─────────
-- is_free now marks every practice set (the app shows it), and the rules
-- below open any set that is not a mock exam whatever is_free says, so a
-- set added later is open straight away.
update public.papers set is_free = true
where coalesce(paper_type, '') <> 'Mock' and not is_free;

drop policy if exists "questions readable by access holders" on public.questions;
create policy "questions readable by access holders" on public.questions
  for select to public
  using (
    public.is_admin()
    or exists (
      select 1 from public.papers p
      where p.id = questions.paper_id and p.is_published
        and (coalesce(p.paper_type, '') <> 'Mock' or p.is_free or public.user_has_access())
    )
  );

drop policy if exists "options readable by access holders" on public.options;
create policy "options readable by access holders" on public.options
  for select to public
  using (
    public.is_admin()
    or exists (
      select 1 from public.questions q join public.papers p on p.id = q.paper_id
      where q.id = options.question_id and p.is_published
        and (coalesce(p.paper_type, '') <> 'Mock' or p.is_free or public.user_has_access())
    )
  );

-- Public questions: every question in a published practice set, plus any
-- marked public (same columns as migration 08). Mock exams are left out:
-- their questions repeat practice questions, and each should appear once.
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
     or exists (
       select 1 from public.papers p
       where p.id = q.paper_id and p.is_published and coalesce(p.paper_type, '') <> 'Mock'
     );
comment on view public.wassce_public_questions is
  'Public: every question in a published practice set (not mock exams) and questions marked is_public, with options and answers.';
revoke all on public.wassce_public_questions from public, anon, authenticated;
grant select on public.wassce_public_questions to anon, authenticated;

commit;
