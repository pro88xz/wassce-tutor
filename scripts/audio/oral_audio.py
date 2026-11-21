#!/usr/bin/env python3
"""Speak and check the oral English audio clips.

    python3 scripts/audio/oral_audio.py           # build clips that are new or changed
    python3 scripts/audio/oral_audio.py --force   # rebuild every clip

Reads CLIPS from content/questions/english-language/set5_p1.py, and the audio
links in the lessons (content/notes/*.md), and writes:

- public/audio/oral/<slug>.mp3, one per clip;
- content/questions/english-language/audio_manifest.json, the clips that passed,
  which set5_p1.py links to (a clip that fails is never linked);
- content/questions/english-language/AUDIO.md, the check report for each clip;
- the lessons' audio links, each given its file's hash. A lesson that links to a
  clip that failed stops the script: choose another example word.

Then run scripts/questions/build.py so the questions pick up the manifest.

Every clip passes three checks before it is saved:

1. Pronunciation. A word is spoken from the phonemes of a British pronunciation
   dictionary (misaki's gb_gold, the lexicon the voice was trained with), never
   guessed from spelling, and those phonemes must match the editor's own RP
   transcription in set5_p1.py, sound for sound and stress for stress. A passage
   is spoken from the same dictionary; a word missing from it fails the clip.
2. Recognition. Two independent speech recognisers (Whisper small.en and NVIDIA
   Parakeet) transcribe the encoded MP3. A passage must come back word for word
   from one and almost word for word from the other. A word must come back as
   itself, or as a word that sounds the same in RP (*caught* and *court*), from
   at least one, and from both where any take allows. Several takes (speeds, and
   other British voices if the main one fails) are tried and the best is kept. A
   few RP words said alone are misheard by recognisers trained mostly on American
   speech; for those the same take is also checked played after "The word is".
   A take heard as another word of its Listen row (*cut* for *cot*) is never kept,
   by either check: that is the confusion the row is there to teach.
3. Sound. Silence is trimmed to the same lead-in and tail, levels are evened out,
   and clips that are clipped, too short or too long fail.

Setup and model downloads: scripts/audio/README.md.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
ENGLISH = ROOT / "content/questions/english-language"
OUT = ROOT / "public/audio/oral"
MANIFEST = ENGLISH / "audio_manifest.json"
REPORT = ENGLISH / "AUDIO.md"
LOCK = Path(__file__).with_name("oral-audio.lock.json")
MODELS = Path(os.environ.get("WASSCE_AUDIO_MODELS", Path.home() / ".cache/wassce-audio"))

RATE = 24000
VOICES = {"Narrator": "bf_emma", "Woman": "bf_emma", "Man": "bm_george"}
WORD_VOICES = ["bf_emma", "bf_isabella", "bf_lily", "bf_alice"]  # tried in this order
WORD_TAKES = [(0.9, "."), (0.85, "."), (1.0, "."), (0.9, "!"), (1.0, "!"), (0.85, "!")]
PASSAGE_SPEEDS = [0.9, 0.95, 1.0]
TURN_PAUSE_S = 0.7
THREADS = max(1, (os.cpu_count() or 2) - 1)
VERSION = 1  # bump to rebuild every clip after changing how clips are made

sys.path.insert(0, str(ROOT / "scripts/questions"))
sys.path.insert(0, str(ENGLISH))


# ── Phonemes ──────────────────────────────────────────────────────────────
# misaki writes some RP sounds with its own letters; the lessons use IPA.
MISAKI_TO_IPA = [("ɛː", "eə"), ("ʤ", "dʒ"), ("ʧ", "tʃ"), ("A", "eɪ"), ("I", "aɪ"), ("W", "aʊ"),
                 ("Y", "ɔɪ"), ("Q", "əʊ"), ("a", "æ"), ("ɛ", "e"), ("ɹ", "r"), ("ɡ", "g"), ("ᵊ", "ə")]
NUCLEI = ["eɪ", "aɪ", "ɔɪ", "əʊ", "aʊ", "ɪə", "eə", "ʊə", "iː", "uː", "ɑː", "ɔː", "ɜː",
          "i", "ɪ", "e", "æ", "ʌ", "ɒ", "ʊ", "u", "ə"]
MISAKI_VOWELS = set("AIWYQaɑɒæɔəɛɜɪʊʌiuᵊ")


def to_ipa(misaki: str) -> str:
    pattern = re.compile("|".join(re.escape(a) for a, _ in MISAKI_TO_IPA))
    table = dict(MISAKI_TO_IPA)
    return pattern.sub(lambda m: table[m.group(0)], misaki)


def segments(ipa: str) -> list[str]:
    """Split IPA into sounds, keeping long vowels and diphthongs whole."""
    out, i = [], 0
    while i < len(ipa):
        for n in NUCLEI:
            if ipa.startswith(n, i) and len(n) > 1:
                out.append(n); i += len(n); break
        else:
            out.append(ipa[i]); i += 1
    return out


def sounds(ipa: str) -> str:
    """The sounds alone, for comparing two transcriptions: stress marks dropped,
    and a schwa before a final n or l dropped, since dictionaries differ on
    whether to write it (/ˈmɪʃn/ or /ˈmɪʃən/)."""
    s = ipa.replace("ˈ", "").replace("ˌ", "").replace("ɡ", "g")
    return re.sub(r"ə([nl])(?=$|[^aeiouæɑɒɔəɜɪʊʌ])", r"\1", s)


def stressed_nucleus(ipa: str) -> int | None:
    """Which vowel (0 = first) carries the primary stress."""
    count, pending = 0, False
    for seg in segments(ipa.replace("ˌ", "")):
        if seg == "ˈ":
            pending = True
        elif seg in NUCLEI:
            if pending:
                return count
            count += 1
    return None


def stress_isolated(ph: str) -> str:
    """A word said on its own carries a primary stress, even a function word."""
    if "ˈ" in ph:
        return ph
    if "ˌ" in ph:
        return ph.replace("ˌ", "ˈ", 1)
    i = next(i for i, c in enumerate(ph) if c in MISAKI_VOWELS)
    return ph[:i] + "ˈ" + ph[i:]


class Lexicon:
    def __init__(self):
        import misaki
        data = Path(misaki.__file__).parent / "data"
        self.gold = json.loads((data / "gb_gold.json").read_text())
        self.silver = json.loads((data / "gb_silver.json").read_text())
        self._g2p = None

    def lookup(self, text: str, pos: str = "DEFAULT") -> tuple[str | None, str]:
        for name, lex in (("gold", self.gold), ("silver", self.silver)):
            for key in (text, text.lower(), text.capitalize()):
                entry = lex.get(key)
                if isinstance(entry, dict):
                    entry = entry.get(pos) or entry.get("DEFAULT")
                if entry:
                    return entry, name
        return None, "missing"

    def sentence(self, text: str) -> str:
        if self._g2p is None:
            from misaki import en
            self._g2p = en.G2P(trf=False, british=True, fallback=None)
        phonemes, tokens = self._g2p(text)
        unknown = [t.text for t in tokens if t.phonemes is None or "❓" in (t.phonemes or "")]
        if unknown or "❓" in phonemes:
            raise ValueError(f"not in the pronunciation dictionary: {unknown}")
        return phonemes


# ── Speech recognition ────────────────────────────────────────────────────
def words_of(text: str) -> list[str]:
    from num2words import num2words
    text = re.sub(r"\d+", lambda m: f" {num2words(int(m.group(0)))} ", text.lower())
    text = text.replace("-", " ").replace("’", "'")
    return [w.strip("'") for w in re.sub(r"[^a-z' ]", " ", text).split() if w.strip("'")]


def heard_as(transcript: str, accept: set[str]) -> bool:
    """A single word came back as itself or a word that sounds the same. A lone
    "a" before it is ignored: recognisers often hear one in the breath before a
    word said on its own."""
    w = words_of(transcript)
    if len(w) == 2 and w[0] == "a":
        w = w[1:]
    return len(w) == 1 and w[0] in accept


# Names the recognisers cannot know: Sierra Leone's currency comes back as
# "newly owns". In a passage check each stands for any one to three words,
# and every other word must still match.
UNKNOWN_NAMES = ["new leones"]


def wer(ref: list[str], hyp: list[str]) -> float:
    """Word error rate; a "*" in the reference matches one to three words."""
    INF = float("inf")
    d = [[INF] * (len(hyp) + 1) for _ in range(len(ref) + 1)]
    d[0] = list(range(len(hyp) + 1))
    for i, r in enumerate(ref, 1):
        d[i][0] = d[i - 1][0] + 1
        for j in range(1, len(hyp) + 1):
            if r == "*":
                d[i][j] = min([d[i - 1][j - k] for k in (1, 2, 3) if j - k >= 0] + [d[i - 1][j] + 1])
            else:
                d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (r != hyp[j - 1]))
    return d[len(ref)][len(hyp)] / max(1, len(ref))


def reference(text: str) -> list[str]:
    words = " ".join(words_of(text))
    for name in UNKNOWN_NAMES:
        words = words.replace(name, "*")
    return words.split()


class Recognisers:
    def __init__(self):
        import sherpa_onnx
        w = MODELS / "asr/sherpa-onnx-whisper-small.en/small.en"
        p = MODELS / "asr/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8"
        self.engines = {
            "whisper": sherpa_onnx.OfflineRecognizer.from_whisper(
                encoder=f"{w}-encoder.onnx", decoder=f"{w}-decoder.onnx", tokens=f"{w}-tokens.txt",
                language="en", task="transcribe", num_threads=THREADS),
            "parakeet": sherpa_onnx.OfflineRecognizer.from_transducer(
                encoder=str(p / "encoder.int8.onnx"), decoder=str(p / "decoder.int8.onnx"),
                joiner=str(p / "joiner.int8.onnx"), tokens=str(p / "tokens.txt"), model_type="nemo_transducer",
                num_threads=THREADS),
        }

    def __call__(self, audio: np.ndarray) -> dict[str, str]:
        pad = np.zeros(int(RATE * 0.6), dtype=np.float32)
        x = np.concatenate([pad, audio.astype(np.float32), pad])
        out = {}
        for name, rec in self.engines.items():
            s = rec.create_stream()
            s.accept_waveform(RATE, x)
            rec.decode_stream(s)
            out[name] = s.result.text.strip()
        return out


# ── Sound ─────────────────────────────────────────────────────────────────
def tidy(audio: np.ndarray, lead_s: float = 0.12, tail_s: float = 0.25) -> np.ndarray:
    """Trim silence to a fixed lead-in and tail, keeping soft consonants, and even
    out the level: speech at about -20 dBFS RMS, peaks no higher than -1.5 dBFS."""
    audio = audio.astype(np.float32)
    frame = int(RATE * 0.01)
    n = len(audio) // frame
    rms = np.sqrt(np.mean(audio[: n * frame].reshape(n, frame) ** 2, axis=1) + 1e-12)
    loud = np.where(rms > rms.max() * 10 ** (-42 / 20))[0]
    start = max(0, (loud[0] - 4) * frame)
    end = min(len(audio), (loud[-1] + 8) * frame)
    audio = audio[start:end]
    voiced = rms[loud[0]: loud[-1] + 1]
    speech_rms = float(np.sqrt(np.mean(voiced[voiced > rms.max() * 0.1] ** 2)))
    audio = audio * (10 ** (-20 / 20) / speech_rms)
    peak = float(np.abs(audio).max())
    if peak > 10 ** (-1.5 / 20):
        audio = audio * (10 ** (-1.5 / 20) / peak)
    return np.concatenate([np.zeros(int(RATE * lead_s), np.float32), audio, np.zeros(int(RATE * tail_s), np.float32)])


def encode_mp3(audio: np.ndarray, path: Path) -> np.ndarray:
    """Write a 64 kbps mono MP3 and return the audio decoded back from it."""
    pcm = (np.clip(audio, -1, 1) * 32767).astype("<i2").tobytes()
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "-",
                    "-codec:a", "libmp3lame", "-b:a", "64k", "-map_metadata", "-1", "-id3v2_version", "0",
                    "-write_xing", "1", str(path)], input=pcm, check=True)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(RATE), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype="<f4")


# ── Clips ─────────────────────────────────────────────────────────────────
@dataclass
class Result:
    ok: bool
    detail: dict


class Builder:
    def __init__(self):
        from kokoro_onnx import Kokoro
        self.tts = Kokoro(str(MODELS / "kokoro/kokoro-v1.0.onnx"), str(MODELS / "kokoro/voices-v1.0.bin"))
        self.lex = Lexicon()
        self.asr = Recognisers()
        self.tmp = Path(tempfile.gettempdir()) / "wassce-audio-take.mp3"
        self.frames: dict[str, np.ndarray] = {}

    def framed(self, audio: np.ndarray, voice: str) -> np.ndarray:
        """A take played after "The word is", in the same voice, for checking only."""
        if voice not in self.frames:
            self.frames[voice] = tidy(self.speak("ðə wˈɜːd ɪz", voice, 0.95), lead_s=0.0, tail_s=0.12)
        return tidy(np.concatenate([self.frames[voice], audio]))

    def speak(self, phonemes: str, voice: str, speed: float) -> np.ndarray:
        audio, rate = self.tts.create(phonemes, voice=voice, speed=speed, lang="en-gb", is_phonemes=True, trim=False)
        assert rate == RATE, rate
        return audio

    def word(self, slug: str, clip: dict, rivals: set[str]) -> Result:
        found, source = self.lex.lookup(clip["text"], clip["pos"])
        phonemes = clip["phonemes"] or found
        if not phonemes:
            return Result(False, {"problem": "not in the pronunciation dictionary"})
        detail = {"phonemes": phonemes, "dictionary": found, "source": "editor override" if clip["phonemes"] else source}
        said = to_ipa(phonemes)
        if sounds(said) != sounds(clip["ipa"]):
            return Result(False, {**detail, "problem": f"dictionary /{said}/ does not match the editor's /{clip['ipa']}/"})
        if sum(seg in NUCLEI for seg in segments(sounds(said))) > 1:
            if stressed_nucleus(stress_isolated(said)) != stressed_nucleus(clip["ipa"]):
                return Result(False, {**detail, "problem": f"stress differs: /{said}/ against /{clip['ipa']}/"})
        accept = {clip["text"].lower(), *[a.lower() for a in clip["also"]]}
        best, tried = None, []
        for voice in WORD_VOICES:
            for speed, end in WORD_TAKES:
                audio = tidy(self.speak(stress_isolated(phonemes) + end, voice, speed))
                heard_audio = encode_mp3(audio, self.tmp)
                heard = self.asr(heard_audio)
                score = sum(heard_as(t, accept) for t in heard.values())
                # Heard as another word of its row (*cut* for *cot*): the very
                # confusion the row teaches. Never keep such a take.
                if any(heard_as(t, rivals) for t in heard.values()):
                    score = -1
                take = {"voice": voice, "speed": speed, "ending": end, "heard": heard, "score": score,
                        "seconds": round(len(heard_audio) / RATE, 2)}
                tried.append((take, audio))
                if best is None or score > best[0]["score"]:
                    best = (take, audio)
                if score == 2:
                    break
            # Emma is the clearest British voice: keep her take if either
            # recogniser heard the word, and try another voice only if neither did.
            if best[0]["score"] >= 1:
                break
        if best[0]["score"] <= 0:
            # Recognisers trained mostly on American speech mishear some RP words
            # said on their own (/heə/ for *hair* comes back as "head"). Play the
            # same take after "The word is", which gives them a sentence without
            # hinting at the word, and accept what they hear there.
            for take, audio in tried:
                heard = self.asr(encode_mp3(self.framed(audio, take["voice"]), self.tmp))
                said = [words_of(t)[-4:] for t in heard.values()]
                score = sum(len(w) == 4 and w[:3] == ["the", "word", "is"] and w[3] in accept for w in said)
                if any(len(w) == 4 and w[:3] == ["the", "word", "is"] and w[3] in rivals for w in said):
                    score = -1
                if score > best[0]["score"]:
                    best = ({**take, "heard": heard, "score": score, "check": "after 'The word is'"}, audio)
                if score == 2:
                    break
        take, audio = best
        detail.update(take)
        if take["score"] <= 0:
            problem = ("every take was heard as another word in its row" if take["score"] < 0
                       else "neither recogniser heard the word in any take")
            return Result(False, {**detail, "problem": problem})
        if not 0.3 <= take["seconds"] <= 2.5:
            return Result(False, {**detail, "problem": f"length {take['seconds']} s is outside 0.3–2.5 s"})
        encode_mp3(audio, OUT / f"{slug}.mp3")
        return Result(True, detail)

    def passage(self, slug: str, clip: dict) -> Result:
        parts, turns = [], []
        for speaker, text in clip["segments"]:
            phonemes = self.lex.sentence(text)
            voice = VOICES[speaker]
            for speed in PASSAGE_SPEEDS:
                audio = tidy(self.speak(phonemes, voice, speed), lead_s=0.0, tail_s=0.0)
                heard = self.asr(encode_mp3(tidy(audio), self.tmp))
                errors = sorted(wer(reference(text), words_of(t)) for t in heard.values())
                turn = {"speaker": speaker, "voice": voice, "speed": speed, "text": text, "phonemes": phonemes,
                        "heard": heard, "wer": [round(e, 3) for e in errors]}
                if errors[0] == 0 and errors[1] <= 0.15:
                    break
            else:
                return Result(False, {"turns": turns + [turn], "problem": f"{speaker}'s words were not heard back: {heard}"})
            turns.append(turn)
            parts.append(audio)
        gap = np.zeros(int(RATE * TURN_PAUSE_S), np.float32)
        joined = parts[0]
        for p in parts[1:]:
            joined = np.concatenate([joined, gap, p])
        final = encode_mp3(tidy(joined), OUT / f"{slug}.mp3")
        seconds = round(len(final) / RATE, 2)
        if np.abs(final).max() > 0.999:
            return Result(False, {"turns": turns, "problem": "clipped"})
        return Result(True, {"turns": turns, "seconds": seconds})


def clip_key(clip: dict, rivals: set[str]) -> str:
    blob = json.dumps({"clip": clip, "rivals": sorted(rivals), "version": VERSION, "rate": RATE, "voices": VOICES, "word_voices": WORD_VOICES,
                       "takes": WORD_TAKES, "speeds": PASSAGE_SPEEDS}, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(blob.encode()).hexdigest()[:16]


def file_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:10]


def report(clips: dict, results: dict) -> str:
    lines = [
        "# Oral English audio: check report",
        "",
        "Written by `scripts/audio/oral_audio.py`; do not edit by hand. Each clip is spoken by the",
        "Kokoro voice model (Apache 2.0) in standard British English from dictionary phonemes,",
        "then transcribed by two speech recognisers (Whisper small.en and NVIDIA Parakeet).",
        "A clip that fails is not linked from any question. See the script for the checks.",
        "",
    ]
    words = [(s, c) for s, c in clips.items() if c["kind"] == "word"]
    passages = [(s, c) for s, c in clips.items() if c["kind"] == "passage"]
    passed = sum(results[s]["ok"] for s in clips)
    lines += [f"**{passed} of {len(clips)} clips passed.**", "", "## Words", "",
              "| Clip | Editor's IPA | Dictionary phonemes | Voice, speed | Whisper heard | Parakeet heard | Result |",
              "|---|---|---|---|---|---|---|"]
    for slug, c in words:
        r = results[slug]; d = r["detail"]
        heard = d.get("heard", {})
        voice = f"{d['voice']}, {d['speed']}" if "voice" in d else ""
        verdict = "pass" if r["ok"] else f"**fail**: {d.get('problem', '')}"
        if r["ok"] and d.get("score") == 1:
            verdict += " (one recogniser)"
        if r["ok"] and d.get("check"):
            verdict += f" ({d['check']})"
        lines.append(f"| {c['label']} | /{c['ipa']}/ | {d.get('phonemes', '')} ({d.get('source', '')}) | {voice} | "
                     f"{heard.get('whisper', '')} | {heard.get('parakeet', '')} | {verdict} |")
    lines += ["", "## Passages", ""]
    for slug, c in passages:
        r = results[slug]; d = r["detail"]
        lines.append(f"### {slug}: {'pass' if r['ok'] else 'FAIL: ' + d.get('problem', '')}"
                     + (f" ({d['seconds']} s)" if "seconds" in d else ""))
        lines.append("")
        for t in d.get("turns", []):
            lines.append(f"- **{t['speaker']}** ({t['voice']}, speed {t['speed']}): {t['text']}")
            lines.append(f"  - Whisper: {t['heard']['whisper']}")
            lines.append(f"  - Parakeet: {t['heard']['parakeet']}")
            lines.append(f"  - Word error rates: {t['wer']}")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


# ── Lessons ───────────────────────────────────────────────────────────────
# A lesson asks for a clip by linking to it in its Markdown, labelled with the
# word and its RP transcription: [seat /siːt/](https://wasscetutor.com/audio/oral/seat.mp3).
# The words on one line (a table row, a Listen line) are a row: each must not be
# heard as another. After a build, every link gets its file's hash (?v=...).
NOTES = ROOT / "content/notes"
LESSON_LINK = re.compile(r"\[([^\]/]+?) /([^/\]]+)/\]\(https://wasscetutor\.com/audio/oral/([\w-]+)\.mp3(?:\?v=\w+)?\)")
# Words that sound the same as a lesson word in RP, which the recognisers may write instead.
HOMOPHONES = {
    "key": ["quay"], "caught": ["court"], "law": ["lore"], "here": ["hear"], "there": ["their", "they're"],
    "pain": ["pane"], "seed": ["cede"], "time": ["thyme"], "boy": ["buoy"], "beer": ["bier"], "high": ["hi"],
    "cart": ["kart"], "heart": ["hart"], "coat": ["cote"], "bread": ["bred"], "word": ["whirred"],
    "ward": ["warred"], "father": ["farther"], "great": ["grate"], "heard": ["herd"], "wood": ["would"],
    "wear": ["where", "ware"], "road": ["rode", "rowed"], "sun": ["son"], "seize": ["sees", "seas"],
    "made": ["maid"], "sure": ["shore"],
}


def read_lessons(question_clips: dict) -> tuple[dict, list[list[str]]]:
    clips: dict[str, dict] = {}
    rows: list[list[str]] = []
    for path in sorted(NOTES.glob("*.md")):
        for line in path.read_text().split("\n"):
            found = LESSON_LINK.findall(line)
            for label, ipa, slug in found:
                text = label.split(" (")[0]
                # "present (verb)": the dictionary's verb entry; "(noun)" its noun entry where it has one.
                pos = {"(verb)": "VERB", "(noun)": "NOUN"}.get(label[len(text):].strip(), "DEFAULT")
                clip = question_clips.get(slug) or {
                    "kind": "word", "text": text, "label": label, "ipa": ipa.replace("g", "ɡ"), "pos": pos,
                    "phonemes": None, "also": HOMOPHONES.get(text.lower(), [])}
                if sounds(clip["ipa"]) != sounds(ipa.replace("g", "ɡ")) or clip["text"] != text:
                    raise SystemExit(f"{path.name}: {label} /{ipa}/ differs from the clip {slug} (/{clip['ipa']}/)")
                if clips.setdefault(slug, clip) != clip:
                    raise SystemExit(f"{path.name}: {slug} is labelled two ways")
            if len(found) > 1:
                rows.append([slug for _, _, slug in found])
    return clips, rows


def link_lessons(manifest: dict[str, str]) -> dict[str, list[str]]:
    """Give every lesson link its file's hash; return the links to clips that failed."""
    dead: dict[str, list[str]] = {}
    for path in sorted(NOTES.glob("*.md")):
        text = path.read_text()

        def stamp(m: re.Match) -> str:
            label, ipa, slug = m.groups()
            if slug not in manifest:
                dead.setdefault(path.name, []).append(slug)
                return m.group(0)
            return f"[{label} /{ipa}/](https://wasscetutor.com/audio/oral/{slug}.mp3?v={manifest[slug]})"

        new = LESSON_LINK.sub(stamp, text)
        if new != text:
            path.write_text(new)
    return dead


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--force", action="store_true", help="rebuild every clip")
    ap.add_argument("--only", nargs="*", help="rebuild only these slugs")
    args = ap.parse_args()

    import set5_p1
    clips = dict(set5_p1.CLIPS)
    lesson_clips, lesson_rows = read_lessons(clips)
    clips.update(lesson_clips)
    # Each word's rivals: the other words of every row it is in, and their homophones.
    rivals: dict[str, set[str]] = {slug: set() for slug in clips}
    for row in [*set5_p1.ROWS.values(), *lesson_rows]:
        for slug in row:
            for other in row:
                if clips[other]["text"].lower() != clips[slug]["text"].lower():
                    rivals[slug] |= {clips[other]["text"].lower(), *(a.lower() for a in clips[other]["also"])}
    OUT.mkdir(parents=True, exist_ok=True)
    lock = json.loads(LOCK.read_text()) if LOCK.exists() else {}
    builder = None
    results = {}
    for slug, clip in clips.items():
        key = clip_key(clip, rivals.get(slug, set()))
        cached = lock.get(slug)
        fresh = args.force or (args.only is not None and slug in args.only)
        if cached and cached["key"] == key and not fresh and (not cached["ok"] or (OUT / f"{slug}.mp3").exists()):
            results[slug] = cached
            continue
        builder = builder or Builder()
        try:
            r = builder.word(slug, clip, rivals[slug]) if clip["kind"] == "word" else builder.passage(slug, clip)
        except ValueError as e:
            r = Result(False, {"problem": str(e)})
        if not r.ok:
            (OUT / f"{slug}.mp3").unlink(missing_ok=True)
        results[slug] = {"key": key, "ok": r.ok, "detail": r.detail}
        LOCK.write_text(json.dumps({**lock, **results}, indent=1, ensure_ascii=False, sort_keys=True) + "\n")
        print(f"{'pass' if r.ok else 'FAIL'}  {slug}  {r.detail.get('problem', '')}", flush=True)
    if builder:
        builder.tmp.unlink(missing_ok=True)

    for stale in set(lock) - set(clips):
        (OUT / f"{stale}.mp3").unlink(missing_ok=True)
    LOCK.write_text(json.dumps(results, indent=1, ensure_ascii=False, sort_keys=True) + "\n")
    manifest = {slug: file_hash(OUT / f"{slug}.mp3") for slug in clips if results[slug]["ok"]}
    MANIFEST.write_text(json.dumps(manifest, indent=1, sort_keys=True) + "\n")
    REPORT.write_text(report(clips, results))
    failed = [s for s in clips if not results[s]["ok"]]
    print(f"{len(clips) - len(failed)} of {len(clips)} clips passed" + (f"; failed: {', '.join(failed)}" if failed else ""))
    dead = link_lessons(manifest)
    if dead:
        sys.exit("Lessons link to clips that failed their checks; choose other words for: "
                 + "; ".join(f"{name}: {', '.join(slugs)}" for name, slugs in dead.items()))


if __name__ == "__main__":
    main()
