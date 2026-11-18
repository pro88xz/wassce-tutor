-- 2026-11-18 · Every tutor has their own page; tutors review lessons in the
-- subjects they teach (28). Run after 27. Safe to run twice. Applied by the
-- "Apply database migrations" workflow.
--
-- 1. tutors.slug: the address of the tutor's page, /tutors/{slug}, made from
--    their name ("john-kaitibie"); never the same as a subject's page, and it
--    stays the same once set so shared links keep working.
-- 2. tutors.reviewer: a verified lesson reviewer. Admins switch it (Admin,
--    Tutors); a tutor can ask to become one. The tutors listed before this
--    migration agreed to review, so they start as reviewers.
-- 3. A reviewer reads the published lessons in the subjects they teach and
--    approves each one (it then says "Reviewed by" them, linking to their
--    page) or reports a problem to the admins. They can withdraw their own
--    approval.
-- 4. wassce_public_lessons: the reviewer's name and line come from their tutor
--    card when they are a tutor, and a new last column, reviewer_tutor_slug,
--    links the byline to their page.
--
-- To undo: drop the functions below, re-run the view from 22, and
-- alter table public.tutors drop column slug, drop column reviewer.

begin;

-- 1 · The tutor's page address ──────────────────────────────────────────────
alter table public.tutors add column if not exists slug text;
create unique index if not exists tutors_slug_key on public.tutors (slug);

create or replace function public.set_tutor_slug()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_base text; v_slug text; n integer := 1;
begin
  -- Once a tutor has an address it never changes, so shared links keep working.
  if tg_op = 'UPDATE' and old.slug is not null then
    new.slug := old.slug;
    return new;
  end if;
  v_base := left(coalesce(nullif(btrim(regexp_replace(lower(coalesce(new.full_name, '')), '[^a-z0-9]+', '-', 'g'), '-'), ''), 'tutor'), 60);
  if exists (select 1 from public.subjects s where s.slug = v_base) then v_base := v_base || '-tutor'; end if;
  v_slug := v_base;
  while exists (select 1 from public.tutors t where t.slug = v_slug and t.id is distinct from new.id) loop
    n := n + 1;
    v_slug := v_base || '-' || n;
  end loop;
  new.slug := v_slug;
  return new;
end $$;
drop trigger if exists tutors_set_slug on public.tutors;
create trigger tutors_set_slug before insert or update on public.tutors
  for each row execute function public.set_tutor_slug();

-- Existing tutors, one at a time, oldest first, so each sees the addresses already taken.
do $$
declare r record;
begin
  for r in select id from public.tutors where slug is null order by verified_at, id loop
    update public.tutors set slug = null where id = r.id;
  end loop;
end $$;
alter table public.tutors alter column slug set not null;

-- 2 · Verified reviewers ────────────────────────────────────────────────────
alter table public.tutors add column if not exists reviewer boolean not null default false;
grant select (slug, reviewer) on public.tutors to anon, authenticated;

-- The tutors who were listed before this migration agreed to review lessons.
update public.tutors set reviewer = true
 where not reviewer and status = 'active' and verified_at < timestamptz '2026-11-18 13:30:00+00';

create or replace function public.set_tutor_reviewer(p_tutor_id uuid, p_on boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare v_user uuid;
begin
  if not public.is_admin() then raise exception 'Not authorised'; end if;
  if p_on is null then raise exception 'Choose on or off'; end if;
  update public.tutors set reviewer = p_on, updated_at = now() where id = p_tutor_id returning user_id into v_user;
  if v_user is null then raise exception 'Tutor not found'; end if;
  if p_on then
    insert into public.user_notifications (recipient_id, actor_id, event_type, title, body, entity_type, entity_id)
    values (v_user, auth.uid(), 'tutor_reviewer_on', 'You can review lessons',
            'You are now a verified lesson reviewer. Open Review in your tutor dashboard: every lesson you approve shows your name and links students to your page.',
            'tutor', p_tutor_id);
  end if;
end $$;

-- A tutor asks to review lessons: the admins are told.
create or replace function public.request_reviewer()
returns void language plpgsql security definer set search_path = '' as $$
declare v_t public.tutors%rowtype;
begin
  select * into v_t from public.tutors t where t.user_id = auth.uid() and t.status = 'active';
  if not found then raise exception 'Approved tutor account required'; end if;
  if v_t.reviewer then raise exception 'You are already a lesson reviewer'; end if;
  if exists (select 1 from public.user_notifications n where n.actor_id = auth.uid() and n.event_type = 'tutor_reviewer_request'
              and n.created_at > now() - interval '7 days') then
    raise exception 'Your request has been sent. We will reply soon.';
  end if;
  insert into public.user_notifications (recipient_id, actor_id, event_type, title, body, entity_type, entity_id)
  select p.id, auth.uid(), 'tutor_reviewer_request', 'A tutor wants to review lessons',
         v_t.full_name || ' (' || v_t.location || ') asked to review lessons in the subjects they teach. Switch on "Lesson reviewer" for them in Admin, Tutors.',
         'tutor', v_t.id
    from public.profiles p where p.is_admin;
end $$;

-- 3 · Reviewing lessons ──────────────────────────────────────────────────────
-- The published lessons in the subjects the calling reviewer teaches.
create or replace function public.tutor_lessons_to_review()
returns table (
  lesson_id uuid, lesson_slug text, lesson_title text, est_minutes integer,
  topic_slug text, topic_name text, subject_slug text, subject_name text,
  reviewed_at timestamptz, reviewed_by_me boolean, reviewer_name text
)
language plpgsql stable security definer set search_path = '' as $$
declare v_tutor uuid;
begin
  select t.id into v_tutor from public.tutors t where t.user_id = auth.uid() and t.status = 'active' and t.reviewer;
  if v_tutor is null then raise exception 'Lesson reviewers only'; end if;
  return query
    select l.id, l.slug, l.title, l.est_minutes, tp.slug, tp.name, s.slug, s.name,
           l.reviewed_at, coalesce(l.reviewed_by = auth.uid(), false),
           case when l.reviewed_at is not null then coalesce(rt.full_name, rp.full_name) end
      from public.lessons l
      join public.topics tp on tp.id = l.topic_id
      join public.subjects s on s.id = tp.subject_id
      left join public.profiles rp on rp.id = l.reviewed_by
      left join public.tutors rt on rt.user_id = l.reviewed_by
     where l.is_published
       and exists (select 1 from public.tutor_subjects ts where ts.tutor_id = v_tutor and ts.subject_id = s.id)
     order by s.name, tp.sort_order, l.sort_order, l.title;
end $$;

-- approved: the lesson says "Reviewed by" the tutor. flagged: the admins get the note.
-- withdrawn: the tutor takes back their own approval.
create or replace function public.tutor_review_lesson(p_lesson uuid, p_decision text, p_note text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare v_t public.tutors%rowtype; v_l public.lessons%rowtype; v_subject text; v_note text := nullif(btrim(coalesce(p_note, '')), '');
begin
  select * into v_t from public.tutors t where t.user_id = auth.uid() and t.status = 'active' and t.reviewer;
  if not found then raise exception 'Lesson reviewers only'; end if;
  if p_decision not in ('approved', 'flagged', 'withdrawn') then raise exception 'Invalid decision'; end if;
  select l.* into v_l from public.lessons l where l.id = p_lesson and l.is_published for update;
  if not found then raise exception 'Lesson not found'; end if;
  select s.name into v_subject
    from public.topics tp join public.subjects s on s.id = tp.subject_id
   where tp.id = v_l.topic_id
     and exists (select 1 from public.tutor_subjects ts where ts.tutor_id = v_t.id and ts.subject_id = s.id);
  if v_subject is null then raise exception 'You can review lessons in the subjects you teach'; end if;

  if p_decision = 'approved' then
    if v_l.reviewed_at is not null and v_l.reviewed_by is distinct from auth.uid() then
      raise exception 'Another reviewer has already approved this lesson';
    end if;
    update public.lessons set reviewed_at = now(), reviewed_by = auth.uid(), is_public = true, updated_at = now() where id = p_lesson;
  elsif p_decision = 'withdrawn' then
    if v_l.reviewed_by is distinct from auth.uid() then raise exception 'You can only withdraw your own approval'; end if;
    update public.lessons set reviewed_at = null, reviewed_by = null, updated_at = now() where id = p_lesson;
  else
    if v_note is null or length(v_note) < 10 then raise exception 'Say what is wrong (at least 10 characters)'; end if;
    insert into public.user_notifications (recipient_id, actor_id, event_type, title, body, entity_type, entity_id)
    select p.id, auth.uid(), 'lesson_flagged', 'A reviewer reported a problem in a lesson',
           v_t.full_name || ' (' || v_subject || ') on "' || v_l.title || '": ' || left(v_note, 1000),
           'lesson', p_lesson
      from public.profiles p where p.is_admin;
  end if;
end $$;

revoke all on function public.set_tutor_slug() from public, anon, authenticated;
revoke all on function public.set_tutor_reviewer(uuid, boolean) from public, anon;
grant execute on function public.set_tutor_reviewer(uuid, boolean) to authenticated;
revoke all on function public.request_reviewer() from public, anon;
grant execute on function public.request_reviewer() to authenticated;
revoke all on function public.tutor_lessons_to_review() from public, anon;
grant execute on function public.tutor_lessons_to_review() to authenticated;
revoke all on function public.tutor_review_lesson(uuid, text, text) from public, anon;
grant execute on function public.tutor_review_lesson(uuid, text, text) to authenticated;

-- 4 · The byline links to the reviewer's page ─────────────────────────────────
create or replace view public.wassce_public_lessons with (security_invoker = false) as
  select l.id, l.topic_id, l.slug, l.title, l.content, l.est_minutes, l.sort_order,
         l.reviewed_at, l.updated_at,
         coalesce(t.full_name, r.full_name) as reviewer_name,
         coalesce(nullif(btrim(r.public_bio), ''), case when t.id is not null then 'WASSCE tutor in ' || t.location end) as reviewer_bio,
         t.slug as reviewer_tutor_slug
  from public.lessons l
  left join public.profiles r on r.id = l.reviewed_by and l.reviewed_at is not null
  left join public.tutors t on t.user_id = l.reviewed_by and l.reviewed_at is not null and t.status = 'active' and t.listed
  where l.is_published;
comment on view public.wassce_public_lessons is
  'Public: full content of every published lesson. Review is optional; when present it gives the byline, linked to the reviewer''s tutor page when they are a tutor.';
revoke all on public.wassce_public_lessons from public, anon, authenticated;
grant select on public.wassce_public_lessons to anon, authenticated;

commit;
