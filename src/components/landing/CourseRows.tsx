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
import { topicPhoto, topicPhotoSrcSet } from '@/lib/topic-photos'
import { PRACTICE_QUESTIONS } from '@/lib/practice-counts'
import { subjectArt } from '@/components/ds/SubjectCover'
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
        lede="Lessons in syllabus order, worked examples and practice. The first lesson of every topic is free."
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
      className="group relative flex w-[74%] flex-col rounded-2xl outline-none sm:w-[calc((100%-1.25rem)/2)] md:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)]"
    >
      <CourseCover subjectSlug={subjectSlug} subjectName={subjectName} course={c} index={index} />
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
          <span className="mt-2.5 inline-flex w-fit items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[12px] font-bold text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800">
            <Gift className="h-3.5 w-3.5" aria-hidden /> Free lesson
          </span>
        )}
      </span>

      {/* Preview on hover or keyboard focus (pointer devices only): what the topic covers. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 hidden flex-col rounded-2xl bg-white p-5 text-slate-900 opacity-0 shadow-[0_24px_60px_-20px_rgba(30,20,80,.45)] ring-1 ring-slate-900/10 transition duration-200 [@media(hover:hover)]:flex group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-visible:ring-2 group-focus-visible:ring-[var(--primary)]"
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
          {c.freeLessons > 0 ? 'Start the free lesson' : 'Open the topic'} <ArrowRight className="h-4 w-4" />
        </span>
      </span>
    </a>
  )
}

/** Cover colours, cycled along a row so neighbouring cards never match. */
const COVERS = [
  ['#5b34d6', '#3a1d9e'],
  ['#1f6fd1', '#173f8f'],
  ['#0f8a7e', '#0b5b5f'],
  ['#c2410c', '#8a2a07'],
  ['#be185d', '#7e1242'],
  ['#2f3a8f', '#161c4f'],
  ['#15803d', '#0d5129'],
  ['#7c3aed', '#4c1d95'],
]

/**
 * The card's cover: the topic's own photograph when there is one, otherwise
 * a typographic cover on the subject's colour with the topic's name set
 * large, so every card in a row is different without stock imagery.
 */
function CourseCover({ subjectSlug, subjectName, course: c, index }: { subjectSlug: string; subjectName: string; course: Course; index: number }) {
  const photo = topicPhoto(subjectSlug, c.topicSlug)
  const art = subjectArt(subjectSlug)
  // Start the cycle at the subject's own colour family.
  const offset = Math.max(0, COVERS.findIndex(([c]) => c.toLowerCase() === art.bg.toLowerCase()))
  const [from, to] = COVERS[(offset + index) % COVERS.length]
  return (
    <span className="relative block aspect-[16/9] overflow-hidden rounded-2xl bg-muted ring-1 ring-slate-900/5 shadow-[0_1px_2px_rgba(23,28,43,.06),0_12px_24px_-16px_rgba(30,20,80,.35)]">
      {photo ? (
        <>
          <img
            src={photo.small}
            srcSet={topicPhotoSrcSet(photo)}
            sizes="(min-width: 1024px) 290px, (min-width: 640px) 46vw, 74vw"
            alt=""
            loading="lazy"
            decoding="async"
            width={960}
            height={600}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${photo.position ?? ''}`}
          />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
          <span aria-hidden className="absolute bottom-2.5 left-3 right-3 line-clamp-1 text-[13px] font-bold text-white drop-shadow">{subjectName}</span>
        </>
      ) : (
        <span aria-hidden className="absolute inset-0 flex flex-col justify-between p-3.5" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
          <span
            className="absolute inset-0 opacity-60"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.22) 1px, transparent 1px)', backgroundSize: '14px 14px' }}
          />
          <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[14px] border-white/10" />
          <span className="relative flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: art.accent }} />
            {subjectName}
          </span>
          <span className="relative line-clamp-3 max-w-[90%] text-[19px] font-extrabold leading-[1.12] tracking-tight text-white">{c.topicName}</span>
        </span>
      )}
    </span>
  )
}
