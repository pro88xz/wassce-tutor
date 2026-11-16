// "Try a question": the one part of the product a visitor can use before
// signing up. Three questions from the practice bank, marked the moment an
// option is chosen, with the working and the reason the chosen option is
// wrong, which is how every practice set in the product explains its answers.
// Nothing is saved: this is a taste, not a practice set.
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, Check, CircleCheck, CircleX, RotateCcw } from 'lucide-react'
import { SAMPLE_QUESTIONS, type SampleOption } from '@/content/sample-questions'
import { PRACTICE_SUBJECTS_PHRASE, PRACTICE_TOTAL } from '@/lib/practice-counts'
import { Band } from '@/components/public/Section'

type OptionState = 'open' | 'correct' | 'chosen-wrong' | 'other'

const OPTION_STYLE: Record<OptionState, string> = {
  open: 'border-input bg-card hover:border-primary/60 hover:bg-brand-soft/40',
  correct: 'border-success bg-success/10',
  'chosen-wrong': 'border-danger bg-danger/10',
  other: 'border-border bg-card opacity-60',
}

const POINTS = ['Marked the moment you answer', 'Full working for every question', 'The reason each wrong option is wrong']

export function TryQuestion() {
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState<SampleOption['label'] | null>(null)
  const question = SAMPLE_QUESTIONS[index]
  const last = index === SAMPLE_QUESTIONS.length - 1
  const correct = chosen === question.answer
  const chosenOption = question.options.find((o) => o.label === chosen)

  const go = (to: number) => {
    setIndex(to)
    setChosen(null)
  }

  const stateOf = (o: SampleOption): OptionState =>
    chosen === null ? 'open' : o.label === question.answer ? 'correct' : o.label === chosen ? 'chosen-wrong' : 'other'

  return (
    <Band tone="tint" id="try-a-question" labelledBy="try-heading" className="scroll-mt-20">
      <div className="grid items-center gap-9 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div data-reveal>
          <p className="site-eyebrow">Try it now: no account needed</p>
          <h2 id="try-heading" className="site-h2 mt-3">Don&rsquo;t just find out you&rsquo;re wrong. Learn why.</h2>
          <p className="site-lede mt-4">Most practice apps only mark an answer right or wrong. Here every question shows the full working, and each wrong option names the mistake that leads to it, so you fix the habit and not just the question. Answer one now and see.</p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((t) => (
              <li key={t} className="flex gap-3 text-[15px] font-medium">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/12 text-success">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            {PRACTICE_TOTAL.toLocaleString('en')} original questions so far, in {PRACTICE_SUBJECTS_PHRASE}, written by WASSCE Tutor to the syllabus. They are not WAEC past papers.
          </p>
        </div>

        <div data-reveal="1" className="site-card p-5 sm:p-7">
          <p className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs font-bold uppercase tracking-[.12em]">
            <span className="text-primary">
              {question.subject} · {question.topic}
            </span>
            <span className="tabular-nums text-muted-foreground">
              Question {index + 1} of {SAMPLE_QUESTIONS.length}
            </span>
          </p>

          {question.instruction && <p className="mt-4 text-sm text-muted-foreground">{question.instruction}</p>}
          <p id="try-stem" className={`text-lg font-bold leading-snug tracking-tight sm:text-xl ${question.instruction ? 'mt-1.5' : 'mt-4'}`}>
            {question.stem}
          </p>

          <div role="group" aria-labelledby="try-stem" className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {question.options.map((o) => {
              const state = stateOf(o)
              return (
                <button
                  key={`${question.key}-${o.label}`}
                  type="button"
                  onClick={() => chosen === null && setChosen(o.label)}
                  aria-pressed={chosen === o.label}
                  aria-disabled={chosen !== null}
                  className={`flex min-h-13 items-center gap-3 rounded-xl border-2 px-3.5 py-2.5 text-left text-[15px] font-semibold transition-colors ${OPTION_STYLE[state]} ${chosen === null ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${state === 'correct' ? 'bg-success text-white' : state === 'chosen-wrong' ? 'bg-danger text-white' : 'bg-muted text-muted-foreground'}`}>
                    {o.label}
                  </span>
                  <span className="min-w-0 flex-1">{o.text}</span>
                  {/* Never colour alone: an icon and words say which option is which. */}
                  {state === 'correct' && (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-success">
                      <CircleCheck className="h-4 w-4" aria-hidden /> {chosen === o.label ? 'Your answer' : 'Correct answer'}
                    </span>
                  )}
                  {state === 'chosen-wrong' && (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-danger">
                      <CircleX className="h-4 w-4" aria-hidden /> Your answer
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div aria-live="polite" className="mt-5">
            {chosen === null ? (
              <p className="text-sm text-muted-foreground">Choose an answer to see the working.</p>
            ) : (
              <div className="rounded-xl bg-muted/70 p-4 text-[15px] leading-relaxed">
                <p className={`font-bold ${correct ? 'text-success' : 'text-foreground'}`}>
                  {correct ? 'Correct.' : `Not quite. The answer is ${question.answer}.`}
                </p>
                <p className="mt-2">
                  <span className="font-bold">Working. </span>
                  <span className="text-muted-foreground">{question.working}</span>
                </p>
                {!correct && chosenOption?.why && (
                  <p className="mt-2">
                    <span className="font-bold">Why {chosen} is wrong. </span>
                    <span className="text-muted-foreground">{chosenOption.why}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {chosen !== null && (
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              {last ? (
                <>
                  <Link to="/auth" className="site-btn site-btn-primary">
                    Start free to keep practising <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <button type="button" onClick={() => go(0)} className="site-link">
                    <RotateCcw className="h-4 w-4" aria-hidden /> Start again
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => go(index + 1)} className="site-btn site-btn-primary">
                  Next question <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Band>
  )
}
