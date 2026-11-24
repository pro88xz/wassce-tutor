# Chalkboard video lessons

A narrated chalkboard: the teacher's voice explains while the chalk writes, draws
and wipes the board in step with it. Every lesson can have one. Videos are made
offline and free from a short lesson script, published **encrypted**, and played
only through the site's protected player. No plain video file is ever served,
committed or linked.

| Part | Where |
|---|---|
| Lesson scripts, one per video | `content/videos/<id>.py` (the id is the note's file name: `biology-cell-structure`) |
| Renderer: chalk, voice, captions, thumbnail | `scripts/video/board_video.py` |
| Build, encrypt, upload, record | `scripts/video/publish.py` |
| Publishing in CI | `.github/workflows/video-publish.yml` (on main, when a script changes) |
| Database and storage | `supabase/migrations/20261124_35_lesson_videos.sql` |
| Protected playback API | `api/video.js`, logic and its limits in `api/_lib/video.js`, tests in `video-api.test.mjs` |
| Player, transcript | `src/components/video/`, data and search markup in `src/lib/lesson-video.ts` |

## Writing a video

`content/videos/<id>.py`:

```python
from board_video import arrow, box, clear, frac, line, ring, step, underline, write

TITLE = "Cell structure: plant and animal cells"     # the video's own name, unique on the site
DESCRIPTION = "What a cell is, the parts of ..."     # under 300 characters; shown to search engines
LABEL = "WASSCE Tutor  ·  Biology  ·  Cell structure" # faint, bottom right of the board
NOTE = "biology-cell-structure.md"                    # optional: the lesson it belongs to (default <id>.md)

STEPS = [
    step("Every living thing is made of cells.",
         write("Cell Structure", 70, 95, 44, "yellow"), underline(64, 420, 114),
         chapter="What is a cell?"),
    ...
]
```

Each `step` is one thing the teacher says and what they draw while saying it. The
board is 1280 × 720 px, with (0, 0) at the top left. You can draw with: `write`
(chalk writing; `10^8` raises, `v_1` lowers), `frac`, `line`, `arrow`,
`double_arrow`, `dashed`, `wave`, `box`, `underline`, `ring` and `clear` (the
duster). Chalk colours: white, yellow, blue, pink, green, grey.

- **Chapters**: `chapter="..."` on a step starts a key moment. They become the
  chapter buttons under the player and the video's key moments in Google search
  (each links to the lesson page with `?t=<seconds>`). Give every video 3 to 6.
- **Thumbnail**: it decides whether a student clicks in search results, so design
  one: `THUMBNAIL = [write(...), ...]` is drawn whole on a clean board (a big
  title in yellow, a short promise underneath, and the topic's key diagram in
  thick chalk; see the biology scripts). Without it, the board just before the
  first wipe is used (`THUMBNAIL_STEP = <index>` picks another).
- **Titles for search**: `TITLE` is what students type ("Plant and Animal Cells:
  Structure, Functions and Differences | WASSCE Biology"), not the lesson's
  heading. Chapter names are shown by Google as key moments, so word them as
  questions and topics students search for.
- **Branding**: the board carries only a faint caption at its foot ("WASSCE Tutor ·
  subject · topic"), and every video ends on a branded card with wasscetutor.com.
  The board itself stays clean. Writing that would run off the board stops the
  build.
- **The voice**: each subject has its own teacher, as in a school: `TEACHERS` in
  `board_video.py` (Biology `bf_emma`, Physics `bm_george`, Mathematics `af_heart`, and so
  on, chosen by Kokoro's published quality grades; a few are blends of two voices). A
  script speaks in its subject's voice with no setting (a script may write
  `VOICE = "..."`, but it must be its subject's teacher). Every voice speaks from the
  phonemes of misaki's British dictionary. A word that is not in
  the dictionary stops the build, so the voice never guesses a word from its
  spelling. Scientific names the dictionary lacks (*sapiens*, *Linnaeus*) are
  given their sounds in `PRONOUNCE` in `board_video.py`. Write numbers as words ("ninety-eight"), and the symbol *a* as a
  capital ("The amplitude, A, is…"): a small "a" is read as the article. Known gaps:
  the dictionary lacks *factorise* and *program* (add their sounds to `PRONOUNCE`
  when a video first needs them, and check them with `check_voice.py`).
- **The chalk**: single-stroke Hershey letters, so writing appears stroke by
  stroke. Each step's drawing is paced to end with its speech; if it cannot (at up
  to twice the usual pace), the voice waits for it.

## Checking a video

Every video is checked three ways before it is merged. The voice models and
packages in `scripts/audio/README.md` (the Whisper model too), then:

```bash
pip install Hershey-Fonts pycairo sherpa-onnx
```

1. **Layout**, in seconds, with no voice: each finished board and the thumbnail as
   images. Nothing may overlap, touch a label line or run off the board.

   ```bash
   python3 scripts/video/board_video.py content/videos/biology-cell-structure.py --boards .video-build/boards/cell
   ```

2. **Voice**: every spoken line is transcribed back by a speech recogniser and
   must match what was written (homophones such as maize and maze are allowed in
   `check_voice.py`). Reword any line it flags.

   ```bash
   python3 scripts/video/check_voice.py content/videos/biology-cell-structure.py
   ```

3. **The video**: build it exactly as it will be published, and look at
   `qa-sheet.jpg` (a frame every 8 s) and `thumb.jpg` in its folder.

   ```bash
   python3 scripts/video/publish.py build content/videos/biology-cell-structure.py
   ```

Spoken lines are cached in `~/.cache/wassce-video`, so a rebuild after a layout
change is quick. `board_video.py` alone writes `.video-build/<id>/preview-render.mp4`
(`--until 20` for the first 20 seconds only).

## Publishing

Merge the script to main: the **Publish lesson videos** workflow renders every
video whose revision (its script, the renderer's `VERSION` and the voice) is not
the one in the database, encrypts it, uploads it and records it. By hand:
Actions → Publish lesson videos → Run workflow (some ids, or `force`). Bump
`VERSION` in `board_video.py` only when every video should be rebuilt.

`python3 scripts/video/publish.py publish [ids] [--force]` does the same from
anywhere with `SUPABASE_URL` and `SUPABASE_SECRET_KEY` set.

What is published, for each revision:

- `lesson-video` (private bucket): the HLS segments, each AES-128 encrypted with a
  key made for that build, and a small plain 360p copy that only Google's
  verified crawler is given (so the video can be indexed with key moments).
- `lesson_video_keys`: the key, readable by the server key only.
- `lesson-video-public` (public bucket): the thumbnail and the captions.
- `lesson_videos`: title, description, length, chapters, transcript, and the
  playlist and storage folder, which only the server reads.

## How playback is protected

`api/_lib/video.js` has the details. In short: the player gets a token that lasts
5 minutes and works only from the viewer's own network; the playlist and key are
sent only to requests that carry it in a header (so their addresses do nothing
when pasted into a browser, a download site or a download tool); every segment
address is signed and the segments are encrypted; the key crosses the network
masked for that viewer and is unmasked in memory. The board's faint caption
("WASSCE Tutor · subject · topic") is in every frame, and every video ends on the
brand card. (A moving viewer code over the picture, and the site's address at
the top of the board, were tried and removed to keep the board clean.)

**People, not programs.** With Cloudflare Turnstile switched on, a video starts only
after Cloudflare's invisible check that a person in a real browser pressed play
(`src/lib/turnstile.ts`); the server confirms the check's one-time token with
Cloudflare before it issues a viewing token, so a download tool or script cannot
get one at all. Switch it on with two keys from a free Cloudflare account
(Turnstile → add a widget for wasscetutor.com and www.wasscetutor.com, mode
Invisible): `VITE_TURNSTILE_SITE_KEY` (the site key; a build variable) and
`TURNSTILE_SECRET_KEY` (the secret; a server variable), both in Vercel's
environment variables, then redeploy. Until both are set the check is off. If
Cloudflare cannot be reached, videos still play.

**Downloads are for subscribers.** The player's Download button asks
`/api/video?op=download`, which checks the signed-in student's plan on the server
(an admin, or a plan that is active and has not ended) and only then gives a
ten-minute address to the full video (`download.mp4`, private). Everyone else,
whatever tool they use, is refused, and the player offers a subscription. Each
download is logged with the account, and a subscriber can download 40 videos a
day. Every published video has its `download.mp4`: the publisher uploads it with
each build, and makes it for older videos from their own encrypted segments
(`publish.py downloads`).

What this cannot do: stop someone filming or screen-recording a video they are
allowed to watch, or a subscriber sharing a file they downloaded. The caption in
every frame and the end card make any such copy advertise WASSCE Tutor.
Studio-grade DRM (Widevine, FairPlay) through a paid video host is the next
step if it is ever needed.

## Search

The lesson page is the video's watch page: the player is the first thing under the
title, and the page carries a `VideoObject` with the thumbnail, length, transcript
and one `Clip` per chapter (`src/lib/lesson-video.ts`). Its `contentUrl` is
`/api/video?op=file&v=<id>`, which answers only requests from Google's crawler,
checked by reverse and forward DNS, as Google's video guidelines allow. The
transcript is on the page under the player. Every published video is also
listed in `/video-sitemap.xml` (written at build time by `scripts/video/sitemap.mjs`,
named in `robots.txt`), and a video's publication moves its lesson page's
`lastmod` in the main sitemap, so Google comes back for it.
