:::callout{type=definition}
A **set** is a well-defined collection of distinct objects, called its **elements** or **members**. "Well-defined" means that for any object you can say for certain whether it belongs to the set: $\{2, 3, 5, 7\}$, the prime numbers less than 10, is a set; "the good footballers in Freetown" is not.
:::

Set notation is the language of the whole Further Mathematics course: domains of functions, solution sets of inequalities, sample spaces in probability. This lesson goes beyond the core course to the **algebra of sets** (the commutative, associative and distributive laws and **De Morgan's laws**), the number of **subsets** and the **power set**, and **three-set problems** solved with the inclusion–exclusion formula.

## Learning objectives

By the end of this lesson you should be able to:

- use set notation: $\in$, $\subset$, $\cup$, $\cap$, $A'$, $n(A)$, $\varnothing$
- list the subsets of a set and find the number of subsets
- apply the laws of the algebra of sets, including De Morgan's laws
- simplify set expressions and illustrate them on Venn diagrams
- use $n(A \cup B) = n(A) + n(B) - n(A \cap B)$ and its three-set form
- solve word problems with three overlapping sets

## Notation

:::callout{type=definition}
**Universal set ($U$ or $\xi$):** the set of all the elements under consideration.

**Subset:** $A \subseteq B$ means every element of $A$ is also an element of $B$; $A \subset B$ means $A$ is a **proper subset**, contained in $B$ but not equal to it.

**Empty set:** the set with no elements, written $\varnothing$ or $\{\ \}$; it is a subset of every set.

**Complement:** $A'$ (or $A^c$) is the set of elements of $U$ that are not in $A$.
:::

| Symbol | Meaning | Example, with $A = \{1, 2, 3, 4\}$, $B = \{3, 4, 5\}$ |
|---|---|---|
| $A \cup B$ | union: in $A$ or $B$ or both | $\{1, 2, 3, 4, 5\}$ |
| $A \cap B$ | intersection: in both | $\{3, 4\}$ |
| $A - B$ | difference: in $A$ but not $B$ | $\{1, 2\}$ |
| $n(A)$ | the number of elements | $n(A) = 4$ |

## Subsets and the power set

:::callout{type=definition}
**Power set:** the set of all the subsets of a set $A$, written $P(A)$; a set with $n$ elements has $2^n$ subsets.
:::

For $A = \{a, b, c\}$, the subsets are $\varnothing$, $\{a\}$, $\{b\}$, $\{c\}$, $\{a, b\}$, $\{a, c\}$, $\{b, c\}$ and $\{a, b, c\}$: $2^3 = 8$ of them, of which $8 - 1 = 7$ are proper subsets. Each element is either in a subset or not, two choices each, which is why the count is $2^n$.

## The algebra of sets

| Law | Union | Intersection |
|---|---|---|
| Commutative | $A \cup B = B \cup A$ | $A \cap B = B \cap A$ |
| Associative | $(A \cup B) \cup C = A \cup (B \cup C)$ | $(A \cap B) \cap C = A \cap (B \cap C)$ |
| Distributive | $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$ | $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$ |
| Identity | $A \cup \varnothing = A$ | $A \cap U = A$ |
| Complement | $A \cup A' = U$ | $A \cap A' = \varnothing$ |

:::callout{type=definition}
**De Morgan's laws:** the complement of a union is the intersection of the complements, $(A \cup B)' = A' \cap B'$, and the complement of an intersection is the union of the complements, $(A \cap B)' = A' \cup B'$.
:::

:::callout{type=worked-example}
**$U = \{1, 2, \dots, 10\}$, $A = \{1, 2, 3, 4, 5\}$, $B = \{2, 4, 6, 8\}$. Verify that $(A \cup B)' = A' \cap B'$.**

$A \cup B = \{1, 2, 3, 4, 5, 6, 8\}$, so $(A \cup B)' = \{7, 9, 10\}$.

$A' = \{6, 7, 8, 9, 10\}$, $B' = \{1, 3, 5, 7, 9, 10\}$, so $A' \cap B' = \{7, 9, 10\}$ ✓.

**Simplify $(A \cap B) \cup (A \cap B')$.**

By the distributive law, $= A \cap (B \cup B') = A \cap U = A$.
:::

## Counting with Venn diagrams

For two sets:

$$n(A \cup B) = n(A) + n(B) - n(A \cap B)$$

The intersection is subtracted because it was counted twice. For three sets the formula adds back the elements in all three, which were subtracted once too often:

$$n(A \cup B \cup C) = n(A) + n(B) + n(C) - n(A \cap B) - n(A \cap C) - n(B \cap C) + n(A \cap B \cap C)$$

:::callout{type=definition}
**Inclusion–exclusion principle:** the rule for counting the elements of a union: add the sizes of the sets, subtract the sizes of the pairwise intersections, add back the triple intersection.
:::

:::callout{type=worked-example}
**In a class of 60 students, 30 study Further Mathematics (F), 28 Physics (P) and 26 Chemistry (C). 12 study F and P, 10 study F and C, 11 study P and C, and 5 study all three. How many study none of the three? How many study Further Mathematics only?**

Fill the Venn diagram from the middle out:

- all three: 5
- F and P only: $12 - 5 = 7$; F and C only: $10 - 5 = 5$; P and C only: $11 - 5 = 6$
- F only: $30 - 7 - 5 - 5 = 13$; P only: $28 - 7 - 6 - 5 = 10$; C only: $26 - 5 - 6 - 5 = 10$

At least one: $13 + 10 + 10 + 7 + 5 + 6 + 5 = 56$, so **4** study none, and **13** study Further Mathematics only.
:::

![Three-set Venn diagram for 60 students: 13 study Further Mathematics only, 10 Physics only, 10 Chemistry only, 7 F and P only, 5 F and C only, 6 P and C only, 5 all three, and 4 none](https://wasscetutor.com/img/further-mathematics/venn-three-inclusion.svg)

*Figure 1. Fill a three-set Venn diagram from the centre outwards. WASSCE Tutor diagram.*

:::callout{type=common-mistake}
"12 study F and P" usually includes the 5 who study all three. Start with the centre and subtract it from each pair before filling the "only" regions; writing 12 straight into the F-and-P-only region counts those 5 students twice.
:::

:::callout{type=local-example}
A survey of 100 households in a Makeni neighbourhood found that 70 cook with charcoal, 45 with firewood and 20 with gas; 25 use charcoal and firewood, 10 charcoal and gas, 8 firewood and gas, and 5 all three. By inclusion–exclusion, $70 + 45 + 20 - 25 - 10 - 8 + 5 = 97$ households use at least one of these fuels, so 3 use none of them.
:::

## Practice

:::reveal{title="1. How many subsets has a set with 5 elements? How many are proper subsets?"}
$2^5 = 32$ subsets; $32 - 1 = 31$ proper subsets.
:::

:::reveal{title="2. Simplify (A ∪ B) ∩ (A ∪ B′)."}
By the distributive law, $= A \cup (B \cap B') = A \cup \varnothing = A$.
:::

:::reveal{title="3. n(U) = 50, n(A) = 28, n(B) = 25, n(A ∩ B) = 10. Find n(A′ ∩ B′)."}
$n(A \cup B) = 28 + 25 - 10 = 43$. By De Morgan, $A' \cap B' = (A \cup B)'$, so $n = 50 - 43 = 7$.
:::

:::reveal{title="4. Write (A ∩ B)′ in another way and illustrate it."}
$(A \cap B)' = A' \cup B'$: everything outside the overlap of $A$ and $B$ is shaded.
:::

:::reveal{title="5. In the Further Mathematics survey above, how many students study exactly two of the subjects?"}
$7 + 5 + 6 = 18$.
:::

## Key points

- A set with $n$ elements has $2^n$ subsets and $2^n - 1$ proper subsets.
- Union and intersection are commutative, associative and distributive over each other.
- De Morgan: $(A \cup B)' = A' \cap B'$ and $(A \cap B)' = A' \cup B'$.
- $n(A \cup B) = n(A) + n(B) - n(A \cap B)$; for three sets, add back $n(A \cap B \cap C)$.
- Fill three-set Venn diagrams from the centre outwards.

## WASSCE examination focus

:::callout{type=waec-tests}
WASSCE Further Mathematics sets questions ask you to simplify set expressions with the laws of sets, to use De Morgan's laws, to find the number of subsets, and to solve three-set word problems, often with an unknown $x$ in the centre region that you find by forming an equation. Draw a clearly labelled Venn diagram, fill it from the middle, and check that all the regions add up to $n(U)$.
:::
