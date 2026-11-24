# Video lessons: where things stand

For every session making lesson videos (Biology, Physics, and the subjects that
follow). The system is built and on main; please use it rather than building
another one. How to write, check and publish a video: `scripts/video/README.md`.

## What exists

| Part | Where |
|---|---|
| Lesson scripts, one per video | `content/videos/<note-file-name>.py` |
| Renderer (chalk, voice, captions, thumbnails, `--boards` layout check) | `scripts/video/board_video.py` |
| Listen-back check of every spoken line | `scripts/video/check_voice.py` |
| Build, encrypt, upload, record | `scripts/video/publish.py` |
| Publishing in CI (runs on main when a script changes) | `.github/workflows/video-publish.yml` |
| Database and storage | migration 35, `supabase/migrations/20261124_35_lesson_videos.sql` |
| Protected playback API (one Vercel function) | `api/video.js`, `api/_lib/video.js` |
| Player and transcript on the lesson page and in the app | `src/components/video/`, `src/lib/lesson-video.ts` |
| Video sitemap | `/video-sitemap.xml`, from `scripts/video/sitemap.mjs` |

## Who does what

- **Biology**: the "Premium video content with security" session, in manifest
  order: cell structure, classification, photosynthesis, then onwards.
- **Physics**: the physics session, topic by topic in syllabus order (physical
  quantities and units first), plus `physics-waves-1`. Physics speaks in the male
  voice (`VOICE = "bm_george"` in each script); every other subject keeps the
  default female voice.

## The rules every video follows

1. **One script per lesson**, named after its note in `content/notes/`.
2. **Search first**: `TITLE` in the words students type, chapters named as the
   questions they search, a designed `THUMBNAIL` (big title plus the key diagram).
3. **Three checks before merging**: `--boards` (no overlaps), `check_voice.py`
   (every line heard as written), `publish.py build` (look at `qa-sheet.jpg`).
4. **Never** put a rendered video in `public/` or in git. Merging the script to
   main publishes it, encrypted.
5. Shared renderer changes (new drawing helpers, `PRONOUNCE` entries) are fine
   (`equation()` lays out a line of working with stacked fractions);
   bump `VERSION` only when every video should be rebuilt.
