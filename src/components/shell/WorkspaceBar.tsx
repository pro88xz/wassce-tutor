// The top bar of the tutor and affiliate workspaces. They have no student
// navigation, so this bar carries what they need: where you are, who is
// signed in, and Sign out.
//
// "Back" from a workspace does not drop the person into the student app (or
// its first-time set-up): it asks whether to sign out, or stay. People who
// also study can go to their student home from there.
import { useState } from 'react'
import { useBlocker, useNavigate, useRouterState } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { initialsOf } from '@/lib/nav'
import { BrandMark } from '@/components/BrandMark'

const WORKSPACES: Record<string, string> = {
  '/tutor-dashboard': 'Tutor workspace',
  '/affiliate-dashboard': 'Affiliate workspace',
}

export function WorkspaceBar() {
  const { user, signOut } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { data: profile } = useProfile(user?.id ?? null)
  const navigate = useNavigate()
  const [leaving, setLeaving] = useState(false)
  const workspace = WORKSPACES[pathname]
  const active = !!user && !!workspace

  const blocker = useBlocker({
    shouldBlockFn: ({ action }) => action === 'BACK' || action === 'GO',
    withResolver: true,
    enableBeforeUnload: false,
    disabled: !active || leaving,
  })

  if (!active) return null

  const leave = async () => {
    setLeaving(true)
    blocker.reset?.()
    await signOut()
    // Replace: "back" must not return to a workspace with nobody signed in.
    await navigate({ to: '/', replace: true })
    setLeaving(false)
  }
  const studentHome = () => {
    blocker.reset?.()
    void navigate({ to: '/' })
  }
  const name = profile?.full_name?.trim() || user?.email || 'Your account'

  return (
    <>
      <header className="sticky top-0 z-30 -mx-4 -mt-4 mb-5 border-b bg-background/90 backdrop-blur-md sm:-mx-6 sm:-mt-6">
        <div className="mx-auto flex min-h-14 max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
          <BrandMark compact />
          <span className="hidden rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary sm:inline">{workspace}</span>
          <div className="ml-auto flex min-w-0 items-center gap-2">
            <span className="flex min-w-0 items-center gap-2 text-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-primary" aria-hidden>{initialsOf(profile?.full_name)}</span>
              <span className="hidden min-w-0 truncate font-semibold md:inline">{name}</span>
            </span>
            <button
              type="button"
              disabled={leaving}
              onClick={() => void leave()}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border bg-card px-3 text-sm font-semibold hover:border-primary/40 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" aria-hidden /> {leaving ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      </header>

      {blocker.status === 'blocked' && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation">
          <section role="alertdialog" aria-modal="true" aria-labelledby="leave-title" aria-describedby="leave-body" className="w-full max-w-sm rounded-t-3xl bg-white p-6 text-slate-900 shadow-2xl sm:rounded-3xl">
            <h2 id="leave-title" className="text-lg font-bold">Leave your {workspace.toLowerCase()}?</h2>
            <p id="leave-body" className="mt-1.5 text-sm text-slate-600">
              You are signed in as {name}. Sign out to leave, or stay to keep working.
            </p>
            <div className="mt-5 space-y-2">
              <button type="button" disabled={leaving} onClick={() => void leave()} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 font-bold text-white disabled:opacity-60">
                <LogOut className="h-4 w-4" aria-hidden /> {leaving ? 'Signing out…' : 'Sign out'}
              </button>
              <button type="button" onClick={() => blocker.reset?.()} className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border px-4 text-sm font-semibold">
                Stay here
              </button>
              {profile?.onboarded && (
                <button type="button" onClick={studentHome} className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                  Open my student home
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  )
}
