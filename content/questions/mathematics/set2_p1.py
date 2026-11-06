"""Mathematics (Core) set 2: 50 original Paper 1 questions, 15 with diagrams.

Written by WASSCE Tutor in the style of WASSCE Paper 1. Nothing here is copied
from a WAEC paper. Topics come from the 2018 and 2019 Sierra Leone papers and
the Ministry's revision handbooks; see SCOPE.md.

Diagrams are drawn to scale from the coordinates defined below, and each
diagram question's `solve` measures its answer from those same coordinates,
so a figure cannot disagree with its question.

Run `python3 scripts/questions/build.py` to check everything and rebuild.
"""

import math
from decimal import ROUND_HALF_UP, Decimal

import sympy as sp

from diagram import ASK, Fig, angle_at, bearing, dist, on_circle
from qbank import Q, R, Rounded, Wrong

TOPICS = {
    "Circles": "D(d) Circles: angle at centre, angle in a semicircle, cyclic quadrilaterals, tangents, alternate segment",
    "Angles and Intersecting Lines": "D(a)-(c) Angles: at a point, on parallel lines; triangles",
    "Sine, Cosine and Tangent": "F(a) Trigonometric ratios, special angles, angles 0°-360°; sine and cosine rules",
    "Angles of Elevation and Depression": "F(b) Angles of elevation and depression: heights and distances",
    "Bearings": "F(c) Bearings: three-figure bearings, distances and angles",
    "Volumes": "C(c) Volumes of cones, cylinders, spheres, cuboids; similar solids",
    "Measures of Central Tendency": "H(a)(iii) Mean, median and mode of discrete and grouped data",
    "Logarithms": "A(e) Logarithms: laws of logarithms; logarithmic equations",
    "Modular Arithmetic": "A(b) Modular arithmetic: operations; market days, clocks, shift duty",
    "Vectors": "I Vectors in a plane: column vectors, magnitude, direction (bearing), parallel vectors",
}

O = (0.0, 0.0)
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def half_up(x, places: str) -> Decimal:
    """Round the way students do by hand (5 rounds up), not banker's rounding."""
    return Decimal(str(x)).quantize(Decimal(places), rounding=ROUND_HALF_UP)


def deg(x: float) -> float:
    return round(x, 6)


def must(measured: float, stated: float, what: str) -> None:
    if abs(measured - stated) > 1e-6:
        raise AssertionError(f"figure shows {what} = {measured:.4f}, question says {stated}")


def col(a, b) -> str:
    return rf"$\begin{{pmatrix}} {a} \\ {b} \end{{pmatrix}}$"


def tan(d):
    return math.tan(math.radians(d))


def sin(d):
    return math.sin(math.radians(d))


def cos(d):
    return math.cos(math.radians(d))


# ── Figures ────────────────────────────────────────────────────────────────
C1 = {"A": on_circle(O, 3, 210), "B": on_circle(O, 3, 334), "C": on_circle(O, 3, 95)}
C2 = {"A": (-3.0, 0.0), "B": (3.0, 0.0), "C": on_circle(O, 3, 76)}
C3 = {"P": on_circle(O, 3, 90), "Q": on_circle(O, 3, 170), "R": on_circle(O, 3, 270), "S": on_circle(O, 3, 10)}
C4 = {"T": (25 / 13, 60 / 13), "P": (13.0, 0.0)}
C5 = {"A": on_circle(O, 3, 270), "B": on_circle(O, 3, 38), "C": on_circle(O, 3, 150), "T": (3.4, -3.0)}

_M1 = (1.2 + 2 / tan(68), 2.0)
A1 = {"P": (-1.5, 2.0), "Q": (4.5, 2.0), "R": (-1.5, 0.0), "S": (4.5, 0.0), "N": (1.2, 0.0), "M": _M1}
A2 = {k: on_circle(O, 2.7, d) for k, d in {"e10": 10, "e80": 80, "e190": 190, "e260": 260}.items()}
_QP = 4 * sin(67) / sin(65)
A3 = {"Q": (0.0, 0.0), "R": (4.0, 0.0), "S": (6.2, 0.0), "P": (_QP * cos(48), _QP * sin(48))}
A4 = {"A": (0.0, 4.0), "B": (-4 * tan(20), 0.0), "C": (4 * tan(20), 0.0)}
_N5 = (2.5, 0.0)
_M5 = (_N5[0] + 2 / sin(110) * cos(110), 2.0)
A5 = {"A": (-1.5, 2.0), "B": (4.5, 2.0), "C": (-1.5, 0.0), "D": (4.5, 0.0), "N": _N5, "M": _M5,
      "U": (_M5[0] + 0.9 * cos(110), 2 + 0.9 * sin(110))}

T1 = {"Q": (0.0, 0.0), "P": (0.0, 8.0), "R": (15.0, 0.0)}
E1 = {"P": (0.0, 0.0), "F": (30.0, 0.0), "T": (30.0, 30 * tan(40))}
E2 = {"T": (0.0, 80.0), "F": (0.0, 0.0), "H": (60.0, 80.0), "B": (80 / tan(25), 0.0)}
B4 = {"P": (0.0, 0.0), "Q": (0.0, 8.0), "R": (6.0, 8.0)}
B5 = {"T": (0.0, 0.0), "A": (10 * sin(30), 10 * cos(30)), "B": (10 * sin(120), 10 * cos(120))}


def fig_c1():
    g, f = C1, Fig(-4, 4, -4, 4, width=300)
    f.circle(O, 3)
    for a, b in [(O, g["A"]), (O, g["B"]), (g["C"], g["A"]), (g["C"], g["B"])]:
        f.line(a, b)
    f.angle(O, g["A"], g["B"], "124°", r=20)
    f.angle(g["C"], g["A"], g["B"], "x", r=26, color=ASK)
    for k in "ABC":
        f.dot(g[k])
        f.label(k, g[k], away_from=O)
    f.dot(O)
    f.label("O", O, direction=90)
    return f.svg("Circle with centre O. Angle AOB is 124°. The angle marked x is angle ACB.")


def fig_c2():
    g, f = C2, Fig(-4, 4, -3.6, 4, width=300)
    f.circle(O, 3)
    for a, b in [(g["A"], g["B"]), (g["A"], g["C"]), (g["C"], g["B"])]:
        f.line(a, b)
    f.angle(g["A"], g["C"], g["B"], "38°", r=30)
    f.angle(g["B"], g["A"], g["C"], "x", r=26, color=ASK)
    f.dot(O)
    f.label("O", O, direction=-90)
    for k, d in [("A", 180), ("B", 0), ("C", 76)]:
        f.dot(g[k])
        f.label(k, g[k], direction=d)
    return f.svg("Circle with centre O and diameter AB. Angle CAB is 38°. The angle marked x is angle ABC.")


def fig_c3():
    g, f = C3, Fig(-4, 4, -4, 4, width=300)
    f.circle(O, 3)
    f.poly([g["P"], g["Q"], g["R"], g["S"]])
    f.angle(g["P"], g["Q"], g["S"], "2x°", r=24)
    f.angle(g["R"], g["Q"], g["S"], "(x + 30)°", r=22, label_gap=24)
    for k in "PQRS":
        f.dot(g[k])
        f.label(k, g[k], away_from=O)
    return f.svg("Cyclic quadrilateral PQRS. Angle QPS is 2x degrees and angle QRS is (x + 30) degrees.")


def fig_c4():
    g, f = C4, Fig(-5.8, 15, -5.8, 6.2, width=340)
    f.circle(O, 5)
    f.line(O, g["T"])
    f.line(O, g["P"])
    f.line(g["T"], g["P"])
    f.right_angle(g["T"], O, g["P"])
    f.mid_label("5 cm", O, g["T"], side=1)
    f.mid_label("13 cm", O, g["P"], side=-1)
    f.dot(O)
    f.label("O", O, direction=200)
    f.dot(g["T"])
    f.label("T", g["T"], away_from=O)
    f.dot(g["P"])
    f.label("P", g["P"], direction=0)
    return f.svg("Circle with centre O and radius 5 cm. PT is a tangent at T and OP is 13 cm.")


def fig_c5():
    g, f = C5, Fig(-4, 4.4, -4, 4, width=300)
    f.circle(O, 3)
    f.line((-3.8, -3.0), (4.0, -3.0))
    for a, b in [(g["A"], g["B"]), (g["C"], g["A"]), (g["C"], g["B"])]:
        f.line(a, b)
    f.angle(g["A"], g["T"], g["B"], "64°", r=26)
    f.angle(g["C"], g["A"], g["B"], "x", r=26, color=ASK)
    f.dot(g["A"])
    f.label("A", g["A"], direction=-90)
    f.label("T", g["T"], direction=-90)
    for k in "BC":
        f.dot(g[k])
        f.label(k, g[k], away_from=O)
    return f.svg("TA is a tangent to the circle at A. Angle TAB is 64°. The angle marked x is angle ACB.")


def fig_a1():
    g, f = A1, Fig(-2.2, 5.2, -1.0, 3.0, width=320)
    N, M = g["N"], g["M"]
    f.line(g["P"], g["Q"])
    f.line(g["R"], g["S"])
    f.line((N[0] - 0.45 * (M[0] - N[0]), -0.9), (M[0] + 0.45 * (M[0] - N[0]), 2.9))
    f.arrowhead((-0.9, 2.0), (-0.5, 2.0))
    f.arrowhead((-0.9, 0.0), (-0.5, 0.0))
    f.angle(M, g["P"], N, "68°", r=26)
    f.angle(N, g["R"], M, "x", r=26, color=ASK)
    for k, d in [("P", 180), ("Q", 0), ("R", 180), ("S", 0), ("M", 30), ("N", 214)]:
        f.label(k, g[k], direction=d)
    return f.svg("PQ is parallel to RS. A transversal meets PQ at M and RS at N. Angle PMN is 68°; x is angle RNM.")


def fig_a2():
    g, f = A2, Fig(-3.2, 3.2, -3.2, 3.2, width=280)
    f.line(g["e10"], g["e190"])
    f.line(g["e80"], g["e260"])
    f.angle(O, g["e10"], g["e80"], "(3x − 20)°", r=24, label_gap=34)
    f.angle(O, g["e190"], g["e260"], "(x + 40)°", r=24, label_gap=34)
    f.dot(O)
    return f.svg("Two straight lines cross. Vertically opposite angles are (3x − 20)° and (x + 40)°.")


def fig_a3():
    g, f = A3, Fig(-0.8, 6.8, -0.9, 3.9, width=320)
    f.line(g["P"], g["Q"])
    f.line(g["P"], g["R"])
    f.line(g["Q"], g["S"])
    f.angle(g["Q"], g["R"], g["P"], "48°", r=28)
    f.angle(g["P"], g["Q"], g["R"], "65°", r=24)
    f.angle(g["R"], g["P"], g["S"], "x", r=22, color=ASK)
    for k, d in [("P", 90), ("Q", 210), ("R", 270), ("S", 270)]:
        f.dot(g[k])
        f.label(k, g[k], direction=d)
    return f.svg("Triangle PQR with QR extended to S. Angle PQR is 48°, angle QPR is 65°; x is angle PRS.")


def fig_a4():
    g, f = A4, Fig(-2.4, 2.4, -0.8, 4.8, width=240)
    f.poly([g["A"], g["B"], g["C"]])
    f.tick(g["A"], g["B"])
    f.tick(g["A"], g["C"])
    f.angle(g["A"], g["B"], g["C"], "40°", r=30)
    f.angle(g["B"], g["C"], g["A"], "x", r=20, color=ASK)
    for k, d in [("A", 90), ("B", 210), ("C", 330)]:
        f.dot(g[k])
        f.label(k, g[k], direction=d)
    return f.svg("Isosceles triangle ABC with AB equal to AC. Angle BAC is 40°; x is angle ABC.")


def fig_a5():
    g, f = A5, Fig(-2.2, 5.2, -1.0, 3.2, width=320)
    N, M = g["N"], g["M"]
    f.line(g["A"], g["B"])
    f.line(g["C"], g["D"])
    f.line((N[0] - 0.5 * (M[0] - N[0]), -0.9), (M[0] + 0.55 * (M[0] - N[0]), 3.1))
    f.arrowhead((-0.9, 2.0), (-0.5, 2.0))
    f.arrowhead((-0.9, 0.0), (-0.5, 0.0))
    f.angle(M, g["B"], g["U"], "(2y + 10)°", r=22, label_gap=30)
    f.angle(N, g["D"], M, "110°", r=22, label_gap=20)
    for k, d in [("A", 180), ("B", 0), ("C", 180), ("D", 0)]:
        f.label(k, g[k], direction=d)
    return f.svg("AB is parallel to CD. Corresponding angles are (2y + 10)° and 110°.")


def fig_t1():
    g, f = T1, Fig(-2.5, 16.8, -2.2, 9.6, width=320)
    f.poly([g["P"], g["Q"], g["R"]])
    f.right_angle(g["Q"], g["P"], g["R"])
    f.angle(g["R"], g["Q"], g["P"], None, r=34)
    f.mid_label("8 cm", g["Q"], g["P"], side=1)
    f.mid_label("15 cm", g["Q"], g["R"], side=-1)
    for k, d in [("P", 90), ("Q", 225), ("R", 0)]:
        f.label(k, g[k], direction=d)
    return f.svg("Right-angled triangle PQR with the right angle at Q. PQ is 8 cm and QR is 15 cm.")


def fig_e1():
    g, f = E1, Fig(-4, 37, -4, 29, width=320)
    f.line((-2.0, 0.0), (35.0, 0.0), width=1.6)
    f.line(g["F"], g["T"], width=4)
    f.line(g["P"], g["T"], dash=True)
    f.right_angle(g["F"], g["P"], g["T"])
    f.angle(g["P"], g["F"], g["T"], "40°", r=40)
    f.mid_label("30 m", g["P"], g["F"], side=-1)
    f.mid_label("h", g["F"], g["T"], side=-1)
    f.dot(g["P"])
    f.label("P", g["P"], direction=210)
    return f.svg("A vertical tower 30 m from point P. The angle of elevation of the top from P is 40°.")


def fig_e2():
    g, f = E2, Fig(-35, 195, -22, 100, width=340)
    f.line((-30.0, 0.0), (190.0, 0.0), width=1.6)
    f.line(g["F"], g["T"], width=4)
    f.line(g["T"], g["H"], dash=True)
    f.line(g["T"], g["B"], dash=True)
    f.right_angle(g["F"], g["T"], g["B"])
    f.angle(g["T"], g["H"], g["B"], "25°", r=46)
    f.mid_label("80 m", g["F"], g["T"], side=1)
    f.mid_label("d", g["F"], g["B"], side=-1)
    f.dot(g["B"])
    f.label("B", g["B"], direction=60)
    return f.svg("A cliff 80 m high. The angle of depression of boat B from the top is 25°.")


def fig_b4():
    g, f = B4, Fig(-3.0, 8.6, -1.4, 10.4, width=260)
    f.line(g["P"], g["Q"])
    f.line(g["Q"], g["R"])
    f.line(g["P"], g["R"], dash=True)
    f.north((-2.0, 7.6), length=1.6)
    f.angle(g["P"], g["Q"], g["R"], "θ", r=34, color=ASK)
    f.mid_label("8 km", g["P"], g["Q"], side=1)
    f.mid_label("6 km", g["Q"], g["R"], side=1)
    for k, d in [("P", 270), ("Q", 135), ("R", 0)]:
        f.dot(g[k])
        f.label(k, g[k], direction=d)
    return f.svg("A ship sails 8 km north from P to Q, then 6 km east to R. Theta is the angle at P between north and PR.")


def fig_b5():
    g, f = B5, Fig(-3.0, 12.0, -7.4, 12.2, width=300)
    up = (0.0, 4.0)
    f.north(O, length=11.0)
    f.line(g["T"], g["A"])
    f.line(g["T"], g["B"])
    f.line(g["A"], g["B"], dash=True)
    f.angle(O, up, g["A"], "30°", r=56, label_gap=13)
    f.angle(O, up, g["B"], "120°", r=24, label_gap=18)
    f.mid_label("10 km", g["T"], g["A"], side=-1)
    f.mid_label("10 km", g["T"], g["B"], side=-1)
    for k, d in [("T", 200), ("A", 60), ("B", 0)]:
        f.dot(g[k])
        f.label(k, g[k], direction=d)
    return f.svg("From town T, village A is 10 km on a bearing of 030° and village B is 10 km on a bearing of 120°.")


def table(rows: list[tuple[str, list]]) -> str:
    cols = len(rows[0][1])
    lines = [rf"\text{{{name}}} & " + " & ".join(str(v) for v in vals) for name, vals in rows]
    return "$$\n\\begin{array}{l|" + "c" * cols + "}\n" + " \\\\ \\hline\n".join(lines) + "\n\\end{array}\n$$"


QUESTIONS = [
    # ── Circles ────────────────────────────────────────────────────────────
    Q(
        id="maths-circles-01",
        topic="Circles",
        ref=TOPICS["Circles"],
        stem=r"In the diagram, $O$ is the centre of the circle and $\angle AOB = 124°$. Find the angle marked $x$.",
        answer=(r"$62°$", 62),
        wrong=[
            Wrong(r"$124°$", 124, r"The angle at the centre is twice the angle at the circumference, so $x$ is half of 124°, not equal to it."),
            Wrong(r"$236°$", 236, r"236° is the reflex angle at $O$ ($360° - 124°$). $x$ stands on the minor arc $AB$, which goes with the 124° angle.", lambda: 360 - 124),
            Wrong(r"$248°$", 248, r"You doubled 124°. The angle at the circumference is half the angle at the centre.", lambda: 2 * 124),
        ],
        solve=lambda: (must(angle_at(O, C1["A"], C1["B"]), 124, "angle AOB"), deg(angle_at(C1["C"], C1["A"], C1["B"])))[1],
        diagram=fig_c1,
        working=r"""The angle at the centre is twice the angle at the circumference standing on the same arc:

$\angle AOB = 2x$, so $x = \dfrac{124°}{2} = 62°$.""",
    ),
    Q(
        id="maths-circles-02",
        topic="Circles",
        ref=TOPICS["Circles"],
        stem=r"In the diagram, $AB$ is a diameter of the circle with centre $O$ and $\angle CAB = 38°$. Find the angle marked $x$.",
        answer=(r"$52°$", 52),
        wrong=[
            Wrong(r"$76°$", 76, r"You doubled 38°. Doubling is for the angle at the centre. The key fact here is that the angle in a semicircle, $\angle ACB$, is 90°.", lambda: 2 * 38),
            Wrong(r"$128°$", 128, r"You added 90° and 38°. Those are two angles of triangle $ABC$; the third is 180° minus their sum.", lambda: 90 + 38),
            Wrong(r"$142°$", 142, r"You worked out $180° - 38°$ and forgot that $\angle ACB = 90°$.", lambda: 180 - 38),
        ],
        solve=lambda: (must(angle_at(C2["A"], C2["C"], C2["B"]), 38, "angle CAB"), deg(angle_at(C2["B"], C2["A"], C2["C"])))[1],
        diagram=fig_c2,
        working=r"""The angle in a semicircle is a right angle, so $\angle ACB = 90°$.

In triangle $ABC$: $x = 180° - 90° - 38° = 52°$.""",
    ),
    Q(
        id="maths-circles-03",
        topic="Circles",
        ref=TOPICS["Circles"],
        stem=r"$PQRS$ is a cyclic quadrilateral with $\angle QPS = 2x°$ and $\angle QRS = (x + 30)°$. Find the value of $x$.",
        answer=(r"$50$", 50),
        wrong=[
            Wrong(r"$30$", 30, r"Opposite angles of a cyclic quadrilateral add up to 180°. They are not equal.", lambda: sp.solve(sp.Eq(2 * sp.Symbol("x"), sp.Symbol("x") + 30))[0]),
            Wrong(r"$60$", 60, r"You left out the 30: $2x + x = 180$.", lambda: R(180, 3)),
            Wrong(r"$70$", 70, r"Sign slip: $3x + 30 = 180$ gives $3x = 150$, not $3x = 210$.", lambda: R(180 + 30, 3)),
        ],
        solve=lambda: (
            must(angle_at(C3["P"], C3["Q"], C3["S"]), 100, "angle QPS"),
            must(angle_at(C3["R"], C3["Q"], C3["S"]), 80, "angle QRS"),
            sp.solve(sp.Eq(2 * sp.Symbol("x") + sp.Symbol("x") + 30, 180))[0],
        )[2],
        diagram=fig_c3,
        working=r"""Opposite angles of a cyclic quadrilateral are supplementary (add up to 180°):

$2x + (x + 30) = 180$, so $3x = 150$ and $x = 50$.

Check: $\angle QPS = 100°$ and $\angle QRS = 80°$, which add up to 180°. ✓""",
    ),
    Q(
        id="maths-circles-04",
        topic="Circles",
        ref=TOPICS["Circles"],
        stem=r"In the diagram, $PT$ is a tangent to the circle with centre $O$, touching it at $T$. The radius is 5 cm and $|OP| = 13$ cm. Find $|PT|$.",
        answer=(r"12 cm", 12),
        wrong=[
            Wrong(r"13.9 cm", Rounded(math.sqrt(13**2 + 5**2), dp=1), r"You added the squares. The radius meets the tangent at 90°, so $OP$ is the hypotenuse: subtract, $13^{2} - 5^{2}$.", lambda: math.sqrt(13**2 + 5**2)),
            Wrong(r"18 cm", 18, r"$13 + 5$: lengths on different sides of a triangle don't add like that. Use Pythagoras in triangle $OTP$.", lambda: 13 + 5),
            Wrong(r"144 cm", 144, r"That is $|PT|^{2}$. Take the square root.", lambda: 13**2 - 5**2),
        ],
        solve=lambda: (
            must(dist(O, C4["T"]), 5, "OT"),
            must(dist(O, C4["P"]), 13, "OP"),
            must(angle_at(C4["T"], O, C4["P"]), 90, "angle OTP"),
            deg(dist(C4["P"], C4["T"])),
        )[3],
        diagram=fig_c4,
        working=r"""A tangent is perpendicular to the radius at the point of contact, so $\angle OTP = 90°$.

By Pythagoras: $|PT|^{2} = 13^{2} - 5^{2} = 169 - 25 = 144$, so $|PT| = 12$ cm.""",
    ),
    Q(
        id="maths-circles-05",
        topic="Circles",
        ref=TOPICS["Circles"],
        stem=r"In the diagram, $TA$ is a tangent to the circle at $A$ and $\angle TAB = 64°$. Find the angle marked $x$.",
        answer=(r"$64°$", 64),
        wrong=[
            Wrong(r"$26°$", 26, r"$90° - 64°$: the tangent is perpendicular to the radius, not to the chord $AB$.", lambda: 90 - 64),
            Wrong(r"$32°$", 32, r"You halved 64°. Halving is for the angle at the centre. Here the alternate segment theorem gives $x$ directly.", lambda: R(64, 2)),
            Wrong(r"$116°$", 116, r"$180° - 64°$: the angle between a tangent and a chord is equal to the angle in the alternate segment, not supplementary to it.", lambda: 180 - 64),
        ],
        solve=lambda: (must(angle_at(C5["A"], C5["T"], C5["B"]), 64, "angle TAB"), deg(angle_at(C5["C"], C5["A"], C5["B"])))[1],
        diagram=fig_c5,
        working=r"""By the alternate segment theorem, the angle between a tangent and a chord equals the angle in the alternate segment:

$x = \angle TAB = 64°$.""",
    ),
    # ── Angles and intersecting lines ──────────────────────────────────────
    Q(
        id="maths-angles-01",
        topic="Angles and Intersecting Lines",
        ref=TOPICS["Angles and Intersecting Lines"],
        stem=r"In the diagram, $PQ$ is parallel to $RS$. Find the angle marked $x$.",
        answer=(r"$112°$", 112),
        wrong=[
            Wrong(r"$22°$", 22, r"$90° - 68°$: these angles are not complementary.", lambda: 90 - 68),
            Wrong(r"$68°$", 68, r"$x$ and 68° are co-interior angles (between the parallel lines, on the same side of the transversal). They add up to 180°; they are not equal."),
            Wrong(r"$292°$", 292, r"$360° - 68°$: angles at a point are not involved here.", lambda: 360 - 68),
        ],
        solve=lambda: (must(angle_at(A1["M"], A1["P"], A1["N"]), 68, "angle PMN"), deg(angle_at(A1["N"], A1["R"], A1["M"])))[1],
        diagram=fig_a1,
        working=r"""The 68° angle and $x$ lie between the parallel lines on the same side of the transversal, so they are co-interior (allied) angles:

$x + 68° = 180°$, so $x = 112°$.""",
    ),
    Q(
        id="maths-angles-02",
        topic="Angles and Intersecting Lines",
        ref=TOPICS["Angles and Intersecting Lines"],
        stem=r"Two straight lines cross at a point. One of the angles formed is $(3x - 20)°$ and the angle vertically opposite it is $(x + 40)°$. Find the value of $x$.",
        answer=(r"$30$", 30),
        wrong=[
            Wrong(r"$10$", 10, r"You changed $-20$ to $+20$: $3x + 20 = x + 40$. Copy the expression carefully.", lambda: sp.solve(sp.Eq(3 * sp.Symbol("x") + 20, sp.Symbol("x") + 40))[0]),
            Wrong(r"$40$", 40, r"Vertically opposite angles are equal. They don't add up to 180°.", lambda: sp.solve(sp.Eq(3 * sp.Symbol("x") - 20 + sp.Symbol("x") + 40, 180))[0]),
            Wrong(r"$70$", 70, r"70° is the size of each angle. The question asks for $x$.", lambda: 3 * 30 - 20),
        ],
        solve=lambda: (
            must(angle_at(O, A2["e10"], A2["e80"]), 70, "first angle"),
            must(angle_at(O, A2["e190"], A2["e260"]), 70, "opposite angle"),
            sp.solve(sp.Eq(3 * sp.Symbol("x") - 20, sp.Symbol("x") + 40))[0],
        )[2],
        diagram=fig_a2,
        working=r"""Vertically opposite angles are equal:

$3x - 20 = x + 40$, so $2x = 60$ and $x = 30$.

Check: both angles are $70°$. ✓""",
    ),
    Q(
        id="maths-angles-03",
        topic="Angles and Intersecting Lines",
        ref=TOPICS["Angles and Intersecting Lines"],
        stem=r"In triangle $PQR$, the side $QR$ is extended to $S$. If $\angle PQR = 48°$ and $\angle QPR = 65°$, find the angle marked $x$.",
        answer=(r"$113°$", 113),
        wrong=[
            Wrong(r"$17°$", 17, r"$65° - 48°$: the exterior angle is the sum of the two interior opposite angles, not the difference.", lambda: 65 - 48),
            Wrong(r"$67°$", 67, r"That is $\angle PRQ$, the interior angle at $R$. The exterior angle is next to it on the straight line.", lambda: 180 - 48 - 65),
            Wrong(r"$132°$", 132, r"$180° - 48°$: you used only one of the interior angles.", lambda: 180 - 48),
        ],
        solve=lambda: (
            must(angle_at(A3["Q"], A3["R"], A3["P"]), 48, "angle PQR"),
            must(angle_at(A3["P"], A3["Q"], A3["R"]), 65, "angle QPR"),
            deg(angle_at(A3["R"], A3["P"], A3["S"])),
        )[2],
        diagram=fig_a3,
        working=r"""The exterior angle of a triangle equals the sum of the two interior opposite angles:

$x = 48° + 65° = 113°$.""",
    ),
    Q(
        id="maths-angles-04",
        topic="Angles and Intersecting Lines",
        ref=TOPICS["Angles and Intersecting Lines"],
        stem=r"In triangle $ABC$, $|AB| = |AC|$ and $\angle BAC = 40°$. Find the angle marked $x$.",
        answer=(r"$70°$", 70),
        wrong=[
            Wrong(r"$20°$", 20, r"You halved 40°. Halve what is left after taking 40° from 180°.", lambda: R(40, 2)),
            Wrong(r"$40°$", 40, r"40° is the angle at $A$. The equal angles are at $B$ and $C$, opposite the equal sides."),
            Wrong(r"$50°$", 50, r"You took 40° away twice: $(180° - 80°) \div 2$.", lambda: R(180 - 80, 2)),
        ],
        solve=lambda: (must(angle_at(A4["A"], A4["B"], A4["C"]), 40, "angle BAC"), deg(angle_at(A4["B"], A4["A"], A4["C"])))[1],
        diagram=fig_a4,
        working=r"""$|AB| = |AC|$, so the base angles at $B$ and $C$ are equal.

$x = \dfrac{180° - 40°}{2} = \dfrac{140°}{2} = 70°$.""",
    ),
    Q(
        id="maths-angles-05",
        topic="Angles and Intersecting Lines",
        ref=TOPICS["Angles and Intersecting Lines"],
        stem=r"In the diagram, $AB$ is parallel to $CD$. Find the value of $y$.",
        answer=(r"$50$", 50),
        wrong=[
            Wrong(r"$30$", 30, r"These are corresponding angles, so they are equal, not supplementary.", lambda: R(180 - 110 - 10, 2)),
            Wrong(r"$55$", 55, r"You left out the 10: $2y = 110$.", lambda: R(110, 2)),
            Wrong(r"$60$", 60, r"Sign slip: $2y + 10 = 110$ gives $2y = 100$, not $2y = 120$.", lambda: R(110 + 10, 2)),
        ],
        solve=lambda: (
            must(angle_at(A5["M"], A5["B"], A5["U"]), 110, "angle at M"),
            must(angle_at(A5["N"], A5["D"], A5["M"]), 110, "angle at N"),
            sp.solve(sp.Eq(2 * sp.Symbol("y") + 10, 110))[0],
        )[2],
        diagram=fig_a5,
        working=r"""The two marked angles are corresponding angles on parallel lines, so they are equal:

$2y + 10 = 110$, so $2y = 100$ and $y = 50$.""",
    ),
    # ── Sine, cosine and tangent ───────────────────────────────────────────
    Q(
        id="maths-trig-01",
        topic="Sine, Cosine and Tangent",
        ref=TOPICS["Sine, Cosine and Tangent"],
        stem=r"In triangle $PQR$, $\angle PQR = 90°$, $|PQ| = 8$ cm and $|QR| = 15$ cm. Find $\sin R$.",
        answer=(r"$\frac{8}{17}$", R(8, 17)),
        wrong=[
            Wrong(r"$\frac{8}{15}$", R(8, 15), r"That is $\tan R$ (opposite ÷ adjacent). Sine is opposite ÷ hypotenuse.", lambda: R(8, 15)),
            Wrong(r"$\frac{15}{17}$", R(15, 17), r"That is $\cos R$. For $\sin R$ use the side opposite $R$, which is $PQ$.", lambda: R(15, 17)),
            Wrong(r"$\frac{15}{8}$", R(15, 8), r"You divided the adjacent side by the opposite side."),
        ],
        solve=lambda: (must(angle_at(T1["Q"], T1["P"], T1["R"]), 90, "angle Q"), sp.Integer(8) / sp.sqrt(8**2 + 15**2))[1],
        diagram=fig_t1,
        working=r"""$|PR| = \sqrt{8^{2} + 15^{2}} = \sqrt{289} = 17$ cm.

$\sin R = \dfrac{\text{opposite}}{\text{hypotenuse}} = \dfrac{|PQ|}{|PR|} = \dfrac{8}{17}$""",
    ),
    Q(
        id="maths-trig-02",
        topic="Sine, Cosine and Tangent",
        ref=TOPICS["Sine, Cosine and Tangent"],
        stem=r"Without using tables or a calculator, evaluate $\sin 60° \cos 30° + \cos 60° \sin 30°$.",
        answer=(r"$1$", 1),
        wrong=[
            Wrong(r"$\frac{1}{2}$", R(1, 2), r"You subtracted the second product: $\frac{3}{4} - \frac{1}{4}$.", lambda: R(3, 4) - R(1, 4)),
            Wrong(r"$\frac{3}{4}$", R(3, 4), r"You left out the second product, $\cos 60° \sin 30° = \frac{1}{4}$.", lambda: (sp.sqrt(3) / 2) ** 2),
            Wrong(r"$\frac{\sqrt{3}}{2}$", sp.sqrt(3) / 2, r"That is only $\sin 60°$."),
        ],
        solve=lambda: sp.sin(sp.pi / 3) * sp.cos(sp.pi / 6) + sp.cos(sp.pi / 3) * sp.sin(sp.pi / 6),
        working=r"""$\sin 60° = \cos 30° = \dfrac{\sqrt{3}}{2}$ and $\cos 60° = \sin 30° = \dfrac{1}{2}$.

$\dfrac{\sqrt{3}}{2} \times \dfrac{\sqrt{3}}{2} + \dfrac{1}{2} \times \dfrac{1}{2} = \dfrac{3}{4} + \dfrac{1}{4} = 1$""",
    ),
    Q(
        id="maths-trig-03",
        topic="Sine, Cosine and Tangent",
        ref=TOPICS["Sine, Cosine and Tangent"],
        stem=r"Find the values of $\theta$ between 0° and 360° for which $\cos\theta = -\frac{1}{2}$.",
        answer=(r"$120°$ and $240°$", frozenset({120, 240})),
        wrong=[
            Wrong(r"$60°$ and $300°$", frozenset({60, 300}), r"Those solve $\cos\theta = +\frac{1}{2}$. Cosine is negative in the second and third quadrants.", lambda: frozenset(d for d in range(361) if abs(cos(d) - 0.5) < 1e-9)),
            Wrong(r"$150°$ and $210°$", frozenset({150, 210}), r"Those solve $\cos\theta = -\frac{\sqrt{3}}{2}$. The acute angle whose cosine is $\frac{1}{2}$ is 60°, not 30°.", lambda: frozenset(d for d in range(361) if abs(cos(d) + math.sqrt(3) / 2) < 1e-9)),
            Wrong(r"$210°$ and $330°$", frozenset({210, 330}), r"Those solve $\sin\theta = -\frac{1}{2}$.", lambda: frozenset(d for d in range(361) if abs(sin(d) + 0.5) < 1e-9)),
        ],
        solve=lambda: frozenset(d for d in range(361) if abs(cos(d) + 0.5) < 1e-9),
        working=r"""The acute angle with $\cos = \frac{1}{2}$ is 60°. Cosine is negative in the second and third quadrants:

$\theta = 180° - 60° = 120°$ or $\theta = 180° + 60° = 240°$.""",
    ),
    Q(
        id="maths-trig-04",
        topic="Sine, Cosine and Tangent",
        ref=TOPICS["Sine, Cosine and Tangent"],
        stem=r"In triangle $ABC$, $a = 8$ cm, $\angle A = 30°$ and $\angle B = 45°$. Find $b$, correct to one decimal place.",
        answer=(r"11.3 cm", Rounded(8 * sin(45) / sin(30), dp=1)),
        wrong=[
            Wrong(r"5.7 cm", Rounded(8 * sin(30) / sin(45), dp=1), r"You turned the ratio upside down: $b = \dfrac{a \sin B}{\sin A}$.", lambda: 8 * sin(30) / sin(45)),
            Wrong(r"6.5 cm", Rounded(8 * cos(45) / cos(30), dp=1), r"The sine rule uses sines, not cosines.", lambda: 8 * cos(45) / cos(30)),
            Wrong(r"15.5 cm", Rounded(8 * sin(105) / sin(30), dp=1), r"You used angle $C$ ($180° - 30° - 45° = 105°$) instead of angle $B$.", lambda: 8 * sin(105) / sin(30)),
        ],
        solve=lambda: sp.N(8 * sp.sin(sp.pi / 4) / sp.sin(sp.pi / 6)),
        working=r"""Sine rule: $\dfrac{b}{\sin B} = \dfrac{a}{\sin A}$, so

$b = \dfrac{8 \sin 45°}{\sin 30°} = \dfrac{8 \times 0.7071}{0.5} = 11.31 \approx 11.3$ cm""",
    ),
    Q(
        id="maths-trig-05",
        topic="Sine, Cosine and Tangent",
        ref=TOPICS["Sine, Cosine and Tangent"],
        stem=r"In triangle $XYZ$, $x = 5$ cm, $y = 7$ cm and $\angle Z = 60°$. Find $z$, correct to one decimal place.",
        answer=(r"6.2 cm", Rounded(math.sqrt(39), dp=1)),
        wrong=[
            Wrong(r"8.6 cm", Rounded(math.sqrt(74), dp=1), r"You left out the $-2xy\cos Z$ term.", lambda: math.sqrt(25 + 49)),
            Wrong(r"10.4 cm", Rounded(math.sqrt(109), dp=1), r"Sign slip: the cosine rule is $z^{2} = x^{2} + y^{2} - 2xy\cos Z$.", lambda: math.sqrt(25 + 49 + 35)),
            Wrong(r"39 cm", 39, r"That is $z^{2}$. Take the square root.", lambda: 25 + 49 - 35),
        ],
        solve=lambda: math.sqrt(5**2 + 7**2 - 2 * 5 * 7 * cos(60)),
        working=r"""Cosine rule: $z^{2} = x^{2} + y^{2} - 2xy\cos Z$

$z^{2} = 25 + 49 - 2(5)(7)(0.5) = 74 - 35 = 39$

$z = \sqrt{39} = 6.24 \approx 6.2$ cm""",
    ),
    # ── Angles of elevation and depression ─────────────────────────────────
    Q(
        id="maths-elevation-01",
        topic="Angles of Elevation and Depression",
        ref=TOPICS["Angles of Elevation and Depression"],
        stem=r"From a point $P$ on level ground, 30 m from the foot of a vertical tower, the angle of elevation of the top of the tower is 40°. Find the height of the tower, correct to the nearest metre.",
        answer=(r"25 m", Rounded(30 * tan(40), dp=0)),
        wrong=[
            Wrong(r"19 m", Rounded(30 * sin(40), dp=0), r"You used sin. The height is opposite the 40° angle and the 30 m is adjacent, so use tan.", lambda: 30 * sin(40)),
            Wrong(r"23 m", Rounded(30 * cos(40), dp=0), r"You used cos. Opposite and adjacent sides go with tan.", lambda: 30 * cos(40)),
            Wrong(r"36 m", Rounded(30 / tan(40), dp=0), r"You divided by $\tan 40°$. From $\tan 40° = \frac{h}{30}$, multiply: $h = 30 \tan 40°$.", lambda: 30 / tan(40)),
        ],
        solve=lambda: (must(angle_at(E1["P"], E1["F"], E1["T"]), 40, "angle of elevation"), dist(E1["F"], E1["T"]))[1],
        diagram=fig_e1,
        working=r"""$\tan 40° = \dfrac{h}{30}$, so $h = 30 \tan 40° = 30 \times 0.8391 = 25.17 \approx 25$ m.""",
    ),
    Q(
        id="maths-elevation-02",
        topic="Angles of Elevation and Depression",
        ref=TOPICS["Angles of Elevation and Depression"],
        stem=r"From the top of a cliff 80 m high, the angle of depression of a boat at sea is 25°. How far is the boat from the foot of the cliff? Give your answer to the nearest metre.",
        answer=(r"172 m", Rounded(80 / tan(25), dp=0)),
        wrong=[
            Wrong(r"34 m", Rounded(80 * sin(25), dp=0), r"You used sin. The 80 m is opposite the angle at the boat and the distance is adjacent, so use tan.", lambda: 80 * sin(25)),
            Wrong(r"37 m", Rounded(80 * tan(25), dp=0), r"You multiplied by $\tan 25°$. From $\tan 25° = \frac{80}{d}$, $d = \frac{80}{\tan 25°}$.", lambda: 80 * tan(25)),
            Wrong(r"88 m", Rounded(80 / cos(25), dp=0), r"You used cos. Opposite and adjacent sides go with tan.", lambda: 80 / cos(25)),
        ],
        solve=lambda: (must(angle_at(E2["T"], E2["H"], E2["B"]), 25, "angle of depression"), dist(E2["F"], E2["B"]))[1],
        diagram=fig_e2,
        working=r"""The angle of depression from the top equals the angle of elevation from the boat (alternate angles), so the angle at the boat is 25°.

$\tan 25° = \dfrac{80}{d}$, so $d = \dfrac{80}{\tan 25°} = \dfrac{80}{0.4663} = 171.6 \approx 172$ m.""",
    ),
    Q(
        id="maths-elevation-03",
        topic="Angles of Elevation and Depression",
        ref=TOPICS["Angles of Elevation and Depression"],
        stem=r"A kite is flying on a straight string 50 m long. The kite is 35 m above the hand holding the string. Find the angle of elevation of the kite from the hand, correct to the nearest degree.",
        answer=(r"44°", Rounded(math.degrees(math.asin(0.7)), dp=0)),
        wrong=[
            Wrong(r"35°", Rounded(math.degrees(math.atan(0.7)), dp=0), r"You used tan. The string, 50 m, is the hypotenuse, so use sin.", lambda: math.degrees(math.atan(35 / 50))),
            Wrong(r"46°", Rounded(math.degrees(math.acos(0.7)), dp=0), r"You used cos. The height is opposite the angle, so use sin.", lambda: math.degrees(math.acos(35 / 50))),
            Wrong(r"55°", Rounded(math.degrees(math.atan(50 / 35)), dp=0), r"You worked out $\tan^{-1}\frac{50}{35}$. The height is opposite the angle and the string is the hypotenuse.", lambda: math.degrees(math.atan(50 / 35))),
        ],
        solve=lambda: math.degrees(math.asin(35 / 50)),
        working=r"""The string is the hypotenuse and the height is opposite the angle:

$\sin\theta = \dfrac{35}{50} = 0.7$, so $\theta = \sin^{-1} 0.7 = 44.4° \approx 44°$.""",
    ),
    Q(
        id="maths-elevation-04",
        topic="Angles of Elevation and Depression",
        ref=TOPICS["Angles of Elevation and Depression"],
        stem=r"A man whose eyes are 1.8 m above the ground stands 20 m from the foot of a tree on level ground. The angle of elevation of the top of the tree from his eyes is 30°. Find the height of the tree, correct to one decimal place.",
        answer=(r"13.3 m", Rounded(20 * tan(30) + 1.8, dp=1)),
        wrong=[
            Wrong(r"11.5 m", Rounded(20 * tan(30), dp=1), r"You forgot to add the height of his eyes above the ground, 1.8 m.", lambda: 20 * tan(30)),
            Wrong(r"11.8 m", Rounded(20 * sin(30) + 1.8, dp=1), r"You used sin. The 20 m is adjacent to the angle, so use tan.", lambda: 20 * sin(30) + 1.8),
            Wrong(r"13.4 m", R(134, 10), r"You rounded too early: $11.547$ became $11.55$, giving $13.35$ and then $13.4$. Keep the full value until the last step.", lambda: half_up(half_up(20 * tan(30), "0.01") + Decimal("1.8"), "0.1")),
        ],
        solve=lambda: 20 * tan(30) + 1.8,
        working=r"""Height above his eyes $= 20 \tan 30° = 20 \times 0.57735 = 11.547$ m.

Height of the tree $= 11.547 + 1.8 = 13.347 \approx 13.3$ m.

Don't round 11.547 before adding: examiners often penalise early rounding.""",
    ),
    Q(
        id="maths-elevation-05",
        topic="Angles of Elevation and Depression",
        ref=TOPICS["Angles of Elevation and Depression"],
        stem=r"From the top $P$ of a building, the angle of depression of a car $Q$ on the level ground is 32°. What is the angle of elevation of $P$ from $Q$?",
        answer=(r"32°", 32),
        wrong=[
            Wrong(r"58°", 58, r"$90° - 32°$ is the angle with the vertical. Angles of elevation and depression are measured from the horizontal.", lambda: 90 - 32),
            Wrong(r"90°", 90, r"The building is vertical, but the angle of elevation is measured from the horizontal ground at $Q$ up to the line $QP$."),
            Wrong(r"148°", 148, r"$180° - 32°$: the two angles are alternate angles, so they are equal.", lambda: 180 - 32),
        ],
        solve=lambda: 32,
        working=r"""The horizontal line through $P$ is parallel to the level ground. The angle of depression at $P$ and the angle of elevation at $Q$ are alternate angles between these parallel lines, so they are equal: 32°.""",
    ),
    # ── Bearings ───────────────────────────────────────────────────────────
    Q(
        id="maths-bearings-01",
        topic="Bearings",
        ref=TOPICS["Bearings"],
        stem=r"The bearing of $P$ from $Q$ is 065°. What is the bearing of $Q$ from $P$?",
        answer=(r"245°", 245),
        wrong=[
            Wrong(r"065°", 65, r"That is the same bearing. Going from $P$ back to $Q$ is the opposite direction, so add 180°."),
            Wrong(r"115°", 115, r"$180° - 65°$. For a back bearing add 180° (or subtract 180° if the bearing is more than 180°).", lambda: 180 - 65),
            Wrong(r"155°", 155, r"You added 90°. The opposite direction is 180° away.", lambda: 65 + 90),
        ],
        solve=lambda: (65 + 180) % 360,
        working=r"""The back bearing is the original bearing $\pm 180°$:

$065° + 180° = 245°$""",
    ),
    Q(
        id="maths-bearings-02",
        topic="Bearings",
        ref=TOPICS["Bearings"],
        stem=r"Express the compass bearing S 40° W as a three-figure bearing.",
        answer=(r"220°", 220),
        wrong=[
            Wrong(r"040°", 40, r"That is N 40° E."),
            Wrong(r"140°", 140, r"That is S 40° E. West of south is on the other side.", lambda: 180 - 40),
            Wrong(r"320°", 320, r"That is N 40° W.", lambda: 360 - 40),
        ],
        solve=lambda: 180 + 40,
        working=r"""S 40° W means: face south (180°), then turn 40° towards west.

Turning from south towards west increases the bearing: $180° + 40° = 220°$.""",
    ),
    Q(
        id="maths-bearings-03",
        topic="Bearings",
        ref=TOPICS["Bearings"],
        stem=r"Amadu walks 5 km due east and then 12 km due north. How far is he from his starting point?",
        answer=(r"13 km", 13),
        wrong=[
            Wrong(r"7 km", 7, r"$12 - 5$: east and north are at right angles, so use Pythagoras.", lambda: 12 - 5),
            Wrong(r"10.9 km", Rounded(math.sqrt(144 - 25), dp=1), r"You subtracted the squares. The distance is the hypotenuse, so add them.", lambda: math.sqrt(144 - 25)),
            Wrong(r"17 km", 17, r"$5 + 12$ is how far he walked, not how far he is from the start.", lambda: 5 + 12),
        ],
        solve=lambda: sp.sqrt(5**2 + 12**2),
        working=r"""East and north are at right angles, so by Pythagoras:

distance $= \sqrt{5^{2} + 12^{2}} = \sqrt{169} = 13$ km.""",
    ),
    Q(
        id="maths-bearings-04",
        topic="Bearings",
        ref=TOPICS["Bearings"],
        stem=r"A ship sails 8 km due north from port $P$ to $Q$, then 6 km due east to $R$. Find the bearing of $R$ from $P$, correct to the nearest degree.",
        answer=(r"037°", Rounded(math.degrees(math.atan(6 / 8)), dp=0)),
        wrong=[
            Wrong(r"053°", Rounded(math.degrees(math.atan(8 / 6)), dp=0), r"You worked out $\tan^{-1}\frac{8}{6}$, the angle measured from east. A bearing is measured from north: $\tan\theta = \frac{6}{8}$.", lambda: math.degrees(math.atan(8 / 6))),
            Wrong(r"143°", Rounded(180 - math.degrees(math.atan(6 / 8)), dp=0), r"$180° - 37°$ would point south-east. $R$ is north-east of $P$.", lambda: 180 - math.degrees(math.atan(6 / 8))),
            Wrong(r"323°", Rounded(360 - math.degrees(math.atan(6 / 8)), dp=0), r"$360° - 37°$ would point north-west. $R$ is east of north, so the bearing is less than 090°.", lambda: 360 - math.degrees(math.atan(6 / 8))),
        ],
        solve=lambda: bearing(B4["P"], B4["R"]),
        diagram=fig_b4,
        working=r"""At $P$, measure clockwise from north. In the right-angled triangle $PQR$:

$\tan\theta = \dfrac{6}{8} = 0.75$, so $\theta = 36.9°$.

The bearing of $R$ from $P$ is $037°$.""",
    ),
    Q(
        id="maths-bearings-05",
        topic="Bearings",
        ref=TOPICS["Bearings"],
        stem=r"Village $A$ is 10 km from a town $T$ on a bearing of 030°. Village $B$ is 10 km from $T$ on a bearing of 120°. Find $|AB|$, correct to one decimal place.",
        answer=(r"14.1 km", Rounded(math.sqrt(200), dp=1)),
        wrong=[
            Wrong(r"5.2 km", Rounded(math.sqrt(200 - 200 * cos(30)), dp=1), r"You used 30° as the angle at $T$. The angle between the two directions is $120° - 30° = 90°$.", lambda: math.sqrt(200 - 200 * cos(30))),
            Wrong(r"17.3 km", Rounded(math.sqrt(200 - 200 * cos(120)), dp=1), r"You used 120° as the angle at $T$. Bearings are measured from north, so $\angle ATB = 120° - 30° = 90°$.", lambda: math.sqrt(200 - 200 * cos(120))),
            Wrong(r"20.0 km", Rounded(20, dp=1), r"$10 + 10$: $A$, $T$ and $B$ are not in a straight line.", lambda: 10 + 10),
        ],
        solve=lambda: (must(angle_at(B5["T"], B5["A"], B5["B"]), 90, "angle ATB"), dist(B5["A"], B5["B"]))[1],
        diagram=fig_b5,
        working=r"""$\angle ATB = 120° - 30° = 90°$.

By Pythagoras: $|AB| = \sqrt{10^{2} + 10^{2}} = \sqrt{200} = 14.14 \approx 14.1$ km.""",
    ),
    # ── Volumes ────────────────────────────────────────────────────────────
    Q(
        id="maths-volumes-01",
        topic="Volumes",
        ref=TOPICS["Volumes"],
        stem=r"Find the volume of a cone with base radius 6 cm and height 14 cm. [Take $\pi = \frac{22}{7}$]",
        answer=(r"528 cm³", 528),
        wrong=[
            Wrong(r"88 cm³", 88, r"You used $r$ instead of $r^{2}$.", lambda: R(1, 3) * R(22, 7) * 6 * 14),
            Wrong(r"1584 cm³", 1584, r"You forgot the $\frac{1}{3}$. That is the volume of a cylinder.", lambda: R(22, 7) * 36 * 14),
            Wrong(r"2112 cm³", 2112, r"You used the diameter, 12 cm, as the radius.", lambda: R(1, 3) * R(22, 7) * 144 * 14),
        ],
        solve=lambda: R(1, 3) * R(22, 7) * 6**2 * 14,
        working=r"""$V = \frac{1}{3}\pi r^{2}h = \frac{1}{3} \times \frac{22}{7} \times 36 \times 14 = 528$ cm³""",
    ),
    Q(
        id="maths-volumes-02",
        topic="Volumes",
        ref=TOPICS["Volumes"],
        stem=r"A solid metal cylinder of radius 3 cm and height 8 cm is melted down and recast into a solid sphere. Find the radius of the sphere, correct to two decimal places.",
        answer=(r"3.78 cm", Rounded(54 ** (1 / 3), dp=2)),
        wrong=[
            Wrong(r"4.58 cm", Rounded(96 ** (1 / 3), dp=2), r"You multiplied by $\frac{4}{3}$ instead of dividing: from $\frac{4}{3}\pi r^{3} = 72\pi$, $r^{3} = 72 \times \frac{3}{4}$.", lambda: (72 * 4 / 3) ** (1 / 3)),
            Wrong(r"6.00 cm", Rounded(6, dp=2), r"You used $\frac{1}{3}\pi r^{3}$, which is a cone. A sphere is $\frac{4}{3}\pi r^{3}$.", lambda: (72 * 3) ** (1 / 3)),
            Wrong(r"7.35 cm", Rounded(math.sqrt(54), dp=2), r"You took the square root of 54. $r^{3} = 54$ needs the cube root.", lambda: math.sqrt(54)),
        ],
        solve=lambda: (9 * 8 * 3 / 4) ** (1 / 3),
        working=r"""Volume of the cylinder $= \pi r^{2}h = \pi \times 9 \times 8 = 72\pi$ cm³.

For the sphere: $\frac{4}{3}\pi r^{3} = 72\pi$, so $r^{3} = 72 \times \frac{3}{4} = 54$.

$r = \sqrt[3]{54} = 3.78$ cm""",
    ),
    Q(
        id="maths-volumes-03",
        topic="Volumes",
        ref=TOPICS["Volumes"],
        stem=r"A rectangular water tank is 1.2 m long, 80 cm wide and 50 cm deep. How many litres of water does it hold when full?",
        answer=(r"480 litres", 480),
        wrong=[
            Wrong(r"0.48 litres", R(48, 100), r"0.48 is the volume in cubic metres. 1 m³ holds 1000 litres.", lambda: R(12, 10) * R(8, 10) * R(5, 10)),
            Wrong(r"48 litres", 48, r"You divided by 10 000. Since 1000 cm³ = 1 litre, divide by 1000.", lambda: R(120 * 80 * 50, 10000)),
            Wrong(r"4800 litres", 4800, r"You divided by 100. Since 1000 cm³ = 1 litre, divide by 1000.", lambda: R(120 * 80 * 50, 100)),
        ],
        solve=lambda: R(120 * 80 * 50, 1000),
        working=r"""Use one unit (cm): $120 \times 80 \times 50 = 480\,000$ cm³.

$1000$ cm³ $= 1$ litre, so the tank holds $480\,000 \div 1000 = 480$ litres.""",
    ),
    Q(
        id="maths-volumes-04",
        topic="Volumes",
        ref=TOPICS["Volumes"],
        stem=r"Two similar cylinders have heights 4 cm and 6 cm. The volume of the smaller cylinder is 64 cm³. Find the volume of the larger cylinder.",
        answer=(r"216 cm³", 216),
        wrong=[
            Wrong(r"19.0 cm³", Rounded(64 * (4 / 6) ** 3, dp=1), r"You used the ratio the wrong way round. The larger cylinder must have the larger volume.", lambda: 64 * (4 / 6) ** 3),
            Wrong(r"96 cm³", 96, r"You used the ratio of lengths, $\frac{6}{4}$. Volumes scale by the cube of that ratio.", lambda: 64 * R(6, 4)),
            Wrong(r"144 cm³", 144, r"You squared the ratio. That is how areas scale; volumes scale by the cube.", lambda: 64 * R(6, 4) ** 2),
        ],
        solve=lambda: 64 * R(6, 4) ** 3,
        working=r"""Ratio of lengths $= \dfrac{6}{4} = \dfrac{3}{2}$, so the ratio of volumes $= \left(\dfrac{3}{2}\right)^{3} = \dfrac{27}{8}$.

Volume of the larger cylinder $= 64 \times \dfrac{27}{8} = 216$ cm³.""",
    ),
    Q(
        id="maths-volumes-05",
        topic="Volumes",
        ref=TOPICS["Volumes"],
        stem=r"A cylinder of radius 7 cm contains water to a depth of 10 cm. When a stone is placed in the water, the level rises by 1.5 cm. Find the volume of the stone. [Take $\pi = \frac{22}{7}$]",
        answer=(r"231 cm³", 231),
        wrong=[
            Wrong(r"33 cm³", 33, r"You used $r$ instead of $r^{2}$.", lambda: R(22, 7) * 7 * R(3, 2)),
            Wrong(r"1540 cm³", 1540, r"That is the volume of the water before the stone went in. The stone's volume is the rise only.", lambda: R(22, 7) * 49 * 10),
            Wrong(r"1771 cm³", 1771, r"That is the volume of the water and the stone together.", lambda: R(22, 7) * 49 * R(23, 2)),
        ],
        solve=lambda: R(22, 7) * 7**2 * R(3, 2),
        working=r"""The stone pushes up a cylinder of water of radius 7 cm and height 1.5 cm:

$V = \pi r^{2}h = \frac{22}{7} \times 49 \times 1.5 = 231$ cm³""",
    ),
    # ── Measures of central tendency ───────────────────────────────────────
    Q(
        id="maths-averages-01",
        topic="Measures of Central Tendency",
        ref=TOPICS["Measures of Central Tendency"],
        stem="The table shows the scores of 25 pupils in a quiz.\n\n"
        + table([("Score", [1, 2, 3, 4, 5]), ("Number of pupils", [3, 5, 8, 6, 3])])
        + "\n\nFind the mean score.",
        answer=(r"$3.04$", R(76, 25)),
        wrong=[
            Wrong(r"$5$", 5, r"That is the mean of the frequencies ($25 \div 5$). The mean score is $\frac{\sum fx}{\sum f}$.", lambda: R(25, 5)),
            Wrong(r"$15.2$", R(76, 5), r"You divided $\sum fx = 76$ by 5, the number of different scores. Divide by the number of pupils, 25.", lambda: R(76, 5)),
            Wrong(r"$76$", 76, r"76 is $\sum fx$, the total of all the scores. Divide it by the number of pupils.", lambda: 3 + 10 + 24 + 24 + 15),
        ],
        solve=lambda: R(sum(s * f for s, f in zip([1, 2, 3, 4, 5], [3, 5, 8, 6, 3])), 25),
        working=r"""$\sum fx = 1(3) + 2(5) + 3(8) + 4(6) + 5(3) = 3 + 10 + 24 + 24 + 15 = 76$

Mean $= \dfrac{\sum fx}{\sum f} = \dfrac{76}{25} = 3.04$""",
    ),
    Q(
        id="maths-averages-02",
        topic="Measures of Central Tendency",
        ref=TOPICS["Measures of Central Tendency"],
        stem=r"Find the median of 7, 3, 9, 4, 12, 8, 5 and 10.",
        answer=(r"$7.5$", R(15, 2)),
        wrong=[
            Wrong(r"$7$", 7, r"With 8 numbers there are two middle values, 7 and 8. The median is their mean."),
            Wrong(r"$7.25$", R(29, 4), r"That is the mean, $58 \div 8$.", lambda: R(7 + 3 + 9 + 4 + 12 + 8 + 5 + 10, 8)),
            Wrong(r"$8$", 8, r"You didn't put the numbers in order first. In the list as given, the middle values are 4 and 12.", lambda: R(4 + 12, 2)),
        ],
        solve=lambda: (lambda v: R(v[3] + v[4], 2))(sorted([7, 3, 9, 4, 12, 8, 5, 10])),
        working=r"""In order: 3, 4, 5, 7, 8, 9, 10, 12.

There are 8 numbers, so the median is the mean of the 4th and 5th: $\dfrac{7 + 8}{2} = 7.5$.""",
    ),
    Q(
        id="maths-averages-03",
        topic="Measures of Central Tendency",
        ref=TOPICS["Measures of Central Tendency"],
        stem="The table shows the shoe sizes of 36 pupils.\n\n"
        + table([("Shoe size", [5, 6, 7, 8, 9]), ("Number of pupils", [3, 12, 9, 8, 4])])
        + "\n\nWhat is the modal shoe size?",
        answer=(r"$6$", 6),
        wrong=[
            Wrong(r"$6.9$", Rounded(250 / 36, dp=1), r"That is the mean shoe size. The mode is the most common size.", lambda: sum(s * f for s, f in zip(range(5, 10), [3, 12, 9, 8, 4])) / 36),
            Wrong(r"$7$", 7, r"That is the median (the 18th and 19th sizes in order are both 7). The mode is the most common size."),
            Wrong(r"$12$", 12, r"12 is how many pupils wear size 6. The mode is the shoe size, not the frequency."),
        ],
        solve=lambda: max(zip([3, 12, 9, 8, 4], range(5, 10)))[1],
        working=r"""The mode is the value with the highest frequency.

Size 6 has the highest frequency (12 pupils), so the modal shoe size is 6.""",
    ),
    Q(
        id="maths-averages-04",
        topic="Measures of Central Tendency",
        ref=TOPICS["Measures of Central Tendency"],
        stem="The table shows the marks of 20 pupils in a test.\n\n"
        + table([("Marks", [r"\text{1–5}", r"\text{6–10}", r"\text{11–15}"]), ("Frequency", [4, 10, 6])])
        + "\n\nEstimate the mean mark.",
        answer=(r"$8.5$", R(17, 2)),
        wrong=[
            Wrong(r"$6.5$", R(13, 2), r"You used the lower class limits (1, 6, 11). Use the class mid-points: 3, 8, 13.", lambda: R(4 * 1 + 10 * 6 + 6 * 11, 20)),
            Wrong(r"$10.5$", R(21, 2), r"You used the upper class limits (5, 10, 15). Use the class mid-points: 3, 8, 13.", lambda: R(4 * 5 + 10 * 10 + 6 * 15, 20)),
            Wrong(r"$56.7$", Rounded(170 / 3, dp=1), r"You divided $\sum fx = 170$ by 3, the number of classes. Divide by the number of pupils, 20.", lambda: 170 / 3),
        ],
        solve=lambda: R(4 * 3 + 10 * 8 + 6 * 13, 20),
        working=r"""Use the class mid-points (class marks): 3, 8 and 13.

$\sum fx = 4(3) + 10(8) + 6(13) = 12 + 80 + 78 = 170$ and $\sum f = 20$.

Mean $= \dfrac{170}{20} = 8.5$""",
    ),
    Q(
        id="maths-averages-05",
        topic="Measures of Central Tendency",
        ref=TOPICS["Measures of Central Tendency"],
        stem=r"The mean of 5, 9, $x$, 11 and 6 is 8. Find the value of $x$.",
        answer=(r"$9$", 9),
        wrong=[
            Wrong(r"$1$", 1, r"There are 5 numbers, so the total is $8 \times 5 = 40$, not $8 \times 4$.", lambda: 8 * 4 - 31),
            Wrong(r"$8$", 8, r"8 is the mean of all five numbers, not the missing number."),
            Wrong(r"$71$", 71, r"You added the known numbers to the total instead of subtracting them: $40 + 31$.", lambda: 40 + 31),
        ],
        solve=lambda: 8 * 5 - (5 + 9 + 11 + 6),
        working=r"""Total of the five numbers $= 8 \times 5 = 40$.

Known numbers: $5 + 9 + 11 + 6 = 31$.

So $x = 40 - 31 = 9$.""",
    ),
    # ── Logarithms ─────────────────────────────────────────────────────────
    Q(
        id="maths-logs-01",
        topic="Logarithms",
        ref=TOPICS["Logarithms"],
        stem=r"Simplify $\log_{10} 8 + \log_{10} 125$.",
        answer=(r"$3$", 3),
        wrong=[
            Wrong(r"$1.194$", Rounded(math.log10(125 / 8), dp=3), r"You subtracted the logs. $\log a + \log b = \log(ab)$.", lambda: math.log10(125) - math.log10(8)),
            Wrong(r"$1.894$", Rounded(math.log10(8) * math.log10(125), dp=3), r"You multiplied the logs. Adding logs means multiplying the numbers: $\log 8 + \log 125 = \log(8 \times 125)$.", lambda: math.log10(8) * math.log10(125)),
            Wrong(r"$2.124$", Rounded(math.log10(133), dp=3), r"You added the numbers inside the log: $\log(8 + 125)$. Adding logs means multiplying the numbers.", lambda: math.log10(8 + 125)),
        ],
        solve=lambda: sp.log(8 * 125, 10),
        working=r"""$\log_{10} 8 + \log_{10} 125 = \log_{10}(8 \times 125) = \log_{10} 1000 = 3$""",
    ),
    Q(
        id="maths-logs-02",
        topic="Logarithms",
        ref=TOPICS["Logarithms"],
        stem=r"Solve $\log_{3}(2x - 1) = 2$.",
        answer=(r"$5$", 5),
        wrong=[
            Wrong(r"$1.5$", R(3, 2), r"You dropped the log and solved $2x - 1 = 2$. $\log_{3}(2x - 1) = 2$ means $2x - 1 = 3^{2}$.", lambda: R(2 + 1, 2)),
            Wrong(r"$3.5$", R(7, 2), r"You worked out $3 \times 2 = 6$. $\log_{3}(2x - 1) = 2$ means $2x - 1 = 3^{2} = 9$.", lambda: R(6 + 1, 2)),
            Wrong(r"$4.5$", R(9, 2), r"You used $2^{3} = 8$. The base is 3, so it is $3^{2} = 9$.", lambda: R(8 + 1, 2)),
        ],
        solve=lambda: sp.solve(sp.Eq(2 * sp.Symbol("x") - 1, 3**2))[0],
        working=r"""$\log_{3}(2x - 1) = 2$ means $2x - 1 = 3^{2} = 9$.

So $2x = 10$ and $x = 5$.""",
    ),
    Q(
        id="maths-logs-03",
        topic="Logarithms",
        ref=TOPICS["Logarithms"],
        stem=r"Given that $\log_{10} 2 = 0.3010$ and $\log_{10} 3 = 0.4771$, find $\log_{10} 18$ without using tables or a calculator.",
        answer=(r"$1.2552$", R(3010, 10000) + 2 * R(4771, 10000)),
        wrong=[
            Wrong(r"$0.7781$", R(7781, 10000), r"That is $\log 6 = \log 2 + \log 3$. $18 = 2 \times 3^{2}$, so $\log 3$ is needed twice.", lambda: R(3010, 10000) + R(4771, 10000)),
            Wrong(r"$1.0791$", R(10791, 10000), r"That is $\log 12$: you doubled $\log 2$ instead of $\log 3$.", lambda: 2 * R(3010, 10000) + R(4771, 10000)),
            Wrong(r"$1.5562$", R(15562, 10000), r"You doubled both logs. $18 = 2 \times 3^{2}$, so only $\log 3$ is doubled.", lambda: 2 * (R(3010, 10000) + R(4771, 10000))),
        ],
        solve=lambda: R(3010, 10000) + 2 * R(4771, 10000),
        working=r"""$18 = 2 \times 3^{2}$, so

$\log 18 = \log 2 + 2\log 3 = 0.3010 + 2(0.4771) = 0.3010 + 0.9542 = 1.2552$""",
    ),
    Q(
        id="maths-logs-04",
        topic="Logarithms",
        ref=TOPICS["Logarithms"],
        stem=r"Express $\log 4 + 2\log 3 - \log 6$ as the logarithm of a single number.",
        answer=(r"$\log 6$", 6),
        wrong=[
            Wrong(r"$\log 4$", 4, r"$2\log 3 = \log 3^{2} = \log 9$, not $\log 6$.", lambda: R(4 * 6, 6)),
            Wrong(r"$\log 7$", 7, r"You added and subtracted the numbers: $4 + 9 - 6$. Adding logs means multiplying, subtracting means dividing.", lambda: 4 + 9 - 6),
            Wrong(r"$\log 216$", 216, r"You multiplied all three. Subtracting a log means dividing: $\frac{4 \times 9}{6}$.", lambda: 4 * 9 * 6),
        ],
        solve=lambda: R(4 * 3**2, 6),
        working=r"""$2\log 3 = \log 3^{2} = \log 9$.

$\log 4 + \log 9 - \log 6 = \log\dfrac{4 \times 9}{6} = \log 6$""",
    ),
    Q(
        id="maths-logs-05",
        topic="Logarithms",
        ref=TOPICS["Logarithms"],
        stem=r"Solve $2^{x} = 10$, giving your answer correct to two decimal places.",
        answer=(r"$3.32$", Rounded(1 / math.log10(2), dp=2)),
        wrong=[
            Wrong(r"$0.30$", Rounded(math.log10(2), dp=2), r"You divided the wrong way round. $x = \dfrac{\log 10}{\log 2}$.", lambda: math.log10(2) / math.log10(10)),
            Wrong(r"$0.70$", Rounded(math.log10(5), dp=2), r"You worked out $\log\frac{10}{2}$. $\frac{\log 10}{\log 2}$ is not $\log\frac{10}{2}$.", lambda: math.log10(10 / 2)),
            Wrong(r"$5$", 5, r"$2^{x} = 10$ does not mean $2x = 10$.", lambda: R(10, 2)),
        ],
        solve=lambda: math.log(10) / math.log(2),
        working=r"""Take logs of both sides: $x\log 2 = \log 10 = 1$.

$x = \dfrac{1}{\log 2} = \dfrac{1}{0.3010} = 3.32$ (2 d.p.)""",
    ),
    # ── Modular arithmetic ─────────────────────────────────────────────────
    Q(
        id="maths-modular-01",
        topic="Modular Arithmetic",
        ref=TOPICS["Modular Arithmetic"],
        stem=r"Evaluate $7 \times 6 \pmod{5}$.",
        answer=(r"$2$", 2),
        wrong=[
            Wrong(r"$3$", 3, r"You added: $7 + 6 = 13 \equiv 3$. The question asks for $7 \times 6$.", lambda: (7 + 6) % 5),
            Wrong(r"$8$", 8, r"8 is the quotient: $42 = 8 \times 5 + 2$. The answer is the remainder.", lambda: 42 // 5),
            Wrong(r"$42$", 42, r"Reduce 42 modulo 5: the answer must be a whole number from 0 to 4.", lambda: 7 * 6),
        ],
        solve=lambda: (7 * 6) % 5,
        working=r"""$7 \times 6 = 42 = 8 \times 5 + 2$, so $7 \times 6 \equiv 2 \pmod{5}$.""",
    ),
    Q(
        id="maths-modular-02",
        topic="Modular Arithmetic",
        ref=TOPICS["Modular Arithmetic"],
        stem=r"Solve $3x \equiv 2 \pmod{7}$.",
        answer=(r"$3$", 3),
        wrong=[
            Wrong(r"$\frac{2}{3}$", R(2, 3), r"In modulo 7 the answer must be a whole number from 0 to 6. Try each one until $3x$ leaves remainder 2."),
            Wrong(r"$5$", 5, r"You added 3 to 2. Find $x$ so that $3x$ leaves remainder 2 when divided by 7.", lambda: 2 + 3),
            Wrong(r"$6$", 6, r"You multiplied 2 by 3 instead of solving for $x$.", lambda: 2 * 3),
        ],
        solve=lambda: next(k for k in range(7) if 3 * k % 7 == 2),
        working=r"""Try $x = 0, 1, 2, \ldots, 6$:

$3 \times 3 = 9 = 7 + 2$, so $3 \times 3 \equiv 2 \pmod{7}$ and $x = 3$.""",
    ),
    Q(
        id="maths-modular-03",
        topic="Modular Arithmetic",
        ref=TOPICS["Modular Arithmetic"],
        stem=r"In a village, a market is held every 5 days. A market is held on a Monday. On what day of the week is the 4th market after that one held?",
        answer=(r"Sunday", "Sunday"),
        wrong=[
            Wrong(r"Tuesday", "Tuesday", r"You counted only 15 days. The 4th market after Monday is $4 \times 5 = 20$ days later.", lambda: DAYS[15 % 7]),
            Wrong(r"Friday", "Friday", r"You counted 5 markets (25 days). The 4th market after Monday is 20 days later.", lambda: DAYS[25 % 7]),
            Wrong(r"Saturday", "Saturday", r"You counted Monday itself as day 1, giving 19 days. Count 20 days on from Monday.", lambda: DAYS[19 % 7]),
        ],
        solve=lambda: DAYS[(4 * 5) % 7],
        order=["Tuesday", "Friday", "Saturday", "Sunday"],
        working=r"""The 4th market after Monday is $4 \times 5 = 20$ days later.

$20 = 2 \times 7 + 6$, so it falls 6 days after Monday in the week: Sunday.""",
    ),
    Q(
        id="maths-modular-04",
        topic="Modular Arithmetic",
        ref=TOPICS["Modular Arithmetic"],
        stem=r"Evaluate $4 - 9 \pmod{6}$.",
        answer=(r"$1$", 1),
        wrong=[
            Wrong(r"$-5$", -5, r"In modulo 6 the answer must be from 0 to 5. Add 6: $-5 + 6 = 1$.", lambda: 4 - 9),
            Wrong(r"$5$", 5, r"You worked out $9 - 4$. Order matters: $4 - 9 = -5 \equiv 1$.", lambda: 9 - 4),
            Wrong(r"$7$", 7, r"You added 12 to $-5$ but did not reduce 7 modulo 6.", lambda: -5 + 12),
        ],
        solve=lambda: (4 - 9) % 6,
        working=r"""$4 - 9 = -5$. Add 6 to get a number from 0 to 5: $-5 + 6 = 1$.

So $4 - 9 \equiv 1 \pmod{6}$.""",
    ),
    Q(
        id="maths-modular-05",
        topic="Modular Arithmetic",
        ref=TOPICS["Modular Arithmetic"],
        stem=r"Solve $2x + 3 \equiv 1 \pmod{5}$.",
        answer=(r"$4$", 4),
        wrong=[
            Wrong(r"$-1$", -1, r"In modulo 5 the answer must be from 0 to 4. Add 5: $-1 + 5 = 4$.", lambda: R(1 - 3, 2)),
            Wrong(r"$1.5$", R(3, 2), r"You solved $2x = 3$ as an ordinary equation. In modulo 5, try $x = 0, \ldots, 4$ until $2x$ leaves remainder 3.", lambda: R(3, 2)),
            Wrong(r"$2$", 2, r"Sign slip: $2x \equiv 1 - 3$, not $1 + 3$.", lambda: R(1 + 3, 2)),
        ],
        solve=lambda: next(k for k in range(5) if (2 * k + 3) % 5 == 1),
        working=r"""$2x \equiv 1 - 3 = -2 \equiv 3 \pmod{5}$.

Try $x = 0, \ldots, 4$: $2 \times 4 = 8 \equiv 3$. So $x = 4$.

Check: $2(4) + 3 = 11 \equiv 1 \pmod{5}$. ✓""",
    ),
    # ── Vectors ────────────────────────────────────────────────────────────
    Q(
        id="maths-vectors-01",
        topic="Vectors",
        ref=TOPICS["Vectors"],
        stem=r"Given that $\mathbf{a} = \begin{pmatrix} 3 \\ -2 \end{pmatrix}$ and $\mathbf{b} = \begin{pmatrix} -1 \\ 4 \end{pmatrix}$, find $2\mathbf{a} - \mathbf{b}$.",
        answer=(col(7, -8), (7, -8)),
        wrong=[
            Wrong(col(5, 0), (5, 0), r"You added $\mathbf{b}$ instead of subtracting it.", lambda: (2 * 3 + (-1), 2 * -2 + 4)),
            Wrong(col(5, -8), (5, -8), r"Sign slip in the top number: $6 - (-1) = 6 + 1 = 7$.", lambda: (6 - 1, -4 - 4)),
            Wrong(col(4, -6), (4, -6), r"You forgot to double $\mathbf{a}$. That is $\mathbf{a} - \mathbf{b}$.", lambda: (3 - (-1), -2 - 4)),
        ],
        solve=lambda: (2 * 3 - (-1), 2 * -2 - 4),
        working=r"""$2\mathbf{a} = \begin{pmatrix} 6 \\ -4 \end{pmatrix}$

$2\mathbf{a} - \mathbf{b} = \begin{pmatrix} 6 - (-1) \\ -4 - 4 \end{pmatrix} = \begin{pmatrix} 7 \\ -8 \end{pmatrix}$""",
    ),
    Q(
        id="maths-vectors-02",
        topic="Vectors",
        ref=TOPICS["Vectors"],
        stem=r"Find the magnitude of the vector $\begin{pmatrix} -5 \\ 12 \end{pmatrix}$.",
        answer=(r"$13$", 13),
        wrong=[
            Wrong(r"$7$", 7, r"You added the components: $-5 + 12$. The magnitude is $\sqrt{x^{2} + y^{2}}$.", lambda: -5 + 12),
            Wrong(r"$10.9$", Rounded(math.sqrt(144 - 25), dp=1), r"You subtracted the squares. Squares are never negative: $(-5)^{2} = 25$, and you add them.", lambda: math.sqrt(144 - 25)),
            Wrong(r"$17$", 17, r"You added the sizes 5 and 12. Use $\sqrt{x^{2} + y^{2}}$.", lambda: 5 + 12),
        ],
        solve=lambda: sp.sqrt((-5) ** 2 + 12**2),
        working=r"""$\left|\begin{pmatrix} -5 \\ 12 \end{pmatrix}\right| = \sqrt{(-5)^{2} + 12^{2}} = \sqrt{25 + 144} = \sqrt{169} = 13$""",
    ),
    Q(
        id="maths-vectors-03",
        topic="Vectors",
        ref=TOPICS["Vectors"],
        stem=r"$P$ is the point $(2, 3)$ and $Q$ is the point $(-4, 5)$. Find $\overrightarrow{PQ}$.",
        answer=(col(-6, 2), (-6, 2)),
        wrong=[
            Wrong(col(6, -2), (6, -2), r"That is $\overrightarrow{QP}$. $\overrightarrow{PQ} = \mathbf{q} - \mathbf{p}$: end point minus starting point.", lambda: (2 - (-4), 3 - 5)),
            Wrong(col(-2, 8), (-2, 8), r"You added the coordinates. $\overrightarrow{PQ} = \mathbf{q} - \mathbf{p}$.", lambda: (2 + (-4), 3 + 5)),
            Wrong(col(-6, -2), (-6, -2), r"Sign slip in the bottom number: $5 - 3 = 2$.", lambda: (-4 - 2, -(5 - 3))),
        ],
        solve=lambda: (-4 - 2, 5 - 3),
        working=r"""$\overrightarrow{PQ} = \mathbf{q} - \mathbf{p} = \begin{pmatrix} -4 - 2 \\ 5 - 3 \end{pmatrix} = \begin{pmatrix} -6 \\ 2 \end{pmatrix}$""",
    ),
    Q(
        id="maths-vectors-04",
        topic="Vectors",
        ref=TOPICS["Vectors"],
        stem=r"The vectors $\begin{pmatrix} k \\ 6 \end{pmatrix}$ and $\begin{pmatrix} 2 \\ 3 \end{pmatrix}$ are parallel. Find the value of $k$.",
        answer=(r"$4$", 4),
        wrong=[
            Wrong(r"$3$", 3, r"You subtracted: $6 - 3$. Parallel vectors are multiples of each other.", lambda: 6 - 3),
            Wrong(r"$9$", 9, r"You paired the wrong components: $\frac{k}{3} = \frac{6}{2}$. Match top with top and bottom with bottom: $\frac{k}{2} = \frac{6}{3}$.", lambda: R(6, 2) * 3),
            Wrong(r"$12$", 12, r"You multiplied 6 by 2. The multiplier is $\frac{6}{3} = 2$, so $k = 2 \times 2$.", lambda: 6 * 2),
        ],
        solve=lambda: sp.solve(sp.Symbol("k") * 3 - 6 * 2)[0],
        working=r"""Parallel vectors are multiples of each other: $\begin{pmatrix} k \\ 6 \end{pmatrix} = m\begin{pmatrix} 2 \\ 3 \end{pmatrix}$.

From the bottom numbers, $6 = 3m$, so $m = 2$. Then $k = 2 \times 2 = 4$.""",
    ),
    Q(
        id="maths-vectors-05",
        topic="Vectors",
        ref=TOPICS["Vectors"],
        stem=r"Find the direction of the vector $\begin{pmatrix} 5 \\ 12 \end{pmatrix}$ as a bearing, correct to the nearest degree.",
        answer=(r"023°", Rounded(math.degrees(math.atan(5 / 12)), dp=0)),
        wrong=[
            Wrong(r"067°", Rounded(math.degrees(math.atan(12 / 5)), dp=0), r"That is the angle with the $x$-axis (east). A bearing is measured clockwise from north: $\tan\theta = \frac{5}{12}$.", lambda: math.degrees(math.atan(12 / 5))),
            Wrong(r"157°", Rounded(180 - math.degrees(math.atan(5 / 12)), dp=0), r"$180° - 23°$ would point south-east. Both components are positive, so the vector points north-east.", lambda: 180 - math.degrees(math.atan(5 / 12))),
            Wrong(r"337°", Rounded(360 - math.degrees(math.atan(5 / 12)), dp=0), r"$360° - 23°$ would point north-west. The $x$-component is positive, so the vector points east of north.", lambda: 360 - math.degrees(math.atan(5 / 12))),
        ],
        solve=lambda: bearing((0, 0), (5, 12)),
        working=r"""The vector goes 5 units east and 12 units north. Measured clockwise from north:

$\tan\theta = \dfrac{5}{12}$, so $\theta = 22.6°$. The bearing is $023°$.""",
    ),
]
