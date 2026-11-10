Why does a long, thin wire resist current more than a short, thick one? Why does a car's headlights dim when the starter motor turns? This lesson covers resistivity and the internal resistance of cells — the reasons behind both.

## Learning objectives

By the end of this lesson you should be able to:

- state the factors affecting the resistance of a wire and use $R = \dfrac{\rho l}{A}$
- explain the effect of temperature on resistance
- explain internal resistance and use $E = I(R + r)$
- calculate terminal p.d. and "lost volts"

## Factors affecting resistance

The resistance of a wire depends on:

1. its **length** $l$: $R \propto l$ (a longer wire has more resistance)
2. its **cross-sectional area** $A$: $R \propto \dfrac{1}{A}$ (a thicker wire has less resistance)
3. the **material**
4. the **temperature**

Combining the first three:

$$R = \dfrac{\rho l}{A}$$

:::callout{type=definition}
The **resistivity** $\rho$ of a material is the resistance of a sample of **unit length and unit cross-sectional area**. Its unit is the **ohm metre (Ω m)**. It depends only on the material and the temperature.
:::

| Material | Resistivity at 20 °C / Ω m |
|---|---|
| Silver | $1.6 \times 10^{-8}$ |
| Copper | $1.7 \times 10^{-8}$ |
| Aluminium | $2.8 \times 10^{-8}$ |
| Nichrome | $1.1 \times 10^{-6}$ |
| Glass | about $10^{12}$ |

:::callout{type=worked-example}
**Find the resistance of a copper wire 50 m long with cross-sectional area 1.0 × 10⁻⁶ m² (ρ = 1.7 × 10⁻⁸ Ω m).**

$$R = \dfrac{\rho l}{A} = \dfrac{1.7 \times 10^{-8} \times 50}{1.0 \times 10^{-6}} = 0.85\ \Omega$$
:::

:::callout{type=worked-example}
**A wire has resistance 8 Ω. What is the resistance of a wire of the same material, twice as long and with twice the diameter?**

Doubling the length doubles $R$. Doubling the diameter makes the area four times larger, dividing $R$ by 4.

$$R' = 8 \times \dfrac{2}{4} = 4\ \Omega$$
:::

:::callout{type=common-mistake}
Doubling the **diameter** (or radius) multiplies the **area** by **four** ($A = \pi r^2$), not two.
:::

Copper is used for connecting wires because of its very low resistivity; **nichrome** (high resistivity, high melting point) is used for heating elements; **constantan** and **manganin** (resistivity almost independent of temperature) are used for standard resistors.

## Effect of temperature

- **Metals**: resistance **increases** with temperature (atoms vibrate more and obstruct the electrons).
- **Semiconductors** (silicon, germanium, thermistors) and **carbon**: resistance **decreases** with temperature (more charge carriers are released).

## Internal resistance

A real cell has some **internal resistance** $r$ (the resistance of its own chemicals). When the cell drives a current $I$ through an external resistance $R$, part of its e.m.f. is used up inside it:

$$E = IR + Ir = I(R + r)$$

- $IR = V$ is the **terminal p.d.** (the p.d. across the external circuit)
- $Ir$ is the **"lost volts"**, the p.d. used inside the cell

So $V = E - Ir$: the terminal p.d. is **less than the e.m.f.** whenever current flows, and falls as the current increases.

:::callout{type=worked-example}
**A cell of e.m.f. 1.5 V and internal resistance 0.5 Ω is connected to a 2.5 Ω resistor. Find (a) the current, (b) the terminal p.d., (c) the lost volts.**

(a) $I = \dfrac{E}{R + r} = \dfrac{1.5}{2.5 + 0.5} = 0.5$ A.

(b) $V = IR = 0.5 \times 2.5 = 1.25$ V.

(c) Lost volts $= Ir = 0.5 \times 0.5 = 0.25$ V. Check: $1.25 + 0.25 = 1.5$ V. ✓
:::

:::callout{type=local-example}
When a car's starter motor draws a very large current from the battery, the "lost volts" across the battery's internal resistance become large. The terminal p.d. drops, so the headlights dim while the engine is cranking.
:::

### Cells in series and parallel

- **In series** (identical cells, each e.m.f. $E$, internal resistance $r$): total e.m.f. $= nE$, total internal resistance $= nr$.
- **In parallel**: total e.m.f. $= E$, total internal resistance $= \dfrac{r}{n}$ (they last longer and can supply more current).

## Key points

- $R = \dfrac{\rho l}{A}$; resistivity in Ω m depends on material and temperature.
- Doubling the diameter quarters the resistance.
- Metals: $R$ rises with temperature; semiconductors: $R$ falls.
- $E = I(R + r)$; terminal p.d. $V = E - Ir$.

## WASSCE examination focus

:::callout{type=waec-tests}
**Define resistivity** with its unit and use $R = \rho l/A$ (watch unit conversions for diameters in mm), state the **factors affecting resistance**, and solve **internal-resistance problems** — finding the current, terminal p.d. or lost volts. Explain why the terminal p.d. falls when a large current is drawn.
:::

## Quick check

1. What is the unit of resistivity?
2. A cell of e.m.f. 2 V and internal resistance 1 Ω is connected to a 3 Ω resistor. Find the current.
3. What happens to the resistance of a metal wire when it is heated?

**Answers:** 1. Ohm metre (Ω m). 2. $I = \dfrac{2}{3 + 1} = 0.5$ A. 3. It increases.
