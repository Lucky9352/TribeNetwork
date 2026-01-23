/**
 * @file events-service.ts
 * @description Service to fetch and aggregate events/opportunities from internal forum
 * and external web search (You.com).
 */

import { prisma } from '@/lib/prisma'
import { searchWeb } from '@/lib/you-client'

export interface EventItem {
  id: string
  title: string
  source: 'internal' | 'external'
  category: 'events' | 'opportunities'
  type: 'event' | 'hackathon' | 'internship' | 'meetup' | 'job' | 'other'
  link: string
  date?: string
  snippet: string
}

/**
 * Searches the internal forum for event-related posts via embeddings/keywords.
 * Maps them to either 'events' or 'opportunities'.
 */
async function fetchInternalEvents(): Promise<EventItem[]> {
  try {
    const eventKeywords = ['meetup', 'workshop', 'fest', 'hackathon']
    const oppKeywords = ['internship', 'hiring', 'job', 'referral', 'vacancy']

    const allKeywords = [...eventKeywords, ...oppKeywords]

    const posts = await prisma.postEmbedding.findMany({
      where: {
        OR: allKeywords.map((k) => ({
          content: { contains: k, mode: 'insensitive' },
        })),
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
    })

    return posts.map((post) => {
      const contentLower = post.content.toLowerCase()
      let category: 'events' | 'opportunities' = 'events'
      if (oppKeywords.some((k) => contentLower.includes(k))) {
        category = 'opportunities'
      }

      return {
        id: `int-${post.id}`,
        title: post.title,
        source: 'internal',
        category,
        type: category === 'events' ? 'meetup' : 'job',
        link: `/discussion/${post.discussionId}/${post.slug}/${post.postNumber}`,
        snippet: post.content.slice(0, 100) + '...',
        date: post.createdAt.toISOString(),
      }
    })
  } catch {
    return []
  }
}

/**
 * Searches You.com specifically for Events (Hackathons, Fests).
 */
async function fetchExternalEvents(): Promise<EventItem[]> {
  try {
    const query =
      'Student hackathons coding competitions college fests Bangalore India upcoming'
    const results = await searchWeb(query, 4)

    return results.map((r, i) => ({
      id: `ext-evt-${i}-${Date.now()}`,
      title: r.title,
      source: 'external',
      category: 'events',
      type: 'hackathon',
      link: r.url,
      snippet: r.snippet,
    }))
  } catch {
    return []
  }
}

/**
 * Searches You.com specifically for Opportunities (Internships, Jobs).
 */
async function fetchExternalOpportunities(): Promise<EventItem[]> {
  try {
    const query = 'Tech internships for students India off-campus drive 2025'
    const results = await searchWeb(query, 4)

    return results.map((r, i) => ({
      id: `ext-opp-${i}-${Date.now()}`,
      title: r.title,
      source: 'external',
      category: 'opportunities',
      type: 'internship',
      link: r.url,
      snippet: r.snippet,
    }))
  } catch {
    return []
  }
}

/**
 * Aggregates events from all sources.
 */
export async function getAggregatedEvents(): Promise<EventItem[]> {
  const [internal, extEvents, extOpps] = await Promise.all([
    fetchInternalEvents(),
    fetchExternalEvents(),
    fetchExternalOpportunities(),
  ])

  return [...internal, ...extEvents, ...extOpps]
}
