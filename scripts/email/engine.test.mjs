// Tests for the email engine: npm run email:test
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { test } from 'node:test'
import { mergeConfig } from '../../api/_lib/email/config.js'
import { addStudyExtras, addWeekData, runEngine } from '../../api/_lib/email/engine.js'
import { renderEmail } from '../../api/_lib/email/layout.js'
import { sendViaResend } from '../../api/_lib/email/resend.js'
import { firstName, planForStudent, rankCandidates, snapshotFromRow, weekOf } from '../../api/_lib/email/rules.js'
import { SAMPLES, TEMPLATES, withStudyExtras } from '../../api/_lib/email/templates.js'
import { clickSignature, safePath, unsubscribeToken, verifyClick, verifyUnsubscribeToken } from '../../api/_lib/email/tokens.js'
import { verifyResendSignature } from '../../api/_lib/email/webhook-signature.js'

const HOUR = 3_600_000
const DAY = 24 * HOUR
// A Wednesday: outside the weekly email's Sunday–Tuesday window, so other rules are tested on their own.
const NOW = Date.parse('2026-11-18T10:00:00Z')
const ago = (ms) => new Date(NOW - ms).toISOString()
const ahead = (ms) => new Date(NOW + ms).toISOString()
const SECRET = 'x'.repeat(40)
const UID = '11111111-2222-3333-4444-555555555555'

/** A database row from email_audience(), with sensible defaults. */
function row(over = {}) {
  return {
    user_id: UID,
    email: 'ama@example.com',
    email_confirmed: true,
    full_name: 'ama kamara',
    account_intent: 'student',
    created_at: ago(60 * DAY),
    last_sign_in_at: ago(1 * DAY),
    last_study_at: ago(1 * DAY),
    lessons_completed: 5,
    practice_attempts: 1,
    last_subject_id: 'b1',
    last_subject_name: 'Biology',
    access_active: false,
    access_until: null,
    access_plan: null,
    open_payment_id: null,
    paid_payment_id: null,
    marketing_status: 'subscribed',
    suppressed: false,
    history: [],
    ...over,
  }
}
const plan = (over, now = NOW) => planForStudent(snapshotFromRow(row(over)), now)
const pending = (age, extra = {}) => ({
  open_payment_id: 'pay1', open_payment_plan: 'term', open_payment_amount: 25, open_payment_created_at: ago(age), ...extra,
})
const sentItem = (programme, step, anchor, at, category = 'marketing', status = 'sent') => ({ programme, step, anchor, category, status, at: ago(at) })

// ── Rules ───────────────────────────────────────────────────────────────────
test('pending payment: first nudge after 2 hours, with the plan and checkout link', () => {
  assert.equal(plan(pending(1 * HOUR)).skip, 'nothing_due')
  const { email } = plan(pending(3 * HOUR))
  assert.equal(email.programme, 'pending_payment')
  assert.equal(email.templateKey, 'pending_payment_1')
  assert.equal(email.idempotencyKey, `pending_payment:1:${UID}:pay1`)
  assert.equal(email.payload.links.cta, '/subscribe?plan=term')
  assert.equal(email.payload.firstName, 'Ama')
})

test('pending payment: second nudge 3 days after the first, then nothing', () => {
  const first = sentItem('pending_payment', 1, 'pay1', 2 * DAY)
  assert.equal(plan(pending(3 * DAY, { history: [first] })).skip, 'nothing_due', 'not before 3 days')
  const later = sentItem('pending_payment', 1, 'pay1', 3 * DAY + HOUR)
  assert.equal(plan(pending(4 * DAY, { history: [later] })).email.templateKey, 'pending_payment_2')
  const both = [sentItem('pending_payment', 1, 'pay1', 8 * DAY), sentItem('pending_payment', 2, 'pay1', 4 * DAY)]
  assert.equal(plan(pending(9 * DAY, { history: both })).email?.programme === 'pending_payment', false)
})

test('pending payment: stops when paid, when access is active, and after 30 days', () => {
  assert.equal(plan(pending(3 * HOUR, { access_active: true, access_until: ahead(20 * DAY) })).email?.programme === 'pending_payment', false)
  assert.equal(plan(pending(20 * DAY)).email?.programme, 'pending_payment', 'a 20-day-old checkout still gets its nudge')
  assert.equal(plan(pending(31 * DAY)).email?.programme === 'pending_payment', false)
})

test('pending payment needs marketing consent; account emails do not', () => {
  assert.equal(plan(pending(3 * HOUR, { marketing_status: 'unsubscribed' })).skip, 'not_subscribed')
  const paid = { paid_payment_id: 'pay9', paid_plan: 'term', paid_amount: 25, paid_at: ago(1 * DAY), access_active: true, access_until: ahead(29 * DAY), access_plan: 'term' }
  const { email } = plan({ ...paid, marketing_status: 'unsubscribed' })
  assert.equal(email.programme, 'access_started')
  assert.equal(email.category, 'service')
})

test('access started: once per payment, within 3 days', () => {
  const paid = { paid_payment_id: 'pay9', paid_plan: 'term', paid_amount: 25, paid_at: ago(1 * DAY), access_active: true, access_until: ahead(29 * DAY), access_plan: 'term' }
  assert.equal(plan(paid).email.idempotencyKey, `access_started:1:${UID}:pay9`)
  assert.notEqual(plan({ ...paid, history: [sentItem('access_started', 1, 'pay9', 25 * HOUR, 'service')] }).email?.programme, 'access_started')
  assert.notEqual(plan({ ...paid, paid_at: ago(4 * DAY) }).email?.programme, 'access_started')
})

test('access ending: 3 days before, once per end date, not while renewing', () => {
  const ending = { access_active: true, access_until: ahead(2 * DAY), access_plan: 'term' }
  const { email } = plan(ending)
  assert.equal(email.programme, 'access_ending')
  assert.equal(email.anchor, ahead(2 * DAY).slice(0, 10))
  assert.equal(plan({ ...ending, access_until: ahead(5 * DAY) }).email?.programme === 'access_ending', false)
  assert.equal(plan({ ...ending, ...pending(3 * HOUR) }).email?.programme === 'access_ending', false)
})

test('activation: new account that has not studied, after a day', () => {
  const fresh = { created_at: ago(2 * DAY), last_sign_in_at: ago(2 * DAY), last_study_at: null, lessons_completed: 0, practice_attempts: 0 }
  assert.equal(plan(fresh).email.templateKey, 'activation_1')
  assert.equal(plan({ ...fresh, created_at: ago(3 * HOUR) }).skip, 'nothing_due')
  assert.equal(plan({ ...fresh, lessons_completed: 1, last_study_at: ago(1 * DAY) }).email, undefined)
  const second = { ...fresh, created_at: ago(6 * DAY), history: [sentItem('activation', 1, 'account', 5 * DAY)] }
  assert.equal(plan(second).email.templateKey, 'activation_2')
})

test('re-engagement: after 7 days without study or sign-in, naming the last subject', () => {
  const away = { last_study_at: ago(10 * DAY), last_sign_in_at: ago(9 * DAY) }
  const { email } = plan(away)
  assert.equal(email.templateKey, 'reengage_1')
  assert.equal(email.payload.subject.name, 'Biology')
  assert.equal(email.payload.links.cta, '/subject/b1')
  assert.equal(plan({ ...away, last_sign_in_at: ago(2 * DAY) }).skip, 'nothing_due')
  assert.equal(plan({ last_study_at: ago(400 * DAY), last_sign_in_at: ago(400 * DAY) }).skip, 'nothing_due')
})

test('re-engagement: a second reminder a week later, then it stops', () => {
  const anchor = ago(20 * DAY).slice(0, 10)
  const base = { last_study_at: ago(20 * DAY), last_sign_in_at: ago(20 * DAY) }
  assert.equal(plan({ ...base, history: [sentItem('reengage', 1, anchor, 8 * DAY)] }).email.templateKey, 'reengage_2')
  assert.equal(plan({ ...base, history: [sentItem('reengage', 1, anchor, 3 * DAY)] }).skip, 'nothing_due', 'not before 7 days')
  const done = [sentItem('reengage', 1, anchor, 15 * DAY), sentItem('reengage', 2, anchor, 8 * DAY)]
  assert.equal(plan({ ...base, history: done }).skip, 'nothing_due')
})

test('re-engagement for a paying student mentions their access', () => {
  const { email } = plan({ last_study_at: ago(10 * DAY), last_sign_in_at: ago(10 * DAY), access_active: true, access_until: ahead(15 * DAY), access_plan: 'term' })
  assert.equal(email.programme, 'reengage')
  assert.equal(email.payload.access.plan, 'term')
})

test('caps: one email a day, two marketing emails a week, 48 hours between them', () => {
  const away = { last_study_at: ago(10 * DAY), last_sign_in_at: ago(10 * DAY) }
  assert.equal(plan({ ...away, history: [sentItem('access_started', 1, 'x', 10 * HOUR, 'service')] }).skip, 'emailed_recently')
  assert.equal(plan({ ...away, history: [sentItem('pending_payment', 1, 'x', 30 * HOUR)] }).skip, 'marketing_gap')
  const twoThisWeek = [sentItem('pending_payment', 1, 'x', 6 * DAY), sentItem('pending_payment', 2, 'x', 3 * DAY)]
  assert.equal(plan({ ...away, history: twoThisWeek }).skip, 'weekly_cap')
})

test('never emails unconfirmed, suppressed or address-less accounts; tutors get no study nudges', () => {
  assert.equal(plan({ email_confirmed: false }).skip, 'unconfirmed')
  assert.equal(plan({ suppressed: true }).skip, 'suppressed')
  assert.equal(plan({ email: null }).skip, 'no_email')
  assert.equal(plan({ account_intent: 'tutor', last_study_at: null, last_sign_in_at: ago(30 * DAY), lessons_completed: 0, practice_attempts: 0 }).skip, 'nothing_due')
})

test('gives up on a key after 3 failed sends', () => {
  const failed = [1, 2, 3].map((i) => sentItem('pending_payment', 1, 'pay1', i * HOUR, 'marketing', 'failed'))
  assert.equal(plan(pending(3 * HOUR, { history: failed })).skip, 'nothing_due')
})

test('ranking: account emails first, then payments, activation, re-engagement', () => {
  const ranked = rankCandidates([
    { programme: 'reengage', priority: 5, step: 1, sortAt: 1 },
    { programme: 'access_started', priority: 1, step: 1, sortAt: 9 },
    { programme: 'pending_payment', priority: 3, step: 1, sortAt: 5 },
  ])
  assert.deepEqual(ranked.map((r) => r.programme), ['access_started', 'pending_payment', 'reengage'])
})

test('first names: friendly, or a neutral greeting', () => {
  assert.equal(firstName('fatu'), 'Fatu')
  assert.equal(firstName("Mary-Jane O'Neil"), 'Mary-Jane')
  assert.equal(firstName('  Ìsátà Conteh '), 'Ìsátà')
  assert.equal(firstName(''), null)
  assert.equal(firstName('12345'), null)
  assert.equal(firstName('a'), null)
  assert.equal(firstName('<script>'), null)
})

// ── Templates ───────────────────────────────────────────────────────────────
const STATS = { subjects: 18, lessons: 673, questions: 1568 }
const ctx = (category) => ({
  site: 'https://wasscetutor.com',
  contact: { phoneDisplay: '+232 77 884195' },
  url: (k) => `https://wasscetutor.com/api/email/c?l=${k}`,
  displayUrl: () => 'wasscetutor.com/subjects',
  unsubscribeUrl: category === 'marketing' ? 'https://wasscetutor.com/api/email/unsubscribe?t=abc' : null,
  preferencesUrl: 'https://wasscetutor.com/account',
})

for (const key of Object.keys(TEMPLATES)) {
  test(`template ${key}: renders branded HTML and text with no gaps`, () => {
    for (const stats of [STATS, null]) {
      const content = TEMPLATES[key](SAMPLES[key], { stats })
      const { html, text } = renderEmail(content, ctx(content.category))
      assert.match(html, /https:\/\/wasscetutor\.com\/brand\/email-logo\.png/)
      assert.match(html, /alt="WASSCE Tutor"/)
      assert.match(html, /Not affiliated with WAEC/)
      assert.ok(content.subject.length <= 70, `subject too long: ${content.subject}`)
      assert.ok(text.includes(content.cta.label))
      if (content.category === 'marketing') assert.match(text, /Unsubscribe: https:/)
      else assert.doesNotMatch(html, /Unsubscribe/)
      assert.doesNotMatch(html + text, /\{\{|undefined|NaN|null/)
    }
  })
}

test('templates use live counts and real prices', () => {
  const c = TEMPLATES.pending_payment_1(SAMPLES.pending_payment_1, { stats: STATS })
  assert.ok(c.lists[0].items[0].includes('AI study tutor'), 'a plan adds the study tutor')
  assert.ok(c.lists[0].items.some((i) => i.includes('mock exams')), 'and the mock exams')
  assert.ok(!c.lists[0].items.some((i) => /every lesson/i.test(i)), 'lessons are free, not sold')
  assert.ok(c.after[0].includes('NLe 25 for 1 month'))
  const both = TEMPLATES.pending_payment_2(SAMPLES.pending_payment_2, { stats: STATS })
  assert.ok(both.lists[0].items[0].includes('673 lessons across 18 subjects'), 'free list has the live lesson count')
  assert.ok(both.lists[0].items[1].includes('1,568 questions'), 'and the live question count')
  assert.equal(TEMPLATES.pending_payment_1({ ...SAMPLES.pending_payment_1, plan: 'year' }, { stats: STATS }).subject, 'Your Yearly access is one step away')
})

test('names and subjects are escaped in HTML', () => {
  const content = TEMPLATES.reengage_1({ firstName: 'Ama', studied: true, subject: { id: 'x', name: 'Biology & <Health>' }, access: null }, { stats: STATS })
  const { html } = renderEmail(content, ctx('marketing'))
  assert.match(html, /Biology &amp; &lt;Health&gt;/)
  assert.doesNotMatch(html, /<Health>/)
})

test('a template with a hole is refused, not sent', () => {
  assert.throws(() => renderEmail({ subject: 'Hi {{name}}', headline: 'x', cta: { label: 'Go', link: 'cta' } }, ctx('marketing')))
  assert.throws(() => renderEmail({ subject: 'Hi', headline: 'Hello undefined', cta: { label: 'Go', link: 'cta' } }, ctx('marketing')))
})

// ── Signed links ────────────────────────────────────────────────────────────
test('unsubscribe tokens: valid, forged, wrong secret, expired', () => {
  const t = unsubscribeToken(SECRET, UID, NOW)
  assert.equal(verifyUnsubscribeToken(SECRET, t, NOW + 100 * DAY), UID)
  assert.equal(verifyUnsubscribeToken('y'.repeat(40), t, NOW), null)
  assert.equal(verifyUnsubscribeToken(SECRET, t, NOW + 401 * DAY), null)
  const [body] = t.split('.')
  const other = Buffer.from(`99999999-2222-3333-4444-555555555555.${Buffer.from(body, 'base64url').toString().split('.')[1]}`).toString('base64url')
  assert.equal(verifyUnsubscribeToken(SECRET, `${other}.${t.split('.')[1]}`, NOW), null)
  assert.equal(verifyUnsubscribeToken(SECRET, 'garbage', NOW), null)
})

test('click links are signed, and only our own paths are followed', () => {
  const s = clickSignature(SECRET, UID, 'cta')
  assert.ok(verifyClick(SECRET, UID, 'cta', s))
  assert.ok(!verifyClick(SECRET, UID, 'other', s))
  assert.ok(!verifyClick(SECRET, 'not-a-uuid', 'cta', s))
  assert.equal(safePath('/subscribe?plan=term'), '/subscribe?plan=term')
  assert.equal(safePath('//evil.example'), null)
  assert.equal(safePath('https://evil.example'), null)
  assert.equal(safePath('/x"onmouseover=1'), null)
})

test('Resend webhook signatures (Svix scheme)', () => {
  const secret = `whsec_${Buffer.from('k'.repeat(24)).toString('base64')}`
  const body = '{"type":"email.bounced"}'
  const ts = Math.floor(NOW / 1000)
  const sig = crypto.createHmac('sha256', Buffer.from('k'.repeat(24))).update(`msg_1.${ts}.${body}`).digest('base64')
  const h = (over = {}) => new Headers({ 'svix-id': 'msg_1', 'svix-timestamp': String(ts), 'svix-signature': `v1,bad v1,${sig}`, ...over })
  assert.ok(verifyResendSignature(body, h(), secret, ts))
  assert.ok(!verifyResendSignature(`${body} `, h(), secret, ts))
  assert.ok(!verifyResendSignature(body, h(), secret, ts + 600))
  assert.ok(!verifyResendSignature(body, h({ 'svix-signature': 'v1,bad' }), secret, ts))
})

// ── Delivery ────────────────────────────────────────────────────────────────
test('Resend: retries server errors with the same key; never retries a refused address', async () => {
  const keys = []
  const responses = [new Response('{}', { status: 500 }), new Response('{"id":"em_1"}', { status: 200 })]
  const ok = await sendViaResend(
    { apiKey: 'k', idempotencyKey: 'key-1', to: ['a@b.c'] },
    { fetchImpl: async (_, init) => (keys.push(init.headers['Idempotency-Key']), responses.shift()), sleep: async () => {} },
  )
  assert.deepEqual(ok, { ok: true, id: 'em_1' })
  assert.deepEqual(keys, ['key-1', 'key-1'])
  let calls = 0
  const refused = await sendViaResend(
    { apiKey: 'k', idempotencyKey: 'key-2', to: ['bad'] },
    { fetchImpl: async () => (calls++, new Response('{"message":"Invalid to"}', { status: 422 })), sleep: async () => {} },
  )
  assert.equal(refused.ok, false)
  assert.equal(refused.permanent, true)
  assert.equal(calls, 1)
})

// ── One whole run, against a stand-in database ──────────────────────────────
function fakeDb(audience, { paused = false, sentToday = 0 } = {}) {
  const queue = []
  const log = { rpc: [], updates: [], upserts: [] }
  const emailOf = Object.fromEntries(audience.map((r) => [r.user_id, r.email]))
  const rpcResult = (name, args) => {
    if (name === 'email_audience') return { data: args.p_after ? [] : audience, error: null }
    if (name === 'queue_email_jobs') return queue.push(...args.p_jobs), { data: args.p_jobs.length, error: null }
    if (name === 'claim_email_jobs')
      return { data: queue.splice(0, args.p_limit).map((j, i) => ({ ...j, job_id: `00000000-0000-0000-0000-00000000000${i}`, email: emailOf[j.user_id], attempts: 1 })), error: null }
    if (name === 'email_content_stats') return { data: STATS, error: null }
    return { data: null, error: { message: `unknown rpc ${name}` } }
  }
  return {
    log,
    rpc(name, args = {}) {
      log.rpc.push(name)
      const result = rpcResult(name, args)
      return Object.assign(Promise.resolve(result), { maybeSingle: () => Promise.resolve(result) })
    },
    from(table) {
      const state = { table }
      const chain = {
        select: (_c, opts) => ((state.count = opts?.count), chain),
        eq: () => chain,
        in: () => chain,
        gte: () => chain,
        update: (v) => (log.updates.push({ table, v }), chain),
        upsert: (v) => (log.upserts.push({ table, v }), Promise.resolve({ error: null })),
        maybeSingle: () => Promise.resolve({ data: table === 'email_settings' ? { paused } : null, error: null }),
        then: (resolve) => resolve(state.count ? { count: sentToday, error: null } : { data: null, error: null }),
      }
      return chain
    },
  }
}
const env = (over = {}) => ({ mode: 'live', resendKey: 'k', from: 'WASSCE Tutor <hello@wasscetutor.com>', replyTo: '', tokenSecret: SECRET, onlyTo: [], dailyLimit: 80, site: 'https://wasscetutor.com', ...over })
const students = [
  row({ user_id: '00000000-0000-0000-0000-0000000000a1', email: 'musa@example.com', ...pending(3 * HOUR) }),
  row({ user_id: '00000000-0000-0000-0000-0000000000a2', email: 'away@example.com', last_study_at: ago(10 * DAY), last_sign_in_at: ago(10 * DAY) }),
  row({ user_id: '00000000-0000-0000-0000-0000000000a3', email: 'active@example.com' }),
]

test('engine: off, paused and unconfigured runs send nothing', async () => {
  const sent = []
  const send = async (m) => (sent.push(m), { ok: true, id: 'x' })
  assert.match((await runEngine({ client: fakeDb(students), env: env({ mode: 'off' }), now: NOW, send })).stopped, /off/)
  assert.match((await runEngine({ client: fakeDb(students, { paused: true }), env: env(), now: NOW, send })).stopped, /paused/)
  assert.match((await runEngine({ client: fakeDb(students), env: env({ resendKey: '' }), now: NOW, send })).stopped, /not configured/)
  assert.equal(sent.length, 0)
})

test('engine: a dry run decides but queues and sends nothing', async () => {
  const client = fakeDb(students)
  const result = await runEngine({ client, env: env({ mode: 'dry-run' }), now: NOW, send: async () => assert.fail('sent') })
  assert.equal(result.wouldSend, 2)
  assert.deepEqual(result.byProgramme, { pending_payment: 1, reengage: 1 })
  assert.ok(!client.log.rpc.includes('queue_email_jobs'))
})

test('engine: a live run queues, sends with one-click unsubscribe, and records each send', async () => {
  const client = fakeDb(students)
  const sent = []
  const result = await runEngine({ client, env: env(), now: NOW, send: async (m) => (sent.push(m), { ok: true, id: `em_${sent.length}` }), sleep: async () => {} })
  assert.equal(result.sent, 2)
  assert.deepEqual(sent.map((m) => m.to[0]).sort(), ['away@example.com', 'musa@example.com'])
  const musa = sent.find((m) => m.to[0] === 'musa@example.com')
  assert.equal(musa.subject, 'Your Monthly access is one step away')
  assert.match(musa.headers['List-Unsubscribe'], /^<https:\/\/wasscetutor\.com\/api\/email\/unsubscribe\?t=/)
  assert.equal(musa.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click')
  assert.match(musa.html, /api\/email\/c\?j=/)
  assert.equal(musa.idempotencyKey, 'wassce-email-pending_payment:1:00000000-0000-0000-0000-0000000000a1:pay1')
  assert.equal(client.log.updates.filter((u) => u.v.status === 'sent').length, 2)
})

test('engine: the daily limit and pilot list are respected', async () => {
  const limited = await runEngine({ client: fakeDb(students, { sentToday: 79 }), env: env(), now: NOW, send: async () => ({ ok: true, id: 'x' }), sleep: async () => {} })
  assert.equal(limited.sent, 1)
  assert.equal(limited.byProgramme.pending_payment, 1, 'the higher-priority email goes first')
  const sent = []
  await runEngine({ client: fakeDb(students), env: env({ mode: 'pilot', onlyTo: ['away@example.com'] }), now: NOW, send: async (m) => (sent.push(m), { ok: true, id: 'x' }), sleep: async () => {} })
  assert.deepEqual(sent.map((m) => m.to[0]), ['away@example.com'])
})

test('engine: a refused address is suppressed so it is never tried again', async () => {
  const client = fakeDb([students[0]])
  const result = await runEngine({ client, env: env(), now: NOW, send: async () => ({ ok: false, status: 422, permanent: true, error: 'Invalid to' }), sleep: async () => {} })
  assert.equal(result.failed, 1)
  assert.equal(client.log.upserts[0].table, 'email_suppressions')
  assert.equal(client.log.upserts[0].v.reason, 'invalid')
})

// ── Settings: from Supabase, environment variables only override ───────────
test('settings come from the database; a Vercel EMAIL_MODE can only switch the engine off', () => {
  const row = { mode: 'live', pilot_addresses: ['Me@Example.com'], daily_limit: 50, paused: false, resend_api_key: 're_db', email_from: 'WASSCE Tutor <a@b.c>', token_secret: 't'.repeat(64), cron_secret: 'c'.repeat(64) }
  const none = { mode: null, resendKey: null, from: null, replyTo: null, tokenSecret: null, cronSecret: null, webhookSecret: null, onlyTo: null, dailyLimit: null, site: 'https://wasscetutor.com' }
  const fromDb = mergeConfig(row, none)
  assert.equal(fromDb.mode, 'live')
  assert.deepEqual(fromDb.onlyTo, ['me@example.com'])
  assert.equal(fromDb.dailyLimit, 50)
  assert.equal(fromDb.resendKey, 're_db')
  assert.deepEqual(fromDb.cronSecrets, ['c'.repeat(64)])
  assert.equal(fromDb.settingsError, null)
  assert.equal(mergeConfig(row, { ...none, mode: 'off' }).mode, 'off', 'EMAIL_MODE=off is an emergency stop')
  assert.equal(mergeConfig(row, { ...none, mode: 'dry-run' }).mode, 'live', 'a stale EMAIL_MODE cannot hold the engine back')
  assert.equal(mergeConfig(row, { ...none, resendKey: 're_env' }).resendKey, 're_env')
  assert.deepEqual(mergeConfig(row, { ...none, cronSecret: 'e'.repeat(32) }).cronSecrets, ['c'.repeat(64), 'e'.repeat(32)], 'both schedule secrets are accepted')
  const unreadable = mergeConfig(null, none, 'PGRST202')
  assert.equal(unreadable.mode, 'off', 'no settings: the engine stays off')
  assert.equal(unreadable.settingsError, 'PGRST202')
  assert.deepEqual(unreadable.cronSecrets, [])
})

test('regression: students due the same email get their own keys, and every one is sent', async () => {
  const fresh = (n) =>
    row({ user_id: `00000000-0000-0000-0000-0000000001${String(n).padStart(2, '0')}`, email: `new${n}@example.com`, created_at: ago(2 * DAY), last_sign_in_at: ago(2 * DAY), last_study_at: null, lessons_completed: 0, practice_attempts: 0 })
  const away = (n) =>
    row({ user_id: `00000000-0000-0000-0000-0000000002${String(n).padStart(2, '0')}`, email: `away${n}@example.com`, last_study_at: ago(10 * DAY), last_sign_in_at: ago(10 * DAY) })
  const group = [fresh(1), fresh(2), fresh(3), away(1), away(2)]
  const keys = group.map((r) => planForStudent(snapshotFromRow(r), NOW).email.idempotencyKey)
  assert.equal(new Set(keys).size, group.length, 'same programme and same day must still give different keys')

  // The stand-in database refuses a second live job with the same key, like the real unique index.
  const client = fakeDb(group)
  const queueRpc = client.rpc.bind(client)
  const seen = new Set()
  client.rpc = (name, args = {}) => {
    if (name === 'queue_email_jobs') args = { p_jobs: args.p_jobs.filter((j) => !seen.has(j.idempotency_key) && seen.add(j.idempotency_key)) }
    return queueRpc(name, args)
  }
  const sent = []
  const result = await runEngine({ client, env: env(), now: NOW, send: async (m) => (sent.push(m.to[0]), { ok: true, id: `em_${sent.length}` }), sleep: async () => {} })
  assert.equal(result.queued, 5)
  assert.equal(result.sent, 5)
  assert.deepEqual(sent.sort(), ['away1@example.com', 'away2@example.com', 'new1@example.com', 'new2@example.com', 'new3@example.com'])
})

// ── Weekly progress email ──────────────────────────────────────────────────
const SUNDAY = Date.parse('2026-11-22T10:00:00Z')
const MONDAY = Date.parse('2026-11-23T10:00:00Z')
const WEDNESDAY = Date.parse('2026-11-25T10:00:00Z')
const active = (now) => row({ last_study_at: new Date(now - 2 * DAY).toISOString(), last_sign_in_at: new Date(now - 2 * DAY).toISOString(), created_at: new Date(now - 60 * DAY).toISOString() })

test('weekly email: Sunday to Tuesday, to students who studied this week, once a week', () => {
  assert.equal(weekOf(SUNDAY), '2026-11-22')
  assert.equal(weekOf(MONDAY), '2026-11-22', 'Monday belongs to the week that started on Sunday')
  const { email } = planForStudent(snapshotFromRow(active(SUNDAY)), SUNDAY)
  assert.equal(email.programme, 'weekly_digest')
  assert.equal(email.templateKey, 'weekly_digest')
  assert.equal(email.anchor, '2026-11-22')
  assert.equal(planForStudent(snapshotFromRow(active(WEDNESDAY)), WEDNESDAY).skip, 'nothing_due', 'not mid-week')
  const sentSunday = { programme: 'weekly_digest', step: 1, anchor: '2026-11-22', category: 'marketing', status: 'sent', at: new Date(SUNDAY).toISOString() }
  assert.notEqual(planForStudent(snapshotFromRow({ ...active(MONDAY), history: [sentSunday] }), MONDAY + 3 * DAY).email?.programme, 'weekly_digest', 'not twice in one week')
  const away = row({ last_study_at: new Date(SUNDAY - 10 * DAY).toISOString(), last_sign_in_at: new Date(SUNDAY - 10 * DAY).toISOString() })
  assert.equal(planForStudent(snapshotFromRow(away), SUNDAY).email.programme, 'reengage', 'inactive students get the come-back email instead')
  assert.equal(planForStudent(snapshotFromRow({ ...active(SUNDAY), marketing_status: 'unsubscribed' }), SUNDAY).skip, 'not_subscribed')
})

const weekRow = (over = {}) => ({
  user_id: UID, lessons_week: 5, practice_week: 2, score_week: 68, subjects_week: ['Biology', 'Chemistry'],
  focus_subject_id: 'b1', focus_subject_name: 'Biology', focus_done: 12, focus_total: 40, new_lessons_week: 4,
  next_lesson_id: 'l9', next_lesson_title: 'Cell division', next_topic_name: 'Cells', next_lesson_free: false, ...over,
})
const weekClient = (rows) => ({ rpc: (name, args) => Promise.resolve(name === 'email_student_week' ? { data: rows.filter((r) => args.p_users.includes(r.user_id)), error: null } : { data: null, error: { message: 'x' } }) })
const digestCandidate = (access = null) => ({ programme: 'weekly_digest', userId: UID, payload: { firstName: 'Ama', access, links: { cta: '/subject/b1' } } })

test('weekly email: real numbers are added; a locked next lesson links to the subject, an open one to the lesson', async () => {
  const summary = { skipped: {} }
  const [free] = await addWeekData(weekClient([weekRow()]), [digestCandidate()], summary)
  assert.equal(free.payload.week.lessons, 5)
  assert.equal(free.payload.week.next.title, 'Cell division')
  assert.equal(free.payload.links.cta, '/subject/b1', 'locked for a free student: go to the subject page')
  const [paid] = await addWeekData(weekClient([weekRow()]), [digestCandidate({ plan: 'term', until: '2026-12-20T00:00:00Z' })], summary)
  assert.equal(paid.payload.links.cta, '/lesson/l9', 'open for a paying student: straight to the lesson')
  const [freeLesson] = await addWeekData(weekClient([weekRow({ next_lesson_free: true })]), [digestCandidate()], summary)
  assert.equal(freeLesson.payload.links.cta, '/lesson/l9')
})

test('weekly email: nobody gets one with nothing real to report, or when the data is unavailable', async () => {
  const summary = { skipped: {} }
  const other = { programme: 'reengage', userId: 'someone', payload: {} }
  const kept = await addWeekData(weekClient([weekRow({ lessons_week: 0, practice_week: 0 })]), [digestCandidate(), other], summary)
  assert.deepEqual(kept.map((c) => c.programme), ['reengage'])
  assert.equal(summary.skipped.no_week_activity, 1)
  const broken = { rpc: () => Promise.resolve({ data: null, error: { message: 'function does not exist' } }) }
  assert.deepEqual((await addWeekData(broken, [digestCandidate(), other], { skipped: {} })).map((c) => c.programme), ['reengage'], 'other emails still go out')
})

test('weekly email copy: only what happened, plurals right, no plan pitch for lessons', () => {
  const content = TEMPLATES.weekly_digest(SAMPLES.weekly_digest, { stats: STATS })
  assert.equal(content.subject, 'Your WASSCE week: 5 lessons and 2 practice sets')
  assert.ok(content.lists[0].items.includes('Practice sets: 2 (average score 68%)'))
  assert.ok(content.lists[1].items.includes('12 of 40 lessons done (30%)'))
  assert.ok(content.lists[1].items.includes('4 new lessons added this week'))
  assert.ok(!content.after.some((t) => t.includes('full access')), 'lessons are free: no plan line')
  assert.equal(content.cta.label, 'Continue Biology')
  const one = TEMPLATES.weekly_digest({ ...SAMPLES.weekly_digest, access: { plan: 'term' }, week: { ...SAMPLES.weekly_digest.week, lessons: 1, practice: 0, score: null, subjects: ['Biology'], newLessons: 0 } }, {})
  assert.equal(one.subject, 'Your WASSCE week: 1 lesson')
  assert.ok(!one.lists[0].items.some((i) => i.startsWith('Practice')), 'no practice line when there was no practice')
  assert.ok(!one.after.some((t) => t.includes('full access')), 'no plan line for a paying student')
  assert.equal(one.cta.label, 'Start the next lesson')
})


// ── Study extras: a question to answer, a tutor for a weak subject, where to continue ──

const EXTRAS_ROW = {
  user_id: 'u1',
  question_id: '11111111-2222-3333-4444-555555555555',
  question_stem: 'Choose the word with the same vowel sound as f**oo**d.',
  question_options: [{ label: 'A', content: 'shoe' }, { label: 'B', content: 'good' }, { label: 'C', content: 'blood' }, { label: 'D', content: 'boat' }],
  question_subject: 'English Language',
  question_topic: 'Vowels and Diphthongs',
  weak_subject_id: 's1',
  weak_subject_name: 'English Language',
  weak_subject_slug: 'english-language',
  weak_avg: 38,
  weak_sets: 3,
  tutor_slug: 'nicholas-norman',
  tutor_name: 'Nicholas Norman',
  tutor_location: 'Freetown',
  tutor_price: '700.00',
  tutor_lessons_per_week: 3,
  next_lesson_id: 'l1',
  next_lesson_title: 'Diphthongs',
  next_topic_name: 'Vowels and Diphthongs',
  next_subject_name: 'English Language',
}
const fakeClient = (rows, error = null) => ({ rpc: async (name) => (name === 'email_student_extras' ? { data: error ? null : rows, error } : { data: null, error: { message: 'unexpected' } }) })

test('study extras: the question, a tutor for the weak subject and the next lesson go into a study email', async () => {
  const chosen = [
    { userId: 'u1', programme: 'reengage', payload: { firstName: 'Aminata', links: { cta: '/subjects' } } },
    { userId: 'u1', programme: 'access_started', payload: { links: { cta: '/subjects' } } },
  ]
  const summary = {}
  const out = await addStudyExtras(fakeClient([EXTRAS_ROW]), chosen, summary)
  const p = out[0].payload
  assert.equal(p.question.options.length, 4)
  assert.equal(p.links.q_B, '/q/11111111-2222-3333-4444-555555555555?a=B')
  assert.equal(p.links.tutor, '/tutors/nicholas-norman?book=english-language')
  assert.equal(p.links.next, '/lesson/l1')
  assert.equal(p.links.cta, '/subjects')
  assert.deepEqual({ ...p.tutor }, { name: 'Nicholas Norman', location: 'Freetown', subject: 'English Language', avg: 38, sets: 3, price: 700, perWeek: 3 })
  for (const key of ['q_A', 'q_B', 'q_C', 'q_D', 'tutor', 'next']) assert.ok(safePath(p.links[key]), `${key} passes the click redirect`)
  // A service email gets nothing added.
  assert.equal(out[1].payload.question, undefined)
  assert.deepEqual(summary.extras, { questions: 1, tutors: 1 })
})

test('study extras: missing parts are left out, and a database error sends the emails without them', async () => {
  const bare = { ...EXTRAS_ROW, question_id: null, tutor_slug: null, next_lesson_id: null }
  const one = [{ userId: 'u1', programme: 'weekly_digest', payload: { links: { cta: '/x' } } }]
  const out = await addStudyExtras(fakeClient([bare]), one, {})
  assert.equal(out[0].payload.question, undefined)
  assert.equal(out[0].payload.tutor, undefined)
  assert.deepEqual(out[0].payload.links, { cta: '/x' })

  const summary = {}
  const same = [{ userId: 'u1', programme: 'reengage', payload: { links: { cta: '/x' } } }]
  const after = await addStudyExtras(fakeClient(null, { message: 'function does not exist' }), same, summary)
  assert.deepEqual(after[0].payload, { links: { cta: '/x' } })
  assert.equal(summary.extras, 'unavailable')
})

test('study extras render: answer buttons, tutor card, and the continue line only where the button does not continue', () => {
  const ctx = { site: 'https://wasscetutor.com', contact: { phoneDisplay: '+232' }, url: (k) => `https://wasscetutor.com/go/${k}`, displayUrl: () => 'x', unsubscribeUrl: 'https://u', preferencesUrl: 'https://p' }
  const payload = { ...SAMPLES.pending_payment_1 }
  const pending = withStudyExtras(TEMPLATES.pending_payment_1(payload, {}), payload, 'pending_payment')
  const { html, text } = renderEmail(pending, ctx)
  for (const l of ['A', 'B', 'C', 'D']) assert.ok(html.includes(`https://wasscetutor.com/go/q_${l}`), `option ${l} links to its answer`)
  assert.ok(html.includes('<strong>oo</strong>'), 'bold letters stay bold')
  assert.ok(html.includes('Book Nicholas'))
  assert.ok(html.includes('https://wasscetutor.com/go/next'), 'pending payment: a free lesson to carry on with')
  assert.ok(text.includes('fOOd'), 'plain text shows the bold letters in capitals')
  assert.doesNotMatch(html + text, /undefined|null|NaN/)

  const re = { ...SAMPLES.reengage_1 }
  const back = withStudyExtras(TEMPLATES.reengage_1(re, {}), re, 'reengage')
  assert.equal(back.continueLine, undefined, 'the re-engagement button already continues')

  const none = withStudyExtras(TEMPLATES.activation_2(SAMPLES.activation_2, {}), SAMPLES.activation_2, 'activation')
  assert.equal(none.question, undefined)
  assert.equal(none.tutor, undefined)
  assert.equal(none.continueLine, undefined)
})
