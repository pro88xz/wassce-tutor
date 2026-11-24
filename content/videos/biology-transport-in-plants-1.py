"""Biology · Transport in plants: absorbing water and mineral ions. A chalkboard video lesson.

Follows content/notes/biology-transport-in-plants-1.md: why plants need a
transport system, how a root hair absorbs water by osmosis (with the exam
definition), mineral ions by active transport (compared with osmosis), the
path across the root to the xylem (a root in section), and how xylem vessels
are adapted.
Check: python3 scripts/video/board_video.py content/videos/biology-transport-in-plants-1.py --boards .video-build/boards/transport
"""

import math

from board_video import (arrow, box, clear, curve, dots, ellipse, heading, label, line, step, text_width, write)

TITLE = "Transport in Plants: Root Hairs, Osmosis, Active Transport and Xylem | WASSCE Biology"
DESCRIPTION = ("How plants absorb water and mineral ions, on the chalkboard: root hair cells and osmosis, active "
               "transport compared with osmosis, the path across the root to the xylem, and how xylem vessels are "
               "adapted.")
LABEL = "WASSCE Tutor  ·  Biology  ·  Transport in plants"
# The lesson page this video is on: /wassce/biology/transport-in-plants/transport-in-plants-absorption-of-water-and-mineral-ions
LESSON = "biology/transport-in-plants/transport-in-plants-absorption-of-water-and-mineral-ions"


def root_hair(dx=0, dy=0, s=1.0, width=3.6):
    pts = [(96, 196), (160, 190), (206, 204), (262, 220), (360, 226), (384, 234), (362, 244), (262, 246), (210, 256), (166, 286), (98, 282), (88, 240)]
    return [curve([(dx + x * s, dy + y * s) for x, y in pts], "white", width, closed=True),
            ellipse(dx + 138 * s, dy + 238 * s, 18 * s, 15 * s, "blue", width * 0.85)]


# A root in section, centred here.
RX, RY = 330, 410


def root_section():
    out = [ellipse(RX, RY, 205, 205, "white", 3.6)]
    for a in (150, 175, 200, 25, 345):   # root hairs
        t = math.radians(a)
        out.append(curve([(RX + 205 * math.cos(t), RY + 205 * math.sin(t)), (RX + 236 * math.cos(t + 0.03), RY + 236 * math.sin(t + 0.03)),
                          (RX + 262 * math.cos(t - 0.02), RY + 262 * math.sin(t - 0.02))], "white", 3.0))
    for r, n in ((175, 18), (140, 15), (112, 12)):   # cortex cells
        for k in range(n):
            t = 2 * math.pi * k / n + r
            out.append(ellipse(RX + r * math.cos(t), RY + r * math.sin(t), 14, 11, "grey", 2.0))
    out.append(ellipse(RX, RY, 88, 88, "pink", 3.4))                       # endodermis
    star = []
    for k in range(8):                                                     # xylem: a cross
        t = math.pi / 4 * k
        r = 64 if k % 2 == 0 else 22
        star.append((RX + r * math.cos(t), RY + r * math.sin(t)))
    out.append(curve(star, "blue", 3.4, closed=True))
    for k in range(4):                                                     # phloem between its arms
        t = math.pi / 4 + math.pi / 2 * k
        out.append(ellipse(RX + 52 * math.cos(t), RY + 52 * math.sin(t), 12, 10, "green", 2.8))
    return out


def vessel(x, y0, y1, w=70, spiral=False):
    out = [line(x, y0, x, y1, "white", 3.4), line(x + w, y0, x + w, y1, "white", 3.4)]
    if spiral:
        out += [line(x + 2, y, x + w - 2, y + 18, "yellow", 2.4) for y in range(y0 + 10, y1 - 20, 22)]
    else:
        out += [line(x + 3, y, x + w - 3, y, "yellow", 2.6) for y in range(y0 + 14, y1 - 6, 26)]
    return out


STEPS = [
    # ── 1. Why transport ───────────────────────────────────────────────
    step("A plant needs water: for photosynthesis, as a solvent for its reactions, and to keep its cells firm. "
         "It also needs mineral ions, such as nitrate, magnesium and phosphate.",
         heading("Transport in Plants"),
         write("Water:  photosynthesis;  a solvent;  keeps cells turgid", 70, 180, 26),
         write("Mineral ions:  nitrate,  magnesium,  phosphate", 70, 222, 26),
         chapter="Why plants need a transport system"),

    step("A tiny plant can rely on diffusion. But a large plant has long roots, stems and leaves, so it needs transport tissues to carry things over long distances.",
         write("A large plant needs transport tissues:", 70, 300, 28, "yellow")),

    step("Two of them. Xylem carries water and mineral ions up from the roots. Phloem carries dissolved sugars from the leaves to where they are needed.",
         write("xylem:", 110, 356, 28, "blue"), write("water and mineral ions, up from the roots", 270, 356, 26),
         write("phloem:", 110, 404, 28, "green"), write("dissolved sugars, from the leaves", 270, 404, 26),
         write("This lesson:  how water and minerals get in.", 70, 500, 26, "pink")),

    # ── 2. Root hairs and osmosis ──────────────────────────────────────
    step("Water enters the plant through root hair cells. Each one has a long, thin extension that grows out between the soil particles.",
         clear(2.2),
         heading("Root hairs absorb water"),
         *root_hair(-10, 0, 1.45),
         *[ellipse(x, y, 26, 18, "grey", 2.6) for x, y in [(430, 236), (520, 290), (600, 380), (470, 420), (360, 430), (600, 250), (250, 470)]],
         chapter="How root hairs absorb water by osmosis"),

    step("The soil water is dilute. The cell sap inside the root hair is more concentrated. So water moves into the cell by osmosis.",
         *[arrow(x0, y0, x1, y1, "blue", 3.0) for x0, y0, x1, y1 in [(440, 258, 446, 306), (548, 304, 520, 326), (466, 400, 458, 368), (368, 410, 378, 372)]],
         write("soil water:  dilute", 640, 210, 24, "blue"), write("higher water potential", 640, 240, 21, "grey"),
         write("cell sap:  concentrated", 640, 300, 24, "yellow"), write("lower water potential", 640, 330, 21, "grey")),

    step("Here is the exam definition. Osmosis is the net movement of water molecules from a region of higher water potential to a region of lower water potential, "
         "through a selectively permeable membrane.",
         box(60, 520, 1150, 118, "yellow", 3.0),
         write("Osmosis:  net movement of water from higher to lower water", 84, 566, 25),
         write("potential, through a selectively permeable membrane.", 84 + text_width("Osmosis:  ", 25), 608, 25)),

    step("The root hair is well suited to this. It is long, which gives a large surface area. Its wall is thin, so the path for water is short. And there are thousands of them.",
         write("long:  large surface area", 640, 396, 24, "green"),
         write("thin wall:  short pathway", 640, 432, 24, "green"),
         write("thousands of them", 640, 468, 24, "green")),

    # ── 3. Mineral ions: active transport ──────────────────────────────
    step("Mineral ions are often more concentrated inside the root hair than in the soil. To take in more, the plant must move them against the concentration gradient.",
         clear(2.2),
         heading("Mineral ions:  active transport"),
         line(322, 210, 322, 480, "white", 3.2), line(340, 210, 340, 480, "white", 3.2),
         dots([(110, 250), (220, 300), (150, 410), (270, 450)], "blue", 9),
         dots([(400, 250), (450, 290), (530, 250), (580, 320), (410, 360), (490, 400), (570, 430), (430, 450), (520, 320), (620, 380), (470, 230)], "blue", 9),
         write("soil:  few ions", 70, 200, 22, "grey"), write("cell:  many ions", 380, 200, 22, "grey"),
         chapter="Absorbing mineral ions: active transport"),

    step("It does this by active transport. Carrier proteins in the membrane pump the ions in, using energy from respiration.",
         box(316, 316, 30, 56, "pink", 3.0),
         arrow(190, 344, 460, 344, "yellow", 3.4),
         write("carrier protein", 90, 530, 22, "pink"), line(200, 508, 324, 376, "grey", 2.2),
         write("energy (ATP) from respiration", 380, 530, 22, "yellow"), line(480, 508, 348, 372, "grey", 2.2)),

    step("So active transport is the movement of substances against their concentration gradient, using energy from respiration.",
         write("Active transport:", 800, 210, 27, "yellow"),
         write("against the concentration", 800, 250, 24), write("gradient,  using energy", 800, 282, 24),
         write("from respiration.", 800, 314, 24)),

    step("Do not confuse the two. Osmosis moves water, down a water potential gradient, with no energy. Active transport moves ions, against a gradient, and needs energy.",
         write("osmosis:", 90, 594, 25, "blue"), write("water;  down a gradient;  no energy", 420, 594, 24),
         write("active transport:", 90, 634, 25, "pink"), write("ions;  against a gradient;  needs energy", 420, 634, 24)),

    step("That is why waterlogged soil is bad for plants. With little oxygen, root cells respire less, so they absorb fewer mineral ions.",
         write("Waterlogged soil:  little oxygen,", 800, 400, 21, "grey"), write("less respiration,  fewer ions", 800, 430, 21, "grey"),
         write("absorbed.", 800, 460, 21, "grey")),

    # ── 4. Across the root ─────────────────────────────────────────────
    step("From the root hair, water moves across the root to the xylem in the centre. Here is a root, cut across.",
         clear(2.2),
         heading("Across the root to the xylem"),
         *root_section(),
         chapter="From the root hair to the xylem"),

    step("Water passes from cell to cell through the cortex.",
         arrow(70, RY - 30, 262, RY - 8, "blue", 3.6),
         label("root hair", 720, 220, RX + 236 * math.cos(math.radians(345)), RY + 236 * math.sin(math.radians(345)), 24),
         label("cortex", 720, 300, RX + 160, RY - 36, 24)),

    step("Then it crosses the endodermis. Here a waterproof band in the cell walls, the Casparian strip, makes water pass through the cell membranes, "
         "so the plant controls what enters the xylem.",
         label("endodermis", 720, 380, RX + 88, RY - 8, 24),
         write("Casparian strip:  water must", 720, 408, 20, "grey"), write("pass through cell membranes", 720, 432, 20, "grey")),

    step("And so it reaches the xylem, in the centre. The phloem lies between the arms of the xylem.",
         label("xylem", 720, 474, RX + 62, RY + 2, 24, "blue"),
         label("phloem", 720, 548, RX + 44, RY + 44, 24, "green")),

    # ── 5. Xylem vessels ───────────────────────────────────────────────
    step("Xylem vessels are well adapted to carry water. They are made of dead cells, joined end to end, which have lost their contents. That leaves a continuous hollow tube.",
         clear(2.2),
         heading("Xylem vessels"),
         *vessel(110, 170, 620), *vessel(220, 170, 620, spiral=True),
         label("hollow, no contents:  a continuous tube", 400, 230, 290, 250, 25),
         chapter="How xylem vessels are adapted"),

    step("Their end walls have gone, so water flows with little resistance.",
         label("no end walls:  little resistance", 400, 330, 290, 340, 25)),

    step("And their walls are strengthened with lignin, in rings or spirals. Lignin makes them strong, so they do not collapse as water is pulled up, and it also helps to support the plant.",
         label("lignin in rings or spirals:", 400, 430, 290, 430, 25, "yellow"),
         write("strong walls that do not collapse;  support", 400, 464, 23)),

    step("One last exam point. Xylem carries water and mineral ions. It does not carry food. Sugars are carried in the phloem.",
         write("Xylem does not carry food.", 400, 560, 27, "pink"), write("Sugars are carried in the phloem.", 400, 600, 25, "pink"),
         pause=1.2),
]

THUMBNAIL = [
    write("Transport in Plants", 54, 150, 72, "yellow"),
    write("Root hairs  ·  Osmosis  ·  Xylem", 60, 214, 34),
    *root_hair(10, 140, 1.6, 5.4),
    *[ellipse(x, y, 30, 21, "grey", 3.6) for x, y in [(520, 420), (610, 500), (450, 560), (640, 380)]],
    *[arrow(x0, y0, x1, y1, "blue", 4.6) for x0, y0, x1, y1 in [(560, 470, 500, 512), (470, 450, 440, 492), (600, 420, 540, 470)]],
    *vessel(860, 270, 650, 80), *vessel(990, 270, 650, 80, spiral=True),
    arrow(1110, 600, 1110, 300, "blue", 5.0),
]
