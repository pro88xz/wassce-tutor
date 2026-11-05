import { createFileRoute } from '@tanstack/react-router'
import { NotFoundPage } from '@/components/NotFoundPage'

// Catch-all for unknown URLs. As a client-only route (Start's defaultSsr: false)
// it hydrates from the app shell like every other app screen; a root-level
// not-found would render differently from the shell and cause a hydration
// mismatch on 404.html.
export const Route = createFileRoute('/$')({
  component: NotFoundPage,
})
