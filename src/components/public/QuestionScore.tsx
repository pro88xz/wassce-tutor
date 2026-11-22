// The running score on a public questions page, after the last question. It
// appears once a question is answered ("3 of 8 answered, 2 right"), then, when
// every question has an answer, turns into a results card: the score ring, what
// the score means, a dot per question (each a link back to it) and what to do
// next. Nothing is saved: the page needs no account. No sound.
import { ArrowRight, BookOpen, RotateCcw } from 'lucide-react'
import { ScoreRing } from '@/components/practice/ScoreRing'
import { scoreReading } from '@/lib/score-reading'

type Props = {
  /** One entry per question, in order: true right, false wrong, null not answered yet. */
  results: (boolean | null)[]
  onRetry: () => void
  next?: { href: string; label: string }
  revise?: { href: string; label: string }
}

export function QuestionScore({ results, onRetry, next, revise }: Props) {
  const total = results.length
  const answered = results.filter((r) => r !== null).length
  const right = results.filter((r) => r === true).length
  if (answered === 0) return null
  const done = answered === total
  const reading = scoreReading(right, total)

  const dots = (centred: boolean) => (
    <ol className={`flex flex-wrap gap-1.5 ${centred ? 'justify-center sm:justify-start' : ''}`} aria-label="Your answers, question by question">
      {results.map((r, i) => (
        <li key={i}>
          <a
            href={`#q${i + 1}`}
            className={`flex h-8 min-w-8 items-center justify-center rounded-full border-2 px-1.5 text-xs font-bold tabular-nums transition-colors ${
              r === true
                ? 'border-success bg-success text-white'
                : r === false
                  ? 'border-danger bg-danger text-white'
                  : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
            }`}
          >
            {i + 1}
            <span className="sr-only">{r === true ? ': right' : r === false ? ': wrong' : ': not answered'}</span>
          </a>
        </li>
      ))}
    </ol>
  )

  if (!done) {
    return (
      <section aria-label="Your score so far" className="site-card space-y-3 p-5">
        <p className="text-sm font-semibold" role="status">
          {answered} of {total} answered · <span className="text-success">{right} right</span> · {total - answered} to go
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${(answered / total) * 100}%` }} />
        </div>
        {dots(false)}
      </section>
    )
  }

  return (
    <section aria-labelledby="score-title" className="site-card space-y-5 p-5 sm:p-6">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <ScoreRing score={right} total={total} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted-foreground">Your score</p>
          <h2 id="score-title" className="mt-1 text-2xl font-bold tracking-tight" role="status">
            {reading.title}
          </h2>
          <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{reading.body}</p>
        </div>
      </div>
      {dots(true)}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {right < total && revise ? (
          <a href={revise.href} className="site-btn site-btn-primary">
            <BookOpen className="h-4 w-4" aria-hidden /> {revise.label}
          </a>
        ) : next ? (
          <a href={next.href} className="site-btn site-btn-primary">
            {next.label} <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        ) : null}
        <button type="button" onClick={onRetry} className="site-btn site-btn-secondary">
          <RotateCcw className="h-4 w-4" aria-hidden /> Try them again
        </button>
      </div>
    </section>
  )
}
