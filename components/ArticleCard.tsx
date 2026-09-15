import Image from 'next/image'
import { PostMeta } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import Badge from './Badge'
import { Link } from '@/lib/i18n/routing'

interface ArticleCardProps {
  post: PostMeta
  priority?: boolean
  variant?: 'dark' | 'light'
}

export default function ArticleCard({ post, priority = false }: ArticleCardProps) {
  const imageUrl = post.image
  const isExternal = imageUrl?.startsWith('http')

  return (
    <Link href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }}>
      <article className="article-card group h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              unoptimized={isExternal}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FFF7F2 0%, #FBE8DC 100%)' }}
            >
              <svg
                className="h-12 w-12"
                style={{ color: '#E85D33' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="article-card-content flex-1 flex flex-col">
          <Badge category={post.category} />
          <h2 className="article-card-title mt-3 mb-2 line-clamp-2">{post.title}</h2>
          <p className="article-card-description mb-4 flex-1">{post.description}</p>
          <div className="article-card-meta flex items-center justify-between mt-auto">
            <span>{formatDate(post.publishedAt)}</span>
            <span>{post.readingTime} min</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
