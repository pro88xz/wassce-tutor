"""Physics · Simple harmonic motion: SHM equations, energy, damping and resonance. A chalkboard video lesson.

Follows content/notes/physics-shm-2.md: opens on a true story (1831, soldiers
marching in step across a suspension bridge, and the bridge collapsing), held
to the end; x = A sin ωt drawn as a graph, and why the speed is greatest where
the graph is steepest (v_max = Aω, a_max = Aω², v = ω√(A² − x²)); an example
worked together; energy swapping between kinetic and potential, E = ½kA², and
"what if the amplitude doubles?"; "your turn" with a pendulum bob; damping
drawn as a shrinking wave, with shock absorbers; forced oscillations and
resonance (the swing, the radio), and the bridge explained; and the spring
practical, T² against m.

Check: python3 scripts/video/board_video.py content/videos/physics-shm-2.py --boards .video-build/boards/shm2
"""

import math

from board_video import arrow, clear, curve, dashed, dots, ellipse, equation, heading, line, step, wave, write

TITLE = "SHM Equations, Energy in Oscillations, Damping and Resonance | WASSCE Physics"
DESCRIPTION = ("Simple harmonic motion continued on the chalkboard: why a bridge collapsed under marching soldiers, "
               "x = A sin ωt, maximum speed and acceleration, energy swapping between kinetic and potential, damping and "
               "shock absorbers, forced oscillations and resonance, and the spring constant practical.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Simple harmonic motion"
# The lesson page this video is on: /wassce/physics/simple-harmonic-motion/shm-equations-energy-damping-and-resonance
LESSON = "physics/simple-harmonic-motion/shm-equations-energy-damping-and-resonance"


def stop_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def soldier(x, ground, color="white"):
    return [ellipse(x, ground - 62, 9, 9, color, 2.6), line(x, ground - 52, x, ground - 24, color, 2.6),
            line(x, ground - 24, x - 9, ground, color, 2.6), line(x, ground - 24, x + 9, ground, color, 2.6),
            line(x - 11, ground - 42, x + 11, ground - 42, color, 2.6)]


def damped(x0, y0, length, amp, cycles, decay, color="yellow", n=240):
    pts = []
    for i in range(n + 1):
        t = i / n
        pts.append((x0 + length * t, y0 - amp * math.exp(-decay * t) * math.sin(2 * math.pi * cycles * t)))
    return curve(pts, color, 3.0)


def growing(x0, y0, length, amp, cycles, color="pink", n=240):
    pts = [(x0 + length * i / n, y0 - amp * (0.08 + 0.92 * i / n) * math.sin(2 * math.pi * cycles * i / n)) for i in range(n + 1)]
    return curve(pts, color, 3.0)


# The bridge (board 1)
BY = 470

STEPS = [
    # ── 1. The bridge ─────────────────────────────────────────────────
    step("In eighteen thirty-one, in England, a column of soldiers marched across a suspension bridge. Left, right, left, right, every boot "
         "landing at the same moment. The bridge began to sway. The sway grew with every step. And then the bridge collapsed.",
         heading("The bridge that fell"),
         line(720, BY - 210, 720, BY + 100, "white", 3.2), line(1200, BY - 210, 1200, BY + 100, "white", 3.2),
         curve([(720, BY - 210), (840, BY - 125), (960, BY - 100), (1080, BY - 125), (1200, BY - 210)], "grey", 2.4),
         *[line(x, BY - 100 - 0.00174 * (x - 960) ** 2 + 3, x, BY, "grey", 1.4) for x in (780, 840, 900, 960, 1020, 1080, 1140)],
         line(720, BY, 1200, BY, "white", 3.4),
         *[w for x in (800, 860, 920, 980, 1040, 1100) for w in soldier(x, BY)],
         pause=0.9, chapter="The bridge that fell"),

    step("Today, soldiers are ordered to break step when they cross a bridge. By the end of this lesson, you will understand exactly why. "
         "But first, we need the equations of simple harmonic motion.",
         write("Why do soldiers break step on bridges?", 70, 200, 26, "pink"),
         write("(hold that thought)", 70, 240, 22, "grey")),

    # ── 2. The equations ──────────────────────────────────────────────
    step("Start the clock as a body passes through the middle. Its displacement is then x equals {a} sine omega t: a sine curve, "
         "rising to plus {a}, falling to minus {a}, again and again.",
         clear(2.2),
         heading("The equations of SHM"),
         arrow(110, 470, 620, 470, "white", 2.6), arrow(110, 600, 110, 300, "white", 2.6),
         write("t", 630, 478, 20, "grey"), write("x", 122, 314, 20, "grey"),
         wave(110, 470, 500, 110, 1.5, "yellow", 3.2),
         write("+A", 96, 368, 20, "grey", "right"), write("-A", 96, 588, 20, "grey", "right"),
         write("x = A sin ωt", 690, 220, 32, "yellow"),
         chapter="Displacement, velocity and acceleration"),

    step("Now the velocity. Velocity is how fast the displacement changes: the steepness of this graph. Where is it steepest? "
         "Where the curve crosses the middle. Where is it flat? At the peaks.",
         line(110 + 500 / 3 - 50, 470 - 92, 110 + 500 / 3 + 50, 470 + 92, "green", 2.6),
         dots([(110 + 500 / 3, 470)], "green", 8),
         write("steepest:  crossing the middle", 690, 300, 23, "green"),
         write("flat:  at the peaks", 690, 340, 23, "pink"),
         dots([(110 + 500 / 6, 360), (110 + 500 / 2, 580)], "pink", 8)),

    step("So the speed is greatest in the middle, and that maximum is {a} omega. And the acceleration is greatest at the ends, "
         "where the pull back is strongest: {a} omega squared.",
         write("v_{max} = Aω   (in the middle)", 690, 420, 25, "green"),
         write("a_{max} = Aω^2   (at the ends)", 690, 465, 25, "pink")),

    step("For the speed at any displacement x, there is one more: v equals omega times the square root of {a} squared minus x squared. "
         "Check it. At the middle, x is zero, and you get {a} omega. At the end, x equals {a}, and you get zero. It works.",
         equation(["v = ω", {"root": "A^2 - x^2"}], 110, 640, 28, "yellow"),
         write("x = 0:  Aω.     x = A:  0.   It works.", 560, 640, 22, "grey")),

    # ── 3. Worked together ────────────────────────────────────────────
    step("Let us try them together. A body moves in SHM with an amplitude of zero point zero five metres, at two hertz. "
         "First, omega: two pi f, four pi, about twelve point five seven radians per second.",
         clear(2.2),
         heading("Worked together"),
         write("A = 0.05 m,   f = 2 Hz", 70, 190, 26),
         write("ω = 2πf = 4π = 12.57 rad s^{-1}", 70, 240, 26),
         chapter="Worked example"),

    step("The maximum speed is {a} omega: zero point six three metres per second. The maximum acceleration is {a} omega squared: "
         "seven point nine metres per second squared. Almost as much as gravity.",
         write("v_{max} = 0.05 × 12.57 = 0.628 m s^{-1}", 70, 310, 25, "green"),
         write("a_{max} = 0.05 × 12.57^2 = 7.90 m s^{-2}", 70, 355, 25, "pink")),

    step("And at a displacement of zero point zero three metres: omega times the root of zero point zero zero two five, minus zero point zero zero zero nine. "
         "That is twelve point five seven times zero point zero four: about zero point five metres per second.",
         equation(["x = 0.03:   v = 12.57", {"root": "0.0025 - 0.0009"}, "= 0.503 m s^{-1}"], 70, 440, 25, "yellow")),

    # ── 4. Energy ─────────────────────────────────────────────────────
    step("Follow the energy of a swinging pendulum. At the top of each swing, it stops: no kinetic energy, all potential. "
         "At the bottom, it is fastest: all kinetic. The energy flows back and forth between the two, and the total never changes.",
         clear(2.2),
         heading("Where does the energy go?"),
         line(900, 170, 1080, 170, "white", 3.0),
         line(990, 170, 990 - 280 * math.sin(math.radians(30)), 170 + 280 * math.cos(math.radians(30)), "grey", 2.0),
         ellipse(990 - 280 * math.sin(math.radians(30)), 170 + 280 * math.cos(math.radians(30)), 14, 14, "pink", 2.8),
         line(990, 170, 990, 450, "white", 2.4), ellipse(990, 464, 14, 14, "green", 2.8),
         line(990, 170, 990 + 280 * math.sin(math.radians(30)), 170 + 280 * math.cos(math.radians(30)), "grey", 2.0),
         ellipse(990 + 280 * math.sin(math.radians(30)), 170 + 280 * math.cos(math.radians(30)), 14, 14, "pink", 2.8),
         write("all PE", 990 - 160, 450, 20, "pink", "center"), write("all KE", 990, 510, 20, "green", "center"),
         write("all PE", 990 + 160, 450, 20, "pink", "center"),
         write("ends:  all potential.   middle:  all kinetic.", 70, 200, 24),
         write("the total stays the same", 70, 240, 24, "yellow"),
         chapter="Energy in SHM"),

    step("For a mass on a spring, the total energy is a half k {a} squared. Before I say it: if you double the amplitude, what happens to the energy?",
         equation(["E =", ("1", "2"), "kA^2"], 70, 320, 30, "yellow"),
         write("Double the amplitude:  the energy ... ?", 70, 410, 24, "pink"),
         pause=2.3),

    step("It goes up four times, because the amplitude is squared. A swing pushed twice as high carries four times the energy. "
         "Which is why your arms are tired after pushing a little brother on a swing for ten minutes.",
         write("4 times!  (amplitude squared)", 70, 455, 24, "green"),
         pause=1.0),

    step("Your turn. A pendulum bob is released from zero point two metres above its lowest point. How fast is it going at the bottom?",
         *stop_sign(1180, 82),
         write("Your turn:  released 0.2 m above the lowest point.", 70, 530, 23, "blue"),
         write("Speed at the bottom?", 70, 566, 23, "blue")),

    step("Try it. The energy idea makes this one quick.",
         write("try it", 1130, 92, 22, "pink", "right"),
         pause=3.2),

    step("All the potential energy becomes kinetic. Half m v squared equals m g h, the mass cancels, and v is the square root of two g h. "
         "The square root of four: two metres per second.",
         equation(["mgh =", ("1", "2"), "mv^2,   v =", {"root": "2gh"}, "=", {"root": "2 × 10 × 0.2"}, "= 2 m s^{-1}"], 70, 630, 23, "green")),

    # ── 5. Damping ────────────────────────────────────────────────────
    step("In real life, a swing does not go on forever. Air resistance and friction steal a little energy every swing, and the amplitude shrinks. "
         "That is a damped oscillation.",
         clear(2.2),
         heading("Damping"),
         arrow(720, 450, 1220, 450, "white", 2.6), arrow(720, 560, 720, 330, "white", 2.6),
         damped(720, 450, 480, 100, 5, 2.4),
         write("damped:  the amplitude shrinks", 70, 200, 25, "yellow"),
         write("(energy lost to friction and air)", 70, 240, 21, "grey"),
         chapter="Free, damped and forced oscillations"),

    step("Sometimes we want damping. A car's shock absorbers stop it bouncing up and down after it hits a pothole. "
         "And on some of our roads, those shock absorbers are working very hard indeed.",
         write("useful:  shock absorbers;  meter needles", 70, 320, 23, "green"),
         pause=1.0),

    step("A free oscillation vibrates at its own natural frequency. A forced oscillation is driven by an outside push, at the frequency of that push.",
         write("free:  at its natural frequency", 70, 400, 23),
         write("forced:  at the frequency of the push", 70, 440, 23)),

    # ── 6. Resonance ──────────────────────────────────────────────────
    step("Now the magic. When you push a swing, the timing matters more than the strength. Push at exactly its natural rhythm, once every swing, "
         "and the swings grow higher and higher. That is resonance: the driving frequency equals the natural frequency, and the amplitude becomes very large.",
         clear(2.2),
         heading("Resonance"),
         arrow(720, 470, 1220, 470, "white", 2.6), arrow(720, 600, 720, 330, "white", 2.6),
         growing(720, 470, 480, 120, 6),
         write("pushed in time:  it grows", 970, 640, 21, "pink", "center"),
         write("resonance:  driving frequency = natural frequency", 70, 200, 24, "yellow"),
         write("the amplitude becomes very large", 70, 240, 23, "pink"),
         chapter="Resonance and the bridge"),

    step("Resonance is everywhere. Tuning a radio means adjusting a circuit until it resonates with the station you want. "
         "A singer can shatter a glass by hitting its natural note.",
         write("radio tuning;  a singer and a glass", 70, 310, 22, "blue")),

    step("And now, the bridge. Every bridge has a natural frequency of its own. The soldiers' marching steps happened to match it. "
         "Each step was a push, perfectly timed, adding energy every time, exactly like pushing a swing. The sway grew, and grew, until the bridge failed.",
         write("the bridge:  marching = pushes in time,", 70, 390, 22, "pink"),
         write("at the bridge's natural frequency", 70, 426, 22, "pink")),

    step("Break step, and the pushes come at random times. They no longer add up. So that order to break step is not tradition. It is physics.",
         write("break step:  the pushes no longer add up", 70, 500, 22, "green"),
         pause=1.1),

    # ── 7. The practical ──────────────────────────────────────────────
    step("Finally, the practical. To find a spring's constant, hang masses on it, pull each down a little, and time twenty oscillations to find T. "
         "Plot T squared against m. You get a straight line through the origin.",
         clear(2.2),
         heading("Practical: finding k"),
         write("time 20 oscillations for each mass;  plot T^2 against m", 70, 190, 23),
         arrow(780, 560, 1180, 560, "white", 2.6), arrow(780, 560, 780, 330, "white", 2.6),
         write("m", 1185, 580, 20, "grey"), write("T^2", 792, 344, 20, "grey"),
         line(780, 560, 1140, 360, "green", 3.0), dots([(860, 516), (940, 471), (1020, 427), (1100, 382)], "yellow", 6),
         chapter="Practical: the spring constant"),

    step("Why a straight line? Square the formula: T squared is four pi squared over k, times m. So the gradient is four pi squared over k, "
         "and k is four pi squared over the gradient.",
         equation(["T^2 =", ("4π^2", "k"), "m,      k =", ("4π^2", "gradient")], 70, 270, 27, "yellow")),

    step("Precautions: a small amplitude, do not stretch the spring past its elastic limit, keep the mass moving straight up and down, and time many oscillations.",
         write("precautions:  small amplitude;  within the elastic limit;", 70, 360, 21, "pink"),
         write("straight up and down;  time many oscillations", 70, 394, 21, "pink")),

    step("That completes simple harmonic motion. Next, the ideas that tie all of mechanics together: work, energy, and power.",
         write("Next:  work, energy and power", 70, 470, 26, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Resonance", 54, 140, 84, "yellow"),
    write("SHM equations  ·  Energy  ·  Damping", 60, 210, 30),
    arrow(80, 470, 640, 470, "white", 3.0),
    growing(80, 470, 540, 150, 6),
    line(720, 420, 720, 600, "white", 3.4), line(1220, 420, 1220, 600, "white", 3.4),
    line(720, 520, 1220, 520, "white", 3.6),
    *[w for x in (800, 870, 940, 1010, 1080, 1150) for w in soldier(x, 520)],
    write("Why did the bridge fall?", 970, 640, 30, "pink", "center"),
]
