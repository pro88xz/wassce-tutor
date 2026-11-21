"""Helpers for the Mathematics "practice set 2" files (set6_p1.py to set10_p1.py).

Each question is a qbank.Q: `solve` works the answer out in code, and each wrong option
is (text, value, the mistake, and where natural a `derive` that reproduces the mistake).
The build fails unless exactly one option matches `solve`, every wrong option differs,
every `derive` really gives its option, and every option text shows its value.
"""

from __future__ import annotations

from typing import Any, Callable

from qbank import Q, Wrong


def make(topics: dict[str, str]):
    def mq(id: str, topic: str, stem: str, answer: tuple[str, Any], wrong: list[tuple], solve: Callable[[], Any],
           working: str, order: list[str] | None = None, diagram: Callable[[], str] | None = None) -> Q:
        assert len(wrong) == 3, id
        return Q(
            id=id, topic=topic, ref=topics[topic], stem=stem, answer=answer,
            wrong=[Wrong(*w) for w in wrong], solve=solve, working=working, order=order, diagram=diagram,
        )

    return mq


def to_base(value: int, base: int) -> str:
    digits = ""
    while value:
        value, r = divmod(value, base)
        digits = str(r) + digits
    return digits or "0"


def in_base(s: str, base: int) -> str:
    """LaTeX for a numeral in a named base, e.g. 203 in base five."""
    names = {2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten"}
    return f"${s}_{{\\text{{{names[base]}}}}}$"
