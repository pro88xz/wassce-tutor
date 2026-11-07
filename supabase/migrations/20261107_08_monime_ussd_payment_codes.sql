-- Per-order Monime USSD Payment Codes.
-- Apply after 20261107_07_plans_and_monime.sql in Supabase SQL editor.
-- Existing hosted-checkout records remain valid.

begin;

alter table public.payments
  add column if not exists payment_code_id text,
  add column if not exists ussd_code text,
  add column if not exists provider_payment_id text,
  add column if not exists payer_account_id text,
  add column if not exists financial_transaction_reference text,
  add column if not exists financial_account_id text;

create unique index if not exists payments_payment_code_id_uidx
  on public.payments (payment_code_id) where payment_code_id is not null;

create unique index if not exists payments_provider_payment_id_uidx
  on public.payments (provider_payment_id) where provider_payment_id is not null;

create index if not exists payments_pending_code_idx
  on public.payments (payment_code_id, status) where payment_code_id is not null;

commit;
