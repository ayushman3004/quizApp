import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const username = body.username || "Guest_" + Math.floor(1000 + Math.random() * 9000);
    const guestId = "usr_guest_" + Date.now();

    const guestUser = {
      id: guestId,
      email: `${username.toLowerCase()}@guest.quizverse.io`,
      username,
      displayName: username,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/png?seed=${username}`,
      preferredLanguage: "en",
      ageBracket: "18-24",
      country: "IN",
      interests: ["General Knowledge", "Economics"],
      role: "USER" as const,
      rating: 1200,
      xp: 0,
      level: 1,
      coins: 100,
      streak: 1,
      longestStreak: 1,
      matchesPlayed: 0,
      matchesWon: 0,
      accuracy: 0.0,
      totalQuestionsAnswered: 0,
      bestAnswerStreak: 0,
      archetype: "UNRANKED" as const,
      createdAt: new Date().toISOString(),
    };

    store.users.set(guestUser.id, guestUser);
    store.users.set(guestUser.username.toLowerCase(), guestUser);

    const token = signToken({
      userId: guestUser.id,
      email: guestUser.email,
      username: guestUser.username,
      role: guestUser.role,
    });

    return NextResponse.json({
      success: true,
      message: "Guest session initialized",
      token,
      user: guestUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
