// /beampad/lost-firestick-remote-no-wifi: a guide for one of the most
// searched remote problems that the usual answer cannot fix.
//
// "lost firestick remote and no wifi / new wifi / not connected to wifi":
// the Fire TV app needs the phone and the Fire TV on one network, and the
// pages ranking for these searches (Nov 2026) offered a hotspot trick and
// replacement remotes, some with conflicting button combinations. This page
// gives every fix that works, in the order to try them, says which situation
// each one is for, and is open that BeamPad (ours) cannot do the first pairing
// on its own. Steps follow Amazon's and Google's help pages.
import { createFileRoute } from '@tanstack/react-router'
import { Check, ChevronDown, Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { BeamPadFooter, BeamPadHeader, PlayBadge } from '@/components/beampad/BeamPad'
import { Aurora, BeamPadMotion } from '@/components/beampad/Motion'
import { BEAMPAD, BEAMPAD_OG_IMAGE, beampadPublisher } from '@/content/beampad'
import { Breadcrumbs } from '@/components/public/Breadcrumbs'
import { PUBLIC_PAGES, absoluteUrl, breadcrumbJsonLd, faqJsonLd, indexablePageTags } from '@/lib/seo'

const PATH = '/beampad/lost-firestick-remote-no-wifi'
const PAGE = PUBLIC_PAGES[PATH]
const PAGE_ID = 'lost_firestick_remote'
const PUBLISHED = '2026-11-26'
const TRAIL: [string, string][] = [
  ['BeamPad', '/beampad'],
  ['Lost Firestick remote, no Wi-Fi', PATH],
]

const FAQ: [question: string, answer: string][] = [
  [
    'Can I use the Fire TV app without Wi-Fi?',
    'No. The Amazon Fire TV app reaches the Fire TV over a network that both are on. A phone hotspot counts as one, which is why recreating your old Wi-Fi with a hotspot works.',
  ],
  [
    'Can I pair a new Fire TV remote without the old one?',
    'Yes. A new Amazon remote usually pairs as soon as you put batteries in. If it doesn’t, Amazon’s instructions are to press and hold Home for 10 seconds near the Fire TV.',
  ],
  [
    'Will a phone app that acts as a Bluetooth keyboard work straight away?',
    'Not for the first time. Bluetooth keyboards, including phone apps such as BeamPad, are paired in the Fire TV’s own settings, so you need a way to get there once. After that it works with or without Wi-Fi.',
  ],
  [
    'Do I need to reset the Fire TV?',
    'Usually not. A reset wipes your apps and sign-ins and still leaves you needing a remote for setup. Try the fixes on this page first.',
  ],
]

export const Route = createFileRoute('/beampad/lost-firestick-remote-no-wifi')({
  ssr: true, // prerendered to static HTML at build time
  head: () => {
    const tags = indexablePageTags({
      path: PATH,
      title: PAGE.title,
      description: PAGE.description,
      image: BEAMPAD_OG_IMAGE,
      type: 'article',
      publishedAt: PUBLISHED,
      modifiedAt: PAGE.lastmod,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Lost your Firestick remote and it’s not on Wi-Fi? Here’s what works',
          description: PAGE.description,
          image: BEAMPAD_OG_IMAGE,
          datePublished: PUBLISHED,
          dateModified: PAGE.lastmod,
          mainEntityOfPage: absoluteUrl(PATH),
          author: beampadPublisher(),
          publisher: beampadPublisher(),
        },
        breadcrumbJsonLd(TRAIL),
        faqJsonLd(FAQ),
      ],
    })
    return { ...tags, meta: [...tags.meta, { name: 'theme-color', content: '#0b0921' }, { property: 'og:site_name', content: 'BeamPad' }] }
  },
  component: LostFirestickRemote,
})

const Path = ({ steps }: { steps: string[] }) => <span className="bp-path">{steps.join(' › ')}</span>

function LostFirestickRemote() {
  return (
    <div className="bp bp-calm">
      <Aurora />
      <BeamPadMotion />
      <a href="#main-content" className="bp-skip">Skip to content</a>
      <BeamPadHeader page={PAGE_ID} />
      <main id="main-content" className="bp-container relative z-[1] pt-10">
        <article className="mx-auto max-w-3xl">
          <header className="space-y-5">
            <Breadcrumbs trail={TRAIL} tone="dark" />
            <h1 className="text-4xl leading-[1.1] font-extrabold tracking-[-0.03em] text-balance text-white sm:text-5xl">
              Lost your Firestick remote and it’s not on Wi-Fi? Here’s what works
            </h1>
            <p className="text-sm text-[var(--bp-faint)]">
              By {BEAMPAD.developer}, the makers of BeamPad · Updated 26 November 2026 · Steps checked against Amazon’s Fire TV help
            </p>
          </header>

          <div data-reveal className="bp-card bp-card-glow mt-8 p-6 sm:p-7">
            <h2 className="text-sm font-semibold tracking-[0.12em] text-[var(--bp-mint)] uppercase">The short answer</h2>
            <p className="mt-3 text-[1.075rem] leading-relaxed text-white">
              If the Fire TV is still on your home Wi-Fi, the free Amazon Fire TV app on your phone is the quickest fix. If it isn’t, because
              of a new router, a new password or a move, the app can’t find it. Then use your TV’s own remote through HDMI-CEC, recreate the
              old network with a hotspot, plug in a USB mouse, or get a replacement remote. Once you can move around again, pair your phone as a
              Bluetooth keyboard so it never happens twice.
            </p>
          </div>

          <nav aria-label="On this page" className="mt-8 text-[15px]">
            <p className="font-semibold text-white">On this page</p>
            <ol className="mt-2 grid gap-1 text-[var(--bp-muted)] sm:grid-cols-2">
              {[
                ['Why the Fire TV app can’t help', '#why'],
                ['1. Your TV’s own remote', '#hdmi-cec'],
                ['2. A hotspot with the old Wi-Fi name', '#hotspot'],
                ['3. A USB mouse or keyboard', '#usb'],
                ['4. A replacement remote', '#replacement'],
                ['5. Make your phone the remote', '#phone'],
                ['Which fix for your situation', '#which'],
                ['Questions', '#questions'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="inline-flex min-h-8 items-center hover:text-white">{label}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="bp-prose mt-6">
            <h2 id="why">Why the Fire TV app can’t help right now</h2>
            <p>
              The Amazon Fire TV app finds your Fire TV over your home network, so the phone and the Fire TV have to be on the same Wi-Fi. When
              the Fire TV has lost its network, because the router or password changed or you moved house, the app has nothing to connect to.
              And joining a new network normally takes a remote. That is the loop you are stuck in.
            </p>
            <p>
              <strong>If the Fire TV is still on your Wi-Fi</strong>, you don’t need the rest of this page: install the Fire TV app, put your
              phone on the same network, and enter the code that appears on the TV.
            </p>

            <h2 id="hdmi-cec">1. Use your TV’s own remote (HDMI-CEC)</h2>
            <p>
              Most TVs made in the last decade can pass their remote’s buttons to whatever is plugged into them, through a feature called
              HDMI-CEC. Every brand gives it its own name:
            </p>
            <ul>
              <li><strong>Samsung:</strong> Anynet+</li>
              <li><strong>LG:</strong> SimpLink</li>
              <li><strong>Sony:</strong> Bravia Sync</li>
              <li><strong>Philips:</strong> EasyLink</li>
              <li><strong>Panasonic:</strong> VIERA Link</li>
            </ul>
            <p>
              Turn it on in the TV’s settings, switch to the Fire TV’s input and try the arrows and OK on the TV remote. On the Fire TV the
              matching setting, <Path steps={['Settings', 'Display & Sounds', 'HDMI CEC Device Control']} />, is normally already on. Not every
              TV passes every button, but arrows, OK and Back are enough to reach <Path steps={['Settings', 'Network']} /> and join your new
              Wi-Fi.
            </p>

            <h2 id="hotspot">2. Recreate your old Wi-Fi with a hotspot</h2>
            <p>
              The Fire TV still remembers the network it used to be on. If you know that network’s exact name and password, you can bring it
              back for a few minutes:
            </p>
            <ol>
              <li>On a second phone or a laptop, set up a hotspot with exactly the old name and password. Both are case-sensitive.</li>
              <li>Wait for the Fire TV to join it by itself.</li>
              <li>Connect your own phone to the same hotspot, open the Fire TV app and enter the code on the TV.</li>
              <li>
                In the app, go to <Path steps={['Settings', 'Network']} /> and join your new Wi-Fi. The app disconnects when the Fire TV
                changes network: put your phone on the new Wi-Fi and reconnect.
              </li>
            </ol>
            <p>This only works if you know the old network’s name and password. If you don’t, try fix 1 or fix 3.</p>

            <h2 id="usb">3. Plug in a USB mouse or keyboard</h2>
            <p>
              A Fire TV Stick has one port, which also powers it, so you need an OTG adapter with a separate power input. They are sold as
              “OTG cable for Fire TV” or “OTG adapter with power”; check whether your stick’s port is micro-USB or USB-C before you buy. Plug
              the power into the adapter, then a USB mouse or keyboard. A mouse gives you a pointer, and a keyboard’s arrow keys and Enter
              move around the menus.
            </p>

            <h2 id="replacement">4. Get a replacement remote</h2>
            <p>
              A new Amazon remote usually pairs as soon as you put the batteries in. If it doesn’t, Amazon’s instructions are to press and hold
              Home for 10 seconds near the Fire TV. If you buy another brand, make sure it says it works with your Fire TV model, because a
              Fire TV Stick is controlled over Bluetooth, not infrared.
            </p>

            <h2 id="phone">5. Make your phone the remote that never needs Wi-Fi</h2>
            <p>
              Once you can move around the Fire TV again, with any of the fixes above, pair your phone as a Bluetooth keyboard and mouse.
              Then you have a remote that works whether the Fire TV is online or not, and you can type the new Wi-Fi password with your
              phone’s keyboard instead of the on-screen one.
            </p>
            <p>We make an app for this, BeamPad. To set it up:</p>
            <ol>
              <li>Install BeamPad on your Android phone ({BEAMPAD.minAndroid} or newer). It’s free with ads.</li>
              <li>
                On the Fire TV, open{' '}
                <Path steps={['Settings', 'Controllers & Bluetooth Devices', 'Other Bluetooth Devices', 'Add Bluetooth Devices']} />.
              </li>
              <li>Follow BeamPad’s steps to connect, and confirm the pairing on the TV.</li>
              <li>
                Still need to fix the Wi-Fi? Go to <Path steps={['Settings', 'Network']} />, choose your network and type the password on
                your phone.
              </li>
            </ol>
          </div>

          <div className="bp-note mt-8">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bp-mint)]" aria-hidden />
            <p>
              BeamPad can’t do the very first pairing by itself: that happens in the Fire TV’s settings, so you need one of fixes 1 to 4 to get
              there. Pair it while you still have a remote and there is nothing to fix next time.
            </p>
          </div>

          <div className="bp-card mt-8 flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:p-7">
            <img src="/img/beampad/icon-192.webp" width={64} height={64} alt="" loading="lazy" className="rounded-[22%]" />
            <div className="flex-1">
              <p className="font-semibold text-white">BeamPad: TV keyboard, mouse and remote</p>
              <p className="mt-1 text-[15px] leading-snug text-[var(--bp-muted)]">Bluetooth, no Wi-Fi, nothing to install on the TV. Free on Google Play.</p>
            </div>
            <PlayBadge placement="guide_fix5" page={PAGE_ID} height={48} />
          </div>

          <section className="bp-prose mt-6" aria-labelledby="which">
            <h2 id="which">Which fix for your situation</h2>
          </section>
          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--bp-line)]">
            <table className="w-full border-collapse text-left text-[15px]">
              <thead className="bg-white/[0.04] text-white">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Your situation</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Try this</th>
                </tr>
              </thead>
              <tbody className="text-[var(--bp-muted)]">
                <Row situation="The Fire TV is still on your Wi-Fi">The Amazon Fire TV app</Row>
                <Row situation="New router, new password or a move">Your TV’s own remote (fix 1), then join the new Wi-Fi</Row>
                <Row situation="You know the old Wi-Fi name and password">A hotspot with the same name (fix 2)</Row>
                <Row situation="No HDMI-CEC and the old network is unknown">A USB mouse or keyboard (fix 3), or a new remote (fix 4)</Row>
                <Row situation="You never want to be stuck again">Pair your phone as a Bluetooth keyboard now (fix 5)</Row>
              </tbody>
            </table>
          </div>

          <section className="mt-16" aria-labelledby="questions">
            <h2 id="questions" className="scroll-mt-20 text-[1.75rem] font-bold tracking-tight text-white">Questions</h2>
            <div className="mt-6 space-y-3">
              {FAQ.map(([q, a]) => (
                <details key={q} className="bp-faq group">
                  <summary>
                    <span>{q}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-[var(--bp-faint)] transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </section>

          <div data-reveal className="bp-cta mt-16">
            <h2 className="mx-auto max-w-xl text-2xl font-bold tracking-tight text-balance text-white sm:text-4xl">
              Pair a backup remote you can’t lose
            </h2>
            <ul className="mx-auto mt-6 flex max-w-xl flex-col gap-2 text-left text-[15px] text-[var(--bp-muted)] sm:items-center">
              {['Works with Wi-Fi off', 'Keyboard, mouse and remote', 'Nothing to install on the Fire TV'].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--bp-mint)]" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-center">
              <PlayBadge placement="guide_final" page={PAGE_ID} height={56} />
            </div>
            <p className="mt-5 text-sm">
              <a href="/beampad#compatibility" className="text-white/80 underline underline-offset-4 hover:text-white">See what BeamPad works with</a>
            </p>
          </div>
        </article>
      </main>
      <BeamPadFooter page={PAGE_ID} />
    </div>
  )
}

function Row({ situation, children }: { situation: string; children: ReactNode }) {
  return (
    <tr className="border-t border-[var(--bp-line)] align-top">
      <th scope="row" className="px-5 py-4 font-medium text-white">{situation}</th>
      <td className="px-5 py-4">{children}</td>
    </tr>
  )
}
