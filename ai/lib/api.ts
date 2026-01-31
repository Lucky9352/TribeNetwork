import { Message } from '@/types'

/**
 * Sends messages to the chat API and returns the AI response.
 * @param messages - Array of messages representing the conversation history
 * @returns The AI-generated response content
 * @throws Error if the API request fails
 */
export interface ForumResult {
  title: string
  link: string
  snippet: string
  username: string
}

export interface ChatMetadata {
  intent?: string
  forumResults?: ForumResult[]
  suggestion?: {
    title: string
    content: string
    tag: string
    link: string
  }
}

export interface StreamCallbacks {
  onChunk: (chunk: string) => void
  onMetadata: (metadata: ChatMetadata) => void
}

/**
 * Sends messages to the chat API and handles the streaming response.
 * @param messages - Array of messages representing the conversation history
 * @param callbacks - Callbacks for token streaming and metadata
 * @returns The final full content string
 */
export async function getChatResponse(
  messages: Message[],
  callbacks?: StreamCallbacks
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.error || `API error: ${response.status}`)
  }

  if (!response.body) return ''

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullContent = ''
  let buffer = ''
  let isMetadataParsed = false

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk

      if (!isMetadataParsed) {
        const delimiterIndex = buffer.indexOf('\n__JSON_END__\n')
        if (delimiterIndex !== -1) {
          const jsonStr = buffer.slice(0, delimiterIndex)
          try {
            const metadata = JSON.parse(jsonStr)
            callbacks?.onMetadata(metadata)
          } catch (e) {
            console.error('Failed to parse metadata', e)
          }

          const rest = buffer.slice(delimiterIndex + '\n__JSON_END__\n'.length)
          buffer = ''
          isMetadataParsed = true

          if (rest) {
            fullContent += rest
            callbacks?.onChunk(rest)
          }
          continue
        }
      } else {
        fullContent += chunk
        callbacks?.onChunk(chunk)
      }
    }
  } finally {
    reader.releaseLock()
  }

  return fullContent
}
