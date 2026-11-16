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
      <div className="site-container relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 pb-10 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:pb-20 lg:pt-16">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pl-2.5 pr-3.5 text-[13px] font-semibold text-violet-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.18)]" aria-hidden />
            Built for the Sierra Leone WASSCE syllabus
          </p>
          <h1 id="hero-heading" className="site-display mt-5">
            Your next grade starts{' '}
            <span className="bg-gradient-to-r from-[#e3d7ff] via-[#b9a2ff] to-[#8fdcf5] bg-clip-text text-transparent">with one topic.</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
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
 * A large classroom photograph with two real pieces of the product laid over
 * it: a question from the bank, marked, and a diagram from a Mathematics
 * lesson. No device frame: the photo is the classroom, the cards are the
 * product. Below 1024 px the photo runs the full width under the text.
 */
function HeroPhoto() {
  const right = MARKED.options.find((o) => o.label === MARKED.answer)!
  const wrong = MARKED.options.find((o) => o.label === 'A')!
  const [before, after] = MARKED.stem.split('____')
  return (
    <div className="relative w-full pb-24 sm:pb-0">
      <div aria-hidden className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,.5),transparent)] blur-2xl" />
      <span aria-hidden className="absolute -right-5 -top-5 -z-10 hidden h-36 w-36 rounded-full border-[16px] border-[#ffd166] sm:block lg:-right-8 lg:-top-8 lg:h-44 lg:w-44" />

      <div className="overflow-hidden rounded-[1.75rem] shadow-[0_50px_100px_-40px_rgba(0,0,0,.9)] ring-1 ring-white/15 sm:rounded-[2.25rem]">
        <img
          src="/img/home/students-studying-1200.webp"
          srcSet="/img/home/students-studying-720.webp 720w, /img/home/students-studying-1200.webp 1200w"
          sizes="(min-width: 1024px) 50vw, 100vw"
          width={1200}
          height={960}
          alt="Two students in school uniform working through a book together at their desk"
          fetchPriority="high"
          className="aspect-[5/4] w-full object-cover sm:aspect-[16/10] lg:aspect-[1/1] xl:aspect-[20/19]"
        />
      </div>

      {/* A diagram from a real Mathematics lesson. */}
      <div aria-hidden className="absolute bottom-6 right-6 hidden w-52 rotate-2 rounded-2xl bg-white p-3 text-slate-900 shadow-[0_30px_60px_-24px_rgba(15,5,40,.8)] sm:block lg:-bottom-8 lg:-right-8 lg:w-56">
        <p className="px-1 text-[10px] font-bold uppercase tracking-[.12em] text-violet-700">Mathematics · Lesson</p>
        <p className="px-1 text-[13px] font-bold">Quadratic graphs</p>
        <img src="/img/mathematics/quadratic-graph.svg" alt="" width={240} height={180} loading="lazy" decoding="async" className="mt-1.5 aspect-[4/3] w-full rounded-lg bg-slate-50 object-cover object-top" />
      </div>

      {/* A marked question from the bank. */}
      <figure
        aria-label={`A marked question: ${before}${right.text}${after} Answer ${right.label} is correct.`}
        className="absolute inset-x-3 bottom-0 rounded-2xl bg-white p-4 text-slate-900 shadow-[0_30px_60px_-24px_rgba(15,5,40,.8)] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[22rem] lg:-left-14 lg:bottom-12"
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
