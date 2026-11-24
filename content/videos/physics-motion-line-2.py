"""Physics · Motion in a straight line: motion graphs and the ticker-tape timer. A chalkboard video lesson.

Follows content/notes/physics-motion-line-2.md: a displacement-time graph read
as a story (a walk to school), its gradient as velocity, with a gradient to find;
velocity-time graphs, the gradient as acceleration and the area (shaded as the
teacher speaks) as displacement, with a "your turn" triangle; areas above and
below the time axis (distance and displacement); the three pairs to learn; the
ticker-tape timer, its tapes, and strips pasted into a velocity-time graph.

The teacher talks to the student, asks before telling, and lets a joke land.
Check: python3 scripts/video/board_video.py content/videos/physics-motion-line-2.py --boards .video-build/boards/motion2
"""

from board_video import arrow, box, clear, dashed, dots, ellipse, equation, heading, line, step, write

TITLE = "Motion Graphs: Displacement-Time, Velocity-Time and the Ticker-Tape Timer | WASSCE Physics"
DESCRIPTION = ("Motion graphs on the chalkboard: reading a displacement-time graph, the gradient as velocity, a "
               "velocity-time graph's gradient and area, distance and displacement from areas, and finding velocity "
               "and acceleration from a ticker tape.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Motion"
# The lesson page this video is on: /wassce/physics/motion-in-a-straight-line/motion-graphs-and-the-ticker-tape-timer
LESSON = "physics/motion-in-a-straight-line/motion-graphs-and-the-ticker-tape-timer"


def axes(x0, y0, w, h, xl, yl):
    """Two axes from the origin (x0, y0), with their labels at the arrow tips."""
    return [arrow(x0, y0, x0 + w, y0, "white", 3.0), arrow(x0, y0, x0, y0 - h, "white", 3.0),
            write(xl, x0 + w, y0 + 34, 20, "grey", "right"), write(yl, x0 + 14, y0 - h + 14, 20, "grey")]


def hatch(x0, x1, top, bottom, color, step_=22):
    """Shading under a line: vertical strokes from the axis up to top(x)."""
    return [line(x, bottom - 2, x, top(x) + 2, color, 2.0) for x in range(int(x0), int(x1), step_)]


def pause_sign(cx, cy, color="pink"):
    """The pause button: stop the video and try it."""
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def tape(x0, y, spots, length=640):
    """A strip of ticker tape with its dots."""
    return [box(x0, y - 14, length, 28, "grey", 2.2), dots([(x0 + p, y) for p in spots], "white", 4.2)]


def gaps(first, *steps_):
    out = [first]
    for g in steps_:
        out.append(out[-1] + g)
    return out


EVEN = [20 + 50 * i for i in range(13)]
GROWING = gaps(20, 15, 22, 29, 36, 43, 50, 57, 64, 71, 78, 85)
SHRINKING = gaps(20, 85, 78, 71, 64, 57, 50, 43, 36, 29, 22, 15)


def strip(x, bottom, cm, label):
    """A five-gap strip of tape stood on end: six dots, its length 40 px to the centimetre."""
    h = 40 * cm
    return [box(x, bottom - h, 70, h, "white", 2.6), dots([(x + 35, bottom - 6 - i * (h - 12) / 5) for i in range(6)], "white", 4.0),
            write(label, x + 35, bottom - h - 20, 21, "blue", "center")]


# a velocity-time graph: 0 to 12 m/s in 4 s, then 12 m/s to 7 s (60 px a second, 25 px a metre per second)
VT_X, VT_Y = 110, 590

STEPS = [
    # ── 1. A graph tells a story ──────────────────────────────────────
    step("Here is a graph. No words, and no numbers. And yet it tells a whole story. This is a student's walk to school.",
         heading("A graph tells a story"),
         *axes(100, 580, 520, 380, "time", "displacement"),
         chapter="Reading a displacement-time graph"),

    step("First, the line rises steadily: she is walking. Then it goes flat. Her displacement is not changing, so she is standing still. "
         "Probably chatting with a friend.",
         line(100, 580, 260, 460, "blue", 3.4), write("walking", 230, 560, 22, "blue", "center"),
         line(260, 460, 400, 460, "green", 3.4), write("chatting", 330, 444, 22, "green", "center")),

    step("Then the line shoots up, much steeper than before. She is running. Why? She has just checked the time.",
         line(400, 460, 500, 230, "pink", 3.4), write("running!", 515, 330, 22, "pink"),
         pause=1.1),

    step("So on a displacement-time graph, the gradient is the velocity. The steeper the line, the faster the body. "
         "A flat line means at rest. A curve getting steeper means speeding up. And a line sloping down means coming back towards the start.",
         write("gradient = velocity", 680, 200, 28, "yellow"),
         write("flat:  at rest", 680, 262, 23),
         write("steeper:  faster", 680, 300, 23),
         write("curving up:  speeding up", 680, 338, 23),
         write("sloping down:  coming back", 680, 376, 23)),

    step("For a curve, the velocity at an instant is the gradient of the tangent at that point.",
         write("a curve:  gradient of the tangent", 680, 420, 22, "grey")),

    step("Quick one. A flat line on a displacement-time graph. What is the body doing?",
         write("Quick one:  a flat line means...?", 680, 500, 23, "pink"),
         pause=2.3),

    step("At rest. Not moving at all. Like most students on a Saturday morning.",
         write("at rest!   (Saturday morning)", 680, 545, 24, "green"),
         pause=1.1),

    # ── 2. Finding a velocity ─────────────────────────────────────────
    step("Let us find a velocity. A straight line passes through two seconds, four metres, and eight seconds, twenty-two metres. Find the velocity.",
         clear(2.2),
         heading("Finding a velocity"),
         *axes(120, 600, 500, 430, "t / s", "s / m"),
         line(153, 600, 570, 150, "white", 3.4),
         dots([(220, 528), (520, 204)], "yellow", 7),
         dashed(220, 528, 220, 600), dashed(120, 528, 220, 528), dashed(520, 204, 520, 600), dashed(120, 204, 520, 204),
         write("2", 220, 628, 22, "grey", "center"), write("8", 520, 628, 22, "grey", "center"),
         write("4", 104, 536, 22, "grey", "right"), write("22", 104, 212, 22, "grey", "right"),
         write("A straight line through", 660, 192, 24),
         write("(2 s, 4 m) and (8 s, 22 m).", 660, 230, 24),
         write("Find the velocity.", 660, 270, 24, "blue"),
         chapter="The gradient is the velocity"),

    step("Can you find it before I do? Pause if you need to.",
         write("try it first!", 660, 330, 22, "pink"),
         pause=2.6),

    step("The rise is twenty-two minus four: eighteen metres. The run is eight minus two: six seconds. "
         "Eighteen over six: the velocity is three metres per second.",
         line(220, 528, 520, 528, "pink", 2.8), line(520, 528, 520, 204, "pink", 2.8),
         write("6 s", 370, 560, 22, "pink", "center"), write("18 m", 535, 380, 22, "pink"),
         equation(["v =", ("22 - 4", "8 - 2"), "=", ("18", "6"), "= 3.0 m s^{-1}"], 650, 420, 26, "yellow")),

    # ── 3. Velocity-time graphs ───────────────────────────────────────
    step("Now the velocity-time graph. Two things matter here. The gradient is the acceleration. And the area under the line is the displacement.",
         clear(2.2),
         heading("Velocity-time graphs"),
         write("gradient = acceleration", 640, 200, 26, "yellow"),
         write("area under the line = displacement", 640, 240, 24, "green"),
         chapter="Velocity-time graphs: gradient and area"),

    step("A body starts from rest and reaches twelve metres per second in four seconds, then keeps going at twelve for three seconds more. "
         "Its acceleration at the start is twelve over four: three metres per second squared.",
         *axes(VT_X, VT_Y, 530, 360, "t / s", "v / m s^{-1}"),
         line(VT_X, VT_Y, 350, 290, "white", 3.4), line(350, 290, 530, 290, "white", 3.4),
         dashed(350, 290, 350, VT_Y), dashed(VT_X, 290, 350, 290),
         write("4", 350, 618, 22, "grey", "center"), write("7", 530, 618, 22, "grey", "center"), write("12", 94, 298, 22, "grey", "right"),
         equation(["a =", ("12 - 0", "4"), "= 3.0 m s^{-2}"], 640, 330, 26)),

    step("And the displacement is the area. The triangle is a half, times four, times twelve: twenty-four metres. "
         "The rectangle is three times twelve: thirty-six metres. Together, sixty metres.",
         *hatch(130, 350, lambda x: VT_Y - (x - VT_X) * 300 / 240, VT_Y, "pink"),
         write("24 m", 212, 392, 24, "pink", "center"),
         *hatch(372, 530, lambda x: 290, VT_Y, "blue"),
         write("36 m", 450, 272, 24, "blue", "center"),
         equation(["triangle:", ("1", "2"), "× 4 × 12 = 24 m"], 640, 420, 24, "pink"),
         write("rectangle:  3 × 12 = 36 m", 640, 482, 24, "blue"),
         write("displacement = 24 + 36 = 60 m", 640, 532, 26, "green")),

    step("A distance, from an area. I did tell you physics was strange.",
         write("(an area that is a distance!)", 640, 585, 22, "grey"),
         pause=1.0),

    # ── 4. Your turn ──────────────────────────────────────────────────
    step("Your turn. A velocity-time graph is a triangle, with a base of eight seconds and a height of ten metres per second. Find the displacement.",
         clear(2.2),
         heading("Your turn"),
         *pause_sign(1180, 82),
         *axes(110, 480, 420, 290, "t / s", "v / m s^{-1}"),
         line(110, 480, 270, 240, "white", 3.4), line(270, 240, 430, 480, "white", 3.4),
         dashed(110, 240, 270, 240),
         write("10", 94, 248, 22, "grey", "right"), write("8", 430, 508, 22, "grey", "center"),
         write("A velocity-time graph is a triangle:", 600, 200, 24),
         write("base 8 s,  height 10 m s^{-1}.", 600, 240, 24),
         write("Find the displacement.", 600, 280, 24, "blue"),
         chapter="Your turn: displacement from an area"),

    step("Pause the video, and work it out. I will wait.",
         write("pause and try it", 1130, 92, 22, "pink", "right"),
         pause=3.2),

    step("The area of a triangle is a half, times the base, times the height. A half, times eight, times ten: forty metres.",
         *hatch(130, 430, lambda x: 480 - 240 * (1 - abs(x - 270) / 160), 480, "green"),
         equation(["area =", ("1", "2"), "× 8 × 10 = 40 m"], 600, 380, 28, "green")),

    step("If you got eighty, you forgot the half. The triangle never forgives.",
         write("80?  You forgot the half!", 600, 460, 24, "pink"),
         pause=1.0),

    # ── 5. Above and below the axis ───────────────────────────────────
    step("One more twist. When the line goes below the time axis, the velocity is negative: the body is moving backwards. "
         "Area below the axis counts as negative displacement.",
         clear(2.2),
         heading("Above and below the axis"),
         *axes(110, 400, 520, 230, "t / s", "v / m s^{-1}"),
         line(110, 400, 110, 520, "white", 3.0),
         write("below the axis:  moving backwards", 680, 200, 23),
         chapter="Distance and displacement from areas"),

    step("A body moves at six metres per second for five seconds, then at two metres per second the other way for three seconds.",
         line(110, 220, 385, 220, "white", 3.4), line(385, 220, 385, 460, "white", 3.0), line(385, 460, 550, 460, "white", 3.4),
         line(550, 460, 550, 400, "white", 3.0),
         write("6", 94, 228, 22, "grey", "right"), write("-2", 94, 468, 22, "grey", "right"),
         write("6 m s^{-1} for 5 s,", 680, 250, 23),
         write("then 2 m s^{-1} back for 3 s", 680, 288, 23)),

    step("The area above is six times five: thirty metres. The area below is two times three: six metres.",
         *hatch(130, 385, lambda x: 220, 400, "blue"),
         write("+30 m", 470, 300, 24, "blue", "center"),
         *[line(x, 402, x, 458, "pink", 2.0) for x in range(400, 550, 22)],
         write("-6 m", 468, 500, 24, "pink", "center")),

    step("Distance counts every area: thirty plus six, thirty-six metres. Displacement takes the one below away: thirty minus six, "
         "twenty-four metres, in the first direction.",
         write("distance = 30 + 6 = 36 m", 680, 360, 25),
         write("displacement = 30 - 6 = 24 m", 680, 405, 25, "yellow"),
         write("distance:  add every area", 680, 470, 22, "grey"),
         write("displacement:  above minus below", 680, 505, 22, "grey")),

    # ── 6. The three pairs ────────────────────────────────────────────
    step("Here is where students lose easy marks. There are three pairs to learn, so say them with me.",
         clear(2.2),
         heading("Learn the three pairs"),
         chapter="The three pairs to learn"),

    step("Displacement-time graph: the gradient is the velocity. Velocity-time graph: the gradient is the acceleration. "
         "And the area under a velocity-time graph is the displacement.",
         write("s-t graph:   gradient = velocity", 90, 220, 32),
         write("v-t graph:   gradient = acceleration", 90, 290, 32, "yellow"),
         write("v-t graph:   area = displacement", 90, 360, 32, "green")),

    step("Never take the gradient of a velocity-time graph and call it a velocity. The examiner has seen it many times, "
         "and the examiner is not impressed.",
         write("The gradient of a v-t graph is NOT a velocity.", 90, 460, 26, "pink"),
         pause=1.1),

    # ── 7. The ticker-tape timer ──────────────────────────────────────
    step("Now, the ticker-tape timer. Its metal arm taps fifty times every second, like a student drumming on the desk, "
         "five minutes before break.",
         clear(2.2),
         heading("The ticker-tape timer"),
         box(140, 160, 140, 80, "white", 3.0), write("timer", 210, 208, 22, "grey", "center"),
         line(210, 240, 210, 262, "white", 3.0),
         write("taps 50 times a second", 320, 210, 24, "blue"),
         pause=0.9, chapter="The ticker-tape timer"),

    step("Each tap prints a dot on a paper tape, pulled along by a trolley. So the time between two dots is one fiftieth of a second: "
         "zero point zero two seconds.",
         *tape(80, 276, [150 + 50 * i for i in range(17)], length=980),
         box(1080, 252, 110, 46, "white", 3.0), ellipse(1105, 306, 10, 10, "white", 2.4), ellipse(1165, 306, 10, 10, "white", 2.4),
         write("trolley", 1135, 240, 20, "grey", "center"),
         equation(["time between dots =", ("1", "50"), "s = 0.02 s"], 70, 375, 26, "yellow")),

    step("Now read the gaps. Equal gaps: constant velocity. Gaps getting longer: the trolley is speeding up. "
         "Gaps getting shorter: it is slowing down.",
         *tape(70, 470, EVEN), write("equal:  constant velocity", 740, 478, 23),
         *tape(70, 540, GROWING), write("longer:  speeding up", 740, 548, 23, "green"),
         *tape(70, 610, SHRINKING), write("shorter:  slowing down", 740, 618, 23, "pink")),

    # ── 8. Reading a tape ─────────────────────────────────────────────
    step("To measure it, the tape is cut into strips of five gaps each. Quick one: how long does one strip take?",
         clear(2.2),
         heading("Reading a tape"),
         write("cut into strips of 5 gaps", 70, 190, 26),
         write("Quick one:  time for one strip?", 70, 240, 24, "pink"),
         pause=2.3, chapter="Velocity and acceleration from a tape"),

    step("Five gaps, times zero point zero two: zero point one seconds.",
         write("5 × 0.02 = 0.1 s", 300, 284, 24, "green")),

    step("Three strips in a row are two, three and four centimetres long. Stand them side by side, and look: "
         "you have made a velocity-time graph out of paper.",
         line(740, 600, 1080, 600, "white", 3.0),
         *strip(760, 600, 2.0, "2.0 cm"), *strip(860, 600, 3.0, "3.0 cm"), *strip(960, 600, 4.0, "4.0 cm"),
         pause=0.8),

    step("Velocity is length over time. Two centimetres in zero point one seconds is zero point two metres per second. "
         "Then zero point three, then zero point four.",
         write("v = 0.020 m ÷ 0.1 s = 0.20 m s^{-1}", 70, 350, 24),
         write("then 0.30, then 0.40 m s^{-1}", 70, 390, 24)),

    step("The velocity goes up by zero point one, every zero point one seconds. So the acceleration is one metre per second squared.",
         equation(["a =", ("0.10", "0.1"), "= 1.0 m s^{-2}"], 70, 472, 28, "yellow")),

    step("And for the practical marks: start the timer before you release the trolley, ignore the crowded dots at the start, "
         "and make sure the tape runs freely.",
         write("precautions:", 70, 556, 22, "pink"),
         write("start the timer before releasing;", 70, 590, 22, "pink"),
         write("ignore the crowded first dots; tape runs freely.", 70, 624, 22, "pink")),

    step("Next time: the equations of motion. Four tidy equations, and you will see where every one of them comes from. Bring a pencil.",
         write("Next:  the equations of motion", 740, 200, 23, "green"),
         write("(bring a pencil)", 740, 236, 21, "grey"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Motion Graphs", 54, 145, 84, "yellow"),
    write("Gradient  ·  Area  ·  Ticker tape", 60, 212, 30),
    *axes(90, 600, 520, 320, "", ""),
    line(90, 600, 330, 330, "white", 4.0), line(330, 330, 560, 330, "white", 4.0),
    *hatch(108, 330, lambda x: 600 - (x - 90) * 270 / 240, 600, "pink", 20),
    *hatch(348, 560, lambda x: 330, 600, "blue", 20),
    write("area = distance!", 330, 300, 30, "green", "center"),
    *strip(760, 600, 2.0, ""), *strip(860, 600, 3.0, ""), *strip(960, 600, 4.0, ""),
    line(740, 600, 1080, 600, "white", 3.0),
]
