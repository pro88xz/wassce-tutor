#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { isIP } from 'node:net'
import { pathToFileURL } from 'node:url'
import TurndownService from 'turndown'

const ROOT = process.cwd()
const INPUT = path.join(ROOT, 'content/sources/manifest.json')
const OUTPUT = path.join(ROOT, 'dist/source-packets')
const MAX_BYTES = 1_500_000
const TIMEOUT_MS = 20_000
const ALLOWED = new Set(['CC0-1.0', 'CC-BY-4.0', 'CC-BY-SA-4.0', 'PUBLIC-DOMAIN'])
const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' })

const sha256 = (value) => createHash('sha256').update(value).digest('hex')
const fail = (message) => { throw new Error(message) }

function assertPublicHttpsUrl(value, label) {
  let url
  try { url = new URL(value) } catch { fail(label + ': invalid source URL') }
  if (url.protocol !== 'https:') fail(label + ': only HTTPS sources are accepted')
  if (url.username || url.password) fail(label + ': credential-bearing URLs are forbidden')
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (isIP(host) || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) fail(label + ': IP-literal, private or local hosts are forbidden')
  return url
}

export function validateSource(source, index = 0) {
  const label = source.id || 'source ' + (index + 1)
  if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(source.id || '')) fail(label + ': id must be a stable lowercase slug')
  const url = assertPublicHttpsUrl(source.url, label)
  if (!source.title?.trim() || !source.subject?.trim() || !source.topic?.trim()) fail(label + ': title, subject and topic are required')
  if (!ALLOWED.has(source.license)) fail(label + ': licence is not approved for extraction')
  if (source.rights_verified !== true || !source.rights_holder?.trim() || !source.attribution?.trim() || !source.license_evidence?.trim()) fail(label + ': verified rights holder, attribution and licence evidence are mandatory')
  return { ...source, url: url.toString() }
}

export function extractMain(html) {
  let body = html
  const main = html.match(/<(article|main)\b[^>]*>([\s\S]*?)<\/\1>/i)
  if (main) body = main[2]
  else {
    const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch) body = bodyMatch[1]
  }
  body = body
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|svg|iframe|nav|footer|header|form|button)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<(br|hr)\b[^>]*>/gi, '\n')
  return turndown.turndown(body).replace(/\n{3,}/g, '\n\n').trim()
}

async function acquire(source, index) {
  const item = validateSource(source, index)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    let current = item.url
    let response
    for (let hop = 0; hop <= 5; hop++) {
      assertPublicHttpsUrl(current, item.id)
      response = await fetch(current, {
        signal: controller.signal,
        redirect: 'manual',
        headers: { 'user-agent': 'WASSCE-Tutor-ResearchBot/1.0 (+https://wasscetutor.com; rights-respecting educational source capture)', accept: 'text/html, text/plain;q=0.9' },
      })
      if (![301, 302, 303, 307, 308].includes(response.status)) break
      const location = response.headers.get('location')
      if (!location || hop === 5) fail(item.id + ': invalid or excessive redirect chain')
      current = new URL(location, current).toString()
    }
    if (!response.ok) fail(item.id + ': HTTP ' + response.status)
    const type = response.headers.get('content-type') || ''
    if (!/(text\/html|text\/plain|application\/xhtml\+xml)/i.test(type)) fail(item.id + ': unsupported content type ' + type)
    const declared = Number(response.headers.get('content-length') || 0)
    if (declared > MAX_BYTES) fail(item.id + ': source exceeds size limit')
    const html = await response.text()
    if (Buffer.byteLength(html, 'utf8') > MAX_BYTES) fail(item.id + ': source exceeds size limit')
    const extracted = extractMain(html)
    if (extracted.length < 200) fail(item.id + ': extraction returned too little readable content')
    const packet = {
      source_id: item.id,
      title: item.title,
      subject: item.subject,
      topic: item.topic,
      source_url: response.url,
      retrieved_at: new Date().toISOString(),
      http_status: response.status,
      content_type: type,
      license: item.license,
      rights_holder: item.rights_holder,
      rights_verified: item.rights_verified,
      attribution: item.attribution,
      license_evidence: item.license_evidence,
      sha256: sha256(extracted),
      extracted_markdown: extracted,
      editorial_instruction: 'Research packet only. Create independently authored WASSCE notes; do not publish copied source text without a separate editorial and rights review.',
    }
    await writeFile(path.join(OUTPUT, item.id + '.json'), JSON.stringify(packet, null, 2) + '\n')
    return { id: item.id, title: item.title, characters: extracted.length, sha256: packet.sha256, output: item.id + '.json' }
  } finally {
    clearTimeout(timer)
  }
}

async function main() {
  const manifest = JSON.parse(await readFile(INPUT, 'utf8'))
  if (!Array.isArray(manifest.sources)) fail('manifest.sources must be an array')
  const ids = new Set()
  for (const source of manifest.sources) {
    if (ids.has(source.id)) fail('duplicate source id: ' + source.id)
    ids.add(source.id)
  }
  await mkdir(OUTPUT, { recursive: true })
  const results = []
  for (let i = 0; i < manifest.sources.length; i++) {
    try { results.push({ status: 'acquired', ...(await acquire(manifest.sources[i], i)) }) }
    catch (error) { results.push({ status: 'rejected', id: manifest.sources[i]?.id ?? null, error: error instanceof Error ? error.message : String(error) }) }
  }
  await writeFile(path.join(OUTPUT, 'report.json'), JSON.stringify({ generated_at: new Date().toISOString(), total: results.length, acquired: results.filter(x => x.status === 'acquired').length, rejected: results.filter(x => x.status === 'rejected').length, results }, null, 2) + '\n')
  console.log(JSON.stringify({ total: results.length, acquired: results.filter(x => x.status === 'acquired').length, rejected: results.filter(x => x.status === 'rejected').length }, null, 2))
  if (results.some(x => x.status === 'rejected')) process.exitCode = 1
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1 })
}
