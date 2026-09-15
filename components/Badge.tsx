import { getCategoryBySlug, getCategoryName } from '@/config/site.config'

interface BadgeProps {
  category: string
  size?: 'sm' | 'md'
}

export default function Badge({ category, size = 'sm' }: BadgeProps) {
  const cat = getCategoryBySlug(category)
  const label = cat ? getCategoryName(cat) : category
  const sizeClass = size === 'md' ? 'badge-md' : 'badge-sm'

  return <span className={`badge ${sizeClass}`}>{label}</span>
}
