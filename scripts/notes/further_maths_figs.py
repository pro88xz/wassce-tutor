#!/usr/bin/env python3
"""Original diagrams for the Further Mathematics notes.

    python3 scripts/notes/further_maths_figs.py            # write every diagram
    python3 scripts/notes/further_maths_figs.py name ...   # write some

Each function draws one figure and returns an Svg. Files go to
public/img/further-mathematics/<name>.svg and lessons show them from
https://wasscetutor.com/img/further-mathematics/<name>.svg. All drawn by WASSCE
Tutor; every graph is plotted from its equation, so the figure matches the
lesson's numbers.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from government_figs import heading, note  # noqa: E402
from maths_figs import grid_axes, plot  # noqa: E402
from svgfig import (  # noqa: E402
    BLUE, F_AMBER, F_BLUE, F_GREEN, GREEN, INK, MUTED, ORANGE, PURPLE, RED, Svg,
)

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/img/further-mathematics"
FIGS: dict[str, callable] = {}


def fig(fn):
    FIGS[fn.__name__.replace("_", "-")] = fn
    return fn


# ═══ Batch 1: algebra ════════════════════════════════════════════════════════

@fig
def cubic_roots_graph():
    s = Svg(800, 560, "Graph of y = x³ − 2x² − 5x + 6 and its roots",
            "The curve y = x cubed minus 2x squared minus 5x plus 6 crosses the x-axis at x = −2, x = 1 and x = 3, "
            "so the cubic factorises as (x + 2)(x − 1)(x − 3). It crosses the y-axis at 6, the constant term. Each "
            "root a gives a factor (x − a), by the factor theorem.")
    heading(s, "Roots on the graph are factors of the polynomial")
    ox, oy, ux, uy = 400, 300, 62, 21

    def X(x):
        return ox + x * ux

    def Y(y):
        return oy - y * uy

    for gx in range(-4, 6):
        s.line(X(gx), Y(-10), X(gx), Y(11), color="#e5e7eb", width=1)
    for gy in range(-10, 12, 2):
        s.line(X(-4), Y(gy), X(5), Y(gy), color="#e5e7eb", width=1)
    s.arrow(X(-4), Y(0), X(5) + 14, Y(0), color=INK, width=2)
    s.arrow(X(0), Y(-10), X(0), Y(11) - 12, color=INK, width=2)
    s.text(X(5) + 22, Y(0) + 4, "x", size=16, italic=True)
    s.text(X(0) + 6, Y(11) - 22, "y", size=16, italic=True, anchor="start")
    for gx in range(-4, 6):
        if gx:
            s.text(X(gx), Y(0) + 18, str(gx), size=13, color=MUTED)
    for gy in range(-10, 12, 2):
        if gy:
            s.text(X(0) - 8, Y(gy), str(gy), size=13, color=MUTED, anchor="end")
    plot(s, lambda x: x**3 - 2 * x**2 - 5 * x + 6, -2.55, 3.75, X, Y, color=BLUE, width=3.5, ymin=-10.5, ymax=11)
    for r, lab in ((-2, "x = −2"), (1, "x = 1"), (3, "x = 3")):
        s.dot(X(r), Y(0), r=7, color=RED)
        s.label(X(r), Y(0) - 26, lab, size=15, color=RED, weight="bold")
    s.dot(X(0), Y(6), r=6, color=GREEN)
    s.label(X(0) + 52, Y(6) - 4, "(0, 6)", size=15, color=GREEN, weight="bold")
    s.label(X(3.6), Y(9.4), "y = x³ − 2x² − 5x + 6", size=16, color=BLUE, weight="bold")
    note(s, "x³ − 2x² − 5x + 6 = (x + 2)(x − 1)(x − 3)", 535, size=18, color=INK)
    return s


@fig
def pascals_triangle():
    rows = [[math.comb(n, k) for k in range(n + 1)] for n in range(7)]
    s = Svg(800, 540, "Pascal's triangle, rows 0 to 6",
            "Pascal's triangle: each row starts and ends with 1, and every other number is the sum of the two numbers "
            "above it. Row 0 is 1; row 1 is 1 1; row 2 is 1 2 1; row 3 is 1 3 3 1; row 4 is 1 4 6 4 1; row 5 is 1 5 10 "
            "10 5 1; row 6 is 1 6 15 20 15 6 1. Row n gives the coefficients of (a + b) to the power n; for example 4 + 6 "
            "= 10 gives the 10 in row 5.")
    heading(s, "Pascal's triangle: the coefficients of (a + b)ⁿ")
    top, dy, dx = 92, 62, 82
    for n, row in enumerate(rows):
        y = top + n * dy
        s.text(70, y, f"n = {n}", size=15, color=MUTED, anchor="start")
        for k, v in enumerate(row):
            x = 400 + (k - n / 2) * dx
            hot = n == 5 and k == 2 or n == 4 and k in (1, 2)
            fill = F_AMBER if n == 5 and k == 2 else (F_BLUE if n == 4 and k in (1, 2) else "#ffffff")
            s.circle(x, y, 25, fill=fill, stroke=ORANGE if hot else MUTED, width=2.5 if hot else 1.5)
            s.text(x, y + 1, str(v), size=19, weight="bold", color=INK)
    # 4 + 6 = 10
    y4, y5 = top + 4 * dy, top + 5 * dy
    for k_above in (1, 2):
        xa = 400 + (k_above - 2) * dx
        s.arrow(xa, y4 + 26, 400 + (2 - 2.5) * dx + (k_above - 1) * 0, y5 - 27, color=ORANGE, width=2.2)
    note(s, "Each number is the sum of the two above it: 4 + 6 = 10", 512, size=17, color=INK)
    return s


@fig
def function_mappings():
    s = Svg(800, 470, "One-to-one and many-to-one mappings",
            "Two arrow diagrams. In the one-to-one mapping f(x) = 2x + 1 on the domain {1, 2, 3}, the elements map to 3, "
            "5 and 7, each output from a single input. In the many-to-one mapping g(x) = x² on the domain {−2, −1, 1, 2}, "
            "both −2 and 2 map to 4, and both −1 and 1 map to 1. Both are functions, because each input has exactly one "
            "output; only the one-to-one function has an inverse.")
    heading(s, "Every input has exactly one output")

    def panel(cx, title, left, right, pairs, color):
        s.text(cx, 74, title, size=17, weight="bold", color=color)
        for ex, labels in ((cx - 110, left), (cx + 110, right)):
            s.ellipse(ex, 240, 62, 128, fill="#ffffff", stroke=MUTED, width=2)
            for i, lab in enumerate(labels):
                s.text(ex, 170 + i * (150 / max(1, len(labels) - 1)) if len(labels) > 1 else 240, lab, size=19,
                       weight="bold")
        s.text(cx - 110, 390, "domain", size=15, color=MUTED)
        s.text(cx + 110, 390, "range", size=15, color=MUTED)
        n_l, n_r = len(left), len(right)

        def yl(i):
            return 170 + i * (150 / max(1, n_l - 1))

        def yr(i):
            return 170 + i * (150 / max(1, n_r - 1)) if n_r > 1 else 240
        for i, j in pairs:
            s.arrow(cx - 88, yl(i), cx + 86, yr(j), color=color, width=2.3)

    panel(210, "one-to-one: f(x) = 2x + 1", ["1", "2", "3"], ["3", "5", "7"], [(0, 0), (1, 1), (2, 2)], BLUE)
    panel(590, "many-to-one: g(x) = x²", ["−2", "−1", "1", "2"], ["1", "4"], [(0, 1), (1, 0), (2, 0), (3, 1)], GREEN)
    note(s, "Only a one-to-one function has an inverse", 440, size=17, color=INK)
    return s


@fig
def composite_function_machine():
    s = Svg(800, 330, "A composite function as two machines",
            "The composite function f∘g as two machines in a row. The input x = 3 goes into g(x) = x² + 1 first, giving "
            "10; that output goes into f(x) = 2x − 5, giving 15. So fg(3) = f(g(3)) = f(10) = 15: the function written "
            "nearer x acts first.")
    heading(s, "fg(x) = f(g(x)): g acts first")
    s.rect(30, 125, 90, 70, fill=F_GREEN, stroke=GREEN, width=2.5, rx=8)
    s.text(75, 160, "x = 3", size=19, weight="bold")
    s.arrow(122, 160, 188, 160, color=INK, width=2.6)
    s.rect(190, 105, 170, 110, fill=F_BLUE, stroke=BLUE, width=3, rx=10)
    s.text(275, 140, "g", size=24, weight="bold", color=BLUE)
    s.text(275, 178, "x² + 1", size=19, weight="bold")
    s.arrow(362, 160, 438, 160, color=INK, width=2.6)
    s.text(400, 140, "10", size=19, weight="bold", color=ORANGE)
    s.rect(440, 105, 170, 110, fill=F_AMBER, stroke=ORANGE, width=3, rx=10)
    s.text(525, 140, "f", size=24, weight="bold", color=ORANGE)
    s.text(525, 178, "2x − 5", size=19, weight="bold")
    s.arrow(612, 160, 678, 160, color=INK, width=2.6)
    s.rect(680, 125, 80, 70, fill=F_GREEN, stroke=GREEN, width=2.5, rx=8)
    s.text(720, 160, "15", size=21, weight="bold")
    note(s, "fg(3) = f(g(3)) = f(10) = 2(10) − 5 = 15", 262, size=19, color=INK)
    note(s, "gf(3) = g(f(3)) = g(1) = 2: the order matters", 296, size=16, color=MUTED)
    return s


@fig
def exp_log_inverse():
    s = Svg(800, 560, "y = 3 to the power x and y = log base 3 of x are inverse functions",
            "The curve y = 3^x passes through (0, 1) and (1, 3). The curve y = log3 x passes through (1, 0) and (3, 1). "
            "Each is the reflection of the other in the line y = x, because the logarithm undoes the exponential. log3 x "
            "is defined only for x greater than 0.")
    heading(s, "Logarithm and exponential: reflections in y = x")
    ox, oy, u = 290, 300, 52

    def X(x):
        return ox + x * u

    def Y(y):
        return oy - y * u
    grid_axes(s, X, Y, (-3, 7), (-3, 4))
    plot(s, lambda x: x, -3, 4, X, Y, color=MUTED, width=2)
    plot(s, lambda x: 3 ** x, -3, math.log(4.2, 3), X, Y, color=BLUE, width=3.5)
    plot(s, lambda x: math.log(x, 3), 0.04, 7, X, Y, color=GREEN, width=3.5)
    for (px, py, c) in ((0, 1, BLUE), (1, 3, BLUE), (1, 0, GREEN), (3, 1, GREEN)):
        s.dot(X(px), Y(py), r=6, color=c)
    s.label(X(-0.9), Y(3.3), "y = 3ˣ", size=17, color=BLUE, weight="bold")
    s.label(X(5.7), Y(2.2), "y = log₃ x", size=17, color=GREEN, weight="bold")
    s.label(X(3.6), Y(3.5), "y = x", size=15, color=MUTED)
    note(s, "log₃ 9 = 2 because 3² = 9; log₃ x needs x > 0", 535, size=17, color=INK)
    return s


@fig
def venn_three_inclusion():
    s = Svg(800, 520, "Three-set Venn diagram for a survey of 60 students",
            "A Venn diagram of a survey of 60 students: 30 study Further Mathematics (F), 28 Physics (P) and 26 Chemistry "
            "(C). 12 study F and P, 10 study F and C, 11 study P and C, and 5 study all three. Filling from the middle: 5 in "
            "all three; 7 F and P only, 5 F and C only, 6 P and C only; 13 F only, 10 P only, 10 C only; total in at "
            "least one set 56, so 4 study none.")
    heading(s, "60 students: fill the Venn diagram from the middle out")
    s.rect(90, 60, 620, 410, fill="#ffffff", stroke=INK, width=2.5, rx=8)
    s.text(110, 82, "U (60)", size=17, weight="bold", anchor="start")
    r = 125
    cF, cP, cC = (320, 205), (480, 205), (400, 330)
    for (cx, cy), col in ((cF, BLUE), (cP, GREEN), (cC, PURPLE)):
        s.circle(cx, cy, r, fill="none", stroke=col, width=3)
    s.text(220, 100, "F (30)", size=17, weight="bold", color=BLUE)
    s.text(585, 100, "P (28)", size=17, weight="bold", color=GREEN)
    s.text(250, 420, "C (26)", size=17, weight="bold", color=PURPLE)
    vals = [((262, 180), "13"), ((540, 180), "10"), ((400, 395), "10"), ((400, 175), "7"),
            ((330, 290), "5"), ((470, 290), "6"), ((400, 250), "5")]
    for (x, y), v in vals:
        s.text(x, y, v, size=26, weight="bold", color=ORANGE if v == "5" and (x, y) == (400, 250) else INK)
    s.text(660, 440, "4", size=26, weight="bold", color=MUTED)
    note(s, "n(F ∪ P ∪ C) = 30 + 28 + 26 − 12 − 10 − 11 + 5 = 56", 505, size=17, color=INK)
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
