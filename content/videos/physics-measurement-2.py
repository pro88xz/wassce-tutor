"""Physics · Measurement and errors: errors, accuracy, significant figures and density practicals. A chalkboard video lesson.

Follows content/notes/physics-measurement-2.md: accuracy and precision (three
students' readings of a 10.00 cm rod, drawn as targets); systematic, random and
gross errors and how to reduce each; absolute and percentage error, and the mean
of repeated readings; the rules of significant figures; the density of a
regular block, and of an irregular stone by displacement (with the gold buyers of
Kono and Tonkolili); and precautions that earn marks.
Check: python3 scripts/video/board_video.py content/videos/physics-measurement-2.py --boards .video-build/boards/measure2
"""

from board_video import arrow, box, clear, curve, dots, ellipse, equation, heading, line, step, text_width, write

TITLE = "Errors in Measurement, Accuracy vs Precision, Significant Figures and Density | WASSCE Physics"
DESCRIPTION = ("Measurement errors on the chalkboard: accuracy and precision, systematic, random and gross errors, "
               "percentage error and the mean, significant figures, and finding the density of a regular block and of "
               "a stone by displacement.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Measurement"
# The lesson page this video is on: /wassce/physics/measurement-and-errors/errors-accuracy-significant-figures-and-density-practicals
LESSON = "physics/measurement-and-errors/errors-accuracy-significant-figures-and-density-practicals"


def target(cx, cy, hits, r=58, s=1.0):
    """A target: the bull's-eye is the true value, the dots are the readings."""
    return [ellipse(cx, cy, r * s, r * s, "grey", 2.6), ellipse(cx, cy, r * 0.62 * s, r * 0.62 * s, "grey", 2.4),
            ellipse(cx, cy, r * 0.22 * s, r * 0.22 * s, "pink", 2.6),
            dots([(cx + dx * s, cy + dy * s) for dx, dy in hits], "yellow", 6 * s)]


def cylinder(x, top, bottom, level, label, stone=False):
    """A measuring cylinder: its scale, the water to `level` with the meniscus, and a stone on a thread."""
    w = 90
    out = [line(x, top, x, bottom, "white", 3.0), line(x + w, top, x + w, bottom, "white", 3.0), line(x, bottom, x + w, bottom, "white", 3.0)]
    out += [line(x, y, x + (16 if i % 2 == 0 else 9), y, "grey", 2.0) for i, y in enumerate(range(bottom - 20, top + 10, -20))]
    out.append(curve([(x + 4, level - 5), (x + w / 2, level + 3), (x + w - 4, level - 5)], "blue", 3.2))
    if stone:
        out += [line(x + w / 2, top - 30, x + w / 2, bottom - 62, "grey", 2.0), ellipse(x + w / 2, bottom - 40, 24, 18, "yellow", 3.2)]
    out.append(write(label, x + w / 2, bottom + 34, 22, "blue", "center"))
    return out


ERR = (70, 330, 760)   # type, what it does, how to reduce it

STEPS = [
    # ── 1. Accuracy and precision ──────────────────────────────────────
    step("Two students measure the same stone and get densities of two point six and two point nine grams per cubic centimetre. Who is right? Possibly neither. "
         "Every measurement carries some error.",
         heading("Accuracy and precision"),
         write("Every measurement carries some error.", 70, 178, 26, "grey"),
         chapter="Accuracy and precision: what is the difference?"),

    step("Accuracy is how close a measurement is to the true value. Precision is how close repeated measurements are to each other.",
         write("accuracy:  close to the true value", 70, 232, 27, "yellow"),
         write("precision:  repeats close to each other", 70, 274, 27, "blue")),

    step("A rod is truly ten centimetres long. Student A reads nine point nine nine, ten, and ten point zero one: accurate and precise.",
         *target(240, 450, [(-6, 4), (5, -5), (2, 7)]),
         write("A", 240, 548, 26, "green", "center"), write("accurate and precise", 240, 584, 21, "green", "center")),

    step("Student B reads nine point seven zero, nine point seven one and nine point seven zero. Precise, but not accurate: every reading is about zero point three too small.",
         *target(620, 450, [(-30, -26), (-24, -32), (-34, -22)]),
         write("B", 620, 548, 26, "pink", "center"), write("precise, not accurate", 620, 584, 21, "pink", "center")),

    step("Student C reads nine point five, ten point two and nine point eight: neither precise nor accurate.",
         *target(1040, 450, [(-40, 22), (32, -30), (14, 40)]),
         write("C", 1040, 548, 26, "grey", "center"), write("neither", 1040, 584, 21, "grey", "center")),

    # ── 2. Types of error ──────────────────────────────────────────────
    step("A systematic error shifts every reading the same way. Zero errors, a badly calibrated instrument, or parallax from the same side every time. "
         "Check and correct the zero, and calibrate. Repeating does not remove it.",
         clear(2.2),
         heading("Types of error"),
         *[write(c, x, 172, 21, "grey") for c, x in zip(["type", "what it does", "how to reduce it"], ERR)],
         line(60, 186, 1210, 186, "grey", 2.2),
         write("systematic", 70, 230, 25, "yellow"), write("shifts every reading", 330, 230, 23), write("correct the zero; calibrate", 760, 230, 23),
         write("zero error, calibration, parallax", 330, 264, 20, "grey"), write("(repeating does not help)", 760, 264, 20, "pink"),
         chapter="Systematic, random and gross errors"),

    step("A random error scatters readings above and below the true value, like your reaction time with a stopwatch. Take repeated readings and find the mean.",
         write("random", 70, 330, 25, "yellow"), write("scatters both ways", 330, 330, 23), write("repeat; take the mean", 760, 330, 23),
         write("reaction time, draughts", 330, 364, 20, "grey"), write("time many oscillations", 760, 364, 20, "grey")),

    step("A gross error is a blunder: misreading the scale, or writing sixty-three centimetres for six point three. Record each reading at once, with its unit.",
         write("gross", 70, 430, 25, "yellow"), write("one wild reading", 330, 430, 23), write("record at once, with units", 760, 430, 23),
         write("63 cm for 6.3 cm", 330, 464, 20, "grey")),

    step("A common mistake: I repeated the readings to remove the zero error. That loses the mark. A zero error is in every repeat. You remove it by correcting the zero.",
         write("\"I repeated it to remove the zero error\"  loses the mark.", 70, 560, 25, "pink"),
         write("A zero error is in every repeat: correct the zero.", 70, 602, 25, "pink")),

    # ── 3. Errors in numbers ───────────────────────────────────────────
    step("On a scale, one reading is usually good to half the smallest division: plus or minus zero point zero five centimetres on a rule marked in millimetres.",
         clear(2.2),
         heading("Absolute and percentage error"),
         write("one reading:  ± half the smallest division  (± 0.05 cm)", 70, 176, 24, "grey"),
         chapter="Absolute error, percentage error and the mean"),

    step("The absolute error is the difference between the measured and the true value. The percentage error is that, over the true value, times a hundred.",
         write("absolute error = | measured - true |", 70, 240, 28, "yellow"),
         equation(["percentage error =", ("absolute error", "true value"), "× 100%"], 70, 330, 27, "yellow")),

    step("A rod of true length fifty centimetres is measured as forty-nine. The absolute error is one centimetre, and the percentage error is one over fifty, times a hundred: two percent.",
         write("50.0 cm measured as 49.0 cm:", 70, 430, 25),
         write("absolute 1.0 cm;   1.0 ÷ 50.0 × 100% = 2.0%", 100, 470, 25, "blue")),

    step("Random errors push readings both ways, so the mean of several readings is better. Five readings add up to sixty-two point zero, so the mean is twelve point four centimetres.",
         write("12.4, 12.5, 12.3, 12.4, 12.4 cm", 70, 535, 25),
         equation(["mean =", ("62.0", "5"), "= 12.4 cm"], 100, 612, 25, "green")),

    # ── 4. Significant figures ─────────────────────────────────────────
    step("Significant figures show how precisely a value is known. Non-zero digits count: three four seven has three. Zeros between digits count: two thousand and five has four.",
         clear(2.2),
         heading("Significant figures"),
         write("347", 90, 190, 30), write("3", 330, 190, 30, "blue"), write("non-zero digits count", 420, 190, 24, "grey"),
         write("2005", 90, 240, 30), write("4", 330, 240, 30, "blue"), write("zeros between digits count", 420, 240, 24, "grey"),
         chapter="Significant figures: the rules"),

    step("Leading zeros do not count: zero point zero zero four two has two. But zeros at the end, after the point, do count: four point five zero zero has four.",
         write("0.0042", 90, 290, 30), write("2", 330, 290, 30, "blue"), write("leading zeros do not count", 420, 290, 24, "grey"),
         write("4.500", 90, 340, 30), write("4", 330, 340, 30, "blue"), write("final zeros after the point count", 420, 340, 24, "grey")),

    step("A number like fifteen hundred is unclear, so write it in standard form: one point five times ten to the three has two significant figures.",
         write("1500:  write 1.5 × 10^3  (2)  or  1.50 × 10^3  (3)", 90, 396, 26, "pink")),

    step("When you multiply or divide, give the answer to the same number of significant figures as the least precise measurement. Keep extra digits in your working, and round only at the end.",
         write("× and ÷:  as many as the least precise data;", 70, 480, 26, "yellow"),
         write("round only at the end.", 70, 520, 26, "yellow")),

    # ── 5. Density of a regular solid ──────────────────────────────────
    step("Density is mass over volume. For a rectangular block, the volume is length times width times height. "
         "Zero the balance first, and measure each side in two or three places and take the mean.",
         clear(2.2),
         heading("Density of a regular solid"),
         equation(["ρ =", ("m", "V"), ",   V = l × w × h"], 70, 220, 32),
         box(820, 230, 240, 110, "white", 3.2),
         line(820, 230, 880, 180, "white", 3.0), line(1060, 230, 1120, 180, "white", 3.0), line(880, 180, 1120, 180, "white", 3.0),
         line(1120, 180, 1120, 290, "white", 3.0), line(1060, 340, 1120, 290, "white", 3.0),
         write("5.00 cm", 940, 378, 22, "blue", "center"), write("1.50 cm", 1128, 245, 20, "blue"), write("2.00 cm", 838, 196, 22, "blue", "right"),
         chapter="Density of a regular solid: worked example"),

    step("A metal block measures five by two by one point five centimetres, and has a mass of one hundred and eighteen point five grams. "
         "Its volume is fifteen cubic centimetres, so its density is seven point nine zero grams per cubic centimetre: close to iron.",
         write("V = 5.00 × 2.00 × 1.50 = 15.0 cm^3", 70, 330, 28),
         equation(["ρ =", ("118.5", "15.0"), "= 7.90 g cm^{-3}"], 70, 440, 28, "yellow"),
         write("= 7.90 × 10^3 kg m^{-3}  (close to iron)", 100, 530, 26, "green")),

    # ── 6. Irregular solid ─────────────────────────────────────────────
    step("A stone has no formula for its volume, so we measure the water it pushes aside. Read the water level at the bottom of the meniscus, with your eye level with it.",
         clear(2.2),
         heading("Density of an irregular solid"),
         *cylinder(780, 180, 530, 400, "42 cm^3"),
         write("read the bottom of the meniscus,", 70, 190, 24),
         write("eye level with it", 70, 224, 24),
         chapter="Density of an irregular solid: displacement"),

    step("Tie the stone to a thread, lower it gently until it is under water, tap away any air bubbles, and read the new level: here fifty-seven cubic centimetres.",
         *cylinder(1010, 180, 530, 340, "57 cm^3", stone=True),
         arrow(900, 455, 990, 455, "grey"),
         write("lower it gently; tap away bubbles", 70, 290, 24)),

    step("The stone's volume is fifty-seven minus forty-two: fifteen cubic centimetres. With a mass of thirty-nine grams, its density is two point six grams per cubic centimetre.",
         write("V = 57 - 42 = 15 cm^3", 70, 380, 28, "blue"),
         equation(["ρ =", ("39", "15"), "= 2.6 g cm^{-3}"], 70, 480, 28, "yellow")),

    step("Gold buyers in Sierra Leone's mining areas use this to spot fakes: real gold has a density of about nineteen point three, far more than brass.",
         write("Kono, Tonkolili:  real gold 19.3 g cm^{-3}", 70, 578, 24, "green")),

    step("In the exam, name each precaution and the error it prevents: I read the bottom of the meniscus at eye level, to avoid parallax.",
         write("Exam:  name the precaution and the error it stops.", 70, 626, 24, "pink"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Errors & Density", 54, 145, 84, "yellow"),
    write("Accuracy  ·  Precision  ·  Significant figures", 60, 212, 30),
    *target(170, 400, [(-6, 4), (5, -5), (2, 7)], s=1.3), write("accurate", 170, 520, 28, "green", "center"),
    *target(440, 400, [(-30, -26), (-24, -32), (-34, -22)], s=1.3), write("precise", 440, 520, 28, "pink", "center"),
    *cylinder(700, 280, 560, 380, "", stone=True),
    equation(["ρ =", ("m", "V")], 900, 440, 60, "yellow"),
]
