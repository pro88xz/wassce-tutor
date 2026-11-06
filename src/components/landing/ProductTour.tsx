// "How it works" as a product tour: each step shows a faithful preview of the
// real screen instead of an icon card. The practice preview uses a real
// question, diagram and working from the Mathematics question bank.
import { Check, CircleCheck, Clock, Lightbulb, MessageCircleQuestion, RotateCcw, Sparkles } from 'lucide-react'
import { useState, type ReactNode } from 'react'

function LessonPreview() {
  return (
    <>
      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
        <span>Mathematics · Lesson 2 of 5</span>
        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> 14 min</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-2/5 rounded-full bg-[#5b34d6]" /></div>
      <p className="mt-3 text-lg font-bold leading-snug">The laws of indices</p>
      <div className="mt-3 rounded-xl border-l-4 border-primary bg-brand-soft/60 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Key idea</p>
        <p className="mt-1 text-sm">
          To multiply powers of the same base, add the indices: a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup>
        </p>
      </div>
      <p className="mt-3 text-xs font-semibold text-muted-foreground">Worked example</p>
      <ol className="mt-1 space-y-1 text-sm">
        <li><span className="mr-1.5 font-semibold text-primary">1</span>Simplify 2<sup>3</sup> × 2<sup>4</sup></li>
        <li><span className="mr-1.5 font-semibold text-primary">2</span>Same base, so add: 2<sup>3+4</sup> = 2<sup>7</sup></li>
        <li><span className="mr-1.5 font-semibold text-primary">3</span>2<sup>7</sup> = 128</li>
      </ol>
      <p className="mt-3 inline-flex rounded-lg bg-success/10 px-2.5 py-1 text-sm font-semibold text-success">Answer: 128</p>
    </>
  )
}

function QuestionPreview() {
  const opts: [string, string, 'right' | 'chosen' | 'other'][] = [
    ['A', '52°', 'right'],
    ['B', '76°', 'chosen'],
    ['C', '128°', 'other'],
    ['D', '142°', 'other'],
  ]
  return (
    <>
      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
        <span>Circles · practice set</span>
        <span>Question 2 of 5</span>
      </div>
      <p className="mt-2 text-sm font-semibold leading-relaxed">
        In the diagram, AB is a diameter of the circle with centre O and ∠CAB = 38°. Find the angle marked x.
      </p>
      <img src="/questions/mathematics/maths-circles-02.svg" alt="Circle diagram from a WASSCE Mathematics practice question" loading="lazy" width={240} height={180} className="mx-auto my-1.5 h-28 w-auto" />
      <div className="grid grid-cols-2 gap-2">
        {opts.map(([l, v, state]) => (
          <div
            key={l}
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm ${
              state === 'right' ? 'border-success bg-success/10' : state === 'chosen' ? 'border-danger bg-danger/5' : 'opacity-60'
            }`}
          >
            <span className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${state === 'right' ? 'bg-success text-white' : state === 'chosen' ? 'bg-danger text-white' : 'border'}`}>{l}</span>
            {v}
            {state === 'right' && <Check className="ml-auto h-4 w-4 text-success" />}
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5 rounded-xl bg-muted/70 p-3 text-[13px] leading-relaxed">
        <p><span className="font-semibold">Working.</span> The angle in a semicircle is 90°, so ∠ACB = 90°. Then x = 180° − 90° − 38° = 52°.</p>
        <p className="text-muted-foreground"><span className="font-semibold text-foreground">Why not 76°?</span> You doubled 38°. Doubling is for the angle at the centre.</p>
      </div>
    </>
  )
}

function TutorPreview() {
  return (
    <>
      <div className="flex items-center gap-2 border-b pb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white"><Sparkles className="h-4 w-4" /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold">AI tutor</span>
          <span className="block text-[11px] text-muted-foreground">Mathematics · Indices</span>
        </span>
      </div>
      <p className="ml-auto mt-3 w-fit max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-sm text-white">
        Why is 27<sup>2/3</sup> equal to 9?
      </p>
      <div className="mt-3 max-w-[92%] rounded-2xl rounded-tl-md border px-3 py-2.5 text-sm">
        <p className="mb-1 text-[11px] font-medium text-muted-foreground">AI-generated</p>
        <p>The bottom number, 3, means a cube root: ∛27 = 3.</p>
        <p className="mt-1">The top number, 2, means square it: 3<sup>2</sup> = 9.</p>
        <p className="mt-1.5 font-semibold">Check: try 8<sup>2/3</sup>. You should get 4.</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {['Explain more simply', 'Another example'].map((t) => (
          <span key={t} className="rounded-full border px-2.5 py-1 text-xs font-medium">{t}</span>
        ))}
      </div>
    </>
  )
}

function ProgressPreview() {
  const days = ['S', 'S', 'M', 'T', 'W', 'T', 'F']
  const active = [false, true, false, true, true, true, true]
  return (
    <>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold">Mathematics</span>
        <span className="text-[11px] text-muted-foreground">25 of 83 lessons</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-[30%] rounded-full bg-[#5b34d6]" /></div>
      <ul className="mt-3 divide-y rounded-xl border text-sm">
        <li className="flex items-center gap-2.5 px-3 py-2.5">
          <CircleCheck className="h-5 w-5 text-success" />
          <span className="flex-1"><span className="block font-semibold">Number Bases</span><span className="text-[11px] text-muted-foreground">7 of 7 lessons · <span className="font-semibold text-success">Completed</span></span></span>
        </li>
        <li className="flex items-center gap-2.5 px-3 py-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warning/10 text-warning"><RotateCcw className="h-3 w-3" /></span>
          <span className="flex-1"><span className="block font-semibold">Indices</span><span className="text-[11px] text-muted-foreground">Practice 1/5 · <span className="font-semibold text-warning">Review recommended</span></span></span>
        </li>
        <li className="flex items-center gap-2.5 px-3 py-2.5">
          <span className="h-5 w-5 rounded-full border-[3px] border-[#5b34d6] border-r-muted border-b-muted" />
          <span className="flex-1"><span className="block font-semibold">Logarithms</span><span className="text-[11px] text-muted-foreground">2 of 6 lessons · <span className="font-semibold text-foreground">In progress</span></span></span>
        </li>
      </ul>
      <p className="mt-3 text-[11px] font-medium text-muted-foreground">This week · 5 of 7 days</p>
      <div className="mt-1.5 flex justify-between">
        {days.map((d, i) => (
          <span key={i} className="flex flex-col items-center gap-1">
            <span className={`h-2.5 w-2.5 rounded-full ${active[i] ? 'bg-primary' : 'bg-muted'}`} />
            <span className="text-[10px] text-muted-foreground">{d}</span>
          </span>
        ))}
      </div>
    </>
  )
}

type Chip = { icon: ReactNode; text: string; tone: string }

const STEPS: {
  n: number
  label: string
  title: string
  body: string
  points: string[]
  stage: string
  accent: string
  preview: ReactNode
  chips: [Chip, Chip]
}[] = [
  {
    n: 1,
    label: 'Learn',
    title: 'Short lessons, written to the syllabus',
    body: 'Every topic is broken into short lessons with key ideas, worked examples and a quick check, in the order WASSCE teaches it.',
    points: ['Worked examples step by step', 'Properly typeset maths and diagrams'],
    stage: 'from-[#e9e1ff] via-[#f3efff] to-[#ddd2ff]',
    accent: 'bg-[#5b34d6]',
    preview: <LessonPreview />,
    chips: [
      { icon: <Clock className="h-4 w-4" />, text: '14-minute lesson', tone: 'text-primary' },
      { icon: <CircleCheck className="h-4 w-4" />, text: 'Lesson complete', tone: 'text-success' },
    ],
  },
  {
    n: 2,
    label: 'Practise',
    title: 'Exam-style questions with the full working',
    body: 'Answer original WASSCE-style questions. Each one is marked straight away, with the working and the reason each wrong option is wrong.',
    points: ['A clear diagram wherever the question needs one', 'Learn from the exact mistake you made'],
    stage: 'from-[#d6f3e6] via-[#ecfaf3] to-[#c9eedc]',
    accent: 'bg-[#15805a]',
    preview: <QuestionPreview />,
    chips: [
      { icon: <Check className="h-4 w-4" />, text: 'Marked instantly', tone: 'text-success' },
      { icon: <Lightbulb className="h-4 w-4" />, text: 'Why 76° is wrong', tone: 'text-warning' },
    ],
  },
  {
    n: 3,
    label: 'Ask',
    title: 'An AI tutor when you are stuck',
    body: 'Ask about any step in plain English. The tutor explains one step at a time, then gives you a quick check to try yourself.',
    points: ['Open it from any lesson with your question ready', 'Clearly labelled as AI, with a report button'],
    stage: 'from-[#dbe7fb] via-[#eef4fd] to-[#cfe0fa]',
    accent: 'bg-[#2560c0]',
    preview: <TutorPreview />,
    chips: [
      { icon: <Sparkles className="h-4 w-4" />, text: 'Step by step', tone: 'text-info' },
      { icon: <MessageCircleQuestion className="h-4 w-4" />, text: 'Ask follow-ups', tone: 'text-primary' },
    ],
  },
  {
    n: 4,
    label: 'Track',
    title: 'See what is done and what needs work',
    body: 'Your progress shows which topics are completed, which are in progress and which your practice says to review before the exam.',
    points: ['Review suggestions from your real scores', 'Every number comes from what you have done'],
    stage: 'from-[#fbe8cf] via-[#fdf4e8] to-[#f7dcb8]',
    accent: 'bg-[#b0610f]',
    preview: <ProgressPreview />,
    chips: [
      { icon: <RotateCcw className="h-4 w-4" />, text: 'Review recommended', tone: 'text-warning' },
      { icon: <CircleCheck className="h-4 w-4" />, text: '13 topics completed', tone: 'text-success' },
    ],
  },
]

/** The real screen inside a phone, on a coloured stage, with floating result chips. */
function Showcase({ step }: { step: (typeof STEPS)[number] }) {
  const chip = 'absolute z-10 inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-2 text-[13px] font-semibold shadow-lg'
  return (
    <div className={`relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${step.stage} px-5 py-10 sm:px-10 sm:py-12`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(40,20,95,0.09)_1px,transparent_1.2px)] [background-size:18px_18px]" />
      <div aria-hidden className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-15 ${step.accent}`} />
      <div className="relative mx-auto w-full max-w-[19rem]">
        <span className={`${chip} -left-1 -top-5 sm:-left-12 ${step.chips[0].tone}`}>
          {step.chips[0].icon}
          <span className="text-foreground">{step.chips[0].text}</span>
        </span>
        <span className={`${chip} -bottom-5 -right-1 sm:-right-12 ${step.chips[1].tone}`}>
          {step.chips[1].icon}
          <span className="text-foreground">{step.chips[1].text}</span>
        </span>
        {/* phone */}
        <div className="rounded-[2.4rem] bg-[#141225] p-2.5 shadow-[0_40px_70px_-25px_rgba(40,20,95,0.55)] ring-1 ring-black/10">
          <div className="overflow-hidden rounded-[1.9rem] bg-card">
            <div className="flex items-center justify-between px-5 pb-1 pt-2.5 text-[11px] font-semibold text-foreground">
              <span>9:41</span>
              <span className="h-4 w-16 rounded-full bg-[#141225]" />
              <span className="flex items-center gap-1">
                <span className="h-2 w-3 rounded-sm bg-foreground/80" />
                <span className="h-2 w-4 rounded-sm border border-foreground/70" />
              </span>
            </div>
            {/* fixed screen height, so switching steps never moves the page */}
            <div className="relative h-[30rem] overflow-hidden">
              <div key={step.n} className="tour-in px-4 pb-5 pt-2 text-left" aria-hidden>
                {step.preview}
              </div>
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductTour() {
  const [active, setActive] = useState(0)
  const step = STEPS[active]
  return (
    <section className="space-y-8" aria-labelledby="tour-heading">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <p className="text-sm font-semibold text-primary">How it works</p>
        <h2 id="tour-heading" className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance sm:text-3xl">Learn, practise, ask, track</h2>
        <p className="text-[15px] text-muted-foreground">Tap a step to see what it looks like inside WASSCE Tutor.</p>
      </div>

      <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-10">
        {/* Steps: segmented control on phones, a list with full text from 768 px */}
        <div className="space-y-4">
          <div role="tablist" aria-label="How it works" className="grid grid-cols-4 gap-1 rounded-2xl bg-muted p-1 md:hidden">
            {STEPS.map((s, i) => (
              <button
                key={s.n}
                type="button"
                role="tab"
                id={`tour-tab-m-${s.n}`}
                aria-selected={active === i}
                aria-controls="tour-panel"
                onClick={() => setActive(i)}
                className={`min-h-11 rounded-xl text-sm font-semibold transition-colors ${active === i ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="space-y-2 md:hidden">
            <h3 className="text-xl font-bold leading-tight tracking-tight">{step.title}</h3>
            <p className="text-[15px] text-muted-foreground">{step.body}</p>
          </div>

          <ol className="hidden space-y-2 md:block">
            {STEPS.map((s, i) => {
              const on = active === i
              return (
                <li key={s.n}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    aria-controls="tour-panel"
                    className={`w-full rounded-2xl border p-4 text-left transition-colors ${on ? 'border-transparent bg-card shadow-md ring-1 ring-black/5' : 'border-transparent hover:bg-card/60'}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${on ? `${s.accent} text-white` : 'bg-muted text-muted-foreground'}`}>{s.n}</span>
                      <span className={`text-lg font-bold tracking-tight ${on ? '' : 'text-muted-foreground'}`}>{s.title}</span>
                    </span>
                    <span className={`mt-2 block pl-11 text-[15px] text-muted-foreground ${on ? '' : 'line-clamp-1'}`}>{s.body}</span>
                    {on && (
                      <span className="mt-3 block space-y-1.5 pl-11">
                        {s.points.map((p) => (
                          <span key={p} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 shrink-0 text-success" aria-hidden /> {p}</span>
                        ))}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

        <div id="tour-panel" role="tabpanel" aria-label={step.label}>
          <Showcase step={step} />
        </div>
      </div>
    </section>
  )
}
