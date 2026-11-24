**Differentiation** finds how fast one quantity changes compared with another: the speed of a moving car (distance changing with time), the steepness of a curve at a point, the size of a field that gives the **greatest** area for a fixed length of fencing. For a straight line the gradient is the same everywhere; for a curve it changes from point to point, and differentiation finds it exactly. This lesson explains the idea, gives the rule for differentiating powers of $x$, and uses it for gradients, tangents, maximum and minimum points, and rates of change.

## Learning objectives

By the end of this lesson you should be able to:

- explain the derivative as the gradient of a curve
- differentiate from first principles for simple functions
- differentiate $ax^n$ and sums of such terms, including negative and fractional powers
- find the gradient and the equation of the tangent at a point
- find stationary points and decide whether each is a maximum or a minimum
- solve problems on rates of change, maxima and minima

## The gradient of a curve

![The curve y = x² with its tangent at (2, 4); the tangent has gradient 4, shown by a rise of 4 for a run of 1, matching dy/dx = 2x at x = 2](https://wasscetutor.com/img/mathematics/tangent-gradient.svg)

The gradient of a curve at a point is the **gradient of the tangent** there: the straight line that just touches the curve at that point. On $y = x^2$, the tangent at $(2, 4)$ rises 4 for every 1 across, so the gradient there is 4. At $(3, 9)$ the curve is steeper, and the gradient is 6.

:::callout{type=definition}
The **derivative** $\dfrac{dy}{dx}$ (said "dee y by dee x") is a formula for the gradient at **any** point. For $y = x^2$, $\dfrac{dy}{dx} = 2x$. It is also written $f'(x)$ when $y = f(x)$.
:::

## First principles

Take two points close together: $x$ and $x + h$. The gradient of the chord between them is

$$\frac{f(x + h) - f(x)}{h}$$

As $h$ gets smaller and smaller, the chord becomes the tangent.

:::callout{type=worked-example}
**Differentiate $y = x^2$ from first principles.**

$$\frac{(x + h)^2 - x^2}{h} = \frac{x^2 + 2xh + h^2 - x^2}{h} = \frac{2xh + h^2}{h} = 2x + h$$

As $h \to 0$, this becomes $2x$. So $\dfrac{dy}{dx} = 2x$.
:::

## The power rule

:::callout{type=definition}
$$\text{If } y = ax^n, \text{ then } \frac{dy}{dx} = nax^{n-1}$$

**Multiply by the power, then reduce the power by one.**

- The derivative of a **constant** is $0$ (a horizontal line has zero gradient).
- Differentiate a **sum** term by term.
:::

| $y$ | $\dfrac{dy}{dx}$ |
|---|---|
| $x^3$ | $3x^2$ |
| $5x^4$ | $20x^3$ |
| $7x$ | $7$ |
| $9$ | $0$ |
| $\dfrac{1}{x^2} = x^{-2}$ | $-2x^{-3} = -\dfrac{2}{x^3}$ |
| $\sqrt{x} = x^{1/2}$ | $\tfrac12 x^{-1/2} = \dfrac{1}{2\sqrt{x}}$ |

:::callout{type=worked-example}
**Differentiate (a) $y = 4x^3 - 5x^2 + 2x - 7$, (b) $y = (2x + 1)(x - 3)$, (c) $y = \dfrac{3}{x} + x^2$.**

**(a)** $\dfrac{dy}{dx} = 12x^2 - 10x + 2$

**(b)** Expand first: $y = 2x^2 - 5x - 3$, so $\dfrac{dy}{dx} = 4x - 5$.

**(c)** Write $\dfrac{3}{x} = 3x^{-1}$: $\dfrac{dy}{dx} = -3x^{-2} + 2x = -\dfrac{3}{x^2} + 2x$.
:::

:::callout{type=common-mistake}
**Differentiating a product or a fraction term by term.** $(2x + 1)(x - 3)$ does **not** differentiate to $2 \times 1$. Expand brackets and rewrite fractions as powers of $x$ **before** you differentiate.
:::

## Gradients and tangents

:::callout{type=worked-example}
**Find the gradient of $y = x^3 - 4x$ at the point where $x = 2$.**

$\dfrac{dy}{dx} = 3x^2 - 4$. At $x = 2$: $3(4) - 4 = 8$.
:::

:::callout{type=worked-example}
**Find the equation of the tangent to $y = x^2$ at $(2, 4)$.**

Gradient $= 2x = 4$. Using $y - y_1 = m(x - x_1)$:

$$y - 4 = 4(x - 2) \;\Rightarrow\; y = 4x - 4$$

The **normal** (perpendicular to the tangent) has gradient $-\tfrac14$.
:::

## Stationary points: maximum and minimum

At the top of a hill or the bottom of a valley on a curve, the tangent is **horizontal**: the gradient is zero. These are **stationary points**.

:::callout{type=definition}
1. Solve $\dfrac{dy}{dx} = 0$ to find the $x$-values.
2. Substitute into $y$ to find the points.
3. Find the **second derivative** $\dfrac{d^2y}{dx^2}$ (differentiate again):
   - $\dfrac{d^2y}{dx^2} > 0$: a **minimum** (the curve bends up, like a valley)
   - $\dfrac{d^2y}{dx^2} < 0$: a **maximum** (the curve bends down, like a hill)
:::

:::callout{type=worked-example}
**Find the stationary points of $y = x^3 - 3x^2 - 9x + 5$ and their nature.**

$$\frac{dy}{dx} = 3x^2 - 6x - 9 = 3(x^2 - 2x - 3) = 3(x - 3)(x + 1) = 0$$

So $x = 3$ or $x = -1$.

- $x = 3$: $y = 27 - 27 - 27 + 5 = -22$
- $x = -1$: $y = -1 - 3 + 9 + 5 = 10$

$\dfrac{d^2y}{dx^2} = 6x - 6$. At $x = 3$: $12 > 0$, so **$(3, -22)$ is a minimum**. At $x = -1$: $-12 < 0$, so **$(-1, 10)$ is a maximum**.
:::

## Rates of change

If $s$ is distance and $t$ is time, $\dfrac{ds}{dt}$ is the **velocity** and $\dfrac{dv}{dt}$ is the **acceleration**.

:::callout{type=worked-example}
**A ball is thrown upwards. Its height after $t$ seconds is $h = 20t - 5t^2$ metres. Find (a) its velocity after 1 second, (b) the greatest height.**

$\dfrac{dh}{dt} = 20 - 10t$.

**(a)** At $t = 1$: $20 - 10 = 10$ m/s (still rising).

**(b)** At the top the velocity is zero: $20 - 10t = 0 \Rightarrow t = 2$. Height $= 20(2) - 5(4) = $ **20 m**.
:::

:::callout{type=local-example}
**A goat pen in Kailahun.** A farmer has 100 m of fencing to make a rectangular pen against a long wall, so only three sides need fencing. If each side touching the wall is $x$ m long, the side parallel to the wall is $100 - 2x$ m, and

$$A = x(100 - 2x) = 100x - 2x^2 \qquad \frac{dA}{dx} = 100 - 4x = 0 \;\Rightarrow\; x = 25$$

$\dfrac{d^2A}{dx^2} = -4 < 0$, so this is a maximum: a pen **25 m by 50 m**, area **1250 m²**. Any other shape with the same fencing encloses less.
:::

## Practice

:::reveal{title="1. Differentiate y = 6x⁵ − 3x² + 8."}
$\dfrac{dy}{dx} = 30x^4 - 6x$.
:::

:::reveal{title="2. Differentiate y = 4/x³."}
$y = 4x^{-3}$, so $\dfrac{dy}{dx} = -12x^{-4} = -\dfrac{12}{x^4}$.
:::

:::reveal{title="3. Find the gradient of y = 2x² − 3x + 1 at (2, 3)."}
$\dfrac{dy}{dx} = 4x - 3 = 5$ at $x = 2$.
:::

:::reveal{title="4. At what point on y = x² − 6x + 10 is the gradient zero? Is it a maximum or minimum?"}
$2x - 6 = 0 \Rightarrow x = 3$, $y = 1$. $\dfrac{d^2y}{dx^2} = 2 > 0$: a **minimum** at $(3, 1)$.
:::

:::reveal{title="5. A particle moves so that s = t³ − 6t² + 9t. Find when its velocity is zero."}
$v = 3t^2 - 12t + 9 = 3(t - 1)(t - 3) = 0$, so $t = 1$ s and $t = 3$ s.
:::

## Key terms

:::callout{type=definition title="Key terms"}
- **Derivative**: the gradient function $\dfrac{dy}{dx}$, which gives the gradient of a curve at any point.
- **Tangent to a curve**: the straight line that touches a curve at a point and has the same gradient there.
- **Stationary point**: a point where the gradient of a curve is zero, $\dfrac{dy}{dx} = 0$.
- **Maximum point**: a stationary point where the second derivative is negative.
- **Minimum point**: a stationary point where the second derivative is positive.
- **Velocity**: the rate of change of displacement with time, $\dfrac{ds}{dt}$.
- **Acceleration**: the rate of change of velocity with time, $\dfrac{dv}{dt}$.
:::

## Key points

- The derivative $\dfrac{dy}{dx}$ is the **gradient** of the curve (the gradient of the tangent).
- **Power rule**: $ax^n \to nax^{n-1}$; constants $\to 0$; term by term.
- **Expand** products and write fractions as **negative powers** first.
- **Tangent**: gradient from $\dfrac{dy}{dx}$, then $y - y_1 = m(x - x_1)$.
- **Stationary points**: $\dfrac{dy}{dx} = 0$; $\dfrac{d^2y}{dx^2} > 0$ minimum, $< 0$ maximum.
- **Velocity** $= \dfrac{ds}{dt}$; **acceleration** $= \dfrac{dv}{dt}$.

## WASSCE examination focus

:::callout{type=waec-tests}
Differentiation questions ask you to differentiate polynomials (sometimes with negative powers), find the gradient or the equation of a tangent at a point, find and classify stationary points, and solve simple rate-of-change and maximum or minimum problems. Show the derivative clearly before substituting; most marks are for the correct derivative and the method.
:::
