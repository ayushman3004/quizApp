import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { verifyToken } from "@/lib/auth";
import { getLevelFromXP } from "@/lib/scoring";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    let userId = "usr_demo_1";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const decoded = verifyToken(authHeader.substring(7));
      if (decoded?.userId) {
        userId = decoded.userId;
      }
    }

    const user = store.users.get(userId) || store.users.get("usr_demo_1")!;
    const levelInfo = getLevelFromXP(user.xp);

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

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    let userId = "usr_demo_1";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const decoded = verifyToken(authHeader.substring(7));
      if (decoded?.userId) {
        userId = decoded.userId;
      }
    }

    const body = await req.json();
    const user = store.users.get(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Update allowed profile fields
    if (body.displayName) user.displayName = body.displayName;
    if (body.avatarUrl) user.avatarUrl = body.avatarUrl;
    if (body.preferredLanguage) user.preferredLanguage = body.preferredLanguage;
    if (body.ageBracket) user.ageBracket = body.ageBracket;
    if (body.country) user.country = body.country;
    if (body.college !== undefined) user.college = body.college;
    if (body.school !== undefined) user.school = body.school;
    if (body.profession !== undefined) user.profession = body.profession;
    if (body.examPreparation !== undefined) user.examPreparation = body.examPreparation;
    if (body.interests) user.interests = body.interests;
    if (body.bio !== undefined) user.bio = body.bio;

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
