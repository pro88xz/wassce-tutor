import { hasSubjectPage, subjectPath } from '@/lib/public-content'
import type { FacultyRole, PublicFaculty, SubjectSummary } from '@/lib/public-content'
import { SubjectCover } from '@/components/ds/SubjectCover'

const ROLE_ORDER: FacultyRole[] = ['core', 'faculty', 'elective']
const ROLE_HEADING: Record<FacultyRole, string> = {
  core: 'Core subjects (every candidate)',
  faculty: 'Main subjects',
  elective: 'Electives',
}

function facultiesOf(subjects: SubjectSummary[]): PublicFaculty[] {
  const map = new Map<string, PublicFaculty>()
  for (const s of subjects) for (const f of s.faculties) map.set(f.faculty.id, f.faculty)
  return [...map.values()].sort((a, b) => a.sort_order - b.sort_order)
}

function SubjectLink({ s, detailed }: { s: SubjectSummary; detailed: boolean }) {
  const available = hasSubjectPage(s.topicCount)
  if (detailed) {
    const content = (
      <>
        <span className="subject-directory-art">
          <SubjectCover slug={s.slug} shape="wide" rounded="rounded-none" className="h-full w-full" />
        </span>
        <span className="subject-directory-copy">
          <span className="subject-directory-name">{s.name}</span>
          <span className="subject-directory-meta">
            {s.topicCount ? `${s.topicCount} syllabus topics` : 'Syllabus coming soon'}
            {s.lessonCount > 0 && <><span aria-hidden>·</span>{s.lessonCount} lessons</>}
          </span>
          <span className={`subject-directory-action ${available ? '' : 'is-muted'}`}>
            {available ? 'Explore subject' : 'Coming soon'}
            {available && <span aria-hidden>↗</span>}
          </span>
        </span>
      </>
    )
    return available ? (
      <a href={subjectPath(s.slug)} className="subject-directory-card">{content}</a>
    ) : (
      <div className="subject-directory-card is-unavailable" aria-disabled="true">{content}</div>
    )
  }

  const compact = (
    <>
      <SubjectCover slug={s.slug} shape="thumb" className="h-12 w-16 shrink-0" rounded="rounded-lg" />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-snug">{s.name}</span>
      </span>
    </>
  )
  return available ? (
    <a href={subjectPath(s.slug)} className="flex min-h-16 items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-muted">{compact}</a>
  ) : (
    <span className="flex min-h-16 items-center gap-3 rounded-xl px-2 py-2 opacity-60">{compact}</span>
  )
}

/** Subjects grouped by faculty, then by role (core / main / elective). */
export function FacultySubjects({ subjects, detailed = false }: { subjects: SubjectSummary[]; detailed?: boolean }) {
  return (
    <div className={detailed ? "subject-directory-grid" : "grid gap-6 sm:grid-cols-2"}>
      {facultiesOf(subjects).map((faculty) => (
        <section key={faculty.id} className={detailed ? "subject-faculty-panel" : "space-y-3 rounded-2xl border bg-card p-4"}>
          {detailed ? <div className="subject-faculty-heading"><span className="subject-faculty-kicker">FACULTY</span><h3>{faculty.name}</h3></div> : <h3 className="px-2 text-lg font-bold tracking-tight">{faculty.name}</h3>}
          {ROLE_ORDER.map((role) => {
            const list = subjects.filter((s) => s.faculties.some((f) => f.faculty.id === faculty.id && f.role === role))
            if (list.length === 0) return null
            return (
              <div key={role} className="space-y-1">
                <p className={detailed ? "subject-role-heading" : "px-2 text-sm font-semibold text-muted-foreground"}>{ROLE_HEADING[role]}</p>
                <ul className={detailed ? "subject-directory-cards" : "space-y-1"}>
                  {list.map((s) => (
                    <li key={s.id}><SubjectLink s={s} detailed={detailed} /></li>
                  ))}
                </ul>
              </div>
            )
          })}
        </section>
      ))}
    </div>
  )
}
