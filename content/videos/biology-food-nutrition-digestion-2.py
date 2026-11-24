"""Biology · The alimentary canal: digestion, enzymes and absorption. A chalkboard video lesson.

Follows content/notes/biology-food-nutrition-digestion-2.md: the alimentary
canal drawn and labelled in order, digestion in the mouth and stomach, the
enzymes (each with its substrate and products) and bile in the small
intestine, a villus and how it absorbs, and egestion against excretion.
Check: python3 scripts/video/board_video.py content/videos/biology-food-nutrition-digestion-2.py --boards .video-build/boards/gut
"""

from board_video import arrow, clear, curve, dots, ellipse, heading, label, line, moved, step, text_width, write

TITLE = "The Alimentary Canal: Digestion, Enzymes and Absorption | WASSCE Biology"
DESCRIPTION = ("The human alimentary canal drawn and labelled on the chalkboard: digestion in the mouth, stomach and "
               "small intestine, each enzyme with its substrate and products, bile, the villus and absorption, and "
               "egestion versus excretion.")
LABEL = "WASSCE Tutor  ·  Biology  ·  Digestion"
# The lesson page this video is on: /wassce/biology/food-nutrition-and-the-digestive-system/the-alimentary-canal-digestion-enzymes-and-absorption
LESSON = "biology/food-nutrition-and-the-digestive-system/the-alimentary-canal-digestion-enzymes-and-absorption"

# The canal, drawn in the left half of the board.
MOUTH = [(296, 150), (330, 140), (364, 150), (330, 166)]
STOMACH = [(338, 300), (372, 286), (430, 296), (468, 336), (458, 398), (410, 428), (356, 424), (330, 398), (346, 360)]
LIVER = [(150, 304), (230, 286), (318, 296), (326, 330), (290, 368), (200, 370), (156, 346)]
COILS = [(270, 476), (420, 480), (430, 504), (270, 508), (262, 532), (430, 536), (436, 560), (268, 566), (262, 590), (420, 594)]
COLON = [(236, 628), (222, 470), (300, 448), (420, 448), (484, 470), (488, 600), (430, 632), (360, 640)]


def canal():
    return [curve(MOUTH, "white", 3.2, closed=True),
            line(322, 166, 322, 296, "white", 3.0), line(340, 166, 340, 300, "white", 3.0),          # oesophagus
            curve(STOMACH, "white", 3.4, closed=True)]


def lower_canal():
    return [curve([(350, 424), (300, 446), (276, 470)], "white", 3.0),                             # duodenum
            curve(COILS, "white", 3.0),                                                           # ileum
            curve(COLON, "yellow", 3.6),                                                          # large intestine
            line(360, 640, 352, 666, "yellow", 3.6),                                              # rectum
            dots([(350, 672)], "pink", 10)]                                                       # anus


def accessory():
    return [curve(LIVER, "pink", 3.4, closed=True), ellipse(298, 384, 13, 18, "green", 3.0),
            ellipse(398, 448, 56, 11, "blue", 3.0)]


def villus(x, y):
    """One villus: a finger of lining one cell thick, a capillary network round
    it, and a lacteal up the middle."""
    return [curve([(x - 72, y + 250), (x - 70, y + 60), (x - 44, y + 4), (x, y - 10), (x + 44, y + 4), (x + 70, y + 60), (x + 72, y + 250)], "white", 3.6),
            curve([(x - 60, y + 250), (x - 58, y + 64), (x - 36, y + 18), (x, y + 6), (x + 36, y + 18), (x + 58, y + 64), (x + 60, y + 250)], "white", 1.8),
            curve([(x - 44, y + 250), (x - 42, y + 80), (x - 22, y + 36), (x, y + 30), (x + 22, y + 36), (x + 42, y + 80), (x + 44, y + 250)], "pink", 2.8),
            *[curve([(x - 43, y + 110 + 50 * k), (x - 20, y + 96 + 50 * k), (x + 20, y + 120 + 50 * k), (x + 43, y + 106 + 50 * k)], "pink", 2.0) for k in range(3)],
            curve([(x - 9, y + 250), (x - 9, y + 70), (x, y + 58), (x + 9, y + 70), (x + 9, y + 250)], "yellow", 2.8)]


STEPS = [
    # ── 1. The canal in order ──────────────────────────────────────────
    step("The alimentary canal is one long muscular tube, from the mouth to the anus. Let us draw it, and learn the parts in order.",
         heading("The alimentary canal"),
         chapter="The alimentary canal: the parts in order"),

    step("Food enters at the mouth, and is swallowed down the oesophagus, the gullet, into the stomach.",
         *canal(),
         label("mouth", 620, 168, 366, 152, 24),
         label("oesophagus (gullet)", 620, 236, 342, 236, 24),
         label("stomach", 620, 330, 470, 340, 24)),

    step("From the stomach it passes into the small intestine. Its first part is the duodenum, and its long coiled part is the ileum.",
         *lower_canal()[:2],
         label("duodenum", 620, 420, 304, 444, 24),
         label("small intestine (ileum)", 620, 512, 432, 520, 24)),

    step("Then comes the large intestine, then the rectum, and finally the anus.",
         *lower_canal()[2:],
         label("large intestine", 620, 586, 490, 586, 24, "yellow"),
         label("rectum", 40, 650, 352, 656, 22, "yellow"),
         label("anus", 40, 680 - 4, 342, 672, 22, "pink")),

    step("Three other organs pour juices into the canal, but food never passes through them: the liver, the gall bladder, and the pancreas.",
         *accessory(),
         label("liver", 40, 272, 180, 304, 24, "pink"),
         label("gall bladder", 40, 420, 284, 388, 22, "green"),
         label("pancreas", 620, 466, 454, 450, 24, "blue")),

    # ── 2. Mouth and stomach ───────────────────────────────────────────
    step("Digestion breaks large, insoluble food into small, soluble molecules. Mechanical digestion is chewing and churning. Chemical digestion uses enzymes.",
         clear(2.2),
         heading("The mouth and the stomach"),
         write("mechanical:  teeth chew;  the stomach churns", 70, 176, 25),
         write("chemical:  enzymes break molecules down", 70, 214, 25),
         chapter="Digestion in the mouth and the stomach"),

    step("In the mouth, teeth cut and grind the food. Saliva moistens it, and its enzyme, salivary amylase, begins to digest starch into maltose. The tongue rolls the food into a ball, a bolus.",
         write("Mouth", 70, 290, 28, "yellow"),
         write("saliva:  salivary amylase", 90, 330, 24),
         write("starch", 90, 368, 24, "blue"), arrow(90 + text_width("starch ", 24), 360, 90 + text_width("starch ", 24) + 70, 360, "white", 2.8),
         write("maltose", 90 + text_width("starch ", 24) + 90, 368, 24, "blue")),

    step("Food moves along the canal by peristalsis: waves of muscle squeezing behind it. It works even when you lie down.",
         line(700, 300, 1180, 300, "white", 3.0), line(700, 360, 1180, 360, "white", 3.0),
         curve([(760, 300), (780, 318), (800, 300)], "pink", 3.0), curve([(760, 360), (780, 342), (800, 360)], "pink", 3.0),
         ellipse(880, 330, 34, 22, "yellow", 3.0), arrow(940, 330, 1040, 330, "yellow", 3.0),
         write("peristalsis:  waves of muscle", 700, 410, 24)),

    step("In the stomach, gastric juice contains hydrochloric acid and the enzyme pepsin. The acid kills germs and gives pepsin the acid conditions it needs. Pepsin begins to digest protein into peptides.",
         write("Stomach", 70, 470, 28, "yellow"),
         write("hydrochloric acid:  kills germs;  acid for pepsin", 90, 510, 24),
         write("protein", 90, 550, 24, "blue"), arrow(90 + text_width("protein ", 24), 542, 90 + text_width("protein ", 24) + 70, 542, "white", 2.8),
         write("peptides   (pepsin)", 90 + text_width("protein ", 24) + 90, 550, 24, "blue"),
         write("Mucus protects the stomach wall from its own acid.", 90, 592, 22, "grey")),

    # ── 3. Small intestine: bile and enzymes ───────────────────────────
    step("In the duodenum, two juices arrive. Bile comes from the liver, stored in the gall bladder. Pancreatic juice comes from the pancreas.",
         clear(2.2),
         heading("The small intestine"),
         write("bile:  from the liver, stored in the gall bladder", 70, 176, 24),
         write("pancreatic juice:  from the pancreas", 70, 212, 24),
         chapter="Enzymes and bile in the small intestine"),

    step("Bile is not an enzyme. It neutralises the acid from the stomach, and it emulsifies fats: it breaks big fat drops into tiny droplets, which gives lipase a much larger surface to work on.",
         write("Bile is NOT an enzyme:", 70, 270, 26, "pink"),
         write("neutralises acid;  emulsifies fats", 90, 306, 24),
         ellipse(830, 280, 60, 44, "yellow", 3.2), arrow(908, 280, 990, 280, "white", 3.0),
         *[ellipse(1010 + dx, 260 + dy, 12, 9, "yellow", 2.4) for dx, dy in [(0, 0), (40, 10), (80, -6), (20, 36), (64, 34), (106, 22)]]),

    step("Here are the enzymes, each with its substrate and products. From the pancreas: amylase turns starch to maltose, trypsin turns protein to peptides, and lipase turns fats to fatty acids and glycerol.",
         write("Enzyme", 70, 378, 21, "grey"), write("Substrate", 420, 378, 21, "grey"), write("Products", 720, 378, 21, "grey"),
         line(60, 392, 1200, 392, "grey", 2.2),
         write("amylase", 70, 432, 24, "yellow"), write("starch", 420, 432, 24), write("maltose", 720, 432, 24),
         write("trypsin", 70, 472, 24, "yellow"), write("protein", 420, 472, 24), write("peptides", 720, 472, 24),
         write("lipase", 70, 512, 24, "yellow"), write("fats", 420, 512, 24), write("fatty acids + glycerol", 720, 512, 24)),

    step("Enzymes in the lining of the intestine finish the job, giving glucose and amino acids. Enzymes are biological catalysts: they speed up reactions without being used up, and too much heat denatures them.",
         write("intestinal enzymes", 70, 552, 24, "yellow"), write("maltose, peptides", 420, 552, 24), write("glucose, amino acids", 720, 552, 24),
         write("Enzymes:  biological catalysts;  not used up;  denatured by heat.", 70, 620, 23, "green")),

    # ── 4. Absorption ──────────────────────────────────────────────────
    step("The digested food is absorbed in the ileum. Its lining is folded into millions of tiny fingers, called villi. Here is one villus.",
         clear(2.2),
         heading("Absorption:  the villus"),
         *villus(250, 220),
         chapter="Absorption in the ileum: the villus"),

    step("Its wall is only one cell thick, so the path is short. It has a rich network of blood capillaries, which take away glucose and amino acids. "
         "In the middle is a lacteal, which takes away the products of fat digestion.",
         label("wall:  one cell thick", 480, 250, 316, 262, 24),
         label("blood capillaries:  glucose, amino acids", 480, 340, 290, 340, 24, "pink"),
         label("lacteal:  fats", 480, 430, 258, 430, 24, "yellow")),

    step("Villi, and the even smaller microvilli on their cells, give a huge surface area for absorption.",
         write("villi + microvilli:  a huge surface area", 480, 520, 24, "green")),

    step("Do not mix two words. Absorption is taking digested food into the blood or lymph. Assimilation is when the body cells use it, for example to build proteins.",
         write("absorption:  into the blood or lymph", 480, 588, 23, "blue"),
         write("assimilation:  used by the body's cells", 480, 622, 23, "blue")),

    # ── 5. Large intestine, egestion ───────────────────────────────────
    step("The large intestine absorbs most of the remaining water. What is left, the undigested food, becomes faeces, stored in the rectum and passed out through the anus. This is egestion.",
         clear(2.2),
         heading("Egestion"),
         write("large intestine:  absorbs water", 70, 182, 26),
         write("egestion:  undigested food passed out as faeces", 70, 226, 26),
         chapter="Egestion versus excretion, and exam tips"),

    step("Egestion is not excretion. Excretion removes waste made by the body's cells, such as urea and carbon dioxide. Faeces were never made by your cells.",
         write("excretion:  waste MADE by cells (urea, CO_2)", 70, 290, 26, "pink"),
         write("egestion:  undigested food (never made by cells)", 70, 334, 26, "pink")),

    step("In the exam: draw the canal in the right order, and for every enzyme give three things: its substrate, where it works, and its products. And remember, bile is not an enzyme.",
         write("Exam:", 70, 430, 28, "yellow"),
         write("draw the canal in the right order;", 90, 472, 24),
         write("each enzyme:  substrate,  where,  products;", 90, 510, 24),
         write("bile is not an enzyme.", 90, 548, 24),
         pause=1.2),
]

THUMBNAIL = [
    write("Digestion", 54, 150, 80, "yellow"),
    write("Alimentary canal  ·  Enzymes  ·  Villi", 60, 214, 32),
    *moved(canal() + lower_canal() + accessory(), dx=640, dy=96, scale=0.8),
    write("amylase", 90, 340, 44, "yellow"), write("pepsin", 90, 420, 44, "yellow"),
    write("lipase", 90, 500, 44, "yellow"), write("bile", 90, 580, 44, "green"),
]
