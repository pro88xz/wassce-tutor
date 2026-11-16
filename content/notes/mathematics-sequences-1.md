*$2, 4, 6, 8, 10, \ldots$* — a list of even numbers. *$1, 3, 9, 27, 81, \ldots$* — each number is three times the last. *$1, 1, 2, 3, 5, 8, 13, \ldots$* — each number is the sum of the previous two. These are all **sequences** — ordered lists of numbers that follow a pattern.

When you **add up** the terms of a sequence, you get a **series**. The sum $2 + 4 + 6 + 8 + 10 = 30$ is a series formed from the first five terms of the sequence above.

Sequences and series appear throughout WAEC mathematics — in arithmetic progressions, geometric progressions, compound interest, biological growth, payment plans, and more. This topic teaches you the two most important kinds (AP and GP), how to find any term, and how to sum them up.

This lesson introduces the vocabulary and notation. The next lesson covers APs and GPs in detail: the $n$-th term, the sum of $n$ terms and the sum to infinity.

:::callout{type=definition}
**Sequence:** An ordered list of numbers. Each number is called a **term**.

**Notation:** $a_1, a_2, a_3, \ldots, a_n, \ldots$ where $a_n$ is the $n$-th term.

**Series:** The sum of the terms of a sequence. The sum of the first $n$ terms is denoted $S_n$:
$$S_n = a_1 + a_2 + a_3 + \cdots + a_n$$

**Finite sequence:** Has a last term (e.g., $2, 4, 6, 8, 10$).
**Infinite sequence:** Continues forever (e.g., $2, 4, 6, 8, 10, \ldots$).
:::


## Learning objectives

By the end of this lesson you should be able to:

- define a sequence and a series
- describe a sequence by listing, by a recurrence rule and by a formula for the $n$-th term
- recognise arithmetic and geometric sequences
- use sigma notation for a series

## How to describe a sequence

A sequence can be described in three ways:

### 1. List the terms

*$2, 4, 6, 8, 10, \ldots$*

For short sequences, just listing the terms is fine. But for the $100$th term, listing all terms is impractical.

### 2. Recurrence — describe each term in terms of the previous

*$a_1 = 2$, and $a_n = a_{n-1} + 2$ for $n \geq 2$.*

This says: "The first term is $2$, and each subsequent term is the previous one plus $2$."

Useful for understanding the *pattern*, but slow if you want term $1000$.

### 3. Formula — describe each term directly in terms of $n$

*$a_n = 2n$.*

Now you can compute any term: $a_5 = 2 \times 5 = 10$. $a_{100} = 2 \times 100 = 200$.

The **formula** form is the most powerful, and it's what most WAEC questions ask you to find.

## Patterns to look for

When you see a sequence, ask yourself: *what's the pattern?* Here are the most common.

### Constant difference (arithmetic)

*$3, 7, 11, 15, 19, \ldots$* — each term is $4$ more than the previous.

The difference between consecutive terms is **constant**. This is an **arithmetic progression** (AP) or **arithmetic sequence**.

### Constant ratio (geometric)

*$2, 6, 18, 54, 162, \ldots$* — each term is $3$ times the previous.

The ratio of consecutive terms is **constant**. This is a **geometric progression** (GP) or **geometric sequence**.

### Squares, cubes, etc.

*$1, 4, 9, 16, 25, \ldots$* — squares: $a_n = n^2$.

*$1, 8, 27, 64, 125, \ldots$* — cubes: $a_n = n^3$.

WAEC sometimes presents these patterns directly.

### Fibonacci pattern

*$1, 1, 2, 3, 5, 8, 13, 21, \ldots$* — each term is the sum of the previous two: $a_n = a_{n-1} + a_{n-2}$.

Less often tested, but appears in some advanced WAEC questions.

![Bars for the arithmetic progression 3, 7, 11, 15, 19 rising in equal steps, and for the geometric progression 1, 2, 4, 8, 16 growing faster and faster](https://wasscetutor.com/img/mathematics/ap-gp-terms.svg)

*Figure 1. An AP adds the same number each time; a GP multiplies by the same number each time. WASSCE Tutor diagram.*

## Identifying arithmetic and geometric sequences

### Quick test for AP

Subtract each term from the next. If the differences are all the same, it's an AP. The common difference is denoted $d$.

**Example:** $3, 7, 11, 15$.
- $7 - 3 = 4$
- $11 - 7 = 4$
- $15 - 11 = 4$
All differences are $4$. This is an AP with first term $a = 3$ and common difference $d = 4$.

### Quick test for GP

Divide each term by the previous. If the ratios are all the same, it's a GP. The common ratio is denoted $r$.

**Example:** $2, 6, 18, 54$.
- $6 / 2 = 3$
- $18 / 6 = 3$
- $54 / 18 = 3$
All ratios are $3$. This is a GP with first term $a = 2$ and common ratio $r = 3$.

### Combined example

**Example:** $1, 2, 4, 7, 11, 16, \ldots$
- Differences: $1, 2, 3, 4, 5, \ldots$ (the differences themselves form a sequence!)
- Ratios: $2, 2, 1.75, \ldots$ — not constant.

This is neither AP nor GP. The differences form an AP — this is called a *quadratic sequence* in some contexts. WAEC focuses on plain APs and GPs.

:::callout{type=worked-example}
**For each sequence, identify whether it is an AP, GP, both (constant sequence), or neither, and state the relevant common difference or ratio.**

**(a)** $5, 8, 11, 14, 17, \ldots$ 
Differences: $3, 3, 3, 3$. AP with $d = 3$. (Ratios: $8/5 = 1.6$, $11/8 = 1.375$ — not constant, so not GP.)

**(b)** $4, 12, 36, 108, \ldots$ 
Ratios: $3, 3, 3$. GP with $r = 3$. (Differences not constant.)

**(c)** $7, 7, 7, 7, \ldots$ 
Constant sequence. Both AP ($d = 0$) and GP ($r = 1$).

**(d)** $1, 4, 9, 16, 25, \ldots$ 
Differences: $3, 5, 7, 9$ — not constant. Ratios: $4, 9/4, 16/9, \ldots$ — not constant. Neither AP nor GP (it's the sequence of squares).

**(e)** $-3, -6, -12, -24, \ldots$ 
Ratios: $2, 2, 2$. GP with $r = 2$. (Differences: $-3, -6, -12$ — not constant.)

**(f)** $20, 17, 14, 11, 8, \ldots$ 
Differences: $-3, -3, -3, -3$. AP with $d = -3$. (Note: differences can be negative.)

**(g)** $1, \dfrac{1}{2}, \dfrac{1}{4}, \dfrac{1}{8}, \dfrac{1}{16}, \ldots$ 
Ratios: $\dfrac{1}{2}, \dfrac{1}{2}, \dfrac{1}{2}, \dfrac{1}{2}$. GP with $r = \dfrac{1}{2}$.
:::

## Series — adding up the terms

### Finite sum

The sum of the first $n$ terms is $S_n$.

**Example:** For the AP $3, 7, 11, 15, \ldots$, the first four terms sum to:
$S_4 = 3 + 7 + 11 + 15 = 36$.

**Example:** For the GP $2, 6, 18, 54$, the sum is:
$S_4 = 2 + 6 + 18 + 54 = 80$.

WAEC tests formulas for $S_n$ for both APs and GPs (see the next lesson).

### Infinite sum (only for some GPs)

For an infinite GP, the sum may converge to a finite limit if $|r| < 1$. Otherwise it diverges to infinity.

**Example:** $1 + \dfrac{1}{2} + \dfrac{1}{4} + \dfrac{1}{8} + \ldots = 2$ (this converges).

**Example:** $1 + 2 + 4 + 8 + 16 + \ldots = \infty$ (this diverges).

We cover infinite GP sums in the next lesson.

## Notation conventions

- $a_n$ or $T_n$ — the $n$-th term of a sequence. WAEC often uses $T_n$.
- $a$ — the first term.
- $d$ — common difference (for AP).
- $r$ — common ratio (for GP).
- $S_n$ — sum of the first $n$ terms.
- $S_\infty$ — infinite sum (if it converges).

## Examples — recognizing the type

### Example 1

*A bakery sells $50$ loaves on the first day, then increases by $5$ loaves each subsequent day.*

This is an AP with $a = 50$, $d = 5$.

Terms: $50, 55, 60, 65, 70, \ldots$

### Example 2

*An investment of $1000$ NLe grows by $10\%$ each year.*

This is a GP with $a = 1000$, $r = 1.10$.

Terms: $1000, 1100, 1210, 1331, \ldots$

### Example 3

*The population of a village in Sierra Leone is $1000$ this year. It declines by $50$ people each year.*

This is an AP with $a = 1000$, $d = -50$.

Terms: $1000, 950, 900, 850, \ldots$

### Example 4

*A car loses $25\%$ of its value each year. Initial value $5000$ NLe.*

This is a GP with $a = 5000$, $r = 0.75$.

Terms: $5000, 3750, 2812.50, \ldots$

:::callout{type=worked-example}
**Identify the type and parameters of each sequence.**

**(a)** *A child saves $200$ NLe each week, starting with $200$ in week $1$.*
AP: total saved after $n$ weeks. Wait — the question describes the **amount saved each week**, not the cumulative total. Let's distinguish:
- Amount saved in week $n$: $200$ (constant). Constant sequence.
- Cumulative savings after $n$ weeks: $200, 400, 600, 800, \ldots$ — AP with $a = 200, d = 200$.

**(b)** *A loan of $5000$ NLe at $5\%$ simple interest. Each year, $250$ NLe is added.*
AP: $5000, 5250, 5500, 5750, \ldots$ with $a = 5000, d = 250$.

**(c)** *A loan of $5000$ NLe at $5\%$ compound interest, interest added once a year.*
GP: $5000, 5250, 5512.5, 5788.125, \ldots$ with $a = 5000, r = 1.05$.

**(d)** *A bacteria culture doubles in size every hour, starting at $100$ bacteria.*
GP: $100, 200, 400, 800, \ldots$ with $a = 100, r = 2$.
:::

## When the sequence is given in non-standard form

Sometimes WAEC presents a sequence by listing terms (not telling you which kind). You need to identify the type yourself.

**Example:** *The sequence $3, 9, 27, 81, \ldots$ is given. Is it AP or GP?*

Differences: $6, 18, 54$ — not constant. So not AP.
Ratios: $3, 3, 3$ — constant. GP with $a = 3, r = 3$.

Alternatively, the formula is $a_n = 3^n$.

**Example:** *The sequence $4, 7, 12, 19, 28, \ldots$ is given.*

Differences: $3, 5, 7, 9$ — not constant. The differences themselves form an AP.
Ratios: $7/4, 12/7, \ldots$ — not constant.

This is neither AP nor GP. It's a quadratic-pattern sequence.

## The connection to formulas

For sequences with a clear pattern, you can write a formula.

**Example:** $1, 4, 9, 16, 25, \ldots$ → $a_n = n^2$.

**Example:** $2, 4, 6, 8, 10, \ldots$ → $a_n = 2n$.

**Example:** $3, 6, 12, 24, 48, \ldots$ → $a_n = 3 \times 2^{n-1}$ (GP with $a = 3, r = 2$).

The next lesson derives the general formulas for AP and GP.

:::callout{type=local-example}
A Sierra Leonean farmer plants rice and tracks his harvest each year. In year $1$, he harvests $1000$ kg. He invests in better fertiliser and gets $5\%$ more each year.

Year-by-year: $1000, 1050, 1102.5, 1157.625, \ldots$

This is a GP with $a = 1000, r = 1.05$. After $5$ years, he harvests $1000 \times 1.05^4 = 1215.5$ kg.

If instead he had a constant improvement of $50$ kg per year, the sequence would be $1000, 1050, 1100, 1150, 1200, \ldots$ — an AP with $a = 1000, d = 50$. After $5$ years, he'd harvest $1200$ kg.

The difference between AP (linear growth) and GP (exponential growth) becomes huge over many years. WAEC tests these models in word problems all the time.
:::

:::callout{type=common-mistake}
**Common errors when identifying sequences:**

**1. Mixing up difference and ratio.**
- The **difference** is *subtract*: $a_{n+1} - a_n$.
- The **ratio** is *divide*: $a_{n+1} / a_n$.
- Constant difference = AP. Constant ratio = GP.

**2. Checking only one or two terms.**
- Sometimes the pattern breaks. Check at least three consecutive differences or ratios.

**3. Confusing the term number with the value.**
- $a_3 = 7$ means *the third term equals $7$*. The term *number* is $3$; the *value* is $7$.

**4. Forgetting that AP and GP both have a first term, but $a$ is the first term in both.**
- The same letter is used. Read context to know whether it's AP or GP.

**5. Not distinguishing finite from infinite sequences.**
- A finite sequence stops; an infinite one continues. Both can be APs or GPs.
:::

## WASSCE examination focus

:::callout{type=waec-tests}
Foundational sequence questions in WAEC:

- **Identify the type.** *Is the sequence $3, 7, 11, 15, \ldots$ AP or GP?* (AP)
- **Find $d$ or $r$.** *For the sequence $2, 6, 18, 54$, find the common ratio.* ($r = 3$)
- **Identify in a word problem.** *A car depreciates by $25\%$ each year. Is this AP or GP?* (GP)
- **Compute next term.** *Find the next term in the sequence $5, 10, 20, 40, \ldots$.* (GP, next: $80$)
- **Recognise from a formula.** *Is the sequence $a_n = 2n + 1$ AP or GP?* (AP, since $a_n = 1 + 2n$, so $d = 2$)

The foundational skill is **recognizing the pattern** and **identifying the parameters**. Everything else builds on this.
:::

## Practice problems

For each sequence, identify whether it is AP, GP, both, or neither. If it is AP, give the common difference. If it is GP, give the common ratio.

Try each question first, then open the answer to check your working.

**1.** $4, 9, 14, 19, 24$

:::reveal{title="Show the answer"}
Differences: $5, 5, 5, 5$. AP, $d = 5$.
:::

**2.** $1, 5, 25, 125$

:::reveal{title="Show the answer"}
Ratios: $5, 5, 5$. GP, $r = 5$.
:::

**3.** $8, 4, 2, 1$

:::reveal{title="Show the answer"}
Ratios: $\dfrac{1}{2}, \dfrac{1}{2}, \dfrac{1}{2}$. GP, $r = \dfrac{1}{2}$. (Differences: $-4, -2, -1$ — not constant.)
:::

**4.** $-2, 1, 4, 7, 10$

:::reveal{title="Show the answer"}
Differences: $3, 3, 3, 3$. AP, $d = 3$.
:::

**5.** $3, 3, 3, 3, 3$

:::reveal{title="Show the answer"}
Constant sequence. Both AP ($d = 0$) and GP ($r = 1$).
:::

**6.** $1, 2, 4, 7, 11$

:::reveal{title="Show the answer"}
Differences: $1, 2, 3, 4$ — not constant. Ratios: $2, 2, 1.75, \ldots$ — not constant. Neither.
:::

**7.** $-1, 3, -9, 27, -81$

:::reveal{title="Show the answer"}
Ratios: $-3, -3, -3, -3$. GP, $r = -3$.
:::

**8.** $100, 95, 90, 85$

:::reveal{title="Show the answer"}
Differences: $-5, -5, -5$. AP, $d = -5$.
:::

**9.** Find the next two terms of $5, 8, 11, 14, \ldots$

:::reveal{title="Show the answer"}
AP with $a = 5, d = 3$. Next two: $17, 20$.
:::

**10.** Find the next two terms of $\dfrac{1}{2}, 1, 2, 4, \ldots$

:::reveal{title="Show the answer"}
GP with $a = \dfrac{1}{2}, r = 2$. Next two: $8, 16$.
:::

**11.** *A small business sells $100$ units in month $1$. Each month, sales grow by $10\%$. Identify the type of sequence.*

:::reveal{title="Show the answer"}
GP (constant percentage growth = constant ratio).
:::

**12.** *Aminata saves $20$ NLe in week $1$, then $5$ NLe more each subsequent week. Identify the type.*

:::reveal{title="Show the answer"}
AP (constant addition each week).
:::

## What's next

In the next lesson we go deep on **arithmetic and geometric progressions**: the general formula for the $n$-th term, the sum of the first $n$ terms, the sum to infinity of a GP, and the WAEC questions built on them.
