import { Link } from '@tanstack/react-router'
import { ChevronRight, Lock } from 'lucide-react'
import type { PaperRow } from '@/lib/queries'
import type { ScoredAttempt } from '@/lib/progress'
import { paperKind, setName } from '@/lib/papers'
import { Pill, ScorePill } from '@/components/ds/Primitives'

/**
 * One practice set or paper in a list: name, kind and size, then best score
 * or "Not started". On a free account, `access` marks the starter set "Free"
 * and the rest with a lock (they open the plans screen).
 */
export function PracticeSetRow({ paper, best, accent, access }: { paper: PaperRow; best?: ScoredAttempt; accent: string; access?: 'free' | 'locked' }) {
  return (
    <li>
      <Link to="/paper/$paperId" params={{ paperId: paper.id }} className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
        <span className={`h-9 w-1 shrink-0 rounded-full ${accent}`} aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{setName(paper.title)}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {paperKind(paper)} · {paper.question_count} questions
          </span>
        </span>
        {access === 'locked' ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            <Lock className="h-3 w-3" aria-hidden /> Plan
          </span>
        ) : best ? (
          <span className="flex shrink-0 flex-col items-end gap-0.5">
            <ScorePill score={best.score} total={best.total} />
            <span className="text-[11px] text-muted-foreground">Best</span>
          </span>
        ) : access === 'free' ? (
          <Pill className="bg-success/10 text-success">Free</Pill>
        ) : (
          <Pill>Not started</Pill>
        )}
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      </Link>
    </li>
  )
}
