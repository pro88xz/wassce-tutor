-- ============================================================
-- WASSCE TUTOR — Phase 2.6 progress tracking
-- attempts (summary) + attempt_answers (detail)
-- ============================================================

create table public.attempts (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  paper_id    uuid not null references public.papers(id) on delete cascade,
  score       int not null,
  total       int not null,
  created_at  timestamptz not null default now()
);

create table public.attempt_answers (
  id            uuid primary key default gen_random_uuid(),
  attempt_id    uuid not null references public.attempts(id) on delete cascade,
  question_id   uuid not null references public.questions(id) on delete cascade,
  option_id     uuid references public.options(id) on delete set null,
  is_correct    boolean not null,
  created_at    timestamptz not null default now()
);

create index idx_attempts_profile      on public.attempts(profile_id);
create index idx_attempts_paper         on public.attempts(paper_id);
create index idx_attempt_answers_attempt on public.attempt_answers(attempt_id);

-- ============================================================
-- RLS: a student sees and writes only their own attempts
-- ============================================================
alter table public.attempts        enable row level security;
alter table public.attempt_answers enable row level security;

create policy "own attempts readable"
  on public.attempts for select
  to authenticated
  using (auth.uid() = profile_id);

create policy "own attempts insertable"
  on public.attempts for insert
  to authenticated
  with check (auth.uid() = profile_id);

-- attempt_answers: readable/insertable if the parent attempt belongs to the user
create policy "own attempt_answers readable"
  on public.attempt_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.attempts a
      where a.id = attempt_id and a.profile_id = auth.uid()
    )
  );

create policy "own attempt_answers insertable"
  on public.attempt_answers for insert
  to authenticated
  with check (
    exists (
      select 1 from public.attempts a
      where a.id = attempt_id and a.profile_id = auth.uid()
    )
  );
