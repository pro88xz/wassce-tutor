// Builds every logo file the product ships from the one drawing of the WASSCE Tutor wordmark
// (src/components/brand-geometry.ts), so the site header, the browser tab, the phone home screen,
// the Android app, search results and the logo uploaded to Google can never drift apart.
//
//   npm run brand:icons
//
// The logo is the name. Its one drawn detail is the "o" of Tutor: a shaded answer bubble, as on
// the WASSCE objective paper. The browser tab uses the same square logo, with the same space
// around the name as on the Google sign-in screen. (It used to be the initials, WT; the owner
// chose the full logo instead, and preferred this spacing to a larger, tighter name.)
//
// Writes:
//   public/favicon.svg, favicon-{16,32,48,192,512}.png, favicon.ico   the square logo (browser tabs, search results)
//   public/apple-touch-icon.png       180 px "WASSCE / TUTOR" square (iOS home screen)
//   public/logo.png                   512 px "WASSCE / TUTOR" square (search results, schema.org logo)
//   public/brand/*.svg                the wordmark and square as vector files
//   public/brand/email-logo.png       the wordmark on the email header band (shown at 190 x 20)
//   assets/google-logo-120.png        the 120 x 120 logo for Google Auth Platform → Branding
//   assets/icon.png                   1024 px source for the Android app icon
//   assets/icon-foreground.png        adaptive-icon foreground (the stacked name, inside the safe zone)
//   assets/icon-background.png        adaptive-icon background (tile colour)
//   assets/favicon-source.png         512 px favicon tile
//   assets/splash.png, splash-dark.png  app launch screen
// After changing the assets/ files, run `npx capacitor-assets generate --android`
// to rebuild the Android resources from them.
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { WORDMARK_LINE, WORDMARK_STACK } from '../../src/components/brand-geometry.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

// ---- Colours (src/index.css) ----
const TILE_FROM = '#7a4cea'
const TILE_TO = '#4420a6'
const INK = '#171c2b' // --foreground
const VIOLET = '#6438d8' // --primary
const LILAC = '#c4b1ff' // "Tutor" on dark surfaces
const CANVAS = '#fafbff' // capacitor.config.ts backgroundColor
const NIGHT = '#15102b'
const BAND = '#4720b5' // --brand-strong: the band at the top of every email

const gradient = `<defs><linearGradient id="tile" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${TILE_FROM}"/><stop offset="1" stop-color="${TILE_TO}"/></linearGradient></defs>`
const svg = (viewBox, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>\n`

/** The wordmark's four layers, coloured. */
const art = (g, { name, tutor, ring = tutor, shade = tutor }) =>
  `<path d="${g.wassce}" fill="${name}"/><path d="${g.tutor}" fill="${tutor}"/><path d="${g.ring}" fill="${ring}" fill-rule="evenodd"/><path d="${g.shade}" fill="${shade}"/>`

/** Places `g` centred in a `side` square, `width` wide (a share of the side). */
function place(g, side, width, colours) {
  const [x, y, w, h] = g.viewBox.split(' ').map(Number)
  const s = (side * width) / w
  const tx = (side - w * s) / 2 - x * s
  const ty = (side - h * s) / 2 - y * s
  return `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(5)})">${art(g, colours)}</g>`
}

// ---- The pieces ----
const ON_TILE = { name: '#fff', tutor: LILAC }
/** "WASSCE / TUTOR" on the violet square, full bleed: platforms that round the corners themselves. */
const SQUARE = svg('0 0 1000 1000', `${gradient}<rect width="1000" height="1000" fill="url(#tile)"/>${place(WORDMARK_STACK, 1000, 0.72, ON_TILE)}`)
/** The favicon: the square logo itself. */
const TAB = SQUARE
/** Android adaptive icon. The launcher crops to a circle of about 61% of the layer, so the name sits inside it. */
const FOREGROUND = svg('0 0 1000 1000', place(WORDMARK_STACK, 1000, 0.54, ON_TILE))
const BACKGROUND = svg('0 0 1000 1000', `${gradient}<rect width="1000" height="1000" fill="url(#tile)"/>`)
/** Vector files for anyone who needs the logo (press, partners, the share image). */
const LINE_LIGHT = svg(WORDMARK_LINE.viewBox, art(WORDMARK_LINE, { name: INK, tutor: VIOLET }))
const LINE_DARK = svg(WORDMARK_LINE.viewBox, art(WORDMARK_LINE, { name: '#fff', tutor: LILAC }))

const png = (source, size) => sharp(Buffer.from(source), { density: Math.max(72, (72 * size) / 64) }).resize(size, size).png({ compressionLevel: 9 }).toBuffer()
const opaque = async (source, size) => sharp(await png(source, size)).flatten({ background: TILE_TO }).png().toBuffer()

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

/** The one-line wordmark centred on a plain launch screen. */
async function splash(colours, background) {
  const SIDE = 2732
  const art = svg(`0 0 ${SIDE} ${SIDE}`, `<rect width="${SIDE}" height="${SIDE}" fill="${background}"/>${place(WORDMARK_LINE, SIDE, 0.36, colours)}`)
  return sharp(Buffer.from(art)).png({ compressionLevel: 9 }).toBuffer()
}

console.log('WASSCE Tutor logo files')
await write('public/favicon.svg', TAB)
for (const size of [16, 32, 48, 192, 512]) await write(`public/favicon-${size}.png`, await png(TAB, size))
await write('public/favicon.ico', ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(TAB, size) })))))
await write('public/apple-touch-icon.png', await opaque(SQUARE, 180))
await write('public/logo.png', await opaque(SQUARE, 512))
await write('public/brand/wordmark.svg', LINE_LIGHT)
await write('public/brand/wordmark-on-dark.svg', LINE_DARK)
await write('public/brand/logo-square.svg', SQUARE)
{
  // PNG, not SVG: most email apps do not show SVG. The band colour is baked in
  // so the logo stays readable when an email app switches to dark mode.
  const [x, y, w, h] = WORDMARK_LINE.viewBox.split(' ').map(Number)
  const art = svg(WORDMARK_LINE.viewBox, `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${BAND}"/>${LINE_DARK.replace(/^<svg[^>]*>|<\/svg>\n$/g, '')}`)
  await write('public/brand/email-logo.png', await sharp(Buffer.from(art), { density: 216 }).resize(570, 60, { fit: 'fill' }).png({ compressionLevel: 9 }).toBuffer())
}

await write('assets/google-logo-120.png', await opaque(SQUARE, 120))
await write('assets/icon.png', await opaque(SQUARE, 1024))
await write('assets/icon-foreground.png', await png(FOREGROUND, 1024))
await write('assets/icon-background.png', await opaque(BACKGROUND, 1024))
await write('assets/favicon-source.png', await png(TAB, 512))
await write('assets/splash.png', await splash({ name: INK, tutor: VIOLET }, CANVAS))
await write('assets/splash-dark.png', await splash({ name: '#fff', tutor: LILAC }, NIGHT))
console.log('Done. Next: npx capacitor-assets generate --android')
