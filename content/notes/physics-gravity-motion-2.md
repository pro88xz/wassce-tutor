The harder vertical-motion questions involve a body thrown from a height, a body released from something already moving, or two bodies meeting in the air. One sign convention, applied without exception, solves them all.

## Learning objectives

By the end of this lesson you should be able to:

- solve problems where a body is projected upwards from a height above the ground
- handle bodies released from moving objects such as balloons and lifts
- solve two-body meeting problems in vertical motion
- describe an experiment to measure $g$

## A body thrown up from a height

:::callout{type=worked-example}
**A boy standing on a roof 25 m above the ground throws a stone vertically upwards at 20 m s⁻¹. The stone just misses the roof on the way down. Find (a) the greatest height above the ground, (b) the time it takes to reach the ground, (c) its speed on impact. Take $g = 10$ m s⁻².**

Take **up as positive** and the **roof as the origin**.

(a) Height above the roof: $H = \dfrac{u^2}{2g} = \dfrac{400}{20} = 20$ m, so $25 + 20 = 45$ m above the ground.

(b) The ground is at displacement $s = -25$ m from the roof:

$$-25 = 20t - 5t^2 \Rightarrow 5t^2 - 20t - 25 = 0 \Rightarrow t^2 - 4t - 5 = 0$$

$$(t - 5)(t + 1) = 0 \Rightarrow t = 5\ \text{s}$$

(c) $v = u - gt = 20 - 50 = -30$ m s⁻¹: **30 m s⁻¹ downwards**.

Check: $v^2 = u^2 - 2gs = 400 - 2(10)(-25) = 900$. ✓
:::

:::callout{type=common-mistake}
The commonest error is mixing signs: writing $s = +25$ for a point **below** the start while taking up as positive. Fix the origin and positive direction first, and give every displacement, velocity and acceleration its sign.
:::

## Releasing a body from something that is moving

A body released from a moving object starts with **the velocity of that object**.

:::callout{type=worked-example}
**A balloon is rising steadily at 5 m s⁻¹. When it is 30 m above the ground, a sandbag is released. How long does the sandbag take to reach the ground? ($g = 10$ m s⁻²)**

At release the sandbag moves **upwards at 5 m s⁻¹** (it was moving with the balloon). Up positive, origin at the release point, ground at $s = -30$ m:

$$-30 = 5t - 5t^2 \Rightarrow t^2 - t - 6 = 0 \Rightarrow (t - 3)(t + 2) = 0$$

$t = 3$ s. It first rises a little, stops, and then falls.
:::

## Two bodies meeting

:::callout{type=worked-example}
**A ball A is dropped from the top of a tower 80 m high. At the same instant, ball B is thrown vertically upwards from the foot of the tower at 40 m s⁻¹. When and where do they meet? ($g = 10$ m s⁻²)**

Measure heights upwards from the ground.

- Ball A: $h_A = 80 - 5t^2$
- Ball B: $h_B = 40t - 5t^2$

At the meeting point $h_A = h_B$:

$$80 - 5t^2 = 40t - 5t^2 \Rightarrow 40t = 80 \Rightarrow t = 2\ \text{s}$$

Height: $h = 80 - 5(2)^2 = 60$ m above the ground.

The $5t^2$ terms cancel: **both** balls accelerate downwards at $g$, so relative to each other they move at a constant 40 m s⁻¹, closing the 80 m gap in 2 s.
:::

## Measuring $g$ in the laboratory

**Method 1: simple pendulum** (the usual WASSCE practical).

1. Suspend a small heavy bob on a light inextensible thread from a split cork in a clamp.
2. Measure the length $l$ from the point of suspension to the centre of the bob.
3. Displace the bob through a small angle (less than about 10°) and release it.
4. Time **20 oscillations** with a stopwatch; repeat and average. Find the period $T = \dfrac{t}{20}$.
5. Repeat for five or six different lengths.
6. Plot $T^2$ (y-axis) against $l$ (x-axis). The graph is a straight line through the origin with gradient $\dfrac{4\pi^2}{g}$, so

$$g = \dfrac{4\pi^2}{\text{gradient}}$$

**Precautions:** small angle of swing; timing many oscillations to reduce the effect of reaction time; starting the stopwatch as the bob passes the **centre** (lowest point) where it moves fastest; avoiding draughts; ensuring the bob swings in a vertical plane and does not spin.

**Method 2: free fall.** An electromagnet holds a steel ball above a trapdoor; an electronic timer starts when the magnet is switched off and stops when the ball opens the trapdoor. Measuring $t$ for several heights $h$ and plotting $h$ against $t^2$ gives a straight line of gradient $\tfrac{1}{2}g$.

## Key points

- Set an origin and a positive direction, then sign every quantity; the quadratic will handle "up then down" automatically.
- A body released from a moving object starts with that object's velocity.
- For two bodies in free fall, the $\tfrac{1}{2}gt^2$ terms cancel: they close the gap at constant relative speed.
- Pendulum method: plot $T^2$ against $l$; $g = 4\pi^2 / \text{gradient}$.

## WASSCE examination focus

:::callout{type=waec-tests}
Theory questions often add a twist: thrown **from a cliff or building**, released from a **rising balloon or lift**, or **two balls meeting**. The practical paper frequently asks you to determine $g$ with a simple pendulum: tabulate $l$, $t$ for 20 oscillations, $T$, $T^2$; plot $T^2$ against $l$; find the gradient using a large triangle; state two precautions.
:::

## Quick check

1. A stone is thrown down at 5 m s⁻¹ from a cliff 60 m high. How long does it take to reach the sea? ($g = 10$ m s⁻²)
2. A lift moves up at 2 m s⁻¹. A bolt falls from its ceiling. What is the bolt's initial velocity relative to the ground?
3. Why is the period of a pendulum found by timing 20 oscillations rather than one?

**Answers:** 1. Down positive: $60 = 5t + 5t^2 \Rightarrow t^2 + t - 12 = 0 \Rightarrow t = 3$ s. 2. 2 m s⁻¹ upwards. 3. It reduces the percentage error caused by reaction time in starting and stopping the watch.
