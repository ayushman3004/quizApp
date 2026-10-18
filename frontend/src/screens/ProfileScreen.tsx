import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme";

interface ProfileScreenProps {
  user: any;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onOpenAuth, onLogout }) => {
  const [activeTab, setActiveTab] = useState<"STATS" | "ACHIEVEMENTS" | "COIN_SHOP">("STATS");

  const achievements = [
    { id: "a1", title: "First Victory", icon: "🏆", desc: "Win your first battle in The Ring", unlocked: true },
    { id: "a2", title: "Speed Demon", icon: "⚡", desc: "Answer 5 questions under 2.0s", unlocked: true },
    { id: "a3", title: "Streak Master", icon: "🔥", desc: "Maintain a 15+ answer streak", unlocked: true },
    { id: "a4", title: "Polymath Scholar", icon: "📚", desc: "Achieve 80%+ accuracy across 3 domains", unlocked: true },
    { id: "a5", title: "Tournament Champion", icon: "👑", desc: "Win a Daily Arena or College Cup", unlocked: false },
  ];

  const cosmetics = [
    { id: "cos_1", title: "Neon Cyber Frame", price: 300, icon: "🔮", type: "Avatar Frame" },
    { id: "cos_2", title: "Golden Crown Emote", price: 150, icon: "👑", type: "Battle Emote" },
    { id: "cos_3", title: "Midnight OLED Theme", price: 500, icon: "🌑", type: "App Theme" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" }}
            style={styles.avatarImage}
          />
          <View style={styles.archetypeBadge}>
            <Text style={styles.archetypeBadgeText}>🧠 {user?.archetype || "STRATEGIST"}</Text>
          </View>
        </View>

        <Text style={styles.displayName}>{user?.displayName || "Ayaan B."}</Text>
        <Text style={styles.usernameHandle}>@{user?.username || "AyaanMaster"}</Text>
        <Text style={styles.userBio}>
          Competitive Quizzer • IIT Bombay • Prepping for UPSC & Tech Olympiad
        </Text>
      </View>

      {/* Streak Highlight Card */}
      <LinearGradient colors={["#D97706", "#78350F"]} style={styles.streakCard}>
        <View style={styles.streakContent}>
          <Text style={styles.streakFire}>🔥</Text>
          <View style={styles.streakTextCol}>
            <Text style={styles.streakCount}>{user?.streak || 21} DAY STREAK</Text>
            <Text style={styles.streakSub}>Longest Streak: {user?.longestStreak || 21} Days • Keep it burning!</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Profile Sub Tabs */}
      <View style={styles.subTabRow}>
        <TouchableOpacity
          style={[styles.subTabButton, activeTab === "STATS" && styles.activeSubTab]}
          onPress={() => setActiveTab("STATS")}
        >
          <Text style={[styles.subTabText, activeTab === "STATS" && styles.activeSubTabText]}>Statistics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subTabButton, activeTab === "ACHIEVEMENTS" && styles.activeSubTab]}
          onPress={() => setActiveTab("ACHIEVEMENTS")}
        >
          <Text style={[styles.subTabText, activeTab === "ACHIEVEMENTS" && styles.activeSubTabText]}>Badges</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subTabButton, activeTab === "COIN_SHOP" && styles.activeSubTab]}
          onPress={() => setActiveTab("COIN_SHOP")}
        >
          <Text style={[styles.subTabText, activeTab === "COIN_SHOP" && styles.activeSubTabText]}>Cosmetics Shop</Text>
        </TouchableOpacity>
      </View>

      {/* Tab: STATS (Section 45 PRD) */}
      {activeTab === "STATS" && (
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statBoxNumber}>{user?.matchesPlayed || 342}</Text>
            <Text style={styles.statBoxLabel}>Matches Played</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxNumber}>{user?.matchesWon || 218}</Text>
            <Text style={styles.statBoxLabel}>Matches Won</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxNumber}>{user?.accuracy || "84.2"}%</Text>
            <Text style={styles.statBoxLabel}>Overall Accuracy</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxNumber}>{user?.totalQuestionsAnswered?.toLocaleString() || "6,842"}</Text>
            <Text style={styles.statBoxLabel}>Questions Answered</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxNumber}>{user?.bestAnswerStreak || 17}</Text>
            <Text style={styles.statBoxLabel}>Best Answer Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxNumber}>{user?.rating || 1680} MMR</Text>
            <Text style={styles.statBoxLabel}>Competitive Rating</Text>
          </View>
        </View>
      )}

      {/* Tab: ACHIEVEMENTS */}
      {activeTab === "ACHIEVEMENTS" && (
        <View style={styles.achievementsList}>
          {achievements.map((a) => (
            <View key={a.id} style={[styles.achievementCard, !a.unlocked && styles.lockedCard]}>
              <Text style={styles.achievementIcon}>{a.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{a.title}</Text>
                <Text style={styles.achievementDesc}>{a.desc}</Text>
              </View>
              <Text style={styles.unlockedBadge}>{a.unlocked ? "UNLOCKED" : "LOCKED"}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Tab: COIN SHOP */}
      {activeTab === "COIN_SHOP" && (
        <View style={styles.shopContainer}>
          <View style={styles.shopBalanceCard}>
            <Text style={styles.shopBalanceLabel}>AVAILABLE COIN BALANCE</Text>
            <Text style={styles.shopBalanceVal}>🪙 {user?.coins || 840} Coins</Text>
          </View>
          {cosmetics.map((c) => (
            <View key={c.id} style={styles.cosmeticCard}>
              <Text style={styles.cosmeticIcon}>{c.icon}</Text>
              <View style={styles.cosmeticInfo}>
                <Text style={styles.cosmeticTitle}>{c.title}</Text>
                <Text style={styles.cosmeticType}>{c.type}</Text>
              </View>
              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>🪙 {c.price}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Account & Auth Management Card */}
      <View style={styles.accountCard}>
        <View style={styles.accountCardHeader}>
          <Text style={styles.accountCardTitle}>ACCOUNT & SECURITY</Text>
          <Text style={styles.accountStatusBadge}>
            {user?.role === "USER" ? "AUTHENTICATED" : user?.role || "ACTIVE"}
          </Text>
        </View>
        <Text style={styles.accountCardDesc}>
          Signed in as {user?.email || `${user?.username}@quizverse.io`}
        </Text>
        <View style={styles.accountActionsRow}>
          <TouchableOpacity style={styles.switchAccountBtn} onPress={onOpenAuth} activeOpacity={0.8}>
            <Text style={styles.switchAccountBtnText}>Switch / Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

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
  profileHeader: {
    alignItems: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: theme.spacing.sm,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  archetypeBadge: {
    position: "absolute",
    bottom: -6,
    alignSelf: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  archetypeBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },
  displayName: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  usernameHandle: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  userBio: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: theme.spacing.lg,
  },
  streakCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  streakContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakFire: {
    fontSize: 28,
    marginRight: theme.spacing.md,
  },
  streakTextCol: {
    flex: 1,
  },
  streakCount: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  streakSub: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 11,
    marginTop: 2,
  },
  subTabRow: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 4,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  subTabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: theme.borderRadius.md,
  },
  activeSubTab: {
    backgroundColor: theme.colors.primary,
  },
  subTabText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
  },
  activeSubTabText: {
    color: "#fff",
    fontWeight: "800",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  statBox: {
    width: "48%",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    alignItems: "center",
  },
  statBoxNumber: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
  statBoxLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
  },
  achievementsList: {
    gap: theme.spacing.sm,
  },
  achievementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  lockedCard: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "800",
  },
  achievementDesc: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  unlockedBadge: {
    color: theme.colors.accentEmerald,
    fontSize: 10,
    fontWeight: "800",
  },
  shopContainer: {
    gap: theme.spacing.sm,
  },
  shopBalanceCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  shopBalanceLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
  },
  shopBalanceVal: {
    color: theme.colors.accentGold,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2,
  },
  cosmeticCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  cosmeticIcon: {
    fontSize: 22,
    marginRight: theme.spacing.md,
  },
  cosmeticInfo: {
    flex: 1,
  },
  cosmeticTitle: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  cosmeticType: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  buyButton: {
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  buyButtonText: {
    color: theme.colors.accentGold,
    fontSize: 11,
    fontWeight: "800",
  },
  accountCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  accountCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  accountCardTitle: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  accountStatusBadge: {
    color: theme.colors.accentEmerald,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    fontSize: 9,
    fontWeight: "800",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  accountCardDesc: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: theme.spacing.md,
  },
  accountActionsRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  switchAccountBtn: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  switchAccountBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  logoutBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  logoutBtnText: {
    color: theme.colors.accentRose,
    fontSize: 12,
    fontWeight: "700",
  },
});
