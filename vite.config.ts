import path from "path"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import pkg from './package.json'
import { PUBLIC_PAGES, SITE } from './src/lib/seo'
import { publicPageList } from './scripts/public-page-list'

export default defineConfig(async ({ command, mode }) => {
  // Data-driven public pages (/wassce/...) to prerender, fetched from Supabase
  // at build time. Skipped for the dev server, which renders on demand.
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const dataPages = command === 'build' ? await publicPageList(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY) : []
  const fixedPages = Object.entries(PUBLIC_PAGES).map(([path, page]) => ({ path, lastmod: page.lastmod }))

  return {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    plugins: [
      tanstackStart({
        // Static output only (no server at runtime): public pages are
        // prerendered to HTML; everything else is a client-rendered SPA served
        // from the shell (see vercel.json rewrites and scripts/postbuild.mjs).
        spa: {
          enabled: true,
          // Rendered with a client-only route so the shell holds just the app
          // frame (not a prerendered page). "/" can't be used: it is already a
          // prerendered page, and Start renders each path once. Output: _shell.html
          maskPath: '/subjects',
        },
        prerender: {
          enabled: true,
          autoStaticPathsDiscovery: false, // only the pages listed below
          crawlLinks: false,
          autoSubfolderIndex: false, // /about -> about.html (vercel.json cleanUrls)
          failOnError: true,
        },
        pages: [...fixedPages, ...dataPages].map(({ path, lastmod }) => ({
          path,
          prerender: { enabled: true },
          sitemap: { lastmod },
        })),
        sitemap: { enabled: true, host: SITE.origin },
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    environments: {
      client: {
        build: {
          rollupOptions: {
            output: {
              // Long-lived vendor chunks only. Markdown/KaTeX and turndown are left to
              // automatic splitting so they load with the lesson, paper, tutor and
              // admin screens that use them, not on every page.
              manualChunks: (id: string) => {
                if (id.includes('node_modules')) {
                  if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
                  if (id.includes('@supabase')) return 'supabase'
                }
              },
            },
          },
        },
      },
    },
  }
})
