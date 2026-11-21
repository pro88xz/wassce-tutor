// A practice question's Markdown (with maths) for places other than the page
// itself: plain text for alt text and meta descriptions, and Markdown with
// $$-delimited maths for structured data on the public questions pages.
import { mathToText } from '@/lib/math-text'

/** Markdown (with maths) as one line of plain text. */
export const plainText = (markdown: string) =>
  mathToText(markdown)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+>]\s+/gm, '')
    .replace(/[*_`|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * Markdown for structured data (encodingFormat text/markdown): the text as
 * written, with every formula ($…$, $$…$$, \(…\), \[…\]) as LaTeX between
 * $$ … $$, which is how Google finds maths in practice problems. Images are
 * dropped: a question's diagram has its own field.
 */
export const markdownWithMath = (markdown: string) =>
  markdown
    .replace(
      /\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]|(?<!\\)\$((?:\\\$|[^$\n])+?)\$|\\\((.+?)\\\)/g,
      (_, a?: string, b?: string, c?: string, d?: string) => `$$${(a ?? b ?? c ?? d ?? '').trim()}$$`,
    )
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const WRONG_HEADING = /^\s*\*\*Why the other options? (?:are|is) wrong:?\*\*\s*$/im

/**
 * A question's explanation in its two parts: the working for the correct
 * option, and the reason given for each wrong option. Explanations end with
 * "**Why the other options are wrong**" and a list with one item per wrong
 * option, each starting with the option as written, then ":" or a line
 * break, then the reason.
 */
export function splitExplanation(explanation: string, wrongOptions: string[]): { working: string; reasons: (string | undefined)[] } {
  const heading = WRONG_HEADING.exec(explanation)
  if (!heading) return { working: explanation.trim(), reasons: wrongOptions.map(() => undefined) }
  const items: string[] = []
  for (const line of explanation.slice(heading.index + heading[0].length).split('\n')) {
    if (/^[-*+] /.test(line)) items.push(line.slice(2))
    else if (items.length && line.trim()) items[items.length - 1] += `\n${line.trim()}`
  }
  const reasons = wrongOptions.map((option, i) => {
    const start = option.trim()
    const item = items.find((it) => it.startsWith(start))
    if (item) return item.slice(start.length).replace(/^\s*:?\s*/, '').trim() || undefined
    // Written another way: the list follows the order of the options.
    return items.length === wrongOptions.length ? items[i].trim() : undefined
  })
  return { working: explanation.slice(0, heading.index).trim(), reasons }
}
