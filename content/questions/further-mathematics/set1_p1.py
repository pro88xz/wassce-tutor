"""Further Mathematics set 1 (algebra): 42 original Paper 1 questions.

Topics: Polynomials, Partial Fractions, the Binomial Theorem, Surds, Indices and Logarithms,
Sets and Binary Operations, and Functions.

Written by WASSCE Tutor in the style of WASSCE Further Mathematics (four options, A-D).
Nothing here is copied from a WAEC paper. Every computed answer is worked out by code, and
every wrong option is a mistake candidates really make (see SCOPE.md). Statements and forms
(`concept`) were checked against the WASSCE Tutor Further Mathematics notes.

Run `python3 scripts/questions/build.py` to check every answer and rebuild.
"""

import sys
from pathlib import Path

import sympy as sp

sys.path.insert(0, str(Path(__file__).resolve().parent))

from fm_common import make  # noqa: E402
from qbank import R, Rounded  # noqa: E402

x = sp.Symbol("x")

TOPICS = {
    "Polynomials, Theory of Equations, and Roots":
        "Polynomial functions: remainder and factor theorems; roots of quadratic and cubic equations",
    "Rational Functions and Partial Fractions":
        "Rational functions: partial fractions with linear, repeated and quadratic factors",
    "Binomial Theorem": "Binomial theorem: expansion, general term, approximation; rational indices",
    "Surds, Indices, and Logarithms": "Surds, indices and logarithms: rationalising, exponential and logarithmic equations",
    "Sets": "Sets and binary operations: algebra of sets, De Morgan's laws, Venn diagrams; identity and inverse",
    "Functions": "Functions: domain and range, composite and inverse functions",
}

mq, concept = make(TOPICS)


def P(poly, v):
    return sp.expand(poly).subs(x, v)


def eq_text(a, b, c):
    """ax^2 + bx + c = 0 as the canonical string the options show."""
    def term(coef, power, first):
        if coef == 0:
            return ""
        sign = "-" if coef < 0 else ("" if first else "+")
        mag = abs(coef)
        body = {2: "x^2", 1: "x", 0: ""}[power]
        num = "" if (mag == 1 and power) else str(mag)
        return f"{sign}{num}{body}"
    s = term(a, 2, True) + term(b, 1, False) + term(c, 0, False)
    return s + "=0"


def eq_from_sum_product(total, product):
    """The quadratic x^2 - (sum)x + product = 0, scaled to whole-number coefficients."""
    k = sp.ilcm(sp.Rational(total).q, sp.Rational(product).q)
    return eq_text(k, -total * k, product * k)


QUESTIONS = [
    # ── Polynomials ───────────────────────────────────────────────────────
    mq("fm-poly-01", "Polynomials, Theory of Equations, and Roots",
       r"Find the remainder when $2x^{3} - x^{2} + 3x - 4$ is divided by $x - 2$.",
       ("$14$", 14),
       [("$-30$", -30, r"You substituted $x = -2$. For a divisor $x - 2$, put $x = 2$, the value that makes the divisor zero.",
         lambda: P(2 * x**3 - x**2 + 3 * x - 4, -2)),
        ("$-4$", -4, r"The constant term is not the remainder. The remainder theorem gives $P(2)$.", lambda: -4),
        ("$62$", 62, r"You evaluated $(2x)^{3}$ instead of $2x^{3}$: $2(2)^{3} = 16$, not $4^{3} = 64$.",
         lambda: 64 - 4 + 6 - 4)],
       lambda: P(2 * x**3 - x**2 + 3 * x - 4, 2),
       r"""Remainder theorem: the remainder on dividing by $x - 2$ is $P(2)$.

$P(2) = 2(8) - 4 + 3(2) - 4 = 16 - 4 + 6 - 4 = 14$"""),
    mq("fm-poly-02", "Polynomials, Theory of Equations, and Roots",
       r"Find the remainder when $4x^{3} + 2x^{2} - 3x + 1$ is divided by $2x - 1$.",
       (r"$\dfrac{1}{2}$", R(1, 2)),
       [("$4$", 4, r"You substituted $x = 1$. The divisor $2x - 1$ is zero when $x = \tfrac12$.",
         lambda: P(4 * x**3 + 2 * x**2 - 3 * x + 1, 1)),
        (r"$\dfrac{5}{2}$", R(5, 2), r"You substituted $x = -\tfrac12$. $2x - 1 = 0$ gives $x = +\tfrac12$.",
         lambda: P(4 * x**3 + 2 * x**2 - 3 * x + 1, R(-1, 2))),
        ("$35$", 35, r"You substituted $x = 2$, the coefficient of $x$ in the divisor, instead of solving $2x - 1 = 0$.",
         lambda: P(4 * x**3 + 2 * x**2 - 3 * x + 1, 2))],
       lambda: P(4 * x**3 + 2 * x**2 - 3 * x + 1, R(1, 2)),
       r"""Dividing by $2x - 1$: the remainder is $P\!\left(\tfrac12\right)$.

$P\!\left(\tfrac12\right) = 4\left(\tfrac18\right) + 2\left(\tfrac14\right) - \tfrac32 + 1 = \tfrac12 + \tfrac12 - \tfrac32 + 1 = \tfrac12$"""),
    mq("fm-poly-03", "Polynomials, Theory of Equations, and Roots",
       r"If $x + 2$ is a factor of $x^{3} + kx^{2} - x - 2$, find the value of $k$.",
       ("$2$", 2),
       [("$-1$", -1, r"You used $P(2) = 0$. For the factor $x + 2$, use $P(-2) = 0$.",
         lambda: sp.solve(8 + 4 * sp.Symbol("k") - 2 - 2, sp.Symbol("k"))[0]),
        ("$3$", 3, r"You wrote $-x$ as $-2$ at $x = -2$ instead of $+2$: $-8 + 4k - 2 - 2 = 0$.",
         lambda: sp.solve(-8 + 4 * sp.Symbol("k") - 2 - 2, sp.Symbol("k"))[0]),
        ("$-2$", -2, r"You solved $4k = 8$ correctly but changed the sign at the end.", lambda: -2)],
       lambda: sp.solve(P(x**3 + sp.Symbol("k") * x**2 - x - 2, -2), sp.Symbol("k"))[0],
       r"""Factor theorem: $x + 2$ is a factor, so $P(-2) = 0$.

$(-2)^{3} + k(-2)^{2} - (-2) - 2 = -8 + 4k + 2 - 2 = 4k - 8 = 0$, so $k = 2$."""),
    mq("fm-poly-04", "Polynomials, Theory of Equations, and Roots",
       r"Find the roots of the equation $x^{3} - 6x^{2} + 11x - 6 = 0$.",
       ("$1, 2, 3$", {1, 2, 3}),
       [("$-1, -2, -3$", {-1, -2, -3}, r"You found the factors $(x - 1)(x - 2)(x - 3)$ but gave the roots with the wrong sign. $x - 1 = 0$ gives $x = 1$.", None),
        ("$1, 6$", {1, 6}, r"You found the root 1 and then took the constant term 6 as another root, without finding the quadratic factor $x^{2} - 5x + 6$.", None),
        ("$-1, 2, 3$", {-1, 2, 3}, r"$P(-1) = -1 - 6 - 11 - 6 = -24 \ne 0$, so $-1$ is not a root. Test each candidate by substituting.", None)],
       lambda: set(int(r) for r in sp.solve(x**3 - 6 * x**2 + 11 * x - 6, x)),
       r"""$P(1) = 1 - 6 + 11 - 6 = 0$, so $x - 1$ is a factor.

$x^{3} - 6x^{2} + 11x - 6 = (x - 1)(x^{2} - 5x + 6) = (x - 1)(x - 2)(x - 3)$

The roots are $1$, $2$ and $3$."""),
    mq("fm-poly-05", "Polynomials, Theory of Equations, and Roots",
       r"$\alpha$ and $\beta$ are the roots of $3x^{2} - 6x + 2 = 0$. Find the value of $\alpha^{2} + \beta^{2}$.",
       (r"$\dfrac{8}{3}$", R(8, 3)),
       [(r"$\dfrac{16}{3}$", R(16, 3), r"$\alpha^{2} + \beta^{2} = (\alpha + \beta)^{2} - 2\alpha\beta$: you added $2\alpha\beta$ instead of subtracting it.",
         lambda: 2**2 + 2 * R(2, 3)),
        ("$32$", 32, r"You took $\alpha + \beta = 6$ and $\alpha\beta = 2$, forgetting to divide by $a = 3$.",
         lambda: 6**2 - 2 * 2),
        (r"$\dfrac{10}{3}$", R(10, 3), r"You subtracted $\alpha\beta$ only once: $(\alpha + \beta)^{2} - 2\alpha\beta$ needs $2\alpha\beta$.",
         lambda: 2**2 - R(2, 3))],
       lambda: sp.Integer(2)**2 - 2 * R(2, 3),
       r"""$\alpha + \beta = -\dfrac{b}{a} = \dfrac{6}{3} = 2$ and $\alpha\beta = \dfrac{c}{a} = \dfrac{2}{3}$.

$\alpha^{2} + \beta^{2} = (\alpha + \beta)^{2} - 2\alpha\beta = 4 - \dfrac{4}{3} = \dfrac{8}{3}$"""),
    mq("fm-poly-06", "Polynomials, Theory of Equations, and Roots",
       r"$\alpha$ and $\beta$ are the roots of $2x^{2} + 3x - 5 = 0$. Which equation has roots $\dfrac{1}{\alpha}$ and $\dfrac{1}{\beta}$?",
       ("$5x^2-3x-2=0$", "5x^2-3x-2=0"),
       [("$5x^2+3x-2=0$", "5x^2+3x-2=0", r"The sum of the new roots is $\dfrac{\alpha + \beta}{\alpha\beta} = \dfrac{-3/2}{-5/2} = +\dfrac35$, so the $x$ term is $-\dfrac35x$: you lost a minus sign.", None),
        ("$5x^2-3x+2=0$", "5x^2-3x+2=0", r"The product of the new roots is $\dfrac{1}{\alpha\beta} = -\dfrac25$, which is negative: you dropped its sign.", None),
        ("$2x^2-3x-5=0$", "2x^2-3x-5=0", r"Changing the sign of the middle term gives the roots $-\alpha$ and $-\beta$, not their reciprocals.", None)],
       lambda: eq_from_sum_product(R(-3, 2) / R(-5, 2), 1 / R(-5, 2)),
       r"""$\alpha + \beta = -\dfrac{3}{2}$, $\alpha\beta = -\dfrac{5}{2}$.

New sum: $\dfrac{\alpha + \beta}{\alpha\beta} = \dfrac{-3/2}{-5/2} = \dfrac{3}{5}$. New product: $\dfrac{1}{\alpha\beta} = -\dfrac{2}{5}$.

$x^{2} - \dfrac35x - \dfrac25 = 0$, that is $5x^{2} - 3x - 2 = 0$."""),
    mq("fm-poly-07", "Polynomials, Theory of Equations, and Roots",
       r"$\alpha$, $\beta$ and $\gamma$ are the roots of $2x^{3} - 4x^{2} + 3x - 6 = 0$. Find $\alpha\beta\gamma$.",
       ("$3$", 3),
       [("$-3$", -3, r"The product of the roots of $ax^{3} + bx^{2} + cx + d = 0$ is $-\dfrac{d}{a} = -\dfrac{-6}{2} = 3$: you missed the minus sign in the formula.",
         lambda: R(-6, 2)),
        ("$6$", 6, r"You did not divide by the leading coefficient $a = 2$.", lambda: 6),
        (r"$\dfrac{3}{2}$", R(3, 2), r"$\dfrac{c}{a} = \dfrac32$ is the sum of the products in pairs, $\alpha\beta + \beta\gamma + \gamma\alpha$, not the product.",
         lambda: R(3, 2))],
       lambda: -R(-6, 2),
       r"""For $ax^{3} + bx^{2} + cx + d = 0$: $\alpha\beta\gamma = -\dfrac{d}{a}$.

$\alpha\beta\gamma = -\dfrac{-6}{2} = 3$"""),

    # ── Partial fractions ────────────────────────────────────────────────
    mq("fm-pf-01", "Rational Functions and Partial Fractions",
       r"Given that $\dfrac{5x + 4}{(x - 1)(x + 2)} \equiv \dfrac{A}{x - 1} + \dfrac{B}{x + 2}$, find $A$.",
       ("$3$", 3),
       [("$2$", 2, r"$2$ is $B$, the numerator over $x + 2$. For $A$, put $x = 1$: $9 = 3A$.", lambda: (5 * -2 + 4) / sp.Integer(-2 - 1)),
        ("$-3$", -3, r"At $x = 1$, $x + 2 = 3$, not $-3$: $5(1) + 4 = A(1 + 2)$.", lambda: sp.Integer(9) / -3),
        ("$9$", 9, r"You found $5(1) + 4 = 9$ but did not divide by $x + 2 = 3$.", lambda: 5 * 1 + 4)],
       lambda: sp.Rational(5 * 1 + 4, 1 + 2),
       r"""$5x + 4 \equiv A(x + 2) + B(x - 1)$.

Put $x = 1$: $9 = 3A$, so $A = 3$. (Put $x = -2$: $-6 = -3B$, so $B = 2$.)"""),
    mq("fm-pf-02", "Rational Functions and Partial Fractions",
       r"$\dfrac{7x - 1}{(x - 1)(2x + 1)} \equiv \dfrac{A}{x - 1} + \dfrac{B}{2x + 1}$. Find $B$.",
       ("$3$", 3),
       [("$-5$", -5, r"You substituted $x = \tfrac12$. $2x + 1 = 0$ gives $x = -\tfrac12$.",
         lambda: (7 * R(1, 2) - 1) / (R(1, 2) - 1)),
        (r"$-\dfrac{9}{2}$", R(-9, 2), r"You found $7\left(-\tfrac12\right) - 1 = -\tfrac92$ but did not divide by $x - 1 = -\tfrac32$.",
         lambda: 7 * R(-1, 2) - 1),
        ("$2$", 2, r"$2$ is $A$, the numerator over $x - 1$.", lambda: (7 * 1 - 1) / sp.Integer(2 * 1 + 1))],
       lambda: (7 * R(-1, 2) - 1) / (R(-1, 2) - 1),
       r"""$7x - 1 \equiv A(2x + 1) + B(x - 1)$.

Put $x = -\tfrac12$: $-\tfrac92 = B\left(-\tfrac32\right)$, so $B = 3$. (And $x = 1$ gives $6 = 3A$, $A = 2$.)"""),
    concept("fm-pf-03", "Rational Functions and Partial Fractions",
            r"Which is the correct form of the partial fractions of $\dfrac{3x + 1}{(x + 2)^{2}(x - 1)}$?",
            r"$\dfrac{A}{x + 2} + \dfrac{B}{(x + 2)^{2}} + \dfrac{C}{x - 1}$",
            [(r"$\dfrac{A}{(x + 2)^{2}} + \dfrac{B}{x - 1}$", "A repeated factor $(x + 2)^{2}$ needs two fractions, over $x + 2$ and over $(x + 2)^{2}$; with only two unknowns the identity cannot be satisfied."),
             (r"$\dfrac{A}{x + 2} + \dfrac{B}{x + 2} + \dfrac{C}{x - 1}$", "The two fractions over $x + 2$ are really one fraction, $\\dfrac{A + B}{x + 2}$; the second must be over $(x + 2)^{2}$."),
             (r"$\dfrac{A}{x + 2} + \dfrac{B}{x - 1}$", "This ignores that $x + 2$ is repeated: with only two unknowns the identity $3x + 1 \\equiv \\dots$ cannot hold for every $x$. Add a fraction over $(x + 2)^{2}$.")],
            r"""Each distinct linear factor gives one fraction; a repeated factor $(x + 2)^{2}$ gives two:

$\dfrac{3x + 1}{(x + 2)^{2}(x - 1)} \equiv \dfrac{A}{x + 2} + \dfrac{B}{(x + 2)^{2}} + \dfrac{C}{x - 1}$"""),
    mq("fm-pf-04", "Rational Functions and Partial Fractions",
       r"$\dfrac{3x - 5}{(x - 1)^{2}(x + 1)} \equiv \dfrac{A}{x - 1} + \dfrac{B}{(x - 1)^{2}} + \dfrac{C}{x + 1}$. Find $B$.",
       ("$-1$", -1),
       [("$1$", 1, r"At $x = 1$: $3 - 5 = -2 = 2B$, so $B = -1$; you lost the sign of $-2$.", lambda: sp.Integer(2) / 2),
        ("$2$", 2, r"$2$ is $A$, found by comparing the coefficients of $x^{2}$.", lambda: 2),
        ("$-2$", -2, r"$-2$ is $C$, found by putting $x = -1$: $-8 = 4C$.", lambda: sp.Integer(-8) / 4)],
       lambda: sp.Integer(3 * 1 - 5) / (1 + 1),
       r"""$3x - 5 \equiv A(x - 1)(x + 1) + B(x + 1) + C(x - 1)^{2}$.

Put $x = 1$: $-2 = 2B$, so $B = -1$. (Then $x = -1$ gives $C = -2$, and the $x^{2}$ terms give $A = 2$.)"""),
    mq("fm-pf-05", "Rational Functions and Partial Fractions",
       r"$\dfrac{3x^{2} + 1}{(x + 1)(x^{2} + 1)} \equiv \dfrac{2}{x + 1} + \dfrac{Bx + C}{x^{2} + 1}$. Find $Bx + C$.",
       ("$x - 1$", x - 1),
       [("$x + 1$", x + 1, r"Constants: $1 = 2 + C$, so $C = -1$, not $+1$.", lambda: x + 1),
        ("$3x + 1$", 3 * x + 1, r"You copied the numerator's coefficients. Compare coefficients after writing $3x^{2} + 1 \equiv 2(x^{2} + 1) + (Bx + C)(x + 1)$.", lambda: 3 * x + 1),
        ("$1 - x$", 1 - x, r"$x^{2}$: $3 = 2 + B$ gives $B = +1$, and constants give $C = -1$; you swapped both signs.", lambda: 1 - x)],
       lambda: sp.simplify(((3 * x**2 + 1) / ((x + 1) * (x**2 + 1)) - 2 / (x + 1)) * (x**2 + 1)),
       r"""$3x^{2} + 1 \equiv 2(x^{2} + 1) + (Bx + C)(x + 1)$.

$x^{2}$: $3 = 2 + B$, so $B = 1$. Constants: $1 = 2 + C$, so $C = -1$. So $Bx + C = x - 1$."""),
    mq("fm-pf-06", "Rational Functions and Partial Fractions",
       r"Express $\dfrac{x^{2} + 2}{(x + 1)(x - 2)}$ in partial fractions.",
       (r"$1 + \dfrac{2}{x - 2} - \dfrac{1}{x + 1}$", 1 + 2 / (x - 2) - 1 / (x + 1)),
       [(r"$\dfrac{2}{x - 2} - \dfrac{1}{x + 1}$", 2 / (x - 2) - 1 / (x + 1), r"The fraction is improper (degree 2 over degree 2), so divide first: $\dfrac{x^{2} + 2}{x^{2} - x - 2} = 1 + \dfrac{x + 4}{x^{2} - x - 2}$. You lost the 1.", None),
        (r"$1 - \dfrac{2}{x - 2} + \dfrac{1}{x + 1}$", 1 - 2 / (x - 2) + 1 / (x + 1), r"By cover-up, $x = 2$ gives $\dfrac{6}{3} = +2$ and $x = -1$ gives $\dfrac{3}{-3} = -1$; you reversed both signs.", None),
        (r"$1 + \dfrac{6}{x - 2} + \dfrac{3}{x + 1}$", 1 + 6 / (x - 2) + 3 / (x + 1), r"You put $x = 2$ and $x = -1$ into $x + 4$ but did not divide by the other factor.", None)],
       lambda: sp.apart((x**2 + 2) / ((x + 1) * (x - 2)), x),
       r"""Improper, so divide: $x^{2} + 2 = (x^{2} - x - 2) + (x + 4)$, giving $1 + \dfrac{x + 4}{(x + 1)(x - 2)}$.

Cover-up: $x = 2$: $\dfrac{6}{3} = 2$; $x = -1$: $\dfrac{3}{-3} = -1$.

$\dfrac{x^{2} + 2}{(x + 1)(x - 2)} = 1 + \dfrac{2}{x - 2} - \dfrac{1}{x + 1}$"""),

    # ── Binomial theorem ─────────────────────────────────────────────────
    mq("fm-bin-01", "Binomial Theorem",
       r"Find the coefficient of $x^{3}$ in the expansion of $(1 - 2x)^{6}$.",
       ("$-160$", -160),
       [("$160$", 160, r"$(-2x)^{3} = -8x^{3}$: an odd power of a negative term is negative.", lambda: sp.binomial(6, 3) * 8),
        ("$-40$", -40, r"You used $-2x^{3}$ instead of $(-2x)^{3}$: the 2 must be cubed too.", lambda: sp.binomial(6, 3) * -2),
        ("$-120$", -120, r"$\binom{6}{2}(-2)^{3}$ mixes two terms: the $x^{3}$ term has $r = 3$, so the coefficient is $\binom{6}{3}$.", lambda: sp.binomial(6, 2) * -8)],
       lambda: sp.expand((1 - 2 * x)**6).coeff(x, 3),
       r"""$T_{r+1} = \binom{6}{r}(-2x)^{r}$. For $x^{3}$, $r = 3$:

$\binom{6}{3}(-2)^{3} = 20 \times (-8) = -160$"""),
    mq("fm-bin-02", "Binomial Theorem",
       r"Find the term independent of $x$ in the expansion of $\left(x^{2} - \dfrac{1}{x}\right)^{6}$.",
       ("$15$", 15),
       [("$-15$", -15, r"The term has $r = 4$ and $(-1)^{4} = +1$: an even power of $-1$ is positive.", lambda: -sp.binomial(6, 4)),
        ("$-20$", -20, r"You solved $6 - 2r = 0$, treating $x^{2}$ as $x$. The power of $x$ is $2(6 - r) - r = 12 - 3r$.", lambda: sp.binomial(6, 3) * (-1)**3),
        ("$20$", 20, r"You took $r = 3$ (from $6 - 2r = 0$) and also dropped the sign.", lambda: sp.binomial(6, 3))],
       lambda: sp.expand((x**2 - 1 / x)**6).coeff(x, 0),
       r"""$T_{r+1} = \binom{6}{r}(x^{2})^{6-r}\left(-\dfrac1x\right)^{r} = \binom{6}{r}(-1)^{r}x^{12 - 3r}$.

$12 - 3r = 0$ gives $r = 4$: $\binom{6}{4}(-1)^{4} = 15$."""),
    mq("fm-bin-03", "Binomial Theorem",
       r"Find the 4th term in the expansion of $(1 + 2x)^{9}$ in ascending powers of $x$.",
       ("$672x^{3}$", 672 * x**3),
       [("$2016x^{4}$", 2016 * x**4, r"That is the 5th term. The $k$th term has $r = k - 1$, so the 4th term has $r = 3$.", lambda: sp.binomial(9, 4) * 16 * x**4),
        ("$168x^{3}$", 168 * x**3, r"You used $2x^{3}$ instead of $(2x)^{3} = 8x^{3}$.", lambda: sp.binomial(9, 3) * 2 * x**3),
        ("$84x^{3}$", 84 * x**3, r"You left out the 2 altogether: the term is $\binom{9}{3}(2x)^{3}$.", lambda: sp.binomial(9, 3) * x**3)],
       lambda: sp.binomial(9, 3) * (2 * x)**3,
       r"""The 4th term has $r = 3$: $T_4 = \binom{9}{3}(2x)^{3} = 84 \times 8x^{3} = 672x^{3}$."""),
    mq("fm-bin-04", "Binomial Theorem",
       r"Use the first three terms of the expansion of $(1 + x)^{5}$ to evaluate $(1.02)^{5}$, correct to 4 decimal places.",
       ("$1.1040$", Rounded(1.104, dp=4)),
       [("$1.1000$", Rounded(1.1, dp=4), r"That uses only two terms, $1 + 5x$. The question asks for three: add $10x^{2} = 0.004$.", lambda: 1 + 5 * 0.02),
        ("$1.1004$", Rounded(1.1004, dp=4), r"$0.02^{2} = 0.0004$, so $10x^{2} = 0.004$; you used $0.00004$.", lambda: 1 + 0.1 + 10 * 0.00004),
        ("$1.1400$", Rounded(1.14, dp=4), r"$0.02^{2} = 0.0004$, not $0.004$, so $10x^{2} = 0.004$, not $0.04$.", lambda: 1 + 0.1 + 10 * 0.004)],
       lambda: 1 + 5 * 0.02 + 10 * 0.02**2,
       r"""$(1 + x)^{5} = 1 + 5x + 10x^{2} + \dots$ With $x = 0.02$:

$1 + 5(0.02) + 10(0.0004) = 1 + 0.1 + 0.004 = 1.1040$"""),
    mq("fm-bin-05", "Binomial Theorem",
       r"Find the coefficient of $x^{2}$ in the expansion of $(2 + x)^{5}$.",
       ("$80$", 80),
       [("$10$", 10, r"$\binom52 = 10$ is only the binomial coefficient; it must be multiplied by $2^{3}$.", lambda: sp.binomial(5, 2)),
        ("$40$", 40, r"The power of 2 is $5 - 2 = 3$, so use $2^{3} = 8$, not $2^{2}$.", lambda: sp.binomial(5, 2) * 2**2),
        ("$160$", 160, r"The power of 2 is $n - r = 3$, not $4$.", lambda: sp.binomial(5, 2) * 2**4)],
       lambda: sp.expand((2 + x)**5).coeff(x, 2),
       r"""$T_{r+1} = \binom{5}{r}2^{5-r}x^{r}$. For $x^{2}$, $r = 2$: $\binom52 \times 2^{3} = 10 \times 8 = 80$."""),
    mq("fm-bin-06", "Binomial Theorem",
       r"Find the coefficient of $x^{2}$ in the expansion of $(1 + x)^{-\frac12}$ in ascending powers of $x$.",
       (r"$\dfrac{3}{8}$", R(3, 8)),
       [(r"$-\dfrac{3}{8}$", R(-3, 8), r"$n(n - 1) = \left(-\tfrac12\right)\left(-\tfrac32\right) = +\tfrac34$: two negatives make a positive.", lambda: -R(-1, 2) * R(-3, 2) / 2),
        (r"$\dfrac{3}{4}$", R(3, 4), r"You forgot to divide by $2! = 2$.", lambda: R(-1, 2) * R(-3, 2)),
        (r"$-\dfrac{1}{8}$", R(-1, 8), r"$-\tfrac18$ is the coefficient of $x^{2}$ in $(1 + x)^{\frac12}$, with $n = +\tfrac12$.", lambda: R(1, 2) * R(-1, 2) / 2)],
       lambda: sp.series((1 + x)**R(-1, 2), x, 0, 3).removeO().coeff(x, 2),
       r"""$\dfrac{n(n - 1)}{2!}$ with $n = -\tfrac12$: $\dfrac{\left(-\tfrac12\right)\left(-\tfrac32\right)}{2} = \dfrac{3/4}{2} = \dfrac38$."""),
    concept("fm-bin-07", "Binomial Theorem",
            r"For what values of $x$ is the expansion of $(1 - 3x)^{-2}$ in ascending powers of $x$ valid?",
            r"$|x| < \dfrac{1}{3}$",
            [(r"$|x| < 3$", "The expansion of $(1 + y)^{n}$ is valid for $|y| < 1$; here $y = -3x$, so $|3x| < 1$, giving $|x| < \\tfrac13$, not $|x| < 3$."),
             (r"$|x| < 1$", "That is the condition on the whole term $-3x$, not on $x$: $|3x| < 1$."),
             (r"all real values of $x$", "Only a positive whole-number power gives a finite expansion valid for all $x$. A negative power gives an infinite series, valid only for $|3x| < 1$.")],
            r"""$(1 + y)^{n}$ with $n = -2$ is valid for $|y| < 1$. Here $y = -3x$:

$|-3x| < 1 \Rightarrow |x| < \dfrac13$"""),

    # ── Surds, indices and logarithms ────────────────────────────────────
    mq("fm-log-01", "Surds, Indices, and Logarithms",
       r"Rationalise $\dfrac{6}{3 - \sqrt{3}}$.",
       (r"$3 + \sqrt{3}$", 3 + sp.sqrt(3)),
       [(r"$3 - \sqrt{3}$", 3 - sp.sqrt(3), r"Multiply by the conjugate $3 + \sqrt3$, which keeps the $+$ sign in the numerator.", None),
        (r"$\dfrac{3 + \sqrt{3}}{2}$", (3 + sp.sqrt(3)) / 2, r"$(3 - \sqrt3)(3 + \sqrt3) = 9 - 3 = 6$; you used $9 + 3 = 12$.", lambda: 6 * (3 + sp.sqrt(3)) / 12),
        (r"$6 + 2\sqrt{3}$", 6 + 2 * sp.sqrt(3), r"You multiplied the top by $3 + \sqrt3$ and divided by 3 instead of by $9 - 3 = 6$.", lambda: 6 * (3 + sp.sqrt(3)) / 3)],
       lambda: sp.radsimp(6 / (3 - sp.sqrt(3))),
       r"""$\dfrac{6}{3 - \sqrt3} \times \dfrac{3 + \sqrt3}{3 + \sqrt3} = \dfrac{6(3 + \sqrt3)}{9 - 3} = 3 + \sqrt3$"""),
    mq("fm-log-02", "Surds, Indices, and Logarithms",
       r"Find $\sqrt{7 + 4\sqrt{3}}$.",
       (r"$2 + \sqrt{3}$", 2 + sp.sqrt(3)),
       [(r"$4 + \sqrt{3}$", 4 + sp.sqrt(3), r"With $\sqrt a + \sqrt b$, $a = 4$ and $b = 3$, so the answer is $\sqrt4 + \sqrt3 = 2 + \sqrt3$: you forgot to take the root of 4.", None),
        (r"$\sqrt{7} + 2$", sp.sqrt(7) + 2, r"A square root does not split over a sum: $\sqrt{7 + 4\sqrt3} \ne \sqrt7 + \sqrt{4\sqrt3}$.", None),
        (r"$1 + 2\sqrt{3}$", 1 + 2 * sp.sqrt(3), r"$(1 + 2\sqrt3)^{2} = 13 + 4\sqrt3$, not $7 + 4\sqrt3$. Always check by squaring.", None)],
       lambda: sp.sqrtdenest(sp.sqrt(7 + 4 * sp.sqrt(3))),
       r"""Let $\sqrt{7 + 4\sqrt3} = \sqrt a + \sqrt b$. Then $a + b = 7$ and $2\sqrt{ab} = 4\sqrt3$, so $ab = 12$: $a = 4$, $b = 3$.

$\sqrt{7 + 4\sqrt3} = 2 + \sqrt3$. Check: $(2 + \sqrt3)^{2} = 4 + 4\sqrt3 + 3 = 7 + 4\sqrt3$ ✓"""),
    mq("fm-log-03", "Surds, Indices, and Logarithms",
       r"Solve $2^{2x + 1} - 5(2^{x}) + 2 = 0$.",
       ("$x = -1$ or $x = 1$", {-1, 1}),
       [(r"$x = \dfrac12$ or $x = 2$", {R(1, 2), 2}, r"These are the values of $y = 2^{x}$. Solve $2^{x} = \tfrac12$ and $2^{x} = 2$ to get $x$.", None),
        ("$x = 1$ only", {1}, r"$2^{x} = \tfrac12 = 2^{-1}$ is valid and gives $x = -1$. Only $2^{x} \le 0$ would be rejected.", None),
        ("$x = -2$ or $x = 0$", {-2, 0}, r"$2^{2x + 1} = 2(2^{x})^{2}$; you treated it as $(2^{x})^{2}$ and then misread the roots.", None)],
       lambda: {int(sp.log(yv, 2)) for yv in sp.solve(2 * sp.Symbol("y")**2 - 5 * sp.Symbol("y") + 2, sp.Symbol("y"))},
       r"""$2^{2x + 1} = 2(2^{x})^{2}$. Let $y = 2^{x}$: $2y^{2} - 5y + 2 = 0$, $(2y - 1)(y - 2) = 0$.

$y = \tfrac12 \Rightarrow 2^{x} = 2^{-1} \Rightarrow x = -1$; $y = 2 \Rightarrow x = 1$."""),
    mq("fm-log-04", "Surds, Indices, and Logarithms",
       r"Evaluate $\log_{8} 32$.",
       (r"$\dfrac{5}{3}$", R(5, 3)),
       [(r"$\dfrac{3}{5}$", R(3, 5), r"$\log_{8} 32 = \dfrac{\log_{2} 32}{\log_{2} 8} = \dfrac53$: you inverted the fraction.", lambda: R(3, 5)),
        ("$4$", 4, r"$\log_{8} 32$ is the power of 8 that gives 32, not $32 \div 8$.", lambda: 32 // 8),
        (r"$\dfrac{2}{3}$", R(2, 3), r"$\log 32 - \log 8 = \log 4$ is $\log\tfrac{32}{8}$; the change-of-base formula divides the logs.", lambda: R(2, 3))],
       lambda: sp.nsimplify(sp.log(32) / sp.log(8)),
       r"""Change to base 2: $\log_{8} 32 = \dfrac{\log_{2} 32}{\log_{2} 8} = \dfrac{5}{3}$. Check: $8^{5/3} = 2^{5} = 32$ ✓"""),
    mq("fm-log-05", "Surds, Indices, and Logarithms",
       r"Solve $\log_{2}(x + 3) + \log_{2}(x - 3) = 4$.",
       ("$x = 5$", {5}),
       [("$x = -5$ or $x = 5$", {-5, 5}, r"$x = -5$ makes $x - 3 = -8$, and $\log_{2}(-8)$ is undefined, so it must be rejected.", None),
        ("$x = 8$", {8}, r"$\log a + \log b = \log(ab)$, not $\log(a + b)$: you solved $(x + 3) + (x - 3) = 16$.", None),
        (r"$x = \sqrt{17}$", {sp.sqrt(17)}, r"$\log_{2} N = 4$ means $N = 2^{4} = 16$, not $2 \times 4 = 8$.", None)],
       lambda: {s for s in sp.solve((x + 3) * (x - 3) - 16, x) if s - 3 > 0},
       r"""$\log_{2}[(x + 3)(x - 3)] = 4 \Rightarrow x^{2} - 9 = 16 \Rightarrow x = \pm5$.

$x = -5$ gives $\log_{2}(-8)$, which is undefined. So $x = 5$."""),
    mq("fm-log-06", "Surds, Indices, and Logarithms",
       r"Given that $\log 2 = 0.3010$ and $\log 3 = 0.4771$, find $\log 48$.",
       ("$1.6811$", Rounded(1.6811, dp=4)),
       [("$1.3801$", Rounded(1.3801, dp=4), r"$48 = 2^{4} \times 3$, not $2^{3} \times 3 = 24$.", lambda: 3 * 0.3010 + 0.4771),
        ("$1.9821$", Rounded(1.9821, dp=4), r"$2^{5} \times 3 = 96$; $48 = 2^{4} \times 3$.", lambda: 5 * 0.3010 + 0.4771),
        ("$0.5744$", Rounded(0.5744, dp=4), r"$\log(MN) = \log M + \log N$: you multiplied the logarithms instead of adding them.", lambda: 4 * 0.3010 * 0.4771)],
       lambda: 4 * 0.3010 + 0.4771,
       r"""$48 = 16 \times 3 = 2^{4} \times 3$.

$\log 48 = 4\log 2 + \log 3 = 4(0.3010) + 0.4771 = 1.2040 + 0.4771 = 1.6811$"""),
    mq("fm-log-07", "Surds, Indices, and Logarithms",
       r"Solve $3^{x + 1} = 5$, giving your answer correct to 3 decimal places.",
       ("$0.465$", Rounded(0.465, dp=3)),
       [("$1.465$", Rounded(1.465, dp=3), r"$\dfrac{\log 5}{\log 3} = 1.465$ is $x + 1$; subtract 1 to get $x$.", lambda: float(sp.log(5) / sp.log(3))),
        ("$0.667$", Rounded(0.667, dp=3), r"You divided 5 by 3 and subtracted 1. Take logarithms: $(x + 1)\log 3 = \log 5$.", lambda: 5 / 3 - 1),
        ("$-0.778$", Rounded(-0.778, dp=3), r"$\dfrac{\log 5}{\log 3}$ is not $\log 5 - \log 3$: you subtracted the logarithms instead of dividing.", lambda: float(sp.log(5, 10) - sp.log(3, 10)) - 1)],
       lambda: float(sp.log(5) / sp.log(3)) - 1,
       r"""Take logs: $(x + 1)\log 3 = \log 5$, so $x + 1 = \dfrac{\log 5}{\log 3} = \dfrac{0.69897}{0.47712} = 1.46497$.

$x = 0.465$ (3 d.p.)"""),

    # ── Sets and binary operations ───────────────────────────────────────
    mq("fm-sets-01", "Sets",
       r"How many subsets has the set $\{a, b, c, d, e\}$?",
       ("$32$", 32),
       [("$31$", 31, r"31 is the number of proper subsets, $2^{5} - 1$. The question asks for all subsets, including the set itself.", lambda: 2**5 - 1),
        ("$25$", 25, r"The number of subsets is $2^{n}$, not $n^{2}$.", lambda: 5**2),
        ("$10$", 10, r"The number of subsets is $2^{n} = 2^{5}$, not $2 \times 5$.", lambda: 2 * 5)],
       lambda: 2**5,
       r"""Each of the 5 elements is either in a subset or not: $2^{5} = 32$ subsets."""),
    concept("fm-sets-02", "Sets",
            r"Which of the following is equal to $(A \cup B)'$?",
            r"$A' \cap B'$",
            [(r"$A' \cup B'$", r"That is $(A \cap B)'$. De Morgan's laws swap union and intersection when you take the complement."),
             (r"$A \cap B$", "Taking a complement does not turn a union into the intersection of the original sets; complement each set as well."),
             (r"$A' \cap B$", r"Both sets must be complemented: $(A \cup B)' = A' \cap B'$.")],
            r"""De Morgan's law: the complement of a union is the intersection of the complements.

$(A \cup B)' = A' \cap B'$"""),
    mq("fm-sets-03", "Sets",
       r"In a class of 50 students, 24 study Economics, 20 study Geography and 18 study Government. 8 study Economics and Geography, 7 Economics and Government, 6 Geography and Government, and 3 study all three. How many study none of the three subjects?",
       ("$6$", 6),
       [("$9$", 9, r"You subtracted the pairs but did not add back the 3 who study all three: $n(A \cup B \cup C)$ adds $n(A \cap B \cap C)$ at the end.", lambda: 50 - (24 + 20 + 18 - 8 - 7 - 6)),
        ("$12$", 12, r"You subtracted the 3 in all three subjects instead of adding them back.", lambda: 50 - (24 + 20 + 18 - 8 - 7 - 6 - 3)),
        ("$3$", 3, r"3 is the number who study all three subjects, not the number who study none.", lambda: 3)],
       lambda: 50 - (24 + 20 + 18 - 8 - 7 - 6 + 3),
       r"""$n(E \cup G \cup V) = 24 + 20 + 18 - 8 - 7 - 6 + 3 = 44$.

None: $50 - 44 = 6$."""),
    concept("fm-sets-04", "Sets",
            r"Simplify $(A \cap B) \cup (A \cap B')$.",
            "$A$",
            [("$B$", "Both brackets contain $A$, not $B$: by the distributive law the expression is $A \\cap (B \\cup B')$."),
             (r"$U$", "$B \\cup B' = U$, but the expression is $A \\cap U = A$, not $U$ itself."),
             (r"$\varnothing$", "$B \\cap B' = \\varnothing$, but the expression combines $B$ and $B'$ with a union, giving $U$.")],
            r"""Distributive law: $(A \cap B) \cup (A \cap B') = A \cap (B \cup B') = A \cap U = A$."""),
    mq("fm-sets-05", "Sets",
       r"$n(U) = 50$, $n(A) = 28$, $n(B) = 25$ and $n(A \cap B) = 10$. Find $n(A' \cap B')$.",
       ("$7$", 7),
       [("$-3$", -3, r"You did not subtract the overlap: $n(A \cup B) = 28 + 25 - 10 = 43$.", lambda: 50 - (28 + 25)),
        ("$10$", 10, r"10 is $n(A \cap B)$. By De Morgan, $A' \cap B' = (A \cup B)'$.", lambda: 10),
        ("$17$", 17, r"$n(A \cup B) = 28 + 25 - 10$, with the overlap subtracted once: you subtracted 20.", lambda: 50 - (28 + 25 - 2 * 10))],
       lambda: 50 - (28 + 25 - 10),
       r"""$n(A \cup B) = 28 + 25 - 10 = 43$. By De Morgan, $A' \cap B' = (A \cup B)'$:

$n(A' \cap B') = 50 - 43 = 7$"""),
    mq("fm-bin-op-01", "Sets",
       r"A binary operation $*$ is defined on the real numbers by $a * b = a + b - 2ab$. Find $3 * 4$.",
       ("$-17$", -17),
       [("$31$", 31, r"The rule subtracts $2ab$: $7 - 24$, not $7 + 24$.", lambda: 3 + 4 + 2 * 3 * 4),
        ("$-5$", -5, r"You subtracted $ab = 12$ instead of $2ab = 24$.", lambda: 3 + 4 - 3 * 4),
        ("$17$", 17, r"$7 - 24 = -17$: the sign of the answer was dropped.", lambda: abs(3 + 4 - 2 * 3 * 4))],
       lambda: 3 + 4 - 2 * 3 * 4,
       r"""$3 * 4 = 3 + 4 - 2(3)(4) = 7 - 24 = -17$"""),
    mq("fm-bin-op-02", "Sets",
       r"A binary operation $\oplus$ is defined on the real numbers by $a \oplus b = a + b - 4$. Find the identity element.",
       ("$4$", 4),
       [("$-4$", -4, r"Solve $a + e - 4 = a$: $e = +4$.", lambda: -4),
        ("$0$", 0, r"0 is the identity for ordinary addition, but here $a \oplus 0 = a - 4 \ne a$.", lambda: 0),
        ("$1$", 1, r"1 is the identity for multiplication. Solve $a \oplus e = a$ for this rule.", lambda: 1)],
       lambda: sp.solve(sp.Symbol("a") + sp.Symbol("e") - 4 - sp.Symbol("a"), sp.Symbol("e"))[0],
       r"""Identity $e$: $a \oplus e = a$, so $a + e - 4 = a$ and $e = 4$."""),
    mq("fm-bin-op-03", "Sets",
       r"For the operation $a \oplus b = a + b - 4$ on the real numbers, the identity element is 4. Find the inverse of 3.",
       ("$5$", 5),
       [("$1$", 1, r"The inverse gives the identity, 4, not 0: solve $3 + y - 4 = 4$.", lambda: sp.solve(3 + sp.Symbol("y") - 4, sp.Symbol("y"))[0]),
        (r"$\dfrac{1}{3}$", R(1, 3), r"The reciprocal is the inverse for multiplication only; use this operation's rule.", lambda: R(1, 3)),
        ("$-3$", -3, r"The negative is the inverse for ordinary addition only; use this operation's rule.", lambda: -3)],
       lambda: sp.solve(3 + sp.Symbol("y") - 4 - 4, sp.Symbol("y"))[0],
       r"""Inverse $y$ of 3: $3 \oplus y = e = 4$, so $3 + y - 4 = 4$ and $y = 5$."""),
    mq("fm-bin-op-04", "Sets",
       r"The set $\{1, 3, 5, 7\}$ is combined under multiplication modulo 8. Find $5 \times 7$ in this operation.",
       ("$3$", 3),
       [("$35$", 35, r"Reduce modulo 8: $35 = 4 \times 8 + 3$, so $35 \equiv 3$.", lambda: 5 * 7),
        ("$11$", 11, r"$35 - 24 = 11$ is still larger than 8; subtract $4 \times 8 = 32$.", lambda: 35 - 24),
        ("$1$", 1, r"Only the products on the diagonal ($a \times a$) give 1 in this table; $5 \times 7 \equiv 3$.", lambda: 1)],
       lambda: (5 * 7) % 8,
       r"""$5 \times 7 = 35 = 4 \times 8 + 3$, so $5 \times 7 \equiv 3 \pmod 8$."""),

    # ── Functions ────────────────────────────────────────────────────────
    mq("fm-fn-01", "Functions",
       r"$f(x) = 2x - 5$ and $g(x) = x^{2} + 1$. Find $fg(2)$.",
       ("$5$", 5),
       [("$2$", 2, r"That is $gf(2) = g(-1) = 2$. In $fg(2)$, $g$ acts first: $g(2) = 5$, then $f(5) = 5$.", lambda: (2 * 2 - 5)**2 + 1),
        ("$-5$", -5, r"$fg(2)$ is $f(g(2))$, not the product $f(2) \times g(2) = (-1)(5)$.", lambda: (2 * 2 - 5) * (2**2 + 1)),
        ("$4$", 4, r"$fg(2)$ is not $f(2) + g(2)$; put $g(2)$ into $f$.", lambda: (2 * 2 - 5) + (2**2 + 1))],
       lambda: 2 * (2**2 + 1) - 5,
       r"""$g(2) = 4 + 1 = 5$, then $f(5) = 2(5) - 5 = 5$. So $fg(2) = 5$."""),
    mq("fm-fn-02", "Functions",
       r"$f(x) = 2x - 5$ and $g(x) = x^{2} + 1$. Find $fg(x)$.",
       ("$2x^{2} - 3$", 2 * x**2 - 3),
       [("$4x^{2} - 20x + 26$", 4 * x**2 - 20 * x + 26, r"That is $gf(x) = (2x - 5)^{2} + 1$. In $fg(x)$, $g$ goes inside $f$.", lambda: sp.expand((2 * x - 5)**2 + 1)),
        ("$2x^{3} - 5x^{2} + 2x - 5$", 2 * x**3 - 5 * x**2 + 2 * x - 5, r"$fg(x)$ is a composite, not the product $(2x - 5)(x^{2} + 1)$.", lambda: sp.expand((2 * x - 5) * (x**2 + 1))),
        ("$2x^{2} - 4$", 2 * x**2 - 4, r"Multiply the whole of $x^{2} + 1$ by 2: $2(x^{2} + 1) - 5 = 2x^{2} - 3$.", lambda: 2 * x**2 + 1 - 5)],
       lambda: sp.expand(2 * (x**2 + 1) - 5),
       r"""$fg(x) = f(x^{2} + 1) = 2(x^{2} + 1) - 5 = 2x^{2} - 3$"""),
    concept("fm-fn-03", "Functions",
            r"State the largest domain of $f(x) = \dfrac{1}{x^{2} - 9}$.",
            r"all real $x$ except $x = -3$ and $x = 3$",
            [(r"all real $x$ except $x = 3$", "$x^{2} = 9$ has two solutions: $x = -3$ makes the denominator zero too."),
             (r"all real $x$ except $x = 9$", "Exclude the values of $x$ that make $x^{2} - 9 = 0$, that is $x = \\pm3$, not $x = 9$."),
             (r"$x > 3$", "Only zero in the denominator is forbidden; values such as $x = 0$ or $x = -5$ are allowed.")],
            r"""The denominator is zero when $x^{2} = 9$, that is $x = \pm3$. The domain is all real $x$ except $-3$ and $3$."""),
    concept("fm-fn-04", "Functions",
            r"State the largest domain of $g(x) = \sqrt{5 - 2x}$.",
            r"$x \le \dfrac{5}{2}$",
            [(r"$x \ge \dfrac{5}{2}$", "$5 - 2x \\ge 0$ gives $2x \\le 5$: dividing does not reverse the inequality here, and the values below $\\tfrac52$ are the allowed ones."),
             (r"$x < \dfrac{5}{2}$", "$\\sqrt{0} = 0$ is defined, so $x = \\tfrac52$ belongs to the domain: use $\\le$."),
             (r"$x \le 5$", "Divide by 2 as well: $2x \\le 5$ gives $x \\le \\tfrac52$.")],
            r"""The expression under the root must not be negative: $5 - 2x \ge 0$, so $x \le \dfrac52$."""),
    mq("fm-fn-05", "Functions",
       r"$f(x) = \dfrac{2x + 1}{x - 3}$, $x \ne 3$. Find $f^{-1}(x)$.",
       (r"$\dfrac{3x + 1}{x - 2}$", (3 * x + 1) / (x - 2)),
       [(r"$\dfrac{x - 3}{2x + 1}$", (x - 3) / (2 * x + 1), r"The inverse function is not the reciprocal $\dfrac{1}{f(x)}$. Make $x$ the subject of $y = f(x)$.", lambda: 1 / ((2 * x + 1) / (x - 3))),
        (r"$\dfrac{3x - 1}{x + 2}$", (3 * x - 1) / (x + 2), r"From $xy - 3y = 2x + 1$, collect: $x(y - 2) = 3y + 1$. You changed the signs.", None),
        (r"$\dfrac{x + 1}{x - 3}$", (x + 1) / (x - 3), r"Solving for $x$ needs every $x$ term on one side; the coefficient 2 cannot be dropped.", None)],
       lambda: sp.simplify(sp.solve(sp.Eq(sp.Symbol("y"), (2 * x + 1) / (x - 3)), x)[0].subs(sp.Symbol("y"), x)),
       r"""$y = \dfrac{2x + 1}{x - 3} \Rightarrow xy - 3y = 2x + 1 \Rightarrow x(y - 2) = 3y + 1 \Rightarrow x = \dfrac{3y + 1}{y - 2}$.

$f^{-1}(x) = \dfrac{3x + 1}{x - 2}$, $x \ne 2$."""),
    mq("fm-fn-06", "Functions",
       r"$f(x) = 3x - 2$. Find $f^{-1}(7)$.",
       ("$3$", 3),
       [("$19$", 19, r"$19 = f(7)$. The inverse undoes $f$: solve $3x - 2 = 7$.", lambda: 3 * 7 - 2),
        (r"$\dfrac{1}{19}$", R(1, 19), r"$f^{-1}(7)$ is not $\dfrac{1}{f(7)}$.", lambda: R(1, 3 * 7 - 2)),
        (r"$\dfrac{5}{3}$", R(5, 3), r"The inverse is $f^{-1}(x) = \dfrac{x + 2}{3}$: add 2 (undo the $-2$), do not subtract it.", lambda: R(7 - 2, 3))],
       lambda: R(7 + 2, 3),
       r"""$f^{-1}(x) = \dfrac{x + 2}{3}$, so $f^{-1}(7) = \dfrac{9}{3} = 3$. Check: $f(3) = 9 - 2 = 7$ ✓"""),
]
