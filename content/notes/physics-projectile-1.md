A footballer's long pass, water from a hose, a stone from a catapult: all follow the same curved path. The secret is to stop looking at the curve and look at two separate, simple motions happening at once.

## Learning objectives

By the end of this lesson you should be able to:

- define a projectile and describe its path
- explain why horizontal and vertical motions are treated independently
- solve problems on bodies projected horizontally from a height
- calculate time of flight, maximum height and range for a body projected at an angle

## What is a projectile?

:::callout{type=definition}
A **projectile** is a body thrown into the air that then moves under the action of **gravity alone** (air resistance neglected). Its path is called its **trajectory**; it is a **parabola**.
:::

## Two independent motions

![Parabolic path of a projectile: horizontal velocity arrows stay the same length along the path; vertical velocity arrows shrink to zero at the top and grow downwards after it](https://wasscetutor.com/img/physics/projectile-path.svg)

*Figure 1. The horizontal velocity never changes; the vertical velocity changes by $g$ every second. WASSCE Tutor diagram.*

| | Horizontal motion | Vertical motion |
|---|---|---|
| Force acting | none (no air resistance) | weight, downwards |
| Acceleration | **0** | **$g$ downwards** |
| Velocity | **constant** | changes by $g$ each second |
| Equation | $x = u_x t$ | $y = u_y t - \tfrac{1}{2}gt^2$ |

The two motions share only one thing: **time**. Find the time from one motion and use it in the other.

:::callout{type=local-example}
Drop one orange from your hand and, at the same moment, flick another horizontally off the table edge at the same height. They hit the floor **together**. The horizontal flick does not delay the fall, because vertical and horizontal motions are independent.
:::

## Case 1: projected horizontally from a height

Initial velocity $u$ is horizontal, so $u_x = u$ and $u_y = 0$.

- Time to fall height $h$: $h = \tfrac{1}{2}gt^2 \Rightarrow t = \sqrt{\dfrac{2h}{g}}$
- Horizontal distance: $x = ut$
- Velocity on landing: horizontal $u$, vertical $gt$; speed $= \sqrt{u^2 + (gt)^2}$

:::callout{type=worked-example}
**A stone is thrown horizontally at 15 m s⁻¹ from the top of a cliff 45 m high. Find (a) the time to reach the ground, (b) how far from the foot of the cliff it lands, (c) its speed on impact. ($g = 10$ m s⁻²)**

(a) $45 = \tfrac{1}{2}(10)t^2 \Rightarrow t^2 = 9 \Rightarrow t = 3$ s.

(b) $x = 15 \times 3 = 45$ m.

(c) Vertical velocity $= 10 \times 3 = 30$ m s⁻¹; horizontal $= 15$ m s⁻¹.

$$v = \sqrt{15^2 + 30^2} = \sqrt{1125} = 33.5\ \text{m s}^{-1}$$

at $\tan^{-1}(30/15) = 63.4°$ below the horizontal.
:::

## Case 2: projected at an angle θ from the ground

Resolve the initial velocity:

$$u_x = u\cos\theta \qquad u_y = u\sin\theta$$

| Quantity | Formula | Reason |
|---|---|---|
| Time to the highest point | $t = \dfrac{u\sin\theta}{g}$ | vertical velocity becomes zero |
| Maximum height | $H = \dfrac{u^2\sin^2\theta}{2g}$ | $0 = (u\sin\theta)^2 - 2gH$ |
| Time of flight | $T = \dfrac{2u\sin\theta}{g}$ | back to launch height |
| Horizontal range | $R = \dfrac{u^2\sin 2\theta}{g}$ | $R = u\cos\theta \times T$ |

The range formula comes from $R = u\cos\theta \times \dfrac{2u\sin\theta}{g} = \dfrac{u^2(2\sin\theta\cos\theta)}{g}$ and $2\sin\theta\cos\theta = \sin 2\theta$.

:::callout{type=worked-example}
**A ball is kicked from the ground at 20 m s⁻¹ at 30° to the horizontal. Find (a) the time of flight, (b) the maximum height, (c) the range. ($g = 10$ m s⁻²)**

$u_x = 20\cos 30° = 17.32$ m s⁻¹, $u_y = 20\sin 30° = 10$ m s⁻¹.

(a) $T = \dfrac{2 \times 10}{10} = 2$ s.

(b) $H = \dfrac{10^2}{2 \times 10} = 5$ m.

(c) $R = 17.32 \times 2 = 34.6$ m (or $\dfrac{400 \times \sin 60°}{10} = 34.6$ m).
:::

## Maximum range

$\sin 2\theta$ is largest (equal to 1) when $2\theta = 90°$, that is **θ = 45°**:

$$R_{max} = \dfrac{u^2}{g}$$

Angles that add up to 90° (such as 30° and 60°) give the **same range**, because $\sin 60° = \sin 120°$. The steeper throw goes higher and stays in the air longer.

:::callout{type=common-mistake}
At the highest point the projectile is **not** at rest. Its vertical velocity is zero, but its horizontal velocity $u\cos\theta$ is unchanged. Its speed at the top is $u\cos\theta$, its smallest speed in the whole flight.
:::

## Key points

- A projectile moves under gravity alone; its path is a parabola.
- Horizontal: constant velocity $u\cos\theta$. Vertical: acceleration $g$ downwards. Time links them.
- Horizontal launch from height $h$: $t = \sqrt{2h/g}$, range $= ut$.
- At angle θ: $T = \dfrac{2u\sin\theta}{g}$, $H = \dfrac{u^2\sin^2\theta}{2g}$, $R = \dfrac{u^2\sin 2\theta}{g}$; maximum range at 45°.

## WASSCE examination focus

:::callout{type=waec-tests}
Objective items ask for **the angle of maximum range**, **the velocity at the highest point**, or the **time of flight**. Theory items give a horizontal launch from a cliff or table, or a launch at an angle, and ask for time, range and impact velocity. Resolve the velocity first and keep horizontal and vertical working in separate columns.
:::

## Quick check

1. What is the vertical acceleration of a projectile at the top of its path?
2. A ball rolls off a table 1.25 m high at 4 m s⁻¹. How far from the table does it land? ($g = 10$ m s⁻²)
3. Which angle of projection gives the same range as 25°?

**Answers:** 1. $g$ (10 m s⁻²) downwards. 2. $t = \sqrt{2(1.25)/10} = 0.5$ s; distance $= 4 \times 0.5 = 2$ m. 3. 65°.
