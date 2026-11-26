// The hero's live picture on BeamPad's landing pages (/beampad, /beampad/es):
// a TV whose search box keeps typing what the phone in front of it sends,
// with keys beamed between them (src/components/beampad/Motion.tsx).
// Decorative: the page's text says the same.
import type { CSSProperties } from 'react'
import { PhoneShot } from '@/components/beampad/BeamPad'
import { HeroBeam, TypedSearch } from '@/components/beampad/Motion'

const TV_KEYS = 'abcdefghijklmnopqrstuvwxyz'.split('')

/** searches: what the TV's search box types, in turn (the first is in the static HTML). chip: the label under it. */
export function HeroVisual({ searches, chip, phoneAlt }: { searches: string[]; chip: string; phoneAlt?: string }) {
  return (
    <div data-reveal style={{ '--d': '200ms' } as CSSProperties} className="bp-hero-visual relative mx-auto w-full max-w-[36rem] pt-[8%] pb-[14%] lg:max-w-none">
      <div className="bp-tv" aria-hidden>
        <div className="flex h-full flex-col gap-[6%] p-[6%]">
          <div className="bp-tv-search">
            <svg viewBox="0 0 24 24" className="h-[1.1em] w-[1.1em] shrink-0 text-white/70" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <TypedSearch words={searches} />
            <span className="bp-caret" />
          </div>
          <span className="bp-tv-chip">{chip}</span>
          <div className="bp-tv-keys">
            {TV_KEYS.map((k) => (
              <span key={k} className={k === 'k' ? 'is-focus' : undefined}>
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="bp-tv-stand" aria-hidden />
      <HeroBeam />
      <div className="absolute right-0 bottom-0 w-[31%] max-w-[13.5rem]">
        <PhoneShot name="keyboard" eager sizes="(min-width: 1024px) 216px, 31vw" alt={phoneAlt} />
      </div>
    </div>
  )
}
