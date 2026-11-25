"""Physics · Equations of motion: multi-stage journeys and chase problems. A chalkboard video lesson.

Follows content/notes/physics-equations-of-motion-2.md: a three-stage car journey
drawn one stage at a time on a velocity-time graph, its accelerations from the
gradients, the distance from the trapezium's area, and the average speed (with
the "average of the speeds" trap as a quick question); a "your turn" train
between stations where a time is missing; and a chase, a police motorbike after
a speeding keke, solved by equal displacements and drawn as two crossing lines.

"{a}" in a line is the letter A said as a letter (see board_video.shown).
Check: python3 scripts/video/board_video.py content/videos/physics-equations-of-motion-2.py --boards .video-build/boards/eqm2
"""

from board_video import arrow, clear, curve, dashed, dots, ellipse, equation, heading, line, step, write

TITLE = "Multi-Stage Journeys, Average Speed and Chase Problems | WASSCE Physics"
DESCRIPTION = ("Equations of motion in stages on the chalkboard: a journey drawn as a velocity-time graph, accelerations "
               "from gradients, distance from the area, average speed done right, a train problem to try yourself, and "
               "a police chase solved step by step.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Equations of motion"
# The lesson page this video is on: /wassce/physics/equations-of-motion/multi-stage-journeys-and-chase-problems
LESSON = "physics/equations-of-motion/multi-stage-journeys-and-chase-problems"


def axes(x0, y0, w, h, xl, yl):
    return [arrow(x0, y0, x0 + w, y0, "white", 3.0), arrow(x0, y0, x0, y0 - h, "white", 3.0),
            write(xl, x0 + w, y0 + 34, 20, "grey", "right"), write(yl, x0 + 14, y0 - h + 14, 20, "grey")]


def pause_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


# The journey's velocity-time graph: 8.5 px a second, 14 px a metre per second.
def jx(t):
    return 110 + 8.5 * t


def jy(v):
    return 560 - 14 * v


def journey_top(x):
    """The graph's height at x, for shading under it."""
    t = (x - 110) / 8.5
    v = 2 * t if t <= 10 else 20 if t <= 40 else 20 - 2.5 * (t - 40)
    return jy(max(v, 0))


# The chase's displacement-time graph: 38 px a second, 1.6 px a metre.
def cx(t):
    return 730 + 38 * t


def cy(s):
    return 600 - 1.6 * s


STEPS = [
    # ── 1. A journey in three stages ──────────────────────────────────
    step("Real journeys come in stages. A bus speeds up, cruises along, and then slows down for a stop. "
         "Usually the one where you are not getting off.",
         heading("A journey in three stages"),
         *axes(110, 560, 510, 360, "t / s", "v / m s^{-1}"),
         pause=1.0, chapter="A journey in three stages"),

    step("Here is one. A car starts from rest, and reaches twenty metres per second in ten seconds.",
         line(jx(0), jy(0), jx(10), jy(20), "yellow", 3.4),
         dashed(110, jy(20), jx(10), jy(20)), write("20", 94, jy(20) + 8, 22, "grey", "right"),
         write("10", jx(10), 588, 20, "grey", "center")),

    step("It keeps that speed for thirty seconds.",
         line(jx(10), jy(20), jx(40), jy(20), "yellow", 3.4),
         write("40", jx(40), 588, 20, "grey", "center")),

    step("Then it slows down evenly, and stops in eight seconds.",
         line(jx(40), jy(20), jx(48), jy(0), "yellow", 3.4),
         write("48", jx(48), 588, 20, "grey", "center")),

    step("The gradients give the accelerations. Speeding up: twenty over ten, two metres per second squared. "
         "Slowing down: zero minus twenty, over eight. Minus two point five.",
         equation(["speeding up:  a =", ("20", "10"), "= 2 m s^{-2}"], 650, 215, 23),
         equation(["slowing:  a =", ("0 - 20", "8"), "= -2.5 m s^{-2}"], 650, 300, 23)),

    step("The distance is the area under the graph. It is a trapezium: a half, times thirty plus forty-eight, times twenty. "
         "Seven hundred and eighty metres.",
         *[line(x, 558, x, journey_top(x) + 2, "green", 1.8) for x in range(124, int(jx(48)), 18)],
         write("30 s", (jx(10) + jx(40)) / 2, jy(20) - 12, 20, "blue", "center"),
         equation(["s =", ("1", "2"), "(30 + 48) × 20 = 780 m"], 650, 395, 23, "green")),

    step("And the average speed is total distance over total time: seven hundred and eighty, over forty-eight. "
         "Sixteen point two five metres per second.",
         equation(["average speed =", ("780", "48"), "= 16.25 m s^{-1}"], 650, 480, 22, "yellow")),

    step("Quick one. A student says the average speed is ten: zero, plus twenty, plus twenty, plus zero, over four. Right, or wrong?",
         write("Quick one:", 650, 552, 22, "pink"), write("(0 + 20 + 20 + 0) ÷ 4 = 10 ?", 650, 586, 22, "pink"),
         pause=2.4),

    step("Wrong. Average speed is always total distance over total time. Never the average of the speeds.",
         write("Wrong!  total distance ÷ total time", 650, 628, 22, "green")),

    # ── 2. Your turn: the train ───────────────────────────────────────
    step("Your turn, and this one is a real exam question. A train starts from rest, and speeds up at zero point five metres per second squared "
         "to its top speed of fifteen metres per second.",
         clear(2.2),
         heading("Your turn"),
         *pause_sign(1180, 82),
         write("A train: from rest at 0.5 m s^{-2} to 15 m s^{-1},", 70, 185, 26),
         chapter="Your turn: when a time is missing"),

    step("It cruises, then brakes at one metre per second squared, and stops at the next station, one point five kilometres away. "
         "How long does the journey take?",
         write("cruises, then brakes at 1 m s^{-2} to stop.", 70, 224, 26),
         write("Stations 1.5 km apart. Find the journey time.", 70, 264, 26, "blue"),
         line(860, 300, 1210, 300, "white", 2.6), line(860, 300, 920, 200, "yellow", 3.0),
         line(920, 200, 1140, 200, "yellow", 3.0), line(1140, 200, 1185, 300, "yellow", 3.0),
         write("?", 1030, 270, 28, "pink", "center")),

    step("Hint: sketch the graph first. Pause the video, and try it. This one takes a few minutes, so take them.",
         write("pause and try it", 1130, 92, 22, "pink", "right"),
         pause=3.6),

    step("Ready? Speeding up takes fifteen over zero point five: thirty seconds. "
         "It covers a half, times fifteen, times thirty: two hundred and twenty-five metres.",
         write("speeding up:  15 ÷ 0.5 = 30 s;    0.5 × 15 × 30 = 225 m", 70, 350, 24)),

    step("Braking takes fifteen seconds, and covers one hundred and twelve point five metres.",
         write("braking:  15 ÷ 1 = 15 s;    0.5 × 15 × 15 = 112.5 m", 70, 395, 24)),

    step("So the cruise covers fifteen hundred, minus two hundred and twenty-five, minus one hundred and twelve point five: "
         "eleven hundred and sixty-two point five metres. At fifteen metres per second, that takes seventy-seven point five seconds.",
         write("cruising:  1500 - 225 - 112.5 = 1162.5 m;    ÷ 15 = 77.5 s", 70, 440, 24)),

    step("Total: thirty, plus seventy-seven point five, plus fifteen. One hundred and twenty-two point five seconds. "
         "If you got that, give yourself a round of applause. Quietly, if you are in the library.",
         write("total = 30 + 77.5 + 15 = 122.5 s", 70, 520, 30, "green"),
         pause=1.1),

    # ── 3. The chase ──────────────────────────────────────────────────
    step("Now, the chase. A keke flies past a police motorbike at fifteen metres per second. For a keke, that is flying. "
         "The passengers are holding on to everything.",
         clear(2.2),
         heading("The chase"),
         write("keke:  15 m s^{-1}, steady", 70, 190, 26, "yellow"),
         pause=0.9, chapter="Chase problems"),

    step("At that moment, the police set off from rest, accelerating at three metres per second squared. When, and where, do they catch the keke?",
         write("police:  from rest, 3 m s^{-2}", 70, 232, 26, "blue"),
         write("When and where do they meet?", 70, 274, 24, "pink")),

    step("Here is the key idea. When they meet, both have gone the same distance, from the same point, in the same time. "
         "So write each distance in terms of t.",
         write("keke:  s = 15t", 70, 345, 26, "yellow"),
         equation(["police:  s =", ("1", "2"), "× 3 × t^2 = 1.5t^2"], 70, 405, 26, "blue")),

    step("Set them equal: one point five t squared equals fifteen t. Take out t: t times, one point five t minus fifteen, equals zero. "
         "So t is zero, which is when they start. Or t is ten seconds.",
         write("1.5t^2 = 15t   so   t(1.5t - 15) = 0", 70, 480, 25),
         write("t = 0 (the start)   or   t = 10 s", 70, 522, 26, "green")),

    step("In ten seconds, the keke covers one hundred and fifty metres. That is where they meet. Look: the two lines cross.",
         write("s = 15 × 10 = 150 m", 70, 580, 26, "green"),
         *axes(730, 600, 490, 380, "t / s", "s / m"),
         line(cx(0), cy(0), cx(12), cy(180), "yellow", 3.2),
         curve([(cx(t / 2), cy(1.5 * (t / 2) ** 2)) for t in range(0, 25)], "blue", 3.2),
         dots([(cx(10), cy(150))], "pink", 8), write("caught!", cx(10) - 14, cy(150) - 16, 22, "pink", "right"),
         dashed(cx(10), cy(150), cx(10), 600), write("10", cx(10), 628, 20, "grey", "center"),
         write("keke", cx(12) - 4, cy(180) + 30, 20, "yellow"), write("police", cx(11.6) - 10, cy(202) - 6, 20, "blue", "right")),

    step("And look at the police speed at that moment: three times ten, thirty metres per second. Twice the keke's speed. "
         "So the officer had better brake, or he overtakes the keke and keeps going. Very embarrassing.",
         write("police then:  3 × 10 = 30 m s^{-1}  (twice the keke!)", 70, 640, 21, "pink"),
         pause=1.1),

    # ── 4. In the exam ────────────────────────────────────────────────
    step("In the exam, the classic question says: sketch the velocity-time graph, and use it. "
         "So label both axes with units, mark the key values, and show the area working. "
         "Many students lose marks by not using the graph when they are told to.",
         clear(2.2),
         heading("What the exam wants"),
         write("\"Sketch the graph and use it\":", 70, 200, 28, "yellow"),
         write("label both axes, with units", 100, 260, 26),
         write("mark the key values on the axes", 100, 305, 26),
         write("show the area working, stage by stage", 100, 350, 26),
         write("Told to use the graph?  Use the graph.", 70, 430, 26, "pink"),
         chapter="What the exam wants"),

    step("Next time, things that fall: stones, balls, and mangoes. Mostly mangoes.",
         write("Next:  motion under gravity  (mostly mangoes)", 70, 530, 26, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Journeys & Chases", 54, 140, 84, "yellow"),
    write("Multi-stage journeys  ·  Average speed  ·  Chase problems", 60, 210, 28),
    *axes(110, 600, 520, 330, "", ""),
    line(110, 600, 210, 340, "yellow", 4.0), line(210, 340, 500, 340, "yellow", 4.0), line(500, 340, 580, 600, "yellow", 4.0),
    *[line(x, 598, x, (600 - (x - 110) * 2.6 if x < 210 else 340 if x < 500 else 340 + (x - 500) * 3.25) + 2, "green", 2.0) for x in range(126, 580, 18)],
    *axes(700, 600, 500, 330, "", ""),
    line(700, 600, 1160, 330, "yellow", 4.0),
    curve([(700 + 38 * t / 2, 600 - 1.5 * (t / 2) ** 2 * 1.75) for t in range(0, 25)], "blue", 4.0),
    write("caught!", 1050, 330, 32, "pink", "right"),
]
