import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { AccessGate } from '@/components/AccessGate'
import { useTopic } from '@/lib/queries'

export const Route = createFileRoute('/topic/$topicId')({
  component: TopicPage,
})

function TopicPage() {
  const { topicId } = useParams({ from: '/topic/$topicId' })
  const { data, isLoading } = useTopic(topicId)

  if (isLoading) return <p className="text-muted-foreground">Loading topic…</p>
  if (!data) return <p className="text-muted-foreground">Topic not found.</p>

  const { topic, lessons } = data

  return (
    <AccessGate>
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to dashboard
      </Link>

      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Topic</p>
        <h1 className="text-3xl font-black tracking-tight">{topic.name}</h1>
        {topic.description && (
          <p className="text-sm text-muted-foreground">{topic.description}</p>
        )}
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Lessons</h2>
        {lessons.length === 0 ? (
          <p className="text-sm text-muted-foreground">No lessons here yet.</p>
        ) : (
          <div className="space-y-2">
            {lessons.map((l, i) => (
              <Link
                key={l.id}
                to="/lesson/$lessonId"
                params={{ lessonId: l.id }}
                className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 transition hover:border-primary hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="truncate font-semibold">{l.title}</p>
                </div>
                {l.est_minutes && (
                  <span className="ml-3 shrink-0 text-xs text-muted-foreground">
                    {l.est_minutes} min
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
    </AccessGate>
  )
}
