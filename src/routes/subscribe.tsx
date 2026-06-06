import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/subscribe')({
  component: SubscribePage,
})

const WHATSAPP_NUMBER = '23277884195'

type Plan = {
  id: 'monthly' | 'quarterly' | 'yearly'
  name: string
  amount: number
  period: string
  perMonth?: string
  badge?: string
  savings?: string
}

const PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    amount: 25,
    period: '/month',
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    amount: 60,
    period: '/3 months',
    perMonth: '20 NLe/mo',
    savings: 'Save 15 NLe',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    amount: 220,
    period: '/year',
    perMonth: '18.33 NLe/mo',
    badge: 'Best value',
    savings: 'Save 80 NLe',
  },
]

function generateReference(): string {
  // WT-XXXXX (5 random base32 chars — easy to type, hard to confuse)
  const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ' // omit I, L, O, U for clarity
  let code = 'WT-'
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

function SubscribePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id ?? null)
  const [selected, setSelected] = useState<Plan['id']>('yearly')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) {
    return (
      <div className="mx-auto max-w-md space-y-4 pt-8 text-center">
        <p className="text-muted-foreground">Sign in to subscribe.</p>
        <Link to="/auth"><Button>Sign in</Button></Link>
      </div>
    )
  }

  // Already subscribed?
  if (profile?.subscription_active && profile?.subscription_expires_at) {
    const expiresOn = new Date(profile.subscription_expires_at).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
    return (
      <div className="mx-auto max-w-md space-y-4 pt-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="h-7 w-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">You're subscribed!</h1>
        <p className="text-muted-foreground">Access expires {expiresOn}.</p>
        <Link to="/"><Button variant="outline">Back to dashboard</Button></Link>
      </div>
    )
  }

  const plan = PLANS.find((p) => p.id === selected)!

  const proceedToWhatsApp = async () => {
    setSubmitting(true)
    setError(null)

    const reference = generateReference()

    try {
      // 1. Save the payment request in DB so admin sees it
      const { error: insertErr } = await supabase.from('payment_requests').insert({
        user_id: user.id,
        plan: plan.id,
        amount_nle: plan.amount,
        reference_code: reference,
      })
      if (insertErr) throw insertErr

      // 2. Build pre-filled WhatsApp message
      const lines = [
        `Hi! I'd like to subscribe to WASSCE Tutor.`,
        ``,
        `Plan: ${plan.name} (${plan.amount} NLe)`,
        `Email: ${user.email}`,
        `Reference: ${reference}`,
        ``,
        `Please send Orange Money / AfriMoney details.`,
      ].join('\n')
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`

      // 3. Navigate to confirmation page (which the user returns to after WhatsApp)
      window.location.href = url
      // Note: most browsers will navigate immediately. We don't await navigation,
      // we redirect the dashboard view to the pending status next time they open the app.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start checkout')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pb-8">
      <header className="text-center space-y-1">
        <h1 className="text-3xl font-black tracking-tight">Choose your plan</h1>
        <p className="text-sm text-muted-foreground">All plans unlock every subject, paper, and your AI tutor.</p>
      </header>

      <div className="space-y-3">
        {PLANS.map((p) => {
          const active = selected === p.id
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`w-full text-left rounded-2xl border-2 bg-card p-5 transition ${
                active ? 'border-primary shadow-lg shadow-primary/10' : 'border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold">{p.name}</p>
                    {p.badge && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  {p.perMonth && (
                    <p className="text-xs text-muted-foreground">{p.perMonth}</p>
                  )}
                  {p.savings && (
                    <p className="text-xs font-semibold text-emerald-600 mt-1">{p.savings}</p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-black leading-none">{p.amount}</p>
                  <p className="text-xs text-muted-foreground">{p.period}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl border bg-card p-4 space-y-2 text-sm">
        <p className="font-semibold">How it works:</p>
        <ol className="space-y-1.5 text-muted-foreground">
          <li>1. Tap <span className="font-semibold text-foreground">Pay on WhatsApp</span> below</li>
          <li>2. WhatsApp opens with your details pre-filled — just tap send</li>
          <li>3. We'll reply with Orange Money / AfriMoney details</li>
          <li>4. Send payment → we activate your account, usually within an hour</li>
        </ol>
      </div>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}

      <Button
        onClick={proceedToWhatsApp}
        disabled={submitting}
        className="h-12 w-full text-base inline-flex items-center justify-center gap-2"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.5.2-.7.2-1.4.2-1.5-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.7.5 3.4 1.3 4.9L2 22l5.2-1.3c1.5.8 3.1 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
        </svg>
        {submitting ? 'Opening WhatsApp…' : `Pay ${plan.amount} NLe on WhatsApp`}
      </Button>

      <button
        onClick={() => navigate({ to: '/' })}
        className="block w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        Maybe later
      </button>
    </div>
  )
}
