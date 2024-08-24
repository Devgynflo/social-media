"use client";

import { PostPage } from "@/@types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import kyInstance from "@/lib/ky";
import { PostsLoadingSkeleton } from "@/components/posts/posts-loading-skeleton";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import { PostItem } from "@/components/posts/list";

interface BookmarkFeedProps {}

export const BookmarkFeed: NextPage<BookmarkFeedProps> = ({}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts-feed", "bookmarks"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/posts/bookmarked`,
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
        Vous n&apos;avez pas encore ajouté de post à vos favoris
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
