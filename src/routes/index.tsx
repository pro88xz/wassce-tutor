import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { user, loading, signOut } = useAuth()

  if (loading) return <p className="text-muted-foreground">Loading...</p>

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">WASSCE Tutor</h1>
      {user ? (
        <div className="space-y-3">
          <p className="text-muted-foreground">Signed in as {user.email}</p>
          <Button variant="outline" onClick={signOut}>Sign Out</Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-muted-foreground">You are not signed in.</p>
          <Link to="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
