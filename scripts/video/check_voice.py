#!/usr/bin/env python3
"""Listen back to every spoken line of a video and flag the ones that come out wrong.

    python3 scripts/video/check_voice.py content/videos/biology-cell-structure.py

Each line is spoken exactly as the video speaks it (the same cached audio), then
transcribed by a speech recogniser (Whisper small.en, as the oral English audio
uses: scripts/audio/README.md). A line whose words do not come back, allowing
for one slip in twenty, is listed with what was heard, so it can be reworded
before the video is published. Exit status 1 if any line fails.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE.parent / "audio"))

import board_video as bv  # noqa: E402
from oral_audio import MODELS, RATE, THREADS, reference, wer, words_of  # noqa: E402

MAX_WER = 0.05
# Words a recogniser writes differently from the narration but which were said
# right: compared after this spelling is applied to both sides.
SAME = {"haemoglobin": "hemoglobin", "specialised": "specialized", "amoeba": "ameba", "metres": "meters",
        "metre": "meter", "sin": "sine", "kilometre": "kilometer", "kilometres": "kilometers", "centimetre": "centimeter",
        "centimetres": "centimeters", "millimetre": "millimeter", "millimetres": "millimeters",
        "centre": "center", "colour": "color", "fibre": "fiber", "favour": "favor", "programme": "program",
        "organisation": "organization",
        # homophones and rare names the recogniser spells its own way
        "maize": "maze", "mays": "maze", "zea": "zia", "protoctista": "protoctyster",
        "mesophyll": "messiful", "coloured": "colored", "fertilisation": "fertilization",
        "fertilised": "fertilized", "radicle": "radical", "plumule": "plumeule", "anaemia": "anemia",
        "goitre": "goiter", "oedema": "edema", "faeces": "feces", "oesophagus": "esophagus", "route": "root"}


DIGITS = "zero one two three four five six seven eight nine".split()
# Symbols and units the recogniser writes for words the narration says.
SYMBOLS = [("km/h", " kilometres per hour "), ("m/s", " metres per second "), ("λ", " lambda "), ("×", " times "), ("÷", " divided by "), ("=", " equals "), ("%", " percent "),
           ("MHz", " megahertz "), ("kHz", " kilohertz "), ("Hz", " hertz "), ("°C", " degrees celsius ")]


UNITS = {"cm": "centimetre", "mm": "millimetre", "km": "kilometre", "kg": "kilogram", "m": "metre", "g": "gram",
         "N": "newton", "s": "second", "J": "joule", "W": "watt"}


def spoken(heard: str) -> str:
    """What the recogniser wrote, back in the words that were said: "3.06" is
    "three point zero six", "1.5 Hz" is "one point five hertz", "λ" is "lambda"."""
    for sym, words in SYMBOLS:
        heard = heard.replace(sym, words)
    heard = re.sub(r"(?<=\d)\s*[xX]\s*(?=\d)", " times ", heard)
    heard = re.sub(r"(?<=\d),(?=\d{3}\b)", "", heard)   # 72,000 is seventy-two thousand
    heard = re.sub(r"(?<=\d)\s*/\s*(?=\d)", " over ", heard)   # 1/50 is one over fifty
    # cm3 is cubic centimetres ("per cm3" is per cubic centimetre)
    heard = re.sub(r"\bper\s+cm(?:3|³)", "per cubic centimetre", heard)
    heard = re.sub(r"(\d+(?:\.\d+)?)\s*cm(?:3|³)",
                   lambda m: f"{m.group(1)} cubic centimetre{'' if m.group(1) == '1' else 's'}", heard)
    # signs: "+10" is "plus ten", "-5.2" is "minus five point two", "12 - 5" is "twelve minus five"
    heard = re.sub(r"(?<![\w.])\+(?=\d)", " plus ", heard)
    heard = re.sub(r"(?<![\w.])-(?=\d)", " minus ", heard)
    heard = re.sub(r"(?<=\d)\s+\+\s+(?=\d)", " plus ", heard)
    heard = re.sub(r"(?<=\d)\s+-\s+(?=\d)", " minus ", heard)
    # a number with a unit's symbol ("10N", "4.5 cm") is the unit's name, singular after 1
    heard = re.sub(r"(\d+(?:\.\d+)?)\s*(cm|mm|km|kg|m|g|N|s|J|W)\b",
                   lambda m: f"{m.group(1)} {UNITS[m.group(2)]}{'' if m.group(1) == '1' else 's'}", heard)
    return re.sub(r"(\d+)\.(\d+)", lambda m: f"{m.group(1)} point {' '.join(DIGITS[int(d)] for d in m.group(2))}", heard)


NUMBER = {w: (i, "unit") for i, w in enumerate(DIGITS)}
NUMBER |= {w: (i + 10, "teen") for i, w in enumerate(
    "ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split())}
NUMBER |= {w: ((i + 2) * 10, "tens") for i, w in enumerate("twenty thirty forty fifty sixty seventy eighty ninety".split())}
SCALE = {"hundred": 100, "thousand": 1000, "million": 10**6}


def _values(run: list[str]) -> list[str]:
    """One run of number words as the numbers it says: "three four seven" (digits
    one by one) is 347, "fifteen hundred" is 1500, "two thousand and five" is 2005."""
    if len(run) > 1 and all(NUMBER.get(w, (0, ""))[1] == "unit" for w in run):
        return ["#" + "".join(str(NUMBER[w][0]) for w in run)]
    out, total, cur, last = [], 0, 0, None
    for w in run:
        if w in SCALE:
            if SCALE[w] == 100:
                cur = (cur or 1) * 100
            else:
                total, cur = total + (cur or 1) * SCALE[w], 0
            last = "scale"
            continue
        v, kind = NUMBER[w]
        if last in ("unit", "teen") or (last == "tens" and kind != "unit"):   # a new number starts
            out.append(total + cur)
            total, cur = 0, 0
        cur, last = cur + v, kind
    return [f"#{n}" for n in out + [total + cur]]


def numbers(words: list[str]) -> list[str]:
    """Number words as values, so "347" heard for "three four seven", or "1500" for
    "fifteen hundred", is the same number said another way. A wrong number still differs."""
    out, i = [], 0
    while i < len(words):
        if words[i] not in NUMBER and words[i] not in SCALE:
            out.append(words[i])
            i += 1
            continue
        run = []
        while i < len(words):
            w = words[i]
            if w in NUMBER or w in SCALE:
                run.append(w)
            elif not (w == "and" and run and run[-1] in SCALE and i + 1 < len(words) and words[i + 1] in NUMBER):
                break
            i += 1
        out += _values(run)
    return out


def joined(words: list[str]) -> list[str]:
    """Runs of short words joined into one: letters said one by one ("M L T",
    "D N A", "k x") come back from the recogniser written together ("MLT").
    Applied to both sides, it changes only spacing: a wrong or missing word in
    a run still makes the run differ."""
    out, run = [], ""
    for w in words:
        if len(w) <= 3:
            run += w
            continue
        if run:
            out.append(run)
            run = ""
        out.append(w)
    return out + ([run] if run else [])


def norm(words: list[str]) -> list[str]:
    # compounds the recogniser writes as one word ("by-product" as "byproduct")
    text = " ".join(SAME.get(w, w) for w in words)
    for split, joined in (("by product", "byproduct"), ("s i", "si"), ("blood stream", "bloodstream"), ("well being", "wellbeing"),
                          ("ground nuts", "groundnuts"), ("under water", "underwater")):
        text = f" {text} ".replace(f" {split} ", f" {joined} ").strip()
    # scientific words the recogniser spells by their sound (said correctly)
    for heard, word in (("flow m", "phloem"), ("floem", "phloem"), ("flowem", "phloem"), ("micro pill", "micropyle"),
                       ("a glutenation", "agglutination"), ("rarer factions", "rarefactions"), ("rare factions", "rarefactions"), ("atagrin", "at tagrin"), ("resa", "rhesus"), ("resa's", "rhesus"), ("abo", "a b o"), ("ab", "a b")):
        text = f" {text} ".replace(f" {heard} ", f" {word} ").strip()
    return numbers(text.split())


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("lesson", type=Path)
    args = ap.parse_args()
    import sherpa_onnx
    w = MODELS / "asr/sherpa-onnx-whisper-small.en/small.en"
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=f"{w}-encoder.onnx", decoder=f"{w}-decoder.onnx", tokens=f"{w}-tokens.txt",
        language="en", task="transcribe", num_threads=THREADS)
    voice = bv.Voice()
    lesson = bv.load(args.lesson)
    failed = 0
    lines = [s.say for s in lesson.STEPS if s.say]
    for i, say in enumerate(lines, 1):
        audio = voice(say)
        pad = np.zeros(int(RATE * 0.5), np.float32)
        x = np.concatenate([pad, audio, pad])
        # the recogniser listens at 16 kHz
        x16 = np.interp(np.arange(0, len(x), RATE / 16000), np.arange(len(x)), x).astype(np.float32)
        s = rec.create_stream()
        s.accept_waveform(16000, x16)
        rec.decode_stream(s)
        heard = s.result.text.strip()
        said, got = norm(reference(say)), norm(words_of(spoken(heard)))
        score = min(wer(said, got), wer(joined(said), joined(got)))
        ok = score <= MAX_WER
        failed += not ok
        print(f"{'ok ' if ok else 'BAD'} {i:2d}/{len(lines)}  {score:4.0%}  {say[:70]}")
        if not ok:
            print(f"         heard: {heard}")
    print(f"{len(lines) - failed} of {len(lines)} lines heard as written")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
