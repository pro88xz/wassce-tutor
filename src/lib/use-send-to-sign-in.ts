// Sending a signed-out visitor to sign in, and back where they were going
// afterwards (see src/lib/return-to.ts for how "next" and history work).
import { useCallback } from 'react'
import { useRouter } from '@tanstack/react-router'
import { signInHref, type SignInOptions } from '@/lib/return-to'

/**
 * Opens the sign-in page so that, after signing in, the visitor lands on
 * `next`, and "back" goes to the page before (normally the landing page).
 */
export function useSendToSignIn() {
  const router = useRouter()
  return useCallback((next: string | null, options: SignInOptions = {}) => {
    const href = signInHref(next, options)
    if (router.history.canGoBack()) {
      // The page that asked for an account is replaced by the sign-in page.
      void router.navigate({ href, replace: true })
    } else {
      // Arrived straight here (a shared link, a search result): put the
      // landing page underneath, so "back" goes there and not off the site.
      // Only the address of this entry changes (no navigation: a second
      // router navigation could finish after the first and win).
      window.history.replaceState(window.history.state, '', '/')
      void router.navigate({ href })
    }
  }, [router])
}
