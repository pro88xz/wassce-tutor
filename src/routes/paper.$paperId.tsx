import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { privateHead } from '@/lib/seo'
import { AccessGate } from '@/components/AccessGate'
import { useState } from 'react'
import { usePaper, usePaperMeta } from '@/lib/queries'
import { useSaveAttempt } from '@/lib/mutations'
import { useAuth } from '@/lib/auth'
import { MarkdownView } from '@/components/MarkdownView'
import { ArrowLeft, CircleCheck, CircleX, FileText, RotateCcw } from 'lucide-react'
import { SubjectIcon, subjectTheme } from '@/lib/subject-theme'
import { ProgressBar, ProgressRing, percent } from '@/components/ds/Progress'
import { Card, EmptyState, Skeleton } from '@/components/ds/Primitives'

export const Route = createFileRoute('/paper/$paperId')({
  head: privateHead('Past paper'),
  component: PaperPage,
})

function PaperPage() {
  const { paperId } = useParams({ from: '/paper/$paperId' })
  const { data: questions, isLoading } = usePaper(paperId)
  const { data: meta } = usePaperMeta(paperId)
  const { palette } = subjectTheme(meta?.subject?.slug)
  const { user } = useAuth()
  const saveAttempt = useSaveAttempt()

  // answers: questionId -> selected optionId
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-36" />
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-56" />)}
      </div>
    )
  }
  if (!questions || questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <BackLink meta={meta} />
        <EmptyState icon={<FileText className="h-6 w-6" />} title="No questions yet" body="This paper is still being added. Check back soon." />
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

  const handleSubmit = async () => {
    setSubmitted(true)
    if (!user || !questions) return
    const answerRows = questions.map((q) => {
      const chosen = answers[q.id] ?? null
      const correct = q.options.find((o) => o.is_correct)
      return {
        questionId: q.id,
        optionId: chosen,
        isCorrect: !!chosen && !!correct && chosen === correct.id,
      }
    })
    try {
      await saveAttempt.mutateAsync({
        profileId: user.id,
        paperId,
        score,
        total,
        answers: answerRows,
      })
    } catch (e) {
      // non-blocking: result still shows even if save fails
      console.error('Failed to save attempt', e)
    }
  }

  const skipped = total - answeredCount
  const wrong = answeredCount - score

  return (
    <AccessGate>
    <div className="mx-auto max-w-2xl space-y-6 pb-32">
      <BackLink meta={meta} />

      {/* HEADER */}
      <Card className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          {meta?.subject ? <SubjectIcon slug={meta.subject.slug} size="lg" /> : <Skeleton className="h-14 w-14" />}
          <div className="min-w-0">
            <p className={`text-xs font-bold uppercase tracking-wider ${palette.text}`}>{meta?.subject?.name ?? 'Past paper'}</p>
            <h1 className="text-2xl font-bold tracking-tight text-balance">{meta?.title ?? 'Past paper'}</h1>
            <p className="text-sm text-muted-foreground">
              {[meta?.paper_type, meta?.year, `${total} question${total === 1 ? '' : 's'}`].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
        {!submitted && (
          <div className="space-y-1.5">
            <ProgressBar value={answeredCount} max={total} fill={palette.bar} label="Questions answered" />
            <p className="text-xs text-muted-foreground">{answeredCount} of {total} answered</p>
          </div>
        )}
      </Card>

      {/* RESULT */}
      {submitted && (
        <Card className="overflow-hidden">
          <div className={`flex flex-col items-center gap-5 bg-gradient-to-br ${palette.gradient} p-6 text-white sm:flex-row`}>
            <ProgressRing value={score} max={total} size={120} thickness={11} stroke="text-white" label="Score">
              <span className="text-3xl font-bold tabular-nums">{percent(score, total)}%</span>
              <span className="text-xs text-white/80">{score}/{total}</span>
            </ProgressRing>
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-2xl font-bold">
                {score === total ? 'Perfect score!' : score >= total * 0.7 ? 'Great work!' : score >= total * 0.5 ? 'Good effort.' : 'Keep practising.'}
              </p>
              <p className="text-white/85">
                {score === total ? 'You got every question right.' : 'Go through the explanations below, then try again.'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x text-center">
            <div className="p-3"><p className="text-xl font-bold text-emerald-600">{score}</p><p className="text-xs text-muted-foreground">Correct</p></div>
            <div className="p-3"><p className="text-xl font-bold text-red-600">{wrong}</p><p className="text-xs text-muted-foreground">Wrong</p></div>
            <div className="p-3"><p className="text-xl font-bold text-muted-foreground">{skipped}</p><p className="text-xs text-muted-foreground">Skipped</p></div>
          </div>
        </Card>
      )}

      {/* QUESTIONS */}
      <ol className="space-y-4">
        {questions.map((q, i) => {
          const chosen = answers[q.id]
          const correctOpt = q.options.find((o) => o.is_correct)
          const gotIt = submitted && !!chosen && chosen === correctOpt?.id
          return (
            <li key={q.id}>
              <Card className="space-y-4 p-5">
                <div className="flex gap-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${submitted ? (gotIt ? 'bg-emerald-500/15 text-emerald-700' : 'bg-red-500/10 text-red-700') : `${palette.soft} ${palette.text}`}`}>
                    {i + 1}
                  </span>
                  <div className="prose prose-slate dark:prose-invert max-w-none font-semibold leading-relaxed prose-p:my-0 prose-p:font-semibold">
                    <MarkdownView content={q.stem} />
                  </div>
                </div>

                {q.image_url && (
                  <img
                    src={q.image_url}
                    alt={`Diagram for question ${i + 1}`}
                    loading="lazy"
                    className="mx-auto block h-auto w-full max-w-sm rounded-xl border bg-white"
                  />
                )}

                <div className="space-y-2">
                  {q.options.map((o) => {
                    const isChosen = chosen === o.id
                    let cls = 'ring-border hover:ring-muted-foreground/40'
                    let badge = 'border-border text-muted-foreground'
                    if (submitted) {
                      if (o.is_correct) { cls = 'ring-2 ring-emerald-500 bg-emerald-500/10'; badge = 'border-emerald-500 bg-emerald-500 text-white' }
                      else if (isChosen) { cls = 'ring-2 ring-red-500 bg-red-500/10'; badge = 'border-red-500 bg-red-500 text-white' }
                      else cls = 'ring-border opacity-60'
                    } else if (isChosen) {
                      cls = `ring-2 ${palette.ring} ${palette.soft}`
                      badge = `border-transparent ${palette.bar} text-white`
                    }
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => select(q.id, o.id)}
                        disabled={submitted}
                        aria-pressed={isChosen}
                        className={`flex w-full items-center gap-3 rounded-2xl bg-card px-4 py-3 text-left text-sm ring-1 transition ${cls}`}
                      >
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${badge}`}>
                          {o.label}
                        </span>
                        <span className="prose prose-sm prose-slate dark:prose-invert max-w-none flex-1 prose-p:my-0">
                          <MarkdownView content={o.content} />
                        </span>
                        {submitted && o.is_correct && <CircleCheck className="h-5 w-5 shrink-0 text-emerald-600" aria-label="Correct answer" />}
                        {submitted && isChosen && !o.is_correct && <CircleX className="h-5 w-5 shrink-0 text-red-600" aria-label="Your answer" />}
                      </button>
                    )
                  })}
                </div>

                {submitted && (q.explanation || correctOpt) && (
                  <div className="space-y-1 rounded-2xl bg-muted/60 p-4 text-sm">
                    <p className="font-bold">{gotIt ? 'Correct!' : chosen ? 'Not quite.' : 'Skipped.'} {correctOpt && <span className="font-normal text-muted-foreground">Answer: {correctOpt.label}</span>}</p>
                    {q.explanation && (
                      <div className="prose prose-sm prose-slate dark:prose-invert max-w-none prose-p:my-1">
                        <MarkdownView content={q.explanation} />
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </li>
          )
        })}
      </ol>

      {/* STICKY SUBMIT / RETRY */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto flex max-w-2xl items-center gap-4 p-4">
          {!submitted ? (
            <>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">{answeredCount}/{total} answered</p>
                <ProgressBar value={answeredCount} max={total} fill={palette.bar} size="sm" label="Questions answered" />
              </div>
              <button
                type="button"
                disabled={answeredCount === 0}
                onClick={handleSubmit}
                className={`h-12 shrink-0 rounded-2xl bg-gradient-to-br ${palette.gradient} px-6 font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-50`}
              >
                Submit{skipped > 0 && answeredCount > 0 ? ` (${skipped} left)` : ''}
              </button>
            </>
          ) : (
            <>
              {meta?.subject && (
                <Link to="/subject/$subjectId" params={{ subjectId: meta.subject.id }} className="text-sm font-semibold text-muted-foreground hover:text-foreground">
                  Back to {meta.subject.name}
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  setAnswers({})
                  setSubmitted(false)
                }}
                className="ml-auto inline-flex h-12 items-center gap-2 rounded-2xl border bg-card px-5 font-bold shadow-sm hover:bg-muted"
              >
                <RotateCcw className="h-4 w-4" aria-hidden /> Try again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
    </AccessGate>
  )
}

function BackLink({ meta }: { meta: ReturnType<typeof usePaperMeta>['data'] }) {
  return meta?.subject ? (
    <Link to="/subject/$subjectId" params={{ subjectId: meta.subject.id }} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" aria-hidden /> {meta.subject.name}
    </Link>
  ) : (
    <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" aria-hidden /> Home
    </Link>
  )
}
