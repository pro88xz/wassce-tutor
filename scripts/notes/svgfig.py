"""A small SVG toolkit for lesson diagrams.

One house style for every diagram in the notes: a light card background (so a
diagram stays readable in dark mode and on any page colour), dark ink, one
accent colour per idea, and text sized to stay legible when the diagram is
shown at phone width (about 340 px wide).

Coordinates are SVG pixels in a viewBox (origin top left, y down). Keep
figures about 640 units wide: 22-unit text then shows at roughly 12 px on a
phone.
"""

from __future__ import annotations

import math
from html import escape
from pathlib import Path

BG = "#f8fafc"
INK = "#0f172a"
MUTED = "#475569"
GRID = "#e2e8f0"
BLUE = "#2563eb"
RED = "#dc2626"
GREEN = "#15803d"
ORANGE = "#ea580c"
PURPLE = "#7c3aed"
TEAL = "#0f766e"
F_BLUE = "#dbeafe"
F_AMBER = "#fef3c7"
F_GREEN = "#dcfce7"
F_RED = "#fee2e2"
F_GREY = "#e2e8f0"
F_PURPLE = "#ede9fe"
WATER = "#bfdbfe"
GLASS = "#e0f2fe"
METAL = "#cbd5e1"

FONT = "Arial, Helvetica, sans-serif"
COLORS = {"ink": INK, "muted": MUTED, "blue": BLUE, "red": RED, "green": GREEN, "orange": ORANGE, "purple": PURPLE, "teal": TEAL}


def _c(color: str) -> str:
    return COLORS.get(color, color)


class Svg:
    def __init__(self, width: int, height: int, title: str, desc: str = ""):
        self.w, self.h = width, height
        self.title, self.desc = title, desc or title
        self.parts: list[str] = []
        self.markers: set[str] = set()

    # ── primitives ────────────────────────────────────────────────────────
    def _marker(self, color: str) -> str:
        mid = "a" + color.lstrip("#")
        self.markers.add(color)
        return mid

    def line(self, x1, y1, x2, y2, color=INK, width=3, dash=None, arrow=None, cap="round", opacity=None):
        """arrow: None, 'end', 'start' or 'both'."""
        color = _c(color)
        a = ""
        if arrow in ("end", "both"):
            a += f' marker-end="url(#{self._marker(color)})"'
        if arrow in ("start", "both"):
            a += f' marker-start="url(#{self._marker(color)}s)"'
        d = f' stroke-dasharray="{dash}"' if dash else ""
        o = f' opacity="{opacity}"' if opacity is not None else ""
        self.parts.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{color}" stroke-width="{width}" stroke-linecap="{cap}"{d}{a}{o}/>')

    def arrow(self, x1, y1, x2, y2, color=INK, width=3, dash=None):
        self.line(x1, y1, x2, y2, color=color, width=width, dash=dash, arrow="end")

    def mid_arrow(self, x1, y1, x2, y2, color=INK, width=3, at=0.55, size=13):
        """A line with an arrowhead part-way along it (for rays)."""
        self.line(x1, y1, x2, y2, color=color, width=width)
        mx, my = x1 + (x2 - x1) * at, y1 + (y2 - y1) * at
        self.head(mx, my, math.atan2(y2 - y1, x2 - x1), color=color, size=size)

    def head(self, x, y, angle, color=INK, size=13):
        color = _c(color)
        a1, a2 = angle + math.radians(152), angle - math.radians(152)
        pts = [(x + size * 0.45 * math.cos(angle), y + size * 0.45 * math.sin(angle)),
               (x + size * math.cos(a1), y + size * math.sin(a1)),
               (x + size * math.cos(a2), y + size * math.sin(a2))]
        self.parts.append(f'<polygon points="{" ".join(f"{px:.1f},{py:.1f}" for px, py in pts)}" fill="{color}"/>')

    def path(self, d, color=INK, width=3, fill="none", dash=None, arrow=None, opacity=None, join="round"):
        color = _c(color)
        a = f' marker-end="url(#{self._marker(color)})"' if arrow == "end" else ""
        ds = f' stroke-dasharray="{dash}"' if dash else ""
        o = f' opacity="{opacity}"' if opacity is not None else ""
        self.parts.append(f'<path d="{d}" stroke="{color}" stroke-width="{width}" fill="{_c(fill)}" stroke-linejoin="{join}" stroke-linecap="round"{ds}{a}{o}/>')

    def polyline(self, pts, color=INK, width=3, dash=None, arrow=None, fill="none"):
        d = "M " + " L ".join(f"{x:.1f} {y:.1f}" for x, y in pts)
        self.path(d, color=color, width=width, dash=dash, arrow=arrow, fill=fill)

    def polygon(self, pts, fill=F_GREY, stroke=INK, width=3, opacity=None):
        o = f' opacity="{opacity}"' if opacity is not None else ""
        self.parts.append(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in pts)}" fill="{_c(fill)}" stroke="{_c(stroke)}" stroke-width="{width}" stroke-linejoin="round"{o}/>')

    def rect(self, x, y, w, h, fill=F_GREY, stroke=INK, width=3, rx=0, dash=None, opacity=None):
        ds = f' stroke-dasharray="{dash}"' if dash else ""
        o = f' opacity="{opacity}"' if opacity is not None else ""
        self.parts.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" fill="{_c(fill)}" stroke="{_c(stroke)}" stroke-width="{width}"{ds}{o}/>')

    def circle(self, cx, cy, r, fill="none", stroke=INK, width=3, dash=None):
        ds = f' stroke-dasharray="{dash}"' if dash else ""
        self.parts.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="{_c(fill)}" stroke="{_c(stroke)}" stroke-width="{width}"{ds}/>')

    def dot(self, x, y, r=5, color=INK):
        self.circle(x, y, r, fill=color, stroke=color, width=1)

    def ellipse(self, cx, cy, rx, ry, fill="none", stroke=INK, width=3, dash=None):
        ds = f' stroke-dasharray="{dash}"' if dash else ""
        self.parts.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{_c(fill)}" stroke="{_c(stroke)}" stroke-width="{width}"{ds}/>')

    def arc(self, cx, cy, r, a1, a2, color=INK, width=2.5, arrow=None):
        """Arc from angle a1 to a2 in degrees (0 = +x, counter-clockwise as seen, y up)."""
        x1, y1 = cx + r * math.cos(math.radians(a1)), cy - r * math.sin(math.radians(a1))
        x2, y2 = cx + r * math.cos(math.radians(a2)), cy - r * math.sin(math.radians(a2))
        large = 1 if abs(a2 - a1) > 180 else 0
        sweep = 0 if a2 > a1 else 1
        self.path(f"M {x1:.1f} {y1:.1f} A {r} {r} 0 {large} {sweep} {x2:.1f} {y2:.1f}", color=color, width=width, arrow=arrow)

    def text(self, x, y, s, size=22, color=INK, anchor="middle", weight="normal", italic=False, baseline="middle"):
        st = ' font-style="italic"' if italic else ""
        self.parts.append(
            f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{_c(color)}" text-anchor="{anchor}" '
            f'dominant-baseline="{baseline}" font-weight="{weight}"{st}>{escape(s)}</text>'
        )

    def label(self, x, y, s, size=20, color=INK, anchor="middle", weight="normal", italic=False, pad=5):
        """Text on a small background patch, for labels that sit over lines."""
        w = len(s) * size * 0.56 + pad * 2
        h = size + pad * 2
        x0 = x - w / 2 if anchor == "middle" else (x if anchor == "start" else x - w)
        self.rect(x0, y - h / 2, w, h, fill=BG, stroke="none", width=0, rx=4, opacity=0.92)
        self.text(x, y, s, size=size, color=color, anchor=anchor, weight=weight, italic=italic)

    def raw(self, s: str):
        self.parts.append(s)

    # ── compound pieces ───────────────────────────────────────────────────
    def axes(self, x0, y0, x1, y1, xlabel="", ylabel="", color=INK, size=20):
        """Axes with origin (x0, y0), x-axis to x1, y-axis up to y1."""
        self.arrow(x0, y0, x1, y0, color=color, width=2.5)
        self.arrow(x0, y0, x0, y1, color=color, width=2.5)
        if xlabel:
            self.text(x1, y0 + 26, xlabel, size=size, anchor="end", color=MUTED)
        if ylabel:
            self.text(x0 + 10, y1 - 4, ylabel, size=size, anchor="start", color=MUTED, baseline="auto")
        self.text(x0 - 12, y0 + 16, "0", size=18, color=MUTED)

    def hatch_ground(self, x0, x1, y, step=18, depth=14, color=MUTED):
        self.line(x0, y, x1, y, color=INK, width=3)
        x = x0 + 6
        while x < x1:
            self.line(x, y, x - depth * 0.7, y + depth, color=color, width=1.6)
            x += step

    def resistor(self, x1, y, x2, label="", color=INK, h=26):
        """Horizontal resistor (box symbol) between x1 and x2 at height y."""
        mid = (x1 + x2) / 2
        w = min(80, (x2 - x1) * 0.6)
        self.line(x1, y, mid - w / 2, y, color=color)
        self.line(mid + w / 2, y, x2, y, color=color)
        self.rect(mid - w / 2, y - h / 2, w, h, fill="#ffffff", stroke=color, width=3)
        if label:
            self.text(mid, y - h / 2 - 16, label, size=20)

    def resistor_v(self, x, y1, y2, label="", color=INK, w=26, side=1):
        mid = (y1 + y2) / 2
        h = min(80, (y2 - y1) * 0.6)
        self.line(x, y1, x, mid - h / 2, color=color)
        self.line(x, mid + h / 2, x, y2, color=color)
        self.rect(x - w / 2, mid - h / 2, w, h, fill="#ffffff", stroke=color, width=3)
        if label:
            self.text(x + side * (w / 2 + 12), mid, label, size=20, anchor="start" if side > 0 else "end")

    def cell(self, x, y, label="", vertical=False):
        """A single cell on a horizontal wire at (x, y): long plate (+) then short plate (-)."""
        if vertical:
            self.line(x - 22, y - 6, x + 22, y - 6, width=3)
            self.line(x - 12, y + 6, x + 12, y + 6, width=5)
            if label:
                self.text(x + 34, y, label, size=20, anchor="start")
            return
        self.line(x - 6, y - 24, x - 6, y + 24, width=3)
        self.line(x + 6, y - 13, x + 6, y + 13, width=5)
        if label:
            self.text(x, y - 40, label, size=20)

    def meter(self, x, y, letter, r=20):
        self.circle(x, y, r, fill="#ffffff", stroke=INK, width=3)
        self.text(x, y + 1, letter, size=20, weight="bold")

    def lamp(self, x, y, r=17):
        self.circle(x, y, r, fill="#ffffff", stroke=INK, width=3)
        d = r * 0.7
        self.line(x - d, y - d, x + d, y + d, width=2.5)
        self.line(x - d, y + d, x + d, y - d, width=2.5)

    def switch(self, x1, y, x2, closed=False):
        self.dot(x1, y, 4)
        self.dot(x2, y, 4)
        if closed:
            self.line(x1, y, x2, y)
        else:
            self.line(x1, y, x2 - 4, y - 20)

    # ── output ────────────────────────────────────────────────────────────
    def svg(self) -> str:
        defs = []
        for color in sorted(self.markers):
            mid = "a" + color.lstrip("#")
            defs.append(f'<marker id="{mid}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="{color}"/></marker>')
            defs.append(f'<marker id="{mid}s" viewBox="0 0 10 10" refX="1.5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M10 0 L0 5 L10 10 z" fill="{color}"/></marker>')
        return "\n".join([
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" role="img" aria-labelledby="t d" font-family="{FONT}">',
            f'<title id="t">{escape(self.title)}</title>',
            f'<desc id="d">{escape(self.desc)}</desc>',
            f'<defs>{"".join(defs)}</defs>',
            f'<rect width="{self.w}" height="{self.h}" rx="20" fill="{BG}"/>',
            *self.parts,
            "</svg>",
            "",
        ])

    def save(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(self.svg(), encoding="utf-8")
