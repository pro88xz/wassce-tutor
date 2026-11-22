#!/usr/bin/env python3
"""Original diagrams for the ICT / Computer Studies notes.

    python3 scripts/notes/ict_figs.py            # write every diagram
    python3 scripts/notes/ict_figs.py name ...   # write some

Each function draws one figure and returns an Svg. Files go to
public/img/ict/<name>.svg and lessons show them from
https://wasscetutor.com/img/ict/<name>.svg. All drawn by WASSCE Tutor.
"""

from __future__ import annotations

import itertools
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from svgfig import (  # noqa: E402
    BLUE, F_AMBER, F_BLUE, F_GREEN, F_GREY, F_PURPLE, F_RED, GREEN, INK, MUTED,
    ORANGE, PURPLE, RED, TEAL, Svg,
)

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/img/ict"
FIGS: dict[str, callable] = {}
F_TEAL = "#ccfbf1"
GRID_C = "#cbd5e1"


def fig(fn):
    FIGS[fn.__name__.replace("_", "-")] = fn
    return fn


def title(s: Svg, t, y=30, size=18):
    s.text(s.w / 2, y, t, size=size, color=MUTED)


def box(s: Svg, cx, cy, w, h, lines, col=INK, fill=F_GREY, size=16, bold_first=True, rx=12):
    """A rounded box centred on (cx, cy) with one or more lines of text."""
    if isinstance(lines, str):
        lines = [lines]
    s.rect(cx - w / 2, cy - h / 2, w, h, fill=fill, stroke=col, width=2.5, rx=rx)
    n = len(lines)
    for i, ln in enumerate(lines):
        y = cy + (i - (n - 1) / 2) * (size + 6)
        s.text(cx, y, ln, size=size if (i == 0 or not bold_first) else size - 2,
               weight="bold" if (i == 0 and bold_first) else "normal", color=col if i == 0 else INK)
    return (cx, cy, w, h)


def link(s: Svg, a, b, color=MUTED, width=2.5, gap=6):
    """Arrow from the edge of box a to the edge of box b (boxes as returned by box())."""
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    dx, dy = bx - ax, by - ay
    if abs(dx) * ah > abs(dy) * aw:  # leave through left/right
        sx, sy = ax + math.copysign(aw / 2 + gap, dx), ay
        ex, ey = bx - math.copysign(bw / 2 + gap, dx), by
    else:
        sx, sy = ax, ay + math.copysign(ah / 2 + gap, dy)
        ex, ey = bx, by - math.copysign(bh / 2 + gap, dy)
    s.arrow(sx, sy, ex, ey, color=color, width=width)


def tree(s: Svg, parent, children, color=MUTED, drop=22):
    """Elbow connectors from the bottom of a parent box to the tops of its children."""
    px, py, pw, ph = parent
    y_mid = py + ph / 2 + drop
    s.line(px, py + ph / 2 + 4, px, y_mid, color=color, width=2.5)
    xs = [c[0] for c in children]
    s.line(min(xs + [px]), y_mid, max(xs + [px]), y_mid, color=color, width=2.5)
    for cx, cy, cw, ch in children:
        s.arrow(cx, y_mid, cx, cy - ch / 2 - 6, color=color, width=2.5)


# ═══ Computer fundamentals ══════════════════════════════════════════════════

@fig
def computer_generations():
    s = Svg(700, 690, "The generations of computers",
            "A timeline. Before the 1940s, mechanical devices: the abacus, Napier's bones, Pascal's calculator and "
            "Babbage's Analytical Engine. First generation, 1940s to 1956: vacuum tubes, for example ENIAC and UNIVAC I. "
            "Second generation, 1956 to 1963: transistors, for example the IBM 1401. Third generation, 1964 to 1971: "
            "integrated circuits, for example the IBM System/360. Fourth generation, 1971 to today: microprocessors, for "
            "example the IBM PC, laptops and smartphones. Fifth generation, today and the future: artificial intelligence.")
    title(s, "From mechanical calculators to artificial intelligence")
    rows = [
        ("Before 1940s", "Mechanical era", "gears, levers, punched cards", "abacus, Pascaline, Analytical Engine", MUTED, F_GREY),
        ("1940s–1956", "1st generation", "vacuum tubes", "ENIAC (1946), UNIVAC I (1951)", RED, F_RED),
        ("1956–1963", "2nd generation", "transistors", "IBM 1401", ORANGE, F_AMBER),
        ("1964–1971", "3rd generation", "integrated circuits (ICs)", "IBM System/360", GREEN, F_GREEN),
        ("1971–today", "4th generation", "microprocessors (VLSI)", "IBM PC (1981), laptops, smartphones", BLUE, F_BLUE),
        ("Today →", "5th generation", "artificial intelligence (AI)", "voice assistants, machine learning", PURPLE, F_PURPLE),
    ]
    x_line = 150
    top, step = 85, 100
    s.line(x_line, top - 10, x_line, top + step * (len(rows) - 1) + 10, color=MUTED, width=4)
    for i, (years, gen, tech, eg, col, fill) in enumerate(rows):
        y = top + i * step
        s.circle(x_line, y, 11, fill=col, stroke=col, width=2)
        s.text(x_line - 22, y, years, size=16, color=col, anchor="end", weight="bold")
        s.rect(x_line + 30, y - 38, 500, 76, fill=fill, stroke=col, width=2.5, rx=12)
        s.text(x_line + 48, y - 16, gen, size=18, color=col, anchor="start", weight="bold")
        s.text(x_line + 230, y - 16, tech, size=16, color=INK, anchor="start", weight="bold")
        s.text(x_line + 48, y + 16, eg, size=15, color=INK, anchor="start")
    s.arrow(60, 640, 640, 640, color=TEAL, width=3)
    s.text(350, 665, "each generation: smaller, faster, cheaper, more reliable, less power", size=16, color=TEAL)
    return s


@fig
def classification_of_computers():
    s = Svg(780, 440, "The classification of computers",
            "Computers are classified in three ways. By type (how they handle data): analogue, digital and hybrid. "
            "By size and power: supercomputer, mainframe, minicomputer and microcomputer. "
            "By purpose: general-purpose and special-purpose.")
    root = box(s, 390, 45, 230, 50, "Computers", BLUE, F_BLUE, size=20)
    cols = [
        (130, "By type", ORANGE, F_AMBER, ["analogue", "digital", "hybrid"]),
        (390, "By size", GREEN, F_GREEN, ["supercomputer", "mainframe", "minicomputer", "microcomputer"]),
        (650, "By purpose", PURPLE, F_PURPLE, ["general-purpose", "special-purpose"]),
    ]
    heads = [box(s, x, 140, 200, 46, t, c, f, size=18) for x, t, c, f, _ in cols]
    tree(s, root, heads)
    for (x, _, col, fill, items), head in zip(cols, heads):
        for j, t in enumerate(items):
            b = box(s, x, 215 + j * 50, 190, 38, t, INK, "#ffffff", size=15, bold_first=False)
            if j == 0:
                link(s, head, b, color=col)
            else:
                s.line(x, 215 + (j - 1) * 50 + 19, x, 215 + j * 50 - 19, color=col, width=2.5)
    s.text(390, 420, "Microcomputers include desktops, laptops, tablets and smartphones.", size=15, color=MUTED)
    return s


@fig
def data_processing_cycle():
    s = Svg(760, 470, "The data processing cycle",
            "Raw data is collected, then input into the computer, processed and output as information. Processing "
            "reads data from storage and saves results to it. Feedback from the output goes back to the input so that "
            "mistakes can be corrected and the cycle repeated.")
    title(s, "Data in, information out")
    col = box(s, 95, 160, 150, 76, ["Collection", "gather the", "raw data"], MUTED, F_GREY, size=16)
    inp = box(s, 285, 160, 150, 76, ["Input", "enter it into", "the computer"], ORANGE, F_AMBER, size=16)
    pro = box(s, 475, 160, 150, 76, ["Processing", "calculate, sort,", "compare"], BLUE, F_BLUE, size=16)
    out = box(s, 665, 160, 150, 76, ["Output", "information:", "screen, print"], GREEN, F_GREEN, size=16)
    link(s, col, inp)
    link(s, inp, pro)
    link(s, pro, out)
    sto = box(s, 475, 310, 190, 64, ["Storage", "save data and results"], PURPLE, F_PURPLE, size=16)
    s.line(475, 204, 475, 272, color=PURPLE, width=3, arrow="both")
    s.polyline([(665, 204), (665, 420), (285, 420), (285, 206)], color=TEAL, width=3, arrow="end")
    s.label(380, 420, "feedback: check the output, correct and repeat", size=15, color=TEAL)
    return s


@fig
def data_hierarchy():
    s = Svg(700, 470, "The data hierarchy",
            "Data is organised in levels, each made of the one below. A bit is a 0 or a 1. A byte is 8 bits and "
            "holds one character, such as A. A field is one item of data, such as a surname. A record is all the "
            "fields about one person or thing, such as one student. A file is a set of related records, such as every "
            "student in a class. A database is a set of related files, such as students, fees and results.")
    title(s, "From a single bit to a database")
    levels = [
        ("Database", "related files: students, fees, results", PURPLE, F_PURPLE),
        ("File", "related records: every student in SSS3", BLUE, F_BLUE),
        ("Record", "one student: ID, surname, class, age", GREEN, F_GREEN),
        ("Field", "one item: Surname = Kamara", TEAL, F_TEAL),
        ("Byte", "8 bits = one character, such as A", ORANGE, F_AMBER),
        ("Bit", "a single 0 or 1", RED, F_RED),
    ]
    for i, (name, eg, col, fill) in enumerate(levels):
        w = 300 + i * 60
        y = 62 + i * 64
        s.rect(350 - w / 2, y, w, 52, fill=fill, stroke=col, width=2.5, rx=10)
        s.text(350, y + 17, name, size=18, color=col, weight="bold")
        s.text(350, y + 37, eg, size=14, color=INK)
    s.arrow(40, 440, 40, 70, color=MUTED, width=3)
    s.text(52, 80, "larger", size=14, color=MUTED, anchor="start")
    return s


# ═══ Number systems ═════════════════════════════════════════════════════════

@fig
def decimal_to_binary():
    s = Svg(620, 470, "Converting 25 to binary by repeated division by 2",
            "Divide 25 by 2 again and again, writing each remainder: 25 divided by 2 is 12 remainder 1; 12 divided by 2 "
            "is 6 remainder 0; 6 divided by 2 is 3 remainder 0; 3 divided by 2 is 1 remainder 1; 1 divided by 2 is 0 "
            "remainder 1. Read the remainders from the bottom up: 25 in decimal is 11001 in binary.")
    title(s, "25 in binary: divide by 2, keep the remainders")
    rows = [("2 | 25", "1"), ("2 | 12", "0"), ("2 | 6", "0"), ("2 | 3", "1"), ("2 | 1", "1"), ("0", "")]
    s.text(190, 70, "divide", size=16, color=MUTED, weight="bold")
    s.text(360, 70, "remainder", size=16, color=MUTED, weight="bold")
    for i, (div, rem) in enumerate(rows):
        y = 110 + i * 52
        s.text(190, y, div, size=24, color=INK)
        if rem:
            s.rect(330, y - 20, 60, 40, fill=F_AMBER, stroke=ORANGE, width=2, rx=8)
            s.text(360, y, rem, size=24, color=ORANGE, weight="bold")
    s.arrow(450, 318, 450, 100, color=BLUE, width=4)
    s.text(470, 200, "read", size=17, color=BLUE, anchor="start", weight="bold")
    s.text(470, 222, "upwards", size=17, color=BLUE, anchor="start", weight="bold")
    s.rect(130, 400, 360, 50, fill=F_BLUE, stroke=BLUE, width=2.5, rx=10)
    s.text(310, 425, "25₁₀ = 11001₂", size=26, color=BLUE, weight="bold")
    return s


@fig
def binary_place_values():
    s = Svg(700, 330, "Converting the binary number 10011101 to decimal",
            "Write the place values 128, 64, 32, 16, 8, 4, 2 and 1 above the eight bits 1 0 0 1 1 1 0 1. Add the "
            "place values where the bit is 1: 128 + 16 + 8 + 4 + 1 = 157. So 10011101 in binary is 157 in decimal.")
    title(s, "Binary place values double from right to left")
    places = [128, 64, 32, 16, 8, 4, 2, 1]
    bits = "10011101"
    x0, w = 60, 72
    for i, (p, b) in enumerate(zip(places, bits)):
        x = x0 + i * w
        on = b == "1"
        s.rect(x, 60, w - 8, 46, fill=F_GREY, stroke=MUTED, width=2, rx=8)
        s.text(x + (w - 8) / 2, 83, f"2^{7 - i}" if False else str(p), size=20, color=MUTED, weight="bold")
        s.rect(x, 116, w - 8, 56, fill=F_GREEN if on else "#ffffff", stroke=GREEN if on else MUTED, width=2.5, rx=8)
        s.text(x + (w - 8) / 2, 144, b, size=28, color=GREEN if on else MUTED, weight="bold")
    s.text(x0 - 12, 83, "value", size=14, color=MUTED, anchor="end")
    s.text(x0 - 12, 144, "bit", size=14, color=MUTED, anchor="end")
    s.text(350, 215, "add the values where the bit is 1:", size=17, color=INK)
    s.rect(110, 245, 480, 54, fill=F_BLUE, stroke=BLUE, width=2.5, rx=10)
    s.text(350, 272, "128 + 16 + 8 + 4 + 1 = 157", size=24, color=BLUE, weight="bold")
    return s


@fig
def binary_octal_hex():
    s = Svg(720, 400, "Grouping binary digits to convert to octal and hexadecimal",
            "For octal, group the bits in threes from the right: 10 011 101 gives 2, 3 and 5, so 10011101 in binary "
            "is 235 in octal. For hexadecimal, group the bits in fours: 1001 1101 gives 9 and 13, and 13 is D, so "
            "10011101 in binary is 9D in hexadecimal.")
    title(s, "10011101₂ in octal and in hexadecimal")
    s.text(170, 95, "Octal:", size=18, color=ORANGE, anchor="end", weight="bold")
    s.text(170, 120, "groups of 3", size=14, color=MUTED, anchor="end")
    groups8 = [("10", "2"), ("011", "3"), ("101", "5")]
    x = 195
    for g, d in groups8:
        w = 26 * len(g) + 24
        s.rect(x, 70, w, 50, fill=F_AMBER, stroke=ORANGE, width=2.5, rx=8)
        s.text(x + w / 2, 95, g, size=24, color=INK, weight="bold")
        s.arrow(x + w / 2, 126, x + w / 2, 152, color=ORANGE, width=2.5)
        s.text(x + w / 2, 172, d, size=26, color=ORANGE, weight="bold")
        x += w + 18
    s.text(x + 30, 172, "= 235₈", size=24, color=ORANGE, anchor="start", weight="bold")
    s.text(170, 255, "Hexadecimal:", size=18, color=BLUE, anchor="end", weight="bold")
    s.text(170, 280, "groups of 4", size=14, color=MUTED, anchor="end")
    groups16 = [("1001", "9"), ("1101", "D (13)")]
    x = 195
    for g, d in groups16:
        w = 26 * len(g) + 24
        s.rect(x, 230, w, 50, fill=F_BLUE, stroke=BLUE, width=2.5, rx=8)
        s.text(x + w / 2, 255, g, size=24, color=INK, weight="bold")
        s.arrow(x + w / 2, 286, x + w / 2, 312, color=BLUE, width=2.5)
        s.text(x + w / 2, 332, d, size=24, color=BLUE, weight="bold")
        x += w + 18
    s.text(x + 30, 332, "= 9D₁₆", size=24, color=BLUE, anchor="start", weight="bold")
    s.text(360, 380, "Hex digits after 9: A = 10, B = 11, C = 12, D = 13, E = 14, F = 15", size=15, color=MUTED)
    return s


# ═══ Hardware ═══════════════════════════════════════════════════════════════

@fig
def computer_system_block_diagram():
    s = Svg(780, 520, "Block diagram of a computer system",
            "Data enters through input devices into the central processing unit. The CPU contains the control unit, "
            "the arithmetic and logic unit and registers. The CPU exchanges data and instructions with main memory "
            "(RAM and ROM) and with secondary storage. Results go to output devices. The control unit sends control "
            "signals to every part, and the parts are joined by the data, address and control buses.")
    title(s, "Input → processing → output, with storage")
    cpu_x, cpu_y, cpu_w, cpu_h = 250, 70, 280, 260
    s.rect(cpu_x, cpu_y, cpu_w, cpu_h, fill=F_BLUE, stroke=BLUE, width=3, rx=16)
    s.text(cpu_x + cpu_w / 2, cpu_y + 26, "Central Processing Unit (CPU)", size=17, color=BLUE, weight="bold")
    cu = box(s, 390, 140, 220, 56, ["Control Unit (CU)", "directs and coordinates"], BLUE, "#ffffff", size=15)
    alu = box(s, 390, 215, 220, 56, ["Arithmetic & Logic Unit", "calculates and compares"], BLUE, "#ffffff", size=15)
    box(s, 390, 290, 220, 44, "Registers", BLUE, "#ffffff", size=15)
    s.line(390, 168, 390, 186, color=BLUE, width=2.5)
    inp = box(s, 105, 200, 170, 76, ["Input devices", "keyboard, mouse,", "scanner"], ORANGE, F_AMBER, size=15)
    out = box(s, 675, 200, 170, 76, ["Output devices", "monitor, printer,", "speakers"], GREEN, F_GREEN, size=15)
    s.arrow(192, 200, cpu_x - 6, 200, color=ORANGE, width=3)
    s.arrow(cpu_x + cpu_w + 6, 200, 588, 200, color=GREEN, width=3)
    mem = box(s, 280, 420, 230, 70, ["Main memory", "RAM and ROM"], PURPLE, F_PURPLE, size=16)
    sto = box(s, 540, 420, 230, 70, ["Secondary storage", "SSD, hard disk, USB"], TEAL, F_TEAL, size=16)
    s.line(330, cpu_y + cpu_h + 6, 330, 378, color=PURPLE, width=3, arrow="both")
    s.polyline([(450, 360), (450, cpu_y + cpu_h + 6)], color=TEAL, width=3, arrow="end")
    s.line(450, 360, 540, 360, color=TEAL, width=3)
    s.line(540, 360, 540, 379, color=TEAL, width=3, arrow="end")
    s.text(390, 500, "Buses (data, address, control) carry signals between the parts.", size=15, color=MUTED)
    return s


@fig
def fetch_decode_execute():
    s = Svg(720, 470, "The fetch–decode–execute cycle",
            "The CPU repeats three steps for every instruction. Fetch: the address in the program counter is used to "
            "copy the next instruction from main memory into the instruction register, and the program counter goes up "
            "by one. Decode: the control unit works out what the instruction means. Execute: the instruction is "
            "carried out, for example by the ALU, and any result is stored. Then the cycle starts again.")
    title(s, "The machine cycle, repeated for every instruction")
    fetch = box(s, 360, 120, 330, 110, ["1. Fetch", "copy the next instruction from", "main memory into the CPU", "(using the program counter)"], ORANGE, F_AMBER, size=16)
    dec = box(s, 560, 340, 270, 92, ["2. Decode", "the control unit works out", "what the instruction means"], BLUE, F_BLUE, size=16)
    exe = box(s, 160, 340, 270, 92, ["3. Execute", "carry it out (the ALU)", "and store any result"], GREEN, F_GREEN, size=16)
    s.arrow(470, 182, 545, 288, color=MUTED, width=3)
    s.arrow(418, 340, 302, 340, color=MUTED, width=3)
    s.arrow(175, 288, 250, 182, color=MUTED, width=3)
    s.text(360, 262, "repeat for the", size=16, color=MUTED, weight="bold")
    s.text(360, 284, "next instruction", size=16, color=MUTED, weight="bold")
    return s


@fig
def keyboard_key_groups():
    s = Svg(780, 420, "The groups of keys on a computer keyboard",
            "A simplified keyboard. Function keys F1 to F12 run along the top. The alphanumeric keys (letters, numbers "
            "and symbols) are in the main block, with the Space bar. Modifier and special keys such as Shift, Ctrl, "
            "Alt, Tab, Caps Lock, Enter and Backspace are at the edges of the main block. The cursor (arrow) keys and "
            "editing keys such as Insert, Delete, Home and End are to the right. The numeric keypad is on the far right.")
    title(s, "Five groups of keys", y=26)
    # function keys
    for i in range(12):
        s.rect(40 + i * 40, 50, 34, 26, fill=F_PURPLE, stroke=PURPLE, width=1.8, rx=5)
        s.text(57 + i * 40, 63, f"F{i + 1}", size=11, color=PURPLE, weight="bold")
    s.rect(14, 50, 22, 26, fill=F_RED, stroke=RED, width=1.8, rx=5)
    s.text(25, 63, "Esc", size=8, color=RED)
    # alphanumeric block
    rows = ["1234567890", "QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"]
    offs = [56, 70, 82, 100]
    for r_i, (row, off) in enumerate(zip(rows, offs)):
        y = 92 + r_i * 42
        for k, ch in enumerate(row):
            x = off + k * 40
            s.rect(x, y, 36, 36, fill=F_AMBER, stroke=ORANGE, width=1.8, rx=5)
            s.text(x + 18, y + 18, ch, size=14, color=INK, weight="bold")
    mods = [(14, 134, 52, "Tab"), (14, 176, 64, "Caps"), (14, 218, 82, "Shift"), (14, 260, 56, "Ctrl"), (76, 260, 50, "Alt"),
            (452, 92, 70, "Back"), (444, 176, 78, "Enter"), (382, 218, 140, "Shift")]
    for x, y, w, t in mods:
        s.rect(x, y, w, 36, fill=F_RED, stroke=RED, width=1.8, rx=5)
        s.text(x + w / 2, y + 18, t, size=12, color=RED, weight="bold")
    s.rect(136, 260, 250, 36, fill=F_AMBER, stroke=ORANGE, width=1.8, rx=5)
    s.text(261, 278, "Space bar", size=13, color=INK, weight="bold")
    # editing and cursor keys
    for k, t in enumerate(["Ins", "Home", "Del", "End"]):
        x, y = 540 + (k % 2) * 44, 92 + (k // 2) * 42
        s.rect(x, y, 38, 36, fill=F_GREEN, stroke=GREEN, width=1.8, rx=5)
        s.text(x + 19, y + 18, t, size=10, color=GREEN, weight="bold")
    for x, y, t in [(562, 218, "↑"), (518, 260, "←"), (562, 260, "↓"), (606, 260, "→")]:
        s.rect(x, y, 38, 36, fill=F_GREEN, stroke=GREEN, width=1.8, rx=5)
        s.text(x + 19, y + 18, t, size=16, color=GREEN, weight="bold")
    # numeric keypad
    pad = ["789", "456", "123", "0 ."]
    for r_i, row in enumerate(pad):
        for k, ch in enumerate(row):
            if ch == " ":
                continue
            x, y = 660 + k * 38, 134 + r_i * 42
            w = 72 if (ch == "0") else 34
            s.rect(x, y, w, 36, fill=F_BLUE, stroke=BLUE, width=1.8, rx=5)
            s.text(x + w / 2, y + 18, ch, size=14, color=BLUE, weight="bold")
    # legend
    legend = [(PURPLE, F_PURPLE, "function keys"), (ORANGE, F_AMBER, "alphanumeric keys"), (RED, F_RED, "modifier & special keys"),
              (GREEN, F_GREEN, "cursor & editing keys"), (BLUE, F_BLUE, "numeric keypad")]
    for i, (col, fill, t) in enumerate(legend):
        x = 30 + (i % 3) * 250
        y = 340 + (i // 3) * 36
        s.rect(x, y - 11, 22, 22, fill=fill, stroke=col, width=2, rx=4)
        s.text(x + 32, y, t, size=15, color=INK, anchor="start")
    return s


@fig
def types_of_printers():
    s = Svg(760, 380, "Types of printers",
            "Printers are impact or non-impact. Impact printers strike an inked ribbon against the paper: dot-matrix, "
            "daisy-wheel and line printers; they are noisy but can print carbon copies. Non-impact printers do not "
            "touch the paper with a printing head: inkjet, laser and thermal printers, and 3D printers that build "
            "solid objects; they are quieter and give better quality.")
    root = box(s, 380, 45, 210, 50, "Printers", BLUE, F_BLUE, size=20)
    imp = box(s, 190, 140, 250, 60, ["Impact", "strike a ribbon on the paper"], ORANGE, F_AMBER, size=17)
    non = box(s, 570, 140, 250, 60, ["Non-impact", "no striking of the paper"], GREEN, F_GREEN, size=17)
    tree(s, root, [imp, non])
    for j, t in enumerate(["dot-matrix", "daisy-wheel", "line printer"]):
        b = box(s, 190, 225 + j * 48, 200, 38, t, INK, "#ffffff", size=15, bold_first=False)
        if j == 0:
            link(s, imp, b, color=ORANGE)
        else:
            s.line(190, 225 + (j - 1) * 48 + 19, 190, 225 + j * 48 - 19, color=ORANGE, width=2.5)
    for j, t in enumerate(["inkjet", "laser", "thermal", "3D printer"]):
        x = 500 + (j % 2) * 140
        y = 225 + (j // 2) * 48
        box(s, x, y, 126, 38, t, INK, "#ffffff", size=15, bold_first=False)
    s.line(570, 176, 570, 192, color=GREEN, width=2.5)
    s.line(500, 192, 640, 192, color=GREEN, width=2.5)
    for x in (500, 640):
        s.arrow(x, 192, x, 200, color=GREEN, width=2.5)
    s.text(190, 360, "noisy; can print carbon copies", size=14, color=ORANGE)
    s.text(570, 360, "quiet; high quality", size=14, color=GREEN)
    return s


@fig
def memory_hierarchy():
    s = Svg(800, 470, "The memory hierarchy",
            "A pyramid. At the top, registers inside the CPU: the fastest and smallest. Below them, cache memory, then "
            "main memory (RAM), then secondary storage such as SSDs and hard disks, and at the bottom offline and "
            "cloud storage such as USB drives, optical discs and online storage: the largest and cheapest per gigabyte "
            "but the slowest. Going up, memory is faster and dearer; going down, it is larger and cheaper.")
    title(s, "Fast and small at the top, large and cheap at the bottom")
    layers = [
        ("Registers", "inside the CPU", RED, F_RED),
        ("Cache", "between CPU and RAM", ORANGE, F_AMBER),
        ("Main memory (RAM)", "programs in use", BLUE, F_BLUE),
        ("Secondary storage", "SSD, hard disk", TEAL, F_TEAL),
        ("Offline & cloud storage", "USB drive, DVD, online", PURPLE, F_PURPLE),
    ]
    apex_x, top, h = 400, 60, 74
    for i, (name, note, col, fill) in enumerate(layers):
        y1, y2 = top + i * h, top + (i + 1) * h
        half1, half2 = 40 + i * 52, 40 + (i + 1) * 52
        s.polygon([(apex_x - half1, y1), (apex_x + half1, y1), (apex_x + half2, y2), (apex_x - half2, y2)], fill=fill, stroke=col, width=2.5)
        s.text(apex_x, y1 + h / 2 - 9, name, size=16, color=col, weight="bold")
        s.text(apex_x, y1 + h / 2 + 12, note, size=13, color=INK)
    s.arrow(770, 420, 770, 70, color=RED, width=3)
    for j, t in enumerate(("faster", "dearer", "per GB")):
        s.text(756, 100 + j * 22, t, size=15, color=RED, anchor="end", weight="bold")
    s.arrow(30, 70, 30, 420, color=TEAL, width=3)
    for j, t in enumerate(("larger", "cheaper")):
        s.text(44, 100 + j * 22, t, size=15, color=TEAL, anchor="start", weight="bold")
    return s


# ═══ Software and applications ══════════════════════════════════════════════

def items(s: Svg, spine_x, top_y, cx, w, rows, col, fill, h=48, step=56, size=15):
    """A vertical spine from top_y with one box per row, joined by short arrows."""
    ys = [top_y + 30 + i * step for i in range(len(rows))]
    s.line(spine_x, top_y, spine_x, ys[-1], color=MUTED, width=2.5)
    out = []
    for y, lines in zip(ys, rows):
        s.arrow(spine_x, y, cx - w / 2 - 6, y, color=MUTED, width=2.5)
        out.append(box(s, cx, y, w, h, lines, col, fill, size=size))
    return out


@fig
def types_of_software():
    s = Svg(820, 460, "Types of software",
            "Software is divided into system software, which runs and manages the computer, and application software, "
            "which does users' tasks. System software includes the operating system, utility programs, language "
            "translators and device drivers. Application software includes general-purpose packages such as word "
            "processors and spreadsheets, special-purpose software such as payroll programs, and bespoke (custom) "
            "software written for one organisation.")
    root = box(s, 410, 48, 200, 46, "Software", INK, F_GREY, size=20)
    sys_ = box(s, 215, 140, 300, 56, ["System software", "runs and manages the computer"], BLUE, F_BLUE, size=17)
    app = box(s, 605, 140, 300, 56, ["Application software", "does the user's tasks"], GREEN, F_GREEN, size=17)
    tree(s, root, [sys_, app])
    items(s, 85, 168, 240, 290, [
        ["Operating system", "Windows, Android, Linux, macOS"],
        ["Utility programs", "antivirus, backup, disk cleanup"],
        ["Language translators", "compiler, interpreter, assembler"],
        ["Device drivers", "printer and graphics drivers"],
    ], BLUE, "#ffffff")
    items(s, 475, 168, 630, 290, [
        ["General-purpose packages", "word processor, spreadsheet"],
        ["Special-purpose software", "payroll, school results, hotel booking"],
        ["Bespoke (custom) software", "written for one organisation"],
    ], GREEN, "#ffffff")
    s.text(630, 400, "packages are bought ready-made ('off the shelf');", size=14, color=MUTED)
    s.text(630, 422, "bespoke software is written to order", size=14, color=MUTED)
    return s


@fig
def operating_system_layers():
    s = Svg(840, 430, "Where the operating system sits",
            "Four layers, from top to bottom: the user, application software, the operating system and the hardware. "
            "Arrows run both ways between each pair of layers: the operating system sits between applications and "
            "the hardware. A side panel lists the functions of an operating system: managing the processor, memory, "
            "files and storage, and input and output devices, providing the user interface, and security.")
    layers = [("User", "gives commands, sees results", PURPLE, F_PURPLE),
              ("Application software", "word processor, browser, games", GREEN, F_GREEN),
              ("Operating system", "Windows, Android, Linux, macOS, iOS", BLUE, F_BLUE),
              ("Hardware", "CPU, memory, disks, keyboard, screen", ORANGE, F_AMBER)]
    ys = [60, 160, 260, 360]
    boxes = [box(s, 230, y, 380, 62, [n, d], c, f, size=18) for (n, d, c, f), y in zip(layers, ys)]
    for a, b in zip(boxes, boxes[1:]):
        x = a[0]
        s.arrow(x - 14, a[1] + 37, x - 14, b[1] - 37, color=MUTED, width=2.5)
        s.arrow(x + 14, b[1] - 37, x + 14, a[1] + 37, color=MUTED, width=2.5)
    s.rect(470, 60, 340, 330, fill="#ffffff", stroke=BLUE, width=2.5, rx=12)
    s.text(640, 92, "Functions of an operating system", size=17, color=BLUE, weight="bold")
    for i, t in enumerate(["manages the processor (tasks)", "manages memory (RAM)", "manages files and storage",
                           "controls input and output devices", "provides the user interface", "keeps the computer secure",
                           "reports errors"]):
        s.text(492, 136 + i * 38, "• " + t, size=16, color=INK, anchor="start")
    return s


@fig
def levels_of_programming_languages():
    s = Svg(820, 450, "Levels of programming languages",
            "Three levels. Machine language, the lowest, is written in binary such as 10110000 01100001 and runs "
            "directly on the CPU. Assembly language uses short mnemonics such as MOV and ADD and is turned into "
            "machine code by an assembler. High-level languages such as Python, Java, C and BASIC use English-like "
            "statements such as total = a + b and are turned into machine code by a compiler or an interpreter. "
            "Going up, languages are easier for people; going down, they are closer to the machine.")
    rows = [("High-level language", "Python, Java, C, BASIC, Pascal", "total = a + b", GREEN, F_GREEN, "compiler or interpreter"),
            ("Assembly language (low-level)", "mnemonics such as MOV, ADD, JMP", "ADD AX, BX", ORANGE, F_AMBER, "assembler"),
            ("Machine language (low-level)", "binary: 0s and 1s", "00000001 11011000", RED, F_RED, "")]
    ys = [75, 225, 375]
    bs = []
    for (name, note, code, col, fill, tr), y in zip(rows, ys):
        b = box(s, 310, y, 440, 104, [], col, fill)
        s.text(310, y - 32, name, size=18, color=col, weight="bold")
        s.text(310, y - 8, note, size=15, color=INK)
        s.rect(118, y + 12, 384, 28, fill="#ffffff", stroke=col, width=1.5, rx=5)
        s.raw(f'<text x="310" y="{y + 26}" font-size="15" fill="{INK}" text-anchor="middle" dominant-baseline="middle" '
              f'font-family="Consolas, Courier New, monospace">{code}</text>')
        bs.append((b, tr))
    for (a, tr), (b, _) in zip(bs, bs[1:]):
        s.arrow(310, a[1] + 56, 310, b[1] - 56, color=MUTED, width=3)
        s.label(310 + 12, (a[1] + b[1]) / 2, tr, size=14, color=MUTED, anchor="start")
    s.arrow(600, 420, 600, 30, color=GREEN, width=3)
    s.text(616, 60, "easier for people", size=15, color=GREEN, anchor="start", weight="bold")
    s.text(616, 82, "to read and write", size=15, color=GREEN, anchor="start", weight="bold")
    s.arrow(780, 30, 780, 420, color=RED, width=3)
    s.text(764, 370, "closer to the", size=15, color=RED, anchor="end", weight="bold")
    s.text(764, 392, "machine; faster", size=15, color=RED, anchor="end", weight="bold")
    return s


@fig
def compiler_vs_interpreter():
    s = Svg(880, 440, "Compiler, interpreter and assembler",
            "Three translators. A compiler translates the whole high-level source program into machine code (object "
            "code) in one go, and reports all errors together; the object code can then be run any number of times "
            "without the compiler. An interpreter translates and runs a high-level program one line at a time and "
            "stops at the first error; it is needed every time the program runs. An assembler translates assembly "
            "language into machine code.")
    rows = [
        ("Source program", "(high-level)", "Compiler", "translates the whole program at once", "Object code", "(machine code): run any time", BLUE, F_BLUE),
        ("Source program", "(high-level)", "Interpreter", "translates and runs line by line", "Results, line by line", "stops at the first error", ORANGE, F_AMBER),
        ("Assembly program", "(mnemonics)", "Assembler", "translates assembly language", "Machine code", "runs on the CPU", PURPLE, F_PURPLE),
    ]
    for i, (a1, a2, t1, t2, o1, o2, col, fill) in enumerate(rows):
        y = 75 + i * 130
        a = box(s, 125, y, 200, 66, [a1, a2], INK, F_GREY, size=17)
        t = box(s, 440, y, 290, 66, [t1, t2], col, fill, size=18)
        o = box(s, 755, y, 220, 66, [o1, o2], GREEN, F_GREEN, size=17)
        link(s, a, t)
        link(s, t, o)
    s.text(440, 420, "All three turn a program into machine code, the only language the CPU understands.", size=15, color=MUTED)
    return s


@fig
def booting_process():
    s = Svg(660, 520, "The booting process",
            "Five steps from switching on to a ready computer: 1, power on: the power supply starts and the CPU runs "
            "the BIOS or UEFI firmware stored in ROM; 2, the power-on self-test (POST) checks the memory, keyboard "
            "and disks; 3, the BIOS finds a boot device such as the hard disk or SSD; 4, the boot loader loads the "
            "operating system's core (the kernel) into RAM; 5, the operating system finishes starting and shows the "
            "log-in screen or desktop.")
    steps = [("1. Power on", "the CPU starts the BIOS/UEFI firmware stored in ROM"),
             ("2. Power-on self-test (POST)", "checks memory, keyboard and disks; a beep if a fault"),
             ("3. Find the boot device", "the BIOS looks for the OS on the SSD, hard disk or USB"),
             ("4. Load the operating system", "the boot loader copies the OS kernel into RAM"),
             ("5. Ready", "the OS shows the log-in screen, then the desktop")]
    cols = [(PURPLE, F_PURPLE), (RED, F_RED), (ORANGE, F_AMBER), (BLUE, F_BLUE), (GREEN, F_GREEN)]
    prev = None
    for i, ((t, d), (c, f)) in enumerate(zip(steps, cols)):
        b = box(s, 330, 55 + i * 102, 560, 66, [t, d], c, f, size=18)
        if prev:
            link(s, prev, b)
        prev = b
    return s


@fig
def desktop_elements():
    s = Svg(1000, 490, "Parts of the desktop",
            "A computer desktop. Icons such as This PC, Recycle Bin and Documents sit on the background (wallpaper). "
            "An open window has a title bar with minimise, maximise and close buttons. Along the bottom is the "
            "taskbar, with the Start button at the left, buttons for open and pinned programs, and the notification "
            "area with the clock at the right. A mouse pointer is on the screen.")
    s.raw('<g transform="translate(24 0)">')
    x0, y0, x1, y1 = 190, 30, 750, 430
    s.rect(x0, y0, x1 - x0, y1 - y0, fill="#e0f2fe", stroke=INK, width=3, rx=6)
    for i, name in enumerate(["This PC", "Recycle Bin", "Documents"]):
        y = 60 + i * 82
        s.rect(x0 + 32, y, 44, 36, fill=F_AMBER if i == 2 else "#ffffff", stroke=BLUE, width=2, rx=4)
        s.text(x0 + 54, y + 52, name, size=13, color=INK)
    wx0, wy0, wx1, wy1 = 350, 80, 710, 320
    s.rect(wx0, wy0, wx1 - wx0, wy1 - wy0, fill="#ffffff", stroke=INK, width=2.5, rx=4)
    s.rect(wx0, wy0, wx1 - wx0, 30, fill=BLUE, stroke=INK, width=2.5, rx=4)
    s.text(wx0 + 12, wy0 + 15, "My Letter – Word processor", size=13, color="#ffffff", anchor="start")
    for j, sym in enumerate(["–", "□", "×"]):
        s.text(wx1 - 66 + j * 22, wy0 + 15, sym, size=15, color="#ffffff", weight="bold")
    for k in range(6):
        s.rect(wx0 + 24, wy0 + 56 + k * 30, 260 - (k % 3) * 40, 8, fill=F_GREY, stroke="none", width=0, rx=3)
    px, py = 620, 352
    s.polygon([(px, py), (px, py + 28), (px + 7, py + 21), (px + 13, py + 34), (px + 18, py + 32), (px + 12, py + 19), (px + 22, py + 19)],
              fill="#ffffff", stroke=INK, width=2)
    ty = y1 - 40
    s.rect(x0, ty, x1 - x0, 40, fill="#1e293b", stroke=INK, width=3)
    s.rect(x0 + 8, ty + 7, 34, 26, fill=BLUE, stroke="none", width=0, rx=4)
    for j in range(4):
        s.rect(x0 + 60 + j * 40, ty + 8, 30, 24, fill="#475569" if j else "#94a3b8", stroke="none", width=0, rx=3)
    s.text(x1 - 92, ty + 20, "ENG", size=12, color="#ffffff")
    s.text(x1 - 40, ty + 20, "10:45", size=13, color="#ffffff")

    def lead(pts, t, anchor):
        s.polyline(pts, color=MUTED, width=1.8)
        s.dot(*pts[0], r=4, color=RED)
        lx, ly = pts[-1]
        dx = {"start": 8, "end": -8}.get(anchor, 0)
        dy = 14 if anchor == "middle" else 0
        s.text(lx + dx, ly + dy, t, size=15, color=INK, anchor=anchor)

    lead([(x0 + 32, 78), (x0 - 20, 78)], "Desktop icons", "end")
    lead([(x0 + 60, 330), (x0 - 20, 330)], "Wallpaper (background)", "end")
    lead([(580, wy0 + 4), (600, wy0 - 16), (770, wy0 - 16)], "Title bar", "start")
    lead([(wx1 - 22, wy0 + 15), (770, wy0 + 30)], "Minimise, maximise, close", "start")
    lead([(wx1, 220), (770, 220)], "Window", "start")
    lead([(px + 22, py + 19), (770, py + 19)], "Mouse pointer", "start")
    lead([(x0 + 25, ty + 32), (x0 + 25, 448)], "Start button", "middle")
    lead([(x0 + 195, ty + 32), (x0 + 195, 448)], "Taskbar (open programs)", "middle")
    lead([(x1 - 40, ty + 32), (x1 - 40, 448)], "Notification area and clock", "middle")
    s.raw("</g>")
    return s


@fig
def folder_tree():
    s = Svg(820, 520, "Folders and files on a drive",
            "A folder tree, as shown in a file manager. The drive Local Disk (C:) is the root. It contains the folders "
            "Program Files, Users and Windows. Users contains the folder Aminata, which contains Documents and "
            "Pictures. Documents contains School, which contains SSS3, which holds the files ICT notes.docx and "
            "Maths results.xlsx. Pictures holds graduation.jpg. The path to the ICT notes file is "
            "C:\\Users\\Aminata\\Documents\\School\\SSS3\\ICT notes.docx.")
    rows = [(0, "Local Disk (C:)", "drive"), (1, "Program Files", "folder"), (1, "Users", "folder"),
            (2, "Aminata", "folder"), (3, "Documents", "folder"), (4, "School", "folder"), (5, "SSS3", "folder"),
            (6, "ICT notes.docx", "file"), (6, "Maths results.xlsx", "file"), (3, "Pictures", "folder"),
            (4, "graduation.jpg", "file"), (1, "Windows", "folder")]
    X0, Y0, IND, STEP = 50, 50, 34, 34
    pos = []
    last_child_y: dict[int, float] = {}
    parents: list[int] = []
    for i, (lvl, name, kind) in enumerate(rows):
        x, y = X0 + lvl * IND, Y0 + i * STEP
        pos.append((x, y))
        while parents and rows[parents[-1]][0] >= lvl:
            parents.pop()
        if parents:
            p = parents[-1]
            px, py = pos[p]
            s.line(px + 10, y, x - 2, y, color=MUTED, width=1.8)
            last_child_y[p] = y
        if kind == "drive":
            s.rect(x - 2, y - 9, 26, 18, fill=F_GREY, stroke=INK, width=2, rx=3)
            s.dot(x + 18, y + 3, r=2.5, color=GREEN)
        elif kind == "folder":
            s.polygon([(x, y - 9), (x + 9, y - 9), (x + 12, y - 6), (x + 24, y - 6), (x + 24, y + 9), (x, y + 9)],
                      fill="#fcd34d", stroke=ORANGE, width=1.8)
        else:
            s.polygon([(x + 3, y - 11), (x + 15, y - 11), (x + 21, y - 5), (x + 21, y + 11), (x + 3, y + 11)],
                      fill="#ffffff", stroke=BLUE, width=1.8)
        s.text(x + 32, y, name, size=16, color=INK if kind != "file" else BLUE, anchor="start",
               weight="bold" if kind == "drive" else "normal")
        parents.append(i)
    for p, y in last_child_y.items():
        px, py = pos[p]
        s.line(px + 10, py + 12, px + 10, y, color=MUTED, width=1.8)
    notes = [(0, "root directory (the drive)"), (5, "a subfolder: a folder inside a folder"), (7, "a file: name + extension"),
             (8, ".xlsx shows a spreadsheet file")]
    for i, t in notes:
        x, y = pos[i]
        s.arrow(560, y, x + 32 + len(rows[i][1]) * 8.8 + 10, y, color=RED, width=2)
        s.text(570, y, t, size=14, color=RED, anchor="start")
    s.rect(30, 455, 760, 44, fill=F_BLUE, stroke=BLUE, width=2, rx=8)
    s.text(46, 477, "Path:", size=15, color=BLUE, anchor="start", weight="bold")
    s.raw(f'<text x="100" y="477" font-size="15" fill="{INK}" text-anchor="start" dominant-baseline="middle" '
          'font-family="Consolas, Courier New, monospace">C:\\Users\\Aminata\\Documents\\School\\SSS3\\ICT notes.docx</text>')
    return s


def _window(s, x0, y0, x1, y1, title_text):
    s.rect(x0, y0, x1 - x0, y1 - y0, fill="#ffffff", stroke=INK, width=2.5, rx=6)
    s.rect(x0, y0, x1 - x0, 30, fill=BLUE, stroke=INK, width=2.5, rx=6)
    s.text(x0 + 14, y0 + 15, title_text, size=14, color="#ffffff", anchor="start")
    for j, sym in enumerate(["–", "□", "×"]):
        s.text(x1 - 70 + j * 22, y0 + 15, sym, size=15, color="#ffffff", weight="bold")


def _labels(s, lab, lx=652):
    for ly, t, px, py in lab:
        s.polyline([(px, py), (lx - 20, ly), (lx - 8, ly)], color=MUTED, width=1.8)
        s.dot(px, py, r=4, color=RED)
        s.text(lx, ly, t, size=15, color=INK, anchor="start")


@fig
def word_processor_window():
    s = Svg(880, 540, "Parts of a word processor window",
            "A word processor window. From the top: the title bar with the document's name and the minimise, maximise "
            "and close buttons; the menu tabs (File, Home, Insert, Layout, Review, View); the ribbon of command "
            "buttons in groups such as Clipboard, Font and Paragraph; the ruler showing margins and tabs; the "
            "document area, where text is typed at the flashing insertion point (cursor); the vertical scroll bar "
            "at the right; and the status bar at the bottom, showing the page number, word count and zoom.")
    x0, y0, x1, y1 = 30, 50, 610, 510
    _window(s, x0, y0, x1, y1, "Letter.docx – Word processor")
    for j, t in enumerate(["File", "Home", "Insert", "Layout", "Review", "View"]):
        s.text(x0 + 30 + j * 72, y0 + 46, t, size=14, color=BLUE if t == "Home" else INK, weight="bold" if t == "Home" else "normal")
    s.line(x0, y0 + 60, x1, y0 + 60, color=GRID_C, width=1.5)
    for j, (g, sym) in enumerate([("Clipboard", "Paste"), ("Font", "B  I  U"), ("Paragraph", "≡  ≡  ≡"), ("Styles", "Aa")]):
        gx = x0 + 14 + j * 140
        s.rect(gx, y0 + 66, 128, 52, fill=F_GREY, stroke=MUTED, width=1.2, rx=4)
        s.text(gx + 64, y0 + 84, sym, size=15, color=INK, weight="bold")
        s.text(gx + 64, y0 + 106, g, size=12, color=MUTED)
    ry = y0 + 126
    s.rect(x0 + 50, ry, 460, 16, fill="#ffffff", stroke=MUTED, width=1.2)
    for k in range(24):
        s.line(x0 + 54 + k * 19, ry + 16, x0 + 54 + k * 19, ry + (6 if k % 4 == 0 else 11), color=MUTED, width=1)
    s.rect(x0, ry + 22, x1 - x0, y1 - ry - 52, fill="#f1f5f9", stroke="none", width=0)
    s.rect(x0 + 70, ry + 34, 430, 270, fill="#ffffff", stroke=GRID_C, width=1.5)
    s.rect(x0 + 100, ry + 56, 180, 12, fill=INK, stroke="none", width=0, rx=3)
    for k in range(7):
        s.rect(x0 + 100, ry + 90 + k * 24, 370 - (60 if k in (3, 6) else 0), 8, fill=F_GREY, stroke="none", width=0, rx=3)
    cx_, cy_ = x0 + 100 + 310 + 4, ry + 90 + 6 * 24 + 4
    s.line(cx_, cy_ - 11, cx_, cy_ + 11, color=RED, width=2.5)
    s.rect(x1 - 22, ry + 26, 16, 290, fill=F_GREY, stroke=MUTED, width=1.2, rx=3)
    s.rect(x1 - 20, ry + 40, 12, 60, fill="#94a3b8", stroke="none", width=0, rx=3)
    sy = y1 - 28
    s.rect(x0, sy, x1 - x0, 28, fill="#e2e8f0", stroke=INK, width=2.5)
    for t, tx in (("Page 1 of 2", 14), ("245 words", 120), ("English (UK)", 210)):
        s.text(x0 + tx, sy + 14, t, size=13, color=INK, anchor="start")
    s.text(x1 - 70, sy + 14, "100%", size=13, color=INK)
    _labels(s, [(24, "Title bar", x0 + 400, y0 + 6), (y0 + 46, "Menu tabs", x0 + 440, y0 + 46),
                (y0 + 92, "Ribbon (command buttons)", x0 + 562, y0 + 92), (ry + 14, "Ruler (margins, tabs)", x0 + 480, ry + 8),
                (ry + 72, "Document area", x0 + 420, ry + 62), (ry + 184, "Scroll bar", x1 - 14, ry + 200),
                (cy_ + 16, "Insertion point (cursor)", cx_, cy_), (sy + 14, "Status bar (page, word count)", x1 - 12, sy + 14)])
    return s


@fig
def spreadsheet_window():
    s = Svg(880, 500, "Parts of a spreadsheet",
            "A spreadsheet of test marks. Columns are lettered A to D and rows numbered 1 to 6; the cell where "
            "column D meets row 2 is cell D2. The name box shows D2, the active cell, and the formula bar shows its "
            "formula =SUM(B2:C2). Column A holds names, B and C two test marks and D the totals 33, 28, 36 and 25. "
            "The range B2:C5 is shaded, and cell C4, in column C and row 4, holds 19. Row 6 holds averages worked "
            "out with formulas such as =AVERAGE(B2:B5) in cell B6: 14.5, 16 and 30.5.")
    # name box and formula bar
    s.text(80, 28, "Name box", size=14, color=MUTED, weight="bold")
    s.rect(40, 42, 80, 30, fill="#ffffff", stroke=INK, width=2, rx=3)
    s.text(80, 57, "D2", size=15, color=INK, weight="bold")
    s.text(140, 57, "fx", size=15, color=MUTED, italic=True)
    s.text(350, 28, "Formula bar: the formula in the active cell", size=14, color=MUTED, weight="bold")
    s.rect(160, 42, 380, 30, fill="#ffffff", stroke=INK, width=2, rx=3)
    s.raw(f'<text x="172" y="57" font-size="15" fill="{INK}" text-anchor="start" dominant-baseline="middle" '
          'font-family="Consolas, Courier New, monospace">=SUM(B2:C2)</text>')
    gx, gy, rh = 40, 92, 36
    widths = [44, 136, 120, 120, 120]
    xs = [gx]
    for w in widths:
        xs.append(xs[-1] + w)
    data = [["", "A", "B", "C", "D"], ["1", "Name", "Test 1", "Test 2", "Total"],
            ["2", "Aminata", "15", "18", "33"], ["3", "Ibrahim", "12", "16", "28"],
            ["4", "Fatmata", "17", "19", "36"], ["5", "Mohamed", "14", "11", "25"],
            ["6", "Average", "14.5", "16", "30.5"]]
    for r, row in enumerate(data):
        y = gy + r * rh
        for c, val in enumerate(row):
            hdr = r == 0 or c == 0
            fill = F_GREY if hdr else ("#bfdbfe" if (2 <= r <= 5 and c in (2, 3)) else "#ffffff")
            s.rect(xs[c], y, widths[c], rh, fill=fill, stroke="#94a3b8", width=1.2)
            if val:
                bold = hdr or r == 1
                anchor = "start" if (c == 1 and not hdr) else ("end" if (c >= 2 and r >= 2) else "middle")
                tx = xs[c] + 10 if anchor == "start" else (xs[c + 1] - 12 if anchor == "end" else xs[c] + widths[c] / 2)
                s.text(tx, y + rh / 2, val, size=15, color=MUTED if hdr else INK, anchor=anchor, weight="bold" if bold else "normal")
    s.rect(xs[4], gy + 2 * rh, widths[4], rh, fill="none", stroke=GREEN, width=4)
    s.dot(xs[4] + widths[4], gy + 3 * rh, r=4, color=GREEN)
    bottom = gy + 7 * rh
    s.rect(xs[3] + 3, gy + 4 * rh + 3, widths[3] - 6, rh - 6, fill="none", stroke=RED, width=2.5, dash="5 3")
    _labels(s, [(gy + rh / 2, "Column heading (letter)", xs[4] + 100, gy + rh / 2), (gy + 2.5 * rh, "Active cell D2", xs[5], gy + 2.5 * rh),
                (gy + 6.5 * rh, "Row 6: B6 holds =AVERAGE(B2:B5)", xs[5], gy + 6.5 * rh)], lx=620)
    s.arrow(gx + 22, bottom + 34, gx + 22, bottom + 6, color=RED, width=2)
    s.text(gx + 4, bottom + 48, "Row heading (number)", size=14, color=INK, anchor="start")
    s.rect(300, bottom + 22, 30, 20, fill="#bfdbfe", stroke="#94a3b8", width=1.2)
    s.text(340, bottom + 32, "range B2:C5 (a block of cells)", size=14, color=INK, anchor="start")
    s.rect(300, bottom + 52, 30, 20, fill="#ffffff", stroke=GREEN, width=3)
    s.text(340, bottom + 62, "active cell: where you type", size=14, color=INK, anchor="start")
    s.rect(300, bottom + 82, 30, 20, fill="#ffffff", stroke=RED, width=2.5, dash="5 3")
    s.text(340, bottom + 92, "cell C4: column C, row 4 (it holds 19)", size=14, color=INK, anchor="start")
    return s


@fig
def database_tables():
    s = Svg(900, 520, "A database table and a relationship",
            "Two tables in a school database. The Students table has the fields StudentID, Surname, First name and "
            "Class; each row is a record, such as S002 Kamara Aminata SSS3. StudentID is the primary key: it is "
            "different for every student. The Fees table has Receipt No, StudentID, Amount and Date. StudentID in "
            "Fees is a foreign key that links each payment to one student: one student can have many fee payments, "
            "a one-to-many relationship.")

    def table(x, y, name, cols, widths, rows, key_col, col, fill):
        s.text(x, y - 16, f"Table: {name}", size=16, color=col, anchor="start", weight="bold")
        rh = 32
        cx = x
        for c, (hdr, w) in enumerate(zip(cols, widths)):
            s.rect(cx, y, w, rh, fill=fill, stroke=col, width=1.5)
            s.text(cx + w / 2, y + rh / 2, hdr, size=14, color=col, weight="bold")
            if c == key_col:
                s.line(cx + w / 2 - len(hdr) * 4.4, y + rh / 2 + 10, cx + w / 2 + len(hdr) * 4.4, y + rh / 2 + 10, color=col, width=2)
            for r, row in enumerate(rows):
                s.rect(cx, y + (r + 1) * rh, w, rh, fill="#ffffff", stroke="#94a3b8", width=1.2)
                s.text(cx + w / 2, y + (r + 1.5) * rh, row[c], size=14, color=INK)
            cx += w
        return rh

    sw = [120, 130, 130, 100]
    rh = table(60, 80, "Students", ["StudentID", "Surname", "First name", "Class"], sw,
               [["S001", "Bangura", "Ibrahim", "SSS3"], ["S002", "Kamara", "Aminata", "SSS3"], ["S003", "Sesay", "Mohamed", "SSS2"]], 0, BLUE, F_BLUE)
    # record bracket around row S002
    ry = 80 + 2 * rh
    s.rect(54, ry - 3, sum(sw) + 12, rh + 6, fill="none", stroke=ORANGE, width=3, rx=6)
    s.arrow(620, ry + rh / 2, sum(sw) + 72, ry + rh / 2, color=ORANGE, width=2.5)
    s.text(628, ry + rh / 2, "Record (row): one student", size=15, color=ORANGE, anchor="start", weight="bold")
    # field bracket over Surname column
    fx = 60 + sw[0]
    s.rect(fx - 3, 77, sw[1] + 6, 4 * rh + 6, fill="none", stroke=PURPLE, width=3, rx=6)
    s.arrow(fx + sw[1] / 2, 36, fx + sw[1] / 2, 72, color=PURPLE, width=2.5)
    s.text(fx + sw[1] / 2 + 10, 30, "Field (column): one item about every student", size=15, color=PURPLE, anchor="start", weight="bold")
    s.text(560, 78, "Primary key: StudentID (underlined)", size=15, color=BLUE, anchor="start", weight="bold")
    s.text(560, 100, "no two students can share one", size=14, color=INK, anchor="start")
    fw = [130, 120, 120, 130]
    table(300, 330, "Fees", ["Receipt No", "StudentID", "Amount", "Date"], fw,
          [["R101", "S002", "Le 500", "08/01/2026"], ["R102", "S001", "Le 500", "09/01/2026"], ["R103", "S002", "Le 250", "02/05/2026"]], -1, GREEN, F_GREEN)
    # relationship line from Students.StudentID to Fees.StudentID
    sx, sy = 60 + sw[0] / 2, 80 + 4 * rh
    ex, ey = 300 + fw[0] + fw[1] / 2, 330
    s.polyline([(sx, sy + 4), (sx, 270), (ex, 270), (ex, ey - 4)], color=RED, width=3)
    s.label(sx + 18, 252, "1", size=16, color=RED, weight="bold")
    s.label(ex + 30, 300, "many", size=15, color=RED, weight="bold")
    s.text(ex + 70, 270, "one-to-many relationship", size=15, color=RED, anchor="start", weight="bold")
    s.text(300, 500, "StudentID in Fees is a foreign key: it links each payment to a student.", size=15, color=MUTED, anchor="start")
    return s


@fig
def presentation_window():
    s = Svg(1000, 490, "Parts of a presentation program window",
            "A presentation program in Normal view. At the left is the slide pane (thumbnails) showing four slides, "
            "with slide 2 selected. In the middle is the slide being edited, with a title placeholder and a content "
            "placeholder of bullet points. Below it is the notes pane for the speaker's notes. The status bar shows "
            "Slide 2 of 4 and buttons to change the view and start the slide show.")
    x0, y0, x1, y1 = 180, 50, 740, 470
    _window(s, x0, y0, x1, y1, "Our school – Presentation program")
    for j, t in enumerate(["File", "Home", "Insert", "Design", "Transitions", "Animations", "Slide Show"]):
        s.text(x0 + 30 + j * 78, y0 + 46, t, size=12, color=INK)
    s.line(x0, y0 + 60, x1, y0 + 60, color=GRID_C, width=1.5)
    for k in range(4):
        ty = y0 + 74 + k * 74
        s.text(x0 + 14, ty + 26, str(k + 1), size=12, color=MUTED)
        s.rect(x0 + 24, ty, 92, 56, fill="#ffffff", stroke=ORANGE if k == 1 else "#94a3b8", width=3 if k == 1 else 1.2)
        s.rect(x0 + 32, ty + 8, 60, 6, fill=F_GREY, stroke="none", width=0)
        s.rect(x0 + 32, ty + 22, 76, 4, fill=F_GREY, stroke="none", width=0)
        s.rect(x0 + 32, ty + 32, 70, 4, fill=F_GREY, stroke="none", width=0)
    s.rect(x0 + 140, y0 + 74, 410, 250, fill="#ffffff", stroke="#94a3b8", width=1.5)
    s.rect(x0 + 160, y0 + 90, 370, 50, fill="none", stroke=MUTED, width=1.5, dash="6 4")
    s.text(x0 + 345, y0 + 115, "Our school clubs", size=22, color=INK, weight="bold")
    s.rect(x0 + 160, y0 + 154, 370, 154, fill="none", stroke=MUTED, width=1.5, dash="6 4")
    for k, t in enumerate(["Debating club", "Science club", "Football team", "ICT club"]):
        s.text(x0 + 180, y0 + 180 + k * 34, "• " + t, size=16, color=INK, anchor="start")
    s.rect(x0 + 140, y0 + 334, 410, 46, fill="#f1f5f9", stroke="#94a3b8", width=1.2)
    s.text(x0 + 154, y0 + 357, "Notes: mention the ICT club meets on Fridays", size=13, color=MUTED, anchor="start", italic=True)
    sy = y1 - 28
    s.rect(x0, sy, x1 - x0, 28, fill="#e2e8f0", stroke=INK, width=2.5)
    s.text(x0 + 14, sy + 14, "Slide 2 of 4", size=13, color=INK, anchor="start")
    for k in range(2):
        s.rect(x1 - 118 + k * 26, sy + 7, 16, 14, fill="#ffffff", stroke=INK, width=1.5, rx=2)
    s.polygon([(x1 - 62, sy + 6), (x1 - 62, sy + 22), (x1 - 48, sy + 14)], fill=INK, stroke=INK, width=1)
    _labels(s, [(22, "Title bar", x0 + 320, y0 + 4), (y0 + 115, "Title placeholder", x0 + 530, y0 + 115),
                (y0 + 240, "Content placeholder", x0 + 530, y0 + 240), (y0 + 357, "Notes pane (speaker notes)", x0 + 550, y0 + 357),
                (sy + 14, "Views and Slide Show button", x1 - 46, sy + 14)], lx=772)
    s.polyline([(x0 + 24, y0 + 82), (x0 - 22, y0 + 82)], color=MUTED, width=1.8)
    s.dot(x0 + 24, y0 + 82, r=4, color=RED)
    s.text(x0 - 30, y0 + 82, "Slide pane", size=15, color=INK, anchor="end")
    s.text(x0 - 30, y0 + 104, "(thumbnails)", size=15, color=INK, anchor="end")
    return s


@fig
def bitmap_vs_vector():
    s = Svg(820, 450, "Bitmap and vector graphics",
            "The same circle enlarged two ways. On the left, a bitmap (raster) image is made of pixels: when it is "
            "enlarged, the square pixels show and the edge looks jagged. On the right, a vector image is stored as "
            "shapes described by mathematics: when it is enlarged, the edge stays smooth. Bitmaps suit photographs; "
            "vectors suit logos, diagrams and drawings.")
    # bitmap circle on a pixel grid
    ox, oy, n, p = 60, 70, 14, 20
    c = (n - 1) / 2
    for i in range(n):
        for j in range(n):
            d = math.hypot(i - c, j - c)
            on = d <= 6.2
            edge = on and d > 5.0
            s.rect(ox + i * p, oy + j * p, p, p, fill=(BLUE if not edge else "#60a5fa") if on else "#ffffff", stroke="#cbd5e1", width=0.8)
    s.text(ox + n * p / 2, 40, "Bitmap (raster): made of pixels", size=17, color=BLUE, weight="bold")
    s.text(ox + n * p / 2, oy + n * p + 30, "enlarged: jagged, blocky edges", size=15, color=INK)
    s.text(ox + n * p / 2, oy + n * p + 54, "best for photographs (.jpg, .png, .bmp)", size=15, color=MUTED)
    # vector circle
    vx = 590
    s.circle(vx, oy + n * p / 2, 124, fill=BLUE, stroke=INK, width=2)
    for a in (0, 90, 180, 270):
        x = vx + 124 * math.cos(math.radians(a))
        y = oy + n * p / 2 + 124 * math.sin(math.radians(a))
        s.rect(x - 5, y - 5, 10, 10, fill="#ffffff", stroke=RED, width=2)
    s.text(vx, 40, "Vector: made of shapes and maths", size=17, color=GREEN, weight="bold")
    s.text(vx, oy + n * p + 30, "enlarged: edges stay smooth", size=15, color=INK)
    s.text(vx, oy + n * p + 54, "best for logos and drawings (.svg, .ai)", size=15, color=MUTED)
    s.text(vx, oy + n * p + 78, "red squares: points that define the curve", size=13, color=RED)
    return s


# ═══ Networks, the Internet, mobile, ethics and security ════════════════════

def node(s: Svg, x, y, label="", col=BLUE, fill=F_BLUE, w=56, h=38, size=13):
    """A small computer: a screen on a stand, with a label underneath."""
    s.rect(x - w / 2, y - h / 2, w, h - 8, fill=fill, stroke=col, width=2, rx=4)
    s.line(x, y + h / 2 - 8, x, y + h / 2 - 2, color=col, width=2)
    s.line(x - 10, y + h / 2 - 2, x + 10, y + h / 2 - 2, color=col, width=2)
    if label:
        s.text(x, y + h / 2 + 12, label, size=size, color=INK)


@fig
def network_topologies():
    s = Svg(880, 560, "Network topologies",
            "Four network topologies. Bus: every computer joins one main cable, the backbone, with a terminator at "
            "each end; a break in the backbone stops the network. Star: every computer has its own cable to a "
            "central switch; if one cable fails only that computer is cut off, but if the switch fails all are. "
            "Ring: each computer joins the next to form a closed loop, and data passes round in one direction. "
            "Mesh: every computer is linked to every other, so there are many routes and the network keeps working "
            "if a link fails.")
    panels = [(220, 40, "Bus", BLUE, "one backbone cable; a break stops all"),
              (660, 40, "Star", GREEN, "a central switch; most common in LANs"),
              (220, 300, "Ring", ORANGE, "a closed loop; data goes one way round"),
              (660, 300, "Mesh", PURPLE, "many links; works if one fails")]
    for cx, top, name, col, note in panels:
        s.rect(cx - 205, top, 410, 240, fill="#ffffff", stroke=GRID_C, width=1.5, rx=12)
        s.text(cx, top + 24, name, size=19, color=col, weight="bold")
        s.text(cx, top + 222, note, size=14, color=MUTED)
    # bus
    by = 160
    s.line(50, by, 390, by, color=BLUE, width=4)
    for x in (50, 390):
        s.rect(x - 5, by - 12, 10, 24, fill=BLUE, stroke=BLUE, width=1)
    for i, x in enumerate((95, 175, 255, 335)):
        y = by - 62 if i % 2 == 0 else by + 52
        node(s, x, y, "", BLUE, F_BLUE)
        s.line(x, by, x, y + (19 if i % 2 == 0 else -19), color=BLUE, width=2.5)
    s.text(60, by + 26, "terminator", size=12, color=MUTED, anchor="start")
    # star
    hx, hy = 660, 152
    s.rect(hx - 34, hy - 16, 68, 32, fill=F_GREEN, stroke=GREEN, width=2.5, rx=6)
    s.text(hx, hy, "switch", size=13, color=GREEN, weight="bold")
    for ang in (200, 250, 290, 340, 20, 160):
        x = hx + 150 * math.cos(math.radians(ang)) * 1.15
        y = hy + 62 * math.sin(math.radians(ang)) + (8 if math.sin(math.radians(ang)) > 0 else -4)
        s.line(hx + (34 if x > hx + 30 else -34 if x < hx - 30 else 0), hy, x, y, color=GREEN, width=2.5)
        node(s, x, y, "", GREEN, F_GREEN, w=48, h=34)
    # ring
    rx_, ry_ = 220, 430
    pts = [(rx_ + 120 * math.cos(math.radians(a)), ry_ + 60 * math.sin(math.radians(a))) for a in range(-90, 270, 60)]
    for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1]):
        s.mid_arrow(x1, y1, x2, y2, color=ORANGE, width=2.5, at=0.55, size=11)
    for x, y in pts:
        node(s, x, y, "", ORANGE, F_AMBER, w=46, h=32)
    # mesh
    mx, my = 660, 430
    mp = [(mx + 130 * math.cos(math.radians(a)), my + 62 * math.sin(math.radians(a))) for a in (-90, -18, 54, 126, 198)]
    for (x1, y1), (x2, y2) in itertools.combinations(mp, 2):
        s.line(x1, y1, x2, y2, color=PURPLE, width=2)
    for x, y in mp:
        node(s, x, y, "", PURPLE, F_PURPLE, w=46, h=32)
    return s


@fig
def types_of_networks():
    s = Svg(840, 420, "Types of networks by area",
            "Four types of network drawn as nested areas from smallest to largest. A personal area network (PAN) "
            "covers a few metres around one person, such as a phone linked to wireless earphones by Bluetooth. A "
            "local area network (LAN) covers one building or site, such as a school computer laboratory. A "
            "metropolitan area network (MAN) covers a town or city, such as a university's campuses across Freetown. "
            "A wide area network (WAN) covers countries and continents; the Internet is the largest WAN.")
    levels = [("WAN", "wide area network", "countries and continents: the Internet, a bank's branches", PURPLE, F_PURPLE),
              ("MAN", "metropolitan area network", "a town or city: campuses across Freetown", TEAL, F_TEAL),
              ("LAN", "local area network", "one building or site: a school computer lab", GREEN, F_GREEN),
              ("PAN", "personal area network", "a few metres: phone and Bluetooth earphones", ORANGE, F_AMBER)]
    cx = 420
    for i, (ab, name, ex, col, fill) in enumerate(levels):
        w, top, bot = 800 - i * 160, 20 + i * 80, 400 - i * 20
        s.rect(cx - w / 2, top, w, bot - top, fill=fill, stroke=col, width=2.5, rx=28)
        s.text(cx, top + 28, f"{ab}: {name}", size=18 if i < 3 else 16, color=col, weight="bold")
        s.text(cx, top + 52, ex, size=14, color=INK)
    return s


def join(s: Svg, a, b, color=MUTED, width=2.5, gap=6):
    """A plain line (a cable) between the edges of two boxes."""
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    if abs(bx - ax) * ah > abs(by - ay) * aw:
        s.line(ax + math.copysign(aw / 2 + gap, bx - ax), ay, bx - math.copysign(bw / 2 + gap, bx - ax), by, color=color, width=width)
    else:
        s.line(ax, ay + math.copysign(ah / 2 + gap, by - ay), bx, by - math.copysign(bh / 2 + gap, by - ay), color=color, width=width)


@fig
def small_office_network():
    s = Svg(900, 480, "Devices in a small network",
            "A small office or school network. Three desktop computers and a shared printer are joined by cables "
            "to a switch. A wireless access point, also cabled to the switch, lets a laptop and a phone join by "
            "Wi-Fi. The switch connects to a router with a firewall, which links the local network to the outside; "
            "a modem connects the router to the Internet service provider (ISP), which connects to the Internet.")
    s.rect(24, 14, 478, 452, fill="none", stroke=GREEN, width=2, rx=16, dash="8 6")
    s.text(40, 450, "local area network (LAN)", size=14, color=GREEN, anchor="start", weight="bold")
    sw = box(s, 330, 285, 140, 54, ["Switch", "joins LAN devices"], GREEN, F_GREEN, size=16)
    for i in range(3):
        y = 190 + i * 95
        node(s, 90, y, f"PC {i + 1}", BLUE, F_BLUE)
        s.line(120, y - 4, sw[0] - 76, sw[1] + (i - 1) * 16, color=MUTED, width=2.5)
    pr = box(s, 330, 400, 130, 48, ["Printer", "shared by all"], INK, F_GREY, size=15)
    join(s, sw, pr)
    ap = box(s, 330, 135, 150, 50, ["Access point", "gives Wi-Fi"], ORANGE, F_AMBER, size=15)
    join(s, ap, sw)
    lx, ly = 160, 66
    s.rect(lx - 24, ly - 16, 48, 28, fill="#ffffff", stroke=ORANGE, width=2, rx=3)
    s.polygon([(lx - 30, ly + 12), (lx + 30, ly + 12), (lx + 35, ly + 19), (lx - 35, ly + 19)], fill="#ffffff", stroke=ORANGE, width=2)
    s.text(lx, ly + 34, "laptop", size=12, color=MUTED)
    px, py = 470, 60
    s.rect(px - 12, py - 22, 24, 42, fill="#ffffff", stroke=ORANGE, width=2, rx=5)
    s.text(px, py + 36, "phone", size=12, color=MUTED)
    s.line(255, 122, lx + 38, ly + 14, color=ORANGE, width=2, dash="5 5")
    s.line(405, 122, px - 16, py + 10, color=ORANGE, width=2, dash="5 5")
    s.label(226, 84, "Wi-Fi", size=12, color=ORANGE)
    s.label(428, 82, "Wi-Fi", size=12, color=ORANGE)
    rt = box(s, 590, 285, 140, 56, ["Router", "+ firewall"], RED, F_RED, size=17)
    join(s, sw, rt)
    md = box(s, 590, 400, 140, 50, ["Modem", "or fibre box"], PURPLE, F_PURPLE, size=16)
    join(s, rt, md)
    isp = box(s, 790, 400, 150, 50, ["ISP", "e.g. a mobile network"], TEAL, F_TEAL, size=16)
    join(s, md, isp)
    net = box(s, 790, 285, 150, 56, ["The Internet", "networks worldwide"], BLUE, F_BLUE, size=17)
    join(s, isp, net)
    return s


@fig
def client_server_vs_peer_to_peer():
    s = Svg(880, 380, "Client-server and peer-to-peer networks",
            "Two ways of organising a network. In a client-server network, one powerful central computer, the "
            "server, stores the shared files, programs and security, and the other computers, the clients, ask it "
            "for services. In a peer-to-peer network there is no server: every computer is equal and shares its "
            "own files and printer directly with the others.")
    s.text(220, 30, "Client-server", size=19, color=BLUE, weight="bold")
    srv = box(s, 220, 110, 150, 64, ["Server", "files, security, backups"], BLUE, F_BLUE, size=16)
    for i, x in enumerate((90, 220, 350)):
        node(s, x, 265, f"client {i + 1}", BLUE, "#ffffff")
        s.line(x, 246, srv[0] + (x - 220) * 0.35, srv[1] + 32, color=BLUE, width=2.5)
    s.text(220, 345, "clients ask; the server provides", size=14, color=MUTED)
    s.line(440, 20, 440, 360, color=GRID_C, width=2)
    s.text(660, 30, "Peer-to-peer", size=19, color=GREEN, weight="bold")
    pts = [(560, 120), (760, 120), (560, 260), (760, 260)]
    for (x1, y1), (x2, y2) in itertools.combinations(pts, 2):
        s.line(x1, y1, x2, y2, color=GREEN, width=2)
    for i, (x, y) in enumerate(pts):
        s.rect(x - 34, y - 22, 68, 44, fill=F_GREEN, stroke=GREEN, width=2, rx=6)
        s.text(x, y, f"peer {i + 1}", size=13, color=GREEN, weight="bold")
    s.text(660, 345, "every computer is equal and shares", size=14, color=MUTED)
    return s


@fig
def how_the_internet_works():
    s = Svg(900, 430, "How a web page reaches you",
            "Five steps when you open a website on a phone. 1, you type the address, such as www.example.com, in "
            "the browser. 2, a DNS server looks up the domain name and returns the server's IP address. 3, the "
            "request travels through your Wi-Fi router or mobile network to your Internet service provider and on "
            "across the Internet. 4, the web server sends back the page's files. 5, the browser displays the page.")
    you = box(s, 110, 130, 170, 70, ["1. Your browser", "www.example.com"], PURPLE, F_PURPLE, size=16)
    dns = box(s, 110, 320, 170, 70, ["2. DNS server", "name → 203.0.113.10"], ORANGE, F_AMBER, size=15)
    isp = box(s, 360, 130, 170, 70, ["3. Router and ISP", "your way in"], TEAL, F_TEAL, size=16)
    net = box(s, 590, 130, 150, 70, ["The Internet", "linked networks"], BLUE, F_BLUE, size=16)
    web = box(s, 800, 130, 150, 70, ["4. Web server", "sends the page"], GREEN, F_GREEN, size=16)
    s.arrow(80, 167, 80, 283, color=ORANGE, width=2.5)
    s.arrow(140, 283, 140, 167, color=ORANGE, width=2.5)
    s.text(162, 225, "IP address", size=13, color=ORANGE, anchor="start")
    s.text(58, 225, "name", size=13, color=ORANGE, anchor="end")
    link(s, you, isp)
    link(s, isp, net)
    link(s, net, web)
    s.path("M 800 167 C 800 300, 360 300, 200 168", color=GREEN, width=2.5, arrow="end", dash="7 5")
    s.label(520, 262, "5. the page comes back and is shown", size=14, color=GREEN)
    s.text(450, 400, "Every device on the Internet has an IP address; DNS turns names people remember into these numbers.", size=13, color=MUTED)
    return s


@fig
def url_and_email_address():
    s = Svg(900, 400, "Parts of a web address and an email address",
            "Top: the web address https://www.example.com/results/sss3.html divided into its parts: https is the "
            "protocol, www the host, example the domain name, .com the top-level domain, and /results/sss3.html the "
            "path to the page. Bottom: the email address aminata.kamara@example.com divided into the user name "
            "aminata.kamara, the at sign, and the domain example.com.")

    def parts(y, segs, title_text):
        s.text(30, y - 52, title_text, size=16, color=MUTED, anchor="start", weight="bold")
        widths = [len(t) * 15.7 + 18 for t, _, _ in segs]
        x = (900 - sum(widths)) / 2
        for k, ((t, lab, col), w) in enumerate(zip(segs, widths)):
            s.rect(x + 1, y - 22, w - 2, 44, fill={BLUE: F_BLUE, GREEN: F_GREEN, ORANGE: F_AMBER, PURPLE: F_PURPLE, RED: F_RED, TEAL: F_TEAL}[col], stroke=col, width=2, rx=5)
            s.raw(f'<text x="{x + w / 2:.1f}" y="{y}" font-size="26" fill="{INK}" text-anchor="middle" dominant-baseline="middle" '
                  f'font-family="Consolas, Courier New, monospace">{t}</text>')
            drop = 26 if k % 2 else 0
            s.line(x + w / 2, y + 24, x + w / 2, y + 40 + drop, color=col, width=2)
            s.text(x + w / 2, y + 54 + drop, lab, size=14, color=col, weight="bold")
            x += w

    parts(110, [("https://", "protocol", PURPLE), ("www.", "host", TEAL), ("example", "domain name", BLUE),
                (".com", "top-level domain", ORANGE), ("/results/sss3.html", "path to the page", GREEN)], "Web address (URL)")
    parts(296, [("aminata.kamara", "user name", BLUE), ("@", "at", RED), ("example.com", "domain (mail provider)", GREEN)], "Email address")
    return s


@fig
def mobile_generations():
    s = Svg(900, 330, "Generations of mobile networks",
            "A timeline of mobile network generations. 1G, 1980s: analogue voice calls only. 2G, 1990s: digital "
            "calls and SMS text messages. 3G, 2000s: mobile Internet and video calls. 4G, 2010s: fast mobile "
            "broadband for streaming video and apps. 5G, 2020s: very fast speeds and very low delay, for many "
            "connected devices.")
    gens = [("1G", "1980s", ["analogue", "voice calls only"], MUTED, F_GREY),
            ("2G", "1990s", ["digital calls,", "SMS texts"], ORANGE, F_AMBER),
            ("3G", "2000s", ["mobile Internet,", "video calls"], TEAL, F_TEAL),
            ("4G", "2010s", ["fast broadband,", "HD video, apps"], BLUE, F_BLUE),
            ("5G", "2020s", ["very fast, tiny delay,", "many devices (IoT)"], PURPLE, F_PURPLE)]
    s.arrow(40, 120, 870, 120, color=INK, width=3)
    for i, (g, yr, lines, col, fill) in enumerate(gens):
        x = 110 + i * 170
        s.circle(x, 120, 30, fill=fill, stroke=col, width=3)
        s.text(x, 120, g, size=20, color=col, weight="bold")
        s.text(x, 72, yr, size=15, color=MUTED, weight="bold")
        box(s, x, 215, 156, 64, lines, col, "#ffffff", size=14, bold_first=False)
        s.line(x, 150, x, 183, color=col, width=2)
    s.text(450, 300, "Each generation is faster and carries more data than the one before.", size=14, color=MUTED)
    return s


@fig
def smartphone_parts():
    s = Svg(860, 560, "Parts of a smartphone",
            "Front and back of a smartphone with labelled parts. Front: the touch screen, the front camera, the "
            "earpiece speaker, the microphone and the charging port (USB-C). Back: the rear cameras with flash, and "
            "the fingerprint sensor. Inside: the battery, the SIM card tray, the processor and memory, and sensors "
            "such as GPS, the accelerometer and the gyroscope.")
    # front
    fx, fy, fw, fh = 210, 50, 200, 420
    s.rect(fx, fy, fw, fh, fill="#1e293b", stroke=INK, width=3, rx=28)
    s.rect(fx + 10, fy + 34, fw - 20, fh - 64, fill="#e0f2fe", stroke="none", width=0, rx=6)
    for r in range(4):
        for c in range(4):
            s.rect(fx + 26 + c * 42, fy + 56 + r * 52, 30, 30, fill=[F_BLUE, F_GREEN, F_AMBER, F_PURPLE][(r + c) % 4], stroke="none", width=0, rx=8)
    s.circle(fx + fw / 2, fy + 18, 6, fill="#475569", stroke="#94a3b8", width=1.5)
    s.rect(fx + fw / 2 - 24, fy + 8, 14, 4, fill="#94a3b8", stroke="none", width=0, rx=2)
    s.rect(fx + fw / 2 - 16, fy + fh - 6, 32, 8, fill="#94a3b8", stroke=INK, width=1.5, rx=3)
    s.dot(fx + fw / 2 + 40, fy + fh - 14, r=2.5, color="#94a3b8")
    s.text(fx + fw / 2, fy + fh + 30, "front", size=15, color=MUTED, weight="bold")
    # back
    bx = 470
    s.rect(bx, fy, fw, fh, fill="#334155", stroke=INK, width=3, rx=28)
    s.rect(bx + 18, fy + 20, 74, 104, fill="#1e293b", stroke="#64748b", width=2, rx=16)
    for k in range(2):
        s.circle(bx + 55, fy + 48 + k * 48, 17, fill="#0f172a", stroke="#94a3b8", width=2)
    s.dot(bx + 110, fy + 40, r=6, color="#fde68a")
    s.circle(bx + fw / 2, fy + 200, 22, fill="#475569", stroke="#94a3b8", width=2)
    s.rect(bx + fw - 4, fy + 120, 8, 40, fill="#94a3b8", stroke=INK, width=1, rx=2)
    s.text(bx + fw / 2, fy + fh + 30, "back", size=15, color=MUTED, weight="bold")

    def lab(px, py, lx, ly, t, anchor):
        s.polyline([(px, py), (lx + (8 if anchor == "end" else -8), ly), (lx, ly)], color=MUTED, width=1.8)
        s.dot(px, py, r=4, color=RED)
        s.text(lx + (-6 if anchor == "end" else 6), ly, t, size=15, color=INK, anchor=anchor)

    lab(fx + fw / 2, fy + 18, 178, 60, "Front camera", "end")
    lab(fx + fw / 2 - 17, fy + 10, 178, 30, "Earpiece speaker", "end")
    lab(fx + 60, fy + 250, 178, 250, "Touch screen", "end")
    lab(fx + fw / 2 + 40, fy + fh - 14, 178, 430, "Microphone", "end")
    lab(fx + fw / 2, fy + fh - 2, 178, 470, "USB-C charging port", "end")
    lab(bx + 55, fy + 20, 700, 30, "Rear cameras", "start")
    lab(bx + 110, fy + 40, 700, 100, "Flash", "start")
    lab(bx + fw / 2 + 22, fy + 200, 700, 250, "Fingerprint sensor", "start")
    lab(bx + fw, fy + 140, 700, 160, "SIM card tray", "start")
    s.rect(700, 330, 150, 140, fill="#ffffff", stroke=GRID_C, width=1.5, rx=10)
    s.text(775, 350, "Inside", size=15, color=BLUE, weight="bold")
    for k, t in enumerate(["battery", "processor (SoC)", "RAM and storage", "GPS receiver", "accelerometer"]):
        s.text(712, 376 + k * 21, "• " + t, size=13, color=INK, anchor="start")
    return s


@fig
def intellectual_property():
    s = Svg(880, 340, "Types of intellectual property",
            "Intellectual property is protected in four main ways. Copyright protects original creative works such "
            "as books, music, films, photographs and software. A patent protects a new invention. A trademark "
            "protects a brand name, logo or slogan. A trade secret protects private business knowledge such as a "
            "recipe or a method.")
    root = box(s, 440, 50, 300, 52, ["Intellectual property", "creations of the mind"], PURPLE, F_PURPLE, size=18)
    kids = [("Copyright", ["books, music, films,", "photos, software"], BLUE, F_BLUE),
            ("Patent", ["new inventions", "and processes"], GREEN, F_GREEN),
            ("Trademark", ["brand names, logos,", "slogans"], ORANGE, F_AMBER),
            ("Trade secret", ["recipes, formulas,", "private methods"], TEAL, F_TEAL)]
    bs = []
    for i, (t, lines, col, fill) in enumerate(kids):
        x = 115 + i * 217
        bs.append(box(s, x, 175, 190, 46, t, col, fill, size=17))
        s.text(x, 225, lines[0], size=14, color=INK)
        s.text(x, 245, lines[1], size=14, color=INK)
    tree(s, root, bs)
    s.text(440, 305, "Copying software, music or films without permission breaks copyright: it is piracy.", size=14, color=MUTED)
    return s


@fig
def types_of_malware():
    s = Svg(900, 400, "Types of malware",
            "Malware, short for malicious software, includes: a virus, which attaches itself to a file and spreads "
            "when the file is opened; a worm, which copies itself across networks on its own; a Trojan horse, which "
            "pretends to be a useful program; ransomware, which locks or encrypts files and demands payment; "
            "spyware, which secretly records what you do, including keyloggers that record what you type; and "
            "adware, which shows unwanted advertisements.")
    root = box(s, 450, 50, 340, 52, ["Malware", "malicious software"], RED, F_RED, size=19)
    kids = [("Virus", "joins a file; spreads when it is run"),
            ("Worm", "spreads across networks by itself"),
            ("Trojan horse", "pretends to be a useful program"),
            ("Ransomware", "locks files and demands payment"),
            ("Spyware", "secretly records what you do"),
            ("Adware", "floods the screen with adverts")]
    bs = []
    for i, (t, d) in enumerate(kids):
        x = 160 + (i % 3) * 290
        y = 170 + (i // 3) * 120
        bs.append(box(s, x, y, 272, 64, [t, d], RED if i < 4 else ORANGE, "#ffffff", size=17))
    tree(s, root, bs[:3])
    for b, a in zip(bs[3:], bs[:3]):
        s.line(a[0], a[1] + 32, b[0], b[1] - 32, color=MUTED, width=2)
    s.text(450, 385, "All of them run without the owner's permission; up-to-date antivirus software finds and removes them.", size=14, color=MUTED)
    return s


@fig
def two_factor_authentication():
    s = Svg(900, 300, "Two-factor authentication",
            "Two-factor authentication in four steps: 1, enter your user name and password, something you know; "
            "2, the service sends a one-time code to your phone, something you have; 3, type the code; 4, you are "
            "let in. A thief who has stolen only your password cannot get past step 3.")
    steps = [("1. Password", ["something you", "know"], BLUE, F_BLUE),
             ("2. Code sent", ["to your phone:", "something you have"], ORANGE, F_AMBER),
             ("3. Enter code", ["e.g. 482 913,", "valid for minutes"], PURPLE, F_PURPLE),
             ("4. Access", ["only with", "both factors"], GREEN, F_GREEN)]
    prev = None
    for i, (t, lines, col, fill) in enumerate(steps):
        b = box(s, 115 + i * 223, 120, 190, 100, [t] + lines, col, fill, size=17)
        if prev:
            link(s, prev, b)
        prev = b
    s.text(450, 230, "A stolen password alone is not enough: the thief does not have your phone.", size=15, color=RED, weight="bold")
    s.text(450, 262, "Never share a one-time code with anyone, even someone who says they work for the bank.", size=14, color=MUTED)
    return s


def main(names: list[str]) -> int:
    chosen = names or list(FIGS)
    unknown = [n for n in chosen if n not in FIGS]
    if unknown:
        print("unknown figures:", ", ".join(unknown))
        return 1
    for n in chosen:
        FIGS[n]().save(OUT / f"{n}.svg")
    print(f"wrote {len(chosen)} diagram(s) to {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
