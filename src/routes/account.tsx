import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Capacitor } from '@capacitor/core'
import {
  BookOpen,
  ChartLine,
  ChevronRight,
  ClipboardList,
  FileText,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquareWarning,
  Moon,
  Shield,
  Smartphone,
} from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useProfile, useStudentSubjects } from '@/lib/queries'
import { checkAccess } from '@/lib/access'
import { getTheme, toggleTheme, type Theme } from '@/lib/theme'
import { fetchLatestVersion, getInstalledVersion, isNewerVersion } from '@/lib/version'
import { initialsOf } from '@/lib/nav'
import { EmptyState, PageHeader, Pill, SectionCard, Skeleton } from '@/components/ds/Primitives'
import { Button } from '@/components/ui/button'
import type { Profile } from '@/lib/types'

export const Route = createFileRoute('/account')({
  head: privateHead('Account'),
  component: AccountPage,
})

const SUPPORT_EMAIL = 'secretsafe.cc@gmail.com'

function AccountPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { data: profile, isLoading } = useProfile(user?.id ?? null)

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl pt-6">
        <EmptyState
          title="Sign in to see your account"
          body="Your profile, plan and settings appear here once you're signed in."
          action={<Button asChild><Link to="/auth">Sign in</Link></Button>}
        />
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: '/' })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader title="Account" subtitle="Your profile, plan and settings." />
      {isLoading || !profile ? (
        <div className="space-y-5" aria-busy="true">
          <Skeleton className="h-28" />
          <Skeleton className="h-40" />
          <Skeleton className="h-48" />
        </div>
      ) : (
        <>
          <ProfileSection profile={profile} email={user.email ?? ''} />
          <LearningSection userId={user.id} />
          <SubscriptionSection profile={profile} userId={user.id} />
          <SecuritySection email={user.email ?? ''} />
          <PreferencesSection />
          <HelpSection />
          {profile.is_admin && (
            <SectionCard title="Admin tools" description="Only admins see this. Manage topics, lessons, question sets and payments.">
              <Rows>
                <Row to="/admin" icon={<Shield className="h-5 w-5" aria-hidden />} title="Open admin" />
              </Rows>
            </SectionCard>
          )}
        </>
      )}
      <button
        type="button"
        onClick={handleSignOut}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border bg-card font-semibold text-danger transition-colors hover:bg-danger/5"
      >
        <LogOut className="h-4 w-4" aria-hidden /> Sign out
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function ProfileSection({ profile, email }: { profile: Profile; email: string }) {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile.full_name ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const display = profile.full_name?.trim() || 'Student'

  const save = async (e: FormEvent) => {
    e.preventDefault()
    const next = name.trim()
    if (next.length < 2) {
      setError('Enter your name (at least 2 letters).')
      return
    }
    setSaving(true)
    setError(null)
    const { error: err } = await supabase.from('profiles').update({ full_name: next }).eq('id', profile.id)
    setSaving(false)
    if (err) {
      setError("We couldn't save your name. Check your connection and try again.")
      return
    }
    await qc.invalidateQueries({ queryKey: ['profile', profile.id] })
    setEditing(false)
  }

  return (
    <SectionCard
      title="Profile"
      action={
        !editing && (
          <Button variant="outline" size="sm" onClick={() => { setName(profile.full_name ?? ''); setEditing(true) }}>
            Edit
          </Button>
        )
      }
    >
      {editing ? (
        <form onSubmit={save} className="space-y-3">
          <label htmlFor="full-name" className="block text-sm font-medium">Full name</label>
          <input
            id="full-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            maxLength={80}
            className="h-11 w-full rounded-xl border border-input bg-card px-3 text-[15px] outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
            aria-describedby={error ? 'full-name-error' : undefined}
          />
          {error && <p id="full-name-error" className="text-sm text-danger">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            <Button type="button" variant="outline" onClick={() => { setEditing(false); setError(null) }}>Cancel</Button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-soft text-lg font-bold text-primary">
            {initialsOf(profile.full_name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold">{display}</p>
            <p className="truncate text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
      )}
    </SectionCard>
  )
}

function LearningSection({ userId }: { userId: string }) {
  const { data: subjects, isLoading } = useStudentSubjects(userId)
  return (
    <SectionCard title="My learning" description="The WASSCE subjects you're preparing for.">
      {isLoading ? (
        <Skeleton className="h-8" />
      ) : subjects && subjects.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Your subjects">
          {subjects.map((s) => (
            <li key={s.id}><Pill className="bg-muted text-foreground">{s.name}</Pill></li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">You haven't chosen any subjects yet.</p>
      )}
      <Rows className="mt-4">
        <Row to="/onboarding" icon={<BookOpen className="h-5 w-5" aria-hidden />} title="Change subjects" body="Your faculty and the subjects you're sitting" />
        <Row to="/progress" icon={<ChartLine className="h-5 w-5" aria-hidden />} title="Progress" body="Lessons completed and practice scores by subject" />
        <Row to="/practice" icon={<ClipboardList className="h-5 w-5" aria-hidden />} title="Practice history" body="Every practice set and paper you've taken" />
      </Rows>
    </SectionCard>
  )
}

/* ------------------------------------------------------------------ */

type PaymentRow = {
  id: string
  plan: string
  amount_nle: number
  reference_code: string
  status: 'pending' | 'activated' | 'cancelled'
  created_at: string
  activated_at: string | null
}

const PLAN_NAMES: Record<string, string> = { monthly: 'Monthly', quarterly: 'Quarterly', yearly: 'Yearly' }

const STATUS: Record<PaymentRow['status'], { label: string; tone: string }> = {
  pending: { label: 'Waiting for confirmation', tone: 'bg-warning/10 text-warning' },
  activated: { label: 'Activated', tone: 'bg-success/10 text-success' },
  cancelled: { label: 'Cancelled', tone: 'bg-muted text-muted-foreground' },
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function trialEnd(profile: Profile): string | null {
  if (!profile.trial_started_at) return null
  return new Date(new Date(profile.trial_started_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
}

function SubscriptionSection({ profile, userId }: { profile: Profile; userId: string }) {
  const access = checkAccess(profile)
  const payments = useQuery({
    queryKey: ['payment_requests', userId],
    queryFn: async (): Promise<PaymentRow[]> => {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('id, plan, amount_nle, reference_code, status, created_at, activated_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(12)
      if (error) throw error
      return (data ?? []) as PaymentRow[]
    },
  })

  const days = (n: number) => `${n} day${n === 1 ? '' : 's'}`
  const ends = trialEnd(profile)
  let status: { pill: string; tone: string; line: ReactNode }
  switch (access.reason) {
    case 'admin':
      status = { pill: 'Admin', tone: 'bg-brand-soft text-primary', line: 'Admin accounts have full access. No plan needed.' }
      break
    case 'subscribed':
      status = {
        pill: 'Active plan',
        tone: 'bg-success/10 text-success',
        line: (
          <>
            Full access until <strong className="font-semibold text-foreground">{formatDate(profile.subscription_expires_at!)}</strong> ({days(access.subscriptionDaysLeft)} left).
          </>
        ),
      }
      break
    case 'trial':
      status = {
        pill: 'Free trial',
        tone: 'bg-info/10 text-info',
        line: (
          <>
            {days(access.trialDaysLeft)} left{ends && <>, ending <strong className="font-semibold text-foreground">{formatDate(ends)}</strong></>}. After that you'll need a plan to keep opening lessons, practice and the AI tutor. Your progress is kept.
          </>
        ),
      }
      break
    default:
      status = {
        pill: 'No active plan',
        tone: 'bg-muted text-muted-foreground',
        line: 'Choose a plan to unlock lessons, practice and the AI tutor again. Your progress is saved.',
      }
  }

  return (
    <SectionCard
      title="Subscription"
      action={access.reason !== 'admin' && (
        <Button size="sm" variant={access.reason === 'subscribed' ? 'outline' : 'default'} asChild>
          <Link to="/subscribe">{access.reason === 'subscribed' ? 'Plans' : 'See plans'}</Link>
        </Button>
      )}
    >
      <div className="space-y-2">
        <Pill className={status.tone}>{status.pill}</Pill>
        <p className="text-sm text-muted-foreground">{status.line}</p>
      </div>
      <p className="mt-4 flex items-start gap-2 rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
        <Smartphone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <span>Pay with Orange Money or AfriMoney. Plans start at 25 NLe a month, and access usually switches on within minutes of your payment being confirmed.</span>
      </p>

      <h3 className="mt-5 text-sm font-semibold">Payment history</h3>
      {payments.isLoading ? (
        <Skeleton className="mt-2 h-14" />
      ) : payments.error ? (
        <p className="mt-2 text-sm text-muted-foreground">We couldn't load your payments. Check your connection and try again.</p>
      ) : payments.data && payments.data.length > 0 ? (
        <ul className="mt-2 divide-y rounded-xl border">
          {payments.data.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {PLAN_NAMES[p.plan] ?? p.plan} · {p.amount_nle} NLe
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(p.created_at)} · Ref <span className="font-mono">{p.reference_code}</span>
                </p>
              </div>
              <Pill className={STATUS[p.status]?.tone ?? 'bg-muted text-muted-foreground'}>{STATUS[p.status]?.label ?? p.status}</Pill>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">No payments yet.</p>
      )}
    </SectionCard>
  )
}

/* ------------------------------------------------------------------ */

function SecuritySection({ email }: { email: string }) {
  const [open, setOpen] = useState(false)
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (pw.length < 6) return setMsg({ ok: false, text: 'Use at least 6 characters.' })
    if (pw !== confirm) return setMsg({ ok: false, text: "The two passwords don't match." })
    setBusy(true)
    setMsg(null)
    const { error } = await supabase.auth.updateUser({ password: pw })
    setBusy(false)
    if (error) return setMsg({ ok: false, text: error.message || "We couldn't change your password. Try again." })
    setPw('')
    setConfirm('')
    setOpen(false)
    setMsg({ ok: true, text: 'Password changed. Use the new one next time you sign in.' })
  }

  const field = 'h-11 w-full rounded-xl border border-input bg-card px-3 text-[15px] outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30'

  return (
    <SectionCard title="Sign-in and security" description={<>You sign in with <span className="font-medium text-foreground">{email}</span>.</>}>
      {open ? (
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="new-password" className="block text-sm font-medium">New password</label>
            <input id="new-password" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} className={field} placeholder="At least 6 characters" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="confirm-password" className="block text-sm font-medium">Confirm new password</label>
            <input id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} />
          </div>
          {msg && !msg.ok && <p className="text-sm text-danger" role="alert">{msg.text}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Change password'}</Button>
            <Button type="button" variant="outline" onClick={() => { setOpen(false); setMsg(null) }}>Cancel</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {msg?.ok && <p className="text-sm text-success" role="status">{msg.text}</p>}
          <Button variant="outline" onClick={() => { setOpen(true); setMsg(null) }}>Change password</Button>
        </div>
      )}
    </SectionCard>
  )
}

function PreferencesSection() {
  const [theme, setTheme] = useState<Theme>(getTheme())
  // /account is client-rendered only (vercel.json sends it to the SPA shell), so this is safe at first render.
  const [native] = useState(() => typeof window !== 'undefined' && Capacitor.isNativePlatform())
  const on = theme === 'sepia'

  return (
    <SectionCard title="Preferences">
      <Rows>
        <li>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => setTheme(toggleTheme())}
            className="flex min-h-14 w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-muted/50"
          >
            <Moon className="h-5 w-5 text-muted-foreground" aria-hidden />
            <span className="flex-1">
              <span className="block font-semibold">Reading mode</span>
              <span className="block text-xs text-muted-foreground">Warmer colours for studying at night</span>
            </span>
            <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-input'}`} aria-hidden>
              <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all ${on ? 'left-5' : 'left-0.5'}`} />
            </span>
          </button>
        </li>
      </Rows>
      {native && <AppUpdates />}
    </SectionCard>
  )
}

function AppUpdates() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'current' | 'available' | 'failed'>('idle')
  const [latest, setLatest] = useState<{ version: string; apkUrl: string } | null>(null)

  const check = async () => {
    setStatus('checking')
    const manifest = await fetchLatestVersion()
    if (!manifest) return setStatus('failed')
    if (isNewerVersion(manifest.version, getInstalledVersion())) {
      setLatest({ version: manifest.version, apkUrl: manifest.apkUrl })
      setStatus('available')
    } else {
      setStatus('current')
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-semibold">App version {getInstalledVersion()}</p>
      {status === 'available' && latest ? (
        <div className="space-y-2 rounded-xl border border-primary/30 bg-brand-soft/50 p-3">
          <p className="text-sm font-semibold">Version {latest.version} is ready to install</p>
          <Button onClick={() => { window.location.href = latest.apkUrl }}>Install update</Button>
        </div>
      ) : (
        <>
          <Button variant="outline" onClick={check} disabled={status === 'checking'}>
            {status === 'checking' ? 'Checking…' : 'Check for updates'}
          </Button>
          {status === 'current' && <p className="text-sm text-muted-foreground" role="status">You have the latest version.</p>}
          {status === 'failed' && <p className="text-sm text-muted-foreground" role="status">We couldn't check right now. Try again later.</p>}
        </>
      )}
    </div>
  )
}

function HelpSection() {
  const report = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Problem report: WASSCE Tutor')}&body=${encodeURIComponent(
    'What happened:\n\nWhat I expected:\n\nPage or lesson:\n\nPhone or computer:\n',
  )}`
  return (
    <SectionCard title="Help and support" description="We read every message and usually reply within a day.">
      <Rows>
        <Row href={`mailto:${SUPPORT_EMAIL}`} icon={<Mail className="h-5 w-5" aria-hidden />} title="Email support" body={SUPPORT_EMAIL} />
        <Row href={report} icon={<MessageSquareWarning className="h-5 w-5" aria-hidden />} title="Report a problem" body="A wrong answer, a broken page or anything that looks off" />
        <Row to="/wassce" icon={<LifeBuoy className="h-5 w-5" aria-hidden />} title="WASSCE guide" body="Subjects, exam format and how to prepare" />
        <Row to="/terms" icon={<FileText className="h-5 w-5" aria-hidden />} title="Terms and privacy" body="How the service works and how we handle your data" />
      </Rows>
    </SectionCard>
  )
}

/* ------------------------------------------------------------------ */

function Rows({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <ul className={`divide-y overflow-hidden rounded-xl border ${className}`}>{children}</ul>
}

function Row({ to, href, icon, title, body }: { to?: string; href?: string; icon: ReactNode; title: string; body?: string }) {
  const inner = (
    <>
      <span className="text-muted-foreground">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{title}</span>
        {body && <span className="block text-xs text-muted-foreground">{body}</span>}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    </>
  )
  const cls = 'flex min-h-14 items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50'
  return (
    <li>
      {to ? <Link to={to} className={cls}>{inner}</Link> : <a href={href} className={cls}>{inner}</a>}
    </li>
  )
}
