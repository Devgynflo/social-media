import { postDataIncludeUser } from "@/@types";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const posts = await prisma.post.findMany({
      include: postDataIncludeUser,
      orderBy: { createdAt: "desc" },
    });

    return Response.json(posts);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
