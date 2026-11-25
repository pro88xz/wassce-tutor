"""Physics · Elasticity: elasticity and Hooke's law. A chalkboard video lesson.

Follows content/notes/physics-elasticity-1.md, each idea with its reason: opens on
the spring scale at a market stall, drawn with a fish on its hook (how does a plain
spring know how heavy your fish is?), and the secret: twice the load, twice the
stretch, which is why its marks are evenly spaced; elastic and plastic, with springs
drawn before, loaded, unloaded and overstretched; Hooke's law with the condition
examiners mark, F = ke, and extension as the increase in length; a spring worked
through, with "try this before I do" and the 6 cm against 26 cm trap; the
load-extension graph of a wire, point by point; the practical, with precautions;
and the energy stored, with "over to you" and the cm-to-m trap.

Check: python3 scripts/video/board_video.py content/videos/physics-elasticity-1.py --boards .video-build/boards/elas1
"""

from board_video import arrow, box, clear, curve, dashed, dots, double_arrow, ellipse, equation, heading, line, step, write, zigzag

TITLE = "Hooke's Law Explained: Elasticity, F = ke, the Elastic Limit and the Load-Extension Graph | WASSCE Physics"
DESCRIPTION = ("Hooke's law on the chalkboard: how a market spring scale works, elastic and plastic, Hooke's law and F = ke, "
               "extension, a spring worked through, the load-extension graph (limit of proportionality, elastic limit, "
               "yield point, breaking point), the practical, and the energy stored in a spring.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Elasticity"
# The lesson page this video is on: /wassce/physics/elasticity-and-hooke-s-law/elasticity-and-hookes-law
LESSON = "physics/elasticity-and-hooke-s-law/elasticity-and-hookes-law"


def pause_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def spring(x, top, bottom, color="white", n=10):
    """A hanging spring from (x, top) to (x, bottom)."""
    return zigzag(x, top, x, bottom, n=n, amp=13, color=color, width=2.6)


def mass(x, y, label="", color="pink"):
    """A small hanging mass, its top centre at (x, y)."""
    out = [box(x - 22, y, 44, 34, color, 2.8)]
    if label:
        out.append(write(label, x + 32, y + 24, 20, color))
    return out


STEPS = [
    # ── 1. The market spring scale ────────────────────────────────────
    step("Look at the spring scale at a market stall. Hang a fish on the hook, and the pointer slides down to show its weight. "
         "But how does a plain spring know how heavy your fish is?",
         heading("How does a spring weigh a fish?"),
         ellipse(1000, 172, 14, 14, "white", 2.8), box(950, 190, 100, 270, "white", 3.0),
         *[line(1030, y, 1046, y, "grey", 2.0) for y in range(220, 445, 22)],
         spring(990, 196, 330), arrow(990, 336, 1028, 336, "pink", 3.0),
         line(990, 336, 990, 470, "white", 2.6), curve([(990, 470), (990, 488), (1002, 497), (1013, 487)], "white", 2.6),
         line(1002, 497, 992, 512, "yellow", 2.6), line(1002, 497, 1012, 512, "yellow", 2.6),
         ellipse(1002, 560, 24, 50, "yellow", 2.8), dots([(1000, 592)], "yellow", 5.0),
         pause=1.2, chapter="The spring scale"),

    step("Here is the secret. Double the load, and the spring stretches exactly twice as far. Treble it, and it stretches three times as far. "
         "The stretch keeps in step with the force. That is Hooke's law, and it is why the marks on the scale are evenly spaced.",
         write("double the load:   double the stretch", 70, 200, 25),
         write("treble the load:   treble the stretch", 70, 240, 25),
         write("Hooke's law:  evenly spaced marks!", 70, 300, 26, "yellow"),
         pause=0.6),

    # ── 2. Elastic or plastic ─────────────────────────────────────────
    step("First, two words. A material is elastic if it goes back to its original shape and size when the force is taken away. "
         "A spring, a catapult rubber, the sole of your sandal.",
         clear(2.2),
         heading("Elastic or plastic?"),
         line(760, 200, 1235, 200, "grey", 3.0),
         spring(790, 200, 320), write("at rest", 790, 470, 18, "grey", "center"),
         spring(905, 200, 400), *mass(905, 400), write("loaded", 905, 470, 18, "grey", "center"),
         spring(1020, 200, 320, "green"), write("back", 1020, 470, 18, "green", "center"),
         write("elastic:  back to its original shape and size", 70, 190, 23, "green"),
         write("when the force is removed", 70, 226, 23, "green"),
         chapter="Elastic and plastic"),

    step("A material that stays deformed is plastic: plasticine, wet clay, chewing gum. And many things are elastic for small forces, but plastic for big ones. "
         "Stretch a spring too far, and it never quite comes back. Ask anyone who has stretched a pen spring in class.",
         spring(1160, 200, 380, "pink", n=8), write("too far", 1160, 470, 18, "pink", "center"),
         write("now longer", 1160, 496, 18, "pink", "center"),
         write("plastic:  stays deformed", 70, 300, 23, "pink"),
         write("(plasticine,  wet clay,  chewing gum)", 70, 336, 21, "grey"),
         write("elastic for small forces,  plastic for big ones", 70, 400, 23, "yellow"),
         pause=0.9),

    # ── 3. Hooke's law ────────────────────────────────────────────────
    step("Now the law itself. Hooke's law: the extension of an elastic material is directly proportional to the force on it, "
         "provided the elastic limit is not exceeded. Learn that last part. Examiners take a mark away without it.",
         clear(2.2),
         heading("Hooke's law"),
         write("the extension is directly proportional to the force,", 70, 190, 24),
         write("provided the elastic limit is not exceeded", 70, 228, 24, "pink"),
         chapter="Hooke's law"),

    step("In symbols: F equals k e. F is the force in newtons, e is the extension in metres, and k is the spring constant, in newtons per metre. "
         "A big k means a stiff spring: it takes a lot of force to stretch it a little.",
         write("F = ke", 90, 320, 44, "yellow"), box(70, 274, 250, 66, "yellow", 2.6),
         write("F:  force  (N)", 355, 292, 22), write("e:  extension  (m)", 355, 326, 22),
         write("k:  spring constant  (N m^{-1})", 70, 400, 22),
         write("big k:  a stiff spring", 70, 440, 22, "green"),
         line(940, 300, 1230, 300, "grey", 3.0),
         spring(990, 300, 420), double_arrow(950, 302, 950, 420, "grey", 2.2), write("l_0", 938, 370, 20, "grey", "right")),

    step("Careful with e. It is the extension: the increase in length. The new length, minus the natural length. Not the new length itself.",
         spring(1130, 300, 470, "white", n=12), *mass(1130, 470),
         dashed(960, 420, 1180, 420, "grey", 2.0), double_arrow(1200, 422, 1200, 468, "pink", 2.4), write("e", 1214, 452, 22, "pink"),
         write("e = l - l_0:   the INCREASE in length", 70, 520, 24, "pink")),

    # ── 4. A spring worked through ────────────────────────────────────
    step("A spring of natural length twenty centimetres stretches to twenty-four centimetres when a six newton weight hangs on it. "
         "What is its spring constant?",
         clear(2.2),
         heading("A spring,  worked through"),
         write("natural length 20 cm;   24 cm with 6 N on it.   k?", 70, 190, 24),
         line(1000, 190, 1200, 190, "grey", 3.0), spring(1100, 190, 350), *mass(1100, 350, "6 N"),
         chapter="Worked example: finding k"),

    step("The extension is twenty-four minus twenty: four centimetres, which is zero point zero four metres. "
         "So k is six over zero point zero four: one hundred and fifty newtons per metre.",
         write("e = 24 - 20 = 4 cm = 0.04 m", 70, 250, 25),
         equation(["k =", ("F", "e"), "=", ("6", "0.04"), "= 150 N m^{-1}"], 70, 330, 27, "green")),

    step("Now hang nine newtons on it instead. How long is the spring now? Try this before I do.",
         write("Try this:   9 N on the same spring.   Its length?", 70, 420, 24, "blue"),
         pause=2.6),

    step("The extension is nine over a hundred and fifty: zero point zero six metres, six centimetres. So the length is twenty plus six: twenty-six centimetres. "
         "If you said six centimetres, that is the trap. Six is the stretch. Twenty-six is the length.",
         write("e = 9 ÷ 150 = 0.06 m = 6 cm;    length = 20 + 6 = 26 cm", 70, 470, 24, "green"),
         write("the trap:  6 cm is the stretch,  not the length", 70, 520, 23, "pink")),

    # ── 5. The load-extension graph ───────────────────────────────────
    step("Now load a metal wire, more and more, and plot load against extension. At first, a straight line through the origin: "
         "that is Hooke's law. With load on the vertical axis, its gradient is the spring constant.",
         clear(2.2),
         heading("The load-extension graph"),
         arrow(780, 580, 1210, 580, "white", 3.0), arrow(780, 580, 780, 190, "white", 3.0),
         write("extension", 1210, 614, 20, "grey", "right"), write("load", 794, 204, 20, "grey"),
         line(780, 580, 960, 380, "green", 3.4), dots([(960, 380)], "white", 8.0), write("P", 944, 372, 22, "white", "right"),
         write("O to P:  straight:  Hooke's law", 70, 200, 23, "green"),
         write("gradient = k", 70, 236, 23, "green"),
         chapter="The load-extension graph"),

    step("At P, the limit of proportionality, the line starts to curve. Just beyond it is E, the elastic limit: "
         "the biggest load the wire can take, and still come back to its original length.",
         curve([(960, 380), (978, 362), (994, 350)], "yellow", 3.4), dots([(994, 350)], "white", 8.0), write("E", 982, 336, 22, "white", "right"),
         write("P:  limit of proportionality", 70, 290, 23),
         write("E:  elastic limit", 70, 326, 23)),

    step("Go past E, and the wire is changed for good: take the load off, and it stays a little longer. That is a permanent set. "
         "At Y, the yield point, it suddenly stretches a lot for very little extra load. It starts to flow, like warm toffee. And at B, it snaps.",
         curve([(994, 350), (1018, 336), (1044, 330), (1090, 328), (1140, 310), (1180, 300)], "pink", 3.4),
         dots([(1044, 330), (1180, 300)], "white", 8.0), write("Y", 1044, 316, 22, "white", "center"), write("B", 1180, 286, 22, "white", "center"),
         write("beyond E:  a permanent set", 70, 380, 23, "pink"),
         write("Y:  yield point:  it starts to flow", 70, 416, 23, "pink"),
         write("B:  breaking point", 70, 452, 23, "pink")),

    step("Quick check. A spring is loaded beyond its elastic limit. What happens when the load is taken off?",
         write("Quick check:  loaded past its elastic limit,", 70, 520, 23, "blue"),
         write("then unloaded.   What happens?", 70, 556, 23, "blue"),
         pause=2.2),

    step("It does not return to its original length. It is permanently stretched.",
         write("it stays permanently stretched", 70, 600, 23, "green")),

    # ── 6. The practical ──────────────────────────────────────────────
    step("In the practical, you verify Hooke's law. Clamp a spring beside a metre rule, with a pointer at its lower end. "
         "Read the pointer with no load. Then add loads in equal steps, reading the pointer each time.",
         clear(2.2),
         heading("The practical:  verifying Hooke's law"),
         line(800, 600, 960, 600, "white", 3.4), line(820, 600, 820, 168, "white", 3.4), line(820, 174, 1000, 174, "white", 3.4),
         spring(980, 174, 330), arrow(980, 336, 1040, 336, "yellow", 2.8),
         box(1045, 180, 34, 410, "white", 2.6), *[line(1045, y, 1060 if y % 50 else 1068, y, "grey", 1.8) for y in range(200, 580, 25)],
         line(980, 336, 980, 356, "white", 2.4), *[box(955, 356 + 18 * i, 50, 18, "pink", 2.6) for i in range(3)],
         write("1.  a spring beside a metre rule,", 70, 190, 23),
         write("     a pointer at its lower end", 70, 224, 23),
         write("2.  read with no load,  then add equal loads", 70, 266, 23),
         chapter="The practical"),

    step("Then take the loads off one by one, and read again. If the readings match, you never passed the elastic limit. "
         "Plot load against extension. A straight line through the origin verifies the law, and its gradient is k.",
         write("3.  unload:  the readings should match", 70, 308, 23),
         write("4.  plot load against extension:", 70, 350, 23, "green"),
         write("     a straight line through the origin", 70, 384, 23, "green")),

    step("Precautions: read the pointer at eye level, to avoid parallax. Let the spring stop bouncing before you read. And do not overload it.",
         write("precautions:  eye level  (parallax),", 70, 450, 22, "grey"),
         write("let it settle,  do not overload", 70, 484, 22, "grey")),

    # ── 7. Energy stored ──────────────────────────────────────────────
    step("Last: a stretched spring stores energy. The work done stretching it is the area under the force-extension graph. "
         "That area is a triangle: a half, times F, times e. Or, since F is k e, a half k e squared.",
         clear(2.2),
         heading("Energy in a stretched spring"),
         arrow(860, 540, 1210, 540, "white", 3.0), arrow(860, 540, 860, 240, "white", 3.0),
         write("e", 1210, 574, 20, "grey", "right"), write("F", 874, 254, 20, "grey"),
         line(860, 540, 1130, 320, "green", 3.2),
         *[line(860 + 18 * i, 540, 860 + 18 * i, 540 - 0.815 * 18 * i, "green", 1.6) for i in range(1, 15)],
         write("area = work done", 1020, 612, 20, "green", "center"), arrow(1020, 590, 1020, 512, "green", 2.2),
         equation(["W =", ("1", "2"), "Fe =", ("1", "2"), "ke^2"], 70, 230, 30, "yellow"),
         chapter="Energy stored in a spring"),

    step("Over to you. Our spring, with k of one hundred and fifty, is stretched by four centimetres. How much energy does it store? "
         "Stop the video, and work it out.",
         *pause_sign(1180, 82),
         write("Over to you:  k = 150 N m^{-1},  stretched 4 cm.", 70, 340, 23, "blue"),
         write("Energy stored?", 70, 376, 23, "blue"),
         pause=3.0),

    step("A half, times one hundred and fifty, times zero point zero four squared: zero point one two joules. "
         "Forget to change the centimetres into metres, and you get twelve hundred joules. Enough to fire a catapult stone into next week.",
         equation(["W =", ("1", "2"), "× 150 × 0.04^2 = 0.12 J"], 70, 450, 26, "green"),
         write("forget cm to m:   1200 J!", 70, 530, 23, "pink"),
         pause=0.9),

    step("Next time: why engineers talk about stress and strain instead, Young's modulus, and what happens when you hang one spring below another.",
         write("Next:  stress,  strain,  Young's modulus", 70, 600, 24, "yellow"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Hooke's Law", 54, 140, 84, "yellow"),
    write("F = ke  ·  elastic limit  ·  load-extension graph", 60, 210, 30),
    line(130, 300, 430, 300, "grey", 3.4), zigzag(280, 300, 280, 500, n=12, amp=18, width=3.2), box(245, 500, 70, 54, "pink", 3.4),
    write("F = ke", 470, 430, 70, "yellow"),
    arrow(860, 600, 1220, 600, "white", 3.4), arrow(860, 600, 860, 290, "white", 3.4),
    line(860, 600, 1020, 440, "green", 4.0), curve([(1020, 440), (1060, 410), (1120, 396), (1200, 380)], "pink", 4.0),
]
