// Homepage hero: the promise, the two primary actions, topic search, and a
// preview of the product built only from real content: a live topic with its
// first lesson titles, and a question from the practice bank shown the way
// students see it marked. The proof row beneath uses live counts.
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowRight, Check, CircleCheck, CircleX } from 'lucide-react'
import type { LandingData, PopularTopic } from '@/lib/public-content'
import { topicPath } from '@/lib/public-content'
import { topicPhoto } from '@/lib/topic-photos'
import { PRACTICE_QUESTIONS } from '@/lib/practice-counts'
import { supabase } from '@/lib/supabase'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { TopicSearch } from '@/components/landing/TopicSearch'

const ASSURANCES = ['Free account, no card', 'Pay once, no auto-renewal', 'Works on any phone']

export function Hero({ data }: { data: LandingData }) {
  return (
    <section className="site-band-ink relative isolate overflow-hidden" aria-labelledby="hero-heading">
      <div aria-hidden className="site-hero-backdrop" />
      <div className="site-container relative grid grid-cols-[minmax(0,1fr)] items-center gap-12 pb-14 pt-12 sm:pb-16 sm:pt-16 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,.96fr)] lg:gap-14 lg:pb-20 lg:pt-20">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pl-2.5 pr-3.5 text-[13px] font-semibold text-violet-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.18)]" aria-hidden />
            Built for the Sierra Leone WASSCE syllabus
          </p>
          <h1 id="hero-heading" className="site-display mt-6">
            Your next grade starts{' '}
            <span className="bg-gradient-to-r from-[#e3d7ff] via-[#b9a2ff] to-[#8fdcf5] bg-clip-text text-transparent">with one topic.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-[1.65] text-white/72 sm:text-lg">
            Clear lessons for every subject, WASSCE-style practice marked instantly, and a real tutor when you need one. All organised around your syllabus.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/auth" className="site-btn site-btn-lg site-btn-light">
              Start learning free <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/tutors" className="site-btn site-btn-lg site-btn-glass">
              Book a tutor
            </Link>
          </div>
          <div className="mt-8 max-w-xl">
            <TopicSearch />
          </div>
          <ul className="mt-7 flex flex-col gap-x-6 gap-y-2 text-sm font-medium text-white/70 sm:flex-row sm:flex-wrap">
            {ASSURANCES.map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </div>

        {data.popular[0] && <ProductPreview topic={data.popular[0]} />}
      </div>
      <ProofRow initial={data.totals} />
    </section>
  )
}

/**
 * A real question from the Mathematics practice bank (maths-percentages-01),
 * shown as marked: the chosen wrong answer, the right one, and the reason the
 * wrong option is wrong, which every question in the bank carries.
 */
const SAMPLE_QUESTION = {
  subject: 'Mathematics',
  topic: 'Percentages',
  stem: 'Mrs Kamara bought a bag of rice for Le 640 and sold it for Le 720. Find her percentage profit.',
  options: [
    { label: 'A', text: '11.1%', state: 'wrong' },
    { label: 'B', text: '12.5%', state: 'correct' },
    { label: 'C', text: '80%', state: 'idle' },
    { label: 'D', text: '112.5%', state: 'idle' },
  ],
  feedback: 'You divided the profit by the selling price. Percentage profit is worked out on the cost price.',
} as const

const OPTION_STYLE = {
  wrong: 'border-rose-200 bg-rose-50 text-rose-900',
  correct: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  idle: 'border-slate-200 bg-white text-slate-700',
} as const

function ProductPreview({ topic }: { topic: PopularTopic }) {
  const photo = topicPhoto(topic.subjectSlug, topic.topicSlug)
  return (
    <div className="relative mx-auto w-full max-w-[34rem] lg:mx-0 lg:ml-auto" aria-label="A lesson outline and a marked practice question from WASSCE Tutor">
      {/* Lesson outline: a live topic and its first lessons. */}
      <a
        href={topicPath(topic.subjectSlug, topic.topicSlug)}
        className="group relative ml-auto block w-[90%] overflow-hidden rounded-2xl bg-white text-slate-900 shadow-[0_44px_90px_-36px_rgba(0,0,0,.85)] ring-1 ring-white/10 transition-transform duration-300 ease-out hover:-translate-y-1 sm:w-[84%]"
      >
        <span className="relative block aspect-[16/8] overflow-hidden bg-slate-200">
          {photo ? (
            <img
              src={photo.src}
              srcSet={`${photo.small} 480w, ${photo.src} 960w`}
              sizes="(min-width: 1024px) 460px, 90vw"
              alt={photo.caption}
              width={960}
              height={600}
              fetchPriority="high"
              decoding="async"
              className={`h-full w-full object-cover ${photo.position ?? ''}`}
            />
          ) : (
            <SubjectCover slug={topic.subjectSlug} shape="wide" rounded="rounded-none" className="h-full w-full" priority />
          )}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <span className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3">
            <span className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[.14em] text-white/85">{topic.subjectName}</span>
              <span className="mt-0.5 block truncate text-lg font-extrabold tracking-tight text-white sm:text-xl">{topic.topicName}</span>
            </span>
            <span className="shrink-0 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-900">
              {topic.lessons} {topic.lessons === 1 ? 'lesson' : 'lessons'}
            </span>
          </span>
        </span>
        <ol className="divide-y divide-slate-100 px-4 sm:px-5">
          {topic.firstLessons.map((lesson, i) => (
            <li key={lesson.title} className="flex items-center gap-3 py-2.5 sm:py-3">
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
        <span className="flex items-center justify-end gap-2 border-t border-slate-100 px-4 py-3.5 text-sm font-bold text-violet-700 sm:px-5">
          Open this topic
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>
      </a>

      {/* Practice: a real question, marked. */}
      <div className="relative z-10 mt-3 w-[90%] rounded-2xl bg-white p-4 text-slate-900 shadow-[0_36px_70px_-30px_rgba(0,0,0,.8)] ring-1 ring-slate-900/5 sm:-mt-9 sm:w-[62%] sm:p-5">
        <p className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[.14em]">
          <span className="text-violet-700">Practice · {SAMPLE_QUESTION.subject}</span>
          <span className="font-semibold normal-case tracking-normal text-slate-500">{SAMPLE_QUESTION.topic}</span>
        </p>
        <p className="mt-2.5 text-sm font-semibold leading-snug">{SAMPLE_QUESTION.stem}</p>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {SAMPLE_QUESTION.options.map((o) => (
            <li key={o.label} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm font-semibold tabular-nums ${OPTION_STYLE[o.state]}`}>
              <span className="text-xs font-bold opacity-60">{o.label}</span>
              <span className="flex-1">{o.text}</span>
              {o.state === 'correct' && <CircleCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-label="Correct answer" />}
              {o.state === 'wrong' && <CircleX className="h-4 w-4 shrink-0 text-rose-500" aria-label="Chosen answer, incorrect" />}
            </li>
          ))}
        </ul>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-600">
          <span className="font-bold text-slate-900">Why A is wrong. </span>
          {SAMPLE_QUESTION.feedback}
        </p>
      </div>

      <div className="absolute bottom-6 right-0 hidden w-[33%] rounded-2xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-md sm:block">
        <CircleCheck className="h-5 w-5 text-emerald-300" aria-hidden />
        <p className="mt-2.5 text-sm font-bold leading-snug text-white">Marked instantly</p>
        <p className="mt-1 text-xs leading-relaxed text-white/65">Full working, and why each wrong option is wrong.</p>
      </div>
    </div>
  )
}

/** Students are shown as proof only once the number is large enough to be proof. */
const STUDENT_PROOF_THRESHOLD = 1000

/** Live counts. The prerendered HTML carries the build-time numbers; the browser refreshes them. */
function ProofRow({ initial }: { initial: LandingData['totals'] }) {
  const [totals, setTotals] = useState(initial)
  const [students, setStudents] = useState(0)

  useEffect(() => {
    let active = true
    void Promise.all([
      supabase.from('subjects').select('id', { count: 'exact', head: true }),
      supabase.from('topics').select('id', { count: 'exact', head: true }),
      supabase.from('wassce_lesson_index').select('id', { count: 'exact', head: true }),
      supabase.rpc('get_public_student_count'),
    ]).then(([subjects, topics, lessons, registered]) => {
      if (!active) return
      setTotals((current) => ({
        subjects: subjects.error || subjects.count === null ? current.subjects : subjects.count,
        topics: topics.error || topics.count === null ? current.topics : topics.count,
        lessons: lessons.error || lessons.count === null ? current.lessons : lessons.count,
      }))
      if (!registered.error && registered.data !== null) setStudents(Number(registered.data))
    })
    return () => {
      active = false
    }
  }, [])

  const practice = Object.values(PRACTICE_QUESTIONS).reduce((sum, n) => sum + n, 0)
  const items = [
    { value: totals.subjects, label: 'WASSCE subjects' },
    { value: totals.topics, label: 'syllabus topics' },
    { value: totals.lessons, label: 'published lessons' },
    students >= STUDENT_PROOF_THRESHOLD
      ? { value: students, label: 'registered students' }
      : { value: practice, label: 'worked practice questions' },
  ]

  return (
    <div className="relative border-t border-white/10 bg-black/15">
      <dl className="site-container grid grid-cols-2 lg:grid-cols-4">
        {items.map(({ value, label }, i) => (
          <div
            key={label}
            className={`flex flex-col-reverse justify-end gap-1 py-6 sm:py-7 lg:px-8 lg:first:pl-0 ${i % 2 === 1 ? 'border-l border-white/10 pl-5 lg:pl-8' : ''} ${i >= 2 ? 'border-t border-white/10 lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}
          >
            <dt className="text-[13px] font-medium leading-snug text-white/60 sm:text-sm">{label}</dt>
            <dd className="text-[2rem] font-extrabold leading-none tracking-tight tabular-nums text-white sm:text-4xl">{value.toLocaleString('en')}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
