-- 2026-11-26 · Clicks on links to the studio's apps on Google Play (BeamPad first).
--
-- Every "Get it on Google Play" button on /beampad and its guides, and any
-- /go/beampad link shared elsewhere (TikTok, WhatsApp...), goes through
-- api/_lib/go.js, which writes one row here and then sends the visitor to Play.
-- Admin -> App clicks (src/routes/admin.app-clicks.tsx) reads them.
--
-- What a row holds: when, which app, which button (placement), which page,
-- the source a shared link was tagged with, the referring site's host name,
-- the visitor's country (from Vercel), a device type, and a visitor code that
-- is a hash of the day, IP address and browser, so the same person clicking
-- twice in a day counts once. No IP address, no browser string, no account.
--
-- Written only with the server key (api/_lib/go.js); admins can read; nobody else
-- can read or write.
begin;

create table if not exists public.app_link_clicks (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  app text not null check (app in ('beampad')),
  placement text check (char_length(placement) <= 40),
  page text check (char_length(page) <= 60),
  source text check (char_length(source) <= 40),
  referrer_host text check (char_length(referrer_host) <= 120),
  country text check (char_length(country) <= 2),
  device text check (device in ('android', 'ios', 'desktop', 'other')),
  visitor text check (char_length(visitor) <= 32)
);

create index if not exists app_link_clicks_app_created_idx on public.app_link_clicks (app, created_at desc);

alter table public.app_link_clicks enable row level security;
revoke all on public.app_link_clicks from anon, authenticated;
grant select on public.app_link_clicks to authenticated;

drop policy if exists "admins read app link clicks" on public.app_link_clicks;
create policy "admins read app link clicks" on public.app_link_clicks
  for select to authenticated
  using (public.is_admin());

-- Live updates on the admin page.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.app_link_clicks;
    exception when duplicate_object then null;
    end;
  end if;
end $$;

commit;
