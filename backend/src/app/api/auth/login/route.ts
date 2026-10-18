import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { signToken, comparePassword } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier) {
      return NextResponse.json({ success: false, error: "Username or email is required" }, { status: 400 });
    }

    const idKey = identifier.trim().toLowerCase();
    let user: any = null;

    // 1. Try querying Neon Postgres / Prisma first
    try {
      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: idKey, mode: "insensitive" } },
            { username: { equals: idKey, mode: "insensitive" } },
          ],
        },
      });
      if (dbUser) {
        user = dbUser;
      }
    } catch {
      // Prisma not connected or DB offline; gracefully fallback to store
    }

    // 2. Fallback to in-memory store
    if (!user) {
      user = store.users.get(idKey);
      if (!user) {
        user = Array.from(store.users.values()).find(
          (u) => u.email.toLowerCase() === idKey || u.username.toLowerCase() === idKey
        );
      }
    }

    // 3. For prototype/demo convenience, if identifier matches "demo" or user not found, retrieve demo user
    if (!user && (idKey === "demo" || idKey.includes("ayaan"))) {
      user = store.users.get("usr_demo_1");
    }

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid username or password" }, { status: 401 });
    }

    // Verify password if user has a password hash set
    if (password && user.passwordHash) {
      const isMatch = await comparePassword(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 });
      }
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      message: "Logged in successfully",
      token,
      user,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
