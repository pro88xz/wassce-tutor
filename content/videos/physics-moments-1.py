"""Physics · Moments and turning effects: moments, the principle of moments and couples. A chalkboard video lesson.

Follows content/notes/physics-moments-1.md, explaining each idea from the
student's own experience: why a door handle is far from the hinges (moment =
force × distance, and the longer spanner); why only the perpendicular distance
counts (a push aimed at the hinge turns nothing); the see-saw promised last
lesson, Musa and Aminata, and the principle of moments; the two conditions for a
beam, with a plank on two supports solved by choosing the pivot cleverly (and why
it works); "have a go" with a metre rule; and couples, with a steering wheel.

Check: python3 scripts/video/board_video.py content/videos/physics-moments-1.py --boards .video-build/boards/mom1
"""

from board_video import arrow, box, clear, curve, dashed, double_arrow, ellipse, heading, line, step, write

TITLE = "Moments of a Force, the Principle of Moments and Couples, Explained | WASSCE Physics"
DESCRIPTION = ("Moments on the chalkboard, explained from everyday life: why door handles sit far from the hinges, why only "
               "the perpendicular distance counts, the see-saw and the principle of moments, a plank on two supports, a "
               "metre rule to try, and couples.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Moments"
# The lesson page this video is on: /wassce/physics/moments-and-turning-effects/moments-the-principle-of-moments-and-couples
LESSON = "physics/moments-and-turning-effects/moments-the-principle-of-moments-and-couples"


def stop_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def pivot(x, y, color="white"):
    """A triangular pivot with its tip at (x, y)."""
    return [line(x - 28, y + 40, x, y, color, 3.0), line(x, y, x + 28, y + 40, color, 3.0), line(x - 28, y + 40, x + 28, y + 40, color, 3.0)]


def man(x, feet, color="white"):
    return [ellipse(x, feet - 70, 11, 11, color, 2.8), line(x, feet - 58, x, feet - 26, color, 2.8),
            line(x, feet - 26, x - 12, feet, color, 2.8), line(x, feet - 26, x + 12, feet, color, 2.8),
            line(x - 14, feet - 46, x + 14, feet - 46, color, 2.8)]


# The rod at 30° (board 2): pivot P, end E, the force's direction, and the foot of the perpendicular.
P, E, DIR = (760, 560), (1160, 560), (-0.866, -0.5)
FOOT = (E[0] + 346.4 * DIR[0], E[1] + 346.4 * DIR[1])

STEPS = [
    # ── 1. Why is the handle there? ───────────────────────────────────
    step("Here is a question you have probably never asked. Why is a door handle always on the side far away from the hinges? "
         "Have you ever seen a door with its handle right next to the hinges?",
         heading("Why is the handle there?"),
         ellipse(780, 440, 9, 9, "white", 3.0),
         line(780, 440, 1180, 440, "yellow", 5.0), box(1140, 446, 18, 12, "white", 2.6),
         write("hinge", 780, 480, 20, "grey", "center"), write("handle", 1149, 486, 20, "grey", "center"),
         write("(a door, seen from above)", 980, 600, 20, "grey", "center"),
         pause=1.5, chapter="The moment of a force"),

    step("Try it on the next door you meet. Push at the handle, and it swings open easily. Now push right beside the hinges, just as hard. "
         "It hardly moves. Same force, completely different effect.",
         arrow(1150, 340, 1150, 430, "green"), write("easy", 1150, 328, 22, "green", "center"),
         arrow(820, 340, 820, 430, "pink"), write("hardly moves", 860, 328, 22, "pink", "center"),
         curve([(780, 440), (980, 470), (1150, 560)], "green", 2.4),
         write("Same push.  Different effect.", 70, 200, 28)),

    step("What changed is the distance from the hinge. The turning effect of a force, called its moment, depends on two things: "
         "how hard you push, and how far from the pivot you push.",
         write("moment = force × distance", 70, 280, 34, "yellow"),
         write("(the turning effect of a force)", 70, 320, 22, "grey")),

    step("Double the force, and the moment doubles. Double the distance, and the moment doubles too. "
         "That is why a mechanic facing a stiff nut does not just push harder. He reaches for a longer spanner.",
         write("20 N on a 0.25 m spanner:  5 N m", 100, 400, 24),
         write("20 N on a 0.5 m spanner:  10 N m", 100, 440, 24, "green"),
         write("unit:  the newton metre, N m", 100, 488, 22, "grey")),

    # ── 2. Only the perpendicular distance ────────────────────────────
    step("Now a subtle point, and it catches many students. The distance is not just any distance from the pivot. "
         "It is the perpendicular distance, from the pivot to the line of action of the force.",
         clear(2.2),
         heading("Which distance?"),
         *pivot(*P), line(*P, *E, "white", 3.4),
         arrow(*E, E[0] + 120 * DIR[0], E[1] + 120 * DIR[1], "yellow"), write("50 N", E[0] + 130 * DIR[0] + 6, E[1] + 130 * DIR[1] - 6, 22, "yellow"),
         dashed(*E, E[0] + 430 * DIR[0], E[1] + 430 * DIR[1], "grey"),
         write("2 m", (P[0] + E[0]) / 2, 594, 22, "grey", "center"), write("30°", E[0] - 82, E[1] - 8, 20, "grey"),
         write("d:  pivot to the LINE of the force, at right angles", 70, 200, 23, "yellow"),
         chapter="Why the perpendicular distance"),

    step("Why perpendicular? Picture pushing a door edge on, straight towards the hinge. Push as hard as you like: it will not turn. "
         "A force aimed through the pivot has no turning effect at all.",
         arrow(1120, 630, 800, 630, "pink"),
         write("aimed at the pivot:  moment = 0", 70, 250, 23, "pink")),

    step("So here, the turning part is measured to the dashed line. The perpendicular distance is two sine thirty: one metre. "
         "The moment is fifty times one: fifty newton metres. Not a hundred. Writing a hundred is the most common way to lose this mark.",
         line(*P, *FOOT, "green", 3.0), write("d = 1 m", (P[0] + FOOT[0]) / 2 - 14, (P[1] + FOOT[1]) / 2 + 8, 22, "green", "right"),
         write("d = 2 sin 30° = 1 m;    moment = 50 × 1 = 50 N m", 70, 320, 23, "green"),
         write("(not 50 × 2 = 100)", 70, 358, 22, "pink")),

    # ── 3. The see-saw ────────────────────────────────────────────────
    step("And now the see-saw I promised you. Musa weighs three hundred newtons, and Aminata weighs two hundred. "
         "If they sit at the same distance, Musa's side goes down, and Aminata goes up. Possibly into the trees.",
         clear(2.2),
         heading("The see-saw"),
         *pivot(930, 540), line(640, 540, 1230, 540, "white", 4.0),
         box(718, 480, 64, 60, "blue", 3.0), write("Musa", 750, 468, 20, "blue", "center"),
         box(1175, 500, 50, 40, "pink", 3.0), write("Aminata", 1225, 488, 20, "pink", "right"),
         pause=0.9, chapter="The see-saw and the principle of moments"),

    step("But Aminata has a secret weapon: distance. Musa sits two metres from the pivot. His turning effect is three hundred times two: "
         "six hundred newton metres, anticlockwise.",
         double_arrow(750, 600, 930, 600, "blue", 2.4), write("2 m", 840, 634, 20, "blue", "center"),
         write("Musa (300 N):  300 × 2 = 600 N m  (anticlockwise)", 70, 200, 24, "blue")),

    step("For balance, Aminata's clockwise moment must also be six hundred. Two hundred times d equals six hundred, so d is three metres. "
         "The lighter person balances by sitting further out.",
         double_arrow(930, 600, 1200, 600, "pink", 2.4), write("3 m", 1065, 634, 20, "pink", "center"),
         write("Aminata (200 N):  200 × d = 600,    d = 3 m", 70, 245, 24, "pink")),

    step("That is the principle of moments. When a body is in equilibrium, the sum of the clockwise moments about any point "
         "equals the sum of the anticlockwise moments about that same point.",
         write("In equilibrium:  sum of clockwise moments", 70, 320, 25, "yellow"),
         write("= sum of anticlockwise moments  (about any point)", 70, 358, 25, "yellow")),

    step("And now you know why you should never sit on a see-saw alone. With nothing on the other side, your moment wins, "
         "and you just sit there on the ground, looking lonely.",
         write("(alone on a see-saw:  you lose.  To gravity.)", 70, 420, 22, "grey"),
         pause=1.1),

    # ── 4. Two conditions, and a plank ────────────────────────────────
    step("For a beam with several parallel forces to stay completely still, two things must be true. It must not move up or down, "
         "so the upward forces equal the downward forces. And it must not turn, so the clockwise moments equal the anticlockwise moments.",
         clear(2.2),
         heading("Two conditions"),
         write("1.  upward forces = downward forces    (no sliding)", 70, 190, 24, "yellow"),
         write("2.  clockwise = anticlockwise moments    (no turning)", 70, 230, 24, "yellow"),
         chapter="Equilibrium under parallel forces"),

    step("Here is a classic. A uniform plank, six metres long and weighing four hundred newtons, rests on a support at each end. "
         "A six hundred newton man stands two metres from the left end. How hard does each support push up?",
         line(760, 500, 1200, 500, "white", 5.0), *pivot(760, 504), *pivot(1200, 504),
         *man(907, 496),
         arrow(907, 510, 907, 590, "pink"), write("600 N", 895, 590, 20, "pink", "right"),
         arrow(980, 510, 980, 590, "grey"), write("400 N", 992, 600, 20, "grey"),
         arrow(760, 630, 760, 556, "green"), write("R_A", 748, 640, 22, "green", "right"),
         arrow(1200, 630, 1200, 556, "green"), write("R_B", 1212, 640, 22, "green"),
         write("uniform:  its weight acts at the middle", 70, 300, 22, "grey")),

    step("Here is the clever move: take moments about the left support. Its force passes right through that point, "
         "so its moment is zero, and it simply vanishes from the equation. One unknown left.",
         write("moments about A:  R_A drops out!", 70, 350, 24, "pink")),

    step("Clockwise: six hundred times two, plus four hundred times three. Twenty-four hundred. Anticlockwise: R B times six. "
         "So R B is four hundred newtons.",
         write("6 R_B = 600 × 2 + 400 × 3 = 2400", 70, 400, 23, "green"),
         write("R_B = 400 N", 70, 440, 23, "green")),

    step("Now up equals down. R A plus four hundred equals a thousand, so R A is six hundred. The support nearer the man carries more "
         "of his weight. Which is exactly what your shoulders would tell you, if you were the one carrying the plank.",
         write("R_A + 400 = 1000,    R_A = 600 N", 70, 490, 23, "green"),
         write("(nearer the man:  more of the load)", 70, 530, 22, "grey"),
         pause=0.9),

    # ── 5. Have a go ──────────────────────────────────────────────────
    step("Have a go. A uniform metre rule weighing one newton balances on a knife edge at the fifty centimetre mark. "
         "A two newton weight hangs at the ten centimetre mark. Where must a four newton weight hang, to balance it?",
         clear(2.2),
         heading("Have a go"),
         *stop_sign(1180, 82),
         line(720, 500, 1200, 500, "white", 4.0), *pivot(960, 504),
         *[line(720 + 48 * i, 492, 720 + 48 * i, 508, "grey", 1.8) for i in range(11)],
         write("0", 720, 478, 18, "grey", "center"), write("50", 960, 478, 18, "grey", "center"), write("100", 1200, 478, 18, "grey", "center"),
         line(768, 504, 768, 550, "white", 2.0), box(753, 550, 30, 28, "blue", 2.6), write("2 N", 768, 604, 20, "blue", "center"),
         write("metre rule (1 N) on a knife edge at 50 cm;", 70, 190, 24),
         write("2 N at 10 cm.  Where does 4 N go?", 70, 228, 24, "blue"),
         chapter="Have a go: the metre rule"),

    step("Give it a minute. Pause if you need to.",
         write("give it a minute", 1130, 92, 22, "pink", "right"),
         pause=3.3),

    step("First, the rule's own weight acts at its middle, right on the knife edge. So it has no moment. "
         "The two newtons is forty centimetres from the pivot: eighty newton centimetres, anticlockwise.",
         write("rule's weight at 50 cm:  on the pivot, no moment", 70, 300, 22, "grey"),
         write("2 × (50 - 10) = 80 N cm", 70, 340, 24)),

    step("So four times x equals eighty, and x is twenty centimetres past the pivot: the seventy centimetre mark. "
         "And the knife edge pushes up with all the downward forces together: one, plus two, plus four. Seven newtons.",
         write("4x = 80,  x = 20 cm:  the 70 cm mark", 70, 390, 24, "green"),
         write("knife edge:  1 + 2 + 4 = 7 N up", 70, 430, 24, "green"),
         line(1056, 504, 1056, 550, "white", 2.0), box(1038, 550, 36, 34, "pink", 2.6), write("4 N", 1056, 610, 20, "pink", "center")),

    # ── 6. Couples ────────────────────────────────────────────────────
    step("One last idea: the couple. Turn a steering wheel. One hand pushes up, and the other pulls down: two equal forces, "
         "opposite and parallel, but not in line. Together they do not move the wheel anywhere. They only turn it.",
         clear(2.2),
         heading("Couples"),
         ellipse(990, 380, 130, 130, "white", 3.4), ellipse(990, 380, 12, 12, "grey", 2.4),
         arrow(860, 440, 860, 330, "green"), write("30 N", 845, 330, 22, "green", "right"),
         arrow(1120, 320, 1120, 430, "green"), write("30 N", 1135, 440, 22, "green"),
         double_arrow(860, 540, 1120, 540, "grey", 2.2), write("0.4 m", 990, 575, 20, "grey", "center"),
         chapter="Couples and torque"),

    step("The moment of a couple is one of the forces, times the distance between them. Thirty newtons at each side of a wheel "
         "forty centimetres across: thirty times zero point four. Twelve newton metres. That turning effect is also called torque.",
         write("couple:  moment = F × d   (d: between the forces)", 70, 200, 23, "yellow"),
         write("30 × 0.4 = 12 N m   (the torque)", 70, 245, 25, "green")),

    step("You use couples every day: opening a tap, turning a screwdriver, twisting the top off a bottle.",
         write("taps,  screwdrivers,  bottle tops", 70, 310, 24, "blue")),

    step("So the next time you open a door, notice where your hand goes. You are using the principle of moments, and so was whoever "
         "designed that door. In the next lesson: why some things fall over, and others simply refuse to.",
         write("Next:  why some things fall over", 70, 400, 25, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Moments", 54, 140, 84, "yellow"),
    write("Moment = F × d  ·  The see-saw  ·  Couples", 60, 210, 30),
    *pivot(640, 470), line(260, 470, 1100, 470, "white", 5.0),
    box(380, 400, 80, 70, "blue", 3.4), write("300 N", 420, 386, 28, "blue", "center"),
    box(1000, 420, 60, 50, "pink", 3.4), write("200 N", 1030, 406, 28, "pink", "center"),
    double_arrow(420, 560, 640, 560, "blue", 3.0), write("2 m", 530, 600, 28, "blue", "center"),
    double_arrow(640, 560, 1030, 560, "pink", 3.0), write("3 m", 835, 600, 28, "pink", "center"),
]
