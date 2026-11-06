import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { isUnlockedThisSession } from '@/lib/adminGate'
import { MODES } from '@/lib/tutors'
import { Button } from '@/components/ui/button'
import { EmptyState, Pill } from '@/components/ds/Primitives'

export const Route = createFileRoute('/admin/tutor-requests')({
  component: AdminTutorRequests,
})

type Status = 'new' | 'contacted' | 'matched' | 'closed'
type RequestRow = {
  id: string
  created_at: string
  name: string
  phone: string
  subject: string
  level: string
  mode: 'online' | 'home' | 'either'
  town: string | null
  availability: string | null
  message: string | null
  status: Status
  admin_note: string | null
}

const STATUS: Record<Status, { label: string; tone: string }> = {
  new: { label: 'New', tone: 'bg-info/10 text-info' },
  contacted: { label: 'Contacted', tone: 'bg-warning/10 text-warning' },
  matched: { label: 'Matched', tone: 'bg-success/10 text-success' },
  closed: { label: 'Closed', tone: 'bg-muted text-muted-foreground' },
}

/** wa.me needs digits only, with Sierra Leone's 232 country code. */
function waNumber(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.startsWith('232')) return d
  if (d.startsWith('0')) return `232${d.slice(1)}`
  return d.length <= 8 ? `232${d}` : d
}

function AdminTutorRequests() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const qc = useQueryClient()
  const [filter, setFilter] = useState<Status | 'all'>('new')
  const allowed = !!profile?.is_admin && isUnlockedThisSession()

  const requests = useQuery({
    queryKey: ['tutor-requests'],
    enabled: allowed,
    queryFn: async (): Promise<RequestRow[]> => {
      const { data, error } = await supabase.from('tutor_requests').select('*').order('created_at', { ascending: false }).limit(500)
      if (error) throw error
      return data as RequestRow[]
    },
  })

  const update = async (id: string, patch: Partial<Pick<RequestRow, 'status' | 'admin_note'>>) => {
    const { error } = await supabase.from('tutor_requests').update(patch).eq('id', id)
    if (error) return alert(`Could not update: ${error.message}`)
    await qc.invalidateQueries({ queryKey: ['tutor-requests'] })
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

  const rows = requests.data ?? []
  const shown = rows.filter((r) => filter === 'all' || r.status === filter)
  const missingTable = (requests.error as { code?: string } | null)?.code === 'PGRST205' || (requests.error as { code?: string } | null)?.code === '42P01'

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-bold">Tutor requests</h1>
        </div>
        <Link to="/admin"><Button variant="outline" size="sm">Back</Button></Link>
      </div>

      {missingTable ? (
        <EmptyState
          title="Saving requests is not switched on yet"
          body="Run supabase/migrations/20261106_06_tutor_requests.sql in the Supabase SQL editor. Until then, requests still reach you on WhatsApp."
        />
      ) : requests.error ? (
        <EmptyState title="Could not load requests" body={(requests.error as Error).message} />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {(['new', 'contacted', 'matched', 'closed', 'all'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${filter === f ? 'border-primary bg-brand-soft text-primary' : 'bg-card'}`}
              >
                {f === 'all' ? 'All' : STATUS[f].label} ({f === 'all' ? rows.length : rows.filter((r) => r.status === f).length})
              </button>
            ))}
          </div>

          {requests.isLoading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : shown.length === 0 ? (
            <EmptyState title="No requests here" body="New requests from the Book a tutor pages appear here." />
          ) : (
            <ul className="space-y-3">
              {shown.map((r) => (
                <li key={r.id} className="space-y-3 rounded-2xl border bg-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-bold">{r.name} · {r.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {r.level} · {MODES.find((m) => m.id === r.mode)?.label ?? r.mode}
                        {r.town ? ` · ${r.town}` : ''} · {new Date(r.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Pill className={STATUS[r.status].tone}>{STATUS[r.status].label}</Pill>
                  </div>
                  {r.availability && <p className="text-sm"><span className="font-semibold">Free:</span> {r.availability}</p>}
                  {r.message && <p className="whitespace-pre-wrap text-sm"><span className="font-semibold">Needs:</span> {r.message}</p>}
                  <textarea
                    defaultValue={r.admin_note ?? ''}
                    onBlur={(e) => e.target.value !== (r.admin_note ?? '') && update(r.id, { admin_note: e.target.value || null })}
                    placeholder="Private note (saved when you click away)"
                    rows={2}
                    className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" className="bg-[#1a8d4a] hover:bg-[#157a3f]">
                      <a href={`https://wa.me/${waNumber(r.phone)}`} target="_blank" rel="noopener">
                        <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp {r.phone}
                      </a>
                    </Button>
                    {(['contacted', 'matched', 'closed'] as const)
                      .filter((s) => s !== r.status)
                      .map((s) => (
                        <Button key={s} size="sm" variant="outline" onClick={() => update(r.id, { status: s })}>
                          Mark {STATUS[s].label.toLowerCase()}
                        </Button>
                      ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
