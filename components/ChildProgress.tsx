import { formatRatioAsPercent } from "@/lib/formatLearning";
import { useProgressStore } from "@/store/progressStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import StateMessage from "./StateMessage";

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface ProgressSectionProps {
  childId: string;
  token: string;
}
const StatBox = ({
  label,
  value,
  subValue,
  icon,
  color,
}: {
  label: string;
  value: string;
  subValue: string;
  icon: IoniconsName;
  color: string;
}) => (
  <View style={styles.statBox}>
    <View style={[styles.iconCircle, { backgroundColor: `${color}33` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statSubValue}>{subValue}</Text>
  </View>
);
const ChildProgress = ({ childId, token }: ProgressSectionProps) => {
  const { analytics, dailyProgress, weeklyProgress, loadAllProgress, loading, error } =
    useProgressStore();

  useEffect(() => {
    if (childId && token) {
      void loadAllProgress(token, childId);
    }
  }, [childId, token, loadAllProgress]);
  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#0286FF"
        style={{ marginVertical: 40 }}
      />
    );

  if (error) {
    return (
      <StateMessage
        type="error"
        title="Learning progress could not load"
        message={error}
        actionLabel={token ? "Try again" : undefined}
        onAction={token ? () => void loadAllProgress(token, childId) : undefined}
      />
    );
  }

  const daily = analytics?.daily_summary ?? dailyProgress?.data;
  const weekly = analytics?.weekly_summary ?? weeklyProgress?.data;
  const toMinutes = (seconds: number = 0) => Math.floor(seconds / 60);
  if (!daily && !weekly) {
    return (
      <StateMessage
        title="No learning data yet"
        message="Progress will appear here after this child starts playing learning games."
      />
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <View style={styles.aiTitleRow}>
            <Ionicons name="sparkles" size={20} color="#0286FF" />
            <Text style={styles.aiTitle}>Learning narrative</Text>
          </View>
        </View>
        <View style={styles.aiContent}>
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationText}>
              {daily?.generated_explanation ||
                weekly?.generated_explanation ||
                "Upgrade to see personalized insights based on your child's learning patterns."}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.statsGrid}>
        <StatBox
          label="Accuracy"
          value={formatRatioAsPercent(daily?.accuracy)}
          subValue="Today's Score"
          icon="analytics"
          color="#10B981"
        />
        <StatBox
          label="Mastery"
          value={`${daily?.mastery_score ?? 0}%`}
          subValue="Skill Level"
          icon="trophy"
          color="#F59E0B"
        />
        <StatBox
          label="Time Spent"
          value={`${toMinutes(daily?.time_spent)}m`}
          subValue="Session Length"
          icon="time"
          color="#0286FF"
        />
        <StatBox
          label="Diversity"
          value={formatRatioAsPercent(daily?.skill_diversity)}
          subValue="Topic Range"
          icon="layers"
          color="#8B5CF6"
        />
      </View>
      <View style={styles.performanceCard}>
        <Text style={styles.sectionTitle}>Weekly Summary</Text>
        <View style={styles.weeklyRow}>
          <View style={styles.weeklyStat}>
            <Text style={styles.weeklyLabel}>Total Questions</Text>
            <Text style={styles.weeklyValue}>
              {weekly?.total_questions ?? 0}
            </Text>
          </View>
          <View style={styles.weeklyStat}>
            <Text style={styles.weeklyLabel}>Correct</Text>
            <Text style={[styles.weeklyValue, { color: "#10B981" }]}>
              {weekly?.correct_answers ?? 0}
            </Text>
          </View>
          <View style={styles.weeklyStat}>
            <Text style={styles.weeklyLabel}>Consistency</Text>
            <Text style={styles.weeklyValue}>{formatRatioAsPercent(weekly?.consistency)}</Text>
          </View>
        </View>

        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${weekly?.mastery_score ?? 0}%` },
            ]}
          />
        </View>
        <Text style={styles.progressNote}>Overall Weekly Mastery Progress</Text>
      </View>
    </View>
  );
};

export default ChildProgress;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1F1F39" },
  aiCard: {
    backgroundColor: "#26264A",
    borderRadius: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(2, 134, 255, 0.3)",
    overflow: "hidden",
  },
  aiCardExpanded: { borderColor: "#0286FF" },
  aiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  aiTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  aiTitle: { fontSize: 16, fontFamily: "Poppins-Bold", color: "#fff" },
  aiBadge: {
    backgroundColor: "rgba(2, 134, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiBadgeText: { color: "#0286FF", fontSize: 12, fontFamily: "Poppins-Bold" },
  aiContent: { paddingHorizontal: 18, paddingBottom: 18 },
  aiIntro: {
    fontSize: 13,
    color: "#9AA0C3",
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  statBox: {
    width: "48%",
    backgroundColor: "#26264A",
    borderRadius: 22,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  recommendationBox: {
    backgroundColor: "#1E1E38",
    padding: 14,
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: "#10B981",
  },
  recommendationText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Poppins-Regular",
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    marginTop: 2,
  },
  statSubValue: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#9AA0C3",
  },
  statValue: { color: "#fff", fontSize: 18, fontFamily: "Poppins-Bold" },

  weeklyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 20,
  },
  weeklyStat: { alignItems: "center" },
  weeklyLabel: { color: "#9AA0C3", fontSize: 12, marginBottom: 4 },
  weeklyValue: { color: "#fff", fontSize: 18, fontFamily: "Poppins-Bold" },

  progressNote: {
    color: "#9AA0C3",
    fontSize: 11,
    marginTop: 8,
    textAlign: "center",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#1E1E38",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#0286FF",
  },
  performanceCard: {
    backgroundColor: "#26264A",
    borderRadius: 22,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#fff",
    marginBottom: 10,
  },
});
