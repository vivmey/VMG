/**
 * Revalidation Webhook (Phase 2 Strapi)
 * ====================================
 * Appelé par Strapi (`merenza-cms`) sur entry.publish/update/unpublish/delete
 * pour invalider le cache ISR. Restreint à la marque `voisins-moulin-galant`
 * (cf ADR 014 — multi-tenant via codes de rôle).
 *
 * Usage :
 *   POST /api/revalidate
 *   Headers : x-revalidate-secret: <REVALIDATE_SECRET>, Content-Type: application/json
 *   Body :
 *     { "type": "article", "slug": "...", "brand": "voisins-moulin-galant" }
 *     { "type": "category", "slug": "..." }
 *     { "type": "all" }
 */

import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

const SUPPORTED_BRANDS = new Set(['voisins-moulin-galant'])

interface RevalidateRequest {
  type: 'article' | 'category' | 'sitemap' | 'rss' | 'all'
  slug?: string
  brand?: string
}

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-revalidate-secret')
    const expectedSecret = process.env.REVALIDATE_SECRET

    if (!expectedSecret) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    if (secret !== expectedSecret) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    const body = (await request.json()) as RevalidateRequest

    if (body.brand && !SUPPORTED_BRANDS.has(body.brand)) {
      return NextResponse.json({ error: `Brand ${body.brand} not supported here` }, { status: 400 })
    }

    const { type, slug } = body
    const revalidated: string[] = []

    switch (type) {
      case 'article':
        if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
        revalidateTag(`article-${slug}`, 'max')
        revalidateTag('strapi-articles', 'max')
        revalidatePath(`/fr/blog/${slug}`, 'page')
        revalidated.push(`article-${slug}`, 'strapi-articles', `/fr/blog/${slug}`)
        break

      case 'category':
        if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
        revalidateTag(`category-${slug}`, 'max')
        revalidateTag('strapi-articles', 'max')
        revalidatePath(`/fr/category/${slug}`, 'page')
        revalidated.push(`category-${slug}`, 'strapi-articles', `/fr/category/${slug}`)
        break

      case 'sitemap':
        revalidatePath('/sitemap.xml', 'page')
        revalidated.push('/sitemap.xml')
        break

      case 'rss':
        revalidatePath('/fr/rss.xml', 'page')
        revalidated.push('/fr/rss.xml')
        break

      case 'all':
        revalidateTag('strapi-articles', 'max')
        revalidatePath('/sitemap.xml', 'page')
        revalidatePath('/fr', 'page')
        revalidatePath('/fr/blog', 'page')
        revalidatePath('/fr/rss.xml', 'page')
        revalidated.push('strapi-articles', '/sitemap.xml', '/fr', '/fr/blog', '/fr/rss.xml')
        break

      default:
        return NextResponse.json({ error: `Invalid type: ${type}` }, { status: 400 })
    }

    return NextResponse.json({
      revalidated: true,
      type,
      slug,
      tags: revalidated,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Revalidate] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/revalidate',
    methods: ['POST'],
    requiredHeaders: ['x-revalidate-secret'],
    supportedTypes: ['article', 'category', 'sitemap', 'rss', 'all'],
    supportedBrands: Array.from(SUPPORTED_BRANDS),
  })
}
