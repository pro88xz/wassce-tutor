// What each lesson covers, for topic pages: its teaching sections, worked
// examples and diagrams. Generated from the notes by scripts/notes/outlines.mjs
// (one small JSON file per subject, loaded only when a topic page needs it).

/** s: [heading number, title] (links to #section-N); w: worked examples; f: diagrams */
export type LessonOutline = { s: [number, string][]; w: number; f: number }
export type SubjectOutlines = Record<string, LessonOutline>

const files = import.meta.glob<SubjectOutlines>('../content/lesson-outlines/*.json', { import: 'default' })

export async function loadOutlines(subjectSlug: string): Promise<SubjectOutlines> {
  const load = files[`../content/lesson-outlines/${subjectSlug}.json`]
  return load ? load() : {}
}

export const outlineKey = (topicSlug: string, lessonSlug: string) => `${topicSlug}/${lessonSlug}`

/** The id LessonView gives the Nth level-2 heading of a lesson. */
export const sectionId = (n: number) => `section-${n}`

export type OutlineTotals = { sections: number; worked: number; figures: number }

export function totals(outlines: (LessonOutline | undefined)[]): OutlineTotals {
  return outlines.reduce<OutlineTotals>(
    (t, o) => (o ? { sections: t.sections + o.s.length, worked: t.worked + o.w, figures: t.figures + o.f } : t),
    { sections: 0, worked: 0, figures: 0 },
  )
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

/** "5 sections · 3 worked examples · 2 diagrams", leaving out zeros. */
export function describeTotals(t: OutlineTotals, withSections = true): string[] {
  const parts: string[] = []
  if (withSections && t.sections) parts.push(plural(t.sections, 'section'))
  if (t.worked) parts.push(plural(t.worked, 'worked example'))
  if (t.figures) parts.push(plural(t.figures, 'diagram'))
  return parts
}
