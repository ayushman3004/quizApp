import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_demo_1";

    const notifs = store.notifications.get(userId) || [];

    return NextResponse.json({
      success: true,
      unreadCount: notifs.filter((n) => !n.isRead).length,
      notifications: notifs,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, notificationId } = body;
    const targetUserId = userId || "usr_demo_1";

    const notifs = store.notifications.get(targetUserId) || [];
    if (notificationId) {
      const item = notifs.find((n) => n.id === notificationId);
      if (item) item.isRead = true;
    } else {
      // Mark all read
      notifs.forEach((n) => (n.isRead = true));
    }

    return NextResponse.json({
      success: true,
      message: "Notifications updated",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
