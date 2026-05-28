-- ============================================================
-- WASSCE TUTOR — Row Level Security policies
-- ============================================================

-- Enable RLS on every table
alter table public.faculties        enable row level security;
alter table public.subjects         enable row level security;
alter table public.faculty_subjects enable row level security;
alter table public.profiles         enable row level security;
alter table public.student_subjects enable row level security;

-- ---- CATALOGUE: readable by everyone (even anon) ----
create policy "faculties readable by all"
  on public.faculties for select
  using (true);

create policy "subjects readable by all"
  on public.subjects for select
  using (true);

create policy "faculty_subjects readable by all"
  on public.faculty_subjects for select
  using (true);

-- ---- PROFILES: a user sees/edits only their own ----
create policy "own profile readable"
  on public.profiles for select
  using (auth.uid() = id);

create policy "own profile updatable"
  on public.profiles for update
  using (auth.uid() = id);
-- note: INSERT handled by the signup trigger (security definer),
-- so no insert policy needed for normal signup.

-- ---- STUDENT_SUBJECTS: a user manages only their own ----
create policy "own student_subjects readable"
  on public.student_subjects for select
  using (auth.uid() = profile_id);

create policy "own student_subjects insertable"
  on public.student_subjects for insert
  with check (auth.uid() = profile_id);

create policy "own student_subjects deletable"
  on public.student_subjects for delete
  using (auth.uid() = profile_id);
