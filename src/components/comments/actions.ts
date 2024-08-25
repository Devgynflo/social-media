"use server";

import { getCommentDataIncludeUser, PostData } from "@/@types";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createCommenSchema } from "@/lib/validation";

export async function submitComment({
  content,
  post,
}: {
  content: string;
  post: PostData;
}) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content: validatedContent } = createCommenSchema.parse({ content });

  const newComment = await prisma.comment.create({
    data: {
      content: validatedContent,
      postId: post.id,
      userId: user.id,
    },
    include: getCommentDataIncludeUser(user.id),
  });

  return newComment;
}

export async function deleteComment({ id }: { id: string }) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });

  if (!comment) {
    throw new Error("Commentaire introuvable");
  }

  if (comment.userId !== user.id) {
    throw new Error("Vous n'êtes pas autorisé à supprimer ce commentaire");
  }

  const deletedComment = await prisma.comment.delete({
    where: {
      id,
    },
    include: getCommentDataIncludeUser(user.id),
  });

  return deletedComment;
}
