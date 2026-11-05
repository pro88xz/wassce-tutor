// Runs after `vite build` (see package.json "build").
//
// TanStack Start writes dist/client/_shell.html: the client-only app frame that
// vercel.json serves for every app screen (/subjects, /lesson/:id, /admin, ...).
// It is rendered from the /subjects route, so it carries that route's title.
// This script:
//   1. removes that title from the shell: each screen adds its own once it
//      loads, and a leftover static <title> would linger as a duplicate
//   2. writes dist/client/404.html from the shell, which Vercel serves with a
//      real 404 status for unknown URLs; the router then shows its not-found page
//
// The Android app (capacitor.config.ts webDir) uses dist/client as-is: it
// starts at the prerendered index.html, where the boot script in __root.tsx
// hides the marketing page behind a spinner until the app has routed.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const client = path.join(root, 'dist/client')
const shellPath = path.join(client, '_shell.html')

if (!fs.existsSync(shellPath)) {
  console.error('[postbuild] dist/client/_shell.html not found: did the TanStack Start SPA shell prerender run?')
  process.exit(1)
}

const TITLE_RE = /<title>[^<]*<\/title>/
const ROBOTS_RE = /<meta name="robots" content="[^"]*"\/>/
const shell = fs.readFileSync(shellPath, 'utf8')
if (!TITLE_RE.test(shell) || !ROBOTS_RE.test(shell)) {
  console.error('[postbuild] shell is missing its <title> or robots meta; check the /subjects route head')
  process.exit(1)
}

const neutralShell = shell.replace(TITLE_RE, '')
fs.writeFileSync(shellPath, neutralShell)

// Unknown URLs: the client renders the catch-all route (src/routes/$.tsx),
// which sets the "Page not found" title.
const notFound = neutralShell.replace(ROBOTS_RE, '<meta name="robots" content="noindex"/>')
fs.writeFileSync(path.join(client, '404.html'), notFound)

console.log('[postbuild] updated _shell.html and wrote 404.html')
