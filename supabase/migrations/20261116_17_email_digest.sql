-- 2026-11-16 · Weekly progress email (17). Run after 16. Safe to run twice.
-- Applied by the "Set up email engine" workflow.
--
-- One read-only function for the email engine (server key only): each
-- student's real last 7 days, for the Sunday progress email. Nothing here is
-- estimated; a student with no study this week gets no email.

begin;

create or replace function public.email_student_week(p_users uuid[])
returns table (
  user_id uuid,
  lessons_week integer,         -- lessons completed in the last 7 days
  practice_week integer,        -- practice sets submitted in the last 7 days
  score_week integer,           -- their average practice score this week, %, or null
  subjects_week text[],         -- subjects studied this week, by name
  focus_subject_id uuid,        -- the subject studied most recently
  focus_subject_name text,
  focus_done integer,           -- lessons completed in that subject, ever
  focus_total integer,          -- published lessons in that subject
  new_lessons_week integer,     -- lessons published in that subject in the last 7 days
  next_lesson_id uuid,          -- the next lesson they have not done, after the last one they did
  next_lesson_title text,
  next_topic_name text,
  next_lesson_free boolean
)
language sql stable security definer set search_path = '' as $$
  with people as (
    select distinct unnest(p_users) as id
  ),
  week_lessons as (
    select x.profile_id, x.completed_at as happened, t.subject_id
    from public.lesson_progress x
    join public.lessons l on l.id = x.lesson_id
    join public.topics t on t.id = l.topic_id
    where x.profile_id = any (p_users) and x.completed_at > now() - interval '7 days'
  ),
  week_practice as (
    select a.profile_id, a.created_at as happened, a.score, a.total, pa.subject_id
    from public.attempts a
    join public.papers pa on pa.id = a.paper_id
    where a.profile_id = any (p_users) and a.created_at > now() - interval '7 days'
  ),
  week_events as (
    select profile_id, happened, subject_id from week_lessons
    union all
    select profile_id, happened, subject_id from week_practice
  ),
  focus as (
    select distinct on (profile_id) profile_id, subject_id
    from week_events
    order by profile_id, happened desc
  )
  select
    p.id,
    (select count(*) from week_lessons w where w.profile_id = p.id)::integer,
    (select count(*) from week_practice w where w.profile_id = p.id)::integer,
    (select round(100.0 * sum(w.score) / nullif(sum(w.total), 0))::integer from week_practice w where w.profile_id = p.id),
    (select array_agg(distinct s.name order by s.name)
       from week_events e join public.subjects s on s.id = e.subject_id
      where e.profile_id = p.id),
    f.subject_id,
    fs.name,
    (select count(*)
       from public.lesson_progress x
       join public.lessons l on l.id = x.lesson_id
       join public.topics t on t.id = l.topic_id
      where x.profile_id = p.id and t.subject_id = f.subject_id and l.is_published)::integer,
    (select count(*)
       from public.lessons l join public.topics t on t.id = l.topic_id
      where t.subject_id = f.subject_id and l.is_published)::integer,
    (select count(*)
       from public.lessons l join public.topics t on t.id = l.topic_id
      where t.subject_id = f.subject_id and l.is_published and l.created_at > now() - interval '7 days')::integer,
    nl.id, nl.title, nl.topic_name, nl.free
  from people p
  left join focus f on f.profile_id = p.id
  left join public.subjects fs on fs.id = f.subject_id
  -- Where they are in the syllabus: the most recent lesson they completed in that subject.
  left join lateral (
    select t.sort_order as topic_sort, l.sort_order as lesson_sort, t.name as topic_name, l.id as lesson_id
    from public.lesson_progress x
    join public.lessons l on l.id = x.lesson_id
    join public.topics t on t.id = l.topic_id
    where x.profile_id = p.id and t.subject_id = f.subject_id
    order by x.completed_at desc
    limit 1
  ) here on true
  -- The next published lesson they have not done: after "here" in syllabus order, else the first one left.
  left join lateral (
    select l.id, l.title, t.name as topic_name, public.is_free_lesson(l.id) as free
    from public.lessons l
    join public.topics t on t.id = l.topic_id
    where t.subject_id = f.subject_id
      and l.is_published
      and not exists (select 1 from public.lesson_progress x where x.profile_id = p.id and x.lesson_id = l.id)
    order by
      case when here.lesson_id is not null
             and (t.sort_order, t.name, l.sort_order, l.id::text) > (here.topic_sort, here.topic_name, here.lesson_sort, here.lesson_id::text)
           then 0 else 1 end,
      t.sort_order, t.name, l.sort_order, l.id
    limit 1
  ) nl on true
$$;

revoke all on function public.email_student_week(uuid[]) from public, anon, authenticated;
grant execute on function public.email_student_week(uuid[]) to service_role;

commit;

-- Rollback: drop function if exists public.email_student_week(uuid[]);
