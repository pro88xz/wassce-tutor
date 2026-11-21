"""Diagrams for the Biology question sets: a food web, a pyramid of numbers and a growth curve.

Each diagram is drawn from the same data the questions use, and the food-web questions
count their answers from that data, so a figure that disagrees with its question fails
the build.
"""

from __future__ import annotations

import math

from diagram import INK, MUTED, Fig, axes, esc, polyline, rect

# ── Food web ───────────────────────────────────────────────────────────────
# Positions on a 0-10 grid; arrows point from the food to the feeder (the direction energy flows).
WEB_NODES = {
    "Grass": (1.0, 0.0),
    "Maize": (6.0, 0.0),
    "Grasshopper": (2.5, 2.0),
    "Rat": (8.5, 2.5),
    "Toad": (4.2, 4.0),
    "Lizard": (1.6, 6.0),
    "Snake": (6.3, 6.0),
    "Hawk": (8.5, 8.0),
}
WEB_EATS = [  # (food, feeder)
    ("Grass", "Grasshopper"),
    ("Maize", "Grasshopper"),
    ("Maize", "Rat"),
    ("Grasshopper", "Lizard"),
    ("Grasshopper", "Toad"),
    ("Toad", "Snake"),
    ("Rat", "Snake"),
    ("Rat", "Hawk"),
    ("Lizard", "Hawk"),
    ("Snake", "Hawk"),
]


def web_chains() -> list[list[str]]:
    """Every food chain in the web, from a producer to a top consumer."""
    feeders = {n: [b for a, b in WEB_EATS if a == n] for n in WEB_NODES}
    eaten = {b for _, b in WEB_EATS}
    producers = [n for n in WEB_NODES if n not in eaten]
    chains: list[list[str]] = []

    def walk(path: list[str]) -> None:
        nxt = feeders[path[-1]]
        if not nxt:
            chains.append(path)
        for n in nxt:
            walk(path + [n])

    for p in producers:
        walk([p])
    return chains


def _box(f: Fig, name: str):
    """Centre (px) and half-size (px) of a node's label box."""
    x, y = f.P(WEB_NODES[name])
    return x, y, 6.4 * len(name) + 9, 14


def _edge(cx, cy, hw, hh, dx, dy):
    """Where a ray from the box centre in direction (dx, dy) leaves the box."""
    t = min(hw / abs(dx) if dx else math.inf, hh / abs(dy) if dy else math.inf)
    return cx + dx * t, cy + dy * t


def food_web() -> str:
    f = Fig(-0.6, 10.2, -0.7, 8.7, width=420, pad=28)
    for food, feeder in WEB_EATS:
        ax, ay, ahw, ahh = _box(f, food)
        bx, by, bhw, bhh = _box(f, feeder)
        dx, dy = bx - ax, by - ay
        L = math.hypot(dx, dy)
        dx, dy = dx / L, dy / L
        x1, y1 = _edge(ax, ay, ahw + 3, ahh + 3, dx, dy)
        x2, y2 = _edge(bx, by, bhw + 3, bhh + 3, -dx, -dy)
        f.items.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{INK}" stroke-width="1.8"/>')
        ang = math.atan2(y2 - y1, x2 - x1)
        p1 = (x2 - 10 * math.cos(ang - 0.4), y2 - 10 * math.sin(ang - 0.4))
        p2 = (x2 - 10 * math.cos(ang + 0.4), y2 - 10 * math.sin(ang + 0.4))
        f.items.append(f'<path d="M{p1[0]:.1f},{p1[1]:.1f} L{x2:.1f},{y2:.1f} L{p2[0]:.1f},{p2[1]:.1f} Z" fill="{INK}"/>')
    for name in WEB_NODES:
        x, y, hw, hh = _box(f, name)
        fill = "#dcfce7" if name in ("Grass", "Maize") else "#ffffff"
        f.items.append(f'<rect x="{x - hw:.1f}" y="{y - hh:.1f}" width="{2 * hw:.1f}" height="{2 * hh:.1f}" rx="7" fill="{fill}" stroke="{INK}" stroke-width="1.4"/>')
        f.items.append(
            f'<text x="{x:.1f}" y="{y:.1f}" font-family="system-ui, -apple-system, \'Segoe UI\', sans-serif" font-size="14" '
            f'fill="{INK}" text-anchor="middle" dominant-baseline="central">{esc(name)}</text>'
        )
    return f.svg("A food web: grass and maize are eaten by the grasshopper; maize by the rat; the grasshopper by the lizard and the toad; "
                 "the toad and the rat by the snake; the rat, the lizard and the snake by the hawk")


# ── Pyramid of numbers ─────────────────────────────────────────────────────
PYRAMID = [  # (trophic level, relative bar width), bottom first: one tree, many caterpillars, fewer birds
    ("Producer", 1.2),
    ("Primary consumer", 8.0),
    ("Secondary consumer", 3.0),
]


def pyramid_of_numbers() -> str:
    f = Fig(-0.5, 17.0, -0.4, 4.1, width=420, pad=16)
    cx = 6.0
    for i, (level, w) in enumerate(PYRAMID):
        y0 = i * 1.2
        rect(f, cx - w / 2, y0, cx + w / 2, y0 + 1.0, fill=["#dcfce7", "#fef3c7", "#dbeafe"][i], stroke=INK, width=1.6)
        f.text(level, (cx + 4.3, y0 + 0.5), size=13, anchor="start", color=MUTED)
    f.text("Pyramid of numbers", (cx, 3.75), size=14, weight="bold")
    return f.svg("A pyramid of numbers with three bars: a very narrow bar for the producer at the bottom, "
                 "a very wide bar for the primary consumers above it, and a narrower bar for the secondary consumers at the top")


# ── Population growth curve ────────────────────────────────────────────────
def _logistic(t: float) -> float:
    """Population size on a 0-100 scale."""
    return 4 + 92 / (1 + math.exp(-1.25 * (t - 5)))


Y = 0.065  # plot units per individual, so the curve is 6.5 units tall on a 10-unit time axis


GROWTH_POINTS = {"A": 1.2, "B": 5.0, "C": 7.0, "D": 9.4}  # label -> time


def growth_curve() -> str:
    f = Fig(-1.4, 10.6, -1.3, 7.4, width=380, pad=30)
    axes(f, 0, 10.2, 0, 7.0, xticks=[], yticks=[], xlabel="Time", ylabel="Number of individuals", grid=False)
    pts = [(t / 10, Y * _logistic(t / 10)) for t in range(0, 101)]
    polyline(f, pts, width=2.4, dots=False)
    for label, t in GROWTH_POINTS.items():
        p = (t, Y * _logistic(t))
        f.dot(p, r=4)
        f.text(label, p, dx=-12, dy=-14, size=16, weight="bold", italic=False)
    return f.svg("An S-shaped population growth curve with four points marked: A where the curve is low and nearly flat at the start, "
                 "B in the middle where it is steepest, C where it begins to level off, and D at the top where it is flat")
