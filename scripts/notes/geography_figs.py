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

import json
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



# ═══ G2: climate, vegetation and soils ═══════════════════════════════════════

MONTHS = "JFMAMJJASOND"


def climate_graph(s: Svg, x0, y0, w, h, rain, temp, title, sub, rmax=900, tmin=15, tmax=35):
    """Bars for rainfall (mm, left axis) and a line for temperature (°C, right axis)."""
    s.text(x0 + w / 2, y0 - 34, title, size=17, weight="bold", color=INK)
    s.text(x0 + w / 2, y0 - 14, sub, size=13, color=MUTED)
    s.line(x0, y0, x0, y0 + h, color=INK, width=2)
    s.line(x0, y0 + h, x0 + w, y0 + h, color=INK, width=2)
    s.line(x0 + w, y0, x0 + w, y0 + h, color=INK, width=2)
    bw = w / 12
    for k, r in enumerate(rain):
        bh = h * r / rmax
        s.rect(x0 + k * bw + 3, y0 + h - bh, bw - 6, bh, fill="#93c5fd", stroke=BLUE, width=1.2)
        s.text(x0 + k * bw + bw / 2, y0 + h + 16, MONTHS[k], size=12, color=MUTED)
    for v in range(0, rmax + 1, 300):
        s.text(x0 - 6, y0 + h - h * v / rmax, str(v), size=11, color=BLUE, anchor="end")
    for v in range(tmin, tmax + 1, 5):
        s.text(x0 + w + 6, y0 + h - h * (v - tmin) / (tmax - tmin), str(v), size=11, color=RED, anchor="start")
    pts = [(x0 + k * bw + bw / 2, y0 + h - h * (t - tmin) / (tmax - tmin)) for k, t in enumerate(temp)]
    s.polyline(pts, color=RED, width=3)
    for x, y in pts:
        s.dot(x, y, r=3.5, color=RED)
    s.text(x0 - 26, y0 + h / 2, "mm", size=12, color=BLUE)
    s.text(x0 + w + 30, y0 + h / 2, "°C", size=12, color=RED)


@fig
def climate_graphs_wa():
    s = Svg(800, 460, "Climate graphs for Freetown and Kano",
            "Freetown (tropical monsoon, coast of Sierra Leone) has very heavy rain from May to October, peaking at about "
            "800 to 900 mm in July and August, and almost none from December to March; temperatures stay about 26 to 28 °C. "
            "Kano (savanna, northern Nigeria) has much less rain, about 800 mm a year, mostly from June to September, and a "
            "larger temperature range, about 22 to 31 °C. Values are approximate long-term averages.")
    heading(s, "Two West African climates (approximate averages)")
    fr_rain = [8, 3, 14, 55, 160, 380, 800, 840, 600, 300, 130, 30]
    fr_temp = [27, 27.5, 28, 28, 27.5, 26.5, 25.5, 25.5, 26, 26.5, 27, 27]
    kn_rain = [0, 0, 2, 8, 55, 110, 210, 300, 125, 15, 0, 0]
    kn_temp = [22, 25, 29, 31, 31, 29, 27, 26, 27, 27.5, 25, 22.5]
    climate_graph(s, 70, 130, 280, 250, fr_rain, fr_temp, "Freetown, Sierra Leone", "about 3,300 mm a year · tropical monsoon")
    climate_graph(s, 460, 130, 280, 250, kn_rain, kn_temp, "Kano, northern Nigeria", "about 830 mm a year · tropical continental (savanna)")
    note(s, "Blue bars: rainfall (mm, left). Red line: temperature (°C, right).", 440, size=14)
    return s


@fig
def rainfall_types():
    s = Svg(800, 470, "Types of rainfall: convectional, relief and frontal",
            "Convectional rain: the ground is strongly heated, warm moist air rises, cools and condenses into tall clouds "
            "that give heavy afternoon storms. Relief (orographic) rain: moist wind is forced to rise over mountains and "
            "rains on the windward side, leaving a dry rain shadow on the leeward side. Frontal (cyclonic) rain: warm air "
            "rises over a wedge of cold air along a front.")
    heading(s, "How air is made to rise and rain")
    # convectional
    s.rect(30, 330, 220, 20, fill=GRASS, stroke=INK, width=1.5)
    s.circle(60, 90, 22, fill="#fde68a", stroke=ORANGE, width=2)
    for k in range(3):
        arrow(s, 90 + k * 45, 320, 100 + k * 45, 190, color=RED, width=2.4)
    s.ellipse(150, 160, 80, 34, fill="#e5e7eb", stroke=MUTED, width=2)
    for k in range(4):
        s.line(110 + k * 22, 200, 104 + k * 22, 236, color=BLUE, width=2)
    s.text(140, 380, "Convectional", size=17, weight="bold", color=INK)
    s.text(140, 402, "strong heating; afternoon", size=13, color=MUTED)
    s.text(140, 420, "storms (equatorial regions)", size=13, color=MUTED)
    # relief
    s.polygon([(290, 350), (400, 180), (440, 180), (540, 350)], fill="#a8a29e", stroke=INK, width=2)
    arrow(s, 280, 320, 360, 240, color=BLUE, width=2.6)
    s.ellipse(375, 170, 55, 24, fill="#e5e7eb", stroke=MUTED, width=2)
    for k in range(3):
        s.line(355 + k * 18, 196, 349 + k * 18, 228, color=BLUE, width=2)
    arrow(s, 450, 200, 530, 300, color=ORANGE, width=2.4)
    s.text(320, 300, "windward:", size=12, weight="bold", color=BLUE, anchor="end")
    s.text(320, 316, "wet", size=12, weight="bold", color=BLUE, anchor="end")
    s.text(462, 316, "leeward: dry", size=12, weight="bold", color="#ffffff", anchor="start")
    s.text(462, 332, "rain shadow", size=12, weight="bold", color="#ffffff", anchor="start")
    s.text(415, 380, "Relief (orographic)", size=17, weight="bold", color=INK)
    s.text(415, 402, "moist wind forced over", size=13, color=MUTED)
    s.text(415, 420, "mountains", size=13, color=MUTED)
    # frontal
    s.path("M 580 350 L 780 350 L 780 240 Q 700 300 580 350 Z", color=BLUE, width=2, fill="#dbeafe")
    s.text(735, 320, "cold air", size=13, weight="bold", color=BLUE)
    arrow(s, 600, 330, 720, 220, color=RED, width=2.6)
    s.text(640, 240, "warm air", size=13, weight="bold", color=RED, anchor="end")
    s.ellipse(720, 180, 60, 24, fill="#e5e7eb", stroke=MUTED, width=2)
    for k in range(3):
        s.line(700 + k * 18, 206, 694 + k * 18, 236, color=BLUE, width=2)
    s.text(680, 380, "Frontal (cyclonic)", size=17, weight="bold", color=INK)
    s.text(680, 402, "warm air rises over", size=13, color=MUTED)
    s.text(680, 420, "cold air (temperate lands)", size=13, color=MUTED)
    note(s, "In every case: air rises → cools → water vapour condenses → clouds → rain", 455, size=14, color=INK)
    return s


@fig
def weather_instruments():
    s = Svg(800, 500, "Weather instruments in a weather station",
            "A weather station has a Stevenson screen, a white louvred box that shades thermometers (maximum and minimum, "
            "and wet- and dry-bulb for humidity). Outside are a rain gauge for rainfall, a wind vane for wind direction, a "
            "cup anemometer for wind speed and a sunshine recorder. A barometer indoors measures air pressure.")
    heading(s, "What each instrument measures")
    items = [(110, 160, "Stevenson screen", "houses thermometers", "and hygrometer"),
             (300, 160, "Rain gauge", "rainfall (mm)", ""),
             (500, 160, "Wind vane", "wind direction", ""),
             (690, 160, "Cup anemometer", "wind speed", "(km/h or knots)"),
             (110, 380, "Max–min thermometer", "highest and lowest", "temperature (°C)"),
             (300, 380, "Wet- and dry-bulb", "relative humidity (%)", "(hygrometer)"),
             (500, 380, "Barometer", "air pressure", "(millibars)"),
             (690, 380, "Sunshine recorder", "hours of sunshine", "")]
    for x, y, a, b, c in items:
        s.rect(x - 80, y - 70, 160, 104, fill="#f8fafc", stroke=MUTED, width=1.5, rx=8)
        s.text(x, y + 58, a, size=14, weight="bold", color=INK)
        s.text(x, y + 76, b, size=12, color=MUTED)
        if c:
            s.text(x, y + 92, c, size=12, color=MUTED)
    # icons
    s.rect(80, 100, 60, 50, fill="#ffffff", stroke=INK, width=2)
    for k in range(4):
        s.line(84, 108 + k * 10, 136, 108 + k * 10, color=MUTED, width=1.5)
    s.line(95, 150, 95, 175, color=INK, width=2)
    s.line(125, 150, 125, 175, color=INK, width=2)
    s.polygon([(282, 100), (318, 100), (310, 125), (290, 125)], fill="#dbeafe", stroke=INK, width=2)
    s.rect(290, 125, 20, 45, fill="#dbeafe", stroke=INK, width=2)
    s.line(500, 175, 500, 110, color=INK, width=2.5)
    s.polygon([(470, 110), (530, 110), (540, 100), (530, 120)], fill=RED, stroke=INK, width=1.5)
    s.text(470, 100, "N", size=12, weight="bold")
    s.line(690, 175, 690, 120, color=INK, width=2.5)
    for dx in (-30, 30):
        s.line(690, 120, 690 + dx, 115, color=INK, width=2)
        s.circle(690 + dx, 115, 9, fill="#e5e7eb", stroke=INK, width=1.5)
    s.rect(80, 315, 14, 70, fill="#ffffff", stroke=INK, width=2, rx=6)
    s.rect(126, 315, 14, 70, fill="#ffffff", stroke=INK, width=2, rx=6)
    s.path("M 87 385 Q 110 410 133 385", color=INK, width=2)
    s.rect(84, 340, 6, 40, fill=RED, stroke="none", width=0)
    s.rect(130, 330, 6, 50, fill=RED, stroke="none", width=0)
    s.rect(282, 315, 12, 70, fill="#ffffff", stroke=INK, width=2, rx=6)
    s.rect(306, 315, 12, 70, fill="#ffffff", stroke=INK, width=2, rx=6)
    s.rect(302, 380, 20, 12, fill="#bfdbfe", stroke=BLUE, width=1.5)
    s.circle(500, 345, 38, fill="#ffffff", stroke=INK, width=2.5)
    s.line(500, 345, 520, 322, color=RED, width=3)
    s.circle(690, 345, 26, fill="#e0f2fe", stroke=INK, width=2)
    s.path("M 664 365 Q 690 395 716 365", color=INK, width=2)
    return s


@fig
def vegetation_belts_wa():
    s = Svg(800, 500, "Vegetation belts of West Africa from the coast to the Sahara",
            "Going north from the Gulf of Guinea coast, rainfall falls and the dry season lengthens, so vegetation changes in "
            "belts: mangrove swamps on the coast, tropical rainforest, Guinea savanna (tall grass with trees), Sudan savanna "
            "(shorter grass, fewer trees), Sahel savanna (thorn bushes and short grass) and finally the Sahara desert.")
    heading(s, "Rainfall falls northwards, and vegetation changes in belts")
    belts = [("Sahara desert", "under 250 mm", "#fde68a"),
             ("Sahel savanna", "250–500 mm; thorn scrub", "#fcd9a3"),
             ("Sudan savanna", "500–1,000 mm; short grass", "#d9f99d"),
             ("Guinea savanna", "1,000–1,500 mm; tall grass, trees", "#a3e635"),
             ("Tropical rainforest", "over 1,500 mm; tall evergreen trees", "#22c55e"),
             ("Mangrove swamp", "tidal coast and estuaries", "#0f766e")]
    y = 70
    for k, (name, desc, col) in enumerate(belts):
        h = 58
        s.rect(60, y, 470, h, fill=col, stroke=INK, width=1.2)
        s.text(80, y + 22, name, size=17, weight="bold", color="#ffffff" if k >= 4 else INK, anchor="start")
        s.text(80, y + 42, desc, size=13, color="#ffffff" if k >= 4 else INK, anchor="start")
        y += h
    s.rect(60, y, 470, 40, fill=SEA, stroke=INK, width=1.2)
    s.text(295, y + 20, "Atlantic Ocean (Gulf of Guinea)", size=15, weight="bold", color="#1e3a8a")
    arrow(s, 600, 400, 600, 90, color=MUTED, width=3)
    s.text(615, 120, "north", size=15, weight="bold", color=INK, anchor="start")
    s.text(615, 160, "less rain,", size=14, color=ORANGE, anchor="start")
    s.text(615, 180, "longer dry season,", size=14, color=ORANGE, anchor="start")
    s.text(615, 200, "fewer trees", size=14, color=ORANGE, anchor="start")
    s.text(615, 330, "more rain,", size=14, color=GREEN, anchor="start")
    s.text(615, 350, "denser forest", size=14, color=GREEN, anchor="start")
    s.text(615, 400, "coast", size=15, weight="bold", color=INK, anchor="start")
    note(s, "Simplified: belts are wider or narrower in different countries, and much forest has been cleared.", 480, size=13)
    return s


@fig
def rainforest_layers():
    s = Svg(800, 480, "Layers (stratification) of the tropical rainforest",
            "The tropical rainforest has layers: scattered emergent trees over 40 m tall; a continuous canopy at about 25 to "
            "35 m; an under-canopy of smaller trees; a shrub layer; and a dark forest floor with little undergrowth, covered "
            "in leaf litter. Lianas (climbers) and epiphytes grow on the trees.")
    heading(s, "Emergents, canopy, under-canopy, shrubs, floor")
    s.rect(0, 420, 800, 60, fill="#a16207", stroke="none", width=0)
    def tree(x, top, crown, col):
        s.rect(x - 5, top, 10, 420 - top, fill=BROWN, stroke="none", width=0)
        s.ellipse(x, top, crown, crown * 0.55, fill=col, stroke="#14532d", width=1.5)
    for x in (230, 520):
        tree(x, 80, 50, "#15803d")
    for x in (120, 300, 390, 460, 600, 680):
        tree(x, 170, 58, "#22c55e")
    for x in (170, 350, 560, 640):
        tree(x, 270, 34, "#4ade80")
    for x in range(80, 720, 70):
        s.ellipse(x, 380, 26, 14, fill="#86efac", stroke="#15803d", width=1)
    s.path("M 300 170 Q 320 260 305 330 Q 290 380 310 420", color="#65a30d", width=3)
    labels = [(770, 80, "Emergents (over 40 m)"), (770, 170, "Canopy (25–35 m)"), (770, 270, "Under-canopy"),
              (770, 380, "Shrub layer"), (770, 445, "Forest floor: leaf litter")]
    for x, y, t in labels:
        s.label(x, y, t, size=15, color=INK, weight="bold", anchor="end")
    s.label(330, 300, "liana", size=13, color="#3f6212", weight="bold")
    return s


@fig
def soil_profile():
    s = Svg(800, 520, "A soil profile and its horizons",
            "A soil profile is a vertical section through the soil from the surface to the bedrock. The O horizon is leaf "
            "litter and humus; the A horizon (topsoil) is dark, rich in humus and leached; the B horizon (subsoil) collects "
            "minerals washed down from above; the C horizon is weathered parent rock; and the R horizon is unweathered "
            "bedrock.")
    heading(s, "From leaf litter to bedrock")
    layers = [("O", "Organic layer: leaf litter, humus", 40, "#3f2d1d", "#ffffff"),
              ("A", "Topsoil: dark, humus-rich, roots; leached", 90, "#6b4423", "#ffffff"),
              ("B", "Subsoil: minerals washed in (clay, iron)", 100, "#b45309", "#ffffff"),
              ("C", "Weathered parent rock", 90, "#d6a76a", INK),
              ("R", "Bedrock (unweathered)", 80, "#78716c", "#ffffff")]
    y = 70
    for k, (h_, desc, hh, col, tc) in enumerate(layers):
        if h_ == "C":
            s.rect(140, y, 240, hh, fill=col, stroke=INK, width=1.5)
            for j in range(7):
                s.rect(155 + j * 32, y + 20 + (j % 2) * 30, 22, 16, fill="#a8a29e", stroke=INK, width=1)
        else:
            s.rect(140, y, 240, hh, fill=col, stroke=INK, width=1.5)
        s.text(110, y + hh / 2, h_, size=26, weight="bold", color=INK)
        s.text(410, y + hh / 2, desc, size=15, weight="bold" if k in (1, 2) else "normal", color=INK, anchor="start")
        y += hh
    for x in (200, 260, 320):
        s.path(f"M {x} 110 Q {x - 8} 160 {x + 4} 210", color="#fef3c7", width=2)
    arrow(s, 40, 120, 40, 250, color=BLUE, width=2.6)
    s.text(30, 270, "leaching:", size=13, weight="bold", color=BLUE, anchor="start")
    s.text(30, 288, "water carries", size=12, color=BLUE, anchor="start")
    s.text(30, 304, "minerals down", size=12, color=BLUE, anchor="start")
    note(s, "Tropical soils such as Sierra Leone's are deep, red and heavily leached.", 505, size=14)
    return s



# ═══ G3: human and economic geography ════════════════════════════════════════

@fig
def population_pyramids():
    s = Svg(800, 470, "Population pyramids of a developing and a developed country",
            "A developing country's pyramid, like Sierra Leone's, has a wide base and narrow top: high birth rates, many "
            "children and few old people. A developed country's pyramid has a narrow base and straighter sides: low birth "
            "rates, long life expectancy and more old people.")
    heading(s, "Wide base = young population; straight sides = ageing population")
    groups = ["0–4", "5–9", "10–14", "15–19", "20–24", "25–29", "30–34", "35–39", "40–44", "45–49", "50–54", "55–59", "60–64", "65–69", "70–74", "75+"]
    dev = [8.0, 7.2, 6.6, 6.0, 5.2, 4.4, 3.8, 3.2, 2.7, 2.2, 1.8, 1.4, 1.1, 0.8, 0.5, 0.4]
    rich = [2.5, 2.6, 2.7, 2.8, 3.0, 3.2, 3.3, 3.4, 3.4, 3.4, 3.3, 3.2, 3.0, 2.8, 2.4, 3.6]
    def pyramid(cx, data, title, sub):
        s.text(cx, 74, title, size=17, weight="bold", color=INK)
        s.text(cx, 94, sub, size=13, color=MUTED)
        y0, bh, sc = 410, 19, 17
        for k, v in enumerate(data):
            y = y0 - (k + 1) * bh
            s.rect(cx - v * sc, y, v * sc, bh - 2, fill="#93c5fd", stroke=BLUE, width=1)
            s.rect(cx, y, v * sc, bh - 2, fill="#fbcfe8", stroke="#db2777", width=1)
        s.line(cx, y0 - 16 * bh, cx, y0, color=INK, width=1.5)
        s.text(cx - 70, y0 + 18, "males", size=13, color=BLUE)
        s.text(cx + 70, y0 + 18, "females", size=13, color="#db2777")
    pyramid(220, dev, "Developing country", "e.g. Sierra Leone: high births, young")
    pyramid(600, rich, "Developed country", "e.g. Japan or Germany: low births, ageing")
    for k, g in enumerate(groups):
        if k % 3 == 0:
            s.text(410, 410 - (k + 0.5) * 19, g, size=11, color=MUTED)
    s.text(410, 120, "age", size=12, color=MUTED)
    note(s, "Shapes are illustrative, not exact census data.", 455, size=13)
    return s


@fig
def settlement_patterns():
    s = Svg(800, 400, "Nucleated, dispersed and linear settlement patterns",
            "In a nucleated settlement, houses are clustered closely around a centre such as a market, water point or "
            "crossroads. In a dispersed settlement, houses are scattered far apart across farmland. In a linear settlement, "
            "houses are built in a line along a road, river, railway or coast.")
    heading(s, "How houses are arranged")
    import random
    rnd = random.Random(4)
    def house(x, y, col=BROWN):
        s.rect(x - 6, y - 4, 12, 9, fill="#fde68a", stroke=col, width=1.4)
        s.polygon([(x - 8, y - 4), (x, y - 11), (x + 8, y - 4)], fill="#b45309", stroke=col, width=1)
    for cx, title, sub in ((140, "Nucleated", "clustered around a centre"), (400, "Dispersed", "scattered over farmland"), (660, "Linear", "along a road, river or coast")):
        s.rect(cx - 115, 70, 230, 230, fill="#ecfccb", stroke=MUTED, width=1.5, rx=8)
        s.text(cx, 330, title, size=18, weight="bold", color=INK)
        s.text(cx, 352, sub, size=13, color=MUTED)
    s.line(25, 180, 255, 190, color="#a8a29e", width=5)
    s.line(140, 70, 145, 300, color="#a8a29e", width=5)
    s.circle(142, 185, 10, fill=F_AMBER, stroke=ORANGE, width=2)
    for k in range(26):
        a, r = rnd.uniform(0, 6.28), rnd.uniform(16, 60)
        house(142 + r * math.cos(a), 185 + r * math.sin(a))
    for k in range(9):
        house(rnd.uniform(300, 500), rnd.uniform(90, 285))
    s.line(545, 190, 775, 160, color="#a8a29e", width=6)
    for k in range(12):
        x = 560 + k * 18
        y = 190 - (x - 545) * 30 / 230
        house(x, y - 14)
        house(x + 8, y + 14)
    return s


@fig
def urban_land_use():
    s = Svg(800, 470, "Land-use zones in a city",
            "A simple model of a city has the central business district (CBD) at the centre, with shops, offices and banks; "
            "around it a zone of mixed land use and older, crowded housing; then residential zones, with low-cost housing "
            "and informal settlements in some places and high-cost housing in others; industry along transport routes and "
            "at the port; and the rural–urban fringe at the edge.")
    heading(s, "From the CBD to the rural–urban fringe")
    cx, cy = 300, 260
    zones = [(190, "#dcfce7", "rural–urban fringe"), (150, "#e0e7ff", "high- and low-cost housing"),
             (105, "#fef3c7", "older, crowded housing; informal settlements"), (60, "#fed7aa", "transition: mixed use"),
             (28, "#fca5a5", "CBD")]
    for r, col, _ in zones:
        s.circle(cx, cy, r, fill=col, stroke=INK, width=1.5)
    s.text(cx, cy, "CBD", size=15, weight="bold", color=INK)
    s.rect(cx + 40, cy - 190, 34, 380, fill="#cbd5e1", stroke="none", width=0)
    s.text(cx + 57, cy - 150, "industry", size=11, color=INK)
    keys = [("CBD", "#fca5a5", "shops, offices, banks; dearest land"),
            ("Transition zone", "#fed7aa", "workshops, warehouses, old houses"),
            ("Inner residential", "#fef3c7", "crowded and informal housing"),
            ("Outer residential", "#e0e7ff", "newer housing; high-cost estates"),
            ("Industrial zone", "#cbd5e1", "along roads, rail and the port"),
            ("Rural–urban fringe", "#dcfce7", "farms, new building, sprawl")]
    for k, (t, col, d) in enumerate(keys):
        y = 110 + k * 54
        s.rect(510, y - 14, 26, 26, fill=col, stroke=INK, width=1.2)
        s.text(546, y - 4, t, size=15, weight="bold", color=INK, anchor="start")
        s.text(546, y + 14, d, size=13, color=MUTED, anchor="start")
    note(s, "Real cities, like Freetown squeezed between sea and mountains, bend this model to their site.", 458, size=13)
    return s


@fig
def mining_methods():
    s = Svg(800, 440, "Methods of mining",
            "Open-cast (surface) mining removes the overburden and digs minerals from a large open pit, as for iron ore and "
            "bauxite. Underground (shaft) mining reaches deep deposits through vertical shafts and horizontal tunnels, as "
            "for gold and some diamonds. Alluvial (placer) mining recovers minerals from river gravels by digging, washing "
            "and sieving, or by dredging, as for alluvial diamonds, gold and rutile.")
    heading(s, "Open-cast, underground and alluvial mining")
    # open cast
    s.rect(20, 140, 240, 220, fill=LAND, stroke=INK, width=1.5)
    s.polygon([(40, 140), (90, 200), (190, 200), (240, 140)], fill="#ffffff", stroke=INK, width=1.5)
    s.polygon([(90, 200), (110, 230), (170, 230), (190, 200)], fill="#ffffff", stroke=INK, width=1.5)
    s.rect(110, 230, 60, 30, fill="#b91c1c", stroke=INK, width=1.2)
    s.text(140, 290, "ore body", size=12, color=INK)
    s.text(140, 390, "Open-cast (surface)", size=16, weight="bold", color=INK)
    s.text(140, 410, "iron ore, bauxite", size=13, color=MUTED)
    # underground
    s.rect(290, 140, 220, 220, fill=LAND, stroke=INK, width=1.5)
    s.rect(330, 140, 16, 190, fill="#ffffff", stroke=INK, width=1.5)
    s.rect(346, 220, 130, 14, fill="#ffffff", stroke=INK, width=1.5)
    s.rect(346, 300, 150, 14, fill="#ffffff", stroke=INK, width=1.5)
    s.rect(440, 250, 60, 40, fill="#facc15", stroke=INK, width=1.2)
    s.polygon([(320, 140), (338, 100), (356, 140)], fill="#78716c", stroke=INK, width=1.5)
    s.text(470, 274, "ore", size=12, color=INK)
    s.text(400, 390, "Underground (shaft)", size=16, weight="bold", color=INK)
    s.text(400, 410, "gold, deep diamonds", size=13, color=MUTED)
    # alluvial
    s.rect(540, 230, 240, 130, fill=LAND, stroke=INK, width=1.5)
    s.path("M 540 230 Q 660 260 780 230 L 780 250 Q 660 280 540 250 Z", color=BLUE, width=1.5, fill=SEA)
    for k in range(10):
        s.dot(560 + k * 22, 300 + (k % 3) * 12, r=4, color="#78716c")
    s.dot(620, 312, r=4, color="#ffffff")
    s.circle(700, 180, 26, fill="#e5e7eb", stroke=INK, width=1.5)
    s.text(700, 180, "sieve", size=11, color=INK)
    s.text(660, 390, "Alluvial (placer)", size=16, weight="bold", color=INK)
    s.text(660, 410, "diamonds, gold, rutile", size=13, color=MUTED)
    s.text(660, 330, "gravel with minerals", size=12, color=INK)
    return s


@fig
def industry_location():
    s = Svg(800, 460, "Factors influencing the location of industries",
            "Industries are located where the best combination of factors is found: raw materials, power, labour, market, "
            "transport, capital, water supply, government policy, land and site, and early start (industrial inertia).")
    heading(s, "Why industries are located where they are")
    c = box(s, 400, 240, 210, 70, ["INDUSTRY", "location"], col=PURPLE, fill=F_PURPLE, size=18)
    items = [(130, 90, "Raw materials", "heavy, bulky inputs"), (400, 80, "Power", "electricity, fuel"),
             (670, 90, "Labour", "skilled and cheap"), (110, 240, "Market", "buyers nearby"),
             (690, 240, "Transport", "ports, roads, rail"), (130, 390, "Capital", "money to invest"),
             (400, 400, "Government policy", "incentives, zones"), (670, 390, "Water and land", "flat, cheap sites")]
    for x, y, a, b in items:
        bb = box(s, x, y, 210, 62, [a, b], col=BLUE, fill=F_BLUE, size=15)
        link(s, bb, c, color=MUTED, width=1.8)
    return s


@fig
def hydro_dam():
    s = Svg(800, 420, "How a hydroelectric power station works",
            "Water stored in a reservoir behind a dam flows down through a pipe (penstock), spinning a turbine connected to a "
            "generator, which produces electricity. The electricity is stepped up by transformers and carried away on power "
            "lines, and the water flows on downstream.")
    heading(s, "Falling water → turbine → generator → electricity")
    s.rect(0, 340, 800, 80, fill=LAND, stroke="none", width=0)
    s.polygon([(0, 150), (300, 150), (300, 340), (0, 340)], fill=SEA, stroke="none", width=0)
    s.polygon([(300, 110), (360, 110), (420, 340), (300, 340)], fill="#9ca3af", stroke=INK, width=2)
    s.text(150, 200, "reservoir", size=17, weight="bold", color="#1e3a8a")
    s.path("M 300 260 L 430 320", color=BLUE, width=14)
    s.text(372, 270, "penstock", size=12, weight="bold", color="#ffffff")
    s.rect(430, 290, 110, 50, fill="#e5e7eb", stroke=INK, width=2)
    s.circle(462, 315, 16, fill="#fde68a", stroke=INK, width=1.5)
    s.text(462, 315, "T", size=13, weight="bold")
    s.circle(510, 315, 16, fill="#fca5a5", stroke=INK, width=1.5)
    s.text(510, 315, "G", size=13, weight="bold")
    s.text(485, 275, "power station", size=13, weight="bold", color=INK)
    s.path("M 540 330 Q 650 345 800 335", color=BLUE, width=10)
    s.text(690, 370, "river flows on", size=13, color="#1e3a8a")
    s.line(600, 180, 600, 300, color=INK, width=3)
    s.line(580, 190, 620, 190, color=INK, width=2.5)
    s.line(700, 160, 700, 300, color=INK, width=3)
    s.line(680, 170, 720, 170, color=INK, width=2.5)
    s.path("M 580 190 Q 640 205 680 170 M 620 190 Q 660 205 720 170", color=ORANGE, width=1.5)
    s.text(650, 140, "power lines", size=13, weight="bold", color=ORANGE)
    s.text(462, 360, "T = turbine, G = generator", size=12, color=MUTED)
    return s


@fig
def transport_cost_speed():
    s = Svg(800, 440, "Comparing transport modes by speed and cost",
            "Air transport is the fastest but most expensive per tonne. Road transport is flexible and fairly fast over short "
            "distances. Rail is cheaper for heavy, bulky goods over long distances. Water (sea and river) transport is the "
            "slowest but the cheapest for bulky goods. Pipelines carry liquids and gas cheaply once built.")
    heading(s, "Fast and dear, or slow and cheap?")
    ox, oy, w, h = 120, 380, 600, 290
    s.arrow(ox, oy, ox + w + 20, oy, color=INK, width=2)
    s.arrow(ox, oy, ox, oy - h - 20, color=INK, width=2)
    s.text(ox + w - 40, oy + 22, "speed →", size=15, weight="bold", color=INK)
    s.text(ox - 60, oy - h / 2 - 10, "cost per", size=14, weight="bold", color=INK)
    s.text(ox - 60, oy - h / 2 + 10, "tonne →", size=14, weight="bold", color=INK)
    pts = [(170, 350, "Water (sea, river)", BLUE, 150, 300), (260, 330, "Pipeline", TEAL, 290, 350), (330, 280, "Rail", PURPLE, 354, 256),
           (470, 220, "Road", ORANGE, 494, 196), (660, 110, "Air", RED, 684, 86)]
    for x, y, t, col, lx, ly in pts:
        s.circle(x, y, 18, fill=col, stroke=INK, width=1.5)
        s.label(lx, ly, t, size=15, color=col, weight="bold", anchor="start")
    note(s, "Bulky goods (iron ore, bauxite) go by rail and sea; urgent, light goods go by air.", 425, size=14, color=INK)
    return s


@fig
def balance_of_trade():
    s = Svg(800, 400, "Balance of trade",
            "The balance of trade is the difference between the value of a country's visible exports and imports. When "
            "exports are worth more than imports, the country has a trade surplus (favourable balance); when imports are "
            "worth more, it has a trade deficit (unfavourable balance).")
    heading(s, "Balance of trade = value of exports − value of imports")
    def pair(cx, ex, im, title, col, verdict):
        s.text(cx, 80, title, size=17, weight="bold", color=INK)
        s.rect(cx - 90, 330 - ex, 70, ex, fill=F_GREEN, stroke=GREEN, width=2)
        s.rect(cx + 20, 330 - im, 70, im, fill=F_RED, stroke=RED, width=2)
        s.text(cx - 55, 350, "exports", size=13, color=GREEN, weight="bold")
        s.text(cx + 55, 350, "imports", size=13, color=RED, weight="bold")
        s.text(cx, 380, verdict, size=16, weight="bold", color=col)
    s.line(60, 330, 740, 330, color=INK, width=1.5)
    pair(220, 220, 150, "Exports > imports", GREEN, "trade surplus (favourable)")
    pair(580, 140, 230, "Imports > exports", RED, "trade deficit (unfavourable)")
    return s


@fig
def greenhouse_effect():
    s = Svg(800, 440, "The greenhouse effect and global warming",
            "Sunlight passes through the atmosphere and warms the Earth. The Earth gives off heat (infrared), and greenhouse "
            "gases such as carbon dioxide, methane and water vapour trap some of it, keeping the planet warm. Burning fossil "
            "fuels and cutting forests add more greenhouse gases, trapping more heat and causing global warming.")
    heading(s, "More greenhouse gases trap more heat")
    s.circle(80, 100, 40, fill="#fde68a", stroke=ORANGE, width=3)
    s.text(80, 100, "Sun", size=16, weight="bold", color=ORANGE)
    s.path("M 0 330 Q 400 280 800 330 L 800 440 L 0 440 Z", color=INK, width=2, fill="#86efac")
    s.path("M 0 170 Q 400 110 800 170", color="#94a3b8", width=14)
    s.text(620, 125, "greenhouse gases (CO₂, methane)", size=14, weight="bold", color=MUTED)
    arrow(s, 120, 130, 330, 300, color=ORANGE, width=3)
    s.text(200, 250, "sunlight in", size=14, weight="bold", color=ORANGE)
    arrow(s, 380, 300, 450, 175, color=RED, width=3)
    arrow(s, 450, 175, 510, 290, color=RED, width=3)
    s.text(530, 240, "heat trapped and", size=14, weight="bold", color=RED, anchor="start")
    s.text(530, 258, "sent back down", size=14, weight="bold", color=RED, anchor="start")
    arrow(s, 300, 290, 260, 60, color="#f97316", width=2)
    s.text(272, 52, "some heat escapes", size=13, color=MUTED, anchor="start")
    s.rect(640, 300, 30, 40, fill="#6b7280", stroke=INK, width=1.5)
    for k in range(3):
        s.circle(655 + k * 8, 285 - k * 14, 8 + k * 2, fill="#d1d5db", stroke=MUTED, width=1)
    s.text(655, 380, "burning fuel", size=13, weight="bold", color=INK)
    s.text(140, 380, "deforestation adds CO₂", size=13, weight="bold", color=INK)
    return s



@fig
def optimum_population():
    s = Svg(800, 440, "Under-population, optimum population and over-population",
            "As population grows, output (income) per head first rises because there are more people to use the resources. "
            "It reaches a peak at the optimum population. Beyond that point, there are too many people for the resources and "
            "technology available, so output per head falls: the area is over-populated.")
    heading(s, "Optimum population gives the highest output per head")
    ox, oy, w, h = 110, 370, 620, 290
    s.arrow(ox, oy, ox + w + 20, oy, color=INK, width=2)
    s.arrow(ox, oy, ox, oy - h - 20, color=INK, width=2)
    s.text(ox + w - 60, oy + 24, "population →", size=15, weight="bold", color=INK)
    s.text(ox - 58, oy - h / 2 - 10, "output", size=14, weight="bold", color=INK)
    s.text(ox - 58, oy - h / 2 + 10, "per head", size=14, weight="bold", color=INK)
    s.path(f"M {ox + 20} {oy - 40} C {ox + 200} {oy - 330} {ox + 380} {oy - 330} {ox + w - 20} {oy - 60}", color=BLUE, width=4)
    px = ox + 300
    s.line(px, oy, px, oy - 260, color=GREEN, width=2, dash="6 5")
    s.label(px, oy - 270, "optimum", size=15, color=GREEN, weight="bold")
    s.text(ox + 150, oy - 30, "UNDER-", size=15, weight="bold", color=ORANGE)
    s.text(ox + 150, oy - 12, "POPULATION", size=15, weight="bold", color=ORANGE)
    s.text(ox + 470, oy - 30, "OVER-", size=15, weight="bold", color=RED)
    s.text(ox + 470, oy - 12, "POPULATION", size=15, weight="bold", color=RED)
    note(s, "Resources and technology decide where the optimum lies.", 420, size=14, color=MUTED)
    return s


@fig
def settlement_hierarchy():
    s = Svg(800, 470, "The settlement hierarchy",
            "Settlements ranked by size and importance, from many small isolated dwellings and hamlets at the bottom to a "
            "few large cities and conurbations at the top. Higher settlements are fewer, larger, further apart and provide "
            "more and higher-order services.")
    heading(s, "Fewer, larger settlements with more services towards the top")
    levels = [("Conurbation", "Lagos, Greater Accra", "#fecaca"), ("City", "Freetown, Bo, Kenema", "#fed7aa"),
              ("Town", "district headquarters", "#fde68a"), ("Village", "primary school, market", "#d9f99d"),
              ("Hamlet", "a few houses", "#bbf7d0"), ("Isolated dwelling", "one farm household", "#a7f3d0")]
    top, step, cx = 66, 58, 290
    for i, (name, ex, col) in enumerate(levels):
        y0, y1 = top + i * step, top + (i + 1) * step
        hw0, hw1 = 40 + i * 38, 40 + (i + 1) * 38
        poly(s, [(cx - hw0, y0), (cx + hw0, y0), (cx + hw1, y1), (cx - hw1, y1)], col, width=1.5)
        s.text(cx, (y0 + y1) / 2, name, size=15 if i else 14, weight="bold", color=INK)
        s.text(560, (y0 + y1) / 2, ex, size=14, color=INK, anchor="start")
        s.line(cx + (hw0 + hw1) / 2 + 8, (y0 + y1) / 2, 550, (y0 + y1) / 2, color="#cbd5e1", width=1.2, dash="3 4")
    s.arrow(40, 410, 40, 80, color=PURPLE, width=2.5)
    s.text(40, 445, "↑ fewer, larger, more services, wider sphere of influence", size=14, weight="bold", color=PURPLE, anchor="start")
    return s


@fig
def rural_urban_migration():
    s = Svg(800, 440, "Push and pull factors of rural–urban migration",
            "Push factors in rural areas, such as poverty, unemployment, poor amenities, land shortage and insecurity, drive "
            "people away. Pull factors in towns, such as jobs, better amenities, education, security and relatives already "
            "there, attract them. Obstacles such as cost, distance and family ties may slow migration.")
    heading(s, "Rural–urban migration: pushed out, pulled in")
    a = box(s, 160, 225, 270, 260, ["RURAL AREA", "push factors:", "poverty, low farm income", "unemployment",
                                    "no electricity, water,", "hospitals, schools", "land shortage, poor harvests",
                                    "insecurity, disasters"], col=ORANGE, fill=F_AMBER, size=17)
    b = box(s, 640, 225, 270, 260, ["TOWN", "pull factors:", "jobs, higher wages", "schools and colleges",
                                    "hospitals, electricity,", "pipe-borne water", "security",
                                    "relatives, city life"], col=BLUE, fill=F_BLUE, size=17)
    s.arrow(305, 225, 495, 225, color=INK, width=5)
    s.text(400, 200, "migration", size=16, weight="bold", color=INK)
    s.text(400, 300, "obstacles:", size=13, weight="bold", color=MUTED)
    s.text(400, 318, "cost, distance,", size=13, color=MUTED)
    s.text(400, 336, "family ties", size=13, color=MUTED)
    note(s, "Most migrants are young adults looking for work or education.", 415, size=14, color=INK)
    return s


@fig
def bush_fallow_cycle():
    s = Svg(800, 460, "The bush fallowing cycle",
            "A farmer clears bush, burns the cut vegetation so the ash adds nutrients, plants crops such as rice and cassava "
            "for two or three years until yields fall, then leaves the land to fallow so bush regrows and the soil recovers "
            "before the plot is cleared again. When population grows, fallow periods become too short for the soil to recover.")
    heading(s, "Bush fallowing: farm, rest, return")
    cx, cy, rx, ry = 400, 240, 255, 145
    stages = [("1. Clear the bush", "cutlass and axe", F_AMBER, ORANGE), ("2. Burn", "ash adds nutrients", F_RED, RED),
              ("3. Plant crops", "rice, cassava: 2–3 yrs", F_GREEN, GREEN), ("4. Soil exhausted", "yields fall", F_GREY, INK),
              ("5. Fallow", "bush regrows, soil recovers", F_TEAL, TEAL)]
    boxes = []
    for i, (a, b, fill, col) in enumerate(stages):
        ang = math.radians(-90 + i * 72)
        boxes.append(box(s, cx + rx * math.cos(ang), cy + ry * math.sin(ang), 210, 62, [a, b], col=col, fill=fill, size=15))
    for i in range(5):
        link(s, boxes[i], boxes[(i + 1) % 5], color=MUTED, width=2.2)
    s.text(cx, cy - 8, "same plot,", size=15, color=MUTED)
    s.text(cx, cy + 12, "permanent village", size=15, color=MUTED)
    note(s, "Fallow cut from 10–15 years to 3–5 years → soil cannot recover → lower yields.", 440, size=14, color=RED)
    return s


@fig
def industry_sectors():
    s = Svg(800, 450, "Primary, secondary and tertiary industries",
            "Primary industries extract raw materials (farming, fishing, mining, logging). Secondary industries process them "
            "into manufactured goods. Tertiary industries provide services such as transport, trade, banking and teaching. "
            "Examples: cocoa farming, a chocolate factory, shops selling chocolate.")
    heading(s, "From raw material to customer")
    cols = [(140, "PRIMARY", "extracts raw materials", GREEN, F_GREEN), (400, "SECONDARY", "manufactures goods", PURPLE, F_PURPLE),
            (660, "TERTIARY", "provides services", BLUE, F_BLUE)]
    for x, a, b, col, fill in cols:
        box(s, x, 95, 220, 66, [a, b], col=col, fill=fill, size=16)
    rows = [("cocoa farming", "chocolate factory", "shops sell chocolate"),
            ("logging", "sawmill, furniture", "transport and sale"),
            ("fishing", "smoking, canning", "market traders"),
            ("mining iron ore", "steel making", "banks, insurance")]
    for r, row in enumerate(rows):
        y = 185 + r * 66
        bs = [box(s, x, y, 200, 46, [t], col=INK, fill="#ffffff", size=15) for (x, *_), t in zip(cols, row)]
        link(s, bs[0], bs[1], color=MUTED, width=2)
        link(s, bs[1], bs[2], color=MUTED, width=2)
    note(s, "A fourth, quaternary sector provides information and research.", 438, size=14, color=MUTED)
    return s


@fig
def energy_sources():
    s = Svg(800, 450, "Renewable and non-renewable sources of energy",
            "Renewable sources are replaced naturally and will not run out: solar, hydroelectric, wind, biomass (firewood "
            "and charcoal), geothermal and tidal or wave energy. Non-renewable sources are fossil fuels and nuclear fuel, "
            "formed over millions of years, which will run out: coal, petroleum, natural gas and uranium.")
    heading(s, "Sources of energy")
    top = box(s, 400, 80, 260, 50, ["ENERGY SOURCES"], col=INK, fill=F_GREY, size=17)
    r = box(s, 205, 275, 340, 290, ["RENEWABLE", "replaced naturally", "", "solar (sun)", "hydroelectric (water)",
                                     "wind", "biomass: firewood, charcoal", "geothermal (earth heat)", "tides and waves"],
            col=GREEN, fill=F_GREEN, size=18)
    n = box(s, 595, 275, 340, 290, ["NON-RENEWABLE", "will run out", "", "coal", "petroleum (crude oil)",
                                     "natural gas", "nuclear (uranium)", "", "fossil fuels pollute"],
            col=RED, fill=F_RED, size=18)
    link(s, top, r, color=MUTED, width=2.2)
    link(s, top, n, color=MUTED, width=2.2)
    return s


@fig
def desertification_cycle():
    s = Svg(800, 470, "Causes and effects of desertification",
            "Desertification is the spread of desert-like conditions into dry lands such as the Sahel. Its causes are "
            "overgrazing, over-cultivation, cutting trees for fuel, bush burning and drought. Its effects include loss of "
            "farmland and pasture, food shortages, migration, dust storms and conflict over land and water.")
    heading(s, "Desertification in the Sahel")
    centre = box(s, 400, 250, 200, 100, ["DESERTIFICATION", "dry land turns", "desert-like"], col=BROWN, fill="#fde68a", size=17)
    causes = ["overgrazing", "over-cultivation", "cutting trees for fuel", "bush burning", "drought"]
    effects = ["loss of farmland, pasture", "food shortage, famine", "migration to towns", "dust storms", "conflict over land"]
    s.text(130, 72, "CAUSES", size=16, weight="bold", color=RED)
    s.text(670, 72, "EFFECTS", size=16, weight="bold", color=BLUE)
    for i, (c, e) in enumerate(zip(causes, effects)):
        y = 110 + i * 72
        a = box(s, 130, y, 220, 52, [c], col=RED, fill=F_RED, size=15)
        b = box(s, 670, y, 220, 52, [e], col=BLUE, fill=F_BLUE, size=15)
        s.arrow(a[0] + 116, y, centre[0] - 106, 250 + (y - 254) * 0.35, color=MUTED, width=1.8)
        s.arrow(centre[0] + 106, 250 + (y - 254) * 0.35, b[0] - 116, y, color=MUTED, width=1.8)
    return s


# ═══ G4: regional geography and maps ═════════════════════════════════════════
# Outlines are Natural Earth (public domain), simplified into data/geography-maps.json.

MAPS = json.loads((Path(__file__).resolve().parent / "data/geography-maps.json").read_text())
SEA_FILL = "#dbeafe"
NEIGHBOUR = "#eef2f7"
RIVER = "#2563eb"


class Proj:
    """Equirectangular projection of a lon/lat box into a pixel frame, keeping the aspect ratio."""

    def __init__(self, box, x0, y0, w, h):
        lon0, lat0, lon1, lat1 = box
        self.c = math.cos(math.radians((lat0 + lat1) / 2))
        self.k = min(w / ((lon1 - lon0) * self.c), h / (lat1 - lat0))
        self.cx, self.cy = x0 + w / 2, y0 + h / 2
        self.lonc, self.latc = (lon0 + lon1) / 2, (lat0 + lat1) / 2

    def __call__(self, lon, lat):
        return self.cx + (lon - self.lonc) * self.c * self.k, self.cy - (lat - self.latc) * self.k


def ring_d(P, ring, close=True):
    pts = [P(x, y) for x, y in ring]
    return "M " + " L ".join(f"{x:.1f} {y:.1f}" for x, y in pts) + (" Z" if close else "")


def country(s, P, rings, fill, stroke="#64748b", width=1.2):
    s.path(" ".join(ring_d(P, r) for r in rings), color=stroke, width=width, fill=fill)


def town(s, P, lon, lat, name, dx=8, dy=0, anchor="start", size=14, capital=False, color=INK):
    x, y = P(lon, lat)
    if capital:
        s.circle(x, y, 7, fill="#ffffff", stroke=RED, width=3)
        s.circle(x, y, 2.5, fill=RED, stroke=RED, width=1)
    else:
        s.circle(x, y, 4.5, fill=INK, stroke="#ffffff", width=1.5)
    s.label(x + dx, y + dy, name, size=size, anchor=anchor, weight="bold" if capital else "normal", color=color, pad=3)


def graticule(s, P, lons, lats, box, fmt_lon, fmt_lat, size=12):
    lon0, lat0, lon1, lat1 = box
    for lo in lons:
        x1, y1 = P(lo, lat0); x2, y2 = P(lo, lat1)
        s.line(x1, y1, x2, y2, color="#94a3b8", width=0.8, dash="4 5")
        s.label(x2, y2 + 14, fmt_lon(lo), size=size, color=MUTED, pad=2)
    for la in lats:
        x1, y1 = P(lon0, la); x2, y2 = P(lon1, la)
        s.line(x1, y1, x2, y2, color="#94a3b8", width=0.8, dash="4 5")
        s.label(x1 + 6, y1, fmt_lat(la), size=size, color=MUTED, anchor="start", pad=2)


def north_arrow(s, x, y):
    s.polygon([(x, y - 26), (x - 10, y + 6), (x, y), (x + 10, y + 6)], fill=INK, stroke=INK, width=1)
    s.text(x, y - 38, "N", size=16, weight="bold")


def scale_bar(s, P, lon, lat, km, label):
    x1, y1 = P(lon, lat)
    x2, _ = P(lon + km / (111.32 * math.cos(math.radians(lat))), lat)
    s.rect(x1, y1 - 4, (x2 - x1) / 2, 8, fill=INK, stroke=INK, width=1)
    s.rect(x1 + (x2 - x1) / 2, y1 - 4, (x2 - x1) / 2, 8, fill="#ffffff", stroke=INK, width=1)
    s.text(x1, y1 + 18, "0", size=12, color=INK)
    s.text(x2, y1 + 18, label, size=12, color=INK)


SL_BOX = (-13.75, 6.75, -10.1, 10.15)
SL_TOWNS = [(-13.23, 8.48, "Freetown"), (-11.74, 7.96, "Bo"), (-11.19, 7.88, "Kenema"), (-12.05, 8.88, "Makeni"),
            (-10.97, 8.64, "Koidu"), (-12.79, 8.77, "Port Loko"), (-11.55, 9.59, "Kabala"), (-10.57, 8.28, "Kailahun"),
            (-12.50, 7.53, "Bonthe"), (-12.43, 8.16, "Moyamba"), (-12.92, 9.12, "Kambia"), (-11.72, 7.35, "Pujehun")]


def sl_base(s, P, fill="#fef9c3"):
    s.rect(0, 0, s.w, s.h, fill=SEA_FILL, stroke="none", width=0, rx=20)
    for n in ("Guinea", "Liberia"):
        country(s, P, MAPS["sl_countries"][n], NEIGHBOUR)
    country(s, P, MAPS["sl_countries"]["Sierra Leone"], fill, stroke=INK, width=2)
    graticule(s, P, [-13, -12, -11], [7, 8, 9, 10], SL_BOX, lambda v: f"{-v}°W", lambda v: f"{v}°N")
    gx, gy = P(-12.2, 9.95)
    s.text(gx, gy, "GUINEA", size=18, weight="bold", color=MUTED)
    lx, ly = P(-10.55, 7.05)
    s.text(lx, ly, "LIBERIA", size=18, weight="bold", color=MUTED)
    ox, oy = P(-13.15, 7.35)
    s.text(ox, oy, "ATLANTIC", size=17, weight="bold", color="#1d4ed8", italic=True)
    s.text(ox, oy + 22, "OCEAN", size=17, weight="bold", color="#1d4ed8", italic=True)


@fig
def sierra_leone_map():
    s = Svg(800, 760, "Map of Sierra Leone: location, neighbours, towns and highlands",
            "Sierra Leone lies on the Atlantic coast of West Africa between about 7°N and 10°N and 10°W and 13°W. Guinea "
            "borders it to the north and east and Liberia to the south-east. The map shows Freetown, the regional cities "
            "Bo, Kenema, Makeni and Port Loko, other towns, the Freetown Peninsula, Sherbro Island, the Loma Mountains "
            "with Bintumani, the Tingi Hills and the Gola Forest.")
    P = Proj(SL_BOX, 10, 10, 780, 740)
    sl_base(s, P)
    for lon, lat, n, col in [(-11.12, 9.17, "Bintumani 1,945 m", BROWN), (-10.78, 8.92, "Tingi Hills", BROWN)]:
        x, y = P(lon, lat)
        s.polygon([(x, y - 11), (x - 10, y + 7), (x + 10, y + 7)], fill=BROWN, stroke=INK, width=1)
        s.label(x + 14, y - 2, n, size=14, anchor="start", color=col, weight="bold", pad=3)
    lx, ly = P(-11.35, 9.32)
    s.text(lx, ly - 4, "Loma Mountains", size=14, color=BROWN, italic=True)
    for lon, lat, n, anchor, dx in [(-13.2, 8.3, "Freetown Peninsula", "end", -6), (-12.75, 7.47, "Sherbro Island", "end", -10)]:
        x, y = P(lon, lat)
        s.label(x + dx, y, n, size=13, anchor=anchor, color="#065f46", italic=True, pad=3)
    gx, gy = P(-10.85, 7.45)
    s.label(gx, gy, "Gola Forest", size=13, color="#065f46", italic=True, pad=3)
    for lon, lat, n in SL_TOWNS:
        cap = n == "Freetown"
        dx, anchor = (10, "start")
        if n in ("Kailahun", "Koidu"):
            dx, anchor = (-10, "end")
        town(s, P, lon, lat, n, dx=dx, anchor=anchor, capital=cap, size=15 if cap else 14)
    north_arrow(s, 740, 80)
    scale_bar(s, P, -13.6, 6.95, 100, "100 km")
    return s


@fig
def sierra_leone_resources_map():
    s = Svg(800, 760, "Map of Sierra Leone's main mineral and economic resources",
            "Sketch map of Sierra Leone showing diamonds in Kono and around Tongo, iron ore at Tonkolili and Marampa with "
            "the railway to the port of Pepel, rutile in Moyamba and Bonthe districts, bauxite at Mokanji, gold at "
            "Baomahun, the Bumbuna hydroelectric dam, the port of Freetown, the cocoa and coffee belt in the east and "
            "the main rice and oil palm areas. Positions are approximate.")
    P = Proj(SL_BOX, 10, 10, 780, 740)
    sl_base(s, P, fill="#fefce8")
    # cash-crop and farming zones (labels only; areas are broad)
    for lon, lat, t, col in [(-10.75, 8.05, "cocoa and coffee", "#7c2d12"), (-12.05, 7.45, "oil palm", "#166534"),
                             (-12.4, 9.45, "swamp rice (bolilands)", "#166534")]:
        x, y = P(lon, lat)
        s.text(x, y, t, size=14, italic=True, color=col, weight="bold")
    rail = [P(-11.5, 9.1), P(-11.9, 9.0), P(-12.35, 8.82), P(-12.75, 8.7), P(-13.05, 8.59)]
    s.polyline(rail, color=INK, width=3, dash="8 5")
    for lon, lat in [(-12.48, 8.69)]:
        pass
    sym = {
        "diamond": lambda x, y: s.polygon([(x, y - 11), (x + 9, y), (x, y + 11), (x - 9, y)], fill="#38bdf8", stroke=INK, width=1.5),
        "iron": lambda x, y: s.rect(x - 8, y - 8, 16, 16, fill="#7f1d1d", stroke=INK, width=1.5),
        "rutile": lambda x, y: s.circle(x, y, 8, fill="#a3a3a3", stroke=INK, width=1.5),
        "bauxite": lambda x, y: s.polygon([(x, y - 10), (x - 9, y + 7), (x + 9, y + 7)], fill="#f97316", stroke=INK, width=1.5),
        "gold": lambda x, y: s.circle(x, y, 8, fill="#facc15", stroke=INK, width=1.5),
        "hep": lambda x, y: s.rect(x - 9, y - 6, 18, 12, fill=RIVER, stroke=INK, width=1.5),
        "port": lambda x, y: s.circle(x, y, 7, fill="#ffffff", stroke=BLUE, width=3),
    }
    items = [("diamond", -10.95, 8.68, "Kono diamonds", "end", -14), ("diamond", -11.07, 8.22, "Tongo diamonds", "start", 14),
             ("iron", -11.5, 9.1, "Tonkolili iron ore", "start", 14), ("iron", -12.48, 8.69, "Marampa iron ore", "start", 12),
             ("rutile", -12.25, 7.7, "rutile", "start", 13), ("bauxite", -12.2, 7.97, "Mokanji bauxite", "end", -13),
             ("gold", -11.5, 8.25, "Baomahun gold", "end", -13), ("hep", -11.74, 9.04, "Bumbuna HEP", "end", -14),
             ("port", -13.05, 8.59, "Pepel", "start", 11), ("port", -13.23, 8.48, "Freetown", "end", -12)]
    for kind, lon, lat, name, anchor, dx in items:
        x, y = P(lon, lat)
        sym[kind](x, y)
        s.label(x + dx, y, name, size=14, anchor=anchor, weight="bold", pad=3)
    for lon, lat, n in [(-11.74, 7.96, "Bo"), (-11.19, 7.88, "Kenema"), (-12.05, 8.88, "Makeni")]:
        town(s, P, lon, lat, n, size=13)
    # key (over Guinea, top right)
    kx, ky = 560, 52
    s.rect(kx - 14, ky - 22, 236, 150, fill="#ffffff", stroke="#94a3b8", width=1.2, rx=10)
    rows = [("diamond", "diamonds"), ("iron", "iron ore"), ("rutile", "rutile"), ("bauxite", "bauxite"), ("gold", "gold"),
            ("hep", "hydroelectric dam")]
    for i, (k, t) in enumerate(rows):
        x = kx + (i % 2) * 112 + 6
        y = ky + (i // 2) * 30
        sym[k](x, y)
        s.text(x + 16, y, t, size=13, anchor="start")
    s.line(kx, ky + 96, kx + 30, ky + 96, color=INK, width=3, dash="8 5")
    s.text(kx + 38, ky + 96, "iron-ore railway", size=13, anchor="start")
    north_arrow(s, 46, 110)
    scale_bar(s, P, -13.6, 6.95, 100, "100 km")
    return s


WA_BOX = (-21.5, 2.0, 16.0, 25.5)
WEST_AFRICA = ["Mauritania", "Senegal", "Gambia", "Guinea-Bissau", "Guinea", "Sierra Leone", "Liberia", "Côte d'Ivoire",
               "Mali", "Burkina Faso", "Ghana", "Togo", "Benin", "Niger", "Nigeria"]
ECOWAS_NOW = ["Senegal", "Gambia", "Guinea-Bissau", "Guinea", "Sierra Leone", "Liberia", "Côte d'Ivoire", "Ghana", "Togo",
              "Benin", "Nigeria"]
AES = ["Mali", "Burkina Faso", "Niger"]


def wa_base(s, P, fills):
    s.rect(0, 0, s.w, s.h, fill=SEA_FILL, stroke="none", width=0, rx=20)
    for n, rings in MAPS["wa_countries"].items():
        if n == "Cabo Verde":
            continue
        country(s, P, rings, fills.get(n, NEIGHBOUR), stroke="#64748b", width=1.1)
    for r in MAPS["wa_lakes"]:
        s.path(ring_d(P, r), color=RIVER, width=1, fill="#93c5fd")


WA_LABELS = {  # name: (lon, lat, label, leader-to or None)
    "Mauritania": (-10.5, 20.6, "MAURITANIA", None), "Mali": (-3.0, 18.0, "MALI", None),
    "Niger": (9.5, 17.8, "NIGER", None), "Senegal": (-14.6, 15.2, "SENEGAL", None),
    "Gambia": (-21.2, 13.6, "THE GAMBIA", (-15.6, 13.45)), "Guinea-Bissau": (-21.2, 11.6, "GUINEA-BISSAU", (-15.0, 12.0)),
    "Guinea": (-11.0, 10.9, "GUINEA", None), "Sierra Leone": (-21.2, 8.3, "SIERRA LEONE", (-12.2, 8.6)),
    "Liberia": (-13.0, 5.3, "LIBERIA", (-9.6, 6.6)), "Côte d'Ivoire": (-5.6, 8.0, "CÔTE D'IVOIRE", None),
    "Burkina Faso": (-1.7, 12.4, "BURKINA FASO", None), "Ghana": (-1.2, 7.6, "GHANA", None),
    "Togo": (-0.6, 3.9, "TOGO", (1.0, 7.5)), "Benin": (3.2, 3.6, "BENIN", (2.3, 8.0)),
    "Nigeria": (8.3, 9.7, "NIGERIA", None),
}


def wa_labels(s, P, size=13):
    for n, (lon, lat, t, lead) in WA_LABELS.items():
        x, y = P(lon, lat)
        if lead:
            lx, ly = P(*lead)
            left = lon < -20
            s.line(x + (len(t) * size * 0.6 if left else 0), y, lx, ly, color=INK, width=1.1)
            s.circle(lx, ly, 2.5, fill=INK, stroke=INK, width=1)
            s.label(x, y, t, size=size, weight="bold", pad=3, anchor="start" if left else "middle")
        else:
            s.text(x, y, t, size=size, weight="bold")


@fig
def west_africa_map():
    s = Svg(800, 600, "Map of West Africa: countries, rivers and lakes",
            "The sixteen countries of West Africa (Mauritania, Senegal, The Gambia, Guinea-Bissau, Guinea, Sierra Leone, "
            "Liberia, Côte d'Ivoire, Mali, Burkina Faso, Ghana, Togo, Benin, Niger, Nigeria and the island state of Cabo "
            "Verde), with the Rivers Niger, Benue, Volta and Senegal, Lake Volta, Kainji Lake and Lake Chad, the Atlantic "
            "Ocean and the Gulf of Guinea.")
    P = Proj(WA_BOX, 6, 6, 788, 588)
    wa_base(s, P, {n: "#fef9c3" if n != "Sierra Leone" else "#bbf7d0" for n in WEST_AFRICA})
    for r in MAPS["wa_rivers"]:
        s.path(ring_d(P, r, close=False), color=RIVER, width=2.2)
    wa_labels(s, P)
    for lon, lat, t in [(-1.5, 16.9, "R. Niger"), (10.8, 8.0, "R. Benue"), (-12.9, 16.6, "R. Senegal"), (-0.4, 10.4, "R. Volta"),
                        (0.6, 7.0, "L. Volta"), (14.0, 13.6, "L. Chad")]:
        x, y = P(lon, lat)
        s.label(x, y, t, size=12, color=RIVER, italic=True, weight="bold", pad=2)
    x, y = P(-19.5, 17.5)
    s.text(x, y, "ATLANTIC", size=16, italic=True, weight="bold", color="#1d4ed8")
    s.text(x, y + 20, "OCEAN", size=16, italic=True, weight="bold", color="#1d4ed8")
    x, y = P(4.5, 2.9)
    s.text(x, y, "Gulf of Guinea", size=15, italic=True, weight="bold", color="#1d4ed8")
    x, y = P(-21.0, 23.3)
    s.label(x, y, "← Cabo Verde (islands, about 600 km west)", size=12, anchor="start", color=INK, pad=3)
    return s


@fig
def ecowas_map():
    s = Svg(800, 690, "Map of ECOWAS member states",
            "ECOWAS member states in West Africa: Benin, Cabo Verde, Côte d'Ivoire, The Gambia, Ghana, Guinea, "
            "Guinea-Bissau, Liberia, Nigeria, Senegal, Sierra Leone and Togo. Mali, Burkina Faso and Niger left ECOWAS in "
            "January 2025 and formed the Alliance of Sahel States; Mauritania left in 2000. The ECOWAS Commission is in Abuja.")
    P = Proj(WA_BOX, 6, 6, 788, 588)
    fills = {n: F_GREEN for n in ECOWAS_NOW}
    fills.update({n: "#fed7aa" for n in AES})
    fills["Mauritania"] = "#e5e7eb"
    wa_base(s, P, fills)
    wa_labels(s, P)
    x, y = P(7.4, 9.06)
    s.polygon([(x + 9 * math.cos(math.radians(a)) * (1 if k % 2 == 0 else 0.45),
                y - 9 * math.sin(math.radians(a)) * (1 if k % 2 == 0 else 0.45)) for k, a in enumerate(range(90, 450, 36))],
              fill=RED, stroke=INK, width=1)
    s.label(x + 12, y + 14, "Abuja (HQ)", size=13, anchor="start", weight="bold", color=RED, pad=3)
    x, y = P(-21.0, 23.3)
    s.label(x, y, "← Cabo Verde (member, islands)", size=12, anchor="start", color=INK, pad=3)
    s.rect(10, 600, 780, 80, fill="#ffffff", stroke="#94a3b8", width=1.2, rx=12)
    for i, (col, t, kx, ky) in enumerate([(F_GREEN, "ECOWAS member (12, with Cabo Verde)", 30, 625),
                                          ("#fed7aa", "left in January 2025 (Alliance of Sahel States)", 30, 657),
                                          ("#e5e7eb", "Mauritania: left in 2000", 470, 625)]):
        s.rect(kx, ky - 9, 26, 18, fill=col, stroke="#64748b", width=1.2)
        s.text(kx + 36, ky, t, size=15, anchor="start")
    return s


AF_BOX = (-19.0, -36.0, 53.0, 38.5)


@fig
def africa_physical_map():
    s = Svg(800, 800, "Physical map of Africa: rivers, lakes, deserts and highlands",
            "Outline of Africa showing the Equator and the Tropics, the Rivers Nile, Congo, Niger, Zambezi and Orange, "
            "Lakes Victoria, Tanganyika, Malawi and Chad, the Sahara, Kalahari and Namib deserts, the Atlas Mountains, the "
            "Ethiopian Highlands, Mount Kilimanjaro and the Drakensberg, and the surrounding seas and oceans.")
    P = Proj(AF_BOX, 40, 40, 720, 740)
    s.rect(0, 0, s.w, s.h, fill=SEA_FILL, stroke="none", width=0, rx=20)
    for rings in MAPS["af_countries"].values():
        country(s, P, rings, "#fef3c7", stroke="#cbd5e1", width=0.8)
    for r in MAPS["af_lakes"]:
        s.path(ring_d(P, r), color=RIVER, width=1, fill="#93c5fd")
    for r in MAPS["af_rivers"]:
        s.path(ring_d(P, r, close=False), color=RIVER, width=1.8)
    for lat, t in [(0, "Equator 0°"), (23.44, "Tropic of Cancer 23½°N"), (-23.44, "Tropic of Capricorn 23½°S")]:
        x1, y = P(AF_BOX[0], lat); x2, _ = P(AF_BOX[2], lat)
        s.line(x1, y, x2, y, color=RED if lat == 0 else ORANGE, width=1.3, dash="7 5")
        s.label(x2 - 6, y - 12, t, size=12, anchor="end", color=RED if lat == 0 else ORANGE, pad=2)
    for lon, lat, t, sz in [(8, 24, "S A H A R A", 22), (22, -23, "KALAHARI", 15), (14.2, -22.0, "NAMIB", 12)]:
        x, y = P(lon, lat)
        s.text(x, y, t, size=sz, weight="bold", color="#92400e")
    for lon, lat, t, anchor in [(-3.5, 32.3, "Atlas Mts", "middle"), (39.0, 10.5, "Ethiopian Highlands", "middle"),
                                (37.35, -3.07, "Kilimanjaro 5,895 m", "start"), (29.5, -29.5, "Drakensberg", "start")]:
        x, y = P(lon, lat)
        s.polygon([(x, y - 9), (x - 8, y + 6), (x + 8, y + 6)], fill=BROWN, stroke=INK, width=1)
        s.label(x + (12 if anchor == "start" else 0), y + (0 if anchor == "start" else 18), t, size=12, anchor=anchor,
                color=BROWN, weight="bold", pad=2)
    for lon, lat, t in [(31.0, 21.0, "R. Nile"), (19.5, 1.8, "R. Congo"), (-1.0, 15.6, "R. Niger"), (28.5, -15.0, "R. Zambezi"),
                        (19.0, -27.4, "R. Orange"), (33.0, -1.0, "L. Victoria"), (25.7, -6.5, "L. Tanganyika"),
                        (36.7, -12.4, "L. Malawi"), (14.0, 14.5, "L. Chad")]:
        x, y = P(lon, lat)
        s.label(x, y, t, size=12, color=RIVER, italic=True, weight="bold", pad=2)
    for lon, lat, t in [(-12, 0, "ATLANTIC OCEAN"), (60 - 13, -12, "INDIAN"), (60 - 13, -14.5, "OCEAN"),
                        (18, 35.8, "Mediterranean Sea"), (39.5, 20.0, "Red Sea")]:
        x, y = P(lon, lat)
        s.text(x, y, t, size=14, italic=True, weight="bold", color="#1d4ed8")
    x, y = P(46.8, -19.5)
    s.label(x, y, "Madagascar", size=12, pad=2)
    return s


@fig
def sierra_leone_relief_section():
    s = Svg(800, 430, "Relief regions of Sierra Leone: a west–east cross-section",
            "A simplified cross-section from the Atlantic Ocean eastwards across Sierra Leone: the mountains of the Freetown "
            "Peninsula (Picket Hill, 888 m), the low coastal plain with swamps and estuaries, the interior lowland plains "
            "with isolated hills, the plateau of the north and east, and the Loma Mountains, where Bintumani (1,945 m) is "
            "the highest point in Sierra Leone. Not to scale.")
    heading(s, "From the coast to the mountains (west → east, not to scale)")
    base = 340
    prof = [(20, base), (60, base), (75, 250), (95, 170), (115, 230), (135, base - 5), (150, base), (170, base - 8),
            (260, base - 15), (300, base - 30), (340, base - 45), (380, base - 40), (400, base - 90), (420, base - 45),
            (470, base - 60), (510, base - 120), (580, base - 135), (620, base - 140), (650, base - 150), (690, base - 230),
            (715, 70), (740, base - 210), (770, base - 160), (780, base - 160)]
    s.rect(20, base - 4, 40, 16, fill=SEA, stroke="none", width=0)
    s.polygon(prof + [(780, 352), (20, 352)], fill=LAND, stroke=INK, width=2.5)
    s.rect(135, base - 4, 18, 8, fill=SEA, stroke="none", width=0)
    regions = [(95, "Freetown", "Peninsula", "Picket Hill 888 m"), (215, "coastal plain", "swamps, estuaries", "below about 50 m"),
               (350, "interior", "lowland plains", "with isolated hills"), (560, "plateau", "300–600 m", "north and east"),
               (715, "Loma Mts", "Bintumani", "1,945 m")]
    for x, a, b, c in regions:
        s.text(x, 374, a, size=15, weight="bold", color=INK)
        s.text(x, 394, b, size=14, color=INK)
        s.text(x, 413, c, size=13, color=MUTED)
    s.text(40, base - 16, "sea", size=13, color="#1e3a8a", weight="bold")
    s.label(95, 150, "▲", size=14, color=BROWN, pad=1)
    s.label(715, 52, "▲ highest point", size=13, color=BROWN, weight="bold", pad=2)
    return s


@fig
def itcz_west_africa():
    s = Svg(800, 600, "The ITCZ over West Africa in January and July",
            "Map of West Africa showing the approximate position of the Inter-Tropical Convergence Zone near the coast, "
            "about 5–8°N, in January and far inland, about 18–20°N, in July. South of the ITCZ the moist south-west monsoon "
            "blows in from the Atlantic, bringing rain; north of it the dry north-east trade wind (harmattan) blows from "
            "the Sahara.")
    P = Proj(WA_BOX, 6, 6, 788, 588)
    wa_base(s, P, {n: "#fefce8" for n in WEST_AFRICA})
    def zone(lat_w, lat_e, col, label, ly):
        pts = [P(lon, lat_w + (lat_e - lat_w) * (lon - WA_BOX[0]) / (WA_BOX[2] - WA_BOX[0])) for lon in range(-21, 17)]
        s.polyline(pts, color=col, width=5, dash="14 8")
        x, y = P(9.5, ly)
        s.label(x, y, label, size=15, color=col, weight="bold", pad=4)
    zone(19.0, 20.5, BLUE, "ITCZ in July (about 18–20°N)", 18.0)
    zone(6.5, 7.5, ORANGE, "ITCZ in January (about 5–8°N)", 5.2)
    for lon, lat in [(-15, 9.5), (-6, 11.5), (3, 13.5)]:
        x, y = P(lon, lat)
        s.arrow(x - 26, y + 26, x + 18, y - 18, color=BLUE, width=4)
    x, y = P(-8.5, 14.2)
    s.label(x, y, "moist south-west monsoon (July)", size=14, color=BLUE, weight="bold", pad=3)
    for lon, lat in [(-2, 23.5), (6, 23.8), (13, 23.0)]:
        x, y = P(lon, lat)
        s.arrow(x + 22, y - 22, x - 18, y + 18, color=ORANGE, width=4)
    x, y = P(-4.0, 9.5)
    s.label(x, y, "dry NE trades / harmattan (January)", size=14, color=ORANGE, weight="bold", pad=3)
    x, y = P(-19.5, 4.5)
    s.text(x, y, "ATLANTIC", size=15, italic=True, weight="bold", color="#1d4ed8", anchor="start")
    x, y = P(-12.0, 23.5)
    s.text(x, y, "SAHARA", size=16, weight="bold", color="#92400e")
    return s


@fig
def africa_climate_belts():
    s = Svg(800, 520, "Climate and vegetation belts of Africa on either side of the Equator",
            "A simplified north–south diagram of Africa's climate and vegetation belts: Mediterranean at the northern and "
            "southern tips, hot deserts near the tropics (Sahara in the north, Kalahari and Namib in the south), savanna on "
            "either side of the equatorial belt, and equatorial rainforest around the Equator. Highlands in East Africa are "
            "cooler than their latitude suggests.")
    heading(s, "Belts repeat north and south of the Equator (simplified)")
    belts = [("Mediterranean", "hot dry summer, mild wet winter", "evergreen shrubs, olives", "#c7d2fe", "about 30–37°N"),
             ("Hot desert (Sahara)", "very dry; hot days, cold nights", "little or none", "#fde68a", "about 15–30°N"),
             ("Savanna (wet-and-dry)", "summer rain, winter drought", "grassland with trees", "#d9f99d", "about 5–15°N"),
             ("Equatorial", "hot and wet all year", "tropical rainforest", "#86efac", "about 5°N–5°S"),
             ("Savanna (wet-and-dry)", "summer rain, winter drought", "grassland with trees", "#d9f99d", "about 5–20°S"),
             ("Desert (Kalahari, Namib)", "very dry", "scrub, little vegetation", "#fde68a", "about 20–30°S"),
             ("Mediterranean (Cape)", "hot dry summer, mild wet winter", "evergreen shrubs", "#c7d2fe", "about 33–35°S")]
    top, h = 60, 62
    for i, (name, clim, veg, col, lat) in enumerate(belts):
        y = top + i * h
        s.rect(40, y, 720, h - 6, fill=col, stroke="#64748b", width=1.2, rx=8)
        s.text(60, y + (h - 6) / 2 - 9, name, size=16, weight="bold", anchor="start")
        s.text(60, y + (h - 6) / 2 + 12, lat, size=13, color=MUTED, anchor="start")
        s.text(330, y + (h - 6) / 2 - 9, clim, size=14, anchor="start")
        s.text(330, y + (h - 6) / 2 + 12, veg, size=14, color="#166534", anchor="start", italic=True)
    ey = top + 3 * h + (h - 6) / 2
    s.line(20, ey, 780, ey, color=RED, width=2, dash="8 5")
    s.label(700, ey + 22, "Equator", size=14, color=RED, weight="bold", pad=3)
    return s


MRU = ["Guinea", "Sierra Leone", "Liberia", "Côte d'Ivoire"]


@fig
def mano_river_union_map():
    s = Svg(800, 560, "Map of the Mano River Union",
            "The Mano River Union countries, Sierra Leone, Liberia, Guinea and Côte d'Ivoire, highlighted in south-western "
            "West Africa, with the union's headquarters at Freetown and the Mano River on the Sierra Leone–Liberia border.")
    box = (-16.5, 3.8, -1.5, 13.5)
    P = Proj(box, 6, 6, 788, 548)
    s.rect(0, 0, s.w, s.h, fill=SEA_FILL, stroke="none", width=0, rx=20)
    fills = {"Sierra Leone": "#86efac", "Liberia": "#bbf7d0", "Guinea": "#bbf7d0", "Côte d'Ivoire": "#bbf7d0"}
    for n, rings in MAPS["wa_countries"].items():
        if n == "Cabo Verde":
            continue
        country(s, P, rings, fills.get(n, NEIGHBOUR), stroke="#64748b", width=1.2)
    for lon, lat, t, sz in [(-11.2, 10.9, "GUINEA", 17), (-12.0, 8.6, "SIERRA LEONE", 13), (-9.5, 6.5, "LIBERIA", 15),
                            (-5.5, 7.6, "CÔTE D'IVOIRE", 16), (-14.6, 12.9, "SENEGAL", 13), (-4.5, 12.6, "MALI", 15),
                            (-1.9, 11.2, "BURKINA", 12), (-15.0, 12.0, "G.-BISSAU", 11)]:
        x, y = P(lon, lat)
        s.text(x, y, t, size=sz, weight="bold", color=INK if t not in ("SENEGAL", "MALI", "BURKINA", "G.-BISSAU") else MUTED)
    x, y = P(-13.23, 8.48)
    s.circle(x, y, 8, fill="#ffffff", stroke=RED, width=3)
    s.circle(x, y, 3, fill=RED, stroke=RED, width=1)
    s.label(x - 12, y + 18, "Freetown (MRU HQ)", size=14, anchor="end", weight="bold", color=RED, pad=3)
    x, y = P(-11.3, 7.0)
    s.label(x - 6, y + 22, "Mano River", size=13, anchor="end", italic=True, color=RIVER, weight="bold", pad=3)
    x, y = P(-14.8, 5.5)
    s.text(x, y, "ATLANTIC OCEAN", size=16, italic=True, weight="bold", color="#1d4ed8")
    s.rect(500, 470, 280, 70, fill="#ffffff", stroke="#94a3b8", width=1.2, rx=10)
    s.text(516, 492, "Founded 1973: Sierra Leone, Liberia", size=13, anchor="start")
    s.text(516, 512, "Guinea joined 1980", size=13, anchor="start")
    s.text(516, 530, "Côte d'Ivoire joined 2008", size=13, anchor="start")
    return s


# ═══ G4: practical geography ═════════════════════════════════════════════════

CONTOUR = "#a16207"


@fig
def grid_reference():
    s = Svg(800, 520, "Four-figure and six-figure grid references",
            "A map grid with eastings 21 to 25 along the bottom and northings 46 to 49 up the side. The shaded square has "
            "the four-figure reference 2247, given by the easting and northing of its bottom left corner. Point A, a church, "
            "lies four-tenths of the way across and seven-tenths of the way up that square, so its six-figure reference is "
            "224477. Eastings are always given before northings.")
    heading(s, "Read eastings first (along the corridor), then northings (up the stairs)")
    x0, y0, sq = 140, 430, 110
    s.rect(x0 + sq, y0 - 2 * sq, sq, sq, fill="#fef3c7", stroke="none", width=0)
    for i in range(5):
        s.line(x0 + i * sq, y0, x0 + i * sq, y0 - 3 * sq, color=BLUE, width=1.6)
        s.text(x0 + i * sq, y0 + 22, str(21 + i), size=17, weight="bold", color=BLUE)
    for j in range(4):
        s.line(x0, y0 - j * sq, x0 + 4 * sq, y0 - j * sq, color=BLUE, width=1.6)
        s.text(x0 - 24, y0 - j * sq, str(46 + j), size=17, weight="bold", color=BLUE)
    for k in range(1, 10):
        s.line(x0 + sq + k * sq / 10, y0 - sq, x0 + sq + k * sq / 10, y0 - sq - (10 if k != 5 else 16), color=MUTED, width=1)
        s.line(x0 + sq, y0 - sq - k * sq / 10, x0 + sq + (10 if k != 5 else 16), y0 - sq - k * sq / 10, color=MUTED, width=1)
    ax, ay = x0 + sq + 0.4 * sq, y0 - sq - 0.7 * sq
    s.rect(ax - 7, ay - 2, 14, 14, fill=INK, stroke=INK, width=1)
    s.line(ax, ay - 2, ax, ay - 16, color=INK, width=2.5)
    s.line(ax - 6, ay - 10, ax + 6, ay - 10, color=INK, width=2.5)
    s.label(ax + 30, ay + 4, "A (church)", size=15, anchor="start", weight="bold", pad=3)
    s.text(x0 + 2 * sq, y0 + 50, "eastings →", size=15, color=BLUE, weight="bold")
    s.text(x0 - 60, y0 - 3 * sq - 20, "northings ↑", size=15, color=BLUE, weight="bold", anchor="start")
    bx = 640
    s.rect(bx - 20, 120, 170, 200, fill="#ffffff", stroke="#94a3b8", width=1.2, rx=10)
    s.text(bx + 65, 145, "Shaded square", size=15, weight="bold")
    s.text(bx + 65, 170, "4-figure: 2247", size=16, color=ORANGE, weight="bold")
    s.text(bx + 65, 215, "Point A", size=15, weight="bold")
    s.text(bx + 65, 240, "22 + 4 tenths", size=14)
    s.text(bx + 65, 260, "47 + 7 tenths", size=14)
    s.text(bx + 65, 292, "6-figure: 224477", size=16, color=RED, weight="bold")
    return s


def _panel_title(s, x, y, t):
    s.text(x, y, t, size=16, weight="bold", color=INK)


@fig
def contour_landforms():
    s = Svg(800, 560, "Contour patterns of common landforms",
            "Six contour patterns: a conical hill shown by roughly circular contours with the highest in the middle; a spur, "
            "whose V-shaped contours point towards lower ground; a valley, whose V-shaped contours point upstream towards "
            "higher ground with a river along the V; an escarpment with closely spaced contours on the steep scarp slope and "
            "widely spaced contours on the gentle dip slope; a plateau with close contours at its edges and a large flat top; "
            "and a saddle, a low col between two hills. Heights are in metres.")
    heading(s, "Reading landforms from contours (heights in metres)")
    cells = [(140, 160), (400, 160), (660, 160), (140, 400), (400, 400), (660, 400)]

    def lab(x, y, t):
        s.label(x, y, t, size=12, color=CONTOUR, weight="bold", pad=2)

    # conical hill
    cx, cy = cells[0]
    _panel_title(s, cx, cy - 100, "Conical hill")
    for r, h in [(80, "100"), (58, "200"), (38, "300"), (18, "400")]:
        s.circle(cx, cy + 10, r, stroke=CONTOUR, width=2)
        lab(cx + r * 0.71, cy + 10 - r * 0.71, h)
    s.text(cx, cy + 10, "▲", size=12, color=BROWN)
    # spur
    cx, cy = cells[1]
    _panel_title(s, cx, cy - 100, "Spur (V points downhill)")
    for k, h in enumerate(["300", "200", "100"]):
        yb = cy - 50 + k * 40
        s.polyline([(cx - 110, yb), (cx, yb + 50), (cx + 110, yb)], color=CONTOUR, width=2)
        lab(cx + 92, yb + 4, h)
    s.text(cx, cy - 78, "high", size=13, color=MUTED)
    s.text(cx, cy + 92, "low", size=13, color=MUTED)
    # valley
    cx, cy = cells[2]
    _panel_title(s, cx, cy - 100, "Valley (V points uphill)")
    for k, h in enumerate(["300", "200", "100"]):
        yb = cy - 10 + k * 40
        s.polyline([(cx - 110, yb), (cx, yb - 50), (cx + 110, yb)], color=CONTOUR, width=2)
        lab(cx + 92, yb - 4, h)
    s.path(f"M {cx} {cy - 58} Q {cx + 6} {cy + 20} {cx - 4} {cy + 90}", color=RIVER, width=3)
    s.text(cx - 34, cy - 74, "high", size=13, color=MUTED)
    s.label(cx + 22, cy + 70, "river", size=12, color=RIVER, italic=True, pad=2)
    # escarpment
    cx, cy = cells[3]
    _panel_title(s, cx, cy - 100, "Escarpment")
    for k, (x, h) in enumerate([(cx - 100, "100"), (cx - 82, "200"), (cx - 64, "300"), (cx - 10, "300"), (cx + 45, "200"), (cx + 100, "100")]):
        s.path(f"M {x} {cy - 80} Q {x + 6} {cy} {x} {cy + 80}", color=CONTOUR, width=2)
        lab(x + 3, cy + 90 if k % 2 == 0 else cy - 86, h)
    s.text(cx - 86, cy + 112, "steep scarp", size=12, color=MUTED)
    s.text(cx + 60, cy + 112, "gentle dip slope", size=12, color=MUTED)
    # plateau
    cx, cy = cells[4]
    _panel_title(s, cx, cy - 100, "Plateau")
    for d, h in [(0, "100"), (12, "200"), (24, "300")]:
        s.rect(cx - 110 + d, cy - 75 + d, 220 - 2 * d, 150 - 2 * d, fill="none", stroke=CONTOUR, width=2, rx=40 - d)
        lab(cx - 110 + d + 6, cy, h) if False else None
    lab(cx - 104, cy + 30, "100")
    lab(cx - 92, cy, "200")
    lab(cx - 80, cy - 30, "300")
    s.text(cx + 10, cy, "large flat top", size=13, color=MUTED, italic=True)
    # saddle
    cx, cy = cells[5]
    _panel_title(s, cx, cy - 100, "Saddle (col) between hills")
    s.ellipse(cx, cy, 115, 62, stroke=CONTOUR, width=2)
    lab(cx, cy - 62, "100")
    for hx in (cx - 55, cx + 55):
        s.circle(hx, cy, 40, stroke=CONTOUR, width=2)
        s.circle(hx, cy, 18, stroke=CONTOUR, width=2)
        lab(hx, cy - 40, "200")
        lab(hx, cy, "300")
    s.label(cx, cy + 32, "col", size=13, weight="bold", color=RED, pad=2)
    return s


@fig
def cross_section():
    s = Svg(800, 560, "Drawing a cross-section from a contour map",
            "Top: a line A–B drawn across contours from 100 m to 400 m. A strip of paper is laid along A–B and the points "
            "where each contour crosses it are marked with their heights. Bottom: the marks are transferred to a graph with "
            "a vertical scale, plotted at the right heights and joined with a smooth curve to show the shape of the land.")
    heading(s, "From contour map to cross-section")
    pts = [(80, 100), (160, 200), (220, 300), (270, 400), (420, 400), (480, 300), (570, 200), (690, 100)]
    ty = 120
    s.rect(50, 60, 700, 130, fill="#fefce8", stroke="#94a3b8", width=1.2, rx=8)
    for x, h in pts:
        s.path(f"M {x - 14} 68 Q {x + 10} {ty} {x - 8} 182", color=CONTOUR, width=2)
        s.label(x - 6, 80, str(h), size=12, color=CONTOUR, weight="bold", pad=2)
    s.line(60, ty, 740, ty, color=RED, width=2.5)
    s.text(48, ty, "A", size=18, weight="bold", color=RED, anchor="end")
    s.text(752, ty, "B", size=18, weight="bold", color=RED, anchor="start")
    for x, _ in pts:
        s.dot(x, ty, r=4, color=RED)
    s.text(400, 208, "1. Mark where each contour crosses A–B on a paper strip.", size=14, color=MUTED)
    gx0, gy0, gh = 90, 490, 220
    s.line(gx0, gy0, 720, gy0, color=INK, width=2)
    s.line(gx0, gy0, gx0, gy0 - gh - 10, color=INK, width=2)
    for h in range(0, 501, 100):
        y = gy0 - h * gh / 500
        s.line(gx0 - 6, y, 720, y, color="#e2e8f0", width=1)
        s.text(gx0 - 12, y, str(h), size=12, color=MUTED, anchor="end")
    s.text(gx0 - 50, gy0 - gh / 2, "height (m)", size=13, color=MUTED)
    prof = [(gx0 - 10, 70)] + pts[:4] + [(345, 440)] + pts[4:] + [(730, 70)]
    xy = [(x if x > gx0 else gx0, gy0 - h * gh / 500) for x, h in prof]
    d = f"M {xy[0][0]:.1f} {xy[0][1]:.1f} " + " ".join(
        f"Q {xy[i][0]:.1f} {xy[i][1]:.1f} {(xy[i][0] + xy[i + 1][0]) / 2:.1f} {(xy[i][1] + xy[i + 1][1]) / 2:.1f}" for i in range(1, len(xy) - 1)
    ) + f" L {xy[-1][0]:.1f} {xy[-1][1]:.1f} L {xy[-1][0]:.1f} {gy0} L {gx0} {gy0} Z"
    s.path(d, color=INK, width=2.5, fill=LAND)
    for x, h in pts:
        s.dot(x, gy0 - h * gh / 500, r=4.5, color=RED)
    s.text(gx0, gy0 + 20, "A", size=16, weight="bold", color=RED)
    s.text(720, gy0 + 20, "B", size=16, weight="bold", color=RED)
    s.text(400, gy0 + 40, "2. Plot each mark at its height and join the points with a smooth curve.", size=14, color=MUTED)
    return s


@fig
def chain_survey():
    s = Svg(800, 470, "A chain survey with offsets",
            "A straight chain line runs from station A to station B, measured every 20 metres. Offsets are measured at right "
            "angles from the chain line to features: two corners of a building, a tree, and the points where a path and a "
            "stream cross. The chainage along the line and the offset distance fix the position of each feature.")
    heading(s, "Chain survey: chain line plus right-angle offsets")
    y = 260
    x0, x1 = 80, 720
    s.line(x0, y, x1, y, color=INK, width=3)
    for m in range(0, 101, 20):
        x = x0 + (x1 - x0) * m / 100
        s.line(x, y - 8, x, y + 8, color=INK, width=2)
        s.text(x, y + 26, f"{m} m", size=13, color=MUTED)
    for x, t in [(x0, "A"), (x1, "B")]:
        s.polygon([(x, y - 18), (x - 12, y + 4), (x + 12, y + 4)], fill="#ffffff", stroke=RED, width=2.5)
        s.text(x, y - 32, t, size=18, weight="bold", color=RED)
    def X(m):
        return x0 + (x1 - x0) * m / 100
    # building
    bx1, bx2 = X(25), X(45)
    s.rect(bx1, y - 160, bx2 - bx1, 70, fill=F_GREY, stroke=INK, width=2)
    s.text((bx1 + bx2) / 2, y - 125, "building", size=14, weight="bold")
    for x in (bx1, bx2):
        s.line(x, y, x, y - 90, color=ORANGE, width=2, dash="6 4")
        s.rect(x, y - 12, 10, 12, fill="none", stroke=ORANGE, width=1.2)
    s.label(bx1 - 6, y - 50, "offset 18 m", size=12, anchor="end", color=ORANGE, weight="bold", pad=2)
    # tree
    tx = X(62)
    s.line(tx, y, tx, y + 90, color=ORANGE, width=2, dash="6 4")
    s.circle(tx, y + 104, 14, fill="#86efac", stroke=GREEN, width=2)
    s.label(tx + 26, y + 70, "offset 12 m to tree", size=12, anchor="start", color=ORANGE, weight="bold", pad=2)
    # path and stream
    s.path(f"M {X(78)} {y - 170} L {X(84)} {y + 160}", color=BROWN, width=3, dash="10 5")
    s.label(X(78) + 14, y - 150, "path", size=13, anchor="start", color=BROWN, pad=2)
    s.path(f"M {X(8)} {y + 170} Q {X(14)} {y + 40} {X(12)} {y} Q {X(10)} {y - 80} {X(18)} {y - 180}", color=RIVER, width=3)
    s.label(X(18) + 10, y - 170, "stream", size=13, anchor="start", color=RIVER, italic=True, pad=2)
    note(s, "Each feature is fixed by its chainage along A–B and its offset at a right angle.", 450, size=14, color=INK)
    return s


@fig
def compass_bearings():
    s = Svg(800, 460, "Compass points and bearings",
            "Left: the sixteen points of the compass from north through north-north-east, north-east and so on. Right: a "
            "bearing is the angle measured clockwise from north, written with three figures. From X, the bearing of Y is "
            "060°; the back bearing, from Y to X, is 060° + 180° = 240°.")
    heading(s, "Sixteen compass points, and bearings measured clockwise from north")
    cx, cy, r = 210, 250, 150
    s.circle(cx, cy, r, fill="#ffffff", stroke="#94a3b8", width=1.5)
    names = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    for i, n in enumerate(names):
        a = math.radians(90 - i * 22.5)
        main = i % 4 == 0
        rr = r - (8 if main else 30)
        s.line(cx, cy, cx + rr * math.cos(a), cy - rr * math.sin(a), color=INK if main else MUTED, width=2.2 if main else 1)
        tr = r + 20
        s.text(cx + tr * math.cos(a), cy - tr * math.sin(a), n, size=15 if main else 12, weight="bold" if main else "normal",
               color=RED if n == "N" else INK)
    px, py, pr = 560, 290, 140
    s.line(px, py, px, py - pr - 10, color=INK, width=2.5)
    s.text(px, py - pr - 24, "N", size=16, weight="bold", color=RED)
    a = math.radians(90 - 60)
    yx, yy = px + pr * math.cos(a), py - pr * math.sin(a)
    s.line(px, py, yx, yy, color=BLUE, width=3)
    s.arc(px, py, 60, 90, 30, color=ORANGE, width=2.5)
    s.label(px + 36, py - 82, "60°", size=14, color=ORANGE, weight="bold", pad=2)
    s.dot(px, py, r=6, color=INK)
    s.text(px - 18, py + 4, "X", size=18, weight="bold", anchor="end")
    s.dot(yx, yy, r=6, color=INK)
    s.text(yx + 14, yy, "Y", size=18, weight="bold", anchor="start")
    s.text(px + 20, py + 60, "bearing of Y from X = 060°", size=15, weight="bold", color=BLUE)
    s.text(px + 20, py + 84, "back bearing (Y to X) = 240°", size=15, weight="bold", color=PURPLE)
    s.text(px + 20, py + 108, "back bearing = bearing ± 180°", size=14, color=MUTED)
    return s


@fig
def statistical_graphs():
    s = Svg(800, 620, "Four statistical graphs drawn from geographical data",
            "Four graphs of illustrative data: a simple bar graph of rice production over five years; a line graph of "
            "monthly temperature; a pie chart of land use in a district (farming 45%, forest 25%, mining 12%, settlement 10%, "
            "other 8%); and a divided (compound) bar showing the same land use as parts of one bar.")
    heading(s, "Bar, line, pie and divided bar (illustrative data)")
    # bar
    _panel_title(s, 200, 70, "Simple bar graph")
    bx, by = 70, 290
    s.line(bx, by, 340, by, color=INK, width=1.8)
    s.line(bx, by, bx, 90, color=INK, width=1.8)
    for k, v in enumerate([60, 75, 70, 90, 110]):
        x = bx + 18 + k * 52
        s.rect(x, by - v * 1.6, 34, v * 1.6, fill=BLUE, stroke="none", width=0)
        s.text(x + 17, by + 16, str(2019 + k), size=12, color=MUTED)
    s.text(bx + 4, 100, "output", size=12, color=MUTED, anchor="start")
    # line
    _panel_title(s, 590, 70, "Line graph")
    lx, ly = 460, 290
    s.line(lx, ly, 740, ly, color=INK, width=1.8)
    s.line(lx, ly, lx, 90, color=INK, width=1.8)
    temps = [27, 28, 28.5, 28.5, 28, 26.5, 25.5, 25.5, 26, 26.5, 27, 27]
    pts = [(lx + 14 + i * 23, ly - (t - 22) * 26) for i, t in enumerate(temps)]
    s.polyline(pts, color=RED, width=3)
    for i, (x, y) in enumerate(pts):
        s.dot(x, y, r=3.5, color=RED)
        s.text(x, ly + 16, "JFMAMJJASOND"[i], size=11, color=MUTED)
    s.text(lx + 4, 100, "°C", size=12, color=MUTED, anchor="start")
    # pie
    _panel_title(s, 200, 350, "Pie chart")
    data = [("farming", 45, GREEN), ("forest", 25, "#065f46"), ("mining", 12, ORANGE), ("settlement", 10, PURPLE), ("other", 8, "#94a3b8")]
    pcx, pcy, pr = 150, 480, 95
    a0 = 90.0
    for name, v, col in data:
        a1 = a0 - v * 3.6
        large = 1 if v * 3.6 > 180 else 0
        x0, y0 = pcx + pr * math.cos(math.radians(a0)), pcy - pr * math.sin(math.radians(a0))
        x1, y1 = pcx + pr * math.cos(math.radians(a1)), pcy - pr * math.sin(math.radians(a1))
        s.path(f"M {pcx} {pcy} L {x0:.1f} {y0:.1f} A {pr} {pr} 0 {large} 1 {x1:.1f} {y1:.1f} Z", color="#ffffff", width=2, fill=col)
        a0 = a1
    for k, (name, v, col) in enumerate(data):
        y = 410 + k * 28
        s.rect(262, y - 8, 16, 16, fill=col, stroke="none", width=0)
        s.text(286, y, f"{name} {v}% ({v * 3.6:g}°)", size=13, anchor="start")
    # divided bar
    _panel_title(s, 590, 350, "Divided (compound) bar")
    dx, dy, dw = 470, 420, 260
    acc = 0
    for name, v, col in data:
        s.rect(dx + acc * dw / 100, dy, v * dw / 100, 70, fill=col, stroke="#ffffff", width=2)
        if v >= 12:
            s.text(dx + (acc + v / 2) * dw / 100, dy + 35, f"{v}%", size=13, color="#ffffff", weight="bold")
        acc += v
    s.text(dx + dw / 2, dy + 100, "same land-use data as the pie chart", size=13, color=MUTED)
    return s


@fig
def statistical_maps():
    s = Svg(800, 600, "Four kinds of statistical map",
            "A dot map, where each dot stands for a fixed number of people; a choropleth map, where areas are shaded darker "
            "for higher values such as population density; an isopleth map, where lines join places of equal value, such as "
            "isohyets of equal rainfall; and a flow map, where arrows of different widths show the amount of movement between "
            "places.")
    heading(s, "Dot, choropleth, isopleth and flow maps (illustrative)")
    import random
    rng = random.Random(7)
    # dot map
    _panel_title(s, 200, 70, "Dot map")
    outline = [(70, 110), (300, 95), (340, 180), (310, 280), (110, 290), (60, 200)]
    poly(s, outline, "#ffffff", stroke=INK, width=2)
    for _ in range(26):
        s.dot(rng.uniform(220, 310), rng.uniform(120, 200), r=3.5, color=INK)
    for _ in range(9):
        s.dot(rng.uniform(90, 250), rng.uniform(170, 270), r=3.5, color=INK)
    s.text(200, 310, "1 dot = 1,000 people", size=13, color=MUTED)
    # choropleth
    _panel_title(s, 590, 70, "Choropleth map")
    shades = [["#fee2e2", "#fca5a5", "#ef4444"], ["#fca5a5", "#ef4444", "#b91c1c"], ["#fee2e2", "#fee2e2", "#fca5a5"]]
    for i in range(3):
        for j in range(3):
            s.rect(470 + j * 70, 95 + i * 62, 70, 62, fill=shades[i][j], stroke=INK, width=1.5)
    for k, (col, t) in enumerate([("#fee2e2", "low"), ("#fca5a5", "medium"), ("#ef4444", "high"), ("#b91c1c", "very high")]):
        s.rect(690, 110 + k * 30, 18, 18, fill=col, stroke=INK, width=1)
        s.text(716, 119 + k * 30, t, size=12, anchor="start")
    s.text(590, 310, "shading by density class", size=13, color=MUTED)
    # isopleth
    _panel_title(s, 200, 360, "Isopleth map (isohyets)")
    s.rect(70, 380, 260, 180, fill="#ffffff", stroke=INK, width=2)
    for k, v in enumerate(["3,000", "2,500", "2,000", "1,500"]):
        y = 410 + k * 42
        s.path(f"M 70 {y + 20} Q 150 {y - 10} 220 {y + 8} T 330 {y - 6}", color=BLUE, width=2)
        s.label(110 + k * 20, y + 8, v, size=12, color=BLUE, weight="bold", pad=2)
    s.text(200, 580, "lines join places with equal rainfall (mm)", size=13, color=MUTED)
    # flow
    _panel_title(s, 590, 360, "Flow map")
    hubs = {"Freetown": (500, 470), "Bo": (650, 530), "Makeni": (650, 410), "Kenema": (740, 470)}
    for (a, b, w) in [("Makeni", "Freetown", 14), ("Bo", "Freetown", 10), ("Kenema", "Bo", 6)]:
        (x1, y1), (x2, y2) = hubs[a], hubs[b]
        s.line(x1, y1, x2, y2, color=ORANGE, width=w, cap="butt", opacity=0.8)
        s.head(x2 + (x1 - x2) * 0.18, y2 + (y1 - y2) * 0.18, math.atan2(y2 - y1, x2 - x1), color=ORANGE, size=10 + w)
    for n, (x, y) in hubs.items():
        s.dot(x, y, r=6, color=INK)
        s.label(x, y - 18, n, size=12, weight="bold", pad=2)
    s.text(590, 580, "arrow width shows volume of movement", size=13, color=MUTED)
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
