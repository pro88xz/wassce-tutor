// Focused practice: no student navigation (see showsStudentNav), a top rail
// with exit and progress, generous answer rows, a question navigator, a
// confirmation before submitting with gaps, and a results review that leads
// with a calm interpretation and links every miss back to its lesson.
import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useMemo, useRef, useState } from 'react'
import { ArrowRight, BookOpen, Check, CircleCheck, CircleX, FileText, Info, RotateCcw, X } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { AccessGate } from '@/components/AccessGate'
import { usePaper, usePaperMeta, type PaperMeta, type QuestionRow } from '@/lib/queries'
import { useSaveAttempt } from '@/lib/mutations'
import { useAuth } from '@/lib/auth'
import { useCurriculum, type CurriculumTopic } from '@/lib/progress'
import { paperKind, setName } from '@/lib/papers'
import { MarkdownView } from '@/components/MarkdownView'
import { ZoomableImage } from '@/components/ds/ZoomableImage'
import { subjectTheme } from '@/lib/subject-theme'
import { ProgressBar, percent } from '@/components/ds/Progress'
import { EmptyState, Skeleton } from '@/components/ds/Primitives'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/paper/$paperId')({
  head: privateHead('Practice'),
  component: PaperPage,
})

const isPractice = (m: PaperMeta | null | undefined) => !m?.paper_type || m.paper_type.toLowerCase() === 'practice'

function PaperPage() {
  const { paperId } = useParams({ from: '/paper/$paperId' })
  const { data: questions, isLoading } = usePaper(paperId)
  const { data: meta } = usePaperMeta(paperId)
  const { data: curriculum } = useCurriculum(meta?.subject ? [meta.subject.id] : null)
  const { palette } = subjectTheme(meta?.subject?.slug)
  const { user } = useAuth()
  const saveAttempt = useSaveAttempt()

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [missedOnly, setMissedOnly] = useState(false)
  const refs = useRef<Record<string, HTMLLIElement | null>>({})

  // The syllabus topic this set practises (sets are titled "<Topic>: practice set N").
  const topic: CurriculumTopic | undefined = useMemo(() => {
    if (!meta || !curriculum) return undefined
    const name = setName(meta.title).toLowerCase()
    return curriculum.find((t) => t.name.toLowerCase() === name)
  }, [meta, curriculum])

  const exitTo = meta?.subject ? { to: '/subject/$subjectId' as const, params: { subjectId: meta.subject.id } } : { to: '/practice' as const }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-28" />
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-56" />)}
      </div>
    )
  }
  if (!questions || questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 pt-2">
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="This set has no questions yet"
          body="It's still being written. Other practice sets are ready now."
          action={<Button asChild variant="outline"><Link to="/practice">Back to practice</Link></Button>}
        />
      </div>
    )
  }

  const total = questions.length
  const answeredCount = questions.filter((q) => answers[q.id]).length
  const unanswered = total - answeredCount
  const correctOf = (q: QuestionRow) => q.options.find((o) => o.is_correct)
  const isRight = (q: QuestionRow) => !!answers[q.id] && answers[q.id] === correctOf(q)?.id
  const score = questions.filter(isRight).length
  const wrong = answeredCount - score

  const select = (questionId: string, optionId: string) => {
    if (submitted) return
    setConfirming(false)
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  const jump = (id: string) => refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const submit = async () => {
    if (unanswered > 0 && !confirming) {
      setConfirming(true)
      return
    }
    setConfirming(false)
    setSubmitted(true)
    document.getElementById('main')?.scrollTo({ top: 0, behavior: 'smooth' })
    if (!user) return
    try {
      await saveAttempt.mutateAsync({
        profileId: user.id,
        paperId,
        score,
        total,
        answers: questions.map((q) => ({ questionId: q.id, optionId: answers[q.id] ?? null, isCorrect: isRight(q) })),
      })
    } catch (e) {
      // The result still shows; only the saved history misses this attempt.
      console.error('Failed to save attempt', e)
    }
  }

  const restart = () => {
    setAnswers({})
    setSubmitted(false)
    setMissedOnly(false)
    document.getElementById('main')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const exit = (e: React.MouseEvent) => {
    if (!submitted && answeredCount > 0 && !window.confirm('Leave this set? Your answers so far will not be saved.')) {
      e.preventDefault()
    }
  }

  const shown = submitted && missedOnly ? questions.filter((q) => !isRight(q)) : questions

  return (
    <AccessGate>
      <div className="mx-auto max-w-2xl space-y-5 pb-36">
        {/* TOP RAIL: exit, title, progress */}
        <div className="sticky top-0 z-30 -mx-4 border-b bg-background/95 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
          <div className="flex items-center gap-3">
            <Link {...exitTo} onClick={exit} aria-label="Exit practice" className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground">
              <X className="h-5 w-5" aria-hidden />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{meta ? setName(meta.title) : 'Practice'}</p>
              {!submitted ? (
                <div className="mt-1 flex items-center gap-2">
                  <ProgressBar value={answeredCount} max={total} fill={palette.bar} size="sm" label={`${answeredCount} of ${total} questions answered`} />
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{answeredCount}/{total}</span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Results and review</p>
              )}
            </div>
          </div>
        </div>

        {/* PREPARE: what this is and how it works */}
        {!submitted && (
          <header className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {[meta?.subject?.name, meta ? paperKind(meta) : null].filter(Boolean).join(' · ')}
              </p>
              <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance">{meta ? setName(meta.title) : ' '}</h1>
              <p className="text-sm text-muted-foreground">
                {total} {total === 1 ? 'question' : 'questions'} · untimed · one answer each
              </p>
            </div>
            <div className="flex gap-3 rounded-2xl border bg-card p-4 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" aria-hidden />
              <p>
                Pick one answer per question. You can change answers until you submit; then you'll see the working for every question.
                {isPractice(meta) && ' This is an original WASSCE-style set written by WASSCE Tutor, not a question paper from WAEC.'}
              </p>
            </div>
          </header>
        )}

        {/* RESULT: score, calm interpretation, specific next step */}
        {submitted && (
          <Result
            score={score}
            total={total}
            wrong={wrong}
            skipped={unanswered}
            topic={topic}
            subject={meta?.subject ?? null}
            saving={saveAttempt.isPending}
            saveFailed={saveAttempt.isError}
            onRetry={restart}
          />
        )}

        {submitted && score < total && (
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold tracking-tight">Question review</h2>
            <div className="inline-flex rounded-xl border bg-card p-1 text-sm" role="group" aria-label="Which questions to show">
              {[false, true].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  aria-pressed={missedOnly === v}
                  onClick={() => setMissedOnly(v)}
                  className={`h-9 rounded-lg px-3 font-semibold transition-colors ${missedOnly === v ? 'bg-brand-soft text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {v ? `Missed (${total - score})` : 'All'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUESTIONS */}
        <ol className="space-y-4">
          {shown.map((q) => {
            const i = questions.indexOf(q)
            const chosen = answers[q.id]
            const correct = correctOf(q)
            const right = isRight(q)
            return (
              <li key={q.id} ref={(el) => { refs.current[q.id] = el }} className="scroll-mt-20 rounded-2xl border bg-card p-5">
                <p className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>Question {i + 1} of {total}</span>
                  {submitted && (
                    right ? (
                      <span className="inline-flex items-center gap-1 text-success"><CircleCheck className="h-4 w-4" aria-hidden /> Correct</span>
                    ) : chosen ? (
                      <span className="inline-flex items-center gap-1 text-danger"><CircleX className="h-4 w-4" aria-hidden /> Incorrect</span>
                    ) : (
                      <span>Not answered</span>
                    )
                  )}
                </p>
                <div className="prose prose-slate max-w-none text-[17px] font-semibold leading-relaxed dark:prose-invert prose-p:my-0 prose-p:font-semibold">
                  <MarkdownView content={q.stem} />
                </div>

                {q.image_url && <ZoomableImage src={q.image_url} alt={`Diagram for question ${i + 1}`} />}

                <div className="mt-4 space-y-2" role={submitted ? undefined : 'radiogroup'} aria-label={`Answers for question ${i + 1}`}>
                  {q.options.map((o) => {
                    const isChosen = chosen === o.id
                    let row = 'border-border hover:border-primary/40 hover:bg-muted/40'
                    let badge = 'border-border text-muted-foreground'
                    let mark: React.ReactNode = null
                    if (submitted) {
                      if (o.is_correct) {
                        row = 'border-success bg-success/10'
                        badge = 'border-success bg-success text-white'
                        mark = <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-success"><Check className="h-4 w-4" aria-hidden /> Answer</span>
                      } else if (isChosen) {
                        row = 'border-danger bg-danger/5'
                        badge = 'border-danger bg-danger text-white'
                        mark = <span className="shrink-0 text-xs font-semibold text-danger">Your answer</span>
                      } else row = 'border-border opacity-60'
                    } else if (isChosen) {
                      row = 'border-primary bg-brand-soft/60 ring-1 ring-primary'
                      badge = 'border-primary bg-primary text-primary-foreground'
                      mark = <Check className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                    }
                    return (
                      <button
                        key={o.id}
                        type="button"
                        role={submitted ? undefined : 'radio'}
                        aria-checked={submitted ? undefined : isChosen}
                        onClick={() => select(q.id, o.id)}
                        disabled={submitted}
                        className={`flex min-h-14 w-full items-center gap-3 rounded-xl border bg-card px-4 py-3 text-left text-[15px] transition-colors ${row}`}
                      >
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${badge}`} aria-hidden>
                          {o.label}
                        </span>
                        <span className="sr-only">Option {o.label}: </span>
                        <span className="prose prose-slate max-w-none flex-1 text-[15px] dark:prose-invert prose-p:my-0">
                          <MarkdownView content={o.content} />
                        </span>
                        {mark}
                      </button>
                    )
                  })}
                </div>

                {submitted && (q.explanation || correct) && (
                  <div className="mt-4 space-y-2 rounded-xl bg-muted/60 p-4 text-sm">
                    <p className="font-semibold">
                      {right ? 'Why it is right' : 'Working'}
                      {correct && <span className="font-normal text-muted-foreground"> · answer {correct.label}</span>}
                    </p>
                    {q.explanation && (
                      <div className="prose prose-sm prose-slate max-w-none dark:prose-invert prose-p:my-1">
                        <MarkdownView content={q.explanation} />
                      </div>
                    )}
                    {!right && topic?.lessons[0] && (
                      <Link to="/topic/$topicId" params={{ topicId: topic.id }} className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary hover:underline">
                        <BookOpen className="h-4 w-4" aria-hidden /> Revise {topic.name}
                      </Link>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ol>

        {/* BOTTOM BAR: navigator + submit, or retry after results */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur-md" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="mx-auto max-w-2xl space-y-3 px-4 py-3">
            {!submitted ? (
              <>
                {total <= 40 && (
                  <nav aria-label="Questions" className="flex gap-1.5 overflow-x-auto pb-0.5">
                    {questions.map((q, i) => {
                      const done = !!answers[q.id]
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => jump(q.id)}
                          aria-label={`Question ${i + 1}, ${done ? 'answered' : 'not answered'}`}
                          className={`flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold tabular-nums transition-colors ${
                            done ? 'border-primary bg-primary text-primary-foreground' : 'border-dashed border-input bg-card text-muted-foreground hover:border-primary/50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      )
                    })}
                  </nav>
                )}
                {confirming ? (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center" role="alert">
                    <p className="flex-1 text-sm">
                      <span className="font-semibold">{unanswered} {unanswered === 1 ? 'question is' : 'questions are'} not answered.</span>{' '}
                      <span className="text-muted-foreground">They will count as wrong.</span>
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setConfirming(false)}>Keep answering</Button>
                      <Button onClick={submit}>Submit anyway</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="flex-1 text-sm text-muted-foreground">
                      {unanswered === 0 ? 'All answered. Ready when you are.' : `${answeredCount} of ${total} answered`}
                    </p>
                    <Button size="lg" disabled={answeredCount === 0} onClick={submit}>
                      Submit answers
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link {...exitTo} className="inline-flex min-h-11 flex-1 items-center text-sm font-semibold text-muted-foreground hover:text-foreground">
                  {meta?.subject ? `Back to ${meta.subject.name}` : 'Back to practice'}
                </Link>
                <Button size="lg" variant="outline" onClick={restart}>
                  <RotateCcw className="h-4 w-4" aria-hidden /> Try again
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AccessGate>
  )
}

function Result({
  score,
  total,
  wrong,
  skipped,
  topic,
  subject,
  saving,
  saveFailed,
  onRetry,
}: {
  score: number
  total: number
  wrong: number
  skipped: number
  topic: CurriculumTopic | undefined
  subject: { id: string; name: string } | null
  saving: boolean
  saveFailed: boolean
  onRetry: () => void
}) {
  const p = percent(score, total)
  const reading =
    score === total
      ? { title: 'Every answer correct', body: 'You have a firm grip on this. Move on to the next topic and come back to this set before the exam.' }
      : p >= 70
        ? { title: 'A strong result', body: 'Read the working for the questions you missed so the same mistake does not cost marks in the exam.' }
        : p >= 50
          ? { title: 'A solid base to build on', body: 'Go through the working below for each miss, then try the set again.' }
          : { title: 'This topic needs more work', body: 'That is what practice is for. Revise the lessons, read the working below, then try the set again.' }

  return (
    <section aria-labelledby="result-title" className="space-y-4 rounded-2xl border bg-card p-5 sm:p-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Your score</p>
        <p className="mt-1 text-4xl font-bold tabular-nums">
          {score}<span className="text-2xl text-muted-foreground">/{total}</span>
          <span className="ml-2 text-lg font-semibold text-muted-foreground">{p}%</span>
        </p>
        <h1 id="result-title" className="mt-3 text-xl font-bold">{reading.title}</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">{reading.body}</p>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-muted/60 p-3">
          <dt className="text-xs text-muted-foreground">Correct</dt>
          <dd className="text-lg font-bold tabular-nums">{score}</dd>
        </div>
        <div className="rounded-xl bg-muted/60 p-3">
          <dt className="text-xs text-muted-foreground">Incorrect</dt>
          <dd className="text-lg font-bold tabular-nums">{wrong}</dd>
        </div>
        <div className="rounded-xl bg-muted/60 p-3">
          <dt className="text-xs text-muted-foreground">Not answered</dt>
          <dd className="text-lg font-bold tabular-nums">{skipped}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2 sm:flex-row">
        {score < total && topic ? (
          <Button asChild>
            <Link to="/topic/$topicId" params={{ topicId: topic.id }}>
              Revise {topic.name} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        ) : p >= 70 && subject ? (
          <Button asChild>
            <Link to="/subject/$subjectId" params={{ subjectId: subject.id }}>
              Next topic in {subject.name} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        ) : null}
        <Button variant={(score < total && topic) || (p >= 70 && subject) ? 'outline' : 'default'} onClick={onRetry}>
          <RotateCcw className="h-4 w-4" aria-hidden /> Try again
        </Button>
      </div>

      <p className="text-xs text-muted-foreground" role="status">
        {saving ? 'Saving your result…' : saveFailed ? "We couldn't save this result to your history. Your score above is still correct." : 'Saved to your progress.'}
      </p>
    </section>
  )
}
