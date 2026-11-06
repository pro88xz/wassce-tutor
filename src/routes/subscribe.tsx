import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, CircleCheck, Clock, Loader2, Lock, ShieldCheck, Sparkles, XCircle } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useAccess } from '@/lib/useAccess'
import { CONTACT, whatsappChatLink } from '@/lib/contact'
import { FREE_FEATURES, PAID_FEATURES, PLANS, planById, type PlanId } from '@/lib/plans'
import { confirmPayment, forgetCheckout, pendingCheckout, rememberCheckout, startCheckout, type PaymentStatus } from '@/lib/payments'
import { WhatsAppGlyph } from '@/components/WhatsAppGlyph'

type Search = { plan?: PlanId; payment?: string; cancelled?: boolean }

export const Route = createFileRoute('/subscribe')({
  head: privateHead('Choose a plan'),
  // Monime sends students back here with ?payment=<id> (and &cancelled=1).
  validateSearch: (s: Record<string, unknown>): Search => ({
    plan: s.plan === 'term' || s.plan === 'year' ? s.plan : undefined,
    payment: typeof s.payment === 'string' && /^[0-9a-f-]{36}$/i.test(s.payment) ? s.payment : undefined,
    cancelled: s.cancelled === '1' || s.cancelled === 1 || s.cancelled === true ? true : undefined,
  }),
  component: SubscribePage,
})

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

function SubscribePage() {
  const { user, loading: authLoading } = useAuth()
  const search = Route.useSearch()

  if (authLoading) return <div className="mx-auto h-64 max-w-md animate-pulse rounded-3xl bg-muted" aria-busy="true" />
  if (!user) return <SignedOut returning={!!search.payment && !search.cancelled} />
  return <Plans userId={user.id} email={user.email ?? ''} search={search} />
}

/** Signed out: on the website after paying in the Android app's browser, or a visitor. */
function SignedOut({ returning }: { returning: boolean }) {
  if (returning) {
    return (
      <div className="mx-auto max-w-md space-y-4 pt-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success"><CircleCheck className="h-7 w-7" aria-hidden /></span>
        <h1 className="text-2xl font-bold tracking-tight">Thank you</h1>
        <p className="text-muted-foreground">
          Go back to the WASSCE Tutor app. Your plan switches on there as soon as the payment is confirmed, usually within a minute.
        </p>
        <Link to="/auth" className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Or sign in here</Link>
      </div>
    )
  }
  return (
    <div className="mx-auto max-w-md space-y-6 pt-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Plans</h1>
        <p className="text-muted-foreground">Create a free account first. You can unlock everything whenever you are ready.</p>
      </header>
      <PlanCards selected="year" onSelect={() => {}} interactive={false} />
      <Link to="/auth" className="flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-2 text-base font-semibold text-primary-foreground hover:bg-brand-strong">
        Create a free account
      </Link>
    </div>
  )
}

type View =
  | { kind: 'choose' }
  | { kind: 'confirming'; paymentId: string; plan?: PlanId; status: PaymentStatus; slow: boolean }
  | { kind: 'done'; plan?: PlanId }
  | { kind: 'cancelled' }
  | { kind: 'whatsapp'; plan: PlanId; reference: string }

function Plans({ userId, email, search }: { userId: string; email: string; search: Search }) {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { access, profile } = useAccess()
  const [selected, setSelected] = useState<PlanId>(search.plan ?? 'year')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<View>(() => {
    if (search.cancelled) return { kind: 'cancelled' }
    const pending = pendingCheckout(userId)
    const paymentId = search.payment ?? pending?.paymentId
    return paymentId ? { kind: 'confirming', paymentId, plan: pending?.plan, status: 'pending', slow: false } : { kind: 'choose' }
  })

  useEffect(() => {
    if (search.cancelled) forgetCheckout(userId)
  }, [search.cancelled, userId])

  // While confirming: ask our server every few seconds, then less often, and
  // again whenever the student comes back to the tab or app.
  const checking = useRef(false)
  const check = useCallback(async () => {
    if (view.kind !== 'confirming' || checking.current) return
    checking.current = true
    const status = await confirmPayment(view.paymentId)
    checking.current = false
    if (status === 'completed') {
      forgetCheckout(userId)
      await qc.invalidateQueries({ queryKey: ['profile'] })
      setView({ kind: 'done', plan: view.plan })
    } else if (status === 'cancelled' || status === 'expired' || status === 'failed') {
      forgetCheckout(userId)
      setView({ kind: 'cancelled' })
    } else {
      setView((v) => (v.kind === 'confirming' ? { ...v, status } : v))
    }
  }, [view, userId, qc])

  useEffect(() => {
    if (view.kind !== 'confirming') return
    const started = Date.now()
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      void check()
      const elapsed = Date.now() - started
      if (elapsed > 60_000) setView((v) => (v.kind === 'confirming' && !v.slow ? { ...v, slow: true } : v))
      timer = setTimeout(tick, elapsed < 60_000 ? 3000 : 15_000)
    }
    tick()
    const onVisible = () => document.visibilityState === 'visible' && void check()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
    // Restart only when a different payment is being confirmed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.kind === 'confirming' ? view.paymentId : null])

  const pay = async () => {
    setBusy(true)
    setError(null)
    const result = await startCheckout(selected)
    if (result.kind === 'redirect') {
      rememberCheckout(userId, { paymentId: result.paymentId, plan: selected, startedAt: Date.now() })
      window.location.href = result.url
      return
    }
    if (result.kind === 'whatsapp') {
      setView({ kind: 'whatsapp', plan: selected, reference: await requestOnWhatsApp(userId, selected) })
    } else {
      setError(result.message)
    }
    setBusy(false)
  }

  if (view.kind === 'done') {
    const plan = planById(view.plan ?? profile?.subscription_plan)
    return (
      <div className="mx-auto max-w-md space-y-5 pt-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success text-white shadow-lg shadow-success/30"><Check className="h-8 w-8" aria-hidden /></span>
        <h1 className="text-3xl font-bold tracking-tight">You&rsquo;re all set</h1>
        <p className="text-muted-foreground">
          {plan ? `${plan.name} is active.` : 'Your plan is active.'} Every lesson, every practice set and the AI tutor are open
          {profile?.subscription_expires_at ? <> until <strong className="text-foreground">{formatDate(profile.subscription_expires_at)}</strong></> : null}.
        </p>
        <button type="button" onClick={() => navigate({ to: '/' })} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-base font-semibold text-primary-foreground hover:bg-brand-strong">
          Start studying <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    )
  }

  if (view.kind === 'confirming') {
    return (
      <div className="mx-auto max-w-md space-y-5 pt-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-primary"><Loader2 className="h-8 w-8 animate-spin motion-reduce:animate-none" aria-hidden /></span>
        <h1 className="text-2xl font-bold tracking-tight" role="status">Confirming your payment…</h1>
        <p className="text-muted-foreground">
          {view.slow
            ? 'This is taking longer than usual. If you paid, your plan switches on by itself as soon as the payment is confirmed. You can leave this page.'
            : 'This usually takes a few seconds after you approve the payment on your phone.'}
        </p>
        <div className="space-y-2">
          <button type="button" onClick={() => void check()} className="flex min-h-12 w-full items-center justify-center rounded-xl border bg-card px-5 py-2 font-semibold hover:border-primary/40">
            Check again
          </button>
          {view.slow && (
            <a href={whatsappChatLink(`Hello WASSCE Tutor, I paid for a plan but it is not active yet. Payment: ${view.paymentId}`)} target="_blank" rel="noopener" className="flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-[#1a8d4a] hover:underline">
              <WhatsAppGlyph className="h-4 w-4" /> Message us on WhatsApp
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              forgetCheckout(userId)
              setView({ kind: 'choose' })
              navigate({ to: '/subscribe', search: {}, replace: true })
            }}
            className="flex min-h-11 w-full items-center justify-center text-sm text-muted-foreground hover:text-foreground"
          >
            Choose a plan again
          </button>
        </div>
      </div>
    )
  }

  if (view.kind === 'whatsapp') {
    const plan = planById(view.plan)!
    return (
      <div className="mx-auto max-w-md space-y-5 pt-6">
        <div className="space-y-3 rounded-3xl border bg-card p-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a8d4a] text-white"><WhatsAppGlyph className="h-6 w-6" /></span>
          <h1 className="text-2xl font-bold tracking-tight">Finish on WhatsApp</h1>
          <p className="text-muted-foreground">
            Send us the message on WhatsApp. We reply with Orange Money or AfriMoney details for <strong className="text-foreground">{plan.priceNle} NLe</strong>, then switch your {plan.name} on.
          </p>
          <p className="text-sm text-muted-foreground">Your reference: <span className="font-mono font-semibold text-foreground">{view.reference}</span></p>
          <a
            href={whatsappChatLink(whatsappText(plan.id, email, view.reference))}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1a8d4a] px-5 py-2 text-base font-semibold text-white hover:bg-[#157a3f]"
          >
            <WhatsAppGlyph className="h-5 w-5" /> Open WhatsApp
          </a>
        </div>
        <button type="button" onClick={() => setView({ kind: 'choose' })} className="flex min-h-11 w-full items-center justify-center text-sm text-muted-foreground hover:text-foreground">
          Back to plans
        </button>
      </div>
    )
  }

  const plan = planById(selected)!
  const active = access.reason === 'subscribed' && profile?.subscription_expires_at

  return (
    <div className="mx-auto max-w-lg space-y-6 pb-8">
      <header className="space-y-3 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-brand-strong text-white shadow-lg shadow-primary/30">
          <Sparkles className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="text-3xl font-bold tracking-tight">{active ? 'Add more time' : 'Unlock everything'}</h1>
        <p className="text-[15px] text-muted-foreground">
          {active ? (
            <>Your {planById(profile?.subscription_plan)?.name ?? 'plan'} runs until <strong className="text-foreground">{formatDate(profile!.subscription_expires_at!)}</strong>. A new plan adds its time on top.</>
          ) : (
            'One payment. Every lesson, every practice set and the AI tutor, for the whole plan.'
          )}
        </p>
      </header>

      {view.kind === 'cancelled' && (
        <div className="flex gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-4 text-sm" role="status">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
          <p><span className="font-semibold">The payment was not completed.</span> <span className="text-muted-foreground">No money was taken. You can try again below.</span></p>
        </div>
      )}

      <PlanCards selected={selected} onSelect={setSelected} />

      <ul className="grid gap-2 rounded-2xl border bg-card p-4 text-[15px] sm:grid-cols-2">
        {PAID_FEATURES.map((f) => (
          <li key={f} className="flex gap-2"><CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden /> {f}</li>
        ))}
      </ul>

      {error && <p className="text-center text-sm text-danger" role="alert">{error}</p>}

      <div className="space-y-3">
        <button
          type="button"
          onClick={pay}
          disabled={busy}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-colors hover:bg-brand-strong disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden /> : <Lock className="h-5 w-5" aria-hidden />}
          {busy ? 'Opening the payment page…' : `Pay ${plan.priceNle} NLe`}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-center text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0 text-success" aria-hidden /> Secure checkout by Monime: Orange Money, AfriMoney and more
        </p>
      </div>

      <div className="space-y-2 rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
        <p className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> No automatic renewal. When your plan ends you go back to the free account, and your progress is kept.</p>
        <p>
          Trouble paying? <a href={whatsappChatLink('Hello WASSCE Tutor, I need help paying for a plan.')} target="_blank" rel="noopener" className="font-semibold text-primary hover:underline">WhatsApp {CONTACT.phoneDisplay}</a>
        </p>
      </div>

      {!access.hasAccess && (
        <div className="space-y-2 border-t pt-5">
          <p className="text-sm font-semibold">Not ready yet? Your free account keeps</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden /> {f}</li>
            ))}
          </ul>
          <button type="button" onClick={() => navigate({ to: '/' })} className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline">
            Keep studying for free
          </button>
        </div>
      )}
    </div>
  )
}

function PlanCards({ selected, onSelect, interactive = true }: { selected: PlanId; onSelect: (p: PlanId) => void; interactive?: boolean }) {
  return (
    <div role={interactive ? 'radiogroup' : undefined} aria-label="Plans" className="grid gap-3 sm:grid-cols-2">
      {PLANS.map((p) => {
        const on = interactive && selected === p.id
        const Tag = interactive ? 'button' : 'div'
        return (
          <Tag
            key={p.id}
            {...(interactive ? { type: 'button' as const, role: 'radio', 'aria-checked': on, onClick: () => onSelect(p.id) } : {})}
            className={`relative flex flex-col rounded-2xl bg-card p-5 text-left transition ${
              on ? 'ring-2 ring-primary shadow-[0_16px_32px_-20px_rgba(76,29,149,0.6)]' : 'ring-1 ring-border hover:ring-primary/40'
            }`}
          >
            {p.best && <span className="absolute -top-2.5 left-5 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">Best value</span>}
            <span className="flex items-center justify-between gap-2">
              <span className="font-bold">{p.name}</span>
              {interactive && (
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${on ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'}`} aria-hidden>
                  {on && <Check className="h-4 w-4" />}
                </span>
              )}
            </span>
            <span className="mt-2 text-4xl font-bold tracking-tight tabular-nums">
              {p.priceNle}<span className="ml-1 text-base font-semibold text-muted-foreground">NLe</span>
            </span>
            <span className="text-sm font-semibold text-muted-foreground">for {p.length}</span>
            <span className="mt-2 text-sm text-muted-foreground">{p.blurb}</span>
          </Tag>
        )
      })}
    </div>
  )
}

function whatsappText(plan: PlanId, email: string, reference: string) {
  const p = planById(plan)!
  return [
    "Hello WASSCE Tutor, I'd like to pay for a plan.",
    '',
    `Plan: ${p.name} (${p.priceNle} NLe for ${p.length})`,
    `Email: ${email}`,
    `Reference: ${reference}`,
    '',
    'Please send Orange Money / AfriMoney details.',
  ].join('\n')
}

/** WT-XXXXX: 5 characters, no I, L, O or U, easy to read out. */
function reference(): string {
  const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
  return `WT-${Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')}`
}

/**
 * Fallback while online checkout is not switched on: records the request for
 * Admin → Payments (best effort), then the student finishes on WhatsApp.
 */
async function requestOnWhatsApp(userId: string, plan: PlanId): Promise<string> {
  const ref = reference()
  const p = planById(plan)!
  const { error } = await supabase.from('payment_requests').insert({ user_id: userId, plan, amount_nle: p.priceNle, reference_code: ref })
  if (error) console.warn('Payment request not saved:', error.message)
  return ref
}
