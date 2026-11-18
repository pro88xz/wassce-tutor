-- 2026-11-18 · New practice sets are free like every other (27).
-- Run after 26. Safe to run twice. Applied by the "Apply database migrations"
-- workflow.
--
-- Migration 22 made every practice set free, but the question import
-- (scripts/sync-questions.mjs) still marks only one set per subject as free,
-- so the 30 Geography sets added on 18 November were saved as locked and the
-- app showed them with a lock. Students could still open them (the rules from
-- 22 open any set that is not a mock exam), but the label was wrong.
--
-- 1. Every practice set that is not a mock exam is marked free now.
-- 2. From now on the database marks it free itself, whatever the import does.
--    Timed mock exams keep is_free as set (they stay with a plan).
--
-- To undo: drop trigger practice_sets_stay_free on public.papers; drop
-- function public.practice_set_is_free().

begin;

update public.papers set is_free = true
 where coalesce(paper_type, '') <> 'Mock' and not is_free;

create or replace function public.practice_set_is_free()
returns trigger language plpgsql set search_path = '' as $$
begin
  if coalesce(new.paper_type, '') <> 'Mock' then new.is_free := true; end if;
  return new;
end $$;
revoke all on function public.practice_set_is_free() from public, anon, authenticated;

drop trigger if exists practice_sets_stay_free on public.papers;
create trigger practice_sets_stay_free before insert or update on public.papers
  for each row execute function public.practice_set_is_free();

commit;
