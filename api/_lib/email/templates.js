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

/** What a plan adds. Lessons and practice are free for everyone (migration 22). */
const unlocked = () => PAID_FEATURES

/** What every account has for free, with real counts where the database gave them. */
function free(stats) {
  const ok = stats && stats.lessons > 0 && stats.subjects > 0
  return [
    ok ? `All ${n(stats.lessons)} lessons across ${n(stats.subjects)} subjects` : FREE_SUMMARY[0],
    stats?.questions > 0 ? `Every practice set (${n(stats.questions)} questions), with the full working` : FREE_SUMMARY[1],
    FREE_SUMMARY[2],
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
      preheader: `Finish paying NLe ${pl.priceNle} to add the AI study tutor and mock exams.`,
      headline: 'Finish getting full access',
      paragraphs: [
        hello(p),
        `On ${day(p.startedAt)} you started getting ${pl.name} access, but the payment wasn't completed, so your account is still on the free plan.`,
      ],
      lists: [{ title: `What ${pl.name} access adds`, items: unlocked() }],
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
        { title: 'Free for everyone', items: free(ctx.stats) },
        { title: `Added with ${pl.name} (NLe ${pl.priceNle} for ${pl.length})`, items: unlocked() },
      ],
      after: ["If the free account is enough for now, that's fine: every lesson and practice set stays open."],
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
          'Open a topic you find hard and read its first lesson (every lesson is free)',
          "Try the topic's practice set and read the working for anything you miss",
        ],
      },
    ],
    after: ["You don't need to cover everything in one sitting. One useful step is enough."],
    cta: { label: 'Choose a subject', link: 'cta' },
  }),

  activation_2: (p, ctx) => ({
    category: 'marketing',
    subject: 'Start with one free lesson today',
    preheader: 'Every lesson and practice set is free.',
    headline: 'One lesson is a good start',
    paragraphs: [
      hello(p),
      ctx.stats?.subjects > 0
        ? `Your account is ready, and every lesson is free, across ${n(ctx.stats.subjects)} subjects.`
        : 'Your account is ready, and every lesson is free.',
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
      preheader: 'Every lesson and practice set is free.',
      headline: 'Start with one topic',
      paragraphs: [
        hello(p),
        "You haven't started a study session on WASSCE Tutor yet. Every lesson and practice set is free, so you can try one today.",
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
    // Every lesson is free (migration 22); a lesson marked otherwise still
    // gets no button straight to it, as before.
    const locked = w.next && !w.next.free && !p.access
    const progress = [
      w.total ? `${n(w.done)} of ${n(w.total)} lessons done (${Math.round((100 * w.done) / w.total)}%)` : null,
      w.newLessons > 0 ? `${plural(w.newLessons, 'new lesson')} added this week` : null,
      w.next ? `Next up: ${w.next.title} (${w.next.topic})` : null,
    ].filter(Boolean)
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
      preheader: `The AI study tutor and mock exams are yours until ${day(p.until)}.`,
      headline: `You have full access until ${day(p.until)}`,
      paragraphs: [hello(p), `Thank you for your payment of NLe ${n(p.amount)}. Your ${pl.name} access is active until ${day(p.until)}.`],
      lists: [
        { title: 'Now added to your account', items: unlocked() },
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
        `Your ${pl.name} access to WASSCE Tutor ends on ${day(p.until)}. After that every lesson and practice set stays free, and your progress stays saved.`,
        'To keep the study tutor and the mock exams, renew before then.',
      ],
      after: ['Plans are paid once and never renew automatically, so nothing is charged unless you choose to renew.'],
      cta: { label: 'Renew access', link: 'cta' },
    }
  },
}

/** Sample data for previews and test sends: one example per template. */
// What engine.js addStudyExtras adds to a study email, for the previews.
const SAMPLE_EXTRAS = {
  question: {
    stem: 'Choose the word that has the same vowel sound as the one represented by the letters in bold.\n\nf**oo**d',
    subject: 'English Language',
    topic: 'Vowels and Diphthongs',
    options: [
      { label: 'A', text: 'shoe' },
      { label: 'B', text: 'good' },
      { label: 'C', text: 'blood' },
      { label: 'D', text: 'boat' },
    ],
  },
  tutor: { name: 'Nicholas Norman', location: 'Freetown', subject: 'English Language', avg: 38, sets: 3, price: 700, perWeek: 3 },
  next: { title: 'Consonants: the 24 sounds', topic: 'Consonants and Consonant Clusters', subject: 'English Language' },
}

export const SAMPLES = {
  pending_payment_1: { firstName: 'Fatmata', plan: 'term', amount: 25, startedAt: '2026-11-14T09:30:00Z', ...SAMPLE_EXTRAS },
  pending_payment_2: { firstName: 'Fatmata', plan: 'term', amount: 25, startedAt: '2026-11-11T09:30:00Z', question: SAMPLE_EXTRAS.question, next: SAMPLE_EXTRAS.next },
  activation_1: { firstName: 'Mohamed', question: SAMPLE_EXTRAS.question, next: SAMPLE_EXTRAS.next },
  activation_2: { firstName: null },
  reengage_1: { firstName: 'Aminata', studied: true, subject: { id: 'x', name: 'English Language' }, access: null, ...SAMPLE_EXTRAS },
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
    question: SAMPLE_EXTRAS.question,
    tutor: SAMPLE_EXTRAS.tutor,
  },
  access_started: { firstName: 'Isata', plan: 'term', amount: 25, until: '2026-12-15T10:00:00Z' },
  access_ending: { firstName: 'Isata', plan: 'term', until: '2026-12-15T10:00:00Z' },
}

// ── Study extras (engine.js addStudyExtras, migration 34) ────────────────────
// Added to the study emails from the student's own records: a question from
// their subject to answer straight from the email, a tutor who teaches the
// subject they score lowest in, and, where the button does not already lead
// there, the next lesson to continue with. Each part appears only with real data.

const CONTINUE_LINE = new Set(['pending_payment', 'activation'])

export function withStudyExtras(content, p, programme) {
  const out = { ...content }
  if (p.question?.stem && p.question.options?.length === 4) {
    out.question = {
      eyebrow: `Your question for today${p.question.subject ? ` · ${p.question.subject}` : ''}`,
      topic: p.question.topic || null,
      stem: p.question.stem,
      options: p.question.options.map((o) => ({ label: o.label, text: o.text, link: `q_${o.label}` })),
      footnote: 'Tap your answer. The site marks it at once and shows the full working.',
    }
  }
  if (p.tutor?.name && p.tutor.subject && Number.isFinite(p.tutor.avg)) {
    const t = p.tutor
    const first = String(t.name).trim().split(/\s+/)[0]
    const terms = [t.perWeek ? plural(t.perWeek, 'lesson') + ' a week' : null, t.price ? `NLe ${n(t.price)} a month` : null].filter(Boolean)
    out.tutor = {
      eyebrow: 'Help from a real teacher',
      title: `Book ${t.name} for ${t.subject}`,
      lines: [
        `Your ${t.subject} practice average is ${t.avg}% over ${plural(t.sets ?? 2, 'set')}. A few lessons with a teacher can turn that around before the exam.`,
        `${first} teaches WASSCE ${t.subject}${t.location ? ` in ${t.location}` : ''}${terms.length ? `: ${terms.join(', ')}` : ''}. You agree the days, times and place with ${first}.`,
      ],
      cta: { label: `Book ${first}`, link: 'tutor' },
    }
  }
  if (CONTINUE_LINE.has(programme) && p.next?.title) {
    out.continueLine = {
      label: `${p.next.subject ? `${p.next.subject}: ` : ''}${p.next.title}`,
      hint: programme === 'activation' ? 'A good first lesson' : 'Or carry on for free where you stopped',
      link: 'next',
    }
  }
  return out
}
