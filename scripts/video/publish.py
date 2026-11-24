#!/usr/bin/env python3
"""Build lesson videos and publish them, encrypted, for the protected player.

    python3 scripts/video/publish.py build content/videos/biology-cell-structure.py
    python3 scripts/video/publish.py publish                 # every video whose script changed
    python3 scripts/video/publish.py publish biology-cell-structure --force

`build` renders a lesson script (scripts/video/board_video.py) and packages it
in .video-build/<id>/<revision>/, which is never committed:

- index.m3u8 and s0000.ts, s0001.ts, ...: the video as HLS, every segment
  encrypted with AES-128. The playlist names the key "KEY"; the site's
  /api/video function puts its own gated address there for each viewer.
- key.hex: the video's key, random for each build. It goes to the database
  (lesson_video_keys, readable by the server only) and nowhere else.
- preview.mp4: a small plain copy that only Google's crawler is given, through
  /api/video?op=file, so Google can index the video and show its key moments.
- download.mp4: the full video, for subscribers to keep. /api/video?op=download
  gives a ten-minute address to it, and only to a signed-in subscriber.
- thumb.jpg, captions.vtt, timing.json: public; the lesson page shows them.

Each video belongs to one lesson page: LESSON = "subject/topic/lesson" in the
script (the page's address after /wassce/), or else its note's entry in
content/notes/manifest.json. Every video's lesson is found before anything is
rendered, and a video whose lesson is missing does not stop the others.

`publish` builds every video whose revision (its script, the renderer's
VERSION and the voice) differs from the one in the database, uploads it and
records it, then gives every live video that lacks one its download.mp4 (made
from its own encrypted segments, without rendering again). Segments, the
preview and the download go to the private bucket lesson-video;
the thumbnail and captions to the public bucket lesson-video-public. Old
revisions are removed once the new one is recorded. Needs SUPABASE_URL and
SUPABASE_SECRET_KEY (the service role key): the workflow
.github/workflows/video-publish.yml fetches it with the Supabase access token.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import tempfile
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))

VIDEOS = ROOT / "content/videos"
NOTES = ROOT / "content/notes"
BUILD = ROOT / ".video-build"
PRIVATE, PUBLIC = "lesson-video", "lesson-video-public"
SEGMENT_S = 6
ID = re.compile(r"^[a-z0-9][a-z0-9-]{2,79}$")


# ── Build ─────────────────────────────────────────────────────────────────
def video_id(script: Path) -> str:
    vid = script.stem
    if not ID.match(vid):
        raise SystemExit(f"{script.name}: a video id is lower case letters, digits and hyphens")
    return vid


def run(*cmd: str):
    subprocess.run(cmd, check=True)


def package(mp4: Path, out: Path):
    """The rendered MP4 as encrypted HLS, plus the crawler's plain preview."""
    key, iv = os.urandom(16), os.urandom(16)
    keyfile = out / "key.bin"
    keyfile.write_bytes(key)
    info = out / "keyinfo.txt"
    info.write_text(f"KEY\n{keyfile}\n{iv.hex()}\n")
    for old in out.glob("s*.ts"):
        old.unlink()
    run("ffmpeg", "-v", "error", "-y", "-i", str(mp4), "-c", "copy",
        "-f", "hls", "-hls_time", str(SEGMENT_S), "-hls_playlist_type", "vod",
        "-hls_segment_type", "mpegts", "-hls_key_info_file", str(info),
        "-hls_segment_filename", str(out / "s%04d.ts"), str(out / "index.m3u8"))
    (out / "key.hex").write_text(key.hex())
    keyfile.unlink()
    info.unlink()
    playlist = (out / "index.m3u8").read_text()
    if 'URI="KEY"' not in playlist or "METHOD=AES-128" not in playlist:
        raise SystemExit("packaging failed: the playlist is not encrypted")
    # Google's copy: small, plain, never shown to anyone else.
    run("ffmpeg", "-v", "error", "-y", "-i", str(mp4), "-vf", "scale=640:360",
        "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "48k", "-ac", "1", "-movflags", "+faststart", str(out / "preview.mp4"))


def mp4_from_hls(playlist: str, segments: Path, key_hex: str, dest: Path):
    """The plain MP4 of an encrypted HLS video: decrypted and joined, not re-encoded."""
    with tempfile.TemporaryDirectory() as tmp:
        keyfile = Path(tmp) / "key.bin"
        keyfile.write_bytes(bytes.fromhex(key_hex))
        lines = [ln.replace('URI="KEY"', f'URI="{keyfile}"') if ln.startswith("#EXT-X-KEY") else
                 (str(segments / ln) if ln and not ln.startswith("#") else ln) for ln in playlist.splitlines()]
        local = Path(tmp) / "local.m3u8"
        local.write_text("\n".join(lines) + "\n")
        run("ffmpeg", "-v", "error", "-y", "-allowed_extensions", "ALL", "-i", str(local),
            "-c", "copy", "-movflags", "+faststart", str(dest))


def duration_of(path: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def build(script: Path) -> tuple[Path, dict]:
    import board_video as bv
    lesson = bv.load(script)
    vid, rev = video_id(script), bv.revision(script)
    out = BUILD / vid / rev
    done = out / "meta.json"
    if done.exists():
        return out, json.loads(done.read_text())
    out.mkdir(parents=True, exist_ok=True)
    mp4 = out / "render.mp4"
    timing = bv.render(bv.lesson_steps(lesson), lesson.LABEL, mp4, None, getattr(lesson, "THUMBNAIL_STEP", None),
                       getattr(lesson, "THUMBNAIL", None))
    package(mp4, out)
    # A contact sheet, one frame every 8 s, for checking the video by eye.
    rows = max(1, -(-int(timing["duration"] / 8 + 1) // 5))
    run("ffmpeg", "-v", "error", "-y", "-i", str(mp4), "-vf", f"fps=1/8,scale=384:-1,tile=5x{rows}",
        "-frames:v", "1", "-q:v", "4", str(out / "qa-sheet.jpg"))
    mp4.with_suffix(".jpg").rename(out / "thumb.jpg")
    mp4.with_suffix(".vtt").rename(out / "captions.vtt")
    mp4.with_suffix(".json").rename(out / "timing.json")
    mp4.rename(out / "download.mp4")   # the subscribers' copy
    meta = {
        "id": vid,
        "revision": rev,
        "title": lesson.TITLE,
        "description": lesson.DESCRIPTION,
        **timing,
    }
    done.write_text(json.dumps(meta, indent=1, ensure_ascii=False) + "\n")
    print(f"built {vid} ({rev}): {timing['duration']:.0f} s, {len(list(out.glob('s*.ts')))} segments, in {out}")
    return out, meta


# ── Supabase (service role: storage and the REST API) ─────────────────────
class Supabase:
    def __init__(self):
        self.url = (os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL") or "").rstrip("/")
        self.key = os.environ.get("SUPABASE_SECRET_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or ""
        if not self.url or not self.key:
            raise SystemExit("publish needs SUPABASE_URL and SUPABASE_SECRET_KEY")

    def call(self, method: str, path: str, body=None, headers: dict | None = None, raw: bytes | None = None):
        h = {"apikey": self.key, "Authorization": f"Bearer {self.key}", **(headers or {})}
        data = raw
        if body is not None:
            data = json.dumps(body).encode()
            h.setdefault("Content-Type", "application/json")
        req = urllib.request.Request(self.url + path, data=data, method=method, headers=h)
        for attempt in range(4):
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    text = r.read().decode() or "null"
                    return json.loads(text) if "json" in r.headers.get("Content-Type", "") else text
            except urllib.error.HTTPError as e:
                detail = e.read().decode()[:400]
                if e.code < 500 or attempt == 3:
                    raise SystemExit(f"{method} {path.split('?')[0]}: {e.code} {detail}")
            except urllib.error.URLError as e:
                if attempt == 3:
                    raise SystemExit(f"{method} {path.split('?')[0]}: {e.reason}")

    def rows(self, table: str, query: str) -> list[dict]:
        return self.call("GET", f"/rest/v1/{table}?{query}") or []

    def upsert(self, table: str, row: dict, on: str):
        self.call("POST", f"/rest/v1/{table}?on_conflict={on}", row,
                  {"Prefer": "resolution=merge-duplicates,return=minimal"})

    def upload(self, bucket: str, path: str, file: Path, content_type: str, cache: str):
        self.call("POST", f"/storage/v1/object/{bucket}/{urllib.parse.quote(path)}", raw=file.read_bytes(),
                  headers={"Content-Type": content_type, "x-upsert": "true", "cache-control": cache})

    def fetch(self, bucket: str, path: str) -> bytes:
        req = urllib.request.Request(f"{self.url}/storage/v1/object/{bucket}/{urllib.parse.quote(path)}",
                                     headers={"apikey": self.key, "Authorization": f"Bearer {self.key}"})
        for attempt in range(4):
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    return r.read()
            except (urllib.error.HTTPError, urllib.error.URLError) as e:
                if attempt == 3 or (isinstance(e, urllib.error.HTTPError) and e.code < 500):
                    raise SystemExit(f"GET {bucket}/{path}: {e}")

    def listing(self, bucket: str, prefix: str) -> list[str]:
        names, offset = [], 0
        while True:
            page = self.call("POST", f"/storage/v1/object/list/{bucket}",
                             {"prefix": prefix, "limit": 1000, "offset": offset}) or []
            names += [f"{prefix}{o['name']}" for o in page]
            if len(page) < 1000:
                return names
            offset += 1000

    def remove(self, bucket: str, paths: list[str]):
        for i in range(0, len(paths), 500):
            self.call("DELETE", f"/storage/v1/object/{bucket}", {"prefixes": paths[i:i + 500]})


def slug_of(title: str) -> str:
    """The lesson slug, the same rule as scripts/sync-notes.mjs and import_lessons()."""
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", title)
    s = re.sub(r"\s+", "-", s).lower()
    return re.sub(r"-+", "-", s).strip("-")


class NoLesson(Exception):
    pass


def lesson_path(script: Path) -> str:
    """The lesson page a video belongs to, as "subject/topic/lesson" (its address
    after /wassce/): LESSON in the script, or else its note's entry in
    content/notes/manifest.json."""
    m = re.search(r'^LESSON\s*=\s*"([a-z0-9-]+/[a-z0-9-]+/[a-z0-9-]+)"', script.read_text(), re.M)
    if m:
        return m.group(1)
    note = re.search(r'^NOTE\s*=\s*"([^"]+)"', script.read_text(), re.M)
    note = note.group(1) if note else f"{script.stem}.md"
    manifest = json.loads((NOTES / "manifest.json").read_text())
    entry = next((e for e in manifest["lessons"] if e["file"] == note), None)
    if not entry:
        raise NoLesson(f"{note} is not in content/notes/manifest.json: set LESSON in the video script")
    subject = entry["subject"].lower().replace(" ", "-")
    return f"{subject}/{entry['topic']}/{entry.get('slug') or slug_of(entry['title'])}"


def lesson_id(db: Supabase, path: str) -> str:
    """The published lesson at /wassce/<path>."""
    q = urllib.parse.quote
    subject_slug, topic_slug, lesson_slug = path.split("/")
    subject = db.rows("subjects", f"select=id&slug=eq.{q(subject_slug)}")
    if not subject:
        raise NoLesson(f"{path}: no subject {subject_slug!r}")
    topic = db.rows("topics", f"select=id&subject_id=eq.{subject[0]['id']}&slug=eq.{q(topic_slug)}")
    if not topic:
        raise NoLesson(f"{path}: no topic {topic_slug!r}")
    lesson = db.rows("lessons", f"select=id&topic_id=eq.{topic[0]['id']}&slug=eq.{q(lesson_slug)}&is_published=eq.true")
    if not lesson:
        raise NoLesson(f"{path}: no published lesson {lesson_slug!r} (set LESSON to the lesson page's address)")
    return lesson[0]["id"]


def old_files(db: Supabase, vid: str, rev: str) -> list[str]:
    """Files of this video's earlier revisions. The listing of <id>/ names each
    revision's folder without a trailing slash ("<id>/<rev>"); the current
    revision is never among them."""
    folders = {p.rstrip("/") for p in db.listing(PRIVATE, f"{vid}/")}
    files = []
    for folder in sorted(folders - {f"{vid}/{rev}"}):
        files += db.listing(PRIVATE, folder + "/")
    return files


def publish(db: Supabase, out: Path, meta: dict, lid: str):
    vid, rev = meta["id"], meta["revision"]
    prefix = f"{vid}/{rev}/"
    segments = sorted(out.glob("s*.ts"))
    if not (out / "download.mp4").exists():   # built before downloads existed
        mp4_from_hls((out / "index.m3u8").read_text(), out, (out / "key.hex").read_text().strip(), out / "download.mp4")
    for seg in segments:
        db.upload(PRIVATE, prefix + seg.name, seg, "video/mp2t", "max-age=31536000, immutable")
    db.upload(PRIVATE, prefix + "preview.mp4", out / "preview.mp4", "video/mp4", "max-age=86400")
    db.upload(PRIVATE, prefix + "download.mp4", out / "download.mp4", "video/mp4", "max-age=86400")
    db.upload(PUBLIC, f"thumbs/{vid}-{rev}.jpg", out / "thumb.jpg", "image/jpeg", "max-age=31536000, immutable")
    db.upload(PUBLIC, f"captions/{vid}-{rev}.vtt", out / "captions.vtt", "text/vtt", "max-age=31536000, immutable")
    public = f"{db.url}/storage/v1/object/public/{PUBLIC}"
    # The key first: a row must never point at a revision whose key is missing.
    db.upsert("lesson_video_keys", {"video_id": vid, "revision": rev, "key_hex": (out / "key.hex").read_text().strip()},
              "video_id,revision")
    db.upsert("lesson_videos", {
        "id": vid,
        "lesson_id": lid,
        "revision": rev,
        "title": meta["title"],
        "description": meta["description"],
        "duration_s": meta["duration"],
        "chapters": meta["chapters"],
        "transcript": meta["transcript"],
        "playlist": (out / "index.m3u8").read_text(),
        "storage_prefix": prefix,
        "thumbnail_url": f"{public}/thumbs/{vid}-{rev}.jpg",
        "captions_url": f"{public}/captions/{vid}-{rev}.vtt",
        "is_published": True,
    }, "id")
    # Earlier revisions: their files and keys go once the new one is live.
    stale = [p for p in old_files(db, vid, rev) if not p.startswith(prefix)]
    if stale:
        db.remove(PRIVATE, stale)
    db.call("DELETE", f"/rest/v1/lesson_video_keys?video_id=eq.{vid}&revision=neq.{rev}")
    # The live revision must be whole: every segment, the preview and the download, still there.
    have = {p.rsplit("/", 1)[-1] for p in db.listing(PRIVATE, prefix)}
    missing = [n for n in [s.name for s in segments] + ["preview.mp4", "download.mp4"] if n not in have]
    if missing:
        raise SystemExit(f"{vid}: {len(missing)} published files are missing from storage ({', '.join(missing[:3])}...)")
    print(f"published {vid} ({rev}): {len(segments)} encrypted segments, checked in storage; removed {len(stale)} old files")


def backfill_downloads(db: Supabase) -> int:
    """Every live video gets its download.mp4: one published before downloads
    existed has it made from its own encrypted segments and key (decrypted and
    joined, the same frames, nothing rendered again), checked and uploaded."""
    made = 0
    for row in db.rows("lesson_videos", "select=id,revision,playlist,storage_prefix,duration_s&is_published=eq.true"):
        vid, rev, prefix = row["id"], row["revision"], row["storage_prefix"]
        have = {p.rsplit("/", 1)[-1] for p in db.listing(PRIVATE, prefix)}
        if "download.mp4" in have:
            continue
        keys = db.rows("lesson_video_keys", f"select=key_hex&video_id=eq.{vid}&revision=eq.{rev}")
        if not keys:
            print(f"no download for {vid}: its key is missing")
            continue
        with tempfile.TemporaryDirectory() as tmp:
            folder = Path(tmp)
            for name in [ln for ln in row["playlist"].splitlines() if ln and not ln.startswith("#")]:
                (folder / name).write_bytes(db.fetch(PRIVATE, prefix + name))
            dest = folder / "download.mp4"
            mp4_from_hls(row["playlist"], folder, keys[0]["key_hex"], dest)
            if abs(duration_of(dest) - float(row["duration_s"])) > 1.5:
                raise SystemExit(f"{vid}: the download made from its segments is {duration_of(dest):.1f} s, not {row['duration_s']} s")
            db.upload(PRIVATE, prefix + "download.mp4", dest, "video/mp4", "max-age=86400")
        made += 1
        print(f"download made for {vid} ({rev})")
    return made


def ready(script: Path) -> bool:
    """A script is published once it names its video (TITLE and DESCRIPTION)."""
    text = script.read_text()
    return bool(re.search(r"^TITLE\s*=", text, re.M) and re.search(r"^DESCRIPTION\s*=", text, re.M))


def scripts(ids: list[str]) -> list[Path]:
    found = sorted(p for p in VIDEOS.glob("*.py") if not p.name.startswith("_"))
    for p in [p for p in found if not ready(p)]:
        print(f"skipped {p.stem}: add TITLE and DESCRIPTION to publish it")
    found = [p for p in found if ready(p)]
    if ids:
        found = [p for p in found if p.stem in ids]
        missing = set(ids) - {p.stem for p in found}
        if missing:
            raise SystemExit(f"no video script for: {', '.join(sorted(missing))}")
    return found


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    b = sub.add_parser("build", help="render and package, without publishing")
    b.add_argument("script", type=Path)
    p = sub.add_parser("publish", help="build and publish the videos whose scripts changed")
    p.add_argument("ids", nargs="*")
    p.add_argument("--force", action="store_true", help="rebuild and republish even if unchanged")
    sub.add_parser("downloads", help="give every live video its subscriber download (no rendering)")
    args = ap.parse_args()

    if args.cmd == "build":
        out, meta = build(args.script)
        print(json.dumps({k: meta[k] for k in ("id", "revision", "duration")}), out)
        return

    import board_video as bv
    db = Supabase()
    if args.cmd == "downloads":
        print(f"{backfill_downloads(db)} download(s) made")
        return
    live = {r["id"]: r["revision"] for r in db.rows("lesson_videos", "select=id,revision")}
    todo = [s for s in scripts(args.ids) if args.force or live.get(s.stem) != bv.revision(s)]
    print(f"{len(todo)} video(s) to publish" + (f": {', '.join(s.stem for s in todo)}" if todo else ""))
    # Find every video's lesson first: a wrong address fails in seconds, not after a render.
    lessons, failed = {}, []
    for s in todo:
        try:
            lessons[s] = lesson_id(db, lesson_path(s))
        except NoLesson as e:
            failed.append(s.stem)
            print(f"NOT PUBLISHED {s.stem}: {e}")
    for s in [s for s in todo if s in lessons]:
        out, meta = build(s)
        publish(db, out, meta, lessons[s])
    print(f"{backfill_downloads(db)} download(s) made for videos published before downloads")
    if failed:
        raise SystemExit(f"{len(failed)} video(s) not published: {', '.join(failed)}")


if __name__ == "__main__":
    main()
