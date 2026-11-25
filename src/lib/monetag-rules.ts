// The rules for Monetag's In-Page Push test (src/lib/monetag.ts), kept free of
// the browser so they can be tested (scripts/monetag.test.mjs).
//
// Industry practice for ads that feel grown-up rather than spammy: nothing on
// arrival, ads only once a visitor is clearly reading, never while they are
// in the middle of something, a cap per visit and per day, and a visitor who
// keeps closing the ad stops seeing it.

export const RULES = {
  /** A visit ends after this long without a new page (the same as Google Analytics' sessions). */
  visitGapMs: 30 * 60 * 1000,
  /**
   * On the first page of a visit: seconds of active reading, and how far down the page, before an ad.
   * 10 s and no scroll since 25 November 2026 (was 45 s and 40% of the page): the stricter gate let too
   * few page views qualify to measure the test.
   */
  firstPageSeconds: 10,
  firstPageScroll: 0,
  /** No ad within this long of a tap or key press (choosing an answer, typing). */
  quietMs: 3000,
  /** At least this long between two loads, and at most this many loads in a day. */
  minGapMs: 10 * 60 * 1000,
  perDay: 3,
  /** Closed this many times in a day: no Monetag ads for pauseMs. */
  closesBeforePause: 2,
  pauseMs: 24 * 60 * 60 * 1000,
} as const

/** What is remembered for one visitor (localStorage). */
export type MonetagState = {
  /** When the visit's latest page opened (ms). */
  visitAt: number
  /** Pages opened in this visit. */
  pages: number
  /** The local date the day's counts are for (YYYY-MM-DD). */
  day: string
  loads: number
  lastLoad: number
  closes: number
  pausedUntil: number
}

export const EMPTY_STATE: MonetagState = { visitAt: 0, pages: 0, day: '', loads: 0, lastLoad: 0, closes: 0, pausedUntil: 0 }

/** The local date of a time, as YYYY-MM-DD. */
export function localDay(now: number): string {
  const d = new Date(now)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** A new day starts the day's counts again (the pause, which may run into the next day, is kept). */
function forToday(s: MonetagState, now: number): MonetagState {
  const day = localDay(now)
  return s.day === day ? s : { ...s, day, loads: 0, closes: 0 }
}

/** A page opened: counts it in the visit (a new visit after 30 minutes away). Returns the new state and whether it is the visit's first page. */
export function pageOpened(s: MonetagState, now: number): { state: MonetagState; firstOfVisit: boolean } {
  const today = forToday(s, now)
  const firstOfVisit = now - today.visitAt > RULES.visitGapMs || today.pages === 0
  return { state: { ...today, visitAt: now, pages: firstOfVisit ? 1 : today.pages + 1 }, firstOfVisit }
}

/** What is known about the page being read right now. */
export type PageNow = {
  firstOfVisit: boolean
  /** Seconds the page has been visible while the visitor was active on it. */
  activeSeconds: number
  /** The furthest the visitor has scrolled, 0 to 1. */
  scrolled: number
  /** Milliseconds since the last tap or key press. */
  quietMs: number
  /** A Google full-screen ad (vignette) is showing. */
  googleOverlay: boolean
}

/**
 * Whether to load the ad now: "load", "wait" (ask again in a moment), or
 * "not-today" (paused or the day's cap is reached: stop asking on this page).
 */
export function verdict(s: MonetagState, now: number, page: PageNow): 'load' | 'wait' | 'not-today' {
  const today = forToday(s, now)
  if (today.pausedUntil > now || today.loads >= RULES.perDay) return 'not-today'
  if (now - today.lastLoad < RULES.minGapMs) return 'wait'
  const engaged = !page.firstOfVisit || (page.activeSeconds >= RULES.firstPageSeconds && page.scrolled >= RULES.firstPageScroll)
  if (!engaged || page.quietMs < RULES.quietMs || page.googleOverlay) return 'wait'
  return 'load'
}

/** The ad was loaded. */
export function loaded(s: MonetagState, now: number): MonetagState {
  const today = forToday(s, now)
  return { ...today, loads: today.loads + 1, lastLoad: now }
}

/** The visitor closed the ad: the second close in a day pauses Monetag for a day. */
export function closed(s: MonetagState, now: number): MonetagState {
  const today = forToday(s, now)
  const closes = today.closes + 1
  return { ...today, closes, pausedUntil: closes >= RULES.closesBeforePause ? now + RULES.pauseMs : today.pausedUntil }
}

/** Reads stored state, tolerating anything malformed. */
export function parseState(raw: string | null): MonetagState {
  try {
    const v = JSON.parse(raw ?? '') as Partial<MonetagState>
    const num = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) ? x : 0)
    return {
      visitAt: num(v.visitAt),
      pages: num(v.pages),
      day: typeof v.day === 'string' ? v.day : '',
      loads: num(v.loads),
      lastLoad: num(v.lastLoad),
      closes: num(v.closes),
      pausedUntil: num(v.pausedUntil),
    }
  } catch {
    return { ...EMPTY_STATE }
  }
}
