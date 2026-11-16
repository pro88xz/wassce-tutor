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


# ═══ A2: crop production ════════════════════════════════════════════════════

@fig
def crop_classification():
    s = Svg(800, 470, "Classification of crops by use",
            "Ten groups of crops with Sierra Leone examples: cereals (rice, maize, sorghum, millet); legumes (groundnut, "
            "cowpea, soya bean); roots and tubers (cassava, sweet potato, yam, cocoyam); vegetables (pepper, okra, garden "
            "egg, krain-krain, potato leaves); fruits (mango, orange, pineapple, plantain); beverages (cocoa, coffee); oil "
            "crops (oil palm, coconut); spices (ginger, pepper); fibre (cotton); latex (rubber).")
    heading(s, "Crops grouped by use, with local examples")
    groups = [("Cereals", "rice, maize, sorghum, millet", F_AMBER, ORANGE), ("Legumes", "groundnut, cowpea, soya bean", F_GREEN, GREEN),
              ("Roots and tubers", "cassava, sweet potato, yam", F_RED, RED), ("Vegetables", "pepper, okra, garden egg, krain-krain", F_GREEN, TEAL),
              ("Fruits", "mango, orange, pineapple, plantain", F_AMBER, ORANGE), ("Beverages", "cocoa, coffee", F_PURPLE, PURPLE),
              ("Oil crops", "oil palm, coconut", F_AMBER, BROWN), ("Spices", "ginger, pepper", F_RED, RED),
              ("Fibre", "cotton", F_GREY, MUTED), ("Latex", "rubber", F_BLUE, BLUE)]
    for k, (name, ex, fill, col) in enumerate(groups):
        c, r = k % 2, k // 2
        x, y = 205 + c * 390, 100 + r * 76
        box(s, x, y, 360, 62, [name, ex], col=col, fill=fill, size=15)
    return s


@fig
def propagation_methods():
    s = Svg(800, 430, "Methods of plant propagation",
            "Plants are propagated sexually by seeds, or asexually (vegetatively). Natural vegetative organs include "
            "stem tubers (yam, Irish potato), rhizomes (ginger), bulbs (onion), corms (cocoyam), suckers (plantain, "
            "pineapple) and runners (grasses). Artificial methods include cuttings (cassava, sugarcane, sweet potato vines), "
            "layering, budding (citrus), grafting (mango) and tissue culture.")
    heading(s, "Plant propagation: by seed or vegetatively")
    top = box(s, 400, 80, 220, 50, ["Plant propagation"], col=INK, fill="#ffffff", size=16)
    sex = box(s, 170, 180, 260, 70, ["Sexual: seeds", "maize, rice, cocoa, tomato"], col=GREEN, fill=F_GREEN, size=15)
    asx = box(s, 600, 180, 300, 70, ["Asexual (vegetative)", "a part of the parent plant"], col=ORANGE, fill=F_AMBER, size=15)
    link(s, top, sex, color=MUTED, width=2.2)
    link(s, top, asx, color=MUTED, width=2.2)
    nat = box(s, 455, 330, 250, 130, ["Natural organs", "tubers: yam", "rhizomes: ginger", "corms: cocoyam", "suckers: plantain, pineapple"], col=BROWN, fill="#fef3c7", size=14)
    art = box(s, 690, 330, 200, 130, ["Artificial", "cuttings: cassava", "layering", "budding: citrus", "grafting: mango"], col=PURPLE, fill=F_PURPLE, size=14)
    link(s, asx, nat, color=MUTED, width=2.2)
    link(s, asx, art, color=MUTED, width=2.2)
    s.text(170, 262, "+ seeds are cheap, easy to", size=13, color=GREEN)
    s.text(170, 280, "store and transport", size=13, color=GREEN)
    s.text(170, 312, "− offspring may differ from", size=13, color=RED)
    s.text(170, 330, "the parents; slower to mature", size=13, color=RED)
    return s


@fig
def budding_grafting():
    s = Svg(800, 440, "Budding and grafting",
            "Left, T-budding: a T-shaped cut is made in the bark of the rootstock, a bud with a shield of bark is cut "
            "from the scion plant, slipped under the bark, and tied firmly with budding tape. Right, cleft grafting: the "
            "rootstock is cut off and split down the middle, a scion shoot is cut to a wedge, inserted in the cleft so "
            "the cambium layers meet, and tied and sealed.")
    heading(s, "Budding (citrus) and grafting (mango)")
    # budding panel
    s.text(200, 70, "T-budding", size=16, weight="bold", color=GREEN)
    s.rect(75, 120, 30, 260, fill="#a16207", stroke=BROWN, width=2)
    s.line(80, 200, 100, 200, color=INK, width=2.4)
    s.line(90, 200, 90, 240, color=INK, width=2.4)
    s.text(90, 400, "1. T-cut in", size=12)
    s.text(90, 418, "the bark", size=12)
    s.path("M 200 170 Q 216 205 200 240 Q 184 205 200 170 Z", color=GREEN, width=2, fill=F_GREEN)
    s.circle(200, 205, 5, fill=GREEN, stroke=GREEN, width=1)
    s.text(200, 400, "2. bud cut with", size=12)
    s.text(200, 418, "a bark shield", size=12)
    s.rect(295, 120, 30, 260, fill="#a16207", stroke=BROWN, width=2)
    for y in range(190, 252, 9):
        s.line(293, y, 327, y + 4, color=PURPLE, width=3)
    s.circle(310, 218, 5, fill=GREEN, stroke=GREEN, width=1)
    s.text(310, 400, "3. inserted,", size=12)
    s.text(310, 418, "tied with tape", size=12)
    s.line(400, 70, 400, 420, color="#cbd5e1", width=1.4, dash="6 6")
    # grafting panel
    s.text(600, 70, "Cleft grafting", size=16, weight="bold", color=ORANGE)
    s.rect(470, 200, 40, 180, fill="#a16207", stroke=BROWN, width=2)
    s.line(490, 200, 490, 250, color=INK, width=2.4)
    s.text(490, 400, "1. stock cut", size=13)
    s.text(490, 418, "and split", size=13)
    s.polygon([(580, 120), (600, 120), (600, 230), (590, 270), (580, 230)], fill=F_GREEN, stroke=GREEN, width=2)
    for y in (140, 170):
        s.line(600, y, 618, y - 10, color=GREEN, width=2)
    s.text(590, 400, "2. scion cut", size=13)
    s.text(590, 418, "to a wedge", size=13)
    s.rect(670, 230, 40, 150, fill="#a16207", stroke=BROWN, width=2)
    s.polygon([(680, 110), (700, 110), (700, 250), (690, 285), (680, 250)], fill=F_GREEN, stroke=GREEN, width=2)
    for y in range(232, 262, 8):
        s.line(668, y, 712, y + 3, color=PURPLE, width=3)
    s.text(690, 400, "3. inserted,", size=13)
    s.text(690, 418, "tied, sealed", size=13)
    s.text(790, 160, "scion", size=13, color=GREEN, anchor="end")
    s.text(790, 330, "rootstock", size=13, color=BROWN, anchor="end")
    return s


@fig
def rice_ecologies():
    s = Svg(800, 400, "Rice-growing ecologies of Sierra Leone from hill to coast",
            "A cross-section of the landscape. Upland rice is grown on free-draining slopes, depending on rain. Inland "
            "valley swamps lie in the valley bottoms between hills and stay wet. Bolilands and riverine grasslands are "
            "flat plains flooded in the rainy season. Mangrove swamps are on the coast, flooded by tides.")
    heading(s, "Where rice grows: upland to mangrove")
    pts = [(20, 330), (20, 150), (90, 120), (170, 150), (230, 260), (280, 280), (330, 260), (380, 190), (420, 210), (450, 280),
           (600, 290), (640, 300), (700, 305), (780, 310), (780, 330)]
    s.polygon(pts, fill="#fde68a", stroke=BROWN, width=2.4)
    s.rect(230, 268, 100, 12, fill="#93c5fd", stroke="none", width=0, opacity=0.9)
    s.rect(450, 278, 190, 10, fill="#93c5fd", stroke="none", width=0, opacity=0.7)
    s.rect(640, 290, 140, 14, fill="#60a5fa", stroke="none", width=0, opacity=0.7)
    for x, y in ((60, 132), (110, 128), (150, 142)):
        s.line(x, y, x, y - 18, color=GREEN, width=2.4)
    labels = [(100, 90, "Upland", "rain-fed slopes", ORANGE), (280, 220, "Inland valley", "swamp", BLUE),
              (545, 240, "Boliland /", "riverine grassland", TEAL), (710, 250, "Mangrove", "swamp", PURPLE)]
    for x, y, a, b, col in labels:
        s.text(x, y, a, size=15, weight="bold", color=col)
        s.text(x, y + 18, b, size=13, color=col)
    s.text(780, 360, "sea", size=13, color=BLUE, anchor="end")
    note(s, "Upland: low yields, needs fallow. Swamps: wetter, more fertile, cropped every year.", 385, size=14, color=INK)
    return s


@fig
def cropping_calendar():
    s = Svg(800, 360, "A cropping calendar for upland rice in Sierra Leone",
            "A timeline across the year. The dry season runs from about November to April and the rainy season from "
            "about May to October. Brushing and felling take place from January to March, clearing and land preparation "
            "in March and April, planting in May and June at the start of the rains, weeding in June to August, bird "
            "scaring in August and September, and harvesting from September to November.")
    heading(s, "Cropping calendar: upland rice")
    months = "J F M A M J J A S O N D".split()
    x0, w = 170, 50
    for k, m in enumerate(months):
        s.text(x0 + k * w + w / 2, 70, m, size=14, weight="bold")
    s.rect(x0, 82, 4 * w, 14, fill=F_AMBER, stroke="none", width=0)
    s.rect(x0 + 4 * w, 82, 6 * w, 14, fill=F_BLUE, stroke="none", width=0)
    s.rect(x0 + 10 * w, 82, 2 * w, 14, fill=F_AMBER, stroke="none", width=0)
    s.text(x0 + 2 * w, 105, "dry season", size=12, color=ORANGE)
    s.text(x0 + 7 * w, 105, "rainy season", size=12, color=BLUE)
    ops = [("Brushing, felling", 0, 3, BROWN), ("Land preparation", 2, 4, ORANGE), ("Planting", 4, 6, GREEN),
           ("Weeding", 5, 8, TEAL), ("Bird scaring", 7, 9, PURPLE), ("Harvesting", 8, 11, RED)]
    for k, (name, a, b, col) in enumerate(ops):
        y = 140 + k * 34
        s.text(x0 - 10, y, name, size=13, anchor="end", weight="bold", color=col)
        s.rect(x0 + a * w + 2, y - 11, (b - a) * w - 4, 22, fill=col, stroke=col, width=1, rx=6, opacity=0.85)
    for k in range(13):
        s.line(x0 + k * w, 120, x0 + k * w, 345, color="#e2e8f0", width=1)
    return s


@fig
def oil_palm_types():
    s = Svg(800, 380, "Dura, Pisifera and Tenera oil palm fruits",
            "Cross-sections of oil palm fruits. Dura has a thick shell and thin mesocarp (less oil). Pisifera has no "
            "shell, but its female flowers are usually sterile so it gives few bunches. Tenera, the hybrid of Dura and "
            "Pisifera, has a thin shell and a thick, oily mesocarp, so it is the type planted for high oil yield.")
    heading(s, "Oil palm fruit types: Dura × Pisifera = Tenera")
    items = [(140, "Dura (D)", 20, 22, "thick shell, thin pulp"), (400, "Pisifera (P)", 0, 52, "no shell; mostly sterile"),
             (660, "Tenera (D × P)", 7, 42, "thin shell, thick oily pulp")]
    for x, name, shell, pulp, note_t in items:
        cy = 190
        r_k = 26
        r_s = r_k + shell
        r_p = r_s + pulp
        s.circle(x, cy, r_p, fill="#fdba74", stroke=ORANGE, width=2.4)
        if shell:
            s.circle(x, cy, r_s, fill="#57534e", stroke=INK, width=2)
        s.circle(x, cy, r_k, fill="#f5f5f4", stroke=INK, width=2)
        s.text(x, 80, name, size=16, weight="bold")
        s.text(x, 300, note_t, size=14)
    s.text(140, 330, "kernel (white) · shell (dark) · mesocarp/pulp (orange)", size=12, color=MUTED, anchor="start")
    s.text(660, 330, "planted for high oil yield", size=13, weight="bold", color=GREEN)
    return s


@fig
def weed_control_methods():
    s = Svg(800, 440, "Methods of weed control",
            "Integrated weed management in the centre, linked to five methods: preventive (clean seed and tools), cultural "
            "(correct spacing, cover crops, mulching, rotation, flooding rice), mechanical (hand pulling, hoeing, slashing, "
            "tillage), chemical (herbicides, selective or non-selective, pre- or post-emergence) and biological (insects, "
            "grazing animals, fungi).")
    heading(s, "Weed control: combine methods for best results")
    c = box(s, 400, 240, 220, 70, ["Integrated weed", "management"], col=INK, fill="#ffffff", size=16)
    items = [((150, 110), ["Preventive", "clean seed, clean tools,", "weed-free manure"], F_BLUE, BLUE),
             ((650, 110), ["Cultural", "spacing, cover crops,", "mulch, rotation, flooding"], F_GREEN, GREEN),
             ((130, 370), ["Mechanical", "hand pulling, hoeing,", "slashing, tillage"], F_AMBER, ORANGE),
             ((670, 370), ["Chemical", "herbicides: selective", "or non-selective"], F_RED, RED),
             ((400, 400), ["Biological", "insects, grazing, fungi"], F_PURPLE, PURPLE)]
    for (x, y), lines, fill, col in items:
        b = box(s, x, y, 230, 86 if len(lines) == 3 else 62, lines, col=col, fill=fill, size=14)
        link(s, c, b, color=MUTED, width=2.2)
    return s


# ═══ A3: crop protection, improvement, storage and forestry ════════════════

def cycle(s, cx, cy, r, stages, col, fill, w=120, h=50):
    n = len(stages)
    pts = []
    for k, t in enumerate(stages):
        a = math.radians(90 - k * 360 / n)
        x, y = cx + r * math.cos(a), cy - r * math.sin(a)
        pts.append(box(s, x, y, w, h, t if isinstance(t, list) else [t], col=col, fill=fill, size=14))
    for k in range(n):
        link(s, pts[k], pts[(k + 1) % n], color=INK, width=2.2)


@fig
def insect_life_cycles():
    s = Svg(800, 420, "Complete and incomplete metamorphosis in insect pests",
            "Left: complete metamorphosis, as in the stem borer moth, beetles and armyworm: egg, larva (caterpillar or "
            "grub), pupa and adult. The larva usually does the damage. Right: incomplete metamorphosis, as in the "
            "grasshopper, aphids and bugs: egg, nymph (a small wingless adult) and adult. Nymphs and adults both feed on "
            "crops.")
    heading(s, "Insect life cycles: where the damage is done")
    s.text(200, 70, "Complete metamorphosis", size=16, weight="bold", color=ORANGE)
    s.text(200, 92, "moths, beetles, armyworm", size=13, color=MUTED)
    cycle(s, 200, 250, 110, ["Egg", ["Larva", "feeds: damage!"], "Pupa", "Adult"], ORANGE, F_AMBER, w=130)
    s.text(600, 70, "Incomplete metamorphosis", size=16, weight="bold", color=GREEN)
    s.text(600, 92, "grasshoppers, aphids, bugs", size=13, color=MUTED)
    cycle(s, 600, 250, 100, ["Egg", ["Nymph", "feeds"], ["Adult", "feeds"]], GREEN, F_GREEN, w=120)
    note(s, "Control is easiest at the stage that does the damage, while it is young.", 405, size=14, color=INK)
    return s


@fig
def seed_multiplication():
    s = Svg(800, 300, "From plant breeding to the farmer's field: classes of seed",
            "A breeder develops and tests a new variety. Breeder seed, produced in small amounts by the breeding "
            "institute, is multiplied to foundation seed, then to certified seed by approved seed growers under "
            "inspection. Certified seed is sold to farmers, who grow the crop for food and sale.")
    heading(s, "Seed classes: from breeder to farmer")
    steps = [("New variety", "bred and tested", F_PURPLE, PURPLE), ("Breeder seed", "small amount, pure", F_BLUE, BLUE),
             ("Foundation seed", "multiplied", F_TEAL, TEAL), ("Certified seed", "inspected, labelled", F_GREEN, GREEN),
             ("Farmers", "grow the crop", F_AMBER, ORANGE)]
    prev = None
    for k, (t, sub, fill, col) in enumerate(steps):
        b = box(s, 85 + k * 157, 150, 140, 80, [t, sub], col=col, fill=fill, size=14)
        if prev:
            link(s, prev, b, color=INK, width=2.4)
        prev = b
    note(s, "Each step is checked for purity, germination and freedom from disease.", 250, size=14, color=INK)
    return s


@fig
def postharvest_chain():
    s = Svg(800, 330, "Post-harvest operations for grain and where losses happen",
            "Harvesting, threshing, cleaning and winnowing, drying, grading and packaging, storage, and transport and "
            "marketing. Losses occur at each step: shattering and birds at harvest, spillage and broken grains in "
            "threshing, mould if drying is poor, insects and rats in storage, and damage in transport.")
    heading(s, "Post-harvest operations and the losses at each step")
    steps = [("Harvest", "shattering, birds"), ("Thresh", "spillage, breakage"), ("Clean", "chaff, stones"),
             ("Dry", "mould if damp"), ("Grade, pack", "poor bags"), ("Store", "insects, rats"), ("Market", "transport damage")]
    prev = None
    for k, (t, loss) in enumerate(steps):
        x = 60 + k * 113
        b = box(s, x, 140, 100, 60, [t], col=GREEN, fill=F_GREEN, size=14)
        if prev:
            link(s, prev, b, color=INK, width=2.2, gap=3)
        s.arrow(x, 172, x, 214, color=RED, width=2)
        s.text(x, 232, loss.split(",")[0], size=12, color=RED)
        if "," in loss:
            s.text(x, 248, loss.split(",")[1].strip(), size=12, color=RED)
        prev = b
    note(s, "Safe moisture for storing most grain: about 12–14%.", 300, size=15, color=INK)
    return s


@fig
def storage_structures():
    s = Svg(800, 450, "Grain storage structures",
            "Three ways to store grain. A crib for maize cobs: a narrow, raised, slatted store with a roof, standing on "
            "legs fitted with metal rat guards, letting air dry the cobs. A hermetic bag: two airtight plastic liners "
            "inside a woven bag; insects inside die from lack of oxygen. A metal or concrete silo with a sealed lid for "
            "larger quantities.")
    heading(s, "Storage structures: keep grain dry, cool and pest-free")
    # crib
    s.polygon([(70, 120), (150, 80), (230, 120)], fill="#a16207", stroke=INK, width=2)
    s.rect(90, 120, 120, 170, fill="#fef3c7", stroke=BROWN, width=2.4)
    for x in range(100, 210, 14):
        s.line(x, 120, x, 290, color=BROWN, width=2)
    for y in range(140, 290, 22):
        for x in range(104, 200, 28):
            s.ellipse(x + 8, y, 12, 7, fill="#facc15", stroke=ORANGE, width=1.2)
    for x in (100, 200):
        s.line(x, 290, x, 360, color=BROWN, width=6)
        s.polygon([(x - 22, 326), (x + 22, 326), (x + 10, 312), (x - 10, 312)], fill=METAL, stroke=INK, width=1.6)
    s.text(150, 70, "Maize crib", size=15, weight="bold", color=ORANGE)
    s.text(150, 402, "raised, airy, roofed;", size=13)
    s.text(150, 420, "metal rat guards on legs", size=13)
    # hermetic bag
    s.path("M 330 150 L 470 150 L 480 350 Q 400 370 320 350 Z", color=MUTED, width=2.6, fill="#e2e8f0")
    s.path("M 342 162 L 458 162 L 466 340 Q 400 356 334 340 Z", color=BLUE, width=2, fill="#dbeafe")
    s.path("M 352 174 L 448 174 L 454 330 Q 400 344 346 330 Z", color=BLUE, width=2, fill="#fef9c3")
    s.line(350, 150, 450, 150, color=INK, width=3)
    s.text(400, 250, "grain", size=14, weight="bold", color=BROWN)
    s.text(400, 120, "Hermetic bag", size=15, weight="bold", color=BLUE)
    s.text(400, 402, "two airtight liners:", size=13)
    s.text(400, 420, "insects die without oxygen", size=13)
    # silo
    s.rect(580, 150, 140, 200, fill=F_GREY, stroke=INK, width=2.4)
    s.path("M 580 150 Q 650 90 720 150", color=INK, width=2.4, fill=F_GREY)
    s.rect(640, 108, 20, 12, fill=METAL, stroke=INK, width=1.6)
    s.polygon([(620, 350), (680, 350), (660, 380), (640, 380)], fill=METAL, stroke=INK, width=1.6)
    s.text(650, 80, "Silo", size=15, weight="bold", color=MUTED)
    s.text(650, 402, "sealed metal or concrete;", size=13)
    s.text(650, 420, "large quantities", size=13)
    return s


@fig
def alley_cropping():
    s = Svg(800, 430, "Alley cropping: crops grown between rows of leguminous trees",
            "A plan view of a field. Rows of leguminous trees such as Gliricidia or Leucaena run along the contour, about "
            "4 to 6 metres apart. Food crops such as maize and cassava grow in the alleys between them. The trees are "
            "pruned regularly; the prunings are spread as mulch and green manure, adding nitrogen and organic matter.")
    heading(s, "Alley cropping (an agroforestry system)")
    s.circle(150, 68, 10, fill=F_GREEN, stroke=GREEN, width=2)
    s.text(168, 68, "leguminous trees (Gliricidia, Leucaena)", size=13, anchor="start")
    s.line(520, 60, 520, 78, color="#ca8a04", width=3)
    s.line(520, 66, 527, 60, color=GREEN, width=2)
    s.text(536, 68, "food crops in the alleys", size=13, anchor="start")
    for k in range(4):
        y = 110 + k * 84
        for x in range(60, 760, 34):
            s.circle(x, y, 12, fill=F_GREEN, stroke=GREEN, width=2)
        if k < 3:
            for x in range(80, 740, 28):
                s.line(x, y + 28, x, y + 56, color="#ca8a04", width=3)
                s.line(x, y + 36, x + 7, y + 30, color=GREEN, width=2)
                s.line(x, y + 44, x - 7, y + 38, color=GREEN, width=2)
    s.line(780, 110, 780, 194, color=INK, width=1.4, arrow="both")
    s.text(774, 152, "4–6 m", size=12, anchor="end", weight="bold")
    note(s, "Prunings are spread in the alleys as mulch and green manure.", 418, size=14, color=INK)
    return s


# ═══ A4: farm animals ═══════════════════════════════════════════════════════

@fig
def farm_animal_classes():
    s = Svg(800, 400, "Classification of farm animals",
            "Farm animals are classified by digestive system and by use. Ruminants, with a four-chambered stomach, include "
            "cattle, sheep and goats. Non-ruminants (monogastrics) include pigs and rabbits; poultry such as chickens, "
            "ducks and turkeys have a crop and gizzard. By use: meat (cattle, goats, pigs, broilers), milk (cattle, "
            "goats), eggs (layers), draught power (oxen, donkeys), and wool or skins (sheep, goats).")
    heading(s, "Farm animals: by digestive system and by use")
    top = box(s, 400, 80, 200, 46, ["Farm animals"], col=INK, fill="#ffffff", size=16)
    a = box(s, 140, 190, 230, 80, ["Ruminants", "four-chambered stomach", "cattle, sheep, goats"], col=GREEN, fill=F_GREEN, size=14)
    b = box(s, 400, 190, 230, 80, ["Non-ruminants", "simple stomach", "pigs, rabbits"], col=ORANGE, fill=F_AMBER, size=14)
    c = box(s, 660, 190, 230, 80, ["Poultry", "crop and gizzard", "chickens, ducks, turkeys"], col=PURPLE, fill=F_PURPLE, size=14)
    for x in (a, b, c):
        link(s, top, x, color=MUTED, width=2.2)
    uses = [("Meat", "cattle, goats, pigs, broilers"), ("Milk", "cattle, goats"), ("Eggs", "layers, ducks"),
            ("Draught", "oxen, donkeys"), ("Skins, wool", "goats, sheep")]
    s.text(400, 288, "By use", size=15, weight="bold", color=MUTED)
    for k, (t, ex) in enumerate(uses):
        box(s, 85 + k * 157, 345, 145, 62, [t, ex], col=BLUE, fill=F_BLUE, size=13)
    return s


@fig
def ruminant_stomach():
    s = Svg(800, 440, "The four-chambered stomach of a ruminant",
            "Food swallowed by a cow passes down the oesophagus into the rumen, the largest chamber, where microbes "
            "ferment cellulose. The reticulum, with a honeycomb lining, forms the cud, which is brought back up to be "
            "chewed again (rumination). Re-swallowed food passes to the omasum, which absorbs water, and then to the "
            "abomasum, the true stomach, which secretes digestive enzymes and acid, before going to the small intestine.")
    heading(s, "The ruminant stomach: four chambers")
    s.path("M 120 170 C 120 100, 360 90, 380 170 C 400 250, 380 340, 250 350 C 130 360, 110 260, 120 170 Z",
           color=GREEN, width=3, fill=F_GREEN)
    s.text(250, 230, "RUMEN", size=18, weight="bold", color=GREEN)
    s.text(250, 254, "microbes ferment", size=13)
    s.text(250, 272, "cellulose", size=13)
    s.circle(430, 160, 52, fill=F_AMBER, stroke=ORANGE, width=3)
    s.text(430, 154, "RETICULUM", size=13, weight="bold", color=ORANGE)
    s.text(430, 172, "forms the cud", size=12)
    s.ellipse(500, 280, 60, 45, fill=F_BLUE, stroke=BLUE, width=3)
    s.text(500, 274, "OMASUM", size=13, weight="bold", color=BLUE)
    s.text(500, 292, "absorbs water", size=12)
    s.path("M 560 280 C 640 260, 700 300, 690 350 C 680 400, 600 390, 560 330 Z", color=PURPLE, width=3, fill=F_PURPLE)
    s.text(630, 330, "ABOMASUM", size=13, weight="bold", color=PURPLE)
    s.text(630, 348, "true stomach", size=12)
    s.line(300, 60, 380, 120, color=INK, width=6)
    s.text(270, 56, "oesophagus", size=13, anchor="end")
    s.arrow(372, 108, 338, 150, color=RED, width=2.4)
    s.arrow(420, 110, 380, 70, color=RED, width=2.4)
    s.text(392, 64, "cud up for", size=12, color=RED, anchor="start")
    s.text(392, 80, "rechewing", size=12, color=RED, anchor="start")
    s.line(690, 350, 760, 360, color=INK, width=6)
    s.text(760, 384, "to small intestine", size=12, anchor="end")
    return s


@fig
def fowl_digestive():
    s = Svg(800, 300, "The digestive system of the domestic fowl",
            "Food passes from the beak down the oesophagus to the crop, where it is stored and softened; to the "
            "proventriculus, which secretes enzymes and acid; to the gizzard, which grinds food with grit; then through "
            "the small intestine, where digestion and absorption take place, to the caeca and large intestine, and out "
            "through the cloaca.")
    heading(s, "The fowl's digestive system")
    parts = [("Beak", "picks food", F_GREY, INK), ("Crop", "stores, softens", F_AMBER, ORANGE),
             ("Proventriculus", "enzymes, acid", F_RED, RED), ("Gizzard", "grinds with grit", F_PURPLE, PURPLE),
             ("Small intestine", "digests, absorbs", F_GREEN, GREEN), ("Caeca, large int.", "water absorbed", F_BLUE, BLUE),
             ("Cloaca", "droppings out", F_GREY, MUTED)]
    prev = None
    for k, (t, sub, fill, col) in enumerate(parts):
        x = 60 + k * 113
        b = box(s, x, 150, 104, 80, [t, sub], col=col, fill=fill, size=12)
        if prev:
            link(s, prev, b, color=INK, width=2.2, gap=2)
        prev = b
    note(s, "No teeth: the gizzard does the grinding, helped by grit the bird swallows.", 250, size=14, color=INK)
    return s


@fig
def gestation_periods():
    s = Svg(800, 360, "Gestation and incubation periods of farm animals",
            "Approximate gestation periods: cow 283 days (about 9 months), goat 150 days, sheep 147 days, sow 114 days "
            "(3 months, 3 weeks and 3 days), rabbit 31 days. Hen's eggs hatch after 21 days of incubation.")
    heading(s, "Gestation (and incubation) periods")
    rows = [("Cow", 283, "about 9 months", GREEN), ("Goat", 150, "about 5 months", ORANGE), ("Ewe (sheep)", 147, "about 5 months", ORANGE),
            ("Sow (pig)", 114, "3 months, 3 weeks, 3 days", PURPLE), ("Doe (rabbit)", 31, "about 1 month", BLUE),
            ("Hen's egg", 21, "incubation", RED)]
    x0, scale = 160, 1.6
    for k, (name, days, note_t, col) in enumerate(rows):
        y = 85 + k * 44
        s.text(x0 - 12, y, name, size=14, weight="bold", anchor="end")
        s.rect(x0, y - 13, days * scale, 26, fill=col, stroke=col, width=1, rx=5, opacity=0.85)
        s.text(x0 + days * scale + 8, y, f"{days} days  ({note_t})", size=13, anchor="start")
    return s


@fig
def pearson_square():
    s = Svg(780, 400, "The Pearson square for mixing a feed",
            "To make a ration with 18% crude protein from maize (9% protein) and groundnut cake (45% protein), write 18 in "
            "the centre, 9 and 45 at the left corners, and subtract diagonally ignoring signs: 45 minus 18 gives 27 parts "
            "of maize; 18 minus 9 gives 9 parts of groundnut cake. Total 36 parts, so the ration is 75% maize and 25% "
            "groundnut cake.")
    heading(s, "Pearson square: 18% protein from maize and groundnut cake")
    x0, y0, w = 180, 90, 220
    s.rect(x0, y0, w, w, fill="none", stroke=INK, width=2.4)
    s.line(x0, y0, x0 + w, y0 + w, color=MUTED, width=1.6, dash="6 5")
    s.line(x0 + w, y0, x0, y0 + w, color=MUTED, width=1.6, dash="6 5")
    s.circle(x0 + w / 2, y0 + w / 2, 32, fill="#ffffff", stroke=RED, width=2.6)
    s.text(x0 + w / 2, y0 + w / 2, "18%", size=18, weight="bold", color=RED)
    s.text(x0 - 14, y0, "Maize 9%", size=15, weight="bold", anchor="end", color=ORANGE)
    s.text(x0 - 14, y0 + w, "GN cake 45%", size=15, weight="bold", anchor="end", color=BROWN)
    s.text(x0 + w + 14, y0, "45 − 18 = 27 parts maize", size=15, weight="bold", anchor="start", color=ORANGE)
    s.text(x0 + w + 14, y0 + w, "18 − 9 = 9 parts GN cake", size=15, weight="bold", anchor="start", color=BROWN)
    s.text(x0 + w + 14, y0 + w / 2 - 12, "total = 36 parts", size=14, anchor="start")
    s.text(x0 + w + 14, y0 + w / 2 + 12, "maize 27/36 = 75%; cake 9/36 = 25%", size=14, anchor="start")
    note(s, "Subtract diagonally (ignore signs); each answer belongs to the feed on its row.", 370, size=14, color=INK)
    return s


@fig
def poultry_house():
    s = Svg(800, 420, "A deep litter poultry house",
            "A cross-section of a deep litter house. A wide overhanging roof keeps out sun and rain. Each long side has a "
            "low wall with wire mesh above it for ventilation. The concrete floor is covered with a deep layer of dry "
            "litter such as wood shavings or rice husks. Feeders and drinkers stand on the litter, with a perch and nest "
            "boxes for layers.")
    heading(s, "A deep litter house (cross-section)")
    L, R = 90, 530
    s.polygon([(L - 50, 150), ((L + R) / 2, 70), (R + 50, 150)], fill="#a16207", stroke=INK, width=2.4)
    for x in (L, R):
        s.rect(x - 8, 150, 16, 110, fill="#ffffff", stroke=INK, width=1.6)
        for y in range(156, 260, 10):
            s.line(x - 8, y, x + 8, y + 6, color="#94a3b8", width=1)
            s.line(x + 8, y, x - 8, y + 6, color="#94a3b8", width=1)
        s.rect(x - 8, 260, 16, 70, fill=F_GREY, stroke=INK, width=1.8)
    s.rect(L - 8, 330, R - L + 16, 10, fill="#cbd5e1", stroke=INK, width=1.4)
    s.rect(L + 8, 312, R - L - 16, 18, fill="#fde68a", stroke=BROWN, width=1.4)
    s.rect(170, 282, 40, 30, fill=METAL, stroke=INK, width=1.6)
    s.rect(290, 286, 28, 26, fill="#bfdbfe", stroke=BLUE, width=1.6)
    s.line(360, 250, 430, 250, color=BROWN, width=4)
    s.rect(450, 232, 60, 40, fill="#fef3c7", stroke=BROWN, width=1.6)
    labels = [((420, 112), "overhanging roof", 100), ((R + 8, 200), "wire mesh: ventilation", 160), ((R + 8, 295), "low wall", 200),
              ((480, 252), "nest box", 240), ((400, 250), "perch", 280), ((300, 300), "drinker", 320),
              ((190, 296), "feeder", 360), ((460, 322), "deep dry litter (shavings, husks)", 390)]
    for (px, py), txt, ty in labels:
        s.line(px, py, 590, ty, color=MUTED, width=1.2)
        s.dot(px, py, r=2.5, color=INK)
        s.text(596, ty, txt, size=13, anchor="start")
    return s


@fig
def egg_structure():
    s = Svg(780, 400, "The structure of a hen's egg",
            "A longitudinal section of an egg. The hard shell is lined by two shell membranes, which separate at the blunt "
            "end to form the air cell. Inside is the albumen (egg white), the yolk with the germinal disc on its surface, "
            "and twisted chalazae that hold the yolk in the centre.")
    heading(s, "Inside a hen's egg")
    cx, cy = 300, 220
    s.ellipse(cx, cy, 190, 140, fill="#fef3c7", stroke=BROWN, width=5)
    s.ellipse(cx, cy, 182, 132, fill="none", stroke=MUTED, width=1.4)
    s.path(f"M {cx - 182} {cy - 30} Q {cx - 150} {cy} {cx - 182} {cy + 30}", color=MUTED, width=1.6, fill="#e0f2fe")
    s.ellipse(cx, cy, 150, 105, fill="#f8fafc", stroke="#cbd5e1", width=1.4)
    s.circle(cx + 10, cy, 58, fill="#facc15", stroke=ORANGE, width=2.4)
    s.ellipse(cx + 10, cy - 50, 10, 4, fill="#ffffff", stroke=ORANGE, width=1.4)
    s.path(f"M {cx - 48} {cy} C {cx - 70} {cy - 12}, {cx - 90} {cy + 12}, {cx - 120} {cy}", color=MUTED, width=2.4)
    s.path(f"M {cx + 68} {cy} C {cx + 90} {cy - 12}, {cx + 110} {cy + 12}, {cx + 140} {cy}", color=MUTED, width=2.4)
    labels = [((cx + 160, cy - 80), "shell (calcium carbonate)", 90), ((cx + 10, cy - 52), "germinal disc", 140),
              ((cx + 120, cy + 2), "chalaza", 190), ((cx + 40, cy + 30), "yolk", 240),
              ((cx + 172, cy + 40), "shell membranes", 290), ((cx + 120, cy + 60), "albumen (white)", 340)]
    for (px, py), txt, ty in labels:
        s.line(px, py, 554, ty, color=MUTED, width=1.2)
        s.dot(px, py, r=2.5, color=INK)
        s.text(560, ty, txt, size=14, anchor="start")
    s.line(cx - 168, cy, 90, 372, color=MUTED, width=1.2)
    s.dot(cx - 168, cy, r=2.5, color=INK)
    s.text(84, 384, "air cell (blunt end)", size=14, anchor="start")
    return s


@fig
def fish_pond():
    s = Svg(800, 380, "Cross-section of an earthen fish pond",
            "An earthen fish pond dug on a gentle slope with clay soil. Water enters through an inlet pipe with a screen to "
            "keep out wild fish. The pond is shallow at the inlet end and deeper (about 1.5 m) at the outlet end, where a "
            "drain pipe or monk lets the pond be emptied for harvesting. Dykes (banks) around the pond are planted with "
            "grass to stop erosion.")
    heading(s, "An earthen fish pond (cross-section)")
    s.polygon([(20, 160), (120, 160), (180, 260), (600, 300), (660, 160), (780, 160), (780, 360), (20, 360)],
              fill="#fde68a", stroke=BROWN, width=2.4)
    s.polygon([(130, 176), (640, 176), (600, 300), (180, 260)], fill="#93c5fd", stroke="none", width=0, opacity=0.85)
    s.line(130, 176, 640, 176, color=BLUE, width=2, dash="6 4")
    s.rect(30, 150, 110, 10, fill=METAL, stroke=INK, width=1.6)
    s.line(140, 150, 140, 172, color=INK, width=2)
    s.rect(560, 170, 18, 150, fill=METAL, stroke=INK, width=1.6)
    s.rect(560, 320, 200, 10, fill=METAL, stroke=INK, width=1.6)
    for x in range(30, 120, 12):
        s.line(x, 160, x + 4, 146, color=GREEN, width=2)
    for x in range(670, 780, 12):
        s.line(x, 160, x + 4, 146, color=GREEN, width=2)
    for x, y in ((300, 215), (380, 240), (460, 225)):
        s.path(f"M {x} {y} q 14 -10 28 0 q -14 10 -28 0 Z", color=INK, width=1.4, fill="#cbd5e1")
        s.polygon([(x, y), (x - 8, y - 6), (x - 8, y + 6)], fill="#cbd5e1", stroke=INK, width=1)
    s.text(85, 128, "inlet with screen", size=13, weight="bold")
    s.text(680, 342, "outlet / drain pipe", size=13, weight="bold", anchor="end")
    s.text(390, 196, "water", size=13, color=BLUE, weight="bold")
    s.text(220, 300, "shallow end", size=13, color=MUTED)
    s.text(620, 120, "dyke planted", size=13, weight="bold", anchor="start")
    s.text(620, 138, "with grass", size=13, weight="bold", anchor="start")
    s.line(612, 176, 612, 300, color=INK, width=1.4, arrow="both")
    s.text(606, 240, "~1.5 m", size=12, anchor="end", weight="bold")
    return s


# ═══ A5: economics, management, extension and practical skills ═════════════

PF_TABLE = [(0, 0), (1, 8), (2, 22), (3, 36), (4, 46), (5, 52), (6, 55), (7, 55), (8, 52)]


@fig
def production_function():
    s = Svg(800, 460, "The law of diminishing returns: total, average and marginal product",
            "As more units of a variable input such as labour are added to a fixed amount of land, total product first "
            "rises quickly, then more slowly, reaches a maximum and then falls. Marginal product rises, then falls, and "
            "becomes zero where total product is greatest. Stage I lasts until average product is at its maximum, stage "
            "II until marginal product reaches zero, and stage III, where marginal product is negative, follows.")
    heading(s, "Diminishing returns: total, average and marginal product")
    ox, oy, ux, uy = 90, 400, 72, 5.4
    X = lambda x: ox + x * ux
    Y = lambda y: oy - y * uy
    for k in range(0, 9):
        s.line(X(k), Y(0), X(k), Y(60), color="#e5e7eb", width=1)
        s.text(X(k), oy + 18, str(k), size=13, color=MUTED)
    for v in range(0, 61, 10):
        s.line(X(0), Y(v), X(8), Y(v), color="#e5e7eb", width=1)
        s.text(X(0) - 8, Y(v), str(v), size=13, color=MUTED, anchor="end")
    s.line(X(0), oy, X(8) + 10, oy, color=INK, width=2)
    s.line(X(0), oy, X(0), Y(62), color=INK, width=2)
    s.text(X(4), oy + 42, "units of labour (variable input)", size=14, color=MUTED)
    s.text(X(0) - 40, Y(62) - 10, "output (bags)", size=13, color=MUTED, anchor="start")
    s.polyline([(X(x), Y(y)) for x, y in PF_TABLE], color=BLUE, width=3.2)
    ap = [(x, y / x) for x, y in PF_TABLE if x > 0]
    mp = [(x - 0.5, PF_TABLE[x][1] - PF_TABLE[x - 1][1]) for x in range(1, 9)]
    s.polyline([(X(x), Y(y)) for x, y in ap], color=GREEN, width=2.6)
    s.polyline([(X(x), Y(y)) for x, y in mp], color=RED, width=2.6, dash="7 5")
    s.label(X(5.6), Y(57), "total product", size=14, color=BLUE, weight="bold")
    s.label(X(7.3), Y(11), "average", size=13, color=GREEN, weight="bold")
    s.label(X(5.9), Y(-3) - 2, "marginal", size=13, color=RED, weight="bold")
    for x, name in ((3, "Stage I"), (6.5, "Stage II")):
        s.line(X(x), Y(0), X(x), Y(60), color=PURPLE, width=1.6, dash="4 4")
    s.text(X(1.5), Y(60) + 4, "Stage I", size=14, weight="bold", color=PURPLE)
    s.text(X(4.75), Y(60) + 4, "Stage II", size=14, weight="bold", color=PURPLE)
    s.text(X(7.4), Y(60) + 4, "Stage III", size=14, weight="bold", color=PURPLE)
    return s


@fig
def factors_of_production():
    s = Svg(800, 300, "The four factors of production and their rewards",
            "Land is rewarded with rent, labour with wages, capital with interest, and management or entrepreneurship "
            "with profit.")
    heading(s, "Factors of production and their rewards")
    items = [("Land", "soil, water, natural", "resources", "Rent", F_AMBER, BROWN), ("Labour", "human effort,", "family or hired", "Wages", F_BLUE, BLUE),
             ("Capital", "tools, machines,", "money, buildings", "Interest", F_GREEN, GREEN), ("Management", "organising and", "taking risks", "Profit", F_PURPLE, PURPLE)]
    for k, (name, a, b, reward, fill, col) in enumerate(items):
        x = 110 + k * 193
        top = box(s, x, 120, 170, 90, [name, a, b], col=col, fill=fill, size=15)
        bot = box(s, x, 240, 120, 46, [reward], col=col, fill="#ffffff", size=16)
        link(s, top, bot, color=MUTED, width=2.2)
    return s


@fig
def marketing_chain():
    s = Svg(800, 330, "A marketing channel for farm produce",
            "Produce moves from the farmer to an assembler or middleman who buys in villages, then to a wholesaler, a "
            "retailer and finally the consumer. Sometimes a processor adds value along the way, and some farmers sell "
            "directly to consumers in local markets, or through a cooperative.")
    heading(s, "From farm gate to consumer: a marketing channel")
    steps = [("Farmer", F_GREEN, GREEN), ("Assembler /", F_AMBER, ORANGE), ("Wholesaler", F_BLUE, BLUE), ("Retailer", F_PURPLE, PURPLE), ("Consumer", F_GREY, INK)]
    subs = ["produces", "middleman", "buys in bulk", "sells small lots", "buys to use"]
    boxes = []
    prev = None
    for k, ((t, fill, col), sub) in enumerate(zip(steps, subs)):
        b = box(s, 85 + k * 157, 140, 138, 64, [t, sub], col=col, fill=fill, size=14)
        if prev:
            link(s, prev, b, color=INK, width=2.4)
        boxes.append(b)
        prev = b
    p = box(s, 320, 260, 160, 52, ["Processor", "adds value"], col=TEAL, fill=F_TEAL, size=14)
    link(s, boxes[1], p, color=MUTED, width=2)
    link(s, p, boxes[2], color=MUTED, width=2)
    s.path("M 85 108 C 200 70, 600 70, 713 108", color=GREEN, width=2.2, dash="7 5", arrow="end")
    s.text(400, 62, "direct sale or cooperative: fewer middlemen, more for the farmer", size=13, color=GREEN, weight="bold")
    return s


@fig
def supply_demand():
    s = Svg(780, 420, "Demand, supply and the market price",
            "A graph of price against quantity. The demand curve slopes down: buyers want more at lower prices. The supply "
            "curve slopes up: farmers offer more at higher prices. Where they cross is the equilibrium price and quantity. "
            "At harvest time supply increases, the supply curve shifts right, and the price falls.")
    heading(s, "Demand, supply and price")
    ox, oy, W, H = 100, 360, 520, 280
    X = lambda q: ox + q * W
    Y = lambda p: oy - p * H
    s.arrow(ox, oy, ox + W + 20, oy, color=INK, width=2)
    s.arrow(ox, oy, ox, oy - H - 20, color=INK, width=2)
    s.text(ox + W + 24, oy + 4, "quantity", size=14, anchor="start", color=MUTED)
    s.text(ox - 8, oy - H - 30, "price", size=14, anchor="start", color=MUTED)
    s.line(X(0.1), Y(0.9), X(0.9), Y(0.1), color=BLUE, width=3)
    s.line(X(0.1), Y(0.1), X(0.9), Y(0.9), color=GREEN, width=3)
    s.line(X(0.35), Y(0.1), X(1.0), Y(0.75), color=GREEN, width=2.6, dash="8 6")
    s.text(X(0.9) + 8, Y(0.1), "D (demand)", size=14, weight="bold", color=BLUE, anchor="start")
    s.text(X(0.9) - 4, Y(0.9) - 12, "S", size=14, weight="bold", color=GREEN, anchor="start")
    s.text(X(1.0) + 6, Y(0.75), "S₁ (harvest)", size=14, weight="bold", color=GREEN, anchor="start")
    for q, p, col in ((0.5, 0.5, RED), (0.625, 0.375, ORANGE)):
        s.line(X(0), Y(p), X(q), Y(p), color=col, width=1.6, dash="5 4")
        s.line(X(q), Y(0), X(q), Y(p), color=col, width=1.6, dash="5 4")
        s.dot(X(q), Y(p), r=6, color=col)
    s.text(X(0) - 8, Y(0.5), "P", size=14, weight="bold", color=RED, anchor="end")
    s.text(X(0) - 8, Y(0.375), "P₁", size=14, weight="bold", color=ORANGE, anchor="end")
    s.text(X(0.5), oy + 18, "Q", size=14, weight="bold", color=RED)
    s.text(X(0.625), oy + 18, "Q₁", size=14, weight="bold", color=ORANGE)
    s.text(X(0.5) - 10, Y(0.5) - 20, "equilibrium", size=13, color=RED, weight="bold", anchor="end")
    note(s, "More supply at harvest → lower price; scarcity in the lean season → higher price.", 405, size=14, color=INK)
    return s


@fig
def extension_methods():
    s = Svg(800, 360, "Agricultural extension methods",
            "Three groups of extension methods. Individual methods: farm and home visits, office calls, phone calls. Group "
            "methods: method and result demonstrations, farmer field schools, field days, meetings, tours. Mass methods: "
            "radio, television, posters, leaflets, text messages.")
    heading(s, "Reaching farmers: extension methods")
    groups = [("Individual", ["farm and home visits", "office calls", "phone calls"], "personal, but reaches few", F_BLUE, BLUE),
              ("Group", ["demonstrations", "farmer field schools", "field days, tours"], "learning by doing", F_GREEN, GREEN),
              ("Mass", ["radio, television", "posters, leaflets", "text messages"], "reaches many, quickly", F_AMBER, ORANGE)]
    for k, (name, items, note_t, fill, col) in enumerate(groups):
        x = 140 + k * 260
        s.rect(x - 115, 70, 230, 230, fill=fill, stroke=col, width=2.4, rx=14)
        s.text(x, 104, name, size=18, weight="bold", color=col)
        for j, it in enumerate(items):
            s.text(x, 148 + j * 34, it, size=14)
        s.text(x, 274, note_t, size=13, color=MUTED, weight="bold")
    note(s, "Good extension combines methods: hear it on radio, see it at a demonstration, try it with a visit.", 335, size=13, color=INK)
    return s


@fig
def farm_layout():
    s = Svg(800, 470, "A simple layout plan for a mixed farm",
            "A plan of a mixed farm. The farmhouse, store and office are near the road entrance. Poultry house and pig "
            "pens are downwind of the house, near the store. Crop plots are divided for rotation. An orchard and the "
            "fish pond are near the stream, and the swamp rice field lies in the valley bottom. Paths link all parts.")
    heading(s, "Planning the layout of a mixed farm")
    s.rect(30, 60, 740, 380, fill="#f0fdf4", stroke=GREEN, width=2.4, rx=6)
    s.rect(30, 400, 740, 40, fill="#e5e7eb", stroke="none", width=0)
    s.text(400, 422, "main road", size=13, color=MUTED, weight="bold")
    s.path("M 700 60 C 680 160, 720 260, 690 400", color=BLUE, width=8, fill="none")
    s.text(735, 230, "stream", size=12, color=BLUE, weight="bold")
    items = [((60, 300, 150, 80), "House, store,", "office", F_GREY, INK), ((230, 300, 110, 80), "Poultry", "house", F_AMBER, ORANGE),
             ((360, 300, 90, 80), "Pig", "pens", F_PURPLE, PURPLE), ((60, 80, 130, 190), "Plot A", "maize", F_GREEN, GREEN),
             ((200, 80, 130, 190), "Plot B", "groundnut", F_GREEN, GREEN), ((340, 80, 130, 190), "Plot C", "cassava", F_GREEN, GREEN),
             ((480, 80, 180, 120), "Orchard", "citrus, mango", F_TEAL, TEAL), ((480, 215, 180, 70), "Fish pond", "", F_BLUE, BLUE),
             ((470, 300, 200, 80), "Swamp rice", "valley bottom", "#dbeafe", BLUE)]
    for (x, y, w, h), a, b, fill, col in items:
        s.rect(x, y, w, h, fill=fill, stroke=col, width=2, rx=6)
        s.text(x + w / 2, y + h / 2 - (8 if b else 0), a, size=14, weight="bold", color=col)
        if b:
            s.text(x + w / 2, y + h / 2 + 12, b, size=12)
    s.line(135, 380, 135, 400, color=BROWN, width=4)
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
