-- 2026-11-18 · A listed tutor gets the plain page address before a hidden one (29).
-- Run after 28. Safe to run twice. Applied by the "Apply database migrations"
-- workflow.
--
-- Migration 28 gave each tutor an address from their name, oldest first. Where
-- two tutors share a name, a hidden or removed tutor could take the plain
-- address (/tutors/mohamed-bangura) and the tutor students actually see got a
-- numbered one (/tutors/mohamed-bangura-2). Nothing has been published at those
-- addresses yet, so they swap: the listed tutor gets the plain address. No
-- account or card is changed or removed, only the two addresses.
--
-- From now on a new tutor whose name matches a hidden tutor's address still
-- gets a numbered address (addresses never change once set, so shared links
-- keep working); admins can ask for a swap like this one.

begin;

alter table public.tutors disable trigger tutors_set_slug;

do $$
declare r record;
begin
  for r in
    select distinct on (hid.id) pub.id as pub_id, pub.slug as pub_slug, hid.id as hid_id, hid.slug as hid_slug
      from public.tutors pub
      join public.tutors hid on pub.slug ~ ('^' || hid.slug || '-[0-9]+$')
     where pub.status = 'active' and pub.listed
       and not (hid.status = 'active' and hid.listed)
       -- only when the hidden tutor holds exactly the plain name address
       and hid.slug = btrim(regexp_replace(lower(hid.full_name), '[^a-z0-9]+', '-', 'g'), '-')
     order by hid.id, pub.verified_at
  loop
    update public.tutors set slug = 'swap-' || r.hid_id where id = r.hid_id;
    update public.tutors set slug = r.hid_slug where id = r.pub_id;
    update public.tutors set slug = r.pub_slug where id = r.hid_id;
  end loop;
end $$;

alter table public.tutors enable trigger tutors_set_slug;

commit;
