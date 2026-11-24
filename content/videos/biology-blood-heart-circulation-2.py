"""Biology · The mammalian heart, blood vessels and double circulation. A chalkboard video lesson.

Follows content/notes/biology-blood-heart-circulation-2.md: the heart drawn and
labelled (chambers, valves, vessels, the thick left ventricle), the path of
blood through it, double circulation, the cardiac cycle, arteries, veins and
capillaries compared, and the pulse and exercise.
Check: python3 scripts/video/board_video.py content/videos/biology-blood-heart-circulation-2.py --boards .video-build/boards/heart
"""

from board_video import arrow, box, clear, curve, ellipse, heading, label, line, moved, step, text_width, write

TITLE = "The Mammalian Heart, Blood Vessels and Double Circulation | WASSCE Biology"
DESCRIPTION = ("The heart drawn and labelled on the chalkboard: chambers, valves and vessels, the path of blood through "
               "the heart and lungs, double circulation, the cardiac cycle, and arteries, veins and capillaries compared.")
LABEL = "WASSCE Tutor  ·  Biology  ·  The heart"
# The lesson page this video is on: /wassce/biology/blood-heart-and-circulation-in-mammals/the-mammalian-heart-blood-vessels-and-double-circulation
LESSON = "biology/blood-heart-and-circulation-in-mammals/the-mammalian-heart-blood-vessels-and-double-circulation"

X = 280   # the heart is drawn from the board's middle; the heart's right side is on the viewer's left
BLUE, RED = "blue", "pink"


def P(x, y):
    return (x + X, y)


def outline():
    pts = [(200, 300), (260, 252), (360, 264), (470, 252), (530, 300), (540, 420), (500, 530), (420, 610), (360, 640), (300, 610), (220, 520), (190, 420)]
    return [curve([P(x, y) for x, y in pts], "white", 3.8, closed=True),
            curve([P(365, 268), P(362, 450), P(360, 632)], "white", 3.4)]                     # septum


def walls():
    return [line(*P(194, 400), *P(250, 400), "white", 3.0), line(*P(300, 400), *P(358, 400), "white", 3.0),
            line(*P(368, 400), *P(430, 400), "white", 3.0), line(*P(480, 400), *P(536, 400), "white", 3.0),
            curve([P(372, 420), P(470, 430), P(500, 500), P(430, 580), P(372, 600)], "white", 2.4)]   # thick wall of the left ventricle


def valves():
    return [line(*P(250, 400), *P(266, 426), "yellow", 3.0), line(*P(300, 400), *P(284, 426), "yellow", 3.0),
            line(*P(430, 400), *P(446, 426), "yellow", 3.0), line(*P(480, 400), *P(464, 426), "yellow", 3.0)]


def right_side_vessels():
    return [line(*P(214, 160), *P(224, 300), BLUE, 3.2), line(*P(240, 160), *P(248, 290), BLUE, 3.2),      # vena cava
            line(*P(316, 262), *P(300, 168), BLUE, 3.2), line(*P(340, 262), *P(326, 168), BLUE, 3.2)]      # pulmonary artery


def left_side_vessels():
    return [curve([P(380, 264), P(386, 190), P(430, 150), P(500, 152), P(530, 200)], RED, 3.2),           # aorta
            curve([P(404, 264), P(408, 204), P(440, 176), P(492, 176), P(506, 210)], RED, 3.2),
            line(*P(600, 318), *P(530, 322), RED, 3.2), line(*P(600, 342), *P(536, 346), RED, 3.2)]      # pulmonary veins


def flow():
    return [arrow(*P(231, 190), *P(236, 300), BLUE, 3.0), arrow(*P(275, 350), *P(275, 470), BLUE, 3.0),
            arrow(*P(324, 250), *P(312, 168), BLUE, 3.0),
            arrow(*P(596, 330), *P(540, 334), RED, 3.0), arrow(*P(455, 350), *P(455, 470), RED, 3.0),
            arrow(*P(500, 156), *P(530, 202), RED, 3.0)]


def chambers():
    return [write("RA", *P(228, 362), 26, BLUE, "center"), write("RV", *P(272, 540), 26, BLUE, "center"),
            write("LA", *P(408, 370), 26, RED, "center"), write("LV", *P(420, 540), 26, RED, "center")]


def tag(name, note, x, y, tx, ty, color="white"):
    """A label with a short note under it, in smaller grey writing."""
    parts = [label(name, x, y, tx, ty, 22, color)]
    if note:
        parts.append(write(note, x, y + 24, 18, "grey"))
    return parts


def vessel(cx, cy, r_out, r_in, color, valve=False):
    out = [ellipse(cx, cy, r_out, r_out, color, 3.2), ellipse(cx, cy, r_in, r_in, color, 2.4)]
    if valve:
        out += [line(cx - r_in + 6, cy - 6, cx, cy + 10, "yellow", 2.4), line(cx + r_in - 6, cy - 6, cx, cy + 10, "yellow", 2.4)]
    return out


STEPS = [
    # ── 1. The heart ───────────────────────────────────────────────────
    step("The heart is a muscular pump. Here it is, drawn as if you are facing the person, so the heart's right side is on our left.",
         heading("The mammalian heart"),
         *outline(),
         chapter="Parts of the heart (labelled diagram)"),

    step("It has four chambers. The two upper ones, the atria, receive blood. The two lower ones, the ventricles, pump it out. A wall, the septum, keeps the two sides apart.",
         *walls(), *chambers(),
         *tag("septum", None, 920, 610, *P(361, 600))),

    step("The right side carries deoxygenated blood. It arrives from the body in the vena cava, enters the right atrium, then passes down to the right ventricle.",
         *right_side_vessels()[:2], *flow()[:2],
         *tag("vena cava", "from the body", 40, 226, *P(214, 226), BLUE),
         *tag("right atrium", None, 40, 330, *P(200, 330), BLUE),
         *tag("right ventricle", None, 40, 520, *P(214, 500), BLUE)),

    step("The right ventricle pumps it up the pulmonary artery to the lungs, to collect oxygen.",
         *right_side_vessels()[2:], flow()[2],
         *tag("pulmonary artery", "to the lungs", 40, 150, *P(304, 176), BLUE)),

    step("Oxygenated blood comes back from the lungs in the pulmonary veins, into the left atrium, and down into the left ventricle.",
         *left_side_vessels()[2:], *flow()[3:5],
         *tag("pulmonary veins", "from the lungs", 920, 300, *P(602, 330), RED),
         *tag("left atrium", None, 920, 372, *P(536, 372), RED)),

    step("The left ventricle pumps it into the aorta, and round the whole body.",
         *left_side_vessels()[:2], flow()[5],
         *tag("aorta", "to the body", 920, 196, *P(532, 200), RED)),

    step("Valves keep the blood flowing one way. The tricuspid valve is on the right side, and the bicuspid valve on the left.",
         *valves(),
         *tag("tricuspid valve", None, 40, 420, *P(250, 404), "yellow"),
         *tag("bicuspid valve", None, 920, 440, *P(480, 404), "yellow")),

    step("Look at the walls. The left ventricle has a much thicker wall, because it must pump blood all round the body. The right ventricle only pumps to the nearby lungs.",
         *tag("left ventricle", "thick, muscular wall", 920, 520, *P(500, 500), RED)),

    # ── 2. The route and double circulation ────────────────────────────
    step("So here is the route. Vena cava, right atrium, tricuspid valve, right ventricle, pulmonary artery, lungs. Then pulmonary veins, left atrium, bicuspid valve, left ventricle, aorta, body.",
         clear(2.2),
         heading("Through the heart, twice"),
         write("vena cava  >  right atrium  >  tricuspid  >  right ventricle", 70, 178, 23, BLUE),
         write(">  pulmonary artery  >  LUNGS", 90, 212, 23, BLUE),
         write(">  pulmonary veins  >  left atrium  >  bicuspid  >  left ventricle", 90, 250, 23, RED),
         write(">  aorta  >  BODY", 90, 284, 23, RED),
         chapter="The route of blood and double circulation"),

    step("Blood passes through the heart twice in one complete circuit. This is double circulation. The pulmonary circulation goes from the heart to the lungs and back. The systemic circulation goes from the heart to the body and back.",
         box(470, 330, 340, 60, "white", 3.0), write("lungs", 640, 370, 26, "white", "center"),
         box(470, 600, 340, 60, "white", 3.0), write("body", 640, 640, 26, "white", "center"),
         box(560, 446, 80, 80, BLUE, 3.0), box(640, 446, 80, 80, RED, 3.0),
         write("R", 600, 498, 24, BLUE, "center"), write("L", 680, 498, 24, RED, "center"),
         arrow(580, 446, 560, 392, BLUE, 3.0), arrow(720, 392, 700, 446, RED, 3.0),
         arrow(700, 526, 720, 598, RED, 3.0), arrow(560, 598, 580, 526, BLUE, 3.0),
         write("pulmonary", 380, 430, 23, "yellow", "right"), write("systemic", 380, 580, 23, "yellow", "right")),

    step("Why twice? Blood goes to the delicate lungs at low pressure, and to the body at high pressure. And oxygenated and deoxygenated blood never mix.",
         write("low pressure to the lungs;", 850, 446, 20), write("high pressure to the body;", 850, 476, 20),
         write("the two kinds never mix.", 850, 506, 20)),

    # ── 3. Cardiac cycle ───────────────────────────────────────────────
    step("One heartbeat is called the cardiac cycle. First the atria contract, pushing blood into the ventricles. Then the ventricles contract, which is systole, forcing blood out into the arteries. "
         "Then the whole heart relaxes and fills again, which is diastole.",
         clear(2.2),
         heading("The cardiac cycle"),
         write("1.  atria contract:  blood into the ventricles", 70, 190, 25),
         write("2.  ventricles contract (systole):  blood into the arteries", 70, 234, 25),
         write("3.  the heart relaxes and fills (diastole)", 70, 278, 25),
         write("The beat you hear is the valves shutting.", 70, 340, 23, "grey"),
         chapter="The cardiac cycle: systole and diastole"),

    # ── 4. Vessels ─────────────────────────────────────────────────────
    step("Blood travels in three kinds of vessel. Arteries carry blood away from the heart, at high pressure. They have thick, muscular, elastic walls and a narrow space inside.",
         write("Blood vessels", 70, 430, 30, "yellow"),
         *vessel(170, 540, 62, 22, RED), write("artery", 170, 640, 24, RED, "center"),
         write("away from the heart;  thick, elastic wall", 300, 512, 22),
         chapter="Arteries, veins and capillaries compared"),

    step("Veins carry blood back towards the heart, at low pressure. Their walls are thinner, the space inside is wider, and they have valves to stop the blood flowing backwards.",
         clear(2.2),
         heading("Arteries, veins and capillaries"),
         *vessel(200, 300, 70, 24, RED), write("artery", 200, 410, 24, RED, "center"),
         *vessel(640, 300, 70, 52, BLUE, valve=True), write("vein", 640, 410, 24, BLUE, "center"),
         *vessel(1060, 300, 22, 16, "white"), write("capillary", 1060, 410, 24, "white", "center")),

    step("Capillaries are tiny. Their walls are only one cell thick, so oxygen, food and waste pass easily between the blood and the cells.",
         write("arteries:  away from the heart;  high pressure;  thick, elastic walls", 70, 480, 22, RED),
         write("veins:  towards the heart;  low pressure;  wide;  valves", 70, 520, 22, BLUE),
         write("capillaries:  one cell thick;  exchange with the cells", 70, 560, 22)),

    step("A trap in the exam: arteries are defined by carrying blood away from the heart, not by carrying oxygen. The pulmonary artery carries deoxygenated blood, and the pulmonary veins carry oxygenated blood.",
         write("Trap:  the pulmonary ARTERY carries deoxygenated blood;", 70, 616, 22, "pink"),
         write("the pulmonary VEINS carry oxygenated blood.", 70 + text_width("Trap:  ", 22), 648, 22, "pink")),

    # ── 5. Pulse and exercise ──────────────────────────────────────────
    step("Your pulse is the wave of pressure in an artery each time the heart beats. During exercise, your muscles need more oxygen and glucose, so the heart beats faster and harder, and you breathe faster.",
         clear(2.2),
         heading("Pulse and exercise"),
         write("pulse:  the pressure wave in an artery at each beat", 70, 190, 25),
         write("exercise:  heart beats faster and harder;", 70, 240, 25),
         write("more blood to the muscles;  faster breathing", 70 + text_width("exercise:  ", 25), 278, 25),
         chapter="Pulse, exercise and exam tips"),

    step("In the exam, learn to draw and label the heart, trace the route of the blood, and explain how each vessel's structure suits its pressure.",
         write("Exam:  label the heart;  trace the route;", 70, 370, 25, "yellow"),
         write("link each vessel's structure to its pressure.", 70 + text_width("Exam:  ", 25), 408, 25, "yellow"),
         pause=1.2),
]

THUMBNAIL = [
    write("The Heart", 54, 150, 80, "yellow"),
    write("Diagram  ·  Double circulation  ·  Vessels", 60, 214, 32),
    *moved(outline() + walls() + valves() + right_side_vessels() + left_side_vessels() + flow() + chambers(), dx=-260, dy=112, scale=0.86),
    write("RA  RV", 880, 400, 46, BLUE), write("LA  LV", 880, 480, 46, RED),
]
