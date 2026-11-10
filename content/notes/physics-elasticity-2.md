Engineers do not ask "how far does this rod stretch?" but "how much stress can this material take?" Stress, strain and Young's modulus let you compare materials regardless of their size, and springs combined in series or parallel are a classic exam question.

## Learning objectives

By the end of this lesson you should be able to:

- define tensile stress, tensile strain and Young's modulus
- calculate Young's modulus from data
- find the effective spring constant of springs in series and in parallel
- distinguish ductile, brittle and elastic materials

## Stress and strain

:::callout{type=definition}
**Tensile stress** is the force acting per unit **cross-sectional area**:

$$\text{stress} = \dfrac{F}{A} \quad (\text{N m}^{-2} \text{ or Pa})$$

**Tensile strain** is the extension per unit **original length**:

$$\text{strain} = \dfrac{e}{l_0} \quad (\text{no unit})$$
:::

## Young's modulus

:::callout{type=definition}
**Young's modulus** $E$ is the ratio of tensile stress to tensile strain, within the limit of proportionality:

$$E = \dfrac{\text{stress}}{\text{strain}} = \dfrac{F/A}{e/l_0} = \dfrac{F\,l_0}{A\,e}$$

Its unit is the same as that of stress: **N m⁻²** (Pa).
:::

Young's modulus is a property of the **material**, not of the particular wire: a thick steel wire and a thin steel wire have the same $E$. Steel has $E \approx 2 \times 10^{11}$ Pa; copper about $1.2 \times 10^{11}$ Pa; rubber only about $10^{6}$ Pa.

:::callout{type=worked-example}
**A steel wire 2.0 m long with cross-sectional area $1.0 \times 10^{-6}$ m² stretches by 1.0 mm when a load of 100 N is hung on it. Find (a) the stress, (b) the strain, (c) Young's modulus.**

(a) $\text{stress} = \dfrac{100}{1.0 \times 10^{-6}} = 1.0 \times 10^{8}$ Pa.

(b) $\text{strain} = \dfrac{1.0 \times 10^{-3}}{2.0} = 5.0 \times 10^{-4}$.

(c) $E = \dfrac{1.0 \times 10^{8}}{5.0 \times 10^{-4}} = 2.0 \times 10^{11}$ Pa.
:::

:::callout{type=common-mistake}
Convert the **diameter** to a **cross-sectional area** with $A = \pi r^2 = \dfrac{\pi d^2}{4}$, and convert mm to m **before** squaring. A wire of diameter 0.5 mm has area $\pi(0.25 \times 10^{-3})^2 = 1.96 \times 10^{-7}$ m².
:::

## Springs in series and in parallel

**In series** (one below the other): each spring carries the **full load**, so the extensions add:

$$\dfrac{1}{k} = \dfrac{1}{k_1} + \dfrac{1}{k_2}$$

Two identical springs of constant $k$ in series behave like one spring of constant $\dfrac{k}{2}$: **twice the extension**.

**In parallel** (side by side, sharing the load equally): the load is shared, so

$$k = k_1 + k_2$$

Two identical springs in parallel behave like one spring of constant $2k$: **half the extension**.

:::callout{type=worked-example}
**Two identical springs each extend 4 cm under a load of 8 N. What is the total extension when an 8 N load hangs from (a) the two springs in series, (b) the two springs side by side?**

(a) Each spring carries 8 N and extends 4 cm: total $= 8$ cm.

(b) Each spring carries 4 N and extends 2 cm: total $= 2$ cm.
:::

## Types of material behaviour

| Type | Behaviour | Examples |
|---|---|---|
| **Ductile** | can be drawn into wires; large plastic region before breaking | copper, gold, mild steel |
| **Brittle** | breaks suddenly with little or no plastic deformation | glass, cast iron, chalk |
| **Elastic (polymeric)** | very large elastic extension | rubber |

:::callout{type=local-example}
Electrical wiring uses **copper** because it is ductile (easily drawn into thin wires) as well as a good conductor. A **glass** louvre blade, being brittle, shatters instead of bending when struck. A **catapult** uses rubber because it stores a lot of elastic energy over a large extension.
:::

## Key points

- Stress $= F/A$ (Pa); strain $= e/l_0$ (no unit).
- Young's modulus $E = \dfrac{Fl_0}{Ae}$: a property of the material.
- Series springs: $\dfrac{1}{k} = \dfrac{1}{k_1} + \dfrac{1}{k_2}$; parallel springs: $k = k_1 + k_2$.
- Ductile materials stretch plastically before breaking; brittle ones snap.

## WASSCE examination focus

:::callout{type=waec-tests}
**Define stress, strain and Young's modulus** with units and calculate $E$ from a wire's data — watch the unit conversions (mm to m, diameter to area). Spring combinations (series and parallel) appear in objective papers. Distinguishing **ductile** and **brittle** materials may be asked with examples.
:::

## Quick check

1. What is the unit of strain?
2. A wire of area $2 \times 10^{-6}$ m² carries a load of 50 N. Find the stress.
3. Two springs of constant 100 N m⁻¹ are joined in series. What is the combined spring constant?

**Answers:** 1. It has no unit (it is a ratio of lengths). 2. $50 \div (2 \times 10^{-6}) = 2.5 \times 10^{7}$ Pa. 3. 50 N m⁻¹.
