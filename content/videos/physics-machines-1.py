"""Physics · Simple machines: mechanical advantage, velocity ratio, levers and pulleys. A chalkboard video lesson.

Follows content/notes/physics-machines-1.md, each idea with its reason: opens on
the promise made at the end of the last lesson (one person lifting a car with a
pole and a stone), worked by moments, and its catch: less force, more distance
(physics as a market woman who discounts the force and charges the difference in
distance); what a machine is and the three ways it helps; MA, VR and efficiency,
with efficiency = MA/VR rebuilt from work out over work in rather than memorised;
why no real machine is perfect, and a quick check; the three classes of lever by
"what is in the middle", and why anyone would build a third-class lever (the
forearm, built for speed); a wheelbarrow worked by moments; fixed and movable
pulleys and why the VR of a block and tackle is the number of supporting strands;
and a block and tackle to try, with the wasted work found.

Check: python3 scripts/video/board_video.py content/videos/physics-machines-1.py --boards .video-build/boards/mach1
"""

from board_video import arrow, box, clear, curve, double_arrow, ellipse, equation, heading, line, step, write

TITLE = "Simple Machines: Mechanical Advantage, Velocity Ratio, Efficiency, Levers and Pulleys | WASSCE Physics"
DESCRIPTION = ("Simple machines on the chalkboard: lifting a car with a pole, mechanical advantage, velocity ratio and why "
               "efficiency = MA/VR, why no machine is perfect, the three classes of lever, a wheelbarrow worked by moments, "
               "and pulleys and the block and tackle.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Simple machines"
# The lesson page this video is on: /wassce/physics/simple-machines/machines-mechanical-advantage-velocity-ratio-levers-and-pulleys
LESSON = "physics/simple-machines/machines-mechanical-advantage-velocity-ratio-levers-and-pulleys"


def pause_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def pivot(x, y, color="white", s=1.0):
    """A triangular pivot with its tip at (x, y)."""
    w, h = 28 * s, 40 * s
    return [line(x - w, y + h, x, y, color, 3.0), line(x, y, x + w, y + h, color, 3.0), line(x - w, y + h, x + w, y + h, color, 3.0)]


def car(x, y, s=1.0, color="white"):
    """A car side on: its body's top-left corner at (x, y)."""
    w, h = 250 * s, 72 * s
    return [box(x, y, w, h, color, 3.0),
            line(x + 50 * s, y, x + 80 * s, y - 45 * s, color, 3.0), line(x + 80 * s, y - 45 * s, x + 190 * s, y - 45 * s, color, 3.0),
            line(x + 190 * s, y - 45 * s, x + 220 * s, y, color, 3.0),
            ellipse(x + 50 * s, y + h + 18 * s, 18 * s, 18 * s, color, 2.8), ellipse(x + 200 * s, y + h + 18 * s, 18 * s, 18 * s, color, 2.8)]


def lever(x0, x1, y, fulcrum, load, effort, effort_up=False):
    """A small lever diagram: the bar from x0 to x1 at height y, a pivot, the load (down) and the effort."""
    out = [line(x0, y, x1, y, "white", 4.0), *pivot(fulcrum, y, "white", 0.8),
           arrow(load, y - 66, load, y - 8, "pink"), write("L", load, y - 78, 22, "pink", "center")]
    if effort_up:
        out += [arrow(effort, y + 62, effort, y + 8, "green"), write("E", effort + 20, y + 52, 22, "green")]
    else:
        out += [arrow(effort, y - 66, effort, y - 8, "green"), write("E", effort, y - 78, 22, "green", "center")]
    return out


STEPS = [
    # ── 1. The promise: lift a car ────────────────────────────────────
    step("At the end of the last lesson I made you a promise: that one person can lift a car. Let us keep it. "
         "Take a long, strong pole. Put a big stone under it, close to the car. Then push down on the far end.",
         heading("Lift a car by yourself?"),
         line(480, 560, 1230, 560, "grey", 2.4), *car(500, 450),
         line(730, 522, 1220, 522, "yellow", 4.4), *pivot(800, 522),
         arrow(1200, 420, 1200, 512, "green"), write("you", 1200, 405, 22, "green", "center"),
         pause=0.6, chapter="Lifting a car with a lever"),

    step("The front of the car presses down with about six thousand newtons, just zero point three metres from the stone. "
         "You push three metres from the stone. Now use the principle of moments, from our lesson on moments: "
         "E times three equals six thousand times zero point three.",
         arrow(740, 360, 740, 444, "pink"), write("6000 N", 740, 345, 22, "pink", "center"),
         double_arrow(732, 600, 798, 600, "grey", 2.4), write("0.3 m", 765, 632, 20, "grey", "center"),
         double_arrow(802, 600, 1198, 600, "grey", 2.4), write("3 m", 1000, 632, 20, "grey", "center"),
         write("E × 3 = 6000 × 0.3", 70, 200, 28)),

    step("E is six hundred newtons. That is about your own weight. You do not even need to push. You just lean on it.",
         write("E = 600 N:  your own weight!", 70, 255, 26, "green"),
         write("600 N", 1200, 378, 22, "green", "center"),
         pause=0.9),

    step("But there is a catch. Push your end down one metre, and the car rises only ten centimetres. "
         "You used a tenth of the force, but you had to move ten times as far.",
         write("your end goes down 1 m;", 70, 330, 24),
         write("the car rises only 0.1 m", 70, 366, 24)),

    step("Physics is like a clever market woman. She gives you a big discount on the force, then quietly charges you the difference in distance. "
         "You never get something for nothing.",
         write("less force,  more distance", 70, 440, 26, "yellow"),
         pause=1.1),

    # ── 2. What is a machine? ─────────────────────────────────────────
    step("That pole is a machine. A machine is any device in which a force applied at one point, the effort, "
         "overcomes a force at another point, the load.",
         clear(2.2),
         heading("What is a machine?"),
         write("machine:  an effort at one point overcomes", 70, 190, 26),
         write("a load at another point", 70, 228, 26),
         chapter="What is a machine?"),

    step("Machines help in three ways. They let a small effort overcome a big load, like our pole. "
         "They change the direction of a force, like the pulley on the school flagpole: you pull down, and the flag goes up. "
         "And some move the load further and faster, like a broom: your hands move a little, and the end sweeps a lot.",
         write("1.  small effort,  big load   (the pole)", 70, 310, 24, "green"),
         write("2.  change the direction   (the flag pulley)", 70, 360, 24, "green"),
         write("3.  move the load further and faster   (a broom)", 70, 410, 24, "green"),
         line(1080, 610, 1080, 190, "grey", 3.0), ellipse(1092, 182, 12, 12, "white", 2.6),
         line(1104, 182, 1104, 560, "white", 2.0), box(1104, 250, 90, 56, "pink", 2.8),
         arrow(1124, 470, 1124, 560, "green"), arrow(1214, 330, 1214, 250, "blue")),

    # ── 3. MA, VR and efficiency ──────────────────────────────────────
    step("Every machine is judged by three numbers. First, mechanical advantage: the load divided by the effort. "
         "For our pole, six thousand over six hundred: ten. The machine multiplies your force by ten.",
         clear(2.2),
         heading("Three numbers for every machine"),
         equation(["MA =", ("load", "effort"), "=", ("6000", "600"), "= 10"], 70, 220, 28, "yellow"),
         chapter="MA, VR and efficiency"),

    step("Second, velocity ratio: the distance the effort moves, divided by the distance the load moves, in the same time. "
         "One metre over zero point one metre: also ten. Both are ratios, a force over a force, a distance over a distance, so neither has a unit.",
         equation(["VR =", ("distance moved by effort", "distance moved by load"), "=", ("1", "0.1"), "= 10"], 70, 320, 26, "yellow"),
         write("ratios:  no units", 1000, 330, 23, "grey")),

    step("Third, efficiency: the work you get out, over the work you put in. Now watch where the famous formula comes from. "
         "Work out is the load, times the distance the load moves. Work in is the effort, times the distance the effort moves.",
         equation(["efficiency =", ("work out", "work in"), "=", ("L × d_L", "E × d_E"), "× 100%"], 70, 450, 26)),

    step("Now regroup it. Load over effort is the mechanical advantage. And the load's distance over the effort's distance is one over the velocity ratio. "
         "So efficiency is the mechanical advantage over the velocity ratio, times a hundred percent. "
         "Not a formula to learn by heart. One you can rebuild in the exam hall in ten seconds.",
         equation(["=", ("L", "E"), "×", ("d_L", "d_E"), "× 100%   =", ("MA", "VR"), "× 100%"], 213, 560, 26, "green"),
         pause=0.8),

    # ── 4. Why no machine is perfect ──────────────────────────────────
    step("Our pole was perfect: ten and ten, a hundred percent. Real machines never are. Some of your work goes into fighting friction at the moving parts, "
         "some into lifting the moving parts of the machine itself, and a little into bending and stretching it.",
         clear(2.2),
         heading("Why no machine is perfect"),
         write("work is wasted:", 70, 190, 25),
         write("1.  against friction at the moving parts   (heat)", 70, 235, 24),
         write("2.  lifting moving parts of the machine itself", 70, 275, 24),
         write("3.  bending and stretching its parts", 70, 315, 24),
         ellipse(1090, 270, 52, 52, "white", 3.0), ellipse(1090, 270, 7, 7, "white", 2.4),
         line(1038, 270, 1038, 380, "white", 2.2), line(1142, 270, 1142, 380, "white", 2.2),
         *[line(1050 + 28 * i, 205, 1040 + 28 * i, 182, "pink", 2.4) for i in range(4)],
         *[line(1040 + 28 * i, 182, 1052 + 28 * i, 156, "pink", 2.4) for i in range(4)],
         write("heat", 1170, 178, 20, "pink"),
         chapter="Why efficiency is below 100%"),

    step("So in a real machine, the mechanical advantage is always less than the velocity ratio. The velocity ratio depends only on the shape of the machine. "
         "The mechanical advantage also depends on friction, and on the load. Oil the machine, make its moving parts lighter, and it improves.",
         write("real machine:   MA < VR,   so  η < 100%", 70, 390, 25, "yellow"),
         write("VR: the shape only.    MA: also friction and load", 70, 432, 24),
         write("better:  oil it;  lighter moving parts", 70, 474, 24, "green")),

    step("Quick check. A machine of velocity ratio five lifts four hundred newtons with an effort of a hundred newtons. "
         "What is its mechanical advantage, and its efficiency?",
         write("Quick check:   VR = 5,   load 400 N,   effort 100 N.   MA?   η?", 70, 548, 23, "blue"),
         pause=2.6),

    step("Mechanical advantage: four hundred over a hundred, four. Efficiency: four over five, eighty percent.",
         write("MA = 400 ÷ 100 = 4;     η = 4 ÷ 5 × 100% = 80%", 70, 598, 24, "green")),

    # ── 5. Levers ─────────────────────────────────────────────────────
    step("Now the simplest machine of all, the lever: a rigid bar that turns about a fixed point, the fulcrum. "
         "Where the fulcrum, the load and the effort sit decides the class of the lever. And here is the trick: look at what is in the middle.",
         clear(2.2),
         heading("Three classes of lever"),
         write("lever:  a rigid bar turning about a fulcrum", 70, 180, 25),
         write("the class:  what is in the middle?", 70, 222, 25, "yellow"),
         chapter="Levers"),

    step("Class one has the fulcrum in the middle. A see-saw, a crowbar, a pair of scissors, and the pole under our car.",
         *lever(80, 380, 340, 230, 100, 360),
         write("class 1", 230, 440, 24, "yellow", "center"),
         write("fulcrum in the middle", 230, 474, 20, "white", "center"),
         write("see-saw,  crowbar,  scissors", 230, 508, 18, "grey", "center")),

    step("Class two has the load in the middle. A wheelbarrow: the wheel is the fulcrum, the sand sits in the middle, and you lift the handles. "
         "Your hands are always further from the fulcrum than the load is, so a class two lever always multiplies your force.",
         *lever(490, 790, 340, 500, 630, 780, effort_up=True),
         write("class 2", 640, 440, 24, "yellow", "center"),
         write("load in the middle", 640, 474, 20, "white", "center"),
         write("wheelbarrow,  bottle opener", 640, 508, 18, "grey", "center"),
         write("MA > 1,  always", 640, 546, 20, "green", "center")),

    step("Class three has the effort in the middle. Tweezers, a broom, a fishing rod, and your own forearm: "
         "the elbow is the fulcrum, and your biceps pulls just in front of it. Now the effort is bigger than the load.",
         *lever(900, 1200, 340, 910, 1190, 1010, effort_up=True),
         write("class 3", 1050, 440, 24, "yellow", "center"),
         write("effort in the middle", 1050, 474, 20, "white", "center"),
         write("tweezers,  broom,  forearm", 1050, 508, 18, "grey", "center"),
         write("MA < 1,  always", 1050, 546, 20, "pink", "center"),
         write("MA more or less than 1", 230, 546, 20, "grey", "center")),

    step("So why would anyone build a lever that makes the job harder? Speed. Your biceps shortens a few centimetres, "
         "and your hand swings a long way, fast. Your arm is a third-class lever. That is not an insult. It was built for speed.",
         write("why class 3?   speed:  a small pull moves the end far and fast", 70, 610, 23, "yellow"),
         pause=1.0),

    # ── 6. A wheelbarrow, worked ──────────────────────────────────────
    step("Let us use the principle of moments on a real one. A wheelbarrow carries six hundred newtons of sand, with its centre zero point four metres "
         "from the wheel's axle. The handles are one point two metres from the axle. How hard must you lift?",
         clear(2.2),
         heading("A wheelbarrow, worked"),
         write("600 N of sand,  0.4 m from the axle", 70, 190, 25),
         write("handles 1.2 m from the axle.   Lift?", 70, 230, 25),
         line(760, 556, 1240, 556, "grey", 2.4),
         ellipse(820, 522, 34, 34, "white", 3.0), ellipse(820, 522, 5, 5, "white", 2.4),
         line(820, 522, 1222, 448, "white", 3.4),
         line(850, 420, 1060, 420, "yellow", 3.0), line(850, 420, 885, 510, "yellow", 3.0),
         line(1060, 420, 1030, 483, "yellow", 3.0), line(1062, 477, 1072, 556, "white", 3.0),
         arrow(953, 345, 953, 412, "pink"), write("600 N", 953, 330, 22, "pink", "center"),
         arrow(1222, 530, 1222, 458, "green"), write("E", 1200, 512, 22, "green", "right"),
         double_arrow(820, 588, 953, 588, "grey", 2.2), write("0.4 m", 808, 596, 20, "grey", "right"),
         double_arrow(820, 622, 1222, 622, "grey", 2.2), write("1.2 m", 808, 630, 20, "grey", "right"),
         chapter="Worked example: a wheelbarrow"),

    step("Take moments about the axle. E times one point two equals six hundred times zero point four. E is two hundred newtons. "
         "Mechanical advantage: six hundred over two hundred, three. That is how a builder pushes a load they could never carry.",
         write("moments about the axle:", 70, 310, 24, "grey"),
         write("E × 1.2 = 600 × 0.4", 70, 360, 28),
         write("E = 200 N,    MA = 600 ÷ 200 = 3", 70, 412, 26, "green")),

    # ── 7. Pulleys ────────────────────────────────────────────────────
    step("Next, pulleys. A single fixed pulley, like the one on the flagpole, only changes the direction. Pull a metre, and the flag rises a metre: "
         "velocity ratio one. Its mechanical advantage is one at best, and a little less, because of friction.",
         clear(2.2),
         heading("Pulleys"),
         line(120, 170, 300, 170, "grey", 3.0), line(210, 170, 210, 210, "white", 2.6),
         ellipse(210, 240, 30, 30, "white", 3.0), ellipse(210, 240, 4, 4, "white", 2.0),
         line(180, 240, 180, 430, "white", 2.2), box(150, 430, 60, 50, "pink", 2.8), write("L", 180, 464, 20, "pink", "center"),
         line(240, 240, 240, 400, "white", 2.2), arrow(240, 400, 240, 470, "green"), write("E", 262, 466, 20, "green"),
         write("fixed:   VR = 1", 210, 540, 22, "white", "center"),
         write("changes the direction", 210, 575, 20, "grey", "center"),
         chapter="Pulleys"),

    step("A single movable pulley hangs on the load itself. Now two strands hold the load up, so each needs only half the force. "
         "But to raise the load one metre, both strands must shorten by a metre, so you pull in two metres of rope. Velocity ratio two.",
         line(480, 170, 660, 170, "grey", 3.0),
         line(530, 170, 530, 360, "white", 2.2), ellipse(560, 360, 30, 30, "white", 3.0), ellipse(560, 360, 4, 4, "white", 2.0),
         line(590, 360, 590, 270, "white", 2.2), arrow(590, 270, 590, 205, "green"), write("E", 612, 222, 20, "green"),
         line(560, 390, 560, 420, "white", 2.2), box(530, 420, 60, 50, "pink", 2.8), write("L", 560, 454, 20, "pink", "center"),
         write("movable:   VR = 2", 560, 540, 22, "white", "center"),
         write("2 strands hold the load", 560, 575, 20, "grey", "center")),

    step("Put several pulleys together, and you have a block and tackle. And here is the rule: the velocity ratio is the number of strands holding up the lower block. "
         "Count them: one, two, three, four. Velocity ratio four.",
         line(860, 170, 1120, 170, "grey", 3.0), line(970, 170, 970, 195, "white", 2.6),
         box(890, 195, 170, 50, "white", 2.8), ellipse(930, 220, 22, 22, "white", 2.4), ellipse(1020, 220, 22, 22, "white", 2.4),
         box(890, 390, 170, 45, "white", 2.8), ellipse(930, 412, 20, 20, "white", 2.4), ellipse(1020, 412, 20, 20, "white", 2.4),
         *[line(x, 245, x, 390, "white", 2.2) for x in (908, 952, 998, 1042)],
         curve([(1060, 212), (1080, 196), (1096, 222)], "white", 2.2), line(1096, 222, 1096, 430, "white", 2.2),
         arrow(1096, 430, 1096, 495, "green"), write("E", 1118, 490, 20, "green"),
         line(975, 435, 975, 455, "white", 2.2), box(945, 455, 60, 45, "pink", 2.8), write("L", 975, 486, 20, "pink", "center"),
         *[write(n, x - 17, 325, 17, "green", "center") for n, x in (("1", 908), ("2", 952), ("3", 998), ("4", 1042))],
         write("block and tackle:   VR = 4", 975, 540, 22, "white", "center"),
         write("VR = strands holding the lower block", 990, 576, 19, "yellow", "center")),

    step("Why? To lift the load one metre, each of the four strands must shorten by one metre. All that rope comes out through your hands: four metres.",
         write("load up 1 m:  4 strands each 1 m shorter;  you pull 4 m", 70, 628, 21, "green")),

    # ── 8. Your turn: a block and tackle ──────────────────────────────
    step("Grab a pen, this one is yours. A block and tackle has three pulleys in each block. An effort of two hundred and fifty newtons lifts a load of twelve hundred newtons. "
         "Find the velocity ratio, the mechanical advantage, and the efficiency.",
         clear(2.2),
         heading("Over to you"),
         *pause_sign(1180, 82),
         write("3 pulleys in each block.   E = 250 N lifts L = 1200 N.", 70, 190, 24, "blue"),
         write("Find the VR,  the MA  and  η.", 70, 228, 24, "blue"),
         chapter="Your turn: a block and tackle"),

    step("Stop the video here, and come back with three answers.",
         write("stop the video", 1130, 92, 22, "pink", "right"),
         pause=3.2),

    step("Six pulleys in all, so the velocity ratio is six. Mechanical advantage: twelve hundred over two hundred and fifty, four point eight. "
         "Efficiency: four point eight over six, eighty percent. If you got a hundred and twenty percent, you divided the wrong way round. No machine beats a hundred.",
         write("VR = 3 + 3 = 6", 70, 300, 26),
         write("MA = 1200 ÷ 250 = 4.8", 70, 345, 26),
         write("η = 4.8 ÷ 6 × 100% = 80%", 70, 390, 26, "green")),

    step("And where did the other twenty percent go? Raise the load two metres. The useful work: twelve hundred times two, two thousand four hundred joules. "
         "The effort moves six times as far, twelve metres, so the work you put in is two hundred and fifty times twelve: three thousand joules. "
         "Six hundred joules wasted, on friction, and on lifting the lower block.",
         write("raise the load 2 m:", 70, 460, 24, "yellow"),
         write("out:  1200 × 2 = 2400 J", 70, 500, 24),
         write("in:  250 × 12 = 3000 J    (the effort moves 6 × 2 = 12 m)", 70, 540, 24),
         write("wasted:  600 J   (friction,  lifting the lower block)", 70, 585, 24, "pink")),

    step("The pole, the wheelbarrow, the pulleys: one law. Trade force for distance, and pay a little to friction. "
         "Coming up: ramps, screw jacks and the hydraulic press, and how a car jack lets one hand hold up a car.",
         write("one law:  trade force for distance", 660, 300, 24, "yellow"),
         write("Coming up:  ramps,  screw jacks,", 660, 350, 23, "green"),
         write("the hydraulic press", 660, 385, 23, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Simple Machines", 54, 140, 76, "yellow"),
    write("MA  ·  VR  ·  efficiency  ·  levers  ·  pulleys", 60, 210, 30),
    line(100, 590, 1200, 590, "grey", 3.0), *car(150, 460, 1.1),
    line(380, 539, 1120, 539, "yellow", 5.0), *pivot(470, 539, "white", 1.25),
    arrow(1100, 400, 1100, 527, "green", 4.0), write("600 N", 1100, 380, 34, "green", "center"),
    arrow(400, 330, 400, 450, "pink", 4.0), write("6000 N", 400, 312, 34, "pink", "center"),
]
