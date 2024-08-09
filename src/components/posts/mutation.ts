import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "./actions";
import { PostPage } from "@/@types";

export const useDeletePostMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilters: QueryFilters = { queryKey: ["post-feed"] };
      await queryClient.cancelQueries(queryFilters);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilters,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.filter((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((post) => post.id !== deletedPost.id),
            })),
          };
        },
      );
      toast({
        description: "Post supprimé",
      });

      if (pathname === `/posts/${deletedPost.id}`) {
        router.push(`/users/${deletedPost.author.username}`);
      }
    },
    onError: (error) => {
      console.log("🚀 ~ useDeletePostMutation ~ error:", error);
      toast({
        variant: "destructive",
        description: "Quelque chose s'est mal passé",
      });
    },
  });

  return mutation;
};
