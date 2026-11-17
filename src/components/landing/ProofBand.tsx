// The dark band under the hero: the library's live counts, which climb once
// they come into view, and what the content is (and is not), stated before
// anyone has to look for it. The prerendered HTML carries the build-time
// numbers; the browser refreshes them.
import { useEffect, useRef, useState } from 'react'
import { BookOpen, ClipboardCheck, Library, ListTree, PenLine, ScrollText, ShieldCheck, Users, type LucideIcon } from 'lucide-react'
import type { LandingData } from '@/lib/public-content'
import { PRACTICE_TOTAL } from '@/lib/practice-counts'
import { supabase } from '@/lib/supabase'

/** Students are shown as proof only once the number is large enough to be proof. */
const STUDENT_PROOF_THRESHOLD = 1000

const PROVENANCE = [
  { Icon: ShieldCheck, text: 'Independent study platform, not affiliated with WAEC' },
  { Icon: PenLine, text: 'Original WASSCE-style questions, not copied past papers' },
  { Icon: ScrollText, text: 'Lessons follow the Sierra Leone WASSCE syllabus' },
]

export function ProofBand({ initial }: { initial: LandingData['totals'] }) {
  const [totals, setTotals] = useState(initial)
  const [students, setStudents] = useState(0)
  const [counting, setCounting] = useState(false)
  const band = useRef<HTMLDivElement>(null)

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

  // Count up once, when the numbers come into view.
  useEffect(() => {
    const el = band.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCounting(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const items: { Icon: LucideIcon; value: number; label: string }[] = [
    { Icon: Library, value: totals.subjects, label: 'WASSCE subjects' },
    { Icon: ListTree, value: totals.topics, label: 'syllabus topics' },
    { Icon: BookOpen, value: totals.lessons, label: 'published lessons' },
    students >= STUDENT_PROOF_THRESHOLD
      ? { Icon: Users, value: students, label: 'registered students' }
      : { Icon: ClipboardCheck, value: PRACTICE_TOTAL, label: 'questions with full working' },
  ]

  return (
    <div ref={band} className="relative isolate overflow-hidden bg-[var(--site-ink)] text-white">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(50rem_20rem_at_90%_0%,rgba(124,77,255,.28),transparent_65%),radial-gradient(36rem_18rem_at_0%_100%,rgba(15,138,126,.18),transparent_60%)]" />
      <div className="site-container py-9 sm:py-11">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-4 lg:gap-0">
          {items.map(({ Icon, value, label }, i) => (
            <div key={label} className={`flex items-center gap-3.5 sm:gap-4 ${i > 0 ? 'lg:border-l lg:border-white/10 lg:pl-8' : ''}`}>
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.07] text-[#cdbcff] ring-1 ring-white/10 sm:flex" aria-hidden>
                <Icon className="h-[22px] w-[22px]" />
              </span>
              <div className="flex flex-col-reverse gap-1">
                <dt className="text-[13px] font-medium leading-snug text-white/65 sm:text-[14px]">{label}</dt>
                <dd className="text-[2rem] font-extrabold leading-none tracking-tight tabular-nums sm:text-[2.4rem]">
                  <CountUp value={value} run={counting} />
                </dd>
              </div>
            </div>
          ))}
        </dl>
        <ul className="mt-7 flex flex-col gap-2 border-t border-white/10 pt-6 text-[13px] text-white/70 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:text-sm">
          {PROVENANCE.map(({ Icon, text }) => (
            <li key={text} className="flex items-start gap-2 sm:items-center">
              <Icon className="mt-px h-4 w-4 shrink-0 text-[#b9a4ff] sm:mt-0" aria-hidden />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
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
