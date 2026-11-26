// What /beampad says, in English (rendered by src/components/beampad/Landing.tsx).
// Every claim comes from src/content/beampad.ts and the Google Play listing.
import { AppLink } from '@/components/beampad/BeamPad'
import { PairingPaths, type LandingCopy } from '@/components/beampad/Landing'
import { BEAMPAD, COMPATIBILITY, LANDING_FAQ, PAIRING_PATHS, PRO_FEATURES } from '@/content/beampad'

const LINK = 'font-semibold text-white underline decoration-[var(--bp-mint)] underline-offset-4'

export const LANDING_EN: LandingCopy = {
  lang: 'en',
  page: 'beampad',
  skip: 'Skip to content',
  ids: { features: 'features', how: 'how-it-works', compat: 'compatibility', guides: 'guides', faq: 'faq' },
  hero: {
    chip: 'Bluetooth keyboard, mouse & remote for Android',
    title: 'Type on your TV from your phone.',
    accent: 'No Wi-Fi needed.',
    lead: 'BeamPad connects your Android phone to your TV over Bluetooth, as a keyboard, a mouse and a remote. Nothing to install on the TV, no shared network, no account.',
    check: 'Check your TV first',
    footnote: `Free with ads · ${BEAMPAD.minAndroid} or newer · Google TV, Android TV and Fire TV`,
    searches: ['cooking shows', 'lo-fi beats', 'stand-up comedy', 'tech reviews'],
    tvChip: 'Typed from your phone',
  },
  proof: {
    label: 'Why BeamPad',
    items: [
      ['No Wi-Fi', 'Pairs over Bluetooth, like a wireless keyboard'],
      ['Nothing on the TV', 'No TV app to install, no account to create'],
      ['No data collected', 'As declared in Google Play’s Data safety'],
      ['Your own keyboard', 'Autocorrect, swipe and voice, as on your phone'],
    ],
  },
  why: {
    eyebrow: 'Why Bluetooth',
    title: 'Most phone remotes need your Wi-Fi. BeamPad doesn’t.',
    lead: 'Google TV, Fire TV and TV makers’ remote apps find the TV over your home network. When the TV isn’t on it, they can’t see it.',
    wifiTitle: 'Wi-Fi remote apps',
    wifi: [
      'Your phone and TV must be on the same Wi-Fi network',
      'Stop working when the TV is offline or on a new router',
      'Often fail on guest and hotel networks that keep devices apart',
      'Need the TV maker’s own app, one per brand',
    ],
    beampad: [
      'Pairs with the TV directly, the way a Bluetooth keyboard does',
      'Keeps working with Wi-Fi switched off',
      'Doesn’t care which network anything is on',
      'One app for Google TV, Android TV, Fire TV and computers',
    ],
  },
  features: {
    eyebrow: 'What it does',
    title: 'Keyboard, mouse and remote in one app',
    lead: 'Switch between them with one tap at the top of the screen. The TV sees one ordinary Bluetooth device.',
    items: [
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
    ],
  },
  pro: {
    eyebrow: 'BeamPad Pro',
    title: 'For gaming, work and presenting',
    lead: 'Monthly, yearly or lifetime. Or watch one ad and use every Pro feature for 24 hours.',
    gamepad: [
      'A gamepad for Android TV and PC',
      'Two analog sticks, a D-pad, A, B, X and Y, bumpers, analog triggers and stick clicks, with tilt steering and Xbox, PlayStation or Nintendo button labels. For compatible games and emulators.',
    ],
    pc: ['A full PC keyboard', 'F1 to F12, Ctrl, Alt and Windows shortcuts, macros and an app launcher, for the computer across the room.'],
    presenter: ['A presentation remote', 'Next and previous slide, a laser pointer, black screen and a timer, from your pocket.'],
    allTitle: 'Everything in Pro',
    all: PRO_FEATURES,
  },
  how: {
    eyebrow: 'How it works',
    title: 'Pair once, in the TV’s own settings',
    lead: 'Your phone joins the TV the same way a wireless keyboard would. It takes about a minute.',
    steps: [
      {
        title: 'Install BeamPad',
        body: (
          <>
            Get it free from <AppLink placement="how_install">Google Play</AppLink> on your Android phone ({BEAMPAD.minAndroid} or newer) and turn on Bluetooth.
          </>
        ),
      },
      { title: 'Open pairing on the TV', body: <PairingPaths intro="Go to the TV’s Bluetooth pairing screen:" paths={PAIRING_PATHS} /> },
      { title: 'Connect and type', body: 'Follow BeamPad’s on-screen steps to connect, and confirm the pairing on the TV. After that, BeamPad remembers the TV.' },
    ],
    note: (
      <>
        You need a way to move around the TV for that one pairing step: its remote, or the TV’s own remote through HDMI-CEC. Already lost the remote?{' '}
        <a href="/beampad/lost-firestick-remote-no-wifi" className={LINK}>
          What to do when the Firestick remote is gone and there’s no Wi-Fi
        </a>
        .
      </>
    ),
  },
  compat: {
    eyebrow: 'Compatibility',
    title: 'Will it work with your TV?',
    lead: 'If your TV accepts a Bluetooth keyboard, it accepts BeamPad. Here is where that is true, and where it isn’t.',
    works: ['Works', COMPATIBILITY.works],
    limited: ['Depends on the model', COMPATIBILITY.limited],
    no: ['Not compatible', COMPATIBILITY.no],
    footnote: 'Some phone makers switch off the Bluetooth feature that lets a phone act as a keyboard. The free version is the quickest way to check yours.',
  },
  privacy: {
    eyebrow: 'Privacy',
    title: 'Built to be trusted with your passwords',
    lead: (
      <>
        A keyboard sees everything you type, so BeamPad is built to keep it to itself. Read the{' '}
        <a href={BEAMPAD.privacyUrl} target="_blank" rel="noopener" className={LINK}>
          privacy policy
        </a>
        .
      </>
    ),
    points: [
      ['No data collected or shared', 'That is what BeamPad declares in its Google Play Data safety section.'],
      ['Phone to TV, nothing in between', 'What you type travels over the paired Bluetooth connection, not through a server.'],
      ['Snippets stay locked', 'Encrypted with a key in your phone’s secure hardware and kept out of cloud backups.'],
      ['Ads never see your typing', 'The free version shows ads, and they cannot reach your snippets or what you type.'],
    ],
  },
  guides: {
    eyebrow: 'Guides',
    title: 'Lost the remote and the Wi-Fi changed?',
    lead: 'Step-by-step fixes for when the phone apps can’t find your TV, whether or not you use BeamPad.',
    read: 'Read the guide',
  },
  faq: { eyebrow: 'Questions', title: 'Before you install', items: LANDING_FAQ },
  cta: {
    title: 'The best keyboard in the room is already in your pocket',
    lead: 'Free on Google Play. Pair once and type.',
    languages: `Available in ${BEAMPAD.languages.join(', ').replace(/, ([^,]*)$/, ' and $1')}.`,
  },
}
