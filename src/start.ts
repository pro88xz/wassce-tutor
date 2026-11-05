import { createStart } from '@tanstack/react-start'

// Every route renders in the browser only (exactly like the old SPA) unless it
// sets `ssr: true`. Only the public, indexable pages opt in; they are
// prerendered to static HTML at build time (see vite.config.ts).
export const startInstance = createStart(() => ({
  defaultSsr: false,
}))
