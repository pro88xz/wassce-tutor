:::callout{type=definition}
A **cumulative frequency** is a running total: how many values are **up to** a certain point.
:::

"How many students scored 40 or less?" "What mark did the top 10% beat?" Questions like these are answered quickly from a **cumulative frequency curve**, also called an **ogive**. WASSCE sets an ogive question in Paper 2 very often: complete the table, draw the curve, and read off the median, the quartiles, a percentile or the number of students above a pass mark. This lesson takes you through every step, with the marks lost most often highlighted.

## Learning objectives

By the end of this lesson you should be able to:

- complete a cumulative frequency table from a frequency table
- draw a cumulative frequency curve (ogive) correctly
- read the median, quartiles and percentiles from the curve
- find the interquartile range and semi-interquartile range
- use the curve to estimate how many values lie above or below a given value

## The cumulative frequency table

Add the frequencies as you go down the table. Each cumulative frequency is matched with the **upper class boundary** of its class.

:::callout{type=worked-example}
**Complete the cumulative frequency table for the marks of 40 students.**

| Marks | Frequency | Upper class boundary | Cumulative frequency |
|---|---|---|---|
| 1–10 | 3 | 10.5 | 3 |
| 11–20 | 7 | 20.5 | 3 + 7 = 10 |
| 21–30 | 12 | 30.5 | 10 + 12 = 22 |
| 31–40 | 10 | 40.5 | 32 |
| 41–50 | 6 | 50.5 | 38 |
| 51–60 | 2 | 60.5 | 40 |

The last cumulative frequency must equal the **total** frequency, 40 ✓
:::

:::callout{type=common-mistake}
**Plotting at the class midpoint or the class limit.** A cumulative frequency counts everything **up to the end** of the class, so it is plotted at the **upper class boundary**: 10.5, 20.5, 30.5, …, not at 5.5 or 10.
:::

## Drawing the ogive

![The ogive for the marks of 40 students: cumulative frequencies 0, 3, 10, 22, 32, 38, 40 plotted at 0.5, 10.5, …, 60.5 and joined by a smooth S-shaped curve; reading across from 10, 20 and 30 gives Q1 = 20.5, the median about 29 and Q3 about 38](https://wasscetutor.com/img/mathematics/ogive.svg)

1. Horizontal axis: the variable (marks), using upper class boundaries. Vertical axis: cumulative frequency, from 0 to the total.
2. Plot each (upper boundary, cumulative frequency) point.
3. **Start the curve at zero** at the lower boundary of the first class: $(0.5, 0)$.
4. Join the points with a **smooth curve**, not straight lines. It has a stretched **S** shape.

## Reading from the ogive

For a total frequency $N$:

:::callout{type=definition}
| Measure | Read across from | For $N = 40$ |
|---|---|---|
| **lower quartile** $Q_1$ | $\tfrac14 N$ | 10 |
| **median** $Q_2$ | $\tfrac12 N$ | 20 |
| **upper quartile** $Q_3$ | $\tfrac34 N$ | 30 |
| **$p$th percentile** | $\tfrac{p}{100} N$ | e.g. 90th: 36 |

Read **across** from the cumulative frequency to the curve, then **down** to the horizontal axis.
:::

:::callout{type=worked-example}
**From the ogive above, find (a) the median, (b) the interquartile range and semi-interquartile range.**

**(a)** Across from 20, down from the curve: **median ≈ 29**.

**(b)** Across from 10: $Q_1 = 20.5$. Across from 30: $Q_3 \approx 38$.

IQR $= 38 - 20.5 = 17.5$; semi-interquartile range $\approx 8.8$.
:::

:::callout{type=tip}
Draw the reading lines on your graph with a ruler, **dashed**, and with arrows down to the axis. Examiners give marks for seeing the lines, and they make your reading more accurate. Answers within about half a small square of the true reading are accepted.
:::

### Above or below a value

Read **up** from the value on the horizontal axis to the curve, then **across** to the cumulative frequency. That gives the number **at or below** the value.

:::callout{type=worked-example}
**The pass mark is 35. Use the ogive to estimate how many students passed.**

Up from 35 to the curve, across: about **27** students scored below 35.

Students who passed $\approx 40 - 27 = $ **13**.
:::

:::callout{type=common-mistake}
**Giving the number below when the question asks for the number above.** The curve always gives "up to". For "more than", **subtract from the total**.
:::

### Percentiles

:::callout{type=worked-example}
**A scholarship goes to the top 10% of the 40 students. Estimate the lowest mark that qualifies.**

The top 10% are above the **90th percentile**: $\tfrac{90}{100} \times 40 = 36$.

Across from 36 to the curve and down: about **46 marks**.
:::

## The median by calculation

You can check the graph against the formula from the central tendency lesson:

$$\text{median} = L + \left(\frac{\tfrac{N}{2} - F}{f_m}\right) c = 20.5 + \frac{20 - 10}{12} \times 10 = 28.8$$

The curve gave about 29, so the readings agree.

:::callout{type=local-example}
**Placing students for extra lessons.** A school in Kenema plots an ogive of 200 students' BECE mathematics scores. Reading across from 50 (the lowest quarter) shows that students scoring below about 38 should join extra lessons, and reading up from 60 shows how many are already above the target. One graph answers many questions for the whole staff.
:::

## Practice

:::reveal{title="1. A cumulative frequency table ends with 60. Which cumulative frequencies give Q₁, the median and Q₃?"}
$15$, $30$ and $45$.
:::

:::reveal{title="2. The frequencies of four classes are 5, 9, 14, 12. Write the cumulative frequencies."}
5, 14, 28, 40.
:::

:::reveal{title="3. For the class 31–40, where is the cumulative frequency plotted?"}
At the upper class boundary, **40.5**.
:::

:::reveal{title="4. Using the ogive, estimate how many students scored more than 50."}
About 38 scored 50 or less (cumulative frequency at 50.5 is 38), so about $40 - 38 = 2$ scored more than 50.
:::

:::reveal{title="5. Q₁ = 24 and Q₃ = 52. Find the interquartile range and the semi-interquartile range."}
IQR $= 28$; semi-IQR $= 14$.
:::

## Key points

- **Cumulative frequency** = running total of frequencies; the last value equals the total.
- Plot at the **upper class boundary**; start at zero at the first lower boundary; join with a **smooth S-curve**.
- $Q_1$ at $\tfrac14 N$, median at $\tfrac12 N$, $Q_3$ at $\tfrac34 N$, $p$th percentile at $\tfrac{p}{100}N$.
- **IQR** $= Q_3 - Q_1$; **semi-IQR** $= \tfrac12(Q_3 - Q_1)$.
- The curve gives "**up to**"; for "more than", subtract from the total.

## WASSCE examination focus

:::callout{type=waec-tests}
The ogive is one of the most common Paper 2 statistics questions: complete the cumulative frequency table, draw the curve on graph paper with a given scale, then estimate the median, quartiles, IQR or a percentile, and the number of candidates above or below a mark. Marks are lost for plotting at midpoints, joining with straight lines, missing the starting point and not showing reading lines.
:::
