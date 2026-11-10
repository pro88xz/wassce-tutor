Flip a switch and the bulb lights instantly, yet the electrons in the wire crawl along at less than a millimetre a second. Electric current is a flow of charge driven by a potential difference, and Ohm's law ties the two together.

## Learning objectives

By the end of this lesson you should be able to:

- define electric current, potential difference and e.m.f., with their units
- state Ohm's law and use $V = IR$
- connect ammeters and voltmeters correctly in a circuit
- interpret current–voltage graphs for ohmic and non-ohmic conductors

## Electric current

:::callout{type=definition}
**Electric current** is the **rate of flow of electric charge**:

$$I = \dfrac{Q}{t}$$

Its unit is the **ampere (A)**. One ampere is a flow of one coulomb per second (1 A = 1 C s⁻¹).
:::

In metals, current is carried by **free electrons**, which move from the negative terminal towards the positive. By convention, the direction of **conventional current** is from **positive to negative** (the direction positive charge would move).

:::callout{type=worked-example}
**A current of 0.5 A flows through a lamp for 2 minutes. How much charge passes? How many electrons is that? (e = 1.6 × 10⁻¹⁹ C)**

$$Q = It = 0.5 \times 120 = 60\ \text{C} \qquad n = \dfrac{60}{1.6 \times 10^{-19}} = 3.75 \times 10^{20}\ \text{electrons}$$
:::

## Potential difference and e.m.f.

:::callout{type=definition}
The **potential difference (p.d.)** between two points in a circuit is the **work done (energy converted) per unit charge** moving between them: $V = \dfrac{W}{Q}$. Unit: the **volt** (1 V = 1 J C⁻¹).

The **electromotive force (e.m.f.)** $E$ of a cell is the **total energy supplied per unit charge** that it drives round a complete circuit — equal to the p.d. across its terminals when it supplies **no current** (open circuit).
:::

## The circuit and its meters

![A circuit with a cell, a switch, an ammeter in series and a resistor, with a voltmeter connected in parallel across the resistor](https://wasscetutor.com/img/physics/simple-circuit.svg)

*Figure 1. The ammeter goes in series; the voltmeter goes in parallel. WASSCE Tutor diagram.*

| Meter | Measures | Connected | Ideal resistance |
|---|---|---|---|
| **Ammeter** | current | in **series** | very **low** (so it does not reduce the current) |
| **Voltmeter** | potential difference | in **parallel** across the component | very **high** (so it draws almost no current) |

## Ohm's law

:::callout{type=definition}
**Ohm's law:** the current flowing through a metallic conductor is **directly proportional** to the potential difference across its ends, provided the **temperature and other physical conditions remain constant**.

$$V = IR$$

The constant $R$ is the **resistance**, measured in **ohms (Ω)**: 1 Ω = 1 V A⁻¹.
:::

:::callout{type=worked-example}
**A p.d. of 12 V across a resistor drives a current of 0.4 A. Find its resistance. What current flows if the p.d. is raised to 18 V?**

$$R = \dfrac{V}{I} = \dfrac{12}{0.4} = 30\ \Omega \qquad I = \dfrac{18}{30} = 0.6\ \text{A}$$
:::

### Verifying Ohm's law (practical)

1. Connect a cell (or variable supply), a rheostat, an ammeter and the resistor (e.g. a coil of wire) in series, with a voltmeter across the resistor.
2. Adjust the rheostat to get different currents; record $I$ and $V$ each time (at least five readings).
3. Plot $V$ against $I$. A **straight line through the origin** verifies Ohm's law; its gradient is $R$.

**Precautions:** keep the current small and switch off between readings so the wire does not heat up; check for zero errors on the meters; ensure tight connections.

## Current–voltage graphs

![Three current-voltage graphs: a straight line through the origin for an ohmic resistor, an S-shaped curve that flattens for a filament lamp, and a curve that rises only for positive voltage for a diode](https://wasscetutor.com/img/physics/iv-graphs.svg)

*Figure 2. Ohmic and non-ohmic conductors. WASSCE Tutor diagram.*

| Component | Graph | Behaviour |
|---|---|---|
| Metal wire at constant temperature | straight line through the origin | **ohmic**: $R$ constant |
| Filament lamp | curve that flattens | **non-ohmic**: resistance **rises** as the filament heats |
| Semiconductor diode | current only in one direction (above about 0.6 V) | **non-ohmic**: conducts forward, blocks reverse |
| Thermistor | current rises more steeply as it warms | resistance **falls** as temperature rises |

## Key points

- $I = Q/t$ (A); conventional current flows from + to −.
- p.d. $V = W/Q$ (V); e.m.f. is the energy per coulomb supplied by the source.
- Ammeter in series (low resistance); voltmeter in parallel (high resistance).
- Ohm's law: $V = IR$ at constant temperature; $R$ in ohms.
- Ohmic conductors give a straight-line I–V graph; lamps and diodes do not.

## WASSCE examination focus

:::callout{type=waec-tests}
**Define current, p.d. and e.m.f.**, **state Ohm's law** (with the condition "temperature constant"), and **describe the experiment to verify it** with a circuit diagram, graph and precautions. You may be asked to **sketch I–V graphs** for a wire, a filament lamp and a diode. Calculations with $V = IR$ and $Q = It$ are routine.
:::

## Quick check

1. How is an ammeter connected in a circuit?
2. A 6 V battery drives 0.2 A through a resistor. Find the resistance.
3. Why is the I–V graph of a filament lamp curved?

**Answers:** 1. In series. 2. $R = 6 \div 0.2 = 30$ Ω. 3. As the current increases, the filament gets hotter and its resistance increases.
