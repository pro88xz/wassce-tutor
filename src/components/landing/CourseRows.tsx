// Course rows: the catalogue as a course marketplace shows it. A tab per
// subject (the six with the most lessons), and under it a rail of that
// subject's topics as course cards, in syllabus order: cover, title, real
// length and lesson count, and whether a lesson is free. On a pointer device,
// hovering a card shows what the topic covers and its first lessons.
//
// Every number and title on a card comes from the database at build time
// (LandingData.courseRows). Nothing is rated or ranked that was not measured.
import { useRef, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { CourseRow } from '@/lib/public-content'
import { subjectPath } from '@/lib/public-content'
import { PRACTICE_QUESTIONS } from '@/lib/practice-counts'
import { CourseCard } from '@/components/public/CourseCard'
import { coverColours } from '@/components/public/cover-colours'
import { subjectArt } from '@/components/ds/SubjectCover'
import { Band, SectionHeading } from '@/components/public/Section'
import { subjectTheme } from '@/lib/subject-theme'

export function CourseRows({ rows }: { rows: CourseRow[] }) {
  const [active, setActive] = useState(rows[0]?.subjectSlug ?? '')
  if (rows.length === 0) return null
  return (
    <Band tone="white" labelledBy="courses-heading">
      <SectionHeading
        id="courses-heading"
        eyebrow="Courses"
        title={<>Every topic is a <span className="site-accent text-[var(--primary)]">short course.</span></>}
        lede="Lessons in syllabus order, worked examples and practice questions with the full working. Every lesson is free."
        action={
          <a href="/wassce/subjects" className="site-link">
            All subjects <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        }
      />

      {/* Subject tiles: the subject's icon in its own colours, its name and how many lessons it has.
          The chosen one turns ink. A swipeable row on phones. */}
      <div
        role="tablist"
        aria-label="Subjects"
        className="-mx-[var(--site-gutter)] -mb-5 mt-8 flex gap-2.5 overflow-x-auto px-[var(--site-gutter)] pb-8 pt-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {rows.map((r) => {
          const on = active === r.subjectSlug
          const { icon: Icon } = subjectTheme(r.subjectSlug)
          const [from, to] = coverColours(r.subjectSlug, 0)
          return (
            <button
              key={r.subjectSlug}
              type="button"
              role="tab"
              id={`course-tab-${r.subjectSlug}`}
              aria-selected={on}
              aria-controls={`courses-${r.subjectSlug}`}
              onClick={() => setActive(r.subjectSlug)}
              className={`flex min-h-14 shrink-0 items-center gap-3 rounded-2xl py-2 pl-2 pr-4 text-left ring-1 transition-all duration-300 ${
                on
                  ? 'bg-[var(--site-ink)] text-white ring-transparent shadow-[0_16px_30px_-16px_rgba(19,13,43,.75)]'
                  : 'bg-card text-foreground ring-border hover:-translate-y-0.5 hover:shadow-[var(--site-shadow-card)] hover:ring-[color-mix(in_srgb,var(--primary)_35%,var(--border))]'
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.15)]" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} aria-hidden>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block whitespace-nowrap text-[15px] font-bold leading-tight">{r.subjectName}</span>
                <span className={`mt-0.5 block text-[12px] font-medium tabular-nums ${on ? 'text-white/65' : 'text-muted-foreground'}`}>{r.lessonCount} lessons</span>
              </span>
            </button>
          )
        })}
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
  const [from, to] = coverColours(row.subjectSlug, 0)
  const art = subjectArt(row.subjectSlug)

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
      {/* The subject as a banner in its own colours, with its size and the way into its full syllabus. */}
      <div className="relative isolate mt-5 overflow-hidden rounded-[22px] p-5 text-white shadow-[0_24px_50px_-30px_rgba(19,13,43,.6)] sm:p-7" style={{ background: `linear-gradient(120deg, ${from}, ${to})` }}>
        <span aria-hidden className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(90deg,transparent,#000_60%)]" />
        <svg aria-hidden viewBox="-64 -64 128 128" className="absolute -bottom-20 right-[14rem] -z-10 hidden h-64 w-64 opacity-[.16] lg:block">
          {art.motif(art.accent)}
        </svg>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-white/70">WASSCE course</p>
            <p className="mt-1 text-[1.6rem] font-extrabold leading-tight tracking-tight sm:text-[1.9rem]">{row.subjectName}</p>
            <ul className="mt-3.5 flex flex-wrap gap-2 text-[13px] font-semibold">
              {[`${row.topicCount} topics`, `${row.lessonCount} lessons`, ...(questions > 0 ? [`${questions.toLocaleString('en')} practice questions`] : []), 'Every lesson free'].map((t) => (
                <li key={t} className="rounded-full bg-white/15 px-3 py-1 ring-1 ring-white/20 backdrop-blur-sm">{t}</li>
              ))}
            </ul>
          </div>
          <a href={subjectPath(row.subjectSlug)} className="site-btn site-btn-light shrink-0 self-start sm:self-auto">
            Explore {row.subjectName} <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>

      <div className="relative mt-5">
        <div
          ref={rail}
          onScroll={onScroll}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${row.subjectName} topics`}
          className="site-rail -mx-[var(--site-gutter)] -mb-6 scroll-px-[var(--site-gutter)] px-[var(--site-gutter)] pb-9 pt-2 sm:gap-5"
        >
          {row.courses.map((c, i) => (
            <CourseCard
              key={c.topicSlug}
              subjectSlug={row.subjectSlug}
              subjectName={row.subjectName}
              course={c}
              index={i}
              preview
              className="w-[74%] sm:w-[calc((100%-1.25rem)/2)] md:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)]"
            />
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
