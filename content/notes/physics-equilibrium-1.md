A signboard hanging from two wires outside a shop in Kissy is perfectly still: every force on it is balanced. Engineers who design bridges, cranes and roofs spend their lives making sure forces add up to zero. This lesson shows you how.

## Learning objectives

By the end of this lesson you should be able to:

- state the conditions for equilibrium of a particle under concurrent forces
- apply the triangle of forces and Lami's theorem
- solve equilibrium problems by resolving forces
- find tensions in strings supporting a hanging load

## Equilibrium

:::callout{type=definition}
A body is in **equilibrium** when it is at **rest** or moving with **uniform velocity**, so that it has **no acceleration**. This happens when the **resultant force** on it is **zero** (and, for a large body, the resultant moment is zero).
:::

**Concurrent forces** are forces whose lines of action pass through one point. For a body under concurrent forces, equilibrium needs only one condition:

$$\sum F_x = 0 \quad\text{and}\quad \sum F_y = 0$$

In words: the **sum of the forces in any direction is zero** — upward forces equal downward forces, leftward forces equal rightward forces.

## Resultant and equilibrant

- The **resultant** is the single force that has the same effect as all the forces together.
- The **equilibrant** is the single force that balances them: equal in size to the resultant, **opposite** in direction.

## The triangle of forces

:::callout{type=definition}
**Triangle of forces:** if three forces acting at a point are in equilibrium, they can be represented in magnitude and direction by the **three sides of a triangle taken in order** (nose to tail).
:::

The converse is also true: if three forces can be drawn as a closed triangle, they are in equilibrium. More generally, any number of forces in equilibrium form a **closed polygon** (the polygon of forces).

## Lami's theorem

![Three forces F1, F2 and F3 acting at a point O and balancing; alpha is the angle between F2 and F3, beta between F3 and F1, gamma between F1 and F2](https://wasscetutor.com/img/physics/lami-three-forces.svg)

*Figure 1. Lami's theorem: each force is paired with the angle between the other two. WASSCE Tutor diagram.*

:::callout{type=definition}
**Lami's theorem:** if three concurrent forces are in equilibrium, each force is **proportional to the sine of the angle between the other two**:

$$\dfrac{F_1}{\sin\alpha} = \dfrac{F_2}{\sin\beta} = \dfrac{F_3}{\sin\gamma}$$
:::

## Worked examples

:::callout{type=worked-example}
**1. A lamp of weight 40 N hangs from the midpoint of a wire. Each half of the wire makes 30° with the horizontal. Find the tension in the wire.**

By symmetry both tensions are equal, $T$. Resolve vertically: the upward components balance the weight.

$$2T\sin 30° = 40 \Rightarrow 2T(0.5) = 40 \Rightarrow T = 40\ \text{N}$$

Horizontally, $T\cos 30°$ to the left balances $T\cos 30°$ to the right automatically.
:::

:::callout{type=common-mistake}
The **flatter** the wire, the **larger** the tension. If each half made only 5° with the horizontal, $T = \dfrac{40}{2\sin 5°} = 229$ N. A washing line can never be pulled perfectly straight when anything hangs on it: the tension would have to be infinite.
:::

:::callout{type=worked-example}
**2. A weight of 100 N is supported by two strings. One makes 30° with the vertical and the other 60° with the vertical, on opposite sides. Find the tensions $T_1$ (30° string) and $T_2$ (60° string).**

The angle between the two strings is $30° + 60° = 90°$. The angle between $T_1$ and the weight (straight down) is $180° - 30° = 150°$; between $T_2$ and the weight, $180° - 60° = 120°$.

By Lami's theorem:

$$\dfrac{T_1}{\sin 120°} = \dfrac{T_2}{\sin 150°} = \dfrac{100}{\sin 90°}$$

$$T_1 = 100\sin 120° = 86.6\ \text{N} \qquad T_2 = 100\sin 150° = 50\ \text{N}$$

Check by resolving horizontally: $T_1\sin 30° = 43.3$ and $T_2\sin 60° = 43.3$. ✓ The string nearer the vertical carries more of the load.
:::

:::callout{type=worked-example}
**3. A box of weight 50 N is pulled aside by a horizontal force $P$ until the rope it hangs from makes 37° with the vertical. Find $P$ and the tension in the rope.**

Resolve vertically: $T\cos 37° = 50 \Rightarrow T = \dfrac{50}{0.799} = 62.6$ N.

Resolve horizontally: $P = T\sin 37° = 62.6 \times 0.602 = 37.7$ N.

(Quick check: $\tan 37° = \dfrac{P}{50}$, so $P = 50 \times 0.754 = 37.7$ N. ✓)
:::

## A body on a smooth inclined plane

On a **smooth** (frictionless) slope at angle θ, a block can be held still by a force $P$ up the slope. Resolving along and perpendicular to the slope:

$$P = mg\sin\theta \qquad R = mg\cos\theta$$

For a 20 N block on a smooth 30° slope: $P = 20 \times 0.5 = 10$ N, and the normal reaction $R = 20 \times 0.866 = 17.3$ N.

## Key points

- Equilibrium: zero acceleration, zero resultant force ($\sum F_x = 0$, $\sum F_y = 0$).
- The equilibrant is equal and opposite to the resultant.
- Three forces in equilibrium form a closed **triangle of forces**.
- **Lami's theorem**: $\dfrac{F_1}{\sin\alpha} = \dfrac{F_2}{\sin\beta} = \dfrac{F_3}{\sin\gamma}$, each angle being between the other two forces.
- Resolving in two perpendicular directions solves almost every problem.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect to **state the conditions of equilibrium**, **state Lami's theorem** or the **triangle of forces**, and calculate **tensions in strings** holding a load. Draw a clear force diagram with angles marked. If you use Lami's theorem, show which angle goes with which force; if you resolve, write both the vertical and horizontal equations.
:::

## Quick check

1. What is the resultant force on a body in equilibrium?
2. A 60 N weight hangs from the middle of a wire whose halves each make 30° with the horizontal. Find the tension.
3. A 30 N block rests on a smooth 30° slope, held by a force up the slope. Find that force.

**Answers:** 1. Zero. 2. $2T\sin 30° = 60 \Rightarrow T = 60$ N. 3. $30\sin 30° = 15$ N.
