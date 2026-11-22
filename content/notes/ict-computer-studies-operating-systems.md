:::callout{type=definition}
An **operating system (OS)** is the system software that manages a computer's hardware and software resources, provides services to other programs and gives the user a way to work with the computer. Windows, macOS, Linux, Android and iOS are operating systems.
:::

The operating system is the first program to load when a computer or phone starts, and it runs until it is switched off. Every other program depends on it. This lesson explains the **functions of an operating system**, the **types of operating systems**, the kinds of user interface (command line and GUI), and common **examples of operating systems** for computers and phones.

## Learning objectives

By the end of this lesson you should be able to:

- define an operating system and show where it sits between the user and the hardware
- state and explain the functions of an operating system
- describe the types of operating systems, with examples
- distinguish a command-line interface from a graphical user interface
- name operating systems used on computers, phones and servers

## Where the operating system sits

![The operating system sits between application software and the hardware: four layers from top to bottom are the user, application software such as a word processor or browser, the operating system such as Windows, Android, Linux, macOS or iOS, and the hardware such as the CPU, memory, disks, keyboard and screen, with arrows both ways between each layer. A panel lists the functions of an operating system: managing the processor, memory, files and storage, and input and output devices, providing the user interface, keeping the computer secure and reporting errors](https://wasscetutor.com/img/ict/operating-system-layers.svg)

*Figure 1. The operating system sits between application software and the hardware. WASSCE Tutor diagram.*

:::callout{type=definition}
**Kernel:** the core of an operating system, which stays in memory while the computer is on and directly controls the processor, memory and devices.
:::

An application never controls the hardware directly. When you press **Print** in a word processor, the word processor asks the operating system, and the operating system uses the printer's driver to send the page to the printer.

## Functions of an operating system

1. **Processor (process) management:** decides which program uses the CPU and for how long, so that several programs can run at once.
2. **Memory management:** gives each program its share of RAM, keeps programs from overwriting each other, and uses virtual memory when RAM is full.
3. **File management:** organises files and folders on storage devices; lets users create, name, copy, move, rename and delete files.
4. **Device (input/output) management:** controls the keyboard, mouse, screen, printer and other devices through their drivers.
5. **User interface:** gives the user a way to give commands and see results, by typing, clicking or touching.
6. **Security:** controls who can use the computer, with user accounts, passwords and permissions.
7. **Booting:** loads and starts the computer when it is switched on.
8. **Error handling:** detects problems and shows error messages.
9. **Resource sharing and networking:** shares printers, files and the Internet connection between programs and users.

## Types of operating systems

:::callout{type=definition}
**Multitasking:** the ability of an operating system to run two or more programs at the same time, such as playing music while typing a document.

**Multi-user operating system:** an operating system that lets many users use one computer's resources at the same time, through terminals or a network.

**Real-time operating system:** an operating system that responds to input immediately, within a fixed short time, used to control machines and processes.

**Multiprocessing:** the use of two or more processors, or processor cores, in one computer, so that several instructions are carried out at the same moment.

**Network operating system:** an operating system that runs on a server and manages a network's users, shared files, printers and security.

**Mobile operating system:** an operating system built for smartphones and tablets, designed for touch screens, long battery life and wireless connections, such as Android and iOS.
:::

| Type | What it does | Examples |
|---|---|---|
| **Single-user, single-task** | one user, one program at a time | MS-DOS (old) |
| **Single-user, multitasking** | one user, many programs at once | Windows, macOS, Android |
| **Multi-user** | many users share one powerful computer at once | Unix, Linux servers, mainframe operating systems |
| **Multiprocessing** | uses two or more processors (cores) together | Windows, Linux on multi-core computers |
| **Real-time** | responds immediately to events | systems in aircraft, traffic lights, factory robots, medical machines |
| **Batch** | runs jobs in groups with no user present | early mainframes; payroll runs |
| **Time-sharing** | gives each user a short slice of CPU time in turn | Unix on mainframes |
| **Network operating system** | manages a network's users, files and printers | Windows Server, Linux servers |
| **Mobile operating system** | made for phones and tablets: touch, battery, wireless | Android, iOS |
| **Embedded operating system** | built into a device to control it | systems in ATMs, smart TVs, washing machines |

## User interfaces

:::callout{type=definition}
**User interface:** the part of the operating system (or of a program) through which the user and the computer communicate.

**Command-line interface (CLI):** a user interface in which the user types commands, such as `dir` or `copy`, at a prompt.

**Graphical user interface (GUI):** a user interface that uses windows, icons, menus and a pointer (WIMP), so the user clicks or touches pictures instead of typing commands.
:::

| Command-line interface (CLI) | Graphical user interface (GUI) |
|---|---|
| commands are **typed** | items are **clicked or touched** |
| you must **remember** the commands | easy to learn; things are visible on screen |
| uses little memory and processing power | needs more memory and processing power |
| fast for expert users and for repeating tasks | slower for some tasks, but friendly for beginners |
| example: MS-DOS, the Linux terminal | example: Windows, macOS, Android |

Other interfaces are **menu-driven** (choose from lists of options, as on an ATM or a basic phone), **touch-screen** (tap and swipe on a phone) and **voice** (spoken commands to an assistant such as Siri or Google Assistant).

**WIMP** stands for **W**indows, **I**cons, **M**enus and **P**ointer, the main parts of a GUI.

## Examples of operating systems

| Operating system | Made by | Used on |
|---|---|---|
| **Windows** (10, 11) | Microsoft | most desktop and laptop computers |
| **macOS** | Apple | Apple Mac computers |
| **Linux** (Ubuntu and others) | open-source community | servers, computers, many embedded devices |
| **Android** | Google | most smartphones and tablets |
| **iOS** / **iPadOS** | Apple | iPhones and iPads |
| **Unix** | first made at Bell Labs | servers and large systems |
| **MS-DOS** | Microsoft | early PCs; a command-line system |

:::callout{type=local-example}
**Operating systems around you.** Most phones sold in Sierra Leone run **Android**; school and office computers mostly run **Windows**; the servers behind mobile money and bank systems often run **Linux** or **Unix**; and the ATM outside a bank runs an **embedded** operating system.
:::

:::callout{type=common-mistake}
**Calling Microsoft Word an operating system.** Word is an **application** that runs on Windows or macOS. The operating system is the program that runs the computer itself and lets Word use the screen, keyboard, memory and printer.
:::

## Practice

:::reveal{title="1. Define an operating system and give two examples."}
System software that **manages the computer's hardware and software resources** and provides a user interface. Examples: **Windows, macOS, Linux, Android, iOS** (any two).
:::

:::reveal{title="2. State four functions of an operating system."}
Any four: **processor** management, **memory** management, **file** management, **device (input/output)** management, providing the **user interface**, **security**, **booting**, **error handling**.
:::

:::reveal{title="3. State two differences between a CLI and a GUI."}
Any two: in a CLI commands are **typed**, in a GUI icons and menus are **clicked**; a CLI needs commands to be **remembered**, a GUI is **easy to learn**; a CLI uses **less memory**, a GUI needs **more**.
:::

:::reveal{title="4. What does WIMP stand for?"}
**Windows, Icons, Menus, Pointer**.
:::

:::reveal{title="5. Which type of operating system would control an aircraft's autopilot, and why?"}
A **real-time** operating system, because it must **respond immediately** to changes in speed, height and direction.
:::

## Key points

- The **operating system** manages hardware and software and lets the user work with the computer; it sits between applications and hardware.
- Functions: managing the **processor, memory, files and devices**; the **user interface**; **security**; **booting**; **error handling**.
- Types: **single-user, multitasking, multi-user, multiprocessing, real-time, batch, time-sharing, network, mobile, embedded**.
- Interfaces: **CLI** (typed commands), **GUI** (WIMP), menu-driven, touch, voice.
- Examples: **Windows, macOS, Linux, Unix** (computers and servers); **Android, iOS** (phones).

## WASSCE examination focus

:::callout{type=waec-tests}
Expect to be asked to define an operating system, to state its functions, to name examples, to explain types such as multitasking, multi-user and real-time with examples, and to compare a command-line interface with a graphical user interface. When listing functions, name the resource managed and say what is done to it ("memory management: gives each program its own share of RAM").
:::
