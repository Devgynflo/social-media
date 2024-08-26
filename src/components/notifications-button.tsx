"use client";

import { UnreadNotificationCount } from "@/@types";
import { NextPage } from "next";
import { Button } from "./ui/button";
import Link from "next/link";
import { BellIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface NotificationsButtonProps {
  initialState: UnreadNotificationCount;
}

export const NotificationsButton: NextPage<NotificationsButtonProps> = ({
  initialState,
}) => {
  const { data } = useQuery({
    queryKey: ["unread-notifications-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<UnreadNotificationCount>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant={"ghost"}
      className="flex items-center justify-start gap-3"
      title="Notifications"
      asChild
    >
      <Link href={"/notifications"}>
        <div className="relative">
          <BellIcon />
          {!!data?.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>

        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  );
};
