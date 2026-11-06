import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { validateSource, extractMain } from './source-acquisition.mjs'

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'notes-ingestion.mjs')
const validMarkdown = '# Test lesson\n\n## Learning objectives\n\n' + ('Students should understand the concept and apply it correctly in examination questions. '.repeat(35)) + '\n\n## WASSCE examination focus\n\nExplain, compare and apply the main principles using accurate scientific language.\n'

async function fixture(license = 'ORIGINAL') {
  const root = await mkdtemp(path.join(os.tmpdir(), 'wassce-notes-'))
  await mkdir(path.join(root, 'content/notes'), { recursive: true })
  await writeFile(path.join(root, 'content/notes/lesson.md'), validMarkdown)
  await writeFile(path.join(root, 'content/notes/manifest.json'), JSON.stringify({ lessons: [{
    file: 'lesson.md', subject: 'Biology', topic: 'cell-structure', title: 'Test lesson',
    license, rights_holder: 'WASSCE Tutor', rights_verified: true, original_author: 'Editorial team',
  }] }))
  return root
}

function run(root, mode) {
  return spawnSync(process.execPath, [script, mode], { cwd: root, encoding: 'utf8' })
}

test('valid original lesson validates and builds an importer batch', async () => {
  const root = await fixture()
  try {
    const validation = run(root, 'validate')
    assert.equal(validation.status, 0, validation.stderr)
    const build = run(root, 'build')
    assert.equal(build.status, 0, build.stderr)
    const batch = JSON.parse(await readFile(path.join(root, 'dist/notes-ingestion/lessons-001.json'), 'utf8'))
    assert.equal(batch.length, 1)
    assert.equal(batch[0].subject, 'Biology')
    assert.equal(batch[0].topic, 'cell-structure')
  } finally { await rm(root, { recursive: true, force: true }) }
})

test('unapproved licence is rejected', async () => {
  const root = await fixture('CC-BY-NC-4.0')
  try {
    const result = run(root, 'validate')
    assert.equal(result.status, 1)
    assert.match(result.stdout, /licence is not approved/)
  } finally { await rm(root, { recursive: true, force: true }) }
})

test('missing rights verification is rejected', async () => {
  const root = await fixture()
  try {
    const manifestPath = path.join(root, 'content/notes/manifest.json')
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    manifest.lessons[0].rights_verified = false
    await writeFile(manifestPath, JSON.stringify(manifest))
    const result = run(root, 'validate')
    assert.equal(result.status, 1)
    assert.match(result.stdout, /rights_verified must be true/)
  } finally { await rm(root, { recursive: true, force: true }) }
})

test('source acquisition rejects insecure URLs and unapproved licences', () => {
  const base = { id: 'source-one', url: 'https://example.org/article', title: 'Source', subject: 'Biology', topic: 'cell-structure', license: 'CC-BY-4.0', rights_holder: 'Publisher', rights_verified: true, attribution: 'Publisher', license_evidence: 'Licence page' }
  assert.equal(validateSource(base).url, base.url)
  assert.throws(() => validateSource({ ...base, url: 'http://example.org/article' }), /only HTTPS/)
  assert.throws(() => validateSource({ ...base, url: 'https://127.0.0.1/private' }), /IP-literal/)
  assert.throws(() => validateSource({ ...base, license: 'CC-BY-NC-4.0' }), /licence is not approved/)
  assert.throws(() => validateSource({ ...base, rights_verified: false }), /verified rights holder/)
})

test('HTML extraction prioritises article content and strips scripts and navigation', () => {
  const html = '<html><body><nav>Navigation noise</nav><article><h1>Cell biology</h1><p>Useful educational text.</p><script>steal()</script></article></body></html>'
  const markdown = extractMain(html)
  assert.match(markdown, /Cell biology/)
  assert.match(markdown, /Useful educational text/)
  assert.doesNotMatch(markdown, /Navigation noise|steal\(\)/)
})
