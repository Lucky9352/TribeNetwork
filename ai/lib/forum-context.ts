/**
 * @file forum-context.ts
 * @description Optimized forum context building for RAG integration.
 * Prepares Flarum content as context for AI responses with improved prompts.
 */

import { hybridSearch, formatResultsForContext } from './search'
import {
  validateFlarumSession,
  extractFlarumToken,
  AuthenticatedUser,
} from './flarum-auth'
import type { FlarumSearchResult } from './flarum-types'

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
 * Post creation suggestion.
 */
export interface PostSuggestion {
  title: string
  content: string
  tag: string
  link: string
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
    return { intent, searchResults: [], formattedContext: '', user }
  }

  const searchResults = await hybridSearch({
    query: message,
    userId: user?.id,
    userGroups: user?.groupIds || [],
    limit: 10,
  })

  const formattedContext = formatResultsForContext(searchResults)

  let suggestion: PostSuggestion | undefined
  if (searchResults.length === 0) {
    suggestion = generatePostSuggestion(message)
  }

  return { intent, searchResults, formattedContext, suggestion, user }
}

/**
 * Generate a suggestion for creating a new forum post.
 */
export function generatePostSuggestion(query: string): PostSuggestion {
  const cleanQuery = query.replace(/[?!.,]+$/, '').trim()

  let title = cleanQuery
  if (title.length > 100) {
    title = title.slice(0, 97) + '...'
  }

  if (title === title.toLowerCase()) {
    title = title
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const content = `Hey everyone! 👋

${cleanQuery}

Would love to hear from you if you have any experience or thoughts on this! 🙏`

  const tag = suggestTag(query)
  const link =
    process.env.NEXT_PUBLIC_FLARUM_URL || 'https://tribe-community.vercel.app'

  return { title, content, tag, link }
}

/**
 * Suggest a tag based on content analysis.
 */
function suggestTag(content: string): string {
  const lowerContent = content.toLowerCase()

  if (
    /job|career|intern|work|freelance|hire|hiring|placement|company/i.test(
      lowerContent
    )
  ) {
    return 'professional'
  }
  if (
    /study|exam|course|subject|semester|notes|resource|cgpa|marks/i.test(
      lowerContent
    )
  ) {
    return 'notes-links'
  }
  if (
    /confession|feeling|sad|happy|emotion|love|crush|vent|rant/i.test(
      lowerContent
    )
  ) {
    return 'confession'
  }
  if (/meet|trip|travel|plan|weekend|event|hangout|party/i.test(lowerContent)) {
    return 'plan-meet'
  }
  if (/stock|invest|market|trading|crypto|money|finance/i.test(lowerContent)) {
    return 'stock-market'
  }
  if (/game|gaming|play|esports|valorant|bgmi|pubg|cod/i.test(lowerContent)) {
    return 'gaming'
  }
  if (/music|song|artist|concert|band|spotify/i.test(lowerContent)) {
    return 'music'
  }

  return 'general'
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

Start your response directly (no "Here is what I found"). Be helpful immediately.`

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
