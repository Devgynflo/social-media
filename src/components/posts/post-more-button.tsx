"use client";

import { PostData } from "@/@types";
import { NextPage } from "next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { DeletePostDialog } from "./delete-post-dialog";
import { useState } from "react";

interface PostMoreButtonProps {
  data: PostData;
  className?: string;
}

export const PostMoreButton: NextPage<PostMoreButtonProps> = ({
  data,
  className,
}) => {
  const [showDeletePost, setShowDeletePost] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className={className}>
            <MoreHorizontalIcon className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDeletePost(true)}>
            <span className="flex items-center gap-3 text-destructive">
              <Trash2Icon />
              Supprimer
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeletePostDialog
        data={data}
        open={showDeletePost}
        onClose={() => setShowDeletePost(false)}
      />
    </>
  );
};
