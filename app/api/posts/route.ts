/**
 * API publique consommée par la vitrine.
 *
 * GET /api/posts?limit=3&category=mobilisation
 * Réponse :
 *   { items: [{ slug, title, description, publishedAt, category, image, readingTime }], total }
 *
 * CORS : restreint à la vitrine en prod, ouvert en dev.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, getPostsByCategory } from '@/lib/posts'
import { siteConfig } from '@/config/site.config'

const VITRINE_ORIGIN = siteConfig.site.vitrineUrl

function corsHeaders(): HeadersInit {
  const origin =
    process.env.NODE_ENV === 'production'
      ? VITRINE_ORIGIN
      : '*'
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 10)))
  const category = searchParams.get('category') ?? undefined

  const posts = category ? await getPostsByCategory(category, 'fr') : await getAllPosts('fr')

  const items = posts.slice(0, limit).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    publishedAt: p.publishedAt,
    category: p.category,
    image: p.image ?? null,
    readingTime: p.readingTime,
  }))

  return NextResponse.json(
    {
      items,
      total: posts.length,
    },
    {
      headers: {
        ...corsHeaders(),
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    },
  )
}
