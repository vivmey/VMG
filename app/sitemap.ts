import type { MetadataRoute } from 'next';
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://voisinsmoulingalant.fr';

const VITRINE_ROUTES = [
  { path: '', priority: 1.0, changeFreq: 'weekly' as const },
  { path: '/qui-sommes-nous', priority: 0.8, changeFreq: 'monthly' as const },
  { path: '/nos-actions', priority: 0.9, changeFreq: 'monthly' as const },
  { path: '/dons', priority: 0.9, changeFreq: 'yearly' as const },
  { path: '/adhesion', priority: 0.8, changeFreq: 'yearly' as const },
  { path: '/benevolat', priority: 0.8, changeFreq: 'yearly' as const },
  { path: '/contact', priority: 0.7, changeFreq: 'yearly' as const },
  { path: '/mentions-legales', priority: 0.3, changeFreq: 'yearly' as const },
  { path: '/confidentialite', priority: 0.3, changeFreq: 'yearly' as const },
  { path: '/rgpd', priority: 0.3, changeFreq: 'yearly' as const },
  { path: '/blog', priority: 0.9, changeFreq: 'daily' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const vitrineUrls: MetadataRoute.Sitemap = VITRINE_ROUTES.map((route) => ({
    url: `${SITE_URL}/fr${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));

  const [posts, categories, tags] = await Promise.all([
    getAllPosts('fr').catch(() => []),
    getAllCategories('fr').catch(() => []),
    getAllTags('fr').catch(() => []),
  ]);

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/fr/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/fr/category/${category}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const tagUrls: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${SITE_URL}/fr/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.4,
  }));

  return [...vitrineUrls, ...postUrls, ...categoryUrls, ...tagUrls];
}
