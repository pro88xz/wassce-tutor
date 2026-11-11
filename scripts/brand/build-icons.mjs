// Builds every icon the product ships from one drawing of the WASSCE Tutor
// mark, so the browser tab, the phone home screen, search results, the
// Android app and the site header can never drift apart again.
//
//   npm run brand:icons
//
// The mark: a "W" whose second half is a tick. White W stroke, green tick,
// on the brand's violet tile. The same geometry is drawn inline by
// src/components/BrandMark.tsx for the site header and footer: if you change
// the paths here, change them there, then run this script.
//
// Writes:
//   public/favicon.svg                 the tile, vector (browser tabs)
//   public/favicon-{16,32,48,192,512}.png
//   public/favicon.ico                 16, 32 and 48 px
//   public/apple-touch-icon.png        180 px, square (iOS rounds it)
//   assets/icon.png                    1024 px source for the Android app icon
//   assets/icon-foreground.png         adaptive-icon foreground (mark only)
//   assets/icon-background.png         adaptive-icon background (tile colour)
//   assets/favicon-source.png          512 px tile
//   assets/splash.png                  app launch screen
// After changing the assets/ files, run `npx capacitor-assets generate --android`
// to rebuild the Android resources from them.
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

// ---- The mark (64 x 64 grid) ----
const TILE_FROM = '#7a4cea'
const TILE_TO = '#4420a6'
const TICK = '#6ee7b7'
const W_PATH = 'M12.5 24.5 21.6 45 30.6 29.2'
const TICK_PATH = 'M30.6 29.2 39.6 45 52 18.5'
const STROKE = 6.6

const gradient = `<defs><linearGradient id="tile" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${TILE_FROM}"/><stop offset="1" stop-color="${TILE_TO}"/></linearGradient></defs>`

/** The W and its tick, optionally scaled about the centre of the grid. */
const glyph = (scale = 1) =>
  `<g fill="none" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round"${
    scale === 1 ? '' : ` transform="translate(32 32) scale(${scale}) translate(-32 -32)"`
  }><path d="${W_PATH}" stroke="#fff"/><path d="${TICK_PATH}" stroke="${TICK}"/></g>`

const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${body}</svg>\n`

/** Rounded tile: the favicon and anything shown on its own. */
const TILE = svg(`${gradient}<rect width="64" height="64" rx="15" fill="url(#tile)"/>${glyph()}`)
/** Square, full bleed: for platforms that apply their own mask (iOS, legacy Android). */
const SQUARE = svg(`${gradient}<rect width="64" height="64" fill="url(#tile)"/>${glyph(0.9)}`)
/** Android adaptive icon layers. The launcher crops to a circle or squircle, so the mark stays well inside. */
const FOREGROUND = svg(glyph(0.72))
const BACKGROUND = svg(`${gradient}<rect width="64" height="64" fill="url(#tile)"/>`)

const png = (source, size) => sharp(Buffer.from(source), { density: (72 * size) / 64 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer()

/** A .ico file holding PNG images (supported by every current browser). */
function ico(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = 6 + 16 * images.length
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)])
}

async function write(path, data) {
  const file = join(root, path)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, data)
  console.log(`  ${path}`)
}

console.log('WASSCE Tutor brand icons')
await write('public/favicon.svg', TILE)
for (const size of [16, 32, 48, 192, 512]) await write(`public/favicon-${size}.png`, await png(TILE, size))
await write('public/favicon.ico', ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(TILE, size) })))))
await write('public/apple-touch-icon.png', await sharp(await png(SQUARE, 180)).flatten({ background: TILE_TO }).png().toBuffer())

await write('assets/icon.png', await sharp(await png(SQUARE, 1024)).flatten({ background: TILE_TO }).png().toBuffer())
await write('assets/icon-foreground.png', await png(FOREGROUND, 1024))
await write('assets/icon-background.png', await sharp(await png(BACKGROUND, 1024)).flatten({ background: TILE_TO }).png().toBuffer())
await write('assets/favicon-source.png', await png(TILE, 512))

// Launch screen: the tile centred on the app's background colour (capacitor.config.ts).
const SPLASH = 2732
const TILE_ON_SPLASH = 440
await write(
  'assets/splash.png',
  await sharp({ create: { width: SPLASH, height: SPLASH, channels: 3, background: '#fafbff' } })
    .composite([{ input: await png(TILE, TILE_ON_SPLASH), left: (SPLASH - TILE_ON_SPLASH) / 2, top: (SPLASH - TILE_ON_SPLASH) / 2 }])
    .png({ compressionLevel: 9 })
    .toBuffer(),
)
console.log('Done. Next: npx capacitor-assets generate --android')
