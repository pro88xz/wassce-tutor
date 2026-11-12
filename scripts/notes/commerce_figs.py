#!/usr/bin/env python3
"""Original diagrams for the Commerce notes.

    python3 scripts/notes/commerce_figs.py            # write every diagram
    python3 scripts/notes/commerce_figs.py name ...   # write some

Each function draws one figure and returns an Svg. Files go to
public/img/commerce/<name>.svg and lessons show them from
https://wasscetutor.com/img/commerce/<name>.svg. All drawn by WASSCE Tutor.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from svgfig import (  # noqa: E402
    BLUE, F_AMBER, F_BLUE, F_GREEN, F_GREY, F_PURPLE, F_RED, GREEN, INK, MUTED,
    ORANGE, PURPLE, RED, TEAL, Svg,
)

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/img/commerce"
FIGS: dict[str, callable] = {}
F_TEAL = "#ccfbf1"


def fig(fn):
    FIGS[fn.__name__.replace("_", "-")] = fn
    return fn


def title(s: Svg, t, y=34, size=18):
    s.text(s.w / 2, y, t, size=size, color=MUTED)


def box(s: Svg, cx, cy, w, h, lines, col=INK, fill=F_GREY, size=16, bold_first=True, rx=12):
    """A rounded box centred on (cx, cy) with one or more lines of text."""
    if isinstance(lines, str):
        lines = [lines]
    s.rect(cx - w / 2, cy - h / 2, w, h, fill=fill, stroke=col, width=2.5, rx=rx)
    n = len(lines)
    for i, ln in enumerate(lines):
        y = cy + (i - (n - 1) / 2) * (size + 6)
        s.text(cx, y, ln, size=size if (i == 0 or not bold_first) else size - 2,
               weight="bold" if (i == 0 and bold_first) else "normal", color=col if i == 0 else INK)
    return (cx, cy, w, h)


def link(s: Svg, a, b, color=MUTED, width=2.5, gap=6):
    """Arrow from the edge of box a to the edge of box b (boxes as returned by box())."""
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    dx, dy = bx - ax, by - ay
    if abs(dx) * ah > abs(dy) * aw:  # leave through left/right
        sx, sy = ax + math.copysign(aw / 2 + gap, dx), ay
        ex, ey = bx - math.copysign(bw / 2 + gap, dx), by
    else:
        sx, sy = ax, ay + math.copysign(ah / 2 + gap, dy)
        ex, ey = bx, by - math.copysign(bh / 2 + gap, dy)
    s.arrow(sx, sy, ex, ey, color=color, width=width)


# ═══ Foundations ════════════════════════════════════════════════════════════

@fig
def branches_of_commerce():
    s = Svg(760, 480, "The branches of commerce",
            "Commerce is divided into trade and aids to trade. Trade is home trade (retail and wholesale) or foreign trade "
            "(import, export and entrepôt). Aids to trade are transport, communication, banking, insurance, warehousing and advertising.")
    root = box(s, 380, 60, 200, 54, "Commerce", BLUE, F_BLUE, size=20)
    trade = box(s, 200, 165, 190, 50, "Trade", GREEN, F_GREEN, size=19)
    aids = box(s, 575, 165, 220, 50, "Aids to trade", ORANGE, F_AMBER, size=19)
    link(s, root, trade)
    link(s, root, aids)
    home = box(s, 100, 275, 170, 50, "Home trade", GREEN, F_GREEN, size=17)
    foreign = box(s, 300, 275, 170, 50, "Foreign trade", GREEN, F_GREEN, size=17)
    link(s, trade, home)
    link(s, trade, foreign)
    def bracket(x_parent, y_top, ys, x_items):
        """A vertical spine from a parent box down past its children, with a tick to each."""
        spine = x_items - 84
        s.line(x_parent, y_top, x_parent, y_top + 12, color=MUTED, width=2.5)
        s.line(x_parent, y_top + 12, spine, y_top + 12, color=MUTED, width=2.5)
        s.line(spine, y_top + 12, spine, ys[-1], color=MUTED, width=2.5)
        for y in ys:
            s.arrow(spine, y, x_items - 72, y, color=MUTED, width=2.5)

    home_ys = [352 + i * 50 for i in range(2)]
    for y, t in zip(home_ys, ["retail", "wholesale"]):
        box(s, 108, y, 136, 40, t, INK, "#ffffff", size=15, bold_first=False)
    bracket(100, 300, home_ys, 108)
    for_ys = [352 + i * 46 for i in range(3)]
    for y, t in zip(for_ys, ["import", "export", "entrepôt"]):
        box(s, 308, y, 136, 36, t, INK, "#ffffff", size=15, bold_first=False)
    bracket(300, 300, for_ys, 308)
    aid_items = ["transport", "communication", "banking", "insurance", "warehousing", "advertising"]
    s.line(575, 192, 575, 222, color=MUTED, width=2.5)
    s.line(505, 222, 650, 222, color=MUTED, width=2.5)
    for x in (505, 650):
        s.arrow(x, 222, x, 238, color=MUTED, width=2.5)
    for i, t in enumerate(aid_items):
        col, row = i % 2, i // 2
        box(s, 505 + col * 145, 265 + row * 62, 132, 44, t, INK, "#ffffff", size=15, bold_first=False)
    return s


@fig
def occupations():
    s = Svg(760, 400, "Classification of occupations",
            "Occupations are industrial (extractive, manufacturing and construction), commercial (trade and aids to trade) "
            "or direct services (teachers, nurses, police).")
    root = box(s, 380, 60, 220, 52, "Occupations", BLUE, F_BLUE, size=20)
    cols = [(140, "Industrial", GREEN, F_GREEN, ["extractive: farming, fishing, mining",
                                                  "manufacturing: milling, brewing",
                                                  "construction: roads, houses"]),
            (380, "Commercial", ORANGE, F_AMBER, ["trade: retail, wholesale,", "import and export",
                                                   "aids to trade: banking,", "transport, insurance"]),
            (620, "Direct services", PURPLE, F_PURPLE, ["teachers, nurses, doctors",
                                                        "police, lawyers", "hairdressers"])]
    for x, name, col, fill, items in cols:
        b = box(s, x, 160, 200, 52, name, col, fill, size=18)
        link(s, root, b)
        s.rect(x - 112, 200, 224, 170, fill="#ffffff", stroke=col, width=2, rx=10)
        for i, it in enumerate(items):
            s.text(x, 232 + i * 32, it, size=14)
    return s


@fig
def chain_of_distribution():
    s = Svg(780, 420, "Channels of distribution",
            "Three channels: manufacturer to wholesaler to retailer to consumer; manufacturer to retailer to consumer; and "
            "manufacturer directly to consumer.")
    rows = [(110, ["Manufacturer", "Wholesaler", "Retailer", "Consumer"], "the traditional chain"),
            (230, ["Manufacturer", "Retailer", "Consumer"], "large retailers buy direct"),
            (350, ["Manufacturer", "Consumer"], "direct: factory shop, online, own outlets")]
    cols = {"Manufacturer": (BLUE, F_BLUE), "Wholesaler": (GREEN, F_GREEN), "Retailer": (ORANGE, F_AMBER), "Consumer": (PURPLE, F_PURPLE)}
    xs = {"Manufacturer": 95, "Wholesaler": 295, "Retailer": 495, "Consumer": 690}
    for y, chain, note in rows:
        prev = None
        for name in chain:
            col, fill = cols[name]
            b = box(s, xs[name], y, 160, 50, name, col, fill, size=16)
            if prev:
                link(s, prev, b)
            prev = b
        s.text(390, y + 42, note, size=14, color=MUTED, italic=True)
    title(s, "Goods move from producer to final consumer", y=36)
    return s


@fig
def aids_to_trade():
    s = Svg(720, 500, "How the aids to trade remove hindrances to trade",
            "Each hindrance to trade is removed by an aid: distance by transport, time by warehousing, risk by insurance, "
            "lack of finance by banking, lack of information by advertising, and distance between traders by communication.")
    pairs = [("Distance (place)", "Transport"), ("Time", "Warehousing"), ("Risk of loss", "Insurance"),
             ("Lack of finance", "Banking"), ("Lack of information", "Advertising"), ("Traders far apart", "Communication")]
    s.text(160, 52, "Hindrance", size=17, weight="bold", color=RED)
    s.text(560, 52, "Aid to trade", size=17, weight="bold", color=GREEN)
    for i, (h, a) in enumerate(pairs):
        y = 100 + i * 66
        hb = box(s, 160, y, 240, 48, h, RED, F_RED, size=16)
        ab = box(s, 560, y, 220, 48, a, GREEN, F_GREEN, size=16)
        s.text(360, y - 12, "removed by", size=13, color=MUTED)
        link(s, hb, ab, color=INK)
    return s


@fig
def wholesaler_services():
    s = Svg(780, 440, "Services of the wholesaler",
            "The wholesaler stands between manufacturers and retailers. To manufacturers it buys in bulk, stores goods, pays promptly "
            "and passes on market information. To retailers it breaks bulk, gives credit, offers variety, delivers and advises.")
    m = box(s, 110, 220, 170, 60, "Manufacturers", BLUE, F_BLUE, size=17)
    w = box(s, 390, 220, 170, 60, "Wholesaler", GREEN, F_GREEN, size=19)
    r = box(s, 670, 220, 170, 60, "Retailers", ORANGE, F_AMBER, size=17)
    link(s, m, w, color=INK)
    link(s, w, r, color=INK)
    left = ["buys in bulk", "stores the goods", "pays promptly (finance)", "market information", "bears some risk"]
    right = ["breaks bulk", "gives credit", "wide variety", "delivers goods", "advice on new products"]
    s.rect(155, 290, 220, 140, fill="#ffffff", stroke=BLUE, width=2, rx=10)
    s.text(265, 310, "to manufacturers", size=14, weight="bold", color=BLUE)
    for i, t in enumerate(left):
        s.text(265, 334 + i * 20, t, size=13)
    s.rect(405, 290, 220, 140, fill="#ffffff", stroke=ORANGE, width=2, rx=10)
    s.text(515, 310, "to retailers", size=14, weight="bold", color=ORANGE)
    for i, t in enumerate(right):
        s.text(515, 334 + i * 20, t, size=13)
    s.text(390, 168, "goods flow →", size=15, color=MUTED, italic=True)
    title(s, "The wholesaler serves both ends of the chain", y=40)
    return s


@fig
def foreign_trade_types():
    s = Svg(760, 380, "Import, export and entrepôt trade",
            "Sierra Leone imports goods from other countries and exports goods to them. In entrepôt trade, goods are imported "
            "into a country and re-exported to a third country, often with little processing.")
    sl = box(s, 380, 190, 200, 80, "Sierra Leone", GREEN, F_GREEN, size=19)
    a = box(s, 100, 110, 170, 56, "Country A", BLUE, F_BLUE, size=16)
    b = box(s, 660, 110, 170, 56, "Country B", BLUE, F_BLUE, size=16)
    c = box(s, 660, 290, 170, 56, "Country C", BLUE, F_BLUE, size=16)
    s.arrow(188, 118, 276, 168, color=ORANGE, width=3)
    s.text(220, 168, "import", size=15, weight="bold", color=ORANGE)
    s.arrow(484, 168, 572, 118, color=PURPLE, width=3)
    s.text(548, 168, "export", size=15, weight="bold", color=PURPLE)
    s.arrow(188, 300, 276, 222, color=TEAL, width=3, dash="8 6")
    s.arrow(484, 222, 572, 290, color=TEAL, width=3, dash="8 6")
    d = box(s, 100, 300, 170, 56, "Country D", BLUE, F_BLUE, size=16)
    s.text(380, 330, "entrepôt: imported, then re-exported", size=15, weight="bold", color=TEAL)
    title(s, "Foreign trade: goods crossing national borders", y=36)
    return s


@fig
def home_trade_documents():
    s = Svg(720, 600, "Documents used in home trade",
            "The order in which documents pass between buyer and seller: letter of enquiry, quotation or price list, order, "
            "advice or delivery note, invoice, debit or credit note, statement of account, payment and receipt.")
    bx, sx = 120, 600
    box(s, bx, 60, 170, 50, "Buyer", BLUE, F_BLUE, size=19)
    box(s, sx, 60, 170, 50, "Seller", GREEN, F_GREEN, size=19)
    s.line(bx, 88, bx, 580, color=BLUE, width=2, dash="4 6")
    s.line(sx, 88, sx, 580, color=GREEN, width=2, dash="4 6")
    steps = [("1. Letter of enquiry", 1), ("2. Quotation, price list or catalogue", -1), ("3. Order", 1),
             ("4. Advice note / delivery note", -1), ("5. Invoice", -1), ("6. Debit note or credit note", -1),
             ("7. Statement of account", -1), ("8. Payment (cheque, transfer, mobile money)", 1), ("9. Receipt", -1)]
    for i, (t, d) in enumerate(steps):
        y = 120 + i * 52
        x1, x2 = (bx + 8, sx - 8) if d > 0 else (sx - 8, bx + 8)
        s.arrow(x1, y, x2, y, color=BLUE if d > 0 else GREEN, width=2.5)
        s.label((bx + sx) / 2, y - 14, t, size=14, weight="bold", color=BLUE if d > 0 else GREEN)
    return s


@fig
def letter_of_credit():
    s = Svg(780, 470, "Payment by letter of credit",
            "1. The importer asks its bank to open a letter of credit. 2. The importer's bank sends it to the exporter's bank. "
            "3. The exporter ships the goods and receives a bill of lading. 4. The exporter presents the documents and is paid. "
            "5. The documents go to the importer's bank. 6. The importer pays and receives the documents. 7. The importer "
            "collects the goods with the bill of lading.")
    imp = box(s, 130, 110, 190, 56, "Importer", BLUE, F_BLUE, size=17)
    ibank = box(s, 130, 330, 190, 56, ["Importer's bank"], BLUE, F_BLUE, size=16)
    ebank = box(s, 650, 330, 190, 56, ["Exporter's bank"], GREEN, F_GREEN, size=16)
    exp = box(s, 650, 110, 190, 56, "Exporter", GREEN, F_GREEN, size=17)
    ship = box(s, 390, 110, 190, 56, ["Shipping line"], ORANGE, F_AMBER, size=16)
    s.arrow(110, 142, 110, 298, color=INK, width=2.5)
    s.label(110, 220, "1 open L/C", size=13, weight="bold")
    s.arrow(229, 340, 551, 340, color=INK, width=2.5)
    s.label(390, 340, "2 letter of credit sent", size=13, weight="bold")
    s.arrow(551, 102, 489, 102, color=INK, width=2.5)
    s.label(560, 64, "3 goods shipped; exporter gets bill of lading", size=12, weight="bold")
    s.arrow(670, 142, 670, 298, color=INK, width=2.5)
    s.label(670, 220, "4 documents → paid", size=13, weight="bold")
    s.arrow(551, 372, 229, 372, color=INK, width=2.5)
    s.label(390, 372, "5 documents sent", size=13, weight="bold")
    s.arrow(160, 298, 160, 142, color=INK, width=2.5)
    s.label(160, 250, "6 pays; gets", size=13, weight="bold")
    s.label(160, 268, "documents", size=13, weight="bold")
    s.arrow(291, 118, 229, 118, color=ORANGE, width=2.5)
    s.label(260, 150, "7 collects goods", size=13, weight="bold", color=ORANGE)
    title(s, "The banks guarantee payment for both sides", y=26, size=17)
    s.text(390, 440, "L/C = letter of credit", size=14, color=MUTED)
    return s


@fig
def markup_margin():
    s = Svg(700, 360, "Mark-up and margin",
            "Goods cost NLe 100 and sell for NLe 125, a gross profit of NLe 25. Mark-up is profit as a percentage of cost price: 25%. "
            "Margin is profit as a percentage of selling price: 20%.")
    x0, y = 70, 150
    k = 4.4
    s.rect(x0, y, 100 * k, 60, fill=F_BLUE, stroke=BLUE, width=2.5)
    s.text(x0 + 50 * k, y + 30, "cost price NLe 100", size=17, weight="bold", color=BLUE)
    s.rect(x0 + 100 * k, y, 25 * k, 60, fill=F_GREEN, stroke=GREEN, width=2.5)
    s.text(x0 + 112.5 * k, y + 30, "25", size=17, weight="bold", color=GREEN)
    s.text(x0 + 112.5 * k, y - 16, "profit", size=14, color=GREEN)
    s.line(x0, y + 86, x0 + 125 * k, y + 86, color=INK, width=2)
    s.head(x0, y + 86, 180, size=10)
    s.head(x0 + 125 * k, y + 86, 0, size=10)
    s.label(x0 + 62.5 * k, y + 86, "selling price NLe 125", size=16, weight="bold")
    s.text(350, 280, "mark-up = 25 ÷ 100 × 100% = 25%   (profit on cost)", size=16, weight="bold", color=BLUE)
    s.text(350, 312, "margin = 25 ÷ 125 × 100% = 20%   (profit on selling price)", size=16, weight="bold", color=GREEN)
    title(s, "Same profit, two different percentages", y=50)
    return s


@fig
def communication_process():
    s = Svg(780, 320, "The communication process",
            "A sender encodes a message and sends it through a channel to a receiver, who decodes it and sends feedback. "
            "Noise can distort the message along the way.")
    a = box(s, 90, 150, 140, 60, "Sender", BLUE, F_BLUE, size=17)
    b = box(s, 270, 150, 150, 60, ["Message", "(encoded)"], ORANGE, F_AMBER, size=16)
    c = box(s, 455, 150, 150, 60, ["Channel", "phone, letter, email"], TEAL, F_TEAL, size=16)
    d = box(s, 650, 150, 150, 60, ["Receiver", "(decodes)"], PURPLE, F_PURPLE, size=16)
    link(s, a, b, color=INK)
    link(s, b, c, color=INK)
    link(s, c, d, color=INK)
    s.path("M 650 186 C 650 280, 90 280, 90 186", color=GREEN, width=2.5, dash="8 6", arrow="end")
    s.text(370, 268, "feedback", size=16, weight="bold", color=GREEN)
    s.text(455, 88, "noise: poor network, unclear words", size=14, color=RED, italic=True)
    s.line(455, 98, 455, 116, color=RED, width=2)
    title(s, "Communication is complete only when feedback returns", y=34)
    return s


@fig
def marketing_mix():
    s = Svg(660, 480, "The marketing mix: the four Ps",
            "The four Ps of the marketing mix surround the target customer: product, price, place and promotion.")
    c = box(s, 330, 250, 190, 70, ["Target", "customer"], INK, F_GREY, size=19)
    items = [(330, 95, "Product", "what is sold: quality, design,", "brand, packaging", BLUE, F_BLUE),
             (110, 250, "Price", "what customers pay:", "discounts, credit terms", GREEN, F_GREEN),
             (550, 250, "Place", "where and how it is sold:", "channels, outlets", ORANGE, F_AMBER),
             (330, 410, "Promotion", "how buyers learn of it:", "advertising, sales promotion", PURPLE, F_PURPLE)]
    for x, y, name, l1, l2, col, fill in items:
        b = box(s, x, y, 210, 86, [name, l1, l2], col, fill, size=17)
        link(s, b, c, color=col)
    return s


@fig
def product_life_cycle():
    s = Svg(700, 430, "The product life cycle",
            "Sales of a product rise slowly at introduction, quickly during growth, level off at maturity and fall in decline.")
    x0, y0, w, h = 80, 350, 560, 260
    s.arrow(x0, y0, x0 + w + 14, y0, width=2.5)
    s.arrow(x0, y0, x0, y0 - h - 14, width=2.5)
    s.text(x0 + w + 14, y0 + 34, "Time", size=16, anchor="end", color=MUTED)
    s.text(x0 + 8, y0 - h - 22, "Sales", size=16, anchor="start", color=MUTED)
    pts = []
    for i in range(0, 101):
        t = i / 100
        v = math.exp(-((t - 0.62) ** 2) / 0.05) * (1 if t >= 0.62 else 1)
        pts.append((x0 + t * w, y0 - v * (h - 30) - 4))
    s.polyline(pts, color=BLUE, width=4)
    bounds = [0, 0.27, 0.48, 0.78, 1.0]
    names = ["Introduction", "Growth", "Maturity", "Decline"]
    cols = [MUTED, GREEN, BLUE, RED]
    for i in range(4):
        xa, xb = x0 + bounds[i] * w, x0 + bounds[i + 1] * w
        if i:
            s.line(xa, y0, xa, y0 - h, color=MUTED, width=1.5, dash="6 6")
        s.text((xa + xb) / 2, y0 + 20, names[i], size=15, weight="bold", color=cols[i])
    title(s, "Introduction → growth → maturity → decline", y=40)
    return s


# ═══ Finance ════════════════════════════════════════════════════════════════

def _cheque(s: Svg, x, y, w, h, crossing=None, label=None):
    s.rect(x, y, w, h, fill="#fffdf5", stroke=INK, width=2, rx=8)
    s.text(x + 14, y + 22, "ABC BANK  ·  Freetown", size=13, weight="bold", color=BLUE, anchor="start")
    s.text(x + w - 14, y + 22, "Date: 12/03/2026", size=12, anchor="end", color=MUTED)
    s.text(x + 14, y + 52, "Pay: Kamara Hardware Ltd", size=13, anchor="start")
    s.line(x + 50, y + 58, x + w - 120, y + 58, color=MUTED, width=1)
    s.text(x + 14, y + 80, "Two thousand leones only", size=12, anchor="start", color=MUTED)
    s.rect(x + w - 110, y + 64, 96, 26, fill="#ffffff", stroke=INK, width=1.5, rx=4)
    s.text(x + w - 62, y + 77, "NLe 2,000", size=13, weight="bold")
    s.text(x + w - 14, y + h - 14, "F. Conteh", size=14, italic=True, anchor="end")
    if crossing:
        cx = x + w * 0.42
        s.line(cx, y + 4, cx + 26, y + h - 4, color=RED, width=2.5)
        s.line(cx + 22, y + 4, cx + 48, y + h - 4, color=RED, width=2.5)
        if crossing != "&Co":
            s.text(cx + 24, y + h / 2, crossing, size=11, weight="bold", color=RED)
    if label:
        s.text(x + w / 2, y + h + 22, label, size=15, weight="bold")


@fig
def cheque_parties():
    s = Svg(720, 360, "The three parties to a cheque",
            "On a cheque, the drawer (the account holder who signs it) orders the drawee (the bank) to pay a sum of money to the "
            "payee (the person named).")
    _cheque(s, 130, 90, 460, 150)
    s.arrow(600, 320, 560, 236, color=PURPLE, width=2.5)
    s.text(600, 336, "drawer: signs (F. Conteh)", size=15, weight="bold", color=PURPLE, anchor="middle")
    s.arrow(160, 64, 170, 100, color=BLUE, width=2.5)
    s.text(160, 52, "drawee: the bank", size=15, weight="bold", color=BLUE)
    s.arrow(90, 290, 200, 148, color=GREEN, width=2.5)
    s.text(90, 306, "payee: Kamara Hardware", size=15, weight="bold", color=GREEN)
    return s


@fig
def cheque_crossings():
    s = Svg(780, 480, "Open and crossed cheques",
            "An open cheque can be cashed over the counter. A general crossing (two parallel lines) means it must be paid into a bank "
            "account. A special crossing names the bank. 'Account payee only' means it can be paid only into the payee's account.")
    _cheque(s, 20, 50, 360, 140, None, "Open: can be cashed at the counter")
    _cheque(s, 400, 50, 360, 140, "&Co", "General crossing: pay into an account")
    _cheque(s, 20, 280, 360, 140, "ABC Bank", "Special crossing: through the named bank")
    _cheque(s, 400, 280, 360, 140, "A/C payee", "Account payee only: payee's account")
    return s


@fig
def evolution_of_money():
    s = Svg(780, 320, "The evolution of money",
            "Money developed from barter, through commodity money such as cowries and salt, metal coins and paper notes, to bank "
            "money (cheques and cards) and electronic and mobile money.")
    stages = [("Barter", "goods for goods", MUTED, F_GREY), ("Commodity", "cowries, salt, iron", ORANGE, F_AMBER),
              ("Coins", "metal money", TEAL, F_TEAL), ("Paper notes", "bank notes", GREEN, F_GREEN),
              ("Bank money", "cheques, cards", BLUE, F_BLUE), ("Mobile money", "phone payments", PURPLE, F_PURPLE)]
    prev = None
    for i, (n, d, col, fill) in enumerate(stages):
        b = box(s, 70 + i * 128, 170, 116, 86, [n, d], col, fill, size=15)
        if prev:
            link(s, prev, b, color=INK, gap=3)
        prev = b
    s.arrow(60, 260, 720, 260, color=MUTED, width=2)
    s.text(390, 288, "time →", size=14, color=MUTED)
    title(s, "From barter to mobile money", y=60)
    return s


@fig
def pooling_of_risk():
    s = Svg(760, 420, "Pooling of risk in insurance",
            "Many people pay small premiums into an insurance fund. The few who suffer a loss are compensated from the fund, "
            "so the loss is shared among all the insured.")
    fund = box(s, 380, 210, 200, 90, ["Insurance fund", "(the pool)"], BLUE, F_BLUE, size=18)
    for i in range(8):
        y = 60 + i * 40
        s.circle(80, y, 14, fill=F_GREEN, stroke=GREEN, width=2)
        s.arrow(100, y, 274, 190 + (i - 3.5) * 6, color=GREEN, width=1.6)
    s.text(80, 400, "many insured pay", size=15, weight="bold", color=GREEN)
    s.text(80, 380, "small premiums", size=13, color=GREEN)
    for i in range(2):
        y = 160 + i * 100
        s.circle(640, y, 16, fill=F_RED, stroke=RED, width=2)
        s.arrow(486, 200 + i * 20, 618, y, color=RED, width=2.5)
    s.text(630, 330, "the few who suffer", size=15, weight="bold", color=RED)
    s.text(630, 350, "a loss are compensated", size=15, weight="bold", color=RED)
    title(s, "The losses of the few are paid by the contributions of the many", y=30, size=17)
    return s


@fig
def stock_market():
    s = Svg(780, 420, "Primary and secondary markets",
            "In the primary market a company issues new shares to investors and receives their money. In the secondary market "
            "(the stock exchange) investors buy and sell existing shares among themselves through brokers; the company receives nothing.")
    s.rect(20, 60, 360, 330, fill="#f0f9ff", stroke=BLUE, width=2, rx=14)
    s.text(200, 88, "Primary market (new issues)", size=17, weight="bold", color=BLUE)
    co = box(s, 200, 170, 200, 56, "Company", BLUE, F_BLUE, size=17)
    inv = box(s, 200, 320, 200, 56, "Investors", GREEN, F_GREEN, size=17)
    s.arrow(170, 200, 170, 290, color=PURPLE, width=2.5)
    s.label(170, 245, "new shares", size=13, weight="bold", color=PURPLE)
    s.arrow(230, 290, 230, 200, color=ORANGE, width=2.5)
    s.label(230, 245, "money", size=13, weight="bold", color=ORANGE)
    s.rect(400, 60, 360, 330, fill="#f0fdf4", stroke=GREEN, width=2, rx=14)
    s.text(580, 88, "Secondary market (stock exchange)", size=17, weight="bold", color=GREEN)
    a = box(s, 490, 170, 140, 56, ["Investor A", "sells"], GREEN, F_GREEN, size=16)
    b = box(s, 670, 170, 140, 56, ["Investor B", "buys"], GREEN, F_GREEN, size=16)
    br = box(s, 580, 320, 220, 56, ["Brokers on the", "stock exchange"], TEAL, F_TEAL, size=15)
    link(s, a, br, color=MUTED)
    link(s, br, b, color=MUTED)
    s.text(580, 252, "existing shares change hands", size=13, color=MUTED, italic=True)
    title(s, "New money for the company comes only from the primary market", y=34, size=17)
    return s


# ═══ Legal and modern trends ════════════════════════════════════════════════

@fig
def contract_elements():
    s = Svg(720, 470, "Elements of a valid contract",
            "A valid contract needs offer and acceptance, consideration, capacity of the parties, intention to create legal relations, "
            "legality of purpose and genuine consent.")
    c = box(s, 360, 240, 200, 80, ["Valid", "contract"], INK, F_GREY, size=20)
    items = [("Offer", BLUE, F_BLUE), ("Acceptance", BLUE, F_BLUE), ("Consideration", GREEN, F_GREEN),
             ("Capacity", ORANGE, F_AMBER), ("Intention to create legal relations", PURPLE, F_PURPLE),
             ("Legality", RED, F_RED), ("Genuine consent", TEAL, F_TEAL)]
    n = len(items)
    for i, (name, col, fill) in enumerate(items):
        a = math.radians(90 - i * 360 / n)
        x, y = 360 + 255 * math.cos(a), 240 - 175 * math.sin(a)
        words = name.split(" ")
        lines = [name] if len(name) < 16 else [" ".join(words[:2]), " ".join(words[2:])]
        b = box(s, x, y, 190, 54 if len(lines) == 1 else 62, lines, col, fill, size=15, bold_first=False)
        link(s, b, c, color=col, gap=4)
    return s


@fig
def ecommerce_flow():
    s = Svg(780, 340, "How an online purchase works",
            "A customer orders on a website or app, pays by mobile money or card, the seller confirms and packs the goods, and a "
            "delivery rider brings them to the customer.")
    steps = [("Customer", "orders on phone", BLUE, F_BLUE), ("Online shop", "website or app", ORANGE, F_AMBER),
             ("Payment", "mobile money / card", GREEN, F_GREEN), ("Seller", "confirms and packs", PURPLE, F_PURPLE),
             ("Delivery", "rider or courier", TEAL, F_TEAL)]
    prev = None
    first = None
    for i, (n, d, col, fill) in enumerate(steps):
        b = box(s, 82 + i * 154, 150, 136, 80, [n, d], col, fill, size=16)
        if prev:
            link(s, prev, b, color=INK, gap=3)
        prev = b
        first = first or b
    s.path("M 698 196 C 698 300, 82 300, 82 196", color=MUTED, width=2.5, dash="8 6", arrow="end")
    s.text(390, 292, "goods reach the customer; feedback and reviews", size=14, color=MUTED, italic=True)
    title(s, "E-commerce: buying and selling through electronic networks", y=50)
    return s


def _tree3(s: Svg, root, cols, top=60, y1=165, y0=262, step=86, w=232):
    """A root box over three category columns, each listing items as (name, example) boxes."""
    r = box(s, s.w / 2, top, 260, 52, root, INK, F_GREY, size=19)
    xs = [s.w / 2 - 256, s.w / 2, s.w / 2 + 256]
    for x, (head, col, fill, items) in zip(xs, cols):
        h = box(s, x, y1, w, 50, head, col, fill, size=18)
        link(s, r, h, color=MUTED)
        prev = h
        for i, (name, ex) in enumerate(items):
            b = box(s, x, y0 + i * step, w, 64, [name, ex], col, "#ffffff", size=16, rx=10)
            if i == 0:
                link(s, prev, b, color=col)
            else:
                s.line(x, y0 + (i - 1) * step + 32, x, y0 + i * step - 32, color=col, width=2.5)
            prev = b


@fig
def transport_modes():
    s = Svg(780, 520, "Modes of transport",
            "Transport is by land (road, rail and pipeline), by water (inland waterways, coastal shipping and ocean shipping by "
            "liners and tramps) and by air (scheduled passenger and cargo flights, and charter flights).")
    _tree3(s, "Modes of transport", [
        ("Land", GREEN, F_GREEN, [("Road", "lorries, buses, keke, okada"), ("Rail", "iron ore to the coast"),
                                  ("Pipeline", "fuel, water, gas")]),
        ("Water", BLUE, F_BLUE, [("Inland waterways", "rivers, creeks, ferries"), ("Coastal shipping", "port to port"),
                                 ("Ocean shipping", "liners and tramps")]),
        ("Air", ORANGE, F_AMBER, [("Scheduled flights", "fixed routes and times"), ("Air cargo", "urgent, light, valuable"),
                                  ("Charter flights", "hired for one trip")]),
    ])
    s.text(390, 500, "Each mode suits different goods, distances and budgets", size=15, color=MUTED, italic=True)
    return s


@fig
def container_journey():
    s = Svg(780, 420, "A container's journey, door to door",
            "The exporter packs and seals a container at the factory. A lorry or train takes it to the port, where a crane "
            "loads it onto a ship. At Queen Elizabeth II Quay in Freetown it is unloaded and cleared by customs, and a lorry "
            "carries it to the importer's warehouse, where the seal is opened. The goods are handled only at the two ends.")
    row1 = [("1 Factory", "packed and sealed", GREEN, F_GREEN), ("2 Lorry or train", "to the port", TEAL, F_TEAL),
            ("3 Port of loading", "crane onto ship", BLUE, F_BLUE)]
    row2 = [("6 Importer", "seal opened", GREEN, F_GREEN), ("5 Lorry", "to the warehouse", TEAL, F_TEAL),
            ("4 Freetown port", "unloaded, customs", BLUE, F_BLUE)]
    xs = [130, 390, 650]
    top = [box(s, x, 130, 210, 72, [n, d], c, f, size=17) for x, (n, d, c, f) in zip(xs, row1)]
    bot = [box(s, x, 310, 210, 72, [n, d], c, f, size=17) for x, (n, d, c, f) in zip(xs, row2)]
    link(s, top[0], top[1], color=INK)
    link(s, top[1], top[2], color=INK)
    link(s, top[2], bot[2], color=INK)
    s.label(650, 220, "ship at sea", size=15, weight="bold", color=BLUE)
    link(s, bot[2], bot[1], color=INK)
    link(s, bot[1], bot[0], color=INK)
    s.text(390, 392, "the same sealed box all the way: less handling, theft and damage", size=15, color=MUTED, italic=True)
    title(s, "Containerisation: one box from door to door", y=40)
    return s


@fig
def communication_services():
    s = Svg(780, 520, "Communication services",
            "Postal services carry letters and parcels, with registered post, post office boxes and express mail. Courier "
            "companies give fast, tracked door-to-door delivery. Telecommunication covers mobile calls and SMS, the internet "
            "and email, and radio and television.")
    _tree3(s, "Communication services", [
        ("Postal (SALPOST)", BLUE, F_BLUE, [("Letters and parcels", "ordinary and registered"), ("Post office boxes", "private mail address"),
                                            ("Express mail", "faster, tracked")]),
        ("Courier services", ORANGE, F_AMBER, [("Door to door", "collected and delivered"), ("Tracked", "progress online"),
                                               ("Fast", "documents, small parcels")]),
        ("Telecommunication", PURPLE, F_PURPLE, [("Mobile phones", "calls, SMS, money"), ("Internet", "email, web, WhatsApp"),
                                                 ("Radio and TV", "news, advertising")]),
    ])
    s.text(390, 500, "Business chooses by speed, cost, distance and need for a record", size=15, color=MUTED, italic=True)
    return s


# ─────────────────────────────────────────────────────────────────────────────

def main(names: list[str]) -> int:
    chosen = names or list(FIGS)
    unknown = [n for n in chosen if n not in FIGS]
    if unknown:
        print("unknown figures:", ", ".join(unknown))
        return 1
    for n in chosen:
        FIGS[n]().save(OUT / f"{n}.svg")
    print(f"wrote {len(chosen)} diagram(s) to {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
