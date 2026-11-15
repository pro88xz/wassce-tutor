import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Capacitor } from '@capacitor/core'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { isUnlockedThisSession } from '@/lib/adminGate'

export const Route = createFileRoute('/admin/emails')({
  component: AdminEmails,
})

// The Android app runs from local files, so it calls the website's API.
const API = typeof window !== 'undefined' && Capacitor.isNativePlatform() ? 'https://wasscetutor.com' : ''

type Status = { paused: boolean; launched_at: string; subscribed: number; unsubscribed: number; not_subscribed: number; suppressed: number; sent_today: number }
type ReportRow = { programme: string; queued: number; sent: number; failed: number; skipped: number; clicked_students: number; studied_within_7d: number; paid_within_7d: number }
type Config = { mode: string; dailyLimit: number; pilotRecipients: number; configured: Record<'resend' | 'tokenSecret' | 'cron' | 'webhook', boolean> }

const PROGRAMME_NAMES: Record<string, string> = {
  access_started: 'Access started (account)',
  access_ending: 'Access ending (account)',
  pending_payment: 'Unfinished payment',
  activation: 'First study session',
  reengage: 'Come back to studying',
}
const MODE_HELP: Record<string, string> = {
  off: 'Nothing is decided or sent. Set EMAIL_MODE in Vercel to start.',
  'dry-run': 'Each daily run decides who is due, and logs it, but sends nothing.',
  pilot: 'Real emails, but only to the addresses in EMAIL_ONLY_TO.',
  live: 'Real emails to every student who is due one.',
}

async function api(method: 'GET' | 'POST', body?: unknown) {
  const { data } = await supabase.auth.getSession()
  const res = await fetch(`${API}/api/email/admin`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session?.access_token ?? ''}` },
    body: body ? JSON.stringify(body) : undefined,
  })
  return { ok: res.ok, data: await res.json().catch(() => null) }
}

function AdminEmails() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const queryClient = useQueryClient()
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const ready = !!user && !!profile?.is_admin && isUnlockedThisSession()

  const { data } = useQuery({
    queryKey: ['admin-email-engine'],
    enabled: ready,
    queryFn: async () => {
      const [s, r, c] = await Promise.all([supabase.rpc('email_engine_status'), supabase.rpc('email_engine_report', { p_days: 30 }), api('GET')])
      return {
        missing: !!s.error,
        status: s.error ? null : ((s.data as Status[])[0] ?? null),
        report: r.error ? [] : ((r.data as ReportRow[]) ?? []),
        config: c.ok ? (c.data as Config) : null,
      }
    },
  })
  const status = data?.status ?? null
  const report = data?.report ?? []
  const config = data?.config ?? null
  const missing = data?.missing ?? false
  const load = () => queryClient.invalidateQueries({ queryKey: ['admin-email-engine'] })

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

  const setPaused = async (paused: boolean) => {
    setBusy(true)
    const { error } = await supabase.rpc('set_email_engine_paused', { p_paused: paused })
    setMessage(error ? `Could not change: ${error.message}` : paused ? 'Paused. Anything queued was cancelled.' : 'Resumed. The next daily run will send.')
    await load()
    setBusy(false)
  }
  const sendTests = async () => {
    setBusy(true)
    setMessage('Sending one of each email to you…')
    const res = await api('POST', { action: 'test' })
    const failed = (res.data?.results ?? []).filter((r: { ok: boolean }) => !r.ok).length
    setMessage(res.ok ? `Sent ${res.data.results.length - failed} test emails to ${res.data.to}${failed ? ` (${failed} failed)` : ''}.` : res.data?.error ?? 'Could not send test emails.')
    setBusy(false)
  }

  const card = (label: string, value: string | number) => (
    <div className="rounded-2xl border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-bold">Emails</h1>
        </div>
        <Link to="/admin"><Button variant="outline" size="sm">Back</Button></Link>
      </div>

      {missing ? (
        <p className="rounded-2xl border bg-card p-4 text-sm">The email engine's database tables are not set up yet. Run the “Apply email engine migration (16)” workflow first.</p>
      ) : (
        <>
          <div className="rounded-2xl border bg-card p-4 text-sm">
            <p className="font-semibold">
              Mode: <span className="text-primary">{config?.mode ?? '…'}</span>
              {status?.paused && <span className="ml-2 rounded-full bg-danger/10 px-2 py-0.5 text-xs text-danger">Paused</span>}
            </p>
            <p className="mt-1 text-muted-foreground">{config ? MODE_HELP[config.mode] : 'Loading…'}</p>
            {config && (
              <ul className="mt-3 grid gap-1 sm:grid-cols-2">
                {(
                  [
                    ['resend', 'Resend key and sender'],
                    ['tokenSecret', 'Link signing secret'],
                    ['cron', 'Daily schedule secret'],
                    ['webhook', 'Bounce and complaint webhook'],
                  ] as const
                ).map(([k, label]) => (
                  <li key={k}>{config.configured[k] ? '✓' : '✗'} {label}</li>
                ))}
                <li>Daily limit: {config.dailyLimit}</li>
                {config.mode === 'pilot' && <li>Pilot addresses: {config.pilotRecipients}</li>}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {card('Subscribed', status?.subscribed ?? '…')}
            {card('Unsubscribed', status?.unsubscribed ?? '…')}
            {card('Not subscribed', status?.not_subscribed ?? '…')}
            {card('Sent today', status?.sent_today ?? '…')}
          </div>

          <div className="flex flex-wrap gap-3">
            {status?.paused ? (
              <Button disabled={busy} onClick={() => setPaused(false)}>Resume sending</Button>
            ) : (
              <Button variant="outline" disabled={busy} onClick={() => setPaused(true)}>Pause all sending</Button>
            )}
            <Button variant="outline" disabled={busy} onClick={sendTests}>Send me test emails</Button>
          </div>
          {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}

          <div className="space-y-2">
            <h2 className="font-bold">Last 30 days</h2>
            <p className="text-sm text-muted-foreground">“Studied” and “Paid” count students who did so within 7 days of an email.</p>
            <div className="overflow-x-auto rounded-2xl border bg-card">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    {['Email', 'Sent', 'Failed', 'Skipped', 'Clicked', 'Studied', 'Paid'].map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">No emails yet.</td></tr>
                  ) : (
                    report.map((r) => (
                      <tr key={r.programme} className="border-t">
                        <td className="px-4 py-3 font-semibold">{PROGRAMME_NAMES[r.programme] ?? r.programme}</td>
                        <td className="px-4 py-3">{r.sent}</td>
                        <td className="px-4 py-3">{r.failed}</td>
                        <td className="px-4 py-3">{r.skipped}</td>
                        <td className="px-4 py-3">{r.clicked_students}</td>
                        <td className="px-4 py-3">{r.studied_within_7d}</td>
                        <td className="px-4 py-3">{r.paid_within_7d}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
