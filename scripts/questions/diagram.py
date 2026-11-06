"""Small SVG drawing kit for question diagrams.

Diagrams are drawn to scale from real coordinates. Questions use the same
coordinates in their `solve` functions (see `angle_at`), so a figure that
disagrees with its question makes the build fail.
"""

from __future__ import annotations

import math

INK = "#111827"
MUTED = "#6b7280"
ASK = "#1d4ed8"  # the unknown the question asks for


def angle_at(v, a, b) -> float:
    """Angle AVB in degrees (0-180), measured from coordinates."""
    ax, ay = a[0] - v[0], a[1] - v[1]
    bx, by = b[0] - v[0], b[1] - v[1]
    cos = (ax * bx + ay * by) / (math.hypot(ax, ay) * math.hypot(bx, by))
    return math.degrees(math.acos(max(-1.0, min(1.0, cos))))


def on_circle(c, r, deg):
    return (c[0] + r * math.cos(math.radians(deg)), c[1] + r * math.sin(math.radians(deg)))


def dist(a, b) -> float:
    return math.hypot(a[0] - b[0], a[1] - b[1])


def bearing(frm, to) -> float:
    """Three-figure bearing of `to` from `frm` (north = +y, clockwise)."""
    return math.degrees(math.atan2(to[0] - frm[0], to[1] - frm[1])) % 360


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


class Fig:
    def __init__(self, xmin, xmax, ymin, ymax, width=340, pad=30):
        self.xmin, self.ymax = xmin, ymax
        self.s = (width - 2 * pad) / (xmax - xmin)
        self.pad = pad
        self.w = width
        self.h = round((ymax - ymin) * self.s + 2 * pad)
        self.items: list[str] = []

    def P(self, p):
        return (self.pad + (p[0] - self.xmin) * self.s, self.pad + (self.ymax - p[1]) * self.s)

    def line(self, a, b, dash=False, color=INK, width=2):
        (x1, y1), (x2, y2) = self.P(a), self.P(b)
        d = ' stroke-dasharray="6 5"' if dash else ""
        self.items.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{color}" stroke-width="{width}" stroke-linecap="round"{d}/>')

    def ray(self, a, through, extend=1.0, **kw):
        b = (through[0] + (through[0] - a[0]) * extend, through[1] + (through[1] - a[1]) * extend)
        self.line(a, b, **kw)

    def poly(self, pts, close=True):
        for i in range(len(pts) - (0 if close else 1)):
            self.line(pts[i], pts[(i + 1) % len(pts)])

    def circle(self, c, r, color=INK):
        x, y = self.P(c)
        self.items.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r * self.s:.1f}" fill="none" stroke="{color}" stroke-width="2"/>')

    def dot(self, p, r=3.2):
        x, y = self.P(p)
        self.items.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{INK}"/>')

    def text(self, s, p, dx=0.0, dy=0.0, italic=False, color=INK, size=16, anchor="middle", weight="normal"):
        x, y = self.P(p)
        style = ' font-style="italic"' if italic else ""
        fam = "Georgia, 'Times New Roman', serif" if italic else "system-ui, -apple-system, 'Segoe UI', sans-serif"
        self.items.append(
            f'<text x="{x + dx:.1f}" y="{y + dy:.1f}" font-family="{fam}" font-size="{size}"{style} font-weight="{weight}" '
            f'fill="{color}" text-anchor="{anchor}" dominant-baseline="central">{esc(s)}</text>'
        )

    def label(self, name, p, away_from=None, direction=None, gap=15):
        """Point label placed `gap` px away from `away_from` (or in `direction`, degrees)."""
        if direction is None:
            ax, ay = self.P(away_from)
            x, y = self.P(p)
            ang = math.atan2(y - ay, x - ax)
        else:
            ang = -math.radians(direction)
        self.text(name, p, dx=gap * math.cos(ang), dy=gap * math.sin(ang), italic=True, size=17)

    def mid_label(self, s, a, b, side=1, gap=13, color=INK, size=14):
        """Label beside the middle of segment AB (side = +1 left of A->B, -1 right)."""
        (x1, y1), (x2, y2) = self.P(a), self.P(b)
        nx, ny = (y2 - y1), -(x2 - x1)  # screen normal (left of A->B when y is down)
        n = math.hypot(nx, ny) or 1
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        ox, oy = side * gap * nx / n, side * gap * ny / n
        # Beside a steep line, anchor the text at its near end so it can't run across the line.
        anchor = "middle" if abs(ox) < 0.6 * gap else ("start" if ox > 0 else "end")
        self.items.append(
            f'<text x="{mx + ox:.1f}" y="{my + oy:.1f}" font-family="system-ui, sans-serif" '
            f'font-size="{size}" fill="{color}" text-anchor="{anchor}" dominant-baseline="central">{esc(s)}</text>'
        )

    def angle(self, v, a, b, label=None, r=24, color=INK, label_gap=15, size=14):
        """Arc marking angle AVB (< 180) with an optional label on its bisector."""
        vx, vy = self.P(v)
        (ax, ay), (bx, by) = self.P(a), self.P(b)
        a1 = math.atan2(ay - vy, ax - vx)
        a2 = math.atan2(by - vy, bx - vx)
        delta = (a2 - a1 + math.pi) % (2 * math.pi) - math.pi
        sx, sy = vx + r * math.cos(a1), vy + r * math.sin(a1)
        ex, ey = vx + r * math.cos(a1 + delta), vy + r * math.sin(a1 + delta)
        sweep = 1 if delta > 0 else 0
        self.items.append(f'<path d="M{sx:.1f},{sy:.1f} A{r},{r} 0 0 {sweep} {ex:.1f},{ey:.1f}" fill="none" stroke="{color}" stroke-width="1.6"/>')
        if label:
            mid = a1 + delta / 2
            rr = r + label_gap
            weight = "bold" if color == ASK else "normal"
            italic = label.strip().isalpha() and len(label.strip()) <= 2
            family = "Georgia, serif" if italic else "system-ui, sans-serif"
            style = ' font-style="italic"' if italic else ""
            self.items.append(
                f'<text x="{vx + rr * math.cos(mid):.1f}" y="{vy + rr * math.sin(mid):.1f}" '
                f'font-family="{family}" font-size="{size + (2 if italic else 0)}"{style} font-weight="{weight}" '
                f'fill="{color}" text-anchor="middle" dominant-baseline="central">{esc(label)}</text>'
            )

    def right_angle(self, v, a, b, size=11):
        vx, vy = self.P(v)
        (ax, ay), (bx, by) = self.P(a), self.P(b)
        ua = ((ax - vx) / math.hypot(ax - vx, ay - vy), (ay - vy) / math.hypot(ax - vx, ay - vy))
        ub = ((bx - vx) / math.hypot(bx - vx, by - vy), (by - vy) / math.hypot(bx - vx, by - vy))
        p1 = (vx + size * ua[0], vy + size * ua[1])
        p2 = (p1[0] + size * ub[0], p1[1] + size * ub[1])
        p3 = (vx + size * ub[0], vy + size * ub[1])
        self.items.append(f'<path d="M{p1[0]:.1f},{p1[1]:.1f} L{p2[0]:.1f},{p2[1]:.1f} L{p3[0]:.1f},{p3[1]:.1f}" fill="none" stroke="{INK}" stroke-width="1.5"/>')

    def tick(self, a, b, n=1):
        """Equal-length marks across the middle of AB."""
        (x1, y1), (x2, y2) = self.P(a), self.P(b)
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        ux, uy = (x2 - x1), (y2 - y1)
        L = math.hypot(ux, uy)
        ux, uy = ux / L, uy / L
        for k in range(n):
            off = (k - (n - 1) / 2) * 5
            cx, cy = mx + off * ux, my + off * uy
            self.items.append(f'<line x1="{cx - 6 * uy:.1f}" y1="{cy + 6 * ux:.1f}" x2="{cx + 6 * uy:.1f}" y2="{cy - 6 * ux:.1f}" stroke="{INK}" stroke-width="1.6"/>')

    def arrowhead(self, a, b, size=9):
        """Arrowhead at B pointing along A->B (for parallel marks and north lines)."""
        (x1, y1), (x2, y2) = self.P(a), self.P(b)
        ang = math.atan2(y2 - y1, x2 - x1)
        p1 = (x2 - size * math.cos(ang - 0.45), y2 - size * math.sin(ang - 0.45))
        p2 = (x2 - size * math.cos(ang + 0.45), y2 - size * math.sin(ang + 0.45))
        self.items.append(f'<path d="M{p1[0]:.1f},{p1[1]:.1f} L{x2:.1f},{y2:.1f} L{p2[0]:.1f},{p2[1]:.1f}" fill="none" stroke="{INK}" stroke-width="1.6"/>')

    def parallel_mark(self, a, b, n=1):
        """Small arrowheads in the middle of AB to show parallel lines."""
        mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
        L = dist(a, b)
        ux, uy = (b[0] - a[0]) / L, (b[1] - a[1]) / L
        for k in range(n):
            tip = (mx + ux * (k * 0.25 + 0.1), my + uy * (k * 0.25 + 0.1))
            self.arrowhead((tip[0] - ux, tip[1] - uy), tip)

    def north(self, p, length=1.0, label=True):
        top = (p[0], p[1] + length)
        self.line(p, top, width=1.6)
        self.arrowhead(p, top)
        if label:
            self.text("N", top, dy=-11, size=13, weight="bold")

    def svg(self, title: str) -> str:
        body = "\n  ".join(self.items)
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" width="{self.w}" height="{self.h}" role="img">\n'
            f"  <title>{esc(title)}</title>\n"
            f'  <rect width="100%" height="100%" fill="#ffffff"/>\n  {body}\n</svg>\n'
        )


# ── Charts and filled shapes ──────────────────────────────────────────────
FILLS = ["#dbeafe", "#dcfce7", "#fef3c7", "#fce7f3", "#ede9fe", "#e0f2fe"]
GRID = "#e5e7eb"


def _arc_path(f: Fig, c, r, a1, a2) -> str:
    """SVG arc from angle a1 to a2 (degrees, anticlockwise in the figure)."""
    (x1, y1), (x2, y2) = f.P(on_circle(c, r, a1)), f.P(on_circle(c, r, a2))
    large = 1 if (a2 - a1) % 360 > 180 else 0
    return f"A{r * f.s:.1f},{r * f.s:.1f} 0 {large} 0 {x2:.1f},{y2:.1f}", (x1, y1)


def sector(f: Fig, c, r, a1, a2, fill="none", stroke=INK):
    arc, (x1, y1) = _arc_path(f, c, r, a1, a2)
    cx, cy = f.P(c)
    f.items.append(f'<path d="M{cx:.1f},{cy:.1f} L{x1:.1f},{y1:.1f} {arc} Z" fill="{fill}" stroke="{stroke}" stroke-width="2" stroke-linejoin="round"/>')


def arc(f: Fig, c, r, a1, a2, color=INK, width=2):
    path, (x1, y1) = _arc_path(f, c, r, a1, a2)
    f.items.append(f'<path d="M{x1:.1f},{y1:.1f} {path}" fill="none" stroke="{color}" stroke-width="{width}"/>')


def pie(f: Fig, c, r, parts: list[tuple[str, float]], start=90.0):
    """Pie chart drawn clockwise from `start`; each part is (label, angle in degrees)."""
    a = start
    for i, (_, ang) in enumerate(parts):
        sector(f, c, r, a - ang, a, fill=FILLS[i % len(FILLS)])
        a -= ang
    a = start
    for name, ang in parts:
        mid = a - ang / 2
        f.text(name, on_circle(c, r * 0.62, mid), dy=-8, size=13, weight="bold")
        f.text(f"{ang:g}°", on_circle(c, r * 0.62, mid), dy=9, size=13)
        a -= ang


def rect(f: Fig, x0, y0, x1, y1, fill="none", stroke=INK, width=2):
    (ax, ay), (bx, by) = f.P((x0, y1)), f.P((x1, y0))
    f.items.append(f'<rect x="{ax:.1f}" y="{ay:.1f}" width="{bx - ax:.1f}" height="{by - ay:.1f}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>')


def axes(f: Fig, x0, x1, y0, y1, xticks, yticks, xlabel="", ylabel="", grid=True, xfmt="{:g}", yfmt="{:g}"):
    """Axes with tick labels and light grid lines, as on squared graph paper."""
    if grid:
        for t in yticks:
            f.line((x0, t), (x1, t), color=GRID, width=1)
        for t in xticks:
            f.line((t, y0), (t, y1), color=GRID, width=1)
    f.line((x0, y0), (x1, y0), width=1.6)
    f.line((x0, y0), (x0, y1), width=1.6)
    for t in xticks:
        f.text(xfmt.format(t) if not isinstance(t, str) else t, (t, y0), dy=12, size=11, color=MUTED)
    for t in yticks:
        f.text(yfmt.format(t), (x0, t), dx=-6, size=11, color=MUTED, anchor="end")
    if xlabel:
        f.text(xlabel, ((x0 + x1) / 2, y0), dy=30, size=12)
    if ylabel:
        x, y = f.P((x0, (y0 + y1) / 2))
        f.items.append(
            f'<text x="{x - 34:.1f}" y="{y:.1f}" font-family="system-ui, sans-serif" font-size="12" fill="{INK}" '
            f'text-anchor="middle" transform="rotate(-90 {x - 34:.1f} {y:.1f})">{esc(ylabel)}</text>'
        )


def polyline(f: Fig, pts, color=INK, width=2, dots=True):
    d = " ".join(f"{x:.1f},{y:.1f}" for x, y in (f.P(p) for p in pts))
    f.items.append(f'<polyline points="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round"/>')
    if dots:
        for p in pts:
            f.dot(p, r=2.6)
