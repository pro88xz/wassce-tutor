An equation is a balance: whatever is on the left equals whatever is on the right. Solving it means finding the value of the unknown that keeps the balance true, by doing the **same thing to both sides** until the unknown stands alone. WASSCE tests linear equations directly, inside word problems, and above all as **simultaneous equations**, two equations with two unknowns, which appear in almost every paper. This lesson covers all of it, with worked examples of every type.

## Learning objectives

By the end of this lesson you should be able to:

- solve linear equations with brackets, unknowns on both sides, and fractions
- form and solve equations from word problems
- solve simultaneous linear equations by elimination and by substitution
- check every solution

## The balance method

:::callout{type=definition}
A **linear equation** is an equation in which the unknown has power 1 (no $x^2$, no $\tfrac1x$): $3x + 5 = 20$.

To solve it, **undo** the operations around $x$, doing the **same** to both sides:

| If $x$ has been… | then… |
|---|---|
| added to | subtract |
| subtracted from | add |
| multiplied | divide |
| divided | multiply |
:::

:::callout{type=worked-example}
**Solve $3x + 5 = 20$.**

$$3x = 15 \quad\Rightarrow\quad x = 5$$

**Check:** $3(5) + 5 = 20$ ✓
:::

## Unknowns on both sides

Collect the $x$ terms on one side and the numbers on the other.

:::callout{type=worked-example}
**Solve $7x - 4 = 3x + 12$.**

$$7x - 3x = 12 + 4 \quad\Rightarrow\quad 4x = 16 \quad\Rightarrow\quad x = 4$$

**Check:** $7(4) - 4 = 24$ and $3(4) + 12 = 24$ ✓
:::

## Equations with brackets

Expand first, then solve.

:::callout{type=worked-example}
**Solve $5(2x - 3) - 2(x + 1) = 15$.**

$$10x - 15 - 2x - 2 = 15$$
$$8x - 17 = 15 \quad\Rightarrow\quad 8x = 32 \quad\Rightarrow\quad x = 4$$
:::

## Equations with fractions

Multiply **every term** by the **LCM of the denominators** to clear the fractions.

:::callout{type=worked-example}
**Solve $\dfrac{x + 2}{3} - \dfrac{x - 1}{4} = 2$.**

The LCM of 3 and 4 is 12. Multiply every term by 12:

$$4(x + 2) - 3(x - 1) = 24$$
$$4x + 8 - 3x + 3 = 24 \quad\Rightarrow\quad x + 11 = 24 \quad\Rightarrow\quad x = 13$$

**Check:** $\dfrac{15}{3} - \dfrac{12}{4} = 5 - 3 = 2$ ✓
:::

:::callout{type=common-mistake}
**Forgetting to multiply the right-hand side.** When you multiply by 12, the $2$ on the right becomes $24$. Every term, on both sides, must be multiplied.
:::

## Word problems

1. **Let** $x$ be the unknown (say what it is).
2. **Form** an equation from the information.
3. **Solve** it.
4. **Answer** the question in words, with units.

:::callout{type=worked-example}
**A father is three times as old as his son. In 12 years' time, he will be twice as old as his son. Find their present ages.**

Let the son be $x$ years old; the father is $3x$.

In 12 years: father $3x + 12$, son $x + 12$.

$$3x + 12 = 2(x + 12) \quad\Rightarrow\quad 3x + 12 = 2x + 24 \quad\Rightarrow\quad x = 12$$

**The son is 12 and the father is 36.** (In 12 years: 48 and 24, and $48 = 2 \times 24$ ✓)
:::

## Simultaneous linear equations

Two equations, two unknowns. You need values of $x$ **and** $y$ that make **both** true.

### Method 1: elimination

Make the coefficients of one unknown equal, then add or subtract the equations to eliminate it.

:::callout{type=worked-example}
**Solve:**
$$2x + 3y = 13 \quad\text{(1)}$$
$$5x - 2y = 4 \quad\text{(2)}$$

Make the $y$ coefficients equal: (1) × 2 and (2) × 3:

$$4x + 6y = 26 \quad\text{(3)}$$
$$15x - 6y = 12 \quad\text{(4)}$$

Add (3) and (4): $19x = 38$, so $x = 2$.

Substitute into (1): $2(2) + 3y = 13 \Rightarrow 3y = 9 \Rightarrow y = 3$.

**Solution: $x = 2$, $y = 3$.** Check in (2): $5(2) - 2(3) = 4$ ✓
:::

:::callout{type=tip}
**Add or subtract?** If the coefficients you want to eliminate have **opposite** signs ($+6y$ and $-6y$), **add**. If they have the **same** sign, **subtract**. Remember: "**S**ame **S**ign **S**ubtract".
:::

### Method 2: substitution

Make one unknown the subject of one equation, then substitute into the other. Best when one equation already has $x$ or $y$ alone.

:::callout{type=worked-example}
**Solve:**
$$y = 2x - 1 \quad\text{(1)}$$
$$3x + 2y = 19 \quad\text{(2)}$$

Substitute (1) into (2): $3x + 2(2x - 1) = 19 \Rightarrow 7x - 2 = 19 \Rightarrow x = 3$.

Then $y = 2(3) - 1 = 5$. **Solution: $x = 3$, $y = 5$.**
:::

:::callout{type=local-example}
**At a shop in Makeni, 3 exercise books and 2 pens cost NLe 54, and 2 exercise books and 5 pens cost NLe 47. Find the price of one exercise book and one pen.**

Let a book cost $b$ leones and a pen $p$ leones:

$$3b + 2p = 54 \quad\text{(1)}$$
$$2b + 5p = 47 \quad\text{(2)}$$

Make the $b$ coefficients equal: (1) × 2 gives $6b + 4p = 108$; (2) × 3 gives $6b + 15p = 141$.

Subtract: $11p = 33$, so $p = 3$. Then $3b + 2(3) = 54$, so $3b = 48$ and $b = 16$.

**A book costs NLe 16 and a pen NLe 3.** Check in (2): $2(16) + 5(3) = 32 + 15 = 47$ ✓

If an answer ever comes out as an impossible price or age (a negative number, or a pen costing NLe 4.636…), stop and check your equations and arithmetic.
:::

## Practice

:::reveal{title="1. Solve: 4(x − 2) = 2x + 6"}
$$4x - 8 = 2x + 6 \Rightarrow 2x = 14 \Rightarrow x = 7$$
:::

:::reveal{title="2. Solve: (2x − 1)/5 = (x + 3)/3"}
Multiply by 15: $3(2x - 1) = 5(x + 3) \Rightarrow 6x - 3 = 5x + 15 \Rightarrow x = 18$.
:::

:::reveal{title="3. Solve simultaneously: x + y = 10 and x − y = 4"}
Add: $2x = 14 \Rightarrow x = 7$; then $y = 3$.
:::

:::reveal{title="4. Solve simultaneously: 3x + 4y = 18 and 2x − 3y = −5"}
(1) × 2: $6x + 8y = 36$; (2) × 3: $6x - 9y = -15$. Subtract: $17y = 51 \Rightarrow y = 3$.

Then $3x + 12 = 18 \Rightarrow x = 2$. **$x = 2$, $y = 3$.**
:::

:::reveal{title="5. The sum of two numbers is 25 and their difference is 7. Find the numbers."}
$x + y = 25$, $x - y = 7$. Add: $2x = 32$, $x = 16$; $y = 9$. **16 and 9.**
:::

:::reveal{title="6. A man shares NLe 1 200 between his two children so that the elder gets NLe 300 more than the younger. How much does each get?"}
Let the younger get $x$: $x + (x + 300) = 1200 \Rightarrow 2x = 900 \Rightarrow x = 450$.

**Younger: NLe 450; elder: NLe 750.**
:::

## Key terms

:::callout{type=definition title="Key terms"}
- **Simultaneous equations**: two or more equations with the same unknowns, solved together.
- **Elimination method**: solving simultaneous equations by adding or subtracting them so that one unknown disappears.
- **Substitution method**: solving simultaneous equations by making one unknown the subject of one equation and putting it into the other.
- **Clearing fractions**: multiplying every term of an equation by the LCM of the denominators so that no fractions remain.
- **Forming an equation**: writing the information in a word problem as an equation in the unknown.
:::

## Key points

- Do the **same** to both sides; **undo** operations in reverse order.
- **Expand** brackets first; **multiply every term by the LCM** to clear fractions.
- For word problems: **let, form, solve, answer** in words.
- Simultaneous equations: **elimination** (make coefficients equal; same sign subtract, opposite signs add) or **substitution**.
- **Check** every solution in the original equation(s), and ask if the answer is **sensible**.

## WASSCE examination focus

:::callout{type=waec-tests}
Linear and simultaneous equations appear in every paper: as objective questions, as the core of word problems (ages, prices, sharing money, numbers), and as a step in harder theory questions. Examiners award method marks for **forming** the equations correctly, so always write the equations down clearly before solving.
:::
