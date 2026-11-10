The electricity from the wall socket is not a steady push in one direction: it reverses fifty times every second. Alternating current is easy to generate and, above all, easy to transform to different voltages — which is why every power grid uses it.

## Learning objectives

By the end of this lesson you should be able to:

- describe alternating current and its waveform
- define peak value, frequency, period and r.m.s. value
- convert between peak and r.m.s. values
- compare a.c. and d.c.

## What is alternating current?

:::callout{type=definition}
**Alternating current (a.c.)** is a current that **periodically reverses its direction**, usually varying sinusoidally with time. **Direct current (d.c.)** flows in **one direction** only.
:::

![An alternating voltage varying as a sine wave between plus and minus the peak value; the r.m.s. value is 0.707 of the peak](https://wasscetutor.com/img/physics/ac-waveform.svg)

*Figure 1. An alternating voltage. WASSCE Tutor diagram.*

$$V = V_0\sin\omega t = V_0\sin 2\pi f t$$

| Term | Meaning |
|---|---|
| **Peak value** $V_0$ or $I_0$ | the maximum value of the voltage or current |
| **Period** $T$ | time for one complete cycle |
| **Frequency** $f$ | number of cycles per second, $f = 1/T$ (mains: 50 Hz in Sierra Leone) |
| **Peak-to-peak value** | $2V_0$ |

## The r.m.s. value

Because an alternating current keeps changing, we need a single "effective" value to compare it with d.c.

:::callout{type=definition}
The **root-mean-square (r.m.s.)** value of an alternating current is the value of the **steady direct current** that would produce the **same heating effect** in the same resistor:

$$I_{rms} = \dfrac{I_0}{\sqrt{2}} \approx 0.707\,I_0 \qquad V_{rms} = \dfrac{V_0}{\sqrt{2}} \approx 0.707\,V_0$$
:::

Mains voltages are always quoted as **r.m.s.** values. Sierra Leone's mains supply is about **230 V r.m.s.**, so its peak value is about $230 \times \sqrt{2} \approx 325$ V.

:::callout{type=worked-example}
**An alternating voltage has a peak value of 340 V and a frequency of 50 Hz. Find (a) the r.m.s. voltage, (b) the period.**

(a) $V_{rms} = \dfrac{340}{\sqrt{2}} = 240$ V. (b) $T = \dfrac{1}{50} = 0.02$ s.
:::

:::callout{type=worked-example}
**An a.c. supply of 220 V r.m.s. is connected to a 55 Ω heater. Find (a) the r.m.s. current, (b) the peak current, (c) the average power.**

(a) $I_{rms} = \dfrac{220}{55} = 4$ A.

(b) $I_0 = 4\sqrt{2} = 5.66$ A.

(c) $P = V_{rms} \times I_{rms} = 220 \times 4 = 880$ W.
:::

:::callout{type=common-mistake}
Power calculations with a.c. use **r.m.s.** values ($P = V_{rms}I_{rms}$). Using peak values gives twice the real average power.
:::

## Measuring a.c.

- Ordinary **moving-coil** meters cannot read a.c. directly (the needle would try to swing back and forth 50 times a second and stay at zero). They are used with a **rectifier**.
- **Moving-iron** and **hot-wire** meters work with both a.c. and d.c., and read r.m.s. values.
- A **cathode-ray oscilloscope (CRO)** displays the waveform, so the peak value and period can be read directly.

## a.c. versus d.c.

| | a.c. | d.c. |
|---|---|---|
| direction | reverses periodically | one direction |
| sources | generators (alternators), the mains | cells, batteries, solar cells, rectified a.c. |
| voltage can be changed by a transformer | **yes** | **no** |
| transmission over long distances | efficient (step up with transformers) | less convenient |
| needed for | most household appliances | electroplating, charging batteries, electronics |

**Rectification** converts a.c. into d.c. using diodes (covered with semiconductors). Phone chargers contain a transformer, a rectifier and a smoothing capacitor.

## Key points

- a.c. reverses direction periodically; mains frequency in Sierra Leone is 50 Hz.
- $V_{rms} = 0.707\,V_0$, $I_{rms} = 0.707\,I_0$; mains is about 230 V r.m.s. (about 325 V peak).
- r.m.s. value = steady d.c. giving the same heating effect.
- a.c. can be transformed to high or low voltages; d.c. cannot.

## WASSCE examination focus

:::callout{type=waec-tests}
**Define the r.m.s. value** of an alternating current and use $I_{rms} = I_0/\sqrt{2}$, read **peak value and period** from a waveform, and **compare a.c. and d.c.** (including why a.c. is used for transmission). Calculations of power with r.m.s. values are common.
:::

## Quick check

1. The peak value of an alternating current is 10 A. What is its r.m.s. value?
2. What is the period of a 50 Hz supply?
3. Why is a.c. rather than d.c. used in the national grid?

**Answers:** 1. $10 \times 0.707 = 7.07$ A. 2. 0.02 s. 3. Its voltage can be stepped up and down with transformers, so power can be transmitted at high voltage with small losses.
