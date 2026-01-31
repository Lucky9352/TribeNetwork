import OpenAI from 'openai'

const EXPANSION_MODEL = 'gpt-4o-mini'

/**
 * Expands a user query into a set of related search terms.
 *
 * @param query - The original user query
 * @returns Array of strings (original query + expansions)
 */
export async function expandQuery(query: string): Promise<string[]> {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
  const baseURL = process.env.DEEPSEEK_API_KEY
    ? 'https://api.deepseek.com'
    : undefined
  const model = process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : EXPANSION_MODEL

  if (!apiKey) return [query]

  const openai = new OpenAI({ apiKey, baseURL })

  const systemPrompt = `You are a search query optimizer.
  Generate 2-3 alternative search queries for the user's input to improve retrieval.
  Focus on:
  - Synonyms (e.g., "startup" -> "entrepreneurship")
  - Related concepts (e.g., "coding" -> "programming", "software development")
  - Removing conversational noise (e.g., "tell me about..." -> "")

  Return ONLY a JSON array of strings. Example: ["startup", "entrepreneurship", "business"]`

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0].message.content
    if (!content) return [query]

    const parsed = JSON.parse(content)
    const expansions = Array.isArray(parsed.queries)
      ? parsed.queries
      : Array.isArray(parsed)
        ? parsed
        : []

    return Array.from(new Set([query, ...expansions])).slice(0, 4)
  } catch (error) {
    console.warn('Query expansion failed, using original query', error)
    return [query]
  }
}
