:::callout{type=definition}
An **algorithm** is a finite, ordered set of clear, step-by-step instructions for solving a problem or carrying out a task. Algorithms are written in words, drawn as **flowcharts** or written in **pseudocode** before they are turned into a program.
:::

A recipe for jollof rice, the steps for withdrawing cash from an ATM and the method for long division are all algorithms. Before writing any program, a programmer plans the steps. This lesson explains **what an algorithm is** and the properties of a good one, the **flowchart symbols** and how to draw a flowchart, how to write **pseudocode**, the three **control structures** (sequence, selection and iteration), and how to check an algorithm with a **trace table**.

## Learning objectives

By the end of this lesson you should be able to:

- define an algorithm and state the properties of a good algorithm
- name and draw the standard flowchart symbols and state the use of each
- write pseudocode using INPUT, PRINT, IF … THEN … ELSE, WHILE and FOR
- explain and use sequence, selection and iteration
- draw a flowchart and write pseudocode for a simple problem
- dry-run an algorithm with a trace table

## Properties of a good algorithm

| Property | Meaning |
|---|---|
| **Finiteness** | it must **end** after a limited number of steps |
| **Definiteness** | every step is **clear** and has only one meaning |
| **Input** | it takes zero or more values to work on |
| **Output** | it produces at least one result |
| **Effectiveness** | every step is simple enough to be carried out exactly |
| **Correct order** | the steps are in a logical **sequence** |

An algorithm can be written in **three ways**: as numbered **steps in plain English**, as a **flowchart**, or in **pseudocode**.

## Flowcharts

:::callout{type=definition}
**Flowchart:** a diagram that shows the steps of an algorithm using standard symbols joined by arrows (flow lines) in the order the steps are carried out.

**Connector:** a small circle with a letter or number, used to join parts of a flowchart that are far apart or on different pages.
:::

![The standard flowchart symbols: terminal (an oval) for Start and Stop; parallelogram for input and output; rectangle for a process such as total = a + b; diamond for a decision with Yes and No exits; small circle for a connector; arrow for a flow line showing the order of steps; and a rectangle with double sides for a predefined process (subroutine)](https://wasscetutor.com/img/ict/flowchart-symbols.svg)

*Figure 1. The standard flowchart symbols. WASSCE Tutor diagram.*

**Rules for drawing a flowchart:**

- begin with **one Start** terminal and end with a **Stop** terminal
- use the **correct symbol** for each step
- let the flow run from **top to bottom** and **left to right**, with an arrowhead on every flow line
- a decision diamond has **one way in** and **two ways out**, labelled Yes and No
- keep the text in each symbol **short**

## Pseudocode

:::callout{type=definition}
**Pseudocode:** a way of writing an algorithm in structured, English-like statements that resemble a programming language but follow no strict rules of any one language.
:::

Common pseudocode words: **BEGIN** and **END**; **INPUT** or **READ**; **PRINT** or **OUTPUT**; **SET** or ← for giving a value; **IF … THEN … ELSE … ENDIF**; **WHILE … DO … ENDWHILE**; **FOR … TO … NEXT**. Indent the steps inside a decision or a loop so the structure is easy to see.

## The three control structures

:::callout{type=definition}
**Sequence:** a control structure in which steps are carried out one after another, in the order they are written.

**Selection:** a control structure in which a condition is tested and the algorithm chooses between different paths depending on whether it is true or false.

**Iteration (loop):** a control structure in which a group of steps is repeated, either a fixed number of times or while a condition stays true.
:::

### Sequence

:::callout{type=worked-example}
**Find the average of three numbers.**

```text
BEGIN
   INPUT a, b, c
   SET sum = a + b + c
   SET average = sum / 3
   PRINT average
END
```

With 12, 15 and 9: sum = 36, average = 36 ÷ 3 = 12.
:::

### Selection

![A selection flowchart: Start; input the mark; decision: is the mark greater than or equal to 50? Yes leads to Print Pass, No leads to Print Fail; both paths join before Stop](https://wasscetutor.com/img/ict/flowchart-pass-fail.svg)

*Figure 2. Selection: a flowchart that decides between pass and fail. WASSCE Tutor diagram.*

The same algorithm in pseudocode:

```text
BEGIN
   INPUT mark
   IF mark >= 50 THEN
      PRINT "Pass"
   ELSE
      PRINT "Fail"
   ENDIF
END
```

A decision can test more than one condition in turn (**nested selection**), as in a grading algorithm: IF mark >= 75 THEN grade A, ELSE IF mark >= 60 THEN grade B, ELSE IF mark >= 50 THEN grade C, ELSE grade F.

### Iteration

:::callout{type=definition}
**Counter:** a variable that counts how many times a loop has run, increased by 1 each time round.

**Infinite loop:** a loop whose stopping condition is never met, so it repeats for ever, usually because the counter is never changed.
:::

![An iteration flowchart: Start; set total to 0 and count to 1; decision: is count less than or equal to 5? If yes, input a mark, add it to the total, add 1 to count and loop back to the decision; if no, set average to total divided by 5, print the average and stop. Marks 12, 15, 9, 18 and 16 give a total of 70 and an average of 14](https://wasscetutor.com/img/ict/flowchart-average-loop.svg)

*Figure 3. Iteration: a loop that averages five marks. WASSCE Tutor diagram.*

The same loop in pseudocode, first with a WHILE loop:

```text
BEGIN
   SET total = 0
   SET count = 1
   WHILE count <= 5 DO
      INPUT mark
      SET total = total + mark
      SET count = count + 1
   ENDWHILE
   SET average = total / 5
   PRINT average
END
```

and then with a FOR loop, which looks after the counter itself:

```text
BEGIN
   SET total = 0
   FOR count = 1 TO 5
      INPUT mark
      SET total = total + mark
   NEXT count
   SET average = total / 5
   PRINT average
END
```

A **WHILE** loop tests its condition **before** each pass and suits loops where the number of repeats is not known in advance; a **FOR** loop suits a **fixed** number of repeats. A **REPEAT … UNTIL** loop tests its condition **after** each pass, so its steps always run at least once.

## Checking an algorithm: the trace table

:::callout{type=definition}
**Trace table:** a table with a column for each variable, used to record the value of every variable as each step of an algorithm is followed by hand.

**Dry run:** working through an algorithm by hand, step by step, with sample data, to check that it gives the right results.
:::

:::callout{type=worked-example}
**Dry-run the loop in Figure 3** with the marks 12, 15, 9, 18 and 16.

| count | mark | total | count ≤ 5? |
|---|---|---|---|
| 1 | 12 | 12 | yes |
| 2 | 15 | 27 | yes |
| 3 | 9 | 36 | yes |
| 4 | 18 | 54 | yes |
| 5 | 16 | 70 | yes |
| 6 | | 70 | **no**: leave the loop |

average = 70 ÷ 5 = **14**, which is printed.
:::

:::callout{type=local-example}
**An algorithm you follow at the market.** Buying rice by the cup: *input* the number of cups; *process*: cost = cups × price per cup; *decision*: is the money offered at least the cost? If yes, give change = money − cost; if no, ask for more money. A trader runs this algorithm in their head many times a day.
:::

:::callout{type=common-mistake}
**Using the wrong flowchart symbol.** Input and output always go in a **parallelogram**, calculations in a **rectangle**, and questions in a **diamond**. A decision drawn as a rectangle, or a Start drawn as a rectangle, loses marks.
:::

## Practice

:::reveal{title="1. State four properties of a good algorithm."}
Any four: **finiteness** (it ends), **definiteness** (each step is clear), **input**, **output**, **effectiveness** (each step can be done), steps in the **correct order**.
:::

:::reveal{title="2. Name the flowchart symbol used for (a) a decision, (b) input or output, (c) the start of an algorithm."}
(a) A **diamond**. (b) A **parallelogram**. (c) A **terminal** (oval or rounded rectangle).
:::

:::reveal{title="3. Write pseudocode that reads two numbers and prints the larger."}
BEGIN · INPUT a, b · IF a > b THEN PRINT a ELSE PRINT b ENDIF · END. (If a = b, either value may be printed.)
:::

:::reveal{title="4. Distinguish between selection and iteration."}
**Selection** tests a condition to **choose** between paths (IF … THEN … ELSE). **Iteration** **repeats** a group of steps, a fixed number of times or while a condition is true (FOR, WHILE).
:::

:::reveal{title="5. Why might a WHILE loop run for ever?"}
If the variable tested in its condition is **never changed** inside the loop (for example, the counter is not increased), the condition never becomes false: an **infinite loop**.
:::

## Key points

- An **algorithm** is a finite, ordered set of clear steps; good algorithms are finite, definite and effective, with input and output.
- Algorithms are shown as **plain steps**, **flowcharts** or **pseudocode**.
- Flowchart symbols: **terminal** (start/stop), **parallelogram** (input/output), **rectangle** (process), **diamond** (decision), **connector**, **flow line**, **predefined process**.
- Control structures: **sequence** (in order), **selection** (IF … THEN … ELSE), **iteration** (FOR, WHILE, REPEAT … UNTIL).
- A **trace table** records variables during a **dry run** to check an algorithm.

## WASSCE examination focus

:::callout{type=waec-tests}
Algorithm questions ask you to define an algorithm and state its properties, to identify flowchart symbols and their uses, to draw a flowchart or write pseudocode for a short problem (an average, the larger of two numbers, a pass or fail decision, a total in a loop), and to complete a trace table. Draw every symbol with a ruler, label the Yes and No exits of every decision, and test your algorithm with sample numbers before you finish.
:::
