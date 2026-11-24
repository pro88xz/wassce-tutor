"""Physics · Measurement and errors: the metre rule, vernier calipers and the micrometer screw gauge. A chalkboard video lesson.

Follows content/notes/physics-measurement-1.md: range and least count;
reading a metre rule (the rod from 1.4 cm to 18.9 cm) and parallax; vernier
calipers (least count 0.1 mm, the 24.6 mm reading); the micrometer screw
gauge (least count 0.01 mm, the 5.78 mm reading, the half-millimetre mark);
zero error and its correction; and which instrument for which job.
The scales are drawn to their true proportions: the vernier's ten divisions
span nine millimetres, so its sixth line meets the main scale at 30 mm.
Check: python3 scripts/video/board_video.py content/videos/physics-measurement-1.py --boards .video-build/boards/measure1
"""

from board_video import arrow, box, clear, dashed, ellipse, equation, heading, line, ring, step, text_width, write

TITLE = "How to Read Vernier Calipers and a Micrometer Screw Gauge: Least Count, Zero Error | WASSCE Physics"
DESCRIPTION = ("Measuring length on the chalkboard: range and least count, the metre rule and parallax, how to read "
               "vernier calipers and a micrometer screw gauge, correcting for zero error, and which instrument to use, "
               "with WASSCE worked examples.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Measurement"
# The lesson page this video is on: /wassce/physics/measurement-and-errors/measuring-length-metre-rule-vernier-calipers-and-micrometer-screw-gauge
LESSON = "physics/measurement-and-errors/measuring-length-metre-rule-vernier-calipers-and-micrometer-screw-gauge"


def ruler(x0, y, cm_px, cms=20, width=3.0):
    """A metre rule seen from above: centimetre and half-centimetre marks, numbered every 5 cm."""
    out = [box(x0 - 30, y, cms * cm_px + 60, 60, "grey", width)]
    for i in range(2 * cms + 1):
        x = x0 + i * cm_px / 2
        out.append(line(x, y, x, y + (22 if i % 2 == 0 else 12), "white", 2.4))
        if i % 10 == 0:
            out.append(write(str(i // 2), x, y + 50, 20, "white", "center"))
    return out


def vernier(x0, y, px=40, mm0=20, mm1=36, zero=24.6, hit=6, size=24):
    """The main scale (millimetre marks, numbered in cm) over the vernier: ten
    divisions spanning nine millimetres, its zero at `zero` mm. The `hit` line
    is the one that meets a main-scale mark, drawn in yellow."""
    X = lambda mm: x0 + (mm - mm0) * px
    out = [line(X(mm0) - 20, y, X(mm1) + 20, y, "grey", 3.0)]
    for mm in range(mm0, mm1 + 1):
        h = px * 0.85 if mm % 10 == 0 else (px * 0.6 if mm % 5 == 0 else px * 0.38)
        out.append(line(X(mm), y, X(mm), y - h, "white", 2.4))
        if mm % 10 == 0:
            out.append(write(str(mm // 10), X(mm), y - h - 10, size, "white", "center"))
    out.append(write("cm", X(mm1) + 26, y - px * 0.4, size * 0.8, "grey"))
    for i in range(11):
        x = X(zero) + i * 0.9 * px
        out.append(line(x, y, x, y + (px * 0.75 if i % 5 == 0 else px * 0.45), "yellow" if i == hit else "blue", 2.6 if i != hit else 3.4))
        if i % 5 == 0:
            out.append(write(str(i), x, y + px * 0.75 + size + 4, size * 0.85, "blue", "center"))
    return out


def micrometer(x0, y, px=60, reading=5.78, thimble_n=28, size=22):
    """The sleeve (millimetres above the datum line, half millimetres below) and
    the thimble's edge, with its scale beside the datum line."""
    edge = x0 + reading * px
    out = [line(x0 - 20, y, edge, y, "white", 3.0),
           line(x0 - 20, y - 50, edge, y - 50, "grey", 2.4), line(x0 - 20, y + 50, edge, y + 50, "grey", 2.4)]
    for mm in range(0, int(reading) + 1):
        out.append(line(x0 + mm * px, y, x0 + mm * px, y - 24, "white", 2.6))
        if mm in (0, 5):
            out.append(write(str(mm), x0 + mm * px, y - 32, size, "white", "center"))
        half = mm + 0.5
        if half < reading:
            out.append(line(x0 + half * px, y, x0 + half * px, y + 18, "pink" if half == 5.5 else "white", 2.6 if half != 5.5 else 3.2))
    out.append(box(edge, y - 112, 170, 224, "grey", 3.0))
    for n in range(thimble_n - 6, thimble_n + 7):
        yy = y - (n - thimble_n) * 17
        long_ = n % 5 == 0
        out.append(line(edge, yy, edge + (26 if long_ else 14), yy, "yellow" if n == thimble_n else "white", 3.2 if n == thimble_n else 2.2))
        if long_:
            out.append(write(str(n), edge + 34, yy + 8, size * 0.9))
    out.append(write("28", edge + 34, y + 8, size * 0.9, "yellow"))
    return out


def eye(cx, cy, s=1.0):
    return [ellipse(cx, cy, 26 * s, 12 * s, "white", 2.6), ellipse(cx, cy, 6 * s, 6 * s, "white", 3.2)]


ROWS = (70, 420, 940)   # instrument, used for, least count

STEPS = [
    # ── 1. Choosing the instrument ─────────────────────────────────────
    step("A metre rule can tell you that a pencil is seventeen point five centimetres long, but it cannot measure the thickness of a wire. "
         "No instrument is exact, so it must suit the size of what you measure.",
         heading("Choosing the instrument"),
         write("Every measurement:  a quantity, a number and a unit.", 70, 182, 26, "grey"),
         chapter="Choosing an instrument: range and least count"),

    step("The range is the largest and smallest value an instrument can measure. The least count is the smallest change it can show: the value of its smallest division.",
         write("range:  the largest and smallest it can measure", 70, 240, 26, "blue"),
         write("least count:  the smallest change it can show", 70, 282, 26, "pink")),

    step("A metre rule, or a tape, reads to one millimetre. Vernier calipers read to a tenth of a millimetre. And a micrometer screw gauge reads to a hundredth of a millimetre.",
         *[write(c, x, 360, 22, "grey") for c, x in zip(["instrument", "used for", "least count"], ROWS)],
         line(60, 374, 1160, 374, "grey", 2.2),
         *[write(c, x, 414, 25, col) for c, x, col in zip(["metre rule, tape", "a bench, a long distance", "1 mm"], ROWS, ("yellow", "white", "blue"))],
         *[write(c, x, 458, 25, col) for c, x, col in zip(["vernier calipers", "diameters and depths", "0.1 mm"], ROWS, ("yellow", "white", "blue"))],
         *[write(c, x, 502, 25, col) for c, x, col in zip(["micrometer", "thin wire, paper", "0.01 mm"], ROWS, ("yellow", "white", "blue"))]),

    # ── 2. The metre rule ──────────────────────────────────────────────
    step("Lay the rule along the object. If the object does not start at the zero mark, read both ends and subtract. "
         "This rod starts at one point four centimetres and ends at eighteen point nine.",
         clear(2.2),
         heading("Using a metre rule"),
         *ruler(100, 300, 50),
         box(170, 252, 875, 42, "yellow", 3.4),
         arrow(170, 210, 170, 248, "pink"), write("1.4 cm", 170, 200, 22, "pink", "center"),
         arrow(1045, 210, 1045, 248, "pink"), write("18.9 cm", 1045, 200, 22, "pink", "center"),
         chapter="Using a metre rule, and avoiding parallax"),

    step("So the length is eighteen point nine minus one point four: seventeen point five centimetres, not eighteen point nine.",
         write("L = 18.9 - 1.4 = 17.5 cm", 70, 470, 32, "yellow")),

    step("Looking at a scale from one side makes the mark seem to move against it. That is parallax error. Put your eye directly above the mark you read.",
         write("Parallax error:", 70, 570, 28, "pink"),
         write("put your eye directly above the mark", 70, 612, 24),
         line(760, 610, 1180, 610, "grey", 3.0),
         *[line(780 + 40 * i, 610, 780 + 40 * i, 596, "white", 2.2) for i in range(11)],
         *eye(980, 470), dashed(980, 486, 980, 598, "green", 2.6), write("right", 1000, 520, 22, "green"),
         *eye(820, 470, 0.8), dashed(830, 484, 975, 598, "pink", 2.6), write("wrong", 760, 440, 22, "pink")),

    # ── 3. Vernier calipers ────────────────────────────────────────────
    step("Vernier calipers have a main scale on a steel beam, and a sliding vernier scale on the moving jaw. "
         "The big jaws grip the outside of an object, the small jaws fit inside a hole, and the thin rod measures depth.",
         clear(2.2),
         heading("Vernier calipers"),
         write("outside jaws:  outside diameter", 70, 180, 24),
         write("inside jaws:  inside diameter", 70, 214, 24),
         write("depth rod:  depth", 70, 248, 24),
         chapter="How to read vernier calipers"),

    step("On a school vernier, ten vernier divisions are the same length as nine millimetres on the main scale. "
         "So one vernier division is zero point nine millimetres, and the least count is one millimetre minus zero point nine: zero point one millimetres.",
         write("10 vernier divisions = 9 mm", 640, 180, 24, "blue"),
         write("least count = 1.0 - 0.9 = 0.1 mm", 640, 222, 24, "yellow")),

    step("Here is a reading. First, read the main scale at the mark just before the vernier zero: twenty-four millimetres.",
         *vernier(120, 400),
         arrow(280, 300, 280, 360, "pink"), write("24 mm", 280, 290, 22, "pink", "center")),

    step("Next, find the one vernier line that lines up exactly with a main scale line. Here it is the sixth.",
         ring(520, 400, 22, 30, "yellow"), write("6th line meets 30 mm", 560, 498, 22, "yellow")),

    step("The reading is twenty-four millimetres, plus six times zero point one: twenty-four point six millimetres, or two point four six centimetres.",
         write("reading = 24 mm + 6 × 0.1 mm = 24.6 mm = 2.46 cm", 70, 560, 26, "yellow")),

    step("A common mistake: reading twenty-five, the mark after the vernier zero, or adding six millimetres instead of six times zero point one.",
         write("Use the mark before the zero (24, not 25), and × 0.1 mm.", 70, 620, 24, "pink")),

    # ── 4. Micrometer screw gauge ──────────────────────────────────────
    step("A micrometer screw gauge measures very small lengths, like the diameter of a wire. "
         "The object sits between the anvil and the spindle, and turning the thimble moves the spindle.",
         clear(2.2),
         heading("Micrometer screw gauge"),
         write("for thin wire and paper:  anvil, spindle, thimble", 70, 178, 24),
         chapter="How to read a micrometer screw gauge"),

    step("The pitch is how far the spindle moves in one full turn: usually zero point five millimetres. "
         "The thimble has fifty divisions, so the least count is zero point five over fifty: zero point zero one millimetres.",
         equation(["least count =", ("pitch", "divisions"), "=", ("0.5 mm", "50"), "= 0.01 mm"], 70, 268, 25, "yellow")),

    step("Close it with the ratchet until it clicks, so it never squashes the object. Then read the sleeve. "
         "Here it shows five millimetres, and the half millimetre mark after it is showing too: so five point five.",
         *micrometer(110, 470),
         write("close it with the ratchet", 720, 380, 22, "grey"),
         write("sleeve:  5 + 0.5 = 5.5 mm", 720, 430, 23, "pink")),

    step("Then read the thimble line on the datum line: twenty-eight. The reading is five point five, plus twenty-eight times zero point zero one: five point seven eight millimetres.",
         write("thimble:  28 × 0.01 = 0.28 mm", 720, 480, 23),
         write("reading = 5.78 mm", 720, 540, 32, "yellow")),

    step("The commonest mistake is missing the half millimetre mark. Five point two eight would lose the mark.",
         write("Missing the half-mm mark gives 5.28 mm:  wrong.", 70, 642, 24, "pink")),

    # ── 5. Zero error ──────────────────────────────────────────────────
    step("An instrument has a zero error if it does not read zero when it is closed. A positive zero error makes every reading too big. A negative one makes every reading too small.",
         clear(2.2),
         heading("Zero error"),
         write("Zero error:  not zero when closed", 70, 180, 28),
         write("positive (+):  every reading too big", 90, 226, 26, "blue"),
         write("negative (-):  every reading too small", 90, 266, 26, "pink"),
         chapter="Zero error and how to correct it"),

    step("To correct it, take the zero error, with its sign, away from the reading.",
         write("corrected = observed - zero error", 90, 350, 32, "yellow"),
         box(70, 308, text_width("corrected = observed - zero error", 32) + 44, 60)),

    step("Calipers read plus zero point two millimetres when closed, and sixteen point seven on an object. "
         "Sixteen point seven minus zero point two is sixteen point five millimetres.",
         write("(a)  16.7 - (+0.2) = 16.5 mm", 90, 440, 28)),

    step("A micrometer has a zero error of minus zero point zero three, and reads two point four six. Taking away a negative means adding: two point four nine millimetres.",
         write("(b)  2.46 - (-0.03) = 2.46 + 0.03 = 2.49 mm", 90, 500, 28)),

    step("In fitting shops and garages across Sierra Leone, mechanics check bolts and pistons with vernier calipers in just this way.",
         write("Garages in Freetown, Bo and Makeni use calipers every day.", 70, 600, 24, "green")),

    # ── 6. Which instrument ────────────────────────────────────────────
    step("Last, which instrument for which job? A bench: a metre rule or a tape. The inside of a test tube, or the depth of a beaker: vernier calipers. "
         "A pendulum bob: vernier calipers too. A thin wire or a sheet of paper: a micrometer.",
         clear(2.2),
         heading("Which instrument?"),
         *[a for i, (job, tool) in enumerate([("the length of a bench", "metre rule or tape"),
                                              ("the inside of a test tube", "vernier (inside jaws)"),
                                              ("the depth of a beaker", "vernier (depth rod)"),
                                              ("a pendulum bob", "vernier (outside jaws)"),
                                              ("a thin wire, a sheet of paper", "micrometer screw gauge")])
           for a in (write(job, 70, 190 + 46 * i, 25), write(tool, 600, 190 + 46 * i, 25, "yellow"))],
         chapter="Which instrument for which job?"),

    step("In the practical paper, record each reading to the instrument's least count, and state your precautions: I used the ratchet, and I checked the zero error first.",
         write("Exam:  record each reading to the least count;", 70, 470, 25, "pink"),
         write("precautions: the ratchet, the zero error.", 70, 510, 25, "pink"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Vernier & Micrometer", 54, 140, 76, "yellow"),
    write("Least count  ·  Reading  ·  Zero error", 60, 206, 30),
    *vernier(80, 420, px=34, size=26),
    ring(80 + 10 * 34, 418, 20, 30, "yellow"),
    write("24.6 mm", 150, 610, 56, "yellow"),
    *micrometer(780, 440, px=40, size=24),
    write("5.78 mm", 800, 630, 50, "yellow"),
]
