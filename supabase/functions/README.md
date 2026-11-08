# Tutor marketplace and affiliate release

The application code is deployed by Vercel. The database migration and Supabase Edge Function are separate release steps; a successful Vercel build does not apply either one.

## 1. Apply the database migration

Run the complete file below in the Supabase SQL Editor for the production project:

`supabase/migrations/20261108_10_tutor_affiliate_marketplace.sql`

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

From a Supabase CLI workspace already linked to the production project:

```sh
supabase secrets set RESEND_API_KEY=<verified-resend-api-key> EMAIL_FROM=<verified-sender-address> APP_ORIGIN=https://wasscetutor.com
supabase functions deploy send-notification-email
```

Supabase supplies `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` to deployed Edge Functions. Do not put the service-role key in browser code or Vercel public environment variables.

The sender domain/address must already be verified in Resend. The function verifies the caller's JWT and only sends persisted notification events created by that caller for the requested entity.

## 3. Production release order

1. Confirm the Vercel preview build is green.
2. Apply the database migration.
3. Set the three email secrets and deploy the Edge Function.
4. Merge the approved PR to `main), allowing Vercel to deploy production.
5. Test with dedicated accounts: student, tutor applicant, approved tutor, affiliate and admin.
6. Verify booking conflict rejection, status transitions, realtime inbox updates, email delivery, first-payment commission idempotency and payout reservation/release.

Tutor session rates are listing/booking amounts. This release does not collect tutor-session payments or alter the existing Monime subscription checkout.
