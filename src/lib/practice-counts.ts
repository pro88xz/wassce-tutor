// Practice questions per subject, counted from the question-set manifest at
// build time. These sets are synced to the database on every deploy, so the
// numbers match what students can open.
//
// Copy that says where practice exists is written from these counts
// (PRACTICE_SUBJECTS_PHRASE), so it stays true as subjects gain question sets.
type SetSummary = { subject_slug: string; questions: number; mock?: boolean }

const files = import.meta.glob<SetSummary[]>('../content/question-sets/manifest.json', { eager: true, import: 'default' })
// Mock exams reuse practice questions, so they are not counted again.
const sets = (Object.values(files)[0] ?? []).filter((s) => !s.mock)

export const PRACTICE_QUESTIONS: Record<string, number> = sets.reduce<Record<string, number>>((acc, s) => {
  acc[s.subject_slug] = (acc[s.subject_slug] ?? 0) + s.questions
  return acc
}, {})

/** Practice sets per subject. */
export const PRACTICE_SETS: Record<string, number> = sets.reduce<Record<string, number>>((acc, s) => {
  acc[s.subject_slug] = (acc[s.subject_slug] ?? 0) + 1
  return acc
}, {})

/** All practice questions, across subjects. */
export const PRACTICE_TOTAL = Object.values(PRACTICE_QUESTIONS).reduce((sum, n) => sum + n, 0)

/** Slugs whose name is not just the slug in title case. */
const NAMES: Record<string, string> = { 'ict-computer-studies': 'ICT / Computer Studies', 'literature-in-english': 'Literature in English' }

const nameOf = (slug: string) =>
  NAMES[slug] ?? slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')

/** Names of the subjects that have practice questions today, in alphabetical order. */
export const PRACTICE_SUBJECTS: string[] = Object.keys(PRACTICE_QUESTIONS)
  .filter((slug) => PRACTICE_QUESTIONS[slug] > 0)
  .map(nameOf)
  .sort((a, b) => a.localeCompare(b))

/** "English Language, Mathematics and Physics"; a count once the list is too long to read. */
export const PRACTICE_SUBJECTS_PHRASE =
  PRACTICE_SUBJECTS.length === 0
    ? 'the subjects with practice'
    : PRACTICE_SUBJECTS.length > 5
      ? `${PRACTICE_SUBJECTS.length} subjects`
      : PRACTICE_SUBJECTS.length === 1
        ? PRACTICE_SUBJECTS[0]
        : `${PRACTICE_SUBJECTS.slice(0, -1).join(', ')} and ${PRACTICE_SUBJECTS[PRACTICE_SUBJECTS.length - 1]}`

/** Whether a subject has practice questions to open. */
export const hasPractice = (subjectSlug: string) => (PRACTICE_QUESTIONS[subjectSlug] ?? 0) > 0
