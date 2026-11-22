// One practice question as public pages show it: the stem, its diagram, the
// options, then "Show the answer and working" (the answer, the full working
// and why each wrong option is wrong). Used by the questions pages and the
// sample questions on topic pages.
//
// The options are buttons: choosing one shades its bubble, marks it right or
// wrong (with the correct option shown) and opens the answer and working, as
// the homepage's "Try a question" does. "Try again" clears it. The answer is
// folded but always in the HTML, so search engines read it, and the fold
// still opens by itself before the page's script has loaded.
//
// Choosing moves too (index.css, "Answer feedback"): a right answer lifts and
// glows; a wrong one shakes, then the right one glows. No sound. A page that
// totals the score passes onAnswer (the questions pages: QuestionScore).
import { useState } from 'react'
import { CircleCheck, CircleX, Lightbulb, RotateCcw } from 'lucide-react'
import { QuestionMarkdown } from '@/components/QuestionMarkdown'
import { ZoomableImage } from '@/components/ds/ZoomableImage'
import type { PublicQuestion } from '@/lib/public-content'
import { plainText } from '@/lib/question-text'

const sizeFiles = import.meta.glob<Record<string, [number, number]>>('../../content/question-diagram-sizes.json', { eager: true, import: 'default' })
const DIAGRAM_SIZES = Object.values(sizeFiles)[0] ?? {}

/** Width and height of a question diagram, from its path (scripts/questions/diagram-sizes.mjs). */
function diagramSize(url: string): { width?: number; height?: number } {
  const path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0]
  const size = DIAGRAM_SIZES[path]
  return size ? { width: size[0], height: size[1] } : {}
}

const diagramAlt = (q: PublicQuestion, n: number, topic: string) => {
  const stem = plainText(q.stem)
  return `Diagram for ${topic} question ${n}: ${stem.length > 180 ? `${stem.slice(0, stem.lastIndexOf(' ', 180))}…` : stem}`
}

type OptionState = 'open' | 'correct' | 'chosen-wrong' | 'other'

const OPTION_STYLE: Record<OptionState, string> = {
  open: 'border-border bg-card hover:-translate-y-px hover:border-[#d23f6a]/55 hover:shadow-[0_12px_24px_-18px_rgba(91,52,214,.6)]',
  correct: 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/10',
  'chosen-wrong': 'border-rose-500 bg-rose-50/80 dark:bg-rose-500/10',
  other: 'border-border bg-card opacity-55',
}

// The movement each option makes once a choice is made (index.css): the right
// answer chosen pops and glows, a wrong choice shakes, and the right answer
// then glows to show where the mark was.
const MOTION: Record<OptionState | 'reveal', string> = {
  open: '',
  correct: 'answer-correct',
  reveal: 'answer-reveal',
  'chosen-wrong': 'answer-wrong',
  other: '',
}

export function QuestionCard({
  q,
  n,
  topic,
  heading: Heading = 'h2',
  onAnswer,
  initial,
}: {
  q: PublicQuestion
  n: number
  topic: string
  heading?: 'h2' | 'h3'
  /** Called with whether the choice was right, and with null on "Try again". */
  onAnswer?: (right: boolean | null) => void
  /** An answer already chosen elsewhere (an option tapped in an email): shown marked, with the working open. */
  initial?: string
}) {
  const [chosen, setChosen] = useState<string | null>(initial ?? null)
  const [open, setOpen] = useState(!!initial)
  const correct = q.options.find((o) => o.is_correct)
  const right = chosen !== null && chosen === correct?.label

  const choose = (label: string) => {
    if (chosen !== null) return
    setChosen(label)
    setOpen(true)
    onAnswer?.(label === correct?.label)
  }
  const reset = () => {
    setChosen(null)
    setOpen(false)
    onAnswer?.(null)
  }
  const stateOf = (label: string, isCorrect: boolean): OptionState =>
    chosen === null ? 'open' : isCorrect ? 'correct' : label === chosen ? 'chosen-wrong' : 'other'

  return (
    <li id={`q${n}`} className="answer-live site-card scroll-mt-24 p-5 sm:p-6">
      <Heading className="text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">Question {n}</Heading>
      <QuestionMarkdown content={q.stem} className="question-md mt-2 text-[17px] leading-relaxed" />
      {q.image_url && <ZoomableImage src={q.image_url} alt={diagramAlt(q, n, topic)} {...diagramSize(q.image_url)} />}

      <ol className="mt-4 grid gap-2" aria-label={`Options for question ${n}`}>
        {q.options.map((o) => {
          const state = stateOf(o.label, o.is_correct)
          const shaded = chosen === o.label
          return (
            <li key={o.label}>
              <button
                type="button"
                onClick={() => choose(o.label)}
                aria-pressed={shaded}
                aria-disabled={chosen !== null}
                className={`flex w-full items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition ${OPTION_STYLE[state]} ${chosen === null ? 'cursor-pointer' : 'cursor-default'} ${MOTION[state === 'correct' && !shaded ? 'reveal' : state]}`}
              >
                {/* The option's bubble, as on an answer sheet: shaded in pencil when chosen. */}
                <span
                  className={`sheet-bubble mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] text-sm font-bold ${
                    shaded ? 'is-shaded border-[#23202b] text-white' : state === 'correct' ? 'border-emerald-600 text-emerald-700' : 'border-[#d23f6a]/70 text-[#d23f6a]'
                  }`}
                >
                  {o.label}
                </span>
                <QuestionMarkdown content={o.content} inline className="question-md min-w-0 flex-1 pt-0.5" />
                {/* Never colour alone: an icon and words say which option is which. */}
                {state === 'correct' && (
                  <span className="answer-mark mt-1 inline-flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-700">
                    <CircleCheck className="h-4 w-4" aria-hidden /> {shaded ? 'Your answer' : 'Correct'}
                  </span>
                )}
                {state === 'chosen-wrong' && (
                  <span className="answer-mark mt-1 inline-flex shrink-0 items-center gap-1 text-xs font-bold text-rose-700">
                    <CircleX className="h-4 w-4" aria-hidden /> Your answer
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ol>

      <p aria-live="polite" className="sr-only">
        {chosen === null ? '' : right ? `Correct. The answer is ${correct?.label}.` : `Not quite. The answer is ${correct?.label}.`}
      </p>

      <details
        open={open}
        onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
        className={`group mt-4 rounded-xl border ${chosen === null ? 'border-primary/20 bg-brand-soft/40' : right ? 'border-emerald-300 bg-emerald-50/60 dark:bg-emerald-500/10' : 'border-rose-300 bg-rose-50/60 dark:bg-rose-500/10'}`}
      >
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-4 py-3 font-semibold text-primary [&::-webkit-details-marker]:hidden">
          {chosen === null ? (
            <>
              <Lightbulb className="h-4 w-4" aria-hidden /> <span className="group-open:hidden">Show the answer and working</span>
              <span className="hidden group-open:inline">Hide the answer</span>
            </>
          ) : right ? (
            <span className="inline-flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <CircleCheck className="h-4 w-4" aria-hidden /> Correct. Here is the working.
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-rose-800 dark:text-rose-300">
              <CircleX className="h-4 w-4" aria-hidden /> Not quite: the answer is {correct?.label}. Here is why.
            </span>
          )}
        </summary>
        <div className="space-y-3 border-t border-primary/15 px-4 pb-4 pt-3">
          {correct && (
            <div className="flex items-start gap-2 font-semibold text-success">
              <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <span>
                Answer: {correct.label}
                <span className="sr-only">.</span>
              </span>
              <QuestionMarkdown content={correct.content} className="question-md min-w-0 font-semibold" />
            </div>
          )}
          {q.explanation && <QuestionMarkdown content={q.explanation} className="question-md leading-relaxed" />}
          {chosen !== null && (
            <button type="button" onClick={reset} className="site-link text-sm">
              <RotateCcw className="h-4 w-4" aria-hidden /> Try again
            </button>
          )}
        </div>
      </details>
    </li>
  )
}
