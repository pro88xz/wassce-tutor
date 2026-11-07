# WASSCE Tutor content acquisition engine

> **Status: benched (2026-11-07).** The workflow no longer runs on a schedule or on push. Reasons:
> - **Discovery never worked:** it scraped Google, Bing, Brave, DuckDuckGo and Yahoo from GitHub's servers, which they block (captcha pages, empty results), and their terms do not allow scraping. The catalogue also returned the same first three gaps (Agricultural Science) every run.
> - **Too little reusable material:** most OpenStax books are now CC BY-NC-SA (NonCommercial), which a paid site cannot reuse. Only OpenStax *Physics* and *Statistics* (CC BY 4.0) and Wikibooks (CC BY-SA 4.0) qualify.
> - **Not WASSCE quality:** what it can find is general textbook text, not notes written to the WASSCE syllabus, and ingested lessons go live in the app without review.
>
> The fixed crawler is `scripts/oer-acquisition.mjs`. It uses the sources' own APIs (OpenStax archive and CMS, MediaWiki), verifies licences from publisher metadata, converts sections to Markdown with LaTeX maths, and tries up to 60 gaps per run in a different order each day. To try it, open Actions -> "Open-licence WASSCE content acquisition (benched)" -> Run workflow, and keep **dry_run = 1** to see what it would add without writing anything. An optional `WIKIMEDIA_TOKEN` Actions secret raises the Wikibooks rate limit.

## Production acquisition path

The production acquisition pipeline uses Playwright in GitHub Actions to search and browse educational websites. It does not use Groq, an LLM provider, Wikipedia's API, or manual JSON imports.

### Daily operation

The workflow `.github/workflows/notes-acquisition.yml` runs daily at 03:00 UTC and can also be started from GitHub Actions → Playwright WASSCE content acquisition → Run workflow.

Each run processes at most three missing topics:

1. Calls the authenticated Vercel catalogue endpoint. That endpoint reads the live Supabase subjects, topics and lessons with the existing server-only Supabase secret key and returns topics with zero lesson rows.
2. Launches Chromium through Playwright on the GitHub Actions runner.
3. Searches Google, with DuckDuckGo HTML as a fallback, for the exact subject/topic against the approved open-education domains.
4. Opens candidate pages in Chromium and extracts the main article text and section headings.
5. Requires visible page evidence for a recognised open licence. The initial allowlist is OpenStax, Wikibooks and Siyavula; accepted licences are CC BY 4.0, CC BY-SA 4.0, CC0 1.0 and explicit public domain evidence. Pages without matching licence evidence, sufficient text or an approved host are rejected.
6. Arranges the extracted material into a topic-mapped Markdown lesson with attribution, source URLs, licence identifiers and retrieval date.
7. Sends the lesson to the authenticated Vercel ingestion endpoint. That endpoint revalidates the source hosts/licences, verifies topic IDs against the live Supabase catalogue, checks for existing lessons and writes directly to the Supabase `lessons` table.
8. Keeps `is_public=false` and reviewer fields empty. The Admin → Review lessons and questions workflow remains the human approval gate for public publication.

A topic is not populated when no source meets the host, licence, relevance-search and minimum-content checks. The pipeline does not fabricate replacement material.

## Runtime configuration

Set the same random `CRON_SECRET` value in two places:

- GitHub repository → Settings → Secrets and variables → Actions → New repository secret → `CRON_SECRET`.
- Vercel project → Settings → Environment Variables → `CRON_SECRET` for Production, then redeploy.

The Vercel endpoints reuse the existing `VITE_SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or the legacy `SUPABASE_SERVICE_ROLE_KEY`) already used by the production server-side functions. The GitHub workflow never receives the Supabase secret key; it receives only the cron secret. The public Supabase key is not used for writes.

No Groq key or AI-provider credential is required.

## Endpoints

- `GET /api/notes-engine/catalog`: authenticated, server-side live topic gap scan. Returns up to three topics without lesson rows.
- `POST /api/notes-engine/ingest`: authenticated, validates scraped lesson content and provenance, then inserts only into the existing `lessons` table.

Both endpoints require `Authorization: Bearer $CRON_SECRET`. They reject unauthenticated requests and do not expose Supabase credentials.

## Content and rights policy

The crawler extracts content only from the initial approved open-education domain allowlist and only when it can detect a visible licence statement. Source titles, URLs and licence identifiers are retained in each lesson. ShareAlike notices are preserved. This is open-licensed source acquisition and structured presentation, not AI paraphrasing. Source material remains attributed to its original authors/publishers.

The initial source allowlist will not necessarily cover every WASSCE subject. If no matching open-licensed source is found, the topic remains a gap and the run reports that outcome; it does not scrape arbitrary copyrighted pages or silently treat public accessibility as permission to republish.

## Existing editorial tools

The local Markdown tools remain separate:
- `npm run notes:validate`
- `npm run notes:build`
- `npm run notes:acquire`
- `npm run notes:catalog`

They are not required by the Playwright production workflow. No manual Admin bulk import is part of the automated acquisition path.
