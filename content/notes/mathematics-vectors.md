Some quantities need only a size: a mass of 5 kg, a temperature of 30 °C. Others need a size **and a direction**: a wind blowing at 20 km/h **from the south-west**, a boat moving at 4 m/s **across** a river. Quantities with direction are **vectors**. In WASSCE Mathematics you work with vectors as arrows on a grid and as **column vectors**: adding, subtracting, multiplying by a number, finding their length, and using them to prove facts about shapes. This lesson covers each skill with worked examples.

## Learning objectives

By the end of this lesson you should be able to:

- distinguish scalars from vectors and use vector notation
- add, subtract and multiply column vectors by a scalar
- find the magnitude and direction of a vector
- use position vectors to find the vector between two points
- use vectors to show that lines are parallel and points are collinear

## Scalars and vectors

:::callout{type=definition}
- A **scalar** has size only: mass, time, distance, speed.
- A **vector** has size **and** direction: displacement, velocity, force.

A vector can be written as $\overrightarrow{AB}$ (from A to B), as a bold letter $\mathbf{a}$ (handwritten $\underset{\sim}{a}$), or as a **column vector**:

$$\begin{pmatrix} x \\ y \end{pmatrix}$$

where $x$ is the movement **across** (right is positive) and $y$ is the movement **up** (up is positive).

It can also be written with unit vectors: $\begin{pmatrix} 3 \\ 4 \end{pmatrix} = 3\mathbf{i} + 4\mathbf{j}$.
:::

## Operations on column vectors

:::callout{type=definition}
$$\begin{pmatrix} a \\ b \end{pmatrix} + \begin{pmatrix} c \\ d \end{pmatrix} = \begin{pmatrix} a + c \\ b + d \end{pmatrix}$$

$$k\begin{pmatrix} a \\ b \end{pmatrix} = \begin{pmatrix} ka \\ kb \end{pmatrix}$$

Subtracting a vector is adding its negative: $-\mathbf{b}$ has the same length as $\mathbf{b}$ but points the **opposite** way.
:::

:::callout{type=worked-example}
**Given $\mathbf{a} = \begin{pmatrix} 3 \\ -2 \end{pmatrix}$ and $\mathbf{b} = \begin{pmatrix} -1 \\ 4 \end{pmatrix}$, find $2\mathbf{a} - 3\mathbf{b}$.**

$$2\mathbf{a} = \begin{pmatrix} 6 \\ -4 \end{pmatrix} \qquad 3\mathbf{b} = \begin{pmatrix} -3 \\ 12 \end{pmatrix}$$

$$2\mathbf{a} - 3\mathbf{b} = \begin{pmatrix} 6 - (-3) \\ -4 - 12 \end{pmatrix} = \begin{pmatrix} 9 \\ -16 \end{pmatrix}$$
:::

### The triangle law

![On a grid, a goes 4 right and 1 up; b, drawn from the end of a, goes 1 right and 3 up; a + b goes from the start of a to the end of b: 5 right and 4 up, with length √41 ≈ 6.4](https://wasscetutor.com/img/mathematics/vector-triangle.svg)

Draw $\mathbf{b}$ starting where $\mathbf{a}$ ends. Then $\mathbf{a} + \mathbf{b}$ goes from the **start of $\mathbf{a}$** to the **end of $\mathbf{b}$**. Following the arrows "nose to tail" gives the same place as going straight there.

## Magnitude and direction

:::callout{type=definition}
The **magnitude** (length) of $\begin{pmatrix} x \\ y \end{pmatrix}$ comes from Pythagoras:

$$\left|\begin{pmatrix} x \\ y \end{pmatrix}\right| = \sqrt{x^2 + y^2}$$

The **direction** is the angle $\theta$ the vector makes with the positive $x$-axis: $\tan\theta = \dfrac{y}{x}$. Sketch the vector to see which quadrant it lies in.
:::

:::callout{type=worked-example}
**Find the magnitude and direction of $\mathbf{v} = \begin{pmatrix} -3 \\ 4 \end{pmatrix}$.**

$$|\mathbf{v}| = \sqrt{(-3)^2 + 4^2} = \sqrt{25} = 5$$

$\tan^{-1}\dfrac43 = 53.1°$. The vector points **left and up** (2nd quadrant), so $\theta = 180° - 53.1° = 126.9°$ from the positive $x$-axis.
:::

:::callout{type=common-mistake}
**Squaring a negative component wrongly.** $(-3)^2 = 9$, not $-9$. A magnitude can never be negative or zero unless the vector is zero.
:::

## Position vectors

:::callout{type=definition}
The **position vector** of a point A is $\overrightarrow{OA}$, the vector from the origin to A. If $\overrightarrow{OA} = \mathbf{a}$ and $\overrightarrow{OB} = \mathbf{b}$, then

$$\overrightarrow{AB} = \overrightarrow{AO} + \overrightarrow{OB} = -\mathbf{a} + \mathbf{b} = \mathbf{b} - \mathbf{a}$$

**"End minus start."** The midpoint M of AB has position vector $\overrightarrow{OM} = \tfrac12(\mathbf{a} + \mathbf{b})$.
:::

:::callout{type=worked-example}
**A is $(2, 3)$ and B is $(6, -1)$. Find $\overrightarrow{AB}$ and $|\overrightarrow{AB}|$.**

$$\overrightarrow{AB} = \begin{pmatrix} 6 - 2 \\ -1 - 3 \end{pmatrix} = \begin{pmatrix} 4 \\ -4 \end{pmatrix}$$

$$|\overrightarrow{AB}| = \sqrt{16 + 16} = 4\sqrt2 \approx 5.66$$
:::

## Vectors in shapes

Many WASSCE questions describe a shape with two vectors and ask you to express other lines in terms of them. Find a **route** along known vectors.

:::callout{type=worked-example}
**OABC is a parallelogram with $\overrightarrow{OA} = \mathbf{a}$ and $\overrightarrow{OC} = \mathbf{c}$. M is the midpoint of AB. Express (a) $\overrightarrow{OB}$, (b) $\overrightarrow{OM}$, (c) $\overrightarrow{CM}$ in terms of $\mathbf{a}$ and $\mathbf{c}$.**

In a parallelogram, opposite sides are equal and parallel, so $\overrightarrow{AB} = \overrightarrow{OC} = \mathbf{c}$.

**(a)** $\overrightarrow{OB} = \overrightarrow{OA} + \overrightarrow{AB} = \mathbf{a} + \mathbf{c}$

**(b)** $\overrightarrow{OM} = \overrightarrow{OA} + \tfrac12\overrightarrow{AB} = \mathbf{a} + \tfrac12\mathbf{c}$

**(c)** $\overrightarrow{CM} = \overrightarrow{CO} + \overrightarrow{OM} = -\mathbf{c} + \mathbf{a} + \tfrac12\mathbf{c} = \mathbf{a} - \tfrac12\mathbf{c}$
:::

## Parallel vectors and collinear points

:::callout{type=definition}
- Two vectors are **parallel** if one is a **scalar multiple** of the other: $\mathbf{p} = k\mathbf{q}$.
- Three points A, B, C are **collinear** (on one straight line) if $\overrightarrow{AB}$ and $\overrightarrow{BC}$ are parallel **and** share the point B.
:::

:::callout{type=worked-example}
**(a) Find $k$ if $\begin{pmatrix} 2 \\ k \end{pmatrix}$ is parallel to $\begin{pmatrix} 6 \\ 9 \end{pmatrix}$. (b) Show that $P(1, 2)$, $Q(3, 5)$ and $R(7, 11)$ are collinear.**

**(a)** $\begin{pmatrix} 6 \\ 9 \end{pmatrix} = 3\begin{pmatrix} 2 \\ 3 \end{pmatrix}$, so $k = 3$.

**(b)** $\overrightarrow{PQ} = \begin{pmatrix} 2 \\ 3 \end{pmatrix}$ and $\overrightarrow{QR} = \begin{pmatrix} 4 \\ 6 \end{pmatrix} = 2\overrightarrow{PQ}$. They are parallel and share Q, so **P, Q and R are collinear**.
:::

:::callout{type=local-example}
**Crossing the Rokel River.** A canoe is paddled straight across at $4$ m/s while the current carries it downstream at $3$ m/s. Its actual velocity is the vector sum $\begin{pmatrix} 4 \\ 0 \end{pmatrix} + \begin{pmatrix} 0 \\ -3 \end{pmatrix} = \begin{pmatrix} 4 \\ -3 \end{pmatrix}$, with speed $\sqrt{16 + 9} = 5$ m/s. The canoe lands downstream of the point straight opposite, which is why paddlers aim upstream.
:::

## Practice

:::reveal{title="1. Given p = (5, −1) and q = (−2, 3), find 3p + 2q."}
$\begin{pmatrix} 15 - 4 \\ -3 + 6 \end{pmatrix} = \begin{pmatrix} 11 \\ 3 \end{pmatrix}$.
:::

:::reveal{title="2. Find the magnitude of 2i − 5j, to one decimal place."}
$\sqrt{4 + 25} = \sqrt{29} = 5.4$.
:::

:::reveal{title="3. A is (−1, 4) and B is (5, −4). Find AB as a column vector, its length, and the midpoint of AB."}
$\overrightarrow{AB} = \begin{pmatrix} 6 \\ -8 \end{pmatrix}$, length $10$, midpoint $(2, 0)$.
:::

:::reveal{title="4. If x + (3, −2) = (1, 5), find x."}
$\mathbf{x} = \begin{pmatrix} 1 - 3 \\ 5 + 2 \end{pmatrix} = \begin{pmatrix} -2 \\ 7 \end{pmatrix}$.
:::

:::reveal{title="5. OAB is a triangle with OA = a and OB = b. N is the point on AB with AN = ⅓AB. Express ON in terms of a and b."}
$\overrightarrow{AB} = \mathbf{b} - \mathbf{a}$. $\overrightarrow{ON} = \mathbf{a} + \tfrac13(\mathbf{b} - \mathbf{a}) = \tfrac23\mathbf{a} + \tfrac13\mathbf{b}$.
:::

:::reveal{title="6. Find m if (m, 4) and (3, 6) are parallel."}
$\begin{pmatrix} 3 \\ 6 \end{pmatrix} = \tfrac32\begin{pmatrix} 2 \\ 4 \end{pmatrix}$, so $m = 2$. (Or $\dfrac{m}{3} = \dfrac46$.)
:::

## Key points

- **Vector** = size + direction; **column vector** $\begin{pmatrix} x \\ y \end{pmatrix}$ = across, up.
- Add and subtract **component by component**; multiply each component by a scalar.
- **Magnitude** $= \sqrt{x^2 + y^2}$; **direction** from $\tan\theta = \dfrac{y}{x}$ with a sketch.
- $\overrightarrow{AB} = \mathbf{b} - \mathbf{a}$ (end minus start); midpoint $\tfrac12(\mathbf{a} + \mathbf{b})$.
- **Parallel**: one is a multiple of the other. **Collinear**: parallel and sharing a point.

## WASSCE examination focus

:::callout{type=waec-tests}
Vector questions in the objective paper test column-vector arithmetic, magnitude and the vector between two points. Theory questions give a triangle or parallelogram described by two vectors, ask you to express other lines in terms of them, and sometimes to prove that points are collinear or lines parallel. Write each route clearly, step by step.
:::
