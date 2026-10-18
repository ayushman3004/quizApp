/**
 * QuizVerse Archetype Classification Engine (Section 46)
 */

export interface PlayerStats {
  averageResponseTimeSec: number;
  accuracy: number; // 0 to 100
  categoriesPlayed: Record<string, { total: number; correct: number }>;
  comebackWins: number;
  matchesPlayed: number;
}

export type ArchetypeType =
  | "SPEEDSTER"
  | "STRATEGIST"
  | "CLUTCHER"
  | "SCHOLAR"
  | "SPECIALIST"
  | "UNRANKED";

export function determinePlayerArchetype(stats: PlayerStats): {
  archetype: ArchetypeType;
  title: string;
  description: string;
  badge: string;
} {
  if (stats.matchesPlayed < 3) {
    return {
      archetype: "UNRANKED",
      title: "Rising Challenger",
      description: "Play a few more competitive matches in The Ring to discover your playstyle.",
      badge: "🌱",
    };
  }

  // Specialist: >= 70% of matches in one category with >= 85% accuracy
  const categoryNames = Object.keys(stats.categoriesPlayed);
  let dominantCategory = "";
  let highestCategoryRatio = 0;
  let dominantCategoryAccuracy = 0;
  let highAccuracyCategoryCount = 0;

  for (const cat of categoryNames) {
    const data = stats.categoriesPlayed[cat];
    const catAcc = data.total > 0 ? (data.correct / data.total) * 100 : 0;
    const ratio = data.total / (stats.matchesPlayed || 1);
    if (ratio > highestCategoryRatio) {
      highestCategoryRatio = ratio;
      dominantCategory = cat;
      dominantCategoryAccuracy = catAcc;
    }
    if (catAcc >= 75 && data.total >= 5) {
      highAccuracyCategoryCount++;
    }
  }

  if (highestCategoryRatio >= 0.65 && dominantCategoryAccuracy >= 80) {
    return {
      archetype: "SPECIALIST",
      title: `Specialist (${dominantCategory})`,
      description: `Unrivaled master of ${dominantCategory} with laser-focused domain accuracy.`,
      badge: "🎯",
    };
  }

  // Scholar: High performance across 3 or more categories
  if (highAccuracyCategoryCount >= 3) {
    return {
      archetype: "SCHOLAR",
      title: "The Scholar",
      description: "Exhibits polymath breadth across science, economics, history, and general knowledge.",
      badge: "📚",
    };
  }

  // Speedster: Lightning fast response time (< 3.2s) with acceptable accuracy (> 70%)
  if (stats.averageResponseTimeSec <= 3.2 && stats.accuracy >= 70) {
    return {
      archetype: "SPEEDSTER",
      title: "The Speedster",
      description: "Blazes through questions in under 3.2s, stacking maximum speed bonuses.",
      badge: "⚡",
    };
  }

  // Clutcher: High ratio of comeback wins
  if (stats.comebackWins >= 3 && stats.comebackWins / stats.matchesPlayed >= 0.25) {
    return {
      archetype: "CLUTCHER",
      title: "The Clutcher",
      description: "Excels under pressure, turning the tides in final rounds when behind.",
      badge: "🔥",
    };
  }

  // Strategist: Exceptionally high overall accuracy
  if (stats.accuracy >= 80) {
    return {
      archetype: "STRATEGIST",
      title: "The Strategist",
      description: "Calculated and deliberate; prizes pure accuracy and unbreakable streaks.",
      badge: "🧠",
    };
  }

  return {
    archetype: "STRATEGIST",
    title: "The Contender",
    description: "Versatile competitor climbing through The Ring.",
    badge: "⚔️",
  };
}
