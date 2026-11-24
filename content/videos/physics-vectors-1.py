"""Physics · Scalars and vectors: adding and resolving vectors. A chalkboard video lesson.

Follows content/notes/physics-vectors-1.md: scalars and vectors (with the keke
at the roundabout); drawing a vector to scale; vectors in the same and
opposite directions; the parallelogram and triangle laws; the resultant by
Pythagoras and by the cosine rule, with the lesson's two worked examples; and
resolving a force into components (the girl pulling a basin).
Check: python3 scripts/video/board_video.py content/videos/physics-vectors-1.py --boards .video-build/boards/vectors1
"""

import math

from board_video import arrow, box, clear, dashed, ellipse, equation, heading, line, step, write

TITLE = "Scalars and Vectors: Resultant, Parallelogram Law and Resolving Forces | WASSCE Physics"
DESCRIPTION = ("Scalars and vectors on the chalkboard: magnitude and direction, the parallelogram and triangle laws, "
               "finding a resultant by Pythagoras and the cosine rule, and resolving a force into components, with "
               "WASSCE worked examples.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Scalars and vectors"
# The lesson page this video is on: /wassce/physics/scalars-and-vectors/scalars-and-vectors-adding-and-resolving-vectors
LESSON = "physics/scalars-and-vectors/scalars-and-vectors-adding-and-resolving-vectors"


def polar(x, y, length, deg):
    """The point `length` px from (x, y) at `deg` degrees above the horizontal."""
    t = math.radians(deg)
    return x + length * math.cos(t), y - length * math.sin(t)


def roundabout(cx, cy, r):
    """A roundabout, and the keke's velocity at three points: always along the
    road (a tangent), so its direction keeps changing while its speed does not."""
    out = [ellipse(cx, cy, r, r, "grey", 3.0)]
    for deg in (0, 90, 180):
        t = math.radians(deg)
        x, y = cx + r * math.cos(t), cy - r * math.sin(t)
        dx, dy = -math.sin(t), -math.cos(t)
        out.append(arrow(x - 38 * dx, y - 38 * dy, x + 48 * dx, y + 48 * dy, "yellow"))
    return out


def parallelogram(ox, oy, p_len, q_len, q_deg, s=1.0, width=3.6, labels=True):
    """Vectors P (along the line) and Q (at q_deg) from O, the parallelogram's
    other two sides dashed, and the resultant R along the diagonal."""
    px, py = ox + p_len, oy
    qx, qy = polar(ox, oy, q_len, q_deg)
    cx, cy = px + (qx - ox), qy
    out = [arrow(ox, oy, px, py, "white", width), arrow(ox, oy, qx, qy, "white", width),
           dashed(px, py, cx, cy, "grey", width * 0.8), dashed(qx, qy, cx, cy, "grey", width * 0.8),
           arrow(ox, oy, cx, cy, "green", width * 1.2)]
    if labels:
        out += [write("P", (ox + px) / 2, oy + 38 * s, 30 * s, "white", "center"),
                write("Q", (ox + qx) / 2 - 52 * s, (oy + qy) / 2, 30 * s),
                write("R", (ox + cx) / 2 - 24 * s, (oy + cy) / 2 - 16 * s, 32 * s, "green"),
                write("O", ox - 34 * s, oy + 10 * s, 26 * s, "grey")]
    return out


STEPS = [
    # ── 1. Scalars and vectors ─────────────────────────────────────────
    step("Push a stalled car with a friend, and the result depends not only on how hard you each push, but on which way. "
         "That is what separates vectors from scalars.",
         heading("Scalars and vectors"),
         box(990, 230, 170, 74, "white"), ellipse(1030, 312, 16, 16, "grey", 3.0), ellipse(1120, 312, 16, 16, "grey", 3.0),
         arrow(830, 190, 985, 245, "yellow"), arrow(830, 350, 985, 290, "yellow"),
         write("which way matters", 850, 372, 24, "grey"),
         chapter="Scalars and vectors: what is the difference?"),

    step("A scalar has magnitude, or size, only. A vector has both magnitude and direction.",
         write("scalar:  magnitude only", 70, 190, 30, "blue"),
         write("vector:  magnitude and direction", 70, 240, 30, "pink")),

    step("Distance, speed, mass, time, energy and temperature are scalars. "
         "Displacement, velocity, weight, acceleration, force and momentum are vectors.",
         write("Scalars", 90, 325, 28, "blue"), write("Vectors", 400, 325, 28, "pink"),
         *[write(w, 100, 366 + 38 * i, 24) for i, w in enumerate(["distance", "speed", "mass", "time", "energy", "temperature"])],
         *[write(w, 410, 366 + 38 * i, 24) for i, w in enumerate(["displacement", "velocity", "weight", "acceleration", "force", "momentum"])]),

    step("A common mistake. Speed is a scalar, but velocity is a vector. A keke going round a roundabout at a steady twenty kilometres per hour "
         "has a constant speed, but its velocity keeps changing, because its direction keeps changing.",
         *roundabout(1060, 520, 85),
         write("constant speed,", 660, 500, 22, "blue"), write("changing velocity", 660, 536, 22, "pink")),

    # ── 2. Drawing and adding vectors ──────────────────────────────────
    step("A vector is drawn as an arrow. Its length, to a chosen scale, shows the magnitude, and the arrow shows the direction. "
         "With one centimetre for ten newtons, forty-five newtons east is an arrow four point five centimetres long.",
         clear(2.2),
         heading("Adding vectors"),
         write("scale:  1 cm for 10 N", 70, 178, 26, "grey"),
         arrow(90, 245, 540, 245, "yellow"), write("45 N east:  4.5 cm", 220, 228, 26, "yellow"),
         chapter="Adding vectors: the parallelogram and triangle laws"),

    step("In the same direction, vectors simply add: five newtons east and three newtons east make eight newtons east. "
         "In opposite directions they subtract: five newtons east and three newtons west leave two newtons east.",
         arrow(90, 330, 340, 330, "white"), write("5 N", 190, 316, 24), arrow(344, 330, 494, 330, "blue"), write("3 N", 400, 316, 24, "blue"),
         write("= 8 N east", 560, 340, 28, "green"),
         arrow(90, 410, 340, 410, "white"), write("5 N", 190, 396, 24), arrow(340, 430, 190, 430, "blue"), write("3 N", 250, 462, 24, "blue"),
         write("= 2 N east", 560, 425, 28, "green")),

    step("But at an angle, they do not simply add. A three newton force and a four newton force can give anything from one newton to seven newtons, "
         "depending on the angle between them.",
         write("3 N and 4 N at an angle:  anything from 1 N to 7 N", 70, 560, 27, "pink"),
         write("(it depends on the angle between them)", 90, 600, 23, "grey")),

    # ── 3. The parallelogram and triangle laws ─────────────────────────
    step("The resultant is the single vector with the same effect as all the vectors acting together. "
         "The parallelogram law: if two vectors acting at a point are drawn as two sides of a parallelogram, their resultant is the diagonal from that point.",
         clear(2.2),
         heading("The parallelogram law"),
         *parallelogram(130, 540, 400, 260, 50),
         write("Resultant:  the single vector", 740, 220, 24, "yellow"),
         write("with the same effect as all", 740, 256, 24, "yellow"),
         write("of them acting together", 740, 292, 24, "yellow")),

    step("The triangle law is the same idea. Draw the vectors nose to tail, and the resultant joins the tail of the first to the nose of the last.",
         write("Triangle law:  nose to tail", 740, 390, 26, "blue"),
         arrow(790, 590, 1010, 590, "white"), arrow(1010, 590, 1100, 470, "white"), arrow(790, 590, 1100, 470, "green", 4.2),
         write("P", 890, 625, 24), write("Q", 1070, 550, 24), write("R", 925, 515, 26, "green")),

    # ── 4. Calculating the resultant ───────────────────────────────────
    step("To calculate it: when the two vectors are at right angles, use Pythagoras for the size, and the tangent for the direction.",
         clear(2.2),
         heading("Calculating the resultant"),
         equation(["R =", {"root": "P^2 + Q^2"}], 70, 215, 32),
         equation(["tan θ =", ("Q", "P")], 520, 215, 32),
         write("(at 90°)", 790, 215, 24, "grey"),
         chapter="Calculating the resultant, with worked examples"),

    step("At any other angle, theta, between them, R squared equals P squared plus Q squared plus two P Q cos theta.",
         write("R^2 = P^2 + Q^2 + 2PQ cos θ", 70, 310, 32, "blue"), write("(any angle θ)", 700, 310, 24, "grey")),

    step("Example. A boy walks eight metres east, then six metres north. Find his displacement.",
         write("Example:  8 m east, then 6 m north.", 70, 395, 28, "yellow"),
         arrow(820, 590, 1140, 590, "white"), arrow(1140, 590, 1140, 350, "white"), arrow(820, 590, 1140, 350, "green", 4.2),
         write("8 m", 960, 628, 24), write("6 m", 1156, 480, 24), write("R", 950, 450, 28, "green"), write("θ", 890, 580, 24, "grey")),

    step("The walks are at right angles, so R is the square root of sixty-four plus thirty-six, which is the square root of one hundred: ten metres.",
         equation(["R =", {"root": "8^2 + 6^2"}, "=", {"root": "100"}, "= 10 m"], 70, 480, 30)),

    step("And tan theta is six over eight, zero point seven five, so theta is thirty-six point nine degrees. "
         "His displacement is ten metres, at thirty-six point nine degrees north of east. He walked fourteen metres, but his displacement is only ten.",
         equation(["tan θ =", ("6", "8"), "= 0.75,  θ = 36.9°"], 70, 575, 30),
         write("10 m at 36.9° north of east", 70, 650, 27, "green")),

    step("Example two. Forces of five newtons and twelve newtons act at a point, with sixty degrees between them. Find the resultant.",
         clear(2.2),
         heading("Example 2"),
         write("5 N and 12 N at 60° to each other.  Find R.", 70, 175, 28, "yellow"),
         arrow(850, 580, 1190, 580, "white"), write("12 N", 1000, 618, 24),
         arrow(850, 580, *polar(850, 580, 150, 60), "white"), write("5 N", 820, 490, 24),
         write("60°", 896, 566, 22, "grey")),

    step("R squared equals five squared, plus twelve squared, plus two times five times twelve times cos sixty. "
         "Cos sixty is a half, so that is twenty-five plus one hundred and forty-four plus sixty: two hundred and twenty-nine.",
         write("R^2 = 5^2 + 12^2 + 2(5)(12) cos 60°", 70, 265, 28),
         write("= 25 + 144 + 60 = 229", 132, 315, 28)),

    step("So R is the square root of two hundred and twenty-nine: fifteen point one newtons.",
         equation(["R =", {"root": "229"}, "= 15.1 N"], 70, 410, 34, "yellow")),

    step("Check that it makes sense. It must lie between twelve minus five, which is seven, and twelve plus five, which is seventeen. It does.",
         write("check:  between 12 - 5 = 7 N", 70, 500, 26, "green"),
         write("and 12 + 5 = 17 N", 178, 540, 26, "green")),

    # ── 5. Resolving ───────────────────────────────────────────────────
    step("Now the reverse. A single vector can be replaced by two vectors at right angles, its components, which together have the same effect. "
         "For a force F at an angle theta to the horizontal, the horizontal part is F cos theta, and the vertical part is F sine theta.",
         clear(2.2),
         heading("Resolving a vector"),
         arrow(110, 520, *polar(110, 520, 330, 35), "yellow", 4.0), write("F", 220, 410, 30, "yellow"),
         dashed(110, 520, polar(110, 520, 330, 35)[0], 520, "blue", 3.4),
         dashed(polar(110, 520, 330, 35)[0], 520, *polar(110, 520, 330, 35), "pink", 3.4),
         write("θ", 180, 508, 26, "grey"),
         write("F cos θ", 190, 562, 26, "blue"), write("F sin θ", 396, 440, 26, "pink"),
         write("horizontal:  F cos θ", 560, 280, 30, "blue"),
         write("vertical:  F sin θ", 560, 330, 30, "pink"),
         chapter="Resolving a vector into components"),

    step("Example. A girl pulls a basin across the floor with a rope at thirty degrees to the horizontal, with a force of forty newtons.",
         write("Example:  40 N at 30° to the horizontal", 548, 420, 25, "yellow")),

    step("The horizontal part, forty cos thirty, is thirty-four point six newtons. That is what pulls the basin along. "
         "The vertical part, forty sine thirty, is twenty newtons, and it only lifts the basin a little.",
         write("40 cos 30° = 34.6 N  (moves it)", 580, 466, 26),
         write("40 sin 30° = 20 N  (lifts it)", 580, 506, 26)),

    step("Careful: cos goes with the side next to the angle. If the angle is measured from the vertical, then the vertical part is F cos theta.",
         write("cos goes with the side next to the angle:", 70, 616, 26, "pink"),
         write("check where θ is measured from.", 70, 652, 26, "pink"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Vectors", 54, 150, 92, "yellow"),
    write("Resultant  ·  Parallelogram law  ·  Components", 60, 214, 30),
    *parallelogram(120, 560, 360, 230, 50, 1.3, 6.0),
    equation(["R =", {"root": "P^2 + Q^2"}], 700, 380, 46, "yellow"),
    write("F cos θ", 720, 490, 42, "blue"), write("F sin θ", 720, 560, 42, "pink"),
]
