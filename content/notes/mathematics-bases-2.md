Adding in base five works exactly like adding in base ten, except that you "carry" every time you reach **five** instead of ten. Once you see that, addition, subtraction and multiplication in any base become routine. This lesson covers the three operations and the WASSCE favourite: finding an **unknown base**.

## Learning objectives

By the end of this lesson you should be able to:

- add and subtract numbers in a given base, carrying and borrowing in that base
- multiply numbers in a given base
- check answers by converting to base ten
- find an unknown base from an equation

## Addition

Add column by column from the right. When a column total reaches the base, write the remainder and **carry 1 for each full base**.

:::callout{type=worked-example}
**Add $432_5 + 344_5$.**

| Column | Working | Write | Carry |
|---|---|---|---|
| units | $2 + 4 = 6 = 1 \times 5 + 1$ | 1 | 1 |
| fives | $3 + 4 + 1 = 8 = 1 \times 5 + 3$ | 3 | 1 |
| twenty-fives | $4 + 3 + 1 = 8 = 1 \times 5 + 3$ | 3 | 1 |
| next | $1$ | 1 | |

$$432_5 + 344_5 = 1331_5$$

**Check in base ten:** $432_5 = 117$, $344_5 = 99$, and $117 + 99 = 216 = 1331_5$ ($125 + 75 + 15 + 1$). ✓
:::

:::callout{type=worked-example}
**Add $1011_2 + 111_2$.**

In base two, $1 + 1 = 10_2$ (write 0, carry 1) and $1 + 1 + 1 = 11_2$ (write 1, carry 1).

$$1011_2 + 111_2 = 10010_2$$

**Check:** $11 + 7 = 18 = 16 + 2 = 10010_2$. ✓
:::

## Subtraction

Subtract column by column. When the top digit is too small, **borrow one from the next column, which is worth the base** (not ten).

:::callout{type=worked-example}
**Subtract $413_5 - 234_5$.**

- **Units:** $3 - 4$ is not possible. Borrow from the fives column: $3 + 5 = 8$, and $8 - 4 = 4$.
- **Fives:** the 1 became 0. $0 - 3$ is not possible. Borrow: $0 + 5 = 5$, and $5 - 3 = 2$.
- **Twenty-fives:** the 4 became 3. $3 - 2 = 1$.

$$413_5 - 234_5 = 124_5$$

**Check:** $108 - 69 = 39 = 25 + 10 + 4 = 124_5$. ✓
:::

:::callout{type=common-mistake}
When you borrow in base five, the borrowed amount is **5**, not 10. Writing $3 + 10 = 13$ in the units column above is the most common error in base subtraction.
:::

## Multiplication

The safest method is to **convert to base ten, multiply, then convert back**. For short numbers you can also multiply directly, carrying in the base.

:::callout{type=worked-example}
**Find $23_4 \times 3_4$.**

$23_4 = 2 \times 4 + 3 = 11$, and $3_4 = 3$. So the product is $33$.

$33 \div 4 = 8$ r $1$; $8 \div 4 = 2$ r $0$; $2 \div 4 = 0$ r $2$. So $23_4 \times 3_4 = 201_4$.
:::

:::callout{type=worked-example}
**Find $12_3 \times 21_3$.**

$12_3 = 5$ and $21_3 = 7$, so the product is $35$.

$35 \div 3 = 11$ r $2$; $11 \div 3 = 3$ r $2$; $3 \div 3 = 1$ r $0$; $1 \div 3 = 0$ r $1$.

So $12_3 \times 21_3 = 1022_3$. **Check:** $27 + 0 + 6 + 2 = 35$. ✓
:::

## Finding an unknown base

Write the number in expanded form using the unknown base, set it equal to the base-ten value, and solve.

:::callout{type=worked-example}
**If $34_b = 22$, find $b$.**

$$3b + 4 = 22 \quad\Rightarrow\quad 3b = 18 \quad\Rightarrow\quad b = 6$$

The digits 3 and 4 are less than 6, so the answer is acceptable.
:::

:::callout{type=worked-example}
**If $121_x = 49$, find $x$.**

$$x^2 + 2x + 1 = 49 \quad\Rightarrow\quad (x + 1)^2 = 49 \quad\Rightarrow\quad x + 1 = 7 \quad\Rightarrow\quad x = 6$$

(The negative root $x + 1 = -7$ is rejected: a base must be a positive whole number greater than every digit.)
:::

:::callout{type=worked-example}
**Find $n$ if $25_n + 13_n = 41_n$.**

$$(2n + 5) + (n + 3) = 4n + 1$$

$$3n + 8 = 4n + 1 \quad\Rightarrow\quad n = 7$$

**Check in base seven:** $5 + 3 = 8 = 1 \times 7 + 1$, write 1 carry 1; $2 + 1 + 1 = 4$. So $25_7 + 13_7 = 41_7$. ✓
:::

:::callout{type=local-example}
A Bo market trader who packs groundnuts in bags of 5, crates of 5 bags and boxes of 5 crates is counting in **base five**. Two boxes, one crate, four bags and three loose cups is $2143_5 = 298$ cups.
:::

## Key points

- **Add:** carry 1 every time a column reaches the base.
- **Subtract:** when borrowing, add the **base** (not 10) to the column.
- **Multiply:** convert to base ten, multiply, convert back; check by reconverting.
- **Unknown base:** expand, equate to the base-ten value, solve, and reject any base that is not greater than every digit.

## WASSCE examination focus

:::callout{type=waec-tests}
Expect **addition and subtraction in bases 2, 5 and 8**, **multiplication in small bases**, and **"find the base"** equations, often giving a quadratic in the base. State the reason for rejecting negative or too-small values of the base.
:::

## Quick check

1. Add $1101_2 + 1011_2$.
2. Subtract $302_5 - 143_5$.
3. Find $14_5 \times 3_5$, giving your answer in base five.
4. Find $b$ if $52_b = 37$.
5. Find $x$ if $144_x = 64$.

**Answers:**

1. $13 + 11 = 24 = 11000_2$.
2. $77 - 48 = 29 = 104_5$ (check: $25 + 0 + 4 = 29$).
3. $9 \times 3 = 27 = 102_5$ (check: $25 + 2 = 27$).
4. $5b + 2 = 37$, so $b = 7$.
5. $x^2 + 4x + 4 = 64$, so $(x + 2)^2 = 64$, $x + 2 = 8$ and $x = 6$.
