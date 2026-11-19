#!/usr/bin/env python3
"""Original diagrams and maps for the History notes.

    python3 scripts/notes/history_figs.py            # write every diagram
    python3 scripts/notes/history_figs.py name ...   # write some

Each function draws one figure and returns an Svg. Files go to
public/img/history/<name>.svg and lessons show them from
https://wasscetutor.com/img/history/<name>.svg. All drawn by WASSCE Tutor.

Maps reuse the Natural Earth outlines (public domain) in
scripts/notes/data/geography-maps.json. Positions of historical towns are
approximate, and areas of historical states are shown as approximate zones,
because their borders were never fixed lines.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from chemistry_figs import box, link  # noqa: E402
from geography_figs import (  # noqa: E402
    BROWN, MAPS, NEIGHBOUR, RIVER, SEA_FILL, WA_BOX, Proj, country, north_arrow, ring_d, town,
)
from government_figs import heading, note  # noqa: E402
from svgfig import (  # noqa: E402
    BLUE, F_AMBER, F_BLUE, F_GREEN, F_GREY, F_PURPLE, F_RED, GREEN, INK, MUTED, ORANGE, PURPLE, RED, TEAL, Svg,
)

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/img/history"
FIGS: dict[str, callable] = {}
F_TEAL = "#ccfbf1"
LANDFILL = "#fef9c3"


def fig(fn):
    FIGS[fn.__name__.replace("_", "-")] = fn
    return fn


def timeline(s: Svg, x0: float, x1: float, y: float, start: int, end: int, events, step: int, size: int = 13):
    """Horizontal timeline. events: (year, label lines, colour); labels alternate above and below."""
    s.line(x0, y, x1, y, color=INK, width=3)
    X = lambda yr: x0 + (x1 - x0) * (yr - start) / (end - start)  # noqa: E731
    for yr in range(start, end + 1, step):
        s.line(X(yr), y - 6, X(yr), y + 6, color=MUTED, width=1.5)
        s.text(X(yr), y + 22, str(yr), size=12, color=MUTED)
    for k, (yr, lines, col) in enumerate(events):
        x = X(yr)
        up = k % 2 == 0
        s.circle(x, y, 7, fill=col, stroke="#ffffff", width=2)
        ly = y - 46 if up else y + 50
        s.line(x, y + (-8 if up else 8), x, ly + (14 if up else -14), color=col, width=1.6)
        for i, t in enumerate(lines):
            yy = ly - (len(lines) - 1 - i) * (size + 4) if up else ly + i * (size + 4)
            s.label(x, yy, t, size=size, color=col if i == 0 else INK, weight="bold" if i == 0 else "normal", pad=2)
    return X


def vtimeline(s: Svg, x: float, y0: float, gap: float, events, size: int = 16):
    """Vertical timeline: a line at x, years to its left, events to its right. events: (year label, text, colour)."""
    y1 = y0 + gap * (len(events) - 1)
    s.line(x, y0 - 14, x, y1 + 14, color=INK, width=3)
    for k, (yr, text, col) in enumerate(events):
        y = y0 + k * gap
        s.circle(x, y, 9, fill=col, stroke="#ffffff", width=2.5)
        s.text(x - 22, y, yr, size=size + 1, weight="bold", color=col, anchor="end")
        if isinstance(text, str):
            text = [text]
        for i, t in enumerate(text):
            s.text(x + 24, y + (i - (len(text) - 1) / 2) * (size + 5), t, size=size if i == 0 else size - 2,
                   weight="bold" if i == 0 else "normal", color=INK, anchor="start")


def map_frame(s: Svg, box, x0=6, y0=6, w=None, h=None, countries="wa", fill=LANDFILL, only=None):
    """Sea background and country outlines for a map. Returns the projection."""
    w = w or s.w - 12
    h = h or s.h - 12
    P = Proj(box, x0, y0, w, h)
    s.rect(0, 0, s.w, s.h, fill=SEA_FILL, stroke="none", width=0, rx=20)
    data = MAPS["wa_countries"] if countries == "wa" else MAPS["af_countries"]
    for n, rings in data.items():
        if n == "Cabo Verde":
            continue
        country(s, P, rings, fill if (only is None or n in only) else NEIGHBOUR, stroke="#94a3b8", width=1)
    return P


def zone(s: Svg, P, lon, lat, rx_deg, ry_deg, col, fill, label, sub, lx=None, ly=None):
    """An approximate area drawn as a soft ellipse in degrees, with a label."""
    x, y = P(lon, lat)
    rx = rx_deg * P.c * P.k
    ry = ry_deg * P.k
    s.ellipse(x, y, rx, ry, fill=fill, stroke=col, width=2.5)
    s.raw(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{fill}" fill-opacity="0.45" stroke="none"/>')
    tx, ty = P(lx if lx is not None else lon, ly if ly is not None else lat)
    s.label(tx, ty - 9, label, size=15, color=col, weight="bold", pad=3)
    s.label(tx, ty + 10, sub, size=12, color=INK, pad=2)


# ═══ H1: West Africa to abolition ════════════════════════════════════════════

@fig
def sources_of_history():
    s = Svg(800, 470, "Sources of West African history",
            "Historians use written sources, such as Arabic chronicles and travellers' accounts, European records and "
            "archives, and modern documents; and unwritten sources, such as oral tradition kept by griots and elders, "
            "archaeology, linguistics, art and artefacts, ethnography and place names. Each source is checked against "
            "others.")
    heading(s, "How we know about the past")
    top = box(s, 400, 85, 300, 54, ["SOURCES OF HISTORY"], col=PURPLE, fill=F_PURPLE, size=18)
    a = box(s, 205, 280, 360, 290, ["WRITTEN sources", "", "Arabic chronicles and", "travellers' accounts",
                                    "(al-Bakri, Ibn Battuta,", "Tarikh al-Sudan)", "European records:", "ships' logs, letters, treaties",
                                    "colonial archives, newspapers"], col=BLUE, fill=F_BLUE, size=17)
    b = box(s, 595, 280, 360, 290, ["UNWRITTEN sources", "", "oral tradition: griots,", "elders, praise songs",
                                    "archaeology: digs at sites", "such as Kumbi Saleh", "linguistics, place names",
                                    "art and artefacts", "(Benin bronzes, Ife heads)"], col=GREEN, fill=F_GREEN, size=17)
    link(s, top, a, color=MUTED, width=2)
    link(s, top, b, color=MUTED, width=2)
    return s


@fig
def west_africa_peoples():
    s = Svg(800, 600, "Some major peoples of West Africa",
            "Map of West Africa with the approximate homelands of some major peoples: the Wolof in Senegal; the Soninke "
            "and Mandinka in the western Sudan; the Fulani spread across the savanna and the Fouta Djallon; the Temne and "
            "Mende in Sierra Leone; the Akan in Ghana and Côte d'Ivoire; the Ewe in Togo; the Yoruba, Igbo and Hausa in "
            "Nigeria; the Kanuri around Lake Chad; the Songhai on the Niger bend; the Mossi in Burkina Faso; and the "
            "Tuareg in the Sahara. Positions are approximate.")
    P = map_frame(s, WA_BOX)
    peoples = [(-15.8, 15.5, "Wolof", BLUE), (-9.5, 15.6, "Soninke", PURPLE), (-8.5, 12.3, "Mandinka", PURPLE),
               (-12.0, 11.2, "Fulani", ORANGE), (-3.5, 14.6, "Fulani", ORANGE), (-12.9, 9.1, "Temne", GREEN),
               (-11.4, 7.7, "Mende", GREEN), (-2.2, 6.6, "Akan", RED), (0.9, 6.9, "Ewe", RED),
               (4.0, 8.0, "Yoruba", BLUE), (7.4, 5.7, "Igbo", BLUE), (8.3, 12.0, "Hausa", PURPLE),
               (13.0, 12.6, "Kanuri", TEAL), (0.0, 16.0, "Songhai", TEAL), (-1.5, 12.6, "Mossi", ORANGE),
               (4.0, 20.0, "Tuareg", BROWN)]
    for lon, lat, n, col in peoples:
        x, y = P(lon, lat)
        s.label(x, y, n, size=16, color=col, weight="bold", pad=3)
    x, y = P(-21.0, 3.2)
    s.label(x, y, "Positions are approximate: peoples overlap and many live across modern borders.", size=13, anchor="start", pad=3)
    return s


@fig
def sudanic_empires():
    s = Svg(800, 520, "The empires of ancient Ghana, Mali and Songhai",
            "Approximate core areas of three great Western Sudanese empires along the upper and middle Niger: ancient Ghana "
            "(about 300 to 1076, in the Sahel north of the Senegal and Niger, capital Kumbi Saleh), Mali (about 1235 to "
            "1600, centred on the upper Niger, capital Niani), and Songhai (about 1464 to 1591, along the Niger bend, "
            "capital Gao). Trading cities included Walata, Timbuktu and Djenné. Areas are approximate.")
    box_ = (-17.5, 9.0, 6.0, 21.0)
    P = map_frame(s, box_)
    for r in MAPS["wa_rivers"]:
        s.path(ring_d(P, r, close=False), color=RIVER, width=2.4)
    zone(s, P, -8.5, 15.8, 4.2, 1.9, ORANGE, "#fed7aa", "GHANA", "c. 300–1076", lx=-9.8, ly=17.4)
    zone(s, P, -8.0, 12.6, 5.0, 2.4, GREEN, "#bbf7d0", "MALI", "c. 1235–1600", lx=-9.5, ly=11.5)
    zone(s, P, -1.0, 15.6, 4.6, 2.2, PURPLE, "#e9d5ff", "SONGHAI", "c. 1464–1591", lx=0.5, ly=17.6)
    for lon, lat, n, cap, dx in [(-7.97, 15.77, "Kumbi Saleh", True, 10), (-8.38, 11.38, "Niani", True, 10),
                                 (-0.04, 16.27, "Gao", True, 10), (-3.0, 16.77, "Timbuktu", False, -10),
                                 (-4.55, 13.9, "Djenné", False, 10), (-7.0, 17.3, "Walata", False, 10)]:
        town(s, P, lon, lat, n, dx=dx, anchor="start" if dx > 0 else "end", capital=cap, size=13)
    x, y = P(-4.6, 14.95)
    s.label(x, y, "R. Niger", size=12, color=RIVER, italic=True, weight="bold", pad=2)
    x, y = P(-15.6, 9.6)
    s.label(x, y, "◎ capital    • trading city    zones approximate", size=12, anchor="start", pad=3)
    north_arrow(s, 760, 70)
    return s


@fig
def trans_saharan_routes():
    s = Svg(800, 680, "Main trans-Saharan trade routes",
            "Map of North and West Africa with three main trans-Saharan routes: a western route from Sijilmasa through the "
            "salt mines of Taghaza to Walata and Timbuktu; a central route from Tunis and Ghadames through Agadez to Gao "
            "and Kano; and an eastern route from Tripoli through the Fezzan and Bilma to Kanem and Lake Chad. Gold, kola "
            "nuts, ivory and slaves went north; salt, horses, cloth, copper, books and luxury goods came south.")
    box_ = (-18.0, 5.0, 22.0, 37.5)
    P = map_frame(s, box_, countries="af", fill="#fef3c7")
    routes = [([(-4.3, 31.3), (-5.0, 23.6), (-7.0, 17.3), (-3.0, 16.77)], BLUE),
              ([(10.2, 36.8), (9.5, 30.1), (8.0, 17.0), (-0.04, 16.27)], PURPLE),
              ([(9.5, 30.1), (8.0, 17.0), (8.52, 12.0)], PURPLE),
              ([(13.2, 32.9), (13.9, 25.9), (12.9, 18.7), (14.0, 13.5)], GREEN)]
    for pts, col in routes:
        s.polyline([P(*p) for p in pts], color=col, width=4, dash="10 6")
    towns = [(-4.3, 31.3, "Sijilmasa", 10), (-5.0, 23.6, "Taghaza (salt)", 10), (-7.0, 17.3, "Walata", -10),
             (-3.0, 16.77, "Timbuktu", -10), (10.2, 36.8, "Tunis", 10), (9.5, 30.1, "Ghadames", -10),
             (8.0, 17.0, "Agadez", -10), (-0.04, 16.27, "Gao", 10), (8.52, 12.0, "Kano", -10),
             (13.2, 32.9, "Tripoli", 10), (13.9, 25.9, "Murzuk (Fezzan)", 10), (12.9, 18.7, "Bilma", 10),
             (14.0, 13.5, "Kanem / L. Chad", 10)]
    for lon, lat, n, dx in towns:
        town(s, P, lon, lat, n, dx=dx, anchor="start" if dx > 0 else "end", size=13)
    x, y = P(2.0, 26.0)
    s.text(x, y, "S A H A R A", size=22, weight="bold", color="#92400e")
    s.rect(18, 560, 410, 108, fill="#ffffff", stroke="#94a3b8", width=1.2, rx=10)
    s.text(32, 584, "Going north: gold, kola nuts, ivory, slaves, leather", size=14, anchor="start", weight="bold", color=ORANGE)
    s.text(32, 610, "Going south: salt, horses, cloth, copper, books,", size=14, anchor="start", weight="bold", color=BLUE)
    s.text(32, 630, "glassware, swords and luxury goods", size=14, anchor="start", weight="bold", color=BLUE)
    s.text(32, 654, "Camels carried goods across the desert.", size=13, anchor="start", color=MUTED)
    return s


@fig
def forest_states():
    s = Svg(800, 520, "Forest and coastal states of West Africa",
            "Map of the Gulf of Guinea coast with the centres of major forest and coastal states: Asante (capital Kumasi) "
            "in present-day Ghana; Dahomey (capital Abomey) in present-day Benin; Oyo (capital Oyo-Ile, Old Oyo) and the "
            "sacred city of Ile-Ife in Yorubaland; and the Benin Kingdom (capital Benin City) in present-day Nigeria. "
            "Positions are approximate.")
    box_ = (-4.5, 4.0, 8.0, 11.5)
    P = map_frame(s, box_)
    for r in MAPS["wa_rivers"]:
        s.path(ring_d(P, r, close=False), color=RIVER, width=2)
    states = [(-1.62, 6.69, "Kumasi", "ASANTE", RED, -1.6, 7.6), (1.99, 7.18, "Abomey", "DAHOMEY", PURPLE, 1.7, 8.1),
              (4.38, 8.95, "Oyo-Ile (Old Oyo)", "OYO", BLUE, 4.2, 9.9), (4.56, 7.48, "Ile-Ife", "", BLUE, 0, 0),
              (5.62, 6.34, "Benin City", "BENIN", GREEN, 6.4, 7.1)]
    for lon, lat, townname, state, col, lx, ly in states:
        town(s, P, lon, lat, townname, dx=10, anchor="start", capital=bool(state), size=14)
        if state:
            x, y = P(lx, ly)
            s.label(x, y, state, size=18, color=col, weight="bold", pad=4)
    x, y = P(1.5, 4.6)
    s.text(x, y, "Gulf of Guinea", size=17, italic=True, weight="bold", color="#1d4ed8")
    return s


@fig
def triangular_trade():
    s = Svg(800, 470, "The triangular trade",
            "The triangular trade of the Atlantic: ships carried manufactured goods such as guns, gunpowder, cloth, iron "
            "bars, beads and alcohol from Europe to West Africa; enslaved Africans across the Atlantic in the Middle Passage "
            "to the Americas; and plantation produce such as sugar, cotton, tobacco, rum and coffee back to Europe.")
    heading(s, "The triangular trade (16th to 19th centuries)")
    eu = box(s, 400, 110, 260, 90, ["EUROPE", "Britain, Portugal, France,", "the Netherlands"], col=BLUE, fill=F_BLUE, size=17)
    am = box(s, 150, 370, 250, 90, ["THE AMERICAS", "Caribbean, Brazil,", "North America"], col=GREEN, fill=F_GREEN, size=17)
    af = box(s, 650, 370, 250, 90, ["WEST AFRICA", "coastal forts and", "trading posts"], col=ORANGE, fill=F_AMBER, size=17)
    s.arrow(520, 150, 640, 318, color=BLUE, width=4)
    s.label(660, 225, "1. guns, cloth, iron,", size=14, color=BLUE, weight="bold", pad=3)
    s.label(660, 246, "beads, alcohol", size=14, color=BLUE, weight="bold", pad=3)
    s.arrow(520, 382, 280, 382, color=RED, width=5)
    s.label(400, 410, "2. enslaved Africans", size=15, color=RED, weight="bold", pad=3)
    s.label(400, 432, "(the Middle Passage)", size=13, color=RED, pad=3)
    s.arrow(170, 318, 290, 150, color=GREEN, width=4)
    s.label(130, 225, "3. sugar, cotton,", size=14, color=GREEN, weight="bold", pad=3)
    s.label(130, 246, "tobacco, rum, coffee", size=14, color=GREEN, weight="bold", pad=3)
    return s


@fig
def europeans_timeline():
    s = Svg(800, 470, "Europeans on the West African coast, 1440s to 1670s",
            "Timeline: Portuguese sailors reach the Senegal coast in the 1440s; Pedro de Sintra names Sierra Leone in "
            "1462; the Portuguese build Elmina Castle in 1482; the Dutch capture Elmina in 1637; the English take Cape Coast "
            "Castle in 1664; and English traders build a fort on Bunce Island in the Sierra Leone River around 1670.")
    heading(s, "Europeans on the West African coast")
    events = [("1440s", ["Portuguese sailors reach the Senegal coast", "the start of direct sea trade with West Africa"], BLUE),
              ("1462", ["Pedro de Sintra names Sierra Leone", "'Serra Leoa', the lion mountains"], GREEN),
              ("1482", ["Portuguese build Elmina Castle", "on the Gold Coast, to control the gold trade"], BLUE),
              ("1637", ["The Dutch capture Elmina", "Portugal's monopoly is broken"], ORANGE),
              ("1664", ["The English take Cape Coast Castle", "which becomes their Gold Coast headquarters"], RED),
              ("c. 1670", ["English traders fortify Bunce Island", "in the Sierra Leone River estuary"], PURPLE)]
    vtimeline(s, 140, 92, 66, events, size=18)
    return s


@fig
def abolition_timeline():
    s = Svg(800, 530, "Milestones in the abolition of the slave trade and slavery",
            "Timeline: the Somerset case in England in 1772; the Province of Freedom in Sierra Leone in 1787; the British "
            "Act abolishing the slave trade in 1807; Sierra Leone becomes a Crown Colony and base for the anti-slavery "
            "squadron in 1808; the Slavery Abolition Act passed in 1833; slavery abolished in the United States in 1865; "
            "and in Brazil in 1888.")
    heading(s, "From the slave trade to the end of slavery")
    events = [("1772", ["Somerset case in England", "a slave cannot be forced to leave England"], PURPLE),
              ("1787", ["Province of Freedom founded", "freed Black settlers land in Sierra Leone"], GREEN),
              ("1807", ["Britain abolishes the slave trade", "British subjects may no longer trade in slaves"], RED),
              ("1808", ["Sierra Leone becomes a Crown Colony", "base for the anti-slavery naval squadron"], GREEN),
              ("1833", ["Slavery Abolition Act", "slavery ended in most British colonies from 1834"], RED),
              ("1865", ["Slavery abolished in the USA", "Thirteenth Amendment"], BLUE),
              ("1888", ["Slavery abolished in Brazil", "the last country in the Americas"], BLUE)]
    vtimeline(s, 140, 92, 66, events, size=18)
    return s



# ═══ H2: jihads to 20th-century Africa ═══════════════════════════════════════

AF_BOX = (-19.0, -36.0, 53.0, 38.5)


def africa_frame(s: Svg, fills: dict, default="#f1f5f9"):
    """Africa outline with each modern country filled by `fills` (ISO3 → colour). Returns the projection."""
    P = Proj(AF_BOX, 20, 50, s.w - 40, s.h - 140)
    s.rect(0, 0, s.w, s.h, fill=SEA_FILL, stroke="none", width=0, rx=20)
    for iso, rings in MAPS["af_countries"].items():
        country(s, P, rings, fills.get(iso, default), stroke="#ffffff", width=1.2)
    return P


def legend(s: Svg, items, x0, y0, cols=2, colw=250, rowh=28, size=14):
    for k, (col, text) in enumerate(items):
        x = x0 + (k % cols) * colw
        y = y0 + (k // cols) * rowh
        s.rect(x, y - 9, 22, 18, fill=col, stroke="#64748b", width=1)
        s.text(x + 30, y, text, size=size, anchor="start")


@fig
def jihad_states():
    s = Svg(800, 430, "Nineteenth-century jihad states and Samori's empire",
            "Map of West Africa with the approximate areas of states created by nineteenth-century jihads: the Sokoto "
            "Caliphate founded by Usman dan Fodio (jihad from 1804) in Hausaland; Masina (Hamdullahi) founded by Seku "
            "Ahmadu (from 1818) on the inland Niger delta; and the Tukulor empire of al-Hajj Umar Tall (from the 1850s) "
            "between the Senegal and the Niger. Samori Toure's Mandinka empire (from the 1870s) is also shown. Areas are "
            "approximate.")
    P = map_frame(s, (-17.5, 6.5, 14.0, 18.0))
    for r in MAPS["wa_rivers"]:
        s.path(ring_d(P, r, close=False), color=RIVER, width=2.2)
    zone(s, P, 7.0, 11.8, 4.8, 2.2, GREEN, "#bbf7d0", "SOKOTO CALIPHATE", "Usman dan Fodio, from 1804", lx=7.0, ly=14.6)
    zone(s, P, -4.6, 14.4, 1.8, 1.3, PURPLE, "#e9d5ff", "MASINA", "Seku Ahmadu, from 1818", lx=-3.6, ly=16.6)
    zone(s, P, -8.6, 13.7, 3.6, 1.6, ORANGE, "#fed7aa", "TUKULOR EMPIRE", "al-Hajj Umar, from 1850s", lx=-10.5, ly=16.3)
    zone(s, P, -8.0, 9.9, 2.6, 1.6, RED, "#fecaca", "SAMORI'S EMPIRE", "Samori Toure, from 1870s", lx=-8.0, ly=7.4)
    for lon, lat, n, dx in [(5.24, 13.06, "Sokoto", 10), (-4.2, 14.5, "Hamdullahi", 10), (-6.27, 13.45, "Segou", 10),
                            (-9.0, 10.5, "Bissandugu", 10)]:
        town(s, P, lon, lat, n, dx=dx, capital=True, size=13)
    s.label(22, 26, "Areas are approximate; borders changed constantly.", size=13, anchor="start", pad=4)
    return s


# Colonial rulers about 1914, shown on modern borders.
COLONIAL_1914 = {
    "British": (["NGA", "GHA", "SLE", "GMB", "EGY", "SDN", "SSD", "UGA", "KEN", "ZMB", "ZWE", "MWI", "BWA", "ZAF", "LSO", "SWZ", "null"], "#fca5a5"),
    "French": (["DZA", "TUN", "MAR", "MRT", "SEN", "MLI", "BFA", "NER", "TCD", "GIN", "CIV", "BEN", "CAF", "COG", "GAB", "MDG", "DJI"], "#93c5fd"),
    "German": (["TZA", "RWA", "BDI", "CMR", "TGO", "NAM"], "#d6d3d1"),
    "Belgian": (["COD"], "#fde68a"),
    "Portuguese": (["AGO", "MOZ", "GNB"], "#86efac"),
    "Italian": (["LBY", "ERI", "SOM"], "#d8b4fe"),
    "Spanish": (["ESH", "GNQ"], "#fdba74"),
    "Independent": (["ETH", "LBR"], "#ffffff"),
}


@fig
def partition_1914():
    s = Svg(800, 900, "Africa partitioned among European powers, about 1914",
            "Map of Africa coloured by the European power that ruled each area around 1914, drawn on modern borders: "
            "Britain (including Nigeria, Gold Coast, Sierra Leone, The Gambia, Egypt, Sudan, Kenya, Uganda, the Rhodesias "
            "and South Africa), France (North and West Africa, French Equatorial Africa and Madagascar), Germany (Togoland, "
            "Kamerun, German South West Africa and German East Africa), Belgium (the Congo), Portugal (Angola, Mozambique "
            "and Guinea-Bissau), Italy (Libya, Eritrea and Somalia) and Spain (Western Sahara and Equatorial Guinea). Only "
            "Ethiopia and Liberia were independent.")
    fills = {iso: col for isos, col in COLONIAL_1914.values() for iso in isos}
    africa_frame(s, fills)
    heading(s, "Africa partitioned, about 1914", y=30)
    legend(s, [(col, name) for name, (_, col) in COLONIAL_1914.items()], 40, 800, cols=4, colw=185, rowh=30, size=15)
    s.text(400, 878, "Modern borders shown; colonial boundaries differed in places.", size=13, color=MUTED)
    return s


@fig
def colonial_rule_compared():
    s = Svg(800, 520, "British indirect rule and French direct rule compared",
            "Two chains of authority. British indirect rule: the Governor, then Residents or District Commissioners, then "
            "the Native Authority of traditional chiefs, then district and village heads, then the people; chiefs kept their positions and ruled through "
            "local custom under British supervision. French direct rule: the Governor-General of French West Africa at "
            "Dakar, then Lieutenant-Governors of each colony, then commandants of districts (cercles), then appointed "
            "canton and village chiefs, then the people; chiefs became agents of the French administration.")
    heading(s, "Who ruled whom? British and French systems")
    s.text(205, 70, "BRITISH: indirect rule", size=17, weight="bold", color=RED)
    s.text(595, 70, "FRENCH: direct rule", size=17, weight="bold", color=BLUE)
    right = ["Governor-General (Dakar)", "Lieutenant-Governor", "Commandant de cercle", "Canton and village chiefs", "The people"]
    lb = [box(s, 205, 120 + k * 80, 330, 54, [t] if k != 2 else ["Native Authority", "(traditional chiefs)"], col=RED, fill=F_RED, size=16)
          for k, t in enumerate(["Governor", "Resident / District Commissioner", "", "District and village heads", "The people"])]
    rb = [box(s, 595, 120 + k * 80, 330, 54, [t], col=BLUE, fill=F_BLUE, size=16) for k, t in enumerate(right)]
    for bs in (lb, rb):
        for a, b in zip(bs, bs[1:]):
            link(s, a, b, color=MUTED, width=2)
    note(s, "British: chiefs kept power under supervision.   French: chiefs became appointed agents.", 508, size=14, color=INK)
    return s


@fig
def resistance_map():
    s = Svg(800, 480, "Leaders of West African resistance to colonial rule",
            "Map of West Africa marking leaders of resistance to European colonial rule: Lat Dior of Cayor in Senegal "
            "(killed 1886); Samori Toure of the Mandinka empire (resisted the French until 1898); Bai Bureh in Sierra Leone "
            "(Hut Tax War, 1898); Yaa Asantewaa of Asante (1900); Behanzin of Dahomey (1892–94); Sultan Attahiru I of "
            "Sokoto (1903); Jaja of Opobo (deported 1887); and Nana Olomu of the Itsekiri (1894).")
    P = map_frame(s, (-17.8, 4.0, 9.5, 16.5))
    leaders = [(-16.6, 15.2, "Lat Dior (Cayor)", "killed 1886", "right"), (-9.0, 10.5, "Samori Toure", "captured 1898", "right"),
               (-12.79, 8.77, "Bai Bureh", "Hut Tax War 1898", "left"), (-1.62, 6.69, "Yaa Asantewaa", "1900", "left"),
               (1.99, 7.18, "Behanzin (Dahomey)", "1892–94", "right"), (5.24, 13.06, "Attahiru I (Sokoto)", "1903", "left"),
               (5.4, 5.6, "Nana Olomu", "1894", "left"), (7.55, 4.5, "Jaja of Opobo", "deported 1887", "below")]
    for lon, lat, n, d, side in leaders:
        x, y = P(lon, lat)
        s.polygon([(x, y - 10), (x + 9, y), (x, y + 10), (x - 9, y)], fill=RED, stroke=INK, width=1.5)
        if side == "below":
            s.label(x, y + 26, n, size=15, weight="bold", color=RED, pad=3)
            s.label(x, y + 46, d, size=13, color=INK, pad=2)
            continue
        anchor, dx = ("start", 13) if side == "right" else ("end", -13)
        s.label(x + dx, y - 9, n, size=15, anchor=anchor, weight="bold", color=RED, pad=3)
        s.label(x + dx, y + 11, d, size=13, anchor=anchor, color=INK, pad=2)
    return s


WA_INDEPENDENCE = {
    "Ghana": 1957, "Guinea": 1958, "Nigeria": 1960, "Senegal": 1960, "Mali": 1960, "Burkina Faso": 1960, "Niger": 1960,
    "Côte d'Ivoire": 1960, "Togo": 1960, "Benin": 1960, "Mauritania": 1960, "Sierra Leone": 1961, "Gambia": 1965,
    "Guinea-Bissau": 1974,
}


@fig
def west_africa_independence():
    s = Svg(800, 640, "Independence dates of West African countries",
            "Map of West Africa with each country's year of independence: Ghana 1957 (first in British West Africa), "
            "Guinea 1958, most French colonies and Nigeria in 1960, Sierra Leone 1961, The Gambia 1965, Guinea-Bissau 1974 "
            "(recognised by Portugal; declared 1973) and Cabo Verde 1975. Liberia was never colonised and has been "
            "independent since 1847.")
    cols = {1957: "#fca5a5", 1958: "#fdba74", 1960: "#93c5fd", 1961: "#86efac", 1965: "#d8b4fe", 1974: "#fde68a", 1975: "#99f6e4"}
    fills = {n: cols[y] for n, y in WA_INDEPENDENCE.items()}
    fills["Liberia"] = "#ffffff"
    P = map_frame(s, (-26.0, 3.0, 16.0, 23.0), h=560)
    for n, rings in MAPS["wa_countries"].items():
        if n in fills:
            country(s, P, rings, fills[n], stroke="#64748b", width=1.2)
    if "Cabo Verde" in MAPS["wa_countries"]:
        country(s, P, MAPS["wa_countries"]["Cabo Verde"], cols[1975], stroke="#64748b", width=1.2)
    x, y = P(-25.4, 18.4)
    s.label(x, y, "Cabo Verde 1975", size=13, weight="bold", anchor="start", pad=3)
    inside = [("Mauritania", -10.5, 20.0, "1960"), ("Mali", -2.5, 17.5, "1960"), ("Niger", 9.5, 17.0, "1960"),
              ("Senegal", -14.2, 15.1, "1960"), ("Burkina Faso", -1.7, 12.4, "1960"), ("Nigeria", 8.3, 9.7, "1960"),
              ("Guinea", -10.9, 10.8, "1958"), ("Côte d'Ivoire", -5.6, 8.0, "1960"), ("Ghana", -1.2, 7.6, "1957"),
              ("Liberia", -9.4, 6.6, "1847")]
    for n, lon, lat, yr in inside:
        x, y = P(lon, lat)
        s.label(x, y - 9, n, size=13, pad=2)
        s.label(x, y + 10, yr, size=16, weight="bold", pad=2)
    for n, yr, (lon, lat), (tlon, tlat), anchor in [
            ("The Gambia", "1965", (-25.4, 13.45), (-15.4, 13.45), "start"),
            ("Guinea-Bissau", "1974", (-25.4, 11.8), (-15.0, 12.0), "start"),
            ("Sierra Leone", "1961", (-25.4, 8.6), (-12.0, 8.6), "start"),
            ("Togo", "1960", (-0.6, 2.7), (1.0, 7.8), "middle"),
            ("Benin", "1960", (3.9, 2.7), (2.3, 9.2), "middle")]:
        x, y = P(lon, lat)
        tx, ty = P(tlon, tlat)
        sx = x + 118 if anchor == "start" else x
        s.line(sx, y, tx, ty, color=INK, width=1.2)
        s.circle(tx, ty, 3, fill=INK, stroke=INK, width=1)
        s.label(x, y, f"{n} {yr}", size=13, weight="bold", anchor=anchor, pad=3)
    legend(s, [(cols[1957], "1957"), (cols[1958], "1958"), (cols[1960], "1960"), (cols[1961], "1961"), (cols[1965], "1965"),
               (cols[1974], "1974"), (cols[1975], "1975"), ("#ffffff", "Liberia: since 1847")], 30, 588, cols=4, colw=190, rowh=28, size=14)
    return s


AFRICA_INDEPENDENCE = {
    "before 1950": (["LBR", "ETH", "EGY", "ZAF"], "#e5e7eb"),
    "1950s": (["LBY", "SDN", "MAR", "TUN", "GHA", "GIN"], "#fca5a5"),
    "1960–1964": (["CMR", "SEN", "TGO", "MDG", "COD", "SOM", "null", "BEN", "NER", "BFA", "CIV", "TCD", "CAF", "COG", "GAB", "MLI",
                   "NGA", "MRT", "SLE", "TZA", "DZA", "RWA", "BDI", "UGA", "KEN", "MWI", "ZMB"], "#93c5fd"),
    "1965–1969": (["GMB", "BWA", "LSO", "SWZ", "GNQ"], "#86efac"),
    "1970s": (["GNB", "MOZ", "AGO", "DJI"], "#fde68a"),
    "1980 and later": (["ZWE", "NAM", "ERI", "SSD"], "#d8b4fe"),
}


@fig
def africa_independence():
    s = Svg(800, 900, "When African countries became independent",
            "Map of Africa coloured by period of independence: before 1950 (Liberia, Ethiopia, Egypt and South Africa); the "
            "1950s (Libya, Sudan, Morocco, Tunisia, Ghana and Guinea); 1960 to 1964, when most countries gained "
            "independence; 1965 to 1969; the 1970s (the Portuguese colonies and Djibouti); and 1980 or later (Zimbabwe 1980, "
            "Namibia 1990, Eritrea 1993 and South Sudan 2011). Western Sahara remains disputed.")
    fills = {iso: col for isos, col in AFRICA_INDEPENDENCE.values() for iso in isos}
    fills["ESH"] = "#ffffff"
    africa_frame(s, fills)
    heading(s, "Waves of independence in Africa", y=30)
    legend(s, [(col, name) for name, (_, col) in AFRICA_INDEPENDENCE.items()] + [("#ffffff", "Western Sahara: disputed")],
           40, 800, cols=4, colw=185, rowh=30, size=15)
    s.text(400, 878, "1960 alone saw seventeen African countries become independent.", size=13, color=MUTED)
    return s


@fig
def pan_africanism_timeline():
    s = Svg(800, 600, "Milestones of Pan-Africanism",
            "Timeline: the first Pan-African Conference in London in 1900, organised by Henry Sylvester Williams; the "
            "Pan-African Congress in Paris in 1919 led by W. E. B. Du Bois; the National Congress of British West Africa "
            "in 1920; the Fifth Pan-African Congress in Manchester in 1945; the All-African Peoples' Conference in Accra in "
            "1958; the founding of the Organisation of African Unity in Addis Ababa in 1963; and the African Union in 2002.")
    heading(s, "Pan-Africanism: from conferences to the African Union")
    events = [("1900", ["First Pan-African Conference, London", "organised by Henry Sylvester Williams"], PURPLE),
              ("1919", ["Pan-African Congress, Paris", "led by W. E. B. Du Bois"], PURPLE),
              ("1920", ["National Congress of British West Africa", "J. E. Casely Hayford; delegates from Sierra Leone"], GREEN),
              ("1945", ["Fifth Pan-African Congress, Manchester", "Nkrumah, Kenyatta, Padmore, Du Bois"], RED),
              ("1958", ["All-African Peoples' Conference, Accra", "hosted by Nkrumah after Ghana's independence"], ORANGE),
              ("1963", ["Organisation of African Unity founded", "Addis Ababa, 25 May; 32 founding states"], BLUE),
              ("2002", ["African Union launched", "replaces the OAU"], BLUE)]
    vtimeline(s, 140, 92, 72, events, size=18)
    return s


@fig
def sokoto_caliphate_structure():
    s = Svg(800, 560, "How the Sokoto Caliphate was organised",
            "Diagram of the Sokoto Caliphate. At the top, Usman dan Fodio, Amir al-Mu'minin or Commander of the Faithful. "
            "From 1812 the caliphate was run in two halves: the eastern emirates, such as Kano, Katsina, Zaria, Bauchi, "
            "Adamawa, Gombe, Hadejia and Katagum, under Muhammad Bello at Sokoto; and the western emirates, such as Ilorin, "
            "Nupe, Agaie and Lapai, under Abdullahi at Gwandu. Each emirate was ruled by an emir who received a flag from "
            "the caliph, kept Islamic courts and paid tribute.")
    heading(s, "How the Sokoto Caliphate was organised")
    top = box(s, 400, 108, 560, 70, ["Usman dan Fodio", "Amir al-Mu'minin (Commander of the Faithful)"], col=GREEN, fill=F_GREEN, size=18)
    east = box(s, 210, 236, 340, 70, ["SOKOTO (east)", "Muhammad Bello, his son"], col=BLUE, fill=F_BLUE, size=17)
    west = box(s, 590, 236, 340, 70, ["GWANDU (west)", "Abdullahi, his brother"], col=PURPLE, fill=F_PURPLE, size=17)
    e2 = box(s, 210, 364, 340, 104, ["Eastern emirates", "Kano · Katsina · Zaria", "Bauchi · Adamawa · Gombe", "Hadejia · Katagum and others"],
             col=BLUE, fill="#ffffff", size=16)
    w2 = box(s, 590, 364, 340, 104, ["Western emirates", "Ilorin · Nupe (Bida)", "Agaie · Lapai and others"], col=PURPLE, fill="#ffffff", size=16)
    for a, b in [(top, east), (top, west), (east, e2), (west, w2)]:
        link(s, a, b, color=MUTED, width=2.5)
    box(s, 400, 484, 740, 64, ["Each emir: a flag from the caliph, Islamic courts (alkali) and tribute to Sokoto or Gwandu",
                                "From 1812 the caliphate was run in two halves; Bello became caliph in 1817."],
        col=INK, fill=F_AMBER, size=15)
    return s


@fig
def scramble_causes():
    s = Svg(800, 600, "Causes of the Scramble for Africa",
            "Diagram of the causes of the Scramble for Africa, 1880 to 1914. Economic: raw materials such as palm oil, "
            "rubber, cotton and minerals, new markets and places to invest. Political: national pride and prestige, "
            "rivalry after 1870 and the balance of power. Strategic: the Suez Canal of 1869, the route to India and the "
            "British occupation of Egypt in 1882. Humanitarian and religious: missionaries, ending the slave trade and the "
            "so-called civilising mission. Enabling factors: quinine against malaria, steamships and railways, the Maxim "
            "gun and the work of explorers.")
    heading(s, "Why Europe scrambled for Africa, 1880–1914")
    c = box(s, 400, 318, 250, 76, ["THE SCRAMBLE", "for Africa"], col=RED, fill=F_RED, size=20)
    items = [
        (140, 150, ["Economic", "raw materials: palm oil,", "rubber, cotton, minerals", "markets and investment"], GREEN, F_GREEN),
        (400, 150, ["Political", "national pride, prestige", "rivalry after 1870", "balance of power"], BLUE, F_BLUE),
        (660, 150, ["Strategic", "Suez Canal (1869)", "route to India", "Egypt occupied (1882)"], PURPLE, F_PURPLE),
        (225, 492, ["Humanitarian and religious", "missionaries; ending the", "slave trade; the so-called", "'civilising mission'"], ORANGE, F_AMBER),
        (575, 492, ["What made it possible", "quinine against malaria", "steamships and railways", "the Maxim gun; explorers"], TEAL, F_TEAL),
    ]
    for x, y, lines, col, fill in items:
        b = box(s, x, y, 250 if y < 300 else 320, 122, lines, col=col, fill=fill, size=16)
        link(s, b, c, color=MUTED, width=2.5)
    return s


@fig
def indirect_rule_nigeria():
    s = Svg(800, 560, "Indirect rule in Nigeria: why results differed",
            "Three columns. Northern Nigeria: emirs already had courts, taxes and officials, so indirect rule worked well and "
            "the emirs ran Native Authorities. Western Nigeria: obas were checked by councils of chiefs, so indirect rule "
            "partly worked but made obas too powerful and caused protests. Eastern Nigeria: most communities had no kings "
            "and were governed by elders and village councils, so the British appointed warrant chiefs; indirect rule "
            "failed and led to the Aba Women's War of 1929.")
    heading(s, "Indirect rule in Nigeria: why results differed")
    cols = [(140, "NORTH", ["Hausa-Fulani emirates"], ["Existing system", "emirs with courts,", "taxes and officials"],
             ["WORKED WELL", "emirs ran the", "Native Authorities"], GREEN, F_GREEN),
            (400, "WEST", ["Yoruba kingdoms"], ["Existing system", "obas checked by", "councils of chiefs"],
             ["PARTLY WORKED", "obas made too", "powerful; protests"], ORANGE, F_AMBER),
            (660, "EAST", ["Igbo, Ibibio and others"], ["Existing system", "no kings: elders and", "village assemblies"],
             ["FAILED", "warrant chiefs; Aba", "Women's War, 1929"], RED, F_RED)]
    for x, name, sub, mid, res, col, fill in cols:
        a = box(s, x, 112, 236, 66, [name] + sub, col=col, fill="#ffffff", size=18)
        b = box(s, x, 254, 236, 104, mid, col=INK, fill=F_GREY, size=16)
        c = box(s, x, 410, 236, 104, res, col=col, fill=fill, size=16)
        link(s, a, b, color=MUTED, width=2.5)
        link(s, b, c, color=MUTED, width=2.5)
    note(s, "Indirect rule worked best where strong, centralised rulers already existed.", 512, size=16, color=INK)
    return s


@fig
def samori_timeline():
    s = Svg(800, 640, "Samori Toure's resistance to the French",
            "Timeline: Samori Toure born about 1830; in the 1870s he builds the Mandinka empire with its capital at "
            "Bissandugu; first clash with the French at Kenieba-Koura in 1882; takes the title Almami in 1884; treaties "
            "with France in 1886 and 1887; the French take Kankan and Bissandugu in 1891 and Samori retreats using "
            "scorched-earth tactics; from 1892 he builds a second empire further east; captured at Guelemou on 29 "
            "September 1898 and exiled to Gabon, where he died in 1900.")
    heading(s, "Samori Toure: seventeen years of resistance")
    events = [("c. 1830", ["Samori Toure is born", "Mandinka trader's son, in present-day Guinea"], INK),
              ("1870s", ["Builds the Mandinka (Wassoulou) empire", "capital at Bissandugu; a strong standing army"], GREEN),
              ("1882", ["First clash with the French", "at Kenieba-Koura"], RED),
              ("1884", ["Takes the title Almami", "religious and political leader"], GREEN),
              ("1886–87", ["Treaties with France", "Kenieba-Koura (1886) and Bissandugu (1887)"], BLUE),
              ("1891", ["French take Kankan and Bissandugu", "Samori retreats, burning the land behind him"], RED),
              ("1892–98", ["Builds a second empire to the east", "in present-day Côte d'Ivoire and Ghana"], ORANGE),
              ("1898", ["Captured at Guelemou, 29 September", "exiled to Gabon; dies in 1900"], RED)]
    vtimeline(s, 170, 92, 70, events, size=18)
    return s


@fig
def nationalism_causes():
    s = Svg(800, 560, "Causes of nationalism in West Africa",
            "Diagram of six causes feeding the rise of nationalism in West Africa: Western education, which produced an "
            "educated elite; the African press, such as the West African Pilot, the Accra Evening News and the Sierra Leone "
            "Weekly News; colonial grievances such as racial discrimination, low produce prices, forced labour and taxes; "
            "the Second World War, with returning ex-servicemen, the Atlantic Charter of 1941 and a weakened Europe; "
            "outside influences such as Pan-Africanism, India's independence in 1947 and the United Nations; and "
            "organisations such as the National Congress of British West Africa (1920), youth movements, trade unions and "
            "political parties.")
    heading(s, "Why nationalism grew in West Africa")
    c = box(s, 400, 300, 168, 84, ["RISE OF", "nationalism"], col=RED, fill=F_RED, size=20)
    items = [(160, 130, ["Western education", "an educated elite of lawyers,", "doctors, teachers, clergy"], BLUE, F_BLUE),
             (160, 300, ["The African press", "West African Pilot, Evening", "News, Sierra Leone Weekly News"], PURPLE, F_PURPLE),
             (160, 470, ["Colonial grievances", "racial discrimination, low", "prices, forced labour, taxes"], ORANGE, F_AMBER),
             (640, 130, ["Second World War", "ex-servicemen; Atlantic", "Charter (1941); weak Europe"], RED, "#ffffff"),
             (640, 300, ["Outside influences", "Pan-Africanism; India free", "(1947); United Nations"], TEAL, F_TEAL),
             (640, 470, ["Organisations", "NCBWA (1920), youth leagues,", "trade unions, parties"], GREEN, F_GREEN)]
    for x, y, lines, col, fill in items:
        b = box(s, 145 if x < 400 else 655, y, 270, 104, lines, col=col, fill=fill, size=16)
        link(s, b, c, color=MUTED, width=2.5)
    return s


@fig
def oau_to_au():
    s = Svg(800, 600, "From the OAU to the African Union",
            "Two columns comparing the Organisation of African Unity and the African Union. The OAU was founded in Addis "
            "Ababa on 25 May 1963 and its main organs were the Assembly of Heads of State and Government, the Council of "
            "Ministers, the General Secretariat, the Commission of Mediation, Conciliation and Arbitration, and the "
            "Liberation Committee. The African Union was launched in Durban on 9 July 2002 and its organs include the "
            "Assembly, the Executive Council, the AU Commission in Addis Ababa, the Peace and Security Council and the "
            "Pan-African Parliament. The key change was from strict non-interference to the right to intervene in grave "
            "circumstances such as genocide and war crimes.")
    heading(s, "From the OAU (1963) to the African Union (2002)")
    a = box(s, 205, 108, 350, 66, ["OAU, 1963–2002", "founded at Addis Ababa, 25 May 1963"], col=RED, fill=F_RED, size=18)
    b = box(s, 595, 108, 350, 66, ["AFRICAN UNION, 2002–", "launched at Durban, 9 July 2002"], col=BLUE, fill=F_BLUE, size=18)
    link(s, a, b, color=INK, width=3)
    left = ["Assembly of Heads of State", "Council of Ministers", "General Secretariat", "Commission of Mediation,|Conciliation and Arbitration",
            "Liberation Committee|(Dar es Salaam)"]
    right = ["Assembly of the Union", "Executive Council", "AU Commission (Addis Ababa)", "Peace and Security Council",
             "Pan-African Parliament|(Midrand, South Africa)"]
    for k, (l, r) in enumerate(zip(left, right)):
        y = 186 + k * 66
        box(s, 205, y, 350, 56, l.split("|"), col=INK, fill="#ffffff", size=15, bold_first=False)
        box(s, 595, y, 350, 56, r.split("|"), col=INK, fill="#ffffff", size=15, bold_first=False)
    box(s, 400, 548, 740, 60, ["Key change", "OAU: strict non-interference.  AU: may intervene in genocide and war crimes."],
        col=PURPLE, fill=F_PURPLE, size=16)
    return s


@fig
def world_war_two_effects():
    s = Svg(800, 600, "How the Second World War changed Africa",
            "Diagram: the Second World War of 1939 to 1945 led to six changes. West African soldiers fought in Burma and "
            "elsewhere and came home as ex-servicemen; the Atlantic Charter of 1941 spoke of the right of all peoples to "
            "choose their government; Britain and France were weakened; the USA and USSR opposed old-style colonialism; "
            "the United Nations Charter of 1945 supported self-determination; and wartime shortages, price controls and "
            "unfair produce marketing caused hardship. Together these strengthened demands for independence, seen in the "
            "Accra riots of 1948 and new mass parties.")
    heading(s, "How the Second World War changed Africa")
    top = box(s, 400, 100, 420, 60, ["SECOND WORLD WAR, 1939–1945"], col=INK, fill=F_GREY, size=19)
    bottom = box(s, 400, 540, 620, 70, ["Stronger demands for independence", "Accra riots (1948), mass parties, independence from 1957"],
                 col=RED, fill=F_RED, size=18)
    items = [(150, 200, ["African soldiers", "fought in Burma; came", "home as ex-servicemen"], GREEN, F_GREEN),
             (400, 200, ["Atlantic Charter (1941)", "the right of peoples to", "choose their government"], BLUE, F_BLUE),
             (650, 200, ["Europe weakened", "Britain and France", "exhausted and in debt"], PURPLE, F_PURPLE),
             (150, 360, ["New superpowers", "USA and USSR opposed", "old-style colonialism"], TEAL, F_TEAL),
             (400, 360, ["United Nations (1945)", "Charter supported", "self-determination"], BLUE, "#ffffff"),
             (650, 360, ["Economic hardship", "shortages, price controls,", "unfair produce buying"], ORANGE, F_AMBER)]
    for x, y, lines, col, fill in items:
        bx = box(s, x, y, 236, 104, lines, col=col, fill=fill, size=16)
        if y < 300:
            s.line(x, 130, x, y - 52 - 4, color=MUTED, width=2) if x != 400 else link(s, top, bx, color=MUTED, width=2.5)
        else:
            link(s, bx, bottom, color=MUTED, width=2.5)
    s.line(150, 130, 650, 130, color=MUTED, width=2)
    for x in (150, 650):
        s.arrow(x, 131, x, 142, color=MUTED, width=2)
    for x in (150, 400, 650):
        s.line(x, 252, x, 308, color=MUTED, width=2)
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
