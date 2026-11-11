import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronRight } from 'lucide-react'
import type { GroupProgress, TopicProgress } from '@/lib/progress'
import type { Palette } from '@/lib/subject-theme'
import { TopicStatusIcon, topicStateLabel } from '@/components/ds/TopicStatus'
import { ProgressBar } from '@/components/ds/Progress'

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
 * One topic as a card, for the subject page: what it covers, the lesson to
 * open next, and progress as a bar and in words. The whole card is the link.
 */
export function TopicCard({ t, palette, review = false }: { t: TopicProgress; palette: Palette; review?: boolean }) {
  const state = topicStateLabel(t, review)
  const minutes = t.topic.lessons.reduce((n, l) => n + (l.est_minutes ?? 0), 0)
  return (
    <li className="min-w-0">
      <Link
        to="/topic/$topicId"
        params={{ topicId: t.topic.id }}
        className="group flex h-full flex-col rounded-2xl border bg-card p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_36px_-26px_rgba(40,20,95,.5)]"
      >
        <span className="flex items-start gap-3">
          {/* flex, so the icon keeps its own width and height */}
          <span className="mt-0.5 flex shrink-0">
            <TopicStatusIcon t={t} palette={palette} size={22} review={review} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold leading-snug tracking-tight transition-colors group-hover:text-primary">{t.topic.name}</span>
            {t.topic.description && <span className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{t.topic.description}</span>}
          </span>
          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>

        {t.next && (
          <span className="mt-3 flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-sm">
            <span className="shrink-0 text-xs font-bold uppercase tracking-[.08em] text-muted-foreground">{t.status === 'new' ? 'Start' : 'Next'}</span>
            <span className="min-w-0 flex-1 truncate font-medium">{t.next.title}</span>
            {t.next.est_minutes ? <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{t.next.est_minutes} min</span> : null}
          </span>
        )}

        <span className="mt-auto block pt-3.5">
          <ProgressBar value={t.done} max={t.total} fill={palette.bar} size="sm" label={`${t.topic.name}: ${t.done} of ${t.total} lessons done`} />
          <span className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              {t.status === 'new' ? `${t.total} ${t.total === 1 ? 'lesson' : 'lessons'}` : `${t.done} of ${t.total} lessons`}
              {minutes > 0 && t.status === 'new' && ` · about ${minutes} min`}
            </span>
            <span className={`font-semibold ${state.tone}`}>{state.label}</span>
          </span>
        </span>
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
              <h3 className={showDescription ? 'text-base font-bold tracking-tight' : 'text-sm font-semibold text-muted-foreground'}>{g.name}</h3>
              {g.total > 0 && (
                <span className="text-xs tabular-nums text-muted-foreground">
                  {g.done > 0 ? `${g.done} of ${g.total} lessons` : `${g.total} lessons`}
                </span>
              )}
            </div>
            {ready.length > 0 &&
              (showDescription ? (
                // The subject page: topic cards, two to a row from desktop width.
                <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {ready.map((t) => (
                    <TopicCard key={t.topic.id} t={t} palette={palette} review={review?.has(t.topic.id)} />
                  ))}
                </ul>
              ) : (
                <ul className="divide-y rounded-2xl border bg-card">
                  {ready.map((t) => (
                    <TopicRow key={t.topic.id} t={t} palette={palette} review={review?.has(t.topic.id)} />
                  ))}
                </ul>
              ))}
            {soon.length > 0 && (
              <p className="px-1 text-xs text-muted-foreground">
                {ready.length > 0 ? `${soon.length} more ${soon.length === 1 ? 'topic' : 'topics'}` : `${soon.length} ${soon.length === 1 ? 'topic' : 'topics'}`}
                {' with lessons in preparation: '}
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
