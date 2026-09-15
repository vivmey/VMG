import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/lib/i18n/routing'
import { getAllPosts } from '@/lib/posts'
import PostList from '@/components/PostList'
import { siteConfig } from '@/config/site.config'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params
  return {
    title: 'Tous les articles',
    description: `L'archive complète du blog de l'asso ${siteConfig.organization.legalName} depuis ${siteConfig.site.foundedYear}.`,
  }
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale as 'fr')
  const t = await getTranslations('blog')
  const posts = await getAllPosts('fr')

  return (
    <div>
      <section className="article-hero">
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="badge">{posts.length} articles</span>
              <span className="text-sm" style={{ color: '#6B7280' }}>
                Depuis {siteConfig.site.foundedYear}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl mb-4" style={{ color: '#1F3A5F', fontFamily: 'var(--font-display, serif)', fontWeight: 700 }}>
              {t('title')}
            </h1>
            <p className="text-lg" style={{ color: '#3A3A3A' }}>{t('subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container">
          {posts.length > 0 ? (
            <PostList posts={posts} variant="light" />
          ) : (
            <p className="text-center" style={{ color: '#6B7280' }}>{t('noPosts')}</p>
          )}
        </div>
      </section>

      <section className="cta-section-wrapper">
        <div className="container">
          <div className="cta-section">
            <div className="cta-glow" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl mb-4" style={{ color: '#FFF7F2', fontFamily: 'var(--font-display, serif)', fontWeight: 700 }}>
                Vous avez une histoire à partager&nbsp;?
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255, 247, 242, 0.85)' }}>
                Une mobilisation, un événement, un témoignage de bénévole&nbsp;?
                Écrivez-nous, on relaie.
              </p>
              <Link href="/contact" className="cta-white">
                Nous écrire
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
