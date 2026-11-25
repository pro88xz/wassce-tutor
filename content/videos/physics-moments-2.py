"""Physics · Moments and turning effects: centre of gravity and stability. A chalkboard video lesson.

Follows content/notes/physics-moments-2.md, reasoning from what students see:
opens on a woman walking to market with a full basin on her head, perfectly
steady (what is she doing that a physics student should notice?); centre of
gravity, and where it is for regular shapes (even in empty space, for a ring);
finding it for an irregular card with a plumb line, and why the method works;
why things topple, drawn as two tilted blocks (the vertical line through G inside
or outside the base); stable, unstable and neutral equilibrium with a cone;
the two ways to be stable, and the overloaded lorry; and weighing a metre rule
with moments as "your go".

Check: python3 scripts/video/board_video.py content/videos/physics-moments-2.py --boards .video-build/boards/mom2
"""

from board_video import arrow, blob, box, clear, curve, dashed, dots, ellipse, heading, line, step, write

TITLE = "Centre of Gravity and Stability: Stable, Unstable and Neutral Equilibrium | WASSCE Physics"
DESCRIPTION = ("Centre of gravity on the chalkboard, explained: why a basin on the head stays put, finding the centre of "
               "gravity with a plumb line, why things topple, stable, unstable and neutral equilibrium, why loaded lorries "
               "overturn, and finding the mass of a metre rule.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Moments"
# The lesson page this video is on: /wassce/physics/moments-and-turning-effects/centre-of-gravity-and-stability
LESSON = "physics/moments-and-turning-effects/centre-of-gravity-and-stability"


def stop_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def tilted_block(px, py, w, h, deg, color="white"):
    """A block of w × h tilted by deg about its bottom-right corner (px, py); returns strokes and its centre."""
    import math
    t = math.radians(deg)
    # corners relative to the pivot corner, block standing to the left of it
    pts = [(0, 0), (-w, 0), (-w, -h), (0, -h)]
    # tipped onto its right edge: the left side lifts, the top leans right
    rot = [(px + x * math.cos(t) - y * math.sin(t), py + x * math.sin(t) + y * math.cos(t)) for x, y in pts]
    cx = px + (-w / 2) * math.cos(t) - (-h / 2) * math.sin(t)
    cy = py + (-w / 2) * math.sin(t) + (-h / 2) * math.cos(t)
    out = [line(*rot[i], *rot[(i + 1) % 4], color, 3.0) for i in range(4)]
    return out, (cx, cy)


B1, G1 = tilted_block(900, 600, 120, 200, 18)
B2, G2 = tilted_block(1130, 600, 60, 240, 22)

STEPS = [
    # ── 1. The basin ──────────────────────────────────────────────────
    step("Picture a woman walking to the market with a full basin of oranges balanced on her head. Her back is straight, "
         "her steps are calm, and the basin does not wobble. She has never studied physics. But she is using it perfectly.",
         heading("A basin on the head"),
         ellipse(990, 250, 22, 24, "white", 3.0), line(990, 275, 990, 420, "white", 3.0),
         line(990, 420, 966, 540, "white", 3.0), line(990, 420, 1014, 540, "white", 3.0),
         line(990, 310, 950, 250, "white", 3.0), line(990, 310, 1030, 250, "white", 3.0),
         curve([(920, 222), (990, 232), (1060, 222)], "yellow", 3.2), line(920, 222, 1060, 222, "yellow", 3.2),
         dots([(950, 212), (975, 208), (1000, 210), (1025, 212)], "yellow", 9),
         line(900, 545, 1080, 545, "grey", 2.4),
         pause=0.9, chapter="What is the centre of gravity?"),

    step("She keeps the weight of the basin, and of her own body, right above her feet. To understand why that matters, "
         "we need one idea: the centre of gravity.",
         dashed(990, 200, 990, 545, "pink"),
         write("weight kept above the feet", 70, 200, 26, "pink")),

    step("Every part of a body has weight. But for any body, there is one point where the whole weight seems to act. "
         "That point is the centre of gravity, and we usually mark it G.",
         write("centre of gravity, G:", 70, 270, 27, "yellow"),
         write("where the whole weight appears to act", 70, 310, 27, "yellow")),

    step("For a uniform rod, it is at the middle. For a rectangle, where the diagonals cross. For a triangle, where the medians meet. "
         "And for a ring, it is at the centre, in the empty space. Where there is no ring at all.",
         write("rod:  the middle", 100, 380, 24),
         write("rectangle:  where the diagonals cross", 100, 418, 24),
         write("triangle:  where the medians meet", 100, 456, 24),
         write("ring:  the centre, in the empty space!", 100, 494, 24, "pink")),

    # ── 2. The plumb line ─────────────────────────────────────────────
    step("For an irregular shape, there is a beautiful experiment. Make three small holes near the edge of a piece of card. "
         "Hang it from a pin through one hole, with a plumb line from the same pin.",
         clear(2.2),
         heading("Finding G with a plumb line"),
         blob(1040, 400, 180, 150, "white", 3.2, seed=7),
         dots([(950, 280), (1200, 340), (990, 530)], "grey", 6),
         ellipse(950, 280, 6, 6, "yellow", 2.6),
         dashed(950, 280, 1105, 560, "pink"), write("plumb line", 1120, 584, 20, "pink", "center"),
         chapter="Finding the centre of gravity"),

    step("When it stops swinging, draw along the plumb line. Then hang it from the second hole, and draw again. The two lines cross at G. "
         "The third hole is your check: its line should pass through the same point.",
         dashed(1200, 340, 920, 450, "blue"), dashed(990, 530, 1050, 255, "green"),
         dots([(1035, 410)], "yellow", 9), write("G", 1050, 400, 24, "yellow"),
         write("1. hang, wait, draw along the plumb line", 70, 200, 23),
         write("2. repeat from the other holes", 70, 238, 23),
         write("3. the lines cross at G  (the third is a check)", 70, 276, 23, "yellow")),

    step("But why does it work? Because a body hanging freely always comes to rest with its centre of gravity directly below the pin. "
         "If G were off to one side, the weight would have a moment about the pin, and turn the card until G swung underneath.",
         write("Why?  At rest, G is always directly below the pin.", 70, 350, 23, "green"),
         write("Off to one side, the weight would turn it.", 70, 388, 23, "green")),

    step("Precautions: the card must swing freely on the pin, and you must mark the line carefully, at two points far apart.",
         write("precautions:  free to swing;  two marks, far apart", 70, 450, 22, "pink")),

    # ── 3. Why things fall over ───────────────────────────────────────
    step("Now, why do things fall over? Tip a block onto one edge. Imagine a vertical line dropping straight down from its centre of gravity. "
         "As long as that line lands inside the base, the weight turns the block back down. It rocks back.",
         clear(2.2),
         heading("Why things fall over"),
         line(760, 600, 1240, 600, "grey", 2.4),
         *B1, dots([G1], "yellow", 8), write("G", G1[0] + 12, G1[1] - 6, 22, "yellow"),
         dashed(G1[0], G1[1], G1[0], 600, "green"),
         write("rocks back", 870, 634, 22, "green", "center"),
         write("line from G lands inside the base:  rocks back", 70, 200, 23, "green"),
         chapter="Why things topple"),

    step("But a tall, thin block, tipped by the same amount, is different. The line from G now lands outside the base. "
         "The weight turns it the other way, and over it goes.",
         *B2, dots([G2], "yellow", 8), write("G", G2[0] - 12, G2[1] - 6, 22, "yellow", "right"),
         dashed(G2[0], G2[1], G2[0], 600, "pink"),
         write("topples!", 1130, 634, 22, "pink", "center"),
         write("line from G lands outside the base:  topples", 70, 240, 23, "pink")),

    step("Quick check. Which is harder to knock over: a tall, narrow wardrobe, or a low, wide table?",
         write("Quick check:  a tall wardrobe or a low, wide table?", 70, 320, 23, "pink"),
         pause=2.2),

    step("The low, wide table. To topple it, you must tip it a very long way before the line from G leaves its base. "
         "So stability comes from two things: a low centre of gravity, and a wide base.",
         write("the table.   Stability:", 70, 370, 25, "green"),
         write("a LOW centre of gravity,  a WIDE base", 100, 412, 26, "yellow")),

    # ── 4. Three kinds of equilibrium ─────────────────────────────────
    step("There are three kinds of equilibrium, and a cone shows all three. Stand it on its wide base, and give it a nudge. "
         "It rocks back. That is stable equilibrium: a small tilt raises its centre of gravity, so it falls back down.",
         clear(2.2),
         heading("Three kinds of equilibrium"),
         line(80, 520, 1200, 520, "grey", 2.4),
         line(150, 520, 250, 520, "white", 3.0), line(150, 520, 200, 380, "white", 3.0), line(250, 520, 200, 380, "white", 3.0),
         write("stable", 200, 570, 24, "green", "center"), write("G rises:  falls back", 200, 604, 20, "green", "center"),
         chapter="Stable, unstable and neutral equilibrium"),

    step("Now balance it on its point. The slightest breath, and it falls. That is unstable equilibrium: any tilt lowers its centre of gravity, "
         "so it keeps going. Like a pencil on its tip, or a student balancing a chair on its back legs in class.",
         line(600, 380, 700, 380, "white", 3.0), line(600, 380, 650, 520, "white", 3.0), line(700, 380, 650, 520, "white", 3.0),
         write("unstable", 650, 570, 24, "pink", "center"), write("G falls:  falls over", 650, 604, 20, "pink", "center"),
         pause=0.9),

    step("And lay it on its side. Roll it, and it simply stays wherever it stops. That is neutral equilibrium: its centre of gravity stays at the same height.",
         line(980, 470, 1140, 420, "white", 3.0), line(980, 470, 1140, 520, "white", 3.0), ellipse(1140, 470, 14, 50, "white", 3.0),
         write("neutral", 1060, 570, 24, "blue", "center"), write("G level:  stays put", 1060, 604, 20, "blue", "center")),

    step("Look at the world with this in mind. Racing cars are built low and wide. Buses carry their heavy engines and fuel tanks low down. "
         "And a lorry loaded with bags of rice on top of light goods has a high centre of gravity. On a sharp bend, it can tip over.",
         write("racing cars:  low and wide", 70, 200, 24),
         write("buses:  engine and fuel low down", 70, 238, 24),
         write("rice bags on top:  high G, tips on a bend", 70, 276, 24, "pink")),

    step("And the woman with the basin? She keeps the combined centre of gravity of herself and her load directly over her feet. "
         "Carry a heavy bucket in one hand, and you lean the other way, for exactly the same reason.",
         write("the basin, the bucket:  G kept over the feet", 70, 330, 24, "yellow")),

    # ── 5. Your go: weigh a metre rule ────────────────────────────────
    step("Moments can even weigh things. A uniform metre rule balances at fifty centimetres. Hang a forty gram mass at the ten centimetre mark, "
         "and the balance point moves to thirty. What is the mass of the rule?",
         clear(2.2),
         heading("Your go"),
         *stop_sign(1180, 82),
         line(700, 400, 1200, 400, "white", 4.0),
         *[line(700 + 50 * i, 392, 700 + 50 * i, 408, "grey", 1.8) for i in range(11)],
         line(800, 404, 790, 444, "white", 3.0), line(800, 404, 810, 444, "white", 3.0), line(790, 444, 810, 444, "white", 3.0),
         write("30", 800, 380, 18, "grey", "center"), write("50", 950, 380, 18, "grey", "center"), write("10", 750, 380, 18, "grey", "center"),
         line(750, 404, 750, 450, "white", 2.0), box(737, 450, 26, 26, "blue", 2.6), write("40 g", 750, 500, 20, "blue", "center"),
         write("Balances at 50 cm.  With 40 g at the 10 cm mark,", 70, 190, 23),
         write("it balances at 30 cm.  Mass of the rule?", 70, 226, 23, "blue"),
         chapter="Weighing a metre rule with moments"),

    step("Your go. Hint: where does the rule's own weight act?",
         write("your go", 1130, 92, 22, "pink", "right"),
         pause=3.3),

    step("The rule's weight acts at its middle, the fifty centimetre mark. That is twenty centimetres from the new pivot, on one side. "
         "The forty grams is also twenty centimetres away, on the other side.",
         arrow(950, 404, 950, 480, "pink"), write("M", 965, 476, 22, "pink"),
         write("rule's weight at 50 cm:  20 cm from the pivot", 70, 300, 23),
         write("40 g at 10 cm:  20 cm from the pivot", 70, 338, 23)),

    step("Forty times twenty equals M times twenty. So the rule's mass is forty grams. The rule has weighed itself, "
         "using nothing but a pivot and a known mass. Physics is quite elegant, when it wants to be.",
         write("40 × 20 = M × 20,    M = 40 g", 70, 400, 27, "green"),
         pause=1.0),

    step("And that completes moments. From doors to see-saws to falling wardrobes, it is all one idea: force times distance. "
         "Next up: friction, the force that lets you walk, and makes every machine a little less perfect.",
         write("Next:  friction", 70, 490, 26, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Stability", 54, 140, 84, "yellow"),
    write("Centre of gravity  ·  Stable  ·  Unstable  ·  Neutral", 60, 210, 28),
    line(560, 600, 1240, 600, "grey", 3.0),
    *tilted_block(760, 600, 140, 200, 18)[0],
    dashed(tilted_block(760, 600, 140, 200, 18)[1][0], tilted_block(760, 600, 140, 200, 18)[1][1], tilted_block(760, 600, 140, 200, 18)[1][0], 600, "green"),
    *tilted_block(1120, 600, 70, 280, 22)[0],
    dashed(tilted_block(1120, 600, 70, 280, 22)[1][0], tilted_block(1120, 600, 70, 280, 22)[1][1], tilted_block(1120, 600, 70, 280, 22)[1][0], 600, "pink"),
    write("Why things topple", 70, 420, 46, "pink"),
]
