import { CommentData } from "@/@types";
import { NextPage } from "next";
import UserTooltip from "../user-tooltip";
import { UserAvatar } from "../user-avatar";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";
import { CommentMoreButton } from "./comment-more-button";
import { useSession } from "@/hooks";

interface CommentItemProps {
  comment: CommentData;
}

export const CommentItem: NextPage<CommentItemProps> = ({ comment }) => {
  const { user } = useSession();
  return (
    <div className="group/comment flex gap-3 py-3">
      <span className="hidden sm:inline">
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} />
          </Link>
        </UserTooltip>
      </span>
      <div className="">
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={comment.user}>
            <Link
              href={`/users/${comment.user.displayName}`}
              className="font-medium hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div className="">{comment.content}</div>
      </div>
      {user.id === comment.user.id && (
        <CommentMoreButton
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
          comment={comment}
        />
      )}
    </div>
  );
};
