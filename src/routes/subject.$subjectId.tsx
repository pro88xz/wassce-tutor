import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useSubject, usePapers, useTopics } from '@/lib/queries'

export const Route = createFileRoute('/subject/$subjectId')({
  component: SubjectPage,
})

function SubjectPage() {
  const { subjectId } = useParams({ from: '/subject/$subjectId' })
  const { data: subject } = useSubject(subjectId)
  const { data: papers, isLoading } = usePapers(subjectId)
  const { data: topics } = useTopics(subjectId)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back
      </Link>

      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Subject</p>
        <h1 className="text-3xl font-black tracking-tight">
          {subject?.name ?? 'Loading…'}
        </h1>
      </header>

      {topics && topics.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">Learn by topic</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {topics.map((t) => (
              <Link
                key={t.id}
                to="/topic/$topicId"
                params={{ topicId: t.id }}
                className="block rounded-2xl border bg-card p-4 transition hover:border-primary hover:shadow-lg hover:shadow-primary/5"
              >
                <p className="font-bold">{t.name}</p>
                {t.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Practice papers</h2>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading papers…</p>
        ) : !papers || papers.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No papers yet for this subject. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {papers.map((p) => (
              <Link
                key={p.id}
                to="/paper/$paperId"
                params={{ paperId: p.id }}
                className="block rounded-2xl border bg-card p-5 transition hover:border-primary hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">{p.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[p.paper_type, p.year].filter(Boolean).join(' · ')}
                      {p.description ? ` — ${p.description}` : ''}
                    </p>
                  </div>
                  <div className="ml-4 shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {p.question_count} Qs
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
