// Google Analytics 4: visitor counts, page views, countries, devices.
//
// Off unless VITE_GA_MEASUREMENT_ID (a GA4 "Measurement ID", G-XXXXXXXXXX) is
// set when the site is built, and never in `vite dev`. Set it in Vercel
// (Project → Settings → Environment Variables, Production) and redeploy; for
// the Android app, put it in the local .env before `npm run apk`.
//
// The tag is one inline script in the root route's head (src/routes/__root.tsx),
// so it is in every prerendered page and its hash lands in the page's
// Content-Security-Policy (scripts/csp.mjs, which also allows Google's hosts).
// Page changes inside the app are counted by GA4's enhanced measurement
// ("page changes based on browser history events", on by default).

const raw = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim()

/** The GA4 Measurement ID, when analytics is on for this build. */
export const GA_MEASUREMENT_ID = import.meta.env.PROD && raw && /^G-[A-Z0-9]+$/.test(raw) ? raw : undefined

/**
 * Loads gtag.js once per document. The router re-inserts head scripts when it
 * renders in the browser (see BOOT_SCRIPT in __root.tsx), so it guards itself:
 * a second run would count every visit twice.
 */
export function analyticsScript(id: string) {
  return `(function(){if(window.__wtGa)return;window.__wtGa=1;var w=window;w.dataLayer=w.dataLayer||[];w.gtag=function(){w.dataLayer.push(arguments)};
w.gtag('js',new Date());w.gtag('config','${id}');
var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${id}';document.head.appendChild(s)})();`
}
