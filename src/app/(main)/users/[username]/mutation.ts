import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";
import { PostPage } from "@/@types";

export function useUpdateUserProfileMutation() {
  const { toast } = useToast();
  const router = useRouter();

  const queryClient = useQueryClient();

  const { startUpload: startUploadAvatar } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        avatar && startUploadAvatar([avatar]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadedAvatar]) => {
      const newAvatarUrl = uploadedAvatar?.[0]?.serverData.avatarUrl;

      const queryFilter: QueryFilters = {
        queryKey: ["posts-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.author.id === updatedUser.id) {
                  return {
                    ...post,
                    author: {
                      ...post.author,
                      avatarUrl: newAvatarUrl || post.author.avatarUrl,
                    },
                  };
                }

                return post;
              }),
            })),
          };
        },
      );

      router.refresh();
      toast({
        description: "Votre profil vient d'être mis à jour.",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        description: "Erreur lors de la mise à jour du profil",
        variant: "destructive",
      });
    },
  });

  return mutation;
}
