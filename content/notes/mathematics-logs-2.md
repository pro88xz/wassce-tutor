Before calculators, engineers and navigators multiplied large numbers by **adding their logarithms**. That trick rests on three laws. Today the same laws let you simplify expressions, solve equations where the unknown is a power, and handle the logarithm questions that appear in every WASSCE paper.

## Learning objectives

By the end of this lesson you should be able to:

- state and apply the three laws of logarithms
- use $\log_a a = 1$ and $\log_a 1 = 0$
- simplify and evaluate logarithmic expressions without tables
- solve logarithmic equations and equations of the form $a^x = b$
- use given values of logarithms, and use common logarithms in calculations

## The laws of logarithms

For a positive base $a \ne 1$ and positive numbers $M$ and $N$:

| Law | Rule |
|---|---|
| Product law | $\log_a (MN) = \log_a M + \log_a N$ |
| Quotient law | $\log_a \left(\dfrac{M}{N}\right) = \log_a M - \log_a N$ |
| Power law | $\log_a (M^k) = k \log_a M$ |
| Special values | $\log_a a = 1$ and $\log_a 1 = 0$ |
| Change of base | $\log_a b = \dfrac{\log b}{\log a}$ (using any common base, such as 10) |

These follow from the laws of indices: multiplying powers adds indices, so taking logs turns multiplication into addition.

:::callout{type=common-mistake}
$\log (M + N)$ is **not** $\log M + \log N$, and $\dfrac{\log M}{\log N}$ is **not** $\log M - \log N$. The laws apply to the log of a **product** or **quotient**, not to sums or to fractions of logs.
:::

## Simplifying and evaluating

:::callout{type=worked-example}
**Evaluate (a) $\log_2 8 + \log_2 4$ (b) $\log_{10} 25 + \log_{10} 4$ (c) $\dfrac{\log 8}{\log 2}$.**

**(a)** $\log_2 (8 \times 4) = \log_2 32 = 5$, since $2^5 = 32$.

**(b)** $\log_{10} (25 \times 4) = \log_{10} 100 = 2$.

**(c)** $\dfrac{\log 2^3}{\log 2} = \dfrac{3 \log 2}{\log 2} = 3$.
:::

:::callout{type=worked-example}
**Simplify $2 \log 3 + \log 4 - \log 36$.**

Since $2\log 3 = \log 9$, the expression is

$$\log \left(\frac{9 \times 4}{36}\right) = \log 1 = 0$$
:::

## Using given values

:::callout{type=worked-example}
**Given $\log 2 = 0.3010$ and $\log 3 = 0.4771$, find (a) $\log 12$ (b) $\log 1.5$ (c) $\log 18$.**

**(a)** $\log 12 = \log (4 \times 3) = 2\log 2 + \log 3 = 0.6020 + 0.4771 = 1.0791$

**(b)** $\log 1.5 = \log \tfrac{3}{2} = 0.4771 - 0.3010 = 0.1761$

**(c)** $\log 18 = \log (2 \times 9) = \log 2 + 2 \log 3 = 0.3010 + 0.9542 = 1.2552$
:::

## Solving logarithmic equations

Use the laws to collect the logs into one, then rewrite in index form: $\log_a x = y \iff x = a^y$.

:::callout{type=worked-example}
**Solve (a) $\log_2 (x + 3) = 4$ (b) $\log x + \log (x - 3) = 1$.**

**(a)** $x + 3 = 2^4 = 16$, so $x = 13$.

**(b)** $\log [x(x - 3)] = 1$, so $x(x - 3) = 10^1 = 10$.

$$x^2 - 3x - 10 = 0 \quad\Rightarrow\quad (x - 5)(x + 2) = 0$$

$x = 5$ or $x = -2$. But $\log(-2)$ is undefined, so **$x = 5$** only.
:::

:::callout{type=common-mistake}
Always check solutions of log equations in the original equation. The logarithm of zero or of a negative number does not exist, so such roots must be rejected.
:::

## Solving $a^x = b$

Take logs of both sides and use the power law.

:::callout{type=worked-example}
**Solve $2^x = 7$, correct to 2 decimal places.**

$$x \log 2 = \log 7 \quad\Rightarrow\quad x = \frac{\log 7}{\log 2} = \frac{0.8451}{0.3010} = 2.81$$
:::

## Calculating with common logarithms

Common logarithms (base 10) can be found from four-figure tables. A logarithm has a **characteristic** (the whole-number part, set by the position of the decimal point) and a **mantissa** (the decimal part, read from the tables). For numbers less than 1, the characteristic is negative and is written with a bar: $\bar{2}.7126$ means $-2 + 0.7126$.

:::callout{type=worked-example}
**Use logarithms to evaluate $3.42 \times 0.0516$.**

| Number | Logarithm |
|---|---|
| 3.42 | 0.5340 |
| 0.0516 | $\bar{2}.7126$ |
| Sum | $\bar{1}.2466$ |

The mantissa 0.2466 is the log of 1.765, and the characteristic $\bar{1}$ places the decimal point: the answer is $0.1765$.

**Check:** $3.42 \times 0.0516 = 0.176\,472$. ✓
:::

## Key terms

:::callout{type=definition title="Key terms"}
- **Characteristic**: the whole-number part of a common logarithm, set by the position of the decimal point.
- **Mantissa**: the decimal part of a common logarithm, read from four-figure tables.
- **Bar notation**: a bar over a negative characteristic, as in $\bar{2}.7126$, which means $-2 + 0.7126$.
- **Product law**: the logarithm of a product is the sum of the logarithms: $\log ab = \log a + \log b$.
- **Quotient law**: the logarithm of a quotient is the difference of the logarithms: $\log \dfrac{a}{b} = \log a - \log b$.
- **Power law**: the logarithm of a power is the index times the logarithm: $\log a^n = n \log a$.
:::

## Key points

- **Product:** add logs. **Quotient:** subtract logs. **Power:** bring the index to the front.
- $\log_a a = 1$, $\log_a 1 = 0$; change of base: $\log_a b = \dfrac{\log b}{\log a}$.
- To solve log equations, **combine into one log**, convert to index form, and **reject** roots that make a log undefined.
- To solve $a^x = b$, **take logs** of both sides.
- In tables, the **characteristic** fixes the decimal point; the **mantissa** comes from the tables.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect to **simplify expressions using the laws**, to **evaluate logs from given values** of $\log 2$ and $\log 3$, to **solve logarithmic equations** (often reducing to quadratics), and to **use tables** in Paper 2 calculations. Never write $\log(a + b) = \log a + \log b$.
:::

## Practice

Try each question first, then open the answer to check your working.

**1.** Evaluate $\log_3 54 - \log_3 2$.

:::reveal{title="Show the answer"}
$\log_3 27 = 3$.
:::

**2.** Simplify $\log 5 + \log 20$.

:::reveal{title="Show the answer"}
$\log 100 = 2$.
:::

**3.** Given $\log 2 = 0.3010$, find $\log 0.8$.

:::reveal{title="Show the answer"}
$\log \tfrac{8}{10} = 3(0.3010) - 1 = -0.0970$ (or $\bar{1}.9030$).
:::

**4.** Solve $\log_3 (2x - 1) = 2$.

:::reveal{title="Show the answer"}
$2x - 1 = 9$, so $x = 5$.
:::

**5.** Solve $\log_2 x + \log_2 (x + 2) = 3$.

:::reveal{title="Show the answer"}
$x(x + 2) = 8$, $x^2 + 2x - 8 = 0$, $(x + 4)(x - 2) = 0$; reject $-4$, so $x = 2$.
:::

