// One run of the engine: read every account, decide who is due what, queue
// those emails with unique keys, then claim and send them. Safe to run twice
// at once: queueing ignores keys that already have a live job, and claiming
// uses SKIP LOCKED, so no email is sent twice.
import { canSend, CONTACT } from './config.js'
import { renderEmail } from './layout.js'
import { planForStudent, rankCandidates, snapshotFromRow } from './rules.js'
import { TEMPLATES } from './templates.js'
import { clickSignature, unsubscribeToken } from './tokens.js'

const PAGE = 1000
const SEND_GAP_MS = 550 // Resend's default limit is 2 requests a second
const TIME_BUDGET_MS = 45_000 // the function may run for 60 s

/** The links in one email: tracked through /api/email/c on our own site. */
export function linkContext(env, { jobId, userId, programme, links }) {
  const tracked = (key) =>
    jobId ? `${env.site}/api/email/c?j=${jobId}&l=${key}&s=${clickSignature(env.tokenSecret, jobId, key)}` : withUtm(env.site, links[key], programme)
  return {
    site: env.site,
    contact: CONTACT,
    url: tracked,
    displayUrl: (key) => `${env.site.replace(/^https:\/\//, '')}${links[key] ?? '/'}`,
    unsubscribeUrl: userId && env.tokenSecret ? `${env.site}/api/email/unsubscribe?t=${unsubscribeToken(env.tokenSecret, userId)}` : null,
    preferencesUrl: `${env.site}/account`,
  }
}

export function withUtm(site, path, programme) {
  const sep = path.includes('?') ? '&' : '?'
  return `${site}${path}${sep}utm_source=email&utm_medium=lifecycle&utm_campaign=${encodeURIComponent(programme)}`
}

/** Builds the Resend message for a claimed job. Throws if the template cannot render cleanly. */
export function composeMessage(env, job, stats) {
  const template = TEMPLATES[job.template_key]
  if (!template) throw new Error(`Unknown template ${job.template_key}`)
  const payload = job.payload ?? {}
  const content = template(payload, { stats })
  const ctx = linkContext(env, { jobId: job.job_id, userId: job.user_id, programme: job.programme, links: payload.links ?? {} })
  const { html, text } = renderEmail(content, ctx)
  const headers = {}
  if (content.category === 'marketing' && ctx.unsubscribeUrl) {
    headers['List-Unsubscribe'] = `<${ctx.unsubscribeUrl}>`
    headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click'
  }
  return {
    from: env.from,
    to: [job.email],
    subject: content.subject,
    html,
    text,
    headers,
    ...(env.replyTo ? { reply_to: env.replyTo } : {}),
    tags: [
      { name: 'programme', value: job.programme },
      { name: 'category', value: content.category },
    ],
  }
}

/**
 * Fills each weekly email with the student's real week (email_student_week()).
 * Students with no study to report are dropped, never sent made-up numbers.
 */
export async function addWeekData(client, chosen, summary) {
  const digests = chosen.filter((c) => c.programme === 'weekly_digest')
  if (!digests.length) return chosen
  const { data, error } = await client.rpc('email_student_week', { p_users: digests.map((c) => c.userId) })
  if (error) console.error(`[email] weekly data unavailable, weekly emails skipped: ${error.message}`)
  const byUser = new Map((error ? [] : (data ?? [])).map((w) => [w.user_id, w]))
  return chosen.filter((c) => {
    if (c.programme !== 'weekly_digest') return true
    const w = byUser.get(c.userId)
    if (!w || !w.focus_subject_id || (w.lessons_week ?? 0) + (w.practice_week ?? 0) === 0) {
      summary.skipped.no_week_activity = (summary.skipped.no_week_activity ?? 0) + 1
      return false
    }
    const next = w.next_lesson_id ? { title: w.next_lesson_title, topic: w.next_topic_name, free: Boolean(w.next_lesson_free) } : null
    const open = next && (next.free || c.payload.access)
    c.payload = {
      ...c.payload,
      week: {
        lessons: w.lessons_week ?? 0,
        practice: w.practice_week ?? 0,
        score: w.score_week ?? null,
        subjects: w.subjects_week ?? [],
        focusSubject: w.focus_subject_name,
        done: w.focus_done ?? 0,
        total: w.focus_total ?? 0,
        newLessons: w.new_lessons_week ?? 0,
        next,
      },
      links: { cta: open ? `/lesson/${w.next_lesson_id}` : `/subject/${w.focus_subject_id}` },
    }
    return true
  })
}

/**
 * @param deps { client: Supabase (secret key), env: loadEmailConfig(), now, send(message) → { ok, id, error, permanent }, sleep }
 */
export async function runEngine({ client, env, now = Date.now(), send, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
  const started = Date.now()
  const summary = { mode: env.mode, considered: 0, due: 0, queued: 0, sent: 0, failed: 0, skipped: {}, byProgramme: {} }
  if (env.mode === 'off') return { ...summary, stopped: 'mode is off' }
  if (env.mode !== 'dry-run' && !canSend(env)) return { ...summary, stopped: 'Resend or token secret not configured' }
  if (env.mode === 'pilot' && env.onlyTo.length === 0) return { ...summary, stopped: 'pilot mode needs pilot addresses' }

  const { data: settings, error: settingsError } = await client.from('email_settings').select('paused').eq('id', true).maybeSingle()
  if (settingsError) throw new Error(`email_settings: ${settingsError.message}`)
  if (settings?.paused) return { ...summary, stopped: 'paused by an admin' }

  // Today's allowance (UTC day).
  const dayStart = new Date(now)
  dayStart.setUTCHours(0, 0, 0, 0)
  const { count: sentToday, error: countError } = await client
    .from('email_send_jobs')
    .select('id', { count: 'exact', head: true })
    .in('status', ['sent', 'sending', 'unknown'])
    .gte('claimed_at', dayStart.toISOString())
  if (countError) throw new Error(`count: ${countError.message}`)
  const allowance = Math.max(0, env.dailyLimit - (sentToday ?? 0))
  summary.allowance = allowance

  // 1 · Decide.
  const due = []
  let after = null
  for (;;) {
    const { data: rows, error } = await client.rpc('email_audience', { p_after: after, p_limit: PAGE })
    if (error) throw new Error(`email_audience: ${error.message}`)
    for (const row of rows ?? []) {
      if (env.mode === 'pilot' && !env.onlyTo.includes(String(row.email ?? '').toLowerCase())) continue
      summary.considered++
      const decision = planForStudent(snapshotFromRow(row), now)
      if (decision.email) due.push({ ...decision.email, userId: row.user_id })
      else summary.skipped[decision.skip] = (summary.skipped[decision.skip] ?? 0) + 1
    }
    if (!rows || rows.length < PAGE) break
    after = rows[rows.length - 1].user_id
  }
  summary.due = due.length
  const chosen = await addWeekData(client, rankCandidates(due).slice(0, allowance), summary)
  for (const c of chosen) summary.byProgramme[c.programme] = (summary.byProgramme[c.programme] ?? 0) + 1
  if (env.mode === 'dry-run') return { ...summary, wouldSend: chosen.length }
  if (chosen.length === 0) return summary

  // 2 · Queue (a key that already has a live job is ignored by the database).
  const jobs = chosen.map((c) => ({
    user_id: c.userId,
    programme: c.programme,
    step: c.step,
    category: c.category,
    template_key: c.templateKey,
    idempotency_key: c.idempotencyKey,
    anchor: c.anchor,
    payload: c.payload,
    priority: c.priority,
  }))
  const { data: queued, error: queueError } = await client.rpc('queue_email_jobs', { p_jobs: jobs })
  if (queueError) throw new Error(`queue_email_jobs: ${queueError.message}`)
  summary.queued = queued ?? 0

  // 3 · Send, a few at a time, within the time budget.
  const { data: stats } = await client.rpc('email_content_stats').maybeSingle()
  let remaining = allowance
  while (remaining > 0 && Date.now() - started < TIME_BUDGET_MS) {
    const { data: claimed, error: claimError } = await client.rpc('claim_email_jobs', { p_limit: Math.min(5, remaining) })
    if (claimError) throw new Error(`claim_email_jobs: ${claimError.message}`)
    if (!claimed?.length) break
    for (const job of claimed) {
      remaining--
      if (Date.now() - started >= TIME_BUDGET_MS) {
        // Out of time: hand it back untouched for the next run.
        await client.from('email_send_jobs').update({ status: 'queued', attempts: Math.max(0, job.attempts - 1), claimed_at: null }).eq('id', job.job_id).eq('status', 'sending')
        continue
      }
      let result
      try {
        const message = composeMessage(env, job, stats)
        result = await send({ ...message, idempotencyKey: `wassce-email-${job.idempotency_key}` })
      } catch (e) {
        result = { ok: false, error: `render: ${String(e?.message ?? e).slice(0, 200)}`, permanent: true }
      }
      const at = new Date().toISOString()
      if (result.ok) {
        summary.sent++
        await client.from('email_send_jobs').update({ status: 'sent', sent_at: at, provider_message_id: result.id, last_error: null, updated_at: at }).eq('id', job.job_id)
      } else {
        summary.failed++
        await client.from('email_send_jobs').update({ status: 'failed', last_error: result.error ?? 'failed', updated_at: at }).eq('id', job.job_id)
        if (result.permanent && result.status === 422) {
          await client
            .from('email_suppressions')
            .upsert({ email_normalized: String(job.email).trim().toLowerCase(), reason: 'invalid', source: 'resend_422', detail: result.error }, { onConflict: 'email_normalized', ignoreDuplicates: true })
        }
      }
      await sleep(SEND_GAP_MS)
    }
  }
  return summary
}
