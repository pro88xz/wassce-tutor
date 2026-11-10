Real circuits combine capacitors, and a charged capacitor holds energy that can do work. This lesson covers capacitors in series and parallel, the energy stored, and the dielectric.

## Learning objectives

By the end of this lesson you should be able to:

- find the effective capacitance of capacitors in series and in parallel
- find the charge and p.d. on each capacitor in a combination
- calculate the energy stored in a capacitor
- explain the effect of a dielectric

## Capacitors in parallel

Capacitors side by side have the **same p.d.** $V$ across them; their charges add.

$$C = C_1 + C_2 + C_3$$

The combined capacitance is **larger** than any one of them (like increasing the plate area).

## Capacitors in series

Capacitors joined end to end all carry the **same charge** $Q$; their p.d.s add.

$$\dfrac{1}{C} = \dfrac{1}{C_1} + \dfrac{1}{C_2} + \dfrac{1}{C_3}$$

The combined capacitance is **smaller** than the smallest one (like increasing the plate separation). For two capacitors: $C = \dfrac{C_1C_2}{C_1 + C_2}$.

:::callout{type=common-mistake}
The rules for capacitors are the **opposite** of those for resistors: capacitors **add in parallel**, resistors **add in series**.
:::

:::callout{type=worked-example}
**Capacitors of 3 μF and 6 μF are connected in series across a 12 V supply. Find (a) the combined capacitance, (b) the charge on each, (c) the p.d. across each.**

(a) $C = \dfrac{3 \times 6}{3 + 6} = 2$ μF.

(b) $Q = CV = 2 \times 10^{-6} \times 12 = 2.4 \times 10^{-5}$ C on **each** capacitor.

(c) $V_1 = \dfrac{Q}{C_1} = \dfrac{2.4 \times 10^{-5}}{3 \times 10^{-6}} = 8$ V; $V_2 = \dfrac{2.4 \times 10^{-5}}{6 \times 10^{-6}} = 4$ V. Check: $8 + 4 = 12$ V. ✓

The **smaller** capacitor takes the **larger** p.d.
:::

:::callout{type=worked-example}
**A 2 μF capacitor is in parallel with a 4 μF capacitor, and the pair is in series with a 3 μF capacitor. Find the total capacitance.**

Parallel pair: $2 + 4 = 6$ μF. In series with 3 μF: $\dfrac{6 \times 3}{6 + 3} = 2$ μF.
:::

## Energy stored in a capacitor

Charging a capacitor needs work, because each new charge must be pushed against the charge already there. The p.d. rises steadily from 0 to $V$, so the average p.d. is $\dfrac{V}{2}$ and

$$W = \tfrac{1}{2}QV = \tfrac{1}{2}CV^2 = \dfrac{Q^2}{2C}$$

:::callout{type=worked-example}
**A camera flash capacitor of 200 μF is charged to 300 V. How much energy does it store?**

$$W = \tfrac{1}{2}CV^2 = \tfrac{1}{2} \times 200 \times 10^{-6} \times 300^2 = 9\ \text{J}$$

Released in about a thousandth of a second, this gives a power of several kilowatts.
:::

## Dielectrics

A **dielectric** is the insulating material between the plates. Placing a dielectric between the plates **increases** the capacitance by a factor $\varepsilon_r$ (the **relative permittivity** or dielectric constant):

| Material | $\varepsilon_r$ (approx.) |
|---|---|
| vacuum / air | 1 |
| paper | 3.5 |
| mica | 6 |
| ceramic | up to several thousand |

The molecules of the dielectric become slightly **polarised** in the field, producing a field that partly cancels the field of the plates. The p.d. for a given charge falls, so $C = Q/V$ rises. A dielectric also lets the plates be very close without touching, and it must not **break down** (conduct) at the working voltage.

## Types of capacitor

| Type | Features |
|---|---|
| Paper | rolled metal foil and waxed paper; cheap |
| Mica / ceramic | small values, stable, used in radio circuits |
| Electrolytic | large values (μF to thousands of μF); must be connected the right way round (polarised) |
| Variable (air) | plates turn to change the overlap; used for tuning radios |

## Key points

- Parallel: $C = C_1 + C_2 + \ldots$ (same p.d.). Series: $\dfrac{1}{C} = \dfrac{1}{C_1} + \dfrac{1}{C_2} + \ldots$ (same charge).
- Energy stored: $W = \tfrac{1}{2}QV = \tfrac{1}{2}CV^2$.
- A dielectric increases capacitance by $\varepsilon_r$.

## WASSCE examination focus

:::callout{type=waec-tests}
Combination problems are standard: find the **effective capacitance**, then the **charge** and **p.d.** on each capacitor, and the **energy stored**. Remember: in series the charge is the same; in parallel the p.d. is the same. Explain the **effect of a dielectric** on capacitance.
:::

## Quick check

1. Two 4 μF capacitors are joined in parallel. What is the combined capacitance?
2. The same two are joined in series. What is the combined capacitance?
3. Find the energy stored in a 10 μF capacitor charged to 100 V.

**Answers:** 1. 8 μF. 2. 2 μF. 3. $\tfrac{1}{2} \times 10 \times 10^{-6} \times 100^2 = 0.05$ J.
