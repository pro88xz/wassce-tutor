-- 2026-11-05 · Foundations for public, indexable WASSCE pages. Run after 01.
--
-- 1. updated_at on content tables (kept current by a trigger) so the sitemap
--    can give Google accurate "last modified" dates. Existing rows start at
--    their created_at.
-- 2. Editorial workflow: lessons and questions get is_public, reviewed_at and
--    reviewed_by. Nothing is public until a named person has reviewed it, and
--    the database enforces that (is_public requires reviewed_at).
-- 3. papers.slug, for readable URLs. Filled automatically for new papers.
-- 4. Topic names and descriptions become readable by everyone (they are the
--    syllabus outline shown on public topic pages). Lessons, papers, questions
--    and options stay behind user_has_access().
-- 5. Read-only public views for the build that prerenders public pages:
--      wassce_lesson_index      lesson titles and lengths, never the content
--      wassce_public_lessons    full content of reviewed lessons marked public
--      wassce_public_questions  reviewed questions marked public, with options
--      wassce_stats             counts for the homepage
--    The views run with their owner's rights (they read past row-level
--    security), so each one selects only what is safe to publish, and the
--    API roles get SELECT only (a simple view is otherwise updatable).

begin;

-- 1 ─────────────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
 returns trigger
 language plpgsql
 set search_path to ''
as $function$
begin
  new.updated_at := now();
  return new;
end;
$function$;

do $$
declare
  t text;
begin
  foreach t in array array['faculties', 'subjects', 'topics', 'lessons', 'papers', 'questions'] loop
    execute format('alter table public.%I add column if not exists updated_at timestamptz', t);
    execute format('update public.%I set updated_at = created_at where updated_at is null', t);
    execute format('alter table public.%I alter column updated_at set default now(), alter column updated_at set not null', t);
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- 2 ─────────────────────────────────────────────────────────────────────────
alter table public.lessons
  add column if not exists is_public boolean not null default false,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references public.profiles(id) on delete set null;
alter table public.lessons drop constraint if exists lessons_public_requires_review;
alter table public.lessons add constraint lessons_public_requires_review
  check (not is_public or reviewed_at is not null);

alter table public.questions
  add column if not exists is_public boolean not null default false,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references public.profiles(id) on delete set null;
alter table public.questions drop constraint if exists questions_public_requires_review;
alter table public.questions add constraint questions_public_requires_review
  check (not is_public or reviewed_at is not null);

-- 3 ─────────────────────────────────────────────────────────────────────────
create or replace function public.slugify(p text)
 returns text
 language sql
 immutable
 set search_path to ''
as $function$
  select trim(both '-' from regexp_replace(lower(coalesce(p, '')), '[^a-z0-9]+', '-', 'g'));
$function$;

alter table public.papers add column if not exists slug text;

with base as (
  select id, subject_id, public.slugify(title) as s,
         row_number() over (partition by subject_id, public.slugify(title) order by created_at, id) as n
  from public.papers
  where slug is null
)
update public.papers p
set slug = case when base.n = 1 then base.s else base.s || '-' || base.n end
from base
where p.id = base.id;

create or replace function public.papers_fill_slug()
 returns trigger
 language plpgsql
 set search_path to ''
as $function$
declare
  v_base text := public.slugify(coalesce(new.slug, new.title));
  v_slug text := v_base;
  v_n int := 1;
begin
  if new.slug is null or new.slug = '' then
    while exists (select 1 from public.papers where subject_id = new.subject_id and slug = v_slug and id <> new.id) loop
      v_n := v_n + 1;
      v_slug := v_base || '-' || v_n;
    end loop;
    new.slug := v_slug;
  end if;
  return new;
end;
$function$;

drop trigger if exists papers_fill_slug on public.papers;
create trigger papers_fill_slug before insert or update of slug, title on public.papers
  for each row execute function public.papers_fill_slug();

alter table public.papers alter column slug set not null;
create unique index if not exists papers_subject_id_slug_key on public.papers (subject_id, slug);

-- 4 ─────────────────────────────────────────────────────────────────────────
drop policy if exists "topics readable by authenticated" on public.topics;
drop policy if exists "topics readable by all" on public.topics;
create policy "topics readable by all" on public.topics
  for select to public
  using (true);

-- 5 ─────────────────────────────────────────────────────────────────────────
create or replace view public.wassce_lesson_index with (security_invoker = false) as
  select l.id, l.topic_id, l.slug, l.title, l.est_minutes, l.sort_order, l.is_public, l.updated_at
  from public.lessons l
  where l.is_published;
comment on view public.wassce_lesson_index is
  'Public: lesson titles for topic pages. Never add the content column here.';

create or replace view public.wassce_public_lessons with (security_invoker = false) as
  select l.id, l.topic_id, l.slug, l.title, l.content, l.est_minutes, l.sort_order,
         l.reviewed_at, l.updated_at, r.full_name as reviewer_name
  from public.lessons l
  left join public.profiles r on r.id = l.reviewed_by
  where l.is_published and l.is_public and l.reviewed_at is not null;
comment on view public.wassce_public_lessons is
  'Public: full content of reviewed lessons marked is_public, with the reviewer''s name for the byline.';

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
  where q.is_public and q.reviewed_at is not null;
comment on view public.wassce_public_questions is
  'Public: reviewed questions marked is_public, with their options and answers.';

create or replace view public.wassce_stats with (security_invoker = false) as
  select (select count(*) from public.subjects) as subjects,
         (select count(*) from public.topics) as topics,
         (select count(*) from public.lessons where is_published) as lessons,
         (select count(*) from public.questions) as questions;
comment on view public.wassce_stats is 'Public: content counts for the homepage.';

revoke all on public.wassce_lesson_index, public.wassce_public_lessons,
              public.wassce_public_questions, public.wassce_stats
  from public, anon, authenticated;
grant select on public.wassce_lesson_index, public.wassce_public_lessons,
                public.wassce_public_questions, public.wassce_stats
  to anon, authenticated;

commit;
