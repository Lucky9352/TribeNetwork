import { query } from './flarum-db'
import type { RowDataPacket } from 'mysql2'

/**
 * Simplified tag interface for caching and matching.
 */
export interface TagInfo {
  id: number
  name: string
  slug: string
  description: string | null
}

let cachedTags: TagInfo[] | null = null
let lastFetchTime = 0
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

/**
 * Fetch all visible tags from the Flarum database.
 * Uses a simple in-memory cache to reduce DB load.
 */
export async function getAllTags(): Promise<TagInfo[]> {
  const now = Date.now()

  if (cachedTags && now - lastFetchTime < CACHE_TTL) {
    return cachedTags
  }

  try {
    const tags = await query<(TagInfo & RowDataPacket)[]>(
      `SELECT id, name, slug, description 
       FROM flarum_tags 
       WHERE is_hidden = 0 
       ORDER BY position ASC`
    )

    cachedTags = tags.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      description: t.description,
    }))

    lastFetchTime = now
    return cachedTags
  } catch (error) {
    console.error('Failed to fetch tags:', error)
    return []
  }
}
