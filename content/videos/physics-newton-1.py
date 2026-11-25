"""Physics · Newton's laws of motion: the three laws, inertia and momentum. A chalkboard video lesson.

Follows content/notes/physics-newton-1.md: opens on a story already moving (a
keke, a goat, a passenger thrown forward: "you kept going, the keke stopped");
the first law and inertia, with everyday examples and the tablecloth trick;
momentum (a lorry and an okada); the second law, from rate of change of momentum
to F = ma, and a car; "over to you" with a trolley and friction (the resultant
force); weight, and the Moon; the third law, its pairs, the mango that pulls the
Earth, and the book-on-a-table trap.

"{a}" in a line is the letter A said as a letter (see board_video.shown).
Check: python3 scripts/video/board_video.py content/videos/physics-newton-1.py --boards .video-build/boards/newton1
"""

from board_video import arrow, box, clear, ellipse, equation, heading, line, step, text_width, write

TITLE = "Newton's Three Laws of Motion, Inertia, Momentum and F = ma | WASSCE Physics"
DESCRIPTION = ("Newton's laws on the chalkboard: why you fly forward when a keke brakes, inertia, momentum, the second "
               "law and F = ma, the resultant force (with a problem to try), weight, and action and reaction, including "
               "the book-on-a-table trap.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Newton's laws"
# The lesson page this video is on: /wassce/physics/newton-s-laws-of-motion/newtons-three-laws-of-motion-inertia-and-momentum
LESSON = "physics/newton-s-laws-of-motion/newtons-three-laws-of-motion-inertia-and-momentum"


def keke(x, ground):
    """A keke (tricycle taxi) side on: body, canopy and wheels."""
    return [box(x, ground - 62, 170, 44, "yellow", 3.0),
            line(x + 12, ground - 62, x + 30, ground - 118, "yellow", 3.0), line(x + 30, ground - 118, x + 150, ground - 118, "yellow", 3.0),
            line(x + 150, ground - 118, x + 168, ground - 62, "yellow", 3.0),
            ellipse(x + 30, ground - 13, 13, 13, "white", 3.0), ellipse(x + 145, ground - 13, 13, 13, "white", 3.0)]


def stop_sign(cx, cy, color="pink"):
    """The pause button."""
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


STEPS = [
    # ── 1. Why did you move? ──────────────────────────────────────────
    step("The keke is flying down the road, and you are in the back, relaxed, scrolling on your phone. Then a goat steps out. "
         "The driver slams on the brakes, and you fly forward, into the back of his seat.",
         heading("Why did you move?"),
         line(760, 290, 1240, 290, "grey", 2.4),
         *keke(820, 290),
         arrow(850, 152, 1010, 152, "pink"), write("you keep going", 930, 140, 20, "pink", "center"),
         write("a goat!", 1150, 262, 22, "pink", "center"),
         pause=0.8, chapter="Why you fly forward when the keke brakes"),

    step("Now, nobody pushed you. So why did you move? Here is the surprise. You did not start moving. "
         "You were already moving. You simply kept going, and the keke stopped.",
         write("Nobody pushed you.", 70, 200, 28),
         write("You kept going;  the keke stopped.", 70, 245, 28, "green"),
         pause=0.9),

    step("That is Newton's first law. A body stays at rest, or keeps moving in a straight line at a steady speed, "
         "unless a resultant force acts on it.",
         write("First law:  a body stays at rest, or in uniform motion", 70, 330, 25, "yellow"),
         write("in a straight line, unless a resultant force acts on it.", 70, 368, 25, "yellow")),

    step("That stubbornness has a name: inertia. And the more mass a body has, the more inertia it has. Mass is a measure of inertia.",
         write("inertia:  a body's stubbornness.   Mass measures it.", 70, 430, 25, "blue")),

    step("You see it everywhere. A keke starts suddenly, and you jerk backwards. Shake a wet cloth, and the water keeps going. "
         "And a seat belt stops you gently, so that the windscreen does not stop you suddenly.",
         write("starts suddenly:  you jerk back", 100, 488, 23),
         write("wet cloth:  the water keeps going", 100, 524, 23),
         write("seat belt:  a gentle stop, not the windscreen", 100, 560, 23)),

    step("And yes, you can pull a tablecloth out from under the plates. But please, not with your mother's best plates. "
         "Physics will be on your side. Your mother will not.",
         write("(the tablecloth trick:  not with the best plates)", 100, 610, 21, "grey"),
         pause=1.1),

    # ── 2. Momentum ───────────────────────────────────────────────────
    step("Which is harder to stop: a loaded lorry, or an okada, both at ten metres per second? The lorry, obviously. "
         "The idea behind that is momentum: mass times velocity.",
         clear(2.2),
         heading("Momentum"),
         write("p = mv", 70, 210, 40, "yellow"),
         write("a vector;  unit kg m s^{-1}", 345, 205, 26, "grey"),
         chapter="Momentum"),

    step("The lorry, twenty thousand kilograms, has two hundred thousand. The okada, one hundred and fifty kilograms, has fifteen hundred.",
         write("lorry:  20 000 × 10 = 200 000 kg m s^{-1}", 70, 300, 26),
         write("okada:  150 × 10 = 1500 kg m s^{-1}", 70, 345, 26)),

    step("Would you rather stop either of them with your bare hands? No. But especially not the lorry.",
         write("Stop either with your hands?  No thank you.", 70, 420, 25, "pink"),
         pause=0.9),

    # ── 3. The second law ─────────────────────────────────────────────
    step("Newton's second law. The rate of change of momentum is proportional to the resultant force, "
         "and it happens in the direction of the force. Statements must be word perfect in the exam, so learn this one exactly.",
         clear(2.2),
         heading("The second law"),
         write("The rate of change of momentum is proportional to", 70, 190, 25, "yellow"),
         write("the resultant force, in the direction of the force.", 70, 228, 25, "yellow"),
         chapter="The second law: F = ma"),

    step("Watch what it becomes. Change of momentum over time is m v minus m u, over t. "
         "That is m times v minus u, over t, which is m {a}.",
         equation(["F ∝", ("mv - mu", "t"), "= m", ("v - u", "t"), "= ma"], 70, 320, 28)),

    step("The newton is chosen to make the constant exactly one. So F equals m {a}. "
         "One newton gives one kilogram an acceleration of one metre per second squared.",
         write("F = ma", 90, 420, 40, "green"), box(70, 374, text_width("F = ma", 40) + 40, 64, "green", 2.8),
         write("1 N:  gives 1 kg an acceleration of 1 m s^{-2}", text_width("F = ma", 40) + 140, 415, 24, "grey")),

    step("A twelve hundred kilogram car speeds up from ten to twenty-five metres per second in six seconds. "
         "The acceleration is two point five, so the force is twelve hundred times two point five: three thousand newtons.",
         write("car:  a = (25 - 10) ÷ 6 = 2.5 m s^{-2};   F = 1200 × 2.5 = 3000 N", 70, 510, 22)),

    # ── 4. Over to you ────────────────────────────────────────────────
    step("Over to you. A four kilogram trolley is pulled with a force of twenty newtons, but friction holds it back with eight. "
         "What is its acceleration?",
         clear(2.2),
         heading("Over to you"),
         *stop_sign(1180, 82),
         line(780, 262, 1240, 262, "grey", 2.4),
         box(930, 192, 120, 56, "white", 3.0), ellipse(955, 254, 8, 8, "white", 2.6), ellipse(1025, 254, 8, 8, "white", 2.6),
         arrow(1050, 220, 1180, 220, "green"), write("20 N", 1120, 206, 22, "green", "center"),
         arrow(930, 220, 840, 220, "pink"), write("8 N", 880, 206, 22, "pink", "center"),
         write("4 kg", 990, 228, 22, "white", "center"),
         write("A 4 kg trolley:  pulled with 20 N,", 70, 190, 26),
         write("friction 8 N.  Its acceleration?", 70, 230, 26, "blue"),
         chapter="Over to you: the resultant force"),

    step("Stop the video here, work it out, and come back with a number.",
         write("stop here and try it", 1130, 92, 22, "pink", "right"),
         pause=3.2),

    step("If you said five, friction got you. The F in F equals m {a} is the resultant force: twenty minus eight, twelve newtons. "
         "Twelve over four: three metres per second squared.",
         write("5?  Friction got you!", 70, 300, 25, "pink"),
         write("resultant = 20 - 8 = 12 N;    a = 12 ÷ 4 = 3 m s^{-2}", 70, 345, 25, "green")),

    step("One special case is weight. Put g in place of {a}, and weight is m g. A sixty kilogram student weighs six hundred newtons.",
         write("W = mg:   60 kg × 10 = 600 N", 70, 450, 27, "yellow")),

    step("On the Moon, g is only one point six, so the same student weighs about ninety-six newtons. "
         "Want to lose weight? Go to the Moon. Your mass comes with you, though.",
         write("on the Moon:  60 × 1.6 = 96 N.   Same mass!", 70, 500, 25),
         pause=1.0),

    # ── 5. The third law ──────────────────────────────────────────────
    step("The third law. To every action, there is an equal and opposite reaction. If {A} pushes B, then B pushes {A} back, "
         "just as hard, the other way.",
         clear(2.2),
         heading("The third law"),
         write("To every action there is an equal and opposite reaction.", 70, 190, 25, "yellow"),
         chapter="The third law: action and reaction"),

    step("The two forces act on different bodies. You push the ground backwards, and the ground pushes you forwards: that is walking. "
         "A gun pushes the bullet forwards, and the bullet pushes the gun back: that is recoil.",
         write("equal,  opposite,  on DIFFERENT bodies", 70, 240, 25, "blue"),
         write("foot pushes ground back  ->  ground pushes you forward", 100, 300, 23),
         write("gun pushes bullet forward  ->  bullet pushes gun back", 100, 340, 23)),

    step("Even a falling mango pulls the whole Earth upwards, with exactly the same force the Earth pulls it down. The Earth just does not notice.",
         write("Earth pulls mango down  ->  mango pulls Earth up!", 100, 380, 23, "pink"),
         pause=1.0),

    step("Here is one that catches almost everyone. A book rests on a table. Its weight pulls it down; the table pushes it up. "
         "Equal and opposite. So, are they an action and reaction pair?",
         write("A book on a table:  weight down, table pushes up.", 70, 460, 24),
         write("Action and reaction?", 70, 500, 24, "pink"),
         pause=2.3),

    step("No. Both forces act on the book, and action and reaction always act on different bodies. "
         "The true partner of the book's weight is the book pulling the Earth up.",
         write("No:  both act on the book.  The partner: book pulls Earth up.", 70, 550, 23, "green")),

    step("So: three laws, and three statements to learn word for word. They are the cheapest marks in the paper. "
         "And in the next lesson, we smash things together. Collisions, impulse, and why a lift makes you feel heavier.",
         write("Learn the three statements word for word.", 70, 620, 24, "yellow"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Newton's Laws", 54, 140, 84, "yellow"),
    write("Inertia  ·  F = ma  ·  Action and reaction", 60, 210, 30),
    line(620, 520, 1240, 520, "grey", 3.0),
    *keke(720, 520),
    arrow(760, 360, 980, 360, "pink"), write("you keep going!", 870, 340, 28, "pink", "center"),
    write("F = ma", 90, 440, 80, "green"), box(64, 352, text_width("F = ma", 80) + 56, 116, "green", 3.4),
]
