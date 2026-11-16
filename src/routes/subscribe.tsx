import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, CircleCheck, Clock, Copy, Loader2, Lock, Phone, ShieldCheck, Smartphone, Sparkles, XCircle } from 'lucide-react'
import { privateHead } from '@/lib/seo'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useAccess } from '@/lib/useAccess'
import { CONTACT, whatsappChatLink } from '@/lib/contact'
import { ONLINE_CHECKOUT, PAID_FEATURES, PLANS, planById, type PlanId } from '@/lib/plans'
import { FREE_FEATURES } from '@/lib/free-plan'
import { canDial, confirmPayment, forgetCheckout, openDialler, pendingCheckout, rememberCheckout, startUssdPayment, type PaymentStatus } from '@/lib/payments'
import { WhatsAppGlyph } from '@/components/WhatsAppGlyph'
import { SignInLink } from '@/components/auth/SignInLink'

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
        <SignInLink className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Or sign in here</SignInLink>
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
      <SignInLink className="flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-2 text-base font-semibold text-primary-foreground hover:bg-brand-strong">
        Create a free account
      </SignInLink>
    </div>
  )
}

type View =
  | { kind: 'choose' }
  | { kind: 'confirming'; paymentId: string; plan?: PlanId; status: PaymentStatus; ussdCode?: string; expiresAt: number }
  | { kind: 'done'; plan?: PlanId }
  | { kind: 'cancelled' }
  | { kind: 'whatsapp'; plan: PlanId; reference: string }

/** A Monime payment code lasts 10 minutes. */
const CODE_LIFETIME_MS = 10 * 60 * 1000

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
    if (!paymentId) return { kind: 'choose' }
    const expiresAt = pending?.expiresAt ?? (pending ? pending.startedAt + CODE_LIFETIME_MS : Date.now() + CODE_LIFETIME_MS)
    return { kind: 'confirming', paymentId, plan: pending?.plan, status: 'pending', ussdCode: pending?.ussdCode, expiresAt }
  })

  useEffect(() => {
    if (search.cancelled) forgetCheckout(userId)
  }, [search.cancelled, userId])

  // While a code is live: ask our server every few seconds, then less often,
  // and again whenever the student comes back from the dialler.
  const checking = useRef(false)
  const check = useCallback(async () => {
    if (view.kind !== 'confirming' || checking.current) return
    checking.current = true
    const { status, expiresAt } = await confirmPayment(view.paymentId)
    checking.current = false
    if (status === 'completed') {
      forgetCheckout(userId)
      await qc.invalidateQueries({ queryKey: ['profile'] })
      setView({ kind: 'done', plan: view.plan })
    } else if (status === 'cancelled' || status === 'failed') {
      forgetCheckout(userId)
      setView({ kind: 'cancelled' })
    } else {
      setView((v) => (v.kind === 'confirming' ? { ...v, status, expiresAt: expiresAt ?? v.expiresAt } : v))
    }
  }, [view, userId, qc])

  const live = view.kind === 'confirming' && view.status !== 'expired'
  useEffect(() => {
    if (!live) return
    const started = Date.now()
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      void check()
      timer = setTimeout(tick, Date.now() - started < 120_000 ? 3000 : 10_000)
    }
    tick()
    const onVisible = () => document.visibilityState === 'visible' && void check()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
    // Restart only when a different payment is being confirmed, or it stops being live.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.kind === 'confirming' ? view.paymentId : null, live])

  const pending = usePendingRequest(userId)

  const payOnWhatsApp = async (plan: PlanId) => {
    setBusy(true)
    setError(null)
    const ref = await requestOnWhatsApp(userId, plan)
    await qc.invalidateQueries({ queryKey: ['pending-request', userId] })
    setView({ kind: 'whatsapp', plan, reference: ref })
    setBusy(false)
    window.location.href = whatsappChatLink(whatsappText(plan, email, ref))
  }

  const pay = async (plan: PlanId = selected) => {
    if (!ONLINE_CHECKOUT) return payOnWhatsApp(plan)
    setSelected(plan)
    setBusy(true)
    setError(null)
    const result = await startUssdPayment(plan)
    if (result.kind === 'ussd') {
      rememberCheckout(userId, { paymentId: result.paymentId, plan, startedAt: Date.now(), ussdCode: result.ussdCode, expiresAt: result.expiresAt })
      setView({ kind: 'confirming', paymentId: result.paymentId, plan, status: 'pending', ussdCode: result.ussdCode, expiresAt: result.expiresAt })
      setBusy(false)
      // On a phone the dialler opens with the code; the steps stay on screen for when they come back.
      if (canDial()) openDialler(result.ussdCode)
      return
    }
    if (result.kind === 'whatsapp') {
      setView({ kind: 'whatsapp', plan, reference: await requestOnWhatsApp(userId, plan) })
    } else {
      setError(result.message)
    }
    setBusy(false)
  }

  const choosePlanAgain = () => {
    forgetCheckout(userId)
    setView({ kind: 'choose' })
    navigate({ to: '/subscribe', search: {}, replace: true })
  }

  if (view.kind === 'done') {
    const plan = planById(view.plan ?? profile?.subscription_plan)
    return (
      <div className="mx-auto max-w-md space-y-5 pt-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success text-white shadow-lg shadow-success/30"><Check className="h-8 w-8" aria-hidden /></span>
        <h1 className="text-3xl font-bold tracking-tight">You&rsquo;re all set</h1>
        <p className="text-muted-foreground">
          {plan ? `${plan.name} is active.` : 'Your plan is active.'} Every lesson, every practice set and the study tutor are open
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
      <PayWithCode
        view={view}
        busy={busy}
        error={error}
        onCheck={() => void check()}
        onNewCode={(plan) => void pay(plan)}
        onChoosePlan={choosePlanAgain}
      />
    )
  }

  if (view.kind === 'whatsapp') {
    return (
      <div className="mx-auto max-w-md space-y-5 pt-6">
        <RequestSent plan={view.plan} reference={view.reference} email={email} />
        <button type="button" onClick={() => setView({ kind: 'choose' })} className="flex min-h-11 w-full items-center justify-center text-sm text-muted-foreground hover:text-foreground">
          Back to plans
        </button>
      </div>
    )
  }

  const plan = planById(selected)!
  const active = access.reason === 'subscribed' && profile?.subscription_expires_at

  return (
    <div className="app-page checkout-page mx-auto w-full max-w-4xl space-y-6 pb-8">
      <header className="space-y-3 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-brand-strong text-white shadow-lg shadow-primary/30">
          <Sparkles className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="text-3xl font-bold tracking-tight">{active ? 'Add more time' : 'Unlock everything'}</h1>
        <p className="text-[15px] text-muted-foreground">
          {active ? (
            <>Your {planById(profile?.subscription_plan)?.name ?? 'plan'} runs until <strong className="text-foreground">{formatDate(profile!.subscription_expires_at!)}</strong>. A new plan adds its time on top.</>
          ) : (
            'Unlock every lesson, every practice set and study tutor support. Choose monthly flexibility or save with yearly access.'
          )}
        </p>
      </header>

      {view.kind === 'cancelled' && (
        <div className="flex gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-4 text-sm" role="status">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
          <p><span className="font-semibold">The payment was not completed.</span> <span className="text-muted-foreground">No money was taken. You can try again below.</span></p>
        </div>
      )}

      {pending && <RequestSent plan={pending.plan} reference={pending.reference_code} email={email} sentAt={pending.created_at} />}

      <PlanCards selected={selected} onSelect={setSelected} />

      <ul className="grid gap-2 rounded-2xl border bg-card p-4 text-[15px] sm:grid-cols-2">
        {PAID_FEATURES.map((f) => (
          <li key={f} className="flex gap-2"><CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden /> {f}</li>
        ))}
      </ul>

      {error && <p className="text-center text-sm text-danger" role="alert">{error}</p>}

      {ONLINE_CHECKOUT ? (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => void pay()}
            disabled={busy}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-colors hover:bg-brand-strong disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden /> : <Lock className="h-5 w-5" aria-hidden />}
            {busy ? 'Preparing secure USSD payment…' : `Pay ${plan.priceNle} NLe`}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-center text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-success" aria-hidden /> Secure one-time payment through Monime. No automatic renewal.
          </p>
          <UssdSteps amount={plan.priceNle} />
        </div>
      ) : (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => void pay()}
            disabled={busy}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1a8d4a] px-5 py-3 text-lg font-semibold text-white shadow-lg shadow-[#1a8d4a]/30 transition-colors hover:bg-[#157a3f] disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden /> : <WhatsAppGlyph className="h-5 w-5" />}
            {busy ? 'Opening WhatsApp…' : `Pay ${plan.priceNle} NLe on WhatsApp`}
          </button>
          <div className="space-y-3 rounded-2xl border bg-card p-5 text-sm">
            <p className="font-bold">How paying works</p>
            <ol className="space-y-2.5">
              {[
                <>Tap <span className="font-semibold text-foreground">Pay on WhatsApp</span>. WhatsApp opens with your plan and reference filled in: just tap send.</>,
                <>We reply with the Orange Money or AfriMoney number to pay.</>,
                <>Send the payment. We switch your plan on as soon as it arrives, usually within an hour.</>,
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

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
            {p.best && <span className="absolute -top-2.5 left-5 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">Save 75%</span>}
            <span className="flex items-center justify-between gap-2">
              <span className="font-bold">{p.name}</span>
              {interactive && (
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${on ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'}`} aria-hidden>
                  {on && <Check className="h-4 w-4" />}
                </span>
              )}
            </span>
            <span className="mt-3 flex items-baseline gap-1.5 tabular-nums">
              <span className="text-4xl font-bold tracking-tight">{p.priceNle}</span>
              <span className="text-base font-semibold text-muted-foreground">NLe</span>
              <span className="text-sm font-medium text-muted-foreground">/ {p.id === 'term' ? 'month' : 'year'}</span>
            </span>
            <span className="text-sm font-semibold text-muted-foreground">{p.billing}</span>
            <span className="mt-2 text-sm text-muted-foreground">{p.blurb}</span>
            {p.savings && <span className="mt-2 rounded-xl bg-success/10 px-3 py-2 text-sm font-semibold text-success">{p.savings}</span>}
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
 * Paying on WhatsApp: records the request for Admin -> Payments (best
 * effort; WhatsApp still carries it), then the student finishes on WhatsApp.
 */
async function requestOnWhatsApp(userId: string, plan: PlanId): Promise<string> {
  const ref = reference()
  const p = planById(plan)!
  const { error } = await supabase.from('payment_requests').insert({ user_id: userId, plan, amount_nle: p.priceNle, reference_code: ref })
  if (error) console.warn('Payment request not saved:', error.message)
  return ref
}

type PendingRequest = { plan: PlanId; reference_code: string; created_at: string }

/** The student's latest WhatsApp request still waiting for an admin (last 7 days). */
function usePendingRequest(userId: string) {
  const { data } = useQuery({
    queryKey: ['pending-request', userId],
    enabled: !ONLINE_CHECKOUT,
    queryFn: async (): Promise<PendingRequest | null> => {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const { data, error } = await supabase
        .from('payment_requests')
        .select('plan, reference_code, created_at')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(1)
      if (error) return null
      const row = data?.[0] as PendingRequest | undefined
      return row && planById(row.plan) ? row : null
    },
  })
  return data ?? null
}

/** A WhatsApp request on its way: what happens next, and a way back to the chat. */
function RequestSent({ plan, reference, email, sentAt }: { plan: PlanId; reference: string; email: string; sentAt?: string }) {
  const p = planById(plan)!
  return (
    <div className="space-y-3 rounded-2xl border border-[#1a8d4a]/30 bg-[#1a8d4a]/5 p-5" role="status">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1a8d4a] text-white"><WhatsAppGlyph className="h-5 w-5" /></span>
        <div className="min-w-0">
          <p className="font-bold">Request sent: {p.name}, {p.priceNle} NLe</p>
          <p className="text-sm text-muted-foreground">
            Reference <span className="font-mono font-semibold text-foreground">{reference}</span>
            {sentAt && ` · ${new Date(sentAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`}
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Make sure you sent the WhatsApp message, then pay the Orange Money or AfriMoney number we reply with. Your plan switches on as soon as the payment arrives, usually within an hour.
      </p>
      <a
        href={whatsappChatLink(whatsappText(plan, email, reference))}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1a8d4a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#157a3f]"
      >
        <WhatsAppGlyph className="h-4 w-4" /> Open WhatsApp again
      </a>
    </div>
  )
}

/** What paying by USSD involves, shown before the dialler opens so nothing comes as a surprise. */
function UssdSteps({ amount }: { amount: number }) {
  const steps = [
    <>Tap <span className="font-semibold text-foreground">Pay</span>. {canDial() ? 'Your phone dialler opens' : 'You get'} a one-time code starting <span className="font-mono font-semibold text-foreground">*715*</span>.</>,
    <>{canDial() ? 'Press call' : 'Dial it on your phone'}, choose Orange Money or AfriMoney, and check the amount: <span className="font-semibold text-foreground">{amount} NLe</span>.</>,
    <>Enter your mobile money PIN, then come back here. Your plan switches on by itself.</>,
  ]
  return (
    <div className="space-y-3 rounded-2xl border bg-card p-5 text-sm">
      <p className="flex items-center gap-2 font-bold"><Smartphone className="h-4 w-4 text-primary" aria-hidden /> How paying works</p>
      <ol className="space-y-2.5">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-muted-foreground">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="text-xs text-muted-foreground">Make sure you have {amount} NLe in your mobile money account first. The code works once, for this amount only, for 10 minutes.</p>
    </div>
  )
}

/** Minutes and seconds left until the code expires, updated every second. */
function useCountdown(expiresAt: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const left = Math.max(0, expiresAt - now)
  return { left, label: `${Math.floor(left / 60000)}:${String(Math.floor((left % 60000) / 1000)).padStart(2, '0')}` }
}

/** The live payment: the code, the steps, a countdown, and what to do if it runs out. */
function PayWithCode({
  view,
  busy,
  error,
  onCheck,
  onNewCode,
  onChoosePlan,
}: {
  view: Extract<View, { kind: 'confirming' }>
  busy: boolean
  error: string | null
  onCheck: () => void
  onNewCode: (plan: PlanId) => void
  onChoosePlan: () => void
}) {
  const plan = planById(view.plan)
  const { left, label } = useCountdown(view.expiresAt)
  const expired = view.status === 'expired' || (left === 0 && view.status !== 'processing')
  const processing = view.status === 'processing'
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    if (!view.ussdCode) return
    try {
      await navigator.clipboard.writeText(view.ussdCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* the code is on screen to type in */
    }
  }

  if (expired) {
    return (
      <div className="mx-auto max-w-md space-y-5 pt-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 text-warning"><Clock className="h-8 w-8" aria-hidden /></span>
        <h1 className="text-2xl font-bold tracking-tight">This payment code has expired</h1>
        <p className="text-muted-foreground">Codes last 10 minutes. <span className="font-semibold text-foreground">No money was taken.</span> Get a new code and pay straight away.</p>
        {error && <p className="text-sm text-danger" role="alert">{error}</p>}
        <div className="space-y-2">
          {plan && (
            <button type="button" disabled={busy} onClick={() => onNewCode(plan.id)} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2 text-base font-semibold text-primary-foreground hover:bg-brand-strong disabled:opacity-60">
              {busy ? <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden /> : <Phone className="h-5 w-5" aria-hidden />}
              {busy ? 'Getting a new code…' : `Get a new code: ${plan.priceNle} NLe`}
            </button>
          )}
          {plan?.id === 'year' && (
            <button type="button" disabled={busy} onClick={() => onNewCode('term')} className="flex min-h-11 w-full items-center justify-center rounded-xl border bg-card px-4 text-sm font-semibold hover:border-primary/40 disabled:opacity-60">
              Short of balance? Pay monthly instead: {planById('term')!.priceNle} NLe
            </button>
          )}
          <button type="button" onClick={onChoosePlan} className="flex min-h-11 w-full items-center justify-center text-sm text-muted-foreground hover:text-foreground">
            Choose a plan again
          </button>
        </div>
        <HelpOnWhatsApp paymentId={view.paymentId} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md space-y-5 pt-6">
      <header className="space-y-2 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-primary">
          {processing ? <Loader2 className="h-7 w-7 animate-spin motion-reduce:animate-none" aria-hidden /> : <Phone className="h-7 w-7" aria-hidden />}
        </span>
        <h1 className="text-2xl font-bold tracking-tight" role="status">{processing ? 'Approve the payment on your phone' : 'Dial this code to pay'}</h1>
        <p className="text-muted-foreground">
          {processing
            ? 'Monime has your payment. Finish it with your mobile money PIN; your plan switches on as soon as it is confirmed.'
            : plan ? `${plan.name}: ${plan.priceNle} NLe for ${plan.length}. Pay with Orange Money or AfriMoney.` : 'Pay with Orange Money or AfriMoney.'}
        </p>
      </header>

      {view.ussdCode && (
        <div className="space-y-3 rounded-2xl border-2 border-primary/30 bg-card p-5 text-center shadow-[0_18px_40px_-28px_rgba(76,29,149,0.6)]">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your one-time payment code</p>
          <p className="font-mono text-3xl font-bold tracking-wider text-foreground">{view.ussdCode}</p>
          <p className="text-sm text-muted-foreground" aria-live="off">Expires in <span className="font-semibold tabular-nums text-foreground">{label}</span></p>
          <div className="grid gap-2 sm:grid-cols-2">
            {canDial() && (
              <button type="button" onClick={() => openDialler(view.ussdCode!)} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-primary-foreground hover:bg-brand-strong sm:col-span-2">
                <Phone className="h-5 w-5" aria-hidden /> Open the dialler
              </button>
            )}
            <button type="button" onClick={() => void copy()} className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold hover:border-primary/40 ${canDial() ? 'sm:col-span-2' : 'sm:col-span-2'}`}>
              {copied ? <Check className="h-4 w-4 text-success" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />} {copied ? 'Copied' : 'Copy the code'}
            </button>
          </div>
        </div>
      )}

      <ol className="space-y-2.5 rounded-2xl border bg-card p-5 text-sm">
        {[
          canDial() ? <>Tap <span className="font-semibold text-foreground">Open the dialler</span> and press call.</> : <>Dial the code on the phone that has your mobile money.</>,
          <>Choose Orange Money or AfriMoney and check the amount{plan ? <>: <span className="font-semibold text-foreground">{plan.priceNle} NLe</span></> : null}.</>,
          <>Enter your PIN to approve, then come back to this page.</>,
        ].map((step, i) => (
          <li key={i} className="flex gap-3 text-muted-foreground">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
        <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />
        {processing ? 'Confirming your payment…' : 'Waiting for your payment. This page updates by itself.'}
      </p>

      <div className="space-y-2">
        <button type="button" onClick={onCheck} className="flex min-h-12 w-full items-center justify-center rounded-xl border bg-card px-5 py-2 font-semibold hover:border-primary/40">
          I have paid: check now
        </button>
        <button type="button" onClick={onChoosePlan} className="flex min-h-11 w-full items-center justify-center text-sm text-muted-foreground hover:text-foreground">
          Choose a different plan
        </button>
      </div>
      <HelpOnWhatsApp paymentId={view.paymentId} />
    </div>
  )
}

function HelpOnWhatsApp({ paymentId }: { paymentId: string }) {
  return (
    <a
      href={whatsappChatLink(`Hello WASSCE Tutor, I need help paying for a plan. Payment: ${paymentId}`)}
      target="_blank"
      rel="noopener"
      className="flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-[#1a8d4a] hover:underline"
    >
      <WhatsAppGlyph className="h-4 w-4" /> Stuck or already paid? WhatsApp us
    </a>
  )
}
