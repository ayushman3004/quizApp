import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme";
import { QuizVerseAPI } from "../services/api";

export const JourneyScreen: React.FC = () => {
  const [journeyData, setJourneyData] = useState<any[]>([]);
  const [activeSubjectIndex, setActiveSubjectIndex] = useState<number>(0);
  const [practiceCompleted, setPracticeCompleted] = useState<string | null>(null);

  useEffect(() => {
    QuizVerseAPI.getJourney().then((res) => {
      if (res?.subjects?.length) {
        setJourneyData(res.subjects);
      }
    });
  }, []);

  const subjects = journeyData.length
    ? journeyData
    : [
        {
          id: "subj_econ",
          title: "Economics & Finance",
          icon: "📈",
          progressPercent: 68,
          topics: [
            {
              id: "top_macro",
              title: "Macroeconomics Core",
              lessons: [
                { id: "l1", title: "Demand & Supply Elasticity", completed: true, mastery: 95, weakAreas: [] },
                { id: "l2", title: "Market Structures & Oligopoly", completed: true, mastery: 88, weakAreas: [] },
                { id: "l3", title: "National Income Accounting", completed: true, mastery: 82, weakAreas: ["GNP Deflator"] },
              ],
            },
            {
              id: "top_banking",
              title: "Money & Banking",
              lessons: [
                { id: "l4", title: "Money & Banking Foundations", completed: true, mastery: 85, weakAreas: [] },
                { id: "l5", title: "Monetary Policy & Repo Mechanics", completed: false, mastery: 60, weakAreas: ["Open Market Operations"] },
                { id: "l6", title: "Fiscal Policy & Deficit Financing", completed: false, mastery: 30, weakAreas: ["Primary Deficit"] },
              ],
            },
          ],
        },
        {
          id: "subj_comp",
          title: "Competitive Exams (UPSC)",
          icon: "🏛️",
          progressPercent: 42,
          topics: [
            {
              id: "top_polity",
              title: "Indian Polity & Constitution",
              lessons: [
                { id: "l7", title: "Preamble & Fundamental Rights", completed: true, mastery: 90, weakAreas: [] },
                { id: "l8", title: "Parliamentary Procedures & Bills", completed: false, mastery: 45, weakAreas: ["Financial Bills"] },
              ],
            },
          ],
        },
      ];

  const currentSubject = subjects[activeSubjectIndex] || subjects[0];

  const handleStartPractice = (lessonTitle: string) => {
    setPracticeCompleted(`Targeted drill complete for "${lessonTitle}"! +120 XP earned & mastery updated to 85%.`);
    setTimeout(() => {
      setPracticeCompleted(null);
    }, 4000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>JOURNEY</Text>
        <Text style={styles.screenSubtitle}>Structured Learning Paths & Weak Area Remediation</Text>
      </View>

      {/* Notification Banner when drill complete */}
      {practiceCompleted && (
        <View style={styles.toastBanner}>
          <Text style={styles.toastText}>🎉 {practiceCompleted}</Text>
        </View>
      )}

      {/* Subject Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectScroll}>
        {subjects.map((subj, idx) => {
          const isActive = activeSubjectIndex === idx;
          return (
            <TouchableOpacity
              key={subj.id || idx}
              style={[styles.subjectTab, isActive && styles.activeSubjectTab]}
              onPress={() => setActiveSubjectIndex(idx)}
              activeOpacity={0.8}
            >
              <Text style={styles.subjectIcon}>{subj.icon}</Text>
              <Text style={[styles.subjectTabTitle, isActive && styles.activeSubjectTabTitle]}>{subj.title}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Progress & Weak Area Diagnostic Card */}
      <LinearGradient colors={["#1E293B", "#0F172A"]} style={styles.progressCard}>
        <View style={styles.progressCardHeader}>
          <Text style={styles.progressCardTitle}>{currentSubject.title}</Text>
          <Text style={styles.progressCardPercent}>{currentSubject.progressPercent}% Mastered</Text>
        </View>

        {/* Bar */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${currentSubject.progressPercent}%` }]} />
        </View>

        {/* Identified Weak Area Callout */}
        <View style={styles.weakAreaCallout}>
          <Text style={styles.weakAreaIcon}>⚠️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.weakAreaTitle}>Identified Weak Area:</Text>
            <Text style={styles.weakAreaDesc}>Open Market Operations (Monetary Policy) — 60% accuracy</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Topics & Lessons Tree */}
      <Text style={styles.sectionHeading}>Learning Path Curriculum</Text>
      {currentSubject.topics?.map((topic: any, tIdx: number) => (
        <View key={topic.id || tIdx} style={styles.topicBlock}>
          <View style={styles.topicHeader}>
            <View style={styles.topicNumber}>
              <Text style={styles.topicNumberText}>{tIdx + 1}</Text>
            </View>
            <Text style={styles.topicTitle}>{topic.title}</Text>
          </View>

          {topic.lessons?.map((lesson: any, lIdx: number) => (
            <View key={lesson.id || lIdx} style={styles.lessonCard}>
              <View style={styles.lessonStatusCol}>
                <View style={[styles.statusBullet, lesson.completed && styles.statusBulletDone]}>
                  <Text style={styles.bulletText}>{lesson.completed ? "✓" : "○"}</Text>
                </View>
                {lIdx < topic.lessons.length - 1 && <View style={styles.connectingLine} />}
              </View>

              <View style={styles.lessonContent}>
                <View style={styles.lessonInfoRow}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.masteryText}>{lesson.mastery}%</Text>
                </View>

                {lesson.weakAreas && lesson.weakAreas.length > 0 ? (
                  <View style={styles.weakBadgeRow}>
                    <Text style={styles.weakBadgeText}>Needs Review: {lesson.weakAreas.join(", ")}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={[styles.practiceButton, lesson.completed && styles.practiceButtonReplay]}
                  onPress={() => handleStartPractice(lesson.title)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.practiceButtonText}>
                    {lesson.completed ? "Practice Again (+50 XP)" : "Start Lesson & Quiz"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}

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
  toastBanner: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: "#10B981",
    marginBottom: theme.spacing.md,
  },
  toastText: {
    color: "#34D399",
    fontSize: 12,
    fontWeight: "700",
  },
  subjectScroll: {
    marginHorizontal: -theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  subjectTab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginRight: theme.spacing.sm,
  },
  activeSubjectTab: {
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderColor: theme.colors.primary,
  },
  subjectIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  subjectTabTitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  activeSubjectTabTitle: {
    color: theme.colors.primary,
    fontWeight: "800",
  },
  progressCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginBottom: theme.spacing.lg,
  },
  progressCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  progressCardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  progressCardPercent: {
    color: theme.colors.accentEmerald,
    fontSize: 12,
    fontWeight: "800",
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: theme.spacing.md,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.accentEmerald,
    borderRadius: 4,
  },
  weakAreaCallout: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  weakAreaIcon: {
    fontSize: 18,
    marginRight: theme.spacing.sm,
  },
  weakAreaTitle: {
    color: theme.colors.accentGold,
    fontSize: 11,
    fontWeight: "800",
  },
  weakAreaDesc: {
    color: theme.colors.textPrimary,
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeading: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: theme.spacing.md,
  },
  topicBlock: {
    marginBottom: theme.spacing.lg,
  },
  topicHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  topicNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  topicNumberText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  topicTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "800",
  },
  lessonCard: {
    flexDirection: "row",
    marginBottom: theme.spacing.sm,
  },
  lessonStatusCol: {
    alignItems: "center",
    width: 28,
  },
  statusBullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBulletDone: {
    backgroundColor: theme.colors.accentEmerald,
    borderColor: theme.colors.accentEmerald,
  },
  bulletText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  connectingLine: {
    flex: 1,
    width: 2,
    backgroundColor: theme.colors.surfaceBorder,
    marginVertical: 4,
  },
  lessonContent: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    marginLeft: theme.spacing.xs,
  },
  lessonInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  lessonTitle: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  masteryText: {
    color: theme.colors.accentEmerald,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 8,
  },
  weakBadgeRow: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  weakBadgeText: {
    color: "#F87171",
    fontSize: 10,
    fontWeight: "700",
  },
  practiceButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    marginTop: 4,
  },
  practiceButtonReplay: {
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  practiceButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
});
