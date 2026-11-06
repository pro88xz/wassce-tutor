-- 2026-11-06 · Book a tutor: requests from /tutors. Anyone can send one; only admins read or update.
create table if not exists public.tutor_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (char_length(phone) between 7 and 20),
  subject text not null check (char_length(subject) <= 60),
  level text not null check (char_length(level) <= 40),
  mode text not null check (mode in ('online', 'home', 'either')),
  town text check (char_length(town) <= 60),
  availability text check (char_length(availability) <= 200),
  message text check (char_length(message) <= 1000),
  status text not null default 'new' check (status in ('new', 'contacted', 'matched', 'closed')),
  admin_note text check (char_length(admin_note) <= 1000)
);
alter table public.tutor_requests enable row level security;
create policy "anyone can request a tutor" on public.tutor_requests for insert to anon, authenticated
  with check (status = 'new' and admin_note is null and (user_id is null or user_id = auth.uid()));
create policy "admins read tutor requests" on public.tutor_requests for select using (public.is_admin());
create policy "admins update tutor requests" on public.tutor_requests for update using (public.is_admin()) with check (public.is_admin());
