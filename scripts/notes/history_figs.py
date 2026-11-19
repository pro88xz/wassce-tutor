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
