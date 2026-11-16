#!/usr/bin/env python3
"""Original diagrams for the Agricultural Science notes.

    python3 scripts/notes/agric_figs.py            # write every diagram
    python3 scripts/notes/agric_figs.py name ...   # write some

Each function draws one figure and returns an Svg. Files go to
public/img/agriculture/<name>.svg and lessons show them from
https://wasscetutor.com/img/agriculture/<name>.svg. All drawn by WASSCE Tutor.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from chemistry_figs import box, link  # noqa: E402
from government_figs import heading, note  # noqa: E402
from svgfig import (  # noqa: E402
    BLUE, F_AMBER, F_BLUE, F_GREEN, F_GREY, F_PURPLE, F_RED, GREEN, INK, METAL, MUTED, ORANGE, PURPLE, RED, TEAL, Svg,
)

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/img/agriculture"
FIGS: dict[str, callable] = {}
F_TEAL = "#ccfbf1"
BROWN = "#92400e"
SOIL = ["#3f2a14", "#6b4423", "#a0703c", "#c99a5b", "#9ca3af"]
WOOD = "#b45309"


def fig(fn):
    FIGS[fn.__name__.replace("_", "-")] = fn
    return fn


def pie(s: Svg, cx, cy, r, parts, label_r=0.62, size=13):
    """parts: (value, label, sublabel, fill, stroke)."""
    total = sum(p[0] for p in parts)
    a = 90.0
    for v, t, sub, fill, col in parts:
        sweep = v / total * 360
        a2 = a - sweep
        x1, y1 = cx + r * math.cos(math.radians(a)), cy - r * math.sin(math.radians(a))
        x2, y2 = cx + r * math.cos(math.radians(a2)), cy - r * math.sin(math.radians(a2))
        large = 1 if sweep > 180 else 0
        s.path(f"M {cx} {cy} L {x1:.1f} {y1:.1f} A {r} {r} 0 {large} 1 {x2:.1f} {y2:.1f} Z", color=col, width=2.2, fill=fill)
        mid = math.radians(a - sweep / 2)
        lx, ly = cx + r * label_r * math.cos(mid), cy - r * label_r * math.sin(mid)
        s.text(lx, ly - 8, t, size=size, weight="bold", color=col)
        s.text(lx, ly + 9, sub, size=size - 1, color=INK)
        a = a2


# ═══ A1: tools, machinery and soil ═══════════════════════════════════════════

@fig
def soil_profile():
    s = Svg(780, 520, "A soil profile",
            "A vertical section through soil showing its layers (horizons). At the top, the O horizon of leaf litter and "
            "humus. Below it the A horizon, the dark topsoil rich in humus, roots and organisms. Then the B horizon, the "
            "subsoil, lighter in colour, where leached minerals collect. Then the C horizon of weathered parent rock, and "
            "at the bottom the R horizon of solid bedrock.")
    heading(s, "A soil profile: the horizons from surface to bedrock")
    x0, w = 90, 280
    layers = [("O", 30, SOIL[0], "leaf litter and humus"), ("A", 110, SOIL[1], "topsoil: dark, humus, roots, organisms"),
              ("B", 120, SOIL[2], "subsoil: lighter; leached minerals collect"), ("C", 100, SOIL[3], "weathered parent rock"),
              ("R", 70, SOIL[4], "bedrock (parent rock)")]
    y = 70
    for name, h, col, desc in layers:
        s.rect(x0, y, w, h, fill=col, stroke=INK, width=1.6)
        s.text(x0 - 22, y + h / 2, name, size=20, weight="bold")
        s.line(x0 + w + 8, y + h / 2, 440, y + h / 2, color=MUTED, width=1.3)
        s.text(448, y + h / 2, desc, size=15, anchor="start")
        y += h
    for x in (130, 190, 260, 320):
        s.path(f"M {x} 100 C {x - 8} 140, {x + 10} 170, {x - 4} 215", color="#fef3c7", width=2)
    for x, yy in ((150, 400), (230, 420), (300, 395), (180, 450), (270, 455)):
        s.ellipse(x, yy, 18, 10, fill="#d1d5db", stroke=INK, width=1.2)
    for x, yy in ((120, 330), (200, 355), (310, 340), (250, 375)):
        s.ellipse(x, yy, 9, 6, fill="#e5e7eb", stroke=INK, width=1)
    s.text(x0 + w / 2, 58, "surface", size=13, color=MUTED)
    s.line(30, 80, 30, 500, color=INK, width=1.6, arrow="end")
    s.text(30, 66, "depth", size=13, color=MUTED)
    return s


@fig
def soil_composition():
    s = Svg(780, 420, "The composition of a good loam soil by volume",
            "A pie chart of an ideal loam soil by volume: about 45% mineral matter, 25% water, 25% air and 5% organic "
            "matter, which includes humus and living organisms.")
    heading(s, "What a good soil is made of (by volume)")
    pie(s, 230, 240, 150, [(45, "Mineral", "matter 45%", F_AMBER, ORANGE), (25, "Water", "25%", F_BLUE, BLUE),
                            (25, "Air", "25%", "#f1f5f9", MUTED), (5, "", "", F_GREEN, GREEN)], size=15)
    s.line(214, 94, 290, 66, color=GREEN, width=1.4)
    s.text(296, 66, "organic matter 5%", size=14, weight="bold", color=GREEN, anchor="start")
    rows = [("Mineral matter", "sand, silt and clay from weathered rock"), ("Water", "the soil solution, carrying dissolved nutrients"),
            ("Air", "oxygen for roots and soil organisms"), ("Organic matter", "humus and living organisms")]
    for k, (a, b) in enumerate(rows):
        y = 120 + k * 58
        s.text(430, y, a, size=15, weight="bold", anchor="start")
        s.text(430, y + 21, b, size=13, color=MUTED, anchor="start")
    note(s, "Water and air share the pore spaces: when one goes up, the other goes down.", 408, size=14, color=INK)
    return s


@fig
def soil_particles():
    s = Svg(780, 400, "Soil particle sizes: sand, silt and clay",
            "Three circles drawn to show relative size. Sand particles are the largest, 0.02 to 2 mm, gritty, with large "
            "pores: fast drainage, poor water holding. Silt is 0.002 to 0.02 mm, smooth and floury. Clay is smaller than "
            "0.002 mm, sticky when wet, with tiny pores: holds water and nutrients but drains slowly.")
    heading(s, "Sand, silt and clay (not to scale)")
    items = [(150, 150, 70, "Sand", "0.02–2 mm", ["gritty to touch", "large pores", "drains fast, dries fast", "holds few nutrients"], F_AMBER, ORANGE),
             (400, 150, 34, "Silt", "0.002–0.02 mm", ["smooth, floury", "medium pores", "medium drainage", "can form crusts"], F_GREY, MUTED),
             (630, 150, 12, "Clay", "below 0.002 mm", ["sticky when wet", "tiny pores", "holds water and", "nutrients; drains slowly"], F_RED, RED)]
    for x, y, r, name, size, facts, fill, col in items:
        s.circle(x, y, r, fill=fill, stroke=col, width=2.6)
        s.text(x, 50 + 22, name, size=18, weight="bold", color=col)
        s.text(x, 240, size, size=14, weight="bold")
        for k, f in enumerate(facts):
            s.text(x, 272 + k * 22, f, size=13, color=INK)
    note(s, "Loam, a mixture of all three with humus, is the best soil for most crops.", 380, size=14, color=INK)
    return s


@fig
def weathering():
    s = Svg(800, 400, "How rock weathers into soil",
            "Parent rock is broken down by three kinds of weathering. Physical weathering by heating and cooling, running "
            "water and wind breaks rock into smaller pieces. Chemical weathering by hydrolysis, oxidation, carbonation and "
            "solution changes the minerals. Biological weathering by roots, burrowing animals and microorganisms breaks "
            "rock and adds organic matter. Over time, with organic matter added, the result is soil.")
    heading(s, "Weathering: from parent rock to soil")
    rock = box(s, 400, 90, 220, 56, ["Parent rock"], col=INK, fill=F_GREY, size=17)
    kinds = [(140, ["Physical", "heating and cooling,", "running water, wind"], F_BLUE, BLUE),
             (400, ["Chemical", "hydrolysis, oxidation,", "carbonation, solution"], F_AMBER, ORANGE),
             (660, ["Biological", "roots, burrowing", "animals, microbes"], F_GREEN, GREEN)]
    mids = []
    for x, lines, fill, col in kinds:
        b = box(s, x, 210, 220, 86, lines, col=col, fill=fill, size=15)
        link(s, rock, b, color=MUTED, width=2.2)
        mids.append(b)
    soil = box(s, 400, 340, 260, 62, ["Soil", "+ humus, water, air, organisms"], col=BROWN, fill="#fde68a", size=16)
    for b in mids:
        link(s, b, soil, color=MUTED, width=2.2)
    return s


@fig
def npk_roles():
    s = Svg(800, 380, "Roles of nitrogen, phosphorus and potassium in plants",
            "Nitrogen: leaf and stem growth and dark green colour; lack causes yellowing of older leaves and stunting. "
            "Phosphorus: root growth, flowering, fruit and seed formation and early maturity; lack causes purplish leaves "
            "and poor roots. Potassium: strong stems, disease resistance, fruit and tuber quality; lack causes scorched "
            "leaf edges and weak stems.")
    heading(s, "N, P and K: what each nutrient does")
    cols = [("N", "Nitrogen", ["leaf and stem growth", "dark green colour", "protein making"], ["older leaves turn yellow", "stunted, spindly growth"], GREEN, F_GREEN),
            ("P", "Phosphorus", ["root growth", "flowering, seeds, fruits", "early maturity"], ["purplish leaves", "poor roots, late maturity"], ORANGE, F_AMBER),
            ("K", "Potassium", ["strong stems", "disease resistance", "fruit and tuber quality"], ["scorched leaf edges", "weak stems, lodging"], PURPLE, F_PURPLE)]
    for k, (sym, name, does, lack, col, fill) in enumerate(cols):
        x = 140 + k * 260
        s.rect(x - 115, 60, 230, 300, fill=fill, stroke=col, width=2.4, rx=14)
        s.circle(x, 104, 30, fill="#ffffff", stroke=col, width=3)
        s.text(x, 105, sym, size=26, weight="bold", color=col)
        s.text(x, 154, name, size=17, weight="bold", color=col)
        for j, t in enumerate(does):
            s.text(x, 186 + j * 22, t, size=14)
        s.text(x, 268, "If lacking:", size=14, weight="bold", color=RED)
        for j, t in enumerate(lack):
            s.text(x, 292 + j * 22, t, size=13)
    return s


@fig
def tillage_sequence():
    s = Svg(800, 330, "The order of land preparation and crop operations, with tools and implements",
            "Clearing with cutlass, axe or bulldozer; ploughing (primary tillage) with hoe or disc plough; harrowing "
            "(secondary tillage) with rake or harrow; ridging or making beds with hoe or ridger; planting with planting "
            "stick or planter; weeding with hoe or herbicide sprayer; harvesting with sickle, cutlass or combine harvester.")
    heading(s, "From bush to harvest: operations and the tools for each")
    steps = [("Clearing", "cutlass, axe", "bulldozer"), ("Ploughing", "hoe, mattock", "disc plough"), ("Harrowing", "rake", "disc harrow"),
             ("Ridging", "hoe", "ridger"), ("Planting", "dibber, stick", "planter, drill"), ("Weeding", "hoe, cutlass", "sprayer"),
             ("Harvesting", "sickle, cutlass", "combine")]
    prev = None
    for k, (t, hand, mach) in enumerate(steps):
        x = 60 + k * 113
        b = box(s, x, 150, 100, 70, [t], col=GREEN, fill=F_GREEN, size=14)
        if prev:
            link(s, prev, b, color=INK, width=2.2, gap=3)
        s.text(x, 212, hand, size=12, color=BROWN)
        s.text(x, 250, mach, size=12, color=BLUE)
        prev = b
    s.text(20, 212, "", size=1)
    s.rect(240, 280, 14, 14, fill=BROWN, stroke=BROWN, width=1)
    s.text(262, 288, "hand tool", size=13, anchor="start")
    s.rect(420, 280, 14, 14, fill=BLUE, stroke=BLUE, width=1)
    s.text(442, 288, "machine / implement", size=13, anchor="start")
    s.text(400, 92, "primary tillage = ploughing;  secondary tillage = harrowing, ridging", size=13, color=MUTED)
    return s


@fig
def erosion_control():
    s = Svg(800, 420, "Ridges up and down a slope compared with contour ridges and terraces",
            "Left: ridges made up and down the slope channel rain water straight downhill, so it runs fast and carries "
            "soil away. Middle: contour ridges made across the slope hold the water so it soaks in. Right: terraces cut "
            "into a steep hillside as level steps slow water and hold soil.")
    heading(s, "Farming slopes: wrong way and right ways")

    def slope(x0, title, col):
        s.polygon([(x0, 340), (x0 + 230, 340), (x0 + 230, 140)], fill="#fde68a", stroke=BROWN, width=2)
        s.text(x0 + 115, 90, title, size=15, weight="bold", color=col)
    slope(20, "Up and down the slope", RED)
    for k in range(5):
        x = 70 + k * 36
        s.line(x, 340, x + 4 + (x - 20) * 0.0, 340 - (x - 20) * 200 / 230, color=BROWN, width=3)
    s.arrow(200, 190, 120, 320, color=BLUE, width=3)
    s.text(135, 375, "water rushes down,", size=13, color=RED)
    s.text(135, 393, "carrying soil", size=13, color=RED)
    slope(285, "Contour ridges", GREEN)
    for k in range(5):
        y = 330 - k * 38
        x_left = 285 + (340 - y) * 230 / 200
        s.line(x_left, y, 515, y, color=GREEN, width=4)
    s.text(400, 375, "ridges follow the contour:", size=13, color=GREEN)
    s.text(400, 393, "water soaks in", size=13, color=GREEN)
    x0 = 550
    pts = [(x0, 340)]
    for k in range(5):
        y = 340 - k * 40
        pts += [(x0 + 30 + k * 40, y), (x0 + 30 + k * 40, y - 40)]
    pts += [(x0 + 230, 140), (x0 + 230, 340)]
    s.polygon(pts, fill="#fde68a", stroke=BROWN, width=2)
    s.text(x0 + 115, 90, "Terraces", size=15, weight="bold", color=GREEN)
    s.text(x0 + 115, 375, "level steps on steep", size=13, color=GREEN)
    s.text(x0 + 115, 393, "slopes hold soil", size=13, color=GREEN)
    return s


def tool_icon(s, kind, x, y):
    """Small line drawings of hand tools centred at x, y."""
    if kind == "cutlass":
        s.rect(x - 70, y - 6, 34, 12, fill=WOOD, stroke=INK, width=1.6, rx=4)
        s.path(f"M {x - 36} {y - 7} L {x + 50} {y - 14} Q {x + 72} {y - 12} {x + 66} {y + 2} L {x - 36} {y + 7} Z", color=INK, width=1.8, fill=METAL)
    elif kind == "hoe":
        s.line(x - 70, y + 30, x + 40, y - 30, color=WOOD, width=7)
        s.polygon([(x + 34, y - 34), (x + 48, y - 40), (x + 72, y + 8), (x + 44, y + 16)], fill=METAL, stroke=INK, width=1.8)
    elif kind == "shovel":
        s.line(x, y - 60, x, y + 20, color=WOOD, width=7)
        s.rect(x - 14, y - 70, 28, 12, fill=WOOD, stroke=INK, width=1.4, rx=4)
        s.path(f"M {x - 24} {y + 18} L {x + 24} {y + 18} L {x + 20} {y + 52} Q {x} {y + 66} {x - 20} {y + 52} Z", color=INK, width=1.8, fill=METAL)
    elif kind == "rake":
        s.line(x, y - 60, x, y + 30, color=WOOD, width=6)
        s.rect(x - 40, y + 28, 80, 8, fill=METAL, stroke=INK, width=1.6)
        for k in range(9):
            s.line(x - 36 + k * 9, y + 36, x - 36 + k * 9, y + 52, color=INK, width=2.2)
    elif kind == "sickle":
        s.rect(x - 6, y + 10, 12, 44, fill=WOOD, stroke=INK, width=1.6, rx=4)
        s.path(f"M {x} {y + 10} C {x - 10} {y - 40}, {x + 60} {y - 60}, {x + 56} {y - 6} C {x + 46} {y - 36}, {x + 10} {y - 30}, {x} {y + 10} Z", color=INK, width=1.8, fill=METAL)
    elif kind == "pickaxe":
        s.line(x, y - 20, x, y + 60, color=WOOD, width=7)
        s.path(f"M {x - 60} {y - 4} Q {x} {y - 40} {x + 60} {y - 4} L {x + 56} {y + 2} Q {x} {y - 26} {x - 56} {y + 2} Z", color=INK, width=1.8, fill=METAL)
    elif kind == "watering":
        s.rect(x - 34, y - 20, 56, 50, fill=F_GREEN, stroke=GREEN, width=2.2, rx=6)
        s.line(x + 20, y + 20, x + 64, y - 22, color=GREEN, width=6)
        s.ellipse(x + 68, y - 26, 10, 6, fill=F_GREEN, stroke=GREEN, width=2)
        s.path(f"M {x - 30} {y - 18} Q {x - 6} {y - 56} {x + 18} {y - 18}", color=GREEN, width=4)
    elif kind == "sprayer":
        s.rect(x - 30, y - 40, 50, 76, fill=F_BLUE, stroke=BLUE, width=2.2, rx=10)
        s.line(x - 30, y - 20, x - 50, y - 40, color=INK, width=4)
        s.path(f"M {x + 10} {y + 30} C {x + 40} {y + 50}, {x + 50} {y + 10}, {x + 46} {y - 10} L {x + 72} {y - 30}", color=INK, width=2.6)
        s.circle(x + 75, y - 32, 4, fill=INK, stroke=INK, width=1)


@fig
def hand_tools():
    s = Svg(800, 470, "Common farm hand tools",
            "Eight hand tools: the cutlass for clearing and weeding; the hoe for tilling, ridging and weeding; the shovel "
            "for digging and moving soil; the rake for levelling and collecting trash; the sickle for harvesting rice and "
            "grass; the pickaxe for breaking hard ground; the watering can for watering nurseries; and the knapsack "
            "sprayer for applying pesticides.")
    heading(s, "Common hand tools and their uses")
    tools = [("cutlass", "Cutlass", "clearing, weeding"), ("hoe", "Hoe", "tilling, ridging"), ("shovel", "Shovel", "digging, moving soil"),
             ("rake", "Rake", "levelling, gathering"), ("sickle", "Sickle", "harvesting rice"), ("pickaxe", "Pickaxe", "breaking hard ground"),
             ("watering", "Watering can", "watering nurseries"), ("sprayer", "Knapsack sprayer", "applying pesticides")]
    for k, (kind, name, use) in enumerate(tools):
        col, row = k % 4, k // 4
        x, y = 100 + col * 200, 150 + row * 200
        s.rect(x - 90, y - 90, 180, 186, fill="#ffffff", stroke="#cbd5e1", width=1.4, rx=12)
        tool_icon(s, kind, x, y - 10)
        s.text(x, y + 66, name, size=15, weight="bold")
        s.text(x, y + 86, use, size=12, color=MUTED)
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
