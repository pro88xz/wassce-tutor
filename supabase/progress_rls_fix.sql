-- Fix: progress RLS policies (re-created cleanly after initial apply failed)
drop policy if exists "own attempts readable"          on public.attempts;
drop policy if exists "own attempts insertable"        on public.attempts;
drop policy if exists "own attempt_answers readable"   on public.attempt_answers;
drop policy if exists "own attempt_answers insertable" on public.attempt_answers;

create policy "own attempts readable"
  on public.attempts for select to authenticated
  using (auth.uid() = profile_id);

create policy "own attempts insertable"
  on public.attempts for insert to authenticated
  with check (auth.uid() = profile_id);

create policy "own attempt_answers readable"
  on public.attempt_answers for select to authenticated
  using (exists (select 1 from public.attempts a where a.id = attempt_id and a.profile_id = auth.uid()));

create policy "own attempt_answers insertable"
  on public.attempt_answers for insert to authenticated
  with check (exists (select 1 from public.attempts a where a.id = attempt_id and a.profile_id = auth.uid()));
