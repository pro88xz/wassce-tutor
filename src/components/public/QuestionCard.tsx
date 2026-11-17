// One practice question as public pages show it: the stem, its diagram, the
// options, then "Show the answer and working" (the answer, the full working
// and why each wrong option is wrong). The answer is folded but in the HTML,
// so search engines read it. Used by the questions pages and the sample
// questions on topic pages.
import { CircleCheck, Lightbulb } from 'lucide-react'
import { QuestionMarkdown } from '@/components/QuestionMarkdown'
import { ZoomableImage } from '@/components/ds/ZoomableImage'
import type { PublicQuestion } from '@/lib/public-content'
import { mathToText } from '@/lib/math-text'

const sizeFiles = import.meta.glob<Record<string, [number, number]>>('../../content/question-diagram-sizes.json', { eager: true, import: 'default' })
const DIAGRAM_SIZES = Object.values(sizeFiles)[0] ?? {}

/** Width and height of a question diagram, from its path (scripts/questions/diagram-sizes.mjs). */
function diagramSize(url: string): { width?: number; height?: number } {
  const path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0]
  const size = DIAGRAM_SIZES[path]
  return size ? { width: size[0], height: size[1] } : {}
}

/** Markdown (with maths) as one line of plain text: for alt text, descriptions and structured data. */
export const plainText = (markdown: string) =>
  mathToText(markdown)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+>]\s+/gm, '')
    .replace(/[*_`|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const diagramAlt = (q: PublicQuestion, n: number, topic: string) => {
  const stem = plainText(q.stem)
  return `Diagram for ${topic} question ${n}: ${stem.length > 180 ? `${stem.slice(0, stem.lastIndexOf(' ', 180))}…` : stem}`
}

export function QuestionCard({ q, n, topic, heading: Heading = 'h2' }: { q: PublicQuestion; n: number; topic: string; heading?: 'h2' | 'h3' }) {
  const correct = q.options.find((o) => o.is_correct)
  return (
    <li id={`q${n}`} className="site-card scroll-mt-24 p-5 sm:p-6">
      <Heading className="text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">Question {n}</Heading>
      <QuestionMarkdown content={q.stem} className="question-md mt-2 text-[17px] leading-relaxed" />
      {q.image_url && <ZoomableImage src={q.image_url} alt={diagramAlt(q, n, topic)} {...diagramSize(q.image_url)} />}
      <ol className="mt-4 grid gap-2" aria-label={`Options for question ${n}`}>
        {q.options.map((o) => (
          <li key={o.label} className="flex items-start gap-3 rounded-xl border bg-card px-3 py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">{o.label}</span>
            <QuestionMarkdown content={o.content} className="question-md min-w-0 flex-1 pt-0.5" />
          </li>
        ))}
      </ol>
      <details className="group mt-4 rounded-xl border border-primary/20 bg-brand-soft/40">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-4 py-3 font-semibold text-primary [&::-webkit-details-marker]:hidden">
          <Lightbulb className="h-4 w-4" aria-hidden /> <span className="group-open:hidden">Show the answer and working</span>
          <span className="hidden group-open:inline">Hide the answer</span>
        </summary>
        <div className="space-y-3 border-t border-primary/15 px-4 pb-4 pt-3">
          {correct && (
            <div className="flex items-start gap-2 font-semibold text-success">
              <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <span>
                Answer: {correct.label}
                <span className="sr-only">.</span>
              </span>
              <QuestionMarkdown content={correct.content} className="question-md min-w-0 font-semibold" />
            </div>
          )}
          {q.explanation && <QuestionMarkdown content={q.explanation} className="question-md leading-relaxed" />}
        </div>
      </details>
    </li>
  )
}
