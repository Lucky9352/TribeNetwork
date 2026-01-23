/**
 * @file flarum-types.ts
 * @description TypeScript interfaces for Flarum database entities.
 * Matches the MySQL schema from flarum_database.sql.
 */

/**
 * Flarum user entity from flarum_users table.
 */
export interface FlarumUser {
  id: number
  username: string
  nickname: string | null
  email: string
  is_email_confirmed: boolean
  avatar_url: string | null
  joined_at: Date | null
  last_seen_at: Date | null
  discussion_count: number
  comment_count: number
  bio: string | null
}

/**
 * Flarum discussion entity from flarum_discussions table.
 */
export interface FlarumDiscussion {
  id: number
  title: string
  slug: string
  comment_count: number
  participant_count: number
  created_at: Date
  user_id: number | null
  first_post_id: number | null
  last_posted_at: Date | null
  last_posted_user_id: number | null
  last_post_id: number | null
  last_post_number: number | null
  hidden_at: Date | null
  hidden_user_id: number | null
  is_private: boolean
  is_approved: boolean
  is_sticky: boolean
  is_locked: boolean
  view_count: number
}

/**
 * Flarum post entity from flarum_posts table.
 */
export interface FlarumPost {
  id: number
  discussion_id: number
  number: number | null
  created_at: Date
  user_id: number | null
  type: string | null
  content: string | null
  edited_at: Date | null
  edited_user_id: number | null
  hidden_at: Date | null
  hidden_user_id: number | null
  ip_address: string | null
  is_private: boolean
  is_approved: boolean
}

/**
 * Flarum tag entity from flarum_tags table.
 */
export interface FlarumTag {
  id: number
  name: string
  slug: string
  description: string | null
  color: string | null
  position: number | null
  parent_id: number | null
  is_restricted: boolean
  is_hidden: boolean
  discussion_count: number
  icon: string | null
}

/**
 * Flarum access token from flarum_access_tokens table.
 */
export interface FlarumAccessToken {
  id: number
  token: string
  user_id: number
  last_activity_at: Date | null
  created_at: Date
  type: string
  title: string | null
  last_ip_address: string | null
  last_user_agent: string | null
}

/**
 * Flarum group entity from flarum_groups table.
 */
export interface FlarumGroup {
  id: number
  name_singular: string
  name_plural: string
  color: string | null
  icon: string | null
  is_hidden: boolean
}

/**
 * User group membership from flarum_group_user table.
 */
export interface FlarumGroupUser {
  user_id: number
  group_id: number
}

/**
 * Discussion tag relationship from flarum_discussion_tag table.
 */
export interface FlarumDiscussionTag {
  discussion_id: number
  tag_id: number
  created_at: Date | null
}

/**
 * Combined post with discussion and user info for search results.
 */
export interface FlarumPostWithContext {
  postId: number
  discussionId: number
  discussionTitle: string
  discussionSlug: string
  postNumber: number
  content: string
  username: string
  nickname: string | null
  createdAt: Date
  tagIds: number[]
  tagNames: string[]
  isPrivate: boolean
}

/**
 * Search result with relevance score.
 */
export interface FlarumSearchResult extends FlarumPostWithContext {
  score: number
  isTeaser?: boolean
  teaserMessage?: string
}
