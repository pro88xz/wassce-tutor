:::callout{type=definition}
**Data** are raw, unprocessed facts and figures, such as numbers, names and measurements, that have no meaning on their own.

**Information** is data that has been processed, organised or given a context so that it is meaningful and useful for making decisions.
:::

A list of numbers such as 67, 82, 45 and 90 is **data**. Once a teacher adds them up, works out the class average and ranks the students, the result ("Fatmata came first with 82%; the class average is 71%") is **information**. This lesson explains the **difference between data and information**, the qualities of good information, the **data processing cycle**, the methods and modes of processing, how data is checked, and how data is organised from a single bit to a whole database.

## Learning objectives

By the end of this lesson you should be able to:

- state the difference between data and information, with examples
- list the qualities of good information
- describe the stages of the data processing cycle
- explain the methods and modes of data processing
- distinguish between validation and verification
- describe the data hierarchy: bit, byte, field, record, file and database

## The difference between data and information

| Data | Information |
|---|---|
| raw, unprocessed facts | processed, organised facts |
| has no meaning on its own | meaningful and useful |
| is the **input** to processing | is the **output** of processing |
| cannot be used for decisions as it is | is used to make decisions |
| example: students' marks in each subject | example: each student's average and position in class |

Data can be **numeric** (digits, such as 2026 or 75.5), **alphabetic** (letters, such as Kamara) or **alphanumeric** (letters and digits together, such as SSS3B or a car number plate). Computers also handle **graphics**, **audio** and **video** data.

### Qualities of good information

Good information is:

- **accurate**: free from errors
- **complete**: has every detail needed
- **relevant**: suits the purpose for which it is needed
- **timely**: available when it is needed, not too late
- **concise**: no longer than necessary
- **clear**: easy to understand
- **reliable**: comes from a trustworthy source

:::callout{type=tip}
**Garbage in, garbage out (GIGO).** A computer only processes what it is given. If the input data is wrong, the output information will be wrong too, however fast or powerful the computer is.
:::

## The data processing cycle

:::callout{type=definition}
**Data processing:** the collection and manipulation of data, by calculating, sorting, comparing and summarising it, to produce meaningful information.

**Data processing cycle:** the sequence of stages through which data passes to become information: collection, input, processing, output and storage.
:::

![The data processing cycle: raw data is collected, input into the computer, processed and output as information on a screen or in print. Processing reads from and saves to storage, and feedback from the output goes back to the input so that mistakes can be corrected](https://wasscetutor.com/img/ict/data-processing-cycle.svg)

1. **Data collection:** gathering the raw facts, for example from forms, questionnaires, registers, sensors or barcodes.
2. **Input:** entering the data into the computer, using input devices such as a keyboard or scanner. Data is often **prepared** (sorted, coded) and **checked** before or as it is entered.
3. **Processing:** the computer calculates, sorts, compares, classifies and summarises the data under the control of a program.
4. **Output:** the information is presented in a useful form, on a screen, as a printed report, as sound or in a file.
5. **Storage:** data, programs and results are saved for later use on a storage device.

**Feedback** is checking the output against what was expected; if there are errors, the data is corrected and processed again.

## Methods of data processing

| Method | How | Example |
|---|---|---|
| **Manual** | by hand, with pen and paper | a teacher adding up marks in a register |
| **Mechanical** | with machines that have moving parts | a typewriter, a cash register, a mechanical calculator |
| **Electronic** | with computers | a school's results printed by a computer program |

Electronic data processing is the fastest and most accurate, and it can handle very large amounts of data.

## Modes of data processing

:::callout{type=definition}
**Batch processing:** a mode of processing in which transactions are collected over a period and processed together as one group (a batch) at a later time.

**Real-time processing:** a mode of processing in which each transaction is processed immediately, so the result is available at once and can affect what happens next.
:::

- **Batch processing** examples: paying workers' salaries at the end of the month (payroll), printing utility bills, and marking the objective answer sheets of a national examination after all the scripts have been collected.
- **Real-time (online) processing** examples: withdrawing cash from an ATM, a mobile money transfer, booking an airline seat, controlling traffic lights.
- **Time-sharing:** many users at their terminals share one powerful computer, which gives each user a small slice of time in turn, so quickly that each seems to have the computer to themselves.
- **Distributed processing:** the work is shared among several computers in different places, linked by a network.

## Checking data: validation and verification

:::callout{type=definition}
**Validation:** an automatic check by the computer that data entered is sensible and allowed, for example that an age is a number between 10 and 25.

**Verification:** a check that data has been copied or entered correctly from its source, for example by entering it twice and comparing, or by proofreading.
:::

Common **validation checks**:

- **presence check:** a required field is not left empty
- **range check:** a value lies between limits (an exam mark from 0 to 100)
- **type check:** the data is of the right type (digits only in a phone number)
- **length check:** the right number of characters (an 11-digit phone number)
- **format check:** the right pattern (a date written as DD/MM/YYYY)

:::callout{type=common-mistake}
**Mixing up validation and verification.** Validation checks that data is **reasonable**; it cannot tell that a mark of 67 was typed as 76, because both are allowed. Verification checks that data was **copied correctly**, so it would catch that mistake.
:::

## The data hierarchy

Data in a computer is organised in levels, each built from the one below.

![The data hierarchy as stacked levels: a bit is a single 0 or 1; a byte is 8 bits and holds one character; a field is one item of data, such as a surname; a record is all the fields about one student; a file is the set of related records for a class; a database is a set of related files such as students, fees and results](https://wasscetutor.com/img/ict/data-hierarchy.svg)

:::callout{type=definition}
**Bit:** a binary digit, 0 or 1, the smallest unit of data in a computer.

**Byte:** a group of 8 bits, enough to store one character such as a letter or a digit.

**Field:** a single item of data about a person or thing, such as a surname or a date of birth.

**Record:** a collection of related fields about one person or thing, such as all the details of one student.

**File:** a collection of related records, such as the records of all the students in a class.

**Database:** an organised collection of related files or tables, such as students, fees and results.
:::

:::callout{type=local-example}
**A school's data, level by level.** "K" is stored as one byte. "Kamara" is a field. Aminata Kamara's ID number, name, class and date of birth together make one record. All the records for SSS3 make a file. The students, fees and results files of the whole school make a database.
:::

## Practice

:::reveal{title="1. State two differences between data and information."}
Any two: data is **raw and unprocessed**, information is **processed**; data has **no meaning on its own**, information is **meaningful**; data is the **input**, information is the **output**; information can be used to **make decisions**.
:::

:::reveal{title="2. List the stages of the data processing cycle in order."}
**Data collection → input → processing → output → storage**, with **feedback** from the output.
:::

:::reveal{title="3. State three qualities of good information."}
Any three: accurate, complete, relevant, timely, concise, clear, reliable.
:::

:::reveal{title="4. Give one example each of batch processing and real-time processing."}
Batch: monthly **payroll**, **utility bills**, marking exam answer sheets. Real-time: **ATM** withdrawal, **mobile money** transfer, airline **booking**, **traffic-light** control.
:::

:::reveal{title="5. Explain the difference between a range check and verification."}
A **range check** (a validation check) makes sure a value lies between limits, such as a mark from 0 to 100. **Verification** makes sure the data was copied correctly, for example by entering it twice and comparing.
:::

## Key points

- **Data** are raw facts; **information** is processed, meaningful data.
- Good information is **accurate, complete, relevant, timely, concise, clear and reliable**; **GIGO**: wrong input gives wrong output.
- **Data processing cycle**: collection → input → processing → output → storage, with feedback.
- Methods: **manual, mechanical, electronic**. Modes: **batch, real-time, time-sharing, distributed**.
- **Validation** checks data is sensible; **verification** checks it was copied correctly.
- **Data hierarchy**: bit → byte → field → record → file → database.

## WASSCE examination focus

:::callout{type=waec-tests}
WASSCE often asks you to distinguish data from information, to list the stages of the data processing cycle in order, to give qualities of good information, to give examples of batch and real-time processing, and to explain validation and verification or name validation checks. Questions on the data hierarchy ask you to arrange bit, byte, field, record, file and database in order or to define one of them.
:::
