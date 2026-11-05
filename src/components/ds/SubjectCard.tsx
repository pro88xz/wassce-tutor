import { Link } from '@tanstack/react-router'
import { PlayCircle } from 'lucide-react'
import type { SubjectProgress } from '@/lib/progress'
import { SubjectIcon, subjectTheme } from '@/lib/subject-theme'
import { ProgressBar, percent } from '@/components/ds/Progress'

/** Subject tile with its progress; used on the Subjects screen and the dashboard. */
export function SubjectCard({ s, compact = false }: { s: SubjectProgress; compact?: boolean }) {
  const { palette } = subjectTheme(s.subject.slug)
  const p = percent(s.done, s.total)
  return (
    <Link
      to="/subject/$subjectId"
      params={{ subjectId: s.subject.id }}
      className="group flex flex-col gap-3 rounded-3xl border bg-card p-4 shadow-sm shadow-black/[0.03] transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <SubjectIcon slug={s.subject.slug} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold leading-tight">{s.subject.name}</p>
          <p className="text-xs text-muted-foreground">
            {s.total > 0 ? `${s.done}/${s.total} lessons` : 'Lessons coming soon'}
            {s.avgScore !== null && ` · papers ${s.avgScore}%`}
          </p>
        </div>
        {s.total > 0 && <span className={`text-lg font-black tabular-nums ${palette.text}`}>{p}%</span>}
      </div>
      <ProgressBar value={s.done} max={s.total} fill={palette.bar} label={`${s.subject.name} lessons completed`} />
      {!compact && s.next && (
        <p className="flex items-center gap-1.5 truncate text-xs font-medium text-muted-foreground">
          <PlayCircle className={`h-4 w-4 shrink-0 ${palette.text}`} aria-hidden />
          <span className="truncate">Next: {s.next.lesson.title}</span>
        </p>
      )}
    </Link>
  )
}
