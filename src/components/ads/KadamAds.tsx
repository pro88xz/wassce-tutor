// Kadam display ads: a banner at the top of public pages (728×90 on a computer,
// 320×50 on a phone) and a 300×250 unit inside lessons, topics, subjects and
// long blog articles.
//
// Where: public pages only (src/lib/ads.ts), never Privacy, Terms or Contact, a
// page that does not exist, the Android app, or anyone with a plan. Slots are
// added in the browser only, so the prerendered HTML never carries one and
// hydration always matches.
//
// No blank space when there is no advert. Until Kadam puts an advert in a slot,
// the slot is laid out at the advert's size, because Kadam's script needs a
// visible box of real size to measure and fill. A display:none slot is never
// filled. But it takes no room in the page: no height, no margin, and taps pass
// through it. Once an advert is in it (an image, frame or video at least 50×30),
// the slot takes its place in the page; if the advert goes, it collapses again.
//
// Each slot that appears queues its unit and runs Kadam's script again, as
// Kadam's own tag does, so moving between pages in the browser fills the new
// page's slot, not only the first page's.
//
// Google Analytics receives kadam_blocked_host for any host the site's security
// policy (scripts/csp.mjs) refused to Kadam's script, so an advert held back by
// the policy shows which host to allow.
import { useEffect, useRef, useSyncExternalStore } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { adsAllowed, hasStoredSession } from '@/lib/ads'
import { track } from '@/lib/analytics'
import { useAuth } from '@/lib/auth'
import { useAccess } from '@/lib/useAccess'

type Unit = {
  id: string
  script: string
  width: number
  height: number
}

const DOMAIN = 'hdbkome.com'

const DESKTOP: Unit = { id: 'FgzfTN456521', script: `https://${DOMAIN}/qzzhzgnh.js`, width: 728, height: 90 }
const MOBILE: Unit = { id: 'dSbdHR456522', script: `https://${DOMAIN}/s7ag2adk.js`, width: 320, height: 50 }
const IN_CONTENT: Unit = { id: 'KZzGaH456523', script: `https://${DOMAIN}/qf932sdd.js`, width: 300, height: 250 }

/** The desktop banner from this width; the phone banner below it. */
const WIDE = '(min-width: 800px)'

type KadamEntry = { id: string; type: string; domain: string; refresh: boolean; next: number }

declare global {
  interface Window {
    k_init?: KadamEntry[]
  }
}

/** Public pages Kadam must not show on (besides the app's pages and "/" when signed in, as for AdSense). */
const NOT_HERE = /^\/(privacy|terms|contact)(\/|$)/

const noSubscribe = () => () => {}

/** False on the server and while the prerendered page hydrates; true after. */
function useInBrowser(): boolean {
  return useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  )
}

/** Whether Kadam units may show on this page. */
function useKadamAllowed(): boolean {
  const inBrowser = useInBrowser()
  const pathname = useRouterState({ select: (st) => st.location.pathname })
  // A page that does not exist: a data page's notFound() (the router marks a match, or the root, with it), or an
  // unknown address (the catch-all route, src/routes/$.tsx).
  const missing = useRouterState({
    select: (st) =>
      st.matches.some(
        (m) => m.status === 'notFound' || (m.error as { isNotFound?: boolean } | undefined)?.isNotFound === true || m.routeId === '/$',
      ),
  })
  const { user } = useAuth()
  const { access, loading } = useAccess()
  if (!inBrowser || loading || access.hasAccess || missing || NOT_HERE.test(pathname)) return false
  if (!adsAllowed(pathname, !!user || hasStoredSession())) return false
  // Paused by the boot script (src/routes/__root.tsx): the Android app, or the student's dashboard.
  const w = window as unknown as { __wtAdsPaused?: number }
  return !w.__wtAdsPaused && !document.documentElement.classList.contains('native-app')
}

/** Reports hosts the security policy refused to Kadam's script, once each per page load. */
let watchingPolicy = false
function reportBlockedHosts() {
  if (watchingPolicy) return
  watchingPolicy = true
  const reported = new Set<string>()
  document.addEventListener('securitypolicyviolation', (e) => {
    let source: string
    try {
      source = new URL(e.sourceFile).host
    } catch {
      return
    }
    if (source !== DOMAIN && !source.endsWith(`.${DOMAIN}`)) return
    let host = e.blockedURI
    try {
      host = new URL(e.blockedURI).host
    } catch {
      // "inline", "eval" and the like.
    }
    if (reported.has(host)) return
    reported.add(host)
    track('kadam_blocked_host', { host, directive: e.effectiveDirective })
  })
}

/** Queues the unit and runs Kadam's script, which fills the unit's slots on the page. */
function loadUnit(unit: Unit) {
  reportBlockedHosts()
  const queue = (window.k_init ??= [])
  // An entry left by an earlier slot of this unit (an earlier page) is not needed again.
  if (Array.isArray(queue)) {
    for (let i = queue.length - 1; i >= 0; i--) if (queue[i]?.id === unit.id) queue.splice(i, 1)
  }
  queue.push({ id: unit.id, type: 'bn', domain: DOMAIN, refresh: false, next: 0 })

  // A new script element runs every time, even when the file is cached.
  const s = document.createElement('script')
  s.async = true
  s.charset = 'utf-8'
  s.setAttribute('data-cfasync', 'false')
  s.dataset.kadamUnit = unit.id
  s.src = unit.script
  // It has run once it has loaded (or failed): the element is not needed after that.
  s.onload = s.onerror = () => s.remove()
  document.head.appendChild(s)
}

/** What an advert is made of; anything smaller than an advert (a tracking pixel, a close icon) does not count. */
const CREATIVE = 'iframe, img, video, canvas, object, embed, svg'
const MIN_W = 50
const MIN_H = 30

/** Kadam has put a visible advert in the slot (or beside it, should it replace the slot's element). */
function hasAdvert(frame: HTMLElement): boolean {
  for (const el of frame.querySelectorAll('*')) {
    if (!el.matches(CREATIVE) && getComputedStyle(el).backgroundImage === 'none') continue
    const r = el.getBoundingClientRect()
    if (r.width >= MIN_W && r.height >= MIN_H && getComputedStyle(el).visibility !== 'hidden') return true
  }
  return false
}

/**
 * One Kadam unit. `filledClass` is the room it takes (its margins) once an advert
 * is in it; until then it takes none (see the top of this file).
 */
function KadamSlot({ unit, filledClass }: { unit: Unit; filledClass: string }) {
  const frameRef = useRef<HTMLDivElement>(null)

  // Show the slot exactly while an advert is in it.
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    let raf = 0
    const sync = () => {
      raf = 0
      const filled = hasAdvert(frame)
      frame.toggleAttribute('data-filled', filled)
      if (filled) frame.removeAttribute('aria-hidden')
      else frame.setAttribute('aria-hidden', 'true')
    }
    const later = () => {
      if (!raf) raf = requestAnimationFrame(sync)
    }
    sync()
    // Kadam adding or changing the advert, an image or frame finishing loading, or the advert changing size.
    // (Not the frame's own data-filled and aria-hidden, which this sets.)
    const mutations = new MutationObserver(later)
    mutations.observe(frame, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'style', 'class', 'width', 'height', 'hidden'] })
    const sizes = new ResizeObserver(later)
    for (const el of [frame, ...frame.children]) sizes.observe(el)
    frame.addEventListener('load', later, true)
    return () => {
      mutations.disconnect()
      sizes.disconnect()
      frame.removeEventListener('load', later, true)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Load the unit once this slot is on the page. A tick later, so React's development
  // double mount (StrictMode) loads it once, not twice.
  useEffect(() => {
    const t = window.setTimeout(() => loadUnit(unit), 0)
    return () => window.clearTimeout(t)
  }, [unit])

  return (
    <div
      ref={frameRef}
      aria-label="Advertisement"
      aria-hidden="true"
      data-kadam-slot={unit.id}
      // Empty: no height and no margin (important, so a parent's space-y-* adds none either), taps pass through.
      // Filled: its own height, its margins, taps reach the advert.
      className={`pointer-events-none m-0! flex h-0 w-full justify-center data-filled:pointer-events-auto data-filled:h-auto ${filledClass}`}
    >
      <div className={unit.id} style={{ width: `min(${unit.width}px, 100%)`, minHeight: unit.height, overflow: 'hidden' }} />
    </div>
  )
}

const subscribeWide = (onChange: () => void) => {
  const media = window.matchMedia(WIDE)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

/** The banner at the top of public pages: the desktop unit on a wide screen, the phone unit otherwise. */
export function KadamBanner() {
  const allowed = useKadamAllowed()
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => false,
  )
  if (!allowed) return null
  const unit = wide ? DESKTOP : MOBILE
  // A new slot when the unit changes, so Kadam fills a fresh element.
  return <KadamSlot key={unit.id} unit={unit} filledClass="data-filled:mb-6!" />
}

/** The 300×250 unit inside a lesson, topic, subject or blog article. */
export function KadamInContent() {
  const allowed = useKadamAllowed()
  if (!allowed) return null
  return <KadamSlot unit={IN_CONTENT} filledClass="data-filled:my-10!" />
}
