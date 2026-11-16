Coordinate geometry joins algebra and geometry: every point becomes a pair of numbers $(x, y)$, every straight line becomes an equation, and questions about lengths, slopes and shapes become calculations. Three formulas do almost all the work: the **distance** between two points, the **midpoint**, and the **gradient**. From these you can find the equation of a line, test whether lines are parallel or perpendicular, and prove facts about triangles and quadrilaterals. WASSCE sets coordinate geometry every year, in both papers.

## Learning objectives

By the end of this lesson you should be able to:

- find the distance between two points and the midpoint of a line
- find the gradient of a line through two points
- find the equation of a straight line in the form $y = mx + c$
- use gradients to identify parallel and perpendicular lines
- find where two lines meet, and solve problems about shapes

## The three key formulas

For points $A(x_1, y_1)$ and $B(x_2, y_2)$:

:::callout{type=definition}
| | Formula |
|---|---|
| **distance** $AB$ | $\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$ |
| **midpoint** of $AB$ | $\left(\dfrac{x_1 + x_2}{2}, \dfrac{y_1 + y_2}{2}\right)$ |
| **gradient** of $AB$ | $m = \dfrac{y_2 - y_1}{x_2 - x_1} = \dfrac{\text{rise}}{\text{run}}$ |
:::

![Points A(1, 2) and B(7, 10) joined by a line; a right-angled triangle below it has a horizontal side of 6 and a vertical side of 8, so AB = 10; the midpoint M is (4, 6) and the gradient is 8/6 = 4/3](https://wasscetutor.com/img/mathematics/coordinate-distance-midpoint.svg)

### Where the distance formula comes from

Draw the right-angled triangle under AB. Its horizontal side is the change in $x$ and its vertical side is the change in $y$. **Pythagoras** gives the hypotenuse: that is the whole distance formula.

:::callout{type=worked-example}
**For $A(1, 2)$ and $B(7, 10)$, find the distance AB, the midpoint and the gradient.**

$$AB = \sqrt{(7 - 1)^2 + (10 - 2)^2} = \sqrt{36 + 64} = \sqrt{100} = 10$$

$$M = \left(\frac{1 + 7}{2}, \frac{2 + 10}{2}\right) = (4, 6)$$

$$m = \frac{10 - 2}{7 - 1} = \frac86 = \frac43$$
:::

:::callout{type=common-mistake}
**Mixing the order in the gradient.** If you start with B on top, start with B underneath: $\dfrac{y_2 - y_1}{x_2 - x_1}$, never $\dfrac{y_2 - y_1}{x_1 - x_2}$. Mixing them flips the sign.
:::

## The equation of a straight line

:::callout{type=definition}
$$y = mx + c$$

$m$ is the **gradient**; $c$ is the **$y$-intercept** (where the line crosses the $y$-axis).

Through a point $(x_1, y_1)$ with gradient $m$:

$$y - y_1 = m(x - x_1)$$
:::

:::callout{type=worked-example}
**Find the equation of the line through $(2, -1)$ and $(5, 8)$.**

Gradient: $m = \dfrac{8 - (-1)}{5 - 2} = \dfrac93 = 3$.

Using $(2, -1)$: $y - (-1) = 3(x - 2)$, so $y + 1 = 3x - 6$.

$$y = 3x - 7$$

**Check** with the other point: $3(5) - 7 = 8$ ✓
:::

:::callout{type=tip}
To read the gradient from an equation, first make $y$ the subject. For $2x + 3y = 12$: $3y = -2x + 12$, so $y = -\tfrac23 x + 4$. The gradient is $-\tfrac23$ and the $y$-intercept is $4$.
:::

## Parallel and perpendicular lines

:::callout{type=definition}
- **Parallel** lines have **equal gradients**: $m_1 = m_2$.
- **Perpendicular** lines have gradients that multiply to $-1$: $m_1 \times m_2 = -1$, so $m_2 = -\dfrac{1}{m_1}$ ("flip and change the sign").
:::

| Gradient | Parallel gradient | Perpendicular gradient |
|---|---|---|
| $2$ | $2$ | $-\tfrac12$ |
| $-\tfrac34$ | $-\tfrac34$ | $\tfrac43$ |
| $\tfrac15$ | $\tfrac15$ | $-5$ |

:::callout{type=worked-example}
**Find the equation of the perpendicular bisector of $A(1, 2)$ and $B(7, 10)$.**

Midpoint $M = (4, 6)$; gradient of $AB = \tfrac43$; perpendicular gradient $= -\tfrac34$.

$$y - 6 = -\tfrac34(x - 4) \;\Rightarrow\; 4y - 24 = -3x + 12 \;\Rightarrow\; 3x + 4y = 36$$

**Check:** $M(4, 6)$ gives $12 + 24 = 36$ ✓
:::

## Where two lines meet

The point of intersection satisfies **both** equations, so solve them **simultaneously**.

:::callout{type=worked-example}
**Find where $y = 2x - 3$ meets $x + y = 9$.**

Substitute: $x + (2x - 3) = 9 \Rightarrow 3x = 12 \Rightarrow x = 4$; then $y = 2(4) - 3 = 5$.

**The lines meet at $(4, 5)$.**
:::

## Problems about shapes

Coordinate geometry can **prove** what kind of shape you have.

| To show… | check… |
|---|---|
| a right angle at B | gradients of AB and BC multiply to $-1$ |
| a parallelogram | opposite sides have **equal gradients** |
| an isosceles triangle | **two sides** have equal length |
| three points are collinear (on one line) | the gradients AB and BC are **equal** |

:::callout{type=worked-example}
**Show that $P(-1, 1)$, $Q(2, 5)$ and $R(6, 2)$ form a right-angled isosceles triangle.**

Gradients: $PQ = \dfrac{5 - 1}{2 - (-1)} = \dfrac43$; $QR = \dfrac{2 - 5}{6 - 2} = -\dfrac34$.

$\tfrac43 \times \left(-\tfrac34\right) = -1$, so **$\angle PQR = 90°$**.

Lengths: $PQ = \sqrt{3^2 + 4^2} = 5$; $QR = \sqrt{4^2 + 3^2} = 5$.

$PQ = QR$, so the triangle is **right-angled and isosceles**.
:::

:::callout{type=local-example}
On a town map of Bo drawn on a grid with 1 unit = 100 m, the market is at $(2, 3)$ and the hospital at $(8, 11)$. The straight-line distance is $\sqrt{6^2 + 8^2} = 10$ units $= $ **1 km**, and a meeting point exactly halfway is at $(5, 7)$. Planners and surveyors use exactly these calculations every day.
:::

## Practice

:::reveal{title="1. Find the distance between (−2, 3) and (4, −5)."}
$\sqrt{6^2 + (-8)^2} = \sqrt{100} = 10$.
:::

:::reveal{title="2. M(3, −1) is the midpoint of AB, and A is (−1, 4). Find B."}
$\dfrac{-1 + x}{2} = 3 \Rightarrow x = 7$; $\dfrac{4 + y}{2} = -1 \Rightarrow y = -6$. **B = (7, −6).**
:::

:::reveal{title="3. Find the gradient and y-intercept of 4x − 2y = 10."}
$-2y = -4x + 10 \Rightarrow y = 2x - 5$. Gradient $2$, $y$-intercept $-5$.
:::

:::reveal{title="4. Find the equation of the line through (3, 4) parallel to y = −2x + 7."}
Parallel, so $m = -2$: $y - 4 = -2(x - 3) \Rightarrow y = -2x + 10$.
:::

:::reveal{title="5. Find the equation of the line through (2, 5) perpendicular to y = ½x + 1."}
Perpendicular gradient $= -2$: $y - 5 = -2(x - 2) \Rightarrow y = -2x + 9$.
:::

:::reveal{title="6. Are A(0, 1), B(2, 5) and C(5, 11) collinear?"}
$m_{AB} = \dfrac42 = 2$; $m_{BC} = \dfrac63 = 2$. Equal gradients through the shared point B, so **yes, collinear**.
:::

## Key points

- **Distance** $= \sqrt{(\Delta x)^2 + (\Delta y)^2}$ (Pythagoras). **Midpoint** = average of the coordinates.
- **Gradient** $= \dfrac{y_2 - y_1}{x_2 - x_1}$; keep the order the same top and bottom.
- **Equation**: $y = mx + c$, or $y - y_1 = m(x - x_1)$; make $y$ the subject to read $m$ and $c$.
- **Parallel**: equal gradients. **Perpendicular**: $m_1 m_2 = -1$.
- **Intersection**: solve the two equations simultaneously.

## WASSCE examination focus

:::callout{type=waec-tests}
Coordinate geometry appears every year: objective questions on distance, midpoint and gradient, and theory questions asking for the equation of a line (often a perpendicular bisector or a line parallel to another), the point where two lines meet, or a proof about a triangle or quadrilateral. Show each formula with the substitution; sign errors with negative coordinates are the commonest slip.
:::
