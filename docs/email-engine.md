# Email retention engine

WASSCE Tutor's own lifecycle emails. No marketing platform: Supabase decides
and records, the existing Resend account delivers, and the rules live in this
repository.

## What it sends

The engine runs once a day at 10:00 Freetown time (GMT). The clock is in the
database: **pg_cron** in Supabase calls `/api/email/run` on the website with the
schedule secret from Vault (`public.email_engine_kick()`, migration 21; the
reply is kept for a few hours in `net._http_response`). The GitHub workflow
**Email engine daily run** is a backup at 10:37, because GitHub's scheduler can
delay or drop jobs on the hour; it only sends what the 10:00 run missed. You
can also start a run by hand from the Actions tab, and each GitHub run's
summary is in its log. For every account it decides whether one email is due,
highest priority first:

| Programme | Who | Emails | Needs marketing consent |
|---|---|---|---|
| Access started | Paid in the last 3 days | What is now unlocked and how to use it | No (account email) |
| Access ending | Access ends within 3 days | The end date and what stays free | No (account email) |
| Unfinished payment | Started a checkout 2 hours to 30 days ago, did not pay, no access | The plan's benefits with real counts and price; a second one 3 days later | Yes |
| First study session | Account 1–14 days old, never studied | Make a first start; a second one 4 days later | Yes |
| Weekly progress | Studied in the last 7 days; sent Sunday (Monday or Tuesday if the daily limit was reached) | Their real week: lessons, practice and average score, progress in their subject, new lessons, and the next lesson | Yes |
| Come back to studying | No study and no sign-in for 7 days (up to a year) | Their last subject, or their paid access; a second one a week later | Yes |

### What the study emails add

Unfinished payment, First study session, Weekly progress and Come back to
studying also carry, from the student's own records
(`public.email_student_extras`, migration 34, server key only):

- **A question to answer.** A reviewed practice question from the subject
  they studied last (else the first subject they chose) that they have not
  answered, chosen to read well in an email: no diagram, maths, table, quoted
  passage or link, four short options. The same one all day, a new one the
  next day. Each option is a link to `/q/<question>?a=<letter>`
  (`src/routes/q.$questionId.tsx`): the site marks it at once ("Spot on." with
  a check and a small burst, or "Needs work" with the right answer), shows the
  full working, then offers: continue where you stopped, more questions on the
  topic, or the topic's lessons. The page needs no account and is not indexed.
- **A tutor for a weak subject.** When their practice average in a subject
  is under 50% over two sets or more in the last 60 days, a card names an
  active, listed tutor who teaches it, with their town, lessons a week and fee.
  "Book <name>" opens the tutor's page with the booking open and that subject
  chosen (the same link format as signing in to book, `src/lib/book-return.ts`).
- **Where to carry on** (Unfinished payment and First study session): the
  next lesson they have not done in that subject.

Anything not found is left out of the email. If the function fails, the
emails go without these parts and the run's summary says `extras:
unavailable`.

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

Nothing has to be copied into Vercel. The Resend key and sender already exist
as GitHub secrets (`RESEND_API_KEY`, `EMAIL_FROM`); the setup workflow copies
them into Supabase Vault, where the website reads them with the Supabase key
it already has. The link-signing and schedule secrets are made inside the
database by the migration.

1. GitHub → **Actions** → **Set up email engine** → *Run workflow* (on
   `main`). It applies migration 16 once, stores the secrets, and connects
   Resend's bounce and complaint webhook through the Resend API (if the Resend
   key is allowed to manage webhooks; otherwise it warns and you can add the
   webhook by hand, below). Run it again whenever you change one of those
   GitHub secrets.
   When starting the run you can also choose the **mode**, **pilot
   addresses** and **daily limit** (the same settings as Admin → Emails).
2. Only if the workflow warned about the webhook: Resend → Webhooks → add
   `https://wasscetutor.com/api/email/webhook` with the events *email.sent,
   email.delivered, email.bounced, email.complained*. Save its signing secret
   (`whsec_…`) as the GitHub secret `RESEND_WEBHOOK_SECRET`, then run the setup
   workflow again. (Optional too: `EMAIL_REPLY_TO`.)

## Launching safely

Everything below is in the website's **Admin → Emails** page.

1. **Send me test emails**: one of each email to your own inbox. Check them
   on a phone.
2. Mode **Dry run**, save. The next daily run decides who is due and prints
   it in the workflow log, but sends nothing. (Actions → Email engine daily
   run → *Run workflow* to try it straight away.)
3. Mode **Pilot** with your own addresses, save: real rules, but only those
   addresses receive email.
4. Mode **Live**.

Admin → **Emails** shows the mode, consent totals, emails sent today, and per
programme: sent, failed, skipped, clicked, and how many students studied or
paid within 7 days. **Pause all sending** stops everything at once and
cancels anything queued.

## How it stays safe

- Settings can be overridden by Vercel environment variables of the same
  meaning (`EMAIL_MODE`, `EMAIL_DAILY_LIMIT`, `EMAIL_ONLY_TO`,
  `RESEND_API_KEY`, `EMAIL_FROM`, …): setting `EMAIL_MODE=off` in Vercel is an
  emergency stop that does not depend on the database. None are needed.
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

- Wording: `api/_lib/email/templates.js` (the question, tutor and
  continue parts: `withStudyExtras`). Preview with
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

Rollback: set the mode to Off, then run the SQL at the end of the migration
file, which removes the engine and its Vault secrets.
