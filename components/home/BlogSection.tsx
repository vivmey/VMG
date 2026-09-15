import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { brandConfig } from '@/brand.config';
import { getAllPosts } from '@/lib/posts';

type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  category: string;
  image: string;
  readingTime?: number;
};

type BlogSectionProps = {
  lang: string;
};

async function getRecentPosts(limit = 3): Promise<BlogPost[]> {
  try {
    const posts = await getAllPosts('fr');
    if (!posts.length) throw new Error('No posts found');
    return posts.slice(0, limit).map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      publishedAt: p.publishedAt,
      category: p.category,
      image: p.image ?? brandConfig.assets.ogImage,
      readingTime: p.readingTime,
    }));
  } catch {
    return brandConfig.articlesFallback;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogSection({ lang }: BlogSectionProps) {
  const t = await getTranslations({ locale: lang, namespace: 'blog' });
  const posts = await getRecentPosts(3);

  return (
    <section className="py-16 lg:py-24 bg-light">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[13px] font-medium text-navy tracking-[0.1em] uppercase">
              {t('label')}
            </span>
          </div>
          <h2 className="text-[32px] md:text-[42px] lg:text-[52px] leading-[1.15] text-navy">
            <span className="font-serif">{t('title')}</span>
            <br />
            <span className="font-serif italic text-primary">{t('subtitle')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${lang}/blog/${post.slug}`}
              className="group block"
            >
              <div className="rounded-2xl overflow-hidden mb-5 bg-white">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="w-full h-[200px] lg:h-[240px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-primary">
                  {post.category}
                </span>
                <span className="w-8 h-px bg-gray-300" />
                <span className="text-[11px] font-medium tracking-[0.05em] uppercase text-body">
                  {formatDate(post.publishedAt)}
                </span>
              </div>
              <h3 className="text-[18px] lg:text-[20px] font-serif text-navy leading-snug group-hover:text-primary transition-colors mb-2">
                {post.title}
              </h3>
              <p className="text-[14px] text-body leading-relaxed line-clamp-2">
                {post.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-2 text-[15px] font-medium text-primary hover:text-navy transition-colors"
          >
            {t('viewAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
