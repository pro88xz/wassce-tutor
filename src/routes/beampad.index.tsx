// /beampad: BeamPad's landing page. BeamPad is the studio's Android app that
// makes a phone a Bluetooth keyboard, mouse and remote for a TV.
//
// Written for one search intent the usual answers miss: typing on, or
// controlling, a TV from a phone when the phone and TV are not on the same
// Wi-Fi network (the Google TV, Fire TV and TV makers' apps all need one). It
// says plainly which TVs it does not work with, so the people who install it
// are the people it works for. Every claim comes from src/content/beampad.ts.
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  Bluetooth,
  Check,
  ChevronDown,
  Fingerprint,
  Gamepad2,
  Keyboard,
  KeyRound,
  Lock,
  Minus,
  MousePointer2,
  ShieldCheck,
  Tv,
  WifiOff,
  X,
} from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { AppLink, BeamPadFooter, BeamPadHeader, PhoneShot, PlayBadge, SectionHead } from '@/components/beampad/BeamPad'
import { Aurora, BeamPadMotion, HeroBeam, TypedSearch } from '@/components/beampad/Motion'
import {
  BEAMPAD,
  BEAMPAD_GUIDES,
  BEAMPAD_OG_IMAGE,
  COMPATIBILITY,
  LANDING_FAQ,
  PAIRING_PATHS,
  PRO_FEATURES,
  beampadAppJsonLd,
  type Screen,
} from '@/content/beampad'
import { PUBLIC_PAGES, breadcrumbJsonLd, faqJsonLd, indexablePageTags } from '@/lib/seo'

const PATH = '/beampad'
const PAGE = PUBLIC_PAGES[PATH]

export const Route = createFileRoute('/beampad/')({
  ssr: true, // prerendered to static HTML at build time
  head: () => {
    const tags = indexablePageTags({
      path: PATH,
      title: PAGE.title,
      description: PAGE.description,
      ogTitle: PAGE.ogTitle,
      image: BEAMPAD_OG_IMAGE,
      jsonLd: [beampadAppJsonLd(), breadcrumbJsonLd([['BeamPad', PATH]]), faqJsonLd(LANDING_FAQ)],
    })
    return {
      ...tags,
      meta: [...tags.meta, { name: 'theme-color', content: '#0b0921' }, { property: 'og:site_name', content: 'BeamPad' }],
      links: [...tags.links, { rel: 'icon', type: 'image/png', href: '/img/beampad/icon-512.png' }],
    }
  },
  component: BeamPadLanding,
})

function BeamPadLanding() {
  return (
    <div className="bp">
      <Aurora />
      <BeamPadMotion />
      <a href="#main-content" className="bp-skip">Skip to content</a>
      <BeamPadHeader />
      <main id="main-content" className="relative z-[1]">
        <Hero />
        <ProofStrip />
        <WhyBluetooth />
        <Features />
        <Pro />
        <HowItWorks />
        <Compatibility />
        <Privacy />
        <Guides />
        <Faq />
        <FinalCta />
      </main>
      <BeamPadFooter />
    </div>
  )
}

function Hero() {
  return (
    <section className="bp-container grid items-center gap-8 pt-8 pb-16 sm:gap-14 sm:pt-14 lg:grid-cols-[1.02fr_1fr] lg:gap-10 lg:pt-20 lg:pb-24">
      <div className="space-y-6 sm:space-y-7">
        <p className="bp-chip" data-reveal>
          <Bluetooth className="h-4 w-4 text-[var(--bp-mint)]" aria-hidden />
          Bluetooth keyboard, mouse & remote for Android
        </p>
        <h1 data-reveal style={delay(80)} className="text-[2.6rem] leading-[1.04] font-extrabold tracking-[-0.035em] text-balance text-white sm:text-6xl lg:text-[4.1rem]">
          Type on your TV from your phone. <span className="bp-gradient-text">No Wi-Fi needed.</span>
        </h1>
        <p data-reveal style={delay(160)} className="max-w-xl text-lg leading-relaxed text-pretty text-[var(--bp-muted)] sm:text-xl">
          BeamPad connects your Android phone to your TV over Bluetooth, as a keyboard, a mouse and a remote. Nothing to install on the TV, no
          shared network, no account.
        </p>
        <div data-reveal style={delay(240)} className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <PlayBadge placement="hero" height={58} />
          <a href="#compatibility" className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-white/90 hover:text-white">
            Check your TV first
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>
        <p data-reveal style={delay(300)} className="text-sm text-[var(--bp-faint)]">
          Free with ads · {BEAMPAD.minAndroid} or newer · Google TV, Android TV and Fire TV
        </p>
      </div>
      <HeroVisual />
    </section>
  )
}

const TV_KEYS = 'abcdefghijklmnopqrstuvwxyz'.split('')

/** What the TV's search box types, in turn (the first is in the static HTML). */
const SEARCHES = ['cooking shows', 'lo-fi beats', 'stand-up comedy', 'tech reviews']

/** A reveal delay for staggered entrances (src/components/beampad/Motion.tsx). */
const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

/** A TV searching for what the phone typed, with the phone in front: decorative, the text says the same. */
function HeroVisual() {
  return (
    <div data-reveal style={delay(200)} className="bp-hero-visual relative mx-auto w-full max-w-[36rem] pt-[8%] pb-[14%] lg:max-w-none">
      <div className="bp-tv" aria-hidden>
        <div className="flex h-full flex-col gap-[6%] p-[6%]">
          <div className="bp-tv-search">
            <svg viewBox="0 0 24 24" className="h-[1.1em] w-[1.1em] shrink-0 text-white/70" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <TypedSearch words={SEARCHES} />
            <span className="bp-caret" />
          </div>
          <span className="bp-tv-chip">Typed from your phone</span>
          <div className="bp-tv-keys">
            {TV_KEYS.map((k) => (
              <span key={k} className={k === 'k' ? 'is-focus' : undefined}>
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="bp-tv-stand" aria-hidden />
      <HeroBeam />
      <div className="absolute right-0 bottom-0 w-[31%] max-w-[13.5rem]">
        <PhoneShot name="keyboard" eager sizes="(min-width: 1024px) 216px, 31vw" />
      </div>
    </div>
  )
}

function ProofStrip() {
  const items: [icon: ReactNode, title: string, text: string][] = [
    [<WifiOff key="w" className="h-5 w-5" aria-hidden />, 'No Wi-Fi', 'Pairs over Bluetooth, like a wireless keyboard'],
    [<Tv key="t" className="h-5 w-5" aria-hidden />, 'Nothing on the TV', 'No TV app to install, no account to create'],
    [<ShieldCheck key="s" className="h-5 w-5" aria-hidden />, 'No data collected', 'As declared in Google Play’s Data safety'],
    [<Keyboard key="k" className="h-5 w-5" aria-hidden />, 'Your own keyboard', 'Autocorrect, swipe and voice, as on your phone'],
  ]
  return (
    <section aria-label="Why BeamPad" className="border-y border-[var(--bp-line)] bg-white/[0.02]">
      <ul className="bp-container grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([icon, title, text], i) => (
          <li key={title} data-reveal style={delay(i * 90)} className="flex gap-3.5">
            <span className="bp-icon-tile">{icon}</span>
            <span>
              <span className="block font-semibold text-white">{title}</span>
              <span className="block text-sm leading-snug text-[var(--bp-muted)]">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function WhyBluetooth() {
  const wifiApps = [
    'Your phone and TV must be on the same Wi-Fi network',
    'Stop working when the TV is offline or on a new router',
    'Often fail on guest and hotel networks that keep devices apart',
    'Need the TV maker’s own app, one per brand',
  ]
  const beampad = [
    'Pairs with the TV directly, the way a Bluetooth keyboard does',
    'Keeps working with Wi-Fi switched off',
    'Doesn’t care which network anything is on',
    'One app for Google TV, Android TV, Fire TV and computers',
  ]
  return (
    <section className="bp-container py-24" aria-labelledby="why">
      <SectionHead id="why" eyebrow="Why Bluetooth" title="Most phone remotes need your Wi-Fi. BeamPad doesn’t.">
        Google TV, Fire TV and TV makers’ remote apps find the TV over your home network. When the TV isn’t on it, they can’t see it.
      </SectionHead>
      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
        <div data-reveal className="bp-card p-7">
          <h3 className="text-sm font-semibold tracking-[0.12em] text-[var(--bp-faint)] uppercase">Wi-Fi remote apps</h3>
          <ul className="mt-5 space-y-3.5">
            {wifiApps.map((t) => (
              <li key={t} className="flex gap-3 text-[15px] leading-snug text-[var(--bp-muted)]">
                <Minus className="mt-0.5 h-5 w-5 shrink-0 text-white/30" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal style={delay(120)} className="bp-card bp-card-glow p-7">
          <h3 className="text-sm font-semibold tracking-[0.12em] text-[var(--bp-mint)] uppercase">BeamPad</h3>
          <ul className="mt-5 space-y-3.5">
            {beampad.map((t) => (
              <li key={t} className="flex gap-3 text-[15px] leading-snug text-white">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bp-mint)]" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

const FEATURES: { screen: Screen; eyebrow: string; title: string; text: string; points: string[] }[] = [
  {
    screen: 'keyboard',
    eyebrow: 'Keyboard',
    title: 'Stop hunting for letters with a D-pad',
    text: 'Type searches, passwords and web addresses with the keyboard already on your phone. Whatever it does, the TV gets.',
    points: ['Autocorrect, swipe and voice input, depending on your keyboard', 'Enter, Tab, Esc, arrows and Backspace on hand', 'Works in search boxes, logins and web addresses'],
  },
  {
    screen: 'remote',
    eyebrow: 'Remote',
    title: 'The whole remote, on your phone',
    text: 'A D-pad with OK, Back and Home, plus volume, mute and channels where your TV supports them.',
    points: ['Play, pause, skip, search and a number pad', 'Media controls in the notification, a Quick Settings tile and a home-screen widget', 'Handy when the real remote is down the back of the sofa'],
  },
  {
    screen: 'trackpad',
    eyebrow: 'Trackpad',
    title: 'A cursor for the apps that need one',
    text: 'TV browsers and apps that were never made for a remote are easy with a pointer. Move it with your thumb and tap to click.',
    points: ['Tap to click, two fingers to scroll where supported', 'Left and right click', 'Works in compatible browsers, settings and apps'],
  },
  {
    screen: 'snippets',
    eyebrow: 'Snippets',
    title: 'Log in to the TV in one tap',
    text: 'Save the Wi-Fi password, streaming logins and anything you type often, then send it to the TV with one tap.',
    points: ['Encrypted with a key in your phone’s secure hardware', 'Left out of cloud backups', 'Protected snippets ask for your fingerprint or PIN'],
  },
]

function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-[linear-gradient(180deg,transparent,rgba(108,92,245,0.06)_30%,transparent)] py-24" aria-labelledby="features-title">
      <div className="bp-container">
        <SectionHead id="features-title" eyebrow="What it does" title="Keyboard, mouse and remote in one app">
          Switch between them with one tap at the top of the screen. The TV sees one ordinary Bluetooth device.
        </SectionHead>
        <div className="mt-20 space-y-24 lg:space-y-32">
          {FEATURES.map((f, i) => (
            <article key={f.screen} className="grid items-center gap-10 md:grid-cols-2 lg:gap-20">
              <div data-reveal className={`mx-auto w-full max-w-[17rem] lg:max-w-[19rem] ${i % 2 ? 'md:order-2' : ''}`}>
                <div className="bp-phone-stage" style={{ animationDelay: `${-i * 2.1}s` }}>
                  <PhoneShot name={f.screen} sizes="(min-width: 1024px) 304px, (min-width: 768px) 272px, 68vw" />
                </div>
              </div>
              <div data-reveal style={delay(120)} className="space-y-5">
                <p className="bp-eyebrow">{f.eyebrow}</p>
                <h3 className="text-3xl font-bold tracking-tight text-balance text-white sm:text-[2.5rem] sm:leading-[1.1]">{f.title}</h3>
                <p className="text-lg leading-relaxed text-[var(--bp-muted)]">{f.text}</p>
                <ul className="space-y-3 pt-1">
                  {f.points.map((p) => (
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

function Pro() {
  return (
    <section className="bp-container py-24" aria-labelledby="pro">
      <SectionHead id="pro" eyebrow="BeamPad Pro" title="For gaming, work and presenting">
        Monthly, yearly or lifetime. Or watch one ad and use every Pro feature for 24 hours.
      </SectionHead>
      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        <ProCard icon={<Gamepad2 className="h-6 w-6" aria-hidden />} title="A gamepad for Android TV and PC">
          Two analog sticks, a D-pad, A, B, X and Y, bumpers, analog triggers and stick clicks, with tilt steering and Xbox, PlayStation or
          Nintendo button labels. For compatible games and emulators.
        </ProCard>
        <ProCard icon={<Keyboard className="h-6 w-6" aria-hidden />} title="A full PC keyboard" screen="pc-keyboard" revealDelay={110}>
          F1 to F12, Ctrl, Alt and Windows shortcuts, macros and an app launcher, for the computer across the room.
        </ProCard>
        <ProCard icon={<MousePointer2 className="h-6 w-6" aria-hidden />} title="A presentation remote" screen="presenter" revealDelay={220}>
          Next and previous slide, a laser pointer, black screen and a timer, from your pocket.
        </ProCard>
      </div>
      <div data-reveal className="bp-card mx-auto mt-5 max-w-none p-7">
        <h3 className="font-semibold text-white">Everything in Pro</h3>
        <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {PRO_FEATURES.map((f) => (
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

function ProCard({ icon, title, screen, revealDelay = 0, children }: { icon: ReactNode; title: string; screen?: Screen; revealDelay?: number; children: ReactNode }) {
  return (
    <article data-reveal style={delay(revealDelay)} className="bp-card flex flex-col overflow-hidden">
      <div className="space-y-3 p-7">
        <span className="bp-icon-tile">{icon}</span>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-[15px] leading-relaxed text-[var(--bp-muted)]">{children}</p>
      </div>
      {screen ? (
        <div className="mt-auto h-56 overflow-hidden px-10">
          <PhoneShot name={screen} sizes="(min-width: 1024px) 300px, 70vw" className="mx-auto max-w-[15rem]" />
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

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-[var(--bp-line)] bg-white/[0.02] py-24" aria-labelledby="how-title">
      <div className="bp-container">
        <SectionHead id="how-title" eyebrow="How it works" title="Pair once, in the TV’s own settings">
          Your phone joins the TV the same way a wireless keyboard would. It takes about a minute.
        </SectionHead>
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          <Step n={1} title="Install BeamPad" revealDelay={0}>
            Get it free from <AppLink placement="how_install">Google Play</AppLink> on your Android phone ({BEAMPAD.minAndroid} or newer) and turn on Bluetooth.
          </Step>
          <Step n={2} title="Open pairing on the TV" revealDelay={110}>
            <span className="block">Go to the TV’s Bluetooth pairing screen:</span>
            {PAIRING_PATHS.map(([platform, steps]) => (
              <span key={platform} className="mt-3 block">
                <span className="block text-sm font-semibold text-white">{platform}</span>
                <span className="block text-sm">{steps.join(' › ')}</span>
              </span>
            ))}
          </Step>
          <Step n={3} title="Connect and type" revealDelay={220}>
            Follow BeamPad’s on-screen steps to connect, and confirm the pairing on the TV. After that, BeamPad remembers the TV.
          </Step>
        </ol>
        <div data-reveal className="bp-note mx-auto mt-8 max-w-3xl">
          <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bp-mint)]" aria-hidden />
          <p>
            You need a way to move around the TV for that one pairing step: its remote, or the TV’s own remote through HDMI-CEC. Already lost
            the remote?{' '}
            <a href="/beampad/lost-firestick-remote-no-wifi" className="font-semibold text-white underline decoration-[var(--bp-mint)] underline-offset-4">
              What to do when the Firestick remote is gone and there’s no Wi-Fi
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}

function Step({ n, title, revealDelay, children }: { n: number; title: string; revealDelay: number; children: ReactNode }) {
  return (
    <li data-reveal style={delay(revealDelay)} className="bp-card relative p-7">
      <span className="bp-step-n">{n}</span>
      <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
      <div className="mt-2 text-[15px] leading-relaxed text-[var(--bp-muted)]">{children}</div>
    </li>
  )
}

function Compatibility() {
  return (
    <section id="compatibility" className="bp-container scroll-mt-20 py-24" aria-labelledby="compat-title">
      <SectionHead id="compat-title" eyebrow="Compatibility" title="Will it work with your TV?">
        If your TV accepts a Bluetooth keyboard, it accepts BeamPad. Here is where that is true, and where it isn’t.
      </SectionHead>
      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        <CompatColumn tone="works" title="Works" items={COMPATIBILITY.works} revealDelay={0} />
        <CompatColumn tone="limited" title="Depends on the model" items={COMPATIBILITY.limited} revealDelay={110} />
        <CompatColumn tone="no" title="Not compatible" items={COMPATIBILITY.no} revealDelay={220} />
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-[var(--bp-faint)]">
        Some phone makers switch off the Bluetooth feature that lets a phone act as a keyboard. The free version is the quickest way to check
        yours.
      </p>
    </section>
  )
}

function CompatColumn({ tone, title, items, revealDelay }: { tone: 'works' | 'limited' | 'no'; title: string; items: { name: string; note: string }[]; revealDelay: number }) {
  const Icon = tone === 'works' ? Check : tone === 'limited' ? Minus : X
  const color = tone === 'works' ? 'text-[var(--bp-mint)]' : tone === 'limited' ? 'text-[#ffc861]' : 'text-[#ff8fa3]'
  return (
    <div data-reveal style={delay(revealDelay)} className={`bp-card p-7 ${tone === 'works' ? 'bp-card-glow' : ''}`}>
      <h3 className={`flex items-center gap-2 text-sm font-semibold tracking-[0.12em] uppercase ${color}`}>
        <Icon className="h-4 w-4" aria-hidden />
        {title}
      </h3>
      <ul className="mt-5 space-y-5">
        {items.map((c) => (
          <li key={c.name}>
            <span className="block font-semibold text-white">{c.name}</span>
            <span className="block text-[15px] leading-snug text-[var(--bp-muted)]">{c.note}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Privacy() {
  const points: [icon: ReactNode, title: string, text: string][] = [
    [<ShieldCheck key="a" className="h-5 w-5" aria-hidden />, 'No data collected or shared', 'That is what BeamPad declares in its Google Play Data safety section.'],
    [<Bluetooth key="b" className="h-5 w-5" aria-hidden />, 'Phone to TV, nothing in between', 'What you type travels over the paired Bluetooth connection, not through a server.'],
    [<Lock key="c" className="h-5 w-5" aria-hidden />, 'Snippets stay locked', 'Encrypted with a key in your phone’s secure hardware and kept out of cloud backups.'],
    [<Fingerprint key="d" className="h-5 w-5" aria-hidden />, 'Ads never see your typing', 'The free version shows ads, and they cannot reach your snippets or what you type.'],
  ]
  return (
    <section className="border-y border-[var(--bp-line)] bg-white/[0.02] py-24" aria-labelledby="privacy-title">
      <div className="bp-container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div data-reveal className="space-y-4">
          <p className="bp-eyebrow">Privacy</p>
          <h2 id="privacy-title" className="text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
            Built to be trusted with your passwords
          </h2>
          <p className="text-lg leading-relaxed text-[var(--bp-muted)]">
            A keyboard sees everything you type, so BeamPad is built to keep it to itself. Read the{' '}
            <a href={BEAMPAD.privacyUrl} target="_blank" rel="noopener" className="font-semibold text-white underline decoration-[var(--bp-mint)] underline-offset-4">
              privacy policy
            </a>
            .
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {points.map(([icon, title, text], i) => (
            <li key={title} data-reveal style={delay(i * 90)} className="bp-card p-6">
              <span className="bp-icon-tile">{icon}</span>
              <span className="mt-4 block font-semibold text-white">{title}</span>
              <span className="mt-1 block text-[15px] leading-snug text-[var(--bp-muted)]">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Help for people who are stuck right now (and the guides' way into search). */
function Guides() {
  return (
    <section id="guides" className="bp-container scroll-mt-20 pt-24" aria-labelledby="guides-title">
      <SectionHead id="guides-title" eyebrow="Guides" title="Lost the remote and the Wi-Fi changed?">
        Step-by-step fixes for when the phone apps can’t find your TV, whether or not you use BeamPad.
      </SectionHead>
      <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
        {BEAMPAD_GUIDES.map((g, i) => (
          <li key={g.path} data-reveal style={delay(i * 110)}>
            <a href={g.path} className="bp-card group block h-full p-6 transition-colors hover:border-[rgba(139,122,255,0.45)]">
              <span className="block text-lg font-semibold text-white">{g.title}</span>
              <span className="mt-1.5 block text-[15px] leading-snug text-[var(--bp-muted)]">{g.blurb}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--bp-mint)]">
                Read the guide
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Faq() {
  return (
    <section id="faq" className="bp-container scroll-mt-20 py-24" aria-labelledby="faq-title">
      <SectionHead id="faq-title" eyebrow="Questions" title="Before you install" />
      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {LANDING_FAQ.map(([q, a]) => (
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

function FinalCta() {
  return (
    <section className="bp-container" aria-labelledby="cta-title">
      <div data-reveal className="bp-cta">
        <img src="/img/beampad/icon-192.webp" width={88} height={88} alt="" className="mx-auto rounded-[22%] shadow-[0_16px_40px_-12px_rgba(108,92,245,.9)]" loading="lazy" />
        <h2 id="cta-title" className="mx-auto mt-7 max-w-2xl text-3xl font-bold tracking-tight text-balance text-white sm:text-5xl">
          The best keyboard in the room is already in your pocket
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--bp-muted)]">Free on Google Play. Pair once and type.</p>
        <div className="mt-8 flex justify-center">
          <PlayBadge placement="final" height={60} />
        </div>
        <p className="mt-6 text-sm text-[var(--bp-faint)]">Available in {BEAMPAD.languages.join(', ').replace(/, ([^,]*)$/, ' and $1')}.</p>
      </div>
    </section>
  )
}
