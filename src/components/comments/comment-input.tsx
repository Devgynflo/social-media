"use client";

import { PostData } from "@/@types";
import { NextPage } from "next";
import React, { useState } from "react";
import { useSubmitCommentMutation } from "./mutation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2Icon, SendHorizonalIcon } from "lucide-react";

interface Props {
  post: PostData;
}

export const CommentInput: NextPage<Props> = ({ post }) => {
  const [input, setInput] = useState<string>("");
  const mutation = useSubmitCommentMutation(post.id);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!input) return;

    mutation.mutate(
      {
        content: input,
        post,
      },
      {
        onSuccess: () => {
          setInput("");
        },
      },
    );
  }
  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ajouter un commentaire"
        autoFocus
      />
      <Button
        type="submit"
        variant="ghost"
        disabled={!input.trim() || mutation.isPending}
        size={"icon"}
      >
        {!mutation.isPending ? (
          <SendHorizonalIcon className="size-5" />
        ) : (
          <Loader2Icon className="size-5 animate-spin" />
        )}
      </Button>
    </form>
  );
};
