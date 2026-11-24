"""Biology · Levels of organisation: from cells to whole organisms. A chalkboard video lesson.

Follows content/notes/biology-levels-of-organisation-1.md: the sequence cell,
tissue, organ, organ system, organism (drawn); animal and plant tissues and
their jobs; the leaf as an organ, with its tissues drawn in cross-section;
organ systems working together; and why Amoeba has none of these levels.
Check: python3 scripts/video/board_video.py content/videos/biology-levels-of-organisation-1.py --boards .video-build/boards/levels
"""

from board_video import (arrow, box, clear, curve, dots, ellipse, heading, label, line, ring, step, text_width,
                         write)

TITLE = "Levels of Organisation: Cell, Tissue, Organ, Organ System, Organism | WASSCE Biology"
DESCRIPTION = ("The levels of organisation from cell to organism, drawn on the chalkboard: animal and plant tissues and "
               "their functions, the leaf as an organ in cross-section, organ systems working together, and why Amoeba "
               "is the exception.")
LABEL = "WASSCE Tutor  ·  Biology  ·  Levels of organisation"

X = [140, 390, 640, 890, 1130]   # where each level is drawn
Y = 300
NAMES = ["cell", "tissue", "organ", "organ system", "organism"]


def cell_icon(cx, cy, s=1.0, width=3.4):
    return [ellipse(cx, cy, 48 * s, 40 * s, "white", width), ellipse(cx - 4 * s, cy, 12 * s, 11 * s, "blue", width * 0.9)]


def tissue_icon(cx, cy, s=1.0, width=3.0):
    out = []
    for i in range(3):
        for j in range(3):
            x, y = cx + (i - 1) * 32 * s, cy + (j - 1) * 30 * s
            out += [box(x - 14 * s, y - 13 * s, 28 * s, 26 * s, "white", width), dots([(x, y)], "blue", 5 * s)]
    return out


def heart_icon(cx, cy, s=1.0, width=3.6):
    pts = [(0, 52), (-30, 24), (-52, -4), (-50, -30), (-28, -44), (0, -26), (28, -44), (50, -30), (52, -4), (30, 24)]
    return [curve([(cx + x * s, cy + y * s) for x, y in pts], "pink", width, closed=True)]


def system_icon(cx, cy, s=1.0, width=3.2):
    return [ellipse(cx - 18 * s, cy - 42 * s, 22 * s, 16 * s, "white", width),
            curve([(cx - 10 * s, cy - 27 * s), (cx + 2 * s, cy - 14 * s)], "white", width),
            ellipse(cx + 8 * s, cy, 32 * s, 18 * s, "pink", width),
            curve([(cx + 2 * s, cy + 17 * s), (cx - 8 * s, cy + 30 * s)], "white", width),
            ellipse(cx - 12 * s, cy + 44 * s, 28 * s, 15 * s, "white", width)]


def person_icon(cx, cy, s=1.0, width=3.6):
    return [ellipse(cx, cy - 52 * s, 17 * s, 17 * s, "white", width), line(cx, cy - 34 * s, cx, cy + 18 * s, "white", width),
            line(cx - 32 * s, cy - 12 * s, cx + 32 * s, cy - 12 * s, "white", width),
            line(cx, cy + 18 * s, cx - 22 * s, cy + 60 * s, "white", width), line(cx, cy + 18 * s, cx + 22 * s, cy + 60 * s, "white", width)]


ICONS = [cell_icon, tissue_icon, heart_icon, system_icon, person_icon]


def level(i):
    return ICONS[i](X[i], Y) + [write(NAMES[i], X[i], Y + 110, 26, "yellow", "center")]


def link(i):
    a, b = X[i] + (70 if i else 60), X[i + 1] - 72
    return arrow(a, Y, b, Y, "grey", 3.0)


# A leaf in cross-section: x 80 to 560.
L0, L1 = 80, 560


def leaf_section():
    out = []
    # upper epidermis: one row of flat cells
    out += [line(L0, 196, L1, 196, "white", 2.8), line(L0, 216, L1, 216, "white", 2.8)]
    out += [line(x, 196, x, 216, "white", 2.2) for x in range(L0 + 40, L1, 40)]
    # palisade mesophyll: tall cells packed with chloroplasts
    for x in range(L0 + 4, L1 - 30, 34):
        out.append(box(x, 222, 28, 78, "green", 2.6))
        out.append(dots([(x + 9, 240), (x + 19, 254), (x + 9, 270), (x + 19, 286)], "green", 5))
    # spongy mesophyll: rounded cells with air spaces between
    for k, (x, y) in enumerate([(110, 328), (170, 352), (236, 326), (300, 356), (366, 330), (430, 354), (500, 330), (140, 382), (270, 384), (400, 384), (530, 378)]):
        out.append(ellipse(x, y, 24, 17, "white", 2.4))
    # lower epidermis, with a stoma between two guard cells
    out += [line(L0, 404, 296, 404, "white", 2.8), line(L0, 424, 296, 424, "white", 2.8),
            line(364, 404, L1, 404, "white", 2.8), line(364, 424, L1, 424, "white", 2.8)]
    out += [line(x, 404, x, 424, "white", 2.2) for x in list(range(L0 + 40, 296, 40)) + list(range(400, L1, 40))]
    out += [ellipse(312, 414, 15, 11, "green", 2.6), ellipse(348, 414, 15, 11, "green", 2.6)]
    return out


STEPS = [
    # ── 1. The levels ──────────────────────────────────────────────────
    step("A large living thing is not just a bag of parts. Its parts are arranged in levels, from the smallest to the largest. "
         "We call this the levels of organisation.",
         heading("Levels of Organisation"),
         chapter="Levels of organisation: cell to organism"),

    step("It starts with the cell, the basic unit of life.",
         *level(0)),
    step("Similar cells working together form a tissue.",
         link(0), *level(1)),
    step("Different tissues working together form an organ, like the heart.",
         link(1), *level(2)),
    step("Organs working together form an organ system.",
         link(2), *level(3)),
    step("And all the organ systems together make the whole organism.",
         link(3), *level(4)),

    step("Each level is built from the one below it. In the exam, write the order exactly like this, from the smallest: "
         "cell, tissue, organ, organ system, organism. Never reverse it.",
         write("cell,  tissue,  organ,  organ system,  organism", 640, 540, 32, "yellow", "center"),
         write("smallest", 140, 606, 22, "grey"), arrow(250, 598, 1020, 598, "grey", 2.8), write("largest", 1040, 606, 22, "grey")),

    # ── 2. Tissues ─────────────────────────────────────────────────────
    step("A tissue is a group of similar cells that work together to perform a particular function.",
         clear(2.2),
         heading("Tissues"),
         write("Tissue:  a group of similar cells working together", 70, 176, 27),
         write("to perform a particular function.", 70 + text_width("Tissue:  ", 27), 214, 27),
         chapter="What is a tissue? Animal and plant tissues"),

    step("In animals, epithelial tissue covers the body and lines its organs. Muscle tissue contracts to produce movement. "
         "Nervous tissue carries impulses. And connective tissue, such as bone and blood, supports, binds or transports.",
         write("Animal tissues", 70, 290, 28, "pink"),
         write("epithelial:  covers and lines", 70, 336, 24),
         write("muscular:  contracts for movement", 70, 376, 24),
         write("nervous:  carries impulses", 70, 416, 24),
         write("connective:  supports, binds,", 70, 456, 24),
         write("transports  (bone, blood)", 70 + text_width("connective:  ", 24), 490, 24)),

    step("In plants, the epidermis is a protective outer layer. Xylem carries water and mineral ions, and also supports the plant. "
         "Phloem carries dissolved sugars. And meristems are tissues of dividing cells, where the plant grows.",
         write("Plant tissues", 700, 290, 28, "green"),
         write("epidermis:  protective covering", 700, 336, 24),
         write("xylem:  water, minerals;  support", 700, 376, 24),
         write("phloem:  dissolved sugars", 700, 416, 24),
         write("meristem:  dividing cells, growth", 700, 456, 24)),

    # ── 3. Organs: the leaf ────────────────────────────────────────────
    step("An organ is made of two or more different tissues, working together to perform a function. A leaf is a good example. Here it is in section.",
         clear(2.2),
         heading("Organs:  the leaf"),
         *leaf_section(),
         chapter="What is an organ? The leaf in cross-section"),

    step("The upper epidermis protects the leaf.",
         label("upper epidermis", 620, 212, 562, 206), write("protects the leaf", 620, 240, 20, "grey")),
    step("Below it, the palisade mesophyll cells are packed with chloroplasts. Most photosynthesis happens here.",
         label("palisade mesophyll", 620, 276, 562, 262), write("most photosynthesis happens here", 620, 304, 20, "grey")),
    step("The spongy mesophyll has air spaces between its cells, for gas exchange.",
         label("spongy mesophyll", 620, 358, 556, 356), write("air spaces for gas exchange", 620, 386, 20, "grey")),
    step("And the lower epidermis has stomata, pores that let gases in and out.",
         label("lower epidermis and stoma", 620, 444, 364, 416), write("stomata let gases in and out", 620, 472, 20, "grey")),
    step("Because a leaf is made of several tissues working together, it is an organ, not a tissue. That is a common mistake in the exam.",
         write("A leaf is an organ, not a tissue.", 70, 520, 30, "pink"),
         write("The heart is an organ too:  muscle, connective and nervous tissue.", 70, 572, 24, "grey")),

    # ── 4. Systems, organisms, Amoeba ──────────────────────────────────
    step("An organ system is a group of organs working together for a major function. The digestive system includes the mouth, "
         "oesophagus, stomach, intestines, liver and pancreas.",
         clear(2.2),
         heading("Organ systems"),
         write("Digestive system:", 70, 182, 27, "yellow"),
         write("mouth, oesophagus, stomach, intestines, liver, pancreas", 70, 220, 24),
         chapter="Organ systems, and why Amoeba is different"),

    step("The circulatory system is the heart, the blood and the blood vessels. The respiratory system takes in oxygen and removes carbon dioxide.",
         write("Circulatory system:", 70, 280, 27, "yellow"), write("heart, blood, blood vessels", 70, 318, 24),
         write("Respiratory system:", 660, 280, 27, "yellow"), write("takes in oxygen, removes CO_2", 660, 318, 24)),

    step("The systems work together. When you run, your muscles need more oxygen and glucose, so your breathing rate and heart rate both go up.",
         write("Running:  muscles need more oxygen and glucose,", 70, 386, 25, "blue"),
         write("so breathing rate and heart rate both rise.", 70 + text_width("Running:  ", 25), 420, 25, "blue")),

    step("But not every organism has these levels. Amoeba is just one cell. That single cell feeds, respires, removes waste, responds and reproduces. "
         "So Amoeba has no tissues, no organs and no organ systems.",
         curve([(1040, 500), (1110, 470), (1190, 486), (1236, 530), (1220, 590), (1160, 620), (1080, 610), (1030, 570)], "white", 3.6, closed=True),
         ellipse(1130, 545, 22, 18, "blue", 3.0),
         write("Amoeba:  one cell does it all.", 70, 494, 26, "pink"),
         write("feeds, respires, removes waste, responds, reproduces", 70, 534, 23),
         write("no tissues, organs or systems", 70, 572, 23, "pink"),
         pause=1.2),
]

THUMBNAIL = [
    write("Levels of Organisation", 54, 150, 70, "yellow"),
    write("Cell  >  Tissue  >  Organ  >  System  >  Organism", 60, 214, 32),
    *cell_icon(130, 400, 1.25, 5.0), *tissue_icon(380, 400, 1.25, 4.4), *heart_icon(640, 400, 1.3, 5.4),
    *system_icon(890, 400, 1.25, 4.6), *person_icon(1135, 410, 1.3, 5.4),
    *[arrow(a, 400, b, 400, "grey", 4.4) for a, b in [(205, 300), (465, 562), (722, 822), (965, 1065)]],
    *[write(n, x, 560, 30, "yellow", "center") for n, x in zip(["cell", "tissue", "organ", "system", "organism"], [130, 380, 640, 890, 1135])],
]
