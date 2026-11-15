// Email engine settings. Secrets come from Vercel environment variables and
// are never logged or sent to the browser. See docs/email-engine.md.
//
//   EMAIL_MODE            off (default) | dry-run | pilot | live
//   RESEND_API_KEY        the existing Resend account's API key
//   EMAIL_FROM            the verified sender, e.g. "WASSCE Tutor <hello@wasscetutor.com>"
//   EMAIL_REPLY_TO        optional reply-to address
//   EMAIL_TOKEN_SECRET    32+ random characters; signs unsubscribe and click links
//   CRON_SECRET           Vercel Cron sends it; the run endpoint rejects anything else
//   RESEND_WEBHOOK_SECRET the signing secret of the Resend webhook (whsec_…)
//   EMAIL_ONLY_TO         pilot mode: comma-separated addresses that may receive email
//   EMAIL_DAILY_LIMIT     most engine emails per UTC day (default 80; Resend's free plan allows 100)

export const MODES = ['off', 'dry-run', 'pilot', 'live']

export function emailEnv() {
  const mode = (process.env.EMAIL_MODE || 'off').trim().toLowerCase()
  const limit = Number.parseInt(process.env.EMAIL_DAILY_LIMIT || '', 10)
  return {
    mode: MODES.includes(mode) ? mode : 'off',
    resendKey: process.env.RESEND_API_KEY || '',
    from: process.env.EMAIL_FROM || '',
    replyTo: process.env.EMAIL_REPLY_TO || '',
    tokenSecret: process.env.EMAIL_TOKEN_SECRET || '',
    cronSecret: process.env.CRON_SECRET || '',
    webhookSecret: process.env.RESEND_WEBHOOK_SECRET || '',
    onlyTo: (process.env.EMAIL_ONLY_TO || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
    dailyLimit: Number.isFinite(limit) && limit >= 0 ? Math.min(limit, 5000) : 80,
    site: (process.env.SITE_URL || 'https://wasscetutor.com').replace(/\/$/, ''),
  }
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
