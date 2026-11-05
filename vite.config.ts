import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import pkg from './package.json'
import { seoPages } from './scripts/vite-plugin-seo-pages'

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    seoPages(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks only. Markdown/KaTeX and turndown are left to
        // automatic splitting so they load with the lesson, paper, tutor and
        // admin screens that use them, not on every page (grouping them here
        // pulled ~125 KB gzip into the first load).
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
            if (id.includes('@supabase')) return 'supabase'
          }
        },
      },
    },
  },
})
