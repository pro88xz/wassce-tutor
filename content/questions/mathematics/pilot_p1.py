"""Mathematics (Core) pilot: 50 original Paper 1 (objective) questions.

Written by WASSCE Tutor in the style of WASSCE Paper 1 (four options, A-D,
about 1.8 minutes per question). Nothing here is copied from a WAEC paper.
Topics are limited to areas Sierra Leone candidates are examined on; see
SCOPE.md for the evidence and the syllabus references.

Run `python3 scripts/questions/build.py` to check every answer and rebuild
the SQL and the review sheet.
"""

import itertools

import sympy as sp

from qbank import Q, R, Rounded, Wrong

x, n = sp.symbols("x n")

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


def to_base(value: int, base: int) -> str:
    digits = ""
    while value:
        value, r = divmod(value, base)
        digits = str(r) + digits
    return digits or "0"


def remainders_in_order_found(value: int, base: int) -> str:
    out = ""
    while value:
        value, r = divmod(value, base)
        out += str(r)
    return out


def add_in_base(a: str, b: str, base: int, drop_carry_from: set[int] = frozenset()) -> str:
    """Column addition; columns listed in drop_carry_from forget their carry."""
    a, b = a.zfill(len(b)), b.zfill(len(a))
    carry, out = 0, ""
    for col, (da, db) in enumerate(zip(reversed(a), reversed(b))):
        s = int(da) + int(db) + carry
        out = str(s % base) + out
        carry = 0 if col in drop_carry_from else s // base
    return (str(carry) if carry else "") + out


def b4(s: str) -> str:
    return f"${s}_{{\\text{{four}}}}$"


def b3(s: str) -> str:
    return f"${s}_{{\\text{{three}}}}$"


def b5(s: str) -> str:
    return f"${s}_{{\\text{{five}}}}$"


QUESTIONS = [
    # ── Indices ────────────────────────────────────────────────────────────
    Q(
        id="maths-indices-01",
        topic="Indices",
        ref=TOPICS["Indices"],
        stem=r"Simplify $\dfrac{27^{\frac{2}{3}} \times 8^{-\frac{1}{3}}}{9^{\frac{1}{2}}}$.",
        answer=(r"$\frac{3}{2}$", R(3, 2)),
        wrong=[
            Wrong(r"$\frac{2}{3}$", R(2, 3), r"You turned the answer upside down at the last step. Divide the top, $\frac{9}{2}$, by 3.", lambda: 3 / (9 * R(1, 2))),
            Wrong(r"$3$", 3, r"You took $27^{\frac{2}{3}}$ as $27 \times \frac{2}{3} = 18$. A fractional index means a root, then a power: $(\sqrt[3]{27})^{2} = 9$.", lambda: 18 * R(1, 2) / 3),
            Wrong(r"$6$", 6, r"You took $8^{-\frac{1}{3}}$ as 2. The negative index means the reciprocal: $8^{-\frac{1}{3}} = \frac{1}{2}$.", lambda: R(9 * 2, 3)),
        ],
        solve=lambda: sp.Integer(27) ** R(2, 3) * sp.Integer(8) ** R(-1, 3) / sp.Integer(9) ** R(1, 2),
        working=r"""$27^{\frac{2}{3}} = (\sqrt[3]{27})^{2} = 3^{2} = 9$

$8^{-\frac{1}{3}} = \dfrac{1}{\sqrt[3]{8}} = \dfrac{1}{2}$

$9^{\frac{1}{2}} = \sqrt{9} = 3$

So the expression is $\dfrac{9 \times \frac{1}{2}}{3} = \dfrac{9}{6} = \dfrac{3}{2}$.""",
    ),
    Q(
        id="maths-indices-02",
        topic="Indices",
        ref=TOPICS["Indices"],
        stem=r"Solve $4^{x+1} = 8^{x-1}$.",
        answer=(r"$5$", 5),
        wrong=[
            Wrong(r"$-1$", -1, r"You expanded $3(x - 1)$ as $3x + 3$. Watch the sign: it is $3x - 3$.", lambda: sp.solve(sp.Eq(2 * x + 2, 3 * x + 3), x)[0]),
            Wrong(r"$2$", 2, r"You wrote $2x + 1 = 3x - 1$. The whole index is multiplied: $2(x + 1) = 2x + 2$ and $3(x - 1) = 3x - 3$.", lambda: sp.solve(sp.Eq(2 * x + 1, 3 * x - 1), x)[0]),
            Wrong(r"$3$", 3, r"You multiplied out the left side but not the right: $2x + 2 = 3x - 1$.", lambda: sp.solve(sp.Eq(2 * x + 2, 3 * x - 1), x)[0]),
        ],
        solve=lambda: next(iter(sp.solveset(sp.Eq(sp.Integer(4) ** (x + 1), sp.Integer(8) ** (x - 1)), x, domain=sp.S.Reals))),
        working=r"""Write both sides as powers of 2: $4 = 2^{2}$ and $8 = 2^{3}$.

$2^{2(x+1)} = 2^{3(x-1)}$

Equate the indices: $2x + 2 = 3x - 3$, so $x = 5$.

Check: $4^{6} = 4096$ and $8^{4} = 4096$. ✓""",
    ),
    Q(
        id="maths-indices-03",
        topic="Indices",
        ref=TOPICS["Indices"],
        stem=r"A 25 kg bag of rice contains about $1.2 \times 10^{6}$ grains. Find the average mass of one grain in grams, in standard form, correct to three significant figures.",
        answer=(r"$2.08 \times 10^{-2}$ g", Rounded(25000 / 1.2e6, sf=3)),
        wrong=[
            Wrong(r"$2.08 \times 10^{-5}$ g", Rounded(25 / 1.2e6, sf=3), r"You did not change kilograms to grams. 25 kg = 25 000 g = $2.5 \times 10^{4}$ g.", lambda: 25 / 1.2e6),
            Wrong(r"$4.80 \times 10^{1}$ g", Rounded(48, sf=3), r"You divided the number of grains by the mass. Mass of one grain = total mass ÷ number of grains.", lambda: 1.2e6 / 25000),
            Wrong(r"$2.08 \times 10^{10}$ g", Rounded(2.5 / 1.2 * 1e10, sf=3), r"You added the powers of 10. When dividing, subtract them: $10^{4} \div 10^{6} = 10^{-2}$.", lambda: 2.5 / 1.2 * 10 ** (4 + 6)),
        ],
        solve=lambda: R(25000) / R(12, 10) / 10**6,
        working=r"""Change to grams: $25 \text{ kg} = 25\,000 \text{ g} = 2.5 \times 10^{4}$ g.

Mass of one grain $= \dfrac{2.5 \times 10^{4}}{1.2 \times 10^{6}} = \dfrac{2.5}{1.2} \times 10^{4-6} = 2.0833 \times 10^{-2}$ g

$\approx 2.08 \times 10^{-2}$ g (3 s.f.). That is about 0.02 g, which is sensible for one grain of rice.""",
    ),
    Q(
        id="maths-indices-04",
        topic="Indices",
        ref=TOPICS["Indices"],
        stem=r"Evaluate $\left(\dfrac{16}{81}\right)^{-\frac{3}{4}}$.",
        answer=(r"$\frac{27}{8}$", R(27, 8)),
        wrong=[
            Wrong(r"$-\frac{27}{8}$", R(-27, 8), r"A negative index does not make the answer negative. It means take the reciprocal: $\left(\frac{16}{81}\right)^{-\frac{3}{4}} = \left(\frac{81}{16}\right)^{\frac{3}{4}}$."),
            Wrong(r"$\frac{8}{27}$", R(8, 27), r"You ignored the minus sign in the index, so you did not turn the fraction upside down.", lambda: R(16, 81) ** R(3, 4)),
            Wrong(r"$\frac{9}{4}$", R(9, 4), r"You squared instead of cubing. The fourth root of $\frac{81}{16}$ is $\frac{3}{2}$; then raise it to the power 3.", lambda: R(3, 2) ** 2),
        ],
        solve=lambda: R(16, 81) ** R(-3, 4),
        working=r"""The negative index turns the fraction upside down:

$\left(\dfrac{16}{81}\right)^{-\frac{3}{4}} = \left(\dfrac{81}{16}\right)^{\frac{3}{4}} = \left(\sqrt[4]{\dfrac{81}{16}}\right)^{3} = \left(\dfrac{3}{2}\right)^{3} = \dfrac{27}{8}$""",
    ),
    Q(
        id="maths-indices-05",
        topic="Indices",
        ref=TOPICS["Indices"],
        stem=r"Simplify $\dfrac{2^{n+2} - 2^{n}}{3 \times 2^{n}}$.",
        answer=(r"$1$", 1),
        wrong=[
            Wrong(r"$\frac{1}{3}$", R(1, 3), r"You took $2^{n+2}$ as $2 \times 2^{n}$. In fact $2^{n+2} = 2^{n} \times 2^{2} = 4 \times 2^{n}$.", lambda: sp.simplify((2 * 2**n - 2**n) / (3 * 2**n))),
            Wrong(r"$\frac{4}{3}$", R(4, 3), r"You dropped the $-2^{n}$ from the top.", lambda: sp.simplify(2 ** (n + 2) / (3 * 2**n))),
            Wrong(r"$2^{n}$", 2**n, r"You cancelled the 3s but left $2^{n}$ behind. Factorise the top as $2^{n}(4 - 1)$; then both 3 and $2^{n}$ cancel."),
        ],
        solve=lambda: sp.simplify((2 ** (n + 2) - 2**n) / (3 * 2**n)),
        working=r"""Factorise the top: $2^{n+2} - 2^{n} = 2^{n} \times 2^{2} - 2^{n} = 2^{n}(4 - 1) = 3 \times 2^{n}$.

So $\dfrac{3 \times 2^{n}}{3 \times 2^{n}} = 1$.""",
    ),
    # ── Number bases ───────────────────────────────────────────────────────
    Q(
        id="maths-bases-01",
        topic="Number Bases",
        ref=TOPICS["Number Bases"],
        stem=r"Express $10111_{\text{two}}$ as a number in base ten.",
        answer=(r"$23$", 23),
        wrong=[
            Wrong(r"$22$", 22, r"You left out the units column. The last digit is worth $1 \times 2^{0} = 1$.", lambda: 16 + 0 + 4 + 2),
            Wrong(r"$29$", 29, r"You read the digits from the wrong end ($11101_{\text{two}}$). The right-hand digit is the units.", lambda: int("11101", 2)),
            Wrong(r"$46$", 46, r"You started the place values at $2^{1}$ instead of $2^{0}$.", lambda: sum(int(d) * 2 ** (i + 1) for i, d in enumerate(reversed("10111")))),
        ],
        solve=lambda: int("10111", 2),
        working=r"""$10111_{\text{two}} = 1 \times 2^{4} + 0 \times 2^{3} + 1 \times 2^{2} + 1 \times 2^{1} + 1 \times 2^{0}$

$= 16 + 0 + 4 + 2 + 1 = 23$""",
    ),
    Q(
        id="maths-bases-02",
        topic="Number Bases",
        ref=TOPICS["Number Bases"],
        stem=r"Convert $75_{\text{ten}}$ to a number in base three.",
        answer=(b3("2210"), "2210"),
        wrong=[
            Wrong(b3("0122"), "0122", r"You wrote the remainders in the order you found them. Read them from the last division back up to the first.", lambda: remainders_in_order_found(75, 3)),
            Wrong(b3("210"), "210", r"You stopped dividing too early. Keep dividing until the quotient is 0; the last remainder (2) is the first digit.", lambda: to_base(75, 3)[1:]),
            Wrong(b3("2112"), "2112", r"You converted the digits 7 and 5 separately ($7 = 21_{\text{three}}$, $5 = 12_{\text{three}}$). Convert the whole number 75.", lambda: to_base(7, 3) + to_base(5, 3)),
        ],
        solve=lambda: to_base(75, 3),
        working=r"""Divide by 3 repeatedly and keep the remainders:

$75 \div 3 = 25$ remainder $0$

$25 \div 3 = 8$ remainder $1$

$8 \div 3 = 2$ remainder $2$

$2 \div 3 = 0$ remainder $2$

Read the remainders from the bottom up: $2210_{\text{three}}$.

Check: $2 \times 27 + 2 \times 9 + 1 \times 3 + 0 = 75$. ✓""",
    ),
    Q(
        id="maths-bases-03",
        topic="Number Bases",
        ref=TOPICS["Number Bases"],
        stem=r"Evaluate $243_{\text{five}} + 134_{\text{five}}$, leaving your answer in base five.",
        answer=(b5("432"), "432"),
        wrong=[
            Wrong(b5("322"), "322", r"You did not carry. In base five, $3 + 4 = 7 = 12_{\text{five}}$: write 2 and carry 1.", lambda: add_in_base("243", "134", 5, {0, 1, 2})),
            Wrong(b5("332"), "332", r"You forgot the carry from the middle column: $4 + 3 + 1 = 8 = 13_{\text{five}}$, so carry 1 into the next column.", lambda: add_in_base("243", "134", 5, {1})),
            Wrong(b5("422"), "422", r"You forgot the carry from the units column: $3 + 4 = 7 = 12_{\text{five}}$, so carry 1.", lambda: add_in_base("243", "134", 5, {0})),
        ],
        solve=lambda: to_base(int("243", 5) + int("134", 5), 5),
        working=r"""Add column by column, carrying fives:

Units: $3 + 4 = 7 = 1 \times 5 + 2$. Write 2, carry 1.

Fives: $4 + 3 + 1 = 8 = 1 \times 5 + 3$. Write 3, carry 1.

Twenty-fives: $2 + 1 + 1 = 4$. Write 4.

Answer: $432_{\text{five}}$.

Check in base ten: $243_{\text{five}} = 73$, $134_{\text{five}} = 44$, $73 + 44 = 117$, and $432_{\text{five}} = 100 + 15 + 2 = 117$. ✓""",
    ),
    Q(
        id="maths-bases-04",
        topic="Number Bases",
        ref=TOPICS["Number Bases"],
        stem=r"If $123_{x} = 38_{\text{ten}}$, find the value of $x$.",
        answer=(r"$5$", 5),
        wrong=[
            Wrong(r"$-7$", -7, r"A number base cannot be negative. Of the two roots, keep the positive one."),
            Wrong(r"$7$", 7, r"Check your factors: $x^{2} + 2x - 35 = (x + 7)(x - 5)$, so the roots are $-7$ and $5$.", lambda: max(sp.solve(x**2 - 2 * x - 35, x))),
            Wrong(r"$5$ or $-7$", frozenset({5, -7}), r"Both numbers solve the quadratic, but a base must be a positive whole number bigger than every digit used. So reject $-7$.", lambda: frozenset(sp.solve(x**2 + 2 * x - 35, x))),
        ],
        solve=lambda: next(s for s in sp.solve(x**2 + 2 * x + 3 - 38, x) if s.is_integer and s > 3),
        working=r"""$123_{x} = 1 \times x^{2} + 2 \times x + 3$

So $x^{2} + 2x + 3 = 38$, which gives $x^{2} + 2x - 35 = 0$.

$(x + 7)(x - 5) = 0$, so $x = -7$ or $x = 5$.

A base must be a positive whole number bigger than every digit used (here bigger than 3), so $x = 5$.

Check: $1 \times 25 + 2 \times 5 + 3 = 38$. ✓""",
    ),
    Q(
        id="maths-bases-05",
        topic="Number Bases",
        ref=TOPICS["Number Bases"],
        stem=r"Evaluate $23_{\text{four}} \times 3_{\text{four}}$, leaving your answer in base four.",
        answer=(b4("201"), "201"),
        wrong=[
            Wrong(b4("33"), "33", r"You worked out $11 \times 3 = 33$ in base ten but did not convert back to base four.", lambda: str(int("23", 4) * 3)),
            Wrong(b4("102"), "102", r"You wrote the digits in reverse order. The first remainder is the units digit, on the right.", lambda: to_base(33, 4)[::-1]),
            Wrong(b4("121"), "121", r"You forgot the carry. $3 \times 3 = 9 = 21_{\text{four}}$: write 1 and carry 2 into the next column.", lambda: to_base(2 * 3, 4) + str(9 % 4)),
        ],
        solve=lambda: to_base(int("23", 4) * int("3", 4), 4),
        working=r"""Units: $3 \times 3 = 9 = 2 \times 4 + 1$. Write 1, carry 2.

Fours: $2 \times 3 + 2 = 8 = 2 \times 4 + 0$. Write 0, carry 2.

Write the final carry: 2. Answer: $201_{\text{four}}$.

Check in base ten: $23_{\text{four}} = 11$, $11 \times 3 = 33$, and $201_{\text{four}} = 32 + 0 + 1 = 33$. ✓""",
    ),
    # ── Surds ──────────────────────────────────────────────────────────────
    Q(
        id="maths-surds-01",
        topic="Surds",
        ref=TOPICS["Surds"],
        stem=r"Simplify $\sqrt{75} - \sqrt{27} + \sqrt{12}$.",
        answer=(r"$4\sqrt{3}$", 4 * sp.sqrt(3)),
        wrong=[
            Wrong(r"$\sqrt{60}$", sp.sqrt(60), r"Surds do not combine like that: $\sqrt{75} - \sqrt{27} + \sqrt{12}$ is not $\sqrt{75 - 27 + 12}$. Simplify each surd first.", lambda: sp.sqrt(75 - 27 + 12)),
            Wrong(r"$6\sqrt{3}$", 6 * sp.sqrt(3), r"You took $\sqrt{12}$ as $4\sqrt{3}$. Only the square root of 4 comes out: $\sqrt{12} = \sqrt{4 \times 3} = 2\sqrt{3}$.", lambda: (5 - 3 + 4) * sp.sqrt(3)),
            Wrong(r"$10\sqrt{3}$", 10 * sp.sqrt(3), r"You added all three terms. The middle one is subtracted.", lambda: (5 + 3 + 2) * sp.sqrt(3)),
        ],
        solve=lambda: sp.sqrt(75) - sp.sqrt(27) + sp.sqrt(12),
        working=r"""$\sqrt{75} = \sqrt{25 \times 3} = 5\sqrt{3}$

$\sqrt{27} = \sqrt{9 \times 3} = 3\sqrt{3}$

$\sqrt{12} = \sqrt{4 \times 3} = 2\sqrt{3}$

So $5\sqrt{3} - 3\sqrt{3} + 2\sqrt{3} = 4\sqrt{3}$.""",
    ),
    Q(
        id="maths-surds-02",
        topic="Surds",
        ref=TOPICS["Surds"],
        stem=r"Rationalise $\dfrac{2}{3 - \sqrt{5}}$.",
        answer=(r"$\frac{3 + \sqrt{5}}{2}$", (3 + sp.sqrt(5)) / 2),
        wrong=[
            Wrong(r"$\frac{3 - \sqrt{5}}{2}$", (3 - sp.sqrt(5)) / 2, r"You multiplied by $3 - \sqrt{5}$. Multiply top and bottom by the conjugate, $3 + \sqrt{5}$.", lambda: 2 * (3 - sp.sqrt(5)) / (9 - 5)),
            Wrong(r"$\frac{3 + \sqrt{5}}{7}$", (3 + sp.sqrt(5)) / 7, r"The bottom is $(3 - \sqrt{5})(3 + \sqrt{5}) = 9 - 5 = 4$, not $9 + 5$.", lambda: 2 * (3 + sp.sqrt(5)) / (9 + 5)),
            Wrong(r"$\frac{6 + \sqrt{5}}{4}$", (6 + sp.sqrt(5)) / 4, r"You multiplied only the 3 by 2. Multiply every term: $2(3 + \sqrt{5}) = 6 + 2\sqrt{5}$."),
        ],
        solve=lambda: sp.radsimp(2 / (3 - sp.sqrt(5))),
        working=r"""Multiply top and bottom by $3 + \sqrt{5}$:

$\dfrac{2(3 + \sqrt{5})}{(3 - \sqrt{5})(3 + \sqrt{5})} = \dfrac{2(3 + \sqrt{5})}{9 - 5} = \dfrac{2(3 + \sqrt{5})}{4} = \dfrac{3 + \sqrt{5}}{2}$""",
    ),
    Q(
        id="maths-surds-03",
        topic="Surds",
        ref=TOPICS["Surds"],
        stem=r"Simplify $(2\sqrt{3} + \sqrt{2})(2\sqrt{3} - \sqrt{2})$.",
        answer=(r"$10$", 10),
        wrong=[
            Wrong(r"$4$", 4, r"$(2\sqrt{3})^{2} = 4 \times 3 = 12$, not $2 \times 3 = 6$.", lambda: 2 * 3 - 2),
            Wrong(r"$14$", 14, r"The difference of two squares gives a minus: $(a + b)(a - b) = a^{2} - b^{2} = 12 - 2$.", lambda: 12 + 2),
            Wrong(r"$14 - 4\sqrt{6}$", 14 - 4 * sp.sqrt(6), r"You worked out $(2\sqrt{3} - \sqrt{2})^{2}$. The two brackets have different signs, so the middle terms cancel.", lambda: sp.expand((2 * sp.sqrt(3) - sp.sqrt(2)) ** 2)),
        ],
        solve=lambda: sp.expand((2 * sp.sqrt(3) + sp.sqrt(2)) * (2 * sp.sqrt(3) - sp.sqrt(2))),
        working=r"""This is a difference of two squares, $(a + b)(a - b) = a^{2} - b^{2}$, with $a = 2\sqrt{3}$ and $b = \sqrt{2}$:

$(2\sqrt{3})^{2} - (\sqrt{2})^{2} = 4 \times 3 - 2 = 12 - 2 = 10$""",
    ),
    Q(
        id="maths-surds-04",
        topic="Surds",
        ref=TOPICS["Surds"],
        stem=r"Expand and simplify $(\sqrt{5} + \sqrt{3})^{2}$.",
        answer=(r"$8 + 2\sqrt{15}$", 8 + 2 * sp.sqrt(15)),
        wrong=[
            Wrong(r"$8$", 8, r"You squared each term but left out the middle term: $(a + b)^{2} = a^{2} + 2ab + b^{2}$.", lambda: 5 + 3),
            Wrong(r"$8 + \sqrt{15}$", 8 + sp.sqrt(15), r"The middle term is $2ab = 2 \times \sqrt{5} \times \sqrt{3} = 2\sqrt{15}$. You left out the 2."),
            Wrong(r"$8 + 2\sqrt{8}$", 8 + 2 * sp.sqrt(8), r"You added the numbers under the roots. $\sqrt{5} \times \sqrt{3} = \sqrt{15}$, not $\sqrt{8}$.", lambda: 8 + 2 * sp.sqrt(5 + 3)),
        ],
        solve=lambda: sp.expand((sp.sqrt(5) + sp.sqrt(3)) ** 2),
        working=r"""$(\sqrt{5} + \sqrt{3})^{2} = (\sqrt{5})^{2} + 2(\sqrt{5})(\sqrt{3}) + (\sqrt{3})^{2}$

$= 5 + 2\sqrt{15} + 3 = 8 + 2\sqrt{15}$""",
    ),
    Q(
        id="maths-surds-05",
        topic="Surds",
        ref=TOPICS["Surds"],
        stem=r"A square plot of land in Makeni has an area of 72 m². Find the length of its diagonal.",
        answer=(r"12 m", 12),
        wrong=[
            Wrong(r"$6\sqrt{2}$ m", 6 * sp.sqrt(2), r"That is the length of one side. The diagonal is longer: use Pythagoras.", lambda: sp.sqrt(72)),
            Wrong(r"$12\sqrt{2}$ m", 12 * sp.sqrt(2), r"You took the diagonal as twice the side. Use Pythagoras: $d^{2} = s^{2} + s^{2}$.", lambda: 2 * sp.sqrt(72)),
            Wrong(r"18 m", 18, r"You treated 72 as the perimeter and divided by 4. 72 m² is the area, so each side is $\sqrt{72}$ m.", lambda: R(72, 4)),
        ],
        solve=lambda: sp.sqrt(sp.sqrt(72) ** 2 + sp.sqrt(72) ** 2),
        working=r"""Side $= \sqrt{72} = \sqrt{36 \times 2} = 6\sqrt{2}$ m.

By Pythagoras, diagonal$^{2} = (6\sqrt{2})^{2} + (6\sqrt{2})^{2} = 72 + 72 = 144$.

So the diagonal $= \sqrt{144} = 12$ m.""",
    ),
    # ── Sequences and series ───────────────────────────────────────────────
    Q(
        id="maths-sequences-01",
        topic="Sequences and Series",
        ref=TOPICS["Sequences and Series"],
        stem=r"The $n$th term of a sequence is $U_{n} = 3n^{2} - 2$. Find the 4th term.",
        answer=(r"$46$", 46),
        wrong=[
            Wrong(r"$50$", 50, r"You added the 2 instead of subtracting it.", lambda: 3 * 4**2 + 2),
            Wrong(r"$73$", 73, r"That is the 5th term. Put $n = 4$.", lambda: 3 * 5**2 - 2),
            Wrong(r"$142$", 142, r"You squared $3n$. In $3n^{2}$ only $n$ is squared: $3 \times 4^{2}$.", lambda: (3 * 4) ** 2 - 2),
        ],
        solve=lambda: 3 * 4**2 - 2,
        working=r"""$U_{4} = 3(4)^{2} - 2 = 3 \times 16 - 2 = 48 - 2 = 46$""",
    ),
    Q(
        id="maths-sequences-02",
        topic="Sequences and Series",
        ref=TOPICS["Sequences and Series"],
        stem=r"The third term of an arithmetic progression (A.P.) is 11 and the seventh term is 27. Find the first term.",
        answer=(r"$3$", 3),
        wrong=[
            Wrong(r"$-1$", -1, r"You used $a + 3d$ for the third term. The $n$th term is $a + (n - 1)d$, so the third term is $a + 2d$.", lambda: sp.solve([sp.Symbol("a") + 3 * sp.Symbol("d") - 11, sp.Symbol("a") + 7 * sp.Symbol("d") - 27])[sp.Symbol("a")]),
            Wrong(r"$4$", 4, r"4 is the common difference $d$, not the first term."),
            Wrong(r"$7$", 7, r"You went back only one step from the third term ($11 - 4$). The first term is two steps back: $11 - 2 \times 4$.", lambda: 11 - 4),
        ],
        solve=lambda: sp.solve([sp.Symbol("a") + 2 * sp.Symbol("d") - 11, sp.Symbol("a") + 6 * sp.Symbol("d") - 27])[sp.Symbol("a")],
        working=r"""$a + 2d = 11$ and $a + 6d = 27$.

Subtract: $4d = 16$, so $d = 4$.

Then $a = 11 - 2(4) = 3$.

Check: 3, 7, 11, 15, 19, 23, 27 — the seventh term is 27. ✓""",
    ),
    Q(
        id="maths-sequences-03",
        topic="Sequences and Series",
        ref=TOPICS["Sequences and Series"],
        stem=r"Find the sum of the first 20 terms of the A.P. 5, 9, 13, …",
        answer=(r"$860$", 860),
        wrong=[
            Wrong(r"$81$", 81, r"81 is the 20th term, not the sum of the first 20 terms.", lambda: 5 + 19 * 4),
            Wrong(r"$900$", 900, r"You used $nd$ instead of $(n - 1)d$: $S_{n} = \frac{n}{2}[2a + (n - 1)d]$.", lambda: R(20, 2) * (2 * 5 + 20 * 4)),
            Wrong(r"$1720$", 1720, r"You forgot to divide by 2.", lambda: 20 * (2 * 5 + 19 * 4)),
        ],
        solve=lambda: sum(5 + 4 * k for k in range(20)),
        working=r"""$a = 5$, $d = 4$, $n = 20$.

$S_{20} = \dfrac{20}{2}[2(5) + (20 - 1)(4)] = 10[10 + 76] = 10 \times 86 = 860$""",
    ),
    Q(
        id="maths-sequences-04",
        topic="Sequences and Series",
        ref=TOPICS["Sequences and Series"],
        stem=r"The first term of a geometric progression (G.P.) is 2 and the common ratio is $-3$. Find the fifth term.",
        answer=(r"$162$", 162),
        wrong=[
            Wrong(r"$-486$", -486, r"That is the sixth term. The $n$th term is $ar^{n-1}$, so the fifth term uses $r^{4}$.", lambda: 2 * (-3) ** 5),
            Wrong(r"$-162$", -162, r"An even power of a negative number is positive: $(-3)^{4} = 81$.", lambda: -(2 * 3**4)),
            Wrong(r"$1296$", 1296, r"You multiplied 2 by $-3$ first. Only the ratio is raised to the power: $2 \times (-3)^{4}$.", lambda: (2 * -3) ** 4),
        ],
        solve=lambda: 2 * (-3) ** 4,
        working=r"""$U_{n} = ar^{n-1}$, so $U_{5} = 2 \times (-3)^{4} = 2 \times 81 = 162$""",
    ),
    Q(
        id="maths-sequences-05",
        topic="Sequences and Series",
        ref=TOPICS["Sequences and Series"],
        stem=r"Fatmata saves Le 50 in the first week. Each week after that she saves Le 15 more than the week before. How much does she save altogether in the first 12 weeks?",
        answer=(r"Le 1,590", 1590),
        wrong=[
            Wrong(r"Le 215", 215, r"Le 215 is what she saves in week 12 alone. 'Altogether' means the sum of all 12 weeks.", lambda: 50 + 11 * 15),
            Wrong(r"Le 1,680", 1680, r"You used $nd$ instead of $(n - 1)d$: $S_{n} = \frac{n}{2}[2a + (n - 1)d]$.", lambda: 6 * (100 + 12 * 15)),
            Wrong(r"Le 3,180", 3180, r"You forgot to divide by 2.", lambda: 12 * (100 + 11 * 15)),
        ],
        solve=lambda: sum(50 + 15 * k for k in range(12)),
        working=r"""Her savings form an A.P. with $a = 50$, $d = 15$, $n = 12$.

$S_{12} = \dfrac{12}{2}[2(50) + 11(15)] = 6[100 + 165] = 6 \times 265 = 1590$

She saves Le 1,590.""",
    ),
    # ── Percentages ────────────────────────────────────────────────────────
    Q(
        id="maths-percentages-01",
        topic="Percentages",
        ref=TOPICS["Percentages"],
        stem=r"Mrs Kamara bought a bag of rice for Le 640 and sold it for Le 720. Find her percentage profit.",
        answer=(r"12.5%", R(25, 2)),
        wrong=[
            Wrong(r"11.1%", Rounded(80 / 720 * 100, dp=1), r"You divided the profit by the selling price. Percentage profit is worked out on the cost price.", lambda: 80 / 720 * 100),
            Wrong(r"80%", 80, r"Le 80 is the profit in Leones. Write it as a percentage of the cost price.", lambda: 720 - 640),
            Wrong(r"112.5%", R(225, 2), r"That is the selling price as a percentage of the cost price. Take away 100% to get the profit.", lambda: R(720, 640) * 100),
        ],
        solve=lambda: R(720 - 640, 640) * 100,
        working=r"""Profit $= 720 - 640 = $ Le 80.

Percentage profit $= \dfrac{\text{profit}}{\text{cost price}} \times 100\% = \dfrac{80}{640} \times 100\% = 12.5\%$""",
    ),
    Q(
        id="maths-percentages-02",
        topic="Percentages",
        ref=TOPICS["Percentages"],
        stem=r"By selling a phone for Le 1,380, a trader made a profit of 15%. Find the cost price of the phone.",
        answer=(r"Le 1,200", 1200),
        wrong=[
            Wrong(r"Le 180", 180, r"Le 180 is the profit. The question asks for the cost price.", lambda: 1380 - 1380 / R(115, 100)),
            Wrong(r"Le 1,173", 1173, r"You took 15% off the selling price. The 15% is of the cost price, so the selling price is 115% of the cost price.", lambda: 1380 * R(85, 100)),
            Wrong(r"Le 1,587", 1587, r"You added 15% to the selling price. Work backwards: cost price $= \frac{100}{115} \times 1380$.", lambda: 1380 * R(115, 100)),
        ],
        solve=lambda: 1380 / R(115, 100),
        working=r"""Selling price $= 115\%$ of the cost price.

Cost price $= \dfrac{100}{115} \times 1380 = $ Le 1,200.

Check: 15% of 1,200 is 180, and $1200 + 180 = 1380$. ✓""",
    ),
    Q(
        id="maths-percentages-03",
        topic="Percentages",
        ref=TOPICS["Percentages"],
        stem=r"In how many years will Le 2,500 amount to Le 3,400 at 6% simple interest per annum?",
        answer=(r"6 years", 6),
        wrong=[
            Wrong(r"4.4 years", Rounded(900 * 100 / (3400 * 6), dp=1), r"You used the amount (Le 3,400) as the principal. The principal is the money first invested: Le 2,500.", lambda: 900 * 100 / (3400 * 6)),
            Wrong(r"16.7 years", Rounded(2500 * 6 / 900, dp=1), r"You turned the formula upside down. $T = \frac{100I}{PR}$.", lambda: 2500 * 6 / 900),
            Wrong(r"22.7 years", Rounded(3400 * 100 / (2500 * 6), dp=1), r"You used the amount as the interest. Interest = amount − principal = Le 900.", lambda: 3400 * 100 / (2500 * 6)),
        ],
        solve=lambda: R(100 * (3400 - 2500), 2500 * 6),
        working=r"""Interest $I = 3400 - 2500 = $ Le 900.

$T = \dfrac{100I}{PR} = \dfrac{100 \times 900}{2500 \times 6} = \dfrac{90\,000}{15\,000} = 6$ years""",
    ),
    Q(
        id="maths-percentages-04",
        topic="Percentages",
        ref=TOPICS["Percentages"],
        stem=r"Find the compound interest on Le 5,000 for 2 years at 10% per annum.",
        answer=(r"Le 1,050", 1050),
        wrong=[
            Wrong(r"Le 50", 50, r"You squared the rate. The formula is $A = P\left(1 + \frac{R}{100}\right)^{n}$: square $1.1$, not $0.1$.", lambda: 5000 * R(1, 10) ** 2),
            Wrong(r"Le 1,000", 1000, r"That is simple interest. With compound interest, year 2's interest is worked out on Le 5,500, not Le 5,000.", lambda: 5000 * R(10, 100) * 2),
            Wrong(r"Le 6,050", 6050, r"That is the amount. Compound interest = amount − principal.", lambda: 5000 * R(11, 10) ** 2),
        ],
        solve=lambda: 5000 * R(11, 10) ** 2 - 5000,
        working=r"""Year 1: interest $= 10\%$ of 5,000 $= 500$; amount $= 5{,}500$.

Year 2: interest $= 10\%$ of 5,500 $= 550$; amount $= 6{,}050$.

Compound interest $= 6050 - 5000 = $ Le 1,050.

(Or: $A = 5000 \times 1.1^{2} = 6050$.)""",
    ),
    Q(
        id="maths-percentages-05",
        topic="Percentages",
        ref=TOPICS["Percentages"],
        stem=r"A tape measure gives the length of a table as 1.5 m. The actual length is 1.6 m. Find the percentage error.",
        answer=(r"6.25%", R(625, 100)),
        wrong=[
            Wrong(r"0.1%", R(1, 10), r"0.1 m is the error in metres. Divide it by the actual length, then multiply by 100.", lambda: R(16, 10) - R(15, 10)),
            Wrong(r"6.67%", Rounded(0.1 / 1.5 * 100, dp=2), r"You divided by the measured length. Percentage error uses the actual length.", lambda: 0.1 / 1.5 * 100),
            Wrong(r"93.75%", R(9375, 100), r"That is the measured length as a percentage of the actual length.", lambda: R(15, 16) * 100),
        ],
        solve=lambda: (R(16, 10) - R(15, 10)) / R(16, 10) * 100,
        working=r"""Error $= 1.6 - 1.5 = 0.1$ m.

Percentage error $= \dfrac{\text{error}}{\text{actual value}} \times 100\% = \dfrac{0.1}{1.6} \times 100\% = 6.25\%$""",
    ),
    # ── Variation ──────────────────────────────────────────────────────────
    Q(
        id="maths-variation-01",
        topic="Variation",
        ref=TOPICS["Variation"],
        stem=r"$y$ varies directly as $x^{2}$. If $y = 12$ when $x = 2$, find $y$ when $x = 5$.",
        answer=(r"$75$", 75),
        wrong=[
            Wrong(r"$1.92$", R(192, 100), r"You used inverse variation. 'Varies directly' means $y = kx^{2}$.", lambda: R(12 * 4, 25)),
            Wrong(r"$30$", 30, r"You used $y = kx$. The question says $x^{2}$.", lambda: R(12, 2) * 5),
            Wrong(r"$150$", 150, r"You found $k = \frac{12}{2} = 6$ by dividing by $x$ instead of $x^{2}$.", lambda: R(12, 2) * 25),
        ],
        solve=lambda: R(12, 2**2) * 5**2,
        working=r"""$y = kx^{2}$. When $x = 2$, $y = 12$: $12 = k \times 4$, so $k = 3$.

When $x = 5$: $y = 3 \times 25 = 75$.""",
    ),
    Q(
        id="maths-variation-02",
        topic="Variation",
        ref=TOPICS["Variation"],
        stem=r"The time taken to clear a farm varies inversely as the number of workers. 6 workers clear it in 10 days. How many days would 15 workers take?",
        answer=(r"4 days", 4),
        wrong=[
            Wrong(r"2.5 days", R(5, 2), r"You divided 15 by 6. Start from the total work: 6 workers × 10 days = 60 worker-days.", lambda: R(15, 6)),
            Wrong(r"25 days", 25, r"More workers should take less time. This is inverse variation, not direct.", lambda: R(10, 6) * 15),
            Wrong(r"150 days", 150, r"You multiplied 10 days by 15 workers. Divide the total work (60 worker-days) by 15.", lambda: 10 * 15),
        ],
        solve=lambda: R(6 * 10, 15),
        working=r"""$t = \dfrac{k}{w}$. With 6 workers and 10 days: $k = 6 \times 10 = 60$.

With 15 workers: $t = \dfrac{60}{15} = 4$ days.""",
    ),
    Q(
        id="maths-variation-03",
        topic="Variation",
        ref=TOPICS["Variation"],
        stem=r"$P$ is partly constant and partly varies as $Q$. When $Q = 2$, $P = 11$, and when $Q = 5$, $P = 20$. Find $P$ when $Q = 8$.",
        answer=(r"$29$", 29),
        wrong=[
            Wrong(r"$32$", 32, r"You treated $P$ as varying directly as $Q$, using only the second pair. 'Partly constant' means $P = a + bQ$.", lambda: R(20, 5) * 8),
            Wrong(r"$35$", 35, r"You used 11 as the constant. Solve the two equations to find the constant: $a = 5$.", lambda: 11 + 3 * 8),
            Wrong(r"$44$", 44, r"You treated $P$ as varying directly as $Q$, using only the first pair.", lambda: R(11, 2) * 8),
        ],
        solve=lambda: (lambda s: s[sp.Symbol("a")] + s[sp.Symbol("b")] * 8)(sp.solve([sp.Symbol("a") + 2 * sp.Symbol("b") - 11, sp.Symbol("a") + 5 * sp.Symbol("b") - 20])),
        working=r"""$P = a + bQ$.

$a + 2b = 11$ and $a + 5b = 20$. Subtract: $3b = 9$, so $b = 3$ and $a = 5$.

When $Q = 8$: $P = 5 + 3 \times 8 = 29$.""",
    ),
    Q(
        id="maths-variation-04",
        topic="Variation",
        ref=TOPICS["Variation"],
        stem=r"$z$ varies directly as $x$ and inversely as $y$. If $z = 6$ when $x = 4$ and $y = 2$, find $z$ when $x = 9$ and $y = 3$.",
        answer=(r"$9$", 9),
        wrong=[
            Wrong(r"$4$", 4, r"You swapped the variations: $z$ varies directly as $x$ (on top) and inversely as $y$ (underneath).", lambda: R(6 * 4, 2) * 3 / 9),
            Wrong(r"$13.5$", R(27, 2), r"You ignored $y$. The formula is $z = \frac{kx}{y}$.", lambda: R(6, 4) * 9),
            Wrong(r"$20.25$", R(81, 4), r"You used $z = kxy$. 'Inversely as $y$' means divide by $y$.", lambda: R(6, 4 * 2) * 9 * 3),
        ],
        solve=lambda: R(6 * 2, 4) * 9 / 3,
        working=r"""$z = \dfrac{kx}{y}$. When $x = 4$, $y = 2$, $z = 6$: $6 = \dfrac{4k}{2}$, so $k = 3$.

When $x = 9$, $y = 3$: $z = \dfrac{3 \times 9}{3} = 9$.""",
    ),
    Q(
        id="maths-variation-05",
        topic="Variation",
        ref=TOPICS["Variation"],
        stem=r"The volume $V$ of a gas varies directly as its temperature $T$ and inversely as its pressure $P$. Which equation shows this? ($k$ is a constant.)",
        answer=(r"$V = \frac{kT}{P}$", sp.Symbol("k") * sp.Symbol("T") / sp.Symbol("P")),
        wrong=[
            Wrong(r"$V = kTP$", sp.Symbol("k") * sp.Symbol("T") * sp.Symbol("P"), r"'Inversely as $P$' means divide by $P$, not multiply."),
            Wrong(r"$V = \frac{kP}{T}$", sp.Symbol("k") * sp.Symbol("P") / sp.Symbol("T"), r"You swapped them: $T$ goes on top (direct) and $P$ underneath (inverse)."),
            Wrong(r"$V = \frac{k}{TP}$", sp.Symbol("k") / (sp.Symbol("T") * sp.Symbol("P")), r"'Directly as $T$' means $T$ goes on top."),
        ],
        solve=lambda: sp.Symbol("k") * sp.Symbol("T") / sp.Symbol("P"),
        working=r"""Directly as $T$: $V \propto T$, so $T$ goes on top.

Inversely as $P$: $V \propto \dfrac{1}{P}$, so $P$ goes underneath.

Together: $V = \dfrac{kT}{P}$.""",
    ),
    # ── Change of subject ──────────────────────────────────────────────────
    Q(
        id="maths-subject-01",
        topic="Change of Subject",
        ref=TOPICS["Change of Subject"],
        stem=r"Make $r$ the subject of the formula $V = \frac{1}{3}\pi r^{2}h$.",
        answer=(r"$r = \sqrt{\frac{3V}{\pi h}}$", sp.sqrt(3 * sp.Symbol("V", positive=True) / (sp.pi * sp.Symbol("h", positive=True)))),
        wrong=[
            Wrong(r"$r = \sqrt{\frac{V}{3\pi h}}$", sp.sqrt(sp.Symbol("V", positive=True) / (3 * sp.pi * sp.Symbol("h", positive=True))), r"You divided by 3 instead of multiplying. Multiply both sides by 3 first: $3V = \pi r^{2}h$."),
            Wrong(r"$r = \frac{3V}{\pi h}$", 3 * sp.Symbol("V", positive=True) / (sp.pi * sp.Symbol("h", positive=True)), r"That gives $r^{2}$. Take the square root to get $r$."),
            Wrong(r"$r = \frac{\sqrt{3V}}{\pi h}$", sp.sqrt(3 * sp.Symbol("V", positive=True)) / (sp.pi * sp.Symbol("h", positive=True)), r"The square root must cover the whole fraction $\frac{3V}{\pi h}$."),
        ],
        solve=lambda: [s for s in sp.solve(sp.Eq(sp.Symbol("V", positive=True), R(1, 3) * sp.pi * sp.Symbol("r", positive=True) ** 2 * sp.Symbol("h", positive=True)), sp.Symbol("r", positive=True))][0],
        working=r"""$V = \frac{1}{3}\pi r^{2}h$

Multiply both sides by 3: $3V = \pi r^{2}h$

Divide by $\pi h$: $r^{2} = \dfrac{3V}{\pi h}$

Take the square root: $r = \sqrt{\dfrac{3V}{\pi h}}$""",
    ),
    Q(
        id="maths-subject-02",
        topic="Change of Subject",
        ref=TOPICS["Change of Subject"],
        stem=r"Make $x$ the subject of $y = \dfrac{2x + 3}{x - 1}$.",
        answer=(r"$x = \frac{y + 3}{y - 2}$", (sp.Symbol("y") + 3) / (sp.Symbol("y") - 2)),
        wrong=[
            Wrong(r"$x = \frac{y - 3}{y - 2}$", (sp.Symbol("y") - 3) / (sp.Symbol("y") - 2), r"Sign slip: from $xy - y = 2x + 3$, moving $-y$ to the other side makes it $+y$, so $xy - 2x = y + 3$."),
            Wrong(r"$x = \frac{y + 3}{y + 2}$", (sp.Symbol("y") + 3) / (sp.Symbol("y") + 2), r"Factorising $xy - 2x$ gives $x(y - 2)$, not $x(y + 2)$."),
            Wrong(r"$x = \frac{y + 3}{2 - y}$", (sp.Symbol("y") + 3) / (2 - sp.Symbol("y")), r"If you collect the $x$ terms as $2x - xy$, the other side must become $-y - 3$. Keep the signs together."),
        ],
        solve=lambda: sp.solve(sp.Eq(sp.Symbol("y"), (2 * x + 3) / (x - 1)), x)[0],
        working=r"""Multiply both sides by $(x - 1)$: $y(x - 1) = 2x + 3$

Expand: $xy - y = 2x + 3$

Collect the $x$ terms: $xy - 2x = y + 3$

Factorise: $x(y - 2) = y + 3$

So $x = \dfrac{y + 3}{y - 2}$.""",
    ),
    Q(
        id="maths-subject-03",
        topic="Change of Subject",
        ref=TOPICS["Change of Subject"],
        stem=r"Given that $\dfrac{1}{f} = \dfrac{1}{u} + \dfrac{1}{v}$, find $v$ when $f = 6$ and $u = 10$.",
        answer=(r"$15$", 15),
        wrong=[
            Wrong(r"$-4$", -4, r"You subtracted the numbers themselves. Work with the reciprocals: $\frac{1}{v} = \frac{1}{f} - \frac{1}{u}$.", lambda: 6 - 10),
            Wrong(r"$\frac{1}{15}$", R(1, 15), r"That is $\frac{1}{v}$. Turn it upside down to get $v$.", lambda: R(1, 6) - R(1, 10)),
            Wrong(r"$3.75$", R(15, 4), r"You added $\frac{1}{6}$ and $\frac{1}{10}$. Make $\frac{1}{v}$ the subject first: $\frac{1}{v} = \frac{1}{f} - \frac{1}{u}$.", lambda: 1 / (R(1, 6) + R(1, 10))),
        ],
        solve=lambda: 1 / (R(1, 6) - R(1, 10)),
        working=r"""$\dfrac{1}{v} = \dfrac{1}{f} - \dfrac{1}{u} = \dfrac{1}{6} - \dfrac{1}{10} = \dfrac{5 - 3}{30} = \dfrac{2}{30} = \dfrac{1}{15}$

So $v = 15$.""",
    ),
    Q(
        id="maths-subject-04",
        topic="Change of Subject",
        ref=TOPICS["Change of Subject"],
        stem=r"Make $a$ the subject of $k = \sqrt{\dfrac{a - b}{c}}$.",
        answer=(r"$a = ck^{2} + b$", sp.Symbol("c") * sp.Symbol("k") ** 2 + sp.Symbol("b")),
        wrong=[
            Wrong(r"$a = ck^{2} - b$", sp.Symbol("c") * sp.Symbol("k") ** 2 - sp.Symbol("b"), r"From $ck^{2} = a - b$, moving $-b$ to the other side makes it $+b$."),
            Wrong(r"$a = ck + b$", sp.Symbol("c") * sp.Symbol("k") + sp.Symbol("b"), r"Square both sides first to remove the square root: $k^{2} = \frac{a - b}{c}$."),
            Wrong(r"$a = \frac{k^{2} + b}{c}$", (sp.Symbol("k") ** 2 + sp.Symbol("b")) / sp.Symbol("c"), r"Multiply both sides by $c$ before adding $b$: $ck^{2} = a - b$."),
        ],
        solve=lambda: sp.solve(sp.Eq(sp.Symbol("k") ** 2, (sp.Symbol("a") - sp.Symbol("b")) / sp.Symbol("c")), sp.Symbol("a"))[0],
        working=r"""Square both sides: $k^{2} = \dfrac{a - b}{c}$

Multiply by $c$: $ck^{2} = a - b$

Add $b$: $a = ck^{2} + b$""",
    ),
    Q(
        id="maths-subject-05",
        topic="Change of Subject",
        ref=TOPICS["Change of Subject"],
        stem=r"Given that $T = 2\pi\sqrt{\dfrac{l}{g}}$, find $l$ when $T = 2$ and $g = 9.8$, correct to two decimal places. [Take $\pi = \frac{22}{7}$]",
        answer=(r"$0.99$", Rounded(9.8 * 4 / (4 * (22 / 7) ** 2), dp=2)),
        wrong=[
            Wrong(r"$1.98$", Rounded(9.8 * 4 / (2 * (22 / 7) ** 2), dp=2), r"You squared $\pi$ but not the 2: $(2\pi)^{2} = 4\pi^{2}$.", lambda: 9.8 * 4 / (2 * (22 / 7) ** 2)),
            Wrong(r"$3.12$", Rounded(9.8 * 2 / (2 * 22 / 7), dp=2), r"You did not square to remove the square root: $\frac{T^{2}}{4\pi^{2}} = \frac{l}{g}$.", lambda: 9.8 * 2 / (2 * 22 / 7)),
            Wrong(r"$96.80$", Rounded(9.8 * (2 * 22 / 7 / 2) ** 2, dp=2), r"You turned $\frac{T}{2\pi}$ upside down. From $\frac{T}{2\pi} = \sqrt{\frac{l}{g}}$, square both sides, then multiply by $g$.", lambda: 9.8 * (2 * 22 / 7 / 2) ** 2),
        ],
        solve=lambda: sp.N(R(98, 10) * 2**2 / (4 * R(22, 7) ** 2)),
        working=r"""Make $l$ the subject: $\dfrac{T}{2\pi} = \sqrt{\dfrac{l}{g}}$, so $\dfrac{T^{2}}{4\pi^{2}} = \dfrac{l}{g}$ and $l = \dfrac{gT^{2}}{4\pi^{2}}$.

$l = \dfrac{9.8 \times 2^{2}}{4 \times \left(\frac{22}{7}\right)^{2}} = \dfrac{39.2}{39.51} = 0.992\ldots \approx 0.99$

(A pendulum about 1 m long swings with a period of about 2 seconds, so this is sensible.)""",
    ),
    # ── Quadratic equations ────────────────────────────────────────────────
    Q(
        id="maths-quadratics-01",
        topic="Quadratic Equations",
        ref=TOPICS["Quadratic Equations"],
        stem=r"Solve $x^{2} - x - 12 = 0$.",
        answer=(r"$x = 4$ or $x = -3$", frozenset({4, -3})),
        wrong=[
            Wrong(r"$x = -4$ or $x = 3$", frozenset({-4, 3}), r"Signs swapped. $(x - 4)(x + 3) = 0$ gives $x = 4$ or $x = -3$."),
            Wrong(r"$x = 4$ or $x = 3$", frozenset({4, 3}), r"$x + 3 = 0$ gives $x = -3$, not 3."),
            Wrong(r"$x = -4$ or $x = -3$", frozenset({-4, -3}), r"$x - 4 = 0$ gives $x = 4$, not $-4$."),
        ],
        solve=lambda: frozenset(sp.solve(x**2 - x - 12, x)),
        working=r"""Find two numbers that multiply to $-12$ and add to $-1$: $-4$ and $3$.

$x^{2} - x - 12 = (x - 4)(x + 3) = 0$

So $x = 4$ or $x = -3$.""",
    ),
    Q(
        id="maths-quadratics-02",
        topic="Quadratic Equations",
        ref=TOPICS["Quadratic Equations"],
        stem=r"Find the quadratic equation whose roots are $\frac{1}{2}$ and $-3$.",
        answer=(r"$2x^{2} + 5x - 3 = 0$", 2 * x**2 + 5 * x - 3),
        wrong=[
            Wrong(r"$2x^{2} - 5x - 3 = 0$", 2 * x**2 - 5 * x - 3, r"You changed the sign of both roots. The root $\frac{1}{2}$ gives the factor $(2x - 1)$ and the root $-3$ gives $(x + 3)$.", lambda: sp.expand((2 * x + 1) * (x - 3))),
            Wrong(r"$2x^{2} - 7x + 3 = 0$", 2 * x**2 - 7 * x + 3, r"The root $-3$ gives the factor $(x + 3)$, not $(x - 3)$.", lambda: sp.expand((2 * x - 1) * (x - 3))),
            Wrong(r"$2x^{2} + 7x + 3 = 0$", 2 * x**2 + 7 * x + 3, r"The root $\frac{1}{2}$ gives the factor $(2x - 1)$, not $(2x + 1)$.", lambda: sp.expand((2 * x + 1) * (x + 3))),
        ],
        solve=lambda: sp.expand(2 * (x - R(1, 2)) * (x + 3)),
        working=r"""$x = \frac{1}{2}$ gives $2x - 1 = 0$, and $x = -3$ gives $x + 3 = 0$.

$(2x - 1)(x + 3) = 0$

$2x^{2} + 6x - x - 3 = 0$

$2x^{2} + 5x - 3 = 0$""",
    ),
    Q(
        id="maths-quadratics-03",
        topic="Quadratic Equations",
        ref=TOPICS["Quadratic Equations"],
        stem=r"Solve $2x^{2} - 5x - 1 = 0$, giving your answers correct to two decimal places.",
        answer=(r"$x = -0.19$ or $x = 2.69$", frozenset({Rounded(-0.186, dp=2), Rounded(2.686, dp=2)})),
        wrong=[
            Wrong(r"$x = 0.19$ or $x = -2.69$", frozenset({Rounded(0.186, dp=2), Rounded(-2.686, dp=2)}), r"You used $+b$ instead of $-b$. Here $b = -5$, so $-b = 5$: $x = \frac{5 \pm \sqrt{33}}{4}$.", lambda: frozenset(sp.N((-5 + s * sp.sqrt(33)) / 4) for s in (1, -1))),
            Wrong(r"$x = 0.22$ or $x = 2.28$", frozenset({Rounded(0.219, dp=2), Rounded(2.281, dp=2)}), r"With $c = -1$, $b^{2} - 4ac = 25 - 4(2)(-1) = 25 + 8 = 33$, not $25 - 8$.", lambda: frozenset(sp.N((5 + s * sp.sqrt(17)) / 4) for s in (1, -1))),
            Wrong(r"$x = -0.37$ or $x = 5.37$", frozenset({Rounded(-0.372, dp=2), Rounded(5.372, dp=2)}), r"You divided by $a$ instead of $2a$. The bottom of the formula is $2a = 4$.", lambda: frozenset(sp.N((5 + s * sp.sqrt(33)) / 2) for s in (1, -1))),
        ],
        solve=lambda: frozenset(sp.N(s) for s in sp.solve(2 * x**2 - 5 * x - 1, x)),
        working=r"""Use the formula with $a = 2$, $b = -5$, $c = -1$:

$x = \dfrac{-b \pm \sqrt{b^{2} - 4ac}}{2a} = \dfrac{5 \pm \sqrt{25 + 8}}{4} = \dfrac{5 \pm \sqrt{33}}{4}$

$\sqrt{33} = 5.7446$, so $x = \dfrac{10.7446}{4} = 2.69$ or $x = \dfrac{-0.7446}{4} = -0.19$ (2 d.p.).""",
    ),
    Q(
        id="maths-quadratics-04",
        topic="Quadratic Equations",
        ref=TOPICS["Quadratic Equations"],
        stem=r"The length of a rectangular garden is 3 m more than its width. Its area is 54 m². Find the width of the garden.",
        answer=(r"6 m", 6),
        wrong=[
            Wrong(r"9 m", 9, r"9 m is the length. The question asks for the width.", lambda: 6 + 3),
            Wrong(r"12 m", 12, r"You used 54 as the perimeter: $2(w + w + 3) = 54$. 54 m² is the area: $w(w + 3) = 54$.", lambda: sp.solve(2 * (x + x + 3) - 54, x)[0]),
            Wrong(r"18 m", 18, r"You divided the area by 3. Form the equation $w(w + 3) = 54$ and solve it.", lambda: R(54, 3)),
        ],
        solve=lambda: next(s for s in sp.solve(x * (x + 3) - 54, x) if s > 0),
        working=r"""Let the width be $w$ m. Then the length is $(w + 3)$ m.

$w(w + 3) = 54$, so $w^{2} + 3w - 54 = 0$.

$(w + 9)(w - 6) = 0$, so $w = 6$ or $w = -9$.

A width cannot be negative, so the width is 6 m (and the length 9 m: $6 \times 9 = 54$ ✓).""",
    ),
    Q(
        id="maths-quadratics-05",
        topic="Quadratic Equations",
        ref=TOPICS["Quadratic Equations"],
        stem=r"If $x = 2$ is a root of $x^{2} + kx - 10 = 0$, find the value of $k$.",
        answer=(r"$3$", 3),
        wrong=[
            Wrong(r"$-7$", -7, r"You wrote $-10$ as $+10$ when substituting. Copy the equation carefully: $4 + 2k - 10 = 0$.", lambda: sp.solve(4 + 2 * sp.Symbol("k") + 10, sp.Symbol("k"))[0]),
            Wrong(r"$-3$", -3, r"Sign slip: $2k - 6 = 0$ gives $2k = 6$, not $2k = -6$.", lambda: sp.solve(2 * sp.Symbol("k") + 6, sp.Symbol("k"))[0]),
            Wrong(r"$7$", 7, r"You moved 4 across without changing its sign: $2k = 10 + 4$. It should be $2k = 10 - 4$.", lambda: R(10 + 4, 2)),
        ],
        solve=lambda: sp.solve(2**2 + sp.Symbol("k") * 2 - 10, sp.Symbol("k"))[0],
        working=r"""Substitute $x = 2$: $2^{2} + 2k - 10 = 0$

$4 + 2k - 10 = 0$, so $2k - 6 = 0$, $2k = 6$, $k = 3$.""",
    ),
    # ── Sets ───────────────────────────────────────────────────────────────
    Q(
        id="maths-sets-01",
        topic="Sets",
        ref=TOPICS["Sets"],
        stem=r"$U = \{1, 2, 3, \ldots, 12\}$, $P$ is the set of multiples of 3 and $Q$ is the set of factors of 12. Find $P \cap Q$.",
        answer=(r"$\{3, 6, 12\}$", frozenset({3, 6, 12})),
        wrong=[
            Wrong(r"$\{3, 6\}$", frozenset({3, 6}), r"12 is in both sets: it is a multiple of 3, and every number is a factor of itself."),
            Wrong(r"$\{3, 6, 9, 12\}$", frozenset({3, 6, 9, 12}), r"That is $P$. 9 is not a factor of 12, so it is not in $Q$.", lambda: frozenset(k for k in range(1, 13) if k % 3 == 0)),
            Wrong(r"$\{1, 2, 3, 4, 6, 9, 12\}$", frozenset({1, 2, 3, 4, 6, 9, 12}), r"That is $P \cup Q$ (union). Intersection means the numbers in both sets.", lambda: frozenset(k for k in range(1, 13) if k % 3 == 0 or 12 % k == 0)),
        ],
        solve=lambda: frozenset(k for k in range(1, 13) if k % 3 == 0 and 12 % k == 0),
        working=r"""$P = \{3, 6, 9, 12\}$

$Q = \{1, 2, 3, 4, 6, 12\}$

$P \cap Q$ is the numbers in both: $\{3, 6, 12\}$.""",
    ),
    Q(
        id="maths-sets-02",
        topic="Sets",
        ref=TOPICS["Sets"],
        stem=r"In a class of 40 pupils, 25 study Biology, 18 study Chemistry and 7 study neither subject. How many pupils study both subjects?",
        answer=(r"$10$", 10),
        wrong=[
            Wrong(r"$3$", 3, r"You did not take away the 7 who study neither. Only 33 pupils study at least one subject.", lambda: 25 + 18 - 40),
            Wrong(r"$7$", 7, r"7 is the number who study neither subject."),
            Wrong(r"$15$", 15, r"15 is the number who study Biology only ($25 - 10$).", lambda: 25 - 10),
        ],
        solve=lambda: 25 + 18 - (40 - 7),
        working=r"""Pupils who study at least one subject: $40 - 7 = 33$.

$n(B \cup C) = n(B) + n(C) - n(B \cap C)$

$33 = 25 + 18 - n(B \cap C)$, so $n(B \cap C) = 43 - 33 = 10$.""",
    ),
    Q(
        id="maths-sets-03",
        topic="Sets",
        ref=TOPICS["Sets"],
        stem=r"$U = \{a, b, c, d, e, f\}$, $A = \{a, b, c\}$ and $B = \{c, d\}$. Find $(A \cup B)'$.",
        answer=(r"$\{e, f\}$", frozenset("ef")),
        wrong=[
            Wrong(r"$\{c\}$", frozenset("c"), r"That is $A \cap B$. You want the members of $U$ that are outside $A \cup B$.", lambda: frozenset("abc") & frozenset("cd")),
            Wrong(r"$\{a, b, c, d\}$", frozenset("abcd"), r"That is $A \cup B$ itself. The dash means complement: everything in $U$ that is not in $A \cup B$.", lambda: frozenset("abc") | frozenset("cd")),
            Wrong(r"$\{a, b, d, e, f\}$", frozenset("abdef"), r"That is $(A \cap B)'$. The question asks for $(A \cup B)'$.", lambda: frozenset("abcdef") - (frozenset("abc") & frozenset("cd"))),
        ],
        solve=lambda: frozenset("abcdef") - (frozenset("abc") | frozenset("cd")),
        working=r"""$A \cup B = \{a, b, c, d\}$

$(A \cup B)'$ is everything in $U$ that is not in $A \cup B$: $\{e, f\}$.""",
    ),
    Q(
        id="maths-sets-04",
        topic="Sets",
        ref=TOPICS["Sets"],
        stem=r"A survey of 60 traders at a market in Bo found that 30 sell rice, 25 sell palm oil and 20 sell pepper. 10 sell rice and palm oil, 8 sell rice and pepper, 6 sell palm oil and pepper, and 4 sell all three. How many of the traders sell none of the three?",
        answer=(r"$5$", 5),
        wrong=[
            Wrong(r"$9$", 9, r"You took away the pairs but did not add back the 4 who sell all three.", lambda: 60 - (30 + 25 + 20 - 10 - 8 - 6)),
            Wrong(r"$13$", 13, r"The 4 who sell all three are added back, not taken away again.", lambda: 60 - (30 + 25 + 20 - 10 - 8 - 6 - 4)),
            Wrong(r"$17$", 17, r"You read '10 sell rice and palm oil' as 10 who sell only those two. The 10 includes the 4 who sell all three.", lambda: 60 - ((30 - 10 - 8 - 4) + (25 - 10 - 6 - 4) + (20 - 8 - 6 - 4) + 10 + 8 + 6 + 4)),
        ],
        solve=lambda: 60 - (30 + 25 + 20 - 10 - 8 - 6 + 4),
        working=r"""$n(R \cup O \cup P) = 30 + 25 + 20 - 10 - 8 - 6 + 4 = 55$

None of the three: $60 - 55 = 5$.

On a Venn diagram: rice only 16, palm oil only 13, pepper only 10, rice and palm oil only 6, rice and pepper only 4, palm oil and pepper only 2, all three 4. Total $= 55$. ✓""",
    ),
    Q(
        id="maths-sets-05",
        topic="Sets",
        ref=TOPICS["Sets"],
        stem=r"How many subsets has the set $\{p, q, r, s\}$?",
        answer=(r"$16$", 16),
        wrong=[
            Wrong(r"$4$", 4, r"4 is the number of members. A set with $n$ members has $2^{n}$ subsets.", lambda: len("pqrs")),
            Wrong(r"$8$", 8, r"$2^{4}$ means $2 \times 2 \times 2 \times 2 = 16$, not $2 \times 4$.", lambda: 2 * 4),
            Wrong(r"$15$", 15, r"15 is the number of proper subsets. 'Subsets' includes the set itself (and the empty set).", lambda: 2**4 - 1),
        ],
        solve=lambda: sum(1 for k in range(5) for _ in itertools.combinations("pqrs", k)),
        working=r"""A set with $n$ members has $2^{n}$ subsets. Here $n = 4$, so there are $2^{4} = 16$ subsets.

(They include $\varnothing$ and $\{p, q, r, s\}$ itself.)""",
    ),
    # ── Probability ────────────────────────────────────────────────────────
    Q(
        id="maths-probability-01",
        topic="Probability",
        ref=TOPICS["Probability"],
        stem=r"A bag contains 5 red, 3 blue and 4 green beads. A bead is picked at random. What is the probability that it is not blue?",
        answer=(r"$\frac{3}{4}$", R(3, 4)),
        wrong=[
            Wrong(r"$\frac{1}{4}$", R(1, 4), r"That is the probability that it is blue.", lambda: R(3, 12)),
            Wrong(r"$\frac{1}{3}$", R(1, 3), r"You divided the 3 blue beads by the 9 other beads. Divide by the total: 12 beads.", lambda: R(3, 9)),
            Wrong(r"$\frac{5}{12}$", R(5, 12), r"That is the probability of red only. 'Not blue' means red or green: 9 beads.", lambda: R(5, 12)),
        ],
        solve=lambda: 1 - R(3, 5 + 3 + 4),
        working=r"""Total beads $= 5 + 3 + 4 = 12$. Beads that are not blue $= 5 + 4 = 9$.

$P(\text{not blue}) = \dfrac{9}{12} = \dfrac{3}{4}$""",
    ),
    Q(
        id="maths-probability-02",
        topic="Probability",
        ref=TOPICS["Probability"],
        stem=r"The probabilities that Musa and Isata will pass a test are $\frac{2}{3}$ and $\frac{3}{5}$ respectively. Find the probability that only one of them passes.",
        answer=(r"$\frac{7}{15}$", R(7, 15)),
        wrong=[
            Wrong(r"$\frac{2}{15}$", R(2, 15), r"That is the probability that both fail.", lambda: R(1, 3) * R(2, 5)),
            Wrong(r"$\frac{2}{5}$", R(2, 5), r"That is the probability that both pass.", lambda: R(2, 3) * R(3, 5)),
            Wrong(r"$\frac{3}{5}$", R(3, 5), r"$1 - P(\text{both pass})$ is the probability that at least one fails, which includes both failing.", lambda: 1 - R(2, 3) * R(3, 5)),
        ],
        solve=lambda: R(2, 3) * (1 - R(3, 5)) + (1 - R(2, 3)) * R(3, 5),
        working=r"""Only one passes means Musa passes and Isata fails, or Musa fails and Isata passes.

$P = \dfrac{2}{3} \times \dfrac{2}{5} + \dfrac{1}{3} \times \dfrac{3}{5} = \dfrac{4}{15} + \dfrac{3}{15} = \dfrac{7}{15}$""",
    ),
    Q(
        id="maths-probability-03",
        topic="Probability",
        ref=TOPICS["Probability"],
        stem=r"A box contains 4 white and 6 black balls. Two balls are picked one after the other without replacement. Find the probability that both are white.",
        answer=(r"$\frac{2}{15}$", R(2, 15)),
        wrong=[
            Wrong(r"$\frac{4}{25}$", R(4, 25), r"That is with replacement. Without replacement, after one white ball is taken there are 3 white balls left out of 9.", lambda: R(4, 10) ** 2),
            Wrong(r"$\frac{2}{5}$", R(2, 5), r"That is the probability for the first pick only.", lambda: R(4, 10)),
            Wrong(r"$\frac{11}{15}$", R(11, 15), r"You added the probabilities. For 'first and second', multiply.", lambda: R(4, 10) + R(3, 9)),
        ],
        solve=lambda: R(4, 10) * R(3, 9),
        working=r"""$P(\text{first white}) = \dfrac{4}{10}$. One white ball is gone, so $P(\text{second white}) = \dfrac{3}{9}$.

$P(\text{both white}) = \dfrac{4}{10} \times \dfrac{3}{9} = \dfrac{12}{90} = \dfrac{2}{15}$""",
    ),
    Q(
        id="maths-probability-04",
        topic="Probability",
        ref=TOPICS["Probability"],
        stem=r"Two fair dice are thrown together. What is the probability that the total score is 8?",
        answer=(r"$\frac{5}{36}$", R(5, 36)),
        wrong=[
            Wrong(r"$\frac{1}{12}$", R(1, 12), r"You counted (2, 6) and (6, 2) as one outcome. They are different outcomes: the two dice are different.", lambda: R(len({tuple(sorted(p)) for p in itertools.product(range(1, 7), repeat=2) if sum(p) == 8}), 36)),
            Wrong(r"$\frac{1}{11}$", R(1, 11), r"The totals 2 to 12 are not equally likely. There are 36 equally likely outcomes.", lambda: R(1, 11)),
            Wrong(r"$\frac{1}{6}$", R(1, 6), r"You counted (4, 4) twice. It can happen only one way.", lambda: R(6, 36)),
        ],
        solve=lambda: R(sum(1 for p in itertools.product(range(1, 7), repeat=2) if sum(p) == 8), 36),
        working=r"""There are $6 \times 6 = 36$ equally likely outcomes.

Totals of 8: (2, 6), (3, 5), (4, 4), (5, 3), (6, 2) — 5 outcomes.

$P(\text{total} = 8) = \dfrac{5}{36}$""",
    ),
    Q(
        id="maths-probability-05",
        topic="Probability",
        ref=TOPICS["Probability"],
        stem=r"A number is chosen at random from the whole numbers 1 to 20 inclusive. Find the probability that it is even or a multiple of 5.",
        answer=(r"$\frac{3}{5}$", R(3, 5)),
        wrong=[
            Wrong(r"$\frac{1}{10}$", R(1, 10), r"That is the probability that it is even and a multiple of 5 (only 10 and 20).", lambda: R(sum(1 for k in range(1, 21) if k % 2 == 0 and k % 5 == 0), 20)),
            Wrong(r"$\frac{1}{2}$", R(1, 2), r"That counts only the even numbers. Add the odd multiples of 5 (5 and 15).", lambda: R(10, 20)),
            Wrong(r"$\frac{7}{10}$", R(7, 10), r"You counted 10 and 20 twice. Take away the numbers that are in both groups.", lambda: R(10 + 4, 20)),
        ],
        solve=lambda: R(sum(1 for k in range(1, 21) if k % 2 == 0 or k % 5 == 0), 20),
        working=r"""Even numbers: 10. Multiples of 5: 5, 10, 15, 20 (4 numbers). Both: 10 and 20 (2 numbers).

$P = \dfrac{10 + 4 - 2}{20} = \dfrac{12}{20} = \dfrac{3}{5}$""",
    ),
]
