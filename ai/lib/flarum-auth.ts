/**
 * @file flarum-auth.ts
 * @description Flarum session validation and user authentication.
 * Validates session tokens and retrieves user group memberships.
 */

import { RowDataPacket } from 'mysql2/promise'
import { query } from './flarum-db'

/**
 * Authenticated user info.
 */
export interface AuthenticatedUser {
  id: number
  username: string
  nickname: string | null
  groupIds: number[]
}

/**
 * Authentication result.
 */
export interface AuthResult {
  authenticated: boolean
  user: AuthenticatedUser | null
  error?: string
}

/**
 * Validate a Flarum session token and get user info.
 * Checks the flarum_access_tokens table for valid session.
 *
 * @param token - The session token (from cookie or header)
 * @returns Authentication result with user info if valid
 */
export async function validateFlarumSession(
  token: string | null | undefined
): Promise<AuthResult> {
  if (!token) {
    return { authenticated: false, user: null }
  }

  try {
    interface TokenRow extends RowDataPacket {
      user_id: number
      username: string
      nickname: string | null
      last_activity_at: Date | null
    }

    const rows = await query<TokenRow[]>(
      `SELECT 
        t.user_id,
        u.username,
        u.nickname,
        t.last_activity_at
      FROM flarum_access_tokens t
      JOIN flarum_users u ON t.user_id = u.id
      WHERE t.token = ?
        AND (t.last_activity_at IS NULL OR t.last_activity_at > DATE_SUB(NOW(), INTERVAL 30 DAY))
      LIMIT 1`,
      [token]
    )

    if (rows.length === 0) {
      return {
        authenticated: false,
        user: null,
        error: 'Invalid or expired token',
      }
    }

    const tokenData = rows[0]

    const groupIds = await getUserGroups(tokenData.user_id)

    return {
      authenticated: true,
      user: {
        id: tokenData.user_id,
        username: tokenData.username,
        nickname: tokenData.nickname,
        groupIds,
      },
    }
  } catch {
    return {
      authenticated: false,
      user: null,
      error: 'Authentication service error',
    }
  }
}

/**
 * Get group IDs for a user.
 *
 * @param userId - Flarum user ID
 * @returns Array of group IDs the user belongs to
 */
export async function getUserGroups(userId: number): Promise<number[]> {
  try {
    interface GroupRow extends RowDataPacket {
      group_id: number
    }

    const rows = await query<GroupRow[]>(
      `SELECT group_id FROM flarum_group_user WHERE user_id = ?`,
      [userId]
    )

    return rows.map((row) => row.group_id)
  } catch {
    return []
  }
}

/**
 * Check if a user can access a specific discussion.
 * Public discussions are accessible to all.
 * Private discussions require group membership.
 *
 * @param userId - Flarum user ID (null for unauthenticated)
 * @param discussionId - Discussion ID to check
 * @param userGroups - User's group IDs
 * @returns Whether the user can access the discussion
 */
export async function canAccessDiscussion(
  userId: number | null,
  discussionId: number,
  userGroups: number[]
): Promise<boolean> {
  try {
    interface DiscussionRow extends RowDataPacket {
      is_private: number
    }

    const discussions = await query<DiscussionRow[]>(
      `SELECT is_private FROM flarum_discussions WHERE id = ? AND hidden_at IS NULL`,
      [discussionId]
    )

    if (discussions.length === 0) {
      return false
    }

    if (!discussions[0].is_private) {
      return true
    }

    if (!userId || userGroups.length === 0) {
      return false
    }

    interface RecipientRow extends RowDataPacket {
      user_id: number
    }

    const recipients = await query<RecipientRow[]>(
      `SELECT user_id FROM flarum_recipients 
       WHERE discussion_id = ? AND user_id = ? AND removed_at IS NULL`,
      [discussionId, userId]
    )

    return recipients.length > 0
  } catch {
    return false
  }
}

/**
 * Get discussion group IDs that have access.
 * Used for indexing private discussion access.
 *
 * @param discussionId - Discussion ID
 * @returns Array of group IDs that can access
 */
export async function getDiscussionGroups(
  discussionId: number
): Promise<number[]> {
  try {
    interface RecipientRow extends RowDataPacket {
      group_id: number
    }

    const rows = await query<RecipientRow[]>(
      `SELECT DISTINCT g.group_id 
       FROM flarum_recipients r
       JOIN flarum_group_user g ON r.user_id = g.user_id
       WHERE r.discussion_id = ? AND r.removed_at IS NULL`,
      [discussionId]
    )

    return rows.map((row) => row.group_id)
  } catch {
    return []
  }
}

/**
 * Extract Flarum token from request.
 * Checks both header and cookie.
 *
 * @param request - Next.js request object
 * @returns Token string or null
 */
export function extractFlarumToken(request: Request): string | null {
  const headerToken = request.headers.get('x-flarum-token')
  if (headerToken) {
    return headerToken
  }

  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        if (key && value) {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, string>
    )

    if (cookies['flarum_remember']) {
      return cookies['flarum_remember']
    }

    if (cookies['flarum_session']) {
      return cookies['flarum_session']
    }
  }

  return null
}
