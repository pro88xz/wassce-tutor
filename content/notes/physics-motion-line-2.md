A single graph can tell you where a body was, how fast it moved, whether it sped up and how far it went. WASSCE sets a motion-graph question almost every year, and the ticker-tape timer is the classic way of collecting the data. This lesson shows you how to read both.

## Learning objectives

By the end of this lesson you should be able to:

- interpret displacement–time graphs and find velocity from their gradient
- interpret velocity–time graphs, finding acceleration from the gradient and displacement from the area
- distinguish displacement (signed area) from distance (total area)
- use a ticker-tape timer to find velocity and acceleration

## Displacement–time graphs

Time goes on the horizontal axis; displacement (or distance) on the vertical axis.

![Three displacement-time graphs side by side: a horizontal line labelled at rest, a straight sloping line labelled constant velocity, and an upward curve getting steeper labelled speeding up](https://wasscetutor.com/img/physics/st-graphs.svg)

*Figure 1. Reading displacement–time graphs. WASSCE Tutor diagram.*

:::callout{type=definition}
The **gradient** of a displacement–time graph is the **velocity**:

$$v = \dfrac{\text{change in displacement}}{\text{change in time}}$$
:::

- A **horizontal** line: displacement is not changing, so the body is **at rest**.
- A **straight sloping** line: constant velocity. The steeper the line, the faster the body.
- A **curve getting steeper**: the velocity is increasing (acceleration). A curve getting flatter: the body is slowing down.
- A line sloping **downwards**: the body is moving back towards the start (negative velocity).

For a curve, the velocity at an instant is the gradient of the **tangent** drawn at that point.

:::callout{type=worked-example}
**A displacement–time graph is a straight line through (2 s, 4 m) and (8 s, 22 m). Find the velocity.**

$$v = \dfrac{22 - 4}{8 - 2} = \dfrac{18}{6} = 3.0\ \text{m s}^{-1}$$
:::

## Velocity–time graphs

Velocity goes on the vertical axis, time on the horizontal axis.

![Three velocity-time graphs: a horizontal line for constant velocity, a rising straight line for uniform acceleration, and a falling straight line for uniform deceleration](https://wasscetutor.com/img/physics/motion-graphs-summary.svg)

*Figure 2. Velocity–time graphs for constant velocity, uniform acceleration and uniform deceleration. WASSCE Tutor diagram.*

:::callout{type=definition}
On a velocity–time graph:

- the **gradient** is the **acceleration**;
- the **area** between the graph and the time axis is the **displacement**.
:::

- Horizontal line: constant velocity, zero acceleration.
- Straight line rising: uniform acceleration. Straight line falling: uniform deceleration.
- A line crossing the time axis: the velocity changes sign, so the body **reverses direction**.

### Finding displacement from the area

Split the area into rectangles, triangles and trapezia:

- rectangle: base × height;
- triangle: ½ × base × height;
- trapezium: ½ × (sum of parallel sides) × width.

![Velocity-time graph rising from 0 to 12 m/s in 4 s, then level at 12 m/s until 7 s. The triangle under the first part has area 24 m and the rectangle under the second part has area 36 m](https://wasscetutor.com/img/physics/vt-area.svg)

*Figure 3. The area under a velocity–time graph is the displacement. WASSCE Tutor diagram.*

:::callout{type=worked-example}
**A body starts from rest, reaches 12 m s⁻¹ uniformly in 4 s, then moves at 12 m s⁻¹ for 3 s more (Figure 3). Find (a) its acceleration in the first 4 s and (b) its total displacement.**

(a) Gradient of the first part: $a = \dfrac{12 - 0}{4} = 3.0\ \text{m s}^{-2}$.

(b) Triangle: $\tfrac{1}{2} \times 4 \times 12 = 24$ m. Rectangle: $3 \times 12 = 36$ m.

$$\text{displacement} = 24 + 36 = 60\ \text{m}$$
:::

### Displacement or distance?

Area **above** the time axis counts as positive displacement; area **below** it counts as negative (the body is moving the other way).

- **Displacement** = area above − area below (signed sum).
- **Distance** = area above + area below (all areas counted as positive).

:::callout{type=worked-example}
**A body moves at 6 m s⁻¹ for 5 s, then at 2 m s⁻¹ in the opposite direction for 3 s. Find the total distance and the net displacement.**

Area above the axis $= 6 \times 5 = 30$ m. Area below $= 2 \times 3 = 6$ m.

Distance $= 30 + 6 = 36$ m. Displacement $= 30 - 6 = 24$ m in the first direction.
:::

:::callout{type=common-mistake}
Students often find the gradient of a velocity–time graph and call it velocity, or find the area under a displacement–time graph. Learn the pairs: **s–t gradient = velocity**; **v–t gradient = acceleration**; **v–t area = displacement**.
:::

## The ticker-tape timer

A **ticker-tape timer** has a metal arm that vibrates 50 times a second (it runs on the 50 Hz mains or an a.c. supply). Each vibration presses a dot onto a paper tape pulled through it by a moving trolley. So:

$$\text{time between two dots} = \dfrac{1}{50} = 0.02\ \text{s}$$

![Three ticker tapes: equally spaced dots for constant velocity, gaps growing along the tape for acceleration, and gaps shrinking for deceleration. Each gap takes 0.02 s](https://wasscetutor.com/img/physics/ticker-tape.svg)

*Figure 4. Ticker-tape patterns. WASSCE Tutor diagram.*

- **Equal gaps**: constant velocity.
- **Gaps getting longer**: the trolley is accelerating.
- **Gaps getting shorter**: the trolley is decelerating.

To find velocities, the tape is cut into strips of an equal number of gaps, usually **5 gaps** (5 × 0.02 = 0.1 s) or **10 gaps** (0.2 s).

:::callout{type=worked-example}
**A tape is cut into 5-gap strips. Three successive strips are 2.0 cm, 3.0 cm and 4.0 cm long. Find the average velocity during each strip and the acceleration.**

Each strip takes $5 \times 0.02 = 0.1$ s.

$$v_1 = \dfrac{0.020\ \text{m}}{0.1\ \text{s}} = 0.20\ \text{m s}^{-1} \qquad v_2 = 0.30\ \text{m s}^{-1} \qquad v_3 = 0.40\ \text{m s}^{-1}$$

The velocity rises by 0.10 m s⁻¹ every 0.1 s (the time between the middles of neighbouring strips), so:

$$a = \dfrac{0.10}{0.1} = 1.0\ \text{m s}^{-2}$$
:::

Pasting the strips side by side, in order, makes a bar chart of velocity against time. Its shape is a velocity–time graph.

### Practical precautions

- Make sure the track is straight and the tape runs freely through the timer without snagging.
- Start the timer **before** releasing the trolley, and release it the same way each time.
- Ignore the crowded dots at the very start of the tape.
- Measure strip lengths from the same point on each dot, avoiding parallax.
- Repeat the run and compare results.

:::callout{type=local-example}
Where the school laboratory has no ticker timer, the same graph can be made with a stopwatch: mark 10 m intervals along a straight stretch of road or a football pitch, time a bicycle passing each mark, and plot distance against time. Gradients give the speed exactly as they would from a tape.
:::

## Key points

- s–t graph: gradient = velocity; horizontal = at rest; curve = changing velocity (use a tangent).
- v–t graph: gradient = acceleration; area = displacement.
- Displacement is the signed area; distance counts all areas as positive.
- Ticker timer: 50 dots per second, so 0.02 s per gap; equal gaps = constant velocity.
- Velocity of a strip = length ÷ time of the strip; acceleration = change in velocity ÷ time between strip middles.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect to **sketch or interpret** s–t and v–t graphs for a described journey, **find acceleration from a gradient**, **find displacement or distance from areas** (often a trapezium or a graph that crosses the time axis), and **analyse a ticker tape** to find velocity and acceleration. When drawing graphs, label both axes with quantities and units, use a uniform scale and draw a best-fit line.
:::

## Quick check

1. What does a horizontal line on a displacement–time graph mean?
2. What quantity is given by the gradient of a velocity–time graph?
3. A v–t graph is a triangle with base 8 s and height 10 m s⁻¹. Find the displacement.
4. A ticker timer makes 50 dots per second. How long does a 10-gap strip take?
5. A 10-gap strip is 6.0 cm long. Find the average velocity during it.

**Answers:** 1. The body is at rest. 2. Acceleration. 3. $\tfrac{1}{2} \times 8 \times 10 = 40$ m. 4. $10 \times 0.02 = 0.2$ s. 5. $0.060 \div 0.2 = 0.30$ m s⁻¹.
