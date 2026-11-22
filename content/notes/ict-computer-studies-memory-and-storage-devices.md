:::callout{type=definition}
**Memory** is the part of a computer that holds data and instructions. **Main (primary) memory**, RAM and ROM, is used directly by the CPU; **secondary storage**, such as a hard disk, an SSD or a flash drive, keeps programs and files permanently, even when the power is off.
:::

When you switch off a phone, the app you were using disappears from memory, but your photos are still there when you switch it on again. That is the difference between **memory** and **storage**. This lesson explains the **difference between RAM and ROM**, the types of each, cache memory and the memory hierarchy, and the **types of storage devices**, magnetic, optical, solid-state and cloud, with their capacities, uses, advantages and disadvantages.

## Learning objectives

By the end of this lesson you should be able to:

- distinguish primary memory from secondary storage
- state the differences between RAM and ROM, and name their types
- explain cache memory, registers and virtual memory
- describe the memory hierarchy
- classify storage devices as magnetic, optical or solid-state, with examples and capacities
- compare storage devices and choose one for a given task

## Primary memory and secondary storage

| Primary (main) memory | Secondary storage |
|---|---|
| RAM, ROM, cache | hard disk, SSD, flash drive, CD, DVD, memory card |
| accessed **directly** by the CPU | accessed through input/output controllers |
| **fast** | slower |
| small capacity | large capacity |
| RAM is **volatile** (loses data when power goes off) | **non-volatile** (keeps data without power) |
| more expensive per gigabyte | cheaper per gigabyte |

:::callout{type=definition}
**Volatile memory:** memory that loses its contents when the power is switched off, such as RAM.

**Non-volatile memory:** memory that keeps its contents without power, such as ROM, flash memory and a hard disk.
:::

## RAM and ROM

:::callout{type=definition}
**RAM (random access memory):** the main memory that holds the operating system, the programs in use and the data being worked on; it can be read from and written to, and it is volatile.

**ROM (read-only memory):** memory whose contents are written when it is made and can only be read, not changed by the user; it is non-volatile and holds the start-up instructions (firmware, BIOS) of a computer.
:::

| RAM | ROM |
|---|---|
| **random access memory** | **read-only memory** |
| **volatile**: contents lost when power goes off | **non-volatile**: contents kept without power |
| can be **read and written** | can only be **read** (normally) |
| holds the programs and data **in use** | holds the **start-up** instructions (BIOS, firmware) |
| contents change all the time | contents are fixed |
| larger: 4 GB to 32 GB in a typical computer | smaller |

### Types of RAM

- **DRAM (dynamic RAM):** must be refreshed thousands of times a second; cheaper and holds more, so it is used for **main memory**.
- **SRAM (static RAM):** does not need refreshing; faster and dearer, so it is used for **cache memory**.

### Types of ROM

- **PROM (programmable ROM):** blank when made; can be written **once** by the user with special equipment.
- **EPROM (erasable programmable ROM):** can be erased with **ultraviolet light** and written again.
- **EEPROM (electrically erasable programmable ROM):** can be erased and rewritten **electrically**, without removing the chip. **Flash memory**, used in flash drives, SSDs and memory cards, is a type of EEPROM.

:::callout{type=tip}
**Why more RAM makes a computer faster.** When RAM is full, the computer moves parts of programs to the much slower hard disk or SSD, called **virtual memory**. With more RAM, more programs run at once without this slow swapping.
:::

## Cache, registers and the memory hierarchy

:::callout{type=definition}
**Cache memory:** a small amount of very fast memory on or close to the CPU that holds copies of the data and instructions used most often, so the CPU does not have to wait for slower RAM.

**Virtual memory:** part of the secondary storage used as if it were RAM when the real RAM is full.
:::

![The memory hierarchy drawn as a pyramid: registers inside the CPU at the top are the fastest and smallest; below them come cache memory, then main memory (RAM), then secondary storage such as SSDs and hard disks, and at the bottom offline and cloud storage such as USB drives, DVDs and online storage, which are the largest and cheapest per gigabyte but the slowest](https://wasscetutor.com/img/ict/memory-hierarchy.svg)

*Figure 1. The memory hierarchy: speed, size and cost. WASSCE Tutor diagram.*

Going **up** the hierarchy, memory is **faster** and **dearer** per gigabyte; going **down**, it is **larger** and **cheaper**. A computer uses a little of each fast type and a lot of the cheap types.

## Secondary storage devices

:::callout{type=definition}
**Storage device:** hardware that holds data permanently, such as a hard disk drive. The disk, disc or card on which the data is actually held is the **storage medium**.

**Storage capacity:** the amount of data a storage device can hold, measured in bytes, such as megabytes (MB), gigabytes (GB) and terabytes (TB).
:::

### Magnetic storage

- **Hard disk drive (HDD):** rigid metal platters coated with magnetic material spin at high speed while **read/write heads** move over them. Large capacity (500 GB to several TB) and cheap per gigabyte, but has moving parts, so it can be damaged if dropped.
- **Magnetic tape:** data is stored along a long tape and read **in order (sequential access)**; very cheap for huge amounts of data, so it is used for **backups** and archives by large organisations.
- **Floppy disk:** an old, small removable magnetic disk holding only 1.44 MB; no longer used.

### Optical storage

Data is written and read with a **laser** on a shiny disc.

| Disc | Typical capacity |
|---|---|
| **CD** (compact disc) | about **700 MB** |
| **DVD** (digital versatile disc) | **4.7 GB** (single layer) |
| **Blu-ray disc** | **25 GB** (single layer) |

- **-ROM** discs (CD-ROM, DVD-ROM) can only be read; **-R** discs can be written once; **-RW** discs can be written, erased and rewritten.

### Solid-state (flash) storage

Uses **flash memory** chips with **no moving parts**.

- **Solid-state drive (SSD):** replaces a hard disk inside a computer; much faster start-up and loading, silent, uses less power and survives knocks better, but costs more per gigabyte.
- **USB flash drive (pen drive):** small, portable, plugs into a USB port.
- **Memory card (SD, microSD):** used in phones, cameras and tablets.

### Cloud storage

:::callout{type=definition}
**Cloud storage:** keeping files on servers owned by a company and reached over the Internet, such as Google Drive, OneDrive, iCloud or Dropbox.
:::

Files in the cloud can be reached from any device and are safe if your phone is lost, but you need an Internet connection, the space beyond a free limit costs money, and you must trust the company with your data.

## Comparing storage devices

| Device | Type | Moving parts? | Speed | Portable? |
|---|---|---|---|---|
| Hard disk | magnetic | yes | medium | external ones only |
| Magnetic tape | magnetic | yes | slow (sequential) | yes |
| CD / DVD / Blu-ray | optical | yes (the drive) | slow | yes |
| SSD | solid-state | no | fast | external ones only |
| Flash drive, memory card | solid-state | no | medium–fast | very |
| Cloud | online servers | — | depends on the Internet | anywhere with the Internet |

When choosing, think about **capacity, speed, cost, portability, durability** and whether the data must be **rewritten**.

:::callout{type=local-example}
**Storage you use every day.** Your phone's internal storage and microSD card are flash memory; the flash drive you carry to a cyber café to print a document is a solid-state device; and photos backed up to Google Photos are in cloud storage, safe even if the phone is lost.
:::

:::callout{type=common-mistake}
**Saying "my phone has 128 GB of memory" when you mean storage.** The 128 GB is **storage** (flash), where apps and photos are kept. The phone's **RAM** is much smaller, such as 4 GB or 8 GB, and holds only what is running now.
:::

## Practice

:::reveal{title="1. State three differences between RAM and ROM."}
Any three: RAM is **volatile**, ROM is **non-volatile**; RAM can be **read and written**, ROM can only be **read**; RAM holds programs and data **in use**, ROM holds **start-up instructions** (BIOS); RAM's contents change, ROM's are fixed; RAM is usually larger.
:::

:::reveal{title="2. What is meant by volatile memory? Give an example."}
Memory that **loses its contents when the power is switched off**. Example: **RAM**.
:::

:::reveal{title="3. Explain the purpose of cache memory."}
Cache is a small, very **fast memory close to the CPU** that holds the data and instructions used most often, so the CPU does not have to wait for slower main memory; this **speeds up** processing.
:::

:::reveal{title="4. Classify these as magnetic, optical or solid-state: DVD, flash drive, hard disk, SSD, magnetic tape, Blu-ray."}
**Magnetic:** hard disk, magnetic tape. **Optical:** DVD, Blu-ray. **Solid-state:** flash drive, SSD.
:::

:::reveal{title="5. State two advantages of an SSD over a hard disk drive."}
Any two: **faster** start-up and loading; **no moving parts**, so it is more durable if knocked; **silent**; uses **less power**; lighter.
:::

## Key points

- **Primary memory** (RAM, ROM, cache) is used directly by the CPU; **secondary storage** keeps data permanently.
- **RAM**: volatile, read/write, holds programs in use (DRAM, SRAM). **ROM**: non-volatile, read-only, holds start-up instructions (PROM, EPROM, EEPROM).
- **Cache** is fast memory near the CPU; **virtual memory** uses storage as extra RAM.
- **Memory hierarchy**: registers → cache → RAM → secondary storage → offline/cloud; faster and dearer at the top.
- Storage: **magnetic** (hard disk, tape), **optical** (CD 700 MB, DVD 4.7 GB, Blu-ray 25 GB), **solid-state** (SSD, flash drive, memory card), **cloud**.

## WASSCE examination focus

:::callout{type=waec-tests}
Memory and storage questions often require you to state the differences between RAM and ROM, to explain volatile and non-volatile memory, to name types of ROM, to explain cache memory, to classify storage devices as magnetic, optical or solid-state, to compare primary and secondary storage, and to give the capacity of a CD or DVD. When comparing, set the two side by side in a table, point for point.
:::
