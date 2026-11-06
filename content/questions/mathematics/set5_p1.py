"""Mathematics (Core) set 5: 30 original Paper 1 questions on the last six topics.

Written by WASSCE Tutor in the style of WASSCE Paper 1. Nothing here is copied
from a WAEC paper. Similar figures, loci and construction are on the Sierra
Leone papers and in the Ministry's handbooks. Financial arithmetic and
introductory calculus are in the WAEC syllabus but were not set in the 2018 or
2019 Sierra Leone papers, so they are lower priority (see SCOPE.md).

Run `python3 scripts/questions/build.py` to check everything and rebuild.
"""

import sympy as sp

from diagram import ASK, Fig, dist
from qbank import Q, R, Rounded, Wrong

TOPICS = {
    "Similar and Congruent Figures": "D(c)(iii),(vi) Similar and congruent triangles; ratio of sides and areas; scale",
    "Loci": "D(f) Loci in two dimensions and their intersections",
    "Construction": "D(e) Constructions with ruler and compasses: bisectors, angles, triangles",
    "Financial Arithmetic": "A(n) Financial arithmetic: depreciation, shares and bonds, hire purchase",
    "Differentiation": "G(i) Differentiation of algebraic functions; gradients, maximum/minimum, rates",
    "Integration": "G(ii) Integration of simple algebraic functions; definite integrals",
}

x, t, C = sp.symbols("x t C")

# Triangle ABC with DE parallel to BC, AD = 4 and DB = 6 (so AD/AB = 0.4).
_A, _B, _C = (2.2, 5.2), (0.0, 0.0), (6.4, 0.0)
_k = 4 / 10
TRI = {"A": _A, "B": _B, "C": _C,
       "D": (_A[0] + _k * (_B[0] - _A[0]), _A[1] + _k * (_B[1] - _A[1])),
       "E": (_A[0] + _k * (_C[0] - _A[0]), _A[1] + _k * (_C[1] - _A[1]))}


def fig_parallel():
    g, f = TRI, Fig(-0.9, 7.3, -0.9, 6.0, width=300)
    f.poly([g["A"], g["B"], g["C"]])
    f.line(g["D"], g["E"])
    f.arrowhead(((g["D"][0] + g["E"][0]) / 2 - 0.4, g["D"][1]), ((g["D"][0] + g["E"][0]) / 2, g["D"][1]))
    f.arrowhead((3.0, 0.0), (3.4, 0.0))
    f.mid_label("4", g["A"], g["D"], side=-1)
    f.mid_label("6", g["D"], g["B"], side=-1)
    f.mid_label("5", g["D"], g["E"], side=1)
    for k, d in [("A", 90), ("B", 225), ("C", 315), ("D", 180), ("E", 0)]:
        f.dot(g[k])
        f.label(k, g[k], direction=d)
    return f.svg("Triangle ABC with DE parallel to BC. AD = 4, DB = 6 and DE = 5.")


def constructible(angle) -> bool:
    """Angles you can make with ruler and compasses from 60° and 90° by bisecting and combining."""
    a = R(angle)
    return any((a * 2**k / R(15, 2)).q == 1 for k in range(0, 4))


QUESTIONS = [
    # ── Similar and congruent figures ──────────────────────────────────────
    Q(
        id="maths-similar-01",
        topic="Similar and Congruent Figures",
        ref=TOPICS["Similar and Congruent Figures"],
        stem=r"Triangles $ABC$ and $PQR$ are similar, with $A$, $B$, $C$ matching $P$, $Q$, $R$. If $|AB| = 6$ cm, $|BC| = 8$ cm and $|PQ| = 9$ cm, find $|QR|$.",
        answer=(r"12 cm", 12),
        wrong=[
            Wrong(r"5.33 cm", Rounded(8 * 6 / 9, dp=2), r"You used the scale factor the wrong way round. $PQR$ is the larger triangle: multiply by $\frac{9}{6}$.", lambda: 8 * 6 / 9),
            Wrong(r"11 cm", 11, r"You added the difference ($9 - 6 = 3$). Similar figures scale by multiplying, not adding.", lambda: 8 + (9 - 6)),
            Wrong(r"13.5 cm", R(27, 2), r"You multiplied $PQ$ by the scale factor. Multiply the matching side, $BC$.", lambda: 9 * R(9, 6)),
        ],
        solve=lambda: 8 * R(9, 6),
        working=r"""Scale factor $= \dfrac{|PQ|}{|AB|} = \dfrac{9}{6} = 1.5$.

$|QR| = 1.5 \times |BC| = 1.5 \times 8 = 12$ cm""",
    ),
    Q(
        id="maths-similar-02",
        topic="Similar and Congruent Figures",
        ref=TOPICS["Similar and Congruent Figures"],
        stem=r"Which of these is NOT enough to show that two triangles are congruent?",
        answer=(r"AAA (three angles equal)", "AAA (three angles equal)"),
        wrong=[
            Wrong(r"SSS (three sides equal)", "SSS (three sides equal)", r"Three equal sides always give congruent triangles."),
            Wrong(r"SAS (two sides and the included angle)", "SAS (two sides and the included angle)", r"Two sides and the angle between them always give congruent triangles."),
            Wrong(r"RHS (right angle, hypotenuse, side)", "RHS (right angle, hypotenuse, side)", r"A right angle, the hypotenuse and one other side always give congruent triangles."),
        ],
        solve=lambda: "AAA (three angles equal)",
        order=["SSS (three sides equal)", "SAS (two sides and the included angle)", "RHS (right angle, hypotenuse, side)", "AAA (three angles equal)"],
        working=r"""SSS, SAS, ASA and RHS each fix a triangle's size and shape. Three equal angles fix only the shape: the triangles are similar but can be different sizes, so AAA does not prove congruence.""",
    ),
    Q(
        id="maths-similar-03",
        topic="Similar and Congruent Figures",
        ref=TOPICS["Similar and Congruent Figures"],
        stem=r"A map of Bo District has a scale of 1 : 50 000. A road is 4.5 cm long on the map. How long is the real road, in kilometres?",
        answer=(r"2.25 km", R(9, 4)),
        wrong=[
            Wrong(r"0.225 km", R(9, 40), r"Check the units: $225\,000$ cm $= 2250$ m $= 2.25$ km.", lambda: R(45 * 50000, 10 * 1000000)),
            Wrong(r"22.5 km", R(45, 2), r"You divided by 10 000. There are $100\,000$ cm in a kilometre.", lambda: R(45 * 50000, 10 * 10000)),
            Wrong(r"225 km", 225, r"You divided by 1000. There are $100\,000$ cm in a kilometre.", lambda: R(45 * 50000, 10 * 1000)),
        ],
        solve=lambda: R(45, 10) * 50000 / 100000,
        working=r"""Real length $= 4.5 \times 50\,000 = 225\,000$ cm.

$100\,000$ cm $= 1$ km, so the road is $225\,000 \div 100\,000 = 2.25$ km.""",
    ),
    Q(
        id="maths-similar-04",
        topic="Similar and Congruent Figures",
        ref=TOPICS["Similar and Congruent Figures"],
        stem=r"In triangle $ABC$, $DE$ is parallel to $BC$, with $D$ on $AB$ and $E$ on $AC$. If $|AD| = 4$ cm, $|DB| = 6$ cm and $|DE| = 5$ cm, find $|BC|$.",
        answer=(r"12.5 cm", R(25, 2)),
        wrong=[
            Wrong(r"2 cm", 2, r"You used the scale factor the wrong way round. $BC$ is longer than $DE$.", lambda: 5 * R(4, 10)),
            Wrong(r"7.5 cm", R(15, 2), r"You compared $DB$ with $AD$. Triangle $ABC$ matches triangle $ADE$, so compare $AB = 10$ with $AD = 4$.", lambda: 5 * R(6, 4)),
            Wrong(r"11 cm", 11, r"You added $DB$ to $DE$. Similar triangles scale by multiplying.", lambda: 5 + 6),
        ],
        solve=lambda: (lambda k: round(dist(TRI["B"], TRI["C"]) * 5 / dist(TRI["D"], TRI["E"]), 9) if abs(k - 0.4) < 1e-9 else None)(dist(TRI["A"], TRI["D"]) / dist(TRI["A"], TRI["B"])),
        diagram=fig_parallel,
        working=r"""$DE \parallel BC$, so triangle $ADE$ is similar to triangle $ABC$.

$|AB| = 4 + 6 = 10$ cm, so the scale factor is $\dfrac{10}{4} = 2.5$.

$|BC| = 2.5 \times 5 = 12.5$ cm""",
    ),
    Q(
        id="maths-similar-05",
        topic="Similar and Congruent Figures",
        ref=TOPICS["Similar and Congruent Figures"],
        stem=r"Two similar triangles have areas of 16 cm² and 36 cm². A side of the smaller triangle is 6 cm. Find the matching side of the larger triangle.",
        answer=(r"9 cm", 9),
        wrong=[
            Wrong(r"4 cm", 4, r"You used the ratio the wrong way round. The larger triangle has the longer side.", lambda: 6 * R(4, 6)),
            Wrong(r"13.5 cm", R(27, 2), r"You used the ratio of the areas. The sides scale by the square root of that ratio.", lambda: 6 * R(36, 16)),
            Wrong(r"26 cm", 26, r"You added the difference in area. Sides scale by $\sqrt{\frac{36}{16}} = \frac{6}{4}$.", lambda: 6 + (36 - 16)),
        ],
        solve=lambda: 6 * sp.sqrt(R(36, 16)),
        working=r"""Ratio of areas $= \dfrac{36}{16}$, so the ratio of sides $= \sqrt{\dfrac{36}{16}} = \dfrac{6}{4} = 1.5$.

Matching side $= 1.5 \times 6 = 9$ cm""",
    ),
    # ── Loci ───────────────────────────────────────────────────────────────
    Q(
        id="maths-loci-01",
        topic="Loci",
        ref=TOPICS["Loci"],
        stem=r"What is the locus of points that are equidistant from two fixed points $P$ and $Q$?",
        answer=(r"The perpendicular bisector of $PQ$", "The perpendicular bisector of PQ"),
        wrong=[
            Wrong(r"The line $PQ$", "The line PQ", r"Points on the line $PQ$ are generally nearer one end. Only the mid-point is equidistant."),
            Wrong(r"A circle with diameter $PQ$", "A circle with diameter PQ", r"Points on that circle are not all the same distance from $P$ as from $Q$."),
            Wrong(r"A line parallel to $PQ$", "A line parallel to PQ", r"Moving along a line parallel to $PQ$ brings you nearer one point than the other."),
        ],
        solve=lambda: "The perpendicular bisector of PQ",
        working=r"""Every point on the perpendicular bisector of $PQ$ is the same distance from $P$ as from $Q$, and no other point is. So the locus is the perpendicular bisector of $PQ$.""",
    ),
    Q(
        id="maths-loci-02",
        topic="Loci",
        ref=TOPICS["Loci"],
        stem=r"What is the locus of points 3 cm from a fixed point $O$?",
        answer=(r"A circle with centre $O$ and radius 3 cm", "A circle with centre O and radius 3 cm"),
        wrong=[
            Wrong(r"A circle with centre $O$ and diameter 3 cm", "A circle with centre O and diameter 3 cm", r"Every point is 3 cm from $O$, so 3 cm is the radius, not the diameter."),
            Wrong(r"A straight line 3 cm from $O$", "A straight line 3 cm from O", r"Points on a straight line are at different distances from $O$."),
            Wrong(r"A pair of parallel lines 3 cm apart", "A pair of parallel lines 3 cm apart", r"That is the locus of points at a fixed distance from a line, not from a point."),
        ],
        solve=lambda: "A circle with centre O and radius 3 cm",
        working=r"""All the points 3 cm from $O$ lie on the circle with centre $O$ and radius 3 cm.""",
    ),
    Q(
        id="maths-loci-03",
        topic="Loci",
        ref=TOPICS["Loci"],
        stem=r"What is the locus of points that are equidistant from two straight lines that intersect?",
        answer=(r"The bisectors of the angles between the lines", "The bisectors of the angles between the lines"),
        wrong=[
            Wrong(r"A line parallel to both lines", "A line parallel to both lines", r"Two intersecting lines are not parallel, so no line is parallel to both."),
            Wrong(r"The perpendicular bisector of the two lines", "The perpendicular bisector of the two lines", r"A perpendicular bisector belongs to a line segment between two points, not to two lines."),
            Wrong(r"A circle centred where the lines meet", "A circle centred where the lines meet", r"Points on that circle are mostly nearer one line than the other."),
        ],
        solve=lambda: "The bisectors of the angles between the lines",
        working=r"""A point the same distance from both lines lies on a line that bisects an angle between them. Two intersecting lines make two pairs of angles, so the locus is the pair of angle bisectors (they cross at right angles).""",
    ),
    Q(
        id="maths-loci-04",
        topic="Loci",
        ref=TOPICS["Loci"],
        stem=r"In a plane, what is the locus of points 2 cm from a straight line $AB$ (extended in both directions)?",
        answer=(r"A pair of lines parallel to $AB$, 2 cm on each side", "A pair of lines parallel to AB, 2 cm on each side"),
        wrong=[
            Wrong(r"One line parallel to $AB$, 2 cm away", "One line parallel to AB, 2 cm away", r"Points 2 cm away can be on either side of $AB$, so there are two lines."),
            Wrong(r"A circle of radius 2 cm", "A circle of radius 2 cm", r"A circle is the locus for a fixed distance from a point, not from a line."),
            Wrong(r"The perpendicular bisector of $AB$", "The perpendicular bisector of AB", r"That is the locus of points equidistant from $A$ and $B$."),
        ],
        solve=lambda: "A pair of lines parallel to AB, 2 cm on each side",
        working=r"""Points 2 cm from the line lie on a line parallel to it, 2 cm away, and this happens on both sides. So the locus is a pair of parallel lines, one on each side of $AB$.""",
    ),
    Q(
        id="maths-loci-05",
        topic="Loci",
        ref=TOPICS["Loci"],
        stem=r"A point $P(x, y)$ moves so that it is always 5 units from the origin. Which equation describes its locus?",
        answer=(r"$x^{2} + y^{2} = 25$", "x^{2}+y^{2}=25"),
        wrong=[
            Wrong(r"$x^{2} + y^{2} = 5$", "x^{2}+y^{2}=5", r"The distance is $\sqrt{x^{2} + y^{2}} = 5$, so square both sides: $x^{2} + y^{2} = 25$."),
            Wrong(r"$x + y = 5$", "x+y=5", r"That is a straight line. Distance from the origin uses Pythagoras: $\sqrt{x^{2} + y^{2}}$."),
            Wrong(r"$y = 5$", "y=5", r"That is a horizontal line. Its points are not all 5 units from the origin."),
        ],
        solve=lambda: "x^{2}+y^{2}=" + str(5**2),
        working=r"""The distance from the origin is $\sqrt{x^{2} + y^{2}}$. Setting this equal to 5 and squaring: $x^{2} + y^{2} = 25$, a circle with centre $(0, 0)$ and radius 5.""",
    ),
    # ── Construction ───────────────────────────────────────────────────────
    Q(
        id="maths-construction-01",
        topic="Construction",
        ref=TOPICS["Construction"],
        stem=r"Using only a ruler and a pair of compasses, an angle of 75° can be constructed by combining which two angles?",
        answer=(r"45° and 30°", "45 and 30"),
        wrong=[
            Wrong(r"50° and 25°", "50 and 25", r"Neither 50° nor 25° can be made with ruler and compasses alone."),
            Wrong(r"70° and 5°", "70 and 5", r"Neither 70° nor 5° can be made with ruler and compasses alone."),
            Wrong(r"35° and 40°", "35 and 40", r"Neither 35° nor 40° can be made with ruler and compasses alone."),
        ],
        solve=lambda: next(s for s in ["50 and 25", "70 and 5", "35 and 40", "45 and 30"] if all(constructible(int(a)) for a in s.split(" and "))),
        working=r"""45° comes from bisecting 90°, and 30° from bisecting 60°. Placing them side by side gives $45° + 30° = 75°$.""",
    ),
    Q(
        id="maths-construction-02",
        topic="Construction",
        ref=TOPICS["Construction"],
        stem=r"Which of these angles CANNOT be constructed using only a ruler and a pair of compasses?",
        answer=(r"40°", 40),
        wrong=[
            Wrong(r"22.5°", R(45, 2), r"22.5° can be constructed: bisect 90° to get 45°, then bisect again."),
            Wrong(r"75°", 75, r"75° can be constructed: $45° + 30°$."),
            Wrong(r"105°", 105, r"105° can be constructed: $60° + 45°$."),
        ],
        solve=lambda: next(a for a in [R(45, 2), 40, 75, 105] if not constructible(a)),
        working=r"""With ruler and compasses you can make 60° (equilateral triangle) and 90° (perpendicular), bisect them, and add or subtract the results: 22.5°, 75° and 105° can all be made that way. 40° cannot.""",
    ),
    Q(
        id="maths-construction-03",
        topic="Construction",
        ref=TOPICS["Construction"],
        stem=r"To construct the perpendicular bisector of a line segment $AB$, you draw arcs of the same radius from $A$ and from $B$. What must that radius be?",
        answer=(r"More than half the length of $AB$", "More than half the length of AB"),
        wrong=[
            Wrong(r"Less than half the length of $AB$", "Less than half the length of AB", r"Then the arcs from $A$ and $B$ would not meet."),
            Wrong(r"Exactly a quarter of the length of $AB$", "Exactly a quarter of the length of AB", r"Then the arcs from $A$ and $B$ would not meet."),
            Wrong(r"Exactly the length of the line $AB$ doubled", "Exactly the length of the line AB doubled", r"Any radius more than half of $AB$ works; it does not have to be one particular length."),
        ],
        solve=lambda: "More than half the length of AB",
        working=r"""The arcs from $A$ and $B$ must cross above and below $AB$. That only happens if the radius is more than half of $AB$. The line through the two crossing points is the perpendicular bisector.""",
    ),
    Q(
        id="maths-construction-04",
        topic="Construction",
        ref=TOPICS["Construction"],
        stem=r"Constructing an angle of 60° with ruler and compasses relies on which fact?",
        answer=(r"Each angle of an equilateral triangle is 60°", "Each angle of an equilateral triangle is 60"),
        wrong=[
            Wrong(r"Angles on a straight line add up to 180°", "Angles on a straight line add up to 180", r"The construction makes an equilateral triangle; the straight-line fact is not used."),
            Wrong(r"The angle in a semicircle is 90°", "The angle in a semicircle is 90", r"That gives a right angle, not 60°."),
            Wrong(r"Alternate angles are equal", "Alternate angles are equal", r"No parallel lines are used in this construction."),
        ],
        solve=lambda: "Each angle of an equilateral triangle is 60",
        working=r"""With the compasses kept at the same radius, the arc from the vertex and the arc from the point where it cuts the arm make an equilateral triangle. Every angle of an equilateral triangle is 60°.""",
    ),
    Q(
        id="maths-construction-05",
        topic="Construction",
        ref=TOPICS["Construction"],
        stem=r"Which set of lengths can NOT be used to construct a triangle?",
        answer=(r"2 cm, 3 cm, 6 cm", (2, 3, 6)),
        wrong=[
            Wrong(r"3 cm, 4 cm, 5 cm", (3, 4, 5), r"$3 + 4 > 5$, so these make a triangle (a right-angled one)."),
            Wrong(r"5 cm, 5 cm, 8 cm", (5, 5, 8), r"$5 + 5 > 8$, so these make a triangle."),
            Wrong(r"6 cm, 6 cm, 6 cm", (6, 6, 6), r"These make an equilateral triangle."),
        ],
        solve=lambda: next(s for s in [(3, 4, 5), (5, 5, 8), (2, 3, 6), (6, 6, 6)] if sorted(s)[0] + sorted(s)[1] <= sorted(s)[2]),
        working=r"""Any two sides of a triangle must add up to more than the third. $2 + 3 = 5$, which is less than 6, so the two short sides cannot meet.""",
    ),
    # ── Financial arithmetic ───────────────────────────────────────────────
    Q(
        id="maths-financial-01",
        topic="Financial Arithmetic",
        ref=TOPICS["Financial Arithmetic"],
        stem=r"A motorbike bought for Le 30,000 loses 20% of its value at the end of each year (reducing balance). What is it worth after 2 years?",
        answer=(r"Le 19,200", 19200),
        wrong=[
            Wrong(r"Le 10,800", 10800, r"That is how much value it lost. The question asks what it is worth.", lambda: 30000 - 30000 * R(4, 5) ** 2),
            Wrong(r"Le 18,000", 18000, r"You took 20% of Le 30,000 twice. In year 2 the 20% is of the new, lower value.", lambda: 30000 - 2 * 6000),
            Wrong(r"Le 24,000", 24000, r"That is its value after 1 year.", lambda: 30000 * R(4, 5)),
        ],
        solve=lambda: 30000 * R(4, 5) ** 2,
        working=r"""Each year it keeps 80% of its value:

After 1 year: $0.8 \times 30\,000 = 24\,000$. After 2 years: $0.8 \times 24\,000 = $ Le 19,200.""",
    ),
    Q(
        id="maths-financial-02",
        topic="Financial Arithmetic",
        ref=TOPICS["Financial Arithmetic"],
        stem=r"A machine costs Le 50,000. After 9 years its scrap value is Le 5,000. Using the straight-line method, find the depreciation each year.",
        answer=(r"Le 5,000", 5000),
        wrong=[
            Wrong(r"Le 5,555.56", Rounded(50000 / 9, dp=2), r"You left out the scrap value. Depreciate only the part that is lost: $50\,000 - 5\,000$.", lambda: 50000 / 9),
            Wrong(r"Le 6,111.11", Rounded(55000 / 9, dp=2), r"You added the scrap value. Subtract it: the machine loses $50\,000 - 5\,000$.", lambda: (50000 + 5000) / 9),
            Wrong(r"Le 45,000", 45000, r"That is the total depreciation over 9 years. Divide by 9.", lambda: 50000 - 5000),
        ],
        solve=lambda: R(50000 - 5000, 9),
        working=r"""Total depreciation $= 50\,000 - 5\,000 = 45\,000$.

Each year: $45\,000 \div 9 = $ Le 5,000""",
    ),
    Q(
        id="maths-financial-03",
        topic="Financial Arithmetic",
        ref=TOPICS["Financial Arithmetic"],
        stem=r"Mr Conteh buys 400 shares at Le 2.50 each. The company pays a dividend of 8% on the nominal value of Le 2.00 per share. How much dividend does he receive?",
        answer=(r"Le 64", 64),
        wrong=[
            Wrong(r"Le 80", 80, r"You worked out 8% of the price he paid (Le 2.50). Dividends are paid on the nominal value, Le 2.00.", lambda: 400 * R(5, 2) * R(8, 100)),
            Wrong(r"Le 800", 800, r"That is the nominal value of his shares. The dividend is 8% of it.", lambda: 400 * 2),
            Wrong(r"Le 1,000", 1000, r"That is what he paid for the shares.", lambda: 400 * R(5, 2)),
        ],
        solve=lambda: 400 * 2 * R(8, 100),
        working=r"""Nominal value of his shares $= 400 \times 2.00 = $ Le 800.

Dividend $= 8\%$ of $800 = $ Le 64""",
    ),
    Q(
        id="maths-financial-04",
        topic="Financial Arithmetic",
        ref=TOPICS["Financial Arithmetic"],
        stem=r"A bond of Le 10,000 pays simple interest of 6% per annum. How much interest does it pay in 3 years?",
        answer=(r"Le 1,800", 1800),
        wrong=[
            Wrong(r"Le 600", 600, r"That is one year's interest. The bond pays for 3 years.", lambda: 10000 * R(6, 100)),
            Wrong(r"Le 1,910.16", Rounded(10000 * 1.06**3 - 10000, dp=2), r"That is compound interest. The bond pays simple interest.", lambda: 10000 * 1.06**3 - 10000),
            Wrong(r"Le 11,800", 11800, r"That is the bond plus the interest. The question asks for the interest only.", lambda: 10000 + 1800),
        ],
        solve=lambda: 10000 * R(6, 100) * 3,
        working=r"""Simple interest $= \dfrac{PRT}{100} = \dfrac{10\,000 \times 6 \times 3}{100} = $ Le 1,800""",
    ),
    Q(
        id="maths-financial-05",
        topic="Financial Arithmetic",
        ref=TOPICS["Financial Arithmetic"],
        stem=r"A fridge costs Le 2,400 cash. On hire purchase you pay a 25% deposit and then 12 monthly instalments of Le 180. How much more than the cash price do you pay on hire purchase?",
        answer=(r"Le 360", 360),
        wrong=[
            Wrong(r"Le 600", 600, r"That is the deposit (25% of Le 2,400)."),
            Wrong(r"Le 2,160", 2160, r"That is the total of the instalments ($12 \times 180$). Add the deposit and compare with the cash price.", lambda: 12 * 180),
            Wrong(r"Le 2,760", 2760, r"That is the total hire purchase price. The question asks how much more than the cash price.", lambda: 600 + 12 * 180),
        ],
        solve=lambda: R(25, 100) * 2400 + 12 * 180 - 2400,
        working=r"""Deposit $= 25\%$ of $2\,400 = 600$. Instalments $= 12 \times 180 = 2\,160$.

Hire purchase price $= 600 + 2\,160 = 2\,760$, which is $2\,760 - 2\,400 = $ Le 360 more than the cash price.""",
    ),
    # ── Differentiation ────────────────────────────────────────────────────
    Q(
        id="maths-differentiation-01",
        topic="Differentiation",
        ref=TOPICS["Differentiation"],
        stem=r"Find $\dfrac{dy}{dx}$ if $y = 3x^{4} - 5x^{2} + 7$.",
        answer=(r"$12x^{3} - 10x$", 12 * x**3 - 10 * x),
        wrong=[
            Wrong(r"$12x^{3} - 10x + 7$", 12 * x**3 - 10 * x + 7, r"A constant differentiates to 0, so the 7 disappears."),
            Wrong(r"$3x^{3} - 5x$", 3 * x**3 - 5 * x, r"You lowered the powers but forgot to multiply by them: $\frac{d}{dx}(3x^{4}) = 4 \times 3x^{3}$."),
            Wrong(r"$12x^{5} - 10x^{3}$", 12 * x**5 - 10 * x**3, r"The power goes down by 1, not up: $x^{4} \to x^{3}$."),
        ],
        solve=lambda: sp.diff(3 * x**4 - 5 * x**2 + 7, x),
        working=r"""Differentiate term by term ($\frac{d}{dx}x^{n} = nx^{n-1}$; a constant gives 0):

$\dfrac{dy}{dx} = 4 \times 3x^{3} - 2 \times 5x - 0 = 12x^{3} - 10x$""",
    ),
    Q(
        id="maths-differentiation-02",
        topic="Differentiation",
        ref=TOPICS["Differentiation"],
        stem=r"Find the gradient of the curve $y = x^{2} - 4x + 1$ at the point where $x = 3$.",
        answer=(r"$2$", 2),
        wrong=[
            Wrong(r"$-2$", -2, r"That is the $y$-value at $x = 3$. The gradient is $\frac{dy}{dx}$ at $x = 3$.", lambda: (x**2 - 4 * x + 1).subs(x, 3)),
            Wrong(r"$6$", 6, r"You left out the $-4$: $\frac{dy}{dx} = 2x - 4$.", lambda: 2 * 3),
            Wrong(r"$10$", 10, r"Sign slip: $\frac{dy}{dx} = 2x - 4$, not $2x + 4$.", lambda: 2 * 3 + 4),
        ],
        solve=lambda: sp.diff(x**2 - 4 * x + 1, x).subs(x, 3),
        working=r"""$\dfrac{dy}{dx} = 2x - 4$. At $x = 3$: $2(3) - 4 = 2$.""",
    ),
    Q(
        id="maths-differentiation-03",
        topic="Differentiation",
        ref=TOPICS["Differentiation"],
        stem=r"Find the minimum value of $y = x^{2} - 6x + 5$.",
        answer=(r"$-4$", -4),
        wrong=[
            Wrong(r"$3$", 3, r"$x = 3$ is where the minimum happens. The minimum value is $y$ at $x = 3$.", lambda: sp.solve(sp.diff(x**2 - 6 * x + 5, x), x)[0]),
            Wrong(r"$5$", 5, r"5 is the value of $y$ at $x = 0$, not the minimum.", lambda: 5),
            Wrong(r"$32$", 32, r"Sign slip: $2x - 6 = 0$ gives $x = 3$, not $-3$.", lambda: (x**2 - 6 * x + 5).subs(x, -3)),
        ],
        solve=lambda: (x**2 - 6 * x + 5).subs(x, sp.solve(sp.diff(x**2 - 6 * x + 5, x), x)[0]),
        working=r"""At a minimum, $\dfrac{dy}{dx} = 2x - 6 = 0$, so $x = 3$.

$y = 3^{2} - 6(3) + 5 = 9 - 18 + 5 = -4$""",
    ),
    Q(
        id="maths-differentiation-04",
        topic="Differentiation",
        ref=TOPICS["Differentiation"],
        stem=r"A particle moves so that its distance in metres after $t$ seconds is $s = t^{3} - 3t^{2} + 2t$. Find its velocity when $t = 3$.",
        answer=(r"11 m/s", 11),
        wrong=[
            Wrong(r"6 m/s", 6, r"6 is the distance $s$ at $t = 3$. Velocity is $\frac{ds}{dt}$.", lambda: (t**3 - 3 * t**2 + 2 * t).subs(t, 3)),
            Wrong(r"9 m/s", 9, r"You left out the $+2$: $\frac{ds}{dt} = 3t^{2} - 6t + 2$.", lambda: 27 - 18),
            Wrong(r"12 m/s", 12, r"You differentiated twice. That gives the acceleration.", lambda: sp.diff(t**3 - 3 * t**2 + 2 * t, t, 2).subs(t, 3)),
        ],
        solve=lambda: sp.diff(t**3 - 3 * t**2 + 2 * t, t).subs(t, 3),
        working=r"""$v = \dfrac{ds}{dt} = 3t^{2} - 6t + 2$. At $t = 3$: $27 - 18 + 2 = 11$ m/s.""",
    ),
    Q(
        id="maths-differentiation-05",
        topic="Differentiation",
        ref=TOPICS["Differentiation"],
        stem=r"The area of a circle is $A = \pi r^{2}$. Find $\dfrac{dA}{dr}$ when $r = 7$ cm. [Take $\pi = \frac{22}{7}$]",
        answer=(r"44", 44),
        wrong=[
            Wrong(r"22", 22, r"You worked out $\pi r$. $\frac{d}{dr}(\pi r^{2}) = 2\pi r$.", lambda: R(22, 7) * 7),
            Wrong(r"88", 88, r"You used the diameter, 14, in $2\pi r$.", lambda: 2 * R(22, 7) * 14),
            Wrong(r"154", 154, r"That is the area itself. Differentiate first: $\frac{dA}{dr} = 2\pi r$.", lambda: R(22, 7) * 49),
        ],
        solve=lambda: sp.diff(R(22, 7) * sp.Symbol("r") ** 2, sp.Symbol("r")).subs(sp.Symbol("r"), 7),
        working=r"""$\dfrac{dA}{dr} = 2\pi r = 2 \times \dfrac{22}{7} \times 7 = 44$ (cm² per cm).""",
    ),
    # ── Integration ────────────────────────────────────────────────────────
    Q(
        id="maths-integration-01",
        topic="Integration",
        ref=TOPICS["Integration"],
        stem=r"Find $\displaystyle\int (6x^{2} - 4x + 3)\, dx$.",
        answer=(r"$2x^{3} - 2x^{2} + 3x + C$", 2 * x**3 - 2 * x**2 + 3 * x + C),
        wrong=[
            Wrong(r"$12x - 4$", 12 * x - 4, r"You differentiated. To integrate, raise each power by 1 and divide by the new power."),
            Wrong(r"$6x^{3} - 4x^{2} + 3x + C$", 6 * x**3 - 4 * x**2 + 3 * x + C, r"You raised the powers but forgot to divide by the new powers: $\int 6x^{2}\,dx = \frac{6x^{3}}{3}$."),
            Wrong(r"$2x^{3} - 2x^{2} + C$", 2 * x**3 - 2 * x**2 + C, r"The constant 3 integrates to $3x$, not 0."),
        ],
        solve=lambda: sp.integrate(6 * x**2 - 4 * x + 3, x) + C,
        working=r"""Integrate term by term ($\int x^{n}\,dx = \frac{x^{n+1}}{n+1}$):

$\dfrac{6x^{3}}{3} - \dfrac{4x^{2}}{2} + 3x + C = 2x^{3} - 2x^{2} + 3x + C$""",
    ),
    Q(
        id="maths-integration-02",
        topic="Integration",
        ref=TOPICS["Integration"],
        stem=r"Evaluate $\displaystyle\int_{1}^{3} 2x\, dx$.",
        answer=(r"$8$", 8),
        wrong=[
            Wrong(r"$4$", 4, r"You put the limits into $2x$ instead of integrating first: $2(3) - 2(1)$.", lambda: 2 * 3 - 2 * 1),
            Wrong(r"$9$", 9, r"You put in the top limit only. Subtract the value at the bottom limit.", lambda: 3**2),
            Wrong(r"$10$", 10, r"You added the values at the two limits. Subtract: $9 - 1$.", lambda: 3**2 + 1**2),
        ],
        solve=lambda: sp.integrate(2 * x, (x, 1, 3)),
        working=r"""$\displaystyle\int_{1}^{3} 2x\,dx = \big[x^{2}\big]_{1}^{3} = 3^{2} - 1^{2} = 9 - 1 = 8$""",
    ),
    Q(
        id="maths-integration-03",
        topic="Integration",
        ref=TOPICS["Integration"],
        stem=r"Evaluate $\displaystyle\int_{0}^{2} (3x^{2} + 1)\, dx$.",
        answer=(r"$10$", 10),
        wrong=[
            Wrong(r"$8$", 8, r"You left out the $+1$, which integrates to $x$.", lambda: sp.integrate(3 * x**2, (x, 0, 2))),
            Wrong(r"$13$", 13, r"You put $x = 2$ into $3x^{2} + 1$ instead of integrating it first.", lambda: 3 * 4 + 1),
            Wrong(r"$26$", 26, r"You raised the power but forgot to divide by 3: $\int 3x^{2}\,dx = x^{3}$.", lambda: 3 * 2**3 + 2),
        ],
        solve=lambda: sp.integrate(3 * x**2 + 1, (x, 0, 2)),
        working=r"""$\displaystyle\int_{0}^{2} (3x^{2} + 1)\,dx = \big[x^{3} + x\big]_{0}^{2} = (8 + 2) - 0 = 10$""",
    ),
    Q(
        id="maths-integration-04",
        topic="Integration",
        ref=TOPICS["Integration"],
        stem=r"Given that $\dfrac{dy}{dx} = 4x - 3$ and $y = 5$ when $x = 2$, find $y$ in terms of $x$.",
        answer=(r"$y = 2x^{2} - 3x + 3$", 2 * x**2 - 3 * x + 3),
        wrong=[
            Wrong(r"$y = 2x^{2} - 3x$", 2 * x**2 - 3 * x, r"You forgot the constant of integration. Use $y = 5$ when $x = 2$ to find it."),
            Wrong(r"$y = 2x^{2} - 3x + 5$", 2 * x**2 - 3 * x + 5, r"You used 5 as the constant. Substitute $x = 2$, $y = 5$: $5 = 8 - 6 + C$, so $C = 3$."),
            Wrong(r"$y = 2x^{2} - 3x - 3$", 2 * x**2 - 3 * x - 3, r"Sign slip: $5 = 2 + C$ gives $C = 3$, not $-3$."),
        ],
        solve=lambda: (lambda c: 2 * x**2 - 3 * x + c)(sp.solve(sp.Eq((2 * x**2 - 3 * x + C).subs(x, 2), 5), C)[0]),
        working=r"""$y = \displaystyle\int (4x - 3)\,dx = 2x^{2} - 3x + C$.

When $x = 2$, $y = 5$: $5 = 8 - 6 + C$, so $C = 3$. Therefore $y = 2x^{2} - 3x + 3$.""",
    ),
    Q(
        id="maths-integration-05",
        topic="Integration",
        ref=TOPICS["Integration"],
        stem=r"Find the area between the curve $y = x^{2}$, the $x$-axis and the lines $x = 0$ and $x = 3$.",
        answer=(r"9 square units", 9),
        wrong=[
            Wrong(r"3 square units", 3, r"You divided by 3 but did not raise the power: $\int x^{2}\,dx = \frac{x^{3}}{3}$.", lambda: R(3**2, 3)),
            Wrong(r"6 square units", 6, r"You differentiated $x^{2}$ and put in $x = 3$. Area needs integration.", lambda: 2 * 3),
            Wrong(r"27 square units", 27, r"You raised the power but forgot to divide by 3.", lambda: 3**3),
        ],
        solve=lambda: sp.integrate(x**2, (x, 0, 3)),
        working=r"""Area $= \displaystyle\int_{0}^{3} x^{2}\,dx = \left[\dfrac{x^{3}}{3}\right]_{0}^{3} = \dfrac{27}{3} - 0 = 9$ square units""",
    ),
]
