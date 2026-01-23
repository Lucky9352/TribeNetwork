'use client'

import { FlarumUser } from '@/lib/flarum-api'
import { PostNode } from '@/lib/discussion-tree'
import PostItem from './PostItem'

interface ThreadedPostProps {
  node: PostNode
  included: Array<FlarumUser | unknown>
  discussionId: string
  onReply: (username: string, postNumber: number) => void
  onUpdate: () => void
  onDelete: () => void
  depth?: number
}

const MAX_INDENT_DEPTH = 4

export default function ThreadedPost({
  node,
  included,
  discussionId,
  onReply,
  onUpdate,
  onDelete,
  depth = 0,
}: ThreadedPostProps) {
  const { post, children } = node
  const isDeep = depth >= MAX_INDENT_DEPTH

  return (
    <div
      className={`relative ${depth === 0 ? 'border-b border-zinc-800/60' : ''}`}
    >
      <PostItem
        post={post}
        included={included}
        isFirstPost={post.attributes.number === 1}
        discussionId={discussionId}
        onReply={onReply}
        onUpdate={onUpdate}
        onDelete={onDelete}
        className="border-b-0"
      />

      {/* Children Container - Indented */}
      {children.length > 0 && (
        <div
          className={
            isDeep
              ? 'mt-2 pl-4 border-l-2 border-zinc-800/50'
              : 'ml-4 sm:ml-8 pl-4 border-l-2 border-zinc-800/50 pb-4'
          }
        >
          <div className="space-y-4 pt-2 [&>div:last-child]:border-b-0">
            {children.map((childNode) => (
              <ThreadedPost
                key={childNode.post.id}
                node={childNode}
                included={included}
                discussionId={discussionId}
                onReply={onReply}
                onUpdate={onUpdate}
                onDelete={onDelete}
                depth={depth + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
