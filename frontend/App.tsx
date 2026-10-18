import React, { useState, useEffect } from "react";
import { StyleSheet, View, StatusBar, Modal, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { theme } from "./src/theme";
import { HeaderBar } from "./src/components/HeaderBar";
import { Navbar, TabName } from "./src/components/Navbar";
import { AuthModal } from "./src/components/AuthModal";
import { HomeScreen } from "./src/screens/HomeScreen";
import { RingScreen } from "./src/screens/RingScreen";
import { JourneyScreen } from "./src/screens/JourneyScreen";
import { CreatorsScreen } from "./src/screens/CreatorsScreen";
import { LeaderboardScreen } from "./src/screens/LeaderboardScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { QuizVerseAPI } from "./src/services/api";

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabName>("HOME");
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [user, setUser] = useState<any>({
    username: "AyaanMaster",
    displayName: "Ayaan B.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 1680,
    xp: 18450,
    level: 11,
    coins: 840,
    streak: 21,
    longestStreak: 21,
    accuracy: 84.2,
    matchesPlayed: 342,
    matchesWon: 218,
    bestAnswerStreak: 17,
    totalQuestionsAnswered: 6842,
    archetype: "STRATEGIST",
  });

  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  useEffect(() => {
    QuizVerseAPI.getProfile().then((res) => {
      if (res?.user) {
        setUser(res.user);
      }
    });
  }, []);

  const handleLogout = () => {
    QuizVerseAPI.logout();
    setUser({
      username: "GuestPlayer",
      displayName: "Guest Player",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/png?seed=Guest",
      rating: 1200,
      xp: 0,
      level: 1,
      coins: 100,
      streak: 1,
      longestStreak: 1,
      accuracy: 0,
      matchesPlayed: 0,
      matchesWon: 0,
      archetype: "UNRANKED",
    });
    setShowAuthModal(true);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <StatusBar barStyle="light-content" />

        {/* Global Top App Bar */}
        <HeaderBar
          user={user}
          onNotificationsPress={() => setShowNotifications(true)}
          onAuthPress={() => setShowAuthModal(true)}
        />

        {/* Screen View */}
        <View style={styles.mainContent}>
          {currentTab === "HOME" && (
            <HomeScreen
              user={user}
              onStartQuickBattle={() => setCurrentTab("RING")}
              onOpenJourney={() => setCurrentTab("JOURNEY")}
              onOpenRing={() => setCurrentTab("RING")}
              onOpenLeaderboard={() => setCurrentTab("LEADERBOARD")}
            />
          )}

          {currentTab === "RING" && (
            <RingScreen user={user} onBackToHome={() => setCurrentTab("HOME")} />
          )}

          {currentTab === "JOURNEY" && <JourneyScreen />}

          {currentTab === "CREATORS" && <CreatorsScreen />}

          {currentTab === "LEADERBOARD" && <LeaderboardScreen />}

          {currentTab === "PROFILE" && (
            <ProfileScreen
              user={user}
              onOpenAuth={() => setShowAuthModal(true)}
              onLogout={handleLogout}
            />
          )}
        </View>

        {/* Global Bottom Navigation */}
        <Navbar currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />

        {/* Authentication & Profile Switching Modal */}
        <AuthModal
          visible={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(newUser) => setUser(newUser)}
        />

        {/* Actionable Notifications Modal (Section 55 PRD) */}
        <Modal visible={showNotifications} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Notifications</Text>
                <TouchableOpacity onPress={() => setShowNotifications(false)}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                {[
                  {
                    id: "n1",
                    title: "Rahul Sharma challenged you! ⚔️",
                    desc: "Monetary Policy & Macro: 'You scored 1,840. Can your friend beat you?'",
                    time: "2 hours ago",
                    action: "Play Challenge",
                  },
                  {
                    id: "n2",
                    title: "21-Day Streak at Risk! 🔥",
                    desc: "Complete 1 quick match in The Ring to keep your fire burning.",
                    time: "4 hours ago",
                    action: "Enter Ring",
                  },
                  {
                    id: "n3",
                    title: "Tournament Alert 🏆",
                    desc: "Daily Arena Cup #142 registration closes in 45 minutes.",
                    time: "Yesterday",
                    action: "Register",
                  },
                ].map((item) => (
                  <View key={item.id} style={styles.notifItem}>
                    <Text style={styles.notifTitle}>{item.title}</Text>
                    <Text style={styles.notifDesc}>{item.desc}</Text>
                    <View style={styles.notifFooter}>
                      <Text style={styles.notifTime}>{item.time}</Text>
                      <TouchableOpacity
                        style={styles.notifActionBtn}
                        onPress={() => {
                          setShowNotifications(false);
                          setCurrentTab("RING");
                        }}
                      >
                        <Text style={styles.notifActionText}>{item.action} →</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  mainContent: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
  modalCloseText: {
    color: theme.colors.textMuted,
    fontSize: 18,
    fontWeight: "800",
    padding: 4,
  },
  modalScroll: {
    marginBottom: theme.spacing.lg,
  },
  notifItem: {
    backgroundColor: theme.colors.surfaceLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  notifTitle: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 2,
  },
  notifDesc: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    marginBottom: theme.spacing.sm,
  },
  notifFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notifTime: {
    color: theme.colors.textMuted,
    fontSize: 10,
  },
  notifActionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  notifActionText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "800",
  },
});
