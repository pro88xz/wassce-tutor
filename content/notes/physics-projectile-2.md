The exam versions of projectile questions add one twist: the launch and landing are at different heights, a target must be hit, or the equation of the path is wanted. Here is how to handle each.

## Learning objectives

By the end of this lesson you should be able to:

- solve projectile problems where launch and landing heights differ
- find the velocity (speed and direction) at any instant of the flight
- derive the equation of the trajectory and show that the path is a parabola
- explain the effect of air resistance on real projectiles

## Velocity at any instant

At time $t$ after launch at speed $u$ and angle θ:

$$v_x = u\cos\theta \qquad v_y = u\sin\theta - gt$$

$$v = \sqrt{v_x^2 + v_y^2} \qquad \tan\alpha = \dfrac{v_y}{v_x}$$

where α is the angle to the horizontal (above if $v_y > 0$, below if $v_y < 0$).

:::callout{type=worked-example}
**A stone is projected at 40 m s⁻¹ at 60° above the horizontal. Find its velocity 5 s later. ($g = 10$ m s⁻²)**

$v_x = 40\cos 60° = 20$ m s⁻¹

$v_y = 40\sin 60° - 10 \times 5 = 34.64 - 50 = -15.36$ m s⁻¹ (moving downwards)

$$v = \sqrt{20^2 + 15.36^2} = \sqrt{400 + 235.9} = 25.2\ \text{m s}^{-1}$$

$$\tan\alpha = \dfrac{15.36}{20} = 0.768 \Rightarrow \alpha = 37.5°\ \text{below the horizontal}$$
:::

## Launch above the landing level

When the body lands **below** its launch point, the time of flight is **not** $\dfrac{2u\sin\theta}{g}$. Use the vertical displacement equation with signs.

:::callout{type=worked-example}
**A ball is thrown from the top of a building 35 m high with velocity 30 m s⁻¹ at 30° above the horizontal. Find (a) the time it takes to hit the ground, (b) the horizontal distance from the building. ($g = 10$ m s⁻²)**

$u_x = 30\cos 30° = 25.98$ m s⁻¹, $u_y = 30\sin 30° = 15$ m s⁻¹.

(a) Up positive, origin at the launch point; the ground is at $y = -35$ m:

$$-35 = 15t - 5t^2 \Rightarrow t^2 - 3t - 7 = 0$$

$$t = \dfrac{3 + \sqrt{9 + 28}}{2} = \dfrac{3 + 6.083}{2} = 4.54\ \text{s}$$

(b) $x = 25.98 \times 4.54 = 118$ m.
:::

## The equation of the trajectory

Eliminate $t$ between $x = (u\cos\theta)t$ and $y = (u\sin\theta)t - \tfrac{1}{2}gt^2$.

From the first, $t = \dfrac{x}{u\cos\theta}$. Substitute:

$$y = x\tan\theta - \dfrac{g\,x^2}{2u^2\cos^2\theta}$$

This has the form $y = ax - bx^2$ with constants $a$ and $b$: the equation of a **parabola**. That is the proof that a projectile's path is parabolic.

:::callout{type=worked-example}
**Hitting a target.** A boy throws a stone at 20 m s⁻¹ at 45° to hit a mango 1.6 m above his hand, on a tree 30 m away horizontally. Does the stone pass above or below the mango?

At $x = 30$ m:

$$y = 30\tan 45° - \dfrac{10 \times 30^2}{2 \times 20^2 \times \cos^2 45°} = 30 - \dfrac{9000}{400} = 30 - 22.5 = 7.5\ \text{m}$$

The stone is 7.5 m above his hand when it reaches the tree: it passes about 5.9 m **above** the mango.
:::

## Effect of air resistance

Real projectiles feel air resistance, which acts against the velocity:

- the horizontal velocity **decreases** during flight
- the maximum height and the range are **smaller** than calculated
- the path is **not symmetrical**: the descent is steeper than the ascent
- the best angle for maximum range is **less than 45°** (for a football or shot put, typically 35°–43°)

:::callout{type=local-example}
Long throw-ins at a Sierra Leone Premier League match are usually launched lower than 45°: the player gains speed with a flatter release and air drag punishes high, slow throws.
:::

## Applications of projectile motion

- Sports: football, basketball, javelin, shot put, long jump
- Water from a fire hose or garden hose
- Dropping relief supplies from a moving aircraft: the package keeps the aircraft's horizontal velocity, so it must be released **before** the plane is over the target
- Firearms and artillery

:::callout{type=worked-example}
**A plane flying horizontally at 100 m s⁻¹, 500 m above the ground, drops a relief package. How far before the target must it be released? ($g = 10$ m s⁻²)**

Fall time: $500 = 5t^2 \Rightarrow t = 10$ s. Horizontal distance: $100 \times 10 = 1000$ m. Release it **1 km** before the target.
:::

## Key points

- At any instant: $v_x = u\cos\theta$, $v_y = u\sin\theta - gt$; combine with Pythagoras and $\tan$.
- When launch and landing heights differ, solve $y = u_y t - \tfrac{1}{2}gt^2$ with a signed $y$.
- Trajectory: $y = x\tan\theta - \dfrac{gx^2}{2u^2\cos^2\theta}$, a parabola.
- Air resistance reduces height and range and makes the path asymmetric.

## WASSCE examination focus

:::callout{type=waec-tests}
Theory questions may ask you to **show that the path is a parabola**, to find a **velocity at a given time**, or to solve a launch **from a building**. A common objective item: "A body is projected horizontally… which quantity remains constant?" (horizontal velocity). Watch the sign of the vertical displacement when the landing point is below the launch.
:::

## Quick check

1. What stays constant during a projectile's flight (no air resistance)?
2. A ball is thrown horizontally at 10 m s⁻¹ from 20 m up. Find its vertical velocity when it lands. ($g = 10$ m s⁻²)
3. Give two effects of air resistance on a projectile.

**Answers:** 1. The horizontal component of velocity (and the acceleration $g$). 2. $t = 2$ s, so $v_y = 20$ m s⁻¹ downwards. 3. For example: lower maximum height; shorter range; steeper descent; maximum range at less than 45°.
