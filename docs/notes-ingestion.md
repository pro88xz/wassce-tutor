# WASSCE Tutor content acquisition engine

## Production engine

The production acquisition endpoint is `api/notes-engine/run.js`. It runs on Vercel and writes directly to the existing Supabase `lessons` table. It does not create JSON files for an administrator to upload.

### Runtime configuration

Set these Vercel environment variables for **Production**:

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` (already used by the application) | Supabase project URL |
| `SUPABASE_SECRET_KEY` (already used by question sync) | Server-only Supabase secret key or legacy service-role key |
| `GROQ_API_KEY` | Groq API key used by the existing WASSCE Tutor AI lesson generator |
| `CRON_SECRET` | Long random secret used to authenticate scheduled engine runs |

Never prefix a secret with `VITE_`. Never put a Supabase secret key or Groq key in client-side code, repository files, or logs. The endpoint rejects missing configuration and rejects a public Supabase key.

### Schedule and operation

Vercel Cron calls `GET /api/notes-engine/run` daily at 03:00 UTC. Vercel supplies `Authorization: Bearer $CRON_SECRET`. The default run processes up to two topic gaps; the endpoint accepts a bounded `?limit=1..4` override for authenticated manual runs.

Each run:

1. Reads the live subjects, topics and lessons from Supabase, using paginated queries.
2. Identifies topics with zero lesson rows. Topics that already have at least one lesson are not overwritten.
3. Searches Wikipedia's public MediaWiki API for topic-specific reference material and retrieves article extracts.
4. Uses the same Groq model family already used by the tutor (`llama-3.3-70b-versatile`) to write an independently worded WASSCE lesson.
5. Validates the title, length, required teaching sections, practice questions and source section.
6. Inserts the lesson directly into Supabase with `is_published = true` and `is_public = false`.
7. Returns a machine-readable report including created lesson IDs, source URLs, hashes, failures and remaining gap estimate.

The database insert is idempotent against the unique topic/slug constraint. Existing lessons are never overwritten. Failed research or generation leaves the topic gap untouched for a later run.

### Student access and human review

Generated lessons are available in the signed-in learning app under the existing lesson access rules. They are not public SEO pages: `is_public` remains false and no reviewer fields are populated. An administrator can inspect and edit them in **Admin → Review lessons and questions**. Only a named human reviewer can approve a lesson for public publication. The engine never sets `is_public`, `reviewed_at` or `reviewed_by`.

### Monitoring

The endpoint response includes:
- `topics_without_lessons_before_run`
- `attempted`, `created`, `failed`, and `remaining_estimate`
- per-topic status, generated lesson ID, word count, source attribution and content SHA-256

A response of HTTP 503 means required environment configuration is missing. HTTP 401 means the cron secret did not match. HTTP 207 means one or more topic attempts failed; inspect the per-topic error and allow the next scheduled run to retry.

## Editorial batch tools

The separate local tools remain available for content prepared by the editorial team:

- `npm run notes:validate` validates the local Markdown manifest.
- `npm run notes:build` packages those local files for the existing admin importer.
- `npm run notes:acquire` fetches explicitly rights-verified sources listed in `content/sources/manifest.json`.
- `npm run notes:catalog` verifies local lesson topic mappings against the live catalogue.

These commands are editorial utilities. They are not the scheduled production acquisition engine and are not required for its direct Supabase writes.

## Source and quality policy

The automated engine uses Wikipedia reference extracts (CC BY-SA 4.0) for factual research, includes exact article titles and URLs in the lesson's Sources section, and writes new explanatory text rather than copying source passages. Generated material must pass structural validation before insertion. This is an automated first-draft pipeline, not a substitute for expert subject review; public publication remains a human approval action.

## Security

The endpoint runs only on the Vercel server, authenticates every invocation with `CRON_SECRET`, and uses the Supabase secret key only server-side. It does not accept lesson content or arbitrary database table names from request input. It reads the existing curriculum and writes only to `lessons`. It never grants public review status or modifies existing lesson content.
