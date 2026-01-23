/**
 * @file embeddings.ts
 * @description OpenAI embedding generation service.
 * Converts text content to vector embeddings for semantic search.
 */

import OpenAI from 'openai'

/**
 * OpenAI client singleton.
 * Uses the same API key as the chat completions.
 */
let openaiClient: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured')
    }
    openaiClient = new OpenAI({ apiKey })
  }
  return openaiClient
}

/**
 * Embedding model configuration.
 * Using text-embedding-3-small for cost efficiency.
 * Dimension: 1536
 */
const EMBEDDING_MODEL = 'text-embedding-3-small'
const MAX_INPUT_LENGTH = 8000

/**
 * Generate an embedding vector for a single text.
 *
 * @param text - Text content to embed
 * @returns Embedding vector (1536 dimensions)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const openai = getOpenAI()

  const truncatedText = text.slice(0, MAX_INPUT_LENGTH)

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: truncatedText,
  })

  return response.data[0].embedding
}

/**
 * Generate embeddings for multiple texts in a batch.
 * More efficient than individual calls.
 *
 * @param texts - Array of text content to embed
 * @returns Array of embedding vectors
 */
export async function generateBatchEmbeddings(
  texts: string[]
): Promise<number[][]> {
  if (texts.length === 0) {
    return []
  }

  const openai = getOpenAI()

  const truncatedTexts = texts.map((text) => text.slice(0, MAX_INPUT_LENGTH))

  const batchSize = 100
  const results: number[][] = []

  for (let i = 0; i < truncatedTexts.length; i += batchSize) {
    const batch = truncatedTexts.slice(i, i + batchSize)

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
    })

    for (const item of response.data) {
      results.push(item.embedding)
    }
  }

  return results
}

/**
 * Clean HTML content for embedding.
 * Removes HTML tags and normalizes whitespace.
 *
 * @param html - HTML content from Flarum posts
 * @returns Clean text content
 */
export function cleanHtmlForEmbedding(html: string | null): string {
  if (!html) return ''

  let text = html.replace(/<[^>]+>/g, ' ')

  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))

  text = text.replace(/\s+/g, ' ').trim()

  return text
}

/**
 * Prepare post content for embedding.
 * Combines discussion title and post content for better context.
 *
 * @param discussionTitle - Title of the discussion
 * @param postContent - HTML content of the post
 * @param username - Author's username
 * @returns Formatted text for embedding
 */
export function preparePostForEmbedding(
  discussionTitle: string,
  postContent: string | null,
  username: string
): string {
  const cleanContent = cleanHtmlForEmbedding(postContent)

  return `Discussion: ${discussionTitle}\nBy: @${username}\nContent: ${cleanContent}`
}

/**
 * Calculate cosine similarity between two vectors.
 * Used for re-ranking search results.
 *
 * @param a - First vector
 * @param b - Second vector
 * @returns Similarity score between 0 and 1
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) return 0

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}
