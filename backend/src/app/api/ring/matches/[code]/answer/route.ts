import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const authHeader = req.headers.get("authorization");
    let userId = "usr_demo_1";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const decoded = verifyToken(authHeader.substring(7));
      if (decoded?.userId) {
        userId = decoded.userId;
      }
    }

    const body = await req.json();
    const { questionIndex, selectedAnswer, timeTakenSec } = body;

    const answerArray = Array.isArray(selectedAnswer)
      ? selectedAnswer
      : [String(selectedAnswer)];

    const result = store.submitAnswer({
      matchCode: code,
      userId: body.userId || userId,
      questionIndex: typeof questionIndex === "number" ? questionIndex : 0,
      selectedAnswer: answerArray,
      timeTakenSec: Number(timeTakenSec) || 3.5,
    });

    return NextResponse.json({
      success: true,
      message: result.isCorrect ? "Correct answer!" : "Incorrect answer",
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
