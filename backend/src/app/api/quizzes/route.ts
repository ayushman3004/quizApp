import { NextResponse } from "next/server";
import { store, QuizRecord } from "@/lib/store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let quizList = Array.from(store.quizzes.values());

    if (category && category !== "All") {
      quizList = quizList.filter((q) => q.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      quizList = quizList.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(q) ||
          quiz.description.toLowerCase().includes(q) ||
          quiz.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      count: quizList.length,
      quizzes: quizList.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        subject: quiz.subject,
        topic: quiz.topic,
        coverImage: quiz.coverImage,
        difficulty: quiz.difficulty,
        dynamicDifficulty: quiz.dynamicDifficulty,
        playCount: quiz.playCount,
        rating: quiz.rating,
        timeLimitSec: quiz.timeLimitSec,
        questionCount: quiz.questions.length,
        tags: quiz.tags,
        creator: {
          id: quiz.creatorId,
          name: quiz.creatorName,
          avatar: quiz.creatorAvatar,
        },
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, category, questions, difficulty, timeLimitSec, tags, creatorId } = body;

    if (!title || !category || !questions || !questions.length) {
      return NextResponse.json(
        { success: false, error: "Title, category, and at least one question are required" },
        { status: 400 }
      );
    }

    const creator = store.users.get(creatorId || "usr_demo_1") || store.users.get("usr_demo_1")!;

    const newQuiz: QuizRecord = {
      id: "quiz_" + Date.now(),
      title,
      description: description || "",
      category,
      coverImage: body.coverImage || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=80",
      difficulty: difficulty || "MEDIUM",
      dynamicDifficulty: 2.5,
      isPublished: true,
      playCount: 0,
      rating: 5.0,
      timeLimitSec: timeLimitSec || 15,
      tags: tags || [category],
      creatorId: creator.id,
      creatorName: creator.displayName,
      creatorAvatar: creator.avatarUrl,
      questions,
    };

    store.quizzes.set(newQuiz.id, newQuiz);

    return NextResponse.json({
      success: true,
      message: "Quiz published successfully",
      quiz: newQuiz,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
