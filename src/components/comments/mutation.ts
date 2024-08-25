import { useSession } from "@/hooks";
import { useToast } from "../ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteComment, submitComment } from "./actions";
import { CommentData, CommentPage } from "@/@types";
import { usePathname, useRouter } from "next/navigation";

export function useSubmitCommentMutation(postId: string) {
  const { user } = useSession();
  if (!user) throw new Error("User not found");

  const { toast } = useToast();

  const queryKey: QueryKey = ["comments", postId];

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  comments: [newComment, ...firstPage.comments],
                  previousCursor: firstPage.previousCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({
        description: "Commentaire ajouté avec succès",
      });
    },

    onError: (error) => {
      console.log("🚀 ~ useSubmitCommentMutation ~ error:", error);
      toast({
        title: "Erreur lors de l'envoie du commentaire",
        description: "Erreur",
        variant: "destructive",
      });
    },
  });

  return mutation;
}

export function useDeleteCommentMutation(comment: CommentData) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ["comments", deletedComment.postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              previousCursor: page.previousCursor,
              comments: page.comments.filter((c) => c.id !== deletedComment.id),
            })),
          };
        },
      );
      toast({
        description: "Commentaire supprimé",
      });
    },
    onError: (error) => {
      console.log("🚀 ~ useDeleteCommentMutation ~ error:", error);
      toast({
        variant: "destructive",
        description: "Quelque chose s'est mal passé",
      });
    },
  });

  return mutation;
}
