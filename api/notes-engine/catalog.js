import { createClient } from '@supabase/supabase-js'
import crypto from 'node:crypto'

export const config = { maxDuration: 30 }
const json = (res, body, status = 200) => res.status(status).setHeader('Cache-Control','no-store').json(body)

function authorized(req) {
  const expected = process.env.CRON_SECRET || ''
  const header = req.headers.authorization || ''
  const supplied = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!expected || !supplied) return false
  const a = Buffer.from(expected), b = Buffer.from(supplied)
  return a.length === b.length && crypto.timingSafeEqual(a,b)
}

async function allRows(client, table, select) {
  const rows = []
  for (let offset = 0; ; offset += 500) {
    const {data,error} = await client.from(table).select(select).order('id').range(offset,offset+499)
    if (error) throw new Error(table+' read failed: '+error.message)
    rows.push(...(data||[]))
    if (!data || data.length < 500) return rows
  }
}

export default async function handler(req,res) {
  if (req.method !== 'GET') return json(res,{error:'Method not allowed'},405)
  if (!authorized(req)) return json(res,{error:'Unauthorised'},401)
  try {
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return json(res,{error:'Server-side Supabase credentials are not configured.'},503)
    const secret = key.startsWith('sb_secret_') || (()=>{try{return JSON.parse(Buffer.from(key.split('.')[1],'base64url').toString()).role==='service_role'}catch{return false}})()
    if (!secret) return json(res,{error:'Server-side Supabase secret key is invalid.'},503)
    const client = createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
    const [subjects,topics,lessons] = await Promise.all([
      allRows(client,'subjects','id,name,slug'),
      allRows(client,'topics','id,subject_id,slug,name,description,sort_order'),
      allRows(client,'lessons','id,topic_id'),
    ])
    const subjectById = new Map(subjects.map(s=>[s.id,s]))
    const counts = new Map()
    for (const lesson of lessons) counts.set(lesson.topic_id,(counts.get(lesson.topic_id)||0)+1)
    const gaps = topics.filter(t=>(counts.get(t.id)||0)===0)
      .map(t=>({...t,subject:subjectById.get(t.subject_id)}))
      .filter(t=>t.subject)
      .sort((a,b)=>a.subject.name.localeCompare(b.subject.name)||(a.sort_order??0)-(b.sort_order??0))
    return json(res,{ok:true,subjects:subjects.length,topics:topics.length,lessons:lessons.length,topics_without_lessons:gaps.length,gaps:gaps.slice(0,3)})
  } catch(error) {
    console.error('[notes-catalog] failed:',error)
    return json(res,{error:error instanceof Error?error.message:'Curriculum scan failed'},500)
  }
}
