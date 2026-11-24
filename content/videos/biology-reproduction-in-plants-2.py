"""Biology · Reproduction in plants: fertilisation, seeds and propagation. A chalkboard video lesson.

Follows content/notes/biology-reproduction-in-plants-2.md: the pollen tube and
double fertilisation (drawn), what becomes the seed and the fruit, seed
dispersal, the three conditions for germination with the experiment, and
vegetative propagation against sexual reproduction.
Check: python3 scripts/video/board_video.py content/videos/biology-reproduction-in-plants-2.py --boards .video-build/boards/seed
"""

from board_video import arrow, box, clear, curve, dots, ellipse, heading, label, line, step, text_width, wave, write

TITLE = "Fertilisation in Flowering Plants, Seed Dispersal and Germination | WASSCE Biology"
DESCRIPTION = ("Fertilisation in flowering plants on the chalkboard: the pollen tube and double fertilisation, ovule to "
               "seed and ovary to fruit, seed dispersal, the conditions for germination with the experiment, and "
               "vegetative propagation.")
LABEL = "WASSCE Tutor  ·  Biology  ·  Reproduction in plants"
# The lesson page this video is on: /wassce/biology/reproduction-in-plants/reproduction-in-plants-fertilisation-seed-formation-and-propagation
LESSON = "biology/reproduction-in-plants/reproduction-in-plants-fertilisation-seed-formation-and-propagation"

CX = 300   # the carpel's centre line


def carpel():
    return [ellipse(CX, 520, 120, 100, "white", 3.6),                        # ovary
            line(CX - 10, 422, CX - 10, 250, "white", 3.0), line(CX + 10, 422, CX + 10, 250, "white", 3.0),   # style
            ellipse(CX, 238, 40, 16, "pink", 3.4),                            # stigma
            ellipse(CX, 520, 62, 76, "yellow", 3.2)]                          # ovule


def embryo_sac():
    return [ellipse(CX, 516, 34, 50, "white", 2.4),
            dots([(CX, 556)], "blue", 12),                                     # egg cell, by the micropyle
            dots([(CX - 8, 510), (CX + 8, 510)], "green", 9)]                  # two polar nuclei


TUBE = [(CX + 20, 228), (CX + 4, 270), (CX, 340), (CX + 2, 420), (CX + 70, 480), (CX + 86, 560), (CX + 30, 610), (CX, 600), (CX, 584)]


def test_tube(x, label_text, note, color):
    return [line(x, 300, x, 470, "white", 3.2), line(x + 70, 300, x + 70, 470, "white", 3.2),
            curve([(x, 470), (x + 10, 500), (x + 35, 510), (x + 60, 500), (x + 70, 470)], "white", 3.2),
            box(x + 8, 420, 54, 24, "grey", 2.4),                              # cotton wool
            dots([(x + 22, 414), (x + 46, 414)], "yellow", 10),                # seeds
            write(label_text, x + 35, 560, 24, color, "center"), write(note, x + 35, 592, 20, "grey", "center")]


STEPS = [
    # ── 1. The pollen tube and double fertilisation ────────────────────
    step("After pollination, the pollen grain on the stigma grows a pollen tube. It grows down through the style, to an ovule in the ovary.",
         heading("Fertilisation in plants"),
         *carpel(), *embryo_sac(),
         dots([(CX + 22, 224)], "yellow", 14),
         curve(TUBE, "yellow", 3.0),
         label("pollen grain", 500, 222, CX + 30, 222, 23, "yellow"),
         label("pollen tube", 500, 330, CX + 12, 330, 23, "yellow"),
         chapter="Fertilisation in flowering plants: the pollen tube and double fertilisation"),

    step("The tube enters the ovule through a tiny hole, the micropyle, and carries two male gametes.",
         label("micropyle", 500, 640, CX + 4, 602, 23)),

    step("One male gamete fuses with the egg cell. This makes a zygote, which grows into the embryo of the seed.",
         label("egg cell", 500, 580, CX + 8, 556, 23, "blue"),
         write("1.  gamete + egg cell", 820, 300, 22, "blue"), write("=  zygote:  the embryo", 850, 330, 22, "blue")),

    step("The other male gamete fuses with the two polar nuclei. This forms the endosperm, a store of food for the embryo. "
         "Two fusions, so we call it double fertilisation.",
         label("polar nuclei", 500, 500, CX + 18, 510, 23, "green"),
         write("2.  gamete + 2 polar nuclei", 820, 380, 22, "green"), write("=  endosperm:  food", 850, 410, 22, "green"),
         write("Double fertilisation", 820, 250, 26, "yellow")),

    # ── 2. Seed and fruit ──────────────────────────────────────────────
    step("After fertilisation, the flower changes. The ovule becomes the seed, and the ovary becomes the fruit. A seed is not the same as a fruit. This is often tested.",
         clear(2.2),
         heading("Ovule to seed, ovary to fruit"),
         write("ovule", 120, 200, 30, "yellow"), arrow(260, 190, 380, 190, "white", 3.0), write("seed", 400, 200, 30, "yellow"),
         write("ovary", 120, 260, 30, "pink"), arrow(260, 250, 380, 250, "white", 3.0), write("fruit", 400, 260, 30, "pink"),
         chapter="After fertilisation: ovule to seed, ovary to fruit"),

    step("The ovary wall becomes the fruit wall, the pericarp. The outer layers of the ovule become the seed coat, or testa. And the zygote becomes the embryo.",
         write("ovary wall", 120, 330, 26), arrow(300, 322, 380, 322, "grey", 2.8), write("fruit wall (pericarp)", 400, 330, 26),
         write("ovule's coats", 120, 384, 26), arrow(378, 376, 440, 376, "grey", 2.8), write("seed coat (testa)", 460, 384, 26),
         write("zygote", 120, 438, 26), arrow(260, 430, 380, 430, "grey", 2.8), write("embryo", 400, 438, 26)),

    step("The embryo has a young root, the radicle, a young shoot, the plumule, and one or two seed leaves, the cotyledons, which often store food.",
         write("The embryo:", 120, 512, 27, "yellow"),
         write("radicle:  the young root", 140, 552, 24),
         write("plumule:  the young shoot", 140, 588, 24),
         write("cotyledons:  seed leaves;  often store food", 140, 624, 24)),

    # ── 3. Dispersal ───────────────────────────────────────────────────
    step("Seeds are carried away from the parent plant. This is dispersal. It stops overcrowding and competition, and lets the plant reach new places.",
         clear(2.2),
         heading("Seed dispersal"),
         write("Why?  less overcrowding and competition;  new places.", 70, 176, 26),
         chapter="Seed and fruit dispersal: wind, water, animals, explosion"),

    step("Wind carries very small or winged seeds.",
         ellipse(190, 300, 16, 12, "yellow", 3.0), curve([(200, 292), (260, 250), (330, 246), (290, 290), (206, 302)], "white", 2.8, closed=True),
         write("wind:  small or winged seeds", 90, 380, 24)),
    step("Water carries fruits that float, like the coconut.",
         ellipse(760, 290, 50, 40, "white", 3.0), wave(660, 340, 240, 8, 3, "blue", 3.0),
         write("water:  fruits that float (coconut)", 640, 380, 24)),
    step("Animals carry fruits with hooks that catch on their fur, or eat fleshy fruits and drop the seeds somewhere else.",
         ellipse(200, 500, 30, 30, "white", 3.0),
         *[line(200 + 30 * c, 500 + 30 * s_, 200 + 44 * c, 500 + 44 * s_, "white", 2.6) for c, s_ in [(1, 0), (-1, 0), (0, 1), (0, -1), (0.7, 0.7), (-0.7, 0.7), (0.7, -0.7), (-0.7, -0.7)]],
         write("animals:  hooks;  fleshy fruits", 90, 592, 24)),
    step("And some dry fruits explode, splitting open suddenly and throwing out their seeds.",
         curve([(660, 500), (720, 470), (800, 470), (860, 500)], "green", 3.2), curve([(660, 520), (720, 556), (800, 556), (860, 520)], "green", 3.2),
         dots([(900, 480), (930, 510), (910, 540)], "yellow", 10),
         write("explosive:  dry pods split open", 640, 592, 24)),

    # ── 4. Germination ─────────────────────────────────────────────────
    step("A seed starts to grow, or germinates, when it has three things: water, oxygen and a suitable temperature.",
         clear(2.2),
         heading("Conditions for germination"),
         chapter="Conditions for germination: water, oxygen and warmth"),

    step("Water activates the enzymes, softens the seed coat, and lets the stored food be used. Oxygen is needed for aerobic respiration, which releases energy for growth. "
         "And a suitable temperature lets the enzymes work.",
         write("water:", 70, 182, 26, "blue"), write("activates enzymes;  softens the seed coat", 250, 182, 24),
         write("oxygen:", 70, 222, 26, "blue"), write("aerobic respiration releases energy", 250, 222, 24),
         write("warmth:", 70, 262, 26, "blue"), write("a suitable temperature for the enzymes", 250, 262, 24)),

    step("To show this, set up three tubes with seeds on cotton wool. Tube A has water, air and warmth. It is the control, and its seeds germinate.",
         *test_tube(140, "A:  germinate", "water, air, warm", "green")),
    step("Tube B is dry. Its seeds do not germinate.",
         *test_tube(500, "B:  no", "no water", "pink")),
    step("Tube C has no oxygen. Its seeds do not germinate either. Use many seeds in each tube, because one seed is not enough to be sure.",
         *test_tube(860, "C:  no", "no oxygen", "pink"),
         write("percentage germination  =  (germinated / total)  x 100", 70, 640, 22, "yellow")),

    # ── 5. Vegetative propagation ──────────────────────────────────────
    step("Plants can also reproduce without seeds. Vegetative propagation grows new plants from a stem, root or leaf. There is no fertilisation.",
         clear(2.2),
         heading("Vegetative propagation"),
         write("New plants from a stem, root or leaf.  No fertilisation.", 70, 176, 26),
         chapter="Vegetative propagation and sexual versus asexual reproduction"),

    step("In West Africa, cassava is grown from stem cuttings. Irish potato grows from tubers, onion from bulbs, and plantain from suckers. Some plants spread by runners.",
         write("stem cuttings:", 90, 240, 25, "yellow"), write("cassava", 360, 240, 25),
         write("tubers:", 90, 284, 25, "yellow"), write("Irish potato", 360, 284, 25),
         write("bulbs:", 90, 328, 25, "yellow"), write("onion", 360, 328, 25),
         write("suckers:", 90, 372, 25, "yellow"), write("plantain", 360, 372, 25),
         write("runners:", 90, 416, 25, "yellow"), write("new plants along the ground", 360, 416, 25)),

    step("It is quick, and it keeps the good qualities of the parent. But the offspring are almost identical, so there is little variation, and a sick cutting can pass on disease.",
         write("+  quick;  keeps good qualities", 700, 240, 24, "green"),
         write("-  little variation;", 700, 284, 24, "pink"), write("can pass on disease", 730, 316, 24, "pink")),

    step("Sexual reproduction is the opposite: two gametes fuse, seeds form, and the offspring vary.",
         write("Sexual:  gametes fuse;  seeds;  offspring vary.", 90, 520, 26, "blue"),
         write("Asexual:  one parent;  no fusion;  offspring alike.", 90, 562, 26, "blue"),
         pause=1.2),
]

THUMBNAIL = [
    write("Fertilisation in Plants", 54, 150, 66, "yellow"),
    write("Seeds  ·  Dispersal  ·  Germination", 480, 218, 30),
    *carpel(), *embryo_sac(), dots([(CX + 22, 224)], "yellow", 16), curve(TUBE, "yellow", 4.4),
    write("pollen tube", 640, 340, 34, "yellow"), line(628, 328, CX + 14, 340, "grey", 3.0),
    write("ovule = seed", 640, 470, 34, "yellow"), write("ovary = fruit", 640, 540, 34, "pink"),
]
