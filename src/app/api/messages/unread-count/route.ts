import { UnreadMessageCount } from "@/@types";
import { validateRequest } from "@/lib/auth";
import streamServerClient from "@/lib/stream";

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { total_unread_count } = await streamServerClient.getUnreadCount(
      user.id,
    );

    const data: UnreadMessageCount = {
      unreadCount: total_unread_count,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.log("🚀 ~ error GET /api/notifications/unread-count", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
