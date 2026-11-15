// Tests for the email engine: npm run email:test
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { test } from 'node:test'
import { mergeConfig } from '../../api/_lib/email/config.js'
import { runEngine } from '../../api/_lib/email/engine.js'
import { renderEmail } from '../../api/_lib/email/layout.js'
import { sendViaResend } from '../../api/_lib/email/resend.js'
import { firstName, planForStudent, rankCandidates, snapshotFromRow } from '../../api/_lib/email/rules.js'
import { SAMPLES, TEMPLATES } from '../../api/_lib/email/templates.js'
import { clickSignature, safePath, unsubscribeToken, verifyClick, verifyUnsubscribeToken } from '../../api/_lib/email/tokens.js'
import { verifyResendSignature } from '../../api/_lib/email/webhook-signature.js'

const HOUR = 3_600_000
const DAY = 24 * HOUR
const NOW = Date.parse('2026-11-16T10:00:00Z')
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
  assert.equal(email.idempotencyKey, 'pending_payment:1:pay1')
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

test('pending payment: stops when paid, when access is active, and after 14 days', () => {
  assert.equal(plan(pending(3 * HOUR, { access_active: true, access_until: ahead(20 * DAY) })).email?.programme === 'pending_payment', false)
  assert.equal(plan(pending(15 * DAY)).email?.programme === 'pending_payment', false)
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
  assert.equal(plan(paid).email.idempotencyKey, 'access_started:1:pay9')
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
  assert.ok(c.lists[0].items[0].includes('673 lessons across 18 subjects'))
  assert.ok(c.lists[0].items[1].includes('1,568 questions'))
  assert.ok(c.after[0].includes('NLe 25 for 1 month'))
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
  assert.equal(musa.idempotencyKey, 'wassce-email-pending_payment:1:pay1')
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
