"""Physics · Projectile motion: horizontal launch, time of flight, height and range. A chalkboard video lesson.

Follows content/notes/physics-projectile-1.md: last lesson's cliff question
answered by drawing both stones every half second (they fall together), and the
two-oranges test; a projectile, and its two independent motions sharing only
time; a stone thrown sideways from a cliff (with "twice as fast: longer to land?"
asked first); a "your turn" ball rolling off a table; a goalkeeper's kick at 30°,
resolved, with the formulas; and the best angle, drawn as three kicks, with the
"same range as 25°?" quick question and the not-at-rest-at-the-top trap.

Check: python3 scripts/video/board_video.py content/videos/physics-projectile-1.py --boards .video-build/boards/proj1
"""

import math

from board_video import arrow, box, clear, curve, dashed, dots, ellipse, equation, heading, line, step, write

TITLE = "Projectile Motion: Horizontal Launch, Time of Flight, Maximum Height and Range | WASSCE Physics"
DESCRIPTION = ("Projectiles on the chalkboard: why a stone thrown sideways lands with one dropped, horizontal and vertical "
               "motion, a stone off a cliff, a problem to try yourself, a ball kicked at an angle, and why 45° throws "
               "furthest.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Projectiles"
# The lesson page this video is on: /wassce/physics/projectile-motion/projectiles-horizontal-launch-time-of-flight-height-and-range
LESSON = "physics/projectile-motion/projectiles-horizontal-launch-time-of-flight-height-and-range"


def pause_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def kick(x0, y0, rng, deg, color, n=24):
    """A projectile's path from (x0, y0), landing rng px away, launched at deg degrees."""
    tan = math.tan(math.radians(deg))
    return curve([(x0 + rng * i / n, y0 - rng * i / n * tan * (1 - i / n)) for i in range(n + 1)], color, 3.0)


def fall(x0, y0, dx, dy, color="yellow", n=24):
    """A sideways launch from (x0, y0): it lands dx across and dy down (y grows with time squared)."""
    return curve([(x0 + dx * i / n, y0 + dy * (i / n) ** 2) for i in range(n + 1)], color, 3.0)


# The cliff: the two stones every half second (fall in proportion to time squared).
CX, CTOP, CBOT = 780, 220, 600
TICKS = [(CX + 100 * k, CTOP + (CBOT - CTOP) * (k / 4) ** 2) for k in range(5)]

STEPS = [
    # ── 1. Which lands first? ─────────────────────────────────────────
    step("Last time, I asked you this. Throw one stone sideways off a cliff, and drop another at the same moment. Which lands first?",
         heading("Which lands first?"),
         line(640, CTOP, CX - 12, CTOP, "white", 3.0), line(CX - 12, CTOP, CX - 12, CBOT, "white", 3.0),
         line(CX - 12, CBOT, 1240, CBOT, "grey", 2.4),
         dots([(CX, CTOP - 8)], "yellow", 8),
         write("Thrown sideways, or dropped?", 70, 190, 30, "pink"),
         pause=1.8, chapter="Which lands first?"),

    step("They land together. Look at where the two stones are, every half second. The thrown one moves sideways, "
         "but it falls exactly as far as the dropped one, every time.",
         dots([(CX, y) for _, y in TICKS[1:]], "blue", 7),
         dots([(x, y) for x, y in TICKS[1:]], "yellow", 7),
         curve(TICKS, "yellow", 2.4),
         *[dashed(CX + 10, y, x - 10, y, "grey") for x, y in TICKS[1:]],
         write("They land together.", 70, 260, 28, "green"),
         write("Sideways speed does not delay the fall.", 70, 302, 24)),

    step("Try it at home, with two oranges at the edge of a table. Flick one sideways, and let the other drop. "
         "You will hear one thump, not two.",
         write("Two oranges, one table:  one thump!", 70, 380, 25, "pink"),
         pause=0.9),

    # ── 2. Two motions at once ────────────────────────────────────────
    step("A projectile is anything thrown into the air, that then moves under gravity alone. Its path is a curve called a parabola.",
         clear(2.2),
         heading("Two motions at once"),
         write("projectile:  thrown, then gravity alone", 70, 180, 27),
         write("its path:  a parabola", 70, 222, 27, "yellow"),
         chapter="Two motions at once"),

    step("Here is the secret. Stop looking at the curve, and look at two simple motions happening at once. "
         "Sideways, there is no force, so the velocity never changes. Downwards, there is gravity, so the velocity grows by g every second.",
         write("sideways", 210, 300, 28, "blue", "center"), write("downwards", 760, 300, 28, "pink", "center"),
         line(455, 275, 455, 470, "grey", 2.2),
         write("no force", 210, 350, 25, "blue", "center"), write("its weight", 760, 350, 25, "pink", "center"),
         write("a = 0", 210, 398, 25, "blue", "center"), write("a = g, down", 760, 398, 25, "pink", "center"),
         write("velocity constant", 210, 446, 25, "blue", "center"), write("velocity grows by g each second", 760, 446, 25, "pink", "center")),

    step("They share only one thing: time. Like two students sharing a desk. They ignore each other completely, "
         "but they both leave at the same bell.",
         write("They share only TIME.", 70, 540, 30, "yellow"),
         write("(two students, one desk, the same bell)", 70, 585, 22, "grey"),
         pause=1.0),

    # ── 3. Thrown sideways from a cliff ───────────────────────────────
    step("A stone is thrown sideways at fifteen metres per second, from the top of a cliff forty-five metres high. "
         "Before we calculate: if I threw it twice as fast, would it take longer to land?",
         clear(2.2),
         heading("Thrown off a cliff"),
         line(760, 230, 860, 230, "white", 3.0), line(860, 230, 860, 600, "white", 3.0), line(860, 600, 1240, 600, "grey", 2.4),
         fall(860, 230, 370, 370),
         arrow(868, 210, 940, 210, "yellow"), write("15 m s^{-1}", 950, 214, 20, "yellow"),
         write("45 m", 800, 420, 22, "white", "center"),
         write("15 m s^{-1} sideways, from a 45 m cliff", 70, 190, 25),
         write("Twice as fast: longer to land?", 70, 234, 25, "pink"),
         pause=2.0, chapter="Launched sideways from a height"),

    step("No. The fall only cares about the height. It just lands twice as far away.",
         write("No!  Same fall time; twice as far.", 70, 276, 25, "green")),

    step("So, the time. Forty-five equals a half, times ten, times t squared. t squared is nine, so t is three seconds.",
         equation(["45 =", ("1", "2"), "× 10 × t^2,    t = 3 s"], 70, 355, 26)),

    step("In three seconds, at fifteen metres per second sideways, it lands forty-five metres from the foot of the cliff.",
         write("x = 15 × 3 = 45 m", 70, 430, 26, "yellow"),
         write("45 m", 1050, 630, 22, "yellow", "center")),

    step("And its speed on landing. Sideways, still fifteen. Downwards, g t: thirty. Put them together with Pythagoras: "
         "about thirty-three point five metres per second.",
         write("sideways 15,   downwards 10 × 3 = 30", 70, 495, 24),
         equation(["v =", {"root": "15^2 + 30^2"}, "= 33.5 m s^{-1}"], 70, 560, 26, "green")),

    # ── 4. Your turn ──────────────────────────────────────────────────
    step("Your turn. A ball rolls off a table one point two five metres high, at four metres per second. How far from the table does it land?",
         clear(2.2),
         heading("Your turn"),
         *pause_sign(1180, 82),
         box(840, 420, 220, 18, "white", 2.8), line(860, 438, 860, 600, "white", 2.8), line(1040, 438, 1040, 600, "white", 2.8),
         line(780, 600, 1240, 600, "grey", 2.4), ellipse(1048, 408, 10, 10, "yellow", 2.8),
         arrow(1066, 396, 1120, 396, "yellow"),
         write("A ball rolls off a table 1.25 m high,", 70, 190, 26),
         write("at 4 m s^{-1}.  How far away does it land?", 70, 230, 26, "blue"),
         chapter="Your turn"),

    step("Pause the video, and find the time first. I will wait.",
         write("pause and try it", 1130, 92, 22, "pink", "right"),
         pause=3.2),

    step("One point two five equals five t squared. So t squared is zero point two five, and t is half a second. "
         "Four times a half: two metres.",
         write("1.25 = 5t^2,   t^2 = 0.25,   t = 0.5 s", 70, 320, 26),
         write("x = 4 × 0.5 = 2 m", 70, 370, 28, "green"),
         fall(1058, 418, 160, 182, "green"), write("2 m", 1140, 632, 22, "green", "center")),

    # ── 5. Kicked at an angle ─────────────────────────────────────────
    step("Now a goalkeeper kicks a ball at twenty metres per second, thirty degrees above the ground. "
         "First, split the velocity in two. Sideways: u cos theta. Upwards: u sine theta.",
         clear(2.2),
         heading("Kicked at an angle"),
         arrow(110, 470, 330, 343, "yellow"), write("20 m s^{-1}", 190, 380, 22, "yellow", "right"),
         dashed(110, 470, 330, 470, "blue"), dashed(330, 470, 330, 343, "pink"),
         write("30°", 172, 462, 20, "white"),
         write("u cos θ = 17.3", 220, 506, 22, "blue", "center"), write("u sin θ = 10", 345, 412, 22, "pink"),
         chapter="Launched at an angle"),

    step("Then use the upward part for the time and the height. The time of flight: two times ten, over ten. Two seconds. "
         "The maximum height: ten squared, over twenty. Five metres.",
         equation(["time of flight =", ("2 × 10", "10"), "= 2 s"], 640, 200, 25, "pink"),
         equation(["max height =", ("10^2", "2 × 10"), "= 5 m"], 640, 290, 25, "pink")),

    step("And the range, with the sideways part: seventeen point three, times two seconds. About thirty-four point six metres.",
         write("range = 17.3 × 2 = 34.6 m", 640, 370, 25, "blue")),

    step("As formulas: the time of flight is two u sine theta, over g. The maximum height is u squared sine squared theta, over two g. "
         "And the range is u squared sine two theta, over g.",
         equation(["T =", ("2u sin θ", "g")], 110, 610, 25, "yellow"),
         equation(["H =", ("u^2 sin^2 θ", "2g")], 470, 610, 25, "yellow"),
         equation(["R =", ("u^2 sin 2θ", "g")], 860, 610, 25, "yellow")),

    # ── 6. The best angle ─────────────────────────────────────────────
    step("So which angle throws furthest? Sine two theta is biggest when two theta is ninety degrees. So the best angle is forty-five degrees.",
         clear(2.2),
         heading("The best angle"),
         line(90, 560, 660, 560, "grey", 2.4),
         kick(110, 560, 500, 45, "yellow"), write("45°", 610, 540, 22, "yellow"),
         kick(110, 560, 433, 60, "pink"), kick(110, 560, 433, 30, "blue"),
         write("60°", 300, 360, 22, "pink"), write("30°", 325, 538, 22, "blue", "center"),
         write("best angle:  45°", 720, 200, 30, "yellow"),
         write("(sin 2θ is biggest at 90°)", 720, 242, 22, "grey"),
         chapter="The best angle: 45°"),

    step("Quick one. Which angle gives the same range as twenty-five degrees?",
         write("Quick one:  same range as 25°?", 720, 320, 24, "pink"),
         pause=2.3),

    step("Sixty-five. Angles that add up to ninety give the same range. The steeper one just goes higher, and stays up longer. "
         "Like thirty and sixty here.",
         write("65°:  they add up to 90°", 720, 362, 24, "green")),

    step("And a trap. At the top of its flight, the ball is not at rest. Its upward velocity is zero, but it is still moving sideways, "
         "at u cos theta. If it stopped at the top, footballs would hang in the air, like mangoes waiting to be picked.",
         write("At the top:  not at rest!", 720, 440, 25, "pink"),
         write("still moving sideways at u cos θ", 720, 478, 23, "pink"),
         pause=1.0),

    step("In the exam, resolve the velocity first, and keep the sideways and the upward working in two separate columns.",
         write("Exam:  resolve first, two columns.", 720, 548, 22, "green")),

    step("Next time: the velocity at any moment, the equation of the path, and what the air does to a football.",
         write("Next:  velocity, the path, and air", 720, 610, 22, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Projectiles", 54, 140, 84, "yellow"),
    write("Time of flight  ·  Height  ·  Range  ·  45°", 60, 210, 30),
    line(80, 600, 760, 600, "grey", 3.0),
    kick(100, 600, 600, 45, "yellow"), kick(100, 600, 520, 60, "pink"), kick(100, 600, 520, 30, "blue"),
    write("45°", 700, 580, 30, "yellow"),
    line(880, 300, 980, 300, "white", 3.0), line(980, 300, 980, 600, "white", 3.0), line(980, 600, 1240, 600, "grey", 3.0),
    dots([(990 + 70 * k, 300 + 300 * (k / 3) ** 2) for k in range(4)], "yellow", 8),
    dots([(990, 300 + 300 * (k / 3) ** 2) for k in range(1, 4)], "blue", 8),
    *[dashed(1000, 300 + 300 * (k / 3) ** 2, 980 + 70 * k, 300 + 300 * (k / 3) ** 2, "grey") for k in range(1, 4)],
    write("together!", 1110, 262, 30, "green", "center"),
]
