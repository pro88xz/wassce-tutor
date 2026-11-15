# Tutor marketplace and affiliate release

The application code is deployed by Vercel. The database migration and Supabase Edge Function are separate release steps; a successful Vercel build does not apply either one.

## 1. Apply the database migration

Run the complete file below in the Supabase SQL Editor for the production project:

`supabase/migrations/20261108_11_tutor_affiliate_marketplace.sql` and `supabase/migrations/20261108_12_booking_transition_guards.sql`

The migration is additive and does not change Monime checkout initiation, payment verification, existing payment rows or subscription access logic.

It creates:
- Tutor applications, private qualification evidence, public tutor profiles and subject rates.
- Tutor weekly availability, conflict-safe bookings, completed-session reviews and notifications.
- Affiliate applications, referral attribution, first-verified-payment commissions and payout reservations.
- Security-definer RPCs and Row Level Security policies.

After execution, verify that all statements complete successfully and that the new tables and functions exist before enabling the feature on production.

## 2. Deploy the notification Edge Function

The function source is:

`supabase/functions/send-notification-email/index.ts`

Deploy through the GitHub Actions workflow `.github/workflows/deploy-notification-email.yml` It runs by itself when the function changes on `main`, and can be started by hand from the Actions tab.

The wording of each email and the branded HTML shell are in `supabase/functions/send-notification-email/email.ts` (tests: `npm run email:test`).

Add these GitHub Actions repository secrets before running it:
- `SUPABASE_ACCESS_TOKEN`: a Supabase personal access token.
- `SUPABASE_PROJECT_REF`: the project reference from the Supabase project URL.
- `RESEND_API_KEY`: the API key for the verified Resend account.
- `EMAIL_FROM`: a sender address or sender identity verified in Resend.

The workflow sets `APP_ORIGIN=https://wasscetutor.com`, updates the three Edge Function secrets, and deploys only `send-notification-email`. It does not expose the database password or service-role key to the browser.

Supabase supplies `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` to deployed Edge Functions. Do not put the service-role key in browser code or Vercel public environment variables.

The sender domain/address must already be verified in Resend. The function verifies the caller's JWT and only sends persisted notification events created by that caller for the requested entity.

## 3. Production release order

1. Confirm the Vercel preview build is green.
2. Apply the database migration.
3. Configure the four GitHub Actions secrets and run the notification deployment workflow.
4. Merge the approved PR to `main`, allowing Vercel to deploy production.
5. Test with dedicated accounts: student, tutor applicant, approved tutor, affiliate and admin.
6. Verify booking conflict rejection, status transitions, realtime inbox updates, email delivery, first-payment commission idempotency and payout reservation/release.

Tutor session rates are listing/booking amounts. This release does not collect tutor-session payments or alter the existing Monime subscription checkout.
