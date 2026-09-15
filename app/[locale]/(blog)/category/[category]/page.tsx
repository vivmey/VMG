import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { Link, routing } from '@/lib/i18n/routing'
import { getPostsByCategory, generateCategoryStaticParams } from '@/lib/posts'
import PostList from '@/components/PostList'
import { getCategoryBySlug, getCategoryName } from '@/config/site.config'

interface PageProps {
  params: Promise<{ category: string; locale: string }>
}

export async function generateStaticParams() {
  const categories = await generateCategoryStaticParams()
  const params: { locale: string; category: string }[] = []
  for (const locale of routing.locales) {
    for (const { category } of categories) {
      params.push({ locale, category })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) return {}
  return {
    title: getCategoryName(cat),
    description: cat.description,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category, locale } = await params
  setRequestLocale(locale as 'fr')

  const cat = getCategoryBySlug(category)
  if (!cat) notFound()

  const posts = await getPostsByCategory(category, 'fr')

  return (
    <div>
      <section className="article-hero">
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#E85D33' }}>
              Catégorie
            </p>
            <h1 className="text-4xl md:text-5xl mb-4" style={{ color: '#1F3A5F', fontFamily: 'var(--font-display, serif)', fontWeight: 700 }}>
              {getCategoryName(cat)}
            </h1>
            <p className="text-lg" style={{ color: '#3A3A3A' }}>{cat.description}</p>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <p style={{ color: '#6B7280' }}>
              {posts.length} article{posts.length > 1 ? 's' : ''}
            </p>
            <Link href="/blog" className="link-arrow">
              Tous les articles <span>→</span>
            </Link>
          </div>
          <PostList posts={posts} variant="light" />
        </div>
      </section>
    </div>
  )
}
