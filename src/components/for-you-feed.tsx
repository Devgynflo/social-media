"use client";

import { PostData } from "@/@types";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { NextPage } from "next";
import { PostItem } from "./posts/list";
import kyInstance from "@/lib/ky";

interface ForYouFeedProps {}

export const ForYouFeed: NextPage<ForYouFeedProps> = ({}) => {
  const query = useQuery<PostData[]>({
    queryKey: ["posts-feed", "for-you"],
    queryFn: kyInstance.get("/api/posts/for-you").json<PostData[]>,
  });

  if (query.status === "pending")
    return <Loader2Icon className="mx-auto animate-spin" />;

  if (query.status === "error")
    return (
      <div className="flex flex-col items-center justify-center">
        <p>Une erreur s&apos;est produite, veuillez réessayer plus tard.</p>
      </div>
    );

  return (
    <div className="space-y-5">
      {query.data?.map((post) => <PostItem key={post.id} post={post} />)}
    </div>
  );
};
