"""Physics · Projectile motion: velocity at any instant, the trajectory equation and air resistance. A chalkboard video lesson.

Follows content/notes/physics-projectile-2.md: the velocity at any moment, drawn
as its two parts on the path (with "which part never changes?" asked); a stone
at 40 m/s and 60°, five seconds on; a ball thrown up from a 35 m building, where
2u sin θ / g no longer works; the equation of the path, and why it is a parabola;
a "your turn" stone thrown at a mango 30 m away; air resistance, drawn against the
ideal path; and a relief plane, with "when should the pilot let go?" asked first.

Check: python3 scripts/video/board_video.py content/videos/physics-projectile-2.py --boards .video-build/boards/proj2
"""

import math

from board_video import arrow, blob, box, clear, curve, dashed, dots, ellipse, equation, heading, line, step, write

TITLE = "Projectile Velocity at Any Instant, the Trajectory Equation and Air Resistance | WASSCE Physics"
DESCRIPTION = ("Harder projectiles on the chalkboard: the velocity at any moment, a ball thrown from a building, proving "
               "the path is a parabola, a stone aimed at a mango to try yourself, what air resistance changes, and when "
               "a plane should drop a package.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Projectiles"
# The lesson page this video is on: /wassce/physics/projectile-motion/projectile-velocity-the-trajectory-equation-and-air-resistance
LESSON = "physics/projectile-motion/projectile-velocity-the-trajectory-equation-and-air-resistance"


def pause_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def path(x0, y0, rng, deg, color="yellow", n=24, drop=0.0, xmax=1235):
    """A projectile's path from (x0, y0) at deg degrees; rng px to where it is back at launch height,
    continued until it has fallen `drop` px below the launch height (or reaches x = xmax)."""
    tan = math.tan(math.radians(deg))
    pts, i = [], 0
    while True:
        x = rng * i / n
        y = y0 - x * tan * (1 - x / rng)
        if x0 + x > xmax:
            return curve(pts, color, 3.0)
        pts.append((x0 + x, y))
        if (i > 0 and y >= y0 + drop) or i > 6 * n:
            return curve(pts, color, 3.0)
        i += 1


def height_at(x0, y0, rng, deg, x):
    tan = math.tan(math.radians(deg))
    d = x - x0
    return y0 - d * tan * (1 - d / rng)


STEPS = [
    # ── 1. Velocity at any moment ─────────────────────────────────────
    step("A football in flight keeps changing direction. So how fast is it going, and which way, at any moment? "
         "Split the velocity into its two parts.",
         heading("Velocity at any moment"),
         line(760, 560, 1240, 560, "grey", 2.4),
         path(780, 560, 440, 50),
         chapter="Velocity at any moment"),

    step("Sideways, it is u cos theta, and that never changes. Upwards, it is u sine theta, minus g t. "
         "Put them back together with Pythagoras, and the angle comes from tan alpha.",
         arrow(1110, height_at(780, 560, 440, 50, 1110), 1180, height_at(780, 560, 440, 50, 1110), "blue"),
         arrow(1110, height_at(780, 560, 440, 50, 1110), 1110, height_at(780, 560, 440, 50, 1110) + 80, "pink"),
         arrow(1110, height_at(780, 560, 440, 50, 1110), 1180, height_at(780, 560, 440, 50, 1110) + 80, "yellow"),
         write("sideways:  u cos θ   (never changes)", 70, 190, 24, "blue"),
         write("upwards:  u sin θ - gt", 70, 230, 24, "pink"),
         equation(["v =", {"root": "(sideways)^2 + (upwards)^2"}], 70, 300, 24, "yellow"),
         equation(["tan α =", ("upwards", "sideways")], 70, 380, 24, "yellow")),

    step("Try one. A stone is thrown at forty metres per second, sixty degrees up. Where is its velocity five seconds later? "
         "Sideways: forty cos sixty, twenty. Upwards: thirty-four point six, minus fifty. Minus fifteen point four: it is coming down.",
         write("40 m s^{-1} at 60°, after 5 s:", 70, 460, 23),
         write("sideways 20;   upwards 34.6 - 50 = -15.4", 70, 496, 23)),

    step("So the speed is the square root of four hundred, plus two hundred and thirty-six: about twenty-five point two metres per second, "
         "at thirty-seven point five degrees below the horizontal.",
         write("v = 25.2 m s^{-1},  37.5° below the horizontal", 70, 545, 23, "green")),

    step("Quick one. During the whole flight, which part of the velocity never changes?",
         write("Quick one:  which part never changes?", 70, 608, 23, "pink"),
         pause=2.2),

    step("The sideways part. Twenty, the whole way, because nothing pushes the ball sideways.",
         write("sideways!", 70, 646, 23, "green")),

    # ── 2. Thrown from a building ─────────────────────────────────────
    step("Now the exam twist. A ball is thrown from the top of a building thirty-five metres high, at thirty metres per second, "
         "thirty degrees up. Careful: it lands lower than it started, so two u sine theta over g will not work here.",
         clear(2.2),
         heading("Thrown from a building"),
         box(780, 380, 80, 220, "white", 3.0), line(760, 600, 1240, 600, "grey", 2.4),
         path(860, 380, 182, 30, drop=220),
         write("35 m", 772, 500, 22, "white", "right"),
         write("30 m s^{-1} at 30°, from 35 m up", 70, 190, 24),
         write("Lands lower:  NOT 2u sin θ / g!", 70, 230, 24, "pink"),
         chapter="Launched above the ground"),

    step("Up is positive, and the ground is at minus thirty-five. Upwards, the ball starts at fifteen. "
         "Minus thirty-five equals fifteen t, minus five t squared.",
         write("u sin θ = 15,   u cos θ = 26", 70, 295, 24),
         write("-35 = 15t - 5t^2,   t^2 - 3t - 7 = 0", 70, 340, 24)),

    step("Use the formula. t equals three, plus the square root of thirty-seven, over two: four point five four seconds. "
         "The other answer is negative. That is the ball's life before it was thrown. We ignore it.",
         equation([{"root": "37"}, "= 6.08,   t =", ("3 + 6.08", "2"), "= 4.54 s"], 70, 420, 24, "green"),
         write("(the negative root: before the throw!)", 70, 482, 21, "grey"),
         pause=0.9),

    step("And in four point five four seconds, at twenty-six metres per second sideways, it lands about a hundred and eighteen metres away.",
         write("x = 26 × 4.54 = 118 m", 70, 545, 26, "green")),

    # ── 3. The path is a parabola ─────────────────────────────────────
    step("Why is the path a parabola? Take the sideways equation, x equals u cos theta, times t, and get t on its own.",
         clear(2.2),
         heading("The path is a parabola"),
         write("x = (u cos θ) t,    so    t = x ÷ (u cos θ)", 70, 200, 26),
         chapter="The equation of the path"),

    step("Put it into the upward equation, and the time disappears. y equals x tan theta, minus g x squared, over two u squared cos squared theta.",
         write("y = (u sin θ) t - gt^2 / 2   becomes", 70, 270, 26),
         equation(["y = x tan θ -", ("g x^2", "2u^2 cos^2 θ")], 70, 360, 30, "yellow")),

    step("That has the shape y equals {a} x minus b x squared: the equation of a parabola. That is the proof. Every projectile, "
         "from a football to a mango stone, traces a parabola.",
         write("y = ax - bx^2:  a parabola", 70, 450, 28, "green")),

    # ── 4. Your turn: the mango ───────────────────────────────────────
    step("Your turn. A boy throws a stone at twenty metres per second, at forty-five degrees, at a mango on a tree thirty metres away, "
         "one point six metres above his hand. Does the stone pass above or below the mango?",
         clear(2.2),
         heading("Your turn"),
         *pause_sign(1180, 82),
         line(1040, 600, 1046, 500, "white", 3.0), line(1080, 600, 1074, 500, "white", 3.0),
         blob(1060, 420, 130, 90, "green", 3.2, seed=5),
         line(1000, 504, 1000, 515, "green", 2.0), ellipse(1000, 528, 10, 13, "yellow", 3.0),
         line(600, 600, 1240, 600, "grey", 2.4),
         ellipse(650, 538, 9, 9, "white", 2.8), line(650, 548, 650, 576, "white", 2.8), line(650, 576, 640, 600, "white", 2.8),
         line(650, 576, 660, 600, "white", 2.8), line(638, 558, 662, 552, "white", 2.8),
         write("20 m s^{-1} at 45°;  a mango 30 m away,", 70, 190, 25),
         write("1.6 m above his hand.  Above or below?", 70, 230, 25, "blue"),
         chapter="Your turn: aim at the mango"),

    step("Pause the video, and use the path equation, with x equal to thirty. I will wait.",
         write("pause and try it", 1130, 92, 22, "pink", "right"),
         pause=3.4),

    step("At x equals thirty: thirty tan forty-five is thirty. Ten times nine hundred, over two times four hundred times a half, "
         "is twenty-two point five. So y is seven point five metres.",
         equation(["y = 30 -", ("10 × 30^2", "2 × 20^2 × 0.5"), "= 30 - 22.5 = 7.5 m"], 70, 320, 25)),

    step("Seven point five metres, against one point six: the stone sails about six metres above the mango. The mango is safe. For now.",
         write("7.5 m > 1.6 m:  about 6 m ABOVE the mango", 70, 410, 25, "green"),
         path(662, 552, 480, 45, "pink", drop=48),
         pause=1.0),

    # ── 5. Real air ───────────────────────────────────────────────────
    step("Everything so far ignored the air. Real air pushes against the motion. The ball goes less high, and less far, "
         "and it comes down more steeply than it went up.",
         clear(2.2),
         heading("Real air"),
         line(760, 300, 1240, 300, "grey", 2.4),
         path(780, 300, 440, 45, "grey"),
         curve([(780, 300), (850, 222), (930, 196), (1000, 210), (1045, 252), (1066, 300)], "yellow", 3.2),
         write("no air", 1150, 200, 20, "grey"), write("real air", 930, 180, 20, "yellow", "center"),
         write("air:  lower,  shorter,  steeper fall", 70, 190, 25),
         chapter="Air resistance and applications"),

    step("So the best angle in real air is less than forty-five degrees: about thirty-five to forty-three for a football. "
         "Watch a long throw-in at a Premier League match: it goes flatter than forty-five.",
         write("best angle:  under 45°  (35° to 43°)", 70, 240, 25, "yellow")),

    step("Last one. A plane flies level at a hundred metres per second, five hundred metres up, carrying a relief package. "
         "Quick one: should the pilot let go right above the target, or before it?",
         write("plane: 100 m s^{-1}, 500 m up.  Let go when?", 70, 330, 24, "pink"),
         pause=2.3),

    step("Before it. The package keeps the plane's speed. It falls for ten seconds, and in that time it moves a thousand metres forward. "
         "So, one kilometre before the target.",
         write("500 = 5t^2,  t = 10 s;   100 × 10 = 1000 m", 70, 380, 24),
         write("Let go 1 km BEFORE the target.", 70, 425, 26, "green")),

    step("In the exam: find the velocity at any time, solve throws from a building with signs, or show that the path is a parabola. "
         "That completes projectiles.",
         write("Exam:  velocity at a time;  launch from a height;  y = ax - bx^2", 70, 520, 21, "pink")),

    step("Next time: Newton's laws. Why does a keke passenger lurch forward when the driver brakes? See you there.",
         write("Next:  Newton's laws of motion", 70, 590, 26, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Projectiles 2", 54, 140, 84, "yellow"),
    write("Velocity  ·  The path  ·  Air resistance", 60, 210, 30),
    line(80, 610, 1240, 610, "grey", 3.0),
    path(100, 610, 700, 45, "grey"),
    curve([(100, 610), (260, 400), (420, 340), (560, 370), (640, 470), (680, 610)], "yellow", 4.0),
    equation(["y = x tan θ -", ("g x^2", "2u^2 cos^2 θ")], 720, 400, 30, "yellow"),
]
