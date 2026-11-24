An algebraic fraction is a fraction with letters in it: $\dfrac{x + 2}{x - 3}$. Everything you know about number fractions still applies (simplifying, adding, multiplying, dividing), but with one powerful extra tool: **factorisation**. WASSCE tests algebraic fractions in objective questions (*"Simplify…"*), in theory questions, and in equations with fractions. This lesson works through every operation, the values for which a fraction is undefined, and solving equations that contain algebraic fractions.

## Learning objectives

By the end of this lesson you should be able to:

- simplify algebraic fractions by factorising and cancelling common factors
- add and subtract algebraic fractions using the LCM of the denominators
- multiply and divide algebraic fractions
- find the values for which an algebraic fraction is undefined
- solve equations that contain algebraic fractions

## Simplifying: factorise, then cancel

:::callout{type=definition}
You may cancel only **common factors** (things that **multiply** the whole top and the whole bottom), never terms that are **added**.
:::

:::callout{type=worked-example}
**1.** $\dfrac{6x^2y}{9xy^2} = \dfrac{2x}{3y}$ (cancel $3$, $x$ and $y$)

**2.** $\dfrac{x^2 - 9}{x^2 + 5x + 6} = \dfrac{(x + 3)(x - 3)}{(x + 3)(x + 2)} = \dfrac{x - 3}{x + 2}$

**3.** $\dfrac{4a - 8}{a^2 - 2a} = \dfrac{4(a - 2)}{a(a - 2)} = \dfrac{4}{a}$
:::

:::callout{type=common-mistake}
**Cancelling terms instead of factors.** $\dfrac{x + 6}{x + 3}$ does **not** simplify to $\dfrac{6}{3} = 2$, and it does not simplify to $2$ by cancelling the $x$'s. The $x$'s are **added**, not multiplied, so nothing cancels. Test with $x = 1$: $\dfrac{7}{4} \ne 2$.
:::

## Undefined values

A fraction is **undefined** when its **denominator is zero** (you cannot divide by zero).

:::callout{type=worked-example}
**For what values of $x$ is $\dfrac{x + 1}{x^2 - 5x + 6}$ undefined?**

$$x^2 - 5x + 6 = 0 \;\Rightarrow\; (x - 2)(x - 3) = 0 \;\Rightarrow\; x = 2 \text{ or } x = 3$$
:::

## Adding and subtracting

Use the **LCM of the denominators**, exactly as with number fractions.

:::callout{type=worked-example}
**1. Simplify $\dfrac{2}{x} + \dfrac{3}{2x}$.** The LCM is $2x$:

$$\frac{4}{2x} + \frac{3}{2x} = \frac{7}{2x}$$

**2. Simplify $\dfrac{3}{x + 2} - \dfrac{2}{x - 1}$.** The LCM is $(x + 2)(x - 1)$:

$$\frac{3(x - 1) - 2(x + 2)}{(x + 2)(x - 1)} = \frac{3x - 3 - 2x - 4}{(x + 2)(x - 1)} = \frac{x - 7}{(x + 2)(x - 1)}$$

**3. Simplify $\dfrac{1}{x - 3} + \dfrac{6}{x^2 - 9}$.** Factorise first: $x^2 - 9 = (x + 3)(x - 3)$, so the LCM is $(x + 3)(x - 3)$:

$$\frac{(x + 3) + 6}{(x + 3)(x - 3)} = \frac{x + 9}{(x + 3)(x - 3)}$$
:::

:::callout{type=tip}
**Factorise every denominator first.** It shows you the true LCM and often avoids huge expressions. In example 3, multiplying the denominators without factorising would give a far more complicated answer that still needed simplifying.
:::

:::callout{type=common-mistake}
**The minus sign before a fraction.** In example 2, $-2(x + 2) = -2x - 4$. Writing $-2x + 4$ is the commonest error in subtracting algebraic fractions. Put the numerator in **brackets** before expanding.
:::

## Multiplying and dividing

**Multiply:** factorise everything, cancel common factors, then multiply.

**Divide:** turn the second fraction **upside down** and multiply.

:::callout{type=worked-example}
**1.** $\dfrac{x^2 - 4}{3x} \times \dfrac{6x^2}{x + 2} = \dfrac{(x + 2)(x - 2)}{3x} \times \dfrac{6x^2}{x + 2} = 2x(x - 2)$

**2.** $\dfrac{a^2 - a}{b} \div \dfrac{a - 1}{b^2} = \dfrac{a(a - 1)}{b} \times \dfrac{b^2}{a - 1} = ab$
:::

## Equations with algebraic fractions

Multiply **every term** by the LCM of the denominators; this clears all the fractions at once.

:::callout{type=worked-example}
**Solve $\dfrac{3}{x} - \dfrac{2}{x + 1} = \dfrac{1}{2}$.**

Multiply every term by $2x(x + 1)$:

$$6(x + 1) - 4x = x(x + 1)$$
$$6x + 6 - 4x = x^2 + x \;\Rightarrow\; 2x + 6 = x^2 + x \;\Rightarrow\; x^2 - x - 6 = 0$$
$$(x - 3)(x + 2) = 0 \;\Rightarrow\; x = 3 \text{ or } x = -2$$

**Check:** neither value makes a denominator zero, so both are valid. For $x = 3$: $1 - \tfrac12 = \tfrac12$ ✓
:::

:::callout{type=tip}
**Always check your solutions** against the undefined values. If a solution makes a denominator zero, it must be **rejected**.
:::

:::callout{type=local-example}
Fractions with unknowns appear in work and travel problems. A lorry travels about 180 km from Freetown to Makeni at $v$ km/h and returns at $(v + 20)$ km/h. The total time is $\dfrac{180}{v} + \dfrac{180}{v + 20}$ hours; adding these fractions gives a single expression, and setting it equal to the actual journey time gives an equation for $v$.
:::

## Practice

:::reveal{title="1. Simplify: (x² + 3x) / (x² − 9)"}
$$\frac{x(x + 3)}{(x + 3)(x - 3)} = \frac{x}{x - 3}$$
:::

:::reveal{title="2. Simplify: 2/(x + 1) + 3/(x − 2)"}
$$\frac{2(x - 2) + 3(x + 1)}{(x + 1)(x - 2)} = \frac{5x - 1}{(x + 1)(x - 2)}$$
:::

:::reveal{title="3. Simplify: (x² − x − 6)/(2x) × 4x²/(x − 3)"}
$$\frac{(x - 3)(x + 2)}{2x} \times \frac{4x^2}{x - 3} = 2x(x + 2)$$
:::

:::reveal{title="4. For what value of x is (2x + 1)/(3x − 6) undefined?"}
$3x - 6 = 0 \Rightarrow$ **$x = 2$**.
:::

:::reveal{title="5. Solve: x/(x − 2) = 3"}
$x = 3(x - 2) \Rightarrow x = 3x - 6 \Rightarrow 2x = 6 \Rightarrow$ **$x = 3$** (valid: $3 - 2 \ne 0$).
:::

:::reveal{title="6. Simplify: 1/(x − 1) − 1/(x + 1)"}
$$\frac{(x + 1) - (x - 1)}{(x - 1)(x + 1)} = \frac{2}{x^2 - 1}$$
:::

## Key terms

:::callout{type=definition title="Key terms"}
- **Algebraic fraction**: a fraction with letters in its numerator, its denominator or both.
- **Lowest common denominator**: the simplest expression that every denominator divides into, used to add or subtract algebraic fractions.
- **Undefined**: having no value: an algebraic fraction is undefined when its denominator is zero.
- **Cancelling**: dividing the numerator and denominator by a common factor; terms that are added must never be cancelled.
- **Dividing by a fraction**: multiplying by the fraction turned upside down.
- **Rejected solution**: a solution that makes a denominator zero, which must be rejected.
:::

## Key points

- **Factorise** first; cancel only **common factors**, never added terms.
- A fraction is **undefined** when its denominator is **zero**.
- Add and subtract using the **LCM** of the (factorised) denominators; put numerators in **brackets**.
- Multiply: factorise and cancel. Divide: **invert** the second fraction and multiply.
- In equations, multiply every term by the LCM, solve, and **reject** any solution that makes a denominator zero.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect objective questions asking you to simplify, combine or find undefined values, and theory questions that combine fractions or solve an equation with fractions (often leading to a quadratic). Sign errors when subtracting, and cancelling terms that are not factors, are the most common mistakes.
:::
