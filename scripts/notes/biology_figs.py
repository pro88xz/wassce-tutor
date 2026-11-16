#!/usr/bin/env python3
"""Original diagrams for the Biology notes.

    python3 scripts/notes/biology_figs.py            # write every diagram
    python3 scripts/notes/biology_figs.py name ...   # write some

Each function draws one figure and returns an Svg. Files go to
public/img/biology/<name>.svg and lessons show them from
https://wasscetutor.com/img/biology/<name>.svg. All drawn by WASSCE Tutor.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from chemistry_figs import box, link  # noqa: E402
from government_figs import arrow, heading, note  # noqa: E402
from svgfig import (  # noqa: E402
    BLUE, F_AMBER, F_BLUE, F_GREEN, F_GREY, F_PURPLE, F_RED, GLASS, GREEN, INK, METAL, MUTED, ORANGE, PURPLE, RED,
    TEAL, Svg,
)

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/img/biology"
FIGS: dict[str, callable] = {}
F_TEAL = "#ccfbf1"
BROWN = "#92400e"
F_BROWN = "#fde68a"


def fig(fn):
    FIGS[fn.__name__.replace("_", "-")] = fn
    return fn


def punnett(s: Svg, x0, y0, cell, top, left, cells, colors=None, size=20):
    """A Punnett square: gametes `top` across, `left` down, offspring `cells[r][c]`."""
    for k, g in enumerate(top):
        s.circle(x0 + cell * k + cell / 2, y0 - 34, 22, fill=F_BLUE, stroke=BLUE, width=2)
        s.text(x0 + cell * k + cell / 2, y0 - 33, g, size=size - 2, weight="bold", color=BLUE)
    for r, g in enumerate(left):
        s.circle(x0 - 34, y0 + cell * r + cell / 2, 22, fill=F_RED, stroke=RED, width=2)
        s.text(x0 - 34, y0 + cell * r + cell / 2 + 1, g, size=size - 2, weight="bold", color=RED)
    for r in range(len(left)):
        for c in range(len(top)):
            fill = (colors or {}).get(cells[r][c], "#ffffff")
            s.rect(x0 + c * cell, y0 + r * cell, cell, cell, fill=fill, stroke=INK, width=2)
            s.text(x0 + c * cell + cell / 2, y0 + r * cell + cell / 2 + 1, cells[r][c], size=size, weight="bold")


# ═══ B1: genetics, evolution and practical skills ═══════════════════════════

@fig
def dna_structure():
    s = Svg(780, 470, "The structure of DNA",
            "DNA is two strands twisted into a double helix, shown here untwisted as a ladder. Each strand has a backbone "
            "of alternating sugar (deoxyribose) and phosphate. The rungs are pairs of bases: adenine always pairs with "
            "thymine, and guanine always pairs with cytosine.")
    heading(s, "DNA: a double helix, shown untwisted as a ladder")
    pairs = [("A", "T"), ("G", "C"), ("T", "A"), ("C", "G"), ("A", "T"), ("G", "C")]
    col = {"A": RED, "T": BLUE, "G": GREEN, "C": ORANGE}
    fill = {"A": F_RED, "T": F_BLUE, "G": F_GREEN, "C": F_AMBER}
    lx, rx, y0, dy = 120, 420, 92, 58
    for k, (a, b) in enumerate(pairs):
        y = y0 + k * dy
        s.rect(lx - 46, y - 16, 34, 32, fill=F_GREY, stroke=MUTED, width=1.8, rx=4)
        s.text(lx - 29, y + 1, "S", size=14, weight="bold", color=MUTED)
        s.rect(rx + 12, y - 16, 34, 32, fill=F_GREY, stroke=MUTED, width=1.8, rx=4)
        s.text(rx + 29, y + 1, "S", size=14, weight="bold", color=MUTED)
        if k < len(pairs) - 1:
            for x in (lx - 29, rx + 29):
                s.line(x, y + 16, x, y + dy - 16, color=MUTED, width=2.4)
                s.circle(x, y + dy / 2, 9, fill="#ffffff", stroke=PURPLE, width=2)
                s.text(x, y + dy / 2 + 1, "P", size=10, weight="bold", color=PURPLE)
        w = (rx - lx) / 2 - 6
        s.rect(lx - 10, y - 15, w, 30, fill=fill[a], stroke=col[a], width=2.2, rx=5)
        s.text(lx - 10 + w / 2, y + 1, a, size=17, weight="bold", color=col[a])
        s.rect(rx + 10 - w, y - 15, w, 30, fill=fill[b], stroke=col[b], width=2.2, rx=5)
        s.text(rx + 10 - w / 2, y + 1, b, size=17, weight="bold", color=col[b])
        s.line(lx - 10 + w, y, rx + 10 - w, y, color=INK, width=1.6, dash="3 3")
    s.text(lx - 29, y0 + 6 * dy - 6, "strand 1", size=13, color=MUTED)
    s.text(rx + 29, y0 + 6 * dy - 6, "strand 2", size=13, color=MUTED)
    x = 520
    s.text(x, 100, "Key", size=16, weight="bold", anchor="start")
    s.rect(x, 118, 24, 22, fill=F_GREY, stroke=MUTED, width=1.6, rx=3)
    s.text(x + 34, 129, "S = deoxyribose sugar", size=14, anchor="start")
    s.circle(x + 12, 160, 10, fill="#ffffff", stroke=PURPLE, width=2)
    s.text(x + 34, 160, "P = phosphate", size=14, anchor="start")
    s.text(x + 34, 186, "- - -  weak hydrogen bonds", size=14, anchor="start")
    s.text(x, 232, "Base pairing rule", size=16, weight="bold", anchor="start")
    s.text(x, 262, "A pairs with T", size=16, weight="bold", color=RED, anchor="start")
    s.text(x, 290, "G pairs with C", size=16, weight="bold", color=GREEN, anchor="start")
    s.text(x, 336, "sugar + phosphate + base", size=14, color=MUTED, anchor="start")
    s.text(x, 358, "= one nucleotide", size=14, color=MUTED, anchor="start")
    return s


@fig
def chromosome_alleles():
    s = Svg(780, 400, "Chromosomes, genes and alleles",
            "A homologous pair of chromosomes, one from each parent. A gene for a characteristic sits at the same place, "
            "the locus, on both chromosomes. The two copies may be the same allele (homozygous, such as TT or tt) or "
            "different alleles (heterozygous, Tt).")
    heading(s, "A homologous pair: same genes, possibly different alleles")

    def chrom(x, col, fill, alleles):
        s.rect(x - 18, 70, 36, 280, fill=fill, stroke=col, width=2.6, rx=18)
        s.ellipse(x, 170, 20, 9, fill="#ffffff", stroke=col, width=2)
        for y, a in alleles:
            s.rect(x - 18, y - 9, 36, 18, fill=col, stroke=col, width=1)
            s.text(x, y + 1, a, size=14, weight="bold", color="#ffffff")

    chrom(200, BLUE, F_BLUE, [(120, "T"), (240, "B"), (305, "r")])
    chrom(300, RED, F_RED, [(120, "t"), (240, "B"), (305, "r")])
    s.text(200, 372, "from father", size=14, color=BLUE)
    s.text(300, 372, "from mother", size=14, color=RED)
    s.line(320, 120, 420, 120, color=INK, width=1.6)
    s.text(430, 112, "height gene: T and t", size=15, weight="bold", anchor="start")
    s.text(430, 134, "different alleles → heterozygous (Tt)", size=14, anchor="start")
    s.line(320, 240, 420, 240, color=INK, width=1.6)
    s.text(430, 232, "another gene: B and B", size=15, weight="bold", anchor="start")
    s.text(430, 254, "same allele → homozygous (BB)", size=14, anchor="start")
    s.line(320, 305, 420, 305, color=INK, width=1.6)
    s.text(430, 297, "r and r: homozygous recessive", size=15, weight="bold", anchor="start")
    s.text(430, 319, "the recessive feature shows", size=14, anchor="start")
    s.line(222, 170, 420, 178, color=MUTED, width=1.4, dash="4 4")
    s.text(430, 182, "centromere", size=14, color=MUTED, anchor="start")
    return s


@fig
def monohybrid_cross():
    s = Svg(780, 470, "A monohybrid cross between two heterozygous tall plants",
            "Parents Tt crossed with Tt each produce gametes T and t. The Punnett square gives offspring TT, Tt, Tt and "
            "tt: genotype ratio 1 TT : 2 Tt : 1 tt, phenotype ratio 3 tall : 1 dwarf.")
    heading(s, "Tt × Tt: the 3 : 1 ratio")
    s.text(70, 80, "Parents", size=15, weight="bold", color=MUTED, anchor="start")
    s.text(190, 80, "Tt (tall)  ×  Tt (tall)", size=17, weight="bold", anchor="start")
    s.text(70, 116, "Gametes", size=15, weight="bold", color=MUTED, anchor="start")
    s.text(190, 116, "T or t", size=17, anchor="start")
    s.text(330, 116, "T or t", size=17, anchor="start")
    punnett(s, 160, 200, 100, ["T", "t"], ["T", "t"], [["TT", "Tt"], ["Tt", "tt"]],
            colors={"TT": F_GREEN, "Tt": F_GREEN, "tt": F_AMBER}, size=22)
    s.text(470, 230, "Genotypes", size=16, weight="bold", anchor="start")
    s.text(470, 258, "1 TT : 2 Tt : 1 tt", size=17, anchor="start")
    s.text(470, 312, "Phenotypes", size=16, weight="bold", anchor="start")
    s.rect(470, 328, 22, 22, fill=F_GREEN, stroke=INK, width=1.5)
    s.text(502, 340, "3 tall (75%)", size=16, anchor="start")
    s.rect(470, 362, 22, 22, fill=F_AMBER, stroke=INK, width=1.5)
    s.text(502, 374, "1 dwarf (25%)", size=16, anchor="start")
    s.text(470, 422, "T = tall (dominant)", size=14, color=MUTED, anchor="start")
    s.text(470, 444, "t = dwarf (recessive)", size=14, color=MUTED, anchor="start")
    return s


@fig
def sickle_cell_cross():
    s = Svg(780, 440, "Inheritance of sickle cell between two carriers",
            "Two parents with the sickle cell trait, genotype AS, each pass on A or S. Their children can be AA (normal), "
            "AS (carrier, sickle cell trait) or SS (sickle cell disease) in the ratio 1 : 2 : 1. Each child has a 1 in 4 "
            "chance of sickle cell disease.")
    heading(s, "AS × AS: each child has a 1 in 4 chance of SS")
    s.text(70, 84, "Parents", size=15, weight="bold", color=MUTED, anchor="start")
    s.text(190, 84, "AS (carrier)  ×  AS (carrier)", size=17, weight="bold", anchor="start")
    punnett(s, 160, 170, 100, ["A", "S"], ["A", "S"], [["AA", "AS"], ["AS", "SS"]],
            colors={"AA": F_GREEN, "AS": F_AMBER, "SS": F_RED}, size=22)
    rows = [(F_GREEN, "AA: normal haemoglobin", "1 in 4"), (F_AMBER, "AS: carrier (trait), healthy", "2 in 4"),
            (F_RED, "SS: sickle cell disease", "1 in 4")]
    for k, (f, t, p) in enumerate(rows):
        y = 200 + k * 56
        s.rect(470, y - 12, 24, 24, fill=f, stroke=INK, width=1.5)
        s.text(504, y, t, size=15, weight="bold", anchor="start")
        s.text(504, y + 22, p, size=14, color=MUTED, anchor="start")
    s.text(470, 392, "A and S are codominant:", size=14, color=MUTED, anchor="start")
    s.text(470, 412, "AS makes both kinds of haemoglobin", size=14, color=MUTED, anchor="start")
    return s


@fig
def sex_determination():
    s = Svg(780, 420, "Sex determination in humans",
            "The mother (XX) makes only X eggs. The father (XY) makes X or Y sperm in equal numbers. The Punnett square "
            "gives XX, XX, XY, XY: half the children are expected to be girls and half boys. The sperm decides the sex.")
    heading(s, "XX × XY: the sperm decides the sex")
    s.text(70, 84, "Parents", size=15, weight="bold", color=MUTED, anchor="start")
    s.text(190, 84, "mother XX  ×  father XY", size=17, weight="bold", anchor="start")
    punnett(s, 160, 170, 100, ["X", "Y"], ["X", "X"], [["XX", "XY"], ["XX", "XY"]],
            colors={"XX": F_PURPLE, "XY": F_TEAL}, size=22)
    s.text(150, 120, "sperm", size=14, color=BLUE, anchor="end")
    s.text(100, 290, "eggs", size=14, color=RED, anchor="end")
    s.rect(470, 200, 24, 24, fill=F_PURPLE, stroke=INK, width=1.5)
    s.text(504, 212, "XX: girl (50%)", size=16, weight="bold", anchor="start")
    s.rect(470, 248, 24, 24, fill=F_TEAL, stroke=INK, width=1.5)
    s.text(504, 260, "XY: boy (50%)", size=16, weight="bold", anchor="start")
    s.text(470, 320, "Eggs always carry X.", size=14, color=MUTED, anchor="start")
    s.text(470, 342, "Half of sperm carry X, half carry Y.", size=14, color=MUTED, anchor="start")
    return s


@fig
def variation_graphs():
    s = Svg(780, 400, "Continuous and discontinuous variation",
            "Left: the heights of students form a smooth bell-shaped distribution with many intermediate values: "
            "continuous variation. Right: ABO blood groups fall into four separate categories, A, B, AB and O, with no "
            "values in between: discontinuous variation.")
    heading(s, "Continuous vs discontinuous variation")
    ox, oy = 70, 320
    heights = [2, 5, 11, 19, 25, 21, 13, 6, 3]
    for k, f in enumerate(heights):
        s.rect(ox + k * 34, oy - f * 7.6, 34, f * 7.6, fill=F_BLUE, stroke=BLUE, width=1.6)
    pts = [(ox + k * 34 + 17, oy - f * 7.6) for k, f in enumerate(heights)]
    s.polyline(pts, color=RED, width=2.4)
    s.line(ox, oy, ox + 9 * 34 + 10, oy, color=INK, width=2)
    s.line(ox, oy, ox, oy - 250, color=INK, width=2)
    for k, h in enumerate(range(140, 185, 5)):
        if k % 2 == 0:
            s.text(ox + k * 34 + 17, oy + 18, str(h), size=12, color=MUTED)
    s.text(ox + 155, oy + 42, "height (cm)", size=14, color=MUTED)
    s.text(ox + 155, 70, "Continuous: height", size=16, weight="bold", color=BLUE)
    s.text(ox + 155, 92, "any value in a range", size=14, color=MUTED)
    bx = 470
    groups = [("A", 12, F_RED, RED), ("B", 8, F_GREEN, GREEN), ("AB", 3, F_PURPLE, PURPLE), ("O", 17, F_AMBER, ORANGE)]
    s.line(bx, oy, bx + 270, oy, color=INK, width=2)
    s.line(bx, oy, bx, oy - 250, color=INK, width=2)
    for k, (g, f, fill, col) in enumerate(groups):
        x = bx + 18 + k * 64
        s.rect(x, oy - f * 12, 44, f * 12, fill=fill, stroke=col, width=2)
        s.text(x + 22, oy + 18, g, size=15, weight="bold")
    s.text(bx + 135, oy + 42, "blood group", size=14, color=MUTED)
    s.text(bx + 135, 70, "Discontinuous: blood group", size=16, weight="bold", color=ORANGE)
    s.text(bx + 135, 92, "separate categories, no in-between", size=14, color=MUTED)
    return s


@fig
def natural_selection():
    s = Svg(780, 470, "How natural selection works",
            "Six steps. Individuals in a population vary. More offspring are produced than can survive. They compete in a "
            "struggle for existence. Those with useful variations survive and reproduce. They pass the useful alleles to "
            "their offspring. Over many generations the population changes.")
    heading(s, "Natural selection in six steps")
    steps = [
        ("1  Variation", "individuals differ", F_BLUE, BLUE),
        ("2  Over-production", "more young than can survive", F_PURPLE, PURPLE),
        ("3  Struggle", "competition for food and mates", F_AMBER, ORANGE),
        ("4  Survival of the fittest", "the best-adapted live longer", F_GREEN, GREEN),
        ("5  Inheritance", "survivors pass on useful alleles", F_TEAL, TEAL),
        ("6  Change", "the useful allele spreads", F_RED, RED),
    ]
    pos = [(140, 120), (390, 120), (640, 120), (640, 330), (390, 330), (140, 330)]
    boxes = []
    for (t, sub, fill, col), (x, y) in zip(steps, pos):
        boxes.append(box(s, x, y, 220, 92, [t, sub], col=col, fill=fill, size=15))
    for a, b in zip(boxes, boxes[1:]):
        link(s, a, b, color=MUTED, width=2.6)
    note(s, "Example: malaria parasites resistant to a drug survive treatment and multiply.", 440, size=14, color=INK)
    return s


@fig
def microscope_parts():
    s = Svg(780, 560, "The parts of a compound light microscope",
            "A light microscope with its parts labelled: eyepiece lens at the top of the body tube; revolving nosepiece "
            "holding the objective lenses; the stage with clips holding the slide; the condenser and diaphragm under the "
            "stage; the mirror or lamp at the base; coarse and fine focus knobs on the arm; and the base.")
    heading(s, "The compound light microscope")
    s.rect(180, 500, 220, 26, fill=METAL, stroke=INK, width=2.4, rx=6)
    s.path("M 330 500 L 330 330 Q 330 250 300 200 L 286 180", color=INK, width=22)
    s.path("M 330 500 L 330 330 Q 330 250 300 200 L 286 180", color=METAL, width=16)
    s.rect(230, 70, 44, 40, fill=GLASS, stroke=INK, width=2.4, rx=4)
    s.rect(220, 108, 64, 120, fill=METAL, stroke=INK, width=2.4, rx=6)
    s.polygon([(212, 228), (292, 228), (282, 250), (222, 250)], fill=METAL, stroke=INK, width=2.4)
    for x, h in ((226, 46), (250, 34), (274, 24)):
        s.rect(x - 8, 250, 16, h, fill=GLASS, stroke=INK, width=2)
    s.rect(160, 318, 200, 14, fill=METAL, stroke=INK, width=2.4, rx=3)
    s.rect(212, 308, 80, 10, fill="#ffffff", stroke=BLUE, width=2)
    s.line(176, 310, 206, 314, color=INK, width=3)
    s.line(328, 310, 298, 314, color=INK, width=3)
    s.rect(230, 338, 44, 20, fill=GLASS, stroke=INK, width=2, rx=3)
    s.rect(224, 362, 56, 8, fill=METAL, stroke=INK, width=2)
    s.ellipse(252, 450, 34, 12, fill=GLASS, stroke=INK, width=2.4)
    s.line(252, 438, 252, 372, color=ORANGE, width=2, dash="6 5")
    s.circle(352, 300, 16, fill=METAL, stroke=INK, width=2.4)
    s.circle(352, 360, 10, fill=METAL, stroke=INK, width=2.4)
    labels = [
        ((274, 90), "eyepiece lens", 60),
        ((284, 160), "body tube", 115),
        ((292, 240), "revolving nosepiece", 170),
        ((282, 280), "objective lenses", 225),
        ((368, 300), "coarse focus knob", 280),
        ((318, 312), "stage clip", 320),
        ((360, 325), "stage", 360),
        ((362, 360), "fine focus knob", 410),
    ]
    for (px, py), t, ty in labels:
        s.line(px, py, 500, ty, color=MUTED, width=1.3)
        s.dot(px, py, r=3, color=INK)
        s.text(508, ty, t, size=15, anchor="start")
    for (px, py), t, ty in (((230, 348), "condenser", 350), ((224, 366), "diaphragm", 392), ((218, 450), "mirror / lamp", 450)):
        s.line(px, py, 160, ty, color=MUTED, width=1.3)
        s.dot(px, py, r=3, color=INK)
        s.text(152, ty, t, size=15, anchor="end")
    s.line(212, 312, 160, 300, color=MUTED, width=1.3)
    s.text(152, 300, "slide", size=15, color=BLUE, anchor="end")
    s.line(180, 513, 160, 513, color=MUTED, width=1.3)
    s.text(152, 513, "base", size=15, anchor="end")
    return s


# ─────────────────────────────────────────────────────────────────────────────

def main(names: list[str]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    chosen = names or list(FIGS)
    for n in chosen:
        if n not in FIGS:
            raise SystemExit(f"unknown figure: {n}")
        FIGS[n]().save(OUT / f"{n}.svg")
    print(f"wrote {len(chosen)} diagram(s) to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main(sys.argv[1:])
