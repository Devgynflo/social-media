import { UnreadNotificationCount } from "@/@types";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    });

    const data: UnreadNotificationCount = {
      unreadCount,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.log("🚀 ~ error GET /api/notifications/unread-count", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
