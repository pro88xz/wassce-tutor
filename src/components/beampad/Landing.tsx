// BeamPad's landing page, in any language: /beampad (English) and /beampad/es
// (Spanish) render these sections with their own words, from
// src/content/beampad-landing-en.tsx and -es.tsx. The layout, motion and
// tracked Play links are the same; only the text differs.
import { ArrowRight, Bluetooth, Check, ChevronDown, Fingerprint, Gamepad2, Keyboard, KeyRound, Lock, Minus, MousePointer2, ShieldCheck, Tv, WifiOff, X } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { BeamPadFooter, BeamPadHeader, PhoneShot, PlayBadge, SectionHead, type Lang } from '@/components/beampad/BeamPad'
import { HeroVisual } from '@/components/beampad/HeroVisual'
import { Aurora, BeamPadMotion } from '@/components/beampad/Motion'
import { BEAMPAD_GUIDES, BEAMPAD_ICON, type Compat, type Screen } from '@/content/beampad'

/** Everything the landing page says, in one language. */
export type LandingCopy = {
  lang: Lang
  /** The page name in tracked Play links (Admin -> App clicks). */
  page: string
  skip: string
  /** Section anchors, in the page's language. */
  ids: { features: string; how: string; compat: string; guides: string; faq: string }
  hero: { chip: string; title: string; accent: string; lead: string; check: string; footnote: string; searches: string[]; tvChip: string; phoneAlt?: string }
  /** Four short reasons, in this order: no Wi-Fi, nothing on the TV, no data, your own keyboard. */
  proof: { label: string; items: [title: string, text: string][] }
  why: { eyebrow: string; title: string; lead: string; wifiTitle: string; wifi: string[]; beampad: string[] }
  features: { eyebrow: string; title: string; lead: string; items: { screen: Screen; eyebrow: string; title: string; text: string; points: string[]; alt?: string }[] }
  pro: {
    eyebrow: string
    title: string
    lead: string
    gamepad: [title: string, text: string]
    pc: [title: string, text: string, alt?: string]
    presenter: [title: string, text: string, alt?: string]
    allTitle: string
    all: string[]
  }
  how: { eyebrow: string; title: string; lead: string; steps: { title: string; body: ReactNode }[]; note: ReactNode }
  compat: { eyebrow: string; title: string; lead: string; works: [string, Compat[]]; limited: [string, Compat[]]; no: [string, Compat[]]; footnote: string }
  /** Four points, in this order: no data, phone to TV, snippets locked, ads never see typing. */
  privacy: { eyebrow: string; title: string; lead: ReactNode; points: [title: string, text: string][] }
  guides: { eyebrow: string; title: string; lead: string; read: string; titleSuffix?: string }
  faq: { eyebrow: string; title: string; items: [question: string, answer: string][] }
  cta: { title: string; lead: string; languages: string }
}

/** A reveal delay for staggered entrances (src/components/beampad/Motion.tsx). */
const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export function LandingPage({ t }: { t: LandingCopy }) {
  return (
    <div className="bp" lang={t.lang}>
      <Aurora />
      <BeamPadMotion />
      <a href="#main-content" className="bp-skip">{t.skip}</a>
      <BeamPadHeader page={t.page} lang={t.lang} />
      <main id="main-content" className="relative z-[1]">
        <Hero t={t} />
        <ProofStrip t={t} />
        <WhyBluetooth t={t} />
        <Features t={t} />
        <Pro t={t} />
        <HowItWorks t={t} />
        <Compatibility t={t} />
        <Privacy t={t} />
        <Guides t={t} />
        <Faq t={t} />
        <FinalCta t={t} />
      </main>
      <BeamPadFooter page={t.page} lang={t.lang} />
    </div>
  )
}

function Hero({ t }: { t: LandingCopy }) {
  const h = t.hero
  return (
    <section className="bp-container grid items-center gap-8 pt-8 pb-16 sm:gap-14 sm:pt-14 lg:grid-cols-[1.02fr_1fr] lg:gap-10 lg:pt-20 lg:pb-24">
      <div className="space-y-6 sm:space-y-7">
        <p className="bp-chip" data-reveal>
          <Bluetooth className="h-4 w-4 text-[var(--bp-mint)]" aria-hidden />
          {h.chip}
        </p>
        <h1 data-reveal style={delay(80)} className="text-[2.6rem] leading-[1.04] font-extrabold tracking-[-0.035em] text-balance text-white sm:text-6xl lg:text-[4.1rem]">
          {h.title} <span className="bp-gradient-text">{h.accent}</span>
        </h1>
        <p data-reveal style={delay(160)} className="max-w-xl text-lg leading-relaxed text-pretty text-[var(--bp-muted)] sm:text-xl">
          {h.lead}
        </p>
        <div data-reveal style={delay(240)} className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <PlayBadge placement="hero" page={t.page} lang={t.lang} height={58} />
          <a href={`#${t.ids.compat}`} className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-white/90 hover:text-white">
            {h.check}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>
        <p data-reveal style={delay(300)} className="text-sm text-[var(--bp-faint)]">
          {h.footnote}
        </p>
      </div>
      <HeroVisual searches={h.searches} chip={h.tvChip} phoneAlt={h.phoneAlt} />
    </section>
  )
}

const PROOF_ICONS = [WifiOff, Tv, ShieldCheck, Keyboard]

function ProofStrip({ t }: { t: LandingCopy }) {
  return (
    <section aria-label={t.proof.label} className="border-y border-[var(--bp-line)] bg-white/[0.02]">
      <ul className="bp-container grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {t.proof.items.map(([title, text], i) => {
          const Icon = PROOF_ICONS[i] ?? Check
          return (
            <li key={title} data-reveal style={delay(i * 90)} className="flex gap-3.5">
              <span className="bp-icon-tile">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block font-semibold text-white">{title}</span>
                <span className="block text-sm leading-snug text-[var(--bp-muted)]">{text}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function WhyBluetooth({ t }: { t: LandingCopy }) {
  const w = t.why
  return (
    <section className="bp-container py-24" aria-labelledby="why">
      <SectionHead id="why" eyebrow={w.eyebrow} title={w.title}>
        {w.lead}
      </SectionHead>
      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
        <div data-reveal className="bp-card p-7">
          <h3 className="text-sm font-semibold tracking-[0.12em] text-[var(--bp-faint)] uppercase">{w.wifiTitle}</h3>
          <ul className="mt-5 space-y-3.5">
            {w.wifi.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] leading-snug text-[var(--bp-muted)]">
                <Minus className="mt-0.5 h-5 w-5 shrink-0 text-white/30" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal style={delay(120)} className="bp-card bp-card-glow p-7">
          <h3 className="text-sm font-semibold tracking-[0.12em] text-[var(--bp-mint)] uppercase">BeamPad</h3>
          <ul className="mt-5 space-y-3.5">
            {w.beampad.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] leading-snug text-white">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bp-mint)]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Features({ t }: { t: LandingCopy }) {
  const f = t.features
  return (
    <section id={t.ids.features} className="scroll-mt-20 bg-[linear-gradient(180deg,transparent,rgba(108,92,245,0.06)_30%,transparent)] py-24" aria-labelledby="features-title">
      <div className="bp-container">
        <SectionHead id="features-title" eyebrow={f.eyebrow} title={f.title}>
          {f.lead}
        </SectionHead>
        <div className="mt-20 space-y-24 lg:space-y-32">
          {f.items.map((item, i) => (
            <article key={item.screen} className="grid items-center gap-10 md:grid-cols-2 lg:gap-20">
              <div data-reveal className={`mx-auto w-full max-w-[17rem] lg:max-w-[19rem] ${i % 2 ? 'md:order-2' : ''}`}>
                <div className="bp-phone-stage" style={{ animationDelay: `${-i * 2.1}s` }}>
                  <PhoneShot name={item.screen} alt={item.alt} sizes="(min-width: 1024px) 304px, (min-width: 768px) 272px, 68vw" />
                </div>
              </div>
              <div data-reveal style={delay(120)} className="space-y-5">
                <p className="bp-eyebrow">{item.eyebrow}</p>
                <h3 className="text-3xl font-bold tracking-tight text-balance text-white sm:text-[2.5rem] sm:leading-[1.1]">{item.title}</h3>
                <p className="text-lg leading-relaxed text-[var(--bp-muted)]">{item.text}</p>
                <ul className="space-y-3 pt-1">
                  {item.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[15px] leading-snug text-white/90">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bp-mint)]" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pro({ t }: { t: LandingCopy }) {
  const p = t.pro
  return (
    <section className="bp-container py-24" aria-labelledby="pro">
      <SectionHead id="pro" eyebrow={p.eyebrow} title={p.title}>
        {p.lead}
      </SectionHead>
      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        <ProCard icon={<Gamepad2 className="h-6 w-6" aria-hidden />} title={p.gamepad[0]}>
          {p.gamepad[1]}
        </ProCard>
        <ProCard icon={<Keyboard className="h-6 w-6" aria-hidden />} title={p.pc[0]} screen="pc-keyboard" alt={p.pc[2]} revealDelay={110}>
          {p.pc[1]}
        </ProCard>
        <ProCard icon={<MousePointer2 className="h-6 w-6" aria-hidden />} title={p.presenter[0]} screen="presenter" alt={p.presenter[2]} revealDelay={220}>
          {p.presenter[1]}
        </ProCard>
      </div>
      <div data-reveal className="bp-card mx-auto mt-5 max-w-none p-7">
        <h3 className="font-semibold text-white">{p.allTitle}</h3>
        <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {p.all.map((f) => (
            <li key={f} className="flex gap-3 text-[15px] leading-snug text-[var(--bp-muted)]">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bp-violet-hi)]" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ProCard({ icon, title, screen, alt, revealDelay = 0, children }: { icon: ReactNode; title: string; screen?: Screen; alt?: string; revealDelay?: number; children: ReactNode }) {
  return (
    <article data-reveal style={delay(revealDelay)} className="bp-card flex flex-col overflow-hidden">
      <div className="space-y-3 p-7">
        <span className="bp-icon-tile">{icon}</span>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-[15px] leading-relaxed text-[var(--bp-muted)]">{children}</p>
      </div>
      {screen ? (
        <div className="mt-auto h-56 overflow-hidden px-10">
          <PhoneShot name={screen} alt={alt} sizes="(min-width: 1024px) 300px, 70vw" className="mx-auto max-w-[15rem]" />
        </div>
      ) : (
        <div className="mt-auto grid h-56 place-items-center" aria-hidden>
          <GamepadArt />
        </div>
      )}
    </article>
  )
}

/** A simple drawn gamepad (the Play screenshots don't include the gamepad screen). */
function GamepadArt() {
  return (
    <svg viewBox="0 0 240 140" className="w-[78%] max-w-[17rem]">
      <defs>
        <linearGradient id="bp-pad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2a2463" />
          <stop offset="1" stopColor="#15123a" />
        </linearGradient>
      </defs>
      <path d="M58 18h124c30 0 46 26 50 62 4 36-10 54-28 54-15 0-22-12-34-26H70c-12 14-19 26-34 26-18 0-32-18-28-54 4-36 20-62 50-62Z" fill="url(#bp-pad)" stroke="rgba(255,255,255,.12)" />
      <circle cx="80" cy="84" r="17" fill="#0d0b26" stroke="rgba(255,255,255,.14)" />
      <circle cx="80" cy="84" r="8" fill="#6c5cf5" />
      <circle cx="160" cy="84" r="17" fill="#0d0b26" stroke="rgba(255,255,255,.14)" />
      <circle cx="160" cy="84" r="8" fill="#6c5cf5" />
      <g fill="rgba(255,255,255,.75)">
        <rect x="47" y="46" width="22" height="8" rx="2" />
        <rect x="54" y="39" width="8" height="22" rx="2" />
      </g>
      <circle cx="186" cy="40" r="6.5" fill="#46f0c2" />
      <circle cx="200" cy="53" r="6.5" fill="#ff7a90" />
      <circle cx="172" cy="53" r="6.5" fill="#8b7aff" />
      <circle cx="186" cy="66" r="6.5" fill="#ffc861" />
    </svg>
  )
}

function HowItWorks({ t }: { t: LandingCopy }) {
  const h = t.how
  return (
    <section id={t.ids.how} className="scroll-mt-20 border-y border-[var(--bp-line)] bg-white/[0.02] py-24" aria-labelledby="how-title">
      <div className="bp-container">
        <SectionHead id="how-title" eyebrow={h.eyebrow} title={h.title}>
          {h.lead}
        </SectionHead>
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {h.steps.map((s, i) => (
            <li key={s.title} data-reveal style={delay(i * 110)} className="bp-card relative p-7">
              <span className="bp-step-n">{i + 1}</span>
              <h3 className="mt-4 text-xl font-bold text-white">{s.title}</h3>
              <div className="mt-2 text-[15px] leading-relaxed text-[var(--bp-muted)]">{s.body}</div>
            </li>
          ))}
        </ol>
        <div data-reveal className="bp-note mx-auto mt-8 max-w-3xl">
          <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bp-mint)]" aria-hidden />
          <p>{h.note}</p>
        </div>
      </div>
    </section>
  )
}

/** A step's menu paths on the TV, one per platform. */
export function PairingPaths({ intro, paths }: { intro: string; paths: [platform: string, steps: string[], note?: string][] }) {
  return (
    <>
      <span className="block">{intro}</span>
      {paths.map(([platform, steps, note]) => (
        <span key={platform} className="mt-3 block">
          <span className="block text-sm font-semibold text-white">{platform}</span>
          <span className="block text-sm">{steps.join(' › ')}</span>
          {note && <span className="mt-1 block text-xs text-[var(--bp-faint)]">{note}</span>}
        </span>
      ))}
    </>
  )
}

function Compatibility({ t }: { t: LandingCopy }) {
  const c = t.compat
  return (
    <section id={t.ids.compat} className="bp-container scroll-mt-20 py-24" aria-labelledby="compat-title">
      <SectionHead id="compat-title" eyebrow={c.eyebrow} title={c.title}>
        {c.lead}
      </SectionHead>
      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        <CompatColumn tone="works" title={c.works[0]} items={c.works[1]} revealDelay={0} />
        <CompatColumn tone="limited" title={c.limited[0]} items={c.limited[1]} revealDelay={110} />
        <CompatColumn tone="no" title={c.no[0]} items={c.no[1]} revealDelay={220} />
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-[var(--bp-faint)]">{c.footnote}</p>
    </section>
  )
}

function CompatColumn({ tone, title, items, revealDelay }: { tone: 'works' | 'limited' | 'no'; title: string; items: Compat[]; revealDelay: number }) {
  const Icon = tone === 'works' ? Check : tone === 'limited' ? Minus : X
  const color = tone === 'works' ? 'text-[var(--bp-mint)]' : tone === 'limited' ? 'text-[#ffc861]' : 'text-[#ff8fa3]'
  return (
    <div data-reveal style={delay(revealDelay)} className={`bp-card p-7 ${tone === 'works' ? 'bp-card-glow' : ''}`}>
      <h3 className={`flex items-center gap-2 text-sm font-semibold tracking-[0.12em] uppercase ${color}`}>
        <Icon className="h-4 w-4" aria-hidden />
        {title}
      </h3>
      <ul className="mt-5 space-y-5">
        {items.map((item) => (
          <li key={item.name}>
            <span className="block font-semibold text-white">{item.name}</span>
            <span className="block text-[15px] leading-snug text-[var(--bp-muted)]">{item.note}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const PRIVACY_ICONS = [ShieldCheck, Bluetooth, Lock, Fingerprint]

function Privacy({ t }: { t: LandingCopy }) {
  const p = t.privacy
  return (
    <section className="border-y border-[var(--bp-line)] bg-white/[0.02] py-24" aria-labelledby="privacy-title">
      <div className="bp-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div data-reveal className="space-y-4">
          <p className="bp-eyebrow">{p.eyebrow}</p>
          <h2 id="privacy-title" className="text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
            {p.title}
          </h2>
          <p className="text-lg leading-relaxed text-[var(--bp-muted)]">{p.lead}</p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {p.points.map(([title, text], i) => {
            const Icon = PRIVACY_ICONS[i] ?? ShieldCheck
            return (
              <li key={title} data-reveal style={delay(i * 90)} className="bp-card p-6">
                <span className="bp-icon-tile">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-4 block font-semibold text-white">{title}</span>
                <span className="mt-1 block text-[15px] leading-snug text-[var(--bp-muted)]">{text}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/** Help for people who are stuck right now (and the guides' way into search). */
function Guides({ t }: { t: LandingCopy }) {
  const g = t.guides
  return (
    <section id={t.ids.guides} className="bp-container scroll-mt-20 pt-24" aria-labelledby="guides-title">
      <SectionHead id="guides-title" eyebrow={g.eyebrow} title={g.title}>
        {g.lead}
      </SectionHead>
      <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
        {BEAMPAD_GUIDES.map((guide, i) => (
          <li key={guide.path} data-reveal style={delay(i * 110)}>
            <a href={guide.path} {...(t.lang !== 'en' ? { hrefLang: 'en' } : {})} className="bp-card group block h-full p-6 transition-colors hover:border-[rgba(139,122,255,0.45)]">
              <span className="block text-lg font-semibold text-white">
                {guide.title}
                {g.titleSuffix}
              </span>
              <span lang="en" className="mt-1.5 block text-[15px] leading-snug text-[var(--bp-muted)]">{guide.blurb}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--bp-mint)]">
                {g.read}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Faq({ t }: { t: LandingCopy }) {
  return (
    <section id={t.ids.faq} className="bp-container scroll-mt-20 py-24" aria-labelledby="faq-title">
      <SectionHead id="faq-title" eyebrow={t.faq.eyebrow} title={t.faq.title} />
      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {t.faq.items.map(([q, a]) => (
          <details key={q} data-reveal className="bp-faq group">
            <summary>
              <span>{q}</span>
              <ChevronDown className="h-5 w-5 shrink-0 text-[var(--bp-faint)] transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function FinalCta({ t }: { t: LandingCopy }) {
  return (
    <section className="bp-container" aria-labelledby="cta-title">
      <div data-reveal className="bp-cta">
        <img src={BEAMPAD_ICON.src} width={88} height={88} alt="" className="mx-auto rounded-[22%] shadow-[0_16px_40px_-12px_rgba(108,92,245,.9)]" loading="lazy" />
        <h2 id="cta-title" className="mx-auto mt-7 max-w-2xl text-3xl font-bold tracking-tight text-balance text-white sm:text-5xl">
          {t.cta.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--bp-muted)]">{t.cta.lead}</p>
        <div className="mt-8 flex justify-center">
          <PlayBadge placement="final" page={t.page} lang={t.lang} height={60} />
        </div>
        <p className="mt-6 text-sm text-[var(--bp-faint)]">{t.cta.languages}</p>
      </div>
    </section>
  )
}
