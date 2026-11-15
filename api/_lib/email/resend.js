// Sends one email through the existing Resend account. Retries only network
// errors, rate limits and server errors, always with the same Idempotency-Key,
// so a retry can never deliver a second copy.
const RESEND_API = 'https://api.resend.com/emails'

export async function sendViaResend({ apiKey, idempotencyKey, ...message }, { fetchImpl = fetch, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  let last = { ok: false, status: 0, error: 'not attempted' }
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) await sleep(500 * 2 ** attempt)
    let res
    try {
      res = await fetchImpl(RESEND_API, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey.slice(0, 256) },
        body: JSON.stringify(message),
      })
    } catch (e) {
      last = { ok: false, status: 0, error: `network: ${String(e?.message ?? e).slice(0, 120)}` }
      continue
    }
    const data = await res.json().catch(() => ({}))
    if (res.ok && data?.id) return { ok: true, id: data.id }
    last = { ok: false, status: res.status, error: String(data?.message ?? data?.name ?? `http ${res.status}`).slice(0, 300) }
    if (res.status !== 429 && res.status < 500) break
  }
  // 422 = Resend refused the address or message: do not try this address again.
  return { ...last, permanent: last.status === 422 }
}
