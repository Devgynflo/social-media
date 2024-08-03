import { PostData } from "@/@types";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { UserAvatar } from "../user-avatar";
import { formatRelativeDate } from "@/lib/utils";

interface PostListProps {
  post: PostData;
}

export const PostItem: NextPage<PostListProps> = ({ post }) => {
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Link href={`/users/${post.author.username}`}>
          <UserAvatar avatarUrl={post.author.avatarUrl} />
        </Link>

        <div className="">
          <Link
            href={`/users/${post.author.username}`}
            className="block font-medium hover:underline"
          >
            {post.author.displayName}
          </Link>
          <Link
            href={`/posts/${post.id}`}
            className="block text-sm text-muted-foreground hover:underline"
          >
            {/* {formatRelativeDate(post.createdAt)} */}
          </Link>
        </div>
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
};
