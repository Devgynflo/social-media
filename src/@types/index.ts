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

export const userDataSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export const postDataIncludeUser = {
  author: {
    select: userDataSelect,
  },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataIncludeUser;
}>;

export interface PostPage {
  posts: PostData[];
  nextCursor: string | null;
  
}
