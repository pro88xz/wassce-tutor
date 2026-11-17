// Pieces of the public topic page (src/routes/wassce.$subject.$topic.tsx):
// a lesson as a card with its sections, and the previous/next topic links.
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { TopicCover } from '@/components/public/TopicCover'
import { lessonMinutes, topicPath } from '@/lib/public-content'
import type { TopicWithLessons } from '@/lib/public-content'
import { NOT_TAUGHT, plural, sectionId } from '@/lib/lesson-outlines'
import type { LessonOutline } from '@/lib/lesson-outlines'
import { studyTime } from '@/lib/study-time'

const two = (n: number) => String(n).padStart(2, '0')

/** One lesson in the topic: its number in the subject's colour, title, length and what it has, then its sections as links. */
export function LessonCard({
  number,
  title,
  minutes,
  href,
  outline,
  colours: [from, to],
}: {
  number: number
  title: string
  minutes: number | null
  href: string | null
  outline?: LessonOutline
  colours: [string, string]
}) {
  const sections = (outline?.s ?? []).filter(([, t]) => !NOT_TAUGHT.test(t))
  const extras = [outline?.w ? plural(outline.w, 'worked example') : '', outline?.f ? plural(outline.f, 'diagram') : ''].filter(Boolean)
  const head = (
    <>
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[15px] font-extrabold tabular-nums text-white shadow-[0_10px_20px_-10px_rgba(0,0,0,.45)]"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        aria-hidden
      >
        {two(number)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold uppercase tracking-[.14em] text-muted-foreground">
          Lesson {number}
          {minutes ? ` · ${minutes} min` : ''}
        </span>
        <span className={`mt-1 block text-[17px] font-bold leading-snug tracking-tight sm:text-lg ${href ? 'transition-colors group-hover/lesson:text-[var(--brand-strong)]' : ''}`}>{title}</span>
        {extras.length > 0 && (
          <span className="mt-2.5 flex flex-wrap gap-1.5">
            {extras.map((e) => (
              <span key={e} className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">{e}</span>
            ))}
          </span>
        )}
      </span>
      {href && (
        <span className="hidden shrink-0 items-center gap-1.5 self-center rounded-full border border-[var(--input)] px-4 py-2 text-sm font-bold text-[var(--primary)] transition-colors group-hover/lesson:border-[var(--primary)] group-hover/lesson:bg-[var(--primary)] group-hover/lesson:text-white sm:inline-flex">
          Start <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      )}
    </>
  )
  return (
    <li className="site-card overflow-hidden">
      {href ? (
        <a href={href} className="group/lesson flex items-start gap-4 p-4 sm:p-6">{head}</a>
      ) : (
        <div className="flex items-start gap-4 p-4 sm:p-6">{head}</div>
      )}
      {sections.length > 0 && (
        <div className="border-t border-border/70 bg-[color-mix(in_srgb,var(--muted)_45%,transparent)] px-4 py-4 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-muted-foreground">In this lesson</p>
          <ol className="mt-2 grid gap-x-6 sm:grid-cols-2">
            {sections.map(([n, t], i) => {
              const body = (
                <>
                  <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--card)] text-[11px] font-bold tabular-nums text-muted-foreground ring-1 ring-border" aria-hidden>
                    {i + 1}
                  </span>
                  <span className="line-clamp-2">{t}</span>
                </>
              )
              return (
                <li key={n}>
                  {href ? (
                    <a href={`${href}#${sectionId(n)}`} className="flex items-start gap-2.5 rounded-lg px-1.5 py-2 text-[14px] leading-snug text-foreground/85 transition-colors hover:bg-[var(--card)] hover:text-[var(--brand-strong)]">
                      {body}
                    </a>
                  ) : (
                    <span className="flex items-start gap-2.5 px-1.5 py-2 text-[14px] leading-snug text-foreground/85">{body}</span>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </li>
  )
}

/** Previous or next topic, with its cover as a thumbnail. */
export function TopicStep({
  subjectSlug,
  subjectName,
  topic,
  index,
  direction,
}: {
  subjectSlug: string
  subjectName: string
  topic: TopicWithLessons
  /** Cover colour position (TopicPageData.coverIndex) */
  index: number
  direction: 'previous' | 'next'
}) {
  const next = direction === 'next'
  return (
    <a
      href={topicPath(subjectSlug, topic.slug)}
      className={`site-card site-card-link group flex min-w-0 items-center gap-4 p-3 pr-4 ${next ? 'flex-row-reverse text-right' : ''}`}
    >
      <TopicCover subjectSlug={subjectSlug} subjectName={subjectName} topicSlug={topic.slug} topicName={topic.name} index={index} label={false} className="hidden aspect-[16/10] w-28 shrink-0 rounded-xl sm:block" />
      <span className="min-w-0 flex-1">
        <span className={`flex items-center gap-1.5 text-xs font-semibold text-muted-foreground ${next ? 'justify-end' : ''}`}>
          {!next && <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />}
          {next ? 'Next topic' : 'Previous topic'}
          {next && <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />}
        </span>
        <span className="mt-1 block truncate text-[16px] font-bold tracking-tight">{topic.name}</span>
        <span className="mt-0.5 block text-[13px] text-muted-foreground">
          {plural(topic.lessons.length, 'lesson')}
          {lessonMinutes(topic.lessons) > 0 ? ` · ${studyTime(lessonMinutes(topic.lessons))}` : ''}
        </span>
      </span>
    </a>
  )
}
