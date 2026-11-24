"""Physics · Waves: types, terms and the wave equation. A chalkboard video lesson.

Follows content/notes/physics-waves-1.md: what a wave is; mechanical and
electromagnetic waves; transverse and longitudinal waves; amplitude,
wavelength, period and frequency; v = fλ and f = 1/T; the lesson's two worked
examples (a 98.0 MHz radio station, a bobbing bottle); why frequency does not
change in a new medium; and the two wave graphs examiners use.
Check: python3 scripts/video/board_video.py content/videos/physics-waves-1.py --boards .video-build/boards/waves
"""

import math

from board_video import arrow, box, clear, dashed, double_arrow, ellipse, equation, frac, heading, line, ring, step, wave, write

TITLE = "Waves and the Wave Equation v = fλ: Wavelength, Frequency, Amplitude | WASSCE Physics"
DESCRIPTION = ("Waves on the chalkboard: mechanical and electromagnetic, transverse and longitudinal; amplitude, "
               "wavelength, period and frequency; the wave equation v = fλ and f = 1/T, with two worked WASSCE "
               "examples and the two wave graphs.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Waves"
VOICE = "bm_george"   # the Physics voice
# The lesson page this video is on: /wassce/physics/wave-motion-and-properties/waves-types-terms-and-the-wave-equation
LESSON = "physics/wave-motion-and-properties/waves-types-terms-and-the-wave-equation"

# Board 3's wave: rest line y = 400, two wavelengths of 300 px from x = 100.
# Crests at x = 175 and 475 (y = 310); troughs at 325 and 625 (y = 490).
REST, AMP, X0, LAMBDA = 400, 90, 100, 300


def longitudinal(x0=80, y0=455, y1=535, length=480, spacing=12, shift=14, period=160, color="white"):
    """A longitudinal wave as lines bunched at compressions and spread at
    rarefactions. Compressions at x0 + 80, + 240, + 400; rarefactions between."""
    out = []
    for u in range(0, length + 1, spacing):
        x = x0 + u + shift * math.sin(2 * math.pi * u / period)
        out.append(line(x, y0, x, y1, color, 3.0))
    return out


def axes(x0, y_mid, width, y_top, y_bottom):
    """A wave graph's axes: the horizontal axis through the middle."""
    return [arrow(x0, y_mid, x0 + width, y_mid, "grey", 2.8), arrow(x0, y_bottom, x0, y_top, "grey", 2.8)]


STEPS = [
    # ── 1. What a wave is; mechanical and electromagnetic ──────────────
    step("A wave is a disturbance that travels through a medium, or through empty space, and carries energy from one place to another. "
         "It does not carry the medium along with it.",
         heading("What is a wave?"),
         write("A wave carries energy from place to place,", 70, 175, 28),
         write("without carrying the medium along.", 70, 215, 28),
         chapter="What is a wave? Mechanical and electromagnetic waves"),

    step("Drop a stone into a pond. The ripples spread outwards, but a leaf floating on the water only bobs up and down. It stays where it is.",
         ellipse(990, 300, 50, 16, "blue", 3.0), ellipse(990, 300, 105, 34, "blue", 3.0), ellipse(990, 300, 160, 52, "blue", 3.0),
         ellipse(1100, 268, 20, 8, "green", 3.4),
         double_arrow(1100, 232, 1100, 300, "pink"),
         write("the leaf bobs up and down", 840, 400, 22, "grey")),

    step("There are two kinds of wave. Mechanical waves need a material medium: a solid, a liquid or a gas. "
         "Sound, water waves and waves on a rope are all mechanical.",
         write("Mechanical waves", 70, 470, 30, "blue"),
         write("need a medium:", 90, 514, 24),
         write("a solid, a liquid or a gas", 90, 548, 24),
         write("sound, water waves, a rope", 90, 592, 24, "grey")),

    step("Electromagnetic waves do not need a medium. They can travel through a vacuum, and in a vacuum they all travel at "
         "three times ten to the power eight metres per second. Light, radio waves and X-rays are electromagnetic.",
         write("Electromagnetic waves", 640, 470, 30, "pink"),
         write("can travel through a vacuum", 660, 514, 24),
         write("all at 3.0 × 10^8 m/s there", 660, 548, 24, "yellow"),
         write("light, radio waves, X-rays", 660, 592, 24, "grey")),

    # ── 2. Transverse and longitudinal ─────────────────────────────────
    step("Waves are also sorted by how the particles move. In a transverse wave, the particles vibrate at right angles to the direction the wave travels.",
         clear(2.2),
         heading("Transverse and longitudinal"),
         wave(80, 250, 480, 55, 2),
         double_arrow(320, 200, 320, 300, "pink"),
         arrow(80, 350, 300, 350, "yellow"), write("wave travels", 316, 358, 22, "yellow"),
         write("Transverse", 640, 215, 32, "blue"),
         write("particles vibrate at right angles", 640, 258, 24),
         write("to the direction of travel", 640, 292, 24),
         chapter="Transverse and longitudinal waves"),

    step("Light, water ripples and waves on a rope are transverse. A transverse wave has crests and troughs.",
         write("light, ripples, a rope", 640, 334, 24, "grey"),
         write("has crests and troughs", 640, 370, 24, "green")),

    step("In a longitudinal wave, the particles vibrate along the direction the wave travels. Sound is a longitudinal wave.",
         *longitudinal(),
         double_arrow(260, 572, 330, 572, "pink"),
         write("Longitudinal", 640, 470, 32, "blue"),
         write("particles vibrate along", 640, 513, 24),
         write("the direction of travel", 640, 547, 24),
         write("sound", 640, 589, 24, "grey")),

    step("A longitudinal wave has compressions, where the particles are crowded together, and rarefactions, where they are spread out.",
         *[write("C", x, 438, 24, "yellow", "center") for x in (160, 320, 480)],
         *[write("R", x, 438, 24, "green", "center") for x in (240, 400)],
         write("C: compression (crowded)    R: rarefaction (spread out)", 70, 630, 22, "grey")),

    # ── 3. Naming the parts ────────────────────────────────────────────
    step("Now let us name the parts of a wave. The dashed line is the rest position. "
         "The highest points are crests, and the lowest points are troughs.",
         clear(2.2),
         heading("Describing a wave"),
         dashed(80, REST, 720, REST),
         wave(X0, REST, 2 * LAMBDA, AMP, 2),
         write("rest", 732, REST + 9, 22, "grey"),
         write("crest", 562, 292, 26, "blue"), arrow(554, 283, 490, 306, "blue"),
         write("trough", 382, 568, 26, "blue"), arrow(388, 540, 336, 500, "blue"),
         chapter="Amplitude, wavelength, period and frequency"),

    step("The amplitude, A, is the largest displacement of a particle from its rest position.",  # capital: the letter's name, not "uh"
         double_arrow(175, REST - 4, 175, REST - AMP + 4, "pink"),
         write("a", 146, 382, 30, "pink"),
         write("a = amplitude (m)", 830, 280, 26, "pink")),

    step("The wavelength, lambda, is the distance from one crest to the next crest.",
         dashed(175, 300, 175, 250, "green", dash=10, gap=8),
         dashed(475, 300, 475, 250, "green", dash=10, gap=8),
         double_arrow(180, 258, 470, 258, "green"),
         write("λ", 316, 244, 32, "green"),
         write("λ = wavelength (m)", 830, 330, 26, "green")),

    step("The period, T, is the time for one complete oscillation. It is measured in seconds.",
         write("T = period (s)", 830, 380, 26, "blue")),

    step("The frequency, f, is the number of complete waves each second, measured in hertz. And frequency is one over the period.",
         write("f = frequency (Hz)", 830, 430, 26),
         equation(["f =", ("1", "T")], 840, 490, 30, "yellow")),

    step("In one period, the wave moves forward one wavelength. So its speed is the wavelength divided by the period, which is the frequency times the wavelength.",
         write("v = fλ", 905, 598, 56, "yellow"),
         box(870, 534, 300, 90),
         chapter="The wave equation v = fλ"),

    # ── 4. Worked examples ─────────────────────────────────────────────
    step("Let us use it. A radio station broadcasts on ninety-eight megahertz. Radio waves travel at three times ten to the power eight metres per second. "
         "Find the wavelength.",
         clear(2.2),
         heading("Example 1"),
         write("A radio station broadcasts on 98.0 MHz.", 70, 168, 26),
         write("The speed of radio waves is 3.0 × 10^8 m/s.", 70, 210, 26),
         write("Find the wavelength, λ.", 70, 252, 26),
         chapter="Worked examples: wavelength, frequency, period and speed"),

    step("First, change megahertz to hertz. Ninety-eight megahertz is ninety-eight times ten to the power six hertz.",
         write("f = 98.0 MHz = 98.0 × 10^6 Hz", 110, 330, 32, "blue")),

    step("Rearrange the wave equation. Lambda equals v divided by f.",
         write("v = fλ", 110, 420, 32),
         arrow(266, 408, 326, 408, "grey"),
         write("λ =", 346, 420, 32),
         frac("v", "f", 438, 420, 32)),

    step("Put in the numbers. Three times ten to the power eight, divided by ninety-eight times ten to the power six.",
         write("λ =", 110, 560, 32),
         frac("3.0 × 10^8", "98.0 × 10^6", 200, 560, 32)),

    step("So the wavelength is about three point zero six metres.",
         write("= 3.06 m", 482, 560, 40, "yellow"),
         ring(612, 544, 150, 46)),

    step("Example two. Water waves have a wavelength of zero point four metres. A floating bottle bobs up and down fifteen times in ten seconds. "
         "Find the frequency, the period and the speed of the waves.",
         clear(2.2),
         heading("Example 2"),
         write("Water waves have a wavelength of 0.4 m.", 70, 168, 26),
         write("A bottle bobs up and down 15 times in 10 s.", 70, 210, 26),
         write("Find f, T and v.", 70, 252, 26)),

    step("The frequency is the number of waves each second: fifteen divided by ten, which is one point five hertz.",
         equation(["f =", ("15", "10"), "= 1.5 Hz"], 110, 340, 32, "blue")),

    step("The period is one over the frequency: one divided by one point five, which is about zero point six seven seconds.",
         equation(["T =", ("1", "f"), "=", ("1", "1.5"), "= 0.67 s"], 110, 450, 32)),

    step("And the speed is the frequency times the wavelength: one point five times zero point four, which is zero point six metres per second.",
         write("v = fλ = 1.5 × 0.4 = 0.6 m/s", 110, 560, 32, "yellow")),

    step("A common mistake. When a wave enters a new medium, its speed and its wavelength change, but its frequency does not. "
         "The frequency is set by the source.",
         write("Into a new medium:", 760, 330, 28, "pink"),
         write("speed changes", 780, 374, 24),
         write("wavelength changes", 780, 410, 24),
         write("frequency stays the same", 780, 446, 24, "yellow"),
         write("(it is set by the source)", 780, 482, 22, "grey")),

    # ── 5. The two graphs ──────────────────────────────────────────────
    step("Last, two graphs that look alike. On a displacement against distance graph, the horizontal axis is distance, and one complete wave is the wavelength.",
         clear(2.2),
         heading("Two wave graphs"),
         *axes(100, 400, 470, 230, 540),
         write("displacement", 70, 214, 22, "grey"), write("distance", 508, 440, 22, "grey"),
         wave(100, 400, 400, 80, 2),
         double_arrow(152, 290, 348, 290, "green"), write("λ", 244, 276, 28, "green"),
         chapter="Displacement–distance and displacement–time graphs"),

    step("On a displacement against time graph, the horizontal axis is time. It follows one particle, and one complete wave is the period, T.",
         *axes(700, 400, 470, 230, 540),
         write("displacement", 670, 214, 22, "grey"), write("time", 1110, 440, 22, "grey"),
         wave(700, 400, 400, 80, 2),
         double_arrow(752, 290, 948, 290, "blue"), write("T", 844, 276, 28, "blue")),

    step("So read the horizontal axis first. Distance gives you the wavelength. Time gives you the period, and then f equals one over T.",
         write("Read the axis first:  distance gives λ;  time gives T, then f = 1/T.", 70, 610, 25, "yellow"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Waves", 54, 150, 92, "yellow"),
    write("Wavelength  ·  Frequency  ·  Amplitude", 60, 214, 30),
    dashed(60, 470, 690, 470, "grey", 3.4),
    wave(80, 470, 600, 100, 2, "white", 7.0),
    dashed(155, 368, 155, 318, "green", 4.0, dash=10, gap=8), dashed(455, 368, 455, 318, "green", 4.0, dash=10, gap=8),
    double_arrow(160, 326, 450, 326, "green", 6.0), write("λ", 290, 306, 44, "green"),
    double_arrow(155, 466, 155, 376, "pink", 6.0), write("a", 112, 438, 40, "pink"),
    write("v = fλ", 806, 500, 92, "yellow"),
    box(770, 384, 460, 150, "yellow", 6.0),
    write("f = 1/T", 1000, 616, 52, "blue", "center"),
]
