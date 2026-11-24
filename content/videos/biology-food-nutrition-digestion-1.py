"""Biology · Food and nutrition: classes of food, a balanced diet and deficiency diseases. A chalkboard video lesson.

Follows content/notes/biology-food-nutrition-digestion-1.md: food, nutrients,
nutrition and digestion; the six classes of food with their jobs and Sierra
Leone sources (and the food tests for starch and sugar); vitamins and minerals
with their deficiency diseases; a balanced plate; malnutrition; and the two
mistakes examiners see most.
Check: python3 scripts/video/board_video.py content/videos/biology-food-nutrition-digestion-1.py --boards .video-build/boards/food
"""

import math

from board_video import arrow, box, clear, curve, ellipse, heading, line, step, text_width, write

TITLE = "Classes of Food, Balanced Diet and Deficiency Diseases | WASSCE Biology"
DESCRIPTION = ("The classes of food on the chalkboard: carbohydrates, proteins, fats, vitamins, minerals, water and "
               "roughage, with their functions, Sierra Leone food sources and food tests; deficiency diseases; and a "
               "balanced diet.")
LABEL = "WASSCE Tutor  ·  Biology  ·  Food and nutrition"
# The lesson page this video is on: /wassce/biology/food-nutrition-and-the-digestive-system/food-and-nutrition-nutrient-classes-balanced-diets-and-deficiency-diseases
LESSON = "biology/food-nutrition-and-the-digestive-system/food-and-nutrition-nutrient-classes-balanced-diets-and-deficiency-diseases"

PX, PY, PR = 330, 430, 190   # the plate


def plate(cx=PX, cy=PY, r=PR, s=1.0, width=3.6):
    out = [ellipse(cx, cy, r, r, "white", width), ellipse(cx, cy, r - 18 * s, r - 18 * s, "grey", width * 0.6)]
    for a in (-90, 30, 150):   # three portions
        t = math.radians(a)
        out.append(line(cx, cy, cx + (r - 18 * s) * math.cos(t), cy + (r - 18 * s) * math.sin(t), "grey", width * 0.7))
    return out


def row(y, name, job, where, ill=None, color="yellow"):
    parts = [write(name, 70, y, 25, color), write(job, 330, y, 23), write(where, 330, y + 30, 20, "grey")]
    if ill:
        parts.append(write(ill, 840, y, 23, "pink"))
    return parts


STEPS = [
    # ── 1. Words and classes ───────────────────────────────────────────
    step("First, four words. Food is anything we eat or drink that gives us materials and energy. Nutrients are the useful chemicals in food. "
         "Nutrition is how we obtain and use food. And digestion breaks large food molecules into small, soluble ones that can be absorbed.",
         heading("Food and Nutrition"),
         write("food:", 70, 180, 25, "yellow"), write("gives the body materials and energy", 250, 180, 24),
         write("nutrients:", 70, 220, 25, "yellow"), write("the useful chemicals in food", 250, 220, 24),
         write("nutrition:", 70, 260, 25, "yellow"), write("obtaining and using food", 250, 260, 24),
         write("digestion:", 70, 300, 25, "yellow"), write("large molecules into small, soluble ones", 250, 300, 24),
         chapter="Food, nutrients and the classes of food"),

    step("There are six classes of nutrients: carbohydrates, proteins, fats and oils, vitamins, mineral salts and water. "
         "And we also need roughage, or fibre, even though we cannot digest it.",
         write("The classes of food", 70, 380, 30, "yellow"),
         write("carbohydrates,  proteins,  fats and oils,", 90, 428, 26),
         write("vitamins,  mineral salts,  water", 90, 470, 26),
         write("+  roughage (fibre):  not digested, but keeps food moving", 90, 520, 24, "green")),

    step("Be careful with words. Rice is a food. Starch is a nutrient in the rice. Examiners take marks off when the two are mixed up.",
         write("rice is a food;  starch is a nutrient in it.", 70, 600, 25, "pink")),

    # ── 2. Carbohydrates, proteins, fats ───────────────────────────────
    step("Carbohydrates give us energy. Starch is found in rice, cassava, yam, maize and bread.",
         clear(2.2),
         heading("Energy and body-building"),
         write("Class", 70, 168, 21, "grey"), write("Main job", 330, 168, 21, "grey"), write("If short", 840, 168, 21, "grey"),
         line(60, 182, 1200, 182, "grey", 2.2),
         *row(222, "carbohydrates", "energy", "rice, cassava, yam, maize, bread"),
         chapter="Carbohydrates, proteins and fats: functions and sources"),

    step("Proteins are for growth and repair, and for making enzymes and antibodies. Fish, eggs, milk, meat, beans and groundnuts are good sources. "
         "A child who lacks protein for a long time can get kwashiorkor: swelling, poor growth and wasted muscles.",
         *row(302, "proteins", "growth, repair, enzymes", "fish, eggs, milk, beans, groundnuts", "kwashiorkor")),

    step("Fats and oils give concentrated energy, store energy, keep us warm and protect our organs. They also help us absorb vitamins A, D, E and K. "
         "Palm oil, groundnuts and avocado are sources.",
         *row(382, "fats and oils", "stored energy;  warmth;  protect organs", "palm oil, groundnuts, avocado")),

    step("Two food tests you must know. Iodine turns blue-black when starch is present. Benedict's solution, when heated, turns from blue to brick-red with a reducing sugar such as glucose.",
         write("Food tests", 70, 480, 27, "yellow"),
         write("starch:  iodine,  yellow-brown  to  blue-black", 90, 524, 24),
         write("reducing sugar:  Benedict's solution, heated,  blue  to  brick-red", 90, 564, 24)),

    # ── 3. Vitamins and minerals ───────────────────────────────────────
    step("Vitamins and minerals are needed in small amounts, but without them we get deficiency diseases. Learn each one with its disease.",
         clear(2.2),
         heading("Vitamins and minerals"),
         write("Nutrient", 70, 168, 21, "grey"), write("Needed for", 330, 168, 21, "grey"), write("Deficiency", 820, 168, 21, "grey"),
         line(60, 182, 1200, 182, "grey", 2.2),
         chapter="Vitamins and minerals: deficiency diseases"),

    step("Vitamin A for vision. Without it: night blindness.",
         write("vitamin A", 70, 226, 25, "yellow"), write("vision;  healthy skin", 330, 226, 23), write("night blindness", 820, 226, 23, "pink")),
    step("Vitamin C for healthy tissue and wound healing. Without it: scurvy, with bleeding gums.",
         write("vitamin C", 70, 276, 25, "yellow"), write("healthy tissue;  healing", 330, 276, 23), write("scurvy", 820, 276, 23, "pink")),
    step("Vitamin D helps the body use calcium for strong bones. Without it, children get rickets.",
         write("vitamin D", 70, 326, 25, "yellow"), write("uses calcium;  strong bones", 330, 326, 23), write("rickets", 820, 326, 23, "pink")),
    step("Iron is needed to make haemoglobin. Without it: anaemia, and you feel tired.",
         write("iron", 70, 376, 25, "yellow"), write("making haemoglobin", 330, 376, 23), write("anaemia;  tiredness", 820, 376, 23, "pink")),
    step("Calcium builds bones and teeth, and helps muscles and blood clotting.",
         write("calcium", 70, 426, 25, "yellow"), write("bones, teeth;  clotting", 330, 426, 23), write("weak bones", 820, 426, 23, "pink")),
    step("And iodine is needed to make thyroid hormone. Without it: goitre, a swelling in the neck.",
         write("iodine", 70, 476, 25, "yellow"), write("thyroid hormone", 330, 476, 23), write("goitre", 820, 476, 23, "pink")),

    step("Water is a solvent, carries substances round the body and helps control body temperature. We lose it in urine, sweat and breath, so we must keep replacing it.",
         write("water:", 70, 560, 25, "blue"), write("a solvent;  transport;  controls body temperature", 190, 560, 23),
         write("lost in urine, sweat and breath:  replace it", 190, 594, 21, "grey")),

    # ── 4. A balanced diet ─────────────────────────────────────────────
    step("A balanced diet gives all the nutrients, in the right amounts, for a person's age, activity and health. No single food can do that.",
         clear(2.2),
         heading("A balanced diet"),
         *plate(),
         chapter="A balanced diet, with a Sierra Leone example"),

    step("A good Sierra Leone plate: rice or cassava for energy, fish or beans for protein, and green leaves, like potato leaves or cassava leaves, for vitamins and minerals. "
         "Add fruit and clean, safe water.",
         write("rice,", PX - 84, PY - 70, 20, "yellow", "center"), write("cassava", PX - 84, PY - 44, 20, "yellow", "center"),
         write("energy", PX - 84, PY - 16, 18, "grey", "center"),
         write("fish,", PX + 84, PY - 70, 20, "pink", "center"), write("beans", PX + 84, PY - 44, 20, "pink", "center"),
         write("protein", PX + 84, PY - 16, 18, "grey", "center"),
         write("green", PX, PY + 74, 20, "green", "center"), write("leaves", PX, PY + 100, 20, "green", "center"),
         write("vitamins", PX, PY + 128, 18, "grey", "center"),
         write("+ fruit,  + clean water", PX, PY + PR + 46, 22, "blue", "center")),

    step("Needs change. A growing child needs more for growth. An active person needs more energy. And a pregnant woman needs more iron and folate.",
         write("Needs change:", 640, 220, 27, "yellow"),
         write("growing child:  more for growth", 660, 266, 23),
         write("active person:  more energy", 660, 306, 23),
         write("pregnancy:  more iron and folate", 660, 346, 23)),

    # ── 5. Malnutrition, exam tips ─────────────────────────────────────
    step("Malnutrition means an unbalanced diet. It can be too little food, too much, or missing nutrients. A person can eat plenty of calories and still lack vitamins.",
         write("Malnutrition:", 640, 430, 27, "pink"),
         write("too little,  too much,", 660, 474, 23), write("or missing nutrients", 660, 508, 23)),

    step("In a deficiency question, give three things: the nutrient, the disease, and one sign. For example: iron, anaemia, tiredness.",
         write("Exam:  nutrient,  disease,  one sign", 640, 590, 24, "yellow"),
         write("e.g.  iron,  anaemia,  tiredness", 660, 626, 22, "grey"),
         pause=1.2),
]

THUMBNAIL = [
    write("Food & Nutrition", 54, 150, 76, "yellow"),
    write("Classes of food  ·  Balanced diet  ·  Deficiency", 60, 214, 30),
    *plate(300, 450, 190, 1.0, 5.0),
    write("energy", 222, 420, 26, "yellow", "center"), write("protein", 378, 420, 26, "pink", "center"), write("vitamins", 300, 540, 26, "green", "center"),
    write("kwashiorkor", 640, 340, 40, "pink"), write("scurvy", 640, 420, 40, "pink"), write("rickets", 640, 500, 40, "pink"), write("anaemia", 640, 580, 40, "pink"),
]
