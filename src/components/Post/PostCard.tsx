import { useRef } from "react"
import type { FC } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import siteConfig from "@/config"
import type { Post, Tag, User, Vote } from "@prisma/client"
import { BiMessageAltDetail } from "react-icons/bi"
import { FiShare2 } from "react-icons/fi"

import formatTimeToNow from "@/lib/formatTimeToNow"
import { toast } from "@/hooks/useToast"

import ShareButton from "../UI/ShareButton"
import EditorOutput from "./EditorOutput"
import PostVoteClient from "./PostVoteClient"

interface PostCardProps {
  post: Post & {
    author: User
    votes: Vote[]
    tags: Tag[]
  }
  votesAmount: number
  forumName?: string
  commentAmount: number
  currentVote?: Vote["type"]
  isLoggedIn?: boolean
}

/**
 * Represents a post card component.
 */
const PostCard: FC<PostCardProps> = ({
  post,
  forumName,
  commentAmount,
  votesAmount,
  currentVote,
  isLoggedIn,
}) => {
  const postRef = useRef<HTMLParagraphElement>(null)
  const isPostOverflowed = postRef.current?.clientHeight === 160
  const postUrl = `${siteConfig.url}/d/${forumName}/post/${post.id}`

  const postContent = (
    <div
      className="relative max-h-40 w-full overflow-hidden text-sm"
      ref={postRef}
    >
      <EditorOutput content={post.content} sm />
      {isPostOverflowed && (
        <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-zinc-50 to-transparent dark:from-zinc-900"></div>
      )}
    </div>
  )

  const postMetaInfo = (
    <div className="mt-1 flex max-h-40 flex-row justify-between gap-1 text-sm text-zinc-500">
      <div className="inline-flex">
        <Link href={`/d/${forumName}`}>
          <p className="text-zinc-800 underline underline-offset-2 dark:text-zinc-50">
            d/{forumName}
          </p>
        </Link>
        <span className="px-1 text-zinc-800 dark:text-zinc-50">•</span>
        <span className="text-zinc-800 dark:text-zinc-50">
          Posted by u/{post.author.name}
        </span>
      </div>
      <time>{" " + formatTimeToNow(new Date(post.createdAt))}</time>
    </div>
  )

  return (
    <article className="overflow-hidden rounded-md border-2 border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
      <div className="flex flex-col justify-between px-6 py-4 md:flex-row">
        <div className="py-2 pr-4">
          <PostVoteClient
            postId={post.id}
            initialVoteAmount={votesAmount}
            initialVote={currentVote}
            isLoggedIn={isLoggedIn}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          {postMetaInfo}
          <Link
            href={postUrl}
            className="pt-2 text-lg font-semibold leading-6 text-zinc-900 dark:text-zinc-50"
            aria-label={post.title}
          >
            {post.title}
          </Link>
          {postContent}
        </div>
      </div>
      <div className="z-20 flex h-12 w-full flex-row items-center justify-between rounded-b-md border-t-2 border-t-zinc-800 text-sm">
        <Link
          href={`/d/${forumName}/post/${post.id}`}
          className="flex h-full w-fit items-center gap-2 border-r-2 border-r-zinc-800 px-6 font-medium hover:bg-yellow-300 dark:hover:bg-zinc-800"
        >
          <BiMessageAltDetail size={25} /> {commentAmount}{" "}
          <p className="hidden md:inline-block">comments</p>
        </Link>
        <div className="flex h-full w-full flex-row items-center justify-end">
          {post.tags && (
            <div className="flex h-fit max-w-full flex-row gap-2 overflow-hidden overflow-x-scroll px-2 py-1">
              {post.tags.map((tag) => (
                <Link
                  className="rounded-md border-2 border-zinc-800 px-5 py-1 font-medium hover:bg-zinc-800 hover:text-zinc-50"
                  href={`/?tag=${tag.name}`}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
          <ShareButton url={postUrl} className="border-0 border-l-2" />
        </div>
      </div>
    </article>
  )
}

export default PostCard