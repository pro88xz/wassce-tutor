// /beampad/type-on-google-tv-from-phone: how to type on Google TV or Android
// TV with a phone's keyboard.
//
// "type on google tv with phone", "use phone as keyboard for android tv",
// "phone keyboard for google tv": a how-to, kept apart from the landing page
// (the app's own page, for "phone as a TV keyboard without Wi-Fi") so the two
// don't compete for the same searches. Google's own apps come first, because
// most people have Wi-Fi and they are free; then what works without Wi-Fi.
// Steps follow Google's help (Nov 2026): Google TV app -> Remote -> choose the
// TV -> pair; the TV Remote Quick Settings tile; on iPhone, Google Home -> the
// TV -> Open remote; the phone and TV on the same Wi-Fi; Bluetooth keyboards
// in Settings -> Remotes & Accessories -> Pair remote or accessory.
import { createFileRoute } from '@tanstack/react-router'
import { AppCard, CompareTable, GuideCta, GuideFaq, GuidePage, Note, OnThisPage, Path, ShortAnswer, YesNo } from '@/components/beampad/Guide'
import { guideHead, type Trail } from '@/content/beampad-guide-head'
import { AppLink } from '@/components/beampad/BeamPad'
import { BEAMPAD } from '@/content/beampad'

const PATH = '/beampad/type-on-google-tv-from-phone'
const PAGE_ID = 'type_on_google_tv'
const PUBLISHED = '2026-11-26'
const TITLE = 'How to type on Google TV or Android TV from your phone'
const TRAIL: Trail = [
  ['BeamPad', '/beampad'],
  ['Type on Google TV from your phone', PATH],
]
const PAIR_ACCESSORY = ['Settings', 'Remotes & Accessories', 'Pair remote or accessory']

const FAQ: [question: string, answer: string][] = [
  [
    'Can I type on Google TV from my phone without Wi-Fi?',
    'Not with Google’s apps: the Google TV and Google Home remotes need the phone and the TV on the same Wi-Fi. Without Wi-Fi you need Bluetooth: a Bluetooth keyboard, or an app that makes an Android phone act as one, such as BeamPad.',
  ],
  [
    'Does this work with an iPhone?',
    'Over Wi-Fi, yes: use the remote in the Google Home app, or the Google TV app where it is available, and type when a text box appears on the TV. BeamPad, for typing over Bluetooth, is for Android phones only.',
  ],
  [
    'Why can’t the Google TV app find my TV?',
    'Usually because the phone and the TV are on different networks. Check both are on the same Wi-Fi, not a guest network, which often keeps devices apart, and that your phone has no VPN turned on. Then close and reopen the app.',
  ],
  [
    'Is there a way to avoid typing passwords on the TV at all?',
    'Often, yes. Many streaming apps offer to sign in with a code: the TV shows a short code or a QR code, and you finish signing in on your phone.',
  ],
]

export const Route = createFileRoute('/beampad/type-on-google-tv-from-phone')({
  ssr: true, // prerendered to static HTML at build time
  head: () => guideHead({ path: PATH, headline: TITLE, published: PUBLISHED, trail: TRAIL, faq: FAQ }),
  component: TypeOnGoogleTv,
})

type Method = { name: string; wifi: boolean; phone: string; note: string; href: string }
const METHODS: Method[] = [
  { name: 'Google TV app', wifi: true, phone: 'Android', note: 'Google’s own, free', href: '#google-tv-app' },
  { name: 'Google Home app', wifi: true, phone: 'iPhone or Android', note: 'Google’s own, free', href: '#iphone' },
  { name: 'Bluetooth keyboard', wifi: false, phone: 'None', note: 'A keyboard to buy and keep charged', href: '#bluetooth-keyboard' },
  { name: 'Phone as a Bluetooth keyboard', wifi: false, phone: `Android (${BEAMPAD.minAndroid}+)`, note: 'Also a mouse and a remote', href: '#phone-keyboard' },
]

function TypeOnGoogleTv() {
  return (
    <GuidePage path={PATH} pageId={PAGE_ID} trail={TRAIL} title={TITLE} byline="Updated 26 November 2026 · Steps checked against Google’s Google TV help">
      <ShortAnswer>
        If your phone and TV are on the same Wi-Fi, use Google’s own remote: the Google TV app on Android, or the Google Home app on iPhone. Pick
        a text box on the TV and type with your phone’s keyboard. If they can’t share Wi-Fi, the TV is offline, or the network keeps devices
        apart, as many hotel and guest networks do, type over Bluetooth instead, with a Bluetooth keyboard or your phone acting as one.
      </ShortAnswer>

      <CompareTable
        caption="Ways to type on Google TV from a phone"
        columns={['Way to type', 'Needs Wi-Fi', 'Phone', 'Good to know']}
        rows={METHODS.map((m) => ({ name: m.name, href: m.href, cells: [<YesNo key="w" yes={m.wifi} label={m.wifi ? 'Yes, shared' : 'No'} />, m.phone, m.note] }))}
      />

      <OnThisPage
        items={[
          ['On Android: the Google TV app', '#google-tv-app'],
          ['On iPhone: the Google Home app', '#iphone'],
          ['Skip the password entirely', '#codes'],
          ['No Wi-Fi: a Bluetooth keyboard', '#bluetooth-keyboard'],
          ['No Wi-Fi: your phone as the keyboard', '#phone-keyboard'],
          ['Questions', '#questions'],
        ]}
      />

      <div className="bp-prose mt-6">
        <h2 id="google-tv-app">On Android: the Google TV app</h2>
        <p>Your phone and the TV must be on the same Wi-Fi network.</p>
        <ol>
          <li>Open the Google TV app on your phone (it is free on Google Play).</li>
          <li>Tap <strong>Remote</strong>, near the bottom right.</li>
          <li>Tap <strong>Scanning for devices</strong> at the top and choose your TV.</li>
          <li>Enter the code the TV shows to finish pairing.</li>
          <li>Select a text box on the TV, such as search, then tap the keyboard in the app and type.</li>
        </ol>
        <p>
          Autocorrect, swipe typing and voice typing work as they do in any other app, because it is your own keyboard. To reach the remote from
          any screen, add the <strong>TV Remote</strong> tile to your Quick Settings: swipe down, tap the pencil, and drag the tile in.
        </p>

        <h2 id="iphone">On iPhone: the Google Home app</h2>
        <p>Again, the iPhone and the TV must be on the same Wi-Fi.</p>
        <ol>
          <li>Open the Google Home app and tap your TV.</li>
          <li>Tap <strong>Open remote</strong>.</li>
          <li>Select a text box on the TV and type with the iPhone’s keyboard.</li>
        </ol>
        <p>Where the Google TV app is available for iPhone, its remote works the same way.</p>

        <h2 id="codes">Skip the password entirely</h2>
        <p>
          Before typing a long password, look for a sign-in code. Many streaming apps on Google TV show a short code or a QR code instead: open the
          address or scan the code on your phone, sign in there, and the TV signs in by itself.
        </p>

        <h2 id="bluetooth-keyboard">No Wi-Fi: a Bluetooth keyboard</h2>
        <p>
          Google TV and Android TV accept ordinary Bluetooth keyboards, and those don’t care about Wi-Fi. Put the keyboard in pairing mode, then on
          the TV open <Path steps={PAIR_ACCESSORY} /> (Settings is under your profile picture, top right), choose the keyboard and select Pair.
          Sony notes that keyboards sold as being “for Android” aren’t guaranteed to work with every TV, so check the keyboard’s compatibility list.
        </p>

        <h2 id="phone-keyboard">No Wi-Fi: your phone as the keyboard</h2>
        <p>
          An Android phone can act as a Bluetooth keyboard itself, so you type with the keyboard you already know, with no network at all. We make
          an app for this, <AppLink placement="guide_text" page={PAGE_ID}>BeamPad</AppLink>. To set it up:
        </p>
        <ol>
          <li><AppLink placement="guide_step" page={PAGE_ID}>Install BeamPad</AppLink> on your Android phone ({BEAMPAD.minAndroid} or newer). It’s free with ads.</li>
          <li>
            On the TV, open <Path steps={PAIR_ACCESSORY} />.
          </li>
          <li>Follow BeamPad’s steps to connect, and choose Pair when the TV asks.</li>
          <li>Select a text box on the TV and type on your phone.</li>
        </ol>
        <p>
          It is also a mouse for TV browsers and apps that need a pointer, and a remote with a D-pad, volume and media keys. Saved snippets send a
          Wi-Fi password or a login in one tap.
        </p>
      </div>

      <Note>
        Pairing happens in the TV’s own settings, so you need the TV’s remote for that one step. After that BeamPad remembers the TV. Lost the remote
        already? See <a href="/beampad/lost-google-tv-remote-no-wifi" className="font-semibold text-white underline decoration-[var(--bp-mint)] underline-offset-4">lost Google TV remote and no Wi-Fi</a>.
      </Note>

      <AppCard pageId={PAGE_ID} placement="guide_app" />

      <GuideFaq items={FAQ} />

      <GuideCta pageId={PAGE_ID} title="Type on your TV, Wi-Fi or not" points={['Your own keyboard: autocorrect, swipe, voice', 'Works with Wi-Fi off', 'Nothing to install on the TV']} />
    </GuidePage>
  )
}
