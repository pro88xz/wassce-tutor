A quadratic equation has the unknown **squared**: $x^2 - 5x + 6 = 0$. Unlike a linear equation, it usually has **two** solutions (here $x = 2$ and $x = 3$). Quadratics model areas, falling objects, profits and much more, and they are among the most heavily tested topics in WASSCE Mathematics, in both papers, every year. This lesson teaches the three methods of solving them, how to choose between them, how to form a quadratic from its roots, and how to solve word problems.

## Learning objectives

By the end of this lesson you should be able to:

- solve quadratic equations by factorisation
- solve quadratic equations by completing the square
- solve quadratic equations using the formula, and use the discriminant
- form a quadratic equation from given roots, using the sum and product of roots
- set up and solve quadratic equations from word problems

## The standard form

:::callout{type=definition}
A **quadratic equation** can be written as

$$ax^2 + bx + c = 0, \qquad a \neq 0.$$

Its solutions are called its **roots**. Always rearrange into this form (everything on one side, zero on the other) **before** solving.
:::

## Method 1: factorisation

If two things multiply to give zero, at least one of them **is** zero.

:::callout{type=worked-example}
**Solve $x^2 - 5x + 6 = 0$.**

Factorise: $(x - 2)(x - 3) = 0$

So $x - 2 = 0$ or $x - 3 = 0$: **$x = 2$ or $x = 3$.**

**Solve $2x^2 + 5x = 3$.**

Rearrange: $2x^2 + 5x - 3 = 0$. Factorise ($ac = -6$; $6$ and $-1$): $(2x - 1)(x + 3) = 0$.

**$x = \tfrac12$ or $x = -3$.**

**Solve $x^2 = 7x$.**

$x^2 - 7x = 0 \Rightarrow x(x - 7) = 0$: **$x = 0$ or $x = 7$.**
:::

:::callout{type=common-mistake}
**Dividing by $x$.** From $x^2 = 7x$, dividing both sides by $x$ gives only $x = 7$ and **loses** the root $x = 0$. Never divide by an expression that could be zero; factorise instead.
:::

## Method 2: completing the square

Rewrite the quadratic as $(x + p)^2 = q$, then take square roots. The key fact:

$$x^2 + bx = \left(x + \frac{b}{2}\right)^2 - \left(\frac{b}{2}\right)^2$$

:::callout{type=worked-example}
**Solve $x^2 + 6x - 7 = 0$ by completing the square.**

1. Move the constant: $x^2 + 6x = 7$
2. Add $\left(\tfrac{6}{2}\right)^2 = 9$ to both sides: $x^2 + 6x + 9 = 16$
3. Write as a square: $(x + 3)^2 = 16$
4. Square root: $x + 3 = \pm 4$
5. **$x = 1$ or $x = -7$.**

**Solve $2x^2 - 8x + 3 = 0$, giving answers to 2 decimal places.**

1. Divide by 2: $x^2 - 4x + \tfrac32 = 0$
2. $x^2 - 4x = -\tfrac32$
3. Add $4$: $(x - 2)^2 = \tfrac52$
4. $x - 2 = \pm\sqrt{2.5} = \pm 1.581\ldots$
5. **$x \approx 3.58$ or $x \approx 0.42$.**
:::

## Method 3: the quadratic formula

For $ax^2 + bx + c = 0$:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

:::callout{type=worked-example}
**Solve $3x^2 - 5x - 1 = 0$, correct to 2 decimal places.**

$a = 3$, $b = -5$, $c = -1$.

$$x = \frac{-(-5) \pm \sqrt{(-5)^2 - 4(3)(-1)}}{2(3)} = \frac{5 \pm \sqrt{25 + 12}}{6} = \frac{5 \pm \sqrt{37}}{6}$$

$\sqrt{37} \approx 6.083$, so $x \approx \dfrac{11.083}{6} \approx 1.85$ or $x \approx \dfrac{-1.083}{6} \approx -0.18$.
:::

:::callout{type=tip}
**Write down $a$, $b$ and $c$ with their signs before substituting.** Most formula errors come from $-b$ when $b$ is already negative: here $-b = -(-5) = +5$.
:::

### The discriminant

The expression $b^2 - 4ac$ tells you **how many** real roots there are:

| $b^2 - 4ac$ | Roots |
|---|---|
| positive | two different real roots |
| zero | two **equal** roots (one repeated root) |
| negative | **no** real roots |

:::callout{type=worked-example}
**Find $k$ if $x^2 + kx + 9 = 0$ has equal roots.**

Equal roots: $b^2 - 4ac = 0 \Rightarrow k^2 - 36 = 0 \Rightarrow$ **$k = \pm 6$.**
:::

## Choosing a method

| If… | use |
|---|---|
| it factorises easily (try for 30 seconds) | **factorisation** (fastest) |
| the question says "complete the square" | **completing the square** |
| it does not factorise, or answers are needed to decimal places | **the formula** |

## Forming an equation from its roots

If the roots are $\alpha$ and $\beta$, the equation is

$$x^2 - (\alpha + \beta)x + \alpha\beta = 0$$

that is, $x^2 - (\text{sum of roots})x + (\text{product of roots}) = 0$.

:::callout{type=worked-example}
**Find the quadratic equation whose roots are $3$ and $-\tfrac12$.**

Sum $= 3 - \tfrac12 = \tfrac52$. Product $= 3 \times (-\tfrac12) = -\tfrac32$.

$$x^2 - \tfrac52 x - \tfrac32 = 0 \quad\Rightarrow\quad 2x^2 - 5x - 3 = 0$$

(multiplying by 2 to clear fractions).
:::

## Word problems

:::callout{type=worked-example}
**A rectangular plot of land is 5 m longer than it is wide. Its area is 84 m². Find its dimensions.**

Let the width be $x$ m; the length is $x + 5$ m.

$$x(x + 5) = 84 \;\Rightarrow\; x^2 + 5x - 84 = 0 \;\Rightarrow\; (x + 12)(x - 7) = 0$$

$x = 7$ or $x = -12$. A width cannot be negative, so **the plot is 7 m wide and 12 m long.**
:::

:::callout{type=local-example}
**A trader in Kenema buys some bags of rice for NLe 3 600 in total. If each bag had cost NLe 100 less, she could have bought 3 more bags for the same money. How many bags did she buy?**

Let her buy $n$ bags at $\dfrac{3600}{n}$ each. With $n + 3$ bags at NLe 100 less:

$$\left(\frac{3600}{n} - 100\right)(n + 3) = 3600$$

Expanding: $3600 + \dfrac{10\,800}{n} - 100n - 300 = 3600$, so $\dfrac{10\,800}{n} - 100n - 300 = 0$.

Multiply by $n$ and divide by 100: $108 - n^2 - 3n = 0$, so $n^2 + 3n - 108 = 0$.

$(n + 12)(n - 9) = 0$, so **$n = 9$ bags** (at NLe 400 each). Check: 12 bags at NLe 300 also cost NLe 3 600 ✓
:::

## Practice

:::reveal{title="1. Solve: x² − x − 12 = 0"}
$(x - 4)(x + 3) = 0$: **$x = 4$ or $x = -3$.**
:::

:::reveal{title="2. Solve: 6x² − x − 2 = 0"}
$ac = -12$; numbers $-4$ and $3$: $6x^2 - 4x + 3x - 2 = 2x(3x - 2) + 1(3x - 2) = (3x - 2)(2x + 1)$.

**$x = \tfrac23$ or $x = -\tfrac12$.**
:::

:::reveal{title="3. Solve by completing the square: x² − 4x − 5 = 0"}
$x^2 - 4x = 5 \Rightarrow (x - 2)^2 = 9 \Rightarrow x - 2 = \pm 3$: **$x = 5$ or $x = -1$.**
:::

:::reveal{title="4. Solve x² + 3x − 1 = 0, correct to 2 decimal places."}
$$x = \frac{-3 \pm \sqrt{9 + 4}}{2} = \frac{-3 \pm \sqrt{13}}{2}$$

$\sqrt{13} \approx 3.606$: **$x \approx 0.30$ or $x \approx -3.30$.**
:::

:::reveal{title="5. Form the equation whose roots are −2 and 5."}
Sum $= 3$, product $= -10$: **$x^2 - 3x - 10 = 0$.**
:::

:::reveal{title="6. Does 2x² + 3x + 4 = 0 have real roots?"}
$b^2 - 4ac = 9 - 32 = -23 < 0$: **no real roots.**
:::

## Key terms

:::callout{type=definition title="Key terms"}
- **Quadratic equation**: an equation of the form $ax^2 + bx + c = 0$, where $a \ne 0$.
- **Completing the square**: rewriting a quadratic so that it contains a perfect square, by adding $\left(\tfrac{b}{2}\right)^2$ to both sides.
- **Quadratic formula**: the formula $x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$, which solves any quadratic equation.
- **Discriminant**: the expression $b^2 - 4ac$, which shows how many real roots a quadratic has.
- **Roots of an equation**: the values of the unknown that make the equation true.
- **Factorisation method**: solving a quadratic by writing it as two brackets whose product is zero, so that one bracket must be zero.
- **No real roots**: the case when the discriminant is negative and the graph does not cross the $x$-axis.
:::

## Key points

- Rearrange to $ax^2 + bx + c = 0$ first.
- **Factorisation**: if $(x - p)(x - q) = 0$ then $x = p$ or $x = q$. Never divide by $x$.
- **Completing the square**: add $\left(\tfrac{b}{2}\right)^2$ to both sides (after making $a = 1$).
- **Formula**: $x = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$; the **discriminant** $b^2 - 4ac$ gives the number of roots.
- From roots: $x^2 - (\text{sum})x + \text{product} = 0$. In word problems, **reject** impossible roots.

## WASSCE examination focus

:::callout{type=waec-tests}
Quadratic equations appear in every paper: objective questions on factorising, roots, the discriminant and forming equations; theory questions that ask you to solve by a stated method or to set up a quadratic from a word problem (areas, ages, prices, numbers). Examiners give method marks for the correct equation and the correct substitution into the formula, so write them out in full.
:::
