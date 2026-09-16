import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { setRequestLocale } from 'next-intl/server'
import {
  getPostBySlug,
  generatePostStaticParams,
  formatDate,
  slugify,
} from '@/lib/posts'
import { mdxComponents } from '@/components/mdx-components'
import { siteConfig, getCategoryBySlug, getCategoryName } from '@/config/site.config'
import { ArticlePageJsonLd } from '@/components/seo/JsonLd'
import Badge from '@/components/Badge'
import { Link, routing } from '@/lib/i18n/routing'

interface PageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of routing.locales) {
    const slugs = await generatePostStaticParams('fr')
    for (const { slug } of slugs) {
      params.push({ locale, slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const post = await getPostBySlug(slug, 'fr')
  if (!post) return {}

  const { site } = siteConfig
  const canonicalUrl = `${site.url}/${locale}/blog/${slug}`

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    keywords: post.frontmatter.keywords,
    authors: [{ name: post.frontmatter.author }],
    alternates: {
      canonical: canonicalUrl,
      languages: { fr: canonicalUrl, 'x-default': canonicalUrl },
    },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: 'article',
      publishedTime: post.frontmatter.publishedAt,
      modifiedTime: post.frontmatter.updatedAt,
      authors: [post.frontmatter.author],
      images: post.frontmatter.image
        ? [{ url: post.frontmatter.image, width: 1200, height: 630, alt: post.frontmatter.title }]
        : [{ url: `${site.url}/images/og-default.jpg`, width: 1200, height: 630 }],
      url: canonicalUrl,
      siteName: site.name,
      locale: 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: post.frontmatter.image ? [post.frontmatter.image] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug, locale } = await params
  setRequestLocale(locale as 'fr')

  const post = await getPostBySlug(slug, 'fr')
  if (!post) {
    notFound()
  }

  const hasImage = !!post.frontmatter.image
  const isExternalImage = hasImage && post.frontmatter.image?.startsWith('http')
  const category = getCategoryBySlug(post.frontmatter.category)
  const categoryLabel = category ? getCategoryName(category) : post.frontmatter.category

  return (
    <div>
      <ArticlePageJsonLd post={post} />

      {/* Hero image */}
      {hasImage && (
        <div className="relative w-full h-64 md:h-96 lg:h-[450px] overflow-hidden">
          <Image
            src={post.frontmatter.image!}
            alt={post.frontmatter.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            unoptimized={isExternalImage}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(255, 247, 242, 0.95) 0%, rgba(255, 247, 242, 0.5) 30%, transparent 60%)' }} />
        </div>
      )}

      {/* Article header */}
      <section className={`relative z-10 ${hasImage ? 'pt-8 -mt-32' : 'pt-32'} pb-12`} style={{ background: hasImage ? 'transparent' : 'linear-gradient(135deg, #FFF7F2 0%, #FBE8DC 100%)' }}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <nav className="breadcrumb mb-6" aria-label="Breadcrumb">
              <Link href="/">Accueil</Link>
              <span className="breadcrumb-separator" aria-hidden="true">/</span>
              <Link href="/blog">Articles</Link>
              <span className="breadcrumb-separator" aria-hidden="true">/</span>
              <Link
                href={{ pathname: '/category/[category]', params: { category: post.frontmatter.category } }}
              >
                {categoryLabel}
              </Link>
            </nav>

            <Badge category={post.frontmatter.category} size="md" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl mt-4 mb-4" style={{ color: '#1F3A5F', fontFamily: 'var(--font-display, serif)', fontWeight: 700 }}>
              {post.frontmatter.title}
            </h1>
            <p className="text-lg md:text-xl mb-6" style={{ color: '#3A3A3A' }}>
              {post.frontmatter.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: '#6B7280' }}>
              <span itemProp="author">{post.frontmatter.author}</span>
              <span aria-hidden="true">•</span>
              <time dateTime={post.frontmatter.publishedAt} itemProp="datePublished">
                {formatDate(post.frontmatter.publishedAt)}
              </time>
              <span aria-hidden="true">•</span>
              <span>{post.frontmatter.readingTime} min de lecture</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article content */}
      <section className="py-12" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <article className="max-w-3xl mx-auto" itemScope itemType="https://schema.org/Article">
            <div className="article-content" itemProp="articleBody">
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>

            <footer className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(31, 58, 95, 0.1)' }}>
              {(post.frontmatter.keywords ?? []).length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#1F3A5F' }}>Mots-clés</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.frontmatter.keywords.map((tag) => (
                      <Link
                        key={tag}
                        href={{ pathname: '/tag/[tag]', params: { tag: slugify(tag) } }}
                        className="tag-link"
                        rel="tag"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </>
              )}

              <div className="flex items-center gap-4 mb-8">
                <span className="text-sm" style={{ color: '#6B7280' }}>Partager :</span>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteConfig.site.url}/${locale}/blog/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300"
                  style={{ color: '#E85D33' }}
                  aria-label="Partager sur Facebook"
                >
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.frontmatter.title)}&url=${encodeURIComponent(`${siteConfig.site.url}/${locale}/blog/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300"
                  style={{ color: '#E85D33' }}
                  aria-label="Partager sur Twitter"
                >
                  Twitter
                </a>
              </div>

              <Link href="/blog" className="link-arrow">
                ← Retour aux articles
              </Link>
            </footer>
          </article>
        </div>
      </section>
    </div>
  )
}
