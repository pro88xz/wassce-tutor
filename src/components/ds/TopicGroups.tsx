import { Link } from '@tanstack/react-router'
import type { GroupProgress, TopicProgress } from '@/lib/progress'
import type { Palette } from '@/lib/subject-theme'
import { ProgressBar } from '@/components/ds/Progress'
import { TopicStatusIcon } from '@/components/ds/TopicStatus'

/** One topic: status icon, name, progress bar, done/total. Links to the topic when it has lessons. */
export function TopicRow({ t, palette, showDescription = false }: { t: TopicProgress; palette: Palette; showDescription?: boolean }) {
  return (
    <li>
      <Link
        to="/topic/$topicId"
        params={{ topicId: t.topic.id }}
        className="flex items-center gap-3 rounded-2xl bg-card px-3 py-3 ring-1 ring-border/60 transition hover:ring-primary/40"
      >
        <TopicStatusIcon t={t} palette={palette} size={22} />
        <span className="min-w-0 flex-1 space-y-1">
          <span className="block truncate text-sm font-semibold">{t.topic.name}</span>
          {showDescription && t.topic.description && (
            <span className="block line-clamp-2 text-xs text-muted-foreground">{t.topic.description}</span>
          )}
          <ProgressBar value={t.done} max={t.total} fill={palette.bar} size="sm" label={`${t.topic.name} lessons completed`} />
        </span>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
          {t.done}/{t.total}
        </span>
      </Link>
    </li>
  )
}

/**
 * Syllabus sections with per-topic progress. Topics that don't have lessons
 * yet are summarised in one line per section instead of listed one by one.
 */
export function TopicGroups({ groups, palette, showDescription = false }: { groups: GroupProgress[]; palette: Palette; showDescription?: boolean }) {
  return (
    <div className="space-y-6">
      {groups.map((g) => {
        const ready = g.topics.filter((t) => t.total > 0)
        const soon = g.topics.filter((t) => t.total === 0)
        return (
          <section key={g.name} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{g.name}</h3>
              {g.total > 0 && (
                <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                  {g.done}/{g.total} lessons
                </span>
              )}
            </div>
            {ready.length > 0 && (
              <ul className="space-y-2">
                {ready.map((t) => <TopicRow key={t.topic.id} t={t} palette={palette} showDescription={showDescription} />)}
              </ul>
            )}
            {soon.length > 0 && (
              <p className="rounded-2xl border border-dashed px-3 py-2.5 text-xs text-muted-foreground">
                {ready.length > 0 ? `+${soon.length} more topic${soon.length === 1 ? '' : 's'}` : `${soon.length} topic${soon.length === 1 ? '' : 's'}`}
                {' · '}lessons coming soon:{' '}
                <span className="text-foreground/70">
                  {soon.slice(0, 4).map((t) => t.topic.name).join(', ')}
                  {soon.length > 4 && ` and ${soon.length - 4} more`}
                </span>
              </p>
            )}
          </section>
        )
      })}
    </div>
  )
}
