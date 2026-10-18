import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  try {
    const creators = Array.from(store.users.values())
      .filter((u) => u.role === "QUIZ_MASTER")
      .map((c) => {
        const creatorQuizzes = Array.from(store.quizzes.values()).filter((q) => q.creatorId === c.id);
        const totalPlays = creatorQuizzes.reduce((sum, q) => sum + q.playCount, 0);

        return {
          id: c.id,
          username: c.username,
          displayName: c.displayName,
          avatarUrl: c.avatarUrl,
          bio: c.bio,
          rating: c.creatorRating || 4.9,
          followersCount: c.creatorFollowersCount || 1200,
          totalQuizzes: creatorQuizzes.length || 1,
          totalPlays,
          isVerified: c.isVerifiedCreator || true,
          topQuizzes: creatorQuizzes.map((q) => ({
            id: q.id,
            title: q.title,
            category: q.category,
            playCount: q.playCount,
            rating: q.rating,
          })),
        };
      });

    return NextResponse.json({
      success: true,
      creators,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
