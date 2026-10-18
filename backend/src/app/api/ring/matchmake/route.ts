import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    let userId = "usr_demo_1";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const decoded = verifyToken(authHeader.substring(7));
      if (decoded?.userId) {
        userId = decoded.userId;
      }
    }

    const body = await req.json().catch(() => ({}));
    const mode = body.mode || "QUICK_MATCH";
    const category = body.category || "Economics";
    const requestedUserId = body.userId || userId;

    const match = store.createOrJoinMatch({
      userId: requestedUserId,
      mode,
      category,
    });

    return NextResponse.json({
      success: true,
      message: "Match created/joined in The Ring",
      matchCode: match.code,
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
        })),
        currentQuestion: {
          number: match.currentQuestionIndex + 1,
          total: match.totalQuestions,
          type: match.questions[match.currentQuestionIndex]?.type,
          questionText: match.questions[match.currentQuestionIndex]?.questionText,
          options: match.questions[match.currentQuestionIndex]?.options,
          timeLimitSec: match.questions[match.currentQuestionIndex]?.timeLimitSec,
          difficulty: match.questions[match.currentQuestionIndex]?.difficulty,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
