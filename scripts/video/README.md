# Chalkboard video lessons

A narrated chalkboard: the teacher's voice explains while the chalk writes, draws
and wipes the board in step with it. Videos are made here, offline and free, from a
short lesson script; nothing is generated on the live site.

## What makes a video

- **The script**: `content/videos/<slug>.py`. A list of `STEPS`; each step is one
  thing the teacher says and what they draw while saying it:

  ```python
  step("The wavelength, lambda, is the distance from one crest to the next crest.",
       double_arrow(180, 258, 470, 258, "green"),
       write("λ", 316, 244, 32, "green"))
  ```

  The board is 1280 × 720 px, with (0, 0) at the top left. You can draw with:
  `write` (chalk writing; `10^8` raises, `v_1` lowers), `frac`, `line`, `arrow`,
  `double_arrow`, `dashed`, `wave`, `box`, `underline`, `ring` and `clear` (the duster).
  Chalk colours: white, yellow, blue, pink, green, grey. Writing that would run off
  the board stops the build.
- **The voice**: the oral English voice (`scripts/audio`): Kokoro `bf_emma`, speaking
  from the phonemes of misaki's British dictionary. A word that is not in the
  dictionary stops the build, so the voice never guesses a word from its spelling.
  Write numbers in the narration as words ("ninety-eight megahertz"), and the symbol
  *a* as a capital ("The amplitude, A, is…"): a small "a" is read as the article, "uh".
- **The chalk**: single-stroke Hershey letters, so the writing appears stroke by
  stroke, as a hand writes. Each step's drawing is paced to end with its speech; if
  it cannot (at up to twice the usual writing pace), the voice waits for it.

## Building

The voice models and packages in `scripts/audio/README.md`, then:

```bash
pip install Hershey-Fonts pycairo
```

```bash
python3 scripts/video/board_video.py content/videos/physics-waves-1.py
```

This writes `public/video/physics-waves-1.mp4` (H.264 and AAC, 1280 × 720, 25 fps,
about 1.2 MB a minute) and `physics-waves-1.vtt` (captions). `--out` writes elsewhere;
`--until 20` renders the first 20 seconds only, for checking a layout. Spoken lines are
cached in `~/.cache/wassce-video`, so a rebuild after a layout change takes about a minute.
