/**
 * Hook to get current page URL
 */

'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function usePageUrl(): string {
  const pathname = usePathname()
  const [fullUrl, setFullUrl] = useState(pathname)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(window.location.href)
    }
  }, [pathname])

  return fullUrl
}
