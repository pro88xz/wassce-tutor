// The rules: who gets which email, and when. Pure functions of one student's
// snapshot (from the email_audience() database function), so every decision
// can be tested without a database or an email account.
//
// Programmes, highest priority first. A student gets at most one email a day.
//   access_started   service    paid in the last 3 days: what is now unlocked and how to use it
//   access_ending    service    access ends within 3 days: when, and what stays free
//   pending_payment  marketing  started a checkout but did not pay: the plan's benefits, finish paying
//   activation       marketing  new account, never studied: make a first start
//   weekly_digest    marketing  studied this week: their real week, progress and next lesson (Sun–Tue)
//   reengage         marketing  no study or sign-in for 7 days: come back to one topic
//
// Marketing emails also need consent and respect the weekly cap. Every
// sequence stops by itself: studying, paying or time passing ends it.

const HOUR = 3_600_000
const DAY = 24 * HOUR

export const RULES = {
  /** At most one engine email per student per day, of any kind. */
  anyGapHours: 20,
  /** Marketing emails in any 7 days, and the shortest gap between two of them. */
  marketingPerWeek: 2,
  marketingGapHours: 48,
  /** Failed sends with the same key before the engine stops trying. */
  maxFailures: 3,
  accessStarted: { withinDays: 3 },
  accessEnding: { withinDays: 3 },
  pendingPayment: { firstAfterHours: 2, secondAfterDays: 3, maxAgeDays: 30, cooldownDays: 3, perFortnight: 2 },
  activation: { firstAfterHours: 24, secondAfterDays: 4, maxAccountAgeDays: 14 },
  reengage: { afterDays: 7, secondAfterDays: 7, maxInactiveDays: 365, newAccountDays: 14, perMonth: 2 },
  /** Sunday (0) to Tuesday (2), UTC = Freetown time: Sunday normally, later only if the daily limit was reached. */
  weeklyDigest: { weekdays: [0, 1, 2], activeWithinDays: 7 },
}

export const PROGRAMMES = {
  access_started: { category: 'service', priority: 1 },
  access_ending: { category: 'service', priority: 2 },
  pending_payment: { category: 'marketing', priority: 3 },
  activation: { category: 'marketing', priority: 4 },
  weekly_digest: { category: 'marketing', priority: 5 },
  reengage: { category: 'marketing', priority: 6 },
}

/** Statuses that mean an email went out, is going out, or may have. */
const LIVE = new Set(['queued', 'sending', 'sent', 'unknown'])
const STUDY_ACCOUNTS = new Set(['student', '', null, undefined])

const ms = (v) => (v ? new Date(v).getTime() : null)

/** "fatu" → "Fatu"; anything that does not look like a first name → null (a neutral greeting). */
export function firstName(fullName) {
  const first = String(fullName ?? '').trim().split(/\s+/)[0] ?? ''
  if (!/^\p{L}[\p{L}'-]{1,29}$/u.test(first)) return null
  return first[0].toLocaleUpperCase('en') + first.slice(1)
}

/** Turns a database row (snake_case) into the snapshot the rules read. */
export function snapshotFromRow(r) {
  return {
    userId: r.user_id,
    email: r.email,
    emailConfirmed: Boolean(r.email_confirmed),
    firstName: firstName(r.full_name),
    intent: r.account_intent ?? null,
    createdAt: ms(r.created_at),
    lastSignInAt: ms(r.last_sign_in_at),
    lastStudyAt: ms(r.last_study_at),
    studied: (r.lessons_completed ?? 0) + (r.practice_attempts ?? 0) > 0,
    lastSubject: r.last_subject_id ? { id: r.last_subject_id, name: r.last_subject_name } : null,
    access: { active: Boolean(r.access_active), until: ms(r.access_until), plan: r.access_plan ?? null },
    openPayment: r.open_payment_id
      ? { id: r.open_payment_id, plan: r.open_payment_plan, amount: r.open_payment_amount, createdAt: ms(r.open_payment_created_at) }
      : null,
    paid: r.paid_payment_id ? { id: r.paid_payment_id, plan: r.paid_plan, amount: r.paid_amount, at: ms(r.paid_at) } : null,
    subscribed: r.marketing_status === 'subscribed',
    suppressed: Boolean(r.suppressed),
    history: (Array.isArray(r.history) ? r.history : []).map((h) => ({ ...h, at: ms(h.at) })),
  }
}

const iso = (t) => new Date(t).toISOString()

/** The Sunday (UTC) that starts the week containing `now`, as YYYY-MM-DD: one weekly email per student per week. */
export function weekOf(now) {
  const d = new Date(now)
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() - d.getUTCDay())
  return d.toISOString().slice(0, 10)
}

const SINGLE_TEMPLATE = new Set(['access_started', 'access_ending', 'weekly_digest'])

/**
 * Decides the one email this student should get now, if any.
 * Returns { email } or { skip: reason }.
 */
export function planForStudent(s, now) {
  if (!s.email) return { skip: 'no_email' }
  if (!s.emailConfirmed) return { skip: 'unconfirmed' }
  if (s.suppressed) return { skip: 'suppressed' }

  const live = s.history.filter((h) => LIVE.has(h.status))
  const latest = Math.max(0, ...live.map((h) => h.at ?? 0))
  if (latest && now - latest < RULES.anyGapHours * HOUR) return { skip: 'emailed_recently' }

  const sent = (programme, step, anchor) =>
    live.find((h) => h.programme === programme && h.step === step && (anchor === undefined || h.anchor === anchor))
  const failures = (programme, step, anchor) =>
    s.history.filter((h) => h.status === 'failed' && h.programme === programme && h.step === step && h.anchor === anchor).length
  const marketingSince = (t) => live.filter((h) => h.category === 'marketing' && (h.at ?? 0) >= t)
  const programmeSince = (programme, t) => live.filter((h) => h.programme === programme && (h.at ?? 0) >= t)

  const marketingAllowed = () => {
    if (!s.subscribed) return 'not_subscribed'
    if (marketingSince(now - 7 * DAY).length >= RULES.marketingPerWeek) return 'weekly_cap'
    if (marketingSince(now - RULES.marketingGapHours * HOUR).length > 0) return 'marketing_gap'
    return null
  }

  const make = (programme, step, anchor, payload, sortAt) => {
    if (failures(programme, step, anchor) >= RULES.maxFailures) return null
    const { category, priority } = PROGRAMMES[programme]
    return {
      programme,
      step,
      anchor,
      category,
      priority,
      templateKey: SINGLE_TEMPLATE.has(programme) ? programme : `${programme}_${step}`,
      // The student is part of the key: the database allows one live job per key, across everyone.
      idempotencyKey: `${programme}:${step}:${s.userId}:${anchor}`,
      payload: { firstName: s.firstName, ...payload },
      sortAt,
    }
  }

  const studyAccount = STUDY_ACCOUNTS.has(s.intent)
  let blocked = null
  const candidates = []

  // ── access_started ───────────────────────────────────────────────────────
  if (s.paid && s.access.active && now - s.paid.at <= RULES.accessStarted.withinDays * DAY && !sent('access_started', 1, s.paid.id)) {
    candidates.push(
      make('access_started', 1, s.paid.id, { plan: s.paid.plan, amount: s.paid.amount, until: iso(s.access.until), links: { cta: '/subjects' } }, s.paid.at),
    )
  }

  // ── access_ending ────────────────────────────────────────────────────────
  if (s.access.active && s.access.until && !s.openPayment) {
    const left = s.access.until - now
    const anchor = iso(s.access.until).slice(0, 10)
    if (left > 0 && left <= RULES.accessEnding.withinDays * DAY && !sent('access_ending', 1, anchor)) {
      candidates.push(
        make('access_ending', 1, anchor, { plan: s.access.plan, until: iso(s.access.until), links: { cta: '/subscribe' } }, s.access.until),
      )
    }
  }

  // ── pending_payment ──────────────────────────────────────────────────────
  const op = s.openPayment
  if (op && !s.access.active) {
    const r = RULES.pendingPayment
    const age = now - op.createdAt
    const recent = programmeSince('pending_payment', now - 14 * DAY)
    const last = Math.max(0, ...recent.map((h) => h.at ?? 0))
    const first = sent('pending_payment', 1, op.id)
    const payload = { plan: op.plan, amount: op.amount, startedAt: iso(op.createdAt), links: { cta: `/subscribe?plan=${op.plan}` } }
    if (age <= r.maxAgeDays * DAY && recent.length < r.perFortnight) {
      if (!first && age >= r.firstAfterHours * HOUR && (!last || now - last >= r.cooldownDays * DAY)) {
        const why = marketingAllowed()
        if (why) blocked ??= why
        else candidates.push(make('pending_payment', 1, op.id, payload, op.createdAt))
      } else if (first && !sent('pending_payment', 2, op.id) && now - first.at >= r.secondAfterDays * DAY) {
        const why = marketingAllowed()
        if (why) blocked ??= why
        else candidates.push(make('pending_payment', 2, op.id, payload, op.createdAt))
      }
    }
  }

  // ── activation: new account, never studied ───────────────────────────────
  if (studyAccount && !s.studied) {
    const r = RULES.activation
    const age = now - s.createdAt
    const first = sent('activation', 1, 'account')
    if (age <= r.maxAccountAgeDays * DAY) {
      const step = !first && age >= r.firstAfterHours * HOUR ? 1 : first && !sent('activation', 2, 'account') && now - first.at >= r.secondAfterDays * DAY ? 2 : 0
      if (step) {
        const why = marketingAllowed()
        if (why) blocked ??= why
        else candidates.push(make('activation', step, 'account', { links: { cta: '/subjects' } }, s.createdAt))
      }
    }
  }

  // ── weekly_digest: studied this week ─────────────────────────────────────
  // The engine adds the week's real numbers from email_student_week(); a
  // student with nothing to report is dropped there.
  if (studyAccount && s.lastStudyAt && now - s.lastStudyAt <= RULES.weeklyDigest.activeWithinDays * DAY) {
    const anchor = weekOf(now)
    if (RULES.weeklyDigest.weekdays.includes(new Date(now).getUTCDay()) && !sent('weekly_digest', 1, anchor)) {
      const why = marketingAllowed()
      if (why) blocked ??= why
      else
        candidates.push(
          make(
            'weekly_digest',
            1,
            anchor,
            {
              access: s.access.active ? { plan: s.access.plan, until: iso(s.access.until) } : null,
              links: { cta: s.lastSubject ? `/subject/${s.lastSubject.id}` : '/subjects' },
            },
            s.lastStudyAt,
          ),
        )
    }
  }

  // ── reengage: no study and no sign-in for a week ─────────────────────────
  if (studyAccount) {
    const r = RULES.reengage
    const lastActive = Math.max(s.lastStudyAt ?? 0, s.lastSignInAt ?? 0) || s.createdAt
    const inactive = now - lastActive
    const oldEnough = s.studied || now - s.createdAt >= r.newAccountDays * DAY
    // One sequence per absence: a sign-in or a study session starts a new one.
    const anchor = iso(lastActive).slice(0, 10)
    if (oldEnough && inactive >= r.afterDays * DAY && inactive <= r.maxInactiveDays * DAY && programmeSince('reengage', now - 30 * DAY).length < r.perMonth) {
      const first = sent('reengage', 1, anchor)
      const step = !first ? 1 : !sent('reengage', 2, anchor) && now - first.at >= r.secondAfterDays * DAY ? 2 : 0
      if (step) {
        const why = marketingAllowed()
        if (why) blocked ??= why
        else
          candidates.push(
            make(
              'reengage',
              step,
              anchor,
              {
                studied: s.studied,
                subject: s.lastSubject,
                access: s.access.active ? { plan: s.access.plan, until: iso(s.access.until) } : null,
                links: { cta: s.lastSubject ? `/subject/${s.lastSubject.id}` : '/subjects' },
              },
              lastActive,
            ),
          )
      }
    }
  }

  const best = candidates.filter(Boolean).sort((a, b) => a.priority - b.priority)[0]
  if (best) return { email: best }
  return { skip: blocked ?? 'nothing_due' }
}

/** Highest priority first; within a priority, the longest-waiting student first. */
export function rankCandidates(list) {
  return [...list].sort((a, b) => a.priority - b.priority || a.step - b.step || a.sortAt - b.sortAt)
}
