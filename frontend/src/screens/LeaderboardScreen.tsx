import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme";
import { QuizVerseAPI } from "../services/api";

export const LeaderboardScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"COMPETITIVE" | "XP" | "STREAK" | "TOURNAMENTS">("COMPETITIVE");
  const [leaderboardList, setLeaderboardList] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [registeredMap, setRegisteredMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeTab === "TOURNAMENTS") {
      QuizVerseAPI.getTournaments().then((res) => {
        if (res?.tournaments?.length) setTournaments(res.tournaments);
      });
    } else {
      QuizVerseAPI.getLeaderboard(activeTab).then((res) => {
        if (res?.rankings?.length) setLeaderboardList(res.rankings);
      });
    }
  }, [activeTab]);

  const defaultRankings = [
    { rank: 1, username: "RahulSharmaQM", displayName: "Rahul Sharma", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", value: "2,150 MMR", badge: "Grandmaster", archetype: "SCHOLAR" },
    { rank: 2, username: "PriyaCurious", displayName: "Dr. Priya Nair", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", value: "1,980 MMR", badge: "Master", archetype: "SPECIALIST" },
    { rank: 3, username: "AyaanMaster", displayName: "Ayaan B. (You)", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", value: "1,680 MMR", badge: "Diamond III", archetype: "STRATEGIST" },
    { rank: 4, username: "Rohan_Pro", displayName: "Rohan Verma", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80", value: "1,640 MMR", badge: "Diamond II", archetype: "SPEEDSTER" },
    { rank: 5, username: "SnehaQuiz", displayName: "Sneha Sen", avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80", value: "1,520 MMR", badge: "Platinum I", archetype: "CLUTCHER" },
  ];

  const rankings = leaderboardList.length ? leaderboardList : defaultRankings;

  const handleRegisterTournament = (id: string) => {
    setRegisteredMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>RANKINGS & TOURNAMENTS</Text>
        <Text style={styles.screenSubtitle}>Global Competitive Ratings, Streaks & Brackets</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {[
          { id: "COMPETITIVE", label: "MMR Rating" },
          { id: "XP", label: "XP Legends" },
          { id: "STREAK", label: "Streaks 🔥" },
          { id: "TOURNAMENTS", label: "Tournaments 🏆" },
        ].map((t) => {
          const isActive = activeTab === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setActiveTab(t.id as any)}
            >
              <Text style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tournaments View */}
      {activeTab === "TOURNAMENTS" ? (
        <View style={styles.tournamentList}>
          {[
            {
              id: "t1",
              title: "QuizVerse Daily Arena Cup #142",
              type: "DAILY",
              prize: "5,000 COINS",
              fee: "50 Coins",
              startsIn: "Starts in 1h 45m",
              registered: 84,
              max: 128,
            },
            {
              id: "t2",
              title: "All-India Inter-College Knowledge Clash",
              type: "COLLEGE CHAMPIONSHIP",
              prize: "25,000 COINS",
              fee: "100 Coins",
              startsIn: "Starts in 2 Days",
              registered: 198,
              max: 256,
            },
          ].map((tourn) => {
            const isReg = registeredMap[tourn.id];
            return (
              <LinearGradient key={tourn.id} colors={["#1E293B", "#0F172A"]} style={styles.tournCard}>
                <View style={styles.tournHeader}>
                  <Text style={styles.tournTypeBadge}>{tourn.type}</Text>
                  <Text style={styles.tournStartsIn}>{tourn.startsIn}</Text>
                </View>
                <Text style={styles.tournTitle}>{tourn.title}</Text>
                <View style={styles.tournMetrics}>
                  <View style={styles.tournMetricCol}>
                    <Text style={styles.tournMetricLabel}>Prize Pool</Text>
                    <Text style={styles.tournPrizeText}>{tourn.prize}</Text>
                  </View>
                  <View style={styles.tournMetricCol}>
                    <Text style={styles.tournMetricLabel}>Entry Fee</Text>
                    <Text style={styles.tournFeeText}>{tourn.fee}</Text>
                  </View>
                  <View style={styles.tournMetricCol}>
                    <Text style={styles.tournMetricLabel}>Slots Filled</Text>
                    <Text style={styles.tournSlotsText}>
                      {tourn.registered + (isReg ? 1 : 0)} / {tourn.max}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.tournRegButton, isReg && styles.tournRegDoneButton]}
                  onPress={() => handleRegisterTournament(tourn.id)}
                  disabled={isReg}
                >
                  <Text style={styles.tournRegButtonText}>
                    {isReg ? "✓ Registered for Tournament" : `Register Now (${tourn.fee})`}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            );
          })}
        </View>
      ) : (
        /* Leaderboard View */
        <View style={styles.leaderboardSection}>
          {/* Top 3 Podium */}
          <View style={styles.podiumContainer}>
            {/* Rank 2 */}
            <View style={[styles.podiumItem, { marginTop: 20 }]}>
              <Text style={styles.podiumMedal}>🥈</Text>
              <Image source={{ uri: rankings[1]?.avatarUrl }} style={styles.podiumAvatar} />
              <Text style={styles.podiumName} numberOfLines={1}>
                {rankings[1]?.displayName}
              </Text>
              <Text style={styles.podiumVal}>{rankings[1]?.value}</Text>
            </View>

            {/* Rank 1 */}
            <View style={styles.podiumItem}>
              <Text style={styles.podiumMedalFirst}>👑</Text>
              <Image source={{ uri: rankings[0]?.avatarUrl }} style={[styles.podiumAvatar, styles.firstAvatar]} />
              <Text style={[styles.podiumName, { color: theme.colors.accentGold }]} numberOfLines={1}>
                {rankings[0]?.displayName}
              </Text>
              <Text style={styles.podiumVal}>{rankings[0]?.value}</Text>
            </View>

            {/* Rank 3 */}
            <View style={[styles.podiumItem, { marginTop: 30 }]}>
              <Text style={styles.podiumMedal}>🥉</Text>
              <Image source={{ uri: rankings[2]?.avatarUrl }} style={styles.podiumAvatar} />
              <Text style={styles.podiumName} numberOfLines={1}>
                {rankings[2]?.displayName}
              </Text>
              <Text style={styles.podiumVal}>{rankings[2]?.value}</Text>
            </View>
          </View>

          {/* List Remaining Ranks */}
          <View style={styles.rankList}>
            {rankings.map((r) => (
              <View key={r.rank} style={styles.rankItem}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankBadgeText}>{r.rank}</Text>
                </View>
                <Image source={{ uri: r.avatarUrl }} style={styles.rankAvatar} />
                <View style={styles.rankInfo}>
                  <Text style={styles.rankName}>{r.displayName}</Text>
                  <Text style={styles.rankBadgeDetail}>{r.badge || r.archetype}</Text>
                </View>
                <Text style={styles.rankScore}>{r.value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

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
  header: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  screenTitle: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: "900",
  },
  screenSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    padding: 4,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginBottom: theme.spacing.lg,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: theme.borderRadius.md,
  },
  activeTabButton: {
    backgroundColor: theme.colors.primary,
  },
  tabButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
  },
  activeTabButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  tournamentList: {
    gap: theme.spacing.md,
  },
  tournCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  tournHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  tournTypeBadge: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tournStartsIn: {
    color: theme.colors.accentGold,
    fontSize: 11,
    fontWeight: "700",
  },
  tournTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: theme.spacing.md,
  },
  tournMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  tournMetricCol: {
    flex: 1,
    alignItems: "center",
  },
  tournMetricLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
  },
  tournPrizeText: {
    color: theme.colors.accentGold,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  },
  tournFeeText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  tournSlotsText: {
    color: theme.colors.accentEmerald,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  tournRegButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  tournRegDoneButton: {
    backgroundColor: theme.colors.accentEmerald,
  },
  tournRegButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  leaderboardSection: {},
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginBottom: theme.spacing.lg,
  },
  podiumItem: {
    alignItems: "center",
    width: 90,
  },
  podiumMedal: {
    fontSize: 18,
    marginBottom: 4,
  },
  podiumMedalFirst: {
    fontSize: 22,
    marginBottom: 4,
  },
  podiumAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.surfaceBorder,
    marginBottom: 6,
  },
  firstAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderColor: theme.colors.accentGold,
  },
  podiumName: {
    color: theme.colors.textPrimary,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  podiumVal: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  rankList: {
    gap: theme.spacing.xs,
  },
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  rankBadgeText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "800",
  },
  rankAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: theme.spacing.sm,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  rankBadgeDetail: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 1,
  },
  rankScore: {
    color: theme.colors.accentGold,
    fontSize: 13,
    fontWeight: "800",
  },
});
