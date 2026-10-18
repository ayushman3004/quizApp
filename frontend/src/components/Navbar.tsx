import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../theme";

export type TabName = "HOME" | "RING" | "JOURNEY" | "CREATORS" | "LEADERBOARD" | "PROFILE";

interface NavbarProps {
  currentTab: TabName;
  onSelectTab: (tab: TabName) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { name: TabName; label: string; icon: string }[] = [
    { name: "HOME", label: "Home", icon: "⚡" },
    { name: "RING", label: "The Ring", icon: "⚔️" },
    { name: "JOURNEY", label: "Journey", icon: "🗺️" },
    { name: "CREATORS", label: "Creators", icon: "✍️" },
    { name: "LEADERBOARD", label: "Rankings", icon: "🏆" },
    { name: "PROFILE", label: "Profile", icon: "👤" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={() => onSelectTab(tab.name)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, isActive && styles.activeTabIcon]}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{tab.label}</Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceBorder,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    justifyContent: "space-around",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.md,
    position: "relative",
  },
  activeTabButton: {
    backgroundColor: "rgba(139, 92, 246, 0.12)",
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
    opacity: 0.6,
  },
  activeTabIcon: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "600",
  },
  activeTabLabel: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -6,
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
});
