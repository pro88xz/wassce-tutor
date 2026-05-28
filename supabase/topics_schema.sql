-- ============================================================
-- WASSCE TUTOR — Phase 5 topics & lessons
-- Adds the "learn then test" layer
-- ============================================================

create table public.topics (
  id          uuid primary key default gen_random_uuid(),
  subject_id  uuid not null references public.subjects(id) on delete cascade,
  slug        text not null,
  name        text not null,
  description text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  unique (subject_id, slug)
);

create table public.lessons (
  id          uuid primary key default gen_random_uuid(),
  topic_id    uuid not null references public.topics(id) on delete cascade,
  slug        text not null,
  title       text not null,
  content     text not null,            -- markdown body
  est_minutes int,                      -- estimated reading time
  sort_order  int not null default 0,
  is_published boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (topic_id, slug)
);

-- Add nullable topic_id to existing questions (backward-compatible)
alter table public.questions
  add column topic_id uuid references public.topics(id) on delete set null;

create index idx_topics_subject     on public.topics(subject_id);
create index idx_lessons_topic      on public.lessons(topic_id);
create index idx_questions_topic    on public.questions(topic_id);

-- RLS: authenticated read; writes via service role only
alter table public.topics  enable row level security;
alter table public.lessons enable row level security;

create policy "topics readable by authenticated"
  on public.topics for select to authenticated using (true);

create policy "lessons readable by authenticated"
  on public.lessons for select to authenticated using (true);
