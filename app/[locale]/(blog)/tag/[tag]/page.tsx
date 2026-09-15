import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link, routing } from '@/lib/i18n/routing'
import { getPostsByTag, generateTagStaticParams } from '@/lib/posts'
import PostList from '@/components/PostList'

interface PageProps {
  params: Promise<{ tag: string; locale: string }>
}

export async function generateStaticParams() {
  const params: { locale: string; tag: string }[] = []
  for (const locale of routing.locales) {
    const tags = await generateTagStaticParams('fr')
    for (const { tag } of tags) {
      params.push({ locale, tag })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params
  const displayTag = tag.replace(/-/g, ' ')
  return {
    title: `Articles « ${displayTag} »`,
    description: `Tous les articles taggés ${displayTag}.`,
  }
}

export default async function TagPage({ params }: PageProps) {
  const { tag, locale } = await params
  setRequestLocale(locale as 'fr')

  const posts = await getPostsByTag(tag, 'fr')
  const displayTag = tag.replace(/-/g, ' ')

  return (
    <div>
      <section className="article-hero">
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#E85D33' }}>
              Mot-clé
            </p>
            <h1 className="text-4xl md:text-5xl mb-4 capitalize" style={{ color: '#1F3A5F', fontFamily: 'var(--font-display, serif)', fontWeight: 700 }}>
              {displayTag}
            </h1>
            <p className="text-lg" style={{ color: '#3A3A3A' }}>
              Tous les articles liés à « {displayTag} ».
            </p>
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
          {posts.length > 0 ? (
            <PostList posts={posts} variant="light" />
          ) : (
            <p className="text-center py-12" style={{ color: '#6B7280' }}>
              Aucun article trouvé avec ce mot-clé.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
