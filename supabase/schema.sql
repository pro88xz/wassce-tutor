-- ============================================================
-- WASSCE TUTOR — Phase 1 schema
-- Faculties, subjects (many-to-many), profiles, trial state
-- ============================================================

-- 1. FACULTIES
create table public.faculties (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- 2. SUBJECTS (each subject exists once)
create table public.subjects (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

-- 3. FACULTY_SUBJECTS (many-to-many join)
-- role: 'core' (all faculties), 'faculty' (defining), 'elective' (optional)
create table public.faculty_subjects (
  id          uuid primary key default gen_random_uuid(),
  faculty_id  uuid not null references public.faculties(id) on delete cascade,
  subject_id  uuid not null references public.subjects(id) on delete cascade,
  role        text not null check (role in ('core','faculty','elective')),
  is_default  boolean not null default false, -- pre-selected during onboarding
  sort_order  int not null default 0,
  unique (faculty_id, subject_id)
);

-- 4. PROFILES (extends auth.users)
create table public.profiles (
  id                     uuid primary key references auth.users(id) on delete cascade,
  full_name              text,
  faculty_id             uuid references public.faculties(id),
  onboarded              boolean not null default false,
  trial_started_at       timestamptz,
  subscription_active    boolean not null default false,
  subscription_expires_at timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- 5. STUDENT_SUBJECTS (the student's chosen combination)
create table public.student_subjects (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  subject_id  uuid not null references public.subjects(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (profile_id, subject_id)
);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP + START 7-DAY TRIAL
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, trial_started_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    now()  -- trial starts at signup
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
