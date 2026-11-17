// Course rows: the catalogue as a course marketplace shows it. A tab per
// subject (the six with the most lessons), and under it a rail of that
// subject's topics as course cards, in syllabus order: cover, title, real
// length and lesson count, and whether a lesson is free. On a pointer device,
// hovering a card shows what the topic covers and its first lessons.
//
// Every number and title on a card comes from the database at build time
// (LandingData.courseRows). Nothing is rated or ranked that was not measured.
import { useRef, useState } from 'react'
import { ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, Clock, Gift } from 'lucide-react'
import type { CourseCard as Course, CourseRow } from '@/lib/public-content'
import { subjectPath, topicPath } from '@/lib/public-content'
import { PRACTICE_QUESTIONS } from '@/lib/practice-counts'
import { TopicCover } from '@/components/public/TopicCover'
import { Band, SectionHeading } from '@/components/public/Section'

/** "45 min", "2 h", "3 h 20 min", rounded to five minutes. */
function formatLength(minutes: number) {
  const m = Math.max(5, Math.round(minutes / 5) * 5)
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const rest = m % 60
  return rest ? `${h} h ${rest} min` : `${h} h`
}

export function CourseRows({ rows }: { rows: CourseRow[] }) {
  const [active, setActive] = useState(rows[0]?.subjectSlug ?? '')
  if (rows.length === 0) return null
  return (
    <Band tone="white" labelledBy="courses-heading">
      <SectionHeading
        id="courses-heading"
        eyebrow="Courses"
        title="Every topic is a short course."
        lede="Lessons in syllabus order, worked examples and practice questions with the full working. Every lesson is free."
        action={
          <a href="/wassce/subjects" className="site-link">
            All subjects <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        }
      />

      {/* Subject tabs, underlined like a catalogue's category bar. Scrolls sideways on phones. */}
      <div
        role="tablist"
        aria-label="Subjects"
        className="-mx-[var(--site-gutter)] mt-8 flex gap-1 overflow-x-auto border-b border-border px-[var(--site-gutter)] [scrollbar-width:none] sm:mx-0 sm:gap-2 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {rows.map((r) => (
          <button
            key={r.subjectSlug}
            type="button"
            role="tab"
            id={`course-tab-${r.subjectSlug}`}
            aria-selected={active === r.subjectSlug}
            aria-controls={`courses-${r.subjectSlug}`}
            onClick={() => setActive(r.subjectSlug)}
            className={`relative min-h-12 shrink-0 whitespace-nowrap px-3 text-[15px] font-bold transition-colors sm:px-4 ${
              active === r.subjectSlug
                ? 'text-foreground after:absolute after:inset-x-2 after:-bottom-px after:h-[3px] after:rounded-full after:bg-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {r.subjectName}
          </button>
        ))}
      </div>

      {rows.map((r) => (
        <div
          key={r.subjectSlug}
          id={`courses-${r.subjectSlug}`}
          role="tabpanel"
          aria-labelledby={`course-tab-${r.subjectSlug}`}
          hidden={active !== r.subjectSlug}
        >
          {/* Only the open tab's cards are rendered, to keep the prerendered page light on slow data. */}
          {active === r.subjectSlug && <SubjectRail row={r} />}
        </div>
      ))}
    </Band>
  )
}

function SubjectRail({ row }: { row: CourseRow }) {
  const rail = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const questions = PRACTICE_QUESTIONS[row.subjectSlug] ?? 0

  const onScroll = () => {
    const el = rail.current
    if (!el) return
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 })
  }
  const move = (direction: -1 | 1) => {
    const el = rail.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: reduce ? 'auto' : 'smooth' })
  }
  const arrow =
    'flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_6px_18px_-6px_rgba(23,28,43,.35)] ring-1 ring-slate-900/10 transition hover:ring-primary/40 disabled:pointer-events-none disabled:opacity-0'

  return (
    <>
      {/* The subject in one line, with the way into its full syllabus. */}
      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-[var(--background)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="text-lg font-bold tracking-tight">WASSCE {row.subjectName}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {row.topicCount} topics · {row.lessonCount} lessons{questions > 0 ? ` · ${questions.toLocaleString('en')} practice questions` : ''}
          </p>
        </div>
        <a href={subjectPath(row.subjectSlug)} className="site-btn site-btn-secondary shrink-0">
          Explore {row.subjectName} <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>

      <div className="relative mt-5">
        <div
          ref={rail}
          onScroll={onScroll}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${row.subjectName} topics`}
          className="site-rail -mx-[var(--site-gutter)] scroll-px-[var(--site-gutter)] px-[var(--site-gutter)] pb-3 pt-1 sm:gap-5"
        >
          {row.courses.map((c, i) => (
            <CourseCardView key={c.topicSlug} subjectSlug={row.subjectSlug} subjectName={row.subjectName} course={c} index={i} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 -left-5 -right-5 hidden items-center justify-between md:flex">
          <button type="button" onClick={() => move(-1)} disabled={edge.start} aria-label={`Previous ${row.subjectName} topics`} className={`pointer-events-auto -mt-16 ${arrow}`}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button type="button" onClick={() => move(1)} disabled={edge.end} aria-label={`More ${row.subjectName} topics`} className={`pointer-events-auto -mt-16 ${arrow}`}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </>
  )
}

function CourseCardView({ subjectSlug, subjectName, course: c, index }: { subjectSlug: string; subjectName: string; course: Course; index: number }) {
  return (
    <a
      href={topicPath(subjectSlug, c.topicSlug)}
      className="group relative flex w-[74%] flex-col rounded-xl outline-none sm:w-[calc((100%-1.25rem)/2)] md:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)]"
    >
      <TopicCover subjectSlug={subjectSlug} subjectName={subjectName} topicSlug={c.topicSlug} topicName={c.topicName} index={index} className="aspect-[16/9] rounded-xl ring-1 ring-slate-900/[0.07]" />
      <span className="flex flex-1 flex-col pt-3">
        <span className="line-clamp-2 text-[16px] font-bold leading-snug tracking-tight text-foreground group-hover:text-[var(--brand-strong)]">{c.topicName}</span>
        <span className="mt-1 text-[13px] text-muted-foreground">WASSCE {subjectName}</span>
        <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium text-slate-600 dark:text-slate-300">
          {c.minutes > 0 && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden /> {formatLength(c.minutes)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" aria-hidden /> {c.lessons} {c.lessons === 1 ? 'lesson' : 'lessons'}
          </span>
        </span>
        {c.freeLessons > 0 && (
          <span className="mt-2.5 inline-flex w-fit items-center gap-1 rounded bg-[#eceb98] px-2 py-0.5 text-[12px] font-bold text-[#3d3c0a]">
            <Gift className="h-3.5 w-3.5" aria-hidden /> Free
          </span>
        )}
      </span>

      {/* Preview on hover or keyboard focus (pointer devices only): what the topic covers. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 hidden flex-col rounded-xl bg-white p-5 text-slate-900 opacity-0 shadow-[0_24px_60px_-20px_rgba(30,20,80,.45)] ring-1 ring-slate-900/10 transition duration-200 [@media(hover:hover)]:flex group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-visible:ring-2 group-focus-visible:ring-[var(--primary)]"
      >
        <span className="text-[11px] font-bold uppercase tracking-[.12em] text-violet-700">{subjectName}</span>
        <span className="mt-1 line-clamp-2 text-[17px] font-bold leading-snug tracking-tight">{c.topicName}</span>
        {c.summary && <span className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-slate-600">{c.summary}</span>}
        <span className="mt-3 text-[11px] font-bold uppercase tracking-[.1em] text-slate-500">First lessons</span>
        <span className="mt-1.5 space-y-1.5">
          {c.firstLessons.map((t) => (
            <span key={t} className="flex gap-2 text-[13px] font-medium leading-snug">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={3} />
              <span className="line-clamp-1">{t}</span>
            </span>
          ))}
        </span>
        <span className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--primary)] text-sm font-bold text-white">
          {c.freeLessons > 0 ? 'Start the first lesson' : 'Open the topic'} <ArrowRight className="h-4 w-4" />
        </span>
      </span>
    </a>
  )
}
