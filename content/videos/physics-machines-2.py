"""Physics · Simple machines: inclined plane, wheel and axle, screw jack, gears and the hydraulic press. A chalkboard video lesson.

Follows content/notes/physics-machines-2.md, each machine with the reason for its
velocity ratio: opens on a story already moving (a flat tyre at dusk on the road
to Bo, and a jack that lifts a car with one hand), left hanging; the inclined
plane (a drum rolled onto a lorry; why VR = l/h, and why mountain roads zigzag);
the wheel and axle (why the 2π cancels; "think fast: why is a screwdriver handle
fat?"); back to the jack: pitch, VR = 2πa/p, the 64 N effort, and why its low
efficiency is a good thing; gears, and a bicycle climbing a Freetown hill; the
hydraulic press from Pascal's principle, with "your move" and its catch; the
practical (MA against load, and why it rises and levels off); and every machine's
VR on one board.

Check: python3 scripts/video/board_video.py content/videos/physics-machines-2.py --boards .video-build/boards/mach2
"""

import math

from board_video import arrow, box, clear, curve, dashed, double_arrow, ellipse, equation, heading, line, step, write, zigzag

TITLE = "Inclined Plane, Wheel and Axle, Screw Jack, Gears and the Hydraulic Press | WASSCE Physics"
DESCRIPTION = ("Machines on the chalkboard: how a jack lifts a car with one hand, the inclined plane (VR = l/h), the wheel and "
               "axle (VR = R/r), the screw jack (VR = 2πa/p) worked through, gears and bicycles, the hydraulic press and "
               "Pascal's principle, and the MA against load practical.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Simple machines"
# The lesson page this video is on: /wassce/physics/simple-machines/inclined-plane-screw-jack-gears-and-the-hydraulic-press
LESSON = "physics/simple-machines/inclined-plane-screw-jack-gears-and-the-hydraulic-press"


def pause_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def car(x, y, s=1.0, color="white"):
    """A car side on: its body's top-left corner at (x, y)."""
    w, h = 250 * s, 72 * s
    return [box(x, y, w, h, color, 3.0),
            line(x + 50 * s, y, x + 80 * s, y - 45 * s, color, 3.0), line(x + 80 * s, y - 45 * s, x + 190 * s, y - 45 * s, color, 3.0),
            line(x + 190 * s, y - 45 * s, x + 220 * s, y, color, 3.0),
            ellipse(x + 50 * s, y + h + 18 * s, 18 * s, 18 * s, color, 2.8), ellipse(x + 200 * s, y + h + 18 * s, 18 * s, 18 * s, color, 2.8)]


def gear(cx, cy, r, teeth, color="white"):
    """A toothed wheel: a circle with short teeth round its rim."""
    out = [ellipse(cx, cy, r, r, color, 2.8), ellipse(cx, cy, 6, 6, color, 2.4)]
    for k in range(teeth):
        a = 2 * math.pi * k / teeth
        out.append(line(cx + r * math.cos(a), cy + r * math.sin(a), cx + (r + 11) * math.cos(a), cy + (r + 11) * math.sin(a), color, 2.6))
    return out


STEPS = [
    # ── 1. A flat tyre at dusk ────────────────────────────────────────
    step("It is getting dark on the road to Bo, and then, bang: a flat tyre. The driver pulls out a jack no bigger than a loaf of bread, "
         "turns its handle with one hand, and slowly, the side of the car rises off the ground.",
         heading("A flat tyre at dusk"),
         line(520, 560, 1100, 560, "grey", 2.4), *car(560, 360),
         box(650, 542, 80, 18, "white", 2.8), zigzag(690, 542, 690, 444, n=8, amp=10), line(668, 437, 712, 437, "white", 4.0),
         line(690, 500, 880, 500, "yellow", 3.4), write("one hand", 892, 508, 22, "green"),
         pause=0.6, chapter="A flat tyre"),

    step("That side of the car weighs about eight thousand eight hundred newtons. One hand on a handle. How? "
         "Hold that question: we will come back for the driver. First, the simplest machine there is. A slope.",
         arrow(685, 250, 685, 306, "pink"), write("8800 N", 685, 238, 22, "pink", "center"),
         write("load:  about 8800 N", 70, 200, 25, "pink"),
         write("effort:  one hand?", 70, 240, 25, "green"),
         pause=1.0),

    # ── 2. The inclined plane ─────────────────────────────────────────
    step("Workers want to load a nine hundred newton drum onto a lorry, one point five metres high. Lifting it straight up is a struggle. "
         "So they lay a plank four point five metres long, and push the drum up it.",
         clear(2.2),
         heading("The inclined plane"),
         line(700, 540, 1240, 540, "grey", 2.4), line(720, 540, 1170, 390, "white", 3.4), line(1170, 390, 1170, 540, "grey", 2.2),
         box(1170, 390, 70, 150, "white", 2.6), write("lorry", 1205, 470, 18, "grey", "center"),
         ellipse(914, 446, 28, 28, "yellow", 3.0), write("900 N", 900, 402, 20, "pink", "center"),
         arrow(944, 436, 1001, 417, "green"), write("E", 1010, 412, 20, "green"),
         write("l = 4.5 m", 790, 478, 20, "grey", "center"), write("h = 1.5 m", 1158, 470, 20, "grey", "right"),
         write("θ", 790, 530, 20, "grey"),
         write("900 N drum,  4.5 m plank,  1.5 m high", 70, 190, 23),
         chapter="The inclined plane"),

    step("Why does the plank help? The drum rises only h, the height of the lorry. But your effort travels the whole length of the slope, l. "
         "So the velocity ratio is l over h. And since h over l is sine theta, it is also one over sine theta.",
         write("effort moves l;  the load rises only h", 70, 240, 24),
         equation(["VR =", ("l", "h"), "=", ("1", "sin θ")], 70, 320, 28, "yellow")),

    step("Here, four point five over one point five: three. With an effort of four hundred newtons, the mechanical advantage is nine hundred over four hundred, "
         "two point two five. Efficiency: two point two five over three, seventy-five percent.",
         write("VR = 4.5 ÷ 1.5 = 3", 70, 400, 25),
         write("MA = 900 ÷ 400 = 2.25", 70, 440, 25),
         write("η = 2.25 ÷ 3 × 100% = 75%", 70, 480, 25, "green")),

    step("And that is why roads up a mountain zigzag, instead of going straight to the top. A longer, gentler road is a bigger velocity ratio, "
         "so a loaded lorry needs less force to climb it.",
         write("mountain roads zigzag:", 70, 550, 24, "yellow"),
         write("a longer,  gentler road:  a bigger VR", 70, 588, 24, "yellow"),
         pause=0.8),

    # ── 3. The wheel and axle ─────────────────────────────────────────
    step("Now fix a thin axle to the centre of a big wheel, so they turn together. Wind a rope on the axle, and push on the rim of the wheel. "
         "That is a wheel and axle, like the windlass over a well.",
         clear(2.2),
         heading("The wheel and axle"),
         ellipse(1010, 330, 120, 120, "white", 3.2), ellipse(1010, 330, 30, 30, "yellow", 3.0), ellipse(1010, 330, 4, 4, "white", 2.0),
         line(1040, 330, 1040, 500, "white", 2.2),
         line(1015, 500, 1065, 500, "pink", 2.8), line(1015, 500, 1022, 545, "pink", 2.8), line(1065, 500, 1058, 545, "pink", 2.8),
         line(1022, 545, 1058, 545, "pink", 2.8), write("load", 1040, 578, 20, "pink", "center"),
         arrow(890, 330, 890, 420, "green"), write("E", 872, 404, 22, "green", "right"),
         chapter="The wheel and axle"),

    step("In one turn, your hand travels round the big circle: two pi times big R. The bucket rises only the small circle: two pi times small r. "
         "Divide, and the two pi cancels. The velocity ratio is R over r.",
         line(1010, 330, 925, 245, "grey", 2.2), write("R", 950, 300, 22, "grey", "right"),
         line(1010, 330, 1010, 302, "grey", 2.0), write("r", 1016, 322, 18, "grey"),
         write("one turn:  effort 2πR,  load 2πr", 70, 200, 24),
         equation(["VR =", ("2πR", "2πr"), "=", ("R", "r")], 70, 280, 28, "yellow")),

    step("A well windlass with a wheel of radius forty centimetres, on an axle of eight centimetres: forty over eight, a velocity ratio of five.",
         write("R = 40 cm,  r = 8 cm:   VR = 40 ÷ 8 = 5", 70, 360, 24),
         write("also:  a screwdriver,  a door knob,  a steering wheel", 70, 400, 21, "grey")),

    step("Think fast. Why is a screwdriver handle fat?",
         write("Think fast:  why is a screwdriver handle fat?", 70, 480, 23, "blue"),
         pause=2.2),

    step("The handle is the wheel, and the screw is the axle. A fat handle is a big R, so a bigger velocity ratio, "
         "and a stubborn screw gives up with less effort.",
         write("the handle is the wheel:  bigger R,  bigger VR", 70, 525, 23, "green")),

    # ── 4. Back to the jack ───────────────────────────────────────────
    step("Now, back to our driver on the road to Bo. A screw jack is a screw, turned by a long handle. The pitch is the distance between two neighbouring threads, "
         "and it is exactly how far the screw rises in one full turn.",
         clear(2.2),
         heading("Back to the jack"),
         box(950, 560, 100, 18, "white", 2.8), zigzag(1000, 560, 1000, 310, n=12, amp=14), line(955, 304, 1045, 304, "white", 4.4),
         arrow(1000, 244, 1000, 296, "pink"), write("8800 N", 1000, 232, 22, "pink", "center"),
         double_arrow(1030, 456, 1030, 498, "pink", 2.2), write("p", 1044, 484, 20, "pink"),
         write("pitch p:  the gap between two threads", 70, 190, 24),
         write("=  how far the screw rises in one turn", 70, 228, 23, "grey"),
         chapter="The screw jack"),

    step("In one turn, the end of the handle travels a whole circle: two pi a, where a is the length of the handle. The load rises just one pitch. "
         "So the velocity ratio is two pi a over p.",
         line(1000, 400, 1200, 400, "yellow", 3.6), ellipse(1000, 400, 200, 26, "grey", 1.8),
         double_arrow(1004, 350, 1198, 350, "grey", 2.2), write("a", 1100, 340, 22, "grey", "center"),
         arrow(1204, 404, 1160, 422, "green"), write("E", 1222, 432, 20, "green"),
         write("one turn:  effort moves 2πa;  load rises p", 70, 290, 24),
         equation(["VR =", ("2πa", "p")], 70, 360, 30, "yellow")),

    step("The driver's jack has a pitch of zero point four centimetres, a handle of thirty-five centimetres, and an efficiency of only twenty-five percent. "
         "The velocity ratio: two, times twenty-two over seven, times thirty-five, all over zero point four. Five hundred and fifty!",
         write("p = 0.4 cm,   a = 35 cm,   η = 25%", 70, 430, 24),
         equation(["VR =", ("2 × 22/7 × 35", "0.4"), "=", ("220", "0.4"), "= 550"], 70, 500, 26)),

    step("The mechanical advantage is a quarter of that: one hundred and thirty-seven point five. So the effort is eight thousand eight hundred, "
         "over one hundred and thirty-seven point five: sixty-four newtons. About the weight of a six kilogram bag of rice. One hand.",
         write("MA = 0.25 × 550 = 137.5", 70, 570, 25),
         write("E = 8800 ÷ 137.5 = 64 N:  one hand!", 70, 610, 25, "green"),
         pause=0.9),

    step("So why is the jack so wasteful? Friction in the threads. But here, friction is on your side: let go of the handle, and it holds the car up, "
         "instead of letting it crash down. Still, never lie under a car held only by a jack. Friction is a helper, not a promise.",
         write("friction holds the car up:  on your side", 70, 645, 23, "pink"),
         pause=1.0),

    # ── 5. Gears ──────────────────────────────────────────────────────
    step("Gears are toothed wheels that mesh. Turn the small driving gear, and its teeth push the big driven gear round. "
         "The velocity ratio is the number of teeth on the driven gear, over the number on the driver.",
         clear(2.2),
         heading("Gears"),
         *gear(880, 330, 45, 15), *gear(1053, 330, 120, 45),
         write("driver", 880, 420, 20, "white", "center"), write("15 teeth", 880, 446, 20, "grey", "center"),
         write("driven", 1053, 495, 20, "white", "center"), write("45 teeth", 1053, 521, 20, "grey", "center"),
         equation(["VR =", ("teeth on the driven gear", "teeth on the driving gear")], 70, 230, 24, "yellow"),
         chapter="Gears"),

    step("With fifteen teeth driving forty-five, the velocity ratio is three. The small gear turns three times for every one turn of the big gear: "
         "more turning force, but less speed.",
         write("fast", 880, 262, 20, "blue", "center"), write("slow,  strong", 1053, 188, 20, "blue", "center"),
         write("15 driving 45:   VR = 45 ÷ 15 = 3", 70, 320, 24),
         write("3 turns of the small gear,  1 of the big", 70, 360, 24),
         write("more turning force,  less speed", 70, 400, 24, "green")),

    step("You feel this on a bicycle. Climbing a steep road in Freetown, you pick the small gear at the front, by the pedals, and a big gear at the back. "
         "A big velocity ratio: your legs push gently, and you crawl up the hill. On the flat, change gear, and fly.",
         write("uphill bike:  small gear at the front,", 70, 480, 22, "blue"),
         write("big gear at the back:  big VR,  easy,  slow", 70, 515, 22, "blue"),
         pause=0.8),

    # ── 6. The hydraulic press ────────────────────────────────────────
    step("The last machine uses a liquid. Push on a liquid trapped in a closed container, and the pressure is passed on equally, in every direction. "
         "That is Pascal's principle.",
         clear(2.2),
         heading("The hydraulic press"),
         line(760, 300, 760, 560, "white", 3.0), line(760, 560, 1180, 560, "white", 3.0), line(1180, 560, 1180, 300, "white", 3.0),
         line(800, 300, 800, 520, "white", 3.0), line(800, 520, 1020, 520, "white", 3.0), line(1020, 520, 1020, 300, "white", 3.0),
         line(763, 380, 797, 380, "yellow", 5.0), line(1023, 380, 1177, 380, "yellow", 5.0),
         write("oil", 910, 548, 18, "grey", "center"),
         write("Pascal:  pressure on a trapped liquid", 70, 190, 24),
         write("is passed on equally,  in every direction", 70, 225, 24),
         chapter="The hydraulic press"),

    step("Pressure is force over area. A small force on a small piston makes a pressure. The same pressure, on a big piston, gives a big force. "
         "F one over A one equals F two over A two.",
         arrow(780, 290, 780, 372, "green"), write("F_1", 780, 278, 20, "green", "center"),
         box(1060, 324, 80, 54, "pink", 2.8), write("F_2", 1100, 358, 18, "pink", "center"),
         arrow(1050, 480, 1050, 392, "blue", 2.4), arrow(1150, 480, 1150, 392, "blue", 2.4),
         write("A_1", 780, 600, 20, "grey", "center"), write("A_2", 1100, 600, 20, "grey", "center"),
         equation(["p =", ("F_1", "A_1"), "=", ("F_2", "A_2")], 70, 300, 30, "yellow"),
         write("so   F_2 = F_1 × A_2 ÷ A_1", 70, 375, 26, "yellow")),

    step("Your move. Eighty newtons pushes on a small piston of five square centimetres. The big piston is two hundred and fifty square centimetres. "
         "What load can it raise? Take your time. I am not going anywhere.",
         *pause_sign(1180, 82),
         write("Your move:  80 N on 5 cm^2;", 70, 440, 24, "blue"),
         write("big piston 250 cm^2.   Load?", 70, 476, 24, "blue"),
         pause=3.0),

    step("F two is eighty, times two hundred and fifty over five: four thousand newtons. Fifty times the force. "
         "And the catch, as always: the small piston must move fifty times as far as the big one.",
         write("F_2 = 80 × 250 ÷ 5 = 4000 N", 70, 530, 25, "green"),
         write("catch:  the small piston moves 50 × as far", 70, 570, 22, "pink")),

    step("Hydraulic jacks, car brakes, and the barber's chair all work this way. Every time the barber pumps your chair up with a foot pedal, "
         "you are sitting on Pascal's principle.",
         write("jacks,  car brakes,  the barber's chair", 70, 620, 22, "grey"),
         pause=0.9),

    # ── 7. The practical ──────────────────────────────────────────────
    step("In the practical exam, you may test a pulley system. Measure its velocity ratio first. Then hang a load, and add effort until the load rises slowly and steadily. "
         "Repeat for six loads, and work out the mechanical advantage and the efficiency for each.",
         clear(2.2),
         heading("The practical:  MA against load"),
         write("1.  measure the VR   (say 4)", 70, 190, 23),
         write("2.  add effort till the load rises steadily", 70, 228, 23),
         write("3.  six loads:  MA = L ÷ E,   η = MA ÷ VR", 70, 266, 23),
         arrow(760, 560, 1200, 560, "white", 3.0), arrow(760, 560, 760, 230, "white", 3.0),
         write("load", 1200, 594, 20, "grey", "right"), write("MA", 774, 244, 20, "grey"),
         chapter="The practical: MA against load"),

    step("Plot them, and the mechanical advantage rises with the load, then levels off, always below the velocity ratio. "
         "Why? With a small load, most of your effort goes into lifting the lower block and beating friction. "
         "With a big load, those losses are a much smaller share of the work.",
         dashed(760, 290, 1180, 290, "grey", 2.2), write("VR = 4", 1180, 278, 20, "grey", "right"),
         curve([(772, 540), (810, 470), (860, 410), (930, 365), (1020, 335), (1120, 320), (1185, 316)], "green", 3.2),
         write("MA rises,  then levels off,", 70, 340, 24, "green"),
         write("always below the VR", 70, 376, 24, "green"),
         write("small load:  effort lifts the lower block", 70, 440, 22, "pink"),
         write("and fights friction;  with a big load,", 70, 474, 22, "pink"),
         write("those losses are a smaller share", 70, 508, 22, "pink")),

    step("Precautions: a light string, oiled pulleys, tap the system gently so it does not stick, and keep the strands parallel.",
         write("precautions:  light string,  oiled pulleys,", 70, 580, 22, "grey"),
         write("tap gently,  strands parallel", 70, 614, 22, "grey")),

    # ── 8. Every machine on one board ─────────────────────────────────
    step("Here is every machine from this topic on one board. Copy it into your notes: it is the whole topic, in eight lines.",
         clear(2.2),
         heading("Every machine on one board"),
         *[write(name, 70, y, 24, "grey") for name, y in (("lever", 185), ("pulleys", 230), ("inclined plane", 275), ("wheel and axle", 320),
                                                          ("screw jack", 365), ("gears", 410), ("hydraulic press", 455))],
         *[write(f, 360, y, 24) for f, y in (("VR = effort arm ÷ load arm", 185), ("VR = strands holding the lower block", 230),
                                              ("VR = l ÷ h  =  1 ÷ sin θ", 275), ("VR = R ÷ r", 320), ("VR = 2πa ÷ p", 365),
                                              ("VR = teeth driven ÷ teeth driving", 410), ("VR = A_2 ÷ A_1", 455))],
         write("every machine:   η = MA ÷ VR × 100%,   MA < VR", 70, 520, 24, "yellow"),
         chapter="Every machine on one board"),

    step("And they all keep the same deal: a discount on force, paid for in distance. Next, we shrink right down, "
         "to the tiny particles that everything is made of: solids, liquids and gases.",
         write("the same deal:  less force,  more distance", 70, 585, 24, "green"),
         write("Next:  solids,  liquids  and  gases", 70, 625, 24, "blue"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("One hand,  one car?", 54, 140, 70, "yellow"),
    write("ramp  ·  wheel and axle  ·  screw jack  ·  gears  ·  hydraulic press", 60, 205, 24),
    line(300, 600, 1150, 600, "grey", 3.0), *car(380, 330, 1.3),
    box(480, 578, 120, 22, "white", 3.0), zigzag(540, 578, 540, 434, n=10, amp=14, width=3.2), line(505, 428, 575, 428, "white", 5.0),
    line(540, 520, 860, 520, "yellow", 5.0), write("64 N", 880, 535, 40, "green"),
    write("8800 N", 730, 300, 40, "pink"),
]
