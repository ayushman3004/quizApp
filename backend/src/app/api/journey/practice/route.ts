import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subjectId, topicId, lessonId, scorePercent, timeSpentSec } = body;

    const subjects = store.getJourneySubjects();
    const subject = subjects.find((s) => s.id === subjectId) || subjects[0];
    const topic = subject.topics.find((t) => t.id === topicId) || subject.topics[0];
    const lesson = topic.lessons.find((l) => l.id === lessonId) || topic.lessons[0];

    const score = typeof scorePercent === "number" ? scorePercent : 85;
    lesson.mastery = Math.min(100, Math.max(lesson.mastery, score));
    if (lesson.mastery >= 75) {
      lesson.completed = true;
      lesson.weakAreas = [];
    }

    const xpEarned = Math.round(score * 1.5) + 50;
    const coinsEarned = score >= 80 ? 20 : 10;

    const demoUser = store.users.get("usr_demo_1");
    if (demoUser) {
      demoUser.xp += xpEarned;
      demoUser.coins += coinsEarned;
    }

    return NextResponse.json({
      success: true,
      message: "Practice lesson completed",
      lessonTitle: lesson.title,
      mastery: lesson.mastery,
      completed: lesson.completed,
      xpEarned,
      coinsEarned,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
