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
