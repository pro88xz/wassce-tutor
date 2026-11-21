"""Helpers for the Agricultural Science question sets.

Agricultural Science questions in these sets are factual, so every item is a `concept`: the
answer and each wrong option are text, and each was checked against the WAEC Agricultural
Science syllabus and the WASSCE Tutor Agricultural Science notes.

A question can carry a diagram (a function returning SVG) and, when its options are
quantities such as "23 kg", a fixed `order` so they appear in ascending order as on WAEC papers.
"""

from __future__ import annotations

from typing import Callable

import sympy as sp

from qbank import Q, Wrong, _norm_tex


def _val(text: str):
    """A year or count such as "1948" is compared as a number; other options as text."""
    t = text.strip()
    if t.isdigit():
        return sp.Integer(t)
    return _norm_tex(t) if "=" in t else t


def make(topics: dict[str, str]):
    def concept(id: str, topic: str, stem: str, answer: str, wrong: list[tuple[str, str]], working: str,
                diagram: Callable[[], str] | None = None, order: list[str] | None = None) -> Q:
        assert len(wrong) == 3, id
        return Q(
            id=id, topic=topic, ref=topics[topic], stem=stem,
            answer=(answer, _val(answer)),
            wrong=[Wrong(t, _val(t), why) for t, why in wrong],
            solve=lambda a=_val(answer): a,  # checked by an editor, not by code
            working=working,
            diagram=diagram,
            order=order,
        )

    return concept
