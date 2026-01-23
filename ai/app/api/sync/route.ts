/**
 * @file route.ts
 * @description API Route for triggering post embedding sync.
 * Can be called by a cron job or webhook to keep embeddings up-to-date.
 */

import { NextResponse } from 'next/server'
import { RowDataPacket } from 'mysql2/promise'
import { query } from '@/lib/flarum-db'
import {
  generateEmbedding,
  cleanHtmlForEmbedding,
  preparePostForEmbedding,
} from '@/lib/embeddings'
import { prisma } from '@/lib/prisma'

/**
 * Internal API key for sync endpoint protection.
 */
const SYNC_API_KEY = process.env.SYNC_API_KEY || process.env.DEEPSEEK_API_KEY

/**
 * Maximum posts to sync per request (to avoid timeouts).
 */
const MAX_POSTS_PER_SYNC = 20

interface FlarumPostRow extends RowDataPacket {
  post_id: number
  discussion_id: number
  post_number: number
  content: string
  username: string
  discussion_title: string
  discussion_slug: string
  is_private: number
  created_at: Date
}

/**
 * POST /api/sync
 * Triggers an incremental sync of new Flarum posts to the vector database.
 *
 * Headers:
 *   x-api-key: Internal API key for authentication
 *
 * Response:
 *   { synced: number, lastPostId: number }
 */
export async function POST(req: Request): Promise<NextResponse> {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey || apiKey !== SYNC_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const syncState = await prisma.syncState.findUnique({
      where: { id: 'flarum_posts' },
    })
    const lastPostId = syncState?.lastPostId || 0

    const posts = await query<FlarumPostRow[]>(
      `SELECT 
        p.id as post_id,
        p.discussion_id,
        p.number as post_number,
        p.content,
        COALESCE(u.username, 'User') as username,
        d.title as discussion_title,
        d.slug as discussion_slug,
        d.is_private,
        p.created_at
      FROM flarum_posts p
      JOIN flarum_discussions d ON p.discussion_id = d.id
      LEFT JOIN flarum_users u ON p.user_id = u.id
      WHERE p.id > ?
        AND p.hidden_at IS NULL
        AND d.hidden_at IS NULL
        AND p.is_approved = 1
        AND p.type = 'comment'
        AND d.is_private = 0
      ORDER BY p.id ASC
      LIMIT ${MAX_POSTS_PER_SYNC}`,
      [lastPostId]
    )

    if (posts.length === 0) {
      return NextResponse.json({
        synced: 0,
        lastPostId,
        message: 'No new posts to sync',
      })
    }

    let syncedCount = 0
    let newLastId = lastPostId

    for (const post of posts) {
      try {
        const text = preparePostForEmbedding(
          post.discussion_title,
          post.content,
          post.username
        )

        const embedding = await generateEmbedding(text)
        const embeddingStr = `[${embedding.join(',')}]`

        await prisma.$executeRaw`
          INSERT INTO post_embeddings (
            id, 
            "flarumPostId", 
            "discussionId", 
            "postNumber",
            title, 
            slug, 
            content, 
            username, 
            "isPrivate", 
            "groupIds",
            "createdAt",
            "updatedAt",
            embedding
          ) VALUES (
            gen_random_uuid(),
            ${post.post_id},
            ${post.discussion_id},
            ${post.post_number || 1},
            ${post.discussion_title},
            ${post.discussion_slug},
            ${cleanHtmlForEmbedding(post.content)},
            ${post.username},
            ${Boolean(post.is_private)},
            ARRAY[]::integer[],
            NOW(),
            NOW(),
            ${embeddingStr}::vector
          )
          ON CONFLICT ("flarumPostId") 
          DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            embedding = EXCLUDED.embedding,
            "updatedAt" = NOW()
        `

        syncedCount++
        newLastId = post.post_id
      } catch {}
    }

    await prisma.syncState.upsert({
      where: { id: 'flarum_posts' },
      create: {
        id: 'flarum_posts',
        lastPostId: newLastId,
        postsIndexed: syncedCount,
      },
      update: {
        lastPostId: newLastId,
        postsIndexed: { increment: syncedCount },
        lastSyncedAt: new Date(),
      },
    })

    return NextResponse.json({
      synced: syncedCount,
      lastPostId: newLastId,
      message: `Successfully synced ${syncedCount} posts`,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/sync
 * Get current sync status.
 */
export async function GET(req: Request): Promise<NextResponse> {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey || apiKey !== SYNC_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const syncState = await prisma.syncState.findUnique({
      where: { id: 'flarum_posts' },
    })

    const embeddingCount = await prisma.postEmbedding.count()

    return NextResponse.json({
      lastSyncedAt: syncState?.lastSyncedAt,
      lastPostId: syncState?.lastPostId || 0,
      postsIndexed: syncState?.postsIndexed || 0,
      totalEmbeddings: embeddingCount,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    )
  }
}
