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
        "centre": "center", "colour": "color", "fibre": "fiber", "favour": "favor", "programme": "program",
        "organisation": "organization",
        # homophones and rare names the recogniser spells its own way
        "maize": "maze", "mays": "maze", "zea": "zia", "protoctista": "protoctyster",
        "mesophyll": "messiful", "coloured": "colored", "fertilisation": "fertilization",
        "fertilised": "fertilized", "radicle": "radical", "plumule": "plumeule", "anaemia": "anemia",
        "goitre": "goiter", "oedema": "edema", "faeces": "feces", "oesophagus": "esophagus"}


def norm(words: list[str]) -> list[str]:
    # compounds the recogniser writes as one word ("by-product" as "byproduct")
    text = " ".join(SAME.get(w, w) for w in words)
    for split, joined in (("by product", "byproduct"), ("blood stream", "bloodstream"), ("well being", "wellbeing"),
                          ("ground nuts", "groundnuts")):
        text = f" {text} ".replace(f" {split} ", f" {joined} ").strip()
    # scientific words the recogniser spells by their sound (said correctly)
    for heard, word in (("flow m", "phloem"), ("floem", "phloem"), ("flowem", "phloem"), ("micro pill", "micropyle"),
                       ("a glutenation", "agglutination"), ("resa", "rhesus"), ("resa's", "rhesus"), ("abo", "a b o"), ("ab", "a b")):
        text = f" {text} ".replace(f" {heard} ", f" {word} ").strip()
    return text.split()


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
        score = wer(norm(reference(say)), norm(words_of(heard)))
        ok = score <= MAX_WER
        failed += not ok
        print(f"{'ok ' if ok else 'BAD'} {i:2d}/{len(lines)}  {score:4.0%}  {say[:70]}")
        if not ok:
            print(f"         heard: {heard}")
    print(f"{len(lines) - failed} of {len(lines)} lines heard as written")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
