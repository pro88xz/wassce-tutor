-- 2026-11-12 · Where new accounts come from (e.g. TikTok).
-- Run after 14. Safe to run twice. Adds two columns to profiles and one
-- function; nothing on the sign-up path changes, so sign-up cannot be broken
-- by this migration.
--
-- wasscetutor.com/tiktok redirects to /?utm_source=tiktok&utm_campaign=promo.
-- The browser remembers the first tagged visit and also sends it with the
-- sign-up form. Once signed in, the app calls record_signup_source(), which
-- stamps the profile one time, only for accounts created in the last 3 days.
-- Admins see sign-ups and paid conversions by source on the admin home page.

begin;

alter table public.profiles add column if not exists signup_source text;
alter table public.profiles add column if not exists signup_campaign text;

alter table public.profiles drop constraint if exists profiles_signup_source_format;
alter table public.profiles add constraint profiles_signup_source_format
  check (signup_source is null or signup_source ~ '^[a-z0-9_-]{1,40}$') not valid;
alter table public.profiles drop constraint if exists profiles_signup_campaign_format;
alter table public.profiles add constraint profiles_signup_campaign_format
  check (signup_campaign is null or signup_campaign ~ '^[a-z0-9_-]{1,40}$') not valid;

comment on column public.profiles.signup_source is 'First campaign source of the account (utm_source), set once by record_signup_source()';

-- p_source and p_campaign come from this browser; when they are missing (the
-- email was confirmed in another browser) the values sent with the sign-up
-- form are used instead.
create or replace function public.record_signup_source(p_source text default null, p_campaign text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare v_meta jsonb; v_source text; v_campaign text;
begin
  if auth.uid() is null then return; end if;
  select raw_user_meta_data into v_meta from auth.users where id = auth.uid();
  v_source := lower(coalesce(nullif(trim(p_source), ''), v_meta->>'signup_source'));
  v_campaign := lower(coalesce(nullif(trim(p_campaign), ''), v_meta->>'signup_campaign'));
  if v_source is null or v_source !~ '^[a-z0-9_-]{1,40}$' then return; end if;
  if v_campaign is not null and v_campaign !~ '^[a-z0-9_-]{1,40}$' then v_campaign := null; end if;
  update public.profiles
     set signup_source = v_source, signup_campaign = v_campaign
   where id = auth.uid()
     and signup_source is null
     and created_at > now() - interval '3 days';
end $$;

revoke all on function public.record_signup_source(text, text) from public, anon;
grant execute on function public.record_signup_source(text, text) to authenticated;

commit;
