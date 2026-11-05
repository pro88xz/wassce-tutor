import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { privateHead } from '@/lib/seo'
import { useAuth } from '@/lib/auth'
import { useProfile, useStudentSubjects } from '@/lib/queries'
import { useProgress } from '@/lib/progress'
import { checkAccess } from '@/lib/access'
import { BookOpen, ChartLine, ChevronRight, LogOut, Moon, Shield, Wallet } from 'lucide-react'
import { Card, PageHeader, Pill } from '@/components/ds/Primitives'
import { Button } from '@/components/ui/button'
import { getTheme, toggleTheme, type Theme } from '@/lib/theme'
import { fetchLatestVersion, getInstalledVersion, isNewerVersion } from '@/lib/version'
import { useState } from 'react'

export const Route = createFileRoute('/profile')({
  head: privateHead('Profile'),
  component: ProfilePage,
})

function ProfilePage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const handleSignOut = async () => {
    await signOut()
    navigate({ to: '/' })
  }
  const { data: profile } = useProfile(user?.id ?? null)
  const { data: subjects } = useStudentSubjects(user?.id ?? null)
  const { summary } = useProgress(user?.id ?? null, subjects)
  const [theme, setTheme] = useState<Theme>(getTheme())
  const access = checkAccess(profile)

  const handleToggle = () => {
    const next = toggleTheme()
    setTheme(next)
  }

  const name = profile?.full_name?.trim() || 'Student'
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const plan =
    access.reason === 'admin'
      ? { label: 'Admin access', tone: 'bg-primary/10 text-primary' }
      : access.reason === 'subscribed'
        ? { label: `Subscribed · ${access.subscriptionDaysLeft} day${access.subscriptionDaysLeft === 1 ? '' : 's'} left`, tone: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' }
        : access.hasAccess
          ? { label: `Free trial · ${access.trialDaysLeft} day${access.trialDaysLeft === 1 ? '' : 's'} left`, tone: 'bg-amber-500/10 text-amber-700 dark:text-amber-400' }
          : { label: 'No active plan', tone: 'bg-red-500/10 text-red-700 dark:text-red-400' }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-12">
      <PageHeader eyebrow="Account" title="Profile" />

      <Card className="overflow-hidden">
        <div className="flex items-center gap-4 bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent p-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-xl font-black text-white shadow-md">
            {initials}
          </span>
          <div className="min-w-0 space-y-1">
            <p className="truncate text-xl font-black tracking-tight">{name}</p>
            <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
            {profile && <Pill className={plan.tone}>{plan.label}</Pill>}
          </div>
        </div>
        {summary && (
          <Link to="/progress" className="flex items-center gap-4 border-t px-5 py-4 transition hover:bg-muted/40">
            <ChartLine className="h-5 w-5 text-primary" aria-hidden />
            <span className="flex-1 text-sm">
              <span className="font-semibold">{summary.done} of {summary.total} lessons done</span>
              <span className="text-muted-foreground"> · {summary.streak}-day streak</span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
          </Link>
        )}
      </Card>

      <Card className="divide-y">
        <div className="flex items-center gap-4 px-5 py-4">
          <Moon className="h-5 w-5 text-muted-foreground" aria-hidden />
          <div className="flex-1">
            <p className="font-semibold">Reading mode</p>
            <p className="text-xs text-muted-foreground">Warmer colours for night study</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={theme === 'sepia'}
            aria-label="Reading mode"
            onClick={handleToggle}
            className={`relative h-7 w-12 rounded-full transition ${theme === 'sepia' ? 'bg-primary' : 'bg-muted'}`}
          >
            <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${theme === 'sepia' ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>
        <SettingsLink to="/onboarding" icon={<BookOpen className="h-5 w-5" aria-hidden />} title="Change subjects" body="Your faculty and the subjects you're sitting" />
        <SettingsLink to="/subscribe" icon={<Wallet className="h-5 w-5" aria-hidden />} title="Plans and payment" body="From 25 NLe / month · Orange Money or AfriMoney" />
        {profile?.is_admin && (
          <SettingsLink to="/admin" icon={<Shield className="h-5 w-5" aria-hidden />} title="Admin panel" body="Topics, lessons, review, papers, payments" />
        )}
      </Card>

      <CheckForUpdatesButton />

      <button
        type="button"
        onClick={handleSignOut}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border bg-card font-semibold text-red-600 transition hover:bg-red-500/5"
      >
        <LogOut className="h-4 w-4" aria-hidden /> Sign out
      </button>
    </div>
  )
}

function SettingsLink({ to, icon, title, body }: { to: '/onboarding' | '/subscribe' | '/admin'; icon: React.ReactNode; title: string; body: string }) {
  return (
    <Link to={to} className="flex items-center gap-4 px-5 py-4 transition hover:bg-muted/40">
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block text-xs text-muted-foreground">{body}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
    </Link>
  )
}

function CheckForUpdatesButton() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'up-to-date' | 'available'>('idle')
  const [latestVersion, setLatestVersion] = useState<string | null>(null)
  const [apkUrl, setApkUrl] = useState<string | null>(null)

  const check = async () => {
    setStatus('checking')
    const manifest = await fetchLatestVersion()
    if (!manifest) {
      setStatus('idle')
      alert('Could not check for updates. Try again later.')
      return
    }
    const installed = getInstalledVersion()
    if (isNewerVersion(manifest.version, installed)) {
      setLatestVersion(manifest.version)
      setApkUrl(manifest.apkUrl)
      setStatus('available')
    } else {
      setStatus('up-to-date')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const install = () => {
    if (apkUrl) window.location.href = apkUrl
  }

  if (status === 'available' && latestVersion && apkUrl) {
    return (
      <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 space-y-2">
        <p className="font-bold text-sm">Version {latestVersion} is available</p>
        <p className="text-xs text-muted-foreground">Tap install to update.</p>
        <Button onClick={install} className="w-full">Install update</Button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={check}
      disabled={status === 'checking'}
      className="flex h-12 w-full items-center justify-center rounded-2xl border bg-card text-sm font-semibold transition hover:bg-muted/40 disabled:opacity-60"
    >
      {status === 'checking' ? 'Checking…' : status === 'up-to-date' ? "You're up to date" : 'Check for app updates'}
    </button>
  )
}
