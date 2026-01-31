import OpenAI from 'openai'
import type { FlarumSearchResult } from './flarum-types'

const RERANK_MODEL = 'gpt-4o-mini'

/**
 * Reranks search results using an LLM to determine semantic relevance.
 *
 * @param query - User's search query
 * @param results - Array of search results
 * @param topK - Number of results to keep (default: 5)
 * @returns Reranked and filtered results
 */
export async function rerankResults(
  query: string,
  results: FlarumSearchResult[],
  topK: number = 5
): Promise<FlarumSearchResult[]> {
  if (results.length <= 1) return results

  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
  const baseURL = process.env.DEEPSEEK_API_KEY
    ? 'https://api.deepseek.com'
    : undefined
  const model = process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : RERANK_MODEL

  if (!apiKey) return results.slice(0, topK)

  const openai = new OpenAI({ apiKey, baseURL })

  // Prepare input for LLM
  const contextItems = results.map((r, i) => ({
    id: i,
    content: `Title: ${r.discussionTitle}\nSnippet: ${r.content.slice(0, 300)}`,
  }))

  const systemPrompt = `You are a Relevance Reranking Evaluator.
Given a user query and a list of forum posts, select the indices of the posts that are RELEVANT to the query.
Rank them from most relevant to least.

Rules:
1. Return JSON: { "relevant_indices": [2, 0, 4] }
2. Exclude clearly irrelevant posts.
3. If minimal relevance, include it anyway.
4. Max ${topK} indices.`

  const userPrompt = `Query: "${query}"

Posts:
${contextItems.map((item) => `[${item.id}] ${item.content}`).join('\n\n')}`

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0].message.content
    if (!content) return results.slice(0, topK)

    const parsed = JSON.parse(content)
    const indices = parsed.relevant_indices as number[]

    if (!Array.isArray(indices)) return results.slice(0, topK)

    const reranked = indices
      .map((i) => results[i])
      .filter((r) => r !== undefined)

    if (reranked.length === 0 && results.length > 0) {
      return results.slice(0, topK)
    }

    return reranked
  } catch {
    return results.slice(0, topK)
  }
}
