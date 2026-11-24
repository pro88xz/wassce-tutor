"""Biology · Cell structure: plant and animal cells. A chalkboard video lesson.

Follows content/notes/biology-cell-structure.md: what a cell is and cell
theory, the animal cell and the plant cell (drawn and labelled, with the job
of each part), the paired differences WASSCE asks for, three specialised
cells, and the two mistakes examiners see most.
Check: python3 scripts/video/board_video.py content/videos/biology-cell-structure.py --boards .video-build/boards
"""

from board_video import (blob, box, clear, curve, dots, ellipse, heading, label, line, step, text_width, wave, write,
                         zigzag)

TITLE = "Plant and Animal Cells: Structure, Functions and Differences | WASSCE Biology"
DESCRIPTION = ("Watch the animal cell and plant cell drawn and labelled on the chalkboard, with the function of each "
               "organelle, cell theory, the differences WASSCE asks for, and specialised cells: root hair, red blood "
               "cell and sperm.")
LABEL = "WASSCE Tutor  ·  Biology  ·  Cell structure"

WRONG_X = 70 + text_width("Wrong:   ", 28)


# Notes under a label: smaller, grey.
def note(text, x, y):
    return write(text, x, y, 19, "grey")


def mitochondrion(cx, cy, rx=46, ry=20):
    return [ellipse(cx, cy, rx, ry, "pink", 3.0), zigzag(cx - rx + 10, cy, cx + rx - 10, cy, 6, ry * 0.55, "pink", 2.2)]


def chloroplast(cx, cy, rx, ry):
    inner = ([line(cx - rx * 0.55, cy - 4, cx + rx * 0.55, cy - 4, "green", 2.2), line(cx - rx * 0.55, cy + 5, cx + rx * 0.55, cy + 5, "green", 2.2)]
             if rx > ry else
             [line(cx - 4, cy - ry * 0.55, cx - 4, cy + ry * 0.55, "green", 2.2), line(cx + 5, cy - ry * 0.55, cx + 5, cy + ry * 0.55, "green", 2.2)])
    return [ellipse(cx, cy, rx, ry, "green", 3.0)] + inner


STEPS = [
    # ── 1. What a cell is ──────────────────────────────────────────────
    step("Every living thing, from a tiny bacterium to a mango tree to you, is made of cells. Today we look at what is inside them.",
         heading("Cell Structure"),
         chapter="What is a cell? Cell theory"),

    step("A cell is the smallest unit of a living organism that can carry out the processes of life.",
         write("A cell is the smallest structural and functional", 70, 172, 28),
         write("unit of a living organism.", 70, 214, 28)),

    step("Some organisms are just one cell, like many bacteria and amoeba. We call them unicellular. "
         "Plants and animals are multicellular: millions of cells, working together.",
         write("unicellular:", 70, 292, 27, "blue"), write("one cell  (bacteria, amoeba)", 330, 292, 27),
         write("multicellular:", 70, 340, 27, "blue"), write("many cells  (plants, animals)", 330, 340, 27)),

    step("Cell theory says three things. One: all living things are made of cells. "
         "Two: the cell is the basic unit of structure and function. "
         "Three: new cells come only from cells that already exist, by cell division.",
         write("Cell theory", 70, 428, 32, "yellow"),
         write("1.  All living things are made of cells.", 90, 480, 26),
         write("2.  The cell is the basic unit of structure and function.", 90, 524, 26),
         write("3.  New cells come from existing cells, by cell division.", 90, 568, 26)),

    # ── 2. The animal cell ─────────────────────────────────────────────
    step("Let us draw a typical animal cell.",
         clear(2.2),
         heading("The animal cell"),
         blob(340, 410, 250, 180, "white", 4.0, wobble=0.045, seed=4),
         chapter="Parts of an animal cell and their functions"),

    step("Its edge is the cell membrane. It is selectively permeable: it controls what enters and leaves the cell.",
         label("cell membrane", 700, 252, 548, 300),
         note("controls what enters and leaves", 700, 280)),

    step("The nucleus contains the genetic material, DNA. It controls the activities of the cell.",
         ellipse(290, 395, 72, 60, "blue", 3.6), dots([(282, 392), (290, 388), (296, 396), (286, 400)], "blue", 7),
         label("nucleus", 700, 332, 365, 392),
         note("contains DNA; controls the cell", 700, 360)),

    step("All around it is the cytoplasm, a jelly-like fluid where most of the chemical reactions of the cell take place.",
         label("cytoplasm", 700, 412, 430, 445),
         note("where most reactions take place", 700, 440)),

    step("These are mitochondria. They are the site of aerobic respiration, which releases energy from food and stores it as ATP.",
         *mitochondrion(482, 512), *mitochondrion(190, 280, 40, 17),
         label("mitochondrion", 700, 492, 530, 510),
         note("site of aerobic respiration", 700, 520)),

    step("And these tiny dots are ribosomes, where the cell makes its proteins.",
         dots([(330, 545), (348, 552), (366, 544), (352, 528), (318, 528), (384, 556), (300, 548), (168, 430), (186, 448), (150, 452)], "white", 4.2),
         label("ribosomes", 700, 572, 392, 552),
         note("make proteins", 700, 600)),

    # ── 3. The plant cell ──────────────────────────────────────────────
    step("A plant cell has all of these parts too. But it has three more, so let us draw one.",
         clear(2.2),
         heading("The plant cell"),
         box(110, 196, 460, 404, "white", 4.0),
         box(124, 210, 432, 376, "white", 2.6),
         ellipse(300, 548, 34, 28, "blue", 3.4), dots([(296, 546), (304, 550)], "blue", 7),
         chapter="Parts of a plant cell and their functions"),

    step("Outside the membrane is a cell wall, made of cellulose. It supports and protects the cell and gives it a regular shape. "
         "Unlike the membrane, the wall is freely permeable.",
         label("cellulose cell wall", 700, 214, 572, 232),
         note("support and shape; freely permeable", 700, 242),
         label("cell membrane", 700, 296, 558, 322),
         note("selectively permeable", 700, 324)),

    step("In the middle is a large permanent vacuole, full of cell sap. When it is full of water it pushes outwards and keeps the cell firm, or turgid.",
         blob(352, 380, 150, 118, "blue", 3.4, wobble=0.04, seed=9),
         write("cell sap", 300, 390, 22, "blue"),
         label("large permanent vacuole", 700, 384, 502, 384),
         note("cell sap; keeps the cell turgid", 700, 412)),

    step("And these are chloroplasts. They contain chlorophyll, which absorbs the light energy used in photosynthesis.",
         *chloroplast(232, 240, 30, 12), *chloroplast(430, 240, 30, 12), *chloroplast(160, 400, 12, 30), *chloroplast(530, 450, 12, 30),
         *chloroplast(196, 556, 30, 12),
         label("chloroplast", 700, 466, 542, 456),
         note("chlorophyll absorbs light", 700, 494)),

    step("The nucleus is pushed to the side by the vacuole.",
         label("nucleus", 700, 560, 334, 550)),

    # ── 4. Comparing them ──────────────────────────────────────────────
    step("WASSCE often asks for differences between plant and animal cells. Always give them in pairs: what the plant cell has, against what the animal cell has.",
         clear(2.2),
         heading("Plant cell  vs  animal cell"),
         write("Plant cell", 90, 190, 32, "green"), write("Animal cell", 680, 190, 32, "blue"),
         line(70, 212, 1200, 212, "grey", 2.6), line(640, 160, 640, 470, "grey", 2.6),
         chapter="Differences between plant and animal cells"),

    step("A plant cell has a cellulose cell wall. An animal cell has no cell wall.",
         write("cellulose cell wall", 90, 262, 27), write("no cell wall", 680, 262, 27)),
    step("A plant cell has chloroplasts. An animal cell has none.",
         write("chloroplasts", 90, 316, 27), write("no chloroplasts", 680, 316, 27)),
    step("A plant cell has one large permanent vacuole. An animal cell has only small, temporary vacuoles, if any.",
         write("large permanent vacuole", 90, 370, 27), write("small, temporary vacuoles", 680, 370, 27)),
    step("So a plant cell has a fixed, regular shape, while an animal cell's shape is irregular.",
         write("regular shape", 90, 424, 27), write("irregular shape", 680, 424, 27)),
    step("Both of them have a nucleus, cytoplasm, a cell membrane and mitochondria. Those are similarities, not differences.",
         write("Both:  nucleus,  cytoplasm,  cell membrane,  mitochondria", 90, 532, 27, "yellow")),

    # ── 5. Specialised cells ───────────────────────────────────────────
    step("In a large organism, cells become specialized. The shape of each cell suits the job it does. Here are three you must know.",
         clear(2.2),
         heading("Specialised cells"),
         chapter="Specialised cells: root hair, red blood cell, sperm"),

    step("A root hair cell has a long, thin extension that grows out between the soil particles. "
         "This gives a large surface area for absorbing water and mineral ions.",
         curve([(96, 196), (160, 190), (206, 204), (262, 220), (360, 226), (384, 234), (362, 244), (262, 246), (210, 256), (166, 286), (98, 282), (88, 240)], "white", 3.6, closed=True),
         ellipse(138, 238, 18, 15, "blue", 3.0),
         write("root hair cell", 470, 214, 30, "yellow"),
         write("long, thin extension: a large surface area", 470, 254, 24),
         write("for absorbing water and mineral ions", 470, 288, 24)),

    step("A red blood cell is a biconcave disc, thin in the middle. That shape gives a large surface area for taking up oxygen. "
         "It has no nucleus, so there is more room for haemoglobin.",
         ellipse(236, 404, 66, 60, "pink", 3.8), ellipse(236, 404, 28, 24, "pink", 2.4),
         write("red blood cell", 470, 384, 30, "yellow"),
         write("biconcave: a large surface area for oxygen", 470, 424, 24),
         write("no nucleus: more room for haemoglobin", 470, 458, 24)),

    step("A sperm cell has a tail, called a flagellum, to swim to the egg, and many mitochondria to supply the energy for swimming.",
         ellipse(130, 572, 34, 22, "white", 3.4), ellipse(190, 572, 26, 9, "pink", 3.0),
         wave(216, 572, 170, 11, 3, "white", 3.0),
         write("sperm cell", 470, 552, 30, "yellow"),
         write("flagellum (tail): swims to the egg", 470, 592, 24),
         write("many mitochondria: energy for swimming", 470, 626, 24)),

    # ── 6. Exam tips ───────────────────────────────────────────────────
    step("Two exam tips. First, never write that mitochondria make energy. Energy cannot be made. "
         "Write that they are the site of aerobic respiration, which releases energy from food as ATP.",
         clear(2.2),
         heading("Exam tips"),
         write("Wrong:", 70, 182, 28, "pink"), write("mitochondria make energy.", WRONG_X, 182, 28, "pink"),
         line(WRONG_X - 6, 170, WRONG_X + 8 + text_width("mitochondria make energy", 28), 170, "pink", 3.0),
         write("Right:  mitochondria are the site of aerobic", 70, 236, 28, "green"),
         write("respiration, which releases energy as ATP.", 182, 278, 28, "green"),
         chapter="Exam tips: mitochondria and drawing cells"),

    step("Second, when you draw a cell: use a sharp pencil and do not shade. Draw it large, with straight label lines that never cross. "
         "And always give your drawing a title.",
         write("Drawing a cell", 70, 372, 32, "yellow"),
         write("sharp pencil;  no shading", 90, 424, 27),
         write("large and clear;  straight label lines that never cross", 90, 468, 27),
         write("a title, such as:  A typical plant cell", 90, 512, 27),
         pause=1.2),
]

# What a student sees in search results: the question, and both cells.
THUMBNAIL = [
    write("Plant & Animal Cells", 54, 150, 70, "yellow"),
    write("Structure  ·  Functions  ·  Differences", 60, 214, 36),
    write("animal cell", 150, 278, 34, "blue"), write("plant cell", 790, 278, 34, "green"),
    blob(300, 470, 215, 155, "white", 6.0, wobble=0.045, seed=4),
    ellipse(270, 455, 62, 52, "blue", 5.0), dots([(266, 452), (274, 448), (278, 458)], "blue", 9),
    *mitochondrion(410, 540, 50, 21), *mitochondrion(185, 375, 42, 18),
    box(690, 300, 440, 330, "white", 6.0), box(706, 316, 408, 298, "white", 3.4),
    blob(910, 455, 140, 100, "blue", 5.0, wobble=0.04, seed=9),
    *chloroplast(780, 345, 32, 13), *chloroplast(1040, 345, 32, 13), *chloroplast(735, 470, 13, 32),
    *chloroplast(1085, 480, 13, 32),
    ellipse(800, 575, 34, 28, "blue", 4.4), dots([(796, 573), (804, 577)], "blue", 9),
]
