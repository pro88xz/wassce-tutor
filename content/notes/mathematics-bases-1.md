Every number you write uses a **base**. Everyday counting uses base ten, almost certainly because we have ten fingers. Computers use base two, because a circuit is either off (0) or on (1). WASSCE questions ask you to move numbers between bases, and the key to every one of them is **place value**.

## Learning objectives

By the end of this lesson you should be able to:

- explain place value in any base
- state which digits can be used in a given base
- convert a number from any base to base ten
- convert a number from base ten to any other base by repeated division
- convert between two non-decimal bases through base ten

## Place value

:::callout{type=definition}
In **base $b$**, each place is worth $b$ times the place to its right. The place values, from the right, are $b^0 = 1$, $b^1 = b$, $b^2$, $b^3$, and so on. The digits allowed are $0, 1, 2, \ldots, b - 1$.
:::

![Place values in base ten (1000, 100, 10, 1) and base two (16, 8, 4, 2, 1), with the binary number 10110 shown as 22](https://wasscetutor.com/img/mathematics/base-place-value.svg)

*Figure 1. Place values are powers of the base. WASSCE Tutor diagram.*

| Base | Name | Digits used | Place values (right to left) |
|---|---|---|---|
| 2 | binary | 0, 1 | 1, 2, 4, 8, 16, 32, … |
| 5 | quinary | 0 to 4 | 1, 5, 25, 125, 625, … |
| 8 | octal | 0 to 7 | 1, 8, 64, 512, … |
| 10 | decimal | 0 to 9 | 1, 10, 100, 1000, … |

The base is written as a small subscript: $2143_5$ means "2143 in base five". A number with no subscript is in base ten.

:::callout{type=common-mistake}
A digit can never equal or exceed the base. $1352_5$ is impossible, because 5 is not a digit in base five. If a question gives such a number, it is testing whether you notice.
:::

## Converting from any base to base ten

Multiply each digit by its place value and add.

:::callout{type=worked-example}
**Convert $2143_5$ to base ten.**

Place values from the right: $1, 5, 25, 125$.

$$2143_5 = 2 \times 125 + 1 \times 25 + 4 \times 5 + 3$$

$$= 250 + 25 + 20 + 3 = 298$$
:::

:::callout{type=worked-example}
**Convert $10110_2$ and $245_8$ to base ten.**

$10110_2$ has one 16, no 8, one 4, one 2 and no 1:

$$10110_2 = 16 + 4 + 2 = 22$$

$$245_8 = 2 \times 64 + 4 \times 8 + 5 \times 1 = 128 + 32 + 5 = 165$$
:::

## Converting from base ten to another base

Divide repeatedly by the new base, writing down each remainder, until the quotient is 0. The answer is the remainders **read from the bottom up**.

![Repeated division of 45 by 2 with remainders 1, 0, 1, 1, 0, 1, read upwards to give 101101 in base two](https://wasscetutor.com/img/mathematics/base-division-ladder.svg)

*Figure 2. Converting 45 to base two by repeated division. WASSCE Tutor diagram.*

:::callout{type=worked-example}
**Convert 45 to base two.**

| Division | Quotient | Remainder |
|---|---|---|
| $45 \div 2$ | 22 | 1 |
| $22 \div 2$ | 11 | 0 |
| $11 \div 2$ | 5 | 1 |
| $5 \div 2$ | 2 | 1 |
| $2 \div 2$ | 1 | 0 |
| $1 \div 2$ | 0 | 1 |

Reading upwards: $45 = 101101_2$.

**Check:** $32 + 8 + 4 + 1 = 45$. ✓
:::

:::callout{type=worked-example}
**Convert 100 to base five.**

$100 \div 5 = 20$ remainder $0$; $20 \div 5 = 4$ remainder $0$; $4 \div 5 = 0$ remainder $4$.

Reading upwards: $100 = 400_5$. **Check:** $4 \times 25 = 100$. ✓
:::

## Converting between two other bases

Go through base ten: first convert to base ten, then from base ten to the new base.

:::callout{type=worked-example}
**Convert $245_8$ to base six.**

**Step 1:** $245_8 = 165$ (from above).

**Step 2:** $165 \div 6 = 27$ r $3$; $27 \div 6 = 4$ r $3$; $4 \div 6 = 0$ r $4$.

So $245_8 = 433_6$. **Check:** $4 \times 36 + 3 \times 6 + 3 = 144 + 18 + 3 = 165$. ✓
:::

## Fractions in other bases

Places to the right of the point are worth $b^{-1}, b^{-2}, \ldots$. In base two these are $\tfrac{1}{2}, \tfrac{1}{4}, \tfrac{1}{8}, \ldots$

$$0.101_2 = \tfrac{1}{2} + 0 + \tfrac{1}{8} = 0.625$$

:::callout{type=local-example}
Mobile money, ATMs and the phones Sierra Leoneans use every day store every number, picture and message in **binary**. A phone number such as 76 is stored as $1001100_2$, because $64 + 8 + 4 = 76$.
:::

## Key points

- In base $b$, place values are powers of $b$, and digits run from $0$ to $b - 1$.
- **Any base → base ten:** multiply each digit by its place value and add.
- **Base ten → any base:** divide repeatedly and read the remainders **upwards**.
- **Between two other bases:** go through base ten.
- Always **check** by converting back.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect to **convert numbers between bases** (most often 2, 5, 8 and 10), to **spot impossible digits**, and to combine conversion with operations such as addition. Show the division ladder or the place-value working; marks are given for method.
:::

## Quick check

1. Convert $1101_2$ to base ten.
2. Convert $312_4$ to base ten.
3. Convert 58 to base two.
4. Convert 87 to base five.
5. Why can $274_7$ not be a base-seven number?

**Answers:**

1. $8 + 4 + 0 + 1 = 13$.
2. $3 \times 16 + 1 \times 4 + 2 = 54$.
3. $58 = 111010_2$ (check: $32 + 16 + 8 + 2 = 58$).
4. $87 = 322_5$ (check: $3 \times 25 + 2 \times 5 + 2 = 87$).
5. The digit 7 is not allowed in base seven; the digits are 0 to 6.
