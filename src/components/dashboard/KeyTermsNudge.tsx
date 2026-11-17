// Dashboard: "Key terms to revise" for the topic the student is working on,
// once they have done a lesson in it and while some of its key terms are not
// known yet (src/lib/key-term-progress.ts). Nothing when all are known.
import { Link } from '@tanstack/react-router'
import { ChevronRight, Layers } from 'lucide-react'
import { knownCount, useKeyTermMarks, useTopicKeyTerms } from '@/lib/key-term-progress'
import { subjectTheme } from '@/lib/subject-theme'
import { ProgressBar } from '@/components/ds/Progress'

export function KeyTermsNudge({ userId, topic, subjectSlug }: { userId: string; topic: { id: string; name: string }; subjectSlug: string }) {
  const { data: terms } = useTopicKeyTerms(topic.id)
  const { data: marks } = useKeyTermMarks(userId)
  const { palette } = subjectTheme(subjectSlug)
  if (!terms || terms.length === 0 || !marks) return null
  const known = knownCount(terms, marks)
  const left = terms.length - known
  if (left === 0) return null

  return (
    <section className="space-y-3" aria-labelledby="key-terms-title">
      <div>
        <h2 id="key-terms-title" className="text-lg font-bold tracking-tight">Key terms</h2>
        <p className="text-sm text-muted-foreground">The definitions from {topic.name}. Say what each means, then check.</p>
      </div>
      <Link
        to="/topic/$topicId/terms"
        params={{ topicId: topic.id }}
        className="flex min-h-16 items-center gap-3 rounded-2xl border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
      >
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${palette.soft} ${palette.text}`}>
          <Layers className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">{known === 0 ? `Revise ${terms.length} key terms` : `${left} of ${terms.length} key terms to revise`}</span>
          <span className="mt-1.5 block">
            <ProgressBar value={known} max={terms.length} fill={palette.bar} size="sm" label={`${known} of ${terms.length} key terms known in ${topic.name}`} />
          </span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      </Link>
    </section>
  )
}
