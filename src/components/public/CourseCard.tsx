// A topic as a course card, as a course marketplace shows it: the drawn
// cover, the topic's name, its real length and lesson count, and a "Free"
// tag. The homepage course rows and the foot of every topic page use it, so
// a topic looks the same wherever it is offered.
//
// With `preview`, hovering (or focusing) the card on a pointer device shows
// what the topic covers and its first lessons, as on the homepage.
import { ArrowRight, BookOpen, Check, Clock, Gift } from 'lucide-react'
import { topicPath } from '@/lib/public-rules'
import { TopicCover } from '@/components/public/TopicCover'

/** "45 min", "2 h", "3 h 20 min", rounded to five minutes. */
function formatLength(minutes: number) {
  const m = Math.max(5, Math.round(minutes / 5) * 5)
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const rest = m % 60
  return rest ? `${h} h ${rest} min` : `${h} h`
}

export type CourseCardData = {
  topicSlug: string
  topicName: string
  minutes: number
  lessons: number
  freeLessons: number
  /** What the topic covers (the hover preview) */
  summary?: string | null
  /** The topic's first lesson titles (the hover preview) */
  firstLessons?: string[]
}

export function CourseCard({
  subjectSlug,
  subjectName,
  course: c,
  index = 0,
  preview = false,
  className = '',
}: {
  subjectSlug: string
  subjectName: string
  course: CourseCardData
  /** Position in a row: shifts the cover colour so neighbours differ. */
  index?: number
  preview?: boolean
  className?: string
}) {
  return (
    <a href={topicPath(subjectSlug, c.topicSlug)} className={`group relative flex flex-col rounded-xl outline-none ${className}`}>
      <TopicCover subjectSlug={subjectSlug} subjectName={subjectName} topicSlug={c.topicSlug} topicName={c.topicName} index={index} className="aspect-[16/9] rounded-xl ring-1 ring-slate-900/[0.07]" />
      <span className="flex flex-1 flex-col pt-3">
        <span className="line-clamp-2 text-[16px] font-bold leading-snug tracking-tight text-foreground group-hover:text-[var(--brand-strong)]">{c.topicName}</span>
        <span className="mt-1 text-[13px] text-muted-foreground">WASSCE {subjectName}</span>
        <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium text-slate-600 dark:text-slate-300">
          {c.minutes > 0 && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden /> {formatLength(c.minutes)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" aria-hidden /> {c.lessons} {c.lessons === 1 ? 'lesson' : 'lessons'}
          </span>
        </span>
        {c.freeLessons > 0 && (
          <span className="mt-2.5 inline-flex w-fit items-center gap-1 rounded bg-[#eceb98] px-2 py-0.5 text-[12px] font-bold text-[#3d3c0a]">
            <Gift className="h-3.5 w-3.5" aria-hidden /> Free
          </span>
        )}
      </span>

      {preview && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 hidden flex-col rounded-xl bg-white p-5 text-slate-900 opacity-0 shadow-[0_24px_60px_-20px_rgba(30,20,80,.45)] ring-1 ring-slate-900/10 transition duration-200 [@media(hover:hover)]:flex group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-visible:ring-2 group-focus-visible:ring-[var(--primary)]"
        >
          <span className="text-[11px] font-bold uppercase tracking-[.12em] text-violet-700">{subjectName}</span>
          <span className="mt-1 line-clamp-2 text-[17px] font-bold leading-snug tracking-tight">{c.topicName}</span>
          {c.summary && <span className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-slate-600">{c.summary}</span>}
          {c.firstLessons && c.firstLessons.length > 0 && (
            <>
              <span className="mt-3 text-[11px] font-bold uppercase tracking-[.1em] text-slate-500">First lessons</span>
              <span className="mt-1.5 space-y-1.5">
                {c.firstLessons.map((t) => (
                  <span key={t} className="flex gap-2 text-[13px] font-medium leading-snug">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={3} />
                    <span className="line-clamp-1">{t}</span>
                  </span>
                ))}
              </span>
            </>
          )}
          <span className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--primary)] text-sm font-bold text-white">
            {c.freeLessons > 0 ? 'Start the first lesson' : 'Open the topic'} <ArrowRight className="h-4 w-4" />
          </span>
        </span>
      )}
    </a>
  )
}
