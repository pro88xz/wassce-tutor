// Homepage hero, in the public site's light language: the promise and two
// actions on the left; on the right a classroom photograph on the violet
// brand slab (BrandPhoto) with two real pieces of the product on it. Below,
// a light strip with the live counts and what the content is (and is not).
// Topic search sits under the promise, as on a course catalogue.
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, BookOpen, Check, CircleCheck, ClipboardCheck, Layers, Library, PenLine, ScrollText, ShieldCheck, Users } from 'lucide-react'
import type { LandingData } from '@/lib/public-content'
import { PRACTICE_TOTAL } from '@/lib/practice-counts'
import { supabase } from '@/lib/supabase'
import { SAMPLE_QUESTIONS } from '@/content/sample-questions'
import { BrandPhoto } from '@/components/public/BrandPhoto'
import { TopicSearch, type TopicShortcut } from '@/components/landing/TopicSearch'
import { topicPath, type PopularTopic } from '@/lib/public-content'

/** Shortcut chips: popular topics that have lessons, short enough to read as a chip. */
function shortcutsFrom(popular: PopularTopic[]): TopicShortcut[] {
  return popular
    .filter((t) => t.lessons > 0 && t.topicName.length <= 22)
    .slice(0, 4)
    .map((t) => ({ label: t.topicName, href: topicPath(t.subjectSlug, t.topicSlug) }))
}

const ASSURANCES = ['Free to start', 'No card needed', 'Works on any phone']

export function Hero({ data }: { data: LandingData }) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--card)]" aria-labelledby="hero-heading">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(52rem_32rem_at_100%_0%,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_70%),radial-gradient(40rem_26rem_at_0%_100%,rgba(255,209,102,.16),transparent_70%)]" />
      <div className="site-container grid grid-cols-[minmax(0,1fr)] items-center gap-12 pb-12 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] lg:gap-16 lg:pb-16 lg:pt-20">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2.5 rounded-full bg-[var(--brand-soft)] py-1.5 pl-2.5 pr-3.5 text-[13px] font-semibold text-[var(--brand-strong)]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.18)]" aria-hidden />
            Built for the Sierra Leone WASSCE syllabus
          </p>
          <h1 id="hero-heading" className="site-display mt-5 text-foreground">
            Your next grade starts{' '}
            <span className="bg-gradient-to-r from-[#6438d8] via-[#7c4dff] to-[#2f7fe0] bg-clip-text text-transparent">with one topic.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted-foreground sm:text-lg">
            Syllabus lessons, instant marking that explains every answer, and real tutors.
          </p>
          {/* Search first, as on a course catalogue: most visitors arrive knowing their subject or topic. */}
          <div className="mt-7 max-w-xl">
            <p className="mb-2.5 text-sm font-bold text-foreground">What do you want to study?</p>
            <TopicSearch shortcuts={shortcutsFrom(data.popular)} tone="light" size="lg" />
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link to="/auth" className="site-btn site-btn-lg site-btn-primary px-6">
              Start learning free <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href="#try-a-question" className="site-link">
              or try a question <ArrowDown className="h-4 w-4" aria-hidden />
            </a>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] font-medium text-muted-foreground sm:text-sm">
            {ASSURANCES.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 shrink-0 text-success" aria-hidden /> {t}
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

/** A floating product card on a light page: white, hairline border, deep soft shadow. */
const FLOAT = 'rounded-2xl bg-white text-slate-900 ring-1 ring-slate-900/5 shadow-[0_28px_56px_-22px_rgba(30,20,80,.45)]'

/**
 * The classroom photograph on the brand slab, with a question from the bank
 * (marked) and a diagram from a Mathematics lesson laid over the desk, never
 * over a face. Below 1024 px the photo runs the full width under the text.
 */
function HeroPhoto() {
  const right = MARKED.options.find((o) => o.label === MARKED.answer)!
  const wrong = MARKED.options.find((o) => o.label === 'A')!
  const [before, after] = MARKED.stem.split('____')
  return (
    <div className="relative pb-24 sm:pb-6 lg:pb-0">
      <BrandPhoto
        src="/img/home/students-studying-1200.webp"
        srcSet="/img/home/students-studying-720.webp 720w, /img/home/students-studying-1200.webp 1200w"
        sizes="(min-width: 1024px) 50vw, 100vw"
        width={1200}
        height={960}
        alt="Two students in school uniform working through a book together at their desk"
        priority
        aspect="aspect-[5/4] sm:aspect-[16/10] lg:aspect-[1/1] xl:aspect-[20/19]"
      >
        {/* A diagram from a real Mathematics lesson. */}
        <div aria-hidden className={`absolute bottom-6 right-6 hidden w-52 rotate-2 p-3 sm:block lg:-bottom-8 lg:-right-8 lg:w-56 ${FLOAT}`}>
          <p className="px-1 text-[10px] font-bold uppercase tracking-[.12em] text-violet-700">Mathematics · Lesson</p>
          <p className="px-1 text-[13px] font-bold">Quadratic graphs</p>
          <img src="/img/mathematics/quadratic-graph.svg" alt="" width={240} height={180} loading="lazy" decoding="async" className="mt-1.5 aspect-[4/3] w-full rounded-lg bg-slate-50 object-cover object-top" />
        </div>

        {/* A marked question from the bank. */}
        <figure
          aria-label={`A marked question: ${before}${right.text}${after} Answer ${right.label} is correct.`}
          className={`absolute inset-x-3 -bottom-20 p-4 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[22rem] lg:-left-14 lg:bottom-12 ${FLOAT}`}
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
      </BrandPhoto>
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

  const items = [
    { value: totals.subjects, label: 'WASSCE subjects', short: 'subjects' },
    { value: totals.topics, label: 'syllabus topics', short: 'topics' },
    { value: totals.lessons, label: 'published lessons', short: 'lessons' },
    students >= STUDENT_PROOF_THRESHOLD
      ? { value: students, label: 'registered students', short: 'students' }
      : { value: PRACTICE_TOTAL, label: 'worked practice questions', short: 'questions' },
  ]

  const icons = [Library, Layers, BookOpen, students >= STUDENT_PROOF_THRESHOLD ? Users : ClipboardCheck]
  return (
    <div className="site-container pb-12 lg:pb-16">
      <dl className="grid grid-cols-2 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-900/[0.06] shadow-[0_1px_2px_rgba(23,28,43,.04),0_18px_40px_-24px_rgba(30,20,80,.28)] lg:grid-cols-4">
        {items.map(({ value, label }, i) => {
          const Icon = icons[i]
          return (
            <div key={label} className={`flex items-center gap-3.5 px-4 py-5 sm:px-6 sm:py-6 ${i % 2 === 1 ? 'border-l border-slate-100' : ''} ${i >= 2 ? 'border-t border-slate-100 lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}>
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--primary)] sm:flex">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <div className="flex min-w-0 flex-col-reverse">
                <dt className="text-[13px] font-medium leading-snug text-slate-500 sm:text-sm">{label}</dt>
                <dd className="text-2xl font-extrabold leading-none tracking-tight tabular-nums text-slate-900 sm:text-3xl">{value.toLocaleString('en')}</dd>
              </div>
            </div>
          )
        })}
      </dl>
      <ul className="mt-5 flex flex-col gap-2 text-[13px] text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-6 sm:text-sm">
        {PROVENANCE.map(({ Icon, text }) => (
          <li key={text} className="flex items-start gap-2 sm:items-center">
            <Icon className="mt-px h-4 w-4 shrink-0 text-[var(--primary)] sm:mt-0" aria-hidden />
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}
