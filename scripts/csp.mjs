// The site's Content Security Policy, in one place.
//
// Two copies of it are sent, and a browser enforces both:
//   1. A response header (vercel.json) on every page. It cannot know the
//      inline scripts of each prerendered page, so it allows inline scripts.
//   2. A <meta> tag written into every built HTML file by scripts/postbuild.mjs
//      with the SHA-256 of each inline script on that page. Together with (1),
//      a script runs only if it is one of ours: a file from this site, or an
//      inline script whose exact text was present when the site was built.
//      The Android app has no response headers, so the meta tag is its policy.
//
// scripts/postbuild.mjs fails the build if vercel.json's header differs from
// headerPolicy(), so the two never drift apart.
import crypto from 'node:crypto'

/** The Supabase project (database, sign-in, storage, edge functions). */
const SUPABASE = 'cfclkwugbexrihloqofc.supabase.co'
/** Google sign-in on the web loads Google Identity Services from here. */
const GOOGLE = 'https://accounts.google.com'
/** Google Analytics (src/lib/analytics.ts): gtag.js, and the hosts it reports to. */
const GA_SCRIPT = 'https://www.googletagmanager.com'
const GA_CONNECT = ['https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com']
/**
 * Cloudflare Turnstile (src/lib/turnstile.ts): the check that a person, not a
 * download tool, pressed play on a lesson video. Its script and its frame come
 * from here (developers.cloudflare.com/turnstile/reference/content-security-policy).
 */
const TURNSTILE = 'https://challenges.cloudflare.com'
/**
 * Monetag In-Page Push, on test from 25 November 2026 (src/lib/monetag.ts):
 * its tag, and the hosts the tag was seen calling (a visitor id, then the ad
 * request). Monetag publishes no list and moves between hosts, so any host it
 * starts using arrives in Google Analytics as monetag_blocked_host. Its ads
 * reply over https from hosts that vary, so connect-src allows any https host
 * (img-src already does); scripts stay limited to the tag's host. Remove with
 * the test.
 */
const MONETAG_SCRIPT = ['https://nap5k.com']
const MONETAG_CONNECT = ['https:']

const BASE = {
  'default-src': ["'self'"],
  // The site's API when the page is served from the Android app (https://localhost).
  'connect-src': ["'self'", 'https://wasscetutor.com', `https://${SUPABASE}`, `wss://${SUPABASE}`, GOOGLE, 'https://www.googleapis.com', 'https://oauth2.googleapis.com', ...GA_CONNECT, ...MONETAG_CONNECT],
  // Photographs and question images may be on any https host; never http.
  'img-src': ["'self'", 'data:', 'blob:', 'https:'],
  'font-src': ["'self'", 'data:'],
  // KaTeX positions maths with inline styles.
  'style-src': ["'self'", "'unsafe-inline'", GOOGLE],
  'frame-src': [GOOGLE, TURNSTILE],
  'worker-src': ["'self'", 'blob:'],
  'manifest-src': ["'self'"],
  // Pronunciation and listening clips (public/audio), which the Android app loads from the site.
  // Lesson videos play from memory (blob:, hls.js); their captions come from Supabase storage.
  'media-src': ["'self'", 'https://wasscetutor.com', 'blob:', `https://${SUPABASE}`],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
}

const serialise = (directives) =>
  Object.entries(directives)
    .map(([name, values]) => (values.length ? `${name} ${values.join(' ')}` : name))
    .join('; ')

/** The policy for the response header. */
export function headerPolicy() {
  return serialise({
    ...BASE,
    'script-src': ["'self'", "'unsafe-inline'", GOOGLE, GA_SCRIPT, TURNSTILE, ...MONETAG_SCRIPT],
    // Header-only directives: a <meta> policy cannot carry these.
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  })
}

const INLINE_SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
const isExecutable = (attrs) => {
  if (/\bsrc\s*=/.test(attrs)) return false
  const type = attrs.match(/\btype\s*=\s*"([^"]*)"/i)?.[1]?.toLowerCase()
  return !type || type === 'module' || type === 'text/javascript' || type === 'application/javascript'
}

/** The policy for one built page: its inline scripts by hash, nothing else inline. */
export function pagePolicy(html) {
  const hashes = new Set()
  for (const [, attrs, body] of html.matchAll(INLINE_SCRIPT)) {
    if (isExecutable(attrs) && body.length > 0) hashes.add(`'sha256-${crypto.createHash('sha256').update(body, 'utf8').digest('base64')}'`)
  }
  return serialise({ ...BASE, 'script-src': ["'self'", ...hashes, GOOGLE, GA_SCRIPT, TURNSTILE, ...MONETAG_SCRIPT] })
}

const META = /<meta http-equiv="Content-Security-Policy"[^>]*>/i

/** Writes (or replaces) the policy <meta> in a built page, straight after the charset declaration. */
export function withPagePolicy(html) {
  const clean = html.replace(META, '')
  const tag = `<meta http-equiv="Content-Security-Policy" content="${pagePolicy(clean)}"/>`
  const charset = clean.match(/<meta charset="[^"]*"\s*\/?>/i)
  if (charset) return clean.replace(charset[0], `${charset[0]}${tag}`)
  if (/<head[^>]*>/i.test(clean)) return clean.replace(/<head[^>]*>/i, (m) => `${m}${tag}`)
  throw new Error('no <head> to carry the Content-Security-Policy')
}
