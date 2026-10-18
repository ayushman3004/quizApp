import { NextResponse } from "next/server";
import { store, UserRecord } from "@/lib/store";
import { signToken, hashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, displayName, email, password, preferredLanguage, ageBracket, country, interests } = body;

    if (!username || !email) {
      return NextResponse.json({ success: false, error: "Username and email are required" }, { status: 400 });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = password ? await hashPassword(password) : undefined;

    // Check existing in Prisma
    let existingUser = null;
    try {
      existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: cleanEmail, mode: "insensitive" } },
            { username: { equals: cleanUsername, mode: "insensitive" } },
          ],
        },
      });
    } catch {
      // Prisma offline or schema not migrated yet
    }

    // Check existing in in-memory store
    if (!existingUser && (store.users.has(cleanUsername.toLowerCase()) || store.users.has(cleanEmail))) {
      existingUser = true;
    }

    if (existingUser) {
      return NextResponse.json({ success: false, error: "Username or email is already taken" }, { status: 409 });
    }

    let newUser: any = null;

    // Try creating in Neon Postgres via Prisma
    try {
      newUser = await prisma.user.create({
        data: {
          email: cleanEmail,
          username: cleanUsername,
          displayName: displayName || cleanUsername,
          passwordHash,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(cleanUsername)}`,
          preferredLanguage: preferredLanguage || "en",
          ageBracket: ageBracket || "18-24",
          country: country || "IN",
          interests: Array.isArray(interests) ? interests : ["General Knowledge"],
          role: "USER",
          rating: 1200,
          xp: 0,
          level: 1,
          coins: 250, // Welcome bonus
          streak: 1,
          longestStreak: 1,
        },
      });
    } catch {
      // Fallback in-memory store
      newUser = {
        id: "usr_" + Date.now(),
        email: cleanEmail,
        username: cleanUsername,
        displayName: displayName || cleanUsername,
        passwordHash,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(cleanUsername)}`,
        preferredLanguage: preferredLanguage || "en",
        ageBracket: ageBracket || "18-24",
        country: country || "IN",
        interests: Array.isArray(interests) ? interests : ["General Knowledge"],
        role: "USER",
        rating: 1200,
        xp: 0,
        level: 1,
        coins: 250,
        streak: 1,
        longestStreak: 1,
        matchesPlayed: 0,
        matchesWon: 0,
        accuracy: 0.0,
        totalQuestionsAnswered: 0,
        bestAnswerStreak: 0,
        archetype: "UNRANKED",
        createdAt: new Date().toISOString(),
      };
      store.users.set(newUser.id, newUser);
      store.users.set(cleanUsername.toLowerCase(), newUser);
    }

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    });

    return NextResponse.json({
      success: true,
      message: "Registration complete",
      token,
      user: newUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
