// Motion for BeamPad's pages: a live background, the hero's "beam" of
// keystrokes from the phone to the TV, a TV search that keeps typing, and
// sections that rise in as they are scrolled to.
//
// Rules it keeps:
//  - The prerendered HTML is complete and still: everything is visible
//    without JavaScript, and motion only starts after hydration.
//  - Only transform and opacity animate (no layout, no repaint per frame).
//  - Nothing moves for people who ask their system for reduced motion.
import { useEffect, useRef, useState } from 'react'

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Turns motion on for the page it is placed in (the `.bp` root): scroll
 * reveals for [data-reveal] elements, and the light that follows the pointer
 * over cards. Renders nothing.
 */
export function BeamPadMotion() {
  const marker = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>('.bp')
    if (!root || reducedMotion()) return
    root.classList.add('bp-motion')

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))

    // Card spotlight: the card under the pointer gets its position as CSS variables.
    let frame = 0
    const onMove = (ev: PointerEvent) => {
      if (ev.pointerType !== 'mouse' || frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const card = (ev.target as Element | null)?.closest?.<HTMLElement>('.bp-card')
        if (!card) return
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', `${ev.clientX - r.left}px`)
        card.style.setProperty('--my', `${ev.clientY - r.top}px`)
      })
    }
    root.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      io.disconnect()
      root.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
      root.classList.remove('bp-motion')
    }
  }, [])
  return <span ref={marker} hidden />
}

/** The page's living background: slow drifting light behind everything. */
export function Aurora() {
  return (
    <div className="bp-aurora" aria-hidden>
      <span />
      <span />
      <span />
    </div>
  )
}

/**
 * What the TV's search box shows: the first search in the static HTML, then
 * (after hydration) searches being typed and cleared, as if from the phone.
 */
export function TypedSearch({ words }: { words: string[] }) {
  const [text, setText] = useState(words[0])
  useEffect(() => {
    if (reducedMotion()) return
    let i = 0
    let pos = words[0].length
    let deleting = true
    let timer = 0
    const tick = () => {
      const word = words[i]
      if (deleting) {
        pos -= 1
        setText(word.slice(0, pos))
        if (pos === 0) {
          deleting = false
          i = (i + 1) % words.length
          timer = window.setTimeout(tick, 380)
        } else timer = window.setTimeout(tick, 38)
        return
      }
      const next = words[i]
      pos += 1
      setText(next.slice(0, pos))
      if (pos === next.length) {
        deleting = true
        timer = window.setTimeout(tick, 2800)
      } else timer = window.setTimeout(tick, 65 + Math.random() * 75)
    }
    timer = window.setTimeout(tick, 3400)
    return () => window.clearTimeout(timer)
  }, [words])
  return <span className="bp-typed">{text}</span>
}

const BEAM_PATH = 'M75 31 C 70 6, 57 3, 47 18'
const CHIPS = ['k', '⏎', 'a', 'S', '⌫', 'o']
const CYCLE = 6.6 // seconds for one chip's turn; one chip leaves the phone every CYCLE / CHIPS.length

/**
 * The hero's beam: a flowing line from the phone to the TV's search box, with
 * keys travelling along it, and Bluetooth pulses around the phone. Drawn in a
 * box whose units are percent of the hero visual's width (it sits behind the
 * phone and in front of the TV). Decorative; hidden for reduced motion.
 */
export function HeroBeam() {
  return (
    <svg className="bp-beam" viewBox="0 0 100 80" aria-hidden focusable="false">
      <defs>
        <linearGradient id="bp-beam-gradient" x1="75" y1="31" x2="47" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8b7aff" />
          <stop offset="1" stopColor="#46f0c2" />
        </linearGradient>
        <path id="bp-beam-path" d={BEAM_PATH} />
      </defs>
      <g className="bp-beam-pulses">
        {[0, 1, 2].map((n) => (
          <circle key={n} cx="84.5" cy="34" r="10" fill="none" stroke="#8b7aff" strokeWidth="0.35" style={{ animationDelay: `${n * 1.3}s` }} />
        ))}
      </g>
      <use href="#bp-beam-path" className="bp-beam-glow" stroke="url(#bp-beam-gradient)" />
      <use href="#bp-beam-path" className="bp-beam-line" stroke="url(#bp-beam-gradient)" />
      {CHIPS.map((c, i) => {
        const begin = `${((i * CYCLE) / CHIPS.length).toFixed(2)}s`
        return (
          <g key={i} opacity="0">
            <g>
              <rect x="-2.7" y="-2.7" width="5.4" height="5.4" rx="1.3" fill="#1c1748" stroke="#8b7aff" strokeOpacity="0.75" strokeWidth="0.25" />
              <text x="0" y="1.05" textAnchor="middle" fontSize="2.9" fontWeight="600" fill="#ffffff">
                {c}
              </text>
              <animateTransform attributeName="transform" type="scale" values="1;1;0.45;0.45" keyTimes="0;0.24;0.4;1" dur={`${CYCLE}s`} begin={begin} repeatCount="indefinite" />
            </g>
            <animateMotion dur={`${CYCLE}s`} begin={begin} repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.4;1" calcMode="spline" keySplines="0.45 0 0.25 1;0 0 1 1">
              <mpath href="#bp-beam-path" />
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.05;0.32;0.4;1" dur={`${CYCLE}s`} begin={begin} repeatCount="indefinite" />
          </g>
        )
      })}
    </svg>
  )
}
