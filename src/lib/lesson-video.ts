// Lesson videos: what the page and player know about a lesson's video
// (public view wassce_public_lesson_videos, migration 35), and its search data.
// Playback itself goes through /api/video (api/_lib/video.js): there is no
// plain video address anywhere on the site.
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { SITE, absoluteUrl, orgRef } from '@/lib/seo'

export type VideoChapter = { name: string; start: number }
export type VideoCue = { start: number; end: number; text: string }

export type LessonVideo = {
  id: string
  lesson_id: string
  revision: string
  title: string
  description: string
  duration_s: number
  chapters: VideoChapter[]
  transcript: VideoCue[]
  thumbnail_url: string
  captions_url: string | null
  published_at: string
  updated_at: string
}

const COLUMNS = 'id, lesson_id, revision, title, description, duration_s, chapters, transcript, thumbnail_url, captions_url, published_at, updated_at'

/** The lesson's published video, or null. Before migration 35 there are none. */
export async function fetchLessonVideo(lessonId: string): Promise<LessonVideo | null> {
  const { data, error } = await supabase.from('wassce_public_lesson_videos').select(COLUMNS).eq('lesson_id', lessonId).maybeSingle()
  if (error) {
    // The view does not exist yet (migration 35 not applied): no videos.
    if (error.code === '42P01' || error.code === 'PGRST205') return null
    throw new Error(`lesson video: ${error.message}`)
  }
  if (!data) return null
  return { ...(data as unknown as LessonVideo), duration_s: Number(data.duration_s) }
}

export const useLessonVideo = (lessonId: string | null) =>
  useQuery({
    queryKey: ['lesson-video', lessonId],
    queryFn: () => fetchLessonVideo(lessonId!),
    enabled: Boolean(lessonId),
    staleTime: 10 * 60_000,
  })

/** 75.4 -> "1:15" */
export function clock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${r}` : `${m}:${r}`
}

/** 75.4 -> "PT1M15S" (schema.org duration). */
export function isoDuration(seconds: number): string {
  const s = Math.round(seconds)
  const m = Math.floor(s / 60)
  return `PT${m ? `${m}M` : ''}${s % 60}S`
}

/** The ?t= a key moment links to (the player starts there). */
export const startParam = (search: string): number | null => {
  const t = new URLSearchParams(search).get('t')
  const n = t && /^\d{1,5}$/.test(t) ? Number(t) : NaN
  return Number.isFinite(n) ? n : null
}

/**
 * VideoObject for the lesson page (the video's watch page). contentUrl is the
 * address only Google's verified crawler is given the file from (api/video.js
 * ?op=file); Google's guidelines allow serving the file to Googlebot alone.
 * Each chapter is a Clip (a key moment) linking to the page at that second.
 */
export function videoJsonLd(video: LessonVideo, pagePath: string): Record<string, unknown> {
  const page = absoluteUrl(pagePath)
  const chapters = video.chapters.filter((c, i, all) => all.findIndex((d) => d.start === c.start) === i)
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${page}#video`,
    name: video.title,
    description: video.description,
    thumbnailUrl: [video.thumbnail_url],
    uploadDate: video.published_at,
    duration: isoDuration(video.duration_s),
    contentUrl: `${SITE.origin}/api/video?op=file&v=${video.id}`,
    inLanguage: 'en',
    isFamilyFriendly: true,
    isAccessibleForFree: true,
    learningResourceType: 'Video lesson',
    educationalLevel: 'Senior secondary (WASSCE)',
    creator: orgRef(),
    publisher: orgRef(),
    transcript: video.transcript.map((c) => c.text).join(' '),
    ...(chapters.length >= 2 && video.duration_s >= 30
      ? {
          hasPart: chapters.map((c, i) => ({
            '@type': 'Clip',
            name: c.name,
            startOffset: Math.floor(c.start),
            endOffset: Math.floor(chapters[i + 1]?.start ?? video.duration_s),
            url: `${page}?t=${Math.floor(c.start)}`,
          })),
        }
      : {}),
  }
}
