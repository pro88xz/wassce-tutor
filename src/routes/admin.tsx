import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { BadgeCheck, BadgePercent, BookOpen, Download, FileText, FileUp, GraduationCap, Layers, Library, ListChecks, ShieldCheck, Upload, UserRound, Wallet } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { privateHead } from '@/lib/seo'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { isUnlockedThisSession, tryUnlock } from '@/lib/adminGate'

export const Route = createFileRoute('/admin')({
  head: privateHead('Admin'),
  component: AdminPage,
})

function AdminPage() {
  const { user } = useAuth()
  const { data: profile, isLoading } = useProfile(user?.id ?? null)
  const loc = useLocation()
  const atRoot = loc.pathname === '/admin' || loc.pathname === '/admin/'
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setUnlocked(isUnlockedThisSession())
  }, [])

  // What is waiting for an admin decision (tutor and affiliate programmes).
  const pending = useQuery({
    queryKey: ['admin-pending-counts'],
    enabled: !!profile?.is_admin && unlocked,
    refetchInterval: 60_000,
    queryFn: async () => {
      const count = async (q: PromiseLike<{ count: number | null; error: unknown }>) => { const r = await q; return r.error ? 0 : r.count ?? 0 }
      const [applications, affiliates, commissions, payouts] = await Promise.all([
        count(supabase.from('tutor_applications').select('id', { count: 'exact', head: true }).in('status', ['submitted', 'under_review'])),
        count(supabase.from('affiliates').select('id', { count: 'exact', head: true }).eq('status', 'pending')),
        count(supabase.from('affiliate_commissions').select('id', { count: 'exact', head: true }).eq('status', 'pending')),
        count(supabase.from('affiliate_payout_requests').select('id', { count: 'exact', head: true }).in('status', ['requested', 'processing'])),
      ])
      return { applications, affiliates: affiliates + commissions + payouts }
    },
  })
  const waiting = pending.data ?? { applications: 0, affiliates: 0 }

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>

  // Not signed in
  if (!user) {
    return (
      <div className="mx-auto max-w-md space-y-3 text-center">
        <p>You must be signed in.</p>
        <Link to="/auth"><Button>Sign in</Button></Link>
      </div>
    )
  }

  // Signed in but not admin
  if (!profile?.is_admin) {
    return (
      <div className="mx-auto max-w-md space-y-3 text-center">
        <h1 className="text-2xl font-bold">Not authorised</h1>
        <p className="text-muted-foreground">This area is restricted.</p>
        <Link to="/"><Button variant="outline">Back to dashboard</Button></Link>
      </div>
    )
  }

  // Admin, but locked — needs password
  if (!unlocked) {
    const submit = async () => {
      if (!user.email) return
      setBusy(true)
      setMessage(null)
      const res = await tryUnlock(user.email, password)
      setBusy(false)
      if (res.ok) {
        setUnlocked(true)
        setPassword('')
      } else if (res.reason === 'wrong') {
        setMessage(`Wrong password. ${res.attemptsLeft} attempt${res.attemptsLeft === 1 ? '' : 's'} left.`)
      } else if (res.reason === 'locked') {
        const mins = Math.ceil((new Date(res.until).getTime() - Date.now()) / 60000)
        setMessage(`Locked. Try again in ${mins} minute${mins === 1 ? '' : 's'}.`)
      } else {
        setMessage(res.message)
      }
    }

    return (
      <div className="mx-auto max-w-sm space-y-5 pt-8">
        <div className="text-center space-y-1">
          <span className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg"><ShieldCheck className="h-7 w-7" aria-hidden /></span>
          <h1 className="text-3xl font-bold tracking-tight">Admin access</h1>
          <p className="text-sm text-muted-foreground">Confirm your password to continue.</p>
        </div>
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 w-full rounded-xl border bg-background px-4 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        {message && <p className="text-sm text-red-500">{message}</p>}
        <Button className="w-full" disabled={busy || !password} onClick={submit}>
          {busy ? 'Verifying…' : 'Unlock'}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          <Link to="/">← Back to dashboard</Link>
        </p>
      </div>
    )
  }

  // Unlocked — render either the sub-route outlet or the admin home grid
  return (
    <div className="admin-page mx-auto w-full max-w-6xl space-y-6">
      {atRoot && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
            <h1 className="text-3xl font-bold tracking-tight">Content management</h1>
          </div>
          <Link to="/"><Button variant="outline" size="sm">Back</Button></Link>
        </div>
      )}

      {atRoot && (waiting.applications > 0 || waiting.affiliates > 0) && (
        <div role="status" className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <span className="font-semibold">Waiting for you:</span>
          {waiting.applications > 0 && <Link to="/admin/tutors" className="font-semibold underline">{waiting.applications} tutor application{waiting.applications === 1 ? '' : 's'}</Link>}
          {waiting.affiliates > 0 && <Link to="/admin/affiliates" className="font-semibold underline">{waiting.affiliates} affiliate item{waiting.affiliates === 1 ? '' : 's'}</Link>}
        </div>
      )}

      {!atRoot ? <Outlet /> : (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          to="/admin/tutors"
          className="rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:shadow-md"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><GraduationCap className="h-5 w-5" aria-hidden /></span>
          <h2 className="font-bold">Tutors{waiting.applications > 0 && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 align-middle text-xs font-bold text-amber-800">{waiting.applications} waiting</span>}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Approve tutor applications, pause or restore tutors, see every booking.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>
        <Link
          to="/admin/affiliates"
          className="rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:shadow-md"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><BadgePercent className="h-5 w-5" aria-hidden /></span>
          <h2 className="font-bold">Affiliates{waiting.affiliates > 0 && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 align-middle text-xs font-bold text-amber-800">{waiting.affiliates} waiting</span>}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Approve affiliates, review commissions, settle payout requests.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>
        <Link
          to="/admin/question-bank"
          className="rounded-2xl border border-primary/40 bg-primary/5 p-5 transition hover:border-primary hover:shadow-lg hover:shadow-primary/5"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Library className="h-5 w-5" aria-hidden /></span>
          <h2 className="font-bold">Load question sets</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add ready-made, answer-checked practice questions in one tap.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>
        <Link
          to="/admin/topics"
          className="rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:shadow-md"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Layers className="h-5 w-5" aria-hidden /></span>
          <h2 className="font-bold">Topics</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create and manage topics by subject.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>
        <Link
          to="/admin/review"
          className="rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:shadow-md"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><BadgeCheck className="h-5 w-5" aria-hidden /></span>
          <h2 className="font-bold">Review lessons</h2>
          <p className="mt-1 text-sm text-muted-foreground">Approve lessons as free public pages; show or hide practice sets.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>
        <Link
          to="/admin/lessons"
          className="rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:shadow-md"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><BookOpen className="h-5 w-5" aria-hidden /></span>
          <h2 className="font-bold">Lessons</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add lessons under topics.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>
        <Link
          to="/admin/papers"
          className="rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:shadow-md"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" aria-hidden /></span>
          <h2 className="font-bold">Papers</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create practice papers and exams.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>
        <Link
          to="/admin/questions"
          className="rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:shadow-md"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ListChecks className="h-5 w-5" aria-hidden /></span>
          <h2 className="font-bold">Questions</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add questions with options.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>

        <Link
          to="/admin/import"
          className="rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:shadow-md"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Upload className="h-5 w-5" aria-hidden /></span>
          <h2 className="font-bold">Bulk Import Topics</h2>
          <p className="mt-1 text-sm text-muted-foreground">Paste JSON to import topics in bulk.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>

        <Link
          to="/admin/import-lessons"
          className="rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:shadow-md"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileUp className="h-5 w-5" aria-hidden /></span>
          <h2 className="font-bold">Bulk Import Lessons</h2>
          <p className="mt-1 text-sm text-muted-foreground">Paste JSON to import lessons in bulk.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>

        <Link
          to="/admin/payments"
          className="rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:shadow-md"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Wallet className="h-5 w-5" aria-hidden /></span>
          <h2 className="font-bold">Payments</h2>
          <p className="mt-1 text-sm text-muted-foreground">Activate pending subscriptions, view history.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>

        <Link
          to="/admin/tutor-requests"
          className="rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:shadow-md"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><UserRound className="h-5 w-5" aria-hidden /></span>
          <h2 className="font-bold">Tutor requests (WhatsApp)</h2>
          <p className="mt-1 text-sm text-muted-foreground">Match requests from the Book a tutor form: contact, match, close.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>

        <Link
          to="/admin/downloads"
          className="rounded-3xl border bg-card p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/40 hover:shadow-md"
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Download className="h-5 w-5" aria-hidden /></span>
          <h2 className="font-bold">Downloads</h2>
          <p className="mt-1 text-sm text-muted-foreground">APK download tracking, live updates.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>
      </div>
      )}
    </div>
  )
}
