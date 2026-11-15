// Email engine settings. Normally everything comes from Supabase: the mode,
// pilot addresses and daily limit from Admin → Emails (email_settings), and
// the secrets from Supabase Vault, where the "Set up email engine (16)"
// workflow copies the Resend key and sender from GitHub secrets. Nothing has
// to be copied into Vercel. See docs/email-engine.md.
//
// Optional Vercel environment variables: EMAIL_MODE=off is an emergency stop
// that does not depend on the database (any other EMAIL_MODE value is ignored,
// so a stale variable can never hold the engine back). RESEND_API_KEY,
// EMAIL_FROM, EMAIL_REPLY_TO, EMAIL_TOKEN_SECRET and RESEND_WEBHOOK_SECRET
// replace the stored values if set. A CRON_SECRET is accepted in addition to
// the stored schedule secret. Mode, pilot addresses and the daily limit come
// only from the database.

export const MODES = ['off', 'dry-run', 'pilot', 'live']

const list = (v) =>
  (Array.isArray(v) ? v : String(v ?? '').split(','))
    .map((a) => String(a).trim().toLowerCase())
    .filter(Boolean)

/** Settings from Vercel environment variables only (each one optional). */
export function emailEnv() {
  const e = process.env
  return {
    mode: e.EMAIL_MODE?.trim().toLowerCase() || null,
    resendKey: e.RESEND_API_KEY || null,
    from: e.EMAIL_FROM || null,
    replyTo: e.EMAIL_REPLY_TO || null,
    tokenSecret: e.EMAIL_TOKEN_SECRET || null,
    cronSecret: e.CRON_SECRET || null,
    webhookSecret: e.RESEND_WEBHOOK_SECRET || null,
    onlyTo: e.EMAIL_ONLY_TO ? list(e.EMAIL_ONLY_TO) : null,
    dailyLimit: e.EMAIL_DAILY_LIMIT ? Number.parseInt(e.EMAIL_DAILY_LIMIT, 10) : null,
    site: (e.SITE_URL || 'https://wasscetutor.com').replace(/\/$/, ''),
  }
}

/** Combines the database settings (row from email_engine_config()) with any environment overrides. */
export function mergeConfig(row, env = emailEnv(), settingsError = null) {
  const stored = MODES.includes(row?.mode) ? row.mode : 'off'
  const limit = row?.daily_limit
  return {
    mode: env.mode === 'off' ? 'off' : stored,
    modeFromEnv: env.mode === 'off',
    paused: Boolean(row?.paused),
    resendKey: env.resendKey ?? row?.resend_api_key ?? '',
    from: env.from ?? row?.email_from ?? '',
    replyTo: env.replyTo ?? row?.reply_to ?? '',
    tokenSecret: env.tokenSecret ?? row?.token_secret ?? '',
    /** The daily-run workflow sends the stored secret; a Vercel CRON_SECRET also works. */
    cronSecrets: [row?.cron_secret, env.cronSecret].filter((v) => typeof v === 'string' && v.length >= 16),
    webhookSecret: env.webhookSecret ?? row?.webhook_secret ?? '',
    onlyTo: list(row?.pilot_addresses ?? []),
    dailyLimit: Number.isFinite(limit) && limit >= 0 ? Math.min(limit, 5000) : 80,
    site: env.site,
    /** Why the stored settings could not be read (an error code, never a secret), or null. */
    settingsError,
  }
}

let cached = null
/** The engine's settings, read from Supabase (cached for a minute per server instance). */
export async function loadEmailConfig(client, { fresh = false } = {}) {
  if (!fresh && cached && Date.now() - cached.at < 60_000) return cached.config
  const { data, error } = await client.rpc('email_engine_config').maybeSingle()
  if (error) console.error(`[email] settings not readable: ${error.code ?? ''} ${error.message}`)
  const config = mergeConfig(error ? null : data, emailEnv(), error ? String(error.code || 'unknown') : data ? null : 'no_settings_row')
  cached = { at: Date.now(), config }
  return config
}

/** Whether sending can work at all. Dry runs need only the database. */
export function canSend(e) {
  return Boolean(e.resendKey && e.from && e.tokenSecret.length >= 32)
}

/** Contact details shown in emails. KEEP IN SYNC with src/lib/contact.ts. */
export const CONTACT = {
  email: 'secretsafe.cc@gmail.com',
  whatsapp: '23277884195',
  phoneDisplay: '+232 77 884195',
}
