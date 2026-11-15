// Sending a signed-out visitor to sign in, and back where they were going
// afterwards (see src/lib/return-to.ts for how "next" and history work).
import { useCallback, type ReactNode } from 'react'
import { useRouter, useRouterState } from '@tanstack/react-router'
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

/**
 * A "Sign in" / "Create a free account" link that returns to `next` (by
 * default, the page it is on). A real link, so it works before the app has
 * loaded and when opened in a new tab.
 */
export function SignInLink({
  next,
  children,
  className,
  options,
  onClick,
}: {
  /** Where to land after signing in. Omit for the current page; null for the home screen. */
  next?: string | null
  children: ReactNode
  className?: string
  options?: SignInOptions
  onClick?: () => void
}) {
  const location = useRouterState({ select: (s) => s.location })
  const here = location.pathname === '/' ? null : `${location.pathname}${location.searchStr ?? ''}`
  const target = next === undefined ? here : next
  const send = useSendToSignIn()
  return (
    <a
      href={signInHref(target, options)}
      className={className}
      onClick={(e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        onClick?.()
        send(target, options)
      }}
    >
      {children}
    </a>
  )
}
