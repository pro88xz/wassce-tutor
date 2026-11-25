"""Physics · Newton's laws of motion: impulse, conservation of momentum, collisions and lifts. A chalkboard video lesson.

Follows content/notes/physics-newton-2.md: opens with something to try (catch an
orange with a stiff hand, then a soft one); impulse and why a longer time means a
smaller force (a goalkeeper, crumple zones, egg trays); conservation of momentum,
with "hands up if you think..." before a trolley collision, and the kinetic
energy lost; recoil as "your move"; the lift, the normal reaction and the scale,
with "think fast"; and two blocks on a string.

"{a}" in a line is the letter A said as a letter (see board_video.shown).
Check: python3 scripts/video/board_video.py content/videos/physics-newton-2.py --boards .video-build/boards/newton2
"""

from board_video import arrow, box, clear, ellipse, equation, heading, line, step, write

TITLE = "Impulse, Conservation of Momentum, Collisions, Recoil and Lift Problems | WASSCE Physics"
DESCRIPTION = ("Newton's laws at work on the chalkboard: why a soft catch hurts less, impulse, conservation of momentum, "
               "a trolley collision and the energy lost, gun recoil to try yourself, what a scale reads in a lift, and two "
               "blocks on a string.")
LABEL = "WASSCE Tutor  ·  Physics  ·  Newton's laws"
# The lesson page this video is on: /wassce/physics/newton-s-laws-of-motion/impulse-conservation-of-momentum-collisions-and-lifts
LESSON = "physics/newton-s-laws-of-motion/impulse-conservation-of-momentum-collisions-and-lifts"


def trolley(x, ground, w, label, color="white"):
    return [box(x, ground - 50, w, 38, color, 3.0), ellipse(x + 18, ground - 6, 7, 7, color, 2.4),
            ellipse(x + w - 18, ground - 6, 7, 7, color, 2.4), write(label, x + w / 2, ground - 22, 20, color, "center")]


def stop_sign(cx, cy, color="pink"):
    return [ellipse(cx, cy, 32, 32, color, 3.0), line(cx - 10, cy - 14, cx - 10, cy + 14, color, 3.6),
            line(cx + 10, cy - 14, cx + 10, cy + 14, color, 3.6)]


STEPS = [
    # ── 1. Impulse ────────────────────────────────────────────────────
    step("Before anything else, try this. Hold out your hand, and have a friend drop an orange into it. "
         "First, keep your hand stiff. Then, let your hand move down with the orange as you catch it. Which one stings less?",
         heading("The soft catch"),
         write("stiff hand:  ouch", 100, 200, 28, "pink"),
         write("hand gives with it:  easy", 100, 250, 28, "green"),
         pause=1.6, chapter="Impulse: why a soft catch hurts less"),

    step("The soft catch, every time. Here is why. Impulse is force times time, and it equals the change in momentum. "
         "The orange has to lose the same momentum either way.",
         equation(["impulse = Ft = mv - mu"], 70, 340, 30, "yellow"),
         write("unit:  N s", 660, 338, 24, "grey")),

    step("So make the time longer, and the force gets smaller. That is the whole secret.",
         write("longer time  ->  smaller force", 70, 410, 30, "green")),

    step("A goalkeeper stops a zero point four kilogram ball moving at fifteen metres per second. That is six newton seconds of momentum. "
         "Stopped in zero point zero five seconds, that is a hundred and twenty newtons on his hands. "
         "Let his hands move back, so the catch takes zero point two seconds, and it is only thirty.",
         write("6 N s:   ÷ 0.05 s = 120 N;     ÷ 0.2 s = 30 N", 70, 485, 25)),

    step("The same idea gives cars their crumple zones and airbags, makes you bend your knees when you land, "
         "and puts eggs in soft trays, not in tins. An egg understands impulse better than most of us.",
         write("crumple zones,  airbags,  bent knees,  egg trays", 70, 555, 24, "blue"),
         pause=1.0),

    # ── 2. Conservation of momentum ───────────────────────────────────
    step("Now, collisions. When bodies collide or explode, their total momentum stays the same, provided no external force acts. "
         "That last part belongs in the statement. Leave it out, and you lose a mark.",
         clear(2.2),
         heading("Momentum is conserved"),
         write("Total momentum is constant,", 70, 190, 26, "yellow"),
         write("provided no external force acts.", 70, 230, 26, "pink"),
         equation(["m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2"], 70, 300, 28),
         chapter="Conservation of momentum"),

    step("A two kilogram trolley at three metres per second hits a one kilogram trolley at rest, and they stick together. "
         "Hands up if you think they move off faster than three. You, at the back: hand down.",
         line(660, 250, 1240, 250, "grey", 2.4),
         *trolley(700, 250, 110, "2 kg"), arrow(820, 220, 890, 220, "yellow"), write("3 m s^{-1}", 855, 190, 18, "yellow", "center"),
         *trolley(940, 250, 80, "1 kg"), write("before", 1170, 230, 20, "grey", "center"),
         pause=1.0),

    step("Momentum before: two times three, plus nothing. Six. Afterwards, three kilograms move together, so three v equals six, "
         "and v is two metres per second. Slower, as it should be.",
         write("2 × 3 + 1 × 0 = (2 + 1) v,    v = 2 m s^{-1}", 70, 390, 26, "green"),
         line(660, 345, 1240, 345, "grey", 2.4),
         *trolley(760, 345, 110, "2 kg", "green"), *trolley(870, 345, 80, "1 kg", "green"),
         arrow(960, 315, 1030, 315, "green"), write("2 m s^{-1}", 995, 285, 18, "green", "center"), write("after", 1170, 325, 20, "grey", "center")),

    step("But the kinetic energy drops from nine joules to six. Three joules went into heat, sound, and a dent. "
         "Momentum is always conserved. Kinetic energy is conserved only in an elastic collision.",
         write("KE:  9 J  ->  6 J   (3 J to heat, sound, a dent)", 70, 460, 23),
         write("elastic:  KE kept.    inelastic:  KE lost.", 70, 500, 23, "blue"),
         write("stuck together:  perfectly inelastic", 70, 538, 23, "blue")),

    # ── 3. Recoil ─────────────────────────────────────────────────────
    step("Explosions work the same way. Before a gun fires, nothing moves, so the total momentum is zero. "
         "Afterwards, the bullet's momentum and the gun's momentum must cancel.",
         clear(2.2),
         heading("Recoil"),
         *stop_sign(1180, 82),
         write("before:  total momentum = 0", 70, 190, 26),
         write("after:  bullet and gun cancel", 70, 230, 26, "yellow"),
         chapter="Explosions and recoil"),

    step("Your move. A four kilogram gun fires a twenty gram bullet at four hundred metres per second. How fast does the gun recoil?",
         write("4 kg gun;  20 g bullet at 400 m s^{-1}.  Recoil?", 70, 300, 25, "blue")),

    step("Take your time. I am not going anywhere.",
         write("take your time", 1130, 92, 22, "pink", "right"),
         pause=3.2),

    step("Zero equals zero point zero two times four hundred, plus four v. Eight plus four v is zero, so v is minus two. "
         "Two metres per second, backwards. The minus sign just means: the other way.",
         write("0 = 0.02 × 400 + 4v,    v = -2 m s^{-1}  (backwards)", 70, 370, 25, "green")),

    step("Hold the gun firmly against your shoulder, and your body's mass joins the gun's, so it recoils more slowly. "
         "Hold it loosely, and your shoulder will remind you.",
         write("held firmly:  more mass, slower recoil", 70, 440, 25),
         pause=1.0),

    # ── 4. The lift ───────────────────────────────────────────────────
    step("Ever felt heavier as a lift starts going up? You really do press harder on the floor. "
         "A scale in a lift reads the floor's push on you: the normal reaction, R.",
         clear(2.2),
         heading("The lift"),
         box(940, 170, 200, 360, "white", 3.0),
         ellipse(1040, 330, 12, 12, "white", 2.8), line(1040, 342, 1040, 420, "white", 2.8),
         line(1040, 420, 1024, 470, "white", 2.8), line(1040, 420, 1056, 470, "white", 2.8), line(1018, 370, 1062, 370, "white", 2.8),
         box(1005, 470, 70, 14, "grey", 2.4),
         arrow(1100, 470, 1100, 380, "green"), write("R", 1112, 410, 24, "green"),
         arrow(985, 400, 985, 500, "pink"), write("mg", 950, 470, 24, "pink", "right"),
         arrow(1180, 330, 1180, 230, "yellow"), write("a", 1192, 280, 24, "yellow"),
         write("scale reading = R", 70, 190, 27, "yellow"),
         chapter="Lift problems"),

    step("Up is positive. The resultant force is R minus m g, and that equals m {a}. So R is m times g plus {a}: the scale reads more than your weight.",
         write("R - mg = ma,    so    R = m(g + a)", 70, 250, 27)),

    step("Steady speed, up or down: R is just m g. Accelerating down: m times g minus {a}, lighter. "
         "And if the cable snaps, the lift falls freely, and R is zero.",
         write("steady speed:  R = mg", 100, 320, 24),
         write("accelerating up:  R = m(g + a)   heavier", 100, 358, 24, "green"),
         write("accelerating down:  R = m(g - a)   lighter", 100, 396, 24, "blue"),
         write("free fall:  R = 0   \"weightless\"", 100, 434, 24, "pink")),

    step("Think fast. A sixty kilogram student, in a lift accelerating upwards at two metres per second squared. What does the scale say?",
         write("Think fast:  60 kg, a = 2 m s^{-2} up.  Reading?", 70, 510, 24, "pink"),
         pause=2.2),

    step("Sixty times twelve: seven hundred and twenty newtons. Accelerating down at two, it would be sixty times eight: four hundred and eighty.",
         write("60 × 12 = 720 N      (down: 60 × 8 = 480 N)", 70, 552, 24, "green")),

    step("And with the cable snapped, the scale reads zero. You feel weightless. Briefly. I do not recommend it.",
         write("(cable snapped: R = 0.  Not recommended.)", 70, 600, 22, "grey"),
         pause=1.1),

    # ── 5. Two blocks on a string ─────────────────────────────────────
    step("One more exam favourite. Two blocks tied together, three kilograms and two, pulled by fifteen newtons on a smooth table. "
         "Treat them as one body first: fifteen over five, three metres per second squared.",
         clear(2.2),
         heading("Two blocks, one string"),
         line(640, 330, 1240, 330, "grey", 2.4),
         box(700, 270, 90, 60, "white", 3.0), write("2 kg", 745, 308, 22, "white", "center"),
         line(790, 300, 900, 300, "grey", 2.4),
         box(900, 255, 120, 75, "white", 3.0), write("3 kg", 960, 300, 22, "white", "center"),
         arrow(1020, 292, 1160, 292, "green"), write("15 N", 1090, 276, 22, "green", "center"),
         write("together:  a = 15 ÷ (3 + 2) = 3 m s^{-2}", 70, 200, 25, "yellow"),
         chapter="Connected bodies"),

    step("Then look at the back block alone. Only the string pulls it, so the tension is two times three: six newtons.",
         write("back block alone:  T = 2 × 3 = 6 N", 70, 250, 25, "green"),
         write("T", 845, 286, 22, "pink", "center")),

    step("And that is Newton's laws done: inertia, F equals m {a}, action and reaction, momentum, and lifts. "
         "Coming up: equilibrium, where all the forces balance, and nothing moves at all. A very peaceful topic.",
         write("Newton's laws:  done.", 70, 420, 30, "yellow"),
         write("Coming up:  equilibrium of forces", 70, 470, 24, "green"),
         pause=1.2),
]

# The thumbnail: what a student sees in search results before choosing.
THUMBNAIL = [
    write("Momentum & Lifts", 54, 140, 80, "yellow"),
    write("Impulse  ·  Collisions  ·  Recoil  ·  Lifts", 60, 210, 30),
    line(60, 470, 640, 470, "grey", 3.0),
    *trolley(80, 470, 150, "2 kg"), arrow(240, 430, 330, 430, "yellow"), *trolley(380, 470, 110, "1 kg"),
    equation(["m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2"], 60, 580, 30, "green"),
    box(900, 250, 200, 360, "white", 3.4),
    ellipse(1000, 410, 14, 14, "white", 3.0), line(1000, 424, 1000, 510, "white", 3.0),
    line(1000, 510, 982, 560, "white", 3.0), line(1000, 510, 1018, 560, "white", 3.0),
    arrow(1150, 450, 1150, 330, "yellow"), write("heavier!", 1000, 300, 30, "pink", "center"),
]
