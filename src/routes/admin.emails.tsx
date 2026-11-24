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

type Mode = 'off' | 'dry-run' | 'pilot' | 'live'
type Status = {
  mode: Mode
  pilot_addresses: string[]
  daily_limit: number
  paused: boolean
  launched_at: string
  has_resend: boolean
  has_webhook: boolean
  subscribed: number
  unsubscribed: number
  not_subscribed: number
  suppressed: number
  sent_today: number
}
type ReportRow = { programme: string; queued: number; sent: number; failed: number; skipped: number; clicked_students: number; studied_within_7d: number; paid_within_7d: number }
type Config = { mode: Mode; modeFromEnv: boolean; dailyLimit: number; configured: Record<'resend' | 'tokenSecret' | 'cron' | 'webhook', boolean> }

const PROGRAMME_NAMES: Record<string, string> = {
  access_started: 'Access started (account)',
  access_ending: 'Access ending (account)',
  pending_payment: 'Unfinished payment',
  activation: 'First study session',
  weekly_digest: 'Weekly progress',
  reengage: 'Come back to studying',
}
const MODES: { id: Mode; label: string; help: string }[] = [
  { id: 'off', label: 'Off', help: 'Nothing is decided or sent.' },
  { id: 'dry-run', label: 'Dry run', help: 'Each daily run decides who is due and shows it in the run log, but sends nothing.' },
  { id: 'pilot', label: 'Pilot', help: 'Real emails, but only to the pilot addresses below.' },
  { id: 'live', label: 'Live', help: 'Real emails to every student who is due one.' },
]

async function api(method: 'GET' | 'POST', body?: unknown) {
  const { data } = await supabase.auth.getSession()
  const res = await fetch(`${API}/api/email/run?admin`, {
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
        <p className="rounded-2xl border bg-card p-4 text-sm">The email engine's database tables are not set up yet. In GitHub → Actions, run the “Set up email engine” workflow first.</p>
      ) : (
        <>
          {status && <Settings key={`${status.mode}|${status.daily_limit}|${status.pilot_addresses.join(',')}`} status={status} config={config} onSaved={load} />}

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

/** Mode, pilot addresses and daily limit, saved to Supabase (email_settings). */
function Settings({ status, config, onSaved }: { status: Status; config: Config | null; onSaved: () => Promise<void> }) {
  const [mode, setMode] = useState<Mode>(status.mode)
  const [pilot, setPilot] = useState(status.pilot_addresses.join(', '))
  const [limit, setLimit] = useState(String(status.daily_limit))
  const [note, setNote] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const addresses = pilot.split(/[\s,;]+/).map((a) => a.trim()).filter(Boolean)
  const blocked = mode !== 'off' && mode !== 'dry-run' && !status.has_resend

  const save = async () => {
    setSaving(true)
    const { error } = await supabase.rpc('set_email_engine_settings', {
      p_mode: mode,
      p_pilot_addresses: addresses,
      p_daily_limit: Number.parseInt(limit, 10) || 0,
    })
    setNote(error ? `Could not save: ${error.message}` : 'Saved. The next daily run uses these settings.')
    setSaving(false)
    if (!error) await onSaved()
  }

  return (
    <div className="space-y-4 rounded-2xl border bg-card p-5 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-base font-bold">Settings</h2>
        {status.paused && <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-semibold text-danger">Paused</span>}
      </div>
      {config?.modeFromEnv && (
        <p className="rounded-xl bg-amber-100 px-3 py-2 text-amber-900">EMAIL_MODE is set in Vercel and overrides this setting (currently “{config.mode}”).</p>
      )}
      <fieldset className="grid gap-2 sm:grid-cols-2">
        <legend className="mb-2 font-semibold">Mode</legend>
        {MODES.map((m) => (
          <label key={m.id} className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${mode === m.id ? 'border-primary bg-primary/5' : ''}`}>
            <input type="radio" name="mode" value={m.id} checked={mode === m.id} onChange={() => setMode(m.id)} className="mt-0.5 accent-[var(--primary)]" />
            <span>
              <span className="block font-semibold">{m.label}</span>
              <span className="block text-muted-foreground">{m.help}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <label className="block space-y-1.5">
        <span className="font-semibold">Pilot addresses</span>
        <textarea value={pilot} onChange={(e) => setPilot(e.target.value)} rows={2} placeholder="you@example.com, colleague@example.com" className="w-full rounded-xl border bg-background px-3 py-2" />
        <span className="block text-xs text-muted-foreground">Only used in Pilot mode. Separate with commas.</span>
      </label>
      <label className="block max-w-xs space-y-1.5">
        <span className="font-semibold">Most emails per day</span>
        <input type="number" min={0} max={5000} value={limit} onChange={(e) => setLimit(e.target.value)} className="h-10 w-full rounded-xl border bg-background px-3" />
        <span className="block text-xs text-muted-foreground">Resend’s free plan allows 100 a day.</span>
      </label>
      <ul className="grid gap-1 sm:grid-cols-2">
        <li>{status.has_resend ? '✓' : '✗'} Resend key and sender {status.has_resend ? '' : '(run the setup workflow)'}</li>
        <li>{status.has_webhook ? '✓' : '–'} Bounce and complaint webhook {status.has_webhook ? '' : '(optional, see the guide)'}</li>
      </ul>
      {blocked && <p className="text-danger">Pilot and Live need the Resend key and sender: run the “Set up email engine” workflow.</p>}
      {mode === 'pilot' && addresses.length === 0 && <p className="text-danger">Add at least one pilot address.</p>}
      <div className="flex items-center gap-3">
        <Button disabled={saving || blocked || (mode === 'pilot' && addresses.length === 0)} onClick={save}>{saving ? 'Saving…' : 'Save settings'}</Button>
        {note && <p role="status" className="text-muted-foreground">{note}</p>}
      </div>
    </div>
  )
}
