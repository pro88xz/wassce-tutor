"""Mathematics (Core) set 3: 50 original Paper 1 questions, 8 with diagrams or charts.

Written by WASSCE Tutor in the style of WASSCE Paper 1. Nothing here is copied
from a WAEC paper. Topics come from the 2018 and 2019 Sierra Leone papers and
the Ministry's revision handbooks; see SCOPE.md.

Charts and diagrams are drawn from the same data the questions are solved
from, so a chart cannot disagree with its question.

Run `python3 scripts/questions/build.py` to check everything and rebuild.
"""

import math

import sympy as sp

from diagram import ASK, FILLS, Fig, angle_at, arc, axes, dist, on_circle, pie, polyline, rect, sector
from qbank import Q, R, Rounded, Wrong

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

O = (0.0, 0.0)
x = sp.Symbol("x")


def must(measured: float, stated: float, what: str) -> None:
    if abs(measured - stated) > 1e-6:
        raise AssertionError(f"figure shows {what} = {measured:.4f}, question says {stated}")


def mat(a, b, c, d) -> str:
    return rf"$\begin{{pmatrix}} {a} & {b} \\ {c} & {d} \end{{pmatrix}}$"


def col(a, b) -> str:
    return rf"$\begin{{pmatrix}} {a} \\ {b} \end{{pmatrix}}$"


def pt(a, b) -> str:
    return f"$({a}, {b})$"


def flat(m: sp.Matrix) -> tuple:
    return tuple(int(v) for v in m)


def sd(values: list[float]) -> float:
    m = sum(values) / len(values)
    return math.sqrt(sum((v - m) ** 2 for v in values) / len(values))


def solve_ineq(expr) -> sp.Set:
    return sp.solve_univariate_inequality(expr, x, relational=False)


def table(rows: list[tuple[str, list]]) -> str:
    cols = len(rows[0][1])
    lines = [rf"\text{{{name}}} & " + " & ".join(str(v) for v in vals) for name, vals in rows]
    return "$$\n\\begin{array}{l|" + "c" * cols + "}\n" + " \\\\ \\hline\n".join(lines) + "\n\\end{array}\n$$"


# ── Data shared by figures and solutions ──────────────────────────────────
S72 = {"A": on_circle(O, 7, 54), "B": on_circle(O, 7, 126)}
S45 = {"A": on_circle(O, 14, 67.5), "B": on_circle(O, 14, 112.5)}
SHAPE = {"w": 14.0, "h": 10.0}  # rectangle with a semicircle on the top side

MARKS = [r"\text{10–19}", r"\text{20–29}", r"\text{30–39}", r"\text{40–49}", r"\text{50–59}", r"\text{60–69}"]
FREQ = [4, 9, 15, 20, 8, 4]
CUM = [sum(FREQ[: i + 1]) for i in range(len(FREQ))]
OGIVE = [(9.5, 0)] + [(19.5 + 10 * i, c) for i, c in enumerate(CUM)]
MARKS_TABLE = table([("Marks", MARKS), ("Number of candidates", FREQ)])

PIE = [("Food", 144), ("Rent", 90), ("Transport", 54), ("Others", 72)]
ABSENT = [("Mon", 6), ("Tue", 3), ("Wed", 5), ("Thu", 2), ("Fri", 4)]


def interpolate(points, y):
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        if y0 <= y <= y1:
            return x0 + (y - y0) / (y1 - y0) * (x1 - x0)
    raise ValueError("outside the curve")


def fig_sector(g, r, deg, label_r, width, bounds, mark=20):
    def draw():
        f = Fig(*bounds, width=width)
        sector(f, O, r, 90 - deg / 2, 90 + deg / 2, fill=FILLS[0])
        f.angle(O, g["A"], g["B"], f"{deg}°", r=mark)
        f.mid_label(label_r, O, g["B"], side=1)
        f.dot(O)
        f.label("O", O, direction=-90)
        return f.svg(f"Sector of a circle with centre O, radius {label_r} and angle {deg}°.")
    return draw


def fig_shape(dashed_top: bool):
    def draw():
        w, h = SHAPE["w"], SHAPE["h"]
        f = Fig(-2.8, 16.8, -2.6, 18.6, width=280)
        if not dashed_top:
            rect(f, 0, 0, w, h, fill=FILLS[1], stroke="none")
            sector(f, (w / 2, h), w / 2, 0, 180, fill=FILLS[1], stroke="none")
        f.line((0, 0), (w, 0))
        f.line((0, 0), (0, h))
        f.line((w, 0), (w, h))
        f.line((0, h), (w, h), dash=True, width=1.4)
        arc(f, (w / 2, h), w / 2, 0, 180)
        f.mid_label("14 cm", (0, 0), (w, 0), side=-1)
        f.mid_label("10 cm", (w, 0), (w, h), side=-1)
        return f.svg("A rectangle 14 cm by 10 cm with a semicircle on its top side.")
    return draw


def fig_pie():
    f = Fig(-4.3, 4.3, -4.3, 4.3, width=300)
    pie(f, O, 4.0, PIE)
    return f.svg("Pie chart of a family's monthly spending: Food 144°, Rent 90°, Transport 54°, Others 72°.")


def fig_bars():
    f = Fig(-1.3, 5.5, -1.3, 7.6, width=300)
    axes(f, 0, 5.2, 0, 7.2, xticks=[], yticks=list(range(0, 8)), ylabel="Number absent")
    for i, (day, n) in enumerate(ABSENT):
        rect(f, i + 0.25, 0, i + 0.85, n, fill=FILLS[0], width=1.6)
        f.text(day, (i + 0.55, 0), dy=13, size=12)
    return f.svg("Bar chart of pupils absent: Mon 6, Tue 3, Wed 5, Thu 2, Fri 4.")


def fig_ogive():
    f = Fig(-3, 72, -17, 64, width=340)
    axes(f, 9.5, 70, 0, 62, xticks=[p[0] for p in OGIVE], yticks=list(range(0, 61, 10)),
         xlabel="Marks (upper class boundary)", ylabel="Cumulative frequency")
    polyline(f, OGIVE)
    return f.svg("Cumulative frequency curve of the marks of 60 candidates.")


QUESTIONS = [
    # ── Areas ──────────────────────────────────────────────────────────────
    Q(
        id="maths-areas-01",
        topic="Areas",
        ref=TOPICS["Areas"],
        stem=r"The diagram shows a sector of a circle with centre $O$, radius 7 cm and angle 72°. Find its area. [Take $\pi = \frac{22}{7}$]",
        answer=(r"30.8 cm²", R(154, 5)),
        wrong=[
            Wrong(r"4.4 cm²", R(22, 5), r"You used $r$ instead of $r^{2}$.", lambda: R(72, 360) * R(22, 7) * 7),
            Wrong(r"8.8 cm²", R(44, 5), r"That is the arc length, $\frac{72}{360} \times 2\pi r$. Area uses $\pi r^{2}$.", lambda: R(72, 360) * 2 * R(22, 7) * 7),
            Wrong(r"123.2 cm²", R(616, 5), r"You used the diameter, 14 cm, as the radius.", lambda: R(72, 360) * R(22, 7) * 14**2),
        ],
        solve=lambda: (must(angle_at(O, S72["A"], S72["B"]), 72, "sector angle"), R(72, 360) * R(22, 7) * 7**2)[1],
        diagram=fig_sector(S72, 7, 72, "7 cm", 260, (-5.2, 5.2, -1.4, 8.4)),
        working=r"""Area of a sector $= \dfrac{\theta}{360} \times \pi r^{2} = \dfrac{72}{360} \times \dfrac{22}{7} \times 49 = \dfrac{1}{5} \times 154 = 30.8$ cm²""",
    ),
    Q(
        id="maths-areas-02",
        topic="Areas",
        ref=TOPICS["Areas"],
        stem=r"In triangle $PQR$, $|PQ| = 8$ cm, $|QR| = 10$ cm and $\angle PQR = 150°$. Find the area of the triangle.",
        answer=(r"20 cm²", 20),
        wrong=[
            Wrong(r"34.6 cm²", Rounded(40 * abs(math.cos(math.radians(150))), dp=1), r"You used cos. The area formula is $\frac{1}{2}ab\sin C$.", lambda: 0.5 * 8 * 10 * abs(math.cos(math.radians(150)))),
            Wrong(r"40 cm²", 40, r"You forgot the $\frac{1}{2}$.", lambda: 8 * 10 * R(1, 2)),
            Wrong(r"80 cm²", 80, r"You multiplied the two sides. Area $= \frac{1}{2} \times 8 \times 10 \times \sin 150°$.", lambda: 8 * 10),
        ],
        solve=lambda: R(1, 2) * 8 * 10 * sp.sin(sp.pi * 5 / 6),
        working=r"""Area $= \frac{1}{2}ab\sin C = \frac{1}{2} \times 8 \times 10 \times \sin 150°$.

$\sin 150° = \sin 30° = \frac{1}{2}$, so the area $= 40 \times \frac{1}{2} = 20$ cm².""",
    ),
    Q(
        id="maths-areas-03",
        topic="Areas",
        ref=TOPICS["Areas"],
        stem=r"A trapezium has parallel sides of 9 cm and 15 cm. The distance between them is 6 cm. Find its area.",
        answer=(r"72 cm²", 72),
        wrong=[
            Wrong(r"90 cm²", 90, r"You treated it as a rectangle 15 cm by 6 cm. Use the average of the parallel sides.", lambda: 15 * 6),
            Wrong(r"144 cm²", 144, r"You forgot the $\frac{1}{2}$: area $= \frac{1}{2}(a + b)h$.", lambda: (9 + 15) * 6),
            Wrong(r"810 cm²", 810, r"You multiplied all three lengths. Add the parallel sides first.", lambda: 9 * 15 * 6),
        ],
        solve=lambda: R(1, 2) * (9 + 15) * 6,
        working=r"""Area of a trapezium $= \frac{1}{2}(a + b)h = \frac{1}{2}(9 + 15) \times 6 = 12 \times 6 = 72$ cm²""",
    ),
    Q(
        id="maths-areas-04",
        topic="Areas",
        ref=TOPICS["Areas"],
        stem=r"The shape is a rectangle 14 cm by 10 cm with a semicircle on its top side. Find the area of the shape. [Take $\pi = \frac{22}{7}$]",
        answer=(r"217 cm²", 217),
        wrong=[
            Wrong(r"162 cm²", 162, r"You added the length of the curved edge (22 cm) instead of the area of the semicircle.", lambda: 140 + R(1, 2) * 2 * R(22, 7) * 7),
            Wrong(r"294 cm²", 294, r"You added a whole circle. The top is a semicircle: half of $\pi r^{2}$.", lambda: 140 + R(22, 7) * 49),
            Wrong(r"448 cm²", 448, r"You used 14 cm as the radius. The diameter is 14 cm, so the radius is 7 cm.", lambda: 140 + R(1, 2) * R(22, 7) * 196),
        ],
        solve=lambda: (
            must(dist((0, 0), (SHAPE["w"], 0)), 14, "width"),
            must(dist((0, 0), (0, SHAPE["h"])), 10, "height"),
            14 * 10 + R(1, 2) * R(22, 7) * 7**2,
        )[2],
        diagram=fig_shape(dashed_top=False),
        working=r"""Rectangle: $14 \times 10 = 140$ cm².

Semicircle: the diameter is 14 cm, so $r = 7$ cm. Area $= \frac{1}{2}\pi r^{2} = \frac{1}{2} \times \frac{22}{7} \times 49 = 77$ cm².

Total $= 140 + 77 = 217$ cm².""",
    ),
    Q(
        id="maths-areas-05",
        topic="Areas",
        ref=TOPICS["Areas"],
        stem=r"Two similar triangles have corresponding sides of 3 cm and 5 cm. The area of the smaller triangle is 18 cm². Find the area of the larger triangle.",
        answer=(r"50 cm²", 50),
        wrong=[
            Wrong(r"10.8 cm²", R(54, 5), r"You used the ratio the wrong way round, and only once. The larger triangle has the larger area: multiply by $\left(\frac{5}{3}\right)^{2}$.", lambda: 18 * R(3, 5)),
            Wrong(r"30 cm²", 30, r"You multiplied by the ratio of the sides, $\frac{5}{3}$. Areas scale by the square of that ratio.", lambda: 18 * R(5, 3)),
            Wrong(r"83.3 cm²", Rounded(18 * 125 / 27, dp=1), r"You cubed the ratio. That is how volumes scale; areas scale by the square.", lambda: 18 * 125 / 27),
        ],
        solve=lambda: 18 * R(5, 3) ** 2,
        working=r"""Ratio of sides $= \dfrac{5}{3}$, so ratio of areas $= \left(\dfrac{5}{3}\right)^{2} = \dfrac{25}{9}$.

Area of the larger triangle $= 18 \times \dfrac{25}{9} = 50$ cm².""",
    ),
    # ── Lengths and perimeters ─────────────────────────────────────────────
    Q(
        id="maths-lengths-01",
        topic="Lengths and Perimeters",
        ref=TOPICS["Lengths and Perimeters"],
        stem=r"Find the length of an arc of a circle of radius 21 cm which subtends an angle of 120° at the centre. [Take $\pi = \frac{22}{7}$]",
        answer=(r"44 cm", 44),
        wrong=[
            Wrong(r"88 cm", 88, r"You used the diameter, 42 cm, as the radius.", lambda: R(120, 360) * 2 * R(22, 7) * 42),
            Wrong(r"132 cm", 132, r"That is the whole circumference. The arc is $\frac{120}{360}$ of it.", lambda: 2 * R(22, 7) * 21),
            Wrong(r"462 cm", 462, r"That is the area of the sector, $\frac{120}{360}\pi r^{2}$. Arc length uses $2\pi r$.", lambda: R(120, 360) * R(22, 7) * 21**2),
        ],
        solve=lambda: R(120, 360) * 2 * R(22, 7) * 21,
        working=r"""Arc length $= \dfrac{\theta}{360} \times 2\pi r = \dfrac{120}{360} \times 2 \times \dfrac{22}{7} \times 21 = \dfrac{1}{3} \times 132 = 44$ cm""",
    ),
    Q(
        id="maths-lengths-02",
        topic="Lengths and Perimeters",
        ref=TOPICS["Lengths and Perimeters"],
        stem=r"The diagram shows a sector of a circle with centre $O$, radius 14 cm and angle 45°. Find the perimeter of the sector. [Take $\pi = \frac{22}{7}$]",
        answer=(r"39 cm", 39),
        wrong=[
            Wrong(r"11 cm", 11, r"That is only the arc. The perimeter also includes the two radii.", lambda: R(45, 360) * 2 * R(22, 7) * 14),
            Wrong(r"25 cm", 25, r"You added only one radius. A sector has two straight edges.", lambda: 11 + 14),
            Wrong(r"77 cm", 77, r"That is the area of the sector in cm². The perimeter is a length: arc + 2 radii.", lambda: R(45, 360) * R(22, 7) * 14**2),
        ],
        solve=lambda: (must(angle_at(O, S45["A"], S45["B"]), 45, "sector angle"), R(45, 360) * 2 * R(22, 7) * 14 + 2 * 14)[1],
        diagram=fig_sector(S45, 14, 45, "14 cm", 240, (-7.5, 7.5, -2.4, 15.6), mark=44),
        working=r"""Arc $= \dfrac{45}{360} \times 2 \times \dfrac{22}{7} \times 14 = \dfrac{1}{8} \times 88 = 11$ cm.

Perimeter $= 11 + 14 + 14 = 39$ cm""",
    ),
    Q(
        id="maths-lengths-03",
        topic="Lengths and Perimeters",
        ref=TOPICS["Lengths and Perimeters"],
        stem=r"A circular running track has a diameter of 70 m. How far does an athlete run in 3 complete laps? [Take $\pi = \frac{22}{7}$]",
        answer=(r"660 m", 660),
        wrong=[
            Wrong(r"220 m", 220, r"That is one lap. The athlete runs 3 laps.", lambda: R(22, 7) * 70),
            Wrong(r"330 m", 330, r"You used $\pi r$. The distance round a circle is $2\pi r$ (or $\pi d$).", lambda: 3 * R(22, 7) * 35),
            Wrong(r"440 m", 440, r"You counted 2 laps instead of 3.", lambda: 2 * R(22, 7) * 70),
        ],
        solve=lambda: 3 * R(22, 7) * 70,
        working=r"""One lap $= \pi d = \dfrac{22}{7} \times 70 = 220$ m.

3 laps $= 3 \times 220 = 660$ m""",
    ),
    Q(
        id="maths-lengths-04",
        topic="Lengths and Perimeters",
        ref=TOPICS["Lengths and Perimeters"],
        stem=r"The circumference of a circle is 66 cm. Find its radius. [Take $\pi = \frac{22}{7}$]",
        answer=(r"10.5 cm", R(21, 2)),
        wrong=[
            Wrong(r"4.6 cm", Rounded(math.sqrt(21), dp=1), r"You used the area formula $\pi r^{2} = 66$. Circumference is $2\pi r$.", lambda: math.sqrt(66 * 7 / 22)),
            Wrong(r"21 cm", 21, r"That is the diameter ($66 \div \pi$). The radius is half of it.", lambda: 66 / R(22, 7)),
            Wrong(r"33 cm", 33, r"You halved 66. Divide by $2\pi$, not by 2.", lambda: R(66, 2)),
        ],
        solve=lambda: 66 / (2 * R(22, 7)),
        working=r"""$2\pi r = 66$, so $r = \dfrac{66}{2 \times \frac{22}{7}} = \dfrac{66 \times 7}{44} = 10.5$ cm""",
    ),
    Q(
        id="maths-lengths-05",
        topic="Lengths and Perimeters",
        ref=TOPICS["Lengths and Perimeters"],
        stem=r"The shape is a rectangle 14 cm by 10 cm with a semicircle on its top side. Find the perimeter of the shape. [Take $\pi = \frac{22}{7}$]",
        answer=(r"56 cm", 56),
        wrong=[
            Wrong(r"70 cm", 70, r"You included the dashed line. It is inside the shape, not on its edge.", lambda: 56 + 14),
            Wrong(r"78 cm", 78, r"You used a whole circle (44 cm). The top edge is a semicircle: half of $2\pi r$.", lambda: 10 + 14 + 10 + 2 * R(22, 7) * 7),
            Wrong(r"92 cm", 92, r"You added the whole rectangle's perimeter and a full circle.", lambda: 2 * (14 + 10) + 2 * R(22, 7) * 7),
        ],
        solve=lambda: SHAPE["h"] + SHAPE["w"] + SHAPE["h"] + R(1, 2) * 2 * R(22, 7) * 7,
        diagram=fig_shape(dashed_top=True),
        working=r"""Curved edge (semicircle, $r = 7$ cm): $\frac{1}{2} \times 2\pi r = \frac{22}{7} \times 7 = 22$ cm.

Straight edges: $10 + 14 + 10 = 34$ cm (the dashed line is inside the shape).

Perimeter $= 34 + 22 = 56$ cm""",
    ),
    # ── Polygons ───────────────────────────────────────────────────────────
    Q(
        id="maths-polygons-01",
        topic="Polygons",
        ref=TOPICS["Polygons"],
        stem=r"Find the size of each interior angle of a regular hexagon.",
        answer=(r"120°", 120),
        wrong=[
            Wrong(r"60°", 60, r"That is each exterior angle ($360° \div 6$). The interior angle is $180° - 60°$.", lambda: R(360, 6)),
            Wrong(r"108°", 108, r"That is the interior angle of a regular pentagon (5 sides). A hexagon has 6.", lambda: R(3 * 180, 5)),
            Wrong(r"720°", 720, r"That is the sum of all six interior angles. Divide by 6.", lambda: (6 - 2) * 180),
        ],
        solve=lambda: R((6 - 2) * 180, 6),
        working=r"""Sum of interior angles $= (n - 2) \times 180° = 4 \times 180° = 720°$.

Each angle $= 720° \div 6 = 120°$.""",
    ),
    Q(
        id="maths-polygons-02",
        topic="Polygons",
        ref=TOPICS["Polygons"],
        stem=r"Each interior angle of a regular polygon is 156°. How many sides does the polygon have?",
        answer=(r"$15$", 15),
        wrong=[
            Wrong(r"$2.3$", Rounded(360 / 156, dp=1), r"You divided 360° by the interior angle. Divide by the exterior angle, $180° - 156° = 24°$.", lambda: 360 / 156),
            Wrong(r"$7.5$", R(15, 2), r"You divided 180° by the exterior angle. Exterior angles add up to 360°.", lambda: R(180, 180 - 156)),
            Wrong(r"$24$", 24, r"24° is each exterior angle. The number of sides is $360° \div 24°$.", lambda: 180 - 156),
        ],
        solve=lambda: R(360, 180 - 156),
        working=r"""Exterior angle $= 180° - 156° = 24°$.

Exterior angles add up to 360°, so $n = 360° \div 24° = 15$ sides.""",
    ),
    Q(
        id="maths-polygons-03",
        topic="Polygons",
        ref=TOPICS["Polygons"],
        stem=r"Find the sum of the interior angles of an octagon.",
        answer=(r"1080°", 1080),
        wrong=[
            Wrong(r"135°", 135, r"That is one interior angle of a regular octagon. The question asks for the sum.", lambda: R(1080, 8)),
            Wrong(r"360°", 360, r"360° is the sum of the exterior angles of any polygon.", lambda: 360),
            Wrong(r"1440°", 1440, r"You worked out $8 \times 180°$. The formula is $(n - 2) \times 180°$.", lambda: 8 * 180),
        ],
        solve=lambda: (8 - 2) * 180,
        working=r"""Sum of interior angles $= (n - 2) \times 180° = (8 - 2) \times 180° = 1080°$""",
    ),
    Q(
        id="maths-polygons-04",
        topic="Polygons",
        ref=TOPICS["Polygons"],
        stem=r"The interior angles of a pentagon are $2x°$, $3x°$, 100°, 110° and 120°. Find the value of $x$.",
        answer=(r"$42$", 42),
        wrong=[
            Wrong(r"$6$", 6, r"You used 360° for the angle sum. A pentagon's angles add up to $(5 - 2) \times 180° = 540°$.", lambda: R(360 - 330, 5)),
            Wrong(r"$78$", 78, r"You used 720°, the angle sum of a hexagon. A pentagon has 5 sides: 540°.", lambda: R(720 - 330, 5)),
            Wrong(r"$108$", 108, r"You left out the three known angles: $5x = 540$.", lambda: R(540, 5)),
        ],
        solve=lambda: sp.solve(sp.Eq(5 * x + 330, (5 - 2) * 180), x)[0],
        working=r"""Sum of interior angles of a pentagon $= (5 - 2) \times 180° = 540°$.

$2x + 3x + 100 + 110 + 120 = 540$, so $5x + 330 = 540$, $5x = 210$ and $x = 42$.""",
    ),
    Q(
        id="maths-polygons-05",
        topic="Polygons",
        ref=TOPICS["Polygons"],
        stem=r"Find the size of each exterior angle of a regular polygon with 20 sides.",
        answer=(r"18°", 18),
        wrong=[
            Wrong(r"20°", 20, r"20 is the number of sides, not an angle."),
            Wrong(r"162°", 162, r"That is each interior angle. The exterior angle is $180° - 162°$.", lambda: R((20 - 2) * 180, 20)),
            Wrong(r"3240°", 3240, r"That is the sum of the interior angles.", lambda: (20 - 2) * 180),
        ],
        solve=lambda: R(360, 20),
        working=r"""The exterior angles of any polygon add up to 360°.

Each exterior angle $= 360° \div 20 = 18°$.""",
    ),
    # ── Matrices and determinants ──────────────────────────────────────────
    Q(
        id="maths-matrices-01",
        topic="Matrices and Determinants",
        ref=TOPICS["Matrices and Determinants"],
        stem=r"Find the determinant of the matrix " + mat(3, -2, 4, 5) + ".",
        answer=(r"$23$", 23),
        wrong=[
            Wrong(r"$-23$", -23, r"You worked out $bc - ad$. The determinant is $ad - bc$.", lambda: (-2) * 4 - 3 * 5),
            Wrong(r"$7$", 7, r"Sign slip: $bc = (-2)(4) = -8$, so $ad - bc = 15 - (-8) = 23$.", lambda: 15 - 8),
            Wrong(r"$22$", 22, r"You multiplied down the columns. Multiply along the diagonals: $ad - bc$.", lambda: 3 * 4 - (-2) * 5),
        ],
        solve=lambda: sp.Matrix([[3, -2], [4, 5]]).det(),
        working=r"""For $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$, the determinant is $ad - bc$:

$3 \times 5 - (-2) \times 4 = 15 + 8 = 23$""",
    ),
    Q(
        id="maths-matrices-02",
        topic="Matrices and Determinants",
        ref=TOPICS["Matrices and Determinants"],
        stem=r"Given that $A = " + mat(1, 2, 3, 4)[1:-1] + r"$ and $B = " + mat(2, 0, 1, 3)[1:-1] + r"$, find $AB$.",
        answer=(mat(4, 6, 10, 12), (4, 6, 10, 12)),
        wrong=[
            Wrong(mat(2, 0, 3, 12), (2, 0, 3, 12), r"You multiplied matching entries. Matrix multiplication is row × column.", lambda: (1 * 2, 2 * 0, 3 * 1, 4 * 3)),
            Wrong(mat(2, 4, 10, 14), (2, 4, 10, 14), r"That is $BA$. Order matters: for $AB$, use the rows of $A$ with the columns of $B$.", lambda: flat(sp.Matrix([[2, 0], [1, 3]]) * sp.Matrix([[1, 2], [3, 4]]))),
            Wrong(mat(4, 10, 6, 12), (4, 10, 6, 12), r"The entries are right but in the wrong places: row 1 of $A$ with column 2 of $B$ goes in row 1, column 2.", lambda: flat((sp.Matrix([[1, 2], [3, 4]]) * sp.Matrix([[2, 0], [1, 3]])).T)),
        ],
        solve=lambda: flat(sp.Matrix([[1, 2], [3, 4]]) * sp.Matrix([[2, 0], [1, 3]])),
        working=r"""Row 1 of $A$ × columns of $B$: $1(2) + 2(1) = 4$ and $1(0) + 2(3) = 6$.

Row 2 of $A$ × columns of $B$: $3(2) + 4(1) = 10$ and $3(0) + 4(3) = 12$.

$AB = \begin{pmatrix} 4 & 6 \\ 10 & 12 \end{pmatrix}$""",
    ),
    Q(
        id="maths-matrices-03",
        topic="Matrices and Determinants",
        ref=TOPICS["Matrices and Determinants"],
        stem=r"Find the inverse of the matrix " + mat(3, 1, 5, 2) + ".",
        answer=(mat(2, -1, -5, 3), (2, -1, -5, 3)),
        wrong=[
            Wrong(mat(2, 1, 5, 3), (2, 1, 5, 3), r"You swapped $a$ and $d$ but forgot to change the signs of $b$ and $c$."),
            Wrong(mat(3, -1, -5, 2), (3, -1, -5, 2), r"You changed the signs of $b$ and $c$ but forgot to swap $a$ and $d$."),
            Wrong(mat(-2, 1, 5, -3), (-2, 1, 5, -3), r"You changed every sign. Only $b$ and $c$ change sign; $a$ and $d$ swap places."),
        ],
        solve=lambda: flat(sp.Matrix([[3, 1], [5, 2]]).inv()),
        working=r"""Determinant $= 3 \times 2 - 1 \times 5 = 1$.

Inverse $= \dfrac{1}{1}\begin{pmatrix} 2 & -1 \\ -5 & 3 \end{pmatrix} = \begin{pmatrix} 2 & -1 \\ -5 & 3 \end{pmatrix}$ (swap $a$ and $d$, change the signs of $b$ and $c$, divide by the determinant).""",
    ),
    Q(
        id="maths-matrices-04",
        topic="Matrices and Determinants",
        ref=TOPICS["Matrices and Determinants"],
        stem=r"The determinant of " + mat("x", 2, 3, 4) + r" is 10. Find the value of $x$.",
        answer=(r"$4$", 4),
        wrong=[
            Wrong(r"$1$", 1, r"You added: $4x + 6 = 10$. The determinant is $ad - bc = 4x - 6$.", lambda: sp.solve(4 * x + 6 - 10, x)[0]),
            Wrong(r"$2.5$", R(5, 2), r"You left out $bc$: $4x = 10$.", lambda: R(10, 4)),
            Wrong(r"$16$", 16, r"You stopped at $4x = 16$. Divide by 4.", lambda: 10 + 6),
        ],
        solve=lambda: sp.solve(sp.Matrix([[x, 2], [3, 4]]).det() - 10, x)[0],
        working=r"""Determinant $= 4x - 2 \times 3 = 4x - 6$.

$4x - 6 = 10$, so $4x = 16$ and $x = 4$.""",
    ),
    Q(
        id="maths-matrices-05",
        topic="Matrices and Determinants",
        ref=TOPICS["Matrices and Determinants"],
        stem=r"Given that $A = " + mat(2, -1, 0, 3)[1:-1] + r"$ and $B = " + mat(1, 4, -2, 5)[1:-1] + r"$, find $3A - B$.",
        answer=(mat(5, -7, 2, 4), (5, -7, 2, 4)),
        wrong=[
            Wrong(mat(7, 1, -2, 14), (7, 1, -2, 14), r"You added $B$ instead of subtracting it.", lambda: flat(3 * sp.Matrix([[2, -1], [0, 3]]) + sp.Matrix([[1, 4], [-2, 5]]))),
            Wrong(mat(3, -15, 6, -6), (3, -15, 6, -6), r"You multiplied $B$ by 3 as well. Only $A$ is multiplied by 3.", lambda: flat(3 * (sp.Matrix([[2, -1], [0, 3]]) - sp.Matrix([[1, 4], [-2, 5]])))),
            Wrong(mat(5, 1, 2, 4), (5, 1, 2, 4), r"Sign slip in the top right: $-3 - 4 = -7$."),
        ],
        solve=lambda: flat(3 * sp.Matrix([[2, -1], [0, 3]]) - sp.Matrix([[1, 4], [-2, 5]])),
        working=r"""$3A = \begin{pmatrix} 6 & -3 \\ 0 & 9 \end{pmatrix}$

$3A - B = \begin{pmatrix} 6 - 1 & -3 - 4 \\ 0 - (-2) & 9 - 5 \end{pmatrix} = \begin{pmatrix} 5 & -7 \\ 2 & 4 \end{pmatrix}$""",
    ),
    # ── Transformations ────────────────────────────────────────────────────
    Q(
        id="maths-transformations-01",
        topic="Transformations",
        ref=TOPICS["Transformations"],
        stem=r"Find the image of the point $P(3, -5)$ after a reflection in the line $y = x$.",
        answer=(pt(-5, 3), (-5, 3)),
        wrong=[
            Wrong(pt(5, -3), (5, -3), r"That is a reflection in the line $y = -x$.", lambda: (5, -3)),
            Wrong(pt(-3, -5), (-3, -5), r"That is a reflection in the $y$-axis.", lambda: (-3, -5)),
            Wrong(pt(3, 5), (3, 5), r"That is a reflection in the $x$-axis.", lambda: (3, 5)),
        ],
        solve=lambda: (-5, 3),
        working=r"""A reflection in the line $y = x$ swaps the coordinates: $(x, y) \to (y, x)$.

$P(3, -5) \to P'(-5, 3)$""",
    ),
    Q(
        id="maths-transformations-02",
        topic="Transformations",
        ref=TOPICS["Transformations"],
        stem=r"The point $Q(4, 1)$ is rotated through 90° anticlockwise about the origin. Find its image.",
        answer=(pt(-1, 4), (-1, 4)),
        wrong=[
            Wrong(pt(1, -4), (1, -4), r"That is a 90° clockwise rotation.", lambda: (1, -4)),
            Wrong(pt(-4, -1), (-4, -1), r"That is a rotation through 180°.", lambda: (-4, -1)),
            Wrong(pt(1, 4), (1, 4), r"You swapped the coordinates without changing a sign. That is a reflection in $y = x$."),
        ],
        solve=lambda: tuple(int(v) for v in sp.Matrix([[0, -1], [1, 0]]) * sp.Matrix([4, 1])),
        working=r"""A rotation of 90° anticlockwise about the origin maps $(x, y) \to (-y, x)$.

$Q(4, 1) \to Q'(-1, 4)$""",
    ),
    Q(
        id="maths-transformations-03",
        topic="Transformations",
        ref=TOPICS["Transformations"],
        stem=r"A translation maps the point $P(2, -3)$ onto $P'(-1, 4)$. Find the translation vector.",
        answer=(col(-3, 7), (-3, 7)),
        wrong=[
            Wrong(col(3, -7), (3, -7), r"You worked out $P - P'$. The translation vector is image minus object: $P' - P$.", lambda: (2 - (-1), -3 - 4)),
            Wrong(col(1, 1), (1, 1), r"You added the coordinates. Subtract: $P' - P$.", lambda: (2 + (-1), -3 + 4)),
            Wrong(col(-3, 1), (-3, 1), r"Sign slip in the bottom number: $4 - (-3) = 7$.", lambda: (-1 - 2, 4 - 3)),
        ],
        solve=lambda: (-1 - 2, 4 - (-3)),
        working=r"""Translation vector $= P' - P = \begin{pmatrix} -1 - 2 \\ 4 - (-3) \end{pmatrix} = \begin{pmatrix} -3 \\ 7 \end{pmatrix}$""",
    ),
    Q(
        id="maths-transformations-04",
        topic="Transformations",
        ref=TOPICS["Transformations"],
        stem=r"The point $P(3, 4)$ is enlarged with centre $(1, 1)$ and scale factor 2. Find its image.",
        answer=(pt(5, 7), (5, 7)),
        wrong=[
            Wrong(pt(6, 8), (6, 8), r"That is an enlargement about the origin. The centre here is $(1, 1)$.", lambda: (2 * 3, 2 * 4)),
            Wrong(pt(4, 6), (4, 6), r"You doubled the distance from the centre but forgot to add the centre back on.", lambda: (2 * (3 - 1), 2 * (4 - 1))),
            Wrong(pt(7, 9), (7, 9), r"You doubled $P$ and then added the centre. Double the distance from the centre instead.", lambda: (2 * 3 + 1, 2 * 4 + 1)),
        ],
        solve=lambda: (1 + 2 * (3 - 1), 1 + 2 * (4 - 1)),
        working=r"""From the centre $(1, 1)$ to $P(3, 4)$ is $\begin{pmatrix} 2 \\ 3 \end{pmatrix}$. Double it: $\begin{pmatrix} 4 \\ 6 \end{pmatrix}$.

Image $= (1 + 4, 1 + 6) = (5, 7)$""",
    ),
    Q(
        id="maths-transformations-05",
        topic="Transformations",
        ref=TOPICS["Transformations"],
        stem=r"A shape with an area of 6 cm² is enlarged by a scale factor of 3. Find the area of the image.",
        answer=(r"54 cm²", 54),
        wrong=[
            Wrong(r"9 cm²", 9, r"You added the scale factor.", lambda: 6 + 3),
            Wrong(r"18 cm²", 18, r"You multiplied by 3. Areas are multiplied by the square of the scale factor.", lambda: 6 * 3),
            Wrong(r"162 cm²", 162, r"You cubed the scale factor. That is for volumes; areas use the square.", lambda: 6 * 3**3),
        ],
        solve=lambda: 6 * 3**2,
        working=r"""Lengths are multiplied by 3, so areas are multiplied by $3^{2} = 9$.

Area of the image $= 6 \times 9 = 54$ cm²""",
    ),
    # ── Cumulative frequency ───────────────────────────────────────────────
    Q(
        id="maths-cumfreq-01",
        topic="Cumulative Frequency",
        ref=TOPICS["Cumulative Frequency"],
        stem="The table shows the marks of 60 candidates in a test.\n\n" + MARKS_TABLE + "\n\nWhat is the cumulative frequency of the class 40–49?",
        answer=(r"$48$", 48),
        wrong=[
            Wrong(r"$20$", 20, r"20 is the frequency of the class 40–49 alone. Cumulative frequency is the running total up to that class."),
            Wrong(r"$28$", 28, r"28 is the cumulative frequency up to the class 30–39. Add the 20 candidates in 40–49.", lambda: CUM[2]),
            Wrong(r"$56$", 56, r"56 is the cumulative frequency up to the class 50–59, one class too far.", lambda: CUM[4]),
        ],
        solve=lambda: CUM[3],
        working=r"""Add the frequencies up to and including 40–49:

$4 + 9 + 15 + 20 = 48$""",
    ),
    Q(
        id="maths-cumfreq-02",
        topic="Cumulative Frequency",
        ref=TOPICS["Cumulative Frequency"],
        stem="The table shows the marks of 60 candidates in a test.\n\n" + MARKS_TABLE + "\n\nWhat is the upper class boundary of the class 30–39?",
        answer=(r"$39.5$", R(79, 2)),
        wrong=[
            Wrong(r"$34.5$", R(69, 2), r"That is the class mark (mid-point) of 30–39.", lambda: R(30 + 39, 2)),
            Wrong(r"$39$", 39, r"39 is the upper class limit. The boundary is halfway between 39 and 40, the lower limit of the next class."),
            Wrong(r"$40$", 40, r"40 is the lower limit of the next class. The boundary is halfway between 39 and 40."),
        ],
        solve=lambda: R(39 + 40, 2),
        working=r"""The upper class boundary lies halfway between the upper limit of this class (39) and the lower limit of the next (40):

$\dfrac{39 + 40}{2} = 39.5$""",
    ),
    Q(
        id="maths-cumfreq-03",
        topic="Cumulative Frequency",
        ref=TOPICS["Cumulative Frequency"],
        stem=r"The cumulative frequency curve shows the marks of 60 candidates in a test. Use it to estimate the median mark.",
        answer=(r"$40.5$", R(81, 2)),
        wrong=[
            Wrong(r"$30$", 30, r"30 is the position of the median ($\frac{60}{2}$) on the cumulative frequency axis. Read across to the curve, then down to the marks axis.", lambda: R(60, 2)),
            Wrong(r"$44.5$", R(89, 2), r"44.5 is the mid-point of the median class (40–49). Read the median from the curve.", lambda: R(39.5 + 49.5, 2)),
            Wrong(r"$48$", 48, r"48 is a cumulative frequency, not a mark."),
        ],
        solve=lambda: interpolate(OGIVE, 60 / 2),
        diagram=fig_ogive,
        working=r"""The median is the $\frac{60}{2} = 30$th mark.

Go across from 30 on the cumulative frequency axis to the curve, then down to the marks axis. The curve passes 28 at 39.5 and 48 at 49.5, so it reaches 30 at about $39.5 + \frac{2}{20} \times 10 = 40.5$.""",
    ),
    Q(
        id="maths-cumfreq-04",
        topic="Cumulative Frequency",
        ref=TOPICS["Cumulative Frequency"],
        stem="The table shows the marks of 60 candidates in a test.\n\n" + MARKS_TABLE + "\n\nHow many candidates scored 50 marks or more?",
        answer=(r"$12$", 12),
        wrong=[
            Wrong(r"$4$", 4, r"4 is only the class 60–69. Include 50–59 as well."),
            Wrong(r"$8$", 8, r"8 is only the class 50–59. Include 60–69 as well."),
            Wrong(r"$48$", 48, r"48 candidates scored less than 50. The question asks for 50 or more.", lambda: CUM[3]),
        ],
        solve=lambda: sum(FREQ[4:]),
        working=r"""Candidates in 50–59 and 60–69: $8 + 4 = 12$.

(Or: $60 - 48 = 12$, using the cumulative frequency up to 49.)""",
    ),
    Q(
        id="maths-cumfreq-05",
        topic="Cumulative Frequency",
        ref=TOPICS["Cumulative Frequency"],
        stem="The table shows the marks of 60 candidates in a test.\n\n" + MARKS_TABLE + "\n\nA candidate is chosen at random. What is the probability that the candidate scored less than 30?",
        answer=(r"$\frac{13}{60}$", R(13, 60)),
        wrong=[
            Wrong(r"$\frac{3}{20}$", R(3, 20), r"That counts only the class 20–29 (9 candidates). Include 10–19 as well.", lambda: R(9, 60)),
            Wrong(r"$\frac{7}{15}$", R(7, 15), r"That counts everyone up to 39 (28 candidates). Less than 30 stops at 29.", lambda: R(CUM[2], 60)),
            Wrong(r"$\frac{47}{60}$", R(47, 60), r"That is the probability of scoring 30 or more.", lambda: 1 - R(CUM[1], 60)),
        ],
        solve=lambda: R(CUM[1], sum(FREQ)),
        working=r"""Candidates who scored less than 30: $4 + 9 = 13$.

$P = \dfrac{13}{60}$""",
    ),
    # ── Statistics ─────────────────────────────────────────────────────────
    Q(
        id="maths-statistics-01",
        topic="Statistics",
        ref=TOPICS["Statistics"],
        stem=r"In a class of 40 pupils, 15 walk to school. On a pie chart of how the pupils travel to school, what angle represents the pupils who walk?",
        answer=(r"135°", 135),
        wrong=[
            Wrong(r"24°", 24, r"You divided 360° by 15. Work out $\frac{15}{40}$ of 360°.", lambda: R(360, 15)),
            Wrong(r"37.5°", R(75, 2), r"37.5 is the percentage who walk. Change it to an angle: $\frac{15}{40} \times 360°$.", lambda: R(15, 40) * 100),
            Wrong(r"54°", 54, r"You treated 15 as a percentage of 360°. 15 is out of 40 pupils.", lambda: R(15, 100) * 360),
        ],
        solve=lambda: R(15, 40) * 360,
        working=r"""Angle $= \dfrac{15}{40} \times 360° = 135°$""",
    ),
    Q(
        id="maths-statistics-02",
        topic="Statistics",
        ref=TOPICS["Statistics"],
        stem=r"The pie chart shows how a family in Kenema spends its monthly income. If the family spends Le 1,500 a month on rent, how much does it spend on food?",
        answer=(r"Le 2,400", 2400),
        wrong=[
            Wrong(r"Le 600", 600, r"You found $\frac{144}{360}$ of Le 1,500. But Le 1,500 is the rent (90°), not the whole income.", lambda: R(144, 360) * 1500),
            Wrong(r"Le 937.50", Rounded(1500 * 90 / 144, dp=2), r"You turned the ratio upside down. Food has the bigger angle (144°), so it costs more than rent.", lambda: 1500 * 90 / 144),
            Wrong(r"Le 6,000", 6000, r"That is the whole monthly income. The question asks for food.", lambda: 1500 * R(360, 90)),
        ],
        solve=lambda: (must(sum(a for _, a in PIE), 360, "total angle"), 1500 * R(dict(PIE)["Food"], dict(PIE)["Rent"]))[1],
        diagram=fig_pie,
        working=r"""Rent is 90°, which stands for Le 1,500. So 1° stands for $\dfrac{1500}{90}$ Leones.

Food $= 144 \times \dfrac{1500}{90} = $ Le 2,400""",
    ),
    Q(
        id="maths-statistics-03",
        topic="Statistics",
        ref=TOPICS["Statistics"],
        stem=r"The pie chart shows how a family in Kenema spends its monthly income. What percentage of the income is spent on transport?",
        answer=(r"15%", 15),
        wrong=[
            Wrong(r"6.7%", Rounded(360 / 54, dp=1), r"You divided 360 by 54. Work out $\frac{54}{360} \times 100\%$.", lambda: 360 / 54),
            Wrong(r"54%", 54, r"54 is the angle in degrees, not a percentage. The whole chart is 360°, not 100."),
            Wrong(r"85%", 85, r"That is everything except transport.", lambda: 100 - 15),
        ],
        solve=lambda: (must(sum(a for _, a in PIE), 360, "total angle"), R(dict(PIE)["Transport"], 360) * 100)[1],
        diagram=fig_pie,
        working=r"""Transport $= \dfrac{54}{360} \times 100\% = 15\%$""",
    ),
    Q(
        id="maths-statistics-04",
        topic="Statistics",
        ref=TOPICS["Statistics"],
        stem=r"The bar chart shows the number of pupils absent from a class on each day of one week. Find the mean number of pupils absent per day.",
        answer=(r"$4$", 4),
        wrong=[
            Wrong(r"$5$", 5, r"5 is Wednesday's number, the middle day of the week. The mean is the total divided by the number of days."),
            Wrong(r"$6$", 6, r"6 is the tallest bar (Monday), not the mean.", lambda: max(n for _, n in ABSENT)),
            Wrong(r"$20$", 20, r"20 is the total for the week. Divide by the 5 days.", lambda: sum(n for _, n in ABSENT)),
        ],
        solve=lambda: R(sum(n for _, n in ABSENT), len(ABSENT)),
        diagram=fig_bars,
        working=r"""Total absent $= 6 + 3 + 5 + 2 + 4 = 20$.

Mean $= 20 \div 5 = 4$ pupils per day.""",
    ),
    Q(
        id="maths-statistics-05",
        topic="Statistics",
        ref=TOPICS["Statistics"],
        stem=r"Find the class mark (mid-point) of the class 41–50.",
        answer=(r"$45.5$", R(91, 2)),
        wrong=[
            Wrong(r"$40.5$", R(81, 2), r"That is the lower class boundary."),
            Wrong(r"$50.5$", R(101, 2), r"That is the upper class boundary."),
            Wrong(r"$91$", 91, r"You added 41 and 50 but did not halve.", lambda: 41 + 50),
        ],
        solve=lambda: R(41 + 50, 2),
        working=r"""Class mark $= \dfrac{\text{lower limit} + \text{upper limit}}{2} = \dfrac{41 + 50}{2} = 45.5$""",
    ),
    # ── Measures of dispersion ─────────────────────────────────────────────
    Q(
        id="maths-dispersion-01",
        topic="Measures of Dispersion",
        ref=TOPICS["Measures of Dispersion"],
        stem=r"Find the range of 23, 17, 31, 9 and 26.",
        answer=(r"$22$", 22),
        wrong=[
            Wrong(r"$9$", 9, r"9 is the smallest number. Range = largest − smallest."),
            Wrong(r"$31$", 31, r"31 is the largest number. Range = largest − smallest."),
            Wrong(r"$40$", 40, r"You added the largest and smallest. Subtract them.", lambda: 31 + 9),
        ],
        solve=lambda: max([23, 17, 31, 9, 26]) - min([23, 17, 31, 9, 26]),
        working=r"""Range $= \text{largest} - \text{smallest} = 31 - 9 = 22$""",
    ),
    Q(
        id="maths-dispersion-02",
        topic="Measures of Dispersion",
        ref=TOPICS["Measures of Dispersion"],
        stem=r"Find the mean deviation of 2, 4, 6, 8 and 10.",
        answer=(r"$2.4$", R(12, 5)),
        wrong=[
            Wrong(r"$0$", 0, r"The signed deviations always add up to 0. Mean deviation uses their sizes (absolute values).", lambda: sum(v - 6 for v in [2, 4, 6, 8, 10])),
            Wrong(r"$2.83$", Rounded(math.sqrt(8), dp=2), r"That is the standard deviation. Mean deviation is the mean of the absolute deviations.", lambda: math.sqrt(8)),
            Wrong(r"$8$", 8, r"That is the variance (mean of the squared deviations).", lambda: R(sum((v - 6) ** 2 for v in [2, 4, 6, 8, 10]), 5)),
        ],
        solve=lambda: R(sum(abs(v - 6) for v in [2, 4, 6, 8, 10]), 5),
        working=r"""Mean $= \dfrac{2 + 4 + 6 + 8 + 10}{5} = 6$.

Absolute deviations: 4, 2, 0, 2, 4. Their mean $= \dfrac{12}{5} = 2.4$.""",
    ),
    Q(
        id="maths-dispersion-03",
        topic="Measures of Dispersion",
        ref=TOPICS["Measures of Dispersion"],
        stem=r"Find the variance of 3, 5, 7 and 9.",
        answer=(r"$5$", 5),
        wrong=[
            Wrong(r"$2$", 2, r"That is the mean deviation. Variance is the mean of the squared deviations.", lambda: R(sum(abs(v - 6) for v in [3, 5, 7, 9]), 4)),
            Wrong(r"$2.24$", Rounded(math.sqrt(5), dp=2), r"That is the standard deviation, the square root of the variance.", lambda: math.sqrt(5)),
            Wrong(r"$4$", 4, r"You divided by 5. There are 4 numbers, so divide by 4.", lambda: R(20, 5)),
        ],
        solve=lambda: R(sum((v - 6) ** 2 for v in [3, 5, 7, 9]), 4),
        working=r"""Mean $= \dfrac{3 + 5 + 7 + 9}{4} = 6$.

Squared deviations: $9, 1, 1, 9$, which add up to 20.

Variance $= \dfrac{20}{4} = 5$""",
    ),
    Q(
        id="maths-dispersion-04",
        topic="Measures of Dispersion",
        ref=TOPICS["Measures of Dispersion"],
        stem=r"Find the standard deviation of 1, 3, 5, 7 and 9, correct to two decimal places.",
        answer=(r"$2.83$", Rounded(math.sqrt(8), dp=2)),
        wrong=[
            Wrong(r"$2.40$", Rounded(2.4, dp=2), r"That is the mean deviation (the mean of 4, 2, 0, 2, 4). Standard deviation uses squared deviations.", lambda: 12 / 5),
            Wrong(r"$3.16$", Rounded(math.sqrt(10), dp=2), r"You divided by $n - 1 = 4$. Divide by the number of values, 5.", lambda: math.sqrt(40 / 4)),
            Wrong(r"$8.00$", Rounded(8, dp=2), r"That is the variance. Take its square root.", lambda: 40 / 5),
        ],
        solve=lambda: math.sqrt(sum((v - 5) ** 2 for v in [1, 3, 5, 7, 9]) / 5),
        working=r"""Mean $= 5$. Squared deviations: $16, 4, 0, 4, 16$, which add up to 40.

Variance $= \dfrac{40}{5} = 8$, so the standard deviation $= \sqrt{8} = 2.83$.""",
    ),
    Q(
        id="maths-dispersion-05",
        topic="Measures of Dispersion",
        ref=TOPICS["Measures of Dispersion"],
        stem=r"The standard deviation of a set of numbers is 4. If 5 is added to every number, what is the new standard deviation?",
        answer=(r"$4$", 4),
        wrong=[
            Wrong(r"$9$", 9, r"Adding 5 moves every number by the same amount, so the spread does not change.", lambda: 4 + 5),
            Wrong(r"$16$", 16, r"16 is the variance ($4^{2}$). Adding 5 to every number changes neither.", lambda: 4**2),
            Wrong(r"$20$", 20, r"Multiplying is not involved. Adding the same number to every value leaves the spread unchanged.", lambda: 4 * 5),
        ],
        solve=lambda: (must(sd([1, 9]), 4, "standard deviation before"), sd([v + 5 for v in [1, 9]]))[1],
        working=r"""Adding the same number to every value moves the whole set along without changing how spread out it is. The deviations from the mean stay the same, so the standard deviation is still 4.""",
    ),
    # ── Ratio, proportion and rates ────────────────────────────────────────
    Q(
        id="maths-ratio-01",
        topic="Ratio, Proportion and Rates",
        ref=TOPICS["Ratio, Proportion and Rates"],
        stem=r"Musa, Kadie and Sorie share Le 4,500 in the ratio 2 : 3 : 4. How much is the largest share?",
        answer=(r"Le 2,000", 2000),
        wrong=[
            Wrong(r"Le 500", 500, r"Le 500 is one part ($4500 \div 9$). The largest share is 4 parts.", lambda: R(4500, 9)),
            Wrong(r"Le 1,000", 1000, r"That is the smallest share (2 parts).", lambda: R(4500, 9) * 2),
            Wrong(r"Le 1,500", 1500, r"You divided by 3, the number of people. The money is shared by the ratio, not equally.", lambda: R(4500, 3)),
        ],
        solve=lambda: R(4500, 2 + 3 + 4) * 4,
        working=r"""Total parts $= 2 + 3 + 4 = 9$. One part $= 4500 \div 9 = $ Le 500.

Largest share $= 4 \times 500 = $ Le 2,000""",
    ),
    Q(
        id="maths-ratio-02",
        topic="Ratio, Proportion and Rates",
        ref=TOPICS["Ratio, Proportion and Rates"],
        stem=r"A poda-poda travels 150 km from Freetown in 2 hours 30 minutes. Find its average speed.",
        answer=(r"60 km/h", 60),
        wrong=[
            Wrong(r"65.2 km/h", Rounded(150 / 2.3, dp=1), r"You wrote 2 hours 30 minutes as 2.3 hours. 30 minutes is half an hour: 2.5 hours.", lambda: 150 / 2.3),
            Wrong(r"75 km/h", 75, r"You divided by 2 hours and ignored the 30 minutes.", lambda: R(150, 2)),
            Wrong(r"375 km/h", 375, r"You multiplied distance by time. Speed = distance ÷ time.", lambda: 150 * R(5, 2)),
        ],
        solve=lambda: 150 / R(5, 2),
        working=r"""2 hours 30 minutes $= 2.5$ hours.

Speed $= \dfrac{\text{distance}}{\text{time}} = \dfrac{150}{2.5} = 60$ km/h""",
    ),
    Q(
        id="maths-ratio-03",
        topic="Ratio, Proportion and Rates",
        ref=TOPICS["Ratio, Proportion and Rates"],
        stem=r"A trader changes Le 1,410 into US dollars at a rate of 1 US dollar = Le 23.50. How many dollars does she get?",
        answer=(r"60 US dollars", 60),
        wrong=[
            Wrong(r"6 US dollars", 6, r"Check the decimal point: $1410 \div 23.5 = 60$.", lambda: R(1410, 235)),
            Wrong(r"600 US dollars", 600, r"Check the decimal point: $1410 \div 23.5 = 60$, not 600.", lambda: R(14100 * 2, 47)),
            Wrong(r"33,135 US dollars", 33135, r"You multiplied. To change Leones into dollars, divide by the rate.", lambda: R(1410 * 235, 10)),
        ],
        solve=lambda: R(1410, 1) / R(47, 2),
        working=r"""Number of dollars $= \dfrac{1410}{23.50} = 60$ US dollars.""",
    ),
    Q(
        id="maths-ratio-04",
        topic="Ratio, Proportion and Rates",
        ref=TOPICS["Ratio, Proportion and Rates"],
        stem=r"A block of metal has a mass of 540 g and a volume of 200 cm³. Find its density.",
        answer=(r"2.7 g/cm³", R(27, 10)),
        wrong=[
            Wrong(r"0.37 g/cm³", Rounded(200 / 540, dp=2), r"You divided volume by mass. Density = mass ÷ volume.", lambda: 200 / 540),
            Wrong(r"340 g/cm³", 340, r"You subtracted. Density = mass ÷ volume.", lambda: 540 - 200),
            Wrong(r"108,000 g/cm³", 108000, r"You multiplied. Density = mass ÷ volume.", lambda: 540 * 200),
        ],
        solve=lambda: R(540, 200),
        working=r"""Density $= \dfrac{\text{mass}}{\text{volume}} = \dfrac{540}{200} = 2.7$ g/cm³""",
    ),
    Q(
        id="maths-ratio-05",
        topic="Ratio, Proportion and Rates",
        ref=TOPICS["Ratio, Proportion and Rates"],
        stem=r"If 6 exercise books cost Le 45, how much do 10 of the same books cost?",
        answer=(r"Le 75", 75),
        wrong=[
            Wrong(r"Le 27", 27, r"You used inverse proportion. More books cost more: this is direct proportion.", lambda: R(45 * 6, 10)),
            Wrong(r"Le 49", 49, r"You added 4 Leones for the 4 extra books. Find the cost of one book first.", lambda: 45 + 4),
            Wrong(r"Le 450", 450, r"You multiplied Le 45 by 10. Le 45 is the price of 6 books, not one.", lambda: 45 * 10),
        ],
        solve=lambda: R(45, 6) * 10,
        working=r"""One book costs $45 \div 6 = $ Le 7.50.

10 books cost $10 \times 7.50 = $ Le 75.""",
    ),
    # ── Linear inequalities ────────────────────────────────────────────────
    Q(
        id="maths-inequalities-01",
        topic="Linear Inequalities",
        ref=TOPICS["Linear Inequalities"],
        stem=r"Solve the inequality $3x - 4 < 11$.",
        answer=(r"$x < 5$", sp.Interval.open(-sp.oo, 5)),
        wrong=[
            Wrong(r"$x > 5$", sp.Interval.open(5, sp.oo), r"You reversed the inequality sign. Reverse it only when you multiply or divide by a negative number."),
            Wrong(r"$x < \frac{7}{3}$", sp.Interval.open(-sp.oo, R(7, 3)), r"Sign slip: add 4 to both sides, $3x < 15$.", lambda: solve_ineq(3 * x + 4 < 11)),
            Wrong(r"$x < 15$", sp.Interval.open(-sp.oo, 15), r"You stopped at $3x < 15$. Divide both sides by 3.", lambda: solve_ineq(x - 4 < 11)),
        ],
        solve=lambda: solve_ineq(3 * x - 4 < 11),
        working=r"""$3x - 4 < 11$

Add 4: $3x < 15$

Divide by 3: $x < 5$""",
    ),
    Q(
        id="maths-inequalities-02",
        topic="Linear Inequalities",
        ref=TOPICS["Linear Inequalities"],
        stem=r"Solve the inequality $5 - 2x \geq 11$.",
        answer=(r"$x \leq -3$", sp.Interval(-sp.oo, -3)),
        wrong=[
            Wrong(r"$x \geq -3$", sp.Interval(-3, sp.oo), r"When you divide both sides by $-2$, the inequality sign must be reversed."),
            Wrong(r"$x \leq 3$", sp.Interval(-sp.oo, 3), r"Sign slip: $-2x \geq 6$ gives $x \leq -3$, not 3."),
            Wrong(r"$x \leq -8$", sp.Interval(-sp.oo, -8), r"You added 5 to 11 instead of subtracting: $-2x \geq 11 - 5 = 6$.", lambda: solve_ineq(-2 * x - 5 >= 11)),
        ],
        solve=lambda: solve_ineq(5 - 2 * x >= 11),
        working=r"""$5 - 2x \geq 11$

Subtract 5: $-2x \geq 6$

Divide by $-2$ and reverse the sign: $x \leq -3$""",
    ),
    Q(
        id="maths-inequalities-03",
        topic="Linear Inequalities",
        ref=TOPICS["Linear Inequalities"],
        stem=r"Find the range of values of $x$ for which $-1 < 2x + 3 \leq 9$.",
        answer=(r"$-2 < x \leq 3$", sp.Interval.Lopen(-2, 3)),
        wrong=[
            Wrong(r"$-4 < x \leq 3$", sp.Interval.Lopen(-4, 3), r"You subtracted 3 from the left side but did not divide it by 2."),
            Wrong(r"$-2 < x \leq 6$", sp.Interval.Lopen(-2, 6), r"You subtracted 3 from the right side but did not divide it by 2."),
            Wrong(r"$-\frac{1}{2} < x \leq 3$", sp.Interval.Lopen(R(-1, 2), 3), r"You did not subtract 3 from the left side. Do the same thing to all three parts."),
        ],
        solve=lambda: solve_ineq(-1 < 2 * x + 3) & solve_ineq(2 * x + 3 <= 9),
        working=r"""Subtract 3 from all three parts: $-4 < 2x \leq 6$

Divide all three parts by 2: $-2 < x \leq 3$""",
    ),
    Q(
        id="maths-inequalities-04",
        topic="Linear Inequalities",
        ref=TOPICS["Linear Inequalities"],
        stem=r"How many integers $x$ satisfy $-2 < x \leq 3$?",
        answer=(r"$5$", 5),
        wrong=[
            Wrong(r"$3$", 3, r"You counted only the positive integers. 0 and $-1$ also satisfy the inequality."),
            Wrong(r"$4$", 4, r"You left out 3. The sign $\leq$ includes 3.", lambda: len([k for k in range(-1, 3)])),
            Wrong(r"$6$", 6, r"You included $-2$. The sign $<$ does not include $-2$.", lambda: len([k for k in range(-2, 4)])),
        ],
        solve=lambda: len([k for k in range(-10, 11) if -2 < k <= 3]),
        working=r"""The integers are $-1, 0, 1, 2, 3$: that is 5 integers.

$-2$ is not included ($<$), but 3 is ($\leq$).""",
    ),
    Q(
        id="maths-inequalities-05",
        topic="Linear Inequalities",
        ref=TOPICS["Linear Inequalities"],
        stem=r"Fatu has Le 200. Pens cost Le 20 each. She must keep at least Le 50 for transport. What is the greatest number of pens she can buy?",
        answer=(r"$7$", 7),
        wrong=[
            Wrong(r"$8$", 8, r"$20n \leq 150$ gives $n \leq 7.5$. She cannot afford 8 pens, so round down.", lambda: math.ceil(150 / 20)),
            Wrong(r"$10$", 10, r"You forgot the Le 50 she must keep for transport.", lambda: 200 // 20),
            Wrong(r"$12$", 12, r"You added the transport money instead of taking it away.", lambda: (200 + 50) // 20),
        ],
        solve=lambda: max(n for n in range(0, 50) if 20 * n <= 200 - 50),
        working=r"""She can spend at most $200 - 50 = $ Le 150 on pens.

$20n \leq 150$, so $n \leq 7.5$. The greatest whole number of pens is 7.""",
    ),
]
