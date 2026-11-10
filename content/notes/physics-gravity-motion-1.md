Drop a stone and a sheet of paper together: the stone wins. Crumple the paper into a tight ball and they land together. Air, not mass, made the difference. Without air, every object falls with exactly the same acceleration.

## Learning objectives

By the end of this lesson you should be able to:

- define acceleration due to gravity and free fall
- apply the equations of motion to bodies falling or thrown vertically
- find the maximum height and time of flight of a body thrown upwards
- interpret the velocity–time graph of vertical motion

## Free fall and the acceleration due to gravity

:::callout{type=definition}
A body is in **free fall** when the **only force acting on it is its weight** (air resistance is negligible). It then falls with a constant acceleration called the **acceleration due to gravity**, $g$.
:::

Near the Earth's surface $g \approx 9.8$ m s⁻². WASSCE questions usually say **take $g = 10$ m s⁻²**; use whatever value the question gives.

Key facts about free fall:

- $g$ is the same for **all** bodies at the same place, whatever their mass.
- $g$ always acts **vertically downwards**, whether the body is moving up or down.
- $g$ varies slightly over the Earth: larger at the poles than at the equator, smaller at the top of a mountain.

:::callout{type=common-mistake}
"Heavy things fall faster" is false in a vacuum. A heavier body has a bigger weight, but it also has more mass to accelerate; the two effects cancel ($a = \dfrac{mg}{m} = g$). Air resistance is what slows light, broad objects such as a feather or a leaf.
:::

## The equations of motion for vertical motion

Replace $a$ with $\pm g$ and $s$ with height $h$. Choose a direction as positive and stick to it.

**Taking downwards as positive** (convenient for dropped bodies):

$$v = u + gt \qquad h = ut + \tfrac{1}{2}gt^2 \qquad v^2 = u^2 + 2gh$$

**Taking upwards as positive** (convenient for bodies thrown up): use $a = -g$:

$$v = u - gt \qquad h = ut - \tfrac{1}{2}gt^2 \qquad v^2 = u^2 - 2gh$$

## A body dropped from rest

:::callout{type=worked-example}
**A coconut falls from rest from a tree 20 m high. Find (a) the time to reach the ground, (b) its speed on impact. Take $g = 10$ m s⁻².**

Downwards positive, $u = 0$, $h = 20$ m.

(a) $h = \tfrac{1}{2}gt^2 \Rightarrow 20 = 5t^2 \Rightarrow t = 2$ s.

(b) $v = gt = 10 \times 2 = 20$ m s⁻¹ (or $v^2 = 2gh = 400$).
:::

## A body thrown vertically upwards

![Velocity-time graph for a ball thrown straight up: a straight line falling from +u through zero at the highest point to -u when it returns](https://wasscetutor.com/img/physics/thrown-up-vt.svg)

*Figure 1. Velocity–time graph for a body thrown upwards (up positive). WASSCE Tutor diagram.*

At the **highest point** the velocity is momentarily **zero** (but the acceleration is still $g$ downwards). Setting $v = 0$:

| Quantity | Result | How it is found |
|---|---|---|
| Time to reach the top | $t = \dfrac{u}{g}$ | $0 = u - gt$ |
| Maximum height | $H = \dfrac{u^2}{2g}$ | $0 = u^2 - 2gH$ |
| Time of flight (back to the thrower) | $T = \dfrac{2u}{g}$ | twice the time up |
| Speed on return to the thrower | $u$ (same as launch speed) | symmetry, no air resistance |

:::callout{type=worked-example}
**A ball is thrown vertically upwards at 30 m s⁻¹. Find (a) the maximum height, (b) the time to reach it, (c) the total time in the air, (d) its velocity after 4 s. Take $g = 10$ m s⁻².**

Up positive.

(a) $H = \dfrac{u^2}{2g} = \dfrac{900}{20} = 45$ m.

(b) $t = \dfrac{u}{g} = \dfrac{30}{10} = 3$ s.

(c) $T = 2 \times 3 = 6$ s.

(d) $v = u - gt = 30 - 10 \times 4 = -10$ m s⁻¹. The minus sign means it is now moving **downwards** at 10 m s⁻¹.
:::

:::callout{type=common-mistake}
At the top of its flight, $v = 0$ but $a \neq 0$. If the acceleration were zero there, the ball would stay in the air. Objective questions test this often: "At the highest point, the acceleration is…" — answer: $g$, downwards.
:::

## Energy view (a useful check)

Ignoring air resistance, kinetic energy at launch becomes potential energy at the top:

$$\tfrac{1}{2}mu^2 = mgH \Rightarrow H = \dfrac{u^2}{2g}$$

the same result, with the mass cancelling.

## Terminal velocity

In air, a falling body feels **air resistance** that grows with its speed. Eventually air resistance equals the weight; the resultant force is then zero and the body falls at a constant **terminal velocity**. A skydiver reaches about 55 m s⁻¹; opening a parachute raises the air resistance and lowers the terminal velocity to about 5 m s⁻¹.

:::callout{type=local-example}
A raindrop falling from a cloud 1000 m up would hit the ground at about 140 m s⁻¹ if there were no air, enough to injure. Air resistance gives raindrops a terminal velocity of only a few metres per second, which is why the rainy season in Freetown is wet but not dangerous.
:::

## Key points

- Free fall: only weight acts; acceleration $g$ (take 10 m s⁻² unless told otherwise), the same for all masses.
- Use the equations of motion with $a = \pm g$; choose a positive direction and keep to it.
- Thrown up: $t_{top} = u/g$, $H = u^2/2g$, time of flight $= 2u/g$.
- At the top: $v = 0$, $a = g$ downwards.
- With air resistance, a falling body reaches a constant terminal velocity.

## WASSCE examination focus

:::callout{type=waec-tests}
Objective items test **"the acceleration at the highest point"**, **time of flight** and **maximum height**. Theory items combine vertical motion with energy, or ask for the **velocity–time graph** of a ball thrown up and caught (a single straight line crossing the time axis, not a "V" shape). State your sign convention at the start.
:::

## Quick check

1. A stone is dropped from a bridge and hits the water 3 s later. How high is the bridge? ($g = 10$ m s⁻²)
2. A ball is thrown up at 20 m s⁻¹. What is its maximum height?
3. What is the velocity of the ball in question 2 after 3 s?

**Answers:** 1. $h = \tfrac{1}{2}(10)(9) = 45$ m. 2. $H = \dfrac{400}{20} = 20$ m. 3. $v = 20 - 30 = -10$ m s⁻¹: 10 m s⁻¹ downwards.
