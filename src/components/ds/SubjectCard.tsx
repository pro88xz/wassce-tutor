import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import type { SubjectProgress } from '@/lib/progress'
import { subjectTheme } from '@/lib/subject-theme'
import { SubjectCover } from '@/components/ds/SubjectCover'
import { ProgressBar, percent } from '@/components/ds/Progress'

/**
 * A subject with lessons: name, lessons and topics, progress only once there
 * is some, and the next topic. Subjects without lessons use SubjectSoonRow.
 */
export function SubjectCard({ s }: { s: SubjectProgress }) {
  const { palette } = subjectTheme(s.subject.slug)
  const started = s.done > 0
  return (
    <Link
      to="/subject/$subjectId"
      params={{ subjectId: s.subject.id }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-colors hover:border-primary/40"
    >
      <SubjectCover slug={s.subject.slug} shape="wide" rounded="rounded-none" className="aspect-[16/5] w-full sm:aspect-[16/6]" />
      <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold leading-tight">{s.subject.name}</p>
          <p className="text-xs text-muted-foreground">
            {started ? `${s.done} of ${s.total} lessons` : `${s.total} lessons in ${s.topicsWithLessons} ${s.topicsWithLessons === 1 ? 'topic' : 'topics'}`}
            {s.avgScore !== null && ` · practice ${s.avgScore}%`}
          </p>
        </div>
        {started ? (
          <span className={`text-base font-bold tabular-nums ${palette.text}`}>{percent(s.done, s.total)}%</span>
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        )}
      </div>
      {started && <ProgressBar value={s.done} max={s.total} fill={palette.bar} size="sm" label={`${s.subject.name}: ${s.done} of ${s.total} lessons done`} />}
      {s.next && (
        <p className="mt-auto truncate text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{started ? 'Next' : 'Start with'}:</span> {s.next.topic.name}
        </p>
      )}
      </div>
    </Link>
  )
}

/** A chosen subject whose lessons aren't written yet: quieter, and not a link. */
export function SubjectSoonRow({ s }: { s: SubjectProgress }) {
  return (
    <li className="flex min-h-14 items-center gap-3 px-4 py-3">
      <SubjectCover slug={s.subject.slug} shape="square" className="h-10 w-10 shrink-0 opacity-60" rounded="rounded-lg" />
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">{s.subject.name}</span>
      <span className="shrink-0 text-xs text-muted-foreground">Lessons coming soon</span>
    </li>
  )
}
