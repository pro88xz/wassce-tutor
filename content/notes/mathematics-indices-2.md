How do you simplify $81^{3/4} \times 27^{-2/3}$ without a calculator? With the **laws of indices**, it takes three lines. These laws turn powers into simple additions and subtractions of exponents, and they are tested in almost every WASSCE paper.

## Learning objectives

By the end of this lesson you should be able to:

- state and apply the laws of indices
- interpret zero, negative and fractional indices
- simplify expressions involving indices
- solve indicial (exponential) equations, including those that reduce to quadratics

## The laws of indices

For any non-zero base $a$ and any numbers $m$ and $n$:

| Law | Rule | Example |
|---|---|---|
| Multiplication | $a^m \times a^n = a^{m+n}$ | $2^3 \times 2^4 = 2^7$ |
| Division | $a^m \div a^n = a^{m-n}$ | $5^6 \div 5^2 = 5^4$ |
| Power of a power | $(a^m)^n = a^{mn}$ | $(3^2)^4 = 3^8$ |
| Power of a product | $(ab)^n = a^n b^n$ | $(2x)^3 = 8x^3$ |
| Zero index | $a^0 = 1$ | $7^0 = 1$ |
| Negative index | $a^{-n} = \dfrac{1}{a^n}$ | $2^{-3} = \dfrac{1}{8}$ |
| Fractional index | $a^{\frac{1}{n}} = \sqrt[n]{a}$, and $a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^m$ | $8^{\frac{2}{3}} = 2^2 = 4$ |

:::callout{type=common-mistake}
The laws apply only when the **bases are the same**. $2^3 \times 3^2$ cannot be combined into one power. And $2^3 + 2^3 = 16$, not $2^6$: there is no law for adding powers.
:::

## Evaluating with fractional and negative indices

For $a^{\frac{m}{n}}$, take the root first (it keeps the numbers small), then the power. For a negative index, take the reciprocal.

:::callout{type=worked-example}
**Evaluate (a) $27^{-\frac{1}{3}}$ (b) $\left(\tfrac{16}{81}\right)^{-\frac{3}{4}}$ (c) $3^0 + 4^{\frac{1}{2}} + 2^{-1}$.**

**(a)** $27^{-\frac{1}{3}} = \dfrac{1}{27^{\frac{1}{3}}} = \dfrac{1}{3}$

**(b)** Flip the fraction to remove the negative sign: $\left(\tfrac{81}{16}\right)^{\frac{3}{4}} = \left(\tfrac{3}{2}\right)^3 = \tfrac{27}{8}$, since $\sqrt[4]{81} = 3$ and $\sqrt[4]{16} = 2$.

**(c)** $1 + 2 + \tfrac{1}{2} = 3\tfrac{1}{2}$
:::

:::callout{type=worked-example}
**Simplify $\dfrac{81^{\frac{3}{4}} \times 27^{-\frac{2}{3}}}{3^{-1}}$.**

$81^{\frac{3}{4}} = (\sqrt[4]{81})^3 = 3^3 = 27$. $27^{-\frac{2}{3}} = \dfrac{1}{(\sqrt[3]{27})^2} = \dfrac{1}{9}$. Dividing by $3^{-1}$ means multiplying by 3.

$$27 \times \tfrac{1}{9} \times 3 = 9$$

**Another way:** write everything as a power of 3: $3^3 \times 3^{-2} \div 3^{-1} = 3^{3 - 2 + 1} = 3^2 = 9$.
:::

## Simplifying algebraic expressions

:::callout{type=worked-example}
**Simplify $(2a^3b)^2 \times 3a^{-2}b$.**

$(2a^3b)^2 = 4a^6b^2$. Then $4a^6b^2 \times 3a^{-2}b = 12a^{6-2}b^{2+1} = 12a^4b^3$.
:::

## Indicial equations

Write both sides as powers of the **same base**, then equate the indices.

:::callout{type=worked-example}
**Solve (a) $2^{x+1} = 32$ (b) $9^x = 27$ (c) $\left(\tfrac{1}{4}\right)^{x} = 8$.**

**(a)** $2^{x+1} = 2^5$, so $x + 1 = 5$ and $x = 4$.

**(b)** $3^{2x} = 3^3$, so $2x = 3$ and $x = \tfrac{3}{2}$.

**(c)** $2^{-2x} = 2^3$, so $-2x = 3$ and $x = -\tfrac{3}{2}$.
:::

### Equations that become quadratics

:::callout{type=worked-example}
**Solve $4^{x} - 3 \times 2^{x} - 4 = 0$.**

Since $4^x = (2^2)^x = (2^x)^2$, let $y = 2^x$:

$$y^2 - 3y - 4 = 0 \quad\Rightarrow\quad (y - 4)(y + 1) = 0 \quad\Rightarrow\quad y = 4 \text{ or } y = -1$$

$2^x = 4$ gives $x = 2$. $2^x = -1$ has no solution, because a power of 2 is always positive. So $x = 2$.
:::

## Key points

- **Same base:** multiply → add indices; divide → subtract; power of a power → multiply.
- $a^0 = 1$; $a^{-n} = \dfrac{1}{a^n}$; $a^{\frac{m}{n}} = (\sqrt[n]{a})^m$: **root first, then power**.
- To solve indicial equations, **make the bases equal** and equate indices.
- Substitute $y = a^x$ when the equation contains $a^{2x}$ and $a^x$; reject negative values of $a^x$.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect to **evaluate expressions with fractional and negative indices without a calculator**, to **simplify algebraic expressions**, and to **solve indicial equations**, including those that reduce to quadratics. Show each law you use; method marks depend on it.
:::

## Quick check

1. Evaluate $16^{\frac{3}{4}}$.
2. Evaluate $\left(\tfrac{8}{27}\right)^{-\frac{2}{3}}$.
3. Simplify $\dfrac{6x^5y^2}{2x^2y^{-1}}$.
4. Solve $3^{2x-1} = 81$.
5. Solve $9^x - 4 \times 3^x + 3 = 0$.

**Answers:**

1. $(\sqrt[4]{16})^3 = 2^3 = 8$.
2. $\left(\tfrac{27}{8}\right)^{\frac{2}{3}} = \left(\tfrac{3}{2}\right)^2 = \tfrac{9}{4}$.
3. $3x^3y^3$.
4. $3^{2x-1} = 3^4$, so $2x - 1 = 4$ and $x = \tfrac{5}{2}$.
5. Let $y = 3^x$: $y^2 - 4y + 3 = 0$, $(y - 1)(y - 3) = 0$, so $3^x = 1$ or $3$, giving $x = 0$ or $x = 1$.
