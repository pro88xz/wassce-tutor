// Editorial review: an admin reads a lesson, fixes it, then approves it.
// Approved lessons (is_public + reviewed_at + reviewed_by) become free public
// pages at /wassce/{subject}/{topic}/{lesson} with the reviewer's name and bio,
// from the next deploy (public pages are prerendered at build time). The
// database refuses is_public without reviewed_at (migration 02).
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type ReviewLesson = {
  id: string
  topic_id: string
  slug: string
  title: string
  content: string
  est_minutes: number | null
  sort_order: number
  is_public: boolean
  reviewed_at: string | null
  reviewer: { full_name: string | null } | null
  updated_at: string
}

export type ReviewTopic = {
  id: string
  slug: string
  name: string
  group_name: string | null
  group_order: number | null
  sort_order: number
  lesson_count: number
  public_count: number
}

/** Topics of a subject that have lessons, with how many are public. */
export function useReviewTopics(subjectId: string | null) {
  return useQuery({
    queryKey: ['review-topics', subjectId],
    enabled: !!subjectId,
    queryFn: async (): Promise<ReviewTopic[]> => {
      const { data, error } = await supabase
        .from('topics')
        .select('id, slug, name, group_name, group_order, sort_order, lessons(id, is_public)')
        .eq('subject_id', subjectId!)
      if (error) throw error
      return (data ?? [])
        .map((t) => {
          const lessons = (t.lessons ?? []) as { id: string; is_public: boolean }[]
          return {
            id: t.id,
            slug: t.slug,
            name: t.name,
            group_name: t.group_name,
            group_order: t.group_order,
            sort_order: t.sort_order,
            lesson_count: lessons.length,
            public_count: lessons.filter((l) => l.is_public).length,
          }
        })
        .filter((t) => t.lesson_count > 0)
        .sort((a, b) => (a.group_order ?? 999) - (b.group_order ?? 999) || a.sort_order - b.sort_order)
    },
  })
}

/** Lessons of a topic with their review status. */
export function useReviewLessons(topicId: string | null) {
  return useQuery({
    queryKey: ['review-lessons', topicId],
    enabled: !!topicId,
    queryFn: async (): Promise<ReviewLesson[]> => {
      const { data, error } = await supabase
        .from('lessons')
        .select('id, topic_id, slug, title, content, est_minutes, sort_order, is_public, reviewed_at, updated_at, reviewer:profiles!lessons_reviewed_by_fkey(full_name)')
        .eq('topic_id', topicId!)
        .order('sort_order')
      if (error) throw error
      return data as unknown as ReviewLesson[]
    },
  })
}

function useInvalidateReview() {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: ['review-lessons'] })
    qc.invalidateQueries({ queryKey: ['review-topics'] })
    qc.invalidateQueries({ queryKey: ['topic'] })
    qc.invalidateQueries({ queryKey: ['lesson'] })
  }
}

/** Save edits to a lesson's title, content or reading time. */
export function useSaveLesson() {
  const invalidate = useInvalidateReview()
  return useMutation({
    mutationFn: async (args: { id: string; title: string; content: string; est_minutes: number | null }) => {
      const { error } = await supabase
        .from('lessons')
        .update({ title: args.title.trim(), content: args.content, est_minutes: args.est_minutes })
        .eq('id', args.id)
      if (error) throw error
    },
    onSuccess: invalidate,
  })
}

/** Approve: mark reviewed by the signed-in admin and make the lesson public. */
export function useApproveLesson() {
  const invalidate = useInvalidateReview()
  return useMutation({
    mutationFn: async (args: { id: string; reviewerId: string }) => {
      const { error } = await supabase
        .from('lessons')
        .update({ is_public: true, reviewed_at: new Date().toISOString(), reviewed_by: args.reviewerId })
        .eq('id', args.id)
      if (error) throw error
    },
    onSuccess: invalidate,
  })
}

/** Take a lesson off the public site (it stays available to students in the app). */
export function useUnpublishLesson() {
  const invalidate = useInvalidateReview()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('lessons').update({ is_public: false }).eq('id', id)
      if (error) throw error
    },
    onSuccess: invalidate,
  })
}

/** The reviewer's public byline: their name and a one-line bio. */
export function useSaveByline() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (args: { profileId: string; fullName: string; bio: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: args.fullName.trim() || null, public_bio: args.bio.trim() || null })
        .eq('id', args.profileId)
      if (error) throw error
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ['profile', vars.profileId] }),
  })
}
