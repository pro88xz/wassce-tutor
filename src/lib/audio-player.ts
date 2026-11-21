// One audio player for the whole page, shared by the play buttons that React
// renders (AudioChip) and those in a lesson's prerendered HTML, which the page
// wires up itself (PrerenderedLesson): starting a clip stops the one before it.

let player: HTMLAudioElement | null = null
let playing: string | null = null
const listeners = new Set<() => void>()

const setPlaying = (src: string | null) => {
  playing = src
  listeners.forEach((l) => l())
}

/** The clip playing now, if any. */
export const playingClip = () => playing

/** Call `listener` whenever a clip starts or stops; returns the unsubscribe function. */
export function onClipChange(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Play `src`, or stop it if it is the clip already playing. */
export function toggleClip(src: string) {
  if (!player) {
    player = new Audio()
    player.preload = 'auto'
    player.addEventListener('ended', () => setPlaying(null))
    // Media events arrive late: the pause of the clip being replaced must not
    // clear the clip that has just started.
    player.addEventListener('pause', () => player?.paused && setPlaying(null))
    player.addEventListener('error', () => setPlaying(null))
  }
  if (playing === src) {
    player.pause()
    return
  }
  player.pause()
  player.src = src
  setPlaying(src)
  // A play cut short by the next clip fails too; only a failure of this clip clears it.
  player.play().catch(() => playing === src && setPlaying(null))
}
