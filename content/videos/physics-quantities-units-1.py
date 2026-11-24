"""Physics · Physical quantities and units: SI units and prefixes. A chalkboard video lesson.

Follows content/notes/physics-quantities-units-1.md: a physical quantity as a
number times a unit; the seven SI base quantities; deriving SI units from
defining equations (the newton, joule, watt and pascal); prefixes and standard
form, with Bumbuna's 50 MW; converting km/h to m/s and areas and volumes; and
what WASSCE marks for.
Check: python3 scripts/video/board_video.py content/videos/physics-quantities-units-1.py --boards .video-build/boards/units1
"""

from board_video import arrow, box, clear, equation, heading, line, ring, step, text_width, write

TITLE = "Physical Quantities and SI Units: Base Units, Derived Units, Prefixes | WASSCE Physics"
DESCRIPTION = ("Physical quantities on the chalkboard: the seven SI base quantities and units, deriving the newton, joule, "
               "watt and pascal, prefixes from giga to pico, standard form, and converting km/h to m/s, with WASSCE "
               "worked examples.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Quantities and units"
VOICE = "bm_george"   # the Physics voice
# The lesson page this video is on: /wassce/physics/physical-quantities-and-units/physical-quantities-si-units-and-prefixes
LESSON = "physics/physical-quantities-and-units/physical-quantities-si-units-and-prefixes"


def row(y, cells, xs, size=25, colors=None):
    """One row of a table: each cell at its column's x."""
    colors = colors or ["white"] * len(cells)
    return [write(c, x, y, size, col) for c, x, col in zip(cells, xs, colors) if c]


BASE = [("length", "metre", "m"), ("mass", "kilogram", "kg"), ("time", "second", "s"),
        ("electric current", "ampere", "A"), ("temperature", "kelvin", "K"),
        ("amount of substance", "mole", "mol"), ("luminous intensity", "candela", "cd")]
BX = (90, 560, 860)   # quantity, unit, symbol

# Board 1's "m = 65 kg": where the number and the unit are, to point at them
MX = 790
NUM_X = MX + text_width("m = ", 40) + text_width("65", 40) / 2
UNIT_X = MX + text_width("m = 65 ", 40) + text_width("kg", 40) / 2
PA = "1 Pa = 1 N m^{-2} = 1 kg m^{-1} s^{-2}"
EVERY = "Every final answer needs its unit."

PREFIX = [("G", "giga", "10^9"), ("M", "mega", "10^6"), ("k", "kilo", "10^3"), ("c", "centi", "10^{-2}"),
          ("m", "milli", "10^{-3}"), ("μ", "micro", "10^{-6}"), ("n", "nano", "10^{-9}"), ("p", "pico", "10^{-12}")]

STEPS = [
    # ── 1. What a physical quantity is ─────────────────────────────────
    step("Every answer you write in a WASSCE Physics paper is a physical quantity: a number and a unit. "
         "The speed is twenty earns nothing. The speed is twenty metres per second earns the mark.",
         heading("Physical quantities"),
         write("quantity = number × unit", 70, 185, 36, "yellow"),
         write("speed = 20", 90, 255, 28, "pink"), write("no mark", 440, 255, 24, "grey"),
         write("speed = 20 m/s", 90, 305, 28, "green"), write("the mark", 440, 305, 24, "grey"),
         chapter="What is a physical quantity?"),

    step("A physical quantity is anything that can be measured and written as a number times a unit. "
         "Length, mass, time and temperature are physical quantities. Beauty and kindness are not: they cannot be measured on an agreed scale.",
         write("A physical quantity can be measured", 70, 395, 26),
         write("and written as a number × a unit.", 70, 432, 26),
         write("length, mass, time, temperature:  yes", 90, 488, 24, "green"),
         write("beauty, kindness:  no", 90, 524, 24, "pink")),

    step("Take a mass of sixty-five kilograms. Sixty-five is the number, and the kilogram is the unit. "
         "Write it in grams and the number becomes sixty-five thousand, but the mass is just the same.",
         write("m = 65 kg", MX, 270, 40, "blue"),
         arrow(NUM_X - 20, 300, NUM_X - 40, 340, "grey"), write("number", NUM_X - 40, 372, 22, "grey", "center"),
         arrow(UNIT_X + 10, 300, UNIT_X + 30, 340, "grey"), write("unit", UNIT_X + 30, 372, 22, "grey", "center"),
         write("= 65 000 g", 820, 440, 32, "blue"),
         write("the same mass", 830, 486, 22, "grey")),

    # ── 2. The seven base quantities ───────────────────────────────────
    step("Fundamental, or base, quantities are not defined from other quantities. The international system, called S I, has seven of them.",
         clear(2.2),
         heading("The seven SI base quantities"),
         write("not defined from other quantities", 70, 168, 24, "grey"),
         *row(220, ["quantity", "SI unit", "symbol"], BX, 22, ["grey"] * 3),
         line(80, 234, 1000, 234, "grey", 2.2),
         chapter="The seven SI base quantities and their units"),

    step("Length is measured in metres, mass in kilograms, and time in seconds. These three are in almost every question.",
         *[a for i, r in enumerate(BASE[:3]) for a in row(272 + 44 * i, r, BX, 25, ["yellow", "white", "blue"])]),

    step("Then electric current, in amperes. Temperature, in kelvin. Amount of substance, in moles. And luminous intensity, in candelas.",
         *[a for i, r in enumerate(BASE[3:]) for a in row(404 + 44 * i, r, BX, 25, ["yellow", "white", "blue"])]),

    step("A favourite exam trap: weight is not a fundamental quantity. Weight is a force, so it is derived, and mass is the fundamental one. "
         "In the same way, temperature is fundamental, but heat is derived.",
         write("weight is derived (a force);  mass is fundamental", 70, 590, 24, "pink"),
         write("heat is derived (an energy);  temperature is fundamental", 70, 626, 24, "pink")),

    # ── 3. Derived units ───────────────────────────────────────────────
    step("Derived quantities are made by multiplying or dividing base quantities. To find a derived unit, write the defining equation and put in each unit.",
         clear(2.2),
         heading("Deriving SI units"),
         *row(178, ["quantity", "defining equation", "SI unit"], (70, 330, 820), 22, ["grey"] * 3),
         line(60, 192, 1200, 192, "grey", 2.2),
         chapter="Deriving SI units: newton, joule, watt and pascal"),

    step("Speed is distance over time, so its unit is metres per second. Acceleration is change in velocity over time: metres per second squared.",
         *row(236, ["speed", "distance ÷ time", "m s^{-1}"], (70, 330, 820), 25, ["yellow", "white", "blue"]),
         *row(286, ["acceleration", "velocity change ÷ time", "m s^{-2}"], (70, 330, 820), 25, ["yellow", "white", "blue"])),

    step("Force is mass times acceleration: kilogram metre per second squared. This unit has its own name: the newton.",
         *row(336, ["force", "mass × acceleration", "kg m s^{-2} = N"], (70, 330, 820), 25, ["yellow", "white", "blue"])),

    step("Work is force times distance: newton metre, which is the joule. And power is work over time: joule per second, which is the watt.",
         *row(386, ["work, energy", "force × distance", "N m = J"], (70, 330, 820), 25, ["yellow", "white", "blue"]),
         *row(436, ["power", "work ÷ time", "J s^{-1} = W"], (70, 330, 820), 25, ["yellow", "white", "blue"])),

    step("Now an exam favourite. Find the base units of pressure. Pressure is force over area, and force is mass times acceleration.",
         clear(2.2),
         heading("Example: the units of pressure"),
         equation(["pressure =", ("force", "area"), "=", ("mass × acceleration", "area")], 90, 250, 32),
         chapter="Worked example: the base units of pressure"),

    step("So the unit is kilogram metre per second squared, over metre squared.",
         equation(["unit =", ("kg × m s^{-2}", "m^2")], 90, 400, 32, "blue")),

    step("One metre cancels, leaving kilogram per metre per second squared. That is the pascal.",
         write("= kg m^{-1} s^{-2}", 300, 500, 32, "blue"),
         write(PA, 120, 600, 34, "yellow"),
         box(96, 556, text_width(PA, 34) + 52, 66)),

    # ── 4. Prefixes and standard form ──────────────────────────────────
    step("Physics deals with the width of an atom and the distance to the Sun, so we use prefixes instead of long strings of zeros. "
         "Giga is ten to the nine. Mega, ten to the six. Kilo, ten to the three. And centi, ten to the minus two.",
         clear(2.2),
         heading("Prefixes"),
         *[a for i, r in enumerate(PREFIX[:4]) for a in row(180 + 46 * i, r, (90, 160, 330), 28, ["blue", "white", "yellow"])],
         chapter="Prefixes and standard form"),

    step("Milli is ten to the minus three. Micro, ten to the minus six. Nano, ten to the minus nine. And pico, ten to the minus twelve.",
         *[a for i, r in enumerate(PREFIX[4:]) for a in row(180 + 46 * i, r, (560, 630, 800), 28, ["blue", "white", "yellow"])]),

    step("Bumbuna hydroelectric station was built to deliver about fifty megawatts. That is fifty times ten to the six watts, "
         "or five times ten to the seven watts.",
         write("Bumbuna:  about 50 MW", 90, 420, 28, "green"),
         write("= 50 × 10^6 W = 5 × 10^7 W", 120, 466, 28, "green")),

    step("In standard form, a number is written as A times ten to the n, with A at least one and less than ten. "
         "The distance to the Moon, three hundred and eighty-four million metres, is three point eight four times ten to the eight metres.",
         write("Standard form:  A × 10^n,  with A from 1 up to 10", 90, 548, 26, "yellow"),
         write("384 000 000 m = 3.84 × 10^8 m", 120, 594, 26),
         write("0.000 52 m = 5.2 × 10^{-4} m", 120, 636, 26)),

    # ── 5. Converting units ────────────────────────────────────────────
    step("To convert a unit, multiply by fractions that are equal to one, so the unwanted units cancel. Convert seventy-two kilometres per hour to metres per second.",
         clear(2.2),
         heading("Converting units"),
         write("Convert 72 km/h to m/s.", 70, 175, 28, "yellow"),
         equation(["72", ("km", "h"), "×", ("1000 m", "1 km"), "×", ("1 h", "3600 s")], 90, 268, 30),
         chapter="Converting units: km/h to m/s, and cm³ to m³"),

    step("The kilometres cancel and the hours cancel. Seventy-two thousand divided by three thousand six hundred is twenty metres per second.",
         equation(["=", ("72 000", "3600"), "= 20 m/s"], 90, 380, 30, "yellow")),

    step("A shortcut worth remembering: divide kilometres per hour by three point six to get metres per second.",
         write("Shortcut:  km/h ÷ 3.6 = m/s", 90, 470, 28, "blue")),

    step("Be careful with areas and volumes. One metre is a hundred centimetres, but one square metre is ten thousand square centimetres, "
         "and one cubic metre is a million cubic centimetres. Square or cube the conversion too.",
         write("1 m = 100 cm", 730, 268, 28),
         write("1 m^2 = 10 000 cm^2", 730, 318, 28),
         write("1 m^3 = 1 000 000 cm^3", 730, 368, 28, "pink"),
         write("square or cube the factor too", 730, 414, 22, "grey")),

    step("In the exam, every final answer needs its unit. A correct number with a missing or wrong unit usually loses the mark.",
         write(EVERY, 100, 586, 30, "pink"),
         ring(100 + text_width(EVERY, 30) / 2, 574, text_width(EVERY, 30) / 2 + 46, 50),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("SI Units", 54, 150, 92, "yellow"),
    write("Physical quantities  ·  Prefixes  ·  Conversions", 60, 214, 30),
    write("length", 80, 320, 44), write("m", 400, 320, 44, "blue"),
    write("mass", 80, 390, 44), write("kg", 400, 390, 44, "blue"),
    write("time", 80, 460, 44), write("s", 400, 460, 44, "blue"),
    write("+ 4 more", 80, 528, 32, "grey"),
    write("k = 10^3", 700, 330, 44, "yellow"), write("M = 10^6", 700, 400, 44, "yellow"), write("μ = 10^{-6}", 700, 470, 44, "yellow"),
    write("72 km/h = 20 m/s", 650, 600, 40, "green"),
    box(626, 554, 590, 66, "green", 4.0),
]
