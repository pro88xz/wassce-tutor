// The learning method as three product snapshots: a lesson, a marked practice
// set, and the weakest-topics view. Each is a small copy of the real screen,
// so the section shows what studying here looks like instead of describing
// it. The lesson snippet is from a real free lesson; the scores in the other
// two are examples and say so.
import { ArrowRight, Check, CircleCheck, CircleX } from 'lucide-react'
import { Band, Mark, SectionHeading } from '@/components/public/Section'

/** The free lesson the first snapshot comes from. */
const LESSON_HREF = '/wassce/mathematics/quadratic-equations/quadratic-equations-factorisation-completing-the-square-and-the-formula'

const STEPS = [
  { title: 'Learn the topic', body: 'Clear lessons with worked examples, diagrams and exam tips.', Shot: LessonShot, example: false },
  { title: 'Practise and see why', body: 'Questions marked instantly, with the reason behind every answer.', Shot: PracticeShot, example: true },
  { title: 'Fix your weak topics', body: 'Your progress shows exactly what to revise next.', Shot: FocusShot, example: true },
]

export function HowItWorks() {
  return (
    <Band tone="white" labelledBy="method-heading">
      <SectionHeading
        id="method-heading"
        eyebrow="How it works"
        title={<>Learn it. Practise it. <Mark>Master it.</Mark></>}
        action={
          <a href={LESSON_HREF} className="site-link">
            Read a free lesson <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        }
      />
      <ol className="site-rail -mx-[var(--site-gutter)] mt-9 scroll-px-[var(--site-gutter)] px-[var(--site-gutter)] pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 lg:mt-12">
        {STEPS.map(({ title, body, Shot, example }, i) => (
          <li key={title} data-reveal={i} className="site-card w-[84%] shrink-0 overflow-hidden md:w-auto">
            <div aria-hidden className="relative h-52 overflow-hidden bg-gradient-to-b from-brand-soft to-brand-soft/30 px-5 pt-5 [background-image:radial-gradient(color-mix(in_srgb,var(--primary)_16%,transparent)_1px,transparent_1px)] [background-size:14px_14px]">
              {example && <span className="absolute right-3 top-3 z-10 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 shadow-sm">Example</span>}
              <Shot />
            </div>
            <div className="relative p-5 pt-9">
              <span aria-hidden className="absolute -top-6 left-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c4dff] to-[#4a25c4] text-lg font-extrabold text-white shadow-[0_12px_24px_-10px_rgba(76,37,196,.8)] ring-4 ring-[var(--card)]">{i + 1}</span>
              <p className="sr-only">Step {i + 1}</p>
              <h3 className="site-h3">{title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Band>
  )
}

/** A screen card that rises out of the bottom of the snapshot area. */
function Screen({ children }: { children: React.ReactNode }) {
  return <div className="rounded-t-2xl bg-white p-4 text-slate-900 shadow-[0_18px_40px_-18px_rgba(76,29,149,.45)] ring-1 ring-slate-200">{children}</div>
}

function LessonShot() {
  return (
    <Screen>
      <p className="text-[10px] font-bold uppercase tracking-[.12em] text-violet-700">Mathematics · Lesson</p>
      <p className="mt-0.5 text-[15px] font-bold tracking-tight">Quadratic equations</p>
      <div className="mt-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Worked example</p>
        <p className="mt-1 font-mono text-[12px] leading-5">x² − 5x + 6 = 0<br />(x − 2)(x − 3) = 0<br /><span className="font-bold">x = 2 or x = 3</span></p>
      </div>
      <div className="mt-2 rounded-lg border-l-4 border-sky-400 bg-sky-50 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Exam tip</p>
      </div>
    </Screen>
  )
}

function PracticeShot() {
  const rows = [
    { topic: 'Percentages', score: 5, right: true },
    { topic: 'Quadratic equations', score: 4, right: true },
    { topic: 'Circles', score: 2, right: false },
  ]
  return (
    <Screen>
      <p className="text-[10px] font-bold uppercase tracking-[.12em] text-violet-700">Practice · marked</p>
      <ul className="mt-2.5 space-y-2">
        {rows.map((r) => (
          <li key={r.topic} className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2 text-[12px] font-semibold">
            {r.right ? <CircleCheck className="h-4 w-4 shrink-0 text-emerald-600" /> : <CircleX className="h-4 w-4 shrink-0 text-rose-600" />}
            <span className="flex-1 truncate">{r.topic}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${r.score >= 4 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{r.score}/5</span>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 rounded-lg bg-rose-50 px-3 py-2 text-[11px] leading-4 text-slate-700"><span className="font-bold text-rose-700">Why B is wrong:</span> that is the arc length, not the area.</p>
    </Screen>
  )
}

function FocusShot() {
  const rows = [
    { topic: 'Circles', pct: 40 },
    { topic: 'Indices', pct: 60 },
  ]
  return (
    <Screen>
      <p className="text-[10px] font-bold uppercase tracking-[.12em] text-violet-700">Focus next</p>
      <ul className="mt-2.5 space-y-3">
        {rows.map((r) => (
          <li key={r.topic}>
            <div className="flex items-center justify-between text-[12px] font-semibold">
              <span>{r.topic}</span>
              <span className="tabular-nums text-rose-700">{r.pct}%</span>
            </div>
            <span className="mt-1 block h-2 overflow-hidden rounded-full bg-slate-200"><span className="block h-full rounded-full bg-rose-500" style={{ width: `${r.pct}%` }} /></span>
            <span className="mt-1.5 flex gap-1.5">
              <span className="rounded-md border border-slate-200 px-2 py-0.5 text-[10px] font-bold">Revise</span>
              <span className="rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">Practise again</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700"><Check className="h-3.5 w-3.5" /> Percentages: 100%</p>
    </Screen>
  )
}
