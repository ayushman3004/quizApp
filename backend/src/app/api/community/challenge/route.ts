import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "usr_demo_1";

    const challenges = Array.from(store.friendChallenges.values()).filter(
      (c) => c.receiverId === userId || c.senderId === userId
    );

    return NextResponse.json({
      success: true,
      challenges,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { senderId, receiverId, quizId, senderScore } = body;

    const sender = store.users.get(senderId || "usr_demo_1") || store.users.get("usr_demo_1")!;
    const quiz = store.quizzes.get(quizId || "quiz_econ_master") || Array.from(store.quizzes.values())[0];

    const challengeId = "chal_" + Date.now();
    const challenge = {
      id: challengeId,
      senderId: sender.id,
      senderName: sender.displayName,
      receiverId: receiverId || "usr_creator_rahul",
      receiverName: "Rahul Sharma",
      quizId: quiz.id,
      quizTitle: quiz.title,
      senderScore: Number(senderScore) || 1840,
      status: "PENDING" as const,
      createdAt: new Date().toISOString(),
    };

    store.friendChallenges.set(challengeId, challenge);

    // Also trigger notification for receiver
    const receiverNotifs = store.notifications.get(challenge.receiverId) || [];
    receiverNotifs.unshift({
      id: "notif_" + Date.now(),
      userId: challenge.receiverId,
      title: `${sender.displayName} challenged you! ⚔️`,
      body: `You scored ${challenge.senderScore} in ${quiz.title}. Can you beat them?`,
      type: "CHALLENGE",
      actionUrl: `/ring?challengeId=${challenge.id}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    store.notifications.set(challenge.receiverId, receiverNotifs);

    return NextResponse.json({
      success: true,
      message: `Friend challenge sent to ${challenge.receiverName}!`,
      challenge,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
