"""Physics · Work, energy and power: efficiency, vehicle power and energy sources. A chalkboard video lesson.

Follows content/notes/physics-work-energy-2.md: opens on something felt (the
heat off a gen-set that has run for an hour is fuel money, wasted), drawn as an
energy flow, 100 J in and 35 J out; efficiency, and a table of real machines
(the filament bulb is a heater that glows a little); a pump worked through
together; energy lost to friction on a slide (and where it went); "your turn"
with a bullet stopped by a tree; why vehicles slow on hills, from P = Fv;
renewable and non-renewable sources, with "is charcoal renewable?"; and Sierra
Leone's own energy mix, with the trade-offs of hydro, solar and gen-sets.

Check: python3 scripts/video/board_video.py content/videos/physics-work-energy-2.py --boards .video-build/boards/work2
"""

from board_video import arrow, box, clear, ellipse, equation, heading, line, step, write

TITLE = "Efficiency, Energy Lost to Friction, Vehicle Power (P = Fv) and Energy Sources | WASSCE Physics"
DESCRIPTION = ("Efficiency on the chalkboard: why a gen-set gets hot, efficiency of real machines, a pump worked through, energy "
               "lost to friction on a slide, a bullet stopped by a tree, why vehicles slow on hills (P = Fv), and renewable and "
               "non-renewable energy in Sierra Leone.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Work, energy and power"
# The lesson page this video is on: /wassce/physics/work-energy-and-power/efficiency-vehicle-power-and-energy-sources
LESSON = "physics/work-energy-and-power/efficiency-vehicle-power-and-energy-sources"


def bus(x, y, deg=0.0, color="yellow"):
    """A minibus side on, its back-bottom corner at (x, y), tilted up by deg."""
    import math
    t = math.radians(deg)
    u, n = (math.cos(t), -math.sin(t)), (-math.sin(t), -math.cos(t))
    pt = lambda a, b: (x + a * u[0] + b * n[0], y + a * u[1] + b * n[1])
    body = [pt(0, 0), pt(150, 0), pt(150, 46), pt(0, 46)]
    out = [line(*body[i], *body[(i + 1) % 4], color, 3.0) for i in range(4)]
    out += [ellipse(*pt(32, -8), 9, 9, "white", 2.4), ellipse(*pt(118, -8), 9, 9, "white", 2.4)]
    return out


def stop_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


STEPS = [
    # ── 1. The hot gen-set ────────────────────────────────────────────
    step("Next time a gen-set has been running for an hour, hold your hand near it. Not on it. Near it. Feel that heat? "
         "That heat is fuel money, being wasted.",
         heading("Feel the heat"),
         box(880, 280, 200, 110, "white", 3.2), write("gen-set", 980, 344, 26, "white", "center"),
         *[line(920 + 45 * i, 266, 910 + 45 * i, 226, "pink", 2.4) for i in range(4)],
         *[line(910 + 45 * i, 226, 922 + 45 * i, 190, "pink", 2.4) for i in range(4)],
         write("heat", 1100, 214, 22, "pink"),
         pause=0.9, chapter="Where does the energy go?"),

    step("Of every hundred joules of energy in the diesel, a typical gen-set turns only about thirty-five into electricity. "
         "The other sixty-five escape as heat, and noise. The energy is not destroyed. It just goes somewhere useless.",
         arrow(220, 560, 440, 560, "yellow"), write("fuel:  100 J", 330, 540, 23, "yellow", "center"),
         box(440, 520, 120, 80, "white", 2.8), write("gen-set", 500, 568, 20, "white", "center"),
         arrow(560, 540, 780, 500, "green"), write("electricity:  35 J", 790, 506, 23, "green"),
         arrow(560, 580, 780, 620, "pink"), write("heat and sound:  65 J", 790, 630, 23, "pink"),
         write("Energy is not lost.  It goes somewhere useless.", 70, 200, 25, "grey")),

    # ── 2. Efficiency ─────────────────────────────────────────────────
    step("Efficiency measures how much of the input becomes useful output. Useful output over input, times a hundred percent. "
         "For the gen-set: thirty-five percent.",
         clear(2.2),
         heading("Efficiency"),
         equation(["efficiency =", ("useful output", "input"), "× 100%"], 70, 220, 30, "yellow"),
         chapter="Efficiency"),

    step("Here is how real machines compare. A large electric motor: about ninety percent. A hydroelectric generator: up to ninety. "
         "A car engine: twenty to thirty. A solar panel: fifteen to twenty-two.",
         write("electric motor:  90%", 100, 320, 24, "green"),
         write("hydroelectric generator:  85 to 90%", 100, 360, 24, "green"),
         write("gen-set:  30 to 40%", 100, 400, 24),
         write("car engine:  20 to 30%", 100, 440, 24),
         write("solar panel:  15 to 22%", 100, 480, 24)),

    step("And the old filament bulb: about five percent. Ninety-five percent of its energy comes out as heat. "
         "So it is really a small heater that happens to glow a little.",
         write("filament bulb:  about 5%   (a heater that glows!)", 100, 520, 24, "pink"),
         pause=1.0),

    step("No real machine is ever a hundred percent efficient. Some energy always escapes, mostly as heat from friction.",
         write("Never 100%:  friction always takes its share.", 70, 600, 25, "yellow")),

    # ── 3. The pump, together ─────────────────────────────────────────
    step("Let us work one together. A two kilowatt electric pump lifts fifteen hundred kilograms of water up twenty metres, in three minutes. How efficient is it?",
         clear(2.2),
         heading("A pump, worked together"),
         write("2 kW pump;  1500 kg of water up 20 m in 3 minutes", 70, 190, 24),
         chapter="Worked example: a pump"),

    step("The useful work is lifting the water: m g h, fifteen hundred times ten times twenty. Three hundred thousand joules.",
         write("useful:  mgh = 1500 × 10 × 20 = 300 000 J", 70, 250, 25, "green")),

    step("The input is the power times the time. Two thousand watts for a hundred and eighty seconds: three hundred and sixty thousand joules.",
         write("input:  Pt = 2000 × 180 = 360 000 J", 70, 300, 25)),

    step("So the efficiency is three hundred thousand, over three hundred and sixty thousand: about eighty-three percent. "
         "Notice the habit: write the useful energy and the input on separate lines before you divide.",
         equation(["efficiency =", ("300 000", "360 000"), "× 100% = 83.3%"], 70, 380, 27, "yellow")),

    # ── 4. Friction takes its share ───────────────────────────────────
    step("Friction steals energy everywhere. A forty kilogram child slides from rest down a slide three metres high, and reaches the bottom at six metres per second.",
         clear(2.2),
         heading("Friction takes its share"),
         line(1010, 170, 1200, 350, "white", 3.2), line(1010, 170, 1010, 350, "grey", 2.2), line(960, 350, 1230, 350, "grey", 2.4),
         write("3 m", 995, 270, 22, "grey", "right"),
         write("40 kg child,  3 m slide,  6 m s^{-1} at the bottom", 70, 190, 23),
         chapter="Energy lost to friction"),

    step("At the top, the potential energy is forty times ten times three: twelve hundred joules. At the bottom, the kinetic energy is "
         "a half times forty times thirty-six: seven hundred and twenty joules.",
         write("top:  PE = 40 × 10 × 3 = 1200 J", 70, 250, 25),
         write("bottom:  KE = 0.5 × 40 × 36 = 720 J", 70, 295, 25)),

    step("So four hundred and eighty joules went missing. Where? Into heat, in the slide and in the child's trousers. "
         "That warm feeling at the bottom of a slide is physics.",
         write("lost to friction:  1200 - 720 = 480 J  (as heat)", 70, 355, 25, "pink"),
         pause=1.0),

    step("Your turn. A twenty gram bullet at three hundred metres per second hits a tree trunk, and stops fifteen centimetres in. "
         "What was the average force of the wood on it?",
         *stop_sign(1180, 82),
         write("Your turn:  a 20 g bullet at 300 m s^{-1} stops", 70, 440, 23, "blue"),
         write("15 cm into a tree.  Average force?", 70, 476, 23, "blue")),

    step("Think energy, not equations of motion. Pause the video.",
         write("think energy", 1130, 92, 22, "pink", "right"),
         pause=3.2),

    step("All its kinetic energy is used up doing work against the wood. A half times zero point zero two times three hundred squared: "
         "nine hundred joules. Work equals force times distance, so F times zero point one five equals nine hundred. F is six thousand newtons.",
         write("KE = 0.5 × 0.02 × 300^2 = 900 J;   F × 0.15 = 900,   F = 6000 N", 70, 560, 22, "green")),

    # ── 5. Why vehicles slow on hills ─────────────────────────────────
    step("Why does a fully loaded poda-poda crawl up a steep hill? At a steady speed, the engine's driving force equals the resistance. "
         "And its power is force times velocity.",
         clear(2.2),
         heading("Why vehicles slow on hills"),
         write("steady speed:  driving force = resistance", 70, 190, 25),
         write("P = Fv", 70, 250, 34, "yellow"),
         chapter="Vehicle power: P = Fv"),

    step("On the flat, against fifteen hundred newtons at twenty metres per second, the engine gives thirty thousand watts: thirty kilowatts.",
         write("flat:  P = 1500 × 20 = 30 000 W = 30 kW", 70, 320, 25),
         line(860, 300, 1220, 300, "grey", 2.4), *bus(900, 283), arrow(1068, 262, 1160, 262, "green"),
         write("20 m s^{-1}", 1128, 238, 20, "green", "center")),

    step("On the hill, gravity adds to the resistance, say to two thousand five hundred newtons. The engine still gives only thirty kilowatts, "
         "so v is P over F: thirty thousand over twenty-five hundred. Twelve metres per second. Same power, bigger force, lower speed.",
         write("hill:  v = P ÷ F = 30 000 ÷ 2500 = 12 m s^{-1}", 70, 370, 25, "pink"),
         write("same power,  bigger force,  lower speed", 70, 415, 24, "green"),
         line(820, 620, 1220, 470, "grey", 2.4), *bus(900, 574, 20.6, "pink"),
         write("12 m s^{-1}", 1150, 540, 20, "pink", "center")),

    # ── 6. Energy sources ─────────────────────────────────────────────
    step("Finally, where does our energy come from? Renewable sources are replaced naturally and will not run out: sunlight, falling water, wind, "
         "and biomass, like firewood. Non-renewable sources are used up faster than they form: coal, oil, gas and nuclear fuels.",
         clear(2.2),
         heading("Energy sources"),
         write("renewable", 230, 190, 28, "green", "center"), write("non-renewable", 790, 190, 28, "pink", "center"),
         line(510, 165, 510, 380, "grey", 2.2),
         write("solar,  hydro", 230, 245, 24, "white", "center"),
         write("wind,  biomass", 230, 285, 24, "white", "center"),
         write("tides,  geothermal", 230, 325, 24, "white", "center"),
         write("coal,  crude oil", 790, 245, 24, "white", "center"),
         write("natural gas", 790, 285, 24, "white", "center"),
         write("nuclear fuels", 790, 325, 24, "white", "center"),
         chapter="Renewable and non-renewable energy"),

    step("Here is one to think about. Most homes in Sierra Leone cook with charcoal. Is charcoal renewable?",
         write("Is charcoal renewable?", 70, 440, 25, "pink"),
         pause=2.4),

    step("Only if trees are replanted faster than they are cut. Cut faster than they grow, and it behaves like a fuel that runs out, "
         "and the forest goes with it.",
         write("only if trees are replanted faster than they are cut", 70, 485, 23, "green")),

    step("Our electricity comes mainly from hydroelectric stations like Bumbuna, Dodo and Goma, from diesel generators, and more and more from solar. "
         "Each has a trade-off. Hydro needs no fuel, but its output falls in the dry season. Solar is free and clean, but gives nothing at night "
         "without batteries. Diesel works anywhere, but the fuel is costly, noisy and smoky.",
         write("hydro:  no fuel;  but weaker in the dry season", 70, 560, 22, "blue"),
         write("solar:  free and clean;  nothing at night without batteries", 70, 594, 22, "blue"),
         write("diesel:  anywhere;  costly, noisy, smoky", 70, 628, 22, "blue"),
         chapter="Energy in Sierra Leone"),

    step("That completes work, energy and power. Next: machines. How a simple lever lets one person lift a car, "
         "and why you never, ever get something for nothing.",
         write("Next:  simple machines", 820, 440, 26, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Efficiency", 54, 140, 84, "yellow"),
    write("Energy losses  ·  P = Fv  ·  Energy sources", 60, 210, 30),
    arrow(120, 470, 380, 470, "yellow", 4.0), write("100 J", 250, 446, 32, "yellow", "center"),
    box(380, 420, 160, 100, "white", 3.4), write("gen-set", 460, 480, 26, "white", "center"),
    arrow(540, 440, 820, 380, "green", 4.0), write("35 J useful", 830, 390, 34, "green"),
    arrow(540, 500, 820, 560, "pink", 4.0), write("65 J heat!", 830, 580, 34, "pink"),
]
