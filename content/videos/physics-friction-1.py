"""Physics · Friction: static, limiting and kinetic friction. A chalkboard video lesson.

Follows content/notes/physics-friction-1.md, explaining each idea from the
inside: opens with a thought experiment (one morning with no friction at all);
why friction exists, drawn as two rough surfaces under a magnifying glass; why a
heavy box is harder to start than to keep moving, with the friction graph built
point by point as the push grows; the coefficient of friction; the laws of
friction, including why area does not matter; a crate worked through together,
ending on the trap that friction is not always mu R; a skidding car on a dry and
a wet road; and "your turn" with a rope pulled at an angle.

Check: python3 scripts/video/board_video.py content/videos/physics-friction-1.py --boards .video-build/boards/fric1
"""

from board_video import arrow, box, clear, dashed, dots, ellipse, equation, heading, line, step, write, zigzag

TITLE = "Friction Explained: Static, Limiting and Kinetic Friction and the Coefficient of Friction | WASSCE Physics"
DESCRIPTION = ("Friction on the chalkboard, explained from the inside: why surfaces grip, why a box is harder to start "
               "than to keep moving, static, limiting and kinetic friction, the coefficient of friction, the laws of "
               "friction, a skidding car, and a rope pulled at an angle.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Friction"
# The lesson page this video is on: /wassce/physics/friction/friction-static-limiting-and-kinetic-friction
LESSON = "physics/friction/friction-static-limiting-and-kinetic-friction"


def stop_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def crate(x, ground, w=110, h=80, label="", color="yellow"):
    return [box(x, ground - h, w, h, color, 3.0), write(label, x + w / 2, ground - h / 2 + 8, 22, color, "center")]


# The friction graph: applied force along, friction up; limiting at (930, 410), kinetic level at 440.
GX, GY = 770, 590
STATIC_END, KINETIC_Y = (930, 410), 440

STEPS = [
    # ── 1. A morning without friction ─────────────────────────────────
    step("Imagine you wake up tomorrow, and friction has disappeared. You swing your legs out of bed, and you slide straight onto the floor. "
         "You try to stand, and your feet shoot out from under you.",
         heading("A morning without friction"),
         pause=0.5, chapter="What is friction, and why does it exist?"),

    step("Your shoelaces will not stay tied: knots need friction. A nail slides out of the wall, and the picture falls. "
         "And outside, no keke can start, and none can stop. Everyone just drifts, gently, forever.",
         write("you cannot walk", 100, 200, 25),
         write("knots come undone,  nails slide out", 100, 240, 25),
         write("nothing starts,  nothing stops", 100, 280, 25, "pink"),
         pause=0.9),

    step("So friction is not just a nuisance. It is the reason the world holds together. "
         "Friction is the force that opposes motion, or attempted motion, between two surfaces in contact.",
         write("friction:  opposes motion, or attempted motion,", 70, 360, 25, "yellow"),
         write("between surfaces in contact", 70, 398, 25, "yellow")),

    step("But where does it come from? Look at a smooth table top under a powerful microscope, and it is not smooth at all. "
         "It is a mountain range of tiny bumps. Put two surfaces together, and the bumps lock into each other, and cling where they touch.",
         line(780, 470, 1180, 470, "white", 2.6), line(780, 470, 780, 530, "white", 2.6), line(1180, 470, 1180, 530, "white", 2.6),
         zigzag(780, 530, 1180, 530, n=12, amp=10, color="white", width=2.6),
         zigzag(780, 538, 1180, 538, n=12, amp=10, color="grey", width=2.6), line(780, 538, 780, 600, "grey", 2.6),
         line(1180, 538, 1180, 600, "grey", 2.6), line(780, 600, 1180, 600, "grey", 2.6),
         write("under a microscope", 980, 636, 21, "blue", "center"),
         write("Why?  Tiny bumps interlock and cling.", 70, 470, 25, "blue")),

    # ── 2. Harder to start ────────────────────────────────────────────
    step("Now, something you have felt. Push a heavy box across the floor. At first, nothing happens. You push harder. Still nothing. "
         "Then suddenly it moves, and once it is sliding, it is easier to keep it going. Why?",
         clear(2.2),
         heading("Harder to start than to keep going"),
         pause=1.0, chapter="Static, limiting and kinetic friction"),

    step("Let us watch the friction as you push. Push with ten newtons, and the box does not move. So friction must be pushing back "
         "with exactly ten. Push with twenty: friction rises to twenty. Friction is matching you, newton for newton.",
         arrow(GX, GY, GX + 440, GY, "white", 3.0), arrow(GX, GY, GX, GY - 300, "white", 3.0),
         write("your push", GX + 440, GY + 34, 20, "grey", "right"), write("friction", GX + 14, GY - 286, 20, "grey"),
         line(GX, GY, *STATIC_END, "green", 3.4),
         write("static", 850, 540, 22, "green"),
         write("Static friction matches the push.", 70, 200, 26, "green")),

    step("But it cannot rise forever. There is a maximum, called the limiting friction. At that moment, the box is just about to move.",
         dots([STATIC_END], "yellow", 9), write("limiting", STATIC_END[0] + 12, STATIC_END[1] - 10, 22, "yellow"),
         write("Limiting friction:  the maximum,", 70, 260, 26, "yellow"),
         write("when it is just about to move.", 70, 298, 26, "yellow")),

    step("Push past it, and the box breaks free. Once it slides, the bumps no longer have time to settle into each other, "
         "so the friction drops a little, to a steady value called kinetic friction. That is why starting is harder than keeping going.",
         line(*STATIC_END, 950, KINETIC_Y, "pink", 3.4), line(950, KINETIC_Y, 1200, KINETIC_Y, "pink", 3.4),
         write("kinetic", 1200, KINETIC_Y - 14, 22, "pink", "right"),
         write("Kinetic friction:  while sliding,", 70, 360, 26, "pink"),
         write("a little less than limiting.", 70, 398, 26, "pink")),

    # ── 3. The coefficient ────────────────────────────────────────────
    step("How big is the limiting friction? It depends on how hard the surfaces are pressed together: the normal reaction, R. "
         "Press twice as hard, and the bumps dig in twice as deep. The friction doubles.",
         clear(2.2),
         heading("The coefficient of friction"),
         write("limiting friction  ∝  normal reaction R", 70, 200, 27, "yellow"),
         chapter="The coefficient of friction"),

    step("So we write limiting friction equals mu times R, where mu is the coefficient of friction. It is just a ratio: "
         "friction over normal reaction. A number, with no unit.",
         equation(["μ =", ("F", "R")], 70, 290, 34, "yellow"),
         write("F = μR     (μ has no unit)", 320, 290, 28, "green")),

    step("Rubber on dry tarmac: about zero point eight. On a wet road, about zero point four. Steel on ice: zero point zero three. "
         "That is why ice is a fun place to watch other people walk.",
         write("tyre on dry road:  0.8", 100, 370, 24),
         write("tyre on wet road:  0.4", 100, 408, 24, "blue"),
         write("steel on ice:  0.03", 100, 446, 24, "pink"),
         pause=0.9),

    step("Now one law that surprises everyone. Friction does not depend on the area of contact. Turn a brick on its side, "
         "and the friction stays the same. Why? A bigger area spreads the same weight, so each bump is pressed more lightly. "
         "More bumps, each gripping less. It cancels out.",
         write("Area of contact?  Does not matter!", 70, 530, 25, "pink"),
         write("more bumps, each pressed more lightly", 70, 568, 23, "grey")),

    step("So, the laws of friction. It opposes the motion. It is proportional to the normal reaction. It depends on the surfaces. "
         "And it does not depend on the area, or, roughly, on the speed.",
         write("laws:  opposes motion;  ∝ R;  depends on the surfaces;", 70, 620, 21, "yellow"),
         write("not on area;  roughly not on speed", 70, 652, 21, "yellow")),

    # ── 4. Worked together: the crate ─────────────────────────────────
    step("Let us work one through together. A twenty kilogram crate rests on a floor. The coefficient of static friction is zero point four, "
         "and of kinetic friction, zero point three. First: what force just starts it moving?",
         clear(2.2),
         heading("A crate, worked together"),
         line(900, 620, 1240, 620, "grey", 2.4), *crate(1010, 620, 120, 80, "20 kg"),
         write("20 kg crate:  μ static 0.4,  μ kinetic 0.3", 70, 190, 24),
         chapter="Worked example: a crate"),

    step("The normal reaction is its weight: two hundred newtons. The limiting friction is zero point four times two hundred: eighty newtons. "
         "Push with anything over eighty, and it moves.",
         write("R = 200 N;   to start:  0.4 × 200 = 80 N", 70, 250, 25, "green")),

    step("To keep it sliding at a steady speed, you only need to beat kinetic friction: zero point three times two hundred, sixty newtons.",
         write("to keep it sliding steadily:  0.3 × 200 = 60 N", 70, 300, 25, "green")),

    step("Push with a hundred newtons, and once it slides, the resultant force is a hundred minus sixty: forty newtons. "
         "Forty over twenty: an acceleration of two metres per second squared.",
         write("push 100 N:  resultant 100 - 60 = 40 N,  a = 2 m s^{-2}", 70, 350, 24, "green")),

    step("And now the question that catches nearly everyone. You push with fifty newtons. What is the friction?",
         write("Push with 50 N.  The friction is ... ?", 70, 430, 26, "pink"),
         pause=2.4),

    step("Not eighty. Fifty. Fifty is less than eighty, so the crate stays put, and static friction simply matches your push. "
         "Mu R is the most friction can be, not what it always is.",
         write("50 N!  It does not move, so friction = your push.", 70, 480, 24, "green"),
         write("μR is the MAXIMUM, not always the value.", 70, 520, 24, "yellow")),

    # ── 5. Braking ────────────────────────────────────────────────────
    step("Friction also decides how quickly a car can stop. A one thousand kilogram car at twenty metres per second skids, "
         "with a coefficient of zero point eight. Friction is eight thousand newtons, so the deceleration is eight metres per second squared.",
         clear(2.2),
         heading("Why wet roads are dangerous"),
         write("1000 kg car at 20 m s^{-1},  μ = 0.8:", 70, 190, 24),
         write("F = 0.8 × 10 000 = 8000 N,   a = 8 m s^{-2}", 70, 230, 24),
         chapter="Braking on dry and wet roads"),

    step("From v squared equals u squared plus two {a} s, it stops in twenty-five metres.",
         write("0 = 20^2 - 2 × 8 × s,    s = 25 m", 70, 280, 25, "green")),

    step("On a wet road, the coefficient halves to zero point four. The deceleration halves, and the stopping distance doubles: fifty metres. "
         "Same car, same driver, same speed. Twice the distance. That is why careful drivers slow down in the rainy season.",
         write("wet road, μ = 0.4:  a = 4 m s^{-2},  s = 50 m", 70, 340, 25, "pink"),
         write("twice the distance", 70, 380, 25, "pink"),
         line(760, 470, 1240, 470, "grey", 2.4), dots([(780, 470)], "white", 6),
         arrow(780, 450, 960, 450, "green"), write("dry: 25 m", 870, 434, 20, "green", "center"),
         arrow(780, 500, 1140, 500, "pink"), write("wet: 50 m", 960, 530, 20, "pink", "center")),

    # ── 6. Your turn: pulling at an angle ─────────────────────────────
    step("Your turn, and it needs some thought. A ten kilogram box is pulled steadily by a rope at thirty degrees above the ground, "
         "with mu equal to zero point five. What tension is needed? Here is a hint: pulling upwards partly lifts the box.",
         clear(2.2),
         heading("Your turn"),
         *stop_sign(1180, 82),
         line(800, 630, 1240, 630, "grey", 2.4), *crate(860, 630, 110, 70, "10 kg"),
         line(970, 595, 1130, 503, "white", 2.6), arrow(1130, 503, 1160, 486, "green"), write("P", 1170, 490, 24, "green"),
         write("30°", 1010, 590, 20, "grey"),
         write("10 kg box, rope at 30°, μ = 0.5, steady pull.", 70, 190, 24),
         write("Find the tension P.  (Hint: it lifts a little.)", 70, 228, 24, "blue"),
         chapter="Your turn: pulling at an angle"),

    step("Take as long as you need. This one is worth the effort.",
         write("worth the effort", 1130, 92, 22, "pink", "right"),
         pause=3.5),

    step("The upward part of the pull, P sine thirty, takes some of the weight off the floor. So R is a hundred minus P sine thirty, "
         "and the friction is zero point five times that.",
         write("R = 100 - P sin 30°   (the rope lifts a little)", 70, 300, 24),
         write("friction = 0.5 (100 - 0.5P)", 70, 340, 24)),

    step("Moving steadily, the forward part, P cos thirty, equals the friction. So zero point eight six six P equals fifty, minus zero point two five P. "
         "That gives P equals forty-four point eight newtons.",
         write("0.866P = 50 - 0.25P,    1.116P = 50,    P = 44.8 N", 70, 400, 24, "green")),

    step("Push down on the box at the same angle instead, and you press it into the floor. R goes up, friction goes up, and you need more force. "
         "So: when you drag something heavy, pull slightly upwards. Your back will thank you.",
         write("pull up at an angle:  less friction.  Push down:  more.", 70, 470, 23, "yellow"),
         pause=1.0),

    step("Next time, friction meets the slope: when does a box start sliding down a hill? And the friction inside liquids, called viscosity.",
         write("Coming up:  friction on slopes,  and viscosity", 70, 560, 24, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Friction", 54, 140, 84, "yellow"),
    write("Static  ·  Limiting  ·  Kinetic  ·  μ = F/R", 60, 210, 30),
    arrow(640, 600, 1180, 600, "white", 3.4), arrow(640, 600, 640, 270, "white", 3.4),
    line(640, 600, 880, 360, "green", 4.0), line(880, 360, 905, 400, "pink", 4.0), line(905, 400, 1160, 400, "pink", 4.0),
    dots([(880, 360)], "yellow", 11),
    write("limiting", 892, 344, 30, "yellow"), write("kinetic", 1160, 386, 28, "pink", "right"),
    write("Harder to start", 70, 420, 42, "pink"), write("than to keep going", 70, 480, 42, "pink"),
]
