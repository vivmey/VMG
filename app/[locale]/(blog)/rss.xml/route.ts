import RSS from 'rss'
import { getAllPosts } from '@/lib/posts'
import { siteConfig } from '@/config/site.config'

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const posts = await getAllPosts('fr')

  const feed = new RSS({
    title: `${siteConfig.site.name} — Flux RSS`,
    description: siteConfig.seo.defaultMeta.description,
    site_url: `${siteConfig.site.url}/${locale}`,
    feed_url: `${siteConfig.site.url}/${locale}/rss.xml`,
    language: 'fr',
    pubDate: new Date(),
    copyright: `${new Date().getFullYear()} ${siteConfig.organization.legalName}`,
    generator: 'Next.js RSS',
    managingEditor: siteConfig.organization.contactEmail,
    webMaster: siteConfig.organization.contactEmail,
    image_url: `${siteConfig.site.url}${siteConfig.site.logo.light}`,
  })

  posts.slice(0, 30).forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `${siteConfig.site.url}/${locale}/blog/${post.slug}`,
      guid: `${siteConfig.site.url}/${locale}/blog/${post.slug}`,
      categories: [post.category, ...(post.keywords || [])],
      author: post.author,
      date: new Date(post.publishedAt),
      enclosure: post.image
        ? {
            url: post.image.startsWith('http') ? post.image : `${siteConfig.site.url}${post.image}`,
            type: 'image/jpeg',
          }
        : undefined,
    })
  })

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
