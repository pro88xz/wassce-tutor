import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'

export const config = { maxDuration: 30, api: { bodyParser: { sizeLimit: '2mb' } } }

const ALLOWED_HOSTS = new Set(['openstax.org','www.openstax.org','en.wikibooks.org','www.wikibooks.org','siyavula.com','www.siyavula.com','libretexts.org','chem.libretexts.org','bio.libretexts.org','phys.libretexts.org','pressbooks.pub','opentextbc.ca','open.umn.edu','oercommons.org','www.oercommons.org'])
const isApprovedHost = hostname => ALLOWED_HOSTS.has(hostname) || hostname === 'libretexts.org' || hostname.endsWith('.libretexts.org')
const ALLOWED_LICENSES = new Set(['CC-BY-4.0','CC-BY-SA-4.0','CC0-1.0','PUBLIC-DOMAIN'])
const json = (res, body, status = 200) => res.status(status).setHeader('Cache-Control','no-store').json(body)
const countWords = (s) => (String(s).match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length

function authorized(req) {
  const expected = process.env.CRON_SECRET || ''
  const header = req.headers.authorization || ''
  const supplied = header.startsWith('Bearer ') ? header.slice(7) : req.headers['x-cron-secret'] || ''
  if (!expected || !supplied) return false
  const a = Buffer.from(String(expected)), b = Buffer.from(String(supplied))
  return a.length === b.length && crypto.timingSafeEqual(a,b)
}

function validateLesson(item) {
  if (!item || typeof item !== 'object') throw new Error('Invalid lesson payload.')
  if (typeof item.topic_id !== 'string' || !item.topic_id) throw new Error('topic_id is required.')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug || '')) throw new Error('Invalid lesson slug.')
  if (typeof item.title !== 'string' || item.title.length < 5 || item.title.length > 180) throw new Error('Invalid lesson title.')
  if (typeof item.content !== 'string' || item.content.length > 90000 || countWords(item.content) < 500) throw new Error('Lesson content must contain at least 500 words and remain below 90,000 characters.')
  if (!/^#\s+.+/m.test(item.content) || !/^##\s+Learning objectives\s*$/im.test(item.content) || !/^##\s+WASSCE examination focus\s*$/im.test(item.content) || !/^##\s+Sources and reuse licences\s*$/im.test(item.content)) throw new Error('Lesson is missing required teaching or attribution sections.')
  if (/<\s*script\b|javascript:|\bon\w+\s*=/i.test(item.content)) throw new Error('Active HTML or script content is not allowed.')
  if (!Array.isArray(item.sources) || item.sources.length < 1 || item.sources.length > 2) throw new Error('One or two source records are required.')
  for (const source of item.sources) {
    let url
    try { url = new URL(source.url) } catch { throw new Error('Invalid source URL.') }
    if (url.protocol !== 'https:' || !isApprovedHost(url.hostname)) throw new Error('Source host is not on the approved open-education allowlist.')
    if (!ALLOWED_LICENSES.has(source.license)) throw new Error('Source licence is not approved.')
    if (typeof source.license_evidence !== 'string' || source.license_evidence.length < 5) throw new Error('Visible source licence evidence is required.')
    if (source.license === 'CC-BY-SA-4.0' && !/share.?alike|cc by-sa/i.test(source.license_evidence)) throw new Error('CC BY-SA evidence does not match its declared licence.')
    if (source.license === 'CC-BY-4.0' && !/(?:attribution.*4\.0|cc by 4\.0)/i.test(source.license_evidence)) throw new Error('CC BY evidence does not match its declared licence.')
    if (typeof source.title !== 'string' || !source.title.trim() || !item.content.includes(source.url)) throw new Error('Source attribution is incomplete.')
    if (source.license === 'CC-BY-SA-4.0' && !/ShareAlike/i.test(item.content)) throw new Error('ShareAlike attribution notice is missing.')
  }
}

export default async function handler(req,res) {
  if (req.method !== 'POST') return json(res,{error:'Method not allowed'},405)
  if (!authorized(req)) return json(res,{error:'Unauthorised'},401)
  const lessons = req.body?.lessons
  if (!Array.isArray(lessons) || lessons.length < 1 || lessons.length > 3) return json(res,{error:'Submit between one and three lessons per acquisition run.'},400)
  try {
    lessons.forEach(validateLesson)
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return json(res,{error:'Server-side Supabase credentials are not configured.'},503)
    const keyIsSecret = key.startsWith('sb_secret_') || (() => { try { return JSON.parse(Buffer.from(key.split('.')[1],'base64url').toString()).role === 'service_role' } catch { return false } })()
    if (!keyIsSecret) return json(res,{error:'Server-side Supabase secret key is invalid.'},503)
    const client = createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
    const ids = [...new Set(lessons.map(x=>x.topic_id))]
    const {data:topics,error:topicError} = await client.from('topics').select('id,name,slug,subject_id').in('id',ids)
    if (topicError) throw new Error('Curriculum verification failed: '+topicError.message)
    if ((topics || []).length !== ids.length) throw new Error('One or more topic IDs do not exist in the live curriculum.')
    const {data:existing,error:existingError} = await client.from('lessons').select('topic_id').in('topic_id',ids)
    if (existingError) throw new Error('Existing lesson check failed: '+existingError.message)
    const occupied = new Set((existing || []).map(x=>x.topic_id))
    const results = []
    for (const item of lessons) {
      const topic = topics.find(x=>x.id===item.topic_id)
      if (!topic || topic.slug + '-open-study-notes' !== item.slug) throw new Error('Lesson slug does not match the live curriculum topic.')
      if (occupied.has(item.topic_id)) {
        results.push({status:'skipped',topic:topic.name,reason:'Topic already has lesson content.'})
        continue
      }
      const {data,error} = await client.from('lessons').insert({
        topic_id:topic.id,
        slug:item.slug,
        title:item.title,
        content:item.content,
        est_minutes:Math.max(8,Math.min(45,Number(item.est_minutes)||15)),
        sort_order:0,
        is_published:true,
        is_public:false,
        reviewed_at:null,
        reviewed_by:null,
      }).select('id').single()
      if (error) {
        if (error.code==='23505') { results.push({status:'skipped',topic:topic.name,reason:'Concurrent insert prevented duplicate.'}); occupied.add(topic.id); continue }
        throw new Error('Supabase insert failed for '+topic.name+': '+error.message)
      }
      occupied.add(topic.id)
      results.push({status:'created',topic:topic.name,lesson_id:data.id,word_count:countWords(item.content),sources:item.sources.map(s=>({title:s.title,url:s.url,license:s.license}))})
    }
    return json(res,{ok:true,submitted:lessons.length,created:results.filter(x=>x.status==='created').length,results})
  } catch(error) {
    console.error('[notes-ingest] rejected:',error)
    return json(res,{error:error instanceof Error?error.message:'Ingestion failed'},400)
  }
}
