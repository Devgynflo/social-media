import { Prisma } from "@prisma/client";

export interface DatabaseUserAttributes {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
}

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  SKELETON = "skeleton",
  PASSWORD = "password",
}

/* Prisma types */

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export function getPostDataIncludeUser(loggedInUserId: string) {
  return {
    author: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataIncludeUser>;
}>;

export interface PostPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}
