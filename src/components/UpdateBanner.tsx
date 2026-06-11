import { useEffect, useState } from 'react'
import { fetchLatestVersion, getInstalledVersion, isNewerVersion, type VersionManifest } from '@/lib/version'

const DISMISS_KEY = 'update_banner_dismissed_for'

export function UpdateBanner() {
  const [latest, setLatest] = useState<VersionManifest | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchLatestVersion().then((manifest) => {
      if (cancelled || !manifest) return
      const installed = getInstalledVersion()
      if (!isNewerVersion(manifest.version, installed)) return
      // Check if this version was dismissed
      const dismissedFor = sessionStorage.getItem(DISMISS_KEY)
      if (dismissedFor === manifest.version) {
        setDismissed(true)
      }
      setLatest(manifest)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!latest || dismissed) return null

  const handleInstall = () => {
    window.location.href = latest.apkUrl
  }

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, latest.version)
    setDismissed(true)
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border-2 border-primary/30 bg-primary/5 px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">New update available</p>
        <p className="text-xs text-muted-foreground">Version {latest.version} — tap install to update.</p>
      </div>
      <button
        onClick={handleInstall}
        className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition"
      >
        Install
      </button>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
        </svg>
      </button>
    </div>
  )
}
