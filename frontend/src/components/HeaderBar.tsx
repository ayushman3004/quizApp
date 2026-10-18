import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { theme } from "../theme";

interface HeaderBarProps {
  user: {
    username: string;
    avatarUrl: string;
    level: number;
    coins: number;
    streak: number;
  };
  onNotificationsPress?: () => void;
  onAuthPress?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ user, onNotificationsPress, onAuthPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.userProfile} onPress={onAuthPress} activeOpacity={0.75}>
        <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.username}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>LVL {user.level}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.badgesRow}>
        {/* Streak */}
        <View style={styles.statPill}>
          <Text style={styles.pillIcon}>🔥</Text>
          <Text style={styles.streakText}>{user.streak}</Text>
        </View>

        {/* Coins */}
        <View style={styles.statPill}>
          <Text style={styles.pillIcon}>🪙</Text>
          <Text style={styles.coinsText}>{user.coins.toLocaleString()}</Text>
        </View>

        {/* Notifications */}
        <TouchableOpacity style={styles.bellButton} onPress={onNotificationsPress}>
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  userInfo: {
    marginLeft: theme.spacing.sm,
  },
  username: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  levelBadge: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  levelText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "800",
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  pillIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  streakText: {
    color: theme.colors.accentGold,
    fontSize: 12,
    fontWeight: "800",
  },
  coinsText: {
    color: theme.colors.accentGold,
    fontSize: 12,
    fontWeight: "800",
  },
  bellButton: {
    position: "relative",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  bellIcon: {
    fontSize: 14,
  },
  notificationDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accentRose,
  },
});
