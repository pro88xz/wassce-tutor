"""Biology · Reproduction in plants: flower structure and pollination. A chalkboard video lesson.

Follows content/notes/biology-reproduction-in-plants-1.md: sexual and asexual
reproduction, a flower in half (longitudinal section) drawn and labelled with
the job of each part, pollination (not fertilisation), self- and
cross-pollination, and insect- against wind-pollinated flowers.
Check: python3 scripts/video/board_video.py content/videos/biology-reproduction-in-plants-1.py --boards .video-build/boards/flower
"""

from board_video import arrow, clear, curve, dots, ellipse, heading, label, line, step, text_width, write

TITLE = "Parts of a Flower and Pollination: Insect vs Wind Pollinated Flowers | WASSCE Biology"
DESCRIPTION = ("A flower drawn in half and labelled on the chalkboard: sepal, petal, stamen, anther, filament, stigma, "
               "style, ovary and ovule with their functions; pollination, self and cross-pollination, and insect versus "
               "wind-pollinated flowers.")
LABEL = "WASSCE Tutor  ·  Biology  ·  Reproduction in plants"
# The lesson page this video is on: /wassce/biology/reproduction-in-plants/reproduction-in-plants-flower-structure-and-pollination
LESSON = "biology/reproduction-in-plants/reproduction-in-plants-flower-structure-and-pollination"

FX = 360   # the flower's centre line


def mirror(pts):
    return [(2 * FX - x, y) for x, y in pts]


PETAL = [(FX - 34, 560), (FX - 120, 500), (FX - 186, 400), (FX - 196, 300), (FX - 150, 330), (FX - 100, 420), (FX - 46, 520)]
SEPAL = [(FX - 30, 574), (FX - 110, 588), (FX - 150, 560), (FX - 90, 556)]
FILAMENT = [(FX - 40, 540), (FX - 70, 470), (FX - 92, 380)]


def receptacle():
    return [curve([(FX - 60, 552), (FX - 40, 578), (FX, 586), (FX + 40, 578), (FX + 60, 552)], "white", 3.6),
            line(FX, 588, FX, 660, "green", 4.0)]


def carpel():
    return [ellipse(FX, 504, 46, 40, "white", 3.6),
            ellipse(FX - 14, 494, 9, 12, "yellow", 2.6), ellipse(FX + 14, 494, 9, 12, "yellow", 2.6), ellipse(FX, 520, 9, 12, "yellow", 2.6),
            line(FX - 6, 466, FX - 6, 330, "white", 3.0), line(FX + 6, 466, FX + 6, 330, "white", 3.0),
            ellipse(FX, 320, 24, 12, "pink", 3.4)]


def stamens():
    out = []
    for pts in (FILAMENT, mirror(FILAMENT)):
        out.append(curve(pts, "white", 3.0))
        x, y = pts[-1]
        out.append(ellipse(x, y - 20, 13, 24, "yellow", 3.2))
    return out


def petals_and_sepals():
    return [curve(PETAL, "pink", 3.4, closed=True), curve(mirror(PETAL), "pink", 3.4, closed=True),
            curve(SEPAL, "green", 3.2, closed=True), curve(mirror(SEPAL), "green", 3.2, closed=True)]


STEPS = [
    # ── 1. Two kinds of reproduction ───────────────────────────────────
    step("Plants reproduce in two ways. In sexual reproduction, a male and a female gamete fuse. This makes seeds, and the offspring vary.",
         heading("Reproduction in Plants"),
         write("Sexual:  male and female gametes fuse;  seeds;  offspring vary.", 70, 180, 26),
         chapter="Sexual and asexual reproduction in plants"),

    step("In asexual reproduction there is only one parent and no gametes. New plants grow from a stem, root or leaf, and they are almost identical to the parent.",
         write("Asexual:  one parent;  no gametes;  from a stem, root or leaf;", 70, 230, 26),
         write("offspring almost identical to the parent.", 70 + text_width("Asexual:  ", 26), 268, 26)),

    step("In flowering plants, sexual reproduction happens in the flower. So let us look inside one.",
         write("Sexual reproduction happens in the flower.", 70, 360, 30, "yellow")),

    # ── 2. The flower in half ──────────────────────────────────────────
    step("Here is a flower, cut in half from top to bottom. At the base is the receptacle, on its stalk.",
         clear(2.2),
         heading("Parts of a flower"),
         *receptacle(),
         label("receptacle", 700, 606, FX + 46, 576, 23),
         chapter="Parts of a flower and their functions (labelled diagram)"),

    step("Around the outside are the sepals. They are usually green, and they protect the flower while it is a bud.",
         *petals_and_sepals()[2:],
         label("sepal:  protects the bud", 700, 558, FX + 140, 566, 23, "green")),

    step("Inside them are the petals, often brightly coloured and scented, to attract insects.",
         *petals_and_sepals()[:2],
         label("petal:  attracts insects", 700, 410, FX + 186, 400, 23, "pink")),

    step("The stamens are the male parts. Each has a filament, holding up an anther. The anther makes the pollen.",
         *stamens(),
         label("anther:  makes pollen", 700, 266, FX + 104, 350, 23, "yellow"),
         label("filament:  holds up the anther", 700, 362, FX + 80, 452, 23)),

    step("In the middle is the carpel, the female part. The stigma at the top receives pollen. The style holds it up.",
         *carpel(),
         label("stigma:  receives pollen", 700, 218, FX + 24, 318, 23, "pink"),
         label("style:  joins stigma to ovary", 700, 314, FX + 8, 404, 23)),

    step("And at the bottom, the ovary contains the ovules. Each ovule holds an egg cell. After fertilisation, the ovules become seeds, and the ovary becomes the fruit.",
         label("ovary:  contains the ovules", 700, 458, FX + 46, 504, 23),
         label("ovule:  becomes a seed", 700, 508, FX + 14, 500, 23, "yellow")),

    # ── 3. Pollination ─────────────────────────────────────────────────
    step("Pollination is the transfer of pollen grains from an anther to a stigma of a flower of the same species.",
         clear(2.2),
         heading("Pollination"),
         write("Pollination:  the transfer of pollen from an anther to a", 70, 176, 26),
         write("stigma of a flower of the same species.", 70 + text_width("Pollination:  ", 26), 214, 26),
         chapter="What is pollination? Self- and cross-pollination"),

    step("Do not confuse it with fertilisation. Pollination only places pollen on the stigma. Fertilisation comes later, when the male and female nuclei fuse.",
         write("Pollination is NOT fertilisation.", 70, 284, 28, "pink"),
         write("fertilisation:  the male and female nuclei fuse, later.", 70, 324, 24, "grey")),

    step("In self-pollination, pollen reaches a stigma of the same flower, or another flower on the same plant. It is reliable, but the offspring vary less.",
         write("Self-pollination:", 70, 410, 27, "yellow"),
         write("the same flower, or the same plant", 420, 410, 23), write("reliable;  but less variation", 420, 442, 23)),

    step("In cross-pollination, pollen goes to a flower on a different plant of the same species. It gives more variation, which helps a species survive change. "
         "But it needs an agent, such as insects or the wind, to carry the pollen.",
         write("Cross-pollination:", 70, 510, 27, "yellow"),
         write("a different plant;  more variation", 420, 510, 23), write("needs an agent to carry the pollen", 420, 542, 23),
         write("agents:  insects,  birds,  bats,  wind,  water", 420, 584, 23, "blue")),

    # ── 4. Insect and wind ─────────────────────────────────────────────
    step("A flower's structure shows how it is pollinated. Compare an insect-pollinated flower with a wind-pollinated one.",
         clear(2.2),
         heading("Insect or wind?"),
         write("Insect-pollinated", 330, 176, 27, "pink"), write("Wind-pollinated", 800, 176, 27, "blue"),
         line(60, 194, 1200, 194, "grey", 2.4),
         chapter="Insect-pollinated versus wind-pollinated flowers"),

    step("Petals: an insect-pollinated flower has large, coloured, scented petals. A wind-pollinated flower has small petals, or none.",
         write("petals", 70, 246, 23, "grey"), write("large, coloured, scented", 330, 246, 23), write("small, dull, or none", 800, 246, 23)),
    step("Nectar: usually present for insects. Usually absent in wind-pollinated flowers.",
         write("nectar", 70, 300, 23, "grey"), write("present", 330, 300, 23), write("absent", 800, 300, 23)),
    step("Pollen: insect pollen is large and sticky, or spiny, so it clings to the insect. Wind pollen is small, light, and made in huge amounts.",
         write("pollen", 70, 354, 23, "grey"), write("large, sticky or spiny", 330, 354, 23), write("small, light, huge amounts", 800, 354, 23)),
    step("Anthers: inside the flower, where the insect brushes past them. In wind flowers they hang outside, in the moving air.",
         write("anthers", 70, 408, 23, "grey"), write("inside the flower", 330, 408, 23), write("hang outside", 800, 408, 23)),
    step("Stigma: sticky and inside the flower for insects. Large, feathery and hanging outside, to catch pollen from the air, for wind.",
         write("stigma", 70, 462, 23, "grey"), write("sticky, inside", 330, 462, 23), write("large, feathery, outside", 800, 462, 23)),

    step("These are general features, not rules for every flower. In the exam, link each feature to how it helps pollination.",
         write("In the exam:  link each feature to how it helps pollination.", 70, 600, 24, "pink"),
         pause=1.2),
]

THUMBNAIL = [
    write("Parts of a Flower", 54, 150, 74, "yellow"),
    write("Labelled diagram  ·  Pollination", 60, 214, 34),
    *[a for a in petals_and_sepals()], *stamens(), *carpel(), *receptacle(),
    write("stigma", 720, 330, 34, "pink"), line(708, 318, FX + 26, 320, "grey", 3.0),
    write("anther", 720, 400, 34, "yellow"), line(708, 388, FX + 106, 360, "grey", 3.0),
    write("ovary", 720, 510, 34), line(708, 498, FX + 48, 504, "grey", 3.0),
    write("petal", 720, 600, 34, "pink"), line(708, 588, FX + 140, 440, "grey", 3.0),
]
