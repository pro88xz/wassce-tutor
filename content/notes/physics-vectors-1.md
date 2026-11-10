Push a stalled car with a friend and the result depends not only on how hard you each push, but on **which way**. That "which way" is what separates vectors from scalars, and it runs through mechanics, electricity and fields.

## Learning objectives

By the end of this lesson you should be able to:

- distinguish scalar and vector quantities and give examples of each
- represent a vector by a directed line drawn to scale
- add vectors using the triangle and parallelogram laws, by drawing and by calculation
- resolve a vector into two perpendicular components

## Scalars and vectors

:::callout{type=definition}
A **scalar quantity** has **magnitude (size) only**. A **vector quantity** has **both magnitude and direction**.
:::

| Scalars | Vectors |
|---|---|
| distance | displacement |
| speed | velocity |
| mass | weight (a force) |
| time | acceleration |
| energy, work, power | force |
| temperature | momentum, impulse |
| pressure | electric field strength |
| density, volume | magnetic flux density |

:::callout{type=common-mistake}
**Speed is a scalar; velocity is a vector.** A keke going round a roundabout at a steady 20 km h⁻¹ has constant **speed** but changing **velocity**, because its direction keeps changing. Likewise **distance** is a scalar, **displacement** a vector.
:::

Scalars add by ordinary arithmetic: 3 kg + 4 kg = 7 kg always. Vectors do **not**: a 3 N force and a 4 N force can give a resultant anywhere from 1 N to 7 N, depending on the angle between them.

## Representing a vector

A vector is drawn as a straight line with an arrowhead:

- the **length** of the line, drawn to a chosen scale, represents the **magnitude**
- the **direction** of the arrow represents the **direction** of the vector

Example: with a scale of 1 cm to 10 N, a force of 45 N acting due east is a line 4.5 cm long pointing east.

## The resultant of two vectors

:::callout{type=definition}
The **resultant** of two or more vectors is the **single vector** that has the same effect as all of them acting together.
:::

### Vectors in the same or opposite directions

- Same direction: add. 5 N east + 3 N east = **8 N east**.
- Opposite directions: subtract. 5 N east + 3 N west = **2 N east**.

### The parallelogram law

![Two vectors P and Q drawn from a point O form two sides of a parallelogram; the diagonal from O is the resultant R](https://wasscetutor.com/img/physics/vector-parallelogram.svg)

*Figure 1. The parallelogram law. WASSCE Tutor diagram.*

:::callout{type=definition}
**Parallelogram law of vectors:** if two vectors acting at a point are represented in magnitude and direction by the two adjacent sides of a parallelogram, their resultant is represented in magnitude and direction by the **diagonal** of the parallelogram drawn from that point.
:::

The **triangle law** is the same idea: draw the vectors **nose to tail**; the resultant joins the tail of the first to the nose of the last.

### Calculating the resultant

**Perpendicular vectors (90°):** use Pythagoras and tangent.

$$R = \sqrt{P^2 + Q^2} \qquad \tan\theta = \dfrac{Q}{P}$$

**Any angle θ between them:** use the cosine rule form

$$R^2 = P^2 + Q^2 + 2PQ\cos\theta$$

:::callout{type=worked-example}
**A boy walks 8 m east and then 6 m north. Find his displacement.**

The two displacements are at 90°:

$$R = \sqrt{8^2 + 6^2} = \sqrt{100} = 10\ \text{m}$$

$$\tan\theta = \dfrac{6}{8} = 0.75 \Rightarrow \theta = 36.9°$$

Displacement: **10 m in the direction N 53.1° E** (that is, 36.9° north of east). The **distance** he walked is 14 m, but his displacement is only 10 m.
:::

:::callout{type=worked-example}
**Two forces of 5 N and 12 N act at a point with an angle of 60° between them. Find the resultant.**

$$R^2 = 5^2 + 12^2 + 2(5)(12)\cos 60° = 25 + 144 + 60 = 229$$

$$R = \sqrt{229} = 15.1\ \text{N}$$

Check it is sensible: it lies between $12 - 5 = 7$ N and $12 + 5 = 17$ N.
:::

## Resolving a vector into components

A single vector can be replaced by two perpendicular vectors, its **components**, that together have the same effect.

![A force F at angle theta to the horizontal, with horizontal component F cos theta and vertical component F sin theta](https://wasscetutor.com/img/physics/vector-components.svg)

*Figure 2. Resolving a vector. WASSCE Tutor diagram.*

For a vector $F$ at angle $\theta$ to the horizontal:

$$F_x = F\cos\theta \quad\text{(horizontal)} \qquad F_y = F\sin\theta \quad\text{(vertical)}$$

:::callout{type=worked-example}
**A girl pulls a loaded basin across the floor with a rope at 30° to the horizontal. The tension in the rope is 40 N. Find the components.**

- Horizontal (pulls the basin along): $40\cos 30° = 40 \times 0.866 = 34.6$ N
- Vertical (lifts it slightly): $40\sin 30° = 40 \times 0.5 = 20$ N

Only the horizontal 34.6 N moves the basin forward, which is why pulling at a steep angle wastes effort.
:::

:::callout{type=common-mistake}
The **cos** goes with the component **next to** the angle (adjacent side) and **sin** with the one **opposite** it. If the angle is measured from the **vertical**, the vertical component is $F\cos\theta$. Always check where the angle is measured from.
:::

## Key points

- Scalars: magnitude only. Vectors: magnitude **and** direction.
- Resultant by the **parallelogram** or **triangle** law.
- Perpendicular vectors: $R = \sqrt{P^2 + Q^2}$, $\tan\theta = Q/P$.
- General angle: $R^2 = P^2 + Q^2 + 2PQ\cos\theta$.
- Components: $F\cos\theta$ along the angle's arm, $F\sin\theta$ perpendicular to it.

## WASSCE examination focus

:::callout{type=waec-tests}
Objective questions ask you to **classify quantities** as scalar or vector and to find the **resultant of two perpendicular forces**. Theory questions often ask you to **state the parallelogram law**, then find a resultant **graphically** (state your scale, draw accurately, measure length and angle) or **by calculation**. Always give **both** magnitude and direction.
:::

## Quick check

1. Which is a vector: speed, energy, momentum, mass?
2. Forces of 6 N and 8 N act at right angles. Find the resultant.
3. A force of 50 N acts at 60° to the horizontal. Find its horizontal component.

**Answers:** 1. Momentum. 2. $\sqrt{36 + 64} = 10$ N at $\tan^{-1}(8/6) = 53.1°$ to the 6 N force. 3. $50\cos 60° = 25$ N.
