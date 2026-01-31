import OpenAI from 'openai'
import type { TagInfo } from './tag-service'

const OPENAI_MODEL = 'gpt-4o-mini'
const DEEPSEEK_MODEL = 'deepseek-chat'
const DEEPSEEK_API_URL = 'https://api.deepseek.com'

/**
 * Uses an LLM to identify the most relevant tags for a given user query.
 *
 * @param query - The user's message/query
 * @param availableTags - List of all available tags
 * @returns Array of matched tags (empty if none relevant)
 */
export async function matchTags(
  query: string,
  availableTags: TagInfo[]
): Promise<TagInfo[]> {
  if (!query || availableTags.length === 0) {
    return []
  }

  const deepseekKey = process.env.DEEPSEEK_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  if (!deepseekKey && !openaiKey) {
    console.warn('No AI API key found, skipping smart tag matching')
    return []
  }

  const apiKey = deepseekKey || openaiKey
  const baseURL = deepseekKey ? DEEPSEEK_API_URL : undefined
  const model = deepseekKey ? DEEPSEEK_MODEL : OPENAI_MODEL

  const openai = new OpenAI({ apiKey, baseURL })

  const tagContext = availableTags
    .map(
      (t) =>
        `- ${t.name} (Slug: ${t.slug}): ${t.description || 'No description'}`
    )
    .join('\n')

  const systemPrompt = `You are a strict tag routing assistant.
Your goal is to map a user query to the most relevant forum tags from the provided list.

Available Tags:
${tagContext}

Rules:
1. Return ONLY a JSON array of the matched tag slugs. Example: ["professional", "jobs-freelance"]
2. If no tag is relevant, return [].
3. Be intelligent: Map concepts to their semantic tags (e.g. "dating" -> "confession").
4. Max 3 tags. Only choose if highly relevant. Example: "python error" -> "programming"`

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      temperature: 0,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0].message.content
    if (!content) return []

    const parsed = JSON.parse(content)
    const matchedSlugs = Array.isArray(parsed.tags)
      ? parsed.tags
      : Array.isArray(parsed)
        ? parsed
        : []

    return availableTags.filter((t) => matchedSlugs.includes(t.slug))
  } catch (error) {
    console.error('Tag matching failed:', error)
    return []
  }
}
