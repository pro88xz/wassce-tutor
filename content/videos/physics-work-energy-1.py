"""Physics · Work, energy and power: work, energy, power and conservation of energy. A chalkboard video lesson.

Follows content/notes/physics-work-energy-1.md, each idea with its reason:
opens on a surprising claim (an hour holding a bag of rice, and physics says no
work was done), then why: work needs movement along the force; W = Fs cos θ with a
box pulled by a rope; work as the area under a force-distance graph; energy, and
where ½mv² and mgh come from (the work it took to give them); a car crash as a
fall from a building, and "double the speed?"; a falling stone with energy bars
drawn at the top, halfway and the bottom; energy chains (Bumbuna, a gen-set, a
phone), with "think fast"; and power, with stairs worked through and a crane to
try.

Check: python3 scripts/video/board_video.py content/videos/physics-work-energy-1.py --boards .video-build/boards/work1
"""

from board_video import arrow, box, clear, curve, dots, ellipse, equation, heading, line, step, wave, write

TITLE = "Work, Energy and Power Explained: W = Fs, ½mv², mgh and Conservation of Energy | WASSCE Physics"
DESCRIPTION = ("Work, energy and power on the chalkboard: why holding a heavy bag is no work, W = Fs cos θ, work from a graph, "
               "where ½mv² and mgh come from, a car crash as a fall, conservation of energy with a falling stone, energy "
               "changes, and power.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Work, energy and power"
# The lesson page this video is on: /wassce/physics/work-energy-and-power/work-energy-power-and-conservation-of-energy
LESSON = "physics/work-energy-and-power/work-energy-power-and-conservation-of-energy"


def stop_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


def person(x, feet, color="white"):
    return [ellipse(x, feet - 92, 13, 13, color, 2.8), line(x, feet - 78, x, feet - 36, color, 2.8),
            line(x, feet - 36, x - 14, feet, color, 2.8), line(x, feet - 36, x + 14, feet, color, 2.8)]


def bars(x, base, pe, ke, scale=0.42):
    """Two energy bars (PE pink, KE green) of heights in joules, standing on y = base."""
    out = []
    if pe:
        out.append(box(x, base - pe * scale, 40, pe * scale, "pink", 2.6))
    if ke:
        out.append(box(x + 50, base - ke * scale, 40, ke * scale, "green", 2.6))
    out += [write("PE", x + 20, base + 24, 18, "pink", "center"), write("KE", x + 70, base + 24, 18, "green", "center")]
    return out


STEPS = [
    # ── 1. A surprising claim ─────────────────────────────────────────
    step("Here is something that will annoy you. Stand still for an hour, holding a heavy bag of rice in your arms. "
         "Your arms shake. Your shoulders burn. And physics says you did no work at all. Not a single joule.",
         heading("An hour of no work"),
         *person(980, 560),
         line(980, 495, 945, 432, "white", 2.8), line(980, 495, 1015, 432, "white", 2.8),
         box(925, 382, 110, 50, "yellow", 3.0), write("rice", 980, 414, 20, "yellow", "center"),
         line(860, 560, 1100, 560, "grey", 2.4),
         pause=1.1, chapter="What counts as work?"),

    step("Unfair? Here is the reason. In physics, work is done only when a force moves something in the direction of the force. "
         "The bag did not move. No movement, no work. Your aching arms are your muscles working inside you, but on the bag, nothing.",
         write("work = force × distance moved", 70, 200, 28, "yellow"),
         write("in the direction of the force", 70, 240, 28, "yellow"),
         write("bag held still:  it does not move,  so W = 0", 70, 300, 24, "pink")),

    step("And a waiter carrying a tray across a room, at the same height? The tray moves sideways, but the force holding it up points straight up. "
         "The movement is at right angles to the force, so again, no work is done against gravity.",
         write("tray carried level:  force up, movement sideways,  W = 0", 70, 350, 23, "pink")),

    step("Work is measured in joules. One joule is the work done when a force of one newton moves something one metre, in the direction of the force.",
         write("1 J:  1 N moving 1 m along the force", 70, 420, 25, "blue")),

    # ── 2. Force at an angle ──────────────────────────────────────────
    step("Pull a box with a rope that slants upwards, and only part of your pull drags the box forward. "
         "That part is F cos theta. So the work done is F s cos theta.",
         clear(2.2),
         heading("Pulling at an angle"),
         line(700, 470, 1220, 470, "grey", 2.4), box(780, 400, 110, 70, "yellow", 3.0),
         line(890, 420, 1050, 328, "white", 2.6), arrow(1050, 328, 1080, 311, "green"), write("50 N", 1090, 316, 22, "green"),
         arrow(890, 440, 1010, 440, "blue"), write("F cos θ", 1020, 448, 20, "blue"),
         write("60°", 930, 412, 20, "grey"),
         equation(["W = Fs cos θ"], 70, 220, 32, "yellow"),
         chapter="Work done by a force at an angle"),

    step("A boy pulls a box twenty metres, with a rope at sixty degrees and a tension of fifty newtons. "
         "Fifty, times twenty, times cos sixty, which is a half: five hundred joules.",
         write("50 × 20 × cos 60° = 50 × 20 × 0.5 = 500 J", 70, 300, 25, "green")),

    step("And if the force changes as it moves? Then plot force against distance. The work done is the area under the graph. "
         "Stretching a spring, the force grows steadily, the graph is a triangle, and the work is a half F x.",
         arrow(110, 620, 520, 620, "white", 2.6), arrow(110, 620, 110, 400, "white", 2.6),
         write("x", 525, 640, 20, "grey"), write("F", 122, 414, 20, "grey"),
         line(110, 620, 460, 440, "yellow", 3.0),
         *[line(x, 618, x, 620 - (x - 110) * 180 / 350 + 2, "green", 1.8) for x in range(130, 460, 20)],
         equation(["area = work =", ("1", "2"), "Fx"], 560, 560, 26, "green")),

    # ── 3. Energy, and where the formulas come from ───────────────────
    step("Energy is the ability to do work, and it is measured in joules too. Kinetic energy is energy of motion: a half m v squared. "
         "But where does that come from? It is the work it took to get the body moving.",
         clear(2.2),
         heading("Kinetic and potential energy"),
         write("energy:  the ability to do work  (joules)", 70, 190, 25),
         equation(["kinetic:   E_k =", ("1", "2"), "mv^2"], 70, 270, 28, "yellow"),
         chapter="Where ½mv² and mgh come from"),

    step("Push a body from rest with a force F over a distance s. The work is F s, which is m {a} s. And from the equations of motion, "
         "{a} s is a half v squared. So the work is a half m v squared. That work is now stored in its motion.",
         write("work = Fs = mas,   and   as = v^2 / 2", 100, 350, 24),
         equation(["so  work =", ("1", "2"), "mv^2:   stored as motion"], 100, 400, 24, "green")),

    step("Potential energy is energy of position. Lift a mass m up a height h, and you push with its weight, m g, through h. "
         "The work is m g h, and it is stored in its height, waiting.",
         write("potential:   E_p = mgh", 70, 480, 28, "yellow"),
         write("(the work done lifting it, stored in its height)", 70, 518, 22, "grey")),

    step("How dangerous is speed? A twelve hundred kilogram car at fifteen metres per second has a hundred and thirty-five thousand joules. "
         "That is the same energy it would gain falling eleven metres: a three-storey building. That is what a crash at fifty-four kilometres per hour is.",
         write("1200 kg at 15 m s^{-1}:  135 000 J  =  a fall of 11 m", 70, 578, 23, "pink")),

    step("Before I say it: double the speed. What happens to the kinetic energy?",
         write("Double the speed:  the energy ... ?", 70, 626, 23, "pink"),
         pause=2.3),

    step("Four times bigger, because the speed is squared. At a hundred and eight kilometres per hour, that car hits like a fall from a fourteen-storey building.",
         write("4 times!", 660, 626, 23, "green")),

    # ── 4. Conservation of energy ─────────────────────────────────────
    step("Now the most important law in all of science. Energy can never be created or destroyed. It only changes from one form to another.",
         clear(2.2),
         heading("Energy is never lost"),
         write("Energy is never created or destroyed;", 70, 190, 26, "yellow"),
         write("it only changes form.", 70, 230, 26, "yellow"),
         chapter="Conservation of energy"),

    step("Watch it with a two kilogram stone dropped from twenty metres. At the top, it has four hundred joules of potential energy, and no kinetic energy.",
         *bars(760, 560, 400, 0), write("top", 805, 616, 20, "grey", "center"),
         write("top:   PE = 2 × 10 × 20 = 400 J,   KE = 0", 70, 300, 24)),

    step("Halfway down, it has lost half its height, so two hundred joules of potential, and the other two hundred is now kinetic. "
         "Just before it lands, all four hundred joules is kinetic. The total never changes.",
         *bars(920, 560, 200, 200), write("halfway", 965, 616, 20, "grey", "center"),
         *bars(1080, 560, 0, 400), write("bottom", 1125, 616, 20, "grey", "center"),
         write("halfway:  PE 200 J,  KE 200 J", 70, 345, 24),
         write("bottom:  KE = 400 J", 70, 390, 24),
         write("the total is always 400 J", 70, 440, 25, "green")),

    step("So its landing speed: a half times two times v squared equals four hundred. v is twenty metres per second.",
         equation([("1", "2"), "× 2 × v^2 = 400,    v = 20 m s^{-1}"], 70, 510, 25, "green")),

    # ── 5. Energy chains ──────────────────────────────────────────────
    step("Energy is always on a journey from one form to another. At Bumbuna, water high up the dam has potential energy. It falls, gains kinetic energy, "
         "spins turbines, and becomes electrical energy, all the way to your light bulb.",
         clear(2.2),
         heading("Energy on a journey"),
         write("Bumbuna:  PE of water  ->  KE  ->  electrical", 70, 200, 25, "blue"),
         # the journey, drawn: a dam, water falling through a pipe, a turbine, a bulb
         line(150, 620, 1220, 620, "grey", 2.4),
         wave(170, 470, 330, 5, 4, "blue", 2.6), line(170, 470, 170, 620, "grey", 2.0),
         line(500, 440, 540, 440, "white", 3.0), line(500, 440, 500, 620, "white", 3.0), line(540, 440, 590, 620, "white", 3.0),
         write("water up high", 335, 515, 20, "blue", "center"), write("PE", 335, 575, 26, "pink", "center"),
         curve([(500, 560), (560, 575), (640, 590), (730, 596)], "blue", 3.0),
         write("KE", 648, 568, 22, "green", "center"),
         ellipse(770, 596, 26, 26, "white", 3.0),
         *[line(770, 596, 770 + 24 * c, 596 + 24 * d, "white", 2.4) for c, d in ((1, 0), (-1, 0), (0, 1), (0, -1))],
         write("turbine", 770, 556, 20, "grey", "center"),
         line(796, 596, 1040, 596, "yellow", 2.4), write("electrical", 920, 584, 20, "yellow", "center"),
         line(1040, 596, 1040, 560, "yellow", 2.4), ellipse(1040, 532, 24, 28, "yellow", 3.0),
         *[line(1040 + 34 * c, 532 + 34 * d, 1040 + 48 * c, 532 + 48 * d, "yellow", 2.4) for c, d in ((1, 0), (-1, 0), (0.7, -0.7), (-0.7, -0.7), (0, -1))],
         write("light", 1110, 600, 20, "yellow"),
         write("solar panel:  light  ->  electrical", 70, 245, 25, "blue"),
         write("charging a phone:  electrical  ->  chemical", 70, 290, 25, "blue"),
         chapter="Energy changes in everyday devices"),

    step("Think fast. A gen-set: what is its energy chain?",
         write("Think fast:  a gen-set?", 70, 370, 25, "pink"),
         pause=2.3),

    step("Chemical energy in the fuel, to heat when it burns, to kinetic energy in the engine, to electrical energy. "
         "Plus a great deal of sound, as your neighbours will tell you.",
         write("chemical  ->  heat  ->  kinetic  ->  electrical  (and sound!)", 70, 415, 24, "green"),
         pause=1.0),

    # ── 6. Power ──────────────────────────────────────────────────────
    step("Last: power. Two students carry the same bucket of water up the same stairs. One walks, one runs. They do the same work. "
         "But the runner does it faster, so the runner's power is greater. Power is the rate of doing work.",
         clear(2.2),
         heading("Power"),
         equation(["P =", ("W", "t"), "      (watts:  1 W = 1 J s^{-1})"], 70, 220, 28, "yellow"),
         chapter="Power"),

    step("A sixty kilogram student runs up a flight of stairs four metres high in five seconds. The work is m g h: two thousand four hundred joules. "
         "Divide by five seconds: four hundred and eighty watts. Roughly the power of a microwave oven, running up the stairs.",
         write("60 × 10 × 4 = 2400 J;   2400 ÷ 5 = 480 W", 70, 300, 25, "green")),

    step("And for something moving steadily against a force, there is a shortcut: P equals F times v.",
         write("moving steadily against a force:   P = Fv", 70, 360, 25, "blue")),

    step("Your turn. A crane lifts a five hundred kilogram load through twelve metres in twenty seconds. What is its power output?",
         *stop_sign(1180, 82),
         write("Your turn:  a crane lifts 500 kg through 12 m in 20 s.", 70, 440, 23, "pink"),
         write("Power output?", 70, 476, 23, "pink")),

    step("Pause, and work it out.",
         write("work it out", 1130, 92, 22, "pink", "right"),
         pause=3.2),

    step("Five hundred times ten times twelve: sixty thousand joules. Over twenty seconds: three thousand watts, or three kilowatts.",
         write("500 × 10 × 12 = 60 000 J;   ÷ 20 = 3000 W = 3 kW", 70, 540, 24, "green")),

    step("Next time: why no machine ever gives back all the energy you put in, how much power a vehicle needs, and where our energy comes from.",
         write("Next:  efficiency, and energy sources", 70, 620, 24, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Work & Energy", 54, 140, 84, "yellow"),
    write("W = Fs  ·  Kinetic energy  ·  mgh  ·  Power", 60, 210, 30),
    *person(940, 600),
    line(940, 535, 902, 470, "white", 2.8), line(940, 535, 978, 470, "white", 2.8),
    box(880, 414, 120, 56, "yellow", 3.2), write("rice", 940, 450, 22, "yellow", "center"),
    line(820, 600, 1080, 600, "grey", 2.4),
    write("1 hour holding it:", 70, 400, 40, "white"),
    write("W = 0 !", 70, 480, 64, "pink"),
]
