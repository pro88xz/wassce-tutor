// Question bank loader. The question sets are built and checked by
// scripts/questions/build.py into src/content/question-sets/*.json and ship
// with the app. An admin loads a set into the database with one tap (Admin ->
// Load question sets): one practice paper per topic, with its questions and
// options. Rows have fixed ids, so loading again updates the same rows.
// Loaded sets are live for students straight away.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type SetSummary = {
  name: string
  label: string
  subject_slug: string
  version: string
  papers: string[]
  questions: number
}

type SetFile = {
  name: string
  subject_slug: string
  papers: Array<{
    id: string
    topic: string
    title: string
    paper_type: string
    description: string
    sort_order: number
    questions: Array<{
      id: string
      stem: string
      image_url: string | null
      explanation: string
      position: number
      options: Array<{ id: string; label: string; content: string; is_correct: boolean; position: number }>
    }>
  }>
}

const manifestFile = import.meta.glob<SetSummary[]>('../content/question-sets/manifest.json', { eager: true, import: 'default' })
const setFiles = import.meta.glob<SetFile>(['../content/question-sets/*.json', '!../content/question-sets/manifest.json'], { import: 'default' })

export const QUESTION_SETS: SetSummary[] = Object.values(manifestFile)[0] ?? []

export type SetStatus = { loaded: number; live: number }

/** How many of each set's papers are in the database, and how many are live. */
export function useQuestionSetStatus() {
  const ids = QUESTION_SETS.flatMap((s) => s.papers)
  return useQuery({
    queryKey: ['question-bank-status'],
    enabled: ids.length > 0,
    queryFn: async (): Promise<Record<string, SetStatus>> => {
      const { data, error } = await supabase.from('papers').select('id, is_published').in('id', ids)
      if (error) throw error
      const rows = new Map((data ?? []).map((r) => [r.id as string, r.is_published as boolean]))
      return Object.fromEntries(
        QUESTION_SETS.map((s) => [
          s.name,
          { loaded: s.papers.filter((id) => rows.has(id)).length, live: s.papers.filter((id) => rows.get(id)).length },
        ]),
      )
    },
  })
}

async function upsertInChunks(table: 'papers' | 'questions' | 'options', rows: object[], size = 200) {
  for (let i = 0; i < rows.length; i += size) {
    const { error } = await supabase.from(table).upsert(rows.slice(i, i + size), { onConflict: 'id' })
    if (error) throw new Error(`${table}: ${error.message}`)
  }
}

/** Load (or reload) a set: papers, questions and options, all live. */
export function useLoadQuestionSet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (name: string): Promise<{ papers: number; questions: number }> => {
      const loader = setFiles[`../content/question-sets/${name}.json`]
      if (!loader) throw new Error(`Unknown question set: ${name}`)
      const set = await loader()

      const { data: subject, error: sErr } = await supabase.from('subjects').select('id').eq('slug', set.subject_slug).maybeSingle()
      if (sErr) throw sErr
      if (!subject) throw new Error(`Subject "${set.subject_slug}" not found.`)

      const names = [...new Set(set.papers.map((p) => p.topic))]
      const { data: topics, error: tErr } = await supabase.from('topics').select('id, name').eq('subject_id', subject.id).in('name', names)
      if (tErr) throw tErr
      const topicId = new Map((topics ?? []).map((t) => [t.name as string, t.id as string]))
      const missing = names.filter((n) => !topicId.has(n))
      if (missing.length) throw new Error(`These topics are missing from ${set.subject_slug}: ${missing.join(', ')}. Add them in Admin -> Topics, then load again.`)

      await upsertInChunks('papers', set.papers.map((p) => ({
        id: p.id,
        subject_id: subject.id,
        title: p.title,
        paper_type: p.paper_type,
        description: p.description,
        question_count: p.questions.length,
        sort_order: p.sort_order,
        is_published: true,
      })))
      const questions = set.papers.flatMap((p) => p.questions.map((q) => ({ q, paperId: p.id, topicId: topicId.get(p.topic)! })))
      await upsertInChunks('questions', questions.map(({ q, paperId, topicId }) => ({
        id: q.id,
        paper_id: paperId,
        topic_id: topicId,
        stem: q.stem,
        image_url: q.image_url,
        explanation: q.explanation,
        position: q.position,
      })))
      await upsertInChunks('options', questions.flatMap(({ q }) => q.options.map((o) => ({ ...o, question_id: q.id }))))
      return { papers: set.papers.length, questions: questions.length }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['question-bank-status'] })
      qc.invalidateQueries({ queryKey: ['review-sets'] })
      qc.invalidateQueries({ queryKey: ['papers'] })
      qc.invalidateQueries({ queryKey: ['paper'] })
    },
  })
}
