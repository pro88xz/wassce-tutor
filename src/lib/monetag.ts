// Monetag In-Page Push: a one-week test (from 25 November 2026) of a second ad
// network beside Google AdSense. In-Page Push is a small card Monetag shows over
// the page (top right on a computer, at the top on a phone). If the test is not
// worth it, this file, its rules, the call in src/routes/__root.tsx and the
// Monetag hosts in scripts/csp.mjs come out together.
//
// Monetag decides where the card goes; this decides whether its script loads
// at all (rules in src/lib/monetag-rules.ts):
//  - Pages: public pages only (lessons, notes, questions, key terms, blog,
//    tutors, universities...). Never the app (sign-in, the dashboard, study
//    screens, payment), Privacy, Terms or Contact, a page that does not exist,
//    the Android app, or anyone with a plan.
//  - Never on arrival: from the second page of a visit, or after 10 seconds
//    of active reading on the first.
//  - Never mid-task (3 seconds after a tap or key press), and never over a
//    Google full-screen ad. It may show with AdSense's anchor ad, which stays
//    at the bottom of the screen while this card sits at the top.
//  - At most once per page, 10 minutes apart, 3 times a day; closed twice in a
//    day, none for 24 hours.
//
// "?monetag=now" in a page's address skips the timing rules (not the page
// rules) and is not counted, so the card can be checked by hand.
//
// Google Analytics receives monetag_load and monetag_closed, and while the
// script runs, monetag_blocked_host for any host the site's security policy
// (scripts/csp.mjs) refused, so a host Monetag starts using is noticed.
import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { adsAllowed, hasStoredSession } from '@/lib/ads'
import { track } from '@/lib/analytics'
import { useAuth } from '@/lib/auth'
import { useAccess } from '@/lib/useAccess'
import { closed, loaded, pageOpened, parseState, verdict, type MonetagState } from '@/lib/monetag-rules'

/** On, for the test. false stops the script loading anywhere. */
const ON = true
const ZONE = '12351537'
const TAG = 'https://nap5k.com/tag.min.js'
const KEY = 'wassce_monetag'

/** Public pages Monetag must not show on (besides the app's pages and "/" when signed in, as for AdSense). */
const NOT_HERE = /^\/(privacy|terms|contact)(\/|$)/

/** Whether Monetag may load on this page. */
export function monetagPathAllowed(pathname: string, signedIn: boolean): boolean {
  return ON && adsAllowed(pathname, signedIn) && !NOT_HERE.test(pathname)
}

/** The script is on this page (it stays until the next full page load). */
export function monetagLoaded(): boolean {
  return typeof document !== 'undefined' && !!document.querySelector(`script[data-zone="${ZONE}"]`)
}

function readState(): MonetagState {
  try {
    return parseState(localStorage.getItem(KEY))
  } catch {
    return parseState(null)
  }
}

function writeState(s: MonetagState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    // Storage blocked: the rules still hold for this page.
  }
}

/** The page's own scroll area: the app frame's <main>, or the window. */
function scrolledFraction(target: EventTarget | null): number {
  const el = target instanceof Element ? target : document.scrollingElement
  if (!el || el.scrollHeight <= el.clientHeight) return 0
  return Math.min(1, (el.scrollTop + el.clientHeight) / el.scrollHeight)
}

/** A Google vignette (full-screen ad) is showing: AdSense marks the address with #google_vignette. */
const googleOverlay = () => window.location.hash === '#google_vignette'

/** Elements Google's ads add, which are not Monetag's. */
const isGoogle = (el: Element) =>
  el.tagName === 'INS' || /^(google_|aswift)/.test(el.id) || el.classList.contains('adsbygoogle') || el.querySelector('iframe[id^="aswift"], iframe[id^="google_"]') !== null

/** Loads Monetag's script (exactly what Monetag's own tag does), then watches for the card being closed. */
function loadTag(onClose: () => void): () => void {
  const s = document.createElement('script')
  s.dataset.zone = ZONE
  s.src = TAG
  // Monetag's tag appends to <body> (or <html> before the body exists).
  ;[document.documentElement, document.body].filter(Boolean).pop()!.appendChild(s)

  // Hosts the site's security policy refuses while Monetag runs, once each.
  const reported = new Set<string>()
  const onBlocked = (e: SecurityPolicyViolationEvent) => {
    let host = e.blockedURI
    try {
      host = new URL(e.blockedURI).host
    } catch {
      // "inline", "eval" and the like.
    }
    if (reported.has(host)) return
    reported.add(host)
    track('monetag_blocked_host', { host, directive: e.effectiveDirective })
  }
  document.addEventListener('securitypolicyviolation', onBlocked)

  // A card Monetag adds that disappears within 2 seconds of a tap on it was closed
  // (or opened, which also ends it). Its own elements are whatever it adds to
  // <body> or <html> from now on, other than scripts and Google's ads.
  const theirs = new Set<Element>()
  let tappedAt = 0
  let tapped: Element | null = null
  const onTap = (e: Event) => {
    const t = e.target as Node | null
    for (const el of theirs) {
      if (t && (el === t || el.contains(t))) {
        tapped = el
        tappedAt = Date.now()
        return
      }
    }
  }
  const gone = (el: Element) =>
    !el.isConnected || ((el as HTMLElement).offsetParent === null && getComputedStyle(el).position !== 'fixed') || el.getBoundingClientRect().height === 0
  const check = () => {
    if (tapped && Date.now() - tappedAt < 2000 && gone(tapped)) {
      theirs.delete(tapped)
      tapped = null
      onClose()
    }
  }
  const observer = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'childList' && (r.target === document.body || r.target === document.documentElement)) {
        r.addedNodes.forEach((n) => {
          if (n instanceof Element && !['SCRIPT', 'STYLE', 'LINK', 'NOSCRIPT'].includes(n.tagName) && !isGoogle(n)) theirs.add(n)
        })
      }
    }
    check()
  })
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'hidden'] })
  document.addEventListener('pointerdown', onTap, true)
  return () => {
    observer.disconnect()
    document.removeEventListener('pointerdown', onTap, true)
    document.removeEventListener('securitypolicyviolation', onBlocked)
  }
}

/** The first page of the visit, as counted when this document's current page opened. */
let firstOfVisit = true

/**
 * Loads Monetag's In-Page Push when the rules allow (see the top of this file).
 * Called once, by the root component, with the current path.
 */
export function useMonetag(pathname: string) {
  const { user } = useAuth()
  const { access, loading } = useAccess()
  // A page that does not exist: a data page's notFound() (the router marks a match, or the root, with it), or an
  // unknown address (the catch-all route, src/routes/$.tsx).
  const missing = useRouterState({
    select: (st) => st.matches.some((m) => m.status === 'notFound' || (m.error as { isNotFound?: boolean } | undefined)?.isNotFound === true || m.routeId === '/$'),
  })

  // Every page counts towards the visit, wherever the ad may show.
  useEffect(() => {
    const now = Date.now()
    const { state, firstOfVisit: first } = pageOpened(readState(), now)
    firstOfVisit = first
    writeState(state)
  }, [pathname])

  // Only once the page has finished loading: before that, a page that turns out not to exist looks like any other.
  const settled = useRouterState({ select: (st) => st.status === 'idle' && !st.isLoading })

  const subscriber = !!user && (loading || access.hasAccess)
  useEffect(() => {
    const signedIn = !!user || hasStoredSession()
    const w = window as unknown as { __wtAdsPaused?: number }
    if (!settled || !monetagPathAllowed(pathname, signedIn) || missing || subscriber || w.__wtAdsPaused || document.documentElement.classList.contains('native-app')) return
    if (monetagLoaded()) return

    const byHand = new URLSearchParams(window.location.search).get('monetag') === 'now'
    const opened = Date.now()
    let activeMs = 0
    let lastActive = opened
    let lastTap = 0
    let scrolled = scrolledFraction(null)
    let stopWatching: (() => void) | null = null

    const onScroll = (e: Event) => {
      scrolled = Math.max(scrolled, scrolledFraction(e.target === document ? null : e.target))
      lastActive = Date.now()
    }
    const onTap = () => {
      lastTap = Date.now()
      lastActive = lastTap
    }
    document.addEventListener('scroll', onScroll, { capture: true, passive: true })
    document.addEventListener('pointerdown', onTap, { capture: true, passive: true })
    document.addEventListener('keydown', onTap, true)

    let tick = 0
    const stop = () => {
      window.clearInterval(tick)
      document.removeEventListener('scroll', onScroll, true)
      document.removeEventListener('pointerdown', onTap, true)
      document.removeEventListener('keydown', onTap, true)
    }
    const load = () => {
      stop()
      const go = () => {
        if (monetagLoaded()) return
        if (!byHand) writeState(loaded(readState(), Date.now()))
        track('monetag_load', { first_page: firstOfVisit, by_hand: byHand })
        stopWatching = loadTag(() => {
          writeState(closed(readState(), Date.now()))
          track('monetag_closed', { closes_today: readState().closes })
        })
      }
      // After the page's own work: the script is about 150 KB.
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(go, { timeout: 2000 })
      else setTimeout(go, 500)
    }

    tick = window.setInterval(() => {
      const now = Date.now()
      // Active reading: the page is on screen and the visitor scrolled, tapped or typed in the last 20 seconds.
      if (document.visibilityState === 'visible' && now - lastActive < 20000) activeMs += 1000
      if (byHand) {
        if (now - lastTap >= 3000) load()
        return
      }
      const v = verdict(readState(), now, { firstOfVisit, activeSeconds: activeMs / 1000, scrolled, quietMs: now - lastTap, googleOverlay: googleOverlay() })
      if (v === 'load') load()
      else if (v === 'not-today') stop()
    }, 1000)

    return () => {
      stop()
      stopWatching?.()
    }
  }, [pathname, user, subscriber, missing, settled])
}
