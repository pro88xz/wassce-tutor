:::callout{type=definition}
A **logarithm** is the power to which a base must be raised to give a number: $\log_2 8 = 3$ because $2^3 = 8$. In general $\log_a N = x$ means exactly the same as $a^x = N$, where $a > 0$, $a \ne 1$ and $N > 0$.
:::

Surds, indices and logarithms are the tools for handling powers and roots exactly, and Further Mathematics uses them everywhere: in calculus, in exponential growth and decay, and in equations that cannot be solved any other way. This lesson goes beyond the core course to **rationalising compound surds**, the **square root of a surd expression**, **exponential equations** that become quadratics, the **laws of logarithms**, **change of base**, and **logarithmic equations**.

## Learning objectives

By the end of this lesson you should be able to:

- simplify surds and rationalise denominators such as $\dfrac{1}{a + \sqrt b}$
- find the square root of an expression such as $7 + 4\sqrt3$
- use the laws of indices, including negative and fractional indices
- solve exponential equations, including those that reduce to quadratics
- use the laws of logarithms and the change-of-base formula
- solve logarithmic equations and reject roots that make a logarithm undefined

## Surds

:::callout{type=definition}
**Surd:** an irrational root of a rational number, such as $\sqrt2$ or $\sqrt[3]{5}$; $\sqrt9 = 3$ is not a surd.

**Conjugate surds:** two expressions such as $a + \sqrt b$ and $a - \sqrt b$ whose product, $a^2 - b$, is rational; multiplying by the conjugate rationalises a denominator.
:::

Simplify by taking out the largest square factor: $\sqrt{72} = \sqrt{36 \times 2} = 6\sqrt2$. Only **like surds** can be added: $3\sqrt2 + 5\sqrt2 = 8\sqrt2$, but $\sqrt2 + \sqrt3$ cannot be combined.

:::callout{type=worked-example}
**Rationalise $\dfrac{6}{3 - \sqrt3}$.**

Multiply top and bottom by the conjugate $3 + \sqrt3$:

$\dfrac{6(3 + \sqrt3)}{(3 - \sqrt3)(3 + \sqrt3)} = \dfrac{6(3 + \sqrt3)}{9 - 3} = 3 + \sqrt3$.

**Simplify $\dfrac{\sqrt5 + \sqrt2}{\sqrt5 - \sqrt2}$.**

$\dfrac{(\sqrt5 + \sqrt2)^2}{5 - 2} = \dfrac{5 + 2\sqrt{10} + 2}{3} = \dfrac{7 + 2\sqrt{10}}{3}$.
:::

### The square root of a surd expression

To find $\sqrt{7 + 4\sqrt3}$, suppose it equals $\sqrt a + \sqrt b$. Squaring: $a + b + 2\sqrt{ab} = 7 + 4\sqrt3$. So $a + b = 7$ and $2\sqrt{ab} = 4\sqrt3$, giving $ab = 12$. The numbers are 4 and 3, so $\sqrt{7 + 4\sqrt3} = 2 + \sqrt3$. Check: $(2 + \sqrt3)^2 = 4 + 4\sqrt3 + 3 = 7 + 4\sqrt3$ ✓.

## Indices

| Law | Example |
|---|---|
| $a^m \times a^n = a^{m+n}$ | $2^3 \times 2^4 = 2^7$ |
| $a^m \div a^n = a^{m-n}$ | $5^6 \div 5^2 = 5^4$ |
| $(a^m)^n = a^{mn}$ | $(3^2)^3 = 3^6$ |
| $a^0 = 1$ | $7^0 = 1$ |
| $a^{-n} = \dfrac{1}{a^n}$ | $4^{-2} = \dfrac1{16}$ |
| $a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^m$ | $8^{\frac23} = 2^2 = 4$ |

:::callout{type=definition}
**Exponential equation:** an equation with the unknown in the index, such as $3^{x+1} = 5$ or $2^{2x+1} - 5(2^x) + 2 = 0$.
:::

:::callout{type=worked-example}
**Solve $2^{2x+1} - 5(2^x) + 2 = 0$.**

Write $2^{2x+1} = 2 \times (2^x)^2$ and let $y = 2^x$: $2y^2 - 5y + 2 = 0$, so $(2y - 1)(y - 2) = 0$ and $y = \tfrac12$ or $y = 2$.

$2^x = \tfrac12 = 2^{-1}$ gives $x = -1$; $2^x = 2$ gives $x = 1$.
:::

## Logarithms

:::callout{type=definition}
**Common logarithm:** a logarithm to base 10, written $\log N$ or $\lg N$.

**Natural logarithm:** a logarithm to base $e \approx 2.718$, written $\ln N$; it is the inverse of $e^x$.

**Change of base:** $\log_a N = \dfrac{\log_b N}{\log_b a}$ for any base $b$, which lets a calculator in base 10 or $e$ evaluate a logarithm in any base.
:::

The laws of logarithms follow from the laws of indices:

| Law | Example |
|---|---|
| $\log_a(MN) = \log_a M + \log_a N$ | $\log 48 = \log 16 + \log 3$ |
| $\log_a\!\left(\dfrac{M}{N}\right) = \log_a M - \log_a N$ | $\log_2 \tfrac{32}{4} = 5 - 2 = 3$ |
| $\log_a(M^k) = k\log_a M$ | $\log 8 = 3\log 2$ |
| $\log_a a = 1$, $\log_a 1 = 0$ | $\log_5 5 = 1$ |

The logarithm and the exponential undo each other, so their graphs are reflections in the line $y = x$, and $\log_a x$ exists only for $x > 0$.

![The graphs of y = 3 to the power x and y = log base 3 of x, which are reflections of each other in the line y = x; the log curve passes through (1, 0) and (3, 1) and exists only for x greater than 0](https://wasscetutor.com/img/further-mathematics/exp-log-inverse.svg)

*Figure 1. The logarithm is the inverse of the exponential. WASSCE Tutor diagram.*

:::callout{type=worked-example}
**Evaluate $\log_8 32$.**

$\log_8 32 = \dfrac{\log_2 32}{\log_2 8} = \dfrac{5}{3}$. (Check: $8^{\frac53} = 2^5 = 32$ ✓.)

**Solve $3^{x+1} = 5$, correct to 3 decimal places.**

Take logs: $(x + 1)\log 3 = \log 5$, so $x = \dfrac{\log 5}{\log 3} - 1 = 1.46497 - 1 = 0.465$.
:::

:::callout{type=worked-example}
**Solve $\log_2(x + 3) + \log_2(x - 3) = 4$.**

Combine: $\log_2[(x + 3)(x - 3)] = 4$, so $x^2 - 9 = 2^4 = 16$ and $x^2 = 25$, giving $x = 5$ or $x = -5$.

Check: $x = -5$ makes $x - 3 = -8$, and $\log_2(-8)$ is undefined. So **$x = 5$** only.
:::

:::callout{type=common-mistake}
$\log(M + N)$ is **not** $\log M + \log N$, and $\dfrac{\log M}{\log N}$ is **not** $\log M - \log N$. The laws apply to products and quotients **inside** one logarithm. And always test each answer of a logarithmic equation: a value that makes the expression inside any logarithm zero or negative must be rejected.
:::

:::callout{type=local-example}
The population of a town in the Northern Province is about $80\,000$ and grows by 4% a year, so after $t$ years it is $80\,000(1.04)^t$. To find when it reaches $120\,000$, solve $(1.04)^t = 1.5$: $t = \dfrac{\log 1.5}{\log 1.04} = \dfrac{0.17609}{0.01703} \approx 10.3$, so in about 10 to 11 years. Logarithms bring the unknown down from the index.
:::

## Practice

:::reveal{title="1. Rationalise 1/(2 + √3)."}
$\dfrac{2 - \sqrt3}{(2 + \sqrt3)(2 - \sqrt3)} = \dfrac{2 - \sqrt3}{4 - 3} = 2 - \sqrt3$.
:::

:::reveal{title="2. Find √(11 + 6√2) in the form a + √b."}
$a^2 + b = 11$ with $2a\sqrt b = 6\sqrt2$: $a = 3$, $b = 2$ gives $9 + 2 = 11$ ✓. So $3 + \sqrt2$.
:::

:::reveal{title="3. Solve 9ˣ − 4(3ˣ) + 3 = 0."}
Let $y = 3^x$: $y^2 - 4y + 3 = 0$, so $y = 1$ or $3$. Then $3^x = 1$ gives $x = 0$; $3^x = 3$ gives $x = 1$.
:::

:::reveal{title="4. Find x if logₓ 64 = 3/2."}
$x^{\frac32} = 64$, so $x = 64^{\frac23} = (\sqrt[3]{64})^2 = 4^2 = 16$.
:::

:::reveal{title="5. Given log 2 = 0.3010 and log 3 = 0.4771, find log 48."}
$\log 48 = \log(16 \times 3) = 4\log 2 + \log 3 = 1.2040 + 0.4771 = 1.6811$.
:::

## Key points

- Rationalise $\dfrac{1}{a + \sqrt b}$ by multiplying by the conjugate $a - \sqrt b$.
- $\sqrt{p + 2\sqrt q} = \sqrt a + \sqrt b$ where $a + b = p$ and $ab = q$.
- Exponential equations: make the bases equal, or substitute $y = a^x$ to get a quadratic, or take logarithms.
- $\log_a N = x \Leftrightarrow a^x = N$; logs turn products into sums and powers into multiples.
- Change of base: $\log_a N = \dfrac{\log_b N}{\log_b a}$.
- Reject any solution that makes a logarithm's argument zero or negative.

## WASSCE examination focus

:::callout{type=waec-tests}
WASSCE Further Mathematics asks you to rationalise compound surds, to solve exponential equations that reduce to quadratics, to simplify and evaluate logarithmic expressions with the laws, and to solve logarithmic equations. Questions often say "without using tables or a calculator", so show each law you use. Examiners penalise premature approximation: keep logarithms to at least 4 decimal places until the final answer, and state which roots you reject and why.
:::
