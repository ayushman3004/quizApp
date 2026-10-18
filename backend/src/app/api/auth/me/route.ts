import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { store } from "@/lib/store";
import { getLevelFromXP } from "@/lib/scoring";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized: Missing Bearer token" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
    }

    let user: any = null;

    // Check Prisma DB
    try {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
    } catch {
      // Prisma offline
    }

    // Fallback store
    if (!user) {
      user = store.users.get(decoded.userId) || store.users.get(decoded.username?.toLowerCase());
    }

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const levelInfo = getLevelFromXP(user.xp || 0);

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        levelInfo,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
