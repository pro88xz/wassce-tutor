// /api/tutor-request: saves a "find me a tutor" request from the form on /tutors and the
// subject tutor pages (src/components/tutors/BookingForm.tsx). The form still hands every
// request to the business WhatsApp; this is the copy admins see in Admin -> Tutor requests.
//
// Requests used to be written straight into tutor_requests from the browser, so a script could
// add rows by calling the database directly and skip the form's spam trap. Now the browser
// posts here, and this function:
//   1. drops the request quietly when the hidden "website" field (a trap people never see or
//      fill in) has anything in it;
//   2. confirms the form's Cloudflare Turnstile token when TURNSTILE_SECRET_KEY is set (the same
//      invisible check as the video player, api/_lib/video.js; off until the key is set);
//   3. accepts at most 3 requests from one phone number in an hour;
//   4. checks every field against the table's own limits (migration 06), then writes the row
//      with the server key.
// Answers: 200 { saved: true } or { saved: false, reason }. The form shows "Send on WhatsApp"
// either way, so a request is never lost because of this check.
import { db, json, preflight, requestUser } from './_lib/server.js'
import { turnstileVerifier } from './_lib/video.js'

const LEVELS = new Set(['SSS1', 'SSS2', 'SSS3', 'Private candidate'])
const MODES = new Set(['home', 'either', 'online'])
const PER_PHONE_PER_HOUR = 3

const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max + 1) : '')

/** The request as the table stores it, or the reason it cannot be stored. */
export function validRequest(body) {
  const r = {
    name: text(body?.name, 80),
    phone: text(body?.phone, 20),
    subject: text(body?.subject, 60),
    level: text(body?.level, 40),
    mode: text(body?.mode, 10),
    town: text(body?.town, 60),
    availability: text(body?.availability, 200),
    message: text(body?.message, 1000),
  }
  if (r.name.length < 2 || r.name.length > 80) return { reason: 'name' }
  if (!/^[+\d][\d\s()-]{6,19}$/.test(r.phone)) return { reason: 'phone' }
  if (!r.subject || r.subject.length > 60) return { reason: 'subject' }
  if (!LEVELS.has(r.level)) return { reason: 'level' }
  if (!MODES.has(r.mode)) return { reason: 'mode' }
  if (r.town.length > 60 || r.availability.length > 200 || r.message.length > 1000) return { reason: 'length' }
  return {
    row: {
      name: r.name,
      phone: r.phone,
      subject: r.subject,
      level: r.level,
      mode: r.mode,
      town: r.town || null,
      availability: r.availability || null,
      message: r.message || null,
    },
  }
}

/** The handler, with its database and people check passed in (so tests can supply fakes). */
export function tutorRequestHandler({ client, human }) {
  return async (request) => {
    if (request.method === 'OPTIONS') return preflight(request)
    if (request.method !== 'POST') return json(request, { error: 'POST only' }, 405)
    let body
    try {
      body = await request.json()
    } catch {
      return json(request, { saved: false, reason: 'body' }, 400)
    }
    // 1. The trap: answer as if it worked, so a script learns nothing.
    if (typeof body?.website === 'string' && body.website.trim()) return json(request, { saved: true })
    // 2. A person, when the check is on.
    if (human) {
      const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || undefined
      if (!(await human(body?.token, ip))) return json(request, { saved: false, reason: 'check' }, 403)
    }
    // 4 (cheap first). The fields.
    const { row, reason } = validRequest(body)
    if (!row) return json(request, { saved: false, reason }, 400)
    // 3. Not too many from one phone.
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count, error: countError } = await client
      .from('tutor_requests')
      .select('id', { count: 'exact', head: true })
      .eq('phone', row.phone)
      .gte('created_at', since)
    if (countError) return json(request, { saved: false, reason: 'unavailable' }, 503)
    if ((count ?? 0) >= PER_PHONE_PER_HOUR) return json(request, { saved: false, reason: 'too-many' }, 429)
    const user = await requestUser(request, client)
    const { error } = await client.from('tutor_requests').insert({ ...row, user_id: user?.id ?? null })
    if (error) return json(request, { saved: false, reason: 'unavailable' }, 503)
    return json(request, { saved: true })
  }
}

let handle
const handler = (request) => {
  handle ??= tutorRequestHandler({ client: db(), human: turnstileVerifier(process.env.TURNSTILE_SECRET_KEY) })
  return handle(request)
}

export const POST = handler
export const OPTIONS = handler
