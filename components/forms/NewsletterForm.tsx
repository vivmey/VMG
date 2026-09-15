/**
 * Newsletter Form — VMG (optionnel)
 * Pass-through vers /api/newsletter qui forward à Resend.
 * Si la newsletter n'est pas activée (RESEND_API_KEY non défini), ne pas inclure dans l'UI.
 */

'use client'

import { useState, FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { useNewsletterStatus } from '@/lib/hooks/useNewsletterStatus'

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'duplicate'

interface Props {
  variant?: 'footer' | 'inline'
}

export default function NewsletterForm({ variant = 'footer' }: Props) {
  const t = useTranslations('newsletter')
  const { isSubscribed, setSubscribed, isLoading } = useNewsletterStatus()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  if (isLoading) return null
  if (isSubscribed) {
    return (
      <p className="text-sm" style={{ color: 'rgba(255, 247, 242, 0.7)' }}>
        {t('alreadySubscribed')}
      </p>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.status === 409) { setStatus('duplicate'); return }
      if (!res.ok) { setStatus('error'); return }
      setStatus('success')
      setSubscribed(true)
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  const inputCls = variant === 'footer' ? 'input-dark flex-1' : 'input-light flex-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          className={inputCls}
          maxLength={150}
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={variant === 'footer' ? 'cta-secondary text-sm px-4 py-2' : 'cta-primary text-sm px-4 py-2'}
        >
          {status === 'submitting' ? t('submitting') : t('submit')}
        </button>
      </div>
      {status === 'success' && <p className="text-sm" style={{ color: '#2D8F6F' }}>{t('success')}</p>}
      {status === 'duplicate' && <p className="text-sm" style={{ color: '#92660E' }}>{t('alreadySubscribed')}</p>}
      {status === 'error' && <p className="text-sm" style={{ color: '#C44818' }}>{t('error')}</p>}
    </form>
  )
}
