The same mathematics that keeps a stone on a string keeps a satellite in orbit and the Earth around the Sun. This lesson extends circular motion to vertical circles and banked roads, then to Newton's law of gravitation, satellites and escape velocity.

## Learning objectives

By the end of this lesson you should be able to:

- analyse motion in a vertical circle and on a banked track
- state Newton's law of universal gravitation and use it
- relate $g$ to the mass and radius of the Earth
- calculate orbital speed, the period of a satellite and escape velocity

## Motion in a vertical circle

A bucket of water swung in a vertical circle on a rope: at the **top**, both the tension $T$ and the weight $mg$ point down, towards the centre:

$$T + mg = \dfrac{mv^2}{r}$$

The tension is least at the top. The bucket just completes the circle (the water does not fall out) when $T = 0$ at the top:

$$mg = \dfrac{mv^2}{r} \Rightarrow v_{min} = \sqrt{gr}$$

At the **bottom**, tension acts up (to the centre) and weight down:

$$T - mg = \dfrac{mv^2}{r} \Rightarrow T = mg + \dfrac{mv^2}{r}$$

The tension, and the strain on the rope, is greatest at the bottom.

:::callout{type=worked-example}
**What is the minimum speed at the top of a vertical circle of radius 0.9 m for the water to stay in the bucket? ($g = 10$ m s⁻²)**

$$v_{min} = \sqrt{gr} = \sqrt{10 \times 0.9} = 3\ \text{m s}^{-1}$$
:::

## Banked roads

On a curve, friction alone may not provide enough centripetal force. A road **banked** at angle θ tilts the normal reaction $R$ so that its horizontal component points towards the centre. With no friction needed:

$$R\sin\theta = \dfrac{mv^2}{r}, \qquad R\cos\theta = mg \Rightarrow \tan\theta = \dfrac{v^2}{rg}$$

:::callout{type=worked-example}
**At what angle should a curve of radius 100 m be banked for vehicles travelling at 20 m s⁻¹ to need no friction? ($g = 10$ m s⁻²)**

$$\tan\theta = \dfrac{20^2}{100 \times 10} = 0.4 \Rightarrow \theta = 21.8°$$
:::

## Newton's law of universal gravitation

:::callout{type=definition}
**Newton's law of universal gravitation:** every particle in the universe attracts every other particle with a force that is **directly proportional to the product of their masses** and **inversely proportional to the square of the distance between them**:

$$F = \dfrac{G\,m_1 m_2}{r^2}$$

where $G = 6.67 \times 10^{-11}$ N m² kg⁻² is the universal gravitational constant.
:::

The force is always attractive and acts along the line joining the masses. Doubling the distance makes the force **four times smaller** (inverse square law).

### $g$ and the Earth

The weight of a mass $m$ on the Earth's surface is the gravitational pull of the Earth (mass $M$, radius $R$):

$$mg = \dfrac{GMm}{R^2} \Rightarrow g = \dfrac{GM}{R^2}$$

So $g$ is **independent of $m$**, and it decreases with height: at a distance $r$ from the Earth's centre, $g_r = g\dfrac{R^2}{r^2}$.

:::callout{type=worked-example}
**Taking $g = 9.8$ m s⁻², $R = 6.4 \times 10^{6}$ m and $G = 6.67 \times 10^{-11}$ N m² kg⁻², estimate the mass of the Earth.**

$$M = \dfrac{gR^2}{G} = \dfrac{9.8 \times (6.4 \times 10^{6})^2}{6.67 \times 10^{-11}} = 6.0 \times 10^{24}\ \text{kg}$$
:::

## Satellites

For a satellite in a circular orbit of radius $r$, gravity provides the centripetal force:

$$\dfrac{GMm}{r^2} = \dfrac{mv^2}{r} \Rightarrow v = \sqrt{\dfrac{GM}{r}} = \sqrt{g_r r}$$

Close to the Earth's surface ($r \approx R$), $v = \sqrt{gR} = \sqrt{9.8 \times 6.4 \times 10^{6}} \approx 7.9$ km s⁻¹. The period of such an orbit is $T = \dfrac{2\pi R}{v} \approx 85$ minutes.

:::callout{type=definition}
A **geostationary (parking) satellite** orbits above the equator, from west to east, with a period of **24 hours**, so it stays above the same point on the Earth. Its orbit is about 36 000 km above the surface. Such satellites carry television and communication signals.
:::

:::callout{type=local-example}
Satellite television dishes on rooftops across Freetown all point in nearly the same fixed direction: towards geostationary satellites that never move across the sky, so the dish never needs to track them.
:::

Astronauts in an orbiting spacecraft feel **weightless** not because gravity has vanished, but because they and the craft are falling freely together around the Earth.

## Escape velocity

:::callout{type=definition}
**Escape velocity** is the minimum speed with which a body must be projected from the surface of a planet to escape completely from its gravitational field:

$$v_e = \sqrt{\dfrac{2GM}{R}} = \sqrt{2gR}$$
:::

For the Earth, $v_e = \sqrt{2 \times 9.8 \times 6.4 \times 10^{6}} \approx 11.2$ km s⁻¹. It does not depend on the mass of the body launched.

## Key terms

:::callout{type=definition title="Key terms"}
- **Orbital speed**: the speed a satellite needs to stay in orbit; near the Earth's surface about 7.9 km s⁻¹.
- **Geostationary satellite**: a satellite above the equator with a period of 24 hours, so it stays over the same place.
- **Gravitational constant**: the constant $G$ in Newton's law of universal gravitation.
:::

## Key points

- Vertical circle: tension is least at the top; minimum speed at the top is $\sqrt{gr}$.
- Banked road with no friction: $\tan\theta = \dfrac{v^2}{rg}$.
- $F = \dfrac{Gm_1m_2}{r^2}$; $g = \dfrac{GM}{R^2}$.
- Orbital speed $v = \sqrt{GM/r}$; near the surface about 7.9 km s⁻¹. Escape velocity $\sqrt{2gR} \approx 11.2$ km s⁻¹.
- Geostationary satellites: period 24 h, above the equator.

## WASSCE examination focus

:::callout{type=waec-tests}
**State Newton's law of universal gravitation**, derive $g = GM/R^2$, and calculate **escape velocity** or **orbital speed**. Objective questions ask about **geostationary satellites** (period 24 h) and **weightlessness**. Show the equation "gravitational force = centripetal force" as the first line of any satellite calculation.
:::

## Quick check

1. If the distance between two masses is tripled, by what factor does the gravitational force change?
2. State the period of a geostationary satellite.
3. Find the escape velocity from a planet with $g = 4$ m s⁻² and radius $2 \times 10^{6}$ m.

**Answers:** 1. It becomes $\tfrac{1}{9}$ as large. 2. 24 hours. 3. $\sqrt{2 \times 4 \times 2 \times 10^{6}} = 4000$ m s⁻¹.
