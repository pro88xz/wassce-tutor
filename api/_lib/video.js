// Protected lesson video playback (api/video.js). Runs on Vercel only.
//
// A lesson video is never a file anyone can fetch. It is stored as HLS whose
// segments are encrypted with AES-128 (scripts/video/publish.py), in a private
// bucket. To play it, the site's player:
//
//   1. POST /api/video?op=start {video}  -> a viewer token, valid 5 minutes and
//      only from the network the request came from, a key mask and the
//      viewer's watermark code. Refused unless it comes from the site or app.
//   2. GET  /api/video?op=playlist&v=ID  with the token in the X-Video-Token
//      header -> the playlist, with every segment's address signed for a few
//      hours (the segments alone are encrypted noise) and the key's address.
//   3. GET  /api/video?op=key&v=ID       with the token header -> the key,
//      XORed with the mask. The player unmasks it in memory.
//
// So: the playlist and key addresses do nothing when pasted into a browser,
// a download site or a download tool (no token header; and a token only works
// from the viewer's own network, for 5 minutes), and a tool that copies the
// key from the network gets the masked bytes, which do not decrypt.
//
// Google is the one exception, as its video guidelines allow: a request from
// an address that reverse-resolves to Google's crawler (and back) gets a small
// plain copy through GET /api/video?op=file&v=ID, so the video can be indexed
// and show key moments. That address is in the page's structured data; for
// anyone else it answers 403.
//
// Limits, honestly: this stops plain links, download sites and download tools.
// Anyone who can play a video can screen-record it; the watermark burned into
// every frame (and the viewer's code over the player) is what answers that.
// Only DRM (Widevine/FairPlay, from a paid video host) goes further.
//
// Configuration (Vercel environment variables):
//   SUPABASE_SECRET_KEY   already set: reads videos and keys, signs segments
//   VIDEO_TOKEN_SECRET    optional: signs viewer tokens. Without it a secret
//                         is derived from SUPABASE_SECRET_KEY.
import crypto from 'node:crypto'
import dns from 'node:dns'

export const TOKEN_TTL_S = 5 * 60
export const SEGMENT_URL_EXTRA_S = 3 * 60 * 60 // segment addresses last the video's length plus this
export const PRIVATE_BUCKET = 'lesson-video'
const ID = /^[a-z0-9][a-z0-9-]{2,79}$/
const STARTS_PER_MINUTE = 30

// ── Secrets and tokens ───────────────────────────────────────────────────────

export function tokenSecret(env = process.env) {
  if (env.VIDEO_TOKEN_SECRET) return Buffer.from(env.VIDEO_TOKEN_SECRET, 'utf8')
  const base = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (!base) return null
  return Buffer.from(crypto.hkdfSync('sha256', base, 'wassce-video', 'viewer-token-v1', 32))
}

const mac = (secret, text) => crypto.createHmac('sha256', secret).update(text).digest()

/**
 * The part of an address a viewer keeps while watching: the first two parts
 * of an IPv4 address (a /16) or the first two groups of an IPv6 one (a /32).
 * Wide enough for a phone whose carrier moves it between nearby addresses,
 * narrow enough that a token copied to a download site's server is refused.
 */
export function networkOf(ip) {
  if (!ip) return ''
  let a = String(ip).trim().toLowerCase()
  const mapped = a.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped) a = mapped[1]
  if (/^\d+\.\d+\.\d+\.\d+$/.test(a)) return a.split('.').slice(0, 2).join('.')
  if (a.includes(':')) {
    const [head] = a.split('::')
    const groups = head.split(':').filter(Boolean)
    while (groups.length < 2) groups.push('0')
    return groups.slice(0, 2).map((g) => g.replace(/^0+(?=.)/, '')).join(':')
  }
  return a
}

/** The viewer's address, as Vercel's edge reports it (it overwrites these headers). */
export function clientIp(request) {
  return (request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0] || '').trim()
}

const netTag = (secret, ip) => mac(secret, `net|${networkOf(ip)}`).subarray(0, 6).toString('base64url')

export function issueToken(secret, { video, revision, ip, now = Date.now() }) {
  const payload = { v: video, r: revision, n: crypto.randomBytes(12).toString('base64url'), e: Math.floor(now / 1000) + TOKEN_TTL_S, i: netTag(secret, ip) }
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return { token: `${body}.${mac(secret, body).subarray(0, 24).toString('base64url')}`, payload }
}

/** The token's contents if it is ours, unexpired, for this video and from this network; else null. */
export function readToken(secret, token, { video, ip, now = Date.now() }) {
  if (typeof token !== 'string' || token.length > 600) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const want = mac(secret, body).subarray(0, 24)
  const got = Buffer.from(sig, 'base64url')
  if (got.length !== want.length || !crypto.timingSafeEqual(got, want)) return null
  let p
  try {
    p = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
  } catch {
    return null
  }
  if (!p || p.v !== video || typeof p.e !== 'number' || p.e * 1000 < now) return null
  if (p.i !== netTag(secret, ip)) return null
  return p
}

/** The 16 bytes the key is XORed with for one viewer (their token's nonce). */
export const keyMask = (secret, nonce) => mac(secret, `mask|${nonce}`).subarray(0, 16)

export const maskKey = (keyHex, mask) => {
  const key = Buffer.from(keyHex, 'hex')
  if (key.length !== 16) throw new Error('bad key')
  return Buffer.from(key.map((b, i) => b ^ mask[i]))
}

/** A short code for the viewer, shown over the player and logged with the start. */
export const viewerCode = (nonce) =>
  crypto.createHash('sha256').update(nonce).digest().readUInt32BE(0).toString(36).toUpperCase().padStart(6, '0').slice(-6)

// ── Playlist ─────────────────────────────────────────────────────────────────

/** Segment file names in a stored playlist, in order. */
export const segmentNames = (playlist) => playlist.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))

/** The stored playlist with this viewer's key address and signed segment addresses. */
export function viewerPlaylist(playlist, keyUrl, signed) {
  return playlist
    .split('\n')
    .map((line) => {
      const l = line.trim()
      if (l.startsWith('#EXT-X-KEY')) return l.replace('URI="KEY"', `URI="${keyUrl}"`)
      if (!l || l.startsWith('#')) return l
      const url = signed.get(l)
      if (!url) throw new Error(`segment ${l} has no signed address`)
      return url
    })
    .join('\n')
}

// ── Google's crawler ─────────────────────────────────────────────────────────

const GOOGLE_HOSTS = /\.(googlebot\.com|google\.com|googleusercontent\.com)$/i

/** Google's own check: the address reverse-resolves to Google, and that name resolves back to it. */
export async function isGooglebot(ip, resolver = dns.promises) {
  if (!ip) return false
  try {
    const names = await resolver.reverse(ip)
    for (const name of names) {
      if (!GOOGLE_HOSTS.test(name)) continue
      const back = await resolver.lookup(name, { all: true })
      if (back.some((a) => a.address === ip)) return true
    }
  } catch {
    return false
  }
  return false
}

// ── Requests ─────────────────────────────────────────────────────────────────

const SITE = () => (process.env.SITE_URL || 'https://wasscetutor.com').replace(/\/$/, '')

/** The website, the Android app (Capacitor: https://localhost) and local development. */
export function allowedOrigin(origin, site = SITE()) {
  if (!origin) return null
  if (origin === site || origin === 'https://www.wasscetutor.com' || origin === 'https://localhost' || origin === 'capacitor://localhost') return origin
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin
  return null
}

function cors(request) {
  const origin = allowedOrigin(request.headers.get('origin'))
  return origin
    ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type, x-video-token', 'Access-Control-Max-Age': '600', Vary: 'Origin' }
    : { Vary: 'Origin' }
}

const PRIVATE_HEADERS = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' }

const reply = (request, body, status, type = 'application/json') =>
  new Response(type === 'application/json' ? JSON.stringify(body) : body, { status, headers: { 'Content-Type': type, ...PRIVATE_HEADERS, ...cors(request) } })

const refuse = (request, status = 403, code = 'forbidden') => reply(request, { code }, status)

/**
 * Is this a request the site's own player made? Browsers send Sec-Fetch-*
 * headers that a page cannot forge: an address pasted into the address bar
 * is a "document" navigation, and a request from another site is cross-site
 * without one of our origins.
 */
export function fromOurPlayer(request) {
  const dest = request.headers.get('sec-fetch-dest')
  if (dest && dest !== 'empty') return false
  const origin = request.headers.get('origin')
  if (origin) return Boolean(allowedOrigin(origin))
  // A same-origin GET carries no Origin; browsers too old to send Sec-Fetch-*
  // still need the token header, which only a script can add.
  const site = request.headers.get('sec-fetch-site')
  return !site || site === 'same-origin'
}

// Starts per network, per server instance: a brake on scripted token farming.
const starts = new Map()
function tooMany(ip, now = Date.now()) {
  const key = networkOf(ip) + '|' + ip
  const recent = (starts.get(key) || []).filter((t) => now - t < 60_000)
  recent.push(now)
  starts.set(key, recent)
  if (starts.size > 5000) starts.clear()
  return recent.length > STARTS_PER_MINUTE
}

/**
 * The handler, given its dependencies so it can be tested without Vercel:
 *   store.video(id)            -> { id, revision, playlist, storage_prefix, duration_s } | null (published only)
 *   store.key(id, revision)    -> key hex | null
 *   store.sign(paths, seconds) -> Map(path -> absolute signed URL)
 */
export function videoHandler({ store, secret, resolver = dns.promises, log = console.log }) {
  async function handle(request) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(request) })
    const url = new URL(request.url)
    const op = url.searchParams.get('op')
    const ip = clientIp(request)
    if (!secret) return refuse(request, 503, 'not_configured')

    if (op === 'start' && request.method === 'POST') {
      // Browsers always send Origin with a POST: no Origin, or someone else's, is not our player.
      if (!fromOurPlayer(request) || !allowedOrigin(request.headers.get('origin'))) return refuse(request)
      if (tooMany(ip)) return refuse(request, 429, 'slow_down')
      const body = await request.json().catch(() => ({}))
      const id = typeof body?.video === 'string' ? body.video : ''
      if (!ID.test(id)) return refuse(request, 400, 'bad_request')
      const video = await store.video(id)
      if (!video) return refuse(request, 404, 'not_found')
      const { token, payload } = issueToken(secret, { video: id, revision: video.revision, ip })
      const code = viewerCode(payload.n)
      log(`[video] start ${id}@${video.revision} viewer=${code} net=${networkOf(ip)}`)
      return reply(request, { token, mask: keyMask(secret, payload.n).toString('hex'), viewer: code, expires: payload.e }, 200)
    }

    const id = url.searchParams.get('v') || ''
    if (!ID.test(id)) return refuse(request, 400, 'bad_request')

    if (op === 'file' && request.method === 'GET') {
      // Google's crawler only (see the top of this file).
      if (!(await isGooglebot(ip, resolver))) return refuse(request)
      const video = await store.video(id)
      if (!video) return refuse(request, 404, 'not_found')
      const path = `${video.storage_prefix}preview.mp4`
      const signed = await store.sign([path], 3600)
      return new Response(null, { status: 302, headers: { Location: signed.get(path), 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } })
    }

    if ((op === 'playlist' || op === 'key') && request.method === 'GET') {
      if (!fromOurPlayer(request)) return refuse(request)
      const token = readToken(secret, request.headers.get('x-video-token'), { video: id, ip })
      if (!token) return refuse(request, 403, 'expired')
      const video = await store.video(id)
      if (!video || video.revision !== token.r) return refuse(request, 409, 'changed')

      if (op === 'playlist') {
        const names = segmentNames(video.playlist)
        const signed = await store.sign(names.map((n) => video.storage_prefix + n), Math.ceil(Number(video.duration_s)) + SEGMENT_URL_EXTRA_S)
        const byName = new Map(names.map((n) => [n, signed.get(video.storage_prefix + n)]))
        const keyUrl = `${url.origin}/api/video?op=key&v=${id}`
        return reply(request, viewerPlaylist(video.playlist, keyUrl, byName), 200, 'application/vnd.apple.mpegurl')
      }
      const keyHex = await store.key(id, token.r)
      if (!keyHex) return refuse(request, 404, 'not_found')
      return new Response(maskKey(keyHex, keyMask(secret, token.n)), { status: 200, headers: { 'Content-Type': 'application/octet-stream', ...PRIVATE_HEADERS, ...cors(request) } })
    }
    return refuse(request, 404, 'not_found')
  }
  return handle
}

/** The store, from Supabase with the server key. Video rows are cached for a minute per instance. */
export function supabaseStore(client, now = () => Date.now()) {
  const cache = new Map()
  return {
    async video(id) {
      const hit = cache.get(id)
      if (hit && now() - hit.at < 60_000) return hit.row
      const { data } = await client.from('lesson_videos').select('id, revision, playlist, storage_prefix, duration_s').eq('id', id).eq('is_published', true).maybeSingle()
      cache.set(id, { at: now(), row: data ?? null })
      return data ?? null
    },
    async key(id, revision) {
      const { data } = await client.from('lesson_video_keys').select('key_hex').eq('video_id', id).eq('revision', revision).maybeSingle()
      return data?.key_hex ?? null
    },
    async sign(paths, seconds) {
      const { data, error } = await client.storage.from(PRIVATE_BUCKET).createSignedUrls(paths, seconds)
      if (error) throw new Error(`signing failed: ${error.message}`)
      return new Map(data.filter((d) => d.signedUrl).map((d) => [d.path, d.signedUrl]))
    },
  }
}
