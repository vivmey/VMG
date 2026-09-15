import { PostMeta } from '@/lib/types'
import ArticleCard from './ArticleCard'

interface PostListProps {
  posts: PostMeta[]
  title?: string
  variant?: 'dark' | 'light'
}

export default function PostList({ posts, title, variant = 'light' }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: '#6B7280' }}>Aucun article trouvé.</p>
      </div>
    )
  }

  return (
    <div>
      {title && (
        <h2 className="text-2xl mb-6" style={{ color: '#1F3A5F', fontFamily: 'var(--font-display, serif)', fontWeight: 700 }}>
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <ArticleCard key={post.slug} post={post} variant={variant} priority={index < 3} />
        ))}
      </div>
    </div>
  )
}
