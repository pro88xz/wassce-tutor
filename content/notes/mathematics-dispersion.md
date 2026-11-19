Two okada riders both earn an average of NLe 200 a day. One earns between NLe 180 and NLe 220 every day; the other earns NLe 100 on some days and NLe 300 on others. The averages are the same, but the riders' lives are very different. **Measures of dispersion** describe this difference: how **spread out** the data is around its average. WASSCE asks for the range, the interquartile range, the mean deviation, the variance and, most often, the **standard deviation**. This lesson explains what each measures and how to calculate it from lists, frequency tables and grouped data.

## Learning objectives

By the end of this lesson you should be able to:

- explain why an average alone does not describe data fully
- find the range, interquartile range and semi-interquartile range
- calculate the mean deviation
- calculate the variance and standard deviation of a list, a frequency table and grouped data
- compare the consistency of two data sets

## Why spread matters

![Set A (4, 5, 5, 6, 6, 6, 7, 7, 8) and set B (1, 2, 4, 6, 6, 6, 8, 10, 11) as dot plots: both have mean 6, but A has range 4 and B has range 10](https://wasscetutor.com/img/mathematics/dispersion-dotplots.svg)

Both sets have a mean of 6. Set A is **clustered** round the mean; set B is **spread out**. A measure of dispersion puts a number on that difference. A **small** value means **consistent** data.

## Range and interquartile range

:::callout{type=definition}
- **Range** $=$ largest value $-$ smallest value.
- **Interquartile range** (IQR) $= Q_3 - Q_1$, the spread of the **middle half** of the data.
- **Semi-interquartile range** $= \tfrac12(Q_3 - Q_1)$.

For $n$ values in order: $Q_1$ is the $\tfrac{n+1}{4}$th value, the median the $\tfrac{n+1}{2}$th, and $Q_3$ the $\tfrac{3(n+1)}{4}$th.
:::

:::callout{type=worked-example}
**Find the range and the interquartile range of: 3, 5, 6, 8, 9, 11, 12, 14, 15, 18, 20.**

Range $= 20 - 3 = 17$.

$n = 11$. $Q_1$ is the 3rd value: **6**. $Q_3$ is the 9th value: **15**.

IQR $= 15 - 6 = 9$; semi-interquartile range $= 4.5$.
:::

:::callout{type=tip}
The **range** uses only the two extreme values, so one unusual value changes it a lot. The **IQR** ignores the top and bottom quarters, so it is not affected by extreme values. For grouped data, the quartiles are read from a cumulative frequency curve (see the cumulative frequency lesson).
:::

## Mean deviation

:::callout{type=definition}
The **mean deviation** is the average distance of the values from the mean, ignoring signs.
:::

:::callout{type=definition}
$$\text{mean deviation} = \frac{\sum |x - \bar{x}|}{n} \qquad \text{or} \qquad \frac{\sum f|x - \bar{x}|}{\sum f}$$

$|x - \bar{x}|$ means the distance, always positive.
:::

:::callout{type=worked-example}
**Find the mean deviation of 3, 5, 6, 8, 13.**

$\bar{x} = \dfrac{35}{5} = 7$.

| $x$ | 3 | 5 | 6 | 8 | 13 |
|---|---|---|---|---|---|
| $\lvert x - 7\rvert$ | 4 | 2 | 1 | 1 | 6 |

Mean deviation $= \dfrac{4 + 2 + 1 + 1 + 6}{5} = \dfrac{14}{5} = 2.8$.
:::

## Variance and standard deviation

The **standard deviation** is the most important measure of spread. It **squares** each deviation (which removes the signs), averages the squares, then takes the square root to return to the original units.

:::callout{type=definition}
$$\text{variance } \sigma^2 = \frac{\sum (x - \bar{x})^2}{n} \qquad \text{standard deviation } \sigma = \sqrt{\frac{\sum (x - \bar{x})^2}{n}}$$

An equivalent form, often quicker:

$$\sigma = \sqrt{\frac{\sum x^2}{n} - \bar{x}^2}$$

For a frequency table, put $f$ in front: $\sigma = \sqrt{\dfrac{\sum f(x - \bar{x})^2}{\sum f}}$.
:::

:::callout{type=worked-example}
**Find the standard deviation of 2, 4, 4, 4, 5, 5, 7, 9.**

$\bar{x} = \dfrac{40}{8} = 5$.

| $x$ | 2 | 4 | 4 | 4 | 5 | 5 | 7 | 9 |
|---|---|---|---|---|---|---|---|---|
| $x - 5$ | $-3$ | $-1$ | $-1$ | $-1$ | 0 | 0 | 2 | 4 |
| $(x - 5)^2$ | 9 | 1 | 1 | 1 | 0 | 0 | 4 | 16 |

$\sum (x - \bar{x})^2 = 32$. Variance $= \dfrac{32}{8} = 4$. **Standard deviation $= \sqrt4 = 2$.**
:::

:::callout{type=worked-example}
**Find the standard deviation of the quiz scores.**

| $x$ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| $f$ | 2 | 5 | 8 | 3 | 2 |
| $fx$ | 2 | 10 | 24 | 12 | 10 |
| $fx^2$ | 2 | 20 | 72 | 48 | 50 |

$\sum f = 20$, $\sum fx = 58$, $\sum fx^2 = 192$. Mean $= 2.9$.

$$\sigma = \sqrt{\frac{192}{20} - 2.9^2} = \sqrt{9.6 - 8.41} = \sqrt{1.19} = 1.09$$
:::

### Grouped data with an assumed mean

With deviations $d = x - A$ from an assumed mean:

:::callout{type=definition}
$$\sigma = \sqrt{\frac{\sum fd^2}{\sum f} - \left(\frac{\sum fd}{\sum f}\right)^2}$$
:::

:::callout{type=worked-example}
**Find the standard deviation of the marks of 40 students, using $A = 25.5$.**

| Marks | 1–10 | 11–20 | 21–30 | 31–40 | 41–50 | 51–60 |
|---|---|---|---|---|---|---|
| $f$ | 3 | 7 | 12 | 10 | 6 | 2 |
| $d$ | $-20$ | $-10$ | 0 | 10 | 20 | 30 |
| $fd$ | $-60$ | $-70$ | 0 | 100 | 120 | 60 |
| $fd^2$ | 1200 | 700 | 0 | 1000 | 2400 | 1800 |

$\sum fd = 150$, $\sum fd^2 = 7100$.

$$\sigma = \sqrt{\frac{7100}{40} - \left(\frac{150}{40}\right)^2} = \sqrt{177.5 - 14.06} = \sqrt{163.44} = 12.8$$
:::

:::callout{type=common-mistake}
**Forgetting the square root**, so giving the variance as the standard deviation. Or **squaring $\sum fd$** instead of computing $\sum fd^2$ term by term. Add separate columns for $fd$ and $fd^2$ to keep them apart.
:::

:::callout{type=local-example}
**Two okada riders in Makeni** each record their takings for five days.

- Rider A: NLe 180, 200, 210, 190, 220. Mean NLe 200, standard deviation NLe 14.1.
- Rider B: NLe 100, 300, 150, 250, 200. Mean NLe 200, standard deviation NLe 70.7.

Same mean, but Rider A's income is five times more **consistent**. A rider with rent and school fees to pay on fixed dates prefers Rider A's pattern, and the standard deviation shows why.
:::

## Practice

:::reveal{title="1. Find the range of 14, 9, 22, 17, 5, 12."}
$22 - 5 = 17$.
:::

:::reveal{title="2. Find the mean deviation of 2, 4, 6, 8, 10."}
Mean 6; distances 4, 2, 0, 2, 4; mean deviation $= \dfrac{12}{5} = 2.4$.
:::

:::reveal{title="3. Find the standard deviation of 6, 8, 10, 12, 14."}
Mean 10; squared deviations 16, 4, 0, 4, 16, total 40. $\sigma = \sqrt{40/5} = \sqrt8 = 2.83$.
:::

:::reveal{title="4. If every value in a data set is increased by 5, what happens to the mean and the standard deviation?"}
The mean **increases by 5**; the standard deviation is **unchanged** (every value moves by the same amount, so the spread is the same).
:::

:::reveal{title="5. Find the interquartile range of 4, 7, 8, 10, 12, 15, 18."}
$n = 7$: $Q_1$ is the 2nd value (7), $Q_3$ the 6th (15). IQR $= 8$.
:::

## Key points

- An average alone does not describe data; you also need its **spread**.
- **Range** = largest − smallest; **IQR** = $Q_3 - Q_1$; semi-IQR = half of that.
- **Mean deviation** = average distance from the mean.
- **Standard deviation** $\sigma = \sqrt{\dfrac{\sum f(x - \bar{x})^2}{\sum f}}$ $= \sqrt{\dfrac{\sum fx^2}{\sum f} - \bar{x}^2}$; with an assumed mean, use $d$ and $d^2$.
- **Smaller** spread = more **consistent** data.

## WASSCE examination focus

:::callout{type=waec-tests}
Standard deviation appears regularly in Paper 2, usually from a grouped frequency table after the mean, often with an assumed mean. Objective questions test the range, mean deviation and the effect of adding a constant to the data. Set out the table with every column ($x$, $f$, $d$, $fd$, $fd^2$) and give the answer to the accuracy asked.
:::
