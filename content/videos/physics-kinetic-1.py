"""Physics · States of matter: the kinetic theory. A chalkboard video lesson.

Follows content/notes/physics-kinetic-1.md, each idea with its reason: opens on a
story (fish frying with pepper in the compound, smelt through a shut door: how
did the fish get into your nose?); the four points of the kinetic theory; solids,
liquids and gases drawn particle by particle, with why each behaves as it does,
and "think fast" on squashing air but not water; Brownian motion in the smoke cell,
why the specks jiggle (uneven hits, a beach ball over a crowd) and the classic
mistake; diffusion, with a permanganate crystal spreading in water and a quick
check back on the fish; changes of state and the hidden latent heat; gas pressure
from collisions, and "over to you" on an aerosol can that says do not heat.

Check: python3 scripts/video/board_video.py content/videos/physics-kinetic-1.py --boards .video-build/boards/kin1
"""

import math
import random

from board_video import arrow, box, clear, curve, dots, ellipse, heading, line, step, write

TITLE = "Kinetic Theory of Matter: Solids, Liquids, Gases, Brownian Motion and Diffusion | WASSCE Physics"
DESCRIPTION = ("The kinetic theory on the chalkboard: why you can smell fish frying next door, the four points of the theory, "
               "particles in solids, liquids and gases, Brownian motion in the smoke cell and why it happens, diffusion, "
               "changes of state, and gas pressure.")
LABEL = "WASSCE Tutor  ·  Physics  ·  States of matter"
# The lesson page this video is on: /wassce/physics/states-of-matter-and-kinetic-theory/states-of-matter-and-the-kinetic-theory
LESSON = "physics/states-of-matter-and-kinetic-theory/states-of-matter-and-the-kinetic-theory"


def pause_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def person(x, feet, color="white"):
    return [ellipse(x, feet - 92, 13, 13, color, 2.8), line(x, feet - 78, x, feet - 36, color, 2.8),
            line(x, feet - 36, x - 14, feet, color, 2.8), line(x, feet - 36, x + 14, feet, color, 2.8)]


def particles(points, r=13, color="white"):
    return [ellipse(x, y, r, r, color, 2.4) for x, y in points]


def moving(points, color="white", r=11, length=34):
    """Gas particles, each with a short arrow in a fixed 'random' direction."""
    out = []
    for i, (x, y) in enumerate(points):
        a = 2.4 * i + 0.7
        dx, dy = math.cos(a), math.sin(a)
        out += [ellipse(x, y, r, r, color, 2.4), arrow(x + dx * (r + 3), y + dy * (r + 3), x + dx * (r + length), y + dy * (r + length), "grey", 2.2)]
    return out


# Board 3: the three boxes of particles
SOLID = [(230 + dx, 200 + dy) for dy in range(0, 140, 28) for dx in range(-70, 71, 28)]
_j = random.Random(4)
LIQUID = ([(512 + 27 * i + _j.uniform(-3, 3), 336 + _j.uniform(-2, 2)) for i in range(10)]
          + [(525 + 30 * i + _j.uniform(-5, 5), 310 + _j.uniform(-3, 3)) for i in range(8)]
          + [(560 + 36 * i + _j.uniform(-6, 6), 285 + _j.uniform(-3, 3)) for i in range(5)])
GAS = [(945, 205), (1035, 295), (1100, 215), (1160, 290), (975, 320), (1075, 250)]

# Board 6: the permanganate spreading up from the crystal at the bottom of the beaker
_r = random.Random(7)
PURPLE = []
while len(PURPLE) < 80:
    x, y = _r.uniform(892, 1108), _r.uniform(300, 510)
    if _r.random() < math.exp(-math.hypot(x - 997, y - 507) / 55):
        PURPLE.append((x, y))

STEPS = [
    # ── 1. How did the fish get in? ───────────────────────────────────
    step("Your neighbour is frying fish with plenty of pepper, out in the compound. You are inside, with the door shut. "
         "And still, within seconds, you can smell it. So, how did the fish get into your nose?",
         heading("How did the fish get in?"),
         line(760, 520, 1250, 520, "grey", 2.4),
         box(800, 330, 220, 190, "white", 3.0), line(790, 335, 910, 250, "white", 3.0), line(910, 250, 1030, 335, "white", 3.0),
         box(890, 440, 40, 80, "white", 2.6), *person(965, 520),
         line(1110, 490, 1210, 490, "white", 3.2), line(1210, 486, 1245, 476, "white", 3.0),
         line(1120, 490, 1130, 505, "white", 2.4), line(1200, 490, 1190, 505, "white", 2.4),
         *[curve([(1135 + 30 * i, 470), (1125 + 30 * i, 440), (1140 + 30 * i, 410)], "pink", 2.2) for i in range(3)],
         pause=1.2, chapter="How did the smell get in?"),

    step("Nobody carried it in. Tiny pieces of the fish and the pepper, far too small to see, travelled across the compound "
         "and into your house, all by themselves. Everything is made of particles like that, and they never stop moving.",
         dots([(1100, 380), (1075, 362), (1052, 371), (1040, 350), (1018, 362), (1005, 345), (990, 380), (968, 398),
               (950, 372), (930, 400), (975, 425), (1000, 410), (945, 425)], "pink", 4.4),
         write("tiny particles,  always moving", 70, 200, 27, "yellow")),

    step("That one idea explains why a wet cloth dries, why ice melts but a stone does not, and why a tyre gets harder on a hot day. "
         "It is called the kinetic theory. Kinetic means moving.",
         write("the kinetic theory:   kinetic = moving", 70, 260, 25, "green"),
         pause=0.6),

    # ── 2. The four points ────────────────────────────────────────────
    step("The kinetic theory says four things. One: all matter is made of tiny particles: atoms, molecules or ions. "
         "Two: those particles are in constant, random motion. They never rest, not even inside your desk.",
         clear(2.2),
         heading("The kinetic theory of matter"),
         write("1.  all matter:  tiny particles  (atoms,  molecules,  ions)", 70, 200, 24),
         write("2.  in constant,  random motion", 70, 250, 24),
         *moving([(1000, 240), (1090, 215), (1180, 265), (1040, 305), (1140, 335)]),
         chapter="The kinetic theory"),

    step("Three: the particles attract one another, and the attraction is strongest when they are close together. "
         "Four: the hotter something is, the faster its particles move. That is what heating does to matter.",
         write("3.  they attract each other:  strongest when close", 70, 300, 24),
         write("4.  hotter:  faster particles  (more kinetic energy)", 70, 350, 24, "yellow"),
         ellipse(1000, 440, 16, 16, "white", 2.6), ellipse(1080, 440, 16, 16, "white", 2.6),
         arrow(1022, 440, 1040, 440, "pink", 2.4), arrow(1058, 440, 1040, 440, "pink", 2.4),
         write("attraction", 1040, 490, 20, "pink", "center")),

    # ── 3. Solid, liquid, gas ─────────────────────────────────────────
    step("Now picture the particles. In a solid, they are packed tightly, in a regular pattern, held by strong forces. "
         "They cannot leave their places; they can only vibrate. That is why a solid keeps its shape.",
         clear(2.2),
         heading("Solid,  liquid,  gas"),
         box(80, 165, 300, 190, "grey", 2.6), *particles(SOLID),
         write("solid", 230, 400, 24, "yellow", "center"),
         write("vibrate in fixed places", 230, 432, 19, "white", "center"),
         write("fixed shape and volume", 230, 462, 19, "grey", "center"),
         chapter="Solids, liquids and gases"),

    step("In a liquid, the particles are still close together, but not in a pattern, and they can slide past one another. "
         "So a liquid flows, and takes the shape of its container. But it keeps its volume.",
         box(490, 165, 300, 190, "grey", 2.6), *particles(LIQUID),
         write("liquid", 640, 400, 24, "yellow", "center"),
         write("slide past each other", 640, 432, 19, "white", "center"),
         write("flows;  fixed volume", 640, 462, 19, "grey", "center")),

    step("In a gas, the particles are far apart, with almost no force between them. They fly about fast, in every direction, "
         "so a gas spreads out to fill whatever container you give it.",
         box(900, 165, 300, 190, "grey", 2.6), *moving(GAS),
         write("gas", 1050, 400, 24, "yellow", "center"),
         write("far apart,  flying about", 1050, 432, 19, "white", "center"),
         write("fills any container", 1050, 462, 19, "grey", "center")),

    step("Think fast. Block the end of a bicycle pump and push: the air squashes. Fill the pump with water, and it will not budge. Why?",
         write("Think fast:  air squashes in a blocked pump.  Water does not.  Why?", 70, 540, 23, "blue"),
         pause=2.2),

    step("In the gas, there are big empty spaces between the particles, so you can push them closer together. "
         "In the water, the particles are already touching. There is nowhere for them to go.",
         write("gas:  big empty spaces.    liquid:  particles already touching", 70, 585, 23, "green")),

    # ── 4. Brownian motion ────────────────────────────────────────────
    step("But how do we know the particles are really moving, if we cannot see them? Here is the classic experiment. "
         "Trap a little smoke in a small glass cell, shine a light in from the side, and look down through a microscope.",
         clear(2.2),
         heading("Brownian motion"),
         line(970, 330, 970, 215, "white", 2.8), line(1010, 330, 1010, 215, "white", 2.8), line(962, 215, 1018, 215, "white", 2.8),
         ellipse(990, 192, 18, 8, "white", 2.4), write("microscope", 1028, 270, 20, "grey"),
         box(910, 330, 160, 70, "white", 2.8),
         dots([(940, 350), (975, 375), (1010, 355), (1040, 380), (955, 388), (1050, 345)], "grey", 4.0),
         arrow(760, 365, 905, 365, "yellow"), write("light", 830, 350, 20, "yellow", "center"),
         write("smoke in a glass cell,  lit from the side,", 70, 190, 24),
         write("seen through a microscope", 70, 228, 24),
         chapter="Brownian motion"),

    step("You see bright specks of smoke, and they never keep still. Each one jerks this way, then that way, at random, "
         "in a zig-zag path. This is called Brownian motion.",
         ellipse(1120, 545, 80, 80, "white", 2.8),
         *[line(*a, *b, "yellow", 2.6) for a, b in zip([(1085, 575), (1105, 530), (1090, 505), (1130, 520), (1150, 565), (1120, 590)],
                                                         [(1105, 530), (1090, 505), (1130, 520), (1150, 565), (1120, 590), (1160, 595)])],
         dots([(1160, 595)], "yellow", 6.0),
         write("what you see:", 1020, 515, 20, "grey", "right"),
         write("specks jerking", 1020, 545, 20, "grey", "right"),
         write("about at random", 1020, 575, 20, "grey", "right"),
         write("Brownian motion:  the random,  zig-zag", 70, 440, 24, "yellow"),
         write("movement of small particles in a fluid", 70, 476, 24, "yellow")),

    step("Nothing is pushing the smoke. Or is it? The air around it is made of molecules, far too small to see, moving fast and at random. "
         "They hit the smoke from every side. But at any moment, more hit one side than the other, so the speck is pushed one way, then another.",
         clear(2.2),
         heading("Why the smoke jiggles"),
         ellipse(1010, 390, 45, 45, "white", 3.4), write("smoke", 1010, 398, 18, "grey", "center"),
         *[x for a, d in [(140, 110), (160, 110), (180, 110), (200, 110), (220, 110), (150, 150), (170, 150), (190, 150), (210, 150), (-20, 120), (20, 120)]
           for x in (ellipse(1010 + d * math.cos(math.radians(a)), 390 - d * math.sin(math.radians(a)), 7, 7, "blue", 2.2),
                     arrow(1010 + (d - 12) * math.cos(math.radians(a)), 390 - (d - 12) * math.sin(math.radians(a)),
                           1010 + 54 * math.cos(math.radians(a)), 390 - 54 * math.sin(math.radians(a)), "blue", 2.0))],
         arrow(975, 482, 1075, 482, "green", 3.4), write("net push", 1090, 489, 20, "green"),
         write("air molecules:  tiny,  fast,  random", 70, 190, 24),
         write("they hit the smoke from every side,", 70, 228, 24),
         write("but never evenly:  pushed one way,  then another", 70, 266, 24),
         chapter="Why the smoke moves"),

    step("Think of a big beach ball over a packed crowd at a concert. From the back, you cannot see the hands, but you see the ball jerk about. "
         "The smoke speck is the ball. The air molecules are the hands.",
         write("like a beach ball over a crowd", 70, 340, 24, "grey"),
         pause=0.9),

    step("Careful here, because this is a favourite exam trap. In the smoke cell, you do not see the air molecules. They are far too small. "
         "You see the smoke, being knocked about by them. And warm the cell, and the dance gets wilder.",
         write("you see the SMOKE,  not the air molecules", 70, 420, 24, "pink"),
         write("warmer:  a wilder dance", 70, 460, 24, "green")),

    # ── 5. Diffusion ──────────────────────────────────────────────────
    step("Back to the fish. The spreading of particles, from where there are many to where there are few, all by their own random motion, "
         "is called diffusion.",
         clear(2.2),
         heading("Diffusion"),
         write("diffusion:  particles spread from where there", 70, 190, 24),
         write("are many to where there are few,  by themselves", 70, 226, 24),
         chapter="Diffusion"),

    step("Drop one crystal of potassium permanganate into still water. Do not stir. Over the next hour, the purple slowly spreads, "
         "until all the water is coloured. The particles found their own way.",
         line(880, 250, 880, 520, "white", 3.0), line(880, 520, 1120, 520, "white", 3.0), line(1120, 520, 1120, 250, "white", 3.0),
         line(884, 290, 1116, 290, "blue", 2.2), dots([(997, 507)], "pink", 12.0),
         dots(PURPLE, "pink", 4.0), write("crystal", 1000, 556, 20, "pink", "center")),

    step("Diffusion is fastest in gases, where the particles are far apart and fast. Slower in liquids. And in solids, so slow you could wait for years. "
         "It is also faster when it is hot, and for lighter molecules.",
         write("fastest in gases,  slower in liquids,", 70, 300, 24),
         write("very slow in solids", 70, 336, 24),
         write("faster when hot;  faster for light molecules", 70, 380, 24, "yellow")),

    step("Quick check. Why does the smell of that fish travel faster on a hot afternoon than on a cool morning?",
         write("Quick check:  why does the smell travel", 70, 450, 24, "blue"),
         write("faster on a hot afternoon?", 70, 486, 24, "blue"),
         pause=2.2),

    step("Hotter air means faster particles, so the smell spreads faster. And notice the habit: always answer with the particles.",
         write("hotter:  faster particles,  faster spreading", 70, 540, 24, "green")),

    # ── 6. Changes of state ───────────────────────────────────────────
    step("Heat a solid, and its particles vibrate harder and harder, until they break free of their fixed places: it melts. "
         "Keep heating, and the fastest particles escape the attraction completely: the liquid boils, and becomes a gas.",
         clear(2.2),
         heading("Changes of state"),
         write("solid", 195, 312, 32, "white", "center"), write("liquid", 600, 312, 32, "white", "center"), write("gas", 1005, 312, 32, "white", "center"),
         arrow(290, 262, 500, 262, "pink"), write("melting", 395, 244, 22, "pink", "center"),
         arrow(700, 262, 920, 262, "pink"), write("boiling", 810, 244, 22, "pink", "center"),
         write("melting:  vibrating so hard,  they break free", 70, 450, 23, "pink"),
         write("boiling:  the fastest escape the forces completely", 70, 488, 23, "pink"),
         chapter="Changes of state"),

    step("Cool it down, and everything runs backwards. The particles slow down, and the forces pull them together: "
         "the gas condenses, and the liquid freezes.",
         arrow(920, 336, 700, 336, "blue"), write("condensing", 810, 372, 22, "blue", "center"),
         arrow(500, 336, 290, 336, "blue"), write("freezing", 395, 372, 22, "blue", "center"),
         write("cooling:  slower particles,  pulled back together", 70, 526, 23, "blue")),

    step("One surprise. While ice is melting, or water is boiling, the temperature does not rise at all. The heat goes into pulling the particles apart, "
         "not into speeding them up. That hidden heat is called latent heat, and we will meet it properly later.",
         write("while melting or boiling:  temperature stays the same  (latent heat)", 70, 590, 22, "yellow"),
         pause=0.8),

    # ── 7. Gas pressure ───────────────────────────────────────────────
    step("Last, gas pressure. Gas particles are always crashing into the walls of their container. Each hit is a tiny push. "
         "Billions of hits every second add up to the pressure of the gas.",
         clear(2.2),
         heading("Gas pressure"),
         box(860, 200, 330, 230, "white", 3.0),
         *moving([(920, 260), (1020, 245), (1130, 280), (950, 370), (1060, 350), (1130, 395), (1000, 310)]),
         *[line(x, 202, x, 188, "pink", 2.4) for x in (950, 1100)], *[line(1188, y, 1202, y, "pink", 2.4) for y in (280, 380)],
         line(862, 330, 848, 330, "pink", 2.4),
         write("each hit on a wall:  a tiny push", 70, 190, 24),
         write("billions of hits:  the gas pressure", 70, 228, 24),
         chapter="Gas pressure"),

    step("Now heat the gas. The particles move faster, so they hit the walls more often, and harder. The pressure rises. "
         "That is why a car tyre's pressure is higher after a long drive.",
         *[curve([(905 + 55 * i, 492), (917 + 55 * i, 458), (931 + 55 * i, 492)], "yellow", 2.6) for i in range(5)],
         write("heat", 1180, 484, 20, "yellow"),
         write("hotter:  faster particles", 70, 300, 24),
         write("more hits,  harder hits:  more pressure", 70, 336, 24, "green"),
         write("a car tyre after a long drive", 70, 376, 22, "grey")),

    step("Over to you. A can of insect spray says: do not heat. Using particles, explain why. Stop the video, and say your answer out loud.",
         *pause_sign(1180, 82),
         write("Over to you:  a spray can says", 70, 440, 24, "blue"),
         write("Do not heat.   Why?", 70, 476, 24, "blue"),
         pause=3.0),

    step("Heat makes the gas particles inside move faster. They strike the walls more often, and with more force, so the pressure climbs. "
         "Too much, and the can bursts. If your answer had particles, speed and collisions in it: full marks.",
         write("faster particles:  more frequent,  harder hits;", 70, 530, 23, "green"),
         write("the pressure rises,  and the can can burst", 70, 566, 23, "green")),

    step("So: tiny particles, always moving, pulling on each other, faster when hot. That one idea explained everything today. "
         "Next time, it explains why sweat cools you, and why water in a clay pot stays cold.",
         write("Next:  why sweat cools you", 70, 626, 24, "yellow"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Kinetic Theory", 54, 140, 80, "yellow"),
    write("solid  ·  liquid  ·  gas  ·  Brownian motion  ·  diffusion", 60, 210, 30),
    box(80, 290, 300, 230, "grey", 3.0), *particles([(x, y + 110) for x, y in SOLID], 14),
    box(490, 290, 300, 230, "grey", 3.0), *particles([(x, y + 160) for x, y in LIQUID], 14),
    box(900, 290, 300, 230, "grey", 3.0), *moving([(x, y + 110) for x, y in GAS], r=12),
    write("solid", 230, 570, 30, "white", "center"), write("liquid", 640, 570, 30, "white", "center"), write("gas", 1050, 570, 30, "white", "center"),
]
