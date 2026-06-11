declare const __APP_VERSION__: string

const MANIFEST_URL = 'https://cfclkwugbexrihloqofc.supabase.co/storage/v1/object/public/apk/version.json'

export type VersionManifest = {
  version: string
  apkUrl: string
  releaseNotes?: string
}

export function getInstalledVersion(): string {
  return __APP_VERSION__
}

export async function fetchLatestVersion(): Promise<VersionManifest | null> {
  try {
    const res = await fetch(MANIFEST_URL, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    if (!data.version || !data.apkUrl) return null
    return data as VersionManifest
  } catch {
    return null
  }
}

export function isNewerVersion(latest: string, installed: string): boolean {
  const l = latest.split('.').map(Number)
  const i = installed.split('.').map(Number)
  for (let j = 0; j < Math.max(l.length, i.length); j++) {
    const a = l[j] ?? 0
    const b = i[j] ?? 0
    if (a > b) return true
    if (a < b) return false
  }
  return false
}
