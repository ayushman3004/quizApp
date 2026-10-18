import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const creator = store.users.get(id);

    if (!creator || creator.role !== "QUIZ_MASTER") {
      return NextResponse.json({ success: false, error: "Creator not found" }, { status: 404 });
    }

    const quizzes = Array.from(store.quizzes.values()).filter((q) => q.creatorId === creator.id);

    return NextResponse.json({
      success: true,
      creator: {
        id: creator.id,
        username: creator.username,
        displayName: creator.displayName,
        avatarUrl: creator.avatarUrl,
        bio: creator.bio,
        rating: creator.creatorRating,
        followersCount: creator.creatorFollowersCount,
        publishedQuizzes: quizzes,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const creator = store.users.get(id);

    if (!creator) {
      return NextResponse.json({ success: false, error: "Creator not found" }, { status: 404 });
    }

    creator.creatorFollowersCount = (creator.creatorFollowersCount || 0) + 1;

    return NextResponse.json({
      success: true,
      message: `Following ${creator.displayName}`,
      followersCount: creator.creatorFollowersCount,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
