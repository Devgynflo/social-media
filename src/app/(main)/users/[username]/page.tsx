import { FollowerInfo, getUserDataSelect, UserData } from "@/@types";
import { FollowButton } from "@/components/follow-button";
import FollowerCount from "@/components/follower-count";
import { TrendsSidebar } from "@/components/trends-sidebar";
import { UserAvatar } from "@/components/user-avatar";
import { PostFeed } from "./_components/post-feed";
import Linkify from "@/components/linkify";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { UserProfileButton } from "./_components/user-profile-button";

interface PageProps {
  params: {
    username: string;
  };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) return notFound();

  return user;
});

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser?.id);

  return {
    title: `${user.displayName} @${user.username}`,
    description: ``,
  };
}

const Page = async ({ params: { username } }: PageProps) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};
  const user = await getUser(username, loggedInUser?.id);

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        Vous devez être connecté pour voir cette page.
      </p>
    );
  }
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile loggedInUserId={loggedInUser.id} user={user} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <PostFeed userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default Page;

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.length,
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Membre depuis {formatDate(user.createdAt, "d/MM/yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <UserProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}
