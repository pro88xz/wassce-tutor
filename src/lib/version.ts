declare const __APP_VERSION__: string

const MANIFEST_URL = 'https://cfclkwugbexrihloqofc.supabase.co/storage/v1/object/public/apk/version.json'

export type VersionManifest = {
  version: string
  apkUrl: string
  releaseNotes?: string
}

const TRUSTED_DOWNLOAD_HOSTS = [new URL(MANIFEST_URL).hostname, 'wasscetutor.com']

/** An https address on our own storage or site: the only places an app update may come from. */
export function isTrustedDownload(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' && TRUSTED_DOWNLOAD_HOSTS.includes(u.hostname)
  } catch {
    return false
  }
}

export function getInstalledVersion(): string {
  return __APP_VERSION__
}

export async function fetchLatestVersion(): Promise<VersionManifest | null> {
  try {
    const res = await fetch(MANIFEST_URL, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    if (typeof data.version !== 'string' || typeof data.apkUrl !== 'string') return null
    // The update button opens this address: accept it only from our own storage or site.
    if (!isTrustedDownload(data.apkUrl)) return null
    return { version: data.version, apkUrl: data.apkUrl, releaseNotes: typeof data.releaseNotes === 'string' ? data.releaseNotes : undefined }
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
