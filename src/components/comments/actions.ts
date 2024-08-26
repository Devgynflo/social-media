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

  const [newComment, _notification] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: validatedContent,
        postId: post.id,
        userId: user.id,
      },
      include: getCommentDataIncludeUser(user.id),
    }),
    ...(post.author.id !== user.id
      ? [
          prisma.notification.create({
            data: {
              recipientId: post.author.id,
              issuerId: user.id,
              type: "COMMENT",
              postId: post.id,
            },
          }),
        ]
      : []),
  ]);

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
  /* TODO: Supprimer la notification si le message est supprimé par l'auteur */
  const deletedComment = await prisma.comment.delete({
    where: {
      id,
    },
    include: getCommentDataIncludeUser(user.id),
  });

  return { postId: deletedComment.postId, id: deletedComment.id };
}
