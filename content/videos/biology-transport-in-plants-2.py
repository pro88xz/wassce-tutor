"""Biology · Transport in plants: transpiration, the potometer and translocation. A chalkboard video lesson.

Follows content/notes/biology-transport-in-plants-2.md: transpiration and the
stomata (open and closed), the path of water from soil to air and the
transpiration pull, the factors that change the rate, the potometer (and what
it really measures), translocation from source to sink, and xylem against
phloem.
Check: python3 scripts/video/board_video.py content/videos/biology-transport-in-plants-2.py --boards .video-build/boards/transport2
"""

from board_video import arrow, box, clear, curve, ellipse, heading, label, line, step, text_width, write

TITLE = "Transpiration, the Potometer and Translocation in Phloem | WASSCE Biology"
DESCRIPTION = ("Transpiration explained on the chalkboard: how stomata open and close, the path of water from soil to "
               "air, factors affecting the rate, the potometer experiment, and translocation from source to sink in "
               "the phloem.")
LABEL = "WASSCE Tutor  ·  Biology  ·  Transport in plants"
# The lesson page this video is on: /wassce/biology/transport-in-plants/transport-in-plants-transpiration-water-movement-and-translocation
LESSON = "biology/transport-in-plants/transport-in-plants-transpiration-water-movement-and-translocation"


def guard_cells(cx, cy, open_=True, s=1.0, width=3.4):
    """A pair of guard cells, as seen on the leaf surface: open, with a pore, or closed."""
    gap = 1.0 if open_ else 0.08
    left = [(-30, -90), (-68, -70), (-86, 0), (-68, 70), (-30, 90), (-30 - 8 * (1 - gap), 50), (-44 * gap - 2, 0), (-30 - 8 * (1 - gap), -50)]
    pts_l = [(cx + x * s, cy + y * s) for x, y in left]
    pts_r = [(cx - x * s, cy + y * s) for x, y in left]
    return [curve(pts_l, "green", width, closed=True), curve(pts_r, "green", width, closed=True)]


def leaf(x, y, w, h, color="green", width=3.4):
    return curve([(x, y), (x + w * 0.3, y - h * 0.5), (x + w * 0.7, y - h * 0.55), (x + w, y), (x + w * 0.65, y + h * 0.45), (x + w * 0.3, y + h * 0.4)],
                 color, width, closed=True)


STEPS = [
    # ── 1. Transpiration and stomata ───────────────────────────────────
    step("Plants lose a lot of water. Transpiration is the loss of water vapour from the parts of the plant above the ground, mainly through the stomata in the leaves.",
         heading("Transpiration"),
         write("Transpiration:  the loss of water vapour from the aerial", 70, 176, 26),
         write("parts of a plant, mainly through the stomata.", 70 + text_width("Transpiration:  ", 26), 214, 26),
         chapter="What is transpiration? How stomata open and close"),

    step("Each stoma is a pore between two guard cells. When the guard cells are full of water, or turgid, they bend apart and the stoma opens.",
         *guard_cells(330, 420, True),
         write("turgid guard cells:", 330, 560, 24, "green", "center"), write("stoma open", 330, 592, 24, "green", "center")),

    step("When they lose water and become flaccid, they close the pore. Then much less water is lost.",
         *guard_cells(800, 420, False),
         write("flaccid guard cells:", 800, 560, 24, "yellow", "center"), write("stoma closed", 800, 592, 24, "yellow", "center")),

    step("An open stoma lets carbon dioxide in for photosynthesis, but it also lets water vapour out. That is the price a plant pays for making food.",
         arrow(330, 440, 330, 286, "blue", 3.2), write("water vapour out", 350, 300, 22, "blue"),
         arrow(520, 470, 344, 436, "pink", 3.2), write("CO_2 in", 530, 480, 22, "pink")),

    # ── 2. The path of water ───────────────────────────────────────────
    step("Follow one drop of water through the plant.",
         clear(2.2),
         heading("From soil to air"),
         line(70, 600, 560, 600, "grey", 3.0),
         line(250, 600, 250, 220, "white", 4.0), leaf(250, 226, 210, 90),
         curve([(250, 600), (230, 640), (206, 660)], "white", 3.0), curve([(250, 600), (270, 642), (296, 660)], "white", 3.0),
         chapter="How water moves up a plant: the transpiration stream"),

    step("Root hairs take it in from the soil by osmosis. It crosses the root, and enters the xylem.",
         write("1.  root hairs absorb it (osmosis)", 600, 190, 24),
         write("2.  across the root into the xylem", 600, 232, 24)),

    step("It rises up the stem in the xylem, into the veins of the leaf, and into the mesophyll cells.",
         arrow(268, 590, 268, 250, "blue", 3.4),
         write("3.  up the stem in the xylem", 600, 274, 24),
         write("4.  into the mesophyll cells of the leaf", 600, 316, 24)),

    step("It evaporates from their wet surfaces into the air spaces, and diffuses out through the stomata.",
         arrow(420, 210, 500, 150, "blue", 3.2),
         write("5.  evaporates into the air spaces", 600, 358, 24),
         write("6.  diffuses out through the stomata", 600, 400, 24)),

    step("What pulls it up? Water evaporating from the leaf pulls on the column of water in the xylem. Water molecules stick together, which is cohesion, "
         "and to the xylem walls, which is adhesion, so the whole column is pulled up. This is the transpiration pull.",
         write("Transpiration pull:", 600, 474, 26, "yellow"),
         write("evaporation pulls the water column up;", 600, 512, 22),
         write("cohesion: water sticks to water", 600, 544, 22),
         write("adhesion: water sticks to xylem walls", 600, 576, 22)),

    # ── 3. Factors ─────────────────────────────────────────────────────
    step("Several things change how fast a plant transpires. Learn them with the reason, because the reason earns the marks.",
         clear(2.2),
         heading("Factors affecting transpiration"),
         write("Factor", 70, 172, 23, "grey"), write("Rate", 370, 172, 23, "grey"), write("Why", 560, 172, 23, "grey"),
         line(60, 188, 1200, 188, "grey", 2.4),
         chapter="Factors affecting the rate of transpiration"),

    step("Bright light: faster, because the stomata open.",
         write("light", 70, 236, 26, "yellow"), write("faster", 370, 236, 26, "green"), write("stomata open", 560, 236, 24)),
    step("Higher temperature: faster, because water evaporates and diffuses faster.",
         write("temperature", 70, 300, 26, "yellow"), write("faster", 370, 300, 26, "green"), write("faster evaporation and diffusion", 560, 300, 24)),
    step("High humidity: slower, because the air is already moist, so the difference in water vapour between the leaf and the air is smaller.",
         write("humidity (high)", 70, 364, 26, "yellow"), write("slower", 370, 364, 26, "pink"), write("smaller water vapour gradient", 560, 364, 24)),
    step("Wind: faster, because it blows away the moist air around the leaf.",
         write("wind", 70, 428, 26, "yellow"), write("faster", 370, 428, 26, "green"), write("removes the moist air near the leaf", 560, 428, 24)),
    step("And dry soil: slower, because the stomata close to save water.",
         write("dry soil", 70, 492, 26, "yellow"), write("slower", 370, 492, 26, "pink"), write("stomata close to save water", 560, 492, 24)),
    step("These are general trends. In very hot, dry weather a plant may close its stomata, so the rate falls.",
         write("In very hot, dry weather the stomata may close, and the rate falls.", 70, 580, 23, "grey")),

    # ── 4. The potometer ───────────────────────────────────────────────
    step("We measure the rate with a potometer. A leafy shoot is fitted, under water, into a tube full of water, joined to a long capillary tube.",
         clear(2.2),
         heading("The potometer"),
         line(230, 176, 230, 300, "white", 3.6),
         leaf(230, 200, 120, 44), leaf(230, 250, -110, 40), leaf(230, 290, 110, 38),
         box(216, 300, 28, 32, "grey", 3.0),
         line(222, 332, 222, 372, "white", 3.0), line(238, 332, 238, 356, "white", 3.0),
         line(222, 372, 900, 372, "white", 3.0), line(238, 356, 900, 356, "white", 3.0),
         *[line(x, 380, x, 392 if (x - 300) % 100 else 400, "grey", 2.0) for x in range(300, 881, 20)],
         write("scale", 560, 432, 20, "grey"),
         box(900, 330, 120, 130, "white", 3.0),
         chapter="The potometer experiment: measuring water uptake"),

    step("An air bubble is let into the capillary. As the shoot takes up water, the bubble moves towards it. We time how far it moves.",
         ellipse(760, 364, 16, 6, "yellow", 2.6),
         arrow(740, 330, 640, 330, "yellow", 3.0), write("bubble moves", 620, 316, 22, "yellow", "right")),

    step("The rate of water uptake is the distance the bubble moves, divided by the time.",
         write("rate of uptake  =", 70, 520, 27),
         write("distance moved by bubble", 70 + text_width("rate of uptake  =  ", 27), 506, 23),
         line(70 + text_width("rate of uptake  =  ", 27), 516, 70 + text_width("rate of uptake  =  ", 27) + text_width("distance moved by bubble", 23), 516, "white", 2.4),
         write("time", 70 + text_width("rate of uptake  =  ", 27) + text_width("distance moved by bubble", 23) / 2, 546, 23, "white", "center")),

    step("Be careful: a potometer measures water uptake, not water loss. Some of the water is used in photosynthesis and to keep the cells firm.",
         write("It measures water UPTAKE, not loss.", 70, 604, 26, "pink")),

    step("For a fair test, change one factor at a time, and keep the others the same. Repeat the readings and take the mean.",
         write("Fair test:", 890, 506, 24, "yellow"), write("change one factor;", 890, 538, 21),
         write("keep the rest the same;", 890, 568, 21), write("repeat, take the mean.", 890, 598, 21)),

    # ── 5. Translocation ───────────────────────────────────────────────
    step("Phloem does a different job. Translocation is the movement of dissolved food, mainly sucrose, in the phloem, from a source to a sink.",
         clear(2.2),
         heading("Translocation in the phloem"),
         write("Translocation:  moving dissolved food (mainly sucrose)", 70, 176, 26),
         write("in the phloem, from a source to a sink.", 70 + text_width("Translocation:  ", 26), 214, 26),
         chapter="Translocation in the phloem; xylem versus phloem"),

    step("A source is where sugar is made or released, such as a leaf in the light. A sink is where it is used or stored: growing roots, fruits and seeds. "
         "So food can travel up or down the plant.",
         box(70, 260, 300, 70, "green", 3.0), write("source:  leaf", 220, 306, 26, "green", "center"),
         box(560, 260, 400, 70, "yellow", 3.0), write("sink:  root, fruit, seed", 760, 306, 26, "yellow", "center"),
         arrow(380, 284, 548, 284, "white", 3.2), arrow(548, 308, 380, 308, "grey", 2.8),
         write("either way", 464, 352, 20, "grey", "center")),

    step("Now compare the two transport tissues. Xylem carries water and mineral ions, mainly upwards, in dead, hollow vessels. "
         "Phloem carries sucrose and amino acids, from source to sink, in living sieve tubes, helped by companion cells.",
         write("Xylem", 330, 420, 28, "blue"), write("Phloem", 800, 420, 28, "green"),
         line(60, 436, 1200, 436, "grey", 2.4),
         write("carries", 70, 478, 22, "grey"), write("water, mineral ions", 330, 478, 23), write("sucrose, amino acids", 800, 478, 23),
         write("direction", 70, 518, 22, "grey"), write("mainly upwards", 330, 518, 23), write("source to sink, either way", 800, 518, 23),
         write("cells", 70, 558, 22, "grey"), write("dead, hollow vessels", 330, 558, 23), write("living sieve tubes", 800, 558, 23)),

    step("And never mix up the two words. Transpiration is the loss of water vapour. Translocation is moving food in the phloem.",
         write("transpiration:  water vapour lost", 70, 630, 23, "pink"), write("translocation:  food in phloem", 680, 630, 23, "pink"),
         pause=1.2),
]

THUMBNAIL = [
    write("Transpiration", 54, 150, 78, "yellow"),
    write("Stomata  ·  Potometer  ·  Translocation", 60, 214, 32),
    *guard_cells(250, 440, True, 1.25, 5.2),
    arrow(250, 450, 250, 270, "blue", 5.0),
    line(640, 660, 640, 300, "white", 6.0), leaf(640, 310, 240, 100, "green", 5.2), leaf(640, 420, -220, 90, "green", 5.2),
    arrow(668, 640, 668, 330, "blue", 5.0),
    write("water vapour out", 900, 300, 28, "blue"), write("up the xylem", 880, 560, 28, "blue"),
]
