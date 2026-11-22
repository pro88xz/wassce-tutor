#!/usr/bin/env python3
"""Original diagrams for the ICT / Computer Studies notes.

    python3 scripts/notes/ict_figs.py            # write every diagram
    python3 scripts/notes/ict_figs.py name ...   # write some

Each function draws one figure and returns an Svg. Files go to
public/img/ict/<name>.svg and lessons show them from
https://wasscetutor.com/img/ict/<name>.svg. All drawn by WASSCE Tutor.
"""

from __future__ import annotations

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
