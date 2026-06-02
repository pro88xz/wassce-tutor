import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { getTheme, toggleTheme, type Theme } from '@/lib/theme'
import { useState } from 'react'

export const Route = createFileRoute('/profile')({
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
  const [theme, setTheme] = useState<Theme>(getTheme())

  const handleToggle = () => {
    const next = toggleTheme()
    setTheme(next)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      {profile && (
        <div className="rounded-2xl border bg-card p-5 space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Account</p>
          <p className="font-semibold">{profile.full_name || 'No name set'}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          {profile.is_admin && (
            <p className="mt-2 inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Admin
            </p>
          )}
        </div>
      )}

      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Reading mode</p>
            <p className="text-xs text-muted-foreground">Warmer colors for night study</p>
          </div>
          <button
            onClick={handleToggle}
            className={`relative h-7 w-12 rounded-full transition ${theme === 'sepia' ? 'bg-primary' : 'bg-muted'}`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${theme === 'sepia' ? 'left-5' : 'left-0.5'}`}
            />
          </button>
        </div>
      </div>

      {profile?.is_admin && (
        <Link to="/admin" className="block rounded-2xl border bg-card p-5 transition hover:border-primary">
          <p className="font-semibold">Admin panel</p>
          <p className="text-xs text-muted-foreground">Manage topics, lessons, papers, questions</p>
        </Link>
      )}

      <Button variant="outline" className="w-full" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  )
}
