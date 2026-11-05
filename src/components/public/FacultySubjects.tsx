import { hasSubjectPage, subjectPath } from '@/lib/public-content'
import { SubjectIcon } from '@/lib/subject-theme'
import type { FacultyRole, PublicFaculty, SubjectSummary } from '@/lib/public-content'

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
  const content = (
    <>
      <SubjectIcon slug={s.slug} size="sm" />
      <span className="min-w-0 flex-1 truncate font-semibold">{s.name}</span>
      {detailed && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {s.topicCount ? `${s.topicCount} topics` : 'Coming soon'}
          {s.lessonCount > 0 && ` · ${s.lessonCount} lessons`}
        </span>
      )}
    </>
  )
  return hasSubjectPage(s.topicCount) ? (
    <a href={subjectPath(s.slug)} className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-muted">{content}</a>
  ) : (
    <span className="flex items-center gap-3 rounded-xl px-2 py-1.5 opacity-60">{content}</span>
  )
}

/** Subjects grouped by faculty, then by role (core / main / elective). */
export function FacultySubjects({ subjects, detailed = false }: { subjects: SubjectSummary[]; detailed?: boolean }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {facultiesOf(subjects).map((faculty) => (
        <section key={faculty.id} className="space-y-3 rounded-3xl border bg-card p-4 shadow-sm shadow-black/[0.03]">
          <h3 className="px-2 text-lg font-black tracking-tight">{faculty.name}</h3>
          {ROLE_ORDER.map((role) => {
            const list = subjects.filter((s) => s.faculties.some((f) => f.faculty.id === faculty.id && f.role === role))
            if (list.length === 0) return null
            return (
              <div key={role} className="space-y-1">
                <p className="px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{ROLE_HEADING[role]}</p>
                <ul className="space-y-1">
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
