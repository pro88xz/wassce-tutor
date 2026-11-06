#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const MANIFEST = path.join(ROOT, 'content/notes/manifest.json')
const PAGE_SIZE = 500

const normalize = (value) => String(value ?? '').trim().toLocaleLowerCase('en')

export function validateCatalog(manifest, subjects, topics) {
  const errors = []
  const subjectByName = new Map(subjects.map((s) => [normalize(s.name), s]))
  const subjectBySlug = new Map(subjects.map((s) => [normalize(s.slug), s]))
  const topicBySubjectSlug = new Map(topics.map((t) => [t.subject_id + '|' + t.slug, t]))
  const seen = new Set()

  for (const [index, lesson] of (manifest.lessons ?? []).entries()) {
    const label = lesson.file || 'manifest entry ' + (index + 1)
    const subject = subjectByName.get(normalize(lesson.subject)) || subjectBySlug.get(normalize(lesson.subject))
    if (!subject) {
      errors.push(label + ': subject does not exist in the live Supabase catalog: ' + lesson.subject)
      continue
    }
    const topic = topicBySubjectSlug.get(subject.id + '|' + lesson.topic)
    if (!topic) {
      errors.push(label + ': topic slug "' + lesson.topic + '" does not exist under subject "' + subject.name + '"')
      continue
    }
    const key = topic.id + '|' + normalize(lesson.title)
    if (seen.has(key)) errors.push(label + ': duplicate lesson title for this live topic')
    seen.add(key)
  }
  return { valid: errors.length === 0, checked: manifest.lessons?.length ?? 0, errors }
}

async function fetchAll(baseUrl, apiKey, table) {
  const rows = []
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const url = new URL('/rest/v1/' + table, baseUrl)
    url.searchParams.set('select', table === 'subjects' ? 'id,name,slug' : 'id,slug,subject_id')
    url.searchParams.set('order', 'id')
    const response = await fetch(url, {
      headers: { apikey: apiKey, Authorization: 'Bearer ' + apiKey, Accept: 'application/json', Range: offset + '-' + (offset + PAGE_SIZE - 1), 'Range-Unit': 'items' },
      signal: AbortSignal.timeout(15000),
    })
    if (!response.ok) throw new Error('Supabase ' + table + ' query failed (' + response.status + '): ' + (await response.text()).slice(0, 500))
    const page = await response.json()
    if (!Array.isArray(page)) throw new Error('Supabase returned an invalid ' + table + ' response')
    rows.push(...page)
    if (page.length < PAGE_SIZE) break
  }
  return rows
}

async function main() {
  const baseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const apiKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!baseUrl || !apiKey) throw new Error('Set SUPABASE_URL and SUPABASE_ANON_KEY (or their VITE_ equivalents) before running notes:catalog')
  const parsed = new URL(baseUrl)
  if (parsed.protocol !== 'https:' && parsed.hostname !== 'localhost') throw new Error('Supabase URL must use HTTPS')
  const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))
  if (!Array.isArray(manifest.lessons)) throw new Error('manifest.lessons must be an array')
  const [subjects, topics] = await Promise.all([fetchAll(parsed, apiKey, 'subjects'), fetchAll(parsed, apiKey, 'topics')])
  const report = validateCatalog(manifest, subjects, topics)
  console.log(JSON.stringify({ ...report, live_subjects: subjects.length, live_topics: topics.length }, null, 2))
  if (!report.valid) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1 })
}
