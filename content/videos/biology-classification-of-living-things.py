"""Biology · Classification of living things. A chalkboard video lesson.

Follows content/notes/biology-classification-of-living-things.md: why
organisms are classified, the seven ranks (with humans as the example),
binomial nomenclature and its writing rules, the five kingdoms by their
features, and using a dichotomous key, worked through.
Check: python3 scripts/video/board_video.py content/videos/biology-classification-of-living-things.py --boards .video-build/boards/class
"""

from board_video import arrow, box, clear, dashed, heading, line, ring, step, text_width, underline, write

TITLE = "Classification of Living Things: Kingdom to Species and Scientific Names | WASSCE Biology"
DESCRIPTION = ("Why living things are classified, the seven taxonomic ranks from kingdom to species, how to write "
               "scientific names (binomial nomenclature), the five kingdoms and their features, and how to use a "
               "dichotomous key.")
LABEL = "WASSCE Tutor  ·  Biology  ·  Classification"

RANKS = ["Kingdom", "Phylum", "Class", "Order", "Family", "Genus", "Species"]
HUMAN = ["Animalia", "Chordata", "Mammalia", "Primates", "Hominidae", "Homo", "sapiens"]
BAR_X, BAR_Y, BAR_H, BAR_GAP = 400, 150, 50, 12   # the rank bars: centre x, top, height, gap


def bar(i, color="white"):
    w = 520 - i * 60
    y = BAR_Y + i * (BAR_H + BAR_GAP)
    return [box(BAR_X - w / 2, y, w, BAR_H, color, 3.0), write(RANKS[i], BAR_X, y + 36, 26, color, "center")]


def bar_y(i):
    return BAR_Y + i * (BAR_H + BAR_GAP) + 36


# The key: each choice, and where it leads.
KEY = [("1a", "has legs", "go to 2", "white"), ("1b", "no legs", "earthworm", "blue"),
       ("2a", "six legs", "go to 3", "white"), ("2b", "eight legs", "spider", "blue"),
       ("3a", "one pair of wings", "housefly", "blue"), ("3b", "two pairs of wings", "butterfly", "blue")]
KEY_Y = [236, 278, 336, 378, 436, 478]


def key_line(i):
    code, choice, to, color = KEY[i]
    y = KEY_Y[i]
    end = 170 + text_width(choice, 27)
    return [write(code, 90, y, 27, "yellow"), write(choice, 170, y, 27),
            dashed(end + 14, y - 8, 640, y - 8, "grey", 2.2, dash=6, gap=9), write(to, 660, y, 27, color)]


STEPS = [
    # ── 1. Why classify ────────────────────────────────────────────────
    step("There are millions of different kinds of living things on Earth. To study them, biologists sort them into groups. This is called classification.",
         heading("Classification of Living Things"),
         write("Classification:  grouping organisms by the features they share.", 70, 176, 27),
         chapter="What is classification? Why classify organisms?"),

    step("Why do we classify? It makes the huge variety of life easier to study. It helps us to identify an organism. "
         "It gives each organism one name that scientists everywhere understand. And it shows how organisms are related.",
         write("Why classify?", 70, 252, 32, "yellow"),
         write("1.  makes the variety of life easier to study", 90, 300, 26),
         write("2.  helps us to identify organisms", 90, 342, 26),
         write("3.  one name, understood by scientists everywhere", 90, 384, 26),
         write("4.  shows how organisms are related", 90, 426, 26)),

    step("The science of identifying, naming and classifying organisms is called taxonomy.",
         write("Taxonomy:", 70, 516, 30, "blue"),
         write("the science of identifying, naming and classifying", 260 + 30, 516, 26),
         write("organisms.", 290, 556, 26)),

    # ── 2. The seven ranks ─────────────────────────────────────────────
    step("Organisms are placed in groups inside groups. There are seven main ranks: kingdom, phylum, class, order, family, genus and species. "
         "In plants, a phylum is often called a division.",
         clear(2.2),
         heading("Kingdom to species"),
         *[a for i in range(7) for a in bar(i)],
         chapter="The seven taxonomic ranks: kingdom to species"),

    step("A kingdom is the largest group. As you go down, each group gets smaller, and its members share more and more features.",
         write("largest", 44, 150, 21, "grey"),
         arrow(84, 166, 84, 548, "grey", 3.2),
         write("smallest", 40, 582, 21, "grey")),

    step("To remember the order, use this: King Philip Came Over For Good Soup.",
         write("King Philip Came Over For Good Soup", 400, 646, 28, "pink", "center")),

    step("Here is where humans belong. Kingdom Animalia, phylum Chordata, class Mammalia, order Primates, family Hominidae, genus Homo, and species sapiens.",
         write("Humans", 760, 128, 30, "yellow"),
         *[write(HUMAN[i], 760, bar_y(i), 27, "blue") for i in range(7)],
         *[line(BAR_X + (520 - i * 60) / 2 + 10, bar_y(i) - 9, 745, bar_y(i) - 9, "grey", 2.0) for i in range(7)]),

    step("A species is a group of organisms that can breed together to produce fertile offspring.",
         write("Species:", 930, 520, 24, "yellow"),
         write("can interbreed to", 930, 552, 21), write("give fertile offspring", 930, 580, 21)),

    # ── 3. Scientific names ────────────────────────────────────────────
    step("Every species has a scientific name made of two words. This system is called binomial nomenclature, and it was introduced by Carl Linnaeus.",
         clear(2.2),
         heading("Binomial nomenclature"),
         write("Two names:  the genus, then the species.  (Carl Linnaeus)", 70, 176, 27),
         chapter="Binomial nomenclature: how to write scientific names"),

    step("Humans are Homo sapiens. Homo is the genus. Sapiens is the species.",
         write("Homo", 300, 320, 64), write("sapiens", 300 + text_width("Homo  ", 64), 320, 64),
         arrow(372, 396, 372, 344, "yellow"), write("genus", 372, 430, 26, "yellow", "center"),
         arrow(300 + text_width("Homo  ", 64) + text_width("sapiens", 64) / 2, 396,
               300 + text_width("Homo  ", 64) + text_width("sapiens", 64) / 2, 344, "yellow"),
         write("species", 300 + text_width("Homo  ", 64) + text_width("sapiens", 64) / 2, 430, 26, "yellow", "center")),

    step("Rule one: the genus comes first and begins with a capital letter. Rule two: the species name comes second, in small letters. "
         "Rule three: in print, the name is in italics. When you write it by hand, underline each word separately.",
         write("1.  genus first, with a capital letter", 90, 492, 26),
         write("2.  species second, all small letters", 90, 534, 26),
         write("3.  printed in italics;  handwritten: underline each word", 90, 576, 26),
         underline(296, 300 + text_width("Homo", 64) + 4, 334, "pink", 3.2),
         underline(300 + text_width("Homo  ", 64) - 4, 300 + text_width("Homo  sapiens", 64) + 6, 334, "pink", 3.2)),

    step("Scientific names prevent confusion. Maize has a different local name in every language, but scientists everywhere call it Zea mays.",
         write("maize:", 90, 646, 28, "green"), write("Zea mays", 232, 646, 28, "green"),
         underline(228, 232 + text_width("Zea", 28) + 6, 656, "green", 2.4),
         underline(232 + text_width("Zea ", 28) - 2, 238 + text_width("Zea mays", 28), 656, "green", 2.4)),

    # ── 4. The five kingdoms ───────────────────────────────────────────
    step("Living things are commonly grouped into five kingdoms. Learn the features that put an organism in each one.",
         clear(2.2),
         heading("The five kingdoms"),
         write("Kingdom", 70, 170, 24, "grey"), write("Main features, and examples", 290, 170, 24, "grey"),
         line(60, 186, 1200, 186, "grey", 2.4),
         chapter="The five kingdoms and their features"),

    step("Monera, the prokaryotes, are single cells with no true nucleus. Bacteria belong here.",
         write("Monera", 70, 232, 28, "yellow"), write("one cell;  no true nucleus", 290, 232, 25), write("e.g.  bacteria", 290, 262, 21, "blue")),
    step("Protoctista are mostly single cells, but they do have a nucleus. Amoeba belongs here, and so do many algae.",
         write("Protoctista", 70, 308, 28, "yellow"), write("mostly one cell;  has a nucleus", 290, 308, 25), write("e.g.  amoeba, algae", 290, 338, 21, "blue")),
    step("Fungi cannot make their own food. They absorb it from what they grow on. Their cell walls contain chitin. "
         "Most of them are made of long, thin threads, called hyphae. Mushrooms and yeast are both fungi.",
         write("Fungi", 70, 384, 28, "yellow"), write("absorb food;  chitin walls;  hyphae", 290, 384, 25), write("e.g.  mushroom, yeast", 290, 414, 21, "blue")),
    step("Plants have many cells with cellulose cell walls, and most make their own food by photosynthesis.",
         write("Plants", 70, 460, 28, "yellow"), write("many cells;  cellulose walls;  photosynthesis", 290, 460, 25), write("e.g.  fern, maize", 290, 490, 21, "blue")),
    step("Animals have many cells but no cell walls, and they take in, or ingest, their food.",
         write("Animals", 70, 536, 28, "yellow"), write("many cells;  no cell walls;  ingest food", 290, 536, 25), write("e.g.  insects, humans", 290, 566, 21, "blue")),
    step("Some books use slightly different names for these groups. In the exam, use the names the question uses.",
         write("Use the names the question uses.", 70, 632, 26, "pink")),

    # ── 5. A dichotomous key ───────────────────────────────────────────
    step("To identify an organism, biologists use a dichotomous key. Dichotomous means dividing into two: at each step you choose one of a pair.",
         clear(2.2),
         heading("A dichotomous key"),
         write("Pairs of choices: at each step, choose one.", 70, 174, 27),
         chapter="How to use a dichotomous key"),

    step("Start at one. Does it have legs? If it has no legs, it is an earthworm. If it has legs, go to two.",
         *key_line(0), *key_line(1)),
    step("At two: six legs, go to three. Eight legs, it is a spider.",
         *key_line(2), *key_line(3)),
    step("At three: one pair of wings, it is a housefly. Two pairs of wings, it is a butterfly.",
         *key_line(4), *key_line(5)),

    step("Let us identify a housefly. It has legs, so go to two. It has six legs, so go to three. It has one pair of wings. It is a housefly.",
         ring(110, 226, 36, 24, "pink"), ring(110, 326, 36, 24, "pink"), ring(110, 426, 36, 24, "pink"),
         write("housefly:  1a, 2a, 3a", 840, 336, 26, "pink")),

    step("A good key uses features you can see clearly, in pairs that cannot both be true. Never use vague words, such as big or small.",
         write("Good keys: clear, visible features, in pairs that cannot both be true.", 70, 566, 25, "green"),
         write("Avoid vague words like big or small.", 70, 604, 25, "pink"),
         pause=1.2),
]

THUMBNAIL = [
    write("Classification", 60, 150, 76, "yellow"),
    write("Kingdom to Species  ·  Scientific names", 64, 214, 34),
    *[a for i in range(7) for a in [box(330 - (460 - i * 52) / 2, 252 + i * 58, 460 - i * 52, 48, "white", 4.4),
                                     write(RANKS[i], 330, 252 + i * 58 + 35, 27, "white", "center")]],
    write("Homo", 700, 420, 72, "blue"), write("sapiens", 700, 510, 72, "blue"),
    underline(694, 706 + text_width("Homo", 72), 434, "pink", 5.0),
    underline(694, 706 + text_width("sapiens", 72), 524, "pink", 5.0),
]
