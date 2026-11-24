// Counts the site's Vercel Functions and stops the build when there are more
// than the plan allows, so the reason shows at the top of the build log.
//
// Every file under api/ is one function, except files and folders whose names
// start with "_" or "." (shared code such as api/_lib). On the Hobby plan
// Vercel accepts at most 12 functions in a deployment and refuses a deployment
// with more after it has been built, which is easy to miss: on 24 November 2026
// a 13th function (api/tutor-request.js) stopped every deployment until
// api/email/admin.js was folded into api/email/run.js.
//
// Room for a new function: fold it into a related one (as /api/email/run?admin
// does), or move the project to the Pro plan and raise LIMIT.
// Run: node scripts/check-functions.mjs (the first step of npm run build).
import fs from 'node:fs'
import path from 'node:path'

const LIMIT = 12
const api = path.resolve(import.meta.dirname, '..', 'api')

function functions(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (/^[_.]/.test(entry.name)) return []
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return functions(full)
    return /\.(js|mjs|cjs|ts|mts|cts)$/.test(entry.name) ? [path.relative(path.dirname(api), full)] : []
  })
}

const found = functions(api).sort()
if (found.length > LIMIT) {
  console.error(`[check-functions] ${found.length} Vercel Functions, but the Hobby plan deploys at most ${LIMIT}:\n  ${found.join('\n  ')}`)
  console.error('[check-functions] Fold one into a related function (see the top of this script), or raise LIMIT after moving to the Pro plan.')
  process.exit(1)
}
console.log(`[check-functions] ${found.length} of ${LIMIT} Vercel Functions`)
