"""Physics · Scalars and vectors: resultant of several forces, equilibrant and relative velocity. A chalkboard video lesson.

Follows content/notes/physics-vectors-2.md: the resultant of several forces by
components (the three-force example), the equilibrant, relative velocity on a
road, crossing a river pointed straight across and landing directly opposite
(with the Tagrin fishermen), and the rain falling on a cyclist.
Check: python3 scripts/video/board_video.py content/videos/physics-vectors-2.py --boards .video-build/boards/vectors2
"""

import math

from board_video import arrow, clear, dashed, double_arrow, equation, heading, line, step, write

TITLE = "Resultant of Forces by Components, Equilibrant and Relative Velocity | WASSCE Physics"
DESCRIPTION = ("Vectors on the chalkboard: the resultant of several forces by components, the equilibrant, relative "
               "velocity of two cars, crossing a river (time, drift and landing directly opposite) and rain on a "
               "cyclist, with WASSCE worked examples.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Scalars and vectors"
# The lesson page this video is on: /wassce/physics/scalars-and-vectors/resultant-of-several-forces-equilibrant-and-relative-velocity
LESSON = "physics/scalars-and-vectors/resultant-of-several-forces-equilibrant-and-relative-velocity"


def polar(x, y, length, deg):
    t = math.radians(deg)
    return x + length * math.cos(t), y - length * math.sin(t)


def forces(cx, cy, k=16.0, width=3.4):
    """The three forces of the example on a point: 10 N east, 8 N north, 6 N at 30° north of west."""
    return [arrow(cx, cy, *polar(cx, cy, 10 * k, 0), "white", width), write("10 N", cx + 5 * k, cy + 34, 22),
            arrow(cx, cy, *polar(cx, cy, 8 * k, 90), "white", width), write("8 N", cx + 12, cy - 6 * k, 22),
            arrow(cx, cy, *polar(cx, cy, 6 * k, 150), "yellow", width), write("6 N", cx - 6 * k - 28, cy - 3 * k - 20, 22, "yellow"),
            write("30°", cx - 70, cy - 8, 18, "grey")]


def banks(x0, x1, near, far):
    return [line(x0, near, x1, near, "green", 3.6), line(x0, far, x1, far, "green", 3.6)]


ROW = (70, 262, 600)   # force, x part, y part

STEPS = [
    # ── 1. The method ──────────────────────────────────────────────────
    step("When several forces act at once, drawing is slow. Components turn the problem into simple adding. "
         "First, resolve every force into a horizontal x part and a vertical y part, taking right and up as positive.",
         heading("Resultant of several forces"),
         write("1.  Resolve each force into x and y parts", 70, 190, 27),
         write("(right and up are positive)", 112, 228, 22, "grey"),
         chapter="Resultant of several forces by components"),

    step("Second, add all the x parts together, and add all the y parts together.",
         write("2.  Add them:  ΣF_x  and  ΣF_y", 70, 300, 27)),

    step("Third, combine the two sums. R is the square root of the x sum squared plus the y sum squared, "
         "and tan alpha is the y sum over the x sum.",
         equation(["3.  R =", {"root": "(ΣF_x)^2 + (ΣF_y)^2"}], 70, 400, 27),
         equation(["tan α =", ("ΣF_y", "ΣF_x")], 112, 520, 27)),

    # ── 2. The three forces ────────────────────────────────────────────
    step("Example. Three forces act on a point: ten newtons due east, eight newtons due north, and six newtons at thirty degrees north of west. Find the resultant.",
         clear(2.2),
         heading("Example: three forces"),
         write("10 N east,  8 N north,  6 N at 30° north of west", 70, 170, 25, "yellow"),
         *forces(1090, 450, 14),
         chapter="Worked example: three forces, and the equilibrant"),

    step("Resolve each one. Ten east gives plus ten horizontally, and nothing vertically. Eight north gives plus eight vertically. "
         "The six newton force points back to the west, so its horizontal part is minus six cos thirty, minus five point two, and its vertical part is plus six sine thirty, plus three.",
         *[write(c, x, 232, 21, "grey") for c, x in zip(["force", "x part (east +)", "y part (north +)"], ROW)],
         line(60, 246, 940, 246, "grey", 2.2),
         *[write(c, x, 286, 22, col) for c, x, col in zip(["10 N east", "+10", "0"], ROW, ("yellow", "white", "white"))],
         *[write(c, x, 326, 22, col) for c, x, col in zip(["8 N north", "0", "+8"], ROW, ("yellow", "white", "white"))],
         *[write(c, x, 366, 22, col) for c, x, col in zip(["6 N", "-6 cos 30° = -5.20", "+6 sin 30° = +3.00"], ROW, ("yellow", "white", "white"))]),

    step("Now add each column: four point eight zero in x, and eleven point zero zero in y.",
         line(60, 386, 940, 386, "grey", 2.2),
         *[write(c, x, 424, 26, "blue") for c, x in zip(["sums", "ΣF_x = 4.80", "ΣF_y = 11.00"], ROW)]),

    step("Combine them. R is the square root of four point eight squared plus eleven squared, "
         "the square root of one hundred and forty-four point zero four, which is twelve point zero newtons.",
         equation(["R =", {"root": "4.80^2 + 11.00^2"}, "=", {"root": "144.04"}, "= 12.0 N"], 70, 520, 27, "yellow")),

    step("And tan alpha is eleven over four point eight, two point two nine, so alpha is sixty-six point four degrees north of east.",
         equation(["tan α =", ("11.00", "4.80"), "= 2.29,  α = 66.4° N of E"], 70, 625, 27, "yellow")),

    step("The equilibrant is the single force that, added to the others, puts them in equilibrium. "
         "It is equal in size to the resultant, but opposite in direction. So here, it is twelve point zero newtons at sixty-six point four degrees south of west.",
         clear(2.2),
         heading("The equilibrant"),
         write("Equilibrant:  equal to the resultant,", 70, 200, 28, "pink"),
         write("but in the opposite direction.", 70, 242, 28, "pink"),
         arrow(900, 430, *polar(900, 430, 170, 66.4), "green", 4.2), write("R = 12.0 N", 990, 300, 24, "green"),
         arrow(900, 430, *polar(900, 430, 170, 246.4), "pink", 4.2), write("equilibrant", 640, 560, 24, "pink"),
         dashed(760, 430, 1060, 430, "grey", 2.4),
         write("Here:  12.0 N at 66.4° south of west", 70, 360, 28, "yellow")),

    # ── 3. Relative velocity ───────────────────────────────────────────
    step("The velocity of A relative to B is the velocity that A seems to have to someone moving with B. It is the velocity of A minus the velocity of B.",
         clear(2.2),
         heading("Relative velocity"),
         write("v_{AB} = v_A - v_B", 70, 205, 40, "yellow"),
         write("(A as seen from B)", 470, 205, 24, "grey"),
         chapter="Relative velocity: two cars on a road"),

    step("Two cars go the same way, at twenty-five and twenty metres per second. Seen from the slower car, the faster one creeps ahead at only five metres per second. "
         "That is why overtaking takes so long.",
         arrow(90, 320, 465, 320, "white"), write("25 m/s", 220, 306, 22),
         arrow(90, 370, 390, 370, "blue"), write("20 m/s", 180, 356, 22, "blue"),
         write("same way:  25 - 20 = 5 m/s", 560, 352, 25, "green")),

    step("Going towards each other, each sees the other coming at twenty-five plus twenty: forty-five metres per second. That is why a head-on crash is so violent.",
         arrow(90, 470, 465, 470, "white"), write("25 m/s", 220, 456, 22),
         arrow(465, 520, 165, 520, "blue"), write("20 m/s", 270, 556, 22, "blue"),
         write("towards:  25 + 20 = 45 m/s", 560, 502, 25, "pink")),

    # ── 4. Crossing a river ────────────────────────────────────────────
    step("A canoe moves at four metres per second in still water. It is pointed straight across a river eighty metres wide, which flows at three metres per second. "
         "Find its velocity, the time to cross, and how far downstream it lands.",
         clear(2.2),
         heading("Crossing a river"),
         *banks(70, 620, 600, 280),
         double_arrow(100, 288, 100, 592, "grey"), write("80 m", 112, 360, 22, "grey"),
         arrow(140, 572, 250, 572, "blue"), write("current", 140, 530, 20, "blue"), write("3 m/s", 140, 556, 20, "blue"),
         write("canoe:  4 m/s across", 680, 190, 24, "yellow"),
         write("current:  3 m/s", 680, 226, 24, "yellow"),
         write("width:  80 m", 680, 262, 24, "yellow"),
         chapter="Crossing a river: velocity, time and drift"),

    step("The two velocities are at right angles. So its velocity is the square root of sixteen plus nine: five metres per second, at thirty-six point nine degrees downstream.",
         arrow(300, 600, 300, 440, "white"), write("4", 276, 520, 22),
         arrow(300, 440, 420, 440, "blue"), write("3", 356, 428, 22, "blue"),
         arrow(300, 600, 420, 440, "green", 4.2), write("5", 372, 540, 22, "green"),
         dashed(420, 440, 540, 280, "green", 2.6),
         equation(["v =", {"root": "4^2 + 3^2"}, "= 5 m/s"], 680, 350, 27),
         equation(["tan θ =", ("3", "4"), ",  θ = 36.9°"], 680, 450, 27)),

    step("Only the four metres per second across carries it to the far bank, so the time is eighty over four: twenty seconds.",
         equation(["t =", ("80", "4"), "= 20 s"], 680, 550, 27, "blue")),

    step("Meanwhile, the current carries it downstream: three times twenty, which is sixty metres.",
         write("downstream:  3 × 20 = 60 m", 680, 632, 26, "pink"),
         write("lands here", 470, 264, 20, "pink")),

    # ── 5. Landing opposite ────────────────────────────────────────────
    step("To land directly opposite, she must point upstream, at an angle phi, so that the upstream part of her velocity cancels the current. "
         "Four sine phi equals three, so sine phi is zero point seven five, and phi is forty-eight point six degrees.",
         clear(2.2),
         heading("Landing directly opposite"),
         *banks(70, 560, 600, 280),
         arrow(420, 600, 300, 494, "white"), write("4", 330, 570, 22),
         arrow(300, 494, 420, 494, "blue"), write("3", 352, 482, 22, "blue"),
         arrow(420, 600, 420, 494, "green", 4.2), dashed(420, 494, 420, 280, "green", 2.6),
         write("lands opposite", 340, 264, 20, "pink"),
         write("φ", 392, 560, 22, "grey"),
         write("4 sin φ = 3", 600, 200, 30),
         write("sin φ = 0.75,  φ = 48.6° upstream", 600, 250, 27),
         chapter="Landing directly opposite"),

    step("Her speed straight across is then the square root of sixteen minus nine, the square root of seven: about two point six five metres per second. "
         "So crossing takes eighty over two point six five: thirty point two seconds. Landing opposite takes longer.",
         equation(["across:", {"root": "4^2 - 3^2"}, "=", {"root": "7"}, "= 2.65 m/s"], 575, 350, 25),
         equation(["t =", ("80", "2.65"), "= 30.2 s"], 600, 460, 27, "blue"),
         write("(longer than 20 s)", 600, 532, 22, "grey")),

    step("Fishermen crossing the Sierra Leone River estuary at Tagrin know this well. They aim upstream of where they want to land, because the tide carries them sideways.",
         write("Tagrin fishermen aim upstream of where they land.", 70, 645, 24, "green")),

    # ── 6. Rain and a cyclist ──────────────────────────────────────────
    step("Last, rain falls straight down at six metres per second, and a cyclist rides at eight metres per second. At what angle should she tilt her umbrella?",
         clear(2.2),
         heading("Rain and a cyclist"),
         write("Rain:  6 m/s down.   Cyclist:  8 m/s forwards.", 70, 175, 26, "yellow"),
         chapter="Rain and a moving cyclist"),

    step("Relative to her, the rain comes down at six, and towards her face at eight. So tan theta is eight over six, and theta is fifty-three point one degrees. "
         "She tilts the umbrella forwards, at fifty-three point one degrees to the vertical.",
         arrow(1060, 250, 1060, 430, "blue"), write("6", 1076, 350, 22, "blue"),
         arrow(1060, 430, 820, 430, "pink"), write("8", 930, 468, 22, "pink"),
         arrow(1060, 250, 820, 430, "green", 4.2), write("rain, as she sees it", 760, 236, 20, "green"),
         write("θ", 1040, 312, 22, "grey"),
         equation(["tan θ =", ("8", "6"), ",  θ = 53.1°"], 70, 300, 30),
         write("tilt it forwards, 53.1° to the vertical", 70, 400, 26, "green")),

    step("And the rain seems to hit her at the square root of thirty-six plus sixty-four: ten metres per second.",
         equation(["it seems to come at", {"root": "6^2 + 8^2"}, "= 10 m/s"], 70, 510, 26)),

    step("In the exam, draw a clear vector diagram first, label every velocity, and give each direction with its reference line.",
         write("Exam:  draw the diagram, label it, give each direction.", 70, 626, 25, "pink"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("River Crossing", 54, 150, 84, "yellow"),
    write("Resultant  ·  Equilibrant  ·  Relative velocity", 60, 214, 30),
    line(60, 620, 600, 620, "green", 6.0), line(60, 300, 600, 300, "green", 6.0),
    arrow(260, 620, 260, 440, "white", 6.0), arrow(260, 440, 395, 440, "blue", 6.0), arrow(260, 620, 395, 440, "green", 7.0),
    dashed(395, 440, 515, 300, "green", 4.0),
    write("4 m/s", 128, 540, 30), write("3 m/s", 268, 420, 30, "blue"),
    equation(["v =", {"root": "4^2 + 3^2"}], 680, 400, 46, "yellow"),
    write("= 5 m/s", 760, 480, 46, "yellow"),
    write("t = 80 ÷ 4 = 20 s", 680, 580, 40, "blue"),
]
