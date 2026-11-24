Two shapes are **congruent** if they are exact copies: same shape, same size. They are **similar** if they have the same shape but possibly different sizes: an enlargement. Similarity is how a map represents a country, how a photograph shows a building, and how surveyors measure heights they cannot climb. WASSCE tests the conditions for congruence, the ratio of sides in similar figures, and how areas and volumes scale. This lesson covers all three.

## Learning objectives

By the end of this lesson you should be able to:

- state and use the four conditions for congruent triangles
- recognise similar triangles and find the scale factor
- use similar triangles to find unknown lengths
- use the area factor ($k^2$) and volume factor ($k^3$) for similar shapes

## Congruent triangles

:::callout{type=definition}
Two triangles are **congruent** if one fits exactly on top of the other: all corresponding sides **and** angles are equal. You only need to show **one** of these four conditions:

| Condition | What is equal |
|---|---|
| **SSS** | three sides |
| **SAS** | two sides and the angle **between** them |
| **ASA** (or AAS) | two angles and a corresponding side |
| **RHS** | a right angle, the hypotenuse and one other side |
:::

:::callout{type=common-mistake}
**AAA is not a condition for congruence.** Three equal angles prove only that the triangles are **similar** (same shape), not the same size. And **SSA** (two sides and a non-included angle) does not prove congruence either, except in the right-angled case, RHS.
:::

:::callout{type=worked-example}
**ABCD is a parallelogram. Prove that triangles ABD and CDB are congruent.**

- $AB = CD$ (opposite sides of a parallelogram)
- $AD = CB$ (opposite sides of a parallelogram)
- $BD$ is common to both triangles

**So $\triangle ABD \equiv \triangle CDB$ (SSS).**
:::

## Similar figures

:::callout{type=definition}
Two figures are **similar** if one is an enlargement of the other:

- all **corresponding angles are equal**, and
- all **corresponding sides are in the same ratio**, the **scale factor** $k$.

For triangles, **equal angles are enough** to prove similarity.
:::

![Triangle ABC with sides 3, 4 and 5, and triangle PQR with sides 6, 8 and 10; each side of PQR is twice the corresponding side of ABC, so the scale factor is 2 and areas scale by 4](https://wasscetutor.com/img/mathematics/similar-triangles.svg)

### Finding unknown sides

:::callout{type=worked-example}
**Triangles ABC and PQR are similar, with $\angle A = \angle P$ and $\angle B = \angle Q$. $AB = 6$ cm, $BC = 9$ cm, $PQ = 10$ cm. Find $QR$.**

Scale factor $k = \dfrac{PQ}{AB} = \dfrac{10}{6} = \dfrac53$.

$$QR = BC \times k = 9 \times \frac53 = 15 \text{ cm}$$
:::

:::callout{type=tip}
**Match the corresponding sides first.** They are the sides **opposite equal angles**. Write the triangles with corresponding vertices in the same order ($ABC \sim PQR$), and the ratios follow: $\dfrac{PQ}{AB} = \dfrac{QR}{BC} = \dfrac{PR}{AC}$.
:::

### Triangles inside triangles

A line drawn **parallel** to one side of a triangle cuts off a smaller, similar triangle.

:::callout{type=worked-example}
**In triangle ABC, D is on AB and E is on AC with $DE \parallel BC$. $AD = 4$ cm, $DB = 6$ cm and $DE = 5$ cm. Find $BC$.**

$\triangle ADE \sim \triangle ABC$ (corresponding angles equal, since $DE \parallel BC$).

$AB = 4 + 6 = 10$ cm. Scale factor $= \dfrac{AB}{AD} = \dfrac{10}{4} = 2.5$.

$$BC = 5 \times 2.5 = 12.5 \text{ cm}$$
:::

:::callout{type=common-mistake}
**Using $DB$ instead of $AB$.** The big triangle's side is the **whole** of $AB$ ($4 + 6 = 10$), not just the piece $DB$. The ratio $\dfrac{DB}{AD} = \dfrac64$ gives a wrong answer.
:::

## Areas and volumes of similar shapes

If the scale factor for lengths is $k$:

:::callout{type=definition}
| Quantity | Multiplied by |
|---|---|
| lengths | $k$ |
| **areas** | $k^2$ |
| **volumes** | $k^3$ |
:::

:::callout{type=worked-example}
**Two similar cylindrical tins have heights 6 cm and 9 cm. The smaller holds 320 cm³. How much does the larger hold?**

$k = \dfrac96 = 1.5$; volume factor $= k^3 = 3.375$.

Larger volume $= 320 \times 3.375 = $ **1080 cm³**.
:::

:::callout{type=worked-example}
**Two similar triangles have areas 18 cm² and 50 cm². The smaller has a side of 6 cm. Find the corresponding side of the larger.**

Area factor $= \dfrac{50}{18} = \dfrac{25}{9}$, so $k = \sqrt{\dfrac{25}{9}} = \dfrac53$.

Side $= 6 \times \dfrac53 = $ **10 cm**.
:::

:::callout{type=local-example}
**Measuring a tall tree with its shadow.** A 1.5 m stick casts a 2 m shadow at the same moment that a cotton tree casts a 24 m shadow. The sun's rays make similar triangles, so the tree's height is $1.5 \times \dfrac{24}{2} = $ **18 m**, measured without climbing a single branch.
:::

## Practice

:::reveal{title="1. Which condition proves congruence: two triangles with a right angle, equal hypotenuses of 13 cm and one equal side of 5 cm?"}
**RHS.**
:::

:::reveal{title="2. Similar triangles have corresponding sides 4 cm and 10 cm. The smaller has another side of 6 cm. Find the matching side of the larger."}
$k = 2.5$: $6 \times 2.5 = 15$ cm.
:::

:::reveal{title="3. A map has scale 1 : 50 000. A field has area 2 cm² on the map. Find its real area in hectares."}
Length factor $50\,000$, area factor $50\,000^2 = 2.5 \times 10^9$.

Real area $= 2 \times 2.5 \times 10^9 = 5 \times 10^9$ cm² $= 500\,000$ m² $= $ **50 hectares**.
:::

:::reveal{title="4. Two similar jugs have heights 10 cm and 15 cm. The larger holds 2.7 litres. How much does the smaller hold?"}
$k = 1.5$, $k^3 = 3.375$. Smaller $= 2.7 \div 3.375 = 0.8$ litres.
:::

:::reveal{title="5. In triangle PQR, ST ∥ QR with S on PQ and T on PR. PS = 3 cm, SQ = 5 cm, PT = 4.5 cm. Find TR."}
$\dfrac{PS}{PQ} = \dfrac{PT}{PR}$: $\dfrac38 = \dfrac{4.5}{PR} \Rightarrow PR = 12$. $TR = 12 - 4.5 = 7.5$ cm.
:::

## Key terms

:::callout{type=definition title="Key terms"}
- **Congruent figures**: figures with the same shape and size.
- **Similar figures**: figures with the same shape, with equal angles and sides in the same ratio.
- **Corresponding sides**: sides in matching positions in two figures, opposite equal angles.
- **Area factor**: the ratio of the areas of similar figures: the square of the length ratio, $k^2$.
- **Scale factor**: the ratio $k$ of corresponding lengths in similar figures.
- **Volume factor**: the ratio of the volumes of similar solids: the cube of the length ratio, $k^3$.
- **RHS**: the congruence condition for right-angled triangles: the right angle, the hypotenuse and one other side are equal.
:::

## Key points

- **Congruent** (same shape and size): SSS, SAS, ASA/AAS, RHS. Not AAA, not SSA.
- **Similar** (same shape): equal angles, sides in ratio $k$. Equal angles are enough for triangles.
- **Match corresponding sides** (opposite equal angles) before forming ratios.
- A line **parallel** to a side cuts off a similar triangle; use the **whole** side.
- Lengths × $k$; **areas × $k^2$**; **volumes × $k^3$**.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect objective questions on congruence conditions, scale factors, and area or volume ratios of similar figures, and theory questions finding lengths in similar triangles (often with parallel lines) or capacities of similar containers. Using $k$ instead of $k^2$ or $k^3$ for areas and volumes is the commonest error.
:::
