/**
 * Sync nouveaux articles Blogspot → MDX
 * ========================================
 * Importe les articles publiés sur voisinsmoulingalant.blogspot.com non encore présents
 * dans content/posts/ (déduplication par slug + fallback Levenshtein).
 *
 * Usage:
 *   npx tsx scripts/sync-blogspot.ts
 *   npx tsx scripts/sync-blogspot.ts --dry-run
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import matter from 'gray-matter'
import slugify from 'slugify'
import TurndownService from 'turndown'
import type { VmgCategory } from '../lib/types'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '..')
const POSTS_DIR = path.join(ROOT, 'content', 'posts')
const BLOGSPOT_FEED = 'https://voisinsmoulingalant.blogspot.com/feeds/posts/default?alt=json&max-results=50'
const AUTHOR = 'Voisins Moulin Galant'

const VMG_CATEGORIES: VmgCategory[] = [
  'actualites',
  'evenements',
  'aide-alimentaire',
  'friperie',
  'mobilisation',
  'vie-asso',
  'communique',
  'galerie',
]

const CATEGORY_MAP: Record<string, VmgCategory> = {
  // Ajouter les labels Blogspot ici au fur et à mesure
  'aide alimentaire': 'aide-alimentaire',
  'aide-alimentaire': 'aide-alimentaire',
  alimentaire: 'aide-alimentaire',
  friperie: 'friperie',
  événements: 'evenements',
  evenements: 'evenements',
  événement: 'evenements',
  mobilisation: 'mobilisation',
  'vie asso': 'vie-asso',
  'vie-asso': 'vie-asso',
  'communiqué': 'communique',
  communique: 'communique',
  galerie: 'galerie',
  actualites: 'actualites',
  actualité: 'actualites',
}

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)])
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

function toSlug(str: string): string {
  return slugify(str, { lower: true, strict: true, locale: 'fr' }).slice(0, 80)
}

function mapCategory(blogspotLabels: string[]): VmgCategory {
  for (const label of blogspotLabels) {
    const normalized = label.toLowerCase().trim()
    if (CATEGORY_MAP[normalized]) return CATEGORY_MAP[normalized]
  }
  return 'actualites'
}

function extractBlogspotSlug(url: string): string {
  const m = url.match(/\/(\d{4})\/(\d{2})\/([^.]+)\.html/)
  if (m) return m[3]
  return ''
}

// ---------------------------------------------------------------------------
// Collect existing slugs
// ---------------------------------------------------------------------------

function collectExistingSlugs(): Set<string> {
  const slugs = new Set<string>()
  if (!existsSync(POSTS_DIR)) return slugs

  function walk(dir: string) {
    const items = readdirSync(dir, { withFileTypes: true })
    for (const item of items) {
      const full = path.join(dir, item.name)
      if (item.isDirectory()) {
        walk(full)
      } else if (item.name.endsWith('.mdx')) {
        const base = path.basename(item.name, '.mdx')
        // strip leading date YYYY-MM-DD-
        const slug = base.replace(/^\d{4}-\d{2}-\d{2}-/, '')
        slugs.add(slug)

        // also read title for Levenshtein fallback
        try {
          const src = readFileSync(full, 'utf-8')
          const { data } = matter(src)
          if (data.title) slugs.add(toSlug(data.title))
        } catch {}
      }
    }
  }
  walk(POSTS_DIR)
  return slugs
}

// ---------------------------------------------------------------------------
// Blogspot feed fetch (with pagination)
// ---------------------------------------------------------------------------

interface BlogspotEntry {
  title: { $t: string }
  published: { $t: string }
  content?: { $t: string }
  summary?: { $t: string }
  category?: { term: string }[]
  link?: { rel: string; href: string }[]
}

async function fetchAllEntries(): Promise<BlogspotEntry[]> {
  const all: BlogspotEntry[] = []
  let startIndex = 1
  const pageSize = 50

  while (true) {
    const url = `${BLOGSPOT_FEED}&start-index=${startIndex}`
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`HTTP ${res.status} fetching ${url}`)
      break
    }
    const json = (await res.json()) as { feed?: { entry?: BlogspotEntry[] } }
    const entries = json.feed?.entry ?? []
    if (entries.length === 0) break
    all.push(...entries)
    if (entries.length < pageSize) break
    startIndex += pageSize
  }

  return all
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  if (dryRun) console.log('[dry-run] Aucune écriture ne sera effectuée.\n')

  console.log('Collecte des slugs existants...')
  const existingSlugs = collectExistingSlugs()
  console.log(`  ${existingSlugs.size} slugs existants trouvés.`)

  console.log('Récupération du feed Blogspot...')
  const entries = await fetchAllEntries()
  console.log(`  ${entries.length} articles dans le feed.`)

  let imported = 0
  let skipped = 0

  for (const entry of entries) {
    const title = entry.title?.$t ?? 'Sans titre'
    const publishedRaw = entry.published?.$t ?? new Date().toISOString()
    const publishedAt = publishedRaw.replace(/\.\d{3}[+-]\d{2}:\d{2}$/, 'Z').split('T')[0] + 'T00:00:00Z'
    const htmlContent = entry.content?.$t ?? entry.summary?.$t ?? ''
    const labels = (entry.category ?? []).map((c) => c.term)
    const originalLink = (entry.link ?? []).find((l) => l.rel === 'alternate')?.href ?? ''

    const blogspotSlug = extractBlogspotSlug(originalLink)
    const titleSlug = toSlug(title)
    const slug = blogspotSlug || titleSlug

    // Déduplication
    if (existingSlugs.has(slug) || existingSlugs.has(titleSlug)) {
      skipped++
      continue
    }

    // Fallback Levenshtein < 5 sur titre
    let nearMatch = false
    for (const existing of existingSlugs) {
      if (levenshtein(titleSlug, existing) < 5) {
        nearMatch = true
        break
      }
    }
    if (nearMatch) {
      console.log(`  [skip/near] ${title}`)
      skipped++
      continue
    }

    // Conversion HTML → MDX
    const mdxContent = td.turndown(htmlContent).trim()

    // Catégorie
    const category = mapCategory(labels)

    // Date
    const dateOnly = publishedRaw.slice(0, 10)

    // Description (première phrase du contenu texte brut, max 160 chars)
    const plainText = mdxContent.replace(/[#*`[\]]/g, '').trim()
    const description = plainText.slice(0, 160).replace(/\n.*/s, '').trim() || title

    // Frontmatter
    const frontmatter = {
      title,
      description,
      publishedAt: publishedAt,
      author: AUTHOR,
      category,
      tags: labels,
      originalUrl: originalLink || undefined,
      draft: false,
    }

    const fileContent = matter.stringify('\n' + mdxContent, frontmatter)
    const filename = `${dateOnly}-${toSlug(title)}.mdx`
    const targetDir = path.join(POSTS_DIR, category)
    const targetPath = path.join(targetDir, filename)

    console.log(`  [import] ${filename} (${category})`)

    if (!dryRun) {
      await fs.mkdir(targetDir, { recursive: true })
      await fs.writeFile(targetPath, fileContent, 'utf-8')
      existingSlugs.add(slug)
      existingSlugs.add(titleSlug)
    }
    imported++
  }

  console.log(`\nTerminé : ${imported} importé(s), ${skipped} ignoré(s).`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
