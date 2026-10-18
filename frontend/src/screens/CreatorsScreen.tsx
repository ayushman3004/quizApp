import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme";
import { QuizVerseAPI } from "../services/api";

export const CreatorsScreen: React.FC = () => {
  const [creators, setCreators] = useState<any[]>([]);
  const [followedMap, setFollowedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    QuizVerseAPI.getCreators().then((res) => {
      if (res?.creators?.length) {
        setCreators(res.creators);
      }
    });
  }, []);

  const creatorList = creators.length
    ? creators
    : [
        {
          id: "c1",
          username: "RahulSharmaQM",
          displayName: "Rahul Sharma (Quiz Master)",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          bio: "National Quiz Finalist & Economics Lead. Author of 42 high-intensity analytical quizzes on Substack and QuizVerse.",
          rating: 4.9,
          followersCount: 8420,
          totalPlays: 12842,
          totalQuizzes: 42,
          isVerified: true,
        },
        {
          id: "c2",
          username: "PriyaCurious",
          displayName: "Dr. Priya Nair",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          bio: "Neuroscience researcher & Science Olympiad curator. Designing visual and assertion-reason quizzes.",
          rating: 4.8,
          followersCount: 6150,
          totalPlays: 9420,
          totalQuizzes: 28,
          isVerified: true,
        },
      ];

  const toggleFollow = (id: string) => {
    setFollowedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>QUIZ MASTERS</Text>
        <Text style={styles.screenSubtitle}>Discover & Subscribe to Elite Quiz Creators (Substack Model)</Text>
      </View>

      {/* Creator Spotlight Banner */}
      <LinearGradient colors={["#4338CA", "#1E1B4B"]} style={styles.spotlightCard}>
        <View style={styles.spotlightHeader}>
          <Text style={styles.spotlightTag}>CREATOR SPOTLIGHT OF THE WEEK</Text>
          <Text style={styles.spotlightRating}>⭐ 4.9 / 5.0</Text>
        </View>
        <View style={styles.spotlightContent}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" }}
            style={styles.spotlightAvatar}
          />
          <View style={styles.spotlightInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.spotlightName}>Rahul Sharma</Text>
              <Text style={styles.verifiedBadge}>✓ Verified QM</Text>
            </View>
            <Text style={styles.spotlightBio}>
              Curator of &quot;Monetary Policy & Macro Economics&quot; with over 12,800 active challengers.
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Directory of Creators */}
      <Text style={styles.sectionHeading}>Featured Quiz Masters</Text>
      {creatorList.map((c) => {
        const isFollowed = followedMap[c.id];
        return (
          <View key={c.id} style={styles.creatorCard}>
            <View style={styles.creatorTopRow}>
              <Image source={{ uri: c.avatarUrl }} style={styles.creatorAvatar} />
              <View style={styles.creatorDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.creatorName}>{c.displayName}</Text>
                  {c.isVerified && <Text style={styles.verifiedIcon}>✓</Text>}
                </View>
                <Text style={styles.creatorHandle}>@{c.username}</Text>
              </View>

              <TouchableOpacity
                style={[styles.followButton, isFollowed && styles.followingButton]}
                onPress={() => toggleFollow(c.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.followButtonText, isFollowed && styles.followingButtonText]}>
                  {isFollowed ? "Following" : "Subscribe"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.creatorBio}>{c.bio}</Text>

            {/* Metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>
                  {((c.followersCount || 8400) + (isFollowed ? 1 : 0)).toLocaleString()}
                </Text>
                <Text style={styles.metricLabel}>Followers</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{c.totalQuizzes || 42}</Text>
                <Text style={styles.metricLabel}>Quizzes</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{(c.totalPlays || 12800).toLocaleString()}</Text>
                <Text style={styles.metricLabel}>Players</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>⭐ {c.rating?.toFixed(1) || "4.9"}</Text>
                <Text style={styles.metricLabel}>Rating</Text>
              </View>
            </View>
          </View>
        );
      })}

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
  spotlightCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.4)",
    marginBottom: theme.spacing.lg,
  },
  spotlightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  spotlightTag: {
    color: theme.colors.accentGold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  spotlightRating: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  spotlightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  spotlightAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginRight: theme.spacing.md,
  },
  spotlightInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  spotlightName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    marginRight: 6,
  },
  verifiedBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    color: "#34D399",
    fontSize: 9,
    fontWeight: "800",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  spotlightBio: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  sectionHeading: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: theme.spacing.md,
  },
  creatorCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginBottom: theme.spacing.md,
  },
  creatorTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  creatorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: theme.spacing.sm,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "800",
  },
  verifiedIcon: {
    color: theme.colors.accentCyan,
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 4,
  },
  creatorHandle: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  followButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: theme.borderRadius.full,
  },
  followingButton: {
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  followingButtonText: {
    color: theme.colors.textSecondary,
  },
  creatorBio: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: theme.spacing.md,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: "800",
  },
  metricLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
});
