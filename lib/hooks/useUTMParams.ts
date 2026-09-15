/**
 * Hook to extract UTM parameters from URL
 * Uses window.location instead of useSearchParams to avoid Suspense requirement
 */

'use client'

import { useState, useEffect } from 'react'
import type { LeadSource } from '@/lib/types/forms'

export function useUTMParams(): Omit<LeadSource, 'pageUrl'> {
  const [utmParams, setUtmParams] = useState<Omit<LeadSource, 'pageUrl'>>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setUtmParams({
        utmSource: params.get('utm_source') || undefined,
        utmMedium: params.get('utm_medium') || undefined,
        utmCampaign: params.get('utm_campaign') || undefined,
        utmTerm: params.get('utm_term') || undefined,
        utmContent: params.get('utm_content') || undefined,
      })
    }
  }, [])

  return utmParams
}
