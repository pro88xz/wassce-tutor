Area measures the **space inside** a flat shape, in square units: how much land a farm covers, how many tiles a floor needs, how much paint a wall takes. WASSCE sets area questions on triangles, quadrilaterals, circles, sectors and segments, and on composite shapes built from them, often with a practical twist: the cost of tiling, the area of a path, the land left after a building. This lesson gives every formula you need, explains where each comes from, and works through the question types.

## Learning objectives

By the end of this lesson you should be able to:

- find the areas of rectangles, triangles, parallelograms, trapeziums and circles
- use $\tfrac12 ab\sin C$ for a triangle given two sides and the included angle
- find the area of a sector and a segment
- find areas of composite shapes by adding or subtracting
- convert between units of area

## Units of area

- $1$ cm² $= 100$ mm²
- $1$ m² $= 10\,000$ cm²
- $1$ hectare $= 10\,000$ m²
- $1$ km² $= 100$ hectares

:::callout{type=common-mistake}
**Converting area like length.** $1$ m $= 100$ cm, but $1$ m² $= 100 \times 100 = 10\,000$ cm², not $100$ cm². Square the conversion factor.
:::

## The main formulas

:::callout{type=definition}
| Shape | Area |
|---|---|
| rectangle | $A = lb$ |
| square | $A = s^2$ |
| triangle | $A = \tfrac12 bh$ ($h$ perpendicular to the base) |
| triangle (two sides and included angle) | $A = \tfrac12 ab \sin C$ |
| parallelogram | $A = bh$ |
| trapezium | $A = \tfrac12 (a + b)h$ ($a$, $b$ the parallel sides) |
| circle | $A = \pi r^2$ |
| sector | $A = \dfrac{\theta}{360} \times \pi r^2$ |
:::

### Why they work

- A **triangle** is half of a rectangle (or parallelogram) with the same base and height.
- A **parallelogram** can be cut and rearranged into a rectangle of the same base and height.
- A **trapezium**: two copies fit together into a parallelogram with base $(a + b)$, so one is half of $(a + b)h$.

:::callout{type=tip}
The **height** is always measured **perpendicular** to the base, never along a sloping side. In a parallelogram with sides 10 cm and 6 cm and a height of 5 cm, the area is $10 \times 5 = 50$ cm², not $10 \times 6$.
:::

## Triangles: $\tfrac12 ab\sin C$

When you know two sides and the angle **between** them:

:::callout{type=worked-example}
**Find the area of triangle PQR with $PQ = 8$ cm, $PR = 11$ cm and $\angle P = 40°$.**

$$A = \tfrac12 \times 8 \times 11 \times \sin 40° = 44 \times 0.6428 \approx 28.3 \text{ cm}^2$$
:::

## Sectors and segments

![A sector of a circle with radius r and angle θ: sector area = (θ/360) × πr²](https://wasscetutor.com/img/mathematics/sector-arc.svg)

:::callout{type=definition}
A **segment** is the region between a chord and its arc. It is the **sector minus the triangle**:

$$\text{segment} = \frac{\theta}{360}\pi r^2 - \frac12 r^2 \sin\theta$$
:::

:::callout{type=worked-example}
**Find the area of the minor segment cut off by a chord that subtends $90°$ at the centre of a circle of radius 14 cm. ($\pi = \tfrac{22}{7}$)**

Sector $= \tfrac{90}{360} \times \tfrac{22}{7} \times 14^2 = \tfrac14 \times 616 = 154$ cm².

Triangle $= \tfrac12 \times 14 \times 14 \times \sin 90° = 98$ cm².

**Segment $= 154 - 98 = 56$ cm².**
:::

## Composite shapes

**Add** areas for shapes joined together; **subtract** for holes and cut-outs.

![An L-shaped plot of land, 20 m by 15 m with an 8 m by 6 m corner missing, divided into rectangles A and B](https://wasscetutor.com/img/mathematics/composite-plot.svg)

:::callout{type=worked-example}
**Find the area of the L-shaped plot.**

**Method 1 (add):** A $= 12 \times 15 = 180$; B $= 8 \times 9 = 72$. Total $= 252$ m².

**Method 2 (subtract):** whole rectangle $20 \times 15 = 300$, minus the missing corner $8 \times 6 = 48$: $300 - 48 = 252$ m² ✓

Two methods, the same answer: a good way to check.
:::

:::callout{type=worked-example}
**A rectangular field 50 m by 30 m has a path 2 m wide all round the inside. Find the area of the path.**

Inner rectangle: $(50 - 4) \times (30 - 4) = 46 \times 26 = 1196$ m².

Path $= 50 \times 30 - 1196 = 1500 - 1196 = 304$ m².
:::

:::callout{type=common-mistake}
**Subtracting the path width only once.** A path 2 m wide **all round** removes 2 m from **each** end, so the inner length is $50 - 4$, not $50 - 2$.
:::

:::callout{type=local-example}
**A classroom floor in Bo is 9 m by 7 m. Tiles are 30 cm squares and cost NLe 12 each. Find the cost of tiling the floor.**

Floor $= 9 \times 7 = 63$ m² $= 630\,000$ cm². One tile $= 30 \times 30 = 900$ cm².

Tiles $= 630\,000 \div 900 = 700$. Cost $= 700 \times 12 = $ **NLe 8 400**.

(Or by length: $900 \div 30 = 30$ tiles along, $700 \div 30 = 23.3$, so in practice 24 rows of 30 with some cut tiles. WASSCE usually accepts the area method unless it asks about whole tiles.)
:::

## Practice

:::reveal{title="1. Find the area of a trapezium with parallel sides 8 cm and 14 cm, 6 cm apart."}
$\tfrac12(8 + 14) \times 6 = 66$ cm².
:::

:::reveal{title="2. A circle has area 154 cm². Find its radius (π = 22/7)."}
$\pi r^2 = 154 \Rightarrow r^2 = 154 \times \tfrac{7}{22} = 49 \Rightarrow r = 7$ cm.
:::

:::reveal{title="3. Find the area of a sector of radius 21 cm and angle 60° (π = 22/7)."}
$\tfrac{60}{360} \times \tfrac{22}{7} \times 441 = \tfrac16 \times 1386 = 231$ cm².
:::

:::reveal{title="4. Find the area of a triangle with sides 10 cm and 7 cm and included angle 150°."}
$\tfrac12 \times 10 \times 7 \times \sin 150° = 35 \times 0.5 = 17.5$ cm².
:::

:::reveal{title="5. A circular table of radius 0.7 m stands on a square mat of side 2 m. What area of the mat is not covered? (π = 22/7)"}
Mat $= 4$ m²; table $= \tfrac{22}{7} \times 0.49 = 1.54$ m². Uncovered $= 4 - 1.54 = 2.46$ m².
:::

:::reveal{title="6. Convert 3.5 hectares to square metres."}
$3.5 \times 10\,000 = 35\,000$ m².
:::

## Key points

- Know the formulas: rectangle, triangle ($\tfrac12 bh$ and $\tfrac12 ab\sin C$), parallelogram, trapezium, circle, sector.
- Heights are **perpendicular** to the base.
- **Segment** = sector − triangle.
- **Composite** shapes: add the parts, or subtract the holes; use both methods to check.
- **Square** the conversion factor for area units ($1$ m² $= 10\,000$ cm²).

## WASSCE examination focus

:::callout{type=waec-tests}
Area questions appear in both papers: direct formula questions, sectors and segments with $\pi = \tfrac{22}{7}$, triangles with $\tfrac12 ab\sin C$, and practical problems (paths, tiling, fencing and cost). Show the formula, the substitution and the units; the commonest errors are using a slant side as the height and converting area units like lengths.
:::
