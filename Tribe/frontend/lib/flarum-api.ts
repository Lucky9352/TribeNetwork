/**
 * Flarum API Client
 * Handles all communication with Flarum backend
 */

import axios, { AxiosInstance } from 'axios'

const getApiBase = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_FLARUM_API_URL || 'http://localhost:8000/api'
  }
  return (
    process.env.NEXT_PUBLIC_FLARUM_API_URL ||
    process.env.FLARUM_API_URL ||
    'http://localhost:8000/api'
  )
}

const API_BASE = getApiBase()

export interface FlarumUser {
  type: 'users'
  id: string
  attributes: {
    username: string
    displayName: string
    email?: string
    avatarUrl?: string
    bio?: string
    joinTime: string
  }
}

export interface FlarumDiscussion {
  type: 'discussions'
  id: string
  attributes: {
    title: string
    slug: string
    commentCount: number
    participantCount: number
    createdAt: string
    lastPostedAt: string
    isSticky?: boolean
    isLocked?: boolean
    votes?: number
    hasUpvoted?: boolean
    hasDownvoted?: boolean
    canVote?: boolean
  }
  relationships?: {
    user?: { data: { type: string; id: string } }
    tags?: { data: Array<{ type: string; id: string }> }
    lastPostedUser?: { data: { type: string; id: string } }
  }
}

export interface FlarumPost {
  type: 'posts'
  id: string
  attributes: {
    number: number
    createdAt: string
    contentType: string
    contentHtml?: string
    content?: string
    renderFailed?: boolean
    mentionedByCount?: number
    isAnonymous?: boolean
    canDeAnonymize?: boolean
    canAnonymize?: boolean
    anonymousAvatarUrl?: string | null
    isAnonymousMe?: boolean
    editedAt?: string
    isEdited?: boolean
    score?: number
    votes?: number
    hasUpvoted?: boolean
    hasDownvoted?: boolean
    canVote?: boolean
    isLiked?: boolean
    canLike?: boolean
    likesCount?: number
    canEdit?: boolean
    canDelete?: boolean
    isHidden?: boolean
    hiddenAt?: string
  }
  relationships?: {
    user?: { data: { type: string; id: string } | null }
    discussion?: { data: { type: string; id: string } }
  }
}

export interface FlarumTag {
  type: 'tags'
  id: string
  attributes: {
    name: string
    slug: string
    color?: string
    description?: string
    icon?: string
    discussionCount?: number
    position?: number
    isHidden?: boolean
    lastPostedAt?: string
  }
}

export interface FlarumResponse<T> {
  data: T | T[]
  included?: Array<FlarumUser | FlarumDiscussion | FlarumPost | FlarumTag>
  links?: {
    first?: string
    last?: string
    prev?: string
    next?: string
  }
  meta?: {
    total?: number
    page?: number
  }
}

export interface LoginCredentials {
  identification: string
  password: string
}

export interface LoginResponse {
  token: string
  userId: string
}

class FlarumAPI {
  private client: AxiosInstance
  private token: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          throw new Error('Network error: Unable to connect to Flarum API')
        }

        const status = error.response?.status
        const errorData = error.response?.data

        if (status === 401) {
          this.clearToken()
          throw new Error('Authentication failed. Please login again.')
        }

        if (status === 403) {
          throw new Error('You do not have permission to perform this action.')
        }

        if (status === 404) {
          throw new Error('Resource not found.')
        }

        if (status >= 500) {
          throw new Error('Server error. Please try again later.')
        }

        const errorMessage =
          errorData?.errors?.[0]?.detail || error.message || 'An error occurred'
        throw new Error(errorMessage)
      }
    )

    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('flarum_token')
      const storedUserId = localStorage.getItem('flarum_user_id')
      if (this.token) {
        this.setToken(this.token)
      }
      if (storedUserId) {
        this.userId = parseInt(storedUserId, 10)
      }
    }
  }

  setToken(token: string) {
    this.token = token
    this.client.defaults.headers.common['Authorization'] = `Token ${token}`
    if (typeof window !== 'undefined') {
      localStorage.setItem('flarum_token', token)
    }
  }

  clearToken() {
    this.token = null
    this.userId = null
    delete this.client.defaults.headers.common['Authorization']
    if (typeof window !== 'undefined') {
      localStorage.removeItem('flarum_token')
      localStorage.removeItem('flarum_user_id')
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.client.post('/token', {
        identification: credentials.identification,
        password: credentials.password,
      })

      const { token, userId } = response.data
      this.setToken(token)
      this.userId = userId
      if (typeof window !== 'undefined') {
        localStorage.setItem('flarum_user_id', userId.toString())
      }
      return { token, userId }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(
        error.response?.data?.errors?.[0]?.detail || 'Login Failed'
      )
    }
  }

  async logout() {
    this.clearToken()
  }

  async register(data: {
    username: string
    email: string
    password: string
  }): Promise<void> {
    try {
      await this.client.post('/users', {
        data: {
          type: 'users',
          attributes: {
            username: data.username,
            email: data.email,
            password: data.password,
          },
        },
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorDetail = error.response?.data?.errors?.[0]?.detail
      throw new Error(errorDetail || 'Registration Failed')
    }
  }

  private userId: number | null = null

  async getCurrentUser(): Promise<FlarumUser> {
    if (!this.userId) {
      throw new Error('No user logged in')
    }
    const response = await this.client.get<FlarumResponse<FlarumUser>>(
      `/users/${this.userId}`
    )
    return response.data.data as FlarumUser
  }

  async getUser(userId: string): Promise<FlarumUser> {
    const response = await this.client.get<FlarumResponse<FlarumUser>>(
      `/users/${userId}`
    )
    return response.data.data as FlarumUser
  }

  async getDiscussions(params?: {
    page?: { limit?: number; offset?: number }
    include?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter?: Record<string, any>
    sort?: string
  }): Promise<FlarumResponse<FlarumDiscussion>> {
    const queryParams = new URLSearchParams()

    if (params?.page?.limit) {
      queryParams.append('page[limit]', params.page.limit.toString())
    }
    if (params?.page?.offset) {
      queryParams.append('page[offset]', params.page.offset.toString())
    }
    if (params?.include) {
      queryParams.append('include', params.include)
    }
    if (params?.sort) {
      queryParams.append('sort', params.sort)
    }
    if (params?.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        queryParams.append(`filter[${key}]`, value.toString())
      })
    }

    const response = await this.client.get<FlarumResponse<FlarumDiscussion>>(
      `/discussions?${queryParams.toString()}`
    )
    return response.data
  }

  async getDiscussion(
    id: string,
    include?: string
  ): Promise<FlarumResponse<FlarumDiscussion>> {
    const queryParams = include ? `?include=${include}` : ''
    const response = await this.client.get<FlarumResponse<FlarumDiscussion>>(
      `/discussions/${id}${queryParams}`
    )
    return response.data
  }

  async createDiscussion(data: {
    title: string
    content: string
    tags?: string[]
  }): Promise<FlarumResponse<FlarumDiscussion>> {
    const payload = {
      data: {
        type: 'discussions',
        attributes: {
          title: data.title,
          content: data.content,
        },
        relationships: data.tags
          ? {
              tags: {
                data: data.tags.map((id) => ({ type: 'tags', id })),
              },
            }
          : undefined,
      },
    }

    const response = await this.client.post<FlarumResponse<FlarumDiscussion>>(
      '/discussions',
      payload
    )
    return response.data
  }

  async getPosts(params?: {
    discussion?: string
    page?: { limit?: number; offset?: number }
    include?: string
  }): Promise<FlarumResponse<FlarumPost>> {
    const queryParams = new URLSearchParams()

    if (params?.discussion) {
      queryParams.append('filter[discussion]', params.discussion)
    }
    if (params?.page?.limit) {
      queryParams.append('page[limit]', params.page.limit.toString())
    }
    if (params?.page?.offset) {
      queryParams.append('page[offset]', params.page.offset.toString())
    }
    if (params?.include) {
      queryParams.append('include', params.include)
    }

    const response = await this.client.get<FlarumResponse<FlarumPost>>(
      `/posts?${queryParams.toString()}`
    )
    return response.data
  }

  async createPost(data: {
    discussionId: string
    content: string
  }): Promise<FlarumResponse<FlarumPost>> {
    const payload = {
      data: {
        type: 'posts',
        attributes: {
          content: data.content,
        },
        relationships: {
          discussion: {
            data: { type: 'discussions', id: data.discussionId },
          },
        },
      },
    }

    const response = await this.client.post<FlarumResponse<FlarumPost>>(
      '/posts',
      payload
    )
    return response.data
  }

  async vote(
    postId: string,
    voteType: 'up' | 'down' | null
  ): Promise<FlarumResponse<FlarumPost>> {
    let attributesArray: [boolean, boolean, string]
    if (voteType === 'up') attributesArray = [true, false, 'vote']
    else if (voteType === 'down') attributesArray = [false, true, 'vote']
    else attributesArray = [false, false, 'vote']

    const response = await this.client.patch<FlarumResponse<FlarumPost>>(
      `/posts/${postId}`,
      {
        data: {
          type: 'posts',
          id: postId,
          attributes: attributesArray,
        },
      }
    )
    return response.data
  }

  async updatePost(
    postId: string,
    data: { isLiked?: boolean; isHidden?: boolean; content?: string }
  ): Promise<FlarumResponse<FlarumPost>> {
    const payload = {
      data: {
        type: 'posts',
        id: postId,
        attributes: data,
      },
    }
    const response = await this.client.patch<FlarumResponse<FlarumPost>>(
      `/posts/${postId}`,
      payload
    )
    return response.data
  }

  async deletePost(postId: string): Promise<void> {
    await this.client.delete(`/posts/${postId}`)
  }

  async getTags(): Promise<FlarumResponse<FlarumTag>> {
    const response = await this.client.get<FlarumResponse<FlarumTag>>('/tags')
    return response.data
  }

  isAuthenticated(): boolean {
    return !!this.token
  }
}

export function findIncluded<T extends { type: string; id: string }>(
  included:
    | Array<FlarumUser | FlarumDiscussion | FlarumPost | FlarumTag>
    | undefined,
  type: string,
  id: string
): T | undefined {
  if (!included) return undefined
  return included.find((item) => item.type === type && item.id === id) as
    | T
    | undefined
}

export function getFirstPost(
  discussion: FlarumDiscussion,
  included:
    | Array<FlarumUser | FlarumDiscussion | FlarumPost | FlarumTag>
    | undefined
): FlarumPost | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const firstPostRelation = (discussion.relationships as any)?.firstPost?.data
  if (!firstPostRelation) return undefined
  return findIncluded<FlarumPost>(included, 'posts', firstPostRelation.id)
}

export function getDiscussionTags(
  discussion: FlarumDiscussion,
  included:
    | Array<FlarumUser | FlarumDiscussion | FlarumPost | FlarumTag>
    | undefined
): FlarumTag[] {
  const tagRelations = discussion.relationships?.tags?.data
  if (!tagRelations || !included) return []
  return tagRelations
    .map((rel) => findIncluded<FlarumTag>(included, 'tags', rel.id))
    .filter((tag): tag is FlarumTag => tag !== undefined)
}

export function getUser(
  resource: FlarumDiscussion | FlarumPost,
  included:
    | Array<FlarumUser | FlarumDiscussion | FlarumPost | FlarumTag>
    | undefined
): FlarumUser | undefined {
  const userRelation = resource.relationships?.user?.data
  if (!userRelation) return undefined
  return findIncluded<FlarumUser>(included, 'users', userRelation.id)
}

export function htmlToText(html: string): string {
  if (typeof window === 'undefined') {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

export function extractFirstImage(html: string): string | null {
  const imgMatch = html.match(/<img[^>]+src="([^">]+)"/)
  return imgMatch ? imgMatch[1] : null
}

export const flarumAPI = new FlarumAPI()
