:::callout{type=definition}
A **programming language** is a set of words, symbols and rules used to write instructions (a program) for a computer. Programming languages are grouped into **low-level languages** (machine language and assembly language) and **high-level languages** such as Python, Java and C.
:::

A computer's processor only understands **machine code**: patterns of 0s and 1s. People find it much easier to write instructions in words and symbols. This lesson explains the **levels of programming languages**, from machine language to high-level languages, their advantages and disadvantages, common high-level languages and their uses, and the **language translators**: the **assembler**, the **compiler** and the **interpreter**, including the **difference between a compiler and an interpreter**.

## Learning objectives

By the end of this lesson you should be able to:

- define a program and a programming language
- describe machine language, assembly language and high-level languages, with examples
- state the advantages and disadvantages of low-level and high-level languages
- name high-level languages and what each is mainly used for
- explain the work of an assembler, a compiler and an interpreter
- state the differences between a compiler and an interpreter

## Programs and programming languages

:::callout{type=definition}
**Program:** a set of instructions, written in a programming language, that tells a computer how to carry out a task.

**Programmer:** a person who writes, tests and maintains computer programs.

**Source code (source program):** a program as written by the programmer in a programming language, before it is translated.

**Object code (object program):** the machine-code program produced when source code is translated by a compiler or assembler.
:::

## Levels of programming languages

![Levels of programming languages: at the bottom, machine language, a low-level language written in binary, for example 00000001 11011000; in the middle, assembly language, a low-level language using mnemonics such as MOV, ADD and JMP, for example ADD AX, BX, which an assembler translates into machine code; at the top, high-level languages such as Python, Java, C, BASIC and Pascal, for example total = a + b, which a compiler or interpreter translates. Going up, languages are easier for people to read and write; going down, they are closer to the machine and faster](https://wasscetutor.com/img/ict/levels-of-programming-languages.svg)

*Figure 1. The same addition written at each level of programming language. WASSCE Tutor diagram.*

:::callout{type=definition}
**Machine language:** the lowest-level language, made of binary codes (0s and 1s) that the CPU carries out directly; it is the first generation of programming languages.

**Assembly language:** a low-level language that uses short words called **mnemonics**, such as ADD, SUB, MOV and JMP, in place of binary codes; it is the second generation.

**High-level language:** a programming language that uses English-like words and ordinary mathematical symbols, so that programs are easy to read and write and can run on different types of computer.
:::

### Machine language (first generation)

- **Advantages:** runs **fastest**, because it needs no translation; uses memory efficiently.
- **Disadvantages:** very **hard to write, read and correct**; long strings of 0s and 1s cause many errors; **machine-dependent**: a program written for one type of processor will not run on another.

### Assembly language (second generation)

- **Advantages:** easier than machine code, because mnemonics are easier to remember; still fast and gives close control of the hardware.
- **Disadvantages:** still **machine-dependent**; needs an **assembler**; each instruction does very little, so programs are long.

### High-level languages (third generation and above)

- **Advantages:** **easy to learn, read and write**; English-like; **machine-independent (portable)**: the same program runs on different computers; easier to find and correct errors; one statement does a lot of work.
- **Disadvantages:** must be **translated** by a compiler or an interpreter; programs may run **more slowly** and use more memory than low-level programs.

**Fourth-generation languages (4GLs)** are closer still to human language and are mostly used to work with databases, such as **SQL**: `SELECT Name FROM Students WHERE Class = 'SSS3'`. **Fifth-generation languages** are used in artificial intelligence, such as **Prolog**.

| | Low-level languages | High-level languages |
|---|---|---|
| Words used | binary codes or mnemonics | English-like words and symbols |
| Ease of use | hard | easy |
| Portability | machine-dependent | machine-independent |
| Translator | none (machine) or assembler | compiler or interpreter |
| Speed | very fast | slower |
| Finding errors | hard | easier |

### Common high-level languages

| Language | Main use |
|---|---|
| **FORTRAN** (FORmula TRANslation) | science and engineering calculations |
| **COBOL** (COmmon Business-Oriented Language) | business and banking records |
| **BASIC** (Beginner's All-purpose Symbolic Instruction Code) | teaching beginners |
| **Pascal** | teaching structured programming |
| **C** and **C++** | operating systems, games and fast programs |
| **Java** | Android apps, large business systems |
| **Python** | beginners, data science, artificial intelligence, the web |
| **JavaScript**, **PHP** | websites |
| **SQL** | databases (a 4GL) |

## Language translators

![Three translators: a compiler translates a whole high-level source program at once into object code (machine code) that can be run any time; an interpreter translates and runs a high-level program line by line and stops at the first error; an assembler translates an assembly-language program into machine code that runs on the CPU. All three turn a program into machine code, the only language the CPU understands](https://wasscetutor.com/img/ict/compiler-vs-interpreter.svg)

*Figure 2. How a compiler, an interpreter and an assembler translate programs. WASSCE Tutor diagram.*

:::callout{type=definition}
**Assembler:** a translator that converts a program written in assembly language into machine code.

**Compiler:** a translator that converts a whole high-level program (the source code) into machine code (the object code) in one go, before the program is run.

**Interpreter:** a translator that translates a high-level program one statement at a time and carries out each statement before moving to the next.
:::

### Differences between a compiler and an interpreter

| Compiler | Interpreter |
|---|---|
| translates the **whole program at once** | translates and runs **one line at a time** |
| produces an **object code** file that is kept | produces **no object code** file |
| program runs **fast** once compiled | program runs **more slowly** |
| the compiler is not needed to run the program again | the interpreter is needed **every time** the program runs |
| reports **all errors together** after translating | **stops at the first error** it meets, which helps beginners |
| source code can be kept secret | source code must be given out with the program |
| examples: C, C++, Pascal | examples: Python, BASIC, JavaScript |

:::callout{type=tip}
**Which translator for which job?** An interpreter suits a learner testing a program step by step, because it stops at each error. A compiler suits a finished program that will be run many times, because the compiled program runs faster and needs no translator.
:::

:::callout{type=common-mistake}
**Saying a compiler "runs" the program.** A compiler only **translates**; the object code it produces is run afterwards. An interpreter both translates and runs each line.
:::

## Practice

:::reveal{title="1. Distinguish between a low-level language and a high-level language."}
A **low-level** language (machine or assembly) is close to the computer's own code, machine-dependent and hard to write. A **high-level** language uses English-like words and symbols, is machine-independent and easy to write, but must be translated by a compiler or interpreter.
:::

:::reveal{title="2. State two advantages of machine language."}
It runs **very fast**, because it needs **no translation**, and it uses memory **efficiently**.
:::

:::reveal{title="3. What is a mnemonic? Give two examples."}
A short word used in **assembly language** in place of a binary instruction code. Examples: **ADD, SUB, MOV, JMP, LDA**.
:::

:::reveal{title="4. State three differences between a compiler and an interpreter."}
Any three: a compiler translates the **whole program at once**, an interpreter **line by line**; a compiler produces **object code**, an interpreter does not; compiled programs run **faster**; an interpreter **stops at the first error**, a compiler reports all errors together; the interpreter is needed **every time** the program runs.
:::

:::reveal{title="5. Name three high-level languages and the main use of each."}
Any three, such as: **FORTRAN** (science), **COBOL** (business), **BASIC** (teaching beginners), **Python** (beginners, data science, AI), **Java** (Android apps), **JavaScript** (websites).
:::

## Key points

- A **program** is a set of instructions; a **programming language** is used to write it.
- **Machine language** (binary) and **assembly language** (mnemonics) are **low-level**: fast but hard and machine-dependent.
- **High-level languages** (Python, Java, C, BASIC, COBOL, FORTRAN) are English-like and portable but must be translated.
- **Assembler**: assembly → machine code. **Compiler**: whole program at once, makes object code. **Interpreter**: line by line, stops at the first error.
- **Source code** is what the programmer writes; **object code** is the translated machine code.

## WASSCE examination focus

:::callout{type=waec-tests}
On programming languages, examiners like to ask you to name and explain the levels (or generations) of programming languages, to give advantages and disadvantages of low-level and high-level languages, to expand names such as COBOL, FORTRAN and BASIC, to state the function of an assembler, a compiler and an interpreter, and to give differences between a compiler and an interpreter. Set comparisons side by side, point for point.
:::
