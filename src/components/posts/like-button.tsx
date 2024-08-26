"use client";

import { LikeInfo } from "@/@types";
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
import { HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export const LikeButton: NextPage<LikeButtonProps> = ({
  postId,
  initialState,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["like-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () => kyInstance(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));

      return { previousState };
    },

    onError(error, _variables, context) {
      console.log("🚀 ~ onError ~ error:", error);
      queryClient.setQueryData<LikeInfo>(queryKey, context?.previousState);
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
      onClick={() => {
        mutate();
      }}
    >
      <HeartIcon
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      {/* tabular-nums s'assure que la largeur soit la même pour un ou 2 chiffres*/}
      <span className="text-sm font-medium tabular-nums">{data.likes}</span>
    </Button>
  );
};
