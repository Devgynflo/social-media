"use client";

import { PostData } from "@/@types";
import { NextPage } from "next";
import Link from "next/link";
import { UserAvatar } from "../user-avatar";
import { useSession } from "@/hooks";
import { PostMoreButton } from "./post-more-button";
import { formatRelativeDate } from "@/lib/utils";
import Linkify from "../linkify";
import UserTooltip from "../user-tooltip";
import { MediaPreviews } from "./media-preview";
import { LikeButton } from "./like-button";
import { BookmarkButton } from "./bookmark-button";
import { useState } from "react";
import { CommentButton } from "./comment-button";
import { Comments } from "../comments";

interface PostListProps {
  post: PostData;
}

export const PostItem: NextPage<PostListProps> = ({ post }) => {
  const { user } = useSession();
  const [showComments, setShowComments] = useState<boolean>(false);

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between">
        <div className="flex flex-wrap gap-3">
          <Link href={`/users/${post.author?.username}`}>
            <UserAvatar avatarUrl={post.author?.avatarUrl} />
          </Link>

          <div className="">
            <UserTooltip user={post.author}>
              <Link
                href={`/users/${post.author?.username}`}
                className="font-mCommentItemedium block hover:underline"
              >
                {post.author?.displayName}
              </Link>
            </UserTooltip>

            <Link
              href={`/post/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {user.id === post.author?.id && (
          <PostMoreButton
            data={post}
            className="ml-auto opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachements={post.attachments} />
      )}
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-1">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some((like) => like.userId === user.id),
            }}
          />

          <CommentButton
            post={post}
            onClick={() => setShowComments((prev) => !prev)}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
};
