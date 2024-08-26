import { UnreadNotificationCount } from "@/@types";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH() {
  try {
    const { user } = await validateRequest();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.notification.updateMany({
      where: {
        recipientId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return Response.json(null, { status: 200 });
  } catch (error) {
    console.log("🚀 ~ error GET /api/notifications/unread-count", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
