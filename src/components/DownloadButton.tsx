// "Download Android App" button with the sideload install guide. Hidden inside
// the Android app and for signed-in users. Each download is counted (downloads table).
import { useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export function DownloadButton({ variant = 'default' }: { variant?: 'default' | 'outline' | 'hero' }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  if (Capacitor.isNativePlatform() || user) return null

  const trackAndDownload = () => {
    try {
      let clientId = localStorage.getItem('wt_client_id')
      if (!clientId) {
        clientId = crypto.randomUUID()
        localStorage.setItem('wt_client_id', clientId)
      }
      void supabase.from('downloads').insert({
        user_agent: navigator.userAgent.slice(0, 500),
        client_id: clientId,
      })
    } catch {}
    const a = document.createElement('a')
    a.href = 'https://cfclkwugbexrihloqofc.supabase.co/storage/v1/object/public/apk/wassce-tutor.apk'
    a.download = 'wassce-tutor.apk'
    a.click()
    setOpen(false)
  }

  const btnClass =
    variant === 'hero'
      ? 'inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/40 px-6 text-base font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto'
      : variant === 'outline'
        ? 'inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border bg-card px-6 text-base font-semibold transition-colors hover:border-primary/40 sm:w-auto'
        : 'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-brand-strong'

  return (
    <>
      <button onClick={() => setOpen(true)} className={btnClass}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
        </svg>
        Download Android App
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L2 8l10 4 10-4-10-4z M6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold leading-tight">Install WASSCE Tutor</h3>
                <p className="text-sm text-muted-foreground">Quick 3-step install. The warnings are normal &mdash; every Android app installed outside the Play Store shows them.</p>
              </div>
            </div>
            <ol className="space-y-3 mb-5">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
                <div className="text-sm">
                  <p className="font-semibold">Download starts.</p>
                  <p className="text-muted-foreground">If Chrome warns about file safety, tap <span className="font-semibold text-foreground">Download anyway</span> or <span className="font-semibold text-foreground">Keep</span>.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
                <div className="text-sm">
                  <p className="font-semibold">Open the downloaded file.</p>
                  <p className="text-muted-foreground">If your phone says <span className="font-semibold text-foreground">"unknown source"</span>, tap <span className="font-semibold text-foreground">Settings, Allow from this source, back</span>.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
                <div className="text-sm">
                  <p className="font-semibold">Tap Install.</p>
                  <p className="text-muted-foreground">If Play Protect asks, tap <span className="font-semibold text-foreground">Install anyway</span>. WASSCE Tutor is safe &mdash; it just isn&rsquo;t on the Play Store yet.</p>
                </div>
              </li>
            </ol>
            <div className="flex gap-2">
              <button onClick={() => setOpen(false)} className="flex-1 h-11 rounded-md border border-input bg-background hover:bg-accent text-sm font-medium transition">Cancel</button>
              <button onClick={trackAndDownload} className="flex-1 h-11 rounded-md bg-primary text-primary-foreground hover:opacity-90 text-sm font-medium transition">Got it, download</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
