How tall is a mobile-phone mast? How far out to sea is a fishing boat seen from a cliff? You cannot measure these with a tape, but you can measure an **angle** and one **distance**, and trigonometry does the rest. Angles of elevation and depression are where right-angled trigonometry meets the real world, and WASSCE sets at least one such question almost every year. This lesson defines both angles, shows why they are equal, and works through every common question type, including the two-observation problems that many candidates find hardest.

## Learning objectives

By the end of this lesson you should be able to:

- define the angle of elevation and the angle of depression
- explain why the angle of depression equals the angle of elevation
- draw a clear sketch from a word problem
- find heights and distances, including problems with two angles and an observer's eye level

## The two angles

![An observer at A looks up at the top T of a tower of height h, distance d away: the angle of elevation α at A is measured up from the horizontal; from T the angle of depression to A is measured down from the horizontal and is also α; tan α = h/d](https://wasscetutor.com/img/mathematics/elevation-depression.svg)

:::callout{type=definition}
- The **angle of elevation** is the angle between the **horizontal** and the line of sight when you look **up** at an object.
- The **angle of depression** is the angle between the **horizontal** and the line of sight when you look **down** at an object.

Both are measured **from the horizontal**, never from the vertical.
:::

### Why they are equal

The horizontal at the top of the tower is **parallel** to the ground. The line of sight is a transversal, so the angle of depression from T and the angle of elevation at A are **alternate angles**, and alternate angles are equal.

:::callout{type=common-mistake}
**Putting the angle of depression inside the triangle at the top.** The angle of depression is between the line of sight and the **horizontal** through the observer, which lies **outside** the triangle. Move it to the ground using alternate angles: it equals the angle of elevation at the bottom.
:::

## The method

1. **Draw a sketch**: a horizontal ground line, a vertical object, the line of sight.
2. **Mark the right angle** (an object stands vertically on level ground).
3. Put the angle at the correct place, using alternate angles for depression.
4. Label the known length and the unknown.
5. Choose the ratio (almost always **tan**, since height and horizontal distance are opposite and adjacent).

## Worked examples

:::callout{type=worked-example}
**From a point 50 m from the foot of a tower, the angle of elevation of the top is $32°$. Find the height of the tower.**

Height is opposite, distance is adjacent:

$$\tan 32° = \frac{h}{50} \;\Rightarrow\; h = 50 \tan 32° = 50 \times 0.6249 = 31.2 \text{ m}$$
:::

:::callout{type=worked-example}
**From the top of a cliff 80 m high, the angle of depression of a boat is $25°$. How far is the boat from the foot of the cliff?**

The angle of elevation from the boat to the cliff top is also $25°$ (alternate angles).

$$\tan 25° = \frac{80}{d} \;\Rightarrow\; d = \frac{80}{\tan 25°} = \frac{80}{0.4663} = 171.6 \text{ m}$$
:::

### Remember the observer's height

:::callout{type=worked-example}
**A girl whose eyes are 1.5 m above the ground stands 12 m from a tree. The angle of elevation of the top of the tree from her eyes is $40°$. Find the height of the tree.**

The right-angled triangle starts at **eye level**, not at the ground:

$$\text{height above eye level} = 12 \tan 40° = 12 \times 0.8391 = 10.07 \text{ m}$$

$$\text{tree} = 10.07 + 1.5 = 11.6 \text{ m}$$
:::

:::callout{type=common-mistake}
**Forgetting the eye level.** If the question gives the observer's height, the triangle sits on top of it. Add the observer's height at the end.
:::

### Two angles, two triangles

The hardest questions give **two** observations. Each gives a right-angled triangle; the two triangles **share** a side, so set up two equations.

:::callout{type=worked-example}
**A man sees the top of a building at an angle of elevation of $30°$. He walks 20 m towards the building, and the angle of elevation becomes $45°$. Find the height of the building.**

Let the height be $h$ and the second distance from the building be $x$.

From the second point: $\tan 45° = \dfrac{h}{x}$, so $h = x$.

From the first point: $\tan 30° = \dfrac{h}{x + 20}$, so $h = \dfrac{x + 20}{\sqrt3}$.

Since $h = x$:

$$x\sqrt3 = x + 20 \;\Rightarrow\; x(\sqrt3 - 1) = 20 \;\Rightarrow\; x = \frac{20}{\sqrt3 - 1} = 27.3$$

**The building is 27.3 m high.** (Exactly $10(\sqrt3 + 1)$ m.)
:::

:::callout{type=worked-example}
**From the top of a lighthouse 60 m high, the angles of depression of two boats directly in line on the same side are $30°$ and $45°$. Find the distance between the boats.**

Nearer boat (larger angle, $45°$): $d_1 = \dfrac{60}{\tan 45°} = 60$ m.

Farther boat ($30°$): $d_2 = \dfrac{60}{\tan 30°} = 60\sqrt3 = 103.9$ m.

**Distance between the boats $= 103.9 - 60 = 43.9$ m.**
:::

:::callout{type=tip}
**The larger angle belongs to the nearer object.** As you walk towards a tall object, you look up more steeply. If your answer puts the larger angle farther away, check your sketch.
:::

:::callout{type=local-example}
**A telecommunications mast in Kenema.** A student paces 40 m from the foot of a mast and measures the angle of elevation of its top as $52°$ with a home-made clinometer (a protractor, a straw and a weighted string). Her eye is 1.4 m above the ground.

$$\text{mast} = 1.4 + 40 \tan 52° = 1.4 + 51.2 = 52.6 \text{ m}$$

This is the same method surveyors use, with better instruments.
:::

## Practice

:::reveal{title="1. A kite string is 60 m long and makes an angle of 48° with the ground. How high is the kite?"}
The string is the hypotenuse: $h = 60 \sin 48° = 44.6$ m.
:::

:::reveal{title="2. From the top of a building 25 m high, the angle of depression of a car is 18°. How far is the car from the building?"}
$d = \dfrac{25}{\tan 18°} = \dfrac{25}{0.3249} = 76.9$ m.
:::

:::reveal{title="3. A pole 8 m high casts a shadow 5 m long. Find the angle of elevation of the sun."}
$\tan\theta = \dfrac85 = 1.6 \Rightarrow \theta = 58.0°$.
:::

:::reveal{title="4. Two points P and Q are on opposite sides of a tree 15 m high. The angles of elevation of the top from P and Q are 35° and 50°. Find PQ."}
$\dfrac{15}{\tan 35°} + \dfrac{15}{\tan 50°} = 21.42 + 12.59 = 34.0$ m.
:::

:::reveal{title="5. From a point on level ground, the angle of elevation of the top of a tower is 60°. From a point 30 m farther away, it is 30°. Find the height."}
Let the nearer distance be $x$: $h = x\sqrt3$ and $h = \dfrac{x + 30}{\sqrt3}$. So $3x = x + 30$, giving $x = 15$, and $h = 15\sqrt3 = 26.0$ m.
:::

## Key points

- **Elevation**: up from the horizontal. **Depression**: down from the horizontal.
- The angle of depression **equals** the angle of elevation (alternate angles).
- Always **sketch**, mark the **right angle** and label the known and unknown sides.
- Height and horizontal distance → **tan**; a slanting length → sin or cos.
- **Add the observer's eye level** when it is given.
- Two observations → two triangles, two equations, one shared side.

## WASSCE examination focus

:::callout{type=waec-tests}
Elevation and depression questions appear in both papers: one-step questions in the objective paper and two-observation problems in the theory paper, sometimes combined with bearings. A clear sketch with the angles in the right places earns method marks even if the arithmetic slips, so always draw one.
:::
