// What each engine email says. Every fact comes from the student's own
// records, the server's price list (api/_lib/plans.js) or live content counts
// (email_content_stats()); nothing is invented, and there is no false urgency.
// Each template returns content for layout.js, which builds the HTML and text.
import { FREE_SUMMARY, PAID_FEATURES, PLANS } from '../plans.js'
import { CONTACT } from './config.js'

const n = (v) => Number(v).toLocaleString('en-US')
const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Freetown' })
const day = (isoString) => dateFmt.format(new Date(isoString))
const hello = (p) => (p.firstName ? `Hello ${p.firstName},` : 'Hello,')
const plural = (count, word) => `${n(count)} ${word}${count === 1 ? '' : 's'}`

function plan(id) {
  const known = PLANS[id] ?? PLANS.term
  return { ...known, once: id === 'year' ? 'Paid once for the whole year.' : 'Pay once; there is no automatic renewal.' }
}

/** The paid benefits, with real counts where the database gave them. */
function unlocked(stats) {
  const ok = stats && stats.lessons > 0 && stats.subjects > 0
  return [
    ok ? `All ${n(stats.lessons)} lessons across ${n(stats.subjects)} subjects, not only the first lesson of each topic` : PAID_FEATURES[0],
    stats?.questions > 0 ? `Every practice set (${n(stats.questions)} questions), with the full working` : PAID_FEATURES[1],
    PAID_FEATURES[2],
    PAID_FEATURES[3],
  ]
}

const helpNote = `Trouble paying? Reply to this email or message us on WhatsApp (${CONTACT.phoneDisplay}) and we'll help.`

export const TEMPLATES = {
  // ── Pending payment: started a checkout, did not pay ─────────────────────
  pending_payment_1: (p, ctx) => {
    const pl = plan(p.plan)
    return {
      category: 'marketing',
      subject: `Your ${pl.name} access is one step away`,
      preheader: `Finish paying NLe ${pl.priceNle} to unlock every lesson and practice set.`,
      headline: 'Finish unlocking WASSCE Tutor',
      paragraphs: [
        hello(p),
        `On ${day(p.startedAt)} you started getting ${pl.name} access, but the payment wasn't completed, so your account is still on the free plan.`,
      ],
      lists: [{ title: `What ${pl.name} access unlocks`, items: unlocked(ctx.stats) }],
      after: [`${pl.name}: NLe ${pl.priceNle} for ${pl.length}. ${pl.once}`],
      cta: { label: 'Finish getting access', link: 'cta' },
      note: helpNote,
    }
  },

  pending_payment_2: (p, ctx) => {
    const pl = plan(p.plan)
    return {
      category: 'marketing',
      subject: 'Still want full access for your WASSCE revision?',
      preheader: `${pl.name} is NLe ${pl.priceNle} for ${pl.length}.`,
      headline: 'Your free account, and what full access adds',
      paragraphs: [hello(p), `A few days ago you started a ${pl.name} payment that wasn't completed. If you still want full access, it takes a minute to finish.`],
      lists: [
        { title: 'Free, and yours to keep', items: FREE_SUMMARY },
        { title: `Added with ${pl.name} (NLe ${pl.priceNle} for ${pl.length})`, items: unlocked(ctx.stats) },
      ],
      after: ["If the free plan is enough for now, that's fine: your free lessons stay open."],
      cta: { label: 'See plans and pay', link: 'cta' },
      note: helpNote,
    }
  },

  // ── Activation: new account, never studied ───────────────────────────────
  activation_1: (p) => ({
    category: 'marketing',
    subject: 'Your first study session is one step away',
    preheader: 'Pick a subject and make a start today.',
    headline: 'Make a start with one topic',
    paragraphs: [hello(p), "You've created your WASSCE Tutor account. The best way to get value from it is to begin with one manageable topic."],
    lists: [
      {
        title: 'A good first session',
        items: [
          "Choose a subject you're preparing for",
          'Open a topic you find hard and read its first lesson (it is free)',
          'Try a starter practice set and read the working for anything you miss',
        ],
      },
    ],
    after: ["You don't need to cover everything in one sitting. One useful step is enough."],
    cta: { label: 'Choose a subject', link: 'cta' },
  }),

  activation_2: (p, ctx) => ({
    category: 'marketing',
    subject: 'Start with one free lesson today',
    preheader: 'The first lesson of every topic is free.',
    headline: 'One lesson is a good start',
    paragraphs: [
      hello(p),
      ctx.stats?.subjects > 0
        ? `Your account is ready, and the first lesson of every topic is free, across ${n(ctx.stats.subjects)} subjects.`
        : 'Your account is ready, and the first lesson of every topic is free.',
      'WASSCE preparation is built through steady practice. Start small today and come back tomorrow.',
    ],
    cta: { label: 'Open a free lesson', link: 'cta' },
  }),

  // ── Re-engagement: a week without studying or signing in ─────────────────
  reengage_1: (p) => {
    const subject = p.subject?.name
    if (p.access) {
      const pl = plan(p.access.plan)
      return {
        category: 'marketing',
        subject: `Your ${pl.name} access is waiting for you`,
        preheader: `Every lesson and practice set is open until ${day(p.access.until)}.`,
        headline: subject ? `Pick up your ${subject} revision` : 'Your full access is waiting',
        paragraphs: [
          hello(p),
          `You have full access until ${day(p.access.until)}, and it's been a little while since your last study session. Every lesson and practice set is open for you.`,
          'A short session still counts: one topic, then a few practice questions.',
        ],
        cta: { label: subject ? `Continue ${subject}` : 'Open my subjects', link: 'cta' },
      }
    }
    if (p.studied && subject) {
      return {
        category: 'marketing',
        subject: `Ready to continue your ${subject} revision?`,
        preheader: "Pick up with one topic whenever you're ready.",
        headline: `Pick up your ${subject} revision`,
        paragraphs: [
          hello(p),
          "It's been a little while since your last study session on WASSCE Tutor. If preparation has been busy, restart with one small step.",
          `Your ${subject} progress is saved, so you can continue where you left off.`,
        ],
        after: ['No pressure. Make a plan that works for you.'],
        cta: { label: `Continue ${subject}`, link: 'cta' },
      }
    }
    return {
      category: 'marketing',
      subject: 'Your WASSCE preparation is waiting',
      preheader: 'The first lesson of every topic is free.',
      headline: 'Start with one topic',
      paragraphs: [
        hello(p),
        "You haven't started a study session on WASSCE Tutor yet. The first lesson of every topic is free, so you can try it today.",
        'Choose the subject you find hardest and read one lesson. That is a real start.',
      ],
      cta: { label: 'Choose a subject', link: 'cta' },
    }
  },

  reengage_2: (p) => {
    const subject = p.subject?.name
    return {
      category: 'marketing',
      subject: subject ? `${subject}: pick up where you left off` : 'One topic is enough to restart',
      preheader: 'A short study session still counts.',
      headline: 'One topic is enough to restart',
      paragraphs: [
        hello(p),
        subject
          ? `Open one ${subject} topic, read the lesson and try a few questions. Small sessions add up before the exam.`
          : 'Open one topic, read the lesson and try a few questions. Small sessions add up before the exam.',
      ],
      after: ["This is our last reminder for now. Your account stays open whenever you're ready."],
      cta: { label: 'Resume studying', link: 'cta' },
    }
  },

  // ── Weekly progress: only real numbers from this week ────────────────────
  weekly_digest: (p) => {
    const w = p.week
    const focus = w.focusSubject
    const did = [w.lessons ? plural(w.lessons, 'lesson') : null, w.practice ? plural(w.practice, 'practice set') : null].filter(Boolean)
    const thisWeek = [
      w.lessons ? `Lessons completed: ${n(w.lessons)}` : null,
      w.practice ? `Practice sets: ${n(w.practice)}${w.score != null ? ` (average score ${w.score}%)` : ''}` : null,
      w.subjects.length > 1 ? `Subjects: ${w.subjects.join(', ')}` : null,
    ].filter(Boolean)
    const locked = w.next && !w.next.free && !p.access
    const progress = [
      w.total ? `${n(w.done)} of ${n(w.total)} lessons done (${Math.round((100 * w.done) / w.total)}%)` : null,
      w.newLessons > 0 ? `${plural(w.newLessons, 'new lesson')} added this week` : null,
      w.next ? `Next up: ${w.next.title} (${w.next.topic})` : null,
    ].filter(Boolean)
    const monthly = plan('term')
    return {
      category: 'marketing',
      subject: `Your WASSCE week: ${did.join(' and ')}`,
      preheader: w.total ? `${focus}: ${n(w.done)} of ${n(w.total)} lessons done. Here's what's next.` : "Here's your week, and what's next.",
      headline: 'Your week on WASSCE Tutor',
      paragraphs: [hello(p), 'Here is what you did in the last 7 days.'],
      lists: [
        { title: 'This week', items: thisWeek },
        { title: focus, items: progress },
      ].filter((l) => l.items.length),
      after: [
        locked ? `"${w.next.title}" is part of full access (${monthly.name}: NLe ${monthly.priceNle} for ${monthly.length}).` : null,
        'Small, steady sessions add up before the exam.',
      ].filter(Boolean),
      cta: { label: w.next && !locked ? 'Start the next lesson' : `Continue ${focus}`, link: 'cta' },
    }
  },

  // ── Service: plan started / ending ───────────────────────────────────────
  access_started: (p, ctx) => {
    const pl = plan(p.plan)
    return {
      category: 'service',
      subject: `Your ${pl.name} access is active`,
      preheader: `Everything is unlocked until ${day(p.until)}.`,
      headline: `You have full access until ${day(p.until)}`,
      paragraphs: [hello(p), `Thank you for your payment of NLe ${n(p.amount)}. Your ${pl.name} access is active until ${day(p.until)}.`],
      lists: [
        { title: 'Now unlocked', items: unlocked(ctx.stats) },
        {
          title: 'Getting the most from it',
          items: [
            'Pick the subject you find hardest and finish one topic this week',
            'After each practice set, read the working for every question you missed',
            "Ask the study tutor when an explanation doesn't click",
          ],
        },
      ],
      cta: { label: 'Start studying', link: 'cta' },
      note: `If anything looks wrong, reply to this email or message us on WhatsApp (${CONTACT.phoneDisplay}).`,
    }
  },

  access_ending: (p) => {
    const pl = plan(p.plan)
    return {
      category: 'service',
      subject: `Your ${pl.name} access ends on ${day(p.until)}`,
      preheader: 'Your progress stays saved either way.',
      headline: `Your access ends on ${day(p.until)}`,
      paragraphs: [
        hello(p),
        `Your ${pl.name} access to WASSCE Tutor ends on ${day(p.until)}. After that you keep the free lessons and starter practice sets, and your progress stays saved.`,
        'To keep every lesson, practice set and the study tutor open, renew before then.',
      ],
      after: ['Plans are paid once and never renew automatically, so nothing is charged unless you choose to renew.'],
      cta: { label: 'Renew access', link: 'cta' },
    }
  },
}

/** Sample data for previews and test sends: one example per template. */
export const SAMPLES = {
  pending_payment_1: { firstName: 'Fatmata', plan: 'term', amount: 25, startedAt: '2026-11-14T09:30:00Z' },
  pending_payment_2: { firstName: 'Fatmata', plan: 'term', amount: 25, startedAt: '2026-11-11T09:30:00Z' },
  activation_1: { firstName: 'Mohamed' },
  activation_2: { firstName: null },
  reengage_1: { firstName: 'Aminata', studied: true, subject: { id: 'x', name: 'Biology' }, access: null },
  reengage_2: { firstName: 'Aminata', studied: true, subject: { id: 'x', name: 'Biology' }, access: null },
  weekly_digest: {
    firstName: 'Aminata',
    access: null,
    week: {
      lessons: 5,
      practice: 2,
      score: 68,
      subjects: ['Biology', 'Chemistry'],
      focusSubject: 'Biology',
      done: 12,
      total: 40,
      newLessons: 4,
      next: { title: 'Cell division', topic: 'Cells and their structure', free: false },
    },
  },
  access_started: { firstName: 'Isata', plan: 'term', amount: 25, until: '2026-12-15T10:00:00Z' },
  access_ending: { firstName: 'Isata', plan: 'term', until: '2026-12-15T10:00:00Z' },
}
