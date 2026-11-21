"""Mathematics practice set 2 (part 1): 50 more original Paper 1 questions on Indices, Number Bases, Surds, Sequences and Series, Percentages, Variation, Change of Subject, Quadratic Equations, Sets and Probability.

Written by WASSCE Tutor in the style of WASSCE Paper 1 (four options, A-D). Nothing
here is copied from a WAEC paper. Each topic's first five questions are in
pilot_p1.py; these test different skills and mistakes. Every answer is worked out
by code, and every wrong option is a mistake a candidate really makes. See SCOPE.md.

Run `python3 scripts/questions/build.py` to check every answer and rebuild.
"""

import sys
from pathlib import Path

import sympy as sp

sys.path.insert(0, str(Path(__file__).resolve().parent))

from maths_common import in_base, make, to_base  # noqa: E402
from qbank import R, Rounded  # noqa: E402

a, n, t, u, v, h, r, x, y, A, K, m, b, c, d = sp.symbols("a n t u v h r x y A K m b c d", positive=True)

TOPICS = {
    "Indices": "A(d) Indices: laws of indices; negative and fractional indices; standard form",
    "Number Bases": "A(a) Number bases: conversion between bases; operations in a base",
    "Surds": "A(j) Surds: simplification and rationalisation of simple surds",
    "Sequences and Series": "A(f) Sequences and series: nth term; A.P. (with sum); G.P. (no sum)",
    "Percentages": "A(m) Percentages: profit and loss, simple and compound interest, percentage error",
    "Variation": "A(o) Variation: direct, inverse, partial and joint",
    "Change of Subject": "B(d) Change of subject of a formula; substitution",
    "Quadratic Equations": "B(e) Quadratic equations: factorisation, formula, forming from roots, word problems",
    "Sets": "A(g) Sets: notation, union, intersection, complement; Venn diagrams (up to 3 sets)",
    "Probability": "H(b) Probability: equally likely outcomes; mutually exclusive and independent events",
}

mq = make(TOPICS)


def base_value(digits: str, base: int) -> int:
    return int(digits, base)


QUESTIONS = [
    # ── Indices ──────────────────────────────────────────────────────────
    mq("maths-indices-06", "Indices",
       r"Simplify $\dfrac{a^{5} \times a^{-2}}{a^{4}}$.",
       (r"$\dfrac{1}{a}$", 1 / a),
       [(r"$a^{3}$", a**3, r"You treated $a^{-2}$ as $a^{2}$: $5 + 2 - 4 = 3$. Adding a negative index lowers the power.", lambda: a ** (5 + 2 - 4)),
        (r"$a^{11}$", a**11, r"You added all the indices, $5 + 2 + 4$. Dividing by $a^{4}$ means subtracting 4.", lambda: a ** (5 + 2 + 4)),
        (r"$a^{-\frac{5}{2}}$", a ** R(-5, 2), r"You multiplied the indices, $5 \times (-2) = -10$, then divided by 4. Multiply powers by adding indices.", lambda: a ** R(5 * -2, 4))],
       lambda: sp.simplify(a**5 * a**-2 / a**4),
       r"""Multiplying powers: add the indices. Dividing: subtract them.

$a^{5} \times a^{-2} \div a^{4} = a^{5 + (-2) - 4} = a^{-1} = \dfrac{1}{a}$"""),
    mq("maths-indices-07", "Indices",
       r"Without using a calculator, evaluate $(4 \times 10^{3}) \times (3 \times 10^{-5})$, giving your answer in standard form.",
       (r"$1.2 \times 10^{-1}$", Rounded(0.12, sf=2)),
       [(r"$1.2 \times 10^{-2}$", Rounded(0.012, sf=2), r"$4 \times 3 = 12 = 1.2 \times 10$, so the index must go up by 1: $10^{-2} \times 10 = 10^{-1}$.", lambda: 1.2 * 10.0 ** (3 - 5)),
        (r"$1.2 \times 10^{9}$", Rounded(1.2e9, sf=2), r"You subtracted the indices, $3 - (-5) = 8$. Multiplying powers of 10 means adding the indices.", lambda: 1.2 * 10.0 ** (1 + 3 - (-5))),
        (r"$1.2 \times 10^{-15}$", Rounded(1.2e-15, sf=2), r"You multiplied the indices, $3 \times (-5)$. Multiplying powers of 10 means adding the indices.", lambda: 1.2 * 10.0 ** (3 * -5))],
       lambda: sp.Rational(4 * 10**3) * 3 * sp.Rational(1, 10**5),
       r"""Multiply the numbers and add the indices:

$(4 \times 3) \times 10^{3 + (-5)} = 12 \times 10^{-2}$

$12$ is not between 1 and 10, so write $12 = 1.2 \times 10^{1}$:

$1.2 \times 10^{1} \times 10^{-2} = 1.2 \times 10^{-1}$"""),
    mq("maths-indices-08", "Indices",
       r"Evaluate $8^{\frac{2}{3}} \times 4^{-\frac{1}{2}}$.",
       (r"$2$", 2),
       [(r"$-8$", -8, r"You took $4^{-\frac{1}{2}}$ as $-2$. A negative index means the reciprocal, not a negative number.", lambda: 4 * -2),
        (r"$\frac{1}{2}$", R(1, 2), r"You found the reciprocal of the whole answer. Only $4^{-\frac{1}{2}}$ is a reciprocal.", lambda: 1 / (4 * R(1, 2))),
        (r"$\frac{8}{3}$", R(8, 3), r"You took $8^{\frac{2}{3}}$ as $8 \times \frac{2}{3}$. A fractional index means a root and a power: $(\sqrt[3]{8})^{2} = 4$.", lambda: 8 * R(2, 3) * R(1, 2))],
       lambda: sp.Integer(8) ** R(2, 3) * sp.Integer(4) ** R(-1, 2),
       r"""$8^{\frac{2}{3}} = (\sqrt[3]{8})^{2} = 2^{2} = 4$

$4^{-\frac{1}{2}} = \dfrac{1}{\sqrt{4}} = \dfrac{1}{2}$

$4 \times \dfrac{1}{2} = 2$"""),
    mq("maths-indices-09", "Indices",
       r"Solve $3^{2x - 1} = 27$.",
       (r"$2$", 2),
       [(r"$1$", 1, r"You wrote $2x = 3 - 1$. Moving $-1$ across the equals sign makes it $+1$: $2x = 4$.", lambda: R(3 - 1, 2)),
        (r"$\frac{3}{2}$", R(3, 2), r"You wrote $2x = 3$ and forgot the $-1$.", lambda: R(3, 2)),
        (r"$14$", 14, r"You equated the index to 27. First write 27 as a power of 3: $27 = 3^{3}$.", lambda: R(27 + 1, 2))],
       lambda: sp.solve(sp.Eq(2 * sp.Symbol("x") - 1, 3), sp.Symbol("x"))[0],
       r"""Write 27 as a power of 3: $27 = 3^{3}$.

$3^{2x - 1} = 3^{3}$, so $2x - 1 = 3$, $2x = 4$, $x = 2$.

Check: $3^{2(2) - 1} = 3^{3} = 27$. ✓"""),
    mq("maths-indices-10", "Indices",
       r"Simplify $\dfrac{3^{n+1} \times 9^{n}}{27^{n}}$.",
       (r"$3$", 3),
       [(r"$3^{1 - n}$", 3 ** (1 - n), r"You wrote $9^{n}$ as $3^{n}$. Since $9 = 3^{2}$, $9^{n} = 3^{2n}$.", lambda: 3 ** ((n + 1) + n - 3 * n)),
        (r"$3^{n + 1}$", 3 ** (n + 1), r"You wrote $27^{n}$ as $3^{2n}$. Since $27 = 3^{3}$, $27^{n} = 3^{3n}$.", lambda: 3 ** ((n + 1) + 2 * n - 2 * n)),
        (r"$3^{6n + 1}$", 3 ** (6 * n + 1), r"You added all the indices. Dividing by $27^{n}$ means subtracting $3n$.", lambda: 3 ** ((n + 1) + 2 * n + 3 * n))],
       lambda: sp.simplify(3 ** (n + 1) * 9**n / 27**n),
       r"""Write everything as a power of 3: $9^{n} = 3^{2n}$ and $27^{n} = 3^{3n}$.

$\dfrac{3^{n+1} \times 3^{2n}}{3^{3n}} = 3^{(n + 1) + 2n - 3n} = 3^{1} = 3$"""),
    # ── Number bases ─────────────────────────────────────────────────────
    mq("maths-bases-06", "Number Bases",
       r"Convert $214_{\text{five}}$ to a number in base ten.",
       (r"$59$", 59),
       [(r"$7$", 7, r"You added the digits, $2 + 1 + 4$. Each digit must be multiplied by its place value.", lambda: 2 + 1 + 4),
        (r"$39$", 39, r"You gave the place values in the wrong order: $2 \times 5 + 1 \times 25 + 4$. The left-hand digit has the largest place value.", lambda: 2 * 5 + 1 * 25 + 4),
        (r"$295$", 295, r"You started the powers of 5 at $5^{1}$ instead of $5^{0}$ for the last digit.", lambda: 2 * 5**3 + 1 * 5**2 + 4 * 5)],
       lambda: base_value("214", 5),
       r"""$214_{\text{five}} = 2 \times 5^{2} + 1 \times 5^{1} + 4 \times 5^{0} = 50 + 5 + 4 = 59$"""),
    mq("maths-bases-07", "Number Bases",
       r"Convert $37_{\text{ten}}$ to a number in base two.",
       (in_base("100101", 2), "100101"),
       [(in_base("101001", 2), "101001", r"You wrote the remainders in the order you found them. Read them from the last remainder to the first."),
        (in_base("10010", 2), "10010", r"You left out the first remainder (the last digit). $37$ is odd, so the base-two number must end in 1."),
        (in_base("100111", 2), "100111", r"That is 39 in base two. Check each remainder: $37 = 32 + 4 + 1$.")],
       lambda: to_base(37, 2),
       r"""Divide by 2 repeatedly and record the remainders:

$37 \div 2 = 18$ r $1$; $18 \div 2 = 9$ r $0$; $9 \div 2 = 4$ r $1$; $4 \div 2 = 2$ r $0$; $2 \div 2 = 1$ r $0$; $1 \div 2 = 0$ r $1$.

Read the remainders from the bottom up: $100101_{\text{two}}$.

Check: $32 + 4 + 1 = 37$. ✓"""),
    mq("maths-bases-08", "Number Bases",
       r"Evaluate $342_{\text{five}} - 134_{\text{five}}$, leaving your answer in base five.",
       (in_base("203", 5), "203"),
       [(in_base("208", 5), "208", r"You borrowed 10, as in base ten. In base five you borrow 5; the digit 8 cannot appear in base five."),
        (in_base("212", 5), "212", r"In each column you took the smaller digit from the larger. When the top digit is smaller you must borrow."),
        (in_base("213", 5), "213", r"You borrowed from the middle column but did not reduce it: the 4 becomes 3 after lending.")],
       lambda: to_base(base_value("342", 5) - base_value("134", 5), 5),
       r"""Units: $2 - 4$ is not possible, so borrow 5 from the next column: $2 + 5 - 4 = 3$.

Fives: the 4 became 3 after lending; $3 - 3 = 0$.

Twenty-fives: $3 - 1 = 2$.

Answer: $203_{\text{five}}$. Check in base ten: $97 - 44 = 53 = 2 \times 25 + 0 \times 5 + 3$. ✓"""),
    mq("maths-bases-09", "Number Bases",
       r"Which of the following CANNOT be a number in base five?",
       (r"$1253$", 1253),
       [(r"$1243$", 1243, r"All the digits 1, 2, 4 and 3 are less than 5, so this can be a base-five number."),
        (r"$3300$", 3300, r"The digits 3 and 0 are allowed in base five."),
        (r"$4021$", 4021, r"The digits 4, 0, 2 and 1 are all less than 5.")],
       lambda: next(k for k in (1243, 1253, 3300, 4021) if any(int(ch) >= 5 for ch in str(k))),
       r"""Base five uses only the digits 0, 1, 2, 3 and 4. The numeral $1253$ contains the digit 5, so it cannot be a base-five number."""),
    mq("maths-bases-10", "Number Bases",
       r"Express $17_{\text{eight}}$ in base two.",
       (in_base("1111", 2), "1111"),
       [(in_base("111", 2), "111", r"You converted only the digit 7. The 1 in front is worth 8."),
        (in_base("1110", 2), "1110", r"That is 14. $17_{\text{eight}} = 8 + 7 = 15$."),
        (in_base("10001", 2), "10001", r"You treated 17 as a base-ten number. $17_{\text{eight}}$ means $1 \times 8 + 7 = 15$.")],
       lambda: to_base(base_value("17", 8), 2),
       r"""$17_{\text{eight}} = 1 \times 8 + 7 = 15$.

$15 = 8 + 4 + 2 + 1 = 1111_{\text{two}}$.

(Shortcut: each base-eight digit is three base-two digits: $1 \to 001$, $7 \to 111$, giving $001111 = 1111_{\text{two}}$.)"""),
    # ── Surds ────────────────────────────────────────────────────────────
    mq("maths-surds-06", "Surds",
       r"Simplify $\sqrt{3}\,(\sqrt{12} - \sqrt{3})$.",
       (r"$3$", 3),
       [(r"$-3$", -3, r"You took $\sqrt{3} \times \sqrt{3}$ as 9. $\sqrt{3} \times \sqrt{3} = 3$.", lambda: 6 - 9),
        (r"$\sqrt{15} - 3$", sp.sqrt(15) - 3, r"You added the numbers under the roots, $3 + 12$. Roots are multiplied: $\sqrt{3} \times \sqrt{12} = \sqrt{36}$.", lambda: sp.sqrt(3 + 12) - 3),
        (r"$6$", 6, r"You multiplied only the first term. $\sqrt{3}$ multiplies both terms in the bracket.", lambda: sp.sqrt(36))],
       lambda: sp.sqrt(3) * (sp.sqrt(12) - sp.sqrt(3)),
       r"""$\sqrt{3} \times \sqrt{12} = \sqrt{36} = 6$ and $\sqrt{3} \times \sqrt{3} = 3$.

So $\sqrt{3}(\sqrt{12} - \sqrt{3}) = 6 - 3 = 3$."""),
    mq("maths-surds-07", "Surds",
       r"Rationalise $\dfrac{6}{\sqrt{3}}$.",
       (r"$2\sqrt{3}$", 2 * sp.sqrt(3)),
       [(r"$\sqrt{2}$", sp.sqrt(2), r"You wrote $\frac{6}{\sqrt{3}}$ as $\sqrt{\frac{6}{3}}$. The 6 is not under the root.", lambda: sp.sqrt(R(6, 3))),
        (r"$2$", 2, r"You divided 6 by 3 and dropped the root."),
        (r"$6\sqrt{3}$", 6 * sp.sqrt(3), r"You multiplied the top by $\sqrt{3}$ but forgot that the bottom becomes $\sqrt{3} \times \sqrt{3} = 3$.", lambda: 6 * sp.sqrt(3))],
       lambda: sp.radsimp(6 / sp.sqrt(3)),
       r"""Multiply the top and bottom by $\sqrt{3}$:

$\dfrac{6}{\sqrt{3}} \times \dfrac{\sqrt{3}}{\sqrt{3}} = \dfrac{6\sqrt{3}}{3} = 2\sqrt{3}$"""),
    mq("maths-surds-08", "Surds",
       r"Given that $\sqrt{2} = 1.414$, evaluate $\dfrac{1}{\sqrt{2}}$ correct to three decimal places.",
       (r"$0.707$", Rounded(1 / 1.414, dp=3)),
       [(r"$0.414$", Rounded(0.414, dp=3), r"You subtracted 1 from 1.414. Rationalise: $\frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2}$.", lambda: 1.414 - 1),
        (r"$1.414$", Rounded(1.414, dp=3), r"You wrote down $\sqrt{2}$ itself. $\frac{1}{\sqrt{2}}$ is half of $\sqrt{2}$.", lambda: 1.414),
        (r"$2.828$", Rounded(2.828, dp=3), r"You multiplied by 2 instead of dividing by 2.", lambda: 1.414 * 2)],
       lambda: 1.414 / 2,
       r"""Rationalise first: $\dfrac{1}{\sqrt{2}} = \dfrac{\sqrt{2}}{2} = \dfrac{1.414}{2} = 0.707$.

Rationalising makes the division easy: dividing by 2 instead of by 1.414."""),
    mq("maths-surds-09", "Surds",
       r"Expand and simplify $(3 - \sqrt{2})^{2}$.",
       (r"$11 - 6\sqrt{2}$", 11 - 6 * sp.sqrt(2)),
       [(r"$7$", 7, r"You squared each term separately: $9 - 2$. $(p - q)^{2} = p^{2} - 2pq + q^{2}$ has a middle term.", lambda: 9 - 2),
        (r"$7 - 6\sqrt{2}$", 7 - 6 * sp.sqrt(2), r"You took $(\sqrt{2})^{2}$ with a minus sign. $(-\sqrt{2})^{2} = +2$.", lambda: 9 - 6 * sp.sqrt(2) - 2),
        (r"$11 - 3\sqrt{2}$", 11 - 3 * sp.sqrt(2), r"You forgot to double the middle term: it is $2 \times 3 \times \sqrt{2} = 6\sqrt{2}$.", lambda: 9 - 3 * sp.sqrt(2) + 2)],
       lambda: sp.expand((3 - sp.sqrt(2)) ** 2),
       r"""$(3 - \sqrt{2})^{2} = 3^{2} - 2(3)(\sqrt{2}) + (\sqrt{2})^{2} = 9 - 6\sqrt{2} + 2 = 11 - 6\sqrt{2}$"""),
    mq("maths-surds-10", "Surds",
       r"A rectangular flower bed measures $(\sqrt{5} + 1)$ m by $(\sqrt{5} - 1)$ m. Find its area.",
       (r"$4$ m²", 4),
       [(r"$5$ m²", 5, r"You multiplied $\sqrt{5} \times \sqrt{5}$ and forgot the $-1 \times 1$ term.", lambda: 5),
        (r"$6$ m²", 6, r"You added $1 \times 1$ instead of subtracting it. $(p + q)(p - q) = p^{2} - q^{2}$.", lambda: 5 + 1),
        (r"$2\sqrt{5}$ m²", 2 * sp.sqrt(5), r"You added the two sides. Area is length × width.", lambda: (sp.sqrt(5) + 1) + (sp.sqrt(5) - 1))],
       lambda: sp.expand((sp.sqrt(5) + 1) * (sp.sqrt(5) - 1)),
       r"""Area $= (\sqrt{5} + 1)(\sqrt{5} - 1) = (\sqrt{5})^{2} - 1^{2} = 5 - 1 = 4$ m².

This is the difference of two squares, $(p + q)(p - q) = p^{2} - q^{2}$."""),
    # ── Sequences and series ─────────────────────────────────────────────
    mq("maths-sequences-06", "Sequences and Series",
       r"Find the 10th term of the A.P. $7, 4, 1, \ldots$",
       (r"$-20$", -20),
       [(r"$-23$", -23, r"You used $a + 10d$. The $n$th term is $a + (n - 1)d$, so the 10th term uses $9d$.", lambda: 7 + 10 * -3),
        (r"$-17$", -17, r"You used $a + 8d$. The 10th term is $a + 9d$.", lambda: 7 + 8 * -3),
        (r"$34$", 34, r"You took the common difference as $+3$. Each term is 3 less: $d = 4 - 7 = -3$.", lambda: 7 + 9 * 3)],
       lambda: 7 + (10 - 1) * (4 - 7),
       r"""$a = 7$, $d = 4 - 7 = -3$.

$U_{10} = a + 9d = 7 + 9(-3) = 7 - 27 = -20$"""),
    mq("maths-sequences-07", "Sequences and Series",
       r"How many terms are there in the A.P. $5, 8, 11, \ldots, 62$?",
       (r"$20$", 20),
       [(r"$12$", 12, r"You divided the last term by the first term. Use $U_{n} = a + (n - 1)d$."),
        (r"$19$", 19, r"$\frac{62 - 5}{3} = 19$ is the number of steps between the terms; there is one more term than steps.", lambda: (62 - 5) // 3),
        (r"$21$", 21, r"You divided the last term by the common difference, $62 \div 3 \approx 21$. Subtract the first term first.", lambda: round(62 / 3))],
       lambda: (62 - 5) // 3 + 1,
       r"""$a = 5$, $d = 3$, last term $= 62$.

$5 + (n - 1)3 = 62 \Rightarrow (n - 1)3 = 57 \Rightarrow n - 1 = 19 \Rightarrow n = 20$"""),
    mq("maths-sequences-08", "Sequences and Series",
       r"Find the common ratio of the G.P. $48, -24, 12, \ldots$",
       (r"$-\frac{1}{2}$", R(-1, 2)),
       [(r"$-72$", -72, r"You found a common difference, $-24 - 48 = -72$, as for an A.P. In a G.P., divide a term by the one before it.", lambda: -24 - 48),
        (r"$-2$", -2, r"You divided the first term by the second. The ratio is a term divided by the term before it.", lambda: R(48, -24)),
        (r"$\frac{1}{2}$", R(1, 2), r"You lost the sign. The terms alternate in sign, so the ratio is negative.", lambda: R(24, 48))],
       lambda: R(-24, 48),
       r"""$r = \dfrac{\text{second term}}{\text{first term}} = \dfrac{-24}{48} = -\dfrac{1}{2}$

Check: $-24 \times (-\frac{1}{2}) = 12$. ✓"""),
    mq("maths-sequences-09", "Sequences and Series",
       r"The $n$th term of an A.P. is $U_{n} = 5n - 3$. Find the common difference.",
       (r"$5$", 5),
       [(r"$-3$", -3, r"$-3$ is the constant in the formula, not the difference between terms."),
        (r"$2$", 2, r"$2$ is the first term, $U_{1} = 5 - 3$. Subtract consecutive terms to find $d$.", lambda: 5 * 1 - 3),
        (r"$7$", 7, r"$7$ is the second term, $U_{2}$. The difference is $U_{2} - U_{1}$.", lambda: 5 * 2 - 3)],
       lambda: (5 * 2 - 3) - (5 * 1 - 3),
       r"""$U_{1} = 2$, $U_{2} = 7$, $U_{3} = 12$, …

$d = U_{2} - U_{1} = 7 - 2 = 5$, the coefficient of $n$."""),
    mq("maths-sequences-10", "Sequences and Series",
       r"The second term of a G.P. is 6 and the fourth term is 54. Find the common ratio, given that it is positive.",
       (r"$3$", 3),
       [(r"$9$", 9, r"$\frac{54}{6} = 9$ is $r^{2}$, because two steps separate the terms. Take the square root.", lambda: R(54, 6)),
        (r"$24$", 24, r"You treated it as an A.P.: $(54 - 6) \div 2$. In a G.P., terms are multiplied by $r$.", lambda: R(54 - 6, 2)),
        (r"$48$", 48, r"You subtracted the terms. In a G.P. you divide.", lambda: 54 - 6)],
       lambda: sp.sqrt(sp.Rational(54, 6)),
       r"""$ar = 6$ and $ar^{3} = 54$.

Dividing: $r^{2} = \dfrac{54}{6} = 9$, so $r = 3$ (positive).

Check: $2, 6, 18, 54$. ✓"""),
    # ── Percentages ──────────────────────────────────────────────────────
    mq("maths-percentages-06", "Percentages",
       r"A shirt marked Le 250 is sold at a discount of 12%. Find the selling price.",
       (r"Le 220", 220),
       [(r"Le 30", 30, r"Le 30 is the discount. Subtract it from the marked price.", lambda: 250 * R(12, 100)),
        (r"Le 238", 238, r"You took 12 Leones off, not 12%.", lambda: 250 - 12),
        (r"Le 280", 280, r"You added the discount. A discount reduces the price.", lambda: 250 + 250 * R(12, 100))],
       lambda: 250 * R(88, 100),
       r"""Discount $= 12\%$ of Le 250 $= \dfrac{12}{100} \times 250 = $ Le 30.

Selling price $= 250 - 30 = $ Le 220. (Or $88\%$ of $250$.)"""),
    mq("maths-percentages-07", "Percentages",
       r"A trader bought a radio for Le 800 and sold it for Le 680. Find the percentage loss.",
       (r"15%", 15),
       [(r"17.6%", Rounded(120 / 680 * 100, dp=1), r"You divided the loss by the selling price. Percentage loss is worked out on the cost price.", lambda: 120 / 680 * 100),
        (r"85%", 85, r"That is the selling price as a percentage of the cost price. The loss is $100\% - 85\%$.", lambda: R(680, 800) * 100),
        (r"120%", 120, r"Le 120 is the loss in Leones. Write it as a percentage of the cost price.", lambda: 800 - 680)],
       lambda: R(800 - 680, 800) * 100,
       r"""Loss $= 800 - 680 = $ Le 120.

Percentage loss $= \dfrac{120}{800} \times 100\% = 15\%$"""),
    mq("maths-percentages-08", "Percentages",
       r"What principal will earn Le 900 simple interest in 3 years at 5% per annum?",
       (r"Le 6,000", 6000),
       [(r"Le 135", 135, r"You worked out $\frac{900 \times 5 \times 3}{100}$, treating 900 as the principal. Here 900 is the interest.", lambda: R(900 * 5 * 3, 100)),
        (r"Le 18,000", 18000, r"You left out the time. $P = \frac{100 I}{RT}$ divides by both the rate and the time.", lambda: R(100 * 900, 5)),
        (r"Le 30,000", 30000, r"You left out the rate. $P = \frac{100 I}{RT}$ divides by both $R$ and $T$.", lambda: R(100 * 900, 3))],
       lambda: R(100 * 900, 5 * 3),
       r"""$I = \dfrac{PRT}{100}$, so $P = \dfrac{100 I}{RT} = \dfrac{100 \times 900}{5 \times 3} = $ Le 6,000.

Check: $\frac{6000 \times 5 \times 3}{100} = 900$. ✓"""),
    mq("maths-percentages-09", "Percentages",
       r"Find the amount when Le 10,000 is invested for 3 years at 10% per annum compound interest.",
       (r"Le 13,310", 13310),
       [(r"Le 3,310", 3310, r"Le 3,310 is the interest. The amount is the principal plus the interest.", lambda: 10000 * R(11, 10) ** 3 - 10000),
        (r"Le 12,100", 12100, r"That is the amount after 2 years. Multiply by 1.1 once more.", lambda: 10000 * R(11, 10) ** 2),
        (r"Le 13,000", 13000, r"That is simple interest. With compound interest, each year's interest is added before the next year.", lambda: 10000 + 3 * 1000)],
       lambda: 10000 * R(11, 10) ** 3,
       r"""Year 1: $10\,000 \times 1.1 = 11\,000$

Year 2: $11\,000 \times 1.1 = 12\,100$

Year 3: $12\,100 \times 1.1 = 13\,310$

Amount $= $ Le 13,310. (Or $A = P(1 + \frac{R}{100})^{n} = 10\,000 \times 1.1^{3}$.)"""),
    mq("maths-percentages-10", "Percentages",
       r"The population of a town rose from 40,000 to 46,000. Find the percentage increase.",
       (r"15%", 15),
       [(r"13.0%", Rounded(6000 / 46000 * 100, dp=1), r"You divided the increase by the new population. Use the original population.", lambda: 6000 / 46000 * 100),
        (r"87.0%", Rounded(40000 / 46000 * 100, dp=1), r"You divided the old population by the new one.", lambda: 40000 / 46000 * 100),
        (r"115%", 115, r"That is the new population as a percentage of the old. The increase is $115\% - 100\%$.", lambda: R(46000, 40000) * 100)],
       lambda: R(46000 - 40000, 40000) * 100,
       r"""Increase $= 46\,000 - 40\,000 = 6\,000$.

Percentage increase $= \dfrac{6\,000}{40\,000} \times 100\% = 15\%$"""),
    # ── Variation ────────────────────────────────────────────────────────
    mq("maths-variation-06", "Variation",
       r"$y$ varies inversely as $x^{2}$. If $y = 8$ when $x = 3$, find $y$ when $x = 6$.",
       (r"$2$", 2),
       [(r"$4$", 4, r"You used $y = \frac{k}{x}$. The variation is with $x^{2}$.", lambda: R(8 * 3, 6)),
        (r"$16$", 16, r"You used direct variation, $y = kx$.", lambda: R(8, 3) * 6),
        (r"$32$", 32, r"You used $y = kx^{2}$ (direct). *Inversely* means $y = \frac{k}{x^{2}}$.", lambda: R(8, 9) * 36)],
       lambda: R(8 * 3**2, 6**2),
       r"""$y = \dfrac{k}{x^{2}}$. When $x = 3$, $y = 8$: $k = 8 \times 9 = 72$.

When $x = 6$: $y = \dfrac{72}{36} = 2$."""),
    mq("maths-variation-07", "Variation",
       r"$w$ varies jointly as $x$ and $y$. If $w = 24$ when $x = 2$ and $y = 3$, find $w$ when $x = 5$ and $y = 4$.",
       (r"$80$", 80),
       [(r"$20$", 20, r"You found $xy = 20$ but forgot to multiply by the constant $k = 4$.", lambda: 5 * 4),
        (r"$43.2$", R(216, 5), r"You used $w = k(x + y)$. Joint variation means $w = kxy$.", lambda: R(24, 2 + 3) * (5 + 4)),
        (r"$45$", 45, r"You used $w = \frac{kx}{y}$, inverse in $y$. Joint variation multiplies.", lambda: R(24 * 3, 2) * 5 / 4)],
       lambda: R(24, 2 * 3) * 5 * 4,
       r"""$w = kxy$. When $x = 2$, $y = 3$: $24 = 6k$, so $k = 4$.

When $x = 5$, $y = 4$: $w = 4 \times 5 \times 4 = 80$."""),
    mq("maths-variation-08", "Variation",
       r"$r$ varies directly as $\sqrt{s}$. If $r = 6$ when $s = 16$, find $r$ when $s = 49$.",
       (r"$10.5$", R(21, 2)),
       [(r"$\frac{24}{7}$", R(24, 7), r"You used inverse variation, $r = \frac{k}{\sqrt{s}}$.", lambda: R(6 * 4, 7)),
        (r"$7$", 7, r"$\sqrt{49} = 7$, but you forgot to multiply by $k = \frac{3}{2}$.", lambda: sp.sqrt(49)),
        (r"$18.375$", R(147, 8), r"You used $r = ks$, without the square root.", lambda: R(6, 16) * 49)],
       lambda: R(6, 4) * sp.sqrt(49),
       r"""$r = k\sqrt{s}$. When $s = 16$, $r = 6$: $6 = 4k$, so $k = \frac{3}{2}$.

When $s = 49$: $r = \frac{3}{2} \times 7 = 10.5$."""),
    mq("maths-variation-09", "Variation",
       r"$y$ varies inversely as $x$. If $x$ is doubled, what happens to $y$?",
       (r"It is halved", "halved"),
       [(r"It is doubled", "doubled", r"That would be direct variation."),
        (r"It is divided by 4", "divided by 4", r"That would be inverse variation with $x^{2}$."),
        (r"It is unchanged", "unchanged", r"$y$ depends on $x$, so it must change.")],
       lambda: "halved" if sp.simplify((1 / (2 * x)) / (1 / x)) == R(1, 2) else "other",
       r"""$y = \dfrac{k}{x}$. If $x$ becomes $2x$, then $y$ becomes $\dfrac{k}{2x} = \dfrac{1}{2} \times \dfrac{k}{x}$: it is halved."""),
    mq("maths-variation-10", "Variation",
       r"$x$ varies directly as $y$. If $x = 15$ when $y = 5$, find $y$ when $x = 36$.",
       (r"$12$", 12),
       [(r"$7.2$", R(36, 5), r"You divided 36 by the first value of $y$. Find the constant $k$ first.", lambda: R(36, 5)),
        (r"$26$", 26, r"You assumed $x$ and $y$ differ by a fixed amount (10). In direct variation they are in a fixed ratio.", lambda: 36 - 10),
        (r"$108$", 108, r"You multiplied by $k$. Since $x = 3y$, $y = \frac{x}{3}$.", lambda: 36 * 3)],
       lambda: R(36, R(15, 5)),
       r"""$x = ky$. When $y = 5$, $x = 15$: $k = 3$.

When $x = 36$: $36 = 3y$, so $y = 12$."""),
    # ── Change of subject ────────────────────────────────────────────────
    mq("maths-subject-06", "Change of Subject",
       r"Make $t$ the subject of the formula $v = u + at$.",
       (r"$\dfrac{v - u}{a}$", (v - u) / a),
       [(r"$\dfrac{v + u}{a}$", (v + u) / a, r"Moving $+u$ across the equals sign makes it $-u$, not $+u$."),
        (r"$\dfrac{v}{a} - u$", v / a - u, r"You divided only $v$ by $a$. Subtract $u$ first, then divide the whole of $v - u$ by $a$."),
        (r"$a(v - u)$", a * (v - u), r"You multiplied by $a$. To undo $\times a$, divide by $a$.")],
       lambda: sp.solve(sp.Eq(v, u + a * t), t)[0],
       r"""$v = u + at$

Subtract $u$: $v - u = at$

Divide by $a$: $t = \dfrac{v - u}{a}$"""),
    mq("maths-subject-07", "Change of Subject",
       r"Make $h$ the subject of $A = 2\pi r^{2} + 2\pi r h$.",
       (r"$\dfrac{A - 2\pi r^{2}}{2\pi r}$", (A - 2 * sp.pi * r**2) / (2 * sp.pi * r)),
       [(r"$\dfrac{A - 2\pi r^{2}}{2\pi}$", (A - 2 * sp.pi * r**2) / (2 * sp.pi), r"You divided by $2\pi$ only. $h$ is multiplied by $2\pi r$, so divide by $2\pi r$."),
        (r"$\dfrac{A + 2\pi r^{2}}{2\pi r}$", (A + 2 * sp.pi * r**2) / (2 * sp.pi * r), r"Subtracting $2\pi r^{2}$ from both sides gives $A - 2\pi r^{2}$, not $A + 2\pi r^{2}$."),
        (r"$\dfrac{A}{2\pi r} - 2\pi r^{2}$", A / (2 * sp.pi * r) - 2 * sp.pi * r**2, r"You divided only $A$ by $2\pi r$. The whole of $A - 2\pi r^{2}$ must be divided.")],
       lambda: sp.solve(sp.Eq(A, 2 * sp.pi * r**2 + 2 * sp.pi * r * h), h)[0],
       r"""$A = 2\pi r^{2} + 2\pi r h$

$A - 2\pi r^{2} = 2\pi r h$

$h = \dfrac{A - 2\pi r^{2}}{2\pi r}$"""),
    mq("maths-subject-08", "Change of Subject",
       r"Given that $s = ut + \frac{1}{2}at^{2}$, find $a$ when $s = 100$, $u = 5$ and $t = 4$.",
       (r"$10$", 10),
       [(r"$5$", 5, r"You used $at^{2}$ without the $\frac{1}{2}$: $80 = 16a$.", lambda: R(100 - 5 * 4, 16)),
        (r"$12.5$", R(25, 2), r"You left out the $ut$ term: $100 = 8a$.", lambda: R(100, 8)),
        (r"$20$", 20, r"You divided $80$ by $t$ only. $\frac{1}{2}at^{2} = 8a$ when $t = 4$.", lambda: R(100 - 5 * 4, 4))],
       lambda: sp.solve(sp.Eq(100, 5 * 4 + R(1, 2) * a * 16), a)[0],
       r"""$100 = 5(4) + \frac{1}{2}a(4)^{2} = 20 + 8a$

$8a = 80$, so $a = 10$."""),
    mq("maths-subject-09", "Change of Subject",
       r"Make $v$ the subject of the formula $K = \frac{1}{2}mv^{2}$.",
       (r"$\sqrt{\dfrac{2K}{m}}$", sp.sqrt(2 * K / m)),
       [(r"$\dfrac{2K}{m}$", 2 * K / m, r"That is $v^{2}$. Take the square root to find $v$."),
        (r"$\sqrt{\dfrac{K}{2m}}$", sp.sqrt(K / (2 * m)), r"To remove $\frac{1}{2}$, multiply by 2; you divided by 2."),
        (r"$\sqrt{2Km}$", sp.sqrt(2 * K * m), r"$m$ multiplies $v^{2}$, so you must divide by $m$, not multiply.")],
       lambda: sp.solve(sp.Eq(K, R(1, 2) * m * v**2), v)[0],
       r"""$K = \frac{1}{2}mv^{2}$

Multiply by 2: $2K = mv^{2}$

Divide by $m$: $v^{2} = \dfrac{2K}{m}$

Square root: $v = \sqrt{\dfrac{2K}{m}}$"""),
    mq("maths-subject-10", "Change of Subject",
       r"Make $x$ the subject of $ax + b = cx + d$.",
       (r"$\dfrac{d - b}{a - c}$", (d - b) / (a - c)),
       [(r"$\dfrac{d + b}{a + c}$", (d + b) / (a + c), r"Moving terms across the equals sign changes their signs: $ax - cx = d - b$."),
        (r"$\dfrac{b - d}{a - c}$", (b - d) / (a - c), r"The top has the wrong sign: from $ax - cx = d - b$, the top is $d - b$."),
        (r"$\dfrac{d - b}{a} - c$", (d - b) / a - c, r"You divided by $a$ only. Factorise first: $x(a - c) = d - b$.")],
       lambda: sp.solve(sp.Eq(a * x + b, c * x + d), x)[0],
       r"""Collect the $x$ terms on one side: $ax - cx = d - b$

Factorise: $x(a - c) = d - b$

Divide: $x = \dfrac{d - b}{a - c}$"""),
    # ── Quadratic equations ──────────────────────────────────────────────
    mq("maths-quadratics-06", "Quadratic Equations",
       r"Solve $x^{2} = 4x$.",
       (r"$x = 0$ or $x = 4$", {0, 4}),
       [(r"$x = 4$ only", {4}, r"You divided both sides by $x$ and lost the root $x = 0$. Never divide by an unknown: factorise $x(x - 4) = 0$."),
        (r"$x = 2$ or $x = -2$", {2, -2}, r"You took the square root of 4. The equation is $x^{2} = 4x$, not $x^{2} = 4$."),
        (r"$x = 0$ or $x = -4$", {0, -4}, r"$x(x - 4) = 0$ gives $x = 4$, not $-4$.")],
       lambda: set(sp.solve(sp.Eq(sp.Symbol("x") ** 2, 4 * sp.Symbol("x")), sp.Symbol("x"))),
       r"""$x^{2} - 4x = 0$

$x(x - 4) = 0$

$x = 0$ or $x = 4$"""),
    mq("maths-quadratics-07", "Quadratic Equations",
       r"Solve $3x^{2} - 10x - 8 = 0$.",
       (r"$x = -\frac{2}{3}$ or $x = 4$", {R(-2, 3), 4}),
       [(r"$x = \frac{2}{3}$ or $x = -4$", {R(2, 3), -4}, r"The signs are reversed. From $(3x + 2)(x - 4) = 0$: $3x = -2$ and $x = 4$."),
        (r"$x = -2$ or $x = 4$", {-2, 4}, r"From $3x + 2 = 0$, divide by 3: $x = -\frac{2}{3}$, not $-2$."),
        (r"$x = -\frac{4}{3}$ or $x = 2$", {R(-4, 3), 2}, r"$(3x + 4)(x - 2) = 3x^{2} - 2x - 8$: the middle term is wrong. Check by expanding.")],
       lambda: set(sp.solve(3 * sp.Symbol("x") ** 2 - 10 * sp.Symbol("x") - 8, sp.Symbol("x"))),
       r"""Factorise: $3x^{2} - 10x - 8 = (3x + 2)(x - 4)$

Check: $3x^{2} - 12x + 2x - 8 = 3x^{2} - 10x - 8$. ✓

$3x + 2 = 0 \Rightarrow x = -\frac{2}{3}$; $x - 4 = 0 \Rightarrow x = 4$."""),
    mq("maths-quadratics-08", "Quadratic Equations",
       r"The product of two consecutive positive whole numbers is 132. Find the larger number.",
       (r"$12$", 12),
       [(r"$11$", 11, r"11 is the smaller number. The question asks for the larger."),
        (r"$13$", 13, r"$12 \times 13 = 156$, not 132."),
        (r"$66$", 66, r"You halved 132. The numbers are multiplied, not added.", lambda: R(132, 2))],
       lambda: max(k for k in sp.solve(sp.Symbol("x") * (sp.Symbol("x") + 1) - 132, sp.Symbol("x")) if k > 0) + 1,
       r"""Let the numbers be $x$ and $x + 1$: $x(x + 1) = 132$

$x^{2} + x - 132 = 0 \Rightarrow (x + 12)(x - 11) = 0 \Rightarrow x = 11$ (positive).

The numbers are 11 and 12; the larger is 12."""),
    mq("maths-quadratics-09", "Quadratic Equations",
       r"A rectangle has a perimeter of 26 cm and an area of 40 cm². Find its length (the longer side).",
       (r"$8$ cm", 8),
       [(r"$5$ cm", 5, r"5 cm is the width, the shorter side."),
        (r"$10$ cm", 10, r"You divided the area by 4. Use $l + w = 13$ and $lw = 40$.", lambda: R(40, 4)),
        (r"$13$ cm", 13, r"13 cm is the sum of the length and width (half the perimeter).", lambda: R(26, 2))],
       lambda: max(sp.solve(sp.Symbol("l") * (13 - sp.Symbol("l")) - 40, sp.Symbol("l"))),
       r"""$2(l + w) = 26 \Rightarrow l + w = 13 \Rightarrow w = 13 - l$

$l(13 - l) = 40 \Rightarrow l^{2} - 13l + 40 = 0 \Rightarrow (l - 8)(l - 5) = 0$

The sides are 8 cm and 5 cm, so the length is 8 cm."""),
    mq("maths-quadratics-10", "Quadratic Equations",
       r"Solve $4x^{2} - 25 = 0$.",
       (r"$x = \frac{5}{2}$ or $x = -\frac{5}{2}$", {R(5, 2), R(-5, 2)}),
       [(r"$x = \frac{5}{2}$ only", {R(5, 2)}, r"A square root has two values: $x = \pm\frac{5}{2}$."),
        (r"$x = \frac{25}{4}$ or $x = -\frac{25}{4}$", {R(25, 4), R(-25, 4)}, r"That is $x^{2}$. Take the square root: $\sqrt{\frac{25}{4}} = \frac{5}{2}$."),
        (r"$x = \frac{5}{4}$ or $x = -\frac{5}{4}$", {R(5, 4), R(-5, 4)}, r"You rooted 25 but not 4: $\sqrt{\frac{25}{4}} = \frac{5}{2}$.")],
       lambda: set(sp.solve(4 * sp.Symbol("x") ** 2 - 25, sp.Symbol("x"))),
       r"""Difference of two squares: $(2x - 5)(2x + 5) = 0$

$x = \frac{5}{2}$ or $x = -\frac{5}{2}$"""),
    # ── Sets ─────────────────────────────────────────────────────────────
    mq("maths-sets-06", "Sets",
       r"$U = \{1, 2, 3, \ldots, 10\}$ and $A$ is the set of prime numbers in $U$. Find $n(A')$.",
       (r"$6$", 6),
       [(r"$4$", 4, r"4 is $n(A)$, the number of primes. $A'$ is everything else in $U$."),
        (r"$5$", 5, r"You counted 1 as a prime. A prime has exactly two factors, so 1 is not prime."),
        (r"$10$", 10, r"10 is $n(U)$. Remove the primes to find $n(A')$.")],
       lambda: 10 - len([k for k in range(1, 11) if sp.isprime(k)]),
       r"""$A = \{2, 3, 5, 7\}$, so $n(A) = 4$.

$A' = \{1, 4, 6, 8, 9, 10\}$, so $n(A') = 10 - 4 = 6$."""),
    mq("maths-sets-07", "Sets",
       r"In a class, 22 pupils like football, 15 like athletics and 8 like both. How many like football only?",
       (r"$14$", 14),
       [(r"$7$", 7, r"7 is the number who like athletics only, $15 - 8$.", lambda: 15 - 8),
        (r"$22$", 22, r"22 includes the 8 who like both. Subtract them.", lambda: 22),
        (r"$29$", 29, r"29 is the number who like at least one sport, $22 + 15 - 8$.", lambda: 22 + 15 - 8)],
       lambda: 22 - 8,
       r"""Football only $= n(F) - n(F \cap A) = 22 - 8 = 14$."""),
    mq("maths-sets-08", "Sets",
       r"Given that $n(A) = 15$, $n(B) = 12$ and $n(A \cap B) = 5$, find $n(A \cup B)$.",
       (r"$22$", 22),
       [(r"$17$", 17, r"You subtracted $n(A \cap B)$ twice. It is counted twice in $15 + 12$, so subtract it once.", lambda: 15 + 12 - 2 * 5),
        (r"$27$", 27, r"You added $n(A)$ and $n(B)$ but did not subtract the overlap.", lambda: 15 + 12),
        (r"$32$", 32, r"You added the overlap instead of subtracting it.", lambda: 15 + 12 + 5)],
       lambda: 15 + 12 - 5,
       r"""$n(A \cup B) = n(A) + n(B) - n(A \cap B) = 15 + 12 - 5 = 22$"""),
    mq("maths-sets-09", "Sets",
       r"Which of the following is an empty set?",
       (r"The set of whole numbers between 3 and 4", "The set of whole numbers between 3 and 4"),
       [(r"$\{0\}$", "{0}", r"$\{0\}$ has one member, the number 0, so it is not empty."),
        (r"The set of odd numbers less than 2", "The set of odd numbers less than 2", r"This set contains 1 (and negative odd numbers if they are allowed), so it is not empty."),
        (r"The set of numbers whose square is 4", "The set of numbers whose square is 4", r"This set is $\{2, -2\}$.")],
       lambda: "The set of whole numbers between 3 and 4",
       r"""An empty set has no members, written $\{\ \}$ or $\varnothing$. There is no whole number between 3 and 4.

Be careful: $\{0\}$ is not empty; it contains one member, 0."""),
    mq("maths-sets-10", "Sets",
       r"$P$ is the set of factors of 18 and $Q$ is the set of factors of 24. Find $P \cap Q$.",
       (r"$\{1, 2, 3, 6\}$", {1, 2, 3, 6}),
       [(r"$\{2, 3, 6\}$", {2, 3, 6}, r"You left out 1, which is a factor of every whole number."),
        (r"$\{1, 2, 3, 4, 6\}$", {1, 2, 3, 4, 6}, r"4 is a factor of 24 but not of 18."),
        (r"$\{1, 2, 3, 6, 9, 18\}$", {1, 2, 3, 6, 9, 18}, r"That is all of $P$. The intersection keeps only the factors common to both.")],
       lambda: set(sp.divisors(18)) & set(sp.divisors(24)),
       r"""$P = \{1, 2, 3, 6, 9, 18\}$, $Q = \{1, 2, 3, 4, 6, 8, 12, 24\}$.

$P \cap Q$ = the members in both $= \{1, 2, 3, 6\}$."""),
    # ── Probability ──────────────────────────────────────────────────────
    mq("maths-probability-06", "Probability",
       r"A letter is chosen at random from the word MATHEMATICS. What is the probability that it is M?",
       (r"$\frac{2}{11}$", R(2, 11)),
       [(r"$\frac{1}{11}$", R(1, 11), r"There are two Ms in MATHEMATICS, not one."),
        (r"$\frac{1}{8}$", R(1, 8), r"You counted only the 8 different letters. Each of the 11 letters is equally likely."),
        (r"$\frac{1}{4}$", R(1, 4), r"You took 2 Ms out of the 8 different letters. There are 11 letters in all.", lambda: R(2, 8))],
       lambda: R("MATHEMATICS".count("M"), len("MATHEMATICS")),
       r"""MATHEMATICS has 11 letters, and 2 of them are M.

$P(\text{M}) = \dfrac{2}{11}$"""),
    mq("maths-probability-07", "Probability",
       r"The probability that it will rain tomorrow is 0.35. What is the probability that it will NOT rain tomorrow?",
       (r"$0.65$", R(65, 100)),
       [(r"$0.35$", R(35, 100), r"0.35 is the probability that it WILL rain."),
        (r"$0.5$", R(1, 2), r"Rain and no rain are not equally likely here."),
        (r"$1.35$", R(135, 100), r"You added 1. A probability can never be more than 1.", lambda: 1 + R(35, 100))],
       lambda: 1 - R(35, 100),
       r"""$P(\text{not rain}) = 1 - P(\text{rain}) = 1 - 0.35 = 0.65$"""),
    mq("maths-probability-08", "Probability",
       r"A fair coin is tossed and a fair die is thrown. What is the probability of getting a head and a 6?",
       (r"$\frac{1}{12}$", R(1, 12)),
       [(r"$\frac{1}{8}$", R(1, 8), r"You added the numbers of outcomes, $2 + 6$. There are $2 \times 6 = 12$ equally likely outcomes.", lambda: R(1, 2 + 6)),
        (r"$\frac{1}{6}$", R(1, 6), r"That is the probability of a 6 alone. Both events must happen."),
        (r"$\frac{2}{3}$", R(2, 3), r"You added the probabilities. For independent events happening together, multiply.", lambda: R(1, 2) + R(1, 6))],
       lambda: R(1, 2) * R(1, 6),
       r"""The coin and the die are independent, so multiply:

$P(\text{head and } 6) = \dfrac{1}{2} \times \dfrac{1}{6} = \dfrac{1}{12}$"""),
    mq("maths-probability-09", "Probability",
       r"A bag contains 3 red and 2 white balls. A ball is picked, its colour noted, and it is put back. A second ball is then picked. Find the probability that both balls are red.",
       (r"$\frac{9}{25}$", R(9, 25)),
       [(r"$\frac{3}{10}$", R(3, 10), r"That is the answer without replacement, $\frac{3}{5} \times \frac{2}{4}$. Here the ball is put back.", lambda: R(3, 5) * R(2, 4)),
        (r"$\frac{3}{5}$", R(3, 5), r"That is the probability for one ball. Both picks must be red."),
        (r"$\frac{6}{5}$", R(6, 5), r"You added the probabilities. A probability cannot be more than 1.", lambda: R(3, 5) + R(3, 5))],
       lambda: R(3, 5) * R(3, 5),
       r"""With replacement, the bag is the same for each pick:

$P(\text{red, red}) = \dfrac{3}{5} \times \dfrac{3}{5} = \dfrac{9}{25}$"""),
    mq("maths-probability-10", "Probability",
       r"A fair die is thrown 120 times. How many times would you expect to get a 5?",
       (r"$20$", 20),
       [(r"$6$", 6, r"6 is the number of faces on the die, not the expected number of fives."),
        (r"$24$", 24, r"You divided by 5. The probability of a 5 is $\frac{1}{6}$.", lambda: R(120, 5)),
        (r"$100$", 100, r"That is the expected number of throws that are NOT a 5.", lambda: 120 - 20)],
       lambda: R(1, 6) * 120,
       r"""Expected number $= \text{probability} \times \text{number of trials} = \dfrac{1}{6} \times 120 = 20$"""),
]
