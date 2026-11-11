// Matching for the homepage topic search.
//
// Every word the student types must match the entry. A word matches exactly
// when it appears anywhere in the entry's name or subject; if it does not, it
// is retried against each word of the entry with a small spelling tolerance,
// so "photosynthsis" still finds Photosynthesis and "quadrtic" finds
// Quadratic Equations. Exact matches always rank above corrected ones.

export type Searchable = { name: string; subjectName: string }

/** Edit distance between two words, or `max + 1` as soon as it must exceed `max`. */
export function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    let best = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      const value = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost)
      current.push(value)
      if (value < best) best = value
    }
    if (best > max) return max + 1
    previous = current
  }
  return previous[b.length]
}

/** Short words must be typed correctly; longer ones may be one or two letters out. */
const tolerance = (word: string) => (word.length <= 3 ? 0 : word.length <= 6 ? 1 : 2)

/** 0 for an exact match, the edit distance for a corrected one, -1 for no match. */
function wordCost(word: string, haystack: string, tokens: string[]): number {
  if (haystack.includes(word)) return 0
  const allowed = tolerance(word)
  if (allowed === 0) return -1
  let best = allowed + 1
  for (const token of tokens) {
    // The whole word, and its opening letters: the student may still be typing.
    for (const candidate of [token, token.slice(0, word.length), token.slice(0, word.length + 1)]) {
      const distance = editDistance(word, candidate, allowed)
      if (distance < best) best = distance
    }
  }
  return best <= allowed ? best : -1
}

/**
 * Entries matching `query`, each with its total correction cost (0 = every
 * word matched exactly). Entries where any word finds nothing are left out.
 */
export function matchEntries<T extends Searchable>(entries: T[], query: string): { entry: T; cost: number }[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  const matches: { entry: T; cost: number }[] = []
  for (const entry of entries) {
    const haystack = `${entry.name} ${entry.subjectName}`.toLowerCase()
    const tokens = haystack.split(/[^a-z0-9]+/).filter(Boolean)
    let cost = 0
    for (const word of words) {
      const c = wordCost(word, haystack, tokens)
      if (c < 0) {
        cost = -1
        break
      }
      cost += c
    }
    if (cost >= 0) matches.push({ entry, cost })
  }
  return matches
}
