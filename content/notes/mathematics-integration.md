**Integration** is differentiation run backwards. Differentiation takes a quantity and finds its rate of change; integration takes a rate of change and recovers the quantity. If you know how fast water flows into a tank each minute, integration gives how much is in the tank. If you know a curve's gradient, integration gives the curve. And integration finds **areas** under curves, which no formula from geometry can do. This lesson teaches the rule for integrating powers of $x$, the constant of integration, definite integrals and areas.

## Learning objectives

By the end of this lesson you should be able to:

- explain integration as the reverse of differentiation
- integrate $ax^n$ and sums of such terms, including negative powers
- find the constant of integration from a given point
- evaluate definite integrals
- find the area between a curve and the $x$-axis
- use integration for distance and accumulated quantities

## Reversing differentiation

Differentiating $x^3$ gives $3x^2$. So integrating $3x^2$ gives back $x^3$. But $x^3 + 5$ and $x^3 - 2$ also differentiate to $3x^2$, because constants disappear. So the answer must include an unknown constant $c$:

$$\int 3x^2 \, dx = x^3 + c$$

The sign $\int$ means "integrate", $dx$ shows the variable, and $c$ is the **constant of integration**.

## The power rule for integration

:::callout{type=definition}
$$\int ax^n \, dx = \frac{ax^{n+1}}{n + 1} + c \qquad (n \ne -1)$$

**Raise the power by one, then divide by the new power.** Integrate a sum term by term. A constant $k$ integrates to $kx$.
:::

:::callout{type=tip}
**Check by differentiating.** Differentiate your answer: you should get back exactly what you integrated. This takes ten seconds and catches most errors.
:::

:::callout{type=worked-example}
**Integrate (a) $6x^2 - 4x + 5$, (b) $\dfrac{3}{x^2}$, (c) $(x + 2)(x - 1)$.**

**(a)** $\displaystyle\int (6x^2 - 4x + 5)\,dx = \frac{6x^3}{3} - \frac{4x^2}{2} + 5x + c = 2x^3 - 2x^2 + 5x + c$

**(b)** Write as $3x^{-2}$: $\displaystyle\int 3x^{-2}\,dx = \frac{3x^{-1}}{-1} + c = -\frac{3}{x} + c$

**(c)** Expand first: $x^2 + x - 2$. $\displaystyle\int (x^2 + x - 2)\,dx = \frac{x^3}{3} + \frac{x^2}{2} - 2x + c$
:::

:::callout{type=common-mistake}
**Forgetting $+ c$**, or multiplying by the new power instead of dividing. Integrating $x^3$ gives $\dfrac{x^4}{4}$, not $4x^4$. Differentiation multiplies by the power; integration **divides**.
:::

## Finding the constant

If you know one point on the curve, substitute it to find $c$.

:::callout{type=worked-example}
**The gradient of a curve is $\dfrac{dy}{dx} = 4x - 3$, and the curve passes through $(1, 5)$. Find its equation.**

$$y = \int (4x - 3)\,dx = 2x^2 - 3x + c$$

At $(1, 5)$: $5 = 2 - 3 + c \Rightarrow c = 6$.

$$y = 2x^2 - 3x + 6$$
:::

## Definite integrals

A **definite integral** has limits: it gives a **number**, not a function.

:::callout{type=definition}
$$\int_a^b f(x)\,dx = \Big[F(x)\Big]_a^b = F(b) - F(a)$$

where $F$ is the integral of $f$. The constant $c$ cancels, so leave it out.
:::

:::callout{type=worked-example}
**Evaluate $\displaystyle\int_1^3 (2x + 1)\,dx$.**

$$\Big[x^2 + x\Big]_1^3 = (9 + 3) - (1 + 1) = 12 - 2 = 10$$
:::

:::callout{type=common-mistake}
**Subtracting the wrong way round.** It is always **top limit minus bottom limit**: $F(b) - F(a)$. Put brackets round each substitution so that minus signs are not lost.
:::

## Area under a curve

![The curve y = 4x − x² from x = 0 to x = 4, with the region between the curve and the x-axis shaded; its area is 32/3 ≈ 10.7 square units](https://wasscetutor.com/img/mathematics/area-under-curve.svg)

:::callout{type=definition}
The area between the curve $y = f(x)$, the $x$-axis and the lines $x = a$ and $x = b$ is

$$\text{Area} = \int_a^b y\,dx$$

when the curve is **above** the axis. If it is **below**, the integral is negative: take its size (the absolute value) as the area.
:::

:::callout{type=worked-example}
**Find the area enclosed by $y = 4x - x^2$ and the $x$-axis.**

**Find where the curve meets the axis:** $4x - x^2 = x(4 - x) = 0$, so $x = 0$ and $x = 4$.

$$\text{Area} = \int_0^4 (4x - x^2)\,dx = \Big[2x^2 - \frac{x^3}{3}\Big]_0^4 = \left(32 - \frac{64}{3}\right) - 0 = \frac{32}{3}$$

**Area $= 10\tfrac23 \approx 10.7$ square units.**
:::

:::callout{type=worked-example}
**Find the area between $y = x^2 - 4$ and the $x$-axis from $x = 0$ to $x = 2$.**

$$\int_0^2 (x^2 - 4)\,dx = \Big[\frac{x^3}{3} - 4x\Big]_0^2 = \frac83 - 8 = -\frac{16}{3}$$

The negative sign shows the region is **below** the axis. **Area $= \tfrac{16}{3} = 5\tfrac13$ square units.**
:::

## Distance and accumulated quantities

Integration adds up a rate over time. If $v$ is velocity, $\displaystyle\int v\,dt$ is the **distance** travelled.

:::callout{type=worked-example}
**A particle moves with velocity $v = 3t^2 + 2$ m/s. Find the distance travelled in the first 2 seconds.**

$$\int_0^2 (3t^2 + 2)\,dt = \Big[t^3 + 2t\Big]_0^2 = 8 + 4 = 12 \text{ m}$$
:::

:::callout{type=local-example}
**Filling a water tank in Bo.** Water flows into a compound's storage tank at a rate of $40 - 2t$ litres per minute, falling as the pressure drops, where $t$ is the time in minutes. How much water enters in the first 10 minutes?

$$\int_0^{10} (40 - 2t)\,dt = \Big[40t - t^2\Big]_0^{10} = 400 - 100 = 300 \text{ litres}$$

The rate changes every second, so "rate × time" does not work; integration adds up every moment's flow.
:::

## Practice

:::reveal{title="1. Integrate 8x³ − 6x + 1."}
$2x^4 - 3x^2 + x + c$.
:::

:::reveal{title="2. Integrate 4/x³."}
$\displaystyle\int 4x^{-3}\,dx = \frac{4x^{-2}}{-2} + c = -\frac{2}{x^2} + c$.
:::

:::reveal{title="3. A curve has gradient 6x² and passes through (1, 4). Find its equation."}
$y = 2x^3 + c$; $4 = 2 + c \Rightarrow c = 2$. $y = 2x^3 + 2$.
:::

:::reveal{title="4. Evaluate the integral of (3x² − 2x) from x = 1 to x = 2."}
$\Big[x^3 - x^2\Big]_1^2 = (8 - 4) - (1 - 1) = 4$.
:::

:::reveal{title="5. Find the area between y = 6x − x² and the x-axis."}
Roots $x = 0$ and $x = 6$. $\Big[3x^2 - \dfrac{x^3}{3}\Big]_0^6 = 108 - 72 = 36$ square units.
:::

## Key terms

:::callout{type=definition title="Key terms"}
- **Integration**: the reverse of differentiation: finding a function from its gradient function.
- **Indefinite integral**: an integral without limits; its answer includes a constant of integration, $+\,c$.
- **Constant of integration**: the constant $c$ added to an indefinite integral, because the derivative of any constant is zero.
- **Definite integral**: an integral between two limits, worked out as the value at the upper limit minus the value at the lower limit.
- **Limits of integration**: the two values of $x$ between which a definite integral is taken.
- **Area under a curve**: the area between a curve and the $x$-axis, found by a definite integral; a negative result means the region is below the axis.
:::

## Key points

- Integration **reverses** differentiation; always add **$+ c$** for an indefinite integral.
- **Power rule**: $ax^n \to \dfrac{ax^{n+1}}{n + 1}$ ($n \ne -1$); **check by differentiating**.
- **Expand** products and write fractions as powers before integrating.
- A known **point** on the curve gives the value of $c$.
- **Definite integral**: $F(b) - F(a)$, top minus bottom.
- **Area** $= \displaystyle\int_a^b y\,dx$; find the limits where the curve meets the axis; a negative result means the region is below the axis.

## WASSCE examination focus

:::callout{type=waec-tests}
Integration questions test integrating polynomials (sometimes with negative powers), finding a curve from its gradient and a point, evaluating definite integrals, and finding the area under a curve, often after finding where the curve cuts the $x$-axis. Show the integrated expression in square brackets with the limits, then the substitution, for full method marks.
:::
