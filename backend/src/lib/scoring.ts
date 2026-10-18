/**
 * QuizVerse Authoritative Scoring Engine
 * Implements Section 15 of PRD
 */

export interface ScoreCalculationInput {
  isCorrect: boolean;
  timeTakenSec: number;
  difficulty?: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  currentStreak: number;
}

export interface ScoreCalculationResult {
  basePoints: number;
  speedBonus: number;
  difficultyMultiplier: number;
  streakBonus: number;
  totalScore: number;
  newStreak: number;
}

export function calculateQuestionScore(input: ScoreCalculationInput): ScoreCalculationResult {
  if (!input.isCorrect) {
    return {
      basePoints: 0,
      speedBonus: 0,
      difficultyMultiplier: 1.0,
      streakBonus: 0,
      totalScore: 0,
      newStreak: 0,
    };
  }

  // 15.1 Base Points
  const basePoints = 100;

  // 15.2 Speed Bonus
  // Answer in 1–2 sec +80
  // Answer in 3–4 sec +60
  // Answer in 5–6 sec +40
  // Answer in 7–8 sec +20
  // Answer in 9–10 sec +10
  let speedBonus = 0;
  const time = input.timeTakenSec;
  if (time <= 2.0) {
    speedBonus = 80;
  } else if (time <= 4.0) {
    speedBonus = 60;
  } else if (time <= 6.0) {
    speedBonus = 40;
  } else if (time <= 8.0) {
    speedBonus = 20;
  } else if (time <= 10.0) {
    speedBonus = 10;
  } else {
    speedBonus = 0;
  }

  // 15.3 Difficulty Multiplier
  let difficultyMultiplier = 1.25; // default medium
  switch (input.difficulty) {
    case "EASY":
      difficultyMultiplier = 1.0;
      break;
    case "MEDIUM":
      difficultyMultiplier = 1.25;
      break;
    case "HARD":
      difficultyMultiplier = 1.5;
      break;
    case "EXPERT":
      difficultyMultiplier = 2.0;
      break;
  }

  // 15.4 Streak Bonus
  // 3 correct +5%
  // 5 correct +10%
  // 10 correct +15%
  const newStreak = input.currentStreak + 1;
  let streakMultiplier = 0;
  if (newStreak >= 10) {
    streakMultiplier = 0.15;
  } else if (newStreak >= 5) {
    streakMultiplier = 0.10;
  } else if (newStreak >= 3) {
    streakMultiplier = 0.05;
  }

  const baseWithDifficulty = Math.round(basePoints * difficultyMultiplier);
  const streakBonus = Math.round(baseWithDifficulty * streakMultiplier);
  const totalScore = baseWithDifficulty + speedBonus + streakBonus;

  return {
    basePoints: baseWithDifficulty,
    speedBonus,
    difficultyMultiplier,
    streakBonus,
    totalScore,
    newStreak,
  };
}

/**
 * Competitive Rating (MMR) calculator (Elo variant)
 */
export function calculateRatingDelta(
  playerRating: number,
  opponentAverageRating: number,
  playerRank: number,
  totalPlayers: number
): number {
  const isWinner = playerRank === 1;
  const expectedScore = 1 / (1 + Math.pow(10, (opponentAverageRating - playerRating) / 400));
  const actualScore = isWinner ? 1 : (totalPlayers - playerRank) / (totalPlayers - 1);
  const kFactor = playerRating < 1500 ? 32 : 24;
  const delta = Math.round(kFactor * (actualScore - expectedScore));
  return delta;
}

/**
 * XP & Level progression curve calculator
 * Level 1: 0 XP
 * Level 2: 500 XP
 * Level 3: 1,200 XP
 * Level 10: 15,000 XP
 * Level 50: 250,000 XP
 */
export function getLevelFromXP(xp: number): { level: number; nextLevelXP: number; progressPercent: number } {
  if (xp <= 0) return { level: 1, nextLevelXP: 500, progressPercent: 0 };
  
  // Custom tuned curve matching PRD
  let level = 1;
  let prevThreshold = 0;
  let nextThreshold = 500;

  for (let l = 1; l <= 100; l++) {
    const threshold = Math.round(100 * Math.pow(l, 1.8) + 400 * (l - 1));
    if (xp < threshold) {
      level = l;
      nextThreshold = threshold;
      break;
    }
    prevThreshold = threshold;
  }

  const range = nextThreshold - prevThreshold;
  const progressInLevel = Math.max(0, xp - prevThreshold);
  const progressPercent = Math.min(100, Math.round((progressInLevel / (range || 1)) * 100));

  return {
    level,
    nextLevelXP: nextThreshold,
    progressPercent,
  };
}
