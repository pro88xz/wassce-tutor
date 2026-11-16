#!/usr/bin/env python3
"""Original diagrams for the Mathematics notes.

    python3 scripts/notes/maths_figs.py            # write every diagram
    python3 scripts/notes/maths_figs.py name ...   # write some

Each function draws one figure and returns an Svg. Files go to
public/img/mathematics/<name>.svg and lessons show them from
https://wasscetutor.com/img/mathematics/<name>.svg. All drawn by WASSCE Tutor,
to scale wherever the figure shows measurements.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from chemistry_figs import box, link  # noqa: E402
from government_figs import arrow, heading, note  # noqa: E402
from svgfig import (  # noqa: E402
    BLUE, F_AMBER, F_BLUE, F_GREEN, F_GREY, F_PURPLE, F_RED, GREEN, INK, MUTED, ORANGE, PURPLE, RED, TEAL, Svg,
)

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/img/mathematics"
FIGS: dict[str, callable] = {}
F_TEAL = "#ccfbf1"


def fig(fn):
    FIGS[fn.__name__.replace("_", "-")] = fn
    return fn


def plot(s: Svg, fn, x0, x1, X, Y, color=BLUE, width=3, steps=200, ymin=None, ymax=None):
    """Draw y = fn(x) for x in [x0, x1] using the screen maps X(x), Y(y)."""
    pts = []
    for i in range(steps + 1):
        x = x0 + (x1 - x0) * i / steps
        try:
            y = fn(x)
        except (ValueError, ZeroDivisionError):
            continue
        if (ymin is not None and y < ymin) or (ymax is not None and y > ymax):
            if len(pts) > 1:
                s.polyline(pts, color=color, width=width)
            pts = []
            continue
        pts.append((X(x), Y(y)))
    if len(pts) > 1:
        s.polyline(pts, color=color, width=width)


def grid_axes(s: Svg, X, Y, xr, yr, step=1, label_every=1, size=14):
    """Light grid, axes through the origin and tick labels."""
    for gx in range(xr[0], xr[1] + 1, step):
        s.line(X(gx), Y(yr[0]), X(gx), Y(yr[1]), color="#e5e7eb", width=1)
    for gy in range(yr[0], yr[1] + 1, step):
        s.line(X(xr[0]), Y(gy), X(xr[1]), Y(gy), color="#e5e7eb", width=1)
    s.arrow(X(xr[0]), Y(0), X(xr[1]) + 14, Y(0), color=INK, width=2)
    s.arrow(X(0), Y(yr[0]), X(0), Y(yr[1]) - 14, color=INK, width=2)
    s.text(X(xr[1]) + 22, Y(0) + 4, "x", size=size + 2, italic=True)
    s.text(X(0) + 4, Y(yr[1]) - 24, "y", size=size + 2, italic=True, anchor="start")
    for gx in range(xr[0], xr[1] + 1, label_every):
        if gx != 0:
            s.text(X(gx), Y(0) + 18, str(gx), size=size, color=MUTED)
    for gy in range(yr[0], yr[1] + 1, label_every):
        if gy != 0:
            s.text(X(0) - 8, Y(gy) + 1, str(gy), size=size, color=MUTED, anchor="end")
    s.text(X(0) - 8, Y(0) + 18, "0", size=size, color=MUTED, anchor="end")


# ═══ M1: number and numeration ══════════════════════════════════════════════

@fig
def base_place_value():
    s = Svg(800, 380, "Place value in base two and base ten",
            "In base ten the place values are powers of ten: 1000, 100, 10, 1. In base two they are powers of two: 16, 8, "
            "4, 2, 1. The binary number 10110 means one 16, no 8, one 4, one 2 and no 1, which is 22 in base ten.")
    heading(s, "Place values are powers of the base")
    s.text(90, 92, "Base 10", size=17, weight="bold", color=BLUE, anchor="start")
    for k, (pv, p) in enumerate([("1000", "10³"), ("100", "10²"), ("10", "10¹"), ("1", "10⁰")]):
        x = 300 + k * 110
        box(s, x, 92, 96, 50, [pv, p], col=BLUE, fill=F_BLUE, size=14)
    s.text(90, 205, "Base 2", size=17, weight="bold", color=GREEN, anchor="start")
    digits = "10110"
    for k, (pv, p) in enumerate([("16", "2⁴"), ("8", "2³"), ("4", "2²"), ("2", "2¹"), ("1", "2⁰")]):
        x = 245 + k * 110
        box(s, x, 192, 96, 50, [pv, p], col=GREEN, fill=F_GREEN, size=14)
        s.rect(x - 30, 232, 60, 44, fill="#ffffff", stroke=GREEN, width=2.2, rx=8)
        s.text(x, 255, digits[k], size=22, weight="bold", color=INK)
    s.text(90, 255, "digits", size=15, color=MUTED, anchor="start")
    note(s, "10110₂ = 1×16 + 0×8 + 1×4 + 1×2 + 0×1 = 22₁₀", 320, size=18, color=INK)
    note(s, "Each place is worth the base times the place to its right.", 355, size=14)
    return s


@fig
def base_division_ladder():
    s = Svg(800, 420, "Converting 45 from base ten to base two by repeated division",
            "Divide 45 by 2 repeatedly and record the remainders: 45 ÷ 2 = 22 r 1, 22 ÷ 2 = 11 r 0, 11 ÷ 2 = 5 r 1, 5 ÷ 2 = 2 "
            "r 1, 2 ÷ 2 = 1 r 0, 1 ÷ 2 = 0 r 1. Reading the remainders from the bottom up gives 101101 in base two.")
    heading(s, "Base 10 to base 2: divide and read remainders upwards")
    rows = [(45, 22, 1), (22, 11, 0), (11, 5, 1), (5, 2, 1), (2, 1, 0), (1, 0, 1)]
    for k, (n, q, r) in enumerate(rows):
        y = 90 + k * 48
        s.text(250, y, "2", size=20, color=MUTED, anchor="end")
        s.line(262, y - 18, 262, y + 18, color=INK, width=2)
        s.line(262, y + 18, 380, y + 18, color=INK, width=2)
        s.text(300, y, str(n), size=21, weight="bold", color=INK, anchor="start")
        s.text(420, y, f"remainder {r}", size=17, color=RED, weight="bold", anchor="start")
    s.text(300, 90 + 6 * 48, "0", size=21, color=MUTED, anchor="start")
    arrow(s, 600, 90 + 5 * 48, 600, 82, color=RED, width=3)
    s.label(600, 210, "read up", size=15, color=RED, weight="bold")
    note(s, "45₁₀ = 101101₂", 400, size=20, color=INK)
    return s


@fig
def mod_clock():
    s = Svg(800, 420, "Arithmetic modulo 12 on a clock and modulo 7 on the days of the week",
            "On a 12-hour clock, 9 o'clock plus 5 hours is 2 o'clock, because 14 is 2 more than 12: 14 ≡ 2 (mod 12). The "
            "days of the week work modulo 7: 10 days after Monday is Thursday, because 10 = 7 + 3.")
    heading(s, "Counting that wraps around")
    cx, cy, r = 215, 225, 135
    s.circle(cx, cy, r, fill="#ffffff", stroke=INK, width=3)
    for h in range(12):
        a = math.radians(90 - h * 30)
        hx, hy = cx + (r - 26) * math.cos(a), cy - (r - 26) * math.sin(a)
        s.text(hx, hy + 1, str(12 if h == 0 else h), size=18, weight="bold", color=BLUE if h in (9, 2) else INK)
    s.arc(cx, cy, r - 52, 180, 30, color=RED, width=3.5, arrow="end")
    s.text(cx, cy, "+5 h", size=17, weight="bold", color=RED)
    s.text(cx, cy + r + 30, "9 + 5 = 14 ≡ 2 (mod 12)", size=16, weight="bold", color=INK)
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    dx, dy, dr = 590, 225, 120
    for k, d in enumerate(days):
        a = math.radians(90 - k * 360 / 7)
        px, py = dx + dr * math.cos(a), dy - dr * math.sin(a)
        col = GREEN if d in ("Mon", "Thu") else INK
        s.circle(px, py, 28, fill=F_GREEN if col == GREEN else "#ffffff", stroke=col, width=2.2)
        s.text(px, py + 1, d, size=15, weight="bold", color=col)
    s.text(dx, dy - 8, "10 days after", size=15, color=INK)
    s.text(dx, dy + 14, "Monday", size=15, color=INK)
    s.text(dx, dy + r + 46, "10 ≡ 3 (mod 7): Thursday", size=16, weight="bold", color=INK)
    return s


@fig
def rounding_number_line():
    s = Svg(800, 300, "Rounding 3.47 to one decimal place",
            "On a number line from 3.4 to 3.5, the number 3.47 lies closer to 3.5 than to 3.4, because it is past the halfway "
            "mark 3.45. So 3.47 rounded to one decimal place is 3.5.")
    heading(s, "Round to the nearer mark")
    x0, x1 = 120, 680
    def X(v):
        return x0 + (v - 3.40) / 0.10 * (x1 - x0)
    s.line(x0 - 30, 150, x1 + 30, 150, color=INK, width=3)
    for i in range(11):
        v = 3.40 + i * 0.01
        h = 18 if i in (0, 5, 10) else 10
        s.line(X(v), 150 - h, X(v), 150 + h, color=INK if i in (0, 10) else MUTED, width=2)
    for v, t in ((3.40, "3.4"), (3.45, "3.45"), (3.50, "3.5")):
        s.text(X(v), 190, t, size=18, weight="bold", color=INK if t != "3.45" else MUTED)
    s.dot(X(3.47), 150, r=9, color=RED)
    s.text(X(3.47), 112, "3.47", size=18, weight="bold", color=RED)
    arrow(s, X(3.47) + 12, 128, X(3.50) - 6, 128, color=RED)
    s.text(X(3.45), 228, "halfway", size=14, color=MUTED)
    note(s, "3.47 is past halfway, so it rounds up to 3.5 (1 d.p.)", 272, size=16, color=INK)
    return s


@fig
def exp_log_graphs():
    s = Svg(800, 520, "Graphs of y = 2 to the power x and y = log base 2 of x",
            "The curve y = 2^x passes through (0, 1), (1, 2) and (2, 4). The curve y = log2 x passes through (1, 0), (2, 1) "
            "and (4, 2). The two curves are reflections of each other in the line y = x, because the logarithm is the "
            "inverse of the exponential.")
    heading(s, "Logarithm: the inverse of an exponential")
    ox, oy, u = 300, 330, 52
    def X(x):
        return ox + x * u
    def Y(y):
        return oy - y * u
    grid_axes(s, X, Y, (-3, 7), (-3, 3))
    plot(s, lambda x: x, -3, 3, X, Y, color=MUTED, width=2)
    plot(s, lambda x: 2 ** x, -3, math.log2(3.2), X, Y, color=BLUE, width=3.5)
    plot(s, lambda x: math.log2(x), 0.13, 7, X, Y, color=GREEN, width=3.5)
    for (px, py, c) in ((0, 1, BLUE), (1, 2, BLUE), (1, 0, GREEN), (2, 1, GREEN), (4, 2, GREEN)):
        s.dot(X(px), Y(py), r=6, color=c)
    s.label(X(1.55), Y(3.0), "y = 2ˣ", size=17, color=BLUE, weight="bold")
    s.label(X(5.6), Y(2.75), "y = log₂ x", size=17, color=GREEN, weight="bold")
    s.label(X(2.9), Y(2.35), "y = x", size=15, color=MUTED)
    note(s, "log₂ 4 = 2 because 2² = 4", 500, size=17, color=INK)
    return s


@fig
def ap_gp_terms():
    s = Svg(800, 440, "An arithmetic progression and a geometric progression compared",
            "The arithmetic progression 3, 7, 11, 15, 19 increases by a common difference of 4 each time, so its bars rise "
            "in equal steps. The geometric progression 1, 2, 4, 8, 16 is multiplied by a common ratio of 2 each time, so "
            "its bars grow faster and faster.")
    heading(s, "Add the same each time, or multiply by the same")
    base = 360
    ap = [3, 7, 11, 15, 19]
    gp = [1, 2, 4, 8, 16]
    for k, v in enumerate(ap):
        x = 90 + k * 60
        s.rect(x, base - v * 13, 40, v * 13, fill=F_BLUE, stroke=BLUE, width=2)
        s.text(x + 20, base - v * 13 - 14, str(v), size=15, weight="bold", color=BLUE)
    for k, v in enumerate(gp):
        x = 470 + k * 60
        s.rect(x, base - v * 15, 40, v * 15, fill=F_GREEN, stroke=GREEN, width=2)
        s.text(x + 20, base - v * 15 - 14, str(v), size=15, weight="bold", color=GREEN)
    s.line(70, base, 380, base, color=INK, width=2)
    s.line(450, base, 760, base, color=INK, width=2)
    s.text(225, 392, "AP: common difference d = 4", size=16, weight="bold", color=BLUE)
    s.text(605, 392, "GP: common ratio r = 2", size=16, weight="bold", color=GREEN)
    s.text(225, 418, "Tₙ = a + (n − 1)d", size=16, color=INK)
    s.text(605, 418, "Tₙ = arⁿ⁻¹", size=16, color=INK)
    return s


def _venn2(s, cx1, cx2, cy, r, la, lb, ca=BLUE, cb=GREEN):
    s.circle(cx1, cy, r, fill="none", stroke=ca, width=3)
    s.circle(cx2, cy, r, fill="none", stroke=cb, width=3)
    s.text(cx1 - r * 0.7, cy - r - 10, la, size=19, weight="bold", color=ca)
    s.text(cx2 + r * 0.7, cy - r - 10, lb, size=19, weight="bold", color=cb)


@fig
def venn_operations():
    s = Svg(800, 470, "Union, intersection and complement on Venn diagrams",
            "Three Venn diagrams of sets A and B inside a universal set U. The first shades the intersection A ∩ B, the "
            "overlap. The second shades the union A ∪ B, everything in A or B or both. The third shades the complement "
            "A′, everything in U that is not in A.")
    heading(s, "Shading set operations")
    panels = [(140, "A ∩ B", "in both"), (400, "A ∪ B", "in A or B or both"), (660, "A′", "not in A")]
    for cx, lab, desc in panels:
        s.rect(cx - 120, 80, 240, 230, fill="#ffffff", stroke=INK, width=2, rx=6)
        s.text(cx - 104, 98, "U", size=16, weight="bold", color=INK, anchor="start")
        a, b, cy, r = cx - 34, cx + 34, 200, 62
        if lab == "A′":
            s.rect(cx - 120, 80, 240, 230, fill=F_AMBER, stroke=INK, width=2, rx=6)
            s.text(cx - 104, 98, "U", size=16, weight="bold", color=INK, anchor="start")
            s.circle(a, cy, r, fill="#ffffff", stroke=BLUE, width=3)
            s.circle(b, cy, r, fill="none", stroke=GREEN, width=3)
        elif lab == "A ∪ B":
            s.circle(a, cy, r, fill=F_AMBER, stroke="none", width=0)
            s.circle(b, cy, r, fill=F_AMBER, stroke="none", width=0)
            s.circle(a, cy, r, fill="none", stroke=BLUE, width=3)
            s.circle(b, cy, r, fill="none", stroke=GREEN, width=3)
        else:
            h = math.sqrt(r * r - ((b - a) / 2) ** 2)
            s.path(f"M {cx} {cy - h:.1f} A {r} {r} 0 0 1 {cx} {cy + h:.1f} A {r} {r} 0 0 1 {cx} {cy - h:.1f} Z",
                   color="none", width=0, fill=F_AMBER)
            s.circle(a, cy, r, fill="none", stroke=BLUE, width=3)
            s.circle(b, cy, r, fill="none", stroke=GREEN, width=3)
        s.text(a - 30, cy - r + 6, "A", size=17, weight="bold", color=BLUE)
        s.text(b + 30, cy - r + 6, "B", size=17, weight="bold", color=GREEN)
        s.text(cx, 345, lab, size=22, weight="bold", color=ORANGE)
        s.text(cx, 375, desc, size=15, color=INK)
    note(s, "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", 430, size=19, color=INK)
    return s


@fig
def venn_two_set_problem():
    s = Svg(800, 440, "A two-set Venn diagram problem",
            "In a class of 40 students, 25 study Physics, 18 study Chemistry and 7 study neither. Then 33 study at least one "
            "subject, so 25 + 18 − 33 = 10 study both. The diagram shows 15 Physics only, 10 both, 8 Chemistry only and 7 "
            "outside both circles.")
    heading(s, "40 students: 25 Physics, 18 Chemistry, 7 neither")
    s.rect(110, 70, 580, 300, fill="#ffffff", stroke=INK, width=2.5, rx=8)
    s.text(130, 92, "U (40)", size=17, weight="bold", color=INK, anchor="start")
    _venn2(s, 330, 470, 225, 120, "Physics (25)", "Chemistry (18)")
    s.text(265, 226, "15", size=28, weight="bold", color=BLUE)
    s.text(400, 226, "10", size=28, weight="bold", color=ORANGE)
    s.text(540, 226, "8", size=28, weight="bold", color=GREEN)
    s.text(640, 340, "7", size=28, weight="bold", color=MUTED)
    note(s, "both = 25 + 18 − (40 − 7) = 10", 405, size=18, color=INK)
    return s


@fig
def venn_three_set():
    s = Svg(800, 500, "A three-set Venn diagram with eight regions",
            "Three overlapping circles A, B and C inside the universal set divide it into eight regions: A only, B only, C "
            "only, A and B only, A and C only, B and C only, all three, and none. Fill the centre first, then the "
            "two-set overlaps, then the single-set regions.")
    heading(s, "Three sets: fill from the centre outwards")
    s.rect(110, 62, 580, 400, fill="#ffffff", stroke=INK, width=2.5, rx=8)
    s.text(130, 84, "U", size=18, weight="bold", color=INK, anchor="start")
    ca, cb, cc, r = (330, 215), (470, 215), (400, 330), 110
    for (x, y), col, lab, lx, ly in ((ca, BLUE, "A", 245, 120), (cb, GREEN, "B", 555, 120), (cc, PURPLE, "C", 282, 410)):
        s.circle(x, y, r, fill="none", stroke=col, width=3)
        s.text(lx, ly, lab, size=21, weight="bold", color=col)
    regions = [(285, 200, "A only", BLUE), (515, 200, "B only", GREEN), (400, 380, "C only", PURPLE),
               (400, 175, "A∩B only", INK), (335, 300, "A∩C only", INK), (465, 300, "B∩C only", INK),
               (400, 250, "all 3", RED), (630, 420, "none", MUTED)]
    for x, y, t, c in regions:
        s.text(x, y, t, size=14, weight="bold", color=c)
    note(s, "Order: all three → each pair only → each single only → none", 486, size=15, color=INK)
    return s


@fig
def integer_number_line():
    s = Svg(800, 260, "Integers on a number line",
            "A number line from −6 to 6. Numbers to the right are greater. −2 is greater than −5 because it lies further to "
            "the right. Adding 4 to −3 means moving 4 steps right, to 1.")
    heading(s, "Right is greater; adding moves right")
    x0, u = 100, 50
    def X(v):
        return x0 + (v + 6) * u
    s.arrow(X(-6) - 20, 140, X(6) + 24, 140, color=INK, width=2.5)
    s.arrow(X(6) + 20, 140, X(-6) - 24, 140, color=INK, width=2.5)
    for v in range(-6, 7):
        s.line(X(v), 130, X(v), 150, color=INK, width=2)
        s.text(X(v), 172, str(v) if v >= 0 else f"−{-v}", size=15, weight="bold" if v == 0 else "normal",
               color=RED if v < 0 else BLUE if v > 0 else INK)
    s.dot(X(-3), 140, r=8, color=ORANGE)
    s.dot(X(1), 140, r=8, color=ORANGE)
    s.path(f"M {X(-3)} 128 C {X(-2)} 80, {X(0)} 80, {X(1)} 126", color=ORANGE, width=3, arrow="end")
    s.text(X(-1), 76, "−3 + 4 = 1", size=17, weight="bold", color=ORANGE)
    note(s, "negative integers ← 0 → positive integers", 225, size=15)
    return s


@fig
def surd_diagonal():
    s = Svg(800, 380, "Constructing the square root of 2 as a diagonal",
            "A square of side 1 unit has a diagonal of length √2, by Pythagoras' theorem: 1² + 1² = 2. Swinging the diagonal "
            "down onto the number line with compasses marks the point √2 ≈ 1.414, between 1 and 2.")
    heading(s, "√2 is a real length you can draw")
    ox, oy, u = 170, 300, 180
    s.line(ox - 60, oy, ox + 2.4 * u, oy, color=INK, width=2.5)
    for v in range(0, 3):
        s.line(ox + v * u, oy - 10, ox + v * u, oy + 10, color=INK, width=2)
        s.text(ox + v * u, oy + 32, str(v), size=18, weight="bold")
    s.polygon([(ox, oy), (ox + u, oy), (ox + u, oy - u), (ox, oy - u)], fill=F_BLUE, stroke=BLUE, width=2.5)
    s.line(ox, oy, ox + u, oy - u, color=RED, width=3.5)
    s.label(ox + u / 2 - 18, oy - u / 2 - 12, "√2", size=19, color=RED, weight="bold")
    s.text(ox + u / 2, oy - 14, "1", size=16, color=BLUE, weight="bold")
    s.text(ox + u + 16, oy - u / 2, "1", size=16, color=BLUE, weight="bold")
    r2 = math.sqrt(2) * u
    s.arc(ox, oy, r2, 45, 0, color=RED, width=2.4)
    s.dot(ox + r2, oy, r=7, color=RED)
    s.text(ox + r2, oy + 32, "√2 ≈ 1.414", size=17, weight="bold", color=RED)
    s.text(620, 120, "1² + 1² = 2", size=19, weight="bold", color=INK)
    s.text(620, 150, "diagonal = √2", size=17, color=INK)
    return s


@fig
def truth_table_card():
    s = Svg(800, 360, "Truth table for negation, conjunction, disjunction and implication",
            "For statements p and q, the table lists all four combinations of true (T) and false (F). Not p reverses p. p and "
            "q is true only when both are true. p or q is false only when both are false. If p then q is false only when "
            "p is true and q is false.")
    heading(s, "The four connectives at a glance")
    cols = ["p", "q", "~p", "p ∧ q", "p ∨ q", "p → q"]
    rows = [("T", "T", "F", "T", "T", "T"), ("T", "F", "F", "F", "T", "F"), ("F", "T", "T", "F", "T", "T"), ("F", "F", "T", "F", "F", "T")]
    x0, w = 130, 92
    for j, c in enumerate(cols):
        s.rect(x0 + j * w, 70, w, 44, fill=F_PURPLE if j >= 2 else F_GREY, stroke=INK, width=1.5)
        s.text(x0 + j * w + w / 2, 92, c, size=18, weight="bold", color=PURPLE if j >= 2 else INK)
    for i, r in enumerate(rows):
        for j, v in enumerate(r):
            y = 114 + i * 44
            s.rect(x0 + j * w, y, w, 44, fill="#ffffff", stroke=INK, width=1.2)
            hi = (j == 5 and i == 1) or (j == 3 and i == 0) or (j == 4 and i == 3)
            s.text(x0 + j * w + w / 2, y + 22, v, size=18, weight="bold" if hi else "normal",
                   color=(GREEN if v == "T" else RED))
    note(s, "p → q is false only when p is true and q is false.", 320, size=16, color=INK)
    return s


# ═══ M2: matrices, ratio, percentages, financial arithmetic, variation ═══════

@fig
def matrix_anatomy():
    s = Svg(800, 400, "The parts of a matrix",
            "A matrix with 2 rows and 3 columns has order 2 by 3. Rows run across and columns run down. The element in "
            "row 2, column 3 is called a23; here it is 7.")
    heading(s, "A 2 × 3 matrix: 2 rows, 3 columns")
    vals = [[4, -1, 0], [3, 5, 7]]
    xs, y0, rh = [320, 410, 500], 140, 70
    s.path(f"M 285 {y0 - 40} Q 261 {y0 + rh / 2} 285 {y0 + rh + 40}", color=INK, width=3)
    s.path(f"M 535 {y0 - 40} Q 559 {y0 + rh / 2} 535 {y0 + rh + 40}", color=INK, width=3)
    for i, row in enumerate(vals):
        for j, v in enumerate(row):
            x, y = xs[j], y0 + i * rh
            hi = (i, j) == (1, 2)
            if hi:
                s.circle(x, y, 26, fill=F_AMBER, stroke=ORANGE, width=2.5)
            s.text(x, y, str(v) if v >= 0 else f"−{-v}", size=26, weight="bold", color=ORANGE if hi else INK)
    s.rect(292, y0 + rh - 28, 236, 56, fill="none", stroke=BLUE, width=2, rx=8, dash="6 5")
    s.text(250, y0 + rh, "row 2", size=16, weight="bold", color=BLUE, anchor="end")
    s.rect(474, y0 - 34, 52, rh + 68, fill="none", stroke=GREEN, width=2, rx=8, dash="6 5")
    s.text(575, y0 - 30, "column 3", size=16, weight="bold", color=GREEN, anchor="start")
    s.text(575, y0 + rh + 4, "a₂₃ = 7", size=18, weight="bold", color=ORANGE, anchor="start")
    note(s, "Order = (number of rows) × (number of columns) = 2 × 3", 330, size=17, color=INK)
    note(s, "aᵢⱼ is the element in row i, column j", 362, size=15)
    return s


@fig
def determinant_cross():
    s = Svg(800, 360, "The determinant of a 2 by 2 matrix",
            "For the matrix with rows (a, b) and (c, d), the determinant is ad minus bc: multiply down the leading diagonal, "
            "then subtract the product of the other diagonal. For rows (3, 2) and (4, 5), the determinant is 15 − 8 = 7.")
    heading(s, "Determinant = ad − bc")
    def mat(x0, a, b, c, d, label=True):
        s.path(f"M {x0} 100 Q {x0 - 20} 175 {x0} 250", color=INK, width=3)
        s.path(f"M {x0 + 170} 100 Q {x0 + 190} 175 {x0 + 170} 250", color=INK, width=3)
        for (t, x, y) in ((a, x0 + 45, 135), (b, x0 + 125, 135), (c, x0 + 45, 215), (d, x0 + 125, 215)):
            s.text(x, y, t, size=30, weight="bold", italic=label)
        s.line(x0 + 58, 148, x0 + 112, 202, color=GREEN, width=3)
        s.line(x0 + 112, 148, x0 + 58, 202, color=RED, width=3)
    mat(110, "a", "b", "c", "d")
    s.text(195, 290, "ad − bc", size=24, weight="bold", color=INK)
    mat(480, "3", "2", "4", "5", label=False)
    s.text(565, 290, "3×5 − 2×4 = 7", size=22, weight="bold", color=INK)
    s.text(195, 330, "green product minus red product", size=15, color=MUTED)
    s.text(565, 330, "determinant = 7", size=15, color=MUTED)
    return s


@fig
def ratio_sharing_bars():
    s = Svg(800, 360, "Sharing NLe 600 in the ratio 2 : 3",
            "Draw 2 equal boxes for Fatmata and 3 for Musa: 5 equal parts in all. Each part is 600 ÷ 5 = 120. Fatmata gets 2 × "
            "120 = NLe 240 and Musa gets 3 × 120 = NLe 360.")
    heading(s, "Share NLe 600 in the ratio 2 : 3")
    for k in range(2):
        s.rect(220 + k * 95, 90, 90, 64, fill=F_BLUE, stroke=BLUE, width=2.5, rx=6)
        s.text(265 + k * 95, 122, "120", size=20, weight="bold", color=BLUE)
    for k in range(3):
        s.rect(220 + k * 95, 200, 90, 64, fill=F_GREEN, stroke=GREEN, width=2.5, rx=6)
        s.text(265 + k * 95, 232, "120", size=20, weight="bold", color=GREEN)
    s.text(200, 122, "Fatmata (2)", size=17, weight="bold", color=BLUE, anchor="end")
    s.text(200, 232, "Musa (3)", size=17, weight="bold", color=GREEN, anchor="end")
    s.text(430, 122, "= NLe 240", size=20, weight="bold", color=BLUE, anchor="start")
    s.text(525, 232, "= NLe 360", size=20, weight="bold", color=GREEN, anchor="start")
    note(s, "5 parts = NLe 600, so 1 part = NLe 120", 320, size=18, color=INK)
    return s


@fig
def percent_multipliers():
    s = Svg(800, 380, "Percentage increase and decrease as multipliers",
            "A 15% increase takes 100% to 115%, so multiply by 1.15. A 20% decrease takes 100% to 80%, so multiply by 0.80. "
            "For example, NLe 400 increased by 15% is NLe 460, and NLe 400 decreased by 20% is NLe 320.")
    heading(s, "Increase or decrease = multiply")
    def bar(y, pct, col, fill, lab, val):
        w = pct * 4
        s.rect(150, y, w, 48, fill=fill, stroke=col, width=2.5, rx=6)
        s.text(140, y + 24, lab, size=16, weight="bold", color=col, anchor="end")
        s.text(160 + w, y + 24, val, size=17, weight="bold", color=col, anchor="start")
    bar(80, 100, INK, F_GREY, "original", "100%  NLe 400")
    bar(160, 115, GREEN, F_GREEN, "+15%", "115%  × 1.15 = NLe 460")
    bar(240, 80, RED, F_RED, "−20%", "80%  × 0.80 = NLe 320")
    s.line(550, 70, 550, 300, color=MUTED, width=1.5, dash="6 5")
    s.text(550, 320, "100% mark", size=14, color=MUTED)
    note(s, "New amount = original × (100 ± r)/100", 358, size=17, color=INK)
    return s


@fig
def simple_vs_compound():
    s = Svg(800, 470, "Simple and compound interest compared",
            "NLe 10,000 invested at 10% per year. With simple interest the amount grows by NLe 1,000 each year, a straight "
            "line, reaching NLe 20,000 after 10 years. With compound interest it grows by 10% of the current amount, a "
            "curve, reaching about NLe 25,937 after 10 years.")
    heading(s, "NLe 10,000 at 10% a year")
    ox, oy = 120, 400
    def X(t):
        return ox + t * 58
    def Y(a):
        return oy - (a - 10000) * 0.02
    s.arrow(ox, oy, X(10.6), oy, color=INK, width=2)
    s.arrow(ox, oy, ox, Y(27500), color=INK, width=2)
    for t in range(0, 11, 2):
        s.line(X(t), oy, X(t), oy + 6, color=INK, width=1.5)
        s.text(X(t), oy + 22, str(t), size=14, color=MUTED)
    for a in range(10000, 27000, 5000):
        s.line(ox - 6, Y(a), ox, Y(a), color=INK, width=1.5)
        s.text(ox - 10, Y(a), f"{a // 1000}k", size=14, color=MUTED, anchor="end")
    s.text(X(5), oy + 46, "years", size=15, color=INK)
    plot(s, lambda t: 10000 + 1000 * t, 0, 10, X, Y, color=BLUE, width=3)
    plot(s, lambda t: 10000 * 1.1 ** t, 0, 10, X, Y, color=GREEN, width=3.5)
    s.dot(X(10), Y(20000), r=6, color=BLUE)
    s.dot(X(10), Y(25937), r=6, color=GREEN)
    s.label(X(10) - 6, Y(20000) + 22, "simple: 20,000", size=15, color=BLUE, weight="bold", anchor="end")
    s.label(X(10) - 6, Y(25937) - 4, "compound: 25,937", size=15, color=GREEN, weight="bold", anchor="end")
    return s


@fig
def variation_graphs():
    s = Svg(800, 520, "Graphs of the four kinds of variation",
            "Direct variation y = kx is a straight line through the origin. Inverse variation y = k/x is a curve that falls as x "
            "rises and never meets the axes. Partial variation y = a + kx is a straight line that cuts the y-axis above the "
            "origin. y varies as the square of x, y = kx², is a parabola through the origin.")
    heading(s, "What each kind of variation looks like")
    panels = [(200, 140, "y ∝ x", "y = kx", lambda x: 0.8 * x, BLUE),
              (600, 140, "y ∝ 1/x", "y = k/x", lambda x: 2.4 / x, GREEN),
              (200, 370, "partial", "y = a + kx", lambda x: 1 + 0.5 * x, ORANGE),
              (600, 370, "y ∝ x²", "y = kx²", lambda x: 0.28 * x * x, PURPLE)]
    for cx, cy, t1, t2, fn, col in panels:
        ox, oy, u = cx - 110, cy + 80, 36
        s.arrow(ox, oy, ox + 6 * u, oy, color=INK, width=1.8)
        s.arrow(ox, oy, ox, oy - 4.6 * u, color=INK, width=1.8)
        lo = 0.55 if t1 == "y ∝ 1/x" else 0
        plot(s, fn, lo, 5.4, lambda x: ox + x * u, lambda y: oy - y * u, color=col, width=3.2, ymax=4.3)
        s.text(cx - 10, oy + 26, t1 + ":  " + t2, size=17, weight="bold", color=col)
        s.text(ox - 8, oy + 14, "0", size=13, color=MUTED, anchor="end")
    return s


# ═══ M2: algebra ════════════════════════════════════════════════════════════

@fig
def linear_graph_gradient():
    s = Svg(720, 600, "Graph of y = 2x + 1 with its gradient and intercept",
            "The straight line y = 2x + 1 crosses the y-axis at (0, 1), the intercept. A right-angled triangle drawn from "
            "(0, 1) to (2, 1) to (2, 5) shows a run of 2 and a rise of 4, so the gradient is 4 divided by 2, which is 2.")
    heading(s, "y = mx + c:  gradient m, intercept c")
    ox, oy, u = 330, 440, 46
    X = lambda x: ox + x * u
    Y = lambda y: oy - y * u
    grid_axes(s, X, Y, (-4, 4), (-2, 7))
    plot(s, lambda x: 2 * x + 1, -1.5, 3, X, Y, color=BLUE, width=3.5)
    s.polyline([(X(0), Y(1)), (X(2), Y(1)), (X(2), Y(5))], color=ORANGE, width=3, dash="7 5")
    s.label(X(1), Y(1) + 22, "run = 2", size=16, color=ORANGE, weight="bold")
    s.label(X(2) + 54, Y(3), "rise = 4", size=16, color=ORANGE, weight="bold")
    s.dot(X(0), Y(1), r=7, color=RED)
    s.label(X(0) - 70, Y(1) - 4, "intercept (0, 1)", size=15, color=RED, weight="bold")
    s.label(X(-1.6), Y(5.6), "y = 2x + 1", size=18, color=BLUE, weight="bold")
    note(s, "gradient = rise ÷ run = 4 ÷ 2 = 2", 580, size=17, color=INK)
    return s


@fig
def quadratic_graph():
    s = Svg(720, 650, "Graph of y = x squared minus 2x minus 3",
            "The parabola y = x² − 2x − 3 crosses the x-axis at x = −1 and x = 3, the roots of x² − 2x − 3 = 0. It crosses "
            "the y-axis at (0, −3). Its lowest point, the minimum or vertex, is (1, −4), and the dashed vertical line x = 1 "
            "is its line of symmetry.")
    heading(s, "The parabola y = x² − 2x − 3")
    ox, oy, u = 300, 356, 44
    X = lambda x: ox + x * u
    Y = lambda y: oy - y * u
    grid_axes(s, X, Y, (-3, 5), (-5, 6))
    s.line(X(1), Y(5.6), X(1), Y(-4.8), color=PURPLE, width=2, dash="7 6")
    plot(s, lambda x: x * x - 2 * x - 3, -2.2, 4.2, X, Y, color=BLUE, width=3.5, ymax=6)
    for (px, py) in ((-1, 0), (3, 0)):
        s.dot(X(px), Y(py), r=7, color=RED)
    s.label(X(-1) - 36, Y(0) - 22, "root x = −1", size=15, color=RED, weight="bold")
    s.label(X(3) + 52, Y(0) - 22, "root x = 3", size=15, color=RED, weight="bold")
    s.dot(X(0), Y(-3), r=6, color=ORANGE)
    s.label(X(0) - 72, Y(-3), "(0, −3)", size=15, color=ORANGE, weight="bold")
    s.dot(X(1), Y(-4), r=7, color=GREEN)
    s.label(X(1) + 92, Y(-4), "minimum (1, −4)", size=15, color=GREEN, weight="bold")
    s.label(X(1) + 60, Y(5.2), "x = 1", size=15, color=PURPLE, weight="bold")
    note(s, "roots where the curve meets the x-axis; symmetric about x = 1", 632, size=16, color=INK)
    return s


@fig
def quadratic_read_solutions():
    s = Svg(720, 640, "Using the graph of y = x squared minus 2x minus 3 to solve x squared minus 2x minus 5 = 0",
            "The line y = 2 cuts the parabola y = x² − 2x − 3 at about x = −1.4 and x = 3.4. These x-values solve "
            "x² − 2x − 3 = 2, which is x² − 2x − 5 = 0.")
    heading(s, "Reading solutions: where y = x² − 2x − 3 meets y = 2")
    ox, oy, u = 300, 350, 44
    X = lambda x: ox + x * u
    Y = lambda y: oy - y * u
    grid_axes(s, X, Y, (-3, 5), (-5, 6))
    plot(s, lambda x: x * x - 2 * x - 3, -2.2, 4.2, X, Y, color=BLUE, width=3.5, ymax=6)
    s.line(X(-3), Y(2), X(5), Y(2), color=ORANGE, width=3)
    s.label(X(4.3), Y(2) - 20, "y = 2", size=16, color=ORANGE, weight="bold")
    for xr in (1 - 6 ** 0.5, 1 + 6 ** 0.5):
        s.line(X(xr), Y(2), X(xr), Y(0), color=RED, width=2.2, dash="6 5")
        s.dot(X(xr), Y(2), r=7, color=RED)
        s.dot(X(xr), Y(0), r=5, color=RED)
    s.label(X(-1.45) - 44, Y(0) - 22, "x ≈ −1.4", size=15, color=RED, weight="bold")
    s.label(X(3.45) + 44, Y(0) - 22, "x ≈ 3.4", size=15, color=RED, weight="bold")
    note(s, "x² − 2x − 3 = 2  is the same as  x² − 2x − 5 = 0", 620, size=17, color=INK)
    return s


@fig
def inequality_number_lines():
    s = Svg(760, 430, "Inequalities on number lines",
            "Three number lines. x > 2 has an open circle at 2 and an arrow to the right. x ≤ −1 has a filled circle at "
            "−1 and an arrow to the left. −2 ≤ x < 3 has a filled circle at −2, an open circle at 3, and the segment "
            "between them shaded.")
    heading(s, "Open circle: not included.  Filled circle: included.")
    rows = [(110, "x > 2"), (220, "x ≤ −1"), (330, "−2 ≤ x < 3")]
    x0, u = 190, 52
    X = lambda v: x0 + (v + 4) * u
    for y, lab in rows:
        s.arrow(X(-4.4), y, X(5.4), y, color=INK, width=2)
        s.arrow(X(5.4), y, X(-4.6), y, color=INK, width=2)
        for v in range(-4, 6):
            s.line(X(v), y - 8, X(v), y + 8, color=INK, width=2)
            s.text(X(v), y + 28, str(v).replace("-", "−"), size=15, color=MUTED)
        s.text(18, y - 22, lab, size=18, weight="bold", color=BLUE, anchor="start")
    y = rows[0][0]
    s.line(X(2), y - 22, X(5.2), y - 22, color=BLUE, width=5, arrow="end")
    s.circle(X(2), y - 22, 8, fill="#ffffff", stroke=BLUE, width=3.5)
    y = rows[1][0]
    s.line(X(-1), y - 22, X(-4.2), y - 22, color=BLUE, width=5, arrow="end")
    s.circle(X(-1), y - 22, 8, fill=BLUE, stroke=BLUE, width=3.5)
    y = rows[2][0]
    s.line(X(-2), y - 22, X(3), y - 22, color=BLUE, width=5)
    s.circle(X(-2), y - 22, 8, fill=BLUE, stroke=BLUE, width=3.5)
    s.circle(X(3), y - 22, 8, fill="#ffffff", stroke=BLUE, width=3.5)
    note(s, "< or >  →  open circle   ·   ≤ or ≥  →  filled circle", 405, size=16, color=INK)
    return s


@fig
def inequality_region():
    s = Svg(720, 600, "The region where x ≥ 0, y ≥ 0, x + y ≤ 4 and y < x + 1",
            "The line x + y = 4 is drawn solid because the inequality includes it. The line y = x + 1 is drawn dashed "
            "because the inequality is strict. The shaded region below both lines and above the x-axis, to the right of "
            "the y-axis, has corners at (0, 0), (4, 0), (1.5, 2.5) and (0, 1).")
    heading(s, "Solid line: ≤ or ≥.  Dashed line: < or >.")
    ox, oy, u = 170, 470, 78
    X = lambda x: ox + x * u
    Y = lambda y: oy - y * u
    grid_axes(s, X, Y, (-1, 5), (-1, 5))
    s.polygon([(X(0), Y(0)), (X(4), Y(0)), (X(1.5), Y(2.5)), (X(0), Y(1))], fill=F_GREEN, stroke=GREEN, width=0, opacity=0.85)
    plot(s, lambda x: 4 - x, -0.5, 4.8, X, Y, color=BLUE, width=3.2)
    s.line(X(-0.8), Y(0.2), X(3.8), Y(4.8), color=RED, width=3.2, dash="10 7")
    s.label(X(4.1), Y(1.3), "x + y = 4", size=16, color=BLUE, weight="bold")
    s.label(X(3.3), Y(4.6), "y = x + 1", size=16, color=RED, weight="bold")
    s.dot(X(1.5), Y(2.5), r=6, color=INK)
    s.label(X(1.5) + 70, Y(2.5) - 6, "(1.5, 2.5)", size=15, weight="bold")
    s.label(X(1.6), Y(1.0), "required region", size=16, color=GREEN, weight="bold")
    note(s, "test a point such as (1, 1): 1 + 1 ≤ 4 ✓ and 1 < 1 + 1 ✓", 575, size=16, color=INK)
    return s


# ─────────────────────────────────────────────────────────────────────────────

def main(names: list[str]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    chosen = names or list(FIGS)
    for n in chosen:
        if n not in FIGS:
            raise SystemExit(f"unknown figure: {n}")
        FIGS[n]().save(OUT / f"{n}.svg")
    print(f"wrote {len(chosen)} diagram(s) to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main(sys.argv[1:])
