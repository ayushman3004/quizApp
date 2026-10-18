import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  try {
    const subjects = store.getJourneySubjects();

    // Identify weak areas across all topics for targeted practice recommendation
    const weakAreas = subjects.flatMap((s) =>
      s.topics.flatMap((t) =>
        t.lessons.flatMap((l) =>
          l.weakAreas.map((w) => ({
            subject: s.title,
            topic: t.title,
            lesson: l.title,
            concept: w,
            currentMastery: l.mastery,
          }))
        )
      )
    );

    return NextResponse.json({
      success: true,
      subjects,
      recommendedFocus: weakAreas[0] || null,
      identifiedWeakAreas: weakAreas,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
