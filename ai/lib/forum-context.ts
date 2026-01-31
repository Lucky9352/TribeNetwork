/**
 * @file forum-context.ts
 * @description Optimized forum context building for RAG integration.
 * Prepares Flarum content as context for AI responses with improved prompts.
 */

import { hybridSearch, formatResultsForContext, searchByTag } from './search'
import {
  validateFlarumSession,
  extractFlarumToken,
  AuthenticatedUser,
} from './flarum-auth'
import type { FlarumSearchResult } from './flarum-types'
import type { TagInfo } from './tag-service'
import { getAllTags } from './tag-service'
import { matchTags } from './tag-matcher'
import { expandQuery } from './query-expander'
import { rerankResults } from './reranker'
import { PostSuggestion } from '@/types'

/**
 * Classification of user intent.
 */
export type UserIntent = 'forum_search' | 'general_question' | 'greeting'

/**
 * Forum context for RAG.
 */
export interface ForumContext {
  intent: UserIntent
  searchResults: FlarumSearchResult[]
  formattedContext: string
  suggestion?: PostSuggestion
  user: AuthenticatedUser | null
  webResults?: { title: string; url: string; snippet: string }[]
}

/**
 * Classify the user's intent from their message.
 * OPTIMIZED: More aggressive forum search for community relevance.
 *
 * @param message - User's message
 * @returns Classified intent
 */
export function classifyIntent(message: string): UserIntent {
  const lowerMessage = message.toLowerCase().trim()

  if (
    /^(hi|hello|hey|yo|sup|hii+|heyy+|good\s*(morning|afternoon|evening))[\s!.,?]*$/i.test(
      lowerMessage
    )
  ) {
    return 'greeting'
  }

  const pureKnowledgePatterns = [
    /^what\s+is\s+(the\s+)?(definition|meaning)\s+of\b/i,
    /^(define|explain|describe)\s+the\s+(concept|term|word)\b/i,
    /^(who|what|when|where)\s+(is|was|were|are)\s+[a-z]+\s*(in\s+history)?$/i,
    /^how\s+(does|do)\s+[a-z]+\s+work\s*\?*$/i,
    /^what\s+year\s+(did|was)\b/i,
    /^(calculate|compute|solve)\b/i,
  ]

  for (const pattern of pureKnowledgePatterns) {
    if (pattern.test(lowerMessage)) {
      return 'general_question'
    }
  }

  return 'forum_search'
}

/**
 * Build forum context for a user message.
 * OPTIMIZED: Always search for forum_search intent with increased limit.
 *
 * @param request - HTTP request (for auth token extraction)
 * @param message - User's message
 * @returns Forum context for RAG
 */
export async function buildForumContext(
  request: Request | null,
  message: string
): Promise<ForumContext> {
  let user: AuthenticatedUser | null = null
  if (request) {
    const token = extractFlarumToken(request)
    const auth = await validateFlarumSession(token)
    user = auth.user
  }

  const intent = classifyIntent(message)

  if (intent === 'greeting') {
    return { intent, searchResults: [], formattedContext: '', user }
  }

  if (intent === 'general_question') {
    const availableTags = await getAllTags()
    return {
      intent,
      searchResults: [],
      formattedContext: '',
      user,
      suggestion: await generatePostSuggestion(message, availableTags, []),
    }
  }

  /*
   * 1. Smart Tag Matching
   * Identify relevant tags based on user query to fetch highly specific content.
   */
  const availableTags = await getAllTags()
  const matchedTags = await matchTags(message, availableTags)

  /*
   * 2. Query Expansion
   * Generate variations of the query to catch synonyms.
   */
  const expandedQueries = await expandQuery(message)
  const mainQuery = expandedQueries[0]
  const alternativeQueries = expandedQueries.slice(1)

  /*
   * 3. Parallel Search Execution
   * - Hybrid Search: Global keyword/embedding search for ALL expanded queries
   * - Tag Search: Specific searches for each matched tag
   */
  const searchPromises = [
    hybridSearch({
      query: mainQuery,
      userId: user?.id,
      userGroups: user?.groupIds || [],
      limit: 6,
    }),
  ]

  if (alternativeQueries.length > 0) {
    searchPromises.push(
      hybridSearch({
        query: alternativeQueries[0],
        userId: user?.id,
        userGroups: user?.groupIds || [],
        limit: 4,
      })
    )
  }

  if (matchedTags.length > 0) {
    for (const tag of matchedTags) {
      searchPromises.push(searchByTag(tag.slug, 5))
    }
  }

  const results = await Promise.all(searchPromises)

  const allResults = results.flat()
  const seenPosts = new Set<number>()
  const uniqueResults: FlarumSearchResult[] = []

  for (const result of allResults) {
    if (!seenPosts.has(result.postId)) {
      seenPosts.add(result.postId)
      uniqueResults.push(result)
    }
  }

  uniqueResults.sort((a, b) => b.score - a.score)

  /*
   * 4. Reranking & Final Selection
   * Use LLM to pick the absolute best results from the candidate pool.
   */
  const topCandidates = uniqueResults.slice(0, 20)
  const finalResults = await rerankResults(message, topCandidates, 6)

  const formattedContext = formatResultsForContext(finalResults)

  const suggestion = await generatePostSuggestion(
    message,
    availableTags,
    finalResults
  )

  return {
    intent,
    searchResults: finalResults,
    formattedContext,
    suggestion,
    user,
  }
}

/**
 * Generate a suggestion for creating a new forum post.
 */
export async function generatePostSuggestion(
  query: string,
  availableTags: TagInfo[] = [],
  existingResults: FlarumSearchResult[] = []
): Promise<PostSuggestion> {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY

  const link =
    process.env.NEXT_PUBLIC_FLARUM_URL || 'https://tribe-community.vercel.app'

  if (!apiKey) {
    const tag = 'general'
    const cleanQuery = query.replace(/[?!.,]+$/, '').trim()
    let title = cleanQuery
    if (title.length > 100) title = title.slice(0, 97) + '...'
    if (title === title.toLowerCase()) {
      title = title
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    }
    const content = `Hey everyone! 👋\n\n${cleanQuery}\n\nWould love to hear from you if you have any experience or thoughts on this! 🙏`
    const tagName = 'General'
    return { title, content, tag, tagName, link }
  }

  const apiUrl = process.env.DEEPSEEK_API_KEY
    ? 'https://api.deepseek.com/chat/completions'
    : 'https://api.openai.com/v1/chat/completions'

  const model = process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-4o-mini'

  const tagContext = availableTags
    .map((t) => `- ${t.name} (Slug: ${t.slug}): ${t.description || ''}`)
    .join('\n')

  const existingContext =
    existingResults.length > 0
      ? existingResults.map((r) => `- ${r.discussionTitle}`).join('\n')
      : 'No existing discussions found.'

  const systemPrompt = `You are helping a college student create a forum discussion post.
Given their query, generate an engaging title, content, and pick the most relevant forum tag.

Available Tags:
${tagContext}

Existing Discussions on this topic:
${existingContext}

Your goal is to create a draft that either asks a fresh question (if no discussions exist) or deepens the conversation (if some discussions exist but may not fully answer the user).

Rules:
- Title: Clear, specific, and inviting (max 80 chars).
- Content: Friendly, conversational tone. Include context, specific questions, and invite responses. Keep concise (3-5 sentences max).
- Tag: Pick the single most relevant SLUG from the list above. If none match well, use "general".
- Use 1-2 relevant emojis naturally.

Respond in JSON format: {"title": "...", "content": "...", "tag": "...", "tagName": "..."}`

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
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const result = JSON.parse(data.choices[0]?.message?.content || '{}')

    return {
      title: result.title || query.slice(0, 80),
      content: result.content || query,
      tag: result.tag || 'general',
      tagName: result.tagName || result.tag || 'General',
      link,
    }
  } catch {
    const cleanQuery = query.replace(/[?!.,]+$/, '').trim()
    let title = cleanQuery
    if (title.length > 100) title = title.slice(0, 97) + '...'
    if (title === title.toLowerCase()) {
      title = title
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    }
    const content = `Hey everyone! 👋\n\n${cleanQuery}\n\nWould love to hear from you if you have any experience or thoughts on this! 🙏`
    const tag = 'general'
    const tagName = 'General'
    return { title, content, tag, tagName, link }
  }
}

/**
 * Build the enhanced system prompt with forum context.
 * OPTIMIZED: Better structured prompts for more useful responses.
 */
export function buildSystemPromptWithContext(context: ForumContext): string {
  const forumUrl =
    process.env.NEXT_PUBLIC_FLARUM_URL || 'https://tribe-community.vercel.app'

  const baseIdentity = `You are TribeAI, the friendly AI assistant for the JAIN University student community forum called Tribe.

PERSONALITY:
• Warm, enthusiastic, and approachable - like a helpful senior or peer
• Use emojis naturally (but not excessively) to add personality 😊
• Keep responses conversational and well-formatted
• Be encouraging about community participation
• NEVER sound apologetic about using web results - treat them as valuable extra info

FORUM URL: ${forumUrl}`

  const userContext = context.user
    ? `\n\nUSER: Logged in as @${context.user.username}`
    : '\n\nUSER: Not logged in (anonymous visitor)'

  let prompt = `${baseIdentity}${userContext}`

  let infoBlock = ''

  if (context.formattedContext && context.searchResults.length > 0) {
    infoBlock += `\n\n==== 🏛️ COMMUNITY DISCUSSIONS (Internal Tribe Forum) ====\n${context.formattedContext}\n`
  }

  if (context.webResults && context.webResults.length > 0) {
    const webContext = context.webResults
      .map(
        (r, i) => `[WEB-${i + 1}] ${r.title}\nSource: ${r.url}\n"${r.snippet}"`
      )
      .join('\n\n')
    infoBlock += `\n\n==== 🌍 WEB UPDATES (External Info) ====\n${webContext}\n`
  }

  prompt += infoBlock

  prompt += `\n\n=====================================
YOUR GOAL:
Provide the most helpful answer possible by SYNTHESIZING information from both the Tribe Forum and the Web.

GUIDELINES:
1. **Prioritize Community**: If there are relevant Forum discussions, ALWAYS mention them first. Say something like "I found some great discussions on Tribe about this...".
2. **Seamless Web Integration**: If the forum is quiet or lacks specific details (e.g., dates for a generic hackathon), use the Web results to fill in the gaps without making a big deal out of it.
3. **Be Helpful**: If the user asks for opportunities, combine the internal referral posts with external job listings you found on the web.
4. **Links**: You MUST cite forum discussions using the exact format "[Discussion Title](Link)". This is CRITICAL for the UI to display them correctly. For example: "Calculus notes are available in [B.Tech Data Science Notes](https://...). For web results, you can mention "I also saw online that..." but focus on driving traffic to the community where possible."
5. **If No Forum Data**: If the Community Discussions section is empty, simply answer using the Web results and suggest: "I couldn't find a specific thread on Tribe about this yet, so you should definitely start one! Here is what I found online..."
6. **PRIVACY - CRITICAL**: When mentioning users, NEVER expose usernames that look like system accounts, bots, or anonymous users (e.g., "Ghost_Voting_System", "deleted_user", "system", "bot_*", "anonymous"). Instead, say "a community member" or "someone". For real student usernames, you can mention them with @ (e.g., "@Joseph" or "@StudentName") to highlight them.
7. **Draft Post Feature**: You have a feature that creates a 'Start a Discussion' draft card for the user. Mention it naturally in your response when it's helpful (e.g., 'I've prepared a draft for you below if you want to ask the community for more perspectives!').

Start your response directly (no "Here is what I found"). Be helpful immediately.

8. **Follow-up Questions**: At the very end of your response, generate 3 relevant, short follow-up questions that the user might want to ask next. Format them strictly as a JSON array inside a specific delimiter like this:
<<<FOLLOWUPS: ["Question 1?", "Question 2?", "Question 3?"]>>>`

  if (
    context.intent === 'general_question' &&
    !infoBlock.includes('COMMUNITY DISCUSSIONS')
  ) {
    return `${baseIdentity}${userContext}\n\nThis is a general knowledge question. Answer it directly and helpfully. If relevant, suggest they could start a discussion on Tribe to get personal student perspectives.`
  }

  if (context.intent === 'greeting') {
    return `${baseIdentity}${userContext}

Respond with a warm, friendly greeting! You can:
• Welcome them to Tribe
• Mention you're here to help with anything community-related
• Suggest they can ask about finding people with similar interests, academic help, career advice, etc.

Keep it brief and inviting! 👋`
  }

  return prompt
}
