import { createFileRoute, redirect } from '@tanstack/react-router'

// The profile screen became the Account centre. Old links and bookmarks land there.
export const Route = createFileRoute('/profile')({
  beforeLoad: () => {
    throw redirect({ to: '/account', replace: true })
  },
})
