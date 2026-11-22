:::callout{type=definition}
The **central processing unit (CPU)** is the part of a computer that carries out the instructions of programs: it does the calculations, makes the comparisons and controls every other part of the computer. It is also called the **processor**, and often the **brain of the computer**.
:::

Every time you open an app, type a letter or play a video, the CPU is fetching and carrying out instructions, billions of them every second. This lesson explains the **parts of the CPU** (the control unit, the arithmetic and logic unit and the registers), the **functions of the CPU**, the buses that link it to memory, the **fetch–decode–execute cycle**, and what makes one processor faster than another.

## Learning objectives

By the end of this lesson you should be able to:

- draw and label a block diagram of a computer system
- state the functions of the control unit and of the arithmetic and logic unit
- name the main registers and say what each holds
- describe the data, address and control buses
- explain the fetch–decode–execute cycle
- state the factors that affect the speed of a processor

## The CPU in a computer system

![Block diagram of a computer system: input devices such as a keyboard, mouse and scanner send data to the central processing unit, which contains the control unit, the arithmetic and logic unit and registers. The CPU exchanges data with main memory (RAM and ROM) and with secondary storage, and sends results to output devices such as a monitor, printer and speakers. Buses carry signals between the parts](https://wasscetutor.com/img/ict/computer-system-block-diagram.svg)

*Figure 1. Block diagram of a computer system. WASSCE Tutor diagram.*

Data flows **in** through input devices, is **processed** by the CPU using main memory, goes **out** through output devices and is **saved** on secondary storage. In a modern computer the CPU is a single **microprocessor** chip, fitted into a socket on the **motherboard** under a heat sink and fan that keep it cool.

## The parts of the CPU

:::callout{type=definition}
**Control unit (CU):** the part of the CPU that fetches instructions from memory, decodes them and directs and coordinates all the other parts of the computer to carry them out.

**Arithmetic and logic unit (ALU):** the part of the CPU that performs arithmetic (adding, subtracting, multiplying, dividing) and logic operations (comparing values and making decisions such as greater than, equal to, AND, OR, NOT).

**Register:** a very small, very fast storage location inside the CPU that holds an instruction, an address or a value while it is being used.
:::

### Functions of the control unit

- **fetches** each instruction from main memory
- **decodes** (interprets) the instruction
- **directs** the ALU, memory and input and output devices to carry it out, by sending **control signals**
- **coordinates** the flow of data between the parts of the computer
- keeps all operations in step with the CPU's **clock**

### Functions of the arithmetic and logic unit

- **arithmetic operations:** addition, subtraction, multiplication and division
- **logic operations:** comparisons (is A greater than B? are they equal?) and the logic of AND, OR and NOT, which let programs make decisions

### The main registers

:::callout{type=definition}
| Term | Meaning |
|---|---|
| **Program counter (PC)** | the register that holds the address of the **next** instruction to be fetched |
| **Memory address register (MAR)** | the register that holds the address of the memory location about to be read from or written to |
| **Memory data register (MDR)** | the register, also called the memory buffer register, that holds the data or instruction just read from memory or about to be written to it |
| **Current instruction register (CIR)** | the register that holds the instruction being decoded and carried out |
| **Accumulator (ACC)** | the register that holds the result of the latest calculation by the ALU |
:::

## Buses

:::callout{type=definition}
**Bus:** a set of parallel wires or connections that carries signals between the parts of a computer, such as between the CPU and memory.
:::

| Bus | What it carries | Direction |
|---|---|---|
| **Data bus** | the data and instructions themselves | both ways, between CPU, memory and devices |
| **Address bus** | the **address** of the memory location or device to use | one way, from the CPU |
| **Control bus** | **control signals**, such as read, write and clock timing | both ways |

## The fetch–decode–execute cycle

:::callout{type=definition}
**Fetch–decode–execute cycle:** the sequence of steps the CPU repeats for every instruction: fetch the instruction from memory, decode it, then execute it. It is also called the **machine cycle** or **instruction cycle**.
:::

![The fetch–decode–execute cycle: 1, fetch: copy the next instruction from main memory into the CPU using the program counter; 2, decode: the control unit works out what the instruction means; 3, execute: carry it out, using the ALU, and store any result; then repeat for the next instruction](https://wasscetutor.com/img/ict/fetch-decode-execute.svg)

*Figure 2. The fetch–decode–execute (machine) cycle. WASSCE Tutor diagram.*

1. **Fetch:** the address in the **program counter** is copied to the **MAR**; the instruction at that address travels along the data bus into the **MDR** and then into the **instruction register**; the program counter goes up by one, ready for the next instruction.
2. **Decode:** the **control unit** works out what the instruction means and what it needs (for example "add the number at address 200").
3. **Execute:** the instruction is carried out; a calculation is done by the **ALU**, and the result is kept in the **accumulator** or written back to memory.

The cycle then repeats, billions of times a second.

## What makes a processor fast?

:::callout{type=definition}
**Clock speed:** the number of cycles the CPU's clock completes each second, measured in hertz; a 3 GHz processor runs 3 billion cycles a second.

**Multi-core processor:** a single CPU chip that contains two or more processing units (cores), each able to carry out instructions at the same time.
:::

- **Clock speed:** higher gigahertz (GHz) means more instructions each second.
- **Number of cores:** dual-core (2), quad-core (4) and octa-core (8) processors can work on several tasks at once.
- **Cache size:** **cache memory** is very fast memory on or near the CPU that holds the instructions and data used most often; a bigger cache means fewer slow trips to main memory.
- **Word size:** a 64-bit processor handles 64 bits at a time, twice as much as a 32-bit processor.
- **Bus width and speed:** wider buses carry more bits at once.

:::callout{type=local-example}
**Processors you can buy.** Laptops and desktops sold in Sierra Leone usually have an **Intel Core** (i3, i5, i7) or **AMD Ryzen** processor. Smartphones and tablets use **ARM**-based processors such as Qualcomm Snapdragon, MediaTek or Apple's A-series chips, which use less power so the battery lasts longer.
:::

:::callout{type=common-mistake}
**Calling the system unit "the CPU".** The box of a desktop computer is the **system unit**; it holds the motherboard, power supply, memory and storage. The CPU is one chip inside it.
:::

## Practice

:::reveal{title="1. Name the three main parts of the CPU."}
The **control unit**, the **arithmetic and logic unit (ALU)** and the **registers**.
:::

:::reveal{title="2. State two functions of the control unit."}
Any two: it **fetches** instructions from memory; it **decodes** them; it **directs** the other parts to carry them out by sending control signals; it **coordinates** the flow of data.
:::

:::reveal{title="3. What does the program counter hold?"}
The **address of the next instruction** to be fetched from memory.
:::

:::reveal{title="4. Describe the three stages of the machine cycle."}
**Fetch**: the next instruction is copied from memory into the CPU. **Decode**: the control unit works out what it means. **Execute**: it is carried out, often by the ALU, and any result is stored.
:::

:::reveal{title="5. State three factors that affect the speed of a processor."}
Any three: **clock speed**, **number of cores**, **cache size**, **word size**, **bus width**.
:::

## Key points

- The **CPU** carries out program instructions; it is the brain of the computer.
- **Control unit**: fetches, decodes, directs and coordinates. **ALU**: arithmetic and logic. **Registers**: tiny fast stores inside the CPU.
- Registers: **PC** (next address), **MAR** (address to use), **MDR** (data moving), **CIR** (current instruction), **accumulator** (result).
- Buses: **data** (data, both ways), **address** (addresses, from the CPU), **control** (signals).
- **Fetch → decode → execute**, repeated for every instruction.
- Speed depends on **clock speed, cores, cache, word size and bus width**.

## WASSCE examination focus

:::callout{type=waec-tests}
Questions on the processor commonly ask you to name the components of the CPU and state their functions, to draw a labelled block diagram of a computer, to describe the fetch–decode–execute cycle, to state what a named register holds, to distinguish the data, address and control buses, and to give factors affecting processor speed. In a block diagram, show the arrows: input to the CPU, the CPU to output, and two-way arrows between the CPU and memory.
:::
