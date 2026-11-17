// The homepage's signature: a WASSCE-style answer sheet, the page every
// candidate knows (rows of A B C D bubbles shaded in pencil, timing marks
// down the edge). Five real questions from the bank (src/content/answer-sheet)
// are shaded one by one by a pencil; each answer is ticked, the working
// appears in the margin in blue pen, and the score climbs to a red A1 stamp.
//
// Progressive: the prerendered HTML (and visitors who prefer reduced motion,
// or have no JavaScript) get the finished, marked sheet. In the browser the
// finished sheet holds for a moment, then clears and fills again, only while
// it is on screen and the tab is visible.
import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { ANSWER_SHEET } from '@/content/answer-sheet'

const LETTERS = ['A', 'B', 'C', 'D'] as const
const N = ANSWER_SHEET.length
/** One beat: the pencil moves on even beats and shades on odd ones (longer than its 0.62 s glide). */
const BEAT_MS = 760
/** Beats the finished sheet stays up before it is cleared. */
const HOLD = 7
const COMPLETE = 2 * N

export function AnswerSheet() {
  // beat 0..2N-1: filling; 2N..2N+HOLD: finished. Starts finished (prerender, no-JS).
  const [beat, setBeat] = useState(COMPLETE)
  const [animating, setAnimating] = useState(false)
  const [pencil, setPencil] = useState<{ x: number; y: number } | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const bubbles = useRef<(HTMLSpanElement | null)[]>([])

  const done = beat >= COMPLETE ? N : Math.floor(beat / 2) + (beat % 2)
  const complete = beat >= COMPLETE
  const target = animating && !complete ? Math.floor(beat / 2) : null
  const shading = animating && !complete && beat % 2 === 1
  const note = ANSWER_SHEET[Math.max(0, done - 1)]

  // Run only on screen, in a visible tab, and when motion is welcome.
  useEffect(() => {
    const el = root.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let visible = false
    const sync = () => setAnimating(visible && document.visibilityState === 'visible')
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      sync()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', sync)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  useEffect(() => {
    if (!animating) return
    const t = window.setTimeout(() => setBeat((b) => (b >= COMPLETE + HOLD ? 0 : b + 1)), beat === 0 ? 900 : BEAT_MS)
    return () => window.clearTimeout(t)
  }, [animating, beat])

  // Put the pencil's tip on the bubble it is about to shade.
  useEffect(() => {
    if (target === null || !root.current) return setPencil(null)
    const q = ANSWER_SHEET[target]
    const b = bubbles.current[target * 4 + LETTERS.indexOf(q.answer)]
    if (!b) return
    // Layout offsets, not screen rectangles: the sheet may be tilted in 3D by the hero.
    let x = b.offsetWidth / 2
    let y = b.offsetHeight / 2
    for (let n: HTMLElement | null = b; n && n !== root.current; n = n.offsetParent as HTMLElement | null) {
      x += n.offsetLeft
      y += n.offsetTop
    }
    setPencil({ x, y })
  }, [target])

  return (
    <div ref={root} className="answer-sheet relative">
      <figure className="relative overflow-hidden rounded-[22px] bg-[#fdfaf3] p-4 pl-7 text-[#2a2333] shadow-[0_2px_4px_rgba(23,28,43,.06),0_40px_80px_-36px_rgba(30,20,80,.55)] ring-1 ring-[#2a2333]/[0.06] sm:p-6 sm:pl-9">
        <figcaption className="sr-only">
          A WASSCE-style answer sheet with five questions from the practice bank, each shaded with its correct answer:{' '}
          {ANSWER_SHEET.map((q) => `${q.stem} ${q.answer}: ${q.options[LETTERS.indexOf(q.answer)]}.`).join(' ')}
        </figcaption>

        {/* Timing marks down the edge, as on a machine-read answer sheet. */}
        <span aria-hidden className="absolute inset-y-6 left-2.5 flex flex-col justify-between sm:left-3.5">
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i} className="h-1.5 w-2.5 rounded-[1px] bg-[#2a2333]/80" />
          ))}
        </span>

        <div aria-hidden>
          <div className="flex items-start justify-between gap-4 border-b-2 border-dashed border-[#d23f6a]/35 pb-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#d23f6a]">
                <span className="hidden sm:inline">Objective test · </span>Answer sheet
              </p>
              <p className="mt-0.5 text-[15px] font-extrabold tracking-tight sm:text-base">WASSCE Tutor practice</p>
            </div>
            {/* The stamp takes the score box's place once the sheet is marked. */}
            <div className={`shrink-0 rounded-lg border border-[#d23f6a]/40 px-3 py-1 text-right transition-opacity duration-300 ${complete ? 'opacity-0' : ''}`}>
              <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#d23f6a]">Score</p>
              <p className="text-lg font-extrabold leading-tight tabular-nums">
                {done}
                <span className="text-[#2a2333]/40">/{N}</span>
              </p>
            </div>
          </div>

          <ol className="divide-y divide-dashed divide-[#d23f6a]/25">
            {ANSWER_SHEET.map((q, row) => {
              const shaded = row < done
              const answer = LETTERS.indexOf(q.answer)
              return (
                <li key={q.key} className="grid grid-cols-[1.4rem_minmax(0,1fr)] gap-x-2.5 py-2.5 sm:grid-cols-[1.6rem_minmax(0,1fr)] sm:py-3">
                  <span className="pt-[15px] text-[13px] font-extrabold tabular-nums text-[#d23f6a]">{row + 1}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#2a2333]/50">{q.subject}</p>
                    <p className="truncate text-[13px] font-semibold leading-snug sm:text-[13.5px]">{q.stem}</p>
                    <div className="mt-2 flex items-center gap-1.5 sm:gap-2">
                      {LETTERS.map((l, i) => {
                        const filled = shaded && i === answer
                        return (
                          <span
                            key={l}
                            ref={(el) => {
                              bubbles.current[row * 4 + i] = el
                            }}
                            className={`sheet-bubble flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-[1.5px] text-[10.5px] font-bold ${
                              filled ? 'is-shaded border-[#23202b] text-transparent' : 'border-[#d23f6a]/70 text-[#d23f6a]'
                            }`}
                          >
                            {l}
                          </span>
                        )
                      })}
                      <span
                        className={`ml-1.5 inline-flex min-w-0 items-center gap-1 text-[12.5px] font-semibold text-emerald-700 transition-all duration-500 ${
                          shaded ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />
                        <span className="truncate">{q.options[answer]}</span>
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>

          {/* The working, in blue pen in the margin, for the answer just shaded. */}
          <div className="mt-1 border-t-2 border-dashed border-[#d23f6a]/35 pt-3">
            <p key={note.key} className="sheet-note line-clamp-3 h-[4.1rem] text-[15px] leading-snug text-[#2747b8] sm:h-[4.3rem] sm:text-base">
              <span className="font-serif-display">Why {note.answer}?</span> <span className="font-serif-display">{note.working}</span>
            </p>
          </div>
        </div>

        {/* The marker's stamp once every answer is in. */}
        <span
          aria-hidden
          className={`sheet-stamp pointer-events-none absolute right-2 top-1.5 flex h-[5.25rem] w-[5.25rem] flex-col items-center justify-center rounded-full border-[3px] border-[#d1263b] bg-[#fdfaf3]/40 text-[#d1263b] sm:right-3 sm:top-2 sm:h-24 sm:w-24 ${
            complete ? 'is-on' : ''
          }`}
        >
          <span className="font-serif-display text-[2.5rem] leading-none sm:text-[2.9rem]">A1</span>
          <span className="mt-0.5 text-[11px] font-extrabold tabular-nums tracking-[.08em]">
            {N}/{N}
          </span>
        </span>
      </figure>

      {/* The pencil, its tip on the bubble being shaded. */}
      <svg
        aria-hidden
        viewBox="0 0 84 16"
        width="84"
        height="16"
        className={`sheet-pencil pointer-events-none absolute left-0 top-0 z-20 ${pencil ? 'opacity-100' : 'opacity-0'} ${shading ? 'is-scribbling' : ''}`}
        style={pencil ? { transform: `translate(${pencil.x}px, ${pencil.y - 8}px) rotate(-48deg)` } : undefined}
      >
        <polygon points="0,8 6,5.6 6,10.4" fill="#2b2930" />
        <polygon points="6,5.6 16,2 16,14 6,10.4" fill="#e9c49a" />
        <rect x="16" y="2" width="49" height="12" fill="#f3b229" />
        <rect x="16" y="6.2" width="49" height="3.6" fill="#f8cb5a" />
        <rect x="16" y="2" width="49" height="1.3" fill="#d4951a" />
        <rect x="65" y="2" width="7" height="12" fill="#c7ccd5" />
        <rect x="67" y="2" width="1" height="12" fill="#9aa1ad" />
        <rect x="69.5" y="2" width="1" height="12" fill="#9aa1ad" />
        <rect x="72" y="2" width="11" height="12" rx="2.5" fill="#ef86a5" />
      </svg>
    </div>
  )
}
