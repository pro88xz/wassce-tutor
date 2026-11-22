-- 2026-11-22 · What the study emails can offer each student (34). Run after 33.
-- Safe to run twice. Applied by the "Apply database migrations" workflow.
--
-- One read-only function for the email engine (server key only). For each
-- student it finds, from their own records:
--   - a question to answer in the email: a reviewed public practice question
--     from the subject they studied last (else the first subject they chose),
--     that they have not answered before. Only questions that read well in an
--     email: no diagram, maths, table, quoted passage or link, four short
--     options. The same student gets the same question all day, a new one the
--     next day.
--   - their weakest subject: a practice average under 50% over at least two
--     sets in the last 60 days (the lowest, if several);
--   - a tutor for it: an active, listed tutor who teaches that subject, with
--     their fee and lessons a week;
--   - where to continue: the next published lesson they have not done in the
--     subject they studied last.
-- Anything not found is null, and the email leaves that part out.

begin;

create or replace function public.email_student_extras(p_users uuid[])
returns table (
  user_id uuid,
  question_id uuid,
  question_stem text,
  question_options jsonb,       -- [{ label, content }], in order, without the answer
  question_subject text,
  question_topic text,
  weak_subject_id uuid,
  weak_subject_name text,
  weak_subject_slug text,
  weak_avg integer,             -- %, over weak_sets sets
  weak_sets integer,
  tutor_slug text,
  tutor_name text,
  tutor_location text,
  tutor_price numeric,
  tutor_lessons_per_week smallint,
  next_lesson_id uuid,
  next_lesson_title text,
  next_topic_name text,
  next_subject_name text
)
language sql stable security definer set search_path = '' as $$
  with people as (
    select distinct unnest(p_users) as id
  ),
  -- The subject each student studied last (a lesson or a practice set), else the first one they chose.
  studied as (
    select x.profile_id, x.completed_at as happened, t.subject_id
    from public.lesson_progress x
    join public.lessons l on l.id = x.lesson_id
    join public.topics t on t.id = l.topic_id
    where x.profile_id = any (p_users)
    union all
    select a.profile_id, a.created_at, pa.subject_id
    from public.attempts a
    join public.papers pa on pa.id = a.paper_id
    where a.profile_id = any (p_users)
  ),
  focus as (
    select p.id as profile_id,
           coalesce(
             (select s.subject_id from studied s where s.profile_id = p.id order by s.happened desc limit 1),
             (select ss.subject_id from public.student_subjects ss where ss.profile_id = p.id order by ss.subject_id limit 1)
           ) as subject_id
    from people p
  ),
  -- Practice average per subject in the last 60 days; weak means under 50% over two sets or more.
  weak as (
    select distinct on (a.profile_id) a.profile_id, pa.subject_id,
           round(100.0 * sum(a.score) / nullif(sum(a.total), 0))::integer as avg_pct,
           count(*)::integer as sets
    from public.attempts a
    join public.papers pa on pa.id = a.paper_id
    where a.profile_id = any (p_users) and a.created_at > now() - interval '60 days' and a.total > 0
    group by a.profile_id, pa.subject_id
    having count(*) >= 2 and 100.0 * sum(a.score) / nullif(sum(a.total), 0) < 50
    order by a.profile_id, 100.0 * sum(a.score) / nullif(sum(a.total), 0) asc
  )
  select
    p.id,
    q.id, q.stem, q.options, qs.name, qt.name,
    w.subject_id, ws.name, ws.slug, w.avg_pct, w.sets,
    tu.slug, tu.full_name, tu.location, tu.price_nle, tu.lessons_per_week,
    nl.id, nl.title, nl.topic_name, fs.name
  from people p
  left join focus f on f.profile_id = p.id
  left join public.subjects fs on fs.id = f.subject_id
  -- A question for the email.
  left join lateral (
    select pq.id, pq.stem, pq.topic_id,
           (select jsonb_agg(jsonb_build_object('label', o.label, 'content', o.content) order by o.position)
              from public.options o where o.question_id = pq.id) as options
    from public.wassce_public_questions pq
    join public.topics t on t.id = pq.topic_id
    where t.subject_id = f.subject_id
      and pq.image_url is null
      and length(pq.stem) <= 280
      and pq.stem !~ '[$|]|\]\(|(^|\n)\s*>'
      and jsonb_array_length(pq.options) = 4
      and not exists (
        select 1 from public.options o
        where o.question_id = pq.id and (length(o.content) > 90 or o.content ~ '[$|]|\]\(')
      )
      and not exists (
        select 1 from public.attempt_answers aa
        join public.attempts a on a.id = aa.attempt_id
        where a.profile_id = p.id and aa.question_id = pq.id
      )
    order by md5(pq.id::text || p.id::text || current_date::text)
    limit 1
  ) q on true
  left join public.topics qt on qt.id = q.topic_id
  left join public.subjects qs on qs.id = qt.subject_id
  -- The weakest subject, and a tutor who teaches it.
  left join weak w on w.profile_id = p.id
  left join public.subjects ws on ws.id = w.subject_id
  left join lateral (
    select t.slug, t.full_name, t.location, ts.price_nle, ts.lessons_per_week
    from public.tutors t
    join public.tutor_subjects ts on ts.tutor_id = t.id
    where ts.subject_id = w.subject_id and t.status = 'active' and t.listed and t.slug is not null
    order by t.verified_at desc nulls last, t.id
    limit 1
  ) tu on true
  -- Where to continue: after the last lesson they finished in that subject, else the first one left.
  left join lateral (
    select t.sort_order as topic_sort, l.sort_order as lesson_sort, t.name as topic_name, l.id as lesson_id
    from public.lesson_progress x
    join public.lessons l on l.id = x.lesson_id
    join public.topics t on t.id = l.topic_id
    where x.profile_id = p.id and t.subject_id = f.subject_id
    order by x.completed_at desc
    limit 1
  ) here on true
  left join lateral (
    select l.id, l.title, t.name as topic_name
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

revoke all on function public.email_student_extras(uuid[]) from public, anon, authenticated;
grant execute on function public.email_student_extras(uuid[]) to service_role;

commit;

-- Rollback: drop function if exists public.email_student_extras(uuid[]);
