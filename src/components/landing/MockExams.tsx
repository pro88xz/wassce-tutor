// Timed mock exams, in the page's light style: text and the three papers on
// the left; on the right, on the violet slab, a picture of the exam screen
// (the clock, the question count) with the topics-to-revise card that comes
// after it. Lengths and times come from the question-set manifest, so the
// band always matches the mocks that exist. The scores in the picture are an
// example and say so.
import { Link } from '@tanstack/react-router'
import { ArrowRight, CircleX, Lock, Timer } from 'lucide-react'
import type { SubjectSummary } from '@/lib/public-content'
import { MOCK_EXAMS, formatMinutes } from '@/lib/mock-exams'
import { FROM_PRICE } from '@/lib/plans'
import { Band } from '@/components/public/Section'

export function MockExams({ subjects }: { subjects: SubjectSummary[] }) {
  const mocks = MOCK_EXAMS.map((m) => ({ ...m, name: subjects.find((s) => s.slug === m.subjectSlug)?.name ?? m.subjectSlug })).filter((m) => m.name)
  if (mocks.length === 0) return null
  const first = mocks[0]
  return (
    <Band labelledBy="mock-heading">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div data-reveal className="max-w-xl">
          <p className="site-eyebrow">New: timed mock exams</p>
          <h2 id="mock-heading" className="site-h2 mt-3">Sit a full Paper 1 before the real one.</h2>
          <p className="site-lede mt-4">
            {first.questions} questions from across the syllabus, in the time WAEC gives. When the clock stops, see your score, the working, and exactly which topics to revise.
          </p>
          <ul className="mt-7 grid grid-cols-3 gap-2.5 sm:gap-3">
            {mocks.map((m) => (
              <li key={m.subjectSlug} className="site-card min-w-0 p-3 sm:p-4">
                <Timer className="h-5 w-5 text-primary" aria-hidden />
                <span className="mt-2.5 block text-[13px] font-bold leading-tight tracking-tight sm:text-base">{m.name}</span>
                <span className="mt-1 block text-[12px] leading-snug text-muted-foreground sm:text-[13px]">
                  {formatMinutes(m.minutes)}
                  <span className="hidden sm:inline"> · {m.questions} questions</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link to="/auth" className="site-btn site-btn-lg site-btn-primary">
              Start free <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" aria-hidden /> Mock exams come with a plan, from {FROM_PRICE} NLe.
            </p>
          </div>
        </div>

        <ExamPicture subject={first.name} minutes={first.minutes} questions={first.questions} />
      </div>
    </Band>
  )
}

/** The exam screen mid-paper and the revision list it ends with. Decorative. */
function ExamPicture({ subject, minutes, questions }: { subject: string; minutes: number; questions: number }) {
  // An example moment: 52 minutes in, question 23.
  const left = minutes - 52
  const leftLabel = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}:40`
  const share = left / minutes
  const r = 46
  const c = 2 * Math.PI * r
  const revise = [
    { topic: 'Circles', missed: 3 },
    { topic: 'Indices', missed: 2 },
    { topic: 'Bearings', missed: 2 },
  ]
  return (
    <div data-reveal="1" aria-hidden className="relative isolate mx-auto w-full max-w-lg pb-20 sm:pb-16">
      <span className="absolute -right-3 -top-3 -z-10 h-[78%] w-[92%] rounded-[2rem] bg-gradient-to-br from-[#7c4dff] to-[#4a25c4] sm:-right-5 sm:-top-5" />
      <div className="rounded-[1.75rem] bg-white p-5 text-slate-900 ring-1 ring-slate-900/5 shadow-[0_30px_60px_-28px_rgba(30,20,80,.5)] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[.12em] text-violet-700">Timed mock exam</p>
            <p className="mt-0.5 truncate text-lg font-bold tracking-tight">{subject} Paper 1</p>
          </div>
          <div className="relative h-24 w-24 shrink-0">
            <svg viewBox="0 0 108 108" className="h-24 w-24 -rotate-90">
              <circle cx="54" cy="54" r={r} fill="none" strokeWidth="9" className="stroke-violet-100" />
              <circle cx="54" cy="54" r={r} fill="none" strokeWidth="9" strokeLinecap="round" stroke="#6438d8" strokeDasharray={`${c * share} ${c}`} />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[15px] font-extrabold tabular-nums">{leftLabel}</span>
              <span className="text-[10px] font-semibold text-slate-500">left</span>
            </span>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>Question 23 of {questions}</span>
            <span className="tabular-nums">22 answered</span>
          </div>
          <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-slate-100"><span className="block h-full w-[44%] rounded-full bg-gradient-to-r from-[#7c4dff] to-[#4a25c4]" /></span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {['A', 'B', 'C', 'D'].map((l, i) => (
            <span key={l} className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold ${i === 1 ? 'border-violet-500 bg-violet-50' : 'border-slate-200'}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${i === 1 ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{l}</span>
              <span className={`h-2 rounded-full ${i === 1 ? 'w-12 bg-violet-300' : 'w-10 bg-slate-200'}`} />
            </span>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-2 -left-2 w-64 rotate-[-2deg] rounded-2xl bg-white p-4 text-slate-900 ring-1 ring-slate-900/5 shadow-[0_30px_60px_-24px_rgba(30,20,80,.45)] sm:-left-8 sm:w-72">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[.12em] text-violet-700">Topics to revise</p>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Example</span>
        </div>
        <ul className="mt-2.5 space-y-1.5">
          {revise.map((t) => (
            <li key={t.topic} className="flex items-center gap-2 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[13px] font-semibold">
              <CircleX className="h-4 w-4 shrink-0 text-rose-600" />
              <span className="flex-1">{t.topic}</span>
              <span className="text-xs text-rose-700">{t.missed} missed</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
