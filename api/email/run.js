// GET /api/email/run: one run of the email engine. Started once a day by the
// GitHub workflow "Email engine daily run", which sends the schedule secret
// kept in Supabase Vault ("Authorization: Bearer <secret>"); any other caller
// is refused. What it does is decided by the mode set in Admin → Emails
// (off, dry-run, pilot, live). See docs/email-engine.md.
import { loadEmailConfig } from '../_lib/email/config.js'
import { runEngine } from '../_lib/email/engine.js'
import { sendViaResend } from '../_lib/email/resend.js'
import { db } from '../_lib/server.js'
import crypto from 'node:crypto'

const reply = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })

function authorised(request, secret) {
  if (!secret) return false
  const given = Buffer.from(request.headers.get('authorization') ?? '')
  const expected = Buffer.from(`Bearer ${secret}`)
  return given.length === expected.length && crypto.timingSafeEqual(given, expected)
}

export async function GET(request) {
  const client = db()
  const config = await loadEmailConfig(client, { fresh: true })
  if (!authorised(request, config.cronSecret)) return reply({ error: 'unauthorised' }, 401)
  try {
    const summary = await runEngine({
      client,
      env: config,
      send: (message) => sendViaResend({ apiKey: config.resendKey, ...message }),
    })
    console.log(`[email] run: ${JSON.stringify(summary)}`)
    return reply(summary)
  } catch (e) {
    console.error(`[email] run failed: ${e?.message ?? e}`)
    return reply({ error: 'run failed' }, 500)
  }
}
