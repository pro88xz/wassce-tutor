"""Mathematics practice set 2 (part 2): 50 more original Paper 1 questions on Circles, Angles, Trigonometry, Elevation and Depression, Bearings, Volumes, Central Tendency, Logarithms, Modular Arithmetic and Vectors, 2 with diagrams.

Written by WASSCE Tutor in the style of WASSCE Paper 1 (four options, A-D). Nothing
here is copied from a WAEC paper. Each topic's first five questions are in
set2_p1.py; these test different skills and mistakes. Every answer is worked out by
code; the two diagrams are drawn from the coordinates their answers are measured
from. See SCOPE.md.

Run `python3 scripts/questions/build.py` to check every answer and rebuild.
"""

import math
import sys
from pathlib import Path

import sympy as sp

sys.path.insert(0, str(Path(__file__).resolve().parent))

from diagram import ASK, Fig, angle_at, on_circle  # noqa: E402
from maths_common import make  # noqa: E402
from qbank import R, Rounded  # noqa: E402

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

mq = make(TOPICS)
O = (0.0, 0.0)
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
a_, b_ = sp.symbols("a b")


def deg(x: float) -> float:
    return round(x, 6)


def must(measured: float, stated: float, what: str) -> None:
    if abs(measured - stated) > 1e-6:
        raise AssertionError(f"figure shows {what} = {measured:.4f}, question says {stated}")


def col(p, q) -> str:
    return rf"$\begin{{pmatrix}} {p} \\ {q} \end{{pmatrix}}$"


def sind(d):
    return math.sin(math.radians(d))


def cosd(d):
    return math.cos(math.radians(d))


def tand(d):
    return math.tan(math.radians(d))


def bearing_of(dx: float, dy: float) -> float:
    """Three-figure bearing of a displacement (east dx, north dy)."""
    return math.degrees(math.atan2(dx, dy)) % 360


# ── Figures ────────────────────────────────────────────────────────────────
# Same segment: A and B cut off a 94° arc, so angles in the major segment are 47°.
S1 = {"A": on_circle(O, 3, 220), "B": on_circle(O, 3, 314), "C": on_circle(O, 3, 60), "D": on_circle(O, 3, 125)}
# Two tangents from P meeting at 50°: P is 3 / sin 25° from O, the points of contact at ±65°.
_DP = 3 / sind(25)
S2 = {"P": (_DP, 0.0), "A": on_circle(O, 3, 65), "B": on_circle(O, 3, -65)}


def fig_s1():
    g, f = S1, Fig(-4, 4, -4, 4, width=300)
    f.circle(O, 3)
    for p, q in [(g["C"], g["A"]), (g["C"], g["B"]), (g["D"], g["A"]), (g["D"], g["B"])]:
        f.line(p, q)
    f.angle(g["C"], g["A"], g["B"], "47°", r=26)
    f.angle(g["D"], g["A"], g["B"], "x", r=26, color=ASK)
    for k in "ABCD":
        f.dot(g[k])
        f.label(k, g[k], away_from=O)
    return f.svg("Circle with points A, B, C and D on it. Angle ACB is 47 degrees. The angle marked x is angle ADB, on the same side of AB as C.")


def fig_s2():
    g, f = S2, Fig(-3.8, 8.2, -4, 4, width=360)
    f.circle(O, 3)
    for p, q in [(g["P"], g["A"]), (g["P"], g["B"]), (O, g["A"]), (O, g["B"])]:
        f.line(p, q)
    f.angle(g["P"], g["A"], g["B"], "50°", r=34)
    f.angle(O, g["A"], g["B"], "x", r=22, color=ASK)
    f.dot(O)
    f.label("O", O, direction=180)
    for k, d in [("A", 90), ("B", -90), ("P", 0)]:
        f.dot(g[k])
        f.label(k, g[k], direction=d)
    return f.svg("Circle with centre O. PA and PB are tangents from P touching the circle at A and B. Angle APB is 50 degrees. The angle marked x is angle AOB.")


QUESTIONS = [
    # ── Circles ──────────────────────────────────────────────────────────
    mq("maths-circles-06", "Circles",
       r"In the diagram, $A$, $B$, $C$ and $D$ lie on a circle, and $C$ and $D$ are on the same side of $AB$. If $\angle ACB = 47°$, find the angle marked $x$.",
       (r"$47°$", 47),
       [(r"$43°$", 43, r"You took $90° - 47°$. There is no right angle here; angles in the same segment are equal.", lambda: 90 - 47),
        (r"$94°$", 94, r"You doubled 47°. Doubling gives the angle at the centre, not another angle at the circumference.", lambda: 2 * 47),
        (r"$133°$", 133, r"You took $180° - 47°$, as for opposite angles of a cyclic quadrilateral. $C$ and $D$ are on the same side of $AB$.", lambda: 180 - 47)],
       lambda: (must(angle_at(S1["C"], S1["A"], S1["B"]), 47, "angle ACB"), round(deg(angle_at(S1["D"], S1["A"], S1["B"]))))[1],
       r"""Angles in the same segment, standing on the same chord $AB$, are equal.

$x = \angle ADB = \angle ACB = 47°$""",
       diagram=fig_s1),
    mq("maths-circles-07", "Circles",
       r"In the diagram, $PA$ and $PB$ are tangents to the circle with centre $O$, and $\angle APB = 50°$. Find the angle marked $x$.",
       (r"$130°$", 130),
       [(r"$50°$", 50, r"$\angle AOB$ is not equal to $\angle APB$. The radii meet the tangents at right angles, so the four angles of $OAPB$ add up to 360°."),
        (r"$65°$", 65, r"$65°$ is half of $\angle AOB$, the angle $AOP$.", lambda: R(360 - 90 - 90 - 50, 2)),
        (r"$230°$", 230, r"That is the reflex angle at $O$, $360° - 130°$.", lambda: 360 - 130)],
       lambda: (must(angle_at(S2["P"], S2["A"], S2["B"]), 50, "angle APB"), round(deg(angle_at(O, S2["A"], S2["B"]))))[1],
       r"""A tangent is perpendicular to the radius at the point of contact: $\angle OAP = \angle OBP = 90°$.

The angles of quadrilateral $OAPB$ add up to 360°:

$x = 360° - 90° - 90° - 50° = 130°$""",
       diagram=fig_s2),
    mq("maths-circles-08", "Circles",
       r"A chord of a circle is 16 cm long and is 6 cm from the centre. Find the radius of the circle.",
       (r"$10$ cm", 10),
       [(r"$2\sqrt{7}$ cm", 2 * sp.sqrt(7), r"You subtracted the squares, $8^{2} - 6^{2}$. The radius is the hypotenuse, so add them.", lambda: sp.sqrt(8**2 - 6**2)),
        (r"$2\sqrt{73}$ cm", 2 * sp.sqrt(73), r"You used the whole chord, 16 cm. The perpendicular from the centre bisects the chord, so use 8 cm.", lambda: sp.sqrt(16**2 + 6**2)),
        (r"$22$ cm", 22, r"You added the lengths. Use Pythagoras' theorem.", lambda: 16 + 6)],
       lambda: sp.sqrt(8**2 + 6**2),
       r"""The perpendicular from the centre to a chord bisects it, so half the chord is 8 cm.

$r^{2} = 8^{2} + 6^{2} = 64 + 36 = 100$, so $r = 10$ cm."""),
    mq("maths-circles-09", "Circles",
       r"$ABCD$ is a cyclic quadrilateral with $\angle ABC = 108°$. The side $AD$ is produced to $E$. Find $\angle CDE$.",
       (r"$108°$", 108),
       [(r"$54°$", 54, r"You halved 108°. The exterior angle equals the interior opposite angle in full.", lambda: R(108, 2)),
        (r"$72°$", 72, r"$72°$ is the interior angle $\angle ADC = 180° - 108°$. $\angle CDE$ is the exterior angle next to it.", lambda: 180 - 108),
        (r"$252°$", 252, r"You took $360° - 108°$. Angles on a straight line add up to 180°.", lambda: 360 - 108)],
       lambda: 180 - (180 - 108),
       r"""Opposite angles of a cyclic quadrilateral add up to 180°: $\angle ADC = 180° - 108° = 72°$.

$\angle CDE = 180° - 72° = 108°$: the exterior angle of a cyclic quadrilateral equals the interior opposite angle."""),
    mq("maths-circles-10", "Circles",
       r"$AB$ is a diameter of a circle and $C$ is a point on the circle. If $|AC| = 6$ cm and $|BC| = 8$ cm, find the radius of the circle.",
       (r"$5$ cm", 5),
       [(r"$7$ cm", 7, r"You took the average of 6 and 8. Use the right angle at $C$.", lambda: R(6 + 8, 2)),
        (r"$10$ cm", 10, r"10 cm is the diameter $AB$. The radius is half of it.", lambda: sp.sqrt(6**2 + 8**2)),
        (r"$14$ cm", 14, r"You added the two chords. Use Pythagoras' theorem.", lambda: 6 + 8)],
       lambda: sp.sqrt(6**2 + 8**2) / 2,
       r"""The angle in a semicircle is 90°, so $\angle ACB = 90°$.

$|AB|^{2} = 6^{2} + 8^{2} = 100$, so $|AB| = 10$ cm, and the radius is 5 cm."""),
    # ── Angles and intersecting lines ────────────────────────────────────
    mq("maths-angles-06", "Angles and Intersecting Lines",
       r"The angles at a point are $3x°$, $4x°$, $5x°$ and $120°$. Find the value of $x$.",
       (r"$20$", 20),
       [(r"$5$", 5, r"You used 180°. Angles at a point add up to 360°.", lambda: R(180 - 120, 12)),
        (r"$30$", 30, r"You divided 360 by 12 and forgot the 120°.", lambda: R(360, 12)),
        (r"$40$", 40, r"You added 120° to 360° instead of subtracting it.", lambda: R(360 + 120, 12))],
       lambda: sp.solve(12 * sp.Symbol("x") + 120 - 360)[0],
       r"""$3x + 4x + 5x + 120 = 360$

$12x = 240$, so $x = 20$."""),
    mq("maths-angles-07", "Angles and Intersecting Lines",
       r"Two parallel lines are cut by a transversal. Two co-interior (allied) angles are $(2x + 10)°$ and $(3x - 20)°$. Find $x$.",
       (r"$38$", 38),
       [(r"$30$", 30, r"You set the angles equal, as for alternate angles. Co-interior angles add up to 180°.", lambda: sp.solve(sp.Eq(2 * sp.Symbol("x") + 10, 3 * sp.Symbol("x") - 20))[0]),
        (r"$34$", 34, r"You simplified $10 - 20$ as $+10$: $5x + 10 = 180$.", lambda: R(180 - 10, 5)),
        (r"$74$", 74, r"You used 360°. Co-interior angles add up to 180°.", lambda: R(360 + 10, 5))],
       lambda: sp.solve(sp.Eq(2 * sp.Symbol("x") + 10 + 3 * sp.Symbol("x") - 20, 180))[0],
       r"""Co-interior angles add up to 180°:

$(2x + 10) + (3x - 20) = 180 \Rightarrow 5x - 10 = 180 \Rightarrow x = 38$"""),
    mq("maths-angles-08", "Angles and Intersecting Lines",
       r"The angles of a triangle are in the ratio $2 : 3 : 4$. Find the largest angle.",
       (r"$80°$", 80),
       [(r"$40°$", 40, r"$40°$ is the smallest angle, 2 parts.", lambda: R(2, 9) * 180),
        (r"$60°$", 60, r"$60°$ is the middle angle, 3 parts.", lambda: R(3, 9) * 180),
        (r"$120°$", 120, r"You divided by 6 instead of $2 + 3 + 4 = 9$ parts.", lambda: R(4, 6) * 180)],
       lambda: R(4, 2 + 3 + 4) * 180,
       r"""Total parts $= 2 + 3 + 4 = 9$; one part $= 180° \div 9 = 20°$.

Largest angle $= 4 \times 20° = 80°$."""),
    mq("maths-angles-09", "Angles and Intersecting Lines",
       r"The complement of an angle is three times the angle. Find the angle.",
       (r"$22.5°$", R(45, 2)),
       [(r"$30°$", 30, r"You divided 90° by 3. The angle and its complement together make $x + 3x = 4x$.", lambda: R(90, 3)),
        (r"$45°$", 45, r"You used 180°, which is for supplementary angles: $4x = 180$.", lambda: R(180, 4)),
        (r"$67.5°$", R(135, 2), r"$67.5°$ is the complement, $3x$. The question asks for the angle.", lambda: 3 * R(90, 4))],
       lambda: R(90, 4),
       r"""Complementary angles add up to 90°: $x + 3x = 90$, so $4x = 90$ and $x = 22.5°$."""),
    mq("maths-angles-10", "Angles and Intersecting Lines",
       r"$PQ$ and $RS$ are parallel lines, with $P$ and $R$ on the left. A transversal cuts $PQ$ at $X$ and $RS$ at $Y$. If $\angle PXY = 64°$, find $\angle XYS$.",
       (r"$64°$", 64),
       [(r"$26°$", 26, r"You took $90° - 64°$. There is no right angle here.", lambda: 90 - 64),
        (r"$116°$", 116, r"$116°$ is the co-interior angle $\angle XYR$. $\angle PXY$ and $\angle XYS$ are alternate angles.", lambda: 180 - 64),
        (r"$128°$", 128, r"You doubled the angle. Alternate angles are equal.", lambda: 2 * 64)],
       lambda: 64,
       r"""$\angle PXY$ and $\angle XYS$ lie on opposite sides of the transversal, between the parallel lines (a Z shape), so they are alternate angles and equal: $64°$."""),
    # ── Sine, cosine and tangent ─────────────────────────────────────────
    mq("maths-trig-06", "Sine, Cosine and Tangent",
       r"If $\sin\theta = \frac{3}{5}$ and $\theta$ is acute, find $\tan\theta$.",
       (r"$\frac{3}{4}$", R(3, 4)),
       [(r"$\frac{4}{5}$", R(4, 5), r"$\frac{4}{5}$ is $\cos\theta$. $\tan\theta = \frac{\text{opposite}}{\text{adjacent}}$."),
        (r"$\frac{4}{3}$", R(4, 3), r"You put the adjacent over the opposite. $\tan\theta = \frac{3}{4}$."),
        (r"$\frac{5}{3}$", R(5, 3), r"$\frac{5}{3}$ is $\frac{1}{\sin\theta}$, not $\tan\theta$.")],
       lambda: R(3, sp.sqrt(5**2 - 3**2)),
       r"""Draw a right-angled triangle with opposite side 3 and hypotenuse 5. The adjacent side is $\sqrt{5^{2} - 3^{2}} = 4$.

$\tan\theta = \dfrac{\text{opposite}}{\text{adjacent}} = \dfrac{3}{4}$"""),
    mq("maths-trig-07", "Sine, Cosine and Tangent",
       r"Without using tables or a calculator, evaluate $\tan 60° \times \cos 30°$.",
       (r"$\frac{3}{2}$", R(3, 2)),
       [(r"$\frac{1}{2}$", R(1, 2), r"You used $\tan 60° = \frac{1}{\sqrt{3}}$, which is $\tan 30°$.", lambda: (1 / sp.sqrt(3)) * sp.sqrt(3) / 2),
        (r"$\frac{\sqrt{3}}{2}$", sp.sqrt(3) / 2, r"You used $\cos 30° = \frac{1}{2}$, which is $\cos 60°$.", lambda: sp.sqrt(3) * R(1, 2)),
        (r"$\frac{3\sqrt{3}}{2}$", 3 * sp.sqrt(3) / 2, r"You added the values instead of multiplying them.", lambda: sp.sqrt(3) + sp.sqrt(3) / 2)],
       lambda: sp.tan(sp.pi / 3) * sp.cos(sp.pi / 6),
       r"""$\tan 60° = \sqrt{3}$ and $\cos 30° = \dfrac{\sqrt{3}}{2}$.

$\sqrt{3} \times \dfrac{\sqrt{3}}{2} = \dfrac{3}{2}$"""),
    mq("maths-trig-08", "Sine, Cosine and Tangent",
       r"Find the value of $\sin 150°$.",
       (r"$\frac{1}{2}$", R(1, 2)),
       [(r"$-\frac{\sqrt{3}}{2}$", -sp.sqrt(3) / 2, r"That is $\cos 150°$. Sine is positive in the second quadrant and equals $\sin 30°$."),
        (r"$-\frac{1}{2}$", R(-1, 2), r"Sine is positive in the second quadrant (90° to 180°)."),
        (r"$\frac{\sqrt{3}}{2}$", sp.sqrt(3) / 2, r"That is $\sin 60°$ (or $\sin 120°$). $\sin 150° = \sin(180° - 150°) = \sin 30°$.")],
       lambda: sp.sin(sp.Rational(150, 180) * sp.pi),
       r"""150° is in the second quadrant, where sine is positive.

$\sin 150° = \sin(180° - 150°) = \sin 30° = \dfrac{1}{2}$"""),
    mq("maths-trig-09", "Sine, Cosine and Tangent",
       r"In triangle $ABC$, $a = 10$ cm, $b = 8$ cm and $\angle A = 60°$. Find $\angle B$, correct to the nearest degree.",
       (r"$44°$", Rounded(math.degrees(math.asin(8 * sind(60) / 10)), dp=0)),
       [(r"$48°$", 48, r"You took $\frac{8}{10}$ of 60°. Angles are not in the same ratio as the sides; use the sine rule.", lambda: R(8, 10) * 60),
        (r"$53°$", Rounded(math.degrees(math.asin(0.8)), dp=0), r"You used $\sin B = \frac{8}{10}$ and left out $\sin 60°$.", lambda: math.degrees(math.asin(0.8))),
        (r"$136°$", Rounded(180 - math.degrees(math.asin(8 * sind(60) / 10)), dp=0), r"You took the obtuse angle. Since $b < a$, $B$ must be smaller than $A$, so it is acute.", lambda: 180 - math.degrees(math.asin(8 * sind(60) / 10)))],
       lambda: math.degrees(math.asin(8 * sind(60) / 10)),
       r"""Sine rule: $\dfrac{\sin B}{b} = \dfrac{\sin A}{a}$, so $\sin B = \dfrac{8 \sin 60°}{10} = \dfrac{8 \times 0.8660}{10} = 0.6928$.

$B = 43.85° \approx 44°$"""),
    mq("maths-trig-10", "Sine, Cosine and Tangent",
       r"The sides of a triangle are 5 cm, 7 cm and 8 cm. Find the angle opposite the 7 cm side.",
       (r"$60°$", 60),
       [(r"$30°$", 30, r"$\cos\theta = \frac{1}{2}$ gives 60°, not 30°. (30° has sine $\frac{1}{2}$.)"),
        (r"$90°$", 90, r"$5^{2} + 7^{2} \ne 8^{2}$ and $5^{2} + 8^{2} \ne 7^{2}$, so the triangle is not right-angled."),
        (r"$120°$", 120, r"You got the sign wrong: $\cos\theta = \frac{25 + 64 - 49}{80} = +\frac{1}{2}$.", lambda: sp.deg(sp.acos(R(-1, 2))))],
       lambda: sp.deg(sp.acos(sp.Rational(5**2 + 8**2 - 7**2, 2 * 5 * 8))),
       r"""Cosine rule: $\cos\theta = \dfrac{5^{2} + 8^{2} - 7^{2}}{2 \times 5 \times 8} = \dfrac{40}{80} = \dfrac{1}{2}$

$\theta = 60°$"""),
    # ── Angles of elevation and depression ───────────────────────────────
    mq("maths-elevation-06", "Angles of Elevation and Depression",
       r"A ladder 10 m long leans against a vertical wall and makes an angle of 60° with the level ground. How high up the wall does it reach, correct to one decimal place?",
       (r"$8.7$ m", Rounded(10 * sind(60), dp=1)),
       [(r"$5.0$ m", Rounded(10 * cosd(60), dp=1), r"You used $\cos 60°$, which gives the distance of the foot from the wall.", lambda: 10 * cosd(60)),
        (r"$11.5$ m", Rounded(10 / sind(60), dp=1), r"You divided by $\sin 60°$. The ladder is the hypotenuse, so height $= 10 \sin 60°$.", lambda: 10 / sind(60)),
        (r"$17.3$ m", Rounded(10 * tand(60), dp=1), r"You used $\tan 60°$, but 10 m is the hypotenuse, not the adjacent side.", lambda: 10 * tand(60))],
       lambda: 10 * sind(60),
       r"""The ladder is the hypotenuse and the height is opposite the 60° angle:

height $= 10 \sin 60° = 10 \times 0.8660 = 8.66 \approx 8.7$ m"""),
    mq("maths-elevation-07", "Angles of Elevation and Depression",
       r"From a point $A$ on level ground, the angle of elevation of the top of a tower is 30°. From a point $B$, 20 m nearer the tower, the angle of elevation is 60°. Find the height of the tower, correct to one decimal place.",
       (r"$17.3$ m", Rounded(10 * math.sqrt(3), dp=1)),
       [(r"$10.0$ m", Rounded(10.0, dp=1), r"You used $20 \sin 30°$. The 20 m is $AB$, along the ground, not a slope to the top."),
        (r"$20.0$ m", Rounded(20.0, dp=1), r"Triangle $ABT$ is isosceles, so $|BT| = 20$ m, but $BT$ is the sloping line, not the height.", lambda: 20.0),
        (r"$34.6$ m", Rounded(20 * math.sqrt(3), dp=1), r"You used $20 \tan 60°$, treating 20 m as the distance from $B$ to the foot of the tower.", lambda: 20 * tand(60))],
       lambda: 20 * sind(60),
       r"""In triangle $ABT$ (top $T$), the angle at $B$ outside the triangle is 60°, so $\angle ATB = 60° - 30° = 30°$. The triangle is isosceles: $|BT| = |AB| = 20$ m.

Height $= |BT| \sin 60° = 20 \times 0.8660 = 17.3$ m"""),
    mq("maths-elevation-08", "Angles of Elevation and Depression",
       r"From the top of a tower 40 m high, the angle of depression of a car is 30°. The car drives straight towards the tower until the angle of depression is 45°. How far has the car moved, correct to one decimal place?",
       (r"$29.3$ m", Rounded(40 / tand(30) - 40 / tand(45), dp=1)),
       [(r"$40.0$ m", Rounded(40.0, dp=1), r"40 m is the car's final distance from the tower, $\frac{40}{\tan 45°}$.", lambda: 40 / tand(45)),
        (r"$69.3$ m", Rounded(40 / tand(30), dp=1), r"69.3 m is the car's first distance from the tower. Subtract the second distance.", lambda: 40 / tand(30)),
        (r"$109.3$ m", Rounded(40 / tand(30) + 40, dp=1), r"You added the two distances. The car moved from the first position to the second.", lambda: 40 / tand(30) + 40 / tand(45))],
       lambda: 40 / tand(30) - 40 / tand(45),
       r"""First distance $= \dfrac{40}{\tan 30°} = 69.28$ m. Second distance $= \dfrac{40}{\tan 45°} = 40$ m.

Distance moved $= 69.28 - 40 = 29.28 \approx 29.3$ m"""),
    mq("maths-elevation-09", "Angles of Elevation and Depression",
       r"A vertical pole 12 m high casts a shadow 9 m long on level ground. Find the angle of elevation of the sun, correct to one decimal place.",
       (r"$53.1°$", Rounded(math.degrees(math.atan(12 / 9)), dp=1)),
       [(r"$36.9°$", Rounded(math.degrees(math.atan(9 / 12)), dp=1), r"You used $\tan\theta = \frac{9}{12}$. The height is opposite the angle at the tip of the shadow.", lambda: math.degrees(math.atan(9 / 12))),
        (r"$41.4°$", Rounded(math.degrees(math.acos(9 / 12)), dp=1), r"You used $\cos\theta = \frac{9}{12}$, treating the pole as the hypotenuse.", lambda: math.degrees(math.acos(9 / 12))),
        (r"$48.6°$", Rounded(math.degrees(math.asin(9 / 12)), dp=1), r"You used $\sin\theta = \frac{9}{12}$. Neither given side is the hypotenuse.", lambda: math.degrees(math.asin(9 / 12)))],
       lambda: math.degrees(math.atan(12 / 9)),
       r"""At the tip of the shadow, the pole (12 m) is opposite and the shadow (9 m) is adjacent:

$\tan\theta = \dfrac{12}{9}$, so $\theta = 53.13° \approx 53.1°$"""),
    mq("maths-elevation-10", "Angles of Elevation and Depression",
       r"A bird sits at the top of a tree 15 m high. A cat is on the level ground 20 m from the foot of the tree. Find the angle of depression of the cat from the bird, correct to the nearest degree.",
       (r"$37°$", Rounded(math.degrees(math.atan(15 / 20)), dp=0)),
       [(r"$41°$", Rounded(math.degrees(math.acos(15 / 20)), dp=0), r"You used $\cos\theta = \frac{15}{20}$, but 20 m is not the hypotenuse.", lambda: math.degrees(math.acos(15 / 20))),
        (r"$49°$", Rounded(math.degrees(math.asin(15 / 20)), dp=0), r"You used $\sin\theta = \frac{15}{20}$, but 20 m is not the hypotenuse.", lambda: math.degrees(math.asin(15 / 20))),
        (r"$53°$", Rounded(math.degrees(math.atan(20 / 15)), dp=0), r"You used $\tan\theta = \frac{20}{15}$. That is the angle between the line of sight and the tree.", lambda: math.degrees(math.atan(20 / 15)))],
       lambda: math.degrees(math.atan(15 / 20)),
       r"""The angle of depression from the bird equals the angle of elevation of the bird from the cat (alternate angles):

$\tan\theta = \dfrac{15}{20} = 0.75$, so $\theta = 36.87° \approx 37°$"""),
    # ── Bearings ─────────────────────────────────────────────────────────
    mq("maths-bearings-06", "Bearings",
       r"A boy walks 6 km due east and then 8 km due south. Find his bearing from his starting point, correct to the nearest degree.",
       (r"$143°$", Rounded(bearing_of(6, -8), dp=0)),
       [(r"$037°$", Rounded(math.degrees(math.atan(6 / 8)), dp=0), r"$37°$ is the angle between his line and due south. The bearing is measured clockwise from north: $180° - 37°$.", lambda: math.degrees(math.atan(6 / 8))),
        (r"$053°$", Rounded(math.degrees(math.atan(8 / 6)), dp=0), r"$53°$ is the angle with due east, measured the wrong way; he is south-east, so the bearing is between 090° and 180°.", lambda: math.degrees(math.atan(8 / 6))),
        (r"$127°$", Rounded(90 + math.degrees(math.atan(6 / 8)), dp=0), r"You added 37° to 090°. The angle from due east to his line is 53°, so the bearing is $090° + 53°$.", lambda: 90 + math.degrees(math.atan(6 / 8)))],
       lambda: bearing_of(6, -8),
       r"""He ends 6 km east and 8 km south of the start. The angle between his line and due south is $\tan^{-1}\frac{6}{8} = 36.87°$.

Bearing $= 180° - 36.87° = 143.13° \approx 143°$"""),
    mq("maths-bearings-07", "Bearings",
       r"Town $B$ is 15 km east and 8 km north of town $A$. Find the bearing of $B$ from $A$, correct to the nearest degree.",
       (r"$062°$", Rounded(bearing_of(15, 8), dp=0)),
       [(r"$028°$", Rounded(math.degrees(math.atan(8 / 15)), dp=0), r"$28°$ is the angle with due east. Bearings are measured from north: $90° - 28°$.", lambda: math.degrees(math.atan(8 / 15))),
        (r"$118°$", Rounded(90 + math.degrees(math.atan(8 / 15)), dp=0), r"You added the angle to 090°, but $B$ is north of east, so the bearing is less than 090°.", lambda: 90 + math.degrees(math.atan(8 / 15))),
        (r"$242°$", Rounded(180 + bearing_of(15, 8), dp=0), r"That is the bearing of $A$ from $B$ (the back bearing).", lambda: 180 + bearing_of(15, 8))],
       lambda: bearing_of(15, 8),
       r"""From north, turning towards east: $\tan\theta = \dfrac{15}{8}$, so $\theta = 61.93°$.

Bearing $= 062°$"""),
    mq("maths-bearings-08", "Bearings",
       r"Express the compass bearing N 35° W as a three-figure bearing.",
       (r"$325°$", 325),
       [(r"$035°$", 35, r"N 35° W is 35° west of north. Measured clockwise from north, that is $360° - 35°$."),
        (r"$145°$", 145, r"You worked from south: $180° - 35°$. The bearing starts from north.", lambda: 180 - 35),
        (r"$305°$", 305, r"You added 35° to 270° (west). The angle is measured from north, so take it from 360°.", lambda: 270 + 35)],
       lambda: 360 - 35,
       r"""N 35° W means start facing north and turn 35° towards west. Clockwise from north this is $360° - 35° = 325°$."""),
    mq("maths-bearings-09", "Bearings",
       r"A plane flies due east at 300 km/h for 2 hours, then due north at the same speed for $1\frac{1}{2}$ hours. How far is it from its starting point?",
       (r"$750$ km", 750),
       [(r"$150$ km", 150, r"You subtracted the distances. They are at right angles, so use Pythagoras' theorem.", lambda: 600 - 450),
        (r"$600$ km", 600, r"600 km is only the eastward distance.", lambda: 300 * 2),
        (r"$1050$ km", 1050, r"1050 km is the total distance flown, not the distance from the start.", lambda: 600 + 450)],
       lambda: sp.sqrt((300 * 2) ** 2 + (300 * R(3, 2)) ** 2),
       r"""East: $300 \times 2 = 600$ km. North: $300 \times 1.5 = 450$ km.

Distance $= \sqrt{600^{2} + 450^{2}} = \sqrt{562\,500} = 750$ km"""),
    mq("maths-bearings-10", "Bearings",
       r"$Q$ is 5 km due south of $P$, and $R$ is 5 km due east of $Q$. Find the bearing of $R$ from $P$.",
       (r"$135°$", 135),
       [(r"$045°$", 45, r"$R$ is south-east of $P$, not north-east."),
        (r"$225°$", 225, r"$225°$ is south-west. $R$ is to the east of $P$."),
        (r"$315°$", 315, r"That is the bearing of $P$ from $R$ (north-west).", lambda: (135 + 180) % 360)],
       lambda: bearing_of(5, -5),
       r"""$R$ is 5 km east and 5 km south of $P$, so it is exactly south-east of $P$: bearing $135°$."""),
    # ── Volumes ──────────────────────────────────────────────────────────
    mq("maths-volumes-06", "Volumes",
       r"Find the volume of a sphere of radius 6 cm. [Take $\pi = \frac{22}{7}$]",
       (r"$905\frac{1}{7}$ cm³", R(4, 3) * R(22, 7) * 6**3),
       [(r"$452\frac{4}{7}$ cm³", 4 * R(22, 7) * 6**2, r"That is the surface area, $4\pi r^{2}$. Volume uses $\frac{4}{3}\pi r^{3}$.", lambda: 4 * R(22, 7) * 6**2),
        (r"$678\frac{6}{7}$ cm³", R(22, 7) * 6**3, r"You left out the $\frac{4}{3}$.", lambda: R(22, 7) * 6**3),
        (r"$2715\frac{3}{7}$ cm³", 4 * R(22, 7) * 6**3, r"You multiplied by 4 instead of $\frac{4}{3}$.", lambda: 4 * R(22, 7) * 6**3)],
       lambda: R(4, 3) * R(22, 7) * 6**3,
       r"""$V = \frac{4}{3}\pi r^{3} = \frac{4}{3} \times \frac{22}{7} \times 216 = \frac{6336}{7} = 905\frac{1}{7}$ cm³"""),
    mq("maths-volumes-07", "Volumes",
       r"A cylindrical water tank has a radius of 70 cm and a height of 1 m. How many litres of water does it hold when full? [Take $\pi = \frac{22}{7}$]",
       (r"1,540 litres", 1540),
       [(r"154 litres", 154, r"You divided by 10 000. One litre is 1000 cm³.", lambda: R(22, 7) * 70**2 * 100 / 10000),
        (r"15,400 litres", 15400, r"You divided by 100. One litre is 1000 cm³.", lambda: R(22, 7) * 70**2 * 100 / 100),
        (r"1,540,000 litres", 1540000, r"1,540,000 is the volume in cm³. Divide by 1000 to get litres.", lambda: R(22, 7) * 70**2 * 100)],
       lambda: R(22, 7) * 70**2 * 100 / 1000,
       r"""Use centimetres: height $= 100$ cm.

$V = \pi r^{2}h = \frac{22}{7} \times 70^{2} \times 100 = 1\,540\,000$ cm³ $= 1540$ litres (1 litre $= 1000$ cm³)."""),
    mq("maths-volumes-08", "Volumes",
       r"A cone has a base radius of 6 cm and a slant height of 10 cm. Find its volume. [Take $\pi = \frac{22}{7}$]",
       (r"$301\frac{5}{7}$ cm³", R(1, 3) * R(22, 7) * 36 * 8),
       [(r"$150\frac{6}{7}$ cm³", R(1, 3) * R(22, 7) * 36 * 4, r"You took the height as $10 - 6 = 4$ cm. Use Pythagoras: $h = \sqrt{10^{2} - 6^{2}} = 8$.", lambda: R(1, 3) * R(22, 7) * 36 * 4),
        (r"$377\frac{1}{7}$ cm³", R(1, 3) * R(22, 7) * 36 * 10, r"You used the slant height as the height.", lambda: R(1, 3) * R(22, 7) * 36 * 10),
        (r"$905\frac{1}{7}$ cm³", R(22, 7) * 36 * 8, r"You left out the $\frac{1}{3}$. That is the volume of a cylinder.", lambda: R(22, 7) * 36 * 8)],
       lambda: R(1, 3) * R(22, 7) * 6**2 * sp.sqrt(10**2 - 6**2),
       r"""Height $h = \sqrt{10^{2} - 6^{2}} = 8$ cm.

$V = \frac{1}{3}\pi r^{2}h = \frac{1}{3} \times \frac{22}{7} \times 36 \times 8 = \frac{2112}{7} = 301\frac{5}{7}$ cm³"""),
    mq("maths-volumes-09", "Volumes",
       r"Find the volume of a solid hemisphere of radius 6 cm, leaving your answer in terms of $\pi$.",
       (r"$144\pi$ cm³", 144 * sp.pi),
       [(r"$24\pi$ cm³", 24 * sp.pi, r"You used $r^{2}$ instead of $r^{3}$: $\frac{2}{3}\pi \times 36$.", lambda: R(2, 3) * sp.pi * 6**2),
        (r"$72\pi$ cm³", 72 * sp.pi, r"$72\pi$ is the curved surface area, $2\pi r^{2}$, not the volume.", lambda: 2 * sp.pi * 6**2),
        (r"$288\pi$ cm³", 288 * sp.pi, r"$288\pi$ is the volume of the whole sphere. A hemisphere is half.", lambda: R(4, 3) * sp.pi * 6**3)],
       lambda: R(2, 3) * sp.pi * 6**3,
       r"""A hemisphere is half a sphere: $V = \frac{1}{2} \times \frac{4}{3}\pi r^{3} = \frac{2}{3}\pi r^{3} = \frac{2}{3}\pi \times 216 = 144\pi$ cm³"""),
    mq("maths-volumes-10", "Volumes",
       r"A prism has a right-angled triangle as its cross-section, with the two shorter sides 6 cm and 8 cm. The prism is 20 cm long. Find its volume.",
       (r"$480$ cm³", 480),
       [(r"$320$ cm³", 320, r"You multiplied by $\frac{1}{3}$, as for a pyramid. A prism's volume is cross-section × length.", lambda: R(1, 3) * 6 * 8 * 20),
        (r"$600$ cm³", 600, r"You used the hypotenuse (10 cm) in the triangle's area. The two shorter sides are the base and height.", lambda: R(1, 2) * 6 * 10 * 20),
        (r"$960$ cm³", 960, r"You forgot the $\frac{1}{2}$ in the area of the triangle.", lambda: 6 * 8 * 20)],
       lambda: R(1, 2) * 6 * 8 * 20,
       r"""Area of cross-section $= \frac{1}{2} \times 6 \times 8 = 24$ cm².

Volume $= 24 \times 20 = 480$ cm³"""),
    # ── Measures of central tendency ─────────────────────────────────────
    mq("maths-averages-06", "Measures of Central Tendency",
       r"Find the mode of 3, 5, 5, 7, 8, 8, 8 and 9.",
       (r"$8$", 8),
       [(r"$5$", 5, r"5 appears twice, but 8 appears three times."),
        (r"$6.625$", R(53, 8), r"6.625 is the mean. The mode is the value that occurs most often.", lambda: R(3 + 5 + 5 + 7 + 8 + 8 + 8 + 9, 8)),
        (r"$7.5$", R(15, 2), r"7.5 is the median. The mode is the most frequent value.", lambda: R(7 + 8, 2))],
       lambda: max(set([3, 5, 5, 7, 8, 8, 8, 9]), key=[3, 5, 5, 7, 8, 8, 8, 9].count),
       r"""The mode is the value that occurs most often: 8 occurs three times."""),
    mq("maths-averages-07", "Measures of Central Tendency",
       r"The mean of six numbers is 15. When one number is removed, the mean of the other five is 14. Find the number removed.",
       (r"$20$", 20),
       [(r"$1$", 1, r"You subtracted the means. Work with the totals.", lambda: 15 - 14),
        (r"$14$", 14, r"14 is the new mean, not the number removed."),
        (r"$29$", 29, r"You added the means. Work with the totals: $6 \times 15$ and $5 \times 14$.", lambda: 15 + 14)],
       lambda: 6 * 15 - 5 * 14,
       r"""Total of six numbers $= 6 \times 15 = 90$. Total of five numbers $= 5 \times 14 = 70$.

Number removed $= 90 - 70 = 20$"""),
    mq("maths-averages-08", "Measures of Central Tendency",
       r"""The table shows the scores of 10 pupils in a quiz.

$$
\begin{array}{l|ccc}
\text{Score} & 2 & 3 & 4 \\ \hline
\text{Frequency} & 3 & 5 & 2
\end{array}
$$

Find the median score.""",
       (r"$3$", 3),
       [(r"$2$", 2, r"Only the first 3 pupils scored 2. The 5th and 6th scores are both 3."),
        (r"$2.9$", R(29, 10), r"2.9 is the mean. The median is the middle score when the scores are in order.", lambda: R(2 * 3 + 3 * 5 + 4 * 2, 10)),
        (r"$5$", 5, r"5 is the largest frequency, not a score.")],
       lambda: sorted([2] * 3 + [3] * 5 + [4] * 2)[4:6][0],
       r"""In order: 2, 2, 2, 3, 3, 3, 3, 3, 4, 4. With 10 scores, the median is the mean of the 5th and 6th: $\frac{3 + 3}{2} = 3$."""),
    mq("maths-averages-09", "Measures of Central Tendency",
       r"Class A has 20 pupils with a mean mark of 60. Class B has 30 pupils with a mean mark of 70. Find the mean mark of all 50 pupils.",
       (r"$66$", 66),
       [(r"$64$", 64, r"You gave class A's mean to class B and the other way round.", lambda: R(20 * 70 + 30 * 60, 50)),
        (r"$65$", 65, r"You averaged the two means. The classes are different sizes, so use the totals.", lambda: R(60 + 70, 2)),
        (r"$130$", 130, r"You added the means.", lambda: 60 + 70)],
       lambda: R(20 * 60 + 30 * 70, 50),
       r"""Total for A $= 20 \times 60 = 1200$; total for B $= 30 \times 70 = 2100$.

Mean $= \dfrac{1200 + 2100}{50} = \dfrac{3300}{50} = 66$"""),
    mq("maths-averages-10", "Measures of Central Tendency",
       r"The mean of $x$, $x + 2$, $x + 4$ and $x + 6$ is 10. Find $x$.",
       (r"$7$", 7),
       [(r"$10$", 10, r"10 is the mean of the four numbers, not $x$."),
        (r"$13$", 13, r"You added 3 instead of subtracting it: the mean is $x + 3 = 10$.", lambda: 10 + 3),
        (r"$28$", 28, r"$4x = 28$, so you must still divide by 4.", lambda: 40 - 12)],
       lambda: sp.solve(sp.Eq((4 * sp.Symbol("x") + 12) / 4, 10))[0],
       r"""$\dfrac{x + (x + 2) + (x + 4) + (x + 6)}{4} = 10$

$4x + 12 = 40 \Rightarrow 4x = 28 \Rightarrow x = 7$"""),
    # ── Logarithms ───────────────────────────────────────────────────────
    mq("maths-logs-06", "Logarithms",
       r"Evaluate $\log_{2} 32$.",
       (r"$5$", 5),
       [(r"$1.505$", Rounded(math.log10(32), dp=3), r"1.505 is $\log_{10} 32$. The base here is 2.", lambda: math.log10(32)),
        (r"$6$", 6, r"$2^{6} = 64$, not 32."),
        (r"$16$", 16, r"You divided 32 by 2. A logarithm asks which power of 2 gives 32.", lambda: R(32, 2))],
       lambda: sp.log(32, 2),
       r"""$\log_{2} 32 = n$ means $2^{n} = 32$. Since $2^{5} = 32$, $\log_{2} 32 = 5$."""),
    mq("maths-logs-07", "Logarithms",
       r"Simplify $\log_{3} 54 - \log_{3} 2$.",
       (r"$3$", 3),
       [(r"$9$", 9, r"You divided 27 by 3. $\log_{3} 27 = 3$ because $3^{3} = 27$."),
        (r"$27$", 27, r"You stopped at $\frac{54}{2} = 27$. You still need $\log_{3} 27$.", lambda: R(54, 2)),
        (r"$\log_{3} 52$", sp.log(52, 3), r"You subtracted inside the logarithm. $\log a - \log b = \log\frac{a}{b}$.", lambda: sp.log(54 - 2, 3))],
       lambda: sp.log(R(54, 2), 3),
       r"""$\log_{3} 54 - \log_{3} 2 = \log_{3}\dfrac{54}{2} = \log_{3} 27 = 3$, since $3^{3} = 27$."""),
    mq("maths-logs-08", "Logarithms",
       r"Solve $\log x + \log 4 = \log 20$.",
       (r"$5$", 5),
       [(r"$16$", 16, r"You subtracted 4 from 20. $\log x + \log 4 = \log 4x$.", lambda: 20 - 4),
        (r"$24$", 24, r"You added. $\log x + \log 4 = \log 4x$, so $4x = 20$.", lambda: 20 + 4),
        (r"$80$", 80, r"You multiplied 20 by 4. From $4x = 20$, divide by 4.", lambda: 20 * 4)],
       lambda: sp.solve(sp.Eq(4 * sp.Symbol("x"), 20))[0],
       r"""$\log x + \log 4 = \log 4x$, so $\log 4x = \log 20$.

$4x = 20 \Rightarrow x = 5$"""),
    mq("maths-logs-09", "Logarithms",
       r"If $\log_{10} x = -2$, find $x$.",
       (r"$0.01$", R(1, 100)),
       [(r"$-100$", -100, r"A negative logarithm does not mean a negative number: $10^{-2} = \frac{1}{100}$."),
        (r"$-20$", -20, r"You multiplied 10 by $-2$. $\log_{10} x = -2$ means $x = 10^{-2}$.", lambda: 10 * -2),
        (r"$100$", 100, r"$100 = 10^{2}$. The index is $-2$, which gives the reciprocal.", lambda: 10**2)],
       lambda: sp.Integer(10) ** -2,
       r"""$\log_{10} x = -2$ means $x = 10^{-2} = \dfrac{1}{100} = 0.01$"""),
    mq("maths-logs-10", "Logarithms",
       r"Given that $\log_{10} 2 = 0.3010$, find $\log_{10} 5$ without using tables or a calculator.",
       (r"$0.6990$", Rounded(1 - 0.3010, dp=4)),
       [(r"$0.1505$", Rounded(0.3010 / 2, dp=4), r"You halved $\log 2$. Use $5 = \frac{10}{2}$.", lambda: 0.3010 / 2),
        (r"$0.6020$", Rounded(2 * 0.3010, dp=4), r"$0.6020$ is $\log 4 = 2\log 2$.", lambda: 2 * 0.3010),
        (r"$1.5050$", Rounded(5 * 0.3010, dp=4), r"You multiplied $\log 2$ by 5. $\log 5$ is not $5 \log 2$.", lambda: 5 * 0.3010)],
       lambda: 1 - 0.3010,
       r"""$\log 5 = \log\dfrac{10}{2} = \log 10 - \log 2 = 1 - 0.3010 = 0.6990$"""),
    # ── Modular arithmetic ───────────────────────────────────────────────
    mq("maths-modular-06", "Modular Arithmetic",
       r"Evaluate $25 + 18 \pmod{7}$.",
       (r"$1$", 1),
       [(r"$6$", 6, r"$43 \div 7 = 6$ remainder 1. The answer is the remainder, not the quotient.", lambda: 43 // 7),
        (r"$8$", 8, r"You reduced 25 and 18 to 4 and 4 but did not reduce their sum, 8, which is 1 in modulo 7.", lambda: 25 % 7 + 18 % 7),
        (r"$43$", 43, r"43 is not reduced. In modulo 7 the answer must be from 0 to 6.", lambda: 25 + 18)],
       lambda: (25 + 18) % 7,
       r"""$25 + 18 = 43$, and $43 = 6 \times 7 + 1$, so $25 + 18 \equiv 1 \pmod{7}$."""),
    mq("maths-modular-07", "Modular Arithmetic",
       r"It is now 9 o'clock on a 12-hour clock. What time will the clock show 50 hours from now?",
       (r"11 o'clock", 11),
       [(r"2 o'clock", 2, r"$50 \equiv 2 \pmod{12}$, but you forgot to add the starting time, 9 o'clock.", lambda: 50 % 12),
        (r"7 o'clock", 7, r"You subtracted 2 hours instead of adding them.", lambda: 9 - 50 % 12),
        (r"59 o'clock", 59, r"$9 + 50 = 59$ must be reduced modulo 12.", lambda: 9 + 50)],
       lambda: (9 + 50) % 12,
       r"""$9 + 50 = 59$, and $59 = 4 \times 12 + 11$, so the clock shows 11 o'clock."""),
    mq("maths-modular-08", "Modular Arithmetic",
       r"Solve $x + 5 \equiv 2 \pmod{6}$.",
       (r"$3$", 3),
       [(r"$-3$", -3, r"$2 - 5 = -3$, but in modulo 6 the answer must be from 0 to 5: $-3 + 6 = 3$.", lambda: 2 - 5),
        (r"$1$", 1, r"You added 5 instead of subtracting it: $2 + 5 = 7 \equiv 1$.", lambda: (2 + 5) % 6),
        (r"$9$", 9, r"$9 \equiv 3 \pmod{6}$, so 9 is not reduced.", lambda: 2 - 5 + 12)],
       lambda: (2 - 5) % 6,
       r"""$x \equiv 2 - 5 = -3 \equiv -3 + 6 = 3 \pmod{6}$

Check: $3 + 5 = 8 \equiv 2 \pmod{6}$. ✓"""),
    mq("maths-modular-09", "Modular Arithmetic",
       r"In modulo 4, find the multiplicative inverse of 3, that is, the number $y$ such that $3 \times y \equiv 1 \pmod{4}$.",
       (r"$3$", 3),
       [(r"$0$", 0, r"$3 \times 0 = 0$, not 1."),
        (r"$1$", 1, r"1 is the identity element. $3 \times 1 = 3$, not 1."),
        (r"$2$", 2, r"$3 \times 2 = 6 \equiv 2 \pmod{4}$, not 1.")],
       lambda: next(k for k in range(4) if (3 * k) % 4 == 1),
       r"""Try each value: $3 \times 3 = 9 = 2 \times 4 + 1 \equiv 1 \pmod{4}$. So the inverse of 3 is 3."""),
    mq("maths-modular-10", "Modular Arithmetic",
       r"A watchman is on night duty every 6th day. He was on duty on a Tuesday. On what day of the week will his 5th duty after that be?",
       (r"Thursday", "Thursday"),
       [(r"Tuesday", "Tuesday", r"You worked in modulo 6 ($30 \equiv 0$). Days of the week repeat every 7 days, so use modulo 7."),
        (r"Friday", "Friday", r"You counted only 4 steps of 6 days (24 days). The 5th duty after Tuesday is 30 days later.", lambda: DAYS[(1 + 24) % 7]),
        (r"Sunday", "Sunday", r"You counted backwards. $30 \equiv 2 \pmod{7}$, so move 2 days forward from Tuesday.", lambda: DAYS[(1 - 2) % 7])],
       lambda: DAYS[(DAYS.index("Tuesday") + 5 * 6) % 7],
       r"""The 5th duty is $5 \times 6 = 30$ days later. $30 = 4 \times 7 + 2$, so it falls 2 days after Tuesday: Thursday.""",
       order=["Tuesday", "Thursday", "Friday", "Sunday"]),
    # ── Vectors ──────────────────────────────────────────────────────────
    mq("maths-vectors-06", "Vectors",
       rf"Given that $\mathbf{{a}} = $ {col(2, -3)} and $\mathbf{{b}} = $ {col(-1, 4)}, find $3\mathbf{{a}} - 2\mathbf{{b}}$.",
       (col(8, -17), (8, -17)),
       [(col(4, -1), (4, -1), r"You added $2\mathbf{b}$ instead of subtracting it.", lambda: (3 * 2 + 2 * -1, 3 * -3 + 2 * 4)),
        (col(7, -13), (7, -13), r"You subtracted $\mathbf{b}$, not $2\mathbf{b}$.", lambda: (3 * 2 - (-1), 3 * -3 - 4)),
        (col(8, -1), (8, -1), r"In the bottom entry, $-9 - 8 = -17$, not $-1$.", lambda: (3 * 2 - 2 * -1, 3 * -3 + 8))],
       lambda: (3 * 2 - 2 * -1, 3 * -3 - 2 * 4),
       r"""$3\mathbf{a} = \begin{pmatrix} 6 \\ -9 \end{pmatrix}$, $2\mathbf{b} = \begin{pmatrix} -2 \\ 8 \end{pmatrix}$

$3\mathbf{a} - 2\mathbf{b} = \begin{pmatrix} 6 - (-2) \\ -9 - 8 \end{pmatrix} = \begin{pmatrix} 8 \\ -17 \end{pmatrix}$"""),
    mq("maths-vectors-07", "Vectors",
       rf"The position vectors of $A$ and $B$ are $\overrightarrow{{OA}} = $ {col(4, 6)} and $\overrightarrow{{OB}} = $ {col(-2, 2)}. Find the position vector of the mid-point of $AB$.",
       (col(1, 4), (1, 4)),
       [(col(-3, -2), (-3, -2), r"That is half of $\overrightarrow{AB}$. The mid-point is the average of the two position vectors.", lambda: ((-2 - 4) / 2, (2 - 6) / 2)),
        (col(2, 8), (2, 8), r"You added the vectors but did not halve the sum.", lambda: (4 + -2, 6 + 2)),
        (col(3, 2), (3, 2), r"You halved $\overrightarrow{OA} - \overrightarrow{OB}$. Add the vectors, then halve.", lambda: ((4 - -2) / 2, (6 - 2) / 2))],
       lambda: (R(4 + -2, 2), R(6 + 2, 2)),
       r"""Mid-point $= \dfrac{1}{2}(\overrightarrow{OA} + \overrightarrow{OB}) = \dfrac{1}{2}\begin{pmatrix} 2 \\ 8 \end{pmatrix} = \begin{pmatrix} 1 \\ 4 \end{pmatrix}$"""),
    mq("maths-vectors-08", "Vectors",
       rf"Find $x$ and $y$ if {col('x + 2', 5)} $=$ {col(7, 'y - 1')}.",
       (r"$x = 5$, $y = 6$", "x=5,y=6"),
       [(r"$x = 9$, $y = 4$", "x=9,y=4", r"You added 2 to 7 and subtracted 1 from 5. Undo each operation: $x = 7 - 2$ and $y = 5 + 1$."),
        (r"$x = 5$, $y = 4$", "x=5,y=4", r"From $y - 1 = 5$, add 1: $y = 6$."),
        (r"$x = 9$, $y = 6$", "x=9,y=6", r"From $x + 2 = 7$, subtract 2: $x = 5$.")],
       lambda: f"x={7 - 2},y={5 + 1}",
       r"""Equal vectors have equal entries: $x + 2 = 7$, so $x = 5$; and $5 = y - 1$, so $y = 6$."""),
    mq("maths-vectors-09", "Vectors",
       rf"Given that $\mathbf{{p}} = $ {col(3, 4)}, find $|2\mathbf{{p}}|$.",
       (r"$10$", 10),
       [(r"$5$", 5, r"5 is $|\mathbf{p}|$. Doubling the vector doubles its length.", lambda: sp.sqrt(3**2 + 4**2)),
        (r"$14$", 14, r"You added the entries of $2\mathbf{p}$, $6 + 8$. Use Pythagoras.", lambda: 6 + 8),
        (r"$25$", 25, r"25 is $|\mathbf{p}|^{2}$. Take the square root, then double.", lambda: 3**2 + 4**2)],
       lambda: sp.sqrt(6**2 + 8**2),
       r"""$2\mathbf{p} = \begin{pmatrix} 6 \\ 8 \end{pmatrix}$, so $|2\mathbf{p}| = \sqrt{6^{2} + 8^{2}} = \sqrt{100} = 10$."""),
    mq("maths-vectors-10", "Vectors",
       r"$O$ is the origin, $\overrightarrow{OA} = a$ and $\overrightarrow{OB} = b$. Express $\overrightarrow{AB}$ in terms of $a$ and $b$.",
       (r"$b - a$", b_ - a_),
       [(r"$a - b$", a_ - b_, r"That is $\overrightarrow{BA}$. To go from $A$ to $B$, go back to $O$ ($-a$) then out to $B$ ($+b$)."),
        (r"$a + b$", a_ + b_, r"Going from $A$ to $O$ is $-a$, not $+a$."),
        (r"$\frac{1}{2}(a + b)$", (a_ + b_) / 2, r"That is the position vector of the mid-point of $AB$.")],
       lambda: -a_ + b_,
       r"""$\overrightarrow{AB} = \overrightarrow{AO} + \overrightarrow{OB} = -a + b = b - a$"""),
]
