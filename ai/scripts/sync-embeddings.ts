/**
 * @file sync-embeddings.ts
 * @description Synchronize Flarum posts to vector database.
 * Run this script to index existing posts and set up incremental sync.
 *
 * Usage:
 *   npx tsx scripts/sync-embeddings.ts [--full]
 *
 * Options:
 *   --full    Force full re-sync of all posts (default: incremental)
 */

import 'dotenv/config'
import { RowDataPacket } from 'mysql2/promise'
import { getFlarumDb, closePool, query } from '../lib/flarum-db'
import {
  generateBatchEmbeddings,
  cleanHtmlForEmbedding,
  preparePostForEmbedding,
} from '../lib/embeddings'
import { prisma } from '../lib/prisma'

/**
 * Configuration
 */
const BATCH_SIZE = 50
const EMBEDDING_BATCH_SIZE = 20

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
 * Main sync function
 */
async function syncEmbeddings(fullSync: boolean = false) {
  try {
    const db = getFlarumDb()
    await db.query('SELECT 1')

    await prisma.$queryRaw`SELECT 1`

    try {
      await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS vector`
    } catch {}

    try {
      await prisma.$executeRaw`
        ALTER TABLE post_embeddings 
        ADD COLUMN IF NOT EXISTS embedding vector(1536)
      `
    } catch {}

    let lastPostId = 0
    if (!fullSync) {
      const syncState = await prisma.syncState.findUnique({
        where: { id: 'flarum_posts' },
      })
      if (syncState) {
        lastPostId = syncState.lastPostId
      }
    } else {
      await prisma.postEmbedding.deleteMany({})
    }

    interface CountRow extends RowDataPacket {
      count: number
    }
    const countResult = await query<CountRow[]>(
      `SELECT COUNT(*) as count 
       FROM flarum_posts p
       JOIN flarum_discussions d ON p.discussion_id = d.id
       WHERE p.id > ?
         AND p.hidden_at IS NULL
         AND d.hidden_at IS NULL
         AND p.is_approved = 1
         AND p.type = 'comment'
         AND d.is_private = 0`,
      [lastPostId]
    )
    const totalPosts = countResult[0].count

    if (totalPosts === 0) {
      return
    }

    let processedCount = 0
    let currentLastId = lastPostId

    while (processedCount < totalPosts) {
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
        LIMIT ${BATCH_SIZE}`,
        [currentLastId]
      )

      if (posts.length === 0) break

      const textsToEmbed = posts.map((post) =>
        preparePostForEmbedding(
          post.discussion_title,
          post.content,
          post.username
        )
      )

      const allEmbeddings: number[][] = []

      for (let i = 0; i < textsToEmbed.length; i += EMBEDDING_BATCH_SIZE) {
        const batch = textsToEmbed.slice(i, i + EMBEDDING_BATCH_SIZE)
        const embeddings = await generateBatchEmbeddings(batch)
        allEmbeddings.push(...embeddings)
        process.stdout.write(
          `   Progress: ${allEmbeddings.length}/${textsToEmbed.length}\r`
        )
      }

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i]
        const embedding = allEmbeddings[i]
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
      }

      currentLastId = posts[posts.length - 1].post_id
      processedCount += posts.length

      await prisma.syncState.upsert({
        where: { id: 'flarum_posts' },
        create: {
          id: 'flarum_posts',
          lastPostId: currentLastId,
          postsIndexed: processedCount,
        },
        update: {
          lastPostId: currentLastId,
          postsIndexed: processedCount,
          lastSyncedAt: new Date(),
        },
      })
    }
  } catch (error) {
    throw error
  } finally {
    await closePool()
    await prisma.$disconnect()
  }
}

const fullSync = process.argv.includes('--full')

syncEmbeddings(fullSync)
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
