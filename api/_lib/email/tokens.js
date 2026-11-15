// Signed links. An unsubscribe link carries the account id and the day it was
// made, signed with EMAIL_TOKEN_SECRET; the signature, not the id, is what
// authorises the change. Click links are signed the same way so nobody can
// forge clicks or use the redirect to send people to other sites.
import crypto from 'node:crypto'

const DAY = 86_400_000
const UNSUBSCRIBE_DAYS = 400 // old emails keep working for over a year

const b64 = (buf) => Buffer.from(buf).toString('base64url')
const mac = (secret, text) => crypto.createHmac('sha256', secret).update(text).digest()
const same = (a, b) => a.length === b.length && crypto.timingSafeEqual(a, b)
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export function unsubscribeToken(secret, userId, now = Date.now()) {
  const body = `${userId}.${Math.floor(now / DAY).toString(36)}`
  return `${b64(body)}.${b64(mac(secret, `unsubscribe.${body}`))}`
}

/** Returns the account id, or null if the token is forged, malformed or too old. */
export function verifyUnsubscribeToken(secret, token, now = Date.now()) {
  if (!secret || typeof token !== 'string' || token.length > 300) return null
  const [bodyPart, sigPart] = token.split('.')
  if (!bodyPart || !sigPart) return null
  const body = Buffer.from(bodyPart, 'base64url').toString()
  const [userId, day36] = body.split('.')
  if (!UUID.test(userId ?? '') || !/^[0-9a-z]{1,8}$/.test(day36 ?? '')) return null
  if (!same(Buffer.from(sigPart, 'base64url'), mac(secret, `unsubscribe.${body}`))) return null
  const age = Math.floor(now / DAY) - Number.parseInt(day36, 36)
  return age >= 0 && age <= UNSUBSCRIBE_DAYS ? userId : null
}

export function clickSignature(secret, jobId, linkKey) {
  return b64(mac(secret, `click.${jobId}.${linkKey}`)).slice(0, 22)
}

export function verifyClick(secret, jobId, linkKey, sig) {
  if (!secret || !UUID.test(jobId ?? '') || !/^[a-z0-9_]{1,24}$/.test(linkKey ?? '') || typeof sig !== 'string') return false
  return same(Buffer.from(sig), Buffer.from(clickSignature(secret, jobId, linkKey)))
}

/** Only paths on our own site: never a full URL, never "//elsewhere". */
export function safePath(path) {
  return typeof path === 'string' && /^\/(?!\/)[A-Za-z0-9\-._~/?&=%]*$/.test(path) && path.length <= 300 ? path : null
}
