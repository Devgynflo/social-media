"use client";

import { UnreadMessageCount } from "@/@types";
import { NextPage } from "next";
import { Button } from "./ui/button";
import Link from "next/link";
import { BellIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface MessagesButtonProps {
  initialState: UnreadMessageCount;
}

export const MessagesButton: NextPage<MessagesButtonProps> = ({
  initialState,
}) => {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance.get("/api/messages/unread-count").json<UnreadMessageCount>(),
    initialData: initialState,
    refetchInterval: 60 * 1000, // 1 minute
  });

  return (
    <Button
      variant={"ghost"}
      className="flex items-center justify-start gap-3"
      title="Messages"
      asChild
    >
      <Link href={"/messages"}>
        <div className="relative">
          <BellIcon />
          {!!data?.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>

        <span className="hidden lg:inline">Messages</span>
      </Link>
    </Button>
  );
};
