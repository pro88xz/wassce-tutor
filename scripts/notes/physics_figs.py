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
