// The video sitemap (dist/client/video-sitemap.xml), written by
// scripts/postbuild.mjs: one entry per published lesson video, on its lesson
// page (the watch page), with what Google shows in video results. robots.txt
// lists it beside the main sitemap. The video's file address is the one only
// Google's verified crawler is served from (api/_lib/video.js).
//
// Reads the public view over REST with the publishable key, like the page
// list. Without the key (a local build) or before migration 35, it writes an
// empty sitemap and says so; it never stops the build.
import fs from 'node:fs'
import path from 'node:path'

const SITE = 'https://wasscetutor.com'
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

async function rows(url, key, table, select) {
  const res = await fetch(`${url}/rest/v1/${table}?select=${select}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
  if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`)
  return res.json()
}

/** Sitemap entries: the lesson page and its video, for every published video. */
export async function videoEntries(url, key) {
  const [videos, lessons, topics, subjects] = await Promise.all([
    rows(url, key, 'wassce_public_lesson_videos', 'id,lesson_id,title,description,duration_s,thumbnail_url,published_at,updated_at'),
    rows(url, key, 'wassce_public_lessons', 'id,topic_id,slug'),
    rows(url, key, 'topics', 'id,subject_id,slug'),
    rows(url, key, 'subjects', 'id,slug'),
  ])
  const byId = (list) => new Map(list.map((r) => [r.id, r]))
  const L = byId(lessons), T = byId(topics), S = byId(subjects)
  return videos.flatMap((v) => {
    const l = L.get(v.lesson_id), t = l && T.get(l.topic_id), s = t && S.get(t.subject_id)
    return s ? [{ page: `${SITE}/wassce/${s.slug}/${t.slug}/${l.slug}`, video: v }] : []
  })
}

export function videoSitemap(entries) {
  const urls = entries.map(({ page, video: v }) => `  <url>
    <loc>${esc(page)}</loc>
    <video:video>
      <video:thumbnail_loc>${esc(v.thumbnail_url)}</video:thumbnail_loc>
      <video:title>${esc(v.title)}</video:title>
      <video:description>${esc(v.description)}</video:description>
      <video:content_loc>${esc(`${SITE}/api/video?op=file&v=${v.id}`)}</video:content_loc>
      <video:duration>${Math.max(1, Math.round(Number(v.duration_s)))}</video:duration>
      <video:publication_date>${esc(v.published_at)}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
      <video:live>no</video:live>
    </video:video>
  </url>`)
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.join('\n')}
</urlset>
`
}

export async function writeVideoSitemap(clientDir, env = process.env) {
  const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL
  const key = env.VITE_SUPABASE_ANON_KEY
  let entries = []
  if (!url || !key) {
    console.log('[video-sitemap] no Supabase URL or publishable key: writing an empty video sitemap')
  } else {
    try {
      entries = await videoEntries(url, key)
    } catch (e) {
      console.warn(`[video-sitemap] WARNING: videos left out (${e instanceof Error ? e.message : e})`)
    }
  }
  fs.writeFileSync(path.join(clientDir, 'video-sitemap.xml'), videoSitemap(entries))
  console.log(`[video-sitemap] wrote ${entries.length} video(s)`)
}
