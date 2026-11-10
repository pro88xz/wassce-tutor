Dimensions are the "DNA" of a physical quantity. With them you can check whether an equation could possibly be right, and even predict how one quantity depends on others before doing any experiment.

## Learning objectives

By the end of this lesson you should be able to:

- write the dimensions of physical quantities in terms of M, L and T
- use dimensional analysis to check whether an equation is homogeneous
- use dimensions to derive the form of a physical relationship
- state the limitations of dimensional analysis

## Dimensions

:::callout{type=definition}
The **dimensions** of a physical quantity show how it is related to the fundamental quantities **mass [M]**, **length [L]** and **time [T]** (and, where needed, current [I] and temperature [θ]).
:::

Square brackets mean "the dimensions of". For example, $[\text{speed}] = \dfrac{[\text{length}]}{[\text{time}]} = \text{L T}^{-1}$.

| Quantity | Equation used | Dimensions |
|---|---|---|
| Area | $l \times b$ | L² |
| Volume | $l \times b \times h$ | L³ |
| Density | $m / V$ | M L⁻³ |
| Velocity | $s / t$ | L T⁻¹ |
| Acceleration | $\Delta v / t$ | L T⁻² |
| Force | $ma$ | M L T⁻² |
| Momentum, impulse | $mv$, $Ft$ | M L T⁻¹ |
| Pressure, stress | $F / A$ | M L⁻¹ T⁻² |
| Work, energy | $Fs$ | M L² T⁻² |
| Power | $W / t$ | M L² T⁻³ |
| Frequency | $1 / T$ | T⁻¹ |
| Gravitational constant $G$ | $F = Gm_1m_2 / r^2$ | M⁻¹ L³ T⁻² |

Pure numbers (such as ½, π, 2) and ratios of like quantities (such as strain, angle in radians, efficiency, refractive index) have **no dimensions**.

:::callout{type=worked-example}
**Find the dimensions of the spring constant $k$ in $F = kx$.**

$$[k] = \dfrac{[F]}{[x]} = \dfrac{\text{M L T}^{-2}}{\text{L}} = \text{M T}^{-2}$$

So the unit of $k$ is N m⁻¹, which in base units is kg s⁻².
:::

## Checking an equation: homogeneity

:::callout{type=definition}
An equation is **dimensionally homogeneous** (dimensionally consistent) when every term in it has the **same dimensions**. A correct physical equation must be homogeneous.
:::

:::callout{type=worked-example}
**Is $s = ut + \tfrac{1}{2}at^2$ dimensionally consistent?**

- $[s] = \text{L}$
- $[ut] = \text{L T}^{-1} \times \text{T} = \text{L}$
- $[\tfrac{1}{2}at^2] = \text{L T}^{-2} \times \text{T}^2 = \text{L}$ (the ½ has no dimensions)

Every term has dimension L, so the equation is homogeneous.
:::

:::callout{type=worked-example}
**A student writes $v^2 = u^2 + 2at$. Show it must be wrong.**

$[v^2] = \text{L}^2\ \text{T}^{-2}$ but $[2at] = \text{L T}^{-2} \times \text{T} = \text{L T}^{-1}$. The terms do not match, so the equation is wrong. (The correct one is $v^2 = u^2 + 2as$.)
:::

## Deriving a relationship

If you know which quantities a result depends on, dimensions can tell you how.

:::callout{type=worked-example}
**The period $T$ of a simple pendulum may depend on the mass $m$ of the bob, the length $l$ and the acceleration of free fall $g$. Use dimensions to find the relationship.**

Suppose $T = k\, m^{x}\, l^{y}\, g^{z}$ where $k$ is a dimensionless constant. Then

$$\text{T}^{1} = \text{M}^{x}\ \text{L}^{y}\ (\text{L T}^{-2})^{z} = \text{M}^{x}\ \text{L}^{y+z}\ \text{T}^{-2z}$$

Compare powers:

- M: $x = 0$
- T: $-2z = 1$, so $z = -\tfrac{1}{2}$
- L: $y + z = 0$, so $y = \tfrac{1}{2}$

$$T = k\sqrt{\dfrac{l}{g}}$$

The period does not depend on the mass. Experiment shows $k = 2\pi$.
:::

### Limitations of dimensional analysis

1. It **cannot find dimensionless constants** such as the $2\pi$ above or the ½ in $\tfrac{1}{2}mv^2$.
2. It cannot handle relationships involving **sums** of several terms or functions such as sine, log or exponential.
3. It cannot tell apart quantities with the **same dimensions** (work and torque are both M L² T⁻²).
4. An equation can be homogeneous and still be **wrong**: $s = ut + at^2$ is homogeneous but the coefficient is wrong.

## Significant figures in answers

Your final answer should not claim more precision than your data. Give answers to the **same number of significant figures as the least precise data** (usually 2 or 3 in WASSCE questions).

| Number | Significant figures |
|---|---|
| 4.08 | 3 (zeros between digits count) |
| 0.0052 | 2 (leading zeros do not count) |
| 3.50 | 3 (a trailing zero after the decimal point counts) |
| $2.0 \times 10^{3}$ | 2 |

## Key points

- Dimensions express a quantity in terms of **M, L, T**: force M L T⁻², energy M L² T⁻², power M L² T⁻³, pressure M L⁻¹ T⁻².
- A valid equation is **homogeneous**: all terms have the same dimensions.
- Dimensions can find the **form** of a relationship but never the **dimensionless constant**.
- Round final answers to a sensible number of significant figures.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect objective questions such as **"the dimensions of pressure are"** or **"which quantity has the dimensions M L² T⁻³?"**, and theory questions asking you to **show that an equation is dimensionally consistent** or to **use dimensions to derive** the pendulum or a similar relationship. Lay out the comparison of powers of M, L and T clearly; examiners award marks for each step.
:::

## Quick check

1. Write the dimensions of power.
2. Which quantity has dimensions M L T⁻¹?
3. Show that $\tfrac{1}{2}mv^2$ and $mgh$ have the same dimensions.

**Answers:** 1. M L² T⁻³. 2. Momentum (or impulse). 3. $[\tfrac{1}{2}mv^2] = \text{M}(\text{L T}^{-1})^2 = \text{M L}^2\ \text{T}^{-2}$; $[mgh] = \text{M} \times \text{L T}^{-2} \times \text{L} = \text{M L}^2\ \text{T}^{-2}$. Both are energies.
