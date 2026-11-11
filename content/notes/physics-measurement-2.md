Two students measure the same stone and get densities of 2.6 and 2.9 g cm⁻³. Who is right? Possibly neither. Every measurement carries some error, and a good physicist knows where it comes from, how big it is and how to keep it small. This lesson covers errors, accuracy, significant figures and the two density experiments WASSCE sets most often.

## Learning objectives

By the end of this lesson you should be able to:

- distinguish accuracy, precision, resolution and sensitivity
- identify systematic, random and gross errors and say how to reduce each
- calculate a mean, absolute error and percentage error
- give answers to a sensible number of significant figures
- find the density of a regular and an irregular solid, with precautions

## Accuracy and precision

:::callout{type=definition}
- **Accuracy**: how close a measurement is to the true (accepted) value.
- **Precision**: how close repeated measurements are to **each other**.
- **Resolution**: the smallest change an instrument can show.
- **Sensitivity**: how much the instrument's reading changes for a given change in the quantity measured.
:::

Suppose the true length of a rod is 10.00 cm and three students each take three readings:

| Student | Readings / cm | Verdict |
|---|---|---|
| A | 9.99, 10.00, 10.01 | accurate **and** precise |
| B | 9.70, 9.71, 9.70 | precise but **not** accurate |
| C | 9.5, 10.2, 9.8 | neither precise nor accurate |

Student B's readings agree closely with each other but are all about 0.3 cm too small: something is shifting every reading the same way. That is a systematic error.

## Types of error

| Type | What it does | Typical causes | How to reduce it |
|---|---|---|---|
| **Systematic** | shifts every reading the same way | zero error, a badly calibrated instrument, parallax from the same side every time, a flawed method | check and correct the zero; calibrate; improve the method. Repeating does **not** remove it |
| **Random** | scatters readings above and below the true value | reaction time with a stopwatch, judging a moving pointer, draughts, small changes in conditions | take repeated readings and find the mean; time many oscillations |
| **Gross** (blunders) | gives one wild reading | misreading the scale, writing 63 cm for 6.3 cm, using the wrong unit | record readings at once, with units; check calculations |

:::callout{type=common-mistake}
"I repeated the readings to remove the zero error" loses the mark. A zero error is **systematic**: the same wrong zero is in every repeat. You remove it by correcting the zero or the readings.
:::

## Absolute and percentage error

For an analogue scale, the uncertainty of a single reading is usually taken as **half the smallest division** (for example ±0.05 cm on a rule marked in millimetres), unless the question says otherwise. For a digital meter it is the last digit shown.

When the true value is known:

$$\text{absolute error} = |\text{measured value} - \text{true value}|$$

$$\text{percentage error} = \dfrac{\text{absolute error}}{\text{true value}} \times 100\%$$

:::callout{type=worked-example}
**A rod of true length 50.0 cm is measured as 49.0 cm. Find the absolute and percentage errors.**

$$\text{absolute error} = |49.0 - 50.0| = 1.0\ \text{cm}$$

$$\text{percentage error} = \dfrac{1.0}{50.0} \times 100\% = 2.0\%$$
:::

### Repeated readings and the mean

Random errors push readings both ways, so the **mean** of several readings is a better estimate than any single one.

:::callout{type=worked-example}
**Five readings of a length are 12.4, 12.5, 12.3, 12.4 and 12.4 cm. Find the mean and the range.**

Sum of readings $= 12.4 + 12.5 + 12.3 + 12.4 + 12.4 = 62.0$ cm.

$$\bar{x} = \dfrac{\text{sum}}{\text{number of readings}} = \dfrac{62.0}{5} = 12.4\ \text{cm}$$

Range $= 12.5 - 12.3 = 0.2$ cm. The small range shows the readings are precise. It says nothing about a zero error shared by every reading.
:::

## Significant figures

Significant figures show how precisely a value is known.

1. Non-zero digits are significant: 347 has **3**.
2. Zeros between non-zero digits are significant: 2005 has **4**.
3. Leading zeros are **not** significant: 0.0042 has **2**.
4. Trailing zeros after a decimal point **are** significant: 4.500 has **4**.
5. A number like 1500 is ambiguous; write $1.5 \times 10^3$ (2 s.f.) or $1.50 \times 10^3$ (3 s.f.).

| Value | To 3 significant figures |
|---|---|
| 0.006847 | 0.00685 |
| 48.76 | 48.8 |
| 7496 | $7.50 \times 10^3$ |

**Rule of thumb:** when you multiply or divide, give the answer to the same number of significant figures as the **least precise** measurement used. Keep extra digits in your working and round only at the end.

## Practical: density of a regular solid

$$\rho = \dfrac{m}{V}$$

For a rectangular block of length $l$, width $w$ and height $h$, the volume is $V = l \times w \times h$.

1. Check that the balance reads zero, then find the mass $m$.
2. Measure the length, width and height with vernier calipers (or a metre rule for a large block), taking each reading in two or three places and finding the mean.
3. Convert to consistent units, calculate $V$, then $\rho$.

:::callout{type=worked-example}
**A metal block measures 5.00 cm × 2.00 cm × 1.50 cm and has a mass of 118.5 g. Find its density in g cm⁻³ and in kg m⁻³.**

$$V = 5.00 \times 2.00 \times 1.50 = 15.0\ \text{cm}^3$$

$$\rho = \dfrac{118.5}{15.0} = 7.90\ \text{g cm}^{-3}$$

Since $1\ \text{g cm}^{-3} = 1000\ \text{kg m}^{-3}$, $\rho = 7.90 \times 10^{3}\ \text{kg m}^{-3}$ (close to iron).
:::

## Practical: volume and density of an irregular solid

A stone has no simple formula for its volume, so we measure the water it pushes aside (**displacement**). The stone must not dissolve in water or soak it up.

![Two measuring cylinders: the water level rises from an initial reading to a higher final reading when an irregular stone is lowered in; the difference is the stone's volume](https://wasscetutor.com/img/physics/water-displacement-method.svg)

*Figure 1. Finding the volume of an irregular solid by displacement. WASSCE Tutor diagram.*

1. Pour water into a measuring cylinder and read the level $V_1$ at the **bottom of the meniscus**, with your eye level with it.
2. Tie the stone to a thread and **lower it gently** until it is completely under water.
3. Tap away any air bubbles clinging to it, then read the new level $V_2$.
4. Volume of stone $= V_2 - V_1$.

:::callout{type=worked-example}
**The water rises from 42 cm³ to 57 cm³ when a stone of mass 39 g is lowered in. Find the stone's density.**

$$V = 57 - 42 = 15\ \text{cm}^3 \qquad \rho = \dfrac{39}{15} = 2.6\ \text{g cm}^{-3}$$
:::

For a stone too large for a measuring cylinder, use a **eureka (displacement) can**: fill it to the spout, lower the stone in and collect the overflow in a measuring cylinder.

:::callout{type=local-example}
Gold buyers in mining areas such as Kono and Tonkolili use the same idea to spot fakes: a lump of real gold has a density of about 19.3 g cm⁻³, far higher than brass or gold-plated lead. Measure the mass, find the volume by displacement, and the density gives the game away.
:::

## Getting reliable results

- Repeat readings and use the mean when random errors are expected.
- Choose an instrument whose range and least count suit the measurement.
- Check and correct zero errors before you start.
- Read scales and menisci with your eye level with the mark.
- Record each reading straight away, with its unit, to the instrument's least count.
- Check that the final answer is sensible (a stone with a density of 260 g cm⁻³ means a unit has gone wrong).

## Key points

- Accuracy is closeness to the true value; precision is closeness of repeats to each other.
- Systematic errors shift every reading and are not removed by repeating; random errors are reduced by averaging.
- Percentage error = absolute error ÷ true value × 100%.
- Round only at the end, to the significant figures of the least precise measurement.
- Density = mass ÷ volume; find the volume of an irregular solid by displacement.

## WASSCE examination focus

:::callout{type=waec-tests}
Questions ask you to **distinguish accuracy from precision** or **systematic from random error** with examples, to **calculate a mean and a percentage error**, to **give an answer to a stated number of significant figures**, and to **describe how to find the density** of a regular or irregular solid with **precautions**. Generic precautions ("I was careful") earn nothing; name the action and the error it prevents, such as "I read the bottom of the meniscus at eye level to avoid parallax".
:::

## Quick check

1. Three readings are 9.70, 9.71 and 9.70 cm, but the true value is 10.00 cm. Are they accurate, precise, both or neither?
2. A mass of 200 g is measured as 194 g. Find the percentage error.
3. Give 0.006847 to two significant figures.
4. Water rises from 30 cm³ to 50 cm³ when a stone of mass 54 g is submerged. Find its density.
5. Why does repeating a measurement not remove a zero error?

**Answers:** 1. Precise but not accurate. 2. $\dfrac{6}{200} \times 100\% = 3\%$. 3. 0.0068. 4. $V = 20$ cm³, so $\rho = 54 \div 20 = 2.7$ g cm⁻³. 5. A zero error is systematic: the same wrong zero affects every reading, so the mean is wrong by the same amount.
