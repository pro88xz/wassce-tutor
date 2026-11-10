Every month, the electricity bill (or the units you top up on an EDSA prepaid meter) depends on how much electrical energy your appliances use. This lesson shows how to calculate energy and power — and how to work out what an appliance costs to run.

## Learning objectives

By the end of this lesson you should be able to:

- calculate electrical energy and power using $W = VIt$ and $P = VI$
- use the alternative forms $P = I^2R$ and $P = \dfrac{V^2}{R}$
- interpret power ratings of appliances
- calculate the cost of electrical energy in kilowatt-hours

## Electrical energy

When a charge $Q$ moves through a p.d. $V$, the energy converted is $W = QV$. Since $Q = It$:

$$W = VIt$$

Using $V = IR$, this can also be written

$$W = I^2Rt = \dfrac{V^2t}{R}$$

The energy is in **joules (J)** when $V$ is in volts, $I$ in amperes and $t$ in seconds.

## Electrical power

:::callout{type=definition}
**Electrical power** is the **rate at which electrical energy is converted** into other forms:

$$P = \dfrac{W}{t} = VI = I^2R = \dfrac{V^2}{R}$$

Its unit is the **watt (W)**: 1 W = 1 J s⁻¹ = 1 V A.
:::

:::callout{type=worked-example}
**An electric iron draws 4 A from a 240 V supply. Find (a) its power, (b) its resistance, (c) the energy it uses in 30 minutes.**

(a) $P = VI = 240 \times 4 = 960$ W.

(b) $R = \dfrac{V}{I} = \dfrac{240}{4} = 60$ Ω.

(c) $W = Pt = 960 \times 30 \times 60 = 1.728 \times 10^{6}$ J (1.73 MJ).
:::

## Power ratings

An appliance labelled **"240 V, 60 W"** converts 60 J of energy every second **when connected to 240 V**. From the rating you can find its working current and resistance:

$$I = \dfrac{P}{V} = \dfrac{60}{240} = 0.25\ \text{A} \qquad R = \dfrac{V^2}{P} = \dfrac{240^2}{60} = 960\ \Omega$$

:::callout{type=worked-example}
**A 240 V, 100 W lamp is connected to a 120 V supply. What power does it now use (assume its resistance stays constant)?**

$R = \dfrac{240^2}{100} = 576$ Ω. On 120 V: $P = \dfrac{120^2}{576} = 25$ W.

Halving the voltage reduces the power to **one quarter**, because $P \propto V^2$.
:::

:::callout{type=common-mistake}
A lamp's rated power applies only at its **rated voltage**. On a different voltage, first find its **resistance** from the rating, then calculate the new power.
:::

## The kilowatt-hour

The joule is too small for household bills, so electricity is sold in **kilowatt-hours (kWh)**, called **units**.

:::callout{type=definition}
One **kilowatt-hour** is the energy used by an appliance of power **1 kW** working for **1 hour**:

$$1\ \text{kWh} = 1000\ \text{W} \times 3600\ \text{s} = 3.6 \times 10^{6}\ \text{J}$$
:::

$$\text{energy (kWh)} = \text{power (kW)} \times \text{time (h)} \qquad \text{cost} = \text{energy (kWh)} \times \text{price per kWh}$$

:::callout{type=worked-example}
**A household uses: four 60 W bulbs for 6 hours a day, a 1.2 kW iron for 30 minutes a day, and a 150 W fridge for 24 hours a day. If one unit costs NLe 2.50, find the cost for 30 days.**

| Appliance | Power (kW) | Hours per day | kWh per day |
|---|---|---|---|
| 4 bulbs | 0.24 | 6 | 1.44 |
| Iron | 1.2 | 0.5 | 0.60 |
| Fridge | 0.15 | 24 | 3.60 |
| **Total** | | | **5.64** |

Energy in 30 days $= 5.64 \times 30 = 169.2$ kWh. Cost $= 169.2 \times 2.50 = $ **NLe 423.00**.
:::

:::callout{type=local-example}
With an EDSA prepaid meter, the "units" you buy are kilowatt-hours. Replacing four 60 W filament bulbs with 9 W LED bulbs that give the same light cuts the lighting energy by about 85%, so the same units last much longer.
:::

## Key points

- $W = VIt = I^2Rt = \dfrac{V^2t}{R}$ (J).
- $P = VI = I^2R = \dfrac{V^2}{R}$ (W).
- From a rating "V, P": $I = P/V$, $R = V^2/P$.
- 1 kWh = 3.6 × 10⁶ J; cost = kWh × price per unit.

## WASSCE examination focus

:::callout{type=waec-tests}
**Define the kilowatt-hour** and show it equals 3.6 MJ, calculate **energy, power, current and resistance** from appliance ratings, and work out an **electricity bill** from a table of appliances. Convert watts to kilowatts and minutes to hours carefully.
:::

## Quick check

1. How many joules are there in 1 kWh?
2. A 2 kW heater runs for 3 hours. How many units of electricity does it use?
3. Find the resistance of a lamp rated 240 V, 40 W.

**Answers:** 1. $3.6 \times 10^{6}$ J. 2. 6 kWh. 3. $\dfrac{240^2}{40} = 1440$ Ω.
