-- 2026-11-25 · A lesson's byline names the reviewer's qualification (39).
-- Run after 38. Safe to run twice. Applied by the "Apply database migrations"
-- workflow.
--
-- A reviewed lesson says "Reviewed by" the tutor, linked to their page, with
-- the line "WASSCE tutor in <town>". Their qualification (tutors.
-- qualifications, as they entered it on their tutor card and as their page
-- shows it) is what tells a reader, and Google's quality guidelines, why
-- their review counts. wassce_public_lessons gains two columns at the end
-- (create or replace can only add columns there):
--   reviewer_credential: the first line of the reviewer's qualifications, at
--     most 120 characters, when the reviewer is an active, listed tutor;
--   reviewer_verified: true when WASSCE Tutor has verified that tutor
--     (tutors.verified_at).
-- Everything else in the view is unchanged from migration 28.
--
-- To undo: re-run section 4 of migration 28 (the view without these columns).

begin;

create or replace view public.wassce_public_lessons with (security_invoker = false) as
  select l.id, l.topic_id, l.slug, l.title, l.content, l.est_minutes, l.sort_order,
         l.reviewed_at, l.updated_at,
         coalesce(t.full_name, r.full_name) as reviewer_name,
         coalesce(nullif(btrim(r.public_bio), ''), case when t.id is not null then 'WASSCE tutor in ' || t.location end) as reviewer_bio,
         t.slug as reviewer_tutor_slug,
         nullif(left(btrim(split_part(t.qualifications, E'\n', 1)), 120), '') as reviewer_credential,
         (t.id is not null and t.verified_at is not null) as reviewer_verified
  from public.lessons l
  left join public.profiles r on r.id = l.reviewed_by and l.reviewed_at is not null
  left join public.tutors t on t.user_id = l.reviewed_by and l.reviewed_at is not null and t.status = 'active' and t.listed
  where l.is_published;
comment on view public.wassce_public_lessons is
  'Public: full content of every published lesson. Review is optional; when present it gives the byline, linked to the reviewer''s tutor page, with their qualification, when they are a tutor.';
revoke all on public.wassce_public_lessons from public, anon, authenticated;
grant select on public.wassce_public_lessons to anon, authenticated;

commit;
