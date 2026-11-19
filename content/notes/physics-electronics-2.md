A transistor is a switch with no moving parts and an amplifier no bigger than a grain of rice. Billions of them, joined into logic gates, make up the processor in every phone. This lesson introduces the transistor and the logic gates built from it.

## Learning objectives

By the end of this lesson you should be able to:

- describe the structure and action of an n-p-n transistor
- explain the transistor as a switch and as an amplifier
- describe sensor circuits using LDRs and thermistors
- write truth tables for the NOT, AND, OR, NAND and NOR gates

## The transistor

:::callout{type=definition}
A **bipolar transistor** is a sandwich of three layers of semiconductor: **n-p-n** or **p-n-p**.
:::

Its three terminals are the **emitter (E)**, **base (B)** and **collector (C)**. The base is very thin and lightly doped.

**Action (n-p-n):**

- With the **base–emitter** junction **forward-biased** (base about 0.7 V above the emitter) and the **collector–base** junction reverse-biased, electrons flow from emitter to base. Because the base is thin, most of them sweep on to the **collector**.
- A **small base current** $I_B$ therefore controls a **much larger collector current** $I_C$.

$$I_E = I_B + I_C \qquad \beta = \dfrac{I_C}{I_B}$$

where $\beta$ is the **current gain**, typically 50 to 500.

:::callout{type=worked-example}
**A transistor has a current gain of 100. If the base current is 50 μA, find the collector current and the emitter current.**

$$I_C = \beta I_B = 100 \times 50\ \mu\text{A} = 5\ \text{mA} \qquad I_E = 5 + 0.05 = 5.05\ \text{mA}$$
:::

### The transistor as a switch

- When the base voltage is **below about 0.7 V**, no base current flows, so **no collector current** flows: the transistor is **OFF**.
- When the base voltage is **above about 0.7 V**, a base current flows and a large collector current flows: the transistor is **ON**.

A small current can therefore switch a lamp, buzzer, motor or relay on and off.

### The transistor as an amplifier

Because small changes in base current produce large changes in collector current, a transistor can **amplify** weak signals — from a microphone, a radio aerial or a guitar pickup — into strong ones for a loudspeaker.

## Sensor circuits

A **potential divider** of a sensor and a fixed resistor sets the base voltage:

| Sensor | Behaviour | Example circuit |
|---|---|---|
| **LDR** (light-dependent resistor) | resistance **falls** in light | **automatic night light**: when it gets dark, the LDR's resistance rises, the base voltage rises, and the transistor switches a lamp **on** |
| **Thermistor** | resistance **falls** as temperature rises | **fire or overheating alarm**: when it gets hot, the transistor switches on a buzzer |

:::callout{type=local-example}
Solar street lamps across Sierra Leone switch themselves on at dusk using exactly this idea: a light sensor in a potential divider drives a transistor (or a chip containing many) that switches on the lamp.
:::

## Logic gates

Digital circuits work with two states: **1 (high, on)** and **0 (low, off)**. A **logic gate** produces an output that depends on its inputs according to a rule shown in a **truth table**.

**NOT gate (inverter)** — the output is the opposite of the input.

| A | Output |
|---|---|
| 0 | 1 |
| 1 | 0 |

**AND, OR, NAND and NOR gates** (two inputs A and B):

| A | B | AND | OR | NAND | NOR |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 | 1 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 |

- **AND**: output 1 only if **both** inputs are 1.
- **OR**: output 1 if **either or both** inputs are 1.
- **NAND** = NOT AND; **NOR** = NOT OR.

:::callout{type=worked-example}
**A security light must come on only when it is dark AND movement is detected. Which gate is needed?**

An **AND** gate: inputs "dark" (1 when dark) and "movement" (1 when movement). Output 1 (light on) only when both are 1.
:::

NAND and NOR gates are called **universal** gates: any logic circuit can be built from NAND gates alone (or NOR gates alone).

## Key points

- Transistor: E, B, C; a small base current controls a large collector current ($\beta = I_C/I_B$).
- As a switch: OFF below about 0.7 V at the base, ON above.
- LDR and thermistor potential dividers make light- and temperature-operated switches.
- Logic gates: NOT, AND, OR, NAND, NOR, each defined by a truth table.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect to **label the terminals of a transistor**, **explain its use as a switch or amplifier**, calculate **current gain**, and **complete truth tables** for logic gates or simple combinations of them. You may be asked to **choose a gate** for a given practical situation.
:::

## Quick check

1. Name the three terminals of a transistor.
2. What is the output of a NOR gate when both inputs are 0?
3. A transistor's base current is 20 μA and its collector current is 4 mA. What is its current gain?

**Answers:** 1. Emitter, base and collector. 2. 1. 3. $\beta = \dfrac{4 \times 10^{-3}}{20 \times 10^{-6}} = 200$.
