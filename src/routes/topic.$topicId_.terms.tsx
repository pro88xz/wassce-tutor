// /topic/{id}/terms: revise a topic's key terms (its lessons' definitions,
// src/lib/key-terms.ts), one card at a time. Say what the term means, open
// the card, then mark it "I know this" or "Not yet" (saved, migration 24).
// A round starts with the cards not known yet; when every card is known, a
// round goes over them all. The topic screen shows how many are known.
import { useMemo, useState } from 'react'
import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Check, CircleCheck, Eye, Layers, RotateCcw, X } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { useAuth } from '@/lib/auth'
import { usePapers, useSubject, useTopic } from '@/lib/queries'
import { setForTopic } from '@/lib/papers'
import { sectionId } from '@/lib/lesson-outlines'
import { knownCount, useKeyTermMarks, useMarkKeyTerm, useTopicKeyTerms } from '@/lib/key-term-progress'
import type { KeyTerm } from '@/lib/key-terms'
import { subjectTheme } from '@/lib/subject-theme'
import { QuestionMarkdown } from '@/components/QuestionMarkdown'
import { ProgressBar } from '@/components/ds/Progress'
import { EmptyState, Skeleton } from '@/components/ds/Primitives'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/topic/$topicId_/terms')({
  head: privateHead('Key terms'),
  component: KeyTermsRevision,
})

function KeyTermsRevision() {
  const { topicId } = useParams({ from: '/topic/$topicId_/terms' })
  const { user } = useAuth()
  const { data: topicData, isLoading: topicLoading } = useTopic(topicId)
  const { data: subject } = useSubject(topicData?.topic.subject_id ?? null)
  const { data: terms, isLoading: termsLoading } = useTopicKeyTerms(topicId)
  const { data: marks, isLoading: marksLoading } = useKeyTermMarks(user?.id ?? null)
  const { data: papers } = usePapers(topicData?.topic.subject_id ?? null)
  const mark = useMarkKeyTerm(user?.id ?? null)
  const { palette } = subjectTheme(subject?.slug)

  // The round: chosen once when the cards and marks have loaded, so marking a card does not reshuffle it.
  const [round, setRound] = useState<KeyTerm[] | null>(null)
  const [at, setAt] = useState(0)
  const [open, setOpen] = useState(false)
  const startRound = (onlyUnknown: boolean) => {
    const all = terms ?? []
    const unknown = all.filter((t) => marks?.get(t.id) !== true)
    setRound(onlyUnknown && unknown.length > 0 ? unknown : all)
    setAt(0)
    setOpen(false)
  }
  // Chosen during render, not in an effect, so the first round shows without an extra empty pass.
  if (round === null && terms && (marks || !user)) {
    const unknown = terms.filter((t) => marks?.get(t.id) !== true)
    setRound(unknown.length > 0 ? unknown : terms)
  }

  const lessonNumber = useMemo(() => new Map((topicData?.lessons ?? []).map((l, i) => [l.id, i + 1])), [topicData])

  if (topicLoading || termsLoading || marksLoading || (terms && terms.length > 0 && round === null)) {
    return (
      <div className="app-page mx-auto w-full max-w-2xl space-y-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-72" />
      </div>
    )
  }
  if (!topicData) return <EmptyState title="Topic not found" body="It may have been moved." />

  const { topic } = topicData
  const all = terms ?? []
  const known = knownCount(all, marks)
  const back = (
    <Link to="/topic/$topicId" params={{ topicId }} className="-ml-1 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" aria-hidden /> {topic.name}
    </Link>
  )

  if (all.length === 0) {
    return (
      <div className="app-page mx-auto w-full max-w-2xl space-y-4">
        {back}
        <EmptyState icon={<Layers className="h-5 w-5" />} title="No key terms for this topic yet" body="Key terms come from the definitions in the lessons. This topic's lessons do not define enough terms yet." />
      </div>
    )
  }

  const cards = round ?? all
  const done = at >= cards.length
  const card = cards[Math.min(at, cards.length - 1)]
  const practice = papers ? setForTopic(papers, { name: topic.name, subject_id: topic.subject_id }) : undefined
  const choose = (isKnown: boolean) => {
    mark.mutate({ termId: card.id, known: isKnown })
    setAt((n) => n + 1)
    setOpen(false)
  }

  return (
    <div className="app-page mx-auto w-full max-w-2xl space-y-5">
      <div className="space-y-2">
        {back}
        <p className={`text-xs font-bold uppercase tracking-[.14em] ${palette.text}`}>Key terms{subject ? ` · ${subject.name}` : ''}</p>
        <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-balance">{topic.name}</h1>
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
            <span>
              {known} of {all.length} known
            </span>
            {!done && (
              <span className="tabular-nums">
                Card {at + 1} of {cards.length}
              </span>
            )}
          </div>
          <ProgressBar value={known} max={all.length} fill={palette.bar} size="sm" label={`${known} of ${all.length} key terms known in ${topic.name}`} />
        </div>
      </div>

      {done ? (
        <section className="rounded-3xl border bg-card p-6 text-center shadow-[0_24px_48px_-32px_rgba(30,20,80,.35)] sm:p-8" aria-live="polite">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success">
            <CircleCheck className="h-7 w-7" aria-hidden />
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">
            {known === all.length ? `You know all ${all.length} key terms` : `You know ${known} of ${all.length} key terms`}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {known === all.length
              ? 'Come back to them before the exam: a quick round keeps them fresh.'
              : `Go over the ${all.length - known} you do not know yet, or read the lessons they come from.`}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {known < all.length ? (
              <Button size="lg" onClick={() => startRound(true)}>
                <RotateCcw className="h-4 w-4" aria-hidden /> Go over the {all.length - known} again
              </Button>
            ) : (
              <Button size="lg" variant="outline" onClick={() => startRound(false)}>
                <RotateCcw className="h-4 w-4" aria-hidden /> Go through them all again
              </Button>
            )}
            {practice ? (
              <Button asChild size="lg" variant={known < all.length ? 'outline' : 'default'}>
                <Link to="/paper/$paperId" params={{ paperId: practice.id }}>
                  Practise the questions <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="outline">
                <Link to="/topic/$topicId" params={{ topicId }}>Back to the topic</Link>
              </Button>
            )}
          </div>
        </section>
      ) : (
        <>
          <section
            key={card.id}
            className="flex min-h-[19rem] flex-col rounded-3xl border bg-card p-6 shadow-[0_24px_48px_-32px_rgba(30,20,80,.35)] sm:p-8"
            aria-live="polite"
          >
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-muted-foreground">
              Key term{marks?.get(card.id) === false ? ' · not yet' : ''}
            </p>
            <h2 className="mt-2 text-[1.75rem] font-bold leading-tight tracking-tight text-balance sm:text-3xl">{card.term}</h2>
            {open ? (
              <div className="mt-5 border-t pt-5">
                <QuestionMarkdown content={card.definition} className="question-md text-[16px] leading-relaxed" />
                <Link
                  to="/lesson/$lessonId"
                  params={{ lessonId: card.lessonId }}
                  hash={card.section ? sectionId(card.section) : undefined}
                  className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  From lesson {lessonNumber.get(card.lessonId) ?? 1}: {card.lessonTitle} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            ) : (
              <div className="mt-auto pt-8">
                <p className="text-sm text-muted-foreground">Say what it means, in your own words. Then check.</p>
                <Button size="lg" variant="secondary" className="mt-3 w-full" onClick={() => setOpen(true)}>
                  <Eye className="h-4 w-4" aria-hidden /> Show the definition
                </Button>
              </div>
            )}
          </section>

          {open && (
            <div className="grid grid-cols-2 gap-3">
              <Button size="lg" variant="outline" onClick={() => choose(false)}>
                <X className="h-4 w-4" aria-hidden /> Not yet
              </Button>
              <Button size="lg" onClick={() => choose(true)}>
                <Check className="h-4 w-4" aria-hidden /> I know this
              </Button>
            </div>
          )}
          {mark.isError && (
            <p className="text-sm text-danger" role="alert">
              {(mark.error as Error).message}
            </p>
          )}
        </>
      )}
    </div>
  )
}
