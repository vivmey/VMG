import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import Image from 'next/image'

interface PetitionProps {
  url: string
  title: string
  goal?: string
}

function Petition({ url, title, goal }: PetitionProps) {
  return (
    <aside className="petition-card my-8">
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: '#E85D33' }}>
          Pétition active
        </p>
        <h3 className="petition-card-title">{title}</h3>
        {goal && <p className="text-sm mt-1" style={{ color: '#3A3A3A' }}>{goal}</p>}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="cta-primary text-sm whitespace-nowrap"
      >
        Signer la pétition
      </a>
    </aside>
  )
}

interface CalloutProps {
  type?: 'info' | 'warning' | 'error'
  children: React.ReactNode
}

function Callout({ type = 'info', children }: CalloutProps) {
  const cls = `callout callout-${type}`
  return <div className={cls}>{children}</div>
}

interface EventDateProps {
  date: string
  location?: string
}

function EventDate({ date, location }: EventDateProps) {
  const formatted = new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return (
    <p className="event-date my-4">
      📅 {formatted}
      {location && <span className="ml-2 opacity-80">— {location}</span>}
    </p>
  )
}

export const mdxComponents: MDXRemoteProps['components'] = {
  // primitives
  h1: (props: React.ComponentProps<'h1'>) => <h1 className="text-3xl mt-10 mb-4" style={{ color: '#1F3A5F', fontFamily: 'var(--font-display, serif)', fontWeight: 700 }} {...props} />,
  h2: (props: React.ComponentProps<'h2'>) => <h2 className="text-2xl mt-10 mb-4" style={{ color: '#1F3A5F', fontFamily: 'var(--font-display, serif)', fontWeight: 700 }} {...props} />,
  h3: (props: React.ComponentProps<'h3'>) => <h3 className="text-xl mt-8 mb-3" style={{ color: '#1F3A5F', fontWeight: 600 }} {...props} />,
  h4: (props: React.ComponentProps<'h4'>) => <h4 className="text-lg mt-6 mb-2" style={{ color: '#1F3A5F', fontWeight: 600 }} {...props} />,
  p: (props: React.ComponentProps<'p'>) => <p className="mb-6 leading-relaxed" style={{ color: '#3A3A3A', fontSize: '1.06rem' }} {...props} />,
  ul: (props: React.ComponentProps<'ul'>) => <ul className="list-disc pl-6 mb-6" {...props} />,
  ol: (props: React.ComponentProps<'ol'>) => <ol className="list-decimal pl-6 mb-6" {...props} />,
  li: (props: React.ComponentProps<'li'>) => <li className="mb-2" style={{ color: '#3A3A3A' }} {...props} />,
  blockquote: (props: React.ComponentProps<'blockquote'>) => (
    <blockquote className="pl-4 italic my-6" style={{ color: '#1F3A5F', borderLeft: '4px solid #E85D33' }} {...props} />
  ),
  a: (props: React.ComponentProps<'a'>) => (
    <a className="transition-colors duration-300" style={{ color: '#E85D33', textDecoration: 'underline', textDecorationColor: 'rgba(232, 93, 51, 0.3)' }} {...props} />
  ),
  table: (props: React.ComponentProps<'table'>) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: React.ComponentProps<'th'>) => (
    <th className="px-4 py-3 font-semibold text-left" style={{ border: '1px solid rgba(31, 58, 95, 0.15)', background: 'rgba(232, 93, 51, 0.08)', color: '#1F3A5F' }} {...props} />
  ),
  td: (props: React.ComponentProps<'td'>) => (
    <td className="px-4 py-3" style={{ border: '1px solid rgba(31, 58, 95, 0.15)', color: '#3A3A3A' }} {...props} />
  ),
  hr: (props: React.ComponentProps<'hr'>) => (
    <hr className="my-8 border-0" style={{ borderTop: '1px solid rgba(31, 58, 95, 0.15)' }} {...props} />
  ),
  strong: (props: React.ComponentProps<'strong'>) => (
    <strong className="font-semibold" style={{ color: '#1F3A5F' }} {...props} />
  ),
  pre: (props: React.ComponentProps<'pre'>) => (
    <pre className="rounded-lg p-4 overflow-x-auto my-6" style={{ background: '#1F3A5F', color: '#FFF7F2' }} {...props} />
  ),
  code: (props: React.ComponentProps<'code'>) => (
    <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ background: 'rgba(232, 93, 51, 0.12)', color: '#C44818' }} {...props} />
  ),
  img: (props: React.ComponentProps<'img'>) => {
    const src = String(props.src ?? '')
    const alt = String(props.alt ?? '')
    if (!src) return null
    if (src.startsWith('/')) {
      return (
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={675}
          className="rounded-lg my-6 mx-auto"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      )
    }
    return <img className="rounded-lg my-6 mx-auto" {...props} alt={alt} />
  },

  // composants custom MDX VMG
  Petition,
  Callout,
  EventDate,
}
