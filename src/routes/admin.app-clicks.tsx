// Admin -> App clicks: clicks on the tracking link to BeamPad on Google Play
// (/go/beampad, api/_lib/go.js, table app_link_clicks from migration 41).
//
// Every "Get it on Google Play" button on /beampad and its guides goes through
// the tracking link, and the link can be shared anywhere with a source tag
// (?s=tiktok). This page counts the clicks: by day, by button, by page, by
// source, by country and by device, live. Installs are counted by Google Play:
// the same tags reach Play Console's acquisition report, so clicks here and
// installs there can be compared.
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Check, Copy, Link2 } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { isUnlockedThisSession } from '@/lib/adminGate'
import { useNow } from '@/lib/use-now'
import { TRACKING_LINK } from '@/content/beampad'

export const Route = createFileRoute('/admin/app-clicks')({
  component: AdminAppClicks,
})

type ClickRow = {
  id: number
  created_at: string
  app: string
  placement: string | null
  page: string | null
  source: string | null
  referrer_host: string | null
  country: string | null
  device: string | null
  visitor: string | null
}

const DAY = 24 * 60 * 60 * 1000
const RANGES = [
  { key: '7d', label: '7 days', days: 7 },
  { key: '30d', label: '30 days', days: 30 },
  { key: '90d', label: '90 days', days: 90 },
] as const
type RangeKey = (typeof RANGES)[number]['key']

/** Names for the buttons on BeamPad's pages (placement tags in src/routes/beampad.*). */
const PLACEMENTS: Record<string, string> = {
  hero: 'Landing: top button',
  header: 'Header: Get the app',
  final: 'Landing: last button',
  footer: 'Footer link',
  guide_fix5: 'Firestick guide: inside fix 5',
  guide_app: 'Guide: app card',
  guide_final: 'Guide: last button',
  guide_text: 'Guide: “BeamPad” in the text',
  guide_step: 'Guide: “Install BeamPad” step',
  how_install: 'Landing: “Google Play” in How it works',
}
const PAGES: Record<string, string> = {
  beampad: '/beampad',
  beampad_es: '/beampad/es (Spanish)',
  lost_firestick_remote: 'Guide: lost Firestick remote',
  lost_google_tv_remote: 'Guide: lost Google TV remote',
  type_on_google_tv: 'Guide: type on Google TV from your phone',
  phone_gamepad: 'Guide: phone as a gamepad',
}
const QUICK_SOURCES = ['tiktok', 'whatsapp', 'facebook', 'instagram', 'youtube', 'x']
const SELECT = 'id,created_at,app,placement,page,source,referrer_host,country,device,visitor'
const MAX_ROWS = 10000

function relativeTime(iso: string, now: number): string {
  const mins = Math.floor((now - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

/** Counts by a key, largest first. */
function countBy(rows: ClickRow[], key: (r: ClickRow) => string): [string, number][] {
  const m = new Map<string, number>()
  for (const r of rows) m.set(key(r), (m.get(key(r)) ?? 0) + 1)
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

const whereFrom = (r: ClickRow) => (r.source ? `Shared link: ${r.source}` : r.page ? 'BeamPad pages' : r.referrer_host ? `Link on ${r.referrer_host}` : 'Direct (no tag)')

function AdminAppClicks() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const [range, setRange] = useState<RangeKey>('30d')
  const [rows, setRows] = useState<ClickRow[]>([])
  // The period the rows were loaded for: loading while it differs from the one chosen.
  const [loadedDays, setLoadedDays] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)
  const now = useNow(60_000)
  const days = RANGES.find((r) => r.key === range)?.days ?? 30
  const loading = loadedDays !== days

  useEffect(() => {
    if (!user || !profile?.is_admin) return
    let cancelled = false
    const since = new Date(Date.now() - days * DAY).toISOString()
    supabase
      .from('app_link_clicks')
      .select(SELECT)
      .eq('app', 'beampad')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(MAX_ROWS)
      .then(({ data, error }) => {
        if (cancelled) return
        setFailed(!!error)
        setRows((data as ClickRow[] | null) ?? [])
        setLoadedDays(days)
      })

    // New clicks appear as they happen.
    const channel = supabase
      .channel('app-clicks-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'app_link_clicks' }, (payload) => {
        const row = payload.new as ClickRow
        if (row.app === 'beampad') setRows((prev) => [row, ...prev].slice(0, MAX_ROWS))
      })
      .subscribe()
    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [user, profile?.is_admin, days])

  const stats = useMemo(() => {
    const today = new Date(now).toISOString().slice(0, 10)
    const todayRows = rows.filter((r) => r.created_at.slice(0, 10) === today)
    const android = rows.filter((r) => r.device === 'android').length
    // The visitor code changes every day, so distinct codes = visitor-days.
    const unique = new Set(rows.map((r) => r.visitor ?? `row-${r.id}`)).size
    const perDay: { day: string; count: number }[] = []
    for (let i = Math.min(days, 30) - 1; i >= 0; i--) {
      const day = new Date(now - i * DAY).toISOString().slice(0, 10)
      perDay.push({ day, count: 0 })
    }
    const index = new Map(perDay.map((d, i) => [d.day, i]))
    for (const r of rows) {
      const i = index.get(r.created_at.slice(0, 10))
      if (i !== undefined) perDay[i].count += 1
    }
    return { today: todayRows.length, android, unique, perDay }
  }, [rows, now, days])

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

  const peak = Math.max(1, ...stats.perDay.map((d) => d.count))
  const androidShare = rows.length ? Math.round((100 * stats.android) / rows.length) : 0

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-bold">App clicks: BeamPad</h1>
          <p className="mt-1 text-sm text-muted-foreground">Clicks through the tracking link to Google Play. Updates live.</p>
        </div>
        <Link to="/admin"><Button variant="outline" size="sm">Back</Button></Link>
      </div>

      <LinkBuilder />

      <div className="flex flex-wrap gap-2" role="group" aria-label="Period">
        {RANGES.map((r) => (
          <Button key={r.key} size="sm" variant={range === r.key ? 'default' : 'outline'} onClick={() => setRange(r.key)} aria-pressed={range === r.key}>
            Last {r.label}
          </Button>
        ))}
      </div>

      {failed && (
        <p className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
          Couldn’t read the clicks. If this is new, run the “Apply database migrations” workflow on main (migration 41 adds the table).
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={`Clicks, ${RANGES.find((r) => r.key === range)?.label}`} value={loading ? '…' : rows.length} />
        <Stat label="Unique visitors" value={loading ? '…' : stats.unique} hint="Per day: one person clicking twice in a day counts once" />
        <Stat label="Today (UTC)" value={loading ? '…' : stats.today} />
        <Stat label="On Android" value={loading ? '…' : `${androidShare}%`} hint="Only Android phones can install BeamPad" />
      </div>

      <section className="space-y-3 rounded-2xl border bg-card p-5">
        <h2 className="font-bold">Clicks per day</h2>
        <div className="flex h-40 items-end gap-1" role="img" aria-label={`Clicks per day for the last ${stats.perDay.length} days`}>
          {stats.perDay.map((d) => (
            <div key={d.day} className="group relative flex h-full flex-1 flex-col justify-end" title={`${d.day}: ${d.count}`}>
              <div className="min-h-[2px] rounded-t bg-primary/80 transition-colors group-hover:bg-primary" style={{ height: `${(100 * d.count) / peak}%` }} />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{stats.perDay[0]?.day}</span>
          <span>{stats.perDay[stats.perDay.length - 1]?.day}</span>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Breakdown title="Where the clicks came from" rows={countBy(rows, whereFrom)} total={rows.length} />
        <Breakdown title="Which button" rows={countBy(rows, (r) => (r.placement ? (PLACEMENTS[r.placement] ?? r.placement) : 'Shared link (no button)'))} total={rows.length} />
        <Breakdown title="Which page" rows={countBy(rows, (r) => (r.page ? (PAGES[r.page] ?? r.page) : 'Not from our pages'))} total={rows.length} />
        <Breakdown title="Country" rows={countBy(rows, (r) => r.country ?? 'Unknown')} total={rows.length} />
        <Breakdown title="Device" rows={countBy(rows, (r) => r.device ?? 'other')} total={rows.length} />
        <section className="space-y-2 rounded-2xl border bg-card p-5 text-sm">
          <h2 className="font-bold">Clicks → installs</h2>
          <p className="text-muted-foreground">
            A click is someone reaching the Play listing. Google Play counts the installs: in Play Console, the store listing acquisition report can
            show installs by UTM source and campaign. The tags are the same as here (source = the shared link’s tag or wasscetutor.com, campaign =
            the page, content = the button), so installs ÷ clicks is the conversion rate for each.
          </p>
        </section>
      </div>

      <section className="space-y-3">
        <h2 className="font-bold">Latest clicks</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No clicks yet in this period. Share the tracking link above.</p>
        ) : (
          <ul className="space-y-2">
            {rows.slice(0, 40).map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 text-sm">
                <span className="min-w-0">
                  <span className="block font-semibold">{whereFrom(r)}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {[r.placement && (PLACEMENTS[r.placement] ?? r.placement), r.country, r.device].filter(Boolean).join(' · ')}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{relativeTime(r.created_at, now)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4 text-center" title={hint}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  )
}

function Breakdown({ title, rows, total }: { title: string; rows: [string, number][]; total: number }) {
  return (
    <section className="space-y-3 rounded-2xl border bg-card p-5">
      <h2 className="font-bold">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing yet.</p>
      ) : (
        <ul className="space-y-2">
          {rows.slice(0, 8).map(([name, count]) => (
            <li key={name} className="space-y-1 text-sm">
              <span className="flex justify-between gap-3">
                <span className="truncate">{name}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {count} · {Math.round((100 * count) / Math.max(1, total))}%
                </span>
              </span>
              <span className="block h-1.5 overflow-hidden rounded-full bg-muted">
                <span className="block h-full rounded-full bg-primary/70" style={{ width: `${(100 * count) / Math.max(1, total)}%` }} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/** The tracking link, plain or tagged with where it will be shared, ready to copy. */
function LinkBuilder() {
  const [source, setSource] = useState('')
  const [copied, setCopied] = useState(false)
  const clean = source.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40)
  const link = clean ? `${TRACKING_LINK}?s=${clean}` : TRACKING_LINK
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }
  return (
    <section className="space-y-4 rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-2">
        <Link2 className="h-5 w-5 text-primary" aria-hidden />
        <h2 className="font-bold">Your tracking link</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Share this anywhere instead of the Play Store link. Each click is counted here, then the visitor goes straight to BeamPad on Google Play.
        Add where you’re posting it to see which place brings the clicks.
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_SOURCES.map((s) => (
          <Button key={s} size="sm" variant={clean === s ? 'default' : 'outline'} onClick={() => setSource(clean === s ? '' : s)}>
            {s}
          </Button>
        ))}
      </div>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">Or type your own source (letters, numbers, - and _)</span>
        <input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="e.g. tiktok-video-3"
          className="h-10 w-full rounded-xl border bg-background px-3"
        />
      </label>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <code className="min-w-0 flex-1 truncate rounded-xl bg-muted px-3 py-2.5 text-sm">{link}</code>
        <Button onClick={copy} className="shrink-0">
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? 'Copied' : 'Copy link'}
        </Button>
      </div>
    </section>
  )
}
