Once you know a body moves with SHM, you can predict its velocity, acceleration and energy at every point. This lesson gives the equations, the energy changes, and what happens when friction (damping) or an outside push (forcing) joins in.

## Learning objectives

By the end of this lesson you should be able to:

- use the equations for displacement, velocity and acceleration in SHM
- describe the energy changes in an oscillating system
- distinguish free, damped and forced oscillations and explain resonance
- determine the spring constant and $g$ from oscillation experiments

## Equations of SHM

If timing starts at the equilibrium position:

$$x = A\sin\omega t$$

Then the velocity and acceleration are

$$v = A\omega\cos\omega t \qquad a = -A\omega^2\sin\omega t = -\omega^2 x$$

Useful results:

- Maximum speed (at the centre): $v_{max} = A\omega$
- Maximum acceleration (at the ends): $a_{max} = A\omega^2$
- Speed at displacement $x$: $v = \omega\sqrt{A^2 - x^2}$

:::callout{type=worked-example}
**A body moves with SHM of amplitude 0.05 m and frequency 2 Hz. Find (a) the maximum speed, (b) the maximum acceleration, (c) the speed when the displacement is 0.03 m.**

$\omega = 2\pi f = 4\pi = 12.57$ rad s⁻¹.

(a) $v_{max} = A\omega = 0.05 \times 12.57 = 0.628$ m s⁻¹.

(b) $a_{max} = A\omega^2 = 0.05 \times 12.57^2 = 7.90$ m s⁻².

(c) $v = \omega\sqrt{A^2 - x^2} = 12.57\sqrt{0.0025 - 0.0009} = 12.57 \times 0.04 = 0.503$ m s⁻¹.
:::

## Energy in SHM

In an undamped oscillation, energy changes continually between **kinetic** and **potential**, while the **total stays constant**.

| Position | Kinetic energy | Potential energy |
|---|---|---|
| Centre | maximum | minimum |
| Extremes | zero | maximum |

For a mass on a spring, the total energy is $E = \tfrac{1}{2}kA^2$: it depends on the **square** of the amplitude. Doubling the amplitude quadruples the energy.

For a pendulum, the bob's potential energy is greatest at the top of each swing and its kinetic energy at the bottom: $\tfrac{1}{2}mv_{max}^2 = mgh$, where $h$ is the height gained.

:::callout{type=worked-example}
**A pendulum bob is released from a point 0.2 m above its lowest position. Find its speed at the lowest point. ($g = 10$ m s⁻²)**

$$\tfrac{1}{2}mv^2 = mgh \Rightarrow v = \sqrt{2gh} = \sqrt{2 \times 10 \times 0.2} = 2\ \text{m s}^{-1}$$
:::

## Free, damped and forced oscillations

:::callout{type=definition}
- **Free oscillation:** a system vibrates at its own **natural frequency** with no energy lost (an ideal case).
- **Damped oscillation:** the amplitude **decreases** with time because energy is lost to friction or air resistance.
- **Forced oscillation:** a system is made to vibrate by a **periodic external force**, at the frequency of that force.
:::

**Damping** is useful in car shock absorbers, which stop a car bouncing after it goes over a pothole, and in the needles of meters, which settle quickly instead of swinging.

### Resonance

:::callout{type=definition}
**Resonance** occurs when a body is made to vibrate by a periodic force whose **frequency equals its natural frequency**. The amplitude of vibration then becomes **very large**.
:::

Examples:

- pushing a swing in time with its natural swing
- soldiers break step when crossing a bridge so they do not set it resonating
- a glass shattered by a singer's note of exactly the right pitch
- tuning a radio: the circuit resonates with the frequency of the wanted station

## Experiment: spring constant by oscillation

1. Hang a spring from a clamp and attach a mass hanger.
2. Add a mass $m$; pull it down slightly and release.
3. Time 20 oscillations; find $T$. Repeat for several masses.
4. Plot $T^2$ against $m$. Since $T^2 = \dfrac{4\pi^2}{k}m$, the graph is a straight line through the origin with gradient $\dfrac{4\pi^2}{k}$:

$$k = \dfrac{4\pi^2}{\text{gradient}}$$

**Precautions:** small amplitude; spring not stretched beyond its elastic limit; mass oscillates vertically without swinging; time many oscillations.

## Key points

- $x = A\sin\omega t$, $v_{max} = A\omega$, $a_{max} = A\omega^2$, $v = \omega\sqrt{A^2 - x^2}$.
- Energy swaps between KE and PE; total energy ∝ amplitude².
- Damping reduces amplitude; forcing makes a system vibrate at the driving frequency.
- Resonance: driving frequency = natural frequency, giving a large amplitude.
- $T^2$ against $m$ for a spring gives $k = 4\pi^2/\text{gradient}$.

## WASSCE examination focus

:::callout{type=waec-tests}
Theory questions ask for **energy changes** in a pendulum or spring, **definitions of damped and forced oscillations and resonance** with examples, and calculations of **maximum speed or acceleration**. The practical paper often uses a loaded spring or pendulum: tabulate, plot $T^2$ against $m$ (or $l$), find the gradient and deduce $k$ (or $g$).
:::

## Quick check

1. Where in its oscillation does a pendulum bob have maximum kinetic energy?
2. A body in SHM has amplitude 0.1 m and $\omega = 5$ rad s⁻¹. Find its maximum speed.
3. Why do soldiers break step when marching across a bridge?

**Answers:** 1. At the lowest point (the equilibrium position). 2. $0.1 \times 5 = 0.5$ m s⁻¹. 3. To avoid making the bridge vibrate at its natural frequency, which could cause dangerous resonance.
