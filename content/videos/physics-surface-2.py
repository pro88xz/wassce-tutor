"""Physics · Viscosity and terminal velocity. A chalkboard video lesson.

Follows content/notes/physics-surface-2.md, each idea with its reason: opens on a
race (two steel balls dropped together, one into water, one into honey: "we may be
here a while"); viscosity as the drag between layers, drawn as a velocity profile in
a pipe, with liquids high and low; terminal velocity from the three forces on a ball
in glycerine, why the drag grows until the resultant is zero, and Newton's first law
hiding in the jar; the velocity-time graph, and "your move" on the drag at terminal
velocity; the practical (and why mark A is set well below the surface); viscosity and
temperature, with a motorbike on a cold harmattan morning; and viscosity at work
(shock absorbers and potholes, parachutes, raindrops that are not bullets).

Check: python3 scripts/video/board_video.py content/videos/physics-surface-2.py --boards .video-build/boards/surf2
"""

from board_video import arrow, box, clear, curve, dashed, ellipse, heading, line, step, write

TITLE = "Viscosity and Terminal Velocity Explained: Three Forces, the v-t Graph, the Practical | WASSCE Physics"
DESCRIPTION = ("Viscosity on the chalkboard: a race in water and honey, viscosity as the drag between layers, why a falling "
               "ball reaches terminal velocity (weight, upthrust and drag), the velocity-time graph, comparing viscosities "
               "in the lab, the effect of temperature, and parachutes and shock absorbers.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Viscosity"
# The lesson page this video is on: /wassce/physics/surface-tension-capillarity-and-viscosity/viscosity-and-terminal-velocity
LESSON = "physics/surface-tension-capillarity-and-viscosity/viscosity-and-terminal-velocity"


def pause_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def jar(x, top, bottom, w=90, liquid="blue", level=None):
    """A tall jar from x to x + w, filled to `level`."""
    level = top + 30 if level is None else level
    return [line(x, top, x, bottom, "white", 3.0), line(x, bottom, x + w, bottom, "white", 3.0), line(x + w, bottom, x + w, top, "white", 3.0),
            line(x + 3, level, x + w - 3, level, liquid, 2.6)]


STEPS = [
    # ── 1. A race ─────────────────────────────────────────────────────
    step("Let us have a race. Two tall jars: one of water, one of honey. Drop identical steel balls into both, at the same moment. "
         "The ball in the water hits the bottom almost at once. The ball in the honey? We may be here a while.",
         heading("A race"),
         *jar(840, 200, 560, liquid="blue", level=230), *jar(1060, 200, 560, liquid="yellow", level=230),
         ellipse(885, 544, 14, 14, "white", 3.0), ellipse(1105, 280, 14, 14, "white", 3.0),
         arrow(1105, 300, 1105, 330, "grey", 2.2),
         write("water", 885, 600, 22, "blue", "center"), write("honey", 1105, 600, 22, "yellow", "center"),
         pause=1.0, chapter="A race"),

    step("The difference is viscosity. Honey is far more viscous than water. Viscosity is the internal friction of a fluid: "
         "the drag that opposes one layer of it sliding over another.",
         write("viscosity:  the internal friction of a fluid", 70, 200, 24, "yellow"),
         write("it opposes layers sliding over each other", 70, 236, 24, "yellow")),

    # ── 2. Viscosity ──────────────────────────────────────────────────
    step("Picture a liquid flowing along a pipe. The layer touching the wall hardly moves. Each layer further in slides a little faster than the one outside it, "
         "and the fastest is in the middle. Viscosity is the drag between those layers.",
         clear(2.2),
         heading("Viscosity"),
         line(700, 220, 1220, 220, "white", 3.4), line(700, 480, 1220, 480, "white", 3.4),
         *[arrow(760, y, 760 + L, y, "blue", 2.4) for y, L in ((240, 40), (275, 150), (310, 240), (350, 290), (390, 240), (425, 150), (460, 40))],
         write("slow at the wall,  fastest in the middle", 960, 530, 20, "grey", "center"),
         write("layer at the wall:  almost still", 70, 200, 23),
         write("each layer in:  a little faster", 70, 236, 23),
         write("viscosity:  the drag between the layers", 70, 280, 23, "yellow"),
         chapter="Viscosity"),

    step("High viscosity: honey, engine oil, glycerine, tar, and palm oil on a cool morning. Low viscosity: water, petrol, kerosene, and air.",
         write("high:  honey,  engine oil,  glycerine,  tar,", 70, 360, 23, "pink"),
         write("palm oil  (when cool)", 70, 396, 23, "pink"),
         write("low:  water,  petrol,  kerosene,  air", 70, 450, 23, "green")),

    # ── 3. Terminal velocity ──────────────────────────────────────────
    step("Now drop a steel ball into a tall jar of glycerine. Three forces act on it. Its weight, pulling down. The upthrust, pushing up, "
         "as on anything in a fluid. And the viscous drag, also pushing up. And this one grows as the ball speeds up.",
         clear(2.2),
         heading("Terminal velocity"),
         *jar(960, 180, 600, w=180, liquid="yellow", level=210),
         ellipse(1050, 380, 22, 22, "white", 3.0),
         arrow(1050, 404, 1050, 500, "pink", 3.2), write("W", 1064, 488, 22, "pink"),
         arrow(1036, 360, 1036, 280, "blue", 3.0), write("U", 1022, 290, 22, "blue", "right"),
         arrow(1064, 360, 1064, 300, "green", 3.0), write("F", 1078, 310, 22, "green"),
         write("weight  W:  down", 70, 200, 23, "pink"),
         write("upthrust  U:  up", 70, 236, 23, "blue"),
         write("viscous drag  F:  up,  and it grows with speed", 70, 272, 23, "green"),
         chapter="Terminal velocity"),

    step("At first, the weight wins, so the ball speeds up. But as it speeds up, the drag grows, until the upthrust plus the drag exactly balance the weight. "
         "The resultant force is zero. From then on, the ball falls at a steady speed: its terminal velocity.",
         write("at first:  W > U + F,  so it speeds up", 70, 340, 23),
         write("then:   W = U + F", 70, 390, 28, "yellow"),
         write("zero resultant force:  a steady speed,", 70, 440, 23, "yellow"),
         write("the terminal velocity", 70, 476, 23, "yellow")),

    step("Notice the word zero. At terminal velocity, the ball is still moving, and quite fast. But it is no longer speeding up. "
         "No resultant force, no acceleration. That is Newton's first law, hiding in a jar of glycerine.",
         write("still moving,  not accelerating:  Newton's first law", 70, 540, 22, "green"),
         pause=0.8),

    # ── 4. The velocity-time graph ────────────────────────────────────
    step("The exam often asks you to sketch the velocity-time graph. It rises steeply at first, then curves over, "
         "and levels off into a flat line, at the terminal velocity.",
         clear(2.2),
         heading("The velocity-time graph"),
         arrow(760, 560, 1210, 560, "white", 3.0), arrow(760, 560, 760, 220, "white", 3.0),
         write("time", 1210, 594, 20, "grey", "right"), write("velocity", 774, 234, 20, "grey"),
         dashed(760, 320, 1190, 320, "grey", 2.0), write("terminal velocity", 1190, 306, 20, "grey", "right"),
         curve([(760, 560), (800, 450), (850, 384), (920, 345), (1010, 328), (1110, 322), (1190, 321)], "green", 3.4),
         write("rises steeply,  then levels off", 70, 200, 23, "green"),
         write("at the terminal velocity", 70, 236, 23, "green"),
         chapter="The velocity-time graph"),

    step("Your move. A ball of weight zero point two newtons falls through oil at its terminal velocity. The upthrust on it is zero point zero three newtons. "
         "What is the viscous drag? Stop the video and work it out.",
         *pause_sign(1180, 82),
         write("Your move:  W = 0.20 N,  U = 0.03 N,", 70, 320, 24, "blue"),
         write("at terminal velocity.   The drag F?", 70, 356, 24, "blue"),
         pause=3.0),

    step("At terminal velocity, the weight equals the upthrust plus the drag. So the drag is zero point two minus zero point zero three: zero point one seven newtons.",
         write("W = U + F,   so", 70, 430, 25, "green"),
         write("F = 0.20 - 0.03 = 0.17 N", 70, 474, 25, "green")),

    # ── 5. The practical ──────────────────────────────────────────────
    step("To compare two liquids in the lab, fill two tall cylinders, one with glycerine and one with engine oil. Mark two levels, A and B, well below the surface. "
         "Drop identical steel balls, and time each one from A to B. The longer time means the more viscous liquid.",
         clear(2.2),
         heading("The practical:  comparing viscosities"),
         *jar(860, 170, 560, w=110, liquid="yellow", level=200), *jar(1080, 170, 560, w=110, liquid="pink", level=200),
         *[line(x - 10, y, x + 120, y, "white", 2.0) for x in (860, 1080) for y in (330, 490)],
         *[write(t, x - 18, y + 6, 20, "white", "right") for x in (860, 1080) for t, y in (("A", 330), ("B", 490))],
         write("glycerine", 915, 600, 20, "yellow", "center"), write("engine oil", 1135, 600, 20, "pink", "center"),
         write("time each ball from A to B:", 70, 200, 23),
         write("the longer time:  the more viscous liquid", 70, 236, 23, "green"),
         chapter="The practical"),

    step("Why mark A so far down? So that the ball has already reached its terminal velocity before you start the clock. "
         "Also: use identical balls, drop them down the middle, away from the walls, and keep both liquids at the same temperature.",
         write("A well below the surface:", 70, 300, 23, "yellow"),
         write("terminal velocity before the clock starts", 70, 336, 23, "yellow"),
         write("precautions:  identical balls,  drop centrally,", 70, 400, 22, "grey"),
         write("same temperature", 70, 434, 22, "grey")),

    # ── 6. Temperature ────────────────────────────────────────────────
    step("Temperature matters. Warm a liquid, and its viscosity falls: warm honey, or warm palm oil, pours easily. "
         "Gases are the odd one out: their viscosity rises slightly when they are hot.",
         clear(2.2),
         heading("Viscosity and temperature"),
         write("liquids:  warmer,  LESS viscous", 70, 200, 24, "green"),
         write("(warm honey and palm oil pour easily)", 70, 236, 22, "grey"),
         write("gases:  warmer,  slightly MORE viscous", 70, 290, 24, "pink"),
         chapter="Viscosity and temperature"),

    step("On a cold harmattan morning, a motorbike can be slow to start, because the engine oil is thick. Once the engine warms up, "
         "the oil thins, and flows easily round the moving parts. That is why motor oil is graded: to stay just viscous enough, cold or hot.",
         write("a cold harmattan morning:  thick engine oil", 70, 360, 23),
         write("the engine warms:  the oil thins and flows", 70, 396, 23),
         ellipse(900, 520, 40, 40, "white", 3.0), ellipse(1120, 520, 40, 40, "white", 3.0),
         line(900, 520, 990, 440, "white", 3.0), line(990, 440, 1090, 440, "white", 3.0), line(1090, 440, 1120, 520, "white", 3.0),
         line(990, 440, 1010, 410, "white", 3.0), line(1060, 440, 1050, 400, "white", 3.0), line(1040, 400, 1070, 398, "white", 3.0),
         box(965, 462, 70, 42, "white", 2.8), write("thick oil", 1000, 600, 20, "pink", "center"),
         write("brrr...", 1170, 420, 22, "blue", "right")),

    # ── 7. Viscosity at work ──────────────────────────────────────────
    step("Viscosity is useful. Lubricating oil keeps a film between moving parts. Shock absorbers push oil through tiny holes to calm the bouncing: "
         "thank them every time a poda-poda hits a pothole. And streamlined cars and aircraft cut the drag of the air.",
         clear(2.2),
         heading("Viscosity at work"),
         write("lubricating oil:  a film between moving parts", 70, 200, 23),
         write("shock absorbers:  oil through tiny holes", 70, 240, 23),
         write("streamlining:  less drag", 70, 280, 23),
         chapter="Viscosity at work"),

    step("And a parachute is a terminal velocity machine. It makes the drag huge, so the terminal velocity is low enough to land safely. "
         "Raindrops are the same: thanks to the viscosity of the air, they reach a gentle terminal velocity, instead of hitting you like bullets.",
         curve([(880, 300), (940, 230), (1000, 215), (1060, 230), (1120, 300)], "yellow", 3.2), line(880, 300, 1120, 300, "yellow", 2.4),
         line(880, 300, 990, 420, "white", 1.8), line(1120, 300, 1010, 420, "white", 1.8), line(1000, 300, 1000, 420, "white", 1.8),
         ellipse(1000, 432, 10, 10, "white", 2.6), line(1000, 442, 1000, 476, "white", 2.6),
         arrow(1180, 290, 1180, 200, "green", 2.8), write("huge drag", 1168, 190, 20, "green", "right"),
         write("a parachute:  huge drag,  low terminal velocity", 70, 340, 23, "green"),
         write("raindrops:  gentle,  not bullets", 70, 380, 23, "blue"),
         pause=0.9),

    step("That completes surface tension and viscosity. Next, we dive into fluids: pressure under water, and why a ship made of steel can float. Archimedes.",
         write("Next:  pressure in fluids,  and Archimedes", 70, 480, 24, "yellow"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Terminal Velocity", 54, 140, 78, "yellow"),
    write("viscosity  ·  three forces  ·  the v-t graph", 60, 210, 30),
    *jar(150, 280, 620, w=170, liquid="yellow", level=305), ellipse(235, 450, 26, 26, "white", 3.4),
    arrow(235, 478, 235, 580, "pink", 4.0), arrow(218, 424, 218, 330, "blue", 3.6), arrow(252, 424, 252, 345, "green", 3.6),
    write("W = U + F", 350, 470, 46, "yellow"),
    arrow(760, 600, 1210, 600, "white", 3.4), arrow(760, 600, 760, 290, "white", 3.4),
    dashed(760, 370, 1190, 370, "grey", 2.4),
    curve([(760, 600), (800, 490), (850, 426), (920, 392), (1010, 376), (1110, 371), (1190, 370)], "green", 4.0),
]
