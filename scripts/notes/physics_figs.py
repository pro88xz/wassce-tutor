#!/usr/bin/env python3
"""Original diagrams for the Physics notes.

    python3 scripts/notes/physics_figs.py            # write every diagram
    python3 scripts/notes/physics_figs.py name ...   # write some

Each function draws one figure and returns an Svg. Files go to
public/img/physics/<name>.svg and lessons show them from
https://wasscetutor.com/img/physics/<name>.svg (an absolute URL, so lessons in
older app builds can show diagrams added later). All drawn by WASSCE Tutor.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from svgfig import (  # noqa: E402
    BG, BLUE, F_AMBER, F_BLUE, F_GREEN, F_GREY, F_PURPLE, F_RED, GLASS, GREEN, GRID, INK, METAL, MUTED,
    ORANGE, PURPLE, RED, TEAL, WATER, Svg,
)

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public/img/physics"
FIGS: dict[str, callable] = {}


def fig(fn):
    FIGS[fn.__name__.replace("_", "-")] = fn
    return fn


def polar(x, y, length, deg):
    """Point at `length` from (x, y) at `deg` degrees above the +x axis."""
    return x + length * math.cos(math.radians(deg)), y - length * math.sin(math.radians(deg))


# ═══ Foundations ════════════════════════════════════════════════════════════

@fig
def vector_parallelogram():
    s = Svg(640, 380, "Parallelogram law of vector addition",
            "Two vectors P and Q act from the same point O. The diagonal of the parallelogram they form, R, is their resultant.")
    o = (110, 300)
    p = polar(*o, 300, 0)
    q = polar(*o, 190, 58)
    r = (p[0] + q[0] - o[0], p[1] + q[1] - o[1])
    s.polygon([o, p, r, q], fill=F_BLUE, stroke="none", width=0, opacity=0.55)
    s.line(*p, *r, color=MUTED, width=2.5, dash="8 7")
    s.line(*q, *r, color=MUTED, width=2.5, dash="8 7")
    s.arrow(*o, *p, color=BLUE, width=5)
    s.arrow(*o, *q, color=GREEN, width=5)
    s.arrow(*o, *r, color=RED, width=5)
    s.dot(*o, 6)
    s.text(o[0] - 22, o[1] + 6, "O", size=22, weight="bold")
    s.text((o[0] + p[0]) / 2, o[1] + 30, "P", size=26, weight="bold", color=BLUE, italic=True)
    s.text((o[0] + q[0]) / 2 - 26, (o[1] + q[1]) / 2, "Q", size=26, weight="bold", color=GREEN, italic=True)
    s.label((o[0] + r[0]) / 2 + 6, (o[1] + r[1]) / 2 - 26, "R = resultant", size=22, color=RED, weight="bold")
    s.arc(o[0], o[1], 56, 0, 58, color=INK, width=2.5)
    s.text(o[0] + 74, o[1] - 26, "θ", size=24, italic=True)
    s.text(320, 40, "Diagonal of the parallelogram = resultant", size=22, color=MUTED)
    return s


@fig
def vector_components():
    s = Svg(640, 400, "Resolving a vector into components",
            "A force F at angle theta to the horizontal has a horizontal component F cos theta and a vertical component F sin theta.")
    o = (130, 320)
    F = 300
    th = 35
    tip = polar(*o, F, th)
    s.line(o[0], o[1], tip[0], o[1], color=BLUE, width=1)
    s.arrow(*o, tip[0], o[1], color=BLUE, width=5)
    s.arrow(tip[0], o[1], *tip, color=GREEN, width=5)
    s.arrow(*o, *tip, color=RED, width=5)
    s.rect(tip[0] - 18, o[1] - 18, 18, 18, fill="none", stroke=MUTED, width=2)
    s.arc(o[0], o[1], 70, 0, th, width=2.5)
    s.text(o[0] + 88, o[1] - 22, "θ", size=24, italic=True)
    s.label((o[0] + tip[0]) / 2 - 20, (o[1] + tip[1]) / 2 - 30, "F", size=26, color=RED, weight="bold", italic=True)
    s.text((o[0] + tip[0]) / 2, o[1] + 32, "F cos θ  (horizontal)", size=22, color=BLUE, weight="bold")
    s.text(tip[0] + 14, (o[1] + tip[1]) / 2, "F sin θ", size=22, color=GREEN, weight="bold", anchor="start")
    s.text(tip[0] + 14, (o[1] + tip[1]) / 2 + 28, "(vertical)", size=20, color=GREEN, anchor="start")
    s.dot(*o, 6)
    s.text(320, 40, "One vector → two perpendicular components", size=22, color=MUTED)
    return s


@fig
def relative_velocity_river():
    s = Svg(640, 420, "Boat crossing a river",
            "A boat heads straight across a river at 4 m/s while the current flows at 3 m/s. The boat's resultant velocity is 5 m/s at an angle downstream.")
    s.rect(40, 90, 560, 260, fill=WATER, stroke="none", width=0, opacity=0.6)
    s.line(40, 90, 600, 90, color=GREEN, width=6)
    s.line(40, 350, 600, 350, color=GREEN, width=6)
    s.text(320, 60, "Far bank", size=20, color=MUTED)
    s.text(320, 382, "Near bank (start)", size=20, color=MUTED)
    for y in (140, 300):
        s.arrow(470, y, 560, y, color=TEAL, width=2.5)
    s.text(515, 120, "current", size=18, color=TEAL)
    o = (150, 350)
    up = (150, 90)
    end = (150 + 195, 90)
    s.arrow(*o, *up, color=BLUE, width=5)
    s.arrow(*up, *end, color=TEAL, width=5, dash="10 7")
    s.arrow(*o, *end, color=RED, width=5)
    s.label(108, 220, "4 m/s", size=22, color=BLUE, weight="bold")
    s.text(108, 250, "boat", size=18, color=BLUE)
    s.label(248, 112, "3 m/s", size=22, color=TEAL, weight="bold")
    s.label(290, 220, "5 m/s", size=22, color=RED, weight="bold")
    s.text(296, 250, "resultant", size=18, color=RED)
    s.arc(o[0], o[1], 66, 90, 90 - math.degrees(math.atan2(3, 4)), width=2.5)
    s.text(172, 262, "θ", size=22, italic=True)
    return s


# ═══ Kinematics ══════════════════════════════════════════════════════════════

def graph_frame(s: Svg, x0, y0, x1, y1, xl, yl):
    s.axes(x0, y0, x1, y1, xl, yl)


@fig
def vt_uniform_acceleration():
    s = Svg(640, 420, "Velocity-time graph for uniform acceleration",
            "Velocity rises in a straight line from u to v in time t. The gradient is the acceleration and the area under the line is the displacement.")
    x0, y0, x1, y1 = 90, 350, 600, 40
    graph_frame(s, x0, y0, x1, y1, "time / s", "velocity / m s⁻¹")
    tx = 500
    uy, vy = 270, 100
    s.polygon([(x0, y0), (x0, uy), (tx, vy), (tx, y0)], fill=F_BLUE, stroke="none", width=0)
    s.line(x0, uy, tx, uy, color=MUTED, width=2, dash="7 6")
    s.line(tx, vy, tx, y0, color=MUTED, width=2, dash="7 6")
    s.line(x0, uy, tx, vy, color=RED, width=5)
    s.text(x0 - 14, uy, "u", size=24, italic=True, anchor="end", weight="bold")
    s.text(x0 - 14, vy, "v", size=24, italic=True, anchor="end", weight="bold")
    s.line(x0 - 6, vy, x0 + 6, vy, width=2)
    s.line(tx, vy, x0, vy, color=GRID, width=1.5, dash="5 6")
    s.text(tx, y0 + 26, "t", size=24, italic=True, weight="bold")
    s.text(295, 310, "area = displacement s", size=22, color=BLUE, weight="bold")
    s.text(295, 336, "= ½(u + v)t", size=22, color=BLUE)
    s.arrow(tx + 30, uy, tx + 30, vy + 4, color=GREEN, width=2.5)
    s.text(tx + 40, 186, "v − u", size=20, color=GREEN, anchor="start")
    s.text(250, 80, "gradient = a = (v − u)/t", size=21, color=RED, weight="bold")
    return s


@fig
def motion_graphs_summary():
    s = Svg(660, 330, "Three velocity-time graphs",
            "Left: horizontal line, constant velocity. Middle: rising straight line, uniform acceleration. Right: falling straight line, uniform deceleration.")
    titles = ["Constant velocity", "Uniform acceleration", "Uniform deceleration"]
    lines = [((0, 0.6), (1, 0.6)), ((0, 0.15), (1, 0.85)), ((0, 0.85), (1, 0.05))]
    for i in range(3):
        bx = 30 + i * 215
        x0, y0, w, h = bx + 26, 250, 165, 170
        s.arrow(x0, y0, x0 + w, y0, width=2.2)
        s.arrow(x0, y0, x0, y0 - h, width=2.2)
        (a, b), (c, d) = lines[i]
        s.line(x0 + a * (w - 15), y0 - b * (h - 15), x0 + c * (w - 15), y0 - d * (h - 15), color=[BLUE, GREEN, RED][i], width=5)
        s.text(x0 + w / 2, 285, titles[i], size=19, weight="bold")
        s.text(x0 + w, y0 + 18, "t", size=18, italic=True, color=MUTED)
        s.text(x0 - 12, y0 - h + 8, "v", size=18, italic=True, color=MUTED)
    s.text(330, 30, "Gradient of a v–t graph = acceleration", size=21, color=MUTED)
    return s


@fig
def thrown_up_vt():
    s = Svg(640, 420, "Velocity-time graph for a ball thrown straight up",
            "Velocity falls in a straight line from +u to zero at the highest point, then becomes negative as the ball falls back. The gradient is -g throughout.")
    x0, ymid, x1 = 90, 210, 600
    s.arrow(x0, 380, x0, 40, width=2.5)
    s.arrow(x0, ymid, x1, ymid, width=2.5)
    s.text(x1, ymid + 26, "time / s", size=20, anchor="end", color=MUTED)
    s.text(x0 + 10, 36, "velocity / m s⁻¹ (up +)", size=20, anchor="start", color=MUTED, baseline="auto")
    top_t = 300
    s.polygon([(x0, ymid), (x0, 80), (top_t, ymid)], fill=F_GREEN, stroke="none", width=0)
    s.polygon([(top_t, ymid), (510, 340), (510, ymid)], fill=F_RED, stroke="none", width=0)
    s.line(x0, 80, 510, 340, color=BLUE, width=5)
    s.text(x0 - 12, 80, "+u", size=22, anchor="end", weight="bold")
    s.text(x0 - 12, 340, "−u", size=22, anchor="end", weight="bold")
    s.line(x0 - 6, 340, 510, 340, color=GRID, width=1.5, dash="5 6")
    s.dot(top_t, ymid, 7, color=RED)
    s.label(top_t + 6, ymid - 34, "highest point: v = 0", size=20, color=RED, weight="bold", anchor="start")
    s.text(top_t, ymid + 28, "t = u/g", size=20, weight="bold")
    s.text(510, ymid + 28, "2u/g", size=20, weight="bold")
    s.text(170, 175, "going up", size=18, color=GREEN)
    s.text(420, 255, "falling", size=18, color=RED)
    s.text(470, 110, "gradient = −g", size=22, color=BLUE, weight="bold")
    return s


@fig
def projectile_path():
    s = Svg(660, 470, "Path of a projectile",
            "A ball is launched at speed u at angle theta. Its horizontal velocity stays u cos theta all the way; its vertical velocity decreases to zero at the top and then increases downwards. The path is a parabola.")
    x0, y0 = 70, 400
    u, th, g, sc = 1.0, 55, 1.0, 1.0
    R = 520
    H = 230
    pts = []
    for i in range(101):
        f = i / 100
        pts.append((x0 + R * f, y0 - 4 * H * f * (1 - f)))
    s.hatch_ground(30, 630, y0)
    s.polyline(pts, color=MUTED, width=3, dash="9 7")
    s.dot(x0, y0, 7)
    # launch velocity and components
    s.arrow(x0, y0, x0 + 66, y0 - 94, color=RED, width=4.5)
    s.text(x0 + 40, y0 - 112, "u", size=24, italic=True, weight="bold", color=RED)
    s.arc(x0, y0, 44, 0, 55, width=2.2)
    s.text(x0 + 58, y0 - 18, "θ", size=22, italic=True)
    for f in (0.2, 0.5, 0.8):
        px, py = x0 + R * f, y0 - 4 * H * f * (1 - f)
        vy = 4 * H * (1 - 2 * f) / R * 70
        s.arrow(px, py, px + 70, py, color=BLUE, width=3.5)
        if abs(vy) > 1:
            s.arrow(px, py, px, py - vy, color=GREEN, width=3.5)
        s.dot(px, py, 5)
    s.label(x0 + R * 0.5 + 120, y0 - H - 6, "top: vertical velocity = 0", size=19, color=GREEN, weight="bold")
    s.line(x0 + R / 2, y0, x0 + R / 2, y0 - H, color=GRID, width=2, dash="6 6")
    s.text(x0 + R / 2 + 10, y0 - H / 2, "H", size=24, italic=True, weight="bold", anchor="start")
    s.arrow(x0, y0 + 30, x0 + R, y0 + 30, color=INK, width=2)
    s.arrow(x0 + R, y0 + 30, x0, y0 + 30, color=INK, width=2)
    s.label(x0 + R / 2, y0 + 30, "range R", size=20, weight="bold")
    s.text(30, 34, "blue: horizontal velocity u cos θ (never changes)", size=19, color=BLUE, anchor="start", weight="bold")
    s.text(30, 62, "green: vertical velocity (changes by g every second)", size=19, color=GREEN, anchor="start", weight="bold")
    return s


# ═══ Forces ══════════════════════════════════════════════════════════════════

@fig
def lift_free_body():
    s = Svg(640, 400, "Free-body diagram of a person in a lift",
            "A person stands in a lift. Two forces act: the weight mg downwards and the normal reaction R upwards. If the lift accelerates upwards, R is greater than mg.")
    s.rect(200, 50, 240, 300, fill=F_GREY, stroke=INK, width=3, rx=6)
    s.line(320, 10, 320, 50, width=4)
    s.text(334, 26, "cable", size=18, color=MUTED, anchor="start")
    s.rect(285, 170, 70, 150, fill=F_BLUE, stroke=INK, width=2.5, rx=18)
    s.circle(320, 145, 24, fill=F_BLUE, stroke=INK, width=2.5)
    s.line(200, 320, 440, 320, width=4)
    s.arrow(320, 320, 320, 200, color=GREEN, width=5)
    s.label(358, 240, "R", size=26, color=GREEN, weight="bold", italic=True)
    s.arrow(320, 245, 320, 385, color=RED, width=5)
    s.label(358, 372, "mg", size=24, color=RED, weight="bold", italic=True)
    s.arrow(500, 230, 500, 140, color=BLUE, width=4)
    s.text(512, 180, "a", size=26, italic=True, weight="bold", color=BLUE, anchor="start")
    s.text(560, 250, "R − mg = ma", size=22, weight="bold", anchor="middle")
    s.text(560, 280, "(accelerating up)", size=18, color=MUTED)
    return s


@fig
def collision_momentum():
    s = Svg(660, 330, "Momentum before and after a collision",
            "Before: a 2 kg trolley at 3 m/s moves towards a 1 kg trolley at rest. After: they stick together and move at 2 m/s. Total momentum is 6 kg m/s before and after.")
    s.text(330, 34, "Total momentum before = total momentum after", size=21, color=MUTED)
    s.text(40, 90, "Before", size=22, weight="bold", anchor="start")
    s.rect(80, 110, 120, 60, fill=F_BLUE, stroke=INK, width=3, rx=6)
    s.text(140, 140, "2 kg", size=22, weight="bold")
    s.arrow(210, 140, 300, 140, color=RED, width=4)
    s.text(255, 120, "3 m/s", size=20, color=RED, weight="bold")
    s.rect(380, 110, 80, 60, fill=F_AMBER, stroke=INK, width=3, rx=6)
    s.text(420, 140, "1 kg", size=22, weight="bold")
    s.text(420, 190, "at rest", size=18, color=MUTED)
    s.text(560, 140, "p = 2 × 3 = 6", size=20, weight="bold")
    s.line(40, 210, 620, 210, color=GRID, width=2)
    s.text(40, 240, "After", size=22, weight="bold", anchor="start")
    s.rect(160, 250, 120, 60, fill=F_BLUE, stroke=INK, width=3, rx=6)
    s.rect(280, 250, 80, 60, fill=F_AMBER, stroke=INK, width=3, rx=6)
    s.text(220, 280, "2 kg", size=22, weight="bold")
    s.text(320, 280, "1 kg", size=22, weight="bold")
    s.arrow(370, 280, 450, 280, color=RED, width=4)
    s.text(410, 260, "2 m/s", size=20, color=RED, weight="bold")
    s.text(560, 280, "p = 3 × 2 = 6", size=20, weight="bold")
    return s


@fig
def lami_three_forces():
    s = Svg(640, 440, "Three forces in equilibrium at a point (Lami's theorem)",
            "Three forces F1, F2 and F3 act at point O and balance. Each force is proportional to the sine of the angle between the other two.")
    o = (320, 220)
    a1, a2, a3 = 30, 150, 270
    for ang, col, name, L in ((a1, BLUE, "F₁", 170), (a2, GREEN, "F₂", 170), (a3, RED, "F₃", 120)):
        tip = polar(*o, L, ang)
        s.arrow(*o, *tip, color=col, width=5)
        lx, ly = polar(*o, L + 28, ang)
        if ang == 270:
            lx, ly = o[0] + 34, o[1] + L - 6
        s.text(lx, ly, name, size=26, color=col, weight="bold", italic=True)
    s.dot(*o, 6)
    s.text(o[0] + 18, o[1] + 22, "O", size=20, weight="bold")
    s.arc(o[0], o[1], 46, a1, a2, width=2.2)
    s.text(o[0], o[1] - 66, "γ", size=24, italic=True)
    s.arc(o[0], o[1], 46, a2, a3, width=2.2)
    s.text(o[0] - 60, o[1] + 36, "α", size=24, italic=True)
    s.arc(o[0], o[1], 46, -90, a1, width=2.2)
    s.text(o[0] + 58, o[1] + 36, "β", size=24, italic=True)
    s.text(320, 404, "F₁/sin α = F₂/sin β = F₃/sin γ", size=24, weight="bold")
    s.text(320, 34, "α is opposite F₁, β opposite F₂, γ opposite F₃", size=19, color=MUTED)
    return s


@fig
def inclined_plane_forces():
    s = Svg(660, 420, "Forces on a block resting on an inclined plane",
            "A block on a slope at angle theta. Weight mg acts vertically down and splits into mg sin theta down the slope and mg cos theta into the slope. The normal reaction R and friction F act on the block.")
    A, B = (60, 370), (600, 370)
    th = 30
    C = (600, 370 - 540 * math.tan(math.radians(th)))
    s.polygon([A, B, C], fill=F_GREY, stroke=INK, width=3)
    s.arc(A[0], A[1], 70, 0, th, width=2.5)
    s.text(A[0] + 88, A[1] - 20, "θ", size=24, italic=True)
    # block centred on slope
    t = 0.55
    bx, by = A[0] + (C[0] - A[0]) * t, A[1] + (C[1] - A[1]) * t
    ux, uy = math.cos(math.radians(th)), -math.sin(math.radians(th))   # up-slope unit
    nx, ny = -math.sin(math.radians(th)), -math.cos(math.radians(th))  # outward normal
    w, h = 90, 60
    corners = [(bx - ux * w / 2, by - uy * w / 2), (bx + ux * w / 2, by + uy * w / 2)]
    pts = [corners[0], corners[1], (corners[1][0] + nx * h, corners[1][1] + ny * h), (corners[0][0] + nx * h, corners[0][1] + ny * h)]
    s.polygon(pts, fill=F_BLUE, stroke=INK, width=3)
    cx, cy = bx + nx * h / 2, by + ny * h / 2
    s.arrow(cx, cy, cx, cy + 150, color=RED, width=5)
    s.text(cx + 14, cy + 160, "mg", size=24, color=RED, weight="bold", italic=True, anchor="start")
    s.arrow(cx, cy, cx + nx * 130, cy + ny * 130, color=GREEN, width=5)
    s.text(cx + nx * 150, cy + ny * 150, "R", size=26, color=GREEN, weight="bold", italic=True)
    s.arrow(cx, cy, cx + ux * 120, cy + uy * 120, color=ORANGE, width=5)
    s.text(cx + ux * 142, cy + uy * 142 - 4, "F (friction)", size=20, color=ORANGE, weight="bold", anchor="start")
    s.arrow(cx, cy, cx - ux * 75, cy - uy * 75, color=PURPLE, width=3, dash="8 6")
    s.text(cx - ux * 90 - 8, cy - uy * 90 + 20, "mg sin θ", size=20, color=PURPLE, weight="bold", anchor="end")
    s.arrow(cx, cy, cx - nx * 75, cy - ny * 75, color=PURPLE, width=3, dash="8 6")
    s.text(cx - nx * 75 + 12, cy - ny * 75 + 18, "mg cos θ", size=20, color=PURPLE, weight="bold", anchor="start")
    return s


@fig
def moments_seesaw():
    s = Svg(660, 330, "Principle of moments on a balanced beam",
            "A uniform beam balances on a pivot. A 300 N load 2 m to the left balances a 200 N load 3 m to the right: 300 times 2 equals 200 times 3.")
    s.rect(60, 150, 540, 20, fill=F_AMBER, stroke=INK, width=3, rx=4)
    s.polygon([(330, 170), (300, 240), (360, 240)], fill=F_GREY, stroke=INK, width=3)
    s.hatch_ground(240, 420, 240)
    # loads
    s.arrow(130, 150, 130, 70 + 120 - 120, color=RED, width=0.01)
    s.rect(100, 100, 60, 50, fill=F_BLUE, stroke=INK, width=3, rx=4)
    s.arrow(130, 160, 130, 250, color=RED, width=5)
    s.text(130, 272, "300 N", size=22, color=RED, weight="bold")
    s.rect(500, 100, 60, 50, fill=F_BLUE, stroke=INK, width=3, rx=4)
    s.arrow(530, 160, 530, 250, color=RED, width=5)
    s.text(530, 272, "200 N", size=22, color=RED, weight="bold")
    s.line(130, 60, 330, 60, width=2)
    s.line(130, 52, 130, 68, width=2)
    s.line(330, 52, 330, 68, width=2)
    s.label(230, 60, "2 m", size=20, weight="bold")
    s.line(330, 60, 530, 60, width=2)
    s.line(530, 52, 530, 68, width=2)
    s.label(430, 60, "3 m", size=20, weight="bold")
    s.text(330, 300, "anticlockwise 300 × 2 = 600 N m = clockwise 200 × 3", size=20, weight="bold")
    s.text(330, 260, "pivot", size=18, color=MUTED)
    return s


@fig
def stability_tilting():
    s = Svg(660, 380, "Stability: a block tilted about one edge",
            "Left: tilted a little, the vertical line through the centre of gravity G still passes inside the pivot edge, so the block falls back (stable). Right: tilted further, the line passes outside the pivot edge, so the block topples.")
    w, h = 110, 190
    for i, (ang, ok) in enumerate(((18, True), (40, False))):
        px, py = 210 + i * 300, 310          # pivot: the bottom-right edge
        th = math.radians(ang)
        pts = []
        for (x, y) in ((0, 0), (w, 0), (w, h), (0, h)):
            rx, ry = x - w, y                  # relative to the pivot, y up
            X = rx * math.cos(th) + ry * math.sin(th)   # tilt clockwise: left edge lifts
            Y = -rx * math.sin(th) + ry * math.cos(th)
            pts.append((px + X, py - Y))
        s.hatch_ground(px - 170, px + 90, py)
        s.polygon(pts, fill=F_BLUE if ok else F_RED, stroke=INK, width=3)
        gx = sum(p[0] for p in pts) / 4
        gy = sum(p[1] for p in pts) / 4
        s.line(px, py, px, 70, color=ORANGE, width=2, dash="6 6")
        s.dot(gx, gy, 7, color=INK)
        s.text(gx - 12, gy - 6, "G", size=20, weight="bold", anchor="end")
        s.arrow(gx, gy, gx, py - 4, color=RED, width=4)
        s.dot(px, py, 7, color=ORANGE)
        s.text(px + 10, py + 30, "pivot edge", size=17, color=ORANGE, anchor="start")
        s.text(px - 60, 356, "falls back: stable" if ok else "topples over", size=21, weight="bold", color=GREEN if ok else RED)
    s.text(330, 34, "Is the weight's line of action inside the pivot edge?", size=20, color=MUTED)
    return s

@fig
def friction_block():
    s = Svg(660, 330, "Forces on a block pulled along a rough floor",
            "A block on a rough horizontal floor is pulled by force P to the right. Friction F acts to the left, weight W down and normal reaction R up.")
    s.hatch_ground(40, 620, 250)
    s.rect(250, 150, 160, 100, fill=F_BLUE, stroke=INK, width=3, rx=4)
    cx, cy = 330, 200
    s.arrow(410, cy, 560, cy, color=BLUE, width=5)
    s.text(570, cy, "P (pull)", size=22, color=BLUE, weight="bold", anchor="start")
    s.arrow(250, 245, 120, 245, color=ORANGE, width=5)
    s.text(110, 222, "F (friction)", size=22, color=ORANGE, weight="bold", anchor="end")
    s.arrow(cx, 150, cx, 50, color=GREEN, width=5)
    s.text(cx + 14, 64, "R", size=24, color=GREEN, weight="bold", italic=True, anchor="start")
    s.arrow(cx, 250, cx, 318, color=RED, width=5)
    s.text(cx + 14, 306, "W = mg", size=22, color=RED, weight="bold", anchor="start")
    s.text(170, 64, "F ≤ μR", size=24, weight="bold")
    return s


@fig
def friction_graph():
    s = Svg(640, 380, "Friction force against applied force",
            "As the applied force increases, static friction rises equally until it reaches the limiting value. The block then starts to slide and friction drops a little to the constant kinetic value.")
    x0, y0 = 90, 320
    s.axes(x0, y0, 600, 40, "applied force P / N", "friction F / N")
    s.line(x0, y0, 330, 120, color=BLUE, width=5)
    s.line(330, 120, 352, 160, color=RED, width=5)
    s.line(352, 160, 570, 160, color=RED, width=5)
    s.dot(330, 120, 7, color=INK)
    s.label(330, 92, "limiting friction μₛR", size=20, weight="bold")
    s.text(470, 186, "kinetic friction μₖR", size=20, color=RED, weight="bold")
    s.text(200, 230, "static: F = P", size=20, color=BLUE, weight="bold")
    s.text(200, 256, "(block stays still)", size=18, color=BLUE)
    s.line(330, 120, 330, y0, color=GRID, width=2, dash="6 6")
    s.text(450, 230, "block slides →", size=19, color=MUTED)
    return s


@fig
def circular_motion():
    s = Svg(640, 420, "Uniform circular motion",
            "An object moves round a circle of radius r at constant speed. Its velocity is along the tangent; the centripetal force and acceleration point towards the centre.")
    c = (230, 245)
    r = 135
    s.circle(*c, r, stroke=MUTED, width=3, dash="10 8")
    s.dot(*c, 6)
    s.text(c[0] - 16, c[1] + 22, "O", size=20, weight="bold")
    ang = 40
    p = polar(*c, r, ang)
    s.line(*c, *p, color=INK, width=2.5)
    s.label((c[0] + p[0]) / 2 + 4, (c[1] + p[1]) / 2 + 22, "r", size=24, italic=True, weight="bold")
    s.circle(*p, 16, fill=F_BLUE, stroke=INK, width=3)
    t = polar(*p, 105, ang + 90)
    s.arrow(*p, *t, color=BLUE, width=5)
    s.text(t[0] - 8, t[1] - 18, "v (along the tangent)", size=20, color=BLUE, weight="bold")
    f = polar(*p, 100, ang + 180)
    s.arrow(p[0] - 14 * math.cos(math.radians(ang)), p[1] + 14 * math.sin(math.radians(ang)), *f, color=RED, width=5)
    s.text(c[0] + 10, c[1] + 160, "force and acceleration point to the centre", size=19, color=RED, weight="bold")
    s.text(530, 150, "a = v²/r", size=24, weight="bold")
    s.text(530, 190, "F = mv²/r", size=24, weight="bold")
    s.text(530, 230, "v = ωr", size=24, weight="bold")
    s.text(530, 270, "T = 2πr/v", size=24, weight="bold")
    return s


@fig
def pendulum_and_spring():
    s = Svg(660, 400, "A simple pendulum and a mass on a spring",
            "Left: a bob on a string of length l swings through its equilibrium position. Right: a mass hangs on a spring and oscillates up and down about its equilibrium position.")
    s.rect(40, 40, 260, 14, fill=F_GREY, stroke=INK, width=2.5)
    pv = (170, 54)
    L = 260
    for ang, dash in ((-20, "7 6"), (0, None), (20, "7 6")):
        b = (pv[0] + L * math.sin(math.radians(ang)), pv[1] + L * math.cos(math.radians(ang)))
        s.line(*pv, *b, color=MUTED if dash else INK, width=2.5, dash=dash)
        s.circle(*b, 18, fill=F_BLUE if not dash else BG, stroke=INK, width=2.5, dash=dash)
    s.label(150, 190, "l", size=26, italic=True, weight="bold")
    s.text(170, 370, "T = 2π√(l/g)", size=24, weight="bold")
    s.path("M 100 300 Q 170 340 240 300", color=RED, width=2.5, arrow="end")
    s.rect(400, 40, 220, 14, fill=F_GREY, stroke=INK, width=2.5)
    x = 510
    pts = [(x, 54), (x, 74)]
    for i in range(10):
        pts.append((x + (22 if i % 2 == 0 else -22), 84 + i * 14))
    pts += [(x, 230), (x, 245)]
    s.polyline(pts, width=2.5)
    s.rect(x - 34, 245, 68, 56, fill=F_AMBER, stroke=INK, width=3, rx=4)
    s.text(x, 273, "m", size=24, italic=True, weight="bold")
    s.line(x - 60, 273, x + 60, 273, color=GRID, width=2, dash="6 6")
    s.arrow(x + 70, 273, x + 70, 223, color=RED, width=3)
    s.arrow(x + 70, 273, x + 70, 323, color=RED, width=3)
    s.text(510, 370, "T = 2π√(m/k)", size=24, weight="bold")
    return s


@fig
def shm_displacement_time():
    s = Svg(660, 330, "Displacement-time graph for simple harmonic motion",
            "Displacement varies as a sine curve between +A and -A. One period T is the time for one complete oscillation.")
    x0, ym, x1 = 80, 170, 620
    s.arrow(x0, 300, x0, 40, width=2.5)
    s.arrow(x0, ym, x1, ym, width=2.5)
    s.text(x1, ym + 26, "time", size=20, anchor="end", color=MUTED)
    s.text(x0 + 10, 40, "displacement x", size=20, anchor="start", color=MUTED, baseline="auto")
    A = 100
    pts = [(x0 + i * 4.8, ym - A * math.sin(2 * math.pi * i / 100)) for i in range(111)]
    s.polyline(pts, color=BLUE, width=4.5)
    s.line(x0 - 6, ym - A, 600, ym - A, color=GRID, width=1.5, dash="5 6")
    s.line(x0 - 6, ym + A, 600, ym + A, color=GRID, width=1.5, dash="5 6")
    s.text(x0 - 12, ym - A, "+A", size=21, anchor="end", weight="bold")
    s.text(x0 - 12, ym + A, "−A", size=21, anchor="end", weight="bold")
    s.line(x0, 300, x0 + 480, 300, width=0.01)
    s.arrow(x0, 296, x0 + 480, 296, color=RED, width=2.5)
    s.arrow(x0 + 480, 296, x0, 296, color=RED, width=2.5)
    s.label(x0 + 240, 296, "one period T", size=20, color=RED, weight="bold")
    s.arrow(x0 + 120, ym, x0 + 120, ym - A + 4, color=GREEN, width=2.5)
    s.text(x0 + 132, ym - 50, "amplitude A", size=19, color=GREEN, anchor="start", weight="bold")
    return s


# ═══ Work, energy and machines ═══════════════════════════════════════════════

@fig
def work_area_graph():
    s = Svg(640, 360, "Work done from a force-distance graph",
            "Force against distance for a spring: a straight line from the origin. The work done is the area of the triangle under the line.")
    x0, y0 = 90, 300
    s.axes(x0, y0, 600, 40, "extension / m", "force F / N")
    s.polygon([(x0, y0), (420, 90), (420, y0)], fill=F_GREEN, stroke="none", width=0)
    s.line(x0, y0, 420, 90, color=BLUE, width=5)
    s.line(420, 90, 420, y0, color=MUTED, width=2, dash="6 6")
    s.line(x0, 90, 420, 90, color=GRID, width=1.5, dash="6 6")
    s.text(x0 - 12, 90, "F", size=22, anchor="end", italic=True, weight="bold")
    s.text(420, y0 + 24, "x", size=22, italic=True, weight="bold")
    s.text(320, 250, "work done = area", size=22, color=GREEN, weight="bold")
    s.text(320, 278, "= ½ F x", size=22, color=GREEN)
    return s


@fig
def lever_classes():
    s = Svg(640, 520, "The three classes of lever",
            "First class: fulcrum between effort and load (see-saw, crowbar). Second class: load between fulcrum and effort (wheelbarrow). Third class: effort between fulcrum and load (forearm, tweezers).")
    rows = [
        ("Class 1: fulcrum in the middle", ["E", "F", "L"], "e.g. crowbar, see-saw, scissors"),
        ("Class 2: load in the middle", ["F", "L", "E"], "e.g. wheelbarrow, bottle opener"),
        ("Class 3: effort in the middle", ["F", "E", "L"], "e.g. forearm, tweezers, fishing rod"),
    ]
    for i, (title, order, eg) in enumerate(rows):
        top = 20 + i * 160
        s.text(30, top + 18, title, size=21, weight="bold", anchor="start")
        s.text(30, top + 44, eg, size=18, color=MUTED, anchor="start")
        y = top + 112                      # beam centre line
        s.rect(90, y - 7, 460, 14, fill=F_AMBER, stroke=INK, width=2.5, rx=3)
        xs = [120, 320, 520]
        for x, k in zip(xs, order):
            if k == "F":
                s.polygon([(x, y + 7), (x - 20, y + 42), (x + 20, y + 42)], fill=F_GREY, stroke=INK, width=2.5)
                s.text(x, y + 56, "fulcrum", size=16, color=MUTED)
            elif k == "L":
                s.rect(x - 22, y - 43, 44, 36, fill=F_BLUE, stroke=INK, width=2.5, rx=3)
                s.arrow(x, y - 25, x, y + 40, color=RED, width=3.5)
                s.text(x + 30, y - 32, "load", size=17, color=RED, weight="bold", anchor="start")
            else:
                if order[0] == "E":          # class 1: push the end down
                    s.arrow(x, y - 60, x, y - 10, color=BLUE, width=4)
                    s.text(x + 14, y - 46, "effort", size=17, color=BLUE, weight="bold", anchor="start")
                else:                        # classes 2 and 3: lift
                    s.arrow(x, y + 56, x, y + 10, color=BLUE, width=4)
                    s.text(x + 14, y + 46, "effort", size=17, color=BLUE, weight="bold", anchor="start")
    return s

@fig
def pulley_block_and_tackle():
    s = Svg(560, 480, "Block and tackle pulley system",
            "Two pulley blocks: the upper one hangs from a beam and the lower one carries the load. Four strands of rope support the lower block, so the velocity ratio is 4. The effort pulls down on the free end of the rope.")
    s.rect(40, 26, 400, 18, fill=F_GREY, stroke=INK, width=2.5)
    s.line(250, 44, 250, 70, width=3)
    s.rect(180, 70, 140, 64, fill=METAL, stroke=INK, width=2.5, rx=12)
    s.rect(180, 270, 140, 64, fill=METAL, stroke=INK, width=2.5, rx=12)
    for cx in (215, 285):
        s.circle(cx, 102, 24, fill=BG, stroke=INK, width=2.5)
        s.circle(cx, 302, 24, fill=BG, stroke=INK, width=2.5)
    for x in (191, 239, 261, 309):           # the four strands holding the lower block
        s.line(x, 102, x, 302, color=BLUE, width=3.5)
    s.path("M 309 102 A 24 24 0 0 0 285 78 L 360 78", color=BLUE, width=3.5)   # over the top pulley to the free end
    s.path("M 360 78 Q 384 78 384 102 L 384 400", color=BLUE, width=3.5)
    s.arrow(384, 380, 384, 446, color=BLUE, width=4.5)
    s.text(398, 430, "effort E", size=21, color=BLUE, weight="bold", anchor="start")
    s.line(250, 334, 250, 362, width=3)
    s.rect(210, 362, 80, 58, fill=F_AMBER, stroke=INK, width=3, rx=4)
    s.text(250, 391, "load", size=21, weight="bold")
    s.text(100, 190, "4 strands", size=21, weight="bold", color=RED)
    s.text(100, 216, "support the", size=18, color=RED)
    s.text(100, 240, "lower block", size=18, color=RED)
    s.text(100, 290, "VR = 4", size=24, weight="bold")
    return s

@fig
def inclined_plane_machine():
    s = Svg(640, 360, "The inclined plane as a machine",
            "A load is pushed up a slope of length l to a height h. The velocity ratio is l divided by h, which equals 1 over sin theta.")
    A, B, C = (60, 300), (580, 300), (580, 120)
    s.polygon([A, B, C], fill=F_GREY, stroke=INK, width=3)
    th = math.degrees(math.atan2(180, 520))
    s.arc(A[0], A[1], 80, 0, th, width=2.5)
    s.text(A[0] + 100, A[1] - 14, "θ", size=24, italic=True)
    t = 0.6
    bx, by = A[0] + (C[0] - A[0]) * t, A[1] + (C[1] - A[1]) * t
    ang = math.atan2(C[1] - A[1], C[0] - A[0])
    w, h = 70, 46
    ux, uy = math.cos(ang), math.sin(ang)
    nx, ny = uy, -ux
    p0 = (bx - ux * w / 2, by - uy * w / 2)
    p1 = (bx + ux * w / 2, by + uy * w / 2)
    s.polygon([p0, p1, (p1[0] + nx * h, p1[1] + ny * h), (p0[0] + nx * h, p0[1] + ny * h)], fill=F_AMBER, stroke=INK, width=3)
    s.arrow(p0[0] + nx * h / 2 - ux * 110, p0[1] + ny * h / 2 - uy * 110, p0[0] + nx * h / 2 - 2, p0[1] + ny * h / 2, color=BLUE, width=5)
    s.text(p0[0] - ux * 120 + 6, p0[1] - uy * 120 - 40, "effort", size=20, color=BLUE, weight="bold")
    s.text(300, 175, "l", size=26, italic=True, weight="bold")
    s.arrow(605, 300, 605, 122, color=INK, width=2)
    s.arrow(605, 122, 605, 300, color=INK, width=2)
    s.text(620, 212, "h", size=26, italic=True, weight="bold", anchor="start")
    s.text(320, 336, "VR = l / h = 1 / sin θ", size=24, weight="bold")
    return s


# ═══ Matter and fluids ══════════════════════════════════════════════════════

@fig
def states_of_matter():
    import random
    rnd = random.Random(7)
    s = Svg(660, 330, "Particles in a solid, a liquid and a gas",
            "Solid: particles closely packed in a regular pattern, vibrating about fixed positions. Liquid: particles close together but irregular and able to move past one another. Gas: particles far apart moving rapidly in all directions.")
    titles = ["Solid", "Liquid", "Gas"]
    notes = ["vibrate about fixed positions", "close, but slide past each other", "far apart, fast, random"]
    for i in range(3):
        x0 = 20 + i * 215
        s.rect(x0, 50, 195, 200, fill=BG, stroke=INK, width=3, rx=6)
        s.text(x0 + 97, 30, titles[i], size=22, weight="bold")
        s.text(x0 + 97, 278, notes[i], size=16, color=MUTED)
        if i == 0:
            for r in range(6):
                for c in range(6):
                    s.circle(x0 + 26 + c * 29, 76 + r * 30, 12, fill=F_BLUE, stroke=BLUE, width=2)
        elif i == 1:
            pts = []
            for r in range(4):                 # a loose, jittered arrangement filling the lower part
                for c in range(6):
                    if (r, c) in ((0, 1), (0, 4), (1, 2)):
                        continue                # gaps: a liquid is not a perfect lattice
                    pts.append((x0 + 24 + c * 29 + rnd.uniform(-5, 5) + (8 if r % 2 else 0) * 0.5,
                                128 + r * 30 + rnd.uniform(-4, 4)))
            s.line(x0 + 4, 110, x0 + 191, 110, color=BLUE, width=1.5, dash="5 5")
            for p in pts:
                s.circle(*p, 12, fill=F_BLUE, stroke=BLUE, width=2)
        else:
            pts = [(x0 + 30 + rnd.random() * 135, 75 + rnd.random() * 150) for _ in range(7)]
            for p in pts:
                s.circle(*p, 12, fill=F_BLUE, stroke=BLUE, width=2)
                a = rnd.random() * 6.28
                s.arrow(p[0] + 14 * math.cos(a), p[1] + 14 * math.sin(a), p[0] + 44 * math.cos(a), p[1] + 44 * math.sin(a), color=RED, width=2)
    s.text(330, 310, "From solid to gas: spacing, freedom and speed of particles increase", size=17, color=MUTED)
    return s


@fig
def hooke_graph():
    s = Svg(640, 400, "Load against extension for a metal wire",
            "A straight line from the origin up to the limit of proportionality P, where Hooke's law holds. Beyond the elastic limit E the wire is permanently stretched; Y is the yield point and B the breaking point.")
    x0, y0 = 90, 340
    s.axes(x0, y0, 610, 40, "extension e", "load F")
    P = (290, 150)
    E = (310, 132)
    Y = (350, 118)
    pts = [(x0, y0), P, E, Y, (400, 112), (470, 100), (530, 96), (565, 104)]
    s.polyline(pts[:2], color=BLUE, width=5)
    s.path(f"M {P[0]} {P[1]} Q {E[0]} {E[1] - 4} {Y[0]} {Y[1]} Q 380 120 400 112 Q 480 86 530 96 L 565 104", color=RED, width=4)
    for (pt, lab, dx, dy) in ((P, "P", -18, -14), (E, "E", -4, -22), (Y, "Y", 6, -22), ((565, 104), "B", 14, -10)):
        s.dot(*pt, 6)
        s.text(pt[0] + dx, pt[1] + dy, lab, size=22, weight="bold")
    s.text(175, 290, "Hooke's law region:", size=19, color=BLUE, weight="bold", anchor="start")
    s.text(175, 314, "F = ke (straight line)", size=19, color=BLUE, anchor="start")
    s.text(470, 150, "plastic region", size=19, color=RED, weight="bold")
    s.text(320, 380, "P limit of proportionality · E elastic limit · Y yield point · B breaking point", size=15, color=MUTED)
    return s


@fig
def capillarity():
    s = Svg(660, 360, "Capillary rise and capillary depression",
            "Left: in narrow glass tubes dipped in water, water rises higher in the narrower tube and its surface curves upwards. Right: in mercury, the level in the tube is pushed below the outside level and the surface curves downwards.")
    s.rect(30, 210, 300, 110, fill=WATER, stroke=INK, width=3)
    s.text(180, 340, "Water", size=20, weight="bold")
    for x, w, top in ((90, 14, 70), (180, 26, 130), (260, 40, 165)):
        s.rect(x - w / 2, 50, w, 250, fill="none", stroke=INK, width=2.5)
        s.rect(x - w / 2 + 2, top, w - 4, 300 - top, fill=WATER, stroke="none", width=0)
        s.path(f"M {x - w / 2 + 2} {top - 6} Q {x} {top + 6} {x + w / 2 - 2} {top - 6}", color=BLUE, width=2.5)
    s.text(180, 30, "narrower tube → higher rise", size=18, color=BLUE, weight="bold")
    s.rect(360, 210, 270, 110, fill=METAL, stroke=INK, width=3)
    s.text(495, 340, "Mercury", size=20, weight="bold")
    for x, w, top in ((440, 18, 268), (550, 34, 240)):
        s.rect(x - w / 2, 120, w, 180, fill="none", stroke=INK, width=2.5)
        s.rect(x - w / 2 + 2, top, w - 4, 300 - top, fill=METAL, stroke="none", width=0)
        s.path(f"M {x - w / 2 + 2} {top + 6} Q {x} {top - 8} {x + w / 2 - 2} {top + 6}", color=INK, width=2.5)
    s.line(360, 210, 630, 210, width=3)
    s.text(495, 95, "level pushed down", size=18, color=INK, weight="bold")
    return s


@fig
def pressure_depth():
    s = Svg(640, 380, "Pressure increases with depth",
            "A tall can of water with three holes at different depths. Water spurts out furthest from the lowest hole because the pressure there is greatest. Pressure p = h rho g.")
    s.rect(80, 50, 160, 290, fill=WATER, stroke=INK, width=3)
    s.line(80, 50, 240, 50, color=BLUE, width=2)
    for i, (y, reach) in enumerate(((120, 60), (200, 120), (280, 190))):
        s.circle(240, y, 5, fill=INK, stroke=INK, width=1)
        s.path(f"M 242 {y} Q {242 + reach * 0.45} {y - 4} {242 + reach} {345}", color=BLUE, width=4)
    s.hatch_ground(40, 620, 345)
    s.arrow(60, 52, 60, 278, color=RED, width=2.5)
    s.text(48, 165, "h", size=24, italic=True, weight="bold", anchor="end", color=RED)
    s.text(470, 90, "p = hρg", size=30, weight="bold")
    s.text(470, 130, "deeper → greater pressure", size=19, color=MUTED)
    s.text(470, 156, "→ water jets out further", size=19, color=MUTED)
    return s


@fig
def mercury_barometer():
    s = Svg(560, 420, "A simple mercury barometer",
            "A long glass tube full of mercury is inverted in a dish of mercury. The mercury falls until the column is about 760 mm high; the space above it is a vacuum. Atmospheric pressure on the dish supports the column.")
    s.rect(120, 320, 280, 70, fill=METAL, stroke=INK, width=3)
    s.rect(240, 40, 40, 330, fill="none", stroke=INK, width=3)
    s.rect(243, 120, 34, 250, fill=METAL, stroke="none", width=0)
    s.line(243, 120, 277, 120, color=INK, width=2)
    s.text(300, 78, "vacuum (Torricellian)", size=19, anchor="start", color=MUTED)
    s.line(285, 78, 296, 78, color=MUTED, width=2)
    s.arrow(330, 322, 330, 122, color=RED, width=2.5)
    s.arrow(330, 122, 330, 322, color=RED, width=2.5)
    s.text(342, 222, "h ≈ 760 mm", size=21, weight="bold", color=RED, anchor="start")
    s.line(277, 120, 345, 120, color=GRID, width=2, dash="5 5")
    s.line(400, 320, 345, 320, color=GRID, width=2, dash="5 5")
    for x in (150, 190, 350, 380):
        s.arrow(x, 260, x, 314, color=BLUE, width=3)
    s.text(120, 250, "air pressure", size=19, color=BLUE, weight="bold", anchor="start")
    s.text(260, 408, "mercury", size=18, color=MUTED)
    return s


@fig
def archimedes():
    s = Svg(660, 450, "Archimedes' principle",
            "A stone hangs from a spring balance. In air it weighs 5 N. Lowered into a full displacement can, it weighs 3 N and pushes out 2 N of water: the upthrust equals the weight of water displaced.")
    for i, (reading, inwater) in enumerate((("5 N", False), ("3 N", True))):
        x = 140 + i * 280
        s.line(x, 20, x, 50, width=3)
        s.rect(x - 26, 50, 52, 100, fill=F_GREY, stroke=INK, width=2.5, rx=6)
        s.text(x, 100, reading, size=22, weight="bold", color=RED)
        s.line(x, 150, x, 220 if not inwater else 250, width=2)
        stone_y = 220 if not inwater else 250
        s.ellipse(x, stone_y + 22, 32, 24, fill="#94a3b8", stroke=INK, width=2.5)
        s.text(x, 376, "in air" if not inwater else "in water", size=20, weight="bold", color=MUTED)
        if inwater:
            s.rect(x - 70, 200, 140, 150, fill=WATER, stroke=INK, width=3)
            s.ellipse(x, stone_y + 22, 32, 24, fill="#94a3b8", stroke=INK, width=2.5)
            s.line(x + 70, 210, x + 110, 210, width=3)
            s.path(f"M {x + 110} 212 Q {x + 125} 240 {x + 125} 300", color=BLUE, width=3)
            s.rect(x + 100, 300, 60, 50, fill=WATER, stroke=INK, width=2.5)
            s.text(x + 130, 285, "2 N", size=19, weight="bold", color=BLUE)
    s.text(330, 414, "upthrust = 5 − 3 = 2 N = weight of water displaced", size=20, weight="bold")
    return s


# ═══ Heat ════════════════════════════════════════════════════════════════════

@fig
def thermometer_fixed_points():
    s = Svg(660, 420, "A liquid-in-glass thermometer and its fixed points",
            "A mercury thermometer with a bulb and a narrow capillary tube. The lower fixed point is 0 °C (melting ice) and the upper fixed point is 100 °C (steam at standard pressure).")
    s.rect(270, 40, 30, 300, fill="#ffffff", stroke=INK, width=3, rx=14)
    s.circle(285, 360, 30, fill=METAL, stroke=INK, width=3)
    s.rect(280, 150, 10, 200, fill=METAL, stroke="none", width=0)
    for t in range(0, 101, 10):
        y = 320 - t * 2.4
        s.line(300, y, 312 if t % 50 else 322, y, width=2)
        if t % 50 == 0:
            s.text(330, y, f"{t} °C", size=19, anchor="start", weight="bold")
    s.text(420, 80, "upper fixed point:", size=19, anchor="start", color=RED, weight="bold")
    s.text(420, 104, "steam above boiling water", size=17, anchor="start", color=RED)
    s.text(420, 310, "lower fixed point:", size=19, anchor="start", color=BLUE, weight="bold")
    s.text(420, 334, "pure melting ice", size=17, anchor="start", color=BLUE)
    s.text(150, 200, "capillary", size=18, anchor="end", color=MUTED)
    s.line(155, 200, 265, 200, color=MUTED, width=1.5)
    s.text(150, 360, "bulb", size=18, anchor="end", color=MUTED)
    s.line(155, 360, 253, 360, color=MUTED, width=1.5)
    return s


@fig
def bimetallic_strip():
    s = Svg(640, 320, "A bimetallic strip bends when heated",
            "Brass and iron strips riveted together. When heated, brass expands more than iron, so the strip bends with the brass on the outside of the curve.")
    s.text(160, 40, "Cold", size=21, weight="bold")
    s.rect(40, 80, 240, 16, fill=F_AMBER, stroke=INK, width=2)
    s.rect(40, 96, 240, 16, fill=METAL, stroke=INK, width=2)
    s.text(160, 68, "brass", size=17, color=ORANGE)
    s.text(160, 132, "iron", size=17, color=MUTED)
    s.text(470, 40, "Heated", size=21, weight="bold")
    s.path("M 360 90 Q 470 70 590 170", color=INK, width=18, join="round")
    s.path("M 360 90 Q 470 70 590 170", color="#fcd34d", width=14)
    s.path("M 360 106 Q 465 88 578 184", color=INK, width=18)
    s.path("M 360 106 Q 465 88 578 184", color=METAL, width=14)
    s.text(320, 240, "brass expands more, so it ends up on the outside of the curve", size=17, color=MUTED)
    s.text(320, 290, "Used in thermostats, fire alarms and flashing indicator lamps", size=18, weight="bold")
    return s


@fig
def water_anomalous():
    s = Svg(640, 380, "Anomalous expansion of water",
            "Volume of a fixed mass of water against temperature from 0 to 10 degrees Celsius. The volume is smallest, and the density greatest, at 4 degrees Celsius.")
    x0, y0 = 90, 320
    s.axes(x0, y0, 600, 40, "temperature / °C", "volume")
    # screen y grows downwards: the lowest point of the curve is the smallest volume
    pts = [(x0 + 10 + t * 48, 250 - 4.5 * (t - 4) ** 2) for t in [i / 10 for i in range(0, 101)]]
    s.polyline(pts, color=BLUE, width=5)
    mx = x0 + 10 + 4 * 48
    s.line(mx, 250, mx, y0, color=GRID, width=2, dash="6 6")
    s.text(mx, y0 + 24, "4", size=20, weight="bold")
    for t in (0, 10):
        s.text(x0 + 10 + t * 48, y0 + 24, str(t), size=18, color=MUTED)
    s.dot(mx, 250, 7, color=RED)
    s.label(mx + 14, 284, "minimum volume, maximum density", size=18, color=RED, weight="bold", anchor="start")
    return s


@fig
def heating_curve():
    s = Svg(660, 400, "Heating curve of water",
            "Temperature against time as ice at -10 degrees Celsius is heated steadily. The temperature stays at 0 degrees while ice melts and at 100 degrees while water boils; latent heat is absorbed in these flat sections.")
    x0, y0 = 90, 340
    s.axes(x0, y0, 630, 40, "time", "temperature / °C")
    def Y(t):
        return 300 - t * 2.2
    pts = [(x0, Y(-10)), (140, Y(0)), (240, Y(0)), (380, Y(100)), (560, Y(100)), (600, Y(118))]
    s.polyline(pts, color=RED, width=5)
    s.line(x0 - 6, Y(0), 140, Y(0), color=GRID, width=1.5, dash="5 6")
    s.line(x0 - 6, Y(100), 380, Y(100), color=GRID, width=1.5, dash="5 6")
    s.text(x0 - 12, Y(0), "0", size=20, anchor="end", weight="bold")
    s.text(x0 - 12, Y(100), "100", size=20, anchor="end", weight="bold")
    s.text(190, Y(0) + 26, "melting", size=18, color=BLUE, weight="bold")
    s.text(190, Y(0) + 48, "(ice + water)", size=16, color=BLUE)
    s.text(470, Y(100) - 22, "boiling (water + steam)", size=18, color=BLUE, weight="bold")
    s.text(122, Y(-10) - 30, "ice", size=17, color=MUTED)
    s.text(285, Y(50) - 12, "water", size=17, color=MUTED)
    s.text(600, Y(118) - 18, "steam", size=17, color=MUTED)
    s.text(360, 380, "flat sections: latent heat changes the state, not the temperature", size=17, color=MUTED)
    return s


@fig
def vacuum_flask():
    s = Svg(790, 440, "A vacuum flask",
            "A double-walled glass bottle with a vacuum between the walls, silvered surfaces, an insulating stopper and a protective case resting on insulating supports.")
    s.rect(140, 70, 280, 340, fill=F_GREY, stroke=INK, width=3, rx=24)
    s.rect(180, 110, 200, 270, fill="#ffffff", stroke=INK, width=3, rx=30)
    s.rect(196, 126, 168, 238, fill=F_AMBER, stroke="#9ca3af", width=4, rx=22)
    s.rect(212, 142, 136, 206, fill=WATER, stroke=INK, width=3, rx=16)
    s.rect(230, 70, 100, 80, fill="#a16207", stroke=INK, width=3, rx=8)
    s.rect(210, 380, 40, 30, fill="#a16207", stroke=INK, width=2)
    s.rect(310, 380, 40, 30, fill="#a16207", stroke=INK, width=2)
    labels = [
        ("stopper: cuts conduction and convection", 300, 76, 40),
        ("silvered walls: cut radiation", 362, 200, 160),
        ("vacuum: no conduction or convection", 372, 300, 260),
        ("insulating supports", 340, 395, 410),
    ]
    for text, px, py, ty in labels:
        s.line(px, py, 430, ty, color=MUTED, width=1.5)
        s.text(436, ty, text, size=16, anchor="start", weight="bold")
    s.text(280, 250, "hot drink", size=18, weight="bold")
    return s


@fig
def gas_law_graphs():
    s = Svg(660, 330, "Graphs of Boyle's law and Charles's law",
            "Left: pressure against volume at constant temperature is a curve (a hyperbola). Middle: pressure against 1/V is a straight line through the origin. Right: volume against temperature in Celsius is a straight line that meets the temperature axis at -273 degrees Celsius.")
    # Boyle p-V
    def frame(x0, title, xl, yl):
        s.arrow(x0, 250, x0 + 170, 250, width=2.2)
        s.arrow(x0, 250, x0, 60, width=2.2)
        s.text(x0 + 85, 290, title, size=17, weight="bold")
        s.text(x0 + 170, 270, xl, size=16, color=MUTED, anchor="end")
        s.text(x0 + 8, 58, yl, size=16, color=MUTED, anchor="start", baseline="auto")
    frame(40, "Boyle: p against V", "V", "p")
    pts = [(40 + v, 250 - 3600 / v) for v in range(20, 165, 4)]
    s.polyline([(x, max(y, 70)) for x, y in pts], color=BLUE, width=4)
    frame(255, "Boyle: p against 1/V", "1/V", "p")
    s.line(255, 250, 410, 90, color=BLUE, width=4)
    # θ axis runs left of the V axis (which sits at 0 °C) so -273 °C can be shown
    s.arrow(450, 250, 640, 250, width=2.2)
    s.arrow(545, 250, 545, 60, width=2.2)
    s.text(545, 290, "Charles: V against θ", size=17, weight="bold")
    s.text(640, 270, "θ / °C", size=16, color=MUTED, anchor="end")
    s.text(553, 58, "V", size=16, color=MUTED, anchor="start", baseline="auto")
    s.line(462, 250, 545, 178, color=RED, width=2.5, dash="6 5")
    s.line(545, 178, 630, 104, color=RED, width=4)
    s.dot(462, 250, 5, color=RED)
    s.text(470, 228, "−273", size=15, color=RED, weight="bold", anchor="middle")
    s.text(545, 268, "0", size=14, color=MUTED)
    s.text(330, 28, "Gas laws for a fixed mass of gas", size=19, color=MUTED)
    return s


# ═══ Waves and sound ═════════════════════════════════════════════════════════

@fig
def transverse_wave():
    s = Svg(660, 360, "A transverse wave",
            "Displacement against distance for a transverse wave, showing crests, troughs, the amplitude and the wavelength.")
    x0, ym, x1 = 50, 200, 630
    s.line(x0, ym, x1, ym, color=GRID, width=2)
    A, lam = 90, 240
    pts = [(x0 + i, ym - A * math.sin(2 * math.pi * i / lam)) for i in range(0, 561, 3)]
    s.polyline(pts, color=BLUE, width=5)
    s.text(x0 + 5 * lam / 4, ym - A - 20, "crest", size=20, weight="bold", color=BLUE)
    s.text(x0 + 3 * lam / 4, ym + A + 28, "trough", size=20, weight="bold", color=BLUE)
    cx = x0 + lam / 4
    s.arrow(cx, ym, cx, ym - A + 3, color=GREEN, width=3)
    s.text(cx + 12, ym - A / 2, "amplitude a", size=19, color=GREEN, weight="bold", anchor="start")
    y = 40
    s.line(x0 + lam / 4, y + 10, x0 + lam / 4, y - 10, color=RED, width=2)
    s.line(x0 + 5 * lam / 4, y + 10, x0 + 5 * lam / 4, y - 10, color=RED, width=2)
    s.line(x0 + lam / 4, y + 10, x0 + lam / 4, ym - A, color=RED, width=1.2, dash="4 5")
    s.line(x0 + 5 * lam / 4, y + 10, x0 + 5 * lam / 4, ym - A, color=RED, width=1.2, dash="4 5")
    s.arrow(x0 + lam * 0.75, y, x0 + lam / 4 + 2, y, color=RED, width=2.5)
    s.arrow(x0 + lam * 0.75, y, x0 + 5 * lam / 4 - 2, y, color=RED, width=2.5)
    s.label(x0 + lam * 0.75, y, "wavelength λ", size=19, color=RED, weight="bold")
    s.text(630, ym + 24, "distance", size=17, color=MUTED, anchor="end")
    s.arrow(610, 340, 610, 290, color=ORANGE, width=3)
    s.text(598, 326, "particles move up and down", size=16, color=ORANGE, anchor="end")
    return s

@fig
def longitudinal_wave():
    s = Svg(660, 260, "A longitudinal wave",
            "A longitudinal wave in a spring or in air: regions where the particles are crowded together are compressions and regions where they are spread out are rarefactions. The wavelength is the distance between two compressions.")
    xs = []
    x = 40.0
    while x < 630:
        xs.append(x)
        phase = math.cos(2 * math.pi * (x - 40) / 200)
        x += 13 - 7 * phase
    for xx in xs:
        s.line(xx, 70, xx, 170, color=BLUE, width=3)
    for k, cx in enumerate((40, 240, 440)):
        s.text(cx + 4, 196, "C", size=20, weight="bold", color=RED)
    for cx in (140, 340, 540):
        s.text(cx, 196, "R", size=20, weight="bold", color=GREEN)
    s.text(40, 226, "C = compression (crowded)   R = rarefaction (spread out)", size=17, color=MUTED, anchor="start")
    s.line(40, 50, 40, 36, color=RED, width=2)
    s.line(240, 50, 240, 36, color=RED, width=2)
    s.arrow(140, 43, 42, 43, color=RED, width=2.5)
    s.arrow(140, 43, 238, 43, color=RED, width=2.5)
    s.label(140, 43, "λ", size=22, color=RED, weight="bold", italic=True)
    s.arrow(520, 30, 620, 30, color=ORANGE, width=3)
    s.arrow(620, 30, 520, 30, color=ORANGE, width=3)
    s.text(570, 54, "particles move to and fro", size=15, color=ORANGE)
    return s


@fig
def wave_refraction():
    s = Svg(660, 380, "Refraction of water waves",
            "Straight water waves pass from deep water into shallow water across a boundary at an angle. In shallow water they move more slowly, their wavelength is shorter and their direction bends towards the normal.")
    bx = 330
    s.raw('<defs><clipPath id="cdeep"><rect x="30" y="30" width="300" height="320"/></clipPath><clipPath id="cshal"><rect x="330" y="30" width="300" height="320"/></clipPath></defs>')
    s.rect(30, 30, 300, 320, fill=WATER, stroke="none", width=0)
    s.rect(330, 30, 300, 320, fill="#e0f2fe", stroke="none", width=0)
    i = math.radians(45)
    r = math.asin(math.sin(i) * 0.6)          # waves travel 0.6 times as fast in shallow water
    d1 = 46                                   # wavelength in deep water (px)
    step = d1 / math.sin(i)                   # spacing of wavefronts along the boundary
    for k in range(-4, 12):
        yk = 20 + k * step
        dx1, dy1 = math.sin(i), math.cos(i)   # wavefront direction in deep water
        dx2, dy2 = math.sin(r), math.cos(r)   # wavefront direction in shallow water
        s.raw('<g clip-path="url(#cdeep)">')
        s.line(bx - 600 * dx1, yk - 600 * dy1, bx, yk, color=BLUE, width=3)
        s.raw('</g><g clip-path="url(#cshal)">')
        s.line(bx, yk, bx + 600 * dx2, yk + 600 * dy2, color=BLUE, width=3)
        s.raw('</g>')
    s.line(bx, 30, bx, 350, color=INK, width=3)
    s.line(60, 200, 600, 200, color=MUTED, width=1.5, dash="6 6")
    s.text(600, 188, "normal", size=15, color=MUTED, anchor="end")
    s.arrow(120, 280, 120 + 120 * math.cos(i), 280 - 120 * math.sin(i), color=RED, width=3.5)
    s.arrow(430, 260, 430 + 140 * math.cos(r), 260 - 140 * math.sin(r), color=RED, width=3.5)
    s.label(180, 50, "deep water", size=18, weight="bold")
    s.label(480, 50, "shallow water", size=18, weight="bold")
    s.label(480, 330, "slower · shorter λ · bends towards the normal", size=15, color=INK)
    return s

@fig
def diffraction_gaps():
    s = Svg(660, 330, "Diffraction of waves at a gap",
            "Left: plane waves pass through a wide gap and continue mostly straight with slight spreading at the edges. Right: through a narrow gap about one wavelength wide, the waves spread out in circular arcs.")
    for i, (gap, title) in enumerate(((150, "wide gap: little spreading"), (34, "narrow gap: strong spreading"))):
        x0 = 20 + i * 330
        cx = x0 + 150
        for k in range(4):
            y = 60 + k * 28
            s.line(x0 + 40, y, x0 + 260, y, color=BLUE, width=3)
        by = 175
        s.rect(x0 + 20, by - 6, 130 - gap / 2, 12, fill=INK, stroke=INK, width=1)
        s.rect(cx + gap / 2, by - 6, 280 - (cx + gap / 2 - x0), 12, fill=INK, stroke=INK, width=1)
        for k in range(1, 5):
            r = k * 28
            if gap > 100:
                s.line(cx - gap / 2 + 6, by + r, cx + gap / 2 - 6, by + r, color=BLUE, width=3)
                s.arc(cx - gap / 2 + 6, by + r - 0, 0.01, 180, 180, width=0.1)
                s.path(f"M {cx - gap / 2 + 6} {by + r} Q {cx - gap / 2 - 12} {by + r - 2} {cx - gap / 2 - 18} {by + r - 14}", color=BLUE, width=3)
                s.path(f"M {cx + gap / 2 - 6} {by + r} Q {cx + gap / 2 + 12} {by + r - 2} {cx + gap / 2 + 18} {by + r - 14}", color=BLUE, width=3)
            else:
                s.path(f"M {cx - r * 0.97} {by + r * 0.24} A {r} {r} 0 0 0 {cx + r * 0.97} {by + r * 0.24}", color=BLUE, width=3)
        s.text(cx, 314, title, size=17, weight="bold")
    return s


@fig
def stationary_waves_string():
    s = Svg(660, 400, "Stationary waves on a stretched string",
            "A string fixed at both ends vibrating in its fundamental mode (one loop, length equals half a wavelength) and its second harmonic (two loops). N marks nodes and A antinodes.")
    for row, loops in enumerate((1, 2)):
        y = 130 + row * 160
        x0, x1 = 90, 570
        s.rect(x0 - 16, y - 40, 16, 80, fill=F_GREY, stroke=INK, width=2)
        s.rect(x1, y - 40, 16, 80, fill=F_GREY, stroke=INK, width=2)
        L = x1 - x0
        for sign in (1, -1):
            pts = [(x0 + t, y - sign * 50 * math.sin(math.pi * loops * t / L)) for t in range(0, L + 1, 4)]
            s.polyline(pts, color=BLUE if sign > 0 else "#93c5fd", width=4 if sign > 0 else 3, dash=None if sign > 0 else "8 6")
        for k in range(loops + 1):
            nx = x0 + k * L / loops
            s.dot(nx, y, 6, color=RED)
            s.text(nx, y + 26, "N", size=19, weight="bold", color=RED)
        for k in range(loops):
            ax = x0 + (k + 0.5) * L / loops
            s.text(ax, y - 66, "A", size=19, weight="bold", color=GREEN)
        s.text(30, y - 96, ["Fundamental: L = λ/2", "2nd harmonic: L = λ"][row], size=19, weight="bold", anchor="start")
    s.text(330, 385, "N = node (no movement)   A = antinode (largest movement)", size=16, color=MUTED)
    return s


@fig
def pipes_resonance():
    s = Svg(660, 360, "Resonance in closed and open pipes",
            "Left: a pipe closed at one end has a node at the closed end and an antinode at the open end; its fundamental wavelength is four times its length. Right: a pipe open at both ends has antinodes at both ends; its fundamental wavelength is twice its length.")
    def pipe(x0, closed, title, formula):
        L = 250
        y0, y1 = 70, 70 + L
        s.line(x0, y0, x0, y1, width=4)
        s.line(x0 + 90, y0, x0 + 90, y1, width=4)
        if closed:
            s.line(x0 - 4, y1, x0 + 94, y1, width=6)
        cx = x0 + 45
        if closed:
            pts_l = [(cx - 38 * math.cos(math.pi / 2 * t / L), y0 + t) for t in range(0, L + 1, 5)]
            pts_r = [(cx + 38 * math.cos(math.pi / 2 * t / L), y0 + t) for t in range(0, L + 1, 5)]
            s.text(cx + 70, y1, "N", size=20, weight="bold", color=RED)
            s.text(cx + 70, y0, "A", size=20, weight="bold", color=GREEN)
        else:
            pts_l = [(cx - 38 * abs(math.cos(math.pi * t / L)), y0 + t) for t in range(0, L + 1, 5)]
            pts_r = [(cx + 38 * abs(math.cos(math.pi * t / L)), y0 + t) for t in range(0, L + 1, 5)]
            s.text(cx + 70, y0, "A", size=20, weight="bold", color=GREEN)
            s.text(cx + 70, y0 + L / 2, "N", size=20, weight="bold", color=RED)
            s.text(cx + 70, y1, "A", size=20, weight="bold", color=GREEN)
        s.polyline(pts_l, color=BLUE, width=3)
        s.polyline(pts_r, color=BLUE, width=3)
        s.text(cx, 40, title, size=19, weight="bold")
        s.text(cx, 348, formula, size=19, weight="bold", color=RED)
    pipe(120, True, "closed pipe", "L = λ/4")
    pipe(420, False, "open pipe", "L = λ/2")
    return s


# ═══ Light ═══════════════════════════════════════════════════════════════════

@fig
def pinhole_camera():
    s = Svg(660, 320, "The pinhole camera",
            "Light from the top of an object passes through a small pinhole and reaches the bottom of the screen; light from the bottom reaches the top. The image is real and inverted.")
    s.rect(330, 70, 260, 180, fill=F_GREY, stroke=INK, width=3)
    s.rect(326, 150, 8, 20, fill=BG, stroke=BG, width=0)
    s.line(588, 70, 588, 250, color=MUTED, width=6)
    s.text(600, 280, "screen", size=17, color=MUTED)
    ox, oy_top, oy_bot = 110, 90, 230
    s.arrow(ox, oy_bot, ox, oy_top, color=GREEN, width=6)
    s.text(ox, 270, "object", size=18, weight="bold")
    px, py = 330, 160
    for (y_from, col) in ((oy_top, RED), (oy_bot, BLUE)):
        t = (588 - ox) / (px - ox)
        y_to = y_from + (py - y_from) * t
        s.mid_arrow(ox, y_from, 588, y_to, color=col, width=3, at=0.3)
    yi_top = oy_bot + (py - oy_bot) * (588 - ox) / (px - ox)
    yi_bot = oy_top + (py - oy_top) * (588 - ox) / (px - ox)
    s.arrow(578, yi_top, 578, yi_bot, color=GREEN, width=5)
    s.text(460, 290, "image: real, inverted", size=18, weight="bold", color=GREEN)
    s.text(330, 50, "pinhole", size=17, color=MUTED)
    return s


@fig
def shadows_eclipse():
    s = Svg(660, 330, "Umbra and penumbra",
            "An extended light source shines on an opaque ball. Behind the ball is a region of total shadow, the umbra, surrounded by a region of partial shadow, the penumbra.")
    sx, st, sb = 70, 120, 210
    s.rect(sx - 14, st, 28, sb - st, fill="#fde68a", stroke=ORANGE, width=3, rx=10)
    s.text(sx, 236, "extended source", size=16, color=ORANGE)
    bx, by, br = 300, 165, 34
    sc = 540
    def hit(y0, y1):
        return y0 + (y1 - y0) * (sc - sx) / (bx - sx)
    u_top = hit(st, by - br)
    u_bot = hit(sb, by + br)
    p_top = hit(sb, by - br)
    p_bot = hit(st, by + br)
    s.polygon([(bx, by - br), (sc, p_top), (sc, p_bot), (bx, by + br)], fill="#cbd5e1", stroke="none", width=0)
    s.polygon([(bx, by - br), (sc, u_top), (sc, u_bot), (bx, by + br)], fill="#475569", stroke="none", width=0)
    for (y0, y1) in ((st, by - br), (sb, by + br), (sb, by - br), (st, by + br)):
        s.line(sx, y0, sc, hit(y0, y1), color=ORANGE, width=1.5, dash="6 5")
    s.circle(bx, by, br, fill=INK, stroke=INK, width=2)
    s.line(sc, 40, sc, 290, color=MUTED, width=5)
    s.text(sc + 10, (u_top + u_bot) / 2, "umbra", size=18, weight="bold", anchor="start")
    s.text(sc + 10, p_top - 6, "penumbra", size=16, color=MUTED, anchor="start")
    s.text(sc + 10, p_bot + 14, "penumbra", size=16, color=MUTED, anchor="start")
    s.text(bx, by + br + 26, "opaque object", size=16, color=MUTED)
    return s


@fig
def plane_mirror_image():
    s = Svg(660, 360, "Image in a plane mirror",
            "Rays from a point object O reflect from a plane mirror into the eye. Traced back, they appear to come from the image I, as far behind the mirror as O is in front.")
    mx = 330
    s.line(mx, 40, mx, 320, color=INK, width=5)
    for y in range(48, 320, 16):
        s.line(mx + 2, y, mx + 14, y - 10, color=MUTED, width=1.5)
    O = (170, 180)
    I = (490, 180)
    s.dot(*O, 7, color=RED)
    s.text(O[0] - 18, O[1], "O", size=22, weight="bold", anchor="end")
    s.dot(*I, 6, color=MUTED)
    s.text(I[0] + 18, I[1], "I", size=22, weight="bold", anchor="start", color=MUTED)
    s.ellipse(150, 40, 22, 12, fill="#ffffff", stroke=INK, width=2.5)
    s.circle(150, 40, 6, fill=INK, stroke=INK, width=1)
    s.text(110, 40, "eye", size=16, color=MUTED, anchor="end")
    for yy in (110, 140):
        s.mid_arrow(O[0], O[1], mx, yy, color=RED, width=3, at=0.6)
        # reflected ray continues towards the eye area along the reflection
        t = 1.0                              # angle of reflection = angle of incidence: mirror the x-direction only
        rx = mx - (mx - O[0]) * t
        ry = yy + (yy - O[1]) * t
        s.mid_arrow(mx, yy, rx, ry, color=RED, width=3, at=0.55)
        s.line(mx, yy, I[0], I[1], color=MUTED, width=2, dash="7 6")
    s.line(O[0], O[1], I[0], I[1], color=GRID, width=1.5, dash="4 6")
    s.text(250, 205, "d", size=20, italic=True, weight="bold")
    s.text(410, 205, "d", size=20, italic=True, weight="bold")
    s.text(500, 300, "virtual, upright, same size", size=17, color=MUTED)
    s.text(500, 324, "laterally inverted", size=17, color=MUTED)
    return s


def _mirror_concave(s, mx, y0, h):
    s.path(f"M {mx - 16} {y0 - h} Q {mx + 14} {y0} {mx - 16} {y0 + h}", color=INK, width=5)


@fig
def concave_mirror_ray():
    s = Svg(680, 360, "Ray diagram for a concave mirror",
            "A concave mirror forms a real, inverted, diminished image between F and C when the object is beyond C. Rays: one parallel to the axis reflects through F; one through F reflects parallel; one through C reflects back on itself.")
    mx, ay = 600, 190
    f = 110
    u = 320
    v = u * f / (u - f)
    h = 80
    hi = -h * v / u
    s.line(30, ay, 640, ay, color=MUTED, width=2)
    _mirror_concave(s, mx, ay, 150)
    F, C = mx - f, mx - 2 * f
    for x, lab in ((F, "F"), (C, "C")):
        s.dot(x, ay, 5)
        s.text(x, ay + 24, lab, size=20, weight="bold")
    ox = mx - u
    s.arrow(ox, ay, ox, ay - h, color=GREEN, width=5)
    s.text(ox, ay + 24, "object", size=16, color=GREEN)
    ix = mx - v
    top = (ox, ay - h)
    img = (ix, ay - hi)
    s.mid_arrow(top[0], top[1], mx, top[1], color=RED, width=3, at=0.5)
    s.line(mx, top[1], img[0] + (img[0] - mx) * 0.25, img[1] + (img[1] - top[1]) * 0.25, color=RED, width=3)
    yF = ay - h + (F - ox) * 0  # through F
    slope = (ay - top[1]) / (F - top[0])
    y_at_m = top[1] + slope * (mx - top[0])
    s.mid_arrow(top[0], top[1], mx, y_at_m, color=BLUE, width=3, at=0.4)
    s.line(mx, y_at_m, img[0] - 40, y_at_m, color=BLUE, width=3)
    s.arrow(ix, ay, ix, img[1], color=ORANGE, width=5)
    s.text(ix, img[1] + 26, "image", size=16, color=ORANGE, weight="bold")
    s.text(330, 340, "object beyond C → image between F and C: real, inverted, smaller", size=16, color=MUTED)
    return s


@fig
def refraction_glass_block():
    s = Svg(640, 400, "Refraction through a rectangular glass block",
            "A ray enters a glass block at an angle of incidence i, bends towards the normal (angle of refraction r), and leaves parallel to its original direction but displaced sideways.")
    bx0, bx1, by0, by1 = 140, 500, 140, 300
    s.rect(bx0, by0, bx1 - bx0, by1 - by0, fill=GLASS, stroke=INK, width=3)
    n = 1.5
    i = math.radians(50)
    r = math.asin(math.sin(i) / n)
    P = (260, by0)
    A = (P[0] - 130 * math.tan(i), by0 - 130)
    Q = (P[0] + (by1 - by0) * math.tan(r), by1)
    E = (Q[0] + 100 * math.tan(i), by1 + 100)
    s.line(P[0], 40, P[0], by0 + 60, color=MUTED, width=2, dash="6 6")
    s.line(Q[0], by1 - 60, Q[0], 380, color=MUTED, width=2, dash="6 6")
    s.mid_arrow(*A, *P, color=RED, width=4, at=0.6)
    s.mid_arrow(*P, *Q, color=RED, width=4, at=0.55)
    s.mid_arrow(*Q, *E, color=RED, width=4, at=0.6)
    s.line(*P, P[0] + (Q[0] - P[0]) * 1.6 + 60, by0 + (by1 - by0) * 1.6 + 60 * (by1 - by0) / (Q[0] - P[0]) * 0, color=GRID, width=0.01)
    s.line(P[0], P[1], P[0] + 230 * math.tan(i), by0 + 230, color=GRID, width=2, dash="4 5")
    s.arc(P[0], P[1], 46, 90, 90 + math.degrees(i), width=2.2)
    s.text(P[0] - 34, P[1] - 56, "i", size=24, italic=True, weight="bold")
    s.arc(P[0], P[1], 56, -90, -90 + math.degrees(r), width=2.2)
    s.text(P[0] + 20, P[1] + 70, "r", size=24, italic=True, weight="bold")
    s.text(560, 220, "glass", size=19, color=MUTED)
    s.text(100, 380, "emergent ray is parallel to the incident ray", size=16, color=MUTED, anchor="start")
    return s


@fig
def total_internal_reflection():
    s = Svg(660, 360, "Critical angle and total internal reflection",
            "Three rays inside glass meet the glass-air surface. Below the critical angle the ray refracts out; at the critical angle it travels along the surface; beyond it the ray is totally internally reflected.")
    yb = 150
    s.rect(20, yb, 620, 190, fill=GLASS, stroke="none", width=0)
    s.line(20, yb, 640, yb, color=INK, width=3)
    s.text(40, yb - 20, "air", size=18, color=MUTED, anchor="start")
    s.text(40, yb + 24, "glass", size=18, color=MUTED, anchor="start")
    n = 1.5
    c = math.asin(1 / n)
    cases = [(130, math.radians(25), "i < c: refracted", BLUE), (330, c, "i = c", ORANGE), (520, math.radians(60), "i > c: totally reflected", RED)]
    for x, ang, lab, col in cases:
        s.line(x, yb - 90, x, yb + 150, color=MUTED, width=1.5, dash="5 6")
        L = 150
        start = (x - L * math.sin(ang), yb + L * math.cos(ang))
        s.mid_arrow(*start, x, yb, color=col, width=3.5, at=0.55)
        if ang < c - 1e-6:
            rr = math.asin(n * math.sin(ang))
            s.mid_arrow(x, yb, x + 110 * math.sin(rr), yb - 110 * math.cos(rr), color=col, width=3.5, at=0.6)
        elif abs(ang - c) < 1e-6:
            s.mid_arrow(x, yb, x + 120, yb - 2, color=col, width=3.5, at=0.6)
            s.text(x + 60, yb - 16, "90°", size=16, color=col, weight="bold")
        else:
            s.mid_arrow(x, yb, x + L * math.sin(ang), yb + L * math.cos(ang), color=col, width=3.5, at=0.6)
        s.text(x, yb + 182 if x != 520 else yb + 182, lab, size=16, weight="bold", color=col)
    s.text(330, 40, "for glass (n = 1.5) the critical angle c ≈ 42°", size=18, weight="bold")
    return s


def _lens(s, x, ay, h, convex=True):
    if convex:
        s.path(f"M {x} {ay - h} Q {x + 26} {ay} {x} {ay + h} Q {x - 26} {ay} {x} {ay - h} Z", color=INK, width=2.5, fill=GLASS)
    else:
        s.path(f"M {x - 14} {ay - h} L {x + 14} {ay - h} Q {x + 2} {ay} {x + 14} {ay + h} L {x - 14} {ay + h} Q {x - 2} {ay} {x - 14} {ay - h} Z", color=INK, width=2.5, fill=GLASS)


@fig
def convex_lens_ray():
    s = Svg(680, 360, "Ray diagram for a converging (convex) lens",
            "Object beyond 2F: a ray parallel to the axis passes through F on the far side, and a ray through the optical centre goes straight on. They meet to form a real, inverted, diminished image between F and 2F.")
    lx, ay = 330, 180
    f = 95
    u = 240
    v = u * f / (u - f)
    h = 80
    hi = h * v / u
    s.line(20, ay, 660, ay, color=MUTED, width=2)
    _lens(s, lx, ay, 140)
    for d, lab in ((-2 * f, "2F"), (-f, "F"), (f, "F"), (2 * f, "2F")):
        s.dot(lx + d, ay, 5)
        s.text(lx + d, ay + 24, lab, size=18, weight="bold")
    ox, ix = lx - u, lx + v
    top, img = (ox, ay - h), (ix, ay + hi)
    s.arrow(ox, ay, ox, ay - h, color=GREEN, width=5)
    s.text(ox, ay - h - 16, "object", size=16, color=GREEN, weight="bold")
    s.mid_arrow(*top, lx, top[1], color=RED, width=3, at=0.5)
    end = (img[0] + (img[0] - lx) * 0.3, img[1] + (img[1] - top[1]) * 0.3)
    s.mid_arrow(lx, top[1], *end, color=RED, width=3, at=0.5)
    end2 = (img[0] + (img[0] - top[0]) * 0.15, img[1] + (img[1] - top[1]) * 0.15)
    s.mid_arrow(*top, *end2, color=BLUE, width=3, at=0.3)
    s.arrow(ix, ay, ix, img[1], color=ORANGE, width=5)
    s.text(ix + 12, img[1] + 20, "image", size=16, color=ORANGE, weight="bold", anchor="start")
    s.text(340, 345, "real, inverted, diminished, between F and 2F", size=16, color=MUTED)
    return s


@fig
def magnifying_glass():
    s = Svg(680, 360, "A convex lens used as a magnifying glass",
            "Object between the lens and F: the rays leaving the lens diverge. Traced back, they meet behind the object to form a virtual, upright, magnified image on the same side as the object.")
    lx, ay = 440, 220
    f = 130
    u = 80
    v = u * f / (u - f)  # negative: virtual
    h = 50
    hi = h * (-v) / u
    s.line(20, ay, 660, ay, color=MUTED, width=2)
    _lens(s, lx, ay, 150)
    for d, lab in ((-f, "F"), (f, "F")):
        s.dot(lx + d, ay, 5)
        s.text(lx + d, ay + 24, lab, size=18, weight="bold")
    ox = lx - u
    ix = lx + v
    top = (ox, ay - h)
    img = (ix, ay - hi)
    s.arrow(ox, ay, ox, ay - h, color=GREEN, width=5)
    s.mid_arrow(*top, lx, top[1], color=RED, width=3, at=0.5)
    slope = (ay - top[1]) / (f)
    s.mid_arrow(lx, top[1], 650, top[1] + slope * (650 - lx), color=RED, width=3, at=0.5)
    s.line(lx, top[1], img[0], img[1], color=RED, width=2, dash="7 6")
    s.mid_arrow(*img, 650, img[1] + (top[1] - img[1]) / (ox - img[0]) * (650 - img[0]), color=BLUE, width=0.01, at=0.9)
    s.line(img[0], img[1], *top, color=BLUE, width=2, dash="7 6")
    s.mid_arrow(*top, 650, top[1] + (top[1] - img[1]) / (top[0] - img[0]) * (650 - top[0]), color=BLUE, width=3, at=0.4)
    s.arrow(ix, ay, ix, img[1], color=ORANGE, width=5, dash="9 6")
    s.text(ix, img[1] - 16, "virtual image", size=16, color=ORANGE, weight="bold")
    s.text(ox, ay + 44, "object", size=16, color=GREEN, weight="bold")
    s.text(560, 345, "upright, magnified, virtual", size=16, color=MUTED)
    return s


@fig
def concave_lens_ray():
    s = Svg(680, 340, "Ray diagram for a diverging (concave) lens",
            "A ray parallel to the axis leaves the lens as if it came from the focal point F on the object side; a ray through the centre goes straight on. The image is virtual, upright and diminished, between F and the lens.")
    lx, ay = 400, 190
    f = 140
    u = 220
    v = u * f / (u + f)  # magnitude of virtual image distance
    h = 90
    hi = h * v / u
    s.line(20, ay, 660, ay, color=MUTED, width=2)
    _lens(s, lx, ay, 130, convex=False)
    for d, lab in ((-f, "F"), (f, "F")):
        s.dot(lx + d, ay, 5)
        s.text(lx + d, ay + 24, lab, size=18, weight="bold")
    ox, ix = lx - u, lx - v
    top, img = (ox, ay - h), (ix, ay - hi)
    s.arrow(ox, ay, ox, ay - h, color=GREEN, width=5)
    s.text(ox, ay - h - 16, "object", size=16, color=GREEN, weight="bold")
    s.mid_arrow(*top, lx, top[1], color=RED, width=3, at=0.5)
    Fx = lx - f
    k = (top[1] - ay) / (lx - Fx)
    s.mid_arrow(lx, top[1], 650, top[1] + k * (650 - lx), color=RED, width=3, at=0.5)
    s.line(Fx, ay, lx, top[1], color=RED, width=2, dash="7 6")
    k2 = (ay - top[1]) / (lx - top[0])
    s.mid_arrow(*top, 650, top[1] + k2 * (650 - top[0]), color=BLUE, width=3, at=0.3)
    s.arrow(ix, ay, ix, img[1], color=ORANGE, width=5, dash="9 6")
    s.text(ix - 6, img[1] - 14, "image", size=16, color=ORANGE, weight="bold")
    s.text(340, 325, "virtual, upright, diminished", size=16, color=MUTED)
    return s


@fig
def eye_defects():
    s = Svg(680, 420, "Short sight and long sight and their correction",
            "Short sight: rays from a distant object focus in front of the retina; a diverging lens corrects it. Long sight: rays from a near object focus behind the retina; a converging lens corrects it.")
    def eye(cx, cy):
        s.circle(cx, cy, 62, fill="#ffffff", stroke=INK, width=3)
        s.ellipse(cx - 46, cy, 10, 30, fill=GLASS, stroke=INK, width=2)
        s.path(f"M {cx + 50} {cy - 36} A 62 62 0 0 1 {cx + 50} {cy + 36}", color=RED, width=5)
    rows = [("Short sight (myopia)", -26, "diverging lens corrects it", False),
            ("Long sight (hypermetropia)", 30, "converging lens corrects it", True)]
    for r, (title, shift, fix, conv) in enumerate(rows):
        y = 110 + r * 190
        s.text(20, y - 82, title, size=19, weight="bold", anchor="start")
        cx = 200
        eye(cx, y)
        fx = cx + 58 + shift
        for dy in (-22, 22):
            s.line(40, y + dy, cx - 46, y + dy, color=BLUE, width=2.5)
            s.line(cx - 46, y + dy, fx, y, color=BLUE, width=2.5)
            if shift < 0:
                s.line(fx, y, cx + 58, y - dy * 0.5, color=BLUE, width=2, dash="5 5")
        s.dot(fx, y, 5, color=ORANGE)
        s.text(cx, y + 86, "focus in front of retina" if shift < 0 else "focus behind retina", size=15, color=ORANGE)
        cx2 = 520
        eye(cx2, y)
        lx = cx2 - 110
        _lens(s, lx, y, 46, convex=conv)
        for dy in (-22, 22):
            s.line(330, y + dy, lx, y + dy, color=BLUE, width=2.5)
            mid = (cx2 - 46, y + dy * (1.3 if not conv else 0.6))
            s.line(lx, y + dy, *mid, color=BLUE, width=2.5)
            s.line(*mid, cx2 + 58, y, color=BLUE, width=2.5)
        s.dot(cx2 + 58, y, 5, color=GREEN)
        s.text(cx2, y + 86, fix, size=15, color=GREEN, weight="bold")
    return s


@fig
def prism_dispersion():
    s = Svg(660, 360, "Dispersion of white light by a prism",
            "A narrow beam of white light enters a glass prism and is split into a spectrum: red is deviated least and violet most.")
    A, B, C = (300, 60), (170, 300), (430, 300)
    s.polygon([A, B, C], fill=GLASS, stroke=INK, width=3)
    entry = (232, 186)
    s.mid_arrow(40, 230, *entry, color=INK, width=5, at=0.6)
    s.text(50, 200, "white light", size=18, weight="bold", anchor="start")
    exit_ = (372, 200)
    s.line(*entry, *exit_, color="#94a3b8", width=6)
    colors = ["#dc2626", "#ea580c", "#eab308", "#16a34a", "#2563eb", "#4f46e5", "#7c3aed"]
    names = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
    for k, (c, nm) in enumerate(zip(colors, names)):
        ang = math.radians(-8 - k * 4.2)
        end = (exit_[0] + 230 * math.cos(-ang) , exit_[1] + 230 * math.sin(-ang))
        s.line(exit_[0], exit_[1] + k * 1.2, end[0], end[1], color=c, width=4)
        s.text(end[0] + 8, end[1], nm, size=15, color=c, weight="bold", anchor="start")
    s.text(330, 340, "red is deviated least, violet most", size=17, color=MUTED)
    return s


@fig
def em_spectrum():
    s = Svg(680, 300, "The electromagnetic spectrum",
            "The electromagnetic spectrum in order of decreasing wavelength and increasing frequency: radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, gamma rays.")
    names = ["radio", "micro-\nwaves", "infra-\nred", "visible", "ultra-\nviolet", "X-rays", "gamma\nrays"]
    fills = ["#dbeafe", "#e0e7ff", "#fee2e2", "url(#vis)", "#ede9fe", "#f3e8ff", "#fae8ff"]
    s.raw('<defs><linearGradient id="vis" x1="0" x2="1"><stop offset="0" stop-color="#ef4444"/><stop offset="0.2" stop-color="#f97316"/><stop offset="0.4" stop-color="#eab308"/><stop offset="0.6" stop-color="#22c55e"/><stop offset="0.8" stop-color="#3b82f6"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs>')
    x = 30
    w = 88
    for nm, fl in zip(names, fills):
        s.rect(x, 90, w, 80, fill=fl, stroke=INK, width=2)
        lines = nm.split("\n")
        for k, ln in enumerate(lines):
            s.text(x + w / 2, 130 + (k - (len(lines) - 1) / 2) * 20, ln, size=16, weight="bold")
        x += w + 2
    s.arrow(40, 210, 640, 210, color=RED, width=3)
    s.text(340, 234, "frequency and energy increase →", size=17, color=RED, weight="bold")
    s.arrow(640, 260, 40, 260, color=BLUE, width=3)
    s.text(340, 284, "← wavelength increases", size=17, color=BLUE, weight="bold")
    s.text(340, 50, "all travel at 3 × 10⁸ m s⁻¹ in a vacuum", size=18, weight="bold")
    return s


# ═══ Electricity ═════════════════════════════════════════════════════════════

@fig
def gold_leaf_electroscope():
    s = Svg(680, 420, "A gold-leaf electroscope",
            "A metal cap on a metal rod passes through an insulating plug into a glass-fronted case. A thin gold leaf hangs from the bottom of the rod; when the electroscope is charged, the leaf and rod repel and the leaf rises.")
    s.rect(140, 140, 280, 250, fill=GLASS, stroke=INK, width=3, rx=10)
    s.rect(250, 120, 60, 34, fill="#a16207", stroke=INK, width=2.5, rx=4)
    s.rect(250, 70, 60, 14, fill=METAL, stroke=INK, width=2.5, rx=3)
    s.line(280, 84, 280, 290, color="#64748b", width=8)
    s.path("M 284 220 L 340 290", color="#ca8a04", width=6)
    for x in (170, 390):
        s.line(x, 390, x, 410, width=3)
    s.line(140, 390, 420, 390, width=3)
    s.rect(160, 380, 240, 10, fill=METAL, stroke=INK, width=1.5)
    labels = [("metal cap", 310, 77, 46), ("insulating plug", 312, 137, 116), ("metal rod", 286, 200, 196), ("gold leaf", 330, 270, 276), ("earthed case", 420, 340, 350)]
    for text, px, py, ty in labels:
        s.line(px, py, 440, ty, color=MUTED, width=1.5)
        s.text(444, ty, text, size=17, anchor="start", weight="bold")
    for k, (x, y) in enumerate(((268, 74), (292, 74), (276, 240), (300, 248), (322, 266))):
        s.text(x, y - 16 if k < 2 else y, "+", size=20, weight="bold", color=RED)
    return s


@fig
def electric_field_lines():
    s = Svg(660, 330, "Electric field lines",
            "Left: field lines point radially outwards from an isolated positive charge. Right: lines leave a positive charge and curve round to enter a nearby negative charge.")
    c1 = (150, 165)
    s.circle(*c1, 22, fill=F_RED, stroke=RED, width=3)
    s.text(*c1, "+", size=28, weight="bold", color=RED)
    for k in range(12):
        a = 2 * math.pi * k / 12
        s.arrow(c1[0] + 28 * math.cos(a), c1[1] + 28 * math.sin(a), c1[0] + 120 * math.cos(a), c1[1] + 120 * math.sin(a), color=INK, width=2)
    P, N = (390, 165), (590, 165)
    s.circle(*P, 20, fill=F_RED, stroke=RED, width=3)
    s.text(*P, "+", size=26, weight="bold", color=RED)
    s.circle(*N, 20, fill=F_BLUE, stroke=BLUE, width=3)
    s.text(*N, "−", size=28, weight="bold", color=BLUE)
    s.arrow(412, 165, 566, 165, color=INK, width=2)
    for h in (45, 90, 135):
        for sign in (1, -1):
            s.path(f"M {P[0] + 16} {P[1] - sign * 12} C {P[0] + 60} {P[1] - sign * h * 1.3} {N[0] - 60} {N[1] - sign * h * 1.3} {N[0] - 16} {N[1] - sign * 12}", color=INK, width=2)
            s.head(490, 165 - sign * h * 0.98, 0, color=INK, size=11)
    s.text(150, 315, "isolated positive charge", size=17, weight="bold")
    s.text(490, 315, "positive and negative charges", size=17, weight="bold")
    return s


@fig
def simple_circuit():
    s = Svg(640, 380, "A simple circuit with an ammeter and a voltmeter",
            "A cell, a switch, an ammeter and a resistor are connected in series. A voltmeter is connected in parallel across the resistor.")
    L, R_, T, B = 90, 550, 90, 290
    s.line(L, T, 260, T)
    s.cell(285, T, "cell")
    s.line(310, T, R_, T)
    s.line(R_, T, R_, B)
    s.line(L, T, L, 150)
    s.meter(L, 170, "A")
    s.line(L, 190, L, B)
    s.line(L, B, 220, B)
    s.switch(220, B, 270, B)
    s.line(270, B, 330, B)
    s.resistor(330, B, R_, "resistor R")
    s.line(380, B, 380, 340)
    s.line(500, B, 500, 340)
    s.line(380, 340, 420, 340)
    s.meter(440, 340, "V")
    s.line(460, 340, 500, 340)
    s.text(118, 170, "ammeter", size=16, anchor="start", color=MUTED)
    s.text(440, 374, "voltmeter (in parallel)", size=16, color=MUTED)
    s.text(245, B + 34, "switch", size=16, color=MUTED)
    s.arrow(400, T - 26, 480, T - 26, color=RED, width=2.5)
    s.text(440, T - 44, "conventional current: + to −", size=15, color=RED)
    return s


@fig
def iv_graphs():
    s = Svg(660, 300, "Current-voltage graphs",
            "Left: a metal resistor at constant temperature gives a straight line through the origin (ohmic). Middle: a filament lamp gives a curve that flattens as the filament heats up. Right: a diode conducts only in the forward direction.")
    titles = ["ohmic resistor", "filament lamp", "diode"]
    for i in range(3):
        x0 = 40 + i * 215
        cx, cy = x0 + 85, 140
        s.arrow(x0, cy, x0 + 175, cy, width=2)
        s.arrow(cx, 250, cx, 40, width=2)
        s.text(x0 + 175, cy + 20, "V", size=16, italic=True, color=MUTED, anchor="end")
        s.text(cx + 8, 42, "I", size=16, italic=True, color=MUTED, anchor="start")
        if i == 0:
            s.line(cx - 75, cy + 80, cx + 75, cy - 80, color=BLUE, width=4)
        elif i == 1:
            pts = [(cx + t, cy - 80 * math.tanh(t / 45) * 1.05) for t in range(-80, 81, 4)]
            s.polyline(pts, color=ORANGE, width=4)
        else:
            pts = [(cx + t, cy - (0 if t < 40 else min(95, (t - 40) ** 1.8 / 4))) for t in range(-80, 81, 2)]
            s.polyline([(cx - 80, cy + 3)] + pts, color=GREEN, width=4)
        s.text(cx, 282, titles[i], size=17, weight="bold")
    return s


@fig
def resistors_series_parallel():
    s = Svg(660, 340, "Resistors in series and in parallel",
            "Top: three resistors joined end to end in series; the same current flows through each and R = R1 + R2 + R3. Bottom: three resistors side by side in parallel; the same voltage is across each and 1/R = 1/R1 + 1/R2 + 1/R3.")
    y = 90
    s.text(20, 28, "Series: R = R₁ + R₂ + R₃", size=19, weight="bold", anchor="start")
    s.line(40, y, 80, y)
    xs = [80, 250, 420, 590]
    for k in range(3):
        s.resistor(xs[k], y, xs[k + 1], f"R{'₁₂₃'[k]}")
    s.line(590, y, 620, y)
    s.dot(40, y, 5)
    s.dot(620, y, 5)
    s.text(20, 155, "Parallel: 1/R = 1/R₁ + 1/R₂ + 1/R₃", size=19, weight="bold", anchor="start")
    x0, x1 = 160, 500
    ys = [200, 252, 304]
    s.line(80, 252, x0, 252)
    s.line(x1, 252, 580, 252)
    s.line(x0, ys[0], x0, ys[-1])
    s.line(x1, ys[0], x1, ys[-1])
    for k, yy in enumerate(ys):
        s.resistor(x0, yy, x1, "")
        s.text(330 + 70, yy - 2, f"R{'₁₂₃'[k]}", size=18, anchor="start", weight="bold")
    s.dot(80, 252, 5)
    s.dot(580, 252, 5)
    return s


@fig
def meter_bridge():
    s = Svg(660, 330, "The metre bridge (Wheatstone bridge)",
            "A uniform resistance wire one metre long has an unknown resistance X and a known resistance R in the gaps. A galvanometer connected through a jockey reads zero at the balance point, dividing the wire into lengths l and 100 minus l.")
    wy = 230
    s.line(60, wy, 600, wy, color=ORANGE, width=5)
    s.text(330, wy + 30, "uniform wire, 100 cm", size=16, color=ORANGE)
    s.line(60, wy, 60, 110)
    s.line(600, wy, 600, 110)
    s.resistor(60, 110, 300, "X (unknown)")
    s.resistor(360, 110, 600, "R (known)")
    s.line(300, 110, 360, 110)
    s.line(330, 110, 330, 150)
    s.meter(330, 170, "G")
    s.line(330, 190, 260, wy - 6)
    s.polygon([(252, wy - 4), (268, wy - 4), (260, wy + 2)], fill=INK, stroke=INK, width=1)
    s.text(260, wy - 34, "jockey", size=15, color=MUTED, anchor="end")
    s.line(60, wy, 60, 290)
    s.line(600, wy, 600, 290)
    s.line(60, 290, 300, 290)
    s.cell(325, 290, "")
    s.line(350, 290, 600, 290)
    s.arrow(160, wy + 50, 62, wy + 50, color=BLUE, width=2)
    s.arrow(160, wy + 50, 258, wy + 50, color=BLUE, width=2)
    s.label(160, wy + 50, "l", size=20, italic=True, weight="bold", color=BLUE)
    s.text(470, 40, "X / R = l / (100 − l)", size=21, weight="bold")
    return s


@fig
def electrolysis_cell():
    s = Svg(600, 380, "Electrolysis of copper(II) sulphate with copper electrodes",
            "Two copper electrodes dip into copper sulphate solution and are connected to a battery. Copper ions move to the cathode and are deposited as copper; copper dissolves from the anode.")
    s.rect(140, 150, 320, 190, fill=WATER, stroke=INK, width=3, rx=8)
    s.rect(200, 90, 30, 210, fill="#c2410c", stroke=INK, width=2.5)
    s.rect(370, 90, 30, 210, fill="#c2410c", stroke=INK, width=2.5)
    s.line(215, 90, 215, 50)
    s.line(385, 90, 385, 50)
    s.line(215, 50, 285, 50)
    s.cell(300, 50, "")
    s.line(315, 50, 385, 50)
    s.text(160, 70, "anode (+)", size=17, weight="bold", color=RED, anchor="end")
    s.text(440, 70, "cathode (−)", size=17, weight="bold", color=BLUE, anchor="start")
    for (x, y) in ((260, 210), (300, 250), (330, 200)):
        s.circle(x, y, 14, fill=F_BLUE, stroke=BLUE, width=2)
        s.text(x, y, "Cu²⁺", size=11, weight="bold", color=BLUE)
        s.arrow(x + 16, y, x + 46, y, color=BLUE, width=2)
    for (x, y) in ((330, 300), (270, 290)):
        s.circle(x, y, 14, fill=F_RED, stroke=RED, width=2)
        s.text(x, y, "SO₄²⁻", size=9, weight="bold", color=RED)
        s.arrow(x - 16, y, x - 46, y, color=RED, width=2)
    s.text(300, 362, "copper sulphate solution (electrolyte)", size=16, color=MUTED)
    return s


# ═══ Magnetism ═══════════════════════════════════════════════════════════════

@fig
def bar_magnet_field():
    s = Svg(640, 340, "Magnetic field of a bar magnet",
            "Field lines leave the north pole, curve round and enter the south pole. They are closest together near the poles, where the field is strongest.")
    cx, cy = 320, 170
    s.rect(cx - 110, cy - 22, 110, 44, fill=F_RED, stroke=INK, width=3)
    s.rect(cx, cy - 22, 110, 44, fill=F_BLUE, stroke=INK, width=3)
    s.text(cx - 55, cy, "N", size=24, weight="bold", color=RED)
    s.text(cx + 55, cy, "S", size=24, weight="bold", color=BLUE)
    for h in (40, 75, 115, 150):
        for sign in (1, -1):
            s.path(f"M {cx - 110} {cy - sign * 10} C {cx - 110 - h * 1.2} {cy - sign * h * 1.25} {cx + 110 + h * 1.2} {cy - sign * h * 1.25} {cx + 110} {cy - sign * 10}", color=INK, width=2)
            s.head(cx, cy - sign * h * 0.96, 0, color=INK, size=11)
    s.arrow(cx - 110, cy, cx - 230, cy, color=INK, width=2)
    s.arrow(cx + 230, cy, cx + 112, cy, color=INK, width=2)
    s.text(320, 326, "lines go from N to S outside the magnet", size=17, color=MUTED)
    return s


@fig
def wire_and_solenoid_fields():
    s = Svg(660, 340, "Magnetic fields of a straight wire and a solenoid",
            "Left: around a straight wire carrying current into the page, the field lines are concentric circles running clockwise. Right: a current-carrying solenoid produces a field like a bar magnet, with a north pole at one end.")
    c = (150, 170)
    for r in (34, 64, 96):
        s.circle(*c, r, stroke=INK, width=2)
        s.head(c[0] + r, c[1], math.pi / 2, color=INK, size=11)
    s.circle(*c, 12, fill="#ffffff", stroke=INK, width=3)
    s.line(c[0] - 7, c[1] - 7, c[0] + 7, c[1] + 7, width=3)
    s.line(c[0] - 7, c[1] + 7, c[0] + 7, c[1] - 7, width=3)
    s.text(150, 300, "current into page: clockwise field", size=16, weight="bold")
    x0, x1, yc = 390, 590, 170
    for k in range(9):
        x = x0 + 10 + k * 22
        s.ellipse(x, yc, 10, 46, stroke=ORANGE, width=3)
    s.line(x0 - 20, yc + 46, x0 + 10, yc + 46, color=ORANGE, width=3)
    s.line(x1 - 10, yc + 46, x1 + 20, yc + 46, color=ORANGE, width=3)
    for h in (70, 110):
        for sign in (1, -1):
            s.path(f"M {x0} {yc - sign * 30} C {x0 - 70} {yc - sign * h} {x1 + 70} {yc - sign * h} {x1} {yc - sign * 30}", color=INK, width=2)
    s.arrow(x0 + 30, yc, x1 - 30, yc, color=INK, width=2)
    s.text(x1 + 26, yc - 4, "N", size=24, weight="bold", color=RED, anchor="start")
    s.text(x0 - 26, yc - 4, "S", size=24, weight="bold", color=BLUE, anchor="end")
    s.text(490, 300, "solenoid: like a bar magnet", size=16, weight="bold")
    return s


@fig
def motor_effect():
    s = Svg(660, 380, "The motor effect and Fleming's left-hand rule",
            "A wire carrying current between the poles of a magnet experiences a force at right angles to both the field and the current. Fleming's left-hand rule: First finger Field, seCond finger Current, thuMb Motion.")
    s.rect(60, 120, 90, 140, fill=F_RED, stroke=INK, width=3)
    s.rect(330, 120, 90, 140, fill=F_BLUE, stroke=INK, width=3)
    s.text(105, 190, "N", size=30, weight="bold", color=RED)
    s.text(375, 190, "S", size=30, weight="bold", color=BLUE)
    for y in (145, 175, 205, 235):
        s.arrow(152, y, 326, y, color=MUTED, width=1.6)
    s.circle(240, 190, 16, fill="#ffffff", stroke=INK, width=3)
    s.dot(240, 190, 5)
    s.text(240, 225, "current out of page", size=13, color=MUTED)
    s.arrow(240, 170, 240, 70, color=RED, width=5)
    s.text(252, 84, "force F", size=19, weight="bold", color=RED, anchor="start")
    s.text(240, 300, "F = BIL", size=24, weight="bold")
    hx, hy = 500, 220
    s.arrow(hx, hy, hx + 90, hy, color=BLUE, width=5)
    s.text(hx + 86, hy + 22, "Field", size=17, weight="bold", color=BLUE)
    s.arrow(hx, hy, hx - 50, hy + 70, color=ORANGE, width=5)
    s.text(hx - 54, hy + 88, "Current", size=17, weight="bold", color=ORANGE)
    s.arrow(hx, hy, hx, hy - 100, color=RED, width=5)
    s.text(hx, hy - 116, "Motion", size=17, weight="bold", color=RED)
    s.text(560, 340, "left hand: FBI", size=17, color=MUTED)
    return s


@fig
def electromagnetic_induction():
    s = Svg(640, 320, "Electromagnetic induction",
            "Moving a bar magnet into a coil connected to a galvanometer induces a current; the needle deflects while the magnet moves and returns to zero when it stops.")
    for k in range(7):
        x = 300 + k * 26
        s.ellipse(x, 160, 12, 60, stroke=ORANGE, width=3)
    s.rect(80, 138, 150, 44, fill=F_RED, stroke=INK, width=3)
    s.rect(80, 138, 75, 44, fill=F_BLUE, stroke=INK, width=3)
    s.text(118, 160, "S", size=22, weight="bold", color=BLUE)
    s.text(192, 160, "N", size=22, weight="bold", color=RED)
    s.arrow(210, 105, 280, 105, color=RED, width=4)
    s.text(245, 86, "move in", size=16, color=RED, weight="bold")
    s.line(300, 220, 300, 270, color=ORANGE, width=3)
    s.line(456, 220, 456, 270, color=ORANGE, width=3)
    s.line(300, 270, 350, 270, color=ORANGE, width=3)
    s.line(406, 270, 456, 270, color=ORANGE, width=3)
    s.meter(378, 270, "G")
    s.text(378, 306, "galvanometer deflects", size=16, color=MUTED)
    s.text(500, 60, "e.m.f. ∝ rate of change", size=17, weight="bold")
    s.text(500, 84, "of magnetic flux", size=17, weight="bold")
    return s


@fig
def transformer():
    s = Svg(640, 340, "A transformer",
            "Two coils wound on a laminated soft-iron core. An alternating voltage on the primary coil produces a changing magnetic flux in the core, which induces an alternating voltage in the secondary coil.")
    s.rect(200, 70, 240, 200, fill=METAL, stroke=INK, width=3)
    s.rect(250, 120, 140, 100, fill=BG, stroke=INK, width=3)
    for k in range(6):
        y = 90 + k * 30
        s.path(f"M 196 {y} q -26 8 0 16", color=ORANGE, width=4)
    for k in range(10):
        y = 85 + k * 18
        s.path(f"M 444 {y} q 26 6 0 12", color=BLUE, width=4)
    s.line(176, 92, 110, 92, color=ORANGE, width=3)
    s.line(176, 250, 110, 250, color=ORANGE, width=3)
    s.line(466, 88, 540, 88, color=BLUE, width=3)
    s.line(466, 254, 540, 254, color=BLUE, width=3)
    s.text(110, 172, "Vp", size=22, weight="bold", color=ORANGE)
    s.text(110, 200, "Np turns", size=15, color=ORANGE)
    s.text(540, 172, "Vs", size=22, weight="bold", color=BLUE)
    s.text(540, 200, "Ns turns", size=15, color=BLUE)
    s.text(320, 40, "laminated soft-iron core", size=17, color=MUTED)
    s.text(320, 310, "Vs / Vp = Ns / Np", size=24, weight="bold")
    return s


@fig
def ac_waveform():
    s = Svg(640, 300, "Alternating voltage",
            "An alternating voltage varies sinusoidally between plus and minus the peak value V0. The r.m.s. value is 0.707 times the peak value.")
    x0, ym = 70, 150
    s.arrow(x0, 270, x0, 30, width=2.2)
    s.arrow(x0, ym, 620, ym, width=2.2)
    s.text(620, ym + 22, "time", size=16, color=MUTED, anchor="end")
    s.text(x0 + 8, 32, "voltage", size=16, color=MUTED, anchor="start", baseline="auto")
    A = 100
    pts = [(x0 + i * 2.6, ym - A * math.sin(2 * math.pi * i / 100)) for i in range(0, 201)]
    s.polyline(pts, color=BLUE, width=4)
    s.line(x0, ym - A, 600, ym - A, color=GRID, width=1.5, dash="5 6")
    s.line(x0, ym - 0.707 * A, 600, ym - 0.707 * A, color=RED, width=2, dash="8 6")
    s.text(x0 - 10, ym - A, "V₀", size=19, weight="bold", anchor="end")
    s.text(605, ym - 0.707 * A, "Vrms = 0.707 V₀", size=16, weight="bold", color=RED, anchor="end", baseline="auto")
    s.arrow(x0, 285, x0 + 260, 285, color=GREEN, width=2.5)
    s.arrow(x0 + 260, 285, x0, 285, color=GREEN, width=2.5)
    s.label(x0 + 130, 285, "one period T", size=16, color=GREEN, weight="bold")
    return s


@fig
def three_pin_plug():
    s = Svg(560, 400, "Wiring a three-pin plug",
            "Inside a three-pin plug: the brown live wire goes through the fuse to the right-hand pin, the blue neutral wire to the left-hand pin, and the green and yellow earth wire to the top pin. A cord grip holds the cable.")
    s.rect(110, 40, 340, 320, fill="#ffffff", stroke=INK, width=3, rx=30)
    s.rect(255, 70, 50, 80, fill=METAL, stroke=INK, width=2.5)
    s.text(280, 168, "E", size=18, weight="bold")
    s.rect(160, 200, 46, 70, fill=METAL, stroke=INK, width=2.5)
    s.text(183, 288, "N", size=18, weight="bold")
    s.rect(354, 200, 46, 70, fill=METAL, stroke=INK, width=2.5)
    s.text(377, 288, "L", size=18, weight="bold")
    s.rect(360, 120, 34, 70, fill="#fde68a", stroke=INK, width=2)
    s.text(410, 155, "fuse", size=16, anchor="start", weight="bold")
    s.rect(230, 320, 100, 22, fill=F_GREY, stroke=INK, width=2)
    s.text(342, 332, "cord grip", size=15, anchor="start", color=MUTED)
    s.path("M 275 345 C 275 300 280 200 280 150", color="#16a34a", width=7)
    s.path("M 275 345 C 275 300 280 200 280 150", color="#facc15", width=3, dash="10 8")
    s.path("M 268 345 C 250 300 190 300 183 270", color="#2563eb", width=7)
    s.path("M 290 345 C 320 300 377 240 377 190", color="#92400e", width=7)
    s.text(160, 380, "blue = neutral", size=15, color="#2563eb", weight="bold")
    s.text(290, 380, "brown = live (via fuse)", size=15, color="#92400e", weight="bold")
    s.text(280, 26, "green/yellow = earth", size=15, color="#15803d", weight="bold")
    return s


# ═══ Modern physics and electronics ══════════════════════════════════════════

@fig
def energy_levels():
    s = Svg(640, 380, "Energy levels of the hydrogen atom",
            "Energy level diagram: n = 1 at -13.6 eV, n = 2 at -3.4 eV, n = 3 at -1.51 eV, n = 4 at -0.85 eV, and zero at infinity. An electron dropping from a higher level to a lower one emits a photon whose energy equals the difference.")
    levels = [(1, -13.6), (2, -3.4), (3, -1.51), (4, -0.85), (None, 0.0)]
    pos = {-13.6: 320, -3.4: 200, -1.51: 140, -0.85: 100, 0.0: 60}

    def Y(E):   # spaced for clarity, not to scale
        if E in pos:
            return pos[E]
        ks = sorted(pos)
        for a, b in zip(ks, ks[1:]):
            if a <= E <= b:
                return pos[a] + (E - a) / (b - a) * (pos[b] - pos[a])
        return 60
    for n, E in levels:
        y = Y(E)
        s.line(120, y, 470, y, color=INK if n else MUTED, width=3 if n else 2, dash=None if n else "6 6")
        s.text(110, y, f"n = {n}" if n else "n = ∞", size=17, anchor="end", weight="bold")
        s.text(480, y, f"{E} eV", size=17, anchor="start")
    s.arrow(200, Y(-3.4), 200, Y(-13.6) - 2, color=PURPLE, width=3)
    s.arrow(300, Y(-1.51), 300, Y(-3.4) - 2, color=RED, width=3)
    s.arrow(380, Y(-0.85), 380, Y(-3.4) - 2, color=BLUE, width=3)
    s.text(210, Y(-8), "UV", size=16, color=PURPLE, anchor="start", weight="bold")
    s.text(310, Y(-2.4), "red", size=16, color=RED, anchor="start", weight="bold")
    s.text(390, Y(-2.1), "blue", size=16, color=BLUE, anchor="start", weight="bold")
    s.text(320, 362, "photon energy hf = E(upper) − E(lower)   (not to scale)", size=17, weight="bold")
    return s


@fig
def photoelectric_graph():
    s = Svg(640, 340, "Photoelectric effect: kinetic energy against frequency",
            "Maximum kinetic energy of photoelectrons against the frequency of the light: zero below the threshold frequency f0, then a straight line of gradient h. Extending the line back meets the energy axis at minus the work function.")
    x0, y0 = 120, 230
    s.arrow(x0, y0, 610, y0, width=2.5)
    s.arrow(x0, 320, x0, 30, width=2.5)
    s.text(610, y0 + 24, "frequency f", size=16, color=MUTED, anchor="end")
    s.text(x0 + 8, 32, "max kinetic energy", size=16, color=MUTED, anchor="start", baseline="auto")
    f0 = 280
    s.line(f0, y0, 580, 50, color=BLUE, width=5)
    s.line(x0, y0 + (f0 - x0) * (180 / 300), f0, y0, color=BLUE, width=2, dash="7 6")
    s.dot(f0, y0, 6, color=RED)
    s.text(f0, y0 + 24, "f₀ (threshold)", size=16, weight="bold", color=RED)
    s.text(x0 - 10, y0 + (f0 - x0) * 0.6, "−W", size=18, weight="bold", anchor="end")
    s.text(470, 180, "gradient = h", size=19, weight="bold", color=BLUE)
    s.text(380, 300, "Ek = hf − W", size=22, weight="bold")
    return s


@fig
def xray_tube():
    s = Svg(660, 340, "An X-ray tube",
            "Electrons from a heated cathode are accelerated by a very high voltage across an evacuated tube and strike a tungsten target embedded in a copper anode. X-rays are emitted from the target; most of the energy becomes heat, carried away by the copper and cooling fins.")
    s.ellipse(330, 160, 260, 100, fill=GLASS, stroke=INK, width=3)
    s.text(330, 46, "evacuated glass tube", size=16, color=MUTED)
    s.rect(110, 140, 30, 40, fill=METAL, stroke=INK, width=2.5)
    s.text(125, 205, "heated", size=14, color=MUTED)
    s.text(125, 222, "cathode", size=14, color=MUTED)
    s.rect(470, 120, 150, 80, fill="#c2410c", stroke=INK, width=2.5)
    s.polygon([(470, 120), (470, 200), (430, 160)], fill="#64748b", stroke=INK, width=2.5)
    s.text(545, 160, "copper anode", size=14, color="#ffffff", weight="bold")
    s.text(430, 218, "tungsten target", size=14, color=MUTED)
    for dy in (-8, 0, 8):
        s.arrow(145, 160 + dy, 425, 160 + dy * 0.2, color=BLUE, width=2)
    s.text(280, 140, "electrons", size=15, color=BLUE, weight="bold")
    for k in range(3):
        x = 440 + k * 12
        s.path(f"M {x} 175 l -6 14 l 8 4 l -6 14 l 8 4 l -6 14 l 8 4 l -6 14", color=PURPLE, width=2.5)
    s.text(450, 300, "X-rays", size=17, color=PURPLE, weight="bold")
    s.text(330, 326, "very high p.d. (tens of kilovolts) between cathode and anode", size=15, color=MUTED)
    return s


@fig
def decay_curve():
    s = Svg(640, 340, "Radioactive decay curve",
            "Activity against time for a radioactive sample: it falls from 800 to 400 counts per minute in one half-life, to 200 after two half-lives and to 100 after three.")
    x0, y0 = 90, 290
    s.axes(x0, y0, 610, 30, "time / days", "activity / counts per min")
    T = 120
    pts = [(x0 + t, y0 - 240 * 0.5 ** (t / T)) for t in range(0, 501, 4)]
    s.polyline(pts, color=BLUE, width=4.5)
    for k, a in enumerate((800, 400, 200, 100)):
        y = y0 - 240 * 0.5 ** k
        x = x0 + k * T
        s.line(x0, y, x, y, color=GRID, width=1.5, dash="5 6")
        s.line(x, y, x, y0, color=GRID, width=1.5, dash="5 6")
        s.text(x0 - 8, y, str(a), size=15, anchor="end")
        if k:
            s.text(x, y0 + 20, f"{k}T", size=15, weight="bold", color=RED)
    s.text(420, 120, "half-life T: time for the", size=17, weight="bold")
    s.text(420, 144, "activity to fall by half", size=17, weight="bold")
    return s


@fig
def radiation_penetration():
    s = Svg(660, 280, "Penetrating power of alpha, beta and gamma radiation",
            "Alpha particles are stopped by a sheet of paper; beta particles pass paper but are stopped by a few millimetres of aluminium; gamma rays pass both and are only reduced by thick lead or concrete.")
    s.rect(30, 70, 70, 150, fill=F_AMBER, stroke=INK, width=2.5, rx=8)
    s.text(65, 145, "source", size=15, weight="bold")
    s.rect(240, 50, 10, 190, fill="#ffffff", stroke=INK, width=2)
    s.text(245, 262, "paper", size=15, color=MUTED)
    s.rect(380, 50, 22, 190, fill=METAL, stroke=INK, width=2)
    s.text(391, 262, "aluminium", size=15, color=MUTED)
    s.rect(530, 50, 50, 190, fill="#94a3b8", stroke=INK, width=2)
    s.text(555, 262, "thick lead", size=15, color=MUTED)
    s.arrow(100, 100, 236, 100, color=RED, width=4)
    s.text(170, 84, "α", size=22, weight="bold", color=RED)
    s.arrow(100, 145, 376, 145, color=BLUE, width=4)
    s.text(170, 130, "β", size=22, weight="bold", color=BLUE)
    s.arrow(100, 190, 526, 190, color=GREEN, width=4)
    s.line(580, 190, 640, 190, color=GREEN, width=2, dash="5 5")
    s.text(170, 176, "γ", size=22, weight="bold", color=GREEN)
    return s


@fig
def diode_rectifier():
    s = Svg(660, 330, "A diode and half-wave rectification",
            "Top: a p-n junction diode conducts when forward-biased and blocks current when reverse-biased. Bottom: alternating input voltage and the half-wave rectified output, which has only the positive half-cycles.")
    s.polygon([(120, 50), (120, 110), (170, 80)], fill=F_GREY, stroke=INK, width=3)
    s.line(170, 50, 170, 110, width=4)
    s.line(60, 80, 120, 80)
    s.line(170, 80, 230, 80)
    s.text(145, 30, "diode symbol", size=16, weight="bold")
    s.arrow(250, 80, 320, 80, color=GREEN, width=3)
    s.text(370, 70, "forward bias: conducts", size=16, color=GREEN, weight="bold", anchor="start")
    s.text(370, 96, "reverse bias: blocks", size=16, color=RED, weight="bold", anchor="start")
    for row, rect in enumerate((False, True)):
        y = 200 + row * 0
        x0 = 60 + row * 320
        s.line(x0, y, x0 + 260, y, color=MUTED, width=1.5)
        pts = []
        for i in range(0, 241, 3):
            v = 50 * math.sin(2 * math.pi * i / 120)
            if rect and v < 0:
                v = 0
            pts.append((x0 + 10 + i, y - v))
        s.polyline(pts, color=BLUE if not rect else ORANGE, width=4)
        s.text(x0 + 130, 300, "a.c. input" if not rect else "half-wave rectified output", size=16, weight="bold")
    return s


@fig
def best_fit_graph():
    s = Svg(640, 360, "Drawing a line of best fit and finding its gradient",
            "Plotted points scattered about a straight line of best fit. A large right-angled triangle drawn on the line gives the gradient as the change in y divided by the change in x.")
    x0, y0 = 90, 300
    s.axes(x0, y0, 610, 30, "x", "y")
    pts = [(1, 2.1), (2, 3.8), (3, 6.2), (4, 7.9), (5, 10.1), (6, 11.8), (7, 14.2)]
    def P(x, y):
        return x0 + x * 66, y0 - y * 17
    for x, y in pts:
        X, Y = P(x, y)
        s.line(X - 7, Y - 7, X + 7, Y + 7, color=INK, width=2.5)
        s.line(X - 7, Y + 7, X + 7, Y - 7, color=INK, width=2.5)
    a, b = 2.0, 0.05
    s.line(*P(0.3, a * 0.3 + b), *P(7.6, a * 7.6 + b), color=BLUE, width=3.5)
    A, B = P(1.5, a * 1.5 + b), P(6.5, a * 6.5 + b)
    s.line(A[0], A[1], B[0], A[1], color=RED, width=2.5, dash="7 5")
    s.line(B[0], A[1], B[0], B[1], color=RED, width=2.5, dash="7 5")
    s.text((A[0] + B[0]) / 2, A[1] + 22, "Δx", size=19, weight="bold", color=RED)
    s.text(B[0] + 12, (A[1] + B[1]) / 2, "Δy", size=19, weight="bold", color=RED, anchor="start")
    s.text(250, 70, "gradient = Δy / Δx", size=21, weight="bold")
    s.text(250, 98, "(use a large triangle)", size=16, color=MUTED)
    return s


# ═══ Measurement and straight-line motion ═══════════════════════════════════

@fig
def vernier_caliper():
    s = Svg(720, 420, "Vernier calipers and their parts",
            "Vernier calipers: a fixed jaw on a main-scale beam and a sliding jaw carrying the vernier scale. "
            "The large lower jaws grip an object's outside; the small upper jaws fit inside a hole; the depth rod measures depth.")
    k = 6  # px per mm
    zero = 130  # main-scale zero (jaws closed: vernier zero sits here)
    gap = 22 * k  # object 22 mm long
    face_fixed, face_slide = 110, 110 + gap
    # beam with main scale
    s.rect(60, 140, 600, 60, fill=METAL, stroke=INK, width=2.5, rx=4)
    for mm in range(0, 86):
        x = zero + mm * k
        h = 18 if mm % 10 == 0 else (12 if mm % 5 == 0 else 7)
        s.line(x, 200, x, 200 - h, color=INK, width=1.6 if mm % 10 == 0 else 1.1)
        if mm % 10 == 0:
            s.text(x, 166, str(mm // 10), size=15, color=INK)
    s.text(640, 154, "cm", size=14, color=MUTED, anchor="end")
    # depth rod
    s.rect(660, 165, 46, 8, fill=METAL, stroke=INK, width=2)
    # fixed jaw (outside, below) and its small inside jaw (above)
    s.polygon([(60, 140), (face_fixed, 140), (face_fixed, 330), (92, 352), (60, 352)], fill=F_GREY, stroke=INK, width=2.5)
    s.polygon([(78, 140), (face_fixed, 140), (face_fixed, 70), (98, 70)], fill=F_GREY, stroke=INK, width=2.5)
    # sliding jaw with vernier plate
    xs = face_slide
    s.rect(xs, 200, 150, 40, fill=F_BLUE, stroke=INK, width=2.5)
    for i in range(11):
        x = xs + 20 + i * 0.9 * k
        s.line(x, 200, x, 200 + (14 if i % 5 == 0 else 9), color=BLUE, width=1.3)
    s.rect(xs, 122, 150, 18, fill=F_BLUE, stroke=INK, width=2.5)
    s.circle(xs + 104, 112, 10, fill=F_GREY, stroke=INK, width=2)
    s.line(xs + 104, 122, xs + 104, 112, color=INK, width=2)
    s.polygon([(xs, 240), (xs + 50, 240), (xs + 50, 290), (xs + 18, 352), (xs, 352), (xs, 330)], fill=F_BLUE, stroke=INK, width=2.5)
    s.polygon([(xs, 122), (xs + 34, 122), (xs + 12, 70), (xs, 70)], fill=F_BLUE, stroke=INK, width=2.5)
    # object held in the outside jaws
    s.rect(face_fixed, 262, gap, 58, fill=F_AMBER, stroke=INK, width=2.5)
    s.text((face_fixed + face_slide) / 2, 291, "object", size=17, color=INK)
    # labels
    s.text(176, 52, "inside jaws: internal diameter", size=17, color=MUTED)
    s.text(176, 380, "outside jaws: length or external diameter", size=17, color=MUTED, anchor="start")
    s.line(166, 372, 120, 344, color=MUTED, width=1.5)
    s.text(470, 104, "locking screw", size=16, color=MUTED, anchor="start")
    s.line(466, 104, xs + 116, 110, color=MUTED, width=1.5)
    s.text(470, 262, "vernier scale", size=17, color=BLUE, weight="bold", anchor="start")
    s.line(466, 262, xs + 150, 228, color=BLUE, width=1.5)
    s.text(560, 124, "main scale", size=17, weight="bold", anchor="middle")
    s.text(712, 222, "depth rod", size=15, color=MUTED, anchor="end")
    return s


@fig
def vernier_reading():
    s = Svg(720, 360, "Reading vernier calipers: 24.6 mm",
            "The vernier zero lies just past the 24 mm mark of the main scale, and the sixth vernier mark lines up exactly with a main-scale mark, "
            "so the reading is 24 mm plus 6 times 0.1 mm, which is 24.6 mm.")
    k = 26  # px per mm
    x0 = 50  # main-scale 20 mm

    def mx(mm):
        return x0 + (mm - 20) * k

    s.rect(30, 70, 660, 60, fill=METAL, stroke=INK, width=2.5, rx=4)
    for mm in range(20, 45):
        x = mx(mm)
        h = 30 if mm % 10 == 0 else (21 if mm % 5 == 0 else 13)
        s.line(x, 130, x, 130 - h, color=INK, width=2 if mm % 5 == 0 else 1.4)
        if mm % 10 == 0:
            s.text(x, 86, f"{mm} mm", size=16, weight="bold")
    s.text(678, 86, "main scale", size=14, color=MUTED, anchor="end")
    v0 = mx(24.6)
    s.rect(v0 - 22, 130, 290, 58, fill=F_BLUE, stroke=INK, width=2.5)
    for i in range(11):
        x = v0 + i * 0.9 * k
        hit = i == 6
        s.line(x, 130, x, 130 + (24 if i % 5 == 0 else 15), color=RED if hit else BLUE, width=3 if hit else 1.8)
        if i % 5 == 0:
            s.text(x, 176, str(i), size=15, color=BLUE, weight="bold")
    hx = v0 + 6 * 0.9 * k
    s.line(hx, 98, hx, 130, color=RED, width=3)
    s.text(v0 + 276, 160, "vernier", size=15, color=BLUE, anchor="start")
    # callouts
    s.line(v0, 196, v0, 232, color=INK, width=1.6)
    s.text(v0 - 4, 250, "vernier zero is just past 24 mm", size=16, anchor="start")
    s.line(hx, 196, hx + 60, 290, color=RED, width=1.6)
    s.text(hx + 64, 296, "6th vernier mark lines up", size=16, color=RED, weight="bold", anchor="start")
    s.text(360, 334, "Reading = 24 mm + 6 × 0.1 mm = 24.6 mm", size=21, weight="bold")
    s.text(360, 30, "10 vernier divisions = 9 mm, so least count = 0.1 mm", size=17, color=MUTED)
    return s


@fig
def micrometer():
    s = Svg(720, 380, "Micrometer screw gauge and its parts",
            "A micrometer screw gauge: a C-shaped frame holds a fixed anvil facing a moving spindle. The spindle is driven by the thimble, "
            "which carries the circular scale and turns against the main scale on the sleeve. The ratchet stops over-tightening.")
    # C-frame
    s.path("M 70 150 L 128 150 L 128 205 Q 128 262 215 262 Q 296 262 310 212 L 310 160 L 352 160 L 352 222 "
           "Q 336 314 215 314 Q 70 314 70 210 Z", color=INK, width=2.5, fill=F_GREY)
    s.rect(128, 158, 46, 34, fill=METAL, stroke=INK, width=2.5)  # anvil
    s.rect(214, 158, 96, 34, fill=METAL, stroke=INK, width=2.5)  # spindle
    s.rect(174, 154, 40, 42, fill=F_AMBER, stroke=INK, width=2.5)  # object
    # sleeve with main scale
    s.rect(352, 150, 150, 54, fill=METAL, stroke=INK, width=2.5)
    s.line(352, 177, 502, 177, color=INK, width=2)
    for i in range(13):
        x = 362 + i * 11
        if i % 2 == 0:
            s.line(x, 177, x, 164, color=INK, width=1.4)
        else:
            s.line(x, 177, x, 188, color=INK, width=1.2)
    # thimble with circular scale
    s.polygon([(478, 140), (600, 140), (600, 214), (478, 214), (466, 200), (466, 154)], fill=F_BLUE, stroke=INK, width=2.5)
    for j in range(-4, 5):
        y = 177 + j * 7
        s.line(466 if abs(j) < 4 else 468, y, 478 + (10 if j % 5 == 0 else 5), y, color=BLUE, width=1.4)
    for x in range(520, 600, 12):
        s.line(x, 144, x, 210, color="#93c5fd", width=2)
    # ratchet
    s.rect(600, 158, 64, 38, fill=F_GREY, stroke=INK, width=2.5, rx=5)
    for x in range(610, 662, 9):
        s.line(x, 162, x, 192, color=MUTED, width=1.5)
    # labels
    s.text(150, 120, "anvil", size=17, weight="bold")
    s.line(150, 128, 150, 156, color=MUTED, width=1.5)
    s.text(194, 92, "object", size=17, color=ORANGE, weight="bold")
    s.line(194, 100, 194, 152, color=MUTED, width=1.5)
    s.text(262, 120, "spindle", size=17, weight="bold")
    s.line(262, 128, 262, 156, color=MUTED, width=1.5)
    s.text(420, 100, "sleeve (main scale)", size=17, weight="bold")
    s.line(420, 108, 420, 148, color=MUTED, width=1.5)
    s.text(556, 252, "thimble (circular scale)", size=17, color=BLUE, weight="bold")
    s.line(540, 238, 540, 216, color=BLUE, width=1.5)
    s.text(632, 120, "ratchet", size=17, weight="bold")
    s.line(632, 128, 632, 156, color=MUTED, width=1.5)
    s.text(215, 346, "frame", size=17, weight="bold")
    s.text(360, 40, "Turn only the ratchet when closing on the object", size=18, color=MUTED)
    return s


@fig
def micrometer_reading():
    s = Svg(720, 380, "Reading a micrometer screw gauge: 5.78 mm",
            "The sleeve shows 5 mm and the half-millimetre mark after it, so the sleeve reading is 5.5 mm. "
            "The 28th division of the thimble lies on the datum line, adding 28 times 0.01 mm. The reading is 5.78 mm.")
    k = 56  # px per mm on the sleeve
    x0 = 60
    datum = 170
    edge = x0 + 5.78 * k
    s.rect(30, 130, edge - 30 + 40, 80, fill=METAL, stroke=INK, width=2.5)
    s.line(30, datum, edge, datum, color=INK, width=2.5)
    for mm in range(0, 6):
        x = x0 + mm * k
        s.line(x, datum, x, datum - 26, color=INK, width=2)
        if mm in (0, 5):
            s.text(x, datum - 40, str(mm), size=18, weight="bold")
    for half in range(0, 6):
        x = x0 + (half + 0.5) * k
        if x < edge:
            s.line(x, datum, x, datum + 20, color=INK, width=1.6)
    s.text(36, 232, "mm marks above the line, half-mm below", size=15, color=MUTED, anchor="start")
    # thimble
    s.polygon([(edge, 60), (edge + 210, 60), (edge + 210, 280), (edge, 280)], fill=F_BLUE, stroke=INK, width=2.5)
    step = 13
    for v in range(20, 37):
        y = datum - (v - 28) * step
        long = v % 5 == 0
        hit = v == 28
        s.line(edge, y, edge + (30 if long else 18), y, color=RED if hit else BLUE, width=3 if hit else 1.6)
        if long:
            s.text(edge + 38, y, str(v), size=15, color=BLUE, anchor="start", weight="bold")
    s.text(edge + 196, datum, "28 on the line", size=16, color=RED, weight="bold", anchor="end")
    s.text(edge + 105, 300, "thimble (50 divisions)", size=15, color=BLUE)
    # callouts
    hx = x0 + 5.5 * k
    s.line(hx, datum + 24, hx - 30, 252, color=INK, width=1.6)
    s.text(hx - 34, 266, "5.5 mm mark is showing", size=16, anchor="end")
    s.text(360, 30, "Pitch 0.5 mm ÷ 50 divisions: least count = 0.01 mm", size=17, color=MUTED)
    s.text(360, 350, "Reading = 5.5 mm + 28 × 0.01 mm = 5.78 mm", size=21, weight="bold")
    return s


@fig
def displacement_line():
    s = Svg(720, 330, "Distance and displacement on a straight road",
            "A student walks 300 m east to a shop and then 100 m west. The distance travelled is 400 m; the displacement is 200 m east.")
    k = 1.4
    o = 120

    def X(m):
        return o + m * k

    y = 250
    s.arrow(50, y, 690, y, color=INK, width=2.5)
    for m in range(-0, 401, 100):
        s.line(X(m), y - 8, X(m), y + 8, color=INK, width=2)
        s.text(X(m), y + 26, f"{m:+d} m" if m else "0", size=16, color=MUTED)
    s.text(686, y - 18, "east +", size=16, color=MUTED, anchor="end")
    s.arrow(X(0), 96, X(300), 96, color=BLUE, width=4)
    s.text(X(150), 78, "1st: 300 m east", size=18, color=BLUE, weight="bold")
    s.arrow(X(300), 146, X(200), 146, color=ORANGE, width=4)
    s.text(X(300) + 12, 146, "2nd: 100 m west", size=18, color=ORANGE, weight="bold", anchor="start")
    s.arrow(X(0), 200, X(200), 200, color=RED, width=6)
    s.label(X(100), 180, "displacement = +200 m", size=18, color=RED, weight="bold")
    for m, name in ((0, "start"), (300, "shop"), (200, "finish")):
        s.dot(X(m), y, 7, color=INK)
    s.text(X(0), y - 22, "start", size=15, weight="bold")
    s.text(X(300), y - 22, "shop", size=15, weight="bold")
    s.text(X(200), y - 22, "finish", size=15, weight="bold")
    s.line(X(300), 104, X(300), 140, color=MUTED, width=1.5, dash="5 5")
    s.text(360, 34, "distance = 300 m + 100 m = 400 m", size=20, weight="bold")
    return s


@fig
def ticker_tape():
    s = Svg(720, 380, "Ticker-tape patterns",
            "Three ticker tapes from a 50 Hz timer. Equal gaps between dots mean constant velocity; gaps that grow mean acceleration; "
            "gaps that shrink mean deceleration. Each gap is made in 0.02 s.")
    rows = [
        ("constant velocity", [40] * 11, BLUE),
        ("accelerating", [12, 18, 24, 30, 36, 42, 48, 54, 60, 66], GREEN),
        ("decelerating", [66, 60, 54, 48, 42, 36, 30, 24, 18, 12], RED),
    ]
    y = 90
    for name, gaps, col in rows:
        s.rect(200, y - 20, 500, 40, fill="#fffdf5", stroke=INK, width=2)
        x = 220
        s.dot(x, y, 5, color=INK)
        for g in gaps:
            x += g
            if x > 690:
                break
            s.dot(x, y, 5, color=INK)
        s.text(188, y, name, size=17, color=col, weight="bold", anchor="end")
        y += 100
    # bracket on the first tape
    s.line(220, 126, 220, 138, color=MUTED, width=1.5)
    s.line(260, 126, 260, 138, color=MUTED, width=1.5)
    s.line(220, 132, 260, 132, color=MUTED, width=1.5)
    s.text(270, 136, "one gap = 0.02 s", size=15, color=MUTED, anchor="start")
    s.text(360, 30, "50 Hz timer: 50 dots every second", size=18, color=MUTED)
    s.text(460, 236, "gaps grow: speed increasing", size=15, color=GREEN, anchor="middle")
    s.text(460, 336, "gaps shrink: speed decreasing", size=15, color=RED, anchor="middle")
    return s


@fig
def st_graphs():
    s = Svg(720, 300, "Displacement-time graphs",
            "Three displacement-time graphs: a horizontal line means the body is at rest; a straight sloping line means constant velocity; "
            "a curve that gets steeper means the velocity is increasing.")
    panels = [("at rest", BLUE), ("constant velocity", GREEN), ("speeding up", RED)]
    for i, (name, col) in enumerate(panels):
        x0, y0 = 50 + i * 230, 230
        s.axes(x0, y0, x0 + 190, y0 - 170, xlabel="t", ylabel="s", size=18)
        if i == 0:
            s.line(x0, y0 - 80, x0 + 170, y0 - 80, color=col, width=4)
        elif i == 1:
            s.line(x0, y0, x0 + 165, y0 - 140, color=col, width=4)
        else:
            pts = [(x0 + t, y0 - 140 * (t / 165) ** 2) for t in range(0, 166, 5)]
            s.polyline(pts, color=col, width=4)
        s.text(x0 + 95, 268, name, size=18, color=col, weight="bold")
    s.text(360, 26, "gradient of s–t graph = velocity", size=18, color=MUTED)
    return s


@fig
def vt_area():
    s = Svg(680, 430, "Displacement from the area under a velocity-time graph",
            "A body accelerates uniformly from rest to 12 m/s in 4 s, then moves at 12 m/s for 3 s. "
            "The area of the triangle is 24 m and the area of the rectangle is 36 m, so the displacement is 60 m.")
    x0, y0 = 90, 352
    kx, ky = 62, 18

    def P(t, v):
        return x0 + t * kx, y0 - v * ky

    s.polygon([P(0, 0), P(4, 12), P(4, 0)], fill=F_BLUE, stroke="none", width=0)
    s.polygon([P(4, 0), P(4, 12), P(7, 12), P(7, 0)], fill=F_GREEN, stroke="none", width=0)
    s.axes(x0, y0, x0 + 8.4 * kx, y0 - 15 * ky, xlabel="t / s", ylabel="v / m s⁻¹", size=18)
    s.polyline([P(0, 0), P(4, 12), P(7, 12)], color=INK, width=4)
    s.line(*P(4, 12), *P(4, 0), color=MUTED, width=2, dash="6 5")
    s.line(*P(7, 12), *P(7, 0), color=MUTED, width=2, dash="6 5")
    s.line(*P(0, 12), *P(4, 12), color=MUTED, width=1.5, dash="4 5")
    for t in (4, 7):
        s.text(P(t, 0)[0], y0 + 22, str(t), size=17)
    s.text(x0 - 16, P(0, 12)[1], "12", size=17, anchor="end")
    s.text(*P(2.9, 3.6), "½ × 4 × 12", size=16, color=BLUE, weight="bold")
    s.text(*P(2.9, 1.6), "= 24 m", size=16, color=BLUE, weight="bold")
    s.text(*P(5.5, 7), "3 × 12", size=17, color=GREEN, weight="bold")
    s.text(*P(5.5, 5), "= 36 m", size=17, color=GREEN, weight="bold")
    s.text(340, 34, "displacement = area under graph = 24 m + 36 m = 60 m", size=19, weight="bold")
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
