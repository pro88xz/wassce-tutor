:::callout{type=definition}
A **variable** is a named location in a computer's memory that holds a value which can change while a program runs. Variables, **data types**, **operators**, **arrays** and **subprograms** are the basic **programming concepts** found in every programming language.
:::

Whether a program is written in Python, BASIC or Java, it is built from the same parts: it stores values in variables, works on them with operators, makes decisions, repeats steps, keeps lists in arrays and breaks big jobs into smaller subprograms. This lesson explains these **programming concepts**, the **data types** (integer, real, string, character and Boolean), **arithmetic, relational and logical operators**, how IF statements and loops look in real code, and the **types of programming errors** (syntax, logic and runtime) with how programs are tested and debugged.

## Learning objectives

By the end of this lesson you should be able to:

- define a variable, a constant and an identifier, and state rules for naming variables
- name the main data types and choose a suitable type for a value
- use arithmetic, relational and logical operators, and complete a truth table for AND, OR and NOT
- read and write simple IF statements and FOR and WHILE loops in Python and BASIC
- explain arrays, procedures, functions and parameters
- distinguish syntax, logic and runtime errors, and describe normal, boundary and erroneous test data

## Variables, constants and data types

![Variables drawn as labelled boxes in memory: age holds the integer 17, price holds the real number 2.5, name holds the string Fatmata and passed holds the Boolean value True. Below, an array called marks holds 67, 82, 45, 90 and 73 at indexes 0 to 4, so marks[3] is 90](https://wasscetutor.com/img/ict/variables-and-arrays.svg)

*Figure 1. Variables as named boxes in memory, and an array of five marks. WASSCE Tutor diagram.*

:::callout{type=definition}
**Constant:** a named value that does not change while a program runs, such as the value of pi or a fixed exchange rate.

**Identifier:** the name a programmer gives to a variable, constant, array or subprogram, such as total or studentName.

**Data type:** the kind of value a variable can hold, such as a whole number, a decimal number, text or true/false, which decides what operations can be done on it.

**Assignment:** an instruction that stores a value in a variable, such as total = total + mark.
:::

**Rules for identifiers:** start with a **letter**; use letters, digits and the underscore only, with **no spaces**; do not use a **reserved word** of the language (such as print or if); and choose **meaningful names** (average, not x2).

| Data type | Holds | Examples | In Python |
|---|---|---|---|
| **Integer** | whole numbers | 17, −4, 2026 | int |
| **Real (floating point)** | numbers with a decimal part | 2.5, −0.75, 3.142 | float |
| **Character** | a single letter, digit or symbol | 'A', '7', '?' | (a string of length 1) |
| **String** | a sequence of characters (text) | "Fatmata", "SSS3" | str |
| **Boolean** | only True or False | True, False | bool |

A phone number such as "076123456" is stored as a **string**, because it is never used in calculations and its leading 0 must be kept.

## Operators

:::callout{type=definition}
**Arithmetic operator:** a symbol that performs a calculation on numbers, such as +, −, * (multiply) and / (divide).

**Relational (comparison) operator:** a symbol that compares two values and gives True or False, such as =, <, > and <>.

**Logical (Boolean) operator:** AND, OR or NOT, used to combine or reverse conditions.
:::

| Operation | Symbol (Python) | Symbol (BASIC) | Example | Result |
|---|---|---|---|---|
| add, subtract | `+` `-` | `+` `-` | 7 + 3 | 10 |
| multiply | `*` | `*` | 7 × 3 | 21 |
| divide | `/` | `/` | 7 ÷ 2 | 3.5 |
| whole-number division | `//` | `\` | 7 div 2 | 3 |
| remainder (modulus) | `%` | `MOD` | 7 mod 2 | 1 |
| power | `**` | `^` | 2 to the power 3 | 8 |
| equal to, not equal to | `==` `!=` | `=` `<>` | 5 = 5 | True |
| greater, less, or equal | `>` `<` `>=` `<=` | `>` `<` `>=` `<=` | 4 >= 7 | False |

The remainder operator is useful for testing whether a number is **even**: a number is even when number MOD 2 = 0.

### Truth tables for AND, OR and NOT

| A | B | A AND B | A OR B | NOT A |
|---|---|---|---|---|
| True | True | True | True | False |
| True | False | False | True | False |
| False | True | False | True | True |
| False | False | False | False | True |

**AND** is true only when **both** conditions are true; **OR** is true when **at least one** is true; **NOT** reverses a value. Example: a student qualifies when age >= 16 AND mark >= 50.

## Control structures in code

The control structures are planned in flowcharts and pseudocode (see the lesson on algorithms); here is how they look in Python and in QBASIC.

**Selection (IF):**

```python
mark = int(input("Enter mark: "))
if mark >= 50:
    print("Pass")
else:
    print("Fail")
```

```basic
INPUT "Enter mark: ", mark
IF mark >= 50 THEN
    PRINT "Pass"
ELSE
    PRINT "Fail"
END IF
```

**Iteration (FOR loop):** print the 7 times table from 7 × 1 to 7 × 12.

```python
for n in range(1, 13):
    print(7, "x", n, "=", 7 * n)
```

```basic
FOR n = 1 TO 12
    PRINT 7; "x"; n; "="; 7 * n
NEXT n
```

**Iteration (WHILE loop):** keep asking until a valid mark is entered.

```python
mark = int(input("Mark (0-100): "))
while mark < 0 or mark > 100:
    mark = int(input("Invalid. Mark (0-100): "))
```

In Python the **indentation** (the spaces at the start of a line) shows which statements belong inside an IF or a loop; in BASIC, keywords such as END IF and NEXT close the block.

## Arrays

:::callout{type=definition}
**Array:** a data structure that stores many values of the same data type under one name, each found by its position number, called its index.

**Index (subscript):** the position number of an item in an array, usually counted from 0 in Python and many other languages.
:::

With an array, one loop can process a whole list instead of using a separate variable for each item:

```python
marks = [67, 82, 45, 90, 73]
total = 0
for m in marks:
    total = total + m
print("Average:", total / len(marks))   # 357 / 5 = 71.4
```

## Subprograms

:::callout{type=definition}
**Subprogram (subroutine):** a named block of code that does one task and can be called from other parts of a program whenever it is needed; procedures and functions are subprograms.

**Function:** a subprogram that returns a value to the part of the program that called it.

**Parameter:** a variable listed in a subprogram's definition that receives a value (an argument) when the subprogram is called.
:::

```python
def area_of_circle(radius):        # radius is a parameter
    return 3.142 * radius * radius

print(area_of_circle(7))           # prints 153.958
```

A **procedure** carries out a task, such as printing a report heading, without returning a value.

**Why use subprograms (modular programming)?** Each part can be **written and tested separately**; code is **reused** instead of repeated; programs are **shorter and easier to read**; and a team can share the work.

## Errors, testing and debugging

:::callout{type=definition}
**Syntax error:** a mistake in the grammar (rules) of a programming language, such as a misspelt keyword or a missing bracket, which stops the program from being translated.

**Logic error:** a mistake in the steps of a program that lets it run but gives wrong results, such as dividing by 4 instead of 5.

**Runtime error:** an error that happens while the program is running and makes it stop, such as dividing by zero or opening a file that does not exist.

**Debugging:** the process of finding and removing errors (bugs) from a program.
:::

| Error | When it shows | Example |
|---|---|---|
| **Syntax** | when the program is translated | `pritn("Hello")` instead of `print("Hello")` |
| **Logic** | in the results: the program runs but is wrong | `average = total / 4` for five marks |
| **Runtime** | while running: the program crashes | `x = 10 / 0` |

### Test data

Programs are tested with three kinds of data. For a program that accepts exam marks from 0 to 100:

| Type of test data | Meaning | Example values |
|---|---|---|
| **Normal** | ordinary values that should be accepted | 45, 67, 82 |
| **Boundary (extreme)** | values at the edges of what is allowed | 0 and 100 (and just outside: −1, 101) |
| **Erroneous (abnormal)** | values that should be rejected | −20, 150, "abc" |

:::callout{type=local-example}
**A bug in a school results program.** A programmer at a school in Bo wrote `if mark > 50:` for "pass". Testing with the **boundary** value 50 showed that a student with exactly 50 was failed. Changing `>` to `>=` fixed the **logic error**, a mistake that normal test data alone would not have found.
:::

:::callout{type=common-mistake}
**Mixing up = and == in Python.** A single `=` **assigns** a value (`total = 0`); a double `==` **compares** two values (`if total == 0:`). Using `=` in an IF condition is a syntax error in Python.
:::

## Practice

:::reveal{title="1. Distinguish between a variable and a constant."}
A **variable** is a named memory location whose value **can change** while the program runs; a **constant** is a named value that **stays the same**, such as pi.
:::

:::reveal{title="2. State a suitable data type for each: (a) a student's age, (b) a price of 12.50, (c) a surname, (d) whether fees are paid."}
(a) **Integer**. (b) **Real** (floating point). (c) **String**. (d) **Boolean**.
:::

:::reveal{title="3. What are the values of 17 MOD 5 and 17 DIV 5?"}
17 ÷ 5 = 3 remainder 2, so **17 MOD 5 = 2** and **17 DIV 5 = 3**.
:::

:::reveal{title="4. With A = True and B = False, give the values of A AND B, A OR B and NOT B."}
A AND B = **False**; A OR B = **True**; NOT B = **True**.
:::

:::reveal{title="5. Distinguish between a syntax error and a logic error, with an example of each."}
A **syntax error** breaks the rules of the language, so the program will not run, such as **pritn** for print. A **logic error** lets the program run but gives **wrong results**, such as dividing a total of five marks **by 4**.
:::

## Key points

- A **variable** holds a value that can change; a **constant** does not; an **identifier** is a name; **assignment** stores a value.
- Data types: **integer, real, character, string, Boolean**.
- Operators: **arithmetic** (+ − * / DIV MOD ^), **relational** (= <> < > <= >=), **logical** (AND, OR, NOT).
- Code uses **IF … ELSE**, **FOR** and **WHILE**; Python uses indentation to show blocks.
- **Arrays** store many values under one name, found by **index**; **subprograms** (procedures and functions) take **parameters**.
- Errors: **syntax, logic, runtime**; test with **normal, boundary and erroneous** data; **debugging** removes errors.

## WASSCE examination focus

:::callout{type=waec-tests}
Programming-concept questions ask you to define variables, constants, data types and arrays, to choose a data type for a value, to work out expressions using MOD, DIV and relational or logical operators, to complete truth tables, to read short programs and state their output, and to distinguish syntax, logic and runtime errors. When asked for output, trace the program line by line and write down every value it prints.
:::
