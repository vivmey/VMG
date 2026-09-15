/**
 * Keywords Parser — VMG (format simplifié)
 */

import type { Keyword } from '@/config/site.config'
import keywordsData from '@/data/keywords/index.json'

export interface KeywordJSON {
  id: string
  term: string
  slug: string
  category: string
  priority: 1 | 2 | 3
  volume: number
  competition: number
  trend?: number
}

export function parseKeywords(data: KeywordJSON[]): Keyword[] {
  return data.map((kw) => ({
    term: kw.term,
    volume: kw.volume,
    competition: kw.competition,
    trend: kw.trend,
    priority: kw.priority,
    category: kw.category,
  }))
}

export function getKeywords(): Keyword[] {
  return parseKeywords(keywordsData as KeywordJSON[])
}

export function getRawKeywords(): KeywordJSON[] {
  return keywordsData as KeywordJSON[]
}

export function filterByCategory(category: string): Keyword[] {
  return getKeywords().filter((kw) => kw.category === category)
}

export function filterByPriority(priority: 1 | 2 | 3): Keyword[] {
  return getKeywords().filter((kw) => kw.priority === priority)
}

export function getHighPriority(): Keyword[] {
  return filterByPriority(1)
}

export function searchKeywords(query: string): Keyword[] {
  const q = query.toLowerCase()
  return getKeywords().filter((kw) => kw.term.toLowerCase().includes(q))
}

export function getStats() {
  const keywords = getKeywords()
  return {
    total: keywords.length,
    byCategory: keywords.reduce(
      (acc, kw) => {
        acc[kw.category] = (acc[kw.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
    byPriority: {
      high: keywords.filter((kw) => kw.priority === 1).length,
      medium: keywords.filter((kw) => kw.priority === 2).length,
      low: keywords.filter((kw) => kw.priority === 3).length,
    },
  }
}
