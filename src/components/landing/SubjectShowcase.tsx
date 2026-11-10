// The course catalogue: every subject as the same card on one grid, filtered
// by faculty. Each faculty's panel lists the two core subjects first, then the
// faculty's own subjects, then its electives, so a student sees their full
// timetable in one place. Every panel is in the prerendered HTML (crawlable
// links); only the active one is shown.
import { useState } from 'react'
import { ArrowRight, ClipboardCheck, Compass } from 'lucide-react'
import type { SubjectSummary } from '@/lib/public-content'
import { subjectPath } from '@/lib/public-content'
import { PRACTICE_QUESTIONS } from '@/lib/practice-counts'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { Band, SectionHeading } from '@/components/public/Section'

type Role = 'core' | 'faculty' | 'elective'

const ROLE_ORDER: Record<Role, number> = { core: 0, faculty: 1, elective: 2 }

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
      className={`group relative isolate flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-[var(--site-ink)] p-4 text-white transition-transform duration-300 hover:-translate-y-[3px] sm:p-6 ${FILL_2[count % 2]} ${FILL_3[count % 3]} ${FILL_4[count % 4]}`}
    >
      <span aria-hidden className="site-hero-backdrop -z-10" />
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
        <Compass className="h-5 w-5 text-violet-200" aria-hidden />
      </span>
      <span>
        <span className="block text-[15px] font-bold leading-snug tracking-tight sm:text-xl">Not sure which subjects you sit?</span>
        <span className="mt-2 hidden text-sm leading-relaxed text-white/70 sm:block">The WASSCE guide explains each faculty, the core subjects and how the exam is graded.</span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-violet-200 sm:mt-4 sm:text-sm">
          Read the guide <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>
      </span>
    </a>
  )
}

function meta(s: SubjectSummary) {
  if (!s.topicCount) return 'Syllabus coming soon'
  return `${s.topicCount} topics · ${s.lessonCount > 0 ? `${s.lessonCount} lessons` : 'lessons coming soon'}`
}

function SubjectCard({ s, badge }: { s: SubjectSummary; badge: string }) {
  const ready = s.topicCount > 0
  const practice = PRACTICE_QUESTIONS[s.slug]
  const body = (
    <>
      <span className="relative block">
        <SubjectCover slug={s.slug} shape="wide" rounded="rounded-none" className="aspect-[16/10] w-full" />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold leading-none text-slate-900 shadow-sm">{badge}</span>
      </span>
      <span className="flex flex-1 flex-col p-3.5 sm:p-4">
        <span className="site-h3 text-[15px] sm:text-[17px]">{s.name}</span>
        <span className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">{meta(s)}</span>
        <span className="mt-auto flex items-center justify-between gap-2 pt-3">
          {practice ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[11px] font-semibold leading-none text-success">
              <ClipboardCheck className="h-3.5 w-3.5" aria-hidden /> {practice} questions
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-muted-foreground">{!ready ? 'In preparation' : s.lessonCount > 0 ? 'Syllabus and lessons' : 'Full syllabus'}</span>
          )}
          {ready && <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" aria-hidden />}
        </span>
      </span>
    </>
  )
  const cls = 'site-card group flex h-full flex-col overflow-hidden'
  return ready ? (
    <a href={subjectPath(s.slug)} className={`${cls} site-card-link`}>{body}</a>
  ) : (
    <div className={`${cls} opacity-70`}>{body}</div>
  )
}

export function SubjectShowcase({ subjects }: { subjects: SubjectSummary[] }) {
  const faculties = [...new Map(subjects.flatMap((s) => s.faculties.map((f) => [f.faculty.id, f.faculty] as const))).values()].sort(
    (a, b) => a.sort_order - b.sort_order,
  )
  const [active, setActive] = useState(faculties[0]?.id ?? '')

  return (
    <Band labelledBy="subjects-heading">
      <SectionHeading
        id="subjects-heading"
        eyebrow="Course catalogue"
        title="Every WASSCE subject, organised topic by topic."
        lede="Choose your faculty to see the subjects you sit: the two core subjects, your faculty subjects and the electives that go with them."
        action={
          <a href="/wassce/subjects" className="site-link">
            Browse the full syllabus <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        }
      />

      <div role="tablist" aria-label="Faculties" className="mt-8 flex gap-1 rounded-xl bg-muted p-1 sm:inline-flex">
        {faculties.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            id={`faculty-tab-${f.id}`}
            aria-selected={active === f.id}
            aria-controls={`faculty-${f.id}`}
            onClick={() => setActive(f.id)}
            className={`min-h-11 min-w-0 flex-1 whitespace-nowrap rounded-lg px-1.5 text-[13px] font-semibold transition-colors sm:flex-none sm:px-6 sm:text-sm ${
              active === f.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {faculties.map((f) => {
        const roleOf = (s: SubjectSummary) => s.faculties.find((x) => x.faculty.id === f.id)?.role as Role | undefined
        const inFaculty = subjects
          .filter((s) => roleOf(s))
          .sort((a, b) => ROLE_ORDER[roleOf(a)!] - ROLE_ORDER[roleOf(b)!] || b.lessonCount - a.lessonCount || b.topicCount - a.topicCount)
        const badge: Record<Role, string> = { core: 'Core', faculty: f.name, elective: 'Elective' }
        return (
          <div
            key={f.id}
            id={`faculty-${f.id}`}
            role="tabpanel"
            aria-labelledby={`faculty-tab-${f.id}`}
            hidden={active !== f.id}
            className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 [&>*]:min-w-0"
          >
            {inFaculty.map((s) => (
              <SubjectCard key={s.id} s={s} badge={badge[roleOf(s)!]} />
            ))}
            <GuideTile count={inFaculty.length} />
          </div>
        )
      })}
    </Band>
  )
}
