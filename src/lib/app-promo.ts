// The house ad above the site's header (src/components/AppPromoBanner.tsx):
// "Search: Private Web Browser" on Google Play.
//
// It follows the usual app-banner rules: closing it hides it for 15 days,
// tapping Install hides it for 90 (they have probably installed it), and it is
// not shown on iPhone or iPad, where a Google Play app can't be installed.
// BOOT_SCRIPT in src/routes/__root.tsx reads the same key before first paint
// and sets html.promo-hidden, so a dismissed banner never flashes on load.

export const PROMO = {
  id: 'search-app',
  name: 'Search: Private Web Browser',
  /** From the Play listing; check it now and then so the banner stays accurate. */
  rating: '4.4',
  tagline: 'Private browsing with a built-in ad blocker',
  /** The referrer shows these installs under Acquisition in Play Console. */
  href: 'https://play.google.com/store/apps/details?id=com.devbangs.search&referrer=utm_source%3Dwasscetutor%26utm_medium%3Dbanner%26utm_campaign%3Dsite_promo',
  icon: '/img/promo/search-app-80.webp',
  icon3x: '/img/promo/search-app-120.webp',
}

/** localStorage key holding the time (ms) until which the banner stays hidden. */
export const PROMO_HIDDEN_UNTIL_KEY = 'wassce_promo_search_until'

const DAY = 24 * 60 * 60 * 1000

/** Hides the banner now and for the given number of days. */
export function hidePromo(days: number) {
  document.documentElement.classList.add('promo-hidden')
  try {
    localStorage.setItem(PROMO_HIDDEN_UNTIL_KEY, String(Date.now() + days * DAY))
  } catch {
    /* private mode or blocked storage: hidden for this visit only */
  }
}
