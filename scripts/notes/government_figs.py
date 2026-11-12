#!/usr/bin/env python3
"""Original diagrams for the Government notes.

    python3 scripts/notes/government_figs.py            # write every diagram
    python3 scripts/notes/government_figs.py name ...   # write some

Each function draws one figure and returns an Svg. Files go to
public/img/government/<name>.svg and lessons show them from
https://wasscetutor.com/img/government/<name>.svg. All drawn by WASSCE Tutor.
Government diagrams are mostly structures, flows and timelines, so they use
larger text than the science figures: they must stay readable on a phone.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from chemistry_figs import box, link, title  # noqa: E402
from svgfig import (  # noqa: E402
    BLUE, F_AMBER, F_BLUE, F_GREEN, F_GREY, F_PURPLE, F_RED, GREEN, INK, MUTED, ORANGE, PURPLE, RED, TEAL, Svg,
)

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/img/government"
FIGS: dict[str, callable] = {}
F_TEAL = "#ccfbf1"


def fig(fn):
    FIGS[fn.__name__.replace("_", "-")] = fn
    return fn


def heading(s: Svg, t: str, y=34, size=19):
    s.text(s.w / 2, y, t, size=size, weight="bold", color=INK)


def note(s: Svg, t: str, y: float, size=15, color=MUTED):
    s.text(s.w / 2, y, t, size=size, color=color)


def arrow(s: Svg, x1, y1, x2, y2, color=INK, width=2.6):
    s.arrow(x1, y1, x2, y2, color=color, width=width)


# ═══ Group 1: political concepts ═════════════════════════════════════════════

@fig
def government_meanings():
    s = Svg(760, 430, "Three meanings of government",
            "Government can mean an institution (the body that makes, carries out and interprets laws, such as the "
            "Government of Sierra Leone), a process (the activity of ruling a society), or an academic subject (the "
            "study of the state, its organs and how power is used).")
    heading(s, "One word, three meanings")
    c = box(s, 380, 110, 300, 64, ["GOVERNMENT"], col=PURPLE, fill=F_PURPLE, size=22)
    parts = [(130, "As an institution", ["the organs that make,", "carry out and interpret", "the laws of a state"], BLUE, F_BLUE),
             (380, "As a process", ["the activity of ruling:", "making and enforcing", "decisions for society"], GREEN, F_GREEN),
             (630, "As a subject", ["the academic study of", "the state, its organs", "and the use of power"], ORANGE, F_AMBER)]
    for x, head, lines, col, fill in parts:
        b = box(s, x, 290, 220, 150, [head] + lines, col=col, fill=fill, size=17)
        link(s, c, b, color=MUTED)
    note(s, "e.g. 'The Government of Sierra Leone' uses the first meaning.", 405)
    return s


@fig
def power_authority():
    s = Svg(760, 470, "Power, legitimacy and authority",
            "Power is the ability to make others act as you wish. When the people accept that power as rightful, it has "
            "legitimacy, and power with legitimacy is authority. Max Weber described three sources of authority: "
            "traditional, charismatic and legal-rational.")
    heading(s, "Power + legitimacy = authority")
    p = box(s, 120, 130, 200, 110, ["Power", "the ability to make", "others obey"], col=RED, fill=F_RED, size=17)
    l = box(s, 380, 130, 200, 110, ["Legitimacy", "people accept the", "right to rule"], col=GREEN, fill=F_GREEN, size=17)
    a = box(s, 640, 130, 200, 110, ["Authority", "power accepted", "as rightful"], col=BLUE, fill=F_BLUE, size=17)
    s.text(250, 130, "+", size=40, weight="bold", color=INK)
    s.text(510, 130, "=", size=40, weight="bold", color=INK)
    s.text(380, 232, "Three sources of authority (Max Weber)", size=17, weight="bold", color=INK)
    kinds = [(130, "Traditional", ["custom and history", "e.g. a paramount chief"]),
             (380, "Charismatic", ["a leader's personal", "qualities and appeal"]),
             (630, "Legal-rational", ["laws and offices", "e.g. the President under", "the Constitution"])]
    for x, head, lines in kinds:
        box(s, x, 340, 220, 120, [head] + lines, col=PURPLE, fill=F_PURPLE, size=16)
    note(s, "Force without legitimacy is power, not authority.", 445)
    return s


@fig
def state_elements():
    s = Svg(760, 470, "The four elements of a state",
            "A state has four essential elements: a population, a defined territory, a government, and sovereignty. "
            "Sierra Leone has all four and became a sovereign state on 27 April 1961.")
    heading(s, "No state without all four elements")
    s.circle(380, 240, 78, fill=F_PURPLE, stroke=PURPLE, width=3)
    s.text(380, 240, "STATE", size=26, weight="bold", color=PURPLE)
    parts = [(150, 120, "Population", ["a body of people", "living together"], BLUE, F_BLUE),
             (610, 120, "Territory", ["defined land, waters", "and airspace"], GREEN, F_GREEN),
             (150, 360, "Government", ["the machinery that", "makes and enforces laws"], ORANGE, F_AMBER),
             (610, 360, "Sovereignty", ["supreme power inside;", "independence outside"], RED, F_RED)]
    for x, y, head, lines, col, fill in parts:
        box(s, x, y, 240, 96, [head] + lines, col=col, fill=fill, size=17)
        sx = 380 + (x - 380) * 0.27
        sy = 240 + (y - 240) * 0.62
        s.line(sx, sy, x + (380 - x) * 0.42, y + (240 - y) * 0.35, color=MUTED, width=2.4)
    note(s, "Sierra Leone: all four since independence on 27 April 1961.", 448)
    return s


@fig
def sovereignty_limits():
    s = Svg(760, 470, "Sovereignty and its limits",
            "Internal sovereignty is supreme power over all people and bodies inside the state; external sovereignty is "
            "independence from other states. In practice sovereignty is limited by the constitution, international law "
            "and treaties, public opinion, pressure groups, customs and religion, and membership of bodies such as the "
            "UN and ECOWAS.")
    heading(s, "Sovereignty: supreme in theory, limited in practice")
    sv = box(s, 380, 110, 260, 60, ["Sovereignty"], col=PURPLE, fill=F_PURPLE, size=22)
    i = box(s, 150, 110, 190, 96, ["Internal", "supreme over all", "inside the state"], col=BLUE, fill=F_BLUE, size=16)
    e = box(s, 610, 110, 190, 96, ["External", "independent of", "other states"], col=GREEN, fill=F_GREEN, size=16)
    link(s, sv, i, color=MUTED)
    link(s, sv, e, color=MUTED)
    s.text(380, 215, "What limits it", size=18, weight="bold", color=RED)
    arrow(s, 380, 200, 380, 146, color=RED, width=3)
    limits = ["The constitution", "International law, treaties", "Public opinion",
              "Pressure groups", "Customs and religion", "UN, AU and ECOWAS"]
    for k, t in enumerate(limits):
        x = 140 + (k % 3) * 240
        y = 290 + (k // 3) * 86
        box(s, x, y, 224, 64, [t], col=RED, fill=F_RED, size=16, bold_first=False)
    return s


@fig
def unitary_federal_confederal():
    s = Svg(800, 500, "Unitary, federal and confederal systems",
            "Unitary: all power lies with the central government, which delegates some to local units and can take it "
            "back (Sierra Leone, Ghana, Britain). Federal: the constitution divides power between a central government "
            "and state governments, each supreme in its own field (Nigeria, USA). Confederal: sovereign member states "
            "give limited powers to a weak central body and can leave (the Senegambia Confederation, 1982 to 1989).")
    heading(s, "Where does power sit?")
    panels = [(140, "Unitary", BLUE, F_BLUE), (400, "Federal", GREEN, F_GREEN), (660, "Confederal", ORANGE, F_AMBER)]
    for cx, name, col, fill in panels:
        s.rect(cx - 125, 60, 250, 400, fill="#ffffff", stroke=col, width=2, rx=14)
        s.text(cx, 86, name, size=20, weight="bold", color=col)
    # unitary
    c = box(s, 140, 160, 200, 64, ["Central", "government"], col=BLUE, fill=F_BLUE, size=17)
    for k, x in enumerate((80, 140, 200)):
        b = box(s, x, 300, 54, 48, ["L"], col=BLUE, fill="#ffffff", size=16)
        arrow(s, 140 + (x - 140) * 0.3, 194, x, 274, color=BLUE)
    s.text(140, 360, "local units get power", size=14, color=MUTED)
    s.text(140, 378, "from the centre, which", size=14, color=MUTED)
    s.text(140, 396, "can take it back", size=14, color=MUTED)
    s.text(140, 432, "Sierra Leone, Ghana", size=15, weight="bold", color=INK)
    # federal
    k = box(s, 400, 140, 200, 50, ["Constitution"], col=PURPLE, fill=F_PURPLE, size=17)
    f1 = box(s, 400, 235, 170, 54, ["Federal", "government"], col=GREEN, fill=F_GREEN, size=15)
    for x in (340, 400, 460):
        box(s, x, 320, 52, 46, ["S"], col=GREEN, fill="#ffffff", size=16)
    arrow(s, 400, 166, 400, 205, color=PURPLE)
    arrow(s, 300, 150, 318, 296, color=PURPLE)
    s.text(400, 365, "the constitution divides", size=14, color=MUTED)
    s.text(400, 383, "power; each level is", size=14, color=MUTED)
    s.text(400, 401, "supreme in its own field", size=14, color=MUTED)
    s.text(400, 432, "Nigeria, USA", size=15, weight="bold", color=INK)
    # confederal
    for x in (600, 660, 720):
        box(s, x, 300, 54, 50, ["M"], col=ORANGE, fill=F_AMBER, size=16)
        arrow(s, x, 274, 660 + (x - 660) * 0.3, 196, color=ORANGE)
    box(s, 660, 165, 170, 54, ["Weak central", "body"], col=ORANGE, fill="#ffffff", size=15)
    s.text(660, 360, "sovereign members lend", size=14, color=MUTED)
    s.text(660, 378, "limited powers and", size=14, color=MUTED)
    s.text(660, 396, "may leave", size=14, color=MUTED)
    s.text(660, 432, "Senegambia, 1982–89", size=15, weight="bold", color=INK)
    note(s, "L = local unit   S = state or region   M = member state", 482, size=14)
    return s


@fig
def presidential_parliamentary():
    s = Svg(800, 500, "Presidential and parliamentary systems",
            "Presidential system: the voters elect the president and the legislature separately; the president is head "
            "of state and of government, serves a fixed term and appoints ministers. Parliamentary system: the voters "
            "elect parliament; the leader of the majority party becomes prime minister and forms a cabinet from "
            "parliament; a separate head of state has a ceremonial role; the government can be removed by a vote of no "
            "confidence.")
    heading(s, "Who elects whom?")
    for cx, name, col in ((200, "Presidential (e.g. Sierra Leone)", BLUE), (600, "Parliamentary (e.g. Britain)", GREEN)):
        s.rect(cx - 185, 56, 370, 418, fill="#ffffff", stroke=col, width=2, rx=14)
        s.text(cx, 82, name, size=17, weight="bold", color=col)
    v1 = box(s, 200, 130, 160, 50, ["Voters"], col=INK, fill=F_GREY, size=17)
    pr = box(s, 110, 250, 150, 70, ["President", "head of state", "and government"], col=BLUE, fill=F_BLUE, size=14)
    lg = box(s, 290, 250, 150, 70, ["Parliament", "makes laws"], col=BLUE, fill=F_BLUE, size=14)
    link(s, v1, pr, color=BLUE)
    link(s, v1, lg, color=BLUE)
    mn = box(s, 110, 375, 150, 56, ["Ministers", "appointed"], col=BLUE, fill="#ffffff", size=14)
    link(s, pr, mn, color=BLUE)
    s.text(200, 448, "separate election · fixed term", size=14, color=MUTED)
    v2 = box(s, 600, 130, 160, 50, ["Voters"], col=INK, fill=F_GREY, size=17)
    pa = box(s, 600, 220, 210, 56, ["Parliament"], col=GREEN, fill=F_GREEN, size=16)
    pm = box(s, 600, 310, 210, 56, ["Prime Minister", "majority party leader"], col=GREEN, fill=F_GREEN, size=14)
    cb = box(s, 600, 395, 210, 50, ["Cabinet (from parliament)"], col=GREEN, fill="#ffffff", size=14)
    link(s, v2, pa, color=GREEN)
    link(s, pa, pm, color=GREEN)
    link(s, pm, cb, color=GREEN)
    s.text(600, 448, "fusion of powers · no-confidence vote", size=14, color=MUTED)
    box(s, 735, 130, 100, 50, ["Monarch", "ceremonial"], col=MUTED, fill="#ffffff", size=12)
    return s


@fig
def democracy_types():
    s = Svg(760, 420, "Direct and representative democracy",
            "In direct democracy the citizens themselves meet and decide public matters, as in ancient Athens or in a "
            "referendum. In representative (indirect) democracy the citizens elect representatives who make decisions "
            "for them, as in Sierra Leone's Parliament.")
    heading(s, "Two ways the people rule")
    for cx, name, col in ((200, "Direct", ORANGE), (560, "Representative", BLUE)):
        s.rect(cx - 170, 56, 340, 330, fill="#ffffff", stroke=col, width=2, rx=14)
        s.text(cx, 84, name, size=20, weight="bold", color=col)
    for k in range(5):
        s.circle(110 + k * 45, 150, 16, fill=F_AMBER, stroke=ORANGE, width=2)
    d = box(s, 200, 270, 230, 64, ["Decision", "made by all citizens"], col=ORANGE, fill=F_AMBER, size=16)
    for k in range(5):
        arrow(s, 110 + k * 45, 168, 200 + (k - 2) * 30, 236, color=ORANGE, width=2)
    s.text(200, 345, "Athens; referendums", size=15, weight="bold", color=INK)
    for k in range(5):
        s.circle(470 + k * 45, 140, 16, fill=F_BLUE, stroke=BLUE, width=2)
    r = box(s, 560, 215, 220, 50, ["Elected representatives"], col=BLUE, fill=F_BLUE, size=15)
    for k in range(5):
        arrow(s, 470 + k * 45, 158, 560 + (k - 2) * 25, 188, color=BLUE, width=2)
    d2 = box(s, 560, 300, 220, 50, ["Laws and decisions"], col=BLUE, fill="#ffffff", size=15)
    link(s, r, d2, color=BLUE)
    s.text(560, 362, "Sierra Leone's Parliament", size=15, weight="bold", color=INK)
    note(s, "Large modern states use representatives; direct votes survive in referendums.", 405, size=14)
    return s


@fig
def ideology_spectrum():
    s = Svg(800, 380, "Ideologies and the role of the state in the economy",
            "A line from the most state control of the economy to the least: communism (the state owns the means of "
            "production), socialism, the mixed economy or welfare state, and capitalism (private ownership and free "
            "markets). Fascism and Nazism are shown apart: they kept private property but the state controlled every part "
            "of life.")
    heading(s, "How much does the state own and control?")
    s.line(70, 170, 730, 170, color=INK, width=3)
    s.head(730, 170, 0, color=INK, size=14)
    s.head(70, 170, 3.1416, color=INK, size=14)
    s.text(70, 205, "most state control", size=14, color=RED, anchor="start", weight="bold")
    s.text(730, 205, "least state control", size=14, color=GREEN, anchor="end", weight="bold")
    pts = [(110, "Communism", ["state owns", "everything"], RED, F_RED), (290, "Socialism", ["state owns key", "industries"], ORANGE, F_AMBER),
           (480, "Mixed economy", ["public and", "private sectors"], PURPLE, F_PURPLE), (665, "Capitalism", ["private ownership,", "free markets"], GREEN, F_GREEN)]
    for x, name, lines, col, fill in pts:
        s.circle(x, 170, 9, fill=col, stroke="#ffffff", width=2)
        box(s, x, 100, 170, 84, [name] + lines, col=col, fill=fill, size=15)
    box(s, 400, 300, 470, 84, ["Fascism / Nazism (totalitarian)", "private property kept, but the state", "controls every part of life"],
        col=INK, fill=F_GREY, size=15)
    s.text(480, 236, "Sierra Leone today: a mixed economy", size=14, color=PURPLE, weight="bold")
    return s


@fig
def federal_lists():
    s = Svg(800, 440, "How a federal constitution shares out power",
            "In a federation the constitution lists powers. The exclusive list belongs to the federal government only "
            "(defence, foreign affairs, currency). The concurrent list is shared by both levels (education, health, "
            "agriculture), with federal law prevailing in a conflict. Residual matters left unlisted belong to the states "
            "(for example chieftaincy matters and local markets). Nigeria is the West African example.")
    heading(s, "A federal constitution shares out power in lists")
    k = box(s, 400, 95, 300, 56, ["The constitution"], col=PURPLE, fill=F_PURPLE, size=19)
    lists = [(140, "Exclusive list", "federal only", ["defence, armed forces", "foreign affairs", "currency, customs"], BLUE, F_BLUE),
             (400, "Concurrent list", "shared by both", ["education", "health, agriculture", "(federal law prevails)"], GREEN, F_GREEN),
             (660, "Residual matters", "states only", ["anything not listed,", "e.g. chieftaincy,", "local markets"], ORANGE, F_AMBER)]
    for x, head, who, items, col, fill in lists:
        b = box(s, x, 260, 230, 170, [head, who] + items, col=col, fill=fill, size=16)
        link(s, k, b, color=MUTED)
    note(s, "Example: Nigeria. Sierra Leone is unitary, so it has no such lists.", 410)
    return s


@fig
def aristotle_classification():
    s = Svg(800, 430, "Aristotle's classification of governments",
            "Aristotle classified governments by how many rule and in whose interest. Rule by one: monarchy (good) or "
            "tyranny (perverted). Rule by a few: aristocracy (good) or oligarchy (perverted). Rule by many: polity (good) "
            "or democracy, which he meant as mob rule (perverted).")
    heading(s, "Aristotle: who rules, and for whom?")
    s.text(330, 82, "For the good of all", size=17, weight="bold", color=GREEN)
    s.text(620, 82, "For the rulers' own good", size=17, weight="bold", color=RED)
    rows = [("One person", "Monarchy", "Tyranny"), ("A few", "Aristocracy", "Oligarchy"), ("The many", "Polity", "Democracy*")]
    for k, (who, good, bad) in enumerate(rows):
        y = 140 + k * 90
        s.text(40, y, who, size=17, weight="bold", color=INK, anchor="start")
        box(s, 330, y, 220, 64, [good], col=GREEN, fill=F_GREEN, size=19)
        box(s, 620, y, 220, 64, [bad], col=RED, fill=F_RED, size=19)
    note(s, "* Aristotle used 'democracy' for rule by the poor mob, not the modern meaning.", 410, size=14)
    return s


# ─────────────────────────────────────────────────────────────────────────────

def main(names: list[str]) -> int:
    chosen = names or list(FIGS)
    unknown = [n for n in chosen if n not in FIGS]
    if unknown:
        print("unknown figures:", ", ".join(unknown))
        return 1
    OUT.mkdir(parents=True, exist_ok=True)
    for n in chosen:
        FIGS[n]().save(OUT / f"{n}.svg")
    print(f"wrote {len(chosen)} diagram(s) to {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
