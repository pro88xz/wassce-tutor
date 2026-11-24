// The admin page's side of the email engine (Admin -> Emails), served by
// api/email/run.js as /api/email/run?admin. Admins only: "Authorization: Bearer
// <Supabase access token>".
//   GET   the engine's configuration: mode, what is set up, the daily limit
//   POST  { action: "test" } sends one example of every email to the admin's
//         own address, marked [Test], so the templates can be checked in a real inbox
// It was a function of its own (/api/email/admin) until the site reached the
// Hobby plan's 12 functions per deployment (scripts/check-functions.mjs).
import { canSend, loadEmailConfig } from './config.js'
import { composeMessage } from './engine.js'
import { sendViaResend } from './resend.js'
import { SAMPLES, TEMPLATES } from './templates.js'
import { db, json, requestUser } from '../server.js'

async function admin(request) {
  const client = db()
  const user = await requestUser(request, client)
  if (!user) return { error: 401 }
  const { data: profile } = await client.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  if (!profile?.is_admin) return { error: 403 }
  return { client, user }
}

export async function adminGet(request) {
  const who = await admin(request)
  if (who.error) return json(request, { error: 'Admins only' }, who.error)
  const env = await loadEmailConfig(who.client, { fresh: true })
  return json(request, {
    mode: env.mode,
    modeFromEnv: env.modeFromEnv,
    dailyLimit: env.dailyLimit,
    pilotRecipients: env.onlyTo.length,
    settingsError: env.settingsError,
    configured: {
      resend: Boolean(env.resendKey && env.from),
      tokenSecret: env.tokenSecret.length >= 32,
      cron: env.cronSecrets.length > 0,
      webhook: Boolean(env.webhookSecret),
    },
  })
}

export async function adminPost(request) {
  const who = await admin(request)
  if (who.error) return json(request, { error: 'Admins only' }, who.error)
  const body = await request.json().catch(() => ({}))
  if (body?.action !== 'test') return json(request, { error: 'Unknown action' }, 400)
  const env = await loadEmailConfig(who.client, { fresh: true })
  if (!canSend(env)) return json(request, { error: 'The Resend key and sender are not set up yet: run the "Set up email engine" workflow.' }, 503)

  const { data: stats } = await who.client.rpc('email_content_stats').maybeSingle()
  const results = []
  for (const key of Object.keys(TEMPLATES)) {
    const job = {
      job_id: null, // test links go straight to the page, untracked
      user_id: who.user.id,
      email: who.user.email,
      programme: `test_${key}`,
      template_key: key,
      payload: { ...SAMPLES[key], links: { cta: key.startsWith('pending') ? '/subscribe?plan=term' : key === 'access_ending' ? '/subscribe' : '/subjects' } },
    }
    const message = composeMessage(env, job, stats)
    const sent = await sendViaResend({ apiKey: env.resendKey, ...message, subject: `[Test] ${message.subject}`, idempotencyKey: `wassce-email-test-${key}-${Date.now()}` })
    results.push({ template: key, ok: sent.ok, error: sent.ok ? undefined : sent.error })
    await new Promise((r) => setTimeout(r, 550))
  }
  return json(request, { to: who.user.email, results })
}
