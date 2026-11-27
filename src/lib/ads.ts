/** Shared page/session rules used by the remaining Monetag integration. */
const APP_PATH = /^\\/(_shell|auth|subjects|subject|topic|lesson|paper|q|tutor|tutor-dashboard|affiliate-dashboard|profile|account|practice|progress|onboarding|subscribe|reset-password|admin)(\\/|$)/
const AD_FREE_PATH = /^\\/beampad(\\/|$)/

export function isAppPath(pathname: string): boolean {
  return APP_PATH.test(pathname)
}

export function isAdFreePath(pathname: string): boolean {
  return AD_FREE_PATH.test(pathname)
}

export function adsAllowed(pathname: string, signedIn: boolean): boolean {
  return !isAppPath(pathname) && !isAdFreePath(pathname) && !(pathname === '/' && signedIn)
}

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

const RELOADED_KEY = 'wassce_network_reload'

export function reloadWithoutNetwork(href: string): boolean {
  try {
    if (sessionStorage.getItem(RELOADED_KEY) === href) return false
    sessionStorage.setItem(RELOADED_KEY, href)
  } catch {
    return false
  }
  window.location.assign(href)
  return true
}
