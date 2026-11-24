// /api/video: protected lesson video playback, and subscribers' downloads. How it works, and its limits,
// are described at the top of api/_lib/video.js. One function for every step
// (start, playlist, key, a subscriber's download, and Google's crawler copy), chosen by ?op=.
import { db } from './_lib/server.js'
import { supabaseStore, tokenSecret, turnstileVerifier, videoHandler } from './_lib/video.js'

let handle
const handler = (request) => {
  handle ??= videoHandler({ store: supabaseStore(db()), secret: tokenSecret(), human: turnstileVerifier(process.env.TURNSTILE_SECRET_KEY) })
  return handle(request)
}

export const GET = handler
export const POST = handler
export const OPTIONS = handler
