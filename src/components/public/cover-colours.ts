// Cover colours for TopicCover, kept apart from the component so pages can
// colour themselves to match a topic's cover (the topic page header and
// lesson numbers).
import { subjectArt } from '@/components/ds/SubjectCover'

/** Cover colours, cycled along a row so neighbouring cards never match. */
const COVERS = [
  ['#5b34d6', '#3a1d9e'],
  ['#1f6fd1', '#173f8f'],
  ['#0f8a7e', '#0b5b5f'],
  ['#c2410c', '#8a2a07'],
  ['#be185d', '#7e1242'],
  ['#2f3a8f', '#161c4f'],
  ['#15803d', '#0d5129'],
  ['#7c3aed', '#4c1d95'],
]

/** A cover's two gradient colours: the subject's own at index 0, then the cycle, so neighbours in a row differ. */
export function coverColours(subjectSlug: string, index = 0): [string, string] {
  const art = subjectArt(subjectSlug)
  // Start the cycle at the subject's own colour family, when it is one of the cover colours.
  const own = COVERS.findIndex(([c]) => c.toLowerCase() === art.bg.toLowerCase())
  const [from, to] = own < 0 && index === 0 ? [art.bg, art.shade] : COVERS[(Math.max(0, own) + index) % COVERS.length]
  return [from, to]
}
