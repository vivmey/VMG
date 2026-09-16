/**
 * patch-images.ts
 * ===============
 * Pour chaque article MDX sans champ `image` dans le frontmatter,
 * extrait la première URL d'image trouvée dans le contenu et l'ajoute.
 *
 * Usage:
 *   npx tsx scripts/patch-images.ts
 *   npx tsx scripts/patch-images.ts --dry-run
 */

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const POSTS_DIR = path.resolve(__dirname, '..', 'content', 'posts')
const DRY_RUN = process.argv.includes('--dry-run')

function walk(dir: string): string[] {
  const results: string[] = []
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name)
    if (item.isDirectory()) results.push(...walk(full))
    else if (item.name.endsWith('.mdx')) results.push(full)
  }
  return results
}

/**
 * Extrait la première URL d'image du contenu markdown.
 * Supporte :
 *   [![alt](imgUrl)](link)
 *   ![alt](imgUrl)
 *   <img src="imgUrl" ...>
 */
function extractFirstImage(content: string): string | null {
  // Pattern 1: [![...](url)](link) — image cliquable Blogspot
  const linked = content.match(/\[!\[.*?\]\((https?:\/\/[^)]+)\)\]/)
  if (linked) return linked[1]

  // Pattern 2: ![alt](url)
  const plain = content.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/)
  if (plain) return plain[1]

  // Pattern 3: <img src="url"
  const img = content.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/)
  if (img) return img[1]

  return null
}

async function main() {
  if (DRY_RUN) console.log('[dry-run] Aucune écriture.\n')

  const files = walk(POSTS_DIR)
  let patched = 0
  let skipped = 0
  let noImage = 0

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8')
    const { data, content } = matter(raw)

    if (data.image) {
      skipped++
      continue
    }

    const imageUrl = extractFirstImage(content)
    if (!imageUrl) {
      noImage++
      console.log(`  [no-image] ${path.relative(POSTS_DIR, file)}`)
      continue
    }

    data.image = imageUrl
    const updated = matter.stringify('\n' + content.trimStart(), data)

    console.log(`  [patch] ${path.relative(POSTS_DIR, file)}`)
    console.log(`         → ${imageUrl.slice(0, 80)}...`)

    if (!DRY_RUN) {
      fs.writeFileSync(file, updated, 'utf-8')
    }
    patched++
  }

  console.log(`\nTerminé : ${patched} patchés, ${skipped} avaient déjà une image, ${noImage} sans image.`)
}

main().catch(e => { console.error(e); process.exit(1) })
