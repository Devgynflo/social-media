"use client";

import { PostPage } from "@/@types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { PostItem } from "./posts/list";
import kyInstance from "@/lib/ky";
import InfiniteScrollContainer from "./infinite-scroll-container";
import { PostsLoadingSkeleton } from "./posts/posts-loading-skeleton";

interface FollowingFeedProps {}

export const FollowingFeed: NextPage<FollowingFeedProps> = ({}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts-feed", "following"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/posts/following`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") return <PostsLoadingSkeleton />;

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        Aucun posts trouvés . Commencez à suivre des utilisateurs pour les
        afficher.
      </p>
    );
  }

  if (status === "error")
    return (
      <div className="flex flex-col items-center justify-center">
        <p>Une erreur s&apos;est produite, veuillez réessayer plus tard.</p>
      </div>
    );

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts?.map((post) => <PostItem key={post.id} post={post} />)}
      {isFetchingNextPage && <PostsLoadingSkeleton />}
    </InfiniteScrollContainer>
  );
};
