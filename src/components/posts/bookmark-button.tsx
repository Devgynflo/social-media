"use client";

import { BookmarkInfo } from "@/@types";
import { NextPage } from "next";
import { useToast } from "../ui/use-toast";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { BookmarkIcon } from "lucide-react";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export const BookmarkButton: NextPage<BookmarkButtonProps> = ({
  postId,
  initialState,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance(`/api/posts/${postId}/bookmarks`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmarks`)
        : kyInstance.post(`/api/posts/${postId}/bookmarks`),
    onMutate: async () => {
      toast({
        description: `${data.isBookmarkedByUser ? "Suppression" : "Ajout"} du favori`,
      });
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },

    onError(error, _variables, context) {
      console.log("🚀 ~ onError ~ error:", error);
      queryClient.setQueryData<BookmarkInfo>(queryKey, context?.previousState);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de la requête",
      });
    },
  });

  return (
    <Button
      variant={"ghost"}
      className="flex items-center gap-2"
      onClick={() => mutate()}
    >
      <BookmarkIcon
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary",
        )}
      />
    </Button>
  );
};
