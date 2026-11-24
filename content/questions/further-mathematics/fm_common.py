"""Helpers for the Further Mathematics question sets.

Two kinds of question:

- `mq`: the answer is worked out by code (`solve`), and each wrong option is a
  value with the mistake that produces it and, where natural, a `derive` that
  reproduces the mistake. The build fails unless exactly one option matches
  `solve`, every wrong option differs, and every `derive` gives its option.
- `concept`: a statement or form (such as the correct partial-fraction form,
  or a domain in words) whose options are text; an editor checked these
  against the WASSCE Tutor Further Mathematics notes.
"""

from __future__ import annotations

from typing import Any, Callable

from qbank import Q, Wrong


def _plain(text: str) -> str:
    """A text option's value: the option without its $ signs, so the build can see it shown."""
    return text.replace("$", "")


def make(topics: dict[str, str]):
    def mq(id: str, topic: str, stem: str, answer: tuple[str, Any], wrong: list[tuple], solve: Callable[[], Any],
           working: str, order: list[str] | None = None, diagram: Callable[[], str] | None = None) -> Q:
        assert len(wrong) == 3, id
        assert topic in topics, f"{id}: unknown topic {topic!r}"
        return Q(
            id=id, topic=topic, ref=topics[topic], stem=stem, answer=answer,
            wrong=[Wrong(*w) for w in wrong], solve=solve, working=working, order=order, diagram=diagram,
        )

    def concept(id: str, topic: str, stem: str, answer: str, wrong: list[tuple[str, str]], working: str,
                order: list[str] | None = None) -> Q:
        assert len(wrong) == 3, id
        assert topic in topics, f"{id}: unknown topic {topic!r}"
        return Q(
            id=id, topic=topic, ref=topics[topic], stem=stem,
            answer=(answer, _plain(answer)),
            wrong=[Wrong(t, _plain(t), why) for t, why in wrong],
            solve=lambda a=_plain(answer): a,  # checked by an editor, not by code
            working=working, order=order,
        )

    return mq, concept
