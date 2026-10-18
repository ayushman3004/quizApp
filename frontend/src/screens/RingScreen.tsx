import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme";
import { QuizVerseAPI } from "../services/api";

interface RingScreenProps {
  onBackToHome: () => void;
  user: any;
}

type RingState = "LOBBY" | "MATCHMAKING" | "PLAYING" | "RESULTS";

export const RingScreen: React.FC<RingScreenProps> = ({ onBackToHome, user }) => {
  const [gameState, setGameState] = useState<RingState>("LOBBY");
  const [selectedMode, setSelectedMode] = useState<string>("ONE_VS_ONE");
  const [selectedCategory, setSelectedCategory] = useState<string>("Economics");

  // Live Match State
  const [matchData, setMatchData] = useState<any>(null);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [liveLeaderboard, setLiveLeaderboard] = useState<any[]>([]);
  const [finalSummary, setFinalSummary] = useState<any>(null);

  // Timer countdown during gameplay
  useEffect(() => {
    let timer: any;
    if (gameState === "PLAYING" && !answerResult && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, answerResult, timeLeft]);

  const handleStartMatchmaking = async () => {
    setGameState("MATCHMAKING");
    try {
      const res = await QuizVerseAPI.startRingMatch(selectedMode, selectedCategory);
      if (res.success && res.match) {
        setTimeout(() => {
          setMatchData(res.match);
          setCurrentQIndex(0);
          setTimeLeft(15);
          setSelectedAnswerId(null);
          setAnswerResult(null);
          setLiveLeaderboard(res.match.participants);
          setGameState("PLAYING");
        }, 1200); // realistic radar pulse matchmaking
      }
    } catch {
      setGameState("LOBBY");
    }
  };

  const handleTimeUp = () => {
    handleSelectOption("TIMEOUT");
  };

  const handleSelectOption = async (optionId: string) => {
    if (selectedAnswerId || isSubmitting) return;

    setSelectedAnswerId(optionId);
    setIsSubmitting(true);

    const timeTaken = Math.max(0.8, 15 - timeLeft);

    try {
      const code = matchData?.code || "RNG1000";
      const res = await QuizVerseAPI.submitAnswer(code, currentQIndex, [optionId], timeTaken);

      setAnswerResult(res);
      if (res.liveRankings) {
        setLiveLeaderboard(res.liveRankings);
      }

      // Automatically move to next question or complete match
      setTimeout(() => {
        if (res.isMatchCompleted || currentQIndex >= (matchData?.totalQuestions || 5) - 1) {
          compileFinalResults();
        } else {
          setCurrentQIndex((prev) => prev + 1);
          setTimeLeft(15);
          setSelectedAnswerId(null);
          setAnswerResult(null);
          setIsSubmitting(false);
        }
      }, 2500);
    } catch {
      setIsSubmitting(false);
    }
  };

  const compileFinalResults = () => {
    setFinalSummary({
      finalPosition: 1,
      totalScore: 480,
      accuracy: 80,
      highestStreak: 4,
      xpEarned: 280,
      coinsEarned: 45,
      ratingDelta: 18,
    });
    setGameState("RESULTS");
  };

  // 1. Lobby & Arena Mode Selector
  if (gameState === "LOBBY") {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.lobbyHeader}>
          <Text style={styles.lobbyTitle}>THE RING</Text>
          <Text style={styles.lobbySubtitle}>Real-time PvP Competitive Knowledge Arena</Text>
        </View>

        {/* MMR Card */}
        <LinearGradient colors={["#1E1B4B", "#0F172A"]} style={styles.mmrCard}>
          <View style={styles.mmrHeader}>
            <Text style={styles.mmrLabel}>YOUR COMPETITIVE MMR</Text>
            <View style={styles.archetypePill}>
              <Text style={styles.archetypeText}>{user?.archetype || "STRATEGIST"}</Text>
            </View>
          </View>
          <Text style={styles.mmrScore}>{user?.rating || 1680} MMR</Text>
          <Text style={styles.mmrTier}>Rank: Diamond III • Top 4% Platform</Text>
        </LinearGradient>

        {/* Mode Selector */}
        <Text style={styles.sectionHeading}>Select Battle Mode</Text>
        <View style={styles.modesContainer}>
          {[
            { id: "ONE_VS_ONE", title: "1v1 Duel", icon: "⚔️", desc: "Head-to-head tactical showdown" },
            { id: "QUICK_MATCH", title: "Quick Match", icon: "⚡", desc: "Instant matchmaking with balanced MMR" },
            { id: "MULTIPLAYER", title: "Multiplayer Arena", icon: "🏟️", desc: "4-Player free-for-all live elimination" },
            { id: "FRIEND_BATTLE", title: "Challenge Friend", icon: "👥", desc: "Direct room challenge with custom code" },
          ].map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <TouchableOpacity
                key={mode.id}
                style={[styles.modeCard, isSelected && styles.selectedModeCard]}
                onPress={() => setSelectedMode(mode.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.modeIcon}>{mode.icon}</Text>
                <View style={styles.modeInfo}>
                  <Text style={[styles.modeTitle, isSelected && styles.selectedModeText]}>{mode.title}</Text>
                  <Text style={styles.modeDesc}>{mode.desc}</Text>
                </View>
                {isSelected && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Category Selector */}
        <Text style={styles.sectionHeading}>Select Domain</Text>
        <View style={styles.categoryRow}>
          {["Economics", "Technology", "General Knowledge"].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, selectedCategory === cat && styles.selectedCategoryPill]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryPillText, selectedCategory === cat && styles.selectedCategoryText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Enter Arena Button */}
        <TouchableOpacity style={styles.enterButton} onPress={handleStartMatchmaking} activeOpacity={0.85}>
          <LinearGradient
            colors={["#8B5CF6", "#6D28D9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.enterGradient}
          >
            <Text style={styles.enterButtonText}>SEARCH FOR RIVAL</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  // 2. Matchmaking Radar Screen
  if (gameState === "MATCHMAKING") {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.radarRing}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
        <Text style={styles.searchingTitle}>Searching The Ring...</Text>
        <Text style={styles.searchingSubtitle}>
          Scanning players near {user?.rating || 1680} MMR in {selectedCategory}
        </Text>
        <View style={styles.matchParams}>
          <Text style={styles.paramItem}>Mode: {selectedMode.replace("_", " ")}</Text>
          <Text style={styles.paramItem}>•</Text>
          <Text style={styles.paramItem}>Speed Bonus Active</Text>
        </View>
      </View>
    );
  }

  // 3. Live Quiz Gameplay Screen
  if (gameState === "PLAYING" && matchData) {
    const currentQ = matchData.questions ? matchData.questions[currentQIndex] : matchData.currentQuestion;
    const myRank = liveLeaderboard.find((p) => p.userId === "usr_demo_1")?.currentRank || 1;
    const myScore = liveLeaderboard.find((p) => p.userId === "usr_demo_1")?.currentScore || 0;
    const opponent = liveLeaderboard.find((p) => p.userId !== "usr_demo_1");

    return (
      <View style={styles.gameContainer}>
        {/* Top Game Bar */}
        <View style={styles.gameTopBar}>
          <View style={styles.questionCounter}>
            <Text style={styles.questionCounterText}>
              QUESTION {currentQIndex + 1} / {matchData.totalQuestions || 5}
            </Text>
          </View>

          {/* Countdown Timer with color shift */}
          <View
            style={[
              styles.timerBadge,
              timeLeft <= 4 && styles.timerUrgent,
              timeLeft > 10 && styles.timerFresh,
            ]}
          >
            <Text style={styles.timerText}>{timeLeft.toFixed(1)}s</Text>
          </View>

          <View style={styles.liveScoreBadge}>
            <Text style={styles.liveScoreText}>{myScore} PTS</Text>
          </View>
        </View>

        {/* Live Head-to-Head Movement Bar */}
        <View style={styles.h2hBar}>
          <View style={styles.h2hPlayer}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" }}
              style={styles.h2hAvatar}
            />
            <View>
              <Text style={styles.h2hName}>You (#{myRank})</Text>
              <Text style={styles.h2hPts}>{myScore} pts</Text>
            </View>
          </View>

          <View style={styles.versusBadge}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          <View style={styles.h2hPlayerRight}>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.h2hName}>{opponent?.displayName || "Rohan V."}</Text>
              <Text style={styles.h2hPts}>{opponent?.currentScore || 0} pts</Text>
            </View>
            <Image
              source={{ uri: opponent?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" }}
              style={styles.h2hAvatar}
            />
          </View>
        </View>

        {/* Speed Bonus Indicator Callout */}
        <View style={styles.speedBonusRow}>
          <Text style={styles.speedBonusTag}>⚡ Answer within 2s for +80 Speed Bonus</Text>
          {answerResult && (
            <Text style={styles.streakMultiplierTag}>
              Streak: {answerResult?.scoreResult?.newStreak || 1} 🔥
            </Text>
          )}
        </View>

        {/* Question Box */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQ?.questionText}</Text>
        </View>

        {/* Options */}
        <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
          {currentQ?.options?.map((opt: any) => {
            const isSelected = selectedAnswerId === opt.id;
            const isCorrect = answerResult?.correctAnswers?.includes(opt.id);
            const isWrong = isSelected && !answerResult?.isCorrect;

            const optionStyles: any[] = [styles.optionItem];
            if (answerResult) {
              if (isCorrect) optionStyles.push(styles.optionCorrect);
              else if (isWrong) optionStyles.push(styles.optionWrong);
            } else if (isSelected) {
              optionStyles.push(styles.optionSelected);
            }

            return (
              <TouchableOpacity
                key={opt.id}
                style={optionStyles}
                onPress={() => handleSelectOption(opt.id)}
                activeOpacity={0.8}
                disabled={Boolean(selectedAnswerId)}
              >
                <View style={styles.optionLetterBadge}>
                  <Text style={styles.optionLetterText}>{opt.id}</Text>
                </View>
                <Text style={styles.optionContentText}>{opt.text}</Text>
                {answerResult && isCorrect && <Text style={styles.statusIcon}>✓</Text>}
                {answerResult && isWrong && <Text style={styles.statusIcon}>✗</Text>}
              </TouchableOpacity>
            );
          })}

          {/* Explanation Callout on answer */}
          {answerResult && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationTitle}>
                {answerResult.isCorrect
                  ? `🎉 Correct! +${answerResult.scoreResult.totalScore} pts (+${answerResult.scoreResult.speedBonus} speed bonus)`
                  : "❌ Incorrect"}
              </Text>
              <Text style={styles.explanationText}>{answerResult.explanation}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // 4. Results Screen (Section 18 & 19 of PRD)
  return (
    <View style={styles.resultsContainer}>
      <LinearGradient colors={["#1E1B4B", "#0F172A"]} style={styles.resultsCard}>
        <View style={styles.trophyGlow}>
          <Text style={styles.resultTrophy}>🏆</Text>
        </View>
        <Text style={styles.victoryTitle}>VICTORY!</Text>
        <Text style={styles.rankAchieved}>Rank #1 • Winner of The Ring</Text>

        <View style={styles.rewardGrid}>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardValue}>+280</Text>
            <Text style={styles.rewardLabel}>XP Earned</Text>
          </View>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardValue}>+45</Text>
            <Text style={styles.rewardLabel}>Coins Won</Text>
          </View>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardValue}>+18</Text>
            <Text style={styles.rewardLabel}>MMR Rating</Text>
          </View>
        </View>

        <View style={styles.statLine}>
          <Text style={styles.statLineLabel}>Final Score:</Text>
          <Text style={styles.statLineVal}>480 PTS</Text>
        </View>
        <View style={styles.statLine}>
          <Text style={styles.statLineLabel}>Accuracy:</Text>
          <Text style={styles.statLineVal}>80%</Text>
        </View>
        <View style={styles.statLine}>
          <Text style={styles.statLineLabel}>Max Answer Streak:</Text>
          <Text style={styles.statLineVal}>4 Consecutive 🔥</Text>
        </View>

        <TouchableOpacity style={styles.playAgainButton} onPress={handleStartMatchmaking} activeOpacity={0.85}>
          <Text style={styles.playAgainText}>PLAY NEXT MATCH</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backLobbyButton} onPress={() => setGameState("LOBBY")}>
          <Text style={styles.backLobbyText}>Return to Lobby</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  lobbyHeader: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  lobbyTitle: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
  },
  lobbySubtitle: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  mmrCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    marginBottom: theme.spacing.lg,
  },
  mmrHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mmrLabel: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  archetypePill: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  archetypeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  mmrScore: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginVertical: 4,
  },
  mmrTier: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  sectionHeading: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: theme.spacing.sm,
  },
  modesContainer: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  selectedModeCard: {
    borderColor: theme.colors.primary,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  modeIcon: {
    fontSize: 22,
    marginRight: theme.spacing.md,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  selectedModeText: {
    color: theme.colors.primary,
  },
  modeDesc: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  checkIcon: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  categoryRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  categoryPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    alignItems: "center",
  },
  selectedCategoryPill: {
    borderColor: theme.colors.accentGold,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
  },
  categoryPillText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
  },
  selectedCategoryText: {
    color: theme.colors.accentGold,
    fontWeight: "800",
  },
  enterButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
  },
  enterGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  enterButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xl,
  },
  radarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  searchingTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  searchingSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  matchParams: {
    flexDirection: "row",
    gap: 8,
  },
  paramItem: {
    color: theme.colors.accentGold,
    fontSize: 11,
    fontWeight: "700",
  },
  gameContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  gameTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  questionCounter: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  questionCounterText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "800",
  },
  timerBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: "#10B981",
  },
  timerFresh: {
    borderColor: "#10B981",
  },
  timerUrgent: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderColor: "#EF4444",
  },
  timerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
  },
  liveScoreBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  liveScoreText: {
    color: theme.colors.accentGold,
    fontSize: 12,
    fontWeight: "800",
  },
  h2hBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginBottom: theme.spacing.sm,
  },
  h2hPlayer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  h2hPlayerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  h2hAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  h2hName: {
    color: theme.colors.textPrimary,
    fontSize: 11,
    fontWeight: "700",
  },
  h2hPts: {
    color: theme.colors.accentGold,
    fontSize: 10,
    fontWeight: "800",
  },
  versusBadge: {
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vsText: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "900",
  },
  speedBonusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  speedBonusTag: {
    color: theme.colors.accentCyan,
    fontSize: 10,
    fontWeight: "700",
  },
  streakMultiplierTag: {
    color: theme.colors.accentGold,
    fontSize: 10,
    fontWeight: "800",
  },
  questionCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginBottom: theme.spacing.md,
  },
  questionText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  optionsList: {
    flex: 1,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginBottom: theme.spacing.sm,
  },
  optionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
  },
  optionCorrect: {
    borderColor: theme.colors.correct,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  optionWrong: {
    borderColor: theme.colors.incorrect,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  optionLetterBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  optionLetterText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
  },
  optionContentText: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  statusIcon: {
    fontSize: 16,
    fontWeight: "900",
    color: "#fff",
    marginLeft: 8,
  },
  explanationBox: {
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  explanationTitle: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },
  explanationText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: "center",
  },
  resultsCard: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  trophyGlow: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  resultTrophy: {
    fontSize: 36,
  },
  victoryTitle: {
    color: theme.colors.accentGold,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1,
  },
  rankAchieved: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
    marginBottom: theme.spacing.lg,
  },
  rewardGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
  },
  rewardItem: {
    flex: 1,
    alignItems: "center",
  },
  rewardValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  rewardLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  statLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  statLineLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  statLineVal: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
  playAgainButton: {
    backgroundColor: theme.colors.primary,
    width: "100%",
    paddingVertical: 14,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    marginTop: theme.spacing.xl,
  },
  playAgainText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  backLobbyButton: {
    marginTop: theme.spacing.md,
    paddingVertical: 8,
  },
  backLobbyText: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
});
