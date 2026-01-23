/**
 * @file you-client.ts
 * @description Client for interacting with the You.com API.
 * Provides methods to perform web searches to supplement AI responses.
 */

const YOU_API_URL = 'https://ydc-index.io/v1/search'

export interface YouSearchResult {
  title: string
  url: string
  snippet: string
  thumbnail_url?: string
}

export interface YouApiResponse {
  results: {
    web?: {
      title: string
      url: string
      snippets: string[]
      thumbnail_url?: string
    }[]
    news?: {
      title: string
      url: string
      description: string
      thumbnail_url?: string
    }[]
  }
}

/**
 * Performs a web search using the You.com API.
 * @param query The search query string.
 * @param limit Number of results to return (default: 5).
 * @returns Promise<YouSearchResult[]>
 */
export async function searchWeb(
  query: string,
  limit: number = 5
): Promise<YouSearchResult[]> {
  const apiKey = process.env.YOU_API_KEY

  if (!apiKey) {
    return []
  }

  try {
    const response = await fetch(
      `${YOU_API_URL}?query=${encodeURIComponent(query)}&count=${limit}`,
      {
        headers: {
          'X-API-KEY': apiKey,
        },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = (await response.json()) as YouApiResponse

    const webResults = data.results?.web || []

    return webResults.map((hit) => ({
      title: hit.title,
      url: hit.url,
      snippet: hit.snippets?.[0] || '',
      thumbnail_url: hit.thumbnail_url,
    }))
  } catch {
    return []
  }
}
