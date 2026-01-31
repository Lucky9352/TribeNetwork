const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

/**
 * Expands a user query into a set of related search terms.
 *
 * @param query - The original user query
 * @returns Array of strings (original query + expansions)
 */
export async function expandQuery(query: string): Promise<string[]> {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY

  if (!apiKey) return [query]

  const apiUrl = process.env.DEEPSEEK_API_KEY
    ? DEEPSEEK_API_URL
    : 'https://api.openai.com/v1/chat/completions'

  const model = process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-4o-mini'

  const systemPrompt = `You are a search query optimizer.
  Generate 2-3 alternative search queries for the user's input to improve retrieval.
  Focus on:
  - Synonyms (e.g., "startup" -> "entrepreneurship")
  - Related concepts (e.g., "coding" -> "programming", "software development")
  - Removing conversational noise (e.g., "tell me about..." -> "")

  Return ONLY a JSON array of strings. Example: ["startup", "entrepreneurship", "business"]`

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(50000),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) return [query]

    const parsed = JSON.parse(content)
    const expansions = Array.isArray(parsed.queries)
      ? parsed.queries
      : Array.isArray(parsed)
        ? parsed
        : []

    return Array.from(new Set([query, ...expansions])).slice(0, 4)
  } catch {
    return [query]
  }
}
