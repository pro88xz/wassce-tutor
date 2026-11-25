"""Physics · States of matter: evaporation, boiling, molecular forces and crystals. A chalkboard video lesson.

Follows content/notes/physics-kinetic-2.md, each idea with its reason: opens on
something to try (wet one hand, blow on both: where did the cold come from?);
temperature as the average kinetic energy, with a spread of speeds drawn cool and
hot; why evaporation cools (only the fastest escape: the tallest students leave
the class and the average drops), back to the wet hand, sweat and the clay pot;
what speeds evaporation, with washing on a line as a quick check; evaporation
against boiling, the exam's favourite table; cohesion and adhesion, water and
mercury in glass tubes; crystalline and amorphous solids and why only crystals
have a sharp melting point; and "your move" on a bicycle tyre in the sun.

Check: python3 scripts/video/board_video.py content/videos/physics-kinetic-2.py --boards .video-build/boards/kin2
"""

import math
import random

from board_video import arrow, box, clear, curve, dots, ellipse, heading, line, step, write

TITLE = "Evaporation and Cooling, Evaporation vs Boiling, Cohesion and Adhesion, Crystals | WASSCE Physics"
DESCRIPTION = ("Evaporation on the chalkboard: why a wet hand feels cold, what temperature really measures, why evaporation "
               "cools, what makes it faster, evaporation versus boiling, cohesion and adhesion (water and mercury in glass), "
               "crystalline and amorphous solids, and a bicycle tyre in the sun.")
LABEL = "WASSCE Tutor  ·  Physics  ·  States of matter"
# The lesson page this video is on: /wassce/physics/states-of-matter-and-kinetic-theory/evaporation-boiling-molecular-forces-and-crystals
LESSON = "physics/states-of-matter-and-kinetic-theory/evaporation-boiling-molecular-forces-and-crystals"


def pause_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def hand(cx, cy, color="white"):
    """A hand, palm towards us: a palm, four fingers and a thumb."""
    out = [ellipse(cx, cy, 46, 56, color, 2.8),
           curve([(cx - 42, cy + 18), (cx - 70, cy - 4), (cx - 84, cy - 26), (cx - 76, cy - 36), (cx - 60, cy - 24), (cx - 44, cy - 10)], color, 2.6)]
    for dx, dy, ry in ((-33, -86, 36), (-11, -98, 44), (11, -96, 42), (33, -84, 34)):
        out.append(ellipse(cx + dx, cy + dy, 9, ry, color, 2.6))
    return out


def sun(cx, cy, r=28):
    out = [ellipse(cx, cy, r, r, "yellow", 2.8)]
    for k in range(8):
        a = math.pi * k / 4
        out.append(line(cx + (r + 8) * math.cos(a), cy + (r + 8) * math.sin(a), cx + (r + 20) * math.cos(a), cy + (r + 20) * math.sin(a), "yellow", 2.4))
    return out


_r = random.Random(11)
LIQUID = [(855 + 23 * i + _r.uniform(-4, 4), 472 + 24 * j + _r.uniform(-3, 3)) for j in range(3) for i in range(15)]
LATTICE = [(790 + 30 * i, 200 + 30 * j) for j in range(5) for i in range(6)]
JUMBLE = []
while len(JUMBLE) < 30:
    p = (_r.uniform(1030, 1200), _r.uniform(190, 330))
    if all(math.hypot(p[0] - q[0], p[1] - q[1]) > 20 for q in JUMBLE):
        JUMBLE.append(p)

STEPS = [
    # ── 1. Try this ───────────────────────────────────────────────────
    step("Try this, right now. Wet the back of one hand with a little water, and leave the other hand dry. Now blow gently on both.",
         heading("Try this now"),
         *hand(820, 430), *hand(1080, 430),
         dots([(800, 420), (835, 445), (815, 470), (845, 410), (790, 455)], "blue", 5.0),
         write("wet", 820, 530, 24, "blue", "center"), write("dry", 1080, 530, 24, "white", "center"),
         arrow(930, 250, 860, 320, "grey"), arrow(990, 250, 1050, 320, "grey"), write("blow", 960, 232, 22, "grey", "center"),
         pause=1.2, chapter="Try this"),

    step("The wet hand feels cold. Much colder than the dry one. But the water was no colder than your skin. "
         "So where did the cold come from? The kinetic theory has the answer, and a few exam favourites besides.",
         write("wet hand:  cold!", 70, 200, 26, "blue"),
         write("dry hand:  hardly", 70, 240, 26),
         write("where did the cold come from?", 70, 300, 26, "yellow"),
         pause=1.0),

    # ── 2. What temperature really is ─────────────────────────────────
    step("First, a sharper idea of temperature. Temperature measures the average kinetic energy of the particles. "
         "And not every particle moves at the same speed. At any moment, most are middling, a few are slow, and a few are very fast.",
         clear(2.2),
         heading("What temperature really is"),
         arrow(700, 560, 1210, 560, "white", 3.0), arrow(700, 560, 700, 230, "white", 3.0),
         write("speed", 1210, 594, 20, "grey", "right"), write("number of particles", 714, 244, 20, "grey"),
         curve([(705, 555), (760, 450), (820, 330), (850, 305), (890, 330), (960, 440), (1050, 520), (1150, 552)], "blue", 3.2),
         write("cool", 850, 290, 22, "blue", "center"),
         arrow(1120, 470, 1110, 535, "grey", 2.2), write("a few very fast", 1120, 455, 20, "grey", "center"),
         write("temperature:  the AVERAGE kinetic", 70, 200, 24, "yellow"),
         write("energy of the particles", 70, 236, 24, "yellow"),
         write("most:  middling speeds", 70, 300, 22),
         write("a few slow,  a few very fast", 70, 334, 22),
         chapter="Temperature"),

    step("Heat the substance, and the whole hump slides towards higher speeds. The average goes up. That is all a higher temperature means.",
         curve([(705, 557), (790, 500), (880, 410), (950, 375), (1010, 400), (1090, 470), (1180, 540)], "pink", 3.2),
         write("hot", 960, 360, 22, "pink", "center"),
         write("hotter:  the whole spread", 70, 400, 22, "pink"),
         write("moves to higher speeds", 70, 434, 22, "pink")),

    # ── 3. Why evaporation cools ──────────────────────────────────────
    step("Now, evaporation. At the surface of a liquid, only the fastest molecules have enough energy to break away from their neighbours, "
         "and escape into the air. And that can happen at any temperature.",
         clear(2.2),
         heading("Why evaporation cools"),
         line(830, 420, 830, 545, "white", 3.0), line(830, 545, 1205, 545, "white", 3.0), line(1205, 545, 1205, 420, "white", 3.0),
         line(834, 452, 1201, 452, "blue", 2.4),
         *[ellipse(x, y, 9, 9, "white", 2.2) for x, y in LIQUID],
         *[x for p, q in (((900, 448), (880, 360)), ((1030, 448), (1040, 320)), ((1140, 448), (1160, 350)))
           for x in (arrow(*p, *q, "pink", 2.6), ellipse(q[0], q[1] - 12, 9, 9, "pink", 2.4))],
         write("only the fastest escape", 1020, 270, 22, "pink", "center"),
         write("evaporation:  the fastest molecules escape", 70, 200, 24),
         write("from the surface,  at any temperature", 70, 236, 24),
         chapter="Why evaporation cools"),

    step("And here is the key. Because it is the fastest ones that leave, the average energy of the molecules left behind goes down. "
         "A lower average kinetic energy means a lower temperature. The liquid cools.",
         write("the fastest leave:  the average energy", 70, 300, 24, "yellow"),
         write("of those left falls.   The liquid cools.", 70, 336, 24, "yellow")),

    step("Think of a class where the five tallest students walk out. The average height of the class drops, "
         "even though nobody got any shorter. Evaporation does that to energy.",
         write("the tallest students leave:  the average drops", 70, 400, 22, "grey"),
         pause=1.0),

    step("That is your wet hand: the water carried its fastest molecules away, and your heat with them. "
         "It is why sweat cools you on a hot afternoon in Freetown. And why water in a clay pot stays cool: "
         "it seeps through the clay, and evaporates from the outside.",
         write("the wet hand,  sweat,  the clay pot", 70, 466, 22, "green")),

    # ── 4. Faster evaporation ─────────────────────────────────────────
    step("What makes evaporation faster? A higher temperature: more molecules are fast enough to escape. A larger surface area: more of them are at the surface. "
         "Wind: it carries the escaped vapour away, so fewer molecules fall back in. Dry air, and lower pressure, help too.",
         clear(2.2),
         heading("What speeds up evaporation"),
         write("1.  higher temperature:  more fast molecules", 70, 190, 23),
         write("2.  larger surface area:  more at the surface", 70, 228, 23),
         write("3.  wind:  carries the vapour away", 70, 266, 23),
         write("4.  dry air   (low humidity)", 70, 304, 23),
         write("5.  lower pressure above the liquid", 70, 342, 23),
         chapter="What speeds up evaporation"),

    step("Quick check. Why does washing spread out on a line, in the sun and the wind, dry faster than the same clothes left in a heap, in the shade?",
         line(800, 300, 1210, 300, "white", 2.4), box(830, 300, 70, 95, "white", 2.6), box(930, 300, 100, 70, "white", 2.6), box(1060, 300, 70, 105, "white", 2.6),
         *sun(1160, 200),
         *[curve([(760, 440 + 30 * i), (800, 428 + 30 * i), (840, 448 + 30 * i), (880, 436 + 30 * i)], "blue", 2.2) for i in range(3)],
         write("Quick check:  why does washing on a line,", 70, 430, 23, "blue"),
         write("in sun and wind,  dry faster than a heap?", 70, 466, 23, "blue"),
         pause=2.4),

    step("Three reasons, and you can name all of them now. The sun gives a higher temperature. Spreading gives a larger surface area. "
         "And the wind carries the vapour away.",
         write("sun:  hotter.   spread out:  more area.   wind:  vapour carried away", 70, 530, 22, "green")),

    # ── 5. Evaporation versus boiling ─────────────────────────────────
    step("The exam loves this one: give three differences between evaporation and boiling. Evaporation happens at any temperature; "
         "boiling, only at a fixed temperature, the boiling point. Evaporation happens only at the surface; boiling happens all through the liquid. "
         "That is what the bubbles are.",
         clear(2.2),
         heading("Evaporation versus boiling"),
         write("evaporation", 320, 180, 26, "yellow", "center"), write("boiling", 920, 180, 26, "yellow", "center"),
         line(620, 155, 620, 440, "grey", 2.2),
         write("any temperature", 320, 235, 22, "white", "center"), write("a fixed temperature  (boiling point)", 920, 235, 22, "white", "center"),
         write("only at the surface", 320, 280, 22, "white", "center"), write("throughout:  bubbles inside", 920, 280, 22, "white", "center"),
         chapter="Evaporation versus boiling"),

    step("Evaporation is slow and quiet; boiling is fast and vigorous. Evaporation cools the liquid. But while a liquid boils, "
         "its temperature stays constant, as long as you keep supplying the heat.",
         write("slow and quiet", 320, 325, 22, "white", "center"), write("fast and vigorous", 920, 325, 22, "white", "center"),
         write("cools the liquid", 320, 370, 22, "white", "center"), write("temperature stays constant", 920, 370, 22, "white", "center"),
         write("faster with area,  wind,  dry air", 320, 415, 22, "white", "center"), write("needs a steady supply of heat", 920, 415, 22, "white", "center"),
         write("any three differences:  full marks", 70, 500, 24, "green")),

    # ── 6. Cohesion and adhesion ──────────────────────────────────────
    step("The particles of a substance pull on each other. The pull between molecules of the same substance is called cohesion. "
         "The pull between molecules of different substances is called adhesion.",
         clear(2.2),
         heading("Cohesion and adhesion"),
         write("cohesion:  pull between molecules of the SAME substance", 70, 190, 23),
         write("adhesion:  pull between DIFFERENT substances", 70, 228, 23),
         chapter="Cohesion and adhesion"),

    step("Put water in a narrow glass tube. The water molecules are pulled more strongly by the glass than by each other. "
         "Adhesion wins. So water wets glass, and its surface curves up at the edges.",
         line(840, 270, 840, 540, "white", 2.8), line(920, 270, 920, 540, "white", 2.8), line(840, 540, 920, 540, "white", 2.8),
         curve([(842, 370), (858, 392), (880, 398), (902, 392), (918, 370)], "blue", 3.0),
         *[line(846, y, 914, y, "blue", 1.6) for y in (430, 470, 510)],
         write("water", 880, 580, 22, "blue", "center"),
         line(80, 560, 330, 560, "white", 2.8), curve([(96, 560), (140, 547), (220, 545), (310, 560)], "blue", 3.0),
         write("water spreads", 205, 598, 20, "blue", "center"),
         write("water:  adhesion > cohesion", 70, 300, 23, "blue"),
         write("it wets glass;  its surface curves up", 70, 336, 23, "blue")),

    step("Mercury is the opposite. Its molecules hold on to each other more strongly than to the glass. Cohesion wins. "
         "Mercury does not wet glass. It rolls into round beads, and its surface bulges up in the middle.",
         line(1060, 270, 1060, 540, "white", 2.8), line(1140, 270, 1140, 540, "white", 2.8), line(1060, 540, 1140, 540, "white", 2.8),
         curve([(1062, 400), (1078, 378), (1100, 372), (1122, 378), (1138, 400)], "grey", 3.0),
         *[line(1066, y, 1134, y, "grey", 1.6) for y in (440, 480, 520)],
         write("mercury", 1100, 580, 22, "grey", "center"),
         line(420, 560, 690, 560, "white", 2.8),
         *[ellipse(x, 560 - r - 2, r, r, "grey", 2.6) for x, r in ((465, 12), (520, 8), (575, 15), (635, 9))],
         write("mercury beads", 555, 598, 20, "grey", "center"),
         write("mercury:  cohesion > adhesion", 70, 400, 23),
         write("round beads;  its surface bulges up", 70, 436, 23)),

    # ── 7. Crystalline and amorphous ──────────────────────────────────
    step("Solids come in two kinds. In a crystalline solid, like salt, sugar, ice or a metal, the particles sit in a regular, repeating pattern, "
         "called a lattice. In an amorphous solid, like glass, rubber, plastic or candle wax, they are jumbled, with no pattern at all.",
         clear(2.2),
         heading("Crystals and amorphous solids"),
         box(760, 175, 210, 180, "grey", 2.6), dots(LATTICE, "white", 7.0),
         box(1010, 175, 210, 180, "grey", 2.6), dots(JUMBLE, "white", 7.0),
         write("crystalline", 865, 395, 22, "yellow", "center"), write("amorphous", 1115, 395, 22, "yellow", "center"),
         write("salt,  sugar,", 865, 428, 18, "grey", "center"), write("ice,  metals", 865, 454, 18, "grey", "center"),
         write("glass,  rubber,", 1115, 428, 18, "grey", "center"), write("wax,  plastic", 1115, 454, 18, "grey", "center"),
         write("crystalline:  a regular,  repeating pattern", 70, 200, 23),
         write("amorphous:  jumbled,  no pattern", 70, 238, 23),
         chapter="Crystalline and amorphous solids"),

    step("That difference shows when you heat them. A crystal has a sharp melting point: every link in the pattern is the same, "
         "so they all let go at one temperature. Candle wax just softens, slowly, over a range of temperatures, because its links are all different.",
         write("crystal:  a sharp melting point", 70, 310, 23, "green"),
         write("(every link the same:  all let go at once)", 70, 346, 21, "grey"),
         write("amorphous:  softens over a range", 70, 400, 23, "pink"),
         write("(links all different)", 70, 436, 21, "grey")),

    # ── 8. Your move: the bicycle tyre ────────────────────────────────
    step("Your move. You pump up a bicycle tyre in the cool morning. By the afternoon, standing in the sun, it feels much harder. "
         "Explain why, using the kinetic theory. Stop the video, and write two sentences.",
         clear(2.2),
         heading("Your move"),
         *pause_sign(1180, 82),
         ellipse(1000, 420, 130, 130, "white", 4.0), ellipse(1000, 420, 108, 108, "white", 2.4), ellipse(1000, 420, 10, 10, "white", 2.4),
         *[line(1000 + 12 * math.cos(a), 420 + 12 * math.sin(a), 1000 + 106 * math.cos(a), 420 + 106 * math.sin(a), "grey", 1.6)
           for a in (math.pi * k / 6 for k in range(12))],
         *sun(1180, 210),
         write("a tyre pumped up in the cool morning", 70, 200, 24, "blue"),
         write("is harder in the afternoon sun.   Why?", 70, 238, 24, "blue"),
         pause=3.2, chapter="Your move: a tyre in the sun"),

    step("The air inside heats up, so its molecules move faster. They hit the inside walls of the tyre more often, and harder, so the pressure rises, "
         "and the tyre feels harder. Particles, speed, collisions, pressure: that is a full-marks answer.",
         write("the air heats:  its molecules move faster", 70, 320, 24, "green"),
         write("more hits,  harder hits on the walls", 70, 358, 24, "green"),
         write("the pressure rises:  the tyre is harder", 70, 396, 24, "green")),

    step("That completes states of matter. Next, we stretch things: springs, wires and rubber bands, and find out exactly how far they stretch. Hooke's law.",
         write("Coming up:  stretching springs,  Hooke's law", 70, 500, 24, "yellow"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Why Sweat Cools You", 54, 140, 72, "yellow"),
    write("evaporation  ·  boiling  ·  cohesion  ·  crystals", 60, 210, 30),
    line(120, 380, 120, 560, "white", 3.4), line(120, 560, 640, 560, "white", 3.4), line(640, 560, 640, 380, "white", 3.4),
    line(124, 420, 636, 420, "blue", 3.0),
    *[ellipse(150 + 32 * i, 450 + 32 * j, 12, 12, "white", 2.6) for j in range(3) for i in range(15)],
    *[x for p, q in (((240, 414), (210, 300)), ((390, 414), (400, 270)), ((540, 414), (570, 290)))
      for x in (arrow(*p, *q, "pink", 3.4), ellipse(q[0], q[1] - 16, 12, 12, "pink", 3.0))],
    write("the fastest escape", 700, 330, 34, "pink"),
    write("the rest cool down", 700, 490, 34, "blue"),
]
