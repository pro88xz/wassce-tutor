A **transformation** moves or changes a shape on the coordinate plane according to a rule. There are four in WASSCE: **reflection** (a flip), **rotation** (a turn), **translation** (a slide) and **enlargement** (a change of size). Each has a precise description and, on the coordinate plane, a simple rule for what happens to every point $(x, y)$. This lesson teaches all four, the coordinate rules, and how to **describe** a transformation fully, which is where most marks are lost.

## Learning objectives

By the end of this lesson you should be able to:

- reflect, rotate, translate and enlarge shapes on the coordinate plane
- use the coordinate rule for each common transformation
- describe a single transformation fully from an object and its image
- state which properties a transformation keeps (size, shape, orientation)

## The four transformations

![Four grids: reflection of a triangle in the y-axis; rotation of 90° anticlockwise about O; translation by the vector (6, 1); enlargement with scale factor 2 and centre O](https://wasscetutor.com/img/mathematics/transformations-panels.svg)

The original shape is the **object**; the transformed shape is the **image**. If the object is A, the image is written A′ ("A dash").

### 1. Reflection

Every point is flipped to the other side of a **mirror line**, the **same distance** away, along a line **perpendicular** to the mirror.

:::callout{type=definition}
| Reflection in | Rule |
|---|---|
| the $x$-axis | $(x, y) \to (x, -y)$ |
| the $y$-axis | $(x, y) \to (-x, y)$ |
| the line $y = x$ | $(x, y) \to (y, x)$ |
| the line $y = -x$ | $(x, y) \to (-y, -x)$ |
:::

For other mirror lines (such as $x = 2$ or $y = -1$), count squares: measure each point's distance to the mirror and go the same distance on the other side.

### 2. Rotation

Every point turns through the same **angle**, in the same **direction**, about a fixed **centre**.

:::callout{type=definition}
| Rotation about the origin | Rule |
|---|---|
| $90°$ anticlockwise (or $270°$ clockwise) | $(x, y) \to (-y, x)$ |
| $90°$ clockwise (or $270°$ anticlockwise) | $(x, y) \to (y, -x)$ |
| $180°$ (either direction) | $(x, y) \to (-x, -y)$ |
:::

:::callout{type=tip}
**Tracing paper trick.** Trace the shape and the centre, put your pencil point on the centre, and turn the paper through the angle. In the exam, check one point with the coordinate rule.
:::

### 3. Translation

Every point slides the same distance in the same direction, given by a **column vector** $\begin{pmatrix} a \\ b \end{pmatrix}$: $a$ across, $b$ up.

$$(x, y) \to (x + a, \; y + b)$$

### 4. Enlargement

Every distance from the **centre of enlargement** is multiplied by the **scale factor** $k$.

:::callout{type=definition}
- Centre the origin: $(x, y) \to (kx, ky)$.
- Centre $(a, b)$: $(x, y) \to \big(a + k(x - a),\; b + k(y - b)\big)$.
- **$k > 1$**: bigger. **$0 < k < 1$**: smaller (still called an enlargement).
- **$k < 0$**: the image is on the **other side** of the centre and upside down.
- Lengths are multiplied by $|k|$, **areas by $k^2$**.
:::

## Worked examples

:::callout{type=worked-example}
**Triangle PQR has vertices $P(1, 2)$, $Q(3, 2)$ and $R(3, 5)$. Find the image under (a) a reflection in $y = x$, (b) a rotation of $180°$ about the origin, (c) a translation by $\begin{pmatrix} -4 \\ 1 \end{pmatrix}$.**

**(a)** Swap the coordinates: $P'(2, 1)$, $Q'(2, 3)$, $R'(5, 3)$.

**(b)** Change both signs: $P'(-1, -2)$, $Q'(-3, -2)$, $R'(-3, -5)$.

**(c)** Add the vector: $P'(-3, 3)$, $Q'(-1, 3)$, $R'(-1, 6)$.
:::

:::callout{type=worked-example}
**Find the image of $A(2, 3)$ under an enlargement with scale factor 3 and centre $(1, 1)$.**

From the centre to A: $\begin{pmatrix} 2 - 1 \\ 3 - 1 \end{pmatrix} = \begin{pmatrix} 1 \\ 2 \end{pmatrix}$. Multiply by 3: $\begin{pmatrix} 3 \\ 6 \end{pmatrix}$. Add to the centre:

$$A' = (1 + 3, \; 1 + 6) = (4, 7)$$
:::

:::callout{type=worked-example}
**A triangle of area 6 cm² is enlarged with scale factor $-2$. Find the area of the image.**

Area factor $= (-2)^2 = 4$, so the image has area $6 \times 4 = $ **24 cm²**. (The negative sign turns the image round; it does not make the area negative.)
:::

## Describing a transformation fully

A full description needs **every** piece of information below. Missing one costs marks.

:::callout{type=definition}
| Transformation | You must state |
|---|---|
| **reflection** | the **mirror line** (as an equation, e.g. $y = x$) |
| **rotation** | the **centre**, the **angle**, the **direction** (clockwise or anticlockwise) |
| **translation** | the **column vector** |
| **enlargement** | the **centre** and the **scale factor** |
:::

:::callout{type=worked-example}
**A triangle has vertices $(1, 1)$, $(2, 1)$, $(1, 2)$. Its image has vertices $(2, 2)$, $(4, 2)$, $(2, 4)$. Describe the transformation fully.**

Each image coordinate is **double** the object coordinate, and the shape is the same way round but bigger.

**An enlargement, scale factor 2, centre the origin $(0, 0)$.**

To find a centre you are not sure of: draw lines through each object point and its image; they all meet at the centre.
:::

:::callout{type=common-mistake}
**Incomplete descriptions.** "It is a rotation" scores almost nothing. "A rotation of $90°$ anticlockwise about the origin" scores full marks. Likewise "a reflection in the line $y = x$", never just "a reflection".
:::

## What is kept the same

| | Size | Shape | Image is a mirror image? |
|---|---|---|---|
| reflection | same | same | **yes** |
| rotation | same | same | no |
| translation | same | same | no |
| enlargement | **changed** | same | no |

Reflections, rotations and translations give **congruent** images. Enlargements give **similar** images.

:::callout{type=local-example}
Look closely at gara (tie-dye) cloth and country cloth from markets in Freetown and Makeni. A single motif is repeated across the cloth by **translation**, often mirrored by **reflection** so the pattern is symmetrical, and some designs turn a motif round a centre by **rotation**. The dyers work out by eye the same transformations you describe with coordinates.
:::

## Practice

:::reveal{title="1. Find the image of (4, −3) after a reflection in the x-axis."}
$(4, 3)$.
:::

:::reveal{title="2. Find the image of (2, 5) after a rotation of 90° clockwise about the origin."}
$(x, y) \to (y, -x)$: $(5, -2)$.
:::

:::reveal{title="3. The point (3, 1) is translated to (−1, 4). Find the translation vector."}
$\begin{pmatrix} -1 - 3 \\ 4 - 1 \end{pmatrix} = \begin{pmatrix} -4 \\ 3 \end{pmatrix}$.
:::

:::reveal{title="4. Find the image of (6, 4) under an enlargement with scale factor ½ and centre the origin."}
$(3, 2)$.
:::

:::reveal{title="5. A point (x, y) maps to (−x, −y). Describe the transformation fully."}
A rotation of $180°$ about the origin. (Equivalently, an enlargement with scale factor $-1$, centre the origin.)
:::

:::reveal{title="6. Reflect (5, 2) in the line x = 3."}
The point is 2 units right of $x = 3$, so its image is 2 units left: $(1, 2)$.
:::

## Key points

- **Reflection**: mirror line. **Rotation**: centre, angle, direction. **Translation**: vector. **Enlargement**: centre, scale factor.
- Learn the rules: $x$-axis $(x, -y)$; $y$-axis $(-x, y)$; $y = x$ $(y, x)$; $90°$ anticlockwise $(-y, x)$; $180°$ $(-x, -y)$.
- Enlargement areas scale by **$k^2$**; a negative $k$ puts the image on the other side of the centre.
- **Describe fully**: every required detail, or the marks are lost.

## WASSCE examination focus

:::callout{type=waec-tests}
Transformation questions ask for the coordinates of an image under a stated transformation, often two in succession, and for a full description of a transformation from a diagram. Theory questions may require you to draw the object and images on graph paper with a given scale. Label every image clearly ($A'$, $A''$) and give full descriptions.
:::
