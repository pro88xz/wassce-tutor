import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { isUnlockedThisSession } from '@/lib/adminGate'

export const Route = createFileRoute('/admin/payments')({
  component: AdminPayments,
})

type PaymentRow = {
  id: string
  user_id: string
  plan: 'monthly' | 'quarterly' | 'yearly'
  amount_nle: number
  reference_code: string
  status: 'pending' | 'activated' | 'cancelled'
  created_at: string
  activated_at: string | null
  // Joined fields from profiles
  user_email?: string
  user_name?: string
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function AdminPayments() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const [rows, setRows] = useState<PaymentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'pending' | 'activated' | 'all'>('pending')
  const [activatingId, setActivatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initial load + realtime subscription
  useEffect(() => {
    if (!user || !profile?.is_admin) return

    let cancelled = false
    const load = async () => {
      // Pull payment requests with user email/name joined via foreign-table embed
      // 1. Get the payment requests
      const { data, error: loadErr } = await supabase
        .from('payment_requests')
        .select('id, user_id, plan, amount_nle, reference_code, status, created_at, activated_at')
        .order('created_at', { ascending: false })
        .limit(500)

      if (loadErr) {
        console.error('load error:', loadErr)
        if (!cancelled) setLoadError(loadErr.message + ' (code: ' + (loadErr.code || 'n/a') + ')')
        if (!cancelled) setLoading(false)
        return
      }
      if (!cancelled && data) {
        // 2. Separately fetch profiles for those users — no FK embed, no cache issues
        const userIds = [...new Set(data.map((r) => r.user_id))]
        const profilesByUser: Record<string, { full_name: string | null }> = {}
        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds)
          if (profilesData) {
            for (const pr of profilesData) profilesByUser[pr.id] = { full_name: pr.full_name }
          }
        }

        const mapped = data.map((r) => ({
          id: r.id,
          user_id: r.user_id,
          plan: r.plan,
          amount_nle: r.amount_nle,
          reference_code: r.reference_code,
          status: r.status,
          created_at: r.created_at,
          activated_at: r.activated_at,
          user_name: profilesByUser[r.user_id]?.full_name ?? undefined,
        })) as PaymentRow[]
        setRows(mapped)
      }
      setLoading(false)
    }
    load()

    const channel = supabase
      .channel('payments-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payment_requests' },
        () => { void load() },
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [user, profile?.is_admin])

  const activate = async (id: string, ref: string) => {
    if (!confirm(`Activate ${ref}? This flips the user's subscription on.`)) return
    setActivatingId(id)
    setError(null)
    try {
      const { error: rpcErr } = await supabase.rpc('activate_payment', { p_request_id: id })
      if (rpcErr) throw rpcErr
      // Optimistically mark activated locally; realtime will refresh anyway
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'activated', activated_at: new Date().toISOString() } : r)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not activate')
    } finally {
      setActivatingId(null)
    }
  }

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

  const filtered = rows.filter((r) => (filter === 'all' ? true : r.status === filter))
  const pendingCount = rows.filter((r) => r.status === 'pending').length

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-bold">Payments</h1>
        </div>
        <Link to="/admin"><Button variant="outline" size="sm">Back</Button></Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b">
        {(['pending', 'activated', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative px-4 py-2 text-sm font-semibold transition ${
              filter === f ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-xs font-bold text-white">
                {pendingCount}
              </span>
            )}
            {filter === f && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loadError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/5 p-3 text-sm text-red-600">
          <p className="font-semibold">Query failed:</p>
          <p className="font-mono text-xs">{loadError}</p>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            {filter === 'pending' ? 'No pending payments. Nice.' : 'No payments yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const pending = r.status === 'pending'
            const isActivating = activatingId === r.id
            return (
              <div
                key={r.id}
                className={`rounded-2xl border bg-card p-4 ${pending ? 'border-amber-500/40' : ''}`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-mono text-sm font-bold">{r.reference_code}</p>
                      <span
                        className={`text-xs font-bold uppercase rounded-full px-2 py-0.5 ${
                          r.status === 'activated'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : r.status === 'cancelled'
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">
                      <span className="capitalize">{r.plan}</span> · {r.amount_nle} NLe
                    </p>
                    {(r.user_email || r.user_name) && (
                      <p className="mt-0.5 text-xs text-muted-foreground truncate">
                        {r.user_name || ''} {r.user_email ? `· ${r.user_email}` : ''}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      Requested {relativeTime(r.created_at)}
                      {r.activated_at && ` · activated ${relativeTime(r.activated_at)}`}
                    </p>
                  </div>
                  {pending && (
                    <Button
                      size="sm"
                      onClick={() => activate(r.id, r.reference_code)}
                      disabled={isActivating}
                    >
                      {isActivating ? 'Activating…' : 'Activate'}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
