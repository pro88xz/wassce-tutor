"""Physics · Motion under gravity: free fall, bodies dropped and thrown upwards. A chalkboard video lesson.

Follows content/notes/physics-gravity-motion-1.md: a mango and a leaf (which lands
first?), the stone and the crumpled paper, and the hammer and feather on the Moon;
free fall and g, the same for every mass and always downwards; a coconut dropped
20 m; a ball thrown up, its velocity-time graph one straight line, and the
acceleration at the top as a quick question; the three results to learn; a
"your turn" throw; and terminal velocity, with skydivers and raindrops.

"{a}" in a line is the letter A said as a letter (see board_video.shown).
Check: python3 scripts/video/board_video.py content/videos/physics-gravity-motion-1.py --boards .video-build/boards/grav1
"""

from board_video import arrow, blob, clear, curve, dashed, double_arrow, ellipse, equation, heading, line, step, write

TITLE = "Free Fall: Acceleration Due to Gravity, Bodies Dropped and Thrown Upwards | WASSCE Physics"
DESCRIPTION = ("Motion under gravity on the chalkboard: why a mango beats a leaf, free fall and g, a coconut dropped "
               "from a palm, a ball thrown straight up and its velocity-time graph, maximum height and time of flight, "
               "and terminal velocity.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Motion under gravity"
# The lesson page this video is on: /wassce/physics/motion-under-gravity/free-fall-bodies-dropped-and-thrown-upwards
LESSON = "physics/motion-under-gravity/free-fall-bodies-dropped-and-thrown-upwards"


def axes(x0, y0, w, h, xl, yl):
    return [arrow(x0, y0, x0 + w, y0, "white", 3.0), arrow(x0, y0, x0, y0 - h, "white", 3.0),
            write(xl, x0 + w, y0 + 34, 20, "grey", "right"), write(yl, x0 + 14, y0 - h + 14, 20, "grey")]


def pause_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def mango_tree(x, ground):
    """A mango tree: trunk, a leafy crown, and a mango hanging under it."""
    return [line(x - 20, ground, x - 16, ground - 210, "white", 3.2), line(x + 20, ground, x + 16, ground - 210, "white", 3.2),
            blob(x, ground - 300, 170, 105, "green", 3.4, seed=3),
            line(x - 60, ground - 205, x - 60, ground - 188, "green", 2.2), ellipse(x - 60, ground - 172, 11, 16, "yellow", 3.0)]


def palm(x, ground, top):
    """A coconut palm, with a coconut at the top."""
    return [curve([(x, ground), (x - 12, (ground + top) / 2 + 60), (x + 6, top + 60), (x, top)], "white", 3.2),
            curve([(x, top), (x - 60, top - 8), (x - 105, top + 28)], "green", 3.0),
            curve([(x, top), (x + 62, top - 12), (x + 110, top + 22)], "green", 3.0),
            curve([(x, top), (x - 45, top - 45), (x - 80, top - 52)], "green", 3.0),
            curve([(x, top), (x + 45, top - 48), (x + 85, top - 50)], "green", 3.0),
            ellipse(x + 14, top + 16, 10, 10, "yellow", 3.0)]


STEPS = [
    # ── 1. Which lands first? ─────────────────────────────────────────
    step("Last time, I promised you mangoes. Here they are. A mango and a leaf fall from the same tree, at the same moment. "
         "Which lands first?",
         heading("Which lands first?"),
         line(700, 600, 1240, 600, "grey", 2.4),
         *mango_tree(1000, 600),
         curve([(1080, 360), (1060, 380), (1090, 400), (1065, 420)], "green", 2.6),
         write("leaf", 1100, 392, 20, "green"),
         write("A mango or a leaf?", 70, 190, 32, "pink"),
         pause=1.6, chapter="Which lands first?"),

    step("The mango, of course. But not because it is heavier. The air pushes up on the broad, light leaf, and slows it down.",
         dashed(940, 446, 940, 590, "yellow"),
         write("the mango: but not because it is heavier", 70, 250, 24),
         write("the air holds up the leaf", 70, 290, 24, "green")),

    step("Try this at home. Drop a stone and a flat sheet of paper: the stone wins. "
         "Now crumple the paper into a tight ball, and drop them again. They land together.",
         write("stone v flat paper:  the stone wins", 70, 360, 24),
         write("stone v crumpled paper:  a tie!", 70, 400, 24, "yellow")),

    step("Without air, everything falls with the same acceleration. On the Moon, an astronaut dropped a hammer and a feather together. "
         "They landed at the same moment.",
         write("no air:  everything falls together", 70, 480, 26, "green"),
         write("(a hammer and a feather, on the Moon)", 70, 520, 22, "grey")),

    # ── 2. Free fall and g ────────────────────────────────────────────
    step("A body is in free fall when the only force on it is its weight. It then falls with a constant acceleration, "
         "called the acceleration due to gravity: g.",
         clear(2.2),
         heading("Free fall"),
         write("free fall:  only its weight acts", 70, 190, 28),
         chapter="Free fall and g"),

    step("Near the Earth, g is about nine point eight metres per second squared. Most exam questions say: take g as ten. "
         "Use whatever the question gives you.",
         write("g = 9.8 m s^{-2}     (exam: \"take g = 10\")", 70, 245, 28, "yellow")),

    step("Two facts to hold on to. g is the same for every mass. And g always points down, even while the body is moving up.",
         write("same for every mass", 100, 320, 26, "blue"),
         write("always downwards, even on the way up", 100, 362, 26, "blue")),

    step("So why does a heavy body not fall faster? Its weight is bigger, but so is the mass it has to move. "
         "The two cancel: {a} equals m g over m, which is just g.",
         equation(["a =", ("mg", "m"), "= g"], 70, 460, 32, "green"),
         write("bigger pull, but more to move", 400, 458, 24, "grey")),

    # ── 3. Dropped from rest ──────────────────────────────────────────
    step("A coconut falls from rest, from the top of a palm tree twenty metres high. How long does it take to land, "
         "and how fast is it going? Take downwards as positive.",
         clear(2.2),
         heading("Dropped from rest"),
         line(800, 600, 1240, 600, "grey", 2.4),
         *palm(960, 600, 200),
         double_arrow(1130, 215, 1130, 598, "white", 2.6), write("20 m", 1145, 415, 24),
         write("u = 0,   h = 20 m,   g = 10 m s^{-2}  (down +)", 70, 190, 24, "yellow"),
         chapter="A body dropped from rest"),

    step("h equals a half g t squared. Twenty equals five t squared, so t is two seconds.",
         equation(["h =", ("1", "2"), "gt^2:    20 = 5t^2,    t = 2 s"], 70, 280, 27)),

    step("Its speed on landing: v equals g t. Ten times two: twenty metres per second. That is seventy-two kilometres per hour.",
         write("v = gt = 10 × 2 = 20 m s^{-1}", 70, 365, 27, "green"),
         write("(72 km/h!)", 70, 405, 24, "pink")),

    step("Which is why you should never sit under a coconut tree to study. Not even for physics.",
         write("Study somewhere else.", 70, 480, 26, "grey"),
         pause=1.1),

    # ── 4. Thrown upwards ─────────────────────────────────────────────
    step("Now throw a ball straight up at thirty metres per second, and take up as positive. Its velocity falls steadily: "
         "thirty, twenty, ten, zero at the top, then negative as it comes back down.",
         clear(2.2),
         heading("Thrown upwards"),
         *axes(110, 400, 515, 220, "t / s", "v / m s^{-1}"),
         line(110, 400, 110, 590, "white", 3.0),
         line(110, 220, 530, 580, "yellow", 3.4),
         write("+30", 94, 228, 22, "grey", "right"), write("-30", 94, 588, 22, "grey", "right"),
         dashed(110, 580, 530, 580), dashed(530, 400, 530, 580),
         write("top", 320, 388, 20, "pink", "center"), write("3", 320, 430, 20, "grey", "center"), write("6", 518, 430, 20, "grey", "right"),
         chapter="A body thrown upwards"),

    step("On a velocity-time graph, that is one straight line, crossing the time axis at the top. Not a V shape. "
         "Its gradient is minus g, all the way up and all the way down.",
         write("one straight line, not a V", 140, 640, 24, "pink")),

    step("Quick one. At the very top, the velocity is zero. So what is the acceleration?",
         write("Quick one:  at the top, a = ?", 640, 200, 24, "pink"),
         pause=2.4),

    step("g, downwards. Still ten. If the acceleration were zero at the top, the ball would stay up there forever. "
         "Lovely for the ball. Terrible for physics.",
         write("a = g, downwards  (still 10!)", 640, 245, 24, "green"),
         pause=1.0),

    step("Set v to zero, and you get three results to learn. Time to the top: u over g. Maximum height: u squared over two g. "
         "And the time of flight: two u over g.",
         equation(["time to top =", ("u", "g")], 640, 335, 26, "yellow"),
         equation(["max height =", ("u^2", "2g")], 640, 420, 26, "yellow"),
         equation(["time of flight =", ("2u", "g")], 640, 505, 26, "yellow")),

    # ── 5. Your turn ──────────────────────────────────────────────────
    step("Your turn. A ball is thrown straight up at twenty metres per second. Find its maximum height, the time it takes to come back, "
         "and its velocity after three seconds.",
         clear(2.2),
         heading("Your turn"),
         *pause_sign(1180, 82),
         write("A ball is thrown straight up at 20 m s^{-1}.  (g = 10)", 70, 190, 26),
         write("Find:  the maximum height,  the time of flight,", 70, 232, 26, "blue"),
         write("and its velocity after 3 s.", 70, 272, 26, "blue"),
         chapter="Your turn"),

    step("Pause the video, and try all three. I will wait.",
         write("pause and try it", 1130, 92, 22, "pink", "right"),
         pause=3.4),

    step("Maximum height: twenty squared, over twenty. Twenty metres. Time of flight: two times twenty, over ten. Four seconds.",
         equation(["H =", ("20^2", "2 × 10"), "= 20 m"], 70, 360, 27, "green"),
         equation(["T =", ("2 × 20", "10"), "= 4 s"], 520, 360, 27, "green")),

    step("And after three seconds: v equals u minus g t. Twenty minus thirty: minus ten metres per second.",
         write("v = u - gt = 20 - 30 = -10 m s^{-1}", 70, 450, 27, "green")),

    step("The minus sign is not a mistake. It means the ball is on its way back down. Possibly towards your head.",
         write("minus = moving downwards  (duck!)", 70, 500, 25, "pink"),
         pause=1.0),

    # ── 6. Terminal velocity ──────────────────────────────────────────
    step("In real air, a falling body feels air resistance, and it grows as the body speeds up. "
         "Soon it equals the weight. The forces balance, and the body falls at a steady speed: its terminal velocity.",
         clear(2.2),
         heading("Terminal velocity"),
         ellipse(980, 340, 26, 34, "blue", 3.2),
         arrow(980, 380, 980, 500, "pink"), write("weight", 996, 470, 22, "pink"),
         arrow(980, 300, 980, 190, "green"), write("air resistance", 996, 210, 22, "green"),
         write("air resistance grows with speed;", 70, 190, 24),
         write("when it equals the weight: steady speed", 70, 228, 24),
         write("= terminal velocity", 70, 268, 26, "yellow"),
         chapter="Air resistance and terminal velocity"),

    step("A skydiver reaches about fifty-five metres per second. Open the parachute, and that drops to about five.",
         write("skydiver:  about 55 m s^{-1};   parachute open:  about 5", 70, 345, 23)),

    step("And raindrops. Falling a kilometre with no air, they would hit you at about a hundred and forty metres per second. "
         "Thanks to the air, they arrive at a few metres per second. So in the rainy season, you get wet, not hurt.",
         write("raindrops:  140 m s^{-1} with no air;  a few m s^{-1} with it", 70, 400, 23),
         write("wet, not hurt", 70, 440, 24, "green"),
         pause=1.0),

    step("In the exam: state your sign convention first. And remember the favourite question: at the highest point, "
         "the acceleration is g, downwards.",
         write("Exam:  say which way is +.   At the top:  a = g, down.", 70, 530, 24, "pink")),

    step("Next time: a stone thrown from a roof, a sandbag dropped from a rising balloon, and how to measure g yourself.",
         write("Next:  harder throws, and measuring g", 70, 600, 24, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Free Fall", 54, 140, 84, "yellow"),
    write("g  ·  Dropped  ·  Thrown up  ·  Terminal velocity", 60, 210, 28),
    line(640, 640, 1240, 640, "grey", 3.0),
    *mango_tree(1000, 640),
    dashed(940, 486, 940, 630, "yellow"),
    write("Which lands first?", 54, 330, 46, "pink"),
    equation(["a =", ("mg", "m"), "= g"], 70, 470, 52, "green"),
]
