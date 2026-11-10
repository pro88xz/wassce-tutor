Every circuit — from a torch to the wiring of a house — is built from components joined in series, in parallel, or a mixture. Two simple rules let you find the current and voltage anywhere in it.

## Learning objectives

By the end of this lesson you should be able to:

- find the effective resistance of resistors in series and in parallel
- find the current through and p.d. across each resistor in a circuit
- solve mixed series–parallel problems
- explain why household appliances are connected in parallel

## Resistors in series

![Three resistors joined end to end in series, and three resistors joined side by side in parallel](https://wasscetutor.com/img/physics/resistors-series-parallel.svg)

*Figure 1. Resistors in series and in parallel. WASSCE Tutor diagram.*

In series, resistors are joined end to end, so there is only one path:

- the **same current** flows through each
- the p.d.s **add up** to the total p.d.

$$R = R_1 + R_2 + R_3$$

The total resistance is **larger** than any single resistor.

## Resistors in parallel

In parallel, resistors are connected side by side between the same two points:

- the **same p.d.** is across each
- the currents **add up** to the total current

$$\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2} + \dfrac{1}{R_3}$$

The total resistance is **smaller** than the smallest resistor. For two resistors:

$$R = \dfrac{R_1 R_2}{R_1 + R_2} \quad (\text{"product over sum"})$$

:::callout{type=worked-example}
**Find the combined resistance of (a) 4 Ω and 12 Ω in series, (b) 4 Ω and 12 Ω in parallel, (c) three 6 Ω resistors in parallel.**

(a) $4 + 12 = 16$ Ω. (b) $\dfrac{4 \times 12}{4 + 12} = 3$ Ω. (c) $\dfrac{6}{3} = 2$ Ω ($n$ equal resistors in parallel give $R/n$).
:::

## Solving circuits step by step

1. Combine resistors into a single **effective resistance**.
2. Find the **total current** from the supply: $I = \dfrac{V}{R_{total}}$ (include internal resistance if given).
3. Work back: in series, use $V = IR$ for each part; in parallel, the p.d. is shared equally and the current divides.

:::callout{type=worked-example}
**A 6 Ω resistor is connected in series with a parallel pair of 4 Ω and 12 Ω resistors, across a 12 V battery of negligible internal resistance. Find (a) the total resistance, (b) the total current, (c) the p.d. across the parallel pair, (d) the current in the 4 Ω resistor.**

(a) Parallel pair: $\dfrac{4 \times 12}{16} = 3$ Ω. Total: $6 + 3 = 9$ Ω.

(b) $I = \dfrac{12}{9} = 1.33$ A.

(c) $V = IR = 1.33 \times 3 = 4.0$ V (the 6 Ω resistor takes the other 8 V).

(d) $I_4 = \dfrac{4.0}{4} = 1.0$ A (and $I_{12} = \dfrac{4.0}{12} = 0.33$ A; together 1.33 A ✓).
:::

:::callout{type=common-mistake}
In parallel, the current takes **more** of the **easier** path: the **smaller** resistor carries the **larger** current. And always check that branch currents add up to the total.
:::

## Current division (two resistors in parallel)

For a current $I$ splitting between $R_1$ and $R_2$:

$$I_1 = I \times \dfrac{R_2}{R_1 + R_2} \qquad I_2 = I \times \dfrac{R_1}{R_1 + R_2}$$

## Why houses are wired in parallel

1. Each appliance gets the **full mains voltage**.
2. Each can be switched **on and off independently**.
3. If one appliance or bulb fails, the **others keep working**.

(Old Christmas-tree lights were wired in series: when one bulb failed, they all went out.)

:::callout{type=local-example}
In a Freetown house, the sockets, the fridge and the lights are all connected in parallel to the 230 V supply. Switching off the fan in one room does not turn off the lights.
:::

## Key points

- Series: same current; $R = R_1 + R_2 + \ldots$
- Parallel: same p.d.; $\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2} + \ldots$; two resistors: product over sum.
- Solve by combining, finding the total current, then working back.
- Household appliances are in parallel.

## WASSCE examination focus

:::callout{type=waec-tests}
Mixed series–parallel circuits appear in almost every paper: find the **effective resistance**, the **current** in a branch, or the **p.d.** across a component. Draw the circuit, label each current and p.d., and check that currents at a junction add up. Explain **why domestic appliances are connected in parallel**.
:::

## Quick check

1. Two 10 Ω resistors are in parallel. What is their combined resistance?
2. In a series circuit, which quantity is the same for every component?
3. A 3 A current divides between 2 Ω and 4 Ω resistors in parallel. What current flows in the 2 Ω resistor?

**Answers:** 1. 5 Ω. 2. The current. 3. $3 \times \dfrac{4}{6} = 2$ A.
