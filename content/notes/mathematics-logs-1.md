If $2^5 = 32$, then we say *"the logarithm of $32$ to base $2$ is $5$."* Logarithms are the **inverse** of indices — they answer the question: *"to what power must I raise this base to get this number?"* If indices are about computing $2^5$, logarithms are about asking *"$2$ to what power gives $32$?"*

Logarithms were invented in the early $1600$s by a Scottish mathematician, John Napier, to make arithmetic easier. They turn multiplication into addition and division into subtraction — a huge advantage before calculators existed. Even today, with calculators everywhere, WAEC still tests logarithms heavily because the underlying ideas appear in algebra, calculus, exponential growth, and many real-world applications.

This lesson defines logarithms, shows their connection to indices, introduces logarithm notation, and works through fundamental conversions.

:::callout{type=definition}
**Definition of a logarithm:**

$$\log_b a = x \iff b^x = a$$

This reads: "$\log$ of $a$ to base $b$ equals $x$" if and only if "$b$ to the power of $x$ equals $a$."

- $b$ is the **base** of the logarithm (must be positive and not equal to $1$).
- $a$ is the **argument** (must be positive).
- $x$ is the **value** of the logarithm.

Logarithm answers the question: *"What power of $b$ gives $a$?"*
:::


## Learning objectives

By the end of this lesson you should be able to:

- explain what a logarithm is
- convert between index form and logarithm form
- evaluate simple logarithms without a calculator
- recognise common logarithms (base 10)

## The relationship between indices and logarithms

Logarithms and indices say the same thing in different ways:

| Index form | Log form |
|---|---|
| $2^5 = 32$ | $\log_2 32 = 5$ |
| $10^3 = 1000$ | $\log_{10} 1000 = 3$ |
| $5^2 = 25$ | $\log_5 25 = 2$ |
| $3^4 = 81$ | $\log_3 81 = 4$ |
| $2^{-3} = \dfrac{1}{8}$ | $\log_2 \dfrac{1}{8} = -3$ |
| $4^{1/2} = 2$ | $\log_4 2 = \dfrac{1}{2}$ |
| $b^x = a$ | $\log_b a = x$ |

Whenever you see a logarithm, you can rewrite it as an exponent. Whenever you see an exponent equation, you can rewrite it as a logarithm. The two forms are interchangeable.

![Graphs of y = 2 to the power x and y = log base 2 of x, reflections of each other in the line y = x](https://wasscetutor.com/img/mathematics/exp-log-graphs.svg)

*Figure 1. The logarithm undoes the exponential: the two graphs are mirror images in the line y = x. WASSCE Tutor diagram.*

## Reading logarithm notation

- $\log_2 32 = 5$ is read "log to base $2$ of $32$ equals $5$."
- $\log_{10} 1000 = 3$ is read "log of $1000$ to base $10$ equals $3$" or just "log $1000$ equals $3$" (because base $10$ is the standard *common log*).
- $\log_5 125 = 3$ is read "log of $125$ to base $5$ equals $3$."
- $\ln a$ (with no subscript) is the *natural log* — base $e \approx 2.718$. WAEC focuses on common log (base $10$) and other integer bases.

When the base is not written, it is **base $10$** in WAEC convention. So $\log 100 = 2$.

## Converting between index and log forms

This is the foundational skill. Be able to convert in both directions.

### Index → log

$2^4 = 16$ → $\log_2 16 = 4$.
$5^3 = 125$ → $\log_5 125 = 3$.
$10^{-2} = 0.01$ → $\log_{10} 0.01 = -2$.
$4^{1/2} = 2$ → $\log_4 2 = \dfrac{1}{2}$.

### Log → index

$\log_3 81 = 4$ → $3^4 = 81$.
$\log_{10} 10000 = 4$ → $10^4 = 10000$.
$\log_2 \dfrac{1}{4} = -2$ → $2^{-2} = \dfrac{1}{4}$.
$\log_8 2 = \dfrac{1}{3}$ → $8^{1/3} = 2$.

:::callout{type=worked-example}
**Convert between forms.**

**(a)** Express $\log_3 27 = 3$ in index form.
$3^3 = 27$.

**(b)** Express $5^4 = 625$ in log form.
$\log_5 625 = 4$.

**(c)** Express $2^{-4} = \dfrac{1}{16}$ in log form.
$\log_2 \dfrac{1}{16} = -4$.

**(d)** Express $\log_4 64 = 3$ in index form.
$4^3 = 64$.

**(e)** Express $\log_{10} 0.001 = -3$ in index form.
$10^{-3} = 0.001$.

**(f)** Express $9^{1/2} = 3$ in log form.
$\log_9 3 = \dfrac{1}{2}$.

**(g)** Express $\log_5 \sqrt{5} = \dfrac{1}{2}$ in index form.
$5^{1/2} = \sqrt{5}$.
:::

## Computing simple logarithms

For simple cases, ask yourself: *"What power of $b$ gives $a$?"*

### Example 1

**Find $\log_2 8$.**

What power of $2$ gives $8$? $2^3 = 8$. So $\log_2 8 = 3$.

### Example 2

**Find $\log_5 125$.**

$5^3 = 125$. So $\log_5 125 = 3$.

### Example 3

**Find $\log_{10} 10000$.**

$10^4 = 10000$. So $\log_{10} 10000 = 4$.

### Example 4

**Find $\log_4 64$.**

$4^3 = 64$. So $\log_4 64 = 3$.

### Example 5

**Find $\log_3 \dfrac{1}{27}$.**

$3^{-3} = \dfrac{1}{27}$. So $\log_3 \dfrac{1}{27} = -3$.

### Example 6

**Find $\log_9 3$.**

$9^{1/2} = 3$. So $\log_9 3 = \dfrac{1}{2}$.

### Example 7

**Find $\log_8 4$.**

Think: $8^x = 4$, both are powers of $2$. $8 = 2^3$, $4 = 2^2$. So $2^{3x} = 2^2$, $3x = 2$, $x = \dfrac{2}{3}$. So $\log_8 4 = \dfrac{2}{3}$.

### Example 8

**Find $\log_2 1$.**

$2^0 = 1$. So $\log_2 1 = 0$.

This is a key fact: **$\log_b 1 = 0$ for any base $b$**. (Because any base to the power $0$ is $1$.)

### Example 9

**Find $\log_5 5$.**

$5^1 = 5$. So $\log_5 5 = 1$.

Another key fact: **$\log_b b = 1$**.

:::callout{type=worked-example}
**Compute each logarithm.**

**(a)** $\log_2 16$. $2^4 = 16$. Answer: $4$.

**(b)** $\log_3 81$. $3^4 = 81$. Answer: $4$.

**(c)** $\log_5 625$. $5^4 = 625$. Answer: $4$.

**(d)** $\log_{10} 1$. Any base to power $0$ is $1$. Answer: $0$.

**(e)** $\log_4 1024$. $4^x = 1024$. $4^5 = 1024$. Answer: $5$.

**(f)** $\log_{10} 0.01$. $10^{-2} = 0.01$. Answer: $-2$.

**(g)** $\log_2 \dfrac{1}{32}$. $2^{-5} = \dfrac{1}{32}$. Answer: $-5$.

**(h)** $\log_{27} 3$. $27 = 3^3$, so $\log_{27} 3$ means $27^x = 3$, i.e. $3^{3x} = 3^1$, $x = \dfrac{1}{3}$. Answer: $\dfrac{1}{3}$.

**(i)** $\log_8 32$. $8 = 2^3$, $32 = 2^5$. $\log_8 32$ means $8^x = 32$, i.e. $2^{3x} = 2^5$, $x = \dfrac{5}{3}$. Answer: $\dfrac{5}{3}$.

**(j)** $\log_5 \sqrt{5}$. $\sqrt{5} = 5^{1/2}$. $\log_5 5^{1/2} = \dfrac{1}{2}$. Answer: $\dfrac{1}{2}$.
:::

## Key facts to memorise

These show up constantly. Know them by heart.

### Fact 1: $\log_b 1 = 0$

Any base raised to the power $0$ is $1$. So $\log_b 1 = 0$ for any valid base $b$.

- $\log_2 1 = 0$
- $\log_{10} 1 = 0$
- $\log_{100} 1 = 0$
- $\log_{0.5} 1 = 0$

### Fact 2: $\log_b b = 1$

Any base raised to the power $1$ is itself. So $\log_b b = 1$.

- $\log_2 2 = 1$
- $\log_{10} 10 = 1$
- $\log_5 5 = 1$

### Fact 3: $\log_b b^n = n$

The log of a base to a power gives back the power.

- $\log_2 2^5 = 5$
- $\log_{10} 10^3 = 3$
- $\log_3 3^{-2} = -2$

### Fact 4: $b^{\log_b a} = a$

A base raised to its own log gives back the argument.

- $2^{\log_2 16} = 16$
- $10^{\log_{10} 100} = 100$

These are the **inverse properties**: logs and exponentials undo each other.

## Domain — what can go inside a log?

The **argument** of a logarithm must be **positive**.

- $\log_2 8$ is fine ($8 > 0$).
- $\log_2 0$ is **undefined** (you can never get $0$ by raising $2$ to a real power).
- $\log_2 (-8)$ is **undefined** (you can never get a negative number by raising a positive base to a real power).

Why? Because $b^x > 0$ for any positive $b$ and real $x$. So $\log_b a$ exists only for $a > 0$.

Also, the **base** must be positive and not equal to $1$.

- $b = 1$ is excluded because $1^x = 1$ for all $x$, so $\log_1 a$ would be impossible to define uniquely.
- $b \leq 0$ is excluded because then $b^x$ is not always defined for real $x$.

## Why logarithms exist — historical context

Before calculators, multiplying two large numbers like $4598 \times 3147$ took ages. Logarithms made this easier because:

$$\log(a \times b) = \log a + \log b$$

So you'd:
1. Look up $\log 4598$ in a table (about $3.66$).
2. Look up $\log 3147$ in a table (about $3.50$).
3. Add: $3.66 + 3.50 = 7.16$.
4. Look up the antilog of $7.16$ — that's the product.

Much faster than direct multiplication. This is why the logarithm laws (next lesson) were transformative.

Today, calculators handle large multiplications instantly, but logarithms still matter for:
- Solving exponential equations (where the unknown is in the exponent)
- Modelling growth and decay (population, radioactive material, compound interest)
- Sound intensity (decibel scale uses logs)
- Earthquakes (Richter scale uses logs)
- pH in chemistry (uses log)
- Information theory (bits use log base $2$)

WAEC tests them because they're foundational, not because students still do hand calculations with log tables.

## Common logarithm — base $10$

When the base is $10$, it's called the **common logarithm**. The notation often omits the base:

- $\log 100 = 2$ means $\log_{10} 100 = 2$.
- $\log 1000 = 3$ means $\log_{10} 1000 = 3$.
- $\log 0.1 = -1$.
- $\log 0.01 = -2$.

The next lesson shows how common logarithms are used in calculations.

:::callout{type=worked-example}
**Compute each common log (base $10$).**

**(a)** $\log 10000$. $10^4 = 10000$. Answer: $4$.

**(b)** $\log 1000000$. $10^6 = 1000000$. Answer: $6$.

**(c)** $\log 1$. Always $0$. Answer: $0$.

**(d)** $\log 0.001$. $10^{-3} = 0.001$. Answer: $-3$.

**(e)** $\log 10$. $10^1 = 10$. Answer: $1$.

**(f)** $\log \sqrt{10}$. $\sqrt{10} = 10^{1/2}$. So $\log 10^{1/2} = \dfrac{1}{2}$. Answer: $\dfrac{1}{2}$.
:::

:::callout{type=local-example}
A bank in Bo offers a savings account. Aminata deposits NLe 100 at $5\%$ annual interest, compounded once a year. The amount after $t$ years is $A = 100 \times 1.05^t$.

If Aminata wants to know when her money will double (i.e., when $A = 200$), she sets up:
$100 \times 1.05^t = 200$, so $1.05^t = 2$.

To solve this, she takes the log of both sides:
$\log(1.05^t) = \log 2$, so $t \log 1.05 = \log 2$, giving $t = \dfrac{\log 2}{\log 1.05}$.

Using a calculator: $t = \dfrac{0.301}{0.0212} \approx 14.2$ years.

So her money doubles in about $14$ years. This kind of growth calculation — using logarithms to find an unknown time or rate — is exactly what WAEC tests with simpler numbers.
:::

:::callout{type=common-mistake}
**Common errors with logarithm basics:**

**1. Reading the log notation incorrectly.**
- $\log_2 8$ means *log of $8$ to base $2$*, not *log of $2$ to base $8$*. The number after the subscript is the **base**.

**2. Forgetting that $\log_b 1 = 0$.**
- The log of $1$ is always zero, regardless of the base.

**3. Forgetting that $\log$ without a subscript means base $10$.**
- $\log 100 = 2$ in WAEC convention.

**4. Trying to take the log of zero or a negative number.**
- $\log_b 0$ and $\log_b (-3)$ are undefined.

**5. Confusing log base $b$ of $a$ with log of $a$ raised to $b$.**
- $\log_2 8 = 3$ ✓
- $\log 8^2 = 2 \log 8$. (Different: it uses the power law, in the next lesson.)

**6. Sign error.**
- $\log 0.01 = -2$ (because $0.01 = 10^{-2}$). The log of a number less than $1$ is negative.
:::

## Key terms

:::callout{type=definition title="Key terms"}
- **Logarithm**: the power to which a base must be raised to give a number: $\log_a N = x$ means $a^x = N$.
- **Common logarithm**: a logarithm to base 10, written $\log N$.
- **Argument**: the number whose logarithm is taken, such as 32 in $\log_2 32$; it must be positive.
:::

## WASSCE examination focus

:::callout{type=waec-tests}
Foundational log questions in WAEC:

- **Direct computation.** *Find $\log_2 32$.* (Answer: $5$)
- **Different base.** *Find $\log_5 125$.* (Answer: $3$)
- **Fraction or decimal argument.** *Find $\log_{10} 0.001$.* (Answer: $-3$)
- **Common log.** *Find $\log 10000$.* (Answer: $4$)
- **Convert between log and index forms.** *Express $4^3 = 64$ in log form.* (Answer: $\log_4 64 = 3$)
- **Conceptual.** *Find $\log_5 1$.* (Answer: $0$)

The key skill is **converting between log and index form**. Once you can do that, every log question becomes an index question in disguise.
:::

## Practice problems

Try each question first, then open the answer to check your working.

**1.** Find $\log_3 27$.

:::reveal{title="Show the answer"}
$3^3 = 27$. Answer: $3$.
:::

**2.** Find $\log_{10} 1000$.

:::reveal{title="Show the answer"}
$10^3 = 1000$. Answer: $3$.
:::

**3.** Find $\log_2 64$.

:::reveal{title="Show the answer"}
$2^6 = 64$. Answer: $6$.
:::

**4.** Find $\log_5 \dfrac{1}{25}$.

:::reveal{title="Show the answer"}
$5^{-2} = \dfrac{1}{25}$. Answer: $-2$.
:::

**5.** Find $\log_4 64$.

:::reveal{title="Show the answer"}
$4^3 = 64$. Answer: $3$.
:::

**6.** Find $\log_{10} 0.01$.

:::reveal{title="Show the answer"}
$10^{-2} = 0.01$. Answer: $-2$.
:::

**7.** Find $\log_3 \sqrt{3}$.

:::reveal{title="Show the answer"}
$\sqrt{3} = 3^{1/2}$. So $\log_3 3^{1/2} = \dfrac{1}{2}$.
:::

**8.** Express $7^2 = 49$ in log form.

:::reveal{title="Show the answer"}
$\log_7 49 = 2$.
:::

**9.** Express $\log_5 125 = 3$ in index form.

:::reveal{title="Show the answer"}
$5^3 = 125$.
:::

**10.** Find $\log_8 16$.

:::reveal{title="Show the answer"}
$8 = 2^3$, $16 = 2^4$. $\log_8 16 = x$ means $8^x = 16$, i.e. $2^{3x} = 2^4$, so $x = \dfrac{4}{3}$.
:::

**11.** Find $\log_2 1$.

:::reveal{title="Show the answer"}
$\log_2 1 = 0$ (any base to power $0$ is $1$).
:::

**12.** Find $\log_{10} 10^7$.

:::reveal{title="Show the answer"}
$\log_{10} 10^7 = 7$ (using Fact 3).
:::

## What's next

In the next lesson we cover **the laws of logarithms** — the rules that turn multiplication into addition, division into subtraction, and powers into multiplication. These three laws are the heart of the topic and the source of most WAEC questions.
