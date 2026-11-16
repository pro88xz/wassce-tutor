// The subject catalogue: the one subject card, and the faculty-tabbed grid of
// them that the homepage and /wassce/subjects share.
//
// A card says what a subject holds today, in the same place on every card:
// practice questions, lessons, or the syllabus outline while its lessons are
// written. Within a faculty the subjects a student can study now come first.
// Every panel is in the prerendered HTML (crawlable links); only the active
// one is shown.
import { useState } from 'react'
import { ArrowRight, BookOpen, ClipboardCheck, Compass, ListTree, type LucideIcon } from 'lucide-react'
import type { SubjectSummary } from '@/lib/public-content'
import { subjectPath } from '@/lib/public-content'
import { PRACTICE_QUESTIONS } from '@/lib/practice-counts'
import { inFacultyOrder, inCatalogueOrder, overallBadge, readinessOf, type Readiness } from '@/lib/catalogue'
import { SubjectCover } from '@/components/ds/SubjectCover'

const STATUS: Record<Readiness, { tone: string; Icon: LucideIcon }> = {
  practice: { tone: 'bg-success/10 text-success', Icon: ClipboardCheck },
  lessons: { tone: 'bg-brand-soft text-brand-strong', Icon: BookOpen },
  outline: { tone: 'bg-muted text-muted-foreground', Icon: ListTree },
}

/** The width a catalogue card's cover is shown at, so phones download the 400 px copy. */
const COVER_SIZES = '(min-width: 1280px) 290px, (min-width: 1024px) 23vw, (min-width: 768px) 31vw, 46vw'

export function SubjectCard({ s, badge }: { s: SubjectSummary; badge: string }) {
  const available = s.topicCount > 0
  const readiness = readinessOf(s)
  const { tone, Icon } = STATUS[readiness]
  const status = !available
    ? 'In preparation'
    : readiness === 'practice'
      ? `${PRACTICE_QUESTIONS[s.slug]} questions`
      : readiness === 'lessons'
        ? 'Lessons ready'
        : 'Syllabus outline'
  const body = (
    <>
      <span className="relative block">
        <SubjectCover slug={s.slug} shape="wide" rounded="rounded-none" sizes={COVER_SIZES} className="aspect-[16/10] w-full" />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold leading-none text-slate-900 shadow-sm">{badge}</span>
      </span>
      <span className="flex flex-1 flex-col p-3.5 sm:p-4">
        <span className="site-h3 text-[15px] sm:text-[17px]">{s.name}</span>
        <span className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
          {available ? `${s.topicCount} topics${s.lessonCount > 0 ? ` · ${s.lessonCount} lessons` : ''}` : 'Syllabus in preparation'}
        </span>
        <span className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className={`inline-flex min-w-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold leading-none ${tone}`}>
            {/* The icon is dropped on phones, where two cards share the row and the label needs the width. */}
            <Icon className="hidden h-3.5 w-3.5 shrink-0 sm:block" aria-hidden />
            <span className="truncate">{status}</span>
          </span>
          {available && <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" aria-hidden />}
        </span>
      </span>
    </>
  )
  const cls = 'site-card group flex h-full flex-col overflow-hidden'
  return available ? (
    <a href={subjectPath(s.slug)} className={`${cls} site-card-link`}>{body}</a>
  ) : (
    <div className={`${cls} opacity-70`}>{body}</div>
  )
}

// The catalogue always ends on a full row. When a faculty's subjects leave
// empty cells in the last row, a guide tile spans them: these maps turn the
// number of cards left over on a 2, 3 or 4 column grid into that span.
// (Literal class names, so Tailwind generates them.)
const FILL_2 = ['hidden', 'flex col-span-1']
const FILL_3 = ['md:hidden', 'md:flex md:col-span-2', 'md:flex md:col-span-1']
const FILL_4 = ['lg:hidden', 'lg:flex lg:col-span-3', 'lg:flex lg:col-span-2', 'lg:flex lg:col-span-1']

/** Fills the catalogue's last row and routes undecided visitors to the WASSCE guide. */
function GuideTile({ count }: { count: number }) {
  return (
    <a
      href="/wassce"
      className={`group relative isolate flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#6d3fe6] via-[#5530cf] to-[#3a1d9e] p-4 text-white shadow-[0_24px_48px_-28px_rgba(58,29,158,.7)] transition-transform duration-300 hover:-translate-y-[3px] sm:p-6 ${FILL_2[count % 2]} ${FILL_3[count % 3]} ${FILL_4[count % 4]}`}
    >
      <span aria-hidden className="absolute -right-10 -top-10 -z-10 h-40 w-40 rounded-full border-[20px] border-white/10" />
      <span aria-hidden className="absolute -bottom-8 -right-8 -z-10 h-24 w-24 rounded-full bg-[#ffd166]/85" />
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
        <Compass className="h-5 w-5 text-white" aria-hidden />
      </span>
      <span>
        <span className="block text-[15px] font-bold leading-snug tracking-tight sm:text-xl">Not sure which subjects you sit?</span>
        <span className="mt-2 hidden text-sm leading-relaxed text-white/80 sm:block">The WASSCE guide explains each faculty, the core subjects and how the exam is graded.</span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#ffd166] sm:mt-4 sm:text-sm">
          Read the guide <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>
      </span>
    </a>
  )
}

const ALL = 'all'

/**
 * Faculty tabs over one grid of subject cards. `withAll` adds a first tab
 * that lists every subject once (the /wassce/subjects page).
 */
export function SubjectCatalogue({ subjects, withAll = false }: { subjects: SubjectSummary[]; withAll?: boolean }) {
  const faculties = [...new Map(subjects.filter((s) => s.topicCount > 0).flatMap((s) => s.faculties.map((f) => [f.faculty.id, f.faculty] as const))).values()].sort(
    (a, b) => a.sort_order - b.sort_order,
  )
  const tabs = [...(withAll ? [{ id: ALL, name: 'All subjects' }] : []), ...faculties.map((f) => ({ id: f.id, name: f.name }))]
  const [active, setActive] = useState(tabs[0]?.id ?? '')

  return (
    <>
      <div
        role="tablist"
        aria-label="Faculties"
        className={`flex gap-1 rounded-xl bg-muted p-1 sm:inline-flex ${withAll ? 'max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' : ''}`}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`faculty-tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`faculty-${t.id}`}
            onClick={() => setActive(t.id)}
            className={`min-h-11 whitespace-nowrap rounded-lg text-[13px] font-semibold transition-colors sm:flex-none sm:px-6 sm:text-sm ${
              withAll ? 'flex-none px-3.5' : 'min-w-0 flex-1 px-1.5'
            } ${active === t.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {tabs.map((t) => {
        const faculty = faculties.find((f) => f.id === t.id)
        const roleIn = (s: SubjectSummary) => s.faculties.find((x) => x.faculty.id === t.id)?.role
        // Only subjects with a syllabus are listed, so the grid matches the subject count the page states.
        const listed = subjects.filter((s) => s.topicCount > 0)
        const list = faculty ? inFacultyOrder(listed, faculty.id) : inCatalogueOrder(listed.filter((s) => s.faculties.length > 0))
        const badgeOf = (s: SubjectSummary) =>
          faculty ? { core: 'Core', faculty: faculty.name, elective: 'Elective' }[roleIn(s)!] : overallBadge(s)
        return (
          <div
            key={t.id}
            id={`faculty-${t.id}`}
            role="tabpanel"
            aria-labelledby={`faculty-tab-${t.id}`}
            hidden={active !== t.id}
            className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 [&>*]:min-w-0"
          >
            {list.map((s) => (
              <SubjectCard key={s.id} s={s} badge={badgeOf(s)} />
            ))}
            <GuideTile count={list.length} />
          </div>
        )
      })}
    </>
  )
}
