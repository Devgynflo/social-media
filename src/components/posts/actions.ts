"use server";

import { getPostDataIncludeUser } from "@/@types";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const deletePost = async (id: string) => {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.authorId !== user.id) {
    throw new Error("You are not the author of this post");
  }

  const deletedPost = await prisma.post.delete({
    where: {
      id,
    },
    include: getPostDataIncludeUser(user.id),
  });

  return deletedPost;
};
