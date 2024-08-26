"use client";

import { NotificationData } from "@/@types";
import { NextPage } from "next";
import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { cn, formatRelativeDate } from "@/lib/utils";
import Linkify from "@/components/linkify";
import { NotificationType } from "@prisma/client";
import { HeartIcon, MessageCircleIcon, User2Icon } from "lucide-react";

interface NotificationItemProps {
  notification: NotificationData;
}

export const NotificationItem: NextPage<NotificationItemProps> = ({
  notification,
}) => {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: ` vous suit.`,
      icon: <User2Icon className="size-7 fill-blue-500 text-blue-500" />,
      href: `/users/${notification.issuer?.username}`,
    },

    COMMENT: {
      message: ` a commenté votre post.`,
      icon: <MessageCircleIcon className="size-7 fill-primary text-primary" />,
      href: `/post/${notification.postId}`,
    },
    LIKE: {
      message: ` a aimé votre post.`,
      icon: <HeartIcon className="size-7 fill-red-500 text-red-500" />,
      href: `/post/${notification.postId}`,
    },
  };

  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.issuer?.avatarUrl} size={36} />
          <div className="">
            <span className="font-bold">
              {notification.issuer?.displayName}
            </span>
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-2 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};
