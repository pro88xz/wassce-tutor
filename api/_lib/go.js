// /go/<app>: a tracking link to one of the studio's apps on Google Play. It
// counts the click in app_link_clicks (migration 41), then sends the visitor
// to the Play listing. Admin -> App clicks shows the counts.
//
// Served by the email click function: vercel.json rewrites /go/:app to
// /api/email/c?app=:app, and api/email/c.js hands any request with "app" to
// appLink() here. (The Hobby plan allows 12 functions; see
// scripts/check-functions.mjs. Both are "count a click, then redirect".)
//
//   /go/beampad                     a plain link, to share anywhere
//   /go/beampad?s=tiktok            tagged with where it was shared (source)
//   /go/beampad?p=hero&pg=beampad   a button on our own pages: which one, on which page
//
// The same tags travel on to Google Play in its install referrer (utm_*), so
// Play Console's acquisition report can show installs for each one: clicks
// here, installs there.
//
// Not counted: crawlers and link previews (WhatsApp, Facebook...), HEAD
// requests and browser prefetches. Nothing that identifies a person is kept:
// the visitor code is a hash of the day, the IP address and the browser, so
// repeat clicks from one person in a day count once, and it can't be turned
// back into either. If the database is slow or down, the visitor still goes
// straight to Google Play.
import crypto from 'node:crypto'
import { db, env } from './server.js'

export const APPS = {
  beampad: 'com.devbangs.beampad',
}

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|skype|embedly|quora|pinterest|vkshare|lighthouse|headless|curl|wget|python|httpclient|okhttp|go-http|java\//i

/** A short tag: letters, digits, "-" and "_" only, at most `max` long; anything else is dropped. */
export function tag(value, max) {
  if (typeof value !== 'string') return null
  const t = value.trim().toLowerCase().slice(0, max)
  return /^[a-z0-9_-]+$/.test(t) ? t : null
}

export function deviceOf(ua) {
  if (/android/i.test(ua)) return 'android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/windows|macintosh|linux|cros/i.test(ua)) return 'desktop'
  return 'other'
}

/** The Play listing, with the tags in Play's install referrer. */
export function playUrl(pkg, { source, page, placement }) {
  const referrer = new URLSearchParams({
    utm_source: source ?? 'wasscetutor.com',
    utm_medium: source ? 'link' : 'web',
    utm_campaign: page ?? 'direct',
    ...(placement ? { utm_content: placement } : {}),
  }).toString()
  return `https://play.google.com/store/apps/details?id=${pkg}&referrer=${encodeURIComponent(referrer)}`
}

/** The click as app_link_clicks stores it. */
export function clickRow(request, app, salt, now = new Date()) {
  const url = new URL(request.url)
  const ua = request.headers.get('user-agent') || ''
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim()
  let referrerHost = null
  try {
    const ref = request.headers.get('referer')
    if (ref) referrerHost = new URL(ref).hostname.slice(0, 120) || null
  } catch {
    referrerHost = null
  }
  const country = (request.headers.get('x-vercel-ip-country') || '').toUpperCase()
  const day = now.toISOString().slice(0, 10)
  return {
    app,
    placement: tag(url.searchParams.get('p'), 40),
    page: tag(url.searchParams.get('pg'), 60),
    source: tag(url.searchParams.get('s'), 40),
    referrer_host: referrerHost,
    country: /^[A-Z]{2}$/.test(country) ? country : null,
    device: deviceOf(ua),
    visitor: crypto.createHash('sha256').update(`${salt}|${day}|${ip}|${ua}`).digest('hex').slice(0, 24),
  }
}

/** Whether to count this request: a person's GET, not a crawler, preview or prefetch. */
export function countable(request) {
  if (request.method !== 'GET') return false
  const ua = request.headers.get('user-agent') || ''
  if (!ua || BOT.test(ua)) return false
  const purpose = `${request.headers.get('sec-purpose') || ''} ${request.headers.get('purpose') || ''} ${request.headers.get('x-purpose') || ''}`
  return !/prefetch|preview|prerender/i.test(purpose)
}

const redirect = (location) =>
  new Response(null, {
    status: 302,
    headers: { Location: location, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer' },
  })

/** The handler, with its database and secret passed in (so tests can supply fakes). */
export function goHandler({ client, salt, timeoutMs = 1200 }) {
  return async (request) => {
    const url = new URL(request.url)
    const app = tag(url.searchParams.get('app'), 20)
    const pkg = app ? APPS[app] : null
    if (!pkg) return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } })
    const row = clickRow(request, app, salt)
    if (client && countable(request)) {
      // Wait a moment for the write so it isn't cut off, but never hold the visitor up for long.
      const write = Promise.resolve(client.from('app_link_clicks').insert(row)).catch(() => null)
      await Promise.race([write, new Promise((resolve) => setTimeout(resolve, timeoutMs))])
    }
    return redirect(playUrl(pkg, { source: row.source, page: row.page, placement: row.placement }))
  }
}

let handle

/** The live handler (server key, salt from it), made on first use. */
export function appLink(request) {
  if (!handle) {
    const { supabaseUrl, supabaseKey } = env()
    const configured = Boolean(supabaseUrl && supabaseKey)
    handle = goHandler({ client: configured ? db() : null, salt: crypto.createHash('sha256').update(`go|${supabaseKey}`).digest('hex') })
  }
  return handle(request)
}

/** A tracking-link request (it carries the app's name), not an email click. */
export const isAppLink = (request) => new URL(request.url).searchParams.has('app')
