**Probability** measures how likely something is to happen, on a scale from 0 (impossible) to 1 (certain). Will it rain tomorrow? What are the chances of drawing a red ball from a bag? How likely is a seed to germinate? WASSCE sets probability every year: simple probability, sample spaces with dice and coins, combined events with "and" and "or", and tree diagrams for two-stage experiments, with and without replacement. This lesson builds each idea step by step, with the reasoning behind the rules.

## Learning objectives

By the end of this lesson you should be able to:

- find the probability of an event from equally likely outcomes
- use the probability of an event not happening
- list outcomes in a sample space
- use the addition rule (mutually exclusive events) and the multiplication rule (independent events)
- draw and use tree diagrams, with and without replacement

## The probability scale

:::callout{type=definition}
When all outcomes are **equally likely**:

$$P(\text{event}) = \frac{\text{number of favourable outcomes}}{\text{total number of possible outcomes}}$$

- $P = 0$: impossible. $P = 1$: certain. Every probability is **between 0 and 1**.
- **Complement:** $P(\text{not } A) = 1 - P(A)$.
:::

:::callout{type=worked-example}
**A bag contains 5 red, 3 blue and 2 green balls. One is picked at random. Find (a) $P(\text{red})$, (b) $P(\text{not blue})$, (c) $P(\text{yellow})$.**

Total $= 10$.

**(a)** $P(\text{red}) = \dfrac{5}{10} = \dfrac12$

**(b)** $P(\text{not blue}) = 1 - \dfrac{3}{10} = \dfrac{7}{10}$

**(c)** There are no yellow balls: $P(\text{yellow}) = 0$.
:::

### Experimental probability

When outcomes are not equally likely, estimate from an experiment: **relative frequency** $= \dfrac{\text{number of times it happened}}{\text{number of trials}}$. **Expected frequency** $= P \times$ number of trials.

:::callout{type=worked-example}
**Of 200 groundnut seeds planted in a trial, 170 germinated. A farmer plants 1500 seeds of the same type. How many should she expect to germinate?**

$P(\text{germinate}) \approx \dfrac{170}{200} = 0.85$. Expected $= 0.85 \times 1500 = $ **1275 seeds**.
:::

## Sample spaces

A **sample space** lists **every possible outcome**. For two coins: HH, HT, TH, TT (4 outcomes). For two dice, a grid is clearest.

![A six by six grid of the sums of two dice: 36 equally likely outcomes; the six cells with a sum of 7 lie on a diagonal, so P(7) = 6/36 = 1/6](https://wasscetutor.com/img/mathematics/dice-sample-space.svg)

:::callout{type=worked-example}
**Two fair dice are thrown. Find the probability that (a) the sum is 7, (b) the sum is at least 10, (c) both dice show the same number.**

There are $6 \times 6 = 36$ equally likely outcomes.

**(a)** Six cells show 7: $P = \dfrac{6}{36} = \dfrac16$.

**(b)** Sum 10: 3 cells; 11: 2; 12: 1. Total 6: $P = \dfrac{6}{36} = \dfrac16$.

**(c)** Doubles (1,1), (2,2), …, (6,6): $P = \dfrac{6}{36} = \dfrac16$.
:::

:::callout{type=common-mistake}
**Counting (3, 4) and (4, 3) as one outcome.** With two dice, "3 on the first and 4 on the second" and "4 on the first and 3 on the second" are **different** outcomes. That is why there are 36 outcomes, not 21.
:::

## Combined events

### "Or": the addition rule

:::callout{type=definition}
Events are **mutually exclusive** if they **cannot happen together** (a ball cannot be both red and blue). Then:

$$P(A \text{ or } B) = P(A) + P(B)$$
:::

### "And": the multiplication rule

:::callout{type=definition}
Events are **independent** if one does **not affect** the other (a coin toss and a die roll). Then:

$$P(A \text{ and } B) = P(A) \times P(B)$$
:::

:::callout{type=worked-example}
**A coin is tossed and a die is rolled. Find $P(\text{head and a 6})$.**

$$P = \frac12 \times \frac16 = \frac{1}{12}$$
:::

:::callout{type=worked-example}
**The probability that Fatu passes Mathematics is $0.8$ and that she passes English is $0.7$, independently. Find the probability that she passes (a) both, (b) neither, (c) exactly one.**

**(a)** $0.8 \times 0.7 = 0.56$

**(b)** $0.2 \times 0.3 = 0.06$

**(c)** Maths only or English only: $0.8 \times 0.3 + 0.2 \times 0.7 = 0.24 + 0.14 = 0.38$

**Check:** $0.56 + 0.06 + 0.38 = 1$ ✓ (these three cover every possibility).
:::

:::callout{type=tip}
**"And" → multiply; "or" → add.** For "at least one", it is usually quickest to use the complement: $P(\text{at least one}) = 1 - P(\text{none})$. In the example above, $P(\text{at least one pass}) = 1 - 0.06 = 0.94$.
:::

## Tree diagrams

A tree diagram shows a two-stage experiment. **Multiply along** each branch to get the probability of that path; **add** the paths you want.

![Tree diagram for picking two balls without replacement from a bag of 5 red and 3 blue: first pick R 5/8 or B 3/8; after R, second pick R 4/7 or B 3/7; after B, R 5/7 or B 2/7; RR 20/56, RB 15/56, BR 15/56, BB 6/56](https://wasscetutor.com/img/mathematics/probability-tree.svg)

:::callout{type=worked-example}
**A bag holds 5 red and 3 blue balls. Two are picked one after the other without replacement. Find the probability that (a) both are red, (b) they are different colours, (c) at least one is blue.**

After a red is taken, 7 balls remain, 4 of them red: the second-stage probabilities **change**.

**(a)** $P(RR) = \dfrac58 \times \dfrac47 = \dfrac{20}{56} = \dfrac{5}{14}$

**(b)** $P(RB) + P(BR) = \dfrac{15}{56} + \dfrac{15}{56} = \dfrac{30}{56} = \dfrac{15}{28}$

**(c)** $1 - P(RR) = 1 - \dfrac{5}{14} = \dfrac{9}{14}$

**Check:** $\dfrac{20 + 15 + 15 + 6}{56} = 1$ ✓
:::

:::callout{type=common-mistake}
**Ignoring "without replacement".** If the first ball is not put back, the total on the second pick is one less, and so is the number of the colour already taken. With replacement, the second-stage probabilities stay the same as the first.
:::

:::callout{type=local-example}
**Rain and the football match.** In the rainy season in Freetown, the probability of rain on a given afternoon is $0.7$. If it rains, the probability that the school match is cancelled is $0.6$; if not, it is $0.1$. A tree diagram gives:

$$P(\text{cancelled}) = 0.7 \times 0.6 + 0.3 \times 0.1 = 0.42 + 0.03 = 0.45$$

Nearly a one-in-two chance: worth having an indoor plan.
:::

## Practice

:::reveal{title="1. A letter is chosen at random from the word FREETOWN. Find the probability that it is E."}
8 letters, 2 of them E: $\dfrac28 = \dfrac14$.
:::

:::reveal{title="2. The probability that a bus is late is 0.15. What is the probability that it is not late?"}
$1 - 0.15 = 0.85$.
:::

:::reveal{title="3. Two coins are tossed. Find the probability of at least one head."}
$1 - P(TT) = 1 - \dfrac14 = \dfrac34$.
:::

:::reveal{title="4. A card is drawn from cards numbered 1 to 20. Find the probability that it is a multiple of 3 or a multiple of 5."}
Multiples of 3: 3, 6, 9, 12, 15, 18 (6). Multiples of 5: 5, 10, 15, 20 (4). But 15 is in both, so count it once: $6 + 4 - 1 = 9$. $P = \dfrac{9}{20}$.
:::

:::reveal{title="5. A box has 4 good and 2 faulty bulbs. Two are taken without replacement. Find the probability that both are faulty."}
$\dfrac26 \times \dfrac15 = \dfrac{2}{30} = \dfrac{1}{15}$.
:::

:::reveal{title="6. In the rain example, find the probability that it did not rain and the match went ahead."}
$0.3 \times 0.9 = 0.27$.
:::

## Key points

- $P = \dfrac{\text{favourable}}{\text{total}}$; $0 \le P \le 1$; $P(\text{not } A) = 1 - P(A)$.
- **Expected frequency** $= P \times$ number of trials.
- List **sample spaces** carefully: two dice give **36** outcomes.
- **Or** (mutually exclusive) → **add**; **and** (independent) → **multiply**.
- **Tree diagrams**: multiply along branches, add the paths; without replacement, the second-stage probabilities change.
- "At least one" $= 1 - P(\text{none})$.

## WASSCE examination focus

:::callout{type=waec-tests}
Probability appears in both papers every year: simple probability from bags, cards and dice; sample spaces for two dice or coins; and combined events with "and", "or", "at least one" and "without replacement", often through a tree diagram. Give probabilities as fractions in their lowest terms, or as decimals when the question uses decimals.
:::
