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


# ═══ Group 4: Sierra Leone political history ════════════════════════════════

def timeline(s: Svg, items, x=170, y0=84, step=56, col=BLUE, size=15, text_w=None):
    """Vertical timeline: items are (year, line1, line2|None, colour|None)."""
    y_end = y0 + step * (len(items) - 1)
    s.line(x, y0 - 16, x, y_end + 16, color=MUTED, width=3)
    for k, it in enumerate(items):
        yr, l1, l2 = it[0], it[1], it[2]
        c = it[3] if len(it) > 3 and it[3] else col
        y = y0 + k * step
        s.circle(x, y, 9, fill="#ffffff", stroke=c, width=3)
        s.text(x - 22, y, yr, size=size + 1, weight="bold", color=c, anchor="end")
        if l2:
            s.text(x + 24, y - 10, l1, size=size, weight="bold", color=INK, anchor="start")
            s.text(x + 24, y + 11, l2, size=size - 1, color=MUTED, anchor="start")
        else:
            s.text(x + 24, y, l1, size=size, weight="bold", color=INK, anchor="start")


@fig
def mende_structure():
    s = Svg(800, 500, "Political organisation of the Mende before colonial rule",
            "Mende country was divided into many independent chiefdoms. Each was ruled by a chief (mahei), chosen from "
            "ruling families and advised by a council of elders and sub-chiefs, with a speaker as the chief's deputy and "
            "spokesman. Section chiefs, town chiefs and village heads ruled smaller units. The Poro society made laws, "
            "settled disputes, regulated war and trade and checked the chief; the Sande society trained girls. Warriors "
            "were important because chiefdoms often expanded by war.")
    heading(s, "A Mende chiefdom before colonial rule")
    ch = box(s, 400, 100, 280, 66, ["Chief (mahei)", "from a ruling family"], col=BLUE, fill=F_BLUE, size=17)
    co = box(s, 150, 200, 230, 70, ["Council of elders", "and sub-chiefs: advise"], col=GREEN, fill=F_GREEN, size=15)
    sp = box(s, 650, 200, 230, 70, ["Speaker", "chief's deputy and", "spokesman"], col=GREEN, fill=F_GREEN, size=15)
    se = box(s, 400, 220, 220, 56, ["Section chiefs"], col=BLUE, fill="#ffffff", size=16)
    tc = box(s, 400, 310, 220, 56, ["Town chiefs"], col=BLUE, fill="#ffffff", size=16)
    vh = box(s, 400, 400, 220, 56, ["Village heads"], col=BLUE, fill="#ffffff", size=16)
    link(s, ch, co, color=GREEN)
    link(s, ch, sp, color=GREEN)
    link(s, ch, se, color=BLUE)
    link(s, se, tc, color=BLUE)
    link(s, tc, vh, color=BLUE)
    po = box(s, 140, 360, 220, 110, ["Poro society", "laws, courts, war", "and trade; checks", "the chief"], col=ORANGE, fill=F_AMBER, size=15)
    wa = box(s, 660, 360, 220, 110, ["Warriors", "defence and", "expansion of", "the chiefdom"], col=RED, fill=F_RED, size=15)
    note(s, "Many small independent chiefdoms, not one Mende kingdom; women could rule.", 482, size=14)
    return s


@fig
def temne_structure():
    s = Svg(800, 500, "Political organisation of the Temne before colonial rule",
            "Temne chiefdoms were ruled by a paramount chief with titles such as Bai or Obai, chosen from ruling houses. "
            "Before installation the chief-elect went through kantha, a period of seclusion and instruction directed by "
            "societies such as the Ragbenle or Poro. The chief was regarded as sacred and was advised by title-holders "
            "and elders; sub-chiefs ruled sections, towns and villages.")
    heading(s, "A Temne chiefdom before colonial rule")
    so = box(s, 150, 105, 240, 90, ["Ragbenle / Poro", "select and install", "the chief"], col=ORANGE, fill=F_AMBER, size=15)
    ka = box(s, 400, 105, 200, 90, ["Kantha", "seclusion and", "instruction"], col=PURPLE, fill=F_PURPLE, size=15)
    ch = box(s, 650, 105, 240, 90, ["Paramount chief", "titles: Bai, Obai;", "sacred ruler"], col=BLUE, fill=F_BLUE, size=15)
    arrow(s, 272, 105, 296, 105, color=ORANGE)
    arrow(s, 502, 105, 526, 105, color=PURPLE)
    tt = box(s, 400, 250, 250, 70, ["Title-holders, elders", "advise the chief"], col=GREEN, fill=F_GREEN, size=15)
    sc = box(s, 650, 250, 220, 56, ["Sub-chiefs"], col=BLUE, fill="#ffffff", size=16)
    tc = box(s, 650, 340, 220, 56, ["Town chiefs"], col=BLUE, fill="#ffffff", size=16)
    vh = box(s, 650, 430, 220, 56, ["Village heads"], col=BLUE, fill="#ffffff", size=16)
    link(s, ch, tt, color=GREEN)
    link(s, ch, sc, color=BLUE)
    link(s, sc, tc, color=BLUE)
    link(s, tc, vh, color=BLUE)
    box(s, 140, 330, 230, 110, ["Rituals and", "religion bind", "chief and people;", "Islam in the north"], col=TEAL, fill=F_TEAL, size=15)
    return s


@fig
def colonial_timeline():
    s = Svg(800, 560, "Key dates in the making of colonial Sierra Leone",
            "1787 settlers arrive at the Province of Freedom; 1792 Nova Scotian settlers and Freetown under the Sierra "
            "Leone Company; 1800 Jamaican Maroons arrive; 1808 Sierra Leone becomes a British Crown Colony; from 1808 "
            "Liberated Africans are landed in Freetown; 1863 Executive and Legislative Councils; 1896 the hinterland is "
            "declared a Protectorate; 1898 the Hut Tax War.")
    heading(s, "From settlement to Colony and Protectorate")
    timeline(s, [("1787", "Black Poor settlers: Province of Freedom", "sponsored by abolitionists such as Granville Sharp", None),
                 ("1792", "Nova Scotian settlers; Freetown founded", "run by the Sierra Leone Company", None),
                 ("1800", "Jamaican Maroons arrive", None, None),
                 ("1808", "Sierra Leone becomes a Crown Colony", "Liberated Africans landed in Freetown", RED),
                 ("1863", "Executive and Legislative Councils", "created for the Colony", None),
                 ("1896", "Protectorate declared over the hinterland", "ruled indirectly through chiefs", RED),
                 ("1898", "Hut Tax War", "Bai Bureh in the north; rising in Mende country", ORANGE),
                 ("1924", "Slater Constitution", "first elected members", None)],
             x=150, y0=88, step=62)
    return s


@fig
def indirect_rule_chain():
    s = Svg(800, 500, "Indirect rule in the Sierra Leone Protectorate",
            "Under indirect rule, orders passed from the Secretary of State for the Colonies in London to the Governor in "
            "Freetown, then to District Commissioners in the Protectorate districts, then to the paramount chiefs, who "
            "ruled their people through traditional institutions, collected tax, kept order and ran native courts.")
    heading(s, "The chain of command under indirect rule")
    chain = [("Secretary of State for the Colonies", "London: overall policy", PURPLE, F_PURPLE),
             ("Governor", "Freetown: head of the colonial government", BLUE, F_BLUE),
             ("District Commissioners", "British officers supervising each district", BLUE, F_BLUE),
             ("Paramount Chiefs", "rule chiefdoms; collect tax; keep order; courts", ORANGE, F_AMBER),
             ("Sub-chiefs and people", "section, town and village chiefs", GREEN, F_GREEN)]
    prev = None
    for k, (a, b, col, fill) in enumerate(chain):
        bb = box(s, 400, 95 + k * 88, 480, 64, [a, b], col=col, fill=fill, size=16)
        if prev:
            link(s, prev, bb, color=MUTED)
        prev = bb
    s.text(712, 270, "British", size=14, weight="bold", color=BLUE, anchor="start")
    s.text(712, 288, "officials", size=14, weight="bold", color=BLUE, anchor="start")
    s.text(712, 400, "African", size=14, weight="bold", color=ORANGE, anchor="start")
    s.text(712, 418, "rulers", size=14, weight="bold", color=ORANGE, anchor="start")
    return s


@fig
def slater_legco():
    s = Svg(800, 470, "The Legislative Council under the 1924 Slater Constitution",
            "The Governor presided over a Legislative Council with an official majority. For the first time three "
            "members were elected, by Colony voters on a limited franchise (two for Freetown, one for the rural Colony), "
            "and three Paramount Chiefs were nominated to represent the Protectorate. Other unofficial members were "
            "nominated by the Governor.")
    heading(s, "Legislative Council, 1924")
    box(s, 400, 90, 300, 56, ["Governor", "presides; can veto"], col=PURPLE, fill=F_PURPLE, size=16)
    box(s, 400, 185, 600, 70, ["Official members (the majority)", "colonial officials who vote with the Governor"], col=BLUE, fill=F_BLUE, size=16)
    s.text(400, 255, "Unofficial members", size=17, weight="bold", color=INK)
    box(s, 160, 330, 220, 100, ["3 elected", "Colony voters,", "limited franchise"], col=GREEN, fill=F_GREEN, size=16)
    box(s, 400, 330, 220, 100, ["3 Paramount", "Chiefs", "nominated"], col=ORANGE, fill=F_AMBER, size=16)
    box(s, 640, 330, 220, 100, ["Others", "nominated by", "the Governor"], col=MUTED, fill=F_GREY, size=16)
    note(s, "First elected members and first Protectorate voice, but power stayed with officials.", 440, size=14)
    return s


@fig
def self_government_steps():
    s = Svg(800, 560, "Steps towards self-government in Sierra Leone",
            "1863 Executive and Legislative Councils. 1924 Slater Constitution: first elected members. 1951 constitution: "
            "African majority in the Legislative Council, with Protectorate members. 1953 ministerial system. 1956 "
            "constitution: House of Representatives; 1957 elections. 1958: Premier and an all-Sierra Leonean Executive "
            "Council. 1960 Lancaster House conference. 27 April 1961 independence.")
    heading(s, "Constitutional steps to independence")
    timeline(s, [("1863", "Executive and Legislative Councils", "officials and nominated members only", None),
                 ("1924", "Slater Constitution", "first 3 elected members; 3 chiefs nominated", None),
                 ("1951", "Stevenson / Beresford-Stooke Constitution", "African majority; Protectorate represented", GREEN),
                 ("1953", "Ministerial system", "Africans head government departments", GREEN),
                 ("1956", "House of Representatives replaces LegCo", "elections held in 1957", GREEN),
                 ("1958", "Premier; all-Sierra Leonean Executive Council", "internal self-government", GREEN),
                 ("1960", "Lancaster House conference, London", "independence terms agreed", ORANGE),
                 ("1961", "Independence, 27 April", "Sir Milton Margai, Prime Minister", RED)],
             x=150, y0=88, step=62)
    return s


@fig
def nationalism_causes():
    s = Svg(800, 480, "Causes of nationalism in Sierra Leone",
            "Nationalism grew from racial discrimination and exclusion of Africans from senior posts, economic "
            "exploitation and colonial taxes, the spread of Western education, the effects of the Second World War "
            "(ex-servicemen and the Atlantic Charter), the press, Pan-Africanism and the independence of India (1947) "
            "and Ghana (1957), and the Colony–Protectorate divide.")
    heading(s, "Why Sierra Leoneans demanded self-rule")
    c = box(s, 400, 250, 210, 76, ["NATIONALISM"], col=PURPLE, fill=F_PURPLE, size=19)
    items = [(130, 95, "Discrimination", ["Africans kept out", "of senior posts"]),
             (400, 90, "Economic grievances", ["low prices, taxes,", "foreign firms"]),
             (670, 95, "Western education", ["educated elite,", "ideas of liberty"]),
             (115, 250, "Second World War", ["ex-servicemen;", "Atlantic Charter"]),
             (685, 250, "The press", ["newspapers spread", "ideas"]),
             (130, 405, "Pan-Africanism", ["Garvey, Du Bois,", "Wallace-Johnson"]),
             (400, 410, "Example of others", ["India 1947,", "Ghana 1957"]),
             (670, 405, "Colonial taxes", ["Hut Tax War memory;", "1955–56 riots"])]
    for x, y, head, lines in items:
        b = box(s, x, y, 220, 80, [head] + lines, col=BLUE, fill=F_BLUE, size=15)
        link(s, b, c, color=MUTED, width=1.8)
    return s


@fig
def independence_road():
    s = Svg(800, 560, "The road to independence, 1938 to 1961",
            "1938 West African Youth League (Wallace-Johnson). 1950 National Council of Sierra Leone. 1951 SLPP founded "
            "and wins the election. 1955 Freetown strike and riots; 1955–56 tax riots in the north. 1957 general "
            "election won by the SLPP. 1958 Albert Margai and Siaka Stevens form the PNP. 1960 United National Front and "
            "the Lancaster House conference; Stevens refuses to sign and forms the APC. 27 April 1961 independence.")
    heading(s, "Movements, parties and milestones")
    timeline(s, [("1938", "West African Youth League branch", "I. T. A. Wallace-Johnson", None),
                 ("1950", "National Council of Sierra Leone", "Colony party (Bankole-Bright)", None),
                 ("1951", "SLPP founded; wins the election", "Dr Milton Margai", GREEN),
                 ("1955", "Freetown strike and riots", "followed by tax riots in the north", ORANGE),
                 ("1957", "General election", "SLPP wins most seats", GREEN),
                 ("1958", "People's National Party (PNP)", "Albert Margai and Siaka Stevens", None),
                 ("1960", "United Front; Lancaster House", "Stevens refuses to sign; APC formed", RED),
                 ("1961", "Independence, 27 April", None, RED)],
             x=150, y0=88, step=62)
    return s


@fig
def constitution_1961():
    s = Svg(800, 500, "The structure of government under the 1961 Constitution",
            "At independence the British monarch remained head of state, represented by a Governor-General. Executive "
            "power lay with the Prime Minister and Cabinet, drawn from and responsible to the House of Representatives, "
            "which included elected members and Paramount Chief members. The judiciary included the Supreme Court and the "
            "Court of Appeal, with final appeals to the Judicial Committee of the Privy Council in London.")
    heading(s, "Independence Constitution, 1961: a parliamentary system")
    q = box(s, 400, 88, 360, 56, ["The British monarch", "head of state"], col=PURPLE, fill=F_PURPLE, size=16)
    gg = box(s, 400, 175, 360, 56, ["Governor-General", "represents the monarch (ceremonial)"], col=PURPLE, fill="#ffffff", size=15)
    pm = box(s, 400, 270, 360, 64, ["Prime Minister and Cabinet", "real executive power"], col=BLUE, fill=F_BLUE, size=16)
    hr = box(s, 400, 370, 400, 64, ["House of Representatives", "elected members + Paramount Chief members"], col=GREEN, fill=F_GREEN, size=15)
    link(s, q, gg, color=PURPLE)
    link(s, gg, pm, color=MUTED)
    s.line(400, 302, 400, 338, color=GREEN, width=2.5)
    s.text(412, 320, "responsible to", size=13, color=MUTED, anchor="start")
    box(s, 115, 270, 190, 100, ["Courts", "Supreme Court,", "Court of Appeal"], col=ORANGE, fill=F_AMBER, size=15)
    box(s, 685, 270, 190, 100, ["Final appeal", "Privy Council,", "London"], col=RED, fill=F_RED, size=15)
    note(s, "Also: fundamental rights, Public Service Commission, entrenched clauses.", 460, size=14)
    return s


@fig
def events_1961_1971():
    s = Svg(800, 560, "Key political events from 1961 to 1971",
            "1961 independence under Sir Milton Margai. 1964 Milton Margai dies; Albert Margai becomes Prime Minister. "
            "1967 the APC wins the general election; Brigadier Lansana declares martial law; officers form the National "
            "Reformation Council. 1968 the Sergeants' revolt ends NRC rule and Siaka Stevens becomes Prime Minister. "
            "1971 attempted coup; Sierra Leone becomes a republic on 19 April and Stevens executive President.")
    heading(s, "From independence to republic")
    timeline(s, [("1961", "Independence", "Sir Milton Margai, Prime Minister (SLPP)", GREEN),
                 ("1964", "Milton Margai dies", "Albert Margai becomes Prime Minister", GREEN),
                 ("1966", "Albert Margai proposes a one-party state", "and a republic; strong opposition", ORANGE),
                 ("1967", "APC wins the election; Stevens sworn in", "Brigadier Lansana declares martial law", RED),
                 ("1967", "National Reformation Council (NRC)", "military rule, Juxon-Smith", RED),
                 ("1968", "Sergeants' revolt ends NRC rule", "Siaka Stevens becomes Prime Minister (APC)", BLUE),
                 ("1971", "Attempted coup (March)", None, ORANGE),
                 ("1971", "Republic declared, 19 April", "Stevens executive President", BLUE)],
             x=150, y0=88, step=62)
    return s


@fig
def republic_reasons():
    s = Svg(800, 450, "Why Sierra Leone became a republic in 1971",
            "Reasons included ending the British monarch's role as head of state, completing independence and national "
            "pride, ending appeals to the Privy Council, the APC's long-standing republican aims, the wish for a strong "
            "executive president to deal with coups and instability, and following the example of other African states.")
    heading(s, "Reasons for the 1971 republic")
    c = box(s, 400, 230, 220, 76, ["REPUBLIC", "19 April 1971"], col=PURPLE, fill=F_PURPLE, size=18)
    items = [(140, 95, "Full sovereignty", ["no foreign", "head of state"]),
             (660, 95, "National pride", ["a Sierra Leonean", "head of state"]),
             (120, 230, "Final court at home", ["end Privy Council", "appeals"]),
             (680, 230, "APC policy", ["long-standing", "republican aim"]),
             (140, 370, "Strong executive", ["deal with coups", "and instability"]),
             (660, 370, "African trend", ["Ghana 1960,", "others followed"])]
    for x, y, head, lines in items:
        b = box(s, x, y, 230, 80, [head] + lines, col=BLUE, fill=F_BLUE, size=15)
        link(s, b, c, color=MUTED)
    return s


@fig
def constitution_1971():
    s = Svg(800, 470, "The structure of government under the 1971 Republican Constitution",
            "The 1971 Constitution created an executive President who was both head of state and head of government, "
            "with a Vice-President and a Prime Minister to assist him, ministers, a unicameral House of Representatives "
            "with Paramount Chief members, and a Supreme Court as the final court of appeal, replacing the Privy Council.")
    heading(s, "Republican Constitution, 1971")
    pr = box(s, 400, 95, 420, 70, ["Executive President", "head of state AND head of government"], col=BLUE, fill=F_BLUE, size=16)
    vp = box(s, 180, 205, 240, 60, ["Vice-President"], col=BLUE, fill="#ffffff", size=15)
    pm = box(s, 400, 205, 160, 60, ["Prime Minister"], col=BLUE, fill="#ffffff", size=15)
    mn = box(s, 620, 205, 240, 60, ["Ministers / Cabinet"], col=BLUE, fill="#ffffff", size=15)
    for b in (vp, pm, mn):
        link(s, pr, b, color=BLUE)
    box(s, 230, 330, 330, 80, ["Parliament", "elected members +", "Paramount Chief members"], col=GREEN, fill=F_GREEN, size=15)
    box(s, 590, 330, 330, 80, ["Judiciary", "Supreme Court: final appeal", "(no more Privy Council)"], col=ORANGE, fill=F_AMBER, size=15)
    note(s, "Power concentrated in the President; it paved the way for the one-party state of 1978.", 448, size=14)
    return s


@fig
def one_party_1978():
    s = Svg(800, 500, "Government under the 1978 one-party Constitution",
            "The 1978 Constitution made the APC the only lawful party. Its national conference chose a single candidate "
            "for President, who served a seven-year term with a First and a Second Vice-President. All Members of "
            "Parliament had to be APC members, though several APC candidates could compete in a constituency. Opposition "
            "parties were banned.")
    heading(s, "The one-party state, 1978 to 1991")
    ap = box(s, 400, 95, 440, 70, ["All People's Congress (APC)", "the only lawful party"], col=RED, fill=F_RED, size=17)
    pr = box(s, 400, 200, 440, 70, ["President", "single party candidate; seven-year term"], col=BLUE, fill=F_BLUE, size=16)
    v1 = box(s, 240, 300, 260, 56, ["First Vice-President"], col=BLUE, fill="#ffffff", size=15)
    v2 = box(s, 560, 300, 260, 56, ["Second Vice-President"], col=BLUE, fill="#ffffff", size=15)
    pa = box(s, 400, 400, 520, 70, ["Parliament: APC members only", "several APC candidates could contest a seat"], col=GREEN, fill=F_GREEN, size=15)
    link(s, ap, pr, color=RED)
    link(s, pr, v1, color=BLUE)
    link(s, pr, v2, color=BLUE)
    s.path("M 180 95 C 60 95, 60 400, 140 400", color=RED, width=2.4)
    arrow(s, 130, 400, 140, 400, color=RED)
    s.label(70, 250, "party controls", size=13, color=RED)
    note(s, "Opposition parties banned; ended by the 1991 Constitution.", 482, size=14)
    return s


@fig
def constitutions_compare():
    s = Svg(800, 470, "Sierra Leone's constitutions compared",
            "1961: parliamentary system, British monarch as head of state, multi-party, final appeal to the Privy Council. "
            "1971: republic with an executive President, multi-party in law, Supreme Court final. 1978: executive "
            "President, one-party state (APC), Supreme Court final. 1991: executive President, multi-party democracy, "
            "two-term limit, Supreme Court final.")
    heading(s, "Four constitutions at a glance")
    rows = ["System", "Head of state", "Parties", "Final court"]
    cols = [("1961", ["parliamentary", "British monarch", "multi-party", "Privy Council"], GREEN, F_GREEN),
            ("1971", ["presidential", "executive President", "multi-party", "Supreme Court"], BLUE, F_BLUE),
            ("1978", ["presidential", "executive President", "one party (APC)", "Supreme Court"], RED, F_RED),
            ("1991", ["presidential", "President, 2 terms", "multi-party", "Supreme Court"], PURPLE, F_PURPLE)]
    for k, r in enumerate(rows):
        s.text(72, 160 + k * 74, r, size=15, weight="bold", color=INK)
    for j, (yr, vals, col, fill) in enumerate(cols):
        x = 215 + j * 160
        box(s, x, 92, 148, 50, [yr], col=col, fill=fill, size=19)
        for k, v in enumerate(vals):
            box(s, x, 160 + k * 74, 148, 56, [v], col=col, fill="#ffffff", size=14, bold_first=False)
    return s


@fig
def power_timeline():
    s = Svg(800, 560, "Who has governed Sierra Leone since independence",
            "SLPP 1961 to 1967 (Milton Margai, Albert Margai); military NRC 1967 to 1968; APC 1968 to 1992 (Siaka Stevens, "
            "then Joseph Momoh from 1985; one-party state 1978 to 1991); military NPRC 1992 to 1996 (Valentine Strasser, "
            "Julius Maada Bio); SLPP 1996 to 2007 (Ahmad Tejan Kabbah, interrupted by the AFRC junta 1997 to 1998); APC "
            "2007 to 2018 (Ernest Bai Koroma); SLPP from 2018 (Julius Maada Bio).")
    heading(s, "Governments since independence")
    x0, x1, y0a, y1a = 140, 760, 1961, 2026
    def X(y):
        return x0 + (y - y0a) * (x1 - x0) / (y1a - y0a)
    rows = [(1961, 1967, "SLPP", "Milton Margai, Albert Margai", GREEN, F_GREEN),
            (1967, 1968, "Military", "NRC", RED, F_RED),
            (1968, 1992, "APC", "Stevens; Momoh from 1985", BLUE, F_BLUE),
            (1992, 1996, "Military", "NPRC: Strasser, Bio", RED, F_RED),
            (1996, 2007, "SLPP", "Kabbah (AFRC junta 1997–98)", GREEN, F_GREEN),
            (2007, 2018, "APC", "Ernest Bai Koroma", BLUE, F_BLUE),
            (2018, 2026, "SLPP", "Julius Maada Bio", GREEN, F_GREEN)]
    for k, (a, b, party, who, col, fill) in enumerate(rows):
        y = 92 + k * 56
        s.text(126, y, f"{a}–{b if b < 2026 else ''}".rstrip("–") if b < 2026 else f"{a}–", size=15, weight="bold", color=col, anchor="end")
        s.rect(X(a), y - 16, max(X(b) - X(a), 8), 32, fill=fill, stroke=col, width=2, rx=4)
        if X(b) < 520:
            s.text(X(b) + 10, y - 7, party, size=15, weight="bold", color=col, anchor="start")
            s.text(X(b) + 10, y + 11, who, size=13, color=MUTED, anchor="start")
        else:
            s.text(X(a) - 10, y - 7, party, size=15, weight="bold", color=col, anchor="end")
            s.text(X(a) - 10, y + 11, who, size=13, color=MUTED, anchor="end")
    s.rect(X(1978), 475, X(1991) - X(1978), 14, fill=F_RED, stroke=RED, width=1.5, rx=3)
    s.text((X(1978) + X(1991)) / 2, 504, "one-party state 1978–91", size=13, color=RED)
    for yr in (1961, 1971, 1981, 1991, 2001, 2011, 2021):
        s.line(X(yr), 460, X(yr), 468, color=MUTED, width=1.5)
        s.text(X(yr), 530, str(yr), size=13, color=MUTED)
    s.line(x0, 464, x1, 464, color=MUTED, width=1.5)
    return s


@fig
def party_formation():
    s = Svg(800, 560, "Formation of political parties in Sierra Leone",
            "1950 National Council of Sierra Leone; 1951 Sierra Leone People's Party; 1958 People's National Party; 1960 "
            "All People's Congress; 1978 to 1991 only the APC allowed; 1991 multi-party politics restored and new parties "
            "registered; 2002 RUF Party contests elections; 2006 People's Movement for Democratic Change; 2017 National "
            "Grand Coalition and Coalition for Change; 2022 the PPRC Act and Political Parties Act.")
    heading(s, "When the main parties were formed")
    timeline(s, [("1950", "National Council of Sierra Leone (NCSL)", "Colony-based; Bankole-Bright", None),
                 ("1951", "Sierra Leone People's Party (SLPP)", "Milton Margai; symbol: palm tree; green", GREEN),
                 ("1958", "People's National Party (PNP)", "Albert Margai, Siaka Stevens", None),
                 ("1960", "All People's Congress (APC)", "Siaka Stevens; symbol: rising sun; red", BLUE),
                 ("1978", "One-party state: only the APC", "until the 1991 Constitution", RED),
                 ("1991", "Multi-party politics restored", "new parties registered", None),
                 ("2006", "People's Movement for Democratic Change", "Charles Margai (PMDC)", None),
                 ("2017", "NGC and C4C formed", "Kandeh Yumkella; Samuel Sam-Sumana", None)],
             x=150, y0=88, step=62)
    return s


@fig
def coups_timeline():
    s = Svg(800, 520, "Military interventions in Sierra Leone",
            "March 1967: Brigadier David Lansana seizes power, then officers form the National Reformation Council under "
            "Andrew Juxon-Smith. April 1968: the Sergeants' revolt (Anti-Corruption Revolutionary Movement) restores "
            "civilian rule. April 1992: the National Provisional Ruling Council under Valentine Strasser overthrows "
            "President Momoh. January 1996: Julius Maada Bio replaces Strasser, then hands over to the elected Kabbah. "
            "May 1997: the Armed Forces Revolutionary Council under Johnny Paul Koroma; ECOMOG restores Kabbah in 1998.")
    heading(s, "Coups and juntas")
    timeline(s, [("1967", "Lansana coup; National Reformation Council", "Juxon-Smith rules by decree", RED),
                 ("1968", "Sergeants' revolt", "civilian rule restored; Stevens PM", BLUE),
                 ("1992", "NPRC coup, 29 April", "Captain Valentine Strasser", RED),
                 ("1996", "Palace coup: Julius Maada Bio", "hands over to elected President Kabbah", ORANGE),
                 ("1997", "AFRC coup, 25 May", "Johnny Paul Koroma; joins with the RUF", RED),
                 ("1998", "ECOMOG restores Kabbah", "Nigerian-led ECOWAS force", GREEN),
                 ("Since", "No successful coup since 1998", "elected governments, 2002 onward", GREEN)],
             x=150, y0=88, step=62)
    return s


@fig
def civil_war_timeline():
    s = Svg(800, 600, "Sierra Leone's civil war and peace process, 1991 to 2002",
            "March 1991 the RUF attacks from Liberia at Bomaru, Kailahun District. 1996 Abidjan Peace Accord. 1997 AFRC "
            "coup and AFRC–RUF junta. 1998 ECOMOG restores Kabbah. January 1999 attack on Freetown. July 1999 Lomé Peace "
            "Agreement. October 1999 UNAMSIL created. May 2000 UN peacekeepers taken hostage; British intervention; "
            "Sankoh arrested. 2000–2001 Abuja agreements and disarmament. 18 January 2002 the war declared over.")
    heading(s, "War and peace, 1991–2002")
    timeline(s, [("1991", "RUF invades from Liberia, 23 March", "Bomaru, Kailahun District; Foday Sankoh", RED),
                 ("1996", "Elections; Abidjan Peace Accord", "fighting continues", ORANGE),
                 ("1997", "AFRC coup; junta with the RUF", "Kabbah goes into exile", RED),
                 ("1998", "ECOMOG restores Kabbah", None, GREEN),
                 ("1999", "6 January attack on Freetown", "Lomé Peace Agreement, 7 July", ORANGE),
                 ("1999", "UNAMSIL peacekeepers", "UN mission created in October", GREEN),
                 ("2000", "UN peacekeepers taken hostage", "British troops intervene; Sankoh arrested", ORANGE),
                 ("2002", "War declared over, 18 January", "disarmament complete; elections in May", GREEN)],
             x=150, y0=88, step=64)
    return s


@fig
def chiefdom_structure():
    s = Svg(800, 500, "Chiefdom administration in Sierra Leone today",
            "Each of the 190 chiefdoms is headed by a Paramount Chief, elected for life by the chiefdom councillors from "
            "candidates of the recognised ruling houses, under the Chieftaincy Act 2009. The chief works with the "
            "Chiefdom Council and the Chiefdom Speaker; section chiefs and town chiefs govern smaller units. Paramount "
            "Chiefs also sit in Parliament, one for each provincial district.")
    heading(s, "Inside a chiefdom")
    rh = box(s, 140, 100, 220, 76, ["Ruling houses", "supply candidates"], col=ORANGE, fill=F_AMBER, size=15)
    cc = box(s, 400, 100, 220, 76, ["Chiefdom councillors", "vote (elect for life)"], col=GREEN, fill=F_GREEN, size=15)
    pc = box(s, 660, 100, 220, 76, ["Paramount Chief", "head of chiefdom"], col=BLUE, fill=F_BLUE, size=16)
    arrow(s, 252, 100, 286, 100, color=MUTED)
    arrow(s, 512, 100, 546, 100, color=MUTED)
    sp = box(s, 660, 215, 220, 60, ["Chiefdom Speaker", "deputy to the chief"], col=BLUE, fill="#ffffff", size=15)
    cn = box(s, 400, 215, 220, 60, ["Chiefdom Council", "advises, by-laws"], col=GREEN, fill="#ffffff", size=15)
    sc = box(s, 660, 320, 220, 56, ["Section chiefs"], col=BLUE, fill="#ffffff", size=16)
    tc = box(s, 660, 410, 220, 56, ["Town and village chiefs"], col=BLUE, fill="#ffffff", size=15)
    link(s, pc, sp, color=BLUE)
    link(s, sp, sc, color=BLUE)
    link(s, sc, tc, color=BLUE)
    link(s, pc, cn, color=GREEN)
    box(s, 230, 370, 340, 120, ["Paramount Chief duties", "keep peace and order; custodian", "of land and custom; support", "councils; sit in Parliament (PCMPs)"], col=PURPLE, fill=F_PURPLE, size=14)
    return s


@fig
def local_gov_history():
    s = Svg(800, 520, "Milestones in local government in Sierra Leone",
            "1893 Freetown becomes a municipality with a city council. 1896 the Protectorate is ruled through chiefs. 1937 "
            "Native Administration reforms with chiefdom treasuries. 1940s District Councils and the Protectorate "
            "Assembly. 1972 local councils abolished. 2004 Local Government Act revives councils, with elections. 2017 "
            "new chiefdoms bring the total to 190. 2022 a new Local Government Act.")
    heading(s, "Local government through the years")
    timeline(s, [("1893", "Freetown becomes a municipality", "a city council for the capital", None),
                 ("1896", "Protectorate ruled through chiefs", "indirect rule", None),
                 ("1937", "Native Administration reforms", "chiefdom treasuries and estimates", None),
                 ("1940s", "District Councils; Protectorate Assembly", None, None),
                 ("1972", "Local councils abolished", "power centralised in Freetown", RED),
                 ("2004", "Local Government Act", "councils revived; elections held", GREEN),
                 ("2017", "New chiefdoms: 190 in total", None, None),
                 ("2022", "Local Government Act 2022", "replaces the 2004 Act", GREEN)],
             x=150, y0=88, step=58)
    return s


# ═══ Group 5: international relations ═══════════════════════════════════════

@fig
def un_organs():
    s = Svg(800, 520, "The principal organs of the United Nations",
            "The United Nations has six principal organs: the General Assembly (all 193 members, one vote each), the "
            "Security Council (15 members, five permanent with a veto), the Economic and Social Council, the "
            "International Court of Justice at The Hague, the Secretariat headed by the Secretary-General, and the "
            "Trusteeship Council, which suspended its work in 1994.")
    heading(s, "Six principal organs of the UN")
    c = box(s, 400, 265, 220, 80, ["UNITED NATIONS", "founded 24 Oct 1945"], col=PURPLE, fill=F_PURPLE, size=17)
    items = [(140, 105, "General Assembly", ["all 193 members,", "one vote each"], BLUE, F_BLUE),
             (400, 95, "Security Council", ["15 members; 5 permanent", "with a veto"], RED, F_RED),
             (660, 105, "ECOSOC", ["economic and social", "cooperation; 54 members"], GREEN, F_GREEN),
             (140, 425, "Int. Court of Justice", ["The Hague;", "15 judges"], ORANGE, F_AMBER),
             (400, 435, "Secretariat", ["headed by the", "Secretary-General"], TEAL, F_TEAL),
             (660, 425, "Trusteeship Council", ["work suspended", "in 1994"], MUTED, F_GREY)]
    for x, y, head, lines, col, fill in items:
        b = box(s, x, y, 230, 86, [head] + lines, col=col, fill=fill, size=15)
        link(s, b, c, color=MUTED)
    s.text(110, 265, "Headquarters:", size=14, weight="bold", color=INK)
    s.text(110, 285, "New York", size=14, color=INK)
    s.text(690, 265, "Permanent five:", size=14, weight="bold", color=RED)
    s.text(690, 285, "China, France, Russia,", size=13, color=INK)
    s.text(690, 303, "UK, USA", size=13, color=INK)
    return s


@fig
def un_in_sl():
    s = Svg(800, 540, "The United Nations in Sierra Leone",
            "Sierra Leone joined the UN on 27 September 1961. During and after the civil war the UN deployed an observer "
            "mission (UNOMSIL, 1998–1999), the peacekeeping mission UNAMSIL (1999–2005), and the peacebuilding offices "
            "UNIOSIL (2006–2008) and UNIPSIL (2008–2014). It backed the Special Court for Sierra Leone (2002–2013). UN "
            "agencies such as WHO, UNICEF, WFP and UNDP support health, education, food and development.")
    heading(s, "From membership to peacekeeping and development")
    timeline(s, [("1961", "Joins the UN, 27 September", "a new member soon after independence", BLUE),
                 ("1998", "UNOMSIL observer mission", "monitors security and disarmament", ORANGE),
                 ("1999", "UNAMSIL peacekeepers (to 2005)", "disarmament of over 70,000 fighters", RED),
                 ("2002", "Special Court for Sierra Leone", "set up with the UN; closed 2013", PURPLE),
                 ("2006", "UNIOSIL peacebuilding office", "supports institutions (to 2008)", GREEN),
                 ("2008", "UNIPSIL political mission", "elections, reconciliation (to 2014)", GREEN),
                 ("2014", "Ebola response", "WHO, UNICEF, WFP and UNMEER", ORANGE),
                 ("2024", "Security Council seat", "non-permanent member, 2024–2025", BLUE)],
             x=150, y0=90, step=60)
    return s


@fig
def oau_to_au():
    s = Svg(800, 520, "From the OAU to the African Union",
            "The Organisation of African Unity was founded in Addis Ababa on 25 May 1963 to promote unity, defend "
            "sovereignty and end colonialism, but held to non-interference in members' internal affairs. The African "
            "Union replaced it, launched in Durban on 9 July 2002. The AU may intervene in a member state in cases of war "
            "crimes, genocide and crimes against humanity, suspends governments that seize power unconstitutionally, and "
            "has more organs, including the Pan-African Parliament and the Peace and Security Council.")
    heading(s, "OAU (1963–2002) and AU (2002 onward)")
    rows = ["Founded", "Headquarters", "Main focus", "Internal conflicts", "Coups", "Key organs"]
    oau = ["25 May 1963", "Addis Ababa", "end colonialism; unity", "non-interference", "often tolerated", "Assembly, Council, Secretariat"]
    au = ["9 July 2002", "Addis Ababa", "integration, peace, development", "may intervene (Art. 4h)", "members suspended", "+ Parliament, PSC, Court"]
    s.text(115, 80, "", size=1)
    box(s, 380, 80, 230, 48, ["OAU"], col=BLUE, fill=F_BLUE, size=19)
    box(s, 640, 80, 250, 48, ["African Union"], col=GREEN, fill=F_GREEN, size=19)
    for k, r in enumerate(rows):
        y = 150 + k * 60
        s.text(140, y, r, size=15, weight="bold", color=INK)
        box(s, 380, y, 230, 48, [oau[k]], col=BLUE, fill="#ffffff", size=14, bold_first=False)
        box(s, 640, y, 250, 48, [au[k]], col=GREEN, fill="#ffffff", size=14, bold_first=False)
    note(s, "Africa Day, 25 May, marks the founding of the OAU.", 505, size=14)
    return s


@fig
def ecowas_structure():
    s = Svg(800, 520, "The institutions of ECOWAS",
            "ECOWAS was founded by the Treaty of Lagos on 28 May 1975 and revised in 1993. Its supreme body is the "
            "Authority of Heads of State and Government, supported by the Council of Ministers and the ECOWAS Commission in "
            "Abuja. Other institutions include the Community Parliament, the Community Court of Justice and the ECOWAS Bank "
            "for Investment and Development. ECOMOG was its military monitoring group.")
    heading(s, "How ECOWAS is organised")
    au = box(s, 400, 95, 460, 66, ["Authority of Heads of State and Government", "supreme decision-making body"], col=PURPLE, fill=F_PURPLE, size=15)
    cm = box(s, 400, 190, 460, 56, ["Council of Ministers", "advises the Authority"], col=BLUE, fill=F_BLUE, size=15)
    co = box(s, 400, 285, 460, 66, ["ECOWAS Commission (Abuja)", "runs programmes; headed by a President"], col=BLUE, fill=F_BLUE, size=15)
    link(s, au, cm, color=MUTED)
    link(s, cm, co, color=MUTED)
    others = [(140, "Community", ["Parliament"]), (330, "Court of", ["Justice"]), (520, "EBID", ["(bank)"]), (690, "ECOMOG", ["military force"])]
    for x, a, b in others:
        bb = box(s, x, 410, 165, 70, [a] + b, col=GREEN if x < 600 else RED, fill=F_GREEN if x < 600 else F_RED, size=15)
        s.line(x, 375, x, 352 if x in (330, 520) else 375, color=MUTED, width=1.6)
    s.line(140, 375, 690, 375, color=MUTED, width=1.6)
    s.line(400, 318, 400, 375, color=MUTED, width=1.6)
    note(s, "Treaty of Lagos, 28 May 1975; revised Treaty, 1993.", 500, size=14)
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
