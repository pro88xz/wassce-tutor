-- 2026-11-05 · Lesson progress + reviewer bylines. Run after 03.
--
-- 1. lesson_progress: which lessons each student has completed, for the
--    Progress screen (per-subject and per-topic progress) and the tick marks
--    on topic and lesson screens. Each student sees and changes only their own
--    rows.
-- 2. profiles.public_bio: one line shown under a reviewer's name on public
--    lessons they approved ("Biology teacher, Freetown, 8 years").
-- 3. wassce_public_lessons gains reviewer_bio.

begin;

-- 1 ─────────────────────────────────────────────────────────────────────────
create table if not exists public.lesson_progress (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (profile_id, lesson_id)
);
create index if not exists lesson_progress_profile_completed_idx
  on public.lesson_progress (profile_id, completed_at desc);

alter table public.lesson_progress enable row level security;

drop policy if exists "own lesson progress readable" on public.lesson_progress;
create policy "own lesson progress readable" on public.lesson_progress
  for select to authenticated using (auth.uid() = profile_id);

drop policy if exists "own lesson progress insertable" on public.lesson_progress;
create policy "own lesson progress insertable" on public.lesson_progress
  for insert to authenticated with check (auth.uid() = profile_id);

drop policy if exists "own lesson progress deletable" on public.lesson_progress;
create policy "own lesson progress deletable" on public.lesson_progress
  for delete to authenticated using (auth.uid() = profile_id);

revoke all on public.lesson_progress from anon, public;
grant select, insert, delete on public.lesson_progress to authenticated;

-- 2 ─────────────────────────────────────────────────────────────────────────
alter table public.profiles add column if not exists public_bio text;
alter table public.profiles drop constraint if exists profiles_public_bio_length;
alter table public.profiles add constraint profiles_public_bio_length
  check (public_bio is null or char_length(public_bio) <= 160);

-- 3 ─────────────────────────────────────────────────────────────────────────
-- (create or replace can only add columns at the end, so reviewer_bio goes last)
create or replace view public.wassce_public_lessons with (security_invoker = false) as
  select l.id, l.topic_id, l.slug, l.title, l.content, l.est_minutes, l.sort_order,
         l.reviewed_at, l.updated_at, r.full_name as reviewer_name, r.public_bio as reviewer_bio
  from public.lessons l
  left join public.profiles r on r.id = l.reviewed_by
  where l.is_published and l.is_public and l.reviewed_at is not null;

revoke all on public.wassce_public_lessons from public, anon, authenticated;
grant select on public.wassce_public_lessons to anon, authenticated;

commit;
