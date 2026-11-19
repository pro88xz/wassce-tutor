-- 20261119_32_lesson_quality_fixes.sql
--
-- From a content audit of every live lesson (19 November 2026).
--
-- 1. Business Management, "Nature and scope of business management": its ten
--    lessons were outlines of 104 to 205 words. They are rewritten as full
--    lessons (content/notes/business-management-*.md, published by the notes
--    sync at the same addresses). The approvals recorded for the outlines
--    (migration 30) do not cover the new text, so they are cleared: the
--    lessons say "By the WASSCE Tutor team" until a reviewer approves them
--    again on the Review screen.
-- 2. "Special passive cases" (English): a table cell showed a literal "<br>".
-- 3. "Rounding: decimal places and significant figures" (Mathematics): an
--    example rounded a weight "to the nearest cedi" (a Ghanaian currency)
--    and then showed kilograms. It now rounds to the nearest kilogram.
--
-- The Sharecropping lesson, which had the State land ownership lesson's
-- text, is replaced by the notes sync (content/notes/agricultural-science-
-- sharecropping.md); it was never reviewed, so nothing to clear here.
--
-- Safe to run more than once.

begin;

-- 1 · Clear the approvals of the rewritten Business Management lessons
update public.lessons
set reviewed_at = null, reviewed_by = null, updated_at = now()
where id in (
    '6aa1ff46-fbee-48ea-b76e-cb24e2a26231',
    'ea3be6ef-17d8-44a7-b643-d739da45a812',
    'e5b2cf54-2451-423f-bf51-c10005a14dd2',
    '8a6898e6-93e2-403c-8d23-ca366276fa31',
    'd581e82f-9bad-439c-8f56-70a8c3383757',
    '60434abd-d891-4c24-acd8-26afd389e8f3',
    '730555e2-ddc3-44dc-9eb4-fd73c4cdb8e7',
    'bbdbc508-6b59-48b5-84a6-b0ce03898870',
    'dcae68f0-944d-4ce8-829a-2903c1d31c28',
    'f9e5ccb9-9029-47f8-9066-8b70d6679163'
  )
  -- Approvals given before the rewrite (they were recorded on 18 November);
  -- a reviewer's approval of the new text, from 19 November on, is kept.
  and reviewed_at < timestamptz '2026-11-19 00:00:00+00';

-- 2 · A literal <br> in a table cell
update public.lessons
set content = replace(content, 'direct object<br>(2) direct', 'direct object; (2) direct'), updated_at = now()
where id = '192d9ccc-6f49-42d9-8f64-a74276db8e44'
  and content like '%direct object<br>(2) direct%';

-- 3 · Round a weight to kilograms, not to a currency
update public.lessons
set content = replace(content,
    'The shop''s price tag rounds to the nearest cedi: $25$ kg displayed.',
    'The shop''s display rounds to the nearest kilogram: $25$ kg.'),
    updated_at = now()
where id = 'aa39949a-d814-4b12-862a-7d7ff1da5ef9'
  and content like '%nearest cedi%';

commit;
