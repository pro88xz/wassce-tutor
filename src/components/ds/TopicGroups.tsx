import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, ChevronDown, ChevronRight } from 'lucide-react'
import type { GroupProgress, TopicProgress } from '@/lib/progress'
import type { Palette } from '@/lib/subject-theme'
import { TopicStatusIcon } from '@/components/ds/TopicStatus'
import { topicStateLabel } from '@/components/ds/topic-state'
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
            {t.topic.description && <span className="mt-1 line-clamp-1 text-sm leading-relaxed text-muted-foreground sm:line-clamp-2">{t.topic.description}</span>}
          </span>
          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>

        {t.next && (
          <span className="mt-3 hidden items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-sm sm:flex">
            <span className="shrink-0 text-xs font-bold uppercase tracking-[.08em] text-muted-foreground">{t.status === 'new' ? 'Start' : 'Next'}</span>
            <span className="min-w-0 flex-1 truncate font-medium">{t.next.title}</span>
            {t.next.est_minutes ? <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{t.next.est_minutes} min</span> : null}
          </span>
        )}

        <span className="mt-auto block pt-1.5 sm:pt-3">
          {t.done > 0 && <ProgressBar value={t.done} max={t.total} fill={palette.bar} size="sm" label={`${t.topic.name}: ${t.done} of ${t.total} lessons done`} />}
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
  collapsible = false,
  openFirst,
}: {
  groups: GroupProgress[]
  palette: Palette
  showDescription?: boolean
  /** topic ids whose practice result suggests revising */
  review?: Set<string>
  /** Sections fold to one header row each (the subject page). */
  collapsible?: boolean
  /** The section to open at first (where the student's next lesson is). */
  openFirst?: string
}) {
  const [open, setOpen] = useState<Set<string>>(() => new Set([openFirst ?? groups[0]?.name ?? '']))
  const toggle = (name: string) =>
    setOpen((cur) => {
      const nextOpen = new Set(cur)
      if (nextOpen.has(name)) nextOpen.delete(name)
      else nextOpen.add(name)
      return nextOpen
    })
  // With one section, or when a search has narrowed the list, show it all.
  const folds = collapsible && groups.length > 1
  return (
    <div className={folds ? 'space-y-3' : 'space-y-6'}>
      {groups.map((g, gi) => {
        const ready = g.topics.filter((t) => t.total > 0)
        const soon = g.topics.filter((t) => t.total === 0)
        const isOpen = !folds || open.has(g.name)
        const panel = `group-${gi}`
        if (folds) {
          return (
            <section key={g.name} className={`overflow-hidden rounded-2xl border bg-card ${isOpen ? 'shadow-sm' : ''}`}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(g.name)}
                  aria-expanded={isOpen}
                  aria-controls={panel}
                  className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold tabular-nums ${g.total > 0 && g.done === g.total ? 'bg-success/15 text-success' : 'bg-brand-soft text-primary'}`}>
                    {gi + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold leading-snug tracking-tight">{g.name}</span>
                    <span className="mt-0.5 block text-xs tabular-nums text-muted-foreground">
                      {ready.length} {ready.length === 1 ? 'topic' : 'topics'}
                      {g.total > 0 && (g.done > 0 ? ` · ${g.done} of ${g.total} lessons` : ` · ${g.total} lessons`)}
                    </span>
                    {g.done > 0 && (
                      <span className="mt-1.5 block max-w-xs">
                        <ProgressBar value={g.done} max={g.total} fill={palette.bar} size="sm" label={`${g.name}: ${g.done} of ${g.total} lessons done`} />
                      </span>
                    )}
                  </span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
                </button>
              </h3>
              {isOpen && (
                <div id={panel} className="space-y-2 border-t bg-muted/20 p-3 sm:p-4">
                  {ready.length > 0 && (
                    <ul className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
                      {ready.map((t) => (
                        <TopicCard key={t.topic.id} t={t} palette={palette} review={review?.has(t.topic.id)} />
                      ))}
                    </ul>
                  )}
                  {soon.length > 0 && <SoonLine soon={soon} ready={ready.length} />}
                </div>
              )}
            </section>
          )
        }
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
            {soon.length > 0 && <SoonLine soon={soon} ready={ready.length} />}
          </section>
        )
      })}
    </div>
  )
}

/** Topics without lessons yet, in one quiet line. */
function SoonLine({ soon, ready }: { soon: TopicProgress[]; ready: number }) {
  return (
    <p className="px-1 text-xs text-muted-foreground">
      {ready > 0 ? `${soon.length} more ${soon.length === 1 ? 'topic' : 'topics'}` : `${soon.length} ${soon.length === 1 ? 'topic' : 'topics'}`}
      {' with lessons in preparation: '}
      {soon.slice(0, 4).map((t) => t.topic.name).join(', ')}
      {soon.length > 4 && ` and ${soon.length - 4} more`}.
    </p>
  )
}
