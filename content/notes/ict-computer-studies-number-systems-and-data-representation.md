:::callout{type=definition}
A **number system** is a way of writing numbers using a set of digits and a **base** (also called the **radix**): the number of different digits it uses. Computers store everything, numbers, letters, pictures and sound, as **binary** (base 2) numbers.
:::

Inside a computer every switch is either **on** or **off**, so a computer stores everything with just two digits, **1** and **0**. This lesson explains the **binary**, **octal** and **hexadecimal** number systems, shows step by step how to **convert between decimal and binary** and the other bases, how to add and subtract binary numbers, the units used to measure data, and how letters are stored using codes such as **ASCII** and **Unicode**.

## Learning objectives

By the end of this lesson you should be able to:

- state the base and the digits of the decimal, binary, octal and hexadecimal number systems
- convert numbers from decimal to binary, octal and hexadecimal, and back
- convert between binary, octal and hexadecimal by grouping bits
- add and subtract binary numbers
- state the units of data from bit to terabyte
- explain how characters are represented with ASCII, Unicode and BCD

## The four number systems

| Number system | Base | Digits used | Example |
|---|---|---|---|
| **Decimal** | 10 | 0 1 2 3 4 5 6 7 8 9 | $157_{10}$ |
| **Binary** | 2 | 0 1 | $10011101_2$ |
| **Octal** | 8 | 0 1 2 3 4 5 6 7 | $235_8$ |
| **Hexadecimal** | 16 | 0–9 and A B C D E F (A = 10 … F = 15) | $9D_{16}$ |

All four examples in the table are the **same number**, written in different bases. The small number written below and after a number (the subscript) shows its base.

:::callout{type=definition}
**Decimal (denary) number system:** the base-10 number system used in everyday life, with the ten digits 0 to 9.

**Binary number system:** the base-2 number system, which uses only the digits 0 and 1; each digit is a bit.

**Octal number system:** the base-8 number system, which uses the digits 0 to 7.

**Hexadecimal number system:** the base-16 number system, which uses the digits 0 to 9 and the letters A to F for the values 10 to 15.
:::

**Why computers use binary:** an electronic circuit can be in two states (on or off, high or low voltage) far more reliably than in ten. Two states match the two binary digits exactly.

## Place value

:::callout{type=definition}
**Place value:** the value a digit has because of its position in a number; in any base, each place is worth the base times the place to its right, so in binary each place is worth twice the one before.
:::

- Decimal: $352 = 3 \times 100 + 5 \times 10 + 2 \times 1$
- Binary place values, from the right: 1, 2, 4, 8, 16, 32, 64, 128 (each doubles)
- Octal place values: 1, 8, 64, 512
- Hexadecimal place values: 1, 16, 256, 4096

## Converting decimal to binary: repeated division by 2

Divide by 2 again and again, writing down each **remainder**, until the number is 0. Then **read the remainders from the bottom up**.

![Converting 25 to binary by repeated division by 2: 25 divided by 2 is 12 remainder 1; 12 by 2 is 6 remainder 0; 6 by 2 is 3 remainder 0; 3 by 2 is 1 remainder 1; 1 by 2 is 0 remainder 1. Reading the remainders upwards gives 25 in decimal as 11001 in binary](https://wasscetutor.com/img/ict/decimal-to-binary.svg)

*Figure 1. Converting 25 to binary by repeated division by 2. WASSCE Tutor diagram.*

:::callout{type=worked-example}
**Convert 25 to binary.** $25 \div 2 = 12$ r 1, $12 \div 2 = 6$ r 0, $6 \div 2 = 3$ r 0, $3 \div 2 = 1$ r 1, $1 \div 2 = 0$ r 1. Reading upwards: $25_{10} = 11001_2$.

Check: $16 + 8 + 1 = 25$.
:::

## Converting binary to decimal: add the place values

Write the place values above the bits and **add the place values where the bit is 1**.

![Converting the binary number 10011101 to decimal: the place values 128, 64, 32, 16, 8, 4, 2 and 1 sit above the bits 1, 0, 0, 1, 1, 1, 0, 1; adding the values where the bit is 1 gives 128 + 16 + 8 + 4 + 1 = 157](https://wasscetutor.com/img/ict/binary-place-values.svg)

*Figure 2. Adding the place values of the 1 bits turns 10011101 into 157. WASSCE Tutor diagram.*

:::callout{type=worked-example}
**Convert $10011101_2$ to decimal.** The 1s are in the places worth 128, 16, 8, 4 and 1, so $128 + 16 + 8 + 4 + 1 = 157$. So $10011101_2 = 157_{10}$.

A shorter one: $1011_2 = 8 + 2 + 1 = 11_{10}$.
:::

## Decimal to octal and hexadecimal, and back

Use repeated division again, by **8** for octal or by **16** for hexadecimal. In hexadecimal, a remainder from 10 to 15 is written as a letter from A to F.

:::callout{type=worked-example}
**Convert 157 to octal.** $157 \div 8 = 19$ r 5, $19 \div 8 = 2$ r 3, $2 \div 8 = 0$ r 2. Reading upwards: $157_{10} = 235_8$.

**Convert 157 to hexadecimal.** $157 \div 16 = 9$ r 13, $9 \div 16 = 0$ r 9. The remainder 13 is D, so reading upwards: $157_{10} = 9D_{16}$.

**And back to decimal:** $235_8 = 2 \times 64 + 3 \times 8 + 5 = 157$, and $9D_{16} = 9 \times 16 + 13 = 157$.
:::

## Binary to octal and hexadecimal by grouping

Because $8 = 2^3$ and $16 = 2^4$, you can convert straight from binary:

- **Octal:** split the bits into groups of **3** from the right and write each group as one digit.
- **Hexadecimal:** split the bits into groups of **4** from the right and write each group as one digit.

![Grouping binary digits: for octal, 10011101 is split into 10, 011 and 101, giving 2, 3 and 5, so it is 235 in octal; for hexadecimal it is split into 1001 and 1101, giving 9 and 13, and 13 is D, so it is 9D in hexadecimal](https://wasscetutor.com/img/ict/binary-octal-hex.svg)

*Figure 3. Grouping bits in threes gives octal; grouping in fours gives hexadecimal. WASSCE Tutor diagram.*

To go the other way, write each octal digit as 3 bits or each hexadecimal digit as 4 bits: $A7_{16} = 1010\ 0111_2$, because A = 1010 and 7 = 0111.

## Binary addition and subtraction

**Rules of binary addition:** $0 + 0 = 0$, $0 + 1 = 1$, $1 + 0 = 1$, $1 + 1 = 10$ (write 0, carry 1), $1 + 1 + 1 = 11$ (write 1, carry 1).

:::callout{type=worked-example}
**Add $1011_2 + 0110_2$.** From the right: $1 + 0 = 1$; $1 + 1 = 10$, write 0 carry 1; $0 + 1 + 1 = 10$, write 0 carry 1; $1 + 0 + 1 = 10$, write 0 carry 1; the last carry gives 1. Answer: $10001_2$.

Check in decimal: $11 + 6 = 17$, and $10001_2 = 16 + 1 = 17$.
:::

**Rules of binary subtraction:** $0 - 0 = 0$, $1 - 0 = 1$, $1 - 1 = 0$, $0 - 1 = 1$ after borrowing 1 from the next place (because $10_2 - 1 = 1$).

:::callout{type=worked-example}
**Subtract $1101_2 - 0110_2$.** From the right: $1 - 0 = 1$; $0 - 1$: borrow, $10 - 1 = 1$; the next 1 is now 0, so $0 - 1$: borrow again, $10 - 1 = 1$; the next 1 is now 0, so $0 - 0 = 0$. Answer: $0111_2 = 111_2$.

Check: $13 - 6 = 7$, and $111_2 = 4 + 2 + 1 = 7$.
:::

## Units of data

:::callout{type=definition}
**Nibble:** a group of 4 bits, half a byte; one hexadecimal digit.
:::

| Unit | Equal to |
|---|---|
| 1 **bit** | a single 0 or 1 |
| 1 **nibble** | 4 bits |
| 1 **byte** | 8 bits (one character) |
| 1 **kilobyte (KB)** | 1024 bytes |
| 1 **megabyte (MB)** | 1024 KB |
| 1 **gigabyte (GB)** | 1024 MB |
| 1 **terabyte (TB)** | 1024 GB |

:::callout{type=tip}
**1024 or 1000?** In computing, 1 KB is $2^{10} = 1024$ bytes, and this is the value used in WASSCE answers. Makers of hard disks and flash drives often count 1 KB as 1000 bytes, which is why a "64 GB" flash drive shows a little less space on a computer.
:::

## Representing characters: ASCII, Unicode and BCD

Every letter, digit and symbol is stored as a binary **code**.

:::callout{type=definition}
**ASCII:** the American Standard Code for Information Interchange, a 7-bit code that gives each of 128 characters a number; capital A is 65 ($1000001_2$).

**Unicode:** a character code that covers the letters and symbols of almost every language in the world, as well as emoji; UTF-8 is the form used on most web pages.

**Binary coded decimal (BCD):** a code in which each decimal digit is written separately as a 4-bit binary number; 25 is 0010 0101.

**EBCDIC:** the Extended Binary Coded Decimal Interchange Code, an 8-bit character code used mainly on IBM mainframe computers.
:::

- In **ASCII**, A = 65, B = 66 and so on; a = 97; the digit 0 = 48. An **extended ASCII** uses 8 bits for 256 characters.
- **Unicode** is needed for scripts such as Arabic and Chinese, and for symbols ASCII does not have.

:::callout{type=common-mistake}
**Reading the remainders downwards.** In repeated division, the **first** remainder is the **last** (rightmost) digit. Reading 25's remainders from the top gives 10011, which is 19, not 25. Always read **upwards**, then check by adding the place values.
:::

## Practice

:::reveal{title="1. Convert 45 to binary."}
$45 \div 2 = 22$ r 1, $22 \div 2 = 11$ r 0, $11 \div 2 = 5$ r 1, $5 \div 2 = 2$ r 1, $2 \div 2 = 1$ r 0, $1 \div 2 = 0$ r 1. Reading upwards: $101101_2$. Check: $32 + 8 + 4 + 1 = 45$.
:::

:::reveal{title="2. Convert 110110₂ to decimal."}
$32 + 16 + 4 + 2 = 54$.
:::

:::reveal{title="3. Convert 2F₁₆ to decimal."}
F = 15, so $2 \times 16 + 15 = 47$.
:::

:::reveal{title="4. Add 1110₂ and 0111₂."}
From the right: $0 + 1 = 1$; $1 + 1 = 10$, write 0 carry 1; $1 + 1 + 1 = 11$, write 1 carry 1; $1 + 0 + 1 = 10$, write 0 carry 1; carry 1. Answer: $10101_2$. Check: $14 + 7 = 21 = 16 + 4 + 1$.
:::

:::reveal{title="5. How many bits are there in 2 kilobytes?"}
$2 \times 1024 \times 8 = 16\,384$ bits.
:::

## Key points

- **Decimal** base 10; **binary** base 2 (0, 1); **octal** base 8 (0–7); **hexadecimal** base 16 (0–9, A–F).
- **Decimal → another base**: divide repeatedly by the base and read the remainders **upwards**.
- **Another base → decimal**: multiply each digit by its place value and add.
- **Binary → octal / hex**: group bits in **3s / 4s** from the right.
- Binary addition: $1 + 1 = 10$; $1 + 1 + 1 = 11$.
- 8 bits = 1 byte; 1 KB = 1024 bytes; 1 MB = 1024 KB; 1 GB = 1024 MB; 1 TB = 1024 GB.
- **ASCII** (A = 65), **Unicode** (all languages), **BCD** (each decimal digit as 4 bits).

## WASSCE examination focus

:::callout{type=waec-tests}
Number systems appear in almost every paper; you may need to convert numbers between decimal, binary, octal and hexadecimal, to add or subtract binary numbers, to state the base or digits of a number system, to convert between data units, and to explain ASCII or BCD. Show every division or every place value in your working; a correct answer with no working may lose marks, and a check in decimal catches most mistakes.
:::
