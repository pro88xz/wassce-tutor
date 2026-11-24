:::callout{type=definition}
**Partial fractions** are the simpler fractions that add up to a given algebraic fraction. Resolving $\dfrac{7x - 1}{(x - 1)(2x + 1)}$ into partial fractions gives $\dfrac{2}{x - 1} + \dfrac{3}{2x + 1}$: the reverse of adding fractions.
:::

Adding fractions is easy; going backwards is the skill. Partial fractions turn one awkward rational function into simple pieces that can be integrated, expanded as series or summed term by term, so they come up again in integration and in sequences and series. This lesson explains **proper and improper fractions** and how to resolve fractions with **distinct linear factors**, **repeated linear factors** and **quadratic factors** in the denominator.

## Learning objectives

By the end of this lesson you should be able to:

- tell a proper rational function from an improper one
- write the correct form of the partial fractions for each type of denominator
- find the unknown numerators by substituting values and by equating coefficients
- use the cover-up method for distinct linear factors
- divide first when the fraction is improper
- check an answer by adding the partial fractions back together

## Rational functions

:::callout{type=definition}
**Rational function:** a fraction $\dfrac{P(x)}{Q(x)}$ in which the numerator and denominator are polynomials.

**Proper fraction:** a rational function whose numerator has a lower degree than its denominator, such as $\dfrac{5x + 4}{x^2 + x - 2}$.

**Improper fraction:** a rational function whose numerator has the same or a higher degree than its denominator, such as $\dfrac{x^2 + 2}{x^2 - x - 2}$; divide first to write it as a polynomial plus a proper fraction.
:::

## The three forms

Factorise the denominator first. Then each factor gives its own partial fractions:

| Factor in the denominator | Partial fractions it gives |
|---|---|
| a linear factor $(ax + b)$ | $\dfrac{A}{ax + b}$ |
| a repeated linear factor $(ax + b)^2$ | $\dfrac{A}{ax + b} + \dfrac{B}{(ax + b)^2}$ |
| a quadratic factor $ax^2 + bx + c$ that does not factorise | $\dfrac{Ax + B}{ax^2 + bx + c}$ |

:::callout{type=definition}
**Equating coefficients:** making two identical polynomials agree power by power ($x^2$ with $x^2$, $x$ with $x$, constants with constants) to find unknown constants.

**Cover-up method:** a quick way to find the numerator over a distinct linear factor: cover that factor in the original fraction and substitute the value of $x$ that makes it zero.
:::

## Distinct linear factors

:::callout{type=worked-example}
**Resolve $\dfrac{5x + 4}{(x - 1)(x + 2)}$ into partial fractions.**

Write $\dfrac{5x + 4}{(x - 1)(x + 2)} \equiv \dfrac{A}{x - 1} + \dfrac{B}{x + 2}$, so $5x + 4 \equiv A(x + 2) + B(x - 1)$.

- Put $x = 1$: $9 = 3A$, so $A = 3$.
- Put $x = -2$: $-6 = -3B$, so $B = 2$.

$$\frac{5x + 4}{(x - 1)(x + 2)} = \frac{3}{x - 1} + \frac{2}{x + 2}$$

**Check:** $\dfrac{3(x + 2) + 2(x - 1)}{(x - 1)(x + 2)} = \dfrac{5x + 4}{(x - 1)(x + 2)}$ ✓.
:::

The cover-up method gives the same numbers at once: cover $(x - 1)$ and put $x = 1$ in what is left: $\dfrac{5(1) + 4}{1 + 2} = 3$.

## Repeated linear factors

:::callout{type=worked-example}
**Resolve $\dfrac{3x - 5}{(x - 1)^2(x + 1)}$ into partial fractions.**

Write $\dfrac{3x - 5}{(x - 1)^2(x + 1)} \equiv \dfrac{A}{x - 1} + \dfrac{B}{(x - 1)^2} + \dfrac{C}{x + 1}$, so

$$3x - 5 \equiv A(x - 1)(x + 1) + B(x + 1) + C(x - 1)^2$$

- Put $x = 1$: $-2 = 2B$, so $B = -1$.
- Put $x = -1$: $-8 = 4C$, so $C = -2$.
- Equate coefficients of $x^2$: $0 = A + C$, so $A = 2$.

$$\frac{3x - 5}{(x - 1)^2(x + 1)} = \frac{2}{x - 1} - \frac{1}{(x - 1)^2} - \frac{2}{x + 1}$$
:::

:::callout{type=common-mistake}
A repeated factor $(x - 1)^2$ needs **two** fractions, over $(x - 1)$ and over $(x - 1)^2$. Writing only $\dfrac{B}{(x - 1)^2}$ leaves too few unknowns, and the equations will not balance.
:::

## Quadratic factors

:::callout{type=worked-example}
**Resolve $\dfrac{3x^2 + 1}{(x + 1)(x^2 + 1)}$ into partial fractions.**

$x^2 + 1$ does not factorise, so its numerator is $Bx + C$:

$$3x^2 + 1 \equiv A(x^2 + 1) + (Bx + C)(x + 1)$$

- Put $x = -1$: $4 = 2A$, so $A = 2$.
- $x^2$: $3 = A + B$, so $B = 1$.
- Constants: $1 = A + C$, so $C = -1$.

$$\frac{3x^2 + 1}{(x + 1)(x^2 + 1)} = \frac{2}{x + 1} + \frac{x - 1}{x^2 + 1}$$
:::

## Improper fractions: divide first

:::callout{type=worked-example}
**Express $\dfrac{x^2 + 2}{(x + 1)(x - 2)}$ in partial fractions.**

The numerator and denominator both have degree 2, so divide. The denominator is $x^2 - x - 2$, and $x^2 + 2 = (x^2 - x - 2) + (x + 4)$, so

$$\frac{x^2 + 2}{(x + 1)(x - 2)} = 1 + \frac{x + 4}{(x + 1)(x - 2)}$$

Cover-up: at $x = 2$, $\dfrac{6}{3} = 2$; at $x = -1$, $\dfrac{3}{-3} = -1$.

$$\frac{x^2 + 2}{(x + 1)(x - 2)} = 1 + \frac{2}{x - 2} - \frac{1}{x + 1}$$
:::

:::callout{type=tip}
Always check by substituting a convenient value, such as $x = 0$, into both sides. Here the left side is $\dfrac{2}{-2} = -1$ and the right side is $1 - 1 - 1 = -1$ ✓.
:::

:::callout{type=local-example}
Partial fractions make long sums collapse. In a Freetown school mathematics club, students added $\dfrac{1}{1 \times 2} + \dfrac{1}{2 \times 3} + \dots + \dfrac{1}{99 \times 100}$ in one line by writing each term as $\dfrac{1}{r(r + 1)} = \dfrac{1}{r} - \dfrac{1}{r + 1}$: every middle term cancels, leaving $1 - \dfrac{1}{100} = \dfrac{99}{100}$.
:::

## Practice

:::reveal{title="1. Resolve (7x − 1)/((x − 1)(2x + 1)) into partial fractions."}
$7x - 1 \equiv A(2x + 1) + B(x - 1)$. $x = 1$: $6 = 3A$, $A = 2$. $x = -\tfrac12$: $-\tfrac92 = -\tfrac32B$, $B = 3$. Answer: $\dfrac{2}{x - 1} + \dfrac{3}{2x + 1}$.
:::

:::reveal{title="2. Resolve (x + 5)/(x + 1)² into partial fractions."}
$x + 5 \equiv A(x + 1) + B$. $x = -1$: $B = 4$; $x$: $A = 1$. Answer: $\dfrac{1}{x + 1} + \dfrac{4}{(x + 1)^2}$.
:::

:::reveal{title="3. Resolve (2x² − x + 3)/((x − 1)(x² + 1)) into partial fractions."}
$x = 1$: $4 = 2A$, $A = 2$. $x^2$: $2 = A + B$, $B = 0$. Constants: $3 = A - C$, $C = -1$. Answer: $\dfrac{2}{x - 1} - \dfrac{1}{x^2 + 1}$.
:::

:::reveal{title="4. Resolve (x² + 1)/(x(x − 1)²) into partial fractions."}
$x^2 + 1 \equiv A(x - 1)^2 + Bx(x - 1) + Cx$. $x = 0$: $A = 1$. $x = 1$: $C = 2$. $x^2$: $1 = A + B$, $B = 0$. Answer: $\dfrac{1}{x} + \dfrac{2}{(x - 1)^2}$.
:::

:::reveal{title="5. Is (2x³ + 1)/(x² − 4) proper or improper? What must you do first?"}
Improper: the numerator has degree 3, higher than the denominator's 2. Divide first to get a polynomial plus a proper fraction, then resolve the proper fraction.
:::

## Key points

- Factorise the denominator; divide first if the fraction is **improper**.
- Linear factor: $\dfrac{A}{ax + b}$. Repeated factor: $\dfrac{A}{ax + b} + \dfrac{B}{(ax + b)^2}$. Quadratic factor: $\dfrac{Ax + B}{ax^2 + bx + c}$.
- Find the constants by substituting the roots of the factors, then by equating coefficients for any that remain.
- The cover-up method gives the numerators over distinct linear factors directly.
- Check by recombining the fractions or by substituting a value of $x$.

## WASSCE examination focus

:::callout{type=waec-tests}
WASSCE Further Mathematics asks you to resolve a fraction into partial fractions, often one with a repeated or quadratic factor, sometimes as the first step of an integration. Show the identity, such as $3x - 5 \equiv A(x - 1)(x + 1) + B(x + 1) + C(x - 1)^2$, and each substitution; examiners give method marks for these. If the fraction is improper, say so and divide first.
:::
