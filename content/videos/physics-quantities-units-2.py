"""Physics · Physical quantities and units: dimensions and dimensional analysis. A chalkboard video lesson.

Follows content/notes/physics-quantities-units-2.md: dimensions in M, L and T;
the dimensions of common quantities; the spring constant; checking an equation
for homogeneity (one right, one wrong); deriving the period of a pendulum; the
limits of dimensional analysis; and significant figures in answers.
Check: python3 scripts/video/board_video.py content/videos/physics-quantities-units-2.py --boards .video-build/boards/units2
"""

from board_video import arrow, box, clear, dashed, double_arrow, equation, heading, line, ellipse, ring, step, text_width, write, zigzag

TITLE = "Dimensions and Dimensional Analysis: M, L, T and the Pendulum | WASSCE Physics"
DESCRIPTION = ("Dimensions on the chalkboard: writing quantities in M, L and T, checking that an equation is "
               "dimensionally consistent, deriving the period of a simple pendulum, the limits of dimensional "
               "analysis, and significant figures.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Quantities and units"
# The lesson page this video is on: /wassce/physics/physical-quantities-and-units/dimensions-dimensional-analysis-and-significant-figures
LESSON = "physics/physical-quantities-and-units/dimensions-dimensional-analysis-and-significant-figures"


def row(y, cells, xs, size=25, colors=("yellow", "white", "blue")):
    return [write(c, x, y, size, col) for c, x, col in zip(cells, xs, colors) if c]


def root_over(x, y, num, den, size=32, color="white"):
    """A square root over a stacked fraction (laid out as equation() lays one out
    on the base line y): a chalk tick from the left, then the bar over the top."""
    w = max(text_width(num, size), text_width(den, size)) + 16
    top = y - size * 1.95      # above the numerator's capitals
    bottom = y + size * 1.1    # below the denominator
    mid = y - size * 0.3
    return [line(x, mid, x + 9, mid - 5, color, 3.2),
            line(x + 9, mid - 5, x + 20, bottom, color, 3.2),
            line(x + 20, bottom, x + 34, top, color, 3.2),
            line(x + 34, top, x + 44 + w, top, color, 3.2),
            equation([(num, den)], x + 40, y, size, color)]


def pendulum(px, py, length, angle_x, s=1.0, width=3.4):
    """A simple pendulum: a support, the string, the bob."""
    bx, by = px + angle_x, py + length
    return [line(px - 60 * s, py, px + 60 * s, py, "grey", width + 1),
            *[line(px - 50 * s + 20 * s * i, py, px - 62 * s + 20 * s * i, py - 14 * s, "grey", 2.4) for i in range(6)],
            line(px, py, bx, by - 22 * s, "white", width),
            ellipse(bx, by, 22 * s, 22 * s, "yellow", width + 0.6)]


DIMS = (70, 370, 720)   # quantity, defining equation, dimensions

STEPS = [
    # ── 1. What dimensions are ─────────────────────────────────────────
    step("Dimensions show how a quantity is built from the base quantities: mass, written M, length, written L, and time, written T.",
         heading("Dimensions"),
         write("mass  M", 90, 185, 34, "yellow"), write("length  L", 420, 185, 34, "yellow"), write("time  T", 790, 185, 34, "yellow"),
         chapter="What are dimensions? M, L and T"),

    step("Square brackets mean the dimensions of. Speed is length divided by time, so the dimensions of speed are L T to the minus one.",
         write("[ ]  means  \"the dimensions of\"", 90, 255, 26, "grey"),
         equation(["[speed] =", ("[length]", "[time]"), "= L T^{-1}"], 90, 360, 32)),

    step("Dimensions are the D N A of a quantity. With them you can check whether an equation could be right, and even predict a law before doing an experiment.",
         write("Use them to:", 90, 470, 28, "blue"),
         write("check an equation", 120, 514, 26),
         write("find the form of a law", 120, 552, 26)),

    # ── 2. Common quantities ───────────────────────────────────────────
    step("Here are the ones examiners ask for. Area is L squared, volume is L cubed, and density, mass over volume, is M L to the minus three.",
         clear(2.2),
         heading("Dimensions of quantities"),
         *row(176, ["quantity", "equation", "dimensions"], DIMS, 22, ("grey",) * 3),
         line(60, 190, 1100, 190, "grey", 2.2),
         *row(232, ["area,  volume", "l × b,  l × b × h", "L^2,  L^3"], DIMS),
         *row(276, ["density", "m ÷ V", "M L^{-3}"], DIMS),
         chapter="The dimensions of force, energy, power and pressure"),

    step("Velocity is L T to the minus one, and acceleration is L T to the minus two. So force, mass times acceleration, is M L T to the minus two.",
         *row(320, ["velocity", "s ÷ t", "L T^{-1}"], DIMS),
         *row(364, ["acceleration", "v ÷ t", "L T^{-2}"], DIMS),
         *row(408, ["force", "m × a", "M L T^{-2}"], DIMS)),

    step("Momentum, mass times velocity, is M L T to the minus one. Pressure, force over area, is M L to the minus one, T to the minus two.",
         *row(452, ["momentum", "m × v", "M L T^{-1}"], DIMS),
         *row(496, ["pressure", "F ÷ A", "M L^{-1} T^{-2}"], DIMS)),

    step("Work and energy, force times distance, are M L squared T to the minus two. And power, work over time, is M L squared T to the minus three.",
         *row(540, ["work, energy", "F × s", "M L^2 T^{-2}"], DIMS),
         *row(584, ["power", "W ÷ t", "M L^2 T^{-3}"], DIMS)),

    step("Pure numbers, like a half, two and pi, have no dimensions. Nor do ratios of like quantities, such as strain and efficiency.",
         write("no dimensions:", 70, 640, 24, "pink"), write("1/2,  2,  π;  strain,  efficiency", 330, 640, 24, "pink")),

    # ── 3. The spring constant ─────────────────────────────────────────
    step("Find the dimensions of the spring constant, k, in F equals k x. k is force over extension.",
         clear(2.2),
         heading("Example: the spring constant"),
         write("F = kx,  so  k = F ÷ x", 90, 190, 32),
         line(900, 170, 1100, 170, "grey", 4.0),
         *[line(915 + 20 * i, 170, 903 + 20 * i, 156, "grey", 2.4) for i in range(10)],
         line(1000, 170, 1000, 190, "white", 3.2), zigzag(1000, 190, 1000, 380, n=12, amp=18, color="white", width=3.2),
         line(1000, 380, 1000, 396, "white", 3.2), box(968, 396, 64, 52, "yellow", 3.4),
         arrow(1000, 452, 1000, 530, "pink"), write("F", 1016, 520, 28, "pink"),
         dashed(1040, 300, 1110, 300, "grey", 2.4, dash=8, gap=6), dashed(1040, 396, 1110, 396, "grey", 2.4, dash=8, gap=6),
         double_arrow(1090, 304, 1090, 392, "blue"), write("x", 1104, 360, 28, "blue"),
         equation(["[k] =", ("[F]", "[x]"), "=", ("M L T^{-2}", "L"), "= M T^{-2}"], 90, 320, 32, "blue"),
         chapter="Worked example: the dimensions of the spring constant"),

    step("The L cancels, leaving M T to the minus two. So the unit of k is the newton per metre, which in base units is kilogram per second squared.",
         write("unit:  N m^{-1}  =  kg s^{-2}", 90, 450, 32, "yellow")),

    # ── 4. Homogeneity ─────────────────────────────────────────────────
    step("A correct equation must be homogeneous: every term in it has the same dimensions. Check s equals u t plus a half a t squared.",
         clear(2.2),
         heading("Checking an equation"),
         write("Homogeneous:  every term has the same dimensions.", 70, 172, 26, "grey"),
         write("s = ut + 1/2 at^2", 90, 250, 34, "yellow"),
         chapter="Checking an equation: dimensional homogeneity"),

    step("s is a distance: L. u t is L T to the minus one, times T: L. And a half a t squared is L T to the minus two, times T squared: L again. Every term is L, so it is homogeneous.",
         write("[s] = L", 110, 312, 26),
         write("[ut] = L T^{-1} × T = L", 110, 352, 26),
         write("[1/2 at^2] = L T^{-2} × T^2 = L", 110, 392, 26),
         write("all L:  homogeneous", 110, 438, 26, "green")),

    step("A student writes v squared equals u squared plus two a t. v squared is L squared T to the minus two, but two a t is only L T to the minus one. "
         "The terms do not match, so the equation must be wrong. The correct one is v squared equals u squared plus two a s.",
         write("v^2 = u^2 + 2at ?", 680, 250, 34, "pink"),
         write("[v^2] = L^2 T^{-2}", 700, 312, 26),
         write("[2at] = L T^{-1}", 700, 352, 26),
         write("do not match:  wrong", 700, 398, 26, "pink"),
         write("correct:  v^2 = u^2 + 2as", 700, 444, 26, "green")),

    step("But be careful: an equation can be homogeneous and still be wrong. s equals u t plus a t squared has the right dimensions, but the wrong number in front.",
         write("Homogeneous can still be wrong:  s = ut + at^2", 70, 560, 26, "yellow"),
         write("(right dimensions, wrong number)", 110, 600, 22, "grey")),

    # ── 5. The pendulum ────────────────────────────────────────────────
    step("Dimensions can even find a law. The period of a simple pendulum may depend on the mass of the bob, the length of the string and g. "
         "Write the period as k times m to the x, l to the y, g to the z, where k is a number.",
         clear(2.2),
         heading("Deriving the pendulum's period"),
         *pendulum(1090, 190, 260, 70),
         write("l", 1110, 330, 30, "blue"), write("m", 1186, 470, 28, "yellow"),
         write("period = k m^x l^y g^z", 90, 200, 32),
         chapter="Using dimensions to derive the period of a pendulum"),

    step("The period is a time, T. So T equals M to the x, times L to the y, times L T to the minus two, to the z. That is M to the x, L to the y plus z, T to the minus two z.",
         write("T = M^x L^y (L T^{-2})^z = M^x L^{y+z} T^{-2z}", 90, 270, 30, "blue")),

    step("Now compare the powers. For M: x is zero, so the mass does not matter. For T: minus two z equals one, so z is minus a half. For L: y plus z is zero, so y is a half.",
         write("M:  x = 0", 110, 340, 28), write("(no mass)", 330, 340, 22, "grey"),
         write("T:  -2z = 1,  so  z = -1/2", 110, 386, 28),
         write("L:  y + z = 0,  so  y = 1/2", 110, 432, 28)),

    step("So the period is k times the square root of l over g. Dimensions cannot give the number k. Experiment shows it is two pi.",
         write("period = k", 110, 560, 34, "yellow"), *root_over(126 + text_width("period = k", 34), 560, "l", "g", 34, "yellow"),
         write("experiment:  k = 2π", 520, 548, 28, "green")),

    # ── 6. Limits; significant figures ─────────────────────────────────
    step("Dimensional analysis has limits. It cannot find number constants, like the two pi or the half. It cannot handle sums of terms, or sines and logs.",
         clear(2.2),
         heading("The limits"),
         write("cannot find number constants (2π, 1/2)", 90, 190, 26),
         write("cannot handle sums, sin, log", 90, 232, 26),
         chapter="Limits of dimensional analysis, and significant figures"),

    step("And it cannot tell apart quantities with the same dimensions: work and torque are both M L squared T to the minus two.",
         write("cannot tell work from torque (both M L^2 T^{-2})", 90, 274, 26)),

    step("Last, significant figures. Give your answer to the same number of significant figures as the least precise data, usually two or three.",
         write("Significant figures", 70, 360, 30, "yellow"),
         write("4.08", 110, 408, 28), write("3", 330, 408, 28, "blue"), write("zeros between digits count", 400, 408, 22, "grey"),
         write("0.0052", 110, 452, 28), write("2", 330, 452, 28, "blue"), write("leading zeros do not count", 400, 452, 22, "grey"),
         write("3.50", 110, 496, 28), write("3", 330, 496, 28, "blue"), write("a final zero after the point counts", 400, 496, 22, "grey"),
         write("2.0 × 10^3", 110, 540, 28), write("2", 330, 540, 28, "blue")),

    step("In the exam, lay out the powers of M, L and T clearly. Examiners give a mark for each step.",
         write("Exam: compare the powers of M, L and T step by step.", 70, 620, 26, "pink"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Dimensions", 54, 150, 92, "yellow"),
    write("M  L  T  ·  Homogeneity  ·  The pendulum", 60, 214, 30),
    write("[F] = M L T^{-2}", 80, 330, 52),
    write("[E] = M L^2 T^{-2}", 80, 410, 52),
    write("[P] = M L^2 T^{-3}", 80, 490, 52),
    *pendulum(1010, 250, 190, 60, 1.3, 5.0),
    write("T = 2π", 800, 588, 48, "green"), *root_over(816 + text_width("T = 2π", 48), 588, "l", "g", 40, "green"),
]
