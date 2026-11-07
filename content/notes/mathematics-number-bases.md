# Number bases: place value and conversion between bases

## Learning objectives
You should be able to explain place value in a base; convert numbers between base ten and another base; convert between non-decimal bases through base ten; and perform simple arithmetic in a given base.

## Meaning of a number base
A number base tells how many different digits are used before a place-value column rolls over. Base ten uses the digits 0–9. Base two uses 0 and 1. Base five uses 0–4. In base (b), each position represents a power of (b), starting with (b^0) at the right.

For example:

( 352_6 = 3(6^2) + 5(6^1) + 2(6^0) )

(=108+30+2=140_{10}).

A digit must be smaller than the base. Thus ( 428_5 ) is invalid because base five does not contain the digit 8.

## Converting base ten to another base
To convert a positive whole number from base ten to base (b), divide repeatedly by (b), recording each remainder. Read the remainders from bottom to top.

Example: convert ( 29_{10} ) to base two.

29 ÷ 2 = 14 remainder 1  
14 ÷ 2 = 7 remainder 0  
7 ÷ 2 = 3 remainder 1  
3 ÷ 2 = 1 remainder 1  
1 ÷ 2 = 0 remainder 1

Therefore (29_{10}=11101_2). Check by expanding: (16+8+4+0+1=29).

## Converting between non-decimal bases
A reliable method is to convert the first number to base ten and then convert the result to the target base. For example, ( 1011_2=8+0+2+1=11_{10}). Since (11_{10}=23_4), it follows that (1011_2=23_4).

For fractional values, the positions to the right of the point represent negative powers: in base two, the first fractional place is (2^{-1}), or one half. Follow the method required by the question and check the result by place-value expansion.

## Arithmetic in a base
Addition and subtraction follow place value, but carrying occurs when a column reaches the base. In base five, (3_5+4_5=12_5): four plus three is seven in decimal, which is one group of five and two left over. In base two, (1+1=10_2), because two in decimal is written as 10 in binary.

## WASSCE examination focus
Always write the base as a subscript. Show repeated-division remainders in the correct order and verify conversions by expanding place values. Check that every digit is allowed in the stated base before starting. Common errors include reading remainders from top to bottom and carrying as if every question were base ten.

## Check your understanding
1. Convert ( 234_5 ) to base ten.
2. Convert ( 19_{10} ) to base two.
3. Convert ( 1101_2 ) to base ten.
4. Is ( 507_8 ) a valid octal number? Explain.
5. Calculate ( 3_5+4_5 ).

## Answers for self-assessment
1. (2(25)+3(5)+4=69_{10}).
2. (10011_2).
3. (13_{10}).
4. No. Octal digits range from 0 to 7, so 5, 0 and 7 are allowed; therefore it is valid. 
5. (12_5).