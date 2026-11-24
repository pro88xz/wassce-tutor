:::callout{type=definition}
A **polynomial** is an expression in $x$ made of terms of the form $ax^n$, where each power $n$ is a whole number and each coefficient $a$ is a constant, such as $2x^3 - 3x^2 + 4x - 5$. The highest power of $x$ is the **degree** of the polynomial: 3 here.
:::

The remainder theorem and the factor theorem let you divide, factorise and solve cubic equations without long, error-prone division, and the relationships between the roots and the coefficients let you work with the roots of an equation without ever finding them. These ideas appear in almost every WASSCE Further Mathematics paper. This lesson covers **division of polynomials**, the **remainder theorem**, the **factor theorem**, **solving cubic equations**, and the **sum and product of roots** of quadratic and cubic equations.

## Learning objectives

By the end of this lesson you should be able to:

- state the degree, leading coefficient and constant term of a polynomial
- divide a polynomial by a linear expression and write $P(x) = D(x)Q(x) + R$
- use the remainder theorem to find a remainder without dividing
- use the factor theorem to factorise a cubic and solve a cubic equation
- find unknown coefficients from given factors or remainders
- use the sum and product of roots of quadratic and cubic equations
- form an equation whose roots are related to the roots of a given equation

## The language of polynomials

:::callout{type=definition}
**Leading coefficient:** the coefficient of the highest power of $x$, such as 2 in $2x^3 - 3x^2 + 4x - 5$.

**Constant term:** the term with no $x$, such as $-5$ in $2x^3 - 3x^2 + 4x - 5$.

**Cubic polynomial:** a polynomial of degree 3; a **quadratic** has degree 2 and a **linear** polynomial degree 1.
:::

Two polynomials are **identical** when the coefficients of every power of $x$ are equal. This is the idea behind **equating coefficients**, which you will use again in partial fractions.

## Dividing a polynomial

When a polynomial $P(x)$ is divided by a divisor $D(x)$, you get a **quotient** $Q(x)$ and a **remainder** $R(x)$, whose degree is less than the degree of the divisor:

$$P(x) = D(x)\,Q(x) + R(x)$$

:::callout{type=worked-example}
**Divide $x^3 + 2x^2 - x + 3$ by $x - 1$.**

Long division, step by step:

- $x^3 \div x = x^2$; $x^2(x - 1) = x^3 - x^2$; subtract: $3x^2 - x$.
- $3x^2 \div x = 3x$; $3x(x - 1) = 3x^2 - 3x$; subtract: $2x + 3$.
- $2x \div x = 2$; $2(x - 1) = 2x - 2$; subtract: $5$.

So $x^3 + 2x^2 - x + 3 = (x - 1)(x^2 + 3x + 2) + 5$. The quotient is $x^2 + 3x + 2$ and the remainder is 5.
:::

## The remainder theorem

:::callout{type=definition}
**Remainder theorem:** when a polynomial $P(x)$ is divided by $x - a$, the remainder is $P(a)$. When it is divided by $ax - b$, the remainder is $P\!\left(\dfrac{b}{a}\right)$.
:::

The reason: put $x = a$ in $P(x) = (x - a)Q(x) + R$. The first term becomes zero, leaving $P(a) = R$. In the example above, $P(1) = 1 + 2 - 1 + 3 = 5$, the same remainder, found in one line.

:::callout{type=worked-example}
**Find the remainder when $2x^3 - 3x^2 + 4x - 5$ is divided by $x - 2$.**

$P(2) = 2(8) - 3(4) + 4(2) - 5 = 16 - 12 + 8 - 5 = 7$. The remainder is **7**.

**Find the remainder when $4x^3 - 2x^2 + 6x - 1$ is divided by $2x - 1$.**

Here $2x - 1 = 0$ gives $x = \tfrac12$:
$P\!\left(\tfrac12\right) = 4\left(\tfrac18\right) - 2\left(\tfrac14\right) + 6\left(\tfrac12\right) - 1 = \tfrac12 - \tfrac12 + 3 - 1 = 2$. The remainder is **2**.
:::

:::callout{type=common-mistake}
For a divisor $x + 3$, substitute $x = -3$, not $x = 3$: the value of $x$ that makes the divisor zero. For $2x - 1$, substitute $x = \tfrac12$, not $x = 1$ or $x = 2$.
:::

## The factor theorem

:::callout{type=definition}
**Factor theorem:** $x - a$ is a factor of $P(x)$ if and only if $P(a) = 0$; that is, if dividing by $x - a$ leaves no remainder. A value $a$ with $P(a) = 0$ is a **root** (or **zero**) of the polynomial.
:::

To factorise a cubic, try the factors of the constant term ($\pm1, \pm2, \pm3, \dots$) until one gives zero, then divide to find the quadratic factor.

:::callout{type=worked-example}
**Factorise $x^3 - 2x^2 - 5x + 6$ completely and solve $x^3 - 2x^2 - 5x + 6 = 0$.**

Try $x = 1$: $1 - 2 - 5 + 6 = 0$, so $x - 1$ is a factor.

Divide (or compare coefficients): $x^3 - 2x^2 - 5x + 6 = (x - 1)(x^2 - x - 6) = (x - 1)(x - 3)(x + 2)$.

So the roots are $x = 1$, $x = 3$ and $x = -2$.
:::

![Graph of y = x cubed minus 2x squared minus 5x plus 6, crossing the x-axis at x = −2, x = 1 and x = 3 and the y-axis at 6, showing that each root gives a factor of the cubic](https://wasscetutor.com/img/further-mathematics/cubic-roots-graph.svg)

*Figure 1. The roots of a cubic are where its graph crosses the x-axis. WASSCE Tutor diagram.*

## Finding unknown coefficients

Each fact you are given (a factor or a remainder) gives one equation. Two unknowns need two facts.

:::callout{type=worked-example}
**$P(x) = x^3 + px^2 + qx - 6$. $x - 1$ is a factor of $P(x)$, and the remainder when $P(x)$ is divided by $x - 2$ is 18. Find $p$ and $q$.**

$P(1) = 0$: $1 + p + q - 6 = 0$, so $p + q = 5$.

$P(2) = 18$: $8 + 4p + 2q - 6 = 18$, so $4p + 2q = 16$, that is $2p + q = 8$.

Subtracting: $p = 3$, then $q = 2$. So $P(x) = x^3 + 3x^2 + 2x - 6$. Check: $P(1) = 1 + 3 + 2 - 6 = 0$ ✓.
:::

## Sum and product of the roots of a quadratic

:::callout{type=definition}
**Sum and product of roots:** if $\alpha$ and $\beta$ are the roots of $ax^2 + bx + c = 0$, then $\alpha + \beta = -\dfrac{b}{a}$ and $\alpha\beta = \dfrac{c}{a}$.

**Symmetric function of the roots:** an expression in $\alpha$ and $\beta$ that is unchanged when they are swapped, such as $\alpha^2 + \beta^2$ or $\dfrac{1}{\alpha} + \dfrac{1}{\beta}$; it can always be written using $\alpha + \beta$ and $\alpha\beta$.
:::

The identities you need most:

| Expression | In terms of $\alpha + \beta$ and $\alpha\beta$ |
|---|---|
| $\alpha^2 + \beta^2$ | $(\alpha + \beta)^2 - 2\alpha\beta$ |
| $\dfrac{1}{\alpha} + \dfrac{1}{\beta}$ | $\dfrac{\alpha + \beta}{\alpha\beta}$ |
| $(\alpha - \beta)^2$ | $(\alpha + \beta)^2 - 4\alpha\beta$ |
| $\alpha^3 + \beta^3$ | $(\alpha + \beta)^3 - 3\alpha\beta(\alpha + \beta)$ |

An equation with roots $r$ and $s$ is $x^2 - (r + s)x + rs = 0$: "$x^2$ minus the sum plus the product".

:::callout{type=worked-example}
**$\alpha$ and $\beta$ are the roots of $2x^2 - 5x + 1 = 0$. Find $\alpha^2 + \beta^2$, and form the equation whose roots are $\dfrac{1}{\alpha}$ and $\dfrac{1}{\beta}$.**

$\alpha + \beta = \dfrac{5}{2}$, $\alpha\beta = \dfrac{1}{2}$.

$\alpha^2 + \beta^2 = \left(\dfrac52\right)^2 - 2\left(\dfrac12\right) = \dfrac{25}{4} - 1 = \dfrac{21}{4}$.

New roots: sum $= \dfrac{\alpha + \beta}{\alpha\beta} = \dfrac{5/2}{1/2} = 5$; product $= \dfrac{1}{\alpha\beta} = 2$.

The equation is $x^2 - 5x + 2 = 0$.
:::

## Roots of a cubic equation

If $\alpha$, $\beta$ and $\gamma$ are the roots of $ax^3 + bx^2 + cx + d = 0$, then:

$$\alpha + \beta + \gamma = -\frac{b}{a}, \qquad \alpha\beta + \beta\gamma + \gamma\alpha = \frac{c}{a}, \qquad \alpha\beta\gamma = -\frac{d}{a}$$

Check with $x^3 - 2x^2 - 5x + 6 = 0$, whose roots are $1$, $3$ and $-2$: the sum is $2 = -\tfrac{-2}{1}$; the pairs give $3 - 6 - 2 = -5 = \tfrac{-5}{1}$; the product is $-6 = -\tfrac{6}{1}$.

:::callout{type=tip}
The signs alternate: **minus**, **plus**, **minus**. Write the three results down before you start a question on cubic roots.
:::

:::callout{type=local-example}
A carpenter in Bo makes an open box from a $20$ cm by $20$ cm sheet of zinc by cutting a square of side $x$ cm from each corner. Its volume is $V = x(20 - 2x)^2 = 4x^3 - 80x^2 + 400x$, a cubic. Asked which cut gives a volume of 512 cm³, he solves $4x^3 - 80x^2 + 400x - 512 = 0$, that is $x^3 - 20x^2 + 100x - 128 = 0$. Trying $x = 2$: $8 - 80 + 200 - 128 = 0$, so $x = 2$ cm works, and the factor theorem gives the other answers from the quadratic factor $x^2 - 18x + 64 = 0$.
:::

## Practice

:::reveal{title="1. Find the remainder when x³ + 4x² − 3x + 2 is divided by x + 2."}
$P(-2) = -8 + 16 + 6 + 2 = 16$.
:::

:::reveal{title="2. Show that x − 2 is a factor of 3x³ − x² − 12x + 4, and factorise it completely."}
$P(2) = 24 - 4 - 24 + 4 = 0$, so $x - 2$ is a factor. Then $3x^3 - x^2 - 12x + 4 = (x - 2)(3x^2 + 5x - 2) = (x - 2)(x + 2)(3x - 1)$.
:::

:::reveal{title="3. Solve x³ − 7x − 6 = 0."}
$P(-1) = -1 + 7 - 6 = 0$, so $x + 1$ is a factor: $(x + 1)(x^2 - x - 6) = (x + 1)(x - 3)(x + 2) = 0$, giving $x = -1$, $3$ or $-2$.
:::

:::reveal{title="4. α and β are the roots of x² − 3x + 1 = 0. Form the equation whose roots are α² and β²."}
$\alpha + \beta = 3$, $\alpha\beta = 1$. Sum of new roots $= 3^2 - 2(1) = 7$; product $= 1^2 = 1$. The equation is $x^2 - 7x + 1 = 0$.
:::

:::reveal{title="5. Find the sum, the sum of the products in pairs, and the product of the roots of 2x³ + 3x² − 8x + 5 = 0."}
Sum $= -\tfrac32$; pairs $= \tfrac{-8}{2} = -4$; product $= -\tfrac52$.
:::

## Key points

- $P(x) = D(x)Q(x) + R(x)$, with the remainder of lower degree than the divisor.
- **Remainder theorem:** dividing by $x - a$ leaves $P(a)$; dividing by $ax - b$ leaves $P\!\left(\tfrac{b}{a}\right)$.
- **Factor theorem:** $x - a$ is a factor exactly when $P(a) = 0$.
- Factorise a cubic by finding one root from the factors of the constant, then the quadratic factor.
- Quadratic: $\alpha + \beta = -\tfrac{b}{a}$, $\alpha\beta = \tfrac{c}{a}$. Cubic: sum $-\tfrac{b}{a}$, pairs $\tfrac{c}{a}$, product $-\tfrac{d}{a}$.
- New equation: $x^2 - (\text{sum})x + \text{product} = 0$.

## WASSCE examination focus

:::callout{type=waec-tests}
WASSCE Further Mathematics regularly asks you to find a remainder, to show that an expression is a factor and factorise completely, to find two unknown coefficients from a factor and a remainder, and to form a new quadratic from the roots of a given one. Show the substitution in full, such as $P(2) = 16 - 12 + 8 - 5 = 7$; examiners give method marks for it. Keep fractions exact and do not round until the final answer.
:::
