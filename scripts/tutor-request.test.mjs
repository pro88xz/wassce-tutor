// Tests for the tutor request endpoint (api/tutor-request.js). Run: npm run tutor-request:test
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { tutorRequestHandler, validRequest } from '../api/tutor-request.js'

const GOOD = { name: 'Aminata Kamara', phone: '+232 77 123456', subject: 'Mathematics', level: 'SSS3', mode: 'home', town: 'Lumley', availability: 'Weekends', message: '' }

/** A stand-in for the Supabase client: counts recent rows by phone and records inserts. */
function fakeClient({ recent = 0, insertError = null, user = null } = {}) {
  const inserted = []
  return {
    inserted,
    auth: { getUser: async () => (user ? { data: { user }, error: null } : { data: { user: null }, error: new Error('no user') }) },
    from: () => ({
      select: () => ({ eq: () => ({ gte: async () => ({ count: recent, error: null }) }) }),
      insert: async (row) => {
        if (!insertError) inserted.push(row)
        return { error: insertError }
      },
    }),
  }
}

const post = (handle, body, headers = {}) =>
  handle(new Request('https://wasscetutor.com/api/tutor-request', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) }))

test('a good request is saved', async () => {
  const client = fakeClient()
  const res = await post(tutorRequestHandler({ client, human: null }), GOOD)
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { saved: true })
  assert.equal(client.inserted.length, 1)
  assert.equal(client.inserted[0].town, 'Lumley')
  assert.equal(client.inserted[0].message, null)
  assert.equal(client.inserted[0].user_id, null)
})

test('the hidden trap field: answered as saved, nothing written', async () => {
  const client = fakeClient()
  const res = await post(tutorRequestHandler({ client, human: null }), { ...GOOD, website: 'http://spam.example' })
  assert.deepEqual(await res.json(), { saved: true })
  assert.equal(client.inserted.length, 0)
})

test('the people check: refused without a good token, saved with one', async () => {
  const human = async (token) => token === 'ok'
  const bad = fakeClient()
  const res = await post(tutorRequestHandler({ client: bad, human }), { ...GOOD, token: 'forged' })
  assert.equal(res.status, 403)
  assert.equal(bad.inserted.length, 0)
  const good = fakeClient()
  assert.equal((await post(tutorRequestHandler({ client: good, human }), { ...GOOD, token: 'ok' })).status, 200)
  assert.equal(good.inserted.length, 1)
})

test('at most three requests an hour from one phone', async () => {
  const client = fakeClient({ recent: 3 })
  const res = await post(tutorRequestHandler({ client, human: null }), GOOD)
  assert.equal(res.status, 429)
  assert.equal(client.inserted.length, 0)
})

test('fields are checked against the table limits', () => {
  assert.equal(validRequest({ ...GOOD, name: 'A' }).reason, 'name')
  assert.equal(validRequest({ ...GOOD, phone: 'call me' }).reason, 'phone')
  assert.equal(validRequest({ ...GOOD, level: 'University' }).reason, 'level')
  assert.equal(validRequest({ ...GOOD, mode: 'online-zoom' }).reason, 'mode')
  assert.equal(validRequest({ ...GOOD, message: 'x'.repeat(1001) }).reason, 'length')
  assert.ok(validRequest(GOOD).row)
  assert.ok(validRequest({ ...GOOD, phone: '077123456' }).row)
})

test('only POST', async () => {
  const handle = tutorRequestHandler({ client: fakeClient(), human: null })
  const res = await handle(new Request('https://wasscetutor.com/api/tutor-request'))
  assert.equal(res.status, 405)
})
