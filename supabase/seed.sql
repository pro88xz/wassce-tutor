-- ============================================================
-- WASSCE TUTOR — Seed data (faculties + subjects + links)
-- SL-appropriate WASSCE subjects
-- ============================================================

-- FACULTIES
insert into public.faculties (slug, name, description, sort_order) values
  ('science',    'Science',    'Physics, Chemistry, Biology and related sciences', 1),
  ('arts',       'Arts',       'Languages, literature, history and humanities',     2),
  ('commercial', 'Commercial', 'Business, accounting, economics and commerce',      3),
  ('technical',  'Technical',  'Technical drawing, construction and applied skills', 4);

-- SUBJECTS (each once)
insert into public.subjects (slug, name) values
  ('english',        'English Language'),
  ('mathematics',    'Mathematics'),
  ('physics',        'Physics'),
  ('chemistry',      'Chemistry'),
  ('biology',        'Biology'),
  ('further-maths',  'Further Mathematics'),
  ('agric-science',  'Agricultural Science'),
  ('geography',      'Geography'),
  ('literature',     'Literature in English'),
  ('government',     'Government'),
  ('history',        'History'),
  ('religious-std',  'Religious Studies'),
  ('economics',      'Economics'),
  ('accounting',     'Financial Accounting'),
  ('commerce',       'Commerce'),
  ('business-mgmt',  'Business Management'),
  ('technical-draw', 'Technical Drawing'),
  ('building-const', 'Building Construction'),
  ('ict',            'ICT / Computer Studies');

-- LINK CORE SUBJECTS (English + Maths) to ALL faculties as role='core', default
insert into public.faculty_subjects (faculty_id, subject_id, role, is_default, sort_order)
select f.id, s.id, 'core', true, 0
from public.faculties f
cross join public.subjects s
where s.slug in ('english','mathematics');

-- helper: link a subject to a faculty
-- SCIENCE
insert into public.faculty_subjects (faculty_id, subject_id, role, is_default, sort_order)
select f.id, s.id, v.role, v.is_default, v.sort_order
from public.faculties f
join (values
  ('physics','faculty',true,1),
  ('chemistry','faculty',true,2),
  ('biology','faculty',true,3),
  ('further-maths','elective',false,4),
  ('agric-science','elective',false,5),
  ('geography','elective',false,6),
  ('ict','elective',false,7)
) as v(slug,role,is_default,sort_order) on true
join public.subjects s on s.slug = v.slug
where f.slug = 'science';

-- ARTS
insert into public.faculty_subjects (faculty_id, subject_id, role, is_default, sort_order)
select f.id, s.id, v.role, v.is_default, v.sort_order
from public.faculties f
join (values
  ('literature','faculty',true,1),
  ('government','faculty',true,2),
  ('history','faculty',true,3),
  ('geography','elective',false,4),
  ('economics','elective',false,5),
  ('religious-std','elective',false,6)
) as v(slug,role,is_default,sort_order) on true
join public.subjects s on s.slug = v.slug
where f.slug = 'arts';

-- COMMERCIAL
insert into public.faculty_subjects (faculty_id, subject_id, role, is_default, sort_order)
select f.id, s.id, v.role, v.is_default, v.sort_order
from public.faculties f
join (values
  ('accounting','faculty',true,1),
  ('commerce','faculty',true,2),
  ('economics','faculty',true,3),
  ('business-mgmt','elective',false,4),
  ('geography','elective',false,5),
  ('government','elective',false,6)
) as v(slug,role,is_default,sort_order) on true
join public.subjects s on s.slug = v.slug
where f.slug = 'commercial';

-- TECHNICAL
insert into public.faculty_subjects (faculty_id, subject_id, role, is_default, sort_order)
select f.id, s.id, v.role, v.is_default, v.sort_order
from public.faculties f
join (values
  ('technical-draw','faculty',true,1),
  ('physics','faculty',true,2),
  ('building-const','faculty',true,3),
  ('ict','elective',false,4),
  ('further-maths','elective',false,5)
) as v(slug,role,is_default,sort_order) on true
join public.subjects s on s.slug = v.slug
where f.slug = 'technical';
