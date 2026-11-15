-- 2026-11-15 · Email retention engine (16). Run after 15. Safe to run twice.
--
-- WASSCE Tutor's own lifecycle email engine. Supabase holds consent,
-- suppressions and every send; the existing Resend account delivers. The rules
-- that decide who gets which email live in api/_lib/email/rules.js and run in
-- a Vercel function once a day (api/email/run.js). See docs/email-engine.md.
--
-- What this migration adds
--   email_preferences     one row per account: marketing consent and where it came from
--   email_consent_log     every consent change, for audit (written by a trigger)
--   email_suppressions    addresses never to email: unsubscribed-by-complaint, hard bounces
--   email_settings        one row: the engine's pause switch and launch time
--   email_send_jobs       every email the engine decided to send, with a unique key
--   email_message_events  delivery events reported by Resend (webhook)
--   email_click_events    clicks on links in engine emails
--
-- Consent
--   Accounts that exist when this runs are subscribed by default
--   (consent_source = 'existing_account_default'), as the product owner chose.
--   New accounts record the choice made on the sign-up page: email sign-ups
--   through the metadata sent with the form (a trigger reads it); Google
--   sign-ups through set_my_marketing_preference() right after sign-in.
--   Every marketing email carries a one-click unsubscribe.
--
-- Nothing on the sign-up path can fail because of this migration: the new
-- auth.users trigger swallows its own errors.

begin;

-- 1 · Consent ────────────────────────────────────────────────────────────────
create table if not exists public.email_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  marketing_status text not null
    check (marketing_status in ('subscribed', 'unsubscribed', 'not_subscribed')),
  -- existing_account_default | signup_form | signup_declined | signup_no_choice
  -- | google_signup | account_settings | email_link | complaint | admin
  consent_source text not null,
  consent_text_version text,
  subscribed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_consent_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  marketing_status text not null,
  consent_source text not null,
  consent_text_version text,
  created_at timestamptz not null default now()
);
create index if not exists email_consent_log_user_idx on public.email_consent_log (user_id, created_at desc);

create or replace function public.email_log_consent()
 returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT'
     or new.marketing_status is distinct from old.marketing_status
     or new.consent_source is distinct from old.consent_source then
    insert into public.email_consent_log (user_id, marketing_status, consent_source, consent_text_version)
    values (new.user_id, new.marketing_status, new.consent_source, new.consent_text_version);
  end if;
  return new;
end $$;

drop trigger if exists email_preferences_log on public.email_preferences;
create trigger email_preferences_log
  after insert or update on public.email_preferences
  for each row execute function public.email_log_consent();

-- Existing accounts: subscribed by default (the product owner's decision).
insert into public.email_preferences (user_id, marketing_status, consent_source, consent_text_version, subscribed_at)
select u.id, 'subscribed', 'existing_account_default', 'existing-accounts-2026-11', now()
from auth.users u
on conflict (user_id) do nothing;

-- New accounts: the choice sent with the sign-up form. Google sign-ups arrive
-- without it ('signup_no_choice') and are completed by set_my_marketing_preference().
create or replace function public.email_preferences_on_signup()
 returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_choice text := new.raw_user_meta_data->>'marketing_opt_in';
begin
  begin
    insert into public.email_preferences (user_id, marketing_status, consent_source, consent_text_version, subscribed_at)
    values (
      new.id,
      case when v_choice = 'true' then 'subscribed' else 'not_subscribed' end,
      case when v_choice = 'true' then 'signup_form' when v_choice = 'false' then 'signup_declined' else 'signup_no_choice' end,
      left(new.raw_user_meta_data->>'marketing_consent_version', 40),
      case when v_choice = 'true' then now() end
    )
    on conflict (user_id) do nothing;
  exception when others then
    raise warning 'email_preferences_on_signup: %', sqlerrm;
  end;
  return new;
end $$;

drop trigger if exists on_auth_user_created_email_preferences on auth.users;
create trigger on_auth_user_created_email_preferences
  after insert on auth.users
  for each row execute function public.email_preferences_on_signup();

-- A signed-in student changes their own choice. 'google_signup' only records
-- the sign-up page choice of an account made in the last 15 minutes that has
-- not chosen yet; it never overrides an earlier choice.
create or replace function public.set_my_marketing_preference(
  p_subscribed boolean,
  p_source text default 'account_settings',
  p_text_version text default null
) returns text language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_created timestamptz;
  v_current_source text;
  v_status text;
begin
  if v_uid is null then raise exception 'Not signed in'; end if;
  if p_source is null or p_source not in ('account_settings', 'google_signup') then
    raise exception 'Unknown consent source';
  end if;

  if p_source = 'google_signup' then
    select created_at into v_created from auth.users where id = v_uid;
    select consent_source into v_current_source from public.email_preferences where user_id = v_uid;
    if v_created < now() - interval '15 minutes'
       or (v_current_source is not null and v_current_source <> 'signup_no_choice') then
      return (select marketing_status from public.email_preferences where user_id = v_uid);
    end if;
    v_status := case when p_subscribed then 'subscribed' else 'not_subscribed' end;
  else
    v_status := case when p_subscribed then 'subscribed' else 'unsubscribed' end;
  end if;

  insert into public.email_preferences as ep
    (user_id, marketing_status, consent_source, consent_text_version, subscribed_at, unsubscribed_at, updated_at)
  values (
    v_uid, v_status, p_source, left(p_text_version, 40),
    case when v_status = 'subscribed' then now() end,
    case when v_status = 'unsubscribed' then now() end,
    now()
  )
  on conflict (user_id) do update set
    marketing_status = excluded.marketing_status,
    consent_source = excluded.consent_source,
    consent_text_version = excluded.consent_text_version,
    subscribed_at = case when excluded.marketing_status = 'subscribed' then now() else ep.subscribed_at end,
    unsubscribed_at = case when excluded.marketing_status = 'unsubscribed' then now() else ep.unsubscribed_at end,
    updated_at = now();
  return v_status;
end $$;

-- 2 · Suppressions and the pause switch ────────────────────────────────────
create table if not exists public.email_suppressions (
  email_normalized text primary key,
  reason text not null check (reason in ('hard_bounce', 'complaint', 'invalid', 'manual')),
  source text not null default 'system',
  detail text,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.email_settings (
  id boolean primary key default true check (id),
  paused boolean not null default false,
  -- Welcome-style emails only go to accounts created after the engine started.
  launched_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
insert into public.email_settings (id) values (true) on conflict (id) do nothing;

-- 3 · Send jobs, provider events, clicks ───────────────────────────────────
create table if not exists public.email_send_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  programme text not null,
  step smallint not null default 1,
  category text not null check (category in ('marketing', 'service')),
  template_key text not null,
  -- One live job per key: e.g. "pending_payment:1:<payment id>".
  idempotency_key text not null,
  anchor text,
  payload jsonb not null default '{}',
  priority smallint not null default 5,
  status text not null default 'queued'
    check (status in ('queued', 'sending', 'sent', 'failed', 'skipped', 'cancelled', 'unknown')),
  attempts smallint not null default 0,
  scheduled_at timestamptz not null default now(),
  claimed_at timestamptz,
  sent_at timestamptz,
  provider_message_id text,
  last_error text,
  skip_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Failed, skipped and cancelled jobs do not block a later attempt with the same key.
create unique index if not exists email_send_jobs_live_key
  on public.email_send_jobs (idempotency_key)
  where status in ('queued', 'sending', 'sent', 'unknown');
create unique index if not exists email_send_jobs_provider_id
  on public.email_send_jobs (provider_message_id) where provider_message_id is not null;
create index if not exists email_send_jobs_due_idx on public.email_send_jobs (status, priority, scheduled_at);
create index if not exists email_send_jobs_user_idx on public.email_send_jobs (user_id, created_at desc);
create index if not exists email_send_jobs_sent_idx on public.email_send_jobs (sent_at) where sent_at is not null;

create table if not exists public.email_message_events (
  id bigint generated always as identity primary key,
  provider_event_id text not null unique,
  job_id uuid references public.email_send_jobs (id) on delete set null,
  provider_message_id text,
  event_type text not null,
  occurred_at timestamptz not null,
  metadata jsonb not null default '{}',
  received_at timestamptz not null default now()
);
create index if not exists email_message_events_job_idx on public.email_message_events (job_id);

create table if not exists public.email_click_events (
  id bigint generated always as identity primary key,
  job_id uuid not null references public.email_send_jobs (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  link_key text not null,
  destination_path text not null,
  clicked_at timestamptz not null default now()
);
create index if not exists email_click_events_job_idx on public.email_click_events (job_id);

-- 4 · Row-level security: students read their own preference; everything else
-- is written only by the server's secret key (which bypasses RLS) or the RPCs.
alter table public.email_preferences enable row level security;
alter table public.email_consent_log enable row level security;
alter table public.email_suppressions enable row level security;
alter table public.email_settings enable row level security;
alter table public.email_send_jobs enable row level security;
alter table public.email_message_events enable row level security;
alter table public.email_click_events enable row level security;

revoke all on public.email_preferences, public.email_consent_log, public.email_suppressions, public.email_settings,
  public.email_send_jobs, public.email_message_events, public.email_click_events from public, anon, authenticated;
grant select on public.email_preferences to authenticated;

drop policy if exists "own email preference readable" on public.email_preferences;
create policy "own email preference readable" on public.email_preferences
  for select to authenticated using (auth.uid() = user_id);

-- 5 · What the rules engine reads (server key only) ────────────────────────
-- One row per account, in pages of p_limit ordered by id (pass the last id as p_after).
create or replace function public.email_audience(p_after uuid default null, p_limit integer default 1000)
returns table (
  user_id uuid,
  email text,
  email_confirmed boolean,
  full_name text,
  account_intent text,
  is_admin boolean,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  last_study_at timestamptz,
  lessons_completed integer,
  practice_attempts integer,
  last_subject_id uuid,
  last_subject_name text,
  access_active boolean,
  access_until timestamptz,
  access_plan text,
  open_payment_id uuid,
  open_payment_plan text,
  open_payment_amount integer,
  open_payment_created_at timestamptz,
  paid_payment_id uuid,
  paid_plan text,
  paid_amount integer,
  paid_at timestamptz,
  marketing_status text,
  suppressed boolean,
  history jsonb
)
language sql stable security definer set search_path = '' as $$
  select
    u.id,
    u.email::text,
    u.email_confirmed_at is not null,
    p.full_name,
    u.raw_user_meta_data->>'account_intent',
    coalesce(p.is_admin, false),
    u.created_at,
    u.last_sign_in_at,
    greatest(lp.last_at, att.last_at),
    coalesce(lp.n, 0)::integer,
    coalesce(att.n, 0)::integer,
    ls.subject_id,
    ls.subject_name,
    coalesce(p.subscription_active, false) and coalesce(p.subscription_expires_at > now(), false),
    p.subscription_expires_at,
    p.subscription_plan,
    op.id, op.plan, op.amount_nle, op.created_at,
    pd.id, pd.plan, pd.amount_nle, pd.completed_at,
    coalesce(ep.marketing_status, 'not_subscribed'),
    exists (
      select 1 from public.email_suppressions s
      where s.email_normalized = lower(btrim(u.email)) and (s.expires_at is null or s.expires_at > now())
    ),
    coalesce(h.items, '[]'::jsonb)
  from auth.users u
  join public.profiles p on p.id = u.id
  left join public.email_preferences ep on ep.user_id = u.id
  left join lateral (
    select max(x.completed_at) as last_at, count(*) as n from public.lesson_progress x where x.profile_id = u.id
  ) lp on true
  left join lateral (
    select max(a.created_at) as last_at, count(*) as n from public.attempts a where a.profile_id = u.id
  ) att on true
  left join lateral (
    select s.id as subject_id, s.name as subject_name
    from (
      (select t.subject_id as sid, x.completed_at as happened
         from public.lesson_progress x
         join public.lessons l on l.id = x.lesson_id
         join public.topics t on t.id = l.topic_id
        where x.profile_id = u.id
        order by x.completed_at desc limit 1)
      union all
      (select pa.subject_id, a.created_at
         from public.attempts a
         join public.papers pa on pa.id = a.paper_id
        where a.profile_id = u.id
        order by a.created_at desc limit 1)
    ) r
    join public.subjects s on s.id = r.sid
    order by r.happened desc limit 1
  ) ls on true
  -- The latest unfinished checkout of the last 30 days that no later payment completed.
  left join lateral (
    select o.id, o.plan, o.amount_nle, o.created_at
    from public.payments o
    where o.user_id = u.id
      and o.status in ('created', 'pending')
      and o.created_at > now() - interval '30 days'
      and not exists (
        select 1 from public.payments c
        where c.user_id = u.id and c.status = 'completed' and c.completed_at > o.created_at
      )
    order by o.created_at desc limit 1
  ) op on true
  left join lateral (
    select c.id, c.plan, c.amount_nle, c.completed_at
    from public.payments c
    where c.user_id = u.id and c.status = 'completed'
    order by c.completed_at desc nulls last limit 1
  ) pd on true
  left join lateral (
    select jsonb_agg(jsonb_build_object(
             'programme', j.programme, 'step', j.step, 'anchor', j.anchor, 'category', j.category,
             'status', j.status, 'at', coalesce(j.sent_at, j.created_at)
           ) order by j.created_at) as items
    from public.email_send_jobs j
    where j.user_id = u.id
      and j.created_at > now() - interval '120 days'
      and j.status in ('queued', 'sending', 'sent', 'unknown', 'failed')
  ) h on true
  where p_after is null or u.id > p_after
  order by u.id
  limit greatest(1, least(coalesce(p_limit, 1000), 2000));
$$;

-- Real numbers for email copy, read at send time.
create or replace function public.email_content_stats()
returns table (subjects integer, lessons integer, questions integer)
language sql stable security definer set search_path = '' as $$
  select
    (select count(distinct t.subject_id) from public.topics t
       where exists (select 1 from public.lessons l where l.topic_id = t.id and l.is_published))::integer,
    (select count(*) from public.lessons l where l.is_published)::integer,
    (select count(*) from public.questions q join public.papers p on p.id = q.paper_id where p.is_published)::integer
$$;

-- Adds planned jobs; a key that already has a live job is ignored. Returns how many were added.
create or replace function public.queue_email_jobs(p_jobs jsonb)
returns integer language plpgsql security definer set search_path = '' as $$
declare v_count integer;
begin
  insert into public.email_send_jobs
    (user_id, programme, step, category, template_key, idempotency_key, anchor, payload, priority, scheduled_at)
  select (x->>'user_id')::uuid, x->>'programme', coalesce((x->>'step')::smallint, 1), x->>'category',
         x->>'template_key', x->>'idempotency_key', x->>'anchor', coalesce(x->'payload', '{}'::jsonb),
         coalesce((x->>'priority')::smallint, 5), coalesce((x->>'scheduled_at')::timestamptz, now())
  from jsonb_array_elements(coalesce(p_jobs, '[]'::jsonb)) as x
  on conflict (idempotency_key) where status in ('queued', 'sending', 'sent', 'unknown') do nothing;
  get diagnostics v_count = row_count;
  return v_count;
end $$;

-- Claims due jobs for one worker. Two workers never get the same job (SKIP
-- LOCKED). Consent and suppression are checked again here, at send time.
create or replace function public.claim_email_jobs(p_limit integer)
returns table (
  job_id uuid, user_id uuid, email text, programme text, step smallint, category text,
  template_key text, payload jsonb, idempotency_key text, attempts smallint
)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
begin
  -- A job left "sending" for 30 minutes may already have gone out: never send it twice.
  update public.email_send_jobs
     set status = 'unknown', last_error = 'interrupted while sending', updated_at = now()
   where status = 'sending' and claimed_at < now() - interval '30 minutes';

  update public.email_send_jobs j
     set status = 'skipped', skip_reason = 'not_subscribed', updated_at = now()
   where j.status = 'queued' and j.category = 'marketing'
     and not exists (
       select 1 from public.email_preferences ep
       where ep.user_id = j.user_id and ep.marketing_status = 'subscribed'
     );

  update public.email_send_jobs j
     set status = 'skipped', skip_reason = 'suppressed', updated_at = now()
    from auth.users u
   where j.status = 'queued' and u.id = j.user_id
     and (u.email is null or exists (
       select 1 from public.email_suppressions s
       where s.email_normalized = lower(btrim(u.email)) and (s.expires_at is null or s.expires_at > now())
     ));

  return query
  with due as (
    select j.id from public.email_send_jobs j
     where j.status = 'queued' and j.scheduled_at <= now()
     order by j.priority, j.scheduled_at, j.created_at
     limit greatest(0, least(coalesce(p_limit, 0), 500))
     for update skip locked
  ), claimed as (
    update public.email_send_jobs j
       set status = 'sending', attempts = j.attempts + 1, claimed_at = now(), updated_at = now()
      from due, auth.users u
     where j.id = due.id and u.id = j.user_id
    returning j.id as c_job, j.user_id as c_user, u.email::text as c_email, j.programme as c_programme,
              j.step as c_step, j.category as c_category, j.template_key as c_template,
              j.payload as c_payload, j.idempotency_key as c_key, j.attempts as c_attempts
  )
  select c_job, c_user, c_email, c_programme, c_step, c_category, c_template, c_payload, c_key, c_attempts
  from claimed;
end $$;

-- 6 · Admin: results and the pause switch ──────────────────────────────────
-- Per programme over the last p_days: emails sent, students who clicked, and
-- students who studied or paid within 7 days of an email.
create or replace function public.email_engine_report(p_days integer default 30)
returns table (
  programme text, queued bigint, sent bigint, failed bigint, skipped bigint,
  clicked_students bigint, studied_within_7d bigint, paid_within_7d bigint
)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Not authorised'; end if;
  return query
  select
    j.programme,
    count(*) filter (where j.status in ('queued', 'sending')),
    count(*) filter (where j.status = 'sent'),
    count(*) filter (where j.status in ('failed', 'unknown')),
    count(*) filter (where j.status in ('skipped', 'cancelled')),
    count(distinct j.user_id) filter (where exists (select 1 from public.email_click_events c where c.job_id = j.id)),
    count(distinct j.user_id) filter (where j.status = 'sent' and (
      exists (select 1 from public.lesson_progress x where x.profile_id = j.user_id
              and x.completed_at between j.sent_at and j.sent_at + interval '7 days')
      or exists (select 1 from public.attempts a where a.profile_id = j.user_id
              and a.created_at between j.sent_at and j.sent_at + interval '7 days'))),
    count(distinct j.user_id) filter (where j.status = 'sent' and exists (
      select 1 from public.payments pm where pm.user_id = j.user_id and pm.status = 'completed'
        and pm.completed_at between j.sent_at and j.sent_at + interval '7 days'))
  from public.email_send_jobs j
  where j.created_at > now() - make_interval(days => greatest(1, least(coalesce(p_days, 30), 365)))
  group by j.programme
  order by j.programme;
end $$;

create or replace function public.email_engine_status()
returns table (paused boolean, launched_at timestamptz, subscribed bigint, unsubscribed bigint, not_subscribed bigint, suppressed bigint, sent_today bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Not authorised'; end if;
  return query
  select s.paused, s.launched_at,
    (select count(*) from public.email_preferences where marketing_status = 'subscribed'),
    (select count(*) from public.email_preferences where marketing_status = 'unsubscribed'),
    (select count(*) from public.email_preferences where marketing_status = 'not_subscribed'),
    (select count(*) from public.email_suppressions),
    (select count(*) from public.email_send_jobs where sent_at >= date_trunc('day', now()))
  from public.email_settings s where s.id;
end $$;

create or replace function public.set_email_engine_paused(p_paused boolean)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Not authorised'; end if;
  update public.email_settings set paused = coalesce(p_paused, true), updated_at = now() where id;
  -- Pausing also stops anything already queued.
  if coalesce(p_paused, true) then
    update public.email_send_jobs set status = 'cancelled', skip_reason = 'paused', updated_at = now()
     where status = 'queued';
  end if;
  return coalesce(p_paused, true);
end $$;

-- 7 · Who may call what ────────────────────────────────────────────────────
revoke all on function public.email_log_consent() from public, anon, authenticated;
revoke all on function public.email_preferences_on_signup() from public, anon, authenticated;
revoke all on function public.set_my_marketing_preference(boolean, text, text) from public, anon;
grant execute on function public.set_my_marketing_preference(boolean, text, text) to authenticated;
revoke all on function public.email_audience(uuid, integer) from public, anon, authenticated;
revoke all on function public.email_content_stats() from public, anon, authenticated;
revoke all on function public.queue_email_jobs(jsonb) from public, anon, authenticated;
revoke all on function public.claim_email_jobs(integer) from public, anon, authenticated;
grant execute on function public.email_audience(uuid, integer) to service_role;
grant execute on function public.email_content_stats() to service_role;
grant execute on function public.queue_email_jobs(jsonb) to service_role;
grant execute on function public.claim_email_jobs(integer) to service_role;
revoke all on function public.email_engine_report(integer) from public, anon;
revoke all on function public.email_engine_status() from public, anon;
revoke all on function public.set_email_engine_paused(boolean) from public, anon;
grant execute on function public.email_engine_report(integer) to authenticated;
grant execute on function public.email_engine_status() to authenticated;
grant execute on function public.set_email_engine_paused(boolean) to authenticated;

commit;

-- Checks after running:
--   select consent_source, marketing_status, count(*) from email_preferences group by 1, 2;
--   select has_function_privilege('authenticated', 'public.email_audience(uuid, integer)', 'execute');   -- false
--   select has_function_privilege('authenticated', 'public.set_my_marketing_preference(boolean, text, text)', 'execute'); -- true
--
-- Rollback (removes the engine; keeps accounts and payments untouched):
--   drop trigger if exists on_auth_user_created_email_preferences on auth.users;
--   drop table if exists email_click_events, email_message_events, email_send_jobs, email_settings,
--     email_suppressions, email_consent_log, email_preferences cascade;
--   drop function if exists email_audience(uuid, integer), email_content_stats(), queue_email_jobs(jsonb),
--     claim_email_jobs(integer), email_engine_report(integer), email_engine_status(),
--     set_email_engine_paused(boolean), set_my_marketing_preference(boolean, text, text),
--     email_preferences_on_signup(), email_log_consent();
