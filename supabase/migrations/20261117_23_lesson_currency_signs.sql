-- 20261117_23_lesson_currency_signs.sql
--
-- One lesson ("The dual aspect concept: accounting equation", Financial
-- Accounting) writes amounts as $95,000 in plain text. On a page, $ starts
-- maths, so two amounts on one line ("equal $95,000 and ... equal $30,000")
-- turned the words between them into a block of italic maths. This lesson
-- became public in migration 22.
--
-- The fix escapes a $ that is followed by a digit and not already escaped
-- (\$95,000), which the lesson renderer shows as a plain dollar sign. Amounts
-- inside maths are already written \$95,000 and are left alone. The lesson
-- was imported by hand (it is not in content/notes), so it is fixed here.
--
-- Safe to run more than once: an escaped $ is never matched again.

begin;

update public.lessons
set content = regexp_replace(content, '(?<![\\$])\$(?=[0-9])', '\\$', 'g'),
    updated_at = now()
where id = '5f81e3d3-be2f-42f7-8c47-c8ab937b95bd'
  and content ~ '(?<![\\$])\$(?=[0-9])';

commit;
