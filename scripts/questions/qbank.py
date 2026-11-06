"""Question-bank toolkit: define WASSCE-style objective questions with built-in
answer checks.

Every question carries
  - `solve`: code that works the answer out independently of the option text.
    The build fails unless exactly one option matches what `solve` returns.
  - for each wrong option, the mistake that produces it ("why"), and where
    practical a `derive` function that reproduces that mistake. The build
    fails if a distractor is not what its stated mistake gives, or if two
    options are mathematically equal.

Values can be exact sympy numbers or expressions, frozensets (solution sets,
sets of elements), plain strings, or Rounded(x, dp=..)/Rounded(x, sf=..) for
answers asked "correct to n decimal places / significant figures".
"""

from __future__ import annotations

import math
import re
from dataclasses import dataclass, field
from typing import Any, Callable

import sympy as sp

R = sp.Rational
S = sp.sympify


@dataclass(frozen=True)
class Rounded:
    """A number shown rounded, e.g. 2.69 for 'correct to 2 d.p.'."""

    value: float
    dp: int | None = None
    sf: int | None = None

    def matches(self, x: Any) -> bool:
        x = float(x)
        if self.dp is not None:
            return round(x, self.dp) == round(self.value, self.dp)
        digits = self.sf - int(math.floor(math.log10(abs(x)))) - 1
        return round(x, digits) == round(self.value, digits)


@dataclass
class Wrong:
    tex: str
    value: Any
    why: str
    derive: Callable[[], Any] | None = None


@dataclass
class Q:
    id: str
    topic: str
    ref: str  # syllabus reference, e.g. "A(d) Indices: laws of indices"
    stem: str
    answer: tuple[str, Any]
    wrong: list[Wrong]
    solve: Callable[[], Any]
    working: str
    evidence: str = ""  # why this is on the Sierra Leone paper (reports, handbooks)
    tags: list[str] = field(default_factory=list)
    diagram: Callable[[], str] | None = None  # returns an SVG drawn from the same coordinates as `solve`
    order: list[str] | None = None  # fixed option order (texts), e.g. days of the week


def same(a: Any, b: Any) -> bool:
    """Mathematical equality across the value kinds we use."""
    if isinstance(a, Rounded) and isinstance(b, Rounded):
        return a.matches(b.value)
    if isinstance(a, Rounded):
        return a.matches(b)
    if isinstance(b, Rounded):
        return b.matches(a)
    if isinstance(a, sp.Set) or isinstance(b, sp.Set):  # solution sets of inequalities
        return isinstance(a, sp.Set) and isinstance(b, sp.Set) and a == b
    if isinstance(a, (set, frozenset)) or isinstance(b, (set, frozenset)):
        if not (isinstance(a, (set, frozenset)) and isinstance(b, (set, frozenset))):
            return False
        if len(a) != len(b):
            return False
        return all(any(same(x, y) for y in b) for x in a)
    if isinstance(a, str) or isinstance(b, str):
        return a == b
    if isinstance(a, tuple) and isinstance(b, tuple):
        return len(a) == len(b) and all(same(x, y) for x, y in zip(a, b))
    try:
        diff = sp.simplify(S(a) - S(b))
        return diff == 0
    except (sp.SympifyError, TypeError):
        return a == b


def is_number(v: Any) -> bool:
    if isinstance(v, Rounded):
        return True
    if isinstance(v, (str, tuple, set, frozenset)):
        return False
    try:
        e = S(v)
        return bool(getattr(e, "is_number", False)) and bool(getattr(e, "is_real", False))
    except (sp.SympifyError, TypeError):
        return False


def num(v: Any) -> float:
    return float(v.value if isinstance(v, Rounded) else S(v))


class CheckError(Exception):
    pass


def _norm_tex(tex: str) -> str:
    t = tex.replace("$", "").replace("\\dfrac", "\\frac").replace("{,}", "")
    t = re.sub(r"(?<=\d),(?=\d{3})", "", t)  # 1,590 -> 1590
    return re.sub(r"\s+", "", t)


def _number_forms(v: Any) -> list[str]:
    """Ways a number may be written in an option."""
    if isinstance(v, Rounded):
        if v.dp == 0:
            return [f"{v.value:.0f}", f"{round(v.value):03d}"]  # also three-figure bearings, e.g. 037
        if v.dp is not None:
            return [f"{v.value:.{v.dp}f}"]
        e = int(math.floor(math.log10(abs(v.value))))
        m = v.value / 10**e
        return [f"{m:.{v.sf - 1}f}\\times10^{{{e}}}"]
    r = sp.Rational(v)
    forms = []
    if r.q == 1:
        forms.append(str(r.p))
        if 0 <= r.p < 100:
            forms.append(f"{r.p:03d}")  # three-figure bearings, e.g. 065
    else:
        sign = "-" if r < 0 else ""
        forms.append(f"{sign}\\frac{{{abs(r.p)}}}{{{r.q}}}")
        whole, rest = divmod(abs(r.p), r.q)
        if whole:  # mixed numbers, e.g. 1\frac{5}{12}
            forms.append(f"{sign}{whole}\\frac{{{rest}}}{{{r.q}}}")
        dec = float(r)
        for dp in range(1, 9):
            if abs(round(dec, dp) - dec) < 1e-12:
                forms.append(f"{dec:.{dp}f}")
                break
    return forms


def _parse_math(tex: str):
    """Parse an option such as '$6\\sqrt{2}$ m', '$x = \\frac{y+3}{y-2}$' or
    '$2x^{2} + 5x - 3 = 0$' into a sympy expression (None if not possible)."""
    try:
        from sympy.parsing.latex import parse_latex
    except ImportError:
        return None
    m = re.sub(r"\s+(m|g|cm)$", "", tex.strip()).replace("$", "").strip()
    if "\\to" in m:  # mappings: x \to 3x + 2
        m = m.split("\\to", 1)[1]
    elif re.search(r"=\s*0$", m):
        m = re.sub(r"=\s*0$", "", m)
    elif re.match(r"^[A-Za-z]\s*=", m):
        m = m.split("=", 1)[1]
    # A single letter before "(" is multiplication, not a function: x(6y - 9) = x * (6y - 9).
    m = re.sub(r"(?<![\\a-zA-Z])([a-zA-Z])\(", r"\1\\cdot(", m)
    try:
        return parse_latex(m)
    except Exception:  # noqa: BLE001 - parser raises several types
        return None


def _tex_number(t: str):
    m = re.fullmatch(r"(-?)\\d?frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        return (-1 if m.group(1) else 1) * sp.Rational(int(m.group(2)), int(m.group(3)))
    return sp.Rational(t) if re.fullmatch(r"-?\d+(?:\.\d+)?", t) else None


def _interval_from_tex(tex: str):
    """'$x \\leq -3$' or '$-2 < x \\leq 3$' -> the sympy interval it describes."""
    t = tex.replace("$", "").replace(" ", "")
    for a, b in (("\\leq", "≤"), ("\\geq", "≥"), ("\\le", "≤"), ("\\ge", "≥")):
        t = t.replace(a, b)
    num = r"(-?\\d?frac\{\d+\}\{\d+\}|-?\d+(?:\.\d+)?)"
    m = re.fullmatch(rf"x([<>≤≥]){num}", t)
    if m:
        op, v = m.group(1), _tex_number(m.group(2))
        return {"<": sp.Interval.open(-sp.oo, v), "≤": sp.Interval(-sp.oo, v),
                ">": sp.Interval.open(v, sp.oo), "≥": sp.Interval(v, sp.oo)}[op]
    m = re.fullmatch(rf"{num}([<≤])x([<≤]){num}", t)
    if m:
        lo, hi = _tex_number(m.group(1)), _tex_number(m.group(4))
        return sp.Interval(lo, hi, left_open=m.group(2) == "<", right_open=m.group(3) == "<")
    return None


def tex_shows(tex: str, value: Any) -> bool | None:
    """True if the option text shows this value, False if it shows something
    else, None if this kind of value can't be checked automatically."""
    t = _norm_tex(tex)
    if isinstance(value, sp.Set):
        shown = _interval_from_tex(tex)
        return None if shown is None else shown == value
    if isinstance(value, str) and "=" in value:  # equations such as x=1
        return t.replace(" ", "") == value.replace(" ", "")
    if isinstance(value, str):
        if value.isdigit():
            return f"{value}_{{" in t  # base-n numbers, e.g. 2210_{three}
        if re.search(r"[A-Za-z]", value):  # words, e.g. Sunday, many-to-one, 45 and 30
            return value in tex.replace("$", "").replace("°", "")
        return None
    if isinstance(value, tuple):  # column vectors: the numbers must appear in order
        shown = re.findall(r"-?\d+(?:\.\d+)?", t)
        want = []
        for v in value:
            if isinstance(v, Rounded):
                want.append(f"{v.value:.{v.dp}f}" if v.dp is not None else None)
            else:
                r = sp.Rational(v)
                if r.q == 1:
                    want.append(str(r.p))
                else:
                    dec = float(r)
                    dp = next((d for d in range(1, 9) if abs(round(dec, d) - dec) < 1e-12), None)
                    want.append(f"{dec:.{dp}f}" if dp else None)
        return None if None in want else shown == want
    if isinstance(value, (set, frozenset)) and value and all(isinstance(v, str) for v in value):
        return set(re.findall(r"(?<![\\A-Za-z])[a-z](?![A-Za-z])", t)) == set(value)
    if isinstance(value, (set, frozenset)):
        if not all(isinstance(v, (int, Rounded)) or (hasattr(v, "is_Integer") and v.is_Integer) for v in value):
            return None
        return all(tex_shows(tex, v) for v in value) and len(re.findall(r"-?\d+(?:\.\d+)?", t)) == len(value)
    if not isinstance(value, Rounded):
        try:
            e = S(value)
        except (sp.SympifyError, TypeError):
            return None
        if not e.is_Rational:
            parsed = _parse_math(tex)
            if parsed is None:
                return None
            # Compare with every letter taken as a positive number (pi as the constant).
            def pos(expr):
                return expr.subs({s: (sp.pi if s.name == "pi" else sp.Symbol(s.name, positive=True)) for s in expr.free_symbols})

            return sp.simplify(pos(parsed) - pos(e)) == 0
    no_fracs = re.sub(r"\\frac\{[^}]*\}\{[^}]*\}", "F", t)  # so 3 doesn't match inside \frac{3}{2}
    for form in _number_forms(value):
        target = t if "\\frac" in form else no_fracs
        if re.search(r"(?<![\d.\-])" + re.escape(form) + r"(?![\d.}])", target):
            return True
    if not isinstance(value, Rounded) and "\\" in tex:  # e.g. \sqrt{9} shown for 3
        parsed = _parse_math(tex)
        if parsed is not None and parsed.is_number:
            return sp.simplify(parsed - S(value)) == 0
    return False


def check(q: Q) -> None:
    """Raise CheckError if the question is not provably sound."""
    problems: list[str] = []
    if len(q.wrong) != 3:
        problems.append(f"needs 3 wrong options, has {len(q.wrong)}")
    got = q.solve()
    if not same(q.answer[1], got):
        problems.append(f"answer {q.answer[0]!r} does not match solve() = {got!r}")
    for w in q.wrong:
        if same(w.value, got):
            problems.append(f"wrong option {w.tex!r} equals the correct answer")
        if not w.why.strip():
            problems.append(f"wrong option {w.tex!r} has no reason")
        if w.derive is not None:
            d = w.derive()
            if not same(w.value, d):
                problems.append(f"wrong option {w.tex!r}: stated mistake gives {d!r}, not {w.value!r}")
    values = [q.answer[1]] + [w.value for w in q.wrong]
    texts = [q.answer[0]] + [w.tex for w in q.wrong]
    if q.order is not None and sorted(q.order) != sorted(texts):
        problems.append("`order` must list exactly the option texts")
    for t, v in zip(texts, values):
        if tex_shows(t, v) is False:
            problems.append(f"option text {t!r} does not show its value {v!r}")
    for i in range(len(values)):
        for j in range(i + 1, len(values)):
            if same(values[i], values[j]):
                problems.append(f"options {texts[i]!r} and {texts[j]!r} are equal")
            if texts[i] == texts[j]:
                problems.append(f"options {texts[i]!r} repeated")
    if not q.working.strip():
        problems.append("no worked solution")
    if problems:
        raise CheckError(f"{q.id}: " + "; ".join(problems))
