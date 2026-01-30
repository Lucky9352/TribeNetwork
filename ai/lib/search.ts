/**
 * @file search.ts
 * @description Optimized FULLTEXT search for Flarum forum content.
 * Provides comprehensive forum content retrieval for RAG context.
 */

import { RowDataPacket } from 'mysql2/promise'
import { query } from './flarum-db'
import { cleanHtmlForEmbedding } from './embeddings'
import type { FlarumSearchResult } from './flarum-types'

/**
 * Search options for forum search.
 */
export interface SearchOptions {
  query: string
  userId?: number | null
  userGroups?: number[]
  limit?: number
  includePrivate?: boolean
}

/**
 * Flarum URL for generating post links.
 */
const FLARUM_URL =
  process.env.NEXT_PUBLIC_FLARUM_URL || 'https://tribe-community.vercel.app'

/**
 * Perform a comprehensive FULLTEXT search across all forum posts.
 * Optimized to consider both relevance AND recency.
 *
 * @param options - Search options
 * @returns Ranked search results with forum context
 */
export async function hybridSearch(
  options: SearchOptions
): Promise<FlarumSearchResult[]> {
  const { query: searchQuery, userId, userGroups = [], limit = 10 } = options

  const results = await fulltextSearch(searchQuery, limit)

  return applyPrivacyFilter(results, userId, userGroups)
}

/**
 * MySQL FULLTEXT search on flarum_posts.
 * Searches across ALL posts. Pure relevance scoring - no recency penalty
 * since all historical content is valuable.
 */
async function fulltextSearch(
  searchQuery: string,
  limit: number
): Promise<FlarumSearchResult[]> {
  try {
    interface PostRow extends RowDataPacket {
      post_id: number
      discussion_id: number
      discussion_title: string
      discussion_slug: string
      post_number: number
      content: string
      username: string
      nickname: string | null
      created_at: Date
      is_private: number
      relevance: number
    }

    const searchTerms = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length >= 2)
      .slice(0, 10)

    const fulltextQuery = searchTerms.join(' ')

    const likeConditions = searchTerms
      .slice(0, 5)
      .map(() => 'LOWER(p.content) LIKE ?')
      .join(' OR ')

    const likeParams = searchTerms.slice(0, 5).map((t) => `%${t}%`)

    const rows = await query<PostRow[]>(
      `SELECT 
        p.id as post_id,
        p.discussion_id,
        d.title as discussion_title,
        d.slug as discussion_slug,
        p.number as post_number,
        p.content,
        u.username,
        u.nickname,
        p.created_at,
        d.is_private,
        MATCH(p.content) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
      FROM flarum_posts p
      JOIN flarum_discussions d ON p.discussion_id = d.id
      LEFT JOIN flarum_users u ON p.user_id = u.id
      WHERE (
        MATCH(p.content) AGAINST(? IN NATURAL LANGUAGE MODE)
        ${likeConditions ? `OR (${likeConditions})` : ''}
      )
        AND p.hidden_at IS NULL
        AND d.hidden_at IS NULL
        AND p.is_approved = 1
        AND p.type = 'comment'
        AND d.is_private = 0
      ORDER BY relevance DESC
      LIMIT ${Math.min(Math.max(1, limit), 50)}`,
      [fulltextQuery, fulltextQuery, ...likeParams]
    )

    return rows.map((row) => ({
      postId: row.post_id,
      discussionId: row.discussion_id,
      discussionTitle: row.discussion_title,
      discussionSlug: row.discussion_slug,
      postNumber: row.post_number,
      content: cleanHtmlForEmbedding(row.content),
      username: row.username || 'User',
      nickname: row.nickname,
      createdAt: row.created_at,
      tagIds: [],
      tagNames: [],
      isPrivate: Boolean(row.is_private),
      score: row.relevance || 0.5,
    }))
  } catch {
    return fallbackSearch(searchQuery, limit)
  }
}

/**
 * Fallback search using LIKE when FULLTEXT is unavailable.
 */
async function fallbackSearch(
  searchQuery: string,
  limit: number
): Promise<FlarumSearchResult[]> {
  try {
    interface PostRow extends RowDataPacket {
      post_id: number
      discussion_id: number
      discussion_title: string
      discussion_slug: string
      post_number: number
      content: string
      username: string
      nickname: string | null
      created_at: Date
      is_private: number
    }

    const searchTerms = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length >= 2)
      .slice(0, 5)

    if (searchTerms.length === 0) {
      return getRecentPosts(limit)
    }

    const contentConditions = searchTerms
      .map(() => 'LOWER(p.content) LIKE ?')
      .join(' OR ')
    const titleConditions = searchTerms
      .map(() => 'LOWER(d.title) LIKE ?')
      .join(' OR ')

    const whereClause = `(${contentConditions} OR ${titleConditions})`

    const likeParams = [
      ...searchTerms.map((t) => `%${t}%`),
      ...searchTerms.map((t) => `%${t}%`),
    ]

    const rows = await query<PostRow[]>(
      `SELECT 
        p.id as post_id,
        p.discussion_id,
        d.title as discussion_title,
        d.slug as discussion_slug,
        p.number as post_number,
        p.content,
        u.username,
        u.nickname,
        p.created_at,
        d.is_private
      FROM flarum_posts p
      JOIN flarum_discussions d ON p.discussion_id = d.id
      LEFT JOIN flarum_users u ON p.user_id = u.id
      WHERE ${whereClause}
        AND p.hidden_at IS NULL
        AND d.hidden_at IS NULL
        AND p.is_approved = 1
        AND p.type = 'comment'
        AND d.is_private = 0
      ORDER BY p.created_at DESC
      LIMIT ${Math.min(limit, 50)}`,
      likeParams
    )

    return rows.map((row) => ({
      postId: row.post_id,
      discussionId: row.discussion_id,
      discussionTitle: row.discussion_title,
      discussionSlug: row.discussion_slug,
      postNumber: row.post_number,
      content: cleanHtmlForEmbedding(row.content),
      username: row.username || 'User',
      nickname: row.nickname,
      createdAt: row.created_at,
      tagIds: [],
      tagNames: [],
      isPrivate: Boolean(row.is_private),
      score: 0.5,
    }))
  } catch {
    return []
  }
}

/**
 * Get recent posts when search has no valid terms.
 */
async function getRecentPosts(limit: number): Promise<FlarumSearchResult[]> {
  try {
    interface PostRow extends RowDataPacket {
      post_id: number
      discussion_id: number
      discussion_title: string
      discussion_slug: string
      post_number: number
      content: string
      username: string
      nickname: string | null
      created_at: Date
    }

    const rows = await query<PostRow[]>(
      `SELECT 
        p.id as post_id,
        p.discussion_id,
        d.title as discussion_title,
        d.slug as discussion_slug,
        p.number as post_number,
        p.content,
        u.username,
        u.nickname,
        p.created_at
      FROM flarum_posts p
      JOIN flarum_discussions d ON p.discussion_id = d.id
      LEFT JOIN flarum_users u ON p.user_id = u.id
      WHERE p.hidden_at IS NULL
        AND d.hidden_at IS NULL
        AND p.is_approved = 1
        AND p.type = 'comment'
        AND d.is_private = 0
        AND p.number = 1
      ORDER BY p.created_at DESC
      LIMIT ${Math.min(limit, 20)}`,
      []
    )

    return rows.map((row) => ({
      postId: row.post_id,
      discussionId: row.discussion_id,
      discussionTitle: row.discussion_title,
      discussionSlug: row.discussion_slug,
      postNumber: row.post_number,
      content: cleanHtmlForEmbedding(row.content),
      username: row.username || 'User',
      nickname: row.nickname,
      createdAt: row.created_at,
      tagIds: [],
      tagNames: [],
      isPrivate: false,
      score: 0.3,
    }))
  } catch {
    return []
  }
}

/**
 * Apply privacy filtering based on user authentication.
 */
function applyPrivacyFilter(
  results: FlarumSearchResult[],
  userId: number | null | undefined,
  _userGroups: number[]
): FlarumSearchResult[] {
  return results.map((result) => {
    if (!result.isPrivate) {
      return result
    }

    if (!userId) {
      return {
        ...result,
        content: '',
        isTeaser: true,
        teaserMessage: '🔒 This discussion is private. Sign in to view.',
      }
    }

    return result
  })
}

/**
 * Generate a direct link to a forum post.
 */
export function generatePostLink(
  discussionId: number,
  slug: string,
  postNumber: number
): string {
  const baseUrl = `${FLARUM_URL}/discussions/${discussionId}`

  if (postNumber > 1) {
    return `${baseUrl}#post-${postNumber}`
  }

  return baseUrl
}

/**
 * Format search results for display in AI context.
 * Provides rich context for the LLM to work with.
 */
export function formatResultsForContext(results: FlarumSearchResult[]): string {
  if (results.length === 0) {
    return ''
  }

  return results
    .map((r, i) => {
      const link = generatePostLink(
        r.discussionId,
        r.discussionSlug,
        r.postNumber
      )
      const snippet =
        r.content.slice(0, 400) + (r.content.length > 400 ? '...' : '')
      const date = new Date(r.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })

      return `[${i + 1}] "${r.discussionTitle}"
By: @${r.username} | Date: ${date}
Content: "${snippet}"
Link: ${link}`
    })
    .join('\n\n')
}

/**
 * Search for discussions by tag.
 */
export async function searchByTag(
  tagSlug: string,
  limit: number = 5
): Promise<FlarumSearchResult[]> {
  try {
    interface PostRow extends RowDataPacket {
      post_id: number
      discussion_id: number
      discussion_title: string
      discussion_slug: string
      post_number: number
      content: string
      username: string
      nickname: string | null
      created_at: Date
    }

    const rows = await query<PostRow[]>(
      `SELECT 
        p.id as post_id,
        p.discussion_id,
        d.title as discussion_title,
        d.slug as discussion_slug,
        p.number as post_number,
        p.content,
        u.username,
        u.nickname,
        p.created_at
      FROM flarum_posts p
      JOIN flarum_discussions d ON p.discussion_id = d.id
      JOIN flarum_discussion_tag dt ON d.id = dt.discussion_id
      JOIN flarum_tags t ON dt.tag_id = t.id
      LEFT JOIN flarum_users u ON p.user_id = u.id
      WHERE t.slug = ?
        AND p.hidden_at IS NULL
        AND d.hidden_at IS NULL
        AND d.is_private = 0
        AND p.is_approved = 1
        AND p.type = 'comment'
        AND p.number = 1
      ORDER BY p.created_at DESC
      LIMIT ${Math.min(Math.max(1, limit), 50)}`,
      [tagSlug]
    )

    return rows.map((row) => ({
      postId: row.post_id,
      discussionId: row.discussion_id,
      discussionTitle: row.discussion_title,
      discussionSlug: row.discussion_slug,
      postNumber: row.post_number,
      content: cleanHtmlForEmbedding(row.content),
      username: row.username || 'User',
      nickname: row.nickname,
      createdAt: row.created_at,
      tagIds: [],
      tagNames: [],
      isPrivate: false,
      score: 1,
    }))
  } catch {
    return []
  }
}
