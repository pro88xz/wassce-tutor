:::callout{type=definition}
The **binomial theorem** is the rule for expanding a power of a two-term expression, $(a + b)^n$: each term is a binomial coefficient times a power of $a$ times a power of $b$, with the two powers always adding up to $n$. For a positive whole number $n$,

$$(a + b)^n = a^n + \binom{n}{1}a^{n-1}b + \binom{n}{2}a^{n-2}b^2 + \dots + \binom{n}{r}a^{n-r}b^r + \dots + b^n$$
:::

Multiplying out $(2 + x)^5$ by hand takes five rounds of brackets and invites mistakes; the binomial theorem writes it down in one line. It also finds a single term, such as the term independent of $x$, without expanding everything, and gives quick approximations such as $(1.02)^5$. This lesson covers **Pascal's triangle**, the **binomial coefficients** $\binom{n}{r}$, the **general term**, **approximations**, and expansions with **negative and fractional indices**.

## Learning objectives

By the end of this lesson you should be able to:

- build Pascal's triangle and read binomial coefficients from it
- calculate $\binom{n}{r}$ from factorials
- expand $(a + b)^n$ for a positive whole number $n$
- write down and use the general term $T_{r+1}$
- find a particular coefficient and the term independent of $x$
- use an expansion to approximate a number such as $(1.02)^5$
- expand $(1 + x)^n$ for a negative or fractional $n$ and state when it is valid

## Pascal's triangle

:::callout{type=definition}
**Pascal's triangle:** a triangle of numbers in which each row starts and ends with 1 and every other number is the sum of the two numbers above it. Row $n$ gives the coefficients of $(a + b)^n$.

**Factorial:** $n!$ (read "$n$ factorial") is the product of the whole numbers from $n$ down to 1, such as $5! = 5 \times 4 \times 3 \times 2 \times 1 = 120$; by definition $0! = 1$.

**Binomial coefficient:** the number $\binom{n}{r}$, also written ${}^nC_r$, that multiplies $a^{n-r}b^r$ in the expansion of $(a + b)^n$.
:::

![Pascal's triangle from row 0 to row 6, with 4 and 6 in row 4 adding to give 10 in row 5](https://wasscetutor.com/img/further-mathematics/pascals-triangle.svg)

*Figure 1. Pascal's triangle: row 5, 1 5 10 10 5 1, gives the coefficients of (a + b)⁵. WASSCE Tutor diagram.*

For larger $n$, use factorials instead of building the triangle:

$$\binom{n}{r} = \frac{n!}{r!\,(n - r)!}, \qquad \text{for example } \binom{6}{2} = \frac{6 \times 5}{2 \times 1} = 15$$

The coefficients are symmetric: $\binom{n}{r} = \binom{n}{n - r}$, so $\binom{9}{7} = \binom{9}{2} = 36$.

## Expanding $(a + b)^n$

In every term the powers of $a$ fall by one and the powers of $b$ rise by one, and they always add up to $n$.

:::callout{type=worked-example}
**Expand $(2 + x)^5$.**

Row 5: $1, 5, 10, 10, 5, 1$.

$(2 + x)^5 = 2^5 + 5(2^4)x + 10(2^3)x^2 + 10(2^2)x^3 + 5(2)x^4 + x^5$

$= 32 + 80x + 80x^2 + 40x^3 + 10x^4 + x^5$
:::

:::callout{type=common-mistake}
When the second term is negative, its sign must go inside the powers: in $(1 - 2x)^6$ the terms use $(-2x)^r$, so the signs alternate and the coefficients are powers of 2. Writing $-2x^3$ for $(-2x)^3 = -8x^3$ is the most common slip.
:::

## The general term

:::callout{type=definition}
**General term:** the $(r + 1)$th term of $(a + b)^n$, $T_{r+1} = \binom{n}{r}a^{n-r}b^r$; it lets you find any one term without expanding the rest.

**Term independent of x:** the term of an expansion that contains no $x$ (the constant term), found by making the total power of $x$ in the general term equal to zero.
:::

:::callout{type=worked-example}
**Find the coefficient of $x^3$ in the expansion of $(1 - 2x)^6$.**

$T_{r+1} = \binom{6}{r}(1)^{6-r}(-2x)^r$. For $x^3$, $r = 3$: $\binom{6}{3}(-2)^3 = 20 \times (-8) = -160$.

**Find the term independent of $x$ in $\left(x^2 - \dfrac{1}{x}\right)^6$.**

$T_{r+1} = \binom{6}{r}(x^2)^{6-r}\left(-\dfrac{1}{x}\right)^r = \binom{6}{r}(-1)^r x^{12 - 2r - r} = \binom{6}{r}(-1)^r x^{12 - 3r}$.

The power is zero when $12 - 3r = 0$, so $r = 4$: the term is $\binom{6}{4}(-1)^4 = 15$.
:::

## Approximations

When $x$ is small, the later terms of $(1 + x)^n$ are tiny, so the first few terms give a good approximation.

:::callout{type=worked-example}
**Use the first three terms of the expansion of $(1 + x)^5$ to find $(1.02)^5$ to 3 decimal places.**

$(1 + x)^5 = 1 + 5x + 10x^2 + \dots$ With $x = 0.02$:

$(1.02)^5 \approx 1 + 5(0.02) + 10(0.0004) = 1 + 0.1 + 0.004 = 1.104$.

(The exact value is $1.10408\dots$, so the approximation is correct to 3 decimal places.)
:::

## Negative and fractional indices

For any rational $n$ and $-1 < x < 1$:

$$(1 + x)^n = 1 + nx + \frac{n(n - 1)}{2!}x^2 + \frac{n(n - 1)(n - 2)}{3!}x^3 + \dots$$

:::callout{type=definition}
**Range of validity:** the values of $x$ for which an infinite binomial expansion converges to the expression; for $(1 + x)^n$ with $n$ negative or fractional it is $|x| < 1$, and for $(1 + bx)^n$ it is $|bx| < 1$.
:::

The series never ends, because $n(n - 1)(n - 2)\dots$ never reaches zero.

:::callout{type=worked-example}
**Expand $(1 - 2x)^{-\frac12}$ as far as the term in $x^3$, and state the range of validity.**

With $n = -\tfrac12$ and $-2x$ in place of $x$:

- $nx$: $\left(-\tfrac12\right)(-2x) = x$
- $\dfrac{n(n-1)}{2!}x^2$: $\dfrac{\left(-\tfrac12\right)\left(-\tfrac32\right)}{2}(4x^2) = \tfrac32x^2$
- $\dfrac{n(n-1)(n-2)}{3!}x^3$: $\dfrac{\left(-\tfrac12\right)\left(-\tfrac32\right)\left(-\tfrac52\right)}{6}(-8x^3) = \tfrac52x^3$

So $(1 - 2x)^{-\frac12} = 1 + x + \tfrac32x^2 + \tfrac52x^3 + \dots$, valid for $|2x| < 1$, that is $|x| < \tfrac12$.
:::

:::callout{type=local-example}
A trader in Kenema saves NLe 2,000 a year in a fund that grows by 3% a year. After 4 years one deposit is worth $2000(1.03)^4$. Using $(1 + 0.03)^4 \approx 1 + 4(0.03) + 6(0.0009) = 1.1254$, it is about NLe 2,250.80; the exact value is NLe 2,251.02, so three terms are already within 22 cents.
:::

## Practice

:::reveal{title="1. Expand (x + 3)⁴."}
Row 4: $1, 4, 6, 4, 1$. $x^4 + 4x^3(3) + 6x^2(9) + 4x(27) + 81 = x^4 + 12x^3 + 54x^2 + 108x + 81$.
:::

:::reveal{title="2. Find the coefficient of x⁴ in (3 − x)⁷."}
$\binom{7}{4}(3)^3(-1)^4 = 35 \times 27 = 945$.
:::

:::reveal{title="3. Find the term independent of x in (2x + 1/x)⁸."}
$T_{r+1} = \binom{8}{r}(2x)^{8-r}x^{-r}$; power $8 - 2r = 0$ gives $r = 4$: $\binom{8}{4}(2)^4 = 70 \times 16 = 1120$.
:::

:::reveal{title="4. Find the 4th term of (1 + 2x)⁹."}
The 4th term has $r = 3$: $\binom{9}{3}(2x)^3 = 84 \times 8x^3 = 672x^3$.
:::

:::reveal{title="5. Expand √(1 + x) up to the term in x³, and use it to estimate √1.02."}
$(1 + x)^{\frac12} = 1 + \tfrac12x - \tfrac18x^2 + \tfrac1{16}x^3 + \dots$ With $x = 0.02$: $1 + 0.01 - 0.00005 + \dots \approx 1.00995$.
:::

## Key points

- Row $n$ of Pascal's triangle, or $\binom{n}{r} = \dfrac{n!}{r!(n - r)!}$, gives the coefficients of $(a + b)^n$.
- General term: $T_{r+1} = \binom{n}{r}a^{n-r}b^r$; the $k$th term has $r = k - 1$.
- For a particular power, write the power of $x$ in $T_{r+1}$ and solve for $r$; for the term independent of $x$, set the power to zero.
- Keep the sign with the term: use $(-2x)^r$, not $-2x^r$.
- For small $x$, the first few terms approximate the value.
- For a negative or fractional $n$, the expansion of $(1 + x)^n$ is infinite and valid only for $|x| < 1$.

## WASSCE examination focus

:::callout{type=waec-tests}
WASSCE Further Mathematics asks you to expand a binomial, to find a stated coefficient or the term independent of $x$, and to use an expansion to evaluate an expression such as $(0.98)^6$ to a given number of decimal places. Show the general term with its powers of $x$ before you solve for $r$, and carry full accuracy until the last step: examiners note that early rounding loses marks.
:::
