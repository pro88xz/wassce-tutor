"""Physics · Motion in a straight line: distance, displacement, speed, velocity and acceleration. A chalkboard video lesson.

Follows content/notes/physics-motion-line-1.md: motion relative to a reference
point, with a sign for direction; distance and displacement (a walk to a shop,
a lap of the National Stadium track); average speed and average velocity, with
a "your turn" problem; changing km/h to m/s, with a quick question; acceleration
and deceleration (an okada, and a goat); scalars and vectors in the exam.

The teacher talks to the student: questions with time to think, a problem to
try before the answer, and a little humour, each joke given a beat to land.
Check: python3 scripts/video/board_video.py content/videos/physics-motion-line-1.py --boards .video-build/boards/motion1
"""

from board_video import arrow, box, clear, dots, double_arrow, ellipse, equation, heading, line, step, write

TITLE = "Distance vs Displacement, Speed vs Velocity and Acceleration | WASSCE Physics"
DESCRIPTION = ("Motion in a straight line on the chalkboard: distance and displacement, average speed and average "
               "velocity, changing km/h to m/s, and acceleration and deceleration, with a problem to try yourself "
               "and the exam traps explained.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Motion"
# The lesson page this video is on: /wassce/physics/motion-in-a-straight-line/distance-displacement-speed-velocity-and-acceleration
LESSON = "physics/motion-in-a-straight-line/distance-displacement-speed-velocity-and-acceleration"


def poda(x, y, s=1.0):
    """A poda-poda (minibus) on the road, with speed lines behind it."""
    out = [box(x, y, 320 * s, 100 * s, "white", 3.2)]
    out += [box(x + (20 + 72 * i) * s, y + 15 * s, 56 * s, 38 * s, "grey", 2.4) for i in range(4)]
    out += [ellipse(x + 70 * s, y + 107 * s, 20 * s, 20 * s, "white", 3.0), ellipse(x + 260 * s, y + 107 * s, 20 * s, 20 * s, "white", 3.0)]
    out += [line(x - 55 * s, y + yy * s, x - 15 * s, y + yy * s, "grey", 2.2) for yy in (25, 47, 69)]
    return out


def pause_sign(cx, cy, color="pink"):
    """The pause button: stop the video and try it."""
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def track(cx, cy, s=1.0, lap=True):
    """A running track seen from above; the lap is traced in pink from the start line."""
    out = [ellipse(cx, cy, 280 * s, 150 * s, "white", 3.0), ellipse(cx, cy, 190 * s, 80 * s, "grey", 2.4),
           line(cx, cy - 150 * s, cx, cy - 80 * s, "white", 3.0)]
    if lap:
        out.append(ellipse(cx, cy, 235 * s, 115 * s, "pink", 3.2, start=-1.5708))
    return out


X0 = 450   # the number line's zero; 50 px to a metre

STEPS = [
    # ── 1. Describing motion ──────────────────────────────────────────
    step("Here is a question to start us off. You are sitting perfectly still in a poda-poda, racing along Wilkinson Road. "
         "Are you moving?",
         heading("Describing motion"),
         *poda(840, 165),
         line(760, 300, 1230, 300, "grey", 2.4),
         write("you", 948, 206, 18, "pink", "center"),
         write("Are you moving?", 70, 190, 32, "pink"),
         pause=1.6, chapter="Are you moving? Describing motion"),

    step("Well, it depends who you ask. To the driver, you have not moved at all. "
         "To the lady selling oranges by the road, you just flew past her.",
         write("to the driver:  not moving", 70, 250, 24),
         write("to the orange seller:  moving", 70, 290, 24),
         pause=0.8),

    step("So motion is always measured from a reference point. A body is moving when its position changes, compared with that point.",
         write("motion:  position changes, compared with a reference point", 70, 370, 25, "yellow")),

    step("On a straight road, we choose one direction as positive. Let us say east. "
         "Then plus twelve metres means twelve metres east of the reference point, and minus five metres means five metres west.",
         double_arrow(150, 470, 1170, 470, "white", 3.0),
         *[line(X0 + 50 * m, 462, X0 + 50 * m, 478, "grey", 2.0) for m in range(-5, 13)],
         write("0", X0, 445, 24, "white", "center"), write("reference point", X0, 510, 20, "grey", "center"),
         dots([(X0 + 600, 470)], "yellow", 8), write("+12 m", X0 + 600, 445, 24, "yellow", "center"),
         write("12 m east", X0 + 600, 510, 20, "yellow", "center"),
         dots([(X0 - 250, 470)], "pink", 8), write("-5 m", X0 - 250, 445, 24, "pink", "center"),
         write("5 m west", X0 - 250, 510, 20, "pink", "center"),
         write("east is +", 1170, 548, 20, "grey", "right")),

    step("The sign tells you the direction. The number tells you the size. Hold on to that: it will save you marks all through this topic.",
         write("sign = direction,    number = size", 70, 612, 26, "green")),

    # ── 2. Distance and displacement ──────────────────────────────────
    step("Now, two words that students mix up all the time. Distance is the total length of the path you travel. "
         "It has size only, so it is a scalar.",
         clear(2.2),
         heading("Distance and displacement"),
         write("distance:  the whole path travelled    (scalar)", 70, 178, 25),
         chapter="Distance and displacement"),

    step("Displacement is the straight line from where you started to where you finished, in a stated direction. So it is a vector.",
         write("displacement:  start to finish, with a direction    (vector)", 70, 220, 25, "yellow")),

    step("A student walks three hundred metres east to a shop. Then she spots her physics teacher, and walks one hundred metres back the way she came. "
         "I am trying not to take that personally.",
         line(100, 340, 1180, 340, "grey", 2.4),
         dots([(180, 340)], "white", 7), write("start", 180, 378, 20, "grey", "center"),
         arrow(180, 312, 868, 312, "yellow"), write("300 m east", 520, 296, 22, "yellow", "center"),
         box(880, 296, 50, 42, "white", 2.6), line(874, 296, 905, 274, "white", 2.6), line(905, 274, 936, 296, "white", 2.6),
         write("shop", 905, 262, 20, "grey", "center"),
         arrow(900, 364, 664, 364, "pink"), write("100 m west", 782, 398, 22, "pink", "center"),
         dots([(660, 340)], "pink", 7), write("finish", 610, 398, 20, "pink", "right"),
         pause=1.0),

    step("Distance: three hundred plus one hundred, four hundred metres. "
         "Displacement: plus three hundred, minus one hundred. Two hundred metres east of where she started.",
         write("distance = 300 + 100 = 400 m", 70, 490, 26),
         write("displacement = +300 - 100 = +200 m    (200 m east)", 70, 538, 26, "yellow")),

    step("Here is the classic exam trap. A runner does one full lap of the National Stadium track: four hundred metres. "
         "She stops exactly where she started.",
         clear(2.2),
         heading("One lap of the track"),
         *track(900, 380),
         dots([(900, 265)], "yellow", 8), write("start = finish", 900, 214, 22, "yellow", "center"),
         write("distance = 400 m", 70, 260, 28)),

    step("Her distance is four hundred metres. Her displacement? Zero.",
         write("displacement = 0", 70, 322, 28, "yellow"),
         pause=0.7),

    step("All that sweat, and physics says she went nowhere.",
         write("(all that sweat!)", 70, 366, 22, "grey"),
         pause=1.1),

    step("So never write that she travelled zero metres. Zero is her displacement, not her distance. "
         "Distance is never negative. Displacement can be positive, negative, or zero.",
         write("Never write: \"she travelled 0 m\".", 70, 592, 24, "pink"),
         write("Distance is never negative; displacement can be +, - or 0.", 70, 630, 24, "pink")),

    # ── 3. Speed and velocity ─────────────────────────────────────────
    step("Speed and velocity work the same way. Average speed is total distance over total time. "
         "Average velocity is displacement over time taken. Both are measured in metres per second.",
         clear(2.2),
         heading("Speed and velocity"),
         equation(["average speed =", ("total distance", "total time")], 70, 212, 28),
         equation(["average velocity =", ("displacement", "time taken")], 70, 322, 28, "yellow"),
         write("both in m s^{-1}", 760, 268, 24, "grey"),
         chapter="Speed and velocity"),

    step("So what is the difference? Velocity has a direction. If your mother asks where you are going, and you say: Fast! "
         "That is a speed. She wanted a velocity.",
         write("\"Where are you going?\"     \"Fast!\"", 70, 445, 26, "pink"),
         write("That is a speed.  She wanted a velocity.", 70, 490, 24, "grey"),
         pause=1.1),

    step("Velocity is speed in a stated direction.",
         write("velocity = speed in a stated direction", 70, 572, 27, "green")),

    # ── 4. Your turn ──────────────────────────────────────────────────
    step("Your turn. A cyclist rides six hundred metres east in one hundred and twenty seconds, then two hundred metres west in forty seconds. "
         "Find her average speed, and her average velocity.",
         clear(2.2),
         heading("Your turn"),
         *pause_sign(1180, 82),
         write("A cyclist rides 600 m east in 120 s,", 70, 185, 26),
         write("then 200 m west in 40 s.", 70, 225, 26),
         write("Find her average speed and average velocity.", 70, 268, 24, "blue"),
         arrow(840, 200, 1200, 200, "yellow"), write("600 m", 1020, 186, 21, "yellow", "center"),
         arrow(1200, 236, 1080, 236, "pink"), write("200 m", 1140, 270, 21, "pink", "center"),
         chapter="Your turn: average speed and velocity"),

    step("Pause the video, and try it now. Go on. I will wait.",
         write("pause and try it", 1130, 92, 22, "pink", "right"),
         pause=3.2),

    step("Ready? Total distance: six hundred plus two hundred, eight hundred metres. Total time: one hundred and sixty seconds. "
         "So her average speed is five metres per second.",
         write("distance = 600 + 200 = 800 m,    time = 120 + 40 = 160 s", 70, 345, 25),
         equation(["average speed =", ("800", "160"), "= 5.0 m s^{-1}"], 70, 445, 26)),

    step("Her displacement is six hundred minus two hundred: four hundred metres east. "
         "So her average velocity is two point five metres per second, east.",
         write("displacement = 600 - 200 = 400 m east", 70, 520, 25, "yellow"),
         equation(["average velocity =", ("400", "160"), "= 2.5 m s^{-1}  east"], 70, 600, 26, "yellow")),

    step("If you got five for both, you forgot that she turned back. Very common. And now you never will.",
         write("Got 5 for both?", 880, 572, 24, "pink"), write("She turned back!", 880, 610, 24, "pink")),

    # ── 5. Changing units ─────────────────────────────────────────────
    step("The exam loves changing units. One kilometre per hour is a thousand metres in three thousand six hundred seconds. "
         "That is five over eighteen metres per second.",
         clear(2.2),
         heading("Changing units"),
         equation(["1 km h^{-1} =", ("1000 m", "3600 s"), "=", ("5", "18"), "m s^{-1}"], 70, 215, 28),
         chapter="Changing km/h to m/s"),

    step("So seventy-two kilometres per hour, times five over eighteen, is twenty metres per second. "
         "To go back the other way, multiply by eighteen over five.",
         equation(["72 km h^{-1} = 72 ×", ("5", "18"), "= 20 m s^{-1}"], 70, 325, 28, "yellow"),
         equation(["m s^{-1} to km h^{-1}:   ×", ("18", "5")], 70, 430, 26, "blue")),

    step("Quick one. What is fifteen metres per second, in kilometres per hour?",
         write("Quick one:   15 m s^{-1} = ?  km h^{-1}", 70, 540, 27, "pink"),
         pause=2.6),

    step("Fifty-four. Fifteen times eighteen, over five. Easy, once you know how.",
         equation(["= 15 ×", ("18", "5"), "= 54 km h^{-1}"], 250, 618, 27, "green")),

    # ── 6. Acceleration ───────────────────────────────────────────────
    step("Acceleration is how quickly velocity changes. Acceleration equals v minus u, over t, "
         "where u is the starting velocity, v is the final velocity, and t is the time. Its unit is metres per second squared.",
         clear(2.2),
         heading("Acceleration"),
         equation(["a =", ("v - u", "t")], 70, 215, 36, "yellow"),
         write("u:  starting velocity", 420, 182, 22, "grey"),
         write("v:  final velocity", 420, 214, 22, "grey"),
         write("t:  time taken", 420, 246, 22, "grey"),
         write("unit:  m s^{-2}", 800, 214, 26, "blue"),
         chapter="Acceleration and deceleration"),

    step("An okada pulls away from a junction, and reaches twelve metres per second in six seconds. "
         "Its acceleration is twelve minus zero, over six: two metres per second squared.",
         write("pulling away:  0 to 12 m s^{-1} in 6 s", 70, 345, 22),
         equation(["a =", ("12 - 0", "6"), "= 2 m s^{-2}"], 70, 425, 28, "green")),

    step("Then a goat walks into the road.",
         write("then...  a goat!", 690, 300, 24, "pink"),
         pause=0.9),

    step("The rider brakes, and stops in two seconds. Acceleration is zero minus twelve, over two: minus six metres per second squared. "
         "A deceleration. And that is why the passenger suddenly gets to know the rider very well.",
         write("braking:  12 m s^{-1} to 0 in 2 s", 690, 345, 22),
         equation(["a =", ("0 - 12", "2"), "= -6 m s^{-2}"], 690, 425, 28, "pink"),
         write("minus: against the motion", 690, 500, 21, "pink"),
         write("a deceleration (retardation)", 690, 532, 21, "pink"),
         pause=1.1),

    step("Careful, though. Negative acceleration does not always mean slowing down. "
         "Something moving west, our negative direction, that speeds up, also has a negative acceleration. "
         "Always say in words whether it is speeding up or slowing down.",
         write("Negative a does not always mean slowing down:", 70, 592, 23, "yellow"),
         write("moving west (-) and speeding up: a is negative too.", 70, 628, 23, "yellow")),

    # ── 7. In the exam ────────────────────────────────────────────────
    step("In the exam, you must define each of these quantities, and say whether it is a scalar or a vector. "
         "Distance and speed are scalars. Displacement, velocity and acceleration are vectors.",
         clear(2.2),
         heading("What the exam asks"),
         write("scalars", 220, 200, 30, "blue", "center"), write("vectors", 760, 200, 30, "yellow", "center"),
         line(490, 168, 490, 372, "grey", 2.4),
         write("distance", 220, 262, 26, "blue", "center"), write("speed", 220, 307, 26, "blue", "center"),
         write("displacement", 760, 262, 26, "yellow", "center"), write("velocity", 760, 307, 26, "yellow", "center"),
         write("acceleration", 760, 352, 26, "yellow", "center"),
         chapter="Scalars and vectors in the exam"),

    step("And whenever your answer is a vector, give its direction. Two point five metres per second, east. Not just two point five.",
         write("A vector answer?  Give its direction:  2.5 m s^{-1} east", 70, 450, 25, "pink")),

    step("Next time, we draw motion as graphs, and you will find that the area under a line tells you how far something went. "
         "Physics is strange like that. See you there.",
         write("Next:  motion graphs", 70, 560, 28, "green"),
         write("(where an area is a distance!)", 70, 600, 22, "grey"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Motion in a", 54, 128, 76, "yellow"),
    write("Straight Line", 54, 222, 76, "yellow"),
    write("Distance  ·  Displacement  ·  Speed  ·  Velocity", 60, 290, 28),
    *track(330, 480, s=0.62),
    write("400 m, but 0!", 330, 610, 28, "pink", "center"),
    equation(["a =", ("v - u", "t")], 760, 490, 56, "yellow"),
]
