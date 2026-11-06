#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SOURCE_DIR = path.join(process.cwd(), 'content/notes')
const OUTPUT_DIR = path.join(process.cwd(), 'dist/notes-ingestion')
const ALLOWED = new Set(['ORIGINAL', 'CC0-1.0', 'CC-BY-4.0', 'CC-BY-SA-4.0', 'PUBLIC-DOMAIN'])
const MIN_WORDS = 180
const BATCH_SIZE = 20
const words = (s) => (s.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu) ?? []).length
const hash = (s) => createHash('sha256').update(s, 'utf8').digest('hex')
const heading = (s, name) => new RegExp('^#{1,3}\\s+' + name + '\\s*$', 'im').test(s)

async function main() {
  const mode = process.argv[2] ?? 'build'
  if (!['validate', 'build'].includes(mode)) throw new Error('Usage: node scripts/notes-ingestion.mjs [validate|build]')
  const manifest = JSON.parse(await readFile(path.join(SOURCE_DIR, 'manifest.json'), 'utf8'))
  if (!Array.isArray(manifest.lessons)) throw new Error('manifest.lessons must be an array')
  const errors = [], lessons = [], provenance = [], hashes = new Set(), identities = new Set()
  for (let i = 0; i < manifest.lessons.length; i++) {
    const item = manifest.lessons[i], label = item.file || 'manifest entry ' + (i + 1)
    const issue = (m) => errors.push(label + ': ' + m)
    if (!item.file || path.basename(item.file) !== item.file || !item.file.endsWith('.md')) { issue('file must be a local Markdown filename'); continue }
    if (!item.subject || !item.topic || !item.title) { issue('subject, topic and title are required'); continue }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.topic)) issue('topic must be an existing lowercase topic slug')
    if (!ALLOWED.has(item.license)) issue('licence is not approved by policy')
    if (item.rights_verified !== true) issue('rights_verified must be true')
    if (!item.rights_holder?.trim()) issue('rights_holder is required')
    if (item.license === 'ORIGINAL' && !item.original_author?.trim()) issue('original_author is required for original work')
    if (!['ORIGINAL', 'PUBLIC-DOMAIN'].includes(item.license)) {
      if (!/^https:\/\//i.test(item.source_url ?? '')) issue('third-party source_url must use HTTPS')
      if (!item.attribution?.trim()) issue('third-party attribution is required')
      if (!item.license_evidence?.trim()) issue('licence evidence is required')
    }
    let content
    try { content = (await readFile(path.join(SOURCE_DIR, item.file), 'utf8')).replace(/\r\n?/g, '\n').trim() }
    catch { issue('Markdown file cannot be read'); continue }
    if (/<\s*script\b|\bon\w+\s*=|javascript:/i.test(content)) issue('active HTML or script content is not allowed')
    const count = words(content)
    if (count < MIN_WORDS) issue('lesson must contain at least ' + MIN_WORDS + ' words')
    if (!heading(content, 'Learning objectives')) issue('missing Learning objectives section')
    if (!heading(content, 'WASSCE examination focus')) issue('missing WASSCE examination focus section')
    if (!/^#{1,3}\s+/m.test(content)) issue('Markdown headings are required')
    const digest = hash(content), identity = [item.subject.toLowerCase(), item.topic, item.title.trim().toLowerCase()].join('|')
    if (hashes.has(digest)) issue('duplicate content hash')
    if (identities.has(identity)) issue('duplicate subject/topic/title identity')
    hashes.add(digest); identities.add(identity)
    if (!errors.some(e => e.startsWith(label + ':'))) {
      lessons.push({ subject: item.subject, topic: item.topic, title: item.title.trim(), content, est_minutes: Number.isInteger(item.est_minutes) ? Math.min(120, Math.max(1, item.est_minutes)) : Math.max(5, Math.ceil(count / 180)), sort_order: Number.isInteger(item.sort_order) ? item.sort_order : i + 1 })
      provenance.push({ file: item.file, subject: item.subject, topic: item.topic, title: item.title, sha256: digest, word_count: count, license: item.license, rights_holder: item.rights_holder, rights_verified: item.rights_verified, source_url: item.source_url ?? null, attribution: item.attribution ?? null, license_evidence: item.license_evidence ?? null, original_author: item.original_author ?? null })
    }
  }
  const report = { generated_at: new Date().toISOString(), input_count: manifest.lessons.length, valid_count: lessons.length, error_count: errors.length, errors }
  if (mode === 'validate') { console.log(JSON.stringify(report, null, 2)); if (errors.length) process.exitCode = 1; return }
  if (errors.length) { console.error(JSON.stringify(report, null, 2)); process.exitCode = 1; return }
  await mkdir(OUTPUT_DIR, { recursive: true })
  for (const name of await readdir(OUTPUT_DIR)) if (/^(lessons-\d{3}\.json|provenance\.json|report\.json)$/.test(name)) await unlink(path.join(OUTPUT_DIR, name))
  for (let start = 0; start < lessons.length; start += BATCH_SIZE) {
    const part = String(Math.floor(start / BATCH_SIZE) + 1).padStart(3, '0')
    await writeFile(path.join(OUTPUT_DIR, 'lessons-' + part + '.json'), JSON.stringify(lessons.slice(start, start + BATCH_SIZE), null, 2) + '\n')
  }
  await writeFile(path.join(OUTPUT_DIR, 'provenance.json'), JSON.stringify(provenance, null, 2) + '\n')
  await writeFile(path.join(OUTPUT_DIR, 'report.json'), JSON.stringify({ ...report, batches: Math.ceil(lessons.length / BATCH_SIZE) }, null, 2) + '\n')
  console.log('Validated ' + lessons.length + ' lesson(s); generated ' + Math.ceil(lessons.length / BATCH_SIZE) + ' batch(es).')
}
main().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1 })
