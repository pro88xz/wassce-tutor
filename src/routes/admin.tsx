import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { isUnlockedThisSession, tryUnlock } from '@/lib/adminGate'

export const Route = createFileRoute('/admin')({
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
          <h1 className="text-2xl font-bold">Admin access</h1>
          <p className="text-sm text-muted-foreground">Confirm your password to continue.</p>
        </div>
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
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
    <div className="mx-auto max-w-3xl space-y-6">
      {atRoot && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
            <h1 className="text-2xl font-bold">Content management</h1>
          </div>
          <Link to="/"><Button variant="outline" size="sm">Back</Button></Link>
        </div>
      )}

      {!atRoot ? <Outlet /> : (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          to="/admin/topics"
          className="rounded-2xl border bg-card p-5 transition hover:border-primary hover:shadow-lg hover:shadow-primary/5"
        >
          <h2 className="font-bold">Topics</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create and manage topics by subject.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>
        <Link
          to="/admin/lessons"
          className="rounded-2xl border bg-card p-5 transition hover:border-primary hover:shadow-lg hover:shadow-primary/5"
        >
          <h2 className="font-bold">Lessons</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add lessons under topics.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>
        <Link
          to="/admin/papers"
          className="rounded-2xl border bg-card p-5 transition hover:border-primary hover:shadow-lg hover:shadow-primary/5"
        >
          <h2 className="font-bold">Papers</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create practice papers and exams.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>
        <Link
          to="/admin/questions"
          className="rounded-2xl border bg-card p-5 transition hover:border-primary hover:shadow-lg hover:shadow-primary/5"
        >
          <h2 className="font-bold">Questions</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add questions with options.</p>
          <p className="mt-3 text-xs text-primary">Open →</p>
        </Link>
      </div>
      )}
    </div>
  )
}
