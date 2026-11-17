#!/usr/bin/env python3
"""Original diagrams for the Geography notes.

    python3 scripts/notes/geography_figs.py            # write every diagram
    python3 scripts/notes/geography_figs.py name ...   # write some

Each function draws one figure and returns an Svg. Files go to
public/img/geography/<name>.svg and lessons show them from
https://wasscetutor.com/img/geography/<name>.svg. All drawn by WASSCE Tutor.
Geography figures are cross-sections, block diagrams, cycles and maps, drawn
with large labels so that they stay readable on a phone.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from chemistry_figs import box, link  # noqa: E402
from government_figs import arrow, heading, note  # noqa: E402
from svgfig import (  # noqa: E402
    BLUE, F_AMBER, F_BLUE, F_GREEN, F_GREY, F_PURPLE, F_RED, GREEN, INK, MUTED, ORANGE, PURPLE, RED, TEAL, Svg,
)

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/img/geography"
FIGS: dict[str, callable] = {}
F_TEAL = "#ccfbf1"
SKY = "#e0f2fe"
SEA = "#93c5fd"
LAND = "#d9c49a"
ROCK = "#a8a29e"
SOIL = "#b45309"
MAGMA = "#ef4444"
GRASS = "#86efac"
BROWN = "#92400e"


def fig(fn):
    FIGS[fn.__name__.replace("_", "-")] = fn
    return fn


def poly(s: Svg, pts, fill, stroke=INK, width=2):
    s.polygon(pts, fill=fill, stroke=stroke, width=width)


# ═══ G1: the physical Earth ══════════════════════════════════════════════════

@fig
def solar_system():
    s = Svg(800, 360, "The planets of the solar system in order from the Sun",
            "The eight planets in order from the Sun are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune. "
            "The first four are small rocky inner planets; the outer four are giant planets made mostly of gas or ice. "
            "Sizes are shown roughly; distances are not to scale.")
    heading(s, "The eight planets in order from the Sun")
    s.circle(-60, 190, 150, fill="#fde68a", stroke=ORANGE, width=3)
    s.text(40, 190, "Sun", size=20, weight="bold", color=ORANGE)
    planets = [("Mercury", 6, "#a8a29e"), ("Venus", 10, "#fbbf24"), ("Earth", 11, "#3b82f6"), ("Mars", 8, "#dc2626"),
               ("Jupiter", 34, "#d97706"), ("Saturn", 28, "#facc15"), ("Uranus", 18, "#67e8f9"), ("Neptune", 17, "#2563eb")]
    x = 135
    for k, (name, r, col) in enumerate(planets):
        x += r + (16 if k < 4 else 26)
        if name == "Saturn":
            s.ellipse(x, 190, r + 16, 7, fill="none", stroke="#a16207", width=2.5)
        s.circle(x, 190, r, fill=col, stroke=INK, width=1.5)
        s.text(x, 190 + max(r, 12) + 22 + (18 if k % 2 else 0), name, size=14, weight="bold", color=INK)
        x += r
    s.line(130, 300, 395, 300, color=GREEN, width=2.5)
    s.text(262, 322, "inner rocky planets", size=15, weight="bold", color=GREEN)
    s.line(410, 300, 780, 300, color=BLUE, width=2.5)
    s.text(595, 322, "outer giant planets", size=15, weight="bold", color=BLUE)
    note(s, "Memory aid: My Very Educated Mother Just Served Us Noodles. Earth is third, about 150 million km from the Sun.", 350, size=13)
    return s


@fig
def earth_revolution():
    s = Svg(800, 500, "The Earth's revolution around the Sun and the seasons",
            "The Earth travels around the Sun once in about 365¼ days, with its axis tilted at 23½°. Around 21 June the "
            "northern hemisphere leans towards the Sun (overhead Sun on the Tropic of Cancer); around 22 December the "
            "southern hemisphere does (Tropic of Capricorn). Around 21 March and 23 September the Sun is overhead at the "
            "Equator (the equinoxes).")
    heading(s, "Revolution + tilt of 23½° = changing seasons")
    cx, cy, rx, ry = 400, 275, 290, 120
    s.ellipse(cx, cy, rx, ry, fill="none", stroke=MUTED, width=2, dash="7 6")
    s.circle(cx, cy, 46, fill="#fde68a", stroke=ORANGE, width=3)
    s.text(cx, cy, "Sun", size=18, weight="bold", color=ORANGE)
    pos = [(cx + rx, cy, "21 June", "Sun overhead at", "Tropic of Cancer", cx + rx, cy - 110, "middle"),
           (cx, cy - ry, "23 September", "equinox: Sun", "overhead at Equator", cx + 40, cy - ry - 26, "start"),
           (cx - rx, cy, "22 December", "Sun overhead at", "Tropic of Capricorn", cx - rx, cy - 110, "middle"),
           (cx, cy + ry, "21 March", "equinox: Sun", "overhead at Equator", cx + 40, cy + ry + 6, "start")]
    t = math.radians(23.5)
    for (x, y, d, l1, l2, tx, ty, anc) in pos:
        s.circle(x, y, 26, fill="#bfdbfe", stroke=BLUE, width=2.5)
        s.line(x - 36 * math.sin(t), y - 36 * math.cos(t), x + 36 * math.sin(t), y + 36 * math.cos(t), color=INK, width=2)
        s.line(x - 26, y, x + 26, y, color=RED, width=1.5)
        s.text(tx, ty, d, size=16, weight="bold", color=INK, anchor=anc)
        s.text(tx, ty + 19, l1, size=13, color=MUTED, anchor=anc)
        s.text(tx, ty + 36, l2, size=13, color=MUTED, anchor=anc)
    s.text(110, 470, "one revolution ≈ 365¼ days", size=15, weight="bold", color=GREEN, anchor="start")
    s.text(690, 470, "axis tilted 23½°", size=14, weight="bold", color=INK, anchor="end")
    return s


@fig
def latitude_longitude():
    s = Svg(800, 470, "Lines of latitude and longitude on the globe",
            "Lines of latitude run east to west and measure distance north or south of the Equator (0°), up to 90° at the "
            "poles; the Tropics of Cancer and Capricorn are at 23½° N and S. Lines of longitude run from pole to pole and "
            "measure distance east or west of the Prime (Greenwich) Meridian (0°), up to 180°. Freetown is at about 8½° N, "
            "13° W.")
    heading(s, "Latitude: north–south. Longitude: east–west")
    for cx, kind in ((220, "lat"), (580, "lon")):
        r = 160
        cy = 260
        s.circle(cx, cy, r, fill="#dbeafe", stroke=BLUE, width=2.5)
        if kind == "lat":
            for lat, lab, col in ((0, "Equator 0°", RED), (23.5, "Tropic of Cancer 23½° N", ORANGE),
                                  (-23.5, "Tropic of Capricorn 23½° S", ORANGE), (66.5, "Arctic Circle 66½° N", TEAL),
                                  (-66.5, "Antarctic Circle 66½° S", TEAL)):
                y = cy - r * math.sin(math.radians(lat))
                hw = r * math.cos(math.radians(lat))
                s.ellipse(cx, y, hw, hw * 0.12, fill="none", stroke=col, width=2.4 if lat == 0 else 1.8)
                s.label(cx, y - (0 if lat == 0 else 0), lab, size=12 if lat else 13, color=col, weight="bold")
            s.text(cx, cy - r - 14, "90° N (North Pole)", size=13, weight="bold", color=INK)
            s.text(cx, cy + r + 22, "90° S (South Pole)", size=13, weight="bold", color=INK)
            s.text(cx, 60, "Latitude (parallels)", size=17, weight="bold", color=INK)
        else:
            for lon in (-60, -30, 0, 30, 60):
                w = r * math.sin(math.radians(abs(lon))) if lon else 0
                if lon == 0:
                    s.line(cx, cy - r, cx, cy + r, color=RED, width=2.6)
                else:
                    s.ellipse(cx, cy, w, r, fill="none", stroke=PURPLE, width=1.6)
            s.label(cx, cy - 40, "Prime Meridian 0°", size=13, color=RED, weight="bold")
            s.label(cx - 92, cy + 40, "W", size=16, color=PURPLE, weight="bold")
            s.label(cx + 92, cy + 40, "E", size=16, color=PURPLE, weight="bold")
            s.text(cx, 60, "Longitude (meridians)", size=17, weight="bold", color=INK)
            s.text(cx, cy + r + 22, "Greenwich, London", size=13, weight="bold", color=RED)
    return s


@fig
def longitude_time():
    s = Svg(800, 360, "Longitude and local time",
            "The Earth turns 360° in 24 hours, so 15° of longitude equals one hour and 1° equals 4 minutes. Places east of "
            "Greenwich are ahead in time; places west are behind. If it is 12 noon at 30° E, it is 7 a.m. at 45° W, because "
            "the difference is 75°, which is 5 hours.")
    heading(s, "15° of longitude = 1 hour; 1° = 4 minutes")
    x0, x1 = 80, 720
    def X(lon):
        return x0 + (lon + 60) / 120 * (x1 - x0)
    s.line(x0, 170, x1, 170, color=INK, width=3)
    for lon in range(-60, 61, 15):
        s.line(X(lon), 160, X(lon), 180, color=INK, width=2)
        s.text(X(lon), 202, f"{abs(lon)}°{'W' if lon < 0 else 'E' if lon > 0 else ''}", size=14, color=MUTED)
    s.dot(X(30), 170, r=9, color=ORANGE)
    s.dot(X(-45), 170, r=9, color=BLUE)
    s.text(X(30), 120, "12 noon", size=18, weight="bold", color=ORANGE)
    s.text(X(30), 142, "at 30° E", size=14, color=ORANGE)
    s.text(X(-45), 120, "7:00 a.m.", size=18, weight="bold", color=BLUE)
    s.text(X(-45), 142, "at 45° W", size=14, color=BLUE)
    s.path(f"M {X(30)} 228 C {X(10)} 280, {X(-25)} 280, {X(-45)} 228", color=RED, width=2.6, arrow="end")
    s.text(X(-7.5), 290, "75° difference = 75 ÷ 15 = 5 hours (west is behind)", size=16, weight="bold", color=RED)
    s.text(X(0), 236, "Greenwich", size=13, color=MUTED)
    note(s, "Going east: add time. Going west: subtract time.", 338, size=16, color=INK)
    return s


@fig
def earth_layers():
    s = Svg(800, 500, "The internal structure of the Earth",
            "A cross-section of the Earth shows the thin crust (about 5 to 70 km thick), the mantle down to about 2,900 km, "
            "the liquid outer core from about 2,900 to 5,100 km, and the solid inner core from about 5,100 km to the centre "
            "at about 6,370 km, where the temperature is about 5,500 °C.")
    heading(s, "Crust, mantle, outer core, inner core")
    cx, cy, R = 300, 470, 420
    layers = [(R, "#a3e635", "crust"), (R - 14, "#f97316", "mantle"), (R * 0.55, "#facc15", "outer core"), (R * 0.19, "#fef08a", "inner core")]
    for r, col, _ in layers:
        s.path(f"M {cx} {cy} L {cx} {cy - r} A {r} {r} 0 0 1 {cx + r * math.sin(math.radians(60))} {cy - r * math.cos(math.radians(60))} Z",
               color=INK, width=2, fill=col)
    labels = [("Crust", "5–70 km thick; solid rock", 760, 70, GREEN),
              ("Mantle", "to about 2,900 km;", 760, 170, ORANGE),
              ("", "hot, slowly flowing rock", 760, 192, ORANGE),
              ("Outer core", "2,900–5,100 km;", 760, 280, "#a16207"),
              ("", "liquid iron and nickel", 760, 302, "#a16207"),
              ("Inner core", "5,100–6,370 km; solid", 760, 390, "#a16207"),
              ("", "iron and nickel, ~5,500 °C", 760, 412, "#a16207")]
    for a, b, x, y, c in labels:
        if a:
            s.text(x, y - 22, a, size=18, weight="bold", color=c, anchor="end")
        s.text(x, y, b, size=14, color=INK, anchor="end")
    for (yy, ry) in ((70, R - 7), (180, R * 0.78), (290, R * 0.37), (400, R * 0.09)):
        s.line(560, yy - 6, cx + ry * math.sin(math.radians(28)), cy - ry * math.cos(math.radians(28)), color=MUTED, width=1.5)
    s.text(cx - 14, cy - 4, "centre", size=13, color=MUTED, anchor="end")
    return s


@fig
def rock_cycle():
    s = Svg(800, 520, "The rock cycle",
            "Magma cools and solidifies to form igneous rock. Weathering and erosion break rocks into sediments, which are "
            "deposited, compacted and cemented into sedimentary rock. Heat and pressure change igneous or sedimentary rock "
            "into metamorphic rock. Melting turns any rock back into magma.")
    heading(s, "How the three rock types change into one another")
    ig = box(s, 400, 110, 240, 70, ["IGNEOUS", "granite, basalt"], col=RED, fill=F_RED, size=17)
    sed = box(s, 160, 380, 250, 70, ["SEDIMENTARY", "sandstone, limestone"], col=ORANGE, fill=F_AMBER, size=17)
    met = box(s, 640, 380, 250, 70, ["METAMORPHIC", "marble, slate, gneiss"], col=PURPLE, fill=F_PURPLE, size=17)
    mag = box(s, 400, 300, 170, 56, ["MAGMA"], col=MAGMA, fill="#fee2e2", size=18)
    arrow(s, 290, 130, 190, 336, color=BROWN, width=3)
    s.label(205, 225, "weathering, erosion,", size=14, color=BROWN, weight="bold")
    s.label(205, 247, "deposition, cementing", size=14, color=BROWN, weight="bold")
    arrow(s, 290, 380, 508, 380, color=PURPLE, width=3)
    s.label(400, 405, "heat and pressure", size=14, color=PURPLE, weight="bold")
    arrow(s, 520, 130, 620, 336, color=PURPLE, width=3)
    s.label(615, 225, "heat and pressure", size=14, color=PURPLE, weight="bold")
    arrow(s, 600, 345, 490, 310, color=MAGMA, width=3)
    s.label(560, 300, "melting", size=14, color=MAGMA, weight="bold")
    arrow(s, 400, 270, 400, 152, color=RED, width=3)
    s.label(400, 215, "cooling", size=14, color=RED, weight="bold")
    arrow(s, 640, 418, 230, 418, color=BROWN, width=2)
    s.text(430, 470, "weathering and erosion of metamorphic rock", size=14, weight="bold", color=BROWN)
    return s


@fig
def plate_boundaries():
    s = Svg(800, 500, "The three types of plate boundary",
            "At a constructive (divergent) boundary plates move apart and magma rises to form new crust, as at the "
            "Mid-Atlantic Ridge. At a destructive (convergent) boundary an oceanic plate sinks beneath a continental plate, "
            "causing earthquakes, volcanoes and fold mountains, as along the Andes. At a conservative (transform) boundary "
            "plates slide past each other, causing earthquakes, as on the San Andreas Fault.")
    heading(s, "Plates move apart, together or past each other")
    # constructive
    y = 150
    poly(s, [(40, y), (190, y), (190, y + 50), (40, y + 50)], "#94a3b8")
    poly(s, [(210, y), (360, y), (360, y + 50), (210, y + 50)], "#94a3b8")
    poly(s, [(190, y), (210, y), (215, y + 50), (185, y + 50)], MAGMA)
    s.polygon([(185, y), (200, y - 30), (215, y)], fill=MAGMA, stroke=INK, width=1.5)
    arrow(s, 150, y + 25, 70, y + 25, color=INK)
    arrow(s, 250, y + 25, 330, y + 25, color=INK)
    s.text(200, y - 50, "Constructive (divergent)", size=17, weight="bold", color=GREEN)
    s.text(200, y + 80, "plates move apart; new crust", size=14, color=INK)
    s.text(200, y + 100, "e.g. Mid-Atlantic Ridge,", size=14, color=MUTED)
    s.text(200, y + 118, "East African Rift", size=14, color=MUTED)
    # destructive
    x0 = 430
    poly(s, [(x0, y + 10), (x0 + 170, y + 10), (x0 + 210, y + 70), (x0, y + 70)], "#60a5fa")
    poly(s, [(x0 + 180, y - 20), (x0 + 330, y - 20), (x0 + 330, y + 70), (x0 + 240, y + 70), (x0 + 190, y + 12)], LAND)
    s.polygon([(x0 + 200, y - 20), (x0 + 220, y - 60), (x0 + 240, y - 20)], fill="#78716c", stroke=INK, width=1.5)
    s.line(x0 + 220, y - 20, x0 + 210, y + 40, color=MAGMA, width=3)
    arrow(s, x0 + 40, y + 40, x0 + 130, y + 40, color=INK)
    arrow(s, x0 + 310, y + 20, x0 + 260, y + 20, color=INK)
    s.text(x0 + 165, y - 80, "Destructive (convergent)", size=17, weight="bold", color=RED)
    s.text(x0 + 165, y + 100, "ocean plate sinks; volcanoes,", size=14, color=INK)
    s.text(x0 + 165, y + 118, "earthquakes, fold mountains (Andes)", size=14, color=MUTED)
    # conservative (plan view)
    y2 = 360
    poly(s, [(220, y2), (400, y2), (400, y2 + 60), (220, y2 + 60)], "#cbd5e1")
    poly(s, [(400, y2), (580, y2), (580, y2 + 60), (400, y2 + 60)], "#e2e8f0")
    s.line(400, y2 - 10, 400, y2 + 70, color=RED, width=3, dash="8 5")
    arrow(s, 330, y2 + 30, 330, y2 - 2, color=INK)
    arrow(s, 470, y2 + 30, 470, y2 + 62, color=INK)
    s.text(400, y2 - 26, "Conservative (transform), seen from above", size=17, weight="bold", color=PURPLE)
    s.text(400, y2 + 92, "plates slide past each other; earthquakes but no volcanoes", size=14, color=INK)
    s.text(400, y2 + 112, "e.g. San Andreas Fault, California", size=14, color=MUTED)
    return s


@fig
def volcano_section():
    s = Svg(800, 500, "Cross-section of a volcano and intrusive features",
            "Magma rises from a magma chamber through a pipe to the vent and crater, building a cone of layers of lava and "
            "ash. Magma that cools underground forms intrusive features: a dyke cuts across the rock layers, a sill lies "
            "between them, a laccolith bulges them upwards, and a batholith is a huge mass deep below.")
    heading(s, "Extrusive and intrusive volcanic features")
    s.rect(0, 300, 800, 200, fill=LAND, stroke="none", width=0)
    for yy in (330, 360, 390, 420):
        s.line(0, yy, 800, yy, color="#b8a272", width=1.5)
    poly(s, [(240, 300), (380, 110), (420, 110), (560, 300)], "#78716c", width=2)
    for k in range(1, 4):
        poly(s, [(240 + k * 30, 300 - k * 4), (380 + k * 4, 110 + k * 28), (420 - k * 4, 110 + k * 28), (560 - k * 30, 300 - k * 4)], "none", stroke="#57534e", width=1)
    s.rect(392, 112, 16, 360, fill=MAGMA, stroke="none", width=0)
    s.ellipse(400, 470, 120, 34, fill=MAGMA, stroke=INK, width=2)
    s.text(400, 474, "magma chamber", size=15, weight="bold", color="#ffffff")
    s.polygon([(380, 110), (400, 125), (420, 110)], fill="#fde68a", stroke=INK, width=1.5)
    for k in range(4):
        s.circle(380 + k * 13, 80 - (k % 2) * 16, 13, fill="#d6d3d1", stroke=MUTED, width=1.2)
    s.label(250, 90, "ash and gas cloud", size=14, color=MUTED, weight="bold")
    s.label(560, 120, "crater and vent", size=14, color=INK, weight="bold")
    s.line(505, 125, 420, 115, color=MUTED, width=1.5)
    s.label(620, 220, "cone of lava and ash", size=14, color=INK, weight="bold")
    s.line(570, 230, 500, 250, color=MUTED, width=1.5)
    s.line(408, 380, 600, 330, color=MAGMA, width=8)
    s.label(660, 330, "dyke", size=15, color=RED, weight="bold")
    s.rect(130, 386, 262, 9, fill=MAGMA, stroke="none", width=0)
    s.label(100, 392, "sill", size=15, color=RED, weight="bold")
    s.path("M 600 420 Q 680 380 760 420 Z", color=INK, width=1.5, fill=MAGMA)
    s.label(700, 450, "laccolith", size=15, color=RED, weight="bold")
    s.label(400, 300, "pipe", size=14, color="#ffffff", weight="bold")
    return s


@fig
def weathering_types():
    s = Svg(800, 420, "The three types of weathering",
            "Physical (mechanical) weathering breaks rock without changing its minerals, for example exfoliation when rock "
            "heats by day and cools by night and its outer layers peel off. Chemical weathering changes the minerals, for "
            "example oxidation turning iron-rich rock red. Biological weathering is caused by living things, such as roots "
            "widening cracks.")
    heading(s, "Physical, chemical and biological weathering")
    # physical: exfoliation dome
    s.path("M 40 300 Q 140 120 240 300 Z", color=INK, width=2, fill=ROCK)
    s.path("M 60 300 Q 140 150 220 300", color=MUTED, width=1.5)
    s.path("M 52 270 Q 70 230 92 214", color=INK, width=4)
    s.circle(220, 90, 22, fill="#fde68a", stroke=ORANGE, width=2)
    s.text(140, 330, "Physical", size=19, weight="bold", color=BLUE)
    s.text(140, 356, "exfoliation: outer layers", size=14, color=INK)
    s.text(140, 375, "peel like an onion", size=14, color=INK)
    # chemical: rusting rock
    s.rect(320, 170, 160, 130, fill="#a8a29e", stroke=INK, width=2, rx=10)
    s.rect(320, 170, 160, 40, fill="#b45309", stroke=INK, width=2, rx=10)
    for k in range(6):
        s.line(330 + k * 26, 150, 336 + k * 26, 135, color=BLUE, width=2)
    s.text(400, 120, "rain + oxygen", size=14, color=BLUE, weight="bold")
    s.text(400, 330, "Chemical", size=19, weight="bold", color=ORANGE)
    s.text(400, 356, "oxidation, solution, hydrolysis,", size=14, color=INK)
    s.text(400, 375, "carbonation change the minerals", size=14, color=INK)
    # biological: roots
    s.rect(580, 200, 180, 100, fill=ROCK, stroke=INK, width=2)
    s.line(670, 200, 655, 300, color=INK, width=2)
    s.path("M 672 120 L 668 200 M 668 200 Q 660 240 657 290", color=BROWN, width=5)
    s.circle(672, 105, 38, fill=GRASS, stroke=GREEN, width=2)
    s.text(670, 330, "Biological", size=19, weight="bold", color=GREEN)
    s.text(670, 356, "roots widen cracks; animals", size=14, color=INK)
    s.text(670, 375, "burrow; lichens release acids", size=14, color=INK)
    return s


@fig
def river_long_profile():
    s = Svg(800, 480, "The long profile of a river from source to mouth",
            "In the upper course the river is steep and fast, eroding downwards to form a V-shaped valley, waterfalls, rapids "
            "and interlocking spurs. In the middle course it erodes sideways and forms meanders. In the lower course the "
            "gradient is gentle and the river deposits load, forming a floodplain, levees, ox-bow lakes and a delta or "
            "estuary at the mouth.")
    heading(s, "Upper, middle and lower course")
    s.path("M 40 110 C 180 150, 260 300, 420 330 S 680 380, 770 385", color=BLUE, width=6)
    s.line(40, 400, 770, 400, color=MUTED, width=1.5, dash="6 6")
    s.text(780, 418, "sea level", size=13, color=MUTED, anchor="end")
    s.text(40, 92, "source", size=15, weight="bold", color=INK, anchor="start")
    s.text(770, 368, "mouth", size=15, weight="bold", color=INK, anchor="end")
    s.line(250, 70, 250, 440, color=MUTED, width=1.2, dash="4 6")
    s.line(520, 70, 520, 440, color=MUTED, width=1.2, dash="4 6")
    cols = [(140, "Upper course", BLUE, ["steep, fast, narrow", "vertical erosion", "V-shaped valley,", "waterfalls, rapids,", "interlocking spurs"]),
            (385, "Middle course", GREEN, ["gentler, wider", "lateral erosion", "meanders, river", "cliffs, slip-off", "slopes"]),
            (645, "Lower course", ORANGE, ["gentle, slow, wide", "deposition", "floodplain, levees,", "ox-bow lakes,", "delta or estuary"])]
    for x, t, c, lines in cols:
        s.text(x, 450, t, size=17, weight="bold", color=c)
        for k, l in enumerate(lines):
            s.text(x, 165 + k * 20 + (0 if x != 140 else 120), l, size=13, color=INK if k else c, weight="bold" if k == 1 else "normal")
    return s


@fig
def oxbow_formation():
    s = Svg(800, 400, "How an ox-bow lake forms",
            "1: a meander bends, with erosion on the outer bank and deposition on the inner bank. 2: erosion narrows the neck "
            "of the meander. 3: in a flood the river cuts through the neck and flows straight. 4: deposition seals the old "
            "bend, leaving a crescent-shaped ox-bow lake.")
    heading(s, "From meander to ox-bow lake in four stages")
    def stage(cx, k):
        neck = [70, 45, 0, 0][k]
        s.path(f"M {cx - 80} 330 C {cx - 80} 260, {cx - neck / 2 - 10} 250, {cx - neck / 2} 220 "
               f"C {cx - 90} 160, {cx - 70} 90, {cx} 90 C {cx + 70} 90, {cx + 90} 160, {cx + neck / 2} 220 "
               f"C {cx + neck / 2 + 10} 250, {cx + 80} 260, {cx + 80} 330",
               color=BLUE if k < 3 else "#93c5fd", width=12 if k < 3 else 9)
        if k >= 2:
            s.line(cx - 30, 222, cx + 30, 222, color=BLUE, width=12)
        if k == 3:
            s.text(cx, 140, "ox-bow", size=14, weight="bold", color=BLUE)
            s.text(cx, 158, "lake", size=14, weight="bold", color=BLUE)
        s.text(cx, 368, str(k + 1), size=22, weight="bold", color=INK)
    for k, cx in enumerate((110, 300, 490, 680)):
        stage(cx, k)
    s.text(110, 60, "erosion on outer bend", size=13, color=RED, weight="bold")
    s.text(300, 60, "neck narrows", size=13, color=RED, weight="bold")
    s.text(490, 60, "flood cuts through", size=13, color=RED, weight="bold")
    s.text(680, 60, "old bend cut off", size=13, color=RED, weight="bold")
    return s


@fig
def coastal_landforms():
    s = Svg(800, 460, "Coastal landforms of erosion and deposition",
            "Waves erode a headland: hydraulic action and abrasion enlarge a crack into a cave, the cave cuts through into an "
            "arch, the arch roof collapses to leave a stack, and the stack is worn down to a stump. Between headlands, "
            "sheltered bays collect sand as beaches, and longshore drift can build a spit across a bay or river mouth.")
    heading(s, "Cave → arch → stack → stump; beaches and spits")
    s.rect(0, 60, 800, 400, fill=SEA, stroke="none", width=0)
    poly(s, [(0, 60), (800, 60), (800, 180), (520, 180), (470, 260), (380, 270), (330, 180), (0, 180)], LAND, width=2)
    poly(s, [(380, 270), (470, 260), (470, 300), (380, 300)], LAND, width=2)
    s.ellipse(425, 295, 24, 10, fill="#1e3a8a", stroke=INK, width=1.5)
    s.text(425, 330, "cave", size=14, weight="bold", color=INK)
    s.path("M 520 300 L 520 250 Q 560 220 600 250 L 600 300 L 585 300 L 585 262 Q 560 245 535 262 L 535 300 Z", color=INK, width=2, fill=LAND)
    s.text(560, 330, "arch", size=14, weight="bold", color=INK)
    s.rect(640, 250, 34, 54, fill=LAND, stroke=INK, width=2)
    s.text(657, 330, "stack", size=14, weight="bold", color=INK)
    s.rect(710, 286, 34, 18, fill=LAND, stroke=INK, width=2)
    s.text(727, 330, "stump", size=14, weight="bold", color=INK)
    s.path("M 0 180 Q 60 240 160 230 Q 260 220 330 180", color=INK, width=2, fill="#fde68a")
    s.text(165, 210, "bay with sandy beach", size=14, weight="bold", color=BROWN)
    s.path("M 60 250 Q 130 270 230 300 Q 250 306 260 300", color=BROWN, width=10)
    s.text(160, 335, "spit built by longshore drift", size=14, weight="bold", color=BROWN)
    for k in range(4):
        x = 40 + k * 60
        arrow(s, x, 400, x + 40, 380, color="#1e40af")
    s.text(140, 425, "longshore drift", size=14, weight="bold", color="#1e40af")
    s.text(400, 120, "LAND", size=20, weight="bold", color=BROWN)
    s.text(650, 420, "SEA", size=20, weight="bold", color="#1e3a8a")
    s.text(425, 200, "headland", size=15, weight="bold", color=INK)
    return s


@fig
def desert_landforms():
    s = Svg(800, 420, "Landforms produced by wind in hot deserts",
            "A barchan is a crescent-shaped sand dune with its horns pointing downwind; a seif is a long ridge of sand parallel "
            "to the wind. A mushroom rock (rock pedestal) forms where sand carried near the ground wears away the base of a "
            "rock faster than its top. A zeugen is a ridge of hard rock capping softer rock.")
    heading(s, "Wind erosion and deposition in hot deserts")
    s.rect(0, 320, 800, 100, fill="#fde68a", stroke="none", width=0)
    s.path("M 60 320 Q 110 220 200 230 Q 150 270 170 320 Z", color=INK, width=2, fill="#fbbf24")
    s.text(140, 360, "barchan dune", size=15, weight="bold", color=BROWN)
    s.text(140, 380, "horns point downwind", size=13, color=INK)
    s.path("M 300 320 L 320 220 L 360 220 L 380 320 Z", color=INK, width=2, fill="#d6d3d1")
    s.path("M 290 220 Q 340 160 390 220 Z", color=INK, width=2, fill="#a8a29e")
    s.rect(330, 250, 20, 70, fill="#d6d3d1", stroke="none", width=0)
    s.path("M 285 222 Q 340 180 395 222 L 360 222 L 350 320 L 330 320 L 320 222 Z", color=INK, width=2, fill=ROCK)
    s.text(340, 360, "mushroom rock", size=15, weight="bold", color=BROWN)
    s.text(340, 380, "base worn by blown sand", size=13, color=INK)
    s.rect(470, 220, 200, 40, fill="#57534e", stroke=INK, width=2)
    s.rect(500, 260, 140, 60, fill="#d6d3d1", stroke=INK, width=2)
    s.text(570, 360, "zeugen", size=15, weight="bold", color=BROWN)
    s.text(570, 380, "hard cap over softer rock", size=13, color=INK)
    for k in range(3):
        arrow(s, 40 + k * 260, 110, 120 + k * 260, 110, color=BLUE, width=3)
    s.text(400, 80, "prevailing wind", size=16, weight="bold", color=BLUE)
    s.text(790, 160, "seif dunes", size=14, weight="bold", color=BROWN, anchor="end")
    s.text(790, 180, "lie along the wind", size=13, color=INK, anchor="end")
    return s


@fig
def mountain_types():
    s = Svg(800, 470, "Fold, block and volcanic mountains",
            "Fold mountains form when compression pushes rock layers up into folds, as in the Atlas Mountains. Block mountains "
            "(horsts) form when land between two faults is pushed up, and a rift valley (graben) forms when land between "
            "faults sinks, as in the East African Rift Valley. Volcanic mountains are built from layers of lava and ash, such "
            "as Mount Cameroon.")
    heading(s, "How mountains form")
    # fold
    for k, col in enumerate(("#fcd34d", "#fdba74", "#a3e635")):
        off = k * 16
        s.path(f"M 30 {260 + off} Q 90 {150 + off} 150 {260 + off} Q 210 {360 + off} 250 {260 + off}", color=INK, width=12, fill="none")
        s.path(f"M 30 {260 + off} Q 90 {150 + off} 150 {260 + off} Q 210 {360 + off} 250 {260 + off}", color=col, width=9, fill="none")
    arrow(s, 10, 300, 40, 300, color=RED, width=3)
    arrow(s, 270, 300, 240, 300, color=RED, width=3)
    s.text(140, 400, "Fold mountains", size=17, weight="bold", color=ORANGE)
    s.text(140, 422, "compression: Atlas, Alps,", size=13, color=INK)
    s.text(140, 440, "Himalayas, Andes", size=13, color=INK)
    # block and rift
    poly(s, [(300, 330), (350, 330), (370, 220), (430, 220), (450, 330), (500, 330), (500, 360), (300, 360)], "#cbd5e1")
    s.line(370, 220, 352, 360, color=RED, width=2.4, dash="6 4")
    s.line(430, 220, 448, 360, color=RED, width=2.4, dash="6 4")
    arrow(s, 400, 290, 400, 240, color=RED, width=2.6)
    s.text(400, 400, "Block mountain (horst)", size=16, weight="bold", color=PURPLE)
    s.text(400, 422, "uplift between faults:", size=13, color=INK)
    s.text(400, 440, "Ruwenzori, Vosges", size=13, color=INK)
    # volcanic
    poly(s, [(560, 360), (660, 200), (690, 200), (790, 360)], "#78716c")
    s.line(675, 200, 675, 360, color=MAGMA, width=4)
    s.text(675, 400, "Volcanic mountain", size=17, weight="bold", color=RED)
    s.text(675, 422, "lava and ash layers:", size=13, color=INK)
    s.text(675, 440, "Mt Cameroon, Kilimanjaro", size=13, color=INK)
    note(s, "A rift valley (graben) forms where land between two faults sinks: East African Rift Valley.", 120, size=14, color=INK)
    return s


@fig
def water_cycle():
    s = Svg(800, 480, "The water (hydrological) cycle",
            "Water evaporates from the sea and lakes and transpires from plants. The water vapour rises, cools and condenses "
            "into clouds, which are carried over the land and fall as precipitation. On land, water runs off over the surface "
            "into rivers, or infiltrates the soil and percolates down to become groundwater, and both flow back to the sea.")
    heading(s, "Evaporation, condensation, precipitation, runoff")
    s.rect(0, 360, 330, 120, fill=SEA, stroke="none", width=0)
    s.text(150, 430, "SEA", size=20, weight="bold", color="#1e3a8a")
    poly(s, [(330, 360), (520, 250), (640, 200), (800, 260), (800, 480), (330, 480)], LAND, width=2)
    s.rect(330, 420, 470, 60, fill="#bfdbfe", stroke="none", width=0)
    s.text(600, 455, "groundwater flow → sea", size=15, weight="bold", color="#1e3a8a")
    s.path("M 800 300 Q 600 300 520 340 Q 430 380 330 380", color=BLUE, width=5)
    s.text(560, 330, "surface runoff / river", size=14, weight="bold", color=BLUE)
    for x in (230, 610):
        s.ellipse(x, 110, 80, 32, fill="#ffffff", stroke=MUTED, width=2)
        s.ellipse(x + 40, 95, 50, 26, fill="#ffffff", stroke=MUTED, width=2)
    s.text(270, 105, "condensation", size=15, weight="bold", color=INK)
    for k in range(5):
        s.line(570 + k * 18, 150, 560 + k * 18, 190, color=BLUE, width=2.5)
    s.text(690, 175, "precipitation", size=15, weight="bold", color=BLUE)
    for k in range(3):
        arrow(s, 90 + k * 50, 340, 120 + k * 50, 160, color=ORANGE, width=2.5)
    s.text(70, 250, "evaporation", size=15, weight="bold", color=ORANGE, anchor="start")
    s.line(420, 330, 420, 290, color=BROWN, width=4)
    s.circle(420, 278, 22, fill=GRASS, stroke=GREEN, width=2)
    arrow(s, 420, 250, 430, 170, color=GREEN, width=2.5)
    s.text(450, 230, "transpiration", size=14, weight="bold", color=GREEN, anchor="start")
    arrow(s, 330, 110, 520, 110, color=MUTED, width=2.5)
    s.text(425, 92, "clouds move inland", size=13, color=MUTED)
    arrow(s, 700, 290, 700, 410, color=TEAL, width=2.5)
    s.text(712, 360, "infiltration,", size=13, weight="bold", color=TEAL, anchor="start")
    s.text(712, 378, "percolation", size=13, weight="bold", color=TEAL, anchor="start")
    return s


@fig
def drainage_patterns():
    s = Svg(800, 500, "Common drainage patterns",
            "Dendritic drainage branches like a tree on rocks of even resistance. Trellis drainage has parallel main streams "
            "joined at right angles by tributaries, on alternating hard and soft rock. Radial drainage flows outwards from a "
            "central high point such as a volcano. Centripetal drainage flows inwards to a central basin or lake. "
            "Rectangular drainage follows right-angled joints. Parallel drainage forms on a uniform slope.")
    heading(s, "Six drainage patterns")
    cells = [(140, 150, "Dendritic"), (400, 150, "Trellis"), (660, 150, "Radial"),
             (140, 360, "Centripetal"), (400, 360, "Rectangular"), (660, 360, "Parallel")]
    for cx, cy, name in cells:
        s.rect(cx - 110, cy - 80, 220, 150, fill="#f8fafc", stroke=MUTED, width=1.5, rx=8)
        s.text(cx, cy + 92, name, size=16, weight="bold", color=INK)
        c = BLUE
        if name == "Dendritic":
            s.path(f"M {cx} {cy + 65} L {cx} {cy - 10}", color=c, width=4)
            for (x1, y1, x2, y2) in ((cx, cy + 30, cx - 60, cy - 30), (cx, cy + 10, cx + 60, cy - 50), (cx, cy - 10, cx - 30, cy - 70),
                                     (cx, cy - 10, cx + 25, cy - 70), (cx - 35, cy - 5, cx - 80, cy - 20), (cx + 35, cy - 20, cx + 85, cy - 15)):
                s.line(x1, y1, x2, y2, color=c, width=2.4)
        elif name == "Trellis":
            for dx in (-50, 0, 50):
                s.line(cx + dx, cy - 70, cx + dx, cy + 65, color=c, width=3.4)
            for dy in (-45, -10, 25):
                s.line(cx - 95, cy + dy, cx - 50, cy + dy, color=c, width=2)
                s.line(cx + 50, cy + dy + 15, cx + 95, cy + dy + 15, color=c, width=2)
                s.line(cx, cy + dy, cx + 50, cy + dy, color=c, width=2)
        elif name == "Radial":
            s.circle(cx, cy - 5, 14, fill="#a8a29e", stroke=INK, width=1.5)
            for a in range(0, 360, 45):
                x2, y2 = cx + 90 * math.cos(math.radians(a)), cy - 5 + 70 * math.sin(math.radians(a))
                s.arrow(cx + 16 * math.cos(math.radians(a)), cy - 5 + 16 * math.sin(math.radians(a)), x2, y2, color=c, width=2.2)
        elif name == "Centripetal":
            s.ellipse(cx, cy - 5, 26, 18, fill=SEA, stroke=c, width=2)
            for a in range(0, 360, 45):
                x1, y1 = cx + 95 * math.cos(math.radians(a)), cy - 5 + 70 * math.sin(math.radians(a))
                s.arrow(x1, y1, cx + 30 * math.cos(math.radians(a)), cy - 5 + 22 * math.sin(math.radians(a)), color=c, width=2.2)
        elif name == "Rectangular":
            s.path(f"M {cx - 90} {cy - 60} L {cx - 20} {cy - 60} L {cx - 20} {cy} L {cx + 40} {cy} L {cx + 40} {cy + 60} L {cx + 95} {cy + 60}", color=c, width=3.4)
            s.path(f"M {cx - 20} {cy - 30} L {cx - 80} {cy - 30} M {cx + 40} {cy + 30} L {cx + 90} {cy + 30} M {cx + 40} {cy} L {cx + 40} {cy - 60}", color=c, width=2)
        else:
            for dx in (-75, -40, -5, 30, 65):
                s.line(cx + dx, cy - 70, cx + dx + 20, cy + 65, color=c, width=2.6)
    return s


@fig
def mass_movement_types():
    s = Svg(800, 440, "Types of mass movement on slopes",
            "Soil creep is very slow movement of soil down a slope, shown by tilted fences, poles and trees. A landslide is a "
            "sudden slide of a mass of rock and soil along a slip plane. A mudflow is a fast flow of soil saturated with "
            "water. A rockfall is the free fall of rock from a cliff or steep face.")
    heading(s, "Slow to very fast movement under gravity")
    panels = [(110, "Soil creep", "very slow; tilted poles,", "fences and trees"),
              (300, "Landslide", "sudden slide along a", "slip plane"),
              (500, "Mudflow", "fast flow of soil", "soaked with water"),
              (690, "Rockfall", "rock falls freely", "from a steep face")]
    for cx, t, l1, l2 in panels:
        s.polygon([(cx - 90, 120), (cx + 90, 300), (cx - 90, 300)], fill=LAND, stroke=INK, width=2)
        s.text(cx, 340, t, size=17, weight="bold", color=INK)
        s.text(cx, 362, l1, size=13, color=MUTED)
        s.text(cx, 380, l2, size=13, color=MUTED)
    cx = 110
    for k in range(3):
        x = cx - 60 + k * 45
        y = 120 + (x - (cx - 90)) * 1.0
        s.line(x, y, x + 14, y - 40, color=BROWN, width=3)
    arrow(s, cx - 40, 190, cx + 20, 250, color=RED, width=2.4)
    cx = 300
    s.path(f"M {cx - 50} 170 Q {cx + 10} 200 {cx + 30} 270", color=RED, width=2.4, dash="6 4")
    s.polygon([(cx - 50, 170), (cx + 30, 270), (cx + 60, 285), (cx - 20, 190)], fill="#c2a46b", stroke=INK, width=1.5)
    arrow(s, cx - 10, 205, cx + 40, 262, color=RED, width=2.6)
    cx = 500
    s.path(f"M {cx - 70} 140 Q {cx - 10} 220 {cx + 40} 260 Q {cx + 80} 290 {cx + 110} 300", color="#78350f", width=16)
    for k in range(4):
        s.line(cx - 40 + k * 30, 100, cx - 46 + k * 30, 125, color=BLUE, width=2)
    cx = 690
    s.polygon([(cx - 90, 120), (cx - 30, 120), (cx - 30, 300), (cx - 90, 300)], fill=ROCK, stroke=INK, width=2)
    for k, (dx, dy) in enumerate(((0, 170), (20, 230), (40, 285))):
        s.rect(cx - 20 + dx, dy, 18, 14, fill="#78716c", stroke=INK, width=1.2)
    note(s, "Freetown, 14 August 2017: a mudslide on Sugar Loaf Mountain after heavy rain killed or buried over 1,000 people.", 420, size=13, color=INK)
    return s


@fig
def relief_features():
    s = Svg(800, 400, "Cross-section of major relief features",
            "A cross-section from the coast inland shows a low coastal plain, an escarpment rising steeply to a plateau with "
            "a flat top, an inselberg standing alone on the plateau, a river valley cut into the plateau, and mountains "
            "rising to high peaks.")
    heading(s, "Plain, escarpment, plateau, valley, inselberg, mountain")
    s.rect(0, 300, 120, 100, fill=SEA, stroke="none", width=0)
    pts = [(0, 300), (120, 300), (240, 290), (270, 170), (380, 165), (400, 120), (430, 120), (450, 165), (480, 168),
           (510, 230), (540, 168), (600, 165), (660, 80), (700, 60), (740, 90), (800, 120), (800, 400), (0, 400)]
    s.polygon(pts, fill=LAND, stroke=INK, width=2.5)
    s.path("M 400 120 Q 415 95 430 120", color=INK, width=2.5, fill="#a8a29e")
    s.ellipse(525, 228, 10, 5, fill=BLUE, stroke=BLUE, width=1)
    labels = [(160, 330, "coastal plain"), (255, 250, "escarpment"), (330, 150, "plateau"), (415, 98, "inselberg"),
              (525, 270, "river valley"), (705, 108, "mountain peak"), (60, 340, "sea")]
    for x, y, t in labels:
        s.label(x, y, t, size=15, color=INK, weight="bold")
    note(s, "Not to scale. Plateaus are high and flat-topped; plains are low and flat.", 385, size=14)
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
