A driver sees a child step onto the road 40 m ahead. Will the car stop in time? Three short equations answer that question exactly, and they are among the most tested results in WASSCE Physics.

## Learning objectives

By the end of this lesson you should be able to:

- state the conditions under which the equations of motion apply
- derive the four equations of uniformly accelerated motion from a velocity–time graph
- choose the right equation for a problem and solve it with correct units

## The quantities and their symbols

| Symbol | Quantity | SI unit |
|---|---|---|
| $u$ | initial velocity | m s⁻¹ |
| $v$ | final velocity | m s⁻¹ |
| $a$ | acceleration (constant) | m s⁻² |
| $t$ | time taken | s |
| $s$ | displacement | m |

:::callout{type=definition}
The equations of motion apply only to motion in a **straight line** with **uniform (constant) acceleration**. If the acceleration changes, they cannot be used.
:::

A negative acceleration (deceleration or retardation) is allowed: it simply means the body is slowing down in the positive direction.

## Deriving the equations from a velocity–time graph

![Velocity-time graph rising in a straight line from u to v over time t; the gradient is the acceleration and the shaded trapezium under the line is the displacement](https://wasscetutor.com/img/physics/vt-uniform-acceleration.svg)

*Figure 1. Velocity–time graph for uniform acceleration. WASSCE Tutor diagram.*

**First equation.** The gradient of a velocity–time graph is the acceleration:

$$a = \dfrac{v - u}{t} \quad\Longrightarrow\quad \boxed{v = u + at}$$

**Second equation.** The area under the graph is the displacement. The area is a trapezium:

$$s = \tfrac{1}{2}(\text{sum of parallel sides}) \times \text{width} \quad\Longrightarrow\quad \boxed{s = \dfrac{(u + v)}{2}\,t}$$

**Third equation.** Substitute $v = u + at$ into the second:

$$s = \dfrac{u + (u + at)}{2}\,t \quad\Longrightarrow\quad \boxed{s = ut + \tfrac{1}{2}at^2}$$

(Equivalently, the area is a rectangle $ut$ plus a triangle $\tfrac{1}{2} \times t \times at$.)

**Fourth equation.** From the first, $t = \dfrac{v - u}{a}$. Substitute into the second:

$$s = \dfrac{(u + v)}{2} \times \dfrac{(v - u)}{a} = \dfrac{v^2 - u^2}{2a} \quad\Longrightarrow\quad \boxed{v^2 = u^2 + 2as}$$

:::callout{type=waec-tests}
"**Derive** $v^2 = u^2 + 2as$" and "**Show that** $s = ut + \tfrac{1}{2}at^2$" are common theory questions worth 3–4 marks. Start from the graph (or from the definitions of acceleration and average velocity) and show every substitution.
:::

## Choosing the right equation

Each equation leaves out one of the five quantities. List what you know and what you want; pick the equation that does **not** contain the quantity you neither know nor need.

| Equation | Quantity it does **not** contain |
|---|---|
| $v = u + at$ | $s$ |
| $s = \tfrac{1}{2}(u + v)t$ | $a$ |
| $s = ut + \tfrac{1}{2}at^2$ | $v$ |
| $v^2 = u^2 + 2as$ | $t$ |

:::callout{type=common-mistake}
"Starts from rest" means $u = 0$. "Comes to rest" or "stops" means $v = 0$. "Uniform velocity" means $a = 0$. Write these down before you start; many lost marks come from reading the question too quickly.
:::

## Worked examples

:::callout{type=worked-example}
**1. A minibus starts from rest and accelerates uniformly at 2 m s⁻² for 8 s. Find its final velocity and the distance covered.**

Known: $u = 0$, $a = 2$ m s⁻², $t = 8$ s.

$$v = u + at = 0 + 2 \times 8 = 16\ \text{m s}^{-1}$$

$$s = ut + \tfrac{1}{2}at^2 = 0 + \tfrac{1}{2} \times 2 \times 8^2 = 64\ \text{m}$$
:::

:::callout{type=worked-example}
**2. A car travelling at 20 m s⁻¹ brakes and stops in 40 m. Find the deceleration and the time taken to stop.**

Known: $u = 20$, $v = 0$, $s = 40$. Want $a$ (time not given): use $v^2 = u^2 + 2as$.

$$0 = 20^2 + 2a(40) \Rightarrow a = -\dfrac{400}{80} = -5\ \text{m s}^{-2}$$

The deceleration is **5 m s⁻²**. Time: $v = u + at \Rightarrow 0 = 20 - 5t \Rightarrow t = 4$ s.

Check with $s = \tfrac{1}{2}(u + v)t = \tfrac{1}{2}(20)(4) = 40$ m. ✓
:::

:::callout{type=worked-example}
**3. A motorcycle moving at 10 m s⁻¹ accelerates uniformly at 1.5 m s⁻² over a distance of 100 m. Find its final velocity.**

$$v^2 = u^2 + 2as = 10^2 + 2(1.5)(100) = 100 + 300 = 400$$

$$v = 20\ \text{m s}^{-1}$$
:::

:::callout{type=worked-example}
**4. A body moving with uniform acceleration covers 30 m in the 3rd second and 40 m in the 5th second. Find its acceleration and initial velocity.**

Distance in the $n$th second $= s_n - s_{n-1} = u + \tfrac{1}{2}a(2n - 1)$.

- 3rd second: $u + \tfrac{5}{2}a = 30$
- 5th second: $u + \tfrac{9}{2}a = 40$

Subtract: $2a = 10 \Rightarrow a = 5$ m s⁻². Then $u = 30 - 12.5 = 17.5$ m s⁻¹.
:::

## Back to the driver and the child

:::callout{type=local-example}
A taxi on Wilkinson Road is travelling at 15 m s⁻¹ (54 km h⁻¹). The driver reacts after 0.7 s, then brakes at 6 m s⁻².

- Thinking distance (no braking yet): $15 \times 0.7 = 10.5$ m.
- Braking distance: $0 = 15^2 - 2(6)s \Rightarrow s = \dfrac{225}{12} = 18.75$ m.
- Stopping distance: $10.5 + 18.75 = 29.25$ m.

The taxi stops about 11 m short of the child 40 m ahead. At 25 m s⁻¹ (90 km h⁻¹) the stopping distance becomes $17.5 + 52.1 = 69.6$ m: it would not stop in time. Doubling speed roughly **quadruples** braking distance, because $s = \dfrac{u^2}{2a}$.
:::

## Key points

- The equations apply to **straight-line motion with constant acceleration** only.
- $v = u + at$, $s = \tfrac{1}{2}(u + v)t$, $s = ut + \tfrac{1}{2}at^2$, $v^2 = u^2 + 2as$.
- Pick the equation that leaves out the quantity you do not need.
- Deceleration gives a negative $a$; braking distance is proportional to $u^2$.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect at least one calculation per paper: **stopping distances**, **distance in the $n$th second**, or **two-stage journeys** read from a velocity–time graph. Write the list of knowns ($u$, $v$, $a$, $s$, $t$) first, quote the equation, substitute with units and box the answer. Derivations of the equations are a favourite short theory item.
:::

## Quick check

1. A ball rolls from rest down a slope with acceleration 4 m s⁻². How far does it go in 5 s?
2. A train slows from 30 m s⁻¹ to 10 m s⁻¹ over 400 m. Find the deceleration.
3. Which equation would you use if the time is neither given nor asked for?

**Answers:** 1. $s = \tfrac{1}{2}(4)(25) = 50$ m. 2. $10^2 = 30^2 + 2a(400) \Rightarrow a = -1$ m s⁻², a deceleration of 1 m s⁻². 3. $v^2 = u^2 + 2as$.
