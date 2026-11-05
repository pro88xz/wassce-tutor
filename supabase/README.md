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

Both were tested against a local Postgres copy of the live schema (logged-out
visitor, student on trial, expired student, admin) before being committed.

## Publishing a lesson or question publicly

Nothing becomes public until a named person has reviewed it; the database
refuses `is_public = true` without `reviewed_at`. Until there's an admin
screen for this:

```sql
update public.lessons
set is_public = true, reviewed_at = now(),
    reviewed_by = (select id from public.profiles where full_name = 'Reviewer Name')
where id = '…';
```

## Edge functions

`functions/chat-tutor`: the AI tutor (checks subscription server-side).
