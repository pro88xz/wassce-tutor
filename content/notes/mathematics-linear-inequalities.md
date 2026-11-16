An equation says two things are **equal**: $x + 3 = 7$ has one answer, $x = 4$. An inequality says one thing is **bigger or smaller** than another: $x + 3 < 7$ is true for **every** number less than 4. Inequalities describe limits in real life (*a lorry can carry at most 10 tonnes*, *you must be at least 18 to vote*) and WASSCE tests them in one variable (solving, number lines, integer values) and in two variables (shading regions on a graph). This lesson covers both.

## Learning objectives

By the end of this lesson you should be able to:

- read and use the symbols $<$, $>$, $\le$, $\ge$
- solve linear inequalities, including the rule for multiplying or dividing by a negative number
- show solutions on a number line and list integer solutions
- solve double inequalities
- represent inequalities in two variables as regions on a graph

## The symbols

:::callout{type=definition}
| Symbol | Meaning | Example | Words |
|---|---|---|---|
| $<$ | less than | $x < 5$ | $x$ is less than 5 |
| $>$ | greater than | $x > -2$ | $x$ is greater than $-2$ |
| $\le$ | less than or equal to | $x \le 3$ | $x$ is **at most** 3 |
| $\ge$ | greater than or equal to | $x \ge 18$ | $x$ is **at least** 18 |
:::

## Number lines

![Three number lines: x > 2 with an open circle at 2 and an arrow to the right; x ≤ −1 with a filled circle at −1 and an arrow to the left; −2 ≤ x < 3 with a filled circle at −2 and an open circle at 3](https://wasscetutor.com/img/mathematics/inequality-number-lines.svg)

- **Open circle** ○ for $<$ or $>$: the number is **not** included.
- **Filled circle** ● for $\le$ or $\ge$: the number **is** included.

## Solving linear inequalities

Solve exactly like an equation, with **one extra rule**:

:::callout{type=definition}
**When you multiply or divide both sides by a negative number, reverse the inequality sign.**

Why? $2 < 5$ is true. Multiply both sides by $-1$: $-2$ and $-5$. But $-2 > -5$, so the sign must turn round.
:::

:::callout{type=worked-example}
**1. Solve $3x - 4 > 11$.**

$$3x > 15 \quad\Rightarrow\quad x > 5$$

**2. Solve $5 - 2x \le 13$.**

$$-2x \le 8 \quad\Rightarrow\quad x \ge -4 \quad\text{(divided by } -2\text{, so the sign reverses)}$$

**3. Solve $\dfrac{x + 1}{3} < \dfrac{x - 2}{2} + 1$.**

Multiply every term by 6: $2(x + 1) < 3(x - 2) + 6$

$$2x + 2 < 3x - 6 + 6 \quad\Rightarrow\quad 2x + 2 < 3x \quad\Rightarrow\quad 2 < x$$

**So $x > 2$.**
:::

:::callout{type=common-mistake}
**Forgetting to reverse the sign.** From $-2x \le 8$, writing $x \le -4$ is wrong. Test it: $x = 0$ satisfies $5 - 2(0) = 5 \le 13$, and $0 \ge -4$ ✓, but $0 \le -4$ is false. A quick test with one number catches the error.
:::

:::callout{type=tip}
To avoid dividing by a negative, move the $x$ terms to the side where they stay **positive**: from $5 - 2x \le 13$, add $2x$ and subtract $13$ to get $-8 \le 2x$, so $-4 \le x$. Same answer, no sign to reverse.
:::

## Double inequalities

Do the same thing to **all three parts**.

:::callout{type=worked-example}
**Solve $-3 \le 2x + 1 < 9$ and list the integer values of $x$.**

Subtract 1 throughout: $-4 \le 2x < 8$

Divide throughout by 2: $-2 \le x < 4$

**Integer values: $-2, -1, 0, 1, 2, 3$.** ($-2$ is included; $4$ is not.)
:::

## Inequalities in two variables: regions

An inequality such as $x + y \le 4$ is true for a whole **region** of the graph, on one side of the line $x + y = 4$.

### The method

1. Draw the **boundary line** by replacing the inequality sign with $=$.
   - **Solid** line for $\le$ or $\ge$ (points on the line are included).
   - **Dashed** line for $<$ or $>$ (points on the line are not included).
2. **Test a point** not on the line (the origin $(0, 0)$ is easiest, if the line doesn't pass through it).
3. If the point satisfies the inequality, its side is the region; if not, the other side is.
4. **Shade** as the question instructs. (Some questions ask you to shade the **unwanted** region and leave the required region clear. Read the instruction carefully.)

:::callout{type=worked-example}
**Show the region satisfied by $x \ge 0$, $y \ge 0$, $x + y \le 4$ and $y < x + 1$.**

- $x + y = 4$: solid line through $(4, 0)$ and $(0, 4)$. Test $(0, 0)$: $0 \le 4$ ✓, so the region is **below** it.
- $y = x + 1$: **dashed** line through $(0, 1)$ and $(3, 4)$. Test $(0, 0)$: $0 < 1$ ✓, so the region is **below** it.
- $x \ge 0$ and $y \ge 0$: the region is to the right of the $y$-axis and above the $x$-axis.

![The region bounded by the x-axis, the y-axis, the solid line x + y = 4 and the dashed line y = x + 1, with corners at (0, 0), (4, 0), (1.5, 2.5) and (0, 1)](https://wasscetutor.com/img/mathematics/inequality-region.svg)

The two lines meet where $4 - x = x + 1$, so $x = 1.5$ and $y = 2.5$.
:::

:::callout{type=local-example}
**A farmer in Bombali has at most 10 hectares to plant with rice ($r$) and groundnuts ($g$). She wants at least 3 hectares of rice.** Her constraints are $r + g \le 10$, $r \ge 3$, $g \ge 0$. Every point in the region these lines enclose is a possible plan; this is the idea behind *linear programming*, used by businesses to find the most profitable plan.
:::

## Practice

:::reveal{title="1. Solve 4x + 7 ≥ 3x − 2."}
$x \ge -9$.
:::

:::reveal{title="2. Solve 2 − 3x < 14 and show it on a number line."}
$-3x < 12 \Rightarrow x > -4$ (sign reversed). Open circle at $-4$, arrow to the right.
:::

:::reveal{title="3. Find the integer values of x for which 1 < 3x − 2 ≤ 10."}
Add 2: $3 < 3x \le 12$. Divide by 3: $1 < x \le 4$. **Integers: 2, 3, 4.**
:::

:::reveal{title="4. Solve (2x − 1)/3 − (x + 2)/4 > 1."}
Multiply by 12: $4(2x - 1) - 3(x + 2) > 12 \Rightarrow 8x - 4 - 3x - 6 > 12 \Rightarrow 5x > 22$, so **$x > 4.4$**.
:::

:::reveal{title="5. Which side of y = 2x − 3 satisfies y > 2x − 3? Is the line solid or dashed?"}
Test $(0, 0)$: $0 > -3$ ✓, so the region **containing the origin** (above the line). The line is **dashed** (strict inequality).
:::

## Key points

- $<, >$: open circle / dashed line. $\le, \ge$: filled circle / solid line.
- Solve like an equation, but **reverse the sign** when multiplying or dividing by a **negative**.
- For double inequalities, do the same to **all three parts**.
- For regions: draw the boundary, **test a point**, shade as instructed.
- **Test** your answer with a number to catch sign errors.

## WASSCE examination focus

:::callout{type=waec-tests}
Objective questions ask you to solve an inequality, choose the number line that shows it, or find the integer values that satisfy it. Theory questions may ask you to show the region satisfied by several inequalities on a graph, and sometimes to find the point in it that maximises a quantity. Reversing the sign for a negative divisor, and the solid/dashed distinction, are where marks are lost.
:::
