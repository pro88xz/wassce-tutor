"""Physics · Equilibrium of forces: equilibrium on inclined planes. A chalkboard video lesson.

Follows content/notes/physics-equilibrium-2.md: opens by busting a myth (the
part of the weight down a slope is not mg cos θ) and proving it in five seconds
with a flat slope; the forces on a slope resolved along and across it; "grab a
pen" with a box on a tilted plank; a block held by a horizontal push; "a sneaky
one" (steady speed needs no more force than holding still); and verifying the
parallelogram law with pulleys, with its precautions.

Check: python3 scripts/video/board_video.py content/videos/physics-equilibrium-2.py --boards .video-build/boards/equil2
"""

from board_video import arrow, box, clear, dashed, ellipse, heading, line, step, write

TITLE = "Equilibrium on Inclined Planes: mg sin θ, Friction, Normal Reaction and the Parallelogram Law | WASSCE Physics"
DESCRIPTION = ("Slopes on the chalkboard: why the pull down a slope is mg sin θ (proved in five seconds), friction and the "
               "normal reaction on a rough plank, a horizontal push, why steady speed needs no extra force, and verifying "
               "the parallelogram law of forces.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Equilibrium"
# The lesson page this video is on: /wassce/physics/equilibrium-of-forces/equilibrium-on-inclined-planes
LESSON = "physics/equilibrium-of-forces/equilibrium-on-inclined-planes"


def stop_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


# A 30° slope: along it U (uphill), out of it N.
U, N = (0.866, -0.5), (-0.5, -0.866)


def go(p, d, vec):
    return (p[0] + d * vec[0], p[1] + d * vec[1])


def slope(x0, y0, run, color="white"):
    """A 30° slope rising to the right from (x0, y0)."""
    return [line(x0, y0, x0 + run, y0, color, 3.0), line(x0 + run, y0, x0 + run, y0 - run * 0.577, color, 3.0),
            line(x0, y0, x0 + run, y0 - run * 0.577, color, 3.0), write("30°", x0 + 70, y0 - 12, 20, "grey")]


def block(c, w=80, h=50, color="yellow"):
    """A block sitting on the slope, its base centred at c; returns the strokes and its centre."""
    a, b = go(c, -w / 2, U), go(c, w / 2, U)
    cc, d = go(b, h, N), go(a, h, N)
    return [line(*a, *b, color, 3.0), line(*b, *cc, color, 3.0), line(*cc, *d, color, 3.0), line(*d, *a, color, 3.0)], go(c, h / 2, N)


S1_BLOCK, S1_M = block((1000, 380 - 240 * 0.577))
S3_BLOCK, S3_M = block((960, 410))

STEPS = [
    # ── 1. Sine or cos? ───────────────────────────────────────────────
    step("Here is a belief that costs students marks every year: the part of the weight pulling a block down a slope is m g cos theta. "
         "It is not. And in a minute, you will be able to prove it in five seconds.",
         heading("Sine or cos?"),
         write("down the slope:  mg cos θ ?", 70, 200, 30),
         line(60, 190, 660, 190, "pink", 3.4),
         pause=0.6, chapter="Down the slope: sine or cos?"),

    step("Resolve along the slope, and across it. The weight splits into two parts: m g sine theta down the slope, "
         "and m g cos theta into the slope.",
         *slope(760, 380, 460), *S1_BLOCK,
         arrow(*S1_M, S1_M[0], S1_M[1] + 110, "pink"), write("mg", S1_M[0] - 10, S1_M[1] + 104, 22, "pink", "right"),
         arrow(*S1_M, *go(S1_M, -110, U), "blue"), write("mg sin θ", go(S1_M, -120, U)[0] - 10, go(S1_M, -120, U)[1] + 10, 20, "blue", "right"),
         arrow(*S1_M, *go(S1_M, -70, N), "green"), write("mg cos θ", go(S1_M, -78, N)[0] + 12, go(S1_M, -78, N)[1] + 16, 20, "green"),
         write("down the slope:  mg sin θ", 70, 260, 28, "blue"),
         write("into the slope:  mg cos θ", 70, 305, 28, "green")),

    step("The five-second proof: lay the slope flat. Theta is zero. On a flat floor, nothing pulls the block along, and sine zero is zero. "
         "Cos zero is one: the whole weight, sliding a box across a flat floor. Nonsense.",
         write("lay it flat:  θ = 0", 70, 380, 26, "yellow"),
         write("sin 0° = 0:  nothing pulls it along.   Correct!", 100, 420, 23, "green"),
         write("cos 0° = 1:  a box sliding on a flat floor?  No.", 100, 456, 23, "pink")),

    step("So on a rough slope, a box at rest has friction balancing the pull down the slope, and the normal reaction balancing the push into it.",
         write("at rest on a rough slope:   F = mg sin θ,    R = mg cos θ", 70, 530, 23, "yellow")),

    # ── 2. Grab a pen ─────────────────────────────────────────────────
    step("Grab a pen, this one is yours. A five kilogram box rests on a plank tilted at twenty-five degrees. "
         "Find the friction on it, and the normal reaction.",
         clear(2.2),
         heading("Grab a pen"),
         *stop_sign(1180, 82),
         write("A 5 kg box rests on a plank at 25°.", 70, 190, 26),
         write("Find the friction and the normal reaction.  (g = 10)", 70, 230, 24, "blue"),
         chapter="A box on a tilted plank"),

    step("Stop the video, and come back when you have two numbers.",
         write("two numbers", 1130, 92, 22, "pink", "right"),
         pause=3.3),

    step("The weight is fifty newtons. Friction is fifty sine twenty-five: twenty-one point one newtons. "
         "The normal reaction is fifty cos twenty-five: forty-five point three.",
         write("mg = 50 N", 70, 310, 26),
         write("F = 50 sin 25° = 21.1 N", 70, 355, 26, "green"),
         write("R = 50 cos 25° = 45.3 N", 70, 400, 26, "green")),

    step("Tilt the plank further, and the friction needed keeps growing, until it is more than the surface can give. Then the box slides. "
         "Everything on the back of a lorry is perfectly fine, right up until the steep hill.",
         write("steeper:  more friction needed ... until it slides", 70, 480, 23, "pink"),
         pause=1.0),

    # ── 3. A horizontal push ──────────────────────────────────────────
    step("A twist. A forty newton block on a smooth thirty degree slope is held still by a horizontal force, P. "
         "The push is not along the slope, so it has to be resolved too.",
         clear(2.2),
         heading("A horizontal push"),
         *slope(700, 560, 480), *S3_BLOCK,
         arrow(S3_M[0] - 130, S3_M[1], S3_M[0] - 8, S3_M[1], "green"), write("P", S3_M[0] - 140, S3_M[1] + 8, 24, "green", "right"),
         arrow(*S3_M, S3_M[0], S3_M[1] + 120, "pink"), write("40 N", S3_M[0] + 10, S3_M[1] + 112, 22, "pink"),
         write("40 N block, smooth 30° slope,  P horizontal", 70, 190, 24),
         chapter="Holding a block with a horizontal force"),

    step("Along the slope: P cos thirty, up the slope, balances forty sine thirty, down it. So P is forty tan thirty: twenty-three point one newtons.",
         write("along:  P cos 30° = 40 sin 30°,    P = 40 tan 30° = 23.1 N", 70, 250, 22, "green")),

    step("Across the slope, the weight and the push both press the block in. So R is forty cos thirty, plus P sine thirty: "
         "forty-six point two newtons. More than the weight's part alone, because the push helps press it in.",
         write("across:  R = 40 cos 30° + P sin 30° = 34.6 + 11.5 = 46.2 N", 70, 295, 22, "blue")),

    # ── 4. A sneaky one ───────────────────────────────────────────────
    step("A two hundred newton drum sits on a smooth ramp at twenty degrees, on a rope parallel to the ramp. "
         "To hold it still, the tension is two hundred sine twenty: sixty-eight point four newtons.",
         clear(2.2),
         heading("A sneaky one"),
         write("200 N drum, smooth 20° ramp, rope along the ramp", 70, 190, 24),
         write("hold it still:  T = 200 sin 20° = 68.4 N", 70, 240, 26, "green"),
         chapter="Steady speed is equilibrium"),

    step("Now, here is a sneaky one. To pull it up the ramp at a steady speed, do you need more than sixty-eight point four?",
         write("Pull it up at a steady speed:  more than 68.4 N?", 70, 320, 25, "pink"),
         pause=2.3),

    step("No. Exactly the same. Steady speed means no acceleration, and no acceleration means equilibrium. "
         "You only need more to speed it up.",
         write("No!  Steady speed = no acceleration = equilibrium.", 70, 370, 25, "green"),
         write("T = 68.4 N again.  More only to speed it up.", 70, 412, 25, "green")),

    # ── 5. The practical ──────────────────────────────────────────────
    step("The practical paper loves this one: checking the parallelogram law. A board stands upright, with a pulley at each top corner. "
         "Three strings are tied to a small ring: two go over the pulleys to hanging masses, and the third hangs straight down.",
         clear(2.2),
         heading("The parallelogram law"),
         box(760, 150, 440, 400, "grey", 2.4),
         ellipse(790, 175, 14, 14, "white", 2.6), ellipse(1170, 175, 14, 14, "white", 2.6),
         ellipse(960, 340, 8, 8, "yellow", 2.6),
         line(955, 334, 790, 161, "white", 2.2), line(966, 334, 1170, 161, "white", 2.2),
         line(776, 175, 776, 300, "white", 2.2), box(762, 300, 28, 30, "blue", 2.6), write("P", 776, 366, 20, "blue", "center"),
         line(1184, 175, 1184, 270, "white", 2.2), box(1170, 270, 28, 30, "blue", 2.6), write("Q", 1184, 336, 20, "blue", "center"),
         line(960, 348, 960, 450, "white", 2.2), box(946, 450, 28, 30, "pink", 2.6), write("W", 960, 502, 20, "pink", "center"),
         chapter="Verifying the parallelogram law"),

    step("When the ring is still, mark the three string directions. Draw the two upper weights to scale along their strings, "
         "and complete the parallelogram.",
         write("1. ring still: mark the three strings", 70, 200, 23),
         write("2. draw P and Q to scale along them", 70, 240, 23),
         write("3. complete the parallelogram", 70, 280, 23)),

    step("The diagonal should equal the third weight, and point straight up, opposite to it. If it does, the law holds.",
         write("diagonal = W, pointing straight up", 70, 340, 25, "green")),

    step("And for precaution marks: tap the board so the pulleys settle, keep the ring off the board, "
         "and mark each string with two dots, far apart.",
         write("precautions:  tap the board;  ring off the board;", 70, 420, 22, "pink"),
         write("two dots, far apart, for each string", 70, 454, 22, "pink")),

    step("And with that, equilibrium is done. Next, moments: the physics behind long spanners, see-saws, "
         "and why you should never sit on a see-saw alone.",
         write("Coming up:  moments  (and see-saws)", 70, 540, 24, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Slopes", 54, 140, 84, "yellow"),
    write("mg sin θ  ·  Friction  ·  Normal reaction", 60, 210, 30),
    *slope(640, 600, 560),
    *block((920, 438), 100, 64)[0],
    arrow(*block((920, 438), 100, 64)[1], block((920, 438), 100, 64)[1][0], block((920, 438), 100, 64)[1][1] + 140, "pink"),
    write("sin, not cos!", 70, 420, 54, "pink"),
]
