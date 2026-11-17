// Timed mock exams: full WASSCE Paper 1s built from the practice bank by
// scripts/questions/build.py. The manifest marks them ("mock": true) with the
// time WAEC gives for the paper; the practice screen runs the clock from it.
type ManifestEntry = { papers: string[]; subject_slug: string; questions: number; mock?: boolean; minutes?: number }

const files = import.meta.glob<ManifestEntry[]>('../content/question-sets/manifest.json', { eager: true, import: 'default' })

const MINUTES = new Map<string, number>()
for (const entry of Object.values(files)[0] ?? []) {
  if (entry.mock && entry.minutes) for (const id of entry.papers) MINUTES.set(id, entry.minutes)
}

/** The time allowed for a mock exam, in minutes, or null when the paper is not a mock. */
export function mockMinutes(paperId: string): number | null {
  return MINUTES.get(paperId) ?? null
}

/** 90 -> "1 h 30 min", 60 -> "1 h", 45 -> "45 min". */
export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return [h ? `${h} h` : '', m ? `${m} min` : ''].filter(Boolean).join(' ')
}

/** Every mock exam: subject, length and time, for the homepage. */
export const MOCK_EXAMS: { subjectSlug: string; questions: number; minutes: number }[] = (Object.values(files)[0] ?? [])
  .filter((e) => e.mock && e.minutes)
  .map((e) => ({ subjectSlug: e.subject_slug, questions: e.questions, minutes: e.minutes! }))
