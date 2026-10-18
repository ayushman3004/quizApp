import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme";

interface HomeScreenProps {
  onStartQuickBattle: () => void;
  onOpenJourney: () => void;
  onOpenRing: () => void;
  onOpenLeaderboard: () => void;
  user: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartQuickBattle,
  onOpenJourney,
  onOpenRing,
  onOpenLeaderboard,
  user,
}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1-Click Quick Battle Hero Card */}
      <View style={styles.heroSection}>
        <LinearGradient
          colors={["#7C3AED", "#4C1D95"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroContent}>
            <View style={styles.liveTag}>
              <View style={styles.livePulse} />
              <Text style={styles.liveTagText}>THE RING • LIVE ARENA</Text>
            </View>
            <Text style={styles.heroTitle}>Quick Battle 1v1</Text>
            <Text style={styles.heroSubtitle}>
              Match with rivals at your MMR rating ({user?.rating || 1680}). Server authoritative scoring with speed bonuses!
            </Text>

            <TouchableOpacity style={styles.battleButton} onPress={onStartQuickBattle} activeOpacity={0.85}>
              <LinearGradient
                colors={["#F59E0B", "#D97706"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.battleButtonGradient}
              >
                <Text style={styles.battleButtonIcon}>⚔️</Text>
                <Text style={styles.battleButtonText}>ENTER THE RING NOW</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Daily Challenge & Continue Journey Row */}
      <View style={styles.cardRow}>
        {/* Daily Challenge */}
        <TouchableOpacity style={styles.halfCard} onPress={onStartQuickBattle} activeOpacity={0.8}>
          <LinearGradient colors={["#1E293B", "#0F172A"]} style={styles.halfCardGradient}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>⚡</Text>
              <Text style={styles.badgeOrange}>+150 XP</Text>
            </View>
            <Text style={styles.cardTitle}>Daily Challenge</Text>
            <Text style={styles.cardDesc}>5 Special questions • Resets at 00:00</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.actionLink}>Play Today →</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Continue Journey */}
        <TouchableOpacity style={styles.halfCard} onPress={onOpenJourney} activeOpacity={0.8}>
          <LinearGradient colors={["#1E293B", "#0F172A"]} style={styles.halfCardGradient}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🗺️</Text>
              <Text style={styles.badgeGreen}>68% Done</Text>
            </View>
            <Text style={styles.cardTitle}>Continue Journey</Text>
            <Text style={styles.cardDesc}>Economics: Monetary Policy & Repo</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.actionLink}>Resume Track →</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Competitive Stats Banner */}
      <View style={styles.statsBanner}>
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>{user?.rating || 1680}</Text>
          <Text style={styles.statLabel}>MMR Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>{user?.accuracy || "84.2"}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>{user?.matchesWon || 218}</Text>
          <Text style={styles.statLabel}>Victories</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>{user?.archetype || "STRATEGIST"}</Text>
          <Text style={styles.statLabel}>Archetype</Text>
        </View>
      </View>

      {/* Trending Quizzes Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔥 Trending Quizzes</Text>
        <TouchableOpacity onPress={onOpenRing}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {/* Quiz 1 */}
        <TouchableOpacity style={styles.quizCard} onPress={onStartQuickBattle} activeOpacity={0.85}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&auto=format&fit=crop&q=80" }}
            style={styles.quizCover}
          />
          <View style={styles.quizDetails}>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>ECONOMICS</Text>
            </View>
            <Text style={styles.quizTitle}>Monetary Policy & Macro Economics</Text>
            <Text style={styles.creatorName}>By Rahul Sharma (Quiz Master)</Text>
            <View style={styles.quizMeta}>
              <Text style={styles.metaItem}>⭐ 4.9</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaItem}>12.8k Plays</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quiz 2 */}
        <TouchableOpacity style={styles.quizCard} onPress={onStartQuickBattle} activeOpacity={0.85}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80" }}
            style={styles.quizCover}
          />
          <View style={styles.quizDetails}>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>TECHNOLOGY</Text>
            </View>
            <Text style={styles.quizTitle}>AI Architectures & Transformers</Text>
            <Text style={styles.creatorName}>By Dr. Priya Nair</Text>
            <View style={styles.quizMeta}>
              <Text style={styles.metaItem}>⭐ 4.8</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaItem}>9.4k Plays</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Upcoming Tournament Banner */}
      <TouchableOpacity style={styles.tournamentBanner} onPress={onOpenLeaderboard} activeOpacity={0.85}>
        <LinearGradient
          colors={["#0F766E", "#115E59"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tournamentGradient}
        >
          <View style={styles.tournamentContent}>
            <View style={styles.trophyIconContainer}>
              <Text style={styles.trophyIcon}>🏆</Text>
            </View>
            <View style={styles.tournamentInfo}>
              <Text style={styles.tournamentSubtitle}>UPCOMING TOURNAMENT</Text>
              <Text style={styles.tournamentTitle}>QuizVerse Daily Arena Cup #142</Text>
              <Text style={styles.tournamentReward}>Prize Pool: 5,000 Coins • Starts in 2h</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  heroSection: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
  },
  heroCard: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
  },
  heroContent: {
    alignItems: "flex-start",
  },
  liveTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.sm,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  liveTagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 4,
  },
  heroSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: theme.spacing.lg,
  },
  battleButton: {
    width: "100%",
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  battleButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.lg,
  },
  battleButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  battleButtonText: {
    color: "#1E1B4B",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  cardRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  halfCard: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
  },
  halfCardGradient: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  cardIcon: {
    fontSize: 20,
  },
  badgeOrange: {
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    color: theme.colors.accentGold,
    fontSize: 10,
    fontWeight: "800",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeGreen: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    color: theme.colors.accentEmerald,
    fontSize: 10,
    fontWeight: "800",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },
  cardDesc: {
    color: theme.colors.textMuted,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: theme.spacing.sm,
  },
  cardFooter: {
    marginTop: "auto",
  },
  actionLink: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  statsBanner: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    marginTop: theme.spacing.md,
    alignItems: "center",
    justifyContent: "space-between",
  },
  statCol: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.surfaceBorder,
  },
  statNumber: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "800",
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  seeAllText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  horizontalScroll: {
    marginHorizontal: -theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  quizCard: {
    width: 240,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    overflow: "hidden",
    marginRight: theme.spacing.md,
  },
  quizCover: {
    width: "100%",
    height: 110,
  },
  quizDetails: {
    padding: theme.spacing.md,
  },
  tagPill: {
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  tagText: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: "800",
  },
  quizTitle: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  creatorName: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginBottom: 6,
  },
  quizMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaItem: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  metaDot: {
    color: theme.colors.textMuted,
    marginHorizontal: 6,
  },
  tournamentBanner: {
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
  },
  tournamentGradient: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
  },
  tournamentContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  trophyIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  trophyIcon: {
    fontSize: 22,
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  tournamentTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 1,
  },
  tournamentReward: {
    color: theme.colors.accentGold,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
});
