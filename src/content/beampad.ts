// BeamPad: the studio's Android app that makes a phone a Bluetooth keyboard,
// mouse and remote for a TV. Everything its pages (src/routes/beampad.*) say
// about the app lives here, so the landing page, the guides and their
// structured data can never disagree.
//
// Every claim is taken from the Google Play listing (checked 26 Nov 2026):
// features, Pro, compatibility and its limits, Data safety. Nothing here may
// promise more than the listing does. There are no ratings to show yet, so no
// rating is claimed anywhere, in the page or in its structured data.

import { SITE, absoluteUrl } from '@/lib/seo'

export const BEAMPAD = {
  name: 'BeamPad',
  storeName: 'BeamPad: TV Keyboard & Mouse',
  packageId: 'com.devbangs.beampad',
  developer: 'MEBS Software',
  developerUrl: 'https://mebs.app',
  email: 'mebssoftware9@gmail.com',
  privacyUrl: 'https://mebs.app/privacy/beampad',
  /** Lowest Android version: the Bluetooth keyboard profile an app can use arrived in Android 9. */
  minAndroid: 'Android 9',
  languages: ['English', 'French', 'Spanish', 'Portuguese'],
} as const

const PLAY_LISTING = `https://play.google.com/store/apps/details?id=${BEAMPAD.packageId}`

/** BeamPad's guides, oldest first: listed on the landing page, in the footer and under each guide. */
export const BEAMPAD_GUIDES = [
  {
    path: '/beampad/lost-firestick-remote-no-wifi',
    title: 'Lost Firestick remote and no Wi-Fi',
    blurb: 'Why the Fire TV app can’t find it, and the fixes that still work.',
  },
  {
    path: '/beampad/lost-google-tv-remote-no-wifi',
    title: 'Lost Google TV remote and no Wi-Fi',
    blurb: 'Chromecast with Google TV, Google TV Streamer and TVs with Google TV built in.',
  },
  {
    path: '/beampad/type-on-google-tv-from-phone',
    title: 'Type on Google TV from your phone',
    blurb: 'With Google’s apps over Wi-Fi, or over Bluetooth when there is no Wi-Fi.',
  },
  {
    path: '/beampad/phone-as-gamepad-android-tv',
    title: 'Your phone as a gamepad for Android TV',
    blurb: 'Bluetooth gamepad apps, Wi-Fi apps, real controllers: which to use for which games.',
  },
] as const

/** The tracking link to share anywhere (api/_lib/go.js): counts the click, then opens Google Play. */
export const TRACKING_LINK = `${SITE.origin}/go/beampad`

/**
 * A "Get it on Google Play" button's link: through the tracking link, which
 * counts the click under this button and page (Admin -> App clicks), then
 * sends the visitor to the Play listing with the same tags in Play's install
 * referrer, so Play Console can show the installs that followed.
 */
export function playUrl(placement: string, page = 'beampad'): string {
  return `/go/beampad?p=${encodeURIComponent(placement)}&pg=${encodeURIComponent(page)}`
}

const IMG = '/img/beampad'

export const BEAMPAD_ICON = { src: `${IMG}/icon-192.webp`, png: `${IMG}/icon-512.png` }
export const BEAMPAD_OG_IMAGE = `${SITE.origin}${IMG}/og.jpg`
export const PLAY_BADGE = { src: `${IMG}/google-play-badge.png`, width: 564, height: 168 }

/**
 * The app's own screens, cut from its Play screenshots (840 x 1854, with a
 * 420 px copy). Named, described and captioned for what people search when
 * they need them, so they can be found in image search; every word is true
 * to what the screen shows. The image sitemap lists them (scripts/postbuild.mjs).
 */
export type Screen = 'keyboard' | 'remote' | 'snippets' | 'trackpad' | 'pc-keyboard' | 'media' | 'presenter'

const SCREEN_FILE: Record<Screen, string> = {
  keyboard: 'beampad-phone-as-tv-keyboard',
  remote: 'beampad-phone-tv-remote-without-wifi',
  snippets: 'beampad-send-wifi-password-to-tv',
  trackpad: 'beampad-phone-as-mouse-for-tv',
  'pc-keyboard': 'beampad-phone-as-pc-keyboard',
  media: 'beampad-phone-media-remote-for-tv',
  presenter: 'beampad-phone-presentation-remote',
}

/** Alt text: what the image shows, led by what it is for. */
export const SCREEN_ALT: Record<Screen, string> = {
  keyboard: 'Phone used as a TV keyboard: BeamPad’s keyboard screen, with a text box that types on the TV and Ctrl, Alt, Esc, Tab, arrow and Enter keys',
  remote: 'Phone used as a TV remote without Wi-Fi: BeamPad’s remote screen with a D-pad and OK, volume and channel buttons, Back, Home and Menu',
  snippets: 'Sending a saved Wi-Fi password from a phone to a TV: BeamPad’s snippets screen with saved Wi-Fi codes, logins and addresses',
  trackpad: 'Phone used as a mouse for a TV: BeamPad’s trackpad screen with a touch area and left and right click buttons',
  'pc-keyboard': 'Phone used as a full PC keyboard: BeamPad Pro’s keyboard with F1 to F12, numbers, Ctrl, Win and Alt keys',
  media: 'Phone used as a media remote for a TV: BeamPad’s play, pause, skip, rewind, forward and volume controls',
  presenter: 'Phone used as a presentation remote: BeamPad Pro’s next and previous slide buttons, laser pointer, black screen and timer',
}

/** A short visible caption, for figures in the guides. */
export const SCREEN_CAPTION: Record<Screen, string> = {
  keyboard: 'BeamPad’s keyboard: type on the TV with your phone’s own keyboard.',
  remote: 'BeamPad’s remote: a D-pad, OK, Back, Home, volume and channels, over Bluetooth.',
  snippets: 'Saved snippets: send a Wi-Fi password or a login to the TV in one tap.',
  trackpad: 'BeamPad’s trackpad: a mouse pointer for TV browsers and apps.',
  'pc-keyboard': 'BeamPad Pro’s full keyboard for a computer.',
  media: 'Media controls: play, pause, skip and volume.',
  presenter: 'BeamPad Pro’s presentation remote.',
}

export const screenSrc = (name: Screen, width: 420 | 840) => `${IMG}/${SCREEN_FILE[name]}-${width}.webp`
export const SCREEN_SIZE = { width: 840, height: 1854 }

/** BeamPad's Play banner: a TV search typed from a phone (1600 x 900, with an 800 px copy). */
export const BANNER = {
  src: (width: 800 | 1600) => `${IMG}/beampad-type-on-tv-from-phone-${width}.webp`,
  width: 1600,
  height: 900,
  alt: 'Typing on a TV from a phone: the TV’s search box shows “cooking shows”, typed on the phone with BeamPad, with nothing installed on the TV and no Wi-Fi needed',
  caption: 'Type on the TV with your phone’s keyboard: the TV sees BeamPad as an ordinary Bluetooth keyboard.',
}

/** An image as a schema.org ImageObject, with its caption. */
export function imageObject(src: string, caption: string, width: number, height: number): Record<string, unknown> {
  return { '@type': 'ImageObject', contentUrl: `${SITE.origin}${src}`, url: `${SITE.origin}${src}`, caption, width, height }
}

/** Where the TV's own settings pair a Bluetooth keyboard (Google TV help; Amazon Fire TV help). */
export const PAIRING_PATHS: [platform: string, path: string[]][] = [
  ['Google TV and Android TV', ['Settings', 'Remotes & Accessories', 'Pair remote or accessory']],
  ['Fire TV and Fire TV Stick', ['Settings', 'Controllers & Bluetooth Devices', 'Other Bluetooth Devices', 'Add Bluetooth Devices']],
]

export type Compat = { name: string; note: string }

export const COMPATIBILITY: { works: Compat[]; limited: Compat[]; no: Compat[] } = {
  works: [
    { name: 'Google TV and Android TV', note: 'Chromecast with Google TV, NVIDIA Shield, TV boxes, and Sony, TCL, Hisense and Philips TVs.' },
    { name: 'Amazon Fire TV', note: 'Fire TV devices, including the Fire TV Stick.' },
    { name: 'Computers', note: 'Any computer that accepts a Bluetooth keyboard and mouse. The full PC keyboard and the gamepad are Pro.' },
    { name: 'Projectors and TV boxes', note: 'Any model that accepts a Bluetooth keyboard.' },
  ],
  limited: [
    { name: 'Samsung and LG TVs', note: 'Some models accept a Bluetooth keyboard. Some LG TVs accept one only through USB.' },
    { name: 'Apple TV', note: 'Keyboard input and arrow-key navigation work. The gamepad does not.' },
  ],
  no: [
    { name: 'Roku', note: 'Roku devices do not accept Bluetooth keyboards.' },
    { name: 'iPhone', note: `BeamPad is for Android phones, ${BEAMPAD.minAndroid} or newer.` },
  ],
}

export const PRO_FEATURES = [
  'Bluetooth gamepad: two analog sticks, D-pad, A, B, X and Y, bumpers, analog triggers and tilt steering',
  'Full PC keyboard: F1 to F12, Ctrl, Alt and Windows shortcuts',
  'Presentation remote: next, back, laser pointer, black screen and a timer',
  'Live and voice typing, paste, air mouse and a precision trackpad',
  'Custom panels, macros, an app launcher, device profiles and a command palette',
  'Unlimited snippets, and no ads',
]

export const LANDING_FAQ: [question: string, answer: string][] = [
  [
    'Does BeamPad need Wi-Fi?',
    'No. BeamPad connects your phone to the TV directly over Bluetooth, the way a wireless keyboard does. Your phone and TV do not need to share a network, and the TV does not need to be online. The free version uses your internet connection only to show ads.',
  ],
  [
    'Do I need to install anything on the TV?',
    'No. The TV sees your phone as an ordinary Bluetooth keyboard and mouse, so there is no TV app to install and no account to create.',
  ],
  [
    'Will BeamPad work with my TV?',
    'If your TV or streaming stick accepts a Bluetooth keyboard, it should accept BeamPad. Google TV, Android TV and Fire TV do. Samsung and LG support depends on the model, Apple TV takes keyboard input and arrow keys, and Roku does not accept Bluetooth keyboards.',
  ],
  [
    'Can I use BeamPad if I have lost my TV remote?',
    'Pairing happens once, in the TV’s own Bluetooth settings, so you need some way to move around the TV for that one step. Often the TV’s own remote works through HDMI-CEC, or a USB mouse does. After that, BeamPad is your remote, with or without Wi-Fi.',
  ],
  [
    'Is it safe to type passwords with BeamPad?',
    'What you type goes straight from your phone to the TV over the paired Bluetooth connection. BeamPad’s Google Play Data safety section states that it collects no data and shares none. Saved snippets are encrypted with a key kept in your phone’s secure hardware and left out of cloud backups.',
  ],
  [
    'Can my phone be a game controller for Android TV?',
    'Yes, with BeamPad Pro. It adds a Bluetooth gamepad with two analog sticks, a D-pad, A, B, X and Y buttons, bumpers, analog triggers and tilt steering, for compatible games and emulators on Android TV and PC.',
  ],
  [
    'Is there an iPhone version?',
    `No. BeamPad is for Android phones running ${BEAMPAD.minAndroid} or newer.`,
  ],
  [
    'Why can’t my phone connect?',
    'Some phone makers switch off the Bluetooth feature that lets a phone act as a keyboard. On those phones BeamPad cannot pair with anything. The free version is the quickest way to check yours.',
  ],
]

/** The app as a schema.org entity: no rating (there are none yet), no price beyond free. */
export function beampadAppJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    '@id': `${absoluteUrl('/beampad')}#app`,
    name: BEAMPAD.storeName,
    alternateName: BEAMPAD.name,
    description:
      'Turns an Android phone into a Bluetooth keyboard, mouse, TV remote and (with Pro) gamepad for Android TV, Google TV, Fire TV, computers and projectors. No Wi-Fi and nothing to install on the TV.',
    url: absoluteUrl('/beampad'),
    installUrl: PLAY_LISTING,
    downloadUrl: PLAY_LISTING,
    operatingSystem: `${BEAMPAD.minAndroid} or later`,
    applicationCategory: 'UtilitiesApplication',
    inLanguage: ['en', 'fr', 'es', 'pt'],
    image: `${SITE.origin}${BEAMPAD_ICON.png}`,
    screenshot: (Object.keys(SCREEN_FILE) as Screen[]).map((s) => imageObject(screenSrc(s, 840), SCREEN_ALT[s], SCREEN_SIZE.width, SCREEN_SIZE.height)),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free with ads. BeamPad Pro is a monthly, yearly or lifetime purchase.' },
    publisher: beampadPublisher(),
    author: beampadPublisher(),
  }
}

export function beampadPublisher(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': `${BEAMPAD.developerUrl}/#organization`,
    name: BEAMPAD.developer,
    url: BEAMPAD.developerUrl,
    email: BEAMPAD.email,
    address: { '@type': 'PostalAddress', addressLocality: 'Freetown', addressCountry: 'SL' },
  }
}
