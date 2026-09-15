/**
 * SEO Utilities — JSON-LD Structured Data pour VMG
 * Organization typée NGOAssociation (asso loi 1901)
 */

import { siteConfig } from '@/config/site.config'
import type { Post } from './types'

interface JsonLdBase {
  '@context': 'https://schema.org'
  '@type': string
}

interface ArticleJsonLd extends JsonLdBase {
  '@type': 'Article' | 'BlogPosting' | 'NewsArticle'
  headline: string
  description: string
  image: string | string[]
  datePublished: string
  dateModified?: string
  author: { '@type': 'Person' | 'Organization'; name: string; url?: string }
  publisher: {
    '@type': 'Organization'
    name: string
    logo: { '@type': 'ImageObject'; url: string }
  }
  mainEntityOfPage: { '@type': 'WebPage'; '@id': string }
  keywords?: string[]
  wordCount?: number
  articleSection?: string
  inLanguage?: string
}

interface FAQJsonLd extends JsonLdBase {
  '@type': 'FAQPage'
  mainEntity: {
    '@type': 'Question'
    name: string
    acceptedAnswer: { '@type': 'Answer'; text: string }
  }[]
}

interface BreadcrumbJsonLd extends JsonLdBase {
  '@type': 'BreadcrumbList'
  itemListElement: { '@type': 'ListItem'; position: number; name: string; item: string }[]
}

interface OrganizationJsonLd extends JsonLdBase {
  '@type': 'NGO' | 'Organization'
  name: string
  alternateName?: string
  url: string
  logo: string
  description: string
  foundingDate?: string
  address?: {
    '@type': 'PostalAddress'
    streetAddress: string
    addressLocality: string
    postalCode: string
    addressCountry: string
  }
  contactPoint?: { '@type': 'ContactPoint'; email: string; contactType: string }
  sameAs?: string[]
}

interface WebSiteJsonLd extends JsonLdBase {
  '@type': 'WebSite'
  name: string
  url: string
  description: string
  publisher: { '@type': 'Organization'; name: string }
  inLanguage: string
}

export function generateArticleJsonLd(post: Post): ArticleJsonLd {
  const { site } = siteConfig
  const postUrl = `${site.url}/fr/blog/${post.slug}`
  const imageUrl = post.frontmatter.image
    ? (post.frontmatter.image.startsWith('http') ? post.frontmatter.image : `${site.url}${post.frontmatter.image}`)
    : `${site.url}/images/og-default.jpg`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    image: [imageUrl],
    datePublished: post.frontmatter.publishedAt,
    dateModified: post.frontmatter.updatedAt || post.frontmatter.publishedAt,
    author: {
      '@type': 'Organization',
      name: post.frontmatter.author,
      url: site.vitrineUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.organization.legalName,
      logo: {
        '@type': 'ImageObject',
        url: `${site.url}${site.logo.light}`,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    keywords: post.frontmatter.keywords,
    wordCount: post.frontmatter.readingTime ? post.frontmatter.readingTime * 200 : undefined,
    articleSection: post.frontmatter.category,
    inLanguage: 'fr',
  }
}

export function generateFAQJsonLd(faqs: { question: string; answer: string }[]): FAQJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

export function generateBreadcrumbJsonLd(crumbs: { name: string; url: string }[]): BreadcrumbJsonLd {
  const { site } = siteConfig
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url.startsWith('http') ? c.url : `${site.url}${c.url}`,
    })),
  }
}

export function generateOrganizationJsonLd(): OrganizationJsonLd {
  const { site, organization, seo } = siteConfig

  const sameAs: string[] = []
  if (organization.socials.facebook) sameAs.push(organization.socials.facebook)
  if (organization.socials.instagram) sameAs.push(organization.socials.instagram)

  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: organization.legalName,
    alternateName: 'VMG',
    url: site.vitrineUrl,
    logo: `${site.url}${site.logo.light}`,
    description: seo.defaultMeta.description,
    foundingDate: String(site.foundedYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: organization.address.street,
      addressLocality: organization.address.locality,
      postalCode: organization.address.postalCode,
      addressCountry: organization.address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: organization.contactEmail,
      contactType: 'general',
    },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  }
}

export function generateWebSiteJsonLd(): WebSiteJsonLd {
  const { site, seo } = siteConfig
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    description: seo.defaultMeta.description,
    publisher: { '@type': 'Organization', name: siteConfig.organization.legalName },
    inLanguage: 'fr',
  }
}

export function combineJsonLd(...items: object[]): object {
  return {
    '@context': 'https://schema.org',
    '@graph': items.map((item) => {
      const { '@context': _, ...rest } = item as Record<string, unknown>
      return rest
    }),
  }
}
