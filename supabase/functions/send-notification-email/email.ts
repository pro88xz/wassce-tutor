// What each notification email says, and the branded shell it is sent in.
// The shell matches the engine's emails (api/_lib/email/layout.js): keep the
// colours, logo band and footer in step with that file. No Deno or Node APIs
// here, so scripts/email/notification.test.mjs can run it.

export type NotificationEvent = { event_type: string; title: string; body: string }
export type Recipient = { firstName?: string; isTutor?: boolean }
export type Copy = { subject: string; preheader: string; headline: string; paragraphs: string[]; cta: { label: string; path: string } }

const BRAND = '#6438d8'
const BAND = '#4720b5'
const INK = '#171c2b'
const MUTED = '#4f5b70'
const LINE = '#e5e9f2'
const CANVAS = '#f2f3f8'
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const SUPPORT = 'WhatsApp +232 77 884195' // KEEP IN SYNC with src/lib/contact.ts

const escape = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

const TUTOR = { label: 'Open your tutor dashboard', path: '/tutor-dashboard' }
const AFFILIATE = { label: 'Open your affiliate dashboard', path: '/affiliate-dashboard' }

/** Wording for events whose stored text says too little on its own. `body` is the stored notification text. */
const COPY: Record<string, (body: string, to: Recipient) => Omit<Copy, 'preheader'> & { preheader?: string }> = {
  tutor_application_submitted: (body) => ({
    subject: 'New tutor application to review',
    headline: 'A new tutor application is waiting',
    paragraphs: [body.replace(/\s*Review it in Admin, Tutors\.$/, ''), 'Check their qualifications and subjects, then approve or decline. The applicant is emailed your decision.'],
    cta: { label: 'Review the application', path: '/admin/tutors' },
  }),
  // A tutor joined while automatic approval is on (migration 25): their card is already live.
  tutor_joined: (body) => ({
    subject: 'A new tutor is in the marketplace',
    headline: 'A new tutor just joined',
    paragraphs: [body.replace(/\s*Check their card in Admin, Tutors, and remove it if anything is wrong\.$/, ''), 'Their card went live as soon as they applied. Check their photo, qualifications and fees, and remove the card if anything is wrong. The tutor is told why.'],
    cta: { label: 'Check the new tutor', path: '/admin/tutors' },
  }),
  tutor_approved: () => ({
    subject: 'Your tutor card is live on WASSCE Tutor',
    headline: 'You are in the tutor marketplace',
    paragraphs: [
      'Your tutor card is now in the marketplace, so students can find you and message you on WhatsApp about lessons.',
      'On your tutor dashboard you can edit your card, add a discount for several subjects, take small groups, and show how students can pay you.',
    ],
    cta: TUTOR,
  }),
  tutor_rejected: (body) => ({
    subject: 'An update on your tutor application',
    headline: 'Your tutor application was not approved',
    paragraphs: [body, `If something here can be put right, or you have questions, reply to us on ${SUPPORT}.`],
    cta: { label: 'Contact support', path: '/contact' },
  }),
  tutor_suspended: (body) => ({
    subject: 'Your tutor card was removed from the marketplace',
    headline: 'Your tutor card was removed',
    paragraphs: [body],
    cta: { label: 'Contact support', path: '/contact' },
  }),
  tutor_reactivated: () => ({
    subject: 'Your tutor card is back in the marketplace',
    headline: 'Your tutor card is back',
    paragraphs: ['We put your tutor card back in the marketplace. Students can find you and contact you again.'],
    cta: TUTOR,
  }),
  tutor_contacted: (body) => ({
    subject: 'A student wants lessons with you',
    headline: 'A student wants lessons',
    paragraphs: [body, 'Look out for their WhatsApp message. The request is also on your tutor dashboard.'],
    cta: TUTOR,
  }),
  booking_requested: () => ({
    subject: 'A student asked you for a tutoring session',
    headline: 'New tutoring request',
    paragraphs: ['A student asked you for a tutoring session. Open your tutor dashboard to see the subject and time, then accept or decline.'],
    cta: { label: 'See the request', path: '/tutor-dashboard' },
  }),
  booking_request_sent: () => ({
    subject: 'Your tutoring request was sent',
    headline: 'Your request is with the tutor',
    paragraphs: ['We sent your tutoring request to the tutor. We will email you as soon as they accept or decline.'],
    cta: { label: 'See your requests', path: '/' },
  }),
  affiliate_application_submitted: (body) => ({
    subject: 'New affiliate application to review',
    headline: 'A new affiliate application is waiting',
    paragraphs: [body.replace(/\s*Review it in Admin, Affiliates\.$/, '')],
    cta: { label: 'Review the application', path: '/admin/affiliates' },
  }),
  affiliate_approved: () => ({
    subject: 'Your WASSCE Tutor affiliate account is approved',
    headline: 'You are now a WASSCE Tutor affiliate',
    paragraphs: ['Your affiliate account is approved. Your referral link is on your affiliate dashboard: share it, and you earn a commission the first time someone you referred pays for a plan.'],
    cta: { label: 'Get your referral link', path: '/affiliate-dashboard' },
  }),
  affiliate_suspended: () => ({
    subject: 'Your WASSCE Tutor affiliate account is suspended',
    headline: 'Your affiliate account is suspended',
    paragraphs: [`Your referral link has stopped earning commissions for now. If you think this is a mistake, contact us on ${SUPPORT}.`],
    cta: AFFILIATE,
  }),
  commission_approved: () => ({
    subject: 'A referral commission was approved',
    headline: 'You earned a commission',
    paragraphs: ['Someone you referred paid for a plan, and your commission for it was approved. It is now in your balance, ready to be paid out.'],
    cta: { label: 'See your balance', path: '/affiliate-dashboard' },
  }),
  commission_reversed: () => ({
    subject: 'A referral commission was reversed',
    headline: 'A commission was reversed',
    paragraphs: [`One of your referral commissions was reversed, usually because the payment behind it was refunded or cancelled. Your dashboard shows the updated balance. Questions? ${SUPPORT}.`],
    cta: AFFILIATE,
  }),
  payout_processing: () => ({
    subject: 'Your affiliate payout is being processed',
    headline: 'Your payout is on its way',
    paragraphs: ['We are processing your payout request. We will email you again when the money has been sent.'],
    cta: AFFILIATE,
  }),
  payout_paid: () => ({
    subject: 'Your affiliate payout was sent',
    headline: 'Your payout was paid',
    paragraphs: [`We sent your affiliate payout. If it has not arrived within a day, contact us on ${SUPPORT}.`],
    cta: AFFILIATE,
  }),
  payout_rejected: () => ({
    subject: 'Your affiliate payout request was not approved',
    headline: 'Your payout request was not approved',
    paragraphs: [`The amount is back in your balance, so you can request it again. To find out why, contact us on ${SUPPORT}.`],
    cta: AFFILIATE,
  }),
}

const BOOKING: Record<string, { headline: string; text: string }> = {
  accepted: { headline: 'Your tutoring session was accepted', text: 'The tutor accepted the session.' },
  confirmed: { headline: 'Your tutoring session is confirmed', text: 'The session is confirmed for the agreed time.' },
  declined: { headline: 'Your tutoring request was declined', text: 'The tutor could not take this session. You can ask another tutor in the marketplace.' },
  cancelled: { headline: 'A tutoring session was cancelled', text: 'This session will not take place.' },
  completed: { headline: 'Your tutoring session is complete', text: 'The session was marked as completed.' },
  no_show: { headline: 'A tutoring session was marked as missed', text: 'The session was marked as a no-show. If that is wrong, contact us.' },
}

/** The email for one stored notification. Unknown events fall back to the stored title and text. */
export function notificationCopy(event: NotificationEvent, to: Recipient = {}): Copy {
  const body = String(event.body ?? '').trim()
  const title = String(event.title ?? '').trim() || 'An update from WASSCE Tutor'
  const booking = event.event_type.startsWith('booking_') ? BOOKING[event.event_type.slice('booking_'.length)] : undefined
  const made = COPY[event.event_type]?.(body, to) ??
    (booking
      ? { subject: booking.headline, headline: booking.headline, paragraphs: [booking.text], cta: to.isTutor ? TUTOR : { label: 'See your sessions', path: '/' } }
      : { subject: title, headline: title, paragraphs: [body], cta: { label: 'Open WASSCE Tutor', path: '/' } })
  const paragraphs = made.paragraphs.map((t) => t.trim()).filter(Boolean)
  const firstName = String(to.firstName ?? '').trim()
  return {
    ...made,
    preheader: made.preheader ?? paragraphs[0] ?? made.headline,
    paragraphs: firstName ? [`Hi ${firstName},`, ...paragraphs] : paragraphs,
  }
}

/** The branded HTML email and its plain-text twin. `site` has no trailing slash. */
export function renderNotification(copy: Copy, site: string): { html: string; text: string } {
  const ctaUrl = `${site}${copy.cta.path}`
  const shown = ctaUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const reason = `You're receiving this because of activity on your WASSCE Tutor account.`
  const p = (t: string) => `<p style="margin:0 0 16px;font:400 16px/1.6 ${FONT};color:${INK}">${escape(t)}</p>`
  const link = (href: string, label: string) => `<a href="${escape(href)}" style="color:${MUTED};text-decoration:underline">${label}</a>`

  const html = `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${escape(copy.subject)}</title>
<style>
  @media (max-width: 620px) {
    .card { width: 100% !important; border-radius: 0 !important; }
    .pad { padding-left: 22px !important; padding-right: 22px !important; }
    .h1 { font-size: 24px !important; }
    .btn a { display: block !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${CANVAS};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${CANVAS}">${escape(copy.preheader)}${'&#8199;&#65279;&#847; '.repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CANVAS}">
  <tr><td align="center" style="padding:24px 12px">
    <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${LINE}">
      <tr><td class="pad" bgcolor="${BAND}" style="background:${BAND};padding:20px 32px">
        <a href="${escape(site)}" style="text-decoration:none"><img src="${escape(`${site}/brand/email-logo.png`)}" width="190" height="20" alt="WASSCE Tutor" style="display:block;border:0;outline:none;width:190px;height:20px;color:#ffffff;font:700 18px ${FONT}"></a>
      </td></tr>
      <tr><td class="pad" style="padding:32px 32px 8px">
        <h1 class="h1" style="margin:0 0 18px;font:800 26px/1.2 ${FONT};letter-spacing:-0.01em;color:${INK}">${escape(copy.headline)}</h1>
        ${copy.paragraphs.map(p).join('')}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="btn" style="margin:8px 0 0"><tr>
          <td bgcolor="${BRAND}" style="background:${BRAND};border-radius:12px;text-align:center">
            <a href="${escape(ctaUrl)}" style="display:inline-block;padding:15px 28px;font:700 16px/1.2 ${FONT};color:#ffffff;text-decoration:none;border-radius:12px">${escape(copy.cta.label)}</a>
          </td>
        </tr></table>
        <p style="margin:14px 0 24px;font:400 13px/1.5 ${FONT};color:${MUTED}">Button not working? Open <a href="${escape(ctaUrl)}" style="color:${BRAND};word-break:break-all">${escape(shown)}</a></p>
      </td></tr>
      <tr><td class="pad" style="padding:20px 32px 26px;border-top:1px solid ${LINE};background:#fafbff">
        <p style="margin:0 0 10px;font:400 12px/1.6 ${FONT};color:${MUTED}">${escape(reason)}</p>
        <p style="margin:0 0 10px;font:400 12px/1.6 ${FONT};color:${MUTED}">${link(`${site}/account`, 'Your account')} &nbsp;·&nbsp; ${link(`${site}/privacy`, 'Privacy')}</p>
        <p style="margin:0;font:400 12px/1.6 ${FONT};color:${MUTED}">WASSCE Tutor · Freetown, Sierra Leone · ${escape(SUPPORT)}<br>An independent study service. Not affiliated with WAEC.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`

  const text = [
    copy.headline,
    '',
    ...copy.paragraphs.flatMap((t) => [t, '']),
    `${copy.cta.label}: ${ctaUrl}`,
    '',
    '—',
    reason,
    `WASSCE Tutor · Freetown, Sierra Leone · ${SUPPORT}`,
    'An independent study service. Not affiliated with WAEC.',
  ].join('\n')

  return { html, text }
}
