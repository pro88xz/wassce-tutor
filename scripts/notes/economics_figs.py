#!/usr/bin/env python3
"""Original diagrams for the Economics notes.

    python3 scripts/notes/economics_figs.py            # write every diagram
    python3 scripts/notes/economics_figs.py name ...   # write some

Each function draws one figure and returns an Svg. Files go to
public/img/economics/<name>.svg and lessons show them from
https://wasscetutor.com/img/economics/<name>.svg. Graphs that plot a lesson's
table use exactly that table's numbers, so the figure and the text agree.
All drawn by WASSCE Tutor.
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
OUT = ROOT / "public/img/economics"
FIGS: dict[str, callable] = {}


def fig(fn):
    FIGS[fn.__name__.replace("_", "-")] = fn
    return fn


def num(v) -> str:
    return str(int(v)) if float(v).is_integer() else f"{v:g}"


def catmull(pts) -> str:
    """A smooth path through the points (Catmull-Rom spline as cubic Béziers)."""
    if len(pts) < 3:
        return "M " + " L ".join(f"{x:.1f} {y:.1f}" for x, y in pts)
    d = [f"M {pts[0][0]:.1f} {pts[0][1]:.1f}"]
    for i in range(len(pts) - 1):
        p0 = pts[i - 1] if i > 0 else pts[i]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[i + 2] if i + 2 < len(pts) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d.append(f"C {c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}")
    return " ".join(d)


class Plot:
    """A pair of axes on an Svg, mapping data (x, y) to the drawing."""

    def __init__(self, s: Svg, x0, y0, w, h, xr, yr):
        self.s, self.x0, self.y0, self.w, self.h = s, x0, y0, w, h
        self.xa, self.xb = xr
        self.ya, self.yb = yr

    def X(self, x):
        return self.x0 + (x - self.xa) / (self.xb - self.xa) * self.w

    def Y(self, y):
        return self.y0 - (y - self.ya) / (self.yb - self.ya) * self.h

    def P(self, x, y):
        return self.X(x), self.Y(y)

    def axes(self, xlabel, ylabel, xticks=(), yticks=(), size=16, zero=True, xaxis_at=None):
        s = self.s
        ax_y = self.Y(xaxis_at) if xaxis_at is not None else self.y0
        s.arrow(self.x0, ax_y, self.x0 + self.w + 16, ax_y, width=2.5)
        s.arrow(self.x0, self.y0, self.x0, self.y0 - self.h - 18, width=2.5)
        s.text(self.x0 + self.w + 16, self.y0 + 36, xlabel, size=size, anchor="end", color=MUTED)
        s.text(self.x0 + 8, self.y0 - self.h - 26, ylabel, size=size, anchor="start", color=MUTED)
        if zero:
            s.text(self.x0 - 9, ax_y + 15, "0", size=13, color=MUTED, anchor="end")
        for v in xticks:
            lab = v if isinstance(v, tuple) else (v, num(v))
            x = self.X(lab[0])
            s.line(x, ax_y, x, ax_y + 6, width=1.6)
            if not (zero and lab[1] == "0"):
                s.text(x, ax_y + 19, lab[1], size=13, color=MUTED)
        for v in yticks:
            lab = v if isinstance(v, tuple) else (v, num(v))
            y = self.Y(lab[0])
            s.line(self.x0 - 6, y, self.x0, y, width=1.6)
            if not (zero and lab[1] == "0" and xaxis_at is None):
                s.text(self.x0 - 10, y, lab[1], size=13, color=MUTED, anchor="end")

    def poly(self, pts, color=INK, width=3.5, dash=None):
        self.s.polyline([self.P(*p) for p in pts], color=color, width=width, dash=dash)

    def smooth(self, pts, color=INK, width=3.5, dash=None):
        self.s.path(catmull([self.P(*p) for p in pts]), color=color, width=width, dash=dash)

    def fn(self, f, a, b, color=INK, width=3.5, dash=None, n=60):
        self.s.polyline([self.P(a + (b - a) * i / n, f(a + (b - a) * i / n)) for i in range(n + 1)], color=color, width=width, dash=dash)

    def guide(self, x, y, color=MUTED, to_x=True, to_y=True):
        px, py = self.P(x, y)
        if to_x:
            self.s.line(px, py, px, self.y0, color=color, width=1.8, dash="6 5")
        if to_y:
            self.s.line(px, py, self.x0, py, color=color, width=1.8, dash="6 5")

    def dot(self, x, y, color=INK, r=5.5):
        self.s.dot(*self.P(x, y), r, color=color)

    def text(self, x, y, t, dx=0, dy=0, **kw):
        px, py = self.P(x, y)
        self.s.text(px + dx, py + dy, t, **kw)

    def shade(self, pts, fill, opacity=0.85):
        self.s.polygon([self.P(*p) for p in pts], fill=fill, stroke="none", width=0, opacity=opacity)


def title(s: Svg, t, y=30, size=19):
    s.text(s.w / 2, y, t, size=size, color=MUTED)


def hbracket(s, x1, x2, y, label, color=RED, size=15, above=True):
    """A double-headed horizontal arrow with a label."""
    s.line(x1, y, x2, y, color=color, width=2.5)
    s.head(x1, y, math.pi, color=color, size=10)
    s.head(x2, y, 0, color=color, size=10)
    s.label((x1 + x2) / 2, y + (-16 if above else 18), label, size=size, color=color, weight="bold")


# ═══ Foundations ════════════════════════════════════════════════════════════

@fig
def scale_of_preference():
    s = Svg(720, 400, "Aminata's scale of preference",
            "Aminata ranks five wants and adds up their cost: food 180, transport 60 and exercise books 40 come to 280 NLe, "
            "within her 300 NLe budget. Sandals (70) and phone data (30) are left unsatisfied.")
    wants = [("1  Food for the month", 180), ("2  Transport to school", 60), ("3  Exercise books", 40),
             ("4  New sandals", 70), ("5  Phone data", 30)]
    k = 1.05  # px per NLe
    x0, y = 280, 78
    total = 0
    for i, (name, cost) in enumerate(wants):
        ok = total + cost <= 300
        s.text(x0 - 12, y + 17, name, size=16, anchor="end", weight="bold" if ok else "normal", color=INK if ok else MUTED)
        s.rect(x0 + total * k, y, cost * k, 34, fill=F_GREEN if ok else F_GREY, stroke=GREEN if ok else MUTED, width=2, rx=4)
        s.text(x0 + (total + cost / 2) * k, y + 17, str(cost), size=14, color=INK if ok else MUTED)
        total += cost
        y += 50
    bx = x0 + 300 * k
    s.line(bx, 62, bx, 334, color=RED, width=3, dash="8 6")
    s.text(bx, 352, "budget NLe 300", size=15, color=RED, weight="bold")
    s.line(x0, 330, x0 + 390 * k, 330, color=MUTED, width=1.5)
    for v in range(0, 401, 100):
        s.line(x0 + v * k, 326, x0 + v * k, 334, color=MUTED, width=1.5)
        if v != 300:
            s.text(x0 + v * k, 348, str(v), size=13, color=MUTED)
    s.text(470, 386, "Wants 1–3 are satisfied; the sandals are the next want forgone.", size=15, color=MUTED)
    title(s, "Running total of the cost of each want (NLe)", y=36, size=17)
    return s


@fig
def ppc():
    s = Svg(660, 470, "Production possibility curve for rice and cassava",
            "The curve joins points A (0 rice, 20 cassava) to E (8 rice, 0 cassava). Point X (2 rice, 8 cassava) lies inside: "
            "resources are idle. Point Y (6 rice, 14 cassava) lies outside and cannot be reached.")
    p = Plot(s, 90, 390, 470, 300, (0, 10), (0, 23))
    p.axes("Rice (bags)", "Cassava (bags)", xticks=range(0, 10, 2), yticks=range(0, 22, 4))
    pts = [(0, 20), (2, 18), (4, 14), (6, 8), (8, 0)]
    p.smooth(pts, color=BLUE, width=4)
    for (x, y), n in zip(pts, "ABCDE"):
        p.dot(x, y, color=BLUE)
        p.text(x, y, n, dx=14, dy=-12, size=17, weight="bold", color=BLUE)
    p.dot(2, 8, color=ORANGE, r=7)
    p.text(2, 8, "X: inside, resources idle", dx=-6, dy=26, size=15, color=ORANGE, weight="bold", anchor="start")
    p.dot(6, 14, color=RED, r=7)
    p.text(6, 14, "Y: outside, unattainable", dx=12, dy=-14, size=15, color=RED, weight="bold", anchor="start")
    p.text(4.9, 11.7, "PPC", size=17, color=BLUE, weight="bold", anchor="end", dx=-4)
    title(s, "Every point on the curve uses all resources fully", y=32)
    return s


@fig
def ppc_growth():
    s = Svg(640, 440, "Economic growth shifts the PPC outwards",
            "Better seeds, more land or more skilled workers move the whole production possibility curve outwards from PPC1 to PPC2: "
            "more of both crops can be produced.")
    p = Plot(s, 90, 370, 450, 280, (0, 11.5), (0, 26))
    p.axes("Rice (bags)", "Cassava (bags)", xticks=range(0, 11, 2), yticks=range(0, 26, 5))
    pts = [(0, 20), (2, 18), (4, 14), (6, 8), (8, 0)]
    p.smooth(pts, color=BLUE, width=4)
    p.smooth([(x * 1.25, y * 1.2) for x, y in pts], color=GREEN, width=4)
    p.text(5.8, 9, "PPC1", size=16, color=BLUE, weight="bold", anchor="end", dx=-8)
    p.text(7.6, 9.9, "PPC2", size=16, color=GREEN, weight="bold", anchor="start", dx=10, dy=-6)
    for a, b in [((3.2, 16.4), (4.2, 19.6)), ((5.6, 10.4), (7.0, 12.6))]:
        s.arrow(*p.P(*a), *p.P(*b), color=GREEN, width=3)
    title(s, "Economic growth: the whole curve shifts out", y=32)
    return s


@fig
def economic_systems():
    s = Svg(720, 360, "The range of economic systems",
            "Economic systems range from capitalism, where markets and private owners decide, through the mixed economy, "
            "to socialism, where the state plans and owns most resources. Sierra Leone is a mixed economy.")
    x1, x2, y = 70, 650, 150
    steps = 40
    for i in range(steps):
        t = i / steps
        r = int(219 + (124 - 219) * t)
        g = int(234 + (58 - 234) * t)
        b = int(254 + (237 - 254) * t)
        s.rect(x1 + (x2 - x1) * t, y - 16, (x2 - x1) / steps + 1, 32, fill=f"#{r:02x}{g:02x}{b:02x}", stroke="none", width=0)
    s.rect(x1, y - 16, x2 - x1, 32, fill="none", stroke=INK, width=2, rx=4)
    cols = [(x1 + 40, "Capitalism", "the market decides", "private ownership", BLUE),
            ((x1 + x2) / 2, "Mixed economy", "market and state", "both sectors", TEAL),
            (x2 - 40, "Socialism", "the state plans", "public ownership", PURPLE)]
    for x, name, l1, l2, col in cols:
        s.line(x, y - 26, x, y + 26, color=INK, width=3)
        s.text(x, y - 44, name, size=19, weight="bold", color=col)
        s.text(x, y + 50, l1, size=15)
        s.text(x, y + 72, l2, size=15, color=MUTED)
    s.arrow((x1 + x2) / 2 - 115, 300, x1 + 20, 300, color=BLUE, width=2.5)
    s.arrow((x1 + x2) / 2 + 115, 300, x2 - 20, 300, color=PURPLE, width=2.5)
    s.text((x1 + x2) / 2, 300, "more market | more state", size=15, color=MUTED)
    s.label((x1 + x2) / 2, 252, "Sierra Leone: a mixed economy", size=15, color=TEAL, weight="bold")
    title(s, "Who decides what, how and for whom to produce?", y=40)
    return s


@fig
def factor_rewards():
    s = Svg(700, 420, "Factors of production and their rewards",
            "Each factor of production earns a reward: land earns rent, labour earns wages, capital earns interest "
            "and the entrepreneur earns profit.")
    rows = [("Land", "rent", "farmland, minerals, rivers", GREEN, F_GREEN),
            ("Labour", "wages", "farmers, teachers, miners", BLUE, F_BLUE),
            ("Capital", "interest", "tools, machines, buildings", ORANGE, F_AMBER),
            ("Entrepreneur", "profit", "organises and takes risks", PURPLE, F_PURPLE)]
    y = 80
    for name, reward, ex, col, fill in rows:
        s.rect(50, y, 230, 66, fill=fill, stroke=col, width=2.5, rx=10)
        s.text(165, y + 25, name, size=20, weight="bold", color=col)
        s.text(165, y + 49, ex, size=13, color=MUTED)
        s.arrow(290, y + 33, 430, y + 33, color=col, width=3)
        s.text(360, y + 20, "earns", size=14, color=MUTED)
        s.rect(440, y + 8, 200, 50, fill="#ffffff", stroke=col, width=2.5, rx=25)
        s.text(540, y + 33, reward.capitalize(), size=20, weight="bold", color=col)
        y += 82
    title(s, "Factor of production  →  its reward", y=40)
    return s


@fig
def production_chain():
    s = Svg(720, 380, "Primary, secondary and tertiary production",
            "Fish moves through the three stages of production: caught by fishermen at Tombo (primary), smoked and packed (secondary), "
            "then transported and sold in Freetown markets (tertiary) before it reaches the consumer.")
    boxes = [("Primary", "extracts from nature", "fishing at Tombo", GREEN, F_GREEN),
             ("Secondary", "processes and makes", "smoking and packing fish", ORANGE, F_AMBER),
             ("Tertiary", "provides services", "transport, trade, banking", BLUE, F_BLUE)]
    x = 30
    for i, (name, what, ex, col, fill) in enumerate(boxes):
        s.rect(x, 110, 190, 150, fill=fill, stroke=col, width=2.5, rx=12)
        s.text(x + 95, 145, name, size=21, weight="bold", color=col)
        s.text(x + 95, 178, what, size=14)
        s.text(x + 95, 222, ex, size=14, color=MUTED, italic=True)
        if i < 2:
            s.arrow(x + 196, 185, x + 236, 185, color=INK, width=3)
        x += 240
    s.text(360, 300, "→  the consumer buys smoked fish in a Freetown market", size=16, weight="bold")
    s.text(360, 330, "Direct services (teachers, nurses) are tertiary production too.", size=14, color=MUTED)
    title(s, "Production is complete only when the good reaches the consumer", y=50, size=18)
    return s


@fig
def micro_macro():
    s = Svg(720, 380, "Microeconomics and macroeconomics",
            "Microeconomics looks at single units: one household, one firm, one market. Macroeconomics looks at the whole economy: "
            "national income, the general price level, unemployment and the balance of payments.")
    s.rect(30, 80, 300, 250, fill=F_BLUE, stroke=BLUE, width=2.5, rx=14)
    s.text(180, 115, "Microeconomics", size=22, weight="bold", color=BLUE)
    s.text(180, 142, "the trees: single units", size=15, color=MUTED, italic=True)
    for i, t in enumerate(["one household's spending", "one firm's costs and output", "the price of palm oil", "wages in one occupation"]):
        s.text(60, 182 + i * 36, "•  " + t, size=16, anchor="start")
    s.rect(390, 80, 300, 250, fill=F_GREEN, stroke=GREEN, width=2.5, rx=14)
    s.text(540, 115, "Macroeconomics", size=22, weight="bold", color=GREEN)
    s.text(540, 142, "the forest: the whole economy", size=15, color=MUTED, italic=True)
    for i, t in enumerate(["national income (GDP)", "inflation (general prices)", "unemployment", "balance of payments"]):
        s.text(420, 182 + i * 36, "•  " + t, size=16, anchor="start")
    title(s, "Two branches of economics", y=44, size=19)
    return s


@fig
def capital_formation():
    s = Svg(700, 520, "The cycle of capital formation",
            "Income that is not spent is saved; banks lend the savings to firms; firms invest in capital goods such as machines; "
            "more capital raises output and income, which allows more saving.")
    cx, cy, r = 350, 270, 185
    steps = [("Income", BLUE, F_BLUE), ("Saving", GREEN, F_GREEN), ("Banks lend", TEAL, "#ccfbf1"),
             ("Investment in\ncapital goods", ORANGE, F_AMBER), ("More output", PURPLE, F_PURPLE)]
    n = len(steps)
    pts = []
    for i in range(n):
        a = math.radians(90 - i * 360 / n)
        pts.append((cx + r * math.cos(a), cy - r * math.sin(a)))
    for i in range(n):
        a1 = math.radians(90 - i * 360 / n - 19)
        a2 = math.radians(90 - (i + 1) * 360 / n + 19)
        x1, y1 = cx + r * math.cos(a1), cy - r * math.sin(a1)
        x2, y2 = cx + r * math.cos(a2), cy - r * math.sin(a2)
        s.path(f"M {x1:.1f} {y1:.1f} A {r} {r} 0 0 1 {x2:.1f} {y2:.1f}", color=MUTED, width=3, arrow="end")
    for (x, y), (name, col, fill) in zip(pts, steps):
        lines = name.split("\n")
        s.rect(x - 78, y - 26 - (10 if len(lines) > 1 else 0), 156, 52 + (20 if len(lines) > 1 else 0), fill=fill, stroke=col, width=2.5, rx=12)
        for k, ln in enumerate(lines):
            s.text(x, y + (k - (len(lines) - 1) / 2) * 22, ln, size=17, weight="bold", color=col)
    s.text(cx, cy, "capital", size=18, color=MUTED, italic=True)
    s.text(cx, cy + 24, "formation", size=18, color=MUTED, italic=True)
    return s


@fig
def tools_bar_chart():
    s = Svg(640, 420, "Bar chart of rice sold by a shop in one week",
            "Bags of rice sold: Monday 12, Tuesday 8, Wednesday 10, Thursday 6, Friday 14.")
    p = Plot(s, 90, 350, 470, 260, (0, 5), (0, 16))
    p.axes("Day", "Bags sold", yticks=range(0, 17, 4))
    data = [("Mon", 12), ("Tue", 8), ("Wed", 10), ("Thu", 6), ("Fri", 14)]
    for i, (d, v) in enumerate(data):
        x0, y0 = p.P(i + 0.2, v)
        x1, _ = p.P(i + 0.8, 0)
        s.rect(x0, y0, x1 - x0, p.y0 - y0, fill=F_BLUE, stroke=BLUE, width=2.5)
        s.text((x0 + x1) / 2, y0 - 12, str(v), size=15, weight="bold", color=BLUE)
        s.text((x0 + x1) / 2, p.y0 + 20, d, size=15, color=MUTED)
    title(s, "Equal bar widths, equal gaps, value axis from zero", y=34)
    return s


@fig
def tools_pie_chart():
    s = Svg(640, 420, "Pie chart of a household's monthly spending",
            "A household spends NLe 600: food 300 (180 degrees), rent 150 (90 degrees), transport 90 (54 degrees) "
            "and school fees 60 (36 degrees).")
    cx, cy, r = 230, 220, 150
    items = [("Food", 180, GREEN, F_GREEN), ("Rent", 90, BLUE, F_BLUE), ("Transport", 54, ORANGE, F_AMBER),
             ("School fees", 36, PURPLE, F_PURPLE)]
    a = 90.0
    for name, deg, col, fill in items:
        a2 = a - deg
        x1, y1 = cx + r * math.cos(math.radians(a)), cy - r * math.sin(math.radians(a))
        x2, y2 = cx + r * math.cos(math.radians(a2)), cy - r * math.sin(math.radians(a2))
        large = 1 if deg > 180 else 0
        s.path(f"M {cx} {cy} L {x1:.1f} {y1:.1f} A {r} {r} 0 {large} 1 {x2:.1f} {y2:.1f} Z", color=col, width=2.5, fill=fill)
        mid = math.radians((a + a2) / 2)
        s.text(cx + r * 0.62 * math.cos(mid), cy - r * 0.62 * math.sin(mid), f"{deg}°", size=15, weight="bold", color=col)
        a = a2
    y = 140
    for name, deg, col, fill in items:
        s.rect(430, y - 12, 24, 24, fill=fill, stroke=col, width=2, rx=4)
        s.text(464, y, f"{name}", size=16, anchor="start", weight="bold")
        s.text(464, y + 22, f"NLe {round(deg / 360 * 600)}", size=14, anchor="start", color=MUTED)
        y += 58
    title(s, "angle = value ÷ total × 360°", y=36)
    return s


@fig
def tools_line_graph():
    s = Svg(640, 420, "Line graph of the price of a bag of rice",
            "Illustrative monthly price of a 50 kg bag of rice: January 650, February 660, March 700, April 720, May 760, June 750 NLe.")
    p = Plot(s, 100, 340, 450, 250, (0.5, 6.9), (600, 780))
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    vals = [650, 660, 700, 720, 760, 750]
    p.axes("Month", "Price (NLe)", yticks=range(600, 781, 40), zero=False)
    s.text(p.x0 - 4, p.y0 + 4, "≈", size=18, color=MUTED, anchor="end")
    for i, m in enumerate(months):
        s.text(p.X(i + 1), p.y0 + 20, m, size=14, color=MUTED)
    pts = [(i + 1, v) for i, v in enumerate(vals)]
    p.poly(pts, color=BLUE, width=3.5)
    for x, v in pts:
        p.dot(x, v, color=BLUE)
        p.text(x, v, str(v), dy=-16, size=13, color=BLUE, weight="bold")
    title(s, "Time on the x-axis; a rising line shows prices increasing", y=34)
    return s


@fig
def tools_histogram():
    s = Svg(640, 430, "Histogram of traders' daily earnings",
            "Daily earnings of 40 market traders: NLe 0 to 49, 4 traders; 50 to 99, 9; 100 to 149, 14; 150 to 199, 8; 200 to 249, 5. "
            "The bars touch because the classes are continuous.")
    p = Plot(s, 90, 350, 470, 260, (0, 250), (0, 16))
    p.axes("Daily earnings (NLe)", "Number of traders", xticks=range(0, 251, 50), yticks=range(0, 17, 4))
    data = [(0, 4), (50, 9), (100, 14), (150, 8), (200, 5)]
    for lo, f in data:
        x0, y0 = p.P(lo, f)
        x1, _ = p.P(lo + 50, 0)
        s.rect(x0, y0, x1 - x0, p.y0 - y0, fill=F_AMBER, stroke=ORANGE, width=2.5)
        s.text((x0 + x1) / 2, y0 - 12, str(f), size=15, weight="bold", color=ORANGE)
    title(s, "Bars touch: the classes run on without gaps", y=34)
    return s


@fig
def tools_frequency():
    s = Svg(640, 440, "Household sizes in a survey of 25 households",
            "Frequency of household sizes: 2 people, 3 households; 3 people, 5; 4 people, 8; 5 people, 6; 6 people, 2; 7 people, 1. "
            "The mode and the median are 4 people; the mean is about 4.1.")
    p = Plot(s, 90, 350, 470, 260, (1, 8), (0, 10))
    p.axes("Household size (people)", "Number of households", yticks=range(0, 11, 2), zero=False)
    data = [(2, 3), (3, 5), (4, 8), (5, 6), (6, 2), (7, 1)]
    for x, f in data:
        x0, y0 = p.P(x - 0.3, f)
        x1, _ = p.P(x + 0.3, 0)
        s.rect(x0, y0, x1 - x0, p.y0 - y0, fill=F_PURPLE if x == 4 else F_BLUE, stroke=PURPLE if x == 4 else BLUE, width=2.5)
        s.text((x0 + x1) / 2, y0 - 12, str(f), size=15, weight="bold", color=PURPLE if x == 4 else BLUE)
        s.text((x0 + x1) / 2, p.y0 + 20, str(x), size=15, color=MUTED)
    mean = 102 / 25
    s.line(p.X(mean), p.Y(7.6), p.X(mean), p.y0, color=RED, width=2.5, dash="8 6")
    s.arrow(p.X(mean), p.y0 + 62, p.X(mean), p.y0 + 30, color=RED, width=2.5)
    s.text(p.X(mean) + 10, p.y0 + 56, "mean ≈ 4.1", size=15, weight="bold", color=RED, anchor="start")
    p.text(4, 8, "mode = median = 4", dx=-30, dy=-34, size=15, weight="bold", color=PURPLE, anchor="end")
    title(s, "Mean = Σfx ÷ Σf = 102 ÷ 25", y=34)
    return s


# ═══ Demand, supply and price ═══════════════════════════════════════════════

DEMAND = [(0, 30), (20, 25), (40, 20), (60, 15), (80, 10), (100, 5)]
SUPPLY = [(20, 5), (40, 10), (60, 15), (80, 20), (100, 25), (120, 30)]


@fig
def demand_curve():
    s = Svg(640, 440, "Demand curve for plantain",
            "Plotted from the demand schedule: at NLe 30 nothing is bought, at NLe 20 forty bunches, at NLe 10 eighty bunches. "
            "The curve slopes downwards from left to right.")
    p = Plot(s, 90, 370, 460, 290, (0, 112), (0, 33))
    p.axes("Quantity demanded (bunches)", "Price (NLe)", xticks=range(0, 101, 20), yticks=range(5, 31, 5))
    p.poly(DEMAND, color=BLUE, width=4)
    for x, y in DEMAND:
        p.dot(x, y, color=BLUE)
    p.guide(40, 20)
    p.guide(80, 10)
    p.text(40, 20, "A", dx=12, dy=-12, size=17, weight="bold")
    p.text(80, 10, "B", dx=12, dy=-12, size=17, weight="bold")
    p.text(100, 5, "D", dx=14, dy=-10, size=19, weight="bold", color=BLUE)
    title(s, "Price falls from NLe 20 to NLe 10: quantity demanded rises from 40 to 80", y=32, size=17)
    return s


@fig
def supply_curve():
    s = Svg(640, 440, "Supply curve for plantain",
            "Plotted from the supply schedule: at NLe 5 twenty bunches are offered, at NLe 15 sixty, at NLe 30 one hundred and twenty. "
            "The curve slopes upwards from left to right.")
    p = Plot(s, 90, 370, 460, 290, (0, 130), (0, 33))
    p.axes("Quantity supplied (bunches)", "Price (NLe)", xticks=range(0, 121, 20), yticks=range(5, 31, 5))
    p.poly(SUPPLY, color=GREEN, width=4)
    for x, y in SUPPLY:
        p.dot(x, y, color=GREEN)
    p.guide(40, 10)
    p.guide(100, 25)
    p.text(120, 30, "S", dx=14, dy=4, size=19, weight="bold", color=GREEN)
    title(s, "A higher price brings out a larger quantity supplied", y=32)
    return s


@fig
def equilibrium():
    s = Svg(680, 460, "Market equilibrium for plantain",
            "Demand and supply cross at the equilibrium E: price NLe 15, quantity 60 bunches. At NLe 25 there is a surplus of 80 bunches; "
            "at NLe 10 a shortage of 40.")
    p = Plot(s, 90, 380, 500, 300, (0, 130), (0, 33))
    p.axes("Quantity (bunches)", "Price (NLe)", xticks=range(0, 121, 20), yticks=range(5, 31, 5))
    p.poly(DEMAND, color=BLUE, width=4)
    p.poly(SUPPLY, color=GREEN, width=4)
    p.text(100, 5, "D", dx=14, dy=-8, size=19, weight="bold", color=BLUE)
    p.text(120, 30, "S", dx=14, dy=4, size=19, weight="bold", color=GREEN)
    p.guide(60, 15, color=INK)
    p.dot(60, 15, r=7)
    p.text(60, 15, "E", dx=-18, dy=-10, size=19, weight="bold")
    hbracket(s, p.X(20), p.X(100), p.Y(25), "surplus 80", color=RED)
    hbracket(s, p.X(40), p.X(80), p.Y(10), "shortage 40", color=ORANGE, above=False)
    title(s, "Equilibrium: quantity demanded = quantity supplied = 60 at NLe 15", y=32, size=17)
    return s


def _generic_market(p: Plot, dshift=0.0, sshift=0.0, dcol=BLUE, scol=GREEN):
    """Straight-line D and S on a 0-10 square, optionally shifted right by dshift/sshift."""
    p.fn(lambda q: 9 - 0.8 * (q - dshift), 0.5 + dshift, 9.5 + dshift if dshift < 0 else min(10.5, 9.5 + dshift), color=dcol)
    p.fn(lambda q: 1 + 0.8 * (q - sshift), 0.5 + sshift, 9.5 + sshift if sshift < 0 else min(10.5, 9.5 + sshift), color=scol)


def _eq(dshift=0.0, sshift=0.0):
    # 9 - 0.8(q - d) = 1 + 0.8(q - s)  ->  q = (8 + 0.8d + 0.8s) / 1.6
    q = (8 + 0.8 * dshift + 0.8 * sshift) / 1.6
    return q, 1 + 0.8 * (q - sshift)


@fig
def equilibrium_shifts():
    s = Svg(760, 420, "Effects of shifts in demand and supply on equilibrium",
            "Left: demand increases from D1 to D2, so equilibrium price and quantity both rise. Right: supply increases from S1 to S2 "
            "(for example a bumper harvest), so price falls and quantity rises.")
    for k, (name, d, sh) in enumerate([("Demand increases", 2.2, 0.0), ("Supply increases", 0.0, 2.2)]):
        p = Plot(s, 70 + k * 380, 340, 290, 250, (0, 11.5), (0, 10.5))
        q1, p1 = _eq()
        q2, p2 = _eq(d, sh)
        p.axes("Quantity", "Price", xticks=[(q1, "Q1"), (q2, "Q2")], yticks=[(p1, "P1"), (p2, "P2")], zero=False)
        p.fn(lambda q: 9 - 0.8 * q, 0.6, 9.6, color=BLUE)
        p.fn(lambda q: 1 + 0.8 * q, 0.4, 9.6, color=GREEN)
        if d:
            p.fn(lambda q: 9 - 0.8 * (q - d), 0.6 + d, 11.2, color=BLUE, dash="9 6")
            p.text(11.2, 9 - 0.8 * (11.2 - d), "D2", dx=4, dy=14, size=16, weight="bold", color=BLUE, anchor="start")
            s.arrow(*p.P(4.2, 6.2), *p.P(5.9, 6.2), color=BLUE, width=2.5)
        if sh:
            p.fn(lambda q: 1 + 0.8 * (q - sh), 0.4 + sh, 11.2, color=GREEN, dash="9 6")
            p.text(11.2, 1 + 0.8 * (11.2 - sh), "S2", dx=4, dy=0, size=16, weight="bold", color=GREEN, anchor="start")
            s.arrow(*p.P(4.4, 3.4), *p.P(6.1, 3.4), color=GREEN, width=2.5)
        p.text(9.6, 9 - 0.8 * 9.6, "D1", dx=6, dy=10, size=16, weight="bold", color=BLUE, anchor="start")
        p.text(9.6, 1 + 0.8 * 9.6, "S1", dx=6, dy=0, size=16, weight="bold", color=GREEN, anchor="start")
        for q, pr, n in ((q1, p1, "E1"), (q2, p2, "E2")):
            p.guide(q, pr)
            p.dot(q, pr, r=6)
            p.text(q, pr, n, dx=-14, dy=-12, size=15, weight="bold")
        s.text(p.x0 + 145, 46, name, size=18, weight="bold")
    return s


@fig
def price_controls():
    s = Svg(760, 430, "Maximum and minimum prices",
            "Left: a maximum price of NLe 10, below equilibrium, causes a shortage of 40 bunches. Right: a minimum price of NLe 20, "
            "above equilibrium, causes a surplus of 40 bunches.")
    for k, (name, price, col) in enumerate([("Maximum price NLe 10", 10, RED), ("Minimum price NLe 20", 20, ORANGE)]):
        p = Plot(s, 75 + k * 385, 350, 280, 260, (0, 125), (0, 33))
        p.axes("Quantity", "Price (NLe)", xticks=[0, 40, 80, 120], yticks=[10, 15, 20, 30])
        p.poly(DEMAND, color=BLUE, width=3.5)
        p.poly(SUPPLY, color=GREEN, width=3.5)
        p.text(100, 5, "D", dx=10, dy=-8, size=16, weight="bold", color=BLUE)
        p.text(120, 30, "S", dx=4, dy=16, size=16, weight="bold", color=GREEN)
        p.dot(60, 15, r=5)
        p.text(60, 15, "E", dx=-14, dy=-8, size=15, weight="bold")
        s.line(p.x0, p.Y(price), p.X(122), p.Y(price), color=col, width=3, dash="10 6")
        lo, hi = (40, 80)
        hbracket(s, p.X(lo), p.X(hi), p.Y(price) + (22 if price < 15 else -22),
                 "shortage 40" if price < 15 else "surplus 40", color=col, size=14, above=price >= 15)
        p.guide(lo, price)
        p.guide(hi, price, to_y=False)
        s.text(p.x0 + 140, 46, name, size=17, weight="bold", color=col)
    return s


@fig
def tax_incidence():
    s = Svg(680, 450, "Effect of a tax on a good",
            "A tax per unit shifts supply up from S1 to S2 by the amount of the tax. The price paid by consumers rises from P1 to P2 "
            "and the quantity falls from Q1 to Q2. Consumers bear P1 to P2 of the tax and producers bear the rest.")
    p = Plot(s, 90, 370, 480, 290, (0, 11), (0, 11))
    tax = 3.2
    q1, p1 = _eq()
    q2 = (8 - tax) / 1.6
    p2 = 9 - 0.8 * q2
    pn = p2 - tax
    p.axes("Quantity", "Price", xticks=[(q2, "Q2"), (q1, "Q1")], yticks=[(pn, "P2 − tax"), (p1, "P1"), (p2, "P2")], zero=False)
    p.shade([(0, p1), (q2, p1), (q2, p2), (0, p2)], F_BLUE)
    p.shade([(0, pn), (q2, pn), (q2, p1), (0, p1)], F_GREEN)
    p.fn(lambda q: 9 - 0.8 * q, 0.6, 9.8, color=BLUE)
    p.fn(lambda q: 1 + 0.8 * q, 0.4, 9.6, color=GREEN)
    p.fn(lambda q: 1 + tax + 0.8 * q, 0.2, 9.2, color=RED, dash="9 6")
    p.text(9.8, 9 - 0.8 * 9.8, "D", dx=8, dy=8, size=17, weight="bold", color=BLUE, anchor="start")
    p.text(9.6, 1 + 0.8 * 9.6, "S1", dx=8, size=17, weight="bold", color=GREEN, anchor="start")
    p.text(9.2, 1 + tax + 0.8 * 9.2, "S2 = S1 + tax", dx=8, size=16, weight="bold", color=RED, anchor="start")
    p.guide(q1, p1)
    p.guide(q2, p2)
    p.guide(q2, pn, to_y=True, to_x=False)
    p.dot(q1, p1)
    p.dot(q2, p2)
    s.label(p.X(q2 * 0.42), p.Y((p1 + p2) / 2), "consumers' share", size=14, color=BLUE, weight="bold")
    s.label(p.X(q2 * 0.42), p.Y((p1 + pn) / 2), "producers' share", size=14, color=GREEN, weight="bold")
    title(s, "The tax is shared: the price rises by less than the tax", y=32)
    return s


@fig
def demand_shift():
    s = Svg(760, 420, "Movement along a demand curve and a shift of the curve",
            "Left: a fall in the good's own price moves buyers along the same demand curve from A to B (an extension of demand). "
            "Right: a change in income or tastes shifts the whole curve: right to D2 for an increase, left to D3 for a decrease.")
    p = Plot(s, 70, 340, 290, 260, (0, 10.5), (0, 10.5))
    p.axes("Quantity", "Price", xticks=[(3, "Q1"), (6, "Q2")], yticks=[(6.6, "P1"), (4.2, "P2")], zero=False)
    p.fn(lambda q: 9 - 0.8 * q, 0.5, 10, color=BLUE)
    for q, n in ((3, "A"), (6, "B")):
        p.guide(q, 9 - 0.8 * q)
        p.dot(q, 9 - 0.8 * q)
        p.text(q, 9 - 0.8 * q, n, dx=12, dy=-10, size=16, weight="bold")
    s.arrow(*p.P(3.4, 6.8), *p.P(5.6, 4.9), color=ORANGE, width=3)
    p.text(10, 1, "D", dx=4, dy=-10, size=16, weight="bold", color=BLUE)
    s.text(p.x0 + 145, 30, "Change in quantity demanded", size=17, weight="bold")
    q = Plot(s, 450, 340, 290, 260, (0, 10.5), (0, 10.5))
    q.axes("Quantity", "Price", zero=False)
    for sh, col, n, dash in ((0, BLUE, "D1", None), (2.2, GREEN, "D2", None), (-2.2, RED, "D3", None)):
        q.fn(lambda x, sh=sh: 9 - 0.8 * (x - sh), max(0.3, 0.5 + sh), min(10.3, 9.6 + sh), color=col, dash=dash)
        end = min(10.3, 9.6 + sh)
        q.text(end, 9 - 0.8 * (end - sh), n, dx=4, dy=-10, size=16, weight="bold", color=col, anchor="start")
    s.arrow(*q.P(5.0, 5.0), *q.P(6.9, 5.0), color=GREEN, width=3)
    s.arrow(*q.P(3.4, 4.0), *q.P(1.6, 4.0), color=RED, width=3)
    s.text(q.x0 + 145, 30, "Change in demand (a shift)", size=17, weight="bold")
    return s


@fig
def supply_shift():
    s = Svg(760, 420, "Movement along a supply curve and a shift of the curve",
            "Left: a rise in the good's own price moves sellers along the same supply curve from A to B (an extension of supply). "
            "Right: lower costs or better technology shift the curve right to S2 (increase); higher costs shift it left to S3 (decrease).")
    p = Plot(s, 70, 340, 290, 260, (0, 10.5), (0, 10.5))
    p.axes("Quantity", "Price", xticks=[(3, "Q1"), (6, "Q2")], yticks=[(3.4, "P1"), (5.8, "P2")], zero=False)
    p.fn(lambda q: 1 + 0.8 * q, 0.3, 10, color=GREEN)
    for q, n in ((3, "A"), (6, "B")):
        p.guide(q, 1 + 0.8 * q)
        p.dot(q, 1 + 0.8 * q)
        p.text(q, 1 + 0.8 * q, n, dx=-14, dy=-10, size=16, weight="bold")
    s.arrow(*p.P(3.6, 3.4), *p.P(5.6, 5.0), color=ORANGE, width=3)
    p.text(10, 9, "S", dx=4, dy=0, size=16, weight="bold", color=GREEN, anchor="start")
    s.text(p.x0 + 145, 30, "Change in quantity supplied", size=17, weight="bold")
    q = Plot(s, 450, 340, 290, 260, (0, 10.5), (0, 10.5))
    q.axes("Quantity", "Price", zero=False)
    for sh, col, n in ((0, GREEN, "S1"), (2.2, BLUE, "S2"), (-2.2, RED, "S3")):
        a = max(0.2, 0.3 + sh)
        b = min(10.3, 9.6 + sh)
        q.fn(lambda x, sh=sh: 1 + 0.8 * (x - sh), a, b, color=col)
        q.text(b, 1 + 0.8 * (b - sh), n, dx=4, dy=6, size=16, weight="bold", color=col, anchor="start")
    s.arrow(*q.P(4.6, 5.4), *q.P(6.6, 5.4), color=BLUE, width=3)
    s.arrow(*q.P(4.0, 6.6), *q.P(2.0, 6.6), color=RED, width=3)
    s.text(q.x0 + 145, 30, "Change in supply (a shift)", size=17, weight="bold")
    return s


@fig
def exceptional_demand():
    s = Svg(620, 440, "An exceptional (upward-sloping) demand curve",
            "For Giffen goods, goods of ostentation, or when buyers expect prices to keep rising, more is bought at a higher price: "
            "the demand curve slopes upwards.")
    p = Plot(s, 90, 350, 420, 270, (0, 10), (0, 10))
    p.axes("Quantity demanded", "Price", xticks=[(3, "Q1"), (6.5, "Q2")], yticks=[(3.6, "P1"), (6.4, "P2")], zero=False)
    p.fn(lambda q: 1.2 + 0.8 * q, 0.5, 9.2, color=BLUE)
    for q in (3, 6.5):
        p.guide(q, 1.2 + 0.8 * q)
        p.dot(q, 1.2 + 0.8 * q)
    p.text(9.2, 1.2 + 0.8 * 9.2, "D", dx=10, dy=4, size=18, weight="bold", color=BLUE, anchor="start")
    s.text(300, 420, "Giffen goods · goods of ostentation · expected price rises", size=15, color=MUTED)
    title(s, "Price rises from P1 to P2, and more is bought", y=32)
    return s


@fig
def exceptional_supply():
    s = Svg(760, 420, "Exceptional supply curves",
            "Left: the backward-bending supply curve of labour. Above a certain wage, workers choose more leisure and offer fewer hours. "
            "Right: fixed supply, such as land, is a vertical line: the quantity cannot change whatever the price.")
    p = Plot(s, 70, 340, 290, 260, (0, 10.5), (0, 10.5))
    p.axes("Hours of work offered", "Wage rate", zero=False)
    pts = [(1.0, 1.0), (4.5, 3.6), (6.8, 5.6), (7.6, 7.0), (6.9, 8.6), (5.4, 9.8)]
    p.smooth(pts, color=GREEN, width=4)
    p.text(5.4, 9.8, "S (labour)", dx=-8, dy=-8, size=15, weight="bold", color=GREEN, anchor="end")
    p.guide(7.6, 7.0)
    p.text(7.6, 7.0, "bends back", dx=10, dy=6, size=14, color=MUTED, anchor="start")
    s.text(p.x0 + 145, 30, "Labour: more leisure at high wages", size=16, weight="bold")
    q = Plot(s, 450, 340, 290, 260, (0, 10.5), (0, 10.5))
    q.axes("Quantity", "Price", xticks=[(5, "Q")], zero=False)
    s.line(q.X(5), q.Y(0.6), q.X(5), q.Y(9.8), color=GREEN, width=4)
    q.text(5, 9.8, "S", dx=12, dy=4, size=17, weight="bold", color=GREEN, anchor="start")
    q.text(5, 5, "fixed at any price", dx=12, size=14, color=MUTED, anchor="start")
    s.text(q.x0 + 145, 30, "Fixed supply, such as land", size=16, weight="bold")
    return s


# ═══ Elasticity ════════════════════════════════════════════════════════════

@fig
def ped_types():
    s = Svg(720, 640, "The five kinds of price elasticity of demand",
            "Perfectly inelastic demand is a vertical line (PED 0); inelastic demand is steep (PED below 1); unitary demand is a "
            "rectangular hyperbola (PED 1); elastic demand is flat (PED above 1); perfectly elastic demand is horizontal (PED infinite).")
    panels = [
        ("Perfectly inelastic", "PED = 0", lambda p: s.line(p.X(5), p.Y(0.6), p.X(5), p.Y(9.4), color=BLUE, width=4)),
        ("Inelastic", "PED < 1", lambda p: p.fn(lambda q: 9.5 - 2.0 * (q - 1), 1, 5.3, color=BLUE, width=4)),
        ("Unitary", "PED = 1", lambda p: p.fn(lambda q: 12 / q, 1.3, 9.4, color=BLUE, width=4)),
        ("Elastic", "PED > 1", lambda p: p.fn(lambda q: 7 - 0.45 * q, 0.6, 9.4, color=BLUE, width=4)),
        ("Perfectly elastic", "PED = ∞", lambda p: s.line(p.X(0.4), p.Y(5), p.X(9.4), p.Y(5), color=BLUE, width=4)),
    ]
    pos = [(70, 270), (300, 270), (530, 270), (185, 570), (415, 570)]
    for (name, coef, draw), (x0, y0) in zip(panels, pos):
        p = Plot(s, x0, y0, 160, 160, (0, 10), (0, 10))
        p.axes("Q", "P", zero=False, size=15)
        draw(p)
        s.text(x0 + 80, y0 - 200, name, size=17, weight="bold")
        s.text(x0 + 80, y0 + 32, coef, size=16, color=BLUE, weight="bold")
    return s


@fig
def pes_types():
    s = Svg(760, 360, "Elasticity of supply from straight-line supply curves",
            "A straight supply line that starts on the price axis is elastic (PES above 1); one through the origin is unitary (PES 1); "
            "one that starts on the quantity axis is inelastic (PES below 1).")
    panels = [("Elastic", "starts on the price axis", "PES > 1", lambda q: 2.5 + 0.7 * q, 0, 9.3),
              ("Unitary", "passes through the origin", "PES = 1", lambda q: 0.95 * q, 0, 9.6),
              ("Inelastic", "starts on the quantity axis", "PES < 1", lambda q: 1.6 * (q - 3.2), 3.2, 8.9)]
    for k, (name, how, coef, f, a, b) in enumerate(panels):
        x0 = 70 + k * 245
        p = Plot(s, x0, 270, 170, 170, (0, 10), (0, 10))
        p.axes("Q", "P", zero=True, size=15)
        p.fn(f, a, b, color=GREEN, width=4)
        s.text(x0 + 85, 56, name, size=18, weight="bold")
        s.text(x0 + 85, 305, how, size=14, color=MUTED)
        s.text(x0 + 85, 330, coef, size=16, color=GREEN, weight="bold")
    return s


# ═══ Consumer behaviour ═════════════════════════════════════════════════════

@fig
def utility_curves():
    s = Svg(760, 440, "Total and marginal utility",
            "From the oranges table: total utility rises to a maximum of 30 utils at 5 and 6 oranges, then falls. Marginal utility "
            "falls from 10 to 0 at the 6th orange and becomes negative (−2) at the 7th.")
    tu = [(0, 0), (1, 10), (2, 18), (3, 24), (4, 28), (5, 30), (6, 30), (7, 28)]
    mu = [(1, 10), (2, 8), (3, 6), (4, 4), (5, 2), (6, 0), (7, -2)]
    p = Plot(s, 70, 360, 280, 270, (0, 7.6), (0, 33))
    p.axes("Oranges", "Total utility", xticks=range(1, 8), yticks=range(0, 31, 10))
    p.smooth(tu, color=BLUE, width=4)
    for x, y in tu[1:]:
        p.dot(x, y, color=BLUE, r=4.5)
    p.guide(5.5, 30.3, to_x=False)
    p.text(5.5, 30.3, "maximum", dy=-14, size=14, color=MUTED)
    p.text(7, 28, "TU", dx=8, dy=14, size=16, weight="bold", color=BLUE, anchor="start")
    q = Plot(s, 450, 360, 280, 270, (0, 7.6), (-4, 12))
    q.axes("Oranges", "Marginal utility", xticks=range(1, 8), yticks=[-2, 0, 4, 8, 12], xaxis_at=0, zero=False)
    q.poly(mu, color=RED, width=4)
    for x, y in mu:
        q.dot(x, y, color=RED, r=4.5)
    q.text(7, -2, "MU", dx=10, dy=4, size=16, weight="bold", color=RED, anchor="start")
    q.text(7.4, 10.5, "MU = 0 where TU is greatest", size=14, color=MUTED, anchor="end")
    title(s, "Diminishing marginal utility", y=30)
    return s


@fig
def consumer_surplus():
    s = Svg(640, 440, "Consumer surplus",
            "On the plantain demand curve, at a market price of NLe 15 buyers purchase 60 bunches. The triangle above the price and "
            "below the demand curve is consumer surplus; the rectangle below the price is what buyers actually spend.")
    p = Plot(s, 90, 370, 460, 290, (0, 125), (0, 33))
    p.axes("Quantity (bunches)", "Price (NLe)", xticks=[0, 60, 120], yticks=[15, 30])
    p.shade([(0, 30), (0, 15), (60, 15)], F_GREEN)
    p.shade([(0, 0), (0, 15), (60, 15), (60, 0)], F_BLUE, opacity=0.6)
    p.poly([(0, 30), (120, 0)], color=BLUE, width=4)
    s.line(p.x0, p.Y(15), p.X(110), p.Y(15), color=INK, width=2.5, dash="8 6")
    p.text(110, 15, "market price", dx=6, dy=-12, size=14, color=MUTED, anchor="end")
    p.text(6, 21.6, "consumer", size=15, weight="bold", color=GREEN, anchor="start")
    p.text(6, 18.4, "surplus", size=15, weight="bold", color=GREEN, anchor="start")
    p.text(30, 7.5, "amount spent", size=15, weight="bold", color=BLUE)
    p.text(120, 0, "D", dx=-12, dy=-14, size=18, weight="bold", color=BLUE)
    p.dot(60, 15)
    title(s, "What buyers would pay, minus what they actually pay", y=32)
    return s


# ═══ Production and costs ═══════════════════════════════════════════════════

@fig
def product_curves():
    s = Svg(760, 460, "Total, average and marginal product",
            "From the table: total product rises to 48 with 5 and 6 workers, then falls. Marginal product rises to 14 with the 2nd worker, "
            "then falls, reaching 0 at the 6th and −3 at the 7th. Average product peaks at 12.")
    tp = [(0, 0), (1, 10), (2, 24), (3, 36), (4, 44), (5, 48), (6, 48), (7, 45)]
    mp = [(1, 10), (2, 14), (3, 12), (4, 8), (5, 4), (6, 0), (7, -3)]
    ap = [(1, 10), (2, 12), (3, 12), (4, 11), (5, 9.6), (6, 8), (7, 6.4)]
    p = Plot(s, 70, 380, 280, 290, (0, 7.6), (0, 52))
    p.axes("Workers", "Total product", xticks=range(1, 8), yticks=range(0, 51, 10))
    p.smooth(tp, color=BLUE, width=4)
    for x, y in tp[1:]:
        p.dot(x, y, color=BLUE, r=4.5)
    p.text(7, 45, "TP", dx=8, dy=16, size=16, weight="bold", color=BLUE, anchor="start")
    q = Plot(s, 450, 380, 280, 290, (0, 7.6), (-4, 16))
    q.axes("Workers", "AP and MP", xticks=range(1, 8), yticks=[0, 4, 8, 12, 16], xaxis_at=0, zero=False)
    q.smooth(mp, color=RED, width=4)
    q.smooth(ap, color=GREEN, width=4)
    for x, y in mp:
        q.dot(x, y, color=RED, r=4)
    for x, y in ap:
        q.dot(x, y, color=GREEN, r=4)
    q.text(7, -3, "MP", dx=10, dy=4, size=16, weight="bold", color=RED, anchor="start")
    q.text(7, 6.4, "AP", dx=10, dy=0, size=16, weight="bold", color=GREEN, anchor="start")
    q.text(2, 14, "diminishing returns begin", dx=10, dy=-16, size=13, color=MUTED, anchor="start")
    title(s, "The law of diminishing returns", y=30)
    return s


@fig
def total_cost_curves():
    s = Svg(660, 460, "Total, fixed and variable cost",
            "From the cost table: fixed cost is NLe 100 at every output; variable cost rises from 0 to 240; total cost rises from 100 to 340. "
            "The gap between TC and VC is always the fixed cost.")
    p = Plot(s, 90, 380, 470, 300, (0, 6.6), (0, 360))
    p.axes("Output (Q)", "Cost (NLe)", xticks=range(0, 7), yticks=range(0, 361, 100))
    tc = [(0, 100), (1, 140), (2, 170), (3, 190), (4, 220), (5, 270), (6, 340)]
    vc = [(0, 0), (1, 40), (2, 70), (3, 90), (4, 120), (5, 170), (6, 240)]
    p.smooth(tc, color=RED, width=4)
    p.smooth(vc, color=BLUE, width=4)
    p.poly([(0, 100), (6.3, 100)], color=GREEN, width=4)
    p.text(6, 340, "TC", dx=10, dy=4, size=17, weight="bold", color=RED, anchor="start")
    p.text(6, 240, "VC", dx=10, dy=4, size=17, weight="bold", color=BLUE, anchor="start")
    p.text(6.3, 100, "FC", dx=10, dy=4, size=17, weight="bold", color=GREEN, anchor="start")
    x = p.X(5)
    s.line(x, p.Y(170), x, p.Y(270), color=GREEN, width=2.5)
    s.head(x, p.Y(170), math.pi / 2, color=GREEN, size=10)
    s.head(x, p.Y(270), -math.pi / 2, color=GREEN, size=10)
    s.text(x - 8, p.Y(220), "FC = 100", size=14, color=GREEN, weight="bold", anchor="end")
    title(s, "TC = FC + VC", y=32)
    return s


@fig
def unit_cost_curves():
    s = Svg(660, 470, "Average and marginal cost curves",
            "From the cost table: AFC falls steadily; AVC, ATC and MC are U-shaped. MC is lowest at 3 units and cuts AVC (about 30) "
            "and ATC (about 54) near their lowest points.")
    p = Plot(s, 90, 390, 470, 310, (0, 6.6), (0, 150))
    p.axes("Output (Q)", "Cost per unit (NLe)", xticks=range(1, 7), yticks=range(0, 151, 25))
    afc = [(1, 100), (2, 50), (3, 33.3), (4, 25), (5, 20), (6, 16.7)]
    avc = [(1, 40), (2, 35), (3, 30), (4, 30), (5, 34), (6, 40)]
    atc = [(1, 140), (2, 85), (3, 63.3), (4, 55), (5, 54), (6, 56.7)]
    mc = [(1, 40), (2, 30), (3, 20), (4, 30), (5, 50), (6, 70)]
    for pts, col, n, dy in ((afc, GREEN, "AFC", 4), (avc, BLUE, "AVC", 2), (atc, RED, "ATC", -4), (mc, PURPLE, "MC", 4)):
        p.smooth(pts, color=col, width=3.8)
        for x, y in pts:
            p.dot(x, y, color=col, r=4)
        p.text(pts[-1][0], pts[-1][1], n, dx=10, dy=dy, size=16, weight="bold", color=col, anchor="start")
    p.text(3, 20, "MC lowest", dy=22, size=13, color=PURPLE)
    title(s, "MC cuts AVC and ATC at (about) their lowest points", y=32)
    return s


@fig
def revenue_curves():
    s = Svg(760, 440, "Average and marginal revenue",
            "Left: when the price stays at NLe 15, average revenue and marginal revenue are the same horizontal line. Right: when the price "
            "falls from 20 to 10 as more is sold, AR slopes down and MR falls twice as fast, reaching 0 at 6 units.")
    p = Plot(s, 70, 360, 280, 260, (0, 6.5), (0, 24))
    p.axes("Output", "Revenue (NLe)", xticks=range(1, 7), yticks=[0, 5, 10, 15, 20])
    p.poly([(0.3, 15), (6.2, 15)], color=BLUE, width=4)
    p.text(3.2, 15, "P = AR = MR", dy=-16, size=16, weight="bold", color=BLUE)
    s.text(p.x0 + 145, 46, "Price constant at NLe 15", size=17, weight="bold")
    q = Plot(s, 440, 360, 240, 260, (0, 6.5), (0, 24))
    q.axes("Output", "Revenue (NLe)", xticks=range(1, 7), yticks=[0, 5, 10, 15, 20])
    ar = [(1, 20), (2, 18), (3, 16), (4, 14), (5, 12), (6, 10)]
    mr = [(1, 20), (2, 16), (3, 12), (4, 8), (5, 4), (6, 0)]
    q.poly(ar, color=BLUE, width=4)
    q.poly(mr, color=RED, width=4)
    for x, y in ar:
        q.dot(x, y, color=BLUE, r=4)
    for x, y in mr:
        q.dot(x, y, color=RED, r=4)
    q.text(6, 10, "AR (= D)", dx=8, dy=-8, size=15, weight="bold", color=BLUE, anchor="start")
    q.text(6, 0, "MR", dx=8, dy=-10, size=15, weight="bold", color=RED, anchor="start")
    s.text(q.x0 + 145, 46, "Price falls as more is sold", size=17, weight="bold")
    return s


@fig
def break_even():
    s = Svg(660, 460, "Break-even chart",
            "Total revenue (NLe 60 a unit) and total cost from the table. The lines cross between 3 and 4 units: below that output the firm "
            "makes a loss, above it a profit. Profit is greatest (NLe 30) at 5 units.")
    p = Plot(s, 90, 380, 470, 300, (0, 6.6), (0, 380))
    p.axes("Output (Q)", "NLe", xticks=range(0, 7), yticks=range(0, 361, 100))
    tc = [(0, 100), (1, 140), (2, 170), (3, 190), (4, 220), (5, 270), (6, 340)]
    p.poly([(0, 0), (6.2, 372)], color=BLUE, width=4)
    p.smooth(tc, color=RED, width=4)
    be = 3 + 10 / 40  # TR - TC: -10 at 3, +20 at 4 (linear between)
    p.dot(be, 60 * be, r=7)
    p.guide(be, 60 * be, to_y=False)
    p.text(be, 60 * be, "break-even", dx=-12, dy=-14, size=15, weight="bold", anchor="end")
    p.text(1.4, 160, "loss", size=16, color=RED, weight="bold")
    p.text(5.4, 300, "profit", size=16, color=GREEN, weight="bold", anchor="end", dx=-6, dy=-14)
    s.line(p.X(5), p.Y(270), p.X(5), p.Y(300), color=GREEN, width=3)
    p.text(6.2, 372, "TR", dx=8, dy=6, size=17, weight="bold", color=BLUE, anchor="start")
    p.text(6, 340, "TC", dx=10, dy=12, size=17, weight="bold", color=RED, anchor="start")
    title(s, "Break-even where TR = TC: between 3 and 4 units", y=32)
    return s


@fig
def lrac():
    s = Svg(660, 430, "Economies and diseconomies of scale",
            "The long-run average cost curve falls while the firm enjoys economies of scale, reaches its lowest point at the optimum size, "
            "then rises as diseconomies of scale set in.")
    p = Plot(s, 90, 350, 470, 270, (0, 10), (0, 10))
    p.axes("Output (scale of production)", "Average cost", zero=False)
    f = lambda q: 3 + 0.16 * (q - 5.2) ** 2  # noqa: E731
    p.shade([(0.8, 0), (0.8, f(0.8)), (5.2, f(5.2)), (5.2, 0)], F_GREEN, opacity=0.35)
    p.shade([(5.2, 0), (5.2, f(5.2)), (9.4, f(9.4)), (9.4, 0)], F_RED, opacity=0.35)
    p.fn(f, 0.8, 9.4, color=BLUE, width=4.5)
    p.guide(5.2, 3)
    p.dot(5.2, 3, r=7)
    p.text(5.2, 3, "optimum", dy=24, size=15, weight="bold")
    p.text(2.6, 1.4, "economies of scale", size=15, weight="bold", color=GREEN)
    p.text(7.6, 1.4, "diseconomies", size=15, weight="bold", color=RED)
    p.text(9.4, f(9.4), "LRAC", dx=10, size=16, weight="bold", color=BLUE, anchor="start")
    title(s, "Average cost falls, bottoms out, then rises as the firm grows", y=32)
    return s


# ═══ Market structures ══════════════════════════════════════════════════════

def _mc(q):
    return 13 + 3 * (q - 3.5) ** 2


def _atc(q):
    return 25 + 1.2 * (q - 5.5) ** 2


@fig
def perfect_competition():
    s = Svg(760, 450, "The perfectly competitive firm in the short run and long run",
            "Left: at price P1 above average cost, the firm produces where MC = MR and earns abnormal profit (shaded). "
            "Right: new firms enter until the price falls to the lowest point of ATC, where only normal profit is earned.")
    for k, (name, price) in enumerate([("Short run: abnormal profit", 40), ("Long run: normal profit", 25)]):
        p = Plot(s, 70 + k * 375, 370, 255, 290, (0, 10), (0, 60))
        q = 3.5 + math.sqrt((price - 13) / 3)
        c = _atc(q)
        p.axes("Output", "Cost, revenue", xticks=[(q, "Q")], yticks=[(price, "P"), (c, "AC")] if k == 0 else [(price, "P")], zero=False)
        if k == 0:
            p.shade([(0, c), (q, c), (q, price), (0, price)], F_GREEN)
            p.text(q / 2, (c + price) / 2, "abnormal profit", size=14, weight="bold", color=GREEN)
        p.fn(_mc, 1.4, 7.3, color=RED)
        p.fn(_atc, 1.6, 9.4, color=BLUE)
        s.line(p.x0, p.Y(price), p.X(9.8), p.Y(price), color=INK, width=3)
        p.text(9.8, price, "AR = MR", dx=6, size=14, weight="bold", anchor="start")
        p.guide(q, price, to_y=False)
        p.dot(q, price, r=6)
        p.text(7.3, _mc(7.3), "MC", dx=6, dy=10, size=15, weight="bold", color=RED, anchor="start")
        p.text(9.4, _atc(9.4), "ATC", dx=-4, dy=-12, size=15, weight="bold", color=BLUE, anchor="end")
        s.text(p.x0 + 128, 30, name, size=17, weight="bold")
    return s


@fig
def monopoly():
    s = Svg(680, 470, "Monopoly equilibrium",
            "The monopolist produces where marginal cost equals marginal revenue (Q), then charges the price the demand curve allows at that "
            "output (P). Price is above average cost, so it earns abnormal profit (shaded), which can last because entry is blocked.")
    p = Plot(s, 90, 390, 480, 310, (0, 13), (0, 64))
    ar = lambda q: 60 - 5 * q  # noqa: E731
    mr = lambda q: 60 - 10 * q  # noqa: E731
    mc = lambda q: 12 + 2 * (q - 2) ** 2  # noqa: E731
    atc = lambda q: 24.5 + 1.5 * (q - 4.5) ** 2  # noqa: E731
    q = 4.0
    pr, c = ar(q), atc(q)
    p.axes("Output", "Cost, revenue", xticks=[(q, "Q")], yticks=[(c, "AC"), (pr, "P")], zero=False)
    p.shade([(0, c), (q, c), (q, pr), (0, pr)], F_GREEN)
    p.text(q / 2, (c + pr) / 2, "abnormal profit", size=14, weight="bold", color=GREEN)
    p.fn(ar, 0.4, 11.4, color=BLUE)
    p.fn(mr, 0.4, 5.6, color=PURPLE)
    p.fn(mc, 0.6, 6.6, color=RED)
    p.fn(atc, 1.0, 8.4, color=ORANGE)
    p.guide(q, pr)
    p.guide(q, mr(q), to_y=False)
    p.dot(q, mr(q), r=6)
    p.dot(q, pr, r=6)
    p.text(11.4, ar(11.4), "AR = D", dx=6, dy=-10, size=15, weight="bold", color=BLUE, anchor="start")
    p.text(5.6, mr(5.6), "MR", dx=8, dy=4, size=15, weight="bold", color=PURPLE, anchor="start")
    p.text(6.6, mc(6.6), "MC", dx=8, dy=6, size=15, weight="bold", color=RED, anchor="start")
    p.text(8.4, atc(8.4), "ATC", dx=8, dy=4, size=15, weight="bold", color=ORANGE, anchor="start")
    title(s, "Output where MC = MR; price read off the demand curve", y=32)
    return s


@fig
def market_structures_spectrum():
    s = Svg(760, 380, "The four market structures",
            "From perfect competition (very many firms, identical products) through monopolistic competition (many firms, differentiated "
            "products) and oligopoly (a few large firms) to monopoly (one firm).")
    items = [("Perfect\ncompetition", "very many firms", "identical product", GREEN, F_GREEN),
             ("Monopolistic\ncompetition", "many firms", "differentiated", TEAL, "#ccfbf1"),
             ("Oligopoly", "a few large firms", "similar or different", ORANGE, F_AMBER),
             ("Monopoly", "one firm", "no close substitute", RED, F_RED)]
    x = 22
    for name, n, prod, col, fill in items:
        s.rect(x, 90, 168, 170, fill=fill, stroke=col, width=2.5, rx=12)
        lines = name.split("\n")
        for i, ln in enumerate(lines):
            s.text(x + 84, 128 + i * 24 - (12 if len(lines) == 1 else 0), ln, size=18, weight="bold", color=col)
        s.text(x + 84, 200, n, size=14)
        s.text(x + 84, 226, prod, size=14, color=MUTED)
        x += 184
    s.arrow(60, 310, 700, 310, color=INK, width=3)
    s.text(380, 338, "fewer firms, more control over price", size=16, weight="bold")
    title(s, "Market structures by number of sellers", y=46)
    return s


# ═══ Labour, population and sectors ════════════════════════════════════════

@fig
def labour_market():
    s = Svg(760, 430, "Wage determination and a minimum wage",
            "Left: the demand for and supply of labour cross at the equilibrium wage W and employment L. Right: a minimum wage set above W "
            "raises the number of people seeking work above the number firms want to employ, causing unemployment.")
    for k, name in enumerate(["Equilibrium wage", "A minimum wage above equilibrium"]):
        p = Plot(s, 75 + k * 385, 350, 280, 260, (0, 10.5), (0, 10.5))
        q1, w1 = _eq()
        if k == 0:
            p.axes("Number of workers", "Wage rate", xticks=[(q1, "L")], yticks=[(w1, "W")], zero=False)
        else:
            wm = 6.6
            ld, ls_ = (9 - wm) / 0.8, (wm - 1) / 0.8
            p.axes("Number of workers", "Wage rate", xticks=[(ld, "Ld"), (ls_, "Ls")], yticks=[(wm, "Wmin"), (w1, "W")], zero=False)
            s.line(p.x0, p.Y(wm), p.X(10), p.Y(wm), color=RED, width=3, dash="10 6")
            hbracket(s, p.X(ld), p.X(ls_), p.Y(wm) - 22, "unemployment", color=RED, size=14)
            p.guide(ld, wm, to_y=False)
            p.guide(ls_, wm, to_y=False)
        p.fn(lambda q: 9 - 0.8 * q, 0.6, 9.6, color=BLUE)
        p.fn(lambda q: 1 + 0.8 * q, 0.4, 9.6, color=GREEN)
        p.text(9.6, 9 - 0.8 * 9.6, "DL", dx=6, dy=10, size=15, weight="bold", color=BLUE, anchor="start")
        p.text(9.6, 1 + 0.8 * 9.6, "SL", dx=6, size=15, weight="bold", color=GREEN, anchor="start")
        p.guide(q1, w1)
        p.dot(q1, w1, r=6)
        s.text(p.x0 + 140, 30, name, size=17, weight="bold", color=RED if k else INK)
    return s


@fig
def population_pyramids():
    s = Svg(760, 460, "Population pyramids: young and ageing populations",
            "Left: a young population such as Sierra Leone's has a very wide base (many children) narrowing quickly to few old people. "
            "Right: an ageing population has narrow young age groups and many more people in middle and old age. Illustrative shapes.")
    young = [16, 14, 12, 10, 8.5, 7, 5.5, 4.5, 3.5, 2.5, 1.8, 1.2, 0.7]
    old = [5.5, 5.8, 6, 6.4, 6.8, 7, 7.2, 7.2, 7, 6.6, 6, 5, 3.6]
    groups = ["0–4", "5–9", "10–14", "15–19", "20–24", "25–29", "30–34", "35–39", "40–44", "45–49", "50–54", "55–59", "60+"]
    for k, (name, data) in enumerate([("Young population", young), ("Ageing population", old)]):
        cx = 205 + k * 370
        bar_h = 24
        y = 390
        for g, v in zip(groups, data):
            w = v * 8.5
            s.rect(cx - w, y - bar_h, w, bar_h - 3, fill=F_BLUE, stroke=BLUE, width=1.5)
            s.rect(cx, y - bar_h, w, bar_h - 3, fill=F_RED, stroke=RED, width=1.5)
            if k == 0:
                s.text(cx + 175, y - bar_h / 2, g, size=12, color=MUTED, anchor="end")
            y -= bar_h
        s.text(cx - 70, 412, "males", size=14, color=BLUE)
        s.text(cx + 70, 412, "females", size=14, color=RED)
        s.text(cx, 52, name, size=18, weight="bold")
    s.text(390, 440, "Each bar is an age group (years); bar length is its share of the population.", size=14, color=MUTED)
    return s


@fig
def optimum_population():
    s = Svg(660, 430, "The optimum population",
            "Output per head rises as population grows towards the optimum, where it is highest, and falls beyond it. "
            "To the left of the optimum the country is underpopulated; to the right it is overpopulated.")
    p = Plot(s, 90, 350, 470, 270, (0, 10), (0, 10))
    p.axes("Size of population", "Output (income) per head", xticks=[(5, "optimum")], zero=False)
    f = lambda x: 8 - 0.28 * (x - 5) ** 2  # noqa: E731
    p.shade([(0.6, 0), (0.6, f(0.6)), (5, f(5)), (5, 0)], F_GREEN, opacity=0.35)
    p.shade([(5, 0), (5, f(5)), (9.4, f(9.4)), (9.4, 0)], F_RED, opacity=0.35)
    p.fn(f, 0.6, 9.4, color=BLUE, width=4.5)
    p.guide(5, 8, to_y=False)
    p.dot(5, 8, r=7)
    p.text(5, 8, "highest output per head", dy=-18, size=15, weight="bold")
    p.text(2.8, 1.6, "underpopulation", size=15, weight="bold", color=GREEN)
    p.text(7.3, 1.6, "overpopulation", size=15, weight="bold", color=RED)
    title(s, "Optimum population: output per head is greatest", y=32)
    return s


@fig
def malthus():
    s = Svg(660, 430, "Malthus: population and food supply",
            "Malthus argued that population tends to grow geometrically (1, 2, 4, 8, 16) while food supply grows only arithmetically "
            "(1, 2, 3, 4, 5), so population eventually outruns food.")
    p = Plot(s, 90, 350, 470, 270, (0, 4.6), (0, 17))
    p.axes("Time (generations of 25 years)", "Index", xticks=range(0, 5), yticks=[1, 4, 8, 12, 16])
    pop = [(t, 2 ** t) for t in range(5)]
    food = [(t, t + 1) for t in range(5)]
    p.smooth(pop, color=RED, width=4)
    p.poly(food, color=GREEN, width=4)
    for x, y in pop:
        p.dot(x, y, color=RED, r=5)
        if x:
            p.text(x, y, str(y), dx=-12, dy=-8, size=14, weight="bold", color=RED, anchor="end")
    for x, y in food:
        p.dot(x, y, color=GREEN, r=5)
        if x:
            p.text(x, y, str(y), dx=12, dy=12, size=14, weight="bold", color=GREEN, anchor="start")
    p.text(2.2, 12, "population (geometric)", size=15, weight="bold", color=RED, anchor="end")
    p.text(3.6, 2.2, "food supply (arithmetic)", size=15, weight="bold", color=GREEN, anchor="middle")
    title(s, "Population outruns food: the Malthusian gap", y=32)
    return s


@fig
def farm_prices():
    s = Svg(680, 450, "Why farm prices swing",
            "Demand for a staple crop is inelastic (steep). A good harvest shifts supply right from S1 to S2 and the price falls sharply "
            "from P1 to P2; a poor harvest shifts supply left to S3 and the price jumps to P3.")
    p = Plot(s, 90, 370, 470, 290, (0, 11), (0, 11))
    d = lambda q: 18 - 2.6 * q  # noqa: E731
    p.fn(d, 3.2, 6.6, color=BLUE, width=4.5)
    res = []
    for sh, col, n in ((0, GREEN, "S1"), (1.4, TEAL, "S2"), (-1.4, ORANGE, "S3")):
        a, b = 0.5 + sh, 7.4 + sh
        p.fn(lambda q, sh=sh: 1 + 1.0 * (q - sh), max(0.2, a), b, color=col, dash=None if sh == 0 else "9 6")
        q = (17 + sh) / 3.6
        res.append((q, d(q)))
        p.text(b, 1 + (b - sh), n, dx=2, dy=-12, size=15, weight="bold", color=col)
    (q1, p1), (q2, p2), (q3, p3) = res
    p.axes("Quantity of rice", "Price", yticks=[(p2, "P2"), (p1, "P1"), (p3, "P3")], zero=False)
    s.text(s.w / 2, 56, "S2: after a good harvest   ·   S3: after a poor harvest", size=14, color=MUTED)
    for q, pr in res:
        p.guide(q, pr)
        p.dot(q, pr, r=5.5)
    p.text(6.6, d(6.6), "D (inelastic)", dx=6, dy=8, size=14, weight="bold", color=BLUE, anchor="start")
    title(s, "Small changes in harvest, big changes in price", y=32)
    return s


@fig
def location_factors():
    s = Svg(720, 470, "Factors that influence where industries locate",
            "A factory in the centre surrounded by the factors that influence its location: raw materials, the market, labour, power, "
            "transport, water, government policy and external economies.")
    cx, cy = 360, 255
    s.rect(cx - 90, cy - 40, 180, 80, fill=F_GREY, stroke=INK, width=2.5, rx=14)
    s.text(cx, cy - 8, "Where to build", size=18, weight="bold")
    s.text(cx, cy + 16, "the factory?", size=18, weight="bold")
    items = [("Raw materials", GREEN, F_GREEN), ("Market", BLUE, F_BLUE), ("Labour", PURPLE, F_PURPLE),
             ("Power supply", ORANGE, F_AMBER), ("Transport", TEAL, "#ccfbf1"), ("Water", BLUE, F_BLUE),
             ("Government policy", RED, F_RED), ("External economies", MUTED, F_GREY)]
    n = len(items)
    for i, (name, col, fill) in enumerate(items):
        a = math.radians(90 - i * 360 / n)
        x, y = cx + 250 * math.cos(a), cy - 175 * math.sin(a)
        ex, ey = cx + 110 * math.cos(a), cy - 55 * math.sin(a)
        s.line(ex, ey, x - 70 * math.cos(a), y + 22 * math.sin(a), color=col, width=2.5)
        s.rect(x - 85, y - 21, 170, 42, fill=fill, stroke=col, width=2.5, rx=21)
        s.text(x, y, name, size=15, weight="bold", color=col)
    return s


# ═══ Macroeconomics and money ═══════════════════════════════════════════════

@fig
def circular_flow():
    s = Svg(720, 440, "The circular flow of income",
            "Households supply factor services to firms and receive incomes (rent, wages, interest, profit). Firms supply goods and "
            "services to households, which pay for them with consumer spending. Money flows one way, real goods and services the other.")
    hx, fx, y1, y2 = 150, 570, 220, 220
    s.rect(hx - 105, 180, 210, 90, fill=F_BLUE, stroke=BLUE, width=3, rx=16)
    s.text(hx, 225, "Households", size=21, weight="bold", color=BLUE)
    s.rect(fx - 105, 180, 210, 90, fill=F_GREEN, stroke=GREEN, width=3, rx=16)
    s.text(fx, 225, "Firms", size=21, weight="bold", color=GREEN)
    s.path(f"M {hx} 176 C {hx} 70, {fx} 70, {fx - 10} 172", color=ORANGE, width=3.5, arrow="end")
    s.text(360, 76, "consumer spending (money)", size=16, weight="bold", color=ORANGE)
    s.path(f"M {fx} 120 C {fx - 60} 110, {hx + 60} 110, {hx + 4} 172", color=TEAL, width=2.5, dash="8 6", arrow="end")
    s.label(360, 132, "goods and services", size=15, color=TEAL)
    s.path(f"M {fx} 274 C {fx} 380, {hx} 380, {hx + 10} 278", color=PURPLE, width=3.5, arrow="end")
    s.text(360, 392, "incomes: rent, wages, interest, profit (money)", size=16, weight="bold", color=PURPLE)
    s.path(f"M {hx} 330 C {hx + 60} 340, {fx - 60} 340, {fx - 4} 278", color=TEAL, width=2.5, dash="8 6", arrow="end")
    s.label(360, 318, "factor services: land, labour, capital, enterprise", size=15, color=TEAL)
    title(s, "Two-sector circular flow: money one way, real flows the other", y=30, size=17)
    return s


@fig
def leakages_injections():
    s = Svg(750, 440, "Leakages and injections in the circular flow",
            "Saving, taxes and imports leak out of the circular flow of income; investment, government spending and exports are "
            "injected back into it. National income rises when injections exceed leakages and falls when leakages exceed injections.")
    s.rect(230, 170, 260, 100, fill="#fff7ed", stroke=ORANGE, width=3, rx=50)
    s.text(360, 210, "Circular flow", size=20, weight="bold", color=ORANGE)
    s.text(360, 238, "of income", size=20, weight="bold", color=ORANGE)
    pairs = [("Saving (S)", "Investment (I)", "banks and other", "financial institutions"),
             ("Taxes (T)", "Government spending (G)", "the government", ""),
             ("Imports (M)", "Exports (X)", "the rest", "of the world")]
    ys = [90, 220, 350]
    for (leak, inj, via1, via2), y in zip(pairs, ys):
        s.rect(20, y - 26, 170, 52, fill=F_RED, stroke=RED, width=2.5, rx=12)
        s.text(105, y, leak, size=16, weight="bold", color=RED)
        s.arrow(230, 220 if y == 220 else 220 + (y - 220) * 0.25, 194, y, color=RED, width=3)
        s.rect(530, y - 26, 205, 52, fill=F_GREEN, stroke=GREEN, width=2.5, rx=12)
        s.text(632, y, inj, size=15 if len(inj) > 16 else 16, weight="bold", color=GREEN)
        s.arrow(526, y, 490, 220 if y == 220 else 220 + (y - 220) * 0.25, color=GREEN, width=3)
    s.text(105, 410, "leakages (withdrawals)", size=15, weight="bold", color=RED)
    s.text(632, 410, "injections", size=15, weight="bold", color=GREEN)
    title(s, "Income grows when I + G + X is greater than S + T + M", y=34, size=17)
    return s


@fig
def credit_creation():
    s = Svg(720, 440, "How banks create credit",
            "With a cash reserve ratio of 20%, a new deposit of NLe 1,000 lets the first bank lend 800, the next 640, then 512 and so on. "
            "Total deposits rise to NLe 5,000: the original deposit times 1 divided by the reserve ratio.")
    deps = [1000 * 0.8 ** i for i in range(6)]
    p = Plot(s, 90, 360, 560, 270, (0, 7), (0, 1100))
    p.axes("Round of deposits", "NLe", yticks=range(0, 1001, 200))
    for i, d in enumerate(deps):
        x0, y0 = p.P(i + 0.25, d)
        x1, _ = p.P(i + 0.95, 0)
        r = d * 0.2
        _, yr = p.P(0, r)
        s.rect(x0, y0, x1 - x0, p.y0 - y0, fill=F_GREEN, stroke=GREEN, width=2)
        s.rect(x0, yr, x1 - x0, p.y0 - yr, fill=F_GREY, stroke=MUTED, width=1.5)
        s.text((x0 + x1) / 2, y0 - 12, f"{d:,.0f}", size=14, weight="bold", color=GREEN)
        s.text((x0 + x1) / 2, p.y0 + 20, f"Bank {i + 1}", size=13, color=MUTED)
    x0, _ = p.P(6.25, 0)
    s.text(x0 + 10, p.Y(500), "… total", size=16, weight="bold", anchor="start")
    s.text(x0 + 10, p.Y(390), "NLe 5,000", size=16, weight="bold", color=GREEN, anchor="start")
    s.rect(330, 58, 22, 16, fill=F_GREY, stroke=MUTED, width=1.5)
    s.text(360, 66, "kept as reserve (20%)", size=14, anchor="start", color=MUTED)
    s.rect(330, 82, 22, 16, fill=F_GREEN, stroke=GREEN, width=1.5)
    s.text(360, 90, "the rest is lent on (80%)", size=14, anchor="start", color=MUTED)
    title(s, "Credit multiplier = 1 ÷ reserve ratio = 1 ÷ 0.2 = 5", y=36)
    return s


@fig
def inflation_types():
    s = Svg(760, 430, "Demand-pull and cost-push inflation",
            "Left: aggregate demand rises from AD1 to AD2, pulling the general price level up from P1 to P2 (demand-pull). "
            "Right: higher costs shift aggregate supply left from AS1 to AS2, pushing the price level up and cutting output (cost-push).")
    for k, name in enumerate(["Demand-pull", "Cost-push"]):
        p = Plot(s, 75 + k * 385, 350, 280, 260, (0, 10.5), (0, 10.5))
        q1, p1 = _eq()
        q2, p2 = _eq(2.2, 0) if k == 0 else _eq(0, -2.2)
        p.axes("Real output", "Price level", xticks=[(min(q1, q2), "Y1" if k == 0 else "Y2"), (max(q1, q2), "Y2" if k == 0 else "Y1")],
               yticks=[(p1, "P1"), (p2, "P2")], zero=False)
        p.fn(lambda q: 9 - 0.8 * q, 0.6, 9.6, color=BLUE)
        p.fn(lambda q: 1 + 0.8 * q, 0.4, 9.6, color=GREEN)
        p.text(9.6, 9 - 0.8 * 9.6, "AD1", dx=6, dy=10, size=15, weight="bold", color=BLUE, anchor="start")
        p.text(9.6, 1 + 0.8 * 9.6, "AS1", dx=6, size=15, weight="bold", color=GREEN, anchor="start")
        if k == 0:
            p.fn(lambda q: 9 - 0.8 * (q - 2.2), 2.8, 10.4, color=BLUE, dash="9 6")
            p.text(10.4, 9 - 0.8 * (10.4 - 2.2), "AD2", dx=4, dy=12, size=15, weight="bold", color=BLUE, anchor="start")
        else:
            p.fn(lambda q: 1 + 0.8 * (q + 2.2), 0.2, 7.4, color=RED, dash="9 6")
            p.text(7.4, 1 + 0.8 * 9.6, "AS2", dx=6, dy=4, size=15, weight="bold", color=RED, anchor="start")
        for q, pr in ((q1, p1), (q2, p2)):
            p.guide(q, pr)
            p.dot(q, pr, r=6)
        s.arrow(p.x0 - 34, p.Y(p1) - 4, p.x0 - 34, p.Y(p2) + 4, color=RED, width=2.5)
        s.text(p.x0 + 140, 30, name, size=18, weight="bold", color=RED)
    return s


@fig
def tax_types():
    s = Svg(660, 430, "Progressive, proportional and regressive taxes",
            "As income rises, the percentage of income paid in tax rises under a progressive tax, stays the same under a proportional "
            "tax and falls under a regressive tax.")
    p = Plot(s, 90, 350, 470, 270, (0, 10), (0, 40))
    p.axes("Income", "Tax as % of income", yticks=[0, 10, 20, 30, 40], zero=False)
    p.fn(lambda x: 5 + 3.0 * x, 0.3, 10, color=RED, width=4)
    p.fn(lambda x: 15, 0.3, 10, color=BLUE, width=4)
    p.fn(lambda x: 26 - 1.7 * x, 0.3, 10, color=GREEN, width=4)
    p.text(9.2, 32.6, "progressive", dx=-10, size=16, weight="bold", color=RED, anchor="end")
    p.text(10, 15, "proportional", dy=-14, size=16, weight="bold", color=BLUE, anchor="end")
    p.text(10, 9, "regressive", dy=16, size=16, weight="bold", color=GREEN, anchor="end")
    title(s, "Which share of income goes in tax as income rises?", y=32)
    return s


# ═══ Trade and development ══════════════════════════════════════════════════

@fig
def gains_from_trade():
    s = Svg(720, 440, "Gains from specialisation and trade",
            "Before specialisation the two countries together produce 30 tonnes of rice and 30 of cloth. When each specialises in the good "
            "it produces at lower opportunity cost, total output rises to 40 of rice and 40 of cloth.")
    p = Plot(s, 90, 340, 540, 250, (0, 4.4), (0, 46))
    p.axes("", "Tonnes", yticks=range(0, 41, 10))
    groups = [("Rice", 30, 40), ("Cloth", 30, 40)]
    for i, (name, before, after) in enumerate(groups):
        for j, (v, col, fill, lab) in enumerate([(before, MUTED, F_GREY, "before"), (after, GREEN, F_GREEN, "after")]):
            x0, y0 = p.P(i * 2.2 + 0.4 + j * 0.8, v)
            x1, _ = p.P(i * 2.2 + 1.1 + j * 0.8, 0)
            s.rect(x0, y0, x1 - x0, p.y0 - y0, fill=fill, stroke=col, width=2.5)
            s.text((x0 + x1) / 2, y0 - 12, str(v), size=16, weight="bold", color=col)
            s.text((x0 + x1) / 2, p.y0 + 20, lab, size=14, color=MUTED)
        s.text(p.X(i * 2.2 + 1.15), p.y0 + 46, name, size=17, weight="bold")
    title(s, "World output of both goods rises when countries specialise", y=34)
    return s


@fig
def bop_structure():
    s = Svg(720, 460, "The structure of the balance of payments",
            "The balance of payments has a current account (trade in goods, trade in services, primary income and secondary income "
            "or transfers), a capital and financial account (investment and loans), and official reserves that settle the overall balance.")
    blocks = [("Current account", BLUE, F_BLUE, ["Goods (visible trade)", "Services (invisible trade)", "Primary income", "Secondary income (transfers)"]),
              ("Capital and financial account", GREEN, F_GREEN, ["Direct investment", "Portfolio investment", "Loans"]),
              ("Official reserves", PURPLE, F_PURPLE, ["Foreign currency and gold", "held by the central bank"])]
    x = 20
    for name, col, fill, items in blocks:
        s.rect(x, 80, 215, 300, fill=fill, stroke=col, width=2.5, rx=14)
        words = name.split(" and ")
        if len(words) > 1:
            s.text(x + 107, 112, words[0] + " and", size=17, weight="bold", color=col)
            s.text(x + 107, 134, words[1], size=17, weight="bold", color=col)
        else:
            s.text(x + 107, 118, name, size=17, weight="bold", color=col)
        for i, it in enumerate(items):
            s.text(x + 16, 180 + i * 46, "•  " + it, size=14, anchor="start")
        x += 235
    s.text(360, 420, "Current + capital and financial + reserves (+ errors) = 0: the accounts always balance", size=15, color=MUTED)
    title(s, "Three parts of the balance of payments", y=40)
    return s


@fig
def exchange_rate():
    s = Svg(680, 450, "Exchange rate of the leone against the US dollar",
            "The price of a dollar in leones is set where the demand for dollars meets the supply of dollars. When importers demand more "
            "dollars, demand shifts right from D1 to D2, a dollar costs more leones and the leone depreciates.")
    p = Plot(s, 100, 370, 460, 290, (0, 11), (0, 11))
    q1, r1 = _eq()
    q2, r2 = _eq(2.2, 0)
    p.axes("Quantity of US dollars", "Leones per dollar", xticks=[(q1, "Q1"), (q2, "Q2")], yticks=[(r1, "R1"), (r2, "R2")], zero=False)
    p.fn(lambda q: 9 - 0.8 * q, 0.6, 9.6, color=BLUE)
    p.fn(lambda q: 9 - 0.8 * (q - 2.2), 2.8, 10.6, color=BLUE, dash="9 6")
    p.fn(lambda q: 1 + 0.8 * q, 0.4, 9.6, color=GREEN)
    p.text(9.6, 9 - 0.8 * 9.6, "D1 for $", dx=6, dy=10, size=14, weight="bold", color=BLUE, anchor="start")
    p.text(10.6, 9 - 0.8 * (10.6 - 2.2), "D2", dx=4, dy=12, size=14, weight="bold", color=BLUE, anchor="start")
    p.text(9.6, 1 + 0.8 * 9.6, "S of $", dx=6, size=14, weight="bold", color=GREEN, anchor="start")
    for q, r in ((q1, r1), (q2, r2)):
        p.guide(q, r)
        p.dot(q, r, r=6)
    s.arrow(p.x0 - 40, p.Y(r1) - 4, p.x0 - 40, p.Y(r2) + 4, color=RED, width=2.5)
    s.text(p.x0 + 230, 26, "More leones per dollar: the leone depreciates", size=16, weight="bold", color=RED)
    return s


@fig
def vicious_circle():
    s = Svg(700, 500, "The vicious circle of poverty",
            "Low income leads to low saving, which leads to low investment, low capital, low productivity and so low income again. "
            "Breaking any link, for example with foreign investment or education, can turn it into a virtuous circle.")
    cx, cy, r = 350, 265, 175
    steps = [("Low income", RED, F_RED), ("Low saving", ORANGE, F_AMBER), ("Low investment", PURPLE, F_PURPLE),
             ("Little capital", BLUE, F_BLUE), ("Low productivity", TEAL, "#ccfbf1")]
    n = len(steps)
    for i in range(n):
        a1 = math.radians(90 - i * 360 / n - 18)
        a2 = math.radians(90 - (i + 1) * 360 / n + 18)
        x1, y1 = cx + r * math.cos(a1), cy - r * math.sin(a1)
        x2, y2 = cx + r * math.cos(a2), cy - r * math.sin(a2)
        s.path(f"M {x1:.1f} {y1:.1f} A {r} {r} 0 0 1 {x2:.1f} {y2:.1f}", color=MUTED, width=3, arrow="end")
    for i, (name, col, fill) in enumerate(steps):
        a = math.radians(90 - i * 360 / n)
        x, y = cx + r * math.cos(a), cy - r * math.sin(a)
        s.rect(x - 85, y - 24, 170, 48, fill=fill, stroke=col, width=2.5, rx=12)
        s.text(x, y, name, size=17, weight="bold", color=col)
    s.text(cx, cy - 10, "the vicious circle", size=18, color=MUTED, italic=True)
    s.text(cx, cy + 16, "of poverty", size=18, color=MUTED, italic=True)
    return s


@fig
def integration_stages():
    s = Svg(760, 470, "Stages of economic integration",
            "Each stage adds to the one before: a free trade area removes tariffs among members; a customs union adds a common external "
            "tariff; a common market adds free movement of labour and capital; an economic union adds common economic policies and "
            "often a single currency.")
    stages = [("Free trade area", "no tariffs between members", GREEN, F_GREEN),
              ("Customs union", "+ a common external tariff", TEAL, "#ccfbf1"),
              ("Common market", "+ free movement of labour and capital", BLUE, F_BLUE),
              ("Economic union", "+ common policies, often one currency", PURPLE, F_PURPLE)]
    y = 360
    for i, (name, adds, col, fill) in enumerate(stages):
        x = 40 + i * 50
        w = 680 - i * 100
        s.rect(x, y - 52, w, 64, fill=fill, stroke=col, width=2.5, rx=12)
        s.text(x + 20, y - 30, name, size=18, weight="bold", color=col, anchor="start")
        s.text(x + 20, y - 6, adds, size=15, anchor="start")
        y -= 74
    s.arrow(720, 380, 720, 90, color=INK, width=3)
    s.text(712, 418, "deeper integration ↑", size=15, weight="bold", anchor="end")
    title(s, "Each stage includes everything below it", y=40)
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
