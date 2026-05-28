-- ============================================================
-- WASSCE TUTOR — Phase 2 content RLS
-- Signed-in users can READ content. (Subscription gate: Phase 3)
-- Writes happen via admin/service role only — no public write policies.
-- ============================================================

alter table public.papers    enable row level security;
alter table public.questions enable row level security;
alter table public.options   enable row level security;

create policy "papers readable by authenticated"
  on public.papers for select
  to authenticated
  using (true);

create policy "questions readable by authenticated"
  on public.questions for select
  to authenticated
  using (true);

create policy "options readable by authenticated"
  on public.options for select
  to authenticated
  using (true);
