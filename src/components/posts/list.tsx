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

interface PostListProps {
  post: PostData;
}

export const PostItem: NextPage<PostListProps> = ({ post }) => {
  const { user } = useSession();

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
                className="block font-medium hover:underline"
              >
                {post.author?.displayName}
              </Link>
            </UserTooltip>

            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
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
    </article>
  );
};
