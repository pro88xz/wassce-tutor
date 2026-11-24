// Tests for the protected video API (api/_lib/video.js). Run: npm run video:test
import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  issueToken, keyMask, maskKey, networkOf, readToken, segmentNames, tokenSecret, turnstileVerifier, videoHandler, viewerCode, viewerPlaylist,
} from '../../api/_lib/video.js'

const secret = tokenSecret({ SUPABASE_SECRET_KEY: 'sb_secret_test' })
const KEY = '00112233445566778899aabbccddeeff'
const PLAYLIST = [
  '#EXTM3U', '#EXT-X-VERSION:3', '#EXT-X-TARGETDURATION:6', '#EXT-X-MEDIA-SEQUENCE:0', '#EXT-X-PLAYLIST-TYPE:VOD',
  '#EXT-X-KEY:METHOD=AES-128,URI="KEY",IV=0x0123456789abcdef0123456789abcdef',
  '#EXTINF:6.000000,', 's0000.ts', '#EXTINF:4.200000,', 's0001.ts', '#EXT-X-ENDLIST', '',
].join('\n')
const VIDEO = { id: 'biology-cell-structure', revision: 'abcdef012345', playlist: PLAYLIST, storage_prefix: 'biology-cell-structure/abcdef012345/', duration_s: 10.2 }

const store = {
  video: async (id) => (id === VIDEO.id ? VIDEO : null),
  key: async (id, rev) => (id === VIDEO.id && rev === VIDEO.revision ? KEY : null),
  sign: async (paths, seconds) => new Map(paths.map((p) => [p, `https://store.example/sign/${p}?exp=${seconds}`])),
}
const google = {
  reverse: async (ip) => (ip === '66.249.66.1' ? ['crawl-66-249-66-1.googlebot.com'] : ip === '6.6.6.6' ? ['fake.googlebot.com.evil.net'] : []),
  lookup: async (name) => (name === 'crawl-66-249-66-1.googlebot.com' ? [{ address: '66.249.66.1' }] : []),
}
const handle = videoHandler({ store, secret, resolver: google, log: () => {} })

const SITE = 'https://wasscetutor.com'
function req(path, { method = 'GET', ip = '102.68.1.20', headers = {}, body } = {}) {
  return new Request(SITE + path, { method, headers: { 'x-real-ip': ip, ...headers }, body: body ? JSON.stringify(body) : undefined })
}
const start = (ip = '102.68.1.20', origin = SITE) =>
  handle(req('/api/video?op=start', { method: 'POST', ip, headers: { origin, 'content-type': 'application/json', 'sec-fetch-site': 'same-origin', 'sec-fetch-dest': 'empty' }, body: { video: VIDEO.id } }))
const player = (token, extra = {}) => ({ 'x-video-token': token, 'sec-fetch-site': 'same-origin', 'sec-fetch-dest': 'empty', ...extra })

test('networkOf keeps a /16 of IPv4 and a /32 of IPv6', () => {
  assert.equal(networkOf('102.68.1.20'), '102.68')
  assert.equal(networkOf('::ffff:102.68.200.3'), '102.68')
  assert.equal(networkOf('2c0f:f8f0:1234::1'), '2c0f:f8f0')
  assert.equal(networkOf('2c0f::1'), '2c0f:0')
})

test('a token works only for its video, its network and five minutes', () => {
  const now = Date.now()
  const { token } = issueToken(secret, { video: 'a-video', revision: 'abcdef012345', ip: '102.68.1.20', now })
  assert.ok(readToken(secret, token, { video: 'a-video', ip: '102.68.99.7', now }), 'same /16 is fine')
  assert.equal(readToken(secret, token, { video: 'other-video', ip: '102.68.1.20', now }), null)
  assert.equal(readToken(secret, token, { video: 'a-video', ip: '41.77.1.20', now }), null, 'another network')
  assert.equal(readToken(secret, token, { video: 'a-video', ip: '102.68.1.20', now: now + 6 * 60_000 }), null, 'expired')
  const [body, sig] = token.split('.')
  const forged = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(body, 'base64url')), e: 9e9 })).toString('base64url')
  assert.equal(readToken(secret, `${forged}.${sig}`, { video: 'a-video', ip: '102.68.1.20', now }), null, 'tampered')
  assert.equal(readToken(tokenSecret({ SUPABASE_SECRET_KEY: 'other' }), token, { video: 'a-video', ip: '102.68.1.20', now }), null)
})

test('masking is undone only with the same mask', () => {
  const mask = keyMask(secret, 'nonce-1')
  const masked = maskKey(KEY, mask)
  assert.notEqual(masked.toString('hex'), KEY)
  assert.equal(Buffer.from(masked.map((b, i) => b ^ mask[i])).toString('hex'), KEY)
  assert.notEqual(Buffer.from(masked.map((b, i) => b ^ keyMask(secret, 'nonce-2')[i])).toString('hex'), KEY)
  assert.match(viewerCode('nonce-1'), /^[0-9A-Z]{6}$/)
})

test('the playlist gets the key address and signed segments, nothing else changes', () => {
  assert.deepEqual(segmentNames(PLAYLIST), ['s0000.ts', 's0001.ts'])
  const out = viewerPlaylist(PLAYLIST, 'https://x/key', new Map([['s0000.ts', 'https://s/0'], ['s0001.ts', 'https://s/1']]))
  assert.match(out, /URI="https:\/\/x\/key",IV=0x0123/)
  assert.deepEqual(segmentNames(out), ['https://s/0', 'https://s/1'])
  assert.throws(() => viewerPlaylist(PLAYLIST, 'k', new Map()))
})

test('start: only from the site or app', async () => {
  assert.equal((await start()).status, 200)
  assert.equal((await start(undefined, 'https://localhost')).status, 200, 'the Android app')
  assert.equal((await start(undefined, 'https://savefrom.example')).status, 403)
  const noOrigin = await handle(req('/api/video?op=start', { method: 'POST', body: { video: VIDEO.id }, headers: { 'content-type': 'application/json' } }))
  assert.equal(noOrigin.status, 403, 'curl without an Origin')
  const missing = await handle(req('/api/video?op=start', { method: 'POST', headers: { origin: SITE }, body: { video: 'no-such-video' } }))
  assert.equal(missing.status, 404)
})

test('the player plays: playlist and masked key with the token header', async () => {
  const s = await (await start()).json()
  const pl = await handle(req(`/api/video?op=playlist&v=${VIDEO.id}`, { headers: player(s.token) }))
  assert.equal(pl.status, 200)
  assert.equal(pl.headers.get('cache-control'), 'no-store')
  const text = await pl.text()
  assert.match(text, /URI="https:\/\/wasscetutor\.com\/api\/video\?op=key&v=biology-cell-structure"/)
  assert.match(text, /https:\/\/store\.example\/sign\/biology-cell-structure\/abcdef012345\/s0000\.ts\?exp=10\d{3}/)
  const key = await handle(req(`/api/video?op=key&v=${VIDEO.id}`, { headers: player(s.token) }))
  assert.equal(key.status, 200)
  const masked = Buffer.from(await key.arrayBuffer())
  assert.equal(masked.length, 16)
  assert.notEqual(masked.toString('hex'), KEY, 'the key never crosses the network as itself')
  const mask = Buffer.from(s.mask, 'hex')
  assert.equal(Buffer.from(masked.map((b, i) => b ^ mask[i])).toString('hex'), KEY)
})

test('copied addresses do nothing: no header, another network, a pasted URL, another site', async () => {
  const s = await (await start()).json()
  const url = `/api/video?op=key&v=${VIDEO.id}`
  assert.equal((await handle(req(url))).status, 403, 'no token header')
  assert.equal((await handle(req(`/api/video?op=playlist&v=${VIDEO.id}&t=${s.token}`))).status, 403, 'token in the address')
  assert.equal((await handle(req(url, { ip: '41.77.3.4', headers: player(s.token) }))).status, 403, 'a download site\'s server')
  assert.equal((await handle(req(url, { headers: player(s.token, { 'sec-fetch-dest': 'document', 'sec-fetch-site': 'none' }) }))).status, 403, 'pasted in the address bar')
  assert.equal((await handle(req(url, { headers: player(s.token, { origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' }) }))).status, 403, 'another site')
  assert.equal((await handle(req(`/api/video?op=key&v=other-video`, { headers: player(s.token) }))).status, 403, 'another video')
})

test('the plain copy is for Google\'s verified crawler only', async () => {
  const g = await handle(req(`/api/video?op=file&v=${VIDEO.id}`, { ip: '66.249.66.1' }))
  assert.equal(g.status, 302)
  assert.match(g.headers.get('location'), /preview\.mp4/)
  assert.equal((await handle(req(`/api/video?op=file&v=${VIDEO.id}`, { ip: '6.6.6.6', headers: { 'user-agent': 'Googlebot/2.1' } }))).status, 403, 'pretends to be Google')
  assert.equal((await handle(req(`/api/video?op=file&v=${VIDEO.id}`))).status, 403)
})

// ── Subscribers' downloads ───────────────────────────────────────────────────

const ACCOUNTS = { 'token-subscriber': { id: 'u-sub', subscribed: true }, 'token-free': { id: 'u-free', subscribed: false } }
const FILES = new Set([`${VIDEO.storage_prefix}download.mp4`])
const shop = {
  ...store,
  account: async (t) => ACCOUNTS[t] ?? null,
  download: async (path, seconds, name) => (FILES.has(path) ? `https://store.example/sign/${path}?exp=${seconds}&download=${name}` : null),
}
const handleShop = videoHandler({ store: shop, secret, resolver: google, log: () => {} })
const download = (auth, { video = VIDEO.id, origin = SITE, extra = {} } = {}) =>
  handleShop(req('/api/video?op=download', {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json', 'sec-fetch-site': 'same-origin', 'sec-fetch-dest': 'empty', ...(auth ? { authorization: `Bearer ${auth}` } : {}), ...extra },
    body: { video },
  }))

test('downloads: only a subscriber gets a file, from a ten-minute address', async () => {
  assert.equal((await download(null)).status, 401, 'signed out')
  assert.equal((await download('token-forged')).status, 401, 'a made-up token')
  const free = await download('token-free')
  assert.equal(free.status, 402)
  assert.equal((await free.json()).code, 'subscribe')
  const ok = await download('token-subscriber')
  assert.equal(ok.status, 200)
  const { url } = await ok.json()
  assert.match(url, /download\.mp4\?exp=600&download=wasscetutor-biology-cell-structure\.mp4$/)
  assert.equal(ok.headers.get('cache-control'), 'no-store')
})

test('downloads: a file not yet made, another site, or an address typed in', async () => {
  const other = { ...VIDEO, id: 'physics-waves-1', storage_prefix: 'physics-waves-1/aaaaaaaaaaaa/' }
  const handleOther = videoHandler({ store: { ...shop, video: async (id) => (id === other.id ? other : null) }, secret, log: () => {} })
  const res = await handleOther(req('/api/video?op=download', { method: 'POST', headers: { origin: SITE, 'content-type': 'application/json', authorization: 'Bearer token-subscriber' }, body: { video: other.id } }))
  assert.equal(res.status, 409, 'its download.mp4 is not in storage yet')
  assert.equal((await download('token-subscriber', { origin: 'https://savefrom.example' })).status, 403, 'another site')
  assert.equal((await download('token-subscriber', { extra: { 'sec-fetch-dest': 'document' } })).status, 403, 'opened as a page')
  assert.equal((await download('token-subscriber', { video: '../../etc' })).status, 400)
})

// ── People, not programs ─────────────────────────────────────────────────────

test('with the people check on, a video starts only with a token Cloudflare confirms', async () => {
  const checked = []
  const human = async (token, ip, why) => {
    checked.push([token, ip])
    if (token !== 'cf-ok') why.codes = ['invalid-input-response']
    return token === 'cf-ok'
  }
  const h = videoHandler({ store, secret, human, log: () => {} })
  const begin = (body) => h(req('/api/video?op=start', { method: 'POST', ip: '102.68.5.5', headers: { origin: SITE, 'content-type': 'application/json', 'sec-fetch-site': 'same-origin', 'sec-fetch-dest': 'empty' }, body }))
  const bot = await begin({ video: VIDEO.id })
  assert.equal(bot.status, 403)
  assert.equal((await bot.json()).code, 'not_a_person')
  const forged = await begin({ video: VIDEO.id, human: 'cf-forged' })
  assert.equal(forged.status, 403)
  assert.deepEqual(await forged.json(), { code: 'not_a_person', why: ['invalid-input-response'] }, "Cloudflare's reason is shown")
  assert.equal((await begin({ video: VIDEO.id, human: 'cf-ok' })).status, 200)
  assert.deepEqual(checked.at(-1), ['cf-ok', '102.68.5.5'], 'checked with the viewer address')
  assert.equal((await start('102.68.9.9')).status, 200, 'with the check off, nothing changes')
})

test('turnstileVerifier: off without a key; confirms with Cloudflare; lets viewers through if Cloudflare is down', async () => {
  assert.equal(turnstileVerifier(''), null)
  const sent = []
  const cf = (answer) => async (url, init) => { sent.push([url, JSON.parse(init.body)]); return answer }
  const yes = turnstileVerifier('secret-1', cf({ status: 200, json: async () => ({ success: true }) }))
  assert.equal(await yes('tok', '1.2.3.4'), true)
  assert.deepEqual(sent.at(-1), ['https://challenges.cloudflare.com/turnstile/v0/siteverify', { secret: 'secret-1', response: 'tok', remoteip: '1.2.3.4' }])
  const no = turnstileVerifier('secret-1', cf({ status: 200, json: async () => ({ success: false, 'error-codes': ['timeout-or-duplicate'] }) }))
  assert.equal(await no('tok', '1.2.3.4'), false)
  assert.equal(await no('', '1.2.3.4'), false, 'no token')
  assert.equal(await no('x'.repeat(3000), '1.2.3.4'), false, 'not a token')
  const why = {}
  assert.equal(await no('tok', '1.2.3.4', why), false)
  assert.deepEqual(why.codes, ['timeout-or-duplicate'], 'the reason is passed back')
  const down = turnstileVerifier('secret-1', async () => { throw new Error('ECONNRESET') }, () => {})
  assert.equal(await down('tok', '1.2.3.4'), true)
  // Our own secret key wrong: every visitor would be refused, so they are let through, and it is logged.
  const logged = []
  const badKey = turnstileVerifier('wrong', cf({ status: 200, json: async () => ({ success: false, 'error-codes': ['invalid-input-secret'] }) }), (m) => logged.push(m))
  assert.equal(await badKey('tok', '1.2.3.4'), true)
  assert.match(logged[0], /TURNSTILE_SECRET_KEY/)
  const busy = turnstileVerifier('secret-1', cf({ status: 503, json: async () => ({}) }), () => {})
  assert.equal(await busy('tok', '1.2.3.4'), true)
})
