import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { brandConfig } from '@/brand.config';
import { fetchStrapiPosts, fetchStrapiPostBySlug } from './strapi';
import { Post, PostMeta, PostFrontmatter } from './types';

export type Locale = 'fr';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getMDXFiles(fullPath));
    } else if (item.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractSlugFromFilename(filename: string): string {
  const basename = path.basename(filename, '.mdx');
  return basename.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

async function getAllPostsFromMDX(locale: Locale = 'fr'): Promise<PostMeta[]> {
  const files = getMDXFiles(POSTS_DIR);
  const posts: PostMeta[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const { data } = matter(content);
    const frontmatter = data as PostFrontmatter;

    if (frontmatter.draft) {
      continue;
    }

    if (frontmatter.language && frontmatter.language !== locale) {
      continue;
    }

    posts.push({
      slug: extractSlugFromFilename(file),
      title: frontmatter.title,
      description: frontmatter.description,
      publishedAt: frontmatter.publishedAt,
      author: frontmatter.author,
      category: frontmatter.category,
      readingTime: frontmatter.readingTime,
      keywords: frontmatter.keywords || [],
      image: frontmatter.image,
    });
  }

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

async function getPostBySlugFromMDX(slug: string, locale: Locale = 'fr'): Promise<Post | null> {
  const files = getMDXFiles(POSTS_DIR);

  for (const file of files) {
    const fileSlug = extractSlugFromFilename(file);
    if (fileSlug === slug) {
      const fileContent = fs.readFileSync(file, 'utf-8');
      const { data, content } = matter(fileContent);
      const frontmatter = data as PostFrontmatter;

      if (frontmatter.language && frontmatter.language !== locale) {
        continue;
      }

      return {
        slug,
        frontmatter,
        content,
      };
    }
  }

  return null;
}

/**
 * Routage source :
 * - `mdx` (défaut) : 207 articles MDX locaux uniquement.
 * - `strapi` : Strapi uniquement, fallback MDX si Strapi échoue.
 * - `hybrid` : merge MDX + Strapi avec MDX prioritaire par slug.
 *   Anti-régression : les 207 MDX historiques sont garantis intacts,
 *   Strapi n'ajoute que des slugs absents de MDX (= nouveaux articles).
 */
export async function getAllPosts(locale: Locale = 'fr'): Promise<PostMeta[]> {
  const source = brandConfig.blog.articlesSource;

  if (source === 'strapi') {
    try {
      const strapi = await fetchStrapiPosts();
      if (strapi.length) return strapi;
    } catch (err) {
      console.warn('[lib/posts] Strapi fetch failed, falling back to MDX:', err);
    }
    return getAllPostsFromMDX(locale);
  }

  if (source === 'hybrid') {
    const mdx = await getAllPostsFromMDX(locale);
    let strapi: PostMeta[] = [];
    try {
      strapi = await fetchStrapiPosts();
    } catch (err) {
      console.warn('[lib/posts] Strapi fetch failed in hybrid mode, MDX-only:', err);
    }
    const mdxSlugs = new Set(mdx.map((p) => p.slug));
    const strapiOnly = strapi.filter((p) => !mdxSlugs.has(p.slug));
    return [...mdx, ...strapiOnly].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  return getAllPostsFromMDX(locale);
}

export async function getPostBySlug(slug: string, locale: Locale = 'fr'): Promise<Post | null> {
  const source = brandConfig.blog.articlesSource;

  if (source === 'hybrid') {
    const mdx = await getPostBySlugFromMDX(slug, locale);
    if (mdx) return mdx;
    try {
      return await fetchStrapiPostBySlug(slug);
    } catch (err) {
      console.warn('[lib/posts] Strapi fetch failed in hybrid mode:', err);
      return null;
    }
  }

  if (source === 'strapi') {
    try {
      const post = await fetchStrapiPostBySlug(slug);
      if (post) return post;
    } catch (err) {
      console.warn('[lib/posts] Strapi fetch failed, falling back to MDX:', err);
    }
  }
  return getPostBySlugFromMDX(slug, locale);
}

export async function getPostsByCategory(category: string, locale: Locale = 'fr'): Promise<PostMeta[]> {
  const posts = await getAllPosts(locale);
  return posts.filter((post) => post.category === category);
}

export async function getPostsByTag(tag: string, locale: Locale = 'fr'): Promise<PostMeta[]> {
  const posts = await getAllPosts(locale);
  const normalizedTag = tag.toLowerCase().replace(/-/g, ' ');

  return posts.filter((post) =>
    post.keywords.some(
      (keyword) =>
        keyword.toLowerCase().includes(normalizedTag) ||
        normalizedTag.includes(keyword.toLowerCase())
    )
  );
}

export async function getAllTags(locale: Locale = 'fr'): Promise<string[]> {
  const posts = await getAllPosts(locale);
  const tagsSet = new Set<string>();
  posts.forEach((post) => post.keywords.forEach((k) => tagsSet.add(k)));
  return Array.from(tagsSet).sort();
}

export async function getAllCategories(locale: Locale = 'fr'): Promise<string[]> {
  const posts = await getAllPosts(locale);
  const categoriesSet = new Set<string>();
  posts.forEach((post) => categoriesSet.add(post.category));
  return Array.from(categoriesSet).sort();
}

export async function hasTranslation(slug: string, locale: Locale): Promise<boolean> {
  const post = await getPostBySlug(slug, locale);
  return post !== null;
}

export async function getPostLocales(_slug: string): Promise<Locale[]> {
  return ['fr'];
}

export async function generatePostStaticParams(locale: Locale = 'fr'): Promise<{ slug: string }[]> {
  const posts = await getAllPosts(locale);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateCategoryStaticParams(): Promise<{ category: string }[]> {
  const categories = await getAllCategories('fr');
  return categories.map((category) => ({ category }));
}

export async function generateTagStaticParams(locale: Locale = 'fr'): Promise<{ tag: string }[]> {
  const tags = await getAllTags(locale);
  return tags.map((tag) => ({ tag: tag.toLowerCase().replace(/\s+/g, '-') }));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

export function formatDate(dateString: string, _locale: Locale = 'fr'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export type { Post, PostMeta, PostFrontmatter };
