"""Helpers for the ICT / Computer Studies question sets.

ICT questions test facts, terms, uses and simple conversions, so every item is
a `concept`: the answer and each wrong option are text (a number such as
"1101" is compared as a number, so two options can never show the same value),
and an editor checked them against the WASSCE Tutor ICT notes and the WAEC
syllabus. Every conversion is worked in full in its explanation.
"""

from __future__ import annotations

import sympy as sp

from qbank import Q, Wrong, _norm_tex


def _val(text: str):
    """A whole number such as "1101" or "157" is compared as a number; other options as text."""
    t = text.strip()
    if t.isdigit():
        return sp.Integer(t)
    return _norm_tex(t) if "=" in t else t


def make(topics: dict[str, str]):
    def concept(id: str, topic: str, stem: str, answer: str, wrong: list[tuple[str, str]], working: str) -> Q:
        assert len(wrong) == 3, id
        assert topic in topics, f"{id}: unknown topic {topic!r}"
        return Q(
            id=id, topic=topic, ref=topics[topic], stem=stem,
            answer=(answer, _val(answer)),
            wrong=[Wrong(t, _val(t), why) for t, why in wrong],
            solve=lambda a=_val(answer): a,  # checked by an editor, not by code
            working=working,
        )

    return concept
