// "Try a question": the one part of the product a visitor can use before
// signing up. Three questions from the practice bank, marked the moment an
// option is chosen, with the working and the reason the chosen option is
// wrong, which is how every practice set in the product explains its answers.
// Nothing is saved: this is a taste, not a practice set.
//
// The card is drawn as the practice screen: a dark header with the question
// count, and options as answer-sheet bubbles (the hero's language) that shade
// when chosen and are then marked. Beside it, what the card does and where
// practice exists today, by subject.
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, CircleCheck, CircleX, Lightbulb, ListChecks, RotateCcw, Zap } from 'lucide-react'
import { SAMPLE_QUESTIONS, type SampleOption } from '@/content/sample-questions'
import { PRACTICE_BY_SUBJECT, PRACTICE_TOTAL } from '@/lib/practice-counts'
import { subjectPath } from '@/lib/public-content'

type OptionState = 'open' | 'correct' | 'chosen-wrong' | 'other'

const OPTION_STYLE: Record<OptionState, string> = {
  open: 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-[#d23f6a]/60 hover:shadow-[0_14px_26px_-18px_rgba(91,52,214,.6)]',
  correct: 'border-emerald-500 bg-emerald-50/80',
  'chosen-wrong': 'border-rose-500 bg-rose-50/80',
  other: 'border-slate-200 bg-white opacity-50',
}

/** What the card does, shown beside it. */
const FEATURES = [
  { Icon: Zap, title: 'Marked instantly', body: 'Pick an option and see at once whether it is right.' },
  { Icon: Lightbulb, title: 'Every wrong answer explained', body: 'Each wrong option says why it is wrong, so the mistake does not repeat.' },
  { Icon: ListChecks, title: 'Full working shown', body: 'Step by step, the way an examiner wants to see it.' },
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
      <div className="site-container">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#f4f0ff,#ffffff_55%,#fff7e6)] px-5 py-10 ring-1 ring-[color-mix(in_srgb,var(--primary)_12%,transparent)] sm:px-10 sm:py-14 lg:px-14 lg:py-16 dark:bg-[linear-gradient(135deg,#221c3a,#1a1626_55%,#2a2216)]">
          <div aria-hidden className="absolute inset-0 -z-10 opacity-70 [background-image:radial-gradient(rgba(91,52,214,.10)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_70%_at_75%_40%,#000,transparent)]" />
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <div data-reveal className="max-w-xl">
              <p className="site-eyebrow">Try it: no account needed</p>
              <h2 id="try-heading" className="site-h2 mt-3">
                Every answer <span className="site-accent text-[var(--primary)]">explained.</span>
              </h2>
              <p className="site-lede mt-4">Pick an answer and see why it is right or wrong.</p>

              <ul className="mt-7 space-y-4">
                {FEATURES.map(({ Icon, title, body }) => (
                  <li key={title} className="flex gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--site-ink)] text-[#cdbcff] shadow-[0_10px_20px_-12px_rgba(19,13,43,.8)]" aria-hidden>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 pt-0.5">
                      <span className="block text-[15px] font-bold leading-snug sm:text-base">{title}</span>
                      <span className="mt-0.5 block text-[14px] leading-relaxed text-muted-foreground">{body}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-[color-mix(in_srgb,var(--primary)_14%,transparent)] pt-5">
                <p className="text-[13px] font-semibold text-foreground">
                  {PRACTICE_TOTAL.toLocaleString('en')} original questions, written to the syllabus. Not WAEC past papers.
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {PRACTICE_BY_SUBJECT.map((s) => (
                    <li key={s.slug}>
                      <a
                        href={subjectPath(s.slug)}
                        className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-[var(--card)] px-3 text-[12.5px] font-semibold text-foreground ring-1 ring-border transition hover:ring-[color-mix(in_srgb,var(--primary)_40%,var(--border))]"
                      >
                        {s.name} <span className="tabular-nums text-muted-foreground">{s.questions}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div data-reveal="1" className="relative">
              {/* The next questions, stacked behind the card. */}
              <div aria-hidden className="absolute inset-x-6 -bottom-3 top-3 -z-10 rotate-[2.5deg] rounded-[24px] bg-white/70 ring-1 ring-slate-900/[0.05] shadow-[0_20px_40px_-28px_rgba(30,20,80,.4)] sm:inset-x-10" />
              <div aria-hidden className="absolute inset-x-3 -bottom-1.5 top-1.5 -z-10 -rotate-[1.5deg] rounded-[24px] bg-white/85 ring-1 ring-slate-900/[0.05] sm:inset-x-5" />

              <div className="overflow-hidden rounded-[24px] bg-white text-slate-900 ring-1 ring-slate-900/[0.07] shadow-[0_2px_4px_rgba(23,28,43,.05),0_40px_70px_-34px_rgba(30,20,80,.5)]">
                {/* The practice screen's header. */}
                <div className="flex items-center justify-between gap-3 bg-[var(--site-ink)] px-5 py-3.5 text-white sm:px-7">
                  <span className="min-w-0 truncate text-[12px] font-bold uppercase tracking-[.14em] text-white/70">
                    Practice · <span className="text-white">{question.subject}</span> · {question.topic}
                  </span>
                  <span className="flex shrink-0 items-center gap-2" role="img" aria-label={`Question ${index + 1} of ${SAMPLE_QUESTIONS.length}`}>
                    <span className="text-[12px] font-semibold tabular-nums text-white/70">
                      {index + 1}/{SAMPLE_QUESTIONS.length}
                    </span>
                    <span className="flex gap-1">
                      {SAMPLE_QUESTIONS.map((q, i) => (
                        <span key={q.key} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-[#ffd166]' : i < index ? 'w-1.5 bg-white/70' : 'w-1.5 bg-white/25'}`} />
                      ))}
                    </span>
                  </span>
                </div>

                <div className="p-5 sm:p-7">
                  {question.instruction && <p className="text-sm text-slate-500">{question.instruction}</p>}
                  <p id="try-stem" className={`text-xl font-bold leading-snug tracking-tight sm:text-[1.6rem] ${question.instruction ? 'mt-1.5' : ''}`}>
                    {question.stem}
                  </p>

                  <div role="group" aria-labelledby="try-stem" className="mt-6 grid gap-3 sm:grid-cols-2">
                    {question.options.map((o) => {
                      const state = stateOf(o)
                      const shaded = chosen === o.label
                      return (
                        <button
                          key={`${question.key}-${o.label}`}
                          type="button"
                          onClick={() => chosen === null && setChosen(o.label)}
                          aria-pressed={shaded}
                          aria-disabled={chosen !== null}
                          className={`flex min-h-[3.75rem] items-center gap-3 rounded-2xl border-2 px-3.5 py-3 text-left text-[17px] font-semibold transition ${OPTION_STYLE[state]} ${chosen === null ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          {/* The option's bubble, as on an answer sheet: shaded in pencil when chosen. */}
                          <span
                            className={`sheet-bubble flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[12px] font-bold ${
                              shaded ? 'is-shaded border-[#23202b] text-white' : state === 'correct' ? 'border-emerald-600 text-emerald-700' : 'border-[#d23f6a]/70 text-[#d23f6a]'
                            }`}
                          >
                            {o.label}
                          </span>
                          <span className="min-w-0 flex-1">{o.text}</span>
                          {/* Never colour alone: an icon and words say which option is which. */}
                          {state === 'correct' && (
                            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-emerald-700">
                              <CircleCheck className="h-4 w-4" aria-hidden /> {shaded ? 'Your answer' : 'Correct'}
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
                      <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500 motion-reduce:animate-none" aria-hidden /> Choose an answer to see the working.
                      </p>
                    ) : (
                      <div className={`rounded-2xl border-l-4 p-4 text-[15px] leading-relaxed ${correct ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50'}`}>
                        <p className={`font-bold ${correct ? 'text-emerald-800' : 'text-rose-800'}`}>{correct ? 'Correct.' : `Not quite. The answer is ${question.answer}.`}</p>
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
          </div>
        </div>
      </div>
    </section>
  )
}
