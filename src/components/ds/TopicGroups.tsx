import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import type { GroupProgress, TopicProgress } from '@/lib/progress'
import type { Palette } from '@/lib/subject-theme'
import { TopicStatusIcon, topicStateLabel } from '@/components/ds/TopicStatus'

/**
 * One topic: state icon, name, short description, then lessons and state in
 * words ("3 of 8 lessons · In progress"). The whole row is the tap target.
 */
export function TopicRow({ t, palette, showDescription = false, review = false }: { t: TopicProgress; palette: Palette; showDescription?: boolean; review?: boolean }) {
  const state = topicStateLabel(t, review)
  // Total reading time, shown for topics not started yet.
  const minutes = t.topic.lessons.reduce((n, l) => n + (l.est_minutes ?? 0), 0)
  return (
    <li>
      <Link
        to="/topic/$topicId"
        params={{ topicId: t.topic.id }}
        className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
      >
        <TopicStatusIcon t={t} palette={palette} size={22} review={review} />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-snug">{t.topic.name}</span>
          {showDescription && t.topic.description && (
            <span className="mt-0.5 block line-clamp-2 text-sm text-muted-foreground">{t.topic.description}</span>
          )}
          <span className="mt-1 block text-xs text-muted-foreground">
            {t.status === 'new' ? `${t.total} ${t.total === 1 ? 'lesson' : 'lessons'}` : `${t.done} of ${t.total} lessons`}
            {minutes > 0 && t.status === 'new' && ` · about ${minutes} min`}
            {' · '}
            <span className={`font-semibold ${state.tone}`}>{state.label}</span>
          </span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      </Link>
    </li>
  )
}

/**
 * Syllabus sections with per-topic state. Topics that don't have lessons yet
 * are summarised in one quiet line per section instead of listed as if they
 * could be opened.
 */
export function TopicGroups({
  groups,
  palette,
  showDescription = false,
  review,
}: {
  groups: GroupProgress[]
  palette: Palette
  showDescription?: boolean
  /** topic ids whose practice result suggests revising */
  review?: Set<string>
}) {
  return (
    <div className="space-y-6">
      {groups.map((g) => {
        const ready = g.topics.filter((t) => t.total > 0)
        const soon = g.topics.filter((t) => t.total === 0)
        return (
          <section key={g.name} className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-semibold text-muted-foreground">{g.name}</h3>
              {g.total > 0 && (
                <span className="text-xs tabular-nums text-muted-foreground">
                  {g.done > 0 ? `${g.done} of ${g.total} lessons` : `${g.total} lessons`}
                </span>
              )}
            </div>
            {ready.length > 0 && (
              <ul className="divide-y rounded-2xl border bg-card">
                {ready.map((t) => (
                  <TopicRow key={t.topic.id} t={t} palette={palette} showDescription={showDescription} review={review?.has(t.topic.id)} />
                ))}
              </ul>
            )}
            {soon.length > 0 && (
              <p className="px-1 text-xs text-muted-foreground">
                {ready.length > 0 ? `${soon.length} more ${soon.length === 1 ? 'topic' : 'topics'}` : `${soon.length} ${soon.length === 1 ? 'topic' : 'topics'}`}
                {' with lessons coming soon: '}
                {soon.slice(0, 4).map((t) => t.topic.name).join(', ')}
                {soon.length > 4 && ` and ${soon.length - 4} more`}.
              </p>
            )}
          </section>
        )
      })}
    </div>
  )
}
