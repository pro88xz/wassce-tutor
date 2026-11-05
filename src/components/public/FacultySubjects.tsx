import { hasSubjectPage, subjectPath } from '@/lib/public-content'
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
  const label = hasSubjectPage(s.topicCount) ? (
    <a href={subjectPath(s.slug)} className="font-medium text-primary hover:underline">{s.name}</a>
  ) : (
    <span className="font-medium">{s.name}</span>
  )
  if (!detailed) return label
  return (
    <div className="flex items-baseline justify-between gap-3">
      {label}
      <span className="shrink-0 text-xs text-muted-foreground">
        {s.topicCount ? `${s.topicCount} topics` : 'Syllabus coming soon'}
        {s.lessonCount > 0 && ` · ${s.lessonCount} lessons`}
      </span>
    </div>
  )
}

/** Subjects grouped by faculty, then by role (core / main / elective). */
export function FacultySubjects({ subjects, detailed = false }: { subjects: SubjectSummary[]; detailed?: boolean }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {facultiesOf(subjects).map((faculty) => (
        <section key={faculty.id} className="rounded-xl border p-4 space-y-3">
          <h3 className="text-lg font-bold">{faculty.name}</h3>
          {ROLE_ORDER.map((role) => {
            const list = subjects.filter((s) => s.faculties.some((f) => f.faculty.id === faculty.id && f.role === role))
            if (list.length === 0) return null
            return (
              <div key={role} className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{ROLE_HEADING[role]}</p>
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
