:::callout{type=definition}
**Computer programming** is the craft of turning a problem into working software: understanding the problem, designing a solution, coding it in a programming language, then testing it and keeping it up to date. It follows an ordered set of stages called the **program development life cycle**.
:::

Every app on your phone began as a problem someone wanted to solve. Good programmers do not start by typing code: they first understand the problem, plan a solution, then write, test and improve the program. This lesson takes you through the **program development life cycle**, the **input-process-output (IPO) chart**, the parts of a simple program, and how to **write your first programs in QBASIC and Python**, with the qualities of a good program and how programs are documented.

## Learning objectives

By the end of this lesson you should be able to:

- describe the stages of the program development life cycle
- draw an IPO chart for a simple problem
- explain keywords, statements and comments, and the use of an IDE
- write simple programs in QBASIC and Python that input, calculate and output values
- state the qualities of a good program
- distinguish user documentation from technical documentation

## The program development life cycle

![The program development life cycle as a circle of seven stages: 1, problem definition; 2, analysis of inputs, processes and outputs; 3, design with an algorithm and flowchart; 4, coding; 5, testing and debugging; 6, implementation; 7, maintenance, which leads back to problem definition. Documentation, in the centre, is written at every stage](https://wasscetutor.com/img/ict/program-development-life-cycle.svg)

*Figure 1. The program development life cycle. WASSCE Tutor diagram.*

:::callout{type=definition}
**Problem definition:** the first stage, in which the programmer states clearly what problem the program must solve and what it must do.

**Problem analysis:** the stage in which the problem is broken down to find the inputs needed, the processing to be done and the outputs required.

**Program design:** the stage in which the solution is planned as an algorithm, using flowcharts or pseudocode, before any code is written.

**Coding:** the stage in which the design is written as instructions in a programming language.

**Program testing:** running the finished code on a computer with planned test data, normal, boundary and erroneous, and comparing the output it actually gives with the output expected.

**Implementation:** installing the finished program on the users' computers, training the users and starting to use it.

**Program maintenance:** changing a program after it is in use, to correct errors found later, improve it or meet new needs.

**Program documentation:** the written description of a program, how it works and how to use it, produced at every stage of development.
:::

### Documentation

- **User documentation (user manual):** tells users how to install and **use** the program, with screenshots, examples and help for common problems.
- **Technical documentation:** tells programmers **how the program works**: the algorithm, flowcharts, the code with comments, data types and test results, so that it can be maintained later.

## Planning with an IPO chart

:::callout{type=definition}
**IPO chart (input-process-output chart):** a table that lists a program's inputs, the processing done on them and the outputs it produces, used during problem analysis.
:::

![An input-process-output chart for a program that finds the area and perimeter of a rectangle: input, the length and the width; process, area = length × width and perimeter = 2 × (length + width); output, the area and the perimeter](https://wasscetutor.com/img/ict/ipo-chart.svg)

*Figure 2. An IPO chart for the rectangle program. WASSCE Tutor diagram.*

## The parts of a program

:::callout{type=definition}
**Statement:** a single instruction in a program, such as PRINT total, usually written on its own line.

**Keyword (reserved word):** a word with a special meaning in a programming language, such as PRINT, INPUT, IF or FOR, which cannot be used as a variable name.

**Comment:** a note written in a program to explain the code to people; the computer ignores it (REM or ' in BASIC, # in Python).

**Integrated development environment (IDE):** a program that brings together the tools for writing programs: an editor, a translator, a debugger and a way to run the program, such as IDLE for Python or QB64 for BASIC.
:::

### Common QBASIC statements

| Statement | Use | Example |
|---|---|---|
| **REM** | a comment | REM Area of a rectangle |
| **CLS** | clears the screen | CLS |
| **INPUT** | reads a value typed by the user | INPUT "Length: ", L |
| **LET** | assigns a value (LET is optional) | LET A = L * W |
| **PRINT** | displays output | PRINT "Area ="; A |
| **END** | ends the program | END |

## Writing your first programs

:::callout{type=worked-example}
**Program 1: the area and perimeter of a rectangle** (the IPO chart above).

```basic
REM Area and perimeter of a rectangle
CLS
INPUT "Enter the length: ", L
INPUT "Enter the width: ", W
A = L * W
P = 2 * (L + W)
PRINT "Area ="; A
PRINT "Perimeter ="; P
END
```

The same program in Python:

```python
# Area and perimeter of a rectangle
length = float(input("Enter the length: "))
width = float(input("Enter the width: "))
area = length * width
perimeter = 2 * (length + width)
print("Area =", area)
print("Perimeter =", perimeter)
```

With length 8 and width 5: area = 8 × 5 = **40** and perimeter = 2 × (8 + 5) = **26**.
:::

In Python, `input()` always reads **text**, so `float()` (or `int()` for whole numbers) turns it into a number before calculating.

:::callout{type=worked-example}
**Program 2: Celsius to Fahrenheit.** The formula is F = C × 9 ÷ 5 + 32.

```python
# Convert a temperature from Celsius to Fahrenheit
celsius = float(input("Temperature in Celsius: "))
fahrenheit = celsius * 9 / 5 + 32
print(celsius, "C is", fahrenheit, "F")
```

For 30 °C: 30 × 9 ÷ 5 + 32 = 54 + 32 = **86 °F**.
:::

:::callout{type=worked-example}
**Program 3: simple interest.** Interest = principal × rate × time ÷ 100.

```basic
REM Simple interest
INPUT "Principal: ", P
INPUT "Rate (% per year): ", R
INPUT "Time (years): ", T
I = P * R * T / 100
PRINT "Interest ="; I
PRINT "Amount ="; P + I
END
```

With P = 2000, R = 5 and T = 3: I = 2000 × 5 × 3 ÷ 100 = **300**, and the amount is 2000 + 300 = **2300**.
:::

## Qualities of a good program

- **Correctness:** it gives the right results for all valid inputs.
- **Reliability (robustness):** it does not crash on unexpected input; it checks data and shows helpful messages.
- **Efficiency:** it does not waste processing time or memory.
- **Readability:** meaningful variable names, **comments** and neat **indentation** make the code easy to follow.
- **Maintainability:** it is easy to correct and change later.
- **User-friendliness:** clear prompts and messages.
- **Portability:** it can run on different computers with little or no change.

## Kinds of programming

| Approach | Idea | Examples |
|---|---|---|
| **Procedural** | a program is a series of steps and procedures | BASIC, C, Pascal |
| **Object-oriented** | a program is built from objects that hold data and actions together | Java, C++, Python |
| **Event-driven** | the program responds to events such as clicks and key presses | apps with buttons and menus, Visual Basic |

:::callout{type=local-example}
**A programming project for a school canteen.** *Problem definition:* the canteen needs to total each day's sales. *Analysis:* inputs are the number of each item sold and its price; the output is the day's total. *Design:* a flowchart with a loop over the items. *Coding:* a short Python program. *Testing:* a day's sales checked against a calculator. *Implementation:* the cashier is shown how to use it. *Maintenance:* a new item, moi moi, is added the next term.
:::

:::callout{type=common-mistake}
**Starting with code.** Typing a program before defining the problem and designing the algorithm leads to programs that solve the wrong problem or are full of errors. Plan first with an IPO chart and a flowchart or pseudocode.
:::

## Practice

:::reveal{title="1. List the stages of the program development life cycle in order."}
**Problem definition → analysis → design → coding → testing and debugging → implementation → maintenance**, with **documentation** at every stage.
:::

:::reveal{title="2. Draw an IPO chart for a program that finds the average of three test scores."}
**Input**: score1, score2, score3. **Process**: total = score1 + score2 + score3; average = total ÷ 3. **Output**: average.
:::

:::reveal{title="3. State the use of each QBASIC statement: REM, INPUT, PRINT, CLS."}
**REM**: writes a comment; **INPUT**: reads a value from the keyboard; **PRINT**: displays output; **CLS**: clears the screen.
:::

:::reveal{title="4. What will this Python program print? a = 7, b = 3, print(a * b - a)"}
7 × 3 − 7 = 21 − 7 = **14**.
:::

:::reveal{title="5. Distinguish between user documentation and technical documentation."}
**User documentation** explains how to **install and use** the program, for its users. **Technical documentation** explains **how the program works** (algorithms, code, test results), for programmers who will maintain it.
:::

## Key points

- **Programming** follows the **program development life cycle**: problem definition, analysis, design, coding, testing and debugging, implementation, maintenance, with **documentation** throughout.
- An **IPO chart** lists inputs, processing and outputs.
- Programs are made of **statements** using **keywords**; **comments** explain the code; an **IDE** combines editor, translator and debugger.
- QBASIC: **REM, CLS, INPUT, LET, PRINT, END**. Python: **#, input(), int(), float(), print()**.
- A good program is **correct, reliable, efficient, readable, maintainable, user-friendly and portable**.

## WASSCE examination focus

:::callout{type=waec-tests}
Programming questions ask you to list and explain the stages of the program development life cycle, to state the qualities of a good program, to explain documentation, to write a short program in BASIC (or another language you have studied) for a formula such as area, interest or average, and to state the output of a given program. Use correct keywords, give every variable a value before it is used, and show the output for the values in the question.
:::
