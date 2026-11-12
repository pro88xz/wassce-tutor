"""Helpers for the Commerce question sets (adapted from the Economics helpers).

Money is shown the way Sierra Leoneans write it: "NLe 7,600", not "7600 NLe".

`calc` builds a numerical item: the answer is recomputed by `solve`, and every
wrong option carries the mistake that produces it (with a `derive` that redoes
that mistake, so the build fails if the distractor is not what the mistake
gives). `concept` builds a non-numerical item that an editor checked.
"""

from __future__ import annotations

import sympy as sp

from qbank import Q, Rounded, Wrong, _norm_tex

G = 10  # WASSCE papers usually say "take g = 10 m s⁻²"


def _val(text: str) -> str:
    """A text option's value in the form the checker compares."""
    if "=" in text:
        return _norm_tex(text)
    bare = text.replace("°", "").strip()
    try:  # a plain number such as "45°" is compared as a number
        return sp.Rational(bare)
    except (TypeError, ValueError):
        return bare


def _clean(x):
    """Remove floating-point noise from trigonometry (1.9999999999999996 -> 2.0)."""
    return round(x, 9) if isinstance(x, float) else x


def _wrap(fn):
    return None if fn is None else (lambda: _clean(fn()))


def fmt(v) -> str:
    if isinstance(v, Rounded):
        return f"{v.value:.{v.dp}f}"
    f = float(sp.nsimplify(v)) if not isinstance(v, (int, float)) else float(v)
    if abs(f - round(f)) < 1e-9:
        return str(int(round(f)))
    s = f"{f:.6f}".rstrip("0").rstrip(".")
    return s


def _shown(v):
    """A fraction with no exact decimal (1/3, 2/3, 1/30) is shown rounded, as a
    student would write it; the check then compares the rounded value."""
    if isinstance(v, Rounded) or isinstance(v, float):
        return v
    try:
        r = sp.Rational(v)
    except (TypeError, ValueError):
        return v
    q = int(r.q)
    while q % 2 == 0:
        q //= 2
    while q % 5 == 0:
        q //= 5
    if q == 1:
        return v
    x = float(r)
    return Rounded(x, dp=3 if abs(x) < 1 else 2)


def show(v, unit: str) -> str:
    """Option text for a value: 'NLe 7,600', '25%', '3.6 times' or a bare number."""
    s = fmt(v)
    if "." not in s and abs(int(s)) >= 1000:
        s = f"{int(s):,}"
    elif "." in s:
        whole, dec = s.split(".")
        if abs(int(whole)) >= 1000:
            s = f"{int(whole):,}.{dec}"
    if unit == "NLe":
        return f"NLe {s}"
    if unit == "%":
        return f"{s}%"
    return f"{s} {unit}" if unit else s


def make(topics: dict[str, str]):
    def calc(id: str, topic: str, stem: str, unit: str, answer, wrong: list, working: str, solve=None) -> Q:
        """answer: a number or Rounded. wrong: (value, why) or (value, why, derive)."""
        def label(v):
            return show(v, unit)

        answer = _shown(answer)
        ws = []
        for w in wrong:
            value, why = _shown(w[0]), w[1]
            derive = w[2] if len(w) > 2 else None
            ws.append(Wrong(label(value), value, why, _wrap(derive)))
        return Q(
            id=id, topic=topic, ref=topics[topic], stem=stem,
            answer=(label(answer), answer), wrong=ws,
            solve=_wrap(solve) or (lambda a=answer: a), working=working,
        )

    def concept(id: str, topic: str, stem: str, answer: str, wrong: list[tuple[str, str]], working: str) -> Q:
        return Q(
            id=id, topic=topic, ref=topics[topic], stem=stem,
            answer=(answer, _val(answer)),
            wrong=[Wrong(t, _val(t), why) for t, why in wrong],
            solve=lambda a=_val(answer): a,  # checked by an editor, not by code
            working=working,
        )

    return calc, concept
