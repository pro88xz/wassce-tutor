// Become a tutor.
//
// Signed out: what teaching here involves, as easy as 1, 2, 3, with one
// button that creates a tutor account and comes straight back here.
// Signed in: the application in three short steps (TutorApplyForm), or where
// the tutor stands: already live, hidden, removed, or waiting for review.
//
// While automatic approval is on (migration 25, switched in Admin, Tutors),
// the card is in the marketplace the moment the tutor finishes.
import { createFileRoute, Link } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, BadgeCheck, Check, CircleCheck, Clock, EyeOff, LayoutDashboard, MessageCircle, ShieldAlert, Wallet } from 'lucide-react'
import { publicHead } from '@/lib/seo'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { useTutorAutoApprove } from '@/lib/tutor-settings'
import { TUTOR_PHOTO } from '@/lib/tutors'
import { TutorApplyForm, type ApplyResult } from '@/components/tutors/TutorApplyForm'
import { TutorCard } from '@/components/tutors/Marketplace'
import { WhatsAppGlyph } from '@/components/WhatsAppGlyph'

export const Route = createFileRoute('/become-a-tutor')({
  ssr: true,
  head: publicHead('/become-a-tutor'),
  component: BecomeTutor,
})

/** Creates a tutor account, then comes back here to the application. */
const SIGN_UP = { intent: 'tutor', next: '/become-a-tutor' } as never

function BecomeTutor() {
  const { user } = useAuth()
  const auto = useTutorAutoApprove()
  if (!user) return <SignedOut auto={auto} />
  const meta = (user.user_metadata ?? {}) as { full_name?: string; name?: string }
  return <SignedIn userId={user.id} defaultName={(meta.full_name ?? meta.name ?? '').trim()} auto={auto} />
}

// ─── Signed out ─────────────────────────────────────────────────────────────

function SignedOut({ auto }: { auto: boolean }) {
  const steps: [string, string][] = [
    ['Create your account', 'Your name, email and a password, or continue with Google. It takes a minute.'],
    ['Make your tutor card', 'Add your photo, WhatsApp number, subjects and monthly fee, and a few lines about how you teach.'],
    auto
      ? ['Go live', 'Your card is in the marketplace the moment you finish. Students who agree to your fee message you on WhatsApp.']
      : ['Go live', 'Our team checks your card, then it goes into the marketplace. Students who agree to your fee message you on WhatsApp.'],
  ]
  return (
    <div className="site-bleed -mb-12 -mt-6">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[var(--site-ink)] text-white" aria-labelledby="teach-heading">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_32rem_at_100%_0%,rgba(124,92,255,.42),transparent_68%),radial-gradient(40rem_26rem_at_0%_110%,rgba(255,209,102,.16),transparent_70%)]" />
        <div aria-hidden className="absolute inset-0 -z-10 opacity-[.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(70%_80%_at_70%_30%,#000,transparent)]" />
        <div className="site-container grid grid-cols-[minmax(0,1fr)] items-center gap-14 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-16 lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2.5 rounded-full bg-white/10 py-1.5 pl-2.5 pr-3.5 text-[13px] font-semibold text-white/85 ring-1 ring-white/15">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.2)]" aria-hidden />
              {auto ? 'New tutors go live the same day' : 'Teach WASSCE students near you'}
            </p>
            <h1 id="teach-heading" className="site-display mt-6">
              Your students are <span className="site-accent text-[#cdbcff]">looking for you.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/72 sm:text-lg">
              Become a WASSCE tutor in Sierra Leone in three steps. Set your own monthly fee, and students who agree to it message you on WhatsApp to
              arrange in-person lessons.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/auth" search={SIGN_UP} className="site-btn site-btn-lg bg-white px-7 text-[var(--site-ink)] hover:bg-[#efeaff]">
                Become a tutor <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link to="/tutors" className="site-btn site-btn-lg border border-white/20 bg-white/5 px-6 text-white hover:bg-white/10">
                See the marketplace
              </Link>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white/70">
              {['Free to join', 'You set your fee', 'Students pay you directly'].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-400" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </div>
          <HeroVisual auto={auto} />
        </div>
      </section>

      {/* 1, 2, 3 */}
      <section className="site-band site-band-white" aria-labelledby="steps-heading">
        <div className="site-container">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="site-eyebrow">How it works</p>
              <h2 id="steps-heading" className="site-h2 mt-3">
                As easy as <span className="site-accent text-[var(--primary)]">one, two, three.</span>
              </h2>
            </div>
            <p className="site-lede max-w-md">About five minutes from start to finish, on any phone.</p>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
            {steps.map(([title, body], i) => (
              <li key={title} className="site-card p-6 sm:p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--site-ink)] text-base font-bold text-white shadow-[0_10px_20px_-12px_rgba(19,13,43,.8)]">
                  {i + 1}
                </span>
                <h3 className="site-h3 mt-6">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link to="/auth" search={SIGN_UP} className="site-btn site-btn-lg site-btn-primary">
              Start now: step 1 <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/auth" search={SIGN_UP} className="site-link">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* What tutors get */}
      <section className="site-band" aria-labelledby="why-heading">
        <div className="site-container">
          <p className="site-eyebrow">Why tutors join</p>
          <h2 id="why-heading" className="site-h2 mt-3 max-w-2xl">
            Your fee, your students, <span className="site-accent text-[var(--primary)]">your way.</span>
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
            {[
              { Icon: Wallet, title: 'You set the fee', body: 'Choose a monthly fee and lessons a week for each subject. Students see it before they contact you, so there is no haggling.' },
              { Icon: MessageCircle, title: 'Students come to you', body: 'A student who agrees to your fee opens WhatsApp with a message to you. Your number is never shown on your card.' },
              { Icon: LayoutDashboard, title: 'Your own dashboard', body: 'Edit your card, hide it when you are full, add a discount for several subjects or take small groups.' },
            ].map(({ Icon, title, body }) => (
              <li key={title} className="rounded-[1.25rem] border border-border bg-[var(--card)] p-6 sm:p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand-strong)]" aria-hidden>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="site-h3 mt-5">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-3xl text-[13px] leading-relaxed text-muted-foreground">
            WASSCE Tutor is an independent learning platform. Lessons are in person and arranged between you and the student; WASSCE Tutor does not take
            payment for tutoring. We can remove a tutor card that is misleading or breaks our{' '}
            <Link to="/terms" className="underline underline-offset-2 hover:text-foreground">
              terms
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  )
}

/** The hero's picture: a real lesson, with what a tutor sees on it: their fee, a student's message, the card going live. */
function HeroVisual({ auto }: { auto: boolean }) {
  return (
    <div className="relative mx-auto w-full max-w-[32rem] pb-10 lg:mx-0 lg:ml-auto" aria-hidden>
      <img
        src={TUTOR_PHOTO.src}
        srcSet={`${TUTOR_PHOTO.small} 640w, ${TUTOR_PHOTO.src} 1280w`}
        sizes="(min-width: 1024px) 30rem, 92vw"
        alt=""
        width={1280}
        height={853}
        fetchPriority="high"
        className="aspect-[4/4.4] w-full rounded-[1.75rem] object-cover shadow-[0_40px_80px_-40px_rgba(0,0,0,.8)] ring-1 ring-white/10"
      />
      {/* The fee */}
      <div className="hero-float absolute -left-3 top-8 w-[17rem] rounded-2xl bg-white p-4 text-slate-900 shadow-[0_30px_60px_-24px_rgba(0,0,0,.55)] ring-1 ring-slate-900/5 sm:-left-10" style={{ ['--float-time' as string]: '8s' }}>
        <p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">Your fee</p>
        <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <span>
            <span className="block text-sm font-bold">Mathematics</span>
            <span className="block text-[11px] text-slate-500">2 lessons a week</span>
          </span>
          <span className="whitespace-nowrap text-sm font-bold tabular-nums">NLe 300<span className="font-medium text-slate-500"> / month</span></span>
        </div>
      </div>
      {/* A student's message */}
      <div className="hero-float absolute -right-2 bottom-24 w-64 rounded-2xl bg-white p-3.5 text-slate-900 shadow-[0_30px_60px_-24px_rgba(0,0,0,.55)] ring-1 ring-slate-900/5 sm:-right-8" style={{ ['--float-time' as string]: '9s', ['--float-delay' as string]: '-3s' }}>
        <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#128C7E]">
          <WhatsAppGlyph className="h-3.5 w-3.5 text-[#25D366]" /> New message
        </p>
        <p className="mt-2 rounded-xl rounded-tl-sm bg-[#e7fbe9] px-3 py-2 text-[12.5px] leading-snug text-slate-800">
          Hello, I found you on WASSCE Tutor. I would like lessons in Mathematics at your fee of NLe 300 a month. When could we start?
        </p>
      </div>
      {/* Live */}
      <div className="absolute bottom-0 left-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-bold text-slate-900 shadow-[0_20px_40px_-18px_rgba(0,0,0,.6)] sm:left-10">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.2)]" />
        {auto ? 'Your card is live in the marketplace' : 'Your card in the marketplace'}
      </div>
    </div>
  )
}

// ─── Signed in ──────────────────────────────────────────────────────────────

type Application = { status: string; review_note: string | null }
type TutorState = { status: string; listed: boolean }

function SignedIn({ userId, defaultName, auto }: { userId: string; defaultName: string; auto: boolean }) {
  const [state, setState] = useState<{ loaded: boolean; application: Application | null; tutor: TutorState | null }>({
    loaded: false,
    application: null,
    tutor: null,
  })
  const [done, setDone] = useState<ApplyResult | null>(null)

  const load = useCallback(() => {
    let active = true
    void Promise.all([
      // The latest application: there can be several after a declined one.
      supabase.from('tutor_applications').select('status,review_note').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('tutors').select('status,listed').eq('user_id', userId).maybeSingle(),
    ]).then(([a, t]) => {
      if (!active) return
      setState({ loaded: true, application: a.error ? null : (a.data as Application | null), tutor: t.error ? null : (t.data as TutorState | null) })
    })
    return () => {
      active = false
    }
  }, [userId])
  useEffect(() => load(), [load])

  return (
    <div className="mx-auto w-full max-w-6xl pb-16">
      {done ? (
        <Done result={done} />
      ) : !state.loaded ? (
        <div className="space-y-6" aria-busy="true" aria-label="Loading">
          <div className="h-56 animate-pulse rounded-[1.75rem] bg-muted" />
          <div className="h-96 animate-pulse rounded-[1.25rem] bg-muted" />
        </div>
      ) : state.tutor ? (
        <AlreadyTutor tutor={state.tutor} />
      ) : state.application && (state.application.status === 'submitted' || state.application.status === 'under_review') ? (
        <StatusPanel
          Icon={Clock}
          tone="amber"
          title="Your application is with our team"
          body="We check new tutor cards by hand at the moment. You will get a message here and by email as soon as your card is in the marketplace."
        />
      ) : (
        <TutorApplyForm
          userId={userId}
          defaultName={defaultName}
          auto={auto}
          previousNote={state.application?.status === 'rejected' ? state.application.review_note : undefined}
          onDone={setDone}
          onAlreadyApplied={load}
        />
      )}
    </div>
  )
}

function AlreadyTutor({ tutor }: { tutor: TutorState }) {
  if (tutor.status === 'suspended')
    return (
      <StatusPanel
        Icon={ShieldAlert}
        tone="rose"
        title="Your tutor card was removed"
        body="WASSCE Tutor removed your card from the marketplace, so students cannot contact you. Contact support if you have questions."
        action={{ to: '/contact', label: 'Contact support' }}
      />
    )
  if (!tutor.listed)
    return (
      <StatusPanel
        Icon={EyeOff}
        tone="slate"
        title="Your card is hidden"
        body="You are a tutor, but you hid your card, so students cannot find you. Show it again from your tutor dashboard when you can take students."
        action={{ to: '/tutor-dashboard', label: 'Open your tutor dashboard' }}
      />
    )
  return (
    <StatusPanel
      Icon={BadgeCheck}
      tone="emerald"
      title="You are already a tutor"
      body="Your card is in the marketplace. Edit it, change your fees or add offers from your tutor dashboard."
      action={{ to: '/tutor-dashboard', label: 'Open your tutor dashboard' }}
      secondary={{ to: '/tutors', label: 'See the marketplace' }}
    />
  )
}

type Destination = '/contact' | '/tutor-dashboard' | '/tutors'

const TONES = {
  emerald: 'bg-emerald-500/15 text-emerald-300',
  amber: 'bg-amber-400/15 text-amber-300',
  rose: 'bg-rose-500/15 text-rose-300',
  slate: 'bg-white/10 text-white/80',
} as const

function StatusPanel({
  Icon,
  tone,
  title,
  body,
  action,
  secondary,
}: {
  Icon: typeof Clock
  tone: keyof typeof TONES
  title: string
  body: string
  action?: { to: Destination; label: string }
  secondary?: { to: Destination; label: string }
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-[var(--site-ink)] px-6 py-10 text-white sm:px-10 sm:py-14">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_20rem_at_100%_0%,rgba(124,92,255,.38),transparent_70%)]" />
      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${TONES[tone]}`} aria-hidden>
        <Icon className="h-6 w-6" />
      </span>
      <h1 className="mt-6 text-[1.9rem] font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-[2.5rem]">{title}</h1>
      <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-white/72">{body}</p>
      {(action || secondary) && (
        <div className="mt-8 flex flex-wrap gap-3">
          {action && (
            <Link to={action.to} className="site-btn site-btn-lg bg-white px-6 text-[var(--site-ink)] hover:bg-[#efeaff]">
              {action.label} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
          {secondary && (
            <Link to={secondary.to} className="site-btn site-btn-lg border border-white/20 bg-white/5 px-6 text-white hover:bg-white/10">
              {secondary.label}
            </Link>
          )}
        </div>
      )}
    </section>
  )
}

/** After publishing: live now (or sent for review), with the card as students see it. */
function Done({ result }: { result: ApplyResult }) {
  const { live, card, photo, phone } = result
  return (
    <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-[var(--site-ink)] text-white" aria-labelledby="done-heading">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(44rem_26rem_at_100%_0%,rgba(124,92,255,.42),transparent_70%),radial-gradient(34rem_20rem_at_0%_110%,rgba(16,185,129,.18),transparent_70%)]" />
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-14">
        <div>
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${live ? 'bg-emerald-500 text-white shadow-[0_0_0_8px_rgba(16,185,129,.18)]' : 'bg-amber-400/15 text-amber-300'}`} aria-hidden>
            {live ? <CircleCheck className="h-7 w-7" /> : <Clock className="h-7 w-7" />}
          </span>
          <h1 id="done-heading" className="mt-7 text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-[3rem]">
            {live ? (
              <>
                You are live. <span className="site-accent text-[#cdbcff]">Welcome aboard.</span>
              </>
            ) : (
              'Application sent.'
            )}
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-white/72">
            {live
              ? `Your tutor card is in the marketplace now. Students who agree to your fee will message you on WhatsApp${phone ? ` at ${phone}` : ''}.`
              : 'Our team will check your card. You will get a message here and by email as soon as it is in the marketplace.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {live && (
              <Link to="/tutors" className="site-btn site-btn-lg bg-white px-6 text-[var(--site-ink)] hover:bg-[#efeaff]">
                See your card in the marketplace <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            )}
            <Link to="/tutor-dashboard" className="site-btn site-btn-lg border border-white/20 bg-white/5 px-6 text-white hover:bg-white/10">
              Open your tutor dashboard
            </Link>
          </div>
          {live && (
            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="text-[12px] font-bold uppercase tracking-[.16em] text-[#cdbcff]">Get more students</p>
              <ul className="mt-4 grid gap-3 text-[15px] text-white/80 sm:grid-cols-3">
                {['Add a discount for students who take several subjects', 'Take small groups of friends, at a group fee', 'Show how students can pay: Orange Money, Afrimoney or cash'].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" aria-hidden /> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mx-auto w-full max-w-sm text-foreground lg:mx-0">
          <TutorCard tutor={card} preview photoSrc={photo} />
        </div>
      </div>
    </section>
  )
}
