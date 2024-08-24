import { UserData } from "@/@types";
import { validateRequest } from "@/lib/auth";
import { NextPage } from "next";
import UserTooltip from "../user-tooltip";
import Link from "next/link";
import { UserAvatar } from "../user-avatar";
import Linkify from "../linkify";
import { FollowButton } from "../follow-button";

interface UserInfoSidebarProps {
  user: UserData;
}

export const UserInfoSidebar: NextPage<UserInfoSidebarProps> = async ({
  user,
}) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-sl font-bold">A propos de l&apos;utilisateur</div>
      <UserTooltip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div className="">
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>

      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>

      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: !!user.followers.length,
          }}
        />
      )}
    </div>
  );
};
