// Homepage hero: the promise, the primary action, topic search, and proof.
//
// Height is the constraint. On a phone the hero ends, with its proof row, in
// about one screen, so the subject catalogue is the next thing a visitor
// meets. The lesson preview therefore appears only from tablet width up,
// beside the copy; on a phone the same topic leads the "Popular topics" rail
// below. The marked practice question that used to sit here is now a section
// visitors can answer themselves (TryQuestion).
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowRight, Check, CircleCheck, PenLine, ScrollText, ShieldCheck } from 'lucide-react'
import type { LandingData, PopularTopic } from '@/lib/public-content'
import { topicPath } from '@/lib/public-content'
import { topicPhoto, topicPhotoSrcSet } from '@/lib/topic-photos'
import { PRACTICE_TOTAL } from '@/lib/practice-counts'
import { supabase } from '@/lib/supabase'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { TopicSearch, type TopicShortcut } from '@/components/landing/TopicSearch'

const ASSURANCES = ['Free account, no card', 'Pay once, no auto-renewal', 'Works on any phone']

/** Hero buttons: compact enough to share one row from 360 px, the large size from 1024 px. */
const CTA_SIZE = 'px-3.5 text-sm sm:flex-none sm:px-5 lg:min-h-[3.375rem] lg:px-7 lg:text-base'

/** Shortcut chips: popular topics that have lessons, short enough to read as a chip. */
function shortcutsFrom(popular: PopularTopic[]): TopicShortcut[] {
  return popular
    .filter((t) => t.lessons > 0 && t.topicName.length <= 22)
    .slice(0, 3)
    .map((t) => ({ label: t.topicName, href: topicPath(t.subjectSlug, t.topicSlug) }))
}

export function Hero({ data }: { data: LandingData }) {
  const lead = data.popular[0]
  return (
    <section className="site-band-ink relative isolate overflow-hidden" aria-labelledby="hero-heading">
      <div aria-hidden className="site-hero-backdrop" />
      <div className="site-container relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 pb-7 pt-7 sm:pb-12 sm:pt-12 md:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] lg:gap-14 lg:pb-16 lg:pt-16">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pl-2.5 pr-3.5 text-[13px] font-semibold text-violet-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.18)]" aria-hidden />
            Built for the Sierra Leone WASSCE syllabus
          </p>
          <h1 id="hero-heading" className="site-display mt-5 md:max-lg:text-[2.75rem]">
            Your next grade starts{' '}
            <span className="bg-gradient-to-r from-[#e3d7ff] via-[#b9a2ff] to-[#8fdcf5] bg-clip-text text-transparent">with one topic.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg sm:leading-[1.65]">
            Clear lessons that follow the syllabus, WASSCE-style practice marked instantly, and a real tutor when you need one.
            {/* On a phone the line is worth more than the sentence. */}
            <span className="hidden sm:inline"> Start with the topic you find hardest.</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
            <Link to="/auth" className={`site-btn site-btn-light flex-1 ${CTA_SIZE}`}>
              Start learning free <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/tutors" className={`site-btn site-btn-glass flex-1 ${CTA_SIZE}`}>
              Book a tutor
            </Link>
          </div>
          <div className="mt-6 max-w-xl sm:mt-8">
            <TopicSearch shortcuts={shortcutsFrom(data.popular)} />
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-white/70 sm:mt-7 sm:gap-x-5 sm:text-sm">
            {ASSURANCES.map((t, i) => (
              // The third is self-evident to someone already on a phone.
              <li key={t} className={`items-center gap-1.5 ${i === 2 ? 'hidden sm:inline-flex' : 'inline-flex'}`}>
                <Check className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </div>

        {lead && <LessonPreview topic={lead} />}
      </div>
      <ProofRow initial={data.totals} />
    </section>
  )
}

/**
 * One preview, from tablet width up: a live topic with its first lesson
 * titles, exactly as listed on the topic page. Nothing overlaps it.
 */
function LessonPreview({ topic }: { topic: PopularTopic }) {
  const photo = topicPhoto(topic.subjectSlug, topic.topicSlug)
  return (
    <div className="hidden w-full max-w-[27rem] md:ml-auto md:block">
      <a
        href={topicPath(topic.subjectSlug, topic.topicSlug)}
        aria-label={`${topic.topicName}, ${topic.subjectName}: open this topic`}
        className="group block overflow-hidden rounded-2xl bg-white text-slate-900 shadow-[0_44px_90px_-36px_rgba(0,0,0,.85)] ring-1 ring-white/10 transition-transform duration-300 ease-out hover:-translate-y-1"
      >
        <span className="relative block aspect-[16/8] overflow-hidden bg-slate-200">
          {photo ? (
            <img
              src={photo.src}
              srcSet={topicPhotoSrcSet(photo)}
              sizes="(min-width: 768px) 432px, 1px"
              alt={photo.caption}
              width={960}
              height={600}
              loading="lazy"
              decoding="async"
              className={`h-full w-full object-cover ${photo.position ?? ''}`}
            />
          ) : (
            <SubjectCover slug={topic.subjectSlug} shape="wide" rounded="rounded-none" className="h-full w-full" />
          )}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <span className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3">
            <span className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[.14em] text-white/85">{topic.subjectName}</span>
              <span className="mt-0.5 block truncate text-xl font-extrabold tracking-tight text-white">{topic.topicName}</span>
            </span>
            <span className="shrink-0 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-900">
              {topic.lessons} {topic.lessons === 1 ? 'lesson' : 'lessons'}
            </span>
          </span>
        </span>
        <ol className="divide-y divide-slate-100 px-5">
          {topic.firstLessons.map((lesson, i) => (
            <li key={lesson.title} className="flex items-center gap-3 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-bold tabular-nums text-violet-700">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{lesson.title}</span>
              {lesson.free ? (
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">Free</span>
              ) : lesson.minutes ? (
                <span className="shrink-0 text-xs font-medium tabular-nums text-slate-500">{lesson.minutes} min</span>
              ) : null}
            </li>
          ))}
        </ol>
        <span className="flex items-center justify-between gap-2 border-t border-slate-100 px-5 py-3.5 text-sm font-bold text-violet-700">
          Open this topic
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>
      </a>
      <a
        href="#try-a-question"
        className="mt-3 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white/80 transition hover:border-white/35 hover:bg-white/[0.1]"
      >
        <CircleCheck className="h-5 w-5 shrink-0 text-emerald-300" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="font-bold text-white">Practice is marked instantly.</span> Try a question below.
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 rotate-90" aria-hidden />
      </a>
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
