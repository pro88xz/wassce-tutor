"""Physics · Waves: the wave equation. A chalkboard video lesson.

Follows content/notes/physics-waves-1.md: the parts of a transverse wave,
v = fλ, and the lesson's worked example (a 98.0 MHz radio station).
Build: python3 scripts/video/board_video.py content/videos/physics-waves-1.py
"""

from board_video import arrow, box, clear, dashed, double_arrow, frac, ring, step, underline, wave, write

LABEL = "WASSCE Tutor  ·  Physics  ·  Waves"

# The wave: rest line y = 400, two wavelengths of 300 px from x = 100.
# Crests at x = 175 and 475 (y = 310); troughs at 325 and 625 (y = 490).
REST, AMP, X0, LAMBDA = 400, 90, 100, 300

STEPS = [
    step("Today, we learn the wave equation.",
         write("The Wave Equation", 70, 95, 44, "yellow"),
         underline(64, 632, 114)),

    step("A wave carries energy from one place to another, without carrying the material along with it.",
         write("A wave transfers energy, not matter.", 70, 172, 28)),

    step("Here is a transverse wave. The dashed line is the rest position.",
         dashed(80, REST, 720, REST),
         wave(X0, REST, 2 * LAMBDA, AMP, 2),
         write("rest", 732, REST + 9, 22, "grey")),

    step("The highest points are called crests, and the lowest points are called troughs.",
         write("crest", 562, 292, 26, "blue"),
         arrow(554, 283, 490, 306, "blue"),
         write("trough", 382, 568, 26, "blue"),
         arrow(388, 540, 336, 500, "blue")),

    step("The amplitude, A, is the maximum displacement from the rest position.",  # capital: the letter's name, not "uh"
         double_arrow(175, REST - 4, 175, REST - AMP + 4, "pink"),
         write("a", 146, 382, 30, "pink"),
         write("a = amplitude", 830, 300, 26, "pink")),

    step("The wavelength, lambda, is the distance from one crest to the next crest.",
         dashed(175, 300, 175, 250, "green", dash=10, gap=8),
         dashed(475, 300, 475, 250, "green", dash=10, gap=8),
         double_arrow(180, 258, 470, 258, "green"),
         write("λ", 316, 244, 32, "green"),
         write("λ = wavelength (m)", 830, 358, 26, "green")),

    step("The frequency, f, is the number of complete waves produced every second. It is measured in hertz.",
         write("f = frequency (Hz)", 830, 416, 26)),

    step("In one period, the wave moves forward one wavelength. So the speed of a wave is the frequency times the wavelength.",
         write("v = fλ", 890, 565, 64, "yellow"),
         box(860, 476, 330, 116)),

    step("Now let us try an exam question.",
         clear(2.4)),

    step("A radio station broadcasts on ninety-eight megahertz. Radio waves travel at three times ten to the power eight metres per second. "
         "Find the wavelength.",
         write("Example", 70, 95, 44, "yellow"),
         underline(64, 316, 114),
         write("A radio station broadcasts on 98.0 MHz.", 70, 168, 26),
         write("The speed of radio waves is 3.0 × 10^8 m/s.", 70, 210, 26),
         write("Find the wavelength, λ.", 70, 252, 26)),

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

    step("Remember: the frequency is set by the source, so it stays the same when a wave enters a new medium.",
         write("f is set by the source:", 850, 330, 24, "pink"),
         write("it does not change", 850, 368, 24, "pink"),
         write("in a new medium.", 850, 406, 24, "pink"),
         pause=1.4),
]
