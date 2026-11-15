# Email retention engine

WASSCE Tutor's own lifecycle emails. No marketing platform: Supabase decides
and records, the existing Resend account delivers, and the rules live in this
repository.

## What it sends

The engine runs once a day at 10:00 Freetown time (Vercel Cron →
`/api/email/run`). For every account it decides whether one email is due,
highest priority first:

| Programme | Who | Emails | Needs marketing consent |
|---|---|---|---|
| Access started | Paid in the last 3 days | What is now unlocked and how to use it | No (account email) |
| Access ending | Access ends within 3 days | The end date and what stays free | No (account email) |
| Unfinished payment | Started a checkout 2+ hours ago, did not pay, no access | The plan's benefits with real counts and price; a second one 3 days later | Yes |
| First study session | Account 1–14 days old, never studied | Make a first start; a second one 4 days later | Yes |
| Come back to studying | No study and no sign-in for 7 days (up to a year) | Their last subject, or their paid access; a second one a week later | Yes |

Limits: one engine email per student per day; at most 2 marketing emails in 7
days and 48 hours between them; every sequence ends by itself (paying,
studying, signing in, or time passing). Unconfirmed, bounced and complained
addresses are never emailed. Tutor and affiliate accounts get no study
reminders. The rules are in `api/_lib/email/rules.js`, with tests in
`scripts/email/engine.test.mjs`.

## Consent

- Accounts that existed when migration 16 ran are subscribed by default
  (`consent_source = existing_account_default`).
- New students choose on the sign-up page. The box is ticked to start with
  (`src/lib/email-consent.ts`). Every change is kept in `email_consent_log`
  with its source and wording version.
- Every marketing email has a visible unsubscribe link and one-click
  unsubscribe headers. Students can also switch it off under Account →
  Preferences. Account emails still arrive after unsubscribing.

## Setting it up

1. **Database.** In GitHub → Actions, run **Apply email engine migration (16)**
   on `main`.
2. **Vercel environment variables** (Settings → Environment Variables,
   Production):

   | Name | Value |
   |---|---|
   | `RESEND_API_KEY` | The same Resend key used by the tutor notification function |
   | `EMAIL_FROM` | The same verified sender, e.g. `WASSCE Tutor <hello@wasscetutor.com>` |
   | `EMAIL_TOKEN_SECRET` | 32+ random characters (signs unsubscribe and click links). Generate with `openssl rand -base64 48`. Never change it casually: old unsubscribe links stop working. |
   | `CRON_SECRET` | Another random string; Vercel Cron sends it automatically |
   | `EMAIL_MODE` | `dry-run` to start (see below) |
   | `EMAIL_ONLY_TO` | For pilot mode: your own addresses, comma-separated |
   | `EMAIL_DAILY_LIMIT` | Optional, default 80. Resend's free plan allows 100 a day. |
   | `EMAIL_REPLY_TO` | Optional reply-to address |

3. **Resend webhook** (bounces and complaints): Resend → Webhooks → add
   `https://wasscetutor.com/api/email/webhook` with the events *email.sent,
   email.delivered, email.bounced, email.complained*. Put its signing secret
   (`whsec_…`) in `RESEND_WEBHOOK_SECRET`.
4. Redeploy so the variables take effect.

## Launching safely

1. `EMAIL_MODE=dry-run`. Each daily run decides who is due and logs it in
   Vercel → Logs (`[email] run: …`), but sends nothing.
2. Admin → **Emails** → **Send me test emails**: one of each email to your own
   inbox. Check it on a phone.
3. `EMAIL_MODE=pilot` with `EMAIL_ONLY_TO` set: real rules, but only those
   addresses can receive email.
4. `EMAIL_MODE=live`.

Admin → **Emails** shows the mode, consent totals, emails sent today, and per
programme: sent, failed, skipped, clicked, and how many students studied or
paid within 7 days. **Pause all sending** stops everything at once and
cancels anything queued.

## How it stays safe

- Each email has a unique key (`programme:step:anchor`); the database refuses a
  second live job with the same key, and Resend gets the same key as its
  Idempotency-Key. Concurrent runs claim jobs with `FOR UPDATE SKIP LOCKED`.
- A job left half-sent is marked `unknown` and never re-sent.
- Consent and suppression are checked again at the moment of sending.
- Links in emails go through `/api/email/c`, which only redirects to paths
  stored with the job on wasscetutor.com.
- Unsubscribe and click links are signed with `EMAIL_TOKEN_SECRET`. Opening an
  unsubscribe page changes nothing until the button is pressed; mail apps use
  the one-click POST.
- Webhooks are checked against Resend's signature before they are trusted.

## Changing things

- Wording: `api/_lib/email/templates.js`. Preview with
  `npm run email:preview -- <folder>` and open the HTML files.
- Timings and caps: `RULES` in `api/_lib/email/rules.js`.
- Prices and benefits come from `api/_lib/plans.js`; keep it in step with
  `src/lib/plans.ts`.
- Tests: `npm run email:test`.

## Not built yet

- Holdout groups (to measure what the emails add beyond what would have
  happened anyway).
- Weekly digest and new-lesson announcements.
- Automatic clean-up of old event rows.

Rollback: the migration file ends with the SQL that removes the engine. Set
`EMAIL_MODE=off` first.
