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
    {
        "module": ROOT / "content/questions/english-language/set1_p1.py",
        "subject_slug": "english-language",
        "name": "english_set1_p1",
        "label": "English Language: set 1 (grammar)",
        "review": ROOT / "content/questions/english-language/set1_p1.review.md",
        "sort_from": 100,
        # Language answers cannot be recomputed by code: an editor checked each one.
        "checked": "editor",
    },
    {
        "module": ROOT / "content/questions/english-language/set2_p1.py",
        "subject_slug": "english-language",
        "name": "english_set2_p1",
        "label": "English Language: set 2 (grammar and vocabulary)",
        "review": ROOT / "content/questions/english-language/set2_p1.review.md",
        "sort_from": 110,
        "checked": "editor",
    },
    {
        "module": ROOT / "content/questions/english-language/set3_p1.py",
        "subject_slug": "english-language",
        "name": "english_set3_p1",
        "label": "English Language: set 3 (sentences, punctuation and vocabulary)",
        "review": ROOT / "content/questions/english-language/set3_p1.review.md",
        "sort_from": 120,
        "checked": "editor",
    },
    {
        "module": ROOT / "content/questions/english-language/set4_p1.py",
        "subject_slug": "english-language",
        "name": "english_set4_p1",
        "label": "English Language: set 4 (comprehension and summary)",
        "review": ROOT / "content/questions/english-language/set4_p1.review.md",
        "sort_from": 130,
        "checked": "editor",
    },
]

SETS += [
    {
        "module": ROOT / "content/questions/physics/set1_p1.py",
        "subject_slug": "physics",
        "name": "physics_set1_p1",
        "label": "Physics: set 1 (foundations and mechanics)",
        "review": ROOT / "content/questions/physics/set1_p1.review.md",
        "sort_from": 100,
        # Numerical answers are recomputed by code; conceptual ones were checked by an editor.
        "checked": "mixed",
    },
    {
        "module": ROOT / "content/questions/physics/set2_p1.py",
        "subject_slug": "physics",
        "name": "physics_set2_p1",
        "label": "Physics: set 2 (matter, fluids and heat)",
        "review": ROOT / "content/questions/physics/set2_p1.review.md",
        "sort_from": 120,
        "checked": "mixed",
    },
    {
        "module": ROOT / "content/questions/physics/set3_p1.py",
        "subject_slug": "physics",
        "name": "physics_set3_p1",
        "label": "Physics: set 3 (waves, sound, light and optics)",
        "review": ROOT / "content/questions/physics/set3_p1.review.md",
        "sort_from": 140,
        "checked": "mixed",
    },
    {
        "module": ROOT / "content/questions/physics/set4_p1.py",
        "subject_slug": "physics",
        "name": "physics_set4_p1",
        "label": "Physics: set 4 (electricity, magnetism and modern physics)",
        "review": ROOT / "content/questions/physics/set4_p1.review.md",
        "sort_from": 160,
        "checked": "mixed",
    },
    {
        "module": ROOT / "content/questions/economics/set1_p1.py",
        "subject_slug": "economics",
        "name": "economics_set1_p1",
        "label": "Economics: set 1 (foundations and production)",
        "review": ROOT / "content/questions/economics/set1_p1.review.md",
        "sort_from": 100,
        "checked": "mixed",
    },
    {
        "module": ROOT / "content/questions/economics/set2_p1.py",
        "subject_slug": "economics",
        "name": "economics_set2_p1",
        "label": "Economics: set 2 (markets)",
        "review": ROOT / "content/questions/economics/set2_p1.review.md",
        "sort_from": 120,
        "checked": "mixed",
    },
    {
        "module": ROOT / "content/questions/economics/set3_p1.py",
        "subject_slug": "economics",
        "name": "economics_set3_p1",
        "label": "Economics: set 3 (labour, population, sectors and the macroeconomy)",
        "review": ROOT / "content/questions/economics/set3_p1.review.md",
        "sort_from": 140,
        "checked": "mixed",
    },
    {
        "module": ROOT / "content/questions/economics/set4_p1.py",
        "subject_slug": "economics",
        "name": "economics_set4_p1",
        "label": "Economics: set 4 (trade and development)",
        "review": ROOT / "content/questions/economics/set4_p1.review.md",
        "sort_from": 160,
        "checked": "mixed",
    },
    {
        "module": ROOT / "content/questions/commerce/set1_p1.py",
        "subject_slug": "commerce",
        "name": "commerce_set1_p1",
        "label": "Commerce: set 1 (commerce, production, business units and home trade)",
        "review": ROOT / "content/questions/commerce/set1_p1.review.md",
        "sort_from": 100,
        "checked": "mixed",
    },
    {
        "module": ROOT / "content/questions/commerce/set2_p1.py",
        "subject_slug": "commerce",
        "name": "commerce_set2_p1",
        "label": "Commerce: set 2 (foreign trade, documents and the aids to trade)",
        "review": ROOT / "content/questions/commerce/set2_p1.review.md",
        "sort_from": 120,
        "checked": "mixed",
    },
    {
        "module": ROOT / "content/questions/commerce/set3_p1.py",
        "subject_slug": "commerce",
        "name": "commerce_set3_p1",
        "label": "Commerce: set 3 (money, finance, law and modern commerce)",
        "review": ROOT / "content/questions/commerce/set3_p1.review.md",
        "sort_from": 140,
        "checked": "mixed",
    },
]

SETS += [
    {
        "module": ROOT / "content/questions/chemistry/set1_p1.py",
        "subject_slug": "chemistry",
        "name": "chemistry_set1_p1",
        "label": "Chemistry: set 1 (foundations, atoms, bonding and chemical calculations)",
        "review": ROOT / "content/questions/chemistry/set1_p1.review.md",
        "sort_from": 100,
        "checked": "mixed",
    },
    {
        "module": ROOT / "content/questions/chemistry/set2_p1.py",
        "subject_slug": "chemistry",
        "name": "chemistry_set2_p1",
        "label": "Chemistry: set 2 (acids, salts, solutions, redox and physical chemistry)",
        "review": ROOT / "content/questions/chemistry/set2_p1.review.md",
        "sort_from": 120,
        "checked": "mixed",
    },
    {
        "module": ROOT / "content/questions/chemistry/set3_p1.py",
        "subject_slug": "chemistry",
        "name": "chemistry_set3_p1",
        "label": "Chemistry: set 3 (non-metals, metals and industrial chemistry)",
        "review": ROOT / "content/questions/chemistry/set3_p1.review.md",
        "sort_from": 140,
        "checked": "mixed",
    },
    {
        "module": ROOT / "content/questions/chemistry/set4_p1.py",
        "subject_slug": "chemistry",
        "name": "chemistry_set4_p1",
        "label": "Chemistry: set 4 (organic, environmental and practical chemistry)",
        "review": ROOT / "content/questions/chemistry/set4_p1.review.md",
        "sort_from": 160,
        "checked": "mixed",
    },
]

SETS += [
    {
        "module": ROOT / f"content/questions/government/set{n}_p1.py",
        "subject_slug": "government",
        "name": f"government_set{n}_p1",
        "label": label,
        "review": ROOT / f"content/questions/government/set{n}_p1.review.md",
        "sort_from": 80 + 20 * n,
        # Factual answers cannot be recomputed by code: an editor checked each one.
        "checked": "facts",
    }
    for n, label in (
        (1, "Government: set 1 (political concepts and the organs of government)"),
        (2, "Government: set 2 (rights, constitutions and political processes)"),
        (3, "Government: set 3 (Sierra Leone from pre-colonial times to 1991)"),
        (4, "Government: set 4 (parties, military rule, chiefdoms and international relations)"),
    )
]

SETS += [
    {
        "module": ROOT / f"content/questions/geography/set{n}_p1.py",
        "subject_slug": "geography",
        "name": f"geography_set{n}_p1",
        "label": label,
        "review": ROOT / f"content/questions/geography/set{n}_p1.review.md",
        "sort_from": 80 + 20 * n,
        # Factual answers cannot be recomputed by code: an editor checked each one.
        "checked": "facts",
    }
    for n, label in (
        (1, "Geography: set 1 (the Earth, rocks, tectonics, weathering, rivers, coasts and landforms)"),
        (2, "Geography: set 2 (drainage, weather and climate, vegetation, soils, population and settlement)"),
        (3, "Geography: set 3 (agriculture, mining, industry, energy, transport, trade, environment, Sierra Leone)"),
        (4, "Geography: set 4 (Sierra Leone's economy, West Africa, Africa, ECOWAS and practical geography)"),
    )
]

SETS += [
    {
        "module": ROOT / f"content/questions/financial-accounting/set{n}_p1.py",
        "subject_slug": "financial-accounting",
        "name": f"financial_accounting_set{n}_p1",
        "label": label,
        "review": ROOT / f"content/questions/financial-accounting/set{n}_p1.review.md",
        "sort_from": 80 + 20 * n,
        # Concepts are checked by an editor; every calculation is worked in full in its explanation.
        "checked": "facts",
    }
    for n, label in (
        (1, "Financial Accounting: set 1 (foundations, books of original entry, cash book, petty cash, ledger)"),
        (2, "Financial Accounting: set 2 (trial balance, errors, suspense, bank reconciliation, final accounts)"),
        (3, "Financial Accounting: set 3 (control, departmental, branch, incomplete records, partnerships)"),
        (4, "Financial Accounting: set 4 (company accounts, public sector accounting, ICT in accounting)"),
    )
]

SETS += [
    {
        "module": ROOT / "content/questions/biology/set1_p1.py",
        "subject_slug": "biology",
        "name": "biology_set1_p1",
        "label": "Biology: set 1 (cells, nutrition, respiration, transport, ecology and genetics)",
        "review": ROOT / "content/questions/biology/set1_p1.review.md",
        "sort_from": 100,
        # Factual answers cannot be recomputed by code: each was checked against the syllabus.
        "checked": "facts",
    },
]

# Timed mock exams: a full Paper 1 drawn from a subject's practice sets, with the
# number of questions and the time the WAEC syllabus gives for that paper.
# Each mock question is a copy of a practice question (new ids, its own topic),
# so a mock never takes questions away from the topic sets.
MOCKS = [
    {"subject_slug": "mathematics", "subject": "Mathematics", "name": "maths_mock_p1", "count": 50, "minutes": 90},
    {"subject_slug": "physics", "subject": "Physics", "name": "physics_mock_p1", "count": 50, "minutes": 75},
    {"subject_slug": "chemistry", "subject": "Chemistry", "name": "chemistry_mock_p1", "count": 50, "minutes": 60},
]
MOCK_SORT = 900  # after every practice set, so a mock is never chosen as the free starter set

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
    # A full-sentence option keeps its own punctuation; its reason goes on the next line (hard break).
    lines += [f"- {w.tex}  \n  {w.why}" if w.tex.rstrip()[-1:] in ".?!" else f"- {w.tex}: {w.why}" for w in q.wrong]
    return big_fracs("\n".join(lines))


def diagram_path(cfg: dict, q: Q) -> Path:
    return ROOT / "public/questions" / cfg["subject_slug"] / f"{q.id}.svg"


def image_url(cfg: dict, q: Q, svgs: dict[str, str]) -> str | None:
    """Versioned URL, so a redrawn diagram is never served from an old cache."""
    if q.id not in svgs:
        return None
    v = hashlib.sha1(svgs[q.id].encode()).hexdigest()[:10]
    return f"{SITE}/questions/{cfg['subject_slug']}/{q.id}.svg?v={v}"


def passage_markdown(p: dict) -> str:
    """A reading passage as the app shows it above its questions."""
    return f"### {p['title']}\n\n{p['text'].strip()}"


def build_set(cfg: dict, questions: list[Q], ordered: dict, svgs: dict[str, str], passages: dict | None = None) -> dict:
    passages = passages or {}
    topics = list(OrderedDict.fromkeys(q.topic for q in questions))
    papers = []
    for i, topic in enumerate(topics):
        qs = [q for q in questions if q.topic == topic]
        papers.append({
            "id": uid(cfg["name"], "paper", topic),
            "topic": topic,
            "title": f"{topic}: practice set 1",
            # A comprehension set carries its passage in the description; the
            # practice screen shows it above the questions.
            "paper_type": "Comprehension" if topic in passages else "Practice",
            "description": passage_markdown(passages[topic]) if topic in passages else (
                f"{len(qs)} original WASSCE-style objective questions on {topic.lower()}, each with "
                + ("an explanation" if cfg.get("checked") in ("editor", "facts") else "a worked solution")
                + " and the reason behind every wrong option. Written by WASSCE Tutor, not taken from WAEC papers."
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


def build_review(cfg: dict, questions: list[Q], ordered: dict, scope_note: str, svgs: dict[str, str], passages: dict | None = None) -> str:
    passages = passages or {}
    out = [
        f"# Review sheet: {cfg['label']}",
        "",
        f"Generated by `scripts/questions/build.py` from `{cfg['module'].relative_to(ROOT)}`. Do not edit by hand.",
        "",
        scope_note,
        "",
        *(
            [
                "Language answers cannot be recomputed by code. An editor checked that exactly one option is acceptable",
                "in standard British English and that every wrong option is a real, common error. A teacher should still",
                "read each item before it is used in class.",
            ]
            if cfg.get("checked") == "editor"
            else [
                "These are factual questions, so the answers cannot be recomputed by code. An editor checked each answer",
                (
                    "against the WASSCE Tutor notes and the 1991 Constitution of Sierra Leone, and checked that exactly one"
                    if cfg["subject_slug"] == "government"
                    else "against the WAEC syllabus and the WASSCE Tutor notes, and checked that exactly one"
                ),
                "option is correct. A teacher should still read each item before it is used in class.",
            ]
            if cfg.get("checked") == "facts"
            else [
                "Every numerical answer below has been recomputed by code, and every wrong option is what its stated",
                "mistake produces. Conceptual (non-numerical) answers cannot be recomputed: an editor checked that exactly",
                "one option is correct. A teacher should still read each item before it is used in class.",
            ]
            if cfg.get("checked") == "mixed"
            else [
                "Every answer below has been recomputed by code. Teachers can still check that each question is on the",
                "syllabus for Sierra Leone candidates, worded the way WAEC words questions, and clearly explained.",
            ]
        ),
        "",
    ]
    topic = None
    for num_, q in enumerate(questions, start=1):
        if q.topic != topic:
            topic = q.topic
            out += [f"## {topic}", "", f"_Syllabus: {q.ref}_", ""]
            if topic in passages:
                out += ["#" + passage_markdown(passages[topic]), ""]
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
        passages = getattr(mod, "PASSAGES", {})
        body = build_set(cfg, questions, ordered, svgs, passages)
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
        cfg["review"].write_text(build_review(cfg, questions, ordered, scope, svgs, passages))
        for q in questions:
            if q.id in svgs:
                diagram_path(cfg, q).parent.mkdir(parents=True, exist_ok=True)
                diagram_path(cfg, q).write_text(svgs[q.id])
        print(f"  wrote {(OUT / (cfg['name'] + '.json')).relative_to(ROOT)}, {cfg['review'].relative_to(ROOT)}"
              + (f" and {len(svgs)} diagrams" if svgs else ""))
    bodies: dict[str, list[dict]] = {}
    for cfg, mod, questions, ordered, svgs in built:
        bodies.setdefault(cfg["subject_slug"], []).append(json.loads((OUT / f"{cfg['name']}.json").read_text()))
    for mcfg in MOCKS:
        body = build_mock(mcfg, bodies.get(mcfg["subject_slug"], []))
        (OUT / f"{mcfg['name']}.json").write_text(json.dumps(body, ensure_ascii=False, indent=1) + "\n")
        paper = body["papers"][0]
        manifest.append({
            "name": mcfg["name"],
            "label": body["label"],
            "subject_slug": mcfg["subject_slug"],
            "version": body["version"],
            "papers": [paper["id"]],
            "questions": len(paper["questions"]),
            # Copies of practice questions: not counted again in the site's totals.
            "mock": True,
            "minutes": mcfg["minutes"],
        })
        topics = len({q["topic"] for q in paper["questions"]})
        print(f"  wrote {(OUT / (mcfg['name'] + '.json')).relative_to(ROOT)}: {len(paper['questions'])} questions from {topics} topics, {duration(mcfg['minutes'])}")
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + "\n")
    return 0


def duration(minutes: int) -> str:
    h, m = divmod(minutes, 60)
    return " ".join(p for p in (f"{h} h" if h else "", f"{m} min" if m else "") if p)


def build_mock(mcfg: dict, bodies: list[dict]) -> dict:
    """Pick questions across every topic in turn, so the mock covers the whole syllabus."""
    topics: OrderedDict[str, list[dict]] = OrderedDict()
    for body in bodies:
        for paper in body["papers"]:
            if paper["paper_type"] == "Practice":
                topics.setdefault(paper["topic"], []).extend(paper["questions"])
    # A fixed starting point per topic, so the mock is stable from build to build
    # but does not always take each topic's first (usually easiest) question.
    start = {t: int(hashlib.sha1(f"{mcfg['name']}/{t}".encode()).hexdigest(), 16) % len(qs) for t, qs in topics.items()}
    picked: list[tuple[str, dict]] = []
    rnd = 0
    while len(picked) < mcfg["count"] and any(rnd < len(qs) for qs in topics.values()):
        for t, qs in topics.items():
            if rnd < len(qs) and len(picked) < mcfg["count"]:
                picked.append((t, qs[(start[t] + rnd) % len(qs)]))
        rnd += 1
    if len(picked) < mcfg["count"]:
        raise SystemExit(f"{mcfg['name']}: only {len(picked)} questions available, {mcfg['count']} needed")
    name, n, length = mcfg["name"], mcfg["count"], duration(mcfg["minutes"])
    paper = {
        "id": uid(name, "paper", "mock"),
        "topic": None,
        "title": f"{mcfg['subject']} Paper 1 mock exam",
        "paper_type": "Mock",
        "description": (
            f"A timed WASSCE-style {mcfg['subject']} Paper 1: {n} objective questions from across the syllabus, "
            f"in {length}, the time WAEC gives for Paper 1. Every question comes from the WASSCE Tutor practice bank, "
            "with the working and the reason behind every wrong option."
        ),
        "sort_order": MOCK_SORT,
        "questions": [
            {
                **{k: v for k, v in q.items() if k not in ("id", "position", "options")},
                "id": uid(name, "question", q["key"]),
                "topic": t,
                "position": pos,
                "options": [{**o, "id": uid(name, "option", q["key"], str(k))} for k, o in enumerate(q["options"])],
            }
            for pos, (t, q) in enumerate(picked, start=1)
        ],
    }
    body = {"name": name, "label": f"{mcfg['subject']}: timed mock exam, Paper 1", "subject_slug": mcfg["subject_slug"], "papers": [paper]}
    body["version"] = hashlib.sha1(json.dumps(body, sort_keys=True).encode()).hexdigest()[:12]
    return body


if __name__ == "__main__":
    sys.exit(main())
