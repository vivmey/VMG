/**
 * Auto-content VMG via Claude API
 * ===============================
 * Génère un article MDX en draft (validation humaine = merge PR).
 *
 * Usage :
 *   npm run generate-article
 *   npm run generate-article -- --topic="Friperie hiver"
 *   npm run generate-article -- --topic="..." --model=claude-opus-4-7
 *
 * Variables d'env requises :
 *   ANTHROPIC_API_KEY (obligatoire)
 *   CLAUDE_MODEL (optionnel, défaut = claude-sonnet-4-6)
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { existsSync } from 'node:fs'
import Anthropic from '@anthropic-ai/sdk'
import slugify from 'slugify'
import matter from 'gray-matter'
import { siteConfig } from '../config/site.config'
import type { VmgCategory } from '../lib/types'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '..')
const POSTS_DIR = path.join(ROOT, 'content', 'posts')

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

const DEFAULT_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6'

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

interface CliOpts {
  topic?: string
  model: string
}

function parseArgs(): CliOpts {
  const opts: CliOpts = { model: DEFAULT_MODEL }
  for (const a of process.argv.slice(2)) {
    if (a.startsWith('--topic=')) opts.topic = a.slice('--topic='.length)
    else if (a.startsWith('--model=')) opts.model = a.slice('--model='.length)
  }
  return opts
}

function pickRandomKeyword(): string {
  const kws = siteConfig.seo.keywords
  return kws[Math.floor(Math.random() * kws.length)].term
}

// ---------------------------------------------------------------------------
// Few-shot examples : 3 articles récents pour cadrer le ton VMG
// ---------------------------------------------------------------------------

async function loadRecentArticles(limit = 3): Promise<Array<{ title: string; description: string; category: string; excerpt: string }>> {
  const examples: Array<{ title: string; description: string; category: string; excerpt: string }> = []

  async function walk(dir: string) {
    if (!existsSync(dir)) return
    const items = await fs.readdir(dir, { withFileTypes: true })
    for (const item of items) {
      if (examples.length >= limit) return
      const p = path.join(dir, item.name)
      if (item.isDirectory()) await walk(p)
      else if (item.name.endsWith('.mdx')) {
        const content = await fs.readFile(p, 'utf-8')
        const parsed = matter(content)
        if (parsed.data.draft) continue
        const excerpt = parsed.content
          .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
          .replace(/\[([^\]]*)\]\([^)]+\)/g, '$1')
          .replace(/[#*_>`]/g, '')
          .trim()
          .slice(0, 400)
        examples.push({
          title: parsed.data.title,
          description: parsed.data.description,
          category: parsed.data.category,
          excerpt,
        })
      }
    }
  }

  await walk(POSTS_DIR)
  return examples
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

function buildSystemPrompt(): string {
  return `Tu es journaliste local pour l'asso "${siteConfig.organization.legalName}", à ${siteConfig.organization.address.locality} (${siteConfig.organization.address.postalCode}).

Mission : rédiger un article de blog clair, factuel, chaleureux, ancré dans le quartier Moulin Galant, à destination des habitants, familles et bénévoles.

Lignes éditoriales obligatoires :
- Ton local, factuel, événementiel — JAMAIS jargon SEO B2B, JAMAIS keyword stuffing
- Public cible : habitants du quartier, familles, bénévoles, sympathisants
- Pas de promesses commerciales, pas de claims non vérifiables, pas de ton corporate
- Pas d'anglicismes inutiles
- Phrases courtes, paragraphes courts (3-5 lignes max)
- Sous-titres H2/H3 explicites

Format de sortie strict (un seul bloc JSON, rien d'autre) :
{
  "title": "Titre court (max 70 caractères)",
  "description": "Résumé d'une ligne (max 160 caractères)",
  "category": "<une des catégories : ${VMG_CATEGORIES.join(', ')}>",
  "keywords": ["mot-clé local 1", "mot-clé local 2", "..."],
  "content": "<contenu MDX, 600-1500 mots, sous-titres H2 ##, H3 ###, paragraphes courts. Composants MDX disponibles : <Petition url=\\"...\\" title=\\"...\\" />, <Callout type=\\"info|warning\\">...</Callout>, <EventDate date=\\"YYYY-MM-DD\\" />>"
}

Aucun préfixe ni suffixe, aucun bloc markdown, aucun \`\`\`json — juste le JSON brut.`
}

function buildUserPrompt(topic: string, examples: Array<{ title: string; description: string; category: string; excerpt: string }>): string {
  const exampleStr = examples
    .map(
      (e, i) =>
        `Exemple ${i + 1} :\n  Titre : ${e.title}\n  Description : ${e.description}\n  Catégorie : ${e.category}\n  Extrait : ${e.excerpt}…`,
    )
    .join('\n\n')

  return `Sujet à traiter : ${topic}

Voici 3 articles récents de l'asso pour calibrer ton ton et ton vocabulaire :

${exampleStr}

Rédige maintenant un nouvel article sur le sujet "${topic}". Respecte strictement le format JSON demandé dans le prompt système.`
}

// ---------------------------------------------------------------------------
// Frontmatter MDX
// ---------------------------------------------------------------------------

function escapeYaml(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ').trim()
}

function countWords(markdown: string): number {
  return markdown.split(/\s+/).filter(Boolean).length
}

function buildFrontmatter(fields: {
  title: string
  description: string
  publishedAt: string
  author: string
  category: string
  keywords: string[]
  readingTime: number
  generationModel: string
}): string {
  const lines = [
    '---',
    `title: "${escapeYaml(fields.title)}"`,
    `description: "${escapeYaml(fields.description)}"`,
    `publishedAt: "${fields.publishedAt}"`,
    `author: "${escapeYaml(fields.author)}"`,
    `category: "${fields.category}"`,
    `language: "fr"`,
    `keywords: [${fields.keywords.map((k) => `"${escapeYaml(k)}"`).join(', ')}]`,
    `readingTime: ${fields.readingTime}`,
    `draft: true`,
    `aiGenerated: true`,
    `generationModel: "${fields.generationModel}"`,
    '---',
    '',
  ]
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface ParsedResponse {
  title: string
  description: string
  category: string
  keywords: string[]
  content: string
}

function parseClaudeJson(raw: string): ParsedResponse {
  // Tolérer un éventuel ```json wrapper
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const obj = JSON.parse(cleaned)
  if (!obj.title || !obj.description || !obj.category || !obj.content) {
    throw new Error('Réponse Claude incomplète : manque title, description, category ou content')
  }
  if (!VMG_CATEGORIES.includes(obj.category)) {
    console.warn(`[generate-article] catégorie inconnue "${obj.category}" → fallback "actualites"`)
    obj.category = 'actualites'
  }
  if (!Array.isArray(obj.keywords)) obj.keywords = []
  return obj as ParsedResponse
}

async function main() {
  const opts = parseArgs()
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY manquante')
  }

  const topic = opts.topic || pickRandomKeyword()
  console.log(`[generate-article] sujet : ${topic}`)
  console.log(`[generate-article] modèle : ${opts.model}`)

  const examples = await loadRecentArticles(3)
  if (examples.length === 0) {
    console.warn('[generate-article] aucun article existant pour few-shot — génération sans exemples')
  }

  const client = new Anthropic({ apiKey })
  const response = await client.messages.create({
    model: opts.model,
    max_tokens: 4000,
    system: buildSystemPrompt(),
    messages: [{ role: 'user', content: buildUserPrompt(topic, examples) }],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Aucun bloc text dans la réponse Claude')
  }

  const parsed = parseClaudeJson(textBlock.text)

  const now = new Date()
  const publishedAt = now.toISOString()
  const dateOnly = publishedAt.slice(0, 10)
  const slug = slugify(parsed.title, { lower: true, strict: true, locale: 'fr' }).slice(0, 80)
  const filename = `${dateOnly}-${slug}.mdx`
  const targetDir = path.join(POSTS_DIR, parsed.category)
  const targetPath = path.join(targetDir, filename)

  const wordCount = countWords(parsed.content)
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  const frontmatter = buildFrontmatter({
    title: parsed.title,
    description: parsed.description,
    publishedAt,
    author: siteConfig.author.name,
    category: parsed.category,
    keywords: parsed.keywords,
    readingTime,
    generationModel: opts.model,
  })

  await fs.mkdir(targetDir, { recursive: true })
  await fs.writeFile(targetPath, frontmatter + '\n' + parsed.content + '\n', 'utf-8')

  console.log(`[generate-article] DRAFT écrit : ${path.relative(ROOT, targetPath)}`)
  console.log(`[generate-article] mots : ${wordCount}, lecture : ${readingTime} min`)
  console.log(`[generate-article] usage tokens : input=${response.usage.input_tokens}, output=${response.usage.output_tokens}`)
}

main().catch((err) => {
  console.error('[generate-article] FATAL', err)
  process.exit(1)
})
