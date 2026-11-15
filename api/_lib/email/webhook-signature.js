// Resend signs webhooks with the Svix scheme.
import crypto from 'node:crypto'

/** Svix signatures: base64(HMAC-SHA256(secret, `${id}.${timestamp}.${body}`)), header "v1,<sig> v1,<sig>". */
export function verifyResendSignature(rawBody, headers, secret, nowSeconds = Math.floor(Date.now() / 1000)) {
  const id = headers.get('svix-id')
  const timestamp = headers.get('svix-timestamp')
  const signatures = headers.get('svix-signature')
  if (!secret || !id || !timestamp || !signatures || !/^\d+$/.test(timestamp)) return false
  if (Math.abs(nowSeconds - Number(timestamp)) > 300) return false
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const expected = crypto.createHmac('sha256', key).update(`${id}.${timestamp}.${rawBody}`).digest()
  return signatures.split(' ').some((part) => {
    const [version, sig] = part.split(',')
    if (version !== 'v1' || !sig) return false
    const given = Buffer.from(sig, 'base64')
    return given.length === expected.length && crypto.timingSafeEqual(given, expected)
  })
}
