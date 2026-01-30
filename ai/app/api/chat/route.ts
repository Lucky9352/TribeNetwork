/**
 * @file route.ts
 * @description API Route for Chat Completions with Flarum RAG Integration.
 * Handles interaction with the DeepSeek/OpenAI API with forum context.
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  buildForumContext,
  buildSystemPromptWithContext,
  ForumContext,
} from '@/lib/forum-context'
import { generatePostLink } from '@/lib/search'
import { searchWeb } from '@/lib/you-client'

/**
 * -----------------------------------------------------------------------------
 * CONFIGURATION & CONSTANTS
 * -----------------------------------------------------------------------------
 */

const API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
const API_URL =
  process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions'

/**
 * -----------------------------------------------------------------------------
 * VALIDATION SCHEMAS (ZOD)
 * -----------------------------------------------------------------------------
 */

const ClientMessageSchema = z.object({
  type: z.enum(['user', 'ai', 'system']),
  content: z.string().trim().min(1, 'Message content cannot be empty'),
})

const RequestBodySchema = z.object({
  messages: z
    .array(ClientMessageSchema)
    .min(1, 'At least one message is required')
    .max(50, 'Too many messages in history'),
})

/**
 * -----------------------------------------------------------------------------
 * INTERFACES
 * -----------------------------------------------------------------------------
 */

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface DeepSeekResponse {
  id: string
  choices: {
    index: number
    message: DeepSeekMessage
    finish_reason: string
  }[]
  usage?: {
    total_tokens: number
  }
  error?: {
    message: string
    code?: string
  }
}

interface ForumResult {
  title: string
  link: string
  snippet: string
  username: string
}

interface PostSuggestionResponse {
  title: string
  content: string
  tag: string
  link: string
}

interface ChatApiResponse {
  content: string
  forumResults?: ForumResult[]
  suggestion?: PostSuggestionResponse
  intent?: string
}

/**
 * -----------------------------------------------------------------------------
 * API HANDLER
 * -----------------------------------------------------------------------------
 */

/**
 * POST /api/chat
 * Handles chat completions with Flarum RAG integration.
 *
 * Features:
 * - Forum content search for context
 * - User authentication awareness
 * - Post creation suggestions
 * - Deep links to discussions
 *
 * @param {Request} req - The incoming HTTP request.
 * @returns {Promise<NextResponse>} JSON response containing the AI reply with forum context.
 */
export async function POST(req: Request): Promise<NextResponse> {
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Server configuration error: Missing API Key' },
      { status: 500 }
    )
  }

  try {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const validationResult = RequestBodySchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map(
          (e: z.ZodError['issues'][number]) =>
            `${e.path.join('.')}: ${e.message}`
        )
        .join(', ')
      return NextResponse.json(
        { error: `Validation Error: ${errors}` },
        { status: 400 }
      )
    }

    const { messages } = validationResult.data

    const latestUserMessage = [...messages]
      .reverse()
      .find((m) => m.type === 'user')

    let forumContext: ForumContext | null = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let webResults: any[] = []

    try {
      if (latestUserMessage) {
        const [contextResult, webSearchResult] = await Promise.all([
          buildForumContext(req, latestUserMessage.content),
          latestUserMessage.content.length > 3
            ? searchWeb(latestUserMessage.content)
            : Promise.resolve([]),
        ])

        forumContext = contextResult
        webResults = webSearchResult

        if (forumContext) {
          forumContext.webResults = webResults
        }
      }
    } catch {}

    const systemPrompt = forumContext
      ? buildSystemPromptWithContext(forumContext)
      : getDefaultSystemPrompt()

    const upstreamMessages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages.map((msg) => ({
        role: (msg.type === 'ai' ? 'assistant' : 'user') as
          | 'assistant'
          | 'user',
        content: msg.content,
      })),
    ]

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: upstreamMessages,
        temperature: 0.7,
        max_tokens: 800,
        top_p: 0.9,
        presence_penalty: 0.4,
        frequency_penalty: 0.2,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        error?: { message?: string }
      }
      const errorMessage =
        errorData?.error?.message ||
        `Upstream API error: ${response.status} ${response.statusText}`

      const status = response.status === 429 ? 429 : 502
      return NextResponse.json({ error: errorMessage }, { status })
    }

    const data = (await response.json()) as DeepSeekResponse
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('Received empty response from AI provider')
    }

    const apiResponse: ChatApiResponse = {
      content,
      intent: forumContext?.intent,
    }

    if (forumContext?.searchResults && forumContext.searchResults.length > 0) {
      apiResponse.forumResults = forumContext.searchResults.map((r) => ({
        title: r.discussionTitle,
        link: generatePostLink(r.discussionId, r.discussionSlug, r.postNumber),
        snippet:
          r.content.slice(0, 150) + (r.content.length > 150 ? '...' : ''),
        username: r.username,
      }))
    }

    if (forumContext?.suggestion) {
      apiResponse.suggestion = forumContext.suggestion
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}

/**
 * Get the default system prompt when forum context is not available.
 */
function getDefaultSystemPrompt(): string {
  return `You are TribeAI, a helpful and friendly AI assistant for the JAIN University community forum (Tribe).

Your personality:
- Warm, approachable, and encouraging
- Use relevant emojis to make responses engaging
- Keep responses concise but helpful
- Always maintain a positive community vibe

You help students with:
- Finding people with similar interests
- Academic questions and resources
- Career and placement guidance
- General community engagement

Forum URL: ${process.env.FLARUM_URL || 'https://tribe-community.vercel.app'}

When you don't have specific forum content, encourage users to:
1. Check the forum directly for discussions
2. Create a new post to engage the community
3. Connect with fellow students

Keep responses natural, well-spaced, and conversational.`
}
