import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const match = store.getOrCreateMatch(code);

    const leaderboard = match.participants
      .slice()
      .sort((a, b) => b.currentScore - a.currentScore)
      .map((p, idx) => ({
        finalRank: idx + 1,
        userId: p.userId,
        username: p.username,
        displayName: p.displayName,
        avatarUrl: p.avatarUrl,
        finalScore: p.currentScore,
        correctCount: p.correctCount,
        accuracy: Math.round((p.correctCount / Math.max(1, match.totalQuestions)) * 100),
        highestStreak: p.highestStreak,
        speedBonusTotal: p.speedBonusTotal,
        streakBonusTotal: p.streakBonusTotal,
        xpEarned: p.xpEarned || 250,
        coinsEarned: p.coinsEarned || 35,
        ratingDelta: p.ratingDelta || 18,
      }));

    return NextResponse.json({
      success: true,
      message: "Match final results compiled",
      matchId: match.id,
      matchCode: match.code,
      totalQuestions: match.totalQuestions,
      category: match.category,
      results: leaderboard,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
