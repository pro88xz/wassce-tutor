:::callout{type=definition}
An **average** is a single number that represents a whole set of data: the typical mark in a class, the usual price of rice at the market, the normal household size in a village.
:::

There are three averages, the **mean**, the **median** and the **mode**, and each tells a slightly different story. WASSCE asks you to calculate all three from lists, frequency tables and grouped data, and sometimes to say which is most suitable. This lesson covers every method, including the **assumed mean** shortcut and the formulas for the median and mode of grouped data.

## Learning objectives

By the end of this lesson you should be able to:

- find the mean, median and mode of a list of numbers
- find them from a frequency table
- estimate the mean of grouped data using class midpoints, including by an assumed mean
- find the median and mode of grouped data by formula
- choose the most suitable average for a situation

## The three averages

:::callout{type=definition}
| Average | Meaning | How to find it |
|---|---|---|
| **mean** | the "fair share" value | $\bar{x} = \dfrac{\sum x}{n}$ (add them all, divide by how many) |
| **median** | the **middle** value | arrange in order; middle one (or mean of the middle two) |
| **mode** | the **most common** value | the value with the highest frequency |
:::

:::callout{type=worked-example}
**Find the mean, median and mode of: 4, 7, 3, 9, 7, 5, 7, 8, 4.**

**Mean:** $\dfrac{4 + 7 + 3 + 9 + 7 + 5 + 7 + 8 + 4}{9} = \dfrac{54}{9} = 6$

**Median:** in order, 3, 4, 4, 5, **7**, 7, 7, 8, 9. There are 9 values, so the median is the $\tfrac{9 + 1}{2} = 5$th: **7**.

**Mode:** 7 appears three times: **7**.
:::

:::callout{type=common-mistake}
**Finding the median without sorting.** The middle of the list *as given* means nothing. Always arrange the values in order first. With an **even** number of values, the median is the mean of the middle two.
:::

## From a frequency table

:::callout{type=definition}
$$\bar{x} = \frac{\sum fx}{\sum f}$$

Multiply each value by its frequency, add, and divide by the total frequency.
:::

:::callout{type=worked-example}
**The scores of 20 students in a short quiz are shown. Find the mean, median and mode.**

| Score $x$ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Frequency $f$ | 2 | 5 | 8 | 3 | 2 |
| $fx$ | 2 | 10 | 24 | 12 | 10 |

**Mean:** $\sum f = 20$, $\sum fx = 58$, so $\bar{x} = \dfrac{58}{20} = 2.9$.

**Median:** the middle of 20 values is between the 10th and 11th. Counting up the frequencies, 2 + 5 = 7 values are 1 or 2, and 7 + 8 = 15 values are 3 or less, so the 10th and 11th are both 3. **Median = 3.**

**Mode:** score 3 has the highest frequency, 8. **Mode = 3.**
:::

## Grouped data

With grouped data you do not know the exact values, so you **estimate** using the **class midpoint** $x$ for every value in the class.

:::callout{type=worked-example}
**Estimate the mean mark of 40 students.**

| Marks | 1–10 | 11–20 | 21–30 | 31–40 | 41–50 | 51–60 |
|---|---|---|---|---|---|---|
| $f$ | 3 | 7 | 12 | 10 | 6 | 2 |
| midpoint $x$ | 5.5 | 15.5 | 25.5 | 35.5 | 45.5 | 55.5 |
| $fx$ | 16.5 | 108.5 | 306 | 355 | 273 | 111 |

$$\bar{x} = \frac{\sum fx}{\sum f} = \frac{1170}{40} = 29.25$$
:::

### The assumed mean method

Large midpoints make $fx$ heavy to calculate. Choose an **assumed mean** $A$ (a midpoint near the middle), work with the **deviations** $d = x - A$, and correct at the end.

:::callout{type=definition}
$$\bar{x} = A + \frac{\sum fd}{\sum f}$$
:::

:::callout{type=worked-example}
**Repeat the last example with $A = 25.5$.**

| $x$ | 5.5 | 15.5 | 25.5 | 35.5 | 45.5 | 55.5 |
|---|---|---|---|---|---|---|
| $d = x - 25.5$ | $-20$ | $-10$ | $0$ | $10$ | $20$ | $30$ |
| $f$ | 3 | 7 | 12 | 10 | 6 | 2 |
| $fd$ | $-60$ | $-70$ | $0$ | $100$ | $120$ | $60$ |

$\sum fd = 150$, so

$$\bar{x} = 25.5 + \frac{150}{40} = 25.5 + 3.75 = 29.25 \;✓$$
:::

:::callout{type=tip}
The deviations here are all multiples of the class width (10), so the arithmetic is easy. Any choice of $A$ gives the same mean; choosing the midpoint of the class with the **highest frequency** usually keeps the numbers smallest.
:::

### Median and mode of grouped data

:::callout{type=definition}
**Median** (in the class containing the $\tfrac{N}{2}$th value):

$$\text{median} = L + \left(\frac{\tfrac{N}{2} - F}{f_m}\right) c$$

**Mode** (in the class with the highest frequency, the **modal class**):

$$\text{mode} = L + \left(\frac{D_1}{D_1 + D_2}\right) c$$

$L$ = lower class boundary of that class; $F$ = cumulative frequency **before** it; $f_m$ = its frequency; $c$ = class width; $D_1$ = modal frequency − frequency before; $D_2$ = modal frequency − frequency after.
:::

:::callout{type=worked-example}
**Find the median and mode of the marks above.**

**Median:** $\tfrac{N}{2} = 20$. Cumulative frequencies: 3, 10, 22, … so the 20th value is in $21$–$30$. $L = 20.5$, $F = 10$, $f_m = 12$, $c = 10$:

$$\text{median} = 20.5 + \frac{20 - 10}{12} \times 10 = 20.5 + 8.33 = 28.8$$

**Mode:** the modal class is $21$–$30$ (frequency 12). $D_1 = 12 - 7 = 5$, $D_2 = 12 - 10 = 2$:

$$\text{mode} = 20.5 + \frac{5}{5 + 2} \times 10 = 20.5 + 7.14 = 27.6$$
:::

## Which average to use?

| Average | Best when | Weakness |
|---|---|---|
| **mean** | the data has no extreme values; you need every value to count | pulled by extreme values |
| **median** | the data has a few very large or very small values | ignores the size of the extremes |
| **mode** | data is categorical, or you want the most popular item | may not exist, or there may be several |

:::callout{type=local-example}
**Wages in a small business in Bo.** Five workers earn NLe 1500, 1600, 1600, 1700 and 1800 a month, and the owner takes NLe 12 000. The **mean** monthly income is $\dfrac{20\,200}{6} \approx$ NLe 3367, about twice what any worker earns. The **median**, NLe 1650, describes a typical worker far better. When someone quotes an "average", ask which one.
:::

## Practice

:::reveal{title="1. Find the mean and median of 12, 15, 11, 18, 14, 16."}
Mean $= \dfrac{86}{6} = 14.3$. In order: 11, 12, 14, 15, 16, 18; median $= \dfrac{14 + 15}{2} = 14.5$.
:::

:::reveal{title="2. The mean of 5 numbers is 8. Four of them are 6, 9, 7 and 10. Find the fifth."}
Total $= 5 \times 8 = 40$. Fifth $= 40 - 32 = 8$.
:::

:::reveal{title="3. The mean of x, x + 2, x + 4 and 2x is 9. Find x."}
$\dfrac{5x + 6}{4} = 9 \Rightarrow 5x + 6 = 36 \Rightarrow x = 6$.
:::

:::reveal{title="4. Find the mean of: x = 10, 20, 30, 40 with f = 4, 6, 7, 3."}
$\sum fx = 40 + 120 + 210 + 120 = 490$; $\sum f = 20$; mean $= 24.5$.
:::

:::reveal{title="5. In the local example, find the mode and explain whether it is a good average here."}
The mode is NLe 1600 (it appears twice). It describes a typical worker reasonably well, but it is based on only two values; the median is more reliable.
:::

## Key points

- **Mean** $= \dfrac{\sum x}{n}$ or $\dfrac{\sum fx}{\sum f}$; **median** = middle value in order; **mode** = most frequent.
- Grouped data: use **class midpoints**; the mean is an **estimate**.
- **Assumed mean**: $\bar{x} = A + \dfrac{\sum fd}{\sum f}$.
- Grouped median $= L + \left(\dfrac{N/2 - F}{f_m}\right)c$; mode $= L + \left(\dfrac{D_1}{D_1 + D_2}\right)c$.
- Extreme values pull the **mean**; the **median** resists them.

## WASSCE examination focus

:::callout{type=waec-tests}
Every year WASSCE asks for the mean of a frequency table or grouped data (often "using an assumed mean of …"), and frequently the median and mode too. Objective questions test averages of short lists and finding a missing value from a given mean. Show the full table with $fx$ or $fd$ columns: the table itself earns marks.
:::
