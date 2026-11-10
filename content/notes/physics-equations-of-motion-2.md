Real journeys have stages: a bus speeds up, cruises, then slows for a stop. WASSCE theory questions love these multi-stage problems, usually with a velocity–time graph to sketch or interpret. This lesson trains you to break them into pieces.

## Learning objectives

By the end of this lesson you should be able to:

- sketch and interpret velocity–time graphs of multi-stage journeys
- find total distance, average speed and accelerations from such graphs
- solve "chase" problems where one body catches up with another

## Reading a velocity–time graph

![Three small velocity-time graphs: a horizontal line for constant velocity, a rising line for uniform acceleration and a falling line for uniform deceleration](https://wasscetutor.com/img/physics/motion-graphs-summary.svg)

*Figure 1. The three basic shapes. WASSCE Tutor diagram.*

| Feature of the graph | What it gives you |
|---|---|
| Gradient of a section | acceleration (negative gradient = deceleration) |
| Area under the graph | displacement (total area = total distance for one-way motion) |
| Horizontal section | constant velocity, zero acceleration |
| Section on the time axis | body at rest |

## Multi-stage journeys

:::callout{type=worked-example}
**A car starts from rest and accelerates uniformly to 20 m s⁻¹ in 10 s. It moves at this speed for 30 s and then decelerates uniformly to rest in 8 s.**

**(a) Sketch the velocity–time graph.** A straight line from (0, 0) to (10, 20), a horizontal line to (40, 20), and a straight line down to (48, 0): a trapezium.

**(b) Find the acceleration and deceleration.**

$$a_1 = \dfrac{20 - 0}{10} = 2\ \text{m s}^{-2} \qquad a_3 = \dfrac{0 - 20}{8} = -2.5\ \text{m s}^{-2}$$

**(c) Find the total distance.** Area of the trapezium:

$$s = \tfrac{1}{2}(\text{30} + \text{48}) \times 20 = 780\ \text{m}$$

(or stage by stage: $100 + 600 + 80 = 780$ m).

**(d) Find the average speed.**

$$\bar{v} = \dfrac{\text{total distance}}{\text{total time}} = \dfrac{780}{48} = 16.25\ \text{m s}^{-1}$$
:::

:::callout{type=common-mistake}
Average speed is **total distance ÷ total time**, not the average of the speeds. $(0 + 20 + 20 + 0) \div 4 = 10$ m s⁻¹ is wrong here.
:::

## When the area is known but a time is not

:::callout{type=worked-example}
**A train starts from rest at station A and accelerates at 0.5 m s⁻² to its top speed, which it keeps before braking at 1 m s⁻² to stop at station B. The top speed is 15 m s⁻¹ and the stations are 1.5 km apart. Find the time for the journey.**

- Accelerating: $t_1 = \dfrac{15}{0.5} = 30$ s, distance $= \tfrac{1}{2}(15)(30) = 225$ m.
- Braking: $t_3 = \dfrac{15}{1} = 15$ s, distance $= \tfrac{1}{2}(15)(15) = 112.5$ m.
- Cruising distance: $1500 - 225 - 112.5 = 1162.5$ m, so $t_2 = \dfrac{1162.5}{15} = 77.5$ s.

Total time $= 30 + 77.5 + 15 = 122.5$ s.
:::

## Chase problems

The key idea: when one body catches the other, **both have the same displacement from the same starting point at the same time**.

:::callout{type=worked-example}
**A police motorcyclist waits at a junction. A speeding car passes at a constant 25 m s⁻¹. At that instant the motorcyclist sets off from rest with acceleration 5 m s⁻². When and where does he catch the car?**

After time $t$:

- car: $s_c = 25t$
- motorcycle: $s_m = \tfrac{1}{2}(5)t^2 = 2.5t^2$

They meet when $s_m = s_c$:

$$2.5t^2 = 25t \Rightarrow t(2.5t - 25) = 0 \Rightarrow t = 10\ \text{s}$$

($t = 0$ is the starting moment.) Distance: $25 \times 10 = 250$ m from the junction. The motorcycle is then moving at $5 \times 10 = 50$ m s⁻¹, twice the car's speed.
:::

:::callout{type=worked-example}
**Two minibuses leave the same park 20 s apart. The first leaves from rest with acceleration 2 m s⁻². The second leaves from rest 20 s later with acceleration 3 m s⁻². How long after the second sets off are they level?**

Let $t$ be the time after the second sets off. The first has then been moving for $(t + 20)$ s.

$$\tfrac{1}{2}(2)(t + 20)^2 = \tfrac{1}{2}(3)t^2$$

$$2(t^2 + 40t + 400) = 3t^2 \Rightarrow t^2 - 80t - 800 = 0$$

$$t = \dfrac{80 + \sqrt{6400 + 3200}}{2} = \dfrac{80 + 97.98}{2} = 89.0\ \text{s}$$

(The negative root has no meaning.) In practice both would reach their top speeds long before this, which is why real questions usually give a top speed.
:::

## Displacement–time graphs

For completeness:

- The **gradient** of a displacement–time graph is the **velocity**.
- A straight line means uniform velocity; a curve that gets steeper means acceleration.
- A horizontal line means the body is at rest.

## Key points

- Break multi-stage journeys into stages; use gradients for accelerations and areas for distances.
- Average speed = total distance ÷ total time.
- In a chase, write each displacement as a function of the same $t$ and set them equal.
- Gradient of a displacement–time graph = velocity; gradient of a velocity–time graph = acceleration.

## WASSCE examination focus

:::callout{type=waec-tests}
A classic theory question: "A body starts from rest, accelerates…, moves at constant velocity…, then decelerates… **Sketch** the velocity–time graph and **use it** to find the total distance / average speed / deceleration." Label the axes with units, mark the key values on the axes, and show the area calculation. Many candidates lose marks by not using the graph when told to.
:::

## Quick check

1. On a velocity–time graph, what does a horizontal line on the time axis mean?
2. A body accelerates from rest to 12 m s⁻¹ in 6 s and then moves at 12 m s⁻¹ for 10 s. Find the total distance.
3. A car at 30 m s⁻¹ passes a stationary bike that starts at 3 m s⁻² at that instant. When does the bike catch the car?

**Answers:** 1. The body is at rest. 2. $\tfrac{1}{2}(12)(6) + 12 \times 10 = 36 + 120 = 156$ m. 3. $1.5t^2 = 30t \Rightarrow t = 20$ s.
