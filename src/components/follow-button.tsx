"use client";

import { FollowerInfo } from "@/@types";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { NextPage } from "next";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import kyInstance from "@/lib/ky";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export const FollowButton: NextPage<FollowButtonProps> = ({
  userId,
  initialState,
}) => {
  const { data } = useFollowerInfo(userId, initialState);
  const { toast } = useToast();
  const queryClient = useQueryClient(); // TODO: Optimistic
  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          previousState?.followers ||
          0 + (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      console.log("🚀 ~ onError ~ error:", error);
      queryClient.setQueryData<FollowerInfo>(queryKey, context?.previousState);
      toast({
        variant: "destructive",
        description: "Une erreur est survenue lors de la requête",
      });
    },
  });

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Ne plus suivre" : "Suivre"}
    </Button>
  );
};
