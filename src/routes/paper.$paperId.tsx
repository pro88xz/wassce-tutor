import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { usePaper } from '@/lib/queries'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/paper/$paperId')({
  component: PaperPage,
})

function PaperPage() {
  const { paperId } = useParams({ from: '/paper/$paperId' })
  const { data: questions, isLoading } = usePaper(paperId)

  // answers: questionId -> selected optionId
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  if (isLoading) {
    return <p className="text-muted-foreground">Loading paper…</p>
  }
  if (!questions || questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Link to="/" className="text-sm text-muted-foreground">← Back</Link>
        <p className="text-muted-foreground">This paper has no questions yet.</p>
      </div>
    )
  }

  const select = (questionId: string, optionId: string) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const answeredCount = Object.keys(answers).length
  const total = questions.length

  // score
  const score = questions.reduce((acc, q) => {
    const chosen = answers[q.id]
    const correct = q.options.find((o) => o.is_correct)
    return chosen && correct && chosen === correct.id ? acc + 1 : acc
  }, 0)

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-28">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to dashboard
      </Link>

      {/* RESULT BANNER */}
      {submitted && (
        <div className="rounded-2xl border bg-card p-6 text-center">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Your score</p>
          <p className="mt-1 text-5xl font-black">
            {score}/{total}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {score === total
              ? 'Perfect — excellent work!'
              : score >= total * 0.5
                ? 'Good effort. Review the explanations below.'
                : 'Keep practising — check the explanations below.'}
          </p>
        </div>
      )}

      {/* QUESTIONS */}
      <div className="space-y-5">
        {questions.map((q, i) => {
          const chosen = answers[q.id]
          const correctOpt = q.options.find((o) => o.is_correct)
          return (
            <div key={q.id} className="rounded-2xl border bg-card p-5">
              <div className="mb-3 flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <p className="font-semibold leading-relaxed">{q.stem}</p>
              </div>

              <div className="space-y-2">
                {q.options.map((o) => {
                  const isChosen = chosen === o.id
                  let cls = 'border-border hover:border-muted-foreground/40'
                  if (submitted) {
                    if (o.is_correct) cls = 'border-emerald-500 bg-emerald-500/10'
                    else if (isChosen) cls = 'border-red-500 bg-red-500/10'
                    else cls = 'border-border opacity-60'
                  } else if (isChosen) {
                    cls = 'border-primary bg-primary/5'
                  }
                  return (
                    <button
                      key={o.id}
                      onClick={() => select(q.id, o.id)}
                      disabled={submitted}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${cls}`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold">
                        {o.label}
                      </span>
                      <span>{o.content}</span>
                    </button>
                  )
                })}
              </div>

              {/* EXPLANATION (after submit) */}
              {submitted && q.explanation && (
                <div className="mt-3 rounded-xl bg-muted/50 p-3 text-sm">
                  <span className="font-semibold">Explanation: </span>
                  {q.explanation}
                  {correctOpt && (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Correct answer: {correctOpt.label}. {correctOpt.content}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* STICKY SUBMIT / RETRY */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          {!submitted ? (
            <>
              <span className="text-sm text-muted-foreground">
                {answeredCount}/{total} answered
              </span>
              <Button
                className="ml-auto"
                disabled={answeredCount === 0}
                onClick={() => setSubmitted(true)}
              >
                Submit
              </Button>
            </>
          ) : (
            <Button
              className="ml-auto"
              variant="outline"
              onClick={() => {
                setAnswers({})
                setSubmitted(false)
              }}
            >
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
