#!/usr/bin/env python3
"""Chalkboard video lessons: the board is drawn while the voice explains it.

    python3 scripts/video/board_video.py content/videos/physics-waves-1.py
    python3 scripts/video/board_video.py content/videos/physics-waves-1.py --out x.mp4 --until 20

A lesson file (content/videos/<slug>.py) lists STEPS. Each step is one thing
the teacher says and what they draw on the board while saying it:

    step("The wavelength, lambda, is the distance from one crest to the next.",
         double_arrow(175, 258, 475, 258), write("λ", 312, 244))

The voice is the oral English voice (scripts/audio): Kokoro, speaking from the
phonemes of misaki's British dictionary. A word missing from the dictionary
stops the build; nothing is guessed from spelling. The chalk is drawn from
single-stroke (Hershey) letters, so the writing appears stroke by stroke, the
way a hand writes, and each step's drawing is timed to finish with its speech.

Writes the video (H.264 + AAC, 1280x720, 25 fps) and captions (.vtt) beside it.
Setup: the voice models and packages in scripts/audio/README.md, then
`pip install Hershey-Fonts pycairo`.
"""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import math
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

import cairo
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts/audio"))
from oral_audio import MODELS, RATE, Lexicon, tidy  # noqa: E402

W, H, FPS = 1280, 720, 25
VOICE, SPEED = "bf_emma", 0.92
CACHE = Path.home() / ".cache/wassce-video"
VERSION = 1

CHALK = {
    "white": (0.96, 0.96, 0.93),
    "yellow": (0.99, 0.87, 0.42),
    "blue": (0.56, 0.80, 0.99),
    "pink": (0.98, 0.62, 0.72),
    "green": (0.62, 0.93, 0.62),
    "grey": (0.70, 0.74, 0.72),
}
WRITE_SPEED = 720.0   # px of chalk per second
LIFT = 0.04           # s between strokes
DRAW_DELAY = 0.25     # s after the voice starts


# ── Strokes ───────────────────────────────────────────────────────────────
@dataclass
class Stroke:
    points: np.ndarray          # (n, 2)
    color: str = "white"
    width: float = 3.4

    @property
    def length(self) -> float:
        return float(np.sum(np.hypot(*np.diff(self.points, axis=0).T))) if len(self.points) > 1 else 0.0


@dataclass
class Action:
    strokes: list[Stroke] = field(default_factory=list)
    erase: float = 0.0          # seconds of wiping the board, for clear()


_rng = np.random.default_rng(7)


def _hand(p0, p1, wobble=1.0) -> np.ndarray:
    """A straight line as a hand draws it: a slight, smooth wobble."""
    p0, p1 = np.asarray(p0, float), np.asarray(p1, float)
    d = p1 - p0
    n = max(2, int(np.hypot(*d) / 6))
    t = np.linspace(0, 1, n)
    normal = np.array([-d[1], d[0]]) / (np.hypot(*d) + 1e-9)
    amp = min(2.2, 0.006 * np.hypot(*d)) * wobble
    phase = _rng.uniform(0, 2 * np.pi)
    off = amp * np.sin(np.pi * t) * np.sin(phase + 1.3 * np.pi * t)
    return p0 + np.outer(t, d) + np.outer(off, normal)


# ── Letters ───────────────────────────────────────────────────────────────
_fonts: dict[str, object] = {}
# Characters drawn from another Hershey font, and those drawn here.
FROM_FONT = {"λ": ("greek", "l")}
CAP, BASE = -12, 9            # Hershey cap line and base line
TRACK = 0.88                  # chalk letters sit closer than Hershey spaces them


def _font(name: str):
    if name not in _fonts:
        from HersheyFonts import HersheyFonts
        f = HersheyFonts()
        f.load_default_font(name)
        _fonts[name] = f
    return _fonts[name]


def _glyph(ch: str) -> tuple[list[np.ndarray], float]:
    """Strokes for one character in Hershey units (left edge at x=0), and its advance."""
    if ch == "×":
        return [np.array([[3, -4], [13, 6]], float), np.array([[13, -4], [3, 6]], float)], 16
    if ch == "÷":
        return [np.array([[3, 1], [15, 1]], float), np.array([[9, -5], [9.5, -4.5]], float),
                np.array([[9, 7], [9.5, 7.5]], float)], 18
    if ch == "·":
        return [np.array([[5, -2], [5.5, -1.5]], float)], 11
    name, key = FROM_FONT.get(ch, ("futural", ch))
    glyphs = list(_font(name).glyphs_for_text(key))
    if not glyphs or (not glyphs[0].strokes and ch != " "):
        raise ValueError(f"no chalk letter for {ch!r}")
    g = glyphs[0]
    return [np.array(s, float) - [g.left_offset, 0] for s in g.strokes], float(g.char_width)


def _runs(text: str):
    """Split text into (chars, level): level 1 is a superscript, -1 a subscript.
    `10^8` and `10^{-6}` raise; `v_1` and `v_{max}` lower."""
    i, out = 0, []
    while i < len(text):
        if text[i] in "^_" and i + 1 < len(text):
            level = 1 if text[i] == "^" else -1
            if text[i + 1] == "{":
                j = text.index("}", i)
                out.append((text[i + 2:j], level)); i = j + 1
            else:
                out.append((text[i + 1], level)); i += 2
        else:
            out.append((text[i], 0)); i += 1
    return out


def text_strokes(text: str, x: float, y: float, size: float, color: str) -> tuple[list[Stroke], float]:
    """Strokes for `text` with its base line at y, starting at x; `size` is the
    height of a capital in px. Returns the strokes and the text's width."""
    scale0 = size / (BASE - CAP)
    width = max(2.8, size * 0.11)
    cx, strokes = x, []
    for chars, level in _runs(text):
        scale = scale0 * (0.62 if level else 1)
        lift = {1: -0.62 * size, -1: 0.28 * size, 0: 0}[level]
        for ch in chars:
            glyph, adv = _glyph(ch)
            tilt = _rng.normal(0, 0.012)
            jy = _rng.normal(0, 0.4)
            for s in glyph:
                px = s[:, 0] * scale
                py = (s[:, 1] - BASE) * scale
                rx = px * math.cos(tilt) - py * math.sin(tilt)
                ry = px * math.sin(tilt) + py * math.cos(tilt)
                strokes.append(Stroke(np.column_stack([cx + rx, y + lift + jy + ry]), color, width * (0.85 if level else 1)))
            cx += adv * scale * TRACK
    return strokes, cx - x


def text_width(text: str, size: float) -> float:
    state = _rng.bit_generator.state
    w = text_strokes(text, 0, 0, size, "white")[1]
    _rng.bit_generator.state = state
    return w


# ── What the teacher can draw ─────────────────────────────────────────────
def write(text: str, x: float, y: float, size: float = 30, color: str = "white", align: str = "left") -> Action:
    """Chalk writing; (x, y) is the left end of its base line (or centre/right, by align)."""
    w = text_width(text, size)
    x0 = x - {"left": 0, "center": w / 2, "right": w}[align]
    if x0 < 30 or x0 + w > W - 30:
        raise ValueError(f"{text!r} runs off the board ({x0:.0f} to {x0 + w:.0f} px)")
    if x0 + w > 1015 and y - size < 78:
        raise ValueError(f"{text!r} is written over the wasscetutor.com mark (top right): move it down or left")
    return Action(text_strokes(text, x0, y, size, color)[0])


def line(x1, y1, x2, y2, color="white", width=3.6) -> Action:
    return Action([Stroke(_hand((x1, y1), (x2, y2)), color, width)])


def _head(x1, y1, x2, y2, color, width, size=16) -> list[Stroke]:
    a = math.atan2(y2 - y1, x2 - x1)
    return [Stroke(_hand((x2 - size * math.cos(a + s * 0.45), y2 - size * math.sin(a + s * 0.45)), (x2, y2), 0.3), color, width)
            for s in (-1, 1)]


def arrow(x1, y1, x2, y2, color="white", width=3.4) -> Action:
    return Action([Stroke(_hand((x1, y1), (x2, y2)), color, width)] + _head(x1, y1, x2, y2, color, width))


def double_arrow(x1, y1, x2, y2, color="white", width=3.4) -> Action:
    return Action([Stroke(_hand((x1, y1), (x2, y2)), color, width)]
                  + _head(x2, y2, x1, y1, color, width) + _head(x1, y1, x2, y2, color, width))


def dashed(x1, y1, x2, y2, color="grey", width=3.0, dash=16, gap=11) -> Action:
    p0, p1 = np.array([x1, y1], float), np.array([x2, y2], float)
    length = float(np.hypot(*(p1 - p0)))
    u = (p1 - p0) / length
    out, s = [], 0.0
    while s < length:
        e = min(length, s + dash)
        out.append(Stroke(np.array([p0 + u * s, p0 + u * e]), color, width))
        s = e + gap
    return Action(out)


def wave(x0, y0, length, amplitude, cycles, color="white", width=3.8) -> Action:
    """A sine wave along the rest line y0, starting upwards at x0."""
    xs = np.linspace(x0, x0 + length, max(40, int(length / 3)))
    ys = y0 - amplitude * np.sin(2 * np.pi * cycles * (xs - x0) / length)
    return Action([Stroke(np.column_stack([xs, ys]), color, width)])


def box(x, y, w, h, color="yellow", width=3.4) -> Action:
    o = 5  # chalk corners overshoot a little
    return Action([Stroke(np.vstack([_hand((x - o, y), (x + w, y)), _hand((x + w, y - o), (x + w, y + h))]), color, width),
                   Stroke(np.vstack([_hand((x + w + o, y + h), (x, y + h)), _hand((x, y + h + o), (x, y - o))]), color, width)])


def underline(x1, x2, y, color="yellow", width=3.4) -> Action:
    return line(x1, y, x2, y, color, width)


def heading(text: str, x: float = 70, y: float = 95, size: float = 44, color: str = "yellow") -> Action:
    """A board's heading, underlined to its own length."""
    w = text_width(text, size)
    return Action(write(text, x, y, size, color).strokes + underline(x - 6, x + w + 6, y + 19, color).strokes)


def ring(cx, cy, rx, ry, color="pink", width=3.4) -> Action:
    """A loop round something, a little more than once, as chalk circles are drawn."""
    t = np.linspace(-0.4, 2 * np.pi + 0.15, 90)
    wob = 1 + 0.03 * np.sin(3 * t + 1)
    return Action([Stroke(np.column_stack([cx + rx * wob * np.cos(t), cy + ry * wob * np.sin(t)]), color, width)])


def _smooth(points, closed: bool, per_seg: int = 14) -> np.ndarray:
    """A Catmull-Rom curve through the points: how a steady hand joins them."""
    p = np.asarray(points, float)
    if closed:
        p = np.vstack([p[-1:], p, p[:2]])
    else:
        p = np.vstack([p[:1], p, p[-1:]])
    out = []
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        for t in np.linspace(0, 1, per_seg, endpoint=False):
            t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    out.append(p[-2])
    return np.array(out)


def curve(points, color="white", width=3.6, closed=False) -> Action:
    """A smooth chalk line through the points (closed: back to the first)."""
    return Action([Stroke(_smooth(points, closed), color, width)])


def ellipse(cx, cy, rx, ry, color="white", width=3.4, start=-0.3) -> Action:
    """A closed oval, drawn once round with a small overlap where the chalk meets."""
    t = np.linspace(start, start + 2 * np.pi + 0.08, 100)
    return Action([Stroke(np.column_stack([cx + rx * np.cos(t), cy + ry * np.sin(t)]), color, width)])


def blob(cx, cy, rx, ry, color="white", width=3.8, wobble=0.07, seed=1) -> Action:
    """An irregular rounded outline, like an animal cell."""
    rng = np.random.default_rng(seed)
    k = 9
    a = np.linspace(0, 2 * np.pi, k, endpoint=False) + rng.uniform(-0.12, 0.12, k)
    r = 1 + rng.uniform(-wobble, wobble, k)
    pts = np.column_stack([cx + rx * r * np.cos(a), cy + ry * r * np.sin(a)])
    return Action([Stroke(_smooth(pts, True), color, width)])


def dots(points, color="white", size=3.2) -> Action:
    """Small dots (ribosomes, granules, stomata): one tiny stroke each."""
    return Action([Stroke(np.array([[x - size / 2, y], [x + size / 2, y + 0.5]]), color, size * 1.4) for x, y in points])


def zigzag(x1, y1, x2, y2, n=6, amp=10, color="white", width=2.6) -> Action:
    """A folded line between two points (the cristae of a mitochondrion)."""
    p0, p1 = np.array([x1, y1], float), np.array([x2, y2], float)
    d = p1 - p0
    nrm = np.array([-d[1], d[0]]) / (np.hypot(*d) + 1e-9)
    pts = [p0 + d * i / n + nrm * (amp if i % 2 else -amp) * (0 < i < n) for i in range(n + 1)]
    return Action([Stroke(np.array(pts), color, width)])


def label(text: str, x: float, y: float, tx: float, ty: float, size: float = 24, color: str = "white",
          line_color: str = "grey", align: str = "left") -> Action:
    """A biological label: the word, then a straight label line (no arrow head)
    from beside the word to the point (tx, ty) on the drawing."""
    w = text_width(text, size)
    x0 = x - {"left": 0, "center": w / 2, "right": w}[align]
    words = write(text, x, y, size, color, align)
    # the line leaves from the side of the word that faces the drawing
    sx = x0 - 8 if tx < x0 else x0 + w + 8
    sy = y - size * 0.4
    return Action(words.strokes + line(sx, sy, tx, ty, line_color, 2.6).strokes)


def frac(num: str, den: str, x: float, y: float, size: float = 30, color: str = "white") -> Action:
    """A fraction with its bar on the line through y (about the middle of a
    capital on the base line y), starting at x."""
    wn, wd = text_width(num, size), text_width(den, size)
    w = max(wn, wd) + 16
    bar = y - size * 0.45
    a = write(num, x + w / 2, bar - size * 0.35, size, color, "center")
    b = Action([Stroke(_hand((x, bar), (x + w, bar)), color, max(2.6, size * 0.1))])
    c = write(den, x + w / 2, bar + size * 1.3, size, color, "center")
    return Action(a.strokes + b.strokes + c.strokes)


def clear(seconds: float = 2.4) -> Action:
    """Wipe the board with the duster."""
    return Action(erase=seconds)


@dataclass
class Step:
    say: str
    actions: list[Action]
    pause: float = 0.45
    chapter: str | None = None   # starts a key moment: a named, linkable point in the video


def step(say: str, *actions: Action, pause: float = 0.45, chapter: str | None = None) -> Step:
    return Step(say, list(actions), pause, chapter)


def outro() -> list[Step]:
    """The end card: the board is wiped and the brand written, with no voice.
    Every copy of a video ends by saying where it came from."""
    return [
        Step("", [clear(1.6)], 0.2),
        Step("", [write("WASSCE Tutor", W / 2, 330, 64, "yellow", "center"),
                  underline(W / 2 - 250, W / 2 + 250, 352),
                  write("wasscetutor.com", W / 2, 432, 40, "white", "center"),
                  write("Free lessons  ·  Past questions  ·  Practice", W / 2, 500, 26, "blue", "center")], 2.4),
    ]


# ── Voice ─────────────────────────────────────────────────────────────────
# Words the British dictionary does not have, with the sounds to say them in
# misaki's phoneme letters (A = FACE, I = PRICE, Q = GOAT, ʤ = j). Every one
# must pass scripts/video/check_voice.py, which listens back to the lines.
PRONOUNCE = {
    "sapiens": "sˈapiənz",
    "Linnaeus": "lɪnˈAəs",
    "Protoctista": "pɹQtɒktˈɪstə",
    "protoctists": "pɹQtˈɒktɪsts",
    "Monera": "mɒnˈɪəɹə",
    "italicised": "ɪtˈalɪsIzd",
    "specialised": "spˈɛʃəlIzd",
    "Golgi": "ɡˈɒlʤi",
    "endoplasmic": "ˌɛndQplˈazmɪk",
    "Animalia": "ˌanɪmˈAliə",
    "Mammalia": "məmˈAliə",
    "Hominidae": "hɒmˈɪnɪdiː",
    "Zea": "zˈiːə",
    "mays": "mˈAz",
    "organisation": "ˌɔːɡənIzˈAʃən",
    "organised": "ˈɔːɡənIzd",
    "potometer": "pQtˈɒmɪtə",
    "fertilisation": "fˌɜːtɪlIzˈAʃən",
    "fertilised": "fˈɜːtɪlIzd",
    "faster": "fˈɑːstə",
    "Benedict": "bˈɛnɪdɪkt",
}
_SOUNDS = {k.lower(): v for k, v in PRONOUNCE.items()}
_PRONOUNCE = re.compile(r"\b(" + "|".join(map(re.escape, PRONOUNCE)) + r")\b", re.IGNORECASE)


def _with_sounds(text: str) -> str:
    """The line with each PRONOUNCE word (in any case) marked up with its sounds, for misaki."""
    return _PRONOUNCE.sub(lambda m: f"[{m.group(1)}](/{_SOUNDS[m.group(1).lower()]}/)", text)


class Voice:
    def __init__(self):
        from kokoro_onnx import Kokoro
        self.tts = Kokoro(str(MODELS / "kokoro/kokoro-v1.0.onnx"), str(MODELS / "kokoro/voices-v1.0.bin"))
        self.lex = Lexicon()
        CACHE.mkdir(parents=True, exist_ok=True)

    def __call__(self, text: str) -> np.ndarray:
        if not text:
            return np.zeros(0, np.float32)
        try:
            phonemes = self.lex.sentence(_with_sounds(text))
        except (ValueError, TypeError) as e:  # misaki raises TypeError on some unknown words
            raise SystemExit(f"Cannot say {text!r}: {e}. Reword the line.")
        key = hashlib.sha256(f"{VERSION}|{VOICE}|{SPEED}|{phonemes}".encode()).hexdigest()[:16]
        path = CACHE / f"{key}.npy"
        if path.exists():
            return np.load(path)
        audio, rate = self.tts.create(phonemes, voice=VOICE, speed=SPEED, lang="en-gb", is_phonemes=True, trim=False)
        assert rate == RATE, rate
        audio = tidy(audio, lead_s=0.05, tail_s=0.1)
        np.save(path, audio)
        return audio


# ── Timeline ──────────────────────────────────────────────────────────────
@dataclass
class Timed:
    t0: float
    t1: float
    stroke: Stroke | None = None     # a stroke drawn from t0 to t1
    erase: bool = False              # or the board wiped from t0 to t1


@dataclass
class Timeline:
    timed: list[Timed]
    clips: list[tuple[float, np.ndarray]]
    captions: list[tuple[float, float, str]]
    total: float
    chapters: list[tuple[float, str]]
    step_ends: list[float]          # when each step's drawing and speech are done
    step_starts: list[float]


def schedule(steps: list[Step], voice: Voice) -> Timeline:
    """Place each step's speech and drawing in time. Writing is sped up (to at
    most twice the usual pace) to end with the speech; if it still runs on,
    the voice waits for it."""
    t, timed, clips, captions = 0.6, [], [], []
    chapters, ends, starts = [], [], []
    for s in steps:
        starts.append(t)
        if s.chapter:
            chapters.append((0.0 if not chapters and t < 1.0 else round(t, 1), s.chapter))
        audio = voice(s.say)
        speech = len(audio) / RATE
        strokes = [st for a in s.actions for st in a.strokes]
        erase = sum(a.erase for a in s.actions)
        ink = sum(st.length for st in strokes) / WRITE_SPEED + LIFT * len(strokes)
        pace = min(2.0, max(1.0, ink / max(0.5, speech - DRAW_DELAY - erase - 0.2))) if ink else 1.0
        clips.append((t, audio))
        if s.say:
            captions.append((t, t + speech, s.say))
        d = t + DRAW_DELAY
        if erase:
            timed.append(Timed(d, d + erase, erase=True)); d += erase + 0.2
        for st in strokes:
            dur = st.length / (WRITE_SPEED * pace)
            timed.append(Timed(d, d + dur, st))
            d += dur + LIFT / pace
        ends.append(max(t + speech, d))
        t = max(t + speech, d) + s.pause
    return Timeline(timed, clips, captions, t + 1.2, chapters, ends, starts)


# ── Board ─────────────────────────────────────────────────────────────────
def _blur(a: np.ndarray, r: int) -> np.ndarray:
    for axis in (0, 1):
        c = np.cumsum(np.pad(a, [(r + 1, r) if i == axis else (0, 0) for i in range(2)], mode="edge"), axis=axis)
        a = (np.take(c, range(2 * r + 1, c.shape[axis]), axis=axis) - np.take(c, range(0, c.shape[axis] - 2 * r - 1), axis=axis)) / (2 * r + 1)
    return a


def _smooth_noise(rng, cells_y, cells_x) -> np.ndarray:
    small = rng.random((cells_y + 1, cells_x + 1))
    ys = np.linspace(0, cells_y, H)
    xs = np.linspace(0, cells_x, W)
    y0, x0 = ys.astype(int).clip(max=cells_y - 1), xs.astype(int).clip(max=cells_x - 1)
    fy, fx = (ys - y0)[:, None], (xs - x0)[None, :]
    fy, fx = fy * fy * (3 - 2 * fy), fx * fx * (3 - 2 * fx)
    a, b = small[y0][:, x0], small[y0][:, x0 + 1]
    c, d = small[y0 + 1][:, x0], small[y0 + 1][:, x0 + 1]
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy


FRAME, TRAY = 18, 30
WATERMARK_SIZE = 17


def board_background(label: str) -> np.ndarray:
    rng = np.random.default_rng(3)
    base = np.array([0.155, 0.245, 0.200])
    light = 0.035 * (_smooth_noise(rng, 6, 10) - 0.5) + 0.02 * (_smooth_noise(rng, 18, 32) - 0.5)
    yy, xx = np.mgrid[0:H, 0:W]
    vign = 1 - 0.22 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.4
    img = (base[None, None, :] + light[..., None] + 0.012 * (rng.random((H, W, 1)) - 0.5)) * vign[..., None]
    # old chalk dust from earlier lessons: faint arcs left by the duster
    dust = np.zeros((H, W))
    for _ in range(7):
        cy, cx, r = rng.uniform(80, 640), rng.uniform(100, 1180), rng.uniform(120, 300)
        ring_ = np.exp(-((np.hypot(yy - cy, xx - cx) - r) / rng.uniform(14, 30)) ** 2)
        dust += ring_ * (yy > cy - r * 0.2) * rng.uniform(0.02, 0.04)
    img += _blur(dust, 6)[..., None] * 0.55
    # wooden frame and chalk tray
    wood = np.array([0.42, 0.29, 0.17])
    grain = 0.05 * np.sin(yy / 2.3 + 6 * _smooth_noise(rng, 4, 40)) + 0.03 * (rng.random((H, W)) - 0.5)
    frame = (yy < FRAME) | (xx < FRAME) | (xx >= W - FRAME) | (yy >= H - TRAY)
    img[frame] = (wood[None, :] * (1 + grain[frame, None]))
    edge = ((yy == FRAME) | (xx == FRAME) | (xx == W - FRAME - 1) | (yy == H - TRAY - 1))
    img[edge] *= 0.45
    img[yy >= H - TRAY] *= 1.15
    img = np.clip(img, 0, 1)
    # the label, in faint chalk, bottom right
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(surf)
    lw = text_width(label, 15)
    for st in text_strokes(label, W - FRAME - 24 - lw, H - TRAY - 16, 15, "white")[0]:
        _path(ctx, st.points)
        ctx.set_source_rgba(1, 1, 1, 1); ctx.set_line_width(2.2); ctx.stroke()
    a = np.ndarray((H, W, 4), np.uint8, surf.get_data())[..., 3] / 255.0 * 0.32
    img = img * (1 - a[..., None]) + a[..., None] * 0.95
    # The watermark: the site's address, written into the board itself, top
    # right, where it never meets the lesson's writing and cannot be cropped
    # off without cutting into the board. Every frame of every copy carries it.
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(surf)
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    mark = "wasscetutor.com"
    mw = text_width(mark, WATERMARK_SIZE)
    for st in text_strokes(mark, W - FRAME - 26 - mw, FRAME + 40, WATERMARK_SIZE, "white")[0]:
        _path(ctx, st.points)
        ctx.set_source_rgba(1, 1, 1, 1); ctx.set_line_width(2.6); ctx.stroke()
    a = np.ndarray((H, W, 4), np.uint8, surf.get_data())[..., 3] / 255.0 * 0.40
    return img * (1 - a[..., None]) + a[..., None] * np.array([0.99, 0.87, 0.42])


def chalk_grain() -> np.ndarray:
    """Where chalk catches the board: speckled, with gaps."""
    rng = np.random.default_rng(11)
    fine = _blur(rng.random((H, W)), 1)
    coarse = _smooth_noise(rng, 90, 160)
    g = np.clip((fine - 0.33) / 0.28, 0, 1) * (0.75 + 0.25 * coarse)
    return (0.5 + 0.5 * g).astype(np.float32)


def _path(ctx, pts):
    ctx.move_to(*pts[0])
    for p in pts[1:]:
        ctx.line_to(*p)


def _partial(pts: np.ndarray, frac_: float) -> np.ndarray:
    seg = np.hypot(*np.diff(pts, axis=0).T)
    cum = np.concatenate([[0], np.cumsum(seg)])
    target = cum[-1] * frac_
    k = int(np.searchsorted(cum, target, side="right"))
    if k >= len(pts):
        return pts
    k = max(1, k)
    f = (target - cum[k - 1]) / max(seg[k - 1], 1e-9)
    return np.vstack([pts[:k], pts[k - 1] + f * (pts[k] - pts[k - 1])])


# ── Render ────────────────────────────────────────────────────────────────
ERASER = (120, 150)          # duster width, height
ERASE_ROWS = [110, 250, 390, 530, 640]


def _eraser_at(f: float) -> tuple[float, float]:
    """The duster's centre at fraction f of a wipe: across each row in turn."""
    n = len(ERASE_ROWS)
    i = min(n - 1, int(f * n))
    u = f * n - i
    left, right = FRAME + ERASER[0] / 2, W - FRAME - ERASER[0] / 2
    x = left + (right - left) * (u if i % 2 == 0 else 1 - u)
    return x, ERASE_ROWS[i]


def render(steps: list[Step], label: str, out: Path, until: float | None, thumbnail_step: int | None = None,
           thumbnail: list[Action] | None = None) -> dict:
    """Render the video to `out` (.mp4), with its captions (.vtt), a thumbnail
    (.jpg) and its timing (.json) beside it. Returns the timing."""
    voice = Voice()
    tl = schedule(steps, voice)
    timed, clips, captions, total = tl.timed, tl.clips, tl.captions, tl.total
    if until:
        total = min(total, until)
    # The thumbnail: the board at its fullest, just before it is first wiped
    # (or at the end of the step the lesson names).
    if thumbnail_step is None:
        wipes = [i for i, s in enumerate(steps) if any(a.erase for a in s.actions)]
        thumbnail_step = (wipes[0] - 1) if wipes and wipes[0] > 0 else len(steps) - 1
    thumb_t = min(total - 0.1, tl.step_ends[thumbnail_step] + 0.3)
    thumb_frame = int(thumb_t * FPS)

    # sound
    audio = np.zeros(int(total * RATE) + RATE, np.float32)
    for t0, clip in clips:
        i = int(t0 * RATE)
        if i < len(audio):
            n = min(len(clip), len(audio) - i)
            audio[i:i + n] += clip[:n]
    audio = audio[: int(total * RATE)]
    wav = out.with_suffix(".wav")
    import soundfile
    soundfile.write(wav, audio, RATE)

    bg = board_background(label).astype(np.float32)
    grain = chalk_grain()[..., None]
    chalk = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    cctx = cairo.Context(chalk)
    cctx.set_line_cap(cairo.LINE_CAP_ROUND); cctx.set_line_join(cairo.LINE_JOIN_ROUND)
    cbuf = np.ndarray((H, W, 4), np.uint8, chalk.get_data())
    frame = cairo.ImageSurface(cairo.FORMAT_RGB24, W, H)
    fctx = cairo.Context(frame)
    fbuf = np.ndarray((H, W, 4), np.uint8, frame.get_data())

    enc = subprocess.Popen([
        "ffmpeg", "-v", "error", "-y",
        "-f", "rawvideo", "-pix_fmt", "bgr0", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        "-i", str(wav),
        # A keyframe every 6 s, so the stream can be cut into 6 s segments.
        "-c:v", "libx264", "-preset", "slow", "-tune", "animation", "-crf", "24", "-pix_fmt", "yuv420p",
        "-g", str(FPS * 6), "-keyint_min", str(FPS * 6), "-sc_threshold", "0",
        "-c:a", "aac", "-b:a", "64k", "-ac", "1", "-shortest", "-movflags", "+faststart", str(out),
    ], stdin=subprocess.PIPE)

    drawn = [0.0] * len(timed)   # how much of each stroke is on the board
    first_open = 0
    n_frames = int(total * FPS)
    for fi in range(n_frames):
        t = fi / FPS
        pen = None
        for k in range(first_open, len(timed)):
            ev = timed[k]
            if ev.t0 > t:
                break
            f = min(1.0, (t - ev.t0) / max(ev.t1 - ev.t0, 1e-6))
            if ev.erase:
                if f > drawn[k]:
                    # wipe every place the duster passed since the last frame,
                    # leaving a faint trace of the chalk, as a real duster does
                    n = 2 + int((f - drawn[k]) * len(ERASE_ROWS) * W / 20)
                    for u in np.linspace(drawn[k], f, n):
                        ex, ey = _eraser_at(u)
                        cctx.rectangle(ex - ERASER[0] / 2, ey - ERASER[1] / 2, ERASER[0], ERASER[1])
                    cctx.save()
                    cctx.set_operator(cairo.OPERATOR_DEST_OUT)
                    cctx.set_source_rgba(0, 0, 0, 0.96)
                    cctx.fill(); cctx.restore()
                    drawn[k] = f
                if f < 1:
                    pen = ("eraser", *_eraser_at(f))
            elif f > drawn[k]:
                st = ev.stroke
                piece = _partial(st.points, f)
                start = _partial(st.points, drawn[k])
                pts = np.vstack([start[-1:], piece[len(start) - 1:]]) if drawn[k] > 0 else piece
                if len(pts) >= 2:
                    _path(cctx, pts)
                    cctx.set_source_rgb(*CHALK[st.color]); cctx.set_line_width(st.width); cctx.stroke()
                elif len(pts) == 1:
                    cctx.arc(*pts[0], st.width / 2, 0, 2 * math.pi)
                    cctx.set_source_rgb(*CHALK[st.color]); cctx.fill()
                drawn[k] = f
                if f < 1:
                    pen = ("chalk", *piece[-1], st.color)
            if f >= 1 and k == first_open:
                first_open += 1
        # between strokes the hand moves on to the next one
        if pen is None and first_open < len(timed):
            nxt, prv = timed[first_open], timed[first_open - 1] if first_open else None
            if prv is not None and prv.stroke is not None and nxt.stroke is not None and nxt.t0 - prv.t1 < 0.6 and prv.t1 <= t:
                u = (t - prv.t1) / max(nxt.t0 - prv.t1, 1e-6)
                a, b = prv.stroke.points[-1], nxt.stroke.points[0]
                pen = ("chalk", *(a + u * (b - a)), nxt.stroke.color)
            elif prv is not None and prv.stroke is not None and t - prv.t1 < 0.3:
                pen = ("chalk", *prv.stroke.points[-1], prv.stroke.color)

        chalk.flush()
        c = cbuf.astype(np.float32) / 255.0
        alpha = c[..., 3:4] * grain
        rgb = bg * (1 - alpha) + c[..., 2::-1] * grain
        fbuf[..., 2::-1] = (np.clip(rgb, 0, 1) * 255).astype(np.uint8)
        frame.mark_dirty()
        if pen:
            _draw_pen(fctx, pen)
            frame.flush()
        enc.stdin.write(fbuf.tobytes())
        if fi == thumb_frame and not thumbnail:
            _save_jpeg(fbuf, out.with_suffix(".jpg"))
        if fi % (FPS * 10) == 0:
            print(f"  {t:5.1f}s / {total:.1f}s", flush=True)
    enc.stdin.close()
    if enc.wait():
        raise SystemExit("ffmpeg failed")
    wav.unlink()
    if thumbnail:
        # A designed thumbnail: what a student sees in search results, before anything else.
        still([st for a in thumbnail for st in a.strokes], label, out.with_suffix(".jpg"), bg, grain)
    cues = _write_vtt(captions, out.with_suffix(".vtt"), total)
    timing = {
        "duration": round(total, 2),
        "chapters": [{"name": name, "start": start} for start, name in tl.chapters if start < total],
        "transcript": [{"start": round(a, 2), "end": round(b, 2), "text": text} for a, b, text in cues],
        "thumbnail_at": round(thumb_t, 2),
    }
    out.with_suffix(".json").write_text(json.dumps(timing, indent=1, ensure_ascii=False) + "\n")
    print(f"{out}: {total:.1f} s, {out.stat().st_size / 1e6:.2f} MB")
    return timing


def _save_jpeg(bgr0: np.ndarray, path: Path):
    """One frame (cairo's BGRx bytes) as a JPEG, for the video's thumbnail."""
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr0", "-s", f"{W}x{H}", "-i", "-",
                    "-frames:v", "1", "-q:v", "3", str(path)], input=bgr0.tobytes(), check=True)


def _draw_pen(ctx, pen):
    if pen[0] == "eraser":
        _, x, y = pen
        w, h = ERASER
        ctx.set_source_rgba(0, 0, 0, 0.28); ctx.rectangle(x - w / 2 + 6, y - h / 2 + 8, w, h); ctx.fill()
        ctx.set_source_rgb(0.30, 0.30, 0.32); ctx.rectangle(x - w / 2, y - h / 2, w, h); ctx.fill()
        ctx.set_source_rgb(0.55, 0.38, 0.22); ctx.rectangle(x - w / 2 + 10, y - h / 2 + 10, w - 20, h - 20); ctx.fill()
        ctx.set_source_rgb(0.64, 0.46, 0.28); ctx.rectangle(x - w / 2 + 10, y - h / 2 + 10, w - 20, 10); ctx.fill()
        return
    _, x, y, color = pen
    a = math.radians(38)
    L, wd = 46, 11
    ex, ey = x + L * math.cos(a), y + L * math.sin(a)
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.set_source_rgba(0, 0, 0, 0.3); ctx.set_line_width(wd)
    ctx.move_to(x + 5, y + 7); ctx.line_to(ex + 5, ey + 7); ctx.stroke()
    r, g, b = CHALK[color]
    ctx.set_source_rgb(r * 0.82, g * 0.82, b * 0.82); ctx.set_line_width(wd)
    ctx.move_to(x + 2, y + 2); ctx.line_to(ex, ey); ctx.stroke()
    ctx.set_source_rgb(r, g, b); ctx.set_line_width(wd - 4)
    ctx.move_to(x + 2, y + 1); ctx.line_to(ex - 1, ey - 2); ctx.stroke()


def _write_vtt(captions, path: Path, total: float):
    def ts(s):
        return f"{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{s % 60:06.3f}"
    lines, cues = ["WEBVTT", ""], []
    for t0, t1, text in captions:
        if t0 >= total:
            break
        parts = [p for p in re.split(r"(?<=[.!?])\s+", text) if p]
        n = sum(len(p) for p in parts)
        a = t0
        for p in parts:
            b = a + (t1 - t0) * len(p) / n
            lines += [f"{ts(a)} --> {ts(min(b, total))}", p, ""]
            cues.append((a, min(b, total), p))
            a = b
    path.write_text("\n".join(lines))
    return cues


def load(path: Path):
    spec = importlib.util.spec_from_file_location("lesson", path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules["board_video"] = sys.modules[__name__]
    spec.loader.exec_module(mod)
    for name in ("TITLE", "DESCRIPTION", "LABEL", "STEPS"):
        if not getattr(mod, name, None):
            raise SystemExit(f"{path}: {name} is missing")
    if len(mod.DESCRIPTION) > 300:
        raise SystemExit(f"{path}: DESCRIPTION is {len(mod.DESCRIPTION)} characters; keep it under 300")
    return mod


def lesson_steps(mod) -> list[Step]:
    return list(mod.STEPS) + (outro() if getattr(mod, "OUTRO", True) else [])


def revision(path: Path) -> str:
    """What a video is made from: its script, the renderer's VERSION and the
    voice. A video is rebuilt and republished when this changes."""
    h = hashlib.sha256(f"{VERSION}|{VOICE}|{SPEED}|".encode() + path.read_bytes())
    return h.hexdigest()[:12]


def still(strokes: list[Stroke], label: str, path: Path, bg: np.ndarray | None = None, grain: np.ndarray | None = None):
    """Strokes drawn whole on the board, saved as a JPEG: a board preview or a designed thumbnail."""
    bg = board_background(label).astype(np.float32) if bg is None else bg
    grain = chalk_grain()[..., None] if grain is None else grain
    chalk = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(chalk)
    ctx.set_line_cap(cairo.LINE_CAP_ROUND); ctx.set_line_join(cairo.LINE_JOIN_ROUND)
    for st in strokes:
        _path(ctx, st.points)
        ctx.set_source_rgb(*CHALK[st.color]); ctx.set_line_width(st.width); ctx.stroke()
    chalk.flush()
    c = np.ndarray((H, W, 4), np.uint8, chalk.get_data()).astype(np.float32) / 255.0
    rgb = bg * (1 - c[..., 3:4] * grain) + c[..., 2::-1] * grain
    img = (np.clip(rgb, 0, 1) * 255).astype(np.uint8)
    _save_jpeg(np.ascontiguousarray(np.dstack([img[..., ::-1], np.zeros((H, W), np.uint8)])), path)


def boards(steps: list[Step], label: str, out_dir: Path, thumbnail: list[Action] | None = None):
    """Each finished board (everything written before each wipe) as a PNG: a
    layout check in seconds, with no voice and no video."""
    out_dir.mkdir(parents=True, exist_ok=True)
    bg = board_background(label).astype(np.float32)
    grain = chalk_grain()[..., None]
    groups, cur = [], []
    for st in steps:
        if any(a.erase for a in st.actions) and cur:
            groups.append(cur); cur = []
        cur += [s for a in st.actions for s in a.strokes]
    if cur:
        groups.append(cur)
    for n, strokes in enumerate(groups, 1):
        still(strokes, label, out_dir / f"board-{n}.jpg", bg, grain)
    if thumbnail:
        still([st for a in thumbnail for st in a.strokes], label, out_dir / "thumbnail.jpg", bg, grain)
    print(f"{len(groups)} boards in {out_dir}" + (", and the thumbnail" if thumbnail else ""))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("lesson", type=Path)
    ap.add_argument("--out", type=Path)
    ap.add_argument("--until", type=float, help="render only the first N seconds")
    ap.add_argument("--boards", type=Path, help="only draw each finished board into this folder (no voice, no video)")
    args = ap.parse_args()
    lesson = load(args.lesson)
    if args.boards:
        return boards(lesson_steps(lesson), lesson.LABEL, args.boards, getattr(lesson, "THUMBNAIL", None))
    # Never into public/: a plain video file must not be served or committed.
    out = args.out or ROOT / ".video-build" / args.lesson.stem / "preview-render.mp4"
    out.parent.mkdir(parents=True, exist_ok=True)
    render(lesson_steps(lesson), lesson.LABEL, out, args.until, getattr(lesson, "THUMBNAIL_STEP", None),
           getattr(lesson, "THUMBNAIL", None))


if __name__ == "__main__":
    main()
