:::callout{type=definition}
A **function** is a rule that assigns to **each** element of one set (the domain) **exactly one** element of another set. A function $f$ from $A$ to $B$ is written $f: A \to B$, and its rule as $f: x \mapsto f(x)$, such as $f: x \mapsto 2x + 1$.
:::

Functions are the backbone of Further Mathematics: calculus differentiates and integrates them, and the exponential and logarithmic functions are inverses of each other. WAEC's examiners report that candidates lose marks on **finding the domain** of a function and on **combining functions**, so this lesson takes both slowly. It covers **domain, co-domain and range**, the **types of function**, **composite functions** and **inverse functions**.

## Learning objectives

By the end of this lesson you should be able to:

- use function notation and evaluate $f(a)$
- state the domain, co-domain and range of a function
- find the largest possible domain of a rational or square-root function
- tell one-to-one, many-to-one and onto functions apart
- find composite functions such as $fg(x)$ and $gf(x)$
- find the inverse of a one-to-one function, including a rational function

## Domain, co-domain and range

:::callout{type=definition}
**Domain:** the set of inputs of a function, the values of $x$ it may be applied to.

**Co-domain:** the set $B$ in which the outputs are allowed to lie.

**Range:** the set of outputs actually produced, $\{f(x) : x \text{ in the domain}\}$; it is part of the co-domain.

**Image:** the output $f(a)$ that a particular input $a$ produces; $a$ is mapped onto its image.
:::

When no domain is given, take the largest set of real numbers for which the rule makes sense. Two things can go wrong with real numbers:

- **division by zero**: exclude any $x$ that makes a denominator zero
- **the square root of a negative number**: require the expression under the root to be $\ge 0$

:::callout{type=worked-example}
**State the largest domain of each function.**

- $f(x) = \dfrac{1}{x^2 - 4}$: $x^2 - 4 = 0$ when $x = \pm2$, so the domain is all real $x$ except $x = 2$ and $x = -2$.
- $g(x) = \sqrt{x - 3}$: $x - 3 \ge 0$, so the domain is $x \ge 3$.
- $h(x) = \dfrac{x + 1}{x - 2}$: the domain is all real $x$ except $x = 2$.

**Find the range of $f(x) = x^2 + 1$, $x \in \mathbb{R}$.** Since $x^2 \ge 0$, $f(x) \ge 1$: the range is $\{y : y \ge 1\}$.
:::

## Types of function

:::callout{type=definition}
**One-to-one function:** a function in which different inputs always give different outputs; if $f(a) = f(b)$ then $a = b$.

**Many-to-one function:** a function in which two or more inputs give the same output, such as $f(x) = x^2$, where $f(-2) = f(2) = 4$.

**Onto function:** a function whose range is the whole co-domain, so every element of $B$ is the image of some input.
:::

A rule that gives some input two outputs, such as $y = \pm\sqrt{x}$, is a relation but **not** a function.

![Two arrow diagrams: the one-to-one function f(x) = 2x + 1 maps 1, 2, 3 to 3, 5, 7; the many-to-one function g(x) = x squared maps −2 and 2 to 4 and −1 and 1 to 1](https://wasscetutor.com/img/further-mathematics/function-mappings.svg)

*Figure 1. One-to-one and many-to-one functions. WASSCE Tutor diagram.*

## Composite functions

:::callout{type=definition}
**Composite function:** the function $fg$ (also written $f \circ g$) obtained by applying $g$ first and then $f$: $fg(x) = f(g(x))$. It is defined only where the outputs of $g$ lie in the domain of $f$.
:::

![A composite function as two machines: 3 goes into g(x) = x squared plus 1 to give 10, and 10 goes into f(x) = 2x − 5 to give 15, so fg(3) = 15](https://wasscetutor.com/img/further-mathematics/composite-function-machine.svg)

*Figure 2. In fg(x), the function nearer to x acts first. WASSCE Tutor diagram.*

:::callout{type=worked-example}
**$f(x) = 2x - 5$ and $g(x) = x^2 + 1$. Find $fg(x)$, $gf(x)$ and $fg(3)$.**

$fg(x) = f(x^2 + 1) = 2(x^2 + 1) - 5 = 2x^2 - 3$.

$gf(x) = g(2x - 5) = (2x - 5)^2 + 1 = 4x^2 - 20x + 26$.

$fg(3) = 2(9) - 3 = 15$.

So $fg(x) \ne gf(x)$: the order of composition matters.
:::

:::callout{type=common-mistake}
$fg(x)$ means $f(g(x))$, **not** $f(x) \times g(x)$, and not $g(f(x))$. Replace every $x$ in the outer function by the whole inner function, in brackets: $(2x - 5)^2$, not $2x - 5^2$.
:::

## Inverse functions

:::callout{type=definition}
**Inverse function:** the function $f^{-1}$ that reverses $f$: if $f(a) = b$ then $f^{-1}(b) = a$, so $ff^{-1}(x) = f^{-1}f(x) = x$. Only a one-to-one function has an inverse.
:::

To find $f^{-1}$: write $y = f(x)$, make $x$ the subject, then swap the letters. The graph of $y = f^{-1}(x)$ is the reflection of $y = f(x)$ in the line $y = x$, and the domain of $f^{-1}$ is the range of $f$.

:::callout{type=worked-example}
**$f(x) = \dfrac{2x + 1}{x - 3}$, $x \ne 3$. Find $f^{-1}(x)$ and state its domain.**

Let $y = \dfrac{2x + 1}{x - 3}$. Then $y(x - 3) = 2x + 1$, so $xy - 3y = 2x + 1$, and $x(y - 2) = 3y + 1$:

$x = \dfrac{3y + 1}{y - 2}$, so $f^{-1}(x) = \dfrac{3x + 1}{x - 2}$, $x \ne 2$.

**Check:** $f(4) = \dfrac{9}{1} = 9$ and $f^{-1}(9) = \dfrac{28}{7} = 4$ ✓.
:::

:::callout{type=local-example}
A taxi in Freetown charges a fixed NLe 10 plus NLe 4 per kilometre, so the fare for $x$ km is $f(x) = 4x + 10$. The inverse, $f^{-1}(x) = \dfrac{x - 10}{4}$, answers the passenger's question the other way round: a NLe 50 fare covers $f^{-1}(50) = 10$ km.
:::

## Practice

:::reveal{title="1. Find the largest domain of f(x) = √(5 − 2x)."}
$5 - 2x \ge 0$, so $x \le \tfrac52$.
:::

:::reveal{title="2. g(x) = 3x − 2 and h(x) = x². Find gh(x) and hg(x)."}
$gh(x) = 3x^2 - 2$; $hg(x) = (3x - 2)^2 = 9x^2 - 12x + 4$.
:::

:::reveal{title="3. Find the inverse of g(x) = 3x − 2 and find g⁻¹(7)."}
$y = 3x - 2$ gives $x = \dfrac{y + 2}{3}$, so $g^{-1}(x) = \dfrac{x + 2}{3}$ and $g^{-1}(7) = 3$.
:::

:::reveal{title="4. Find the inverse of f(x) = x/(x + 2), x ≠ −2."}
$y(x + 2) = x$ gives $x(y - 1) = -2y$, so $f^{-1}(x) = \dfrac{2x}{1 - x}$, $x \ne 1$.
:::

:::reveal{title="5. Explain why f(x) = x², x ∈ ℝ, has no inverse, and how to change its domain so that it does."}
It is many-to-one: $f(-3) = f(3) = 9$. Restricting the domain to $x \ge 0$ makes it one-to-one, with inverse $f^{-1}(x) = \sqrt x$.
:::

## Key points

- A function gives each input exactly one output.
- Domain: exclude values that make a denominator zero; require square-root expressions $\ge 0$.
- The range is the set of outputs actually produced; for $x^2 + 1$ it is $y \ge 1$.
- $fg(x) = f(g(x))$: $g$ acts first, and $fg \ne gf$ in general.
- Find $f^{-1}$ by making $x$ the subject of $y = f(x)$ and swapping letters; only one-to-one functions have inverses.
- The domain of $f^{-1}$ is the range of $f$, and its graph is the reflection of $f$ in $y = x$.

## WASSCE examination focus

:::callout{type=waec-tests}
WASSCE Further Mathematics asks you to state the domain or range of a function, to find composite functions such as $fg(x)$ and $gf(x)$, to find an inverse, often of a rational function, and to evaluate expressions such as $f^{-1}(3)$ or $fg(-1)$. The Chief Examiner reports that many candidates cannot find the domain of a function or simplify combined functions: state the excluded values explicitly, keep the inner function in brackets, and check an inverse with one number.
:::
