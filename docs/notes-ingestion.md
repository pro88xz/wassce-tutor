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
