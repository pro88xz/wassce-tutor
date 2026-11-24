A **bearing** gives a direction as an angle, so that a pilot, a ship's captain or a surveyor can say exactly which way to go. Bearings questions are among the longest in WASSCE Paper 2: a journey in two or more stages, a sketch with north lines, and then Pythagoras or the sine and cosine rules to find a distance and a bearing. They reward a careful method more than any other topic. This lesson teaches the rules for bearings, how to draw a clear sketch, and how to solve both right-angled and non-right-angled journeys.

## Learning objectives

By the end of this lesson you should be able to:

- write three-figure bearings and convert compass bearings
- find a back bearing (the bearing of A from B, given that of B from A)
- draw an accurate sketch of a journey with north lines
- find distances and bearings with Pythagoras, trigonometry and the sine and cosine rules

## Three-figure bearings

:::callout{type=definition}
A **three-figure bearing**:

1. is measured **from north**,
2. **clockwise**,
3. written with **three figures**: $060°$, not $60°$; $005°$, not $5°$.

Bearings run from $000°$ to $360°$. East is $090°$, south $180°$, west $270°$.
:::

![Left: from P, the bearing of Q is 060°, measured clockwise from north. Right: from Q, the bearing of P is 240°, the back bearing, 180° more](https://wasscetutor.com/img/mathematics/bearings-compass.svg)

### Compass bearings

Some questions use **compass bearings** such as N $30°$ E: start facing north (or south), then turn towards east (or west).

| Compass bearing | Three-figure bearing |
|---|---|
| N $30°$ E | $030°$ |
| S $40°$ E | $180° - 40° = 140°$ |
| S $20°$ W | $180° + 20° = 200°$ |
| N $70°$ W | $360° - 70° = 290°$ |

## Back bearings

:::callout{type=definition}
If the bearing of B from A is $\theta$, the bearing of A from B is:

- $\theta + 180°$ if $\theta < 180°$
- $\theta - 180°$ if $\theta \ge 180°$
:::

:::callout{type=worked-example}
**(a) The bearing of Q from P is $060°$. Find the bearing of P from Q. (b) The bearing of X from Y is $295°$. Find the bearing of Y from X.**

**(a)** $060° + 180° = 240°$. **(b)** $295° - 180° = 115°$.
:::

:::callout{type=common-mistake}
**"The bearing of A from B."** The point after **from** is where you stand: draw the north line **at B** and measure to A. Reading it the wrong way round gives the back bearing, which is $180°$ out.
:::

## Drawing the sketch

1. Draw a **north line at every point** where a direction changes.
2. Mark each bearing **clockwise from its north line**.
3. Use **parallel north lines** to find angles inside the triangle (co-interior angles add up to $180°$, alternate angles are equal).
4. Label all distances.

## A journey with a right angle

![A boat sails 8 km from A to B on 060°, then 6 km from B to C on 150°; the angle at B is 90°, AC = 10 km and the bearing of C from A is about 097°](https://wasscetutor.com/img/mathematics/bearings-journey.svg)

:::callout{type=worked-example}
**A boat sails 8 km from A to B on a bearing of $060°$, then 6 km from B to C on a bearing of $150°$. Find (a) the distance AC, (b) the bearing of C from A.**

**Angle at B.** The bearing of A from B is $060° + 180° = 240°$ and the bearing of C from B is $150°$, so $\angle ABC = 240° - 150° = 90°$.

**(a)** By Pythagoras: $AC = \sqrt{8^2 + 6^2} = \sqrt{100} = 10$ km.

**(b)** $\tan\angle BAC = \dfrac68 \Rightarrow \angle BAC = 36.9°$.

Bearing of C from A $= 060° + 36.9° = 096.9° \approx$ **$097°$**.
:::

## A journey without a right angle

When the angle inside the triangle is not $90°$, use the **cosine rule** for the distance and the **sine rule** for the angle.

:::callout{type=worked-example}
**A ship sails 12 km from P to Q on a bearing of $040°$, then 9 km from Q to R on a bearing of $110°$. Find (a) PR, (b) the bearing of R from P.**

**Angle at Q.** The bearing of P from Q is $040° + 180° = 220°$. The bearing of R from Q is $110°$. So $\angle PQR = 220° - 110° = 110°$.

**(a) Cosine rule:**

$$PR^2 = 12^2 + 9^2 - 2(12)(9)\cos 110° = 225 + 73.9 = 298.9 \;\Rightarrow\; PR = 17.3 \text{ km}$$

**(b) Sine rule** for $\angle QPR$:

$$\frac{\sin\angle QPR}{9} = \frac{\sin 110°}{17.29} \;\Rightarrow\; \sin\angle QPR = \frac{9 \times 0.9397}{17.29} = 0.4892 \;\Rightarrow\; \angle QPR = 29.3°$$

Bearing of R from P $= 040° + 29.3° = $ **$069.3°$**.
:::

:::callout{type=tip}
**$\cos$ of an obtuse angle is negative**, so $-2bc\cos 110°$ becomes a **plus**: $-216 \times (-0.342) = +73.9$. The side opposite an obtuse angle must be the **longest** side, which is a quick check: $17.3 > 12$.
:::

### Another method: north and east components

Each leg of a journey can be split into an **east** part ($d\sin\theta$) and a **north** part ($d\cos\theta$), where $\theta$ is the bearing:

| Leg | East ($d\sin\theta$) | North ($d\cos\theta$) |
|---|---|---|
| 12 km on $040°$ | $7.71$ | $9.19$ |
| 9 km on $110°$ | $8.46$ | $-3.08$ |
| **total** | **$16.17$** | **$6.11$** |

$PR = \sqrt{16.17^2 + 6.11^2} = 17.3$ km, and the bearing is $\tan^{-1}\dfrac{16.17}{6.11} = 069.3°$: the same answers.

:::callout{type=local-example}
**A fishing boat leaves Tombo.** It sails 5 km on a bearing of $200°$ to its nets, then 12 km on a bearing of $290°$ to a fishing ground. The boat turns through $290° - 200° = 90°$ at the nets, so the angle there is a right angle and the fishing ground is $\sqrt{5^2 + 12^2} = 13$ km from Tombo in a straight line. The skipper needs that distance and bearing to come home quickly if the weather turns.
:::

## Practice

:::reveal{title="1. Write as three-figure bearings: (a) N 15° E (b) S 35° W (c) N 80° W."}
(a) $015°$ (b) $215°$ (c) $280°$.
:::

:::reveal{title="2. The bearing of B from A is 312°. Find the bearing of A from B."}
$312° - 180° = 132°$.
:::

:::reveal{title="3. A man walks 3 km due east and then 4 km due north. Find his distance and bearing from the start."}
Distance $= 5$ km. Angle from north: $\tan^{-1}\dfrac34 = 36.9°$, so the bearing is $036.9° \approx 037°$.
:::

:::reveal{title="4. In the Tombo example, find the bearing of the fishing ground from Tombo."}
Let T be Tombo, N the nets, F the fishing ground. $\angle NTF = \tan^{-1}\dfrac{12}{5} = 67.4°$, measured clockwise from TN (bearing $200°$). Bearing of F $= 200° + 67.4° = 267.4°$.
:::

:::reveal{title="5. Two ships leave a port at the same time: one sails 10 km on 030°, the other 14 km on 110°. How far apart are they?"}
The angle between their paths is $110° - 30° = 80°$. Cosine rule: $d^2 = 100 + 196 - 280\cos 80° = 296 - 48.6 = 247.4$, so $d = 15.7$ km.
:::

## Key terms

:::callout{type=definition title="Key terms"}
- **Bearing**: a direction given as an angle measured clockwise from north.
- **Three-figure bearing**: a bearing written with three figures, such as $045°$ or $270°$.
- **Back bearing**: the bearing of the return journey: the bearing plus or minus $180°$.
- **Compass bearing**: a direction given from north or south towards east or west, such as N $40°$ E.
- **North line**: the line pointing north, drawn at every point of a journey, from which bearings are measured.
- **Bearing of B from A**: the direction of B measured clockwise from the north line at A.
:::

## Key points

- **From north, clockwise, three figures.**
- **Back bearing** $= \theta \pm 180°$.
- "The bearing of A **from B**": stand at **B**.
- Draw a **north line at every turning point** and use parallel lines to find the angles inside the triangle.
- Right angle → **Pythagoras and tan**; otherwise → **cosine rule** then **sine rule**.
- Check by the **components** method when time allows.

## WASSCE examination focus

:::callout{type=waec-tests}
Bearings appear in the objective paper (three-figure and back bearings, simple distances) and almost every year in Paper 2 as a multi-part journey problem needing a sketch, an angle found from parallel north lines, the cosine rule for a distance and the sine rule for a bearing. Give bearings as three figures and distances to the accuracy asked.
:::
