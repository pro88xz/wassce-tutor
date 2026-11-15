// Profile photos for tutor cards. Phone cameras take 3-12 MB photos; a tutor
// card needs about 100 KB. shrinkPhoto() makes the photo smaller on the phone
// before upload, so it costs the tutor little data to send and every student
// little data to see.

export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
/** The most a photo may weigh once it is uploaded (the shrunk photo). */
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024
/** The most a photo straight from the camera may weigh before shrinking. */
export const PHOTO_MAX_ORIGINAL = 25 * 1024 * 1024
const PHOTO_EDGE = 800

/** Why a file cannot be a profile photo, or null if it can. */
export function photoProblem(file: File): string | null {
  if (!PHOTO_TYPES.includes(file.type)) return 'Choose a JPG, PNG or WebP photo.'
  if (file.size > PHOTO_MAX_BYTES) return 'That photo is larger than 5 MB. Choose a smaller one.'
  return null
}

/** The photo at most 800 pixels on its longest side, as a JPEG; the original if that fails or is no smaller. */
export async function shrinkPhoto(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const scale = Math.min(1, PHOTO_EDGE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.fillStyle = '#ffffff' // a see-through PNG gets a white background, not black
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '') || 'photo'}.jpg`, { type: 'image/jpeg' })
  } catch {
    return file
  }
}
