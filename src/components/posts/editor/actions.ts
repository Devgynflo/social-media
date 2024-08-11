"use server";

import { getPostDataIncludeUser } from "@/@types";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: string) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content } = createPostSchema.parse({ content: input });

  const newPost = await prisma.post.create({
    data: {
      content,
      authorId: user.id,
    },
    include: getPostDataIncludeUser(user.id),
  });

  return newPost;
}
