// Google Analytics 4: visitor counts, page views, countries, devices.
//
// Reports to the WASSCE Tutor GA4 property (Measurement ID below) from the
// production build only: never in `vite dev`, and not on Vercel preview
// deployments (*.vercel.app). VITE_GA_MEASUREMENT_ID overrides the ID at build
// time. Android app visits arrive with the hostname "localhost".
//
// The tag is one inline script in the root route's head (src/routes/__root.tsx),
// so it is in every prerendered page and its hash lands in the page's
// Content-Security-Policy (scripts/csp.mjs, which also allows Google's hosts).
// Page changes inside the app are counted by GA4's enhanced measurement
// ("page changes based on browser history events", on by default).

/** The "WASSCE Tutor" web data stream in Google Analytics. */
const DEFAULT_ID = 'G-LHQ3MC7LYT'
const raw = ((import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) || DEFAULT_ID).trim()

/** The GA4 Measurement ID, when analytics is on for this build. */
export const GA_MEASUREMENT_ID = import.meta.env.PROD && raw && /^G-[A-Z0-9]+$/.test(raw) ? raw : undefined

/**
 * Loads gtag.js once per document. The router re-inserts head scripts when it
 * renders in the browser (see BOOT_SCRIPT in __root.tsx), so it guards itself:
 * a second run would count every visit twice. Preview deployments are skipped
 * so test visits don't mix with real students.
 */
export function analyticsScript(id: string) {
  return `(function(){if(window.__wtGa)return;window.__wtGa=1;if(location.hostname.endsWith('.vercel.app'))return;var w=window;w.dataLayer=w.dataLayer||[];w.gtag=function(){w.dataLayer.push(arguments)};
w.gtag('js',new Date());w.gtag('config','${id}');
var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${id}';document.head.appendChild(s)})();`
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/** Sends a Google Analytics event; does nothing where analytics is off (dev, previews). */
export function track(event: string, params: Record<string, unknown> = {}) {
  try {
    window.gtag?.('event', event, params)
  } catch {
    /* analytics must never break the page */
  }
}
