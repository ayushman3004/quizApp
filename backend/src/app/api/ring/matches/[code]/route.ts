import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const match = store.getOrCreateMatch(code);

    const currentQ = match.questions[match.currentQuestionIndex];

    return NextResponse.json({
      success: true,
      match: {
        id: match.id,
        code: match.code,
        mode: match.mode,
        status: match.status,
        category: match.category,
        totalQuestions: match.totalQuestions,
        currentQuestionIndex: match.currentQuestionIndex,
        roundTimeLimitSec: match.roundTimeLimitSec,
        participants: match.participants.map((p) => ({
          userId: p.userId,
          username: p.username,
          displayName: p.displayName,
          avatarUrl: p.avatarUrl,
          rating: p.rating,
          currentScore: p.currentScore,
          currentRank: p.currentRank,
          currentStreak: p.currentStreak,
          finalPosition: p.finalPosition,
          xpEarned: p.xpEarned,
          coinsEarned: p.coinsEarned,
          ratingDelta: p.ratingDelta,
        })),
        currentQuestion: currentQ
          ? {
              number: match.currentQuestionIndex + 1,
              total: match.totalQuestions,
              type: currentQ.type,
              questionText: currentQ.questionText,
              options: currentQ.options,
              timeLimitSec: currentQ.timeLimitSec,
              difficulty: currentQ.difficulty,
            }
          : null,
        isCompleted: match.status === "COMPLETED",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
