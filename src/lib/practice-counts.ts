// Practice questions per subject, counted from the question-set manifest at
// build time. These sets are synced to the database on every deploy, so the
// numbers match what students can open.
type SetSummary = { subject_slug: string; questions: number }

const files = import.meta.glob<SetSummary[]>('../content/question-sets/manifest.json', { eager: true, import: 'default' })
const sets = Object.values(files)[0] ?? []

export const PRACTICE_QUESTIONS: Record<string, number> = sets.reduce<Record<string, number>>((acc, s) => {
  acc[s.subject_slug] = (acc[s.subject_slug] ?? 0) + s.questions
  return acc
}, {})
