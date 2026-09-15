/**
 * Composants JSON-LD pour Next.js
 * ================================
 * Ajoute les données structurées aux pages
 */

import {
  generateArticleJsonLd,
  generateFAQJsonLd,
  generateBreadcrumbJsonLd,
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
  combineJsonLd,
} from '@/lib/seo';
import type { Post } from '@/lib/types';

// =============================================================================
// COMPOSANTS
// =============================================================================

/**
 * JSON-LD générique
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * JSON-LD pour un article
 */
export function ArticleJsonLd({ post }: { post: Post }) {
  const jsonLd = generateArticleJsonLd(post);
  return <JsonLd data={jsonLd} />;
}

/**
 * JSON-LD pour FAQ
 */
export function FAQJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const jsonLd = generateFAQJsonLd(faqs);
  return <JsonLd data={jsonLd} />;
}

/**
 * JSON-LD pour Breadcrumbs
 */
export function BreadcrumbJsonLd({
  crumbs,
}: {
  crumbs: { name: string; url: string }[];
}) {
  const jsonLd = generateBreadcrumbJsonLd(crumbs);
  return <JsonLd data={jsonLd} />;
}

/**
 * JSON-LD pour Organisation
 */
export function OrganizationJsonLd() {
  const jsonLd = generateOrganizationJsonLd();
  return <JsonLd data={jsonLd} />;
}

/**
 * JSON-LD pour le Site Web
 */
export function WebSiteJsonLd() {
  const jsonLd = generateWebSiteJsonLd();
  return <JsonLd data={jsonLd} />;
}

/**
 * JSON-LD combiné pour la page d'accueil
 */
export function HomePageJsonLd() {
  const combined = combineJsonLd(
    generateWebSiteJsonLd(),
    generateOrganizationJsonLd()
  );
  return <JsonLd data={combined} />;
}

/**
 * JSON-LD combiné pour un article avec breadcrumbs
 */
export function ArticlePageJsonLd({
  post,
  faqs,
}: {
  post: Post;
  faqs?: { question: string; answer: string }[];
}) {
  const crumbs = [
    { name: 'Accueil', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.frontmatter.category, url: `/category/${post.frontmatter.category}` },
    { name: post.frontmatter.title, url: `/blog/${post.slug}` },
  ];

  const articleJsonLd = generateArticleJsonLd(post);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(crumbs);

  // Combiner tous les JSON-LD
  const allData: object[] = [articleJsonLd, breadcrumbJsonLd];

  if (faqs && faqs.length > 0) {
    allData.push(generateFAQJsonLd(faqs));
  }

  const combined = combineJsonLd(...allData);
  return <JsonLd data={combined} />;
}
