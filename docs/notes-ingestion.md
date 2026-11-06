# Rights-aware WASSCE lesson ingestion

The pipeline produces JSON batches for the existing Admin → Bulk Import Lessons route. It uses the current Supabase lesson importer and does not introduce a second lesson database.

## Run

- npm run notes:validate checks the editorial manifest and Markdown source files.
- npm run notes:build validates all lessons and writes batches to dist/notes-ingestion/.
- Import each lessons-NNN.json file through the admin importer. Its existing maximum is 20 lessons per batch.
- Review every imported lesson in Admin → Review lessons. Approval is a separate human decision; do not publish automatically.

## Rights and provenance

Accepted identifiers: ORIGINAL, CC0-1.0, CC-BY-4.0, CC-BY-SA-4.0 and PUBLIC-DOMAIN. Every record needs a rights holder and explicit verification. Third-party material also needs a canonical HTTPS source URL, attribution and evidence of the exact licence grant. ORIGINAL content must identify its author.

Unknown licences, non-commercial licences, no-derivatives licences and unverified records are rejected. Public availability is not permission to republish. Check the licence of the actual work and any separately licensed figures, tables or images. Keep provenance.json with the editorial record; the current lesson table does not store these fields.

## Validation limits

The build enforces a minimum of 180 words, Learning objectives and WASSCE examination focus sections, valid topic-slug syntax, duplicate content hashes and duplicate subject/topic/title identities. These checks do not prove factual accuracy or curriculum completeness. A qualified subject reviewer must verify content, diagrams, calculations and syllabus alignment before approval.


## Source acquisition

- Add curated, explicitly rights-cleared source records to `content/sources/manifest.json`.
- Run `npm run notes:acquire` to fetch HTTPS HTML/text sources and extract readable article/main content into `dist/source-packets/`.
- Each source must declare its subject, existing topic slug, title, approved licence, rights holder, attribution, evidence and `rights_verified: true`. Non-commercial, no-derivatives, unknown and unverified licences are rejected.
- The acquisition command enforces HTTPS, rejects credential-bearing and obvious private/local host URLs, follows HTTPS redirects only, applies a 20-second timeout and a 1.5 MB response limit, and records retrieval time, final URL, content type and SHA-256.
- Extracted third-party material is a research packet, not a lesson-import batch. Write independently authored WASSCE notes from the research and retain source attribution. A source's licence must permit the intended use; an editor must confirm the exact licence and any separately licensed assets.

## Automated regression checks

- `npm run notes:test` runs Node's built-in test runner against valid original content, rejected licences and missing rights verification.
- GitHub Actions runs validation, regression tests and batch generation on relevant pull requests and pushes to `main`.
- The generated JSON batches remain compatible with the existing admin import route; the importer and its human review workflow remain the publication boundary.

The source manifest intentionally starts empty. No external work is presumed redistributable, and no third-party source is fetched until its licence and attribution record has been reviewed and committed.
