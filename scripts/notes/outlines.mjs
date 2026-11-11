#!/usr/bin/env node
// Lesson outlines for topic pages.
//
//   node scripts/notes/outlines.mjs
//
// Reads content/notes/manifest.json and each note, and writes one file per
// subject to src/content/lesson-outlines/<subject-slug>.json:
//
//   { "<topic-slug>/<lesson-slug>": { "s": [[2, "Vernier calipers"], ...], "w": 4, "f": 2 } }
//
// s: the teaching sections (level-2 headings), each with its position among all
//    level-2 headings in the lesson, which is the number LessonView puts in the
//    heading's id ("section-2"), so a topic page can link straight to it.
// w: worked examples. f: diagrams.
//
// Topic pages show this so a student can see what each lesson covers before
// opening it. Lessons that are not in the manifest simply have no outline.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const notes = join(root, 'content/notes')
const out = join(root, 'src/content/lesson-outlines')

/** The lesson slug: the same rule as scripts/sync-notes.mjs and import_lessons(). */
const slugOf = (title) =>
  title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '')
/** Subject name to its URL slug ("ICT / Computer Studies" -> "ict-computer-studies"). */
const subjectSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Headings every lesson has; they are not what the lesson teaches.
const ROUTINE =
  /^(learning objectives|key points|wassce examination focus|quick check|summary|formula summary|answers|further reading|references|sources|wassce practice questions|practice questions)\b/i

const plain = (s) =>
  s
    .replace(/^\d+(\.\d+)*\.?\s+/, '') // "3. Vernier calipers" -> "Vernier calipers"
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*|__|`/g, '')
    .replace(/\$([^$]+)\$/g, '$1')
    .trim()

export function outline(md) {
  const sections = []
  let n = 0
  let fenced = false
  for (const line of md.split('\n')) {
    if (/^\s*```/.test(line)) fenced = !fenced
    if (fenced) continue
    const m = /^##\s+(.+?)\s*#*\s*$/.exec(line)
    if (!m) continue
    n += 1
    const title = plain(m[1])
    if (!ROUTINE.test(title)) sections.push([n, title])
  }
  const worked =
    (md.match(/:::callout\{type=worked-example\}/g) ?? []).length + (md.match(/^\*\*Worked example\b/gim) ?? []).length
  const figures = (md.match(/!\[[^\]]*\]\([^)]+\)/g) ?? []).length
  return { s: sections, w: worked, f: figures }
}

function main() {
  const { lessons } = JSON.parse(readFileSync(join(notes, 'manifest.json'), 'utf8'))
  const bySubject = new Map()
  for (const e of lessons) {
    const md = readFileSync(join(notes, e.file), 'utf8')
    const key = `${e.topic}/${e.slug || slugOf(e.title)}`
    const subject = subjectSlug(e.subject)
    if (!bySubject.has(subject)) bySubject.set(subject, {})
    bySubject.get(subject)[key] = outline(md)
  }
  mkdirSync(out, { recursive: true })
  for (const f of readdirSync(out)) if (f.endsWith('.json')) rmSync(join(out, f))
  let total = 0
  for (const [subject, map] of [...bySubject].sort()) {
    const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)))
    writeFileSync(join(out, `${subject}.json`), JSON.stringify(sorted) + '\n')
    total += Object.keys(sorted).length
  }
  console.log(`lesson outlines: ${total} lessons in ${bySubject.size} subjects`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main()
