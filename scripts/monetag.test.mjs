// Tests for the Monetag test's rules (src/lib/monetag-rules.ts). Run: npm run monetag:test
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { EMPTY_STATE, RULES, closed, loaded, localDay, pageOpened, parseState, verdict } from '../src/lib/monetag-rules.ts'

const T0 = new Date(2026, 10, 26, 9, 0, 0).getTime() // 26 Nov 2026, 09:00 local
const MIN = 60 * 1000
const reading = (over = {}) => ({ firstOfVisit: false, activeSeconds: 0, scrolled: 0, quietMs: 10000, googleOverlay: false, ...over })

test('the first page of a visit: nothing on arrival, only after 10 s of active reading', () => {
  const { state, firstOfVisit } = pageOpened(EMPTY_STATE, T0)
  assert.equal(firstOfVisit, true)
  assert.equal(verdict(state, T0, reading({ firstOfVisit: true })), 'wait')
  assert.equal(verdict(state, T0, reading({ firstOfVisit: true, activeSeconds: 9 })), 'wait')
  assert.equal(verdict(state, T0, reading({ firstOfVisit: true, activeSeconds: 10 })), 'load')
  assert.equal(verdict(state, T0, reading({ firstOfVisit: true, activeSeconds: 10, quietMs: 500 })), 'wait')
})

test('the second page of a visit may show it; 30 minutes away starts a new visit', () => {
  let s = pageOpened(EMPTY_STATE, T0).state
  const second = pageOpened(s, T0 + 2 * MIN)
  assert.equal(second.firstOfVisit, false)
  assert.equal(verdict(second.state, T0 + 2 * MIN, reading()), 'load')
  s = second.state
  const later = pageOpened(s, T0 + 2 * MIN + RULES.visitGapMs + 1)
  assert.equal(later.firstOfVisit, true)
})

test('never mid-task, never over a Google full-screen ad', () => {
  const s = pageOpened(pageOpened(EMPTY_STATE, T0).state, T0 + MIN).state
  assert.equal(verdict(s, T0 + MIN, reading({ quietMs: 1000 })), 'wait')
  assert.equal(verdict(s, T0 + MIN, reading({ googleOverlay: true })), 'wait')
})

test('10 minutes apart, at most 3 a day, counts start again the next day', () => {
  let s = loaded(EMPTY_STATE, T0)
  assert.equal(verdict(s, T0 + 9 * MIN, reading()), 'wait')
  assert.equal(verdict(s, T0 + 10 * MIN, reading()), 'load')
  s = loaded(loaded(s, T0 + 10 * MIN), T0 + 20 * MIN)
  assert.equal(s.loads, 3)
  assert.equal(verdict(s, T0 + 40 * MIN, reading()), 'not-today')
  const tomorrow = new Date(2026, 10, 27, 9, 0, 0).getTime()
  assert.equal(verdict(s, tomorrow, reading()), 'load')
})

test('closed twice in a day: none for 24 hours', () => {
  let s = closed(loaded(EMPTY_STATE, T0), T0 + MIN)
  assert.equal(verdict(s, T0 + 30 * MIN, reading()), 'load')
  s = closed(s, T0 + 31 * MIN)
  assert.equal(verdict(s, T0 + 60 * MIN, reading()), 'not-today')
  assert.equal(verdict(s, T0 + 31 * MIN + RULES.pauseMs - 1, reading()), 'not-today')
  assert.equal(verdict(s, T0 + 31 * MIN + RULES.pauseMs + 1, reading()), 'load')
})

test('stored state: anything malformed reads as a new visitor', () => {
  assert.deepEqual(parseState(null), EMPTY_STATE)
  assert.deepEqual(parseState('not json'), EMPTY_STATE)
  assert.deepEqual(parseState('{"loads":"x","day":5}'), EMPTY_STATE)
  assert.equal(localDay(T0), '2026-11-26')
})
