#!/usr/bin/env python3
"""Original diagrams for the Chemistry notes.

    python3 scripts/notes/chemistry_figs.py            # write every diagram
    python3 scripts/notes/chemistry_figs.py name ...   # write some

Each function draws one figure and returns an Svg. Files go to
public/img/chemistry/<name>.svg and lessons show them from
https://wasscetutor.com/img/chemistry/<name>.svg. All drawn by WASSCE Tutor.

Formulas are written in a small markup that `chem()` turns into real
subscripts and superscripts: "H_2O", "SO_4^{2-}", "Na^+", "^{35}_{17}Cl".
"""

from __future__ import annotations

import math
import re
import sys
from html import escape
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from economics_figs import Plot  # noqa: E402
from svgfig import (  # noqa: E402
    BG, BLUE, F_AMBER, F_BLUE, F_GREEN, F_GREY, F_PURPLE, F_RED, GLASS, GREEN, INK, METAL, MUTED,
    ORANGE, PURPLE, RED, TEAL, WATER, Svg, _c,
)

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/img/chemistry"
FIGS: dict[str, callable] = {}
F_TEAL = "#ccfbf1"
FLAME = "#f97316"


def fig(fn):
    FIGS[fn.__name__.replace("_", "-")] = fn
    return fn


def title(s: Svg, t, y=34, size=18):
    s.text(s.w / 2, y, t, size=size, color=MUTED)


# ── formulas ─────────────────────────────────────────────────────────────────

_TOKEN = re.compile(r"_\{([^}]*)\}|_(\d+)|\^\{([^}]*)\}|\^([+\-−]|\d+[+\-−]?)|([^_^]+)")


def chem(s: Svg, x, y, t, size=18, color=INK, anchor="middle", weight="normal"):
    """Text with chemical subscripts and superscripts, positioned with dy so it
    renders the same in every browser."""
    parts, shift = [], 0.0
    small = round(size * 0.7, 1)
    for m in _TOKEN.finditer(t):
        sub = m.group(1) or m.group(2)
        sup = m.group(3) or m.group(4)
        plain = m.group(5)
        if plain is not None:
            parts.append(f'<tspan dy="{-shift:.1f}">{escape(plain)}</tspan>' if shift else escape(plain))
            shift = 0.0
        else:
            target = size * 0.32 if sub is not None else -size * 0.42
            parts.append(f'<tspan dy="{target - shift:.1f}" font-size="{small}">{escape(sub if sub is not None else sup)}</tspan>')
            shift = target
    if shift:
        parts.append(f'<tspan dy="{-shift:.1f}"></tspan>')
    s.raw(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{_c(color)}" text-anchor="{anchor}" '
          f'dominant-baseline="middle" font-weight="{weight}">{"".join(parts)}</text>')


def nuclide(s: Svg, x, y, mass, z, sym, size=34, color=INK):
    """Nuclide notation with mass number above atomic number, both left of the symbol at x."""
    small = size * 0.55
    s.text(x - 3, y - size * 0.42, str(mass), size=small, color=color, anchor="end", weight="bold")
    s.text(x - 3, y + size * 0.42, str(z), size=small, color=color, anchor="end", weight="bold")
    s.text(x, y, sym, size=size, color=color, anchor="start", weight="bold")


def box(s: Svg, cx, cy, w, h, lines, col=INK, fill=F_GREY, size=16, bold_first=True, rx=12):
    if isinstance(lines, str):
        lines = [lines]
    s.rect(cx - w / 2, cy - h / 2, w, h, fill=fill, stroke=col, width=2.5, rx=rx)
    n = len(lines)
    for i, ln in enumerate(lines):
        y = cy + (i - (n - 1) / 2) * (size + 6)
        chem(s, cx, y, ln, size=size if (i == 0 or not bold_first) else size - 2,
             weight="bold" if (i == 0 and bold_first) else "normal", color=col if i == 0 else INK)
    return (cx, cy, w, h)


def link(s: Svg, a, b, color=MUTED, width=2.5, gap=6):
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    dx, dy = bx - ax, by - ay
    if abs(dx) * ah > abs(dy) * aw:
        sx, sy = ax + math.copysign(aw / 2 + gap, dx), ay
        ex, ey = bx - math.copysign(bw / 2 + gap, dx), by
    else:
        sx, sy = ax, ay + math.copysign(ah / 2 + gap, dy)
        ex, ey = bx, by - math.copysign(bh / 2 + gap, dy)
    s.arrow(sx, sy, ex, ey, color=color, width=width)


# ── apparatus ────────────────────────────────────────────────────────────────

def beaker(s: Svg, x, ybot, w, h, frac=0.5, liquid=WATER, label=None):
    """Beaker standing on ybot, left edge x."""
    if frac:
        s.rect(x + 2, ybot - h * frac, w - 4, h * frac - 2, fill=liquid, stroke="none", width=0)
    s.path(f"M {x - 6} {ybot - h} L {x} {ybot - h + 6} L {x} {ybot} L {x + w} {ybot} L {x + w} {ybot - h}",
           color=INK, width=2.5)
    if label:
        s.text(x + w / 2, ybot + 20, label, size=14, color=MUTED)


def conical(s: Svg, cx, ybot, w, h, frac=0.35, liquid=WATER):
    """Conical flask with its base centred on cx at ybot. Returns the top of the neck."""
    nw, nh = w * 0.26, h * 0.32
    top = ybot - h
    shoulder = top + nh
    if frac:
        yl = ybot - (h - nh) * frac
        k = (yl - shoulder) / (ybot - shoulder)
        half = nw / 2 + (w / 2 - nw / 2) * k
        s.polygon([(cx - half, yl), (cx + half, yl), (cx + w / 2 - 2, ybot - 2), (cx - w / 2 + 2, ybot - 2)],
                  fill=liquid, stroke="none", width=0)
    s.path(f"M {cx - nw / 2} {top} L {cx - nw / 2} {shoulder} L {cx - w / 2} {ybot} L {cx + w / 2} {ybot} "
           f"L {cx + nw / 2} {shoulder} L {cx + nw / 2} {top}", color=INK, width=2.5)
    return (cx, top)


def round_flask(s: Svg, cx, cy, r, neck=40, frac=0.45, liquid=WATER):
    """Round-bottomed flask; returns the top of the neck."""
    nw = r * 0.42
    if frac:
        yl = cy + r - 2 * r * frac
        half = math.sqrt(max(r * r - (yl - cy) ** 2, 0))
        large = 1 if yl < cy else 0
        s.path(f"M {cx - half:.1f} {yl:.1f} A {r - 2} {r - 2} 0 {large} 0 {cx + half:.1f} {yl:.1f} Z",
               color="none", width=0, fill=liquid)
    a = math.degrees(math.asin(nw / 2 / r))
    x1 = cx - nw / 2
    y1 = cy - r * math.cos(math.radians(a))
    s.path(f"M {x1:.1f} {y1 - neck:.1f} L {x1:.1f} {y1:.1f} A {r} {r} 0 1 0 {cx + nw / 2:.1f} {y1:.1f} "
           f"L {cx + nw / 2:.1f} {y1 - neck:.1f}", color=INK, width=2.5)
    return (cx, y1 - neck)


def burner(s: Svg, x, ybot, flame=True):
    """Bunsen burner centred on x, standing on ybot."""
    s.rect(x - 28, ybot - 10, 56, 10, fill=METAL, stroke=INK, width=2, rx=3)
    s.rect(x - 8, ybot - 70, 16, 60, fill=METAL, stroke=INK, width=2)
    if flame:
        s.path(f"M {x} {ybot - 112} C {x + 16} {ybot - 92}, {x + 12} {ybot - 74}, {x} {ybot - 72} "
               f"C {x - 12} {ybot - 74}, {x - 16} {ybot - 92}, {x} {ybot - 112} Z", color=FLAME, width=2, fill="#fed7aa")
        s.path(f"M {x} {ybot - 96} C {x + 7} {ybot - 86}, {x + 5} {ybot - 76}, {x} {ybot - 74} "
               f"C {x - 5} {ybot - 76}, {x - 7} {ybot - 86}, {x} {ybot - 96} Z", color=BLUE, width=1.5, fill=F_BLUE)


def tripod(s: Svg, x, ytop, ybot, w=90):
    s.line(x - w / 2, ytop, x + w / 2, ytop, color=INK, width=4)
    s.line(x - w / 2 + 8, ytop, x - w / 2 - 6, ybot, color=INK, width=2.5)
    s.line(x + w / 2 - 8, ytop, x + w / 2 + 6, ybot, color=INK, width=2.5)


def thermometer(s: Svg, x, ytop, ybot):
    s.rect(x - 4, ytop, 8, ybot - ytop, fill="#ffffff", stroke=INK, width=1.8, rx=4)
    s.circle(x, ybot, 6, fill=RED, stroke=INK, width=1.8)
    s.line(x, ybot - 6, x, ytop + (ybot - ytop) * 0.45, color=RED, width=3)


def test_tube(s: Svg, x, ytop, w, h, frac=0.3, liquid=WATER):
    r = w / 2
    if frac:
        yl = ytop + h - h * frac
        s.path(f"M {x + 2} {yl} L {x + 2} {ytop + h - r} A {r - 2} {r - 2} 0 0 0 {x + w - 2} {ytop + h - r} "
               f"L {x + w - 2} {yl} Z", color="none", width=0, fill=liquid)
    s.path(f"M {x} {ytop} L {x} {ytop + h - r} A {r} {r} 0 0 0 {x + w} {ytop + h - r} L {x + w} {ytop}",
           color=INK, width=2.5)


def ground(s: Svg, x0, x1, y):
    s.line(x0, y, x1, y, color=MUTED, width=2)


# ── atoms and bonding ────────────────────────────────────────────────────────

def electrons(s: Svg, cx, cy, r, angles, kind="dot", color=INK, size=6):
    for a in angles:
        x, y = cx + r * math.cos(math.radians(a)), cy - r * math.sin(math.radians(a))
        if kind == "dot":
            s.circle(x, y, size * 0.75, fill=color, stroke=color, width=1)
        else:
            d = size * 0.8
            s.line(x - d, y - d, x + d, y + d, color=color, width=2.4)
            s.line(x - d, y + d, x + d, y - d, color=color, width=2.4)


def spread(n, start=90):
    """n angles spread evenly round a circle, paired like a Lewis diagram when n <= 8."""
    if n <= 0:
        return []
    if n > 8:
        return [start + i * 360 / n for i in range(n)]
    base = [90, 0, 270, 180]
    out = []
    for i in range(n):
        side = base[i % 4]
        out.append(side + (-12 if i >= 4 else (12 if n > 4 or i >= 4 else 0)))
    # pair electrons on each side once more than four are present
    if n > 4:
        out = []
        for i in range(n):
            side = base[i % 4]
            out.append(side + (12 if i < 4 else -12))
    return out


def atom_shells(s: Svg, cx, cy, symbol, shells, r0=34, dr=24, kind="dot", color=INK, nucleus=F_AMBER):
    """A Bohr-style atom: nucleus with symbol, shells holding the given electron counts."""
    s.circle(cx, cy, 20, fill=nucleus, stroke=INK, width=2)
    chem(s, cx, cy + 1, symbol, size=16, weight="bold")
    for i, n in enumerate(shells):
        r = r0 + i * dr
        s.circle(cx, cy, r, stroke=MUTED, width=1.6)
        electrons(s, cx, cy, r, [90 + k * 360 / n for k in range(n)] if n > 0 else [], kind=kind, color=color)


# ═══ Group 1: foundations and atomic theory ══════════════════════════════════

@fig
def branches_of_chemistry():
    s = Svg(780, 470, "The main branches of chemistry",
            "Chemistry divides into physical, inorganic, organic and analytical chemistry, with applied branches such as "
            "biochemistry, industrial, environmental and agricultural chemistry.")
    root = box(s, 390, 60, 220, 52, "Chemistry", BLUE, F_BLUE, size=20)
    core = [("Physical", "energy, rates, equilibrium", PURPLE, F_PURPLE), ("Inorganic", "elements other than carbon", GREEN, F_GREEN),
            ("Organic", "carbon compounds", ORANGE, F_AMBER), ("Analytical", "what and how much", TEAL, F_TEAL)]
    xs = [102, 294, 486, 678]
    for x, (a, b, col, fill) in zip(xs, core):
        bx = box(s, x, 170, 178, 66, [a, b], col, fill, size=17)
        link(s, root, bx, color=MUTED)
    s.text(390, 262, "applied branches", size=16, color=MUTED, italic=True)
    applied = [("Biochemistry", "chemistry of living things"), ("Industrial", "large-scale production"),
               ("Environmental", "air, water and soil"), ("Agricultural", "soils and fertilisers")]
    for x, (a, b) in zip(xs, applied):
        box(s, x, 330, 178, 66, [a, b], INK, "#ffffff", size=16)
    s.line(60, 285, 720, 285, color=MUTED, width=1.5, dash="5 5")
    s.text(390, 420, "branches overlap: a soap maker uses organic, physical and analytical chemistry", size=15,
           color=MUTED, italic=True)
    return s


@fig
def lab_apparatus():
    s = Svg(800, 500, "Common laboratory apparatus",
            "Nine common pieces of apparatus: beaker, conical flask, round-bottomed flask, test tube, measuring cylinder, "
            "burette, pipette, filter funnel and Bunsen burner.")
    y = 300
    beaker(s, 40, y, 90, 100, 0.45)
    s.text(85, y + 26, "beaker", size=15)
    conical(s, 210, y, 100, 120, 0.4)
    s.text(210, y + 26, "conical flask", size=15)
    round_flask(s, 350, y - 46, 46, neck=40, frac=0.4)
    s.text(350, y + 26, "round-bottomed", size=15)
    s.text(350, y + 44, "flask", size=15)
    test_tube(s, 444, y - 130, 26, 130, 0.3)
    s.text(457, y + 26, "test tube", size=15)
    # measuring cylinder
    s.rect(522, y - 170, 32, 170, fill="#ffffff", stroke=INK, width=2.5)
    s.rect(524, y - 70, 28, 68, fill=WATER, stroke="none", width=0)
    for k in range(1, 8):
        s.line(522, y - k * 20, 532, y - k * 20, color=INK, width=1.5)
    s.line(512, y, 564, y, color=INK, width=4)
    s.text(538, y + 26, "measuring", size=15)
    s.text(538, y + 44, "cylinder", size=15)
    # burette
    s.rect(608, y - 250, 18, 200, fill="#ffffff", stroke=INK, width=2.5)
    s.rect(610, y - 190, 14, 138, fill=WATER, stroke="none", width=0)
    for k in range(1, 10):
        s.line(608, y - 250 + k * 20, 616, y - 250 + k * 20, color=INK, width=1.4)
    s.path(f"M 608 {y - 50} L 614 {y - 30} L 614 {y - 10} M 626 {y - 50} L 620 {y - 30} L 620 {y - 10}", color=INK, width=2.5)
    s.rect(606, y - 38, 22, 8, fill=METAL, stroke=INK, width=1.5)
    s.text(617, y + 26, "burette", size=15)
    # pipette
    s.path(f"M 690 {y - 260} L 690 {y - 170} C 670 {y - 160}, 670 {y - 110}, 690 {y - 100} L 690 {y - 20} L 694 {y} "
           f"L 698 {y - 20} L 698 {y - 100} C 718 {y - 110}, 718 {y - 160}, 698 {y - 170} L 698 {y - 260}",
           color=INK, width=2.5)
    s.line(686, y - 220, 702, y - 220, color=RED, width=2)
    s.text(694, y + 26, "pipette", size=15)
    # funnel
    s.path(f"M 730 {y - 150} L 790 {y - 150} L 766 {y - 100} L 766 {y - 40} L 754 {y - 40} L 754 {y - 100} Z",
           color=INK, width=2.5, fill="#ffffff")
    s.text(760, y + 26, "funnel", size=15)
    burner(s, 100, 480)
    s.text(160, 440, "Bunsen burner: heats with a blue (non-luminous) flame", size=15, anchor="start")
    title(s, "Know each item's name and use", y=30)
    return s


@fig
def particles_elements_compounds():
    s = Svg(780, 340, "Particles in elements, compounds and mixtures",
            "An element contains one kind of atom; a compound contains atoms of different elements chemically joined in a "
            "fixed ratio; a mixture contains different substances not chemically joined, in any proportion.")
    panels = [(140, "Element", "one kind of atom"), (390, "Compound", "atoms joined in a fixed ratio"),
              (640, "Mixture", "substances not joined")]
    for x, a, b in panels:
        s.rect(x - 115, 60, 230, 200, fill="#ffffff", stroke=MUTED, width=2, rx=12)
        s.text(x, 286, a, size=18, weight="bold")
        s.text(x, 310, b, size=15, color=MUTED)
    import random
    rnd = random.Random(4)
    for i in range(12):
        x, y = 50 + (i % 4) * 58 + rnd.uniform(-6, 6), 95 + (i // 4) * 55 + rnd.uniform(-6, 6)
        s.circle(x, y, 15, fill=F_BLUE, stroke=BLUE, width=2)
    for i in range(6):
        x, y = 310 + (i % 3) * 78 + rnd.uniform(-5, 5), 110 + (i // 3) * 80 + rnd.uniform(-5, 5)
        s.circle(x, y, 17, fill=F_RED, stroke=RED, width=2)
        s.circle(x - 16, y + 18, 10, fill="#ffffff", stroke=INK, width=2)
        s.circle(x + 16, y + 18, 10, fill="#ffffff", stroke=INK, width=2)
    for i in range(5):
        x, y = 560 + (i % 3) * 70 + rnd.uniform(-5, 5), 105 + (i // 3) * 85
        s.circle(x, y, 15, fill=F_BLUE, stroke=BLUE, width=2)
    for i in range(3):
        x, y = 590 + i * 55, 200 + (i % 2) * 30
        s.circle(x, y, 13, fill=F_GREEN, stroke=GREEN, width=2)
        s.circle(x + 22, y, 13, fill=F_GREEN, stroke=GREEN, width=2)
    title(s, "e.g. iron; water (H₂O); air or salt solution", y=34, size=16)
    return s


@fig
def distillation():
    s = Svg(800, 430, "Simple distillation",
            "Salt solution is heated in a flask. The water boils, the vapour passes the thermometer at the side arm, is cooled "
            "in a Liebig condenser by cold water flowing in at the bottom and out at the top, and drips into a beaker as the "
            "distillate. The salt stays behind in the flask.")
    fx, fy = 160, 250
    top = round_flask(s, fx, fy, 62, neck=60, frac=0.45)
    tripod(s, fx, fy + 66, 400, w=120)
    burner(s, fx, 400)
    thermometer(s, fx, top[1] - 60, top[1] + 30)
    s.rect(fx - 16, top[1] - 4, 32, 10, fill=METAL, stroke=INK, width=1.5)
    # side arm and condenser
    ax, ay = fx + 13, top[1] + 22
    cx1, cy1, cx2, cy2 = 260, 150, 560, 270
    s.line(ax, ay, cx1, cy1 + 6, color=INK, width=2.5)
    ang = math.atan2(cy2 - cy1, cx2 - cx1)
    nx, ny = -math.sin(ang), math.cos(ang)
    jw = 18
    s.polygon([(cx1 + nx * jw, cy1 + ny * jw), (cx2 + nx * jw, cy2 + ny * jw), (cx2 - nx * jw, cy2 - ny * jw),
               (cx1 - nx * jw, cy1 - ny * jw)], fill=WATER, stroke=INK, width=2.5)
    s.line(cx1 - 20 * math.cos(ang), cy1 - 20 * math.sin(ang), cx2 + 50 * math.cos(ang), cy2 + 50 * math.sin(ang),
           color=INK, width=5)
    s.line(cx1 - 20 * math.cos(ang), cy1 - 20 * math.sin(ang), cx2 + 50 * math.cos(ang), cy2 + 50 * math.sin(ang),
           color=GLASS, width=2)
    wx_in, wy_in = cx2 - 40 * math.cos(ang) - nx * jw, cy2 - 40 * math.sin(ang) - ny * jw
    s.arrow(wx_in + 40, wy_in + 50, wx_in, wy_in + 4, color=BLUE, width=3)
    s.text(wx_in + 46, wy_in + 66, "cold water in", size=15, color=BLUE, anchor="start")
    wx_out, wy_out = cx1 + 40 * math.cos(ang) + nx * jw, cy1 + 40 * math.sin(ang) + ny * jw
    s.arrow(wx_out, wy_out - 4, wx_out + 30, wy_out - 50, color=BLUE, width=3)
    s.text(wx_out + 34, wy_out - 60, "water out", size=15, color=BLUE, anchor="start")
    s.text(420, 160, "Liebig condenser", size=16, weight="bold", color=TEAL)
    beaker(s, 600, 400, 100, 90, 0.3)
    s.text(650, 418, "distillate (pure water)", size=15, color=MUTED)
    s.text(fx, 420, "heat", size=15, color=ORANGE, weight="bold")
    s.text(40, 215, "salt", size=15, color=MUTED, anchor="start")
    s.text(40, 233, "solution", size=15, color=MUTED, anchor="start")
    s.text(fx + 26, top[1] - 50, "thermometer bulb at the side arm", size=14, color=RED, anchor="start")
    return s


@fig
def chromatography():
    s = Svg(780, 420, "Paper chromatography",
            "Spots of a pure dye A and of an ink are placed on a pencil base line above the solvent. The solvent rises and "
            "separates the ink into two dyes; one has travelled as far as dye A, so the ink contains dye A. "
            "Rf = distance moved by the spot ÷ distance moved by the solvent front.")
    # tank
    s.rect(60, 70, 260, 300, fill="#ffffff", stroke=INK, width=2.5, rx=6)
    s.rect(62, 320, 256, 48, fill=WATER, stroke="none", width=0)
    s.rect(110, 60, 160, 290, fill="#fffbeb", stroke=MUTED, width=2)
    s.line(110, 300, 270, 300, color=INK, width=1.5, dash="4 4")
    s.text(290, 300, "base line (pencil)", size=14, color=MUTED, anchor="start")
    s.line(110, 110, 270, 110, color=BLUE, width=1.5, dash="4 4")
    s.text(290, 110, "solvent front", size=14, color=BLUE, anchor="start")
    s.text(190, 352, "solvent", size=14, color=BLUE)
    for x in (160, 220):
        s.line(x - 5, 300, x + 5, 300, color=INK, width=2)
    s.circle(160, 170, 9, fill=BLUE, stroke=BLUE, width=1)
    s.circle(220, 170, 9, fill=BLUE, stroke=BLUE, width=1)
    s.circle(220, 240, 9, fill=RED, stroke=RED, width=1)
    s.text(160, 318, "dye A", size=13)
    s.text(220, 318, "ink", size=13)
    # Rf panel
    x0 = 470
    s.text(x0 + 130, 90, "Working out Rf", size=18, weight="bold")
    s.line(x0 + 40, 330, x0 + 40, 110, color=INK, width=1.5)
    s.line(x0 + 30, 330, x0 + 250, 330, color=INK, width=1.5, dash="4 4")
    s.line(x0 + 30, 110, x0 + 250, 110, color=BLUE, width=1.5, dash="4 4")
    s.circle(x0 + 150, 170, 9, fill=BLUE, stroke=BLUE, width=1)
    s.circle(x0 + 200, 240, 9, fill=RED, stroke=RED, width=1)
    s.arrow(x0 + 100, 330, x0 + 100, 113, color=BLUE, width=2)
    s.text(x0 + 94, 222, "10 cm", size=14, color=BLUE, anchor="end")
    s.arrow(x0 + 170, 330, x0 + 170, 173, color=BLUE, width=2)
    s.text(x0 + 176, 300, "8 cm", size=14, color=BLUE, anchor="start")
    s.text(x0 + 130, 370, "Rf (blue) = 8 ÷ 10 = 0.8", size=16, weight="bold", color=BLUE)
    s.text(x0 + 130, 396, "Rf (red) = 5.5 ÷ 10 = 0.55", size=16, weight="bold", color=RED)
    s.arrow(x0 + 220, 330, x0 + 220, 243, color=RED, width=2)
    s.text(x0 + 226, 290, "5.5", size=14, color=RED, anchor="start")
    title(s, "The ink contains dye A and one other dye", y=30)
    return s


@fig
def separation_methods():
    s = Svg(800, 430, "Filtration, evaporation and the separating funnel",
            "Filtration separates an insoluble solid (residue) from a liquid (filtrate). Evaporation recovers a dissolved solid. "
            "A separating funnel separates two immiscible liquids, such as oil and water: the denser layer is run off first.")
    # filtration
    s.text(130, 40, "Filtration", size=17, weight="bold")
    s.path("M 70 70 L 190 70 L 145 140 L 145 190 L 115 190 L 115 140 Z", color=INK, width=2.5, fill="#ffffff")
    s.polygon([(78, 74), (182, 74), (130, 140)], fill="#fde68a", stroke=ORANGE, width=1.5)
    s.text(130, 92, "residue", size=13)
    beaker(s, 80, 330, 100, 100, 0.35)
    s.text(130, 352, "filtrate", size=14, color=MUTED)
    # evaporation
    s.text(400, 40, "Evaporation", size=17, weight="bold")
    s.path("M 330 220 Q 400 280 470 220", color=INK, width=2.5, fill=WATER)
    s.line(320, 222, 480, 222, color=INK, width=2)
    tripod(s, 400, 232, 330, w=110)
    burner(s, 400, 330)
    for i in range(3):
        x = 370 + i * 30
        s.path(f"M {x} 205 C {x - 8} 190, {x + 8} 180, {x} 165", color=MUTED, width=2, dash="4 4")
    s.text(400, 150, "water vapour", size=14, color=MUTED)
    s.text(400, 352, "solid left in dish", size=14, color=MUTED)
    # separating funnel
    s.text(660, 40, "Separating funnel", size=17, weight="bold")
    s.path("M 640 70 L 680 70 L 680 90 C 730 120, 730 230, 666 270 L 666 300 L 654 300 L 654 270 "
           "C 590 230, 590 120, 640 90 Z", color=INK, width=2.5, fill="#ffffff")
    s.path("M 612 150 C 612 200, 630 245, 657 268 L 663 268 C 690 245, 708 200, 708 150 Z", color="none", width=0, fill=WATER)
    s.path("M 618 110 L 702 110 L 708 150 L 612 150 Z", color="none", width=0, fill="#fde68a")
    s.text(660, 132, "oil (less dense)", size=13)
    s.text(660, 200, "water", size=13)
    s.rect(648, 280, 24, 8, fill=METAL, stroke=INK, width=1.5)
    s.text(690, 285, "tap", size=13, anchor="start")
    beaker(s, 615, 400, 90, 70, 0.25)
    return s


@fig
def atom_model():
    s = Svg(760, 400, "The structure of an atom",
            "A sodium atom has a tiny nucleus containing 11 protons and 12 neutrons, surrounded by 11 electrons in shells "
            "arranged 2, 8, 1.")
    cx, cy = 210, 210
    s.circle(cx, cy, 30, fill=F_AMBER, stroke=INK, width=2)
    import random
    rnd = random.Random(2)
    for i in range(10):
        a, r = rnd.uniform(0, 360), rnd.uniform(4, 20)
        x, y = cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a))
        s.circle(x, y, 6, fill=RED if i % 2 else "#94a3b8", stroke=INK, width=1)
    for i, n in enumerate([2, 8, 1]):
        r = 62 + i * 46
        s.circle(cx, cy, r, stroke=MUTED, width=1.6)
        electrons(s, cx, cy, r, [90 + k * 360 / n for k in range(n)], kind="dot", color=BLUE, size=8)
    s.text(cx, 30, "sodium atom (2, 8, 1)", size=17, weight="bold")
    x0 = 430
    rows = [("Particle", "Relative mass", "Charge", INK), ("proton", "1", "+1", RED), ("neutron", "1", "0", MUTED),
            ("electron", "1/1840", "−1", BLUE)]
    for i, (a, b, c, col) in enumerate(rows):
        y = 110 + i * 46
        w = "bold" if i == 0 else "normal"
        s.text(x0, y, a, size=17, weight=w, color=col, anchor="start")
        s.text(x0 + 150, y, b, size=17, weight=w, anchor="middle")
        s.text(x0 + 265, y, c, size=17, weight=w, anchor="middle")
    s.line(x0, 130, x0 + 300, 130, color=MUTED, width=1.5)
    s.circle(x0 + 8, 300, 7, fill=RED, stroke=INK, width=1)
    s.text(x0 + 24, 300, "proton", size=15, anchor="start")
    s.circle(x0 + 108, 300, 7, fill="#94a3b8", stroke=INK, width=1)
    s.text(x0 + 124, 300, "neutron", size=15, anchor="start")
    s.circle(x0 + 218, 300, 6, fill=BLUE, stroke=BLUE, width=1)
    s.text(x0 + 232, 300, "electron", size=15, anchor="start")
    s.text(x0 + 150, 350, "nucleus: protons + neutrons (nucleons)", size=15, color=MUTED)
    return s


@fig
def gold_foil():
    s = Svg(780, 380, "Rutherford's gold foil experiment",
            "Alpha particles fired at thin gold foil: most pass straight through, a few are deflected and a very few bounce "
            "back. So the atom is mostly empty space with a small, dense, positive nucleus.")
    s.rect(40, 160, 90, 60, fill=METAL, stroke=INK, width=2.5, rx=6)
    s.text(85, 240, "alpha source", size=15)
    s.rect(380, 70, 14, 240, fill="#fde047", stroke=ORANGE, width=2)
    s.text(387, 330, "thin gold foil", size=15)
    s.arc(387, 190, 250, -50, 50, color=GREEN, width=6)
    s.arc(387, 190, 250, 140, 220, color=GREEN, width=6)
    s.text(660, 46, "detecting screen", size=15, color=GREEN)
    for dy in (-30, -10, 10, 30):
        s.arrow(130, 190 + dy * 0.4, 625, 190 + dy * 1.2, color=BLUE, width=2.2)
    s.arrow(130, 186, 387, 176, color=RED, width=2.2)
    s.arrow(387, 176, 545, 60, color=RED, width=2.2)
    s.arrow(130, 194, 380, 200, color=PURPLE, width=2.2)
    s.arrow(380, 200, 170, 300, color=PURPLE, width=2.2)
    s.label(560, 215, "most pass straight through", size=14, color=BLUE)
    s.label(560, 110, "a few deflected", size=14, color=RED)
    s.label(250, 318, "very few bounce back", size=14, color=PURPLE)
    title(s, "Conclusion: a tiny, dense, positive nucleus", y=26)
    return s


@fig
def chlorine_isotopes():
    s = Svg(760, 400, "The isotopes of chlorine",
            "Chlorine-35 (17 protons, 18 neutrons) makes up 75% of natural chlorine and chlorine-37 (17 protons, 20 neutrons) "
            "makes up 25%. The relative atomic mass is (35 × 75 + 37 × 25) ÷ 100 = 35.5.")
    p = Plot(s, 110, 320, 300, 240, (33, 39), (0, 100))
    p.axes("mass number", "abundance (%)", xticks=[34, 35, 36, 37, 38], yticks=[0, 25, 50, 75, 100], zero=False)
    for m, a, col in [(35, 75, RED), (37, 25, BLUE)]:
        x0, y0 = p.P(m, 0)
        _, y1 = p.P(m, a)
        s.rect(x0 - 14, y1, 28, y0 - y1, fill=col, stroke=col, width=1, opacity=0.85)
        s.text(x0, y1 - 14, f"{a}%", size=15, weight="bold", color=col)
    nuclide(s, 585, 110, 35, 17, "Cl", color=RED)
    s.text(590, 150, "17 p, 18 n, 17 e", size=15, color=RED)
    nuclide(s, 585, 210, 37, 17, "Cl", color=BLUE)
    s.text(590, 250, "17 p, 20 n, 17 e", size=15, color=BLUE)
    s.text(590, 310, "RAM = (35×75 + 37×25) ÷ 100", size=16, weight="bold")
    s.text(590, 336, "= 35.5", size=18, weight="bold")
    title(s, "Same protons, different neutrons", y=30)
    return s


@fig
def radiation_deflection():
    s = Svg(760, 380, "Alpha, beta and gamma radiation in an electric field",
            "Between charged plates, alpha particles (positive) bend slightly towards the negative plate, beta particles "
            "(negative) bend more strongly towards the positive plate, and gamma rays (no charge) pass straight through.")
    s.rect(60, 165, 70, 50, fill=METAL, stroke=INK, width=2.5, rx=6)
    s.text(95, 235, "source", size=15)
    s.rect(240, 70, 300, 14, fill=F_RED, stroke=RED, width=2)
    s.text(390, 56, "+ + + + + + positive plate", size=15, color=RED)
    s.rect(240, 300, 300, 14, fill=F_BLUE, stroke=BLUE, width=2)
    s.text(390, 336, "− − − − − − negative plate", size=15, color=BLUE)
    s.path("M 130 190 L 240 190 Q 420 196 660 250", color=ORANGE, width=3, arrow="end")
    s.text(670, 262, "α (+)", size=17, weight="bold", color=ORANGE, anchor="start")
    s.path("M 130 190 L 240 190 Q 330 180 420 90", color=PURPLE, width=3, arrow="end")
    s.text(430, 108, "β (−)", size=17, weight="bold", color=PURPLE, anchor="start")
    s.arrow(130, 190, 670, 190, color=GREEN, width=3)
    s.text(680, 190, "γ (none)", size=17, weight="bold", color=GREEN, anchor="start")
    title(s, "Charge decides the direction of bending", y=26)
    return s


@fig
def half_life():
    s = Svg(720, 400, "Radioactive decay and half-life",
            "The mass of a radioactive sample halves every half-life: 80 g becomes 40 g after one half-life, 20 g after two, "
            "10 g after three and 5 g after four.")
    p = Plot(s, 90, 330, 540, 250, (0, 4.4), (0, 85))
    p.axes("time (half-lives)", "mass left (g)", xticks=[1, 2, 3, 4], yticks=[0, 20, 40, 60, 80], zero=False)
    p.fn(lambda t: 80 * 0.5 ** t, 0, 4.3, color=RED, width=3.5)
    for t, m in [(1, 40), (2, 20), (3, 10), (4, 5)]:
        p.guide(t, m)
        p.dot(t, m, color=RED)
        p.text(t, m, f"{m} g", dx=12, dy=-14, size=15, weight="bold", color=RED, anchor="start")
    p.dot(0, 80, color=RED)
    title(s, "Halving every half-life", y=30)
    return s


@fig
def orbital_shapes():
    s = Svg(760, 330, "Shapes of s and p orbitals",
            "An s orbital is spherical. There are three p orbitals, each dumbbell-shaped, pointing along the x, y and z axes at "
            "right angles to each other.")
    s.circle(120, 170, 70, fill=F_BLUE, stroke=BLUE, width=2.5)
    s.dot(120, 170, 4)
    s.text(120, 280, "s orbital: sphere", size=16, weight="bold")

    def lobe(cx, cy, ang, col, fill):
        a = math.radians(ang)
        for sgn in (1, -1):
            ex, ey = cx + sgn * 52 * math.cos(a), cy - sgn * 52 * math.sin(a)
            s.raw(f'<ellipse cx="{ex:.1f}" cy="{ey:.1f}" rx="48" ry="24" transform="rotate({-ang} {ex:.1f} {ey:.1f})" '
                  f'fill="{fill}" stroke="{col}" stroke-width="2.5"/>')
        s.dot(cx, cy, 4)

    for x, ang, lab, col, fill in [(320, 0, "p_x", RED, F_RED), (480, 90, "p_y", GREEN, F_GREEN), (640, 35, "p_z", PURPLE, F_PURPLE)]:
        lobe(x, 170, ang, col, fill)
        chem(s, x, 280, lab + " orbital", size=16, weight="bold", color=col)
    s.text(500, 40, "three p orbitals, at right angles to each other", size=16, color=MUTED)
    return s


@fig
def energy_levels():
    s = Svg(720, 470, "Order of filling orbitals (Aufbau principle)",
            "Sub-shells fill in order of increasing energy: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p. The 4s sub-shell is lower in energy "
            "than 3d, so it fills first.")
    levels = [("1s", 1, 430), ("2s", 1, 360), ("2p", 3, 340), ("3s", 1, 280), ("3p", 3, 260),
              ("4s", 1, 205), ("3d", 5, 185), ("4p", 3, 150)]
    xcol = {"s": 160, "p": 330, "d": 520}
    for name, n, y in levels:
        kind = name[1]
        x = xcol[kind]
        w = 34
        x0 = x - n * (w + 6) / 2
        for k in range(n):
            s.line(x0 + k * (w + 6), y, x0 + k * (w + 6) + w, y, color=INK, width=3)
        s.text(x0 - 12, y, name, size=17, weight="bold", anchor="end",
               color=RED if name in ("4s", "3d") else INK)
    s.arrow(60, 450, 60, 110, color=MUTED, width=2.5)
    s.text(60, 90, "energy", size=16, color=MUTED)
    s.text(470, 230, "4s fills before 3d", size=16, weight="bold", color=RED, anchor="start")
    s.text(380, 470 - 20, "order: 1s 2s 2p 3s 3p 4s 3d 4p", size=17, weight="bold")
    title(s, "Lowest energy sub-shell first", y=30)
    return s


@fig
def orbital_boxes():
    s = Svg(780, 340, "Electrons in orbital boxes",
            "Box diagrams for nitrogen, oxygen and iron. In nitrogen the three 2p electrons occupy separate boxes with parallel "
            "spins (Hund's rule). In oxygen one 2p box holds a pair. Iron is 1s2 2s2 2p6 3s2 3p6 3d6 4s2.")

    def boxes(x, y, n, elec, lab):
        w = 34
        for k in range(n):
            s.rect(x + k * w, y - 22, w, 44, fill="#ffffff", stroke=INK, width=2)
        for k, e in enumerate(elec):
            bx = x + k * w + w / 2
            if e >= 1:
                s.arrow(bx - 6, y + 14, bx - 6, y - 14, color=BLUE, width=2.4)
            if e == 2:
                s.arrow(bx + 6, y - 14, bx + 6, y + 14, color=RED, width=2.4)
        s.text(x + n * w / 2, y + 40, lab, size=14, color=MUTED)
        return x + n * w + 16

    for row, (name, conf, subs) in enumerate([
        ("N", "1s² 2s² 2p³", [(1, [2], "1s"), (1, [2], "2s"), (3, [1, 1, 1], "2p")]),
        ("O", "1s² 2s² 2p⁴", [(1, [2], "1s"), (1, [2], "2s"), (3, [2, 1, 1], "2p")]),
    ]):
        y = 90 + row * 110
        s.text(40, y, name, size=24, weight="bold", anchor="start")
        x = 90
        for n, e, lab in subs:
            x = boxes(x, y, n, e, lab)
        s.text(x + 20, y, conf, size=17, anchor="start")
    y = 300
    s.text(40, y - 10, "Fe", size=24, weight="bold", anchor="start")
    x = boxes(100, y - 10, 1, [2], "4s")
    boxes(x + 10, y - 10, 5, [2, 1, 1, 1, 1], "3d")
    s.text(470, y - 10, "[Ar] 3d⁶ 4s²", size=17, anchor="start")
    s.text(500, 140, "Hund: fill singly first", size=15, color=BLUE, anchor="start")
    s.text(500, 162, "Pauli: a pair has opposite spins", size=15, color=RED, anchor="start")
    return s


@fig
def periodic_table_blocks():
    s = Svg(800, 400, "The periodic table: groups, periods and blocks",
            "Outline of the periodic table showing the s-block (groups 1 and 2), the d-block (transition metals), and the "
            "p-block (groups 3 to 0), with the first 20 elements labelled.")
    cw, ch, x0, y0 = 38, 46, 70, 70
    syms = {(1, 1): "H", (1, 18): "He", (2, 1): "Li", (2, 2): "Be", (2, 13): "B", (2, 14): "C", (2, 15): "N", (2, 16): "O",
            (2, 17): "F", (2, 18): "Ne", (3, 1): "Na", (3, 2): "Mg", (3, 13): "Al", (3, 14): "Si", (3, 15): "P", (3, 16): "S",
            (3, 17): "Cl", (3, 18): "Ar", (4, 1): "K", (4, 2): "Ca", (4, 26 - 18): "Fe", (4, 29 - 18): "Cu", (4, 30 - 18): "Zn"}
    for period in range(1, 5):
        for g in range(1, 19):
            if period == 1 and g not in (1, 18):
                continue
            if period in (2, 3) and 3 <= g <= 12:
                continue
            if g <= 2 or (period == 1 and g == 1):
                fill, col = F_RED, RED
            elif g <= 12:
                fill, col = F_BLUE, BLUE
            else:
                fill, col = F_GREEN, GREEN
            if period == 1 and g == 18:
                fill, col = F_GREEN, GREEN
            x, y = x0 + (g - 1) * cw, y0 + (period - 1) * ch
            s.rect(x, y, cw - 3, ch - 3, fill=fill, stroke=col, width=1.5, rx=3)
            sym = syms.get((period, g))
            if sym:
                s.text(x + (cw - 3) / 2, y + (ch - 3) / 2, sym, size=15, weight="bold")
    for g, lab in [(1, "1"), (2, "2"), (13, "3"), (14, "4"), (15, "5"), (16, "6"), (17, "7"), (18, "0")]:
        s.text(x0 + (g - 1) * cw + 18, y0 - 14, lab, size=14, color=MUTED, weight="bold")
    for period in range(1, 5):
        s.text(x0 - 12, y0 + (period - 1) * ch + 22, str(period), size=14, color=MUTED, anchor="end")
    s.text(x0 - 10, y0 - 14, "period", size=12, color=MUTED, anchor="end")
    yl = y0 + 4 * ch + 30
    for x, fill, col, lab in [(40, F_RED, RED, "s-block: groups 1, 2"), (280, F_BLUE, BLUE, "d-block: transition metals"),
                              (560, F_GREEN, GREEN, "p-block: groups 3 to 0")]:
        s.rect(x, yl - 10, 22, 20, fill=fill, stroke=col, width=1.5, rx=3)
        s.text(x + 32, yl, lab, size=15, anchor="start")
    s.text(400, yl + 46, "group number = outer electrons; period number = number of shells", size=15, color=MUTED, italic=True)
    title(s, "Groups go down, periods go across", y=28)
    return s


@fig
def ionisation_energy():
    s = Svg(780, 420, "First ionisation energies of elements 1 to 20",
            "First ionisation energy against atomic number for hydrogen to calcium. Peaks occur at the noble gases helium, neon "
            "and argon; the lowest values are the alkali metals lithium, sodium and potassium.")
    ie = [1312, 2372, 520, 899, 801, 1086, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251, 1521, 419, 590]
    sym = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca".split()
    p = Plot(s, 90, 350, 620, 270, (0, 21), (0, 2500))
    p.axes("atomic number", "first ionisation energy (kJ/mol)", xticks=[2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
           yticks=[0, 500, 1000, 1500, 2000, 2500], zero=False)
    pts = [(i + 1, v) for i, v in enumerate(ie)]
    p.poly(pts, color=BLUE, width=2.5)
    for (z, v), sy in zip(pts, sym):
        hi = sy in ("He", "Ne", "Ar")
        lo = sy in ("Li", "Na", "K")
        p.dot(z, v, color=RED if hi else (GREEN if lo else BLUE), r=4.5)
        if hi or lo:
            p.text(z, v, sy, dy=-16 if hi else 18, size=15, weight="bold", color=RED if hi else GREEN)
    s.text(560, 120, "noble gases: peaks", size=15, color=RED, anchor="start", weight="bold")
    s.text(560, 142, "alkali metals: troughs", size=15, color=GREEN, anchor="start", weight="bold")
    return s


@fig
def ionic_bond():
    s = Svg(780, 330, "Ionic bonding in sodium chloride",
            "A sodium atom (2, 8, 1) transfers its outer electron to a chlorine atom (2, 8, 7). The sodium ion Na+ (2, 8) and "
            "chloride ion Cl− (2, 8, 8) are held together by electrostatic attraction.")
    eight = [90 + k * 45 for k in range(8)]
    atom_shells(s, 110, 170, "Na", [2, 8, 1], r0=30, dr=22, kind="dot", color=BLUE)
    s.text(110, 290, "Na (2, 8, 1)", size=15)
    atom_shells(s, 300, 170, "Cl", [2, 8], r0=30, dr=22, kind="cross", color=RED)
    s.circle(300, 170, 74, stroke=MUTED, width=1.6)
    electrons(s, 300, 170, 74, eight[:7], kind="cross", color=RED)
    s.circle(300 + 74 * math.cos(math.radians(eight[7])), 170 - 74 * math.sin(math.radians(eight[7])), 7,
             stroke=GREEN, width=1.5, dash="3 3")
    s.text(300, 290, "Cl (2, 8, 7)", size=15)
    gx, gy = 300 + 74 * math.cos(math.radians(eight[7])), 170 - 74 * math.sin(math.radians(eight[7]))
    s.path(f"M 110 92 C 150 30, 300 30, {gx - 4:.0f} {gy - 10:.0f}", color=GREEN, width=2.5, dash="6 5", arrow="end")
    s.text(200, 36, "electron transferred", size=14, color=GREEN)
    s.arrow(392, 170, 440, 170, color=INK, width=3)
    atom_shells(s, 530, 170, "Na", [2, 8], r0=30, dr=22, kind="dot", color=BLUE)
    chem(s, 590, 96, "+", size=26, weight="bold", color=BLUE)
    atom_shells(s, 690, 170, "Cl", [2, 8], r0=30, dr=22, kind="cross", color=RED)
    s.circle(690, 170, 74, stroke=MUTED, width=1.6)
    electrons(s, 690, 170, 74, eight[:7], kind="cross", color=RED)
    electrons(s, 690, 170, 74, eight[7:], kind="dot", color=BLUE, size=8)
    chem(s, 762, 96, "−", size=26, weight="bold", color=RED)
    chem(s, 530, 290, "Na^+ (2, 8)", size=15)
    chem(s, 690, 290, "Cl^− (2, 8, 8)", size=15)
    s.text(610, 316, "held by electrostatic attraction", size=14, color=MUTED, italic=True)
    return s


@fig
def covalent_molecules():
    s = Svg(800, 330, "Covalent bonding: dot-and-cross diagrams",
            "Outer-shell dot-and-cross diagrams. Hydrogen chloride shares one pair. Water: oxygen shares one pair with each "
            "hydrogen and keeps two lone pairs. Ammonia: three shared pairs and one lone pair. Methane: four shared pairs.")

    def molecule(cx, cy, centre, outer, ligs, lone):
        R = 38
        s.circle(cx, cy, R, stroke=MUTED, width=1.6)
        chem(s, cx, cy, centre, size=18, weight="bold")
        for ang in ligs:
            a = math.radians(ang)
            hx, hy = cx + 66 * math.cos(a), cy - 66 * math.sin(a)
            s.circle(hx, hy, 26, stroke=MUTED, width=1.6)
            chem(s, hx, hy, outer, size=16, weight="bold")
            mx, my = cx + 36 * math.cos(a), cy - 36 * math.sin(a)
            px, py = -math.sin(a) * 6, -math.cos(a) * 6
            s.circle(mx + px, my + py, 4.5, fill=BLUE, stroke=BLUE, width=1)
            d = 4.5
            ex, ey = mx - px, my - py
            s.line(ex - d, ey - d, ex + d, ey + d, color=RED, width=2.2)
            s.line(ex - d, ey + d, ex + d, ey - d, color=RED, width=2.2)
        for ang in lone:
            a = math.radians(ang)
            for off in (-11, 11):
                b = math.radians(ang + off)
                s.circle(cx + R * math.cos(b), cy - R * math.sin(b), 4.5, fill=BLUE, stroke=BLUE, width=1)

    molecule(110, 150, "Cl", "H", [180], [90, 0, 270])
    chem(s, 110, 270, "HCl", size=17, weight="bold")
    molecule(310, 150, "O", "H", [210, 330], [60, 120])
    chem(s, 310, 270, "H_2O: 2 lone pairs", size=16, weight="bold")
    molecule(510, 160, "N", "H", [200, 340, 270], [90])
    chem(s, 510, 270, "NH_3: 1 lone pair", size=16, weight="bold")
    molecule(700, 150, "C", "H", [90, 0, 270, 180], [])
    chem(s, 700, 270, "CH_4", size=17, weight="bold")
    s.circle(250, 310, 4.5, fill=BLUE, stroke=BLUE, width=1)
    s.text(262, 310, "electron of the central atom", size=14, anchor="start")
    s.line(492, 305, 500, 313, color=RED, width=2.2)
    s.line(492, 313, 500, 305, color=RED, width=2.2)
    s.text(510, 310, "electron of hydrogen", size=14, anchor="start")
    title(s, "Outer shells only", y=28)
    return s


@fig
def molecular_shapes():
    s = Svg(800, 360, "Shapes of molecules (electron-pair repulsion)",
            "Linear CO2 (180°), trigonal planar BF3 (120°), tetrahedral CH4 (109.5°), pyramidal NH3 (107°) and bent H2O "
            "(104.5°). Lone pairs repel more than bonding pairs, so they squeeze the bond angle.")

    def atom(x, y, t, r=17, fill=F_GREY):
        s.circle(x, y, r, fill=fill, stroke=INK, width=2)
        chem(s, x, y, t, size=14, weight="bold")

    def bond(x1, y1, x2, y2, dash=None):
        s.line(x1, y1, x2, y2, color=INK, width=3, dash=dash)

    def lone(x, y, ang):
        a = math.radians(ang)
        cx, cy = x + 30 * math.cos(a), y - 30 * math.sin(a)
        s.raw(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="16" ry="9" transform="rotate({-ang} {cx:.1f} {cy:.1f})" '
              f'fill="{F_PURPLE}" stroke="{PURPLE}" stroke-width="1.5"/>')
        s.circle(cx - 4 * math.sin(a), cy - 4 * math.cos(a), 2.5, fill=PURPLE, stroke=PURPLE, width=1)
        s.circle(cx + 4 * math.sin(a), cy + 4 * math.cos(a), 2.5, fill=PURPLE, stroke=PURPLE, width=1)

    y = 150
    # CO2 linear
    bond(30, y, 130, y)
    atom(80, y, "C", fill=F_GREY)
    atom(30, y, "O", fill=F_RED)
    atom(130, y, "O", fill=F_RED)
    # BF3
    cx = 255
    for ang in (90, 210, 330):
        a = math.radians(ang)
        bond(cx, y, cx + 48 * math.cos(a), y - 48 * math.sin(a))
        atom(cx + 48 * math.cos(a), y - 48 * math.sin(a), "F", r=15, fill=F_GREEN)
    atom(cx, y, "B")
    # CH4 tetrahedral
    cx = 410
    bond(cx, y, cx, y - 52)
    atom(cx, y - 52, "H", r=13, fill="#ffffff")
    bond(cx, y, cx - 46, y + 30)
    atom(cx - 46, y + 30, "H", r=13, fill="#ffffff")
    bond(cx, y, cx + 50, y + 22, dash="5 4")
    atom(cx + 50, y + 22, "H", r=13, fill="#ffffff")
    s.polygon([(cx, y - 2), (cx + 10, y + 46), (cx - 6, y + 46)], fill=INK, stroke=INK, width=1)
    atom(cx + 2, y + 54, "H", r=13, fill="#ffffff")
    atom(cx, y, "C")
    # NH3 pyramidal
    cx = 560
    lone(cx, y, 90)
    for dx, dy, dash in [(-44, 34, None), (44, 34, None), (6, 48, "5 4")]:
        bond(cx, y, cx + dx, y + dy, dash)
        atom(cx + dx, y + dy, "H", r=13, fill="#ffffff")
    atom(cx, y, "N", fill=F_BLUE)
    # H2O bent
    cx = 710
    lone(cx, y, 60)
    lone(cx, y, 120)
    for dx in (-40, 40):
        bond(cx, y, cx + dx, y + 36)
        atom(cx + dx, y + 36, "H", r=13, fill="#ffffff")
    atom(cx, y, "O", fill=F_RED)
    for x, a, b, c in [(80, "CO_2", "linear", "180°"), (255, "BF_3", "trigonal planar", "120°"),
                       (410, "CH_4", "tetrahedral", "109.5°"), (560, "NH_3", "pyramidal", "107°"),
                       (710, "H_2O", "bent (V-shaped)", "104.5°")]:
        chem(s, x, 250, a, size=17, weight="bold")
        s.text(x, 274, b, size=14, color=MUTED)
        s.text(x, 296, c, size=16, weight="bold", color=BLUE)
    s.text(400, 336, "purple = lone pair: lone pairs repel more, so angles shrink", size=14, color=PURPLE, italic=True)
    title(s, "Electron pairs spread out as far apart as possible", y=30)
    return s


@fig
def metallic_hydrogen_bonds():
    s = Svg(800, 360, "Metallic bonding and hydrogen bonding",
            "Left: in a metal, positive metal ions sit in a sea of delocalised electrons. Right: in water, a hydrogen atom of one "
            "molecule is attracted to a lone pair on the oxygen of a neighbouring molecule (hydrogen bond, dotted).")
    s.text(190, 40, "Metallic bonding", size=17, weight="bold")
    s.rect(30, 60, 320, 240, fill=F_BLUE, stroke=BLUE, width=2, rx=10)
    import random
    rnd = random.Random(7)
    for r in range(4):
        for c in range(5):
            x, y = 70 + c * 62, 95 + r * 58
            s.circle(x, y, 20, fill="#ffffff", stroke=INK, width=2)
            s.text(x, y + 1, "+", size=18, weight="bold", color=RED)
    for _ in range(30):
        x, y = rnd.uniform(45, 335), rnd.uniform(70, 290)
        s.circle(x, y, 3.2, fill=BLUE, stroke=BLUE, width=1)
    s.text(190, 325, "positive ions in a sea of electrons", size=15, color=MUTED)
    s.text(590, 40, "Hydrogen bonding in water", size=17, weight="bold")

    def water(ox, oy, hs):
        s.circle(ox, oy, 20, fill=F_RED, stroke=RED, width=2)
        chem(s, ox, oy, "O^{δ−}", size=13, weight="bold")
        out = []
        for ang in hs:
            a = math.radians(ang)
            hx, hy = ox + 44 * math.cos(a), oy - 44 * math.sin(a)
            s.line(ox + 20 * math.cos(a), oy - 20 * math.sin(a), hx - 12 * math.cos(a), hy + 12 * math.sin(a), color=INK, width=3)
            s.circle(hx, hy, 12, fill="#ffffff", stroke=INK, width=2)
            chem(s, hx, hy, "H^{δ+}", size=10, weight="bold")
            out.append((hx, hy))
        return out

    def hbond(h, o):
        hx, hy = h
        ox, oy = o
        d = math.hypot(ox - hx, oy - hy)
        ux, uy = (ox - hx) / d, (oy - hy) / d
        s.line(hx + ux * 13, hy + uy * 13, ox - ux * 22, oy - uy * 22, color=GREEN, width=3, dash="3 5")

    a = water(470, 140, [-15, -150])
    b = water(600, 175, [-40, 70])
    water(640, 295, [10, 160])
    water(730, 115, [10, 150])
    hbond(a[0], (600, 175))
    hbond(b[0], (640, 295))
    hbond(b[1], (730, 115))
    s.text(590, 325, "dotted: hydrogen bonds between molecules", size=15, color=GREEN)
    return s


# ═══ Group 2: states of matter, gas laws, chemical calculations ══════════════

@fig
def states_particles():
    s = Svg(780, 340, "Particles in solids, liquids and gases",
            "In a solid, particles are closely packed in a regular pattern and only vibrate. In a liquid, particles are close "
            "together but irregular and can slide past each other. In a gas, particles are far apart and move quickly in all "
            "directions.")
    import random
    rnd = random.Random(11)
    panels = [(140, "Solid", "packed, regular; vibrate"), (390, "Liquid", "close, irregular; slide"),
              (640, "Gas", "far apart; move fast")]
    for x, a, b in panels:
        s.rect(x - 110, 50, 220, 200, fill="#ffffff", stroke=MUTED, width=2.5, rx=8)
        s.text(x, 276, a, size=18, weight="bold")
        s.text(x, 300, b, size=15, color=MUTED)
    for r in range(5):
        for c in range(6):
            x, y = 55 + c * 34, 85 + r * 34
            s.circle(x, y, 15, fill=F_BLUE, stroke=BLUE, width=2)
            if (r + c) % 4 == 0:
                s.path(f"M {x - 21} {y} q 3 -5 6 0 M {x + 15} {y} q 3 -5 6 0", color=MUTED, width=1.5)
    placed = []
    tries = 0
    while len(placed) < 17 and tries < 20000:
        tries += 1
        x, y = rnd.uniform(298, 482), rnd.uniform(112, 234)
        if all((x - a) ** 2 + (y - b) ** 2 > 31 ** 2 for a, b in placed):
            placed.append((x, y))
    for x, y in placed:
        s.circle(x, y, 15, fill=F_BLUE, stroke=BLUE, width=2)
    gas = [(560, 90), (640, 120), (710, 80), (590, 190), (700, 200), (650, 230), (560, 230), (690, 150)]
    for x, y in gas:
        s.circle(x, y, 15, fill=F_BLUE, stroke=BLUE, width=2)
        a = rnd.uniform(0, 2 * math.pi)
        s.arrow(x + 18 * math.cos(a), y + 18 * math.sin(a), x + 44 * math.cos(a), y + 44 * math.sin(a), color=RED, width=2)
    title(s, "Increasing energy and movement →", y=30)
    return s


@fig
def heating_curve():
    s = Svg(760, 420, "Heating curve of water",
            "Ice at −20 °C is heated steadily. Its temperature rises to 0 °C, stays constant while it melts, rises to 100 °C, "
            "stays constant while it boils, then rises again as steam. The flat parts are where latent heat is absorbed.")
    p = Plot(s, 90, 340, 590, 270, (0, 10), (-30, 130))
    p.axes("time (heating at a steady rate)", "temperature (°C)", yticks=[(-20, "−20"), (0, "0"), (50, "50"), (100, "100")],
           zero=False, xaxis_at=-30)
    pts = [(0, -20), (1, 0), (2.6, 0), (4.4, 100), (8.2, 100), (9.6, 125)]
    p.poly(pts, color=RED, width=3.5)
    p.guide(1, 0, to_x=False)
    p.guide(4.4, 100, to_x=False)
    for (x1, y1), (x2, y2), t, col in [((0, -20), (1, 0), "ice warms", BLUE), ((1, 0), (2.6, 0), "melting", PURPLE),
                                         ((2.6, 0), (4.4, 100), "water warms", BLUE), ((4.4, 100), (8.2, 100), "boiling", PURPLE),
                                         ((8.2, 100), (9.6, 125), "steam", BLUE)]:
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        left = t == "ice warms"
        p.text(mx, my, t, dy=-18 if y1 == y2 else 0, dx=0 if y1 == y2 else (-14 if left else 18), size=15, weight="bold",
               color=col, anchor="middle" if y1 == y2 else ("end" if left else "start"))
    p.text(1.8, 0, "solid + liquid", dy=20, size=13, color=MUTED)
    p.text(6.3, 100, "liquid + gas", dy=20, size=13, color=MUTED)
    title(s, "Temperature is constant while the state changes", y=28)
    return s


@fig
def diffusion_tube():
    s = Svg(780, 300, "Diffusion of ammonia and hydrogen chloride",
            "Cotton wool soaked in concentrated ammonia is placed at one end of a long glass tube and cotton wool soaked in "
            "concentrated hydrochloric acid at the other. A white ring of ammonium chloride forms nearer the hydrochloric acid "
            "end, because ammonia molecules are lighter and diffuse faster.")
    s.rect(80, 120, 620, 50, fill=GLASS, stroke=INK, width=2.5, rx=24)
    s.rect(80, 120, 60, 50, fill="#ffffff", stroke=BLUE, width=2, rx=20)
    s.rect(640, 120, 60, 50, fill="#ffffff", stroke=RED, width=2, rx=20)
    chem(s, 110, 96, "NH_3(aq)", size=16, weight="bold", color=BLUE)
    chem(s, 670, 96, "HCl(aq)", size=16, weight="bold", color=RED)
    xr = 140 + 500 * 0.6
    s.rect(xr - 8, 122, 16, 46, fill="#ffffff", stroke=MUTED, width=1.5)
    s.text(xr, 196, "white ring of", size=15, weight="bold")
    chem(s, xr, 216, "NH_4Cl", size=15, weight="bold")
    s.arrow(150, 145, xr - 14, 145, color=BLUE, width=3)
    s.arrow(630, 145, xr + 14, 145, color=RED, width=3)
    s.line(140, 250, xr, 250, color=BLUE, width=2)
    s.line(xr, 250, 640, 250, color=RED, width=2)
    s.text((140 + xr) / 2, 270, "NH₃ travels further (M = 17)", size=14, color=BLUE)
    s.text((xr + 640) / 2, 270, "HCl travels less (M = 36.5)", size=14, color=RED)
    title(s, "Lighter molecules diffuse faster", y=34)
    return s


@fig
def boyle_charles():
    s = Svg(800, 380, "Boyle's law and Charles' law graphs",
            "Left: at constant temperature, pressure against volume is a curve: doubling the pressure halves the volume "
            "(Boyle's law). Right: at constant pressure, volume against kelvin temperature is a straight line "
            "through the origin (Charles' law); extended, it reaches zero volume at −273 °C (0 K).")
    p = Plot(s, 60, 300, 280, 220, (0, 10), (0, 10))
    p.axes("volume V", "pressure P", zero=True)
    p.fn(lambda v: 9 / v, 0.95, 9.5, color=BLUE, width=3.5)
    s.text(200, 30, "Boyle's law (T constant)", size=16, weight="bold", color=BLUE)
    s.text(200, 52, "PV = constant", size=15, color=BLUE)
    q = Plot(s, 450, 300, 300, 220, (-300, 400), (0, 10))
    q.axes("temperature (°C)", "volume V", xticks=[(-273, "−273"), (0, "0"), (100, "100"), (300, "300")], zero=False)
    q.fn(lambda t: (t + 273) / 70, 0, 380, color=RED, width=3.5)
    q.fn(lambda t: (t + 273) / 70, -273, 0, color=RED, width=2.2, dash="7 6")
    q.dot(-273, 0, color=RED)
    q.text(-273, 0, "0 K", dy=-16, dx=10, size=14, weight="bold", color=RED, anchor="start")
    s.text(600, 30, "Charles' law (P constant)", size=16, weight="bold", color=RED)
    s.text(600, 52, "V ∝ T (in kelvin)", size=15, color=RED)
    s.text(600, 350, "dashed: extended to absolute zero", size=14, color=MUTED, italic=True)
    return s


@fig
def mole_bridge():
    s = Svg(780, 420, "Converting to and from moles",
            "The mole is the bridge between quantities. Mass in grams divided by molar mass gives moles; moles times molar mass "
            "gives mass. Moles times the Avogadro constant gives the number of particles. Gas volume divided by 22.4 dm3 at s.t.p. "
            "gives moles. Concentration times volume in dm3 gives moles.")
    c = box(s, 390, 210, 170, 76, ["moles", "n"], BLUE, F_BLUE, size=22)
    items = [(390, 60, ["mass (g)", "m"], GREEN, F_GREEN, "÷ M", "× M"),
             (110, 210, ["particles", "N"], PURPLE, F_PURPLE, "÷ 6.02 × 10²³", "× 6.02 × 10²³"),
             (670, 210, ["gas volume", "V (dm³)"], ORANGE, F_AMBER, "÷ 22.4", "× 22.4"),
             (390, 360, ["solution", "C × V (dm³)"], TEAL, F_TEAL, "C × V", "n ÷ V")]
    for x, y, lines, col, fill, to_n, from_n in items:
        b = box(s, x, y, 190, 64, lines, col, fill, size=17)
        dx, dy = c[0] - x, c[1] - y
        if abs(dx) > abs(dy):
            sx = x + math.copysign(100, dx)
            ex = c[0] - math.copysign(90, dx)
            s.arrow(sx, y - 10, ex, y - 10, color=col, width=2.5)
            s.arrow(ex, y + 10, sx, y + 10, color=col, width=2.5)
            s.text((sx + ex) / 2, y - 26, to_n, size=14, weight="bold", color=col)
            s.text((sx + ex) / 2, y + 30, from_n, size=14, weight="bold", color=col)
        else:
            sy = y + math.copysign(37, dy)
            ey = c[1] - math.copysign(43, dy)
            s.arrow(x - 12, sy, x - 12, ey, color=col, width=2.5)
            s.arrow(x + 12, ey, x + 12, sy, color=col, width=2.5)
            s.text(x - 24, (sy + ey) / 2, to_n, size=14, weight="bold", color=col, anchor="end")
            s.text(x + 24, (sy + ey) / 2, from_n, size=14, weight="bold", color=col, anchor="start")
    s.text(130, 390, "M = molar mass (g/mol)", size=14, color=MUTED)
    s.text(660, 390, "22.4 dm³ per mole at s.t.p.", size=14, color=MUTED)
    return s


@fig
def crucible_mgo():
    s = Svg(760, 380, "Finding the formula of magnesium oxide",
            "Magnesium ribbon is heated strongly in a crucible with a lid on a pipe-clay triangle. The lid is lifted from time to "
            "time to let air in. The crucible and contents are weighed before and after heating to find the masses of magnesium "
            "and oxygen that combined.")
    tripod(s, 200, 230, 350, w=150)
    s.polygon([(140, 228), (260, 228), (200, 236)], fill="none", stroke=MUTED, width=3)
    s.path("M 160 170 L 168 228 L 232 228 L 240 170 Z", color=INK, width=2.5, fill="#ffffff")
    s.path("M 152 166 L 248 166 L 244 156 L 156 156 Z", color=INK, width=2.5, fill="#ffffff")
    s.path("M 176 214 q 10 -12 20 0 q 10 12 20 0", color=MUTED, width=3)
    s.text(292, 150, "lid (lift slightly at times)", size=14, anchor="start")
    s.text(292, 200, "crucible with Mg ribbon", size=14, anchor="start")
    s.text(292, 236, "pipe-clay triangle on tripod", size=14, anchor="start")
    burner(s, 200, 350)
    x0 = 470
    rows = [("mass of crucible + lid", "20.10 g"), ("+ magnesium", "20.34 g"), ("+ magnesium oxide", "20.50 g")]
    s.text(x0 + 130, 70, "Results", size=17, weight="bold")
    for i, (a, b) in enumerate(rows):
        s.text(x0, 105 + i * 30, a, size=15, anchor="start")
        s.text(x0 + 270, 105 + i * 30, b, size=15, anchor="end", weight="bold")
    s.text(x0, 215, "Mg = 0.24 g → 0.24 ÷ 24 = 0.01 mol", size=15, anchor="start", color=BLUE)
    s.text(x0, 243, "O = 0.16 g → 0.16 ÷ 16 = 0.01 mol", size=15, anchor="start", color=RED)
    s.text(x0, 280, "ratio 1 : 1, so MgO", size=17, anchor="start", weight="bold", color=GREEN)
    return s


# ═══ Group 3: acids, bases, salts and solutions ══════════════════════════════

PH_COLOURS = ["#b91c1c", "#dc2626", "#ea580c", "#f97316", "#f59e0b", "#eab308", "#a3e635", "#22c55e",
              "#14b8a6", "#0ea5e9", "#3b82f6", "#4f46e5", "#6d28d9", "#7c3aed", "#581c87"]


@fig
def ph_scale():
    s = Svg(800, 430, "The pH scale",
            "The pH scale runs from 0 to 14. Below 7 is acidic (red to yellow on universal indicator), 7 is neutral (green) and "
            "above 7 is alkaline (blue to purple). Examples: stomach acid about 1, lime juice 2, vinegar 3, palm wine and "
            "rainwater 4 to 6, pure water 7, blood 7.4, sea water 8, baking soda 9, soap 10, ammonia solution 11, bleach 12, "
            "sodium hydroxide 14.")
    x0, w, y = 50, 700 / 15, 220
    for i in range(15):
        s.rect(x0 + i * w, y, w, 54, fill=PH_COLOURS[i], stroke="#ffffff", width=1.5)
        s.text(x0 + i * w + w / 2, y + 27, str(i), size=17, weight="bold", color="#ffffff")
    s.text(x0 + 3.5 * w, 110, "ACIDIC", size=17, weight="bold", color=RED)
    s.text(x0 + 7.5 * w, 110, "NEUTRAL", size=17, weight="bold", color=GREEN)
    s.text(x0 + 11.5 * w, 110, "ALKALINE", size=17, weight="bold", color=PURPLE)
    s.arrow(x0 + 6.4 * w, 76, x0 + 0.2 * w, 76, color=RED, width=2.5)
    s.text(x0 + 3.4 * w, 60, "stronger acid", size=14, color=RED)
    s.arrow(x0 + 8.6 * w, 76, x0 + 14.8 * w, 76, color=PURPLE, width=2.5)
    s.text(x0 + 11.6 * w, 60, "stronger alkali", size=14, color=PURPLE)
    above = [(1, "stomach acid", 0), (2, "lime juice", 1), (3, "vinegar", 0), (7, "pure water", 0), (10, "soap", 0),
             (12, "bleach", 1)]
    below = [(4, "palm wine"), (5.6, "rainwater"), (7.4, "blood"), (8, "sea water"), (9, "baking soda"), (11, "ammonia"),
             (14, "NaOH")]
    for v, t in below:
        x = x0 + v * w + w / 2
        s.line(x, y + 56, x, y + 84, color=MUTED, width=1.5)
        s.text(x, y + 100 + (16 if v in (5.6, 8, 11) else 0), t, size=13, color=INK)
    for v, t, tier in above:
        x = x0 + v * w + w / 2
        top = y - 30 - tier * 24
        s.line(x, y - 2, x, top + 8, color=MUTED, width=1.5)
        s.label(x, top, t, size=13)
    s.text(400, 410, "colours are those of universal indicator", size=14, color=MUTED, italic=True)
    return s


@fig
def titration_setup():
    s = Svg(780, 480, "Titration apparatus",
            "A burette clamped vertically above a conical flask standing on a white tile. The conical flask holds a measured "
            "volume of alkali from a pipette and a few drops of indicator. Acid is run in from the burette while the flask is "
            "swirled. The burette is read at the bottom of the meniscus with the eye level with it.")
    s.rect(60, 440, 200, 12, fill=METAL, stroke=INK, width=2)
    s.rect(78, 70, 10, 372, fill=METAL, stroke=INK, width=2)
    s.rect(88, 140, 70, 10, fill=METAL, stroke=INK, width=2)
    s.rect(150, 132, 26, 26, fill="#ffffff", stroke=INK, width=2, rx=3)
    bx = 163
    s.rect(bx - 9, 60, 18, 250, fill="#ffffff", stroke=INK, width=2.5)
    s.rect(bx - 7, 110, 14, 198, fill=F_RED, stroke="none", width=0)
    for k in range(12):
        s.line(bx - 9, 70 + k * 20, bx - 2, 70 + k * 20, color=INK, width=1.3)
    s.path(f"M {bx - 9} 310 L {bx - 3} 330 L {bx - 3} 352 M {bx + 9} 310 L {bx + 3} 330 L {bx + 3} 352", color=INK, width=2.5)
    s.rect(bx - 12, 318, 24, 7, fill=METAL, stroke=INK, width=1.5)
    s.text(bx + 24, 140, "burette (acid)", size=15, anchor="start")
    s.text(bx + 24, 322, "tap", size=15, anchor="start")
    conical(s, bx, 432, 110, 90, 0.35, liquid="#fbcfe8")
    s.rect(bx - 80, 432, 160, 10, fill="#ffffff", stroke=MUTED, width=2)
    s.text(bx + 70, 410, "conical flask: alkali + indicator", size=15, anchor="start")
    s.text(bx + 88, 445, "white tile", size=15, anchor="start")
    # meniscus inset
    ix, iy = 560, 170
    s.rect(ix - 120, iy - 120, 240, 240, fill="#ffffff", stroke=MUTED, width=2, rx=10)
    s.text(ix, iy - 98, "Reading the burette", size=16, weight="bold")
    s.rect(ix - 30, iy - 80, 60, 170, fill="#ffffff", stroke=INK, width=2.5)
    s.path(f"M {ix - 28} {iy - 2} Q {ix} {iy + 18} {ix + 28} {iy - 2} L {ix + 28} {iy + 88} L {ix - 28} {iy + 88} Z",
           color="none", width=0, fill=F_RED)
    s.path(f"M {ix - 28} {iy - 2} Q {ix} {iy + 18} {ix + 28} {iy - 2}", color=RED, width=2)
    for k, lab in [(0, "22.0"), (1, "22.5"), (2, "23.0")]:
        yy = iy - 40 + k * 30
        s.line(ix - 30, yy, ix - 10, yy, color=INK, width=1.5)
        s.text(ix - 36, yy, lab, size=13, anchor="end")
    s.line(ix - 110, iy + 8, ix + 110, iy + 8, color=BLUE, width=1.5, dash="5 4")
    s.text(ix + 34, iy + 30, "eye level with the", size=13, color=BLUE, anchor="start")
    s.text(ix + 34, iy + 47, "bottom of meniscus", size=13, color=BLUE, anchor="start")
    s.text(ix, 330, "reads 22.80 cm³", size=16, weight="bold", color=RED)
    return s


@fig
def titration_curve():
    s = Svg(760, 420, "pH change during a titration and the choice of indicator",
            "As sodium hydroxide is added to hydrochloric acid, the pH rises slowly from about 1, then jumps from about 3 to 11 "
            "at the end point (25 cm3), then levels off near 13. Both methyl orange (changes at pH 3.1 to 4.4) and "
            "phenolphthalein (8.3 to 10) change colour within the steep part, so either can be used for a strong acid and "
            "strong base.")
    p = Plot(s, 90, 350, 560, 280, (0, 50), (0, 14))
    p.axes("volume of NaOH added (cm³)", "pH", xticks=[10, 20, 25, 30, 40, 50], yticks=[0, 2, 4, 6, 7, 8, 10, 12, 14], zero=False)
    def ph(v):
        a0, c = 0.1 * 25, 0.1
        if v < 24.999:
            h = (a0 - c * v) / (25 + v) * 1000 / 1000
            return -math.log10(max(h, 1e-14))
        if v > 25.001:
            oh = (c * v - a0) / (25 + v)
            return 14 + math.log10(oh)
        return 7
    pts = [(v / 10, ph(v / 10)) for v in range(0, 501)]
    p.poly([pt for pt in pts if not (24.9 < pt[0] < 25.1)] [:249] + [(25, 7)] + [pt for pt in pts if pt[0] > 25.1], color=BLUE, width=3)
    for lo, hi, col, name in [(3.1, 4.4, ORANGE, "methyl orange 3.1–4.4"), (8.3, 10, PURPLE, "phenolphthalein 8.3–10")]:
        x0, y0 = p.P(0, hi)
        x1, y1 = p.P(50, lo)
        s.rect(x0, y0, x1 - x0, y1 - y0, fill=col, stroke="none", width=0, opacity=0.18)
        p.text(48, (lo + hi) / 2, name, size=14, weight="bold", color=col, anchor="end")
    p.guide(25, 7, to_y=False)
    p.text(25, 7, "end point", dx=10, size=14, weight="bold", anchor="start")
    title(s, "Strong acid titrated with strong alkali", y=28)
    return s


@fig
def solubility_curves():
    s = Svg(760, 440, "Solubility curves",
            "Solubility in grams per 100 g of water against temperature. Potassium nitrate rises steeply from 13 g at 0 °C to "
            "169 g at 80 °C; copper(II) sulphate rises from 14 g to 55 g; sodium chloride hardly changes, about 36 to 38 g. "
            "Cooling saturated potassium nitrate solution from 60 °C (110 g) to 20 °C (32 g) crystallises about 78 g.")
    p = Plot(s, 90, 370, 560, 300, (0, 80), (0, 180))
    p.axes("temperature (°C)", "solubility (g per 100 g water)", xticks=[0, 20, 40, 60, 80], yticks=[0, 40, 80, 120, 160],
           zero=False)
    kno3 = [(0, 13.3), (20, 31.6), (40, 63.9), (60, 110), (80, 169)]
    cuso4 = [(0, 14.3), (20, 20.7), (40, 28.5), (60, 40), (80, 55)]
    nacl = [(0, 35.7), (20, 36.0), (40, 36.6), (60, 37.3), (80, 38.4)]
    p.smooth(kno3, color=RED, width=3.5)
    p.smooth(cuso4, color=BLUE, width=3.5)
    p.smooth(nacl, color=GREEN, width=3.5)
    chem(s, p.X(66), p.Y(150), "KNO_3", size=16, weight="bold", color=RED)
    chem(s, p.X(74), p.Y(62), "CuSO_4", size=16, weight="bold", color=BLUE)
    chem(s, p.X(74), p.Y(28), "NaCl", size=16, weight="bold", color=GREEN)
    p.guide(60, 110)
    p.guide(20, 31.6)
    p.dot(60, 110, color=RED)
    p.dot(20, 31.6, color=RED)
    x = p.X(40)
    s.arrow(p.X(58), p.Y(110), p.X(22), p.Y(110), color=PURPLE, width=2)
    s.text(x, p.Y(110) - 14, "cool 60 °C → 20 °C", size=14, color=PURPLE, weight="bold")
    s.text(p.X(2), p.Y(150), "110 − 32 ≈ 78 g crystallises", size=14, color=PURPLE, weight="bold", anchor="start")
    return s


@fig
def water_treatment():
    s = Svg(800, 420, "Treating water for a town supply",
            "Water from a dam or river is screened, then alum is added to coagulate fine particles, which settle in sedimentation "
            "tanks. The water is filtered through sand beds, chlorinated to kill germs, and stored in a reservoir before being "
            "piped to homes.")
    steps = [("Intake", "dam or river", BLUE, F_BLUE), ("Screening", "removes leaves, fish", TEAL, F_TEAL),
             ("Coagulation", "alum added", PURPLE, F_PURPLE), ("Sedimentation", "flocs settle", ORANGE, F_AMBER),
             ("Filtration", "sand beds", GREEN, F_GREEN), ("Chlorination", "kills germs", RED, F_RED),
             ("Storage", "covered reservoir", BLUE, F_BLUE), ("Supply", "pipes to homes", INK, F_GREY)]
    xs = [110, 300, 490, 680]
    pos = [(xs[i % 4], 130 if i < 4 else 290) for i in range(8)]
    pos = pos[:4] + list(reversed(pos[4:]))
    boxes = []
    for (x, y), (a, b, col, fill) in zip(pos, steps):
        boxes.append(box(s, x, y, 166, 70, [a, b], col, fill, size=16))
    for a, b in zip(boxes, boxes[1:]):
        link(s, a, b, color=INK, gap=4)
    s.text(400, 390, "e.g. Guma Valley treatment works supplying Freetown", size=15, color=MUTED, italic=True)
    title(s, "From raw water to tap water", y=40)
    return s


@fig
def salt_preparation():
    s = Svg(800, 470, "Choosing a method to prepare a salt",
            "If the salt is insoluble, prepare it by precipitation (mixing two solutions), then filter, wash and dry. If it is "
            "soluble and a sodium, potassium or ammonium salt, use titration of acid with alkali. Other soluble salts are made by "
            "adding excess metal, insoluble base or carbonate to the acid, filtering off the excess and crystallising.")
    q1 = box(s, 400, 76, 300, 52, ["Is the salt soluble in water?"], INK, F_GREY, size=17)
    no = box(s, 150, 190, 250, 86, ["No: precipitation", "mix two solutions", "e.g. BaSO_4, AgCl, PbI_2"], RED, F_RED, size=16)
    q2 = box(s, 560, 190, 330, 70, ["Yes: is it a Na, K or", "NH_4 salt?"], INK, F_GREY, size=16, bold_first=False)
    s.path("M 330 102 L 150 140", color=RED, width=2.5, arrow="end")
    s.text(228, 112, "no", size=15, weight="bold", color=RED)
    s.path("M 470 102 L 560 150", color=GREEN, width=2.5, arrow="end")
    s.text(540, 116, "yes", size=15, weight="bold", color=GREEN)
    t = box(s, 430, 350, 250, 86, ["Yes: titration", "acid + alkali", "e.g. NaCl, KNO_3"], BLUE, F_BLUE, size=16)
    e = box(s, 690, 350, 210, 86, ["No: excess solid", "metal, oxide or", "carbonate + acid"], GREEN, F_GREEN, size=16)
    s.path("M 520 225 L 450 302", color=BLUE, width=2.5, arrow="end")
    s.text(460, 258, "yes", size=15, weight="bold", color=BLUE)
    s.path("M 610 225 L 680 302", color=GREEN, width=2.5, arrow="end")
    s.text(672, 258, "no", size=15, weight="bold", color=GREEN)
    s.text(150, 260, "filter, wash, dry", size=15, color=RED)
    s.text(430, 418, "repeat without indicator; crystallise", size=14, color=BLUE)
    s.text(690, 418, "filter off excess; crystallise", size=14, color=GREEN)
    title(s, "Start with the solubility of the salt", y=24)
    return s


@fig
def tyndall_effect():
    s = Svg(760, 330, "The Tyndall effect",
            "A beam of light passes invisibly through a true solution such as salt solution, but its path is visible through a "
            "colloid such as starch solution or diluted milk, because the colloid particles scatter the light.")
    for x, label, colloid in [(250, "salt solution (true solution)", False), (560, "starch solution (colloid)", True)]:
        beaker(s, x - 70, 260, 140, 150, 0.8, liquid="#e0f2fe" if not colloid else "#f1f5f9")
        s.text(x, 290, label, size=15, weight="bold")
        if colloid:
            s.polygon([(x - 70, 168), (x + 70, 160), (x + 70, 192), (x - 70, 184)], fill="#fde047", stroke="none", opacity=0.75)
            import random
            rnd = random.Random(5)
            for _ in range(40):
                s.circle(rnd.uniform(x - 66, x + 66), rnd.uniform(140, 250), 1.6, fill=MUTED, stroke=MUTED, width=0.5)
            s.text(x, 80, "beam visible", size=15, color=ORANGE, weight="bold")
        else:
            s.text(x, 80, "beam invisible", size=15, color=MUTED, weight="bold")
    s.rect(40, 160, 50, 30, fill=INK, stroke=INK, width=1, rx=4)
    s.text(65, 140, "torch", size=14)
    s.line(90, 175, 180, 175, color="#facc15", width=6)
    s.line(320, 175, 490, 175, color="#facc15", width=6)
    s.line(630, 176, 720, 176, color="#facc15", width=6)
    title(s, "Colloid particles scatter light", y=30)
    return s


# ═══ Group 4: reactions and energy ═══════════════════════════════════════════

def _battery(s: Svg, x, y, label="d.c. supply"):
    s.line(x - 8, y - 18, x - 8, y + 18, width=3)
    s.line(x + 8, y - 10, x + 8, y + 10, width=5)
    s.text(x - 8, y - 30, "+", size=16, weight="bold", color=RED)
    s.text(x + 8, y - 30, "−", size=16, weight="bold", color=BLUE)
    s.text(x, y + 34, label, size=14, color=MUTED)


@fig
def electrolysis_cell():
    s = Svg(780, 440, "An electrolytic cell",
            "A d.c. supply is connected to two electrodes dipping into an electrolyte. The anode is joined to the positive "
            "terminal and the cathode to the negative terminal. Positive ions (cations) move to the cathode and gain electrons; "
            "negative ions (anions) move to the anode and lose electrons. Electrons flow in the external wire from anode to cathode.")
    _battery(s, 390, 70)
    s.line(382, 70, 250, 70, width=2.5)
    s.line(250, 70, 250, 150, width=2.5)
    s.line(398, 70, 530, 70, width=2.5)
    s.line(530, 70, 530, 150, width=2.5)
    beaker(s, 170, 400, 440, 230, 0.8, liquid=F_BLUE)
    s.rect(236, 150, 28, 200, fill=METAL, stroke=INK, width=2)
    s.rect(516, 150, 28, 200, fill=METAL, stroke=INK, width=2)
    s.text(250, 132, "anode (+)", size=16, weight="bold", color=RED)
    s.text(530, 132, "cathode (−)", size=16, weight="bold", color=BLUE)
    for i, y in enumerate((230, 290)):
        s.circle(450, y, 15, fill="#ffffff", stroke=BLUE, width=2)
        s.text(450, y + 1, "+", size=16, weight="bold", color=BLUE)
        s.arrow(468, y, 506, y, color=BLUE, width=2.5)
        s.circle(330, y + 20, 15, fill="#ffffff", stroke=RED, width=2)
        s.text(330, y + 21, "−", size=18, weight="bold", color=RED)
        s.arrow(312, y + 20, 274, y + 20, color=RED, width=2.5)
    s.text(470, 340, "cations → cathode", size=15, weight="bold", color=BLUE)
    s.text(320, 375, "anions → anode", size=15, weight="bold", color=RED)
    s.path("M 300 60 C 330 40, 360 40, 372 52", color=GREEN, width=2, arrow="end")
    s.path("M 410 52 C 430 40, 460 40, 480 60", color=GREEN, width=2, arrow="end")
    s.text(650, 60, "electrons flow", size=14, color=GREEN, anchor="middle")
    s.text(650, 78, "anode → cathode", size=14, color=GREEN, anchor="middle")
    s.text(650, 210, "cathode: reduction", size=14, color=BLUE, anchor="start")
    s.text(650, 232, "(gain of electrons)", size=14, color=BLUE, anchor="start")
    s.text(30, 210, "anode: oxidation", size=14, color=RED, anchor="start")
    s.text(30, 232, "(loss of electrons)", size=14, color=RED, anchor="start")
    s.text(390, 425, "electrolyte (ions free to move)", size=15, color=MUTED)
    return s


@fig
def hofmann_voltameter():
    s = Svg(700, 440, "Electrolysis of acidified water",
            "In a Hofmann voltameter, acidified water is electrolysed with platinum electrodes. Hydrogen collects above the "
            "cathode and oxygen above the anode. The volume of hydrogen is twice the volume of oxygen.")
    s.path("M 200 70 L 200 330 L 500 330 L 500 70", color=INK, width=3)
    s.path("M 240 70 L 240 290 L 330 290 L 330 120 L 370 120 L 370 290 L 460 290 L 460 70", color=INK, width=3)
    s.rect(202, 190, 36, 138, fill=WATER, stroke="none", width=0)
    s.rect(240, 292, 220, 36, fill=WATER, stroke="none", width=0)
    s.rect(462, 130, 36, 198, fill=WATER, stroke="none", width=0)
    s.rect(332, 150, 36, 140, fill=WATER, stroke="none", width=0)
    s.rect(202, 72, 36, 118, fill="#ffffff", stroke="none", width=0)
    s.rect(462, 72, 36, 58, fill="#ffffff", stroke="none", width=0)
    s.circle(350, 110, 30, fill=GLASS, stroke=INK, width=2.5)
    s.rect(212, 300, 16, 26, fill=METAL, stroke=INK, width=1.5)
    s.rect(472, 300, 16, 26, fill=METAL, stroke=INK, width=1.5)
    for x in (200, 500):
        s.rect(x - 8, 56, 16, 14, fill=METAL, stroke=INK, width=1.5)
    s.text(220, 130, "H₂", size=20, weight="bold", color=BLUE)
    s.text(480, 100, "O₂", size=20, weight="bold", color=RED)
    s.text(150, 130, "2 volumes", size=15, color=BLUE, anchor="end")
    s.text(550, 100, "1 volume", size=15, color=RED, anchor="start")
    s.line(220, 330, 220, 380, width=2.5)
    s.line(480, 330, 480, 380, width=2.5)
    s.line(220, 380, 340, 380, width=2.5)
    s.line(360, 380, 480, 380, width=2.5)
    s.line(342, 368, 342, 392, width=3)
    s.line(358, 374, 358, 386, width=5)
    s.text(220, 404, "cathode (−)", size=15, color=BLUE, weight="bold")
    s.text(480, 404, "anode (+)", size=15, color=RED, weight="bold")
    s.text(350, 60, "acidified water", size=15, color=MUTED)
    title(s, "Hydrogen : oxygen = 2 : 1 by volume", y=26)
    return s


@fig
def copper_refining():
    s = Svg(760, 400, "Purifying copper by electrolysis",
            "Impure copper is the anode and a thin sheet of pure copper is the cathode, in copper(II) sulphate solution. Copper "
            "atoms at the anode lose electrons and go into solution as Cu2+ ions; Cu2+ ions gain electrons at the cathode and "
            "deposit as pure copper. Impurities fall as anode sludge.")
    _battery(s, 380, 60)
    s.line(372, 60, 240, 60, width=2.5)
    s.line(240, 60, 240, 130, width=2.5)
    s.line(388, 60, 520, 60, width=2.5)
    s.line(520, 60, 520, 130, width=2.5)
    beaker(s, 160, 360, 440, 220, 0.85, liquid=F_BLUE)
    s.rect(214, 130, 52, 200, fill="#d97706", stroke=INK, width=2)
    s.rect(512, 130, 16, 200, fill="#f97316", stroke=INK, width=2)
    s.text(240, 112, "impure copper", size=15, weight="bold", color=RED)
    s.text(240, 94, "anode (+)", size=15, weight="bold", color=RED)
    s.text(530, 112, "pure copper", size=15, weight="bold", color=BLUE)
    s.text(530, 94, "cathode (−)", size=15, weight="bold", color=BLUE)
    for y in (190, 250):
        s.arrow(280, y, 500, y, color=BLUE, width=2.5)
        chem(s, 390, y - 14, "Cu^{2+}", size=15, weight="bold", color=BLUE)
    import random
    rnd = random.Random(3)
    for _ in range(18):
        s.circle(rnd.uniform(200, 290), rnd.uniform(342, 354), 3.5, fill=MUTED, stroke=MUTED, width=1)
    s.text(250, 384, "anode sludge (Ag, Au)", size=14, color=MUTED)
    chem(s, 616, 200, "Cu → Cu^{2+} + 2e^−", size=15, color=RED, anchor="start")
    s.text(616, 182, "at the anode:", size=14, color=MUTED, anchor="start")
    chem(s, 616, 262, "Cu^{2+} + 2e^− → Cu", size=15, color=BLUE, anchor="start")
    s.text(616, 244, "at the cathode:", size=14, color=MUTED, anchor="start")
    s.text(380, 392, "electrolyte: copper(II) sulphate solution", size=14, color=MUTED, anchor="start")
    return s


@fig
def daniell_cell():
    s = Svg(780, 480, "The Daniell cell",
            "A zinc electrode in zinc sulphate solution is connected through a voltmeter to a copper electrode in copper(II) "
            "sulphate solution. A salt bridge joins the two solutions. Zinc is oxidised and loses electrons, which flow through the "
            "wire to the copper, where Cu2+ ions are reduced. The voltage is about 1.10 V.")
    beaker(s, 60, 380, 230, 200, 0.75, liquid="#e2e8f0")
    beaker(s, 490, 380, 230, 200, 0.75, liquid=F_BLUE)
    s.rect(150, 140, 30, 220, fill="#94a3b8", stroke=INK, width=2)
    s.rect(600, 140, 30, 220, fill="#f97316", stroke=INK, width=2)
    s.text(165, 122, "zinc (−)", size=16, weight="bold")
    s.text(615, 122, "copper (+)", size=16, weight="bold")
    chem(s, 175, 400, "ZnSO_4(aq)", size=15, color=MUTED)
    chem(s, 605, 400, "CuSO_4(aq)", size=15, color=BLUE)
    s.path("M 250 280 L 250 190 L 530 190 L 530 280", color="#cbd5e1", width=26)
    s.path("M 250 280 L 250 190 L 530 190 L 530 280", color=INK, width=2, fill="none", dash="2 0")
    s.text(390, 176, "salt bridge (KNO₃)", size=15, weight="bold", color=MUTED)
    s.line(165, 140, 165, 70, width=2.5)
    s.line(165, 70, 365, 70, width=2.5)
    s.line(415, 70, 615, 70, width=2.5)
    s.line(615, 70, 615, 140, width=2.5)
    s.circle(390, 70, 24, fill="#ffffff", stroke=INK, width=2.5)
    s.text(390, 71, "V", size=18, weight="bold")
    s.arrow(220, 50, 330, 50, color=GREEN, width=2.5)
    s.text(275, 36, "electrons", size=14, color=GREEN, weight="bold")
    chem(s, 175, 452, "oxidation: Zn → Zn^{2+} + 2e^−", size=15, color=RED, anchor="middle")
    chem(s, 605, 452, "reduction: Cu^{2+} + 2e^− → Cu", size=15, color=BLUE, anchor="middle")
    s.text(390, 110, "about 1.10 V", size=16, weight="bold")
    return s


@fig
def rusting_tubes():
    s = Svg(780, 380, "Investigating the conditions for rusting",
            "Three iron nails: in tube A with air and water the nail rusts; in tube B with dry air (anhydrous calcium chloride) it "
            "does not rust; in tube C with boiled water under a layer of oil (no air) it does not rust. Rusting needs both water "
            "and oxygen.")
    tubes = [(150, "A", "air + water", "rusts", RED), (390, "B", "dry air only", "no rust", GREEN),
             (630, "C", "boiled water, no air", "no rust", GREEN)]
    for x, lab, cond, res, col in tubes:
        test_tube(s, x - 34, 70, 68, 220, 0.0)
        s.text(x, 50, lab, size=20, weight="bold")
        s.text(x, 316, cond, size=15)
        s.text(x, 340, res, size=16, weight="bold", color=col)
        nail_col = "#b45309" if lab == "A" else "#64748b"
        s.rect(x - 4, 120, 8, 120, fill=nail_col, stroke=INK, width=1.2)
        s.rect(x - 10, 116, 20, 6, fill=nail_col, stroke=INK, width=1.2)
    s.rect(118, 200, 64, 50, fill=WATER, stroke="none", width=0, opacity=0.8)
    s.rect(358, 250, 64, 30, fill="#ffffff", stroke=MUTED, width=1.5)
    s.text(390, 266, "CaCl₂", size=12, color=MUTED)
    s.rect(380, 66, 20, 14, fill=METAL, stroke=INK, width=1.5)
    s.rect(598, 130, 64, 140, fill=WATER, stroke="none", width=0, opacity=0.8)
    s.rect(598, 116, 64, 16, fill="#fde68a", stroke=ORANGE, width=1.5)
    s.text(690, 124, "oil layer", size=13, color=ORANGE, anchor="start")
    s.text(470, 260, "drying agent", size=13, color=MUTED, anchor="start")
    title(s, "Rusting needs both water and oxygen (air)", y=26)
    return s


@fig
def energy_profiles():
    s = Svg(800, 400, "Energy profiles of exothermic and endothermic reactions",
            "Left: in an exothermic reaction the products are lower in energy than the reactants; energy is given out and ΔH is "
            "negative. Right: in an endothermic reaction the products are higher; energy is taken in and ΔH is positive. In both, "
            "the reactants must first gain the activation energy Ea.")
    for k, (x0, exo) in enumerate([(60, True), (450, False)]):
        p = Plot(s, x0, 330, 290, 250, (0, 10), (0, 10))
        p.axes("progress of reaction", "energy", zero=False)
        r, pr, top = (6, 2.5, 9) if exo else (3, 6.5, 9)
        def prof(x, r=r, pr=pr, top=top):
            base = r + (pr - r) / (1 + math.exp(-(x - 5) * 2.4))
            return base + (top - (r + pr) / 2) * math.exp(-((x - 5) / 1.05) ** 2)
        p.fn(prof, 0.3, 9.7, color=RED if exo else BLUE, width=3.5, n=120)
        p.text(1.2, r, "reactants", dy=-16, size=14, weight="bold")
        p.text(8.8, pr, "products", dy=-16, size=14, weight="bold")
        xg, _ = p.P(5, 0)
        s.line(p.X(0.3), p.Y(r), p.X(9.7), p.Y(r), color=MUTED, width=1.5, dash="5 4")
        if not exo:
            s.line(p.X(6.5), p.Y(pr), p.X(9.7), p.Y(pr), color=MUTED, width=1.5, dash="5 4")
        xa = p.X(4.2)
        s.line(xa, p.Y(r), xa, p.Y(top) + 3, color=PURPLE, width=2)
        s.head(xa, p.Y(top) + 3, -math.pi / 2, color=PURPLE, size=9)
        s.text(xa - 8, (p.Y(r) + p.Y(top)) / 2, "Ea", size=15, weight="bold", color=PURPLE, anchor="end")
        xd = p.X(9.2)
        s.line(xd, p.Y(r), xd, p.Y(pr), color=GREEN, width=2.5)
        s.head(xd, p.Y(pr), math.pi / 2 if exo else -math.pi / 2, color=GREEN, size=9)
        s.text(xd + 8, (p.Y(r) + p.Y(pr)) / 2, "ΔH < 0" if exo else "ΔH > 0", size=15, weight="bold", color=GREEN, anchor="start")
        s.text(x0 + 145, 36, "Exothermic" if exo else "Endothermic", size=18, weight="bold", color=RED if exo else BLUE)
        s.text(x0 + 145, 58, "heat given out" if exo else "heat taken in", size=14, color=MUTED)
    return s


@fig
def rate_curves():
    s = Svg(760, 420, "Volume of gas produced against time",
            "Marble chips react with hydrochloric acid. With more concentrated acid (or warmer acid, or powdered marble) the curve "
            "is steeper at the start, showing a faster rate, but with the same amount of limiting reactant the same final volume "
            "of carbon(IV) oxide is reached. The rate is the gradient of the curve.")
    p = Plot(s, 90, 350, 580, 270, (0, 10), (0, 80))
    p.axes("time (minutes)", "volume of CO₂ (cm³)", xticks=[2, 4, 6, 8, 10], yticks=[0, 20, 40, 60, 80], zero=False)
    p.fn(lambda t: 60 * (1 - math.exp(-t / 0.9)), 0, 10, color=RED, width=3.5)
    p.fn(lambda t: 60 * (1 - math.exp(-t / 2.6)), 0, 10, color=BLUE, width=3.5)
    p.text(3.0, 62, "faster: more concentrated acid", dx=6, dy=-10, size=14, weight="bold", color=RED, anchor="start")
    p.text(5, 52, "slower: dilute acid", dx=10, dy=22, size=14, weight="bold", color=BLUE, anchor="start")
    s.line(p.X(0), p.Y(60), p.X(10), p.Y(60), color=MUTED, width=1.5, dash="6 5")
    p.text(9.8, 60, "same final volume", dy=-14, size=13, color=MUTED, anchor="end")
    s.line(p.X(0), p.Y(0), p.X(1.4), p.Y(60 / 0.9 * 1.4 * 0.62), color=PURPLE, width=2, dash="4 4")
    p.text(0.15, 75, "dashed tangent: gradient = rate", size=13, color=PURPLE, weight="bold", anchor="start")
    return s


@fig
def energy_distribution():
    s = Svg(760, 400, "Distribution of particle energies at two temperatures",
            "The number of particles with each kinetic energy at a lower temperature T1 and a higher temperature T2. At T2 the "
            "curve is flatter and shifted to the right, so many more particles have energy equal to or greater than the activation "
            "energy Ea (shaded). A catalyst lowers Ea, which also increases the number of particles able to react.")
    p = Plot(s, 80, 330, 600, 260, (0, 10), (0, 10))
    p.axes("kinetic energy of particles", "number of particles", zero=False)
    def mb(e, a):
        return 9.6 * (e / a) ** 1.0 * math.exp(1 - e / a)
    ea, eac = 6.2, 4.6
    pts2 = [(e / 20, mb(e / 20, 2.4) * 0.72) for e in range(0, 200)]
    p.shade([(ea, 0)] + [pt for pt in pts2 if pt[0] >= ea] + [(9.95, 0)], fill="#fecaca", opacity=0.9)
    p.fn(lambda e: mb(e, 1.5), 0, 9.95, color=BLUE, width=3.2)
    p.fn(lambda e: mb(e, 2.4) * 0.72, 0, 9.95, color=RED, width=3.2)
    p.text(1.5, 9.6, "T₁ (lower)", dx=10, dy=-6, size=14, weight="bold", color=BLUE, anchor="start")
    p.text(7.2, 3.4, "T₂ (higher)", dx=6, dy=-14, size=14, weight="bold", color=RED, anchor="start")
    p.guide(ea, 7.5, to_y=False)
    p.text(ea, 7.5, "Ea", dy=-10, size=15, weight="bold", color=PURPLE)
    p.guide(eac, 7.5, to_y=False, color=GREEN)
    p.text(eac, 7.5, "Ea with catalyst", dy=-10, size=14, weight="bold", color=GREEN)
    p.text(8.2, 1.6, "particles able to react at T₂", dy=-24, size=13, color=RED, anchor="middle")
    return s


@fig
def equilibrium_time():
    s = Svg(760, 400, "Approaching dynamic equilibrium",
            "For A + B ⇌ C + D started with only A and B, the concentrations of reactants fall and of products rise until, at "
            "equilibrium, all concentrations stay constant. The forward rate falls and the backward rate rises until they are equal.")
    p = Plot(s, 90, 330, 560, 250, (0, 10), (0, 10))
    p.axes("time", "concentration", zero=False)
    p.fn(lambda t: 3.6 + 5.4 * math.exp(-t / 1.6), 0, 10, color=BLUE, width=3.5)
    p.fn(lambda t: 5.4 * (1 - math.exp(-t / 1.6)), 0, 10, color=RED, width=3.5)
    p.text(0.3, 9, "reactants", dx=10, size=15, weight="bold", color=BLUE, anchor="start")
    p.text(1.6, 3, "products", dx=10, dy=6, size=15, weight="bold", color=RED, anchor="start")
    x = p.X(6.2)
    s.line(x, p.Y(0), x, p.Y(9.8), color=MUTED, width=1.8, dash="6 5")
    p.text(8.1, 8.8, "equilibrium:", size=15, weight="bold", color=GREEN)
    p.text(8.1, 7.6, "concentrations constant", size=14, color=GREEN)
    p.text(8.1, 6.6, "(not necessarily equal)", size=13, color=MUTED)
    return s


# ═══ Group 5: non-metals and metals ══════════════════════════════════════════

def tube(s: Svg, pts):
    """A glass delivery tube along the points."""
    s.polyline(pts, color=INK, width=6)
    s.polyline(pts, color=GLASS, width=2.4)


def _gen_flask_thistle(s, x, ybase, reagents, liquid=WATER, dropping=False):
    top = conical(s, x, ybase, 130, 170, 0.35, liquid=liquid)
    s.rect(x - 20, top[1] - 6, 40, 12, fill="#a16207", stroke=INK, width=1.5, rx=3)
    if dropping:
        s.path(f"M {x - 22} {top[1] - 70} L {x + 2} {top[1] - 70} L {x - 4} {top[1] - 40} L {x - 4} {top[1] + 60} "
               f"M {x - 8} {top[1] - 40} L {x - 8} {top[1] + 60}", color=INK, width=2.5)
        s.polygon([(x - 34, top[1] - 120), (x + 14, top[1] - 120), (x - 6, top[1] - 70), (x - 14, top[1] - 70)],
                  fill="#ffffff", stroke=INK, width=2.5)
        s.rect(x - 14, top[1] - 58, 16, 6, fill=METAL, stroke=INK, width=1.2)
    else:
        s.path(f"M {x - 8} {top[1] - 70} L {x - 8} {ybase - 20} M {x - 2} {top[1] - 70} L {x - 2} {ybase - 20}", color=INK, width=2.5)
        s.path(f"M {x - 5} {top[1] - 70} m -18 -26 a 18 14 0 1 0 36 0 a 18 14 0 1 0 -36 0", color=INK, width=2.5, fill="#ffffff")
    chem(s, x, ybase + 20, reagents, size=14, color=MUTED)
    return (x + 8, top[1] + 4)


def _gen_flask_heated(s, x, ybase, reagents):
    cy = ybase - 150
    top = round_flask(s, x, cy, 52, neck=46, frac=0.45, liquid="#fde68a")
    s.rect(x - 16, top[1] - 6, 32, 12, fill="#a16207", stroke=INK, width=1.5, rx=3)
    s.path(f"M {x - 6} {top[1] - 60} L {x - 6} {cy + 30}", color=INK, width=2.5)
    s.path(f"M {x - 6} {top[1] - 60} m -16 -22 a 16 12 0 1 0 32 0 a 16 12 0 1 0 -32 0", color=INK, width=2.5, fill="#ffffff")
    tripod(s, x, cy + 56, ybase, w=110)
    burner(s, x, ybase)
    chem(s, x, ybase + 20, reagents, size=14, color=MUTED)
    return (x + 8, top[1] + 4)


def _gen_tube_heated(s, x, ybase, reagents):
    yt = ybase - 150
    s.raw(f'<g transform="rotate(-12 {x} {yt})">')
    s.path(f"M {x - 70} {yt - 16} L {x + 70} {yt - 16} A 16 16 0 0 1 {x + 70} {yt + 16} L {x - 70} {yt + 16}",
           color=INK, width=2.5, fill="#ffffff")
    s.rect(x + 10, yt - 2, 70, 16, fill="#e2e8f0", stroke="none", width=0)
    s.rect(x - 84, yt - 12, 16, 24, fill="#a16207", stroke=INK, width=1.5, rx=3)
    s.raw("</g>")
    burner(s, x + 45, ybase)
    chem(s, x, ybase + 20, reagents, size=14, color=MUTED)
    return (x - 80, yt + 18)


def _wash(s, x, ybase, label, liquid):
    w, h = 64, 120
    s.rect(x - w / 2, ybase - h, w, h, fill="#ffffff", stroke=INK, width=2.5, rx=8)
    s.rect(x - w / 2 + 2, ybase - h * 0.55, w - 4, h * 0.55 - 2, fill=liquid, stroke="none", width=0)
    tube(s, [(x - 12, ybase - h - 30), (x - 12, ybase - 20)])
    tube(s, [(x + 12, ybase - h + 10), (x + 12, ybase - h - 30)])
    chem(s, x, ybase + 18, label, size=13, color=MUTED)
    return (x - 12, ybase - h - 30), (x + 12, ybase - h - 30)


def _tower(s, x, ybase, label):
    s.rect(x - 26, ybase - 150, 52, 130, fill="#f1f5f9", stroke=INK, width=2.5, rx=6)
    import random
    rnd = random.Random(9)
    for _ in range(30):
        s.circle(x + rnd.uniform(-20, 20), ybase - rnd.uniform(28, 145), 4, fill="#ffffff", stroke=MUTED, width=1)
    chem(s, x, ybase + 2, label, size=13, color=MUTED)
    return (x, ybase - 20), (x, ybase - 150)


def _collect(s, x, ybase, how, gas):
    if how == "water":
        s.rect(x - 90, ybase - 70, 180, 70, fill="#ffffff", stroke=INK, width=2.5, rx=4)
        s.rect(x - 88, ybase - 52, 176, 50, fill=WATER, stroke="none", width=0)
        s.rect(x - 28, ybase - 190, 56, 160, fill=WATER, stroke=INK, width=2.5, rx=4)
        s.rect(x - 26, ybase - 188, 52, 70, fill="#ffffff", stroke="none", width=0)
        s.rect(x - 34, ybase - 34, 68, 8, fill=METAL, stroke=INK, width=1.5)
        chem(s, x, ybase - 154, gas, size=17, weight="bold", color=BLUE)
        s.text(x, ybase + 20, "collected over water", size=13, color=MUTED)
        return [(x - 70, ybase - 40), (x, ybase - 40), (x, ybase - 100)]
    if how == "down":
        s.rect(x - 32, ybase - 170, 64, 170, fill="#ffffff", stroke=INK, width=2.5, rx=4)
        s.rect(x - 32, ybase - 60, 64, 58, fill="#bbf7d0", stroke="none", width=0, opacity=0.8)
        chem(s, x, ybase - 30, gas, size=16, weight="bold", color=GREEN)
        s.text(x, ybase + 20, "downward delivery", size=13, color=MUTED)
        s.text(x, ybase + 36, "(gas denser than air)", size=12, color=MUTED)
        return [(x, ybase - 200), (x, ybase - 20)]
    s.rect(x - 32, ybase - 170, 64, 170, fill="#ffffff", stroke=INK, width=2.5, rx=4)
    s.rect(x - 32, ybase - 168, 64, 58, fill="#e0e7ff", stroke="none", width=0, opacity=0.9)
    chem(s, x, ybase - 140, gas, size=16, weight="bold", color=PURPLE)
    s.text(x, ybase + 20, "upward delivery", size=13, color=MUTED)
    s.text(x, ybase + 36, "(gas lighter than air)", size=12, color=MUTED)
    return [(x, ybase + 30 - 30), (x, ybase - 150)]


def gas_rig(name, title_, desc, gen, reagents, washes, collect, gas, heading, width=800, liquid=WATER, dropping=False):
    s = Svg(width, 460, title_, desc)
    yb = 400
    if gen == "thistle":
        out = _gen_flask_thistle(s, 110, yb, reagents, liquid=liquid, dropping=dropping)
    elif gen == "heated":
        out = _gen_flask_heated(s, 110, yb, reagents)
    else:
        out = _gen_tube_heated(s, 140, yb, reagents)
    x = 300 if gen != "tube" else 340
    prev = out
    pts = [prev]
    for kind, label, liq in washes:
        if kind == "wash":
            inlet, outlet = _wash(s, x, yb, label, liq)
            tube(s, [prev, (prev[0], min(prev[1], inlet[1])) if False else prev, (inlet[0], prev[1]), inlet])
            prev = outlet
        else:
            bottom, topp = _tower(s, x, yb, label)
            tube(s, [prev, (x - 40, prev[1]), (x - 40, yb - 10), (x, yb - 10), bottom])
            prev = topp
        x += 110
    cx = x + 60
    target = _collect(s, cx, yb, collect, gas)
    if collect == "water":
        tube(s, [prev, (prev[0] + 20, prev[1]), (target[0][0], prev[1]), target[0], target[1], target[2]])
    elif collect == "down":
        tube(s, [prev, (target[0][0], prev[1]), target[1]])
    else:
        tube(s, [prev, (prev[0], prev[1]), (cx - 60, prev[1]), (cx - 60, yb + 6), (cx, yb + 6), target[1]])
    title(s, heading, y=28)
    return s


@fig
def hydrogen_prep():
    return gas_rig("hydrogen-prep", "Laboratory preparation of hydrogen",
                   "Granulated zinc reacts with dilute hydrochloric acid added through a thistle funnel. The hydrogen passes along a "
                   "delivery tube and is collected over water in an inverted gas jar, because it is almost insoluble in water.",
                   "thistle", "Zn + dilute HCl", [], "water", "H_2", "Zn + 2HCl → ZnCl₂ + H₂")


@fig
def oxygen_prep():
    return gas_rig("oxygen-prep", "Laboratory preparation of oxygen",
                   "Hydrogen peroxide solution is dripped from a dropping funnel onto manganese(IV) oxide, which catalyses its "
                   "decomposition. The oxygen is collected over water.",
                   "thistle", "H_2O_2 on MnO_2", [], "water", "O_2", "2H₂O₂ → 2H₂O + O₂ (MnO₂ catalyst)", dropping=True,
                   liquid="#e2e8f0")


@fig
def chlorine_prep():
    return gas_rig("chlorine-prep", "Laboratory preparation of chlorine",
                   "Concentrated hydrochloric acid is heated with manganese(IV) oxide. The gas passes through water, which removes "
                   "hydrogen chloride, then through concentrated sulphuric acid, which dries it. Chlorine is collected by downward "
                   "delivery, because it is denser than air. Done in a fume cupboard.",
                   "heated", "MnO_2 + conc. HCl", [("wash", "water", WATER), ("wash", "conc. H_2SO_4", "#fef9c3")],
                   "down", "Cl_2", "MnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂ (fume cupboard)")


@fig
def ammonia_prep():
    return gas_rig("ammonia-prep", "Laboratory preparation of ammonia",
                   "A mixture of calcium hydroxide and ammonium chloride is heated in a test tube sloping slightly downwards. The "
                   "ammonia is dried by passing through a tower of calcium oxide (quicklime) and collected by upward delivery, "
                   "because it is lighter than air.",
                   "tube", "Ca(OH)_2 + NH_4Cl", [("tower", "CaO", None)], "up", "NH_3",
                   "Ca(OH)₂ + 2NH₄Cl → CaCl₂ + 2H₂O + 2NH₃")


@fig
def gas_collection():
    s = Svg(800, 380, "Three ways to collect a gas",
            "Over water, for gases that are insoluble or only slightly soluble (hydrogen, oxygen, nitrogen). Downward delivery "
            "into an upright jar, for gases denser than air (chlorine, carbon(IV) oxide, sulphur(IV) oxide, hydrogen chloride). "
            "Upward delivery into an inverted jar, for gases lighter than air (ammonia, hydrogen).")
    for cx, how, gas, ex in [(140, "water", "gas", "H₂, O₂, N₂, CO"), (420, "down", "gas", "Cl₂, CO₂, SO₂, HCl"),
                             (660, "up", "gas", "NH₃ (and H₂)")]:
        t = _collect(s, cx, 300, how, gas)
        if how == "water":
            tube(s, [(cx - 120, 260), (cx - 70, 260), *t])
        elif how == "down":
            tube(s, [(cx - 90, t[0][1]), *t])
        else:
            tube(s, [(cx - 90, 306), (cx, 306), t[1]])
        s.text(cx, 350, ex, size=14, weight="bold")
    title(s, "Choose by solubility and density of the gas", y=28)
    return s


@fig
def air_composition():
    s = Svg(720, 380, "Composition of dry air by volume",
            "Dry air is about 78% nitrogen, 21% oxygen, 0.93% argon and other noble gases, and 0.04% carbon(IV) oxide, with "
            "variable amounts of water vapour and pollutants.")
    cx, cy, r, r2 = 210, 200, 140, 70
    parts = [(78.08, "Nitrogen 78%", BLUE, F_BLUE), (20.95, "Oxygen 21%", RED, F_RED), (0.97, "Argon, others ~1%", PURPLE, F_PURPLE)]
    a = -90
    for v, lab, col, fill in parts:
        b = a + v * 3.6
        x1, y1 = cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a))
        x2, y2 = cx + r * math.cos(math.radians(b)), cy + r * math.sin(math.radians(b))
        x3, y3 = cx + r2 * math.cos(math.radians(b)), cy + r2 * math.sin(math.radians(b))
        x4, y4 = cx + r2 * math.cos(math.radians(a)), cy + r2 * math.sin(math.radians(a))
        large = 1 if v > 50 else 0
        s.path(f"M {x1:.1f} {y1:.1f} A {r} {r} 0 {large} 1 {x2:.1f} {y2:.1f} L {x3:.1f} {y3:.1f} A {r2} {r2} 0 {large} 0 "
               f"{x4:.1f} {y4:.1f} Z", color="#ffffff", width=2, fill=col)
        a = b
    s.text(cx, cy - 8, "dry air", size=17, weight="bold")
    s.text(cx, cy + 14, "by volume", size=14, color=MUTED)
    rows = [("Nitrogen, N₂", "78%", BLUE), ("Oxygen, O₂", "21%", RED), ("Argon and other noble gases", "0.93%", PURPLE),
            ("Carbon(IV) oxide, CO₂", "0.04%", GREEN), ("Water vapour", "variable", TEAL)]
    for i, (n, v, col) in enumerate(rows):
        y = 110 + i * 44
        s.rect(400, y - 10, 20, 20, fill=col, stroke=col, width=1, rx=3)
        s.text(430, y, n, size=15, anchor="start")
        s.text(700, y, v, size=15, anchor="end", weight="bold", color=col)
    title(s, "Air is a mixture, not a compound", y=30)
    return s


@fig
def haber_process():
    s = Svg(800, 400, "The Haber process",
            "Nitrogen from air and hydrogen from natural gas are mixed in a 1 : 3 ratio, compressed to about 200 atm and passed "
            "over an iron catalyst at about 450 °C in the converter. About 15% forms ammonia. The mixture is cooled so that ammonia "
            "liquefies and is removed; the unreacted nitrogen and hydrogen are recycled.")
    a = box(s, 110, 110, 170, 70, ["N₂ + 3H₂", "1 : 3 by volume"], BLUE, F_BLUE, size=16)
    b = box(s, 320, 110, 170, 70, ["Compressor", "about 200 atm"], PURPLE, F_PURPLE, size=16)
    c = box(s, 540, 110, 190, 84, ["Converter", "iron catalyst", "about 450 °C"], RED, F_RED, size=16)
    d = box(s, 540, 270, 190, 70, ["Cooler", "NH₃ liquefies"], TEAL, F_TEAL, size=16)
    e = box(s, 320, 270, 170, 70, ["Liquid ammonia", "to storage"], GREEN, F_GREEN, size=16)
    link(s, a, b, color=INK)
    link(s, b, c, color=INK)
    link(s, c, d, color=INK)
    link(s, d, e, color=INK)
    s.path("M 635 270 C 760 240, 760 60, 560 55 L 330 55 L 330 72", color=ORANGE, width=2.5, dash="8 6", arrow="end")
    for i, t in enumerate(("unreacted", "N₂ + H₂", "recycled")):
        s.label(742, 150 + i * 20, t, size=14, color=ORANGE, weight="bold")
    chem(s, 400, 370, "N_2 + 3H_2 ⇌ 2NH_3     ΔH = −92 kJ/mol", size=17, weight="bold")
    return s


@fig
def nitrogen_cycle():
    s = Svg(800, 500, "The nitrogen cycle",
            "Nitrogen in the air is fixed by lightning, by nitrogen-fixing bacteria in the root nodules of legumes and by the "
            "Haber process (fertilisers). Plants absorb nitrates and make proteins; animals eat plants. Dead matter and wastes "
            "are decomposed to ammonium compounds, which nitrifying bacteria turn into nitrites and nitrates. Denitrifying "
            "bacteria return nitrogen gas to the air.")
    air = box(s, 400, 60, 280, 56, ["Nitrogen in the air, N₂"], BLUE, F_BLUE, size=17)
    fix = box(s, 140, 200, 230, 90, ["Fixation", "lightning, root-nodule", "bacteria, Haber process"], GREEN, F_GREEN, size=15)
    nit = box(s, 400, 270, 220, 70, ["Nitrates in soil", "NO₃⁻"], ORANGE, F_AMBER, size=16)
    pl = box(s, 660, 200, 220, 70, ["Plants", "make proteins"], GREEN, F_GREEN, size=16)
    an = box(s, 660, 340, 220, 70, ["Animals", "eat plants"], PURPLE, F_PURPLE, size=16)
    dec = box(s, 400, 430, 260, 70, ["Decay and wastes", "→ ammonium (NH₄⁺)"], MUTED, F_GREY, size=16)
    link(s, air, fix, color=GREEN)
    link(s, fix, nit, color=GREEN)
    link(s, nit, pl, color=GREEN)
    link(s, pl, an, color=PURPLE)
    s.path("M 660 375 C 660 430, 600 440, 532 440", color=MUTED, width=2.5, arrow="end")
    s.path("M 560 236 C 560 300, 600 420, 532 420", color=MUTED, width=2, dash="5 5", arrow="end")
    s.path("M 400 395 L 400 307", color=ORANGE, width=2.5, arrow="end")
    s.text(410, 352, "nitrifying bacteria", size=13, color=ORANGE, anchor="start", weight="bold")
    s.path("M 470 235 C 520 160, 520 120, 470 90", color=RED, width=2.5, dash="7 5", arrow="end")
    s.text(458, 150, "denitrifying", size=13, color=RED, anchor="end", weight="bold")
    s.text(458, 166, "bacteria", size=13, color=RED, anchor="end", weight="bold")
    return s


@fig
def contact_process():
    s = Svg(800, 420, "The Contact process",
            "Sulphur is burned in air to give sulphur(IV) oxide, which is purified and dried, then oxidised to sulphur(VI) oxide over "
            "vanadium(V) oxide at about 450 °C and 1 to 2 atm. The sulphur(VI) oxide is absorbed in concentrated sulphuric acid to "
            "form oleum, which is diluted with the right amount of water to give sulphuric acid.")
    steps = [("Burner", "S + O₂ → SO₂", ORANGE, F_AMBER), ("Purifier", "dust removed, dried", TEAL, F_TEAL),
             ("Converter", "V₂O₅, 450 °C, 1–2 atm", RED, F_RED), ("Absorber", "SO₃ into conc. H₂SO₄", PURPLE, F_PURPLE),
             ("Oleum", "H₂S₂O₇", BLUE, F_BLUE), ("Diluted", "H₂SO₄ (98%)", GREEN, F_GREEN)]
    pos = [(130, 120), (400, 120), (670, 120), (670, 290), (400, 290), (130, 290)]
    boxes = [box(s, x, y, 220, 70, [a, b], col, fill, size=16) for (x, y), (a, b, col, fill) in zip(pos, steps)]
    for a, b in zip(boxes, boxes[1:]):
        link(s, a, b, color=INK, gap=4)
    chem(s, 400, 384, "2SO_2 + O_2 ⇌ 2SO_3     ΔH = −197 kJ/mol", size=17, weight="bold")
    s.text(400, 220, "SO₃ is not absorbed directly in water: it forms a mist of acid", size=14, color=MUTED, italic=True)
    title(s, "Manufacturing sulphuric acid", y=40)
    return s


@fig
def carbon_allotropes():
    s = Svg(800, 400, "Diamond and graphite",
            "In diamond each carbon atom is joined to four others in a rigid three-dimensional tetrahedral network, so diamond is "
            "very hard and does not conduct electricity. In graphite each carbon is joined to three others in flat hexagonal layers "
            "held by weak forces; the layers slide, and one electron per atom is delocalised, so graphite is soft and conducts.")
    s.text(200, 40, "Diamond", size=18, weight="bold", color=BLUE)
    pts = {}
    cx, cy = 200, 200
    ring = [(cx + 90 * math.cos(math.radians(a)), cy + 60 * math.sin(math.radians(a))) for a in (90, 210, 330)]
    top = (cx, cy - 100)
    centre = (cx, cy)
    for q in ring + [top]:
        s.line(centre[0], centre[1], q[0], q[1], color=INK, width=3)
    for q in ring:
        for d in (-1, 1):
            r2 = (q[0] + d * 50, q[1] + 60)
            s.line(q[0], q[1], r2[0], r2[1], color=MUTED, width=2.5)
            s.circle(r2[0], r2[1], 9, fill=F_BLUE, stroke=BLUE, width=2)
    for q in ring + [top, centre]:
        s.circle(q[0], q[1], 13, fill=F_BLUE, stroke=BLUE, width=2.5)
    s.text(200, 345, "each C bonded to 4 others", size=14, color=MUTED)
    s.text(200, 365, "rigid 3-D network: very hard", size=14, color=MUTED)
    s.text(590, 40, "Graphite", size=18, weight="bold", color=PURPLE)
    def hexlayer(y0, shift):
        for i in range(3):
            hx = 470 + shift + i * 80
            pts_ = [(hx + 40 * math.cos(math.radians(a)), y0 + 22 * math.sin(math.radians(a))) for a in range(0, 360, 60)]
            s.polygon(pts_, fill="none", stroke=PURPLE, width=2.5)
            for q in pts_:
                s.circle(q[0], q[1], 5.5, fill=F_PURPLE, stroke=PURPLE, width=1.5)
    hexlayer(110, 0)
    hexlayer(200, 30)
    hexlayer(290, 0)
    for x in (480, 560, 640):
        s.line(x, 134, x + 15, 176, color=MUTED, width=1.5, dash="4 5")
        s.line(x + 15, 224, x, 266, color=MUTED, width=1.5, dash="4 5")
    s.text(590, 345, "flat layers of hexagons; weak forces between", size=14, color=MUTED)
    s.text(590, 365, "layers slide (soft); delocalised electrons conduct", size=14, color=MUTED)
    return s


@fig
def carbon_cycle():
    s = Svg(800, 460, "The carbon cycle",
            "Carbon(IV) oxide in the air is taken in by plants in photosynthesis and built into carbohydrates. Animals eat plants. "
            "Respiration by plants, animals and decomposers, and the burning of fuels, return carbon(IV) oxide to the air. Dead "
            "matter can form fossil fuels and limestone over millions of years.")
    air = box(s, 400, 70, 300, 60, ["Carbon(IV) oxide in the air"], BLUE, F_BLUE, size=17)
    pl = box(s, 150, 230, 200, 70, ["Green plants", "carbohydrates"], GREEN, F_GREEN, size=16)
    an = box(s, 400, 330, 200, 70, ["Animals", "eat plants"], PURPLE, F_PURPLE, size=16)
    dec = box(s, 150, 400, 220, 64, ["Dead matter", "decomposers"], MUTED, F_GREY, size=16)
    fu = box(s, 650, 330, 220, 70, ["Fossil fuels", "coal, oil, gas, wood"], ORANGE, F_AMBER, size=16)
    s.path("M 300 100 C 220 120, 160 150, 150 190", color=GREEN, width=2.5, arrow="end")
    s.text(195, 132, "photosynthesis", size=14, color=GREEN, weight="bold", anchor="end")
    s.path("M 250 230 C 320 240, 360 270, 380 292", color=PURPLE, width=2.5, arrow="end")
    s.text(330, 240, "feeding", size=13, color=PURPLE, weight="bold", anchor="start")
    s.path("M 300 330 C 250 340, 200 360, 165 366", color=MUTED, width=2.2, arrow="end")
    s.path("M 150 196 C 150 170, 250 120, 300 104", color=TEAL, width=2, dash="6 5")
    s.path("M 420 294 L 420 102", color=TEAL, width=2.5, dash="6 5", arrow="end")
    s.text(430, 200, "respiration", size=14, color=TEAL, weight="bold", anchor="start")
    s.path("M 650 294 C 650 200, 600 130, 552 100", color=RED, width=2.5, arrow="end")
    s.text(640, 196, "combustion", size=14, color=RED, weight="bold", anchor="start")
    s.path("M 262 410 C 420 440, 560 420, 600 368", color=ORANGE, width=2, dash="7 6", arrow="end")
    s.text(430, 438, "millions of years", size=13, color=ORANGE, anchor="middle", italic=True)
    return s


@fig
def co2_prep():
    return gas_rig("co2-prep", "Laboratory preparation of carbon(IV) oxide",
                   "Dilute hydrochloric acid is added through a thistle funnel to marble chips (calcium carbonate). The carbon(IV) "
                   "oxide is collected by downward delivery because it is denser than air (it can also be collected over water, as it "
                   "is only fairly soluble).",
                   "thistle", "CaCO_3 + dilute HCl", [], "down", "CO_2", "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂")


@fig
def reactivity_series():
    s = Svg(780, 560, "The reactivity series and methods of extraction",
            "Metals in order of reactivity: potassium, sodium, calcium, magnesium and aluminium are extracted by electrolysis of "
            "molten compounds; carbon fits between aluminium and zinc; zinc, iron, tin and lead are extracted by reduction with "
            "carbon or carbon(II) oxide; hydrogen fits between lead and copper; copper, mercury, silver and gold are less "
            "reactive, and silver and gold are found native.")
    metals = [("K", "potassium"), ("Na", "sodium"), ("Ca", "calcium"), ("Mg", "magnesium"), ("Al", "aluminium"),
              ("C", "carbon"), ("Zn", "zinc"), ("Fe", "iron"), ("Sn", "tin"), ("Pb", "lead"), ("H", "hydrogen"),
              ("Cu", "copper"), ("Hg", "mercury"), ("Ag", "silver"), ("Au", "gold")]
    y0 = 60
    for i, (sym, name) in enumerate(metals):
        y = y0 + i * 32
        ref = sym in ("C", "H")
        s.rect(80, y - 13, 190, 26, fill="#ffffff" if ref else F_GREY, stroke=MUTED if ref else INK, width=1.5, rx=5,
               dash="5 4" if ref else None)
        s.text(100, y, sym, size=15, weight="bold", anchor="start", color=MUTED if ref else INK)
        s.text(145, y, name, size=15, anchor="start", color=MUTED if ref else INK, italic=ref)
    s.arrow(40, y0 + 14 * 32, 40, y0 - 4, color=RED, width=3)
    s.text(26, y0 - 32, "more reactive", size=14, color=RED, weight="bold", anchor="start")
    def band(i0, i1, title_, sub, col, fill):
        ya, yb = y0 + i0 * 32 - 14, y0 + i1 * 32 + 14
        s.rect(300, ya, 440, yb - ya, fill=fill, stroke=col, width=2, rx=8)
        s.text(520, (ya + yb) / 2 - 10, title_, size=16, weight="bold", color=col)
        s.text(520, (ya + yb) / 2 + 12, sub, size=14, color=INK)
    band(0, 4, "Electrolysis of molten compounds", "most energy needed; ores very stable", RED, F_RED)
    band(6, 9, "Reduction with carbon / carbon(II) oxide", "blast furnace and similar", ORANGE, F_AMBER)
    band(11, 12, "Roasting / heating ore", "copper, mercury", BLUE, F_BLUE)
    band(13, 14, "Found native (uncombined)", "silver, gold", GREEN, F_GREEN)
    s.text(520, y0 + 5 * 32, "carbon reduces oxides of metals below it", size=13, color=MUTED, italic=True)
    s.text(520, y0 + 10 * 32, "metals above hydrogen give H₂ with dilute acids", size=13, color=MUTED, italic=True)
    return s


@fig
def solvay_process():
    s = Svg(800, 430, "The Solvay process for sodium carbonate",
            "Brine is saturated with ammonia, then carbon(IV) oxide is bubbled through it in a carbonating tower. Sodium "
            "hydrogencarbonate, which is only slightly soluble, precipitates and is filtered off, then heated to give sodium "
            "carbonate. The carbon(IV) oxide comes from heating limestone, and the ammonia is recovered and reused.")
    a = box(s, 120, 110, 190, 70, ["Brine", "+ ammonia"], BLUE, F_BLUE, size=16)
    b = box(s, 400, 110, 230, 84, ["Carbonating tower", "CO₂ bubbled in", "NaHCO₃ precipitates"], PURPLE, F_PURPLE, size=16)
    c = box(s, 680, 110, 190, 70, ["Filter", "solid NaHCO₃"], TEAL, F_TEAL, size=16)
    d = box(s, 680, 290, 190, 84, ["Heat", "2NaHCO₃ →", "Na₂CO₃ + H₂O + CO₂"], RED, F_RED, size=15)
    e = box(s, 400, 290, 230, 70, ["Sodium carbonate", "soda ash"], GREEN, F_GREEN, size=16)
    lime = box(s, 120, 290, 190, 84, ["Limestone kiln", "CaCO₃ → CaO + CO₂"], ORANGE, F_AMBER, size=15, bold_first=True)
    link(s, a, b, color=INK)
    link(s, b, c, color=INK)
    link(s, c, d, color=INK)
    link(s, d, e, color=INK)
    s.path("M 120 248 C 140 200, 250 200, 290 150", color=ORANGE, width=2.5, dash="7 5", arrow="end")
    s.text(160, 200, "CO₂", size=14, color=ORANGE, weight="bold")
    s.path("M 680 248 C 650 200, 560 200, 520 158", color=RED, width=2.2, dash="7 5", arrow="end")
    s.text(640, 200, "CO₂ reused", size=13, color=RED, weight="bold", anchor="start")
    chem(s, 400, 400, "NaCl + NH_3 + CO_2 + H_2O → NaHCO_3 + NH_4Cl", size=16, weight="bold")
    title(s, "Ammonia is recovered from NH₄Cl with CaO and reused", y=36, size=16)
    return s


@fig
def lime_cycle():
    s = Svg(780, 470, "The limestone cycle",
            "Heating limestone (calcium carbonate) in a lime kiln gives quicklime (calcium oxide) and carbon(IV) oxide. Adding "
            "water to quicklime gives slaked lime (calcium hydroxide) with much heat. Slaked lime dissolved in water is lime water; "
            "it absorbs carbon(IV) oxide and forms calcium carbonate again.")
    a = box(s, 390, 80, 300, 74, ["Limestone, CaCO₃", "building, cement, iron extraction"], BLUE, F_BLUE, size=16)
    b = box(s, 640, 290, 260, 74, ["Quicklime, CaO", "drying agent, steelmaking"], RED, F_RED, size=16)
    c = box(s, 140, 290, 260, 74, ["Slaked lime, Ca(OH)₂", "farm soils, mortar, whitewash"], GREEN, F_GREEN, size=16)
    s.path("M 540 100 C 640 120, 660 180, 650 248", color=ORANGE, width=3, arrow="end")
    s.text(618, 160, "heat about 900 °C", size=14, color=ORANGE, weight="bold", anchor="end")
    s.text(618, 178, "(lime kiln)", size=13, color=ORANGE, anchor="end")
    chem(s, 618, 198, "gives off CO_2", size=14, color=ORANGE, anchor="end")
    s.path("M 508 300 L 274 300", color=TEAL, width=3, arrow="end")
    s.text(390, 284, "add water (slaking)", size=14, color=TEAL, weight="bold")
    s.text(390, 322, "much heat; lumps crumble", size=13, color=TEAL)
    s.path("M 130 248 C 120 160, 160 110, 236 96", color=PURPLE, width=3, arrow="end")
    s.text(110, 160, "+ CO₂ from air", size=14, color=PURPLE, weight="bold", anchor="end")
    s.text(110, 178, "(mortar hardens;", size=13, color=PURPLE, anchor="end")
    s.text(110, 194, "lime water milky)", size=13, color=PURPLE, anchor="end")
    chem(s, 390, 400, "CaCO_3 → CaO + CO_2     CaO + H_2O → Ca(OH)_2     Ca(OH)_2 + CO_2 → CaCO_3 + H_2O", size=14,
         weight="bold")
    return s


@fig
def aluminium_cell():
    s = Svg(780, 480, "Extraction of aluminium by electrolysis",
            "Purified aluminium oxide (alumina) is dissolved in molten cryolite at about 950 °C in a steel tank lined with carbon, "
            "which is the cathode. Carbon anodes dip into the melt. Aluminium ions are reduced at the cathode and molten aluminium "
            "collects at the bottom and is tapped off. Oxide ions are oxidised to oxygen at the anodes, which burns the carbon "
            "anodes away as carbon(IV) oxide, so they must be replaced.")
    x0, x1 = 60, 560
    s.rect(x0, 160, x1 - x0, 220, fill="#475569", stroke=INK, width=3, rx=8)
    s.rect(x0 + 20, 170, x1 - x0 - 40, 196, fill="#1f2937", stroke="none", width=0, rx=6)
    s.rect(x0 + 20, 190, x1 - x0 - 40, 130, fill="#fdba74", stroke="none", width=0)
    s.rect(x0 + 20, 320, x1 - x0 - 40, 46, fill="#e5e7eb", stroke="none", width=0)
    xs = (170, 310, 450)
    for x in xs:
        s.rect(x - 34, 110, 68, 150, fill="#334155", stroke=INK, width=2)
        s.line(x, 110, x, 70, width=3)
    s.line(xs[0], 70, xs[-1], 70, width=3)
    s.text(310, 54, "carbon anodes (+): burn away, replaced", size=15, weight="bold", color=RED)
    s.text(580, 230, "alumina dissolved in", size=14, anchor="start")
    s.text(580, 248, "molten cryolite", size=14, anchor="start")
    s.text(580, 266, "(about 950 °C)", size=14, anchor="start")
    s.text(580, 340, "molten aluminium", size=14, anchor="start", weight="bold")
    s.text(580, 358, "tapped off", size=13, anchor="start", color=MUTED)
    s.text(310, 404, "carbon lining = cathode (−)", size=15, weight="bold", color=BLUE)
    chem(s, 310, 436, "cathode: Al^{3+} + 3e^− → Al", size=15, color=BLUE)
    chem(s, 310, 462, "anode: 2O^{2−} → O_2 + 4e^−  (O_2 then burns the carbon)", size=15, color=RED)
    return s


@fig
def blast_furnace():
    s = Svg(780, 560, "The blast furnace",
            "Iron ore (haematite), coke and limestone are loaded at the top. Hot air is blown in near the bottom. Coke burns to "
            "carbon(IV) oxide, which reacts with more coke to form carbon(II) oxide; this reduces the iron oxide to molten iron. "
            "Limestone decomposes to calcium oxide, which combines with sand to form molten slag. Molten iron and slag are tapped "
            "off at the bottom; waste gases leave at the top.")
    s.polygon([(300, 70), (420, 70), (470, 330), (480, 430), (240, 430), (250, 330)], fill="#e2e8f0", stroke=INK, width=3)
    s.polygon([(268, 400), (452, 400), (480, 430), (240, 430)], fill="#f97316", stroke="none", width=0)
    s.polygon([(272, 372), (448, 372), (452, 400), (268, 400)], fill="#a3a3a3", stroke="none", width=0)
    s.rect(240, 430, 240, 30, fill="#475569", stroke=INK, width=3)
    s.text(360, 50, "iron ore + coke + limestone", size=15, weight="bold")
    s.arrow(360, 56, 360, 76, color=INK, width=2.5)
    s.arrow(420, 110, 520, 80, color=MUTED, width=2.5)
    s.text(530, 80, "waste gases (CO₂, N₂, CO)", size=14, color=MUTED, anchor="start")
    for x1, x2 in ((150, 246), (570, 474)):
        s.arrow(x1, 350, x2, 350, color=RED, width=4)
    s.text(150, 374, "hot air", size=15, weight="bold", color=RED)
    s.text(600, 334, "hot air", size=15, weight="bold", color=RED)
    s.arrow(450, 386, 560, 386, color=MUTED, width=3)
    s.text(568, 386, "molten slag", size=14, anchor="start", weight="bold")
    s.arrow(470, 416, 560, 430, color=ORANGE, width=3)
    s.text(568, 432, "molten iron", size=14, anchor="start", weight="bold", color=ORANGE)
    rows = [(180, "Fe₂O₃ + 3CO → 2Fe + 3CO₂", "reduction (about 700 °C)"), (250, "CO₂ + C → 2CO", "carbon(II) oxide forms"),
            (310, "C + O₂ → CO₂", "coke burns: 1900 °C, heat")]
    for y, eq, note in rows:
        s.text(230, y, eq, size=14, anchor="end", weight="bold")
        s.text(230, y + 18, note, size=12, anchor="end", color=MUTED)
        s.line(236, y, 300 if y < 300 else 252, y, color=MUTED, width=1.2, dash="3 4")
    s.text(500, 220, "CaCO₃ → CaO + CO₂", size=14, anchor="start", weight="bold")
    s.text(500, 240, "CaO + SiO₂ → CaSiO₃ (slag)", size=14, anchor="start", weight="bold")
    s.line(440, 228, 496, 228, color=MUTED, width=1.2, dash="3 4")
    s.text(360, 500, "slag floats on the iron and protects it from re-oxidising", size=14, color=MUTED, italic=True)
    return s


@fig
def industry_siting():
    s = Svg(780, 470, "Factors in siting a chemical plant",
            "Factors that decide where a chemical plant is built: raw materials, energy supply, water, transport, labour, market, "
            "waste disposal, land and cost, safety and the environment, and government policy.")
    c = box(s, 390, 235, 220, 70, ["Chemical", "plant"], INK, F_GREY, size=19, bold_first=False)
    items = [("Raw materials", "near source cuts cost", BLUE, F_BLUE), ("Energy", "reliable, cheap power", RED, F_RED),
             ("Water", "for cooling, processing", TEAL, F_TEAL), ("Transport", "roads, rail, port", ORANGE, F_AMBER),
             ("Market", "near customers", GREEN, F_GREEN), ("Labour", "skilled workers", PURPLE, F_PURPLE),
             ("Waste and safety", "away from homes", RED, F_RED), ("Government", "incentives, permits", BLUE, F_BLUE)]
    import math as _m
    for i, (a, b, col, fill) in enumerate(items):
        ang = _m.radians(90 - i * 45)
        x, y = 390 + 290 * _m.cos(ang), 235 - 175 * _m.sin(ang)
        bx = box(s, x, y, 190, 62, [a, b], col, fill, size=15)
        link(s, bx, c, color=col, width=2)
    return s


@fig
def brewing_flow():
    s = Svg(800, 400, "Making beer: from grain to bottle",
            "Grain is malted (germinated and dried) so that enzymes turn starch into sugar. The malt is mashed with hot water, "
            "boiled with hops for flavour, cooled, and fermented by yeast, which turns sugar into ethanol and carbon(IV) oxide. "
            "The beer is matured, filtered and bottled.")
    steps = [("Malting", "grain germinates", ORANGE, F_AMBER), ("Mashing", "enzymes: starch → sugar", TEAL, F_TEAL),
             ("Boiling", "with hops (flavour)", RED, F_RED), ("Fermenting", "yeast: sugar → ethanol", PURPLE, F_PURPLE),
             ("Maturing", "flavour develops", BLUE, F_BLUE), ("Bottling", "filtered, CO₂ added", GREEN, F_GREEN)]
    pos = [(140, 120), (400, 120), (660, 120), (660, 280), (400, 280), (140, 280)]
    boxes = [box(s, x, y, 220, 70, [a, b], col, fill, size=16) for (x, y), (a, b, col, fill) in zip(pos, steps)]
    for a, b in zip(boxes, boxes[1:]):
        link(s, a, b, color=INK, gap=4)
    chem(s, 400, 370, "C_6H_{12}O_6 → 2C_2H_5OH + 2CO_2   (yeast enzymes, about 30 °C)", size=16, weight="bold")
    title(s, "Fermentation is the key chemical step", y=40)
    return s


# ═══ Group 6: organic chemistry ══════════════════════════════════════════════

def _bond(s: Svg, x1, y1, x2, y2, order=1, color=INK, trim=13):
    d = math.hypot(x2 - x1, y2 - y1)
    ux, uy = (x2 - x1) / d, (y2 - y1) / d
    ax, ay, bx, by = x1 + ux * trim, y1 + uy * trim, x2 - ux * trim, y2 - uy * trim
    nx, ny = -uy, ux
    offs = {1: [0], 2: [-3.5, 3.5], 3: [-5, 0, 5]}[order]
    for o in offs:
        s.line(ax + nx * o, ay + ny * o, bx + nx * o, by + ny * o, color=color, width=2.4)


def disp(s: Svg, x0, y0, row, gap=62, arm=44, size=18, color=INK, hl=None):
    """Displayed formula of a chain drawn left to right.

    row: list of atoms, each a dict with keys
      atom  - label (default "C")
      up, down, left, right - substituent label; a leading "=" means a double bond, "#" a triple bond
      next  - bond order to the next atom in the row (default 1)
    hl: set of substituent labels to colour (e.g. {"OH"})."""
    hl = hl or set()
    pos = []
    for i, a in enumerate(row):
        x = x0 + i * gap
        pos.append((x, y0))
        lab = a.get("atom", "C")
        chem(s, x, y0, lab, size=size, weight="bold", color=PURPLE if lab in hl else color)
        for key, dx, dy in (("up", 0, -arm), ("down", 0, arm), ("left", -arm, 0), ("right", arm, 0)):
            sub = a.get(key)
            if not sub:
                continue
            order = 1
            if sub[0] in "=#":
                order = 2 if sub[0] == "=" else 3
                sub = sub[1:]
            sx, sy = x + dx, y0 + dy
            wide = len(sub.replace("_", "")) > 1
            if key in ("left", "right") and wide:
                sx += (dx / arm) * 10 * (len(sub) - 1)
            _bond(s, x, y0, sx, sy, order, trim=12 if not wide or key in ("up", "down") else 12)
            col = PURPLE if sub in hl else color
            chem(s, sx, sy, sub, size=size - 1, weight="bold", color=col,
                 anchor="middle")
    for i in range(len(row) - 1):
        _bond(s, pos[i][0], y0, pos[i + 1][0], y0, row[i].get("next", 1), color=RED if row[i].get("next", 1) > 1 else INK)
    return pos


def CH(up="H", down="H", **kw):
    return {"atom": "C", "up": up, "down": down, **kw}


@fig
def homologous_series():
    s = Svg(800, 640, "First members of six homologous series",
            "Displayed formulas with their functional groups: methane (alkane, C–C single bonds only), ethene (alkene, C=C), ethyne "
            "(alkyne, C≡C), ethanol (alkanol, –OH), ethanoic acid (alkanoic acid, –COOH) and methyl ethanoate (alkanoate or ester, "
            "–COO–).")
    cells = [(200, 140, "Alkanes, CₙH₂ₙ₊₂", "methane, CH₄", [CH(left="H", right="H")], set()),
             (600, 140, "Alkenes, CₙH₂ₙ", "ethene, C₂H₄", [CH(next=2), CH()], set()),
             (200, 320, "Alkynes, CₙH₂ₙ₋₂", "ethyne, C₂H₂", [{"atom": "C", "left": "H", "next": 3}, {"atom": "C", "right": "H"}], set()),
             (600, 320, "Alkanols, CₙH₂ₙ₊₁OH", "ethanol, C₂H₅OH", [CH(left="H"), CH(right="OH")], {"OH"}),
             (200, 500, "Alkanoic acids, CₙH₂ₙ₊₁COOH", "ethanoic acid, CH₃COOH", [CH(left="H"), {"atom": "C", "up": "=O", "right": "OH"}], {"OH", "O"}),
             (600, 500, "Esters (alkanoates)", "methyl ethanoate, CH₃COOCH₃", [CH(left="H"), {"atom": "C", "up": "=O"}, {"atom": "O"}, CH(right="H")], {"O"})]
    for cx, cy, head, name, row, hl in cells:
        s.rect(cx - 190, cy - 82, 380, 168, fill="#ffffff", stroke=MUTED, width=1.5, rx=10)
        s.text(cx, cy - 64, head, size=15, weight="bold", color=BLUE)
        n = len(row)
        disp(s, cx - (n - 1) * 31, cy + 2, row, hl=hl)
        s.text(cx, cy + 72, name, size=14, color=MUTED)
    title(s, "Each series has its own functional group (purple) and general formula", y=30, size=16)
    return s


@fig
def isomers():
    s = Svg(800, 590, "Structural isomers",
            "Chain isomers: butane (a straight chain) and 2-methylpropane (a branched chain) are both C4H10. Position isomers: "
            "but-1-ene and but-2-ene are both C4H8. Functional group isomers: ethanol and methoxymethane are both C2H6O.")
    s.text(400, 30, "Same molecular formula, different structures", size=16, color=MUTED)
    s.text(40, 70, "Chain isomers, C₄H₁₀", size=16, weight="bold", color=BLUE, anchor="start")
    disp(s, 90, 140, [CH(left="H"), CH(), CH(), CH(right="H")])
    s.text(184, 210, "butane (bp −0.5 °C)", size=14, color=MUTED)
    disp(s, 500, 150, [CH(left="H"), CH(up=None), CH(right="H")])
    disp(s, 562, 88, [CH(up="H", left="H", right="H", down=None)])
    s.line(562, 102, 562, 136, width=2.4)
    s.text(562, 214, "2-methylpropane (bp −12 °C)", size=14, color=MUTED)
    s.text(40, 260, "Position isomers, C₄H₈", size=16, weight="bold", color=BLUE, anchor="start")
    disp(s, 90, 330, [CH(left="H", down=None, next=2), CH(down=None), CH(), CH(right="H")])
    s.text(184, 400, "but-1-ene", size=14, color=MUTED)
    disp(s, 500, 330, [CH(left="H"), CH(down=None, next=2), CH(down=None), CH(right="H")])
    s.text(594, 400, "but-2-ene", size=14, color=MUTED)
    s.text(40, 440, "Functional group isomers, C₂H₆O", size=16, weight="bold", color=BLUE, anchor="start")
    disp(s, 110, 500, [CH(left="H"), CH(right="OH")], hl={"OH"})
    s.text(150, 572, "ethanol (an alkanol)", size=14, color=MUTED)
    disp(s, 500, 500, [CH(left="H"), {"atom": "O"}, CH(right="H")], hl={"O"})
    s.text(562, 572, "methoxymethane (an ether)", size=14, color=MUTED)
    return s


@fig
def alkane_boiling():
    s = Svg(760, 420, "Boiling points of the first eight alkanes",
            "Boiling point rises steadily with the number of carbon atoms: methane −162 °C, ethane −89, propane −42, butane −0.5, "
            "pentane 36, hexane 69, heptane 98, octane 126 °C. The first four are gases at room temperature.")
    bp = [-162, -89, -42, -0.5, 36, 69, 98, 126]
    names = ["CH₄", "C₂H₆", "C₃H₈", "C₄H₁₀", "C₅H₁₂", "C₆H₁₄", "C₇H₁₆", "C₈H₁₈"]
    p = Plot(s, 100, 330, 560, 260, (0, 9), (-180, 150))
    p.axes("number of carbon atoms", "boiling point (°C)", xticks=list(range(1, 9)), yticks=[(-150, "−150"), (-100, "−100"),
           (-50, "−50"), (0, "0"), (50, "50"), (100, "100")], zero=False)
    s.line(p.X(0), p.Y(25), p.X(9), p.Y(25), color=GREEN, width=1.6, dash="6 5")
    p.text(8.8, 25, "room temperature (25 °C)", dy=-12, size=13, color=GREEN, anchor="end")
    pts = list(zip(range(1, 9), bp))
    p.poly(pts, color=BLUE, width=3)
    for (n, b), nm in zip(pts, names):
        p.dot(n, b, color=BLUE)
        p.text(n, b, nm, dx=-8, dy=-14, size=13, anchor="end", color=INK)
    p.text(2, -150, "gases", size=15, weight="bold", color=RED)
    p.text(5, 112, "liquids", size=15, weight="bold", color=BLUE)
    title(s, "Larger molecules: stronger van der Waals forces", y=30)
    return s


@fig
def methane_prep():
    return gas_rig("methane-prep", "Laboratory preparation of methane",
                   "A mixture of anhydrous sodium ethanoate and soda lime is heated in a hard-glass test tube. Methane is given off and "
                   "collected over water, as it is insoluble.",
                   "tube", "CH_3COONa + soda lime", [], "water", "CH_4", "CH₃COONa + NaOH → CH₄ + Na₂CO₃ (soda lime, heat)")


@fig
def ethene_prep():
    return gas_rig("ethene-prep", "Laboratory preparation of ethene",
                   "Ethanol is heated with excess concentrated sulphuric acid at about 170 °C. The gas is passed through sodium hydroxide "
                   "solution to remove sulphur(IV) oxide and carbon(IV) oxide impurities, and collected over water.",
                   "heated", "C_2H_5OH + excess conc. H_2SO_4", [("wash", "NaOH(aq)", "#e2e8f0")], "water", "C_2H_4",
                   "C₂H₅OH → C₂H₄ + H₂O (conc. H₂SO₄, 170 °C)")


@fig
def ethyne_prep():
    return gas_rig("ethyne-prep", "Laboratory preparation of ethyne",
                   "Water is dripped from a dropping funnel onto calcium carbide in a flask. Ethyne is given off and collected over "
                   "water.", "thistle", "CaC_2 + water (dropwise)", [], "water", "C_2H_2", "CaC₂ + 2H₂O → Ca(OH)₂ + C₂H₂",
                   dropping=True, liquid="#e2e8f0")


@fig
def ethene_additions():
    s = Svg(800, 560, "Addition reactions of ethene",
            "Ethene in the centre. With hydrogen (nickel catalyst, 150 °C) it gives ethane; with bromine it gives 1,2-dibromoethane "
            "and the bromine is decolourised; with steam (phosphoric acid catalyst, 300 °C, 60 atm) it gives ethanol; with hydrogen "
            "bromide it gives bromoethane.")
    disp(s, 369, 280, [CH(left="H", down="H", up="H", next=2), CH(right="H", up="H", down="H")])
    s.rect(300, 220, 200, 120, fill="none", stroke=RED, width=2, rx=12, dash="6 5")
    s.text(512, 286, "ethene", size=15, weight="bold", color=RED, anchor="start")
    targets = [(160, 100, "+ H₂ (Ni, 150 °C)", "ethane", [CH(left="H"), CH(right="H")], set()),
               (640, 100, "+ Br₂ (room temperature)", "1,2-dibromoethane", [CH(left="H", up="Br"), CH(right="H", up="Br")], {"Br"}),
               (160, 460, "+ H₂O (steam, H₃PO₄, 300 °C)", "ethanol", [CH(left="H"), CH(right="OH")], {"OH"}),
               (640, 460, "+ HBr", "bromoethane", [CH(left="H"), CH(right="Br")], {"Br"})]
    for cx, cy, lab, name, row, hl in targets:
        disp(s, cx - 31, cy, row, hl=hl)
        s.text(cx, cy + 74, name, size=14, weight="bold")
        tx, ty = (cx + 400) / 2, (cy + 280) / 2
        s.arrow(400 + (cx - 400) * 0.28, 280 + (cy - 280) * 0.38, cx + (400 - cx) * 0.3, cy + (280 - cy) * 0.34, color=BLUE, width=2.5)
        s.label(tx, ty, lab, size=13, color=BLUE, weight="bold")
    s.text(400, 30, "The C=C double bond opens and new atoms add on", size=16, color=MUTED)
    return s


@fig
def fractionating_column():
    s = Svg(800, 590, "Fractional distillation of crude oil",
            "Crude oil is heated in a furnace to about 400 °C and the vapour enters near the bottom of a tall column. The column is "
            "hot at the bottom and cool at the top. Vapours rise and condense at the level where the temperature falls below their "
            "boiling point. From top to bottom: refinery gas, petrol, naphtha, kerosene, diesel, lubricating oil and wax, fuel oil, "
            "and bitumen as the residue.")
    fr = [("Refinery gas", "C_1–C_4 · below 40 °C · LPG cooking gas, fuel gas"),
          ("Petrol (gasoline)", "C_5–C_{10} · 40–175 °C · fuel for cars and motorbikes"),
          ("Naphtha", "C_7–C_{14} · 90–200 °C · raw material for chemicals"),
          ("Kerosene (paraffin)", "C_{10}–C_{16} · 175–250 °C · jet fuel, lamps, stoves"),
          ("Diesel (gas oil)", "C_{14}–C_{20} · 250–350 °C · lorries, generators"),
          ("Lubricating oil and wax", "C_{20}–C_{35} · 350–400 °C · lubricants, candles"),
          ("Fuel oil", "C_{30}–C_{40} · above 400 °C · ships, power stations"),
          ("Bitumen (residue)", "above C_{40} · roads and roofing")]
    x0, x1, ytop, ybot = 250, 350, 70, 550
    s.raw('<defs><linearGradient id="colgrad" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fecaca"/>'
          '<stop offset="1" stop-color="#dbeafe"/></linearGradient></defs>')
    s.path(f"M {x0} {ybot} L {x0} {ytop + 20} Q {(x0 + x1) / 2} {ytop - 14} {x1} {ytop + 20} L {x1} {ybot} Z",
           color=INK, width=3, fill="url(#colgrad)")
    ys = [96 + i * 60 for i in range(8)]
    for i, (name, info) in enumerate(fr):
        y = ys[i]
        if i < 7:
            ty = y + 26
            s.line(x0 + 4, ty, x1 - 4, ty, color=MUTED, width=2)
            for bx in (x0 + 26, x0 + 50, x0 + 74):
                s.path(f"M {bx - 9} {ty} A 9 7 0 0 1 {bx + 9} {ty}", color=MUTED, width=1.6)
        s.line(x1, y, x1 + 26, y, color=INK, width=6)
        s.line(x1, y, x1 + 26, y, color=GLASS, width=2.5)
        s.head(x1 + 34, y, 0, color=INK, size=11)
        s.text(x1 + 44, y - 9, name, size=15, weight="bold", color=BLUE, anchor="start")
        chem(s, x1 + 44, y + 11, info, size=13, color=MUTED, anchor="start")
    # furnace and inlet
    yin = 486
    s.rect(50, 440, 120, 90, fill=F_AMBER, stroke=INK, width=2.5, rx=8)
    s.text(110, 466, "furnace", size=15, weight="bold")
    s.text(110, 486, "about 400 °C", size=13, color=MUTED)
    for fx in (80, 110, 140):
        s.path(f"M {fx} 524 C {fx + 9} 512, {fx + 6} 504, {fx} 498 C {fx - 6} 504, {fx - 9} 512, {fx} 524 Z",
               color=FLAME, width=1.5, fill="#fed7aa")
    s.arrow(14, 560, 60, 528, color=INK, width=2.5)
    s.text(14, 578, "crude oil in", size=13, color=MUTED, anchor="start")
    s.line(170, yin, x0, yin, color=INK, width=7)
    s.line(170, yin, x0, yin, color="#fde68a", width=3)
    s.text(210, yin - 14, "vapour", size=13, color=ORANGE, weight="bold")
    # temperature and rising arrows
    s.arrow(215, 420, 215, 110, color=RED, width=2.5)
    s.text(232, 92, "cool, about 25 °C", size=13, color=BLUE, anchor="end")
    s.text(232, 410, "hot", size=13, color=RED, anchor="end", weight="bold")
    s.text(205, 300, "vapours", size=13, color=MUTED, anchor="end")
    s.text(205, 316, "rise", size=13, color=MUTED, anchor="end")
    s.text(205, 332, "and cool", size=13, color=MUTED, anchor="end")
    title(s, "Each fraction condenses at its own level (approximate ranges)", y=26, size=16)
    return s


@fig
def cracking_lab():
    s = Svg(800, 470, "Cracking liquid paraffin in the laboratory",
            "Mineral wool soaked in liquid paraffin sits at the closed end of a horizontal boiling tube, with broken porcelain in "
            "the middle. The porcelain is heated strongly and the paraffin gently, so its vapour passes over the hot porcelain "
            "and cracks. The gaseous alkenes, mainly ethene, are collected over water. The delivery tube must be removed from "
            "the water before heating stops.")
    x0, x1, y = 60, 340, 266
    s.path(f"M {x1} {y - 22} L {x0 + 22} {y - 22} A 22 22 0 0 0 {x0 + 22} {y + 22} L {x1} {y + 22}", color=INK, width=2.5,
           fill="#ffffff")
    s.rect(x0 + 4, y - 18, 72, 36, fill="#fde68a", stroke="none", width=0, rx=12)
    for k in range(6):
        s.path(f"M {x0 + 10 + k * 11} {y - 14} q 6 14 0 28", color="#a16207", width=1.2)
    import random
    rnd = random.Random(4)
    for _ in range(16):
        cx, cy = rnd.uniform(178, 262), rnd.uniform(y - 14, y + 14)
        r = rnd.uniform(5, 8)
        s.polygon([(cx - r, cy), (cx - r * 0.3, cy - r), (cx + r, cy - r * 0.4), (cx + r * 0.6, cy + r), (cx - r * 0.5, cy + r * 0.8)],
                  fill="#f8fafc", stroke=MUTED, width=1.2)
    s.rect(x1, y - 18, 18, 36, fill="#a16207", stroke=INK, width=1.5, rx=3)
    burner(s, 220, 400)
    s.text(220, 196, "broken porcelain (catalyst),", size=14, color=INK)
    s.text(220, 214, "heated strongly", size=14, color=INK)
    s.line(220, 224, 220, 242, color=MUTED, width=1.5)
    s.text(98, 318, "mineral wool soaked", size=14, color=INK)
    s.text(98, 336, "in liquid paraffin", size=14, color=INK)
    s.line(98, 306, 98, 290, color=MUTED, width=1.5)
    s.text(98, 354, "(warmed gently)", size=13, color=MUTED)
    cx = 620
    target = _collect(s, cx, 400, "water", "C_2H_4")
    tube(s, [(x1 + 18, y), (x1 + 38, y), (target[0][0], y), target[0], target[1], target[2]])
    s.text(cx + 40, 236, "gaseous alkenes,", size=13, color=MUTED, anchor="start")
    s.text(cx + 40, 252, "mainly ethene", size=13, color=MUTED, anchor="start")
    s.text(400, 452, "Remove the delivery tube from the water before you stop heating, to prevent suck-back.", size=13, color=RED)
    chem(s, 400, 62, "C_{10}H_{22} → C_8H_{18} + C_2H_4", size=17, weight="bold", color=BLUE)
    title(s, "Paraffin vapour cracks over hot porcelain", y=28)
    return s


@fig
def alkanol_classes():
    s = Svg(800, 430, "Primary, secondary and tertiary alkanols",
            "Propan-1-ol is a primary alkanol: the carbon carrying the OH group is joined to one other carbon. Propan-2-ol is "
            "secondary: that carbon is joined to two other carbons. 2-Methylpropan-2-ol is tertiary: it is joined to three. "
            "Primary alkanols are oxidised to alkanals and then alkanoic acids, secondary ones to alkanones, and tertiary ones "
            "are not easily oxidised.")
    y0 = 200
    cols = [(140, "Primary (1°)", "propan-1-ol", "joined to 1 other carbon", "→ alkanal → alkanoic acid", "orange → green", 2),
            (400, "Secondary (2°)", "propan-2-ol", "joined to 2 other carbons", "→ alkanone (ketone)", "orange → green", 1),
            (660, "Tertiary (3°)", "2-methylpropan-2-ol", "joined to 3 other carbons", "not easily oxidised", "stays orange", 1)]
    for i, (cx, head, name, joined, ox, dich, cpos) in enumerate(cols):
        s.rect(cx - 125, 52, 250, 360, fill="#ffffff", stroke=MUTED, width=1.5, rx=10)
        s.text(cx, 76, head, size=16, weight="bold", color=BLUE)
        x0 = cx - 62
        if i == 0:
            x0 = cx - 72
            disp(s, x0, y0, [CH(left="H"), CH(), CH(right="OH")], hl={"OH"})
        elif i == 1:
            disp(s, x0, y0, [CH(left="H"), CH(up="H", down="OH"), CH(right="H")], hl={"OH"})
        else:
            disp(s, x0, y0, [CH(left="H"), CH(up=None, down="OH"), CH(right="H")], hl={"OH"})
            disp(s, x0 + 62, y0 - 62, [CH(up="H", left="H", right="H", down=None)])
            s.line(x0 + 62, y0 - 48, x0 + 62, y0 - 14, width=2.4)
        s.circle(x0 + cpos * 62, y0, 17, stroke=ORANGE, width=2.5)
        s.text(cx, 290, name, size=15, weight="bold")
        s.text(cx, 314, "C–OH carbon " + joined, size=13, color=ORANGE)
        s.text(cx, 346, "oxidation:", size=13, color=MUTED)
        s.text(cx, 364, ox, size=14, weight="bold", color=PURPLE)
        chem(s, cx, 392, "K_2Cr_2O_7/H^+: " + dich, size=13, color=MUTED)
    title(s, "Count the carbons joined to the carbon that carries –OH (circled)", y=26, size=16)
    return s


@fig
def fermentation_setup():
    s = Svg(800, 450, "Making ethanol by fermentation",
            "A conical flask of glucose solution and yeast stands in a warm water bath at about 30 °C. A delivery tube leads from "
            "the flask into a test tube of lime water, which turns milky as carbon(IV) oxide bubbles through. Air is kept out. "
            "The yeast enzyme zymase converts glucose into ethanol and carbon(IV) oxide.")
    beaker(s, 90, 370, 230, 130, frac=0.6, liquid="#bfdbfe")
    top = conical(s, 205, 362, 150, 200, 0.5, liquid="#fde68a")
    import random
    rnd = random.Random(7)
    for _ in range(14):
        s.circle(rnd.uniform(160, 250), rnd.uniform(300, 352), 3, fill="#a16207", stroke="none", width=0)
    s.rect(top[0] - 20, top[1] - 6, 40, 14, fill="#a16207", stroke=INK, width=1.5, rx=3)
    tx = 520
    test_tube(s, tx - 22, 200, 44, 170, frac=0.6, liquid="#f1f5f9")
    for k in range(5):
        s.circle(tx - 2 + (k % 2) * 6, 340 - k * 22, 4, fill="#ffffff", stroke=MUTED, width=1.2)
    tube(s, [(top[0], top[1] - 6), (top[0], 110), (tx - 4, 110), (tx - 4, 350)])
    s.text(205, 392, "warm water bath, about 30 °C", size=14, color=BLUE)
    s.text(60, 250, "glucose", size=14, color=INK, anchor="start")
    s.text(60, 268, "solution", size=14, color=INK, anchor="start")
    s.text(60, 286, "+ yeast", size=14, color=INK, anchor="start")
    s.line(110, 296, 168, 322, color=MUTED, width=1.5)
    s.text(560, 250, "lime water", size=14, color=INK, anchor="start")
    s.text(560, 268, "turns milky:", size=14, color=INK, anchor="start")
    chem(s, 560, 286, "CO_2 given off", size=14, color=RED, anchor="start", weight="bold")
    s.text(370, 98, "air kept out", size=13, color=MUTED)
    chem(s, 400, 424, "C_6H_{12}O_6 → 2C_2H_5OH + 2CO_2   (zymase in yeast)", size=16, weight="bold", color=PURPLE)
    title(s, "Yeast turns sugar into ethanol and carbon(IV) oxide", y=30)
    return s


def _hub(s: Svg, cx, cy, spokes, rw=200, rh=130):
    """Reaction map: products in four corner boxes, arrows from the central reactant box."""
    for bx, by, cond, name, formula, col, fill in spokes:
        w, h = 240, 92
        s.rect(bx - w / 2, by - h / 2, w, h, fill=fill, stroke=col, width=2.5, rx=12)
        chem(s, bx, by - 26, cond, size=13, color=col, weight="bold")
        s.text(bx, by, name, size=15, weight="bold")
        chem(s, bx, by + 24, formula, size=14)
        sx = cx + math.copysign(rw / 2 - 30, bx - cx)
        sy = cy + math.copysign(rh / 2 + 6, by - cy)
        ex = bx - math.copysign(w / 2 - 50, bx - cx)
        ey = by - math.copysign(h / 2 + 8, by - cy)
        s.arrow(sx, sy, ex, ey, color=col, width=3)


@fig
def ethanol_reactions():
    s = Svg(800, 520, "Reactions of ethanol",
            "Ethanol in the centre. With sodium it gives sodium ethoxide and hydrogen. Acidified potassium dichromate(VI) oxidises "
            "it to ethanoic acid, turning from orange to green. Excess concentrated sulphuric acid at 170 °C dehydrates it to "
            "ethene. With ethanoic acid and a little concentrated sulphuric acid it forms the ester ethyl ethanoate.")
    s.rect(300, 192, 200, 156, fill="#ffffff", stroke=RED, width=2, rx=12, dash="6 5")
    disp(s, 369, 256, [CH(left="H"), CH(right="OH")], hl={"OH"})
    s.text(400, 330, "ethanol", size=15, weight="bold", color=RED)
    _hub(s, 400, 270, [
        (140, 92, "+ sodium", "Sodium ethoxide", "C_2H_5ONa + H_2 (fizzing)", BLUE, F_BLUE),
        (660, 92, "K_2Cr_2O_7/H^+, heat", "Ethanoic acid", "CH_3COOH (orange → green)", GREEN, F_GREEN),
        (140, 440, "excess conc. H_2SO_4, 170 °C", "Ethene", "C_2H_4 + H_2O", ORANGE, F_AMBER),
        (660, 440, "+ CH_3COOH, conc. H_2SO_4", "Ethyl ethanoate (ester)", "CH_3COOC_2H_5 + H_2O", PURPLE, F_PURPLE)], rh=156)
    title(s, "Most reactions involve the –OH group", y=26)
    return s


@fig
def alkanoic_acids():
    s = Svg(800, 400, "The first three alkanoic acids",
            "Displayed formulas of methanoic acid HCOOH, ethanoic acid CH3COOH and propanoic acid CH3CH2COOH. Each contains the "
            "carboxyl group –COOH, made of a C=O group and an –OH group on the same carbon.")
    y0 = 190
    cells = [(140, "methanoic acid", "HCOOH", [{"atom": "C", "left": "H", "up": "=O", "right": "OH"}]),
             (400, "ethanoic acid", "CH₃COOH", [CH(left="H"), {"atom": "C", "up": "=O", "right": "OH"}]),
             (660, "propanoic acid", "CH₃CH₂COOH", [CH(left="H"), CH(), {"atom": "C", "up": "=O", "right": "OH"}])]
    for cx, name, f, row in cells:
        n = len(row)
        x0 = cx - (n - 1) * 31 - 4
        pos = disp(s, x0, y0, row, hl={"O", "OH"})
        px = pos[-1][0]
        s.rect(px - 20, y0 - 62, 84, 86, fill="none", stroke=PURPLE, width=2, rx=10, dash="5 4")
        s.text(cx, 290, name, size=16, weight="bold")
        s.text(cx, 312, f, size=14, color=MUTED)
    s.text(400, 356, "–COOH = C=O and –OH on the same carbon (the carboxyl group, dashed)", size=15, color=PURPLE, weight="bold")
    title(s, "General formula CₙH₂ₙ₊₁COOH (n = 0, 1, 2 …)", y=30)
    return s


@fig
def ethanoic_acid_reactions():
    s = Svg(800, 520, "Reactions of ethanoic acid",
            "Ethanoic acid in the centre. With sodium carbonate it fizzes, giving sodium ethanoate, water and carbon(IV) oxide. "
            "With magnesium it gives magnesium ethanoate and hydrogen. With sodium hydroxide it is neutralised to sodium ethanoate "
            "and water. With ethanol and a little concentrated sulphuric acid it forms ethyl ethanoate.")
    s.rect(300, 190, 200, 160, fill="#ffffff", stroke=RED, width=2, rx=12, dash="6 5")
    disp(s, 369, 262, [CH(left="H"), {"atom": "C", "up": "=O", "right": "OH"}], hl={"O", "OH"})
    s.text(400, 334, "ethanoic acid", size=15, weight="bold", color=RED)
    _hub(s, 400, 270, [
        (140, 92, "+ Na_2CO_3 (or NaHCO_3)", "Effervescence", "CH_3COONa + H_2O + CO_2", BLUE, F_BLUE),
        (660, 92, "+ magnesium", "Magnesium ethanoate", "(CH_3COO)_2Mg + H_2", GREEN, F_GREEN),
        (140, 440, "+ NaOH (neutralisation)", "Sodium ethanoate", "CH_3COONa + H_2O", ORANGE, F_AMBER),
        (660, 440, "+ C_2H_5OH, conc. H_2SO_4", "Ethyl ethanoate (ester)", "CH_3COOC_2H_5 + H_2O", PURPLE, F_PURPLE)], rh=160)
    title(s, "A weak acid with all the typical acid reactions, plus esterification", y=26, size=16)
    return s


@fig
def esterification():
    s = Svg(800, 420, "Esterification: ethanoic acid and ethanol",
            "Ethanoic acid reacts with ethanol, with a little concentrated sulphuric acid as catalyst, to form ethyl ethanoate and "
            "water. The OH from the acid and the H from the alcohol's OH group leave as water. The reaction is reversible.")
    y1 = 130
    disp(s, 70, y1, [CH(left="H"), {"atom": "C", "up": "=O"}], hl={"O"})
    chem(s, 202, y1, "OH", size=17, weight="bold", color=RED)
    _bond(s, 132, y1, 190, y1)
    s.text(270, y1, "+", size=26, weight="bold")
    chem(s, 336, y1, "H", size=17, weight="bold", color=RED)
    disp(s, 380, y1, [{"atom": "O", "up": None, "down": None}, CH(), CH(right="H")], hl={"O"})
    _bond(s, 344, y1, 380, y1)
    s.rect(180, y1 - 20, 168, 40, fill="none", stroke=RED, width=2, rx=10, dash="5 4")
    s.text(264, y1 + 40, "→ H₂O", size=15, weight="bold", color=RED)
    s.text(110, 210, "ethanoic acid", size=14, color=MUTED)
    s.text(470, 210, "ethanol", size=14, color=MUTED)
    s.text(400, 246, "⇌   (conc. H₂SO₄ catalyst, warm)", size=16, weight="bold", color=BLUE)
    y2 = 320
    disp(s, 110, y2, [CH(left="H"), {"atom": "C", "up": "=O"}, {"atom": "O", "up": None, "down": None}, CH(), CH(right="H")],
         hl={"O"})
    s.text(234, y2 + 66, "ethyl ethanoate (an ester)", size=14, color=MUTED)
    s.text(530, y2, "+", size=26, weight="bold")
    chem(s, 610, y2, "H_2O", size=20, weight="bold", color=RED)
    s.text(610, y2 + 66, "water", size=14, color=MUTED)
    title(s, "acid + alcohol ⇌ ester + water", y=28)
    return s


@fig
def ester_hydrolysis():
    s = Svg(800, 380, "Two ways to hydrolyse an ester",
            "Ethyl ethanoate can be hydrolysed by boiling with dilute acid, which gives ethanoic acid and ethanol and is reversible, "
            "or by boiling with sodium hydroxide solution, which gives sodium ethanoate and ethanol and goes to completion. "
            "Alkaline hydrolysis of fats is saponification.")
    a = box(s, 400, 80, 300, 70, ["Ethyl ethanoate", "CH_3COOC_2H_5"], col=PURPLE, fill=F_PURPLE, size=16)
    b = box(s, 190, 270, 330, 96, ["Acid hydrolysis", "CH_3COOH + C_2H_5OH", "reversible (equilibrium)"], col=BLUE,
            fill=F_BLUE, size=16)
    c = box(s, 610, 270, 330, 96, ["Alkaline hydrolysis", "CH_3COONa + C_2H_5OH", "goes to completion"], col=GREEN,
            fill=F_GREEN, size=16)
    link(s, a, b, color=BLUE)
    link(s, a, c, color=GREEN)
    s.label(250, 160, "+ H₂O, dilute H⁺, heat", size=14, color=BLUE, weight="bold")
    s.label(560, 160, "+ NaOH(aq), heat", size=14, color=GREEN, weight="bold")
    s.text(610, 344, "With fats and oils this is saponification (soap)", size=13, color=MUTED)
    title(s, "Hydrolysis splits an ester back into acid (or its salt) and alcohol", y=26, size=16)
    return s


# ─────────────────────────────────────────────────────────────────────────────

def main(names: list[str]) -> int:
    chosen = names or list(FIGS)
    unknown = [n for n in chosen if n not in FIGS]
    if unknown:
        print("unknown figures:", ", ".join(unknown))
        return 1
    for n in chosen:
        FIGS[n]().save(OUT / f"{n}.svg")
    print(f"wrote {len(chosen)} diagram(s) to {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
