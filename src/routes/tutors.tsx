import { createFileRoute, Outlet } from '@tanstack/react-router'

// /tutors is a layout: the page itself is tutors.index.tsx and each subject
// has tutors.$subject.tsx. Both show the approved-tutor marketplace
// (components/tutors/Marketplace) above the WhatsApp request form.
export const Route = createFileRoute('/tutors')({
  ssr: true, // the children are prerendered; a non-SSR parent would blank them
  component: Outlet,
})
