// Width and height of every practice-question diagram (public/questions/**.svg),
// so the public question pages give each <img> its size and the page does not
// jump as diagrams load (Core Web Vitals: layout shift). Runs in `npm run build`
// before vite; the output is committed so the dev server has it too.
//
//   node scripts/questions/diagram-sizes.mjs   ->  src/content/question-diagram-sizes.json
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '../..')
const dir = path.join(root, 'public/questions')
const out = path.join(root, 'src/content/question-diagram-sizes.json')

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]))
const sizes = {}
for (const file of walk(dir).filter((f) => f.endsWith('.svg')).sort()) {
  const head = fs.readFileSync(file, 'utf8').slice(0, 2000)
  const svg = head.match(/<svg\b[^>]*>/)?.[0] ?? ''
  const num = (name) => Number(svg.match(new RegExp(`\\b${name}="([0-9.]+)(?:px)?"`))?.[1])
  let [w, h] = [num('width'), num('height')]
  if (!(w > 0 && h > 0)) {
    const box = svg.match(/viewBox="[-0-9.]+[ ,]+[-0-9.]+[ ,]+([0-9.]+)[ ,]+([0-9.]+)"/)
    if (box) [w, h] = [Number(box[1]), Number(box[2])]
  }
  if (!(w > 0 && h > 0)) {
    console.error(`[diagram-sizes] no width/height or viewBox in ${path.relative(root, file)}`)
    process.exit(1)
  }
  sizes['/' + path.relative(path.join(root, 'public'), file).split(path.sep).join('/')] = [Math.round(w), Math.round(h)]
}
const json = JSON.stringify(sizes, null, 1) + '\n'
if (!fs.existsSync(out) || fs.readFileSync(out, 'utf8') !== json) fs.writeFileSync(out, json)
console.log(`[diagram-sizes] ${Object.keys(sizes).length} question diagrams`)
