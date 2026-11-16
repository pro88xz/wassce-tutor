// Recovering from a page that outlived the site version it was built for.
const RELOADED_KEY = 'wt_reloaded_after_error'

/** A page script that no longer exists: the site was updated after this page was opened (or cached). */
export const isStaleBuildError = (error: unknown) =>
  /dynamically imported module|Importing a module script failed|Unable to preload CSS|ChunkLoadError/i.test(
    String((error as Error | undefined)?.message ?? error ?? ''),
  )

/**
 * Loads the current version of the page, at most once a minute, so a real
 * fault cannot become a reload loop. Returns whether a reload was started.
 */
export function reloadOnce(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOADED_KEY) ?? 0)
    if (Date.now() - last < 60_000) return false
    sessionStorage.setItem(RELOADED_KEY, String(Date.now()))
  } catch {
    return false // no storage: cannot guard against a loop, so do not reload by itself
  }
  window.location.reload()
  return true
}
