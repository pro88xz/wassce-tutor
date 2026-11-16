If today is Tuesday, what day will it be in 100 days? You do not need a calendar. You need only the remainder when 100 is divided by 7. This lesson shows how to add, subtract and multiply in modular arithmetic, how to build the operation tables WASSCE asks for, and how to solve simple congruences.

## Learning objectives

By the end of this lesson you should be able to:

- add, subtract and multiply numbers modulo $n$
- reduce numbers before calculating, to keep the arithmetic small
- construct addition and multiplication tables in modulo $n$
- solve equations such as $3x \equiv 2 \pmod 5$
- solve clock and calendar problems

## Reduce first, then calculate

In modulo $n$, you may replace any number by its remainder **before** or **after** adding, subtracting or multiplying. The answer is the same.

:::callout{type=worked-example}
**Find $(99 + 97) \bmod 7$.**

$99 = 14 \times 7 + 1$, so $99 \equiv 1$. $97 = 13 \times 7 + 6$, so $97 \equiv 6$.

$$(99 + 97) \equiv 1 + 6 = 7 \equiv 0 \pmod 7$$

**Check:** $196 = 28 \times 7$, remainder 0. ✓
:::

:::callout{type=worked-example}
**Evaluate in modulo 9: (a) $8 + 7$; (b) $4 - 7$; (c) $6 \times 8$.**

**(a)** $8 + 7 = 15 = 9 + 6$, so $8 + 7 \equiv 6 \pmod 9$.

**(b)** $4 - 7 = -3$. Add 9 to get into the range 0 to 8: $-3 + 9 = 6$, so $4 - 7 \equiv 6 \pmod 9$.

**(c)** $6 \times 8 = 48 = 5 \times 9 + 3$, so $6 \times 8 \equiv 3 \pmod 9$.
:::

:::callout{type=common-mistake}
An answer in modulo $n$ must lie between $0$ and $n - 1$. Leaving $-3$ as the answer in (b) is wrong: add $n$ until the result is in range.
:::

## Operation tables

WASSCE often asks you to complete a table for an operation in a given modulus and then use it.

**Multiplication modulo 5** (the elements are $\{1, 2, 3, 4\}$):

| $\otimes$ | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| **1** | 1 | 2 | 3 | 4 |
| **2** | 2 | 4 | 1 | 3 |
| **3** | 3 | 1 | 4 | 2 |
| **4** | 4 | 3 | 2 | 1 |

For example, $3 \otimes 4 = 12 \equiv 2$, so the entry in row 3, column 4 is 2.

From the table you can read:

- the **identity element** is 1, because $1 \otimes a = a$ for every $a$
- the **inverse** of 2 is 3, because $2 \otimes 3 = 1$ (the identity); 4 is its own inverse

## Solving congruences

To solve $ax \equiv c \pmod n$, try each value of $x$ from $0$ to $n - 1$, or read it from a table.

:::callout{type=worked-example}
**Solve $3x \equiv 2 \pmod 5$.**

From the table, $3 \otimes 4 = 2$. So $x = 4$.

**Check:** $3 \times 4 = 12 = 2 \times 5 + 2$. ✓
:::

:::callout{type=worked-example}
**Solve $x + 3 \equiv 1 \pmod 5$.**

Try values: $3 + 3 = 6 \equiv 1$. So $x = 3$.
:::

## Clock and calendar problems

![A 12-hour clock showing 9 + 5 ≡ 2 (mod 12), and the days of the week showing that 10 days after Monday is Thursday](https://wasscetutor.com/img/mathematics/mod-clock.svg)

*Figure 1. Hours work modulo 12 (or 24); days of the week work modulo 7. WASSCE Tutor diagram.*

:::callout{type=worked-example}
**Today is Tuesday. What day will it be in 100 days' time?**

$100 = 14 \times 7 + 2$, so $100 \equiv 2 \pmod 7$. Fourteen whole weeks bring you back to Tuesday; 2 more days give **Thursday**.
:::

:::callout{type=worked-example}
**A bus leaves Freetown at 21:00 hours on a journey of 9 hours. At what time does it arrive?**

The 24-hour clock works modulo 24. $21 + 9 = 30 \equiv 6 \pmod{24}$. The bus arrives at **06:00 hours** the next morning.
:::

:::callout{type=local-example}
Many Sierra Leonean communities hold a weekly market (*luma*) on the same day each week. If the Daru luma falls on a Thursday, the luma 30 days later is $30 \equiv 2 \pmod 7$ days on from a Thursday: a **Saturday**, so it is not a market day, and you can work that out in seconds.
:::

## Key points

- In modulo $n$, **reduce first** to keep numbers small; answers must lie from $0$ to $n - 1$.
- For a negative result, **add $n$** until it is in range.
- **Operation tables** show the identity element and inverses.
- Solve $ax \equiv c \pmod n$ by **trying each value** or reading the table.
- **Days:** modulo 7. **Hours:** modulo 12 or 24.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect to **evaluate sums, differences and products in a given modulus**, to **complete an operation table** and find the identity and inverses, and to **solve congruences** such as $2x + 1 \equiv 4 \pmod 5$. Calendar and clock problems are common in Paper 2.
:::

## Practice

Try each question first, then open the answer to check your working.

**1.** Evaluate $(47 \times 23) \bmod 5$.

:::reveal{title="Show the answer"}
$47 \equiv 2$ and $23 \equiv 3$, so the product $\equiv 6 \equiv 1 \pmod 5$.
:::

**2.** Evaluate $2 - 5$ in modulo 6.

:::reveal{title="Show the answer"}
$-3 + 6 = 3$.
:::

**3.** In multiplication modulo 7, find the inverse of 3.

:::reveal{title="Show the answer"}
5, because $3 \times 5 = 15 = 2 \times 7 + 1$.
:::

**4.** Solve $2x + 1 \equiv 4 \pmod 5$.

:::reveal{title="Show the answer"}
$2x \equiv 3$; trying values, $2 \times 4 = 8 \equiv 3$, so $x = 4$.
:::

**5.** If 1 January is a Monday, on what day is 1 February?

:::reveal{title="Show the answer"}
January has 31 days; $31 \equiv 3 \pmod 7$, so 1 February is 3 days after Monday: **Thursday**.
:::

