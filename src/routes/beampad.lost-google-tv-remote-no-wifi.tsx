// /beampad/lost-google-tv-remote-no-wifi: the Google TV version of the lost
// remote guide (Chromecast with Google TV, Google TV Streamer, and TVs with
// Google TV built in).
//
// "lost google tv remote no wifi", "lost chromecast remote", "google tv remote
// app without wifi": Google's help says the phone and the TV must share a
// Wi-Fi network for the phone remote, and stops there. Every step below
// follows Google's help pages (Nov 2026): the phone remote needs shared Wi-Fi;
// the Google TV Streamer's back button makes its remote ring; the back button
// held for 5 to 10 seconds starts pairing, or Back + Home held for 3 seconds on
// the remote; HDMI-CEC and its brand names; the Streamer's Ethernet port and
// the Chromecast's Ethernet adapter. Built from src/components/beampad/Guide.tsx.
import { createFileRoute } from '@tanstack/react-router'
import { AppCard, GuideCta, GuideFaq, GuidePage, Note, OnThisPage, Path, ShortAnswer, SituationTable } from '@/components/beampad/Guide'
import { guideHead, type Trail } from '@/content/beampad-guide-head'
import { BEAMPAD } from '@/content/beampad'

const PATH = '/beampad/lost-google-tv-remote-no-wifi'
const PAGE_ID = 'lost_google_tv_remote'
const PUBLISHED = '2026-11-26'
const TITLE = 'Lost your Google TV remote and it’s not on Wi-Fi? Here’s what works'
const TRAIL: Trail = [
  ['BeamPad', '/beampad'],
  ['Lost Google TV remote, no Wi-Fi', PATH],
]
const PAIR_ACCESSORY = ['Settings', 'Remotes & Accessories', 'Pair remote or accessory']

const FAQ: [question: string, answer: string][] = [
  [
    'Does the Google TV phone remote work without Wi-Fi?',
    'No. The remote in the Google TV app, and in the Google Home app on iPhone, finds the TV over your network, so the phone and the TV must be on the same Wi-Fi. A network cable or a hotspot with your old Wi-Fi name can put them back on one.',
  ],
  [
    'How do I pair a new Google TV remote without the old one?',
    'Press and hold the button on the back of your Chromecast with Google TV or Google TV Streamer for 5 to 10 seconds to start pairing. If the new remote still doesn’t pair, hold Back and Home on it together for 3 seconds.',
  ],
  [
    'Can I make my Google TV remote ring?',
    'On a Google TV Streamer, yes: press the button on the back of the Streamer, say “Hey Google, find my remote” to a Google speaker or display, or use Find my remote in the Google Home app. The Chromecast with Google TV remote has no speaker, so it can’t ring.',
  ],
  [
    'Will a phone app that acts as a Bluetooth keyboard work straight away?',
    'Not the first time. Bluetooth keyboards, including phone apps such as BeamPad, are paired in Google TV’s own settings, so you need a way to get there once. After that it works with or without Wi-Fi.',
  ],
]

export const Route = createFileRoute('/beampad/lost-google-tv-remote-no-wifi')({
  ssr: true, // prerendered to static HTML at build time
  head: () => guideHead({ path: PATH, headline: TITLE, published: PUBLISHED, trail: TRAIL, faq: FAQ }),
  component: LostGoogleTvRemote,
})

function LostGoogleTvRemote() {
  return (
    <GuidePage path={PATH} pageId={PAGE_ID} trail={TRAIL} title={TITLE} byline="Updated 26 November 2026 · Steps checked against Google’s Chromecast and Google TV help">
      <ShortAnswer>
        If your Google TV is on the same Wi-Fi as your phone, the remote in the Google TV app (or the Google Home app on iPhone) is the quickest
        fix. If it isn’t, the app can’t see it. Then: on a Google TV Streamer, press the button on its back to make the remote ring; use your TV’s
        own remote through HDMI-CEC; plug in a network cable; recreate the old Wi-Fi with a hotspot; or pair a new remote. Once you can move
        around again, pair your phone as a Bluetooth keyboard so it never happens twice.
      </ShortAnswer>

      <OnThisPage
        items={[
          ['Why the phone remote can’t connect', '#why'],
          ['First: make the remote ring', '#find'],
          ['1. Your TV’s own remote', '#hdmi-cec'],
          ['2. A network cable', '#ethernet'],
          ['3. A hotspot with the old Wi-Fi name', '#hotspot'],
          ['4. A USB keyboard or mouse', '#usb'],
          ['5. A replacement remote', '#replacement'],
          ['6. Make your phone the remote', '#phone'],
          ['Google TV built into the TV', '#built-in'],
          ['Questions', '#questions'],
        ]}
      />

      <div className="bp-prose mt-6">
        <h2 id="why">Why the phone remote can’t connect</h2>
        <p>
          The remote in the Google TV app, and in the Google Home app on iPhone, finds your Chromecast or Google TV over your home network. Google’s
          own help says the phone and the TV must be on the same Wi-Fi. When the TV has lost its network, because the router or the password
          changed or you moved, the app has nothing to connect to, and joining a new network normally takes the remote you no longer have.
        </p>
        <p>
          <strong>If the TV is still on your Wi-Fi</strong>, you don’t need the rest of this page: open the Google TV app, connect to your TV and
          enter the code it shows.
        </p>

        <h2 id="find">First: make the remote ring (Google TV Streamer)</h2>
        <p>If you have a Google TV Streamer, the remote may only be lost in the sofa. Its remote can play a sound:</p>
        <ul>
          <li>press the button on the back of the Streamer once;</li>
          <li>say “Hey Google, find my remote” to a Google speaker or display; or</li>
          <li>in the Google Home app, open the Streamer and use <strong>Find my remote</strong>.</li>
        </ul>
        <p>The remote of a Chromecast with Google TV has no speaker, so this only works with the Streamer.</p>

        <h2 id="hdmi-cec">1. Use your TV’s own remote (HDMI-CEC)</h2>
        <p>
          A Chromecast with Google TV or a Google TV Streamer can take the arrows and OK from your TV’s remote, through a feature called HDMI-CEC.
          It is often off until you turn it on in the TV’s settings, under the brand’s own name:
        </p>
        <ul>
          <li><strong>Samsung:</strong> Anynet+</li>
          <li><strong>LG:</strong> SimpLink</li>
          <li><strong>Sony:</strong> BRAVIA Sync</li>
          <li><strong>Philips:</strong> EasyLink</li>
          <li><strong>Panasonic:</strong> VIERA Link</li>
        </ul>
        <p>
          Plug the Chromecast’s power into the wall rather than the TV’s USB port, switch to its input and try the arrows on the TV remote. That is
          enough to reach <Path steps={['Settings', 'Network & Internet']} /> and join your new Wi-Fi.
        </p>

        <h2 id="ethernet">2. Plug in a network cable</h2>
        <p>A cable puts the TV back on your network without touching the Wi-Fi settings:</p>
        <ul>
          <li><strong>Google TV Streamer:</strong> it has an Ethernet port. Run a cable from your router.</li>
          <li>
            <strong>Chromecast with Google TV:</strong> it needs Google’s Ethernet adapter, which also powers it, or a USB-C hub with Ethernet and
            its own power supply.
          </li>
        </ul>
        <p>
          Then put your phone on that router’s Wi-Fi. The phone and the TV are on one network again, so the remote in the Google TV app connects,
          and you can set up the new Wi-Fi from it, or just keep the cable.
        </p>

        <h2 id="hotspot">3. Recreate your old Wi-Fi with a hotspot</h2>
        <p>The TV remembers the network it used to be on. If you know that network’s exact name and password:</p>
        <ol>
          <li>On a second phone or a laptop, set up a hotspot with exactly the old name and password. Both are case-sensitive.</li>
          <li>Wait for the TV to join it.</li>
          <li>Connect your own phone to the same hotspot and connect the Google TV app to the TV.</li>
          <li>
            In <Path steps={['Settings', 'Network & Internet']} />, join your new Wi-Fi. The app disconnects when the TV changes network: put your
            phone on the new Wi-Fi and connect again.
          </li>
        </ol>

        <h2 id="usb">4. Plug in a USB keyboard or mouse</h2>
        <p>
          Google TV works with an ordinary USB keyboard and mouse. A Chromecast with Google TV has a single USB-C port that also powers it, so you
          need a USB-C hub with its own power input; Google’s power brick alone may not be enough through a hub. TVs with Google TV built in
          usually have a USB port you can plug them straight into.
        </p>

        <h2 id="replacement">5. Pair a replacement remote</h2>
        <p>Google’s steps for a new Chromecast or Google TV Streamer remote:</p>
        <ol>
          <li>Press and hold the button on the back of the Chromecast or Streamer for 5 to 10 seconds to start pairing.</li>
          <li>If the remote doesn’t pair, hold <strong>Back</strong> and <strong>Home</strong> on it together for 3 seconds, then follow the TV.</li>
        </ol>

        <h2 id="phone">6. Make your phone the remote that never needs Wi-Fi</h2>
        <p>
          Once you can move around again, with any of the fixes above, pair your phone as a Bluetooth keyboard and mouse. Then you have a remote
          that works whether the TV is online or not, and you can type Wi-Fi passwords with your phone’s keyboard.
        </p>
        <p>We make an app for this, BeamPad. To set it up:</p>
        <ol>
          <li>Install BeamPad on your Android phone ({BEAMPAD.minAndroid} or newer). It’s free with ads.</li>
          <li>
            On the TV, open <Path steps={PAIR_ACCESSORY} /> (Settings is under your profile picture, top right of the home screen).
          </li>
          <li>Follow BeamPad’s steps to connect, and choose Pair when the TV asks.</li>
          <li>
            Still need to fix the Wi-Fi? Go to <Path steps={['Settings', 'Network & Internet']} /> and type the password on your phone.
          </li>
        </ol>
      </div>

      <Note>
        BeamPad can’t do the very first pairing by itself: that happens in Google TV’s settings, so you need one of fixes 1 to 5 to get there.
        Pair it while you still have a remote and there is nothing to fix next time.
      </Note>

      <AppCard pageId={PAGE_ID} placement="guide_app" />

      <div className="bp-prose mt-6">
        <h2 id="built-in">If Google TV is built into your TV</h2>
        <p>
          On a Sony, TCL, Hisense, Philips or other TV with Google TV built in, the lost remote is the TV’s own remote. HDMI-CEC doesn’t apply, but
          the rest of this page does, and you have two more options:
        </p>
        <ul>
          <li>the buttons on the TV itself, usually underneath or at the back, for power, input and menus;</li>
          <li>a universal infrared remote set to your TV’s brand, or a phone with an infrared blaster and a remote app.</li>
        </ul>
      </div>

      <SituationTable
        rows={[
          ['The TV is still on your Wi-Fi', 'The remote in the Google TV or Google Home app'],
          ['Google TV Streamer, remote somewhere in the house', 'Press the button on the back of the Streamer to make it ring'],
          ['New router, new password or a move', 'Your TV’s own remote (fix 1) or a network cable (fix 2)'],
          ['You know the old Wi-Fi name and password', 'A hotspot with the same name (fix 3)'],
          ['No HDMI-CEC and no cable', 'A USB keyboard or mouse (fix 4), or a new remote (fix 5)'],
          ['You never want to be stuck again', 'Pair your phone as a Bluetooth keyboard now (fix 6)'],
        ]}
      />

      <GuideFaq items={FAQ} />

      <GuideCta
        pageId={PAGE_ID}
        title="Pair a backup remote you can’t lose"
        points={['Works with Wi-Fi off', 'Keyboard, mouse and remote', 'Nothing to install on the TV']}
      />
    </GuidePage>
  )
}
