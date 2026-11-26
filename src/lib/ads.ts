// Google AdSense: where ads may show.
//
// Ads are for the public pages people find in search: the homepage, lessons
// and practice questions under /wassce, tutors, the blog, universities and the
// other fixed pages. Their prerendered HTML carries the AdSense tag
// (src/routes/__root.tsx), which is also where Google's review looks for it.
// Never in the app: the dashboard, study pages, practice, progress, the
// account, sign-in, paying, admin, or the question page the emails link to.
//
// Three rules keep ads out of the app:
//  1. The app's pages are served from /_shell (vercel.json), which has no tag.
//  2. "/" is the homepage for visitors but the dashboard for students, so the
//     boot script (__root.tsx) pauses ad requests there when a session is
//     stored. Also paused in the Android app: AdSense is for websites.
//  3. Going from a page that shows ads into the app, or to the dashboard, is a
//     full page load, so nothing the tag placed (an anchor ad, say) follows.

/** Pages of the app, served from /_shell (keep in step with the rewrites in vercel.json). */
const APP_PATH = /^\/(_shell|auth|subjects|subject|topic|lesson|paper|q|tutor|tutor-dashboard|affiliate-dashboard|profile|account|practice|progress|onboarding|subscribe|reset-password|admin)(\/|$)/

/** True on the app's own pages, which never carry the AdSense tag. */
export function isAppPath(pathname: string): boolean {
  return APP_PATH.test(pathname)
}

/**
 * Public pages that never show ads: BeamPad's pages (src/routes/beampad.*),
 * the studio's TV app, which has its own brand and sends visitors to Google
 * Play. They are prerendered without the AdSense tag, and Monetag stays off.
 */
const AD_FREE_PATH = /^\/beampad(\/|$)/

/** True on a public page that is kept free of ads. */
export function isAdFreePath(pathname: string): boolean {
  return AD_FREE_PATH.test(pathname)
}

/** Whether ads may show on this page: a public page, and not the student's dashboard ("/" when signed in). */
export function adsAllowed(pathname: string, signedIn: boolean): boolean {
  return !isAppPath(pathname) && !isAdFreePath(pathname) && !(pathname === '/' && signedIn)
}

/** A Supabase session is stored in this browser (the same test as the boot script). */
export function hasStoredSession(): boolean {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      if (/^sb-.+-auth-token$/.test(localStorage.key(i) ?? '')) return true
    }
  } catch {
    // Storage blocked: no session can be stored either.
  }
  return false
}

/** This page loaded the AdSense tag and ads are not paused. */
export function adsRunning(): boolean {
  if (typeof document === 'undefined') return false
  const w = window as unknown as { __wtAdsPaused?: number }
  return !w.__wtAdsPaused && !!document.querySelector('script[src*="adsbygoogle.js"]')
}

const RELOADED_KEY = 'wassce_ads_reload'

/**
 * Open `href` as a fresh page so ads do not follow into the app. At most once
 * per address in a row (sessionStorage), so a page can never reload itself
 * over and over; returns false when it did not reload.
 */
export function reloadWithoutAds(href: string, replace = false): boolean {
  try {
    if (sessionStorage.getItem(RELOADED_KEY) === href) return false
    sessionStorage.setItem(RELOADED_KEY, href)
  } catch {
    return false
  }
  if (replace) window.location.replace(href)
  else window.location.assign(href)
  return true
}

/** A page opened normally: the next reload to any address is allowed again. */
export function clearAdsReload(): void {
  try {
    sessionStorage.removeItem(RELOADED_KEY)
  } catch {
    // Nothing stored.
  }
}
