"""Physics · Elasticity: stress, strain, Young's modulus and springs. A chalkboard video lesson.

Follows content/notes/physics-elasticity-2.md, each idea with its reason: opens on
a myth to bust (a thin steel wire stretches far more than a thick rod under the same
load, so is thin steel stretchier steel? No: same steel), which is why engineers
measure force per area and stretch per length; stress and strain, and why each is
"per" something; Young's modulus as a property of the material, with steel, copper
and rubber compared; a steel wire worked through, the mm-to-m and diameter-to-area
traps, and "think fast" on doubling the diameter; springs in series and in parallel,
with why the extensions add or halve, and "over to you" on two identical springs;
and ductile, brittle and rubbery materials sketched on one graph.

Check: python3 scripts/video/board_video.py content/videos/physics-elasticity-2.py --boards .video-build/boards/elas2
"""

from board_video import arrow, box, clear, curve, dashed, double_arrow, ellipse, equation, heading, line, step, write, zigzag

TITLE = "Stress, Strain and Young's Modulus, Springs in Series and Parallel, Ductile and Brittle | WASSCE Physics"
DESCRIPTION = ("Young's modulus on the chalkboard: why thin steel is not stretchier steel, stress and strain, Young's modulus "
               "and its unit, a steel wire worked through, the diameter-to-area trap, springs in series and in parallel, "
               "and ductile, brittle and elastic materials.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Elasticity"
# The lesson page this video is on: /wassce/physics/elasticity-and-hooke-s-law/stress-strain-youngs-modulus-and-springs
LESSON = "physics/elasticity-and-hooke-s-law/stress-strain-youngs-modulus-and-springs"


def pause_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def spring(x, top, bottom, color="white", n=8):
    return zigzag(x, top, x, bottom, n=n, amp=12, color=color, width=2.6)


def cross(x, y, color="pink"):
    return [line(x - 8, y - 8, x + 8, y + 8, color, 2.6), line(x - 8, y + 8, x + 8, y - 8, color, 2.6)]


STEPS = [
    # ── 1. Same steel, different stretch ──────────────────────────────
    step("Here is something that sounds right, but is wrong. Hang the same load on a thin steel wire and on a thick steel rod. "
         "The thin wire stretches far more. So thin steel must be stretchier steel. Right?",
         heading("Same steel,  different stretch"),
         line(820, 190, 1200, 190, "grey", 3.0),
         line(900, 190, 900, 470, "white", 1.6), box(880, 470, 40, 34, "pink", 2.8), write("100 N", 930, 494, 20, "pink"),
         line(1100, 190, 1100, 400, "white", 8.0), box(1080, 400, 40, 34, "pink", 2.8), write("100 N", 1130, 424, 20, "pink"),
         write("thin", 900, 560, 22, "grey", "center"), write("thick", 1100, 560, 22, "grey", "center"),
         pause=1.4, chapter="Why stress and strain?"),

    step("No. It is the same steel. The thin wire stretches more only because the load is shared by fewer particles across its thickness. "
         "So to compare materials fairly, engineers measure force per unit area, and stretch per unit length.",
         dashed(860, 400, 1140, 400, "grey", 2.0), double_arrow(862, 402, 862, 468, "pink", 2.2),
         write("same load,  same steel:", 70, 200, 24),
         write("the thin wire stretches more", 70, 236, 24),
         write("is thin steel stretchier steel?   No!", 70, 300, 24, "pink"),
         write("to compare MATERIALS fairly:", 70, 370, 24, "yellow"),
         write("force per area,  stretch per length", 70, 406, 24, "yellow")),

    # ── 2. Stress and strain ──────────────────────────────────────────
    step("Force per unit cross-sectional area is called tensile stress: F over A. Its unit is the newton per square metre, which is the pascal. "
         "Dividing by the area is what makes it fair to thick and thin wires.",
         clear(2.2),
         heading("Stress and strain"),
         equation(["stress =", ("F", "A")], 70, 230, 30, "yellow"),
         write("unit:  N m^{-2}  =  the pascal  (Pa)", 70, 300, 22),
         write("per area:  fair to thick and thin wires", 70, 338, 22, "grey"),
         ellipse(960, 260, 50, 50, "white", 3.0), *[line(925 + 14 * i, 230, 925 + 14 * i, 290, "grey", 1.4) for i in range(6)],
         write("area A", 960, 345, 20, "grey", "center"),
         chapter="Stress and strain"),

    step("Extension per unit original length is called tensile strain: e over l nought. A length divided by a length, so strain has no unit at all. "
         "Dividing by the length makes it fair to long and short wires.",
         equation(["strain =", ("e", "l_0")], 70, 430, 30, "yellow"),
         write("no unit:  a length over a length", 70, 500, 22),
         write("per length:  fair to long and short wires", 70, 538, 22, "grey"),
         line(1150, 180, 1150, 480, "white", 2.4), dashed(1110, 440, 1200, 440, "grey", 1.8),
         double_arrow(1120, 182, 1120, 438, "grey", 2.2), write("l_0", 1106, 320, 20, "grey", "right"),
         double_arrow(1182, 442, 1182, 478, "pink", 2.2), write("e", 1196, 468, 20, "pink")),

    # ── 3. Young's modulus ────────────────────────────────────────────
    step("Now divide one by the other. Stress over strain is Young's modulus, E. Put in the definitions, and it becomes F l nought, over {A} e. "
         "Strain has no unit, so Young's modulus has the same unit as stress: the pascal.",
         clear(2.2),
         heading("Young's modulus"),
         equation(["E =", ("stress", "strain"), "=", ("F ÷ A", "e ÷ l_0"), "=", ("F l_0", "A e")], 70, 230, 28, "yellow"),
         write("unit:  Pa   (strain has no unit)", 70, 310, 23),
         chapter="Young's modulus"),

    step("And here is the point of it all. Young's modulus belongs to the material, not to the wire. Thick steel, thin steel, long or short: the same E.",
         write("a property of the MATERIAL,  not the wire", 70, 370, 24, "green"),
         write("thick or thin,  long or short steel:  the same E", 70, 406, 22, "grey")),

    step("Steel: about two times ten to the eleven pascals. Copper: about one point two times ten to the eleven. Rubber: only about ten to the six. "
         "Rubber is two hundred thousand times easier to stretch than steel, which is why nobody builds bridges from catapult rubber.",
         write("steel:   2 × 10^{11} Pa", 70, 470, 24),
         write("copper:   1.2 × 10^{11} Pa", 70, 510, 24),
         write("rubber:   about 10^{6} Pa", 70, 550, 24, "pink"),
         box(600, 448, 480, 20, "white", 2.4), box(600, 488, 288, 20, "white", 2.4), line(600, 538, 603, 538, "pink", 3.0),
         write("(too small to see!)", 620, 548, 20, "pink"),
         pause=0.9),

    # ── 4. A steel wire, worked through ───────────────────────────────
    step("A steel wire, two metres long, with a cross-sectional area of one times ten to the minus six square metres, stretches by one millimetre "
         "under a load of one hundred newtons. Find the stress, the strain, and Young's modulus.",
         clear(2.2),
         heading("A steel wire,  worked through"),
         write("2.0 m long,   A = 1.0 × 10^{-6} m^2,   100 N:   e = 1.0 mm", 70, 190, 24),
         chapter="Worked example: Young's modulus"),

    step("The stress is one hundred over one times ten to the minus six: one times ten to the eight pascals. "
         "For the strain, change the millimetre into metres first: one times ten to the minus three, over two. Five times ten to the minus four.",
         equation(["stress =", ("100", "1.0 × 10^{-6}"), "= 1.0 × 10^{8} Pa"], 70, 280, 26),
         equation(["strain =", ("1.0 × 10^{-3}", "2.0"), "= 5.0 × 10^{-4}"], 70, 380, 26)),

    step("So Young's modulus is one times ten to the eight, over five times ten to the minus four: two times ten to the eleven pascals. That is steel, exactly as it should be.",
         equation(["E =", ("1.0 × 10^{8}", "5.0 × 10^{-4}"), "= 2.0 × 10^{11} Pa"], 70, 480, 26, "green"),
         write("mm to m first:   1.0 mm = 1.0 × 10^{-3} m", 70, 580, 22, "pink")),

    # ── 5. The diameter trap ──────────────────────────────────────────
    step("Questions often give the diameter of the wire, not its area. Then the area is pi r squared. A wire half a millimetre across has a radius of "
         "zero point two five times ten to the minus three metres, so its area is about one point nine six times ten to the minus seven square metres.",
         clear(2.2),
         heading("The diameter trap"),
         write("given a diameter?    A = πr^2", 70, 190, 24, "yellow"),
         write("d = 0.5 mm:   r = 0.25 × 10^{-3} m", 70, 240, 24),
         write("A = π × (0.25 × 10^{-3})^2 = 1.96 × 10^{-7} m^2", 70, 290, 24),
         ellipse(950, 280, 30, 30, "white", 2.8), double_arrow(920, 280, 980, 280, "grey", 2.0), write("d", 950, 336, 20, "grey", "center"),
         chapter="From diameter to area"),

    step("Think fast. Double the diameter of a wire. What happens to its area?",
         ellipse(1110, 280, 60, 60, "white", 2.8), double_arrow(1050, 280, 1170, 280, "grey", 2.0), write("2d", 1110, 370, 20, "grey", "center"),
         write("Think fast:  double the diameter.   The area?", 70, 380, 24, "blue"),
         pause=2.2),

    step("Four times. The area goes with the square of the diameter. And a wire with four times the area, under the same load, has a quarter of the stress.",
         write("four times:  the area goes as d^2", 70, 430, 24, "green"),
         write("same load:  a quarter of the stress", 70, 470, 22, "grey")),

    # ── 6. Springs in series and in parallel ──────────────────────────
    step("Now, springs. Hang one spring below another: that is in series. Each spring carries the full load, so each stretches its full amount. "
         "The extensions add up, and the pair is softer than either one.",
         clear(2.2),
         heading("Springs in series and in parallel"),
         line(780, 180, 1230, 180, "grey", 3.0),
         spring(860, 180, 290), line(860, 290, 860, 300, "white", 2.4), spring(860, 300, 410), box(840, 410, 40, 34, "pink", 2.8),
         write("series", 860, 490, 22, "white", "center"),
         write("series:  each spring carries the FULL load,", 70, 190, 23),
         write("so the extensions add up", 70, 226, 23),
         equation([("1", "k"), "=", ("1", "k_1"), "+", ("1", "k_2")], 70, 300, 26, "yellow"),
         chapter="Springs in series and in parallel"),

    step("Hang them side by side, joined at the bottom: in parallel. Now the springs share the load, so each one stretches less. "
         "The spring constants simply add, and the pair is stiffer.",
         spring(1050, 180, 300), spring(1150, 180, 300), line(1040, 300, 1160, 300, "white", 3.0),
         line(1100, 300, 1100, 316, "white", 2.4), box(1080, 316, 40, 34, "pink", 2.8),
         write("parallel", 1100, 490, 22, "white", "center"),
         write("parallel:  the springs SHARE the load", 70, 400, 23),
         write("k = k_1 + k_2", 70, 444, 26, "yellow"),
         write("two identical springs:   series  k ÷ 2,   parallel  2k", 70, 520, 22, "green")),

    step("Over to you. Two identical springs each stretch four centimetres under eight newtons. Hang eight newtons from the two of them in series. "
         "Then from the two side by side. How far does it stretch each time? Take your time, I am not going anywhere.",
         clear(2.2),
         heading("Over to you"),
         *pause_sign(1180, 82),
         write("identical springs:  each stretches 4 cm under 8 N.", 70, 190, 24, "blue"),
         write("8 N on the pair:  (a) in series?   (b) side by side?", 70, 228, 24, "blue"),
         pause=3.2, chapter="Your turn: two springs"),

    step("In series, each spring carries the whole eight newtons, so each stretches four centimetres: eight in all. "
         "Side by side, each carries only four newtons, so each stretches two centimetres, and the load drops just two.",
         write("(a)  each carries 8 N:   4 + 4 = 8 cm", 70, 300, 25, "green"),
         write("(b)  each carries 4 N:   2 cm", 70, 345, 25, "green")),

    # ── 7. Ductile, brittle, rubbery ──────────────────────────────────
    step("Last, how materials break. A ductile material, like copper, stretches a long way before it breaks, and can be drawn out into thin wires. "
         "That is why the wiring in your house is copper.",
         clear(2.2),
         heading("Ductile,  brittle,  rubbery"),
         arrow(760, 560, 1210, 560, "white", 3.0), arrow(760, 560, 760, 220, "white", 3.0),
         write("extension", 1210, 594, 20, "grey", "right"), write("load", 774, 234, 20, "grey"),
         curve([(760, 560), (810, 440), (840, 400), (930, 372), (1060, 362), (1170, 368)], "yellow", 3.2), *cross(1170, 368, "yellow"),
         write("ductile  (copper)", 1170, 346, 20, "yellow", "right"),
         write("ductile:  stretches a lot before it breaks;", 70, 190, 23, "yellow"),
         write("drawn into wires   (copper,  gold)", 70, 226, 23, "yellow"),
         chapter="Ductile, brittle and elastic materials"),

    step("A brittle material snaps with almost no stretch at all: glass, cast iron, chalk. Hit a glass louvre and it shatters instead of bending. "
         "And chalk is brittle too, as every teacher who has ever dropped a stick of it knows.",
         line(760, 560, 860, 300, "pink", 3.2), *cross(860, 300, "pink"), write("brittle  (glass)", 872, 296, 20, "pink"),
         write("brittle:  snaps with almost no stretch", 70, 290, 23, "pink"),
         write("(glass,  cast iron,  chalk)", 70, 326, 23, "pink"),
         pause=0.9),

    step("And rubber is the champion of stretch: a huge extension, and it still springs back. That is why a catapult uses rubber: it stores a lot of energy over a long pull.",
         curve([(760, 560), (900, 528), (1020, 500), (1110, 460), (1170, 380)], "green", 3.2), write("rubber", 1160, 440, 20, "green", "right"),
         write("rubber:  a huge stretch,  springs back", 70, 390, 23, "green"),
         write("(the catapult)", 70, 426, 23, "green")),

    step("That completes elasticity. Next topic: why a needle can float on water, and how a paper towel drinks up a spill. Surface tension.",
         write("Coming up:  surface tension", 70, 520, 24, "blue"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Young's Modulus", 54, 140, 80, "yellow"),
    write("stress  ·  strain  ·  springs in series and parallel", 60, 210, 30),
    equation(["E =", ("F l_0", "A e")], 90, 420, 60, "yellow"),
    line(700, 300, 1200, 300, "grey", 3.4),
    zigzag(800, 300, 800, 410, n=8, amp=16, width=3.0), zigzag(800, 418, 800, 528, n=8, amp=16, width=3.0), box(775, 528, 50, 44, "pink", 3.2),
    zigzag(1020, 300, 1020, 430, n=8, amp=16, width=3.0), zigzag(1120, 300, 1120, 430, n=8, amp=16, width=3.0),
    line(1005, 430, 1135, 430, "white", 3.4), box(1045, 446, 50, 44, "pink", 3.2), line(1070, 430, 1070, 446, "white", 3.0),
]
