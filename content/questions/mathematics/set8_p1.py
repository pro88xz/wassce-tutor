"""Mathematics practice set 2 (part 3): 50 more original Paper 1 questions on Areas, Lengths and Perimeters, Polygons, Matrices, Transformations, Cumulative Frequency, Statistics, Dispersion, Ratio and Rates, and Linear Inequalities.

Written by WASSCE Tutor in the style of WASSCE Paper 1 (four options, A-D). Nothing
here is copied from a WAEC paper. Each topic's first five questions are in
set3_p1.py; these test different skills and mistakes. Every answer is worked out by
code, and every wrong option is a mistake a candidate really makes. See SCOPE.md.

Run `python3 scripts/questions/build.py` to check every answer and rebuild.
"""

import math
import sys
from pathlib import Path

import sympy as sp

sys.path.insert(0, str(Path(__file__).resolve().parent))

from maths_common import make  # noqa: E402
from qbank import R, Rounded  # noqa: E402

TOPICS = {
    "Areas": "C(b) Areas: triangles (including ½ab sin C), trapeziums, sectors, compound shapes, similar figures",
    "Lengths and Perimeters": "C(a) Lengths and perimeters: arcs, sectors, circles, compound shapes",
    "Polygons": "D(c)(vii)-(viii) Polygons: sum of interior angles, exterior angles, regular polygons",
    "Matrices and Determinants": "A(k) Matrices: addition, scalar multiplication, multiplication, determinant, inverse (2 × 2)",
    "Transformations": "I Transformations: reflection, rotation, translation, enlargement in the Cartesian plane",
    "Cumulative Frequency": "H(a)(iv) Cumulative frequency: tables, class boundaries, ogive, median",
    "Statistics": "H(a)(i)-(ii) Statistics: pie charts, bar charts, class marks",
    "Measures of Dispersion": "H(a)(v) Dispersion: range, mean deviation, variance, standard deviation",
    "Ratio, Proportion and Rates": "A(l) Ratio, proportion and rates: sharing, speed, exchange rates, density",
    "Linear Inequalities": "B(g) Linear inequalities: solving, ranges, integer solutions, word problems",
}

mq = make(TOPICS)
PI = R(22, 7)


def mat(p, q, r, s) -> str:
    return rf"$\begin{{pmatrix}} {p} & {q} \\ {r} & {s} \end{{pmatrix}}$"


def col(p, q) -> str:
    return rf"$\begin{{pmatrix}} {p} \\ {q} \end{{pmatrix}}$"


def pt(p, q) -> str:
    return f"$({p}, {q})$"


def flat(m: sp.Matrix) -> tuple:
    return tuple(sp.nsimplify(v) for v in m)


def sd(values: list[float]) -> float:
    mean = sum(values) / len(values)
    return math.sqrt(sum((v - mean) ** 2 for v in values) / len(values))


# Heights of 40 seedlings (cm).
CLASSES = ["1–5", "6–10", "11–15", "16–20", "21–25"]
FREQ = [3, 7, 12, 10, 8]
CUM = [sum(FREQ[: i + 1]) for i in range(len(FREQ))]
HEIGHTS_TABLE = (
    "$$\n\\begin{array}{l|ccccc}\n\\text{Height (cm)} & " + " & ".join(f"\\text{{{c}}}" for c in CLASSES)
    + " \\\\ \\hline\n\\text{Frequency} & " + " & ".join(str(f) for f in FREQ) + "\n\\end{array}\n$$"
)
SEEDLINGS = "The table shows the heights of 40 seedlings in a school nursery.\n\n" + HEIGHTS_TABLE + "\n\n"

QUESTIONS = [
    # ── Areas ────────────────────────────────────────────────────────────
    mq("maths-areas-06", "Areas",
       r"A rhombus has diagonals of length 10 cm and 16 cm. Find its area.",
       (r"$80$ cm²", 80),
       [(r"$26$ cm²", 26, r"You added the diagonals. Area of a rhombus $= \frac{1}{2} \times d_{1} \times d_{2}$.", lambda: 10 + 16),
        (r"$40$ cm²", 40, r"You took a quarter of the product. The diagonals split the rhombus into four triangles of area $\frac{1}{2} \times 5 \times 8$ each.", lambda: R(10 * 16, 4)),
        (r"$160$ cm²", 160, r"You forgot the $\frac{1}{2}$.", lambda: 10 * 16)],
       lambda: R(1, 2) * 10 * 16,
       r"""Area of a rhombus $= \dfrac{1}{2} \times d_{1} \times d_{2} = \dfrac{1}{2} \times 10 \times 16 = 80$ cm²"""),
    mq("maths-areas-07", "Areas",
       r"The circumference of a circular mat is 44 cm. Find its area. [Take $\pi = \frac{22}{7}$]",
       (r"$154$ cm²", 154),
       [(r"$77$ cm²", 77, r"You halved the area. $A = \pi r^{2}$ with $r = 7$.", lambda: PI * 7**2 / 2),
        (r"$308$ cm²", 308, r"You used $2\pi r^{2}$. The area of a circle is $\pi r^{2}$.", lambda: 2 * PI * 7**2),
        (r"$49$ cm²", 49, r"You worked out $r^{2} = 49$ and forgot to multiply by $\pi$.", lambda: 7**2)],
       lambda: PI * (R(44, 2 * PI)) ** 2,
       r"""$2\pi r = 44 \Rightarrow r = \dfrac{44 \times 7}{2 \times 22} = 7$ cm.

Area $= \pi r^{2} = \dfrac{22}{7} \times 49 = 154$ cm²"""),
    mq("maths-areas-08", "Areas",
       r"A sector of a circle of radius 10 cm has an arc length of 15 cm. Find the area of the sector.",
       (r"$75$ cm²", 75),
       [(r"$7.5$ cm²", R(15, 2), r"You halved the arc length. Area of a sector $= \frac{1}{2} \times r \times \text{arc length}$.", lambda: R(15, 2)),
        (r"$150$ cm²", 150, r"You forgot the $\frac{1}{2}$: area $= \frac{1}{2}rl$.", lambda: 10 * 15),
        (r"$100\pi$ cm²", 100 * sp.pi, r"$100\pi$ is the area of the whole circle, not the sector.", lambda: sp.pi * 10**2)],
       lambda: R(1, 2) * 10 * 15,
       r"""Area of a sector $= \dfrac{1}{2} \times r \times l = \dfrac{1}{2} \times 10 \times 15 = 75$ cm².

(This comes from $\frac{\theta}{360} \times \pi r^{2}$ with $\frac{\theta}{360} = \frac{l}{2\pi r}$.)"""),
    mq("maths-areas-09", "Areas",
       r"Find the area of an equilateral triangle of side 6 cm, leaving your answer in surd form.",
       (r"$9\sqrt{3}$ cm²", 9 * sp.sqrt(3)),
       [(r"$18$ cm²", 18, r"You used $\frac{1}{2} \times 6 \times 6$. The height is not 6 cm; use $\frac{1}{2}ab\sin 60°$.", lambda: R(1, 2) * 6 * 6),
        (r"$18\sqrt{3}$ cm²", 18 * sp.sqrt(3), r"You forgot the $\frac{1}{2}$ in $\frac{1}{2}ab\sin C$.", lambda: 6 * 6 * sp.sin(sp.pi / 3)),
        (r"$36$ cm²", 36, r"36 cm² is the area of a 6 cm square.", lambda: 6**2)],
       lambda: R(1, 2) * 6 * 6 * sp.sin(sp.pi / 3),
       r"""Area $= \dfrac{1}{2}ab\sin C = \dfrac{1}{2} \times 6 \times 6 \times \sin 60° = 18 \times \dfrac{\sqrt{3}}{2} = 9\sqrt{3}$ cm²"""),
    mq("maths-areas-10", "Areas",
       r"A circular flower bed of radius 3.5 m has a path around it, so that the outer edge of the path is a circle of radius 7 m. Find the area of the path. [Take $\pi = \frac{22}{7}$]",
       (r"$115.5$ m²", R(231, 2)),
       [(r"$462$ m²", 462, r"You used the diameters, 14 m and 7 m, as the radii.", lambda: PI * (14**2 - 7**2)),
        (r"$154$ m²", 154, r"154 m² is the area of the outer circle. Subtract the flower bed.", lambda: PI * 7**2),
        (r"$192.5$ m²", R(385, 2), r"You added the two areas.", lambda: PI * 7**2 + PI * R(7, 2) ** 2)],
       lambda: PI * (7**2 - R(7, 2) ** 2),
       r"""Area of path $= \pi R^{2} - \pi r^{2} = \dfrac{22}{7}(49 - 12.25) = \dfrac{22}{7} \times 36.75 = 115.5$ m²"""),
    # ── Lengths and perimeters ───────────────────────────────────────────
    mq("maths-lengths-06", "Lengths and Perimeters",
       r"An arc of length 22 cm is on a circle of radius 14 cm. Find the angle the arc subtends at the centre. [Take $\pi = \frac{22}{7}$]",
       (r"$90°$", 90),
       [(r"$45°$", 45, r"You used the diameter, 28 cm, as the radius.", lambda: R(22 * 360, 2 * PI * 28)),
        (r"$180°$", 180, r"You used $\pi r$ instead of $2\pi r$ for the circumference.", lambda: R(22 * 360, PI * 14)),
        (r"$270°$", 270, r"270° is the angle of the major arc. The 22 cm arc is a quarter of the circle.", lambda: 360 - 90)],
       lambda: R(22, 2 * PI * 14) * 360,
       r"""Circumference $= 2 \times \frac{22}{7} \times 14 = 88$ cm.

$\dfrac{\theta}{360} \times 88 = 22 \Rightarrow \theta = \dfrac{22 \times 360}{88} = 90°$"""),
    mq("maths-lengths-07", "Lengths and Perimeters",
       r"Find the perimeter of a semicircular plot of land with a diameter of 28 m. [Take $\pi = \frac{22}{7}$]",
       (r"$72$ m", 72),
       [(r"$44$ m", 44, r"44 m is the curved edge only. Add the straight edge (the diameter).", lambda: R(1, 2) * PI * 28),
        (r"$88$ m", 88, r"88 m is the circumference of the whole circle.", lambda: PI * 28),
        (r"$116$ m", 116, r"You added the diameter to the whole circumference. A semicircle has half the circumference.", lambda: PI * 28 + 28)],
       lambda: R(1, 2) * PI * 28 + 28,
       r"""Curved edge $= \frac{1}{2}\pi d = \frac{1}{2} \times \frac{22}{7} \times 28 = 44$ m.

Perimeter $= 44 + 28 = 72$ m"""),
    mq("maths-lengths-08", "Lengths and Perimeters",
       r"A bicycle wheel has a diameter of 70 cm. How many complete turns does it make in travelling 1.1 km? [Take $\pi = \frac{22}{7}$]",
       (r"$500$", 500),
       [(r"$5$", 5, r"You did not convert 1.1 km to centimetres: 1.1 km = 110 000 cm.", lambda: R(1100, PI * 70)),
        (r"$250$", 250, r"You used the diameter as the radius: $2\pi \times 70 = 440$ cm.", lambda: R(110000, 2 * PI * 70)),
        (r"$1000$", 1000, r"You used $\pi r$ for the circumference. One turn covers $\pi d = 220$ cm.", lambda: R(110000, PI * 35))],
       lambda: R(110000, PI * 70),
       r"""One turn $= \pi d = \frac{22}{7} \times 70 = 220$ cm. 1.1 km $= 110\,000$ cm.

Turns $= \dfrac{110\,000}{220} = 500$"""),
    mq("maths-lengths-09", "Lengths and Perimeters",
       r"A rectangle has an area of 48 cm² and a width of 6 cm. Find its perimeter.",
       (r"$28$ cm", 28),
       [(r"$14$ cm", 14, r"14 cm is the length plus the width. The perimeter goes all the way round: $2(l + w)$.", lambda: 8 + 6),
        (r"$54$ cm", 54, r"You added the area and the width.", lambda: 48 + 6),
        (r"$96$ cm", 96, r"You doubled the area.", lambda: 2 * 48)],
       lambda: 2 * (R(48, 6) + 6),
       r"""Length $= 48 \div 6 = 8$ cm.

Perimeter $= 2(8 + 6) = 28$ cm"""),
    mq("maths-lengths-10", "Lengths and Perimeters",
       r"The area of a circle is 616 cm². Find its circumference. [Take $\pi = \frac{22}{7}$]",
       (r"$88$ cm", 88),
       [(r"$44$ cm", 44, r"You used $\pi r$. The circumference is $2\pi r$.", lambda: PI * 14),
        (r"$176$ cm", 176, r"You used the diameter, 28 cm, as the radius.", lambda: 2 * PI * 28),
        (r"$14$ cm", 14, r"14 cm is the radius. The question asks for the circumference, $2\pi r$.", lambda: sp.sqrt(616 / PI))],
       lambda: 2 * PI * sp.sqrt(616 / PI),
       r"""$\pi r^{2} = 616 \Rightarrow r^{2} = 616 \times \frac{7}{22} = 196 \Rightarrow r = 14$ cm.

Circumference $= 2\pi r = 2 \times \frac{22}{7} \times 14 = 88$ cm"""),
    # ── Polygons ─────────────────────────────────────────────────────────
    mq("maths-polygons-06", "Polygons",
       r"Each exterior angle of a regular polygon is 24°. How many sides does it have?",
       (r"$15$", 15),
       [(r"$7.5$", R(15, 2), r"You divided 180° by 24°. The exterior angles add up to 360°.", lambda: R(180, 24)),
        (r"$24$", 24, r"24 is the size of each exterior angle, not the number of sides."),
        (r"$156$", 156, r"156° is the interior angle, $180° - 24°$, not the number of sides.", lambda: 180 - 24)],
       lambda: R(360, 24),
       r"""The exterior angles of any polygon add up to 360°.

Number of sides $= \dfrac{360°}{24°} = 15$"""),
    mq("maths-polygons-07", "Polygons",
       r"Find the sum of the exterior angles of a nonagon (a polygon with 9 sides).",
       (r"$360°$", 360),
       [(r"$40°$", 40, r"40° is each exterior angle of a regular nonagon. The question asks for the sum.", lambda: R(360, 9)),
        (r"$140°$", 140, r"140° is each interior angle of a regular nonagon.", lambda: 180 - R(360, 9)),
        (r"$1260°$", 1260, r"1260° is the sum of the interior angles, $(9 - 2) \times 180°$.", lambda: (9 - 2) * 180)],
       lambda: 360,
       r"""The exterior angles of any convex polygon, whatever the number of sides, add up to 360°."""),
    mq("maths-polygons-08", "Polygons",
       r"Find the size of each interior angle of a regular decagon (10 sides).",
       (r"$144°$", 144),
       [(r"$36°$", 36, r"36° is each exterior angle. The interior angle is $180° - 36°$.", lambda: R(360, 10)),
        (r"$1440°$", 1440, r"1440° is the sum of the interior angles. Divide by 10.", lambda: (10 - 2) * 180),
        (r"$1800°$", 1800, r"You used $n \times 180°$. The angle sum is $(n - 2) \times 180°$.", lambda: 10 * 180)],
       lambda: R((10 - 2) * 180, 10),
       r"""Sum of interior angles $= (10 - 2) \times 180° = 1440°$; each angle $= 1440° \div 10 = 144°$.

(Or: exterior angle $= 360° \div 10 = 36°$; interior $= 180° - 36° = 144°$.)"""),
    mq("maths-polygons-09", "Polygons",
       r"The interior angles of a hexagon are $2x°$, $3x°$, 110°, 120°, 130° and 140°. Find $x$.",
       (r"$44$", 44),
       [(r"$8$", 8, r"You used 540°, the angle sum of a pentagon. A hexagon's angles add up to 720°.", lambda: R(540 - 500, 5)),
        (r"$116$", 116, r"You used 1080°, the angle sum of an octagon.", lambda: R(1080 - 500, 5)),
        (r"$220$", 220, r"$5x = 220$, so you must still divide by 5.", lambda: 720 - 500)],
       lambda: R((6 - 2) * 180 - (110 + 120 + 130 + 140), 5),
       r"""Sum of interior angles of a hexagon $= (6 - 2) \times 180° = 720°$.

$2x + 3x + 110 + 120 + 130 + 140 = 720 \Rightarrow 5x = 220 \Rightarrow x = 44$"""),
    mq("maths-polygons-10", "Polygons",
       r"Each interior angle of a regular polygon is four times each exterior angle. How many sides does the polygon have?",
       (r"$10$", 10),
       [(r"$4$", 4, r"4 is the ratio of the angles, not the number of sides."),
        (r"$36$", 36, r"36° is the exterior angle. Divide 360° by it.", lambda: R(180, 5)),
        (r"$144$", 144, r"144° is the interior angle, not the number of sides.", lambda: 4 * R(180, 5))],
       lambda: R(360, R(180, 5)),
       r"""Interior + exterior $= 180°$: $4e + e = 180° \Rightarrow e = 36°$.

Number of sides $= 360° \div 36° = 10$"""),
    # ── Matrices and determinants ────────────────────────────────────────
    mq("maths-matrices-06", "Matrices and Determinants",
       r"Given that $A = " + mat(5, 2, 1, 3)[1:-1] + r"$ and $B = " + mat(2, 4, 3, 1)[1:-1] + r"$, find $A - 2B$.",
       (mat(1, -6, -5, 1), (1, -6, -5, 1)),
       [(mat(3, -2, -2, 2), (3, -2, -2, 2), r"That is $A - B$. Multiply every entry of $B$ by 2 first.", lambda: flat(sp.Matrix([[5, 2], [1, 3]]) - sp.Matrix([[2, 4], [3, 1]]))),
        (mat(9, 10, 7, 5), (9, 10, 7, 5), r"You added $2B$ instead of subtracting it.", lambda: flat(sp.Matrix([[5, 2], [1, 3]]) + 2 * sp.Matrix([[2, 4], [3, 1]]))),
        (mat(1, 6, 5, 1), (1, 6, 5, 1), r"Watch the signs: $2 - 8 = -6$ and $1 - 6 = -5$.")],
       lambda: flat(sp.Matrix([[5, 2], [1, 3]]) - 2 * sp.Matrix([[2, 4], [3, 1]])),
       r"""$2B = """ + mat(4, 8, 6, 2)[1:-1] + r"""$

$A - 2B = \begin{pmatrix} 5 - 4 & 2 - 8 \\ 1 - 6 & 3 - 2 \end{pmatrix} = """ + mat(1, -6, -5, 1)[1:-1] + "$"),
    mq("maths-matrices-07", "Matrices and Determinants",
       r"Evaluate $" + mat(2, -1, 3, 4)[1:-1] + col(3, 2)[1:-1] + r"$.",
       (col(4, 17), (4, 17)),
       [(col(8, 17), (8, 17), r"In the top row, $2 \times 3 + (-1) \times 2 = 6 - 2 = 4$: the sign of $-1$ was dropped.", lambda: (2 * 3 + 1 * 2, 3 * 3 + 4 * 2)),
        (col(12, 5), (12, 5), r"You multiplied the columns of the matrix by the vector. Use each row: row × column.", lambda: (2 * 3 + 3 * 2, -1 * 3 + 4 * 2)),
        (col(-4, 17), (-4, 17), r"Check the top entry: $6 - 2 = +4$.")],
       lambda: tuple(sp.Matrix([[2, -1], [3, 4]]) * sp.Matrix([3, 2])),
       r"""Row 1: $2 \times 3 + (-1) \times 2 = 4$. Row 2: $3 \times 3 + 4 \times 2 = 17$.

Result: """ + col(4, 17)),
    mq("maths-matrices-08", "Matrices and Determinants",
       r"For what value of $k$ is the matrix $" + mat("k", 4, 3, 6)[1:-1] + r"$ singular?",
       (r"$2$", 2),
       [(r"$-2$", -2, r"The determinant is $6k - 12$, not $6k + 12$.", lambda: R(-12, 6)),
        (r"$4.5$", R(9, 2), r"You multiplied the wrong pairs: the determinant is $k \times 6 - 4 \times 3$.", lambda: R(18, 4)),
        (r"$0$", 0, r"A singular matrix has determinant 0; that does not make $k = 0$. With $k = 0$ the determinant is $-12$.")],
       lambda: sp.solve(6 * sp.Symbol("k") - 4 * 3)[0],
       r"""A matrix is singular when its determinant is 0.

$6k - 4 \times 3 = 0 \Rightarrow 6k = 12 \Rightarrow k = 2$"""),
    mq("maths-matrices-09", "Matrices and Determinants",
       r"Given that $A = " + mat(1, 3, 2, 0)[1:-1] + r"$, $B = " + mat(5, 7, 4, 6)[1:-1] + r"$ and $2X + A = B$, find the matrix $X$.",
       (mat(2, 2, 1, 3), (2, 2, 1, 3)),
       [(mat(4, 4, 2, 6), (4, 4, 2, 6), r"That is $2X$. Divide every entry by 2.", lambda: flat(sp.Matrix([[5, 7], [4, 6]]) - sp.Matrix([[1, 3], [2, 0]]))),
        (mat(3, 5, 3, 3), (3, 5, 3, 3), r"You added $A$ instead of subtracting it: $2X = B - A$.", lambda: flat((sp.Matrix([[5, 7], [4, 6]]) + sp.Matrix([[1, 3], [2, 0]])) / 2)),
        (mat(-2, -2, -1, -3), (-2, -2, -1, -3), r"You worked out $A - B$. Move $A$ to the other side: $2X = B - A$.", lambda: flat((sp.Matrix([[1, 3], [2, 0]]) - sp.Matrix([[5, 7], [4, 6]])) / 2))],
       lambda: flat((sp.Matrix([[5, 7], [4, 6]]) - sp.Matrix([[1, 3], [2, 0]])) / 2),
       r"""$2X = B - A = """ + mat(4, 4, 2, 6)[1:-1] + r"""$, so $X = \dfrac{1}{2}""" + mat(4, 4, 2, 6)[1:-1] + " = " + mat(2, 2, 1, 3)[1:-1] + "$"),
    mq("maths-matrices-10", "Matrices and Determinants",
       r"$A$ is a $2 \times 2$ matrix with determinant 5. Find the determinant of $2A$.",
       (r"$20$", 20),
       [(r"$7$", 7, r"You added 2 to the determinant."),
        (r"$10$", 10, r"Multiplying a $2 \times 2$ matrix by 2 doubles every entry, so the determinant is multiplied by $2 \times 2 = 4$.", lambda: 2 * 5),
        (r"$25$", 25, r"25 is $5^{2}$. The determinant of $2A$ is $2^{2} \times 5$.", lambda: 5**2)],
       lambda: (2 * sp.Matrix([[1, 2], [1, 7]])).det() if sp.Matrix([[1, 2], [1, 7]]).det() == 5 else None,  # any A with det 5
       r"""If $A = \begin{pmatrix} p & q \\ r & s \end{pmatrix}$ then $2A = \begin{pmatrix} 2p & 2q \\ 2r & 2s \end{pmatrix}$, and

$\det(2A) = 2p \times 2s - 2q \times 2r = 4(ps - qr) = 4 \times 5 = 20$"""),
    # ── Transformations ──────────────────────────────────────────────────
    mq("maths-transformations-06", "Transformations",
       r"Find the image of the point $(-4, 3)$ after a reflection in the $y$-axis.",
       (pt(4, 3), (4, 3)),
       [(pt(-4, -3), (-4, -3), r"That is a reflection in the $x$-axis, which changes the sign of $y$.", lambda: (-4, -3)),
        (pt(4, -3), (4, -3), r"That is a half-turn about the origin: both signs change.", lambda: (4, -3)),
        (pt(3, -4), (3, -4), r"That is a reflection in the line $y = x$: the coordinates swap.", lambda: (3, -4))],
       lambda: (4, 3),
       r"""A reflection in the $y$-axis changes the sign of the $x$-coordinate: $(x, y) \to (-x, y)$.

$(-4, 3) \to (4, 3)$"""),
    mq("maths-transformations-07", "Transformations",
       r"The point $(2, -5)$ is rotated through 180° about the origin. Find its image.",
       (pt(-2, 5), (-2, 5)),
       [(pt(5, 2), (5, 2), r"That is a rotation of 90° anticlockwise: $(x, y) \to (-y, x)$.", lambda: (5, 2)),
        (pt(-5, -2), (-5, -2), r"That is a rotation of 90° clockwise: $(x, y) \to (y, -x)$.", lambda: (-5, -2)),
        (pt(2, 5), (2, 5), r"That is a reflection in the $x$-axis.", lambda: (2, 5))],
       lambda: (-2, 5),
       r"""A rotation of 180° about the origin changes both signs: $(x, y) \to (-x, -y)$.

$(2, -5) \to (-2, 5)$"""),
    mq("maths-transformations-08", "Transformations",
       r"Find the image of the point $(3, 1)$ after a reflection in the line $y = -x$.",
       (pt(-1, -3), (-1, -3)),
       [(pt(1, 3), (1, 3), r"That is a reflection in $y = x$. In $y = -x$ the coordinates swap and both change sign.", lambda: (1, 3)),
        (pt(-3, -1), (-3, -1), r"That is a half-turn about the origin: the coordinates do not swap.", lambda: (-3, -1)),
        (pt(3, -1), (3, -1), r"That is a reflection in the $x$-axis.", lambda: (3, -1))],
       lambda: (-1, -3),
       r"""A reflection in $y = -x$ maps $(x, y) \to (-y, -x)$.

$(3, 1) \to (-1, -3)$"""),
    mq("maths-transformations-09", "Transformations",
       r"The point $(3, -1)$ is enlarged with centre the origin and scale factor $-2$. Find its image.",
       (pt(-6, 2), (-6, 2)),
       [(pt(-1.5, 0.5), (R(-3, 2), R(1, 2)), r"You divided by $-2$. An enlargement multiplies the coordinates by the scale factor.", lambda: (R(3, -2), R(-1, -2))),
        (pt(-6, -2), (-6, -2), r"Multiply both coordinates by $-2$: $-1 \times (-2) = +2$.", lambda: (3 * -2, -2)),
        (pt(6, -2), (6, -2), r"You ignored the negative sign. A negative scale factor puts the image on the other side of the centre.", lambda: (3 * 2, -1 * 2))],
       lambda: (3 * -2, -1 * -2),
       r"""With centre the origin, multiply each coordinate by the scale factor:

$(3 \times (-2),\ -1 \times (-2)) = (-6, 2)$"""),
    mq("maths-transformations-10", "Transformations",
       r"A translation maps the point $(1, 4)$ onto $(-2, 6)$. Find the image of the point $(5, -3)$ under the same translation.",
       (pt(2, -1), (2, -1)),
       [(pt(-3, 2), (-3, 2), r"$(-3, 2)$ is the translation vector, not the image."),
        (pt(2, 1), (2, 1), r"Check the second coordinate: $-3 + 2 = -1$.", lambda: (5 - 3, 3 - 2)),
        (pt(8, -5), (8, -5), r"You subtracted the translation vector instead of adding it.", lambda: (5 + 3, -3 - 2))],
       lambda: (5 + (-2 - 1), -3 + (6 - 4)),
       r"""Translation vector $= \begin{pmatrix} -2 - 1 \\ 6 - 4 \end{pmatrix} = \begin{pmatrix} -3 \\ 2 \end{pmatrix}$.

Image of $(5, -3) = (5 - 3,\ -3 + 2) = (2, -1)$"""),
    # ── Cumulative frequency ─────────────────────────────────────────────
    mq("maths-cumfreq-06", "Cumulative Frequency",
       SEEDLINGS + "What is the cumulative frequency of the class 11–15?",
       (r"$22$", CUM[2]),
       [(r"$10$", CUM[1], r"10 is the cumulative frequency up to 6–10. Add the 12 seedlings in 11–15.", lambda: CUM[1]),
        (r"$12$", FREQ[2], r"12 is the frequency of 11–15 alone. Cumulative frequency is the running total.", lambda: FREQ[2]),
        (r"$32$", CUM[3], r"32 is the cumulative frequency up to 16–20, one class too far.", lambda: CUM[3])],
       lambda: CUM[2],
       r"""Running total up to 11–15: $3 + 7 + 12 = 22$"""),
    mq("maths-cumfreq-07", "Cumulative Frequency",
       SEEDLINGS + "What is the upper class boundary of the class 11–15?",
       (r"$15.5$", R(31, 2)),
       [(r"$10.5$", R(21, 2), r"10.5 is the lower class boundary of 11–15."),
        (r"$15$", 15, r"15 is the upper class limit. The boundary is halfway between 15 and 16."),
        (r"$16$", 16, r"16 is the lower limit of the next class.")],
       lambda: R(15 + 16, 2),
       r"""The upper class boundary lies halfway between the upper limit of this class (15) and the lower limit of the next (16): $15.5$.

Cumulative frequency curves are plotted against upper class boundaries."""),
    mq("maths-cumfreq-08", "Cumulative Frequency",
       SEEDLINGS + "In which class does the median height lie?",
       (r"11–15", "11–15"),
       [(r"6–10", "6–10", r"Only 10 seedlings are 10 cm or less, so the 20th is not in this class."),
        (r"16–20", "16–20", r"By 15 cm the running total is already 22, past the 20th seedling."),
        (r"21–25", "21–25", r"21–25 is the last class; the middle of 40 values comes well before it.")],
       lambda: CLASSES[next(i for i, c in enumerate(CUM) if c >= R(40, 2))],
       r"""There are 40 seedlings, so the median is the $\frac{40}{2} = 20$th value.

Cumulative frequencies: 3, 10, 22, 32, 40. The 20th value is past 10 but not past 22, so it is in 11–15.""",
       order=["6–10", "11–15", "16–20", "21–25"]),
    mq("maths-cumfreq-09", "Cumulative Frequency",
       SEEDLINGS + "How many seedlings are taller than 15.5 cm?",
       (r"$18$", 18),
       [(r"$8$", 8, r"You counted only the class 21–25. The class 16–20 is also taller than 15.5 cm."),
        (r"$22$", 22, r"22 seedlings are 15.5 cm or shorter. Subtract from 40.", lambda: CUM[2]),
        (r"$10$", 10, r"You counted only the class 16–20. The class 21–25 is also taller than 15.5 cm.", lambda: FREQ[3])],
       lambda: 40 - CUM[2],
       r"""Taller than 15.5 cm means the classes 16–20 and 21–25: $10 + 8 = 18$. (Or $40 - 22 = 18$.)"""),
    mq("maths-cumfreq-10", "Cumulative Frequency",
       SEEDLINGS + "What percentage of the seedlings are 10 cm tall or less?",
       (r"25%", 25),
       [(r"7.5%", R(15, 2), r"You used only the class 1–5. Seedlings in 6–10 are also 10 cm or less.", lambda: R(3, 40) * 100),
        (r"17.5%", R(35, 2), r"You used only the class 6–10. Add the 3 seedlings in 1–5.", lambda: R(7, 40) * 100),
        (r"55%", 55, r"55% is the percentage that are 15 cm or less.", lambda: R(22, 40) * 100)],
       lambda: R(CUM[1], 40) * 100,
       r"""10 cm or less means 1–5 and 6–10: $3 + 7 = 10$ seedlings.

$\dfrac{10}{40} \times 100\% = 25\%$"""),
    # ── Statistics ───────────────────────────────────────────────────────
    mq("maths-statistics-06", "Statistics",
       r"On a pie chart showing the favourite fruits of 60 pupils, the sector for mango has an angle of 72°. How many pupils chose mango?",
       (r"$12$", 12),
       [(r"$1.2$", R(6, 5), r"You divided 72 by 60. The fraction of the circle is $\frac{72}{360}$.", lambda: R(72, 60)),
        (r"$5$", 5, r"You divided 360 by 72. Mango's share is $\frac{72}{360}$ of 60.", lambda: R(360, 72)),
        (r"$72$", 72, r"72 is the angle in degrees, not the number of pupils.")],
       lambda: R(72, 360) * 60,
       r"""Number $= \dfrac{72}{360} \times 60 = \dfrac{1}{5} \times 60 = 12$"""),
    mq("maths-statistics-07", "Statistics",
       r"A family's monthly budget is Le 4,800, of which Le 1,800 is spent on food. What angle represents food on a pie chart of the budget?",
       (r"$135°$", 135),
       [(r"$13.5°$", R(27, 2), r"Check the decimal point: $\frac{1800}{4800} \times 360 = 135$."),
        (r"$37.5°$", R(75, 2), r"37.5 is the percentage spent on food, not the angle.", lambda: R(1800, 4800) * 100),
        (r"$225°$", 225, r"225° is the angle for everything except food.", lambda: R(4800 - 1800, 4800) * 360)],
       lambda: R(1800, 4800) * 360,
       r"""Angle $= \dfrac{1800}{4800} \times 360° = \dfrac{3}{8} \times 360° = 135°$"""),
    mq("maths-statistics-08", "Statistics",
       r"Which kind of chart is best for showing what fraction of a family's income is spent on each item?",
       (r"A pie chart", "pie chart"),
       [(r"A line graph", "line graph", r"A line graph shows how something changes over time."),
        (r"A histogram", "histogram", r"A histogram shows the frequencies of grouped continuous data."),
        (r"A cumulative frequency curve", "cumulative frequency curve", r"A cumulative frequency curve is used to find medians and quartiles.")],
       lambda: "pie chart",
       r"""A pie chart shows each part as a fraction of the whole: the angle of each sector is proportional to the amount."""),
    mq("maths-statistics-09", "Statistics",
       r"What is the class width of the classes 10–19, 20–29, 30–39?",
       (r"$10$", 10),
       [(r"$9$", 9, r"$19 - 10 = 9$ uses the class limits. The class boundaries are 9.5 and 19.5, so the width is 10.", lambda: 19 - 10),
        (r"$19$", 19, r"19 is the upper limit of the first class."),
        (r"$20$", 20, r"20 is the lower limit of the second class.")],
       lambda: R(39, 2) - R(19, 2),
       r"""Class width = upper boundary − lower boundary $= 19.5 - 9.5 = 10$. (Or the difference between the lower limits of two neighbouring classes, $20 - 10$.)"""),
    mq("maths-statistics-10", "Statistics",
       r"""The table shows the number of children in 20 families.

$$
\begin{array}{l|cccc}
\text{Number of children} & 1 & 2 & 3 & 4 \\ \hline
\text{Number of families} & 4 & 6 & 7 & 3
\end{array}
$$

Find the mean number of children per family.""",
       (r"$2.45$", R(49, 20)),
       [(r"$2.5$", R(5, 2), r"2.5 is the mean of 1, 2, 3 and 4. Each value must be weighted by its frequency.", lambda: R(1 + 2 + 3 + 4, 4)),
        (r"$5$", 5, r"5 is the mean of the frequencies, $20 \div 4$.", lambda: R(20, 4)),
        (r"$12.25$", R(49, 4), r"You divided $\sum fx = 49$ by 4. Divide by the number of families, 20.", lambda: R(49, 4))],
       lambda: R(1 * 4 + 2 * 6 + 3 * 7 + 4 * 3, 20),
       r"""$\sum fx = 1(4) + 2(6) + 3(7) + 4(3) = 4 + 12 + 21 + 12 = 49$

Mean $= \dfrac{\sum fx}{\sum f} = \dfrac{49}{20} = 2.45$"""),
    # ── Measures of dispersion ───────────────────────────────────────────
    mq("maths-dispersion-06", "Measures of Dispersion",
       r"Find the range of 4.5, 2.1, 7.8, 3.3 and 6.0.",
       (r"$5.7$", R(57, 10)),
       [(r"$3.3$", R(33, 10), r"You subtracted the first number, 4.5, instead of the smallest, 2.1.", lambda: R(78 - 45, 10)),
        (r"$4.5$", R(45, 10), r"You subtracted 3.3. The smallest number is 2.1.", lambda: R(78 - 33, 10)),
        (r"$9.9$", R(99, 10), r"You added the largest and smallest. Range = largest − smallest.", lambda: R(78 + 21, 10))],
       lambda: R(78 - 21, 10),
       r"""Range $= \text{largest} - \text{smallest} = 7.8 - 2.1 = 5.7$"""),
    mq("maths-dispersion-07", "Measures of Dispersion",
       r"Find the standard deviation of 4, 8 and 12, correct to two decimal places.",
       (r"$3.27$", Rounded(sd([4, 8, 12]), dp=2)),
       [(r"$8$", 8, r"8 is the range, $12 - 4$. The standard deviation measures spread about the mean.", lambda: 12 - 4),
        (r"$5.66$", Rounded(math.sqrt(32), dp=2), r"You did not divide $\sum (x - \bar{x})^{2} = 32$ by 3 before taking the square root.", lambda: math.sqrt(32)),
        (r"$10.67$", Rounded(32 / 3, dp=2), r"10.67 is the variance. The standard deviation is its square root.", lambda: 32 / 3)],
       lambda: sd([4, 8, 12]),
       r"""Mean $= 8$. Deviations: $-4, 0, 4$; squares: $16, 0, 16$.

Variance $= \dfrac{32}{3} = 10.67$; standard deviation $= \sqrt{10.67} = 3.27$"""),
    mq("maths-dispersion-08", "Measures of Dispersion",
       r"The standard deviation of a set of numbers is 3. Every number in the set is multiplied by 2. What is the new standard deviation?",
       (r"$6$", 6),
       [(r"$3$", 3, r"Adding a number to every value leaves the standard deviation unchanged, but multiplying does not."),
        (r"$5$", 5, r"You added 2. Multiplying every value by 2 doubles the spread.", lambda: 3 + 2),
        (r"$12$", 12, r"The variance is multiplied by $2^{2} = 4$, but the standard deviation only by 2.", lambda: 3 * 4)],
       lambda: 2 * 3,
       r"""Multiplying every value by 2 doubles every distance from the mean, so the standard deviation doubles: $2 \times 3 = 6$. (The variance is multiplied by 4.)"""),
    mq("maths-dispersion-09", "Measures of Dispersion",
       r"From a cumulative frequency curve, the lower quartile of some marks is 24 and the upper quartile is 46. Find the semi-interquartile range.",
       (r"$11$", 11),
       [(r"$22$", 22, r"22 is the interquartile range. The semi-interquartile range is half of it.", lambda: 46 - 24),
        (r"$35$", 35, r"35 is the average of the quartiles, not half their difference.", lambda: R(46 + 24, 2)),
        (r"$70$", 70, r"You added the quartiles.", lambda: 46 + 24)],
       lambda: R(46 - 24, 2),
       r"""Semi-interquartile range $= \dfrac{Q_{3} - Q_{1}}{2} = \dfrac{46 - 24}{2} = 11$"""),
    mq("maths-dispersion-10", "Measures of Dispersion",
       r"Find the mean deviation of 1, 5, 6 and 8.",
       (r"$2$", 2),
       [(r"$0$", 0, r"The signed deviations always add up to 0. Mean deviation uses their sizes (absolute values).", lambda: sum(k - 5 for k in [1, 5, 6, 8])),
        (r"$6.5$", R(13, 2), r"6.5 is the variance (the mean of the squared deviations).", lambda: R(sum((k - 5) ** 2 for k in [1, 5, 6, 8]), 4)),
        (r"$8$", 8, r"8 is the total of the absolute deviations. Divide by 4.", lambda: sum(abs(k - 5) for k in [1, 5, 6, 8]))],
       lambda: R(sum(abs(k - 5) for k in [1, 5, 6, 8]), 4),
       r"""Mean $= \frac{20}{4} = 5$. Absolute deviations: $4, 0, 1, 3$.

Mean deviation $= \dfrac{4 + 0 + 1 + 3}{4} = \dfrac{8}{4} = 2$"""),
    # ── Ratio, proportion and rates ──────────────────────────────────────
    mq("maths-ratio-06", "Ratio, Proportion and Rates",
       r"Increase Le 450 in the ratio $5 : 3$.",
       (r"Le 750", 750),
       [(r"Le 1,200", 1200, r"You multiplied by $\frac{5 + 3}{3}$. To increase in the ratio 5 : 3, multiply by $\frac{5}{3}$.", lambda: 450 * R(8, 3)),
        (r"Le 1,350", 1350, r"You multiplied by 3 only.", lambda: 450 * 3),
        (r"Le 2,250", 2250, r"You multiplied by 5 only. Divide by 3 as well.", lambda: 450 * 5)],
       lambda: 450 * R(5, 3),
       r"""New amount $= 450 \times \dfrac{5}{3} = $ Le 750"""),
    mq("maths-ratio-07", "Ratio, Proportion and Rates",
       r"Express a speed of 72 km/h in metres per second.",
       (r"$20$ m/s", 20),
       [(r"$1.2$ m/s", R(6, 5), r"You divided 72 by 60. There are 3600 seconds in an hour, and 1000 m in a kilometre.", lambda: R(72, 60)),
        (r"$259.2$ m/s", R(1296, 5), r"You multiplied by 3.6. To change km/h to m/s, divide by 3.6.", lambda: 72 * R(18, 5)),
        (r"$0.02$ m/s", R(1, 50), r"You divided by 3600 but did not change kilometres to metres (× 1000).", lambda: R(72, 3600))],
       lambda: R(72 * 1000, 3600),
       r"""$72$ km/h $= \dfrac{72 \times 1000 \text{ m}}{3600 \text{ s}} = 20$ m/s"""),
    mq("maths-ratio-08", "Ratio, Proportion and Rates",
       r"A lorry travels 210 km at an average speed of 60 km/h. How long does the journey take?",
       (r"3 h 30 min", "3 h 30 min"),
       [(r"3 h 50 min", "3 h 50 min", r"3.5 hours is 3 hours and half an hour (30 minutes), not 50 minutes."),
        (r"3 h 5 min", "3 h 5 min", r"0.5 of an hour is 30 minutes, not 5 minutes."),
        (r"0 h 17 min", "0 h 17 min", r"You divided the speed by the distance. Time = distance ÷ speed.")],
       lambda: f"{210 // 60} h {(210 % 60)} min",
       r"""Time $= \dfrac{\text{distance}}{\text{speed}} = \dfrac{210}{60} = 3.5$ hours $= 3$ h $30$ min"""),
    mq("maths-ratio-09", "Ratio, Proportion and Rates",
       r"A car uses 8 litres of fuel to travel 100 km. How much fuel does it use to travel 350 km?",
       (r"$28$ litres", 28),
       [(r"$2.29$ litres", Rounded(8 / 350 * 100, dp=2), r"You divided 8 by 350 and multiplied by 100: the proportion is upside down.", lambda: 8 / 350 * 100),
        (r"$3.5$ litres", R(7, 2), r"You worked out $350 \div 100$ and forgot to multiply by 8 litres.", lambda: R(350, 100)),
        (r"$43.75$ litres", R(175, 4), r"You divided 350 by 8. The fuel used is $\frac{8}{100}$ litres per km.", lambda: R(350, 8))],
       lambda: R(8, 100) * 350,
       r"""Fuel per km $= \dfrac{8}{100} = 0.08$ litres. For 350 km: $0.08 \times 350 = 28$ litres."""),
    mq("maths-ratio-10", "Ratio, Proportion and Rates",
       r"Abu and Bintu share a profit in the ratio $3 : 5$. Bintu receives Le 1,500 more than Abu. Find the total profit.",
       (r"Le 6,000", 6000),
       [(r"Le 2,250", 2250, r"Le 2,250 is Abu's share (3 parts).", lambda: 3 * R(1500, 2)),
        (r"Le 3,750", 3750, r"Le 3,750 is Bintu's share (5 parts).", lambda: 5 * R(1500, 2)),
        (r"Le 4,000", 4000, r"You took Le 1,500 as 3 parts. The difference, $5 - 3 = 2$ parts, is Le 1,500.", lambda: R(1500, 3) * 8)],
       lambda: R(1500, 5 - 3) * (3 + 5),
       r"""The difference is $5 - 3 = 2$ parts $= $ Le 1,500, so 1 part $= $ Le 750.

Total $= 8$ parts $= 8 \times 750 = $ Le 6,000"""),
    # ── Linear inequalities ──────────────────────────────────────────────
    mq("maths-inequalities-06", "Linear Inequalities",
       r"Solve the inequality $2(x - 3) > 4x + 2$.",
       (r"$x < -4$", sp.Interval.open(-sp.oo, -4)),
       [(r"$x > -4$", sp.Interval.open(-4, sp.oo), r"When you divide by $-2$, the inequality sign must be reversed."),
        (r"$x < 4$", sp.Interval.open(-sp.oo, 4), r"Check the signs: $-2x > 8$ gives $x < -4$."),
        (r"$x > 4$", sp.Interval.open(4, sp.oo), r"Both the sign of the answer and the direction of the inequality are wrong.")],
       lambda: sp.solve_univariate_inequality(2 * (sp.Symbol("x", real=True) - 3) > 4 * sp.Symbol("x", real=True) + 2, sp.Symbol("x", real=True), relational=False),
       r"""$2x - 6 > 4x + 2$

$-2x > 8$

Divide by $-2$ and reverse the sign: $x < -4$"""),
    mq("maths-inequalities-07", "Linear Inequalities",
       r"Find the largest whole number $x$ such that $3x + 7 < 25$.",
       (r"$5$", 5),
       [(r"$6$", 6, r"$x < 6$, so 6 itself is not allowed: $3(6) + 7 = 25$, which is not less than 25."),
        (r"$10$", 10, r"You added 7 instead of subtracting it: $3x < 32$.", lambda: (25 + 7) // 3),
        (r"$18$", 18, r"$3x < 18$, so you must still divide by 3.", lambda: 25 - 7)],
       lambda: max(k for k in range(0, 20) if 3 * k + 7 < 25),
       r"""$3x < 18 \Rightarrow x < 6$. The largest whole number less than 6 is 5."""),
    mq("maths-inequalities-08", "Linear Inequalities",
       r"Solve $-3 \leq 1 - 2x < 5$.",
       (r"$-2 < x \leq 2$", sp.Interval(-2, 2, left_open=True)),
       [(r"$-2 \leq x < 2$", sp.Interval(-2, 2, right_open=True), r"Dividing by $-2$ reverses both signs, so the strict and non-strict ends swap places."),
        (r"$-\frac{5}{2} < x \leq \frac{3}{2}$", sp.Interval(R(-5, 2), R(3, 2), left_open=True), r"You forgot to subtract 1 from each part first."),
        (r"$-4 \leq x < 4$", sp.Interval(-4, 4, right_open=True), r"$-4 \leq -2x < 4$ must still be divided by $-2$.")],
       lambda: sp.Intersection(
           sp.solve_univariate_inequality(-3 <= 1 - 2 * sp.Symbol("x", real=True), sp.Symbol("x", real=True), relational=False),
           sp.solve_univariate_inequality(1 - 2 * sp.Symbol("x", real=True) < 5, sp.Symbol("x", real=True), relational=False)),
       r"""Subtract 1: $-4 \leq -2x < 4$

Divide by $-2$ and reverse the signs: $2 \geq x > -2$, that is $-2 < x \leq 2$"""),
    mq("maths-inequalities-09", "Linear Inequalities",
       r"A taxi charges a fixed Le 10 plus Le 4 for each kilometre. Musa has Le 50. What is the greatest whole number of kilometres he can travel?",
       (r"$10$", 10),
       [(r"$9$", 9, r"$10 + 4 \times 10 = 50$, which he can afford exactly, so 10 km is allowed."),
        (r"$12$", 12, r"You ignored the fixed charge: $50 \div 4 = 12.5$.", lambda: 50 // 4),
        (r"$15$", 15, r"You added the fixed charge instead of subtracting it: $60 \div 4$.", lambda: (50 + 10) // 4)],
       lambda: max(k for k in range(0, 30) if 10 + 4 * k <= 50),
       r"""$10 + 4x \leq 50 \Rightarrow 4x \leq 40 \Rightarrow x \leq 10$

The greatest whole number of kilometres is 10."""),
    mq("maths-inequalities-10", "Linear Inequalities",
       r"On a number line, a solid (filled) dot is drawn at $-1$ with an arrow pointing to the right. Which inequality does this show?",
       (r"$x \geq -1$", sp.Interval(-1, sp.oo)),
       [(r"$x > -1$", sp.Interval.open(-1, sp.oo), r"A strict inequality is shown by an open (empty) circle, which leaves out $-1$."),
        (r"$x \leq -1$", sp.Interval(-sp.oo, -1), r"An arrow to the right shows values greater than $-1$."),
        (r"$x < -1$", sp.Interval.open(-sp.oo, -1), r"Both the arrow and the dot are misread.")],
       lambda: sp.Interval(-1, sp.oo),
       r"""A filled dot includes the end value, and an arrow to the right shows larger values: $x \geq -1$."""),
]
