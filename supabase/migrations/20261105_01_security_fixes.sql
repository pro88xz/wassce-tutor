-- 2026-11-05 · Security fixes. Run this first, on its own, in the Supabase SQL editor.
--
-- 1. import_lessons() could be called by ANYONE, including logged-out visitors
--    with the public site key (verified against the live API on 2026-11-05).
--    It is SECURITY DEFINER, so it bypasses row-level security: a stranger
--    could insert lessons or overwrite the content of any existing lesson.
--    Fix: same function body, plus the admin check import_topics() already
--    has, plus a fixed search_path.
-- 2. The admin/payment functions are executable by logged-out visitors at the
--    database level. Each checks is_admin inside, but there's no reason to
--    expose them: restrict them to signed-in users.
-- 3. Answer options (including which answer is correct) were readable by every
--    signed-in user, even with an expired trial. Now: access holders only,
--    the same rule as questions.
-- 4. payment_requests: users could insert a request already marked
--    "activated", or claim the yearly plan at the monthly price. Now a new
--    request must be pending, unactivated, and at a listed plan price.
--    KEEP IN SYNC with PLANS in src/routes/subscribe.tsx when prices change.

begin;

-- 1 ─────────────────────────────────────────────────────────────────────────
create or replace function public.import_lessons(p_lessons jsonb)
 returns table(inserted integer, updated integer, errors jsonb)
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
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
  -- Admins only (this function bypasses row-level security).
  if not public.is_admin() then
    raise exception 'Not authorised';
  end if;

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

-- 2 ─────────────────────────────────────────────────────────────────────────
revoke execute on function public.import_lessons(jsonb) from public, anon;
revoke execute on function public.import_topics(jsonb) from public, anon;
revoke execute on function public.activate_payment(uuid) from public, anon;
grant execute on function public.import_lessons(jsonb) to authenticated;
grant execute on function public.import_topics(jsonb) to authenticated;
grant execute on function public.activate_payment(uuid) to authenticated;

-- 3 ─────────────────────────────────────────────────────────────────────────
drop policy if exists "options readable by authenticated" on public.options;
drop policy if exists "options readable by access holders" on public.options;
create policy "options readable by access holders" on public.options
  for select to public
  using (public.user_has_access());

-- 4 ─────────────────────────────────────────────────────────────────────────
drop policy if exists "users insert own payment requests" on public.payment_requests;
create policy "users insert own payment requests" on public.payment_requests
  for insert to public
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and activated_at is null
    and activated_by is null
    and (plan, amount_nle) in (('monthly', 25), ('quarterly', 60), ('yearly', 220))
  );

commit;

-- Check (should return: import_lessons | f for anon):
-- select p.proname, has_function_privilege('anon', p.oid, 'execute') as anon_can_execute
-- from pg_proc p where p.pronamespace = 'public'::regnamespace
--   and p.proname in ('import_lessons', 'import_topics', 'activate_payment');
