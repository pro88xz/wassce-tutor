import type { TopicProgress } from '@/lib/progress'

/** The learning-state names used everywhere (Design System Blueprint, learning states). */
export function topicStateLabel(t: TopicProgress, review = false): { label: string; tone: string } {
  if (review) return { label: 'Review recommended', tone: 'text-warning' }
  if (t.status === 'done') return { label: 'Completed', tone: 'text-success' }
  if (t.status === 'started') return { label: 'In progress', tone: 'text-foreground' }
  if (t.status === 'empty') return { label: 'Lessons in preparation', tone: 'text-muted-foreground' }
  return { label: 'Not started', tone: 'text-muted-foreground' }
}
