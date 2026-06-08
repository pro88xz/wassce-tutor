import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { AccessGate } from '@/components/AccessGate'
import { useSubject, usePapers, useTopics } from '@/lib/queries'
import type { Topic } from '@/lib/queries'

export const Route = createFileRoute('/subject/$subjectId')({
  component: SubjectPage,
})

function TopicCard({ t }: { t: Topic }) {
  return (
    <Link
      to="/topic/$topicId"
      params={{ topicId: t.id }}
      className="block rounded-2xl border bg-card p-4 transition hover:border-primary hover:shadow-lg hover:shadow-primary/5"
    >
      <p className="font-bold">{t.name}</p>
      {t.description && (
        <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
      )}
    </Link>
  )
}

function GroupedTopics({ topics }: { topics: Topic[] }) {
  const groups = useMemo(() => {
    const map = new Map<string, { order: number; topics: Topic[] }>()
    for (const t of topics) {
      const key = t.group_name || 'Other Topics'
      const order = t.group_order ?? 999
      const existing = map.get(key)
      if (existing) {
        existing.topics.push(t)
      } else {
        map.set(key, { order, topics: [t] })
      }
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, order: value.order, topics: value.topics }))
      .sort((a, b) => a.order - b.order)
  }, [topics])

  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(groups.length > 0 ? [groups[0].name] : [])
  )

  const toggle = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  return (
    <div className="space-y-3">
      {groups.map((g) => {
        const isOpen = expanded.has(g.name)
        return (
          <div key={g.name} className="rounded-2xl border bg-card">
            <button
              type="button"
              onClick={() => toggle(g.name)}
              className="flex w-full items-center justify-between rounded-2xl p-4 text-left transition hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <span className={`inline-block transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                  &#9656;
                </span>
                <span className="font-bold">{g.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {g.topics.length} topic{g.topics.length !== 1 ? 's' : ''}
              </span>
            </button>
            {isOpen && (
              <div className="grid grid-cols-1 gap-3 border-t p-4 sm:grid-cols-2">
                {g.topics.map((t) => (
                  <TopicCard key={t.id} t={t} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function FlatTopics({ topics }: { topics: Topic[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {topics.map((t) => (
        <TopicCard key={t.id} t={t} />
      ))}
    </div>
  )
}

function SubjectPage() {
  const { subjectId } = useParams({ from: '/subject/$subjectId' })
  const { data: subject } = useSubject(subjectId)
  const { data: papers, isLoading } = usePapers(subjectId)
  const { data: topics } = useTopics(subjectId)

  const hasGroups = (topics ?? []).some((t) => t.group_name)

  return (
    <AccessGate>
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Back
      </Link>
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Subject</p>
        <h1 className="text-3xl font-black tracking-tight">
          {subject?.name ?? 'Loading...'}
        </h1>
      </header>
      {topics && topics.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">Learn by topic</h2>
          {hasGroups ? <GroupedTopics topics={topics} /> : <FlatTopics topics={topics} />}
        </section>
      )}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Practice papers</h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading papers...</p>
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
                      {[p.paper_type, p.year].filter(Boolean).join(' \u00B7 ')}
                      {p.description ? ` \u2014 ${p.description}` : ''}
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
    </AccessGate>
  )
}
