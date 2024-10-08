import { NextPage } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BellIcon, BookmarkIcon, HomeIcon, MailIcon } from "lucide-react";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NotificationsButton } from "./notifications-button";
import { MessagesButton } from "./messages-button";
import streamServerClient from "@/lib/stream";

interface MenuBarProps {
  className?: string;
}

export const MenuBar: NextPage<MenuBarProps> = async ({ className }) => {
  const { user } = await validateRequest();
  if (!user) return null;

  const [unreadNotificationCount, { total_unread_count }] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    streamServerClient.getUnreadCount(user.id),
  ]);

  return (
    <div className={className}>
      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3"
        title="Accueil"
        asChild
      >
        <Link href={"/"}>
          <HomeIcon />
          <span className="hidden lg:inline">Accueil</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />
      <MessagesButton initialState={{ unreadCount: total_unread_count }} />
      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3"
        title="Marque page"
        asChild
      >
        <Link href={"/bookmarks"}>
          <BookmarkIcon />
          <span className="hidden lg:inline">Marque-Page</span>
        </Link>
      </Button>
    </div>
  );
};
