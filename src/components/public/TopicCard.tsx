// Topic cards for the public syllabus pages.
//
// A topic with lessons is a card that is one link: its place in the syllabus,
// what it covers, its first two lessons as they appear on the topic page
// (with the free one marked), and how much there is to study. A topic whose
// lessons are not written yet is a plain outline row: listed, never dressed
// up as something to open.
import { ArrowRight, BookOpen, Clock } from 'lucide-react'
import type { TopicWithLessons } from '@/lib/public-content'
import { lessonMinutes, topicPath } from '@/lib/public-content'
import type { Palette } from '@/lib/subject-theme'
import { studyTime } from '@/lib/study-time'

/** Lessons previewed on a card. */
const PREVIEW = 2

const two = (n: number) => String(n).padStart(2, '0')

export function TopicCard({ subjectSlug, topic, number, palette }: { subjectSlug: string; topic: TopicWithLessons; number: number; palette: Palette }) {
  const count = topic.lessons.length
  const minutes = lessonMinutes(topic.lessons)
  const more = count - Math.min(count, PREVIEW)
  return (
    <a
      href={topicPath(subjectSlug, topic.slug)}
      aria-label={`${topic.name}: ${count} lesson${count === 1 ? '' : 's'}`}
      className="site-card site-card-link group flex h-full flex-col p-4 sm:p-5"
    >
      <span className="flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold tabular-nums ${palette.soft} ${palette.text}`}>{two(number)}</span>
        <span className="min-w-0 flex-1">
          <span className="site-h3 block text-[17px] transition-colors group-hover:text-primary">{topic.name}</span>
          {topic.description && <span className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{topic.description}</span>}
        </span>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      </span>

      <span className="mt-4 block space-y-2 border-t pt-3.5">
        {topic.lessons.slice(0, PREVIEW).map((lesson, i) => (
          <span key={lesson.id} className="flex items-center gap-2.5 text-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold tabular-nums text-muted-foreground">{i + 1}</span>
            <span className="min-w-0 flex-1 truncate font-medium">{lesson.title}</span>
            {lesson.is_public ? (
              <span className="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-bold text-success">Free</span>
            ) : lesson.est_minutes ? (
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{lesson.est_minutes} min</span>
            ) : null}
          </span>
        ))}
      </span>

      <span className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-3.5 text-[13px] font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-x-3">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" aria-hidden /> {count} lesson{count === 1 ? '' : 's'}
          </span>
          {minutes > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden /> {studyTime(minutes)}
            </span>
          )}
        </span>
        {more > 0 && <span className="font-semibold text-primary">+{more} more</span>}
      </span>
    </a>
  )
}

/** Topics in the syllabus whose lessons are not published yet: name and scope, no link. */
export function OutlineTopics({ topics, heading }: { topics: { topic: TopicWithLessons; number: number }[]; heading?: string }) {
  if (topics.length === 0) return null
  return (
    <div>
      {heading && <p className="mb-2 text-xs font-bold uppercase tracking-[.12em] text-muted-foreground">{heading}</p>}
      <ul className="grid gap-x-8 sm:grid-cols-2">
        {topics.map(({ topic, number }) => (
          <li key={topic.id} className="flex items-start gap-3 border-t border-border/70 py-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-bold tabular-nums text-muted-foreground">{two(number)}</span>
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold leading-snug">{topic.name}</span>
              {topic.description && <span className="mt-0.5 block text-[13px] leading-relaxed text-muted-foreground">{topic.description}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
