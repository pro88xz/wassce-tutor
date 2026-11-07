## Learning objectives

By the end of this lesson you should be able to:

- calculate the mean, median and mode of a set of data
- state an advantage and a disadvantage of each
- calculate the range and the standard deviation, and say what they show

## Measures of central tendency

A **measure of central tendency** is a single figure that represents the middle or typical value of a set of data. The three you need are the **mean**, the **median** and the **mode**.

:::callout{type=worked-example}
A phone-credit kiosk in Makeni records its sales (in NLe) for one week:

**12, 15, 15, 18, 20, 22, 38**

We will use these seven figures for every calculation in this lesson.
:::

### The mean (arithmetic mean)

:::callout{type=definition}
The **mean** is the sum of all the values divided by the number of values:

$$\bar{x} = \dfrac{\sum x}{n}$$
:::

For the kiosk: $\sum x = 12 + 15 + 15 + 18 + 20 + 22 + 38 = 140$ and $n = 7$, so

$$\bar{x} = \dfrac{140}{7} = 20$$

The mean daily sales are **NLe 20**.

- **Advantage:** it uses every value, and it is well understood.
- **Disadvantage:** it is pulled up or down by extreme values. Here the one very good day (NLe 38) lifts the mean above what the kiosk takes on most days.

### The median

:::callout{type=definition}
The **median** is the middle value when the data are arranged in order of size. If there is an even number of values, it is the mean of the two middle values.
:::

The kiosk figures are already in order. With 7 values, the middle one is the 4th: **NLe 18**.

- **Advantage:** it is not affected by extreme values, so it gives a fairer "typical" figure here.
- **Disadvantage:** it ignores most of the values, and the data must be arranged in order first.

:::callout{type=worked-example}
**Even number of values.** For the data 4, 7, 9, 12 the two middle values are 7 and 9, so the median is $\dfrac{7 + 9}{2} = 8$.
:::

### The mode

:::callout{type=definition}
The **mode** is the value that occurs most often.
:::

NLe 15 appears twice; every other value appears once, so the mode is **NLe 15**.

- **Advantage:** it is easy to find and useful for things like the most popular shoe size a trader should stock.
- **Disadvantage:** there may be no mode, or more than one, and it ignores the other values.

:::callout{type=common-mistake}
Do not give the *frequency* as the mode. In the kiosk data the mode is **15** (the value), not **2** (the number of times it occurs).
:::

## Measures of dispersion

Two sets of data can have the same mean but be spread out very differently. **Measures of dispersion** show how spread out the values are.

### The range

$$\text{range} = \text{highest value} - \text{lowest value}$$

For the kiosk: $38 - 12 = 26$. The range is quick to work out but depends only on the two extreme values.

### The standard deviation

The **standard deviation** measures how far, on average, the values lie from the mean. The larger it is, the more spread out the data.

$$\sigma = \sqrt{\dfrac{\sum (x - \bar{x})^2}{n}}$$

:::callout{type=worked-example}
Find the standard deviation of **2, 4, 4, 4, 5, 5, 7, 9**.

1. Mean: $\bar{x} = \dfrac{40}{8} = 5$
2. Deviations from the mean, squared:

| $x$ | $x - \bar{x}$ | $(x - \bar{x})^2$ |
|---|---|---|
| 2 | −3 | 9 |
| 4 | −1 | 1 |
| 4 | −1 | 1 |
| 4 | −1 | 1 |
| 5 | 0 | 0 |
| 5 | 0 | 0 |
| 7 | 2 | 4 |
| 9 | 4 | 16 |
| | **Total** | **32** |

3. Variance: $\dfrac{32}{8} = 4$
4. Standard deviation: $\sigma = \sqrt{4} = 2$
:::

The **variance** is the square of the standard deviation (here, 4).

## Key points

| Measure | How to find it | Kiosk data |
|---|---|---|
| Mean | Sum ÷ number of values | NLe 20 |
| Median | Middle value in order | NLe 18 |
| Mode | Most frequent value | NLe 15 |
| Range | Highest − lowest | NLe 26 |

The standard deviation is the square root of the mean of the squared deviations from the mean.

## WASSCE examination focus

:::callout{type=waec-tests}
You may be given a short set of figures and asked to **calculate** the mean, median, mode or standard deviation, then **comment** on them. Show every step in a table, give units, and round only at the end. For the "comment" part, say which measure best represents the data and why (for example, the median when there are extreme values).
:::

## Quick check

1. Find the mean, median and mode of 3, 8, 8, 10, 11.
2. Why might the median be a better measure than the mean for the kiosk's sales?
3. Two classes both have a mean mark of 60%. Class A's standard deviation is 5; Class B's is 15. What does this tell you?

**Answers:** 1. Mean $= \dfrac{40}{5} = 8$; median $= 8$; mode $= 8$. 2. Because one unusually high day (NLe 38) pulls the mean up, while the median is not affected by extreme values. 3. Class B's marks are much more spread out; Class A's marks are closer together around 60%.
