A teacher's salary rises by the same amount every year. A bacterial colony doubles every hour. The first grows like an **arithmetic progression**, the second like a **geometric progression**. With four formulas you can find any term, or the total of any number of terms, of either kind. This lesson develops those formulas and the WASSCE problems built on them.

## Learning objectives

By the end of this lesson you should be able to:

- find the $n$-th term and the sum of $n$ terms of an arithmetic progression (AP)
- find the $n$-th term and the sum of $n$ terms of a geometric progression (GP)
- find the sum to infinity of a GP when it exists
- find the first term, common difference or common ratio from given terms
- solve word problems using APs and GPs

## Arithmetic progressions

![Bars for the AP 3, 7, 11, 15, 19 rising in equal steps, and for the GP 1, 2, 4, 8, 16 growing faster and faster](https://wasscetutor.com/img/mathematics/ap-gp-terms.svg)

*Figure 1. An AP adds the common difference; a GP multiplies by the common ratio. WASSCE Tutor diagram.*

An AP has first term $a$ and common difference $d$:

$$T_n = a + (n - 1)d \qquad S_n = \frac{n}{2}\left[2a + (n - 1)d\right] = \frac{n}{2}(a + l)$$

where $l$ is the last term.

:::callout{type=worked-example}
**For the AP 5, 9, 13, …, find (a) the 20th term (b) the sum of the first 20 terms.**

$a = 5$, $d = 4$.

**(a)** $T_{20} = 5 + 19 \times 4 = 81$

**(b)** $S_{20} = \dfrac{20}{2}(2 \times 5 + 19 \times 4) = 10(10 + 76) = 860$
:::

:::callout{type=worked-example}
**Which term of the AP 7, 11, 15, … is 99?**

$7 + (n - 1)4 = 99 \Rightarrow (n - 1)4 = 92 \Rightarrow n - 1 = 23 \Rightarrow n = 24$. It is the 24th term.
:::

:::callout{type=worked-example}
**The 3rd term of an AP is 11 and the 7th term is 27. Find the first term and the common difference.**

$$a + 2d = 11 \qquad a + 6d = 27$$

Subtracting: $4d = 16$, so $d = 4$ and $a = 11 - 8 = 3$.
:::

**Three terms in AP:** $x$, $y$, $z$ are in AP when $y - x = z - y$, that is, $2y = x + z$.

:::callout{type=worked-example}
**Find $k$ if $k$, $2k + 1$ and $5k - 2$ are consecutive terms of an AP.**

$2(2k + 1) = k + (5k - 2) \Rightarrow 4k + 2 = 6k - 2 \Rightarrow k = 2$. The terms are 2, 5, 8.
:::

## Geometric progressions

A GP has first term $a$ and common ratio $r$:

$$T_n = ar^{n-1} \qquad S_n = \frac{a(r^n - 1)}{r - 1} \;(r > 1) \quad\text{or}\quad S_n = \frac{a(1 - r^n)}{1 - r} \;(r < 1)$$

:::callout{type=worked-example}
**For the GP 3, 6, 12, …, find (a) the 8th term (b) the sum of the first 8 terms.**

$a = 3$, $r = 2$.

**(a)** $T_8 = 3 \times 2^7 = 384$

**(b)** $S_8 = \dfrac{3(2^8 - 1)}{2 - 1} = 3 \times 255 = 765$
:::

:::callout{type=worked-example}
**The 2nd term of a GP is 6 and the 5th term is 162. Find $a$ and $r$.**

$$ar = 6 \qquad ar^4 = 162$$

Dividing: $r^3 = 27$, so $r = 3$ and $a = 2$.
:::

**Three terms in GP:** $x$, $y$, $z$ are in GP when $\dfrac{y}{x} = \dfrac{z}{y}$, that is, $y^2 = xz$.

## Sum to infinity

When $-1 < r < 1$, the terms get smaller and smaller and the sum approaches a fixed value:

$$S_\infty = \frac{a}{1 - r}$$

:::callout{type=worked-example}
**Find the sum to infinity of $16 + 8 + 4 + 2 + \cdots$**

$a = 16$, $r = \tfrac{1}{2}$: $S_\infty = \dfrac{16}{1 - \frac{1}{2}} = 32$.
:::

:::callout{type=worked-example}
**Use a GP to write $0.\dot{3}$ as a fraction.**

$0.333\ldots = \tfrac{3}{10} + \tfrac{3}{100} + \tfrac{3}{1000} + \cdots$, a GP with $a = \tfrac{3}{10}$ and $r = \tfrac{1}{10}$.

$S_\infty = \dfrac{3/10}{1 - 1/10} = \dfrac{3/10}{9/10} = \dfrac{1}{3}$
:::

:::callout{type=common-mistake}
A GP with $r \ge 1$ or $r \le -1$ has **no** sum to infinity: its terms do not shrink. Check $|r| < 1$ before using $S_\infty = \dfrac{a}{1 - r}$.
:::

## Word problems

:::callout{type=local-example}
**A teacher in Makeni starts on an annual salary of NLe 36,000, with an increase of NLe 2,400 each year.**

This is an AP with $a = 36\,000$ and $d = 2\,400$.

- Salary in the 10th year: $36\,000 + 9 \times 2\,400 = $ NLe 57,600.
- Total earned in 10 years: $\dfrac{10}{2}(36\,000 + 57\,600) = 5 \times 93\,600 = $ NLe 468,000.
:::

:::callout{type=worked-example}
**A machine bought for NLe 80,000 loses 20% of its value each year. Find its value after 3 years.**

Each year's value is $0.8$ of the year before: a GP with $a = 80\,000$, $r = 0.8$. After 3 years the value is $80\,000 \times 0.8^3 = 80\,000 \times 0.512 = $ NLe 40,960.
:::

## Key points

- **AP:** $T_n = a + (n - 1)d$; $S_n = \tfrac{n}{2}[2a + (n - 1)d] = \tfrac{n}{2}(a + l)$; middle term condition $2y = x + z$.
- **GP:** $T_n = ar^{n-1}$; $S_n = \dfrac{a(r^n - 1)}{r - 1}$; middle term condition $y^2 = xz$.
- **Sum to infinity** $\dfrac{a}{1 - r}$ exists only if $|r| < 1$.
- Two given terms give **two equations**: subtract for an AP, divide for a GP.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect to **find a particular term or the sum of terms**, to **find $a$, $d$ or $r$ from two given terms**, to **use the middle-term conditions** for three consecutive terms, and to **solve salary, savings and depreciation problems**. State clearly whether you are using an AP or a GP.
:::

## Practice

Try each question first, then open the answer to check your working.

**1.** Find the 15th term of the AP $-4, -1, 2, \ldots$

:::reveal{title="Show the answer"}
$-4 + 14 \times 3 = 38$.
:::

**2.** Find the sum of the first 12 terms of the AP $2, 5, 8, \ldots$

:::reveal{title="Show the answer"}
$\tfrac{12}{2}(4 + 11 \times 3) = 6 \times 37 = 222$.
:::

**3.** Find the 6th term of the GP $81, 27, 9, \ldots$

:::reveal{title="Show the answer"}
$81 \times \left(\tfrac{1}{3}\right)^5 = \tfrac{81}{243} = \tfrac{1}{3}$.
:::

**4.** Find the sum to infinity of $27 + 9 + 3 + \cdots$

:::reveal{title="Show the answer"}
$\dfrac{27}{1 - \frac{1}{3}} = 40.5$.
:::

**5.** If $x$, 12 and 48 are consecutive terms of a GP, find $x$.

:::reveal{title="Show the answer"}
$12^2 = 48x$, so $x = 3$.
:::

