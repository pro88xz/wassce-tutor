-- Live database schema as of 2026-11-05, BEFORE migrations/20261105_*.sql.
-- Reconstructed from catalog exports run in the Supabase SQL editor (columns,
-- indexes, row-level security policies, functions, grants). Reference only:
-- foreign keys, check constraints and the auth.users signup trigger that
-- calls handle_new_user() are not included. Do not run this against the
-- live project.


create table public.attempt_answers (
  id uuid not null default gen_random_uuid(),
  attempt_id uuid not null,
  question_id uuid not null,
  option_id uuid,
  is_correct boolean not null,
  created_at timestamp with time zone not null default now()
);

create table public.attempts (
  id uuid not null default gen_random_uuid(),
  profile_id uuid not null,
  paper_id uuid not null,
  score integer not null,
  total integer not null,
  created_at timestamp with time zone not null default now()
);

create table public.downloads (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  user_agent text,
  client_id text
);

create table public.faculties (
  id uuid not null default gen_random_uuid(),
  slug text not null,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now()
);

create table public.faculty_subjects (
  id uuid not null default gen_random_uuid(),
  faculty_id uuid not null,
  subject_id uuid not null,
  role text not null,
  is_default boolean not null default false,
  sort_order integer not null default 0
);

create table public.lessons (
  id uuid not null default gen_random_uuid(),
  topic_id uuid not null,
  slug text not null,
  title text not null,
  content text not null,
  est_minutes integer,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamp with time zone not null default now()
);

create table public.options (
  id uuid not null default gen_random_uuid(),
  question_id uuid not null,
  label text not null,
  content text not null,
  is_correct boolean not null default false,
  position integer not null default 0,
  created_at timestamp with time zone not null default now()
);

create table public.papers (
  id uuid not null default gen_random_uuid(),
  subject_id uuid not null,
  title text not null,
  year integer,
  paper_type text,
  description text,
  question_count integer not null default 0,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamp with time zone not null default now()
);

create table public.payment_requests (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  plan text not null,
  amount_nle integer not null,
  reference_code text not null,
  status text not null default 'pending'::text,
  created_at timestamp with time zone not null default now(),
  activated_at timestamp with time zone,
  activated_by uuid
);

create table public.profiles (
  id uuid not null,
  full_name text,
  faculty_id uuid,
  onboarded boolean not null default false,
  trial_started_at timestamp with time zone,
  subscription_active boolean not null default false,
  subscription_expires_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  is_admin boolean not null default false,
  admin_failed_attempts integer not null default 0,
  admin_locked_until timestamp with time zone,
  tutor_questions_today integer default 0,
  tutor_questions_date date default CURRENT_DATE
);

create table public.questions (
  id uuid not null default gen_random_uuid(),
  paper_id uuid not null,
  stem text not null,
  image_url text,
  explanation text,
  position integer not null default 0,
  created_at timestamp with time zone not null default now(),
  topic_id uuid
);

create table public.student_subjects (
  id uuid not null default gen_random_uuid(),
  profile_id uuid not null,
  subject_id uuid not null,
  created_at timestamp with time zone not null default now()
);

create table public.subjects (
  id uuid not null default gen_random_uuid(),
  slug text not null,
  name text not null,
  description text,
  created_at timestamp with time zone not null default now()
);

create table public.topics (
  id uuid not null default gen_random_uuid(),
  subject_id uuid not null,
  slug text not null,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now(),
  group_name text,
  group_order integer
);

create table public.tutor_messages (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  role text not null,
  content text not null,
  created_at timestamp with time zone not null default now()
);

CREATE UNIQUE INDEX attempt_answers_pkey ON public.attempt_answers USING btree (id);

CREATE INDEX idx_attempt_answers_attempt ON public.attempt_answers USING btree (attempt_id);

CREATE UNIQUE INDEX attempts_pkey ON public.attempts USING btree (id);

CREATE INDEX idx_attempts_paper ON public.attempts USING btree (paper_id);

CREATE INDEX idx_attempts_profile ON public.attempts USING btree (profile_id);

CREATE INDEX downloads_created_at_idx ON public.downloads USING btree (created_at DESC);

CREATE UNIQUE INDEX downloads_pkey ON public.downloads USING btree (id);

CREATE UNIQUE INDEX faculties_pkey ON public.faculties USING btree (id);

CREATE UNIQUE INDEX faculties_slug_key ON public.faculties USING btree (slug);

CREATE UNIQUE INDEX faculty_subjects_faculty_id_subject_id_key ON public.faculty_subjects USING btree (faculty_id, subject_id);

CREATE UNIQUE INDEX faculty_subjects_pkey ON public.faculty_subjects USING btree (id);

CREATE INDEX idx_lessons_topic ON public.lessons USING btree (topic_id);

CREATE UNIQUE INDEX lessons_pkey ON public.lessons USING btree (id);

CREATE UNIQUE INDEX lessons_topic_id_slug_key ON public.lessons USING btree (topic_id, slug);

CREATE INDEX idx_options_question ON public.options USING btree (question_id);

CREATE UNIQUE INDEX options_pkey ON public.options USING btree (id);

CREATE INDEX idx_papers_subject ON public.papers USING btree (subject_id);

CREATE UNIQUE INDEX papers_pkey ON public.papers USING btree (id);

CREATE UNIQUE INDEX payment_requests_pkey ON public.payment_requests USING btree (id);

CREATE UNIQUE INDEX payment_requests_reference_code_key ON public.payment_requests USING btree (reference_code);

CREATE INDEX payment_requests_status_idx ON public.payment_requests USING btree (status, created_at DESC);

CREATE INDEX payment_requests_user_idx ON public.payment_requests USING btree (user_id, created_at DESC);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE INDEX idx_questions_paper ON public.questions USING btree (paper_id);

CREATE INDEX idx_questions_topic ON public.questions USING btree (topic_id);

CREATE UNIQUE INDEX questions_pkey ON public.questions USING btree (id);

CREATE UNIQUE INDEX student_subjects_pkey ON public.student_subjects USING btree (id);

CREATE UNIQUE INDEX student_subjects_profile_id_subject_id_key ON public.student_subjects USING btree (profile_id, subject_id);

CREATE UNIQUE INDEX subjects_pkey ON public.subjects USING btree (id);

CREATE UNIQUE INDEX subjects_slug_key ON public.subjects USING btree (slug);

CREATE INDEX idx_topics_subject ON public.topics USING btree (subject_id);

CREATE UNIQUE INDEX topics_pkey ON public.topics USING btree (id);

CREATE INDEX topics_subject_group_idx ON public.topics USING btree (subject_id, group_order, sort_order);

CREATE UNIQUE INDEX topics_subject_id_slug_key ON public.topics USING btree (subject_id, slug);

CREATE UNIQUE INDEX tutor_messages_pkey ON public.tutor_messages USING btree (id);

CREATE INDEX tutor_messages_user_idx ON public.tutor_messages USING btree (user_id, created_at);

alter table public.attempt_answers enable row level security;

alter table public.attempts enable row level security;

alter table public.downloads enable row level security;

alter table public.faculties enable row level security;

alter table public.faculty_subjects enable row level security;

alter table public.lessons enable row level security;

alter table public.options enable row level security;

alter table public.papers enable row level security;

alter table public.payment_requests enable row level security;

alter table public.profiles enable row level security;

alter table public.questions enable row level security;

alter table public.student_subjects enable row level security;

alter table public.subjects enable row level security;

alter table public.topics enable row level security;

alter table public.tutor_messages enable row level security;

CREATE OR REPLACE FUNCTION public.activate_payment(p_request_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_request public.payment_requests%rowtype;
  v_expires timestamptz;
  v_admin_id uuid;
begin
  -- Verify caller is admin
  v_admin_id := auth.uid();
  if not exists (select 1 from public.profiles where id = v_admin_id and is_admin = true) then
    raise exception 'Not authorised';
  end if;

  -- Load the request
  select * into v_request from public.payment_requests where id = p_request_id;
  if not found then
    raise exception 'Request not found';
  end if;
  if v_request.status = 'activated' then
    raise exception 'Already activated';
  end if;

  -- Calculate new expiry: stack on top of existing subscription if any
  select greatest(coalesce(subscription_expires_at, now()), now())
  into v_expires
  from public.profiles where id = v_request.user_id;

  v_expires := v_expires + case v_request.plan
    when 'monthly' then interval '1 month'
    when 'quarterly' then interval '3 months'
    when 'yearly' then interval '1 year'
  end;

  -- Update profile
  update public.profiles
  set subscription_active = true,
      subscription_expires_at = v_expires
  where id = v_request.user_id;

  -- Mark request activated
  update public.payment_requests
  set status = 'activated',
      activated_at = now(),
      activated_by = v_admin_id
  where id = p_request_id;
end;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, full_name, trial_started_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    now()  -- trial starts at signup
  );
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.import_lessons(p_lessons jsonb)
 RETURNS TABLE(inserted integer, updated integer, errors jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_inserted int := 0;
  v_updated  int := 0;
  v_errors   jsonb := '[]'::jsonb;
  v_row      jsonb;
  v_subject_id uuid;
  v_topic_id   uuid;
  v_slug       text;
  v_existing_id uuid;
  v_existing_slug text;
begin
  if jsonb_typeof(p_lessons) <> 'array' then
    raise exception 'p_lessons must be a JSON array';
  end if;

  for v_row in select * from jsonb_array_elements(p_lessons) loop
    begin
      select s.id into v_subject_id
      from public.subjects s
      where s.name = v_row->>'subject'
      limit 1;

      if v_subject_id is null then
        v_errors := v_errors || jsonb_build_object(
          'row', v_row,
          'error', 'Subject not found: ' || coalesce(v_row->>'subject', 'null')
        );
        continue;
      end if;

      select t.id into v_topic_id
      from public.topics t
      where t.subject_id = v_subject_id
        and t.slug = v_row->>'topic'
      limit 1;

      if v_topic_id is null then
        v_errors := v_errors || jsonb_build_object(
          'row', v_row,
          'error', 'Topic not found: ' || coalesce(v_row->>'topic', 'null') || ' in subject ' || coalesce(v_row->>'subject', 'null')
        );
        continue;
      end if;

      -- Match by TITLE first (the human-readable identifier)
      -- This catches lessons that were manually created in admin UI with
      -- potentially different slug generation.
      select l.id, l.slug into v_existing_id, v_existing_slug
      from public.lessons l
      where l.topic_id = v_topic_id
        and l.title = v_row->>'title'
      limit 1;

      if v_existing_id is null then
        -- New lesson: compute fresh slug and insert
        v_slug := lower(regexp_replace(regexp_replace(v_row->>'title', '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
        v_slug := regexp_replace(v_slug, '-+', '-', 'g');
        v_slug := trim(both '-' from v_slug);

        insert into public.lessons (topic_id, slug, title, content, est_minutes, sort_order)
        values (
          v_topic_id,
          v_slug,
          v_row->>'title',
          v_row->>'content',
          nullif(v_row->>'est_minutes', '')::int,
          coalesce(nullif(v_row->>'sort_order', '')::int, 0)
        );
        v_inserted := v_inserted + 1;
      else
        -- Update existing lesson in place. Keep its existing slug
        -- (URLs stay stable, no broken links).
        update public.lessons set
          content     = v_row->>'content',
          est_minutes = nullif(v_row->>'est_minutes', '')::int,
          sort_order  = coalesce(nullif(v_row->>'sort_order', '')::int, 0)
        where id = v_existing_id;
        v_updated := v_updated + 1;
      end if;

    exception when others then
      v_errors := v_errors || jsonb_build_object('row', v_row, 'error', sqlerrm);
    end;
  end loop;

  return query select v_inserted, v_updated, v_errors;
end;
$function$;

CREATE OR REPLACE FUNCTION public.import_topics(p_topics jsonb)
 RETURNS TABLE(inserted integer, updated integer, errors jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_admin_id uuid;
  v_row jsonb;
  v_subject_id uuid;
  v_slug text;
  v_name text;
  v_inserted int := 0;
  v_updated int := 0;
  v_errors jsonb := '[]'::jsonb;
  v_existing_id uuid;
begin
  v_admin_id := auth.uid();
  if not exists (select 1 from public.profiles where id = v_admin_id and is_admin = true) then
    raise exception 'Not authorised';
  end if;

  -- Iterate each row in the JSON array
  for v_row in select * from jsonb_array_elements(p_topics) loop
    v_name := trim(v_row->>'name');
    if v_name is null or v_name = '' then
      v_errors := v_errors || jsonb_build_object('row', v_row, 'error', 'Missing name');
      continue;
    end if;

    -- Look up subject_id from subject name (case-insensitive)
    select id into v_subject_id
    from public.subjects
    where lower(name) = lower(trim(v_row->>'subject'))
    limit 1;

    if v_subject_id is null then
      v_errors := v_errors || jsonb_build_object('row', v_row, 'error', 'Subject not found: ' || coalesce(v_row->>'subject', 'null'));
      continue;
    end if;

    -- Generate slug from name: lowercase, replace non-alphanumeric with hyphens, trim hyphens
    v_slug := regexp_replace(lower(v_name), '[^a-z0-9]+', '-', 'g');
    v_slug := trim(both '-' from v_slug);

    -- Check if topic with this slug already exists in this subject
    select id into v_existing_id
    from public.topics
    where subject_id = v_subject_id and slug = v_slug;

    if v_existing_id is not null then
      -- Update existing topic
      update public.topics
      set name = v_name,
          description = nullif(trim(v_row->>'description'), ''),
          sort_order = coalesce((v_row->>'sort_order')::int, sort_order)
      where id = v_existing_id;
      v_updated := v_updated + 1;
    else
      -- Insert new topic
      insert into public.topics (subject_id, slug, name, description, sort_order)
      values (
        v_subject_id,
        v_slug,
        v_name,
        nullif(trim(v_row->>'description'), ''),
        coalesce((v_row->>'sort_order')::int, 0)
      );
      v_inserted := v_inserted + 1;
    end if;
  end loop;

  return query select v_inserted, v_updated, v_errors;
end;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$function$;

CREATE OR REPLACE FUNCTION public.user_has_access()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND (
        -- Admin always has access
        is_admin = true
        OR
        -- Active subscription, not expired
        (subscription_active = true AND subscription_expires_at > now())
        OR
        -- Within 7-day trial window
        (trial_started_at IS NOT NULL AND trial_started_at + interval '7 days' > now())
      )
  );
$function$;

create policy "own attempt_answers readable" on public.attempt_answers for select to authenticated
  using ((EXISTS ( SELECT 1
   FROM attempts a
  WHERE ((a.id = attempt_answers.attempt_id) AND (a.profile_id = auth.uid())))));

create policy "own attempt_answers insertable" on public.attempt_answers for insert to authenticated
  with check ((EXISTS ( SELECT 1
   FROM attempts a
  WHERE ((a.id = attempt_answers.attempt_id) AND (a.profile_id = auth.uid())))));

create policy "own attempts readable" on public.attempts for select to authenticated
  using ((auth.uid() = profile_id));

create policy "own attempts insertable" on public.attempts for insert to authenticated
  with check ((auth.uid() = profile_id));

create policy "admins can read all downloads" on public.downloads for select to public
  using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));

create policy "anyone can insert download events" on public.downloads for insert to anon,authenticated
  with check (true);

create policy "faculties readable by all" on public.faculties for select to public
  using (true);

create policy "faculty_subjects readable by all" on public.faculty_subjects for select to public
  using (true);

create policy "admins update lessons" on public.lessons for update to authenticated
  using (is_admin())
  with check (is_admin());

create policy "admins delete lessons" on public.lessons for delete to authenticated
  using (is_admin());

create policy "admins insert lessons" on public.lessons for insert to authenticated
  with check (is_admin());

create policy "lessons readable by access holders" on public.lessons for select to public
  using (user_has_access());

create policy "admins delete options" on public.options for delete to authenticated
  using (is_admin());

create policy "options readable by authenticated" on public.options for select to authenticated
  using (true);

create policy "admins update options" on public.options for update to authenticated
  using (is_admin())
  with check (is_admin());

create policy "admins insert options" on public.options for insert to authenticated
  with check (is_admin());

create policy "papers readable by access holders" on public.papers for select to public
  using (user_has_access());

create policy "admins delete papers" on public.papers for delete to authenticated
  using (is_admin());

create policy "admins insert papers" on public.papers for insert to authenticated
  with check (is_admin());

create policy "admins update papers" on public.papers for update to authenticated
  using (is_admin())
  with check (is_admin());

create policy "admins read all payment requests" on public.payment_requests for select to public
  using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));

create policy "users read own payment requests" on public.payment_requests for select to public
  using ((auth.uid() = user_id));

create policy "users insert own payment requests" on public.payment_requests for insert to public
  with check ((auth.uid() = user_id));

create policy "admins update payment requests" on public.payment_requests for update to public
  using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))));

create policy "admins read all profiles" on public.profiles for select to authenticated
  using ((is_admin() OR (auth.uid() = id)));

create policy "own profile updatable - safe columns only" on public.profiles for update to public
  using ((auth.uid() = id))
  with check (((auth.uid() = id) AND (is_admin = ( SELECT profiles_1.is_admin
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid()))) AND (subscription_active = ( SELECT profiles_1.subscription_active
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid()))) AND (NOT (subscription_expires_at IS DISTINCT FROM ( SELECT profiles_1.subscription_expires_at
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid())))) AND (NOT (trial_started_at IS DISTINCT FROM ( SELECT profiles_1.trial_started_at
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid())))) AND (admin_failed_attempts = ( SELECT profiles_1.admin_failed_attempts
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid()))) AND (NOT (admin_locked_until IS DISTINCT FROM ( SELECT profiles_1.admin_locked_until
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid())))) AND (tutor_questions_today = ( SELECT profiles_1.tutor_questions_today
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid()))) AND (NOT (tutor_questions_date IS DISTINCT FROM ( SELECT profiles_1.tutor_questions_date
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid()))))));

create policy "own profile readable" on public.profiles for select to public
  using ((auth.uid() = id));

create policy "admins delete questions" on public.questions for delete to authenticated
  using (is_admin());

create policy "questions readable by access holders" on public.questions for select to public
  using (user_has_access());

create policy "admins update questions" on public.questions for update to authenticated
  using (is_admin())
  with check (is_admin());

create policy "admins insert questions" on public.questions for insert to authenticated
  with check (is_admin());

create policy "own student_subjects insertable" on public.student_subjects for insert to public
  with check ((auth.uid() = profile_id));

create policy "own student_subjects deletable" on public.student_subjects for delete to public
  using ((auth.uid() = profile_id));

create policy "own student_subjects readable" on public.student_subjects for select to public
  using ((auth.uid() = profile_id));

create policy "subjects readable by all" on public.subjects for select to public
  using (true);

create policy "topics readable by authenticated" on public.topics for select to authenticated
  using (true);

create policy "admins delete topics" on public.topics for delete to authenticated
  using (is_admin());

create policy "admins update topics" on public.topics for update to authenticated
  using (is_admin())
  with check (is_admin());

create policy "admins insert topics" on public.topics for insert to authenticated
  with check (is_admin());

create policy "own messages delete" on public.tutor_messages for delete to public
  using ((auth.uid() = user_id));

create policy "own messages select" on public.tutor_messages for select to public
  using ((auth.uid() = user_id));

create policy "own messages insert" on public.tutor_messages for insert to public
  with check ((auth.uid() = user_id));

grant usage on schema public to anon, authenticated;

grant all on all tables in schema public to anon, authenticated;

grant execute on all functions in schema public to public, anon, authenticated;
