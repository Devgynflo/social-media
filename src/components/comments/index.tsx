import { CommentPage, PostData } from "@/@types";
import { NextPage } from "next";
import { CommentInput } from "./comment-input";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { CommentItem } from "./comment-item";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";

interface CommentsProps {
  post: PostData;
}

export const Comments: NextPage<CommentsProps> = ({ post }) => {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<CommentPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pageParams: [...data.pageParams].reverse(),
        pages: [...data.pages].reverse(),
      }),
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];
  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant={"link"}
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Messages précédents
        </Button>
      )}
      {status === "pending" && (
        <Loader2Icon className="mx-auto mt-4 size-5 animate-spin" />
      )}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">
          Aucun commentaire à afficher
        </p>
      )}
      {status === "error" && (
        <p className="text-destructive">
          Une erreur est survenue pendant le chargement des commentaires
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};
