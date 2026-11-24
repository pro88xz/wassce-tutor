"""Biology · Blood: plasma, blood cells, clotting and blood groups. A chalkboard video lesson.

Follows content/notes/biology-blood-heart-circulation-1.md: what blood is made
of (a spun tube), plasma, red blood cells and haemoglobin, phagocytes and
lymphocytes, platelets and clotting, and the ABO and Rhesus blood groups for
safe transfusion.
Check: python3 scripts/video/board_video.py content/videos/biology-blood-heart-circulation-1.py --boards .video-build/boards/blood
"""

from board_video import arrow, box, clear, curve, dots, ellipse, heading, label, line, moved, step, text_width, write

TITLE = "Blood: Plasma, Red and White Blood Cells, Clotting and Blood Groups | WASSCE Biology"
DESCRIPTION = ("The components of blood on the chalkboard: plasma, red blood cells and haemoglobin, phagocytes and "
               "lymphocytes, platelets and blood clotting, and the ABO and Rhesus blood groups for safe transfusion.")
LABEL = "WASSCE Tutor  ·  Biology  ·  Blood"
# The lesson page this video is on: /wassce/biology/blood-heart-and-circulation-in-mammals/blood-plasma-blood-cells-clotting-and-blood-groups
LESSON = "biology/blood-heart-and-circulation-in-mammals/blood-plasma-blood-cells-clotting-and-blood-groups"

TX, TY0, TY1, TW = 200, 170, 600, 110   # the tube of spun blood


def tube():
    out = [line(TX, TY0, TX, TY1, "white", 3.4), line(TX + TW, TY0, TX + TW, TY1, "white", 3.4),
           curve([(TX, TY1), (TX + 14, TY1 + 30), (TX + TW / 2, TY1 + 40), (TX + TW - 14, TY1 + 30), (TX + TW, TY1)], "white", 3.4)]
    return out


def red_cell(cx, cy, r=26, width=3.0):
    return [ellipse(cx, cy, r, r * 0.92, "pink", width), ellipse(cx, cy, r * 0.42, r * 0.38, "pink", width * 0.7)]


def phagocyte(cx, cy, s=1.0):
    return [curve([(cx - 50 * s, cy), (cx - 30 * s, cy - 40 * s), (cx + 20 * s, cy - 46 * s), (cx + 52 * s, cy - 8 * s), (cx + 36 * s, cy + 40 * s), (cx - 20 * s, cy + 44 * s)], "white", 3.2, closed=True),
            curve([(cx - 20 * s, cy - 8 * s), (cx - 8 * s, cy - 20 * s), (cx + 4 * s, cy - 6 * s), (cx + 16 * s, cy - 18 * s), (cx + 26 * s, cy - 2 * s)], "blue", 4.0)]


def antibody(cx, cy, s=1.0, color="yellow"):
    return [line(cx, cy + 22 * s, cx, cy, color, 3.0), line(cx, cy, cx - 14 * s, cy - 18 * s, color, 3.0), line(cx, cy, cx + 14 * s, cy - 18 * s, color, 3.0)]


STEPS = [
    # ── 1. What blood is made of ───────────────────────────────────────
    step("Blood is a liquid tissue that carries things round the body, controls conditions inside it, and protects it. If we spin a tube of blood, it separates into layers.",
         heading("What is blood made of?"),
         *tube(),
         chapter="What is blood made of? Plasma and blood cells"),

    step("At the bottom are the red blood cells, nearly half of the blood.",
         box(TX + 4, 410, TW - 8, TY1 - 410, "pink", 2.0), *[dots([(TX + 20 + 18 * i, 430 + 26 * j)], "pink", 9) for i in range(5) for j in range(6)],
         label("red blood cells:  about 45%", 380, 500, TX + TW + 6, 500, 24, "pink")),
    step("A thin white layer holds the white blood cells and the platelets.",
         box(TX + 4, 396, TW - 8, 12, "white", 2.4),
         label("white cells and platelets", 380, 404, TX + TW + 6, 402, 24)),
    step("And the pale yellow liquid on top is plasma, a little over half the blood.",
         box(TX + 4, 200, TW - 8, 192, "yellow", 2.0),
         label("plasma:  about 55%", 380, 290, TX + TW + 6, 290, 24, "yellow")),

    step("Plasma is mostly water. It carries dissolved food such as glucose and amino acids, carbon dioxide, urea, hormones and heat. But it does not carry most of the oxygen.",
         write("Plasma carries:", 760, 190, 26, "yellow"),
         write("glucose, amino acids", 780, 230, 23), write("carbon dioxide, urea", 780, 264, 23),
         write("hormones, heat", 780, 298, 23), write("NOT most of the oxygen", 780, 340, 23, "pink")),

    # ── 2. Red blood cells ─────────────────────────────────────────────
    step("Red blood cells carry oxygen. They are full of haemoglobin, which joins with oxygen in the lungs to form oxyhaemoglobin, and gives it up in the tissues.",
         clear(2.2),
         heading("Red blood cells"),
         *red_cell(170, 260, 54, 3.6),
         curve([(290, 236), (320, 226), (350, 246), (380, 246), (410, 226), (440, 236), (440, 284), (410, 294), (380, 274), (350, 274), (320, 294), (290, 284)], "pink", 3.2, closed=True),
         write("face", 170, 350, 20, "grey", "center"), write("side:  biconcave", 365, 350, 20, "grey", "center"),
         write("haemoglobin + oxygen", 560, 200, 24),
         arrow(580, 220, 620, 250, "white", 2.8), write("oxyhaemoglobin", 640, 262, 24, "pink"),
         write("(in the lungs)", 640 + 250 + 16, 262, 20, "grey"),
         write("it gives the oxygen up again in the tissues", 560, 312, 20, "grey"),
         chapter="Red blood cells and haemoglobin"),

    step("They are adapted for this. They have no nucleus, so there is more room for haemoglobin. Their biconcave shape gives a large surface area. And they are flexible, to squeeze through narrow capillaries.",
         write("no nucleus:  more room for haemoglobin", 90, 440, 25),
         write("biconcave disc:  large surface area", 90, 480, 25),
         write("flexible:  squeeze through capillaries", 90, 520, 25)),

    step("They are made in the red bone marrow. Iron is needed to make haemoglobin, so too little iron causes anaemia.",
         write("made in red bone marrow;  iron needed:  too little gives anaemia.", 90, 600, 23, "yellow")),

    # ── 3. White blood cells ───────────────────────────────────────────
    step("White blood cells defend the body against germs, or pathogens. They have a nucleus, and are bigger and fewer than red cells. There are two main kinds.",
         clear(2.2),
         heading("White blood cells"),
         chapter="White blood cells: phagocytes and lymphocytes"),

    step("Phagocytes surround a germ, take it in, and digest it. This is called phagocytosis.",
         *phagocyte(170, 270), dots([(250, 230), (262, 250)], "green", 10),
         arrow(260, 270, 320, 270, "grey", 2.6),
         *phagocyte(400, 270), dots([(456, 262)], "green", 10),
         arrow(490, 270, 550, 270, "grey", 2.6),
         *phagocyte(630, 270), curve([(640, 296), (652, 286), (664, 296), (652, 306)], "green", 2.2, closed=True),
         write("phagocyte:  engulfs and digests germs  (phagocytosis)", 90, 380, 25)),

    step("Lymphocytes make antibodies. Each antibody fits one particular antigen on a germ, sticks to it, and helps destroy it. Some lymphocytes remember the germ, which gives immunity.",
         ellipse(200, 520, 46, 44, "white", 3.2), ellipse(200, 520, 32, 30, "blue", 3.0),
         *[a for k, (dx, dy) in enumerate([(80, -40), (100, 10), (70, 50)]) for a in antibody(200 + dx + 30, 520 + dy, 1.0)],
         write("lymphocyte:  makes antibodies", 400, 500, 25),
         write("each antibody fits one antigen;  some give memory", 400, 538, 23, "grey")),

    # ── 4. Platelets and clotting ──────────────────────────────────────
    step("Platelets are tiny pieces of cells that help blood to clot. When a vessel is cut, platelets gather at the wound, and start a chain of reactions.",
         clear(2.2),
         heading("Platelets and clotting"),
         line(90, 300, 280, 300, "white", 3.4), line(420, 300, 600, 300, "white", 3.4), line(90, 460, 600, 460, "white", 3.4),
         label("the cut", 110, 250, 284, 298, 20, "pink"),
         dots([(300, 316), (322, 330), (348, 312), (372, 326), (396, 314), (334, 352)], "yellow", 9),
         write("platelets", 350, 400, 20, "yellow", "center"),
         chapter="Platelets and blood clotting"),

    step("Soluble fibrinogen in the plasma is turned into threads of fibrin. The threads make a mesh that traps red blood cells, and this forms the clot.",
         *[line(270 + 26 * k, 180, 340 + 22 * k, 300, "white", 2.0) for k in range(6)],
         *[line(262, 194 + 22 * k, 440, 204 + 18 * k, "white", 2.0) for k in range(5)],
         *[a for x, y in [(300, 222), (356, 250), (410, 220), (330, 280)] for a in red_cell(x, y, 16, 2.4)],
         write("1.  platelets gather at the cut", 660, 220, 22), write("2.  fibrinogen becomes fibrin threads", 660, 254, 22),
         write("3.  the mesh traps red cells:  a clot", 660, 288, 22),
         write("stops blood loss;  keeps germs out", 660, 330, 22, "green")),

    step("Clotting needs calcium ions, and vitamin K, which the liver uses to make clotting factors.",
         write("needs:  calcium ions,  vitamin K", 660, 380, 22, "yellow")),

    # ── 5. Blood groups ────────────────────────────────────────────────
    step("In the ABO system, your blood group depends on the antigens on your red cells, and the antibodies in your plasma.",
         clear(2.2),
         heading("ABO blood groups"),
         write("Group", 90, 172, 22, "grey"), write("Antigen on red cells", 280, 172, 22, "grey"), write("Antibodies in plasma", 720, 172, 22, "grey"),
         line(70, 188, 1200, 188, "grey", 2.2),
         chapter="ABO and Rhesus blood groups, and safe transfusion"),

    step("Group A has antigen A on its red cells, and antibodies against B in its plasma. Group B has antigen B, and antibodies against A.",
         write("A", 110, 236, 28, "yellow"), write("A", 280, 236, 26), write("anti-B", 720, 236, 26),
         write("B", 110, 286, 28, "yellow"), write("B", 280, 286, 26), write("anti-A", 720, 286, 26)),
    step("Group AB has both antigens, and no antibodies. Group O has no antigens, but antibodies against both A and B.",
         write("AB", 104, 336, 28, "yellow"), write("A and B", 280, 336, 26), write("none", 720, 336, 26),
         write("O", 110, 386, 28, "yellow"), write("none", 280, 386, 26), write("anti-A and anti-B", 720, 386, 26)),

    step("If the wrong blood is given, the patient's antibodies attack the donor's red cells. They clump together, which is agglutination, and that can kill. "
         "In the simple chart, group O can be given to anyone, and group AB can receive any group.",
         write("Wrong blood:  antibodies attack donor cells:  agglutination.", 90, 456, 24, "pink"),
         write("Simple chart:  O, universal donor;  AB, universal recipient.", 90, 496, 24)),

    step("There is also the Rhesus system: Rhesus positive if you have the D antigen, negative if you do not. Real hospitals always group and cross-match blood before a transfusion.",
         write("Rhesus:  D antigen present, Rh positive;  absent, Rh negative.", 90, 560, 23),
         write("Real transfusions:  always grouped and cross-matched.", 90, 600, 23, "green"),
         pause=1.2),
]

THUMBNAIL = [
    write("Blood", 54, 150, 84, "yellow"),
    write("Cells  ·  Clotting  ·  Blood groups", 60, 214, 34),
    *red_cell(160, 380, 70, 5.0), *red_cell(330, 470, 56, 4.6), *red_cell(150, 560, 48, 4.2),
    *moved(phagocyte(560, 430, 1.6), 0, 0), dots([(620, 380), (636, 404)], "green", 14),
    write("A  B  AB  O", 780, 420, 50, "pink"),
    write("plasma  ·  platelets", 780, 520, 30),
]
