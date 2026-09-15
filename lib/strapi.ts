/**
 * Client Strapi pour `merenza-cms` (Strapi 5.44, ADR 014 multi-tenant).
 * Lu si `brandConfig.blog.articlesSource === 'strapi'`.
 *
 * Le schema `api::article.article` côté Strapi est multi-brand via
 * la relation `brand` (manyToOne → api::brand.brand). On filtre par
 * `filters[brand][slug]=voisins-moulin-galant`.
 *
 * Fallback : si la requête échoue (Strapi down, token expiré, etc.),
 * `lib/posts.ts` retombe sur la lecture MDX locale.
 */

import { brandConfig } from '@/brand.config';
import type { PostMeta, Post } from './types';

interface StrapiMedia {
  url: string;
  alternativeText?: string;
}

interface StrapiArticleAttributes {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category?: 'news' | 'blog' | 'info' | 'press';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  cover?: { data?: { attributes: StrapiMedia } | null } | StrapiMedia | null;
}

interface StrapiArticle {
  id: number;
  documentId: string;
  attributes?: StrapiArticleAttributes;
  // Strapi 5 plat (sans attributes wrapper) — on supporte les 2 formes
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: 'news' | 'blog' | 'info' | 'press';
  publishedAt?: string;
  cover?: StrapiMedia | null;
}

interface StrapiResponse<T> {
  data: T[];
  meta?: { pagination?: { total: number } };
}

const DEFAULT_CATEGORY = 'actualites';

function pickAttributes(a: StrapiArticle): StrapiArticleAttributes {
  if (a.attributes) return a.attributes;
  return {
    title: a.title ?? '',
    slug: a.slug ?? '',
    excerpt: a.excerpt,
    content: a.content ?? '',
    category: a.category,
    publishedAt: a.publishedAt,
    createdAt: a.publishedAt ?? new Date().toISOString(),
    updatedAt: a.publishedAt ?? new Date().toISOString(),
    cover: a.cover ?? null,
  };
}

function extractCoverUrl(cover: StrapiArticleAttributes['cover'], baseUrl: string): string | undefined {
  if (!cover) return undefined;
  // Forme Strapi 4 : { data: { attributes: { url } } }
  if ('data' in cover && cover.data) {
    const url = cover.data.attributes?.url;
    return url ? (url.startsWith('http') ? url : `${baseUrl}${url}`) : undefined;
  }
  // Forme Strapi 5 : { url } direct
  if ('url' in cover && cover.url) {
    return cover.url.startsWith('http') ? cover.url : `${baseUrl}${cover.url}`;
  }
  return undefined;
}

const VMG_CATEGORIES = new Set([
  'actualites', 'galerie', 'evenements', 'vie-asso', 'mobilisation', 'friperie', 'communique',
]);

function strapiCategoryToVmg(cat?: string): string {
  if (!cat) return DEFAULT_CATEGORY;
  // Passthrough si l'enum Strapi est déjà une catégorie VMG (cas attendu post-patch enum)
  if (VMG_CATEGORIES.has(cat)) return cat;
  // Mapping rétrocompat pour les valeurs Strapi génériques (news/blog/info/press)
  switch (cat) {
    case 'press':
      return 'communique';
    case 'news':
      return 'actualites';
    case 'info':
      return 'vie-asso';
    case 'blog':
    default:
      return DEFAULT_CATEGORY;
  }
}

function mapStrapiToPostMeta(a: StrapiArticle, baseUrl: string): PostMeta {
  const attrs = pickAttributes(a);
  return {
    slug: attrs.slug,
    title: attrs.title,
    description: attrs.excerpt ?? '',
    publishedAt: attrs.publishedAt ?? attrs.createdAt,
    author: brandConfig.brand.name,
    category: strapiCategoryToVmg(attrs.category),
    readingTime: Math.max(1, Math.round((attrs.content?.length ?? 0) / 1200)),
    keywords: [],
    image: extractCoverUrl(attrs.cover, baseUrl),
  };
}

function mapStrapiToPost(a: StrapiArticle): Post {
  const attrs = pickAttributes(a);
  return {
    slug: attrs.slug,
    frontmatter: {
      title: attrs.title,
      description: attrs.excerpt ?? '',
      publishedAt: attrs.publishedAt ?? attrs.createdAt,
      author: brandConfig.brand.name,
      category: strapiCategoryToVmg(attrs.category),
      language: 'fr',
      keywords: [],
      readingTime: Math.max(1, Math.round((attrs.content?.length ?? 0) / 1200)),
      draft: !attrs.publishedAt,
      image: extractCoverUrl(attrs.cover, brandConfig.cms.url),
    },
    content: attrs.content ?? '',
  };
}

async function strapiFetch<T>(path: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (brandConfig.cms.apiToken) {
    headers.Authorization = `Bearer ${brandConfig.cms.apiToken}`;
  }
  const res = await fetch(`${brandConfig.cms.url}${path}`, {
    headers,
    next: { revalidate: 60, tags: ['strapi-articles'] },
  });
  if (!res.ok) {
    throw new Error(`Strapi ${res.status} ${res.statusText} on ${path}`);
  }
  return res.json() as Promise<T>;
}

const BRAND_FILTER = `filters[brand][slug][$eq]=${brandConfig.cms.brandSlug}`;
const POPULATE = 'populate[cover]=true&populate[brand]=true';
const LOCALE = `locale=${brandConfig.cms.locale}`;

export async function fetchStrapiPosts(): Promise<PostMeta[]> {
  const path = `/api/articles?${BRAND_FILTER}&${POPULATE}&${LOCALE}&publicationState=live&pagination[limit]=200&sort=publishedAt:desc`;
  const json = await strapiFetch<StrapiResponse<StrapiArticle>>(path);
  return (json.data ?? []).map((a) => mapStrapiToPostMeta(a, brandConfig.cms.url));
}

export async function fetchStrapiPostBySlug(slug: string): Promise<Post | null> {
  const path = `/api/articles?${BRAND_FILTER}&filters[slug][$eq]=${encodeURIComponent(slug)}&${POPULATE}&${LOCALE}&publicationState=live&pagination[limit]=1`;
  const json = await strapiFetch<StrapiResponse<StrapiArticle>>(path);
  const first = json.data?.[0];
  return first ? mapStrapiToPost(first) : null;
}
