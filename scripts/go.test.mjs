// Tests for the app tracking link (api/_lib/go.js, served by api/email/c.js). Run: npm run go:test
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { clickRow, countable, goHandler, playUrl, tag } from '../api/_lib/go.js'

const PHONE = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36'

function fakeClient({ fail = false, slow = false } = {}) {
  const inserted = []
  return {
    inserted,
    from: (table) => ({
      insert: (row) =>
        new Promise((resolve, reject) => {
          const done = () => {
            if (fail) return reject(new Error('down'))
            inserted.push({ table, row })
            resolve({ error: null })
          }
          slow ? setTimeout(done, 5000) : done()
        }),
    }),
  }
}

const get = (handle, path, headers = {}, method = 'GET') =>
  handle(new Request(`https://wasscetutor.com/api/email/c${path}`, { method, headers: { 'user-agent': PHONE, 'x-forwarded-for': '41.223.0.9', 'x-vercel-ip-country': 'sl', ...headers } }))

test('a click on a page button is counted and sent to Play with its tags', async () => {
  const client = fakeClient()
  const res = await get(goHandler({ client, salt: 's' }), '?app=beampad&p=hero&pg=beampad', { referer: 'https://wasscetutor.com/beampad' })
  assert.equal(res.status, 302)
  const loc = new URL(res.headers.get('location'))
  assert.equal(loc.host, 'play.google.com')
  assert.equal(loc.searchParams.get('id'), 'com.devbangs.beampad')
  const ref = new URLSearchParams(loc.searchParams.get('referrer'))
  assert.equal(ref.get('utm_source'), 'wasscetutor.com')
  assert.equal(ref.get('utm_campaign'), 'beampad')
  assert.equal(ref.get('utm_content'), 'hero')
  assert.equal(client.inserted.length, 1)
  const { table, row } = client.inserted[0]
  assert.equal(table, 'app_link_clicks')
  assert.equal(row.app, 'beampad')
  assert.equal(row.placement, 'hero')
  assert.equal(row.page, 'beampad')
  assert.equal(row.source, null)
  assert.equal(row.referrer_host, 'wasscetutor.com')
  assert.equal(row.country, 'SL')
  assert.equal(row.device, 'android')
  assert.equal(row.visitor.length, 24)
  assert.ok(!JSON.stringify(row).includes('41.223.0.9'), 'no IP address is stored')
})

test('a shared link keeps its source, on the click and in Play', async () => {
  const client = fakeClient()
  const res = await get(goHandler({ client, salt: 's' }), '?app=beampad&s=TikTok')
  const ref = new URLSearchParams(new URL(res.headers.get('location')).searchParams.get('referrer'))
  assert.equal(ref.get('utm_source'), 'tiktok')
  assert.equal(ref.get('utm_medium'), 'link')
  assert.equal(client.inserted[0].row.source, 'tiktok')
})

test('crawlers, link previews, HEAD and prefetches go to Play without being counted', async () => {
  const client = fakeClient()
  const handle = goHandler({ client, salt: 's' })
  for (const [headers, method] of [
    [{ 'user-agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)' }, 'GET'],
    [{ 'user-agent': 'WhatsApp/2.23.20.0' }, 'GET'],
    [{ 'user-agent': 'facebookexternalhit/1.1' }, 'GET'],
    [{ 'user-agent': '' }, 'GET'],
    [{ 'sec-purpose': 'prefetch' }, 'GET'],
    [{}, 'HEAD'],
  ]) {
    const res = await get(handle, '?app=beampad', headers, method)
    assert.equal(res.status, 302)
  }
  assert.equal(client.inserted.length, 0)
})

test('an unknown app is a 404, and bad tags are dropped', async () => {
  const handle = goHandler({ client: fakeClient(), salt: 's' })
  assert.equal((await get(handle, '?app=nope')).status, 404)
  assert.equal((await get(handle, '')).status, 404)
  assert.equal(tag('<script>', 40), null)
  assert.equal(tag('x'.repeat(80), 40), 'x'.repeat(40))
})

test('the visitor code is the same within a day and changes the next day', () => {
  const req = new Request('https://wasscetutor.com/api/email/c?app=beampad', { headers: { 'user-agent': PHONE, 'x-forwarded-for': '41.223.0.9' } })
  const a = clickRow(req, 'beampad', 's', new Date('2026-11-26T08:00:00Z')).visitor
  const b = clickRow(req, 'beampad', 's', new Date('2026-11-26T20:00:00Z')).visitor
  const c = clickRow(req, 'beampad', 's', new Date('2026-11-27T08:00:00Z')).visitor
  assert.equal(a, b)
  assert.notEqual(a, c)
})

test('a database that is down or slow never stops the redirect', async () => {
  for (const client of [fakeClient({ fail: true }), fakeClient({ slow: true }), null]) {
    const started = Date.now()
    const res = await get(goHandler({ client, salt: 's', timeoutMs: 100 }), '?app=beampad')
    assert.equal(res.status, 302)
    assert.ok(Date.now() - started < 1000)
  }
})

test('countable and playUrl basics', () => {
  assert.equal(countable(new Request('https://x/', { headers: { 'user-agent': PHONE } })), true)
  assert.match(playUrl('com.devbangs.beampad', {}), /^https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.devbangs\.beampad&referrer=/)
})

test('the email click function hands /go links (?app=) to the tracking link', async () => {
  const { GET, HEAD } = await import('../api/email/c.js')
  for (const handler of [GET, HEAD]) {
    const res = await handler(new Request('https://wasscetutor.com/api/email/c?app=beampad&s=tiktok', { headers: { 'user-agent': PHONE } }))
    assert.equal(res.status, 302)
    assert.match(res.headers.get('location'), /^https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.devbangs\.beampad/)
  }
  assert.equal((await HEAD(new Request('https://wasscetutor.com/api/email/c?j=1'))).status, 405)
})
