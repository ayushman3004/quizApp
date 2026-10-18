import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const usersCount = Array.from(store.users.values()).length;
  const quizzesCount = Array.from(store.quizzes.values()).length;
  const matchesCount = Array.from(store.matches.values()).length;
  const tournamentsCount = Array.from(store.tournaments.values()).length;

  return NextResponse.json({
    status: "healthy",
    service: "QuizVerse Next.js Backend Engine",
    version: "2.4.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    metrics: {
      registeredUsers: usersCount,
      activeQuizzes: quizzesCount,
      matchesInTheRing: matchesCount,
      tournamentsHosted: tournamentsCount,
      ecosystems: [
        "The Ring (1v1, Quick Match, Multiplayer)",
        "Journey (Structured Learning & Mastery)",
        "Substack-style Quiz Masters (Creators)",
        "Tournaments & Institutional Arenas",
        "Community & Friend Battles",
        "Authoritative Speed/Streak Scoring Engine",
      ],
    },
  });
}
