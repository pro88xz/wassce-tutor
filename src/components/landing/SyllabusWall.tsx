// The syllabus wall: the whole WASSCE syllabus as one answer sheet. Every
// subject is a row and every topic a bubble: first the topics with lessons,
// in syllabus order, shaded in the subject's colour (each a link to its
// page), then an open bubble for every topic whose lessons are still to come. The bubbles shade in, row by row,
// as the wall scrolls into view. Above it, the live counts climb.
//
// It shows the size of the library honestly, in one look: nothing is shaded
// that a student cannot open today. It also links the homepage to every
// topic page.
//
// Keyboard and screen-reader users get the same content through the subject
// names (links to each subject's full topic list), so the hundreds of bubbles
// stay out of the tab order.
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, PenLine, ScrollText, ShieldCheck } from 'lucide-react'
import type { LandingData, SyllabusRow } from '@/lib/public-content'
import { subjectPath, topicPath } from '@/lib/public-content'
import { PRACTICE_TOTAL } from '@/lib/practice-counts'
import { supabase } from '@/lib/supabase'
import { subjectArt } from '@/components/ds/SubjectCover'

/** Students are shown as proof only once the number is large enough to be proof. */
const STUDENT_PROOF_THRESHOLD = 1000

/** What the content is, and what the platform is not: stated before anyone has to look for it. */
const PROVENANCE = [
  { Icon: ShieldCheck, text: 'Independent study platform, not affiliated with WAEC' },
  { Icon: PenLine, text: 'Original WASSCE-style questions, not copied past papers' },
  { Icon: ScrollText, text: 'Lessons follow the Sierra Leone WASSCE syllabus' },
]

const plural = (n: number, one: string) => `${n} ${n === 1 ? one : `${one}s`}`

export function SyllabusWall({ data }: { data: LandingData }) {
  const [totals, setTotals] = useState(data.totals)
  const [students, setStudents] = useState(0)
  const [counting, setCounting] = useState(false)
  const section = useRef<HTMLElement>(null)

  // The prerendered HTML carries the build-time numbers; the browser refreshes them.
  useEffect(() => {
    let active = true
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

  // Count up once, when the numbers come into view.
  useEffect(() => {
    const el = section.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCounting(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const open = data.syllabus.reduce((n, r) => n + r.topics.length, 0)
  const stats = [
    { value: totals.subjects, label: 'WASSCE subjects' },
    { value: totals.topics, label: 'syllabus topics' },
    { value: totals.lessons, label: 'published lessons' },
    students >= STUDENT_PROOF_THRESHOLD
      ? { value: students, label: 'registered students' }
      : { value: PRACTICE_TOTAL, label: 'questions with full working' },
  ]

  return (
    <section ref={section} aria-labelledby="syllabus-heading" className="relative isolate overflow-hidden bg-[var(--site-ink)] text-white">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_30rem_at_85%_0%,rgba(124,77,255,.32),transparent_65%),radial-gradient(44rem_28rem_at_0%_100%,rgba(15,138,126,.22),transparent_60%)]" />
      <div className="site-container py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-3xl">
            <p className="site-eyebrow !text-[#cdbcff]">The whole syllabus, on one sheet</p>
            <h2 id="syllabus-heading" className="site-h2 mt-3">
              {totals.topics.toLocaleString('en')} topics. <span className="site-accent text-[#cdbcff]">Shaded as we teach them.</span>
            </h2>
            <p className="site-lede mt-4 !text-white/70">
              Every topic of the WASSCE syllabus, subject by subject. A shaded bubble is a topic you can open and study today; the open ones are on the way.
            </p>
          </div>
          <a href="/wassce/subjects" className="site-link shrink-0 !text-[#d9ccff] hover:!text-white">
            Browse every subject <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-y border-white/10 py-7 lg:grid-cols-4 lg:gap-0">
          {stats.map(({ value, label }, i) => (
            <div key={label} className={`flex flex-col-reverse gap-1.5 ${i > 0 ? 'lg:border-l lg:border-white/10 lg:pl-8' : ''}`}>
              <dt className="text-[13px] font-medium leading-snug text-white/65 sm:text-[15px]">{label}</dt>
              <dd className="text-[2rem] font-extrabold leading-none tracking-tight tabular-nums sm:text-[2.6rem]">
                <CountUp value={value} run={counting} />
              </dd>
            </div>
          ))}
        </dl>

        <div data-reveal className="syllabus-wall mt-10 grid grid-cols-[minmax(0,1fr)] gap-y-5 sm:gap-y-3 lg:grid-cols-[12.5rem_minmax(0,1fr)] lg:gap-x-8 lg:gap-y-2.5">
          {data.syllabus.map((row, r) => (
            <WallRow key={row.slug} row={row} index={r} />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-white/70">
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#b9a4ff] shadow-[0_0_10px_rgba(185,164,255,.6)]" aria-hidden /> {plural(open, 'topic')} with lessons, open now
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.3)]" aria-hidden /> Lessons on the way
            </span>
          </p>
          <ul className="flex flex-col gap-2 text-[13px] text-white/70 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {PROVENANCE.map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-2 sm:items-center">
                <Icon className="mt-px h-4 w-4 shrink-0 text-[#b9a4ff] sm:mt-0" aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/** One subject: its name (the accessible way in) and a bubble per topic. */
function WallRow({ row, index }: { row: SyllabusRow; index: number }) {
  const fill = `color-mix(in srgb, ${subjectArt(row.slug).bg} 72%, #fff)`
  return (
    <>
      <a href={subjectPath(row.slug)} className="group flex items-baseline justify-between gap-3 rounded-md lg:block">
        <span className="text-[14px] font-bold text-white transition-colors group-hover:text-[#d9ccff]">{row.name}</span>
        <span className="text-[12px] font-medium tabular-nums text-white/50 lg:ml-2">
          {row.topics.length}/{row.topics.length + row.planned}
          <span className="sr-only"> topics with lessons</span>
        </span>
      </a>
      <div aria-hidden className="flex flex-wrap gap-[4px] [--bubble:11px] sm:gap-[5px] sm:[--bubble:12px] lg:pt-[3px] xl:gap-[6px] xl:[--bubble:12px]" style={{ ['--row' as string]: index }}>
        {row.topics.map((t, i) => (
          <a
            key={t.slug}
            href={topicPath(row.slug, t.slug)}
            tabIndex={-1}
            data-name={`${t.name} · ${plural(t.lessons, 'lesson')}`}
            className="wall-bubble is-shaded"
            style={{ ['--fill' as string]: fill, ['--i' as string]: i }}
          />
        ))}
        {Array.from({ length: row.planned }, (_, i) => (
          <span key={i} className="wall-bubble is-open" />
        ))}
      </div>
    </>
  )
}

/** A number that climbs to its value once `run` turns on; the plain number otherwise (prerender, reduced motion). */
function CountUp({ value, run }: { value: number; run: boolean }) {
  // null: show the value itself. A number: the count is still climbing.
  const [shown, setShown] = useState<number | null>(null)
  useEffect(() => {
    if (!run) return
    const start = performance.now()
    const duration = 1400
    let frame = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      setShown(p < 1 ? Math.round(value * (1 - Math.pow(1 - p, 3))) : null)
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [run, value])
  return <>{(shown ?? value).toLocaleString('en')}</>
}
