import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  try {
    const list = Array.from(store.tournaments.values());
    return NextResponse.json({
      success: true,
      tournaments: list,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tournamentId, userId } = body;

    const tournament = store.tournaments.get(tournamentId);
    if (!tournament) {
      return NextResponse.json({ success: false, error: "Tournament not found" }, { status: 404 });
    }

    const user = store.users.get(userId || "usr_demo_1");
    if (user) {
      if (user.coins < tournament.entryFeeCoins) {
        return NextResponse.json(
          { success: false, error: `Insufficient coins. Entry fee is ${tournament.entryFeeCoins} coins.` },
          { status: 400 }
        );
      }
      user.coins -= tournament.entryFeeCoins;
      tournament.registeredCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully registered for ${tournament.title}!`,
      tournament,
      remainingCoins: user?.coins,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
