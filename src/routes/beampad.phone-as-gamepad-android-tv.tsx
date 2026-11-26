// /beampad/phone-as-gamepad-android-tv: how to use a phone as a game
// controller for Android TV or Google TV.
//
// "how to use phone as gamepad for android tv", "phone as controller for
// android tv / google tv / smart tv": YouTube videos on this get 300K to 1M
// views, and almost nothing written answers it. The page compares every way
// honestly: a Bluetooth gamepad app (the phone pairs as a controller; no TV
// app, no Wi-Fi), Wi-Fi gamepad apps (a receiver app on the TV, a shared
// network), a real controller (best for fast games), and Google's own phone
// gamepad, which a Google TV app teardown found in Sept 2026 but which has not
// launched. BeamPad's gamepad is a Pro feature for Android TV and PC (per its
// Play listing), and the page says so. Built from src/components/beampad/Guide.tsx.
import { createFileRoute } from '@tanstack/react-router'
import { AppCard, CompareTable, GuideCta, GuideFaq, GuidePage, Note, OnThisPage, Path, ShortAnswer, YesNo } from '@/components/beampad/Guide'
import { AppLink } from '@/components/beampad/BeamPad'
import { guideHead, type Trail } from '@/content/beampad-guide-head'
import { BEAMPAD } from '@/content/beampad'

const PATH = '/beampad/phone-as-gamepad-android-tv'
const PAGE_ID = 'phone_gamepad'
const PUBLISHED = '2026-11-26'
const TITLE = 'How to use your phone as a gamepad for Android TV'
const TRAIL: Trail = [
  ['BeamPad', '/beampad'],
  ['Phone as a gamepad for Android TV', PATH],
]
const PAIR_ACCESSORY = ['Settings', 'Remotes & Accessories', 'Pair remote or accessory']

const FAQ: [question: string, answer: string][] = [
  [
    'Can I use my phone as a controller on Google TV without installing anything on the TV?',
    'Yes, with a Bluetooth gamepad app: the phone pairs with the TV as an ordinary game controller, so nothing is installed on the TV and no Wi-Fi is needed. Apps that work over Wi-Fi need their own receiver app on the TV as well.',
  ],
  [
    'Does Google TV have a built-in phone gamepad?',
    'Not yet. In September 2026 a teardown of the Google TV app found code for a gamepad mode, but Google has not announced or released it, and features found in code don’t always ship.',
  ],
  [
    'Is a phone as good as a real controller?',
    'For casual games, racing with tilt steering and retro games in emulators, a phone works well. Touch buttons have no physical feel, though, so for fast action games a Bluetooth controller is better.',
  ],
  [
    'Will every Android TV game work with a phone gamepad?',
    'Most games made for Android TV support gamepads, so they will. Some games ported from phones only accept touch and won’t respond to any controller, phone or real.',
  ],
  [
    'Is BeamPad’s gamepad free?',
    `The gamepad is part of BeamPad Pro (monthly, yearly or lifetime). You can watch one ad to use every Pro feature for 24 hours and try it with your games first. BeamPad is for Android phones running ${BEAMPAD.minAndroid} or newer.`,
  ],
]

export const Route = createFileRoute('/beampad/phone-as-gamepad-android-tv')({
  ssr: true, // prerendered to static HTML at build time
  head: () => guideHead({ path: PATH, headline: TITLE, published: PUBLISHED, trail: TRAIL, faq: FAQ }),
  component: PhoneAsGamepad,
})

function PhoneAsGamepad() {
  return (
    <GuidePage path={PATH} pageId={PAGE_ID} trail={TRAIL} title={TITLE} byline="Updated 26 November 2026">
      <ShortAnswer>
        Install a Bluetooth gamepad app on your Android phone and pair the phone with the TV as a game controller, in the same menu you would use
        for a real one. Nothing goes on the TV and no Wi-Fi is needed. Apps that use Wi-Fi instead need a receiver app on the TV and both devices
        on one network. For fast action games a real Bluetooth controller still plays best, and Google’s own phone gamepad hasn’t launched yet.
      </ShortAnswer>

      <CompareTable
        caption="Ways to use a phone, or a controller, for Android TV games"
        columns={['Way to play', 'App on the TV', 'Needs Wi-Fi', 'Best for']}
        rows={[
          { name: 'Bluetooth gamepad app', href: '#bluetooth-app', cells: [<YesNo key="a" yes={false} label="No" />, <YesNo key="w" yes={false} label="No" />, 'Casual, racing and retro games'] },
          { name: 'Wi-Fi gamepad app', href: '#wifi-app', cells: [<YesNo key="a" yes label="Yes" />, <YesNo key="w" yes label="Yes, shared" />, 'Games its TV app supports'] },
          { name: 'Real Bluetooth controller', href: '#real-controller', cells: [<YesNo key="a" yes={false} label="No" />, <YesNo key="w" yes={false} label="No" />, 'Fast action games'] },
          { name: 'Google TV’s own', href: '#google', cells: ['Not released', '–', '–'] },
        ]}
      />

      <OnThisPage
        items={[
          ['1. A Bluetooth gamepad app', '#bluetooth-app'],
          ['2. A Wi-Fi gamepad app', '#wifi-app'],
          ['3. A real controller', '#real-controller'],
          ['Google TV’s own phone gamepad', '#google'],
          ['Which games will work', '#games'],
          ['Questions', '#questions'],
        ]}
      />

      <div className="bp-prose mt-6">
        <h2 id="bluetooth-app">1. A Bluetooth gamepad app (no TV app, no Wi-Fi)</h2>
        <p>
          An Android phone can present itself to the TV as a Bluetooth game controller. The TV pairs with it like any other controller, so there is
          nothing to install on the TV and the phone and TV don’t need to share a network. Several apps can do this; we make one, <AppLink placement="guide_text" page={PAGE_ID}>BeamPad</AppLink>, whose
          gamepad is part of BeamPad Pro. To set it up:
        </p>
        <ol>
          <li>
            <AppLink placement="guide_step" page={PAGE_ID}>Install BeamPad</AppLink> on your Android phone ({BEAMPAD.minAndroid} or newer). To
            try the gamepad first, watch one ad for 24 hours of Pro.
          </li>
          <li>
            On the TV, open <Path steps={PAIR_ACCESSORY} /> (on Google TV, Settings is under your profile picture, top right).
          </li>
          <li>Follow BeamPad’s steps to connect, and choose Pair when the TV asks.</li>
          <li>Open the gamepad in BeamPad and start your game.</li>
        </ol>
        <p>
          You get two analog sticks, a D-pad, A, B, X and Y, bumpers, analog triggers and stick clicks. Buttons can show Xbox, PlayStation or
          Nintendo labels to match what a game shows on screen, tilt steering turns the phone into a wheel for racing games, and there is a
          full-screen mode. The same gamepad works with a PC.
        </p>
      </div>

      <Note>
        Pairing happens in the TV’s own settings, so you need the TV’s remote for that one step. Long games use a lot of battery, so keep the
        phone charging.
      </Note>

      <AppCard pageId={PAGE_ID} placement="guide_app" />

      <div className="bp-prose mt-6">
        <h2 id="wifi-app">2. A Wi-Fi gamepad app (with a TV app)</h2>
        <p>
          Other apps send your touches over Wi-Fi instead. They need a companion app installed on the TV from Google Play, and the phone and TV on
          the same network. They can work well at home, but they stop when the network changes or keeps devices apart, as hotel and guest networks
          often do, and a game only responds if the companion app can pass the buttons on to it.
        </p>

        <h2 id="real-controller">3. A real Bluetooth controller</h2>
        <p>
          For fast action games nothing beats physical buttons. Most Bluetooth controllers pair with Google TV and Android TV in the same menu, <Path steps={PAIR_ACCESSORY} />:
        </p>
        <ul>
          <li>
            <strong>PlayStation DualSense (PS5):</strong> hold the PS button and the Create button together until the light bar blinks, then choose
            it on the TV.
          </li>
          <li>
            <strong>Xbox Wireless Controller:</strong> turn it on, then hold the small pair button on the top until the Xbox button flashes quickly,
            and choose it on the TV.
          </li>
        </ul>

        <h2 id="google">Google TV’s own phone gamepad: not yet</h2>
        <p>
          The Google TV app already makes your phone a remote. In September 2026 a teardown of the app found code for a gamepad mode as well, but
          Google hasn’t announced or released it, and features found in code don’t always launch. Until it does, Google’s app is a remote, not a
          controller.
        </p>

        <h2 id="games">Which games will work</h2>
        <ul>
          <li>
            <strong>Games made for Android TV:</strong> almost always. They are designed for a remote or a gamepad, and most support gamepads, so a
            phone acting as one works.
          </li>
          <li>
            <strong>Emulators:</strong> yes. Map the buttons once in the emulator’s controller settings.
          </li>
          <li>
            <strong>Games ported from phones:</strong> some only accept touch and ignore every controller, phone or real. Check the game’s Play Store
            listing for controller support.
          </li>
        </ul>
      </div>

      <GuideFaq items={FAQ} />

      <GuideCta pageId={PAGE_ID} title="Your phone is already a controller" points={['Pairs like a real gamepad', 'No TV app, no Wi-Fi', 'Try every Pro feature for 24 hours with one ad']} />
    </GuidePage>
  )
}
