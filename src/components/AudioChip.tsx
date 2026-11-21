// A play button for a pronunciation or listening clip. Question and lesson
// markdown links to an .mp3 under /audio/ ("[food /fuːd/](https://wasscetutor.com/audio/oral/food.mp3)")
// and the markdown renderers draw this button in its place. An app build from
// before the button existed shows a plain link, which still plays the clip.
//
// The clips are made and checked by scripts/audio/oral_audio.py.
import { Pause, Play, Volume2 } from 'lucide-react'
import { useSyncExternalStore, type ReactNode } from 'react'
import { onClipChange, playingClip, toggleClip } from '@/lib/audio-player'

const AUDIO_HREF = /^(?:https:\/\/wasscetutor\.com)?\/audio\/[\w/-]+\.mp3(?:\?v=\w+)?$/
const isAudioHref = (href: unknown): href is string => typeof href === 'string' && AUDIO_HREF.test(href)

/** Draws an audio link as a play button; any other link as a normal link. */
export function MarkdownLink({ href, children, title }: { href?: string; children?: ReactNode; title?: string }) {
  if (isAudioHref(href)) return <AudioChip src={href}>{children}</AudioChip>
  return (
    <a href={href} title={title}>
      {children}
    </a>
  )
}

export function AudioChip({ src, children }: { src: string; children: ReactNode }) {
  const isPlaying = useSyncExternalStore(onClipChange, () => playingClip() === src, () => false)
  // "Play the passage" is a listening passage: a bigger button with its own label.
  const label = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : ''
  const passage = /^Play\b/.test(label)
  // Screen readers say "Play food", not the phonetic symbols after the word.
  const [spoken, ipa] = label.includes(' /') ? [label.slice(0, label.indexOf(' /')), label.slice(label.indexOf(' /') + 1)] : [label, '']
  const Icon = isPlaying ? Pause : passage ? Play : Volume2
  return (
    <button
      type="button"
      onClick={() => toggleClip(src)}
      // A lesson keeps its prerendered HTML without React (PrerenderedLesson), so the clip is in the markup too.
      data-src={src}
      aria-pressed={isPlaying}
      aria-label={passage ? label : `Play ${spoken}`}
      className={['audio-chip not-prose', passage && 'audio-chip--passage', isPlaying && 'is-playing'].filter(Boolean).join(' ')}
    >
      <span className="audio-chip__icon" aria-hidden>
        <Icon />
      </span>
      <span className="audio-chip__label">
        {ipa ? (
          <>
            {spoken} <span className="audio-chip__ipa">{ipa}</span>
          </>
        ) : (
          children
        )}
      </span>
    </button>
  )
}
