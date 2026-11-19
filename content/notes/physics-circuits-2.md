Measuring an unknown resistance or comparing two e.m.f.s accurately needs more than an ammeter and a voltmeter. The Wheatstone bridge and the potentiometer use "balance" — a zero reading — to give precise answers, and Kirchhoff's rules solve circuits that series–parallel rules cannot.

## Learning objectives

By the end of this lesson you should be able to:

- state Kirchhoff's current and voltage rules
- explain the Wheatstone bridge and use the metre bridge to find an unknown resistance
- explain the potentiometer and use it to compare e.m.f.s
- explain how a galvanometer is converted into an ammeter or a voltmeter

## Kirchhoff's rules

:::callout{type=definition}
- **Current rule (junction rule):** the total current flowing **into** a junction equals the total current flowing **out** (charge is conserved).
- **Voltage rule (loop rule):** around any closed loop, the sum of the e.m.f.s equals the sum of the p.d.s ($\sum E = \sum IR$) (energy is conserved).
:::

## The Wheatstone bridge and the metre bridge

![A metre bridge: an unknown resistance X and a known resistance R in the gaps of a frame, a uniform wire one metre long, and a galvanometer connected through a jockey; at balance the jockey divides the wire into lengths l and 100 minus l](https://wasscetutor.com/img/physics/meter-bridge.svg)

*Figure 1. The metre bridge. WASSCE Tutor diagram.*

A Wheatstone bridge is four resistors in a diamond with a galvanometer across the middle. When the galvanometer reads **zero** (the bridge is **balanced**):

$$\dfrac{P}{Q} = \dfrac{R}{S}$$

The **metre bridge** is a practical form: a uniform wire 1 m long replaces two of the resistors. Because the wire is uniform, the resistance of each part is proportional to its length. Sliding the **jockey** along the wire until the galvanometer reads zero at a distance $l$ (cm) from the end next to $X$:

$$\dfrac{X}{R} = \dfrac{l}{100 - l}$$

:::callout{type=worked-example}
**In a metre bridge, a known resistance of 6 Ω is in the right-hand gap. The balance point is 40 cm from the left end. Find the unknown resistance X in the left gap.**

$$\dfrac{X}{6} = \dfrac{40}{60} \Rightarrow X = 4\ \Omega$$
:::

**Precautions:** press the jockey lightly and briefly (do not slide it along the wire, which scrapes it); choose $R$ so the balance point is near the middle of the wire (reduces the percentage error); interchange $X$ and $R$ and average; switch off between readings to avoid heating.

The balance method is accurate because at balance **no current flows through the galvanometer**, so its resistance and calibration do not matter.

## The potentiometer

:::callout{type=definition}
A **potentiometer** is a long uniform wire carrying a steady current from a **driver cell**.
:::

The p.d. along the wire is proportional to the length. A test cell connected through a galvanometer and jockey **balances** at a length $l$ where the p.d. along the wire equals its e.m.f.

At balance **no current is drawn from the test cell**, so the potentiometer measures its **true e.m.f.** (unlike a voltmeter, which draws a little current and reads the terminal p.d.).

**Comparing two e.m.f.s:**

$$\dfrac{E_1}{E_2} = \dfrac{l_1}{l_2}$$

:::callout{type=worked-example}
**A standard cell of e.m.f. 1.02 V balances at 51.0 cm on a potentiometer wire. A dry cell balances at 75.0 cm. Find the e.m.f. of the dry cell.**

$$E_2 = 1.02 \times \dfrac{75.0}{51.0} = 1.50\ \text{V}$$
:::

## Converting a galvanometer

A **galvanometer** detects very small currents and has a small full-scale deflection (for example 5 mA) and some resistance $G$.

**Into an ammeter:** connect a small resistance, the **shunt** $S$, in **parallel**, so most of the current bypasses the galvanometer:

$$S = \dfrac{I_g G}{I - I_g}$$

**Into a voltmeter:** connect a large resistance, the **multiplier** $R$, in **series**:

$$R = \dfrac{V}{I_g} - G$$

:::callout{type=worked-example}
**A galvanometer of resistance 10 Ω gives full-scale deflection at 5 mA. Find (a) the shunt to make it read up to 1 A, (b) the multiplier to make it read up to 10 V.**

(a) $S = \dfrac{0.005 \times 10}{1 - 0.005} = \dfrac{0.05}{0.995} = 0.050$ Ω (in parallel).

(b) $R = \dfrac{10}{0.005} - 10 = 2000 - 10 = 1990$ Ω (in series).
:::

## Key points

- Kirchhoff: currents into a junction = currents out; around a loop, ΣE = ΣIR.
- Wheatstone bridge balanced when the galvanometer reads zero: $P/Q = R/S$; metre bridge $X/R = l/(100 - l)$.
- Potentiometer measures true e.m.f. (no current drawn at balance); $E_1/E_2 = l_1/l_2$.
- Galvanometer → ammeter: small shunt in parallel; → voltmeter: large multiplier in series.

## WASSCE examination focus

:::callout{type=waec-tests}
**Describe the metre bridge experiment** to find an unknown resistance (circuit, balance condition, precautions), **explain why the potentiometer is better than a voltmeter** for measuring e.m.f., and calculate **shunts and multipliers**. These are frequent in both theory and practical papers.
:::

## Quick check

1. Why is a potentiometer preferred to a voltmeter for measuring e.m.f.?
2. A metre bridge balances at 50 cm with R = 8 Ω. What is X?
3. Is a shunt connected in series or in parallel with a galvanometer?

**Answers:** 1. At balance it draws no current from the cell, so it measures the true e.m.f. 2. 8 Ω. 3. In parallel.
