import { PostData } from "@/@types";
import { MessageSquareIcon } from "lucide-react";
import { NextPage } from "next";
import { Button } from "../ui/button";

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

export const CommentButton: NextPage<CommentButtonProps> = ({
  post,
  onClick,
}) => {
  return (
    <Button
      variant={"ghost"}
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <MessageSquareIcon className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {!!post._count.comments && post._count.comments}
      </span>
    </Button>
  );
};
