#!/usr/bin/env python3
"""Check question sets and build the files the app loads them from.

    pip install -r scripts/questions/requirements.txt
    python3 scripts/questions/build.py            # check + write files
    python3 scripts/questions/build.py --check    # check only

Every answer is recomputed by code (see qbank.py). If any question fails, no
files are written.

Output
  src/content/question-sets/<set>.json
      the set as the app stores it: one practice paper per topic, with
      questions and options. Every production deploy loads new or changed
      rows into the database (scripts/sync-questions.mjs), so they go live
      with no button to press; Admin -> Load question sets is the manual
      fallback. Rows have fixed ids, so loading again never adds copies.
  src/content/question-sets/manifest.json
      the list of sets the loader shows.
  public/questions/<subject>/<question>.svg
      diagrams, served from the website.
  content/questions/<subject>/<set>.review.md
      the questions as students see them, with the answer, the working and
      the reason behind every wrong option, for teachers to read.
"""

from __future__ import annotations

import hashlib
import importlib.util
import json
import sys
import uuid
from collections import Counter, OrderedDict
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))

from qbank import CheckError, Q, check, is_number, num  # noqa: E402

SETS = [
    {
        "module": ROOT / "content/questions/mathematics/pilot_p1.py",
        "subject_slug": "mathematics",
        "name": "maths_pilot_p1",
        "label": "Mathematics: set 1",
        "review": ROOT / "content/questions/mathematics/pilot_p1.review.md",
        "sort_from": 100,
    },
    {
        "module": ROOT / "content/questions/mathematics/set2_p1.py",
        "subject_slug": "mathematics",
        "name": "maths_set2_p1",
        "label": "Mathematics: set 2 (with diagrams)",
        "review": ROOT / "content/questions/mathematics/set2_p1.review.md",
        "sort_from": 110,
    },
    {
        "module": ROOT / "content/questions/mathematics/set3_p1.py",
        "subject_slug": "mathematics",
        "name": "maths_set3_p1",
        "label": "Mathematics: set 3 (with charts)",
        "review": ROOT / "content/questions/mathematics/set3_p1.review.md",
        "sort_from": 120,
    },
    {
        "module": ROOT / "content/questions/mathematics/set4_p1.py",
        "subject_slug": "mathematics",
        "name": "maths_set4_p1",
        "label": "Mathematics: set 4 (number and algebra)",
        "review": ROOT / "content/questions/mathematics/set4_p1.review.md",
        "sort_from": 130,
    },
    {
        "module": ROOT / "content/questions/mathematics/set5_p1.py",
        "subject_slug": "mathematics",
        "name": "maths_set5_p1",
        "label": "Mathematics: set 5 (geometry, finance, calculus)",
        "review": ROOT / "content/questions/mathematics/set5_p1.review.md",
        "sort_from": 140,
    },
]

OUT = ROOT / "src/content/question-sets"
SITE = "https://wasscetutor.com"  # diagrams are served from the website so old app builds can show them too
LABELS = "ABCD"
NS = uuid.UUID("6f1c3f5e-9a51-4d0e-b7a4-2f0c5d6e7a81")  # fixed namespace for stable ids


def uid(*parts: str) -> str:
    return str(uuid.uuid5(NS, "/".join(parts)))


def load(path: Path):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def order_options(questions: list[Q]) -> dict[str, list[tuple[str, bool, int]]]:
    """Numbers go in ascending order (as on WAEC papers). Other options are
    placed so the correct answers end up spread evenly across A-D."""
    out: dict[str, list[tuple[str, bool, int]]] = {}
    used = Counter()
    later = []
    for q in questions:
        opts = [(q.answer[0], True, 0, q.answer[1])] + [(w.tex, False, i + 1, w.value) for i, w in enumerate(q.wrong)]
        if q.order:
            opts.sort(key=lambda o: q.order.index(o[0]))
            out[q.id] = [(t, c, src) for t, c, src, _ in opts]
            used[[c for _, c, _, _ in opts].index(True)] += 1
        elif all(is_number(v) for *_, v in opts):
            opts.sort(key=lambda o: num(o[3]))
            out[q.id] = [(t, c, src) for t, c, src, _ in opts]
            used[[c for _, c, _, _ in opts].index(True)] += 1
        else:
            later.append((q, opts))
    for q, opts in later:
        slot = min(range(4), key=lambda k: (used[k], k))
        wrong = [o for o in opts if not o[1]]
        placed = wrong[:slot] + [opts[0]] + wrong[slot:]
        out[q.id] = [(t, c, src) for t, c, src, _ in placed]
        used[slot] += 1
    return out


def big_fracs(tex: str) -> str:
    """Write fractions full size (\\dfrac) so they are readable on a phone,
    except inside powers and subscripts, e.g. the 2/3 in 27^{\\frac{2}{3}}."""
    out, depth, scripts, i = [], 0, [], 0
    while i < len(tex):
        if tex.startswith("\\frac", i) and not scripts:
            out.append("\\dfrac")
            i += len("\\frac")
            continue
        ch = tex[i]
        if ch in "^_" and tex.startswith("{", i + 1):
            scripts.append(depth + 1)
        elif ch == "{":
            depth += 1
        elif ch == "}":
            if scripts and scripts[-1] == depth:
                scripts.pop()
            depth -= 1
        out.append(ch)
        i += 1
    return "".join(out)


def explanation(q: Q) -> str:
    # The app already shows the correct letter above this text.
    lines = [q.working.strip(), "", "**Why the other options are wrong**", ""]
    lines += [f"- {w.tex}: {w.why}" for w in q.wrong]
    return big_fracs("\n".join(lines))


def diagram_path(cfg: dict, q: Q) -> Path:
    return ROOT / "public/questions" / cfg["subject_slug"] / f"{q.id}.svg"


def image_url(cfg: dict, q: Q, svgs: dict[str, str]) -> str | None:
    """Versioned URL, so a redrawn diagram is never served from an old cache."""
    if q.id not in svgs:
        return None
    v = hashlib.sha1(svgs[q.id].encode()).hexdigest()[:10]
    return f"{SITE}/questions/{cfg['subject_slug']}/{q.id}.svg?v={v}"


def build_set(cfg: dict, questions: list[Q], ordered: dict, svgs: dict[str, str]) -> dict:
    topics = list(OrderedDict.fromkeys(q.topic for q in questions))
    papers = []
    for i, topic in enumerate(topics):
        qs = [q for q in questions if q.topic == topic]
        papers.append({
            "id": uid(cfg["name"], "paper", topic),
            "topic": topic,
            "title": f"{topic}: practice set 1",
            "paper_type": "Practice",
            "description": (
                f"{len(qs)} original WASSCE-style objective questions on {topic.lower()}, each with a worked "
                "solution and the reason behind every wrong option. Written by WASSCE Tutor, not taken from WAEC papers."
            ),
            "sort_order": cfg["sort_from"] + i,
            "questions": [
                {
                    "id": uid(cfg["name"], "question", q.id),
                    "key": q.id,
                    "stem": big_fracs(q.stem),
                    "image_url": image_url(cfg, q, svgs),
                    "explanation": explanation(q),
                    "position": pos,
                    "options": [
                        {
                            "id": uid(cfg["name"], "option", q.id, str(src)),
                            "label": LABELS[k],
                            "content": big_fracs(text),
                            "is_correct": correct,
                            "position": k,
                        }
                        for k, (text, correct, src) in enumerate(ordered[q.id])
                    ],
                }
                for pos, q in enumerate(qs, start=1)
            ],
        })
    body = {"name": cfg["name"], "label": cfg["label"], "subject_slug": cfg["subject_slug"], "papers": papers}
    body["version"] = hashlib.sha1(json.dumps(body, sort_keys=True).encode()).hexdigest()[:12]
    return body


def build_review(cfg: dict, questions: list[Q], ordered: dict, scope_note: str, svgs: dict[str, str]) -> str:
    out = [
        f"# Review sheet: {cfg['label']}",
        "",
        f"Generated by `scripts/questions/build.py` from `{cfg['module'].relative_to(ROOT)}`. Do not edit by hand.",
        "",
        scope_note,
        "",
        "Every answer below has been recomputed by code. Teachers can still check that each question is on the",
        "syllabus for Sierra Leone candidates, worded the way WAEC words questions, and clearly explained.",
        "",
    ]
    topic = None
    for num_, q in enumerate(questions, start=1):
        if q.topic != topic:
            topic = q.topic
            out += [f"## {topic}", "", f"_Syllabus: {q.ref}_", ""]
        out += [f"### {num_}. `{q.id}`", "", q.stem, ""]
        if q.id in svgs:
            rel = Path("../../..") / diagram_path(cfg, q).relative_to(ROOT)
            out += [f"![Diagram for {q.id}]({rel.as_posix()})", ""]
        for k, (text, correct, _) in enumerate(ordered[q.id]):
            out.append(f"- **{LABELS[k]}.** {text}" + ("  ✅" if correct else ""))
        out += ["", explanation(q), "", "---", ""]
    return "\n".join(out)


def main() -> int:
    check_only = "--check" in sys.argv
    failures = 0
    built = []
    for cfg in SETS:
        mod = load(cfg["module"])
        questions: list[Q] = mod.QUESTIONS
        ids = Counter(q.id for q in questions)
        dupes = [k for k, v in ids.items() if v > 1]
        if dupes:
            print(f"duplicate ids: {dupes}")
            failures += 1
        for q in questions:
            if q.topic not in mod.TOPICS:
                print(f"{q.id}: topic {q.topic!r} is not in TOPICS")
                failures += 1
            try:
                check(q)
            except CheckError as e:
                print(e)
                failures += 1
        svgs: dict[str, str] = {}
        for q in questions:
            if q.diagram is not None:
                try:
                    svgs[q.id] = q.diagram()
                except Exception as e:  # noqa: BLE001
                    print(f"{q.id}: diagram failed: {e!r}")
                    failures += 1
        if failures:
            continue
        ordered = order_options(questions)
        spread = Counter(LABELS[[c for _, c, _ in ordered[q.id]].index(True)] for q in questions)
        print(f"{cfg['name']}: {len(questions)} questions checked. Correct answers by letter: "
              + ", ".join(f"{k} {spread[k]}" for k in LABELS))
        built.append((cfg, mod, questions, ordered, svgs))
    if failures:
        print(f"\n{failures} problem(s). Nothing written.")
        return 1
    if check_only:
        return 0
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    for cfg, mod, questions, ordered, svgs in built:
        body = build_set(cfg, questions, ordered, svgs)
        (OUT / f"{cfg['name']}.json").write_text(json.dumps(body, ensure_ascii=False, indent=1) + "\n")
        manifest.append({
            "name": cfg["name"],
            "label": cfg["label"],
            "subject_slug": cfg["subject_slug"],
            "version": body["version"],
            "papers": [p["id"] for p in body["papers"]],
            "questions": len(questions),
        })
        scope = (mod.__doc__ or "").strip().splitlines()[0]
        cfg["review"].write_text(build_review(cfg, questions, ordered, scope, svgs))
        for q in questions:
            if q.id in svgs:
                diagram_path(cfg, q).parent.mkdir(parents=True, exist_ok=True)
                diagram_path(cfg, q).write_text(svgs[q.id])
        print(f"  wrote {(OUT / (cfg['name'] + '.json')).relative_to(ROOT)}, {cfg['review'].relative_to(ROOT)}"
              + (f" and {len(svgs)} diagrams" if svgs else ""))
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
