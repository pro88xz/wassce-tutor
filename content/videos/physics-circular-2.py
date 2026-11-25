"""Physics · Circular motion: vertical circles, banked roads, gravitation and satellites. A chalkboard video lesson.

Follows content/notes/physics-circular-2.md, each idea with its reason: opens
on a bucket of water swung over the head (upside down, and not a drop falls),
and why: both forces point to the centre at the top, so the minimum speed is
√(gr), and the rope strains most at the bottom; why roads tilt on bends, and
tan θ = v²/(rg); Newton's law of gravitation and the inverse square ("think
fast": triple the distance); weighing the Earth with g; Newton's cannon on a
mountain, drawn, to show that an orbit is endless falling, and the speed it
needs; geostationary satellites and the dishes on Freetown's roofs;
weightlessness; and escape velocity, with "your turn" on another planet.

Check: python3 scripts/video/board_video.py content/videos/physics-circular-2.py --boards .video-build/boards/circ2
"""

import math

from board_video import arrow, box, clear, curve, dashed, dots, ellipse, equation, heading, line, step, write

TITLE = "Vertical Circles, Banked Roads, Gravitation, Satellites and Escape Velocity | WASSCE Physics"
DESCRIPTION = ("Circular motion continued on the chalkboard: why water stays in a bucket swung overhead, why roads are banked, "
               "Newton's law of gravitation, weighing the Earth, why a satellite is always falling, geostationary satellites, "
               "and escape velocity.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Circular motion"
# The lesson page this video is on: /wassce/physics/circular-motion/vertical-circles-banked-roads-gravitation-and-satellites
LESSON = "physics/circular-motion/vertical-circles-banked-roads-gravitation-and-satellites"


def stop_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def bucket(cx, cy, upside_down=False, color="yellow"):
    """A small bucket centred at (cx, cy); its open side faces the circle's centre when upside down."""
    s = -1 if upside_down else 1
    return [line(cx - 22, cy - 20 * s, cx - 16, cy + 18 * s, color, 3.0), line(cx + 22, cy - 20 * s, cx + 16, cy + 18 * s, color, 3.0),
            line(cx - 16, cy + 18 * s, cx + 16, cy + 18 * s, color, 3.0),
            line(cx - 18, cy - 8 * s, cx + 18, cy - 8 * s, "blue", 2.4)]


# The vertical circle (board 1).
VC = (990, 400)
VR = 170

# The car on the banked road (board 2): the road rises at 20.9°; base centre (970, 480).
_U, _N = (0.934, -0.357), (-0.357, -0.934)
_C = (970, 480)
_A, _B = (_C[0] - 40 * _U[0], _C[1] - 40 * _U[1]), (_C[0] + 40 * _U[0], _C[1] + 40 * _U[1])
_Cc, _D = (_B[0] + 40 * _N[0], _B[1] + 40 * _N[1]), (_A[0] + 40 * _N[0], _A[1] + 40 * _N[1])
CAR = [line(*_A, *_B, "yellow", 3.0), line(*_B, *_Cc, "yellow", 3.0), line(*_Cc, *_D, "yellow", 3.0), line(*_D, *_A, "yellow", 3.0)]
CAR_M = (_C[0] + 20 * _N[0], _C[1] + 20 * _N[1])

# Newton's cannon (board 4): the Earth and a mountain on top.
EC, ER = (1040, 450), 130
PEAK = (EC[0], EC[1] - ER - 40)

STEPS = [
    # ── 1. The bucket ─────────────────────────────────────────────────
    step("Here is a trick you can try. Outside, please. Over grass. Fill a small bucket with water, and swing it in a big circle, "
         "up over your head and down again. Swing it fast enough, and at the very top, the bucket is completely upside down, and not a drop falls out.",
         heading("The bucket over your head"),
         ellipse(*VC, VR, VR, "grey", 2.6), dots([VC], "white", 6),
         line(*VC, VC[0], VC[1] - VR + 20, "white", 2.4), *bucket(VC[0], VC[1] - VR, upside_down=True),
         line(*VC, VC[0], VC[1] + VR - 20, "white", 2.4), *bucket(VC[0], VC[1] + VR),
         pause=0.8, chapter="Why water stays in a swinging bucket"),

    step("How? At the top, the centre of the circle is below the bucket. So both forces on the water point down, towards the centre: "
         "its weight, and the push from the bottom of the bucket. Together, they provide the centripetal force.",
         arrow(VC[0] + 40, VC[1] - VR + 10, VC[0] + 40, VC[1] - VR + 80, "pink"), write("mg", VC[0] + 52, VC[1] - VR + 70, 20, "pink"),
         arrow(VC[0] - 40, VC[1] - VR + 10, VC[0] - 40, VC[1] - VR + 80, "green"), write("T", VC[0] - 52, VC[1] - VR + 70, 20, "green", "right"),
         write("at the top:  T + mg = mv^2 / r", 70, 200, 26, "yellow")),

    step("The water is not falling out, because it is falling round. Gravity alone is already trying to curve it towards the centre. "
         "As long as the bucket goes fast enough, gravity is not enough to pull the water out of it.",
         write("falling ROUND, not falling OUT", 70, 260, 25, "green")),

    step("The slowest it can go is when the push from the bucket drops to zero, and gravity does the whole job. Then m g equals m v squared over r, "
         "so v is the square root of g r. For a circle of point nine metres, that is three metres per second.",
         equation(["T = 0:   mg =", ("mv^2", "r"), ",   v_{min} =", {"root": "gr"}], 70, 350, 26, "yellow"),
         equation(["r = 0.9 m:   v_{min} =", {"root": "10 × 0.9"}, "= 3 m s^{-1}"], 70, 430, 24, "green")),

    step("And at the bottom? Now the weight points away from the centre, so the rope must pull up the weight, and provide the centripetal force as well. "
         "T is m g plus m v squared over r. The rope strains hardest at the bottom. If it is going to snap, that is where.",
         write("at the bottom:  T = mg + mv^2 / r", 70, 510, 24, "pink"),
         write("(the biggest:  where ropes snap)", 70, 548, 22, "pink")),

    # ── 2. Banked roads ───────────────────────────────────────────────
    step("Now, why do race tracks and good highways tilt on their bends? On a flat bend, only friction turns the car. On a wet day, that is risky. "
         "Tilt the road, and the road's own push leans inwards, and helps.",
         clear(2.2),
         heading("Banked roads"),
         line(760, 560, 1180, 560, "grey", 2.4), line(760, 560, 1180, 400, "white", 3.4),
         *CAR,
         arrow(*CAR_M, CAR_M[0] - 0.357 * 120, CAR_M[1] - 0.934 * 120, "green"), write("R", CAR_M[0] - 0.357 * 130 - 8, CAR_M[1] - 0.934 * 130, 24, "green", "right"),
         arrow(*CAR_M, CAR_M[0], CAR_M[1] + 110, "pink"), write("mg", CAR_M[0] + 14, CAR_M[1] + 104, 22, "pink"),
         write("θ", 830, 552, 24, "grey"),
         write("centre of the bend", 780, 250, 20, "grey"), arrow(860, 266, 780, 266, "grey"),
         chapter="Banked roads"),

    step("The sideways part of R points towards the centre of the bend: R sine theta. That provides the centripetal force. "
         "The upward part, R cos theta, holds up the weight. Divide one by the other, and tan theta is v squared over r g.",
         write("R sin θ = mv^2 / r      R cos θ = mg", 70, 200, 25),
         equation(["tan θ =", ("v^2", "rg")], 70, 290, 32, "yellow")),

    step("Think fast. Does a heavy lorry need a steeper bank than a light car, at the same speed?",
         write("Think fast:  heavier vehicle, steeper bank?", 70, 380, 24, "pink"),
         pause=2.3),

    step("No. The mass cancelled out. The perfect angle depends only on the speed and the radius. "
         "For a bend of radius a hundred metres, at twenty metres per second, tan theta is zero point four. About twenty-two degrees.",
         write("No:  the mass cancels.", 70, 425, 24, "green"),
         write("r = 100 m, v = 20:   tan θ = 0.4,   θ = 21.8°", 70, 470, 24, "green")),

    # ── 3. Gravitation ────────────────────────────────────────────────
    step("Newton's great idea was that the force that pulls a mango down from a tree is the same force that holds the Moon in its orbit. "
         "Every mass in the universe attracts every other mass.",
         clear(2.2),
         heading("Universal gravitation"),
         write("the mango and the Moon:  the same force", 70, 190, 26, "yellow"),
         chapter="Newton's law of universal gravitation"),

    step("The force is proportional to the product of the two masses, and inversely proportional to the square of the distance between them. "
         "F equals G m one m two, over r squared. G is a tiny constant: six point six seven times ten to the minus eleven.",
         equation(["F =", ("G m_1 m_2", "r^2")], 70, 290, 34, "yellow"),
         write("G = 6.67 × 10^{-11} N m^2 kg^{-2}", 450, 286, 24, "grey")),

    step("Before I say it: if you triple the distance between two masses, what happens to the force?",
         write("Triple the distance:  the force ... ?", 70, 380, 25, "pink"),
         pause=2.3),

    step("It becomes one ninth. Three squared is nine. That is the inverse square law: twice as far, a quarter of the force.",
         write("1/9.   (twice as far:  1/4)", 70, 425, 25, "green")),

    step("Now something astonishing. Your weight is the Earth pulling you: m g equals G M m over R squared. So g is G M over R squared. "
         "Rearrange it, put in g, the Earth's radius, and G, and you get the mass of the whole Earth: six times ten to the twenty-four kilograms. "
         "We weighed a planet, without leaving the classroom.",
         equation(["g =", ("GM", "R^2")], 70, 510, 30, "yellow"),
         write("so M = gR^2 / G = 6.0 × 10^{24} kg", 300, 505, 24, "green")),

    # ── 4. Newton's cannon ────────────────────────────────────────────
    step("So why does the Moon not fall down? Newton answered with a thought experiment. Put a cannon on top of a very tall mountain, "
         "and fire a cannonball sideways. It curves down, and lands not far away.",
         clear(2.2),
         heading("Why satellites don't fall down"),
         ellipse(*EC, ER, ER, "white", 3.0),
         line(EC[0] - 30, EC[1] - ER + 4, PEAK[0], PEAK[1], "white", 2.8), line(PEAK[0], PEAK[1], EC[0] + 30, EC[1] - ER + 4, "white", 2.8),
         curve([PEAK, (1080, 285), (1105, 305), (1115, 343)], "pink", 2.8),
         chapter="Why a satellite is always falling"),

    step("Fire it faster, and it lands further round the Earth. But here is the clever part. The Earth is curved. "
         "Fire it fast enough, and as it falls, the ground curves away beneath it just as fast. It keeps falling, and never lands. That is an orbit.",
         curve([PEAK, (1110, 288), (1150, 330), (1166, 416)], "blue", 2.8),
         ellipse(*EC, ER + 40, ER + 40, "green", 3.0, start=-1.5708),
         write("an orbit:  falling, forever,", 70, 200, 26, "green"),
         write("while the ground curves away", 70, 240, 26, "green")),

    step("So the Moon is falling towards us right now, and always has been. It is just moving sideways fast enough to keep missing.",
         write("The Moon is falling.  It keeps missing.", 70, 300, 25, "yellow"),
         pause=1.0),

    step("How fast? Gravity provides the centripetal force: G M m over r squared equals m v squared over r. "
         "Near the Earth's surface, that gives v equals the square root of g R: about seven point nine kilometres per second. "
         "Fast enough to go round the whole Earth in about eighty-five minutes.",
         write("GMm / r^2 = mv^2 / r", 70, 380, 25),
         equation(["near the surface:   v =", {"root": "gR"}, "≈ 7.9 km s^{-1}"], 70, 450, 25, "green"),
         write("(round the Earth in about 85 minutes)", 70, 512, 22, "grey")),

    # ── 5. Geostationary, weightless ──────────────────────────────────
    step("Go much higher, about thirty-six thousand kilometres up, above the equator, and an orbit takes exactly twenty-four hours: the same as the Earth's spin. "
         "The satellite seems to hang still in the sky. That is a geostationary satellite.",
         clear(2.2),
         heading("Geostationary satellites"),
         write("36 000 km up, above the equator, period 24 h:", 70, 190, 24),
         write("it stays over the same place", 70, 230, 24, "yellow"),
         chapter="Geostationary satellites and weightlessness"),

    step("Look at the satellite dishes on the rooftops across Freetown. They all point the same way, and never move. "
         "They do not need to. Their satellite never moves across the sky.",
         write("rooftop dishes:  all pointing the same way", 70, 290, 24, "blue")),

    step("And astronauts floating in a space station? Gravity up there is still about ninety percent as strong as on the ground. "
         "They float because they and their spacecraft are falling round the Earth together. Nothing pushes up on their feet.",
         write("astronauts:  gravity still there;", 70, 370, 24),
         write("they and the craft fall together", 70, 408, 24, "green")),

    # ── 6. Escape velocity ────────────────────────────────────────────
    step("Throw something up fast enough, and it never comes back at all. That speed is the escape velocity: the square root of two g R. "
         "For the Earth, about eleven point two kilometres per second. And it does not depend on the mass of what you throw.",
         clear(2.2),
         heading("Escape velocity"),
         *stop_sign(1180, 82),
         equation(["v_e =", {"root": "2gR"}, "≈ 11.2 km s^{-1}  (Earth)"], 70, 220, 28, "yellow"),
         chapter="Escape velocity"),

    step("Your turn. A planet has g equal to four metres per second squared, and a radius of two times ten to the six metres. What is its escape velocity?",
         write("A planet:  g = 4 m s^{-2},  R = 2 × 10^6 m.   v_e = ?", 70, 320, 24, "blue")),

    step("Work it out. I will be right here.",
         write("work it out", 1130, 92, 22, "pink", "right"),
         pause=3.2),

    step("Two times four, times two times ten to the six, is sixteen times ten to the six. The square root is four thousand metres per second: "
         "four kilometres per second. Easier to leave than the Earth.",
         equation(["v_e =", {"root": "2 × 4 × 2 × 10^6"}, "= 4000 m s^{-1}"], 70, 410, 26, "green")),

    step("And that completes circular motion: from a stone on a string, all the way out to the Moon. "
         "Next, things that go back and forth: pendulums, springs, and simple harmonic motion.",
         write("Next:  simple harmonic motion", 70, 520, 26, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Orbits & Gravity", 54, 140, 80, "yellow"),
    write("Vertical circles  ·  Banked roads  ·  Satellites", 60, 210, 30),
    ellipse(960, 450, 130, 130, "white", 3.4),
    ellipse(960, 450, 180, 180, "green", 3.4, start=-1.5708),
    dots([(960, 270)], "yellow", 12), arrow(960, 270, 1080, 270, "yellow", 4.0),
    arrow(960, 280, 960, 340, "pink", 4.0),
    write("always falling,", 70, 420, 42, "pink"), write("never landing", 70, 480, 42, "pink"),
]
