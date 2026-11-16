import { useEffect } from 'react'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { isStaleBuildError, reloadOnce } from '@/lib/reload'

// The router's error screen for every route. Replaces the library's bare
// "Something went wrong! Show Error", which Google once indexed as the
// homepage's description. No noindex tag here on purpose: if Google's renderer
// ever hits an error on an important page, a poor description is far better
// than that page being dropped from search.
export function ErrorPage({ error }: ErrorComponentProps) {
  useEffect(() => {
    console.error(error)
    if (isStaleBuildError(error)) reloadOnce()
  }, [error])

  return (
    <div className="mx-auto max-w-3xl space-y-4 pt-12 pb-12 text-center">
      <h1 className="text-4xl font-bold tracking-tight">This page did not load</h1>
      <p className="text-muted-foreground">
        It is usually a weak connection, or the site was updated while this page was open. Reloading fixes it.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex min-h-11 py-2 items-center rounded-md bg-primary px-6 font-semibold text-primary-foreground"
        >
          Reload the page
        </button>
        <a href="/" className="inline-flex min-h-11 py-2 items-center rounded-md border px-6 font-semibold">
          Go to the homepage
        </a>
      </div>
    </div>
  )
}
