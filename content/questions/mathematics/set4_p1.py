"""Mathematics (Core) set 4: 50 original Paper 1 questions on number and algebra.

Written by WASSCE Tutor in the style of WASSCE Paper 1. Nothing here is copied
from a WAEC paper. Topics come from the 2018 and 2019 Sierra Leone papers and
the Ministry's revision handbooks; see SCOPE.md.

Run `python3 scripts/questions/build.py` to check everything and rebuild.
"""

from decimal import ROUND_HALF_UP, Decimal

import sympy as sp

from diagram import GRID, MUTED, Fig, polyline
from qbank import Q, R, Rounded, Wrong

TOPICS = {
    "Fractions, Decimals and Approximations": "A(c) Fractions, decimals and approximations: operations; significant figures",
    "Integers and Rational Numbers": "A(i) Integers and rational numbers: the four operations; directed numbers",
    "Logical Reasoning": "A(h) Logical reasoning: simple statements, negation, implication, valid conclusions",
    "Algebraic Expressions": "B(a) Algebraic expressions: formulating from situations; evaluating",
    "Operations on Algebraic Expressions": "B(b) Expansion, factorisation, difference of two squares, binary operations",
    "Linear Equations": "B(c) Linear equations in one variable; simultaneous equations; word problems",
    "Graphs of Linear and Quadratic Functions": "B(f) Graphs: reading roots, minimum points, axis of symmetry; intersections",
    "Algebraic Fractions": "B(h) Algebraic fractions: operations; values for which a fraction is undefined",
    "Functions and Relations": "B(i) Functions and relations: types of mapping; the rule of a mapping",
    "Coordinate Geometry": "E Coordinate geometry: distance, mid-point, gradient, equation of a line",
}

x, y, n = sp.symbols("x y n")


def quad(v):
    return v**2 - 2 * v - 3


def fig_quad():
    f = Fig(-3.1, 4.9, -5.7, 5.9, width=320)
    for k in range(-2, 5):
        f.line((k, -5), (k, 5), color=GRID, width=1)
    for k in range(-5, 6):
        f.line((-2, k), (4, k), color=GRID, width=1)
    f.line((-2.5, 0), (4.5, 0), width=1.6)
    f.arrowhead((4.0, 0), (4.5, 0))
    f.line((0, -5.4), (0, 5.5), width=1.6)
    f.arrowhead((0, 5.0), (0, 5.5))
    for k in range(-2, 5):
        if k:
            f.text(str(k), (k, 0), dy=12, dx=-8 if k < 0 else 7, size=11, color=MUTED)
    for k in range(-5, 6):
        f.text(str(k), (-2, k), dx=-7, size=11, color=MUTED, anchor="end")
    f.text("x", (4.5, 0), dx=8, dy=-10, italic=True, size=15)
    f.text("y", (0, 5.5), dx=12, dy=2, italic=True, size=15)
    pts = [(-2 + i / 20, quad(-2 + i / 20)) for i in range(121)]
    polyline(f, pts, color="#1d4ed8", width=2.2, dots=False)
    f.text("y = x² − 2x − 3", (1.75, 4.3), italic=True, size=14, color="#1d4ed8")
    return f.svg("Graph of y = x squared minus 2x minus 3, for x from −2 to 4.")


GRAPH_STEM = "The diagram shows the graph of $y = x^{2} - 2x - 3$ for $-2 \\leq x \\leq 4$. "


def truth(statement: str, p: bool, q: bool) -> bool:
    return {"p and q": p and q, "not p": not p, "p or q": p or q, "If p then q": (not p) or q}[statement]


AFTER_IMPLICATION = {
    (True, False): "p is true and q is false",
    (False, True): "p is false and q is true",
    (False, False): "p and q are both false",
    (True, True): "p and q are both true",
}


QUESTIONS = [
    # ── Fractions, decimals and approximations ─────────────────────────────
    Q(
        id="maths-fractions-01",
        topic="Fractions, Decimals and Approximations",
        ref=TOPICS["Fractions, Decimals and Approximations"],
        stem=r"Simplify $2\frac{1}{3} - 1\frac{3}{4} + \frac{5}{6}$.",
        answer=(r"$1\frac{5}{12}$", R(17, 12)),
        wrong=[
            Wrong(r"$\frac{5}{12}$", R(5, 12), r"You dropped the whole numbers. Change each mixed number to an improper fraction first: $\frac{7}{3} - \frac{7}{4} + \frac{5}{6}$.", lambda: R(1, 3) - R(3, 4) + R(5, 6)),
            Wrong(r"$\frac{7}{12}$", R(7, 12), r"You stopped after the subtraction and forgot to add $\frac{5}{6}$.", lambda: R(7, 3) - R(7, 4)),
            Wrong(r"$4\frac{11}{12}$", R(59, 12), r"You added $1\frac{3}{4}$ instead of subtracting it.", lambda: R(7, 3) + R(7, 4) + R(5, 6)),
        ],
        solve=lambda: R(7, 3) - R(7, 4) + R(5, 6),
        working=r"""Change to improper fractions with the LCM 12:

$\dfrac{7}{3} - \dfrac{7}{4} + \dfrac{5}{6} = \dfrac{28}{12} - \dfrac{21}{12} + \dfrac{10}{12} = \dfrac{17}{12} = 1\dfrac{5}{12}$""",
    ),
    Q(
        id="maths-fractions-02",
        topic="Fractions, Decimals and Approximations",
        ref=TOPICS["Fractions, Decimals and Approximations"],
        stem=r"Write 0.0045807 correct to three significant figures.",
        answer=(r"$0.00458$", R(458, 100000)),
        wrong=[
            Wrong(r"$0.004581$", R(4581, 1000000), r"That has four significant figures (4, 5, 8, 1)."),
            Wrong(r"$0.0046$", R(46, 10000), r"That has only two significant figures."),
            Wrong(r"$0.005$", R(5, 1000), r"That is correct to three decimal places. The zeros before the 4 are not significant; count from the 4.", lambda: R(str(Decimal("0.0045807").quantize(Decimal("0.001"), ROUND_HALF_UP)))),
        ],
        solve=lambda: R(str(Decimal("0.0045807").quantize(Decimal("0.00001"), ROUND_HALF_UP))),
        working=r"""The first significant figure is the 4. Count three figures from there: 4, 5, 8. The next digit is 0, so round down.

$0.0045807 \approx 0.00458$ (3 s.f.)""",
    ),
    Q(
        id="maths-fractions-03",
        topic="Fractions, Decimals and Approximations",
        ref=TOPICS["Fractions, Decimals and Approximations"],
        stem=r"Without using a calculator, evaluate $0.36 \div 0.009$.",
        answer=(r"$40$", 40),
        wrong=[
            Wrong(r"$0.04$", R(4, 100), r"You divided the wrong way round."),
            Wrong(r"$4$", 4, r"Check the decimal point: multiply both numbers by 1000 to get $360 \div 9 = 40$.", lambda: R(36, 9)),
            Wrong(r"$400$", 400, r"Check the decimal point: $0.36 \div 0.009 = 360 \div 9 = 40$.", lambda: R(3600, 9)),
        ],
        solve=lambda: R(36, 100) / R(9, 1000),
        working=r"""Multiply both numbers by 1000 so the divisor is a whole number:

$0.36 \div 0.009 = 360 \div 9 = 40$""",
    ),
    Q(
        id="maths-fractions-04",
        topic="Fractions, Decimals and Approximations",
        ref=TOPICS["Fractions, Decimals and Approximations"],
        stem=r"Aminata spends $\frac{1}{4}$ of her salary on rent and $\frac{2}{5}$ of the remainder on food. She has Le 900 left. What is her salary?",
        answer=(r"Le 2,000", 2000),
        wrong=[
            Wrong(r"Le 1,200", 1200, r"You left out the food. After rent she has $\frac{3}{4}$, and then $\frac{2}{5}$ of that goes on food.", lambda: 900 / R(3, 4)),
            Wrong(r"Le 1,500", 1500, r"You left out the rent: Le 900 is $\frac{3}{5}$ of what was left after rent, not of the whole salary.", lambda: 900 / R(3, 5)),
            Wrong(r"Le 2,571.43", Rounded(900 / (1 - 0.25 - 0.4), dp=2), r"You took $\frac{2}{5}$ of the whole salary. It is $\frac{2}{5}$ of the remainder after rent.", lambda: 900 / (1 - 1 / 4 - 2 / 5)),
        ],
        solve=lambda: 900 / (R(3, 4) * R(3, 5)),
        working=r"""After rent she has $\frac{3}{4}$ of her salary. Food takes $\frac{2}{5}$ of that, leaving $\frac{3}{5} \times \frac{3}{4} = \frac{9}{20}$ of her salary.

$\frac{9}{20} \times \text{salary} = 900$, so salary $= 900 \times \frac{20}{9} = $ Le 2,000.""",
    ),
    Q(
        id="maths-fractions-05",
        topic="Fractions, Decimals and Approximations",
        ref=TOPICS["Fractions, Decimals and Approximations"],
        stem=r"What fraction of Le 2.50 is 75 cents? (Le 1 = 100 cents)",
        answer=(r"$\frac{3}{10}$", R(3, 10)),
        wrong=[
            Wrong(r"$\frac{3}{100}$", R(3, 100), r"Le 2.50 is 250 cents, not 2500.", lambda: R(75, 2500)),
            Wrong(r"$\frac{10}{3}$", R(10, 3), r"You turned the fraction upside down. The part (75 cents) goes on top.", lambda: R(250, 75)),
            Wrong(r"$30$", 30, r"You divided 75 by 2.5 without changing to the same units.", lambda: R(75, 1) / R(5, 2)),
        ],
        solve=lambda: R(75, 250),
        working=r"""Use the same units: Le 2.50 = 250 cents.

$\dfrac{75}{250} = \dfrac{3}{10}$""",
    ),
    # ── Integers and rational numbers ──────────────────────────────────────
    Q(
        id="maths-integers-01",
        topic="Integers and Rational Numbers",
        ref=TOPICS["Integers and Rational Numbers"],
        stem=r"Evaluate $-3 - (-7) \times 2$.",
        answer=(r"$11$", 11),
        wrong=[
            Wrong(r"$-20$", -20, r"Two slips: you worked left to right and treated $-(-7)$ as $-7$.", lambda: (-3 - 7) * 2),
            Wrong(r"$-17$", -17, r"$-(-7) \times 2 = -(-14) = +14$. Subtracting a negative number adds.", lambda: -3 - 14),
            Wrong(r"$8$", 8, r"You worked from left to right. Multiplication comes before subtraction (BODMAS).", lambda: (-3 - (-7)) * 2),
        ],
        solve=lambda: -3 - (-7) * 2,
        working=r"""Multiply first: $(-7) \times 2 = -14$.

Then $-3 - (-14) = -3 + 14 = 11$.""",
    ),
    Q(
        id="maths-integers-02",
        topic="Integers and Rational Numbers",
        ref=TOPICS["Integers and Rational Numbers"],
        stem=r"Which of the following is not a rational number?",
        answer=(r"$\sqrt{2}$", sp.sqrt(2)),
        wrong=[
            Wrong(r"$-\frac{4}{7}$", R(-4, 7), r"$-\frac{4}{7}$ is a fraction of two integers, so it is rational."),
            Wrong(r"$0.25$", R(1, 4), r"$0.25 = \frac{1}{4}$, so it is rational."),
            Wrong(r"$\sqrt{9}$", 3, r"$\sqrt{9} = 3$, a whole number, so it is rational."),
        ],
        solve=lambda: next(v for v in [R(-4, 7), R(1, 4), sp.sqrt(9), sp.sqrt(2)] if not v.is_rational),
        working=r"""A rational number can be written as $\frac{a}{b}$ with $a$ and $b$ integers.

$-\frac{4}{7}$, $0.25 = \frac{1}{4}$ and $\sqrt{9} = 3$ are all rational. $\sqrt{2}$ cannot be written as a fraction, so it is irrational.""",
    ),
    Q(
        id="maths-integers-03",
        topic="Integers and Rational Numbers",
        ref=TOPICS["Integers and Rational Numbers"],
        stem=r"Which of these numbers lies between $-1$ and $-\frac{1}{2}$?",
        answer=(r"$-0.75$", R(-3, 4)),
        wrong=[
            Wrong(r"$-1.2$", R(-6, 5), r"$-1.2$ is less than $-1$."),
            Wrong(r"$-0.3$", R(-3, 10), r"$-0.3$ is greater than $-\frac{1}{2}$ (it is closer to 0)."),
            Wrong(r"$0.6$", R(3, 5), r"0.6 is positive, so it is greater than both."),
        ],
        solve=lambda: next(v for v in [R(-6, 5), R(-3, 4), R(-3, 10), R(3, 5)] if -1 < v < R(-1, 2)),
        working=r"""$-\frac{1}{2} = -0.5$. We need a number greater than $-1$ but less than $-0.5$.

$-0.75$ is the only one: $-1 < -0.75 < -0.5$.""",
    ),
    Q(
        id="maths-integers-04",
        topic="Integers and Rational Numbers",
        ref=TOPICS["Integers and Rational Numbers"],
        stem=r"Evaluate $(-2)^{3} - (-3)^{2}$.",
        answer=(r"$-17$", -17),
        wrong=[
            Wrong(r"$-1$", -1, r"$(-2)^{3}$ is negative: $(-2) \times (-2) \times (-2) = -8$.", lambda: 8 - 9),
            Wrong(r"$0$", 0, r"You multiplied by the power instead of using it: $(-2) \times 3$ and $(-3) \times 2$.", lambda: (-2) * 3 - (-3) * 2),
            Wrong(r"$1$", 1, r"$(-3)^{2}$ is positive: $(-3) \times (-3) = 9$.", lambda: -8 - (-9)),
        ],
        solve=lambda: (-2) ** 3 - (-3) ** 2,
        working=r"""$(-2)^{3} = -8$ and $(-3)^{2} = 9$.

$-8 - 9 = -17$""",
    ),
    Q(
        id="maths-integers-05",
        topic="Integers and Rational Numbers",
        ref=TOPICS["Integers and Rational Numbers"],
        stem=r"Evaluate $\left(\frac{2}{3} - \frac{1}{4}\right) \div \frac{5}{6}$.",
        answer=(r"$\frac{1}{2}$", R(1, 2)),
        wrong=[
            Wrong(r"$\frac{25}{72}$", R(25, 72), r"You multiplied by $\frac{5}{6}$. To divide by a fraction, multiply by its reciprocal, $\frac{6}{5}$.", lambda: R(5, 12) * R(5, 6)),
            Wrong(r"$\frac{11}{30}$", R(11, 30), r"You ignored the brackets and divided $\frac{1}{4}$ by $\frac{5}{6}$ first.", lambda: R(2, 3) - R(1, 4) / R(5, 6)),
            Wrong(r"$2$", 2, r"You turned the answer upside down: $\frac{5}{12} \times \frac{6}{5} = \frac{1}{2}$.", lambda: R(5, 6) / R(5, 12)),
        ],
        solve=lambda: (R(2, 3) - R(1, 4)) / R(5, 6),
        working=r"""Brackets first: $\dfrac{2}{3} - \dfrac{1}{4} = \dfrac{8 - 3}{12} = \dfrac{5}{12}$.

Then $\dfrac{5}{12} \div \dfrac{5}{6} = \dfrac{5}{12} \times \dfrac{6}{5} = \dfrac{1}{2}$.""",
    ),
    # ── Logical reasoning ──────────────────────────────────────────────────
    Q(
        id="maths-logic-01",
        topic="Logical Reasoning",
        ref=TOPICS["Logical Reasoning"],
        stem=r"What is the negation of the statement “All the students passed the test”?",
        answer=(r"Not all the students passed the test", "Not all the students passed the test"),
        wrong=[
            Wrong(r"No student passed the test", "No student passed the test", r"That is too strong. If even one student failed, “All passed” is false, but some may still have passed."),
            Wrong(r"Some students passed the test", "Some students passed the test", r"That can be true at the same time as the original statement, so it is not its negation."),
            Wrong(r"All the students failed the test", "All the students failed the test", r"That is too strong. The negation only says at least one student did not pass."),
        ],
        solve=lambda: "Not all the students passed the test",
        working=r"""The negation is true exactly when the statement is false. “All passed” is false as soon as one student did not pass, so the negation is “Not all the students passed the test” (at least one student failed).""",
    ),
    Q(
        id="maths-logic-02",
        topic="Logical Reasoning",
        ref=TOPICS["Logical Reasoning"],
        stem=r"Which statement means the same as “If it rains, the ground is wet”?",
        answer=(r"If the ground is not wet, it did not rain", "If the ground is not wet, it did not rain"),
        wrong=[
            Wrong(r"If the ground is wet, it rained", "If the ground is wet, it rained", r"That is the converse. The ground could be wet for another reason (someone watered it)."),
            Wrong(r"If it does not rain, the ground is not wet", "If it does not rain, the ground is not wet", r"That is the inverse. The ground could still be wet without rain."),
            Wrong(r"It rains and the ground is wet", "It rains and the ground is wet", r"That says both things happen. The original only says what follows if it rains."),
        ],
        solve=lambda: "If the ground is not wet, it did not rain",
        working=r"""“If $p$, then $q$” always means the same as its contrapositive, “If not $q$, then not $p$”.

Here: if the ground is not wet, it did not rain.""",
    ),
    Q(
        id="maths-logic-03",
        topic="Logical Reasoning",
        ref=TOPICS["Logical Reasoning"],
        stem=r"$p$: 7 is a prime number. $q$: 9 is an even number. Which of these statements is true?",
        answer=(r"$p$ or $q$", "p or q"),
        wrong=[
            Wrong(r"$p$ and $q$", "p and q", r"“and” needs both to be true, but $q$ is false (9 is odd)."),
            Wrong(r"not $p$", "not p", r"$p$ is true (7 is prime), so “not $p$” is false."),
            Wrong(r"If $p$ then $q$", "If p then q", r"A true statement cannot imply a false one: $p$ is true and $q$ is false, so this is false."),
        ],
        solve=lambda: next(s for s in ["p and q", "not p", "p or q", "If p then q"] if truth(s, True, False)),
        working=r"""$p$ is true (7 is prime) and $q$ is false (9 is odd).

“$p$ or $q$” is true when at least one part is true, so it is true. “$p$ and $q$”, “not $p$” and “if $p$ then $q$” are all false.""",
    ),
    Q(
        id="maths-logic-04",
        topic="Logical Reasoning",
        ref=TOPICS["Logical Reasoning"],
        stem=r"All doctors are graduates. Musa is not a graduate. Which conclusion is valid?",
        answer=(r"Musa is not a doctor", "Musa is not a doctor"),
        wrong=[
            Wrong(r"Musa is a doctor", "Musa is a doctor", r"Every doctor is a graduate, and Musa is not a graduate, so he cannot be a doctor."),
            Wrong(r"Musa may be a doctor", "Musa may be a doctor", r"Every doctor is inside the set of graduates. Musa is outside that set, so he cannot be a doctor."),
            Wrong(r"Some graduates are not doctors", "Some graduates are not doctors", r"That may be true in real life, but it does not follow from the two statements given."),
        ],
        solve=lambda: "Musa is not a doctor",
        working=r"""Draw the set of doctors inside the set of graduates. Musa is outside the graduates' set, so he is also outside the doctors' set: Musa is not a doctor.""",
    ),
    Q(
        id="maths-logic-05",
        topic="Logical Reasoning",
        ref=TOPICS["Logical Reasoning"],
        stem=r"The statement “if $p$ then $q$” is false. What can you say about $p$ and $q$?",
        answer=(r"$p$ is true and $q$ is false", "p is true and q is false"),
        wrong=[
            Wrong(r"$p$ is false and $q$ is true", "p is false and q is true", r"When $p$ is false, “if $p$ then $q$” counts as true, whatever $q$ is."),
            Wrong(r"$p$ and $q$ are both false", "p and q are both false", r"When $p$ is false, “if $p$ then $q$” counts as true."),
            Wrong(r"$p$ and $q$ are both true", "p and q are both true", r"A true statement implying a true statement is true."),
        ],
        solve=lambda: next(AFTER_IMPLICATION[(p, q)] for p in (True, False) for q in (True, False) if not truth("If p then q", p, q)),
        working=r"""“If $p$ then $q$” is false only when $p$ is true and $q$ is false (the promise is broken). In every other case it is true.""",
    ),
    # ── Algebraic expressions ──────────────────────────────────────────────
    Q(
        id="maths-expressions-01",
        topic="Algebraic Expressions",
        ref=TOPICS["Algebraic Expressions"],
        stem=r"A trader buys $x$ bags of rice at Le 650 each and $y$ gallons of palm oil at Le 120 each. Which expression gives the total cost, $C$ Leones?",
        answer=(r"$C = 650x + 120y$", 650 * x + 120 * y),
        wrong=[
            Wrong(r"$C = 650y + 120x$", 650 * y + 120 * x, r"You swapped the prices. The rice ($x$ bags) costs Le 650 each."),
            Wrong(r"$C = 770xy$", 770 * x * y, r"You added the prices and multiplied by both quantities. Find the cost of each item separately, then add."),
            Wrong(r"$C = 770(x + y)$", 770 * (x + y), r"That charges Le 770 for every bag and every gallon. Each item has its own price."),
        ],
        solve=lambda: 650 * x + 120 * y,
        working=r"""Rice: $x$ bags at Le 650 cost $650x$. Oil: $y$ gallons at Le 120 cost $120y$.

Total: $C = 650x + 120y$""",
    ),
    Q(
        id="maths-expressions-02",
        topic="Algebraic Expressions",
        ref=TOPICS["Algebraic Expressions"],
        stem=r"Evaluate $3a^{2}b - 2ab^{2}$ when $a = -2$ and $b = 3$.",
        answer=(r"$72$", 72),
        wrong=[
            Wrong(r"$0$", 0, r"$a^{2} = (-2)^{2} = +4$, not $-4$.", lambda: 3 * (-4) * 3 - 2 * (-2) * 9),
            Wrong(r"$36$", 36, r"You left out the second term. $-2ab^{2} = -2(-2)(9) = +36$.", lambda: 3 * 4 * 3),
            Wrong(r"$144$", 144, r"You squared $3a$. In $3a^{2}b$ only $a$ is squared.", lambda: (3 * -2) ** 2 * 3 - 2 * (-2) * 9),
        ],
        solve=lambda: (3 * sp.Symbol("a") ** 2 * sp.Symbol("b") - 2 * sp.Symbol("a") * sp.Symbol("b") ** 2).subs({"a": -2, "b": 3}),
        working=r"""$3a^{2}b = 3 \times 4 \times 3 = 36$ and $2ab^{2} = 2 \times (-2) \times 9 = -36$.

$36 - (-36) = 72$""",
    ),
    Q(
        id="maths-expressions-03",
        topic="Algebraic Expressions",
        ref=TOPICS["Algebraic Expressions"],
        stem=r"If $x = 3$ and $y = -1$, find the value of $\dfrac{x^{2} - y^{2}}{x + y}$.",
        answer=(r"$4$", 4),
        wrong=[
            Wrong(r"$2$", 2, r"2 is the value of $x + y$, the bottom line only.", lambda: 3 + (-1)),
            Wrong(r"$5$", 5, r"$y^{2} = (-1)^{2} = +1$, so the top is $9 - 1 = 8$, not 10.", lambda: R(9 + 1, 2)),
            Wrong(r"$8$", 8, r"8 is the top line. Divide it by $x + y = 2$.", lambda: 9 - 1),
        ],
        solve=lambda: ((x**2 - y**2) / (x + y)).subs({x: 3, y: -1}),
        working=r"""Top: $3^{2} - (-1)^{2} = 9 - 1 = 8$. Bottom: $3 + (-1) = 2$.

$\dfrac{8}{2} = 4$ (or use $\dfrac{x^{2} - y^{2}}{x + y} = x - y = 3 - (-1) = 4$).""",
    ),
    Q(
        id="maths-expressions-04",
        topic="Algebraic Expressions",
        ref=TOPICS["Algebraic Expressions"],
        stem=r"Hiring a hall costs Le 500 plus Le 25 for each guest. How much does it cost for 40 guests?",
        answer=(r"Le 1,500", 1500),
        wrong=[
            Wrong(r"Le 525", 525, r"You added Le 25 only once. It is Le 25 for each of the 40 guests.", lambda: 500 + 25),
            Wrong(r"Le 1,000", 1000, r"You left out the Le 500 for the hall.", lambda: 25 * 40),
            Wrong(r"Le 21,000", 21000, r"$(500 + 25) \times 40$ charges the Le 500 forty times. The hall is paid for once.", lambda: (500 + 25) * 40),
        ],
        solve=lambda: (500 + 25 * n).subs(n, 40),
        working=r"""Cost $= 500 + 25n$. For $n = 40$: $500 + 25 \times 40 = 500 + 1000 = $ Le 1,500.""",
    ),
    Q(
        id="maths-expressions-05",
        topic="Algebraic Expressions",
        ref=TOPICS["Algebraic Expressions"],
        stem=r"Think of a number $x$. Double it, subtract 7, then multiply the result by 3. Which expression gives the final answer?",
        answer=(r"$6x - 21$", 6 * x - 21),
        wrong=[
            Wrong(r"$6x - 7$", 6 * x - 7, r"You multiplied only $2x$ by 3. The whole result, $2x - 7$, is multiplied by 3."),
            Wrong(r"$2x - 21$", 2 * x - 21, r"You multiplied only the 7 by 3. The whole result, $2x - 7$, is multiplied by 3."),
            Wrong(r"$6x - 14$", 6 * x - 14, r"You multiplied by 3 before subtracting 7: that is $2(3x - 7)$.", lambda: sp.expand(2 * (3 * x - 7))),
        ],
        solve=lambda: sp.expand(3 * (2 * x - 7)),
        working=r"""Double: $2x$. Subtract 7: $2x - 7$. Multiply by 3: $3(2x - 7) = 6x - 21$.""",
    ),
    # ── Operations on algebraic expressions ────────────────────────────────
    Q(
        id="maths-operations-01",
        topic="Operations on Algebraic Expressions",
        ref=TOPICS["Operations on Algebraic Expressions"],
        stem=r"Expand $(2x - 3)(x + 5)$.",
        answer=(r"$2x^{2} + 7x - 15$", 2 * x**2 + 7 * x - 15),
        wrong=[
            Wrong(r"$2x^{2} - 15$", 2 * x**2 - 15, r"You multiplied only the first terms and the last terms. Include $2x \times 5$ and $-3 \times x$."),
            Wrong(r"$2x^{2} + 13x - 15$", 2 * x**2 + 13 * x - 15, r"Sign slip: $-3 \times x = -3x$, so the middle term is $10x - 3x = 7x$.", lambda: sp.expand(2 * x**2 + 10 * x + 3 * x - 15)),
            Wrong(r"$2x^{2} + 7x + 15$", 2 * x**2 + 7 * x + 15, r"Sign slip: $-3 \times 5 = -15$."),
        ],
        solve=lambda: sp.expand((2 * x - 3) * (x + 5)),
        working=r"""$(2x - 3)(x + 5) = 2x^{2} + 10x - 3x - 15 = 2x^{2} + 7x - 15$""",
    ),
    Q(
        id="maths-operations-02",
        topic="Operations on Algebraic Expressions",
        ref=TOPICS["Operations on Algebraic Expressions"],
        stem=r"Factorise $6xy - 9x^{2}$ completely.",
        answer=(r"$3x(2y - 3x)$", 3 * x * (2 * y - 3 * x)),
        wrong=[
            Wrong(r"$3x(2y - 3)$", 3 * x * (2 * y - 3), r"Check by expanding: $3x \times 3 = 9x$, not $9x^{2}$. The bracket needs $3x$."),
            Wrong(r"$3x(2y + 3x)$", 3 * x * (2 * y + 3 * x), r"Sign slip: the second term is $-9x^{2}$, so the bracket has $-3x$."),
            Wrong(r"$3x^{2}(2y - 3)$", 3 * x**2 * (2 * y - 3), r"You took out $x^{2}$, but $6xy$ has only one factor of $x$. Check by expanding: $3x^{2} \times 2y = 6x^{2}y$."),
        ],
        solve=lambda: sp.factor(6 * x * y - 9 * x**2),
        working=r"""The highest common factor of $6xy$ and $9x^{2}$ is $3x$.

$6xy - 9x^{2} = 3x(2y - 3x)$. Check: $3x \times 2y = 6xy$ and $3x \times 3x = 9x^{2}$. ✓""",
    ),
    Q(
        id="maths-operations-03",
        topic="Operations on Algebraic Expressions",
        ref=TOPICS["Operations on Algebraic Expressions"],
        stem=r"Without using a calculator, evaluate $63^{2} - 37^{2}$.",
        answer=(r"$2600$", 2600),
        wrong=[
            Wrong(r"$52$", 52, r"You doubled instead of squaring: $63 \times 2 - 37 \times 2$.", lambda: 63 * 2 - 37 * 2),
            Wrong(r"$676$", 676, r"$63^{2} - 37^{2}$ is not $(63 - 37)^{2}$. Use the difference of two squares.", lambda: (63 - 37) ** 2),
            Wrong(r"$10000$", 10000, r"$63^{2} - 37^{2}$ is not $(63 + 37)^{2}$. Use the difference of two squares.", lambda: (63 + 37) ** 2),
        ],
        solve=lambda: 63**2 - 37**2,
        working=r"""Difference of two squares: $a^{2} - b^{2} = (a + b)(a - b)$.

$63^{2} - 37^{2} = (63 + 37)(63 - 37) = 100 \times 26 = 2600$""",
    ),
    Q(
        id="maths-operations-04",
        topic="Operations on Algebraic Expressions",
        ref=TOPICS["Operations on Algebraic Expressions"],
        stem=r"A binary operation $*$ is defined by $a * b = 2a + b - ab$. Evaluate $3 * (-2)$.",
        answer=(r"$10$", 10),
        wrong=[
            Wrong(r"$-2$", -2, r"Sign slip: $-ab = -(3)(-2) = +6$.", lambda: 2 * 3 + (-2) - 6),
            Wrong(r"$5$", 5, r"You swapped $a$ and $b$. Here $a = 3$ and $b = -2$.", lambda: 2 * (-2) + 3 - (-2) * 3),
            Wrong(r"$7$", 7, r"You forgot to double $a$: the rule starts with $2a$.", lambda: 3 + (-2) - 3 * (-2)),
        ],
        solve=lambda: (lambda a, b: 2 * a + b - a * b)(3, -2),
        working=r"""With $a = 3$ and $b = -2$:

$3 * (-2) = 2(3) + (-2) - (3)(-2) = 6 - 2 + 6 = 10$""",
    ),
    Q(
        id="maths-operations-05",
        topic="Operations on Algebraic Expressions",
        ref=TOPICS["Operations on Algebraic Expressions"],
        stem=r"Factorise $x^{2} - 5x - 14$.",
        answer=(r"$(x - 7)(x + 2)$", (x - 7) * (x + 2)),
        wrong=[
            Wrong(r"$(x + 7)(x - 2)$", (x + 7) * (x - 2), r"Signs swapped. Expand to check: that gives $+5x$, not $-5x$."),
            Wrong(r"$(x - 7)(x - 2)$", (x - 7) * (x - 2), r"That gives $+14$ at the end. The numbers must multiply to $-14$."),
            Wrong(r"$(x + 7)(x + 2)$", (x + 7) * (x + 2), r"That gives $+9x + 14$. The numbers must multiply to $-14$ and add to $-5$."),
        ],
        solve=lambda: sp.factor(x**2 - 5 * x - 14),
        working=r"""Find two numbers that multiply to $-14$ and add to $-5$: $-7$ and $2$.

$x^{2} - 5x - 14 = (x - 7)(x + 2)$""",
    ),
    # ── Linear equations ───────────────────────────────────────────────────
    Q(
        id="maths-equations-01",
        topic="Linear Equations",
        ref=TOPICS["Linear Equations"],
        stem=r"Solve $\dfrac{x - 2}{3} - \dfrac{x + 1}{4} = 1$.",
        answer=(r"$23$", 23),
        wrong=[
            Wrong(r"$12$", 12, r"You multiplied the fractions by 12 but not the right-hand side: $1 \times 12 = 12$.", lambda: sp.solve(4 * (x - 2) - 3 * (x + 1) - 1, x)[0]),
            Wrong(r"$17$", 17, r"Sign slip: $-3(x + 1) = -3x - 3$, not $-3x + 3$.", lambda: sp.solve(4 * (x - 2) - 3 * x + 3 - 12, x)[0]),
            Wrong(r"$18$", 18, r"The LCM of 3 and 4 is 12, not 7.", lambda: sp.solve(4 * (x - 2) - 3 * (x + 1) - 7, x)[0]),
        ],
        solve=lambda: sp.solve(sp.Eq((x - 2) / 3 - (x + 1) / 4, 1), x)[0],
        working=r"""Multiply every term by 12: $4(x - 2) - 3(x + 1) = 12$.

$4x - 8 - 3x - 3 = 12$, so $x - 11 = 12$ and $x = 23$.""",
    ),
    Q(
        id="maths-equations-02",
        topic="Linear Equations",
        ref=TOPICS["Linear Equations"],
        stem=r"Solve the simultaneous equations $2x + 3y = 12$ and $x - y = 1$.",
        answer=(r"$x = 3,\ y = 2$", (3, 2)),
        wrong=[
            Wrong(r"$x = 2,\ y = 3$", (2, 3), r"You swapped the values. Check: $2(2) + 3(3) = 13$, not 12."),
            Wrong(r"$x = 3.5,\ y = 2.5$", (R(7, 2), R(5, 2)), r"From $x = 1 + y$, $2(1 + y) = 2 + 2y$, not $2 + y$.", lambda: (lambda s: (s[x], s[y]))(sp.solve([2 + y + 3 * y - 12, x - 1 - y], [x, y]))),
            Wrong(r"$x = 1.8,\ y = 2.8$", (R(9, 5), R(14, 5)), r"Sign slip: $x - y = 1$ gives $x = 1 + y$, not $y - 1$.", lambda: (lambda s: (s[x], s[y]))(sp.solve([2 * (y - 1) + 3 * y - 12, x - (y - 1)], [x, y]))),
        ],
        solve=lambda: (lambda s: (s[x], s[y]))(sp.solve([2 * x + 3 * y - 12, x - y - 1], [x, y])),
        working=r"""From $x - y = 1$: $x = 1 + y$.

Substitute: $2(1 + y) + 3y = 12$, so $2 + 5y = 12$, $y = 2$ and $x = 3$.

Check: $2(3) + 3(2) = 12$ ✓ and $3 - 2 = 1$ ✓""",
    ),
    Q(
        id="maths-equations-03",
        topic="Linear Equations",
        ref=TOPICS["Linear Equations"],
        stem=r"The sum of three consecutive odd numbers is 63. Find the largest of the three numbers.",
        answer=(r"$23$", 23),
        wrong=[
            Wrong(r"$19$", 19, r"19 is the smallest of the three. The question asks for the largest.", lambda: sp.solve(3 * x + 6 - 63, x)[0]),
            Wrong(r"$21$", 21, r"21 is the middle number. The question asks for the largest."),
            Wrong(r"$22$", 22, r"You used consecutive numbers ($x$, $x + 1$, $x + 2$). Consecutive odd numbers go up in 2s.", lambda: sp.solve(3 * x + 3 - 63, x)[0] + 2),
        ],
        solve=lambda: sp.solve(x + (x + 2) + (x + 4) - 63, x)[0] + 4,
        working=r"""Let the numbers be $x$, $x + 2$ and $x + 4$.

$3x + 6 = 63$, so $x = 19$. The numbers are 19, 21 and 23; the largest is 23.""",
    ),
    Q(
        id="maths-equations-04",
        topic="Linear Equations",
        ref=TOPICS["Linear Equations"],
        stem=r"Solve $5(2x - 3) = 3(x + 2)$.",
        answer=(r"$3$", 3),
        wrong=[
            Wrong(r"$-\frac{9}{7}$", R(-9, 7), r"When you moved $-15$ across, you kept its sign. It becomes $+15$: $7x = 6 + 15$.", lambda: sp.solve(7 * x - (6 - 15), x)[0]),
            Wrong(r"$\frac{9}{7}$", R(9, 7), r"You multiplied only $2x$ by 5: $5(2x - 3) = 10x - 15$, not $10x - 3$.", lambda: sp.solve(10 * x - 3 - (3 * x + 6), x)[0]),
            Wrong(r"$\frac{17}{7}$", R(17, 7), r"You multiplied only $x$ by 3: $3(x + 2) = 3x + 6$, not $3x + 2$.", lambda: sp.solve(10 * x - 15 - (3 * x + 2), x)[0]),
        ],
        solve=lambda: sp.solve(sp.Eq(5 * (2 * x - 3), 3 * (x + 2)), x)[0],
        working=r"""Expand: $10x - 15 = 3x + 6$.

Collect terms: $10x - 3x = 6 + 15$, so $7x = 21$ and $x = 3$.""",
    ),
    Q(
        id="maths-equations-05",
        topic="Linear Equations",
        ref=TOPICS["Linear Equations"],
        stem=r"Kadiatu is 4 times as old as her son. In 6 years' time she will be 3 times as old as he will be. How old is her son now?",
        answer=(r"12 years", 12),
        wrong=[
            Wrong(r"18 years", 18, r"18 is the son's age in 6 years' time. The question asks for his age now.", lambda: 12 + 6),
            Wrong(r"48 years", 48, r"48 is Kadiatu's age now. The question asks for her son's age.", lambda: 4 * 12),
            Wrong(r"54 years", 54, r"54 is Kadiatu's age in 6 years' time.", lambda: 4 * 12 + 6),
        ],
        solve=lambda: sp.solve(sp.Eq(4 * x + 6, 3 * (x + 6)), x)[0],
        working=r"""Let the son be $s$ years old. Kadiatu is $4s$.

In 6 years: $4s + 6 = 3(s + 6)$, so $4s + 6 = 3s + 18$ and $s = 12$.

Check: now 12 and 48; in 6 years 18 and 54, and $54 = 3 \times 18$. ✓""",
    ),
    # ── Graphs of linear and quadratic functions ───────────────────────────
    Q(
        id="maths-graphs-01",
        topic="Graphs of Linear and Quadratic Functions",
        ref=TOPICS["Graphs of Linear and Quadratic Functions"],
        stem=GRAPH_STEM + r"Use the graph to find the roots of $x^{2} - 2x - 3 = 0$.",
        answer=(r"$x = -1$ or $x = 3$", frozenset({-1, 3})),
        wrong=[
            Wrong(r"$x = 1$ or $x = -3$", frozenset({1, -3}), r"Signs swapped. Read where the curve crosses the $x$-axis: at $-1$ and $3$."),
            Wrong(r"$x = -3$", frozenset({-3}), r"$-3$ is where the curve crosses the $y$-axis. The roots are where it crosses the $x$-axis."),
            Wrong(r"$x = 1$", frozenset({1}), r"$x = 1$ is the line of symmetry, where the curve is lowest. The roots are where it crosses the $x$-axis."),
        ],
        solve=lambda: frozenset(sp.solve(quad(x), x)),
        diagram=fig_quad,
        working=r"""The roots of $x^{2} - 2x - 3 = 0$ are the $x$-values where $y = 0$, that is, where the curve crosses the $x$-axis: $x = -1$ and $x = 3$.

Check: $(x + 1)(x - 3) = x^{2} - 2x - 3$. ✓""",
    ),
    Q(
        id="maths-graphs-02",
        topic="Graphs of Linear and Quadratic Functions",
        ref=TOPICS["Graphs of Linear and Quadratic Functions"],
        stem=GRAPH_STEM + r"What is the minimum value of $y$?",
        answer=(r"$-4$", -4),
        wrong=[
            Wrong(r"$-3$", -3, r"$-3$ is where the curve crosses the $y$-axis. The lowest point is lower."),
            Wrong(r"$0$", 0, r"$y = 0$ is where the curve crosses the $x$-axis, not its lowest point."),
            Wrong(r"$1$", 1, r"1 is the $x$-value of the lowest point. The minimum value is the $y$-value there."),
        ],
        solve=lambda: min(quad(v / 100) for v in range(-200, 401)),
        diagram=fig_quad,
        working=r"""The lowest point of the curve is $(1, -4)$, so the minimum value of $y$ is $-4$.

Check: at $x = 1$, $y = 1 - 2 - 3 = -4$.""",
    ),
    Q(
        id="maths-graphs-03",
        topic="Graphs of Linear and Quadratic Functions",
        ref=TOPICS["Graphs of Linear and Quadratic Functions"],
        stem=GRAPH_STEM + r"What is the equation of the line of symmetry of the curve?",
        answer=(r"$x = 1$", "x=1"),
        wrong=[
            Wrong(r"$y = 1$", "y=1", r"The line of symmetry of this curve is vertical, so its equation starts $x = \ldots$"),
            Wrong(r"$x = -4$", "x=-4", r"$-4$ is the minimum $y$-value. The line of symmetry goes through the $x$-value of the lowest point."),
            Wrong(r"$y = -4$", "y=-4", r"$y = -4$ is the horizontal line through the lowest point. The line of symmetry is vertical."),
        ],
        solve=lambda: f"x={int(sum(sp.solve(quad(x), x)) / 2)}",
        diagram=fig_quad,
        working=r"""The curve is symmetrical about the vertical line through its lowest point, $(1, -4)$: $x = 1$.

(It is also halfway between the roots: $\frac{-1 + 3}{2} = 1$.)""",
    ),
    Q(
        id="maths-graphs-04",
        topic="Graphs of Linear and Quadratic Functions",
        ref=TOPICS["Graphs of Linear and Quadratic Functions"],
        stem=r"The graphs of $y = x^{2} - 2x - 3$ and $y = 2x + 1$ are drawn on the same axes. The $x$-values where they meet are the roots of which equation?",
        answer=(r"$x^{2} - 4x - 4 = 0$", x**2 - 4 * x - 4),
        wrong=[
            Wrong(r"$x^{2} - 2 = 0$", x**2 - 2, r"Sign slip: subtract $2x + 1$, so $-2x - 2x = -4x$ and $-3 - 1 = -4$.", lambda: sp.expand(quad(x) + 2 * x + 1)),
            Wrong(r"$x^{2} - 2x - 4 = 0$", x**2 - 2 * x - 4, r"You subtracted only the 1. Subtract the whole of $2x + 1$.", lambda: sp.expand(quad(x) - 1)),
            Wrong(r"$x^{2} - 4x - 2 = 0$", x**2 - 4 * x - 2, r"Sign slip with the constants: $-3 - 1 = -4$.", lambda: sp.expand(quad(x) - 2 * x + 1)),
        ],
        solve=lambda: sp.expand(quad(x) - (2 * x + 1)),
        working=r"""Where the graphs meet, the $y$-values are equal:

$x^{2} - 2x - 3 = 2x + 1$, so $x^{2} - 4x - 4 = 0$.""",
    ),
    Q(
        id="maths-graphs-05",
        topic="Graphs of Linear and Quadratic Functions",
        ref=TOPICS["Graphs of Linear and Quadratic Functions"],
        stem=r"Where does the graph of $y = 3 - 2x$ cross the $x$-axis?",
        answer=(r"$(1.5, 0)$", (R(3, 2), 0)),
        wrong=[
            Wrong(r"$(0, 3)$", (0, 3), r"That is where the line crosses the $y$-axis."),
            Wrong(r"$(-1.5, 0)$", (R(-3, 2), 0), r"Sign slip: $0 = 3 - 2x$ gives $2x = 3$, so $x = 1.5$."),
            Wrong(r"$(3, 0)$", (3, 0), r"You set $x$ equal to the constant. On the $x$-axis $y = 0$, so solve $0 = 3 - 2x$."),
        ],
        solve=lambda: (sp.solve(3 - 2 * x, x)[0], 0),
        working=r"""On the $x$-axis, $y = 0$: $0 = 3 - 2x$, so $2x = 3$ and $x = 1.5$.

The line crosses the $x$-axis at $(1.5, 0)$.""",
    ),
    # ── Algebraic fractions ────────────────────────────────────────────────
    Q(
        id="maths-algfractions-01",
        topic="Algebraic Fractions",
        ref=TOPICS["Algebraic Fractions"],
        stem=r"Simplify $\dfrac{2}{x} + \dfrac{3}{2x}$.",
        answer=(r"$\frac{7}{2x}$", 7 / (2 * x)),
        wrong=[
            Wrong(r"$\frac{5}{3x}$", 5 / (3 * x), r"You added the tops and the bottoms. Use a common denominator, $2x$."),
            Wrong(r"$\frac{5}{2x}$", 5 / (2 * x), r"You used the common denominator $2x$ but did not change $\frac{2}{x}$ to $\frac{4}{2x}$."),
            Wrong(r"$\frac{3}{x^{2}}$", 3 / x**2, r"You multiplied the fractions. The question says add."),
        ],
        solve=lambda: sp.simplify(2 / x + 3 / (2 * x)),
        working=r"""Common denominator $2x$: $\dfrac{2}{x} = \dfrac{4}{2x}$.

$\dfrac{4}{2x} + \dfrac{3}{2x} = \dfrac{7}{2x}$""",
    ),
    Q(
        id="maths-algfractions-02",
        topic="Algebraic Fractions",
        ref=TOPICS["Algebraic Fractions"],
        stem=r"For what values of $x$ is $\dfrac{x + 4}{x^{2} - 9}$ undefined?",
        answer=(r"$x = 3$ or $x = -3$", frozenset({3, -3})),
        wrong=[
            Wrong(r"$x = -4$", frozenset({-4}), r"$x = -4$ makes the top 0, so the fraction equals 0. It is undefined when the bottom is 0."),
            Wrong(r"$x = 9$", frozenset({9}), r"$x^{2} = 9$ means $x = 3$ or $x = -3$, not $x = 9$."),
            Wrong(r"$x = 3$", frozenset({3}), r"$(-3)^{2} = 9$ too, so $x = -3$ also makes the bottom 0."),
        ],
        solve=lambda: frozenset(sp.solve(x**2 - 9, x)),
        working=r"""A fraction is undefined when its denominator is 0:

$x^{2} - 9 = 0$, so $x^{2} = 9$ and $x = 3$ or $x = -3$.""",
    ),
    Q(
        id="maths-algfractions-03",
        topic="Algebraic Fractions",
        ref=TOPICS["Algebraic Fractions"],
        stem=r"Simplify $\dfrac{x^{2} - 4}{x^{2} + x - 6}$.",
        answer=(r"$\frac{x + 2}{x + 3}$", (x + 2) / (x + 3)),
        wrong=[
            Wrong(r"$\frac{x - 2}{x + 3}$", (x - 2) / (x + 3), r"$x^{2} - 4 = (x + 2)(x - 2)$. The $(x - 2)$ cancels, leaving $(x + 2)$ on top."),
            Wrong(r"$\frac{x + 2}{x - 3}$", (x + 2) / (x - 3), r"$x^{2} + x - 6 = (x + 3)(x - 2)$, not $(x - 3)(x + 2)$."),
            Wrong(r"$\frac{-4}{x - 6}$", -4 / (x - 6), r"You cancelled the $x^{2}$ terms. Only common factors cancel, not terms."),
        ],
        solve=lambda: sp.cancel((x**2 - 4) / (x**2 + x - 6)),
        working=r"""Factorise top and bottom: $\dfrac{(x + 2)(x - 2)}{(x + 3)(x - 2)}$.

Cancel the common factor $(x - 2)$: $\dfrac{x + 2}{x + 3}$.""",
    ),
    Q(
        id="maths-algfractions-04",
        topic="Algebraic Fractions",
        ref=TOPICS["Algebraic Fractions"],
        stem=r"Solve $\dfrac{3}{x - 1} = \dfrac{2}{x + 2}$.",
        answer=(r"$-8$", -8),
        wrong=[
            Wrong(r"$-4$", -4, r"Sign slip: $2(x - 1) = 2x - 2$, so $3x + 6 = 2x - 2$.", lambda: sp.solve(3 * x + 6 - (2 * x + 2), x)[0]),
            Wrong(r"$-3$", -3, r"You multiplied only the first term in each bracket: $3(x + 2) = 3x + 6$ and $2(x - 1) = 2x - 2$.", lambda: sp.solve(3 * x + 2 - (2 * x - 1), x)[0]),
            Wrong(r"$8$", 8, r"Sign slip at the end: $x = -2 - 6 = -8$.", lambda: -sp.solve(3 * (x + 2) - 2 * (x - 1), x)[0]),
        ],
        solve=lambda: sp.solve(sp.Eq(3 / (x - 1), 2 / (x + 2)), x)[0],
        working=r"""Cross-multiply: $3(x + 2) = 2(x - 1)$.

$3x + 6 = 2x - 2$, so $x = -8$.""",
    ),
    Q(
        id="maths-algfractions-05",
        topic="Algebraic Fractions",
        ref=TOPICS["Algebraic Fractions"],
        stem=r"Simplify $\dfrac{1}{x - 1} - \dfrac{1}{x + 1}$.",
        answer=(r"$\frac{2}{x^{2} - 1}$", 2 / (x**2 - 1)),
        wrong=[
            Wrong(r"$\frac{-2}{x^{2} - 1}$", -2 / (x**2 - 1), r"Order matters: $(x + 1) - (x - 1) = 2$, not $-2$."),
            Wrong(r"$\frac{2x}{x^{2} - 1}$", 2 * x / (x**2 - 1), r"You added the tops: $(x + 1) + (x - 1) = 2x$. The question subtracts."),
            Wrong(r"$0$", 0, r"You subtracted the tops and the bottoms separately. Use a common denominator, $(x - 1)(x + 1)$."),
        ],
        solve=lambda: sp.simplify(1 / (x - 1) - 1 / (x + 1)),
        working=r"""Common denominator $(x - 1)(x + 1) = x^{2} - 1$:

$\dfrac{(x + 1) - (x - 1)}{x^{2} - 1} = \dfrac{2}{x^{2} - 1}$""",
    ),
    # ── Functions and relations ────────────────────────────────────────────
    Q(
        id="maths-functions-01",
        topic="Functions and Relations",
        ref=TOPICS["Functions and Relations"],
        stem=r"If $f(x) = 3x^{2} - 2x + 1$, find $f(-2)$.",
        answer=(r"$17$", 17),
        wrong=[
            Wrong(r"$-7$", -7, r"$(-2)^{2} = +4$, not $-4$.", lambda: 3 * (-4) + 4 + 1),
            Wrong(r"$9$", 9, r"Sign slip: $-2x = -2(-2) = +4$.", lambda: 12 - 4 + 1),
            Wrong(r"$41$", 41, r"You squared $3x$. In $3x^{2}$ only $x$ is squared.", lambda: (3 * -2) ** 2 + 4 + 1),
        ],
        solve=lambda: (3 * x**2 - 2 * x + 1).subs(x, -2),
        working=r"""$f(-2) = 3(-2)^{2} - 2(-2) + 1 = 3(4) + 4 + 1 = 17$""",
    ),
    Q(
        id="maths-functions-02",
        topic="Functions and Relations",
        ref=TOPICS["Functions and Relations"],
        stem=r"What type of mapping is $\{(1, 2), (2, 2), (3, 5)\}$?",
        answer=(r"many-to-one", "many-to-one"),
        wrong=[
            Wrong(r"one-to-one", "one-to-one", r"Two different inputs (1 and 2) both map to 2, so it is not one-to-one."),
            Wrong(r"one-to-many", "one-to-many", r"No input maps to more than one output."),
            Wrong(r"many-to-many", "many-to-many", r"No input maps to more than one output, so it is not many-to-many."),
        ],
        solve=lambda: (lambda pairs: ("many" if len({b for _, b in pairs}) < len({a for a, _ in pairs}) else "one") + "-to-" + ("many" if len(pairs) > len({a for a, _ in pairs}) else "one"))([(1, 2), (2, 2), (3, 5)]),
        order=["one-to-one", "one-to-many", "many-to-one", "many-to-many"],
        working=r"""Each input has exactly one output, but two inputs (1 and 2) share the output 2. So the mapping is many-to-one (and it is a function).""",
    ),
    Q(
        id="maths-functions-03",
        topic="Functions and Relations",
        ref=TOPICS["Functions and Relations"],
        stem=r"A mapping takes $1 \to 5$, $2 \to 8$, $3 \to 11$ and $4 \to 14$. What is its rule?",
        answer=(r"$x \to 3x + 2$", 3 * x + 2),
        wrong=[
            Wrong(r"$x \to x + 4$", x + 4, r"That works for $1 \to 5$ only. Check $2 \to 8$: $2 + 4 = 6$."),
            Wrong(r"$x \to 4x + 1$", 4 * x + 1, r"That works for $1 \to 5$ only. Check $2 \to 8$: $4(2) + 1 = 9$."),
            Wrong(r"$x \to 3x + 5$", 3 * x + 5, r"The outputs go up by 3, so it is $3x + \ldots$, but check $1 \to 5$: $3(1) + 5 = 8$."),
        ],
        solve=lambda: sp.interpolate([(1, 5), (2, 8), (3, 11), (4, 14)], x),
        working=r"""The outputs go up by 3 each time, so the rule is $3x + c$.

From $1 \to 5$: $3 + c = 5$, so $c = 2$. Rule: $x \to 3x + 2$. Check: $4 \to 3(4) + 2 = 14$. ✓""",
    ),
    Q(
        id="maths-functions-04",
        topic="Functions and Relations",
        ref=TOPICS["Functions and Relations"],
        stem=r"Given that $g(x) = 2x - 5$, find $x$ when $g(x) = 9$.",
        answer=(r"$7$", 7),
        wrong=[
            Wrong(r"$2$", 2, r"Sign slip: $2x - 5 = 9$ gives $2x = 14$, not $2x = 4$.", lambda: R(9 - 5, 2)),
            Wrong(r"$4.5$", R(9, 2), r"You left out the $-5$: $2x = 9$.", lambda: R(9, 2)),
            Wrong(r"$13$", 13, r"That is $g(9)$. The question gives the output, 9, and asks for the input.", lambda: 2 * 9 - 5),
        ],
        solve=lambda: sp.solve(2 * x - 5 - 9, x)[0],
        working=r"""$2x - 5 = 9$, so $2x = 14$ and $x = 7$.""",
    ),
    Q(
        id="maths-functions-05",
        topic="Functions and Relations",
        ref=TOPICS["Functions and Relations"],
        stem=r"The function $f: x \to x^{2} + 1$ has domain $\{-2, 0, 1, 2\}$. Find its range.",
        answer=(r"$\{1, 2, 5\}$", frozenset({1, 2, 5})),
        wrong=[
            Wrong(r"$\{-2, 0, 1, 2\}$", frozenset({-2, 0, 1, 2}), r"That is the domain (the inputs). The range is the set of outputs."),
            Wrong(r"$\{-3, 1, 2, 5\}$", frozenset({-3, 1, 2, 5}), r"$(-2)^{2} = +4$, so $-2 \to 5$, not $-3$.", lambda: frozenset({-4 + 1, 0 + 1, 1 + 1, 4 + 1})),
            Wrong(r"$\{0, 1, 4\}$", frozenset({0, 1, 4}), r"You forgot to add 1.", lambda: frozenset(v**2 for v in (-2, 0, 1, 2))),
        ],
        solve=lambda: frozenset(v**2 + 1 for v in (-2, 0, 1, 2)),
        working=r"""$f(-2) = 5$, $f(0) = 1$, $f(1) = 2$, $f(2) = 5$.

The range is the set of outputs: $\{1, 2, 5\}$ (5 is listed once).""",
    ),
    # ── Coordinate geometry ────────────────────────────────────────────────
    Q(
        id="maths-coordinates-01",
        topic="Coordinate Geometry",
        ref=TOPICS["Coordinate Geometry"],
        stem=r"Find the distance between the points $P(-2, 3)$ and $Q(4, -5)$.",
        answer=(r"10 units", 10),
        wrong=[
            Wrong(r"2.83 units", Rounded(8**0.5, dp=2), r"You added the coordinates. Subtract them: $4 - (-2) = 6$ and $-5 - 3 = -8$.", lambda: ((4 + -2) ** 2 + (-5 + 3) ** 2) ** 0.5),
            Wrong(r"14 units", 14, r"You added the horizontal and vertical distances (6 + 8). Use Pythagoras.", lambda: 6 + 8),
            Wrong(r"100 units", 100, r"That is the distance squared. Take the square root.", lambda: 6**2 + 8**2),
        ],
        solve=lambda: sp.sqrt((4 - (-2)) ** 2 + (-5 - 3) ** 2),
        working=r"""$|PQ| = \sqrt{(4 - (-2))^{2} + (-5 - 3)^{2}} = \sqrt{36 + 64} = \sqrt{100} = 10$""",
    ),
    Q(
        id="maths-coordinates-02",
        topic="Coordinate Geometry",
        ref=TOPICS["Coordinate Geometry"],
        stem=r"Find the mid-point of the line joining $A(-3, 4)$ and $B(5, -2)$.",
        answer=(r"$(1, 1)$", (1, 1)),
        wrong=[
            Wrong(r"$(4, -3)$", (4, -3), r"You halved the differences. The mid-point uses the sums: $\left(\frac{-3 + 5}{2}, \frac{4 + (-2)}{2}\right)$.", lambda: (R(5 - (-3), 2), R(-2 - 4, 2))),
            Wrong(r"$(2, 2)$", (2, 2), r"You added the coordinates but forgot to divide by 2.", lambda: (-3 + 5, 4 + (-2))),
            Wrong(r"$(-4, 3)$", (-4, 3), r"You halved the differences the other way round. Add the coordinates, then halve.", lambda: (R(-3 - 5, 2), R(4 - (-2), 2))),
        ],
        solve=lambda: (R(-3 + 5, 2), R(4 + (-2), 2)),
        working=r"""Mid-point $= \left(\dfrac{-3 + 5}{2}, \dfrac{4 + (-2)}{2}\right) = (1, 1)$""",
    ),
    Q(
        id="maths-coordinates-03",
        topic="Coordinate Geometry",
        ref=TOPICS["Coordinate Geometry"],
        stem=r"Find the gradient of the line through $(1, -2)$ and $(4, 7)$.",
        answer=(r"$3$", 3),
        wrong=[
            Wrong(r"$-3$", -3, r"Sign slip: $7 - (-2) = 9$, not $-9$.", lambda: R(-2 - 7, 4 - 1)),
            Wrong(r"$\frac{1}{3}$", R(1, 3), r"You divided the change in $x$ by the change in $y$. Gradient = rise ÷ run.", lambda: R(4 - 1, 7 - (-2))),
            Wrong(r"$\frac{5}{3}$", R(5, 3), r"You added $7 + (-2)$. The rise is $7 - (-2) = 9$.", lambda: R(7 + (-2), 4 - 1)),
        ],
        solve=lambda: R(7 - (-2), 4 - 1),
        working=r"""Gradient $= \dfrac{y_{2} - y_{1}}{x_{2} - x_{1}} = \dfrac{7 - (-2)}{4 - 1} = \dfrac{9}{3} = 3$""",
    ),
    Q(
        id="maths-coordinates-04",
        topic="Coordinate Geometry",
        ref=TOPICS["Coordinate Geometry"],
        stem=r"Find the equation of the line with gradient $-2$ that passes through the point $(1, 3)$.",
        answer=(r"$y = -2x + 5$", -2 * x + 5),
        wrong=[
            Wrong(r"$y = -2x + 1$", -2 * x + 1, r"Sign slip: $-2(x - 1) = -2x + 2$, so $y = -2x + 2 + 3$.", lambda: sp.expand(-2 * (x - 1) - 2 * 2 + 3 + 0 * x)),
            Wrong(r"$y = -2x + 3$", -2 * x + 3, r"You used the $y$-coordinate, 3, as the intercept. The point is $(1, 3)$, not $(0, 3)$."),
            Wrong(r"$y = 2x + 1$", 2 * x + 1, r"The gradient is $-2$, not 2.", lambda: sp.expand(2 * (x - 1) + 3)),
        ],
        solve=lambda: sp.expand(-2 * (x - 1) + 3),
        working=r"""Use $y - y_{1} = m(x - x_{1})$: $y - 3 = -2(x - 1)$.

$y - 3 = -2x + 2$, so $y = -2x + 5$.""",
    ),
    Q(
        id="maths-coordinates-05",
        topic="Coordinate Geometry",
        ref=TOPICS["Coordinate Geometry"],
        stem=r"Find the gradient of the line $3x - 2y + 6 = 0$.",
        answer=(r"$\frac{3}{2}$", R(3, 2)),
        wrong=[
            Wrong(r"$-2$", -2, r"$-2$ is the coefficient of $y$. Make $y$ the subject first."),
            Wrong(r"$-\frac{3}{2}$", R(-3, 2), r"Sign slip: $-2y = -3x - 6$ gives $y = \frac{3}{2}x + 3$.", lambda: R(-3, 2)),
            Wrong(r"$3$", 3, r"3 is the coefficient of $x$ before you make $y$ the subject. Divide by 2.", lambda: 3),
        ],
        solve=lambda: sp.solve(3 * x - 2 * y + 6, y)[0].coeff(x),
        working=r"""Make $y$ the subject: $2y = 3x + 6$, so $y = \frac{3}{2}x + 3$.

The gradient is the coefficient of $x$: $\frac{3}{2}$.""",
    ),
]
