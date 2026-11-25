"""Physics · Motion under gravity: harder vertical motion problems and measuring g. A chalkboard video lesson.

Follows content/notes/physics-gravity-motion-2.md: one rule (an origin, a positive
direction, a sign for everything); a stone thrown up from a roof, with the
negative time that means nothing; a sandbag released from a rising balloon (the
trick question: which way is it moving?) and a bolt from a lift as a quick
question; two balls meeting, where gravity cancels; and measuring g with a
simple pendulum: method, why twenty swings, the T-squared graph and precautions.

Check: python3 scripts/video/board_video.py content/videos/physics-gravity-motion-2.py --boards .video-build/boards/grav2
"""

from board_video import arrow, box, clear, curve, dashed, dots, double_arrow, ellipse, equation, heading, line, step, write

TITLE = "Harder Free Fall Problems: Thrown from a Height, Balloons, Meeting Balls and Measuring g | WASSCE Physics"
DESCRIPTION = ("Harder vertical motion on the chalkboard: a stone thrown up from a roof, a sandbag released from a rising "
               "balloon, two balls meeting in mid-air, and measuring g with a simple pendulum, with the precautions that "
               "earn marks.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Motion under gravity"
# The lesson page this video is on: /wassce/physics/motion-under-gravity/harder-vertical-motion-problems-and-measuring-g
LESSON = "physics/motion-under-gravity/harder-vertical-motion-problems-and-measuring-g"


def person(x, feet, color="white"):
    """A stick figure standing with its feet at y = feet."""
    return [ellipse(x, feet - 62, 9, 9, color, 2.8), line(x, feet - 52, x, feet - 24, color, 2.8),
            line(x, feet - 24, x - 10, feet, color, 2.8), line(x, feet - 24, x + 10, feet, color, 2.8),
            line(x - 12, feet - 42, x + 12, feet - 42, color, 2.8)]


def balloon(x, y):
    """A hot-air balloon: envelope, ropes and basket; y is the basket's bottom."""
    return [ellipse(x, y - 150, 60, 72, "pink", 3.2), line(x - 40, y - 98, x - 16, y - 38, "white", 2.2),
            line(x + 40, y - 98, x + 16, y - 38, "white", 2.2), box(x - 20, y - 38, 40, 38, "white", 2.8)]


STEPS = [
    # ── 1. One rule, and a stone from a roof ──────────────────────────
    step("Today's problems look harder: a stone thrown from a roof, a sandbag from a balloon, two balls meeting in mid-air. "
         "But one rule solves them all.",
         heading("One rule for every throw"),
         chapter="One rule, and a stone from a roof"),

    step("Choose an origin, and a positive direction. Then give every displacement, velocity and acceleration its sign. Every one. Every time.",
         write("Choose an origin and a + direction;", 70, 190, 27, "yellow"),
         write("give every quantity its sign.", 70, 230, 27, "yellow")),

    step("A boy on a roof twenty-five metres high throws a stone straight up, at twenty metres per second. "
         "It just misses the roof on the way down. How high does it go, and when does it hit the ground?",
         line(760, 600, 1240, 600, "grey", 2.4),
         box(860, 375, 150, 225, "white", 3.0),
         *person(900, 375),
         arrow(930, 330, 930, 200, "yellow"), write("20 m s^{-1}", 918, 262, 20, "yellow", "right"),
         curve([(940, 196), (975, 170), (1040, 230), (1060, 400), (1068, 594)], "yellow", 2.6),
         double_arrow(1140, 377, 1140, 598, "white", 2.4), write("25 m", 1155, 495, 22),
         write("roof = origin,   up = +", 70, 300, 24, "blue")),

    step("Up is positive, and the roof is the origin. The highest point above the roof: u squared over two g. "
         "Four hundred over twenty: twenty metres. So forty-five metres above the ground.",
         equation(["H =", ("u^2", "2g"), "=", ("400", "20"), "= 20 m"], 70, 375, 24),
         write("so 45 m above the ground", 70, 432, 24, "green")),

    step("Now the ground. It is twenty-five metres below the roof, so s is minus twenty-five. "
         "Minus twenty-five equals twenty t, minus five t squared.",
         write("-25 = 20t - 5t^2", 70, 486, 25),
         write("t^2 - 4t - 5 = 0,  (t - 5)(t + 1) = 0", 70, 528, 24)),

    step("That gives t equals five seconds, or minus one. Minus one second means nothing here. Time does not run backwards, not even in physics.",
         write("t = 5 s    (t = -1: no meaning)", 70, 576, 25, "green"),
         pause=0.9),

    step("And the speed on landing: v equals u minus g t. Twenty minus fifty: minus thirty. Thirty metres per second, downwards.",
         write("v = 20 - 50 = -30:  30 m s^{-1} down", 70, 624, 24, "green")),

    step("The commonest mistake is writing plus twenty-five, for a point below you. With up as positive, below the origin is negative. Always.",
         clear(2.0),
         heading("The commonest mistake"),
         write("A point below the origin, with up as +:", 70, 200, 28),
         write("s = -25,  not +25.", 70, 250, 34, "pink")),

    # ── 2. Released from something moving ─────────────────────────────
    step("Now, a balloon is rising steadily at five metres per second. Thirty metres up, a sandbag is released. "
         "Here is the trick question: at the moment it is let go, which way is the sandbag moving?",
         clear(2.2),
         heading("Released from something moving"),
         line(760, 610, 1240, 610, "grey", 2.4),
         *balloon(990, 330), box(980, 344, 20, 18, "yellow", 2.6),
         arrow(1100, 320, 1100, 220, "white"), write("5 m s^{-1}", 1115, 265, 20),
         double_arrow(880, 362, 880, 608, "white", 2.4), write("30 m", 868, 495, 22, "white", "right"),
         write("Which way is the sandbag moving?", 70, 190, 26, "pink"),
         pause=1.8, chapter="Released from a balloon or a lift"),

    step("Upwards, at five metres per second. It was moving with the balloon, so it starts with the balloon's velocity. "
         "It rises a little, stops, and then falls.",
         write("Upwards at 5 m s^{-1}: the balloon's velocity", 70, 240, 23, "green"),
         curve([(1004, 364), (1022, 338), (1036, 354), (1042, 604)], "yellow", 2.4)),

    step("Up positive, ground at minus thirty. Minus thirty equals five t, minus five t squared. "
         "That gives t minus three, times t plus two. So three seconds.",
         write("-30 = 5t - 5t^2,   t^2 - t - 6 = 0", 70, 320, 26),
         write("(t - 3)(t + 2) = 0,    t = 3 s", 70, 364, 26, "green")),

    step("Quick one. A lift is going up at two metres per second, and a bolt falls from its ceiling. What is the bolt's starting velocity?",
         write("Quick one:  a lift rises at 2 m s^{-1}; a bolt falls.", 70, 450, 23, "pink"),
         write("Its starting velocity?", 70, 486, 23, "pink"),
         pause=2.3),

    step("Two metres per second, upwards. Same rule: it starts with the velocity of whatever it left.",
         write("2 m s^{-1} upwards:  the same rule", 70, 535, 24, "green")),

    # ── 3. Two balls meeting ──────────────────────────────────────────
    step("Ball A is dropped from the top of a tower eighty metres high. At the same moment, ball B is thrown straight up from the bottom, "
         "at forty metres per second. When, and where, do they meet?",
         clear(2.2),
         heading("Two balls meet"),
         line(820, 610, 1240, 610, "grey", 2.4),
         box(960, 210, 70, 400, "white", 3.0),
         dots([(1060, 222)], "yellow", 9), write("A", 1078, 230, 22, "yellow"),
         dots([(1100, 596)], "blue", 9), write("B", 1118, 604, 22, "blue"), arrow(1100, 580, 1100, 500, "blue"),
         double_arrow(900, 212, 900, 608, "white", 2.4), write("80 m", 888, 340, 22, "white", "right"),
         write("A: dropped from 80 m.   B: up at 40 m s^{-1}.", 70, 190, 24),
         chapter="Two bodies meeting"),

    step("Measure heights from the ground. Ball A is at eighty, minus five t squared. Ball B is at forty t, minus five t squared.",
         write("A:  h = 80 - 5t^2", 70, 260, 27, "yellow"),
         write("B:  h = 40t - 5t^2", 70, 305, 27, "blue")),

    step("They meet when the heights are equal. And look: the five t squareds cancel. Forty t equals eighty, so t is two seconds. "
         "The height: eighty minus twenty, sixty metres.",
         write("80 - 5t^2 = 40t - 5t^2", 70, 380, 27),
         write("40t = 80,   t = 2 s,   h = 60 m", 70, 425, 27, "green"),
         dashed(910, 450, 1240, 450, "pink"), write("meet: 60 m", 1240, 440, 20, "pink", "right")),

    step("Why did gravity vanish? Both balls fall with the same g, so gravity cannot change the gap between them. "
         "It closes at a steady forty metres per second. Gravity treats them both exactly the same. Very fair. Unlike some teachers.",
         write("same g for both:  the gap closes at 40 m s^{-1}", 70, 505, 24, "pink"),
         pause=1.1),

    # ── 4. Measuring g: the pendulum ──────────────────────────────────
    step("Finally, the practical. To measure g, hang a small heavy bob on a thread, from a split cork in a clamp. "
         "Measure the length, l, from the point of suspension to the centre of the bob.",
         clear(2.2),
         heading("Measuring g: the pendulum"),
         line(900, 170, 1120, 170, "white", 3.2), box(990, 170, 40, 22, "grey", 2.4),
         line(1010, 192, 1010, 440, "white", 2.2), ellipse(1010, 456, 16, 16, "yellow", 3.2),
         double_arrow(1070, 192, 1070, 456, "blue", 2.2), write("l", 1084, 330, 26, "blue"),
         write("bob on a thread, from a split cork", 70, 190, 24),
         write("l: suspension to the centre of the bob", 70, 228, 24),
         chapter="Measuring g with a pendulum"),

    step("Pull it aside through a small angle, less than ten degrees, and let go. Time twenty oscillations, and divide by twenty to get the period, T.",
         line(1010, 192, 950, 432, "grey", 1.8), dashed(950, 432, 1070, 432, "grey"),
         write("small angle (under 10°); time 20 swings;  T = t ÷ 20", 70, 280, 23)),

    step("Quick one. Why time twenty swings, and not just one?",
         write("Why 20 swings, not 1?", 70, 340, 24, "pink"),
         pause=2.2),

    step("Because your reaction time is in every timing. Spread over twenty swings, that small error almost disappears.",
         write("reaction time is shared out over 20 swings", 70, 380, 24, "green")),

    step("Do it for five or six lengths. Plot T squared against l. You get a straight line through the origin, "
         "and g is four pi squared, over the gradient.",
         arrow(110, 610, 450, 610, "white", 2.6), arrow(110, 610, 110, 495, "white", 2.6),
         write("l", 455, 630, 20, "grey"), write("T^2", 122, 511, 20, "grey"),
         line(110, 610, 420, 505, "yellow", 3.0),
         equation(["g =", ("4π^2", "gradient")], 520, 560, 30, "yellow")),

    step("And for the precaution marks: a small angle, start timing as the bob swings through the middle, where it moves fastest, "
         "and keep out the draughts. Do not let the bob spin, either. A spinning bob is having more fun than you, and ruining your results.",
         write("precautions:  small angle;  time from the middle;", 70, 424, 22, "pink"),
         write("no draughts;  no spinning", 70, 456, 22, "pink"),
         pause=1.0),

    step("Next time: projectiles. Throw a stone sideways off a cliff, and drop another at the same moment. Which lands first? "
         "The answer will surprise you.",
         write("Next:  projectiles", 900, 560, 24, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Harder Free Fall", 54, 140, 80, "yellow"),
    write("Thrown from a roof  ·  Balloons  ·  Meeting balls  ·  g", 60, 210, 28),
    *balloon(260, 520), box(250, 534, 20, 18, "yellow", 2.6), arrow(360, 500, 360, 390, "white"),
    line(560, 260, 820, 260, "white", 3.2), line(690, 260, 690, 520, "white", 2.4), ellipse(690, 538, 18, 18, "yellow", 3.2),
    line(690, 260, 620, 510, "grey", 2.0),
    equation(["g =", ("4π^2", "gradient")], 860, 430, 44, "yellow"),
]
