// Key terms in the app: a topic's cards (src/lib/key-terms.ts, made from its
// lessons' definitions) and what this student knows (key_term_progress,
// migration 24: "I know this" / "Not yet", one row per card they marked).
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { hasKeyTermsByCount, topicKeyTerms, type KeyTerm } from '@/lib/key-terms'

/** A topic's key terms, its lessons in syllabus order; [] when it has too few for revision. */
export function useTopicKeyTerms(topicId: string | null) {
  return useQuery({
    queryKey: ['key-terms', topicId],
    enabled: !!topicId,
    staleTime: 10 * 60 * 1000,
    queryFn: async (): Promise<KeyTerm[]> => {
      const { data, error } = await supabase
        .from('wassce_public_lessons')
        .select('id, slug, title, content, sort_order')
        .eq('topic_id', topicId!)
        .order('sort_order')
        .order('id')
      if (error) throw error
      const terms = topicKeyTerms(data ?? [])
      return hasKeyTermsByCount(terms.length) ? terms : []
    },
  })
}

/** term id -> known (true) or "not yet" (false); a card never marked is absent. */
export type KeyTermMarks = Map<string, boolean>

/** True until migration 24 has created key_term_progress: marks then read as empty. */
const missingTable = (e: { code?: string } | null) => e?.code === 'PGRST205' || e?.code === '42P01'

export function useKeyTermMarks(userId: string | null) {
  return useQuery({
    queryKey: ['key-term-progress', userId],
    enabled: !!userId,
    queryFn: async (): Promise<KeyTermMarks> => {
      const marks: KeyTermMarks = new Map()
      for (let from = 0; ; from += 1000) {
        const { data, error } = await supabase
          .from('key_term_progress')
          .select('term_id, known')
          .eq('profile_id', userId!)
          .order('term_id')
          .range(from, from + 999)
        if (error) {
          if (missingTable(error)) return marks
          throw error
        }
        for (const r of data ?? []) marks.set(r.term_id as string, r.known as boolean)
        if ((data ?? []).length < 1000) return marks
      }
    },
  })
}

/** Mark a card "I know this" (known) or "Not yet". Updates the screen at once; saves in the background. */
export function useMarkKeyTerm(userId: string | null) {
  const qc = useQueryClient()
  const key = ['key-term-progress', userId]
  return useMutation({
    mutationFn: async ({ termId, known }: { termId: string; known: boolean }) => {
      if (!userId) throw new Error('Sign in to save which key terms you know')
      const { error } = await supabase
        .from('key_term_progress')
        .upsert({ profile_id: userId, term_id: termId, known, updated_at: new Date().toISOString() }, { onConflict: 'profile_id,term_id' })
      if (error) {
        if (missingTable(error)) throw new Error('Saving key terms is being set up. Try again soon.')
        throw error
      }
    },
    onMutate: async ({ termId, known }) => {
      await qc.cancelQueries({ queryKey: key })
      const before = qc.getQueryData<KeyTermMarks>(key)
      const next = new Map(before ?? [])
      next.set(termId, known)
      qc.setQueryData(key, next)
      return { before }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.before) qc.setQueryData(key, ctx.before)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  })
}

/** How many of these cards the student knows. */
export const knownCount = (terms: KeyTerm[], marks: KeyTermMarks | undefined) => terms.filter((t) => marks?.get(t.id) === true).length
