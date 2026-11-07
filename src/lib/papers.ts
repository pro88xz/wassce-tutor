// Practice sets and papers: labels, best/latest results, and the link
// between a set and its syllabus topic. Practice sets are titled
// "<Topic name>: practice set N", which is how a set is matched to a topic.
import type { PaperRow } from '@/lib/queries'
import type { ScoredAttempt } from '@/lib/progress'

/** "Practice set" for sets written by WASSCE Tutor; otherwise the paper's type and year. */
export function paperKind(p: Pick<PaperRow, 'paper_type' | 'year'>): string {
  if (!p.paper_type || p.paper_type.toLowerCase() === 'practice') return 'Practice set'
  if (p.paper_type.toLowerCase() === 'comprehension') return 'Comprehension passage'
  return [p.paper_type, p.year].filter(Boolean).join(' · ')
}

/** "Circles: practice set 1" -> "Circles". */
export const setName = (title: string) => title.replace(/: practice set \d+$/i, '')

const ratio = (a: ScoredAttempt) => a.score / Math.max(a.total, 1)

/** Best attempt per paper id. */
export function bestByPaper(attempts: ScoredAttempt[]): Map<string, ScoredAttempt> {
  const m = new Map<string, ScoredAttempt>()
  for (const a of attempts) {
    if (!a.paper) continue
    const prev = m.get(a.paper.id)
    if (!prev || ratio(a) > ratio(prev)) m.set(a.paper.id, a)
  }
  return m
}

/** Most recent attempt per paper id. */
export function latestByPaper(attempts: ScoredAttempt[]): Map<string, ScoredAttempt> {
  const m = new Map<string, ScoredAttempt>()
  for (const a of attempts) {
    if (!a.paper) continue
    const prev = m.get(a.paper.id)
    if (!prev || a.created_at > prev.created_at) m.set(a.paper.id, a)
  }
  return m
}

/** The practice set written for a topic, if there is one. */
export function setForTopic(papers: PaperRow[], topic: { name: string; subject_id: string }): PaperRow | undefined {
  const prefix = `${topic.name.toLowerCase()}:`
  return papers.find((p) => p.subject_id === topic.subject_id && p.title.toLowerCase().startsWith(prefix))
}

/** Topics whose practice set was last scored under half: revise before moving on. */
export function topicsToReview(
  papers: PaperRow[],
  attempts: ScoredAttempt[],
  topics: { id: string; name: string; subject_id: string }[],
): Set<string> {
  const latest = latestByPaper(attempts)
  const out = new Set<string>()
  for (const t of topics) {
    const set = setForTopic(papers, t)
    const a = set && latest.get(set.id)
    if (a && ratio(a) < 0.5) out.add(t.id)
  }
  return out
}
