"""Physics · Friction: friction on slopes, viscosity and reducing friction. A chalkboard video lesson.

Follows content/notes/physics-friction-2.md: opens with an experiment to do
right now (an exercise book on a ruler, tilted until it slides); the angle of
friction, and mu = tan theta derived on the board so students see why; the
plank practical and the pulley method with its graph; why friction flips
direction on a slope, and a load pulled up a ramp with its work traced to where
it goes (raised, or heat); "over to you": will a block slide, and what holds it;
viscosity in a sentence or two; friction as friend and enemy (an okada chain),
and why bearings, oil and streamlining each work.

Check: python3 scripts/video/board_video.py content/videos/physics-friction-2.py --boards .video-build/boards/fric2
"""

import math

from board_video import arrow, clear, dots, ellipse, equation, heading, line, step, write

TITLE = "Friction on Slopes: Angle of Friction, μ = tan θ, Rough Ramps, Viscosity and Reducing Friction | WASSCE Physics"
DESCRIPTION = ("Friction on slopes on the chalkboard: an experiment with a book and a ruler, why μ = tan θ, measuring μ, "
               "pushing a load up a rough ramp and where the energy goes, whether a block will slide, viscosity, and why oil "
               "and ball bearings reduce friction.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Friction"
# The lesson page this video is on: /wassce/physics/friction/friction-on-slopes-viscosity-and-reducing-friction
LESSON = "physics/friction/friction-on-slopes-viscosity-and-reducing-friction"


def stop_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def slope(x0, y0, run, deg, label=True):
    """A slope rising to the right from (x0, y0); returns strokes, the uphill unit vector and the outward normal."""
    t = math.radians(deg)
    top = (x0 + run, y0 - run * math.tan(t))
    u, n = (math.cos(t), -math.sin(t)), (-math.sin(t), -math.cos(t))
    out = [line(x0, y0, x0 + run, y0, "white", 3.0), line(x0 + run, y0, *top, "white", 3.0), line(x0, y0, *top, "white", 3.0)]
    if label:
        out.append(write(f"{deg}°", x0 + 64, y0 - 10, 20, "grey"))
    return out, u, n


def go(p, d, v):
    return (p[0] + d * v[0], p[1] + d * v[1])


def block_on(x0, y0, deg, along, w=70, h=44, color="yellow"):
    """A block on the slope from (x0, y0), its base centred `along` px up the slope; returns strokes and its centre."""
    _, u, n = slope(x0, y0, 10, deg, False)
    c = go((x0, y0), along, u)
    a, b = go(c, -w / 2, u), go(c, w / 2, u)
    cc, d = go(b, h, n), go(a, h, n)
    return [line(*a, *b, color, 3.0), line(*b, *cc, color, 3.0), line(*cc, *d, color, 3.0), line(*d, *a, color, 3.0)], go(c, h / 2, n)


S1, U1, N1 = slope(760, 560, 440, 25)
B1, M1 = block_on(760, 560, 25, 260)
S3, U3, N3 = slope(780, 600, 420, 30)
B3, M3 = block_on(780, 600, 30, 250)
S4, U4, N4 = slope(780, 600, 420, 37)
B4, M4 = block_on(780, 600, 37, 240)

STEPS = [
    # ── 1. The book and the ruler ─────────────────────────────────────
    step("Here is an experiment you can do right now. Put your exercise book on a long ruler, or a plank. Lift one end, slowly, very slowly. "
         "For a while, the book just sits there. Then, at one particular angle, it suddenly slides.",
         heading("When does it slide?"),
         *S1, *B1,
         pause=0.8, chapter="The angle of friction"),

    step("That angle is called the angle of friction. And it tells you something remarkable: the coefficient of friction, "
         "with no scale, no spring balance, nothing but an angle.",
         write("angle of friction:  the slope at which", 70, 200, 25, "yellow"),
         write("it is just about to slide", 70, 238, 25, "yellow")),

    step("Let us see why. Just before it slides, friction is at its limit. Along the slope, friction balances m g sine theta. "
         "Across the slope, the normal reaction balances m g cos theta.",
         arrow(*M1, *go(M1, 90, U1), "green"), write("F", go(M1, 100, U1)[0], go(M1, 100, U1)[1] - 6, 22, "green"),
         arrow(*M1, *go(M1, 80, N1), "blue"), write("R", go(M1, 88, N1)[0] - 18, go(M1, 88, N1)[1], 22, "blue"),
         arrow(*M1, M1[0], M1[1] + 100, "pink"), write("mg", M1[0] + 10, M1[1] + 96, 22, "pink"),
         write("F = mg sin θ,    R = mg cos θ", 70, 300, 26)),

    step("Divide one by the other. The m g cancels, and sine over cos is tan. So mu equals tan theta. "
         "The heavier the book, the same angle. Its weight cancels out completely.",
         equation(["μ =", ("F", "R"), "=", ("mg sin θ", "mg cos θ"), "= tan θ"], 70, 395, 28, "green"),
         write("(the mass cancels:  any book, same angle)", 70, 470, 22, "grey")),

    step("So if your book slides at twenty-five degrees, mu is tan twenty-five: about zero point four seven. Just from tilting a ruler.",
         write("slides at 25°:   μ = tan 25° = 0.47", 70, 530, 26, "yellow")),

    # ── 2. Measuring mu ───────────────────────────────────────────────
    step("In the laboratory, you do it more carefully. Raise the plank slowly, tapping it gently, and stop the moment the block starts to slide. "
         "Measure the height, h, and the horizontal length, l. Tan theta is h over l, so mu is h over l.",
         clear(2.2),
         heading("Measuring μ"),
         write("raise slowly, tapping;  stop when it just slides", 70, 190, 24),
         equation(["μ = tan θ =", ("h", "l")], 70, 270, 28, "yellow"),
         write("repeat, and take the average", 70, 340, 24, "grey"),
         chapter="Measuring the coefficient of friction"),

    step("Why tap the plank? Because a block can stick for a moment, and then jump. Gentle tapping lets it slide at the true angle, not a late one.",
         write("why tap?  so it slides at the true angle", 70, 395, 23, "pink")),

    step("There is a second method. Pull the block along a flat bench, with a spring balance, and note the force that just starts it moving. "
         "Add masses on top, and repeat. Plot that force against the normal reaction: a straight line through the origin, whose gradient is mu.",
         write("or:  limiting friction against R, for several loads", 70, 470, 21),
         write("a straight line;   gradient = μ", 70, 508, 23, "green"),
         arrow(820, 600, 1180, 600, "white", 2.6), arrow(820, 600, 820, 400, "white", 2.6),
         write("R", 1185, 620, 20, "grey"), write("F", 832, 414, 20, "grey"),
         line(820, 600, 1140, 440, "green", 3.0), dots([(900, 560), (980, 520), (1060, 480), (1140, 440)], "yellow", 6)),

    # ── 3. Pulling up a rough ramp ────────────────────────────────────
    step("Now push something up a rough ramp. Which way does friction act? Always against the motion. "
         "Going up the ramp, friction pulls down the ramp, adding to the part of the weight you are already fighting.",
         clear(2.2),
         heading("Up a rough ramp"),
         *S3, *B3,
         arrow(*M3, *go(M3, 100, U3), "green"), write("P", go(M3, 110, U3)[0], go(M3, 110, U3)[1] - 6, 22, "green"),
         arrow(*go(M3, -10, U3), *go(M3, -95, U3), "pink"), write("F", go(M3, -105, U3)[0] - 14, go(M3, -105, U3)[1] + 4, 22, "pink"),
         write("friction always opposes the motion", 70, 190, 24, "pink"),
         write("going up:   P = mg sin θ + μ mg cos θ", 70, 230, 25, "yellow"),
         chapter="Friction on a rough slope"),

    step("A fifty kilogram load is pulled up a ramp at thirty degrees, at a steady speed, and mu is zero point two. "
         "The tension is two hundred and fifty, plus eighty-six point six: three hundred and thirty-six point six newtons.",
         write("50 kg, 30°, μ = 0.2:", 70, 300, 24),
         write("P = 250 + 0.2 × 500 × 0.866 = 336.6 N", 70, 340, 24, "green")),

    step("Now follow the energy. Pulling it six metres along the ramp takes three hundred and thirty-six point six, times six: "
         "about two thousand and twenty joules of work.",
         write("work = 336.6 × 6 = 2020 J", 70, 400, 24)),

    step("Where does it go? The load rises three metres, so fifteen hundred joules becomes potential energy. "
         "The other five hundred and twenty joules is lost as heat, warming the ramp and the load. That is friction's tax.",
         write("raised 3 m:  500 × 3 = 1500 J  (stored)", 70, 450, 23, "blue"),
         write("the rest:  520 J  (heat:  friction's tax)", 70, 490, 23, "pink")),

    # ── 4. Over to you ────────────────────────────────────────────────
    step("Over to you, in two parts. A twenty kilogram block sits on a rough slope at thirty-seven degrees, with mu equal to zero point five. "
         "First: left alone, will it slide? Second: if it does, what force up the slope will just stop it?",
         clear(2.2),
         heading("Over to you"),
         *stop_sign(1180, 82),
         *S4, *B4,
         write("20 kg block,  37° slope,  μ = 0.5", 70, 190, 25),
         write("1. Will it slide?   2. What force just holds it?", 70, 230, 24, "blue"),
         write("(sin 37° = 0.6,  cos 37° = 0.8)", 70, 270, 22, "grey"),
         chapter="Over to you: will it slide?"),

    step("Two answers this time. Pause, and take your time.",
         write("two answers", 1130, 92, 22, "pink", "right"),
         pause=3.5),

    step("Will it slide? It slides when tan theta is bigger than mu. Tan thirty-seven is zero point seven five, which beats zero point five. So yes, it slides.",
         write("tan 37° = 0.75 > 0.5:   it slides", 70, 340, 25, "green")),

    step("To hold it, your push helps friction. So P is m g sine theta, minus mu m g cos theta. "
         "A hundred and twenty, minus eighty: forty newtons. Friction does most of the holding. You only make up the difference.",
         write("hold it:   P = mg sin θ - μ mg cos θ", 70, 400, 25, "yellow"),
         write("= 120 - 80 = 40 N", 70, 440, 25, "green"),
         arrow(*M4, *go(M4, 90, U4), "green"), write("P", go(M4, 100, U4)[0], go(M4, 100, U4)[1] - 6, 22, "green")),

    # ── 5. Viscosity ──────────────────────────────────────────────────
    step("Friction is not only between solids. Liquids and gases resist motion too, and this fluid friction is called viscosity. "
         "Honey and engine oil are very viscous. Water is not.",
         clear(2.2),
         heading("Friction in fluids"),
         write("viscosity:  friction inside a fluid", 70, 190, 27, "yellow"),
         write("honey, engine oil:  high.   water:  low", 70, 235, 24),
         chapter="Viscosity"),

    step("It is viscosity that gives a falling raindrop, or a steel ball in oil, its steady terminal velocity. "
         "And warm oil flows more easily than cold, which is why an engine runs more smoothly once it has warmed up.",
         write("gives falling bodies a terminal velocity", 70, 290, 24),
         write("warmer liquid:  less viscous", 70, 330, 24, "blue")),

    # ── 6. Friend and enemy ───────────────────────────────────────────
    step("So, is friction good or bad? Both. Without it, you cannot walk, brake, tie a knot, or even use a piece of chalk. "
         "But it wears out tyres and engines, wastes fuel, and turns useful energy into heat.",
         clear(2.2),
         heading("Friend and enemy"),
         write("friend:  walking,  brakes,  tyres,  knots,  chalk", 70, 190, 24, "green"),
         write("enemy:  wear,  heat,  wasted fuel,  noise", 70, 230, 24, "pink"),
         chapter="Friction: friend and enemy"),

    step("Ask any okada rider. A dry chain wears out fast, wastes fuel, and can snap. So they oil it. Oil works by separating the surfaces, "
         "so the bumps no longer catch on each other.",
         write("oil:  separates the surfaces", 100, 300, 24, "yellow")),

    step("Ball bearings work differently. They replace sliding with rolling, and rolling friction is far smaller. "
         "Polishing smooths the bumps down. Streamlining helps vehicles slip through the air. And a hovercraft floats on a cushion of air.",
         write("ball bearings:  rolling, not sliding", 100, 340, 24, "yellow"),
         write("polishing:  smaller bumps", 100, 380, 24, "yellow"),
         write("streamlining:  less air resistance", 100, 420, 24, "yellow"),
         write("air cushion:  surfaces kept apart", 100, 460, 24, "yellow"),
         ellipse(1000, 380, 70, 70, "white", 3.0), ellipse(1000, 380, 40, 40, "grey", 2.4),
         *[ellipse(1000 + 55 * math.cos(k * math.pi / 4), 380 + 55 * math.sin(k * math.pi / 4), 11, 11, "yellow", 2.6) for k in range(8)],
         write("ball bearing", 1000, 490, 20, "grey", "center")),

    step("In the exam: show that mu equals tan theta, describe how to measure mu, and list the advantages, disadvantages, and ways of reducing friction. "
         "That completes friction. Next, we leave straight lines behind: motion in a circle.",
         write("Exam:  μ = tan θ;  measuring μ;  friend, enemy, reducing it", 70, 560, 21, "pink"),
         write("Next:  circular motion", 70, 610, 25, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Friction on Slopes", 54, 140, 80, "yellow"),
    write("μ = tan θ  ·  Rough ramps  ·  Viscosity", 60, 210, 30),
    *slope(640, 620, 560, 28)[0],
    *block_on(640, 620, 28, 300, 110, 70)[0],
    equation(["μ = tan θ"], 70, 440, 64, "green"),
]
