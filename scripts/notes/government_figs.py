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


# ═══ Group 2: organs and institutions ════════════════════════════════════════

@fig
def executive_types():
    s = Svg(800, 470, "Kinds of executive",
            "The executive can be classified as nominal (ceremonial head of state, such as a constitutional monarch) or "
            "real (the head who holds power, such as Sierra Leone's President); single (one person heads state and "
            "government) or plural (power shared by a council); and political (elected or appointed leaders who change) or "
            "permanent (the civil service, which stays).")
    heading(s, "Three ways to classify the executive")
    pairs = [(130, "Nominal", "ceremonial head of state", "e.g. a constitutional monarch", "Real", "holds actual power", "e.g. the President of Sierra Leone"),
             (400, "Single", "one person heads state and government", "e.g. presidential systems", "Plural (collegial)", "a council shares power", "e.g. Switzerland's Federal Council"),
             (670, "Political", "elected or appointed leaders", "change with elections", "Permanent", "the civil service", "stays when governments change")]
    for x, a1, a2, a3, b1, b2, b3 in pairs:
        box(s, x, 165, 240, 130, [a1, a2, a3], col=BLUE, fill=F_BLUE, size=15)
        s.text(x, 255, "versus", size=15, color=MUTED, weight="bold")
        box(s, x, 345, 240, 130, [b1, b2, b3], col=ORANGE, fill=F_AMBER, size=15)
    return s


@fig
def sl_executive():
    s = Svg(800, 500, "The executive in Sierra Leone",
            "The President is head of state, head of government and commander-in-chief, elected for five years and limited "
            "to two terms. The Vice-President is elected on the same ticket. Ministers are appointed by the President with "
            "the approval of Parliament and together form the Cabinet; ministries are run by the civil service. The "
            "President's power is limited by the Constitution, Parliament, the courts, elections and the media.")
    heading(s, "The executive arm in Sierra Leone")
    pr = box(s, 400, 110, 360, 84, ["President", "head of state and government,", "commander-in-chief"], col=BLUE, fill=F_BLUE, size=17)
    vp = box(s, 150, 220, 220, 60, ["Vice-President", "elected on the same ticket"], col=BLUE, fill="#ffffff", size=14)
    cb = box(s, 400, 230, 240, 70, ["Cabinet", "ministers approved", "by Parliament"], col=BLUE, fill=F_BLUE, size=15)
    ms = box(s, 400, 345, 300, 60, ["Ministries and the civil service"], col=GREEN, fill=F_GREEN, size=16)
    link(s, pr, vp, color=BLUE)
    link(s, pr, cb, color=BLUE)
    link(s, cb, ms, color=GREEN)
    s.text(660, 210, "Limits on power", size=16, weight="bold", color=RED)
    for k, t in enumerate(["the Constitution", "Parliament", "the courts", "elections, two terms", "the media, public opinion"]):
        s.text(660, 240 + k * 24, t, size=15, color=RED)
    note(s, "Five-year term, at most two terms; 55% of valid votes needed to win in round one.", 450, size=15)
    return s


@fig
def unicameral_bicameral():
    s = Svg(800, 420, "Unicameral and bicameral legislatures",
            "A unicameral legislature has one chamber, as in Sierra Leone and Ghana. A bicameral legislature has two "
            "chambers: an upper house (such as the Senate in Nigeria and the USA, or the House of Lords in Britain) and a "
            "lower house (the House of Representatives or the House of Commons).")
    heading(s, "One chamber or two?")
    for cx, name, col in ((200, "Unicameral", GREEN), (600, "Bicameral", BLUE)):
        s.rect(cx - 180, 56, 360, 330, fill="#ffffff", stroke=col, width=2, rx=14)
        s.text(cx, 84, name, size=20, weight="bold", color=col)
    box(s, 200, 200, 260, 110, ["Parliament", "one chamber makes", "all the laws"], col=GREEN, fill=F_GREEN, size=17)
    s.text(200, 300, "Sierra Leone, Ghana,", size=15, weight="bold", color=INK)
    s.text(200, 322, "The Gambia", size=15, weight="bold", color=INK)
    up = box(s, 600, 150, 270, 66, ["Upper house", "Senate / House of Lords"], col=BLUE, fill=F_BLUE, size=15)
    lo = box(s, 600, 255, 270, 66, ["Lower house", "Representatives / Commons"], col=BLUE, fill=F_BLUE, size=15)
    s.line(600, 184, 600, 222, color=BLUE, width=2.6)
    s.text(612, 205, "both must pass a bill", size=13, color=MUTED, anchor="start")
    s.text(600, 322, "Nigeria, Liberia,", size=15, weight="bold", color=INK)
    s.text(600, 344, "USA, Britain", size=15, weight="bold", color=INK)
    return s


@fig
def bill_to_law():
    s = Svg(800, 520, "How a bill becomes law in Sierra Leone",
            "A bill is drafted and published in the Gazette, then goes through the first reading (title read), second "
            "reading (debate on its principles), committee stage (clause by clause), report stage and third reading (final "
            "vote). It then goes to the President for assent; if the President refuses, the bill is returned to Parliament "
            "within 14 days with reasons. Once signed it becomes an Act.")
    heading(s, "From bill to Act of Parliament")
    steps = [("Drafting and gazetting", "bill published for the public"), ("First reading", "title read; no debate"),
             ("Second reading", "debate on the main principles"), ("Committee stage", "examined clause by clause"),
             ("Report stage", "amendments reported to the House"), ("Third reading", "final debate and vote"),
             ("Presidential assent", "signed, or returned within 14 days"), ("Act of Parliament", "now law; published")]
    for k, (a, b) in enumerate(steps):
        col = PURPLE if k == len(steps) - 1 else BLUE if k < 6 else ORANGE
        fill = F_PURPLE if k == len(steps) - 1 else F_BLUE if k < 6 else F_AMBER
        x = 210 if k < 4 else 590
        y = 110 + (k % 4) * 100
        b_ = box(s, x, y, 320, 66, [f"{k + 1}. {a}", b], col=col, fill=fill, size=15)
        if k % 4 != 3:
            arrow(s, x, y + 34, x, y + 64, color=MUTED)
    s.path("M 370 410 C 400 410, 400 110, 412 110", color=MUTED, width=2.6)
    arrow(s, 408, 110, 428, 110, color=MUTED)
    note(s, "Bills to change the Constitution need two-thirds of all MPs (some also need a referendum).", 498, size=14)
    return s


@fig
def judicial_independence():
    s = Svg(800, 450, "Safeguards of judicial independence",
            "Judges are independent when they are appointed on merit through the Judicial and Legal Service Commission with "
            "Parliament's approval, have security of tenure until retirement at 65, can be removed only for proven "
            "misconduct or incapacity by a special procedure, are paid salaries that cannot be reduced and are charged on "
            "the Consolidated Fund, have immunity for judicial acts, and stay out of party politics.")
    heading(s, "What keeps judges independent?")
    c = box(s, 400, 235, 220, 70, ["Independent", "judiciary"], col=PURPLE, fill=F_PURPLE, size=19)
    items = [(150, 110, "Appointment on merit", "advice of the JLSC,", "approved by Parliament"),
             (650, 110, "Security of tenure", "serve until 65;", "hard to remove"),
             (130, 235, "Removal only for cause", "proven misconduct or", "incapacity, by tribunal"),
             (670, 235, "Protected salaries", "cannot be reduced;", "Consolidated Fund"),
             (150, 360, "Judicial immunity", "not sued for", "judicial decisions"),
             (650, 360, "No party politics", "judges stay neutral", "and impartial")]
    for x, y, a, b, c2 in items:
        b_ = box(s, x, y, 230, 84, [a, b, c2], col=TEAL, fill=F_TEAL, size=15)
        link(s, b_, c, color=MUTED)
    return s


@fig
def sl_court_hierarchy():
    s = Svg(800, 520, "The courts of Sierra Leone",
            "The Supreme Court, headed by the Chief Justice, is the highest court and final court of appeal, with original "
            "jurisdiction in constitutional matters. Below it are the Court of Appeal and the High Court; these three are "
            "the superior courts of judicature. Below them are the Magistrate Courts and the Local Courts, which apply "
            "customary law. Appeals move upward.")
    heading(s, "Appeals move up the ladder")
    tiers = [("Supreme Court", "Chief Justice; final appeals;", "interprets the Constitution", 360, PURPLE, F_PURPLE),
             ("Court of Appeal", "hears appeals from", "the High Court", 400, BLUE, F_BLUE),
             ("High Court", "serious criminal and civil cases;", "appeals from lower courts", 440, BLUE, F_BLUE),
             ("Magistrate Courts", "less serious criminal", "and civil cases", 480, GREEN, F_GREEN),
             ("Local Courts", "customary law", "in the chiefdoms", 520, ORANGE, F_AMBER)]
    cx = 430
    for k, (name, d1, d2, w, col, fill) in enumerate(tiers):
        y = 104 + k * 88
        box(s, cx, y, w, 74, [name, d1, d2], col=col, fill=fill, size=15)
    arrow(s, 740, 470, 740, 80, color=RED, width=3)
    s.label(740, 275, "appeals", size=15, color=RED, weight="bold")
    s.line(40, 70, 40, 314, color=BLUE, width=3)
    s.text(52, 184, "superior", size=15, weight="bold", color=BLUE, anchor="start")
    s.text(52, 204, "courts", size=15, weight="bold", color=BLUE, anchor="start")
    s.line(40, 330, 40, 490, color=GREEN, width=3)
    s.text(52, 404, "lower", size=15, weight="bold", color=GREEN, anchor="start")
    s.text(52, 424, "courts", size=15, weight="bold", color=GREEN, anchor="start")
    return s


@fig
def rule_of_law_dicey():
    s = Svg(800, 400, "A. V. Dicey's three principles of the rule of law",
            "The British jurist A. V. Dicey (1885) set out three principles: supremacy of the law (no one is punished "
            "except for a breach of law proved in court; no arbitrary power), equality before the law (everyone, including "
            "officials, is subject to the same law and courts), and rights secured by the courts (fundamental rights are "
            "protected by the ordinary courts and the constitution).")
    heading(s, "The rule of law: Dicey's three principles")
    pillars = [(150, "Supremacy of the law", ["no punishment except", "for a breach of law", "proved in court"], BLUE, F_BLUE),
               (400, "Equality before the law", ["leaders and citizens", "obey the same laws", "and courts"], GREEN, F_GREEN),
               (650, "Rights protected by courts", ["courts and the", "constitution protect", "individual liberty"], ORANGE, F_AMBER)]
    s.rect(60, 70, 680, 40, fill=F_PURPLE, stroke=PURPLE, width=2.5, rx=8)
    s.text(400, 90, "THE RULE OF LAW", size=19, weight="bold", color=PURPLE)
    for x, head, lines, col, fill in pillars:
        box(s, x, 230, 220, 190, [head] + lines, col=col, fill=fill, size=16)
    s.rect(60, 340, 680, 20, fill=F_GREY, stroke=MUTED, width=1.5, rx=4)
    note(s, "A. V. Dicey, Introduction to the Study of the Law of the Constitution (1885)", 384, size=14)
    return s


@fig
def checks_balances():
    s = Svg(800, 520, "Checks and balances among the three organs",
            "Each organ checks the others. The legislature makes laws, approves the budget and appointments, and can "
            "impeach the President. The executive can refuse assent to bills and appoints judges. The judiciary can declare "
            "laws and executive actions unconstitutional. Judges are appointed by the President but need Parliament's "
            "approval.")
    heading(s, "Each arm checks the other two")
    ex = box(s, 400, 110, 240, 70, ["Executive", "President and ministers"], col=BLUE, fill=F_BLUE, size=17)
    lg = box(s, 140, 400, 240, 70, ["Legislature", "Parliament"], col=GREEN, fill=F_GREEN, size=17)
    jd = box(s, 660, 400, 240, 70, ["Judiciary", "the courts"], col=ORANGE, fill=F_AMBER, size=17)
    s.line(300, 150, 175, 360, color=MUTED, width=2.2)
    s.line(500, 150, 625, 360, color=MUTED, width=2.2)
    s.line(265, 400, 535, 400, color=MUTED, width=2.2)
    s.label(170, 245, "approves budget, ministers;", size=13, color=GREEN)
    s.label(170, 265, "can impeach President", size=13, color=GREEN)
    s.label(310, 300, "refuses assent", size=13, color=BLUE)
    s.label(310, 320, "to bills", size=13, color=BLUE)
    s.label(630, 245, "appoints judges", size=13, color=BLUE)
    s.label(630, 265, "(Parliament approves)", size=13, color=BLUE)
    s.label(500, 310, "declares actions", size=13, color=ORANGE)
    s.label(500, 330, "unconstitutional", size=13, color=ORANGE)
    s.label(400, 380, "approves judicial appointments", size=13, color=GREEN)
    s.label(400, 425, "reviews laws (judicial review)", size=13, color=ORANGE)
    note(s, "Separation of powers divides the work; checks and balances stop any arm abusing it.", 498, size=14)
    return s


@fig
def rights_categories():
    s = Svg(800, 440, "Categories of human rights",
            "Civil and political rights (first generation): life, liberty, fair hearing, freedom of speech, religion, "
            "association and movement, the right to vote. Economic, social and cultural rights (second generation): work, "
            "education, health, an adequate standard of living. Collective or solidarity rights (third generation): "
            "development, peace, a healthy environment, self-determination.")
    heading(s, "Three generations of human rights")
    cols = [(140, "Civil and political", "1st generation", ["life and liberty", "fair hearing", "speech, religion,", "association, vote"], BLUE, F_BLUE),
            (400, "Economic, social, cultural", "2nd generation", ["work and fair pay", "education", "health care", "decent living"], GREEN, F_GREEN),
            (660, "Collective (solidarity)", "3rd generation", ["development", "peace", "clean environment", "self-determination"], ORANGE, F_AMBER)]
    for x, head, gen, items, col, fill in cols:
        box(s, x, 230, 230, 260, [head, gen] + items, col=col, fill=fill, size=16)
    note(s, "In Sierra Leone, Chapter III of the 1991 Constitution protects civil and political rights.", 420, size=14)
    return s


@fig
def citizenship_modes():
    s = Svg(800, 440, "How citizenship is acquired and lost",
            "Citizenship can be acquired by birth, by descent from a citizen parent, by registration (for example through "
            "marriage to a citizen), by naturalisation after lawful residence and good conduct, or as an honour. It can be "
            "lost by renunciation or by deprivation (for example for fraud in obtaining it).")
    heading(s, "Becoming, and ceasing to be, a citizen")
    c = box(s, 400, 220, 200, 70, ["CITIZEN"], col=PURPLE, fill=F_PURPLE, size=22)
    ways = [(130, 110, "By birth", ["born in the state"]), (400, 95, "By descent", ["a parent is a citizen"]),
            (670, 110, "By registration", ["e.g. through marriage"]), (150, 330, "By naturalisation", ["long lawful residence,", "good conduct, oath"]),
            (650, 330, "Honorary", ["granted as an honour"])]
    for x, y, head, lines in ways:
        b = box(s, x, y, 220, 70 if len(lines) == 1 else 84, [head] + lines, col=GREEN, fill=F_GREEN, size=15)
        link(s, b, c, color=GREEN)
    lost = box(s, 400, 370, 260, 70, ["Lost by", "renunciation or deprivation"], col=RED, fill=F_RED, size=15)
    link(s, c, lost, color=RED)
    return s


@fig
def constitution_sources_types():
    s = Svg(800, 500, "Sources and types of constitutions",
            "Sources of a constitution: constitutional conferences and constituent assemblies, statutes (acts of the "
            "legislature), judicial precedents, conventions, historical documents, customs and traditions, and the works of "
            "constitutional experts. Types: written or unwritten, rigid or flexible, unitary or federal, presidential or "
            "parliamentary, monarchical or republican.")
    heading(s, "Where constitutions come from, and their types")
    s.text(200, 76, "Sources", size=18, weight="bold", color=BLUE)
    srcs = ["Constitutional conferences", "Statutes (Acts of Parliament)", "Judicial precedents", "Conventions",
            "Historical documents", "Customs and traditions", "Works of experts"]
    for k, t in enumerate(srcs):
        box(s, 200, 116 + k * 52, 300, 42, [t], col=BLUE, fill=F_BLUE, size=15, bold_first=False)
    s.text(600, 76, "Types", size=18, weight="bold", color=ORANGE)
    pairs = [("Written", "Unwritten"), ("Rigid", "Flexible"), ("Unitary", "Federal"), ("Presidential", "Parliamentary"),
             ("Republican", "Monarchical")]
    for k, (a, b) in enumerate(pairs):
        y = 116 + k * 66
        box(s, 540, y, 130, 46, [a], col=ORANGE, fill=F_AMBER, size=15)
        box(s, 680, y, 130, 46, [b], col=ORANGE, fill="#ffffff", size=15)
    note(s, "Sierra Leone's 1991 Constitution: written, rigid, unitary, presidential and republican.", 482, size=14)
    return s


@fig
def amendment_process():
    s = Svg(800, 470, "Amending Sierra Leone's 1991 Constitution",
            "A bill to alter the Constitution must be supported by at least two-thirds of all Members of Parliament at its "
            "second and third readings. For the entrenched provisions, it must also be approved at a referendum in which at "
            "least half of the registered voters vote in favour and at least two-thirds of the valid votes cast support it. "
            "It then goes to the President for assent.")
    heading(s, "A rigid constitution: two hurdles, sometimes three")
    b1 = box(s, 400, 100, 420, 60, ["Bill to alter the Constitution", "published and introduced in Parliament"], col=INK, fill=F_GREY, size=15)
    b2 = box(s, 400, 200, 420, 66, ["Parliament: at least two-thirds of all MPs", "at the second and third readings"], col=BLUE, fill=F_BLUE, size=15)
    b3 = box(s, 560, 310, 360, 84, ["Entrenched provisions only:", "referendum: half of registered voters", "and two-thirds of valid votes in favour"], col=ORANGE, fill=F_AMBER, size=14)
    b4 = box(s, 220, 410, 300, 60, ["Presidential assent", "the amendment becomes law"], col=GREEN, fill=F_GREEN, size=15)
    link(s, b1, b2, color=MUTED)
    link(s, b2, b3, color=ORANGE)
    arrow(s, 300, 234, 230, 378, color=MUTED)
    s.label(225, 300, "other provisions", size=13, color=MUTED)
    arrow(s, 470, 352, 370, 410, color=ORANGE)
    return s


# ═══ Group 3: political processes and public administration ══════════════════

@fig
def party_systems():
    s = Svg(800, 430, "Party systems",
            "In a one-party system only one party is allowed or effectively exists, as in Sierra Leone under the 1978 "
            "Constitution. In a two-party system two major parties alternate in power, as in the USA. In a multi-party "
            "system many parties compete and may form coalitions; Sierra Leone today is multi-party, though the SLPP and "
            "the APC dominate.")
    heading(s, "One, two or many parties?")
    cols = [(140, "One-party", BLUE, F_BLUE, 1, ["only one party allowed", "or effectively exists", "", "Sierra Leone 1978–1991"]),
            (400, "Two-party", GREEN, F_GREEN, 2, ["two big parties", "take turns in power", "", "USA (Democrats,", "Republicans)"]),
            (660, "Multi-party", ORANGE, F_AMBER, 5, ["many parties compete;", "coalitions possible", "", "Sierra Leone since 1991,", "Nigeria, Ghana"])]
    for cx, name, col, fill, n, lines in cols:
        s.rect(cx - 120, 60, 240, 340, fill="#ffffff", stroke=col, width=2.5, rx=14)
        s.text(cx, 90, name, size=19, weight="bold", color=col)
        sizes = {1: [70], 2: [52, 46], 5: [40, 34, 22, 18, 14]}[n]
        xs = {1: [cx], 2: [cx - 50, cx + 50], 5: [cx - 85, cx - 35, cx + 10, cx + 48, cx + 82]}[n]
        for x, r in zip(xs, sizes):
            s.circle(x, 175, r * 0.62, fill=fill, stroke=col, width=2.2)
        for k, t in enumerate(lines):
            s.text(cx, 262 + k * 24, t, size=15, color=INK if k < 2 else MUTED, weight="bold" if k >= 3 else "normal")
    note(s, "Circle size shows a party's share of support.", 418, size=13)
    return s


@fig
def pressure_groups():
    s = Svg(800, 480, "Types and methods of pressure groups",
            "Interest (sectional or protective) groups defend their members, such as trade unions and professional "
            "bodies. Promotional (cause) groups promote an idea, such as human rights or women's representation. "
            "Institutional groups are bodies within government or society, such as religious councils. Anomic groups "
            "arise suddenly, such as spontaneous protests. Methods include lobbying, petitions, media campaigns, "
            "strikes, demonstrations, court action and boycotts.")
    heading(s, "Pressure groups: who they are and how they act")
    types = [(110, "Interest", ["(sectional)", "defend members:", "SLTU, Labour", "Congress, Bar"]),
             (305, "Promotional", ["(cause)", "promote an idea:", "50/50 Group,", "rights groups"]),
             (500, "Institutional", ["inside society", "or the state:", "Inter-Religious", "Council"]),
             (695, "Anomic", ["sudden and", "unorganised:", "spontaneous", "street protests"])]
    for x, head, lines in types:
        box(s, x, 150, 180, 140, [head] + lines, col=BLUE, fill=F_BLUE, size=15)
    s.text(400, 255, "Methods", size=18, weight="bold", color=ORANGE)
    methods = ["lobbying officials", "petitions", "press and radio", "strikes", "demonstrations",
               "court action", "boycotts", "funding candidates"]
    for k, m in enumerate(methods):
        x = 110 + (k % 4) * 195
        y = 300 + (k // 4) * 60
        box(s, x, y, 180, 44, [m], col=ORANGE, fill=F_AMBER, size=15, bold_first=False)
    note(s, "Pressure groups seek to influence policy; unlike parties, they do not seek to form a government.", 455, size=14)
    return s


@fig
def opinion_formation():
    s = Svg(800, 480, "How public opinion is formed and measured",
            "Public opinion is shaped by agents such as the family, school, mass media, religious bodies, political "
            "parties, pressure groups, peer groups and government. It is expressed and measured through elections, "
            "opinion polls, referendums, letters and phone-in programmes, demonstrations and social media.")
    heading(s, "Shaping and measuring public opinion")
    po = box(s, 400, 262, 200, 80, ["PUBLIC", "OPINION"], col=PURPLE, fill=F_PURPLE, size=20)
    s.text(130, 70, "Formed by", size=17, weight="bold", color=BLUE)
    agents = ["family", "school", "mass media", "religious bodies", "parties", "pressure groups", "peer groups"]
    for k, a in enumerate(agents):
        y = 105 + k * 52
        box(s, 130, y, 190, 40, [a], col=BLUE, fill=F_BLUE, size=15, bold_first=False)
        s.line(225, y, 262, y, color=BLUE, width=2)
    s.line(262, 105, 262, 417, color=BLUE, width=2.4)
    arrow(s, 262, 262, 294, 262, color=BLUE)
    s.text(670, 70, "Measured by", size=17, weight="bold", color=GREEN)
    meas = ["elections", "opinion polls", "referendums", "phone-ins, letters", "demonstrations", "social media"]
    for k, a in enumerate(meas):
        y = 110 + k * 60
        box(s, 670, y, 190, 42, [a], col=GREEN, fill=F_GREEN, size=15, bold_first=False)
        arrow(s, 540, y, 571, y, color=GREEN)
    s.line(540, 110, 540, 410, color=GREEN, width=2.4)
    s.line(500, 262, 540, 262, color=GREEN, width=2.4)
    return s


@fig
def media_roles():
    s = Svg(800, 470, "The mass media: forms, roles and threats",
            "The mass media include print (newspapers, magazines), broadcast (radio, television) and online media "
            "(news sites, social media). Their roles are to inform, educate, act as a watchdog on government, set the "
            "agenda, provide a platform for debate, mobilise citizens and entertain. Threats include censorship, "
            "ownership by politicians, poor pay and bribery, harassment of journalists and fake news.")
    heading(s, "The mass media in a democracy")
    forms = [(150, "Print", "newspapers, magazines"), (400, "Broadcast", "radio, television"), (650, "Online", "news sites, social media")]
    for x, a, b in forms:
        box(s, x, 90, 220, 56, [a, b], col=BLUE, fill=F_BLUE, size=15)
    s.text(230, 150, "Roles", size=17, weight="bold", color=GREEN)
    roles = ["inform", "educate", "watchdog on power", "set the agenda", "platform for debate", "mobilise citizens", "entertain"]
    for k, r in enumerate(roles):
        box(s, 230, 182 + k * 38, 260, 32, [r], col=GREEN, fill=F_GREEN, size=15, bold_first=False)
    s.text(580, 150, "Threats", size=17, weight="bold", color=RED)
    thr = ["censorship and harsh laws", "political ownership", "poor pay, bribery", "attacks on journalists", "fake news"]
    for k, r in enumerate(thr):
        box(s, 580, 182 + k * 38, 280, 32, [r], col=RED, fill=F_RED, size=15, bold_first=False)
    return s


@fig
def election_process():
    s = Svg(800, 500, "Stages in the conduct of an election",
            "The electoral commission delimits constituencies, registers voters and displays the register, receives "
            "nominations of candidates, oversees the campaign, conducts polling by secret ballot, counts and collates "
            "the votes, and declares the results. Disputes are settled by election petitions in the courts.")
    heading(s, "How an election is run")
    steps = [("1. Delimitation", "boundaries of constituencies"), ("2. Voter registration", "register compiled and displayed"),
             ("3. Nomination", "candidates file papers and fees"), ("4. Campaign", "rallies, manifestos, debates"),
             ("5. Polling", "secret ballot at polling stations"), ("6. Counting", "votes counted and collated"),
             ("7. Declaration", "results announced"), ("8. Petitions", "courts settle disputes")]
    for k, (a, b) in enumerate(steps):
        x = 210 if k < 4 else 590
        y = 100 + (k % 4) * 100
        col, fill = (BLUE, F_BLUE) if k < 4 else (GREEN, F_GREEN)
        if k == 7:
            col, fill = ORANGE, F_AMBER
        box(s, x, y, 320, 64, [a, b], col=col, fill=fill, size=15)
        if k % 4 != 3:
            arrow(s, x, y + 33, x, y + 66, color=MUTED)
    s.path("M 370 400 C 400 400, 400 100, 412 100", color=MUTED, width=2.6)
    arrow(s, 408, 100, 428, 100, color=MUTED)
    note(s, "In Sierra Leone the Electoral Commission (ECSL) runs elections; the PPRC regulates parties.", 482, size=14)
    return s


@fig
def fptp_vs_pr():
    s = Svg(800, 470, "First-past-the-post compared with proportional representation",
            "Illustration with ten seats. Party A wins 46% of the votes, B 34% and C 20%. Under first-past-the-post, "
            "A might win 7 seats, B 3 and C none, because only the leading candidate in each constituency wins. Under "
            "proportional representation the seats follow the vote shares: A 5, B 3, C 2.")
    heading(s, "Same votes, different seats (10 seats)")
    parties = [("A", 46, BLUE, F_BLUE), ("B", 34, GREEN, F_GREEN), ("C", 20, ORANGE, F_AMBER)]
    s.text(130, 80, "Votes", size=17, weight="bold", color=INK)
    for k, (p, v, col, fill) in enumerate(parties):
        y = 120 + k * 56
        s.text(60, y, p, size=18, weight="bold", color=col)
        s.rect(80, y - 16, v * 3.2, 32, fill=fill, stroke=col, width=2, rx=4)
        s.text(80 + v * 3.2 + 26, y, f"{v}%", size=15, color=INK, weight="bold")
    def seats(x0, title_, counts, y0):
        s.text(x0 + 110, y0 - 40, title_, size=17, weight="bold", color=INK)
        k = 0
        for (p, v, col, fill), n in zip(parties, counts):
            for _ in range(n):
                cx = x0 + (k % 5) * 46
                cy = y0 + (k // 5) * 50
                s.circle(cx, cy, 18, fill=fill, stroke=col, width=2.4)
                s.text(cx, cy + 1, p, size=14, weight="bold", color=col)
                k += 1
        s.text(x0 + 92, y0 + 100, "  ".join(f"{p} {n}" for (p, *_), n in zip(parties, counts)), size=15, color=MUTED, weight="bold")
    seats(470, "First-past-the-post", [7, 3, 0], 120)
    seats(470, "Proportional representation", [5, 3, 2], 330)
    s.text(200, 330, "FPTP: the winner in each", size=15, color=INK)
    s.text(200, 352, "constituency takes the seat;", size=15, color=INK)
    s.text(200, 374, "small parties lose out.", size=15, color=INK)
    s.text(200, 408, "PR: seats follow vote shares.", size=15, color=INK)
    return s


@fig
def ministry_structure():
    s = Svg(800, 470, "Structure of a ministry in Sierra Leone",
            "A ministry is headed politically by a minister, assisted by deputy ministers. The permanent secretary is the "
            "administrative head and accounting officer, and a professional head (such as a chief medical officer) leads "
            "the technical staff. Directors head divisions, which reach down to district offices. The Secretary to the "
            "Cabinet is Head of the Civil Service, and the Public Service Commission handles appointments.")
    heading(s, "Who runs a ministry?")
    mn = box(s, 400, 95, 300, 58, ["Minister", "political head (appointed)"], col=BLUE, fill=F_BLUE, size=16)
    dm = box(s, 400, 180, 300, 50, ["Deputy Minister(s)"], col=BLUE, fill="#ffffff", size=15)
    ps = box(s, 265, 275, 250, 66, ["Permanent Secretary", "administrative head,", "accounting officer"], col=GREEN, fill=F_GREEN, size=14)
    ph = box(s, 565, 275, 250, 66, ["Professional head", "e.g. Chief Medical Officer,", "Chief Education Officer"], col=GREEN, fill=F_GREEN, size=14)
    dr = box(s, 400, 370, 420, 50, ["Directors and divisions"], col=TEAL, fill=F_TEAL, size=15)
    ds = box(s, 400, 440, 420, 44, ["District and field offices"], col=TEAL, fill="#ffffff", size=15)
    link(s, mn, dm, color=MUTED)
    link(s, dm, ps, color=MUTED)
    link(s, dm, ph, color=MUTED)
    link(s, ps, dr, color=MUTED)
    link(s, ph, dr, color=MUTED)
    link(s, dr, ds, color=MUTED)
    s.text(20, 95, "political", size=14, weight="bold", color=BLUE, anchor="start")
    s.text(20, 266, "permanent", size=14, weight="bold", color=GREEN, anchor="start")
    s.text(20, 284, "civil service", size=14, weight="bold", color=GREEN, anchor="start")
    return s


@fig
def civil_service_control():
    s = Svg(800, 450, "Controls on the civil service",
            "The civil service is controlled by ministers, Parliament (questions and the Public Accounts Committee), the "
            "courts, the Public Service Commission, the Auditor-General, the Anti-Corruption Commission, the Ombudsman, "
            "and the press and public opinion.")
    heading(s, "Keeping the civil service accountable")
    c = box(s, 400, 240, 220, 70, ["Civil", "service"], col=GREEN, fill=F_GREEN, size=20)
    items = [(130, 100, "Ministers", "direct and supervise"), (400, 90, "Parliament", "questions, Public Accounts"),
             (670, 100, "The courts", "judicial review, suits"), (110, 240, "Public Service", "Commission: discipline"),
             (690, 240, "Auditor-General", "audits spending"), (130, 380, "Anti-Corruption", "Commission"),
             (400, 395, "Ombudsman", "complaints of injustice"), (670, 380, "Press and", "public opinion")]
    for x, y, a, b in items:
        bb = box(s, x, y, 210, 60, [a, b], col=BLUE, fill=F_BLUE, size=15)
        link(s, bb, c, color=MUTED, width=1.8)
    return s


@fig
def sl_local_government():
    s = Svg(800, 500, "Local government structure in Sierra Leone",
            "The Ministry of Local Government oversees local councils: district councils in rural areas and city or "
            "municipal councils in towns. Councillors are elected; mayors and council chairpersons are directly "
            "elected. Wards have ward committees. In the provinces, chiefdoms are governed by Paramount Chiefs and "
            "chiefdom councils, down to section and town chiefs.")
    heading(s, "Two strands of local administration")
    mn = box(s, 400, 88, 400, 56, ["Ministry of Local Government", "oversight, grants, policy"], col=PURPLE, fill=F_PURPLE, size=15)
    s.text(215, 162, "Elected local councils", size=16, weight="bold", color=BLUE)
    s.text(590, 162, "Traditional authority", size=16, weight="bold", color=ORANGE)
    arrow(s, 300, 118, 240, 146, color=MUTED)
    arrow(s, 500, 118, 565, 146, color=MUTED)
    lc = box(s, 215, 225, 300, 84, ["Local councils", "district councils (rural)", "city / municipal councils"], col=BLUE, fill=F_BLUE, size=15)
    hd = box(s, 215, 330, 300, 60, ["Mayor or Chairperson", "directly elected"], col=BLUE, fill="#ffffff", size=15)
    wc = box(s, 215, 420, 300, 60, ["Wards and ward committees", "councillors elected"], col=BLUE, fill=F_BLUE, size=15)
    pc = box(s, 590, 225, 300, 84, ["Paramount Chief", "and chiefdom council", "(190 chiefdoms)"], col=ORANGE, fill=F_AMBER, size=15)
    sc = box(s, 590, 330, 300, 60, ["Section chiefs"], col=ORANGE, fill="#ffffff", size=15)
    tc = box(s, 590, 420, 300, 60, ["Town and village chiefs"], col=ORANGE, fill=F_AMBER, size=15)
    link(s, lc, hd, color=BLUE)
    link(s, hd, wc, color=BLUE)
    link(s, pc, sc, color=ORANGE)
    link(s, sc, tc, color=ORANGE)
    s.line(400, 150, 400, 470, color=MUTED, width=1.5, dash="6 6")
    return s


@fig
def decentralisation_forms():
    s = Svg(800, 420, "Centralisation and forms of decentralisation",
            "Power can be centralised in the capital or decentralised. Deconcentration moves central officials to the "
            "districts but keeps decisions at the centre. Delegation hands specific tasks to bodies such as public "
            "corporations. Devolution transfers real legal powers and resources to elected local councils, as Sierra "
            "Leone's Local Government Act does.")
    heading(s, "How far is power moved from the centre?")
    arrow(s, 70, 330, 740, 330, color=MUTED, width=3)
    s.text(70, 360, "power stays at the centre", size=14, color=MUTED, anchor="start")
    s.text(740, 360, "power moved to local bodies", size=14, color=MUTED, anchor="end")
    items = [(140, "Centralisation", ["all decisions", "made in the capital"], RED, F_RED),
             (320, "Deconcentration", ["central officials", "posted to districts"], ORANGE, F_AMBER),
             (500, "Delegation", ["tasks handed to", "agencies, corporations"], TEAL, F_TEAL),
             (680, "Devolution", ["legal powers and", "money to elected councils"], GREEN, F_GREEN)]
    for x, head, lines, col, fill in items:
        box(s, x, 200, 170, 150, [head] + lines, col=col, fill=fill, size=15)
        s.line(x, 278, x, 322, color=col, width=2.2)
        s.dot(x, 330, r=7, color=col)
    note(s, "Decentralisation = deconcentration, delegation or devolution.", 400, size=14)
    return s


@fig
def enterprise_types():
    s = Svg(800, 470, "Government department, public corporation and private company",
            "A government department is part of a ministry, financed from the budget and run by civil servants under a "
            "minister. A public corporation is created by an Act, owned by the state, run by a board with day-to-day "
            "independence, and aims to provide a service at reasonable cost. A private company is owned by shareholders "
            "and run for profit.")
    heading(s, "Three ways to run an enterprise")
    rows = ["Created by", "Owned by", "Managed by", "Financed by", "Main aim"]
    cols = [(300, "Government", "department", BLUE, F_BLUE, ["a ministry", "the state", "civil servants", "the budget", "public service"]),
            (500, "Public", "corporation", GREEN, F_GREEN, ["an Act of Parliament", "the state", "a board", "own revenue + grants", "service at fair cost"]),
            (700, "Private", "company", ORANGE, F_AMBER, ["registration", "shareholders", "directors", "shares, loans, profit", "profit"])]
    for k, r in enumerate(rows):
        s.text(110, 160 + k * 58, r, size=15, weight="bold", color=INK)
    for x, h1, h2, col, fill, vals in cols:
        box(s, x, 92, 180, 60, [h1, h2], col=col, fill=fill, size=16)
        for k, v in enumerate(vals):
            box(s, x, 160 + k * 58, 180, 44, [v], col=col, fill="#ffffff", size=14, bold_first=False)
    note(s, "Sierra Leone examples: Guma Valley Water Company, EDSA, SLBC, NASSIT (public corporations).", 452, size=14)
    return s


@fig
def corporation_control():
    s = Svg(800, 450, "How public corporations are controlled",
            "Public corporations are controlled by the minister (appoints the board and gives general directions), "
            "Parliament (creates them by Act, debates their reports and examines accounts through committees), the "
            "Auditor-General (audits accounts), the courts (they can sue and be sued), consumers and the press, and "
            "regulators that set tariffs and standards.")
    heading(s, "Who keeps a public corporation in check?")
    c = box(s, 400, 235, 250, 80, ["Public corporation", "board of directors"], col=GREEN, fill=F_GREEN, size=17)
    items = [(140, 95, "Minister", ["appoints the board,", "general directions"]),
             (660, 95, "Parliament", ["creates it by Act;", "debates its reports"]),
             (120, 235, "Auditor-General", ["audits accounts"]),
             (680, 235, "Courts", ["it can sue and", "be sued"]),
             (140, 380, "Regulators", ["set tariffs and", "standards"]),
             (660, 380, "Consumers, press", ["complaints and", "public pressure"])]
    for x, y, head, lines in items:
        b = box(s, x, y, 220, 80 if len(lines) == 2 else 58, [head] + lines, col=BLUE, fill=F_BLUE, size=15)
        link(s, b, c, color=MUTED)
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
