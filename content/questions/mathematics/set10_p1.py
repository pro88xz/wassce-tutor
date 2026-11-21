"""Mathematics practice set 2 (part 5): 30 more original Paper 1 questions on Similar and Congruent Figures, Loci, Construction, Financial Arithmetic, Differentiation and Integration.

Written by WASSCE Tutor in the style of WASSCE Paper 1 (four options, A-D). Nothing
here is copied from a WAEC paper. Each topic's first five questions are in
set5_p1.py; these test different skills and mistakes. Every answer is worked out by
code, and every wrong option is a mistake a candidate really makes. See SCOPE.md.

Run `python3 scripts/questions/build.py` to check every answer and rebuild.
"""

import sys
from pathlib import Path

import sympy as sp

sys.path.insert(0, str(Path(__file__).resolve().parent))

from maths_common import make  # noqa: E402
from qbank import R  # noqa: E402

TOPICS = {
    "Similar and Congruent Figures": "D(c)(iii),(vi) Similar and congruent triangles; ratio of sides and areas; scale",
    "Loci": "D(f) Loci in two dimensions and their intersections",
    "Construction": "D(e) Constructions with ruler and compasses: bisectors, angles, triangles",
    "Financial Arithmetic": "A(n) Financial arithmetic: depreciation, shares and bonds, hire purchase",
    "Differentiation": "G(i) Differentiation of algebraic functions; gradients, maximum/minimum, rates",
    "Integration": "G(ii) Integration of simple algebraic functions; definite integrals",
}

mq = make(TOPICS)
x = sp.Symbol("x")
c = sp.Symbol("c")
t = sp.Symbol("t")


def constructible(angle) -> bool:
    """Ruler-and-compass angles in school geometry: multiples of 7.5° (from 60°, 90° and bisection)."""
    return sp.Rational(angle) % sp.Rational(15, 2) == 0


QUESTIONS = [
    # ── Similar and congruent figures ────────────────────────────────────
    mq("maths-similar-06", "Similar and Congruent Figures",
       r"Two right-angled triangles have equal hypotenuses, and one other side of the first equals one side of the second. Which condition shows they are congruent?",
       (r"RHS (right angle, hypotenuse, side)", "RHS"),
       [(r"AAA (three angles)", "AAA", r"Equal angles show triangles are similar, not that they are the same size."),
        (r"SAS (two sides and the included angle)", "SAS", r"The equal side and hypotenuse do not enclose a known equal angle here, so SAS does not apply directly."),
        (r"ASA (two angles and the included side)", "ASA", r"Only one angle (the right angle) is known to be equal.")],
       lambda: "RHS",
       r"""For right-angled triangles, a right angle, the hypotenuse and one other side equal (RHS) is enough to prove congruence."""),
    mq("maths-similar-07", "Similar and Congruent Figures",
       r"On a map with a scale of 1 : 20 000, a rectangular field measures 3 cm by 2 cm. Find the real area of the field in hectares. (1 hectare = 10 000 m²)",
       (r"$24$ hectares", 24),
       [(r"$2.4$ hectares", R(12, 5), r"Check the conversion: 240 000 m² $\div$ 10 000 = 24 hectares.", lambda: R(240000, 100000)),
        (r"$12$ hectares", 12, r"You multiplied the map area (6 cm²) by 20 000 once. Areas scale by the square of the scale factor.", lambda: R(6 * 20000 * 10000, 10000 * 10000)),
        (r"$240$ hectares", 240, r"1 hectare is 10 000 m², not 1 000 m².", lambda: R(240000, 1000))],
       lambda: R((3 * 20000 // 100) * (2 * 20000 // 100), 10000),
       r"""Real lengths: $3 \times 20\,000 = 60\,000$ cm $= 600$ m and $2 \times 20\,000 = 40\,000$ cm $= 400$ m.

Area $= 600 \times 400 = 240\,000$ m² $= 24$ hectares."""),
    mq("maths-similar-08", "Similar and Congruent Figures",
       r"At the same time of day, a vertical stick 1.5 m tall casts a shadow 2 m long, and a tree casts a shadow 12 m long. Find the height of the tree.",
       (r"$9$ m", 9),
       [(r"$10.5$ m", R(21, 2), r"You subtracted 1.5 from 12. The shapes are similar, so use a ratio.", lambda: 12 - R(3, 2)),
        (r"$11.5$ m", R(23, 2), r"You subtracted the difference between the stick and its shadow. Use the ratio height : shadow.", lambda: 12 - R(1, 2)),
        (r"$16$ m", 16, r"You used shadow ÷ height for the stick. Height ÷ shadow $= \frac{1.5}{2}$.", lambda: 12 * R(2, R(3, 2)))],
       lambda: 12 * R(R(3, 2), 2),
       r"""The stick and the tree make similar triangles with their shadows:

$\dfrac{h}{12} = \dfrac{1.5}{2} \Rightarrow h = 12 \times 0.75 = 9$ m"""),
    mq("maths-similar-09", "Similar and Congruent Figures",
       r"Two similar triangles have areas of 25 cm² and 64 cm². The perimeter of the smaller triangle is 20 cm. Find the perimeter of the larger triangle.",
       (r"$32$ cm", 32),
       [(r"$12.5$ cm", R(25, 2), r"You used the ratio the wrong way round. The larger triangle has the larger perimeter.", lambda: 20 * R(5, 8)),
        (r"$23$ cm", 23, r"You added the difference of the square roots. Lengths are in the ratio $5 : 8$.", lambda: 20 + (8 - 5)),
        (r"$51.2$ cm", R(256, 5), r"You used the ratio of the areas, $\frac{64}{25}$. Lengths use its square root, $\frac{8}{5}$.", lambda: 20 * R(64, 25))],
       lambda: 20 * sp.sqrt(R(64, 25)),
       r"""Ratio of areas $= 25 : 64$, so the ratio of lengths $= \sqrt{25} : \sqrt{64} = 5 : 8$.

Perimeter of the larger $= 20 \times \dfrac{8}{5} = 32$ cm"""),
    mq("maths-similar-10", "Similar and Congruent Figures",
       r"Two similar solids have volumes of 8 cm³ and 27 cm³. Find the ratio of their surface areas.",
       (r"$4 : 9$", "4:9"),
       [(r"$2 : 3$", "2:3", r"$2 : 3$ is the ratio of their lengths. Areas are in the ratio of the squares."),
        (r"$8 : 27$", "8:27", r"$8 : 27$ is the ratio of the volumes."),
        (r"$16 : 81$", "16:81", r"You squared the volume ratio's cube roots twice. Areas: $(2 : 3)^{2} = 4 : 9$.")],
       lambda: (lambda k: f"{k[0] ** 2}:{k[1] ** 2}")((sp.root(8, 3), sp.root(27, 3))),
       r"""Ratio of lengths $= \sqrt[3]{8} : \sqrt[3]{27} = 2 : 3$.

Ratio of areas $= 2^{2} : 3^{2} = 4 : 9$"""),
    # ── Loci ─────────────────────────────────────────────────────────────
    mq("maths-loci-06", "Loci",
       r"The point inside a triangle that is equidistant from all three sides is where",
       (r"the bisectors of the angles meet", "the bisectors of the angles meet"),
       [(r"the perpendicular bisectors of the sides meet", "the perpendicular bisectors of the sides meet", r"That point is equidistant from the three vertices (corners), not the sides."),
        (r"the medians meet", "the medians meet", r"The medians meet at the centre of mass, which is not equidistant from the sides in general."),
        (r"the altitudes meet", "the altitudes meet", r"The altitudes meet at a point that is not, in general, equidistant from the sides.")],
       lambda: "the bisectors of the angles meet",
       r"""The locus of points equidistant from two lines is the bisector of the angle between them. The point equidistant from all three sides lies on all three angle bisectors. (It is the centre of the circle that touches all three sides.)"""),
    mq("maths-loci-07", "Loci",
       r"The point that is equidistant from the three vertices of a triangle is where",
       (r"the perpendicular bisectors of the sides meet", "the perpendicular bisectors of the sides meet"),
       [(r"the bisectors of the angles meet", "the bisectors of the angles meet", r"That point is equidistant from the three sides, not the vertices."),
        (r"the medians meet", "the medians meet", r"The medians meet at the centre of mass, which is not equidistant from the vertices in general."),
        (r"the altitudes meet", "the altitudes meet", r"The altitudes do not, in general, meet at a point equidistant from the vertices.")],
       lambda: "the perpendicular bisectors of the sides meet",
       r"""Points equidistant from two vertices lie on the perpendicular bisector of the side joining them. The point on all three perpendicular bisectors is equidistant from all three vertices (the centre of the circle through them)."""),
    mq("maths-loci-08", "Loci",
       r"A goat is tied to a post in an open field by a rope 5 m long. Which describes the region the goat can graze?",
       (r"The inside of a circle of radius 5 m with centre at the post", "circle of radius 5 m"),
       [(r"A straight line 5 m long", "straight line", r"The goat can move in every direction, not just along a line."),
        (r"A square of side 5 m", "square", r"Every point the goat can reach is at most 5 m from the post, which describes a circle."),
        (r"The inside of a circle of radius 10 m", "circle of radius 10 m", r"10 m is the diameter. The radius is the length of the rope, 5 m.")],
       lambda: "circle of radius 5 m",
       r"""Every point within 5 m of the post can be reached: the inside of a circle, centre the post, radius 5 m."""),
    mq("maths-loci-09", "Loci",
       r"Which line is the locus of points equidistant from $A(1, 0)$ and $B(5, 0)$?",
       (r"$x = 3$", "x=3"),
       [(r"$y = 3$", "y=3", r"The locus is perpendicular to $AB$, which lies along the $x$-axis, so it is a vertical line $x = \ldots$"),
        (r"$x = 2$", "x=2", r"2 is half the distance $AB$. The mid-point is at $x = \frac{1 + 5}{2} = 3$."),
        (r"$x = 6$", "x=6", r"You added the $x$-coordinates without halving.")],
       lambda: f"x={R(1 + 5, 2)}",
       r"""The locus is the perpendicular bisector of $AB$. The mid-point of $AB$ is $(3, 0)$, and $AB$ is horizontal, so the bisector is the vertical line $x = 3$."""),
    mq("maths-loci-10", "Loci",
       r"What is the locus of points equidistant from the parallel lines $y = 1$ and $y = 7$?",
       (r"$y = 4$", "y=4"),
       [(r"$y = 3$", "y=3", r"3 is half the distance between the lines. Add it to 1: $y = 4$."),
        (r"$y = 6$", "y=6", r"6 is the distance between the lines, not the line halfway between them."),
        (r"$y = 8$", "y=8", r"You added 1 and 7 without halving.")],
       lambda: f"y={R(1 + 7, 2)}",
       r"""The locus is the line halfway between them: $y = \dfrac{1 + 7}{2} = 4$."""),
    # ── Construction ─────────────────────────────────────────────────────
    mq("maths-construction-06", "Construction",
       r"Which of these angles CAN be constructed using only a ruler and a pair of compasses?",
       (r"15°", 15),
       [(r"20°", 20, r"20° cannot be made from 60° and 90° by bisecting, adding or subtracting."),
        (r"50°", 50, r"50° cannot be made from 60° and 90° by bisecting, adding or subtracting."),
        (r"70°", 70, r"70° cannot be made from 60° and 90° by bisecting, adding or subtracting.")],
       lambda: next(k for k in [15, 20, 50, 70] if constructible(k)),
       r"""Constructible angles come from 60° and 90° by bisecting, adding and subtracting. $15°$ is $60°$ bisected twice ($60° \to 30° \to 15°$)."""),
    mq("maths-construction-07", "Construction",
       r"How is an angle of 45° constructed with ruler and compasses?",
       (r"Construct 90° and bisect it", "Construct 90 and bisect it"),
       [(r"Construct 60° and bisect it", "Construct 60 and bisect it", r"Bisecting 60° gives 30°."),
        (r"Bisect an angle of 120°", "Bisect an angle of 120", r"Bisecting 120° gives 60°."),
        (r"Construct 60° and subtract 30° from 90°", "Construct 60 and subtract 30 from 90", r"$90° - 30° = 60°$, not 45°.")],
       lambda: "Construct 90 and bisect it",
       r"""Construct a perpendicular (90°), then bisect it: $90° \div 2 = 45°$."""),
    mq("maths-construction-08", "Construction",
       r"When bisecting an angle with ruler and compasses, what is the first step after drawing the angle?",
       (r"With centre at the vertex, draw an arc cutting both arms", "With centre at the vertex, draw an arc cutting both arms"),
       [(r"Draw a line from the vertex at 45° to one arm", "Draw a line from the vertex at 45 to one arm", r"Measuring 45° needs a protractor, and the bisector depends on the size of the angle."),
        (r"With centre at the end of one arm, draw a circle through the vertex", "With centre at the end of one arm, draw a circle through the vertex", r"The arcs are drawn from the vertex first, so that they mark equal distances on both arms."),
        (r"Join the ends of the two arms", "Join the ends of the two arms", r"The arms can be of any length, so joining their ends does not help find the bisector.")],
       lambda: "With centre at the vertex, draw an arc cutting both arms",
       r"""1. With centre at the vertex, draw an arc cutting both arms.
2. From each of those points, draw arcs of equal radius that cross.
3. Join the vertex to the crossing point: this line bisects the angle."""),
    mq("maths-construction-09", "Construction",
       r"The perpendicular bisector of a line segment $AB$",
       (r"passes through the mid-point of $AB$ at right angles to $AB$", "passes through the mid-point of AB at right angles to AB"),
       [(r"passes through $A$ at right angles to $AB$", "passes through A at right angles to AB", r"A perpendicular at $A$ does not bisect $AB$."),
        (r"passes through the mid-point of $AB$ at 60° to $AB$", "passes through the mid-point of AB at 60 to AB", r"A perpendicular bisector meets $AB$ at 90°."),
        (r"passes through $B$, parallel to $AB$", "passes through B, parallel to AB", r"A parallel line never meets $AB$, so it cannot bisect it.")],
       lambda: "passes through the mid-point of AB at right angles to AB",
       r"""The perpendicular bisector cuts $AB$ into two equal halves and is at right angles to it. Every point on it is equidistant from $A$ and $B$."""),
    mq("maths-construction-10", "Construction",
       r"To construct a line through a point $P$ parallel to a given line $AB$, one method is to",
       (r"copy an angle so that equal corresponding angles are formed at $P$", "copy an angle so that equal corresponding angles are formed at P"),
       [(r"bisect $AB$ and join the mid-point to $P$", "bisect AB and join the mid-point to P", r"The line from the mid-point to $P$ generally crosses $AB$; it is not parallel."),
        (r"draw a circle with centre $P$ passing through $A$", "draw a circle with centre P passing through A", r"A circle alone does not give a line parallel to $AB$."),
        (r"construct an angle of 60° at $A$", "construct an angle of 60 at A", r"An angle at $A$ gives a line through $A$, not through $P$.")],
       lambda: "copy an angle so that equal corresponding angles are formed at P",
       r"""Draw any line through $P$ that cuts $AB$. Copy the angle it makes with $AB$ at $P$, in the corresponding position. Equal corresponding angles mean the new line is parallel to $AB$."""),
    # ── Financial arithmetic ─────────────────────────────────────────────
    mq("maths-financial-06", "Financial Arithmetic",
       r"A salesman earns 5% commission on his sales. In one month he sells goods worth Le 24,000. Find his commission.",
       (r"Le 1,200", 1200),
       [(r"Le 120", 120, r"That is 0.5% of the sales. 5% means $\frac{5}{100}$.", lambda: 24000 * R(5, 1000)),
        (r"Le 4,800", 4800, r"You divided the sales by 5. 5% is one-twentieth, not one-fifth.", lambda: R(24000, 5)),
        (r"Le 22,800", 22800, r"That is the sales minus the commission.", lambda: 24000 - 1200)],
       lambda: 24000 * R(5, 100),
       r"""Commission $= \dfrac{5}{100} \times 24\,000 = $ Le 1,200"""),
    mq("maths-financial-07", "Financial Arithmetic",
       r"A phone has a cash price of Le 3,000. On hire purchase it costs a deposit of Le 500 and 10 monthly instalments of Le 300. How much more does a buyer pay on hire purchase than for cash?",
       (r"Le 500", 500),
       [(r"Le 300", 300, r"Le 300 is one instalment, not the extra cost."),
        (r"Le 3,000", 3000, r"Le 3,000 is the total of the instalments alone.", lambda: 10 * 300),
        (r"Le 3,500", 3500, r"Le 3,500 is the total hire purchase price. Subtract the cash price.", lambda: 500 + 10 * 300)],
       lambda: 500 + 10 * 300 - 3000,
       r"""Hire purchase price $= 500 + 10 \times 300 = $ Le 3,500.

Extra cost $= 3\,500 - 3\,000 = $ Le 500"""),
    mq("maths-financial-08", "Financial Arithmetic",
       r"A radio costs Le 400 before value added tax (VAT) of 15% is added. Find its price including VAT.",
       (r"Le 460", 460),
       [(r"Le 60", 60, r"Le 60 is the VAT alone. Add it to the price.", lambda: 400 * R(15, 100)),
        (r"Le 340", 340, r"You subtracted the VAT. VAT is added to the price.", lambda: 400 - 60),
        (r"Le 415", 415, r"You added Le 15, not 15%.", lambda: 400 + 15)],
       lambda: 400 * R(115, 100),
       r"""VAT $= 15\%$ of Le 400 $= $ Le 60. Price including VAT $= 400 + 60 = $ Le 460."""),
    mq("maths-financial-09", "Financial Arithmetic",
       r"A machine bought for Le 10,000 depreciates by 10% each year on the reducing balance. Find its value after 2 years.",
       (r"Le 8,100", 8100),
       [(r"Le 1,900", 1900, r"Le 1,900 is the total depreciation, not the value.", lambda: 10000 - 8100),
        (r"Le 8,000", 8000, r"That is straight-line depreciation (Le 1,000 each year). On the reducing balance, the second year's 10% is of Le 9,000.", lambda: 10000 - 2 * 1000),
        (r"Le 9,000", 9000, r"That is the value after only 1 year.", lambda: 10000 * R(9, 10))],
       lambda: 10000 * R(9, 10) ** 2,
       r"""After 1 year: $10\,000 \times 0.9 = 9\,000$. After 2 years: $9\,000 \times 0.9 = 8\,100$.

Value $= $ Le 8,100"""),
    mq("maths-financial-10", "Financial Arithmetic",
       r"A man earns Le 30,000 a year. The first Le 10,000 is free of tax and the rest is taxed at 20%. How much tax does he pay?",
       (r"Le 4,000", 4000),
       [(r"Le 2,000", 2000, r"You taxed the tax-free Le 10,000 instead of the rest.", lambda: 10000 * R(20, 100)),
        (r"Le 6,000", 6000, r"You taxed the whole income. The first Le 10,000 is tax-free.", lambda: 30000 * R(20, 100)),
        (r"Le 26,000", 26000, r"Le 26,000 is his income after tax.", lambda: 30000 - 4000)],
       lambda: (30000 - 10000) * R(20, 100),
       r"""Taxable income $= 30\,000 - 10\,000 = $ Le 20,000.

Tax $= 20\%$ of Le 20,000 $= $ Le 4,000"""),
    # ── Differentiation ──────────────────────────────────────────────────
    mq("maths-differentiation-06", "Differentiation",
       r"Find $\dfrac{dy}{dx}$ if $y = (2x + 1)^{2}$.",
       (r"$8x + 4$", 8 * x + 4),
       [(r"$4x + 2$", 4 * x + 2, r"You wrote $2(2x + 1)$ and forgot the factor 2 from inside the bracket. Expand first: $4x^{2} + 4x + 1$.", lambda: 2 * (2 * x + 1)),
        (r"$4x + 4$", 4 * x + 4, r"Expanding gives $4x^{2} + 4x + 1$; the derivative of $4x^{2}$ is $8x$, not $4x$."),
        (r"$4x^{2} + 4x$", 4 * x**2 + 4 * x, r"That is $y - 1$, not its derivative.")],
       lambda: sp.diff((2 * x + 1) ** 2, x),
       r"""Expand: $y = 4x^{2} + 4x + 1$. Then $\dfrac{dy}{dx} = 8x + 4$."""),
    mq("maths-differentiation-07", "Differentiation",
       r"Find $\dfrac{dy}{dx}$ if $y = \dfrac{4}{x^{2}}$.",
       (r"$-\dfrac{8}{x^{3}}$", -8 / x**3),
       [(r"$\dfrac{8}{x^{3}}$", 8 / x**3, r"$y = 4x^{-2}$; bringing down the power $-2$ makes the answer negative."),
        (r"$-\dfrac{8}{x}$", -8 / x, r"Subtract 1 from the power: $-2 - 1 = -3$, not $-1$.", lambda: -8 * x ** (-2 + 1)),
        (r"$\dfrac{4}{2x}$", 4 / (2 * x), r"You differentiated the bottom only. Write $y = 4x^{-2}$ first.")],
       lambda: sp.diff(4 / x**2, x),
       r"""$y = 4x^{-2}$, so $\dfrac{dy}{dx} = 4 \times (-2)x^{-3} = -8x^{-3} = -\dfrac{8}{x^{3}}$"""),
    mq("maths-differentiation-08", "Differentiation",
       r"Find the maximum value of $y = 6x - x^{2}$.",
       (r"$9$", 9),
       [(r"$-9$", -9, r"At $x = 3$, $y = 18 - 9 = +9$."),
        (r"$3$", 3, r"3 is the value of $x$ at the maximum, not the maximum value of $y$."),
        (r"$18$", 18, r"You worked out only $6x$ at $x = 3$; subtract $x^{2} = 9$.", lambda: 6 * 3)],
       lambda: (6 * x - x**2).subs(x, sp.solve(sp.diff(6 * x - x**2, x), x)[0]),
       r"""$\dfrac{dy}{dx} = 6 - 2x = 0 \Rightarrow x = 3$.

$y = 6(3) - 3^{2} = 18 - 9 = 9$. (It is a maximum because the $x^{2}$ term is negative.)"""),
    mq("maths-differentiation-09", "Differentiation",
       r"A particle moves so that its distance in metres after $t$ seconds is $s = 2t^{3} - 5t$. Find its acceleration when $t = 2$.",
       (r"$24$ m/s²", 24),
       [(r"$6$ m/s²", 6, r"6 is the distance $s$ at $t = 2$. Acceleration is the second derivative.", lambda: (2 * t**3 - 5 * t).subs(t, 2)),
        (r"$12$ m/s²", 12, r"$\frac{dv}{dt} = 12t$; substitute $t = 2$.", lambda: 12),
        (r"$19$ m/s²", 19, r"19 m/s is the velocity at $t = 2$. Differentiate once more for acceleration.", lambda: sp.diff(2 * t**3 - 5 * t, t).subs(t, 2))],
       lambda: sp.diff(2 * t**3 - 5 * t, t, 2).subs(t, 2),
       r"""Velocity $v = \dfrac{ds}{dt} = 6t^{2} - 5$. Acceleration $a = \dfrac{dv}{dt} = 12t$.

At $t = 2$: $a = 24$ m/s²"""),
    mq("maths-differentiation-10", "Differentiation",
       r"At what value of $x$ is the gradient of the curve $y = x^{2} - 6x + 2$ equal to 4?",
       (r"$5$", 5),
       [(r"$-1$", -1, r"From $2x - 6 = 4$, $2x = 10$; you subtracted 6 instead of adding it.", lambda: R(4 - 6, 2)),
        (r"$2$", 2, r"You left out the $-6$: $2x = 4$.", lambda: R(4, 2)),
        (r"$3$", 3, r"At $x = 3$ the gradient is 0 (the turning point), not 4.", lambda: R(6, 2))],
       lambda: sp.solve(sp.diff(x**2 - 6 * x + 2, x) - 4, x)[0],
       r"""Gradient $= \dfrac{dy}{dx} = 2x - 6$. Set $2x - 6 = 4 \Rightarrow 2x = 10 \Rightarrow x = 5$."""),
    # ── Integration ──────────────────────────────────────────────────────
    mq("maths-integration-06", "Integration",
       r"Find $\displaystyle\int (4x^{3} - 2x)\, dx$.",
       (r"$x^{4} - x^{2} + c$", x**4 - x**2 + c),
       [(r"$12x^{2} - 2 + c$", 12 * x**2 - 2 + c, r"You differentiated instead of integrating."),
        (r"$x^{4} - 2x^{2} + c$", x**4 - 2 * x**2 + c, r"$\int 2x\, dx = \frac{2x^{2}}{2} = x^{2}$: divide by the new power."),
        (r"$4x^{4} - 2x^{2} + c$", 4 * x**4 - 2 * x**2 + c, r"You raised the powers but did not divide by them.")],
       lambda: sp.integrate(4 * x**3 - 2 * x, x) + c,
       r"""Add 1 to each power and divide by the new power:

$\int 4x^{3}\, dx = \dfrac{4x^{4}}{4} = x^{4}$ and $\int 2x\, dx = \dfrac{2x^{2}}{2} = x^{2}$.

$\int (4x^{3} - 2x)\, dx = x^{4} - x^{2} + c$"""),
    mq("maths-integration-07", "Integration",
       r"Evaluate $\displaystyle\int_{0}^{3} (2x + 1)\, dx$.",
       (r"$12$", 12),
       [(r"$2$", 2, r"2 is the derivative of $2x + 1$. Integrate: $x^{2} + x$.", lambda: sp.diff(2 * x + 1, x)),
        (r"$7$", 7, r"7 is the value of $2x + 1$ at $x = 3$. Integrate first, then substitute the limits.", lambda: 2 * 3 + 1),
        (r"$9$", 9, r"You integrated $2x$ to $x^{2}$ but left out the integral of 1, which is $x$.", lambda: 3**2)],
       lambda: sp.integrate(2 * x + 1, (x, 0, 3)),
       r"""$\displaystyle\int_{0}^{3} (2x + 1)\, dx = \Big[x^{2} + x\Big]_{0}^{3} = (9 + 3) - 0 = 12$"""),
    mq("maths-integration-08", "Integration",
       r"Find the area enclosed by the curve $y = 4 - x^{2}$, the $x$-axis and the lines $x = 0$ and $x = 2$.",
       (r"$\frac{16}{3}$ square units", R(16, 3)),
       [(r"$\frac{8}{3}$ square units", R(8, 3), r"That is $\int_{0}^{2} x^{2}\, dx$ alone. Integrate the whole of $4 - x^{2}$.", lambda: sp.integrate(x**2, (x, 0, 2))),
        (r"$4$ square units", 4, r"4 is the height of the curve at $x = 0$, not the area under it."),
        (r"$8$ square units", 8, r"You integrated only the 4, leaving out $-\frac{x^{3}}{3}$.", lambda: 4 * 2)],
       lambda: sp.integrate(4 - x**2, (x, 0, 2)),
       r"""Area $= \displaystyle\int_{0}^{2} (4 - x^{2})\, dx = \Big[4x - \frac{x^{3}}{3}\Big]_{0}^{2} = 8 - \frac{8}{3} = \frac{16}{3}$ square units"""),
    mq("maths-integration-09", "Integration",
       r"Given that $\dfrac{dy}{dx} = 6x^{2}$ and $y = 10$ when $x = 1$, find $y$ when $x = 2$.",
       (r"$24$", 24),
       [(r"$8$", 8, r"8 is the constant of integration, not the value of $y$ at $x = 2$."),
        (r"$16$", 16, r"You left out the constant of integration: $y = 2x^{3} + 8$.", lambda: 2 * 2**3),
        (r"$26$", 26, r"You took the constant as 10. From $10 = 2(1)^{3} + c$, $c = 8$.", lambda: 2 * 2**3 + 10)],
       lambda: (lambda C: 2 * 2**3 + C)(sp.solve(2 * 1**3 + c - 10, c)[0]),
       r"""$y = \int 6x^{2}\, dx = 2x^{3} + c$. When $x = 1$, $y = 10$: $10 = 2 + c$, so $c = 8$.

When $x = 2$: $y = 2(8) + 8 = 24$"""),
    mq("maths-integration-10", "Integration",
       r"Find $\displaystyle\int (x + 1)(x - 1)\, dx$.",
       (r"$\frac{x^{3}}{3} - x + c$", x**3 / 3 - x + c),
       [(r"$x^{3} - x + c$", x**3 - x + c, r"$\int x^{2}\, dx = \frac{x^{3}}{3}$: divide by the new power."),
        (r"$\frac{x^{3}}{3} + x + c$", x**3 / 3 + x + c, r"$(x + 1)(x - 1) = x^{2} - 1$, so the second term is $-x$."),
        (r"$2x + c$", 2 * x + c, r"You differentiated $x^{2} - 1$ instead of integrating it.")],
       lambda: sp.integrate(sp.expand((x + 1) * (x - 1)), x) + c,
       r"""Expand first: $(x + 1)(x - 1) = x^{2} - 1$.

$\int (x^{2} - 1)\, dx = \dfrac{x^{3}}{3} - x + c$"""),
]
