// One key term as a card: the term on the front; tap it to see the lesson's
// own definition and where it comes from. A <details> element, so it works
// without JavaScript and the definition is in the HTML search engines read.
// Used on topic pages (a preview) and the topic's key terms page.
import { ChevronDown } from 'lucide-react'
import { QuestionMarkdown } from '@/components/QuestionMarkdown'
import type { KeyTerm } from '@/lib/key-terms'

export function KeyTermCard({
  term,
  lessonNumber,
  lessonHref,
  colours: [from, to],
  open,
}: {
  term: KeyTerm
  /** The lesson's place in the topic (1, 2, ...), for "From lesson 2" */
  lessonNumber: number
  /** The lesson section the definition is in */
  lessonHref: string
  colours: [string, string]
  /** Open from the start (the page's "Show every definition") */
  open?: boolean
}) {
  return (
    <details open={open} className="key-term group site-card overflow-hidden" data-term={term.id}>
      <summary className="flex min-h-[4.5rem] cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="h-10 w-1.5 shrink-0 rounded-full" style={{ background: `linear-gradient(180deg, ${from}, ${to})` }} aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold uppercase tracking-[.14em] text-muted-foreground">Key term</span>
          <span className="mt-0.5 block text-lg font-bold leading-snug tracking-tight">{term.term}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--input)] px-3 py-1.5 text-xs font-bold text-[var(--primary)] transition-colors group-open:border-transparent group-open:bg-muted group-open:text-muted-foreground">
          <span className="group-open:hidden">Define it</span>
          <span className="hidden group-open:inline">Hide</span>
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" aria-hidden />
        </span>
      </summary>
      <div className="border-t px-5 pb-5 pt-4">
        <QuestionMarkdown content={term.definition} className="question-md text-[15px] leading-relaxed" />
        <a href={lessonHref} className="site-link mt-3 text-sm">
          From lesson {lessonNumber}: {term.lessonTitle} <span aria-hidden>→</span>
        </a>
      </div>
    </details>
  )
}
