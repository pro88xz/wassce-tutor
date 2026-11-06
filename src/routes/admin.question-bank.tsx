import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { CheckCircle2, Library } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { isUnlockedThisSession } from '@/lib/adminGate'
import { QUESTION_SETS, useLoadQuestionSet, useQuestionSetStatus } from '@/lib/question-bank'
import type { SetStatus, SetSummary } from '@/lib/question-bank'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/admin/question-bank')({
  component: AdminQuestionBank,
})

function AdminQuestionBank() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const { data: status, isLoading } = useQuestionSetStatus()

  if (!user) return <p>Sign in required.</p>
  if (!profile?.is_admin) return <p>Not authorised.</p>
  if (!isUnlockedThisSession()) {
    return (
      <div className="mx-auto max-w-md space-y-3 text-center">
        <p className="text-muted-foreground">Admin session locked.</p>
        <Link to="/admin"><Button>Unlock</Button></Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-bold">Load question sets</h1>
        </div>
        <Link to="/admin"><Button variant="outline" size="sm">Back</Button></Link>
      </div>

      <p className="text-sm text-muted-foreground">
        Each set adds one practice paper per topic, with every answer already checked. New and corrected sets are loaded
        automatically on every deploy, and go live for students straight away. Use <b>Load</b> only if a set shows as not
        loaded. Loading again updates the same questions; it never adds copies. Hide a set any time in Admin → Review.
      </p>

      <ul className="space-y-3">
        {QUESTION_SETS.map((s) => (
          <SetCard key={s.name} set={s} status={status?.[s.name]} checking={isLoading} />
        ))}
      </ul>
    </div>
  )
}

function SetCard({ set, status, checking }: { set: SetSummary; status?: SetStatus; checking: boolean }) {
  const load = useLoadQuestionSet()
  const [done, setDone] = useState<{ papers: number; questions: number } | null>(null)
  const total = set.papers.length
  const loaded = status?.loaded ?? 0
  const live = status?.live ?? 0
  const state = checking ? 'Checking…' : loaded === 0 ? 'Not loaded' : live === total ? 'Live' : loaded === total ? `${live} of ${total} topics live` : `${loaded} of ${total} topics loaded`

  return (
    <li className="space-y-3 rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03]">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Library className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold">{set.label}</p>
          <p className="text-sm text-muted-foreground">{set.questions} questions · {total} topics, one practice set each</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${live === total && !checking ? 'bg-emerald-500/10 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
          {state}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          disabled={load.isPending}
          onClick={() => { setDone(null); load.mutate(set.name, { onSuccess: setDone }) }}
        >
          {load.isPending ? 'Loading…' : loaded > 0 ? 'Load again' : 'Load'}
        </Button>
        {done && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> {done.questions} questions in {done.papers} practice sets are live.
          </span>
        )}
        {load.isError && <span className="text-sm text-red-600">{(load.error as Error).message}</span>}
      </div>
    </li>
  )
}
