-- 2026-11-05 · Full-word subject slugs. Run after 02, before the public
-- /wassce/{subject} pages go live.
--
-- Subject slugs become public URLs (wasscetutor.com/wassce/{slug}), so the
-- abbreviated seed slugs are replaced with the words students search for.
-- Nothing in the app or the import functions looks subjects up by slug
-- (imports match on subject name), so this is safe. Once these URLs are live,
-- changing a slug again needs a redirect in vercel.json.

begin;

update public.subjects set slug = v.new_slug
from (values
  ('agric-science',  'agricultural-science'),
  ('building-const', 'building-construction'),
  ('business-mgmt',  'business-management'),
  ('english',        'english-language'),
  ('accounting',     'financial-accounting'),
  ('further-maths',  'further-mathematics'),
  ('literature',     'literature-in-english'),
  ('religious-std',  'religious-studies'),
  ('technical-draw', 'technical-drawing'),
  ('ict',            'ict-computer-studies')
) as v(old_slug, new_slug)
where public.subjects.slug = v.old_slug;

-- Subject slugs share the /wassce/{x} URL space with guide pages.
alter table public.subjects drop constraint if exists subjects_slug_not_reserved;
alter table public.subjects add constraint subjects_slug_not_reserved
  check (slug !~ '^(subjects|timetable|grading-system|results|results-sierra-leone|syllabus|private-candidates|new-curriculum|how-to-pass|cbt-practice|[0-9]{4})$');

commit;

-- Check: select slug, name from public.subjects order by name;
