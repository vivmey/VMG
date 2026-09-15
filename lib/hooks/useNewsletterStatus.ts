/**
 * Hook to check and manage newsletter subscription status via localStorage
 */

'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'newsletter_subscribed'

export function useNewsletterStatus() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      setIsSubscribed(stored === 'true')
      setIsLoading(false)
    }
  }, [])

  const setSubscribed = useCallback((value: boolean) => {
    if (typeof window !== 'undefined') {
      if (value) {
        localStorage.setItem(STORAGE_KEY, 'true')
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
      setIsSubscribed(value)
    }
  }, [])

  return { isSubscribed, setSubscribed, isLoading }
}
