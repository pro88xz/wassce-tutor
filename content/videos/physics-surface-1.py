"""Physics · Surface tension and capillarity. A chalkboard video lesson.

Follows content/notes/physics-surface-1.md, each idea with its reason: opens on a
surprising claim (a solid steel needle, nearly eight times denser than water, floats),
something to try that night, and one drop of soap that sinks it; surface tension as a
stretched skin, and why: a molecule inside is pulled equally every way, one at the
surface only sideways and down, so the surface pulls in to the least area (round
raindrops); surface tension at work (a pond skater, a dripping tap), with a joke on
the pond skater; what lowers it (heat, detergent: greasy pots), with a quick check on
the needle; capillarity in tubes of water and mercury, explained from adhesion and
cohesion (a callback to the kinetic theory) and why narrower tubes climb higher;
capillarity at work (the lamp wick, the towel, damp walls); and "over to you" on why
farmers break up the topsoil.

Check: python3 scripts/video/board_video.py content/videos/physics-surface-1.py --boards .video-build/boards/surf1
"""

from board_video import arrow, box, clear, curve, dots, ellipse, heading, line, step, write

TITLE = "Surface Tension and Capillarity Explained: Floating Needles, Round Drops, Meniscus | WASSCE Physics"
DESCRIPTION = ("Surface tension on the chalkboard: why a steel needle floats, the molecular explanation, round raindrops, "
               "insects on water, what lowers surface tension (heat, detergent), capillarity in water and mercury, the "
               "meniscus, and capillarity in lamp wicks, soil and damp walls.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Surface tension"
# The lesson page this video is on: /wassce/physics/surface-tension-capillarity-and-viscosity/surface-tension-and-capillarity
LESSON = "physics/surface-tension-capillarity-and-viscosity/surface-tension-and-capillarity"


def pause_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def tube(cx, w, level, concave=True, color="blue", top=220, bottom=520):
    """A narrow glass tube with liquid up to `level`: walls, a meniscus, and hatching below it."""
    l, r = cx - w / 2, cx + w / 2
    bend = (-6, 4) if concave else (6, -4)
    out = [line(l, top, l, bottom, "white", 2.4), line(r, top, r, bottom, "white", 2.4),
           curve([(l + 1, level + bend[0]), (cx, level + bend[1]), (r - 1, level + bend[0])], color, 2.6)]
    out += [line(l + 2, y, r - 2, y, color, 1.4) for y in range(int(level) + 16, bottom, 18)]
    return out


def pulls(x, y, angles, color="grey", r=14, length=38):
    """Arrows out from a molecule at (x, y): the pulls of its neighbours."""
    import math
    return [ellipse(x, y, r, r, "white", 2.6)] + [
        arrow(x + (r + 2) * math.cos(math.radians(a)), y - (r + 2) * math.sin(math.radians(a)),
              x + (r + length) * math.cos(math.radians(a)), y - (r + length) * math.sin(math.radians(a)), color, 2.2) for a in angles]


STEPS = [
    # ── 1. Steel that floats ──────────────────────────────────────────
    step("Here is a claim that sounds impossible. A solid steel needle can float on water. Not in a boat. Not hollow. Just a needle, lying on the surface. "
         "Steel is nearly eight times denser than water. So how?",
         heading("Steel that floats"),
         line(840, 330, 862, 520, "white", 3.0), line(862, 520, 1138, 520, "white", 3.0), line(1138, 520, 1160, 330, "white", 3.0),
         curve([(846, 380), (930, 380), (968, 384), (1000, 396), (1032, 384), (1070, 380), (1154, 380)], "blue", 2.8),
         line(952, 392, 1048, 392, "white", 3.4), ellipse(1054, 392, 6, 3, "white", 2.0),
         write("needle", 1000, 350, 20, "grey", "center"),
         write("steel:  nearly 8 times denser than water", 70, 200, 24),
         write("yet a dry needle floats!", 70, 240, 26, "yellow"),
         pause=1.2, chapter="A floating needle"),

    step("Try it tonight. Lay a dry needle very gently on a cup of water, using a fork. It floats. Look closely, and the surface dips under it, "
         "like a stretched skin under a weight. Now add one drop of soap, and down it goes.",
         dots([(1110, 318), (1112, 340)], "pink", 6.0), write("soap", 1130, 330, 20, "pink"),
         arrow(1000, 410, 1000, 490, "pink"),
         write("the surface dips under it,  like a skin", 70, 310, 23),
         write("one drop of soap:  it sinks", 70, 350, 23, "pink")),

    # ── 2. Surface tension ────────────────────────────────────────────
    step("The surface of a liquid behaves like a stretched, elastic skin. That is surface tension. "
         "It is measured as a force per unit length along the surface, in newtons per metre.",
         clear(2.2),
         heading("Surface tension"),
         write("surface tension:  the surface acts like a", 70, 190, 24),
         write("stretched elastic skin", 70, 226, 24),
         write("measured as force per length:  N m^{-1}", 70, 270, 22, "grey"),
         chapter="Surface tension"),

    step("Why? Look at a molecule deep inside the water. Its neighbours pull it equally in every direction, so the pulls cancel. "
         "Now a molecule at the surface. It has neighbours beside it and below it, but none above. So it feels a net pull, inwards, into the liquid.",
         line(760, 300, 1220, 300, "blue", 2.8), line(760, 300, 760, 580, "white", 2.6), line(760, 580, 1220, 580, "white", 2.6),
         line(1220, 580, 1220, 300, "white", 2.6),
         *pulls(880, 460, range(0, 360, 45)), write("inside", 880, 545, 20, "grey", "center"),
         *pulls(1090, 300, (0, 180, 225, 270, 315)), arrow(1170, 320, 1170, 410, "pink", 3.4),
         write("net pull", 1170, 440, 20, "pink", "center"), write("at the surface", 1090, 260, 20, "grey", "center"),
         write("inside:  pulled equally every way", 70, 340, 23),
         write("at the surface:  nothing above,", 70, 386, 23),
         write("so a net pull INWARDS", 70, 422, 23, "pink")),

    step("Every surface molecule is pulled in, so the surface shrinks to the smallest area it can, and stays tight, like the skin of a drum. "
         "That is why raindrops and drops of mercury are round. For a given volume, a sphere has the least surface.",
         write("the surface shrinks to the least area:", 70, 490, 23, "green"),
         write("round raindrops,  round mercury drops", 70, 526, 23, "green")),

    # ── 3. Surface tension at work ────────────────────────────────────
    step("You see surface tension everywhere. An insect called a pond skater walks on water, its feet making little dents in the skin. "
         "And a tap drips in drops: each drop grows until its weight beats the surface tension holding it.",
         clear(2.2),
         heading("Surface tension at work"),
         curve([(760, 420), (815, 420), (830, 428), (845, 420), (865, 420), (880, 428), (895, 420), (945, 420), (960, 428), (975, 420),
                (995, 420), (1010, 428), (1025, 420), (1080, 420)], "blue", 2.6),
         ellipse(920, 362, 44, 8, "white", 2.8), ellipse(972, 361, 8, 7, "white", 2.4),
         *[curve([a, b, c], "white", 2.2) for a, b, c in (((898, 366), (868, 334), (830, 424)), ((910, 368), (893, 348), (880, 424)),
                                                          ((930, 368), (947, 348), (960, 424)), ((942, 366), (978, 332), (1010, 424)))],
         write("pond skater", 920, 470, 20, "grey", "center"),
         line(1110, 200, 1190, 200, "white", 3.0), line(1190, 200, 1190, 236, "white", 3.0),
         curve([(1182, 240), (1176, 262), (1190, 276), (1204, 262), (1198, 240)], "blue", 2.6),
         write("drip", 1190, 312, 20, "grey", "center"),
         write("a pond skater walks on water", 70, 200, 23),
         write("a tap drips in drops", 70, 240, 23),
         chapter="Surface tension at work"),

    step("Pond skaters have been doing this for millions of years, without ever studying physics. You, unfortunately, have an exam.",
         write("pond skaters:  no physics exam.   You:  sorry!", 70, 310, 22, "grey"),
         pause=1.1),

    # ── 4. What lowers surface tension ────────────────────────────────
    step("Two things lower surface tension: heat, and impurities like soap or detergent. That is exactly why greasy pots come clean "
         "with hot water and detergent, but not with cold water alone. The water spreads out, and gets in under the grease.",
         clear(2.2),
         heading("What lowers surface tension?"),
         write("1.  heat:  hot water", 70, 200, 24),
         write("2.  soap or detergent", 70, 240, 24),
         write("so hot water and detergent clean greasy pots", 70, 300, 23, "green"),
         line(860, 300, 880, 460, "white", 3.0), line(880, 460, 1080, 460, "white", 3.0), line(1080, 460, 1100, 300, "white", 3.0),
         line(840, 300, 1120, 300, "white", 3.0), line(840, 300, 818, 286, "white", 2.6), line(1120, 300, 1142, 286, "white", 2.6),
         *[ellipse(x, y, 16, 7, "yellow", 2.2) for x, y in ((930, 420), (1010, 430), (980, 380))],
         write("grease", 980, 510, 20, "yellow", "center"),
         chapter="What lowers surface tension"),

    step("Quick check. Back to the floating needle. Why does it sink when you add a drop of detergent to the water?",
         write("Quick check:  why does the needle sink", 70, 380, 24, "blue"),
         write("when detergent is added?", 70, 416, 24, "blue"),
         pause=2.2),

    step("The detergent lowers the surface tension. The skin becomes too weak to hold the needle up, so it sinks.",
         write("detergent lowers the surface tension:", 70, 480, 23, "green"),
         write("the skin is too weak to hold it", 70, 516, 23, "green")),

    # ── 5. Capillarity ────────────────────────────────────────────────
    step("Now dip some narrow glass tubes into water. The water climbs up inside them, above the level outside. "
         "And the narrower the tube, the higher it climbs. A rise like this, in a narrow tube, is called capillarity.",
         clear(2.2),
         heading("Capillarity"),
         line(760, 330, 760, 560, "white", 3.0), line(760, 560, 990, 560, "white", 3.0), line(990, 560, 990, 330, "white", 3.0),
         line(764, 440, 986, 440, "blue", 2.6), *[line(764, y, 986, y, "blue", 1.2) for y in range(458, 560, 18)],
         *tube(810, 34, 380), *tube(880, 22, 330), *tube(940, 12, 280),
         write("water rises", 875, 600, 20, "blue", "center"),
         write("capillarity:  a liquid rises or falls", 70, 190, 24),
         write("in a narrow tube", 70, 226, 24),
         write("narrower tube:  a higher rise", 70, 270, 23, "yellow"),
         chapter="Capillarity"),

    step("Why? We met this in the last topic. Water's adhesion to glass is stronger than its cohesion. So the water wets the glass and creeps up the walls, "
         "and surface tension pulls the rest of the column up behind it. In a narrower tube, there is less water to lift, so it climbs higher.",
         write("water:  adhesion > cohesion", 70, 340, 23, "blue"),
         write("it wets the glass:  concave,  and it rises", 70, 376, 23, "blue")),

    step("Mercury does the opposite. Its cohesion beats its adhesion, so it pulls away from the glass. The level inside the tube is pushed down, "
         "below the outside level, and its surface bulges up in the middle.",
         line(1030, 330, 1030, 560, "white", 3.0), line(1030, 560, 1220, 560, "white", 3.0), line(1220, 560, 1220, 330, "white", 3.0),
         line(1034, 400, 1068, 400, "grey", 2.6), line(1102, 400, 1155, 400, "grey", 2.6), line(1175, 400, 1216, 400, "grey", 2.6),
         *[line(x0, y, x1, y, "grey", 1.2) for y in range(418, 560, 18)
           for x0, x1 in ([(1034, 1216)] if y > 480 else [(1034, 1068), (1102, 1155), (1175, 1216)] if y < 450 else [(1034, 1155), (1175, 1216)])],
         *tube(1085, 30, 450, concave=False, color="grey"), *tube(1165, 16, 480, concave=False, color="grey"),
         write("mercury falls", 1125, 600, 20, "grey", "center"),
         write("mercury:  cohesion > adhesion", 70, 440, 23),
         write("no wetting:  convex;  pushed down", 70, 476, 23)),

    # ── 6. Capillarity at work ────────────────────────────────────────
    step("Capillarity is busy all around you. Kerosene climbs the wick of a lamp to the flame. A towel or a sponge drinks up a spill. "
         "And water rises through tiny pores in bricks, which is why old walls get damp at the bottom, and why builders lay a damp-proof course of plastic.",
         clear(2.2),
         heading("Capillarity at work"),
         box(850, 470, 150, 80, "white", 3.0), line(925, 470, 925, 400, "yellow", 3.0),
         curve([(915, 398), (918, 370), (925, 352), (932, 370), (935, 398)], "yellow", 2.6),
         line(885, 470, 885, 330, "white", 2.2), line(965, 470, 965, 330, "white", 2.2),
         write("lamp wick", 925, 590, 20, "grey", "center"),
         write("the lamp wick,  a towel,  a sponge", 70, 200, 23),
         write("damp walls:  stopped by a damp-proof course", 70, 240, 23),
         chapter="Capillarity at work"),

    step("Over to you. In the dry season, farmers break up the topsoil to keep water in the ground. Using capillarity, explain why. Stop the video and think it through.",
         *pause_sign(1180, 82),
         line(1040, 400, 1230, 400, "white", 2.6),
         dots([(1050 + 22 * i + (7 if j % 2 else 0), 420 + 22 * j) for j in range(6) for i in range(8)], "grey", 6.0),
         *[arrow(1080 + 50 * i, 540, 1080 + 50 * i, 412, "blue", 2.2) for i in range(3)],
         write("soil", 1135, 590, 20, "grey", "center"),
         write("Over to you:  why do farmers break up", 70, 320, 24, "blue"),
         write("the topsoil in the dry season?", 70, 356, 24, "blue"),
         pause=3.0),

    step("Water rises through the tiny channels between soil particles, all the way to the surface, where it evaporates and is lost. "
         "Breaking up the topsoil breaks those channels, so the water stays down where the roots are.",
         write("water rises up tiny channels to the surface,", 70, 430, 23, "green"),
         write("and evaporates.   Break the topsoil:  break", 70, 466, 23, "green"),
         write("the channels:  the water stays down", 70, 502, 23, "green")),

    step("Next, the friction inside a liquid: why honey pours so slowly, and why a falling raindrop stops speeding up. Viscosity.",
         write("Next:  viscosity", 70, 590, 26, "yellow"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Surface Tension", 54, 140, 80, "yellow"),
    write("floating needles  ·  round drops  ·  capillarity", 60, 210, 30),
    line(140, 330, 180, 560, "white", 3.4), line(180, 560, 620, 560, "white", 3.4), line(620, 560, 660, 330, "white", 3.4),
    curve([(150, 400), (300, 400), (360, 406), (400, 424), (440, 406), (500, 400), (650, 400)], "blue", 3.6),
    line(320, 418, 480, 418, "white", 4.4), write("steel floats?!", 400, 370, 34, "yellow", "center"),
    line(760, 300, 760, 580, "white", 3.0), line(760, 580, 1200, 580, "white", 3.0), line(1200, 580, 1200, 300, "white", 3.0),
    line(764, 470, 1196, 470, "blue", 3.0),
    *tube(860, 44, 400), *tube(980, 28, 340), *tube(1090, 16, 280),
]
