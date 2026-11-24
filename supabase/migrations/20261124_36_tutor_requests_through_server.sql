-- 2026-11-24 · Tutor requests come only through api/tutor-request.js, which checks for spam
-- (the hidden trap field, Cloudflare Turnstile when it is on, at most 3 an hour per phone)
-- and writes with the server key. The browser can no longer insert rows itself.
begin;
drop policy if exists "anyone can request a tutor" on public.tutor_requests;
revoke insert on public.tutor_requests from anon, authenticated;
commit;
