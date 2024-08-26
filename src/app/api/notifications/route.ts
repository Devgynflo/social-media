import { notificationInclude, NotificationPage } from "@/@types";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user)
      return Response.json(
        { error: "Unauthorized" },
        {
          status: 401,
        },
      );
    const pageSize = 10;
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      include: notificationInclude,
      cursor: cursor ? { id: cursor } : undefined,
      take: pageSize + 1,
      orderBy: {
        createdAt: "desc",
      },
    });

    const nextCursor =
      notifications.length > pageSize ? notifications[pageSize].id : null;

    const data: NotificationPage = {
      notifications: notifications.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.log("🚀 ~ error GET /api/notifications", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
