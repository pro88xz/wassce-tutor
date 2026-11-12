"In a class of 40, 25 study Physics, 18 study Chemistry and 7 study neither. How many study both?" Questions like this appear in nearly every WASSCE paper. The tool that cracks them is the **Venn diagram**. This lesson covers the set operations, how to show them on Venn diagrams, and a reliable method for two-set and three-set problems.

## Learning objectives

By the end of this lesson you should be able to:

- find the union, intersection and complement of sets
- represent sets and set operations on Venn diagrams
- use the formula $n(A \cup B) = n(A) + n(B) - n(A \cap B)$
- solve two-set and three-set problems, including those with an unknown $x$

## Set operations

| Operation | Symbol | Meaning |
|---|---|---|
| Union | $A \cup B$ | elements in $A$ or $B$ or both |
| Intersection | $A \cap B$ | elements in both $A$ and $B$ |
| Complement | $A'$ | elements of the universal set $U$ that are not in $A$ |
| Disjoint sets | $A \cap B = \emptyset$ | no elements in common |

:::callout{type=worked-example}
**$U = \{1, 2, 3, \ldots, 10\}$, $A = \{2, 4, 6, 8, 10\}$ and $B = \{1, 2, 3, 4, 5\}$. Find $A \cup B$, $A \cap B$, $A'$ and $(A \cup B)'$.**

- $A \cup B = \{1, 2, 3, 4, 5, 6, 8, 10\}$
- $A \cap B = \{2, 4\}$
- $A' = \{1, 3, 5, 7, 9\}$
- $(A \cup B)' = \{7, 9\}$
:::

## Venn diagrams

![Three Venn diagrams of A and B inside U: the first shades the intersection, the second the union, the third the complement of A](https://wasscetutor.com/img/mathematics/venn-operations.svg)

*Figure 1. Shading the intersection, union and complement. WASSCE Tutor diagram.*

The rectangle is the universal set $U$; circles are the sets. Each **region** holds the elements that belong to exactly those sets. The number in the overlap is counted in **both** circles, which is why

$$n(A \cup B) = n(A) + n(B) - n(A \cap B)$$

## Two-set problems

**Method:** put the overlap in first, then work outwards, and remember the region outside both circles.

![A Venn diagram with 15 in Physics only, 10 in both, 8 in Chemistry only and 7 outside, for a class of 40](https://wasscetutor.com/img/mathematics/venn-two-set-problem.svg)

*Figure 2. The class problem solved on a Venn diagram. WASSCE Tutor diagram.*

:::callout{type=worked-example}
**In a class of 40, 25 study Physics, 18 study Chemistry and 7 study neither. How many study (a) both (b) Physics only?**

Students in at least one subject: $40 - 7 = 33$.

**(a)** $n(P \cap C) = 25 + 18 - 33 = 10$

**(b)** Physics only $= 25 - 10 = 15$. (Chemistry only $= 8$; check: $15 + 10 + 8 + 7 = 40$ ✓.)
:::

:::callout{type=local-example}
**Of 50 traders at a Freetown market, 30 sell rice, 25 sell palm oil and 3 sell neither. Let $x$ sell both. Find $x$.**

Regions: rice only $30 - x$, both $x$, palm oil only $25 - x$, neither 3.

$$(30 - x) + x + (25 - x) + 3 = 50 \quad\Rightarrow\quad 58 - x = 50 \quad\Rightarrow\quad x = 8$$

So 8 traders sell both.
:::

## Three-set problems

![Three overlapping circles A, B and C divide the universal set into eight regions: each single only, each pair only, all three, and none](https://wasscetutor.com/img/mathematics/venn-three-set.svg)

*Figure 3. Fill a three-set diagram from the centre outwards. WASSCE Tutor diagram.*

**Method:**

1. Put the number in **all three** sets in the centre.
2. For each pair, the **pair-only region is the pair total minus the centre**.
3. For each set, the **single-only region is the set total minus its two pair-only regions and the centre**.
4. Add all seven regions; subtract from the total to find **none**.

:::callout{type=worked-example}
**Of 100 students, 50 take Mathematics (M), 45 English (E) and 40 Science (S). 15 take M and E, 18 take M and S, 12 take E and S, and 6 take all three. How many take none?**

- Centre: 6
- M and E only: $15 - 6 = 9$; M and S only: $18 - 6 = 12$; E and S only: $12 - 6 = 6$
- M only: $50 - 9 - 12 - 6 = 23$; E only: $45 - 9 - 6 - 6 = 24$; S only: $40 - 12 - 6 - 6 = 16$
- At least one: $23 + 24 + 16 + 9 + 12 + 6 + 6 = 96$

So $100 - 96 = 4$ take none.

**Check with the formula:** $50 + 45 + 40 - 15 - 18 - 12 + 6 = 96$. ✓
:::

:::callout{type=common-mistake}
"15 take M and E" usually includes the 6 who take all three. Writing 15 in the M-and-E-only region double-counts. Always subtract the centre first.
:::

## Key points

- **Union** $\cup$: in either. **Intersection** $\cap$: in both. **Complement** $'$: not in.
- $n(A \cup B) = n(A) + n(B) - n(A \cap B)$.
- Two sets: **overlap first**, then each set only, then **neither**.
- Three sets: **centre → pairs only → singles only → none**.
- Check that all regions add up to $n(U)$.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect to **list unions, intersections and complements**, to **shade regions** such as $(A \cup B)'$ or $A \cap B'$, and to **solve two- and three-set word problems**, often with an unknown $x$ in one region. Draw and label the Venn diagram; it earns method marks.
:::

## Quick check

1. If $n(A) = 12$, $n(B) = 9$ and $n(A \cup B) = 17$, find $n(A \cap B)$.
2. $U = \{a, b, c, d, e, f\}$, $P = \{a, b, c\}$, $Q = \{c, d\}$. Find $P' \cap Q$.
3. In a group of 30, 18 like football, 15 like volleyball and $x$ like both; everyone likes at least one. Find $x$.
4. In question 3, how many like football only?
5. Which region does $A \cap B'$ describe in words?

**Answers:**

1. $12 + 9 - 17 = 4$.
2. $P' = \{d, e, f\}$, so $P' \cap Q = \{d\}$.
3. $18 + 15 - x = 30$, so $x = 3$.
4. $18 - 3 = 15$.
5. Elements in $A$ but not in $B$ ("A only").
