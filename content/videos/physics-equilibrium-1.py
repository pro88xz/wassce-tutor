"""Physics · Equilibrium of forces: the triangle of forces and Lami's theorem. A chalkboard video lesson.

Follows content/notes/physics-equilibrium-1.md: opens with a drawing and no
words (a shop's signboard on two wires), then the forces on it; equilibrium,
resultant and equilibrant; the triangle of forces drawn nose to tail (and what if
it does not close?); Lami's theorem and its pairing of each force with the angle
opposite; a lamp on a wire, and why a washing line can never be straight; "try
this before I do" with two strings and Lami; and a block on a smooth slope.

Check: python3 scripts/video/board_video.py content/videos/physics-equilibrium-1.py --boards .video-build/boards/equil1
"""

from board_video import arrow, box, clear, dashed, ellipse, equation, heading, line, step, write

TITLE = "Equilibrium of Forces: Triangle of Forces, Lami's Theorem and Tension in Strings | WASSCE Physics"
DESCRIPTION = ("Balanced forces on the chalkboard: equilibrium and the equilibrant, the triangle of forces, Lami's theorem, "
               "the tension in a wire holding a lamp (and why a washing line is never straight), two strings to try "
               "yourself, and a block on a smooth slope.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Equilibrium"
# The lesson page this video is on: /wassce/physics/equilibrium-of-forces/equilibrium-of-forces-triangle-of-forces-and-lamis-theorem
LESSON = "physics/equilibrium-of-forces/equilibrium-of-forces-triangle-of-forces-and-lamis-theorem"


def stop_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


# A block on a smooth 30° slope: along the slope U, out of the slope N.
U, N = (0.866, -0.5), (-0.5, -0.866)
C0 = (940, 421)


def along(p, d, vec):
    return (p[0] + d * vec[0], p[1] + d * vec[1])


A, B = along(C0, -40, U), along(C0, 40, U)
Cc, D = along(B, 50, N), along(A, 50, N)
M = along(C0, 25, N)

STEPS = [
    # ── 1. Balanced ───────────────────────────────────────────────────
    step("",
         heading("Balanced"),
         line(760, 160, 1220, 160, "grey", 3.0),
         line(800, 160, 920, 300, "white", 2.6), line(1180, 160, 1060, 300, "white", 2.6),
         box(900, 300, 180, 90, "yellow", 3.2), write("SHOP", 990, 358, 30, "yellow", "center"),
         pause=0.4, chapter="What is equilibrium?"),

    step("This signboard, outside a shop in Kissy, is not moving. And yet, right now, at least three forces are pulling on it: "
         "its weight, and the two wires. Nothing moves, because they cancel perfectly.",
         arrow(920, 300, 860, 230, "green"), write("T", 850, 222, 22, "green", "right"),
         arrow(1060, 300, 1120, 230, "green"), write("T", 1130, 222, 22, "green"),
         arrow(990, 390, 990, 480, "pink"), write("W", 1005, 470, 22, "pink"),
         write("Three forces.  No movement.", 70, 200, 28)),

    step("That balance is called equilibrium. A body in equilibrium is at rest, or moving at a steady velocity. "
         "No acceleration, so the resultant force is zero.",
         write("equilibrium:  no acceleration;  resultant = 0", 70, 270, 25, "yellow"),
         write("ΣF_x = 0    and    ΣF_y = 0", 100, 330, 28, "yellow")),

    step("In plain words: everything pulling up equals everything pulling down, and everything pulling left equals everything pulling right.",
         write("up = down,    left = right", 100, 390, 27, "green")),

    step("Two words that sound alike. The resultant is the one force that does the job of all of them. "
         "The equilibrant is the one force that cancels them: the same size as the resultant, but the opposite way.",
         write("resultant:  does the job of all of them", 70, 470, 24, "blue"),
         write("equilibrant:  cancels them (equal and opposite)", 70, 510, 24, "blue")),

    # ── 2. The triangle of forces ─────────────────────────────────────
    step("Here is a beautiful idea. If three forces balance, draw them nose to tail, and they make a closed triangle. "
         "You end up exactly where you started.",
         clear(2.2),
         heading("The triangle of forces"),
         arrow(300, 420, 440, 320, "yellow"), arrow(300, 420, 140, 360, "blue"), arrow(300, 420, 320, 580, "pink"),
         write("F_1", 450, 316, 22, "yellow"), write("F_2", 128, 352, 22, "blue", "right"), write("F_3", 334, 584, 22, "pink"),
         arrow(800, 580, 940, 480, "yellow"), arrow(940, 480, 780, 420, "blue"), arrow(780, 420, 800, 580, "pink"),
         write("nose to tail:  closed!", 870, 626, 24, "green", "center"),
         chapter="The triangle of forces"),

    step("And it works the other way round. If three forces close up into a triangle, they are in equilibrium. "
         "Any number of forces in equilibrium make a closed polygon.",
         write("closed triangle  <->  equilibrium", 640, 210, 24, "yellow"),
         write("(any number:  a closed polygon)", 640, 248, 22, "grey")),

    step("Before I say it: what if the triangle does not close?",
         write("Doesn't close?", 640, 300, 24, "pink"),
         pause=2.0),

    step("Then the forces do not balance. There is a resultant, the gap that would close it, and the body accelerates.",
         write("then there is a resultant: it accelerates", 640, 340, 22, "green")),

    # ── 3. Lami's theorem ─────────────────────────────────────────────
    step("For three forces at a point, there is a neat shortcut: Lami's theorem. Each force, divided by the sine of the angle "
         "between the other two, gives the same number.",
         clear(2.2),
         heading("Lami's theorem"),
         arrow(300, 400, 300, 230, "yellow"), arrow(300, 400, 170, 520, "blue"), arrow(300, 400, 450, 510, "pink"),
         write("F_1", 312, 240, 22, "yellow"), write("F_2", 158, 530, 22, "blue", "right"), write("F_3", 462, 520, 22, "pink"),
         write("α", 305, 470, 24, "white", "center"), write("β", 372, 385, 24, "white", "center"), write("γ", 232, 385, 24, "white", "center"),
         equation([("F_1", "sin α"), "=", ("F_2", "sin β"), "=", ("F_3", "sin γ")], 620, 330, 30, "yellow"),
         chapter="Lami's theorem"),

    step("The trick is the pairing. Each force goes with the angle opposite it: the one between the other two forces. "
         "Get the pairing wrong, and the whole answer goes wrong.",
         write("each force goes with the angle", 620, 440, 23, "pink"),
         write("between the OTHER two", 620, 476, 23, "pink")),

    # ── 4. The lamp on a wire ─────────────────────────────────────────
    step("A forty newton lamp hangs from the middle of a wire, and each half makes thirty degrees with the horizontal. "
         "By symmetry, both halves pull with the same tension, T.",
         clear(2.2),
         heading("The lamp on a wire"),
         line(760, 200, 990, 330, "white", 2.8), line(990, 330, 1220, 200, "white", 2.8),
         line(990, 330, 990, 356, "white", 2.4), ellipse(990, 376, 22, 18, "yellow", 3.0),
         arrow(990, 398, 990, 470, "pink"), write("40 N", 1005, 460, 22, "pink"),
         write("30°", 772, 246, 20, "grey"), write("30°", 1208, 246, 20, "grey", "right"),
         write("T", 860, 300, 22, "green"), write("T", 1110, 300, 22, "green"),
         chapter="Tension in a wire"),

    step("Resolve vertically. The two upward parts hold up the weight. Two T sine thirty equals forty. "
         "Sine thirty is a half, so T is forty newtons.",
         write("2T sin 30° = 40,    T = 40 N", 70, 200, 28, "green")),

    step("Now flatten the wire, to just five degrees. T jumps to two hundred and twenty-nine newtons. The flatter the wire, the bigger the tension.",
         dashed(760, 300, 990, 320, "pink"), dashed(990, 320, 1220, 300, "pink"),
         write("at 5°:  T = 40 ÷ (2 sin 5°) = 229 N", 70, 270, 25, "pink"),
         write("flatter wire,  bigger tension", 70, 312, 25, "pink")),

    step("Which is why a washing line can never be pulled perfectly straight with clothes on it. It would need infinite tension. "
         "So if anyone tells you to pull it straighter, you now have a physics excuse.",
         write("A perfectly straight washing line?", 70, 400, 24),
         write("Infinite tension.  (A physics excuse.)", 70, 438, 24, "grey"),
         pause=1.0),

    # ── 5. Try this before I do ───────────────────────────────────────
    step("Try this before I do. A hundred newton weight hangs from two strings. One makes thirty degrees with the vertical, "
         "the other sixty, on opposite sides. Find both tensions.",
         clear(2.2),
         heading("Try this before I do"),
         *stop_sign(1180, 82),
         dashed(1000, 300, 1000, 150, "grey"),
         line(1000, 300, 910, 144, "white", 2.8), line(1000, 300, 1156, 210, "white", 2.8),
         arrow(1000, 300, 1000, 440, "pink"), write("100 N", 1015, 430, 22, "pink"),
         write("T_1", 930, 230, 22, "green", "right"), write("T_2", 1090, 280, 22, "green"),
         write("30°", 968, 195, 18, "grey", "center"), write("60°", 1040, 225, 18, "grey", "center"),
         write("100 N on two strings:  30° and 60° to the vertical.", 70, 190, 24),
         write("Find both tensions.", 70, 228, 24, "blue"),
         chapter="Lami's theorem: two strings"),

    step("Pause here, and see how far you get.",
         write("pause here", 1130, 92, 22, "pink", "right"),
         pause=3.2),

    step("The angle between the two strings is ninety degrees. Between the thirty degree string and the weight, a hundred and fifty. "
         "Between the sixty degree string and the weight, a hundred and twenty.",
         write("between strings: 90°;   T_1 and W: 150°;   T_2 and W: 120°", 70, 300, 21)),

    step("So by Lami: T one over sine a hundred and twenty, equals T two over sine a hundred and fifty, equals a hundred over sine ninety. "
         "T one is eighty-six point six newtons, and T two is fifty.",
         equation([("T_1", "sin 120°"), "=", ("T_2", "sin 150°"), "=", ("100", "sin 90°")], 70, 385, 26),
         write("T_1 = 86.6 N,    T_2 = 50 N", 70, 470, 27, "green")),

    step("Notice: the string nearer the vertical carries more of the load. It is doing more of the holding up.",
         write("nearer the vertical:  more of the load", 70, 530, 24, "yellow")),

    # ── 6. A smooth slope ─────────────────────────────────────────────
    step("Last, a block held still on a smooth slope, by a force P up the slope. Resolve along the slope, and across it.",
         clear(2.2),
         heading("A smooth slope"),
         line(700, 560, 1180, 560, "white", 3.0), line(1180, 560, 1180, 283, "white", 3.0), line(700, 560, 1180, 283, "white", 3.0),
         line(*A, *B, "yellow", 3.0), line(*B, *Cc, "yellow", 3.0), line(*Cc, *D, "yellow", 3.0), line(*D, *A, "yellow", 3.0),
         arrow(*M, *along(M, 110, U), "green"), write("P", along(M, 120, U)[0], along(M, 120, U)[1] - 4, 22, "green"),
         arrow(*M, M[0], M[1] + 120, "pink"), write("mg", M[0] + 12, M[1] + 112, 22, "pink"),
         arrow(*M, *along(M, 100, N), "blue"), write("R", along(M, 108, N)[0] - 18, along(M, 108, N)[1], 22, "blue"),
         write("30°", 770, 548, 20, "grey"),
         chapter="A block on a smooth slope"),

    step("Along the slope, P balances the part of the weight pulling it down: m g sine theta. Across the slope, R balances m g cos theta. "
         "For a twenty newton block on a thirty degree slope: P is ten newtons, and R is seventeen point three.",
         write("P = mg sin θ = 20 × 0.5 = 10 N", 70, 200, 25, "green"),
         write("R = mg cos θ = 20 × 0.866 = 17.3 N", 70, 242, 25, "blue")),

    step("So that is equilibrium: the quietest page in mechanics. Resolve in two directions, and almost every question falls apart in your hands. "
         "In the next lesson, we tilt the ground further, and add friction.",
         write("Resolve in two directions.", 70, 330, 26, "yellow"),
         write("Coming up:  slopes with friction", 70, 380, 23, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Equilibrium", 54, 140, 84, "yellow"),
    write("Triangle of forces  ·  Lami's theorem  ·  Tension", 60, 210, 30),
    line(700, 280, 1220, 280, "grey", 3.0),
    line(740, 280, 900, 430, "white", 3.0), line(1180, 280, 1020, 430, "white", 3.0),
    box(880, 430, 160, 80, "yellow", 3.4), write("SHOP", 960, 484, 30, "yellow", "center"),
    arrow(100, 560, 260, 440, "yellow", 4.0), arrow(260, 440, 80, 380, "blue", 4.0), arrow(80, 380, 100, 560, "pink", 4.0),
    write("closed = balanced", 330, 480, 34, "green"),
]
