"use client";

import { NotificationPage, PostPage } from "@/@types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { NextPage } from "next";
import kyInstance from "@/lib/ky";
import { PostsLoadingSkeleton } from "@/components/posts/posts-loading-skeleton";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import { NotificationItem } from "./notification-item";
import { useEffect } from "react";

interface NotificationsProps {}

export const Notifications: NextPage<NotificationsProps> = ({}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/notifications`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch("/api/notifications/mark-as-read"),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notifications-count"], {
        unreadCount: 0,
      });
    },
    onError(error) {
      console.log("🚀 ~ error => Failed to mark notification as read", error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  if (status === "pending") return <PostsLoadingSkeleton />;

  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        Vous n&apos;avez pas encore de notifications
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
      {notifications?.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && <PostsLoadingSkeleton />}
    </InfiniteScrollContainer>
  );
};
