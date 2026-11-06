# Supabase

## Source of truth

- `live_schema_2026-11-05.sql`: the live database as it was on 5 November 2026,
  reconstructed from catalog exports. Reference only, never run it.
- `migrations/`: every change since then, in filename order. Run each file
  once, in order, in the Supabase SQL editor (Dashboard → SQL Editor → paste →
  Run). Each file is wrapped in a transaction and is safe to run twice.

The older files in this folder (`schema.sql`, `rls.sql`, `content_schema.sql`,
`content_rls.sql`, `topics_schema.sql`, `progress_*.sql`, `seed.sql`,
`sample_paper.sql`) are history from before the live database drifted: they do
not match it (no `payment_requests`, `tutor_messages`, `user_has_access()`,
etc.). Don't run them against the live project.

## Migrations

| File | What it does |
|---|---|
| `20261105_01_security_fixes.sql` | Admin check on `import_lessons()` (was callable by anyone); admin/payment functions no longer callable logged-out; answer options only for access holders; payment requests must be pending and at a listed price |
| `20261105_02_seo_foundations.sql` | `updated_at` on content tables; review flags (`is_public`, `reviewed_at`, `reviewed_by`) on lessons and questions; `papers.slug`; topics readable by everyone; read-only public views `wassce_lesson_index`, `wassce_public_lessons`, `wassce_public_questions`, `wassce_stats` |
| `20261105_03_subject_slugs.sql` | Full-word subject slugs for public URLs, with a check against reserved words |
| `20261105_04_progress_and_reviewers.sql` | `lesson_progress` (students see only their own rows); reviewer one-line bio (`profiles.public_bio`) shown on public lessons |
| `20261106_05_hidden_sets.sql` | Papers an admin has hidden, with their questions and answers, are readable by admins only; students see published papers only; public question count includes published papers only |

Each was tested against a local Postgres copy of the live schema (logged-out
visitor, student on trial, expired student, admin) before being committed.

## Publishing a lesson or question publicly

Nothing becomes public until a named person has reviewed it; the database
refuses `is_public = true` without `reviewed_at`. Reviewers do this in the app:
Admin → Review lessons and questions.

## Content: question sets

Practice question sets are not loaded with SQL. They are built and checked by
`scripts/questions/build.py` (from `content/questions/`) into
`src/content/question-sets/`. Every production deploy then runs
`scripts/sync-questions.mjs`, which writes new or changed rows to the database,
so they go live with no button to press. It needs the `SUPABASE_SECRET_KEY`
environment variable in Vercel (Production only; never prefix it with `VITE_`,
which would put it in the browser bundle). Without it the sync is skipped and
Admin → Load question sets does the same job by hand.

Sets are live for students as soon as they are loaded; Admin → Review can hide
or show any set, and a hidden set stays hidden on later deploys. Rows have fixed
ids, so loading again never adds copies.

## Edge functions

`functions/chat-tutor`: the AI tutor (checks subscription server-side).
