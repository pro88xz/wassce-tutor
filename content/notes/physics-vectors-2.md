When several forces act at once, or when you ask how fast a car is moving "as seen from" another car, drawing becomes slow. Components turn every such problem into simple addition.

## Learning objectives

By the end of this lesson you should be able to:

- find the resultant of three or more vectors by resolving into components
- find the equilibrant of a set of forces
- solve relative velocity problems, including crossing a river

## Resultant of several vectors by components

The method works for any number of vectors:

1. Resolve each vector into horizontal ($x$) and vertical ($y$) components. Take right and up as positive.
2. Add all the $x$-components: $\sum F_x$. Add all the $y$-components: $\sum F_y$.
3. Combine: $R = \sqrt{(\sum F_x)^2 + (\sum F_y)^2}$ and $\tan\alpha = \dfrac{\sum F_y}{\sum F_x}$.

:::callout{type=worked-example}
**Three forces act on a point: 10 N due east, 8 N due north, and 6 N at 30° north of west. Find the resultant.**

| Force | $x$-component (east +) | $y$-component (north +) |
|---|---|---|
| 10 N east | $+10$ | 0 |
| 8 N north | 0 | $+8$ |
| 6 N, 30° N of W | $-6\cos 30° = -5.20$ | $+6\sin 30° = +3.00$ |
| **Sum** | **4.80** | **11.00** |

$$R = \sqrt{4.80^2 + 11.00^2} = \sqrt{23.04 + 121} = \sqrt{144.04} = 12.0\ \text{N}$$

$$\tan\alpha = \dfrac{11.00}{4.80} = 2.29 \Rightarrow \alpha = 66.4°\ \text{north of east}$$
:::

## The equilibrant

:::callout{type=definition}
The **equilibrant** of a set of forces is the single force that, added to them, produces **equilibrium**. It is **equal in magnitude** to the resultant but acts in the **opposite direction**.
:::

In the example above, the equilibrant is 12.0 N at 66.4° **south of west**.

## Relative velocity

:::callout{type=definition}
The **velocity of A relative to B** is the velocity A appears to have to an observer moving with B:

$$\vec{v}_{AB} = \vec{v}_A - \vec{v}_B$$
:::

### Along a straight road

- Two cars travel in the **same direction** at 25 m s⁻¹ and 20 m s⁻¹. Relative to the slower car, the faster one moves forward at $25 - 20 = 5$ m s⁻¹. Overtaking takes a long time.
- In **opposite directions**, each sees the other approach at $25 + 20 = 45$ m s⁻¹. This is why head-on collisions are so violent.

### Crossing a river

![A boat heads straight across a river at 4 metres per second while the current flows at 3 metres per second; the resultant velocity is 5 metres per second at an angle downstream](https://wasscetutor.com/img/physics/relative-velocity-river.svg)

*Figure 1. The boat's velocity and the river's velocity add as vectors. WASSCE Tutor diagram.*

:::callout{type=worked-example}
**A canoe can move at 4 m s⁻¹ in still water. It is pointed straight across a river 80 m wide that flows at 3 m s⁻¹. Find (a) its resultant velocity, (b) the time to cross, (c) how far downstream it lands.**

(a) The two velocities are perpendicular:

$$v = \sqrt{4^2 + 3^2} = 5\ \text{m s}^{-1}, \qquad \tan\theta = \dfrac{3}{4} \Rightarrow \theta = 36.9°$$

to the line straight across.

(b) Only the 4 m s⁻¹ across the river carries it to the far bank:

$$t = \dfrac{80}{4} = 20\ \text{s}$$

(c) Meanwhile the current carries it downstream: $3 \times 20 = 60$ m.
:::

:::callout{type=worked-example}
**The same canoeist wants to land directly opposite. In which direction must she point the canoe, and how long does crossing take?**

She must point **upstream** at angle $\phi$ to the straight-across line, so that the upstream component of her velocity cancels the current:

$$4\sin\phi = 3 \Rightarrow \sin\phi = 0.75 \Rightarrow \phi = 48.6°$$

Her speed straight across is then $4\cos 48.6° = \sqrt{4^2 - 3^2} = \sqrt{7} = 2.65$ m s⁻¹, so

$$t = \dfrac{80}{2.65} = 30.2\ \text{s}$$

Landing directly opposite takes **longer** than pointing straight across.
:::

:::callout{type=local-example}
Fishermen crossing the Sierra Leone River estuary at Tagrin know this by experience: they aim their boats upstream of where they want to land, because the tide carries them sideways.
:::

### Rain and a moving person

:::callout{type=worked-example}
**Rain falls vertically at 6 m s⁻¹. A cyclist rides at 8 m s⁻¹. At what angle to the vertical should she tilt her umbrella?**

Relative to the cyclist, the rain has velocity $\vec{v}_{rain} - \vec{v}_{cyclist}$: 6 m s⁻¹ down and 8 m s⁻¹ backwards (towards her face).

$$\tan\theta = \dfrac{8}{6} \Rightarrow \theta = 53.1°$$

She tilts the umbrella **forwards** at 53.1° to the vertical. The rain seems to hit her at $\sqrt{6^2 + 8^2} = 10$ m s⁻¹.
:::

## Key points

- Resultant of many vectors: resolve, add $x$ and $y$ separately, then combine.
- Equilibrant = equal and **opposite** to the resultant.
- Relative velocity: $\vec{v}_{AB} = \vec{v}_A - \vec{v}_B$.
- River crossing: the **across** component alone decides the crossing time.

## WASSCE examination focus

:::callout{type=waec-tests}
Theory papers often combine **resolution of forces** with a resultant or equilibrant calculation, and relative velocity appears as a **river or wind problem** (an aeroplane flying in a crosswind is the same mathematics). Draw a clear vector diagram first, label every velocity, then calculate. State the direction with a reference ("36.9° downstream from the straight-across line").
:::

## Quick check

1. Forces of 3 N east and 4 N north act on a body. Give the magnitude and direction of the equilibrant.
2. Two trains approach each other at 15 m s⁻¹ and 20 m s⁻¹. What is their relative speed?
3. A swimmer crosses a 60 m wide river at 1.5 m s⁻¹ (pointed straight across) while the current flows at 2 m s⁻¹. How far downstream does she land?

**Answers:** 1. 5 N at 53.1° south of west. 2. 35 m s⁻¹. 3. Time $= 60 \div 1.5 = 40$ s; downstream $= 2 \times 40 = 80$ m.
