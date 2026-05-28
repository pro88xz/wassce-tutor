-- ============================================================
-- WASSCE TUTOR — Phase 2 content schema
-- papers -> questions -> options
-- ============================================================

-- PAPERS (a practice set / past paper, tied to a subject)
create table public.papers (
  id          uuid primary key default gen_random_uuid(),
  subject_id  uuid not null references public.subjects(id) on delete cascade,
  title       text not null,
  year        int,
  paper_type  text,                          -- e.g. 'Paper 1', 'Mock', 'Practice'
  description text,
  question_count int not null default 0,     -- denormalized for quick display
  sort_order  int not null default 0,
  is_published boolean not null default true,
  created_at  timestamptz not null default now()
);

-- QUESTIONS (belongs to a paper)
create table public.questions (
  id          uuid primary key default gen_random_uuid(),
  paper_id    uuid not null references public.papers(id) on delete cascade,
  stem        text not null,                 -- the question text
  image_url   text,                          -- optional diagram
  explanation text,                          -- why the correct answer is right
  position    int not null default 0,        -- order within the paper
  created_at  timestamptz not null default now()
);

-- OPTIONS (the MCQ choices for a question)
create table public.options (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  label       text not null,                 -- 'A', 'B', 'C', 'D'
  content     text not null,                 -- the option text
  is_correct  boolean not null default false,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);

-- Indexes for the common lookups
create index idx_papers_subject   on public.papers(subject_id);
create index idx_questions_paper  on public.questions(paper_id);
create index idx_options_question on public.options(question_id);
