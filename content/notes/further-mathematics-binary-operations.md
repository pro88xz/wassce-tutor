:::callout{type=definition}
A **binary operation** is a rule that combines any two elements of a set to give one element. Addition and multiplication of numbers are binary operations; so is a newly defined rule such as $a \ast b = a + b - 2ab$, which combines 3 and 4 to give $3 + 4 - 24 = -17$.
:::

WASSCE Further Mathematics often defines a new operation, such as $a * b = a + b - 2ab$, and asks whether it is commutative or associative, what its identity element is, and what the inverse of a given element is. The method is the same every time, so these are marks you can count on. This lesson covers **closure**, the **commutative** and **associative** properties, the **identity element**, **inverses**, and **operation tables**.

## Learning objectives

By the end of this lesson you should be able to:

- evaluate expressions such as $3 * 4$ and $(2 * 1) * 3$ for a defined operation
- test an operation for closure, commutativity and associativity
- find the identity element of an operation
- find the inverse of an element, and the element that has no inverse
- complete and read an operation table
- solve equations involving a defined operation

## Evaluating a defined operation

Substitute the values in the order given. With $a * b = a + b - 2ab$:

- $3 * 4 = 3 + 4 - 2(3)(4) = 7 - 24 = -17$
- $(1 * 2) * 3$: first $1 * 2 = 1 + 2 - 4 = -1$, then $-1 * 3 = -1 + 3 - 2(-1)(3) = 2 + 6 = 8$

## Properties of a binary operation

:::callout{type=definition}
**Closure:** a set $S$ is closed under $*$ if $a * b$ is in $S$ for every $a$ and $b$ in $S$; the integers are closed under subtraction, but the natural numbers are not ($2 - 5 = -3$).

**Commutative:** $*$ is commutative if $a * b = b * a$ for all $a, b$.

**Associative:** $*$ is associative if $(a * b) * c = a * (b * c)$ for all $a, b, c$.

**Identity element:** an element $e$ such that $a * e = e * a = a$ for every $a$; 0 for addition, 1 for multiplication.

**Inverse:** the inverse of $a$ is the element $a^{-1}$ such that $a * a^{-1} = a^{-1} * a = e$, the identity element.
:::

## Testing the properties

:::callout{type=worked-example}
**The operation $*$ is defined on the real numbers by $a * b = a + b - 2ab$.**

**(a) Is $*$ commutative?** $b * a = b + a - 2ba = a + b - 2ab = a * b$. Yes.

**(b) Is $*$ associative?**

$(a * b) * c = (a + b - 2ab) + c - 2(a + b - 2ab)c = a + b + c - 2ab - 2ac - 2bc + 4abc$

$a * (b * c) = a + (b + c - 2bc) - 2a(b + c - 2bc) = a + b + c - 2bc - 2ab - 2ac + 4abc$

The two are equal, so yes.

**(c) Find the identity element.** Solve $a * e = a$: $a + e - 2ae = a$, so $e(1 - 2a) = 0$ for all $a$, giving $e = 0$.

**(d) Find the inverse of $a$, and the element with no inverse.** Solve $a * a^{-1} = 0$: $a + a^{-1} - 2a\,a^{-1} = 0$, so $a^{-1}(1 - 2a) = -a$ and

$$a^{-1} = \frac{a}{2a - 1}, \qquad a \ne \tfrac12$$

The inverse of 3 is $\dfrac{3}{5}$ (check: $3 + \tfrac35 - 2(3)\left(\tfrac35\right) = \tfrac{18}{5} - \tfrac{18}{5} = 0$ ✓), and $\tfrac12$ has no inverse.
:::

:::callout{type=common-mistake}
The identity element must be a single constant that works for **every** $a$. If your answer for $e$ depends on $a$, such as $e = \dfrac{a}{a + 1}$, there is no identity element. Find the identity first: you need it to find any inverse.
:::

## Operation tables

:::callout{type=definition}
**Operation table:** a table that shows $a * b$ for every pair of elements of a finite set, with $a$ down the side and $b$ along the top.
:::

The set $\{1, 3, 5, 7\}$ under multiplication modulo 8:

| $\times_8$ | 1 | 3 | 5 | 7 |
|---|---|---|---|---|
| **1** | 1 | 3 | 5 | 7 |
| **3** | 3 | 1 | 7 | 5 |
| **5** | 5 | 7 | 1 | 3 |
| **7** | 7 | 5 | 3 | 1 |

Reading the table:

- **Closed:** every entry is in $\{1, 3, 5, 7\}$.
- **Commutative:** the table is symmetric about the leading diagonal.
- **Identity:** 1, because the row and column for 1 repeat the headings.
- **Inverses:** each element is its own inverse, because 1 appears on the diagonal in every row ($3 \times 3 = 9 \equiv 1$).

## Equations with a defined operation

:::callout{type=worked-example}
**$a \circ b = ab + a + b$ on the real numbers. Find $x$ if $x \circ 3 = 23$.**

$3x + x + 3 = 23$, so $4x = 20$ and $x = 5$. Check: $5 \circ 3 = 15 + 5 + 3 = 23$ ✓.
:::

:::callout{type=local-example}
A clock that shows the hour 0 to 3 on a four-hour cycle adds hours modulo 4. Its table for $\{0, 1, 2, 3\}$ under addition modulo 4 has identity 0, and each element has an inverse: 1 and 3 undo each other ($1 + 3 = 4 \equiv 0$), and 2 is its own inverse. The same reasoning answers a WASSCE table question in a few lines.
:::

## Practice

:::reveal{title="1. a ∗ b = a + b − 2ab. Find 2 ∗ (−1) and x if x ∗ 2 = 5."}
$2 * (-1) = 2 - 1 - 2(2)(-1) = 1 + 4 = 5$. $x + 2 - 4x = 5$, so $-3x = 3$ and $x = -1$.
:::

:::reveal{title="2. Is a ∆ b = a − b + ab commutative?"}
$2 \Delta 3 = 2 - 3 + 6 = 5$ but $3 \Delta 2 = 3 - 2 + 6 = 7$. Not commutative: one counter-example is enough.
:::

:::reveal{title="3. a ∘ b = ab + a + b. Find the identity element and the inverse of a."}
$ae + a + e = a$ gives $e(a + 1) = 0$, so $e = 0$. $a\,a^{-1} + a + a^{-1} = 0$ gives $a^{-1} = -\dfrac{a}{a + 1}$, $a \ne -1$.
:::

:::reveal{title="4. In the table for {1, 3, 5, 7} under multiplication modulo 8, find 5 × 7 and the inverse of 7."}
$5 \times 7 = 35 \equiv 3$. $7 \times 7 = 49 \equiv 1$, so 7 is its own inverse.
:::

:::reveal{title="5. Is the set of odd integers closed under addition?"}
No: $3 + 5 = 8$, which is even.
:::

## Key points

- Evaluate $a * b$ by substituting in the order given; work brackets first.
- Commutative: $a * b = b * a$. Associative: $(a * b) * c = a * (b * c)$; expand both sides to compare.
- Identity: solve $a * e = a$ for a constant $e$. Inverse: solve $a * a^{-1} = e$.
- In an operation table, symmetry about the diagonal means commutative; the identity's row repeats the headings.
- One counter-example is enough to show a property fails.

## WASSCE examination focus

:::callout{type=waec-tests}
WASSCE Further Mathematics binary operation questions define an operation on the real numbers or give an operation table, then ask you to evaluate expressions, test the commutative and associative properties, find the identity and the inverse of an element, and solve an equation. Show the algebra for each property in full; a property that fails needs one numerical counter-example.
:::
