// How the subject catalogue is ordered and labelled: what each subject offers
// today, and its place in the syllabus. Shared by the catalogue grid
// (src/components/public/SubjectCatalogue) and the related-subject rows on
// subject pages.
import type { FacultyRole, SubjectSummary } from '@/lib/public-content'
import { PRACTICE_QUESTIONS } from '@/lib/practice-counts'

/** What a subject offers today. */
export type Readiness = 'practice' | 'lessons' | 'outline'

export const readinessOf = (s: SubjectSummary): Readiness =>
  (PRACTICE_QUESTIONS[s.slug] ?? 0) > 0 ? 'practice' : s.lessonCount > 0 ? 'lessons' : 'outline'

const READINESS_ORDER: Record<Readiness, number> = { practice: 0, lessons: 1, outline: 2 }
const ROLE_ORDER: Record<FacultyRole, number> = { core: 0, faculty: 1, elective: 2 }

/** Core subjects, then what can be studied today, then outlines; most lessons first within each. */
function ordered(subjects: SubjectSummary[], roleOf: (s: SubjectSummary) => FacultyRole) {
  const core = (s: SubjectSummary) => (roleOf(s) === 'core' ? 0 : 1)
  return [...subjects].sort(
    (a, b) =>
      core(a) - core(b) ||
      READINESS_ORDER[readinessOf(a)] - READINESS_ORDER[readinessOf(b)] ||
      ROLE_ORDER[roleOf(a)] - ROLE_ORDER[roleOf(b)] ||
      b.lessonCount - a.lessonCount ||
      b.topicCount - a.topicCount ||
      a.name.localeCompare(b.name),
  )
}

const overallRole = (s: SubjectSummary): FacultyRole =>
  s.faculties.some((f) => f.role === 'core') ? 'core' : s.faculties.some((f) => f.role === 'faculty') ? 'faculty' : 'elective'

/** Subjects in catalogue order, whatever the faculty. */
export const inCatalogueOrder = (subjects: SubjectSummary[]) => ordered(subjects, overallRole)

/** One faculty's subjects in catalogue order, by their role in that faculty. */
export function inFacultyOrder(subjects: SubjectSummary[], facultyId: string) {
  const roleIn = (s: SubjectSummary) => s.faculties.find((x) => x.faculty.id === facultyId)?.role
  return ordered(subjects.filter((s) => roleIn(s)), (s) => roleIn(s)!)
}

/** What a subject is across the whole syllabus: "Core", its faculty (or two), or "Elective". */
export function overallBadge(s: SubjectSummary): string {
  if (s.faculties.some((f) => f.role === 'core')) return 'Core'
  const main = s.faculties.filter((f) => f.role === 'faculty').sort((a, b) => a.faculty.sort_order - b.faculty.sort_order)
  return main.length > 0 && main.length <= 2 ? main.map((f) => f.faculty.name).join(' · ') : 'Elective'
}
