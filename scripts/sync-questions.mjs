// Load the question sets in src/content/question-sets/ into Supabase on every
// production deploy, so new or corrected questions go live without anyone
// pressing a button.
//
// Runs at the end of `npm run build`. It needs a Supabase secret key with
// write access, set in Vercel (Settings -> Environment Variables) as
// SUPABASE_SECRET_KEY, Production only. Without the key it does nothing, so
// local builds never touch the real database.
//
// Only rows that are new or changed are written. A set an admin has hidden
// stays hidden: is_published is never sent for existing papers (new papers
// get the column default, which is live).
//
// A failure is reported loudly in the build log but does not stop the
// deploy; Admin -> Load question sets still works as a manual fallback.

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'src/content/question-sets')
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

const PAPER_COLS = ['id', 'subject_id', 'title', 'paper_type', 'description', 'question_count', 'sort_order']
const QUESTION_COLS = ['id', 'paper_id', 'topic_id', 'stem', 'image_url', 'explanation', 'position']
const OPTION_COLS = ['id', 'question_id', 'label', 'content', 'is_correct', 'position']

function chunks(list, size) {
  const out = []
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size))
  return out
}

/** Rows (picked to `cols`) that are missing from the database or differ from it. */
async function changedRows(db, table, cols, rows) {
  const existing = new Map()
  for (const ids of chunks(rows.map((r) => r.id), 50)) {
    const { data, error } = await db.from(table).select(cols.join(',')).in('id', ids)
    if (error) throw new Error(`${table}: ${error.message}`)
    for (const r of data) existing.set(r.id, r)
  }
  const fresh = rows.filter((r) => !existing.has(r.id)).length
  const changed = rows.filter((r) => {
    const e = existing.get(r.id)
    return !e || cols.some((c) => (r[c] ?? null) !== (e[c] ?? null))
  })
  return { changed, fresh }
}

async function upsert(db, table, rows) {
  for (const part of chunks(rows, 200)) {
    const { error } = await db.from(table).upsert(part, { onConflict: 'id' })
    if (error) throw new Error(`${table}: ${error.message}`)
  }
}

/** What sort of key this is, without ever printing the key itself. */
function keyKind(k) {
  if (k.startsWith('sb_secret_')) return 'secret'
  if (k.startsWith('sb_publishable_')) return 'the publishable (public) key'
  const parts = k.split('.')
  if (parts.length === 3) {
    try {
      const role = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')).role
      if (role === 'service_role') return 'secret'
      return `a legacy "${role}" key (the public one)`
    } catch {
      // not a readable JWT; fall through
    }
  }
  return 'a value that is not a Supabase key'
}

const pick = (row, cols) => Object.fromEntries(cols.map((c) => [c, row[c] ?? null]))

async function syncSet(db, set) {
  const { data: subject, error: sErr } = await db.from('subjects').select('id').eq('slug', set.subject_slug).maybeSingle()
  if (sErr) throw new Error(`subjects: ${sErr.message}`)
  if (!subject) throw new Error(`subject "${set.subject_slug}" not found`)

  const names = [...new Set(set.papers.map((p) => p.topic))]
  const { data: topics, error: tErr } = await db.from('topics').select('id,name').eq('subject_id', subject.id).in('name', names)
  if (tErr) throw new Error(`topics: ${tErr.message}`)
  const topicId = new Map(topics.map((t) => [t.name, t.id]))
  const missing = names.filter((n) => !topicId.has(n))
  if (missing.length) throw new Error(`topics missing from ${set.subject_slug}: ${missing.join(', ')}`)

  const papers = set.papers.map((p) => pick({ ...p, subject_id: subject.id, question_count: p.questions.length }, PAPER_COLS))
  const questions = set.papers.flatMap((p) => p.questions.map((q) => pick({ ...q, paper_id: p.id, topic_id: topicId.get(p.topic) }, QUESTION_COLS)))
  const options = set.papers.flatMap((p) => p.questions.flatMap((q) => q.options.map((o) => pick({ ...o, question_id: q.id }, OPTION_COLS))))

  const P = await changedRows(db, 'papers', PAPER_COLS, papers)
  const Q = await changedRows(db, 'questions', QUESTION_COLS, questions)
  const O = await changedRows(db, 'options', OPTION_COLS, options)
  await upsert(db, 'papers', P.changed)
  await upsert(db, 'questions', Q.changed)
  await upsert(db, 'options', O.changed)
  return `${papers.length} sets, ${questions.length} questions: ${P.fresh} new sets, ${Q.fresh} new questions, ${Q.changed.length - Q.fresh} questions and ${O.changed.length - O.fresh} options updated`
}

async function main() {
  if (!key) {
    console.log('[questions] SUPABASE_SECRET_KEY not set: skipping the question sync.')
    return
  }
  if (!url) {
    console.log('[questions] No Supabase URL: skipping the question sync.')
    return
  }
  const kind = keyKind(key)
  if (kind !== 'secret') {
    console.error(`[questions] QUESTION SYNC SKIPPED: SUPABASE_SECRET_KEY holds ${kind}, which cannot write to the database.`)
    console.error('[questions] In Supabase -> Project Settings -> API Keys, copy a SECRET key (starts with sb_secret_)')
    console.error('[questions] or the legacy service_role key, put it in SUPABASE_SECRET_KEY in Vercel, and redeploy.')
    return
  }
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'))
  let failed = 0
  for (const entry of manifest) {
    const set = JSON.parse(readFileSync(join(dir, `${entry.name}.json`), 'utf8'))
    try {
      console.log(`[questions] ${entry.name}: ${await syncSet(db, set)}`)
    } catch (e) {
      failed++
      console.error(`[questions] QUESTION SYNC FAILED for ${entry.name}: ${e.message}`)
    }
  }
  if (failed) console.error(`[questions] ${failed} set(s) not synced. The site still deployed; fix the error or use Admin -> Load question sets.`)
}

main().catch((e) => console.error(`[questions] QUESTION SYNC FAILED: ${e.message}`))
