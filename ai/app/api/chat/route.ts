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

interface ForumResult {
  title: string
  link: string
  snippet: string
  username: string
  createdAt?: string
  score?: number
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
export async function POST(req: Request): Promise<Response> {
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
        stream: true,
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

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        const metadata: Partial<ChatApiResponse> = {
          intent: forumContext?.intent,
          forumResults: forumContext?.searchResults?.map((r) => ({
            title: r.discussionTitle,
            link: generatePostLink(
              r.discussionId,
              r.discussionSlug,
              r.postNumber
            ),
            snippet:
              r.content.slice(0, 150) + (r.content.length > 150 ? '...' : ''),
            username: r.username,
            createdAt: r.createdAt
              ? new Date(r.createdAt).toISOString()
              : undefined,
            score: r.score,
          })),
          suggestion: forumContext?.suggestion
            ? forumContext.suggestion
            : undefined,
          content: '',
        }
        controller.enqueue(
          encoder.encode(JSON.stringify(metadata) + '\n__JSON_END__\n')
        )

        if (!response.body) {
          controller.close()
          return
        }
        const reader = response.body.getReader()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n').filter((l) => l.trim() !== '')

            for (const line of lines) {
              if (line.includes('[DONE]')) continue
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6))
                  const content = data.choices[0]?.delta?.content
                  if (content) {
                    controller.enqueue(encoder.encode(content))
                  }
                } catch {}
              }
            }
          }
        } catch (e) {
          console.error('Streaming error', e)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
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

Forum URL: ${process.env.NEXT_PUBLIC_FLARUM_URL || 'https://tribe-community.vercel.app'}

When you don't have specific forum content, encourage users to:
1. Check the forum directly for discussions
2. Create a new post to engage the community
3. Connect with fellow students

Keep responses natural, well-spaced, and conversational.`
}
