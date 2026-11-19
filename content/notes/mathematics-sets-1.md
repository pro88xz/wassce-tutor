A **set** is a collection of distinct objects. *The set of even numbers less than $10$* is $\{2, 4, 6, 8\}$. *The set of vowels in English* is $\{a, e, i, o, u\}$. *The set of students in your class who study Chemistry* is a set whose members are those specific students.

Sets are everywhere in mathematics — they're the foundation of probability, statistics, logic, and a great deal of advanced mathematics. WAEC tests sets in every paper, usually with Venn diagram problems that require careful counting.

This lesson introduces sets, the vocabulary, the notation, and basic concepts. The next lesson covers set operations, Venn diagrams, and the two- and three-set problems that come up directly in WAEC.

:::callout{type=definition}
**Set:** A well-defined collection of distinct objects. Each object is called an **element** or **member** of the set.

**Notation:**
- Sets are written in curly braces: $\{a, b, c\}$.
- Elements are listed separated by commas.
- Sets are usually named with capital letters: $A, B, C$, etc.
- Membership is denoted by $\in$: "$a \in A$" means "$a$ is in $A$".
- Non-membership: $\notin$.
:::


## Learning objectives

By the end of this lesson you should be able to:

- define a set and describe it in roster or set-builder form
- use set notation correctly
- identify empty, finite, infinite, equal and equivalent sets
- find subsets and the number of subsets of a set

## Ways to describe a set

A set can be defined in two main ways.

### 1. List the elements (roster form)

Write out each element in curly braces.

- $A = \{1, 2, 3, 4, 5\}$ — the set of the first five positive integers.
- $B = \{a, e, i, o, u\}$ — the set of vowels.
- $C = \{$Monday$,$ Wednesday$,$ Friday$\}$ — three weekdays.

The roster form is precise and clear for finite, small sets. It becomes unwieldy for large or infinite sets.

### 2. Use a defining rule (set-builder form)

Describe the set by a rule that elements must satisfy.

- $A$ $= \{x : x$  is an even number less than  $10\}$ $= \{2, 4, 6, 8\}$.
- $B$ $= \{x : x \in \mathbb{Z}, 0 < x < 10\}$ $= \{1, 2, 3, 4, 5, 6, 7, 8, 9\}$.
- $C$ $= \{x : x \text{ is a prime less than } 20\}$ $= \{2, 3, 5, 7, 11, 13, 17, 19\}$.

The colon ":" reads as "such that." The bar "$|$" is sometimes used instead.

## Important properties of sets

### Sets have no repeated elements

$\{1, 2, 2, 3, 4\}$ is the same set as $\{1, 2, 3, 4\}$. Repeated elements don't change the set.

### Order doesn't matter

$\{3, 1, 2\}$ is the same set as $\{1, 2, 3\}$. Sets are unordered.

### Equal sets

Two sets $A$ and $B$ are **equal** ($A = B$) if they have exactly the same elements.

- $\{1, 2, 3\} = \{3, 1, 2\}$ (same elements, different order — equal).
- $\{1, 2, 3\} \neq \{1, 2\}$ (different elements).

## Special types of sets

### The empty set

The set with no elements is the **empty set**, denoted $\emptyset$ or $\{\}$.

Examples:
- The set of even prime numbers greater than $2$: $\{\}$.
- The set of squares whose sides are negative: $\{\}$.
- The set of African countries north of the equator that are also in South America: $\{\}$.

### Finite and infinite sets

- **Finite set:** has a definite number of elements. E.g., $\{1, 2, 3, 4, 5\}$.
- **Infinite set:** has infinitely many elements. E.g., $\{1, 2, 3, 4, 5, \ldots\}$.

### Singleton set

A set with exactly one element. E.g., $\{7\}$.

### Number sets (commonly used in WAEC)

- $\mathbb{N}$ = natural numbers $\{1, 2, 3, 4, \ldots\}$ (sometimes also includes $0$).
- $\mathbb{Z}$ = integers $\{\ldots, -2, -1, 0, 1, 2, \ldots\}$.
- $\mathbb{Q}$ = rational numbers (any number that can be written as a fraction $\dfrac{a}{b}$).
- $\mathbb{R}$ = real numbers.
- $\mathbb{Z}^+$ = positive integers $\{1, 2, 3, \ldots\}$.
- $\mathbb{Z}^-$ = negative integers $\{-1, -2, -3, \ldots\}$.

## Subsets

A set $A$ is a **subset** of $B$ (written $A \subseteq B$) if every element of $A$ is also in $B$.

Examples:
- $\{1, 2\} \subseteq \{1, 2, 3, 4\}$ ✓
- $\{a, b\} \subseteq \{a, b, c, d\}$ ✓
- $\{1, 5\} \not\subseteq \{1, 2, 3\}$ — because $5 \notin \{1, 2, 3\}$.

### Proper subset

$A$ is a **proper subset** of $B$ (written $A \subset B$) if $A \subseteq B$ but $A \neq B$.

Examples:
- $\{1, 2\} \subset \{1, 2, 3, 4\}$ ✓ (proper, since $\{1, 2\} \neq \{1, 2, 3, 4\}$).
- $\{1, 2, 3, 4\} \subset \{1, 2, 3, 4\}$? No — equal sets aren't proper subsets.

### The empty set is a subset of every set

$\emptyset \subseteq A$ for any set $A$.

### Every set is a subset of itself

$A \subseteq A$ for any set $A$ (using the inclusive definition).

## The universal set

The **universal set**, denoted $U$ or $\xi$, is the set of all elements under consideration in a particular problem. Other sets in the problem are all subsets of $U$.

Example: If $U = \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\}$ and $A = \{2, 4, 6, 8\}$, then $A \subseteq U$.

The universal set is context-dependent. In a Sierra Leonean school survey, $U$ might be "all students in the school."

## Cardinality (number of elements)

The **cardinality** (or order) of a set $A$ is the number of elements in it, denoted $n(A)$ or $|A|$.

- $A = \{1, 2, 3, 4, 5\}$: $n(A) = 5$.
- $B = \{a, e, i, o, u\}$: $n(B) = 5$.
- $C = \{\}$: $n(C) = 0$.
- $D = \{1, 2, 3, \ldots\}$: $n(D) = \infty$ (infinite).

:::callout{type=worked-example}
**For each set, list its elements and find its cardinality.**

**(a)** $A$ $= \{x : x$  is a positive even integer less than  $12\}$.
$A = \{2, 4, 6, 8, 10\}$. $n(A) = 5$.

**(b)** $B$ $= \{x : x$  is a vowel in the word "MATHEMATICS"$\}$.
$B = \{A, E, I\}$ (note: each vowel listed once, even if it appears multiple times in the word). $n(B) = 3$.

**(c)** $C$ $= \{x : x$  is a perfect square less than  $50\}$.
$C = \{1, 4, 9, 16, 25, 36, 49\}$. $n(C) = 7$.

**(d)** $D$ $= \{x : x$  is a month of the year with exactly  $30$  days$\}$.
$D$ $= \{$April$,$ June$,$ September$,$ November$\}$. $n(D) = 4$.

**(e)** $E$ $= \{x : x$  is a country in Africa starting with  $S\}$.
$E$ = {Senegal, Seychelles, Sierra Leone, Somalia, South Africa, South Sudan, Sudan}. $n(E) = 7$.
:::

:::callout{type=worked-example}
**Are the following statements true or false?**

**(a)** $3 \in \{1, 2, 3, 4, 5\}$. **True.**

**(b)** $6 \in \{1, 2, 3, 4, 5\}$. **False.**

**(c)** $\{1, 2\} \subseteq \{1, 2, 3, 4\}$. **True.**

**(d)** $\{1, 5\} \subseteq \{1, 2, 3, 4\}$. **False** (since $5 \notin \{1, 2, 3, 4\}$).

**(e)** $\emptyset \subseteq \{1, 2, 3\}$. **True** (empty set is a subset of every set).

**(f)** $\{a, b, c\} = \{c, b, a\}$. **True** (same elements, order doesn't matter).

**(g)** $n(\emptyset) = 0$. **True**.

**(h)** $n(\{1, 2, 2, 3\}) = 4$. **False**. The set has only $3$ distinct elements: $\{1, 2, 3\}$, so $n = 3$.
:::

## Set equality vs equivalence

:::callout{type=definition}
- **Equal sets** ($A = B$): have exactly the same elements.
- **Equivalent sets** ($A \sim B$): have the same number of elements (same cardinality), but the elements may differ.
:::

Examples:
- $\{1, 2, 3\} = \{3, 1, 2\}$ — equal.
- $\{1, 2, 3\}$ and $\{a, b, c\}$ are equivalent (same cardinality), but not equal.

## Counting subsets

A set with $n$ elements has $2^n$ subsets (including the empty set and the set itself).

- $\{a\}$: subsets are $\emptyset$ and $\{a\}$. Total: $2$.
- $\{a, b\}$: subsets are $\emptyset, \{a\}, \{b\}, \{a, b\}$. Total: $4$.
- $\{a, b, c\}$: subsets are $\emptyset$, $\{a\}$, $\{b\}$, $\{c\}$, $\{a, b\}$, $\{a, c\}$, $\{b, c\}$, $\{a, b, c\}$. Total: $8$.
- A set of $5$ elements has $2^5 = 32$ subsets.
- A set of $10$ elements has $2^{10} = 1024$ subsets.

*Proper subsets* exclude the set itself: $2^n - 1$.

:::callout{type=local-example}
A Sierra Leonean school surveys students about their favourite subjects. The set of all surveyed students is the universal set $U$. The set of students who like Mathematics is $M$, the set who like English is $E$, the set who like Chemistry is $C$.

- $U$ might have $200$ students: $n(U) = 200$.
- $M$ might have $80$ students: $n(M) = 80$.
- $E$ might have $120$ students.
- $C$ might have $50$ students.

All three sets $M$, $E$, $C$ are subsets of $U$. The questions WAEC asks are about overlaps (how many like both M and E, etc.) — covered in the next lesson.
:::

:::callout{type=common-mistake}
**Common errors with sets:**

**1. Counting repeated elements.**
- The set $\{1, 2, 2, 3\}$ has $3$ elements, not $4$. Repetitions are ignored.

**2. Confusing $\in$ with $\subseteq$.**
- $a \in \{a, b, c\}$ (element).
- $\{a\} \subseteq \{a, b, c\}$ (subset).
- $a \subseteq \{a, b, c\}$ is wrong (because $a$ is an element, not a set).

**3. Empty set vs zero.**
- $\emptyset$ is a set with no elements. $\{0\}$ is a set with one element ($0$). They're different.
- $n(\emptyset) = 0$ but $n(\{0\}) = 1$.

**4. Empty set is always a subset.**
- $\emptyset \subseteq A$ for every $A$, including $\emptyset$ itself.

**5. Equal vs equivalent.**
- Equal sets have the same elements.
- Equivalent sets have the same number of elements.
:::

## WASSCE examination focus

:::callout{type=waec-tests}
Foundational set questions in WAEC:

- **List elements.** *List the elements of $\{x : x$  is a positive integer less than  $10\}$.*
- **Find cardinality.** *Find $n(A)$ where $A = \{2, 4, 6, 8, 10, 12\}$.*
- **Subset relations.** *Is $\{1, 2\}$ a subset of $\{1, 2, 3, 4\}$?*
- **Number of subsets.** *How many subsets does a set with $5$ elements have?*
- **Equal sets.** *Are $\{a, b, c\}$ and $\{c, a, b\}$ equal?*

Master the vocabulary and notation before moving to operations.
:::

## Practice problems

Try each question first, then open the answer to check your working.

**1.** List the elements of $A$ $= \{x : x$  is a positive multiple of  $3$  less than  $20\}$.

:::reveal{title="Show the answer"}
$A = \{3, 6, 9, 12, 15, 18\}$.
:::

**2.** Find $n(A)$ where $A = \{a, b, c, d, e, f, g, h\}$.

:::reveal{title="Show the answer"}
$n(A) = 8$.
:::

**3.** Find $n(B)$ where $B$ $= \{x : x$  is a vowel in the word "SIERRA LEONE"$\}$.

:::reveal{title="Show the answer"}
Vowels in "SIERRA LEONE": $I, E, A, O$ (each listed once). $n(B) = 4$.
:::

**4.** State whether each is True or False.
(a) $5 \in \{1, 2, 3, 4, 5, 6\}$
(b) $7 \in \{1, 2, 3, 4, 5, 6\}$
(c) $\{2, 4\} \subseteq \{2, 4, 6, 8\}$
(d) $\emptyset \subseteq \{a, b\}$

:::reveal{title="Show the answer"}
(a) True. (b) False. (c) True. (d) True.
:::

**5.** How many subsets does a set with $6$ elements have?

:::reveal{title="Show the answer"}
$2^6 = 64$.
:::

**6.** Are $\{1, 2, 3\}$ and $\{x, y, z\}$ equal? Equivalent?

:::reveal{title="Show the answer"}
Equal: no (different elements). Equivalent: yes (both have $3$ elements).
:::

**7.** What is $n(\{1, 2, 3, 2, 1\})$?

:::reveal{title="Show the answer"}
$n = 3$ (only $\{1, 2, 3\}$ distinct).
:::

**8.** List all subsets of $\{a, b, c\}$.

:::reveal{title="Show the answer"}
$\emptyset$, $\{a\}$, $\{b\}$, $\{c\}$, $\{a, b\}$, $\{a, c\}$, $\{b, c\}$, $\{a, b, c\}$. Total: $8 = 2^3$.
:::

**9.** Is $\emptyset = \{0\}$?

:::reveal{title="Show the answer"}
No. $\emptyset$ has $0$ elements; $\{0\}$ has $1$ element (the element being $0$).
:::

**10.** How many proper subsets does a set with $4$ elements have?

:::reveal{title="Show the answer"}
$2^4 - 1 = 15$ (all subsets minus the set itself).
:::

## What's next

In the next lesson we cover **set operations** — union ($\cup$), intersection ($\cap$), and complement ($'$) — and use **Venn diagrams** to solve two- and three-set problems. These let you combine sets and form new ones. The notation may look unfamiliar, but the operations are simple and intuitive once visualised.
