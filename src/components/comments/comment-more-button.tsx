"use client";

import { CommentData } from "@/@types";
import { NextPage } from "next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { DeleteCommentDialog } from "./delete-comment-dialog";
import { useState } from "react";

interface CommentMoreButtonProps {
  comment: CommentData;
  className?: string;
}

export const CommentMoreButton: NextPage<CommentMoreButtonProps> = ({
  comment,
  className,
}) => {
  const [showDeleteComment, setShowDeleteComment] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"} className={className}>
            <MoreHorizontalIcon className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDeleteComment(true)}>
            <span className="flex items-center gap-3 text-destructive">
              <Trash2Icon />
              Supprimer
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteCommentDialog
        comment={comment}
        open={showDeleteComment}
        onClose={() => setShowDeleteComment(false)}
      />
    </>
  );
};
