import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get("type")?.toUpperCase() || "COMPETITIVE") as
      | "GLOBAL"
      | "COMPETITIVE"
      | "XP"
      | "STREAK"
      | "CREATORS";

    const rankings = store.getLeaderboards(type);

    return NextResponse.json({
      success: true,
      type,
      rankings,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
