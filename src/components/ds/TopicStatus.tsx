import { CircleCheck, RotateCcw } from 'lucide-react'
import type { TopicProgress } from '@/lib/progress'
import type { Palette } from '@/lib/subject-theme'
import { ProgressRing } from '@/components/ds/Progress'

/**
 * Completed = green tick, in progress = mini ring in the subject colour,
 * review recommended = amber retry mark, not started = empty circle.
 * Decorative: the state is always also written out in text next to it.
 */
export function TopicStatusIcon({ t, palette, size = 20, review = false }: { t: TopicProgress; palette: Palette; size?: number; review?: boolean }) {
  if (review) {
    return (
      <span className="flex shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning" style={{ width: size, height: size }} aria-hidden>
        <RotateCcw style={{ width: size * 0.6, height: size * 0.6 }} />
      </span>
    )
  }
  if (t.status === 'done') {
    return <CircleCheck className="shrink-0 text-success" style={{ width: size, height: size }} aria-hidden />
  }
  if (t.status === 'started') {
    return (
      <span className="shrink-0" aria-hidden>
        <ProgressRing value={t.done} max={t.total} size={size} thickness={3} stroke={palette.text} />
      </span>
    )
  }
  return (
    <span
      className={`shrink-0 rounded-full border-2 ${t.status === 'empty' ? 'border-dashed border-muted-foreground/30' : 'border-muted-foreground/40'}`}
      style={{ width: size, height: size }}
      aria-hidden
    />
  )
}
