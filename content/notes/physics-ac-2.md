A phone charger turns 230 V into 5 V; the substation on the hill turns 11 000 V into 230 V. Both use a transformer — two coils and an iron core, with no moving parts. This lesson also covers how resistors, inductors and capacitors behave on a.c.

## Learning objectives

By the end of this lesson you should be able to:

- describe the structure and action of a transformer
- use $\dfrac{V_s}{V_p} = \dfrac{N_s}{N_p}$ and the efficiency of a transformer
- explain the energy losses in a transformer and how they are reduced
- describe the behaviour of resistors, inductors and capacitors in a.c. circuits

## The transformer

![A transformer: a primary coil and a secondary coil wound on a laminated soft-iron core; Vs over Vp equals Ns over Np](https://wasscetutor.com/img/physics/transformer.svg)

*Figure 1. A transformer. WASSCE Tutor diagram.*

A transformer has a **primary coil** and a **secondary coil** wound on a **laminated soft-iron core**.

**How it works:** an **alternating** current in the primary produces a **changing magnetic flux** in the core. The core carries this flux through the secondary coil, where it **induces an alternating e.m.f.** (mutual induction). A transformer **does not work on d.c.**, because a steady current produces no changing flux.

### The turns ratio

$$\dfrac{V_s}{V_p} = \dfrac{N_s}{N_p}$$

| Type | Turns | Voltage | Use |
|---|---|---|---|
| **Step-up** | $N_s > N_p$ | $V_s > V_p$ | power stations, for transmission |
| **Step-down** | $N_s < N_p$ | $V_s < V_p$ | substations, phone chargers, doorbells |

### An ideal transformer

If no energy is lost, power in = power out:

$$V_pI_p = V_sI_s \Rightarrow \dfrac{I_s}{I_p} = \dfrac{V_p}{V_s} = \dfrac{N_p}{N_s}$$

Stepping **up** the voltage steps **down** the current, and vice versa.

:::callout{type=worked-example}
**A transformer steps 230 V down to 11.5 V for a doorbell. The primary has 2000 turns. (a) How many turns are on the secondary? (b) If the bell draws 2 A, what current flows in the primary (assume 100% efficiency)?**

(a) $N_s = N_p\dfrac{V_s}{V_p} = 2000 \times \dfrac{11.5}{230} = 100$ turns.

(b) $I_p = \dfrac{V_sI_s}{V_p} = \dfrac{11.5 \times 2}{230} = 0.1$ A.
:::

### Efficiency

$$\eta = \dfrac{\text{output power}}{\text{input power}} \times 100\% = \dfrac{V_sI_s}{V_pI_p} \times 100\%$$

:::callout{type=worked-example}
**A transformer takes 2.0 A from a 240 V supply and delivers 9.0 A at 48 V. Find its efficiency.**

$$\eta = \dfrac{48 \times 9.0}{240 \times 2.0} \times 100\% = \dfrac{432}{480} \times 100\% = 90\%$$
:::

### Energy losses and how they are reduced

| Loss | Cause | Reduced by |
|---|---|---|
| **Copper (I²R) loss** | heating in the resistance of the coils | thick copper wire of low resistance |
| **Eddy-current loss** | currents induced in the iron core | **laminating** the core (thin insulated sheets) |
| **Hysteresis loss** | energy used in repeatedly magnetising and demagnetising the core | a **soft-iron** core (easily magnetised) |
| **Flux leakage** | not all the primary's flux passes through the secondary | winding the coils on top of each other on a well-designed core |

Large transformers are cooled with **oil** and cooling fins.

## Resistors, inductors and capacitors on a.c.

| Component | Opposition to a.c. | Phase relation |
|---|---|---|
| **Resistor** | resistance $R$ (independent of frequency) | current **in phase** with voltage |
| **Inductor** | **inductive reactance** $X_L = 2\pi fL$ (rises with frequency) | current **lags** voltage by 90° |
| **Capacitor** | **capacitive reactance** $X_C = \dfrac{1}{2\pi fC}$ (falls with frequency) | current **leads** voltage by 90° |

So an inductor passes **low** frequencies easily and blocks high ones; a capacitor blocks **d.c.** and low frequencies and passes high ones.

In a series **RLC** circuit the total opposition is the **impedance** $Z = \sqrt{R^2 + (X_L - X_C)^2}$. When $X_L = X_C$ the circuit is at **resonance**, with frequency

$$f_0 = \dfrac{1}{2\pi\sqrt{LC}}$$

— the principle of **tuning a radio** to a station.

:::callout{type=worked-example}
**Find the reactance of a 10 μF capacitor at 50 Hz.**

$$X_C = \dfrac{1}{2\pi \times 50 \times 10 \times 10^{-6}} = \dfrac{1}{3.14 \times 10^{-3}} = 318\ \Omega$$
:::

## Key points

- A transformer needs a.c.; $\dfrac{V_s}{V_p} = \dfrac{N_s}{N_p}$; ideal: $V_pI_p = V_sI_s$.
- Step-up for transmission, step-down for use.
- Losses: copper (thick wires), eddy currents (laminated core), hysteresis (soft iron), flux leakage.
- $X_L = 2\pi fL$, $X_C = 1/(2\pi fC)$; resonance at $f_0 = 1/(2\pi\sqrt{LC})$.

## WASSCE examination focus

:::callout{type=waec-tests}
**Describe the transformer** and explain why it works only on a.c., use the **turns-ratio** and **efficiency** equations, and **explain the energy losses** and how each is reduced. Reactance and resonance appear in some theory questions on a.c. circuits.
:::

## Quick check

1. Why does a transformer not work with d.c.?
2. A transformer has 500 primary turns and 50 secondary turns. The input is 240 V. What is the output voltage?
3. Why is the core of a transformer laminated?

**Answers:** 1. A steady d.c. produces no changing magnetic flux, so no e.m.f. is induced in the secondary. 2. 24 V. 3. To reduce eddy-current losses.
