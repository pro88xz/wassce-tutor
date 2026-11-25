"""Physics · Circular motion: uniform circular motion and centripetal force. A chalkboard video lesson.

Follows content/notes/physics-circular-1.md, built on prediction and reasons:
opens by asking the student to predict where a whirled stone flies when it is let
go (outwards? along the tangent?), then explains the answer with Newton's first
law; why steady speed in a circle is still acceleration (velocity arrows drawn
round the circle); radians, angular velocity and v = ωr, with the roundabout
question; a = v²/r and F = mv²/r, and why there is no outward "centrifugal"
force pushing a keke passenger; a stone on a string worked through; "try it
yourself" with a car on a bend; and how a spin dryer works.

Check: python3 scripts/video/board_video.py content/videos/physics-circular-1.py --boards .video-build/boards/circ1
"""

import math

from board_video import arrow, clear, curve, dots, ellipse, equation, heading, line, step, write

TITLE = "Circular Motion and Centripetal Force: Why a Body Moving in a Circle Accelerates | WASSCE Physics"
DESCRIPTION = ("Circular motion on the chalkboard: where a whirled stone flies when released, why steady speed in a circle "
               "is acceleration, radians and angular velocity, v = ωr, centripetal acceleration and force, a stone on a string, "
               "a car on a bend, and the spin dryer.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Circular motion"
# The lesson page this video is on: /wassce/physics/circular-motion/uniform-circular-motion-and-centripetal-force
LESSON = "physics/circular-motion/uniform-circular-motion-and-centripetal-force"


def stop_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def on_circle(cx, cy, r, deg):
    t = math.radians(deg)
    return (cx + r * math.cos(t), cy - r * math.sin(t))


# The sling (board 1): centre, radius, and the release point at the top of the circle.
SX, SY, SR = 990, 400, 150
REL = on_circle(SX, SY, SR, 90)

# Velocity arrows round a circle (board 2).
VX, VY, VR = 1000, 420, 150

STEPS = [
    # ── 1. Predict ────────────────────────────────────────────────────
    step("Before I explain anything, I want a prediction from you. A boy whirls a stone on a string, round and round above his head. "
         "At the very top of the circle, he lets go. Which way does the stone fly?",
         heading("Predict first"),
         ellipse(SX, SY, SR, SR, "grey", 2.6), dots([(SX, SY)], "white", 6),
         line(SX, SY, *REL, "white", 2.4), dots([REL], "yellow", 10),
         arrow(*REL, REL[0], REL[1] - 120, "blue"), write("A", REL[0] + 14, REL[1] - 100, 26, "blue"),
         arrow(*REL, REL[0] + 160, REL[1], "green"), write("B", REL[0] + 168, REL[1] + 8, 26, "green"),
         arrow(*REL, REL[0] + 120, REL[1] - 90, "pink"), write("C", REL[0] + 128, REL[1] - 98, 26, "pink"),
         write("Let go at the top.  Which way:  A, B or C?", 70, 200, 26, "yellow"),
         pause=0.6, chapter="Predict: where does the stone fly?"),

    step("A: straight outwards, away from the centre. B: straight ahead, along the line the circle was heading. "
         "Or C, somewhere in between. Choose one, out loud. I will wait.",
         write("A:  straight out, away from the centre", 100, 260, 23, "blue"),
         write("B:  straight ahead, along the tangent", 100, 298, 23, "green"),
         write("C:  somewhere in between", 100, 336, 23, "pink"),
         pause=2.6),

    step("The answer is B. Most people say A, and they are in very good company, but they are wrong. "
         "The stone flies off along the tangent, in the direction it was moving at that instant.",
         write("B:  along the tangent.", 70, 420, 30, "green")),

    step("Here is why. While the string is tight, it pulls the stone inwards, towards the centre, all the time. That pull keeps bending its path. "
         "The moment you let go, the pull stops. With no force on it, Newton's first law takes over: it carries on in a straight line.",
         arrow(*REL, SX, SY + 4, "pink"), write("string pulls in", SX, SY + 44, 20, "pink", "center"),
         write("Why?  The string pulls inwards.  Let go: no force,", 70, 480, 22),
         write("so it goes straight on  (Newton's first law).", 70, 516, 22)),

    # ── 2. Accelerating at a steady speed ─────────────────────────────
    step("And now a strange idea, which is true. A body going round a circle at a perfectly steady speed is accelerating. All the time.",
         clear(2.2),
         heading("Steady speed, but accelerating"),
         write("steady speed in a circle  =  acceleration", 70, 200, 27, "yellow"),
         chapter="Why steady speed in a circle is acceleration"),

    step("Look at the velocity arrows. At every point they are the same length: the speed never changes. "
         "But each one points a different way. Velocity has a direction, so the velocity is changing. "
         "And a changing velocity is, by definition, an acceleration.",
         ellipse(VX, VY, VR, VR, "grey", 2.6), dots([(VX, VY)], "white", 6),
         *[w for deg in (90, 0, 270, 180) for w in (
             dots([on_circle(VX, VY, VR, deg)], "yellow", 8),
             arrow(*on_circle(VX, VY, VR, deg),
                   on_circle(VX, VY, VR, deg)[0] - 95 * math.sin(math.radians(deg)),
                   on_circle(VX, VY, VR, deg)[1] - 95 * math.cos(math.radians(deg)), "green"))],
         write("same speed, changing direction", 70, 260, 24),
         write("so the VELOCITY changes:  it accelerates", 70, 300, 24, "green")),

    step("Which way does it accelerate? Towards the centre. That is the only direction that turns the velocity without speeding it up or slowing it down. "
         "We call it centripetal acceleration. Centripetal means centre-seeking.",
         *[arrow(*on_circle(VX, VY, VR, deg), *on_circle(VX, VY, VR - 70, deg), "pink") for deg in (45, 135, 225, 315)],
         write("towards the centre:  centripetal", 70, 370, 26, "pink"),
         write("(centre-seeking)", 70, 410, 22, "grey")),

    # ── 3. Radians and angular velocity ───────────────────────────────
    step("To measure turning, physicists use radians. One radian is the angle you turn through when the arc you travel is as long as the radius. "
         "A full circle is two pi radians: three hundred and sixty degrees.",
         clear(2.2),
         heading("Radians and angular velocity"),
         ellipse(1000, 420, 150, 150, "grey", 2.6), line(1000, 420, 1150, 420, "white", 2.8),
         line(1000, 420, *on_circle(1000, 420, 150, 57.3), "white", 2.8),
         write("r", 1075, 446, 22, "white", "center"), write("arc = r", 1120, 286, 22, "yellow"),
         write("1 rad", 1040, 400, 20, "yellow"),
         write("1 radian:  arc length = radius", 70, 200, 25),
         write("full circle = 2π rad = 360°", 70, 240, 25),
         chapter="Radians, angular velocity and v = ωr"),

    step("Angular velocity, omega, is how many radians it turns through each second. In one period, T, it turns two pi. "
         "So omega is two pi over T, which is also two pi f, where f is the frequency.",
         equation(["ω =", ("2π", "T"), "= 2πf"], 70, 330, 30, "yellow"),
         write("(rad s^{-1})", 400, 330, 22, "grey")),

    step("And the speed along the circle is v equals omega r. Here is a quick one. On a spinning roundabout, where should you sit to go fastest?",
         write("v = ωr", 70, 420, 32, "green"),
         write("A roundabout:  where do you go fastest?", 70, 480, 23, "pink"),
         pause=2.2),

    step("At the outer edge. Everyone on the roundabout turns through the same angle each second. But in that time, "
         "the person at the edge covers a much bigger arc. Same omega, bigger r, bigger v. Which is why the outer edge is where the screaming happens.",
         write("the edge:  same ω, bigger r, bigger v", 70, 530, 23, "green"),
         pause=0.9),

    # ── 4. The force ──────────────────────────────────────────────────
    step("How big is the centripetal acceleration? It is v squared over r, which is also omega squared r. "
         "And by Newton's second law, something must provide a force towards the centre: m v squared over r.",
         clear(2.2),
         heading("Centripetal force"),
         equation(["a =", ("v^2", "r"), "= ω^2 r"], 70, 220, 30, "yellow"),
         equation(["F =", ("mv^2", "r"), "= mω^2 r"], 70, 320, 30, "yellow"),
         write("(towards the centre)", 500, 318, 22, "grey"),
         chapter="Centripetal force"),

    step("Careful now: centripetal force is not a new kind of force. It is a job title. Whichever real force points to the centre does the job. "
         "For the stone, the string's tension. For a car on a bend, friction. For the Moon, gravity.",
         write("not a new force:  a job title", 70, 410, 25, "pink"),
         write("stone: tension.   car: friction.   Moon: gravity.", 100, 450, 23)),

    step("So when a keke turns sharply and you slide across the seat, no mysterious force is pushing you outwards. "
         "Your body is simply trying to go straight on, and the side of the keke has to push you round. You feel it in your hip.",
         write("Sliding across the seat on a bend?", 70, 520, 23),
         write("You are going straight on; the keke pushes you round.", 70, 556, 23, "green")),

    # ── 5. The stone on the string ────────────────────────────────────
    step("Let us put numbers on it. A zero point two kilogram stone is whirled in a circle of radius zero point five metres, "
         "three times every second. Find omega, the speed, and the tension in the string.",
         clear(2.2),
         heading("A stone on a string"),
         ellipse(1010, 400, 140, 140, "grey", 2.6), line(1010, 400, 1150, 400, "white", 2.6), dots([(1150, 400)], "yellow", 10),
         write("0.5 m", 1080, 430, 20, "white", "center"),
         write("0.2 kg,  r = 0.5 m,  3 turns per second", 70, 190, 25),
         chapter="Worked example: a stone on a string"),

    step("Omega is two pi times three: eighteen point eight five radians per second. The speed is omega r: about nine point four metres per second.",
         write("ω = 2π × 3 = 18.85 rad s^{-1}", 70, 260, 25),
         write("v = ωr = 18.85 × 0.5 = 9.42 m s^{-1}", 70, 302, 25)),

    step("And the tension provides the centripetal force: m omega squared r. Zero point two, times eighteen point eight five squared, times zero point five. "
         "About thirty-five newtons, from a stone weighing only two newtons. Whirl it faster, and the string may snap.",
         write("T = mω^2 r = 0.2 × 18.85^2 × 0.5 = 35.5 N", 70, 360, 25, "green"),
         write("(a stone weighing 2 N pulls with 35 N!)", 70, 400, 22, "grey")),

    # ── 6. Try it yourself: the bend ──────────────────────────────────
    step("Try it yourself. An eight hundred kilogram car takes a bend of radius fifty metres on a level road, at fifteen metres per second. "
         "How much friction does it need? And if the tyres can give at most four thousand newtons, what is the fastest safe speed?",
         clear(2.2),
         heading("Try it yourself"),
         *stop_sign(1180, 82),
         curve([on_circle(820, 640, 330, d) for d in range(15, 80, 5)], "white", 3.2),
         curve([on_circle(820, 640, 390, d) for d in range(15, 75, 5)], "white", 3.2),
         dots([(820, 640)], "grey", 6), line(820, 640, *on_circle(820, 640, 360, 45), "grey", 2.0),
         write("r = 50 m", 920, 580, 20, "grey"),
         write("800 kg car,  bend radius 50 m,  15 m s^{-1}", 70, 190, 24),
         write("1. friction needed?   2. top safe speed if 4000 N max?", 70, 230, 23, "blue"),
         chapter="Try it yourself: a car on a bend"),

    step("Have a go, then press play.",
         write("then press play", 1130, 92, 22, "pink", "right"),
         pause=3.4),

    step("The friction needed is m v squared over r: eight hundred times two hundred and twenty-five, over fifty. Three thousand six hundred newtons. "
         "The tyres can manage that.",
         equation(["F =", ("800 × 15^2", "50"), "= 3600 N"], 70, 320, 26, "green")),

    step("The fastest safe speed uses all four thousand. Four thousand equals eight hundred v squared over fifty, so v squared is two hundred and fifty, "
         "and v is about fifteen point eight metres per second. Any faster, and friction cannot hold the car on the curve.",
         write("4000 = 800 v^2 ÷ 50,   v^2 = 250,   v = 15.8 m s^{-1}", 70, 410, 24, "green")),

    step("And then? The car does not fly outwards. It carries straight on, along the tangent, off the road. That is what skidding on a bend really is.",
         write("too fast:  it goes straight on, along the tangent", 70, 470, 23, "pink")),

    # ── 7. The spin dryer ─────────────────────────────────────────────
    step("One last everyday puzzle: the spin dryer. The drum wall pushes the clothes inwards, keeping them going round. "
         "But the water reaches the little holes, where there is no wall to push it. So the water does what the stone did: it goes straight on, "
         "through the holes, and leaves the clothes behind.",
         clear(2.2),
         heading("The spin dryer"),
         ellipse(990, 400, 150, 150, "white", 3.2),
         *[dots([on_circle(990, 400, 150, d)], "grey", 5) for d in range(0, 360, 30)],
         *[w for d in (60, 180, 300) for w in (
             dots([on_circle(990, 400, 150, d)], "blue", 7),
             arrow(*on_circle(990, 400, 150, d),
                   on_circle(990, 400, 150, d)[0] - 90 * math.sin(math.radians(d)),
                   on_circle(990, 400, 150, d)[1] - 90 * math.cos(math.radians(d)), "blue"))],
         write("the wall pushes the clothes round;", 70, 200, 25),
         write("at a hole, nothing pushes the water,", 70, 240, 25, "blue"),
         write("so it goes straight on, and escapes", 70, 280, 25, "blue"),
         chapter="The spin dryer"),

    step("Next time: circles that go up and down. Why water stays in a bucket swung over your head, why roads tilt on bends, "
         "and why the Moon is falling towards us, all the time, and never lands.",
         write("Next:  buckets, banked roads, and the falling Moon", 70, 620, 23, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Circular Motion", 54, 140, 80, "yellow"),
    write("v = ωr  ·  Centripetal force  ·  F = mv^2/r", 60, 210, 30),
    ellipse(900, 450, 170, 170, "grey", 3.0), dots([(900, 450)], "white", 8),
    line(900, 450, 900, 280, "white", 2.8), dots([(900, 280)], "yellow", 12),
    arrow(900, 280, 1100, 280, "green", 4.0), write("this way!", 1000, 262, 32, "green", "center"),
    arrow(900, 280, 900, 380, "pink", 4.0),
    write("Let go:", 70, 400, 46, "pink"), write("which way?", 70, 460, 46, "pink"),
]
