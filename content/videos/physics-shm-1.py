"""Physics · Simple harmonic motion: the pendulum and the spring. A chalkboard video lesson.

Follows content/notes/physics-shm-1.md, reasoning from things students can try:
opens with a key on a string (a home-made pendulum) and a surprising test: does a
heavier key swing more slowly? (no); oscillations, and what makes motion "simple
harmonic": a restoring pull that grows with distance, a = −ω²x, and why that
makes a body overshoot and come back; amplitude, period, frequency, with the
half-swing trap; the displacement-time graph drawn as a sine curve; the pendulum
formula and why mass does not appear; "your turn" with the seconds pendulum;
the mass on a spring; and where speed and acceleration are greatest, with a
child on a swing.

Check: python3 scripts/video/board_video.py content/videos/physics-shm-1.py --boards .video-build/boards/shm1
"""

import math

from board_video import arrow, box, clear, dashed, dots, double_arrow, ellipse, equation, heading, line, step, wave, write, zigzag

TITLE = "Simple Harmonic Motion: the Simple Pendulum and the Mass on a Spring, Explained | WASSCE Physics"
DESCRIPTION = ("Simple harmonic motion on the chalkboard: a key on a string, why a pendulum swings back, a = −ω²x, amplitude, "
               "period and frequency, the pendulum and spring formulas (and why the mass of the bob does not matter), and "
               "where speed and acceleration are greatest.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Simple harmonic motion"
# The lesson page this video is on: /wassce/physics/simple-harmonic-motion/simple-harmonic-motion-the-pendulum-and-the-spring
LESSON = "physics/simple-harmonic-motion/simple-harmonic-motion-the-pendulum-and-the-spring"


def stop_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


# The pendulum (board 1): pivot, length, and three positions.
PX, PY, PL = 990, 170, 300


def bob_at(deg):
    t = math.radians(deg)
    return (PX + PL * math.sin(t), PY + PL * math.cos(t))


STEPS = [
    # ── 1. A key on a string ──────────────────────────────────────────
    step("Find a piece of string and tie a key to the end. Hold the top still, pull the key a little to one side, and let go. "
         "Back and forth it goes, back and forth, through the middle, again and again. You have made a pendulum.",
         heading("A key on a string"),
         line(PX - 80, PY, PX + 80, PY, "white", 3.2),
         dashed(PX, PY, PX, PY + PL + 20, "grey"),
         line(PX, PY, *bob_at(-18), "grey", 2.0), ellipse(*bob_at(-18), 14, 14, "grey", 2.4),
         line(PX, PY, *bob_at(18), "grey", 2.0), ellipse(*bob_at(18), 14, 14, "grey", 2.4),
         line(PX, PY, *bob_at(0), "white", 2.6), ellipse(*bob_at(0), 16, 16, "yellow", 3.0),
         pause=0.6, chapter="What is an oscillation?"),

    step("Now a test. Time ten swings. Then tie on a second key, so it is twice as heavy, and time ten swings again. "
         "Will the heavier pendulum swing more slowly? Decide before you try it.",
         write("Twice as heavy:  swings more slowly?", 70, 200, 27, "pink"),
         pause=2.4),

    step("It does not. The time is exactly the same. By the end of this lesson, you will know why. "
         "But first, a name for what the key is doing. It is oscillating: moving to and fro about a fixed middle point, the equilibrium position.",
         write("No.  Same time.  (Why?  Wait and see.)", 70, 250, 25, "green"),
         write("oscillation:  to and fro about an equilibrium position", 70, 320, 23, "yellow"),
         write("swings, springs, guitar strings, a bottle bobbing on water", 70, 360, 22, "grey")),

    # ── 2. What makes it simple harmonic ──────────────────────────────
    step("Why does the key come back? When it is pulled to one side, gravity tugs it back towards the middle. "
         "And the further you pull it, the harder that tug. That tug is called the restoring force.",
         clear(2.2),
         heading("Why does it come back?"),
         line(PX - 80, PY, PX + 80, PY, "white", 3.2), dashed(PX, PY, PX, PY + PL + 20, "grey"),
         line(PX, PY, *bob_at(20), "white", 2.6), ellipse(*bob_at(20), 16, 16, "yellow", 3.0),
         arrow(bob_at(20)[0] - 6, bob_at(20)[1] + 4, bob_at(20)[0] - 80, bob_at(20)[1] + 14, "pink"),
         write("pulled back", bob_at(20)[0] - 90, bob_at(20)[1] + 50, 20, "pink", "center"),
         write("further out  ->  stronger pull back", 70, 200, 25),
         chapter="What makes motion simple harmonic?"),

    step("So it races back to the middle. But at the middle, it is moving fastest of all, and it cannot stop. It overshoots, "
         "and the restoring force now pulls it back from the other side. Overshoot, pull back, overshoot, pull back. Forever, if there were no air.",
         write("at the middle:  fastest,  so it overshoots", 70, 250, 25, "blue"),
         write("then pulled back from the other side", 70, 290, 25, "blue")),

    step("When the pull back is exactly proportional to how far out the body is, the motion is called simple harmonic motion. "
         "The acceleration is proportional to the displacement, and always directed towards the equilibrium position.",
         write("Simple harmonic motion:", 70, 370, 26, "yellow"),
         write("acceleration ∝ displacement,  directed towards the middle", 70, 410, 23, "yellow"),
         write("a = -ω^2 x", 70, 470, 36, "green"),
         write("(the minus:  always back towards the middle)", 70, 508, 21, "grey")),

    step("In the exam, give both halves of that definition. Proportional to displacement, and directed towards the fixed point. "
         "Leave out the second half, and you leave out a mark.",
         write("Exam:  BOTH halves of the definition.", 70, 570, 24, "pink")),

    # ── 3. The words ──────────────────────────────────────────────────
    step("A few words to learn. The amplitude is the biggest displacement from the middle. The period, T, is the time for one complete oscillation. "
         "The frequency, f, is how many oscillations happen every second. So f is one over T.",
         clear(2.2),
         heading("Amplitude, period and frequency"),
         write("amplitude A:  the biggest displacement", 70, 190, 24),
         write("period T:  time for one complete oscillation", 70, 230, 24),
         write("frequency f:  oscillations per second;   f = 1/T", 70, 270, 24),
         chapter="Amplitude, period and frequency"),

    step("Here is the trap. One complete oscillation is from one end, through the middle, to the other end, and all the way back again. "
         "Timing from one end to the other gives only half a period.",
         write("One oscillation:  end, to the other end, AND back.", 70, 340, 24, "pink"),
         write("(end to end is only half a period)", 70, 378, 22, "pink")),

    step("Plot the displacement against time, and you get this: a smooth wave, rising to plus A, falling through zero to minus A, and back. A sine curve. "
         "The period is the time for one complete wave.",
         arrow(110, 540, 680, 540, "white", 2.6), arrow(110, 640, 110, 440, "white", 2.6),
         write("t", 690, 548, 20, "grey"), write("x", 122, 452, 20, "grey"),
         wave(110, 540, 560, 80, 2, "yellow", 3.2),
         dashed(110, 460, 680, 460, "grey"), write("+A", 96, 468, 20, "grey", "right"), write("-A", 96, 628, 20, "grey", "right"),
         double_arrow(110, 650, 390, 650, "green", 2.2), write("T", 250, 676, 20, "green", "center")),

    # ── 4. The pendulum ───────────────────────────────────────────────
    step("For a simple pendulum, a small heavy bob on a light string of length l, swinging through a small angle, the period is two pi root l over g.",
         clear(2.2),
         heading("The simple pendulum"),
         equation(["T = 2π", {"root": ("l", "g")}], 70, 230, 36, "yellow"),
         write("small angle:  under about 10°", 70, 320, 22, "grey"),
         chapter="The simple pendulum"),

    step("Now look at what is missing. There is no mass in that formula. That is the answer to the key test. Why? A heavier bob is pulled back harder, "
         "but it is also harder to get moving, exactly in proportion. The two cancel, just as they did for falling bodies.",
         write("No mass in the formula!", 70, 390, 27, "green"),
         write("heavier:  pulled harder,  but harder to move.  They cancel.", 70, 432, 22, "green")),

    step("And the period does not depend on the amplitude either, for small swings. A short swing travels less far, but more slowly. "
         "Which is why a pendulum can keep time in a clock.",
         write("not the amplitude either:  a pendulum keeps time", 70, 490, 22, "blue")),

    step("A pendulum zero point nine metres long, with g as ten: two pi times the square root of zero point zero nine. Two pi times zero point three: "
         "one point eight eight seconds.",
         equation(["l = 0.9 m:   T = 2π", {"root": ("0.9", "10")}, "= 2π × 0.3 = 1.88 s"], 70, 580, 25)),

    # ── 5. Your turn ──────────────────────────────────────────────────
    step("Your turn. A seconds pendulum has a period of exactly two seconds: one second each way. How long must it be? Take g as ten.",
         clear(2.2),
         heading("Your turn"),
         *stop_sign(1180, 82),
         write("A \"seconds pendulum\":  T = 2 s exactly.", 70, 190, 26),
         write("How long is it?  (g = 10)", 70, 230, 26, "blue"),
         chapter="Your turn: the seconds pendulum"),

    step("Rearrange the formula first. Then pause, and try it.",
         write("rearrange first", 1130, 92, 22, "pink", "right"),
         pause=3.4),

    step("Square both sides: T squared is four pi squared l over g. So l is g T squared, over four pi squared. "
         "Ten times four, over four pi squared: about one point zero one metres. Just over a metre.",
         equation(["l =", ("gT^2", "4π^2"), "=", ("10 × 4", "4π^2"), "= 1.01 m"], 70, 330, 28, "green")),

    step("And a question to test whether you really understand the formula. Make a pendulum four times longer. What happens to its period?",
         write("Four times longer:  the period ... ?", 70, 440, 25, "pink"),
         pause=2.3),

    step("It doubles, not quadruples. The period goes with the square root of the length, and the square root of four is two.",
         equation(["doubles:   T ∝", {"root": "l"}, ",   and", {"root": "4"}, "= 2"], 70, 490, 25, "green")),

    # ── 6. The spring ─────────────────────────────────────────────────
    step("The second classic oscillator: a mass hanging on a spring. Pull it down and let go, and it bounces up and down in simple harmonic motion. "
         "Its period is two pi root m over k, where k is the spring constant: how stiff the spring is.",
         clear(2.2),
         heading("A mass on a spring"),
         line(940, 160, 1080, 160, "white", 3.2),
         zigzag(1010, 160, 1010, 360, n=10, amp=18, color="white", width=2.6),
         box(980, 360, 60, 50, "yellow", 3.0), write("m", 1010, 393, 22, "yellow", "center"),
         double_arrow(1110, 340, 1110, 430, "green", 2.2), write("bounces", 1124, 392, 20, "green"),
         equation(["T = 2π", {"root": ("m", "k")}], 70, 230, 36, "yellow"),
         chapter="A mass on a spring"),

    step("This time the mass does matter. A heavier load, or a softer spring, gives a slower bounce. Think of a lorry on its springs: "
         "fully loaded, it rocks slowly; empty, it bounces quickly.",
         write("heavier, or softer spring:  slower bounce", 70, 320, 24, "blue")),

    step("A zero point five kilogram mass on a spring of fifty newtons per metre: two pi root zero point zero one. Two pi times zero point one: "
         "zero point six three seconds, so about one point six oscillations every second.",
         equation(["T = 2π", {"root": ("0.5", "50")}, "= 0.628 s,   f = 1.59 Hz"], 70, 410, 25, "green")),

    # ── 7. Fastest and slowest ────────────────────────────────────────
    step("Picture a child on a swing. At each end, for an instant, she is completely still: speed zero. But that is where the pull back is strongest, "
         "so her acceleration is greatest there.",
         clear(2.2),
         heading("Where is it fastest?"),
         write("at the ends:  speed 0,   acceleration greatest", 70, 200, 25, "pink"),
         line(PX - 80, PY + 40, PX + 80, PY + 40, "white", 3.2),
         *[w for d in (-30, 30) for w in (
             line(PX, PY + 40, PX + 300 * math.sin(math.radians(d)), PY + 40 + 300 * math.cos(math.radians(d)), "grey", 2.0),
             box(PX + 300 * math.sin(math.radians(d)) - 28, PY + 40 + 300 * math.cos(math.radians(d)), 56, 10, "pink", 2.6))],
         write("v = 0", PX - 150, PY + 360, 22, "pink", "center"), write("v = 0", PX + 150, PY + 360, 22, "pink", "center"),
         chapter="Where speed and acceleration are greatest"),

    step("At the lowest point, in the middle, she flies through at top speed. But the displacement there is zero, so the acceleration is zero. "
         "Fastest, with no acceleration. Stopped, with the biggest acceleration. That pairing appears in the exam again and again.",
         write("in the middle:  speed greatest,   acceleration 0", 70, 250, 25, "green"),
         line(PX, PY + 40, PX, PY + 340, "white", 2.4), box(PX - 28, PY + 340, 56, 10, "green", 2.6),
         arrow(PX + 40, PY + 375, PX + 130, PY + 375, "green"), write("fastest", PX, PY + 410, 22, "green", "center")),

    step("And push her at just the right moment, once each swing, and the swings grow bigger and bigger. That is resonance, and it is coming up in the next lesson, "
         "along with energy, damping, and why soldiers break step on a bridge.",
         write("Next:  energy, damping and resonance", 70, 340, 25, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Simple Harmonic Motion", 54, 140, 70, "yellow"),
    write("Pendulum  ·  Spring  ·  a = -ω^2 x", 60, 210, 30),
    line(830, 320, 1050, 320, "white", 3.4), dashed(940, 320, 940, 620, "grey"),
    line(940, 320, 940 + 260 * math.sin(math.radians(22)), 320 + 260 * math.cos(math.radians(22)), "white", 3.0),
    ellipse(940 + 260 * math.sin(math.radians(22)), 320 + 260 * math.cos(math.radians(22)), 22, 22, "yellow", 3.4),
    equation(["T = 2π", {"root": ("l", "g")}], 70, 470, 52, "green"),
]
