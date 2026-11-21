# Oral English audio

The pronunciation and listening clips on the oral English questions are made here,
offline and free, and committed as MP3 files in `public/audio/oral/`. Nothing is
generated on the live site.

## What makes a clip

- **The words**: set by an editor in `content/questions/english-language/set5_p1.py`.
  `word("food", "fuːd")` adds a word, with the editor's RP transcription, to a
  question's **Listen** row (shown with the explanation, so it never gives the answer
  away). `passage=[("Man", "..."), ("Woman", "...")]` makes a listening question read
  its passage aloud, with a play button above the text.
- **The voice**: [Kokoro](https://github.com/hexgrad/kokoro) (82M, Apache 2.0, 2025),
  run with [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx). Words and the
  narrator use its British female voice `bf_emma`; men in dialogues use `bm_george`.
- **The pronunciation**: phonemes from the British dictionary of
  [misaki](https://github.com/hexgrad/misaki) (Apache 2.0), the lexicon Kokoro was
  trained with. The voice is never left to guess a word from its spelling.
- **The checks**: `oral_audio.py` describes them. In short, the dictionary must agree
  with the editor's transcription; two speech recognisers, Whisper small.en (MIT) and
  NVIDIA Parakeet TDT 0.6B v2 (CC BY 4.0), must hear each clip back correctly; and
  every clip is trimmed and levelled the same way. A clip that fails is not linked.
  The result for every clip is in `content/questions/english-language/AUDIO.md`.

## Rebuilding

One-time setup (about 1.2 GB of models, all from GitHub releases):

```bash
pip install kokoro-onnx misaki sherpa-onnx soundfile spacy && pip install --no-deps num2words
```

```bash
python3 -m spacy download en_core_web_sm
```

```bash
mkdir -p ~/.cache/wassce-audio/kokoro ~/.cache/wassce-audio/asr && cd ~/.cache/wassce-audio
```

```bash
for f in kokoro-v1.0.onnx voices-v1.0.bin; do curl -L -o kokoro/$f https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f; done
```

```bash
for m in sherpa-onnx-whisper-small.en sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8; do curl -L https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/$m.tar.bz2 | tar xj -C asr; done
```

ffmpeg (with libmp3lame) must be installed. Set `WASSCE_AUDIO_MODELS` to use another
folder.

Then, from the repository root, build the clips and the questions that link to them:

```bash
python3 scripts/audio/oral_audio.py && python3 scripts/questions/build.py
```

Only new or changed clips are rebuilt (`oral-audio.lock.json` records what each was
made from); `--force` rebuilds all of them and `--only food shoe` rebuilds those.
Each link carries a hash of its file (`food.mp3?v=…`), so a rebuilt clip is never
served from an old cache.

## Adding audio to a lesson

The play button works in lessons too: any markdown link to an `.mp3` under `/audio/`
is drawn as one (`src/components/AudioChip.tsx`). Link to a clip that has passed the
checks, with its hash from `audio_manifest.json`.
