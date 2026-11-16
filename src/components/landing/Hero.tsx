// Homepage hero: the promise, two actions, and a real classroom photo with a
// marked question from the bank laid over it. Below it, the live counts and
// what the content is (and is not). Topic search lives with the subject
// catalogue further down.
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, Check, CircleCheck, PenLine, ScrollText, ShieldCheck } from 'lucide-react'
import type { LandingData } from '@/lib/public-content'
import { PRACTICE_TOTAL } from '@/lib/practice-counts'
import { supabase } from '@/lib/supabase'
import { SAMPLE_QUESTIONS } from '@/content/sample-questions'

const ASSURANCES = ['Free to start', 'No card needed', 'Works on any phone']

export function Hero({ data }: { data: LandingData }) {
  return (
    <section className="site-band-ink relative isolate overflow-hidden" aria-labelledby="hero-heading">
      <div aria-hidden className="site-hero-backdrop" />
      <div className="site-container relative grid grid-cols-[minmax(0,1fr)] items-center gap-8 pb-8 pt-8 sm:pt-12 md:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] md:gap-10 md:pb-14 lg:gap-16 lg:pb-16 lg:pt-16">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pl-2.5 pr-3.5 text-[13px] font-semibold text-violet-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.18)]" aria-hidden />
            Built for the Sierra Leone WASSCE syllabus
          </p>
          <h1 id="hero-heading" className="site-display mt-5 md:max-lg:text-[2.75rem]">
            Your next grade starts{' '}
            <span className="bg-gradient-to-r from-[#e3d7ff] via-[#b9a2ff] to-[#8fdcf5] bg-clip-text text-transparent">with one topic.</span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
            Syllabus lessons, instant marking that explains every answer, and real tutors.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5 sm:gap-3">
            <Link to="/auth" className="site-btn site-btn-light flex-1 px-4 text-[15px] sm:flex-none sm:px-6 lg:min-h-[3.375rem] lg:px-7 lg:text-base">
              Start learning free <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href="#try-a-question" className="site-btn site-btn-glass flex-1 px-4 text-[15px] sm:flex-none sm:px-6 lg:min-h-[3.375rem] lg:px-7 lg:text-base">
              Try a question <ArrowDown className="h-4 w-4" aria-hidden />
            </a>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] font-medium text-white/65 sm:text-sm">
            {ASSURANCES.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </div>

        <HeroPhoto />
      </div>
      <ProofRow initial={data.totals} />
    </section>
  )
}

/** The bank's prepositions question, shown marked on the photo. */
const MARKED = SAMPLE_QUESTIONS.find((q) => q.key === 'eng-prep-03')!

/**
 * Two students working through a book together, with one real question from
 * the bank laid over it, marked: the answer filled in and the reason the
 * usual wrong answer is wrong. No device frame: the photo is the classroom,
 * the card is the product.
 */
function HeroPhoto() {
  const right = MARKED.options.find((o) => o.label === MARKED.answer)!
  const wrong = MARKED.options.find((o) => o.label === 'A')!
  const [before, after] = MARKED.stem.split('____')
  return (
    <div className="relative mx-auto w-full max-w-xl pb-16 md:max-w-none md:pb-0">
      <div aria-hidden className="absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,.45),transparent)] blur-2xl" />
      <div className="overflow-hidden rounded-[1.75rem] shadow-[0_50px_100px_-40px_rgba(0,0,0,.9)] ring-1 ring-white/15 sm:rounded-[2rem]">
        <img
          src="/img/home/students-studying-1200.webp"
          srcSet="/img/home/students-studying-720.webp 720w, /img/home/students-studying-1200.webp 1200w"
          sizes="(min-width: 768px) 45vw, 100vw"
          width={1200}
          height={960}
          alt="Two students in school uniform working through a book together at their desk"
          fetchPriority="high"
          className="aspect-[5/4] w-full object-cover"
        />
      </div>

      {/* A marked question from the bank, hanging off the photo. */}
      <figure
        aria-label={`A marked question: ${before}${right.text}${after} Answer ${right.label} is correct.`}
        className="absolute inset-x-4 bottom-0 rounded-2xl bg-white p-4 text-slate-900 shadow-[0_30px_60px_-24px_rgba(15,5,40,.75)] sm:inset-x-auto sm:left-6 sm:w-[21rem] md:-left-10 md:bottom-8 lg:-left-16"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[.12em] text-violet-700">English · {MARKED.topic}</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
            <CircleCheck className="h-3.5 w-3.5" aria-hidden /> Correct
          </span>
        </div>
        <p className="mt-2 text-[15px] font-semibold leading-snug">
          {before}
          <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-800">{right.text}</span>
          {after}
        </p>
        <p className="mt-2.5 border-t border-slate-100 pt-2.5 text-[13px] leading-snug text-slate-600">
          <span className="font-bold text-slate-900">Why not &ldquo;{wrong.text}&rdquo;?</span> {wrong.why}
        </p>
      </figure>
    </div>
  )
}

/** Students are shown as proof only once the number is large enough to be proof. */
const STUDENT_PROOF_THRESHOLD = 1000

/** What the content is, and what the platform is not: stated before anyone has to look for it. */
const PROVENANCE = [
  { Icon: ShieldCheck, text: 'Independent study platform, not affiliated with WAEC', short: 'Not affiliated with WAEC' },
  { Icon: PenLine, text: 'Original WASSCE-style questions, not copied past papers', short: 'Original questions' },
  { Icon: ScrollText, text: 'Lessons follow the Sierra Leone WASSCE syllabus', short: 'Follows the syllabus' },
]

/**
 * Live counts and content provenance. The prerendered HTML carries the
 * build-time numbers; the browser refreshes them.
 */
function ProofRow({ initial }: { initial: LandingData['totals'] }) {
  const [totals, setTotals] = useState(initial)
  const [students, setStudents] = useState(0)

  useEffect(() => {
    let active = true
    // Subjects are not refreshed: the figure is the number with a syllabus
    // page (counted at build time), not every row in the subjects table.
    void Promise.all([
      supabase.from('topics').select('id', { count: 'exact', head: true }),
      supabase.from('wassce_lesson_index').select('id', { count: 'exact', head: true }),
      supabase.rpc('get_public_student_count'),
    ]).then(([topics, lessons, registered]) => {
      if (!active) return
      setTotals((current) => ({
        subjects: current.subjects,
        topics: topics.error || topics.count === null ? current.topics : topics.count,
        lessons: lessons.error || lessons.count === null ? current.lessons : lessons.count,
      }))
      if (!registered.error && registered.data !== null) setStudents(Number(registered.data))
    })
    return () => {
      active = false
    }
  }, [])

  // `short` is the label on phones, where four figures share one row.
  const items = [
    { value: totals.subjects, label: 'WASSCE subjects', short: 'subjects' },
    { value: totals.topics, label: 'syllabus topics', short: 'topics' },
    { value: totals.lessons, label: 'published lessons', short: 'lessons' },
    students >= STUDENT_PROOF_THRESHOLD
      ? { value: students, label: 'registered students', short: 'students' }
      : { value: PRACTICE_TOTAL, label: 'worked practice questions', short: 'questions' },
  ]

  return (
    <div className="relative border-t border-white/10 bg-black/15">
      <dl className="site-container grid grid-cols-4">
        {items.map(({ value, label, short }, i) => (
          <div key={label} className={`flex flex-col-reverse justify-end gap-1 py-4 sm:py-6 ${i > 0 ? 'border-l border-white/10 pl-3 sm:pl-6 lg:pl-8' : ''}`}>
            <dt className="text-[11px] font-medium leading-snug text-white/60 sm:text-sm">
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{label}</span>
            </dt>
            <dd className="text-xl font-extrabold leading-none tracking-tight tabular-nums text-white sm:text-3xl lg:text-4xl">{value.toLocaleString('en')}</dd>
          </div>
        ))}
      </dl>
      <ul className="site-container flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-white/10 py-3 text-xs text-white/65 sm:gap-x-7 sm:py-3.5 sm:text-[13px]">
        {PROVENANCE.map(({ Icon, text, short }) => (
          <li key={text} className="inline-flex items-center gap-1.5 sm:gap-2">
            <Icon className="h-4 w-4 shrink-0 text-violet-200" aria-hidden />
            <span className="sm:hidden">{short}</span>
            <span className="hidden sm:inline">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
