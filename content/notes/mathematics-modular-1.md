Imagine you look at your watch and it says 9 o'clock. Someone asks: *what time will it be in 5 hours?* You don't say "$14$ o'clock" — you say "$2$ o'clock." That's modular arithmetic in action. When you reach $12$, you don't keep counting upwards forever — you wrap around to $1$ and start again.

The same idea applies to days of the week. *What day is it 10 days from Tuesday?* You don't say "Tuesday plus 10 days." You count by sevens — *7 days from Tuesday is Tuesday again* — so 10 days from Tuesday is Tuesday plus 3 more days = Friday.

This is the heart of **modular arithmetic**: a system where numbers wrap around after reaching a fixed value. WAEC tests this in nearly every paper, sometimes openly ("find $25 \bmod 4$") and sometimes disguised as clock, calendar, or remainder problems. This lesson opens the topic by defining the *mod* operation, showing how to find remainders quickly, and building the foundation for everything that follows.

:::callout{type=definition}
**Modular arithmetic** (also called *clock arithmetic*) is arithmetic where numbers wrap around after reaching a fixed value called the **modulus**.

Written $a \bmod n$ (read: "$a$ mod $n$"), this means: divide $a$ by $n$, and the result is the **remainder**.

The modulus $n$ is the number you wrap around at. The result is always between $0$ and $n - 1$, inclusive.

Examples:
- $17 \bmod 5 = 2$ (because $17 = 3 \times 5 + 2$, remainder $2$)
- $25 \bmod 7 = 4$ (because $25 = 3 \times 7 + 4$, remainder $4$)
- $30 \bmod 6 = 0$ (because $30 = 5 \times 6 + 0$, remainder $0$)
:::


## Learning objectives

By the end of this lesson you should be able to:

- explain modular arithmetic as arithmetic of remainders
- find $a \bmod n$ quickly, including for negative $a$
- use the division algorithm $a = qn + r$
- recognise when two numbers are congruent modulo $n$
- connect modular arithmetic with clocks and calendars

## The basic idea — remainders

When you divide one whole number by another, you get a **quotient** and a **remainder**. Modular arithmetic is about the remainder alone.

**Example.** Divide $17$ by $5$.

$$17 \div 5 = 3 \text{ remainder } 2$$

In modular notation, this says:

$$17 \bmod 5 = 2$$

We ignore the quotient ($3$) and keep only the remainder ($2$). The result tells us: *if you wrap around every 5 steps, where do you land after 17 steps?* Answer: $2$ steps past the start of the latest wrap.

## The division algorithm

The foundation of modular arithmetic is the **division algorithm**, which says:

> For any whole number $a$ and any positive whole number $n$, there are unique whole numbers $q$ (quotient) and $r$ (remainder) such that:
>
> $$a = q \times n + r, \quad \text{where } 0 \leq r < n$$

The remainder $r$ is what we call $a \bmod n$. The constraint $0 \leq r < n$ is the key — the remainder is always non-negative and strictly less than the modulus.

**Examples:**

- $a = 23$, $n = 7$: $23 = 3 \times 7 + 2$, so $23 \bmod 7 = 2$.
- $a = 100$, $n = 9$: $100 = 11 \times 9 + 1$, so $100 \bmod 9 = 1$.
- $a = 50$, $n = 8$: $50 = 6 \times 8 + 2$, so $50 \bmod 8 = 2$.
- $a = 28$, $n = 7$: $28 = 4 \times 7 + 0$, so $28 \bmod 7 = 0$.

The last case is important: when $a$ is a **multiple** of $n$, the remainder is exactly $0$.

## How to compute $a \bmod n$ quickly

For most WAEC questions, the modulus is small ($3$, $4$, $5$, $6$, $7$, $8$, $9$, $10$, $12$, $24$). For these, you can find the remainder in your head — or with one line of long division.

### Method 1 — Long division

For $47 \bmod 6$:

- $47 \div 6$: $6$ goes into $47$ seven times ($7 \times 6 = 42$), with $5$ left over.
- So $47 = 7 \times 6 + 5$, and $47 \bmod 6 = 5$.

### Method 2 — Subtract multiples of $n$

Keep subtracting $n$ from $a$ until what remains is between $0$ and $n - 1$.

For $47 \bmod 6$:
- $47 - 6 = 41$
- $41 - 6 = 35$
- $35 - 6 = 29$
- $29 - 6 = 23$
- $23 - 6 = 17$
- $17 - 6 = 11$
- $11 - 6 = 5$

Result: $5$. (Same answer as long division, but slower for big numbers.)

### Method 3 — Jump by multiples

Find the largest multiple of $n$ that is $\leq a$. Subtract.

For $47 \bmod 6$:
- Multiples of $6$: $6, 12, 18, 24, 30, 36, 42, 48, \ldots$
- The largest $\leq 47$ is $42$.
- $47 - 42 = 5$.

Result: $5$. This is the fastest method once you know your multiplication tables well.

:::callout{type=worked-example}
**Find each of the following.**

**(a)** $35 \bmod 8$

The largest multiple of $8$ less than or equal to $35$ is $32$ ($= 4 \times 8$). So $35 - 32 = 3$.

Answer: $35 \bmod 8 = 3$.

**(b)** $100 \bmod 7$

Largest multiple of $7$ up to $100$: $98$ ($= 14 \times 7$). So $100 - 98 = 2$.

Answer: $100 \bmod 7 = 2$.

**(c)** $45 \bmod 9$

$45 = 5 \times 9 + 0$. So $45 \bmod 9 = 0$.

Answer: $0$ ($45$ is a multiple of $9$).

**(d)** $124 \bmod 12$

Largest multiple of $12$ up to $124$: $120$ ($= 10 \times 12$). So $124 - 120 = 4$.

Answer: $124 \bmod 12 = 4$.

**(e)** $7 \bmod 12$

Here $a < n$. So no multiple of $12$ fits inside $7$. The remainder is just $7$ itself.

Answer: $7 \bmod 12 = 7$.

**(f)** $0 \bmod 5$

$0 = 0 \times 5 + 0$. So $0 \bmod 5 = 0$.
:::

## When $a$ is smaller than $n$

If $a < n$, then $a \bmod n = a$. There's no multiple of $n$ to subtract, so the remainder is $a$ itself.

- $3 \bmod 7 = 3$
- $5 \bmod 12 = 5$
- $0 \bmod 9 = 0$

## When $a$ is negative — a special case

Negative numbers in modular arithmetic are uncommon at WAEC Core level, but worth understanding. The rule is: the remainder must still be in the range $[0, n-1]$.

For $-3 \bmod 7$:
- You want $r$ such that $-3 = q \times 7 + r$ with $0 \leq r < 7$.
- Try $q = -1$: $-3 = -1 \times 7 + 4$. So $r = 4$.
- So $-3 \bmod 7 = 4$.

**Way to think about it:** *what number between 0 and 6 has the same wrap position as $-3$ in a 7-step cycle?* Going $-3$ steps backwards is the same as going $4$ steps forwards (in a 7-cycle), so $-3 \bmod 7 = 4$.

This comes up occasionally in WAEC, particularly in clock problems ("$3$ hours before $1$ o'clock").

## Equivalence — when two numbers have the same remainder

Two numbers $a$ and $b$ are said to be **congruent modulo $n$** if they have the same remainder when divided by $n$. Written:

$$a \equiv b \pmod{n}$$

This is read: "$a$ is congruent to $b$ modulo $n$."

**Examples:**

- $17 \equiv 2 \pmod{5}$ (both leave remainder $2$ when divided by $5$).
- $24 \equiv 3 \pmod{7}$ (because $24 = 3 \times 7 + 3$).
- $20 \equiv 8 \pmod{6}$ (because $20 = 3 \times 6 + 2$ and $8 = 1 \times 6 + 2$).
- $50 \equiv 0 \pmod{10}$ (because $50$ is a multiple of $10$).

This congruence relation is the heart of modular arithmetic. We don't always reduce to the remainder; sometimes we say "these two numbers are equivalent in this modular system," which means we can use either one in calculations.

## A visual picture — the modular clock

Think of modular arithmetic as a clock with $n$ positions, numbered $0$ to $n - 1$.

For mod 5, the clock has positions $0, 1, 2, 3, 4$ arranged in a circle.

![A 12-hour clock showing 9 + 5 = 14 ≡ 2 (mod 12), and the seven days of the week showing that 10 days after Monday is Thursday](https://wasscetutor.com/img/mathematics/mod-clock.svg)

*Figure 1. Clocks and calendars are everyday modular arithmetic: mod 12 for hours, mod 7 for days. WASSCE Tutor diagram.*

To find $a \bmod 5$, start at position $0$ and walk $a$ steps clockwise. Where you end up is the answer.

- $7 \bmod 5$: walk 7 steps. Pass 0, 1, 2, 3, 4, return to 0, walk to 1, then 2. End at position $2$. So $7 \bmod 5 = 2$.
- $11 \bmod 5$: walk 11 steps. After 5 steps you're back at 0, after 10 you're back at 0 again, then 1 step to position $1$. So $11 \bmod 5 = 1$.

The key insight: **every time you complete a full circle, you can ignore those steps**. So $11 = 2 \times 5 + 1$ means you go around twice and end one step further. The 2 full circles don't change your position — only the remainder ($1$) matters.

:::callout{type=worked-example}
**Use the modular clock idea to find each.**

**(a)** $25 \bmod 7$

A mod 7 clock has 7 positions. $25 = 3 \times 7 + 4$, so you complete 3 full circles and step 4 more. Answer: $4$.

**(b)** $80 \bmod 9$

$80 = 8 \times 9 + 8$. So 8 full circles, then 8 more steps. Answer: $8$.

**(c)** $84 \bmod 12$

$84 = 7 \times 12 + 0$. Seven full circles, no extra steps. Answer: $0$.

**(d)** $1000 \bmod 7$

Largest multiple of 7 less than or equal to 1000: $7 \times 142 = 994$. So $1000 - 994 = 6$. Answer: $6$.
:::

## Real-life appearances of modular arithmetic

### The 12-hour clock

A 12-hour clock is mod 12 arithmetic. Hours add modulo 12.

- *If it's $10$ o'clock now, what time will it be in $5$ hours?*
- $10 + 5 = 15$. But $15 \bmod 12 = 3$. Answer: $3$ o'clock.

### The 24-hour clock

A military or international clock is mod 24.

- *It's $22{:}00$. What time will it be in $7$ hours?*
- $22 + 7 = 29$. $29 \bmod 24 = 5$. Answer: $05{:}00$ (5 a.m.).

### Days of the week

Days cycle every 7 days, so mod 7 arithmetic applies.

- *Today is Wednesday. What day will it be in $30$ days?*
- Counting Wednesday as day 0, we want $30 \bmod 7$. $30 = 4 \times 7 + 2$, so $30 \bmod 7 = 2$. Two days after Wednesday is **Friday**.

### Days of the month / week

Less obvious examples include: days of the year (mod 365 or 366), months of the year (mod 12), positions on a circular track (mod number of seats), and even something like the position of a player rotating around a snooker table.

The next lesson goes deeper into clock and day-of-the-week problems. For now, focus on the basic remainder operation.

:::callout{type=worked-example}
**Find each.**

**(a)** *Today is Friday. What day will it be in $50$ days?*

$50 \bmod 7$: largest multiple of 7 is 49 ($= 7 \times 7$). So $50 - 49 = 1$. One day after Friday is **Saturday**.

**(b)** *It's $9$ a.m. What time will it be in $30$ hours?*

On a 12-hour clock: $9 + 30 = 39$. $39 \bmod 12 = 3$. So $3$ — but we need to know if it's a.m. or p.m. $30$ hours is one full day plus $6$ hours, so the time is $3$ p.m.

On a 24-hour clock: $9 + 30 = 39$. $39 \bmod 24 = 15$. So $15{:}00$ (i.e., 3 p.m.). Same answer.

**(c)** *In a year of $365$ days, January 1 is a Monday. What day of the week is December 31?*

December 31 is day 365 of the year. We want the day 364 days after January 1 (because January 1 is day 1, December 31 is day 365, so we add 364 days).

$364 \bmod 7$: $364 = 52 \times 7 + 0$. So 0 days past Monday — same day, Monday.

Answer: **Monday**. (Yes — exactly 52 weeks in 365 days plus 1 day. The 1-day shift means the next year's January 1 is a Tuesday.)
:::

## Key properties — preview

We develop these in the next lesson, but here is a quick preview of why modular arithmetic is useful:

1. **Reduce before computing.** Instead of computing $147 + 198$ and then taking mod, you can take each mod first, add, then mod the result. This keeps the numbers small.

2. **Multiples cancel.** If $a \equiv 0 \pmod{n}$, then $a$ contributes nothing to a mod calculation involving multiples of $n$.

3. **Speed.** For large numbers, modular reduction can replace heavy arithmetic. WAEC questions like *"Find the remainder when $2^{50}$ is divided by $7$"* are solved this way.

:::callout{type=local-example}
A cassava trader in Bo Market keeps a tally of bags sold. Every $7$ bags, she ties them in a bundle and stacks them. At the end of the day, she has stacked $9$ bundles plus $3$ loose bags. Her records say she sold $66$ bags. Did she count correctly?

Let's check: $66 \bmod 7 = ?$ Largest multiple of $7$ up to $66$ is $63$ ($= 9 \times 7$). So $66 - 63 = 3$. ✓

Her records of *9 bundles + 3 loose* correspond to $66 \bmod 7 = 3$ — exactly what we got. The check works because of how modular arithmetic captures the structure of repeated grouping.
:::

:::callout{type=common-mistake}
**Common errors when first learning modular arithmetic:**

**1. Forgetting that the remainder must be less than the modulus.**
- ❌ Writing $14 \bmod 5 = 5$ or $\bmod 5 = -1$.
- ✓ $14 \bmod 5 = 4$ (because $14 = 2 \times 5 + 4$, and $4$ is in the range $[0, 4]$).

**2. Confusing $a \bmod n$ with the quotient.**
- The result is the **remainder**, not how many times $n$ divides $a$.
- $17 \bmod 5 = 2$, not $3$ (which would be the quotient).

**3. Treating mod like division.**
- $a \bmod n$ is *not* the same as $\frac{a}{n}$. It's the remainder after division.

**4. Forgetting to wrap a negative number into the positive range.**
- $-2 \bmod 5$ is not $-2$. It's $3$ (because $-2 + 5 = 3$).

**5. Treating $a \bmod n = 0$ as a special error.**
- $0$ is a perfectly valid remainder. $20 \bmod 5 = 0$ means $20$ is a multiple of $5$.
:::

## Key terms

:::callout{type=definition title="Key terms"}
- **Congruence**: $a \equiv b \pmod{n}$: $a$ and $b$ leave the same remainder when divided by $n$.
- **Modulus**: the number $n$ by which numbers are divided in modular arithmetic.
:::

## WASSCE examination focus

:::callout{type=waec-tests}
The basic mod operation is the foundation of every WAEC question on this topic. Typical question formats:

- *Find $a \bmod n$.* Direct computation — examples above.
- *Find the remainder when $a$ is divided by $n$.* Same as $a \bmod n$, asked in different words.
- *Which of the following is the value of $25 \bmod 4$?* Multiple choice, single integer.
- *On a 12-hour clock, what time will it be $7$ hours after $8$ o'clock?* Disguised mod 12 question.
- *If today is Monday, what day will it be in $100$ days?* Mod 7 question.

Master the remainder operation before moving on to modular addition and multiplication. **Always check that your answer is in the range $[0, n-1]$.**
:::

## Practice problems

Try each question first, then open the answer to check your working.

**1.** Find $43 \bmod 6$.

:::reveal{title="Show the answer"}
$43 \div 6 = 7$ remainder $1$ (because $7 \times 6 = 42$, and $43 - 42 = 1$). So $43 \bmod 6 = 1$.
:::

**2.** Find $100 \bmod 8$.

:::reveal{title="Show the answer"}
$100 \div 8 = 12$ remainder $4$ (because $12 \times 8 = 96$, and $100 - 96 = 4$). So $100 \bmod 8 = 4$.
:::

**3.** Find $77 \bmod 11$.

:::reveal{title="Show the answer"}
$77 \div 11 = 7$ remainder $0$ (because $7 \times 11 = 77$). So $77 \bmod 11 = 0$.
:::

**4.** Find $5 \bmod 12$.

:::reveal{title="Show the answer"}
$5 < 12$, so $5 \bmod 12 = 5$.
:::

**5.** Find $84 \bmod 12$.

:::reveal{title="Show the answer"}
$84 \div 12 = 7$ remainder $0$ (because $7 \times 12 = 84$). So $84 \bmod 12 = 0$.
:::

**6.** *Today is Sunday. What day will it be $25$ days from now?*

:::reveal{title="Show the answer"}
$25 \bmod 7$: largest multiple of $7$ up to $25$ is $21$. So $25 - 21 = 4$. Four days after Sunday: Monday, Tuesday, Wednesday, **Thursday**.
:::

**7.** *It is $4$ p.m. on a 12-hour clock. What time will it be in $20$ hours?*

:::reveal{title="Show the answer"}
$4 + 20 = 24$ on a 12-hour clock. $24 \bmod 12 = 0$, which on a clock face is **12 o'clock**. (a.m. or p.m.? $20$ hours from $4$ p.m. is $12$ p.m. — i.e., noon the next day.)
:::

**8.** Find $250 \bmod 9$.

:::reveal{title="Show the answer"}
$250 \div 9$: $9 \times 27 = 243$, so $250 - 243 = 7$. Answer: $250 \bmod 9 = 7$.
:::

**9.** Find $-5 \bmod 7$.

:::reveal{title="Show the answer"}
$-5 + 7 = 2$ (adding the modulus brings us into the positive range). So $-5 \bmod 7 = 2$. Check: $-5 = -1 \times 7 + 2$. ✓
:::

**10.** *Find the smallest positive value of $x$ such that $x \equiv 23 \pmod{6}$.*

:::reveal{title="Show the answer"}
$23 \bmod 6 = ?$ Largest multiple of $6$ up to $23$ is $18$. So $23 - 18 = 5$. Therefore $23 \equiv 5 \pmod 6$, and the smallest positive $x$ is $x = 5$.
:::

## What's next

In the next lesson we cover **addition, subtraction and multiplication in modular arithmetic**, clock and calendar problems, and solving simple congruences. The key principle: you can reduce *before* you compute. We will see how this turns long calculations into short ones, why $99 + 97 \bmod 7$ is easy without big multiplication, and how WAEC tests this directly.
