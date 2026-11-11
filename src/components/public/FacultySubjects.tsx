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

function SubjectLink({ s }: { s: SubjectSummary }) {
  const body = (
    <>
      <SubjectCover slug={s.slug} shape="thumb" className="h-12 w-16 shrink-0" rounded="rounded-lg" />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-snug">{s.name}</span>
      </span>
    </>
  )
  return hasSubjectPage(s.topicCount) ? (
    <a href={subjectPath(s.slug)} className="flex min-h-16 items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-muted">{body}</a>
  ) : (
    <span className="flex min-h-16 items-center gap-3 rounded-xl px-2 py-2 opacity-60">{body}</span>
  )
}

/**
 * Which subjects each faculty sits, grouped by role (core / main / elective):
 * the compact reference list on the WASSCE guide. The catalogue with cards is
 * SubjectCatalogue.
 */
export function FacultySubjects({ subjects }: { subjects: SubjectSummary[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {facultiesOf(subjects).map((faculty) => (
        <section key={faculty.id} className="space-y-3 rounded-2xl border bg-card p-4">
          <h3 className="px-2 text-lg font-bold tracking-tight">{faculty.name}</h3>
          {ROLE_ORDER.map((role) => {
            const list = subjects.filter((s) => s.faculties.some((f) => f.faculty.id === faculty.id && f.role === role))
            if (list.length === 0) return null
            return (
              <div key={role} className="space-y-1">
                <p className="px-2 text-sm font-semibold text-muted-foreground">{ROLE_HEADING[role]}</p>
                <ul className="space-y-1">
                  {list.map((s) => (
                    <li key={s.id}><SubjectLink s={s} /></li>
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
