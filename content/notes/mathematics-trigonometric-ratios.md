Trigonometry is the mathematics of **triangles and angles**. It lets you find a length you cannot measure (the height of a mast, the width of a river) from an angle and one length you can measure. Everything starts with three ratios, **sine, cosine and tangent**, and one memory aid: **SOH CAH TOA**. This lesson teaches the ratios in right-angled triangles, the exact values for $30°$, $45°$ and $60°$, the ratios of angles up to $360°$ and their graphs, and the **sine and cosine rules** for triangles without a right angle. WASSCE uses all of these, especially in elevation and bearing questions.

## Learning objectives

By the end of this lesson you should be able to:

- name the hypotenuse, opposite and adjacent sides from a given angle
- use $\sin$, $\cos$ and $\tan$ to find an unknown side or angle
- recall the exact values for $30°$, $45°$ and $60°$
- find the ratios of angles between $0°$ and $360°$, and read their graphs
- use the sine rule and the cosine rule

## Naming the sides

![A right-angled triangle with angle θ at A: the hypotenuse is opposite the right angle, the opposite side is across from θ, the adjacent side is next to θ; SOH CAH TOA](https://wasscetutor.com/img/mathematics/trig-ratios.svg)

- The **hypotenuse** is the longest side, opposite the right angle. It never changes.
- The **opposite** side is across from the angle you are using.
- The **adjacent** side is next to that angle (and is not the hypotenuse).

:::callout{type=definition}
$$\sin\theta = \frac{\text{opposite}}{\text{hypotenuse}} \qquad \cos\theta = \frac{\text{adjacent}}{\text{hypotenuse}} \qquad \tan\theta = \frac{\text{opposite}}{\text{adjacent}}$$

**SOH CAH TOA**: **S**ine = **O**pp/**H**yp, **C**os = **A**dj/**H**yp, **T**an = **O**pp/**A**dj.
:::

:::callout{type=common-mistake}
**Labelling from the wrong angle.** "Opposite" and "adjacent" depend on **which angle** you are working with. Swap to the other acute angle and they swap too. Mark the angle first, then label.
:::

## Finding a side

1. Label the sides from the angle.
2. Pick the ratio that links the side you **know** and the side you **want**.
3. Substitute and solve.

:::callout{type=worked-example}
**In a right-angled triangle, one angle is $35°$ and the hypotenuse is 12 cm. Find the side opposite the $35°$ angle.**

Opposite and hypotenuse → **sine**.

$$\sin 35° = \frac{x}{12} \;\Rightarrow\; x = 12 \sin 35° = 12 \times 0.5736 = 6.88 \text{ cm}$$
:::

:::callout{type=tip}
If the unknown is on the **bottom** of the fraction, rearrange before using the calculator: $\cos 50° = \dfrac{8}{x}$ gives $x = \dfrac{8}{\cos 50°} = 12.4$.
:::

## Finding an angle

Use the **inverse** functions $\sin^{-1}$, $\cos^{-1}$, $\tan^{-1}$ (SHIFT + sin on most calculators).

:::callout{type=worked-example}
**A right-angled triangle has opposite side 5 cm and adjacent side 8 cm. Find the angle $\theta$.**

$$\tan\theta = \frac58 = 0.625 \;\Rightarrow\; \theta = \tan^{-1}(0.625) = 32.0°$$
:::

:::callout{type=common-mistake}
**Calculator in the wrong mode.** WASSCE angles are in **degrees**. If your calculator shows "R" or "RAD", $\sin 30$ gives $-0.988$ instead of $0.5$. Check for **D** or **DEG** on the screen before the exam starts.
:::

## Exact values: $30°$, $45°$, $60°$

![Half an equilateral triangle with sides 1, √3 and 2 and angles 30° and 60°; half a square with sides 1, 1 and √2 and two 45° angles](https://wasscetutor.com/img/mathematics/special-angles.svg)

Read the values straight off the two triangles with SOH CAH TOA:

:::callout{type=definition}
| | $30°$ | $45°$ | $60°$ |
|---|---|---|---|
| $\sin$ | $\tfrac12$ | $\tfrac{\sqrt2}{2}$ | $\tfrac{\sqrt3}{2}$ |
| $\cos$ | $\tfrac{\sqrt3}{2}$ | $\tfrac{\sqrt2}{2}$ | $\tfrac12$ |
| $\tan$ | $\tfrac{1}{\sqrt3} = \tfrac{\sqrt3}{3}$ | $1$ | $\sqrt3$ |
:::

:::callout{type=worked-example}
**Without a calculator, evaluate $\sin 60° \cos 30° + \cos 60° \sin 30°$.**

$$\frac{\sqrt3}{2} \times \frac{\sqrt3}{2} + \frac12 \times \frac12 = \frac34 + \frac14 = 1$$
:::

## Two identities

:::callout{type=definition}
$$\tan\theta = \frac{\sin\theta}{\cos\theta} \qquad\qquad \sin^2\theta + \cos^2\theta = 1$$
:::

:::callout{type=worked-example}
**Given that $\sin\theta = \tfrac35$ and $\theta$ is acute, find $\cos\theta$ and $\tan\theta$ without a calculator.**

Draw a right-angled triangle with opposite $3$ and hypotenuse $5$. By Pythagoras the adjacent side is $\sqrt{25 - 9} = 4$.

$$\cos\theta = \frac45 \qquad \tan\theta = \frac34$$
:::

## Angles from $0°$ to $360°$

For angles beyond $90°$, the signs change round the four quadrants:

| Quadrant | Angles | Positive |
|---|---|---|
| 1st | $0°$–$90°$ | **all** |
| 2nd | $90°$–$180°$ | **sin** only |
| 3rd | $180°$–$270°$ | **tan** only |
| 4th | $270°$–$360°$ | **cos** only |

Memory aid, going anticlockwise from the first quadrant: **A**ll **S**tudents **T**ake **C**hemistry.

:::callout{type=definition}
| | sine | cosine |
|---|---|---|
| $180° - \theta$ | $\sin(180° - \theta) = \sin\theta$ | $\cos(180° - \theta) = -\cos\theta$ |
| $180° + \theta$ | $-\sin\theta$ | $-\cos\theta$ |
| $360° - \theta$ | $-\sin\theta$ | $\cos\theta$ |
:::

:::callout{type=worked-example}
**(a) Find $\sin 150°$ and $\cos 120°$. (b) Solve $\sin x = 0.5$ for $0° \le x \le 360°$.**

**(a)** $\sin 150° = \sin 30° = 0.5$; $\cos 120° = -\cos 60° = -0.5$.

**(b)** $\sin^{-1}(0.5) = 30°$. Sine is also positive in the 2nd quadrant: $180° - 30° = 150°$. **$x = 30°$ or $150°$.**
:::

### The graphs

![Graphs of y = sin x and y = cos x for 0° to 360°: both are waves between −1 and 1; sin x starts at 0, cos x starts at 1](https://wasscetutor.com/img/mathematics/sine-cosine-graphs.svg)

WASSCE often gives a table such as $y = 2\sin x + \cos x$ to complete, then asks you to draw the graph and read values from it. Work out each value carefully with a calculator, plot the points with small crosses, and join them with a **smooth curve**, not straight lines.

## Triangles without a right angle

Label the sides with small letters opposite the angles with capital letters: side $a$ is opposite angle $A$.

:::callout{type=definition}
**Sine rule** (use when you know a side and the angle **opposite** it):
$$\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C}$$

**Cosine rule** (use with **two sides and the angle between them**, or with **all three sides**):
$$a^2 = b^2 + c^2 - 2bc\cos A$$
:::

:::callout{type=worked-example}
**In triangle ABC, $A = 40°$, $B = 75°$ and $a = 10$ cm. Find $b$.**

A side and its opposite angle are known, so use the **sine rule**:

$$\frac{b}{\sin 75°} = \frac{10}{\sin 40°}$$

$$b = \frac{10 \sin 75°}{\sin 40°} = \frac{9.659}{0.6428} = 15.0 \text{ cm}$$
:::

:::callout{type=worked-example}
**In triangle ABC, $b = 7$ cm, $c = 5$ cm and $A = 60°$. Find $a$.**

Two sides and the angle between them → **cosine rule**:

$$a^2 = 7^2 + 5^2 - 2(7)(5)\cos 60°$$

$$a^2 = 49 + 25 - 35 = 39$$

$$a = \sqrt{39} = 6.24 \text{ cm}$$
:::

:::callout{type=local-example}
**A painter in Freetown leans a 6 m ladder against a wall so that it makes $70°$ with the ground. How high up the wall does it reach?**

The ladder is the hypotenuse; the height is opposite the $70°$ angle:

$$h = 6 \sin 70° = 6 \times 0.9397 = 5.64 \text{ m}$$
:::

## Practice

:::reveal{title="1. A right-angled triangle has hypotenuse 20 cm and an angle of 25°. Find the side adjacent to the 25° angle."}
$20 \cos 25° = 20 \times 0.9063 = 18.1$ cm.
:::

:::reveal{title="2. Find θ if the opposite side is 7 cm and the hypotenuse is 10 cm."}
$\sin\theta = 0.7 \Rightarrow \theta = \sin^{-1}(0.7) = 44.4°$.
:::

:::reveal{title="3. Without a calculator, find tan 60° − tan 30°, leaving your answer as a surd."}
$\sqrt3 - \dfrac{\sqrt3}{3} = \dfrac{3\sqrt3 - \sqrt3}{3} = \dfrac{2\sqrt3}{3}$.
:::

:::reveal{title="4. If cos θ = 5/13 and θ is acute, find sin θ and tan θ."}
Adjacent 5, hypotenuse 13, so opposite $= \sqrt{169 - 25} = 12$. $\sin\theta = \tfrac{12}{13}$, $\tan\theta = \tfrac{12}{5}$.
:::

:::reveal{title="5. Solve cos x = −0.5 for 0° ≤ x ≤ 360°."}
$\cos^{-1}(0.5) = 60°$. Cosine is negative in the 2nd and 3rd quadrants: $x = 180° - 60° = 120°$ or $x = 180° + 60° = 240°$.
:::

:::reveal{title="6. A triangle has sides 8 cm, 6 cm and 5 cm. Find the largest angle."}
The largest angle is opposite the longest side (8 cm). $\cos A = \dfrac{6^2 + 5^2 - 8^2}{2(6)(5)} = \dfrac{-3}{60} = -0.05$, so $A = 92.9°$.
:::

## Key terms

:::callout{type=definition title="Key terms"}
- **Hypotenuse**: the longest side of a right-angled triangle, opposite the right angle.
- **Sine**: in a right-angled triangle, the opposite side divided by the hypotenuse.
- **Cosine**: in a right-angled triangle, the adjacent side divided by the hypotenuse.
- **Tangent**: in a right-angled triangle, the opposite side divided by the adjacent side.
- **Sine rule**: the rule $\dfrac{a}{\sin A} = \dfrac{b}{\sin B} = \dfrac{c}{\sin C}$, used when a side and its opposite angle are known.
- **Cosine rule**: the rule $a^2 = b^2 + c^2 - 2bc\cos A$, used with two sides and the included angle, or with three sides.
:::

## Key points

- **SOH CAH TOA**; label the sides **from the angle** you are using.
- Use $\sin^{-1}$, $\cos^{-1}$, $\tan^{-1}$ to find angles; keep the calculator in **degrees**.
- **Exact values** for $30°$, $45°$, $60°$ come from two triangles: half an equilateral triangle and half a square.
- $\tan\theta = \dfrac{\sin\theta}{\cos\theta}$; $\sin^2\theta + \cos^2\theta = 1$.
- Signs by quadrant: **All, Sin, Tan, Cos**. $\sin(180° - \theta) = \sin\theta$.
- **Sine rule** with a side and its opposite angle; **cosine rule** with two sides and the included angle, or three sides.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect objective questions on exact values, simple ratios and angles in the four quadrants, and theory questions that use the ratios, the sine rule or the cosine rule inside a practical problem (heights, distances, bearings). A graph question on $y = a\sin x + b\cos x$ (complete the table, draw, read values) also appears regularly. Marks go to the correct ratio or rule, correct substitution and an answer to the required accuracy.
:::
