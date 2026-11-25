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
  quantities and units first), plus `physics-waves-1`.

## Downloads and the people check

- **Downloads are for subscribers only**, checked on the server for every request
  (`/api/video?op=download`). The player shows a Download button marked
  "Subscribers"; anyone else is offered a subscription. Every video has a
  private `download.mp4`, made by the publisher (see `scripts/video/README.md`).
- **Cloudflare Turnstile** stops download tools and scripts from starting a video.
  It is off until `VITE_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set in
  Vercel.

## One teacher's voice per subject

As in a school, every subject has its own teacher, so a student moving between
subjects hears a different voice. A video speaks in its subject's voice
automatically (`TEACHERS` in `scripts/video/board_video.py`):

| Subject | Voice | Kokoro grade |
|---|---|---|
| Biology | bf_emma (British female) | B- |
| Physics | bm_george (British male) | C |
| Mathematics | af_heart | A, the best voice |
| Chemistry | af_bella | A- |
| Financial Accounting | af_nicole | B- |
| English Language | bf_isabella (British: oral English is RP) | C |
| Literature in English | bm_fable (British male) | C |
| Further Mathematics | am_michael | C+ |
| History | am_fenrir | C+ |
| Government | am_puck | C+ |
| Economics | af_sarah | C+ |
| Geography | af_kore | C+ |
| Commerce | blend of af_bella and bf_isabella | — |
| Agricultural Science | blend of am_fenrir and bm_lewis | — |
| ICT / Computer Studies | blend of am_puck and bm_fable | — |
| Business Management | blend of af_kore and bf_isabella | — |

Grades are Kokoro's own (VOICES.md: the quality and amount of each voice's training
audio); nothing below C is used. Every voice speaks British pronunciation, since the
phonemes come from misaki's British dictionary. Each teacher read a line of their
subject and was heard back word for word. Some American-trained voices can blur the
British "o" (*commerce*, *transport*), which is why af_aoede was not used.
`check_voice.py` catches any such line, so reword it.

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

## How the teacher sounds

Students should feel taught by a real teacher, not read to by a voice-over.

- **Talk to the student.** "You", questions, and time to think: a step's `pause=`
  after a question gives one to three seconds before the answer.
- **Ask before telling.** A quick question with a pause, then the answer. A
  "your turn" problem with the pause sign (`pause_sign()` in the scripts), a longer
  pause, then the worked answer and the usual wrong answer ("got 80? You forgot the
  half").
- **Light, local humour, given room.** Poda-podas, kekes, okadas, mangoes, the
  rainy season, the exam hall. Gentle and never at a student's expense; the teacher
  may joke about themselves. Put the punchline on its own step, or end a step on it,
  with `pause=0.9` to `1.1` so it lands.
- **Draw while explaining.** Shade areas as they are named, build a graph stage by
  stage, mark the dots of a fall: the board should move with the voice.
- **No two videos start the same way, and the set phrases change.** Vary:
  - the opening: a story already moving ("The keke is flying down the road..."), a
    surprising claim, something to try at home, a myth to bust, a drawing that
    appears before anything is said, a callback to the last lesson's teaser. Not
    "Here is a question to start us off" every time.
  - the "your turn" words: "Over to you", "Grab a pen, this one is yours", "Your
    move", "Try this before I do"; and the pause: "Stop the video here and come
    back with an answer", "Take your time, I am not going anywhere".
  - the quick question: "Think fast", "Before I say it", "Here is one that catches
    almost everyone", "Quick check".
  - the ending: a teaser for the next lesson in different words, a one-line summary,
    or a last joke. Not "Next time:" every time.
- **Say letters and symbols clearly.** `{a}` says the letter A (a lone "a" is read
  as the word); `PRONOUNCE` fixes words the dictionary lacks or says wrongly
  (keke, okada, poda-poda, cos).
