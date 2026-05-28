import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      navigate({ to: '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">WASSCE Tutor</h1>
          <p className="text-sm text-muted-foreground">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <div className="space-y-3">
          {mode === 'signup' && (
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="text-primary underline"
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup')
              setError(null)
            }}
          >
            {mode === 'signup' ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}
