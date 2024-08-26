import { LikeInfo } from "@/@types";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
        likes: {
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return Response.json(
        { error: "Le message n'existe pas" },
        { status: 404 },
      );
    }

    const data: LikeInfo = {
      authorId: post.authorId,
      likes: post._count.likes,
      isLikedByUser: post.likes.some((like) => like.userId === loggedInUser.id),
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  _req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post)
      return Response.json({ error: "Post not found" }, { status: 404 });

    prisma.$transaction([
      prisma.like.upsert({
        where: {
          userId_postId: {
            userId: loggedInUser.id,
            postId: postId,
          },
        },
        create: {
          userId: loggedInUser.id,
          postId: postId,
        },
        update: {},
      }),
      ...(loggedInUser.id !== post.authorId
        ? [
            prisma.notification.create({
              data: {
                recipientId: post.authorId,
                issuerId: loggedInUser.id,
                postId,
                type: "LIKE",
              },
            }),
          ]
        : []),
    ]);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post)
      return Response.json({ error: "Post not found" }, { status: 404 });

    await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          userId: loggedInUser.id,
          postId,
        },
      }),

      prisma.notification.deleteMany({
        where: {
          recipientId: post.authorId,
          issuerId: loggedInUser.id,
          type: "LIKE",
          postId,
        },
      }),
    ]);

    return new Response(null, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
