-- 2026-11-08 · Monthly and yearly plan pricing.
-- Internal plan IDs remain stable ('term' and 'year') to preserve payment
-- history, active subscriptions, pending Monime orders, and webhook references.
-- New prices: Monthly NLe 25 / 1 month; Yearly NLe 75 / 12 months.
-- Legacy pending orders: term NLe 10 = 4 months; year NLe 25 = 12 months.

begin;

create or replace function public.plan_months(p_plan text)
 returns integer language sql immutable set search_path to '' as $$
  select case p_plan when 'term' then 1 when 'year' then 12 end
$$;

create or replace function public.plan_price_nle(p_plan text)
 returns integer language sql immutable set search_path to '' as $$
  select case p_plan when 'term' then 25 when 'year' then 75 end
$$;

-- Keep historical orders valid when they are updated or settled after rollout.
alter table public.payments
  drop constraint if exists payments_price_matches_plan;
alter table public.payments
  add constraint payments_price_matches_plan check (
    (plan = 'term' and amount_nle in (10, 25))
    or (plan = 'year' and amount_nle in (25, 75))
  );

-- Grant legacy four-month access for old NLe 10 term orders, but one month
-- for new NLe 25 monthly orders. Both old and new yearly orders grant 12 months.
create or replace function public.complete_payment(p_payment uuid)
 returns timestamptz
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v public.payments%rowtype;
  v_until timestamptz;
  v_months integer;
begin
  select * into v from public.payments where id = p_payment for update;
  if not found then
    raise exception 'Payment not found';
  end if;
  if v.status = 'completed' then
    return v.access_until;
  end if;

  v_months := case
    when v.plan = 'term' and v.amount_nle = 10 then 4
    when v.plan = 'term' and v.amount_nle = 25 then 1
    when v.plan = 'year' and v.amount_nle in (25, 75) then 12
    else null
  end;
  if v_months is null then
    raise exception 'Invalid payment plan amount';
  end if;

  select greatest(coalesce(subscription_expires_at, now()), now()) + make_interval(months => v_months)
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

-- Preserve old manual payment requests while enforcing the new amounts.
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

  v_expires := v_expires + case
    when v_request.plan = 'term' and v_request.amount_nle = 10 then interval '4 months'
    when v_request.plan = 'term' and v_request.amount_nle = 25 then interval '1 month'
    when v_request.plan = 'year' and v_request.amount_nle in (25, 75) then interval '12 months'
    when v_request.plan = 'monthly' then interval '1 month'
    when v_request.plan = 'quarterly' then interval '3 months'
    when v_request.plan = 'yearly' then interval '1 year'
    else null
  end;

  if v_expires is null then
    raise exception 'Invalid payment request plan or amount';
  end if;

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

drop policy if exists "users insert own payment requests" on public.payment_requests;
create policy "users insert own payment requests" on public.payment_requests
  for insert to public
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and activated_at is null
    and activated_by is null
    and (
      (plan = 'term' and amount_nle in (10, 25))
      or (plan = 'year' and amount_nle in (25, 75))
    )
  );

commit;
