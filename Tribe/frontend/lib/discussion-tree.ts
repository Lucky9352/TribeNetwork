import { FlarumPost } from './flarum-api'

export interface PostNode {
  post: FlarumPost
  children: PostNode[]
}

/**
 * Builds a hierarchical tree from a flat list of posts depending on mentions.
 *
 * Flarum mentions look like:
 * <a href="..." class="PostMention" data-id="123">@username</a>
 *
 * We parse the contentHtml to find the *first* PostMention.
 * If found, we assume this post is a reply to that mentioned post ID.
 */
export function buildDiscussionTree(posts: FlarumPost[]): PostNode[] {
  const nodeMap = new Map<string, PostNode>()
  const numberMap = new Map<number, PostNode>()
  const roots: PostNode[] = []

  posts.forEach((post) => {
    const node = { post, children: [] }
    nodeMap.set(post.id, node)
    if (post.attributes.number) {
      numberMap.set(post.attributes.number, node)
    }
  })

  posts.forEach((post) => {
    const node = nodeMap.get(post.id)!
    const contentHtml = String(post.attributes.contentHtml || '')
    const contentMarkdown = String(post.attributes.content || '')
    let parentId: string | null = null

    const htmlMatch =
      contentHtml.match(
        /class=["'][^"']*PostMention[^"']*["'][^>]*data-id=["'](\d+)["']/
      ) ||
      contentHtml.match(
        /data-id=["'](\d+)["'][^>]*class=["'][^"']*PostMention[^"']*["']/
      )

    if (htmlMatch) {
      parentId = htmlMatch[1]
    }

    if (!parentId || !nodeMap.has(parentId)) {
      const mdMatch = contentMarkdown.match(/#p(\d+)\b/)
      if (mdMatch) {
        const parentNumber = parseInt(mdMatch[1], 10)
        const parentNode = numberMap.get(parentNumber)
        if (parentNode) {
          parentId = parentNode.post.id
        }
      }
    }

    if (parentId && nodeMap.has(parentId)) {
      if (parentId !== post.id) {
        const parentNode = nodeMap.get(parentId)!
        parentNode.children.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  })

  return roots
}
