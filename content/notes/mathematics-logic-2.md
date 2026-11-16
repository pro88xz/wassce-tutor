"If it rains, the football match is cancelled. The match was not cancelled. So it did not rain." Is this reasoning valid? A **truth table** settles questions like this mechanically, without relying on intuition. This lesson builds truth tables, explains the converse, inverse and contrapositive of a conditional, and shows how to test whether an argument is valid.

## Learning objectives

By the end of this lesson you should be able to:

- construct truth tables for negation, conjunction, disjunction, implication and equivalence
- build truth tables for compound statements
- identify tautologies and contradictions
- write the converse, inverse and contrapositive of a conditional statement
- decide whether a simple argument is valid

## Truth tables for the connectives

![A truth table for p, q, not p, p and q, p or q, and if p then q, across the four combinations of true and false](https://wasscetutor.com/img/mathematics/truth-table-card.svg)

*Figure 1. The basic connectives. WASSCE Tutor diagram.*

| $p$ | $q$ | $\sim p$ | $p \wedge q$ | $p \vee q$ | $p \to q$ | $p \leftrightarrow q$ |
|---|---|---|---|---|---|---|
| T | T | F | T | T | T | T |
| T | F | F | F | T | F | F |
| F | T | T | F | T | T | F |
| F | F | T | F | F | T | T |

Rules to remember:

- $p \wedge q$ ("and") is true only when **both** are true.
- $p \vee q$ ("or") is false only when **both** are false.
- $p \to q$ ("if p then q") is false only when **$p$ is true and $q$ is false**.
- $p \leftrightarrow q$ ("if and only if") is true when $p$ and $q$ have the **same** truth value.

With two statements there are $2^2 = 4$ rows; with three statements there are $2^3 = 8$ rows.

## Compound statements

:::callout{type=worked-example}
**Construct a truth table for $\sim p \vee q$ and compare it with $p \to q$.**

| $p$ | $q$ | $\sim p$ | $\sim p \vee q$ | $p \to q$ |
|---|---|---|---|---|
| T | T | F | T | T |
| T | F | F | F | F |
| F | T | T | T | T |
| F | F | T | T | T |

The last two columns are identical, so $\sim p \vee q$ and $p \to q$ are **logically equivalent**.
:::

## Tautologies and contradictions

- A **tautology** is true in every row, for example $p \vee \sim p$.
- A **contradiction** is false in every row, for example $p \wedge \sim p$.

:::callout{type=worked-example}
**Show that $[(p \to q) \wedge p] \to q$ is a tautology.**

| $p$ | $q$ | $p \to q$ | $(p \to q) \wedge p$ | $[(p \to q) \wedge p] \to q$ |
|---|---|---|---|---|
| T | T | T | T | T |
| T | F | F | F | T |
| F | T | T | F | T |
| F | F | T | F | T |

Every entry in the last column is T, so the statement is a tautology. This is the rule of reasoning called *modus ponens*.
:::

## Converse, inverse and contrapositive

For the conditional $p \to q$:

| Name | Form | Example: "If it rains ($p$), the match is cancelled ($q$)." |
|---|---|---|
| Converse | $q \to p$ | If the match is cancelled, it rains. |
| Inverse | $\sim p \to \sim q$ | If it does not rain, the match is not cancelled. |
| Contrapositive | $\sim q \to \sim p$ | If the match is not cancelled, it did not rain. |

A statement and its **contrapositive** are always logically equivalent. The converse and the inverse are not equivalent to the original.

:::callout{type=common-mistake}
Assuming that the converse is true is a classic error. "If a number is divisible by 4, it is even" is true, but its converse, "if a number is even, it is divisible by 4", is false: 6 is even but not divisible by 4.
:::

## Valid arguments

An argument is **valid** if the conclusion must be true whenever all the premises are true.

| Rule | Form | Valid? |
|---|---|---|
| Modus ponens | $p \to q$; $p$; therefore $q$ | Valid |
| Modus tollens | $p \to q$; $\sim q$; therefore $\sim p$ | Valid |
| Chain rule (syllogism) | $p \to q$; $q \to r$; therefore $p \to r$ | Valid |
| Affirming the consequent | $p \to q$; $q$; therefore $p$ | **Not valid** |
| Denying the antecedent | $p \to q$; $\sim p$; therefore $\sim q$ | **Not valid** |

:::callout{type=local-example}
"If a student passes WASSCE Mathematics with a credit, the student can apply to Fourah Bay College for engineering. Aminata cannot apply for engineering. Therefore Aminata did not get a credit in Mathematics." This uses **modus tollens**, so it is valid (given the premises). But "Aminata can apply for engineering, so she got a credit in Mathematics" would be **affirming the consequent**: invalid, since the premise does not say a credit is the only route.
:::

## Key points

- $\wedge$ true only if both true; $\vee$ false only if both false; $\to$ false only for **T → F**.
- $n$ statements need $2^n$ rows.
- **Tautology:** always true. **Contradiction:** always false.
- **Contrapositive** $\sim q \to \sim p$ is equivalent to $p \to q$; the converse and inverse are not.
- Valid: **modus ponens, modus tollens, chain rule**. Invalid: **affirming the consequent, denying the antecedent**.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect to **complete truth tables**, to **identify tautologies**, to **write the converse or contrapositive** of a statement, to **translate sentences into symbols**, and to **choose the valid conclusion** from given premises. Lay out truth tables in full; partial tables lose marks.
:::

## Practice

Try each question first, then open the answer to check your working.

**1.** When is $p \to q$ false?

:::reveal{title="Show the answer"}
Only when $p$ is true and $q$ is false.
:::

**2.** How many rows does a truth table for $p$, $q$ and $r$ need?

:::reveal{title="Show the answer"}
$2^3 = 8$.
:::

**3.** Write the contrapositive of "If $x = 3$, then $x^2 = 9$."

:::reveal{title="Show the answer"}
"If $x^2 \ne 9$, then $x \ne 3$."
:::

**4.** Is $p \wedge \sim p$ a tautology or a contradiction?

:::reveal{title="Show the answer"}
A contradiction.
:::

**5.** "If Musa studies, he passes. Musa passed. So Musa studied." Is this valid?

:::reveal{title="Show the answer"}
Not valid: it affirms the consequent (he may have passed for another reason).
:::

