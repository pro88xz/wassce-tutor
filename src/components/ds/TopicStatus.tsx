import { CircleCheck } from 'lucide-react'
import type { TopicProgress } from '@/lib/progress'
import type { Palette } from '@/lib/subject-theme'
import { ProgressRing } from '@/components/ds/Progress'

/** Done = green tick, started = mini progress ring in the subject colour, new = empty circle, no lessons = dashed. */
export function TopicStatusIcon({ t, palette, size = 20 }: { t: TopicProgress; palette: Palette; size?: number }) {
  if (t.status === 'done') {
    return <CircleCheck className="shrink-0 text-emerald-500" style={{ width: size, height: size }} aria-label="Done" />
  }
  if (t.status === 'started') {
    return (
      <span className="shrink-0" aria-label={`In progress, ${t.done} of ${t.total} lessons`}>
        <ProgressRing value={t.done} max={t.total} size={size} thickness={3} stroke={palette.text} />
      </span>
    )
  }
  return (
    <span
      className={`shrink-0 rounded-full border-2 ${t.status === 'empty' ? 'border-dashed border-muted-foreground/30' : 'border-muted-foreground/40'}`}
      style={{ width: size, height: size }}
      aria-label={t.status === 'empty' ? 'No lessons yet' : 'Not started'}
    />
  )
}
