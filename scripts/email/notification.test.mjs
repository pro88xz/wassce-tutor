// The tutor and affiliate notification emails (the Supabase Edge Function's wording and shell).
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { notificationCopy, renderNotification } from '../../supabase/functions/send-notification-email/email.ts'

const SITE = 'https://wasscetutor.com'
const EVENTS = [
  'tutor_application_submitted', 'tutor_approved', 'tutor_rejected', 'tutor_suspended', 'tutor_reactivated', 'tutor_contacted',
  'booking_requested', 'booking_request_sent', 'booking_accepted', 'booking_confirmed', 'booking_declined', 'booking_cancelled',
  'booking_completed', 'booking_no_show', 'affiliate_application_submitted', 'affiliate_approved', 'affiliate_suspended',
  'commission_approved', 'commission_reversed', 'payout_processing', 'payout_paid', 'payout_rejected',
]

test('every event the app sends has finished, branded copy', () => {
  for (const event_type of EVENTS) {
    const copy = notificationCopy({ event_type, title: 'Stored title', body: 'Stored text.' }, { firstName: 'Aminata' })
    const { html, text } = renderNotification(copy, SITE)
    assert.notEqual(copy.subject, 'Stored title', `${event_type} still uses the stored title`)
    assert.equal(copy.paragraphs[0], 'Hi Aminata,')
    assert.ok(copy.cta.path.startsWith('/'))
    for (const out of [html, text, copy.subject, copy.preheader]) assert.doesNotMatch(out, /undefined|\bnull\b|\{\{|status (changed to|is now)/, event_type)
    assert.match(html, /brand\/email-logo\.png/)
    assert.ok(html.includes(`href="${SITE}${copy.cta.path}"`))
    assert.ok(text.includes(`${copy.cta.label}: ${SITE}${copy.cta.path}`))
  }
})

test('specific stored text is kept and escaped', () => {
  const copy = notificationCopy({ event_type: 'tutor_rejected', title: 'Tutor application update', body: 'Your certificate <scan> was unreadable.' })
  const { html, text } = renderNotification(copy, SITE)
  assert.ok(html.includes('Your certificate &lt;scan&gt; was unreadable.'))
  assert.ok(text.includes('Your certificate <scan> was unreadable.'))
  assert.equal(copy.paragraphs[0], 'Your certificate <scan> was unreadable.')
})

test('admin emails drop the "Review it in Admin" instruction in favour of the button', () => {
  const copy = notificationCopy({ event_type: 'tutor_application_submitted', title: 'New tutor application', body: 'New tutor application from Mohamed Kamara. Review it in Admin, Tutors.' })
  assert.equal(copy.paragraphs[0], 'New tutor application from Mohamed Kamara.')
  assert.equal(copy.cta.path, '/admin/tutors')
})

test('booking updates link tutors and students to their own pages', () => {
  const event = { event_type: 'booking_accepted', title: 'Booking accepted', body: 'x' }
  assert.equal(notificationCopy(event, { isTutor: true }).cta.path, '/tutor-dashboard')
  assert.equal(notificationCopy(event, {}).cta.path, '/')
})

test('an unknown event falls back to the stored title and text', () => {
  const copy = notificationCopy({ event_type: 'something_new', title: 'Hello', body: 'World.' })
  assert.deepEqual([copy.subject, copy.headline, copy.paragraphs], ['Hello', 'Hello', ['World.']])
})
