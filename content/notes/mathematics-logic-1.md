*Freetown is the capital of Sierra Leone.* *Five is greater than three.* *Every prime number is odd.* These are **propositions** — statements that are either definitely **true** or definitely **false**. *"What time is it?"* is not a proposition (it's a question). *"Close the door."* is not a proposition (it's a command). *"This sentence is false"* is not a proposition (it's a paradox).

Logical reasoning starts with propositions and the **connectives** that combine them: AND, OR, NOT, IF...THEN, IF AND ONLY IF. With these tools, you can analyse the structure of arguments and detect when reasoning is valid. WAEC tests propositional logic in the objective section, usually with $1$-$2$ questions per paper.

This lesson defines propositions, introduces the connectives, and shows how to combine and analyse simple statements.

:::callout{type=definition}
**Proposition (or statement):** A sentence that is either definitely **true** or definitely **false**, but not both.

- *"The Earth is round."* — proposition (true).
- *"$2 + 2 = 5$."* — proposition (false).
- *"What is your name?"* — NOT a proposition (question).
- *"Close the window."* — NOT a proposition (command).
- *"$x + 1 = 5$."* — NOT a proposition (depends on $x$; it's a *predicate*).
:::


## Learning objectives

By the end of this lesson you should be able to:

- identify propositions (statements)
- use the connectives not, and, or, if-then and if-and-only-if
- translate between English sentences and logical symbols
- form compound statements

## Notation

Propositions are usually denoted by lowercase letters: $p$, $q$, $r$, etc.

- $p$: "It is raining."
- $q$: "The sky is blue."
- $r$: "$3 + 5 = 8$."

Each proposition has a **truth value**: T (true) or F (false). Sometimes 1 and 0.

## The five basic connectives

Connectives combine propositions to form **compound propositions**.

### 1. Negation (NOT) — $\neg p$ or $\sim p$

*Reverses the truth value.* If $p$ is true, $\neg p$ is false. If $p$ is false, $\neg p$ is true.

- $p$: "It is raining."
- $\neg p$: "It is NOT raining."

### 2. Conjunction (AND) — $p \wedge q$

*True when BOTH $p$ and $q$ are true.* False otherwise.

- $p$: "It is raining."
- $q$: "It is cold."
- $p \wedge q$: "It is raining AND it is cold."

This is true only when both rain and cold are true.

### 3. Disjunction (OR) — $p \vee q$

*True when at LEAST ONE of $p, q$ is true.* False only when both are false.

- $p \vee q$: "It is raining OR it is cold."

True if it's raining, or cold, or both.

This is **inclusive or** — different from everyday "or" which can sometimes mean *one but not both*.

### 4. Conditional (IF...THEN) — $p \to q$

*"If $p$, then $q$."* The proposition $p$ is the **hypothesis** (or antecedent), $q$ is the **conclusion** (or consequent).

- $p \to q$: "If it is raining, then I will take an umbrella."

This statement is FALSE only when $p$ is true and $q$ is false (the only case where you've broken your promise). True in all other cases.

### 5. Biconditional (IF AND ONLY IF) — $p \leftrightarrow q$

*True when $p$ and $q$ have the same truth value.* False otherwise.

- $p \leftrightarrow q$: "It is raining if and only if the streets are wet."

True when both are true OR both are false.

## Truth table summary

| $p$ | $q$ | $\neg p$ | $p \wedge q$ | $p \vee q$ | $p \to q$ | $p \leftrightarrow q$ |
|---|---|---|---|---|---|---|
| T | T | F | T | T | T | T |
| T | F | F | F | T | F | F |
| F | T | T | F | T | T | F |
| F | F | T | F | F | T | T |

This is the master table. Memorise it.

## Translating English to logic notation

Converting between English and logic notation is the key skill.

### Examples

- *"It is raining and cold."* → $p \wedge q$ (where $p$ = rain, $q$ = cold).
- *"Either it is raining or it is cold (or both)."* → $p \vee q$.
- *"It is not raining."* → $\neg p$.
- *"If it is raining, then the ground is wet."* → $p \to q$ (where $q$ = ground wet).
- *"It is raining if and only if the ground is wet."* → $p \leftrightarrow q$.
- *"It is not raining and not cold."* → $\neg p \wedge \neg q$.
- *"It is raining but not cold."* → $p \wedge \neg q$. (The word "but" is the same as "and" logically.)
- *"It is raining or cold, but not both."* → $(p \vee q) \wedge \neg(p \wedge q)$ — this is exclusive or, different from the basic $\vee$.

### Special phrases

- *"Necessary"* ($p$ is necessary for $q$): $q \to p$.
- *"Sufficient"* ($p$ is sufficient for $q$): $p \to q$.
- *"Only if"* ($p$ only if $q$): $p \to q$.
- *"Unless"* ($p$ unless $q$): $\neg q \to p$.

:::callout{type=worked-example}
**Translate each English statement into logical notation. Let $p$ = "It is raining," $q$ = "It is cold," $r$ = "I take an umbrella."**

**(a)** "It is raining and cold." → $p \wedge q$.

**(b)** "It is not raining." → $\neg p$.

**(c)** "If it is raining, then I take an umbrella." → $p \to r$.

**(d)** "It is raining or it is cold." → $p \vee q$.

**(e)** "It is not raining and not cold." → $\neg p \wedge \neg q$.

**(f)** "I do not take an umbrella unless it is raining." → $\neg p \to \neg r$, or equivalently $r \to p$.

**(g)** "It is raining and cold, but I don't take an umbrella." → $(p \wedge q) \wedge \neg r$.

**(h)** "If it is not raining, then I do not take an umbrella." → $\neg p \to \neg r$.
:::

## Translating logic back to English

Given a logical expression, write a clear English equivalent.

### Examples

Let $p$ = "He is hungry," $q$ = "He is thirsty."

- $p \wedge q$: "He is hungry and thirsty."
- $p \vee q$: "He is hungry or thirsty (or both)."
- $\neg p$: "He is not hungry."
- $p \to q$: "If he is hungry, then he is thirsty."
- $\neg p \wedge \neg q$: "He is neither hungry nor thirsty."
- $\neg(p \wedge q)$: "It is not the case that he is hungry and thirsty" — equivalently, "He is not hungry, or not thirsty (by De Morgan)."

## Connectives are like set operations

The logical connectives correspond directly to set operations:

| Logic | Set theory |
|---|---|
| $p \wedge q$ | $A \cap B$ |
| $p \vee q$ | $A \cup B$ |
| $\neg p$ | $A'$ |

The **De Morgan's laws** also carry over:
- $\neg(p \wedge q) = \neg p \vee \neg q$ (not both = at least one not)
- $\neg(p \vee q) = \neg p \wedge \neg q$ (not either = both not)

## Compound statements

Combining multiple connectives gives more complex statements. Use parentheses to clarify order.

### Examples

- $(p \wedge q) \to r$: "If $p$ and $q$, then $r$."
- $p \wedge (q \to r)$: "$p$ and (if $q$, then $r$)." (Order matters.)
- $\neg(p \vee q)$: "NOT($p$ or $q$)" = "Neither $p$ nor $q$."
- $\neg p \vee \neg q$: "$\neg p$ or $\neg q$" = "At least one is false."

From De Morgan's: $\neg(p \vee q) = \neg p \wedge \neg q$. So the second and third are different.

## Sierra Leonean examples

- *"If a student passes Math, then they pass the WAEC exam."* — Conditional ($p \to q$).
- *"A student passes both Math and English, but not Chemistry."* — Conjunction with negation ($p \wedge q \wedge \neg r$).
- *"To pass WAEC, you must pass at least Math or English."* — Conditional with disjunction. *"To pass WAEC"* = *"You pass WAEC"*, the hypothesis is "you pass at least one". So: $(p \vee q) \to r$ where $r$ = pass WAEC. Or expressed differently: $r \to (p \vee q)$ (passing WAEC requires passing at least one — meaning if you pass WAEC, you passed at least one).

:::callout{type=local-example}
A Sierra Leonean school sets pass criteria: 
*"A student passes the year if they pass Math AND (English OR Chemistry)."*

Let $p$ = pass Math, $q$ = pass English, $r$ = pass Chemistry, $s$ = pass the year.

In logic: $s \leftrightarrow (p \wedge (q \vee r))$.

This means the year-pass is true if and only if Math is passed AND at least one of English or Chemistry is passed.

The school's criteria are now in formal notation. Truth tables (next lesson) let us check every combination of student outcomes.
:::

:::callout{type=common-mistake}
**Common errors with propositions:**

**1. Treating questions as propositions.**
- "Is it raining?" is not a proposition. "It is raining" is.

**2. Treating commands as propositions.**
- "Close the window." — not T or F.

**3. Confusing "or" inclusive vs exclusive.**
- In logic, "or" ($\vee$) is inclusive (one, the other, or both).
- In everyday speech, sometimes "or" is exclusive (one or the other but not both).

**4. Misreading conditional.**
- $p \to q$ is FALSE only when $p$ is true and $q$ is false. True in all other cases (including when $p$ is false — "vacuous truth").

**5. Confusing $p \to q$ with $q \to p$.**
- *"If $p$, then $q$"* ($p \to q$) is NOT the same as *"If $q$, then $p$"* ($q \to p$).

**6. Misreading negation parentheses.**
- $\neg p \wedge q$ means $(\neg p) \wedge q$, not $\neg(p \wedge q)$.
:::

## Key terms

:::callout{type=definition title="Key terms"}
- **Negation**: "not $p$" ($\sim p$): true when $p$ is false, and false when $p$ is true.
- **Conjunction**: "$p$ and $q$" ($p \wedge q$): true only when both are true.
- **Disjunction**: "$p$ or $q$" ($p \vee q$): true when at least one is true.
- **Compound statement**: a statement made by joining simple statements with connectives such as and, or, not and if…then.
:::

## WASSCE examination focus

:::callout{type=waec-tests}
WAEC proposition questions:

- **Identify propositions.** *Which of the following is a proposition?* (test of definition)
- **Translate English to logic.** *Translate "It is raining and the sky is dark" into symbols.*
- **Translate logic to English.** *Express $p \wedge \neg q$ in English.*
- **Identify negation, conjunction, disjunction.**
- **Identify simple compound statements.**

Familiarity with notation is the key. After this lesson, truth tables (next lesson) handle the analysis.
:::

## Practice problems

Try each question first, then open the answer to check your working.

**1.** Which of the following are propositions?
(a) The sky is blue.
(b) What time is it?
(c) $7 \times 8 = 56$.
(d) Please close the door.
(e) $x + 5 > 10$.

:::reveal{title="Show the answer"}
(a) Proposition. (b) Question — not a proposition. (c) Proposition. (d) Command — not a proposition. (e) Predicate — depends on $x$. Not a proposition.
:::

**2.** Let $p$ = "It is raining," $q$ = "It is cold." Translate each into logical notation.
(a) It is not raining.
(b) It is raining and cold.
(c) Either it is raining or it is cold.
(d) It is raining but not cold.
(e) It is neither raining nor cold.

:::reveal{title="Show the answer"}
(a) $\neg p$. (b) $p \wedge q$. (c) $p \vee q$. (d) $p \wedge \neg q$. (e) $\neg p \wedge \neg q$.
:::

**3.** Translate each logical statement into English (using $p, q$ from above):
(a) $\neg p$
(b) $p \wedge q$
(c) $p \vee q$
(d) $\neg(p \wedge q)$
(e) $p \to q$

:::reveal{title="Show the answer"}
(a) "It is not raining." (b) "It is raining and cold." (c) "It is raining or it is cold." (d) "It is not the case that it is raining and cold." / "It is not raining, or it is not cold." (e) "If it is raining, then it is cold."
:::

**4.** Let $p$ = "Tomorrow is Friday," $q$ = "It is a school day." Translate: "If tomorrow is Friday, then it is a school day."

:::reveal{title="Show the answer"}
$p \to q$.
:::

**5.** What is the truth value of $p \vee \neg p$? (Hint: always true regardless of $p$.)

:::reveal{title="Show the answer"}
Always TRUE. (This is a tautology.)
:::

**6.** What is the truth value of $p \wedge \neg p$? (Hint: always false.)

:::reveal{title="Show the answer"}
Always FALSE. (This is a contradiction.)
:::

## What's next

In the next lesson we cover **truth tables** — the systematic tool for evaluating compound logical statements. With truth tables you can determine when a statement is true, when it's a tautology (always true), and when it's a contradiction (always false).
