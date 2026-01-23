import { Message } from '@/types'

/**
 * @file api.ts
 * @description Client-side API utilities for communicating with the chat backend.
 */

/** Response structure from the chat API */
interface ChatApiResponse {
  content: string
}

/** Error response structure from the chat API */
interface ChatApiErrorResponse {
  error?: string
}

/**
 * Sends messages to the chat API and returns the AI response.
 * @param messages - Array of messages representing the conversation history
 * @returns The AI-generated response content
 * @throws Error if the API request fails
 */
export async function getChatResponse(messages: Message[]): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    const errorData: ChatApiErrorResponse | null = await response
      .json()
      .catch(() => null)
    const message =
      errorData?.error || `API request failed with status ${response.status}`
    throw new Error(message)
  }

  const data: ChatApiResponse = await response.json()
  return data.content
}
