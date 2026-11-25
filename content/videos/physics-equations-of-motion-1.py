"""Physics · Equations of motion: the equations of uniformly accelerated motion. A chalkboard video lesson.

Follows content/notes/physics-equations-of-motion-1.md: a taxi, a child 40 m
ahead, and the question "will it stop in time?" held to the end; the five
quantities and when the equations apply; the four equations derived from one
velocity-time graph (the chalk shades the area as it is explained); choosing
the equation by the quantity it leaves out, and the code words; a braking
problem solved together; a "your turn" okada; and the taxi answered, with
thinking and braking distances.

"{a}" in a line is the letter A said as a letter (see board_video.shown).
Check: python3 scripts/video/board_video.py content/videos/physics-equations-of-motion-1.py --boards .video-build/boards/eqm1
"""

from board_video import arrow, box, clear, dashed, double_arrow, ellipse, equation, heading, line, step, write

TITLE = "Equations of Motion: v = u + at, s = ut + ½at², v² = u² + 2as, Derived and Used | WASSCE Physics"
DESCRIPTION = ("The equations of uniformly accelerated motion on the chalkboard: what u, v, a, s and t mean, deriving "
               "all four from a velocity-time graph, choosing the right one, a braking problem, one to try yourself, "
               "and stopping distances.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Equations of motion"
# The lesson page this video is on: /wassce/physics/equations-of-motion/the-equations-of-uniformly-accelerated-motion
LESSON = "physics/equations-of-motion/the-equations-of-uniformly-accelerated-motion"


def taxi(x, y):
    """A taxi seen from the side, its bottom at y."""
    return [box(x, y - 60, 150, 42, "yellow", 3.0), line(x + 30, y - 60, x + 50, y - 88, "yellow", 3.0),
            line(x + 50, y - 88, x + 110, y - 88, "yellow", 3.0), line(x + 110, y - 88, x + 130, y - 60, "yellow", 3.0),
            ellipse(x + 35, y - 12, 13, 13, "white", 3.0), ellipse(x + 118, y - 12, 13, 13, "white", 3.0)]


def child(x, y):
    """A child standing on the road, feet at y."""
    return [ellipse(x, y - 78, 11, 11, "pink", 3.0), line(x, y - 66, x, y - 32, "pink", 3.0),
            line(x, y - 32, x - 12, y, "pink", 3.0), line(x, y - 32, x + 12, y, "pink", 3.0),
            line(x - 15, y - 54, x + 15, y - 54, "pink", 3.0)]


def axes(x0, y0, w, h, xl, yl):
    return [arrow(x0, y0, x0 + w, y0, "white", 3.0), arrow(x0, y0, x0, y0 - h, "white", 3.0),
            write(xl, x0 + w, y0 + 34, 20, "grey", "right"), write(yl, x0 + 14, y0 - h + 14, 20, "grey")]


def boxed(text, x, y, size=30, color="yellow", w=None):
    """An equation to learn, written and boxed."""
    from board_video import text_width
    w = w or text_width(text, size) + 36
    return [write(text, x + 18, y, size, color), box(x, y - size - 6, w, size + 26, color, 2.6)]


def pause_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


# the velocity-time graph: u at y 460, v at y 220, over t (x 110 to 530)
GX, GY, GU, GV, GT = 110, 560, 460, 220, 530


def at_x(x):
    return GU - (x - GX) * (GU - GV) / (GT - GX)


STEPS = [
    # ── 1. Will the taxi stop? ────────────────────────────────────────
    step("A taxi is doing fifteen metres per second along Wilkinson Road. Forty metres ahead, a child steps onto the road. "
         "Will the taxi stop in time?",
         heading("Will the taxi stop in time?"),
         line(70, 330, 1210, 330, "grey", 2.4),
         *taxi(120, 330), arrow(150, 228, 270, 228, "yellow"), write("15 m s^{-1}", 210, 212, 22, "yellow", "center"),
         *child(1040, 330),
         double_arrow(270, 372, 1040, 372, "white", 2.6), write("40 m", 655, 405, 24, "white", "center"),
         pause=1.5, chapter="Will the taxi stop in time?"),

    step("Hold that question. By the end of this lesson, you will answer it yourself, with four short equations.",
         write("Hold that question...", 70, 500, 28, "grey")),

    # ── 2. The five quantities ────────────────────────────────────────
    step("Every problem in this lesson uses five quantities. u is the starting velocity, and v is the final velocity. "
         "{a} is the acceleration, t is the time, and s is the displacement.",
         clear(2.2),
         heading("The five quantities"),
         *[w for i, (sym, name, unit) in enumerate([("u", "initial velocity", "m s^{-1}"), ("v", "final velocity", "m s^{-1}"),
                                                    ("a", "acceleration", "m s^{-2}"), ("t", "time", "s"), ("s", "displacement", "m")])
           for w in (write(sym, 110, 195 + 48 * i, 32, "yellow", "center"), write(name, 200, 195 + 48 * i, 26),
                     write(unit, 560, 195 + 48 * i, 26, "blue"))],
         chapter="The five quantities"),

    step("Think of u as you, before this lesson, and v as you, after it. Much faster.",
         write("u: you before this lesson.   v: you after it!", 70, 470, 24, "pink"),
         pause=1.0),

    step("One rule. These equations work only for motion in a straight line, with constant acceleration. If the acceleration changes, they do not apply.",
         write("only for:  a straight line,  constant acceleration", 70, 550, 27, "green")),

    # ── 3. Four equations from one graph ──────────────────────────────
    step("All four equations come from one velocity-time graph. It starts at u, rises in a straight line, and reaches v after a time t. "
         "The gradient is the acceleration: v minus u, over t. Rearrange it, and you get v equals u plus {a} t.",
         clear(2.2),
         heading("Four equations from one graph"),
         *axes(GX, GY, 520, 380, "t / s", "v / m s^{-1}"),
         line(GX, GU, GT, GV, "white", 3.4),
         dashed(GX, GV, GT, GV), dashed(GT, GV, GT, GY),
         write("u", 94, GU + 8, 24, "yellow", "right"), write("v", 94, GV + 8, 24, "yellow", "right"), write("t", GT, GY + 30, 24, "yellow", "center"),
         equation(["a =", ("v - u", "t")], 680, 200, 28),
         *boxed("v = u + at", 930, 205, 30),
         chapter="Deriving the equations"),

    step("The area under the line is the displacement. It is a trapezium: half the sum of the parallel sides, times the width. "
         "So s equals u plus v, over two, times t.",
         *[line(x, GY - 2, x, at_x(x) + 2, "grey", 1.8) for x in range(GX + 18, GT, 24)],
         equation(["s =", ("u + v", "2"), "t"], 698, 330, 30, "yellow"),
         box(680, 282, 300, 80, "yellow", 2.6)),

    step("Now split the same area into a rectangle, u times t, and a triangle, a half, times t, times {a} t. "
         "Together: s equals u t, plus a half {a} t squared.",
         dashed(GX, GU, GT, GU, "blue"),
         write("ut", 320, 520, 28, "blue", "center"),
         equation([("1", "2"), "× t × at"], 350, 418, 22, "pink"),
         equation(["s = ut +", ("1", "2"), "at^2"], 698, 445, 30, "yellow"),
         box(680, 397, 350, 80, "yellow", 2.6)),

    step("And to get rid of the time, put t equals v minus u, over {a}, into the second equation. Out comes v squared equals u squared, plus two {a} s.",
         *boxed("v^2 = u^2 + 2as", 680, 570, 30)),

    step("Derive is a favourite three or four mark question. Start from the graph, and show every step.",
         write("\"Derive...\" questions: start from the graph", 70, 636, 22, "pink")),

    # ── 4. Choosing the right equation ────────────────────────────────
    step("Here is the secret to choosing. Each equation leaves out one of the five quantities.",
         clear(2.2),
         heading("Which equation?"),
         write("v = u + at", 110, 200, 30, "yellow"), write("no s", 640, 200, 28, "pink"),
         equation(["s =", ("u + v", "2"), "t"], 110, 278, 30, "yellow"), write("no a", 640, 278, 28, "pink"),
         equation(["s = ut +", ("1", "2"), "at^2"], 110, 362, 30, "yellow"), write("no v", 640, 362, 28, "pink"),
         write("v^2 = u^2 + 2as", 110, 440, 30, "yellow"), write("no t", 640, 440, 28, "pink"),
         chapter="Choosing the right equation"),

    step("So list what you know, and what you want. Find the quantity you neither know nor need, and choose the equation without it.",
         write("List what you know and want; drop the one you don't need.", 70, 520, 24, "green")),

    step("And learn the code words. Starts from rest: u is zero. Comes to rest: v is zero. Uniform velocity: {a} is zero. "
         "Physics is the only subject where rest is a number.",
         write("starts from rest:  u = 0", 840, 200, 22, "blue"),
         write("comes to rest:  v = 0", 840, 240, 22, "blue"),
         write("uniform velocity:  a = 0", 840, 280, 22, "blue"),
         pause=1.0),

    # ── 5. Worked example ─────────────────────────────────────────────
    step("Let us try one together. A car at twenty metres per second brakes, and stops in forty metres. "
         "Find the deceleration, and the time it takes to stop.",
         clear(2.2),
         heading("Braking: together"),
         write("A car at 20 m s^{-1} brakes and stops in 40 m.", 70, 190, 26),
         write("Find the deceleration and the time to stop.", 70, 230, 26, "blue"),
         chapter="Worked example: braking"),

    step("First, list what we know. u is twenty. v is zero, because it stops. s is forty. We want {a}, and the time is not given. "
         "So which equation has no t?",
         write("u = 20,   v = 0,   s = 40,   a = ?", 70, 300, 27, "yellow"),
         write("no t in sight...", 760, 300, 24, "pink"),
         pause=1.6),

    step("That is v squared equals u squared, plus two {a} s. Zero equals four hundred, plus eighty {a}. "
         "So {a} is minus five metres per second squared: a deceleration of five.",
         write("v^2 = u^2 + 2as:    0 = 400 + 80a", 70, 380, 27),
         write("a = -5 m s^{-2}   (a deceleration of 5 m s^{-2})", 70, 425, 27, "green")),

    step("Now the time. v equals u plus {a} t. Zero equals twenty, minus five t, so t is four seconds.",
         write("v = u + at:    0 = 20 - 5t,   so  t = 4 s", 70, 505, 27, "green")),

    # ── 6. Your turn ──────────────────────────────────────────────────
    step("Your turn. An okada moving at ten metres per second accelerates at one point five metres per second squared, "
         "over a distance of one hundred metres. Find its final velocity.",
         clear(2.2),
         heading("Your turn"),
         *pause_sign(1180, 82),
         write("An okada at 10 m s^{-1} accelerates at 1.5 m s^{-2}", 70, 190, 26),
         write("over 100 m. Find its final velocity.", 70, 230, 26, "blue"),
         chapter="Your turn"),

    step("Pause the video, and choose your equation first. I will wait.",
         write("pause and try it", 1130, 92, 22, "pink", "right"),
         pause=3.2),

    step("We have u, {a} and s, and no time. So: v squared equals u squared plus two {a} s. "
         "One hundred, plus three hundred, is four hundred. So v is twenty metres per second.",
         write("u = 10,   a = 1.5,   s = 100,   v = ?", 70, 310, 27, "yellow"),
         write("v^2 = 10^2 + 2 × 1.5 × 100 = 100 + 300 = 400", 70, 375, 27),
         write("v = 20 m s^{-1}", 70, 430, 30, "green")),

    step("And if you wrote four hundred metres per second, that okada is faster than a jet. Remember the square root.",
         write("400 m s^{-1}?  Faster than a jet!  Take the square root.", 70, 520, 24, "pink"),
         pause=1.0),

    # ── 7. The taxi, answered ─────────────────────────────────────────
    step("Now, the taxi. The driver needs zero point seven seconds to react, and in that time the taxi does not slow at all. "
         "Fifteen times zero point seven: ten point five metres.",
         clear(2.2),
         heading("Will the taxi stop? The answer"),
         write("thinking distance = 15 × 0.7 = 10.5 m", 70, 195, 27),
         chapter="Stopping distance: the answer"),

    step("Then it brakes at six metres per second squared. The braking distance is u squared over two {a}: "
         "two hundred and twenty-five over twelve, about eighteen point eight metres.",
         equation(["braking distance =", ("u^2", "2a"), "=", ("225", "12"), "= 18.8 m"], 70, 285, 27)),

    step("Total: about twenty-nine metres. The child is forty metres away. The taxi stops, with about eleven metres to spare.",
         write("stopping distance = 10.5 + 18.8 = 29.3 m", 70, 380, 27, "yellow"),
         write("29 m < 40 m:  it stops, 11 m to spare.", 70, 425, 27, "green"),
         pause=0.8),

    step("But at twenty-five metres per second, the stopping distance is about seventy metres. It would not stop. "
         "Double the speed, and the braking distance goes up four times.",
         write("at 25 m s^{-1}:  about 70 m.  It would NOT stop.", 70, 505, 26, "pink"),
         write("double the speed: four times the braking distance", 70, 548, 24, "pink")),

    step("So the next time a driver says, do not worry, I can stop, you can show him the equation.",
         write("\"Don't worry, I can stop.\"   Show him the equation.", 70, 620, 24, "grey"),
         pause=1.0),

    step("Next time: journeys in stages, and chase problems. A police car chases a speeding keke. Who wins? Bring your equations.",
         write("Next:  journeys in stages, and chases", 70, 664, 22, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Equations of Motion", 54, 140, 80, "yellow"),
    write("v = u + at   ·   v^2 = u^2 + 2as   ·   stopping distances", 60, 210, 28),
    line(60, 470, 1220, 470, "grey", 3.0),
    *taxi(110, 470), arrow(150, 360, 290, 360, "yellow"),
    *child(1000, 470),
    double_arrow(270, 515, 1000, 515, "white", 3.0), write("40 m", 635, 560, 30, "white", "center"),
    write("Will it stop in time?", 640, 340, 40, "pink", "center"),
]
