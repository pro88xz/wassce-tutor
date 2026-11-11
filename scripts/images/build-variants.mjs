// Makes the smaller copies of the subject and topic photographs that phones
// download. Run after adding or replacing a photo:  node scripts/images/build-variants.mjs
//
//   public/img/subjects/<name>.webp  (1280 px)  ->  <name>-400.webp
//   public/img/topics/<name>.webp    (960 px)   ->  <name>-640.webp
//
// The 640 px subject copies and 480 px topic copies are made when a photo is
// first added; this script only fills in the sizes between. Existing files
// are left alone unless --force is given.
import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const force = process.argv.includes('--force')
const JOBS = [
  { dir: 'public/img/subjects', width: 400 },
  { dir: 'public/img/topics', width: 640 },
]

for (const { dir, width } of JOBS) {
  const originals = (await readdir(dir)).filter((f) => f.endsWith('.webp') && !/-\d+\.webp$/.test(f))
  for (const file of originals) {
    const out = join(dir, file.replace(/\.webp$/, `-${width}.webp`))
    if (!force && (await stat(out).catch(() => null))) continue
    await sharp(join(dir, file)).resize({ width, withoutEnlargement: true }).webp({ quality: 72, effort: 6 }).toFile(out)
    console.log(`${out}  ${Math.round((await stat(out)).size / 1024)} KB`)
  }
}
