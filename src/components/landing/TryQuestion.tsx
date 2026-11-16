// "Try a question": the one part of the product a visitor can use before
// signing up. Three questions from the practice bank, marked the moment an
// option is chosen, with the working and the reason the chosen option is
// wrong, which is how every practice set in the product explains its answers.
// Nothing is saved: this is a taste, not a practice set.
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, CircleCheck, CircleX, Lightbulb, ListChecks, RotateCcw, Zap } from 'lucide-react'
import { SAMPLE_QUESTIONS, type SampleOption } from '@/content/sample-questions'
import { PRACTICE_SUBJECTS_PHRASE, PRACTICE_TOTAL } from '@/lib/practice-counts'

type OptionState = 'open' | 'correct' | 'chosen-wrong' | 'other'

const OPTION_STYLE: Record<OptionState, string> = {
  open: 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-violet-500 hover:shadow-[0_12px_24px_-16px_rgba(91,52,214,.6)]',
  correct: 'border-emerald-500 bg-emerald-50',
  'chosen-wrong': 'border-rose-500 bg-rose-50',
  other: 'border-slate-200 bg-white opacity-55',
}

/** What the card does, shown beside it. */
const FEATURES = [
  { Icon: Zap, text: 'Marked instantly' },
  { Icon: Lightbulb, text: 'Every wrong answer explained' },
  { Icon: ListChecks, text: 'Full working shown' },
]

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
    <section id="try-a-question" aria-labelledby="try-heading" className="site-band relative isolate scroll-mt-20 overflow-hidden">
      <div className="site-container grid items-center gap-8 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div data-reveal className="max-w-2xl lg:max-w-lg">
          <p className="site-eyebrow">Try it: no account needed</p>
          <h2 id="try-heading" className="site-h2 mt-3">
            Every answer <span className="relative whitespace-nowrap"><span className="relative z-10">explained.</span><span aria-hidden className="absolute inset-x-0 bottom-1 h-3 rounded-sm bg-[#ffd166]/70 sm:h-3.5" /></span>
          </h2>
          <p className="site-lede mt-4">Pick an answer and see why it is right or wrong.</p>
          <ul className="mt-6 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-1">
            {FEATURES.map(({ Icon, text }) => (
              <li key={text} className="site-card flex flex-col items-start gap-2 p-3 text-[13px] font-semibold leading-snug sm:text-[15px] lg:flex-row lg:items-center lg:gap-3 lg:px-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--primary)]"><Icon className="h-[18px] w-[18px]" aria-hidden /></span>
                {text}
              </li>
            ))}
          </ul>
          <p className="mt-5 hidden text-sm text-muted-foreground lg:block">
            {PRACTICE_TOTAL.toLocaleString('en')} original questions in {PRACTICE_SUBJECTS_PHRASE}, written to the syllabus. Not WAEC past papers.
          </p>
        </div>

        <div data-reveal="1" className="relative">
          <span aria-hidden className="absolute -right-3 -top-3 -z-10 h-[92%] w-[92%] rounded-[2rem] bg-gradient-to-br from-[#7c4dff] to-[#4a25c4] sm:-right-5 sm:-top-5" />
          <span aria-hidden className="absolute -bottom-4 -left-4 -z-10 h-16 w-16 rounded-full bg-[#ffd166] sm:h-20 sm:w-20" />
          <div className="rounded-[1.75rem] bg-white p-5 text-slate-900 ring-1 ring-slate-900/5 shadow-[0_30px_60px_-28px_rgba(30,20,80,.5)] sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-800 ring-1 ring-violet-100">
                <span className="h-2 w-2 rounded-full bg-violet-600" aria-hidden />
                {question.subject} · {question.topic}
              </span>
              <span className="flex items-center gap-1.5" role="img" aria-label={`Question ${index + 1} of ${SAMPLE_QUESTIONS.length}`}>
                {SAMPLE_QUESTIONS.map((q, i) => (
                  <span key={q.key} className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-violet-600' : i < index ? 'w-2 bg-violet-300' : 'w-2 bg-slate-200'}`} />
                ))}
              </span>
            </div>

            {question.instruction && <p className="mt-5 text-sm text-slate-500">{question.instruction}</p>}
            <p id="try-stem" className={`text-xl font-bold leading-snug tracking-tight sm:text-2xl ${question.instruction ? 'mt-1.5' : 'mt-5'}`}>
              {question.stem}
            </p>

            <div role="group" aria-labelledby="try-stem" className="mt-6 grid gap-3 sm:grid-cols-2">
              {question.options.map((o) => {
                const state = stateOf(o)
                return (
                  <button
                    key={`${question.key}-${o.label}`}
                    type="button"
                    onClick={() => chosen === null && setChosen(o.label)}
                    aria-pressed={chosen === o.label}
                    aria-disabled={chosen !== null}
                    className={`flex min-h-[3.75rem] items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-[17px] font-semibold transition ${OPTION_STYLE[state]} ${chosen === null ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${state === 'correct' ? 'bg-emerald-600 text-white' : state === 'chosen-wrong' ? 'bg-rose-600 text-white' : 'bg-violet-100 text-violet-800'}`}>
                      {o.label}
                    </span>
                    <span className="min-w-0 flex-1">{o.text}</span>
                    {/* Never colour alone: an icon and words say which option is which. */}
                    {state === 'correct' && (
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-700">
                        <CircleCheck className="h-4 w-4" aria-hidden /> {chosen === o.label ? 'Your answer' : 'Correct'}
                      </span>
                    )}
                    {state === 'chosen-wrong' && (
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-rose-700">
                        <CircleX className="h-4 w-4" aria-hidden /> Your answer
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div aria-live="polite" className="mt-5">
              {chosen === null ? (
                <p className="flex items-center gap-2 text-sm font-medium text-slate-500"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500 motion-reduce:animate-none" aria-hidden /> Choose an answer to see the working.</p>
              ) : (
                <div className={`rounded-2xl border-l-4 p-4 text-[15px] leading-relaxed ${correct ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50'}`}>
                  <p className={`font-bold ${correct ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {correct ? 'Correct.' : `Not quite. The answer is ${question.answer}.`}
                  </p>
                  <p className="mt-2">
                    <span className="font-bold">Working. </span>
                    <span className="text-slate-600">{question.working}</span>
                  </p>
                  {!correct && chosenOption?.why && (
                    <p className="mt-2">
                      <span className="font-bold">Why {chosen} is wrong. </span>
                      <span className="text-slate-600">{chosenOption.why}</span>
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
      </div>
    </section>
  )
}
