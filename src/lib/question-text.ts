// Plain text from a practice question's Markdown (with maths): for alt text,
// meta descriptions and structured data on the public questions pages.
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
