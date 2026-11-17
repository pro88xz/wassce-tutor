-- 20261117_24_key_term_progress.sql
--
-- Key terms (the lessons' definitions as revision cards, src/lib/key-terms.ts):
-- what each student knows. In the app a student marks a card "I know this"
-- or "Not yet"; the topic screen shows how many they know, and revision
-- starts with the ones they do not know yet.
--
-- A card's id is made from its lesson and term (`<lesson uuid>:<term slug>`)
-- by the app, so it is text, not a foreign key. Each student sees and
-- changes only their own rows, like lesson_progress (migration 04).
--
-- Safe to run more than once.

begin;

create table if not exists public.key_term_progress (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  term_id text not null check (char_length(term_id) between 3 and 200),
  known boolean not null,
  updated_at timestamptz not null default now(),
  primary key (profile_id, term_id)
);

alter table public.key_term_progress enable row level security;

drop policy if exists "own key term progress readable" on public.key_term_progress;
create policy "own key term progress readable" on public.key_term_progress
  for select to authenticated using (auth.uid() = profile_id);

drop policy if exists "own key term progress insertable" on public.key_term_progress;
create policy "own key term progress insertable" on public.key_term_progress
  for insert to authenticated with check (auth.uid() = profile_id);

drop policy if exists "own key term progress updatable" on public.key_term_progress;
create policy "own key term progress updatable" on public.key_term_progress
  for update to authenticated using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

drop policy if exists "own key term progress deletable" on public.key_term_progress;
create policy "own key term progress deletable" on public.key_term_progress
  for delete to authenticated using (auth.uid() = profile_id);

revoke all on public.key_term_progress from anon, public;
grant select, insert, update, delete on public.key_term_progress to authenticated;

commit;
