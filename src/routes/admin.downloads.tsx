import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { isUnlockedThisSession } from '@/lib/adminGate'

export const Route = createFileRoute('/admin/downloads')({
  component: AdminDownloads,
})

type DownloadRow = {
  id: string
  created_at: string
  user_agent: string | null
  client_id: string | null
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

function detectDevice(ua: string | null): string {
  if (!ua) return 'Unknown'
  const u = ua.toLowerCase()
  if (u.includes('android')) return '🤖 Android'
  if (u.includes('iphone') || u.includes('ipad')) return '📱 iOS'
  if (u.includes('windows')) return '💻 Windows'
  if (u.includes('mac')) return '💻 Mac'
  if (u.includes('linux')) return '💻 Linux'
  return 'Other'
}

function AdminDownloads() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const [rows, setRows] = useState<DownloadRow[]>([])
  const [loading, setLoading] = useState(true)

  // Initial load + realtime subscription
  useEffect(() => {
    if (!user || !profile?.is_admin) return

    let cancelled = false
    const load = async () => {
      const { data } = await supabase
        .from('downloads')
        .select('id,created_at,user_agent,client_id')
        .order('created_at', { ascending: false })
        .limit(500)
      if (!cancelled && data) {
        setRows(data as DownloadRow[])
      }
      setLoading(false)
    }
    load()

    // Realtime: new rows show up instantly
    const channel = supabase
      .channel('downloads-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'downloads' },
        (payload) => {
          setRows((prev) => [payload.new as DownloadRow, ...prev].slice(0, 500))
        },
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [user, profile?.is_admin])

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

  const now = Date.now()
  const last1h = rows.filter((r) => now - new Date(r.created_at).getTime() < 60 * 60 * 1000).length
  const last24h = rows.filter((r) => now - new Date(r.created_at).getTime() < 24 * 60 * 60 * 1000).length
  const uniqueClients = new Set(rows.filter((r) => r.client_id).map((r) => r.client_id)).size

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-bold">Downloads</h1>
        </div>
        <Link to="/admin"><Button variant="outline" size="sm">Back</Button></Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border bg-card p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">All time</p>
          <p className="mt-1 text-2xl font-black">{rows.length}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Last 24h</p>
          <p className="mt-1 text-2xl font-black">{last24h}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Last hour</p>
          <p className="mt-1 text-2xl font-black">{last1h}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Unique</p>
          <p className="mt-1 text-2xl font-black">{uniqueClients}</p>
        </div>
      </div>

      {/* RECENT LIST */}
      <div className="space-y-3">
        <h2 className="font-bold">Recent downloads</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No downloads yet. Share the URL!</p>
        ) : (
          <div className="space-y-2">
            {rows.slice(0, 50).map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{detectDevice(r.user_agent)}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {r.user_agent?.slice(0, 80) ?? 'Unknown device'}
                  </p>
                </div>
                <p className="ml-3 shrink-0 text-xs text-muted-foreground">
                  {relativeTime(r.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
        {rows.length > 50 && (
          <p className="text-xs text-center text-muted-foreground">
            Showing newest 50 of {rows.length} total
          </p>
        )}
      </div>
    </div>
  )
}
