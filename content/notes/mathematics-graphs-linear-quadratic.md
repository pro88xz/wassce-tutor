A graph turns an equation into a picture, and pictures answer questions at a glance: where a line crosses an axis, where a curve is lowest, where two graphs meet. WASSCE Paper 2 almost always includes a graph question: complete a table of values, draw the graph on graph paper, then use it to solve equations or read off values. These questions carry many marks, and most of them are for **accuracy and method**, not difficult algebra. This lesson shows you how to earn them all.

## Learning objectives

By the end of this lesson you should be able to:

- complete a table of values for a linear or quadratic function
- choose a scale and plot a smooth, accurate graph
- find the gradient and intercept of a straight line
- read roots, maximum or minimum values and the line of symmetry from a quadratic graph
- use a graph to solve equations, including by drawing a second line

## Straight-line graphs: $y = mx + c$

:::callout{type=definition}
Every equation of the form $y = mx + c$ gives a **straight line**:

- $m$ is the **gradient** (slope): how much $y$ increases when $x$ increases by 1
- $c$ is the **$y$-intercept**: where the line crosses the $y$-axis, at $(0, c)$
:::

![The line y = 2x + 1, crossing the y-axis at (0, 1), with a triangle showing a run of 2 and a rise of 4, so the gradient is 2](https://wasscetutor.com/img/mathematics/linear-graph-gradient.svg)

### Gradient from two points

$$m = \frac{y_2 - y_1}{x_2 - x_1} = \frac{\text{rise}}{\text{run}}$$

:::callout{type=worked-example}
**Find the gradient of the line through $(1, 3)$ and $(4, 12)$, and its equation.**

$$m = \frac{12 - 3}{4 - 1} = \frac{9}{3} = 3$$

So $y = 3x + c$. Substitute $(1, 3)$: $3 = 3(1) + c \Rightarrow c = 0$. **The equation is $y = 3x$.**
:::

| Gradient | The line… |
|---|---|
| positive | rises from left to right |
| negative | falls from left to right |
| zero | is horizontal ($y = c$) |
| undefined | is vertical ($x = k$) |

## Quadratic graphs: $y = ax^2 + bx + c$

The graph of a quadratic is a **parabola**:

- if $a > 0$ it opens **upwards** (∪) and has a **minimum** point
- if $a < 0$ it opens **downwards** (∩) and has a **maximum** point

![The parabola y = x² − 2x − 3, with roots at x = −1 and x = 3, y-intercept (0, −3), minimum point (1, −4) and line of symmetry x = 1](https://wasscetutor.com/img/mathematics/quadratic-graph.svg)

| Feature | How to find it | For $y = x^2 - 2x - 3$ |
|---|---|---|
| **roots** | where the curve crosses the $x$-axis ($y = 0$) | $x = -1$ and $x = 3$ |
| **$y$-intercept** | where $x = 0$ | $(0, -3)$ |
| **line of symmetry** | halfway between the roots, or $x = -\dfrac{b}{2a}$ | $x = 1$ |
| **minimum / maximum** | the turning point, on the line of symmetry | $(1, -4)$ |

## The table of values

:::callout{type=worked-example}
**Complete the table for $y = x^2 - 2x - 3$ for $-2 \le x \le 4$.**

Work it out **term by term**: it is slower but far more accurate.

| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |
|---|---|---|---|---|---|---|---|
| $x^2$ | $4$ | $1$ | $0$ | $1$ | $4$ | $9$ | $16$ |
| $-2x$ | $4$ | $2$ | $0$ | $-2$ | $-4$ | $-6$ | $-8$ |
| $-3$ | $-3$ | $-3$ | $-3$ | $-3$ | $-3$ | $-3$ | $-3$ |
| $y$ | $5$ | $0$ | $-3$ | $-4$ | $-3$ | $0$ | $5$ |

**Check the symmetry:** the $y$-values repeat either side of $x = 1$ ($-3, -4, -3$ and $0, \ldots, 0$ and $5, \ldots, 5$). If your table is not symmetrical, look for an error.
:::

:::callout{type=common-mistake}
**Squaring negative numbers wrongly.** For $x = -2$: $x^2 = (-2)^2 = +4$ and $-2x = -2 \times (-2) = +4$. Calculator users often type $-2^2$ and get $-4$. Use brackets.
:::

## Drawing the graph: where the marks are

1. **Use the scale given** in the question (e.g. *2 cm to 1 unit on the $x$-axis*). If none is given, choose one that makes the graph fill most of the page.
2. **Label** both axes and mark the scale clearly.
3. **Plot** each point with a small, neat cross or dot.
4. Join the points of a quadratic with a **smooth curve**, not straight lines, and do not flatten the bottom.
5. **Label** the graph with its equation.

## Using the graph to solve equations

### Reading roots

The roots of $x^2 - 2x - 3 = 0$ are where the curve meets the **$x$-axis** ($y = 0$): **$x = -1$ and $x = 3$**.

### Drawing a second line

To solve a **different** equation with the same graph, rearrange it so that the left side is the plotted expression; the right side is the line to draw.

:::callout{type=worked-example}
**Use the graph of $y = x^2 - 2x - 3$ to solve $x^2 - 2x - 5 = 0$.**

Rewrite so the plotted expression appears: $x^2 - 2x - 3 = 2$.

So draw the line **$y = 2$** and read the $x$-values where it meets the curve.

![The line y = 2 meeting the parabola y = x² − 2x − 3 at about x = −1.4 and x = 3.4](https://wasscetutor.com/img/mathematics/quadratic-read-solutions.svg)

**$x \approx -1.4$ or $x \approx 3.4$.** (The exact values are $1 \pm \sqrt6 \approx -1.45$ and $3.45$; a careful graph reading to 1 decimal place earns the marks.)
:::

:::callout{type=worked-example}
**Using the same graph, solve $x^2 - 3x - 4 = 0$.**

Rewrite: $x^2 - 2x - 3 = x + 1$. Draw the line **$y = x + 1$**; it meets the curve at **$x = -1$ and $x = 4$**.

Check: $(x + 1)(x - 4) = x^2 - 3x - 4$ ✓
:::

:::callout{type=tip}
**The rearranging rule:** take the equation you are asked to solve, and add or subtract terms until the **left side is exactly the plotted expression**. Whatever is left on the right is the line to draw.
:::

:::callout{type=local-example}
A football kicked across a field in Bo follows a parabola. If its height in metres after $t$ seconds is $h = 12t - 4t^2$, then its graph opens downwards ($a = -4$), the ball lands when $h = 0$ ($t = 0$ or $t = 3$), and its greatest height is at the line of symmetry $t = 1.5$: $h = 12(1.5) - 4(1.5)^2 = 18 - 9 = $ **9 m**.
:::

## Practice

:::reveal{title="1. Find the gradient and y-intercept of 2y = 6x − 4."}
Make $y$ the subject: $y = 3x - 2$. **Gradient $3$, intercept $(0, -2)$.**
:::

:::reveal{title="2. Find the equation of the line through (2, 1) with gradient −3."}
$y = -3x + c$; $1 = -6 + c \Rightarrow c = 7$. **$y = -3x + 7$.**
:::

:::reveal{title="3. Complete the table for y = 2x² − 3 when x = −2, 0, 1.5."}
$x = -2$: $2(4) - 3 = 5$. $x = 0$: $-3$. $x = 1.5$: $2(2.25) - 3 = 1.5$.
:::

:::reveal{title="4. Find the line of symmetry and minimum value of y = x² + 4x + 1."}
$x = -\dfrac{b}{2a} = -\dfrac{4}{2} = -2$. $y = 4 - 8 + 1 = -3$.

**Line of symmetry $x = -2$; minimum value $-3$** (at $(-2, -3)$).
:::

:::reveal{title="5. You have drawn y = x² − x − 6. What line would you draw to solve x² − 2x − 3 = 0?"}
Rewrite: $x^2 - x - 6 = x - 3$. **Draw $y = x - 3$.**
:::

## Key points

- $y = mx + c$: **gradient** $m = \dfrac{\text{rise}}{\text{run}}$, **intercept** $(0, c)$.
- A quadratic graph is a **parabola**: ∪ if $a > 0$ (minimum), ∩ if $a < 0$ (maximum).
- Fill the **table of values term by term**, and check its **symmetry**.
- Plot accurately and join quadratic points with a **smooth curve**.
- Roots are on the **$x$-axis**; to solve another equation, **rearrange** so the plotted expression is on the left and draw the line on the right.

## WASSCE examination focus

:::callout{type=waec-tests}
A typical Paper 2 question: **(a)** complete a table of values, **(b)** draw the graph using a given scale, **(c)** use the graph to find the roots, the minimum or maximum value, or the solution of a related equation by drawing a line. Marks are awarded for each correct table entry, accurate plotting, a smooth curve and readings within a stated tolerance, so neatness and care pay directly.
:::
