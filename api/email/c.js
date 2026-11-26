// GET /api/email/c?j=<job>&l=<link key>&s=<signature>
// Records a click on a link in an engine email, then sends the student on to
// the page the email pointed at. Destinations come from the stored job, never
// from the URL, so this cannot be used to redirect anyone to another site.
//
// Also serves the app tracking links, /go/<app> (rewritten here with ?app=),
// which count a click and open the app on Google Play: see api/_lib/go.js.
// They share this function because the plan allows 12 (scripts/check-functions.mjs).
import { loadEmailConfig } from '../_lib/email/config.js'
import { withUtm } from '../_lib/email/engine.js'
import { safePath, verifyClick } from '../_lib/email/tokens.js'
import { db } from '../_lib/server.js'
import { appLink, isAppLink } from '../_lib/go.js'

const go = (location) => new Response(null, { status: 302, headers: { Location: location, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } })

export async function GET(request) {
  if (isAppLink(request)) return appLink(request)
  const client = db()
  const env = await loadEmailConfig(client)
  const q = new URL(request.url).searchParams
  const jobId = q.get('j') ?? ''
  const key = q.get('l') ?? ''
  if (!verifyClick(env.tokenSecret, jobId, key, q.get('s') ?? '')) return go(`${env.site}/`)

  const { data: job } = await client.from('email_send_jobs').select('id, user_id, programme, payload').eq('id', jobId).maybeSingle()
  const path = safePath(job?.payload?.links?.[key])
  if (!job || !path) return go(`${env.site}/`)

  const { error } = await client.from('email_click_events').insert({ job_id: job.id, user_id: job.user_id, link_key: key, destination_path: path })
  if (error) console.error(`[email] click not recorded: ${error.message}`)
  return go(withUtm(env.site, path, job.programme))
}

/** Link checkers and previews send HEAD to app tracking links: answer them without counting. */
export function HEAD(request) {
  return isAppLink(request) ? appLink(request) : new Response(null, { status: 405, headers: { Allow: 'GET' } })
}
