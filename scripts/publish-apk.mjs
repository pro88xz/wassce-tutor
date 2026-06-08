// Publishes the freshly-built APK to Supabase Storage.
// Run after `npm run apk` to make the new build available for download.

import { createClient } from '@supabase/supabase-js'
import { readFileSync, statSync } from 'node:fs'
import 'dotenv/config'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const APK_PATH = 'android/app/build/outputs/apk/release/app-release.apk'
const BUCKET = 'apk'
const REMOTE_FILENAME = 'wassce-tutor.apk'

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

try {
  statSync(APK_PATH)
} catch {
  console.error(`APK not found at ${APK_PATH}. Run 'npm run apk' first.`)
  process.exit(1)
}

const fileBuffer = readFileSync(APK_PATH)
const sizeMB = (fileBuffer.length / 1024 / 1024).toFixed(2)
console.log(`Uploading ${APK_PATH} (${sizeMB} MB) to Supabase...`)

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const { error } = await supabase.storage
  .from(BUCKET)
  .upload(REMOTE_FILENAME, fileBuffer, {
    contentType: 'application/vnd.android.package-archive',
    upsert: true,
  })

if (error) {
  console.error('Upload failed:', error.message)
  process.exit(1)
}

const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${REMOTE_FILENAME}`
console.log(`Upload complete.`)
console.log(`Public URL: ${publicUrl}`)
