import { CommentPage, getCommentDataIncludeUser } from "@/@types";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user } = await validateRequest();
    const cursor = req.nextUrl.searchParams.get("cursor");

    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const pageSize = 5;

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: getCommentDataIncludeUser(user.id),
      orderBy: {
        createdAt: "asc",
      },
      take: -pageSize - 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const previousCursor = comments.length > pageSize ? comments[0].id : null;

    const data: CommentPage = {
      comments: comments.length > pageSize ? comments.slice(1) : comments,
      previousCursor,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.log("🚀 ~ error GET /api/posts/:postId/comments", error);
  }
}
