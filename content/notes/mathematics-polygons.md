A polygon is any closed shape with straight sides: a triangle, a square, the hexagons of a honeycomb, the octagon of a stop sign. WASSCE asks about their angles: the **sum** of the interior angles, the size of each angle in a **regular** polygon, and, most often, working backwards to find **how many sides** a polygon has. Two formulas do almost all of the work. This lesson explains where they come from, so you never have to memorise them blindly, and works through every type of question.

## Learning objectives

By the end of this lesson you should be able to:

- name polygons and identify regular polygons
- find the sum of the interior angles of any polygon
- use the fact that the exterior angles of any polygon add up to $360°$
- find each interior and exterior angle of a regular polygon
- find the number of sides of a polygon from its angles

## Naming polygons

| Sides | Name | Sides | Name |
|---|---|---|---|
| 3 | triangle | 7 | heptagon |
| 4 | quadrilateral | 8 | octagon |
| 5 | pentagon | 9 | nonagon |
| 6 | hexagon | 10 | decagon |

:::callout{type=definition}
A **regular polygon** has **all sides equal and all angles equal**. A square is a regular quadrilateral; a rectangle is not regular (its sides are not all equal).
:::

## The sum of the interior angles

From one vertex, draw diagonals to every other vertex. A polygon with $n$ sides splits into $(n - 2)$ triangles, and each triangle's angles add up to $180°$.

![A regular hexagon divided into four triangles by diagonals from one vertex, so its interior angles add to 4 × 180° = 720°; one side is extended to show an exterior angle of 60°](https://wasscetutor.com/img/mathematics/polygon-angles.svg)

:::callout{type=definition}
**Sum of the interior angles** of a polygon with $n$ sides:

$$S = (n - 2) \times 180°$$

| $n$ | Shape | Sum |
|---|---|---|
| 3 | triangle | $180°$ |
| 4 | quadrilateral | $360°$ |
| 5 | pentagon | $540°$ |
| 6 | hexagon | $720°$ |
| 8 | octagon | $1080°$ |
:::

## The exterior angles

At each vertex, the **exterior angle** is the angle between one side and the next side extended. Walk all the way round any polygon and you turn through one complete turn:

:::callout{type=definition}
**The exterior angles of any polygon add up to $360°$.**

At each vertex: **interior angle + exterior angle = $180°$** (they lie on a straight line).
:::

## Regular polygons

Because all the angles of a regular polygon are equal:

$$\text{each exterior angle} = \frac{360°}{n} \qquad \text{each interior angle} = 180° - \frac{360°}{n}$$

:::callout{type=worked-example}
**Find each interior angle of a regular octagon.**

Each exterior angle $= \dfrac{360°}{8} = 45°$, so each interior angle $= 180° - 45° = 135°$.

**Check:** $8 \times 135° = 1080° = (8 - 2) \times 180°$ ✓
:::

:::callout{type=tip}
**Use the exterior angle first.** It is quicker and less error-prone than dividing the interior sum by $n$: $360 \div n$ is easy; then subtract from $180$.
:::

## Finding the number of sides

:::callout{type=worked-example}
**Each interior angle of a regular polygon is $156°$. How many sides does it have?**

Exterior angle $= 180° - 156° = 24°$.

$$n = \frac{360°}{24°} = 15$$

**It has 15 sides.**
:::

:::callout{type=worked-example}
**The interior angles of a polygon add up to $1440°$. How many sides has it?**

$$(n - 2) \times 180 = 1440 \;\Rightarrow\; n - 2 = 8 \;\Rightarrow\; n = 10$$

**A decagon.**
:::

:::callout{type=common-mistake}
**Dividing 360 by the interior angle.** $360 \div 156$ is meaningless. Only the **exterior** angle divides into $360$. If you get a number of sides that is not a whole number, check which angle you used.
:::

## Irregular polygons

For an irregular polygon, use the **interior sum** and form an equation.

:::callout{type=worked-example}
**The angles of a pentagon are $x$, $2x$, $100°$, $110°$ and $130°$. Find $x$.**

Sum $= (5 - 2) \times 180° = 540°$.

$$x + 2x + 100 + 110 + 130 = 540 \;\Rightarrow\; 3x = 200 \;\Rightarrow\; x = 66\tfrac23°$$
:::

:::callout{type=local-example}
Tiles that fit together without gaps must have angles that add up to exactly $360°$ at each corner. Squares ($4 \times 90°$), equilateral triangles ($6 \times 60°$) and regular hexagons ($3 \times 120°$) all work, which is why floor tiles in Freetown's shops and offices are almost always one of those three shapes. A regular pentagon ($108°$) does not divide $360°$, so pentagon tiles alone always leave gaps.
:::

## Practice

:::reveal{title="1. Find the sum of the interior angles of a nonagon (9 sides)."}
$(9 - 2) \times 180° = 1260°$.
:::

:::reveal{title="2. Find each exterior and each interior angle of a regular decagon."}
Exterior $= 360 \div 10 = 36°$; interior $= 180 - 36 = 144°$.
:::

:::reveal{title="3. Each exterior angle of a regular polygon is 20°. How many sides has it, and what is its interior angle sum?"}
$n = 360 \div 20 = 18$. Sum $= 16 \times 180° = 2880°$.
:::

:::reveal{title="4. Each interior angle of a regular polygon is 5 times its exterior angle. Find the number of sides."}
Interior $+$ exterior $= 180$: $5e + e = 180 \Rightarrow e = 30°$. $n = 360 \div 30 = 12$.
:::

:::reveal{title="5. Four angles of a hexagon are 100°, 120°, 130° and 140°. The other two are equal. Find them."}
Sum $= 720°$. $100 + 120 + 130 + 140 + 2y = 720 \Rightarrow 2y = 230 \Rightarrow y = 115°$.
:::

:::reveal{title="6. Can a regular polygon have an interior angle of 130°? Explain."}
Exterior $= 50°$, and $360 \div 50 = 7.2$, not a whole number. **No.**
:::

## Key points

- Interior sum: $(n - 2) \times 180°$.
- Exterior angles of **any** polygon add up to $360°$; interior $+$ exterior $= 180°$ at each vertex.
- Regular polygon: exterior $= \dfrac{360°}{n}$; interior $= 180° - \text{exterior}$.
- To find $n$: find the **exterior** angle and divide it into $360°$, or solve $(n - 2) \times 180 = S$.
- $n$ must be a **whole number**; if it isn't, the polygon cannot exist.

## WASSCE examination focus

:::callout{type=waec-tests}
Polygon questions are common in the objective paper: interior sums, angles of regular polygons, and especially **finding $n$** from an interior or exterior angle, or from a relationship between them. In theory questions, polygon angles often combine with algebra (*"the angles are $x$, $2x$…"*).
:::
