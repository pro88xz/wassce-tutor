// Exam orientation: the public WASSCE guide, previewed with the grade scale,
// the thing new students most need to understand.
import { ArrowRight, Check, GraduationCap } from 'lucide-react'
import { Band } from '@/components/public/Section'

// The WAEC grade scale as a ladder. Bar heights only show order: WAEC
// publishes no fixed percentage bands, so none are implied. Class names are
// literals so Tailwind generates them.
const GRADE_BARS = [
  { g: 'A1', m: 'Excellent', kind: 'credit', h: 'h-full', d: 'delay-[0ms]' },
  { g: 'B2', m: 'Very good', kind: 'credit', h: 'h-[91%]', d: 'delay-[60ms]' },
  { g: 'B3', m: 'Good', kind: 'credit', h: 'h-[82%]', d: 'delay-[120ms]' },
  { g: 'C4', m: 'Credit', kind: 'credit', h: 'h-[73%]', d: 'delay-[180ms]' },
  { g: 'C5', m: 'Credit', kind: 'credit', h: 'h-[64%]', d: 'delay-[240ms]' },
  { g: 'C6', m: 'Credit', kind: 'credit', h: 'h-[55%]', d: 'delay-[300ms]' },
  { g: 'D7', m: 'Pass', kind: 'pass', h: 'h-[42%]', d: 'delay-[360ms]' },
  { g: 'E8', m: 'Pass', kind: 'pass', h: 'h-[34%]', d: 'delay-[420ms]' },
  { g: 'F9', m: 'Fail', kind: 'fail', h: 'h-[24%]', d: 'delay-[480ms]' },
] as const

const BAR_TONE = {
  credit: 'bg-gradient-to-t from-[#0d7a50] to-[#2bb97f]',
  pass: 'bg-gradient-to-t from-[#b0650c] to-[#f2a93b]',
  fail: 'bg-gradient-to-t from-slate-500 to-slate-400',
}

const POINTS = ['A1 to C6 are credits, the grades that count', 'D7 and E8 are passes; F9 is a fail', 'Each subject is graded on its own']

export function GradeGuide() {
  return (
    <Band labelledBy="guide-heading">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-reveal className="max-w-xl">
          <p className="site-eyebrow">WASSCE guide</p>
          <h2 id="guide-heading" className="site-h2 mt-3">New to WASSCE? Know how it is graded.</h2>
          <p className="site-lede mt-4">
            Every subject gets one of nine grades. Learn what each one means, which subjects each faculty sits, and how the exam works in Sierra Leone.
          </p>
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
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="/wassce" className="site-btn site-btn-primary">
              Read the WASSCE guide <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="/wassce/subjects" className="site-link">
              Subjects by faculty <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>

        <div data-reveal="1" className="site-card p-5 sm:p-7">
          <div className="flex items-baseline justify-between gap-3">
            <p className="site-h3">The WASSCE grade scale</p>
            <p className="text-xs font-medium text-muted-foreground">A1 best, F9 lowest</p>
          </div>
          <ul className="mt-6 grid h-44 grid-cols-9 items-end gap-1.5 sm:h-56 sm:gap-2.5" aria-label="WASSCE grades from A1, the best, to F9">
            {GRADE_BARS.map((b) => (
              <li key={b.g} className="flex h-full items-end">
                <span className={`grade-bar flex w-full justify-center rounded-t-lg rounded-b-sm pt-2 text-xs font-bold text-white transition-transform duration-700 ease-out sm:text-sm ${b.h} ${b.d} ${BAR_TONE[b.kind]}`}>
                  {b.g}
                  <span className="sr-only">: {b.m}{b.kind === 'credit' ? ', credit' : ''}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2.5 grid grid-cols-9 gap-1.5 text-center text-xs font-bold sm:gap-2.5" aria-hidden>
            <span className="col-span-6 border-t-2 border-success pt-2 text-success">Credit</span>
            <span className="col-span-2 border-t-2 border-warning pt-2 text-warning">Pass</span>
            <span className="border-t-2 border-slate-400 pt-2 text-muted-foreground">Fail</span>
          </div>
          <div className="mt-6 flex gap-3.5 rounded-xl bg-muted/70 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/12 text-success">
              <GraduationCap className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-sm leading-relaxed">
              <span className="font-bold">Aim for C6 or better.</span>{' '}
              <span className="text-muted-foreground">University courses usually ask for credits in five subjects, often including English Language and Mathematics.</span>
            </p>
          </div>
        </div>
      </div>
    </Band>
  )
}
