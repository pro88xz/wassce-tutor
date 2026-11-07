// Publish editorial notes from content/notes/ into the lessons table on every
// production deploy, so new or corrected notes go live without a manual import.
//
// Runs at the end of `npm run build`, after the question sync. Only manifest
// entries with "auto_sync": true are touched (the earlier notes stay under the
// manual Admin -> Import lessons route). Each note is matched by topic and
// slug: new notes are inserted, changed notes are updated, nothing is deleted,
// and review fields (reviewed_by, reviewed_at, is_public) are never changed.
//
// Needs SUPABASE_SECRET_KEY (Vercel, Production only), like the question sync.
// Without it, it does nothing, so local builds never touch the real database.
// A failure is reported in the build log but does not stop the deploy.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'content/notes')
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

/** The lesson slug, the same rule import_lessons() uses. */
const slugOf = (title) =>
  title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '')
const words = (s) => (s.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu) ?? []).length

function isSecret(k) {
  if (k.startsWith('sb_secret_')) return true
  try {
    return JSON.parse(Buffer.from(k.split('.')[1], 'base64url').toString('utf8')).role === 'service_role'
  } catch {
    return false
  }
}

async function main() {
  if (!key || !url) {
    console.log('[notes] SUPABASE_SECRET_KEY or Supabase URL not set: skipping the notes sync.')
    return
  }
  if (!isSecret(key)) {
    console.error('[notes] NOTES SYNC SKIPPED: SUPABASE_SECRET_KEY is not a secret key.')
    return
  }
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'))
  const entries = (manifest.lessons || []).filter((e) => e.auto_sync === true)
  if (!entries.length) return
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

  const subjectNames = [...new Set(entries.map((e) => e.subject))]
  const { data: subjects, error: sErr } = await db.from('subjects').select('id,name').in('name', subjectNames)
  if (sErr) throw new Error(`subjects: ${sErr.message}`)
  const subjectId = new Map(subjects.map((s) => [s.name, s.id]))

  let inserted = 0
  let updated = 0
  let unchanged = 0
  for (const e of entries) {
    try {
      const sid = subjectId.get(e.subject)
      if (!sid) throw new Error(`subject "${e.subject}" not found`)
      const { data: topic, error: tErr } = await db.from('topics').select('id').eq('subject_id', sid).eq('slug', e.topic).maybeSingle()
      if (tErr) throw new Error(`topics: ${tErr.message}`)
      if (!topic) throw new Error(`topic "${e.topic}" not found in ${e.subject}`)
      const content = readFileSync(join(dir, e.file), 'utf8').replace(/\r\n?/g, '\n').trim()
      const row = {
        topic_id: topic.id,
        slug: e.slug || slugOf(e.title),
        title: e.title.trim(),
        content,
        est_minutes: Number.isInteger(e.est_minutes) ? e.est_minutes : Math.max(5, Math.ceil(words(content) / 180)),
        sort_order: Number.isInteger(e.sort_order) ? e.sort_order : 1,
        is_published: true,
      }
      const { data: existing, error: lErr } = await db
        .from('lessons')
        .select('id,title,content,est_minutes,sort_order')
        .eq('topic_id', row.topic_id)
        .eq('slug', row.slug)
        .maybeSingle()
      if (lErr) throw new Error(`lessons: ${lErr.message}`)
      if (!existing) {
        const { error } = await db.from('lessons').insert(row)
        if (error) throw new Error(`insert: ${error.message}`)
        inserted++
      } else if (existing.title !== row.title || existing.content !== row.content || existing.est_minutes !== row.est_minutes || existing.sort_order !== row.sort_order) {
        const { error } = await db.from('lessons').update({ title: row.title, content: row.content, est_minutes: row.est_minutes, sort_order: row.sort_order }).eq('id', existing.id)
        if (error) throw new Error(`update: ${error.message}`)
        updated++
      } else {
        unchanged++
      }
    } catch (err) {
      console.error(`[notes] NOTE SYNC FAILED for ${e.file}: ${err.message}`)
    }
  }
  console.log(`[notes] ${entries.length} auto-sync notes: ${inserted} new, ${updated} updated, ${unchanged} unchanged.`)
}

main().catch((e) => console.error(`[notes] NOTES SYNC FAILED: ${e.message}`))
