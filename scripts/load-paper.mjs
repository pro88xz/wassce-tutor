// Usage: node scripts/load-paper.mjs imports/your-file.json
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.')
  process.exit(1)
}

const file = process.argv[2]
if (!file) {
  console.error('Usage: node scripts/load-paper.mjs <path-to-json>')
  process.exit(1)
}

const supabase = createClient(url, serviceKey)

const data = JSON.parse(readFileSync(file, 'utf8'))

// --- basic validation ---
function fail(msg) {
  console.error('❌ ' + msg)
  process.exit(1)
}
if (!data.subject_slug) fail('Missing subject_slug')
if (!data.paper?.title) fail('Missing paper.title')
if (!Array.isArray(data.questions) || data.questions.length === 0) fail('No questions')
for (const [i, q] of data.questions.entries()) {
  if (!q.stem) fail(`Q${i + 1}: missing stem`)
  if (!Array.isArray(q.options) || q.options.length < 2) fail(`Q${i + 1}: needs >=2 options`)
  const correct = q.options.filter((o) => o.is_correct).length
  if (correct !== 1) fail(`Q${i + 1}: must have exactly 1 correct option (found ${correct})`)
}

const run = async () => {
  // 1. find subject
  const { data: subject, error: subErr } = await supabase
    .from('subjects').select('id, name').eq('slug', data.subject_slug).single()
  if (subErr || !subject) fail(`Subject not found for slug "${data.subject_slug}"`)
  console.log(`📘 Subject: ${subject.name}`)

  // 2. create paper
  const { data: paper, error: paperErr } = await supabase
    .from('papers')
    .insert({
      subject_id: subject.id,
      title: data.paper.title,
      year: data.paper.year ?? null,
      paper_type: data.paper.paper_type ?? null,
      description: data.paper.description ?? null,
      question_count: data.questions.length,
    })
    .select('id').single()
  if (paperErr) fail('Paper insert failed: ' + paperErr.message)
  console.log(`📄 Paper created: ${data.paper.title}`)

  // 3. questions + options
  for (const [i, q] of data.questions.entries()) {
    const { data: qRow, error: qErr } = await supabase
      .from('questions')
      .insert({
        paper_id: paper.id,
        stem: q.stem,
        explanation: q.explanation ?? null,
        image_url: q.image_url ?? null,
        position: i + 1,
      })
      .select('id').single()
    if (qErr) fail(`Q${i + 1} insert failed: ` + qErr.message)

    const optionRows = q.options.map((o, j) => ({
      question_id: qRow.id,
      label: o.label ?? String.fromCharCode(65 + j),
      content: o.content,
      is_correct: !!o.is_correct,
      position: j + 1,
    }))
    const { error: oErr } = await supabase.from('options').insert(optionRows)
    if (oErr) fail(`Q${i + 1} options failed: ` + oErr.message)
  }

  console.log(`✅ Loaded ${data.questions.length} questions successfully.`)
}

run()
