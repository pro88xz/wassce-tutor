-- 20261106_05_hidden_sets.sql
--
-- An admin can hide a practice set (papers.is_published = false) in
-- Admin -> Review. Until now only the app's screens respected that: the
-- database still returned hidden papers, their questions and their answers
-- to any student with access who asked for them directly. These policies
-- make the database enforce it:
--
--   students with access   published papers only, with their questions/options
--   admins                 everything (so they can try a hidden set before showing it)
--   everyone else          nothing (unchanged)
--
-- Free public pages read the wassce_public_* views, which are unaffected.
-- Safe to run more than once.

begin;

drop policy if exists "papers readable by access holders" on public.papers;
create policy "papers readable by access holders" on public.papers
  for select to public
  using (public.is_admin() or (is_published and public.user_has_access()));

drop policy if exists "questions readable by access holders" on public.questions;
create policy "questions readable by access holders" on public.questions
  for select to public
  using (
    public.is_admin()
    or (
      public.user_has_access()
      and exists (select 1 from public.papers p where p.id = questions.paper_id and p.is_published)
    )
  );

drop policy if exists "options readable by access holders" on public.options;
create policy "options readable by access holders" on public.options
  for select to public
  using (
    public.is_admin()
    or (
      public.user_has_access()
      and exists (
        select 1 from public.questions q join public.papers p on p.id = q.paper_id
        where q.id = options.question_id and p.is_published
      )
    )
  );

-- The public counts include only questions students can see.
create or replace view public.wassce_stats with (security_invoker = false) as
  select (select count(*) from public.subjects) as subjects,
         (select count(*) from public.topics) as topics,
         (select count(*) from public.lessons where is_published) as lessons,
         (select count(*) from public.questions q join public.papers p on p.id = q.paper_id
          where p.is_published) as questions;

commit;
