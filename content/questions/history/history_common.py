"""Helpers for the History question sets.

History questions test facts, causes, effects and interpretation, so every item is a `concept`: the answer and
each wrong option are text, and an editor checked them against the WASSCE Tutor
History notes and the WAEC syllabus. Dates
are given in full and every answer is explained in `working`.
"""

from __future__ import annotations

import sympy as sp

from qbank import Q, Wrong, _norm_tex


def _val(text: str):
    """A year or count such as "1948" is compared as a number; other options as text."""
    t = text.strip()
    if t.isdigit():
        return sp.Integer(t)
    return _norm_tex(t) if "=" in t else t


def make(topics: dict[str, str]):
    def concept(id: str, topic: str, stem: str, answer: str, wrong: list[tuple[str, str]], working: str) -> Q:
        assert len(wrong) == 3, id
        return Q(
            id=id, topic=topic, ref=topics[topic], stem=stem,
            answer=(answer, _val(answer)),
            wrong=[Wrong(t, _val(t), why) for t, why in wrong],
            solve=lambda a=_val(answer): a,  # checked by an editor, not by code
            working=working,
        )

    return concept
