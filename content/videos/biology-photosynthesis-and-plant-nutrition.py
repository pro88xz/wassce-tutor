"""Biology · Photosynthesis and plant nutrition. A chalkboard video lesson.

Follows content/notes/biology-photosynthesis-and-plant-nutrition.md: what
photosynthesis is and where it happens, the word and balanced equations (with
the atoms checked), how carbon dioxide, water and light reach the leaf, what
the plant does with glucose, nitrate and magnesium, limiting factors on a
graph, and the starch test with the experiment that shows light is needed.
Check: python3 scripts/video/board_video.py content/videos/biology-photosynthesis-and-plant-nutrition.py --boards .video-build/boards/photo
"""

from board_video import arrow, box, clear, curve, ellipse, heading, label, line, step, text_width, write

TITLE = "Photosynthesis: Equation, Limiting Factors and the Starch Test | WASSCE Biology"
DESCRIPTION = ("Photosynthesis explained on the chalkboard: the word and balanced equations, how carbon dioxide, water "
               "and light reach the leaf, uses of glucose, nitrate and magnesium, limiting factors, and testing a leaf "
               "for starch.")
LABEL = "WASSCE Tutor  ·  Biology  ·  Photosynthesis"
# The lesson page this video is on: /wassce/biology/photosynthesis-and-plant-nutrition/what-photosynthesis-is-and-why-it-matters
LESSON = "biology/photosynthesis-and-plant-nutrition/what-photosynthesis-is-and-why-it-matters"


def equation(left, right, y, size, x=70, above="", below=""):
    """left -> right, with the conditions written over and under the arrow."""
    wl = text_width(left, size)
    a0 = x + wl + 22
    a1 = a0 + max(150, text_width(above, 20) + 24, text_width(below, 20) + 24)
    parts = [write(left, x, y, size), arrow(a0, y - size * 0.4, a1, y - size * 0.4, "white", 3.2),
             write(right, a1 + 22, y, size)]
    if above:
        parts.append(write(above, (a0 + a1) / 2, y - size * 0.4 - 14, 20, "yellow", "center"))
    if below:
        parts.append(write(below, (a0 + a1) / 2, y - size * 0.4 + 32, 20, "green", "center"))
    return parts


def chloroplast(cx, cy, rx, ry, width=3.0):
    return [ellipse(cx, cy, rx, ry, "green", width),
            line(cx - rx * 0.55, cy - 5, cx + rx * 0.55, cy - 5, "green", 2.2), line(cx - rx * 0.55, cy + 5, cx + rx * 0.55, cy + 5, "green", 2.2)]


def sun(cx, cy, r=34):
    import math
    rays = [line(cx + (r + 10) * math.cos(a), cy + (r + 10) * math.sin(a), cx + (r + 26) * math.cos(a), cy + (r + 26) * math.sin(a), "yellow", 3.0)
            for a in [i * math.pi / 4 for i in range(8)]]
    return [ellipse(cx, cy, r, r, "yellow", 3.6)] + rays


LEAF_R = [(332, 300), (392, 252), (472, 226), (566, 230), (524, 282), (444, 312), (372, 316)]
LEAF_L = [(328, 384), (270, 344), (190, 328), (116, 338), (160, 380), (232, 398), (300, 396)]

STEPS = [
    # ── 1. What it is ──────────────────────────────────────────────────
    step("Green plants do not eat. They make their own food, and the process they use is called photosynthesis.",
         heading("Photosynthesis"),
         chapter="What is photosynthesis?"),

    step("Photosynthesis is the process by which green plants use light energy to make glucose from carbon dioxide and water, giving out oxygen.",
         write("Green plants use light energy to make glucose", 70, 180, 28),
         write("from carbon dioxide and water, giving out oxygen.", 70, 222, 28)),

    step("It happens in the chloroplasts. They contain the green pigment chlorophyll, which absorbs the light.",
         *chloroplast(130, 318, 52, 22, 3.4),
         write("Where:  in chloroplasts.", 220, 312, 27, "green"),
         write("Chlorophyll (green pigment) absorbs the light.", 220, 350, 27, "green")),

    step("So light energy is changed into chemical energy, which is stored in the glucose.",
         write("light energy", 70, 450, 30, "yellow"),
         arrow(70 + text_width("light energy", 30) + 20, 438, 70 + text_width("light energy", 30) + 120, 438, "white", 3.2),
         write("chemical energy  (stored in glucose)", 70 + text_width("light energy", 30) + 140, 450, 30, "yellow")),

    # ── 2. The equations ───────────────────────────────────────────────
    step("Here is the word equation. Carbon dioxide plus water, using light energy and chlorophyll, gives glucose plus oxygen.",
         clear(2.2),
         heading("The equation"),
         write("Word equation", 70, 170, 24, "grey"),
         *equation("carbon dioxide + water", "glucose + oxygen", 240, 32, above="light energy", below="chlorophyll"),
         chapter="The photosynthesis equation: word and balanced"),

    step("And here is the balanced equation. Six molecules of carbon dioxide and six of water make one molecule of glucose and six molecules of oxygen.",
         write("Balanced equation", 70, 330, 24, "grey"),
         *equation("6CO_2 + 6H_2O", "C_6H_{12}O_6 + 6O_2", 400, 40, above="light energy", below="chlorophyll")),

    step("Check that it balances. Six carbon atoms on each side. Twelve hydrogen atoms on each side. And eighteen oxygen atoms on each side.",
         write("Check the atoms:", 70, 500, 24, "grey"),
         write("C:  6 = 6", 70, 556, 30, "blue"), write("H:  12 = 12", 320, 556, 30, "blue"), write("O:  18 = 18", 600, 556, 30, "blue"),
         write("Learn to write it exactly like this.", 70, 630, 26, "pink")),

    # ── 3. Raw materials reach the leaf ────────────────────────────────
    step("How do the raw materials get to the leaf? Here is a plant, with its leaves, stem and roots.",
         clear(2.2),
         heading("Into and out of the leaf"),
         line(70, 560, 660, 560, "grey", 3.0),
         line(330, 560, 330, 300, "white", 4.0),
         curve(LEAF_R, "green", 3.6, closed=True), line(334, 300, 552, 236, "green", 2.2),
         curve(LEAF_L, "green", 3.6, closed=True), line(326, 384, 132, 340, "green", 2.2),
         curve([(330, 560), (312, 600), (284, 632)], "white", 3.2), curve([(330, 560), (346, 604), (372, 636)], "white", 3.2),
         curve([(330, 560), (332, 608), (324, 648)], "white", 3.2),
         chapter="How carbon dioxide, water and light reach the leaf"),

    step("Light from the sun is absorbed by the chlorophyll in the leaf.",
         *sun(780, 160), arrow(744, 184, 584, 240, "yellow", 3.2),
         write("light", 836, 236, 26, "yellow")),

    step("Carbon dioxide from the air diffuses into the leaf through tiny pores, called stomata.",
         arrow(830, 312, 586, 268, "blue", 3.2),
         write("carbon dioxide", 844, 318, 26, "blue"), write("in through the stomata", 844, 348, 21, "grey")),

    step("Water is absorbed from the soil by the roots, and carried up the stem in the xylem.",
         arrow(356, 548, 356, 326, "blue", 3.2),
         write("water", 380, 470, 26, "blue"), write("up the stem in the xylem", 380, 500, 21, "grey"),
         write("roots absorb water", 400, 626, 21, "grey")),

    step("And oxygen, the by-product, diffuses out of the leaf through the same stomata.",
         arrow(534, 292, 826, 418, "pink", 3.2),
         write("oxygen", 840, 432, 26, "pink"), write("out through the stomata", 840, 462, 21, "grey")),

    # ── 4. Uses of glucose; minerals ───────────────────────────────────
    step("What does the plant do with the glucose it makes?",
         clear(2.2),
         heading("Glucose and minerals"),
         write("glucose", 80, 368, 42, "yellow"),
         chapter="What the plant does with glucose; nitrate and magnesium"),

    step("Some is used at once in respiration, to release energy. Some is changed into sucrose and carried round the plant in the phloem.",
         arrow(282, 340, 380, 206, "grey", 2.8), write("respiration:  releases energy", 394, 214, 24),
         arrow(282, 348, 380, 286, "grey", 2.8), write("sucrose:  carried in phloem", 394, 294, 24)),

    step("Some is stored as starch. And some is used to build cellulose for new cell walls, and, with minerals, to make proteins.",
         arrow(284, 358, 380, 368, "grey", 2.8), write("starch:  stored", 394, 376, 24),
         arrow(282, 368, 380, 448, "grey", 2.8), write("cellulose:  new cell walls", 394, 456, 24),
         arrow(280, 376, 380, 528, "grey", 2.8), write("proteins  (with nitrate)", 394, 536, 24)),

    step("Plants also need mineral ions from the soil. Nitrate is needed to make amino acids and proteins. "
         "Magnesium is needed to make chlorophyll, so a plant short of magnesium has yellow leaves.",
         write("Minerals from the soil", 890, 200, 22, "yellow"),
         write("nitrate:", 890, 252, 23, "blue"), write("amino acids, proteins", 890, 282, 21),
         write("magnesium:", 890, 342, 23, "blue"), write("chlorophyll", 890, 372, 21),
         write("short of magnesium:", 890, 432, 21, "pink"), write("yellow leaves", 890, 462, 21, "pink")),

    # ── 5. Limiting factors ────────────────────────────────────────────
    step("Three things control how fast photosynthesis goes: light intensity, carbon dioxide concentration and temperature. Look at this graph.",
         clear(2.2),
         heading("Limiting factors"),
         arrow(140, 572, 140, 176, "white", 3.2), arrow(128, 560, 720, 560, "white", 3.2),
         write("rate of photosynthesis", 64, 160, 22, "grey"),
         write("light intensity", 560, 604, 22, "grey"),
         chapter="Factors affecting the rate of photosynthesis (limiting factors)"),

    step("As the light gets brighter, the rate goes up. Here, light is the limiting factor: it is the one in shortest supply.",
         curve([(142, 548), (220, 468), (300, 388), (350, 336)], "yellow", 3.8),
         write("light is limiting", 262, 470, 22, "pink")),

    step("But then the rate levels off. More light no longer helps, because something else, such as carbon dioxide or temperature, is now limiting.",
         curve([(350, 336), (400, 298), (470, 284), (560, 280), (700, 279)], "yellow", 3.8),
         write("now CO_2 or temperature limits", 300, 250, 22, "green")),

    step("A limiting factor is the factor in shortest supply. It holds back the rate, even when everything else is plentiful.",
         write("Limiting factor:", 790, 260, 27, "yellow"),
         write("the factor in shortest supply;", 790, 300, 23), write("it holds back the rate.", 790, 332, 23)),

    step("Temperature matters because photosynthesis is controlled by enzymes. The rate rises up to an optimum temperature, "
         "but above it the enzymes are denatured, and the rate falls.",
         write("Temperature:", 790, 420, 27, "yellow"),
         write("enzymes work faster, up to", 790, 460, 23), write("an optimum;  above it, they", 790, 492, 23),
         write("are denatured:  the rate falls.", 790, 524, 23)),

    # ── 6. The starch test ─────────────────────────────────────────────
    step("We cannot see glucose in a leaf, but much of it is stored as starch, and starch is easy to test for. Here is the method.",
         clear(2.2),
         heading("Testing a leaf for starch"),
         chapter="Testing a leaf for starch: experiment steps"),

    step("One: boil the leaf in water for a minute. This kills it and stops all its reactions.",
         write("1.  Boil the leaf in water:  kills it.", 70, 180, 26)),
    step("Two: put it in warm ethanol, in a water bath, to remove the chlorophyll. Ethanol catches fire easily, so never heat it over a flame.",
         write("2.  Warm ethanol, in a water bath:  removes chlorophyll.", 70, 226, 26),
         write("No naked flame:  ethanol catches fire.", 120, 262, 22, "pink")),
    step("Three: dip it in warm water, to soften it.",
         write("3.  Dip in warm water:  softens the leaf.", 70, 310, 26)),
    step("Four: spread it on a white tile and add iodine solution. Blue-black means starch is present. If it stays yellow-brown, there is no starch.",
         write("4.  Add iodine solution.", 70, 356, 26),
         write("blue-black:  starch present", 120, 396, 24, "blue"),
         write("yellow-brown:  no starch", 120, 430, 24, "yellow")),

    step("To show that light is needed: first keep the plant in the dark for two days, to remove its starch. Then cover part of a leaf with black paper, "
         "and leave the plant in the light. After the test, only the uncovered part turns blue-black.",
         curve([(790, 556), (846, 492), (950, 462), (1066, 470), (1166, 526), (1088, 598), (966, 626), (856, 614)], "green", 3.6, closed=True),
         box(960, 452, 60, 186, "grey", 3.0),
         label("black paper", 1050, 432, 1010, 452, 20, "grey"),
         write("blue-black", 812, 556, 20, "blue"),
         write("Light needed:", 790, 390, 26, "yellow"),
         write("Plant in the dark for two days first.", 70, 520, 24, "grey"),
         write("Then cover part of a leaf;  leave in light.", 70, 556, 24, "grey"),
         write("Only the uncovered part turns blue-black.", 70, 592, 24, "green"),
         pause=1.2),
]

THUMBNAIL = [
    write("Photosynthesis", 54, 150, 78, "yellow"),
    write("Equation  ·  Limiting factors  ·  Starch test", 60, 214, 32),
    *sun(1060, 330, 46),
    curve([(420, 470), (520, 380), (660, 336), (840, 344), (760, 420), (620, 470), (500, 480)], "green", 6.0, closed=True),
    line(424, 470, 822, 348, "green", 3.6), line(420, 470, 420, 540, "white", 6.0),
    arrow(1006, 362, 852, 380, "yellow", 5.0),
    write("6CO_2 + 6H_2O", 60, 600, 40), write("C_6H_{12}O_6 + 6O_2", 600, 600, 40),
    arrow(60 + text_width("6CO_2 + 6H_2O", 40) + 22, 584, 584, 584, "white", 4.0),
]
