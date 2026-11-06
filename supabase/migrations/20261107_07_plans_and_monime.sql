-- 2026-11-07 · New plans, a free tier, and Monime payments.
-- Run in the Supabase SQL editor, after migrations 05 and 06. Safe to run
-- more than once.
--
-- The model
--   Free (any signed-in account, no time limit)
--     · every subject's syllabus and topic list
--     · the first lesson of every topic
--     · one starter practice set in every subject (papers.is_free)
--     · progress tracking
--   Paid: Term pass 10 NLe for 4 months, or Academic year 25 NLe for 12 months
--     · every lesson, every practice set and the AI tutor
--   No free trial for new accounts. Trials that already started run out on
--   their own: new accounts simply never get trial_started_at.
--
-- Payments
--   The site's server (Vercel function api/pay/checkout) creates a payments
--   row and a Monime checkout session. Monime's webhook (api/pay/webhook) or
--   the return page (api/pay/confirm) checks the session with Monime, then
--   calls complete_payment(), which only the server's secret key can run.
--
-- KEEP IN SYNC with src/lib/plans.ts and api/_lib/plans.js (prices and lengths).

begin;

-- 1 · Plans ─────────────────────────────────────────────────────────────────
alter table public.profiles add column if not exists subscription_plan text;

create or replace function public.plan_months(p_plan text)
 returns integer language sql immutable set search_path to '' as $$
  select case p_plan when 'term' then 4 when 'year' then 12 end
$$;

create or replace function public.plan_price_nle(p_plan text)
 returns integer language sql immutable set search_path to '' as $$
  select case p_plan when 'term' then 10 when 'year' then 25 end
$$;

-- 2 · No trial for new accounts ─────────────────────────────────────────────
create or replace function public.handle_new_user()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', null));
  return new;
end;
$function$;

-- user_has_access() is unchanged in meaning: admin, a plan that has not
-- ended, or a trial that started before this migration and is still running.
create or replace function public.user_has_access()
 returns boolean
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and (
        is_admin = true
        or (subscription_active = true and subscription_expires_at > now())
        or (trial_started_at is not null and trial_started_at + interval '7 days' > now())
      )
  );
$function$;

-- 3 · Free lessons: the first published lesson of every topic ───────────────
create or replace function public.is_free_lesson(p_lesson uuid)
 returns boolean
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select exists (
    select 1 from lessons l
    where l.id = p_lesson
      and l.is_published
      and not exists (
        select 1 from lessons o
        where o.topic_id = l.topic_id and o.is_published
          and (o.sort_order < l.sort_order or (o.sort_order = l.sort_order and o.id < l.id))
      )
  );
$function$;
revoke execute on function public.is_free_lesson(uuid) from public;
grant execute on function public.is_free_lesson(uuid) to anon, authenticated;

drop policy if exists "lessons readable by access holders" on public.lessons;
create policy "lessons readable by access holders" on public.lessons
  for select to public
  using (public.user_has_access() or public.is_free_lesson(id));

-- The lesson index gains is_free (same rule), so the app can show which
-- lessons are open. Titles only, never the content.
create or replace view public.wassce_lesson_index with (security_invoker = false) as
  select l.id, l.topic_id, l.slug, l.title, l.est_minutes, l.sort_order, l.is_public, l.updated_at,
         row_number() over (partition by l.topic_id order by l.sort_order, l.id) = 1 as is_free
  from public.lessons l
  where l.is_published;
revoke all on public.wassce_lesson_index from public, anon, authenticated;
grant select on public.wassce_lesson_index to anon, authenticated;

-- 4 · Free practice: one starter set per subject ────────────────────────────
alter table public.papers add column if not exists is_free boolean not null default false;

-- Choose each subject's first published set as its starter set, once. An
-- admin can change the choice later (update papers set is_free = ...).
update public.papers p set is_free = true
where p.id in (
  select distinct on (subject_id) id from public.papers
  where is_published
  order by subject_id, sort_order, created_at, id
)
and not exists (select 1 from public.papers f where f.subject_id = p.subject_id and f.is_free);

-- Set titles and sizes are not secret: every signed-in student can list the
-- published sets (so locked ones can be shown). Questions and answers stay
-- behind the plan, except in free starter sets.
drop policy if exists "papers readable by access holders" on public.papers;
create policy "papers readable by access holders" on public.papers
  for select to public
  using (public.is_admin() or is_published);

drop policy if exists "questions readable by access holders" on public.questions;
create policy "questions readable by access holders" on public.questions
  for select to public
  using (
    public.is_admin()
    or exists (
      select 1 from public.papers p
      where p.id = questions.paper_id and p.is_published
        and (p.is_free or public.user_has_access())
    )
  );

drop policy if exists "options readable by authenticated" on public.options;
drop policy if exists "options readable by access holders" on public.options;
create policy "options readable by access holders" on public.options
  for select to public
  using (
    public.is_admin()
    or exists (
      select 1 from public.questions q join public.papers p on p.id = q.paper_id
      where q.id = options.question_id and p.is_published
        and (p.is_free or public.user_has_access())
    )
  );

-- 5 · Monime payments ───────────────────────────────────────────────────────
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan text not null check (plan in ('term', 'year')),
  amount_nle integer not null,
  provider text not null default 'monime',
  checkout_session_id text unique,
  status text not null default 'created'
    check (status in ('created', 'pending', 'completed', 'cancelled', 'expired', 'failed')),
  access_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint payments_price_matches_plan check (amount_nle = public.plan_price_nle(plan))
);
create index if not exists payments_user_idx on public.payments (user_id, created_at desc);

alter table public.payments enable row level security;
drop policy if exists "users read own payments" on public.payments;
create policy "users read own payments" on public.payments
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());
-- No insert, update or delete policies: only the server's secret key writes.

-- Webhook deliveries already handled (Monime may send an event more than once).
create table if not exists public.payment_events (
  id text primary key,
  name text not null,
  object_id text,
  received_at timestamptz not null default now()
);
alter table public.payment_events enable row level security;
-- No policies: only the server's secret key reads or writes.

-- Grants the plan for a paid payment, once. Called by the server after it has
-- confirmed with Monime that the checkout session is completed. A second call
-- for the same payment changes nothing. Time stacks on a plan still running.
create or replace function public.complete_payment(p_payment uuid)
 returns timestamptz
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v public.payments%rowtype;
  v_until timestamptz;
begin
  select * into v from public.payments where id = p_payment for update;
  if not found then
    raise exception 'Payment not found';
  end if;
  if v.status = 'completed' then
    return v.access_until;
  end if;

  select greatest(coalesce(subscription_expires_at, now()), now()) + make_interval(months => public.plan_months(v.plan))
  into v_until
  from public.profiles where id = v.user_id
  for update;
  if v_until is null then
    raise exception 'Profile not found';
  end if;

  update public.profiles
  set subscription_active = true,
      subscription_expires_at = v_until,
      subscription_plan = v.plan
  where id = v.user_id;

  update public.payments
  set status = 'completed', completed_at = now(), access_until = v_until, updated_at = now()
  where id = v.id;

  return v_until;
end;
$function$;
revoke execute on function public.complete_payment(uuid) from public, anon, authenticated;
grant execute on function public.complete_payment(uuid) to service_role;

-- 6 · Manual payments on WhatsApp (fallback) use the same two plans ─────────
create or replace function public.activate_payment(p_request_id uuid)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_request public.payment_requests%rowtype;
  v_expires timestamptz;
  v_admin_id uuid;
begin
  v_admin_id := auth.uid();
  if not exists (select 1 from public.profiles where id = v_admin_id and is_admin = true) then
    raise exception 'Not authorised';
  end if;

  select * into v_request from public.payment_requests where id = p_request_id for update;
  if not found then
    raise exception 'Request not found';
  end if;
  if v_request.status = 'activated' then
    raise exception 'Already activated';
  end if;

  select greatest(coalesce(subscription_expires_at, now()), now())
  into v_expires
  from public.profiles where id = v_request.user_id;

  v_expires := v_expires + case v_request.plan
    when 'term' then interval '4 months'
    when 'year' then interval '12 months'
    -- requests made before this migration
    when 'monthly' then interval '1 month'
    when 'quarterly' then interval '3 months'
    when 'yearly' then interval '1 year'
  end;

  update public.profiles
  set subscription_active = true,
      subscription_expires_at = v_expires,
      subscription_plan = case when v_request.plan in ('term', 'year') then v_request.plan else subscription_plan end
  where id = v_request.user_id;

  update public.payment_requests
  set status = 'activated', activated_at = now(), activated_by = v_admin_id
  where id = p_request_id;
end;
$function$;
revoke execute on function public.activate_payment(uuid) from public, anon;
grant execute on function public.activate_payment(uuid) to authenticated;

drop policy if exists "users insert own payment requests" on public.payment_requests;
create policy "users insert own payment requests" on public.payment_requests
  for insert to public
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and activated_at is null
    and activated_by is null
    and (plan, amount_nle) in (('term', 10), ('year', 25))
  );

commit;

-- Checks after running:
--   select subject_id, title from papers where is_free;                 -- one starter set per subject
--   select count(*) filter (where is_free), count(*) from wassce_lesson_index;
--   select has_function_privilege('authenticated', 'public.complete_payment(uuid)', 'execute');  -- false
