-- 21 · Email engine: start the daily run from the database at 10:00 GMT.
--
-- Until now the only clock was GitHub's scheduler ("Email engine daily run").
-- GitHub delays scheduled jobs at busy times and sometimes drops them; on
-- 16 November 2026 the 10:00 run never started. pg_cron, inside Supabase,
-- now starts the run at 10:00 GMT (Freetown time) every day, by calling
-- https://wasscetutor.com/api/email/run with the schedule secret already kept
-- in Vault. The GitHub workflow stays as a backup a little later in the hour.
--
-- Running twice in a day is safe: every email has its own key per student, a
-- run claims jobs with "for update skip locked", and the daily limit counts
-- everything already sent that day. A second run only sends what is still due.
begin;

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

-- Calls the run endpoint with the schedule secret. pg_net sends the request
-- in the background after this transaction commits; the reply (or error) is
-- kept for a few hours in net._http_response, keyed by the returned id.
create or replace function public.email_engine_kick()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_secret text;
begin
  select v.decrypted_secret into v_secret
    from vault.decrypted_secrets v
   where v.name = 'email_cron_secret';
  if v_secret is null or length(v_secret) < 16 then
    raise warning 'email_engine_kick: no schedule secret in Vault; run "Set up email engine" first';
    return null;
  end if;
  return net.http_get(
    url := 'https://wasscetutor.com/api/email/run',
    headers := jsonb_build_object('Authorization', 'Bearer ' || v_secret),
    timeout_milliseconds := 120000
  );
end $$;

revoke all on function public.email_engine_kick() from public, anon, authenticated;

-- One job, replaced if it already exists. pg_cron runs in GMT.
select cron.unschedule(j.jobid) from cron.job j where j.jobname = 'email-engine-daily';
select cron.schedule('email-engine-daily', '0 10 * * *', 'select public.email_engine_kick();');

commit;
