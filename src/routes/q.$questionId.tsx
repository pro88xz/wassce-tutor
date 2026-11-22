// /q/<question id>?a=<letter>: one practice question, answered from an email.
//
// The study emails (api/_lib/email, "Your question for today") link each of a
// question's options here. The page marks the answer at once: a right answer
// gets a moment of celebration, a wrong one says it needs work and gives the
// right answer. The question follows with the full working (QuestionCard), then
// what to do next: continue where they stopped, more questions on the topic,
// or the topic's lessons. Open to anyone: no account is needed to see it.
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, BookOpen, Check, ListChecks, PlayCircle, TriangleAlert } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { privateHead } from '@/lib/seo'
import { QuestionCard } from '@/components/public/QuestionCard'
import type { PublicQuestion } from '@/lib/public-content'
import { questionsPath, topicPath } from '@/lib/public-rules'
import { EmptyState, Skeleton } from '@/components/ds/Primitives'

export const Route = createFileRoute('/q/$questionId')({
  head: privateHead('Your question'),
  validateSearch: (s: Record<string, unknown>): { a?: string } => (typeof s.a === 'string' && /^[A-E]$/.test(s.a) ? { a: s.a } : {}),
  component: QuestionPage,
})

type Topic = { id: string; name: string; slug: string; subject: { name: string; slug: string } | null }

function useEmailQuestion(id: string) {
  return useQuery({
    queryKey: ['email-question', id],
    queryFn: async (): Promise<{ q: PublicQuestion; topic: Topic | null } | null> => {
      const { data: q, error } = await supabase
        .from('wassce_public_questions')
        .select('id, paper_id, topic_id, stem, image_url, explanation, position, updated_at, options')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      if (!q) return null
      const { data: topic } = await supabase.from('topics').select('id, name, slug, subject:subjects(name, slug)').eq('id', (q as PublicQuestion).topic_id).maybeSingle()
      return { q: q as PublicQuestion, topic: (topic as unknown as Topic) ?? null }
    },
  })
}

function QuestionPage() {
  const { questionId } = Route.useParams()
  const { a } = Route.useSearch()
  const { user } = useAuth()
  const { data, isLoading, error } = useEmailQuestion(questionId)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 pt-2" aria-busy="true">
        <Skeleton className="h-36" />
        <Skeleton className="h-80" />
      </div>
    )
  }
  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl pt-2">
        <EmptyState
          title="We couldn't find that question"
          body="It may have been updated since the email was sent. There are plenty more to practise."
          action={<Link to="/practice" className="font-semibold text-primary hover:underline">Go to practice</Link>}
        />
      </div>
    )
  }

  const { q, topic } = data
  const correct = q.options.find((o) => o.is_correct)
  const chosen = a && q.options.some((o) => o.label === a) ? a : undefined
  const right = chosen !== undefined && chosen === correct?.label
  const subject = topic?.subject
  const more = subject && topic ? questionsPath(subject.slug, topic.slug) : null
  const lessons = subject && topic ? topicPath(subject.slug, topic.slug) : null

  return (
    <article className="mx-auto max-w-2xl space-y-6 pt-2">
      <div className="space-y-2">
        <p className="dash-eyebrow">
          Your question for today{subject ? ` · ${subject.name}` : ''}
          {topic ? ` · ${topic.name}` : ''}
        </p>
        {chosen === undefined && <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Try today's question</h1>}
      </div>

      {chosen !== undefined && (
        <section aria-live="polite" className="answer-live dash-card overflow-hidden p-6 text-center sm:p-7">
          <span aria-hidden className={`pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl ${right ? 'bg-success/25' : 'bg-warning/20'}`} />
          <div className="relative mx-auto h-20 w-20">
            <span className={`answer-mark flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg ${right ? 'bg-gradient-to-br from-[#2fb47c] to-[#136f4b]' : 'bg-gradient-to-br from-[#ffb547] to-[#c2620f]'}`}>
              {right ? <Check className="h-10 w-10" strokeWidth={3} aria-hidden /> : <TriangleAlert className="h-9 w-9" aria-hidden />}
            </span>
            {right && (
              <span className="score-burst" aria-hidden>
                {Array.from({ length: 12 }, (_, i) => (
                  <span
                    key={i}
                    style={{ '--a': `${i * 30}deg`, '--d': `${62 + (i % 3) * 8}px`, '--delay': `${0.25 + (i % 4) * 0.04}s`, background: ['var(--success)', 'var(--primary)', 'var(--warning)', '#d23f6a'][i % 4] } as React.CSSProperties}
                  />
                ))}
              </span>
            )}
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">{right ? 'Spot on.' : 'Needs work'}</h1>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-muted-foreground">
            {right
              ? `${chosen} is right. That is the standard the WASSCE marks to. Keep the run going.`
              : `You chose ${chosen}; the answer is ${correct?.label}. Read the working below: it shows why, and why ${chosen} is a trap.`}
          </p>
        </section>
      )}

      <ol className="list-none p-0">
        <QuestionCard q={q} n={1} topic={topic?.name ?? 'Practice'} heading="h2" initial={chosen} />
      </ol>

      <section className="dash-card space-y-3 p-5 sm:p-6" aria-labelledby="next-title">
        <h2 id="next-title" className="text-lg font-bold tracking-tight">{chosen === undefined || right ? 'Keep going' : 'Make it stick'}</h2>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Link
            to={user ? '/' : '/auth'}
            className="flex min-h-14 items-center gap-3 rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:col-span-2"
          >
            <PlayCircle className="h-5 w-5 shrink-0" aria-hidden />
            <span className="flex-1">{user ? 'Continue where you stopped' : 'Sign in to continue where you stopped'}</span>
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          {more && (
            <a href={more} className="flex min-h-14 items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-sm font-semibold transition hover:border-primary/40 hover:bg-muted/40">
              <ListChecks className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span className="flex-1">More {topic!.name} questions</span>
            </a>
          )}
          {lessons && (
            <a href={lessons} className="flex min-h-14 items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-sm font-semibold transition hover:border-primary/40 hover:bg-muted/40">
              <BookOpen className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span className="flex-1">{chosen === undefined || right ? `${topic!.name} lessons` : `Revise ${topic!.name}`}</span>
            </a>
          )}
        </div>
      </section>
    </article>
  )
}
